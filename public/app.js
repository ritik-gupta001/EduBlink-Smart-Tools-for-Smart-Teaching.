/**
 * EduBlink Client Application
 * 
 * Vanilla JavaScript (ES6+) for handling UI interactions,
 * API calls, theme management, and result rendering
 */

// ===========================
// State Management
// ===========================
const AppState = {
  currentTool: null,
  currentResults: null,
  theme: localStorage.getItem('theme') || 'light',
  sidebarOpen: window.innerWidth > 968
};

// ===========================
// Initialize App
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeEventListeners();
  checkServerHealth();
});

/**
 * Initialize theme from localStorage
 */
function initializeTheme() {
  document.documentElement.setAttribute('data-theme', AppState.theme);
}

/**
 * Set up all event listeners
 */
function initializeEventListeners() {
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  // Sidebar toggle for mobile
  document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
  
  // Navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavClick);
  });
  
  // Results panel close
  document.getElementById('resultsClose').addEventListener('click', closeResultsPanel);
  
  // Close modal on overlay click
  document.getElementById('toolModal').addEventListener('click', (e) => {
    if (e.target.id === 'toolModal') {
      closeToolModal();
    }
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeToolModal();
    }
  });
}

/**
 * Check server health and API configuration
 */
async function checkServerHealth() {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    
    if (!data.apiKeyConfigured) {
      showToast('⚠️ API key not configured. Please set OPENAI_API_KEY in .env', 'warning');
    }
  } catch (error) {
    console.error('Server health check failed:', error);
  }
}

// ===========================
// Theme Management
// ===========================
function toggleTheme() {
  AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', AppState.theme);
  localStorage.setItem('theme', AppState.theme);
  showToast(`${AppState.theme === 'dark' ? '🌙' : '☀️'} ${AppState.theme === 'dark' ? 'Dark' : 'Light'} mode activated`);
}

// ===========================
// Navigation
// ===========================
function toggleSidebar() {
  AppState.sidebarOpen = !AppState.sidebarOpen;
  document.getElementById('sidebar').classList.toggle('active', AppState.sidebarOpen);
}

function handleNavClick(e) {
  e.preventDefault();
  
  // Update active state
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  e.currentTarget.parentElement.classList.add('active');
  
  // Scroll to section
  const section = e.currentTarget.dataset.section;
  const element = document.getElementById(section);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Close sidebar on mobile
  if (window.innerWidth <= 968) {
    toggleSidebar();
  }
}

function scrollToTools() {
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
}

function copyVariation(index) {
    const variations = window.lastTextRewriterResult?.variations;
    if (variations && variations[index]) {
        const text = variations[index].rewrittenText;
        navigator.clipboard.writeText(text).then(() => {
            showToast('✅ Variation copied to clipboard!');
        }).catch(() => {
            showToast('❌ Failed to copy text');
        });
    }
}

