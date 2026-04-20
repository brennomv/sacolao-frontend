import { useState } from "react";
import logo from "./assets/logo.png";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <div className="login-container">

      {/* LOGO CENTRAL */}
      <img src={logo} alt="logo" className="login-logo" />

      {/* BOX LOGIN */}
      <div className="login-box">

        <input
          type="text"
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

        <button
          className="login-button"
          onClick={() => onLogin(email, senha)}
        >
          Entrar
        </button>

      </div>

    </div>
  );
}

export default Login;