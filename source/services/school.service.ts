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

            SqlHelper.openConnection()
                .then((connection: Connection) => {
                    SqlHelper.executeQueryArrayResult<localWhiteBoardType>(connection, Queries.WhiteBoardTypes)
                        .then((queryResult: localWhiteBoardType[]) => {
                            queryResult.forEach((whiteBoardType: localWhiteBoardType) => {
                                result.push(this.parseLocalBoardType(whiteBoardType));
                            });

                            resolve(result);
                        })
                        .catch((error: systemError) => {
                            reject(error);
                        });
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public getBoardType(id: number): Promise<whiteBoardType> {
        return new Promise<whiteBoardType>((resolve, reject) => {
            SqlHelper.openConnection()
                .then((connection: Connection) => {
                    SqlHelper.executeQuerySingleResult<localWhiteBoardType>(connection, `${Queries.WhiteBoardTypeById} ${id}`)
                        .then((queryResult: localWhiteBoardType) => {
                            resolve(this.parseLocalBoardType(queryResult));
                        })
                        .catch((error: systemError) => {
                            reject(error);
                        });
                })
                .catch((error: systemError) => {
                    reject(error);
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