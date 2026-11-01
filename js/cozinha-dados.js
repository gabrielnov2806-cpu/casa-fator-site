// Especificações mostradas no Modelo 3D. Para corrigir um dado, basta editar aqui.
window.COZINHA_DADOS = (function () {
  const MATERIAL = "MDF Ultra Duratex";
  const FREIJO = "Freijó Puro (Duratex)";
  const CINZA = "Cinza Sagrado (Duratex)";
  const BRANCO = "Branco Diamante (Duratex)";
  const CAVA = "Cava usinada na própria madeira";
  const DOBRADICA = "Dobradiças Häfele com amortecedor";
  const CORREDICA = "Corrediças ocultas Häfele com amortecedor";
  const ARTICULADOR = "Articuladores Häfele com amortecedor";
  const VIDRO_PUXADOR = "Puxador discreto no perfil de alumínio";

  const marcenaria = (m) => ({ comodo: "cozinha", grupo: "Marcenaria", material: MATERIAL, espessura: "18 mm", ...m });
  const eletro = (m) => ({ comodo: "cozinha", grupo: "Eletrodomésticos", ...m });
  const acabamento = (m) => ({ comodo: "cozinha", grupo: "Bancadas e painéis", ...m });
  const naSala = (m) => ({ comodo: "sala", ...m });

  return {
    aviso: "Modelo ilustrativo de um projeto Casa Fator. Cores, medidas e especificações variam conforme cada projeto.",
    comodos: [{ id: "cozinha", nome: "Cozinha" }, { id: "sala", nome: "Sala" }],
    modulos: [
      marcenaria({
        id: "torre-geladeira", nome: "Torre da geladeira", parte: "Laterais e porta superior basculante",
        cor: FREIJO, ferragens: ARTICULADOR, puxador: CAVA, medidas: "1020 × 2500 × 620 mm",
        descricao: "Emoldura a geladeira e aproveita o espaço acima dela com um armário de porta basculante.",
      }),
      marcenaria({
        id: "torre-fornos", nome: "Torre de fornos", parte: "Nichos dos fornos, gavetas e porta superior",
        cor: FREIJO, ferragens: `${CORREDICA}; ${ARTICULADOR.toLowerCase().replace("häfele", "Häfele")}`, puxador: CAVA, medidas: "700 × 2500 × 620 mm",
        descricao: "Reúne forno e micro-ondas na altura dos olhos, com gavetas largas embaixo.",
      }),
      marcenaria({
        id: "gaveteiro", nome: "Gaveteiro inferior", parte: "Três gavetões com frente em MDF",
        cor: CINZA, ferragens: CORREDICA, puxador: CAVA, medidas: "800 × 770 × 600 mm",
        descricao: "Gavetões de abertura total para panelas e utensílios do dia a dia.",
      }),
      marcenaria({
        id: "base-cuba", nome: "Armário da cuba", parte: "Duas portas de giro",
        cor: CINZA, ferragens: DOBRADICA, puxador: CAVA, medidas: "900 × 770 × 600 mm",
        descricao: "Armário sob a cuba, em painel adequado à umidade da área molhada.",
      }),
      marcenaria({
        id: "aereos", nome: "Armários aéreos", parte: "Duas portas basculantes",
        cor: FREIJO, ferragens: ARTICULADOR, puxador: CAVA, medidas: "1300 × 700 × 350 mm",
        descricao: "Portas que abrem para cima, deixando a bancada livre durante o uso.",
      }),
      marcenaria({
        id: "cristaleira-superior", nome: "Cristaleira aérea", parte: "Portas de vidro em perfil de alumínio, com prateleiras internas",
        cor: FREIJO, ferragens: DOBRADICA, puxador: VIDRO_PUXADOR, medidas: "1000 × 700 × 350 mm", vidro: true,
        descricao: "Portas de vidro e iluminação interna para expor taças e louças.",
      }),
      marcenaria({
        id: "cristaleira-torre", nome: "Cristaleira torre", parte: "Portas superiores de vidro e portas inferiores em MDF",
        cor: FREIJO, ferragens: DOBRADICA, puxador: VIDRO_PUXADOR, medidas: "1000 × 2500 × 450 mm", vidro: true,
        descricao: "Peça de destaque do ambiente, com vidro em cima e armário fechado embaixo.",
      }),
      marcenaria({
        id: "ilha-gavetas", nome: "Ilha: gavetões", parte: "Três gavetões sob o cooktop",
        cor: CINZA, ferragens: CORREDICA, puxador: CAVA, medidas: "1500 × 770 × 900 mm",
        descricao: "Panelas e temperos ao alcance da mão, logo abaixo do cooktop.",
      }),
      marcenaria({
        id: "ilha-portas", nome: "Ilha: armário", parte: "Duas portas de giro",
        cor: CINZA, ferragens: DOBRADICA, puxador: CAVA, medidas: "1100 × 770 × 900 mm",
        descricao: "Armário de apoio para itens maiores e pouco usados.",
      }),
      acabamento({
        id: "ilha-fundo", nome: "Ilha: painel do balcão", parte: "Painel de fechamento, com ripado no lado das banquetas",
        material: MATERIAL, espessura: "18 mm", cor: FREIJO, medidas: "2600 × 770 × 18 mm",
        descricao: "Dá acabamento ao lado social da ilha, voltado para quem senta no balcão.",
      }),
      acabamento({
        id: "painel", nome: "Painel entre armários", parte: "Painel de parede sobre a bancada",
        material: MATERIAL, espessura: "18 mm", cor: FREIJO, medidas: "2300 × 600 mm",
        descricao: "Reveste a parede da bancada e recebe a luz embutida dos armários aéreos.",
      }),
      acabamento({
        id: "bancada", nome: "Bancada da parede", parte: "Tampo sobre gaveteiro, lava-louças e armário da cuba",
        material: "Pedra clara (exemplo)", espessura: "30 mm", medidas: "2300 × 30 × 620 mm",
        descricao: "A pedra é escolhida em cada projeto, conforme o uso e o orçamento.",
      }),
      acabamento({
        id: "bancada-ilha", nome: "Bancada da ilha", parte: "Tampo com balanço para banquetas",
        material: "Pedra clara (exemplo)", espessura: "30 mm", medidas: "2600 × 30 × 1200 mm",
        descricao: "O balanço de um dos lados cria um balcão para refeições rápidas.",
      }),
      acabamento({
        id: "cuba", nome: "Cuba e torneira", parte: "Cuba de embutir e torneira", material: "Inox (exemplo)",
        medidas: "Conforme o modelo escolhido", descricao: "O vão na bancada segue as medidas do modelo definido pelo cliente.",
      }),
      eletro({ id: "geladeira", nome: "Geladeira", parte: "Eletrodoméstico embutido entre painéis", medidas: "900 × 1900 × 600 mm", descricao: "Modelo ilustrativo. O vão e a ventilação seguem o aparelho escolhido por você." }),
      eletro({ id: "forno", nome: "Forno de embutir", parte: "Eletrodoméstico na torre de fornos", medidas: "600 × 600 × 550 mm", descricao: "Modelo ilustrativo. O nicho é desenhado a partir do manual do aparelho." }),
      eletro({ id: "micro", nome: "Micro-ondas de embutir", parte: "Eletrodoméstico na torre de fornos", medidas: "600 × 400 × 400 mm", descricao: "Modelo ilustrativo, instalado acima do forno." }),
      eletro({ id: "lava-loucas", nome: "Lava-louças", parte: "Eletrodoméstico sob a bancada", medidas: "600 × 770 × 600 mm", descricao: "Modelo ilustrativo, perto da cuba para facilitar as instalações." }),
      eletro({ id: "cooktop", nome: "Cooktop", parte: "Eletrodoméstico embutido na ilha", medidas: "750 × 10 × 500 mm", descricao: "Modelo ilustrativo, sobre a bancada da ilha." }),
      marcenaria(naSala({
        id: "sala-rack", nome: "Rack suspenso", parte: "Gavetões nas pontas e duas portas de giro no centro",
        cor: FREIJO, ferragens: `${CORREDICA}; ${DOBRADICA.toLowerCase().replace("häfele", "Häfele")}`, puxador: CAVA, medidas: "3400 × 450 × 500 mm",
        descricao: "Fica suspenso para deixar o piso livre e guardar controles, jogos e aparelhos.",
      })),
      marcenaria(naSala({
        id: "sala-estante", nome: "Estante", parte: "Prateleiras abertas e duas portas de giro embaixo",
        cor: FREIJO, ferragens: DOBRADICA, puxador: CAVA, medidas: "1100 × 2500 × 380 mm",
        descricao: "Prateleiras para livros e objetos, com armário fechado na parte de baixo.",
      })),
      marcenaria(naSala({
        id: "sala-adega", nome: "Adega com cristaleira", parte: "Portas superiores de vidro em perfil de alumínio e portas inferiores em MDF",
        cor: FREIJO, ferragens: DOBRADICA, puxador: VIDRO_PUXADOR, medidas: "1100 × 2500 × 450 mm", vidro: true,
        descricao: "Garrafas e taças à mostra atrás do vidro, com armário fechado embaixo.",
      })),
      marcenaria(naSala({
        id: "sala-aparador", nome: "Aparador", parte: "Dois gavetões e duas portas de giro",
        cor: CINZA, ferragens: `${CORREDICA}; ${DOBRADICA.toLowerCase().replace("häfele", "Häfele")}`, puxador: CAVA, medidas: "1500 × 720 × 420 mm",
        descricao: "Apoio ao lado da estante, com gavetões de abertura total e armário.",
      })),
      acabamento(naSala({
        id: "sala-painel", nome: "Painel ripado da TV", parte: "Painel de parede com ripado vertical",
        material: MATERIAL, espessura: "18 mm", cor: FREIJO, medidas: "3600 × 2500 mm",
        descricao: "Reveste a parede da TV, esconde os fios e recebe iluminação embutida.",
      })),
      eletro(naSala({ id: "sala-tv", nome: "TV", parte: "Aparelho fixado no painel", medidas: "1650 × 950 mm", descricao: "Modelo ilustrativo. O painel é desenhado a partir do tamanho da sua TV." })),
      eletro(naSala({ id: "sala-soundbar", nome: "Barra de som", parte: "Aparelho sobre o rack", medidas: "1000 × 70 × 100 mm", descricao: "Modelo ilustrativo. Vale prever tomadas e passagem de fios no projeto." })),
      eletro({ id: "coifa", nome: "Coifa de ilha", parte: "Eletrodoméstico suspenso sobre o cooktop", medidas: "700 × 950 × 420 mm", descricao: "Modelo ilustrativo. A exaustão precisa ser prevista antes da obra." }),
    ],
  };
})();
