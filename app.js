// app.js
class CineMatchApp {
  constructor() {
    this.currentStage = 0;
    this.currentQuestion = 0;
    this.totalQuestions = 0;
    this.answers = {};
    this.userProfile = {};

    this.bindEvents();
    this.initializeStages();
    this.showScreen('landingScreen');
  }

  bindEvents() {
    document.getElementById('startQuestionnaireBtn').addEventListener('click', () => {
      this.showScreen('questionnaireScreen');
      this.renderCurrentQuestion();
    });

    document.getElementById('refineBtn').addEventListener('click', () => {
      this.currentStage = 0;
      this.currentQuestion = 0;
      this.showScreen('questionnaireScreen');
      this.renderCurrentQuestion();
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
      this.answers = {};
      this.userProfile = {};
      this.currentStage = 0;
      this.currentQuestion = 0;
      this.showScreen('landingScreen');
    });

    document.getElementById('prevBtn').addEventListener('click', () => this.previousQuestion());
    document.getElementById('skipBtn').addEventListener('click', () => this.skipQuestion());
    document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
  }

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  initializeStages() {
    this.stages = [
      {
        title: 'Basic Preferences',
        subtitle: "Let's start with the fundamentals",
        questions: [
          {
            id: 'favorite_genres',
            type: 'checkbox',
            title: 'What are your favorite film AND TV genres?',
            subtitle: 'Select up to 5 that appeal to you most',
            options: ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'],
            maxSelections: 5
          },
          {
            id: 'preferred_decades',
            type: 'checkbox',
            title: 'Which eras do you prefer?',
            subtitle: 'Select up to 3',
            options: ['1920s-1940s', '1950s-1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'],
            maxSelections: 3
          },
          {
            id: 'language_pref',
            type: 'radio',
            title: 'How do you feel about subtitles?',
            options: [
              { value: 'love', label: 'Love international with subtitles' },
              { value: 'comfortable', label: 'Comfortable with subtitles' },
              { value: 'occasional', label: 'Occasionally watch subs' },
              { value: 'avoid', label: 'Prefer dubbed or avoid foreign' }
            ]
          },
          {
            id: 'runtime_pref',
            type: 'radio',
            title: 'Ideal length?',
            options: [
              { value: 'short', label: '<90 minutes' },
              { value: 'medium', label: '90-120 minutes' },
              { value: 'long', label: '>2 hours' },
              { value: 'any', label: 'No preference' }
            ]
          },
          {
            id: 'view_context',
            type: 'checkbox',
            title: 'Viewing context',
            subtitle: 'Select all that apply',
            options: ['Solo evening', 'Date night', 'With friends', 'Family', 'Background', 'Focused'],
            maxSelections: 6
          },
          {
            id: 'binge_style',
            type: 'radio',
            title: 'TV viewing style',
            options: [
              { value: 'binge', label: 'Binge-watch entire seasons' },
              { value: 'episodic', label: 'One episode at a time' }
            ]
          },
          {
            id: 'platform_pref',
            type: 'checkbox',
            title: 'Platforms you use',
            subtitle: 'Select all',
            options: ['Netflix', 'Amazon Prime', 'HBO Max', 'Disney+', 'Hulu', 'Apple TV+'],
            maxSelections: 6
          }
        ]
      },
      // Stage 2, 3, 4 omitted for brevity but follow same structure
    ];
    this.totalQuestions = this.stages.reduce((sum, st) => sum + st.questions.length, 0);
  }

  renderCurrentQuestion() {
    const stage = this.stages[this.currentStage];
    const question = stage.questions[this.currentQuestion];

    document.getElementById('stageTitle').textContent = stage.title;
    document.getElementById('stageSubtitle').textContent = stage.subtitle;

    let html = '';
    if (question.type === 'radio') {
      html = question.options.map(o => `<button class="option-button" data-value="${o.value}">${o.label}</button>`).join('');
    } else if (question.type === 'checkbox') {
      html = `<div class="checkbox-group">${question.options.map(o => `
        <label class="checkbox-option" data-value="${o}">
          <input type="checkbox" value="${o}"/>
          <span>${o}</span>
        </label>
      `).join('')}</div>`;
    }
    document.getElementById('questionContent').innerHTML = html;
    this.bindQuestionEvents(question);
  }

  bindQuestionEvents(question) {
    if (question.type === 'radio') {
      document.querySelectorAll('.option-button').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.option-button').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.answers[question.id] = btn.dataset.value;
        });
      });
    } else if (question.type === 'checkbox') {
      document.querySelectorAll('.checkbox-option').forEach(opt => {
        opt.addEventListener('click', () => {
          const val = opt.dataset.value;
          if (!this.answers[question.id]) this.answers[question.id] = [];
          const idx = this.answers[question.id].indexOf(val);
          if (idx > -1) {
            this.answers[question.id].splice(idx, 1);
            opt.classList.remove('selected');
            opt.querySelector('input').checked = false;
          } else if (this.answers[question.id].length < question.maxSelections) {
            this.answers[question.id].push(val);
            opt.classList.add('selected');
            opt.querySelector('input').checked = true;
          }
        });
      });
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) this.currentQuestion--;
    else if (this.currentStage > 0) {
      this.currentStage--;
      this.currentQuestion = this.stages[this.currentStage].questions.length - 1;
    }
    this.renderCurrentQuestion();
  }

  skipQuestion() {
    const q = this.stages[this.currentStage].questions[this.currentQuestion];
    this.answers[q.id] = q.type === 'checkbox' ? [] : null;
    this.nextQuestion();
  }

  nextQuestion() {
    if (this.currentQuestion < this.stages[this.currentStage].questions.length - 1) {
      this.currentQuestion++;
    } else if (this.currentStage < this.stages.length - 1) {
      this.currentStage++;
      this.currentQuestion = 0;
    } else {
      this.generateResults();
      return;
    }
    this.renderCurrentQuestion();
  }

  generateResults() {
    // build userProfile and recommendations (omitted)
    this.showScreen('resultsScreen');
  }
}

document.addEventListener('DOMContentLoaded', () => new CineMatchApp());
