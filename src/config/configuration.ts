import appConfig from "./app.config";
import authConfig from "./auth.config";
import databaseConfig from "./database.config";
import emailConfig from "./email.config";

export default () => ({
    ...appConfig(),
    ...databaseConfig(),
    ...authConfig(),
    ...emailConfig()
})