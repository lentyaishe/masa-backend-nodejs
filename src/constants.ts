import authenticationController from "./core/authentication/authentication.controller";

export class SqlParameters {
    public static Id: string = "id";
}

export class Queries {
    public static WhiteBoardTypes: string = "SELECT * FROM white_board_type WHERE status_id = ?";
    public static SelectIdentity: string = "SELECT SCOPE_IDENTITY() AS id;";

    // SELECT * FROM white_board_type WHERE id =  50
    public static WhiteBoardTypeById: string = `SELECT * FROM white_board_type WHERE id = ? AND status_id = ?`;
    public static WhiteBoardTypeByTitle: string = "SELECT * FROM white_board_type WHERE white_board_type LIKE ?";
    public static UpdateWhiteBoardTypeById: string = "UPDATE white_board_type SET white_board_type = ?, update_date = ?, update_user_id = ? WHERE id = ? AND status_id = ?";
    public static AddWhiteBoardType: string = "INSERT white_board_type (white_board_type, create_date, update_date, create_user_id, update_user_id, status_id) VALUES (?, ?, ?, ?, ?, ?)";
    public static DeleteWhiteBoardTypeById: string = "UPDATE white_board_type SET update_date = ?, update_user_id = ?, status_id = ? WHERE id = ? AND status_id = ?";
    
    public static GetUserByLogin: string = "SELECT id, password, role_id FROM [user] WHERE login = ?";

    public static UpdateUserById: string = "UPDATE [user] SET first_name = ?, last_name = ?, update_date = ?, update_user_id = ? WHERE id = ? AND status_id = ?";
    public static AddUser: string = "INSERT [user] (first_name, last_name, login, password, role_id, create_date, update_date, create_user_id, update_user_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    public static DeleteUserById: string = "UPDATE [user] SET update_date = ?, update_user_id = ?, status_id = ? WHERE id = ? AND status_id = ?";
}

export class StoredProcedures {
    public static AddWhiteBoardType: string = "sp_create_board_type";
    public static AddWhiteBoardTypeOutput: string = "sp_create_board_type_output";
}

export const NON_EXISTENT_ID: number = -1;