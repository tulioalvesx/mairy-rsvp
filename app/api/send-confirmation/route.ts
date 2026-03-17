import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { nome, email, presenca, quantidade } = body;

    if (!nome || !email || !presenca) {
      return NextResponse.json(
        { error: "Dados obrigatórios não informados." },
        { status: 400 }
      );
    }

    const assunto =
      presenca === "sim"
        ? "Confirmação de presença - Marly Paim 80 Anos"
        : "Resposta registrada - Marly Paim 80 Anos";

    const mensagem =
      presenca === "sim"
        ? `
          <h2>Olá, ${nome}!</h2>
          <p>Sua presença foi confirmada com sucesso.</p>
          <p><strong>Evento:</strong> Marly Paim - 80 Anos</p>
          <p><strong>Data:</strong> 25 de abril de 2026</p>
          <p><strong>Horário:</strong> 18h</p>
          <p><strong>Local:</strong> Lua Azul Eventos</p>
          <p><strong>Quantidade confirmada:</strong> ${quantidade || 1} pessoa(s)</p>
          <p>Como chegar: <a href="https://maps.app.goo.gl/QP3dtTYPsAW5u5Ds9">abrir mapa</a></p>
        `
        : `
          <h2>Olá, ${nome}!</h2>
          <p>Recebemos sua resposta informando que você não poderá comparecer.</p>
          <p>Obrigado pelo retorno.</p>
        `;

    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email,
      subject: assunto,
      html: mensagem,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao enviar e-mail." },
      { status: 500 }
    );
  }
}