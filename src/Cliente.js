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

      {/* LOGO CENTRAL */}
      <div className="topo-central">
        <img src={logo} alt="logo" className="logo" />
      </div>

      {/* BARRA OFERTAS + CARRINHO */}
      <div className="barra-ofertas">

        <h2 className="titulo-ofertas">🔥 Ofertas</h2>

        <div
          className="carrinho-icon"
          onClick={() => setAbrirCarrinho(true)}
        >
          🛒 {carrinho.length}
        </div>

      </div>

      {/* PRODUTOS DESTAQUE */}
      <div className="produtos">
        {produtos.slice(0, 3).map((p) => (
          <div key={p.id} className="card">

            <img
              src={p.imagem}
              alt={p.nome}
              className="imagem-produto"
            />

            <div className="info">
              <h3>{p.nome}</h3>
              <p className="preco">R$ {p.preco}</p>
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

      {/* PRODUTOS */}
      <h2>🛒 Produtos</h2>

      <div className="produtos">
        {produtos.slice(3).map((p) => (
          <div key={p.id} className="card">

            <img
              src={p.imagem}
              alt={p.nome}
              className="imagem-produto"
            />

            <div className="info">
              <h3>{p.nome}</h3>
              <p className="preco">R$ {p.preco}</p>
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

      {/* CARRINHO LATERAL */}
      <div className={`cart-panel ${abrirCarrinho ? "open" : ""}`}>

        <div className="cart-header">
          <h2>🛒 Carrinho</h2>

          <button
            className="btn-fechar"
            onClick={() => setAbrirCarrinho(false)}
          >
            ✖
          </button>
        </div>

        {carrinho.length === 0 ? (
          <p>Seu carrinho está vazio</p>
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

        <h3>Total: R$ {total.toFixed(2)}</h3>

        <button
          className="finalizar-btn"
          onClick={finalizarPedido}
        >
          Finalizar Pedido
        </button>

      </div>

    </div>
  );
}

export default Cliente;