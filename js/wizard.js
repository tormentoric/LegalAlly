// Document Creation Wizard
class DocumentWizard {
    constructor(legalAlly) {
        this.legalAlly = legalAlly;
        this.documentGenerator = new DocumentGenerator();
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.customizations = {};
        this.selectedDocument = null;
        this.validationErrors = [];
        
        this.init();
    }

    init() {
        this.setupStepNavigation();
        this.setupFormValidation();
        this.setupAutoSave();
    }

    setupStepNavigation() {
        const nextBtn = document.getElementById('nextStep');
        const prevBtn = document.getElementById('prevStep');
        const generateBtn = document.getElementById('generateDocument');

        nextBtn?.addEventListener('click', () => this.handleNextStep());
        prevBtn?.addEventListener('click', () => this.handlePrevStep());
        generateBtn?.addEventListener('click', () => this.handleGenerateDocument());
    }

    setupFormValidation() {
        // Real-time validation for form fields
        document.addEventListener('input', (e) => {
            if (e.target.matches('.form-input, .form-select, .form-textarea')) {
                this.validateField(e.target);
                this.updateFormData(e.target);
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.matches('.form-input, .form-select, .form-textarea')) {
                this.validateField(e.target);
                this.updateFormData(e.target);
            }
        });
    }

    setupAutoSave() {
        // Auto-save form data every 30 seconds
        setInterval(() => {
            if (Object.keys(this.formData).length > 0) {
                this.saveToLocalStorage();
            }
        }, 30000);
    }

    handleNextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepDisplay();
                this.loadStepContent();
                this.updateProgress();
            }
        }
    }

    handlePrevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.loadStepContent();
            this.updateProgress();
        }
    }

    async handleGenerateDocument() {
        if (this.validateCurrentStep()) {
            try {
                this.showGenerationProgress();
                
                // Validate the complete document
                const validation = this.documentGenerator.validateDocument(
                    this.selectedDocument, 
                    this.formData
                );

                if (!validation.isValid) {
                    this.showValidationErrors(validation.errors);
                    this.hideGenerationProgress();
                    return;
                }

                // Show warnings if any
                if (validation.warnings.length > 0) {
                    this.showValidationWarnings(validation.warnings);
                }

                // Generate the document
                const documentHTML = this.documentGenerator.generateDocument(
                    this.selectedDocument,
                    this.formData,
                    this.customizations
                );

                // Simulate processing time
                await this.delay(2000);

                // Store generated document
                this.storeGeneratedDocument(documentHTML);

                this.hideGenerationProgress();
                this.showSuccessModal();
                
            } catch (error) {
                console.error('Document generation error:', error);
                this.hideGenerationProgress();
                this.showError('Failed to generate document. Please try again.');
            }
        }
    }

    validateCurrentStep() {
        this.validationErrors = [];

        switch (this.currentStep) {
            case 1:
                return this.validateDocumentSelection();
            case 2:
                return this.validateFormData();
            case 3:
                return this.validateCustomizations();
            case 4:
                return this.validateReview();
            default:
                return true;
        }
    }

    validateDocumentSelection() {
        if (!this.selectedDocument) {
            this.validationErrors.push('Please select a document type to continue.');
            this.showValidationErrors(this.validationErrors);
            return false;
        }
        return true;
    }

    validateFormData() {
        const requiredFields = document.querySelectorAll('.form-input[required], .form-select[required], .form-textarea[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.markFieldAsError(field);
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Specific field validations
        const emailField = document.querySelector('input[name="email"]');
        if (emailField && emailField.value && !this.isValidEmail(emailField.value)) {
            this.markFieldAsError(emailField, 'Please enter a valid email address');
            isValid = false;
        }

        const phoneField = document.querySelector('input[name="phone"]');
        if (phoneField && phoneField.value && !this.isValidPhone(phoneField.value)) {
            this.markFieldAsError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }

        if (!isValid) {
            this.showError('Please correct the highlighted fields before continuing.');
        }

        return isValid;
    }

    validateCustomizations() {
        // Customizations are optional, so always valid
        return true;
    }

    validateReview() {
        // Final validation before generation
        const validation = this.documentGenerator.validateDocument(
            this.selectedDocument, 
            this.formData
        );

        if (!validation.isValid) {
            this.showValidationErrors(validation.errors);
            return false;
        }

        return true;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const isRequired = field.hasAttribute('required');

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (isRequired && !value) {
            this.markFieldAsError(field, 'This field is required');
            return false;
        }

        // Specific field validations
        switch (fieldName) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.markFieldAsError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    this.markFieldAsError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
            case 'contractValue':
            case 'rentAmount':
            case 'securityDeposit':
                if (value && !this.isValidCurrency(value)) {
                    this.markFieldAsError(field, 'Please enter a valid amount (e.g., $1,000.00)');
                    return false;
                }
                break;
            case 'leaseStart':
                if (value && !this.isValidDate(value)) {
                    this.markFieldAsError(field, 'Please enter a valid date');
                    return false;
                }
                break;
        }

        return true;
    }

    markFieldAsError(field, message = 'This field has an error') {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    updateFormData(field) {
        this.formData[field.name] = field.value;
        this.saveToLocalStorage();
    }

    updateStepDisplay() {
        // Update step visibility
        document.querySelectorAll('.wizard-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const generateBtn = document.getElementById('generateDocument');

        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';
        if (nextBtn) nextBtn.style.display = this.currentStep < this.totalSteps ? 'inline-flex' : 'none';
        if (generateBtn) generateBtn.style.display = this.currentStep === this.totalSteps ? 'inline-flex' : 'none';

        // Update step indicator if exists
        this.updateStepIndicator();
    }

    updateStepIndicator() {
        const indicator = document.querySelector('.step-indicator');
        if (indicator) {
            const steps = indicator.querySelectorAll('.step');
            steps.forEach((step, index) => {
                step.classList.toggle('active', index + 1 === this.currentStep);
                step.classList.toggle('completed', index + 1 < this.currentStep);
            });
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const progress = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    loadStepContent() {
        switch (this.currentStep) {
            case 1:
                this.loadDocumentSelection();
                break;
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

    loadDocumentSelection() {
        // Document selection is already loaded by main app
        // Just ensure the selected document is highlighted
        if (this.selectedDocument) {
            const selectedItem = document.querySelector(`[data-document="${this.selectedDocument}"]`);
            if (selectedItem) {
                selectedItem.classList.add('selected');
            }
        }
    }

    loadDocumentForm() {
        const form = document.getElementById('documentForm');
        if (!form) return;

        const formFields = this.getFormFields(this.selectedDocument);
        
        form.innerHTML = formFields.map(field => this.renderFormField(field)).join('');

        // Restore saved data
        this.restoreFormData();

        // Add enhanced form interactions
        this.setupFormEnhancements();
    }

    renderFormField(field) {
        const value = this.formData[field.name] || '';
        
        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'date':
                return `
                    <div class="form-group">
                        <label class="form-label">
                            ${field.label}
                            ${field.required ? '<span class="required">*</span>' : ''}
                            ${field.tooltip ? `<span class="tooltip" title="${field.tooltip}">?</span>` : ''}
                        </label>
                        <input type="${field.type}" 
                               class="form-input" 
                               name="${field.name}" 
                               value="${value}"
                               ${field.required ? 'required' : ''} 
                               placeholder="${field.placeholder || ''}"
                               ${field.pattern ? `pattern="${field.pattern}"` : ''}>
                        ${field.help ? `<div class="form-help">${field.help}</div>` : ''}
                    </div>
                `;
            case 'textarea':
                return `
                    <div class="form-group">
                        <label class="form-label">
                            ${field.label}
                            ${field.required ? '<span class="required">*</span>' : ''}
                            ${field.tooltip ? `<span class="tooltip" title="${field.tooltip}">?</span>` : ''}
                        </label>
                        <textarea class="form-input form-textarea" 
                                  name="${field.name}" 
                                  ${field.required ? 'required' : ''} 
                                  placeholder="${field.placeholder || ''}"
                                  rows="${field.rows || 4}">${value}</textarea>
                        ${field.help ? `<div class="form-help">${field.help}</div>` : ''}
                    </div>
                `;
            case 'select':
                return `
                    <div class="form-group">
                        <label class="form-label">
                            ${field.label}
                            ${field.required ? '<span class="required">*</span>' : ''}
                            ${field.tooltip ? `<span class="tooltip" title="${field.tooltip}">?</span>` : ''}
                        </label>
                        <select class="form-select" name="${field.name}" ${field.required ? 'required' : ''}>
                            <option value="">Select ${field.label}</option>
                            ${field.options.map(option => 
                                `<option value="${option.value}" ${value === option.value ? 'selected' : ''}>${option.label}</option>`
                            ).join('')}
                        </select>
                        ${field.help ? `<div class="form-help">${field.help}</div>` : ''}
                    </div>
                `;
            default:
                return '';
        }
    }

    getFormFields(documentType) {
        // Enhanced form fields with better validation and help text
        const commonFields = [
            { 
                name: 'fullName', 
                label: 'Full Legal Name', 
                type: 'text', 
                required: true, 
                placeholder: 'Enter your full legal name',
                help: 'Enter your name exactly as it appears on legal documents',
                tooltip: 'This should match your government-issued ID'
            },
            { 
                name: 'email', 
                label: 'Email Address', 
                type: 'email', 
                required: true, 
                placeholder: 'your@email.com',
                help: 'We\'ll use this for document delivery and updates'
            },
            { 
                name: 'phone', 
                label: 'Phone Number', 
                type: 'tel', 
                required: false, 
                placeholder: '(555) 123-4567',
                pattern: '\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}',
                help: 'Optional but recommended for urgent communications'
            }
        ];

        const specificFields = {
            'business-contract': [
                { 
                    name: 'companyName', 
                    label: 'Company Name', 
                    type: 'text', 
                    required: true,
                    help: 'Legal name of your business entity'
                },
                { 
                    name: 'contractType', 
                    label: 'Contract Type', 
                    type: 'select', 
                    required: true, 
                    options: [
                        { value: 'service', label: 'Service Agreement' },
                        { value: 'supply', label: 'Supply Agreement' },
                        { value: 'partnership', label: 'Partnership Agreement' },
                        { value: 'consulting', label: 'Consulting Agreement' },
                        { value: 'maintenance', label: 'Maintenance Agreement' }
                    ],
                    help: 'Select the type that best describes your business relationship'
                },
                { 
                    name: 'contractValue', 
                    label: 'Contract Value', 
                    type: 'text', 
                    required: true, 
                    placeholder: '$10,000.00',
                    help: 'Total value of the contract (use format: $X,XXX.XX)'
                },
                { 
                    name: 'duration', 
                    label: 'Contract Duration', 
                    type: 'text', 
                    required: true, 
                    placeholder: '12 months',
                    help: 'How long will this contract be in effect?'
                },
                {
                    name: 'serviceDescription',
                    label: 'Service Description',
                    type: 'textarea',
                    required: true,
                    placeholder: 'Describe the services to be provided...',
                    help: 'Detailed description of services, deliverables, or products',
                    rows: 4
                }
            ],
            'rental-agreement': [
                { 
                    name: 'propertyAddress', 
                    label: 'Property Address', 
                    type: 'textarea', 
                    required: true,
                    placeholder: '123 Main Street\nAnytown, ST 12345',
                    help: 'Complete address including unit number if applicable',
                    rows: 3
                },
                { 
                    name: 'rentAmount', 
                    label: 'Monthly Rent', 
                    type: 'text', 
                    required: true, 
                    placeholder: '$1,500.00',
                    help: 'Monthly rent amount (format: $X,XXX.XX)'
                },
                { 
                    name: 'securityDeposit', 
                    label: 'Security Deposit', 
                    type: 'text', 
                    required: true, 
                    placeholder: '$1,500.00',
                    help: 'Security deposit amount (typically equal to one month\'s rent)'
                },
                { 
                    name: 'leaseStart', 
                    label: 'Lease Start Date', 
                    type: 'date', 
                    required: true,
                    help: 'When does the lease period begin?'
                },
                { 
                    name: 'leaseTerm', 
                    label: 'Lease Term', 
                    type: 'select', 
                    required: true,
                    options: [
                        { value: '6', label: '6 months' },
                        { value: '12', label: '12 months' },
                        { value: '18', label: '18 months' },
                        { value: '24', label: '24 months' }
                    ],
                    help: 'Length of the lease agreement'
                },
                {
                    name: 'landlordName',
                    label: 'Landlord Name',
                    type: 'text',
                    required: true,
                    placeholder: 'Property owner or management company',
                    help: 'Legal name of the property owner or authorized agent'
                }
            ],
            'nda': [
                { 
                    name: 'disclosingParty', 
                    label: 'Disclosing Party', 
                    type: 'text', 
                    required: true,
                    placeholder: 'Company or individual sharing information',
                    help: 'Party that will be sharing confidential information'
                },
                { 
                    name: 'receivingParty', 
                    label: 'Receiving Party', 
                    type: 'text', 
                    required: true,
                    placeholder: 'Company or individual receiving information',
                    help: 'Party that will receive confidential information'
                },
                { 
                    name: 'ndaType', 
                    label: 'NDA Type', 
                    type: 'select', 
                    required: true,
                    options: [
                        { value: 'mutual', label: 'Mutual NDA (both parties share information)' },
                        { value: 'unilateral', label: 'Unilateral NDA (one party shares information)' }
                    ],
                    help: 'Choose based on whether one or both parties will share confidential information'
                },
                { 
                    name: 'duration', 
                    label: 'Duration', 
                    type: 'select', 
                    required: true,
                    options: [
                        { value: '1', label: '1 year' },
                        { value: '2', label: '2 years' },
                        { value: '3', label: '3 years' },
                        { value: '5', label: '5 years' },
                        { value: 'indefinite', label: 'Indefinite (until information becomes public)' }
                    ],
                    help: 'How long should the confidentiality obligations last?'
                }
            ]
        };

        return [...commonFields, ...(specificFields[documentType] || [])];
    }

    setupFormEnhancements() {
        // Add tooltips
        document.querySelectorAll('.tooltip').forEach(tooltip => {
            tooltip.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.title);
            });
            tooltip.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });

        // Format currency fields
        document.querySelectorAll('input[name*="Amount"], input[name*="Value"], input[name*="Deposit"]').forEach(field => {
            field.addEventListener('blur', (e) => {
                this.formatCurrency(e.target);
            });
        });

        // Format phone numbers
        document.querySelectorAll('input[type="tel"]').forEach(field => {
            field.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
            });
        });
    }

    formatCurrency(field) {
        let value = field.value.replace(/[^\d.]/g, '');
        if (value && !isNaN(value)) {
            const number = parseFloat(value);
            field.value = `$${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    }

    formatPhoneNumber(field) {
        let value = field.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        field.value = value;
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-popup';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip-popup');
        if (tooltip) {
            tooltip.remove();
        }
    }

    loadCustomizationOptions() {
        const container = document.getElementById('customizationOptions');
        if (!container) return;

        const options = this.getCustomizationOptions(this.selectedDocument);
        
        container.innerHTML = options.map(option => `
            <div class="option-group">
                <div class="option-header">
                    <div class="option-title">${option.title}</div>
                    <div class="option-toggle">
                        <div class="toggle-switch ${this.customizations[option.id] ? 'active' : ''}" data-option="${option.id}"></div>
                    </div>
                </div>
                <div class="option-description">${option.description}</div>
                ${option.impact ? `<div class="option-impact"><strong>Impact:</strong> ${option.impact}</div>` : ''}
            </div>
        `).join('');

        // Add toggle listeners
        container.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const optionId = toggle.dataset.option;
                const isActive = toggle.classList.contains('active');
                
                toggle.classList.toggle('active');
                this.customizations[optionId] = !isActive;
                this.saveToLocalStorage();
            });
        });
    }

    getCustomizationOptions(documentType) {
        const options = {
            'business-contract': [
                {
                    id: 'termination',
                    title: 'Early Termination Clause',
                    description: 'Allows either party to terminate the contract with proper notice',
                    impact: 'Provides flexibility but may reduce contract security'
                },
                {
                    id: 'confidentiality',
                    title: 'Confidentiality Provisions',
                    description: 'Protects sensitive business information shared during the contract',
                    impact: 'Essential for protecting trade secrets and proprietary information'
                },
                {
                    id: 'dispute-resolution',
                    title: 'Dispute Resolution',
                    description: 'Specifies mediation and arbitration procedures for conflicts',
                    impact: 'Can save time and money compared to court litigation'
                },
                {
                    id: 'force-majeure',
                    title: 'Force Majeure Clause',
                    description: 'Protects parties from liability due to extraordinary circumstances',
                    impact: 'Important protection against unforeseeable events'
                }
            ],
            'rental-agreement': [
                {
                    id: 'pet-policy',
                    title: 'Pet Policy',
                    description: 'Includes provisions for pets on the property',
                    impact: 'Clarifies pet rules and associated fees or deposits'
                },
                {
                    id: 'maintenance',
                    title: 'Maintenance Responsibilities',
                    description: 'Clearly defines landlord and tenant maintenance duties',
                    impact: 'Prevents disputes over repair responsibilities'
                },
                {
                    id: 'utilities',
                    title: 'Utility Arrangements',
                    description: 'Specifies which utilities are included in rent',
                    impact: 'Clarifies utility payment responsibilities'
                },
                {
                    id: 'subletting',
                    title: 'Subletting Policy',
                    description: 'Rules regarding tenant\'s ability to sublet the property',
                    impact: 'Controls who can occupy the property'
                }
            ],
            'nda': [
                {
                    id: 'return-clause',
                    title: 'Information Return Clause',
                    description: 'Requires return of confidential materials upon request',
                    impact: 'Ensures confidential materials don\'t remain with receiving party'
                },
                {
                    id: 'injunctive-relief',
                    title: 'Injunctive Relief',
                    description: 'Allows for immediate court action in case of breach',
                    impact: 'Provides stronger enforcement mechanism for violations'
                },
                {
                    id: 'residual-knowledge',
                    title: 'Residual Knowledge Exception',
                    description: 'Allows use of general knowledge retained in memory',
                    impact: 'Balances protection with practical business needs'
                }
            ]
        };

        return options[documentType] || [];
    }

    loadDocumentPreview() {
        const container = document.getElementById('previewDocument');
        if (!container) return;

        try {
            const documentHTML = this.documentGenerator.generateDocument(
                this.selectedDocument,
                this.formData,
                this.customizations
            );
            
            container.innerHTML = documentHTML;
            
            // Add preview controls
            this.addPreviewControls(container);
            
        } catch (error) {
            console.error('Preview generation error:', error);
            container.innerHTML = `
                <div class="preview-error">
                    <h3>Preview Unavailable</h3>
                    <p>Unable to generate document preview. Please check your form data and try again.</p>
                </div>
            `;
        }
    }

    addPreviewControls(container) {
        const controls = document.createElement('div');
        controls.className = 'preview-controls';
        controls.innerHTML = `
            <div class="preview-actions">
                <button class="btn btn-outline btn-sm" id="zoomOut">Zoom Out</button>
                <button class="btn btn-outline btn-sm" id="zoomIn">Zoom In</button>
                <button class="btn btn-outline btn-sm" id="fullscreen">Fullscreen</button>
            </div>
        `;
        
        container.parentNode.insertBefore(controls, container);

        // Add control functionality
        document.getElementById('zoomOut')?.addEventListener('click', () => this.adjustPreviewZoom(-0.1));
        document.getElementById('zoomIn')?.addEventListener('click', () => this.adjustPreviewZoom(0.1));
        document.getElementById('fullscreen')?.addEventListener('click', () => this.togglePreviewFullscreen(container));
    }

    adjustPreviewZoom(delta) {
        const preview = document.getElementById('previewDocument');
        if (preview) {
            const currentScale = parseFloat(preview.style.transform.replace('scale(', '').replace(')', '')) || 1;
            const newScale = Math.max(0.5, Math.min(2, currentScale + delta));
            preview.style.transform = `scale(${newScale})`;
            preview.style.transformOrigin = 'top left';
        }
    }

    togglePreviewFullscreen(container) {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            container.requestFullscreen();
        }
    }

    restoreFormData() {
        const savedData = this.loadFromLocalStorage();
        if (savedData && savedData.formData) {
            this.formData = { ...this.formData, ...savedData.formData };
            
            // Populate form fields
            Object.keys(this.formData).forEach(key => {
                const field = document.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = this.formData[key];
                }
            });
        }
    }

    saveToLocalStorage() {
        const data = {
            selectedDocument: this.selectedDocument,
            formData: this.formData,
            customizations: this.customizations,
            currentStep: this.currentStep,
            timestamp: Date.now()
        };
        
        localStorage.setItem('legalAllyWizardData', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem('legalAllyWizardData');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading saved data:', error);
            return null;
        }
    }

    clearLocalStorage() {
        localStorage.removeItem('legalAllyWizardData');
    }

    showGenerationProgress() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('active');
            const text = overlay.querySelector('.loading-text');
            if (text) text.textContent = 'Generating your legal document...';
        }
    }

    hideGenerationProgress() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');
            this.clearLocalStorage(); // Clear saved data after successful generation
        }
    }

    showValidationErrors(errors) {
        const errorHtml = `
            <div class="validation-errors">
                <h4>Please correct the following errors:</h4>
                <ul>
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;
        this.showError(errorHtml);
    }

    showValidationWarnings(warnings) {
        const warningHtml = `
            <div class="validation-warnings">
                <h4>Please note:</h4>
                <ul>
                    ${warnings.map(warning => `<li>${warning}</li>`).join('')}
                </ul>
            </div>
        `;
        this.showWarning(warningHtml);
    }

    showError(message) {
        this.legalAlly.showNotification(message, 'error');
    }

    showWarning(message) {
        this.legalAlly.showNotification(message, 'warning');
    }

    storeGeneratedDocument(documentHTML) {
        const documentData = {
            id: this.generateDocumentId(),
            type: this.selectedDocument,
            html: documentHTML,
            formData: this.formData,
            customizations: this.customizations,
            generatedAt: new Date().toISOString()
        };
        
        // Store in localStorage for demo purposes
        // In production, this would be sent to a server
        const existingDocs = JSON.parse(localStorage.getItem('generatedDocuments') || '[]');
        existingDocs.push(documentData);
        localStorage.setItem('generatedDocuments', JSON.stringify(existingDocs));
        
        return documentData;
    }

    generateDocumentId() {
        return 'LA-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // Validation helper methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    isValidCurrency(value) {
        const currencyRegex = /^\$[\d,]+\.?\d{0,2}$/;
        return currencyRegex.test(value);
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) && date > new Date();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentWizard;
} else {
    window.DocumentWizard = DocumentWizard;
}