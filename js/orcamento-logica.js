// Regras do funil de orçamento, sem nenhuma dependência da página.
window.FunilLogica = (function () {
  // Valores em R$ mil. Para ajustar as faixas, basta mudar esta tabela.
  const AMBIENTES = [
    { id: "todos", nome: "Todos os ambientes", min: 50, max: 500 },
    { id: "cozinha", nome: "Cozinha", min: 10, max: 50 },
    { id: "quarto", nome: "Quarto", min: 10, max: 50 },
    { id: "closet", nome: "Closet", min: 5, max: 40 },
    { id: "sala", nome: "Sala", min: 5, max: 40 },
    { id: "gourmet", nome: "Área gourmet", min: 5, max: 40 },
    { id: "escritorio", nome: "Escritório", min: 5, max: 40 },
    { id: "lavanderia", nome: "Lavanderia", min: 5, max: 40 },
    { id: "hall", nome: "Hall", min: 5, max: 40 },
    { id: "outro", nome: "Outro", min: 5, max: 40 },
  ];

  const LIMITE_ARQUIVO = 10 * 1024 * 1024;
  const EXTENSOES = ["pdf", "jpg", "jpeg", "png"];

  const porId = (id) => AMBIENTES.find((a) => a.id === id);
  const reais = (valor) => `R$ ${String(valor).replace(".", ",")} mil`;

  function calcularFaixas(ids) {
    const escolhidos = ids.map(porId).filter(Boolean);
    if (escolhidos.length === 0) return [];
    const min = escolhidos.reduce((soma, a) => soma + a.min, 0);
    const max = escolhidos.reduce((soma, a) => soma + a.max, 0);
    const media = (min + max) / 2;
    return [
      { id: "baixa", texto: `De ${reais(min)} até ${reais(media)}` },
      { id: "media", texto: `De ${reais(media)} até ${reais(max)}` },
      { id: "alta", texto: `Acima de ${reais(max)}` },
    ];
  }

  // "Todos" é exclusivo: escolhê-lo desmarca os demais, e vice-versa.
  function alternarAmbiente(ids, id) {
    if (ids.includes(id)) return ids.filter((atual) => atual !== id);
    if (id === "todos") return ["todos"];
    return [...ids.filter((atual) => atual !== "todos"), id];
  }

  // Até 2 ambientes, 3 a 5 dias úteis. A partir de 3, ou "todos", o prazo é maior.
  function prazoOrcamento(ids) {
    return ids.includes("todos") || ids.length > 2
      ? "em 7 a 10 dias úteis, podendo ser menos"
      : "em 3 a 5 dias úteis";
  }

  function ambienteDaUrl(busca) {
    const id = new URLSearchParams(busca).get("ambiente");
    return porId(id) ? id : null;
  }

  function normalizarWhatsapp(texto) {
    let digitos = String(texto).replace(/\D/g, "");
    if (digitos.length > 11 && digitos.startsWith("55")) digitos = digitos.slice(2);
    return digitos.length === 10 || digitos.length === 11 ? digitos : null;
  }

  function emailValido(texto) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(texto).trim());
  }

  function validarArquivo({ name, size }) {
    const extensao = String(name).split(".").pop().toLowerCase();
    if (!EXTENSOES.includes(extensao)) {
      return { ok: false, motivo: `${name}: envie o arquivo em PDF, JPG ou PNG.` };
    }
    if (size > LIMITE_ARQUIVO) {
      return { ok: false, motivo: `${name}: o arquivo passa de 10 MB.` };
    }
    return { ok: true };
  }

  function montarResumoWhatsapp({ nome, ambientes, local, faixa, prazo }) {
    const nomes = (ambientes || []).map((id) => (porId(id) || { nome: id }).nome).join(", ");
    return [
      "Olá! Tentei enviar meu pedido de orçamento pelo site da Casa Fator.",
      `Nome: ${nome}`,
      `Ambientes: ${nomes}`,
      `Local: ${local}`,
      `Investimento: ${faixa}`,
      `Prazo: ${prazo}`,
    ].join("\n");
  }

  return {
    AMBIENTES,
    calcularFaixas,
    prazoOrcamento,
    alternarAmbiente,
    ambienteDaUrl,
    normalizarWhatsapp,
    emailValido,
    validarArquivo,
    montarResumoWhatsapp,
  };
})();
