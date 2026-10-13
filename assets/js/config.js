/* DigiMaraa Design Studio — central business/contact configuration.
   All contact details on the site are read from this file. */

const SITE_CONFIG = {
    brandName: "DigiMaraa Design Studio",

    phone: "+91 72002 51560",
    whatsapp: "917200251560",

    email: {
        official: "info@digimaraa.com",
        business: "maraa.care@gmail.com",
        career: "akash@digimaraa.com"
    },

    address: {
        line1: "#1, First Floor, Ambalam Street",
        line2: "Srivaikundam",
        line3: "Tuticorin - 628 601",
        line4: "Tamilnadu, India"
    },

    website: "https://digimaraa.com",

    /* Prefilled enquiry messages — one per confirmed service. */
    messages: {
        start: "Hi DigiMaraa Design Studio, I would like to start a design project. Please share the details.",
        invitations: "Hi DigiMaraa Design Studio, I'm interested in Invitations & E-Invites. I'd like to discuss my invitation requirements.",
        digital: "Hi DigiMaraa Design Studio, I'm interested in Digital Invitations. I'd like to know more about animated and video invitation designs.",
        logo: "Hi DigiMaraa Design Studio, I'm interested in Logo Design. I'd like to discuss a logo for my business.",
        social: "Hi DigiMaraa Design Studio, I'm interested in Social Media Designs. Please share more details about your design services.",
        print: "Hi DigiMaraa Design Studio, I'm interested in Print & Event Designs. I'd like to discuss my printing and event design requirements.",
        birthday: "Hi DigiMaraa Design Studio, I'm interested in Birthday & Milestone Designs. I'd like to discuss a customized design.",
        products: "Hi DigiMaraa Design Studio, I'm interested in Customized Event Products. I'd like to discuss a personalized design for my event.",
        custom: "Hi DigiMaraa Design Studio, I have a custom design idea I'd like to discuss. Could you help me with it?"
    }
};

/* Build a WhatsApp deep link for a given service key. */
function buildWhatsAppUrl(service) {
    const key = service && SITE_CONFIG.messages[service] ? service : "start";
    const text = encodeURIComponent(SITE_CONFIG.messages[key]);
    return "https://wa.me/" + SITE_CONFIG.whatsapp + "?text=" + text;
}

/* Reusable: open a WhatsApp enquiry in a new tab. */
function openWhatsApp(service) {
    window.open(buildWhatsAppUrl(service), "_blank", "noopener,noreferrer");
}
