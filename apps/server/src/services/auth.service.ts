import { userRepository } from "../repositories/user.repository";

import type { UserPublic } from "@blueprint/shared";

export const authService = {
    async register(data: {
        email: string;
        name: string;
        password: string;
    }): Promise<UserPublic> {
        // Check if user already exists
        const existing = await userRepository.findByEmail(data.email);
        if (existing) {
            throw new Error("User with this email already exists");
        }

        // Hash password with Argon2 via Bun.password
        const hashedPassword = await Bun.password.hash(data.password, {
            algorithm: "argon2id",
            memoryCost: 19456,
            timeCost: 2,
        });

        // Create user
        const user = await userRepository.create({
            ...data,
            password: hashedPassword,
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
    },

    async login(
        email: string,
        password: string
    ): Promise<UserPublic> {
        const user = await userRepository.findByEmail(email);
        if (!user || !user.password) {
            throw new Error("Invalid email or password");
        }

        // Verify password with Argon2
        const valid = await Bun.password.verify(password, user.password);
        if (!valid) {
            throw new Error("Invalid email or password");
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
    },

    async getProfile(userId: string): Promise<UserPublic | null> {
        const user = await userRepository.findById(userId);
        if (!user) return null;

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
    },
};
