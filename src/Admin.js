import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://sacolao-api.onrender.com";

function Admin({ logout }) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);

  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [whatsapp, setWhatsapp] = useState("");

  // 🔥 SEPARAÇÃO CORRETA
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [loading, setLoading] = useState(false);

  // =======================
  // LIMPA MENSAGENS AUTOMÁTICO
  // =======================
  useEffect(() => {
    if (erro || sucesso) {
      const timer = setTimeout(() => {
        setErro("");
        setSucesso("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [erro, sucesso]);

  // =======================
  // INIT
  // =======================
  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    try {
      const [resProdutos, resPedidos, resConfig] = await Promise.all([
        axios.get(`${API}/produtos`),
        axios.get(`${API}/pedidos`),
        axios.get(`${API}/config`)
      ]);

      setProdutos(resProdutos.data || []);
      setPedidos(resPedidos.data || []);

      if (resConfig.data?.whatsapp) {
        setWhatsapp(resConfig.data.whatsapp);
      }

      setErro(""); // limpa erro se deu certo

    } catch (err) {
      console.log("ERRO GERAL:", err);
      setErro("❌ Erro ao carregar dados");
    }
  }

  // =======================
  // WHATSAPP
  // =======================
  async function salvarWhatsapp() {
    if (!whatsapp) {
      return setErro("⚠️ Informe um número válido");
    }

    try {
      await axios.put(`${API}/config`, { whatsapp });

      setSucesso("✅ WhatsApp atualizado!");
      setWhatsapp("");

    } catch (err) {
      console.log(err);
      setErro("❌ Erro ao salvar WhatsApp");
    }
  }

  // =======================
  // CRIAR PRODUTO
  // =======================
  async function criarProduto() {
    if (!nome || !preco || !imagem) {
      return setErro("⚠️ Preencha todos os campos!");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("preco", preco);
      formData.append("imagem", imagem);

      await axios.post(`${API}/produtos`, formData);

      setSucesso("✅ Produto criado!");

      setNome("");
      setPreco("");
      setImagem(null);
      setPreview(null);

      carregarTudo();

    } catch (err) {
      console.log("ERRO PRODUTO:", err);
      setErro("❌ Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  }

  // =======================
  // DELETAR
  // =======================
  async function deletarProduto(id) {
    if (!window.confirm("Excluir produto?")) return;

    try {
      await axios.delete(`${API}/produtos/${id}`);

      setSucesso("🗑 Produto removido");
      carregarTudo();

    } catch (err) {
      console.log(err);
      setErro("❌ Erro ao deletar");
    }
  }

  // =======================
  // STATUS PEDIDO
  // =======================
  async function atualizarStatus(id, status) {
    const novo = status === "pendente" ? "entregue" : "pendente";

    try {
      await axios.put(`${API}/pedidos/${id}`, { status: novo });
      setSucesso("📦 Status atualizado");
      carregarTudo();

    } catch (err) {
      console.log(err);
      setErro("❌ Erro ao atualizar status");
    }
  }

  // =======================
  // RENDER
  // =======================
  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="header">
        <h1>📊 Painel Administrativo</h1>
        <button className="btn-sair" onClick={logout}>
          Sair
        </button>
      </header>

      {/* 🔥 MENSAGENS CORRIGIDAS */}
      {erro && <p className="msg erro">{erro}</p>}
      {sucesso && <p className="msg sucesso">{sucesso}</p>}

      <div className="grid">

        {/* WHATSAPP */}
        <div className="card full">
          <h2>📱 WhatsApp</h2>

          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="5591999999999"
          />

          <button onClick={salvarWhatsapp}>
            Salvar
          </button>
        </div>

        {/* NOVO PRODUTO */}
        <div className="card full">
          <h2>📦 Novo Produto</h2>

          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              setImagem(file);

              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {preview && (
            <img src={preview} alt="preview" className="preview" />
          )}

          <button onClick={criarProduto} disabled={loading}>
            {loading ? "Enviando..." : "Criar Produto"}
          </button>
        </div>

        {/* PRODUTOS */}
        <div className="card full">
          <h2>📦 Produtos</h2>

          {produtos.length === 0 ? (
            <p>Nenhum produto cadastrado</p>
          ) : (
            produtos.map((p) => (
              <div key={p.id} className="item">
                <img
                  src={p.imagem || "https://via.placeholder.com/50"}
                  alt={p.nome}
                />

                <span>{p.nome}</span>
                <span>R$ {p.preco}</span>

                <button onClick={() => deletarProduto(p.id)}>
                  ❌
                </button>
              </div>
            ))
          )}
        </div>

        {/* PEDIDOS */}
        <div className="card full">
          <h2>🛒 Pedidos</h2>

          {pedidos.length === 0 ? (
            <p>Nenhum pedido ainda</p>
          ) : (
            pedidos.map((p) => (
              <div key={p.id} className="item">
                <div>
                  <strong>{p.nome}</strong>
                  <p>{p.endereco}</p>
                  <small>Status: {p.status}</small>
                </div>

                <div>
                  <span>R$ {p.total}</span>

                  <button onClick={() => atualizarStatus(p.id, p.status)}>
                    {p.status === "pendente" ? "✔ Entregar" : "↩ Reabrir"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Admin;