function openLearnMore() {
  const modal = document.getElementById('toolModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = '💡 About EduBlink';
  modalBody.innerHTML = `
    <div style="line-height: 1.8; color: var(--color-text-primary);">
      <h3 style="color: var(--color-primary); margin-bottom: 16px;">Transform Your Teaching Experience</h3>
      
      <p style="margin-bottom: 16px;">
        <strong>EduBlink</strong> harnesses the power of artificial intelligence to revolutionize how educators create content. 
        Say goodbye to hours of prep work and hello to instant, high-quality educational materials.
      </p>
      
      <h4 style="color: var(--color-primary); margin-top: 24px; margin-bottom: 12px;">✨ Why Choose EduBlink?</h4>
      <ul style="margin-bottom: 16px; padding-left: 24px;">
        <li style="margin-bottom: 8px;"><strong>Save Time:</strong> Generate content in seconds, not hours</li>
        <li style="margin-bottom: 8px;"><strong>Boost Quality:</strong> AI-powered suggestions ensure accuracy</li>
        <li style="margin-bottom: 8px;"><strong>Stay Creative:</strong> Focus on teaching, not paperwork</li>
        <li style="margin-bottom: 8px;"><strong>Adapt Easily:</strong> Customize content for any grade level</li>
      </ul>
      
      <h4 style="color: var(--color-primary); margin-top: 24px; margin-bottom: 12px;">🎯 Perfect For:</h4>
      <ul style="margin-bottom: 16px; padding-left: 24px;">
        <li style="margin-bottom: 8px;">Teachers looking to save prep time</li>
        <li style="margin-bottom: 8px;">Tutors creating personalized materials</li>
        <li style="margin-bottom: 8px;">Educators seeking fresh content ideas</li>
        <li style="margin-bottom: 8px;">Anyone passionate about quality education</li>
      </ul>
      
      <div style="background: var(--color-bg-secondary); padding: 16px; border-radius: 8px; margin-top: 24px; border-left: 4px solid var(--color-primary);">
        <p style="margin: 0; font-style: italic; color: var(--color-text-secondary);">
          "EduBlink is more than a tool—it's your teaching assistant, available 24/7 to help you inspire and educate."
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 32px;">
        <button class="btn btn-primary" onclick="closeToolModal(); scrollToTools();" style="padding: 12px 32px; font-size: 1.0625rem;">
          🚀 Get Started Now
        </button>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

// ===========================
// Modal Management
// ===========================

/**
 * Open tool modal with appropriate form
 */
function openToolModal(tool) {
  AppState.currentTool = tool;
  const modal = document.getElementById('toolModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  // Set title
  const toolTitles = {
    mcq: 'MCQ Generator',
    worksheet: 'Worksheet Generator',
    lessonplan: 'Lesson Plan Creator',
    summarizer: 'Text Summarizer',
    proofread: 'Proof read Text',
    ppt: 'PPT Generator',
    reportcard: 'Report Card Comments',
    essaygrader: 'Essay Grader',
    textrewriter: 'Text Rewriter'
  };
  
  modalTitle.textContent = toolTitles[tool] || 'Tool';
  
  // Generate form
  modalBody.innerHTML = generateToolForm(tool);
  
  // Show modal
  modal.classList.add('active');
}

/**
 * Close tool modal
 */
function closeToolModal() {
  const modal = document.getElementById('toolModal');
  modal.classList.remove('active');
  AppState.currentTool = null;
}

/**
 * Generate form HTML for each tool
 */
function generateToolForm(tool) {
  const forms = {
    mcq: `
      <form id="toolForm" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label class="form-label" for="topic">Topic *</label>
          <input type="text" id="topic" name="topic" class="form-input" required placeholder="e.g., Photosynthesis">
        </div>
        <div class="form-group">
          <label class="form-label" for="gradeLevel">Grade Level</label>
          <select id="gradeLevel" name="gradeLevel" class="form-select">
            <option value="elementary">Elementary School</option>
            <option value="middle school">Middle School</option>
            <option value="high school" selected>High School</option>
            <option value="college">College</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="count">Number of Questions</label>
          <input type="number" id="count" name="count" class="form-input" value="5" min="1" max="20">
        </div>
        <div class="form-group">
          <label class="form-label" for="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" class="form-select">
            <option value="easy">Easy</option>
            <option value="medium" selected>Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Generate MCQs</button>
      </form>
    `,
    
    worksheet: `
      <form id="toolForm" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label class="form-label" for="topic">Topic *</label>
          <input type="text" id="topic" name="topic" class="form-input" required placeholder="e.g., The Water Cycle">
        </div>
        <div class="form-group">
          <label class="form-label" for="gradeLevel">Grade Level</label>
          <select id="gradeLevel" name="gradeLevel" class="form-select">
            <option value="elementary">Elementary School</option>
            <option value="middle school" selected>Middle School</option>
            <option value="high school">High School</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="count">Number of Questions</label>
          <input type="number" id="count" name="count" class="form-input" value="10" min="5" max="30">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Create Worksheet</button>
      </form>
    `,
    
    lessonplan: `
      <form id="toolForm" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label class="form-label" for="topic">Lesson Topic *</label>
          <input type="text" id="topic" name="topic" class="form-input" required placeholder="e.g., Introduction to Fractions">
        </div>
        <div class="form-group">
          <label class="form-label" for="gradeLevel">Grade Level</label>
          <input type="text" id="gradeLevel" name="gradeLevel" class="form-input" value="grade 8" placeholder="e.g., grade 8">
        </div>
        <div class="form-group">
          <label class="form-label" for="duration">Duration (minutes)</label>
          <input type="number" id="duration" name="duration" class="form-input" value="45" min="15" max="180">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Generate Lesson Plan</button>
      </form>
    `,
    
    summarizer: `
      <form id="toolForm" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label class="form-label" for="text">Text to Summarize *</label>
          <textarea id="text" name="text" class="form-textarea" required placeholder="Paste your text here..." rows="8"></textarea>
          <div class="form-hint">Maximum 5000 characters</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="bulletPoints">Number of Bullet Points</label>
          <input type="number" id="bulletPoints" name="bulletPoints" class="form-input" value="5" min="3" max="10">
        </div>
        <div class="form-group">
          <label class="form-label" for="audience">Audience</label>
          <select id="audience" name="audience" class="form-select">
            <option value="general" selected>General</option>
            <option value="students">Students</option>
            <option value="professionals">Professionals</option>
            <option value="children">Children</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Summarize Text</button>
      </form>
    `,
    
    proofread: `
      <form id="toolForm" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label class="form-label" for="text">Text to Proof read *</label>
          <textarea id="text" name="text" class="form-textarea" required placeholder="Paste your text here..." rows="10"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label" for="tone">Desired Tone</label>
          <select id="tone" name="tone" class="form-select">
            <option value="academic" selected>Academic</option>
            <option value="casual">Casual</option>
            <option value="professional">Professional</option>
            <option value="creative">Creative</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Proof read Text</button>
      </form>
    `,
    
    ppt: `
      <form id="toolForm" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label class="form-label" for="topic">Presentation Topic *</label>
          <input type="text" id="topic" name="topic" class="form-input" required placeholder="e.g., Climate Change Solutions">
        </div>
        <div class="form-group">
          <label class="form-label" for="slideCount">Number of Slides</label>
          <input type="number" id="slideCount" name="slideCount" class="form-input" value="8" min="3" max="20">
        </div>
        <div class="form-group">
          <label class="form-label" for="audience">Target Audience</label>
          <input type="text" id="audience" name="audience" class="form-input" value="students" placeholder="e.g., students, professionals">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Generate PPT Outline</button>
      </form>
    `,
    
    reportcard: `
      <form id="toolForm" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label class="form-label" for="subject">Subject</label>
          <input type="text" id="subject" name="subject" class="form-input" value="General" placeholder="e.g., Mathematics">
        </div>
        <div class="form-group">
          <label class="form-label" for="gradeLevel">Grade Level</label>
          <input type="text" id="gradeLevel" name="gradeLevel" class="form-input" value="Elementary" placeholder="e.g., Elementary">
        </div>
        <div class="form-group">
          <label class="form-label" for="performance">Performance Level</label>
          <select id="performance" name="performance" class="form-select">
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="satisfactory" selected>Satisfactory</option>
            <option value="needs improvement">Needs Improvement</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="strengths">Student Strengths</label>
          <input type="text" id="strengths" name="strengths" class="form-input" placeholder="e.g., participates well, shows effort">
        </div>
        <div class="form-group">
          <label class="form-label" for="areasForGrowth">Areas for Growth</label>
          <input type="text" id="areasForGrowth" name="areasForGrowth" class="form-input" placeholder="e.g., organization, time management">
        </div>
        <div class="form-group">
          <label class="form-label" for="commentCount">Number of Comment Variations</label>
          <input type="number" id="commentCount" name="commentCount" class="form-input" value="3" min="1" max="5">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Generate Comments</button>
      </form>
    `,
    
    essaygrader: `
      <form id="toolForm" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label class="form-label" for="essayText">Essay Text *</label>
          <textarea id="essayText" name="essayText" class="form-textarea" required placeholder="Paste the essay here..." rows="10"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label" for="prompt">Essay Prompt/Topic</label>
          <input type="text" id="prompt" name="prompt" class="form-input" placeholder="e.g., Discuss the impact of social media">
        </div>
        <div class="form-group">
          <label class="form-label" for="gradeLevel">Grade Level</label>
          <select id="gradeLevel" name="gradeLevel" class="form-select">
            <option value="Middle School">Middle School</option>
            <option value="High School" selected>High School</option>
            <option value="College">College</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="maxScore">Maximum Score</label>
          <input type="number" id="maxScore" name="maxScore" class="form-input" value="100" min="10" max="100">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Grade Essay</button>
      </form>
    `,
    
    textrewriter: `
      <form id="toolForm" onsubmit="handleFormSubmit(event)">
        <div class="form-group">
          <label class="form-label" for="text">Original Text *</label>
          <textarea id="text" name="text" class="form-textarea" required placeholder="Paste the text you want to rewrite..." rows="8"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label" for="style">Writing Style</label>
          <select id="style" name="style" class="form-select">
            <option value="professional" selected>Professional</option>
            <option value="casual">Casual</option>
            <option value="academic">Academic</option>
            <option value="creative">Creative</option>
            <option value="simple">Simple/Plain</option>
            <option value="persuasive">Persuasive</option>
            <option value="narrative">Narrative</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="tone">Tone</label>
          <select id="tone" name="tone" class="form-select">
            <option value="neutral" selected>Neutral</option>
            <option value="formal">Formal</option>
            <option value="friendly">Friendly</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="serious">Serious</option>
            <option value="humorous">Humorous</option>
            <option value="empathetic">Empathetic</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="audience">Target Audience</label>
          <select id="audience" name="audience" class="form-select">
            <option value="general" selected>General Public</option>
            <option value="students">Students</option>
            <option value="educators">Educators</option>
            <option value="professionals">Professionals</option>
            <option value="children">Children</option>
            <option value="experts">Subject Experts</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="length">Desired Length</label>
          <select id="length" name="length" class="form-select">
            <option value="same" selected>Keep Same Length</option>
            <option value="shorter">Make Shorter</option>
            <option value="longer">Make Longer</option>
            <option value="concise">More Concise</option>
            <option value="detailed">More Detailed</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="additionalInstructions">Additional Instructions (Optional)</label>
          <textarea id="additionalInstructions" name="additionalInstructions" class="form-textarea" placeholder="Any specific requirements or focus areas..." rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">🔄 Rewrite Text</button>
      </form>
    `
  };
  
  return forms[tool] || '<p>Form not available</p>';
}

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const inputs = Object.fromEntries(formData.entries());
  
  // Convert numeric strings to numbers
  ['count', 'duration', 'bulletPoints', 'slideCount', 'commentCount', 'maxScore'].forEach(key => {
    if (inputs[key]) {
      inputs[key] = parseInt(inputs[key]);
    }
  });
  
  // Save tool before closing modal (closeToolModal sets currentTool to null)
  const tool = AppState.currentTool;
  
  // Close modal
  closeToolModal();
  
  // Generate content
  await generateContent(tool, inputs);
}

// ===========================
// API Communication
// ===========================

/**
 * Generate content using the API
 */
async function generateContent(tool, inputs) {
  showLoading();
  
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tool,
        inputs,
        stream: false
      })
    });
    
    // Check if response has content before parsing
    const text = await response.text();
    console.log('Server response:', text);
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      hideLoading();
      throw new Error('Server returned invalid response. Check console for details.');
    }
    
    hideLoading();
    
    if (!response.ok) {
      throw new Error(data.detail || data.error || 'Generation failed');
    }
    
    if (data.success) {
      AppState.currentResults = data;
      displayResults(tool, data.data);
      showToast('✅ Content generated successfully!');
    } else {
      throw new Error('Unexpected response format');
    }
    
  } catch (error) {
    hideLoading();
    showToast('❌ ' + error.message, 'error');
    console.error('Generation error:', error);
  }
}

// ===========================
// Results Display
// ===========================

/**
 * Display results in the results panel
 */
function displayResults(tool, data) {
  const resultsContent = document.getElementById('resultsContent');
  const resultsActions = document.getElementById('resultsActions');
  const resultsPanel = document.getElementById('resultsPanel');
  
  // Generate HTML based on tool type
  let html = '';
  
  switch (tool) {
    case 'mcq':
      html = renderMCQResults(data);
      break;
    case 'worksheet':
      html = renderWorksheetResults(data);
      break;
    case 'lessonplan':
      html = renderLessonPlanResults(data);
      break;
    case 'summarizer':
      html = renderSummarizerResults(data);
      break;
    case 'proofread':
      html = renderProofreadResults(data);
      break;
    case 'ppt':
      html = renderPPTResults(data);
      break;
    case 'reportcard':
      html = renderReportCardResults(data);
      break;
    case 'essaygrader':
      html = renderEssayGraderResults(data);
      break;
    case 'textrewriter':
      html = renderTextRewriterResults(data);
      break;
    default:
      html = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
  }
  
  resultsContent.innerHTML = html;
  resultsActions.style.display = 'flex';
  resultsPanel.classList.add('active');
}

/**
 * Render MCQ results
 */
function renderMCQResults(data) {
  if (!Array.isArray(data)) return '<p>Invalid data format</p>';
  
  return data.map((q, idx) => `
    <div class="mcq-question">
      <div class="mcq-question-text"><strong>Q${idx + 1}.</strong> ${q.question}</div>
      <ul class="mcq-options">
        ${q.options.map((option, i) => `
          <li class="mcq-option ${i === q.answerIndex ? 'correct' : ''}">
            <strong>${String.fromCharCode(65 + i)}.</strong> ${option}
          </li>
        `).join('')}
      </ul>
      <div class="mcq-explanation">
        <strong>✓ Answer:</strong> ${String.fromCharCode(65 + q.answerIndex)} - ${q.explanation}
      </div>
    </div>
  `).join('');
}

/**
 * Render Worksheet results
 */
function renderWorksheetResults(data) {
  return `
    <div class="result-item">
      <h3>${data.title || 'Worksheet'}</h3>
      <p><em>${data.instructions || ''}</em></p>
      
      <h4>Questions</h4>
      ${data.questions.map((q, idx) => `
        <div class="mcq-question">
          <div class="mcq-question-text">
            <strong>Q${idx + 1}.</strong> ${q.question}
            <span style="float: right; color: var(--color-text-tertiary);">
              ${q.difficulty} | ${q.points} pt${q.points !== 1 ? 's' : ''}
            </span>
          </div>
          ${q.type === 'mcq' && q.options ? `
            <ul class="mcq-options">
              ${q.options.map((opt, i) => `<li class="mcq-option">${String.fromCharCode(65 + i)}. ${opt}</li>`).join('')}
            </ul>
          ` : '<div style="height: 60px; border: 1px dashed var(--color-border); border-radius: 4px; margin: 8px 0;"></div>'}
        </div>
      `).join('')}
      
      <h4>Answer Key</h4>
      ${data.answerKey.map((a, idx) => `
        <div class="mcq-explanation">
          <strong>Q${idx + 1}:</strong> ${a.answer}<br>
          <em>${a.explanation}</em>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render Lesson Plan results
 */
function renderLessonPlanResults(data) {
  return `
    <div class="result-item">
      <h3>${data.title || 'Lesson Plan'}</h3>
      <p><strong>Duration:</strong> ${data.duration || 'N/A'} minutes${data.gradeLevel ? ` | <strong>Grade:</strong> ${data.gradeLevel}` : ''}</p>
      
      ${data.objectives && data.objectives.length > 0 ? `
        <h4>Learning Objectives</h4>
        <ul>
          ${data.objectives.map(obj => `<li>${obj}</li>`).join('')}
        </ul>
      ` : ''}
      
      ${data.materials && data.materials.length > 0 ? `
        <h4>Materials Needed</h4>
        <ul>
          ${data.materials.map(mat => `<li>${mat}</li>`).join('')}
        </ul>
      ` : ''}
      
      ${data.activities && data.activities.length > 0 ? `
        <h4>Activities</h4>
        ${data.activities.map(act => `
          <div class="slide-preview">
            <div class="slide-title">${act.activity || act.name || 'Activity'}${act.time || act.duration ? ` (${act.time || act.duration} min)` : ''}</div>
            <p>${act.description || ''}</p>
          </div>
        `).join('')}
      ` : ''}
      
      ${data.assessment ? `<h4>Assessment</h4><p>${data.assessment}</p>` : ''}
      
      ${data.differentiation ? `<h4>Differentiation</h4><p>${data.differentiation}</p>` : ''}
      
      ${data.homework ? `<h4>Homework</h4><p>${data.homework}</p>` : ''}
    </div>
  `;
}

/**
 * Render Summarizer results
 */
function renderSummarizerResults(data) {
  return `
    <div class="result-item">
      <h3>Summary</h3>
      ${data.summary || data.tldr ? `
        <div class="mcq-explanation">
          <strong>Summary:</strong> ${data.summary || data.tldr}
        </div>
      ` : ''}
      
      ${data.keyPoints || data.bulletPoints ? `
        <h4>Key Points</h4>
        <ul class="slide-bullets">
          ${(data.keyPoints || data.bulletPoints).map(point => `<li>${point}</li>`).join('')}
        </ul>
      ` : ''}
      
      ${data.wordCount ? `
        <div class="slide-notes">
          Original: ${data.wordCount.original} words | Summary: ${data.wordCount.summary} words
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Render Proofread results
 */
function renderProofreadResults(data) {
  const issues = data.corrections || data.issues || [];
  
  return `
    <div class="result-item">
      ${data.corrected || data.correctedText ? `
        <h3>Corrected Text</h3>
        <div class="mcq-question">
          <p>${data.corrected || data.correctedText}</p>
        </div>
      ` : ''}
      
      ${data.original ? `
        <h4>Original Text</h4>
        <div class="mcq-explanation">
          <p>${data.original}</p>
        </div>
      ` : ''}
      
      ${issues.length > 0 ? `
        <h4>Issues Found (${issues.length})</h4>
        ${issues.map((issue, idx) => `
          <div class="mcq-explanation" style="margin-bottom: 12px;">
            <strong>${idx + 1}. ${(issue.type || 'correction').toUpperCase()}</strong><br>
            <span style="text-decoration: line-through; color: var(--color-danger);">${issue.original}</span>
            → <span style="color: var(--color-success);">${issue.correction || issue.suggestion}</span><br>
            <em>${issue.explanation}</em>
          </div>
        `).join('')}
      ` : '<p>No issues found!</p>'}
      
      ${data.summary ? `
        <h4>Overall Assessment</h4>
        <p>${data.summary}</p>
      ` : ''}
    </div>
  `;
}

/**
 * Render PPT results
 */
function renderPPTResults(data) {
  return `
    <div class="result-item">
      <h3>${data.title || 'Presentation'}</h3>
      ${data.estimatedDuration ? `<p><strong>Estimated Duration:</strong> ${data.estimatedDuration}</p>` : ''}
      
      ${data.slides && data.slides.length > 0 ? data.slides.map(slide => `
        <div class="slide-preview">
          <div class="slide-title">Slide ${slide.slideNumber}: ${slide.title}</div>
          ${slide.content || slide.bullets ? `
            <ul class="slide-bullets">
              ${(slide.content || slide.bullets).map(bullet => `<li>${bullet}</li>`).join('')}
            </ul>
          ` : ''}
          ${slide.notes || slide.speakerNotes ? `
            <div class="slide-notes">
              <strong>Speaker Notes:</strong> ${slide.notes || slide.speakerNotes}
            </div>
          ` : ''}
        </div>
      `).join('') : '<p>No slides generated</p>'}
    </div>
  `;
}

/**
 * Render Report Card results
 */
function renderReportCardResults(data) {
  const comments = data.comments || [];
  
  return `
    <div class="result-item">
      <h3>Report Card Comments</h3>
      
      ${comments.length > 0 ? comments.map((comment, idx) => `
        <div class="mcq-question">
          <div class="mcq-question-text">
            <strong>${comment.category || `Variation ${idx + 1}`}</strong>
            ${comment.tone ? `<span style="float: right; font-size: 0.875rem; color: var(--color-text-tertiary);">${comment.tone}</span>` : ''}
          </div>
          <p>${comment.comment || comment.text || ''}</p>
        </div>
      `).join('') : '<p>No comments generated</p>'}
      
      ${data.suggestions && data.suggestions.length > 0 ? `
        <h4>Suggestions for Parents</h4>
        <ul>
          ${data.suggestions.map(sug => `<li>${sug}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `;
}

/**
 * Render Essay Grader results
 */
function renderEssayGraderResults(data) {
  return `
    <div class="result-item">
      <h3>Essay Grade: ${data.grade || 'N/A'}${data.score ? ` (${data.score}/${data.maxScore || 100})` : ''}</h3>
      
      ${data.rubric && data.rubric.length > 0 ? `
        <h4>Rubric Breakdown</h4>
        ${data.rubric.map(item => `
          <div class="mcq-question">
            <div class="mcq-question-text">
              <strong>${item.category}</strong>
              <span style="float: right;">${item.score}/${item.maxScore}</span>
            </div>
            <p>${item.feedback}</p>
          </div>
        `).join('')}
      ` : ''}
      
      ${data.feedback ? `
        ${data.feedback.strengths && data.feedback.strengths.length > 0 ? `
          <h4>Strengths</h4>
          <ul class="slide-bullets">
            ${data.feedback.strengths.map(s => `<li>${s}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${data.feedback.improvements && data.feedback.improvements.length > 0 ? `
          <h4>Areas for Improvement</h4>
          <ul class="slide-bullets">
            ${data.feedback.improvements.map(a => `<li>${a}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${data.feedback.grammar ? `
          <h4>Grammar Notes</h4>
          <div class="mcq-explanation">
            ${data.feedback.grammar}
          </div>
        ` : ''}
        
        ${data.feedback.overall ? `
          <h4>Overall Feedback</h4>
          <div class="mcq-explanation">
            ${data.feedback.overall}
          </div>
        ` : ''}
      ` : ''}
      
      ${data.strengths && data.strengths.length > 0 ? `
        <h4>Strengths</h4>
        <ul class="slide-bullets">
          ${data.strengths.map(s => `<li>${s}</li>`).join('')}
        </ul>
      ` : ''}
      
      ${data.areasForImprovement && data.areasForImprovement.length > 0 ? `
        <h4>Areas for Improvement</h4>
        <ul class="slide-bullets">
          ${data.areasForImprovement.map(a => `<li>${a}</li>`).join('')}
        </ul>
      ` : ''}
      
      ${data.detailedFeedback ? `
        <h4>Detailed Feedback</h4>
        <div class="mcq-explanation">
          ${data.detailedFeedback}
        </div>
      ` : ''}
      
      ${data.suggestions && data.suggestions.length > 0 ? `
        <h4>Suggestions</h4>
        <ul>
          ${data.suggestions.map(sug => `<li>${sug}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `;
}

function renderTextRewriterResults(data) {
  // store last result globally for copy helper
  window.lastTextRewriterResult = data;

  const variationsHtml = (data.variations || []).map((v, idx) => `
    <div class="variation-card" style="margin-bottom: 18px; padding: 16px; background: var(--color-bg-secondary); border-radius: 8px; border-left: 4px solid var(--color-primary);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h4 style="color:var(--color-primary); margin:0;">🔄 Variation ${v.id || idx+1} — ${v.style || ''}</h4>
        <button class="btn btn-secondary" onclick="copyVariation(${idx})">📋 Copy</button>
      </div>
      <p style="white-space:pre-wrap; line-height:1.7; margin-top:12px; color:var(--color-text-primary);">${v.rewrittenText || ''}</p>
      <div style="font-size:0.95rem; color:var(--color-text-secondary); background:var(--color-bg); padding:8px; border-radius:6px;">
        <strong>Changes:</strong> ${v.changes || 'No summary provided.'}
      </div>
    </div>
  `).join('');

  const comparison = data.comparison || { originalWordCount: 0, rewrittenWordCount: 0, readabilityImprovement: 'N/A' };

  return `
    <div class="result-item">
      <h3>Text Rewriter — ${data.variations?.length || 0} variations</h3>

      <div style="background:var(--color-bg-secondary); padding:12px; border-radius:8px; margin:12px 0;">
        <strong>Original:</strong> ${comparison.originalWordCount} words &nbsp; • &nbsp;
        <strong>Rewritten:</strong> ${comparison.rewrittenWordCount} words &nbsp; • &nbsp;
        <strong>Readability:</strong> ${comparison.readabilityImprovement}
      </div>

      ${variationsHtml}

      <div style="margin-top:18px; background:var(--color-bg-secondary); padding:12px; border-radius:8px;">
        <h4 style="color:var(--color-primary);">💡 Tips</h4>
        <ul style="color:var(--color-text-secondary);">
          ${(data.suggestions || []).map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}
/**
 * Close results panel
 */
function closeResultsPanel() {
  document.getElementById('resultsPanel').classList.remove('active');
}

// ===========================
// Results Actions
// ===========================

/**
 * Copy results to clipboard
 */
function copyResults() {
  const resultsContent = document.getElementById('resultsContent');
  const text = resultsContent.innerText;
  
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Results copied to clipboard!');
  }).catch(err => {
    showToast('❌ Failed to copy', 'error');
    console.error('Copy failed:', err);
  });
}

/**
 * Download results as JSON
 */
function downloadResults() {
  if (!AppState.currentResults) {
    showToast('❌ No results to download', 'error');
    return;
  }
  
  const blob = new Blob([JSON.stringify(AppState.currentResults, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `edublink-${AppState.currentResults.tool}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('💾 Results downloaded!');
}

/**
 * Print results
 */
function printResults() {
  window.print();
}

// ===========================
// UI Helpers
// ===========================

/**
 * Show loading overlay
 */
function showLoading(message = 'Hold tight — generating high-quality content...') {
  const overlay = document.getElementById('loadingOverlay');
  const text = document.getElementById('loadingText');
  text.textContent = message;
  overlay.classList.add('active');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  document.getElementById('loadingOverlay').classList.remove('active');
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMessage = document.getElementById('toastMessage');
  
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  
  toastIcon.textContent = icons[type] || icons.info;
  toastMessage.textContent = message;
  
  toast.classList.add('active');
  
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// ===========================
// Responsive Behavior
// ===========================
window.addEventListener('resize', () => {
  if (window.innerWidth > 968) {
    AppState.sidebarOpen = true;
    document.getElementById('sidebar').classList.add('active');
  }
});
