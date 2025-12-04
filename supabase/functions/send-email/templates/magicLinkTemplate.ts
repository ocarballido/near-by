export type Locale = string;

export type MagicLinkCopy = {
	subject: string;
	preheader: string;
	title: string;
	intro: string;
	text1: string;
	text2: string;
	buttonLabel: string;
	footerText: string;
};

export const MAGIC_LINK_MESSAGES: Record<string, MagicLinkCopy> = {
	en: {
		subject: 'Your login link',
		preheader: 'Click the button to access your account.',
		title: 'Welcome to BNB Explorer,',
		intro: "You've just taken the first step towards becoming a 5-star Host!",
		text1: 'Discover how to create your own online guide for your accommodation with the help of AI, including services, useful tips, nearby recommendations and all the information you need.',
		text2: 'Design your own accommodation website for FREE in just a few seconds and share the link with your guests every time they book. Your ratings will keep growing!',
		buttonLabel: 'Sign in',
		footerText: 'If you did not request this email, ignore it.',
	},
	es: {
		subject: 'Tu enlace de acceso',
		preheader: 'Haz clic en el botón para acceder a tu cuenta.',
		title: 'Bienvenid@ a BNB Explorer,',
		intro: '¡Acabas de dar el primer paso para convertirte en un Anfitrión 5 estrellas!',
		text1: 'Descubre cómo crear una guía online propia para tus alojamientos con ayuda de la IA, incluyendo los servicios, consejos útiles, recomendaciones cercanas y toda la información que necesites.',
		text2: 'Diseña tú mismo la web de tu alojamiento GRATIS y en sólo unos segundos y comparte el enlace con tus huéspedes cada vez que reserven. ¡Tus valoraciones no pararán de crecer!',
		buttonLabel: 'Acceder',
		footerText: 'Si no has solicitado este correo, puedes ignorarlo.',
	},
};

function getMagicLinkCopy(locale: Locale): MagicLinkCopy {
	const normalized = (locale || 'en').split('-')[0];
	return MAGIC_LINK_MESSAGES[normalized] ?? MAGIC_LINK_MESSAGES.en;
}

type RenderMagicLinkParams = {
	locale: string;
	magicLink: string;
	productName: string;
	heroUrl: string;
	logoSymbolUrl: string;
	videoImageUrl: string;
	footerLogoUrl: string;
	appUrl: string; // p.ej. https://bnbexplorer.com
};

