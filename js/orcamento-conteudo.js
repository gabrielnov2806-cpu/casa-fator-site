// Textos das opções do funil e fotos da galeria. Para mudar uma frase ou foto, basta editar aqui.
window.FUNIL_CONTEUDO = (function () {
  const foto = (nome) => `img/funil/${nome}.jpg`;
  return {
    perfis: [
      { valor: "Cliente", texto: "Quero móveis planejados para a minha casa ou a minha empresa." },
      { valor: "Arquiteto, designer ou engenheiro", texto: "Estou especificando móveis para o projeto de um cliente." },
    ],
    ambientes: {
      todos: { texto: "O imóvel inteiro planejado junto, com a mesma linguagem.", dica: "Conte depois quais ambientes são prioridade." },
      cozinha: { texto: "Armários, ilha, despensa e nichos para eletros.", dica: "Se já escolheu os eletros, anote os modelos: eles definem as medidas." },
      quarto: { texto: "Guarda-roupa, cabeceira, painel e bancada.", dica: "Pense em quem usa o quarto e no que precisa guardar." },
      closet: { texto: "Cabideiros, gavetas, sapateiras e prateleiras.", dica: "Faça uma conta rápida de roupas, sapatos e bolsas." },
      sala: { texto: "Painel de TV, estantes, aparadores e adega.", dica: "Separe o tamanho da TV e o que vai ficar à mostra." },
      gourmet: { texto: "Bancadas, armários e apoio para a churrasqueira.", dica: "Liste os equipamentos que vão ficar no espaço." },
      escritorio: { texto: "Mesas, armários, estantes e recepção.", dica: "Conte quantas pessoas trabalham ali e o que precisa ficar à mão." },
      lavanderia: { texto: "Armários e apoio para as máquinas.", dica: "Anote os modelos da lavadora e da secadora." },
      hall: { texto: "Painéis, aparadores e armários de entrada.", dica: "Pense no que precisa ficar à mão ao chegar em casa." },
      outro: { texto: "Conte o que você precisa e planejamos sob medida.", dica: "Descreva o ambiente no campo acima." },
    },
    faixas: {
      baixa: { texto: "Foco no essencial, com os ambientes bem resolvidos." },
      media: { texto: "Mais espaço para detalhes, acabamentos e soluções sob medida." },
      alta: { texto: "Liberdade para um projeto completo, até o último detalhe." },
    },
    prazos: [
      { valor: "Imediatamente", texto: "O imóvel já está pronto para receber os móveis." },
      { valor: "3 meses", texto: "A obra está na reta final." },
      { valor: "6 meses", texto: "A obra está em andamento." },
      { valor: "12 meses", texto: "Estou planejando com calma." },
      { valor: "Mais de 1 ano", texto: "Estou no começo e quero me organizar." },
    ],
    caminhos: [
      { valor: "planta", titulo: "Tenho a planta", texto: "Envie em PDF, JPG ou PNG. É o caminho mais rápido e fácil." },
      { valor: "visita", titulo: "Não tenho a planta", texto: "Marque uma visita para medirmos o local. A visita tem uma taxa simbólica." },
    ],
    comoFunciona: [
      { titulo: "Você conta sobre o projeto", texto: "Responde às perguntas e envia a planta, se tiver." },
      { titulo: "O projetista analisa", texto: "Suas respostas e a planta são a base do orçamento." },
      { titulo: "O orçamento chega com o 3D dos ambientes escolhidos", texto: "Por e-mail, em 3 a 5 dias úteis." },
    ],
    galeria: [
      { foto: foto("cozinha2"), legenda: "Cozinha" },
      { foto: foto("closet"), legenda: "Closet" },
      { foto: foto("sala"), legenda: "Sala" },
      { foto: foto("chopeira"), legenda: "Área gourmet" },
    ],
    proximos: {
      planta: [
        "O projetista analisa suas respostas e a planta.",
        "Preparamos o orçamento e o 3D dos ambientes que você escolheu.",
        "Você recebe tudo no seu e-mail em 3 a 5 dias úteis.",
      ],
      visita: [
        "Chamamos você no WhatsApp para combinar o dia da visita.",
        "Informamos o valor da taxa simbólica e a forma de pagamento.",
        "Medimos o local e preparamos o orçamento e o 3D dos ambientes que você escolheu.",
      ],
    },
  };
})();
