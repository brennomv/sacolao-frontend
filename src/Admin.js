import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://sacolao-api.onrender.com";

function Admin({ logout }) {
  // =======================
  // STATES
  // =======================
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);

  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [whatsapp, setWhatsapp] = useState("");
  const [salvandoWhatsapp, setSalvandoWhatsapp] = useState(false);

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // =======================
  // INIT (CORRIGIDO)
  // =======================
  useEffect(() => {
    carregarProdutos();
    carregarPedidos();
    carregarConfig();

    const intervalo = setInterval(() => {
      carregarPedidos();
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // =======================
  // LOADERS
  // =======================
  function carregarProdutos() {
    axios.get(`${API}/produtos`)
      .then(res => setProdutos(res.data))
      .catch(() => setMensagem("❌ Erro ao carregar produtos"));
  }

  function carregarPedidos() {
    axios.get(`${API}/pedidos`)
      .then(res => setPedidos(res.data))
      .catch(() => console.log("Erro ao carregar pedidos"));
  }

  function carregarConfig() {
    axios.get(`${API}/config`)
      .then(res => {
        if (res.data?.whatsapp) {
          setWhatsapp(res.data.whatsapp);
        }
      })
      .catch(() => setMensagem("❌ Erro ao carregar config"));
  }

  // =======================
  // WHATSAPP
  // =======================
  function salvarWhatsapp() {
    if (!whatsapp) {
      setMensagem("⚠️ Informe um número válido");
      return;
    }

    setSalvandoWhatsapp(true);
    setMensagem("");

    axios.put(`${API}/config`, { whatsapp })
      .then(() => {
        setMensagem("✅ WhatsApp atualizado com sucesso");

        // 🔥 LIMPA CAMPO
        setWhatsapp("");
      })
      .catch(() => setMensagem("❌ Erro ao salvar WhatsApp"))
      .finally(() => setSalvandoWhatsapp(false));
  }

  // =======================
  // PRODUTOS
  // =======================
  function criarProduto() {
    if (!nome || !preco || !imagem) {
      setMensagem("⚠️ Preencha todos os campos!");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("preco", preco);
    formData.append("imagem", imagem);

    setLoading(true);
    setMensagem("");

    axios.post(`${API}/produtos`, formData)
      .then(() => {
        setMensagem("✅ Produto cadastrado!");

        setNome("");
        setPreco("");
        setImagem(null);
        setPreview(null);

        const input = document.getElementById("inputImagem");
        if (input) input.value = "";

        carregarProdutos();
      })
      .catch(() => setMensagem("❌ Erro ao cadastrar produto"))
      .finally(() => setLoading(false));
  }

  function deletarProduto(id) {
    if (!window.confirm("Excluir produto?")) return;

    axios.delete(`${API}/produtos/${id}`)
      .then(() => {
        setMensagem("🗑 Produto removido");
        carregarProdutos();
      })
      .catch(() => setMensagem("❌ Erro ao deletar"));
  }

  // =======================
  // PEDIDOS
  // =======================
  function atualizarStatus(id, statusAtual) {
    const novoStatus =
      statusAtual === "pendente" ? "entregue" : "pendente";

    axios.put(`${API}/pedidos/${id}`, { status: novoStatus })
      .then(() => {
        setMensagem("📦 Status atualizado");
        carregarPedidos();
      })
      .catch(() => setMensagem("❌ Erro ao atualizar status"));
  }

  // =======================
  // RENDER
  // =======================
  return (
    <div className="admin-container">

      {/* TOPO */}
      <div className="admin-topo">
        <h1>🧑‍💼 Painel Admin</h1>

        <button className="btn-sair" onClick={logout}>
          ⬅ Sair
        </button>
      </div>

      {/* MENSAGEM */}
      {mensagem && (
        <p style={{ fontWeight: "bold", margin: "10px 0" }}>
          {mensagem}
        </p>
      )}

      {/* WHATSAPP */}
      <div className="card-admin">
        <h2>📱 WhatsApp de Pedidos</h2>

        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="Ex: 5591999999999"
        />

        <button onClick={salvarWhatsapp} disabled={salvandoWhatsapp}>
          {salvandoWhatsapp ? "Salvando..." : "Salvar Número"}
        </button>
      </div>

      {/* CADASTRO */}
      <div className="card-admin">
        <h2>📦 Cadastrar Produto</h2>

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
          id="inputImagem"
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
          <img
            src={preview}
            alt="preview"
            style={{
              width: "100px",
              marginTop: "10px",
              borderRadius: "8px"
            }}
          />
        )}

        <button onClick={criarProduto} disabled={loading}>
          {loading ? "Enviando..." : "Criar Produto"}
        </button>
      </div>

      {/* PRODUTOS */}
      <div className="card-admin">
        <h2>📦 Produtos</h2>

        {produtos.map((p) => (
          <div key={p.id} className="item-admin">
            <img
              src={p.imagem}
              alt=""
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "6px"
              }}
            />
            <span>{p.nome}</span>
            <span>R$ {p.preco}</span>

            <button onClick={() => deletarProduto(p.id)}>
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* PEDIDOS */}
      <div className="card-admin">
        <h2>🛒 Pedidos</h2>

        {pedidos.map((p) => (
          <div
            key={p.id}
            className="item-admin"
            style={{
              borderLeft: `6px solid ${
                p.status === "pendente" ? "orange" : "green"
              }`
            }}
          >
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
        ))}
      </div>

    </div>
  );
}

export default Admin;