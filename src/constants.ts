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

    public static GetRoomById: string = `SELECT r.id, r.room_number, r.room_floor, r.is_has_projector,
                                            cu.id as create_user_id, cu.first_name as create_user_first_name, cu.last_name as create_user_last_name,
                                            uu.id as update_user_id, uu.first_name as update_user_first_name, uu.last_name as update_user_last_name,
                                            wbt.id as white_board_type_id, wbt.white_board_type
                                        FROM[dbo].[room] r
                                        INNER JOIN[dbo].[user] cu ON r.create_user_id = cu.id
                                        INNER JOIN[dbo].[user] uu ON r.update_user_id = uu.id
                                        INNER JOIN[dbo].[white_board_type] wbt ON r.white_board_type_id = wbt.id
                                        WHERE r.id = ?
                                        AND r.status_id = ?`;
    public static UpdateRoomById: string = `UPDATE [dbo].[room] 
                                            SET room_number = ?, room_floor = ?, is_has_projector = ?, white_board_type_id = ?, update_user_id = ?, update_date = ?
                                            WHERE id = ? AND status_id = ?`;
    public static AddRoom: string = `INSERT [dbo].[room] (room_number, room_floor, is_has_projector, white_board_type_id, create_user_id, update_user_id, create_date, update_date, status_id)
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

    public static GetTeacherById: string = `SELECT t.id, t.first_name, t.last_name, t.is_male, t.birthdate, 
                                                p.id as profession_id, p.title as profession, tp.graduation_year
                                            FROM teacher t
                                            INNER JOIN teacher_to_profession tp ON t.id = tp.teacher_id
                                            INNER JOIN profession p ON tp.profession_id = p.id
                                            WHERE t.id = ?
                                            ORDER BY tp.sort_order`;
    public static UpdateTeacherById: string = `UPDATE teacher 
                                               SET first_name = ?, last_name = ?, is_male = ?, birthdate = ?
                                               WHERE id = ?`;    
    public static EraseTeacherProfessionByTeacherId: string = `DELETE teacher_to_profession 
                                                                WHERE teacher_id = ?`;  
    public static AddProfessionToTeacher: string = `INSERT teacher_to_profession (teacher_id, profession_id, graduation_year, sort_order)
                                                    VALUES (?, ?, ?, ?)`;
}

export class StoredProcedures {
    public static AddWhiteBoardType: string = "sp_create_board_type";
    public static AddWhiteBoardTypeOutput: string = "sp_create_board_type_output";
}

export const NON_EXISTENT_ID: number = -1;