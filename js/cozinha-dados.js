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
  const naSuite = (m) => ({ comodo: "quarto", ...m });
  const naGourmet = (m) => ({ comodo: "gourmet", ...m });
  const noEscritorio = (m) => ({ comodo: "escritorio", ...m });
  const noHall = (m) => ({ comodo: "hall", ...m });
  const noBanheiro = (m) => ({ comodo: "banheiro", ...m });
  const naLavanderia = (m) => ({ comodo: "lavanderia", ...m });
  const GRAFITE = "Grafite (tom a confirmar na linha Duratex)";
  const NOGUEIRA = "Nogueira Caiena (Duratex)";
  const THAR = "Nogueira Thar (Duratex)";
  const VIDRO_FUME = "Portas de vidro fumê em perfil de alumínio bronze";

  return {
    aviso: "Modelo ilustrativo de um projeto Casa Fator. Cores, medidas e especificações variam conforme cada projeto.",
    convite: "Esta casa é um exemplo. Seu orçamento chega com o 3D só dos ambientes que você pedir, de uma cozinha à casa inteira, para você ver cada detalhe antes de decidir.",
    comodos: [{ id: "cozinha", nome: "Cozinha" }, { id: "sala", nome: "Sala" }, { id: "quarto", nome: "Quarto e closet" }, { id: "banheiro", nome: "Banheiro" },{ id: "gourmet", nome: "Área gourmet" }, { id: "escritorio", nome: "Escritório" }, { id: "hall", nome: "Hall" }, { id: "lavanderia", nome: "Lavanderia" }],
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
      marcenaria(naSuite({
        id: "quarto-criados", nome: "Criados-mudos suspensos", parte: "Uma gaveta em cada lado da cama",
        cor: `${NOGUEIRA} e ${THAR}`, ferragens: CORREDICA, puxador: CAVA, medidas: "580 × 240 × 450 mm",
        descricao: "Soltos do chão para deixar a limpeza fácil e o ambiente mais leve.",
      })),
      marcenaria(naSuite({
        id: "closet-porta", nome: "Porta de correr embutida", parte: "Porta que corre para dentro da parede de marcenaria",
        espessura: "36 mm", cor: THAR, ferragens: "Trilho de correr Häfele com amortecedor na abertura e no fechamento", puxador: "Cava vertical usinada nos dois lados da porta", medidas: "1000 × 2170 × 36 mm",
        descricao: "Liga o quarto ao closet. Aberta, some dentro da parede; ao abrir e ao fechar, freia sozinha e não bate.",
      })),
      marcenaria(naSuite({
        id: "closet-cabideiro", nome: "Cabideiro iluminado", parte: VIDRO_FUME,
        cor: NOGUEIRA, ferragens: DOBRADICA, puxador: VIDRO_PUXADOR, medidas: "950 × 2500 × 600 mm", vidro: true,
        descricao: "Roupas à vista atrás do vidro fumê, com LED nas laterais e sob a prateleira.",
      })),
      marcenaria(naSuite({
        id: "closet-sapateira", nome: "Sapateira iluminada", parte: VIDRO_FUME,
        cor: NOGUEIRA, ferragens: DOBRADICA, puxador: VIDRO_PUXADOR, medidas: "750 × 2500 × 600 mm", vidro: true,
        descricao: "Uma linha de LED sob cada prateleira destaca os calçados.",
      })),
      marcenaria(naSuite({
        id: "closet-gavetas", nome: "Gaveteiro com nichos", parte: "Quatro gavetas e nichos abertos iluminados",
        cor: `${NOGUEIRA} e ${THAR}`, ferragens: CORREDICA, puxador: CAVA, medidas: "940 × 2500 × 600 mm",
        descricao: "Gavetas de abertura total embaixo e nichos para bolsas e acessórios em cima.",
      })),
      marcenaria(naSuite({
        id: "closet-ilha", nome: "Ilha do closet", parte: "Seis gavetas e tampo em pedra escura",
        cor: `${NOGUEIRA} e ${THAR}`, ferragens: CORREDICA, puxador: CAVA, medidas: "1900 × 930 × 900 mm",
        descricao: "Apoio central para joias e acessórios, com LED junto ao piso.",
      })),
      {
        comodo: "quarto", grupo: "Cama e estofados", id: "quarto-cama", nome: "Cama king", parte: "Base com LED, colchão e roupa de cama",
        material: MATERIAL, espessura: "18 mm", cor: NOGUEIRA, medidas: "1930 × 2030 mm (colchão)",
        descricao: "A luz sob a base dá a impressão de que a cama flutua.",
      },
      {
        comodo: "quarto", grupo: "Cama e estofados", id: "quarto-calcadeira", nome: "Calçadeira", parte: "Assento estofado com base em metal bronze",
        material: "Estofado (exemplo)", medidas: "1500 × 440 × 500 mm",
        descricao: "Fica ao pé da cama e ajuda na hora de se vestir.",
      },
      acabamento(naSuite({
        id: "quarto-cabeceira", nome: "Cabeceira ripada", parte: "Painel de parede com ripado e módulos estofados",
        material: MATERIAL, espessura: "18 mm", cor: NOGUEIRA, medidas: "3400 × 2600 mm",
        descricao: "Reveste a parede da cama, com estofado na altura das costas e LED embutido.",
      })),
      acabamento(naSuite({
        id: "closet-parede", nome: "Parede de marcenaria", parte: "Parede dupla em MDF, com ripado e vão para a porta de correr",
        material: MATERIAL, espessura: "120 mm no total", cor: NOGUEIRA, medidas: "2700 × 2850 × 120 mm",
        descricao: "Separa o quarto do closet sem obra de alvenaria e guarda a porta de correr por dentro.",
      })),
      acabamento(naSuite({
        id: "closet-espelho", nome: "Espelho de corpo inteiro", parte: "Espelho na parede lateral, com LED nos dois lados",
        material: "Espelho (exemplo)", medidas: "1200 × 2200 mm",
        descricao: "A luz lateral ilumina o rosto e o corpo sem criar sombras fortes.",
      })),
      acabamento(naSuite({
        id: "closet-led", nome: "Iluminação em LED", parte: "Fitas de LED em tom quente, embutidas nos móveis",
        material: "Fita de LED (exemplo)", medidas: "Conforme o projeto",
        descricao: "Acende os móveis por dentro e marca o desenho do closet. Tensão e pontos de energia são previstos no projeto.",
      })),
      marcenaria(naGourmet({
        id: "gourmet-portal", nome: "Portal da churrasqueira", parte: "Colunas com portas, armário embaixo e painel ripado até o forro",
        cor: NOGUEIRA, ferragens: DOBRADICA, puxador: CAVA, medidas: "2000 × 2780 × 700 mm",
        descricao: "A marcenaria cerca a churrasqueira, que fica como peça embutida. A proteção contra calor e a distância até a madeira são definidas com o fabricante antes da obra.",
      })),
      marcenaria(naGourmet({
        id: "gourmet-gavetas", nome: "Gaveteiro da bancada", parte: "Três gavetões com frente em MDF",
        cor: NOGUEIRA, ferragens: CORREDICA, puxador: CAVA, medidas: "800 × 770 × 580 mm",
        descricao: "Espetos, facas e utensílios de churrasco perto de onde são usados.",
      })),
      marcenaria(naGourmet({
        id: "gourmet-base-cuba", nome: "Armário da cuba", parte: "Duas portas de giro",
        cor: NOGUEIRA, ferragens: DOBRADICA, puxador: CAVA, medidas: "800 × 770 × 580 mm",
        descricao: "Armário sob a cuba, em painel adequado à umidade da área molhada.",
      })),
      marcenaria(naGourmet({
        id: "gourmet-aereos", nome: "Armários aéreos", parte: "Duas portas basculantes",
        cor: FREIJO, ferragens: ARTICULADOR, puxador: CAVA, medidas: "2200 × 700 × 330 mm",
        descricao: "Portas que abrem para cima, com luz embutida sobre a bancada.",
      })),
      marcenaria(naGourmet({
        id: "gourmet-torre", nome: "Torre dos aparelhos", parte: "Gavetão embaixo e porta basculante em cima",
        cor: FREIJO, ferragens: `${CORREDICA}; ${ARTICULADOR.toLowerCase().replace("häfele", "Häfele")}`, puxador: CAVA, medidas: "1250 × 2600 × 620 mm",
        descricao: "Embute a adega e o frigobar na mesma linha dos armários.",
      })),
      marcenaria(naGourmet({
        id: "gourmet-cristaleira", nome: "Cristaleira", parte: "Portas superiores de vidro e portas inferiores em MDF",
        cor: FREIJO, ferragens: DOBRADICA, puxador: VIDRO_PUXADOR, medidas: "1150 × 2500 × 450 mm", vidro: true,
        descricao: "Taças à mostra com LED em cada prateleira e armário fechado embaixo.",
      })),
      marcenaria(naGourmet({
        id: "gourmet-ilha", nome: "Ilha com balcão", parte: "Três gavetões e duas portas voltados para a parede",
        cor: NOGUEIRA, ferragens: `${CORREDICA}; ${DOBRADICA.toLowerCase().replace("häfele", "Häfele")}`, puxador: CAVA, medidas: "2600 × 770 × 900 mm",
        descricao: "Quem está na churrasqueira conversa com quem está sentado no balcão.",
      })),
      acabamento(naGourmet({
        id: "gourmet-ilha-fundo", nome: "Painel ripado da ilha", parte: "Painel de fechamento com ripado no lado das banquetas",
        material: MATERIAL, espessura: "18 mm", cor: FREIJO, medidas: "2600 × 770 × 18 mm",
        descricao: "Dá acabamento ao lado social da ilha.",
      })),
      acabamento(naGourmet({
        id: "gourmet-painel", nome: "Painel entre armários", parte: "Painel de parede sobre a bancada",
        material: MATERIAL, espessura: "18 mm", cor: FREIJO, medidas: "2200 × 600 mm",
        descricao: "Protege a parede da bancada e recebe a luz dos armários aéreos.",
      })),
      acabamento(naGourmet({
        id: "gourmet-bancada", nome: "Bancada da parede", parte: "Tampo sobre gaveteiro, armário e cervejeira",
        material: "Travertino (exemplo)", espessura: "30 mm", medidas: "2200 × 30 × 620 mm",
        descricao: "Pedra natural de tom claro e veios horizontais. É porosa, então precisa de impermeabilização e cuidado com gordura e líquidos ácidos.",
      })),
      acabamento(naGourmet({
        id: "gourmet-bancada-ilha", nome: "Bancada da ilha", parte: "Tampo com balanço para banquetas",
        material: "Travertino (exemplo)", espessura: "30 mm", medidas: "2680 × 30 × 1220 mm",
        descricao: "A mesma pedra da bancada da parede. O balanço de um dos lados cria um balcão para quatro pessoas conversarem.",
      })),
      acabamento(naGourmet({
        id: "gourmet-forro", nome: "Forro ripado", parte: "Réguas de madeira com vigas e luz embutida",
        material: "Réguas e vigas de madeira (exemplo)", cor: FREIJO, medidas: "Conforme o ambiente",
        descricao: "Cobre a parte fechada da área gourmet, com spots nas vigas. Para área externa, o material é definido conforme a exposição à umidade.",
      })),
      acabamento(naGourmet({
        id: "gourmet-mesa", nome: "Mesa de jantar", parte: "Tampo de madeira sobre base de metal",
        material: "Tampo em madeira (exemplo)", cor: FREIJO, medidas: "2000 × 750 × 1000 mm",
        descricao: "Lugar para seis pessoas, perto da churrasqueira e do balcão.",
      })),
      acabamento(naGourmet({
        id: "gourmet-cuba", nome: "Cuba e torneira", parte: "Cuba de embutir e torneira", material: "Inox (exemplo)",
        medidas: "Conforme o modelo escolhido", descricao: "O vão na bancada segue as medidas do modelo definido pelo cliente.",
      })),
      {
        comodo: "gourmet", grupo: "Área externa", id: "gourmet-piscina", nome: "Piscina", parte: "Piscina e deck ao lado da área coberta",
        material: "Ilustrativo", medidas: "3000 × 3800 mm (exemplo)",
        descricao: "Mostra como a marcenaria se integra à área aberta. A piscina e o deck entram aqui só como ambientação.",
      },
      eletro(naGourmet({ id: "gourmet-churrasqueira", nome: "Churrasqueira", parte: "Churrasqueira com coifa embutida no portal de marcenaria", medidas: "1100 × 1750 × 700 mm", descricao: "Modelo ilustrativo. Exaustão, gás ou carvão e a proteção contra calor são definidos antes da obra." })),
      eletro(naGourmet({ id: "gourmet-adega", nome: "Adega climatizada", parte: "Aparelho embutido, com porta de vidro", medidas: "600 × 1550 × 580 mm", descricao: "Modelo ilustrativo. O nicho prevê a ventilação indicada no manual do aparelho." })),
      eletro(naGourmet({ id: "gourmet-frigobar", nome: "Frigobar", parte: "Aparelho embutido na torre", medidas: "580 × 1550 × 600 mm", descricao: "Modelo ilustrativo. O vão segue as medidas do aparelho escolhido por você." })),
      eletro(naGourmet({ id: "gourmet-cervejeira", nome: "Cervejeira", parte: "Aparelho sob a bancada", medidas: "600 × 770 × 580 mm", descricao: "Modelo ilustrativo, ao alcance de quem está na churrasqueira." })),
      eletro(naGourmet({ id: "gourmet-cooktop", nome: "Cooktop", parte: "Aparelho embutido na bancada", medidas: "600 × 10 × 500 mm", descricao: "Modelo ilustrativo, para acompanhamentos ao lado da churrasqueira." })),
      eletro(naGourmet({ id: "gourmet-chopeira", nome: "Chopeira", parte: "Torre de chope sobre a ilha", medidas: "Conforme o modelo escolhido", descricao: "Modelo ilustrativo. O barril e as instalações ficam previstos dentro da ilha." })),
      marcenaria(noEscritorio({
        id: "escritorio-estante", nome: "Estante", parte: "Nichos iluminados e portas de giro embaixo",
        cor: GRAFITE, ferragens: DOBRADICA, puxador: CAVA, medidas: "3000 × 2500 × 400 mm",
        descricao: "Livros e objetos à mostra em cima, com papéis e equipamentos guardados embaixo.",
      })),
      marcenaria(noEscritorio({
        id: "escritorio-armario", nome: "Armário alto", parte: "Quatro portas de giro",
        cor: CINZA, ferragens: DOBRADICA, puxador: CAVA, medidas: "1200 × 2500 × 550 mm",
        descricao: "Guarda pastas e caixas de arquivo, com as portas fechadas até o alto.",
      })),
      marcenaria(noEscritorio({
        id: "escritorio-gaveteiro", nome: "Gaveteiro da mesa", parte: "Três gavetas voltadas para a poltrona",
        cor: GRAFITE, ferragens: CORREDICA, puxador: CAVA, medidas: "500 × 620 × 800 mm",
        descricao: "Faz parte da mesa e deixa o que é usado todo dia ao alcance da mão.",
      })),
      marcenaria(noEscritorio({
        id: "escritorio-aparador", nome: "Aparador suspenso", parte: "Duas gavetas nas pontas e duas portas de giro no centro",
        cor: GRAFITE, ferragens: `${CORREDICA}; ${DOBRADICA.toLowerCase().replace("häfele", "Häfele")}`, puxador: CAVA, medidas: "2200 × 450 × 450 mm",
        descricao: "Fica suspenso sob o quadro, com espaço para cabos, impressora e material de trabalho.",
      })),
      acabamento(noEscritorio({
        id: "escritorio-mesa", nome: "Mesa de trabalho", parte: "Tampo escuro, lateral inteiriça e frente ripada",
        material: MATERIAL, espessura: "50 mm no tampo (exemplo)", cor: GRAFITE, medidas: "2400 × 770 × 900 mm",
        descricao: "Feita para uma pessoa trabalhar com conforto, com espaço para monitor, teclado e o que fica sempre à mão.",
      })),
      acabamento(noEscritorio({
        id: "escritorio-poltrona", nome: "Poltrona da mesa", parte: "Poltrona giratória estofada, de encosto alto", material: "Tecido cinza (exemplo)",
        medidas: "680 × 1340 × 700 mm", descricao: "Uma poltrona no lugar da cadeira de escritório, para o ambiente ficar com cara de casa. O modelo é escolhido em cada projeto.",
      })),
      acabamento(noEscritorio({
        id: "escritorio-painel", nome: "Painel ripado", parte: "Painel de parede com ripado vertical",
        material: MATERIAL, espessura: "18 mm", cor: CINZA, medidas: "2600 × 2600 mm",
        descricao: "Ripas cinza sobre fundo preto, com luz quente no alto e um quadro no centro.",
      })),
      eletro(noEscritorio({ id: "escritorio-monitor", nome: "Monitor", parte: "Aparelho sobre a mesa", medidas: "800 × 460 mm", descricao: "Modelo ilustrativo. A passagem de cabos é prevista na mesa." })),
      marcenaria(noHall({
        id: "hall-armario", nome: "Armário de casacos", parte: "Quatro portas de giro, com a cava na altura da mão",
        cor: NOGUEIRA, ferragens: DOBRADICA, puxador: CAVA, medidas: "1000 × 2500 × 500 mm",
        descricao: "Guarda casacos, bolsas e guarda-chuvas logo na entrada.",
      })),
      marcenaria(noHall({
        id: "hall-sapateira", nome: "Sapateira", parte: "Quatro portas basculantes",
        cor: NOGUEIRA, ferragens: ARTICULADOR, puxador: CAVA, medidas: "600 × 2500 × 500 mm",
        descricao: "Os sapatos ficam na entrada, sem entrar no resto da casa.",
      })),
      marcenaria(noHall({
        id: "hall-aparador", nome: "Aparador suspenso", parte: "Duas gavetas sob o tampo de pedra",
        cor: FREIJO, ferragens: CORREDICA, puxador: CAVA, medidas: "1700 × 420 × 400 mm",
        descricao: "Lugar para chaves e correspondência, com o piso livre embaixo.",
      })),
      marcenaria(noHall({
        id: "hall-banco", nome: "Banco com gavetas", parte: "Assento estofado, duas gavetas, painel com ganchos e prateleira",
        cor: FREIJO, ferragens: CORREDICA, puxador: CAVA, medidas: "1600 × 450 × 420 mm",
        descricao: "Para sentar e calçar os sapatos, com ganchos para o que se usa todo dia.",
      })),
      acabamento(noHall({
        id: "hall-porta", nome: "Porta de entrada", parte: "Folha ripada com puxador vertical em metal",
        material: "Madeira (exemplo)", cor: NOGUEIRA, medidas: "1400 × 2500 mm",
        descricao: "Modelo ilustrativo. Em porta externa, material, fechadura e vedação são definidos para cada obra.",
      })),
      acabamento(noHall({
        id: "hall-painel", nome: "Painel ripado", parte: "Painel de parede com ripado vertical",
        material: MATERIAL, espessura: "18 mm", cor: FREIJO, medidas: "2100 × 2600 mm",
        descricao: "Recebe o aparador e o espelho, e aquece quem chega.",
      })),
      acabamento(noHall({
        id: "hall-tampo", nome: "Tampo do aparador", parte: "Tampo de pedra sobre as gavetas",
        material: "Travertino (exemplo)", espessura: "30 mm", medidas: "1740 × 30 × 440 mm",
        descricao: "A mesma pedra usada na área gourmet. Por ser porosa, precisa de impermeabilização.",
      })),
      acabamento(noHall({
        id: "hall-espelho", nome: "Espelho redondo", parte: "Espelho com moldura fina e luz atrás", material: "Espelho (exemplo)",
        medidas: "Ø 900 mm", descricao: "Para a última olhada antes de sair, com luz embutida atrás.",
      })),
      marcenaria(naLavanderia({
        id: "lav-limpeza", nome: "Armário de limpeza", parte: "Quatro portas de giro, fechando a ponta do L",
        cor: FREIJO, ferragens: DOBRADICA, puxador: CAVA, medidas: "700 × 2500 × 600 mm",
        descricao: "Guarda vassoura, rodo e produtos de limpeza fora de vista.",
      })),
      marcenaria(naLavanderia({
        id: "lav-rouparia", nome: "Rouparia", parte: "Quatro portas de giro e prateleiras",
        cor: FREIJO, ferragens: DOBRADICA, puxador: CAVA, medidas: "1000 × 2500 × 650 mm",
        descricao: "Toalhas e roupa de cama guardadas ao lado de onde são lavadas.",
      })),
      marcenaria(naLavanderia({
        id: "lav-braco-gavetas", nome: "Gaveteiro do L", parte: "Dois gavetões na parede da janela",
        cor: FREIJO, ferragens: CORREDICA, puxador: CAVA, medidas: "1200 × 770 × 580 mm",
        descricao: "Fica perto da bancada de dobrar, para guardar a roupa já pronta.",
      })),
      marcenaria(naLavanderia({
        id: "lav-braco-armario", nome: "Armário do L", parte: "Três portas de giro na parede da janela",
        cor: FREIJO, ferragens: DOBRADICA, puxador: CAVA, medidas: "1500 × 770 × 580 mm",
        descricao: "Guarda ferro, cestos e o que é usado de vez em quando.",
      })),
      marcenaria(naLavanderia({
        id: "lav-braco-aereos", nome: "Aéreos do L", parte: "Duas portas basculantes na parede da janela",
        cor: FREIJO, ferragens: ARTICULADOR, puxador: CAVA, medidas: "1920 × 800 × 330 mm",
        descricao: "Terminam antes da janela, para não tirar a luz da bancada.",
      })),
      acabamento(naLavanderia({
        id: "lav-braco-bancada", nome: "Bancada de dobrar", parte: "Tampo na parede da janela",
        material: "Pedra branca (exemplo)", espessura: "30 mm", medidas: "3630 × 30 × 620 mm",
        descricao: "Fica sob a janela e continua a bancada do tanque, formando o L.",
      })),
      acabamento(naLavanderia({
        id: "lav-tabua", nome: "Tábua de passar", parte: "Tábua rebatível sobre a bancada", material: "Tampo revestido em tecido (exemplo)",
        medidas: "360 × 1500 mm", descricao: "Modelo ilustrativo, para passar a roupa perto de onde ela é guardada. O sistema é definido em cada projeto.",
      })),
      acabamento(naLavanderia({
        id: "lav-cabideiro", nome: "Cabideiro", parte: "Painel, barra de metal e prateleira com luz",
        material: MATERIAL, espessura: "18 mm", cor: FREIJO, medidas: "1300 × 2550 × 420 mm",
        descricao: "Para pendurar a roupa recém-passada antes de levar para o armário.",
      })),
      marcenaria(naLavanderia({
        id: "lav-torre", nome: "Torre da lavadora e secadora", parte: "Laterais e armário superior com porta basculante",
        cor: FREIJO, ferragens: ARTICULADOR, puxador: CAVA, medidas: "800 × 2500 × 650 mm",
        descricao: "Os aparelhos ficam empilhados, e o espaço de cima vira armário.",
      })),
      marcenaria(naLavanderia({
        id: "lav-gavetas", nome: "Gaveteiro", parte: "Três gavetões",
        cor: FREIJO, ferragens: CORREDICA, puxador: CAVA, medidas: "1000 × 770 × 580 mm",
        descricao: "Para roupa de cama, panos e o que precisa ficar organizado.",
      })),
      marcenaria(naLavanderia({
        id: "lav-base-cuba", nome: "Armário do tanque", parte: "Duas portas de giro e nicho aberto com cestos",
        cor: FREIJO, ferragens: DOBRADICA, puxador: CAVA, medidas: "1800 × 770 × 580 mm",
        descricao: "Dá acesso às instalações do tanque, e os cestos separam a roupa suja.",
      })),
      marcenaria(naLavanderia({
        id: "lav-aereos", nome: "Armários aéreos", parte: "Duas portas basculantes",
        cor: FREIJO, ferragens: ARTICULADOR, puxador: CAVA, medidas: "2000 × 800 × 330 mm",
        descricao: "Guardam produtos no alto, com luz embutida sobre a bancada.",
      })),
      acabamento(naLavanderia({
        id: "lav-bancada", nome: "Bancada", parte: "Tampo sobre gaveteiro, tanque e nicho",
        material: "Pedra branca (exemplo)", espessura: "30 mm", medidas: "3700 × 30 × 620 mm",
        descricao: "Espaço para dobrar roupa. A pedra é escolhida para resistir a água e produtos de limpeza.",
      })),
      acabamento(naLavanderia({
        id: "lav-cuba", nome: "Tanque e torneira", parte: "Tanque de embutir e torneira", material: "Inox (exemplo)",
        medidas: "Conforme o modelo escolhido", descricao: "O vão na bancada segue as medidas do modelo definido pelo cliente.",
      })),
      acabamento(naLavanderia({
        id: "lav-revestimento", nome: "Azulejo", parte: "Revestimento entre a bancada e os armários", material: "Azulejo branco (exemplo)",
        medidas: "3700 × 600 mm", descricao: "Protege a parede dos respingos e é fácil de limpar.",
      })),
      acabamento(naLavanderia({
        id: "lav-prateleiras", nome: "Prateleiras iluminadas", parte: "Três prateleiras com luz embutida",
        material: MATERIAL, espessura: "30 mm", cor: FREIJO, medidas: "1350 × 30 × 280 mm",
        descricao: "Deixam cestos e frascos à mão.",
      })),
      acabamento(naLavanderia({
        id: "lav-varal", nome: "Varal de teto", parte: "Varal suspenso com hastes de inox", material: "Inox (exemplo)",
        medidas: "2200 × 720 mm", descricao: "Modelo ilustrativo. A fixação no teto é definida antes da obra.",
      })),
      eletro(naLavanderia({ id: "lav-lavadora", nome: "Lavadora", parte: "Aparelho embutido na torre", medidas: "720 × 840 × 600 mm", descricao: "Modelo ilustrativo. Água, esgoto e tomada seguem o aparelho escolhido por você." })),
      eletro(naLavanderia({ id: "lav-secadora", nome: "Secadora", parte: "Aparelho sobre a lavadora", medidas: "720 × 840 × 600 mm", descricao: "Modelo ilustrativo. A ventilação segue o manual do aparelho." })),
      marcenaria(noBanheiro({
        id: "ban-bancada", nome: "Bancada suspensa", parte: "Dois gavetões sob as cubas",
        cor: THAR, ferragens: CORREDICA, puxador: CAVA, medidas: "2800 × 470 × 520 mm",
        descricao: "Fica suspensa, com luz embaixo e o piso livre. Em área molhada, material e vedação são definidos para a umidade.",
      })),
      marcenaria(noBanheiro({
        id: "ban-espelheira", nome: "Armários com espelho", parte: "Quatro portas de giro revestidas de espelho",
        cor: "Frente em espelho", ferragens: DOBRADICA, puxador: CAVA, medidas: "2800 × 980 × 160 mm",
        descricao: "O espelho esconde prateleiras para o que se usa todo dia, com luz em cima e embaixo.",
      })),
      marcenaria(noBanheiro({
        id: "ban-armario", nome: "Armário de toalhas", parte: "Duas portas de giro",
        cor: NOGUEIRA, ferragens: DOBRADICA, puxador: CAVA, medidas: "650 × 2500 × 450 mm",
        descricao: "Guarda toalhas e roupões ao lado do box, longe dos respingos.",
      })),
      marcenaria(noBanheiro({
        id: "ban-banco", nome: "Banco com gaveta", parte: "Gaveta embaixo do assento",
        cor: NOGUEIRA, ferragens: CORREDICA, puxador: CAVA, medidas: "1000 × 450 × 400 mm",
        descricao: "Apoio ao lado da banheira, para toalhas e sais de banho.",
      })),
      acabamento(noBanheiro({
        id: "ban-tampo", nome: "Tampo de travertino", parte: "Tampo de pedra sobre a bancada",
        material: "Travertino (exemplo)", espessura: "40 mm", medidas: "2840 × 40 × 580 mm",
        descricao: "A mesma pedra da área gourmet. É porosa e precisa de impermeabilização, ainda mais em banheiro.",
      })),
      acabamento(noBanheiro({
        id: "ban-painel", nome: "Painel de madeira", parte: "Painel de parede com ripado no alto",
        material: MATERIAL, espessura: "18 mm", cor: NOGUEIRA, medidas: "2800 × 2600 mm",
        descricao: "Reveste a parede da bancada e aquece o ambiente junto com a pedra.",
      })),
      acabamento(noBanheiro({
        id: "ban-cubas", nome: "Cubas e torneiras", parte: "Duas cubas de apoio e torneiras em bronze", material: "Louça e metal (exemplo)",
        medidas: "Conforme o modelo escolhido", descricao: "Uma cuba para cada pessoa. O modelo é escolhido em cada projeto.",
      })),
      acabamento(noBanheiro({
        id: "ban-box", nome: "Box de vidro", parte: "Painel fixo de vidro com perfil em bronze", material: "Vidro temperado (exemplo)",
        medidas: "Conforme o ambiente", descricao: "Parede de travertino, nicho iluminado e passagem livre. As medidas são definidas na obra.",
      })),
      acabamento(noBanheiro({
        id: "ban-chuveiro", nome: "Chuveiro", parte: "Ducha de teto e registro em bronze", material: "Metal (exemplo)",
        medidas: "Ø 320 mm", descricao: "Modelo ilustrativo. A vazão e as instalações são definidas antes da obra.",
      })),
      acabamento(noBanheiro({
        id: "ban-banheira", nome: "Banheira", parte: "Banheira de pé com torneira de piso", material: "Louça (exemplo)",
        medidas: "840 × 560 × 1700 mm", descricao: "Modelo ilustrativo, sob a janela. O peso e a hidráulica precisam ser previstos na obra.",
      })),
      acabamento(noBanheiro({
        id: "ban-vaso", nome: "Vaso suspenso", parte: "Vaso suspenso com painel de madeira", material: "Louça (exemplo)",
        medidas: "Conforme o modelo escolhido", descricao: "Modelo ilustrativo. A caixa embutida fica atrás do painel.",
      })),
      eletro({ id: "coifa", nome: "Coifa de ilha", parte: "Eletrodoméstico suspenso sobre o cooktop", medidas: "700 × 950 × 420 mm", descricao: "Modelo ilustrativo. A exaustão precisa ser prevista antes da obra." }),
    ],
  };
})();
