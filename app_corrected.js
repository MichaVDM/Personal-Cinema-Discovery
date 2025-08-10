// CineMatch Application Logic - CORRECTED VERSION
class CineMatchApp {
    constructor() {
        this.currentStage = 0;
        this.currentQuestion = 0;
        this.totalQuestions = 0;
        this.answers = {};
        this.userProfile = {};

        // Data from the provided JSON
        this.sampleFilms = [
            {
                "title": "The Grand Budapest Hotel",
                "director": "Wes Anderson",
                "year": 2014,
                "genre": ["Comedy", "Drama"],
                "style": "Whimsical, Symmetrical, Colorful",
                "description": "A murder case of a wealthy dowager and the battle for an enormous fortune"
            },
            {
                "title": "Blade Runner 2049",
                "director": "Denis Villeneuve", 
                "year": 2017,
                "genre": ["Sci-Fi", "Drama"],
                "style": "Contemplative, Visual, Atmospheric",
                "description": "A young blade runner's discovery threatens to plunge what's left of society into chaos"
            },
            {
                "title": "Parasite",
                "director": "Bong Joon-ho",
                "year": 2019,
                "genre": ["Thriller", "Drama"],
                "style": "Social Commentary, Dark Comedy, Suspenseful",
                "description": "A poor family schemes to become employed by a wealthy family"
            },
            {
                "title": "Mad Max: Fury Road",
                "director": "George Miller",
                "year": 2015,
                "genre": ["Action", "Adventure"],
                "style": "High-Octane, Visual Storytelling, Practical Effects",
                "description": "A woman rebels against a tyrannical ruler in search of her homeland"
            },
            {
                "title": "Moonlight",
                "director": "Barry Jenkins",
                "year": 2016,
                "genre": ["Drama"],
                "style": "Intimate, Poetic, Character-Driven",
                "description": "A young black man grapples with identity and sexuality"
            }
        ];

        this.genres = [
            "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", 
            "Drama", "Family", "Fantasy", "Horror", "Musical", "Mystery", 
            "Romance", "Sci-Fi", "Thriller", "War", "Western", "Biographical",
            "Historical", "Experimental"
        ];

        this.decades = [
            "1920s-1940s (Early Cinema)", "1950s-1960s (Golden Age)", 
            "1970s (New Hollywood)", "1980s (Blockbuster Era)", 
            "1990s (Independent Boom)", "2000s (Digital Revolution)", 
            "2010s (Superhero Era)", "2020s (Streaming Age)"
        ];

        this.directors = [
            {"name": "Stanley Kubrick", "style": "Meticulous, Symmetrical, Philosophical"},
            {"name": "Quentin Tarantino", "style": "Dialogue-Heavy, Non-linear, Violent"},
            {"name": "Wes Anderson", "style": "Whimsical, Symmetrical, Colorful"},
            {"name": "Christopher Nolan", "style": "Complex, Cerebral, High-Concept"},
            {"name": "Hayao Miyazaki", "style": "Fantastical, Environmental, Hand-drawn"},
            {"name": "Coen Brothers", "style": "Quirky, Dark Comedy, Genre-bending"},
            {"name": "Denis Villeneuve", "style": "Atmospheric, Thoughtful, Visually Striking"},
            {"name": "Ari Aster", "style": "Disturbing, Artistic, Psychological"},
            {"name": "Greta Gerwig", "style": "Coming-of-age, Authentic, Character-driven"},
            {"name": "Jordan Peele", "style": "Social Commentary, Horror, Suspenseful"}
        ];

        this.moodCategories = [
            {
                "mood": "Feeling Contemplative",
                "description": "Thoughtful, slow-burn films that make you think",
                "examples": ["Stalker", "Her", "The Tree of Life"]
            },
            {
                "mood": "Need Entertainment", 
                "description": "Fun, engaging films perfect for relaxation",
                "examples": ["Ocean's Eleven", "The Princess Bride", "Spider-Verse"]
            },
            {
                "mood": "Emotionally Preparing",
                "description": "Films that will make you feel deeply",
                "examples": ["Manchester by the Sea", "Inside Out", "Call Me By Your Name"]
            },
            {
                "mood": "Seeking Adrenaline",
                "description": "High-energy, thrilling experiences", 
                "examples": ["John Wick", "Mission Impossible", "Mad Max"]
            }
        ];

        this.initializeStages();
        this.bindEvents();
    }

