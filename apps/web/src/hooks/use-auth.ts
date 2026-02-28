"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { LoginInput, RegisterInput } from "@blueprint/shared";

// ─── Query Keys ──────────────────────────────────────────────────────────────
export const authKeys = {
    me: ["auth", "me"] as const,
};

// ─── useMe ───────────────────────────────────────────────────────────────────
/**
 * Fetches the current authenticated user.
 * Returns `null` when unauthenticated without throwing.
 */
export function useMe() {
    return useQuery({
        queryKey: authKeys.me,
        queryFn: async () => {
            const { data, error } = await api.auth.me.get();
            if (error || !data?.success) return null;
            return data.data ?? null;
        },
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// ─── useLogin ────────────────────────────────────────────────────────────────
export function useLogin() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (input: LoginInput) => {
            const { data, error } = await api.auth.login.post(input);
            if (error || !data?.success) {
                throw new Error(
                    (data as { message?: string })?.message ?? "Login failed"
                );
            }
            return data.data;
        },
        onSuccess: (user) => {
            queryClient.setQueryData(authKeys.me, user);
            router.push("/dashboard");
        },
    });
}

// ─── useRegister ─────────────────────────────────────────────────────────────
export function useRegister() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (input: RegisterInput) => {
            const { data, error } = await api.auth.register.post(input);
            if (error || !data?.success) {
                throw new Error(
                    (data as { message?: string })?.message ?? "Registration failed"
                );
            }
            return data.data;
        },
        onSuccess: (user) => {
            queryClient.setQueryData(authKeys.me, user);
            router.push("/dashboard");
        },
    });
}

// ─── useLogout ───────────────────────────────────────────────────────────────
export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            await api.auth.logout.post();
        },
        onSuccess: () => {
            queryClient.setQueryData(authKeys.me, null);
            queryClient.clear();
            router.push("/login");
        },
    });
}
