import { RouteConfig } from "../../common/route-config.common";
import express, { Application, Request, Response } from "express";
import AuthenticationController from "./auth.controller";

export class AuthenticationRoutes extends RouteConfig {

    constructor(
        app: Application
    ) {
        super(app, "", "AuthenticationRoutes");
    }

    public configureRoutes(): Application {
        this._app.route(`/login`).post([AuthenticationController.login]);

        return this._app;
    }
}