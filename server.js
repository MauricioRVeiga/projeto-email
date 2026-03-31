import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || 'false') === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'mauricio@goldcreditsa.com.br';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Gold Credit Capital';
const EMAIL_TO_DEFAULT =
  process.env.EMAIL_TO_DEFAULT || 'mauricio@goldcreditsa.com.br';

const app = express();
const distPath = path.join(__dirname, 'dist');

app.use(express.json({ limit: '2mb' }));

function getMissingSmtpConfig() {
  return [
    ['SMTP_HOST', SMTP_HOST],
    ['SMTP_PORT', SMTP_PORT],
    ['SMTP_USER', SMTP_USER],
    ['SMTP_PASS', SMTP_PASS],
    ['EMAIL_FROM', EMAIL_FROM],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

function hasSmtpConfig() {
  return getMissingSmtpConfig().length === 0;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function htmlToText(html = '') {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

app.get('/api/health', async (_request, response) => {
  response.json({
    ok: true,
    smtpConfigured: hasSmtpConfig(),
    missingConfig: getMissingSmtpConfig(),
    defaultRecipient: EMAIL_TO_DEFAULT,
    fromEmail: EMAIL_FROM,
    port: PORT,
  });
});

app.post('/api/send-email', async (request, response) => {
  const subject = String(request.body?.subject || '').trim();
  const html = String(request.body?.html || '').trim();
  const to = String(request.body?.to || EMAIL_TO_DEFAULT).trim() || EMAIL_TO_DEFAULT;

  if (!subject) {
    response.status(400).json({
      error: 'Informe um assunto antes de enviar o e-mail.',
    });
    return;
  }

  if (!html) {
    response.status(400).json({
      error: 'O HTML do e-mail nao pode estar vazio.',
    });
    return;
  }

  if (!hasSmtpConfig()) {
    const missingConfig = getMissingSmtpConfig();

    response.status(500).json({
      error: `O servidor de envio nao esta configurado. Preencha ${missingConfig.join(', ')} no arquivo .env.`,
      missingConfig,
    });
    return;
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
      to,
      replyTo: EMAIL_FROM,
      subject,
      html,
      text: htmlToText(html),
      headers: {
        'X-App-Name': 'Gold Credit Capital Email Studio',
      },
    });

    response.json({
      ok: true,
      to,
      from: EMAIL_FROM,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      sentAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('SMTP send failed:', error);

    const isAuthError =
      error instanceof Error &&
      (error.message.includes('Invalid login') ||
        error.message.includes('BadCredentials') ||
        error.code === 'EAUTH');

    response.status(500).json({
      error: isAuthError
        ? 'O provedor recusou a autenticacao SMTP. Se a conta estiver no Google Workspace, use uma App Password em vez da senha normal.'
        : 'Falha ao enviar o e-mail via SMTP.',
      details: error instanceof Error ? error.message : 'Erro desconhecido.',
    });
  }
});

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api/')) {
      next();
      return;
    }

    response.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  const smtpStatus = hasSmtpConfig() ? 'SMTP configurado' : 'SMTP pendente';
  console.log(
    `Gold Credit Capital Email Studio rodando em http://localhost:${PORT} (${smtpStatus})`,
  );
});
