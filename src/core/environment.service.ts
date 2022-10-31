import { environment } from "../entities";

interface IEnvironmentService {
    environment: environment;
}

class EnvironmentService implements IEnvironmentService {
    private _environment: environment = {} as any;

    constructor() { 
        console.log("EnvironmentService constructor");
    }

    public get environment() {
        return this._environment;
    }
    
    public initialize(): void {
        this._environment = {
            dbConnectionString: process.env.DB_CONNECTION_STRING as string,
            tokenSecret: process.env.TOKEN_SECRET as string,
            logsFolder: process.env.DEFAULT_LOG_FOLDER as string,
            serverPort: parseInt(process.env.SERVER_PORT as string)
        };

        console.log(process.env.ILYAS_COOL_VARIABLE as string);
    }
}

export default new EnvironmentService();