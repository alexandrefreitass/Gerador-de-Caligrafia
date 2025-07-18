// Handwriting transformation application
class HandwritingApp {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.lastTransformedText = '';
        console.log('HandwritingApp initialized');
    }

    initializeElements() {
        this.inputText = document.getElementById('inputText');
        this.transformBtn = document.getElementById('transformBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.notebookPreview = document.getElementById('notebookPreview');
        this.statusMessages = document.getElementById('statusMessages');
        
        // Only initialize modal if element exists
        const modalElement = document.getElementById('exportModal');
        if (modalElement && typeof bootstrap !== 'undefined') {
            this.exportModal = new bootstrap.Modal(modalElement);
        }
        
        this.confirmExportBtn = document.getElementById('confirmExportBtn');
        this.imageQuality = document.getElementById('imageQuality');
        
        console.log('Elements initialized');
    }

    attachEventListeners() {
        if (this.transformBtn) {
            this.transformBtn.addEventListener('click', () => this.transformText());
        }
        
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearText());
        }
        
        if (this.exportBtn) {
            this.exportBtn.addEventListener('click', () => this.showExportModal());
        }
        
        if (this.confirmExportBtn) {
            this.confirmExportBtn.addEventListener('click', () => this.exportAsImage());
        }
        
        if (this.inputText) {
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
        
        console.log('Event listeners attached');
    }

    async transformText() {
        console.log('Starting text transformation');
        
        if (!this.inputText) {
            console.error('Input text element not found');
            return;
        }
        
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);

            if (data.formatted_text) {
                this.displayHandwrittenText(data.formatted_text);
                this.lastTransformedText = text;
                if (this.exportBtn) {
                    this.exportBtn.style.display = 'block';
                }
                this.showStatus('Texto transformado com sucesso!', 'success');
            } else {
                throw new Error('No formatted text received');
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
        console.log('Displaying handwritten text:', formattedText);
        
        if (!this.notebookPreview) {
            console.error('Notebook preview element not found');
            return;
        }
        
        const handwrittenDiv = this.notebookPreview.querySelector('.handwritten-text');
        if (!handwrittenDiv) {
            console.error('Handwritten text container not found');
            return;
        }
        
        // Ensure formattedText is valid
        if (formattedText && typeof formattedText === 'string' && formattedText.trim() !== '') {
            handwrittenDiv.innerHTML = formattedText;
            console.log('Text displayed successfully');
        } else {
            console.warn('Invalid formatted text, showing placeholder');
            this.displayPlaceholder();
            return;
        }
        
        // Scroll to top of preview
        const previewContainer = document.querySelector('.preview-container');
        if (previewContainer) {
            previewContainer.scrollTop = 0;
        }
    }

    displayPlaceholder() {
        console.log('Clearing notebook page');
        
        if (!this.notebookPreview) {
            console.error('Notebook preview element not found');
            return;
        }
        
        const handwrittenDiv = this.notebookPreview.querySelector('.handwritten-text');
        if (!handwrittenDiv) {
            console.error('Handwritten text container not found');
            return;
        }
        
        handwrittenDiv.innerHTML = '';
    }

    clearText() {
        console.log('Clearing text');
        
        if (this.inputText) {
            this.inputText.value = '';
            this.inputText.focus();
        }
        
        this.displayPlaceholder();
        
        if (this.exportBtn) {
            this.exportBtn.style.display = 'none';
        }
        
        this.lastTransformedText = '';
        this.clearStatus();
    }

    showExportModal() {
        if (this.exportModal) {
            this.exportModal.show();
        }
    }

    async exportAsImage() {
        if (!this.inputText) {
            return;
        }
        
        const text = this.inputText.value.trim();
        if (!text) {
            this.showStatus('Não há texto para exportar.', 'warning');
            return;
        }

        const quality = this.imageQuality ? parseInt(this.imageQuality.value) : 2;
        
        try {
            if (this.confirmExportBtn) {
                this.confirmExportBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Exportando...';
                this.confirmExportBtn.disabled = true;
            }

            // Wait for html2canvas to load
            let attempts = 0;
            while (typeof html2canvas === 'undefined' && attempts < 10) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (typeof html2canvas === 'undefined') {
                throw new Error('html2canvas library not loaded');
            }

            const notebook = this.notebookPreview;
            if (!notebook) {
                throw new Error('Notebook element not found');
            }
            
            // Create temporary container
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
            
            // Clone notebook content
            const notebookClone = notebook.cloneNode(true);
            notebookClone.className = 'notebook-page';
            notebookClone.style.cssText = `
                width: 794px;
                height: auto;
                min-height: 600px;
                background-color: #ffffff;
                position: relative;
                padding: 0;
                margin: 0;
                box-shadow: none;
                transform: none;
            `;
            
            // Create line element to simulate notebook lines
            const linesDiv = document.createElement('div');
            linesDiv.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
                pointer-events: none;
            `;
            
            // Add margin line
            const marginLine = document.createElement('div');
            marginLine.style.cssText = `
                position: absolute;
                left: 45px;
                top: 0;
                width: 1px;
                height: 100%;
                background-color: #ff6b6b;
                z-index: 1;
            `;
            linesDiv.appendChild(marginLine);
            
            // Insert lines before the content
            notebookClone.insertBefore(linesDiv, notebookClone.firstChild);
            
            // Make text appear above lines
            const textDiv = notebookClone.querySelector('.handwritten-text');
            if (textDiv) {
                textDiv.style.position = 'relative';
                textDiv.style.zIndex = '2';
            }
            
            exportContainer.appendChild(notebookClone);
            document.body.appendChild(exportContainer);

            // Wait for render to get accurate height
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Now get the actual height after content is rendered
            const notebookHeight = notebookClone.scrollHeight || notebookClone.offsetHeight || 600;
            const lineCount = Math.ceil(notebookHeight / 25);
            
            // Add horizontal lines based on actual height
            for (let i = 0; i < lineCount; i++) {
                const line = document.createElement('div');
                line.style.cssText = `
                    position: absolute;
                    left: 0;
                    top: ${i * 25 + 24}px;
                    width: 100%;
                    height: 1px;
                    background-color: #87ceeb;
                    z-index: 0;
                `;
                linesDiv.appendChild(line);
            }

            // Wait again for lines to render
            await new Promise(resolve => setTimeout(resolve, 100));

            // Capture
            const canvas = await html2canvas(exportContainer, {
                scale: quality,
                backgroundColor: '#ffffff',
                width: 794,
                height: exportContainer.offsetHeight,
                logging: false
            });

            // Remove temporary container
            document.body.removeChild(exportContainer);

            // Download
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
            if (this.confirmExportBtn) {
                this.confirmExportBtn.innerHTML = '<i class="fas fa-download me-2"></i>Exportar Imagem';
                this.confirmExportBtn.disabled = false;
            }
        }

        if (this.exportModal) {
            this.exportModal.hide();
        }
    }

    setLoadingState(loading) {
        if (!this.transformBtn || !this.notebookPreview) {
            return;
        }
        
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
        if (!this.statusMessages) {
            return;
        }
        
        this.statusMessages.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.clearStatus();
            }, 3000);
        }
    }

    clearStatus() {
        if (this.statusMessages) {
            this.statusMessages.innerHTML = '';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing HandwritingApp');
    new HandwritingApp();
});

// Sample text placeholder
document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    if (inputText && !inputText.value.trim()) {
        inputText.placeholder = 'Digite ou cole seu texto aqui...';
    }
});