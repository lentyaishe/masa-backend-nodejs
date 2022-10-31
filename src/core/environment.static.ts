import { environment } from "../entities";
import * as dotenv from 'dotenv';
dotenv.config();

export class StaticEnvironment {
    public static environment: environment;

    public static dbConnectionString: string = process.env.DB_CONNECTION_STRING as string;
    public static tokenSecret: string = process.env.TOKEN_SECRET as string;
    public static logsFolder: string = process.env.DEFAULT_LOG_FOLDER as string;
    public static serverPort: number = parseInt(process.env.SERVER_PORT as string);
}