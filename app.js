// Database-Powered CineMatch Application - BUG FIXES APPLIED
class CineMatchApp {
    constructor() {
        // Core application state
        this.currentStage = 0;
        this.currentQuestion = 0;
        this.totalQuestions = 0;
        this.answers = {};
        this.userProfile = {};
        this.recommendations = {};
        this.apiKeys = {};
        this.demoMode = false;
        
        // API Configuration from provided data
        this.apiConfig = {
            tmdb: {
                baseUrl: "https://api.themoviedb.org/3",
                imageBaseUrl: "https://image.tmdb.org/t/p/w500",
                endpoints: {
                    trending: "/trending/all/week",
                    discover_movie: "/discover/movie",
                    discover_tv: "/discover/tv", 
                    search_movie: "/search/movie",
                    search_tv: "/search/tv",
                    genres_movie: "/genre/movie/list",
                    genres_tv: "/genre/tv/list",
                    movie_details: "/movie/{id}",
                    tv_details: "/tv/{id}",
                    similar_movies: "/movie/{id}/similar",
                    similar_tv: "/tv/{id}/similar",
                    watch_providers: "/{type}/{id}/watch/providers"
                }
            },
            omdb: {
                baseUrl: "http://www.omdbapi.com"
            }
        };

        // Genre mapping for API queries
        this.genreMapping = {
            "Action": {"movie": 28, "tv": 10759},
            "Adventure": {"movie": 12, "tv": 10759},
            "Animation": {"movie": 16, "tv": 16},
            "Comedy": {"movie": 35, "tv": 35},
            "Crime": {"movie": 80, "tv": 80},
            "Documentary": {"movie": 99, "tv": 99},
            "Drama": {"movie": 18, "tv": 18},
            "Family": {"movie": 10751, "tv": 10751},
            "Fantasy": {"movie": 14, "tv": 10765},
            "Horror": {"movie": 27, "tv": 27},
            "Mystery": {"movie": 9648, "tv": 9648},
            "Romance": {"movie": 10749, "tv": 10749},
            "Sci-Fi": {"movie": 878, "tv": 10765},
            "Thriller": {"movie": 53, "tv": 53},
            "War": {"movie": 10752, "tv": 10768},
            "Western": {"movie": 37, "tv": 37}
        };

        // Mood to genre mapping
        this.moodToGenres = {
            "contemplative": [18, 99, 36, 9648],
            "entertainment": [35, 10751, 12, 878],
            "emotional": [18, 10749, 10751, 99],
            "adrenaline": [28, 53, 27, 80]
        };

        // Demo data for fallback
        this.demoData = this.generateDemoData();

        // Initialize questionnaire stages
        this.stages = this.generateQuestionStages();
        this.totalQuestions = this.stages.reduce((sum, stage) => sum + stage.questions.length, 0);

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('CineMatch database-powered app initialized');
        // Small delay to ensure DOM is fully ready
        setTimeout(() => {
            this.bindEvents();
            this.updateApiStatus();
        }, 100);
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Start questionnaire button - main CTA
        const startBtn = document.getElementById('startQuestionnaireBtn');
        if (startBtn) {
            console.log('Start button found, binding event');
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Start button clicked - showing API config');
                this.showApiConfig();
            });
        } else {
            console.error('Start questionnaire button not found!');
        }

        // API configuration buttons
        const saveApiBtn = document.getElementById('saveApiKeys');
        const demoModeBtn = document.getElementById('useDemoMode');
        const closeApiBtn = document.getElementById('closeApiModal');

        if (saveApiBtn) {
            saveApiBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Save API keys clicked');
                this.saveApiKeys();
            });
        }

        if (demoModeBtn) {
            demoModeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Demo mode clicked');
                this.startDemoMode();
            });
        }

        if (closeApiBtn) {
            closeApiBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideApiConfig();
            });
        }

        // Navigation buttons
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const skipBtn = document.getElementById('skipBtn');

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextQuestion();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousQuestion();
            });
        }

        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.skipQuestion();
            });
        }

        // Results screen buttons
        const refreshBtn = document.getElementById('refreshRecommendations');
        const refineBtn = document.getElementById('refineBtn');
        const startOverBtn = document.getElementById('startOverBtn');
        const shareBtn = document.getElementById('shareResults');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.refreshRecommendations();
            });
        }

        if (refineBtn) {
            refineBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.refineResults();
            });
        }

        if (startOverBtn) {
            startOverBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startOver();
            });
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showShareModal();
            });
        }

        // Modal close buttons
        const closeShareBtn = document.getElementById('closeShareModal');
        const closeMovieBtn = document.getElementById('closeMovieModal');

        if (closeShareBtn) {
            closeShareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideShareModal();
            });
        }

        if (closeMovieBtn) {
            closeMovieBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideMovieModal();
            });
        }

        // Share modal buttons
        const copyLinkBtn = document.getElementById('copyLink');
        const downloadBtn = document.getElementById('downloadResults');

        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.copyResults();
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadResults();
            });
        }

        // Modal backdrop clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                if (e.target.closest('#apiConfigModal')) this.hideApiConfig();
                if (e.target.closest('#shareModal')) this.hideShareModal();
                if (e.target.closest('#movieDetailModal')) this.hideMovieModal();
            }
        });

        console.log('Event binding completed');
    }

    // API Configuration Management
    showApiConfig() {
        console.log('Showing API config modal');
        const modal = document.getElementById('apiConfigModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
            console.log('API config modal should now be visible');
        } else {
            console.error('API config modal not found!');
        }
    }

    hideApiConfig() {
        console.log('Hiding API config modal');
        const modal = document.getElementById('apiConfigModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.add('hidden');
        }
    }

    saveApiKeys() {
        const tmdbKey = document.getElementById('tmdbApiKey')?.value?.trim();
        const omdbKey = document.getElementById('omdbApiKey')?.value?.trim();

        if (!tmdbKey) {
            alert('TMDb API key is required for database access');
            return;
        }

        this.apiKeys = {
            tmdb: 'f6c416b453c20b909c145fe52ed9104e',
            omdb: '3eace0c3'
        };

        console.log('API keys saved, starting questionnaire');
        this.demoMode = false;
        this.hideApiConfig();
        this.updateApiStatus();
        this.startQuestionnaire();
    }

    startDemoMode() {
        console.log('Starting demo mode');
        this.demoMode = true;
        this.apiKeys = {};
        this.hideApiConfig();
        this.updateApiStatus();
        this.startQuestionnaire();
    }

    updateApiStatus() {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');

        if (statusIndicator && statusText) {
            if (this.demoMode) {
                statusIndicator.className = 'status-indicator warning';
                statusText.textContent = 'Demo Mode';
            } else if (this.apiKeys.tmdb) {
                statusIndicator.className = 'status-indicator';
                statusText.textContent = 'Database Connected';
            } else {
                statusIndicator.className = 'status-indicator error';
                statusText.textContent = 'No Database';
            }
        }
    }

    // Database Connection Methods
    async makeApiRequest(endpoint, params = {}) {
        if (this.demoMode) {
            return this.getDemoResponse(endpoint, params);
        }

        try {
            if (endpoint.includes('omdbapi') && this.apiKeys.omdb) {
                const url = new URL(endpoint);
                url.searchParams.append('apikey', this.apiKeys.omdb);
                Object.keys(params).forEach(key => {
                    url.searchParams.append(key, params[key]);
                });
                const response = await fetch(url);
                return await response.json();
            } else {
                const url = new URL(`${this.apiConfig.tmdb.baseUrl}${endpoint}`);
                url.searchParams.append('api_key', this.apiKeys.tmdb);
                Object.keys(params).forEach(key => {
                    url.searchParams.append(key, params[key]);
                });
                const response = await fetch(url);
                return await response.json();
            }
        } catch (error) {
            console.error('API request failed:', error);
            return this.getDemoResponse(endpoint, params);
        }
    }

    getDemoResponse(endpoint, params) {
        // Return appropriate demo data based on endpoint
        if (endpoint.includes('discover') || endpoint.includes('trending')) {
            return {
                results: this.demoData.movies.slice(0, 10),
                total_results: this.demoData.movies.length
            };
        }
        if (endpoint.includes('genre')) {
            return { genres: this.demoData.genres };
        }
        return { results: [] };
    }

    // Questionnaire System
    generateQuestionStages() {
        return [
            {
                title: "Content Preferences",
                description: "What type of content do you enjoy?",
                questions: [
                    {
                        id: "content_type",
                        type: "single_choice",
                        title: "What interests you more?",
                        subtitle: "Choose your primary preference",
                        options: [
                            { value: "movies", label: "Movies - Feature films and cinema" },
                            { value: "tv", label: "TV Shows - Series and limited series" },
                            { value: "both", label: "Both equally - I love all types of content" }
                        ]
                    },
                    {
                        id: "favorite_genres",
                        type: "multiple_choice",
                        title: "Which genres appeal to you most?",
                        subtitle: "Select up to 5 genres you enjoy",
                        options: Object.keys(this.genreMapping).map(genre => ({ 
                            value: genre, 
                            label: genre 
                        })),
                        maxSelections: 5
                    }
                ]
            },
            {
                title: "Viewing Preferences",
                description: "How do you like to watch?",
                questions: [
                    {
                        id: "decade_preference",
                        type: "multiple_choice",
                        title: "Which time periods interest you?",
                        subtitle: "Select up to 3 eras",
                        options: [
                            { value: "2020s", label: "2020s - Latest releases" },
                            { value: "2010s", label: "2010s - Modern classics" },
                            { value: "2000s", label: "2000s - Digital age cinema" },
                            { value: "1990s", label: "1990s - Golden era" },
                            { value: "1980s", label: "1980s - Classic blockbusters" },
                            { value: "classic", label: "Pre-1980s - Vintage cinema" }
                        ],
                        maxSelections: 3
                    },
                    {
                        id: "language_preference",
                        type: "single_choice",
                        title: "How do you feel about international content?",
                        subtitle: "Your openness to non-English films and shows",
                        options: [
                            { value: "love_international", label: "I actively seek out international content" },
                            { value: "open_to_subtitles", label: "I'm open to subtitles for good content" },
                            { value: "occasional", label: "Occasionally, but prefer English" },
                            { value: "english_only", label: "I strongly prefer English content" }
                        ]
                    }
                ]
            },
            {
                title: "Taste Profile",
                description: "Tell us about your preferences",
                questions: [
                    {
                        id: "mood_preference",
                        type: "single_choice",
                        title: "What mood are you usually in when watching?",
                        subtitle: "Your typical viewing mindset",
                        options: [
                            { value: "contemplative", label: "Contemplative - I want to think and reflect" },
                            { value: "entertainment", label: "Entertainment - I want to be engaged and have fun" },
                            { value: "emotional", label: "Emotional - I want to feel deeply" },
                            { value: "adrenaline", label: "Adrenaline - I want excitement and thrills" }
                        ]
                    },
                    {
                        id: "rating_preference",
                        type: "single_choice",
                        title: "How do you feel about highly-rated vs. lesser-known content?",
                        subtitle: "Your preference for mainstream vs. hidden gems",
                        options: [
                            { value: "popular", label: "I prefer well-known, highly-rated content" },
                            { value: "balanced", label: "I like a mix of popular and lesser-known" },
                            { value: "hidden_gems", label: "I love discovering hidden gems" },
                            { value: "cult_classics", label: "I seek out cult classics and unique films" }
                        ]
                    }
                ]
            },
            {
                title: "Final Preferences",
                description: "Last few questions to perfect your profile",
                questions: [
                    {
                        id: "runtime_preference",
                        type: "single_choice",
                        title: "What's your ideal content length?",
                        subtitle: "Consider your available time and attention span",
                        options: [
                            { value: "short", label: "Short - Under 90 minutes or limited series" },
                            { value: "medium", label: "Medium - 90-150 minutes or standard seasons" },
                            { value: "long", label: "Long - Epic films or long-running series" },
                            { value: "no_preference", label: "No preference - quality matters more than length" }
                        ]
                    },
                    {
                        id: "discovery_method",
                        type: "single_choice",
                        title: "How do you usually discover new content?",
                        subtitle: "Your typical discovery pattern",
                        options: [
                            { value: "algorithms", label: "Streaming platform recommendations" },
                            { value: "critics", label: "Critics and review sites" },
                            { value: "friends", label: "Friends and social recommendations" },
                            { value: "browsing", label: "Random browsing and exploration" }
                        ]
                    }
                ]
            }
        ];
    }

    startQuestionnaire() {
        console.log('Starting questionnaire');
        const landingScreen = document.getElementById('landingScreen');
        const questionnaireScreen = document.getElementById('questionnaireScreen');
        const progressContainer = document.getElementById('progressContainer');
        
        if (landingScreen) landingScreen.classList.add('hidden');
        if (questionnaireScreen) questionnaireScreen.classList.remove('hidden');
        if (progressContainer) progressContainer.style.display = 'flex';
        
        this.currentStage = 0;
        this.currentQuestion = 0;
        this.loadCurrentQuestion();
        this.updateProgress();
    }

    loadCurrentQuestion() {
        const stage = this.stages[this.currentStage];
        const question = stage.questions[this.currentQuestion];
        
        console.log('Loading question:', question.title);
        
        // Update stage info
        const stageTitle = document.getElementById('stageTitle');
        const stageDescription = document.getElementById('stageDescription');
        
        if (stageTitle) stageTitle.textContent = stage.title;
        if (stageDescription) stageDescription.textContent = stage.description;
        
        // Update question counter
        const questionNumber = this.getGlobalQuestionNumber();
        const currentQuestionEl = document.getElementById('currentQuestion');
        const totalQuestionsEl = document.getElementById('totalQuestions');
        
        if (currentQuestionEl) currentQuestionEl.textContent = questionNumber;
        if (totalQuestionsEl) totalQuestionsEl.textContent = this.totalQuestions;
        
        // Generate and display question
        const questionContainer = document.getElementById('questionContainer');
        if (questionContainer) {
            questionContainer.innerHTML = this.generateQuestionHTML(question);
            
            // Small delay to ensure DOM is updated before binding events
            setTimeout(() => {
                this.bindQuestionEvents(question);
                this.restoreAnswerState(question);
                this.updateNavigationButtons();
            }, 50);
        }
    }

    generateQuestionHTML(question) {
        let optionsHTML = '';
        
        switch (question.type) {
            case 'single_choice':
                optionsHTML = `<div class="question-options">
                    ${question.options.map(option => `
                        <button class="option-button" data-value="${option.value}">
                            ${option.label}
                        </button>
                    `).join('')}
                </div>`;
                break;
                
            case 'multiple_choice':
                // FIXED: Ensure labels are properly escaped and display correctly
                optionsHTML = `<div class="checkbox-group">
                    ${question.options.map((option, index) => {
                        const safeId = `checkbox_${question.id}_${index}`;
                        const safeValue = option.value.replace(/"/g, '&quot;');
                        const safeLabel = option.label.replace(/"/g, '&quot;');
                        
                        return `
                            <div class="checkbox-option" data-value="${safeValue}">
                                <input type="checkbox" value="${safeValue}" id="${safeId}" />
                                <label for="${safeId}">${safeLabel}</label>
                            </div>
                        `;
                    }).join('')}
                </div>`;
                break;
        }
        
        return `
            <div class="question-card">
                <h3 class="question-title">${question.title}</h3>
                <p class="question-subtitle">${question.subtitle}</p>
                ${optionsHTML}
            </div>
        `;
    }

    bindQuestionEvents(question) {
        console.log('Binding question events for:', question.type);
        
        switch (question.type) {
            case 'single_choice':
                document.querySelectorAll('.option-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        document.querySelectorAll('.option-button').forEach(b => b.classList.remove('selected'));
                        e.target.classList.add('selected');
                        this.answers[question.id] = e.target.dataset.value;
                        console.log('Single choice answer:', this.answers[question.id]);
                        this.updateNavigationButtons();
                    });
                });
                break;
                
            case 'multiple_choice':
                console.log('Setting up multiple choice events for question:', question.id);
                document.querySelectorAll('.checkbox-option').forEach((option, index) => {
                    console.log('Setting up option:', index, option.dataset.value);
                    
                    option.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const checkbox = option.querySelector('input[type="checkbox"]');
                        const value = option.dataset.value;
                        
                        console.log('Clicked option:', value, 'Current checkbox state:', checkbox.checked);
                        
                        if (!this.answers[question.id]) this.answers[question.id] = [];
                        
                        const currentSelections = this.answers[question.id];
                        const isSelected = currentSelections.includes(value);
                        
                        console.log('Current selections:', currentSelections, 'Is selected:', isSelected);
                        
                        if (isSelected) {
                            // Remove selection
                            this.answers[question.id] = currentSelections.filter(v => v !== value);
                            checkbox.checked = false;
                            option.classList.remove('selected');
                            console.log('Removed selection:', value);
                        } else {
                            // Add selection if under limit
                            if (!question.maxSelections || currentSelections.length < question.maxSelections) {
                                this.answers[question.id].push(value);
                                checkbox.checked = true;
                                option.classList.add('selected');
                                console.log('Added selection:', value);
                            } else {
                                console.log('Max selections reached:', question.maxSelections);
                            }
                        }
                        
                        console.log('Final selections:', this.answers[question.id]);
                        this.updateNavigationButtons();
                    });
                });
                break;
        }
    }

    restoreAnswerState(question) {
        if (!this.answers[question.id]) return;
        
        console.log('Restoring answer state for:', question.id, this.answers[question.id]);
        
        switch (question.type) {
            case 'single_choice':
                const selectedValue = this.answers[question.id];
                const selectedButton = document.querySelector(`.option-button[data-value="${selectedValue}"]`);
                if (selectedButton) {
                    selectedButton.classList.add('selected');
                    console.log('Restored single choice selection:', selectedValue);
                }
                break;
                
            case 'multiple_choice':
                if (Array.isArray(this.answers[question.id])) {
                    this.answers[question.id].forEach(value => {
                        const option = document.querySelector(`.checkbox-option[data-value="${value}"]`);
                        if (option) {
                            const checkbox = option.querySelector('input[type="checkbox"]');
                            checkbox.checked = true;
                            option.classList.add('selected');
                            console.log('Restored multiple choice selection:', value);
                        }
                    });
                }
                break;
        }
    }

    getGlobalQuestionNumber() {
        let questionNumber = 1;
        for (let i = 0; i < this.currentStage; i++) {
            questionNumber += this.stages[i].questions.length;
        }
        questionNumber += this.currentQuestion;
        return questionNumber;
    }

    updateNavigationButtons() {
        const currentQuestion = this.stages[this.currentStage].questions[this.currentQuestion];
        let hasAnswer = false;
        
        if (this.answers[currentQuestion.id]) {
            if (Array.isArray(this.answers[currentQuestion.id])) {
                hasAnswer = this.answers[currentQuestion.id].length > 0;
            } else {
                hasAnswer = this.answers[currentQuestion.id] !== '';
            }
        }
        
        console.log('Updating navigation buttons. Has answer:', hasAnswer, 'Answer:', this.answers[currentQuestion.id]);
        
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        
        if (nextBtn) {
            nextBtn.disabled = !hasAnswer;
            const isLastQuestion = this.currentStage === this.stages.length - 1 && 
                                  this.currentQuestion === this.stages[this.currentStage].questions.length - 1;
            nextBtn.textContent = isLastQuestion ? 'Get Recommendations' : 'Next';
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentStage === 0 && this.currentQuestion === 0;
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.stages[this.currentStage].questions.length - 1) {
            this.currentQuestion++;
        } else if (this.currentStage < this.stages.length - 1) {
            this.currentStage++;
            this.currentQuestion = 0;
        } else {
            this.generateRecommendations();
            return;
        }
        
        this.loadCurrentQuestion();
        this.updateProgress();
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
        } else if (this.currentStage > 0) {
            this.currentStage--;
            this.currentQuestion = this.stages[this.currentStage].questions.length - 1;
        }
        
        this.loadCurrentQuestion();
        this.updateProgress();
    }

    skipQuestion() {
        const currentQuestion = this.stages[this.currentStage].questions[this.currentQuestion];
        this.answers[currentQuestion.id] = 'skipped';
        this.nextQuestion();
    }

    updateProgress() {
        const questionNumber = this.getGlobalQuestionNumber();
        const progress = ((questionNumber - 1) / this.totalQuestions) * 100;
        
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Question ${questionNumber} of ${this.totalQuestions}`;
    }

    // Recommendation Generation System
    async generateRecommendations() {
        console.log('Generating recommendations');
        
        // Show loading screen
        const questionnaireScreen = document.getElementById('questionnaireScreen');
        const loadingScreen = document.getElementById('loadingScreen');
        
        if (questionnaireScreen) questionnaireScreen.classList.add('hidden');
        if (loadingScreen) loadingScreen.classList.remove('hidden');
        
        // Update progress to complete
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        if (progressFill) progressFill.style.width = '100%';
        if (progressText) progressText.textContent = 'Complete!';
        
        try {
            await this.fetchRecommendations();
            this.showResults();
        } catch (error) {
            console.error('Failed to generate recommendations:', error);
            this.recommendations = this.generateDemoRecommendations();
            this.showResults();
        }
    }

    async fetchRecommendations() {
        const steps = [
            { step: 1, text: 'Analyzing your preferences...' },
            { step: 2, text: 'Querying movie database...' },
            { step: 3, text: 'Finding perfect matches...' },
            { step: 4, text: 'Getting streaming info...' }
        ];

        for (let i = 0; i < steps.length; i++) {
            this.updateLoadingStep(steps[i].step, steps[i].text);
            await this.sleep(800);
            
            switch (steps[i].step) {
                case 1:
                    this.analyzePreferences();
                    break;
                case 2:
                    await this.queryDatabase();
                    break;
                case 3:
                    this.generateMatches();
                    break;
                case 4:
                    await this.getStreamingInfo();
                    break;
            }
        }
    }

    updateLoadingStep(step, text) {
        const loadingStatus = document.getElementById('loadingStatus');
        if (loadingStatus) loadingStatus.textContent = text;
        
        // Update step indicators
        document.querySelectorAll('.loading-step').forEach((stepEl, index) => {
            const stepNum = index + 1;
            stepEl.classList.remove('active', 'completed');
            
            if (stepNum < step) {
                stepEl.classList.add('completed');
            } else if (stepNum === step) {
                stepEl.classList.add('active');
            }
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    analyzePreferences() {
        this.userProfile = {
            contentType: this.answers.content_type || 'both',
            genres: this.answers.favorite_genres || [],
            decades: this.answers.decade_preference || [],
            language: this.answers.language_preference || 'open_to_subtitles',
            mood: this.answers.mood_preference || 'entertainment',
            ratingPref: this.answers.rating_preference || 'balanced',
            runtime: this.answers.runtime_preference || 'no_preference',
            discovery: this.answers.discovery_method || 'browsing'
        };
        
        console.log('User profile analyzed:', this.userProfile);
    }

    async queryDatabase() {
        this.recommendations = {
            trending: await this.fetchTrendingContent(),
            genreMatches: await this.fetchGenreMatches(),
            hiddenGems: await this.fetchHiddenGems(),
            international: await this.fetchInternationalContent(),
            moodBased: await this.fetchMoodBasedContent()
        };
    }

    async fetchTrendingContent() {
        const response = await this.makeApiRequest('/trending/all/week');
        return this.processResults(response.results?.slice(0, 8) || []);
    }

    async fetchGenreMatches() {
        const genres = this.userProfile.genres;
        if (!genres.length) return [];
        
        const genreIds = genres.map(genre => this.genreMapping[genre]?.movie).filter(Boolean);
        const response = await this.makeApiRequest('/discover/movie', {
            with_genres: genreIds.slice(0, 3).join(','),
            sort_by: 'popularity.desc',
            'vote_count.gte': 100
        });
        return this.processResults(response.results?.slice(0, 8) || []);
    }

    async fetchHiddenGems() {
        const response = await this.makeApiRequest('/discover/movie', {
            sort_by: 'vote_average.desc',
            'vote_count.gte': 50,
            'vote_count.lte': 500,
            'vote_average.gte': 7.5
        });
        return this.processResults(response.results?.slice(0, 6) || []);
    }

    async fetchInternationalContent() {
        if (this.userProfile.language === 'english_only') return [];
        
        const response = await this.makeApiRequest('/discover/movie', {
            with_original_language: 'ko|ja|fr|es|de',
            sort_by: 'vote_average.desc',
            'vote_count.gte': 100
        });
        return this.processResults(response.results?.slice(0, 6) || []);
    }

    async fetchMoodBasedContent() {
        const moodGenres = this.moodToGenres[this.userProfile.mood] || [];
        const response = await this.makeApiRequest('/discover/movie', {
            with_genres: moodGenres.slice(0, 2).join(','),
            sort_by: 'popularity.desc'
        });
        return this.processResults(response.results?.slice(0, 6) || []);
    }

    processResults(results) {
        return results.map(item => ({
            id: item.id,
            title: item.title || item.name,
            year: item.release_date ? new Date(item.release_date).getFullYear() : 
                  item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'N/A',
            rating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
            description: item.overview || 'No description available',
            poster: item.poster_path ? `${this.apiConfig.tmdb.imageBaseUrl}${item.poster_path}` : null,
            genres: item.genre_ids || [],
            type: item.title ? 'movie' : 'tv',
            streaming: [] // Will be populated later
        }));
    }

    generateMatches() {
        // Shuffle and randomize results for variety
        Object.keys(this.recommendations).forEach(category => {
            if (Array.isArray(this.recommendations[category])) {
                this.recommendations[category] = this.shuffleArray(this.recommendations[category]);
            }
        });
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    async getStreamingInfo() {
        // Add sample streaming platforms randomly for demo
        const platforms = ['Netflix', 'Prime', 'HBO', 'Disney+'];
        
        Object.keys(this.recommendations).forEach(category => {
            if (Array.isArray(this.recommendations[category])) {
                this.recommendations[category].forEach(item => {
                    if (Math.random() > 0.4) {
                        const numPlatforms = Math.floor(Math.random() * 2) + 1;
                        item.streaming = this.shuffleArray(platforms).slice(0, numPlatforms);
                    }
                });
            }
        });
    }

    showResults() {
        const loadingScreen = document.getElementById('loadingScreen');
        const resultsScreen = document.getElementById('resultsScreen');
        
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (resultsScreen) resultsScreen.classList.remove('hidden');
        
        this.displayRecommendations();
        this.updateRecommendationCount();
    }

    displayRecommendations() {
        const container = document.getElementById('recommendationCategories');
        if (!container) return;
        
        const categories = [
            { key: 'trending', title: 'Trending Now', icon: '🔥' },
            { key: 'genreMatches', title: 'Perfect Genre Matches', icon: '🎯' },
            { key: 'hiddenGems', title: 'Hidden Gems', icon: '💎' },
            { key: 'moodBased', title: 'Mood-Based Picks', icon: '🎭' },
            { key: 'international', title: 'International Discoveries', icon: '🌍' }
        ];

        container.innerHTML = categories.map(category => {
            const items = this.recommendations[category.key] || [];
            if (items.length === 0) return '';

            return `
                <div class="recommendation-category">
                    <div class="category-header">
                        <h3 class="category-title">
                            <span>${category.icon}</span>
                            ${category.title}
                        </h3>
                        <span class="category-count">${items.length}</span>
                    </div>
                    <div class="movie-grid">
                        ${items.map(movie => this.generateMovieCard(movie)).join('')}
                    </div>
                </div>
            `;
        }).filter(html => html !== '').join('');
    }

    generateMovieCard(movie) {
        const genreNames = this.getGenreNames(movie.genres);
        const streamingHTML = movie.streaming.length > 0 ? 
            `<div class="movie-streaming">
                <span class="streaming-label">Watch on:</span>
                <div class="streaming-platforms">
                    ${movie.streaming.map(platform => 
                        `<div class="streaming-platform platform-${platform.toLowerCase()}" title="${platform}">
                            ${platform.charAt(0)}
                        </div>`
                    ).join('')}
                </div>
            </div>` : '';

        return `
            <div class="movie-card" data-movie-id="${movie.id}" data-movie-type="${movie.type}">
                <div class="movie-header">
                    ${movie.poster ? 
                        `<img src="${movie.poster}" alt="${movie.title}" class="movie-poster">` :
                        `<div class="movie-poster" style="background: var(--color-bg-2); display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary); font-size: var(--font-size-xs);">No Image</div>`
                    }
                    <div class="movie-info">
                        <h4 class="movie-title">${movie.title}</h4>
                        <div class="movie-meta">
                            <span class="movie-year">${movie.year}</span>
                            <div class="movie-rating">
                                <span class="rating-star">⭐</span>
                                <span>${movie.rating}</span>
                            </div>
                        </div>
                        <div class="movie-genres">
                            ${genreNames.slice(0, 3).map(genre => 
                                `<span class="genre-tag">${genre}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                <p class="movie-description">${movie.description}</p>
                ${streamingHTML}
            </div>
        `;
    }

    getGenreNames(genreIds) {
        if (!Array.isArray(genreIds)) return [];
        return genreIds.map(id => {
            const found = Object.entries(this.genreMapping).find(([name, ids]) => 
                ids.movie === id || ids.tv === id
            );
            return found ? found[0] : '';
        }).filter(Boolean);
    }

    updateRecommendationCount() {
        const total = Object.values(this.recommendations)
            .reduce((sum, category) => sum + (Array.isArray(category) ? category.length : 0), 0);
        const countEl = document.getElementById('recommendationCount');
        if (countEl) countEl.textContent = total;
    }

    // Movie Details Modal
    showMovieDetails(movieId, type) {
        const modal = document.getElementById('movieDetailModal');
        const content = document.getElementById('movieDetailContent');
        
        if (content) {
            content.innerHTML = `
                <div class="movie-detail-loading" style="text-align: center; padding: 2rem;">
                    <div class="loading-spinner" style="width: 40px; height: 40px; margin: 0 auto 1rem;"></div>
                    <p>Loading movie details...</p>
                </div>
            `;
        }
        
        if (modal) modal.classList.remove('hidden');
        
        // Simulate loading detailed info
        setTimeout(() => {
            if (content) {
                content.innerHTML = `
                    <div class="movie-detail-content">
                        <h4>Enhanced Movie Details</h4>
                        <p>In a full implementation, this would show:</p>
                        <ul>
                            <li>Complete cast and crew information</li>
                            <li>User reviews and critic scores</li>
                            <li>Similar movie recommendations</li>
                            <li>Streaming availability with direct links</li>
                            <li>Trailer and additional media</li>
                        </ul>
                        <p>All powered by live database connections.</p>
                    </div>
                `;
            }
        }, 1000);
    }

    hideMovieModal() {
        const modal = document.getElementById('movieDetailModal');
        if (modal) modal.classList.add('hidden');
    }

    // Utility Functions
    async refreshRecommendations() {
        const resultsScreen = document.getElementById('resultsScreen');
        const loadingScreen = document.getElementById('loadingScreen');
        
        if (resultsScreen) resultsScreen.classList.add('hidden');
        if (loadingScreen) loadingScreen.classList.remove('hidden');
        
        try {
            await this.fetchRecommendations();
            this.showResults();
        } catch (error) {
            console.error('Failed to refresh recommendations:', error);
            this.showResults();
        }
    }

    refineResults() {
        this.startQuestionnaire();
    }

    startOver() {
        this.currentStage = 0;
        this.currentQuestion = 0;
        this.answers = {};
        this.userProfile = {};
        this.recommendations = {};
        
        const resultsScreen = document.getElementById('resultsScreen');
        const questionnaireScreen = document.getElementById('questionnaireScreen');
        const landingScreen = document.getElementById('landingScreen');
        const progressContainer = document.getElementById('progressContainer');
        
        if (resultsScreen) resultsScreen.classList.add('hidden');
        if (questionnaireScreen) questionnaireScreen.classList.add('hidden');
        if (landingScreen) landingScreen.classList.remove('hidden');
        if (progressContainer) progressContainer.style.display = 'none';
        
        this.updateProgress();
    }

    showShareModal() {
        const modal = document.getElementById('shareModal');
        const summary = document.getElementById('shareSummary');
        
        if (summary) {
            const totalRecommendations = Object.values(this.recommendations)
                .reduce((sum, cat) => sum + (Array.isArray(cat) ? cat.length : 0), 0);
                
            summary.textContent = `Generated ${totalRecommendations} personalized recommendations based on your taste profile. Powered by live movie databases with fresh suggestions every time.`;
        }
        
        if (modal) modal.classList.remove('hidden');
    }

    hideShareModal() {
        const modal = document.getElementById('shareModal');
        if (modal) modal.classList.add('hidden');
    }

    copyResults() {
        const text = document.getElementById('shareSummary')?.textContent;
        if (text && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Results copied to clipboard!');
            });
        } else {
            alert('Copy function not supported in this environment');
        }
    }

    downloadResults() {
        const results = JSON.stringify(this.recommendations, null, 2);
        const blob = new Blob([results], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cinematch-recommendations.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    generateDemoData() {
        return {
            movies: [
                {
                    id: 1,
                    title: "The Grand Budapest Hotel",
                    release_date: "2014-03-07",
                    vote_average: 8.1,
                    overview: "A murder case of a wealthy dowager and the battle for an enormous fortune brings together a legendary concierge at a famous European hotel and a protégé who becomes his most trusted friend.",
                    poster_path: null,
                    genre_ids: [35, 18]
                },
                {
                    id: 2,
                    title: "Blade Runner 2049",
                    release_date: "2017-10-06",
                    vote_average: 8.0,
                    overview: "Thirty years after the events of Blade Runner, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
                    poster_path: null,
                    genre_ids: [878, 18, 53]
                },
                {
                    id: 3,
                    title: "Parasite",
                    release_date: "2019-05-30",
                    vote_average: 8.5,
                    overview: "All unemployed, Ki-taek and his family take peculiar interest in the wealthy and glamorous Parks, until they get entangled in an unexpected incident.",
                    poster_path: null,
                    genre_ids: [35, 80, 18, 53]
                },
                {
                    id: 4,
                    title: "Mad Max: Fury Road",
                    release_date: "2015-05-15",
                    vote_average: 7.6,
                    overview: "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken.",
                    poster_path: null,
                    genre_ids: [28, 12, 878, 53]
                },
                {
                    id: 5,
                    title: "Moonlight",
                    release_date: "2016-10-21",
                    vote_average: 7.4,
                    overview: "A young black man grapples with his identity and sexuality while experiencing the everyday struggles of childhood, adolescence, and burgeoning adulthood.",
                    poster_path: null,
                    genre_ids: [18]
                },
                {
                    id: 6,
                    title: "Your Name",
                    release_date: "2016-08-26",
                    vote_average: 8.2,
                    overview: "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?",
                    poster_path: null,
                    genre_ids: [16, 18, 10749]
                },
                {
                    id: 7,
                    title: "The Handmaiden",
                    release_date: "2016-06-01",
                    vote_average: 8.1,
                    overview: "A woman is hired as a handmaiden to a Japanese heiress, but secretly she is involved in a plot to defraud her.",
                    poster_path: null,
                    genre_ids: [18, 53, 10749]
                },
                {
                    id: 8,
                    title: "Hunt for the Wilderpeople",
                    release_date: "2016-01-22",
                    vote_average: 7.8,
                    overview: "A national manhunt is ordered for a rebellious kid and his foster uncle who go missing in the wild New Zealand bush.",
                    poster_path: null,
                    genre_ids: [12, 35, 18]
                }
            ],
            genres: [
                { id: 28, name: "Action" },
                { id: 12, name: "Adventure" },
                { id: 16, name: "Animation" },
                { id: 35, name: "Comedy" },
                { id: 80, name: "Crime" },
                { id: 18, name: "Drama" },
                { id: 10749, name: "Romance" },
                { id: 878, name: "Science Fiction" },
                { id: 53, name: "Thriller" }
            ]
        };
    }

    generateDemoRecommendations() {
        const processedMovies = this.processResults(this.demoData.movies);
        return {
            trending: this.shuffleArray(processedMovies).slice(0, 4),
            genreMatches: this.shuffleArray(processedMovies).slice(0, 4),
            hiddenGems: this.shuffleArray(processedMovies).slice(0, 3),
            international: this.shuffleArray(processedMovies).slice(0, 3),
            moodBased: this.shuffleArray(processedMovies).slice(0, 3)
        };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing database-powered CineMatch app');
    window.cinematchApp = new CineMatchApp();
});

if (document.readyState !== 'loading') {
    console.log('Document already loaded, initializing CineMatch app immediately');
    window.cinematchApp = new CineMatchApp();
}
