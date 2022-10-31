import { ColumnType, ColumnUpdateType } from "./enums";

export interface tableDefinition {
    name: string;
    fields: columnDefinition[];
}

export interface columnDefinition {
    dbName: string;
    name: string;
    type: ColumnType;
    isQueriable: boolean;
    updateType: ColumnUpdateType;
    isForOutput: boolean;
}

