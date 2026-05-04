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
  const [taxaEntrega, setTaxaEntrega] = useState(3);
  const [valorMinimoFreteGratis, setValorMinimoFreteGratis] = useState(50);

  const [editando, setEditando] = useState(null);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarTudo();
  }, []);

  useEffect(() => {
    if (erro || sucesso) {
      const timer = setTimeout(() => {
        setErro("");
        setSucesso("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [erro, sucesso]);

  async function carregarTudo() {
    try {
      const [resProdutos, resPedidos, resConfig] = await Promise.all([
        axios.get(`${API}/produtos`),
        axios.get(`${API}/pedidos`),
        axios.get(`${API}/config`)
      ]);

      setProdutos(resProdutos.data || []);
      setPedidos(resPedidos.data || []);

      if (resConfig.data) {
        setWhatsapp(resConfig.data.whatsapp || "");
        setTaxaEntrega(resConfig.data.taxaEntrega || 3);
        setValorMinimoFreteGratis(resConfig.data.valorMinimoFreteGratis || 50);
      }

    } catch (err) {
      setErro("❌ Erro ao carregar dados");
    }
  }

  async function salvarConfig() {
    try {
      await axios.put(`${API}/config`, {
        whatsapp,
        taxaEntrega: Number(taxaEntrega),
        valorMinimoFreteGratis: Number(valorMinimoFreteGratis)
      });

      setSucesso("✅ Configurações salvas!");
    } catch {
      setErro("❌ Erro ao salvar configurações");
    }
  }

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
      limparFormulario();
      carregarTudo();

    } catch {
      setErro("❌ Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  }

  function editarProduto(p) {
    setEditando(p);
    setNome(p.nome);
    setPreco(p.preco);
    setPreview(p.imagem || null);
  }

  async function atualizarProduto() {
    if (!nome || !preco) {
      return setErro("⚠️ Nome e preço são obrigatórios");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("preco", preco);

      if (imagem) {
        formData.append("imagem", imagem);
      }

      await axios.put(`${API}/produtos/${editando.id}`, formData);

      setSucesso("✏️ Produto atualizado!");
      limparFormulario();
      carregarTudo();

    } catch {
      setErro("❌ Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  }

  function limparFormulario() {
    setNome("");
    setPreco("");
    setImagem(null);
    setPreview(null);
    setEditando(null);
  }

  async function deletarProduto(id) {
    if (!window.confirm("Excluir produto?")) return;

    try {
      await axios.delete(`${API}/produtos/${id}`);
      setSucesso("🗑 Produto removido");
      carregarTudo();

    } catch {
      setErro("❌ Erro ao deletar");
    }
  }

  async function atualizarStatus(id, status) {
    const novo = status === "pendente" ? "entregue" : "pendente";

    try {
      await axios.put(`${API}/pedidos/${id}`, { status: novo });
      setSucesso("📦 Status atualizado");
      carregarTudo();

    } catch {
      setErro("❌ Erro ao atualizar status");
    }
  }

  return (
    <div className="dashboard">

      <header className="header">
        <h1>📊 Painel Administrativo</h1>
        <button className="btn-sair" onClick={logout}>Sair</button>
      </header>

      {erro && <p className="msg erro">{erro}</p>}
      {sucesso && <p className="msg sucesso">{sucesso}</p>}

      <div className="grid">

        {/* CONFIG */}
        <div className="card full">
          <h2>⚙️ Configurações</h2>

          <div className="config-group">
            <label>WhatsApp</label>
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div className="config-row">
            <div className="config-group">
              <label>Taxa de entrega (R$)</label>
              <input
                type="number"
                value={taxaEntrega}
                onChange={(e) => setTaxaEntrega(e.target.value)}
              />
            </div>

            <div className="config-group">
              <label>Frete grátis acima de</label>
              <input
                type="number"
                value={valorMinimoFreteGratis}
                onChange={(e) => setValorMinimoFreteGratis(e.target.value)}
              />
            </div>
          </div>

          <p className="config-info">
            Acima de <strong>R$ {valorMinimoFreteGratis}</strong> → frete grátis | 
            abaixo → R$ {taxaEntrega}
          </p>

          <button className="btn-primary" onClick={salvarConfig}>
            Salvar Configurações
          </button>
        </div>

        {/* PRODUTO */}
        <div className="card full">
          <h2>{editando ? "✏️ Editar Produto" : "📦 Novo Produto"}</h2>

        <div className="config-row">
        <div className="config-group">
          <label>Nome</label>
            <input
              placeholder="Nome do produto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="config-group">
          <label>Preço (R$)</label>
          <input
            type="number"
            placeholder="0.00"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>
      </div>

      <div className="config-group">
        <label>Imagem do produto</label>
        <input
          type="file"
          onChange={(e) => {
        const file = e.target.files[0];
        setImagem(file);
        if (file) setPreview(URL.createObjectURL(file));
      }}
    />
  </div>

  {preview && (
    <img src={preview} alt="preview" className="preview" />
  )}

  <button
  className="btn-primary btn-spacing"
  onClick={editando ? atualizarProduto : criarProduto}
  disabled={loading}
>
    {loading
      ? "Salvando..."
      : editando
      ? "Atualizar Produto"
      : "Criar Produto"}
  </button>

  {editando && (
    <button className="btn-secondary" onClick={limparFormulario}>
      Cancelar edição
    </button>
  )}
</div>

        {/* LISTA */}
        <div className="card full">
          <h2>📦 Produtos</h2>

          {produtos.map((p) => (
            <div key={p.id} className="item">
              <img src={p.imagem} alt={p.nome} />
              <span>{p.nome}</span>
              <span>R$ {p.preco}</span>

              <div style={{ display: "flex", gap: "5px" }}>
                <button onClick={() => editarProduto(p)}>✏️</button>
                <button onClick={() => deletarProduto(p.id)}>❌</button>
              </div>
            </div>
          ))}
        </div>

        {/* PEDIDOS */}
        <div className="card full">
          <h2>🛒 Pedidos</h2>

          {pedidos.map((p) => (
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
          ))}
        </div>

      </div>
    </div>
  );
}

export default Admin;