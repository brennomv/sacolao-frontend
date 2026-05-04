import { useState } from "react";
import logo from "./assets/logo.png";
import "./login.css";
import { supabase } from "./supabase";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // =======================
  // LOGIN ADMIN (BACKEND)
  // =======================
  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !senha) {
      setErro("⚠️ Preencha todos os campos");
      return;
    }

    setErro("");

    if (typeof onLogin === "function") {
      onLogin(email, senha);
    } else {
      setErro("Erro interno no login");
    }
  }

  // =======================
  // LOGIN GOOGLE (CLIENTE)
  // =======================
  async function loginGoogle() {
    try {
      setLoading(true);
      setErro("");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin // 🔥 IMPORTANTE
        }
      });

      if (error) {
        console.log(error);
        setErro("❌ Erro ao entrar com Google");
      }

    } catch (err) {
      console.log(err);
      setErro("❌ Erro inesperado no login Google");
    } finally {
      setLoading(false);
    }
  }

  // =======================
  // CADASTRO CLIENTE
  // =======================
  async function cadastrar() {
    if (!email || !senha) {
      setErro("⚠️ Preencha email e senha para cadastrar");
      return;
    }

    try {
      setLoading(true);
      setErro("");

      const { error } = await supabase.auth.signUp({
        email,
        password: senha
      });

      if (error) {
        setErro("❌ " + error.message);
      } else {
        setErro("✅ Conta criada! Verifique seu email");
      }

    } catch (err) {
      console.log(err);
      setErro("❌ Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">

      {/* LOGO */}
      <img src={logo} alt="logo" className="login-logo" />

      {/* FORM ADMIN */}
      <form className="login-box" onSubmit={handleSubmit}>

        <h2 style={{ textAlign: "center" }}>🔐 Acesso</h2>

        <input
          type="email"
          placeholder="Usuário (email)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="login-input"
        />

        {/* ERRO */}
        {erro && (
          <p style={{ color: erro.startsWith("✅") ? "green" : "red", fontSize: "14px", textAlign: "center" }}>
            {erro}
          </p>
        )}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Carregando..." : "Entrar (Admin)"}
        </button>

        {/* DIVISOR */}
        <div style={{
          margin: "15px 0",
          textAlign: "center",
          fontSize: "12px",
          color: "#777"
        }}>
          ───────── ou ─────────
        </div>

        {/* GOOGLE */}
        <button
          type="button"
          className="login-button"
          onClick={loginGoogle}
          style={{ background: "#4285F4" }}
          disabled={loading}
        >
          {loading ? "Carregando..." : "🔵 Entrar com Google"}
        </button>

        {/* CADASTRO */}
        <button
          type="button"
          className="login-button"
          onClick={cadastrar}
          style={{ background: "#6c757d" }}
          disabled={loading}
        >
          {loading ? "Carregando..." : "🆕 Criar conta"}
        </button>

      </form>

    </div>
  );
}

export default Login;S