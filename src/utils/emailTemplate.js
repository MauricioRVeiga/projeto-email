const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const COMPANY_CONTACT_EMAIL = 'mauricio@goldcreditsa.com.br';

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function parseCurrencyValue(input) {
  if (typeof input === 'number') {
    return Number.isFinite(input) ? input : 0;
  }

  const cleaned = String(input ?? '').trim();

  if (!cleaned) {
    return 0;
  }

  if (cleaned.includes(',') && cleaned.includes('.')) {
    const commaIndex = cleaned.lastIndexOf(',');
    const dotIndex = cleaned.lastIndexOf('.');

    if (commaIndex > dotIndex) {
      return Number(cleaned.replaceAll('.', '').replace(',', '.')) || 0;
    }

    return Number(cleaned.replaceAll(',', '')) || 0;
  }

  if (cleaned.includes(',')) {
    return Number(cleaned.replaceAll('.', '').replace(',', '.')) || 0;
  }

  return Number(cleaned.replaceAll(',', '')) || 0;
}

export function formatCurrencyValue(input) {
  return currencyFormatter.format(parseCurrencyValue(input));
}

export function createOperationCode(customerName) {
  const slug = (customerName || 'cliente')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, 'X');

  return `GCC-${new Date().getFullYear()}-${slug}`;
}

function convertBodyToHtml(bodyText) {
  return escapeHtml(bodyText)
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p style="margin: 0 0 18px; color: #F7F7F7; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.75;">${paragraph.replace(/\r?\n/g, '<br />')}</p>`,
    )
    .join('');
}

export function buildEmailHtml({
  customerName,
  subject,
  body,
  operationValue,
}) {
  const recipient = customerName?.trim() || 'Cliente Gold Credit';
  const safeSubject =
    subject?.trim() || 'Atualizacao sobre sua operacao de credito';
  const safeBody =
    body?.trim() ||
    'Estamos encaminhando a formalizacao da operacao em andamento. Permanecemos a disposicao para qualquer validacao complementar.';
  const formattedValue = formatCurrencyValue(operationValue);
  const operationCode = createOperationCode(recipient);
  const today = longDateFormatter.format(new Date());
  const safePreview = escapeHtml(
    `Gold Credit Capital | ${safeSubject} | ${formattedValue}`,
  );
  const bodyHtml = convertBodyToHtml(safeBody);

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${escapeHtml(safeSubject)}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #000000; background: #000000;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all;">
      ${safePreview}
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse; background-color: #000000; background: #000000;">
      <tr>
        <td align="center" style="padding: 30px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; max-width: 640px; border-collapse: collapse; background-color: #090909; border: 1px solid #2A2A2A;">
            <tr>
              <td style="padding: 22px 28px; border-bottom: 1px solid #2A2A2A; background-color: #050505;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="font-family: Georgia, 'Times New Roman', serif; font-size: 30px; line-height: 1.1; color: #C5A059; letter-spacing: 0.8px;">
                      Gold Credit
                    </td>
                    <td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.4; letter-spacing: 2px; text-transform: uppercase; color: #B3B3B3;">
                      Capital
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 34px 28px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding-bottom: 22px;">
                      <span style="display: inline-block; padding: 8px 14px; border: 1px solid #C5A059; font-family: Arial, Helvetica, sans-serif; font-size: 10px; line-height: 1; letter-spacing: 1.8px; text-transform: uppercase; color: #C5A059;">
                        Formalizacao de Operacao
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; font-family: Georgia, 'Times New Roman', serif; font-size: 34px; line-height: 1.18; color: #FFFFFF;">
                      ${escapeHtml(safeSubject)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 28px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #BDBDBD;">
                      Registro interno ${escapeHtml(operationCode)} | ${escapeHtml(today)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 26px; font-family: Arial, Helvetica, sans-serif; font-size: 17px; line-height: 1.7; color: #FFFFFF;">
                      Prezado(a) ${escapeHtml(recipient)},
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 28px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse; background-color: #101010; border-left: 3px solid #C5A059;">
                        <tr>
                          <td style="padding: 24px 22px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.75; color: #F7F7F7;">
                            ${bodyHtml}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 28px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td width="50%" style="padding: 0 8px 0 0;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse; border: 1px solid #2A2A2A; background-color: #0B0B0B;">
                              <tr>
                                <td style="padding: 18px;">
                                  <div style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.4; letter-spacing: 1.4px; text-transform: uppercase; color: #8F8F8F;">
                                    Valor da operacao
                                  </div>
                                  <div style="padding-top: 10px; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; line-height: 1.2; color: #C5A059;">
                                    ${escapeHtml(formattedValue)}
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td width="50%" style="padding: 0 0 0 8px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse; border: 1px solid #2A2A2A; background-color: #0B0B0B;">
                              <tr>
                                <td style="padding: 18px;">
                                  <div style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.4; letter-spacing: 1.4px; text-transform: uppercase; color: #8F8F8F;">
                                    Status
                                  </div>
                                  <div style="padding-top: 10px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #FFFFFF;">
                                    Em formalizacao
                                  </div>
                                  <div style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.6; color: #B3B3B3;">
                                    Analise tratada com sigilo e seguranca operacional.
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 24px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.75; color: #E6E6E6;">
                      Caso deseje ajustar qualquer dado desta operacao, nossa equipe permanece a disposicao para orientacao imediata.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 32px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                        <tr>
                          <td style="background-color: #C5A059; padding: 14px 24px;">
                            <span style="display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1; font-weight: bold; letter-spacing: 1.2px; text-transform: uppercase; color: #000000;">
                              Mesa de Operacoes Gold Credit Capital
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 0 28px 28px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse; border-top: 1px solid #2A2A2A;">
                  <tr>
                    <td style="padding-top: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.7; color: #8A8A8A;">
                      Esta mensagem foi gerada pelo ambiente de relacionamento da Gold Credit Capital. Em caso de duvida, responda este e-mail ou escreva para ${COMPANY_CONTACT_EMAIL}.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
