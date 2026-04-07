// supabase/functions/send-sequence-email/templates/e1-broadcast.ts

export type Locale = 'es' | 'en' | 'fr';

type FooterCopy = {
	footerUnsubscribe: string;
	footerIgnore: string;
	defaultCtaLabel: string;
};

const FOOTER_MESSAGES: Record<Locale, FooterCopy> = {
	es: {
		defaultCtaLabel: 'Visita BNBexplorer',
		footerUnsubscribe: 'No quiero recibir más emails',
		footerIgnore: 'Si no reconoces este email, puedes ignorarlo.',
	},
	en: {
		defaultCtaLabel: 'Visit BNBexplorer',
		footerUnsubscribe: 'Unsubscribe from these emails',
		footerIgnore: "If you don't recognise this email, you can ignore it.",
	},
	fr: {
		defaultCtaLabel: 'Visiter BNBexplorer',
		footerUnsubscribe: 'Se désabonner de ces emails',
		footerIgnore:
			"Si vous ne reconnaissez pas cet email, vous pouvez l'ignorer.",
	},
};

function getFooterCopy(locale: string): FooterCopy {
	const normalized = (locale || 'en').split('-')[0] as Locale;
	return FOOTER_MESSAGES[normalized] ?? FOOTER_MESSAGES.en;
}

export type BroadcastParams = {
	locale: string;
	appUrl: string;
	logoSymbolUrl: string;
	footerLogoUrl: string;
	unsubscribeUrl: string;
	// Obligatorios
	subject: string;
	preheader: string;
	title: string;
	mainText: string;
	// Opcionales
	imageUrl?: string;
	alertText?: string;
	bullets?: string[];
	ctaLabel?: string;
	ctaUrl?: string;
	emailType?: 'newsletter' | 'survey' | 'announcement';
};

