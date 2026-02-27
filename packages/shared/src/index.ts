import { z } from "zod";

// ─── Auth Schemas ────────────────────────────────────────────────
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// ─── API Response Types ──────────────────────────────────────────
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface UserPublic {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
}

// ─── Constants ───────────────────────────────────────────────────
export const APP_NAME = "Blueprint";
export const AUTH_COOKIE_NAME = "auth_token";
