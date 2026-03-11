module.exports = {
    name: "Northwest Pavers & Patio",
    email: "NPP@info.com",
    phoneForTel: "206-960-6263",
    phoneFormatted: "(206) 960-6263",
    address: {
        lineOne: "3516 Nassas Ave NE",
        city: "Pierce County",
        state: "WA",
        zip: "",
        country: "US",
        mapLink: "",
    },
    socials: {
        facebook: "https://www.facebook.com/",
        instagram: "https://www.instagram.com/",
    },
    //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
    domain: "https://northwestpaversandpatio.com",
    // Passing the isProduction variable for use in HTML templates
    isProduction: process.env.ELEVENTY_ENV === "PROD",
};
