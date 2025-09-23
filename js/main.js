// Main JavaScript functionality for Legal Ally
class LegalAlly {
    constructor() {
        this.currentStep = 1;
        this.selectedDocument = null;
        this.formData = {};
        this.customizations = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDocumentTypes();
        this.setupScrollAnimations();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('createDocumentBtn')?.addEventListener('click', () => this.openDocumentModal());
        document.getElementById('watchDemoBtn')?.addEventListener('click', () => this.playDemo());
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showLogin());
        document.getElementById('signupBtn')?.addEventListener('click', () => this.showSignup());

        // Modal controls
        document.getElementById('modalClose')?.addEventListener('click', () => this.closeModal());
        document.getElementById('modalOverlay')?.addEventListener('click', () => this.closeModal());

        // Wizard navigation
        document.getElementById('nextStep')?.addEventListener('click', () => this.nextStep());
        document.getElementById('prevStep')?.addEventListener('click', () => this.prevStep());
        document.getElementById('generateDocument')?.addEventListener('click', () => this.generateDocument());

        // Document search
        document.getElementById('documentSearch')?.addEventListener('input', (e) => this.searchDocuments(e.target.value));

        // Success modal actions
        document.getElementById('downloadDocument')?.addEventListener('click', () => this.downloadPDF());
        document.getElementById('downloadWord')?.addEventListener('click', () => this.downloadWord());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Close modals on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.querySelector('.nav-menu');
        
