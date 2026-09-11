import { withSupabase } from "npm:@supabase/server@^1";
import { sendWeeklyDigest } from "../_shared/send-email.ts";

type DenoEnv = {
    env: { get(key: string): string | undefined };
    serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};
declare const Deno: DenoEnv;

type SeasonalTip = {
    id: string;
    type: "fixed" | "dynamic";
    month?: number;
    week?: number;
    anchor?: string;
    offset_days?: number;
    title: { es: string; en: string; fr: string; pt: string; it: string };
    emoji: string;
    text: { es: string; en: string; fr: string; pt: string; it: string };
};

const SUPPORTED_LOCALES = ["es", "en", "fr", "pt", "it"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function isSupportedLocale(value: unknown): value is Locale {
    return SUPPORTED_LOCALES.includes(value as Locale);
}

// ─── Tips inline (copia de src/lib/seasonal-tips.json) ───
const SEASONAL_TIPS: SeasonalTip[] = [
    {
        id: "jan_1",
        type: "fixed",
        month: 1,
        week: 1,
        emoji: "🎊",
        title: {
            es: "Año Nuevo",
            en: "New Year",
            fr: "Nouvel An",
            pt: "Ano Novo",
            it: "Capodanno",
        },
        text: {
            es: "Los viajeros de enero llegan con ganas de descansar y empezar el año con calma. Asegúrate de que tu guía tiene planes tranquilos, rutas de naturaleza y restaurantes acogedores.",
            en: "January travelers arrive wanting to rest and start the year calmly. Make sure your guide has relaxing plans, nature routes and cozy restaurants.",
            fr: "Les voyageurs de janvier arrivent avec envie de se reposer. Assurez-vous que votre guide propose des activités calmes, des itinéraires nature et des restaurants chaleureux.",
            pt: "Os viajantes de janeiro chegam com vontade de descansar e começar o ano com calma. Certifique-se de que o seu guia tem planos tranquilos, rotas de natureza e restaurantes acolhedores.",
            it: "I viaggiatori di gennaio arrivano con voglia di riposare e iniziare l'anno con calma. Assicurati che la tua guida abbia piani tranquilli, percorsi nella natura e ristoranti accoglienti.",
        },
    },
    {
        id: "jan_2",
        type: "fixed",
        month: 1,
        week: 2,
        emoji: "🧘",
        title: {
            es: "Temporada baja",
            en: "Low season",
            fr: "Basse saison",
            pt: "Temporada baixa",
            it: "Bassa stagione",
        },
        text: {
            es: "La temporada baja es perfecta para viajeros que buscan tranquilidad. Añade a tu guía opciones de bienestar, spas y actividades de interior.",
            en: "Low season is perfect for travelers seeking peace. Add wellness options, spas and indoor activities to your guide.",
            fr: "La basse saison est idéale pour les voyageurs en quête de tranquillité. Ajoutez des options bien-être, spas et activités en intérieur.",
            pt: "A temporada baixa é perfeita para viajantes que procuram tranquilidade. Adicione ao seu guia opções de bem-estar, spas e atividades de interior.",
            it: "La bassa stagione è perfetta per i viaggiatori che cercano tranquillità. Aggiungi alla tua guida opzioni di benessere, spa e attività al chiuso.",
        },
    },
    {
        id: "feb_1",
        type: "fixed",
        month: 2,
        week: 1,
        emoji: "💑",
        title: {
            es: "San Valentín",
            en: "Valentine's Day",
            fr: "Saint-Valentin",
            pt: "Dia dos Namorados",
            it: "San Valentino",
        },
        text: {
            es: "San Valentín trae escapadas en pareja. Revisa que tu guía tiene restaurantes románticos, planes especiales y lugares con encanto para dos.",
            en: "Valentine's Day brings couple getaways. Check your guide has romantic restaurants, special plans and charming places for two.",
            fr: "La Saint-Valentin amène des escapades en couple. Vérifiez que votre guide propose des restaurants romantiques et des lieux charmants pour deux.",
            pt: "O Dia dos Namorados traz escapadinhas a dois. Verifique se o seu guia tem restaurantes românticos, planos especiais e locais com encanto para dois.",
            it: "San Valentino porta fughe romantiche in coppia. Verifica che la tua guida abbia ristoranti romantici, piani speciali e luoghi incantevoli per due.",
        },
    },
    {
        id: "feb_2",
        type: "fixed",
        month: 2,
        week: 2,
        emoji: "⛷️",
        title: {
            es: "Deportes de invierno",
            en: "Winter sports",
            fr: "Sports d'hiver",
            pt: "Desportos de inverno",
            it: "Sport invernali",
        },
        text: {
            es: "El invierno activo atrae a viajeros que buscan nieve y deporte. Si tu zona tiene opciones de montaña o actividades al aire libre en invierno, añádelas a tu guía.",
            en: "Active winter attracts travelers looking for snow and sport. If your area has mountain options or winter outdoor activities, add them to your guide.",
            fr: "L'hiver actif attire les voyageurs en quête de neige et de sport. Si votre région propose des activités de montagne, ajoutez-les à votre guide.",
            pt: "O inverno ativo atrai viajantes que procuram neve e desporto. Se a sua zona tiver opções de montanha ou atividades ao ar livre no inverno, adicione-as ao seu guia.",
            it: "L'inverno attivo attira viaggiatori in cerca di neve e sport. Se la tua zona offre opzioni in montagna o attività all'aperto in inverno, aggiungile alla tua guida.",
        },
    },
    {
        id: "mar_1",
        type: "fixed",
        month: 3,
        week: 1,
        emoji: "🌱",
        title: {
            es: "Llega la primavera",
            en: "Spring arrives",
            fr: "Le printemps arrive",
            pt: "Chega a primavera",
            it: "Arriva la primavera",
        },
        text: {
            es: "La primavera reactiva el turismo familiar y de naturaleza. Actualiza tu guía con parques, jardines, rutas al aire libre y actividades para todos.",
            en: "Spring reactivates family and nature tourism. Update your guide with parks, gardens, outdoor routes and activities for everyone.",
            fr: "Le printemps relance le tourisme familial et nature. Mettez à jour votre guide avec parcs, jardins, itinéraires en plein air et activités pour tous.",
            pt: "A primavera reativa o turismo familiar e de natureza. Atualize o seu guia com parques, jardins, rotas ao ar livre e atividades para todos.",
            it: "La primavera rilancia il turismo familiare e naturalistico. Aggiorna la tua guida con parchi, giardini, percorsi all'aperto e attività per tutti.",
        },
    },
    {
        id: "easter",
        type: "dynamic",
        anchor: "easter",
        offset_days: -14,
        emoji: "🌸",
        title: {
            es: "Semana Santa y Pascua",
            en: "Easter",
            fr: "Pâques",
            pt: "Semana Santa e Páscoa",
            it: "Settimana Santa e Pasqua",
        },
        text: {
            es: "Semana Santa es una de las épocas con mayor demanda. Asegúrate de que tu guía tiene restaurantes, actividades culturales y planes actualizados para que tus inquilinos vivan una experiencia memorable.",
            en: "Easter is one of the highest demand periods. Make sure your guide has restaurants, cultural activities and updated plans so your guests have a memorable experience.",
            fr: "Pâques est l'une des périodes de plus forte demande. Assurez-vous que votre guide propose des restaurants, activités culturelles et plans à jour.",
            pt: "A Semana Santa é uma das épocas com maior procura. Certifique-se de que o seu guia tem restaurantes, atividades culturais e planos atualizados para que os seus inquilinos vivam uma experiência memorável.",
            it: "La Settimana Santa è uno dei periodi di maggiore richiesta. Assicurati che la tua guida abbia ristoranti, attività culturali e piani aggiornati affinché i tuoi ospiti vivano un'esperienza memorabile.",
        },
    },
    {
        id: "apr_2",
        type: "fixed",
        month: 4,
        week: 2,
        emoji: "🥾",
        title: {
            es: "Primavera plena",
            en: "Full spring",
            fr: "Plein printemps",
            pt: "Primavera plena",
            it: "Piena primavera",
        },
        text: {
            es: "Abril es ideal para rutas de senderismo y turismo de naturaleza. Revisa que tu guía tiene senderos, miradores y espacios naturales cercanos.",
            en: "April is ideal for hiking and nature tourism. Check your guide has trails, viewpoints and nearby natural spaces.",
            fr: "Avril est idéal pour la randonnée et le tourisme nature. Vérifiez que votre guide propose des sentiers, belvédères et espaces naturels.",
            pt: "Abril é ideal para rotas de caminhada e turismo de natureza. Verifique se o seu guia tem trilhos, miradouros e espaços naturais próximos.",
            it: "Aprile è ideale per percorsi escursionistici e turismo naturalistico. Verifica che la tua guida abbia sentieri, punti panoramici e spazi naturali nelle vicinanze.",
        },
    },
    {
        id: "may_1",
        type: "fixed",
        month: 5,
        week: 1,
        emoji: "🚗",
        title: {
            es: "Puentes y escapadas",
            en: "Long weekends",
            fr: "Ponts et escapades",
            pt: "Fins de semana prolongados",
            it: "Ponti e fughe brevi",
        },
        text: {
            es: "Mayo trae puentes y escapadas cortas. Los viajeros buscan planes rápidos y accesibles. Asegúrate de que tu guía tiene opciones para un fin de semana completo.",
            en: "May brings long weekends and short getaways. Travelers look for quick accessible plans. Make sure your guide has options for a full weekend.",
            fr: "Mai amène des ponts et des escapades courtes. Assurez-vous que votre guide propose des options pour un week-end complet.",
            pt: "Maio traz fins de semana prolongados e escapadinhas curtas. Os viajantes procuram planos rápidos e acessíveis. Certifique-se de que o seu guia tem opções para um fim de semana completo.",
            it: "Maggio porta ponti e fughe brevi. I viaggiatori cercano piani rapidi e accessibili. Assicurati che la tua guida abbia opzioni per un weekend completo.",
        },
    },
    {
        id: "may_2",
        type: "fixed",
        month: 5,
        week: 2,
        emoji: "☀️",
        title: {
            es: "Pre-verano",
            en: "Pre-summer",
            fr: "Pré-été",
            pt: "Pré-verão",
            it: "Pre-estate",
        },
        text: {
            es: "Los viajeros ya planifican el verano con antelación. Es buen momento para revisar y actualizar tu guía con las mejores opciones de la zona para la temporada alta.",
            en: "Travelers are already planning summer in advance. It's a good time to review and update your guide with the best local options for peak season.",
            fr: "Les voyageurs planifient déjà l'été à l'avance. C'est le bon moment pour mettre à jour votre guide avec les meilleures options locales.",
            pt: "Os viajantes já planeiam o verão com antecedência. É um bom momento para revisar e atualizar o seu guia com as melhores opções da zona para a temporada alta.",
            it: "I viaggiatori pianificano già l'estate in anticipo. È un buon momento per rivedere e aggiornare la tua guida con le migliori opzioni locali per l'alta stagione.",
        },
    },
    {
        id: "jun_1",
        type: "fixed",
        month: 6,
        week: 1,
        emoji: "🏖️",
        title: {
            es: "Inicio de temporada alta",
            en: "Peak season starts",
            fr: "Début de haute saison",
            pt: "Início da temporada alta",
            it: "Inizio dell'alta stagione",
        },
        text: {
            es: "Empieza la temporada alta. Tus inquilinos buscan playas, terrazas y planes al aire libre. Revisa que tu guía tiene estas opciones bien actualizadas.",
            en: "Peak season begins. Your guests are looking for beaches, terraces and outdoor plans. Check your guide has these options well updated.",
            fr: "La haute saison commence. Vos locataires cherchent plages, terrasses et activités en plein air. Vérifiez que votre guide est bien à jour.",
            pt: "Começa a temporada alta. Os seus inquilinos procuram praias, terraços e planos ao ar livre. Verifique se o seu guia tem estas opções bem atualizadas.",
            it: "Inizia l'alta stagione. I tuoi ospiti cercano spiagge, terrazze e piani all'aperto. Verifica che la tua guida abbia queste opzioni ben aggiornate.",
        },
    },
    {
        id: "jun_2",
        type: "fixed",
        month: 6,
        week: 2,
        emoji: "✈️",
        title: {
            es: "Viajeros internacionales",
            en: "International travelers",
            fr: "Voyageurs internationaux",
            pt: "Viajantes internacionais",
            it: "Viaggiatori internazionali",
        },
        text: {
            es: "En junio llegan viajeros internacionales. Asegúrate de que tu guía está completa y clara para personas que no conocen la zona ni el idioma.",
            en: "In June international travelers arrive. Make sure your guide is complete and clear for people who don't know the area or language.",
            fr: "En juin arrivent les voyageurs internationaux. Assurez-vous que votre guide est complet et clair pour des personnes ne connaissant pas la région.",
            pt: "Em junho chegam viajantes internacionais. Certifique-se de que o seu guia está completo e claro para pessoas que não conhecem a zona nem o idioma.",
            it: "A giugno arrivano viaggiatori internazionali. Assicurati che la tua guida sia completa e chiara per persone che non conoscono la zona né la lingua.",
        },
    },
    {
        id: "jul_1",
        type: "fixed",
        month: 7,
        week: 1,
        emoji: "🌊",
        title: {
            es: "Pico de verano",
            en: "Summer peak",
            fr: "Pic d'été",
            pt: "Pico de verão",
            it: "Picco estivo",
        },
        text: {
            es: "Julio es el mes de mayor demanda. Una guía completa y bien organizada marca la diferencia entre una estancia buena y una excelente. ¿Tienes todo al día?",
            en: "July is the highest demand month. A complete well-organized guide makes the difference between a good and an excellent stay. Is everything up to date?",
            fr: "Juillet est le mois de plus forte demande. Un guide complet et bien organisé fait la différence. Tout est-il à jour?",
            pt: "Julho é o mês de maior procura. Um guia completo e bem organizado faz a diferença entre uma boa estadia e uma excelente. Tem tudo atualizado?",
            it: "Luglio è il mese di maggiore richiesta. Una guida completa e ben organizzata fa la differenza tra un soggiorno buono e uno eccellente. Hai tutto aggiornato?",
        },
    },
    {
        id: "jul_2",
        type: "fixed",
        month: 7,
        week: 2,
        emoji: "👨‍👩‍👧",
        title: {
            es: "Familias con niños",
            en: "Families with children",
            fr: "Familles avec enfants",
            pt: "Famílias com crianças",
            it: "Famiglie con bambini",
        },
        text: {
            es: "En pleno verano abundan las familias con niños. Revisa que tu guía tiene parques infantiles, actividades para niños y opciones de ocio familiar.",
            en: "In peak summer families with children are everywhere. Check your guide has playgrounds, children's activities and family leisure options.",
            fr: "En plein été, les familles avec enfants sont nombreuses. Vérifiez que votre guide propose des aires de jeux et activités familiales.",
            pt: "Em pleno verão abundam as famílias com crianças. Verifique se o seu guia tem parques infantis, atividades para crianças e opções de lazer familiar.",
            it: "In piena estate abbondano le famiglie con bambini. Verifica che la tua guida abbia parchi giochi, attività per bambini e opzioni di svago familiare.",
        },
    },
    {
        id: "aug_1",
        type: "fixed",
        month: 8,
        week: 1,
        emoji: "🔥",
        title: {
            es: "Agosto, máxima demanda",
            en: "August, maximum demand",
            fr: "Août, demande maximale",
            pt: "Agosto, procura máxima",
            it: "Agosto, massima richiesta",
        },
        text: {
            es: "Agosto es el mes más activo del año. Cuanto más completa esté tu guía, mejor experiencia tendrán tus inquilinos y mejores valoraciones recibirás.",
            en: "August is the most active month of the year. The more complete your guide, the better experience your guests will have and the better reviews you'll receive.",
            fr: "Août est le mois le plus actif de l'année. Plus votre guide est complet, meilleure sera l'expérience de vos locataires.",
            pt: "Agosto é o mês mais ativo do ano. Quanto mais completo estiver o seu guia, melhor experiência terão os seus inquilinos e melhores avaliações receberá.",
            it: "Agosto è il mese più attivo dell'anno. Più completa è la tua guida, migliore sarà l'esperienza dei tuoi ospiti e migliori saranno le recensioni che riceverai.",
        },
    },
    {
        id: "aug_2",
        type: "fixed",
        month: 8,
        week: 2,
        emoji: "🌅",
        title: {
            es: "Final de verano",
            en: "End of summer",
            fr: "Fin d'été",
            pt: "Final de verão",
            it: "Fine dell'estate",
        },
        text: {
            es: "Las últimas semanas de verano son especiales. Los viajeros quieren aprovechar al máximo. Asegúrate de que tu guía tiene planes para todos los gustos.",
            en: "The last weeks of summer are special. Travelers want to make the most of it. Make sure your guide has plans for all tastes.",
            fr: "Les dernières semaines d'été sont spéciales. Les voyageurs veulent en profiter au maximum. Assurez-vous que votre guide propose des plans variés.",
            pt: "As últimas semanas de verão são especiais. Os viajantes querem aproveitar ao máximo. Certifique-se de que o seu guia tem planos para todos os gostos.",
            it: "Le ultime settimane d'estate sono speciali. I viaggiatori vogliono sfruttarle al massimo. Assicurati che la tua guida abbia piani per tutti i gusti.",
        },
    },
    {
        id: "sep_1",
        type: "fixed",
        month: 9,
        week: 1,
        emoji: "🍂",
        title: {
            es: "Vuelta a la rutina",
            en: "Back to routine",
            fr: "Retour à la routine",
            pt: "Volta à rotina",
            it: "Ritorno alla routine",
        },
        text: {
            es: "Septiembre trae viajeros slow que buscan tranquilidad y autenticidad. Es buen momento para destacar en tu guía la gastronomía local y los planes más auténticos.",
            en: "September brings slow travelers looking for peace and authenticity. It's a good time to highlight local gastronomy and authentic plans in your guide.",
            fr: "Septembre amène des voyageurs slow en quête de tranquillité. C'est le bon moment pour mettre en avant la gastronomie locale dans votre guide.",
            pt: "Setembro traz viajantes slow que procuram tranquilidade e autenticidade. É um bom momento para destacar no seu guia a gastronomia local e os planos mais autênticos.",
            it: "Settembre porta viaggiatori slow in cerca di tranquillità e autenticità. È un buon momento per valorizzare nella tua guida la gastronomia locale e i piani più autentici.",
        },
    },
    {
        id: "sep_2",
        type: "fixed",
        month: 9,
        week: 2,
        emoji: "🍷",
        title: {
            es: "Otoño, gastronomía y cultura",
            en: "Autumn, gastronomy and culture",
            fr: "Automne, gastronomie et culture",
            pt: "Outono, gastronomia e cultura",
            it: "Autunno, gastronomia e cultura",
        },
        text: {
            es: "El otoño es la temporada perfecta para la gastronomía y la cultura. Revisa que tu guía tiene restaurantes con cocina de temporada, museos y actividades culturales.",
            en: "Autumn is the perfect season for gastronomy and culture. Check your guide has restaurants with seasonal cuisine, museums and cultural activities.",
            fr: "L'automne est la saison parfaite pour la gastronomie et la culture. Vérifiez que votre guide propose des restaurants de saison et des activités culturelles.",
            pt: "O outono é a temporada perfeita para a gastronomia e a cultura. Verifique se o seu guia tem restaurantes com cozinha de época, museus e atividades culturais.",
            it: "L'autunno è la stagione perfetta per la gastronomia e la cultura. Verifica che la tua guida abbia ristoranti con cucina di stagione, musei e attività culturali.",
        },
    },
    {
        id: "oct_1",
        type: "fixed",
        month: 10,
        week: 1,
        emoji: "🎭",
        title: {
            es: "Temporada media",
            en: "Mid season",
            fr: "Saison intermédiaire",
            pt: "Temporada média",
            it: "Media stagione",
        },
        text: {
            es: "Octubre ofrece precios atractivos y menos masificación. Los viajeros buscan experiencias auténticas. Destaca en tu guía los lugares menos conocidos pero especiales.",
            en: "October offers attractive prices and less crowding. Travelers seek authentic experiences. Highlight lesser-known but special places in your guide.",
            fr: "Octobre offre des prix attractifs et moins de foule. Mettez en avant dans votre guide les endroits moins connus mais spéciaux.",
            pt: "Outubro oferece preços atrativos e menos massificação. Os viajantes procuram experiências autênticas. Destaque no seu guia os locais menos conhecidos mas especiais.",
            it: "Ottobre offre prezzi interessanti e meno affollamento. I viaggiatori cercano esperienze autentiche. Valorizza nella tua guida i luoghi meno conosciuti ma speciali.",
        },
    },
    {
        id: "halloween",
        type: "dynamic",
        anchor: "halloween",
        offset_days: -7,
        emoji: "🎃",
        title: {
            es: "Halloween",
            en: "Halloween",
            fr: "Halloween",
            pt: "Halloween",
            it: "Halloween",
        },
        text: {
            es: "Halloween atrae viajeros que buscan experiencias diferentes. Si tu zona tiene eventos, mercados o actividades temáticas, añádelos a tu guía.",
            en: "Halloween attracts travelers looking for different experiences. If your area has themed events, markets or activities, add them to your guide.",
            fr: "Halloween attire des voyageurs en quête d'expériences différentes. Si votre région propose des événements thématiques, ajoutez-les à votre guide.",
            pt: "O Halloween atrai viajantes que procuram experiências diferentes. Se a sua zona tiver eventos, mercados ou atividades temáticas, adicione-os ao seu guia.",
            it: "Halloween attira viaggiatori in cerca di esperienze diverse. Se la tua zona offre eventi, mercatini o attività a tema, aggiungili alla tua guida.",
        },
    },
    {
        id: "nov_1",
        type: "fixed",
        month: 11,
        week: 1,
        emoji: "🕯️",
        title: {
            es: "Temporada baja tranquila",
            en: "Quiet low season",
            fr: "Basse saison calme",
            pt: "Temporada baixa tranquila",
            it: "Bassa stagione tranquilla",
        },
        text: {
            es: "Noviembre trae viajeros tranquilos que buscan escapadas sin prisas. Destaca en tu guía opciones de bienestar, cultura y gastronomía de temporada.",
            en: "November brings quiet travelers looking for unhurried getaways. Highlight wellness options, culture and seasonal gastronomy in your guide.",
            fr: "Novembre amène des voyageurs tranquilles. Mettez en avant les options bien-être, culture et gastronomie de saison dans votre guide.",
            pt: "Novembro traz viajantes tranquilos que procuram escapadinhas sem pressa. Destaque no seu guia opções de bem-estar, cultura e gastronomia de época.",
            it: "Novembre porta viaggiatori tranquilli in cerca di fughe senza fretta. Valorizza nella tua guida opzioni di benessere, cultura e gastronomia di stagione.",
        },
    },
    {
        id: "nov_2",
        type: "fixed",
        month: 11,
        week: 2,
        emoji: "🎁",
        title: {
            es: "Pre-navidad",
            en: "Pre-Christmas",
            fr: "Pré-Noël",
            pt: "Pré-Natal",
            it: "Pre-Natale",
        },
        text: {
            es: "Las escapadas pre-navideñas están en auge. Los viajeros buscan mercados navideños, compras y planes especiales. Actualiza tu guía con estas opciones.",
            en: "Pre-Christmas getaways are booming. Travelers look for Christmas markets, shopping and special plans. Update your guide with these options.",
            fr: "Les escapades pré-Noël sont en plein essor. Les voyageurs cherchent marchés de Noël et plans spéciaux. Mettez votre guide à jour.",
            pt: "As escapadinhas pré-natalícias estão em alta. Os viajantes procuram mercados de Natal, compras e planos especiais. Atualize o seu guia com estas opções.",
            it: "Le fughe pre-natalizie sono in aumento. I viaggiatori cercano mercatini di Natale, shopping e piani speciali. Aggiorna la tua guida con queste opzioni.",
        },
    },
    {
        id: "dec_1",
        type: "fixed",
        month: 12,
        week: 1,
        emoji: "🎄",
        title: {
            es: "Navidad se acerca",
            en: "Christmas is coming",
            fr: "Noël approche",
            pt: "O Natal aproxima-se",
            it: "Il Natale si avvicina",
        },
        text: {
            es: "La temporada navideña es especial para los inquilinos. Asegúrate de que tu guía tiene restaurantes para celebraciones, mercados navideños y planes en familia.",
            en: "The Christmas season is special for guests. Make sure your guide has restaurants for celebrations, Christmas markets and family plans.",
            fr: "La saison de Noël est spéciale. Assurez-vous que votre guide propose des restaurants pour célébrations, marchés de Noël et plans en famille.",
            pt: "A época natalícia é especial para os inquilinos. Certifique-se de que o seu guia tem restaurantes para celebrações, mercados de Natal e planos em família.",
            it: "Il periodo natalizio è speciale per gli ospiti. Assicurati che la tua guida abbia ristoranti per le celebrazioni, mercatini di Natale e piani in famiglia.",
        },
    },
    {
        id: "dec_2",
        type: "fixed",
        month: 12,
        week: 2,
        emoji: "🥂",
        title: {
            es: "Entre fiestas",
            en: "Between holidays",
            fr: "Entre les fêtes",
            pt: "Entre festas",
            it: "Tra le feste",
        },
        text: {
            es: "Entre Navidad y Año Nuevo los viajeros buscan planes especiales. Revisa que tu guía tiene opciones para celebrar y disfrutar de los últimos días del año.",
            en: "Between Christmas and New Year travelers look for special plans. Check your guide has options to celebrate and enjoy the last days of the year.",
            fr: "Entre Noël et le Nouvel An, les voyageurs cherchent des plans spéciaux. Vérifiez que votre guide propose des options pour fêter la fin d'année.",
            pt: "Entre o Natal e o Ano Novo os viajantes procuram planos especiais. Verifique se o seu guia tem opções para celebrar e aproveitar os últimos dias do ano.",
            it: "Tra Natale e Capodanno i viaggiatori cercano piani speciali. Verifica che la tua guida abbia opzioni per festeggiare e godersi gli ultimi giorni dell'anno.",
        },
    },
    {
        id: "dec_3",
        type: "fixed",
        month: 12,
        week: 3,
        emoji: "🎆",
        title: {
            es: "Fin de año",
            en: "New Year's Eve",
            fr: "Réveillon",
            pt: "Fim de ano",
            it: "Fine dell'anno",
        },
        text: {
            es: "El fin de año es uno de los momentos más especiales del año para los viajeros. Una guía completa con opciones de celebración marcará la diferencia.",
            en: "New Year's Eve is one of the most special moments of the year for travelers. A complete guide with celebration options will make the difference.",
            fr: "Le réveillon est l'un des moments les plus spéciaux pour les voyageurs. Un guide complet avec des options de célébration fera la différence.",
            pt: "O fim de ano é um dos momentos mais especiais do ano para os viajantes. Um guia completo com opções de celebração fará a diferença.",
            it: "Il Capodanno è uno dei momenti più speciali dell'anno per i viaggiatori. Una guida completa con opzioni di festeggiamento farà la differenza.",
        },
    },
];

function calculateEaster(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getAnchorDate(anchor: string, year: number): Date {
    if (anchor === "easter") return calculateEaster(year);
    if (anchor === "halloween") return new Date(year, 9, 31);
    return new Date(year, 0, 1);
}

function getWeek(day: number): number {
    return day <= 14 ? 1 : 2;
}

function getSeasonalTip(
    date: Date,
    locale: Locale,
): { emoji: string; title: string; text: string } | null {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const week = getWeek(date.getDate());

    const dynamicTip = SEASONAL_TIPS.filter((t) => t.type === "dynamic").find(
        (t) => {
            const anchor = getAnchorDate(t.anchor!, year);
            const activation = addDays(anchor, t.offset_days!);
            const expiration = addDays(anchor, (t.offset_days ?? 0) + 14);
            return date >= activation && date <= expiration;
        },
    );

    if (dynamicTip) {
        return {
            emoji: dynamicTip.emoji,
            title: dynamicTip.title[locale],
            text: dynamicTip.text[locale],
        };
    }

    const fixedTip = SEASONAL_TIPS.find(
        (t) => t.type === "fixed" && t.month === month && t.week === week,
    );

    if (!fixedTip) return null;

    return {
        emoji: fixedTip.emoji,
        title: fixedTip.title[locale],
        text: fixedTip.text[locale],
    };
}

Deno.serve(
    withSupabase(
        { auth: ["secret:cron", "secret"] },
        async (req: Request, ctx) => {
            try {
                if (req.method !== "POST") {
                    return new Response(
                        JSON.stringify({ error: "Method not allowed" }),
                        {
                            status: 405,
                            headers: { "Content-Type": "application/json" },
                        },
                    );
                }

                const testMode = Deno.env.get("EMAIL_TEST_MODE") === "true";
                const testWhitelist = (
                    Deno.env.get("EMAIL_TEST_WHITELIST") ?? ""
                )
                    .split(",")
                    .map((e: string) => e.trim())
                    .filter(Boolean);
                const maxEmails = parseInt(
                    Deno.env.get("MAX_EMAILS_PER_RUN") ?? "50",
                    10,
                );

                const supabase = ctx.supabaseAdmin;

                const now = new Date();
                const isMonday = now.getDay() === 1;

                const { data: users, error } = await supabase.rpc(
                    "get_users_for_weekly_digest",
                );

                if (error) {
                    console.error("Error fetching users:", error);
                    return new Response(
                        JSON.stringify({ error: error.message }),
                        {
                            status: 500,
                            headers: { "Content-Type": "application/json" },
                        },
                    );
                }

                let emailsSent = 0;
                const results: object[] = [];

                for (const user of users ?? []) {
                    if (emailsSent >= maxEmails) break;

                    // Segmentación de frecuencia
                    const isWeekly = user.frequency === "weekly";
                    const isMonthly = user.frequency === "monthly";

                    // Semanal: solo lunes
                    if (isWeekly && !isMonday) continue;

                    // Mensual: solo primer lunes del mes
                    if (isMonthly && (!isMonday || now.getDate() > 7)) continue;

                    // Test mode
                    if (testMode && !testWhitelist.includes(user.email)) {
                        results.push({
                            skipped: true,
                            reason: "not_in_whitelist",
                            email: user.email,
                        });
                        continue;
                    }

                    // Verificar si ya se envió esta semana
                    const todayStart = new Date(now);
                    todayStart.setHours(0, 0, 0, 0);

                    const { data: alreadySent, error: alreadySentError } =
                        await supabase
                            .from("email_sequence_log")
                            .select("id")
                            .eq("user_id", user.user_id)
                            .eq("type", "weekly_digest")
                            .gte("sent_at", todayStart.toISOString())
                            .maybeSingle();

                    if (alreadySentError) {
                        console.error(
                            "[weekly-digest] Error checking already_sent_this_week for",
                            user.email,
                            ":",
                            alreadySentError,
                        );
                    }

                    if (alreadySent) {
                        results.push({
                            skipped: true,
                            reason: "already_sent_this_week",
                            email: user.email,
                        });
                        continue;
                    }

                    const visitWindowStart = user.last_digest_sent_at
                        ? new Date(user.last_digest_sent_at)
                        : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

                    // Primero obtenemos las propiedades del usuario
                    const { data: userProperties } = await supabase
                        .from("properties")
                        .select("id, name")
                        .eq("user_id", user.user_id);

                    const propertyIds = (userProperties ?? []).map(
                        (p: { id: string; name: string }) => p.id,
                    );

                    // Luego las visitas de esas propiedades en la ventana calculada
                    const { data: visits } = await supabase
                        .from("property_visits")
                        .select("property_id")
                        .in("property_id", propertyIds)
                        .gte("visited_at", visitWindowStart.toISOString());

                    // Agrupar visitas por propiedad
                    const visitMap: Record<
                        string,
                        { name: string; count: number }
                    > = {};
                    for (const v of visits ?? []) {
                        if (!v.property_id) continue;
                        const prop = userProperties?.find(
                            (p: { id: string; name: string }) =>
                                p.id === v.property_id,
                        );
                        const name = prop?.name ?? "Propiedad";
                        if (!visitMap[v.property_id]) {
                            visitMap[v.property_id] = { name, count: 0 };
                        }
                        visitMap[v.property_id].count++;
                    }

                    const propertyVisits = Object.values(visitMap).map((p) => ({
                        property_name: p.name,
                        visit_count: p.count,
                    }));

                    const locale: Locale =
                        user.locale === "es" ||
                        user.locale === "en" ||
                        user.locale === "fr"
                            ? user.locale
                            : "en";
                    const tip = getSeasonalTip(now, locale);

                    const result = await sendWeeklyDigest({
                        userId: user.user_id,
                        email: user.email,
                        locale,
                        propertyVisits,
                        tip,
                    });

                    results.push({ ...result, email: user.email });
                    if (result.sent) emailsSent++;
                }

                return new Response(
                    JSON.stringify({ ok: true, emailsSent, testMode, results }),
                    {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    },
                );
            } catch (error: unknown) {
                let message = "Unknown error";
                if (error && typeof error === "object" && "message" in error) {
                    const maybeError = error as { message?: unknown };
                    message =
                        typeof maybeError.message === "string"
                            ? maybeError.message
                            : "Unknown error";
                }
                return new Response(JSON.stringify({ error: message }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
        },
    ),
);
