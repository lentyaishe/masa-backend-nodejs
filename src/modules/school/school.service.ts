import * as _ from "underscore";
import { entityWithId, status, systemError, whiteBoardType } from "../../entities";
import { Status, TableNames } from "../../enums";
import { Queries, StoredProcedures } from "../../constants";
import { DateHelper } from "../../framework/date.helper";
import { SqlHelper } from "../../core/sql.helper";
import DbService from "../../core/db.service";

interface localWhiteBoardType {
    id: number;
    white_board_type: string;
    create_date: Date;
    update_date: Date;
    create_user_id: number;
    update_user_id: number;
    status_id: Status;
}

interface ISchoolService {


    getBoardTypes(): Promise<whiteBoardType[]>;
    getBoardTypeById(id: number): Promise<whiteBoardType>;
    updateBoardTypeById(whiteBoardType: whiteBoardType, userId: number): Promise<whiteBoardType>;
    addBoardType(whiteBoardType: whiteBoardType, userId: number): Promise<whiteBoardType>;
    addBoardTypeByStoredProcedure(whiteBoardType: whiteBoardType, userId: number): Promise<whiteBoardType>;
    addBoardTypeByStoredProcedureOutput(whiteBoardType: whiteBoardType, userId: number): Promise<whiteBoardType>;
    deleteBoardTypeById(id: number, userId: number): Promise<void>;

    getStatusById(id: number): Promise<status>;
}

class SchoolService implements ISchoolService {
    private _serviceTable: TableNames = TableNames.WhiteBoardType;

    constructor() { }

    public getBoardTypes(): Promise<whiteBoardType[]> {
        return new Promise<whiteBoardType[]>((resolve, reject) => {
            const result: whiteBoardType[] = [];

            SqlHelper.executeQueryArrayResult<localWhiteBoardType>(Queries.WhiteBoardTypes, Status.Active)
                .then((queryResult: localWhiteBoardType[]) => {
                    queryResult.forEach((whiteBoardType: localWhiteBoardType) => {
                        result.push(this.parseLocalBoardType(whiteBoardType));
                    });

                    resolve(result);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public async getBoardTypeById(id: number): Promise<whiteBoardType> {
        try {
            return await DbService.getFromTableById(this._serviceTable, id);
        }
        catch (error: any) {
            throw (error as systemError);
        }
    }

    public async updateBoardTypeById(whiteBoardType: whiteBoardType, userId: number): Promise<whiteBoardType> {
        try {
            await DbService.updateTableById(this._serviceTable, whiteBoardType.id, whiteBoardType, userId);
            return whiteBoardType;
        }
        catch (error: any) {
            throw (error as systemError);
        }
    }

    public addBoardType(whiteBoardType: whiteBoardType, userId: number): Promise<whiteBoardType> {
        return new Promise<whiteBoardType>((resolve, reject) => {
            const createDate: string = DateHelper.dateToString(new Date());
            SqlHelper.createNew(Queries.AddWhiteBoardType, whiteBoardType, whiteBoardType.type, createDate, createDate, userId, userId, Status.Active)
                .then((result: entityWithId) => {
                    resolve(result as whiteBoardType);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public addBoardTypeByStoredProcedure(whiteBoardType: whiteBoardType, userId: number): Promise<whiteBoardType> {
        return new Promise<whiteBoardType>((resolve, reject) => {
            SqlHelper.executeStoredProcedure(StoredProcedures.AddWhiteBoardType, whiteBoardType, whiteBoardType.type, userId)
                .then(() => {
                    resolve(whiteBoardType);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public addBoardTypeByStoredProcedureOutput(whiteBoardType: whiteBoardType, userId: number): Promise<whiteBoardType> {
        return new Promise<whiteBoardType>((resolve, reject) => {
            SqlHelper.executeStoredProcedureWithOutput(StoredProcedures.AddWhiteBoardTypeOutput, whiteBoardType, whiteBoardType.type, userId)
                .then(() => {
                    resolve(whiteBoardType);
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public deleteBoardTypeById(id: number, userId: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const updateDate: Date = new Date();
            SqlHelper.executeQueryNoResult(Queries.DeleteWhiteBoardTypeById, true, DateHelper.dateToString(updateDate), userId, Status.NotActive, id, Status.Active)
                .then(() => {
                    resolve();
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public getBoardTypeByTitle(title: string): Promise<whiteBoardType[]> {
        return new Promise<whiteBoardType[]>((resolve, reject) => {
            SqlHelper.executeQueryArrayResult<localWhiteBoardType>(Queries.WhiteBoardTypeByTitle, `%${title}%`)
                .then((queryResult: localWhiteBoardType[]) => {
                    resolve(_.map(queryResult, (result: localWhiteBoardType) => this.parseLocalBoardType(result)));
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public async getStatusById(id: number): Promise<status> {
        return await DbService.getFromTableById(TableNames.Status, id);
    }

    private parseLocalBoardType(local: localWhiteBoardType): whiteBoardType {
        return {
            id: local.id,
            type: local.white_board_type
        };
    }
}

export default new SchoolService();