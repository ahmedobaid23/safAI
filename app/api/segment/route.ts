import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server"
import fs from "node:fs/promises"
import path from "node:path";
import axios from "axios";
// import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()
        const formData = await request.formData()
        const image = formData.get("image") as File;

        const arrayBuffer = await image.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        let filePath;
        if (userId) {
            const userDir = `./public/${userId}`;
            await fs.mkdir(userDir, { recursive: true });
            filePath = path.join(userDir, image.name);
        } else {
            filePath = path.join("./public", image.name);
        }

        await fs.writeFile(filePath, buffer);

        const mlFormData = new FormData();
        mlFormData.append("file", new Blob([buffer]), image.name); // Use Blob to mimic the file

        const MLModelResponse = await axios.post(
            "http://localhost:8000/predict/",
            mlFormData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        // Write the file

        // if (!imageId) {
        //     return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
        // }

        // // Get image from database
        // const image = await prisma.image.findUnique({
        //     where: { id: imageId },
        // })

        // if (!image) {
        //     return NextResponse.json({ error: "Image not found" }, { status: 404 })
        // }

        // // Call your HuggingFace model API here
        // // This is a placeholder for the actual API call
        // const MLModelResponse = await fetch("https://localhost:8000/predict", {
        //     method: "POST",
        //     body: JSON.stringify({ url: filePath }),
        // })

        // if (!huggingFaceResponse.ok) {
        //     throw new Error("Failed to process image with ML model")
        // }

        // // Get the segmented image from HuggingFace
        // // This is a placeholder - adjust based on your model's response format
        // const segmentationResult = await huggingFaceResponse.blob()

        // // Convert blob to base64
        // const arrayBuffer = await segmentationResult.arrayBuffer()
        // const buffer = Buffer.from(arrayBuffer)
        // const base64Image = buffer.toString("base64")
        // const dataURI = `data:image/png;base64,${base64Image}`

        // // Upload segmented image to Cloudinary
        // const uploadResult = await new Promise((resolve, reject) => {
        //     cloudinary.uploader.upload(
        //         dataURI,
        //         {
        //             folder: "garbage-detection-segmented",
        //             resource_type: "image",
        //         },
        //         (error, result) => {
        //             if (error) reject(error)
        //             else resolve(result)
        //         },
        //     )
        // })

        // // Update image record in database
        // const updatedImage = await prisma.image.update({
        //     where: { id: imageId },
        //     data: {
        //         segmented: true,
        //         segmentedUrl: (uploadResult as any).secure_url,
        //     },
        // })

        // return NextResponse.json({
        //     success: true,
        //     segmentedImageUrl: updatedImage.segmentedUrl,
        // })
    } catch (error) {
        console.error("Error processing segmentation:", error)
        return NextResponse.json({ error: "Failed to process image segmentation" }, { status: 500 })
    }
}

