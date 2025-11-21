# EduBlink - Your AI Teaching Superpower 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-orange.svg)](https://openai.com/)

**EduBlink** is a production-ready, AI-powered educational content generator that empowers educators to create stunning, high-quality teaching materials in seconds. Built with modern web technologies and powered by OpenAI's advanced language models.

## ✨ Features

### 🎯 **9 Powerful AI Tools**

1. **📝 MCQ Generator** - Create intelligent multiple-choice questions with detailed explanations and varying difficulty levels
2. **📄 Worksheet Generator** - Generate comprehensive worksheets with answer keys, tailored to any grade level
3. **📚 Lesson Plan Creator** - Build detailed, structured lesson plans with objectives, activities, and assessments
4. **📊 Text Summarizer** - Transform lengthy texts into concise, organized bullet points
5. **✏️ Proof Reader** - Advanced grammar, spelling, and style checking with actionable suggestions
6. **🎨 PPT Generator** - Create professional presentation outlines with slide content and speaker notes
7. **💬 Report Card Comments** - Generate thoughtful, personalized student feedback comments
8. **📝 Essay Grader** - Intelligent essay grading with detailed rubrics, constructive feedback, and varied scoring
9. **🔄 Text Rewriter** - Transform text to match different styles, tones, and audiences

### 🎨 **Modern User Experience**

- **Beautiful Animated Hero** - Eye-catching logo with smooth animations (floating, rotating, sparkling effects)
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **Light & Dark Themes** - User-preferred theme with smooth transitions
- **Real-time Feedback** - Loading states, progress indicators, and toast notifications
- **Clean Interface** - Intuitive navigation with minimalist, accessible design
- **Interactive Results Panel** - Side panel with copy, download, and print functionality

### 🔒 **Production-Ready Features**

- ✅ Server-side API key management (secure)
- ✅ Rate limiting (100 requests per 15 minutes per IP)
- ✅ Comprehensive error handling and logging
- ✅ Input validation and sanitization
- ✅ Markdown code block parsing for AI responses
- ✅ CORS enabled for flexible deployment
- ✅ Graceful degradation and fallback handling

## 🚀 Quick Start

### Prerequisites

