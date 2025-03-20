import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "",
  CLIENT_URL:process.env.CLIENT_URL,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "default_secret",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "default_secret",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || "",
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET || "",

  MAIL_PASS: process.env.MAIL_PASS ,
  MAIL_USER: process.env.MAIL_USER ,
  MAIL_HOST: process.env.MAIL_HOST ,
};

export default config;
