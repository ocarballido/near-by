export type Locale = 'es' | 'en' | 'fr';

type Copy = {
	subject: string;
	preheader: string;
	title: string;
	body1: string;
	body2: string;
	buttonLabel: string;
	footerUnsubscribe: string;
	footerIgnore: string;
};

const MESSAGES: Record<Locale, Copy> = {
	es: {
		subject: 'Tu guía digital te está esperando',
		preheader: 'Crea tu primer alojamiento en menos de 3 minutos.',
		title: 'Aún no has creado tu primer alojamiento',
		body1: 'Te registraste en BNBexplorer pero todavía no has añadido ningún alojamiento. Solo necesitas el nombre y la dirección para empezar.',
		body2: 'En menos de 3 minutos tendrás una guía digital lista para compartir con tus inquilinos.',
		buttonLabel: 'Crear mi primer alojamiento',
		footerUnsubscribe: 'No quiero recibir más emails',
		footerIgnore: 'Si no reconoces este email, puedes ignorarlo.',
	},
	en: {
		subject: 'Your digital guide is waiting for you',
		preheader: 'Create your first property in less than 3 minutes.',
		title: "You haven't created your first property yet",
		body1: "You signed up to BNBexplorer but haven't added any property yet. You only need a name and an address to get started.",
		body2: "In less than 3 minutes you'll have a digital guide ready to share with your guests.",
		buttonLabel: 'Create my first property',
		footerUnsubscribe: 'Unsubscribe from these emails',
		footerIgnore: "If you don't recognise this email, you can ignore it.",
	},
	fr: {
		subject: 'Votre guide numérique vous attend',
		preheader: 'Créez votre premier hébergement en moins de 3 minutes.',
		title: "Vous n'avez pas encore créé votre premier hébergement",
		body1: "Vous vous êtes inscrit sur BNBexplorer mais n'avez pas encore ajouté d'hébergement. Vous n'avez besoin que d'un nom et d'une adresse pour commencer.",
		body2: 'En moins de 3 minutes, vous aurez un guide numérique prêt à partager avec vos locataires.',
		buttonLabel: 'Créer mon premier hébergement',
		footerUnsubscribe: 'Se désabonner de ces emails',
		footerIgnore:
			"Si vous ne reconnaissez pas cet email, vous pouvez l'ignorer.",
	},
};

function getCopy(locale: string): Copy {
	const normalized = (locale || 'en').split('-')[0] as Locale;
	return MESSAGES[normalized] ?? MESSAGES.en;
}

type Params = {
	locale: string;
	appUrl: string;
	heroUrl: string;
	logoSymbolUrl: string;
	footerLogoUrl: string;
	unsubscribeUrl: string;
};

export function renderA1NoPropertyDay2({
	locale,
	appUrl,
	heroUrl,
	logoSymbolUrl,
	footerLogoUrl,
	unsubscribeUrl,
}: Params): { subject: string; html: string } {
	const copy = getCopy(locale);
	const ctaUrl = `${appUrl}/${locale}/app/properties/new`;

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

			<!-- Hero -->
            <a href="${ctaUrl}" style="text-decoration: none; display: block;">
              <img class="img" src="${heroUrl}" alt="BNBexplorer" />
            </a>
            <!-- /Hero -->

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
                              <p>${copy.body2}</p>
                              <!-- CTA Button -->
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td align="center" style="padding: 16px 0;">
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
