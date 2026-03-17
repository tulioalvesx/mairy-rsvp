import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nome,
      email,
      presenca,
      quantidade,
      evento,
      data_evento,
      horario,
      local_evento,
      link_maps,
    } = body;

    if (!nome || !email || !presenca) {
      return NextResponse.json(
        { error: "Dados obrigatórios não informados." },
        { status: 400 }
      );
    }

    const assunto =
      presenca === "sim"
        ? `Confirmação de presença - ${evento || "Evento"}`
        : `Resposta registrada - ${evento || "Evento"}`;

    const mensagem =
      presenca === "sim"
        ? `
          <h2>Olá, ${nome}!</h2>
          <p>Sua presença foi confirmada com sucesso.</p>
          <p><strong>Evento:</strong> ${evento || "-"}</p>
          <p><strong>Data:</strong> ${data_evento || "-"}</p>
          <p><strong>Horário:</strong> ${horario || "-"}</p>
          <p><strong>Local:</strong> ${local_evento || "-"}</p>
          <p><strong>Quantidade confirmada:</strong> ${quantidade || 1} pessoa(s)</p>
          ${
            link_maps
              ? `<p>Como chegar: <a href="${link_maps}">abrir mapa</a></p>`
              : ""
          }
        `
        : `
          <h2>Olá, ${nome}!</h2>
          <p>Recebemos sua resposta informando que você não poderá comparecer.</p>
          <p>Obrigado pelo retorno.</p>
        `;

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email,
      subject: assunto,
      html: mensagem,
    });

    console.log("RESEND RESPONSE:", { data, error });

    if (error) {
      console.error("RESEND ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao enviar e-mail." },
      { status: 500 }
    );
  }
}