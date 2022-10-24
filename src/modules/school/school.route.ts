import { RouteConfig } from "../../framework/route.config";
import express, { Application, Request, Response } from "express";
import SchoolController from "./school.controller";

export class SchoolRoutes extends RouteConfig {

    constructor(app: Application) {
        super(app, "SchoolRoutes");
    }

    public configureRoutes() {
        this.app.route(`/general/board-types`).get([SchoolController.getBoardTypes]);
        this.app.route(`/general/board-type/:id`).get([SchoolController.getBoardTypeById]);
        return this.app;
    }
}