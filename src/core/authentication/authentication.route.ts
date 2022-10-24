import { RouteConfig } from "../../framework/route.config";
import express, { Application, Request, Response } from "express";
import AuthenticationController from "./authentication.controller";

export class AuthenticationRoutes extends RouteConfig {

    constructor(app: Application) {
        super(app, "AuthenticationRoutes");
    }

    public configureRoutes() {
        this.app.route(`/login`).post([AuthenticationController.login]);
        return this.app;
    }
}