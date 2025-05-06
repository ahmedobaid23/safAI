import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Check if an article is favorited
export async function GET(request: Request, { params }: { params: { blogId: string } }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ isFavorite: false })
        }

        const { blogId } = params

        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_blogId: {
                    userId,
                    blogId,
                },
            },
        })

        return NextResponse.json({
            isFavorite: !!favorite,
            favoriteId: favorite?.id || null,
        })
    } catch (error) {
        console.error("Error checking favorite status:", error)
        return NextResponse.json({ isFavorite: false })
    }
}

// Remove a favorite by blogId
export async function DELETE(request: Request, { params }: { params: { blogId: string } }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { blogId } = params

        // Delete the favorite
        await prisma.favorite.deleteMany({
            where: {
                userId,
                blogId,
            },
        })

        return NextResponse.json({ message: "Favorite removed successfully" })
    } catch (error) {
        console.error("Error removing favorite:", error)
        return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
    }
}
