import { Connection, SqlClient, Error } from "msnodesqlv8";
import { DB_CONNECTION_STRING, ErrorCodes, ErrorMessages } from "../constants";
import { ErrorHelper } from "./error.helper";

export class SqlHelper {
    static sql: SqlClient = require("msnodesqlv8");

    public static OpenConnection(): Promise<Connection> {
        return new Promise<Connection>((resolve, reject) => {
            SqlHelper.sql.open(DB_CONNECTION_STRING, (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(ErrorHelper.parseError(ErrorCodes.ConnectionError, ErrorMessages.DbConnectionError));
                }
                else {
                    resolve(connection);
                }
            });
        });
    }
}