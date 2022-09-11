import { Connection, SqlClient, Error } from "msnodesqlv8";
import { DB_CONNECTION_STRING, ErrorCodes, ErrorMessages, SqlParameters } from "../constants";
import { systemError } from "../entities";
import { ErrorHelper } from "./error.helper";

export class SqlHelper {
    static sql: SqlClient = require("msnodesqlv8");

    // FIXME: SQL injection for LIKE query
    public static executeQueryArrayResult<T>(query: string): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {

            SqlHelper.openConnection()
                .then((connection: Connection) => {
                    connection.query(query, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.createError(ErrorCodes.QueryError, ErrorMessages.SqlQueryError));
                        }
                        else {
                            if (queryResult !== undefined) {
                                resolve(queryResult);
                            }
                            else {
                                resolve([]);
                            }
                        }
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public static executeQuerySingleResult<T>(query: string, ...params: (string | number)[]): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            SqlHelper.openConnection()
                .then((connection: Connection) => {
                    connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.createError(ErrorCodes.QueryError, ErrorMessages.SqlQueryError));
                        }
                        else {
                            const notFoundError: systemError = ErrorHelper.createError(ErrorCodes.NoData, ErrorMessages.NoDataFound);
                    
                            if (queryResult !== undefined) {
                                switch (queryResult.length) {
                                    case 0:
                                        reject(notFoundError);
                                        break;
                            
                                    case 1:
                                        resolve(queryResult[0]);
                                        break;
                            
                                    default: // In case more than a single result is returned
                                        resolve(queryResult[0]);
                                        break;
                                }
                            }
                            else {
                                reject(notFoundError);
                            }
                        }
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        });
    }

    public static executeQueryNoResult(query: string, ...params: (string | number)[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.openConnection()
                .then((connection: Connection) => {
                    connection.query(query, params, (queryError: Error | undefined, rows: any[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.createError(ErrorCodes.QueryError, ErrorMessages.SqlQueryError));
                        }
                        else {
                            resolve();
                        }
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        });
    }

    private static openConnection(): Promise<Connection> {
        return new Promise<Connection>((resolve, reject) => {
            SqlHelper.sql.open(DB_CONNECTION_STRING, (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(ErrorHelper.createError(ErrorCodes.ConnectionError, ErrorMessages.DbConnectionError));
                }
                else {
                    resolve(connection);
                }
            });
        });
    }
}