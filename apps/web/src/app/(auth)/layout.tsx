import type { ReactNode } from "react";

/**
 * Shared layout for auth pages (login, register, etc.)
 * Centered card layout — no sidebar/nav.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
            {children}
        </div>
    );
}
