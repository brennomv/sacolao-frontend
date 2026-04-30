import { useEffect } from "react";
import "./App.css";

function Cliente({
  produtos,
  carrinho,
  adicionar,
  aumentar,
  diminuir,
  nome,
  setNome,
  endereco,
  setEndereco,
  total,
  finalizarPedido,
  abrirCarrinho,
  setAbrirCarrinho,
  logo,
  logout
}) {

  // =======================
  // UX: FECHAR COM ESC
  // =======================
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        setAbrirCarrinho(false);
      }
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setAbrirCarrinho]);

  // TOTAL DE ITENS NO CARRINHO
  const totalItens = carrinho.reduce((acc, p) => acc + p.quantidade, 0);

  return (
    <div className="container">

      {/* BACKDROP */}
      {abrirCarrinho && (
        <div
          className="backdrop"
          onClick={() => setAbrirCarrinho(false)}
        />
      )}

      {/* BOTÃO SAIR */}
      <button className="btn-sair-cliente" onClick={logout}>
        ⬅ Sair
      </button>

      {/* LOGO */}
      <div className="topo-central">
        <img src={logo} alt="logo" className="logo" />
      </div>

      {/* BARRA */}
      <div className="barra-ofertas">
        <h2 className="titulo-ofertas">🔥 Ofertas</h2>

        <div
          className="carrinho-icon"
          onClick={() => setAbrirCarrinho(true)}
        >
          🛒 {totalItens}
        </div>
      </div>

      {/* DESTAQUES */}
      <div className="produtos">
        {produtos.slice(0, 3).map((p) => (
          <div key={p.id} className="card">

            <img
              src={p.imagem || "https://via.placeholder.com/120"}
              alt={p.nome}
              className="img-produto"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/120";
              }}
            />

            <div className="info">
              <h3>{p.nome}</h3>
              <p className="preco">R$ {Number(p.preco).toFixed(2)}</p>
            </div>

            <button
              className="btn-produto"
              onClick={() => adicionar(p)}
            >
              + Adicionar
            </button>

          </div>
        ))}
      </div>

      {/* LISTA */}
      <h2 style={{ marginTop: "25px" }}>🛒 Produtos</h2>

      <div className="produtos">
        {produtos.slice(3).map((p) => (
          <div key={p.id} className="card">

            <img
              src={p.imagem || "https://via.placeholder.com/120"}
              alt={p.nome}
              className="img-produto"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/120";
              }}
            />

            <div className="info">
              <h3>{p.nome}</h3>
              <p className="preco">R$ {Number(p.preco).toFixed(2)}</p>
            </div>

            <button
              className="btn-produto"
              onClick={() => adicionar(p)}
            >
              + Adicionar
            </button>

          </div>
        ))}
      </div>

      {/* =======================
         CARRINHO LATERAL
      ======================= */}
      <div className={`cart-panel ${abrirCarrinho ? "open" : ""}`}>

        {/* HEADER */}
        <div className="cart-header">
          <h2>🛒 Carrinho</h2>

          <button
            className="btn-fechar"
            onClick={() => setAbrirCarrinho(false)}
          >
            ✖
          </button>
        </div>

        {/* LISTA ITENS */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {carrinho.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Seu carrinho está vazio
            </p>
          ) : (
            carrinho.map((p) => (
              <div key={p.id} className="item-carrinho">
                <span>{p.nome}</span>

                <div className="qty">
                  <button onClick={() => diminuir(p.id)}>➖</button>
                  <span>{p.quantidade}</span>
                  <button onClick={() => aumentar(p.id)}>➕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER FIXO */}
        <div style={{ marginTop: "10px" }}>

          <input
            className="input-cliente"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            className="input-cliente"
            placeholder="Endereço de entrega"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />

          <h3 style={{ marginTop: "10px" }}>
            Total: R$ {total.toFixed(2)}
          </h3>

          <button
            className="finalizar-btn"
            onClick={finalizarPedido}
            disabled={carrinho.length === 0}
          >
            Finalizar Pedido
          </button>

        </div>

      </div>

    </div>
  );
}

export default Cliente;