import express, { Application } from "express";

export abstract class RouteConfig {
    protected _app: Application;
    protected _baseRoute: string;
    private _name: string;

    constructor(
        app: Application,
        baseRoute: string,
        name: string
    ) {
        this._app = app;
        this._baseRoute = baseRoute;
        this._name = name;
        this.configureRoutes();
    }

    public getName() {
        return this._name;
    }

    abstract configureRoutes(): Application;
}