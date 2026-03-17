"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type RSVP = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  vai_comparecer: boolean;
  quantidade_pessoas: number | null;
  acompanhantes: string | null;
  observacao: string | null;
  created_at: string;
};

export default function AdminDashboardClient({
  rsvps,
}: {
  rsvps: RSVP[];
}) {
  const supabase = createClient();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return rsvps;

    return rsvps.filter(
      (item) =>
        item.nome?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) ||
        item.telefone?.toLowerCase().includes(term)
    );
  }, [rsvps, search]);

  const totalRespostas = filtered.length;
  const confirmados = filtered.filter((item) => item.vai_comparecer);
  const ausencias = filtered.filter((item) => !item.vai_comparecer);
  const totalPessoas = confirmados.reduce(
    (acc, item) => acc + (item.quantidade_pessoas || 1),
    0
  );

  function exportCSV() {
    const headers = [
      "Nome",
      "Email",
      "Telefone",
      "Vai",
      "Pessoas",
      "Acompanhantes",
      "Observacao",
      "Criado em",
    ];

    const rows = filtered.map((item) => [
      item.nome || "",
      item.email || "",
      item.telefone || "",
      item.vai_comparecer ? "Sim" : "Não",
      String(item.quantidade_pessoas || 1),
      item.acompanhantes || "",
      item.observacao || "",
      item.created_at || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "confirmacoes-evento.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.topBar}>
          <div>
            <p style={styles.kicker}>Admin</p>
            <h1 style={styles.title}>Resumo de confirmações</h1>
            <p style={styles.text}>Evento: painel principal</p>
          </div>

          <div style={styles.topActions}>
            <button onClick={exportCSV} style={styles.goldButton}>
              Exportar CSV
            </button>

            <button
              onClick={() => router.push("/admin/settings")}
              style={styles.darkButton}
            >
              Configurações
            </button>

            <button onClick={handleLogout} style={styles.darkButton}>
              Sair
            </button>
          </div>
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.cardLabel}>Total de respostas</div>
            <div style={styles.cardValue}>{totalRespostas}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardLabel}>Confirmados</div>
            <div style={styles.cardValue}>{confirmados.length}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardLabel}>Total de pessoas</div>
            <div style={styles.cardValue}>{totalPessoas}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardLabel}>Não irão</div>
            <div style={styles.cardValue}>{ausencias.length}</div>
          </div>
        </div>

        <div style={styles.filterBar}>
          <input
            placeholder="Buscar por nome, e-mail ou telefone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>E-mail</th>
                <th style={styles.th}>Telefone</th>
                <th style={styles.th}>Vai?</th>
                <th style={styles.th}>Pessoas</th>
                <th style={styles.th}>Acompanhantes</th>
                <th style={styles.th}>Observação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.nome}</td>
                  <td style={styles.td}>{item.email}</td>
                  <td style={styles.td}>{item.telefone || "-"}</td>
                  <td style={styles.td}>
                    {item.vai_comparecer ? "Sim" : "Não"}
                  </td>
                  <td style={styles.td}>{item.quantidade_pessoas || 1}</td>
                  <td style={styles.td}>{item.acompanhantes || "-"}</td>
                  <td style={styles.td}>{item.observacao || "-"}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td style={styles.emptyTd} colSpan={7}>
                    Nenhum resultado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
    maxWidth: "1280px",
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
  topActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  goldButton: {
    border: "none",
    backgroundColor: "#b89024",
    color: "#fff",
    borderRadius: "10px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 700,
  },
  darkButton: {
    border: "1px solid #3b3216",
    backgroundColor: "#0b0b0b",
    color: "#fff",
    borderRadius: "10px",
    padding: "12px 18px",
    cursor: "pointer",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "18px",
  },
  card: {
    backgroundColor: "#0b0b0b",
    border: "1px solid #3b3216",
    borderRadius: "18px",
    padding: "20px",
  },
  cardLabel: {
    color: "#d8be67",
    fontSize: "14px",
    marginBottom: "8px",
  },
  cardValue: {
    fontSize: "34px",
    fontWeight: 700,
  },
  filterBar: {
    marginBottom: "18px",
  },
  searchInput: {
    width: "100%",
    height: "46px",
    borderRadius: "10px",
    border: "1px solid #403515",
    backgroundColor: "#121212",
    color: "#fff",
    padding: "0 12px",
    boxSizing: "border-box",
  },
  tableWrap: {
    overflowX: "auto",
    backgroundColor: "#0b0b0b",
    border: "1px solid #3b3216",
    borderRadius: "18px",
    padding: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "14px",
    borderBottom: "1px solid #3b3216",
    color: "#d8be67",
    fontSize: "14px",
  },
  td: {
    padding: "14px",
    borderBottom: "1px solid #221d0e",
    verticalAlign: "top",
    color: "#f1f1f1",
    fontSize: "14px",
  },
  emptyTd: {
    padding: "20px",
    textAlign: "center",
    color: "#cfcfcf",
  },
};