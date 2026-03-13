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
	logoSymbolUrl: string;
	footerLogoUrl: string;
	unsubscribeUrl: string;
};

export function renderA1NoPropertyDay2({
	locale,
	appUrl,
	logoSymbolUrl,
	footerLogoUrl,
	unsubscribeUrl,
}: Params): { subject: string; html: string } {
	const copy = getCopy(locale);
	const ctaUrl = `${appUrl}/${locale}/app/properties/new`;

	const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${copy.subject}</title>
  <style>
    body { background-color: #F3F4F6; font-family: sans-serif; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 24px 16px; }
    .appbar { background: white; border-radius: 8px; padding: 16px; margin-bottom: 24px; box-shadow: 0 2px 2px rgba(0,0,0,.1); }
    .card { background: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 2px rgba(0,0,0,.1); }
    h2 { color: #1F2A37; font-size: 22px; margin: 0 0 16px 0; }
    p { color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; }
    .btn { display: block; background-color: #0E9F6E; color: white !important; text-decoration: none; text-align: center; padding: 14px 24px; border-radius: 48px; font-weight: bold; font-size: 15px; margin: 24px 0; }
    .footer { text-align: center; margin-top: 24px; }
    .footer p { color: #9CA3AF; font-size: 12px; }
    .footer a { color: #9CA3AF; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">

    <!-- Appbar -->
    <div class="appbar">
      <a href="${appUrl}" style="text-decoration:none; display:flex; align-items:center; gap:8px; color:#1F2A37; font-weight:bold;">
        <img src="${logoSymbolUrl}" alt="BNBexplorer" style="height:28px;" />
        <span>BNBexplorer</span>
      </a>
    </div>

    <!-- Card -->
    <div class="card">
      <h2>${copy.title}</h2>
      <p>${copy.body1}</p>
      <p>${copy.body2}</p>
      <a href="${ctaUrl}" class="btn">${copy.buttonLabel}</a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <a href="${appUrl}">
        <img src="${footerLogoUrl}" alt="BNBexplorer" style="height:24px; margin-bottom:8px;" />
      </a>
      <p>${copy.footerIgnore}</p>
      <p><a href="${unsubscribeUrl}">${copy.footerUnsubscribe}</a></p>
    </div>

  </div>
</body>
</html>`;

	return { subject: copy.subject, html };
}
