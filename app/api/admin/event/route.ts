import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const adminDb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      slug,
      nome_evento,
      subtitulo,
      data_evento,
      horario,
      local_evento,
      link_maps,
      prazo_confirmacao,
      imagem_url,
    } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug não informado." }, { status: 400 });
    }

    const { error } = await adminDb
      .from("events")
      .update({
        nome_evento,
        subtitulo,
        data_evento,
        horario,
        local_evento,
        link_maps,
        prazo_confirmacao,
        imagem_url,
      })
      .eq("slug", slug);

    if (error) {
      console.error("ADMIN_EVENT_UPDATE_ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_EVENT_ROUTE_ERROR:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar evento." },
      { status: 500 }
    );
  }
}