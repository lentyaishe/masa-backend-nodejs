import { RouteConfig } from "../../common/route-config.common";
import express, { Application, Request, Response } from "express";
import UserController from "./user.controller";
import Middleware from "../../middleware/auth.2.middleware"
import { Role } from "../../enums";

export class UserRoutes extends RouteConfig {

    constructor(
        app: Application
    ) {
        super(app, "user", "UserRoutes");
    }

    public configureRoutes(): Application {
        this._app.route(`/${this._baseRoute}/:id`).get([Middleware.verifyToken([Role.Administrator]), UserController.getById]);
        this._app.route(`/${this._baseRoute}/`).post([Middleware.verifyToken([Role.Administrator]), UserController.add]);

        return this._app;
    }
}