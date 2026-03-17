"use client";

import { useMemo, useState } from "react";
import styles from "./confirm-page.module.css";

type EventData = {
  id: string;
  slug: string;
  nome_evento: string;
  subtitulo: string | null;
  data_evento: string | null;
  horario: string | null;
  local_evento: string | null;
  link_maps: string | null;
  imagem_url: string | null;
  prazo_confirmacao: string | null;
};

export default function ConfirmPageClient({ event }: { event: EventData }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    presenca: "sim",
    quantidade: "1",
    acompanhantes: "",
    observacao: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const totalPessoas = useMemo(() => {
    const parsed = Number(form.quantidade || 1);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [form.quantidade]);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: event.slug,
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
          presenca: form.presenca,
          quantidade: form.quantidade,
          acompanhantes: form.acompanhantes,
          observacao: form.observacao,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao salvar confirmação.");
        return;
      }

      await fetch("/api/send-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          presenca: form.presenca,
          quantidade: form.quantidade,
          evento: event.nome_evento,
          data_evento: event.data_evento,
          horario: event.horario,
          local_evento: event.local_evento,
          link_maps: event.link_maps,
        }),
      });

      setSubmitted(true);
    } catch {
      alert("Erro ao enviar confirmação.");
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.leftCard}>
          <div>
            <p className={styles.kicker}>Convite especial</p>
            <h1 className={styles.title}>{event.nome_evento}</h1>
            <p className={styles.subtitle}>{event.subtitulo || ""}</p>
          </div>

          <div className={styles.infoPanel}>
            <div className={styles.photoArea}>
              {event.imagem_url ? (
                <img
                  src={event.imagem_url}
                  alt={event.nome_evento}
                  className={styles.photoImage}
                />
              ) : (
                <div className={styles.photoFallback}>Sem imagem</div>
              )}
            </div>

            <div className={styles.eventInfoBlock}>
              <p className={styles.eventLine}>{event.data_evento || "-"}</p>
              <p className={styles.eventLine}>{event.horario || "-"}</p>
              <p className={styles.eventLine}>{event.local_evento || "-"}</p>

              {event.link_maps && (
                <a
                  href={event.link_maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  <span>Como chegar</span>
                </a>
              )}
            </div>
          </div>

          <div className={styles.deadlineWrap}>
            <span className={styles.deadlineBadge}>
              {event.prazo_confirmacao || "Confirme sua presença"}
            </span>
          </div>
        </section>

        <section className={styles.rightCard}>
          <div style={{ marginBottom: 24 }}>
            <span className={styles.rsvpTag}>RSVP</span>
            <h2 className={styles.formTitle}>Confirmação de presença</h2>
            <p className={styles.formDescription}>
              Preencha os dados abaixo para registrar sua resposta.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className={styles.fieldBlock}>
                <label className={styles.label}>Nome completo</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => updateField("nome", e.target.value)}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.grid2}>
                <div className={styles.fieldBlock}>
                  <label className={styles.label}>E-mail</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldBlock}>
                  <label className={styles.label}>Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={form.telefone}
                    onChange={(e) => updateField("telefone", e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.fieldBlock}>
                <label className={styles.label}>Você irá comparecer?</label>
                <div className={styles.radioRow}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="presenca"
                      checked={form.presenca === "sim"}
                      onChange={() => updateField("presenca", "sim")}
                    />
                    <span>Sim</span>
                  </label>

                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="presenca"
                      checked={form.presenca === "nao"}
                      onChange={() => updateField("presenca", "nao")}
                    />
                    <span>Não</span>
                  </label>
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.fieldBlock}>
                  <label className={styles.label}>Quantidade de pessoas</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.quantidade}
                    onChange={(e) => updateField("quantidade", e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldBlock}>
                  <label className={styles.label}>Resumo</label>
                  <div className={styles.summaryBox}>
                    {form.presenca === "sim"
                      ? `${totalPessoas} pessoa(s) confirmada(s)`
                      : "Ausência informada"}
                  </div>
                </div>
              </div>

              <div className={styles.fieldBlock}>
                <label className={styles.label}>Nome dos acompanhantes</label>
                <textarea
                  value={form.acompanhantes}
                  onChange={(e) => updateField("acompanhantes", e.target.value)}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.fieldBlock}>
                <label className={styles.label}>Observações</label>
                <textarea
                  value={form.observacao}
                  onChange={(e) => updateField("observacao", e.target.value)}
                  className={styles.textarea}
                />
              </div>

              <button type="submit" className={styles.button}>
                Confirmar presença
              </button>
            </form>
          ) : (
            <div className={styles.successCard}>
              <h3 className={styles.successTitle}>
                Obrigado, {form.nome || "convidado"}.
              </h3>
              <p className={styles.successText}>
                {form.presenca === "sim"
                  ? `Sua presença foi registrada com sucesso para ${totalPessoas} pessoa(s).`
                  : "Registramos que você não poderá comparecer."}
              </p>

              <div className={styles.successInfo}>
                <p>
                  <strong>Evento:</strong> {event.nome_evento}
                </p>
                <p>
                  <strong>Data:</strong> {event.data_evento || "-"}
                </p>
                <p>
                  <strong>Horário:</strong> {event.horario || "-"}
                </p>
                <p>
                  <strong>Local:</strong> {event.local_evento || "-"}
                </p>
              </div>

              {event.link_maps && (
                <a
                  href={event.link_maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapButton}
                >
                  <span>Ver rota no Maps</span>
                </a>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}