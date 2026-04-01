import { Environment } from "./environment.enum";

export default interface AppConfig {
    env: Environment,
    port: number
}