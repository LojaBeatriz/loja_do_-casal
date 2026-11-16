
(() => {
  const cfg = window.BIONEON_CONFIG;
  const money = value =>
    Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: cfg.currency
    });

  function openWhatsApp(message) {
    const number = String(cfg.whatsapp || "").replace(/\D/g, "");

    if (!number || number === "5511999999999") {
      alert("Configure o WhatsApp no arquivo js/config.js.");
      return;
    }

    const url = "https://wa.me/" + number +
      "?text=" + encodeURIComponent(message);

    window.location.href = url;
  }

  const grid = document.getElementById("product-grid");

  if (grid) {
    grid.innerHTML = cfg.products.map(product => `
      <article class="product-card">
        <div class="product-art">${product.symbol}</div>
        <span class="tag">${product.type}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price">${money(product.price)}</div>
        <a class="btn" href="personalizar.html?produto=${encodeURIComponent(product.id)}">
          Escolher modelo
        </a>
      </article>
    `).join("");
  }

  const params = new URLSearchParams(location.search);
  const id = params.get("produto");
  const product = cfg.products.find(item => item.id === id);

  const selected = document.getElementById("selected-product");

  if (selected) {
    if (product) {
      selected.textContent =
        `${product.name} · ${product.type} · ${money(product.price)}`;
    } else {
      selected.textContent =
        "Nenhum modelo selecionado. Volte e escolha um modelo.";
    }
  }

  const form = document.getElementById("order-form");

  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      if (!product) {
        alert("Escolha um modelo antes de continuar.");
        return;
      }

      const data = Object.fromEntries(
        new FormData(form).entries()
      );

      const order = "BN-" + Date.now().toString().slice(-8);

      const message = [
        "Olá! Quero fazer um pedido no BioNeon.",
        "",
        "Pedido: " + order,
        "Modelo: " + product.name,
        "Categoria: " + product.type,
        "Valor: " + money(product.price),
        "Cliente: " + data.name,
        "Nome na bio: " + data.displayName,
        "Instagram: " + (data.instagram || "Não informado"),
        "TikTok: " + (data.tiktok || "Não informado"),
        "YouTube: " + (data.youtube || "Não informado"),
        "Outro link: " + (data.other || "Não informado"),
        "Cor: " + data.color,
        "Observações: " + (data.notes || "Nenhuma"),
        "",
        "Quero combinar o pagamento e a entrega."
      ].join("\n");

      openWhatsApp(message);
    });
  }

  document.querySelectorAll("[data-whatsapp]").forEach(button => {
    button.addEventListener("click", () => {
      openWhatsApp("Olá! Preciso de ajuda com o BioNeon.");
    });
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
