import { Connection, SqlClient, Error } from "msnodesqlv8";
import { DB_CONNECTION_STRING, ErrorCodes, ErrorMessages, Queries } from "../constants";
import { whiteBoardType } from "../entities";
import { ErrorHelper } from "../helpers/error.helper";

interface localWhiteBoardType {
    id: number;
    white_board_type: string;
}

interface ISchoolService {
    getBoardTypes(): Promise<whiteBoardType[]>;
}

export class SchoolService implements ISchoolService {

    public getBoardTypes(): Promise<whiteBoardType[]> {
        return new Promise<whiteBoardType[]>((resolve, reject) => {
            const result: whiteBoardType[] = [];
            const sql: SqlClient = require("msnodesqlv8");

            sql.open(DB_CONNECTION_STRING, (connectionError: Error, connection: Connection) => {
                if (connectionError) {
                    reject(ErrorHelper.parseError(ErrorCodes.ConnectionError, ErrorMessages.DbConnectionError));
                }
                else {
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