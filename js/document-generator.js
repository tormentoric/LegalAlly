// Document Generator Module
class DocumentGenerator {
    constructor() {
        this.templates = new Map();
        this.loadTemplates();
    }

    loadTemplates() {
        // Business Contract Template
        this.templates.set('business-contract', {
            title: 'Business Service Agreement',
            sections: [
                {
                    title: 'Parties',
                    content: (data) => `
                        This Business Service Agreement ("Agreement") is entered into on ${new Date().toLocaleDateString()} 
                        between ${data.fullName || '[Client Name]'} ("Client") and ${data.companyName || '[Service Provider]'} ("Provider").
                    `
                },
                {
                    title: 'Services',
                    content: (data) => `
                        Provider agrees to provide the following services: ${data.serviceDescription || '[Service Description]'}.
                        The contract type is: ${data.contractType || '[Contract Type]'}.
                    `
                },
                {
                    title: 'Compensation',
                    content: (data) => `
                        Client agrees to pay Provider ${data.contractValue || '[Amount]'} for the services described herein.
                        Payment terms: ${data.paymentTerms || 'Net 30 days'}.
                    `
                },
                {
                    title: 'Term',
                    content: (data) => `
                        This Agreement shall commence on ${data.startDate || '[Start Date]'} and shall continue for 
                        ${data.duration || '[Duration]'} unless terminated earlier in accordance with the terms herein.
                    `
                }
            ],
            customClauses: {
                'termination': `
                    <h3>Early Termination</h3>
                    <p>Either party may terminate this Agreement with thirty (30) days written notice to the other party.</p>
                `,
                'confidentiality': `
                    <h3>Confidentiality</h3>
                    <p>Both parties agree to maintain the confidentiality of any proprietary information shared during the course of this Agreement.</p>
                `,
                'dispute-resolution': `
                    <h3>Dispute Resolution</h3>
                    <p>Any disputes arising under this Agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.</p>
                `
            }
        });

        // Rental Agreement Template
        this.templates.set('rental-agreement', {
            title: 'Residential Lease Agreement',
            sections: [
                {
                    title: 'Property',
                    content: (data) => `
                        This Residential Lease Agreement is for the property located at: 
                        ${data.propertyAddress || '[Property Address]'}.
                    `
                },
                {
                    title: 'Parties',
                    content: (data) => `
                        Landlord: ${data.landlordName || '[Landlord Name]'}
                        Tenant: ${data.fullName || '[Tenant Name]'}
                        Email: ${data.email || '[Email Address]'}
                        Phone: ${data.phone || '[Phone Number]'}
                    `
                },
                {
                    title: 'Lease Terms',
                    content: (data) => `
                        Lease Start Date: ${data.leaseStart || '[Start Date]'}
                        Lease Term: ${data.leaseTerm || '[Term]'} months
                        Monthly Rent: ${data.rentAmount || '[Rent Amount]'}
                        Security Deposit: ${data.securityDeposit || '[Security Deposit]'}
                    `
                },
                {
                    title: 'Payment Terms',
                    content: (data) => `
                        Rent is due on the first day of each month. Late fees of $50 will be charged for payments received after the 5th of the month.
                        Security deposit will be held in accordance with state law and returned within 30 days of lease termination, less any deductions for damages.
                    `
                }
            ],
            customClauses: {
                'pet-policy': `
                    <h3>Pet Policy</h3>
                    <p>Tenant may keep pets on the premises with prior written consent from Landlord. Additional pet deposit of $200 per pet is required.</p>
                `,
                'maintenance': `
                    <h3>Maintenance Responsibilities</h3>
                    <p>Landlord is responsible for major repairs and maintenance. Tenant is responsible for routine maintenance and minor repairs under $100.</p>
                `,
                'utilities': `
                    <h3>Utilities</h3>
                    <p>Tenant is responsible for all utilities including electricity, gas, water, sewer, trash, and internet services.</p>
                `
            }
        });

        // NDA Template
        this.templates.set('nda', {
            title: 'Non-Disclosure Agreement',
            sections: [
                {
                    title: 'Parties',
                    content: (data) => `
                        This Non-Disclosure Agreement ("Agreement") is entered into between:
                        Disclosing Party: ${data.disclosingParty || '[Disclosing Party]'}
                        Receiving Party: ${data.receivingParty || '[Receiving Party]'}
                        Contact: ${data.fullName || '[Contact Name]'} (${data.email || '[Email]'})
                    `
                },
                {
                    title: 'Definition of Confidential Information',
                    content: (data) => `
                        "Confidential Information" means any and all non-public, proprietary, or confidential information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or in any other form.
                    `
                },
                {
                    title: 'Obligations',
                    content: (data) => `
                        The Receiving Party agrees to:
                        1. Hold all Confidential Information in strict confidence
                        2. Not disclose Confidential Information to any third parties
                        3. Use Confidential Information solely for the purpose of evaluating potential business relationships
                        4. Take reasonable precautions to protect the confidentiality of the information
                    `
                },
                {
                    title: 'Term',
                    content: (data) => `
                        This Agreement shall remain in effect for ${data.duration || '[Duration]'} from the date of execution, 
                        or until terminated by mutual written consent of both parties.
                    `
                }
            ],
            customClauses: {
                'return-clause': `
                    <h3>Return of Information</h3>
                    <p>Upon termination of this Agreement or upon request by the Disclosing Party, the Receiving Party shall promptly return or destroy all materials containing Confidential Information.</p>
                `,
                'injunctive-relief': `
                    <h3>Injunctive Relief</h3>
                    <p>The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party, and that monetary damages may be inadequate. Therefore, the Disclosing Party shall be entitled to seek injunctive relief without posting bond.</p>
                `
            }
        });

        // Will & Trust Template
        this.templates.set('will-trust', {
            title: 'Last Will and Testament',
            sections: [
                {
                    title: 'Declaration',
                    content: (data) => `
                        I, ${data.fullName || '[Full Name]'}, of ${data.address || '[Address]'}, being of sound mind and disposing memory, 
                        do hereby make, publish, and declare this to be my Last Will and Testament, hereby revoking all former wills and codicils by me made.
                    `
                },
                {
                    title: 'Executor',
                    content: (data) => `
                        I hereby nominate and appoint ${data.executorName || '[Executor Name]'} as the Executor of this Will. 
                        If ${data.executorName || '[Executor Name]'} is unable or unwilling to serve, I nominate ${data.alternateExecutor || '[Alternate Executor]'} as alternate Executor.
                    `
                },
                {
                    title: 'Beneficiaries',
                    content: (data) => `
                        I give, devise, and bequeath all of my property, both real and personal, to my beneficiaries as follows:
                        [Beneficiary details to be specified based on user input]
                    `
                },
                {
                    title: 'Guardian',
                    content: (data) => `
                        If I have minor children at the time of my death, I nominate ${data.guardianName || '[Guardian Name]'} 
                        as guardian of the person and property of my minor children.
                    `
                }
            ],
            customClauses: {}
        });

        // LLC Formation Template
        this.templates.set('llc-formation', {
            title: 'Limited Liability Company Operating Agreement',
            sections: [
                {
                    title: 'Formation',
                    content: (data) => `
                        This Operating Agreement is entered into by the members of ${data.companyName || '[LLC Name]'}, 
                        a Limited Liability Company formed under the laws of ${data.state || '[State]'}.
                    `
                },
                {
                    title: 'Members',
                    content: (data) => `
                        The initial member(s) of the LLC are:
                        Name: ${data.fullName || '[Member Name]'}
                        Address: ${data.address || '[Address]'}
                        Email: ${data.email || '[Email]'}
                        Initial Contribution: ${data.initialContribution || '[Amount]'}
                    `
                },
                {
                    title: 'Management',
                    content: (data) => `
                        The LLC shall be managed by ${data.managementType || 'its members'}. 
                        All major business decisions require ${data.votingThreshold || 'majority'} approval of the members.
                    `
                },
                {
                    title: 'Distributions',
                    content: (data) => `
                        Distributions shall be made to members in proportion to their ownership interests, 
                        as determined by the members from time to time.
                    `
                }
            ],
            customClauses: {}
        });

        // Employment Contract Template
        this.templates.set('employment-contract', {
            title: 'Employment Agreement',
            sections: [
                {
                    title: 'Parties',
                    content: (data) => `
                        This Employment Agreement is between ${data.companyName || '[Company Name]'} ("Company") 
                        and ${data.fullName || '[Employee Name]'} ("Employee").
                    `
                },
                {
                    title: 'Position and Duties',
                    content: (data) => `
                        Employee is hired as ${data.jobTitle || '[Job Title]'} and agrees to perform duties as assigned by the Company.
                        Employee will report to ${data.supervisor || '[Supervisor Name]'}.
                    `
                },
                {
                    title: 'Compensation',
                    content: (data) => `
                        Employee will receive an annual salary of ${data.salary || '[Salary Amount]'}, 
                        paid in accordance with Company's regular payroll schedule.
                        Employee is eligible for ${data.benefits || 'standard company benefits'}.
                    `
                },
                {
                    title: 'Term',
                    content: (data) => `
                        This agreement begins on ${data.startDate || '[Start Date]'} and continues until terminated 
                        by either party in accordance with the terms herein.
                    `
                }
            ],
            customClauses: {}
        });
    }

