import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authController } from "./controllers/auth.controller";

const app = new Elysia()
    .use(
        cors({
            origin: process.env.WEB_URL || "http://localhost:3000",
            credentials: true,
        })
    )
    // ─── Health Check ────────────────────────────────────────────
    .get("/", () => ({
        name: "Blueprint API",
        version: "0.0.1",
        status: "ok",
    }))
    // ─── Routes ──────────────────────────────────────────────────
    .use(authController)
    .listen(process.env.PORT || 3001);

console.log(
    `🦊 Elysia server is running at http://${app.server?.hostname}:${app.server?.port}`
);

// Export type for Eden Treaty
export type App = typeof app;