        toggle?.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.feature-card, .document-card, .trust-badge').forEach(el => {
            observer.observe(el);
        });
    }

    loadDocumentTypes() {
        const documentTypes = [
            {
                id: 'business-contract',
                title: 'Business Contracts',
                description: 'Professional agreements for business relationships',
                icon: '📋',
                features: ['Customizable terms', 'Legal compliance', 'Multi-party support'],
                category: 'business'
            },
            {
                id: 'rental-agreement',
                title: 'Rental Agreements',
                description: 'Comprehensive lease agreements for properties',
                icon: '🏠',
                features: ['State-specific laws', 'Tenant protections', 'Maintenance clauses'],
                category: 'real-estate'
            },
            {
                id: 'will-trust',
                title: 'Wills & Trusts',
                description: 'Estate planning documents for asset protection',
                icon: '⚖️',
                features: ['Asset distribution', 'Guardian designation', 'Tax optimization'],
                category: 'personal'
            },
            {
                id: 'llc-formation',
                title: 'LLC Formation',
                description: 'Complete business entity formation documents',
                icon: '🏢',
                features: ['Operating agreements', 'Member rights', 'Tax elections'],
                category: 'business'
            },
            {
                id: 'nda',
                title: 'Non-Disclosure Agreements',
                description: 'Protect confidential information and trade secrets',
                icon: '🔒',
                features: ['Mutual/Unilateral', 'Time limitations', 'Scope definitions'],
                category: 'business'
            },
            {
                id: 'employment-contract',
                title: 'Employment Contracts',
                description: 'Comprehensive employment agreements',
                icon: '👔',
                features: ['Compensation terms', 'Benefits package', 'Termination clauses'],
                category: 'business'
            }
        ];

        this.renderDocumentGrid(documentTypes);
        this.renderDocumentCategories(documentTypes);
    }

    renderDocumentGrid(documents) {
        const grid = document.getElementById('documentGrid');
        if (!grid) return;

        grid.innerHTML = documents.map(doc => `
            <div class="document-card hover-lift" data-document="${doc.id}">
                <div class="document-card-icon">${doc.icon}</div>
                <h3 class="document-card-title">${doc.title}</h3>
                <p class="document-card-description">${doc.description}</p>
                <ul class="document-card-features">
                    ${doc.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <div class="document-card-action">
                    <button class="btn btn-primary">Start Document</button>
                </div>
            </div>
        `).join('');

        // Add click handlers
        grid.querySelectorAll('.document-card').forEach(card => {
            card.addEventListener('click', () => {
                const docId = card.dataset.document;
                this.selectDocument(docId);
                this.openDocumentModal();
            });
        });
    }

    renderDocumentCategories(documents) {
        const container = document.getElementById('documentCategories');
        if (!container) return;

        const categories = [...new Set(documents.map(doc => doc.category))];
        
        container.innerHTML = categories.map(category => {
            const categoryDocs = documents.filter(doc => doc.category === category);
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
            
            return `
                <div class="category-section">
                    <h4 class="category-title">${categoryName}</h4>
                    <div class="category-items">
                        ${categoryDocs.map(doc => `
                            <div class="category-item" data-document="${doc.id}">
                                <div class="category-icon">${doc.icon}</div>
                                <div class="category-name">${doc.title}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers
        container.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                // Remove previous selection
                container.querySelectorAll('.category-item').forEach(i => i.classList.remove('selected'));
                // Add selection to clicked item
                item.classList.add('selected');
                
                const docId = item.dataset.document;
                this.selectDocument(docId);
            });
        });
    }

    selectDocument(documentId) {
        this.selectedDocument = documentId;
        console.log('Selected document:', documentId);
    }

    searchDocuments(query) {
        const items = document.querySelectorAll('.category-item');
        items.forEach(item => {
            const name = item.querySelector('.category-name').textContent.toLowerCase();
            const matches = name.includes(query.toLowerCase());
            item.style.display = matches ? 'block' : 'none';
        });
    }

    openDocumentModal() {
        const modal = document.getElementById('documentModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.resetWizard();
        }
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
        this.resetWizard();
    }

    resetWizard() {
        this.currentStep = 1;
        this.formData = {};
        this.customizations = {};
        this.updateWizardStep();
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < 4) {
                this.currentStep++;
                this.updateWizardStep();
                this.loadStepContent();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateWizardStep();
            this.loadStepContent();
        }
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.selectedDocument) {
                    this.showNotification('Please select a document type', 'warning');
                    return false;
                }
                return true;
            case 2:
                return this.validateForm();
            case 3:
                return true;
            default:
                return true;
        }
    }

    validateForm() {
        const form = document.getElementById('documentForm');
        if (!form) return true;

        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        if (!isValid) {
            this.showNotification('Please fill in all required fields', 'error');
        }

        return isValid;
    }

    updateWizardStep() {
        // Update step visibility
        document.querySelectorAll('.wizard-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const generateBtn = document.getElementById('generateDocument');

        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        if (nextBtn) nextBtn.style.display = this.currentStep < 4 ? 'block' : 'none';
        if (generateBtn) generateBtn.style.display = this.currentStep === 4 ? 'block' : 'none';

        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const progress = (this.currentStep / 4) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    loadStepContent() {
        switch (this.currentStep) {
            case 2:
                this.loadDocumentForm();
                break;
            case 3:
                this.loadCustomizationOptions();
                break;
            case 4:
                this.loadDocumentPreview();
                break;
        }
    }

    loadDocumentForm() {
        const form = document.getElementById('documentForm');
        if (!form) return;

        // Sample form fields based on document type
        const formFields = this.getFormFields(this.selectedDocument);
        
        form.innerHTML = formFields.map(field => {
            switch (field.type) {
                case 'text':
                case 'email':
                case 'tel':
                    return `
                        <div class="form-group">
                            <label class="form-label">
                                ${field.label}
                                ${field.required ? '<span class="required">*</span>' : ''}
                            </label>
                            <input type="${field.type}" class="form-input" name="${field.name}" 
                                   ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}">
                            ${field.help ? `<div class="form-help">${field.help}</div>` : ''}
                        </div>
                    `;
                case 'textarea':
                    return `
                        <div class="form-group">
                            <label class="form-label">
                                ${field.label}
                                ${field.required ? '<span class="required">*</span>' : ''}
                            </label>
                            <textarea class="form-input form-textarea" name="${field.name}" 
                                      ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}"></textarea>
                            ${field.help ? `<div class="form-help">${field.help}</div>` : ''}
                        </div>
                    `;
                case 'select':
                    return `
                        <div class="form-group">
                            <label class="form-label">
                                ${field.label}
                                ${field.required ? '<span class="required">*</span>' : ''}
                            </label>
                            <select class="form-select" name="${field.name}" ${field.required ? 'required' : ''}>
                                <option value="">Select ${field.label}</option>
                                ${field.options.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
                            </select>
                            ${field.help ? `<div class="form-help">${field.help}</div>` : ''}
                        </div>
                    `;
                default:
                    return '';
            }
        }).join('');

        // Add form change listeners
        form.addEventListener('change', (e) => {
            this.formData[e.target.name] = e.target.value;
        });

        form.addEventListener('input', (e) => {
            this.formData[e.target.name] = e.target.value;
        });
    }

    getFormFields(documentType) {
        const commonFields = [
            { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full legal name' },
            { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'your@email.com' },
            { name: 'phone', label: 'Phone Number', type: 'tel', required: false, placeholder: '(555) 123-4567' }
        ];

        const specificFields = {
            'business-contract': [
                { name: 'companyName', label: 'Company Name', type: 'text', required: true },
                { name: 'contractType', label: 'Contract Type', type: 'select', required: true, 
                  options: [
                      { value: 'service', label: 'Service Agreement' },
                      { value: 'supply', label: 'Supply Agreement' },
                      { value: 'partnership', label: 'Partnership Agreement' }
                  ]
                },
                { name: 'contractValue', label: 'Contract Value', type: 'text', required: true, placeholder: '$0.00' },
                { name: 'duration', label: 'Contract Duration', type: 'text', required: true, placeholder: 'e.g., 12 months' }
            ],
            'rental-agreement': [
                { name: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true },
                { name: 'rentAmount', label: 'Monthly Rent', type: 'text', required: true, placeholder: '$0.00' },
                { name: 'securityDeposit', label: 'Security Deposit', type: 'text', required: true, placeholder: '$0.00' },
                { name: 'leaseStart', label: 'Lease Start Date', type: 'date', required: true },
                { name: 'leaseTerm', label: 'Lease Term', type: 'select', required: true,
                  options: [
                      { value: '6', label: '6 months' },
                      { value: '12', label: '12 months' },
                      { value: '24', label: '24 months' }
                  ]
                }
            ],
            'nda': [
                { name: 'disclosingParty', label: 'Disclosing Party', type: 'text', required: true },
                { name: 'receivingParty', label: 'Receiving Party', type: 'text', required: true },
                { name: 'ndaType', label: 'NDA Type', type: 'select', required: true,
                  options: [
                      { value: 'mutual', label: 'Mutual NDA' },
                      { value: 'unilateral', label: 'Unilateral NDA' }
                  ]
                },
                { name: 'duration', label: 'Duration', type: 'select', required: true,
                  options: [
                      { value: '1', label: '1 year' },
                      { value: '2', label: '2 years' },
                      { value: '5', label: '5 years' },
                      { value: 'indefinite', label: 'Indefinite' }
                  ]
                }
            ]
        };

        return [...commonFields, ...(specificFields[documentType] || [])];
    }

    loadCustomizationOptions() {
        const container = document.getElementById('customizationOptions');
        if (!container) return;

        const options = this.getCustomizationOptions(this.selectedDocument);
        
        container.innerHTML = options.map(option => `
            <div class="option-group">
                <div class="option-title">${option.title}</div>
                <div class="option-description">${option.description}</div>
                <div class="option-toggle">
                    <div class="toggle-switch" data-option="${option.id}"></div>
                    <span>Include this clause</span>
                </div>
            </div>
        `).join('');

        // Add toggle listeners
        container.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const optionId = toggle.dataset.option;
                const isActive = toggle.classList.contains('active');
                
                toggle.classList.toggle('active');
                this.customizations[optionId] = !isActive;
            });
        });
    }

    getCustomizationOptions(documentType) {
        const options = {
            'business-contract': [
                {
                    id: 'termination',
                    title: 'Early Termination Clause',
                    description: 'Allows either party to terminate the contract with proper notice'
                },
                {
                    id: 'confidentiality',
                    title: 'Confidentiality Provisions',
                    description: 'Protects sensitive business information shared during the contract'
                },
                {
                    id: 'dispute-resolution',
                    title: 'Dispute Resolution',
                    description: 'Specifies mediation and arbitration procedures for conflicts'
                }
            ],
            'rental-agreement': [
                {
                    id: 'pet-policy',
                    title: 'Pet Policy',
                    description: 'Includes provisions for pets on the property'
                },
                {
                    id: 'maintenance',
                    title: 'Maintenance Responsibilities',
                    description: 'Clearly defines landlord and tenant maintenance duties'
                },
                {
                    id: 'utilities',
                    title: 'Utility Arrangements',
                    description: 'Specifies which utilities are included in rent'
                }
            ],
            'nda': [
                {
                    id: 'return-clause',
                    title: 'Information Return Clause',
                    description: 'Requires return of confidential materials upon request'
                },
                {
                    id: 'injunctive-relief',
                    title: 'Injunctive Relief',
                    description: 'Allows for immediate court action in case of breach'
                }
            ]
        };

        return options[documentType] || [];
    }

    loadDocumentPreview() {
        const container = document.getElementById('previewDocument');
        if (!container) return;

        const preview = this.generateDocumentPreview();
        container.innerHTML = preview;
    }

    generateDocumentPreview() {
        const docTitle = this.getDocumentTitle(this.selectedDocument);
        const currentDate = new Date().toLocaleDateString();
        
        return `
            <h1>${docTitle}</h1>
            <p><strong>Date:</strong> ${currentDate}</p>
            <p><strong>Parties:</strong> ${this.formData.fullName || '[Your Name]'} and [Other Party]</p>
            
            <h2>1. Agreement Overview</h2>
            <p>This agreement is entered into between the parties listed above for the purpose of [specific purpose based on document type].</p>
            
            <h2>2. Terms and Conditions</h2>
            <p>The following terms and conditions apply to this agreement:</p>
            <ul>
                <li>Duration: ${this.formData.duration || '[To be specified]'}</li>
                <li>Consideration: ${this.formData.contractValue || this.formData.rentAmount || '[To be specified]'}</li>
                <li>Effective Date: ${this.formData.leaseStart || currentDate}</li>
            </ul>
            
            ${Object.keys(this.customizations).filter(key => this.customizations[key]).length > 0 ? `
            <h2>3. Additional Provisions</h2>
            <p>The following additional clauses are included in this agreement:</p>
            <ul>
                ${Object.keys(this.customizations).filter(key => this.customizations[key]).map(key => 
                    `<li>${this.getClauseDescription(key)}</li>`
                ).join('')}
            </ul>
            ` : ''}
            
            <h2>4. Signatures</h2>
            <p>By signing below, all parties agree to the terms and conditions outlined in this document.</p>
            
            <div style="margin-top: 40px;">
                <p>___________________________ Date: ___________</p>
                <p>${this.formData.fullName || '[Your Name]'}</p>
            </div>
            
            <div style="margin-top: 40px;">
                <p>___________________________ Date: ___________</p>
                <p>[Other Party Name]</p>
            </div>
        `;
    }

    getDocumentTitle(documentType) {
        const titles = {
            'business-contract': 'Business Service Agreement',
            'rental-agreement': 'Residential Lease Agreement',
            'will-trust': 'Last Will and Testament',
            'llc-formation': 'Limited Liability Company Operating Agreement',
            'nda': 'Non-Disclosure Agreement',
            'employment-contract': 'Employment Agreement'
        };
        return titles[documentType] || 'Legal Document';
    }

    getClauseDescription(clauseId) {
        const descriptions = {
            'termination': 'Early termination provisions with 30-day notice',
            'confidentiality': 'Confidentiality and non-disclosure requirements',
            'dispute-resolution': 'Mediation and arbitration procedures',
            'pet-policy': 'Pet ownership and related responsibilities',
            'maintenance': 'Property maintenance and repair obligations',
            'utilities': 'Utility payment and service arrangements',
            'return-clause': 'Confidential information return requirements',
            'injunctive-relief': 'Injunctive relief provisions for breach'
        };
        return descriptions[clauseId] || 'Additional legal provision';
    }

    async generateDocument() {
        this.showLoading('Generating your legal document...');
        
        try {
            // Simulate document generation
            await this.delay(3000);
            
            this.hideLoading();
            this.closeModal();
            this.showSuccessModal();
            
        } catch (error) {
            this.hideLoading();
            this.showNotification('Error generating document. Please try again.', 'error');
        }
    }

    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = overlay?.querySelector('.loading-text');
        
        if (overlay) {
            overlay.classList.add('active');
            if (text) text.textContent = message;
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    downloadPDF() {
        // Simulate PDF download
        this.showNotification('PDF download started', 'success');
        this.closeModal();
    }

    downloadWord() {
        // Simulate Word download
        this.showNotification('Word document download started', 'success');
        this.closeModal();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    playDemo() {
        this.showNotification('Demo video coming soon!', 'info');
    }

    showLogin() {
        this.showNotification('Login functionality coming soon!', 'info');
    }

    showSignup() {
        this.showNotification('Sign up functionality coming soon!', 'info');
    }

    handleKeyboard(e) {
        // Handle keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    this.openDocumentModal();
                    break;
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new LegalAlly();
});

// Add notification styles dynamically
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--secondary-bg);
        border: 1px solid var(--accent-text);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        z-index: 4000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    }
    
    .notification-info {
        border-color: var(--accent-text);
    }
    
    .notification-success {
        border-color: var(--success);
    }
    
    .notification-warning {
        border-color: var(--warning);
    }
    
    .notification-error {
        border-color: var(--error);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-md);
    }
    
    .notification-message {
        color: var(--primary-text);
        font-size: var(--font-size-sm);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--secondary-text);
        cursor: pointer;
        font-size: var(--font-size-lg);
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        color: var(--primary-text);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);