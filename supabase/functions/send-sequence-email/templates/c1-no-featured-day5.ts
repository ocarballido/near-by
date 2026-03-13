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
		subject: '¿Cuáles son tus lugares favoritos?',
		preheader: 'Destaca los mejores lugares para tus inquilinos.',
		title: 'Tus inquilinos no saben por dónde empezar',
		body1: 'Tienes localizaciones añadidas en tu guía, pero ninguna está etiquetada como Destacada o Visita obligatoria. Estos son los primeros lugares que ven tus inquilinos al abrir la guía.',
		body2: 'Etiqueta tus lugares favoritos o imprescindibles y dale a tus inquilinos un punto de partida claro desde el primer momento.',
		buttonLabel: 'Etiquetar mis lugares favoritos',
		footerUnsubscribe: 'No quiero recibir más emails',
		footerIgnore: 'Si no reconoces este email, puedes ignorarlo.',
	},
	en: {
		subject: 'Which are your favourite places?',
		preheader: 'Highlight the best places for your guests.',
		title: "Your guests don't know where to start",
		body1: 'You have locations added to your guide, but none of them are tagged as Featured or Must Visit. These are the first places your guests see when they open the guide.',
		body2: 'Tag your favourite or must-see places and give your guests a clear starting point from the very first moment.',
		buttonLabel: 'Tag my favourite places',
		footerUnsubscribe: 'Unsubscribe from these emails',
		footerIgnore: "If you don't recognise this email, you can ignore it.",
	},
	fr: {
		subject: 'Quels sont vos endroits préférés?',
		preheader:
			'Mettez en avant les meilleurs endroits pour vos locataires.',
		title: 'Vos locataires ne savent pas par où commencer',
		body1: "Vous avez des lieux ajoutés dans votre guide, mais aucun n'est étiqueté comme En vedette ou À ne pas manquer. Ce sont les premiers lieux que vos locataires voient en ouvrant le guide.",
		body2: 'Étiquetez vos lieux favoris ou incontournables et donnez à vos locataires un point de départ clair dès le premier instant.',
		buttonLabel: 'Étiqueter mes lieux préférés',
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
	propertyId: string;
	propertyName: string;
	logoSymbolUrl: string;
	footerLogoUrl: string;
	unsubscribeUrl: string;
};

export function renderC1NoFeaturedDay5({
	locale,
	appUrl,
	propertyId,
	propertyName,
	logoSymbolUrl,
	footerLogoUrl,
	unsubscribeUrl,
}: Params): { subject: string; html: string } {
	const copy = getCopy(locale);
	const ctaUrl = `${appUrl}/${locale}/app/properties/${propertyId}/4581a08a-3e78-4800-b16c-575f5da81cba/4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7`;

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
    .property-name { background-color: #F9FAFB; border-left: 4px solid #0E9F6E; padding: 12px 16px; border-radius: 4px; margin-bottom: 16px; }
    .property-name p { color: #1F2A37; font-weight: bold; font-size: 15px; margin: 0; }
    .tip { background-color: #ECFDF5; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .tip p { color: #065F46; font-size: 14px; margin: 0; }
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

      <!-- Nombre de la propiedad -->
      <div class="property-name">
        <p>📍 ${propertyName}</p>
      </div>

      <p>${copy.body1}</p>
      <p>${copy.body2}</p>

      <!-- Tip visual -->
      <div class="tip">
        <p>💡 Destacado → lugares que recomiendas especialmente.<br/>
        ⭐ Visita obligatoria → lugares que no se pueden perder.</p>
      </div>

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
