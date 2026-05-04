import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import logo from "./assets/logo.png";

import Login from "./Login";
import Admin from "./Admin";
import Cliente from "./Cliente";

import { supabase } from "./supabase";

// 🔥 API
const API = "https://sacolao-api.onrender.com";

function App() {

  // 🔥 ADMIN (persistente)
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem("admin");
    return saved ? JSON.parse(saved) : null;
  });

  // 🔥 CLIENTE (supabase)
  const [clienteLogado, setClienteLogado] = useState(null);

  const [loadingAuth, setLoadingAuth] = useState(true);

  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [abrirCarrinho, setAbrirCarrinho] = useState(false);

  const [nome, setNome] = useState(() => localStorage.getItem("nome") || "");
  const [endereco, setEndereco] = useState(() => localStorage.getItem("endereco") || "");

  const [whatsapp, setWhatsapp] = useState("5591999999999");

  // 🔥 NOVO: taxa entrega
  const [taxaEntrega, setTaxaEntrega] = useState(3);

  const total = carrinho.reduce(
    (soma, p) => soma + p.preco * p.quantidade,
    0
  );

  // =======================
  // 🔐 SESSÃO SUPABASE
  // =======================
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getSession();

      if (data?.session?.user) {
        setClienteLogado(data.session.user);
      }

      setLoadingAuth(false);
    }

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setClienteLogado(session.user);
        } else {
          setClienteLogado(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // =======================
  // LOGIN ADMIN
  // =======================
  function handleLogin(email, senha) {
    axios.post(`${API}/login`, { email, senha })
      .then((res) => {
        setUsuario(res.data);
        localStorage.setItem("admin", JSON.stringify(res.data));
      })
      .catch(() => {
        alert("Login inválido");
      });
  }

  // =======================
  // LOGOUT
  // =======================
  async function logout() {
    setUsuario(null);
    setCarrinho([]);
    setAbrirCarrinho(false);

    localStorage.removeItem("admin");

    await supabase.auth.signOut();
    setClienteLogado(null);
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
  // CONFIG (WHATS + TAXA)
  // =======================
  useEffect(() => {
    axios.get(`${API}/config`)
      .then((res) => {
        if (res.data?.whatsapp) {
          setWhatsapp(res.data.whatsapp);
        }

        if (res.data?.taxa_entrega !== undefined) {
          setTaxaEntrega(Number(res.data.taxa_entrega));
        }
      })
      .catch(() => {
        console.log("Erro ao carregar config");
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
  // 🔥 FINALIZAR PEDIDO (COM FRETE)
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

    const frete = total >= 50 ? 0 : taxaEntrega;
    const totalFinal = total + frete;

    let mensagem = "🛒 Pedido - Sacolão do Edu\n\n";
    mensagem += `👤 Nome: ${nome}\n`;
    mensagem += `📍 Endereço: ${endereco}\n\n`;

    carrinho.forEach((p) => {
      mensagem += `🍎 ${p.nome} x${p.quantidade} - R$ ${p.preco}\n`;
    });

    mensagem += `\n🚚 Entrega: ${frete === 0 ? "Grátis" : "R$ " + frete}`;
    mensagem += `\n💰 Total: R$ ${totalFinal.toFixed(2)}`;

    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");

    setCarrinho([]);
    setNome("");
    setEndereco("");
    setAbrirCarrinho(false);
  }

  // =======================
  // ⏳ LOADING
  // =======================
  if (loadingAuth) {
    return <div style={{ padding: 20 }}>Carregando...</div>;
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
  if (clienteLogado) {
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

  // =======================
  // NÃO LOGADO
  // =======================
  return <Login onLogin={handleLogin} />;
}

export default App;