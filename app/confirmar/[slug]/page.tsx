"use client";

import { useMemo, useState } from "react";

export default function Page() {
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.leftCard}>
          <div>
            <p style={styles.kicker}>Convite especial</p>
            <h1 style={styles.title}>Marly Paim</h1>
            <p style={styles.subtitle}>80 Anos</p>
          </div>

          <div style={styles.infoPanel}>
            <div style={styles.photoArea}>
  <img
    src="/marly.jpg"
    alt="Marly Paim"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "20px",
    }}
  />
</div>

            <div style={styles.eventInfoBlock}>
              <p style={styles.eventLine}>25 de abril de 2026</p>
              <p style={styles.eventLine}>18h</p>
              <p style={styles.eventLine}>Lua Azul Eventos</p>

              <a
                href="https://maps.app.goo.gl/QP3dtTYPsAW5u5Ds9"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.mapLink}
              >
                <span style={styles.mapIconWrap}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 21s6-5.686 6-11a6 6 0 1 0-12 0c0 5.314 6 11 6 11Z"
                      stroke="#d8be67"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="10" r="2.5" fill="#d8be67" />
                  </svg>
                </span>
                <span>Como chegar</span>
              </a>
            </div>
          </div>

          <div style={styles.deadlineWrap}>
            <span style={styles.deadlineBadge}>
              Confirme sua presença até 11 de abril
            </span>
          </div>
        </section>

        <section style={styles.rightCard}>
          <div style={{ marginBottom: 24 }}>
            <span style={styles.rsvpTag}>RSVP</span>
            <h2 style={styles.formTitle}>Confirmação de presença</h2>
            <p style={styles.formDescription}>
              Preencha os dados abaixo para registrar sua resposta para a
              celebração dos 80 anos de Marly Paim.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div style={styles.fieldBlock}>
                <label style={styles.label}>Nome completo</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => updateField("nome", e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.grid2}>
                <div style={styles.fieldBlock}>
                  <label style={styles.label}>E-mail</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldBlock}>
                  <label style={styles.label}>Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={form.telefone}
                    onChange={(e) => updateField("telefone", e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.fieldBlock}>
                <label style={styles.label}>Você irá comparecer?</label>
                <div style={styles.radioRow}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="presenca"
                      checked={form.presenca === "sim"}
                      onChange={() => updateField("presenca", "sim")}
                    />
                    <span>Sim</span>
                  </label>

                  <label style={styles.radioLabel}>
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

              <div style={styles.grid2}>
                <div style={styles.fieldBlock}>
                  <label style={styles.label}>Quantidade de pessoas</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={form.quantidade}
                    onChange={(e) => updateField("quantidade", e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldBlock}>
                  <label style={styles.label}>Resumo</label>
                  <div style={styles.summaryBox}>
                    {form.presenca === "sim"
                      ? `${totalPessoas} pessoa(s) confirmada(s)`
                      : "Ausência informada"}
                  </div>
                </div>
              </div>

              <div style={styles.fieldBlock}>
                <label style={styles.label}>Nome dos acompanhantes</label>
                <textarea
                  value={form.acompanhantes}
                  onChange={(e) => updateField("acompanhantes", e.target.value)}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.fieldBlock}>
                <label style={styles.label}>Observações</label>
                <textarea
                  value={form.observacao}
                  onChange={(e) => updateField("observacao", e.target.value)}
                  style={styles.textarea}
                />
              </div>

              <button type="submit" style={styles.button}>
                Confirmar presença
              </button>
            </form>
          ) : (
            <div style={styles.successCard}>
              <h3 style={styles.successTitle}>
                Obrigado, {form.nome || "convidado"}.
              </h3>
              <p style={styles.successText}>
                {form.presenca === "sim"
                  ? `Sua presença foi registrada com sucesso para ${totalPessoas} pessoa(s).`
                  : "Registramos que você não poderá comparecer."}
              </p>

              <div style={styles.successInfo}>
                <p>
                  <strong>Evento:</strong> Marly Paim - 80 Anos
                </p>
                <p>
                  <strong>Data:</strong> 25 de abril de 2026
                </p>
                <p>
                  <strong>Horário:</strong> 18h
                </p>
                <p>
                  <strong>Local:</strong> Lua Azul Eventos
                </p>
              </div>

              <a
                href="https://maps.app.goo.gl/QP3dtTYPsAW5u5Ds9"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.mapButton}
              >
                <span style={styles.mapIconWrap}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 21s6-5.686 6-11a6 6 0 1 0-12 0c0 5.314 6 11 6 11Z"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="10" r="2.5" fill="#ffffff" />
                  </svg>
                </span>
                <span>Ver rota no Maps</span>
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#050505",
    color: "#ffffff",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "32px",
  },
  leftCard: {
    backgroundColor: "#0b0b0b",
    border: "1px solid #3b3216",
    borderRadius: "28px",
    padding: "40px",
    minHeight: "760px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  kicker: {
    color: "#d8be67",
    textTransform: "uppercase",
    letterSpacing: "4px",
    fontSize: "12px",
    margin: 0,
  },
  title: {
    fontSize: "76px",
    lineHeight: 1,
    margin: "12px 0 8px 0",
    fontFamily: "Georgia, serif",
    fontStyle: "italic",
  },
  subtitle: {
    fontSize: "28px",
    color: "#e7d49b",
    margin: 0,
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  infoPanel: {
    border: "1px solid #5e4d1d",
    borderRadius: "30px",
    padding: "30px",
    textAlign: "center",
    backgroundColor: "#101010",
    maxWidth: "390px",
    margin: "0 auto",
  },
  photoArea: {
    width: "100%",
    height: "260px",
    border: "1px dashed #7b641f",
    borderRadius: "22px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    backgroundColor: "#0d0d0d",
  },
  photoText: {
    fontSize: "24px",
    color: "#d8be67",
    fontWeight: 700,
    marginBottom: "8px",
  },
  photoSubtext: {
    fontSize: "14px",
    color: "#cdb97a",
  },
  eventInfoBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },
  eventLine: {
    fontSize: "28px",
    margin: 0,
  },
  mapLink: {
    marginTop: "8px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "#d8be67",
    textDecoration: "none",
    fontWeight: 700,
    border: "1px solid #5e4d1d",
    borderRadius: "999px",
    padding: "10px 16px",
  },
  mapIconWrap: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deadlineWrap: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  deadlineBadge: {
    display: "inline-block",
    backgroundColor: "#b89024",
    color: "#ffffff",
    padding: "14px 22px",
    borderRadius: "6px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    textAlign: "center",
  },
  rightCard: {
    backgroundColor: "#0b0b0b",
    border: "1px solid #3b3216",
    borderRadius: "28px",
    padding: "32px",
  },
  rsvpTag: {
    color: "#d8be67",
    textTransform: "uppercase",
    fontSize: "12px",
    letterSpacing: "3px",
  },
  formTitle: {
    fontSize: "36px",
    marginTop: "12px",
    marginBottom: "10px",
  },
  formDescription: {
    color: "#d0d0d0",
    margin: 0,
    lineHeight: 1.5,
  },
  fieldBlock: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    height: "48px",
    borderRadius: "10px",
    border: "1px solid #403515",
    backgroundColor: "#121212",
    color: "#ffffff",
    padding: "0 12px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    borderRadius: "10px",
    border: "1px solid #403515",
    backgroundColor: "#121212",
    color: "#ffffff",
    padding: "12px",
    boxSizing: "border-box",
    resize: "vertical",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  },
  radioRow: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  summaryBox: {
    width: "100%",
    minHeight: "48px",
    borderRadius: "10px",
    border: "1px solid #403515",
    backgroundColor: "#121212",
    color: "#dddddd",
    padding: "12px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
  },
  button: {
    height: "50px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#b89024",
    color: "#ffffff",
    padding: "0 24px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "16px",
  },
  successCard: {
    border: "1px solid #5e4d1d",
    borderRadius: "20px",
    padding: "24px",
    backgroundColor: "#15110a",
  },
  successTitle: {
    fontSize: "28px",
    marginTop: 0,
    marginBottom: "12px",
  },
  successText: {
    color: "#dddddd",
    marginBottom: "20px",
    lineHeight: 1.5,
  },
  successInfo: {
    border: "1px solid #403515",
    borderRadius: "14px",
    backgroundColor: "#0f0f0f",
    padding: "16px",
    marginBottom: "18px",
    lineHeight: 1.8,
  },
  mapButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#b89024",
    color: "#ffffff",
    textDecoration: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: 700,
  },
};