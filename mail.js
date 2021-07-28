module.exports = (to, subject, text) => {
    const nodemailer = require("nodemailer");

    const smtpTransport = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: parseInt(process.env.SMTP_PORT),
        secure : false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            ciphers:'SSLv3'
        }
    });

    const message = {
        from: process.env.SMTP_USERNAME,
        to, subject, text
    };

    smtpTransport.sendMail(message, (err, info) => {
        if (err)
            console.error(err);
        else
            console.log(info);

        smtpTransport.close();
    });
}