export function renderMagicLinkEmail({
	locale,
	magicLink,
	productName,
	heroUrl,
	logoSymbolUrl,
	videoImageUrl,
	footerLogoUrl,
	appUrl,
}: RenderMagicLinkParams): { subject: string; html: string } {
	const copy = getMagicLinkCopy(locale);

	const subject = copy.subject;

	const html = `<!DOCTYPE html>
<html lang="${locale}" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${copy.subject}</title>
    <style>
      /* -------------------------------------
        GLOBAL RESETS
      ------------------------------------- */
      .img {
        border: none;
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        margin: 0 auto;
        display: block;
      }

      body {
        background-color: #F3F4F6;
        font-family: sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        line-height: 1.4;
        margin: 0;
        padding: 0;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%; 
      }

      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%;
      }
      table td {
        font-family: sans-serif;
        font-size: 14px;
        vertical-align: top;
      }

      .body {
        background-color: #f6f6f6;
        color: #1F2A37;
        text-align: center;
        width: 100%;
      }

      .container {
        display: block;
        margin: 0 auto !important;
        max-width: 700px;
        width: 700px;
      }

      .content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 600px;
        padding: 8px;
      }

      .main {
        width: 100%;
      }

      .wrapper {
        box-sizing: border-box;
        padding: 16px;
      }

      .appbar {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
        padding: 16px;
      }

      .content-block {
        padding-bottom: 10px;
        padding-top: 10px;
      }

      .footer {
        clear: both;
        margin-top: 10px;
        text-align: center;
        width: 100%;
      }
      .footer td,
      .footer p,
      .footer span,
      .footer a {
        color: #999999;
        font-size: 12px;
        text-align: center;
      }

      h1,
      h2,
      h3,
      h4 {
        color: #000000;
        font-family: sans-serif;
        font-weight: 400;
        line-height: 1.4;
        margin: 0;
        margin-bottom: 30px;
      }

      h1 {
        font-size: 35px;
        font-weight: 300;
        text-align: center;
        text-transform: capitalize;
      }

      p,
      ul,
      ol {
        font-family: sans-serif;
        font-size: 14px;
        font-weight: normal;
        margin: 0;
        margin-bottom: 15px;
      }
      p li,
      ul li,
      ol li {
        list-style-position: inside;
        margin-left: 5px;
      }

      a {
        color: #3498db;
        text-decoration: underline;
      }

      .btn {
        box-sizing: border-box;
        width: 100%;
      }
      .btn > tbody > tr > td {
        padding-bottom: 15px;
      }
      .btn table {
        width: auto;
      }
      .btn table td {
        background-color: #ffffff;
        border-radius: 5px;
        text-align: center;
      }
      .btn a {
        background-color: #ffffff;
        border: solid 1px #3498db;
        border-radius: 5px;
        box-sizing: border-box;
        color: #3498db;
        cursor: pointer;
        display: inline-block;
        font-size: 14px;
        font-weight: bold;
        margin: 0;
        padding: 12px 25px;
        text-decoration: none;
        text-transform: capitalize;
      }

      .btn-primary {
        background-color: #0E9F6E;
        border-radius: 48px;
        color: #ffffff;
        font-weight: bold;
        padding: 16px;
      }

      .btn-primary a {
        background-color: #3498db;
        border-color: #3498db;
        color: #ffffff;
      }

      .btn-span-shadow {
        text-align: center;
        display: block;
        line-height: 48px;
      }

      .preheader {
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0;
      }

      @media only screen and (max-width: 700px) {
        table.body h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important;
        }
        table.body p,
        table.body ul,
        table.body ol,
        table.body td,
        table.body span,
        table.body a {
          font-size: 16px !important;
        }
        table.body .wrapper,
        table.body .article {
          padding: 10px !important;
        }
        table.body .container {
          padding: 0 !important;
          width: 100% !important;
        }
        table.body .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important;
        }
        table.body .btn table {
          width: 100% !important;
        }
        table.body .btn a {
          width: 100% !important;
        }
        table.body .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important;
        }
      }

      @media all {
        .ExternalClass {
          width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6">
    <!-- Preheader text -->
    <span class="preheader">${copy.preheader}</span>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tbody>
        <tr>
          <td>&nbsp;</td>
          <td class="container">
            <!-- Appbar -->
            <div class="content">
              <div class="appbar">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tbody>
                    <tr>
                      <td>
                        <a target="_blank" href="${appUrl}" style="text-decoration: none; display: flex; gap: 8px; align-items: center; color: #1F2A37; font-weight: bold;">
                          <img src="${logoSymbolUrl}" style="display: inline;" alt="${productName} logo" />
                          <p style="margin: 0;">BNBexplorer</p>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- Appbar -->

            <a href="${magicLink}" style="text-decoration: none; display: block;">
              <!-- Hero -->
              <img class="img" src="${heroUrl}" alt="BNBexplorer Login-Register" />
              <!-- /Hero -->

              <!-- Button -->
              <div class="content">
                <div class="btn-span-shadow">
                  <span class="btn-primary" style="box-shadow: 0px 0px 0px 4px #F3F4F6;">${copy.buttonLabel}</span>
                </div>
              </div>
              <!-- Button -->
            </a>

            <div class="content">
              <!-- START CENTERED WHITE CONTAINER -->
              <table role="presentation" class="main">
                <!-- START MAIN CONTENT AREA -->
                <tbody>
                  <tr>
                    <td class="wrapper">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                          <tr>
                            <td>
                              <h2 style="margin-bottom: 16px;">${copy.title}</h2>
                              <p>${copy.intro}</p>
                              <p>${copy.text1}</p>
                              <p>${copy.text2}</p>
                              <a target="_blank" href="https://www.youtube.com/watch?v=yPqXtdHK8MM" style="text-decoration: none; display: block;">
                                <img class="img" src="${videoImageUrl}" alt="Play video tutorial" />
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                <!-- END MAIN CONTENT AREA -->
                </tbody>
              </table>
              <!-- END CENTERED WHITE CONTAINER -->

              <!-- START FOOTER -->
              <div class="footer">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tbody>
                    <tr>
                      <td class="content-block">
                        <a href="${appUrl}" target="_blank" style="text-decoration: none; display: block;">
                          <img class="img" src="${footerLogoUrl}" alt="${productName} logo" />
                        </a>
                        <p style="margin-top: 8px;">${copy.footerText}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- END FOOTER -->
            </div>
          </td>
          <td>&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;

	return { subject, html };
}
