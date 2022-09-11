export class ErrorCodes {
    public static ConnectionError: number = 100;
    public static QueryError: number = 101;
    public static NoData: number = 102;
    public static NonNumericInput: number = 103;
    public static InputParameterNotSupplied: number = 104;
}

export class ErrorMessages {
    public static DbConnectionError: string = "DB server connection error";
    public static SqlQueryError: string = "Incorrect query";
    public static NoDataFound: string = "Not found";
    public static NonNumericInput: string = "Non numeric input supplied";
    public static InputParameterNotSupplied: string = "Input parameter not supplied";
}

export class Queries {
    public static WhiteBoardTypes: string = "SELECT * FROM white_board_type";

    // SELECT * FROM white_board_type WHERE id =  50
    public static WhiteBoardTypeById: string = "SELECT * FROM white_board_type WHERE id = ";
    public static WhiteBoardTypeByTitle: string = "SELECT * FROM white_board_type WHERE white_board_type LIKE ";
}

export const DB_CONNECTION_STRING: string = "server=.;Database=masa_school;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";