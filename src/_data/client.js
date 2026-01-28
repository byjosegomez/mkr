module.exports = {
    name: "MKR Design & Construction",
    email: "matt@mkrwa.com",
    phoneForTel: "253-470-8223",
    phoneFormatted: "(253) 470-8223",
    address: {
        lineOne: "3516 Nassas Ave NE",
        city: "Tacoma",
        state: "WA",
        zip: "98422",
        country: "US",
        mapLink: "https://share.google/0Du16TeegF39HyYgB",
    },
    socials: {
        facebook: "https://www.facebook.com/matthewkendrickrenovations",
        instagram: "https://www.instagram.com/mkrllc",
    },
    //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
    domain: "https://www.mkrwa.com",
    // Passing the isProduction variable for use in HTML templates
    isProduction: process.env.ELEVENTY_ENV === "PROD",
};
