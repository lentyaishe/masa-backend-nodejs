import { RouteConfig } from "../../framework/route.config";
import express, { Application, Request, Response } from "express";
import UserController from "./user.controller";
import AuthMiddleware from "../../core/middleware/auth.middleware";
import { Role } from "../../enums";

export class UserRoutes extends RouteConfig {

    constructor(app: Application) {
        super(app, "UserRoutes", "user");
    }

    public configureRoutes() {
        this.app.route(`/${this.baseUrl}/:id`).get([AuthMiddleware.verifyToken([Role.Administrator]), UserController.getUserById]);
        this.app.route(`/${this.baseUrl}/:id`).put([AuthMiddleware.verifyToken([Role.Administrator]), UserController.updateById]);

        return this.app;
    }
}