import { prisma } from "@blueprint/db";

import type { User } from "@blueprint/db";

export const userRepository = {
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    },

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    },

    async create(data: {
        email: string;
        name: string;
        password: string;
    }): Promise<User> {
        return prisma.user.create({
            data: {
                ...data,
                accounts: {
                    create: {
                        provider: "credentials",
                        providerAccountId: data.email,
                    },
                },
            },
        });
    },
};
