const sgMail = require('@sendgrid/mail');




sgMail.setApiKey(process.env.SENDGRID_APIKEY);

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'reidnaaykens@gmail.com',
        subject: "email email",
        text: `welcome ${name} to the task app`
    })
    console.log("email sent")
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'reidnaaykens@gmail.com',
        subject: "later",
        text:`you deleted your account on the taks app, ${name}`
    })
    console.log("cancellation email sent")
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}