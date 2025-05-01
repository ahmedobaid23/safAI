import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import axios from "axios";
// import { supabase } from "@/lib/supabase";
// import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const formData = await request.formData();
    // const location = formData.get("location") as string;
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

    // const { data, error: uploadError } = await supabase.storage
    //   .from("images")
    //   .upload(`${userId}/${location}-${Date.now()}`, buffer);
    // console.log(data);

    // if (uploadError) {
    //   throw new Error(uploadError.message);
    // }

    const mlFormData = new FormData();
    mlFormData.append("file", new Blob([buffer]), image.name);

    const MLModelResponse = await axios.post(
      "http://localhost:8000/predict/",
      mlFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return NextResponse.json({
      success: true,
      segmentedImage: MLModelResponse.data.overlay_image,
    });
  } catch (error) {
    console.error("[SEGMENTATION_ERROR]: ", error);
    return NextResponse.json(
      { error: "Failed to process image segmentation" },
      { status: 500 }
    );
  }
}
