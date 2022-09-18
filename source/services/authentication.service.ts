import bcrypt from "bcryptjs";
import { Queries } from "../constants";
import { entityWithId, systemError } from "../entities";
import { AppError } from "../enums";
import { SqlHelper } from "../helpers/sql.helper";
import { ErrorService } from "./error.service";

interface localUser extends entityWithId {
    password: string;
}

interface IAuthenticationService {
    login(login: string, password: string): Promise<number>;
}

export class AuthenticationService implements IAuthenticationService {

    constructor(
        private errorService: ErrorService
    ) { }

    public login(login: string, password: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            SqlHelper.executeQuerySingleResult<localUser>(this.errorService, Queries.GetUserByLogin, login)
                .then((user: localUser) => {
                    if (bcrypt.compareSync(password, user.password)) {
                        resolve(user.id);
                    }
                    else {
                        reject(this.errorService.getError(AppError.NoData));
                    }
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }
}