    generateDocument(documentType, formData, customizations = {}) {
        const template = this.templates.get(documentType);
        if (!template) {
            throw new Error(`Template not found for document type: ${documentType}`);
        }

        let documentHTML = `
            <div class="generated-document">
                <header class="document-header">
                    <h1 class="document-title">${template.title}</h1>
                    <div class="document-meta">
                        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                        <p><strong>Document ID:</strong> ${this.generateDocumentId()}</p>
                    </div>
                </header>
                
                <main class="document-body">
        `;

        // Add main sections
        template.sections.forEach((section, index) => {
            documentHTML += `
                <section class="document-section">
                    <h2>${index + 1}. ${section.title}</h2>
                    <div class="section-content">
                        ${section.content(formData)}
                    </div>
                </section>
            `;
        });

        // Add custom clauses if selected
        const selectedClauses = Object.keys(customizations).filter(key => customizations[key]);
        if (selectedClauses.length > 0) {
            documentHTML += `
                <section class="document-section">
                    <h2>${template.sections.length + 1}. Additional Provisions</h2>
                    <div class="section-content">
            `;
            
            selectedClauses.forEach(clauseId => {
                if (template.customClauses[clauseId]) {
                    documentHTML += template.customClauses[clauseId];
                }
            });
            
            documentHTML += `
                    </div>
                </section>
            `;
        }

        // Add signature section
        documentHTML += `
                <section class="document-section signature-section">
                    <h2>${template.sections.length + (selectedClauses.length > 0 ? 2 : 1)}. Signatures</h2>
                    <div class="section-content">
                        <p>By signing below, all parties agree to the terms and conditions outlined in this document.</p>
                        
                        <div class="signature-block">
                            <div class="signature-line">
                                <div class="signature-space">_________________________________</div>
                                <div class="signature-label">${formData.fullName || '[Your Name]'}</div>
                                <div class="signature-date">Date: _________________</div>
                            </div>
                        </div>
                        
                        ${this.getAdditionalSignatureBlocks(documentType, formData)}
                    </div>
                </section>
                
                </main>
                
                <footer class="document-footer">
                    <div class="legal-disclaimer">
                        <h3>Legal Disclaimer</h3>
                        <p><strong>IMPORTANT:</strong> This document is provided as a template and is not a substitute for legal advice. 
                        You should consult with a qualified attorney before using this document for any legal purpose. 
                        Legal Ally makes no warranties regarding the legal sufficiency or enforceability of this document.</p>
                    </div>
                    
                    <div class="document-info">
                        <p>Generated by Legal Ally - Professional Legal Document Automation</p>
                        <p>For support, visit: support@legalally.com</p>
                    </div>
                </footer>
            </div>
        `;

        return documentHTML;
    }

