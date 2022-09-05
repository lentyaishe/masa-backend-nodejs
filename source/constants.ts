export class ErrorCodes {
    public static ConnectionError: number = 100;
    public static QueryError: number = 101;
}

export class ErrorMessages {
    public static DbConnectionError: string = "DB server connection error";
    public static SqlQueryError: string = "Incorrect query";
}

export class Queries {
    public static WhiteBoardTypes: string = "SELECT * FROM white_board_type";
}

export const DB_CONNECTION_STRING: string = "server=.;Database=masa_school;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";