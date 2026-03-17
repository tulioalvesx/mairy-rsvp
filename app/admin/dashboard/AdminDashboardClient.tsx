"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";

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
    <main className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.topBar}>
          <div>
            <p className={styles.kicker}>Admin</p>
            <h1 className={styles.title}>Resumo de confirmações</h1>
            <p className={styles.text}>Evento: painel principal</p>
          </div>

          <div className={styles.topActions}>
            <button onClick={exportCSV} className={styles.goldButton}>
              Exportar CSV
            </button>

            <button
              onClick={() => router.push("/admin/settings")}
              className={styles.darkButton}
            >
              Configurações
            </button>

            <button onClick={handleLogout} className={styles.darkButton}>
              Sair
            </button>
          </div>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardLabel}>Total de respostas</div>
            <div className={styles.cardValue}>{totalRespostas}</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardLabel}>Confirmados</div>
            <div className={styles.cardValue}>{confirmados.length}</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardLabel}>Total de pessoas</div>
            <div className={styles.cardValue}>{totalPessoas}</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardLabel}>Não irão</div>
            <div className={styles.cardValue}>{ausencias.length}</div>
          </div>
        </div>

        <div className={styles.filterBar}>
          <input
            placeholder="Buscar por nome, e-mail ou telefone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Nome</th>
                <th className={styles.th}>E-mail</th>
                <th className={styles.th}>Telefone</th>
                <th className={styles.th}>Vai?</th>
                <th className={styles.th}>Pessoas</th>
                <th className={styles.th}>Acompanhantes</th>
                <th className={styles.th}>Observação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className={styles.td}>{item.nome}</td>
                  <td className={styles.td}>{item.email}</td>
                  <td className={styles.td}>{item.telefone || "-"}</td>
                  <td className={styles.td}>
                    {item.vai_comparecer ? "Sim" : "Não"}
                  </td>
                  <td className={styles.td}>{item.quantidade_pessoas || 1}</td>
                  <td className={styles.td}>{item.acompanhantes || "-"}</td>
                  <td className={styles.td}>{item.observacao || "-"}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className={styles.emptyTd} colSpan={7}>
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