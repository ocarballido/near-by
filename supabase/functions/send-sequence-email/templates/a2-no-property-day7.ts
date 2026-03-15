export type Locale = 'es' | 'en' | 'fr';

type Copy = {
	subject: string;
	preheader: string;
	title: string;
	body1: string;
	body2: string;
	body3: string;
	buttonLabel: string;
	footerUnsubscribe: string;
	footerIgnore: string;
};

const MESSAGES: Record<Locale, Copy> = {
	es: {
		subject: '¿Puedo ayudarte con algo?',
		preheader: 'Llevo un tiempo sin verte por aquí.',
		title: '¿Todavía no has creado una guía para tu alojamiento? ¡Es gratis!',
		body1: 'Ya has hecho lo más difícil. Te has registrado en BNBexplorer porque quieres convertirte en un anfitrión de 5 estrellas. ¿Por qué no nos dejas ayudarte? ¡Crear tu primera guía digital es totalmente gratis!',
		body2: 'Prueba BNBexplorer y en menos de tres minutos tendrás una web profesional con toda la información que necesitan tus huéspedes para sacar el máximo partido a su estancia: normas de la casa, horarios, clave de wifi, restaurantes cercanos, farmacias, museos, hospitales y mucho más. Después, les pasas el link y podrán acceder a la guía desde su móvil siempre que necesiten. ¡Hasta pueden crear itinerarios personalizados en base a sus preferencias gracias a nuestra potente IA!',
		body3: 'Crea ya tu primera guía digital y conviértete en el anfitrión 2.0 que necesitan tus inquilinos.',
		buttonLabel: 'Crea tu guía gratis',
		footerUnsubscribe: 'No quiero recibir más emails',
		footerIgnore: 'Si no reconoces este email, puedes ignorarlo.',
	},
	en: {
		subject: 'Can I help you with anything?',
		preheader: "Haven't seen you around for a while.",
		title: "Haven't created a guide for your property yet? It's free!",
		body1: "You've already done the hard part. You signed up for BNBexplorer because you want to become a 5-star host. Why not let us help you? Creating your first digital guide is completely free!",
		body2: 'Try BNBexplorer and in less than three minutes you’ll have a professional website with all the information your guests need to make the most of their stay: house rules, schedules, Wi-Fi password, nearby restaurants, pharmacies, museums, hospitals, and much more. Then, just send them the link and they’ll be able to access the guide from their phone whenever they need it. They can even create personalized itineraries based on their preferences thanks to our powerful AI!',
		body3: 'Create your first digital guide now and become the 2.0 host your guests need.',
		buttonLabel: 'Create your guide for free',
		footerUnsubscribe: 'Unsubscribe from these emails',
		footerIgnore: "If you don't recognise this email, you can ignore it.",
	},
	fr: {
		subject: 'Puis-je vous aider?',
		preheader: 'Je ne vous ai pas vu depuis un moment.',
		title: 'Vous n’avez pas encore créé de guide pour votre logement ? C’est gratuit !',
		body1: 'Vous avez déjà fait le plus difficile. Vous vous êtes inscrit sur BNBexplorer parce que vous voulez devenir un hôte 5 étoiles. Alors pourquoi ne pas nous laisser vous aider ? Créer votre premier guide numérique est totalement gratuit !',
		body2: 'Essayez BNBexplorer et, en moins de trois minutes, vous aurez un site web professionnel avec toutes les informations dont vos voyageurs ont besoin pour profiter au maximum de leur séjour : règles de la maison, horaires, mot de passe Wi-Fi, restaurants à proximité, pharmacies, musées, hôpitaux et bien plus encore. Ensuite, il vous suffit de leur envoyer le lien et ils pourront accéder au guide depuis leur téléphone chaque fois qu’ils en auront besoin. Ils peuvent même créer des itinéraires personnalisés en fonction de leurs préférences grâce à notre puissante IA !',
		body3: 'Créez dès maintenant votre premier guide numérique et devenez l’hôte 2.0 dont vos locataires ont besoin.',
		buttonLabel: 'Créez votre guide gratuitement',
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

export function renderA2NoPropertyDay7({
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
                              <p>${copy.body3}</p>
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
