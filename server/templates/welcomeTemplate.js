module.exports = function welcomeTemplate(username) {
    return {
        subject: "Welcome to Our Service!",
        html: `
            <h1>Hello, ${username}!</h1>
            <p>Thank you for registering with us. We're excited to have you on board!</p>
            <p>Enjoy your experience!</p>
        `,
    };
};
