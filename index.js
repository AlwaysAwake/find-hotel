const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");

const checkAvailable = async () => {
  const targetUrl = "http://www.booking.com/Share-LGK5MB";
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(targetUrl);

  const isUnavailable = await page.$("#no_availability_msg");

  await browser.close();

  return !isUnavailable;
};

const sendMail = cb => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "니 아이디",
      pass: "니 비번"
    }
  });

  const mailOptions = {
    from: "니 메일",
    to: "니 메일",
    subject: "호텔 풀렸다~~",
    text: `호텔 생겼다 ㄲ ${targetUrl}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }

    cb && cb();
  });
};

const start = () => {
  const checkInterval = 10000;

  setInterval(async () => {
    const isAvailable = await checkAvailable();

    if (isAvailable) {
      sendMail(() => process.exit(1));
    } else {
      console.log("빈 객실 없음!");
    }
  }, checkInterval);
};

start();
