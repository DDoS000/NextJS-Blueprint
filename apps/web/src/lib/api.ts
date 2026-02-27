import { treaty } from "@elysiajs/eden";
import type { App } from "../../../server/src/index";

/**
 * Eden Treaty client — provides end-to-end type-safe API calls.
 * All API calls in the frontend should use this client via TanStack Query hooks.
 *
 * Usage:
 *   const { data } = api.auth.me.get()
 *   const { data } = api.auth.login.post({ email, password })
 */
export const api = treaty<App>(
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    {
        fetch: {
            credentials: "include", // Send cookies with every request
        },
    }
);
