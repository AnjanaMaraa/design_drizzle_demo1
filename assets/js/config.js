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

    /* Prefilled enquiry messages, one per service context. */
    messages: {
        start: "Hi DigiMaraa Design Studio, I would like to start a design project. Please share the details.",
        wedding: "Hi DigiMaraa Design Studio, I would like to enquire about wedding invitation design.",
        digital: "Hi DigiMaraa Design Studio, I would like to enquire about digital invitation design.",
        logo: "Hi DigiMaraa Design Studio, I would like to enquire about logo design.",
        social: "Hi DigiMaraa Design Studio, I would like to enquire about social media design.",
        event: "Hi DigiMaraa Design Studio, I would like to enquire about event invitation design.",
        savethedate: "Hi DigiMaraa Design Studio, I would like to enquire about save-the-date designs.",
        branding: "Hi DigiMaraa Design Studio, I would like to enquire about branding and business creatives.",
        custom: "Hi DigiMaraa Design Studio, I would like to discuss a custom design project."
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
