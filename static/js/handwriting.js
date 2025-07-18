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
        this.exportBtn = document.getElementById('exportBtn');
        this.notebookPreview = document.getElementById('notebookPreview');
        this.statusMessages = document.getElementById('statusMessages');
        this.exportModal = new bootstrap.Modal(document.getElementById('exportModal'));
        this.confirmExportBtn = document.getElementById('confirmExportBtn');
        this.imageQuality = document.getElementById('imageQuality');
    }

    attachEventListeners() {
        this.transformBtn.addEventListener('click', () => this.transformText());
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.exportBtn.addEventListener('click', () => this.showExportModal());
        this.confirmExportBtn.addEventListener('click', () => this.exportAsImage());
        
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
                this.exportBtn.style.display = 'block';
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
                Digite seu texto ao lado e clique em "Transformar em Manuscrito" para ver o resultado aqui.
            </span>
        `;
    }

    clearText() {
        this.inputText.value = '';
        this.displayPlaceholder();
        this.exportBtn.style.display = 'none';
        this.lastTransformedText = '';
        this.clearStatus();
        this.inputText.focus();
    }

    showExportModal() {
        this.exportModal.show();
    }

    async exportAsImage() {
        const text = this.inputText.value.trim();
        if (!text) {
            this.showStatus('Não há texto para exportar.', 'warning');
            return;
        }

        // Get quality setting
        const quality = parseInt(this.imageQuality.value);
        
        try {
            this.confirmExportBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Exportando...';
            this.confirmExportBtn.disabled = true;

            // Wait for html2canvas to load if not available yet
            let attempts = 0;
            while (typeof html2canvas === 'undefined' && attempts < 10) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (typeof html2canvas === 'undefined') {
                throw new Error('html2canvas library not loaded');
            }

            // Get the notebook element
            const notebook = this.notebookPreview;
            
            // Create a temporary container for export
            const exportContainer = document.createElement('div');
            exportContainer.style.cssText = `
                position: fixed;
                top: -9999px;
                left: -9999px;
                width: 794px;
                height: auto;
                min-height: 600px;
                background-color: #ffffff;
                padding: 0;
                margin: 0;
                z-index: -1;
            `;
            
            // Clone the notebook content
            const notebookClone = notebook.cloneNode(true);
            notebookClone.style.cssText = `
                width: 794px;
                height: auto;
                min-height: 600px;
                background-color: #ffffff;
                background-image: 
                    linear-gradient(to right, transparent 45px, #ff6b6b 45px, #ff6b6b 46px, transparent 46px),
                    repeating-linear-gradient(
                        transparent,
                        transparent 24px,
                        #87ceeb 24px,
                        #87ceeb 25px
                    );
                background-size: 100% 100%;
                background-repeat: no-repeat;
                position: relative;
                padding: 0;
                margin: 0;
                box-shadow: none;
                transform: none;
            `;
            
            // Add holes manually as a div
            const holes = document.createElement('div');
            holes.style.cssText = `
                position: absolute;
                left: 15px;
                top: 0;
                width: 8px;
                height: 100%;
                background-image: radial-gradient(circle at center, #ddd 2px, transparent 2px);
                background-size: 8px 40px;
                background-repeat: repeat-y;
                z-index: 1;
            `;
            
            notebookClone.appendChild(holes);
            exportContainer.appendChild(notebookClone);
            document.body.appendChild(exportContainer);

            // Wait for render
            await new Promise(resolve => setTimeout(resolve, 100));

            // Capture with simpler options
            const canvas = await html2canvas(exportContainer, {
                scale: quality,
                backgroundColor: '#ffffff',
                width: 794,
                height: exportContainer.offsetHeight,
                logging: true
            });

            // Remove temporary container
            document.body.removeChild(exportContainer);

            // Convert to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `texto-manuscrito-${new Date().toISOString().slice(0,10)}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                this.showStatus('Imagem exportada com sucesso!', 'success');
            }, 'image/png', 0.95);

        } catch (error) {
            console.error('Error exporting image:', error);
            this.showStatus('Erro ao exportar imagem. Tente novamente.', 'danger');
        } finally {
            this.confirmExportBtn.innerHTML = '<i class="fas fa-download me-2"></i>Exportar Imagem';
            this.confirmExportBtn.disabled = false;
        }

        this.exportModal.hide();
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
    const sampleText = `Digite ou cole seu texto aqui...`;

    // Set sample text if input is empty
    if (!inputText.value.trim()) {
        inputText.placeholder = sampleText;
    }
});
