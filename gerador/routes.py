# gerador/routes.py

import html
from flask import Blueprint, render_template, request, jsonify, current_app

# 1. Crie um Blueprint. O primeiro argumento é o nome, o segundo é o __name__ do módulo.
bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    """Página principal com a entrada de texto e preview."""
    return render_template('index.html')

@bp.route('/transform', methods=['POST'])
def transform_text():
    """Transforma o texto e retorna o HTML formatado."""
    try:
        text = request.json.get('text', '').strip()

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        text = html.escape(text)
        formatted_text = add_handwriting_effects(text)

        if not formatted_text or not isinstance(formatted_text, str):
            formatted_text = text

        return jsonify({'formatted_text': formatted_text})

    except Exception as e:
        # Usamos o logger da aplicação atual, acessado via current_app
        current_app.logger.error(f"Erro ao transformar texto: {str(e)}")
        return jsonify({'error': 'Falha ao transformar o texto'}), 500

@bp.route('/print')
def print_view():
    """Retorna uma visão otimizada para impressão."""
    text = request.args.get('text', '')
    formatted_text = ''
    if text:
        formatted_text = add_handwriting_effects(html.escape(text))
    return render_template('print.html', formatted_text=formatted_text)


def add_handwriting_effects(text):
    """Adiciona irregularidades sutis para simular escrita à mão."""
    char_classes = ['char-1', 'char-2', 'char-3', 'char-4', 'char-5']
    paragraphs = text.split('\n\n')
    formatted_paragraphs = []

    for paragraph in paragraphs:
        if not paragraph.strip():
            continue

        lines = paragraph.split('\n')
        if len(lines) == 1 and len(paragraph.strip()) < 80:
            formatted_paragraph = f'<span class="title">{add_char_variations(paragraph.strip(), char_classes)}</span>'
        else:
            formatted_lines = []
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                if line.endswith(':'):
                    formatted_lines.append(f'<span class="section-title">{add_char_variations(line, char_classes)}</span>')
                elif line.startswith(('•', '-', '*')):
                    bullet_text = line[1:].strip()
                    formatted_lines.append(f'<span class="bullet">{add_char_variations(bullet_text, char_classes)}</span>')
                else:
                    formatted_lines.append(add_char_variations(line, char_classes))

            formatted_paragraph = '\n'.join(formatted_lines)

        formatted_paragraphs.append(formatted_paragraph)

    return '\n\n'.join(formatted_paragraphs)


def add_char_variations(text, char_classes):
    """Adiciona variações a nível de caractere."""
    if not text:
        return text

    result = []
    char_class_index = 0

    for char in text:
        if char.isalnum():
            class_name = char_classes[char_class_index % len(char_classes)]
            result.append(f'<span class="{class_name}">{char}</span>')
            char_class_index += 1
        else:
            result.append(char)

    return ''.join(result)