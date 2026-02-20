import express from "express";
import cors from "cors";
import config from "../envs/default.js";
import compression from "compression";
import morgan from "morgan";
import apiRouter from "../../routes/api.routes.js";
export const configureExpress = () => {
  const app = express();

  // Middlewares
  app.use(morgan(config.environment === "production" ? "combined" : "dev"));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());

  // API Routes
  app.use("/api", apiRouter);

  //sample api
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Welcome to the Shadow Board API!",
      environment: config.environment,
      version: "1.0.0",
    });
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      environment: config.environment,
    });
  });

  return app;
};
