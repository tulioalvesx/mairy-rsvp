import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const adminDb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `event-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const { error } = await adminDb.storage
      .from("event-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("UPLOAD_IMAGE_ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = adminDb.storage.from("event-images").getPublicUrl(fileName);

    return NextResponse.json({ success: true, publicUrl: data.publicUrl });
  } catch (error) {
    console.error("UPLOAD_IMAGE_ROUTE_ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao enviar imagem." },
      { status: 500 }
    );
  }
}