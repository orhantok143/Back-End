const  { createTransport } = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendMail = asyncHandler(async (data, req, res) => {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.MAIL,
      pass: process.env.PASS,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Hey  👻" <orhantok143@gmail.com>', // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.htm, // html body
  });
  console.log("Message sent: %s", info.messageId);
});

module.exports = sendMail