    getAdditionalSignatureBlocks(documentType, formData) {
        switch (documentType) {
            case 'business-contract':
                return `
                    <div class="signature-block">
                        <div class="signature-line">
                            <div class="signature-space">_________________________________</div>
                            <div class="signature-label">${formData.companyName || '[Company Representative]'}</div>
                            <div class="signature-date">Date: _________________</div>
                        </div>
                    </div>
                `;
            case 'rental-agreement':
                return `
                    <div class="signature-block">
                        <div class="signature-line">
                            <div class="signature-space">_________________________________</div>
                            <div class="signature-label">${formData.landlordName || '[Landlord Name]'}</div>
                            <div class="signature-date">Date: _________________</div>
                        </div>
                    </div>
                `;
            case 'nda':
                return `
                    <div class="signature-block">
                        <div class="signature-line">
                            <div class="signature-space">_________________________________</div>
                            <div class="signature-label">${formData.disclosingParty || '[Disclosing Party]'}</div>
                            <div class="signature-date">Date: _________________</div>
                        </div>
                    </div>
                    <div class="signature-block">
                        <div class="signature-line">
                            <div class="signature-space">_________________________________</div>
                            <div class="signature-label">${formData.receivingParty || '[Receiving Party]'}</div>
                            <div class="signature-date">Date: _________________</div>
                        </div>
                    </div>
                `;
            case 'employment-contract':
                return `
                    <div class="signature-block">
                        <div class="signature-line">
                            <div class="signature-space">_________________________________</div>
                            <div class="signature-label">${formData.companyName || '[Company Name]'}</div>
                            <div class="signature-date">Date: _________________</div>
                        </div>
                    </div>
                `;
            default:
                return `
                    <div class="signature-block">
                        <div class="signature-line">
                            <div class="signature-space">_________________________________</div>
                            <div class="signature-label">[Other Party]</div>
                            <div class="signature-date">Date: _________________</div>
                        </div>
                    </div>
                `;
        }
    }

