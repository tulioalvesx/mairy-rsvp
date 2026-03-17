"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <p style={styles.kicker}>Admin</p>
        <h1 style={styles.title}>Login do painel</h1>
        <p style={styles.desc}>
          Entre com o usuário administrador cadastrado no Supabase.
        </p>

        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "460px",
    backgroundColor: "#0b0b0b",
    border: "1px solid #3b3216",
    borderRadius: "24px",
    padding: "32px",
    color: "#fff",
  },
  kicker: {
    color: "#d8be67",
    textTransform: "uppercase",
    letterSpacing: "3px",
    fontSize: "12px",
    margin: 0,
  },
  title: {
    fontSize: "34px",
    marginTop: "12px",
    marginBottom: "10px",
  },
  desc: {
    color: "#cfcfcf",
    lineHeight: 1.5,
    marginBottom: "24px",
  },
  field: {
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
    color: "#fff",
    padding: "0 12px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    height: "50px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#b89024",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "8px",
  },
};