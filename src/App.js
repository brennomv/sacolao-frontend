import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import logo from "./assets/logo.png";

import Login from "./Login";
import Admin from "./Admin";
import Cliente from "./Cliente";

// 🔥 URL BASE (facilita manutenção depois)
const API = "https://sacolao-api.onrender.com";

function App() {
  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [abrirCarrinho, setAbrirCarrinho] = useState(false);

  const [nome, setNome] = useState(() => localStorage.getItem("nome") || "");
  const [endereco, setEndereco] = useState(() => localStorage.getItem("endereco") || "");

  // 🔥 WHATSAPP DINÂMICO
  const [whatsapp, setWhatsapp] = useState("5591999999999");

  const total = carrinho.reduce(
    (soma, p) => soma + p.preco * p.quantidade,
    0
  );

  // =======================
  // LOGIN
  // =======================
  function handleLogin(email, senha) {
    axios.post(`${API}/login`, { email, senha })
      .then((res) => {
        setUsuario(res.data);
        setLogado(true);
      })
      .catch(() => {
        alert("Login inválido");
      });
  }

  // =======================
  // LOGOUT
  // =======================
  function logout() {
    setLogado(false);
    setUsuario(null);
    setCarrinho([]);
    setAbrirCarrinho(false);
  }

  // =======================
  // PRODUTOS
  // =======================
  useEffect(() => {
    axios.get(`${API}/produtos`)
      .then((res) => setProdutos(res.data))
      .catch(() => console.log("Erro ao carregar produtos"));
  }, []);

  // =======================
  // 🔥 BUSCAR WHATSAPP
  // =======================
  useEffect(() => {
    axios.get(`${API}/config`)
      .then((res) => {
        if (res.data?.whatsapp) {
          setWhatsapp(res.data.whatsapp);
        }
      })
      .catch(() => {
        console.log("Erro ao carregar WhatsApp");
      });
  }, []);

  // =======================
  // LOCAL STORAGE
  // =======================
  useEffect(() => {
    localStorage.setItem("nome", nome);
  }, [nome]);

  useEffect(() => {
    localStorage.setItem("endereco", endereco);
  }, [endereco]);

  // =======================
  // CARRINHO
  // =======================
  function adicionar(produto) {
    const existe = carrinho.find((p) => p.id === produto.id);

    if (existe) {
      setCarrinho(
        carrinho.map((p) =>
          p.id === produto.id
            ? { ...p, quantidade: p.quantidade + 1 }
            : p
        )
      );
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  }

  function aumentar(id) {
    setCarrinho(
      carrinho.map((p) =>
        p.id === id ? { ...p, quantidade: p.quantidade + 1 } : p
      )
    );
  }

  function diminuir(id) {
    setCarrinho(
      carrinho
        .map((p) =>
          p.id === id ? { ...p, quantidade: p.quantidade - 1 } : p
        )
        .filter((p) => p.quantidade > 0)
    );
  }

  // =======================
  // FINALIZAR PEDIDO
  // =======================
  function finalizarPedido() {
    if (!nome || !endereco) {
      alert("Preencha nome e endereço!");
      return;
    }

    if (carrinho.length === 0) {
      alert("Carrinho vazio!");
      return;
    }

    let mensagem = "🛒 Pedido - Sacolão do Edu\n\n";
    mensagem += `👤 Nome: ${nome}\n`;
    mensagem += `📍 Endereço: ${endereco}\n\n`;

    carrinho.forEach((p) => {
      mensagem += `🍎 ${p.nome} x${p.quantidade} - R$ ${p.preco}\n`;
    });

    mensagem += `\n💰 Total: R$ ${total.toFixed(2)}`;

    // 🔥 WHATSAPP DINÂMICO
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

    // 🔥 LIMPAR
    setCarrinho([]);
    setNome("");
    setEndereco("");
    setAbrirCarrinho(false);
  }

  // =======================
  // LOGIN SCREEN
  // =======================
  if (!logado) {
    return <Login onLogin={handleLogin} />;
  }

  // =======================
  // ADMIN
  // =======================
  if (usuario?.tipo === "admin") {
    return <Admin logout={logout} />;
  }

  // =======================
  // CLIENTE
  // =======================
  return (
    <Cliente
      produtos={produtos}
      carrinho={carrinho}
      adicionar={adicionar}
      aumentar={aumentar}
      diminuir={diminuir}
      nome={nome}
      setNome={setNome}
      endereco={endereco}
      setEndereco={setEndereco}
      total={total}
      finalizarPedido={finalizarPedido}
      abrirCarrinho={abrirCarrinho}
      setAbrirCarrinho={setAbrirCarrinho}
      logo={logo}
      logout={logout}
    />
  );
}

export default App;