const semAnimacao = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Topo: fica preto quando a abertura sai da tela
const topo = document.getElementById("topo");
const abertura = document.querySelector(".abertura");

new IntersectionObserver(
  ([item]) => topo.classList.toggle("topo-solido", !item.isIntersecting),
  { rootMargin: `-${topo.offsetHeight}px 0px 0px 0px` }
).observe(abertura);

// Menu do celular: abre pelo botão e fecha ao escolher um link ou apertar Esc
const botaoMenu = document.getElementById("topo-menu");

function marcarMenu(aberto) {
  topo.classList.toggle("topo-aberto", aberto);
  botaoMenu.setAttribute("aria-expanded", String(aberto));
  botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
}

botaoMenu.addEventListener("click", () => marcarMenu(!topo.classList.contains("topo-aberto")));
document.getElementById("topo-nav").addEventListener("click", (e) => {
  if (e.target.closest("a")) marcarMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") marcarMenu(false);
});

// Faixas: o grupo é duplicado para o movimento não ter emenda.
// Sem JavaScript, ou com animação reduzida, viram faixas de rolagem manual.
const faixas = document.querySelector(".faixas");
const pausar = document.getElementById("faixas-pausar");

if (!semAnimacao) {
  for (const trilho of faixas.querySelectorAll(".faixa-trilho")) {
    // Em telas largas, repete as imagens até o grupo cobrir a tela inteira
    const grupo = trilho.firstElementChild;
    const originais = [...grupo.children];
    const largura = Math.max(innerWidth, screen.width);
    while (grupo.offsetWidth > 0 && grupo.offsetWidth < largura) {
      for (const cartao of originais) {
        const repetido = cartao.cloneNode(true);
        repetido.setAttribute("aria-hidden", "true");
        for (const img of repetido.querySelectorAll("img")) img.alt = "";
        grupo.append(repetido);
      }
    }

    const copia = grupo.cloneNode(true);
    copia.setAttribute("aria-hidden", "true");
    for (const img of copia.querySelectorAll("img")) img.alt = "";
    trilho.append(copia);
  }
  faixas.classList.add("faixas-animadas");
  pausar.hidden = false;

  pausar.addEventListener("click", () => {
    const pausado = faixas.classList.toggle("faixas-pausadas");
    pausar.setAttribute("aria-pressed", String(pausado));
    pausar.textContent = pausado ? "Continuar imagens" : "Pausar imagens";
  });
}

// Vídeos: sem som, tocam só enquanto aparecem na tela. Com animação reduzida, fica a imagem parada.
if (!semAnimacao) {
  const observador = new IntersectionObserver((itens) => {
    for (const { target: video, isIntersecting } of itens) {
      const pausado = video.closest(".faixas-pausadas");
      if (isIntersecting && !pausado) video.play().catch(() => {});
      else video.pause();
    }
  }, { threshold: 0.1 });

  for (const video of document.querySelectorAll(".video-auto")) {
    video.muted = true;
    observador.observe(video);
  }

  pausar.addEventListener("click", () => {
    const pausado = faixas.classList.contains("faixas-pausadas");
    for (const video of faixas.querySelectorAll(".video-auto")) {
      if (pausado) video.pause();
      else if (video.getBoundingClientRect().right > 0 && video.getBoundingClientRect().left < innerWidth) video.play().catch(() => {});
    }
  });
}

// Selo: acompanha o mouse com atraso, sem sair de perto da posição original
const selo = document.getElementById("selo");

if (!semAnimacao && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const ALCANCE = 90;
  const alvo = { x: 0, y: 0 };
  const atual = { x: 0, y: 0 };
  let quadro = null;

  function mover() {
    atual.x += (alvo.x - atual.x) * 0.08;
    atual.y += (alvo.y - atual.y) * 0.08;
    selo.style.transform = `translate(${atual.x.toFixed(1)}px, ${atual.y.toFixed(1)}px)`;
    const parado = Math.abs(alvo.x - atual.x) < 0.1 && Math.abs(alvo.y - atual.y) < 0.1;
    quadro = parado ? null : requestAnimationFrame(mover);
  }

  function animar() {
    if (quadro === null) quadro = requestAnimationFrame(mover);
  }

  abertura.addEventListener("pointermove", (evento) => {
    const caixa = selo.getBoundingClientRect();
    const dx = evento.clientX - (caixa.left + caixa.width / 2 - atual.x);
    const dy = evento.clientY - (caixa.top + caixa.height / 2 - atual.y);
    const distancia = Math.hypot(dx, dy) || 1;
    const passo = Math.min(ALCANCE, distancia * 0.25);
    alvo.x = (dx / distancia) * passo;
    alvo.y = (dy / distancia) * passo;
    animar();
  });

  abertura.addEventListener("pointerleave", () => {
    alvo.x = 0;
    alvo.y = 0;
    animar();
  });
}
