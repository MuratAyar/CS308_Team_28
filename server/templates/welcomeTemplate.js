module.exports = function welcomeTemplate(username) {
    return {
        subject: "Welcome to TWOEIGHT!",
        html: `
            <h1 style="color: #2A2A72;">Hello, ${username}!</h1>
            <p>Thank you for registering with TWOEIGHT. We're thrilled to have you as part of our community!
            Discover exclusive products and enjoy a seamless shopping experience. Stay connected and get the best deals, only at TWOEIGHT.</p>
            <br>
            <footer style="text-align: center; margin-top: 20px;">
                <img src="https://drive.google.com/uc?export=view&id=1WqT236Hqa8Lzwc4io0EzBCPAotUzrYYb" alt="TWOEIGHT Signature" width="250" />
                <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} TWOEIGHT. All rights reserved.</p>
            </footer>
        `,
    };
};
