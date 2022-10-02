import bcrypt from "bcryptjs";
import { Queries } from "../constants";
import { entityWithId, jwtUserData, systemError } from "../entities";
import { AppError, Role } from "../enums";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";

interface localUser extends entityWithId {
    password: string;
    role_id: Role;
}

interface IAuthenticationService {
    login(login: string, password: string): Promise<jwtUserData>;
}

export class AuthenticationService implements IAuthenticationService {

    constructor(
        private errorService: ErrorService
    ) { }

    public async login(login: string, password: string): Promise<jwtUserData> {
        try {
            const user: localUser = await SqlHelper.executeQuerySingleResult<localUser>(this.errorService, Queries.GetUserByLogin, login)
            if (bcrypt.compareSync(password, user.password)) {
                const result: jwtUserData = {
                    userId: user.id,
                    roleId: user.role_id
                };
                return result;
            }
            else {
                throw (this.errorService.getError(AppError.NoData));
            }
        }
        catch (error: any) {
            throw (error as systemError);
        }
    }
}