import { NextResponse } from "next/server"

// Types for the News API response
interface Source {
    id: string | null
    name: string
}

interface Article {
    source: Source
    author: string | null
    title: string
    description: string | null
    url: string
    urlToImage: string | null
    publishedAt: string
    content: string | null
}

interface NewsApiResponse {
    status: string
    totalResults: number
    articles: Article[]
    code?: string
    message?: string
}

export async function GET() {
    try {
        // Get API key from environment variables
        const apiKey = process.env.NEWS_API_KEY

        if (!apiKey) {
            return NextResponse.json(
                { error: "News API key is not configured" },
                { status: 500 }
            )
        }

        const params = new URLSearchParams()

        // Required parameter
        params.append("apiKey", apiKey)
        params.append("q", "Landfill")
        params.append("pageSize", "10")
        params.append("sortBy", "publishedAt")
        params.append("language", "en")

        const response = await fetch(
            `https://newsapi.org/v2/everything?${params.toString()}`,
            {
                headers: {
                    "X-Api-Key": apiKey,
                },
                next: { revalidate: 3600 }, // Cache for 1 hour
            }
        )

        const data: NewsApiResponse = await response.json()

        // Check if the API returned an error
        if (data.status === "error") {
            return NextResponse.json(
                { error: data.message || "Error fetching news" },
                { status: 400 }
            )
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.error("Error fetching news:", error)
        return NextResponse.json(
            { error: "Failed to fetch news articles" },
            { status: 500 }
        )
    }
}