- **Python 3.8 or higher** ([Download](https://www.python.org/downloads/))
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Git** (optional, for cloning)

### Installation

1. **Clone or download this project**
   ```bash
   git clone https://github.com/ritik-gupta001/EduBlink.git
   cd EduBlink
   ```
   Or download and extract the ZIP file.

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-YOUR-ACTUAL-API-KEY-HERE
   OPENAI_MODEL=gpt-4o-mini
   PORT=3000
   ```

4. **Start the server**
   ```bash
   python server.py
   ```
   
   Server will start at: **http://localhost:3000**
   
   You should see:
   ```
   EduBlink Server: http://localhost:3000
   API Key: OK
   INFO: Uvicorn running on http://0.0.0.0:3000
   ```

5. **Open your browser**
   
   Navigate to: **http://localhost:3000**
   
   ⚠️ **Important**: Do NOT use Live Server or other static file servers. The app must be accessed through the FastAPI server for API calls to work.

## 📁 Project Structure

```
EduBlink/
├── public/                    # Frontend files
│   ├── index.html            # Main SPA with animated hero section
│   ├── styles.css            # Modern CSS with animations & themes
│   └── app.js                # Vanilla JavaScript (no dependencies)
├── server.py                  # FastAPI backend with all 9 tools
├── .env                       # Environment variables (create this)
├── .env.example              # Environment template
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## 🎯 Usage Guide

### Starting the Application

1. **Run the server:**
   ```bash
   python server.py
   ```

2. **Access the app:**
   - Open browser: `http://localhost:3000`
   - ⚠️ Do NOT use Live Server or port 5500
   - Must use the FastAPI server for API calls to work

### Using the Tools

#### 📝 MCQ Generator
- **Topic**: Enter subject (e.g., "Photosynthesis")
- **Grade Level**: Select difficulty level
- **Count**: Number of questions (1-20)
- **Difficulty**: Easy, Medium, or Hard
- **Output**: Questions with options, correct answers, and explanations

#### 📄 Worksheet Generator
- **Topic**: Subject matter
- **Grade Level**: Target student level
- **Count**: Number of questions (5-30)
- **Output**: Complete worksheet with answer key

#### 📚 Lesson Plan Creator
- **Topic**: Lesson subject
- **Grade Level**: Student level
- **Duration**: Lesson length in minutes
- **Objectives**: Learning goals (optional)
- **Output**: Structured plan with activities and materials

#### 📊 Text Summarizer
- **Text**: Paste long content (up to 5000 chars)
- **Bullet Points**: Number of key points (3-10)
- **Output**: Concise summary with main ideas

#### ✏️ Proof Reader
- **Text**: Content to proofread
- **Output**: Corrected text with grammar/spelling fixes

#### 🎨 PPT Generator
- **Topic**: Presentation subject
- **Slide Count**: Number of slides (4-15)
- **Audience**: Target viewers
- **Output**: Slide outlines with content and notes

#### 💬 Report Card Comments
- **Student Info**: Brief description
- **Focus Area**: What to emphasize
- **Comment Count**: Number of variations (1-5)
- **Output**: Professional, thoughtful comments

#### 📝 Essay Grader (Intelligent AI)
- **Essay Text**: Student essay to grade
- **Max Score**: Maximum points (e.g., 100)
- **Rubric**: Grading criteria
- **Output**: Variable scores, detailed strengths/improvements, grammar notes

#### 🔄 Text Rewriter
- **Text**: Original content
- **Style**: Professional, casual, creative, etc.
- **Tone**: Formal, friendly, neutral
- **Audience**: General, students, professionals
- **Length**: Same, shorter, longer
- **Output**: Multiple rewritten variations

### Tips for Best Results

- ✅ Be specific with topics and requirements
- ✅ Use appropriate grade levels for content difficulty
- ✅ Provide context for better AI understanding
- ✅ Review and edit AI-generated content
- ✅ Use the copy/download features to save results

## 🔧 Configuration

### Environment Variables

Edit `.env` to customize:

```env
# Required
OPENAI_API_KEY=sk-your-key-here

# Optional (defaults shown)
OPENAI_MODEL=gpt-4o-mini    # AI model (fast & cost-effective)
PORT=3000                    # Server port
```

### Model Options

- **gpt-4o-mini** (Recommended) - Fast, affordable, great quality
- **gpt-4o** - Most capable, slower, more expensive
- **gpt-3.5-turbo** - Faster, cheaper, lower quality

### Rate Limiting

Current settings (in `server.py`):
- **100 requests** per 15 minutes per IP
- Automatically resets after window expires
- Returns 429 error when limit exceeded

## 🔒 Security

### API Key Protection

- ✅ API key stored in `.env` (server-side only)
- ✅ Never exposed to frontend/browser
- ✅ `.env` in `.gitignore` to prevent commits
- ✅ All AI requests proxied through backend

### Best Practices

⚠️ **NEVER commit `.env` to version control!**

## 🚀 Deployment

### Deploying to Production

#### Option 1: Railway/Render (Recommended)

1. **Create account** at [Railway.app](https://railway.app) or [Render.com](https://render.com)
2. **Connect GitHub repository**
3. **Set environment variable**:
   - `OPENAI_API_KEY` = your key
4. **Deploy** - Platform auto-detects Python and runs `server.py`

#### Option 2: Heroku

```bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Set environment variable
heroku config:set OPENAI_API_KEY=sk-your-key-here

# Create Procfile
echo "web: python server.py" > Procfile

# Deploy
git push heroku main
```

#### Option 3: Azure/AWS/Google Cloud

Use their Python app hosting services. Set `OPENAI_API_KEY` in environment variables and configure port binding.

### Environment Variables for Production

```env
OPENAI_API_KEY=sk-your-production-key
OPENAI_MODEL=gpt-4o-mini
PORT=8000  # Or platform-assigned port
```

## 🛠️ Troubleshooting

### Common Issues

#### "Failed to generate content" Error
- ✅ Check `.env` file exists with valid API key
- ✅ Verify server is running (`python server.py`)
- ✅ Check console for error messages
- ✅ Ensure API key has credits

#### Server Not Accessible
- ✅ Access via `http://localhost:3000` (not Live Server)
- ✅ Check firewall/antivirus blocking port 3000
- ✅ Verify Python version 3.8+
- ✅ Restart server if needed

#### API Rate Limit Exceeded
- ✅ Wait 15 minutes for rate limit reset
- ✅ Check OpenAI account usage limits
- ✅ Adjust rate limiting in `server.py` if needed

#### Unicode/Encoding Errors (Windows)
- ✅ Ensure terminal uses UTF-8 encoding
- ✅ Run `chcp 65001` before starting server
- ✅ Use PowerShell instead of CMD

## 📝 Development Notes

### Technology Stack

- **Backend**: FastAPI (Python 3.8+)
- **Frontend**: Vanilla JavaScript (ES6+)
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Custom CSS with dark/light themes

### Project Structure Details

- `server.py` - FastAPI app with 9 AI tool endpoints
- `public/` - Static files served by FastAPI
- `app.js` - SPA logic with state management
- `styles.css` - Responsive design with animations

## 🤝 Contributing

Contributions welcome! To add new tools:

1. Add endpoint in `server.py`
2. Create form in `index.html`
3. Add rendering function in `app.js`
4. Update this README

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🙏 Acknowledgments

- OpenAI for GPT-4o-mini API
- FastAPI framework
- All educators using this tool

---

**Made with ❤️ for teachers who want to save time and create better educational content.**

For issues or questions, check the troubleshooting section above.
- Use HTTPS only
- Monitor API usage and costs
- Add request logging

## 📊 API Reference

### POST `/api/generate`

Generate educational content.

**Request:**
```json
{
  "tool": "mcq",
  "inputs": {
    "topic": "Photosynthesis",
    "gradeLevel": "high school",
    "count": 5,
    "difficulty": "medium"
  },
  "stream": false
}
```

**Response:**
```json
{
  "success": true,
  "tool": "mcq",
  "data": [
    {
      "id": 1,
      "question": "What is the primary pigment in photosynthesis?",
      "options": ["Chlorophyll", "Carotene", "Xanthophyll", "Anthocyanin"],
      "answerIndex": 0,
      "explanation": "Chlorophyll is the main pigment that captures light energy."
    }
  ],
  "model": "gpt-4o-mini",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 300,
    "total_tokens": 450
  }
}
```

**Error Response:**
```json
{
  "error": "Error message here",
  "details": "Additional error details"
}
```

### GET `/api/health`

Check server health and configuration.

**Response:**
```json
{
  "status": "healthy",
  "model": "gpt-4o-mini",
  "apiKeyConfigured": true
}
```

## 🧪 Tool-Specific Payloads

### MCQ Generator
```json
{
  "tool": "mcq",
  "inputs": {
    "topic": "String",
    "gradeLevel": "elementary|middle school|high school|college",
    "count": 5,
    "difficulty": "easy|medium|hard"
  }
}
```

### Worksheet Generator
```json
{
  "tool": "worksheet",
  "inputs": {
    "topic": "String",
    "gradeLevel": "String",
    "count": 10
  }
}
```

### Lesson Plan
```json
{
  "tool": "lessonplan",
  "inputs": {
    "topic": "String",
    "gradeLevel": "String",
    "duration": 45
  }
}
```

### Text Summarizer
```json
{
  "tool": "summarizer",
  "inputs": {
    "text": "String (max 5000 chars)",
    "bulletPoints": 5,
    "audience": "general|students|professionals|children"
  }
}
```

### Proofread
```json
{
  "tool": "proofread",
  "inputs": {
    "text": "String",
    "tone": "academic|casual|professional|creative"
  }
}
```

### PPT Generator
```json
{
  "tool": "ppt",
  "inputs": {
    "topic": "String",
    "slideCount": 8,
    "audience": "String"
  }
}
```

### Report Card
```json
{
  "tool": "reportcard",
  "inputs": {
    "subject": "String",
    "gradeLevel": "String",
    "performance": "excellent|good|satisfactory|needs improvement",
    "strengths": "String",
    "areasForGrowth": "String",
    "commentCount": 3
  }
}
```

### Essay Grader
```json
{
  "tool": "essaygrader",
  "inputs": {
    "essayText": "String",
    "prompt": "String",
    "gradeLevel": "Middle School|High School|College",
    "maxScore": 100
  }
}
```

## 🎯 Next Steps & Improvements

### Recommended Enhancements

1. **User Authentication**
   - Add login/signup functionality
   - Save user's generated content
   - Usage tracking per user

2. **Database Integration**
   - Store generated content
   - Allow editing and versioning
   - Share content with colleagues

3. **Export Formats**
   - PDF export
   - DOCX export
   - Google Slides integration for PPTs
   - Learning Management System (LMS) integration

4. **Analytics**
   - Track most-used tools
   - Monitor API costs
   - User engagement metrics

5. **Collaboration**
   - Share generated content via link
   - Commenting and feedback
   - Team workspaces

6. **Advanced Features**
   - Batch generation
   - Custom prompt templates
   - AI model comparison
   - Fine-tuned models for education

## 🐛 Troubleshooting

### Server won't start

**Issue:** Port already in use
```
Error: [Errno 10048] error while attempting to bind on address ('0.0.0.0', 3000)
```

**Solution:** Change the PORT in `.env` or kill the process using port 3000:
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Issue:** Python module not found

**Solution:** Install dependencies:
```powershell
pip install -r requirements.txt
```

### API Key Error

**Issue:** "OpenAI API key not configured"

**Solution:** 
1. Check `.env` file exists
2. Verify `OPENAI_API_KEY` is set correctly
3. Restart the server after editing `.env`

### Generation Fails

**Issue:** "OpenAI rate limit exceeded"

**Solution:** 
- You've exceeded your OpenAI quota
- Check usage at https://platform.openai.com/usage
- Upgrade your OpenAI plan or wait for quota reset

### Invalid JSON Response

**Issue:** "Failed to parse OpenAI response"

**Solution:**
- The model didn't return valid JSON
- Try reducing input complexity
- Adjust temperature (lower = more consistent)
- Check `prompts.md` for prompt guidelines

### Python Version Issues

**Issue:** "SyntaxError" or compatibility errors

**Solution:**
- Ensure you're using Python 3.8 or higher
- Check version: `python --version`
- Update if needed

## 📝 License

**MIT License**

Copyright (c) 2024 Ritik Gupta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review `prompts.md` for prompt customization

## 🎨 Design

**Color Scheme:** Light grey backgrounds with warm brown text for a sophisticated, educational aesthetic.

**Theme Toggle:** Switch between light and dark modes with persistent preference storage.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/) and [OpenAI GPT-4](https://openai.com/)
- Styled with modern CSS custom properties (light grey & brown palette)
- Icons from Unicode emojis

## 🚀 Tech Stack

**Backend:** Python, FastAPI, Uvicorn  
**Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3  
**API:** OpenAI GPT-4o-mini  
**Deployment:** Standalone server (no external dependencies)

---

**Made with ❤️ by Ritik Gupta**

Happy Teaching! 🎓✨
