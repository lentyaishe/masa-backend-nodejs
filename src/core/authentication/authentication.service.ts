import bcrypt from "bcryptjs";
import { Queries } from "../../constants";
import { entityWithId, jwtUserData, systemError } from "../../entities";
import { AppError, Role } from "../../enums";
import ErrorService from "../error.service";
import { SqlHelper } from "../sql.helper";

interface localUser extends entityWithId {
    password: string;
    role_id: Role;
}

interface IAuthenticationService {
    login(login: string, password: string): Promise<jwtUserData>;
}

class AuthenticationService implements IAuthenticationService {

    constructor() { }

    public async login(login: string, password: string): Promise<jwtUserData> {
        try {
            const user: localUser = await SqlHelper.executeQuerySingleResult<localUser>(Queries.GetUserByLogin, login)
            if (bcrypt.compareSync(password, user.password)) {
                const result: jwtUserData = {
                    userId: user.id,
                    roleId: user.role_id
                };
                return result;
            }
            else {
                throw (ErrorService.getError(AppError.NoData));
            }
        }
        catch (error: any) {
            throw (error as systemError);
        }
    }
}

export default new AuthenticationService();