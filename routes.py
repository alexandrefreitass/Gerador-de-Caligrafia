from flask import render_template, request, jsonify
from app import app
import html
import re

@app.route('/')
def index():
    """Main page with text input and handwritten preview"""
    return render_template('index.html')

@app.route('/transform', methods=['POST'])
def transform_text():
    """Transform text and return formatted HTML for notebook display"""
    try:
        text = request.json.get('text', '').strip()
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Escape HTML to prevent XSS
        text = html.escape(text)
        
        # Process the text to add handwriting irregularities
        formatted_text = add_handwriting_effects(text)
        
        return jsonify({'formatted_text': formatted_text})
    
    except Exception as e:
        app.logger.error(f"Error transforming text: {str(e)}")
        return jsonify({'error': 'Failed to transform text'}), 500

def add_handwriting_effects(text):
    """Add subtle irregularities to simulate handwriting"""
    
    # Define character transformation classes for irregularities
    char_classes = ['char-1', 'char-2', 'char-3', 'char-4', 'char-5']
    
    # Split text into paragraphs
    paragraphs = text.split('\n\n')
    formatted_paragraphs = []
    
    for paragraph in paragraphs:
        if not paragraph.strip():
            continue
            
        # Check if paragraph looks like a title (shorter, standalone)
        lines = paragraph.split('\n')
        if len(lines) == 1 and len(paragraph.strip()) < 80:
            # Treat as title
            formatted_paragraph = f'<span class="title">{add_char_variations(paragraph.strip(), char_classes)}</span>'
        else:
            # Process as regular text with potential sections
            formatted_lines = []
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Check if line ends with colon (section title)
                if line.endswith(':') and len(line) < 60:
                    formatted_lines.append(f'<span class="section-title">{add_char_variations(line, char_classes)}</span>')
                # Check if line starts with bullet point indicators
                elif line.startswith('•') or line.startswith('-') or line.startswith('*'):
                    bullet_text = line[1:].strip() if line[0] in ['•', '-', '*'] else line
                    formatted_lines.append(f'<span class="bullet">{add_char_variations(bullet_text, char_classes)}</span>')
                else:
                    formatted_lines.append(add_char_variations(line, char_classes))
            
            formatted_paragraph = '\n'.join(formatted_lines)
        
        formatted_paragraphs.append(formatted_paragraph)
    
    return '\n\n'.join(formatted_paragraphs)

def add_char_variations(text, char_classes):
    """Add character-level variations to simulate handwriting irregularities"""
    if not text:
        return text
    
    result = []
    char_class_index = 0
    
    for char in text:
        if char.isalnum():  # Only add variations to alphanumeric characters
            class_name = char_classes[char_class_index % len(char_classes)]
            result.append(f'<span class="{class_name}">{char}</span>')
            char_class_index += 1
        else:
            result.append(char)
    
    return ''.join(result)

@app.route('/print')
def print_view():
    """Return a print-optimized view"""
    text = request.args.get('text', '')
    if text:
        formatted_text = add_handwriting_effects(html.escape(text))
        return render_template('print.html', formatted_text=formatted_text)
    return render_template('print.html', formatted_text='')
