import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AUTH_COOKIE_NAME } from "@blueprint/shared";

/**
 * Reusable auth middleware plugin — derives an `auth` context on protected routes.
 *
 * How to use:
 *   const protectedController = new Elysia()
 *     .use(authMiddleware)
 *     .get("/profile", ({ auth }) => {
 *       return { userId: auth.sub, email: auth.email };
 *     });
 *
 * The middleware throws a 401 before reaching the handler if the token
 * is missing or invalid, so handlers can safely assume `auth` is present.
 *
 * Note: If you need to compose this with another controller that already
 * uses @elysiajs/jwt, use `authMiddleware` at the top of that plugin's
 * chain (before defining protected routes).
 */
export const authMiddleware = new Elysia({ name: "auth-middleware" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "dev-secret-change-in-production",
        })
    )
    .derive({ as: "scoped" }, async ({ cookie, jwt, set }) => {
        const token = cookie[AUTH_COOKIE_NAME].value as string | undefined;

        if (!token) {
            set.status = 401;
            throw new Error("Not authenticated");
        }

        const payload = await jwt.verify(token);

        if (!payload || !payload.sub) {
            set.status = 401;
            throw new Error("Invalid or expired token");
        }

        return {
            auth: {
                sub: payload.sub as string,
                email: (payload.email ?? "") as string,
            },
        };
    });
