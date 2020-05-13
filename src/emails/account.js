const sgMail = require('@sendgrid/mail');

const sendgridApiKey = 'SG.' + process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridApiKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'akshay983323@gmail.com',
        subject: 'Thanks for joining!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    });
};

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'akshay983323@gmail.com',
        subject: 'Account cancellation',
        text: `Goodbye ${name}!. We hope you come back soon :).`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
};