import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import { base64ToBlob } from "@/utils/base64ToBlob";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const formData = await request.formData();
    const image = formData.get("image") as File;

    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    let filePath;

    if (userId) {
      filePath = `${userId}/${Date.now()}-${image.name}`;
    } else {
      filePath = `unauthenticated/${Date.now()}-${image.name}`;
    }


    const { error: uploadImageError } = await supabase.storage
      .from("images")
      .upload(filePath, buffer, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadImageError) {
      return new Response(JSON.stringify({ error: uploadImageError.message }), { status: 500 });
    }

    const { data: signedImageData, error: signedImageError } = await supabase.storage
      .from("images")
      .createSignedUrl(filePath, 600);

    if (signedImageError) {
      return new Response(JSON.stringify({ error: signedImageError.message }), { status: 500 });
    }

    const mlFormData = new FormData();
    mlFormData.append("file", new Blob([buffer]), image.name);

    const MLModelResponse = await axios.post(
      "https://resnet-50fpn-api-production.up.railway.app/predict/",
      mlFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const segmentedBuffer = base64ToBlob(MLModelResponse.data.overlay_image);

    const { error: uploadSegmentedImageError } = await supabase.storage
      .from("segmented-images")
      .upload(filePath, segmentedBuffer, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadSegmentedImageError) {
      return new Response(JSON.stringify({ error: uploadSegmentedImageError.message }), { status: 500 });
    }

    const { data: signedSegmentedImageData, error: signedSegmentedImageError } = await supabase.storage
      .from("segmented-images")
      .createSignedUrl(filePath, 600);

    if (signedSegmentedImageError) {
      return new Response(JSON.stringify({ error: signedSegmentedImageError.message }), { status: 500 });
    }

    return NextResponse.json({
      originalImageUrl: signedImageData?.signedUrl,
      segmentedImageUrl: signedSegmentedImageData?.signedUrl,
    }, { status: 200 });
  } catch (error) {
    console.error("[SEGMENTATION_ERROR]: ", error);
    return NextResponse.json(
      { error: "Failed to process image segmentation" },
      { status: 500 }
    );
  }
}
