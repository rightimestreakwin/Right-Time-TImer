const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host:process.env.MAIL_HOST,
      port:process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    })
    let info = await transporter.sendMail({
      from: `BNG.LIVE | GAMING bng.live Gaming Project ${process.env.MAIL_USER}`, 
      to: `${email}`, 
      subject: `${title}`, 
      html: `${body}`, 
    })
    return info
  } catch (error) {
    console.log(error.message)
    return error.message
  }
}

module.exports = mailSender