import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { authService } from "../services/auth.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { AUTH_COOKIE_NAME } from "@blueprint/shared";

export const authController = new Elysia({ prefix: "/auth" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "dev-secret-change-in-production",
            exp: "7d",
        })
    )
    // ─── Register ──────────────────────────────────────────────
    .post(
        "/register",
        async ({ body, cookie, jwt, set }) => {
            try {
                const user = await authService.register(body);

                const token = await jwt.sign({
                    sub: user.id,
                    email: user.email,
                });

                cookie[AUTH_COOKIE_NAME].set({
                    value: token,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: "/",
                });

                return { success: true, data: user };
            } catch (error) {
                set.status = 400;
                return {
                    success: false,
                    message: error instanceof Error ? error.message : "Registration failed",
                };
            }
        },
        {
            body: t.Object({
                email: t.String({ format: "email" }),
                name: t.String({ minLength: 2 }),
                password: t.String({ minLength: 8 }),
            }),
        }
    )

    // ─── Login ─────────────────────────────────────────────────
    .post(
        "/login",
        async ({ body, cookie, jwt, set }) => {
            try {
                const user = await authService.login(body.email, body.password);

                const token = await jwt.sign({
                    sub: user.id,
                    email: user.email,
                });

                cookie[AUTH_COOKIE_NAME].set({
                    value: token,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: "/",
                });

                return { success: true, data: user };
            } catch (error) {
                set.status = 401;
                return {
                    success: false,
                    message:
                        error instanceof Error ? error.message : "Invalid credentials",
                };
            }
        },
        {
            body: t.Object({
                email: t.String({ format: "email" }),
                password: t.String({ minLength: 8 }),
            }),
        }
    )

    // ─── Logout ────────────────────────────────────────────────
    .post("/logout", ({ cookie }) => {
        cookie[AUTH_COOKIE_NAME].remove();
        return { success: true, message: "Logged out successfully" };
    })

    // ─── Get Current User (protected via authMiddleware) ───────
    .use(authMiddleware)
    .get("/me", async ({ auth, set }) => {
        const user = await authService.getProfile(auth.sub);
        if (!user) {
            set.status = 404;
            return { success: false, message: "User not found" };
        }
        return { success: true, data: user };
    });
