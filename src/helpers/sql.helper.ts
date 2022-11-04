import { Connection, SqlClient, Error, Query, ProcedureManager } from "msnodesqlv8";
import { Queries } from "../constants";
import { entityWithId, systemError } from "../entities";
import { AppError } from "../enums";
import { ErrorService } from "../services/error.service";

export class SqlHelper {
    static sql: SqlClient = require("msnodesqlv8");

    // FIXME: SQL injection for LIKE query
    public static executeQueryArrayResult<T>(errorService: ErrorService, query: string, ...params: (string | number)[]): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {

            SqlHelper.openConnection(errorService)
                .then((connection: Connection) => {
                    connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                        if (queryError) {
                            reject(errorService.getError(AppError.QueryError));
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

    public static executeQuerySingleResult<T>(errorService: ErrorService, query: string, ...params: (string | number)[]): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            try {
                const connection: Connection = await SqlHelper.openConnection(errorService);

                connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                    if (queryError) {
                        reject(errorService.getError(AppError.QueryError));
                    }
                    else {
                        const notFoundError: systemError = errorService.getError(AppError.NoData);
                    
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
            }
            catch (error: any) {
                reject(error as systemError)
            }
        });
    }

    public static executeQueryNoResult(errorService: ErrorService, query: string, ignoreNoRowsAffected: boolean, ...params: (string | number)[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection: Connection) => {
                    const q: Query = connection.query(query, params, (queryError: Error | undefined) => {
                        if (queryError) {
                            switch (queryError.code) {
                                case 547:
                                    reject(errorService.getError(AppError.DeletionConflict));
                                    break;
                                default:
                                    reject(errorService.getError(AppError.QueryError));
                                    break;
                            }
                        }
                    });

                    q.on('rowcount', (rowCount: number) => {
                        // If not ignoring rows affected AND ALSO rows affected equals zero then
                        if (!ignoreNoRowsAffected && rowCount === 0) {
                            reject(errorService.getError(AppError.NoData));
                            return;
                        }
                        
                        resolve();
                    });

                    // WITHOUT return after reject()
                    // q.on('rowcount', (rowCount: number) => {
                    //     // If not ignoring rows affected AND ALSO rows affected equals zero then
                    //     if (!ignoreNoRowsAffected && rowCount === 0) {
                    //         reject(errorService.getError(AppError.NoData));
                    //         // since the body of the callback is finished here no need in return
                    //     }
                    //     else {
                    //         resolve();
                    //     }
                    // });
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public static createNew(errorService: ErrorService, query: string, original: entityWithId, ...params: (string | number)[]): Promise<entityWithId> {
        return new Promise<entityWithId>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection: Connection) => {
                    const queries: string[] = [query, Queries.SelectIdentity];
                    const combinedQuery: string = queries.join(";");
                    let executionCounter: number = 0;
                    connection.query(combinedQuery, params, (queryError: Error | undefined, queryResult: entityWithId[] | undefined) => {
                        if (queryError) {
                            reject(errorService.getError(AppError.QueryError));
                        }
                        else {
                            executionCounter++; // executionCounter = executionCounter + 1;

                            if (executionCounter === queries.length) {
                                SqlHelper.treatInsertResult(errorService, original, queryResult, resolve, reject);
                            }
                        }
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        });
    }

    public static executeStoredProcedure(errorService: ErrorService, procedureName: string, original: entityWithId, ...params: (string | number)[]): Promise<entityWithId> {
        return new Promise<entityWithId>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection) => {
                    const pm: ProcedureManager = connection.procedureMgr();
                    pm.callproc(procedureName, params, (storedProcedureError: Error | undefined, results: entityWithId[] | undefined, output: any[] | undefined) => {
                        if (storedProcedureError) {
                            reject(errorService.getError(AppError.QueryError));
                        }
                        else {
                            const id: number | null = SqlHelper.treatInsertResult2(results);
                            if (id !== null) {
                                original.id = id;
                                resolve(original);
                            }
                            else {
                                reject(errorService.getError(AppError.QueryError));
                            }
                        }
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public static executeStoredProcedureWithOutput(errorService: ErrorService, procedureName: string, original: entityWithId, ...params: (string | number)[]): Promise<entityWithId> {
        return new Promise<entityWithId>((resolve, reject) => {
            SqlHelper.openConnection(errorService)
                .then((connection) => {
                    const pm: ProcedureManager = connection.procedureMgr();
                    params.push(original.id);
                    pm.callproc(procedureName, params, (storedProcedureError: Error | undefined, results: any[] | undefined, output: number[] | undefined) => {
                        if (storedProcedureError) {
                            reject(errorService.getError(AppError.QueryError));
                        }
                        else {
                            if (output?.length === 2) {
                                original.id = output[1];
                                resolve(original);
                            }
                            else {
                                reject(errorService.getError(AppError.QueryError));
                            }
                        }
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    private static openConnection(errorService: ErrorService): Promise<Connection> {
        return new Promise<Connection>((resolve, reject) => {
            SqlHelper.sql.open(DB_CONNECTION_STRING, (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(errorService.getError(AppError.ConnectionError));
                }
                else {
                    resolve(connection)
                }
            });
        });
    }

    private static treatInsertResult(errorService: ErrorService, original: entityWithId, queryResult: entityWithId[] | undefined, resolve: (result: entityWithId) => void, reject: (error: systemError) => void): void {
        const badQueryError: systemError = errorService.getError(AppError.QueryError);

        if (queryResult !== undefined) {
            if (queryResult.length === 1) {
                original.id = queryResult[0].id;
                resolve(original);
            }
            else {
                reject(badQueryError);
            }
        }
        else {
            reject(badQueryError);
        }
    }

    private static treatInsertResult2(queryResult: entityWithId[] | undefined): number | null {
        if (queryResult !== undefined) {
            if (queryResult.length === 1) {
                return queryResult[0].id;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
}