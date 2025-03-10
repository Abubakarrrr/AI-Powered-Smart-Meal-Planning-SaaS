import nodemailer from "nodemailer";
import { emailTemplate,generateUserCreationEmail,PasswordResetTemplate } from "./emailTemplate";
import { ApiError } from "./apiError";
import config from "@config/config";

// send verification email
const emailSender = async (email: string, title: string, body: string) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.MAIL_HOST,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS,
      },
    });

    // Mail options
    let mailOptions = {
      from: "EatWise || Abubakar",
      to: email,
      subject: title,
      html: body,
    };

    // Send mail and wait for the Promise to resolve
    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};


export async function sendVerificationEmail(email: string, otp: string) {
  try {
    const mailResponse = await emailSender(
      email,
      "Verification Email from EatWise",
      emailTemplate(otp)
    );
    console.log("Email sent successfully", mailResponse.response);
  } catch (error) {
    console.log("error occured while sending mails", error);
    throw new ApiError(400, "error");
  }
}

//reset password email
export async function sendPasswordResetEmail(email: string, resetURL: string) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.MAIL_HOST,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS,
      },
    });
    let mailOptions = {
      from: "EatWise || Abubakar",
      to: email,
      subject: "Reset your password",
      html: PasswordResetTemplate(resetURL),
    };
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Email sent successfully", info.response);
  } catch (error) {
    console.error(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
}

// user created by admin email
export async function userCreationEmail(name:string,email: string, password: string,role:string) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.MAIL_HOST,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS,
      },
    });
    let mailOptions = {
      from: "EatWise || Abubakar",
      to: email,
      subject: "Login to our website",
      html: generateUserCreationEmail(name,email,password,role),
    };
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Email sent successfully", info.response);
  } catch (error) {
    console.error(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
}
