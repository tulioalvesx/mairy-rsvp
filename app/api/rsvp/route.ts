import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      slug,
      nome,
      email,
      telefone,
      presenca,
      quantidade,
      acompanhantes,
      observacao,
    } = body;

    if (!slug || !nome || !email) {
      return NextResponse.json(
        { error: "Dados obrigatórios não informados." },
        { status: 400 }
      );
    }

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("slug", slug)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Evento não encontrado." },
        { status: 404 }
      );
    }

    const { error: insertError } = await supabase.from("rsvps").insert({
      event_id: event.id,
      nome,
      email,
      telefone,
      vai_comparecer: presenca === "sim",
      quantidade_pessoas: Number(quantidade || 1),
      acompanhantes,
      observacao,
    });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao registrar confirmação." },
      { status: 500 }
    );
  }
}