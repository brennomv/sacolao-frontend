import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function Admin({ logout }) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);

  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

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
      alert("Preencha todos os campos!");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("preco", preco);
    formData.append("imagem", imagem);

    axios
      .post("https://sacolao-api.onrender.com/produtos", formData)
      .then(() => {
        alert("Produto cadastrado com sucesso!");

        // LIMPAR CAMPOS
        setNome("");
        setPreco("");
        setImagem(null);
        document.getElementById("inputImagem").value = "";

        carregarProdutos();
      })
      .catch(() => {
        alert("Erro ao cadastrar produto");
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
          accept="image/*"
          onChange={(e) => setImagem(e.target.files[0])}
        />

        <button type="button" onClick={criarProduto}>
          Criar Produto
        </button>
      </div>

      {/* PRODUTOS */}
      <div className="card-admin">
        <h2>📦 Produtos</h2>

        {produtos.map((p) => (
          <div key={p.id} className="item-admin">
            <img
              src={p.imagem}
              alt={p.nome}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                marginRight: "10px"
              }}
            />

            <span>{p.nome}</span>
            <span>R$ {p.preco}</span>
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