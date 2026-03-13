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
		subject: '¿Puedo ayudarte con algo?',
		preheader: 'Llevo un tiempo sin verte por aquí.',
		title: '¿Todo bien?',
		body1: 'Hace una semana que te registraste en BNBexplorer y aún no has creado tu primer alojamiento. Quería asegurarme de que todo está bien y que no has tenido ningún problema.',
		body2: 'Si tienes alguna duda o necesitas ayuda para empezar, solo responde a este email. Estaré encantado de ayudarte.',
		buttonLabel: 'Crear mi primer alojamiento',
		footerUnsubscribe: 'No quiero recibir más emails',
		footerIgnore: 'Si no reconoces este email, puedes ignorarlo.',
	},
	en: {
		subject: 'Can I help you with anything?',
		preheader: "Haven't seen you around for a while.",
		title: 'Is everything ok?',
		body1: "You signed up to BNBexplorer a week ago but still haven't created your first property. I just wanted to make sure everything is fine and that you haven't had any issues.",
		body2: "If you have any questions or need help getting started, just reply to this email. I'd be happy to help.",
		buttonLabel: 'Create my first property',
		footerUnsubscribe: 'Unsubscribe from these emails',
		footerIgnore: "If you don't recognise this email, you can ignore it.",
	},
	fr: {
		subject: 'Puis-je vous aider?',
		preheader: 'Je ne vous ai pas vu depuis un moment.',
		title: 'Tout va bien?',
		body1: "Vous vous êtes inscrit sur BNBexplorer il y a une semaine mais n'avez toujours pas créé votre premier hébergement. Je voulais juste m'assurer que tout va bien.",
		body2: "Si vous avez des questions ou besoin d'aide pour commencer, répondez simplement à cet email.",
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

export function renderA2NoPropertyDay7({
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
