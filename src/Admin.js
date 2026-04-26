import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function Admin({ logout }) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);

  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // =======================
  // CARREGAR DADOS
  // =======================
  useEffect(() => {
    carregarProdutos();
    carregarPedidos();
  }, []);

  function carregarProdutos() {
    axios
      .get("https://sacolao-api.onrender.com/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.log(err));
  }

  function carregarPedidos() {
    axios
      .get("https://sacolao-api.onrender.com/pedidos")
      .then((res) => setPedidos(res.data))
      .catch((err) => console.log(err));
  }

  // =======================
  // CRIAR PRODUTO
  // =======================
  function criarProduto(e) {
    if (e) e.preventDefault();

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

    axios
      .post("https://sacolao-api.onrender.com/produtos", formData)
      .then(() => {
        setMensagem("✅ Produto cadastrado com sucesso!");

        // LIMPAR CAMPOS
        setNome("");
        setPreco("");
        setImagem(null);
        setPreview(null);

        const input = document.getElementById("inputImagem");
        if (input) input.value = "";

        carregarProdutos();
      })
      .catch(() => {
        setMensagem("❌ Erro ao cadastrar produto");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // =======================
  // DELETAR PRODUTO
  // =======================
  function deletarProduto(id) {
    if (!window.confirm("Deseja realmente excluir?")) return;

    axios
      .delete(`https://sacolao-api.onrender.com/produtos/${id}`)
      .then(() => {
        carregarProdutos();
      })
      .catch(() => {
        setMensagem("❌ Erro ao deletar produto");
      });
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
        <p style={{ margin: "10px 0", fontWeight: "bold" }}>
          {mensagem}
        </p>
      )}

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

        {/* PREVIEW */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{
              width: "120px",
              marginTop: "10px",
              borderRadius: "8px"
            }}
          />
        )}

        {/* BOTÃO */}
        <button onClick={criarProduto} disabled={loading}>
          {loading ? "Enviando..." : "Criar Produto"}
        </button>
      </div>

      {/* PRODUTOS */}
      <div className="card-admin">
        <h2>📦 Produtos</h2>

        {produtos.map((p) => (
          <div key={p.id} className="item-admin" style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            <img
              src={p.imagem}
              alt={p.nome}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "6px"
              }}
            />

            <span>{p.nome}</span>
            <span>R$ {p.preco}</span>

            <button
              onClick={() => deletarProduto(p.id)}
              style={{ marginLeft: "auto" }}
            >
              ❌
            </button>

          </div>
        ))}
      </div>

      {/* PEDIDOS */}
      <div className="card-admin">
        <h2>🛒 Pedidos</h2>

        {pedidos.map((p) => (
          <div key={p.id} className="item-admin">

            <div>
              <strong>{p.nome}</strong>
              <p>{p.endereco}</p>
            </div>

            <span>R$ {p.total}</span>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Admin;