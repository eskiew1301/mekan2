const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, 
  auth: {
    user: process.env.SMTP_MAIL, 
    pass: process.env.SMTP_PASSWORD, 
  },
  tls: {
    rejectUnauthorized: false, 
  },
});


transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to take messages:", success);
  }
});

const sendEmail = async (req, res, next) => {
  const { fullName, email, phone, message } = req.body;

  
  let mailOptions = {
    from: email, 
    to: process.env.SMTP_MAIL, 
    subject: `New Contact Form Submission from ${fullName}`,
    text: `You have received a new message from your contact form.\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email received successfully!");
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send the message. Please try again." });
  }
};

module.exports = { sendEmail };
