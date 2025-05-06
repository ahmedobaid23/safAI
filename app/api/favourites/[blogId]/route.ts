import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "../../../../lib/prisma"
import type { NextRequest } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { blogId: string } }) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { blogId } = params

        await prisma.favorite.delete({
            where: {
                userId_blogId: {
                    userId,
                    blogId,
                },
            },
        });

        return NextResponse.json({ message: "Favorite removed successfully" }, { status: 200 })
    } catch (error) {
        console.error("Error removing favorite:", error)
        return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 })
    }
}
