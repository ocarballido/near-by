// supabase/functions/send-sequence-email/templates/d1-weekly-digest.ts

export type Locale = 'es' | 'en' | 'fr';

type PropertyVisit = {
	property_name: string;
	visit_count: number;
};

type Copy = {
	subject: string;
	preheader: string;
	title: string;
	body1: string;
	visitsLabel: string;
	tipTitle: string;
	buttonLabel: string;
	footerUnsubscribe: string;
	footerIgnore: string;
};

const MESSAGES: Record<Locale, Copy> = {
	es: {
		subject: 'Tus inquilinos han visitado tu guía esta semana',
		preheader: 'Descubre cuántas visitas han recibido tus alojamientos.',
		title: 'Tus guías esta semana',
		body1: 'Aquí tienes un resumen de las visitas que han recibido tus alojamientos esta semana.',
		visitsLabel: 'visitas',
		tipTitle: 'Consejo del mes',
		buttonLabel: 'Ver mis propiedades',
		footerUnsubscribe: 'No quiero recibir más emails',
		footerIgnore: 'Si no reconoces este email, puedes ignorarlo.',
	},
	en: {
		subject: 'Your guests visited your guide this week',
		preheader: 'Discover how many visits your properties received.',
		title: 'Your guides this week',
		body1: 'Here is a summary of the visits your properties received this week.',
		visitsLabel: 'visits',
		tipTitle: 'Tip of the month',
		buttonLabel: 'View my properties',
		footerUnsubscribe: 'Unsubscribe from these emails',
		footerIgnore: "If you don't recognise this email, you can ignore it.",
	},
	fr: {
		subject: 'Vos locataires ont visité votre guide cette semaine',
		preheader: 'Découvrez combien de visites vos hébergements ont reçues.',
		title: 'Vos guides cette semaine',
		body1: 'Voici un résumé des visites reçues par vos hébergements cette semaine.',
		visitsLabel: 'visites',
		tipTitle: 'Conseil du mois',
		buttonLabel: 'Voir mes propriétés',
		footerUnsubscribe: 'Se désabonner de ces emails',
		footerIgnore:
			"Si vous ne reconnaissez pas cet email, vous pouvez l'ignorer.",
	},
};

function getCopy(locale: string): Copy {
	const normalized = (locale || 'en').split('-')[0] as Locale;
	return MESSAGES[normalized] ?? MESSAGES.en;
}

type Tip = {
	emoji: string;
	title: string;
	text: string;
};

type Params = {
	locale: string;
	appUrl: string;
	logoSymbolUrl: string;
	footerLogoUrl: string;
	unsubscribeUrl: string;
	propertyVisits: PropertyVisit[];
	tip: Tip | null;
};

export function renderD1WeeklyDigest({
	locale,
	appUrl,
	logoSymbolUrl,
	footerLogoUrl,
	unsubscribeUrl,
	propertyVisits,
	tip,
}: Params): { subject: string; html: string } {
	const copy = getCopy(locale);
	const ctaUrl = `${appUrl}/${locale}/app/properties`;

	const visitsRows = propertyVisits
		.map(
			(p) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-family: sans-serif; font-size: 15px; color: #374151;">
          ${p.property_name}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-family: sans-serif; font-size: 15px; font-weight: bold; color: #0E9F6E; text-align: right;">
          ${p.visit_count} ${copy.visitsLabel}
        </td>
      </tr>`,
		)
		.join('');

	const tipBlock = tip
		? `
      <tr>
        <td style="padding-top: 24px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F0FDF9; border-radius: 8px; padding: 16px;">
            <tbody>
              <tr>
                <td style="padding: 16px;">
                  <p style="font-family: sans-serif; font-size: 13px; font-weight: bold; color: #0E9F6E; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
                    ${copy.tipTitle}
                  </p>
                  <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; color: #1F2A37; margin: 0 0 8px 0;">
                    ${tip.emoji} ${tip.title}
                  </p>
                  <p style="font-family: sans-serif; font-size: 14px; color: #374151; line-height: 1.6; margin: 0;">
                    ${tip.text}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>`
		: '';

	const html = `<!DOCTYPE html>
<html lang="${locale}" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${copy.subject}</title>
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
    <span class="preheader">${copy.preheader}</span>

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

            <!-- Main content -->
            <div class="content">
              <table role="presentation" class="main">
                <tbody>
                  <tr>
                    <td class="wrapper">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tbody>
                          <tr>
                            <td>
                              <h2>${copy.title}</h2>
                              <p>${copy.body1}</p>

                              <!-- Tabla de visitas -->
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  ${visitsRows}
                                </tbody>
                              </table>

                              <!-- Tip estacional -->
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  ${tipBlock}
                                </tbody>
                              </table>

                              <!-- CTA Button -->
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td align="center" style="padding: 24px 0 8px 0;">
                                      <a href="${ctaUrl}" class="btn-primary" target="_blank">${copy.buttonLabel}</a>
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
                        <p style="margin-top: 8px;">${copy.footerIgnore}</p>
                        <p><a href="${unsubscribeUrl}" style="color: #999999;">${copy.footerUnsubscribe}</a></p>
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

	return { subject: copy.subject, html };
}
