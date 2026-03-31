# Gold Credit Capital Email Studio

## PT-BR

Plataforma de Email Marketing e Automacao de Notificacoes criada para a Gold Credit Capital, com foco em comunicacoes financeiras profissionais, visualizacao imediata do template e geracao de HTML robusto para Gmail e Outlook.

### Objetivo

Oferecer um painel premium para analistas e times comerciais criarem e-mails institucionais com identidade visual preto/dourado, mantendo consistencia visual, tom sofisticado e estrutura confiavel para clientes do setor financeiro.

### Funcionalidades

- Preview em tempo real por `iframe`
- Template HTML com tabelas e CSS inline
- Campos editaveis para nome do cliente, assunto, corpo do texto e valor da operacao
- Botao para copiar o HTML final
- Envio real de e-mail via SMTP
- Layout responsivo com interface dark mode premium
- Assets de marca integrados ao painel

### Tecnologias

- React 18
- Vite 5
- CSS moderno com design system customizado
- Docker / Docker Compose para ambiente local

### Estrutura

```text
.
|-- public/
|   `-- assets/
|-- src/
|   |-- assets/
|   |-- components/
|   |-- utils/
|   |-- App.jsx
|   |-- main.jsx
|   `-- styles.css
|-- Dockerfile
|-- docker-compose.yml
|-- index.html
`-- package.json
```

### Como rodar localmente

```bash
npm install
npm run dev
```

Aplicacao local:

```text
http://localhost:5173
```

API local de envio:

```text
http://localhost:3000
```

### Configuracao SMTP

Crie um arquivo `.env` na raiz a partir de `.env.example` e preencha os dados reais do servidor SMTP.

```bash
cp .env.example .env
```

Variaveis principais:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `EMAIL_FROM_NAME`
- `EMAIL_TO_DEFAULT`

Observacao:

- Inferencia feita em 31/03/2026 a partir do MX do dominio `goldcreditsa.com.br`: o e-mail aparenta estar no Google.
- Por isso o projeto ja nasce configurado com `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587` e `SMTP_SECURE=false`.
- Se a conta `mauricio@goldcreditsa.com.br` estiver em Google Workspace, use uma senha de app ou credencial SMTP equivalente em `SMTP_PASS`.

Padrao do projeto:

- Remetente padrao: `mauricio@goldcreditsa.com.br`
- Destinatario padrao: `mauricio@goldcreditsa.com.br`

### Build de producao

```bash
npm run build
npm run start
```

### Rodando com Docker Compose

```bash
docker compose up --build
```

Aplicacao containerizada:

```text
http://localhost:3000
```

---

## EN

Email Marketing and Notification Automation studio built for Gold Credit Capital, focused on professional financial communications, real-time template preview, and reliable HTML generation for Gmail and Outlook.

### Purpose

Provide a premium workspace for analysts and relationship teams to prepare client-facing institutional emails with a black-and-gold identity, consistent tone, and dependable rendering.

### Features

- Real-time `iframe` preview
- Table-based HTML email with inline CSS
- Editable fields for customer name, subject, body text, and operation value
- Copy-to-clipboard HTML action
- Real email delivery through SMTP
- Responsive premium dark interface
- Brand assets embedded in the experience

### Stack

- React 18
- Vite 5
- Custom CSS design system
- Docker / Docker Compose for local environment

### Run locally

```bash
npm install
npm run dev
```

Local app:

```text
http://localhost:5173
```

Local mail API:

```text
http://localhost:3000
```

### SMTP setup

Create a `.env` file from `.env.example` and fill in the real SMTP credentials.

```bash
cp .env.example .env
```

Main variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `EMAIL_FROM_NAME`
- `EMAIL_TO_DEFAULT`

Note:

- Inference made on March 31, 2026 from the `goldcreditsa.com.br` MX record: mail appears to be handled by Google.
- That is why the project now defaults to `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, and `SMTP_SECURE=false`.
- If `mauricio@goldcreditsa.com.br` is a Google Workspace mailbox, use an app password or equivalent SMTP credential in `SMTP_PASS`.

Project defaults:

- Default sender: `mauricio@goldcreditsa.com.br`
- Default recipient: `mauricio@goldcreditsa.com.br`

### Production build

```bash
npm run build
npm run start
```

### Docker Compose

```bash
docker compose up --build
```

Containerized app:

```text
http://localhost:3000
```