    generateDocumentId() {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        return `LA-${timestamp}-${randomStr}`.toUpperCase();
    }

    exportToPDF(documentHTML, filename = 'legal-document.pdf') {
        // In a real implementation, this would use a PDF generation library
        // For now, we'll simulate the process
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('PDF generated:', filename);
                resolve({
                    success: true,
                    filename: filename,
                    size: '245 KB'
                });
            }, 1000);
        });
    }

    exportToWord(documentHTML, filename = 'legal-document.docx') {
        // In a real implementation, this would convert HTML to Word format
        // For now, we'll simulate the process
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Word document generated:', filename);
                resolve({
                    success: true,
                    filename: filename,
                    size: '156 KB'
                });
            }, 1000);
        });
    }

    validateDocument(documentType, formData) {
        const errors = [];
        const warnings = [];

        // Common validations
        if (!formData.fullName || formData.fullName.trim().length < 2) {
            errors.push('Full name is required and must be at least 2 characters');
        }

        if (!formData.email || !this.isValidEmail(formData.email)) {
            errors.push('Valid email address is required');
        }

        // Document-specific validations
        switch (documentType) {
            case 'business-contract':
                if (!formData.companyName) {
                    errors.push('Company name is required for business contracts');
                }
                if (!formData.contractValue || !this.isValidCurrency(formData.contractValue)) {
                    errors.push('Valid contract value is required');
                }
                break;

            case 'rental-agreement':
                if (!formData.propertyAddress) {
                    errors.push('Property address is required');
                }
                if (!formData.rentAmount || !this.isValidCurrency(formData.rentAmount)) {
                    errors.push('Valid rent amount is required');
                }
                if (!formData.leaseStart || !this.isValidDate(formData.leaseStart)) {
                    errors.push('Valid lease start date is required');
                }
                break;

            case 'nda':
                if (!formData.disclosingParty) {
                    errors.push('Disclosing party name is required');
                }
                if (!formData.receivingParty) {
                    errors.push('Receiving party name is required');
                }
                break;
        }

        // Add warnings for missing optional but recommended fields
        if (!formData.phone) {
            warnings.push('Phone number is recommended for contact purposes');
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidCurrency(value) {
        const currencyRegex = /^\$?[\d,]+\.?\d{0,2}$/;
        return currencyRegex.test(value.toString());
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    getDocumentMetadata(documentType) {
        const template = this.templates.get(documentType);
        if (!template) return null;

        return {
            title: template.title,
            sections: template.sections.length,
            customClauses: Object.keys(template.customClauses).length,
            estimatedLength: this.estimateDocumentLength(documentType),
            complexity: this.getComplexityLevel(documentType)
        };
    }

    estimateDocumentLength(documentType) {
        const baseLengths = {
            'business-contract': '2-3 pages',
            'rental-agreement': '3-4 pages',
            'will-trust': '4-6 pages',
            'llc-formation': '5-8 pages',
            'nda': '2-3 pages',
            'employment-contract': '3-5 pages'
        };
        return baseLengths[documentType] || '2-4 pages';
    }

    getComplexityLevel(documentType) {
        const complexityLevels = {
            'nda': 'Simple',
            'rental-agreement': 'Moderate',
            'business-contract': 'Moderate',
            'employment-contract': 'Moderate',
            'will-trust': 'Complex',
            'llc-formation': 'Complex'
        };
        return complexityLevels[documentType] || 'Moderate';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentGenerator;
} else {
    window.DocumentGenerator = DocumentGenerator;
}