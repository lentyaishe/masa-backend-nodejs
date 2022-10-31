import * as _ from "underscore";
import { columnDefinition, tableDefinition } from "../db-entities";
import { user } from "../entities";
import { ColumnType, ColumnUpdateType, TableNames } from "../enums";
import { DbTable } from "./db-table.service";
import { ErrorService } from "./error.service";

interface localTable<T> {
    table: tableDefinition;
    instance: DbTable<T>;
}

interface IDbService {
    getFromTableById(tableName: TableNames, id: number): Promise<any>;
}

export class DbService implements IDbService {

    private _tables: _.Dictionary<any> = {};

    constructor(
        private errorService: ErrorService
    ) {
        this._tables[TableNames.User] = this.addTableToContext<user>(TableNames.User, [{
            dbName: "id",
            name: "id",
            type: ColumnType.Integer,
            isForOutput: true,
            isQueriable: true,
            updateType: ColumnUpdateType.None
        }, {
            dbName: "first_name",
            name: "firstName",
            type: ColumnType.Varchar,
            isForOutput: true,
            isQueriable: true,
            updateType: ColumnUpdateType.Always
            }]);
    }

    public get tables(): _.Dictionary<tableDefinition> {
        return this._tables;
    }

    public async getFromTableById(tableName: TableNames, id: number): Promise<any> {
        const dbTableObject: localTable<any> = this._tables[tableName] as localTable<any>;

        return await dbTableObject.instance.getById(id);
    }

    private addTableToContext<T>(tableName: TableNames, fields: columnDefinition[]): localTable<T> {
        let tableDefinition: tableDefinition = {
            name: tableName,
            fields: fields
        };

        let tableInstance: DbTable<T> = new DbTable(this.errorService, tableDefinition);

        let table: localTable<T> = {
            table: tableDefinition,
            instance: tableInstance
        };

        return table;
    }
}