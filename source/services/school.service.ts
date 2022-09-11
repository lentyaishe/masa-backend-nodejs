import { Connection, SqlClient, Error } from "msnodesqlv8";
import { DB_CONNECTION_STRING, ErrorCodes, ErrorMessages, Queries } from "../constants";
import { systemError, whiteBoardType } from "../entities";
import { ErrorHelper } from "../helpers/error.helper";
import { SqlHelper } from "../helpers/sql.helper";

interface localWhiteBoardType {
    id: number;
    white_board_type: string;
}

interface ISchoolService {
    getBoardTypes(): Promise<whiteBoardType[]>;
    getBoardType(id: number): Promise<whiteBoardType>;
}

export class SchoolService implements ISchoolService {

    public getBoardTypes(): Promise<whiteBoardType[]> {
        return new Promise<whiteBoardType[]>((resolve, reject) => {
            const result: whiteBoardType[] = [];

            SqlHelper.OpenConnection()
                .then((connection: Connection) => {
                    connection.query(Queries.WhiteBoardTypes, (queryError: Error | undefined, queryResult: localWhiteBoardType[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.SqlQueryError));
                        }
                        else {
                            if (queryResult !== undefined) {
                                queryResult.forEach((whiteBoardType: localWhiteBoardType) => {
                                    result.push(
                                        this.parseLocalBoardType(whiteBoardType)
                                    );
                                });
                            }

                            resolve(result);
                        }
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public getBoardType(id: number): Promise<whiteBoardType> {
        return new Promise<whiteBoardType>((resolve, reject) => {
            let result: whiteBoardType;
            const sql: SqlClient = require("msnodesqlv8");

            sql.open(DB_CONNECTION_STRING, (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(ErrorHelper.parseError(ErrorCodes.ConnectionError, ErrorMessages.DbConnectionError));
                }
                else {
                    connection.query(`${Queries.WhiteBoardTypeById} ${id}`, (queryError: Error | undefined, queryResult: localWhiteBoardType[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.SqlQueryError));
                        }
                        else {
                            if (queryResult !== undefined && queryResult.length === 1) {
                                result = this.parseLocalBoardType(queryResult[0]);
                            }
                            else if (queryResult !== undefined && queryResult.length === 0) {
                                // TODO: Not found
                            }
                            
                            resolve(result);
                        }
                    })
                }
            });
        });
    }

    private parseLocalBoardType(local: localWhiteBoardType): whiteBoardType {
        return {
            id: local.id,
            type: local.white_board_type
        };
    }
}