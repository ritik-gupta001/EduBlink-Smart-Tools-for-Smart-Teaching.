import os
import json
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from collections import defaultdict

from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx

load_dotenv()

app = FastAPI()

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting
rate_limit_store = defaultdict(lambda: {"count": 0, "reset_time": datetime.now()})

class GenerateRequest(BaseModel):
    tool: str
    inputs: Dict[str, Any]
    stream: bool = False

class HealthResponse(BaseModel):
    status: str
    model: str
    apiKeyConfigured: bool

def check_rate_limit(client_ip: str):
    now = datetime.now()
    data = rate_limit_store[client_ip]
    
    if now > data["reset_time"]:
        data["count"] = 1
        data["reset_time"] = now + timedelta(minutes=15)
        return None
    
    if data["count"] >= 100:
        return {"error": "Too many requests"}
    
    data["count"] += 1
    return None

@app.get("/api/health")
async def health():
    return HealthResponse(
        status="healthy",
        model=OPENAI_MODEL,
        apiKeyConfigured=bool(OPENAI_API_KEY and len(OPENAI_API_KEY) > 20)
    )

@app.post("/api/generate")
async def generate(request: Request):
    # Get raw body for debugging
    body = await request.json()
    print(f"\n>>> RAW REQUEST BODY: {body}")
    
    # Validate manually
    try:
        data = GenerateRequest(**body)
    except Exception as e:
        print(f">>> VALIDATION ERROR: {e}")
        raise HTTPException(400, detail=str(e))
    
    print(f">>> REQUEST: {data.tool}")
    print(f">>> INPUTS: {data.inputs}")
    
    # Rate limit
    if err := check_rate_limit(request.client.host):
        raise HTTPException(429, detail=err)
    
    # Check API key
    if not OPENAI_API_KEY or len(OPENAI_API_KEY) < 20:
        raise HTTPException(500, detail="API key not configured")
    
    # Tool prompts
    if data.tool == "mcq":
        system_prompt = "You are an expert educator."
        user_prompt = f"Create {data.inputs.get('count', 5)} multiple choice questions about {data.inputs.get('topic', 'science')} for {data.inputs.get('gradeLevel', 'high school')} students at {data.inputs.get('difficulty', 'medium')} difficulty. Return ONLY a JSON array like: [{{'id':1,'question':'text','options':['A','B','C','D'],'answerIndex':0,'explanation':'text'}}]"
        temp = 0.7
        tokens = 2000
    
    elif data.tool == "worksheet":
        system_prompt = "You are an expert educator creating worksheets."
        user_prompt = f"Create a worksheet about {data.inputs.get('topic', 'science')} for {data.inputs.get('gradeLevel', 'middle school')} with {data.inputs.get('count', 10)} questions. Return ONLY a JSON object like: {{'title':'Worksheet Title','instructions':'Complete all questions','questions':[{{'question':'text','type':'mcq|short-answer','options':['A','B','C','D'],'difficulty':'easy|medium|hard','points':1}}],'answerKey':[{{'answer':'text','explanation':'text'}}]}}"
        temp = 0.7
        tokens = 2500
    
    elif data.tool == "lessonplan":
        system_prompt = "You are an experienced teacher creating lesson plans."
        user_prompt = f"Create a detailed lesson plan about {data.inputs.get('topic', 'science')} for {data.inputs.get('gradeLevel', 'grade 8')} students, duration {data.inputs.get('duration', 45)} minutes, learning objectives: {data.inputs.get('objectives', 'general understanding')}. Return ONLY a JSON object like: {{'title':'text','duration':45,'objectives':['obj1'],'materials':['item1'],'activities':[{{'time':10,'activity':'text','description':'text'}}],'assessment':'text'}}"
        temp = 0.7
        tokens = 2500
    
    elif data.tool == "summarizer":
        system_prompt = "You are an expert at summarizing text concisely."
        user_prompt = f"Summarize this text in {data.inputs.get('bulletPoints', 5)} key bullet points: {data.inputs.get('text', '')}. Return ONLY a JSON object like: {{'summary':'brief overview','keyPoints':['point1','point2']}}"
        temp = 0.5
        tokens = 1500
    
    elif data.tool == "proofread":
        system_prompt = "You are an expert proofreader and editor."
        user_prompt = f"Proofread and correct this text: {data.inputs.get('text', '')}. Return ONLY a JSON object like: {{'original':'text','corrected':'text','corrections':[{{'type':'grammar|spelling|punctuation','original':'text','correction':'text','explanation':'text'}}]}}"
        temp = 0.3
        tokens = 2000
    
    elif data.tool == "ppt":
        system_prompt = "You are an expert at creating presentation outlines."
        user_prompt = f"Create a presentation outline about {data.inputs.get('topic', 'science')} with {data.inputs.get('slideCount', 8)} slides for {data.inputs.get('audience', 'students')}. Return ONLY a JSON object like: {{'title':'text','slides':[{{'slideNumber':1,'title':'text','content':['bullet1','bullet2'],'notes':'speaker notes'}}]}}"
        temp = 0.7
        tokens = 2500
    
    elif data.tool == "reportcard":
        system_prompt = "You are an experienced teacher writing thoughtful report card comments."
        user_prompt = f"Write {data.inputs.get('commentCount', 3)} report card comments for a student: {data.inputs.get('studentInfo', '')}. Focus on: {data.inputs.get('focus', 'overall performance')}. Return ONLY a JSON object like: {{'comments':[{{'category':'text','comment':'text','tone':'positive|constructive'}}]}}"
        temp = 0.7
        tokens = 1500
    
    elif data.tool == "essaygrader":
        system_prompt = """You are an expert essay grader with years of experience in academic writing assessment. 
You provide detailed, constructive feedback that helps students improve their writing.
Analyze essays thoroughly across multiple dimensions: thesis strength, argument development, evidence quality, 
organization, coherence, grammar, style, and critical thinking. Give specific, actionable feedback."""
        
        essay_text = data.inputs.get('essay', '')
        max_score = data.inputs.get('maxScore', 100)
        rubric = data.inputs.get('rubric', 'content, organization, grammar, critical thinking')
        
        user_prompt = f"""Carefully grade the following essay. Maximum score: {max_score}

RUBRIC CRITERIA: {rubric}

ESSAY TO GRADE:
{essay_text}

INSTRUCTIONS:
1. Read the entire essay carefully
2. Evaluate based on the rubric criteria
3. Assign a score that reflects the actual quality (avoid giving the same score repeatedly)
4. Identify 3-5 specific strengths with examples from the text
5. Identify 3-5 specific areas for improvement with concrete suggestions
6. Provide detailed grammar/style notes if applicable
7. Write an overall summary that ties everything together

Return ONLY a JSON object in this exact format:
{{
  "score": <number between 0 and {max_score}>,
  "grade": "<letter grade A-F>",
  "feedback": {{
    "strengths": ["specific strength 1 with example", "specific strength 2 with example", "specific strength 3"],
    "improvements": ["specific improvement 1 with actionable advice", "specific improvement 2 with suggestion", "specific improvement 3"],
    "grammar": "Detailed notes on grammar, punctuation, and style issues with specific examples",
    "overall": "Comprehensive summary of the essay's quality, main achievements, and key areas for growth"
  }}
}}"""
        temp = 0.3  # Lower temperature for more consistent, focused grading
        tokens = 2500
    
    elif data.tool == "textrewriter":
        system_prompt = "You are an expert writer skilled at rewriting text in different styles."
        user_prompt = f"Rewrite this text in {data.inputs.get('style', 'professional')} style with {data.inputs.get('tone', 'neutral')} tone for {data.inputs.get('audience', 'general')} audience at {data.inputs.get('length', 'similar')} length. Additional instructions: {data.inputs.get('additionalInstructions', 'none')}. Text: {data.inputs.get('text', '')}. Return ONLY a JSON object like: {{'variations':[{{'style':'text','rewrittenText':'text','notes':'text'}}]}}"
        temp = 0.8
        tokens = 2000
    
    else:
        raise HTTPException(400, detail=f"Unknown tool: {data.tool}")
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": OPENAI_MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": temp,
                    "max_tokens": tokens
                }
            )
        
        if resp.status_code != 200:
            print(f"OpenAI error: {resp.status_code}")
            print(resp.text)
            raise HTTPException(resp.status_code, detail="OpenAI API error")
        
        result = resp.json()
        content = result["choices"][0]["message"]["content"]
        
        print(f"OpenAI response content: {content[:200]}...")
        
        # Strip markdown code blocks if present
        if content.strip().startswith("```"):
            # Remove ```json or ``` from start and ``` from end
            lines = content.strip().split('\n')
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            content = '\n'.join(lines)
        
        # Parse JSON
        parsed = json.loads(content)
        
        print(f"<<< SUCCESS\n")
        
        return {
            "success": True,
            "tool": data.tool,
            "data": parsed,
            "model": OPENAI_MODEL
        }
        
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(500, detail=str(e))

# Static files MUST be last
app.mount("/", StaticFiles(directory="public", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = 3000
    print(f"\nEduBlink Server: http://localhost:{port}")
    print(f"API Key: {'OK' if OPENAI_API_KEY and len(OPENAI_API_KEY) > 20 else 'NOT SET'}\n")
    uvicorn.run(app, host="0.0.0.0", port=port)
