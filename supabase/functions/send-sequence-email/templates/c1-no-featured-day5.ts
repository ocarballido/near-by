export type Locale = 'es' | 'en' | 'fr';

type Copy = {
	subject: string;
	preheader: string;
	title: string;
	body1: string;
	body2: string;
	list1: string;
	list2: string;
	tip: string;
	buttonLabel: string;
	footerUnsubscribe: string;
	footerIgnore: string;
};

const MESSAGES: Record<Locale, Copy> = {
	es: {
		subject: '¿Cuáles son tus lugares favoritos?',
		preheader: 'Destaca los mejores lugares para tus inquilinos.',
		title: 'Aún puedes mejorar la experiencia de tus huéspedes',
		body1: 'Has añadido localizaciones en tu guía, pero ninguna está etiquetada como Favorita o Visita Obligatoria. Cuando las etiquetes, esos serán los primeros lugares que verán tus inquilinos al abrir la guía. Así podrás ofrecer a tus huéspedes una experiencia personalizada, ayudándoles a sacar el máximo partido a su estancia en base a tu experiencia.',
		body2: 'Recuerda que tienes dos maneras de etiquetar las localizaciones:',
		list1: 'Destacado → Sitios guays en los alrededores.',
		list2: 'Visita obligatoria → ¡Los musts!. Esos lugares que no se pueden perder.',
		buttonLabel: 'Etiqueta tus lugares favoritos',
		footerUnsubscribe: 'No quiero recibir más emails',
		footerIgnore: 'Si no reconoces este email, puedes ignorarlo.',
		tip: '💡 Destacado → lugares que recomiendas especialmente.<br/>⭐ Visita obligatoria → lugares que no se pueden perder.',
	},
	en: {
		subject: 'Which are your favourite places?',
		preheader: 'Highlight the best places for your guests.',
		title: "You can still improve your guests' experience",
		body1: "You've added locations to your guide, but none are tagged as a Favorite or Must-Visit. When you tag them, those will be the first places your guests see when they open the guide. This way, you can offer your guests a personalized experience, helping them make the most of their stay based on your expertise.",
		body2: 'Remember that you have two ways to tag locations:',
		list1: 'Featured → Cool spots in the area.',
		list2: 'Must-Visit → The must-sees! Those places you can’t miss.',
		buttonLabel: 'Tag your favorite places',
		footerUnsubscribe: 'Unsubscribe from these emails',
		footerIgnore: "If you don't recognise this email, you can ignore it.",
		tip: '💡 Featured → places you especially recommend.<br/>⭐ Must Visit → places they cannot miss.',
	},
	fr: {
		subject: 'Quels sont vos endroits préférés?',
		preheader:
			'Mettez en avant les meilleurs endroits pour vos locataires.',
		title: 'Vous pouvez encore améliorer l’expérience de vos voyageurs',
		body1: 'Vous avez ajouté des lieux dans votre guide, mais aucun n’est étiqueté comme Favori ou Incontournable. Lorsque vous les étiqueterez, ce seront les premiers endroits que vos locataires verront en ouvrant le guide. Vous pourrez ainsi offrir à vos voyageurs une expérience personnalisée et les aider à profiter au maximum de leur séjour grâce à votre expérience.',
		body2: 'N’oubliez pas que vous avez deux façons d’étiqueter les lieux :',
		list1: 'À la une → Des endroits sympas dans les environs.',
		list2: 'Incontournable → Les musts ! Les lieux à ne surtout pas manquer.',
		buttonLabel: 'Étiquetez vos lieux favoris',
		footerUnsubscribe: 'Se désabonner de ces emails',
		footerIgnore:
			"Si vous ne reconnaissez pas cet email, vous pouvez l'ignorer.",
		tip: '💡 En vedette → lieux que vous recommandez particulièrement.<br/>⭐ À ne pas manquer → lieux incontournables.',
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
	propertyId: string;
	propertyName: string;
	logoSymbolUrl: string;
	footerLogoUrl: string;
	unsubscribeUrl: string;
};

export function renderC1NoFeaturedDay5({
	locale,
	appUrl,
	heroUrl,
	propertyId,
	propertyName,
	logoSymbolUrl,
	footerLogoUrl,
	unsubscribeUrl,
}: Params): { subject: string; html: string } {
	const copy = getCopy(locale);
	const ctaUrl = `${appUrl}/${locale}/app/properties/${propertyId}/4581a08a-3e78-4800-b16c-575f5da81cba/4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7`;

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

                              <!-- Property name tag -->
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td style="padding: 12px 16px; background-color: #F9FAFB; border-left: 4px solid #0E9F6E; border-radius: 4px; margin-bottom: 16px;">
                                      <p style="color: #1F2A37; font-weight: bold; font-size: 15px; margin: 0;">📍 ${propertyName}</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <p style="margin-top: 16px;">${copy.body1}</p>
                              <p>${copy.body2}</p>
                              <ul>
                                <li>${copy.list1}</li>
                                <li>${copy.list2}</li>
                              </ul>

                              <!-- Tip box -->
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tbody>
                                  <tr>
                                    <td style="padding: 16px; background-color: #ECFDF5; border-radius: 8px; margin-bottom: 16px;">
                                      <p style="color: #065F46; font-size: 14px; margin: 0;">${copy.tip}</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

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
