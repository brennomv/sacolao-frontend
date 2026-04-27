import { useState } from "react";
import logo from "./assets/logo.png";
import "./login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

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

  return (
    <div className="login-container">

      {/* LOGO */}
      <img src={logo} alt="logo" className="login-logo" />

      {/* FORM */}
      <form className="login-box" onSubmit={handleSubmit}>

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
          <p style={{ color: "red", fontSize: "14px" }}>
            {erro}
          </p>
        )}

        <button type="submit" className="login-button">
          Entrar
        </button>

      </form>

    </div>
  );
}

export default Login;