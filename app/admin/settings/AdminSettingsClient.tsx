"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./settings.module.css";

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
    <main className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.topBar}>
          <div>
            <p className={styles.kicker}>Admin</p>
            <h1 className={styles.title}>Configurações do evento</h1>
            <p className={styles.text}>Edite os dados exibidos na página pública</p>
          </div>

          <button
            onClick={() => router.push("/admin/dashboard")}
            className={styles.backButton}
          >
            Voltar ao dashboard
          </button>
        </div>

        <form onSubmit={handleSaveEvent} className={styles.formPanel}>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Título</label>
              <input
                value={form.nome_evento}
                onChange={(e) => updateField("nome_evento", e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Subtítulo</label>
              <input
                value={form.subtitulo}
                onChange={(e) => updateField("subtitulo", e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Data</label>
              <input
                value={form.data_evento}
                onChange={(e) => updateField("data_evento", e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Horário</label>
              <input
                value={form.horario}
                onChange={(e) => updateField("horario", e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Local</label>
              <input
                value={form.local_evento}
                onChange={(e) => updateField("local_evento", e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Link Maps</label>
              <input
                value={form.link_maps}
                onChange={(e) => updateField("link_maps", e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Prazo de confirmação</label>
            <input
              value={form.prazo_confirmacao}
              onChange={(e) => updateField("prazo_confirmacao", e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Imagem atual</label>
            <div className={styles.previewBox}>
              {form.imagem_url ? (
                <img src={form.imagem_url} alt="Preview" className={styles.previewImage} />
              ) : (
                <div className={styles.previewEmpty}>Sem imagem</div>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Trocar imagem</label>

            <div className={styles.uploadBox}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
              />
            </div>

            <div className={styles.helper}>
              {uploading ? "Enviando imagem..." : "Clique em Escolher arquivo para trocar a foto"}
            </div>
          </div>

          <button type="submit" className={styles.saveButton} disabled={saving}>
            {saving ? "Salvando..." : "Salvar evento"}
          </button>
        </form>
      </div>
    </main>
  );
}