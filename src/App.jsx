import { useEffect, useState } from 'react';
import HtmlCodeBlock from './components/HtmlCodeBlock';
import MetricCard from './components/MetricCard';
import PreviewFrame from './components/PreviewFrame';
import {
  buildEmailHtml,
  createOperationCode,
  formatCurrencyValue,
  parseCurrencyValue,
} from './utils/emailTemplate';

const COMPANY_EMAIL_DOMAIN = 'goldcreditsa.com.br';
const DEFAULT_RECIPIENT_EMAIL = `mauricio@${COMPANY_EMAIL_DOMAIN}`;

const initialForm = {
  customerName: 'Patricia Andrade',
  subject: 'Formalizacao da operacao de credito estruturado',
  body: `Apresentamos a consolidacao preliminar da sua operacao, incluindo o valor aprovado e o enquadramento da mesa de credito.\n\nNosso objetivo e garantir clareza, agilidade e uma comunicacao formal adequada para a etapa de validacao final.\n\nSe desejar, podemos adaptar este comunicado para envio institucional imediato.`,
  operationValue: '1250000,00',
  testEmail: DEFAULT_RECIPIENT_EMAIL,
};

const idleMessage =
  'Ajuste os campos ao lado para refinar o HTML antes de enviar aos clientes.';

function formatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export default function App() {
  const [formData, setFormData] = useState(initialForm);
  const [feedback, setFeedback] = useState({
    tone: 'idle',
    message: idleMessage,
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (feedback.tone === 'idle') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setFeedback({
        tone: 'idle',
        message: idleMessage,
      });
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [feedback]);

  const emailHtml = buildEmailHtml(formData);
  const operationCode = createOperationCode(formData.customerName);
  const formattedValue = formatCurrencyValue(formData.operationValue);
  const emailLength = `${emailHtml.length.toLocaleString('pt-BR')} chars`;
  const trimmedBody = formData.body.trim();
  const bodySize = trimmedBody
    ? `${trimmedBody.split(/\s+/).length} palavras`
    : '0 palavras';
  const operationValue = parseCurrencyValue(formData.operationValue);

  function updateField(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(emailHtml);
      setFeedback({
        tone: 'success',
        message: 'Codigo HTML copiado para a area de transferencia.',
      });
    } catch (error) {
      setFeedback({
        tone: 'error',
        message:
          'Nao foi possivel copiar automaticamente. Verifique as permissoes do navegador.',
      });
    }
  }

  async function sendTestEmail() {
    if (!formData.testEmail.trim()) {
      setFeedback({
        tone: 'error',
        message: 'Informe um destinatario valido antes de enviar o e-mail.',
      });
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.testEmail.trim() || DEFAULT_RECIPIENT_EMAIL,
          subject: formData.subject,
          html: emailHtml,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Falha ao enviar o e-mail.');
      }

      const sentAt = formatTimestamp(
        result.sentAt ? new Date(result.sentAt) : new Date(),
      );

      setFeedback({
        tone: 'success',
        message: `E-mail enviado para ${result.to || formData.testEmail} em ${sentAt}.`,
      });
    } catch (error) {
      setFeedback({
        tone: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Nao foi possivel concluir o envio real do e-mail.',
      });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-panel__copy">
          <span className="eyebrow">Ambiente de automacao financeira</span>
          <h1>Gold Credit Capital Email Studio</h1>
          <p>
            Um painel sob medida para gerar comunicacoes formais, visualizar o
            template final em tempo real e padronizar notificacoes com assinatura
            premium.
          </p>
        </div>

        <div className="hero-panel__brand">
          <img
            alt="Logo Gold Credit Capital"
            className="hero-panel__logo"
            src="/assets/gold-credit-logo.jpg"
          />

          <div className="hero-panel__photo">
            <img
              alt="Escritorio Gold Credit Capital"
              src="/assets/gold-credit-office.jpeg"
            />
          </div>
        </div>
      </section>

      <section className="workspace-grid">
        <aside className="panel panel--controls">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Editor de mensagem</span>
              <h2>Dados da operacao</h2>
            </div>
            <p>Preencha os campos e acompanhe a composicao final ao lado.</p>
          </div>

          <div className="metrics-grid">
            <MetricCard label="Codigo interno" tone="gold" value={operationCode} />
            <MetricCard label="Valor formatado" value={formattedValue} />
            <MetricCard label="Extensao do HTML" value={emailLength} />
            <MetricCard label="Corpo da mensagem" value={bodySize} />
          </div>

          <form className="form-grid">
            <label className="field">
              <span>Nome do cliente</span>
              <input
                name="customerName"
                onChange={updateField}
                placeholder="Ex.: Patricia Andrade"
                type="text"
                value={formData.customerName}
              />
            </label>

            <label className="field">
              <span>Assunto</span>
              <input
                name="subject"
                onChange={updateField}
                placeholder="Assunto do comunicado"
                type="text"
                value={formData.subject}
              />
            </label>

            <label className="field">
              <span>Valor da operacao</span>
              <input
                name="operationValue"
                onChange={updateField}
                placeholder="Ex.: 1250000,00"
                type="text"
                value={formData.operationValue}
              />
            </label>

            <label className="field field--full">
              <span>Corpo do texto</span>
              <textarea
                name="body"
                onChange={updateField}
                placeholder="Descreva a atualizacao de forma objetiva e institucional."
                rows="10"
                value={formData.body}
              />
            </label>

            <div className="operation-summary">
              <div>
                <span className="operation-summary__label">Resumo da mesa</span>
                <strong>{formattedValue}</strong>
                <p>
                  O template destaca o valor da operacao, o assunto do comunicado
                  e um registro interno consistente para equipes de credito.
                </p>
              </div>
              <span className="operation-summary__pill">
                {operationValue > 0
                  ? 'Operacao pronta para formalizacao'
                  : 'Aguardando valor'}
              </span>
            </div>
          </form>

          <div className={`feedback feedback--${feedback.tone}`}>
            <strong>Painel de status</strong>
            <p>{feedback.message}</p>
          </div>

          <div className="actions-card">
            <label className="field field--full">
              <span>Destinatario</span>
              <input
                name="testEmail"
                onChange={updateField}
                placeholder={DEFAULT_RECIPIENT_EMAIL}
                type="email"
                value={formData.testEmail}
              />
            </label>

            <div className="actions-row">
              <button
                className="button button--primary"
                onClick={copyHtml}
                type="button"
              >
                Copiar codigo HTML
              </button>
              <button
                className="button button--secondary"
                disabled={isSending}
                onClick={sendTestEmail}
                type="button"
              >
                {isSending ? 'Enviando e-mail...' : 'Enviar e-mail agora'}
              </button>
            </div>

            <p className="actions-card__note">
              O envio e real via SMTP. Configure o arquivo .env com as credenciais
              de {`mauricio@${COMPANY_EMAIL_DOMAIN}`} ou outro remetente do dominio
              {` ${COMPANY_EMAIL_DOMAIN}`}.
            </p>
          </div>
        </aside>

        <section className="panel panel--preview">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Renderizacao final</span>
              <h2>Preview do e-mail</h2>
            </div>
            <p>
              Estrutura baseada em tabelas, com contraste alto e assinatura visual
              alinhada ao universo de credito premium.
            </p>
          </div>

          <PreviewFrame html={emailHtml} />
        </section>
      </section>

      <HtmlCodeBlock html={emailHtml} />
    </main>
  );
}
