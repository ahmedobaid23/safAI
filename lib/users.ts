import { User } from "@prisma/client";
import { prisma } from "./prisma";

export async function createUser(data: User) {
    try {
        const user = await prisma.user.create({
            data
        })
        return user
    } catch (error) {
        console.error("[USER_CREATION_ERROR]: ", error)
    }
}

export async function deleteUser(id: string) {
    try {
        const user = await prisma.user.delete({
            where: {
                id
            }
        })
        return user
    } catch (error) {
        console.error("[USER_DELETION_ERROR]: ", error)
    }

}