import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: rsvps, error } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main style={styles.page}>
        <div style={styles.wrapper}>
          <h1 style={styles.title}>Erro ao carregar confirmações</h1>
          <p style={styles.text}>{error.message}</p>
        </div>
      </main>
    );
  }

  const totalRespostas = rsvps?.length || 0;
  const confirmados = rsvps?.filter((item) => item.vai_comparecer) || [];
  const ausencias = rsvps?.filter((item) => !item.vai_comparecer) || [];
  const totalConfirmados = confirmados.length;
  const totalAusencias = ausencias.length;
  const totalPessoas = confirmados.reduce(
    (acc, item) => acc + (item.quantidade_pessoas || 1),
    0
  );

  return (
    <main style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div>
            <p style={styles.kicker}>Admin</p>
            <h1 style={styles.title}>Resumo de confirmações</h1>
            <p style={styles.text}>Evento: Marly Paim - 80 Anos</p>
          </div>
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.cardLabel}>Total de respostas</div>
            <div style={styles.cardValue}>{totalRespostas}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardLabel}>Confirmados</div>
            <div style={styles.cardValue}>{totalConfirmados}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardLabel}>Total de pessoas</div>
            <div style={styles.cardValue}>{totalPessoas}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardLabel}>Não irão</div>
            <div style={styles.cardValue}>{totalAusencias}</div>
          </div>
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
              {rsvps?.map((item) => (
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
  header: {
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
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
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
};