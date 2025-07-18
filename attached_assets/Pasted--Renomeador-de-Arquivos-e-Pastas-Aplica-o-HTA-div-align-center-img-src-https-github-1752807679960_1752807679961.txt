# Renomeador de Arquivos e Pastas - Aplicação HTA

<div align="center">
    <img src="https://github.com/user-attachments/assets/ab45cd05-a039-4340-a55d-4c20ab251992" alt="Renomeador de Arquivos e Pastas" />
</div>
<br/><br/>

Este projeto consiste em uma aplicação desenvolvida em **VBScript** e **HTML** no formato HTA (HTML Application). A ferramenta foi criada para automatizar o processo de renomeação de arquivos e pastas em um diretório específico, oferecendo uma interface gráfica simples e intuitiva para facilitar sua utilização.

---

## 🛠 Características

- **Interface Gráfica Intuitiva**: Interface moderna e personalizável para facilitar o uso.
- **Automatização Completa**: Renomeia arquivos ou pastas com base em um prefixo personalizado e numeração sequencial.
- **Personalização**: Possibilidade de configurar o prefixo, a posição do número sequencial e o tipo de item a ser renomeado (arquivos ou pastas).
- **Flexibilidade**: Suporte para múltiplos formatos de arquivo e renomeação de subpastas.
- **Compatibilidade**: Funciona em sistemas Windows que suportam aplicativos HTA.

---

## 🚀 Funcionalidades

- Renomeia arquivos e pastas com base em:
  - **Prefixo personalizado**.
  - **Posição do contador sequencial** (antes ou depois do prefixo).
- Suporte para renomear somente arquivos ou somente pastas.
- Exibe mensagens claras de status (sucesso ou erro) diretamente na interface.

---

## 📋 Como Usar

### 1. Configurar o Ambiente
Certifique-se de que o sistema operacional suporta aplicações HTA:
- **Requisitos mínimos**: Windows 10 ou superior.

### 2. Executar a Aplicação
1. Salve o arquivo com a extensão `.hta` (ex.: `renomeador.hta`).
2. Dê um duplo clique no arquivo para abrir a interface gráfica.

### 3. Configurar e Renomear
1. **Escolha a Pasta**:
   - Insira o caminho completo para o diretório no campo **"Escolha a pasta"**.
2. **Defina o Prefixo**:
   - Digite o prefixo a ser adicionado aos itens renomeados.
3. **Configure o Contador**:
   - Escolha se o contador será exibido **antes** ou **depois** do prefixo.
4. **Escolha o Tipo de Item**:
   - Selecione se deseja renomear apenas **arquivos** ou **pastas**.
5. **Clique em "Renomear"**:
   - A aplicação renomeará os itens no diretório especificado e exibirá o status do processo.

---

## 🖥 Interface Gráfica

A interface da aplicação é composta pelos seguintes elementos:

- **Campo para inserir o caminho da pasta alvo.**
- **Campo para definir o prefixo dos nomes.**
- **Seletores para ajustar a posição do contador e o tipo de item a renomear.**
- **Botão de execução** para iniciar o processo de renomeação.
- **Mensagem de status** exibida ao final do processo.

---

## 🧩 Estrutura do Código

- **HTML**: Define a estrutura e estilo da interface gráfica.
- **VBScript**: Implementa a lógica de renomeação dos arquivos e pastas usando o `FileSystemObject`.
- **CSS Inline**: Personaliza o design e a responsividade do layout.

---

## 💻 Requisitos Técnicos

- **Sistema Operacional**: Windows 10 ou superior.
- **Componentes Ativos**: Suporte para execução de aplicativos HTA e scripts VBScript.
- **Permissões**: Acesso total à pasta alvo para leitura e escrita.

---

## ⚠️ Observações

1. **Cuidado ao Renomear**: Certifique-se de que o diretório alvo não contém arquivos críticos que possam ser sobrescritos.
2. **Configuração do Caminho do Ícone**: Atualize o valor de `ICON` no `<HTA:APPLICATION>` para um ícone disponível no seu sistema, se necessário.

---

## 📝 Licença

Este projeto está disponível sob a licença MIT. Você pode usá-lo, modificá-lo e distribuí-lo à vontade.

---