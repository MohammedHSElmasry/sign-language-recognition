import nodemailer from "nodemailer";

const sendemail = async ({from = process.env.EMAIL, to, subject,html,text, attachments = []} = {}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "01140775155ss@gmail.com",
      pass: "bial jsqz cfsy qhko", // لا تحتوي كلمة السر على مسافات
    },
  });

  const info = await transporter.sendMail({
    from: `"MOHAMMED" <${from}>`, // تحتاج إلى تعبئة حقول الإيميل الخاص بالمرسل والمستلم وعنوان الرسالة ونصها ومحتوى HTML
    to,
    subject,
    html,
    text,
    attachments,
  });

};

export default sendemail;
