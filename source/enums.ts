export enum Status {
    Active = 1,
    NotActive = 2
}

export enum Role {
    Administrator = 1,
    RegularUser = 2
}

export enum AppError {
    General = "General",
    ConnectionError = "ConnectionError",
    QueryError = "QueryError",
    NoData = "NoData",
    NonNumericInput = "NonNumeric",
    InputParameterNotSupplied = "NoParameter",
    DeletionConflict = "DeletionConflict"
}