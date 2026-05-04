import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://sacolao-api.onrender.com";

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

  const [taxaEntrega, setTaxaEntrega] = useState(3);
  const [freteGratis, setFreteGratis] = useState(50);

  // =======================
  // 🔥 BUSCAR CONFIG
  // =======================
  useEffect(() => {
    axios.get(`${API}/config`)
      .then((res) => {
        if (res.data) {
          setTaxaEntrega(Number(res.data.taxaEntrega || 3));
          setFreteGratis(Number(res.data.valorMinimoFreteGratis || 50));
        }
      })
      .catch(() => console.log("Erro ao carregar config"));
  }, []);

  // =======================
  // ESC FECHAR
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

  // =======================
  // TOTAIS
  // =======================
  const totalItens = carrinho.reduce((acc, p) => acc + p.quantidade, 0);

  const frete = total >= freteGratis ? 0 : taxaEntrega;
  const totalFinal = total + frete;

  // 🔥 FALTA PARA FRETE GRÁTIS
  const faltaFrete = freteGratis - total;

  return (
    <div className="container">

      {/* BACKDROP */}
      {abrirCarrinho && (
        <div
          className="backdrop"
          onClick={() => setAbrirCarrinho(false)}
        />
      )}

      {/* SAIR */}
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
         🛒 CARRINHO
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

        {/* LISTA */}
        <div className="cart-items">
          {carrinho.length === 0 ? (
            <p className="empty-cart">
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

        {/* FOOTER */}
        <div className="cart-footer">

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

          {/* RESUMO */}
          <div className="resumo">

            <p>
              Subtotal <span>R$ {total.toFixed(2)}</span>
            </p>

            <p>
              Entrega{" "}
              <span>
                {frete === 0
                  ? "Grátis 🎉"
                  : `R$ ${frete.toFixed(2)}`}
              </span>
            </p>

            {/* 🔥 FALTA PARA FRETE */}
            {frete !== 0 && (
              <p className="frete-info">
                💡 Faltam <strong>R$ {faltaFrete.toFixed(2)}</strong> para frete grátis
              </p>
            )}

            {frete === 0 && (
              <p className="frete-ok">
                🚀 Você ganhou frete grátis!
              </p>
            )}

            <h3>
              Total <span>R$ {totalFinal.toFixed(2)}</span>
            </h3>

          </div>

          <button
            className="finalizar-btn"
            onClick={() => finalizarPedido(totalFinal)}
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