export function renderE1Broadcast({
	locale,
	appUrl,
	logoSymbolUrl,
	footerLogoUrl,
	unsubscribeUrl,
	subject,
	preheader,
	title,
	mainText,
	imageUrl,
	alertText,
	bullets,
	ctaLabel,
	ctaUrl,
}: BroadcastParams): { subject: string; html: string } {
	const footer = getFooterCopy(locale);

	const resolvedCtaUrl = ctaUrl ?? appUrl;
	const resolvedCtaLabel = ctaLabel ?? footer.defaultCtaLabel;

	// Bloque hero image — solo si hay imageUrl
	const heroBlock = imageUrl
		? `
		<!-- Hero -->
		<a href="${resolvedCtaUrl}" style="text-decoration: none; display: block;">
			<img class="img" src="${imageUrl}" alt="BNBexplorer" style="width: 100%; max-width: 600px; display: block;" />
		</a>
		<!-- /Hero -->`
		: '';

	// Bloque alert — solo si hay alertText
	const alertBlock = alertText
		? `
		<!-- Alert -->
		<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
			<tbody>
				<tr>
					<td style="padding: 16px; background-color: #ECFDF5; border-radius: 8px;">
						<p style="color: #065F46; font-size: 14px; margin: 0; line-height: 1.6;">${alertText}</p>
					</td>
				</tr>
			</tbody>
		</table>
		<!-- /Alert -->`
		: '';

	// Bloque bullets — solo si hay bullets y tiene items
	const bulletsBlock =
		bullets && bullets.length > 0
			? `
		<!-- Bullets -->
		<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
			<tbody>
				${bullets
					.map(
						(bullet) => `
				<tr>
					<td style="padding: 6px 0; vertical-align: top; width: 20px; text-align: left;">
              <span style="color: #0E9F6E; font-size: 15px; font-weight: bold;">·</span>
          </td>
          <td style="padding: 6px 0; font-family: sans-serif; font-size: 15px; color: #374151; line-height: 1.6; text-align: left;">
              ${bullet}
          </td>
				</tr>`,
					)
					.join('')}
			</tbody>
		</table>
		<!-- /Bullets -->`
			: '';

	const html = `<!DOCTYPE html>
<html lang="${locale}" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
    <style>
      .img { border: none; -ms-interpolation-mode: bicubic; max-width: 100%; margin: 0 auto; display: block; }
      body { background-color: #F3F4F6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
      table { border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; }
      table td { font-family: sans-serif; font-size: 14px; vertical-align: top; }
      .body { background-color: #F3F4F6; color: #1F2A37; text-align: center; width: 100%; }
      .container { display: block; margin: 0 auto !important; max-width: 600px; width: 600px; }
      .content { box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 8px; }
      .main { width: 100%; }
      .wrapper { box-sizing: border-box; padding: 24px; background-color: #ffffff; border-radius: 8px; }
      .appbar { background-color: white; border-radius: 8px; box-shadow: 0 2px 2px rgba(0,0,0,.1); padding: 16px; }
      .footer { clear: both; margin-top: 10px; text-align: center; width: 100%; }
      .footer td, .footer p, .footer span, .footer a { color: #999999; font-size: 12px; text-align: center; }
      h2 { color: #1F2A37; font-family: sans-serif; font-size: 22px; font-weight: bold; line-height: 1.4; margin: 0 0 16px 0; }
      p { font-family: sans-serif; font-size: 15px; font-weight: normal; line-height: 1.6; margin: 0 0 15px 0; color: #374151; }
      a { color: #3498db; text-decoration: underline; }
      .btn-primary { background-color: #0E9F6E; border-radius: 48px; color: #ffffff !important; font-weight: bold; padding: 14px 24px; text-decoration: none; display: inline-block; font-size: 15px; }
      .preheader { color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0; }
      @media only screen and (max-width: 600px) {
        table.body .container { padding: 0 !important; width: 100% !important; }
        table.body .wrapper { padding: 16px !important; }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #F3F4F6;">
    <span class="preheader">${preheader}</span>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tbody>
        <tr>
          <td>&nbsp;</td>
          <td class="container">

            <!-- Appbar -->
            <div class="content" style="padding-top: 16px;">
              <div class="appbar">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tbody>
                    <tr>
                      <td>
                        <a target="_blank" href="${appUrl}" style="text-decoration: none; display: flex; gap: 8px; align-items: center; color: #1F2A37; font-weight: bold;">
                          <img src="${logoSymbolUrl}" style="display: inline; height: 28px;" alt="BNBexplorer logo" />
                          <span style="font-family: sans-serif; font-size: 15px; color: #1F2A37; font-weight: bold;">BNBexplorer</span>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- /Appbar -->

            ${heroBlock}

            <!-- Main content -->
            <div class="content">
              <table role="presentation" class="main">
                <tbody>
                  <tr>
                    <td class="wrapper" style="text-align: left;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tbody>
                          <tr>
                            <td>
                              <h2>${title}</h2>
                              <p>${mainText}</p>

                              ${alertBlock}
                              ${bulletsBlock}

                              <!-- CTA Button -->
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td align="center" style="padding: 16px 0 8px 0;">
                                      <a href="${resolvedCtaUrl}" class="btn-primary" target="_blank">${resolvedCtaLabel}</a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- /Main content -->

            <!-- Footer -->
            <div class="content">
              <div class="footer">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tbody>
                    <tr>
                      <td class="content-block" style="padding: 10px 0;">
                        <a href="${appUrl}" target="_blank" style="text-decoration: none; display: block;">
                          <img class="img" src="${footerLogoUrl}" alt="BNBexplorer logo" style="height: 24px; margin: 0 auto 8px auto;" />
                        </a>
                        <p style="margin-top: 8px;">${footer.footerIgnore}</p>
                        <p><a href="${unsubscribeUrl}" style="color: #999999;">${footer.footerUnsubscribe}</a></p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- /Footer -->

          </td>
          <td>&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;

	return { subject, html };
}
