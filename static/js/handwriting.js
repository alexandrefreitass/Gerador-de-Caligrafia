// Handwriting transformation application
class HandwritingApp {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.lastTransformedText = '';
    }

    initializeElements() {
        this.inputText = document.getElementById('inputText');
        this.transformBtn = document.getElementById('transformBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.printBtn = document.getElementById('printBtn');
        this.notebookPreview = document.getElementById('notebookPreview');
        this.statusMessages = document.getElementById('statusMessages');
        this.printModal = new bootstrap.Modal(document.getElementById('printModal'));
        this.confirmPrintBtn = document.getElementById('confirmPrintBtn');
    }

    attachEventListeners() {
        this.transformBtn.addEventListener('click', () => this.transformText());
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.printBtn.addEventListener('click', () => this.showPrintModal());
        this.confirmPrintBtn.addEventListener('click', () => this.printPage());
        
        // Enable transform on Enter (Ctrl+Enter or Shift+Enter)
        this.inputText.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.shiftKey) && e.key === 'Enter') {
                e.preventDefault();
                this.transformText();
            }
        });

        // Auto-transform on input change (debounced)
        let debounceTimer;
        this.inputText.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (this.inputText.value.trim() && this.inputText.value.trim() !== this.lastTransformedText) {
                    this.transformText();
                }
            }, 1000); // Auto-transform after 1 second of no typing
        });
    }

    async transformText() {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.showStatus('Por favor, digite algum texto para transformar.', 'warning');
            return;
        }

        // Show loading state
        this.setLoadingState(true);
        this.clearStatus();

        try {
            const response = await fetch('/transform', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();

            if (response.ok) {
                this.displayHandwrittenText(data.formatted_text);
                this.lastTransformedText = text;
                this.printBtn.style.display = 'block';
                this.showStatus('Texto transformado com sucesso!', 'success');
            } else {
                throw new Error(data.error || 'Erro desconhecido');
            }
        } catch (error) {
            console.error('Error transforming text:', error);
            this.showStatus('Erro ao transformar o texto. Tente novamente.', 'danger');
            this.displayPlaceholder();
        } finally {
            this.setLoadingState(false);
        }
    }

    displayHandwrittenText(formattedText) {
        const handwrittenDiv = this.notebookPreview.querySelector('.handwritten-text');
        handwrittenDiv.innerHTML = formattedText;
        
        // Scroll to top of preview
        const previewContainer = document.querySelector('.preview-container');
        if (previewContainer) {
            previewContainer.scrollTop = 0;
        }
    }

    displayPlaceholder() {
        const handwrittenDiv = this.notebookPreview.querySelector('.handwritten-text');
        handwrittenDiv.innerHTML = `
            <span class="placeholder-text text-muted">
                <i class="fas fa-arrow-left me-2"></i>
                Digite seu texto ao lado e clique em "Transformar em Manuscrito" para ver o resultado aqui.
            </span>
        `;
    }

    clearText() {
        this.inputText.value = '';
        this.displayPlaceholder();
        this.printBtn.style.display = 'none';
        this.lastTransformedText = '';
        this.clearStatus();
        this.inputText.focus();
    }

    showPrintModal() {
        this.printModal.show();
    }

    printPage() {
        const text = this.inputText.value.trim();
        if (!text) {
            this.showStatus('Não há texto para imprimir.', 'warning');
            return;
        }

        // Open print window with formatted text
        const printUrl = `/print?text=${encodeURIComponent(text)}`;
        const printWindow = window.open(printUrl, '_blank', 'width=800,height=600');
        
        if (printWindow) {
            printWindow.onload = () => {
                // Small delay to ensure content is fully loaded
                setTimeout(() => {
                    printWindow.print();
                }, 500);
            };
        } else {
            this.showStatus('Popup bloqueado. Permita popups para imprimir.', 'warning');
        }

        this.printModal.hide();
    }

    setLoadingState(loading) {
        if (loading) {
            this.transformBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Transformando...';
            this.transformBtn.disabled = true;
            this.notebookPreview.classList.add('loading');
        } else {
            this.transformBtn.innerHTML = '<i class="fas fa-magic me-2"></i>Transformar em Manuscrito';
            this.transformBtn.disabled = false;
            this.notebookPreview.classList.remove('loading');
        }
    }

    showStatus(message, type) {
        this.statusMessages.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.clearStatus();
            }, 3000);
        }
    }

    clearStatus() {
        this.statusMessages.innerHTML = '';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HandwritingApp();
});

// Add some sample text for demonstration
document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const sampleText = `Relatório Médico - Paciente João Silva

Alterações Importantes:

Exames Laboratoriais:
• Glicemia elevada: 115 mg/dL (indicando hiperglicemia)
• Colesterol total alto: aumento do risco cardiovascular
• Função renal comprometida: ureia 99 mg/dL

Recomendações:
• Acompanhamento médico regular
• Dieta controlada em açúcares
• Exercícios físicos moderados

Observações Gerais:
É fundamental que o paciente siga rigorosamente as orientações médicas para controle dos níveis glicêmicos e melhoria do perfil lipídico.

Data: ${new Date().toLocaleDateString('pt-BR')}
Assinatura: Dr. Maria Santos`;

    // Set sample text if input is empty
    if (!inputText.value.trim()) {
        inputText.placeholder = sampleText;
    }
});
