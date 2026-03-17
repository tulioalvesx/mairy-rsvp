"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EventData = {
  slug: string;
  nome_evento: string;
  subtitulo: string | null;
  data_evento: string | null;
  horario: string | null;
  local_evento: string | null;
  link_maps: string | null;
  prazo_confirmacao: string | null;
  imagem_url: string | null;
};

export default function AdminSettingsClient({
  event,
}: {
  event: EventData;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    slug: event.slug,
    nome_evento: event.nome_evento || "",
    subtitulo: event.subtitulo || "",
    data_evento: event.data_evento || "",
    horario: event.horario || "",
    local_evento: event.local_evento || "",
    link_maps: event.link_maps || "",
    prazo_confirmacao: event.prazo_confirmacao || "",
    imagem_url: event.imagem_url || "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao salvar evento.");
        return;
      }

      alert("Evento atualizado com sucesso.");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar evento.");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao enviar imagem.");
        return;
      }

      updateField("imagem_url", data.publicUrl);
      alert("Imagem enviada. Clique em Salvar evento.");
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.topBar}>
          <div>
            <p style={styles.kicker}>Admin</p>
            <h1 style={styles.title}>Configurações do evento</h1>
            <p style={styles.text}>Edite os dados exibidos na página pública</p>
          </div>

          <button onClick={() => router.push("/admin/dashboard")} style={styles.backButton}>
            Voltar ao dashboard
          </button>
        </div>

        <form onSubmit={handleSaveEvent} style={styles.formPanel}>
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Título</label>
              <input
                value={form.nome_evento}
                onChange={(e) => updateField("nome_evento", e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Subtítulo</label>
              <input
                value={form.subtitulo}
                onChange={(e) => updateField("subtitulo", e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Data</label>
              <input
                value={form.data_evento}
                onChange={(e) => updateField("data_evento", e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Horário</label>
              <input
                value={form.horario}
                onChange={(e) => updateField("horario", e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Local</label>
              <input
                value={form.local_evento}
                onChange={(e) => updateField("local_evento", e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Link Maps</label>
              <input
                value={form.link_maps}
                onChange={(e) => updateField("link_maps", e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Prazo de confirmação</label>
            <input
              value={form.prazo_confirmacao}
              onChange={(e) => updateField("prazo_confirmacao", e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Imagem atual</label>
            <div style={styles.previewBox}>
              {form.imagem_url ? (
                <img src={form.imagem_url} alt="Preview" style={styles.previewImage} />
              ) : (
                <div style={styles.previewEmpty}>Sem imagem</div>
              )}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Trocar imagem</label>

            <div style={styles.uploadBox}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={styles.fileInput}
              />
            </div>

            <div style={styles.helper}>
              {uploading ? "Enviando imagem..." : "Clique em Escolher arquivo para trocar a foto"}
            </div>
          </div>

          <button type="submit" style={styles.saveButton} disabled={saving}>
            {saving ? "Salvando..." : "Salvar evento"}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#050505",
    color: "#fff",
    padding: "32px 20px",
    fontFamily: "Arial, sans-serif",
  },
  wrapper: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "24px",
  },
  kicker: {
    color: "#d8be67",
    textTransform: "uppercase",
    letterSpacing: "3px",
    fontSize: "12px",
    margin: 0,
  },
  title: {
    fontSize: "36px",
    margin: "12px 0 8px 0",
  },
  text: {
    color: "#cfcfcf",
  },
  backButton: {
    border: "1px solid #3b3216",
    backgroundColor: "#0b0b0b",
    color: "#fff",
    borderRadius: "10px",
    padding: "12px 18px",
    cursor: "pointer",
  },
  formPanel: {
    backgroundColor: "#0b0b0b",
    border: "1px solid #3b3216",
    borderRadius: "18px",
    padding: "24px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  field: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    height: "46px",
    borderRadius: "10px",
    border: "1px solid #403515",
    backgroundColor: "#121212",
    color: "#fff",
    padding: "0 12px",
    boxSizing: "border-box",
  },
  previewBox: {
    width: "240px",
    height: "240px",
    borderRadius: "18px",
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    border: "1px solid #3b3216",
    filter: "grayscale(35%)",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  previewEmpty: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#aaa",
  },
  uploadBox: {
    display: "inline-block",
    border: "1px solid #b89024",
    borderRadius: "10px",
    padding: "10px 14px",
    backgroundColor: "#15110a",
  },
  fileInput: {
    color: "#fff",
  },
  helper: {
    marginTop: "8px",
    color: "#cfcfcf",
    fontSize: "13px",
  },
  saveButton: {
    height: "46px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#b89024",
    color: "#fff",
    padding: "0 24px",
    fontWeight: 700,
    cursor: "pointer",
  },
};