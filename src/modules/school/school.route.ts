import { RouteConfig } from "../../framework/route.config";
import express, { Application, Request, Response } from "express";
import SchoolController from "./school.controller";
import AuthMiddleware from "../../core/middleware/auth.middleware";
import { Role } from "../../enums";

export class SchoolRoutes extends RouteConfig {

    constructor(app: Application) {
        super(app, "SchoolRoutes", "general");
    }

    public configureRoutes() {
        this.app.route(`/${this.baseUrl}/board-types`).get([AuthMiddleware.verifyToken([Role.RegularUser]), SchoolController.getBoardTypes]);
        this.app.route(`/${this.baseUrl}/board-type/:id`).get([AuthMiddleware.verifyToken([Role.RegularUser]), SchoolController.getBoardTypeById]);
        this.app.route(`/${this.baseUrl}/board-type-by-title/:title`).get([AuthMiddleware.verifyToken([Role.RegularUser]), SchoolController.getBoardTypeByTitle]);
        this.app.route(`/${this.baseUrl}/board-type/:id`).put([AuthMiddleware.verifyToken([Role.RegularUser]), SchoolController.updateBoardTypeById]);
        // this.app.route('/board-type', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.addBoardType);
        // this.app.route('/board-type-sp', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.addBoardTypeByStoredProcedure);
        // this.app.route('/board-type-sp-output', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.addBoardTypeByStoredProcedureOutput);
        // this.app.route(`/${this.baseUrl}/:id`)).delete([AuthMiddleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.deleteBoardTypeById]);
        // router.delete('/board-type/:id', middleware.verifyToken([Role.Administrator, Role.RegularUser]), controller.deleteBoardTypeById);

        return this.app;
    }
}