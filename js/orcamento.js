// Interface do funil de orçamento: uma pergunta por vez, respostas só em memória.
window.enviarParaGoogle = async function (pedido, opcoes = {}) {
  const url = (window.FUNIL_CONFIG || {}).urlEnvio;
  if (!url) throw new Error("URL de envio não configurada");
  // Texto simples evita a verificação prévia do navegador, que o Apps Script não atende.
  const resposta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(pedido),
    signal: opcoes.signal,
  });
  if (!resposta.ok) throw new Error(`Resposta ${resposta.status}`);
  return resposta.json();
};

window.iniciarFunil = function (raiz, opcoes) {
  const L = window.FunilLogica;
  const C = window.FUNIL_CONTEUDO;
  const FOTOS = "img/funil/";
  const WHATSAPP = "https://wa.me/5521971443609";
  const MAX_ARQUIVOS = 3;
  // O tipo vem da extensão já validada: nem todo navegador informa o tipo do arquivo.
  const TIPOS_POR_EXTENSAO = { pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };
  const enviar = opcoes.enviar || window.enviarParaGoogle;
  const tempoLimite = opcoes.tempoLimite || 120000;
  const inicio = Date.now();

  const respostas = {
    perfil: "",
    nome: "",
    whatsapp: "",
    email: "",
    ambientes: [],
    outroTexto: "",
    local: "",
    faixa: "",
    prazo: "",
    caminho: "",
    periodoVisita: "",
    arquivos: [],
    consentimento: false,
  };

  const inicial = L.ambienteDaUrl(opcoes.busca || "");
  if (inicial) respostas.ambientes = [inicial];

  let indice = 0;
  let alertaAtual = null;
  let iscaAtual = null;
  let enviando = false;

  function h(tag, props = {}, ...filhos) {
    const el = document.createElement(tag);
    for (const [chave, valor] of Object.entries(props)) {
      if (chave === "class") el.className = valor;
      else if (chave.startsWith("on")) el.addEventListener(chave.slice(2), valor);
      else if (chave === "hidden") el.hidden = valor;
      else el.setAttribute(chave, valor);
    }
    el.append(...filhos);
    return el;
  }

  function botaoOpcao(valor, titulo, marcado, aoClicar, cartao) {
    const tituloEl = h("span", { class: "funil-opcao-titulo", "data-opcao-titulo": "" }, titulo);
    const filhos = cartao
      ? [
        h("span", { class: "funil-opcao-marca", "aria-hidden": "true" }, "✓"),
        tituloEl,
        h("span", { class: "funil-opcao-texto", "data-opcao-texto": "" }, cartao.texto),
      ]
      : [tituloEl];
    return h("button", {
      type: "button",
      class: cartao ? "funil-opcao funil-cartao" : "funil-opcao",
      "data-valor": valor,
      "aria-pressed": String(marcado),
      onclick: aoClicar,
    }, ...filhos);
  }

  function nomesDosAmbientes() {
    return respostas.ambientes.map((id) => L.AMBIENTES.find((a) => a.id === id).nome).join(", ");
  }

  // Só textContent: as respostas digitadas nunca viram HTML.
  function resumoEl(etapaAtual) {
    const itens = [
      ["perfil", "Perfil", respostas.perfil],
      ["ambientes", "Ambientes", nomesDosAmbientes()],
      ["local", "Local", respostas.local.trim()],
      ["investimento", "Investimento", respostas.faixa],
      ["prazo", "Prazo", respostas.prazo],
    ].filter(([id, , valor]) => valor && id !== etapaAtual);
    if (itens.length === 0) return [];
    return [h("section", { class: "funil-resumo", "data-resumo": "", "aria-label": "Seu projeto até aqui" },
      h("h2", {}, "Seu projeto até aqui"),
      h("dl", {}, ...itens.map(([, rotulo, valor]) => h("div", {}, h("dt", {}, rotulo), h("dd", {}, valor)))))];
  }

  function comoFuncionaEl() {
    return h("section", { class: "funil-bloco", "aria-label": "Como funciona" },
      h("h2", {}, "Como funciona"),
      h("ol", { class: "funil-passos", "data-como-funciona": "" }, ...C.comoFunciona.map((passo) =>
        h("li", {}, h("strong", {}, passo.titulo), h("span", {}, passo.texto)))));
  }

  function galeriaEl() {
    return h("ul", { class: "funil-galeria", "data-galeria": "", "aria-label": "Projetos da Casa Fator" }, ...C.galeria.map((item) =>
      h("li", {}, h("img", { src: item.foto, alt: "" }), h("span", {}, item.legenda))));
  }

  function campoTexto(chave, rotulo, tipo, autocomplete) {
    const id = `funil-${chave}`;
    return h("div", { class: "funil-campo" },
      h("label", { for: id }, rotulo),
      (() => {
        const entrada = h("input", {
          id,
          type: tipo,
          autocomplete,
          oninput: (e) => { respostas[chave] = e.target.value; },
        });
        entrada.value = respostas[chave];
        return entrada;
      })());
  }

  const avancarPara = () => { indice += 1; desenhar(true); };

  function opcoesSimples(chave, lista) {
    return h("div", { class: "funil-opcoes funil-cartoes" }, ...lista.map((item) =>
      botaoOpcao(item.valor, item.valor, respostas[chave] === item.valor, () => {
        respostas[chave] = item.valor;
        avancarPara();
      }, item)));
  }

  const validarTexto = (chave, mensagem) => (respostas[chave].trim() ? null : mensagem);

  const ETAPAS = [
    {
      id: "perfil",
      titulo: "Para quem é o projeto?",
      frase: "Vamos planejar o seu projeto",
      foto: "gen-cozinha-nogueira.jpg",
      campos: () => [opcoesSimples("perfil", C.perfis)],
      validar: () => validarTexto("perfil", "Escolha uma opção para continuar."),
    },
    {
      id: "nome",
      titulo: "Qual é o seu nome completo?",
      frase: "Conte um pouco sobre você",
      ajuda: "Assim o projetista já sabe com quem vai falar.",
      foto: "gen-closet-escuro.jpg",
      campos: () => [campoTexto("nome", "Nome completo", "text", "name")],
      validar: () => validarTexto("nome", "Informe o seu nome."),
    },
    {
      id: "whatsapp",
      titulo: "Qual é o seu WhatsApp?",
      frase: "Para falarmos com você",
      ajuda: "Usamos só para falar sobre o seu pedido.",
      foto: "gen-acabamento.jpg",
      campos: () => [campoTexto("whatsapp", "WhatsApp com DDD", "tel", "tel")],
      validar: () => (L.normalizarWhatsapp(respostas.whatsapp) ? null : "Informe o WhatsApp com DDD, como (21) 90000-0000."),
    },
    {
      id: "email",
      titulo: "Para qual e-mail enviamos o orçamento?",
      frase: "Resposta em até 10 dias úteis",
      ajuda: "O orçamento chega neste e-mail em 3 a 5 dias úteis, para até 2 ambientes, ou em 7 a 10 dias úteis, podendo ser menos, para 3 ou mais.",
      foto: "gen-closet-iluminado.jpg",
      campos: () => [campoTexto("email", "E-mail", "email", "email")],
      validar: () => (L.emailValido(respostas.email) ? null : "Informe um e-mail válido, como nome@exemplo.com."),
    },
    {
      id: "ambientes",
      titulo: "Quais ambientes vão ganhar móveis novos?",
      dica: "Você pode escolher mais de uma opção.",
      frase: "Cada ambiente feito sob medida",
      foto: "gen-cozinha-clara.jpg",
      campos: camposAmbientes,
      validar: () => {
        if (respostas.ambientes.length === 0) return "Escolha pelo menos um ambiente.";
        if (respostas.ambientes.includes("outro") && !respostas.outroTexto.trim()) return "Conte qual é o outro ambiente.";
        return null;
      },
    },
    {
      id: "local",
      titulo: "Onde fica o imóvel?",
      frase: "Atendemos o Rio de Janeiro e região",
      ajuda: "Atendemos o Rio de Janeiro e região, em casas, apartamentos e empresas.",
      foto: "gen-closet-azul.jpg",
      campos: () => [campoTexto("local", "Bairro e cidade", "text", "address-level2")],
      validar: () => validarTexto("local", "Informe o bairro e a cidade."),
    },
    {
      id: "investimento",
      titulo: "Quanto você deseja investir no seu projeto?",
      dica: "Escolha uma opção. Ela é só uma referência para o projetista, não um orçamento.",
      frase: "Um projeto do tamanho do seu plano",
      foto: "gen-cozinha-janela.jpg",
      campos: () => [h("div", { class: "funil-opcoes funil-cartoes funil-cartoes-tres" }, ...L.calcularFaixas(respostas.ambientes).map((faixa) =>
        botaoOpcao(faixa.id, faixa.texto, respostas.faixa === faixa.texto, () => {
          respostas.faixa = faixa.texto;
          avancarPara();
        }, C.faixas[faixa.id])))],
      validar: () => validarTexto("faixa", "Escolha uma opção para continuar."),
    },
    {
      id: "prazo",
      titulo: "Para quando você quer os móveis prontos e instalados?",
      frase: "Do projeto à entrega",
      foto: "gen-closet-corredor.jpg",
      campos: () => [opcoesSimples("prazo", C.prazos)],
      validar: () => validarTexto("prazo", "Escolha uma opção para continuar."),
    },
    {
      id: "planta",
      titulo: "Você tem a planta do imóvel?",
      dica: "Com a planta, o orçamento fica mais rápido e fácil.",
      frase: "Falta pouco",
      foto: "gen-closet-madeira.jpg",
      campos: camposPlanta,
      validar: () => {
        if (!respostas.caminho) return "Escolha uma das opções.";
        if (respostas.caminho === "visita" && !respostas.periodoVisita) return "Escolha o período de preferência para a visita.";
        if (!respostas.consentimento) return "Para enviar, marque que você concorda com a política de privacidade.";
        return null;
      },
      campoComErro: (formulario) => (respostas.consentimento ? null : formulario.querySelector("[data-consentimento]")),
      textoBotao: "Enviar pedido",
      acaoBotao: "enviar",
      concluir: (botao) => enviarPedido(botao),
    },
  ];

  function camposAmbientes() {
    const entrada = h("input", {
      id: "funil-outro",
      type: "text",
      "data-outro": "",
      oninput: (e) => { respostas.outroTexto = e.target.value; },
    });
    entrada.value = respostas.outroTexto;
    const campoOutro = h("div", { class: "funil-campo", hidden: !respostas.ambientes.includes("outro") },
      h("label", { for: "funil-outro" }, "Qual ambiente?"), entrada);

    const detalhes = h("section", { class: "funil-resumo funil-detalhes", "data-detalhes": "", "aria-live": "polite" });
    const desenharDetalhes = () => {
      detalhes.hidden = respostas.ambientes.length === 0;
      detalhes.replaceChildren(
        h("h2", {}, "Para adiantar o seu projeto"),
        h("dl", {}, ...respostas.ambientes.map((id) => h("div", {},
          h("dt", {}, L.AMBIENTES.find((a) => a.id === id).nome),
          h("dd", {}, C.ambientes[id].dica)))));
    };
    desenharDetalhes();

    const botoes = L.AMBIENTES.map((a) => botaoOpcao(a.id, a.nome, respostas.ambientes.includes(a.id), () => {
      respostas.ambientes = L.alternarAmbiente(respostas.ambientes, a.id);
      respostas.faixa = ""; // as faixas dependem dos ambientes
      for (const b of botoes) b.setAttribute("aria-pressed", String(respostas.ambientes.includes(b.dataset.valor)));
      campoOutro.hidden = !respostas.ambientes.includes("outro");
      desenharDetalhes();
      if (!campoOutro.hidden) entrada.focus();
    }, C.ambientes[a.id]));
    return [h("div", { class: "funil-opcoes funil-cartoes funil-cartoes-ambientes" }, ...botoes), campoOutro, detalhes];
  }

  function avisar(mensagem) {
    if (alertaAtual) alertaAtual.textContent = mensagem;
  }

  function adicionarArquivos(lista) {
    const motivos = [];
    for (const arquivo of lista) {
      const resultado = L.validarArquivo(arquivo);
      if (!resultado.ok) motivos.push(resultado.motivo);
      else if (respostas.arquivos.length >= MAX_ARQUIVOS) motivos.push(`${arquivo.name}: você pode enviar até ${MAX_ARQUIVOS} arquivos.`);
      else respostas.arquivos.push(arquivo);
    }
    avisar(motivos.join(" "));
  }

  function painelPlanta(aoMudar) {
    const lista = h("ul", { class: "funil-arquivos", "data-lista-arquivos": "" }, ...respostas.arquivos.map((arquivo, posicao) =>
      h("li", {},
        h("span", {}, arquivo.name),
        h("button", {
          type: "button",
          "aria-label": `Remover ${arquivo.name}`,
          onclick: () => { respostas.arquivos.splice(posicao, 1); aoMudar(); },
        }, "Remover"))));
    const campo = h("input", {
      id: "funil-arquivos",
      type: "file",
      multiple: "",
      accept: ".pdf,.jpg,.jpeg,.png",
      "data-arquivos": "",
      onchange: (e) => {
        const novos = [...e.target.files];
        e.target.value = "";
        adicionarArquivos(novos);
        aoMudar(true);
      },
    });
    return [
      h("div", { class: "funil-anexar" }, campo, h("label", { for: "funil-arquivos" }, "Escolher arquivos")),
      h("p", { class: "funil-dica" }, `Até ${MAX_ARQUIVOS} arquivos em PDF, JPG ou PNG, com até 10 MB cada.`),
      lista,
      h("p", { class: "funil-dica" }, "Se não conseguir anexar agora, envie o pedido assim mesmo: nossa equipe vai pedir a planta pelo WhatsApp."),
    ];
  }

  function painelVisita() {
    const periodos = ["Manhã", "Tarde", "Tanto faz"];
    const botoes = periodos.map((texto) => botaoOpcao(texto, texto, respostas.periodoVisita === texto, () => {
      respostas.periodoVisita = texto;
      avisar("");
      for (const b of botoes) b.setAttribute("aria-pressed", String(b.dataset.valor === texto));
    }));
    return [
      h("p", { class: "funil-aviso" }, "A visita de medição tem uma taxa simbólica. Nossa equipe informa o valor e a forma de pagamento ao combinar a visita."),
      h("p", { class: "funil-rotulo" }, "Qual período você prefere?"),
      h("div", { class: "funil-opcoes funil-opcoes-curtas" }, ...botoes),
    ];
  }

  function camposPlanta() {
    const painel = h("div", { class: "funil-painel" });
    const desenharPainel = (manterAviso) => {
      if (!manterAviso) avisar("");
      if (respostas.caminho === "planta") painel.replaceChildren(...painelPlanta(desenharPainel));
      else if (respostas.caminho === "visita") painel.replaceChildren(...painelVisita());
    };
    const botoes = C.caminhos.map((caminho) => botaoOpcao(caminho.valor, caminho.titulo, respostas.caminho === caminho.valor, () => {
      respostas.caminho = caminho.valor;
      for (const b of botoes) b.setAttribute("aria-pressed", String(b.dataset.valor === caminho.valor));
      desenharPainel();
    }, caminho));
    desenharPainel(true);

    const caixa = h("input", {
      type: "checkbox",
      id: "funil-consentimento",
      "data-consentimento": "",
      onchange: (e) => { respostas.consentimento = e.target.checked; },
    });
    caixa.checked = respostas.consentimento;

    iscaAtual = h("input", { type: "text", name: "site", tabindex: "-1", autocomplete: "off", "data-isca": "" });

    return [
      h("div", { class: "funil-opcoes funil-cartoes" }, ...botoes),
      painel,
      h("div", { class: "funil-consentimento" },
        caixa,
        h("label", { for: "funil-consentimento" },
          "Concordo com o uso dos meus dados para receber este orçamento, conforme a ",
          h("a", { href: "privacidade.html", target: "_blank", rel: "noopener" }, "política de privacidade"),
          ".")),
      h("div", { class: "funil-isca", "aria-hidden": "true" }, h("label", {}, "Não preencha este campo", iscaAtual)),
    ];
  }

  function lerArquivo(arquivo) {
    return new Promise((resolver, rejeitar) => {
      const leitor = new FileReader();
      leitor.onload = () => resolver({
        nome: arquivo.name,
        tipo: TIPOS_POR_EXTENSAO[arquivo.name.split(".").pop().toLowerCase()],
        base64: String(leitor.result).split(",")[1] || "",
      });
      leitor.onerror = () => rejeitar(new Error(`Não foi possível ler ${arquivo.name}`));
      leitor.readAsDataURL(arquivo);
    });
  }

  async function montarPedido() {
    const comPlanta = respostas.caminho === "planta";
    const selecionados = comPlanta ? respostas.arquivos : [];
    // Um arquivo ilegível não pode derrubar o pedido: ele segue com a planta pendente.
    const lidos = await Promise.all(selecionados.map((a) => lerArquivo(a).catch(() => null)));
    const arquivos = lidos.filter(Boolean);
    return {
      perfil: respostas.perfil,
      nome: respostas.nome.trim(),
      whatsapp: L.normalizarWhatsapp(respostas.whatsapp),
      email: respostas.email.trim(),
      ambientes: respostas.ambientes.map((id) => L.AMBIENTES.find((a) => a.id === id).nome),
      outroTexto: respostas.ambientes.includes("outro") ? respostas.outroTexto.trim() : "",
      local: respostas.local.trim(),
      faixa: respostas.faixa,
      prazo: respostas.prazo,
      caminho: respostas.caminho,
      periodoVisita: comPlanta ? "" : respostas.periodoVisita,
      arquivos,
      plantaPendente: comPlanta && (arquivos.length === 0 || arquivos.length < selecionados.length),
      consentimento: true,
      site: iscaAtual ? iscaAtual.value : "",
      decorridoMs: Date.now() - inicio,
    };
  }

  async function enviarPedido(botao) {
    if (enviando) return;
    enviando = true;
    avisar("");
    for (const b of raiz.querySelectorAll("button")) b.disabled = true;
    botao.textContent = "Enviando...";

    const controle = new AbortController();
    let temporizador;
    const limite = new Promise((_, rejeitar) => {
      temporizador = setTimeout(() => {
        controle.abort();
        rejeitar(new Error("Tempo limite do envio"));
      }, tempoLimite);
    });
    const tentativa = (async () => {
      const pedido = await montarPedido();
      const resposta = await enviar(pedido, { signal: controle.signal });
      if (!resposta || !resposta.ok) throw new Error("Pedido não aceito");
      return pedido.plantaPendente || (respostas.caminho === "planta" && Boolean(resposta.plantaPendente));
    })();

    try {
      desenharFinal(await Promise.race([tentativa, limite]));
    } catch (erro) {
      desenharFalha();
    } finally {
      clearTimeout(temporizador);
      enviando = false;
    }
  }

  function mostrar(foto, frase, conteudo, titulo) {
    raiz.replaceChildren(h("div", { class: "funil" },
      h("aside", { class: "funil-lado" },
        h("img", { class: "funil-foto", src: FOTOS + foto, alt: "" }),
        h("a", { class: "funil-marca", href: "index.html", "aria-label": "Casa Fator, voltar ao site" },
          h("img", { src: "img/logo.svg", alt: "" })),
        h("p", { class: "funil-frase" }, frase)),
      h("main", { class: "funil-conteudo" }, ...conteudo)));
    if (titulo) {
      titulo.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }

  function desenharFinal(plantaPendente) {
    const titulo = h("h1", { "data-titulo": "", tabindex: "-1" }, respostas.caminho === "planta"
      ? `Recebemos seu pedido. O orçamento chega no seu e-mail ${L.prazoOrcamento(respostas.ambientes)}.`
      : "Recebemos seu pedido. Vamos chamar você no WhatsApp para combinar a visita.");
    mostrar("gen-cozinha-nogueira.jpg", "Obrigado", [h("div", { "data-tela": "final" },
      titulo,
      ...(plantaPendente ? [h("p", { class: "funil-aviso" }, "A planta não chegou com o pedido. Nossa equipe vai pedir a planta pelo WhatsApp.")] : []),
      h("section", { class: "funil-bloco" },
        h("h2", {}, "O que acontece agora"),
        h("ol", { class: "funil-passos", "data-proximos": "" }, ...C.proximos[respostas.caminho].map((texto) => h("li", {}, h("span", {}, texto.replace("{prazo}", L.prazoOrcamento(respostas.ambientes))))))),
      ...resumoEl(null),
      galeriaEl(),
      h("div", { class: "funil-acoes funil-acoes-falha" },
        h("a", { class: "botao botao-branco", href: "index.html" }, "Voltar ao site"),
        h("a", { class: "botao funil-whatsapp", href: "https://www.instagram.com/casafator/", target: "_blank", rel: "noopener" }, "Ver mais no Instagram")))], titulo);
  }

  function desenharFalha() {
    const titulo = h("h1", { "data-titulo": "", tabindex: "-1" }, "Não conseguimos enviar seu pedido.");
    const resumo = L.montarResumoWhatsapp(respostas);
    const tentar = h("button", {
      type: "button",
      class: "botao botao-branco",
      "data-acao": "tentar",
      onclick: () => enviarPedido(tentar),
    }, "Tentar de novo");
    mostrar("gen-acabamento.jpg", "Quase lá", [h("div", { "data-tela": "falha" },
      titulo,
      h("p", { class: "funil-dica" }, "Suas respostas continuam aqui. Você pode tentar de novo ou mandar o resumo pelo WhatsApp, sem os arquivos."),
      h("div", { class: "funil-acoes funil-acoes-falha" },
        tentar,
        h("a", {
          class: "botao funil-whatsapp",
          href: `${WHATSAPP}?text=${encodeURIComponent(resumo)}`,
          target: "_blank",
          rel: "noopener",
        }, "Enviar pelo WhatsApp")),
      h("button", {
        type: "button",
        class: "funil-voltar",
        "data-acao": "rever",
        onclick: () => desenhar(true),
      }, "Rever minhas respostas"),
      ...resumoEl(null))], titulo);
  }

  function desenhar(moverFoco) {
    const etapa = ETAPAS[indice];
    const alerta = h("p", { class: "funil-erro", role: "alert", id: "funil-erro" });
    alertaAtual = alerta;
    const titulo = h("h1", { "data-titulo": "", tabindex: "-1" }, etapa.titulo);

    const botaoPrincipal = h("button", {
      type: "submit",
      class: "botao botao-branco",
      "data-acao": etapa.acaoBotao || "avancar",
    }, etapa.textoBotao || "Avançar");

    const formulario = h("form", {
      "data-etapa": etapa.id,
      novalidate: "",
      onsubmit: (e) => {
        e.preventDefault();
        const mensagem = etapa.validar();
        if (mensagem) {
          alerta.textContent = mensagem;
          const entrada = etapa.campoComErro ? etapa.campoComErro(formulario) : formulario.querySelector("input");
          if (entrada && !entrada.closest("[hidden]")) {
            entrada.setAttribute("aria-invalid", "true");
            entrada.setAttribute("aria-describedby", "funil-erro");
            entrada.focus();
          }
          return;
        }
        if (etapa.concluir) etapa.concluir(botaoPrincipal);
        else avancarPara();
      },
    },
    titulo,
    ...(etapa.dica ? [h("p", { class: "funil-dica" }, etapa.dica)] : []),
    ...etapa.campos(),
    ...(etapa.ajuda ? [h("p", { class: "funil-ajuda", "data-ajuda": "" }, etapa.ajuda)] : []),
    alerta,
    h("div", { class: "funil-acoes" },
      h("button", {
        type: "button",
        class: "funil-voltar",
        "data-acao": "voltar",
        hidden: indice === 0,
        onclick: () => { indice -= 1; desenhar(true); },
      }, "Voltar"),
      botaoPrincipal));

    mostrar(etapa.foto, etapa.frase, [
      h("p", { class: "funil-progresso", "data-progresso": "" }, `Etapa ${indice + 1} de ${ETAPAS.length}`),
      h("div", { class: "funil-barra", "aria-hidden": "true" },
        h("span", { "data-barra": "", style: `width: ${((indice + 1) / ETAPAS.length) * 100}%` })),
      formulario,
      h("a", {
        class: "funil-conversar",
        "data-whatsapp": "",
        href: WHATSAPP,
        target: "_blank",
        rel: "noopener",
      }, "Prefere conversar? Fale pelo WhatsApp"),
      ...resumoEl(etapa.id),
      ...(etapa.ajuda ? [comoFuncionaEl()] : []),
      galeriaEl(),
    ], moverFoco ? titulo : null);
  }

  desenhar(false);
};
