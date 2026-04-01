import AppConfig from "./app.config.interface";
import AuthConfig from "./auth.config.interface";
import DatabaseConfig from "./database.config.interface";
import EmailConfig from "./email.config.interface";

export default interface Configuration {
    app: AppConfig,
    database: DatabaseConfig,
    auth: AuthConfig,
    email: EmailConfig
}