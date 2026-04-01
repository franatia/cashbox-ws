import Joi from "joi";

export const envValidationSchema = Joi.object({
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),
    DB_NAME: Joi.string().required(),

    APP_ENV: Joi.string()
        .valid('development', 'staging', 'production')
        .default('development'),
    APP_PORT: Joi.number().default(3000),

    AUTH_JWT_SECRET: Joi.string().required(),

    SENDER_EMAIL: Joi.string().email().required(),
    SENDER_EMAIL_PASS: Joi.string().required(),
    SENDER_EMAIL_SERVICE: Joi.string().required()
})