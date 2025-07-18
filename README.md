
# Transformador de Texto Manuscrito - Aplicação Flask

<div align="center">
    https://github.com/user-attachments/assets/6b13ed32-617f-4822-913a-245da29001d8
</div>
<br/><br/>

Este projeto consiste em uma aplicação web desenvolvida em **Python Flask** que transforma texto digitado em um estilo de escrita manuscrita realística, exibido em um fundo de página de caderno. A ferramenta oferece uma interface intuitiva para inserir texto e visualizá-lo com aparência de escrita à mão, incluindo linhas pautadas e margem lateral.

---

## 🛠 Características

- **Interface Web Moderna**: Interface responsiva desenvolvida com Bootstrap 5.3.0 para facilitar o uso.
- **Transformação Realística**: Converte texto digitado em estilo manuscrito com variações naturais de caracteres.
- **Design Autêntico**: Simula páginas de caderno com linhas azuis e margem vermelha.
- **Exportação de Imagem**: Permite salvar o texto manuscrito como imagem PNG.
- **Funcionalidade de Impressão**: Interface otimizada para impressão do conteúdo.
- **Responsividade**: Adaptado para funcionar em dispositivos móveis e desktops.

---

## 🚀 Funcionalidades

- **Transformação em Tempo Real**: Visualização instantânea do texto manuscrito conforme você digita.
- **Formatação Inteligente**: Reconhece títulos, parágrafos e listas automaticamente.
- **Variações de Caracteres**: Aplica rotações e posicionamentos sutis para simular escrita natural.
- **Exportação**: Gera imagens PNG de alta qualidade do texto manuscrito.
- **Impressão**: Layout otimizado para impressão em papel A4.
- **Fonte Personalizada**: Utiliza a fonte "Kalam" do Google Fonts para efeito caligráfico.

---

## 📋 Como Usar

### 1. Configurar o Ambiente
Certifique-se de que possui Python 3.11+ instalado no sistema.

### 2. Executar a Aplicação
1. Clone ou baixe o projeto.
2. Execute o comando `python main.py` ou clique no botão "Run" no Replit.
3. Acesse `http://localhost:5000` no seu navegador.

### 3. Transformar Texto
1. **Digite o Texto**:
   - Insira seu texto na área de entrada à esquerda.
2. **Visualize o Resultado**:
   - O texto manuscrito aparecerá automaticamente no painel direito.
3. **Exporte ou Imprima**:
   - Use os botões de exportar imagem ou imprimir conforme necessário.

---

## 🖥 Interface da Aplicação

A interface é dividida em duas seções principais:

- **Painel de Entrada**: Área de texto para inserir o conteúdo a ser transformado.
- **Painel de Visualização**: Mostra o texto com aparência manuscrita em fundo de caderno.
- **Controles**: Botões para exportar imagem e imprimir o resultado.
- **Status**: Mensagens de feedback sobre as operações realizadas.

---

## 🧩 Estrutura do Projeto

```
├── static/
│   ├── css/
│   │   └── notebook.css      # Estilos do caderno e texto manuscrito
│   ├── img/
│   │   └── favicon.png       # Ícone da aplicação
│   └── js/
│       └── handwriting.js    # Lógica do frontend
├── templates/
│   ├── base.html            # Template base com Bootstrap
│   ├── index.html           # Página principal
│   └── print.html           # Layout para impressão
├── app.py                   # Configuração da aplicação Flask
├── main.py                  # Ponto de entrada da aplicação
└── routes.py                # Rotas e lógica de transformação
```

---

## 💻 Requisitos Técnicos

- **Python**: 3.11 ou superior
- **Flask**: 3.1.1+
- **Dependências**: Listadas no arquivo `pyproject.toml`
- **Navegador**: Suporte moderno para CSS3 e JavaScript ES6+
- **Conexão**: Internet necessária para CDNs (Bootstrap, Font Awesome, Google Fonts)

---

## 🎨 Tecnologias Utilizadas

### Backend
- **Flask**: Framework web Python
- **Gunicorn**: Servidor WSGI para produção
- **Python Standard Library**: Manipulação de strings e HTML

### Frontend
- **Bootstrap 5.3.0**: Framework CSS responsivo
- **Google Fonts (Kalam)**: Fonte com estilo caligráfico
- **Font Awesome 6.0.0**: Ícones para interface
- **html2canvas**: Biblioteca para exportação de imagens
- **Vanilla JavaScript**: Lógica do frontend sem dependências

---

## 🔧 Algoritmo de Transformação

O sistema utiliza uma abordagem baseada em CSS para simular escrita manuscrita:

1. **Análise do Texto**: Identifica títulos, parágrafos e listas
2. **Aplicação de Classes**: Cada caractere recebe uma classe CSS com variações
3. **Rotações Sutis**: Aplica rotações de -0.5° a +0.5° nos caracteres
4. **Deslocamentos**: Adiciona pequenos deslocamentos verticais
5. **Renderização**: Combina tudo em HTML com estilo de caderno

---

## 📱 Responsividade

- **Desktop**: Layout de duas colunas com painéis lado a lado
- **Tablet**: Ajustes de tamanho de fonte e espaçamento
- **Mobile**: Layout empilhado com otimizações para telas pequenas

---

## ⚠️ Observações

1. **Qualidade da Exportação**: Imagens são geradas em alta resolução para melhor qualidade.
2. **Compatibilidade**: Testado nos principais navegadores modernos.
3. **Performance**: O sistema processa texto em tempo real via AJAX.

---

## 🚀 Deploy no Replit

Este projeto está configurado para deploy automático no Replit:
- **Servidor**: Gunicorn configurado para produção
- **Port**: 5000 (mapeado para 80/443 em produção)
- **Escalabilidade**: Configuração de autoscale disponível

---

## 📝 Licença

Este projeto está disponível sob a licença MIT. Você pode usá-lo, modificá-lo e distribuí-lo livremente.

---
