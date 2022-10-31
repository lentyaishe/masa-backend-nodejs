import * as _ from "underscore";
import { systemError, user } from "../../entities";
import DbService from "../../core/db.service";
import { TableNames } from "../../enums";

interface IUserService {
    getById(userId: number): Promise<user>;
    updateById(user: user, userId: number): Promise<user>;
    // add(user: user, userId: number): Promise<user>;
    // deleteById(id: number, userId: number): Promise<void>;
}

class UserService implements IUserService {
    private _serviceTable: TableNames = TableNames.User;

    constructor() { }

    public async getById(userId: number): Promise<user> {
        try {
            return await DbService.getFromTableById(this._serviceTable, userId);
        }
        catch (error: any) {
            throw (error as systemError);
        }
    }

    public async updateById(user: user, userId: number): Promise<user> {
        try {
            await DbService.updateTableById(this._serviceTable, user.id, user, userId);
            return user;
        }
        catch (error: any) {
            throw (error as systemError);
        }
    }

    // public add(user: user, userId: number): Promise<user> {
    //     return new Promise<user>((resolve, reject) => {
    //         const createDate: string = DateHelper.dateToString(new Date());
    //         SqlHelper.createNew(this.errorService, Queries.AddUser, user, user.firstName, user.lastName, user.login as string, user.password as string, Role.RegularUser, createDate, createDate, userId, userId, Status.Active)
    //             .then((result: entityWithId) => {
    //                 resolve(result as user);
    //             })
    //             .catch((error: systemError) => {
    //                 reject(error);
    //             });
    //     });
    // }

    // public deleteById(id: number, userId: number): Promise<void> {
    //     return new Promise<void>((resolve, reject) => {
    //         const updateDate: Date = new Date();
    //         SqlHelper.executeQueryNoResult(this.errorService, Queries.DeleteUserById, true, DateHelper.dateToString(updateDate), userId, Status.NotActive, id, Status.Active)
    //             .then(() => {
    //                 resolve();
    //             })
    //             .catch((error: systemError) => {
    //                 reject(error);
    //             });
    //     });
    // }
}

export default new UserService();