    bindEvents() {
        // Main navigation events
        document.getElementById('startQuestionnaireBtn').addEventListener('click', () => {
            this.startQuestionnaire();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousQuestion();
        });

        document.getElementById('skipBtn').addEventListener('click', () => {
            this.skipQuestion();
        });

        // Results page events  
        document.getElementById('refineBtn').addEventListener('click', () => {
            this.refineResults();
        });

        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareProfile();
        });

        document.getElementById('startOverBtn').addEventListener('click', () => {
            this.startOver();
        });

        // Modal events
        document.getElementById('closeShareModal').addEventListener('click', () => {
            this.closeShareModal();
        });

        document.querySelector('.modal-backdrop').addEventListener('click', () => {
            this.closeShareModal();
        });
    }

    initializeStages() {
        this.stages = [
            {
                title: "Basic Preferences",
                subtitle: "Let's start with the fundamentals",
                questions: [
                    {
                        id: "favorite_genres",
                        type: "checkbox",
                        title: "What are your favorite film genres?",
                        subtitle: "Select up to 5 that appeal to you most",
                        options: this.genres.map(genre => ({ value: genre, label: genre })),
                        maxSelections: 5
                    },
                    {
                        id: "preferred_decades",
                        type: "checkbox", 
                        title: "Which eras of cinema appeal to you?",
                        subtitle: "Select up to 3 time periods",
                        options: this.decades.map(decade => ({ value: decade, label: decade })),
                        maxSelections: 3
                    },
                    {
                        id: "language_preference",
                        type: "radio",
                        title: "How do you feel about subtitled films?",
                        options: [
                            { value: "love", label: "I actively seek out international cinema" },
                            { value: "comfortable", label: "I'm comfortable with subtitles" },
                            { value: "occasional", label: "Occasionally, if highly recommended" },
                            { value: "prefer_dubbed", label: "I prefer dubbed versions" },
                            { value: "avoid", label: "I generally avoid foreign films" }
                        ]
                    },
                    {
                        id: "runtime_preference",
                        type: "radio",
                        title: "What's your ideal film length?",
                        options: [
                            { value: "short", label: "Under 90 minutes - keep it tight" },
                            { value: "medium", label: "90-120 minutes - the sweet spot" },
                            { value: "long", label: "2+ hours - I love epic storytelling" },
                            { value: "no_preference", label: "Length doesn't matter if it's good" }
                        ]
                    },
                    {
                        id: "viewing_context",
                        type: "checkbox",
                        title: "When do you typically watch films?",
                        subtitle: "Select all that apply",
                        options: [
                            { value: "solo_evening", label: "Solo viewing in the evening" },
                            { value: "with_partner", label: "Date nights with partner" },
                            { value: "friends", label: "With friends socially" },
                            { value: "family", label: "Family viewing" },
                            { value: "background", label: "As background while doing other things" },
                            { value: "focused", label: "Dedicated, focused viewing sessions" }
                        ],
                        maxSelections: 6
                    }
                ]
            },
            // Additional stages would follow the same pattern...
            {
                title: "Taste Profiling",
                subtitle: "Let's understand your specific preferences",
                questions: [
                    {
                        id: "director_comparison",
                        type: "radio",
                        title: "Between these directing styles, which appeals more?",
                        options: [
                            { value: "kubrick", label: "Stanley Kubrick - Meticulous, symmetrical, philosophical" },
                            { value: "tarantino", label: "Quentin Tarantino - Dialogue-heavy, non-linear, stylized violence" },
                            { value: "anderson", label: "Wes Anderson - Whimsical, highly stylized, quirky" },
                            { value: "nolan", label: "Christopher Nolan - Complex, cerebral, high-concept" }
                        ]
                    }
                    // More questions...
                ]
            },
            {
                title: "Recent Viewing",
                subtitle: "Help us understand your recent experiences",
                questions: [
                    {
                        id: "recent_favorites",
                        type: "textarea",
                        title: "Name 2-3 films you've watched and loved in the past year",
                        subtitle: "Don't worry about spelling - just the titles that made an impression",
                        placeholder: "e.g., Everything Everywhere All at Once, The Banshees of Inisherin..."
                    },
                    {
                        id: "recent_disappointments", 
                        type: "textarea",
                        title: "Name 1-2 films you didn't enjoy recently",
                        subtitle: "What didn't work for you?",
                        placeholder: "Film titles and optionally why they didn't resonate..."
                    }
                ]
            },
            {
                title: "Mood Mapping",
                subtitle: "Different moods, different films",
                questions: [
                    {
                        id: "contemplative_mood",
                        type: "radio", 
                        title: "When you're in a contemplative mood, you prefer:",
                        options: [
                            { value: "slow_philosophical", label: "Slow, philosophical films that make me think" },
                            { value: "character_study", label: "Deep character studies and relationships" },
                            { value: "visual_poetry", label: "Visually poetic, artistic cinematography" },
                            { value: "avoid_heavy", label: "I avoid heavy films when contemplative" }
                        ]
                    }
                ]
            }
        ];

        this.totalQuestions = this.stages.reduce((sum, stage) => sum + stage.questions.length, 0);
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(screenId).classList.add('active');

        // Update progress
        this.updateProgress();
    }

    startQuestionnaire() {
        this.showScreen('questionnaireScreen');
        this.renderCurrentQuestion();
    }

    renderCurrentQuestion() {
        const currentStage = this.stages[this.currentStage];
        const question = currentStage.questions[this.currentQuestion];

        // Update stage info
        document.getElementById('stageTitle').textContent = currentStage.title;
        document.getElementById('stageSubtitle').textContent = currentStage.subtitle;

        // Build options HTML based on question type
        let optionsHTML = '';

        if (question.type === 'radio') {
            optionsHTML = question.options.map(option => `
                <button class="option-button" data-value="${option.value}">
                    ${option.label}
                </button>
            `).join('');
        } else if (question.type === 'checkbox') {
            optionsHTML = `<div class="checkbox-group">
                ${question.options.map(option => `
                    <label class="checkbox-option" data-value="${option.value}">
                        <input type="checkbox" value="${option.value}">
                        <span class="checkbox-label">${option.label}</span>
                    </label>
                `).join('')}
            </div>`;
        } else if (question.type === 'textarea') {
            optionsHTML = `<textarea 
                class="question-textarea" 
                placeholder="${question.placeholder || ''}"
                data-question-id="${question.id}"></textarea>`;
        } else if (question.type === 'select') {
            optionsHTML = `<select class="question-select" data-question-id="${question.id}">
                <option value="">Choose an option...</option>
                ${question.options.map(option => `
                    <option value="${option.value}">${option.label}</option>
                `).join('')}
            </select>`;
        }

        // Render question
        document.getElementById('questionContent').innerHTML = `
            <div class="question-header">
                <h3 class="question-title">${question.title}</h3>
                ${question.subtitle ? `<p class="question-subtitle">${question.subtitle}</p>` : ''}
            </div>
            <div class="question-options">
                ${optionsHTML}
            </div>
        `;

        // Bind question-specific events
        this.bindQuestionEvents(question);

        // Restore previous answers if they exist
        this.restorePreviousAnswers(question);

        // Update navigation
        this.updateNavigation();
    }

    bindQuestionEvents(question) {
        if (question.type === 'radio') {
            document.querySelectorAll('.option-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    // Clear all selections
                    document.querySelectorAll('.option-button').forEach(b => b.classList.remove('selected'));
                    // Add selection to clicked button
                    e.target.classList.add('selected');

                    // Store answer
                    this.answers[question.id] = e.target.dataset.value;
                });
            });
        } else if (question.type === 'checkbox') {
            // CORRECTED CHECKBOX HANDLING
            document.querySelectorAll('.checkbox-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent default label click behavior

                    const checkbox = option.querySelector('input[type="checkbox"]');
                    const value = option.dataset.value;

                    // Initialize answer array if needed
                    if (!this.answers[question.id]) this.answers[question.id] = [];

                    const currentSelections = this.answers[question.id];
                    const isCurrentlySelected = currentSelections.includes(value);

                    if (isCurrentlySelected) {
                        // Remove selection
                        this.answers[question.id] = currentSelections.filter(v => v !== value);
                        checkbox.checked = false;
                        option.classList.remove('selected');
                    } else {
                        // Add selection if under limit
                        if (!question.maxSelections || currentSelections.length < question.maxSelections) {
                            this.answers[question.id].push(value);
                            checkbox.checked = true;
                            option.classList.add('selected');
                        }
                    }
                });
            });
        } else if (question.type === 'textarea') {
            const textarea = document.querySelector('.question-textarea');
            textarea.addEventListener('input', (e) => {
                this.answers[question.id] = e.target.value;
            });
        } else if (question.type === 'select') {
            const select = document.querySelector('.question-select');
            select.addEventListener('change', (e) => {
                this.answers[question.id] = e.target.value;
            });
        }
    }

    restorePreviousAnswers(question) {
        const savedAnswer = this.answers[question.id];
        if (!savedAnswer) return;

        if (question.type === 'radio') {
            document.querySelectorAll('.option-button').forEach(button => {
                if (button.dataset.value === savedAnswer) {
                    button.classList.add('selected');
                }
            });
        } else if (question.type === 'checkbox') {
            const savedSelections = Array.isArray(savedAnswer) ? savedAnswer : [];
            document.querySelectorAll('.checkbox-option').forEach(option => {
                const value = option.dataset.value;
                if (savedSelections.includes(value)) {
                    const checkbox = option.querySelector('input[type="checkbox"]');
                    checkbox.checked = true;
                    option.classList.add('selected');
                }
            });
        } else if (question.type === 'textarea') {
            const textarea = document.querySelector('.question-textarea');
            textarea.value = savedAnswer;
        } else if (question.type === 'select') {
            const select = document.querySelector('.question-select');
            select.value = savedAnswer;
        }
    }

    updateNavigation() {
        const questionNumber = this.getQuestionNumber();

        // Update question counter
        document.getElementById('questionCounter').textContent = `${questionNumber} of ${this.totalQuestions}`;

        // Update buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const skipBtn = document.getElementById('skipBtn');

        // Previous button
        prevBtn.style.display = (this.currentStage === 0 && this.currentQuestion === 0) ? 'none' : 'block';

        // Next button text and availability
        const currentQuestion = this.stages[this.currentStage].questions[this.currentQuestion];
        const hasAnswer = Array.isArray(this.answers[currentQuestion.id]) ? 
            this.answers[currentQuestion.id].length > 0 : 
            this.answers[currentQuestion.id];

        nextBtn.disabled = !hasAnswer;

        const isLastQuestion = this.currentStage === this.stages.length - 1 && 
                               this.currentQuestion === this.stages[this.currentStage].questions.length - 1;

        nextBtn.textContent = isLastQuestion ? 'Get My Results' : 'Next';

        // Skip button
        skipBtn.style.display = hasAnswer ? 'none' : 'block';
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

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
        } else if (this.currentStage > 0) {
            this.currentStage--;
            this.currentQuestion = this.stages[this.currentStage].questions.length - 1;
        }

        this.renderCurrentQuestion();
    }

    skipQuestion() {
        // Set a default "no preference" answer
        const currentQuestion = this.stages[this.currentStage].questions[this.currentQuestion];

        if (currentQuestion.type === 'checkbox') {
            this.answers[currentQuestion.id] = [];
        } else {
            this.answers[currentQuestion.id] = 'no_preference';
        }

        this.nextQuestion();
    }

    getQuestionNumber() {
        let questionNumber = 1;

        for (let i = 0; i < this.currentStage; i++) {
            questionNumber += this.stages[i].questions.length;
        }

        questionNumber += this.currentQuestion;
        return questionNumber;
    }

    updateProgress() {
        const questionNumber = this.getQuestionNumber();
        const progress = (questionNumber / this.totalQuestions) * 100;

        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = 
            `Question ${questionNumber} of ${this.totalQuestions}`;
    }

    generateResults() {
        this.createUserProfile();
        this.renderResults();
        this.showScreen('resultsScreen');
    }

    createUserProfile() {
        this.userProfile = {
            genres: this.answers.favorite_genres || [],
            decades: this.answers.preferred_decades || [],
            international: this.answers.language_preference === 'love' || 
                          this.answers.language_preference === 'comfortable',
            runtime: this.answers.runtime_preference,
            context: this.answers.viewing_context || [],
            director_style: this.answers.director_comparison,
            recent_favorites: this.answers.recent_favorites,
            recent_disappointments: this.answers.recent_disappointments,
            contemplative_style: this.answers.contemplative_mood
        };
    }

    renderResults() {
        const genreList = Array.isArray(this.userProfile.genres) ? 
            this.userProfile.genres.slice(0, 3).join(', ') : 'Mixed preferences';

        document.getElementById('profileSummary').innerHTML = `
            <div class="profile-overview">
                <h3>Your Cinema Profile</h3>
                <p>Based on your responses, we've created a personalized recommendation engine.</p>

                <div class="profile-highlights">
                    <div class="highlight-item">
                        <strong>Primary Interests:</strong>
                        <p>You're drawn to <strong>${genreList}</strong> films with a preference for
                        ${this.userProfile.runtime === 'long' ? 'epic storytelling' : 
                          this.userProfile.runtime === 'short' ? 'concise narratives' : 'well-paced stories'}.
                        </p>
                    </div>
                </div>
            </div>
        `;

        this.renderRecommendations();
    }

    renderRecommendations() {
        const recommendations = this.generateRecommendations();

        document.getElementById('recommendationsContainer').innerHTML = `
            <div class="recommendations-section">
                <h3>🎬 Your Personalized Recommendations</h3>
                ${recommendations.map(film => `
                    <div class="recommendation-card">
                        <div class="movie-title">${film.title}</div>
                        <div class="movie-meta">${film.director} (${film.year}) • ${film.genre.join(', ')}</div>
                        <div class="movie-description">${film.description}</div>
                        <div class="recommendation-reason">
                            <strong>Why you'll love it:</strong> ${film.reason}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateRecommendations() {
        // Simple recommendation logic - in a real app this would be more sophisticated
        return this.sampleFilms.slice(0, 2).map(film => ({
            ...film,
            reason: "Matches your taste profile and viewing preferences"
        }));
    }

    shareProfile() {
        const shareText = `My CineMatch Profile:
• Favorite genres: ${Array.isArray(this.userProfile.genres) ? this.userProfile.genres.join(', ') : 'Mixed'}
• Era preference: ${Array.isArray(this.userProfile.decades) ? this.userProfile.decades.join(', ') : 'Various'}
• Runtime preference: ${this.userProfile.runtime}
• International films: ${this.userProfile.international ? 'Yes' : 'Limited'}

Discover your cinema matches at CineMatch!`;

        document.getElementById('shareText').value = shareText;
        document.getElementById('shareModal').classList.add('active');
    }

    closeShareModal() {
        document.getElementById('shareModal').classList.remove('active');
    }

    refineResults() {
        // Go back to first question for refinement
        this.currentStage = 0;
        this.currentQuestion = 0;
        this.showScreen('questionnaireScreen');
        this.renderCurrentQuestion();
    }

    startOver() {
        // Reset all data
        this.currentStage = 0;
        this.currentQuestion = 0;
        this.answers = {};
        this.userProfile = {};
        this.showScreen('landingScreen');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.cineMatchApp = new CineMatchApp();
});