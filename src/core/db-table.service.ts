import { map, filter } from "underscore";
import { columnDefinition, tableDefinition } from "../db-entities";
import { systemError } from "../entities";
import { ColumnType, ColumnUpdateType } from "../enums";
import { DateHelper } from "../framework/date.helper";
import { SqlHelper } from "./sql.helper";

interface IDbTable<T> {
    instanceGenericType: T;

    getById<T>(id: number): Promise<T>;
    updateById<T>(id: number, original: T, userId: number): Promise<void>;
}

export class DbTable<T> implements IDbTable<T> {

    private _table: tableDefinition;
    private _instanceGenericType: T;

    constructor(
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

        const result: T = await SqlHelper.executeQuerySingleResult<T>(sql, id)

        // [0] = {first_name = "Demo", id = 2} => {firstName = "Demo", id = 2}
        this._table.fields.forEach((column: columnDefinition) => {
            (result as any)[column.name] = column.type === ColumnType.Date ? (DateHelper.dateToString((result as any)[column.dbName])) : (result as any)[column.dbName];
            if (column.name !== column.dbName) {
                delete (result as any)[column.dbName];
            }
        });

        return result;
    }

    public async updateById<T>(id: number, original: T, userId: number): Promise<void> {
        const updatableFields: columnDefinition[] = filter(this._table.fields, (column: columnDefinition) => column.updateType === ColumnUpdateType.Always);
        const currentDateFields: columnDefinition[] = filter(this._table.fields, (column: columnDefinition) => column.updateType === ColumnUpdateType.CurrentDate);
        const currentUserFields: columnDefinition[] = filter(this._table.fields, (column: columnDefinition) => column.updateType === ColumnUpdateType.CurrentUser);
        
        const currentDateFieldsClause: string = map(currentDateFields, (column: columnDefinition) => `${column.dbName} = ?`).join(", ");
        const currentUserFieldsClause: string = map(currentUserFields, (column: columnDefinition) => `${column.dbName} = ?`).join(", ");
        const sql: string = `UPDATE ${this._table.name} SET ${map(updatableFields, (column: columnDefinition) => `${column.dbName} = ?`).join(", ")} ${currentDateFieldsClause ? ", " + currentDateFieldsClause : ""} ${currentUserFieldsClause ? ", " + currentUserFieldsClause : ""} WHERE id = ?`;

        const params: any[] = [];
        updatableFields.forEach((column: columnDefinition) => {
            params.push((original as any)[column.name]);
        });

        currentDateFields.forEach(() => {
            params.push(new Date());
        });

        currentUserFields.forEach(() => {
            params.push(userId);
        });

        params.push(id);

        try {
            await SqlHelper.executeQueryNoResult(sql, false, ...params);
        }
        catch (error: any) {
            throw (error as systemError);
        }
    }
}