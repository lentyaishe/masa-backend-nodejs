import express, { Application } from "express";

export abstract class RouteConfig {
    app: Application;
    name: string;
    protected baseUrl: string;

    constructor(
        app: Application,
        name: string,
        baseUrl: string
    ) {
        this.app = app;
        this.name = name;
        this.baseUrl = baseUrl;
        this.configureRoutes();
    }

    public getName() {
        return this.name;
    }

    abstract configureRoutes(): Application;
}