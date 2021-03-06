export default {
  apiURL: process.env.API_URL || "http://localhost:3000",
  database: {
    host: process.env.DB_HOST || "127.0.0.1",
    password: process.env.DB_PASSWORD || "root",
    poolSize: process.env.DB_POOL_SIZE || "20",
    port: process.env.DB_PORT || "3306",
    schema: process.env.DB_SCHEMAS || "exchange",
    timezone: process.env.DB_TIMEZONE || "UTC",
    user: process.env.DB_USER || "root",
    url: process.env.DB_URL || "mysql://root:root@127.0.0.1:3306/exchange",
    dialect: process.env.DB_DIALECT || "mysql",
  },
  fastifyConfig: {
    logger: process.env.ENABLE_LOGGING || "true",
  },
  host: process.env.HOST || "0.0.0.0",
  logLevel: process.env.LOG_LEVEL || "info",
  port: process.env.PORT || "3000",
  passwordSalt: parseInt(process.env.PASSWORD_SALT, 10) || 10,
  tokenSecret: process.env.TOKEN_SECRET || "JWT-TOKEN-SECRET",
  mailgunKey: process.env.MAILGUN_KEY || "mail-gun-key",
  mailgunDomain: process.env.MAILGUN_DOMAIN || "mail-gun-domain",
  emailSender: process.env.SENDER_EMAIL || "Atryto team <info@ghtechnology.ca>",
};
