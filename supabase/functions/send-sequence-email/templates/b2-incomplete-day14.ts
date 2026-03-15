export type Locale = 'es' | 'en' | 'fr';

type Copy = {
	subject: string;
	preheader: string;
	title: string;
	body1: string;
	body2: string;
	body3: string;
	body4: string;
	buttonLabel: string;
	footerUnsubscribe: string;
	footerIgnore: string;
};

const MESSAGES: Record<Locale, Copy> = {
	es: {
		subject: 'Tus inquilinos merecen la mejor guía',
		preheader: 'Tu alojamiento lleva 2 semanas sin completarse.',
		title: 'Estás a sólo 3 minutos de convertirte en un mejor anfitrión',
		body1: 'Siguen pasando los días y aún no has completado la guía digital de tu alojamiento en BNBexplorer. ¡Es gratis y no te llevará más de 3 minutos!',
		body2: '¿Sabías que los anfitriones que han completado sus guías en nuestra plataforma han conseguido mejorar sus valoraciones en un 87%?',
		body3: 'Empieza por añadir la información básica sobre la casa, las normas y horarios y unos pocos lugares cercanos. Nuestra plataforma te ofrecerá sugerencias para hacer el proceso más rápido y sencillo. En cuestión de segundos dispondrás de una web profesional para compartir con tus huéspedes.',
		body4: 'Convertirte en un anfitrión 5 estrellas es mucho más fácil de lo que crees.',
		buttonLabel: 'Completar mi alojamiento ahora',
		footerUnsubscribe: 'No quiero recibir más emails',
		footerIgnore: 'Si no reconoces este email, puedes ignorarlo.',
	},
	en: {
		subject: 'Your guests deserve the best guide',
		preheader: 'Your property has been incomplete for 2 weeks.',
		title: 'You’re just 3 minutes away from becoming a better host',
		body1: 'The days keep passing, and you still haven’t completed your property’s digital guide on BNBexplorer. It’s free and won’t take more than 3 minutes!',
		body2: 'Did you know that hosts who have completed their guides on our platform have seen their ratings improve by 87%?',
		body3: 'Start by adding basic information about the house, the rules and schedules, and a few nearby places. Our platform will offer suggestions to make the process faster and easier. In a matter of seconds, you’ll have a professional website to share with your guests.',
		body4: 'Becoming a 5-star host is much easier than you think.',
		buttonLabel: 'Complete my property now',
		footerUnsubscribe: 'Unsubscribe from these emails',
		footerIgnore: "If you don't recognise this email, you can ignore it.",
	},
	fr: {
		subject: 'Vos locataires méritent le meilleur guide',
		preheader: 'Votre hébergement est incomplet depuis 2 semaines.',
		title: 'Vous n’êtes plus qu’à 3 minutes de devenir un meilleur hôte',
		body1: 'Les jours passent et vous n’avez toujours pas terminé le guide numérique de votre logement sur BNBexplorer. C’est gratuit et cela ne vous prendra pas plus de 3 minutes !',
		body2: 'Saviez-vous que les hôtes qui ont complété leur guide sur notre plateforme ont vu leurs notes s’améliorer de 87 % ?',
		body3: 'Commencez par ajouter les informations de base sur le logement, les règles et les horaires, ainsi que quelques lieux à proximité. Notre plateforme vous proposera des suggestions pour rendre le processus plus rapide et plus simple. En quelques secondes, vous aurez un site web professionnel à partager avec vos voyageurs.',
		body4: 'Devenir un hôte 5 étoiles est beaucoup plus facile que vous ne le pensez.',
		buttonLabel: 'Compléter mon hébergement maintenant',
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
	propertyId: string;
	propertyName: string;
	logoSymbolUrl: string;
	footerLogoUrl: string;
	unsubscribeUrl: string;
};

export function renderB2IncompleteDay14({
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
                              <p><b>${copy.body3}</b></p>
                              <p>${copy.body4}</p>

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
