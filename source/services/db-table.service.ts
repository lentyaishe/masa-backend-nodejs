import { map, filter } from "underscore";
import { columnDefinition, tableDefinition } from "../db-entities";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";

interface IDbTable<T> {
    instanceGenericType: T;

    getById<T>(id: number): Promise<T>;
}

export class DbTable<T> implements IDbTable<T> {

    private _table: tableDefinition;
    private _instanceGenericType: T;

    constructor(
        private errorService: ErrorService,
        table: tableDefinition
    ) {
        this._table = table;

        this._instanceGenericType = {} as T;
    }

    public get instanceGenericType(): T {
        return this._instanceGenericType;
    }

    public async getById<T>(id: number): Promise<T> {
        let queriedFields: string = map(filter(this._table.fields, (column: columnDefinition) => column.isForOutput), (column: columnDefinition) => column.dbName).join(", ");
        let sql: string = `SELECT ${queriedFields} FROM ${this._table.name} WHERE id = ?`;

        const result: T = await SqlHelper.executeQuerySingleResult<T>(this.errorService, sql, id)

        // [0] = {first_name = "Demo", id = 2} => {firstName = "Demo", id = 2}
        this._table.fields.forEach((column: columnDefinition) => {
            if (column.name !== column.dbName) {
                (result as any)[column.name] = (result as any)[column.dbName];
                delete (result as any)[column.dbName];
            }
        });

        return result;
    }
}