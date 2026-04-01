export default () => ({
    email: {
        senderEmail: process.env.SENDER_EMAIL,
        senderEmailPass: process.env.SENDER_EMAIL_PASS,
        senderEmailService: process.env.SENDER_EMAIL_SERVICE
    }
})