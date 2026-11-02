// Modelo 3D: construirCozinha monta o ambiente; iniciarCozinha3D liga o modelo à lista de detalhes.
(function () {
  function sorteador(semente) {
    let s = semente;
    return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  }

  // Em aparelhos mais fracos, as texturas têm metade do lado: um quarto da memória.
  let escalaTexturas = 1;

  function telaDe(l, a, desenhar) {
    const c = document.createElement("canvas");
    c.width = Math.max(Math.round(l * escalaTexturas), 1);
    c.height = Math.max(Math.round(a * escalaTexturas), 1);
    const g = c.getContext("2d");
    g.scale(c.width / l, c.height / a);
    desenhar(g);
    return c;
  }

  function textura(T, canvas, repetirX = 1, repetirY = 1) {
    const t = new T.CanvasTexture(canvas);
    t.encoding = T.sRGBEncoding;
    t.wrapS = T.RepeatWrapping;
    t.wrapT = T.RepeatWrapping;
    t.repeat.set(repetirX, repetirY);
    return t;
  }

  // As texturas que se repetem são guardadas: a casa inteira usa as mesmas em todos os cômodos.
  const guardadas = {};
  function guardada(chave, criar) {
    if (!guardadas[chave]) guardadas[chave] = criar();
    return guardadas[chave];
  }

  function texturaMadeira(T, base, veio, semente) {
    return guardada(`madeira:${base}:${veio}:${semente}`, () => textura(T, telaDe(1024, 2048, (g) => {
      g.fillStyle = base;
      g.fillRect(0, 0, 1024, 2048);
      const r = sorteador(semente);
      for (let i = 0; i < 620; i += 1) {
        let x = r() * 1024;
        g.strokeStyle = veio;
        g.globalAlpha = 0.03 + r() * 0.17;
        g.lineWidth = 0.5 + r() * 3.5;
        g.beginPath();
        g.moveTo(x, 0);
        for (let y = 0; y <= 2048; y += 96) { x += (r() - 0.5) * 12; g.lineTo(x, y); }
        g.stroke();
      }
    })));
  }

  // Porcelanato cinza-cimento de 90 × 90 cm, com veios suaves e rejunte fino.
  function texturaCeramica(T, largura, profundidade) {
    return textura(T, telaDe(1024, 1024, (g) => {
      g.fillStyle = "#5f5c56";
      g.fillRect(0, 0, 1024, 1024);
      const r = sorteador(77);
      for (let i = 0; i < 70; i += 1) {
        g.strokeStyle = r() > 0.5 ? "#4a4743" : "#75716a";
        g.globalAlpha = 0.05 + r() * 0.22;
        g.lineWidth = 0.6 + r() * 2.4;
        let x = r() * 1024;
        let y = r() * 1024;
        g.beginPath();
        g.moveTo(x, y);
        for (let k = 0; k < 8; k += 1) { x += (r() - 0.3) * 90; y += (r() - 0.5) * 70; g.lineTo(x, y); }
        g.stroke();
      }
      g.globalAlpha = 1;
      g.strokeStyle = "#33312e";
      g.lineWidth = 5;
      g.strokeRect(0, 0, 1024, 1024);
    }), largura / 0.9, profundidade / 0.9);
  }

  // Parede de tijolinho aparente, para a área gourmet.
  function texturaTijolo(T, repetirX, repetirY) {
    return textura(T, telaDe(1024, 1024, (g) => {
      g.fillStyle = "#2b211b";
      g.fillRect(0, 0, 1024, 1024);
      const r = sorteador(53);
      const FILAS = 8;
      const COLUNAS = 4;
      const a = 1024 / FILAS;
      const l = 1024 / COLUNAS;
      for (let f = 0; f < FILAS; f += 1) {
        for (let c = -1; c <= COLUNAS; c += 1) {
          const tom = 62 + Math.floor(r() * 26);
          g.fillStyle = `rgb(${tom + 30},${tom - 14},${tom - 34})`;
          g.fillRect(c * l + (f % 2 ? l / 2 : 0) + 4, f * a + 4, l - 8, a - 8);
        }
      }
    }), repetirX, repetirY);
  }

  // Travertino: tom bege, faixas horizontais e os pequenos furos típicos da pedra. A tela cobre 1,6 m.
  function texturaTravertino(T, largura, profundidade) {
    return textura(T, telaDe(1024, 1024, (g) => {
      g.fillStyle = "#a8926f";
      g.fillRect(0, 0, 1024, 1024);
      const r = sorteador(83);
      for (let i = 0; i < 70; i += 1) {
        g.fillStyle = r() > 0.5 ? "#b9a688" : "#94805f";
        g.globalAlpha = 0.1 + r() * 0.16;
        g.beginPath();
        g.ellipse(r() * 1024, r() * 1024, 90 + r() * 200, 24 + r() * 60, 0, 0, 6.3);
        g.fill();
      }
      for (let i = 0; i < 150; i += 1) {
        g.strokeStyle = ["#8f7856", "#c2ae8c", "#766143"][Math.floor(r() * 3)];
        g.globalAlpha = 0.1 + r() * 0.25;
        g.lineWidth = 0.6 + r() * 2.6;
        let x = r() * 1024;
        let y = r() * 1024;
        g.beginPath();
        g.moveTo(x, y);
        for (let k = 0; k < 5; k += 1) { x += 40 + r() * 80; y += (r() - 0.5) * 12; g.lineTo(x, y); }
        g.stroke();
      }
      for (let i = 0; i < 1100; i += 1) {
        g.fillStyle = "#4a3a26";
        g.globalAlpha = 0.45 + r() * 0.5;
        g.fillRect(r() * 1024, r() * 1024, 3 + r() * 20, 1.5 + r() * 3);
      }
    }), largura / 1.6, profundidade / 1.6);
  }

  // Azulejo branco de 15 × 15 cm, com rejunte fino.
  function texturaAzulejo(T, largura, altura) {
    return textura(T, telaDe(256, 256, (g) => {
      g.fillStyle = "#f1eee8";
      g.fillRect(0, 0, 256, 256);
      g.strokeStyle = "#c9c4ba";
      g.lineWidth = 6;
      g.strokeRect(0, 0, 256, 256);
    }), largura / 0.15, altura / 0.15);
  }

  // Água da piscina: azul com os reflexos de luz vistos no fundo.
  function texturaAgua(T, repetirX, repetirY) {
    return textura(T, telaDe(1024, 1024, (g) => {
      g.fillStyle = "#2f93a8";
      g.fillRect(0, 0, 1024, 1024);
      const r = sorteador(61);
      for (let i = 0; i < 150; i += 1) {
        g.strokeStyle = r() > 0.5 ? "#8fe0e4" : "#1c7488";
        g.globalAlpha = 0.1 + r() * 0.25;
        g.lineWidth = 1 + r() * 3;
        let x = r() * 1024;
        let y = r() * 1024;
        g.beginPath();
        g.moveTo(x, y);
        for (let k = 0; k < 5; k += 1) { x += (r() - 0.5) * 110; y += (r() - 0.5) * 110; g.lineTo(x, y); }
        g.stroke();
      }
    }), repetirX, repetirY);
  }

  // Muro coberto de folhas, que fecha o jardim.
  function texturaSebe(T, repetirX, repetirY) {
    return textura(T, telaDe(1024, 1024, (g) => {
      g.fillStyle = "#233a22";
      g.fillRect(0, 0, 1024, 1024);
      const r = sorteador(67);
      for (let i = 0; i < 3200; i += 1) {
        g.fillStyle = ["#2f5230", "#3c6a38", "#1d3320", "#4c7c42"][Math.floor(r() * 4)];
        g.globalAlpha = 0.55 + r() * 0.45;
        g.beginPath();
        g.ellipse(r() * 1024, r() * 1024, 6 + r() * 12, 3 + r() * 6, r() * 3.14, 0, 6.3);
        g.fill();
      }
    }), repetirX, repetirY);
  }

  // Céu claro de fim de tarde, atrás do que é aberto.
  function texturaCeu(T) {
    const t = new T.CanvasTexture(telaDe(16, 256, (g) => {
      const d = g.createLinearGradient(0, 0, 0, 256);
      d.addColorStop(0, "#7fb3d6");
      d.addColorStop(1, "#e6eef0");
      g.fillStyle = d;
      g.fillRect(0, 0, 16, 256);
    }));
    t.encoding = T.sRGBEncoding;
    return t;
  }

  // Pintura fosca, com a leve variação de um rolo.
  function texturaPintura(T, cor) {
    return guardada(`pintura:${cor}`, () => textura(T, telaDe(1024, 1024, (g) => {
      g.fillStyle = cor;
      g.fillRect(0, 0, 1024, 1024);
      const r = sorteador(31);
      for (let i = 0; i < 5200; i += 1) {
        g.globalAlpha = 0.012 + r() * 0.03;
        g.fillStyle = r() > 0.5 ? "#ffffff" : "#000000";
        g.fillRect(r() * 1024, r() * 1024, 1 + r() * 9, 1 + r() * 9);
      }
    }), 3, 2));
  }

  // Fechamento com amortecedor: a porta vem rápido e freia nos últimos centímetros.
  window.curvaFechamento = function (t) {
    if (t <= 0) return 1;
    if (t >= 1) return 0;
    const CORTE = 0.36;
    const RESTANTE = 0.12;
    if (t < CORTE) {
      const u = t / CORTE;
      return 1 - (1 - RESTANTE) * u * u * (3 - 2 * u);
    }
    const u = (t - CORTE) / (1 - CORTE);
    return RESTANTE * (1 - u) * (1 - u);
  };

  window.curvaAbertura = (t) => (t >= 1 ? 1 : 1 - (1 - t) ** 3);

  // Tempo de cada movimento, em milissegundos. Fechar leva mais tempo, para mostrar o amortecedor;
  // a porta de correr é pesada, então também abre devagar e freia no fim.
  window.DURACAO_MOVIMENTO = (tipo, abrindo) => {
    if (abrindo) return tipo === "correr" ? 1800 : 700;
    return 2600;
  };

  // Textura de assoalho de madeira, em réguas, para a sala.
  function texturaPisoMadeira(T, largura, profundidade, tomBase = 62) {
    return textura(T, telaDe(1024, 1024, (g) => {
      const r = sorteador(41);
      const REGUAS = 6;
      for (let i = 0; i < REGUAS; i += 1) {
        const l = 1024 / REGUAS;
        const tom = tomBase + Math.floor(r() * 18);
        g.fillStyle = `rgb(${tom + 34},${tom + 2},${tom - 36})`;
        g.fillRect(i * l, 0, l, 1024);
        for (let k = 0; k < 40; k += 1) {
          g.strokeStyle = "#3e2a18";
          g.globalAlpha = 0.03 + r() * 0.09;
          g.lineWidth = 0.5 + r() * 2;
          const x = i * l + r() * l;
          g.beginPath();
          g.moveTo(x, 0);
          g.bezierCurveTo(x + r() * 14 - 7, 340, x + r() * 14 - 7, 680, x + r() * 8 - 4, 1024);
          g.stroke();
        }
        g.globalAlpha = 0.75;
        g.fillStyle = "#2c1d10";
        g.fillRect(i * l, 0, 2, 1024);
        g.fillRect(i * l, r() * 1024, l, 2);
        g.globalAlpha = 1;
      }
    }), largura / 1.2, profundidade / 1.2);
  }

  // Luz do LED no fundo dos armários: mais forte em cima, onde fica a fita.
  function texturaBrilho(T) {
    return textura(T, telaDe(32, 512, (g) => {
      const d = g.createLinearGradient(0, 0, 0, 512);
      d.addColorStop(0, "#ffffff");
      d.addColorStop(0.55, "#8a8a8a");
      d.addColorStop(1, "#3a3a3a");
      g.fillStyle = d;
      g.fillRect(0, 0, 32, 512);
    }));
  }

  // Mancha escura e macia sob os móveis, que os "assenta" no chão.
  function texturaContato(T) {
    const t = new T.CanvasTexture(telaDe(256, 256, (g) => {
      const d = g.createRadialGradient(128, 128, 10, 128, 128, 128);
      d.addColorStop(0, "rgba(0,0,0,.62)");
      d.addColorStop(0.6, "rgba(0,0,0,.34)");
      d.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = d;
      g.fillRect(0, 0, 256, 256);
    }));
    return t;
  }

  // Enquanto a casa é montada, guarda as medidas e as portas do cômodo da vez. Fora dela, é nulo.
  let comodoDaCasa = null;

  function criarKit(T, modulos) {
    const casa = comodoDaCasa;
    const cena = new T.Scene();
    cena.background = new T.Color(0x0d0d0d);
    const pecas = {};
    const moveis = [];
    for (const m of modulos) pecas[m.id] = [];

    // As cores abaixo estão em sRGB, como em um seletor de cor; o Three trabalha em linear.
    const padrao = (o) => {
      const material = new T.MeshStandardMaterial({ roughness: 0.65, metalness: 0, ...o });
      if (o.color !== undefined) material.color.convertSRGBToLinear();
      return material;
    };
    const M = {
      freijo: padrao({ map: texturaMadeira(T, "#9a6a43", "#4e2e17", 11), roughness: 0.48 }),
      cinza: padrao({ color: 0x74746f, roughness: 0.55 }),
      interno: padrao({ color: 0xece9e2, roughness: 0.6 }),
      pedra: padrao({ color: 0xf0ede6, roughness: 0.16, metalness: 0.02 }),
      sombra: padrao({ color: 0x050505, roughness: 0.95 }),
      inox: padrao({ color: 0xc6c9ca, metalness: 0.92, roughness: 0.26 }),
      preto: padrao({ color: 0x101114, metalness: 0.35, roughness: 0.14 }),
      perfil: padrao({ color: 0x17171a, metalness: 0.7, roughness: 0.35 }),
      vidro: padrao({ color: 0xdfeeee, transparent: true, opacity: 0.16, roughness: 0.02, metalness: 0.15, depthWrite: false }),
      taca: padrao({ color: 0xffffff, transparent: true, opacity: 0.36, roughness: 0.03, depthWrite: false }),
      rodape: padrao({ color: 0xece9e2, roughness: 0.5 }),
      tecido: padrao({ color: 0x3a3733, roughness: 0.92 }),
      ceramicaBranca: padrao({ color: 0xf1eee8, roughness: 0.22 }),
      verde: padrao({ color: 0x41603d, roughness: 0.8 }),
      terra: padrao({ color: 0x8c5a3c, roughness: 0.75 }),
      fruta: padrao({ color: 0xd98a2b, roughness: 0.5 }),
      fruta2: padrao({ color: 0xb2342a, roughness: 0.45 }),
      quadro: padrao({ color: 0xe9e4da, roughness: 0.8 }),
      arte: padrao({ color: 0x9c6d4a, roughness: 0.8 }),
      arte2: padrao({ color: 0x38423a, roughness: 0.8 }),
      led: new T.MeshBasicMaterial({ color: 0xffe2b4 }),
      ceu: new T.MeshBasicMaterial({ color: 0xdcebf2 }),
    };

    // Enquanto um móvel está sendo montado, as peças novas ficam guardadas para entrar no grupo dele.
    let coletor = null;

    function registrar(mesh, modulo, material) {
      mesh.castShadow = !material.transparent;
      mesh.receiveShadow = !material.transparent;
      if (modulo) { mesh.userData.modulo = modulo; pecas[modulo].push(mesh); }
      cena.add(mesh);
      if (coletor) coletor.push(mesh);
      return mesh;
    }

    // Cada módulo tem uma cópia só de cada material, para o destaque valer para o módulo inteiro.
    const copias = {};
    function materialDe(modulo, material) {
      if (!modulo) return material;
      const chave = `${modulo}:${material.uuid}`;
      if (!copias[chave]) copias[chave] = material.clone();
      return copias[chave];
    }

    const CUBO = new T.BoxGeometry(1, 1, 1);
    const cilindros = {};
    function formaCilindro(r1, r2, a, lados) {
      const chave = [r1, r2, a, lados].join();
      if (!cilindros[chave]) cilindros[chave] = new T.CylinderGeometry(r1, r2, a, lados);
      return cilindros[chave];
    }

    // x, y e z marcam o canto da peça: y a partir do piso, z a partir da parede.
    function caixa(modulo, l, a, p, x, y, z, material) {
      const mesh = new T.Mesh(CUBO, materialDe(modulo, material));
      mesh.scale.set(l, a, p);
      mesh.position.set(x + l / 2, y + a / 2, z + p / 2);
      return registrar(mesh, modulo, material);
    }

    function cilindro(modulo, r1, r2, a, x, y, z, material, lados = 32) {
      const mesh = new T.Mesh(formaCilindro(r1, r2, a, lados), materialDe(modulo, material));
      mesh.position.set(x, y + a / 2, z);
      return registrar(mesh, modulo, material);
    }

    const ESFERA = new T.SphereGeometry(1, 24, 16);
    function esfera(raio, x, y, z, material) {
      const mesh = new T.Mesh(ESFERA, material);
      mesh.scale.setScalar(raio);
      mesh.position.set(x, y, z);
      return registrar(mesh, null, material);
    }

    function movel(modulo, tipo, pivo, eixo, aberto, montar) {
      coletor = [];
      montar();
      const grupo = new T.Group();
      grupo.position.set(pivo[0], pivo[1], pivo[2]);
      for (const mesh of coletor) { mesh.position.sub(grupo.position); grupo.add(mesh); }
      coletor = null;
      cena.add(grupo);
      moveis.push({ modulo, tipo, grupo, eixo, aberto, base: grupo.position.z });
    }

    function aplicarAbertura(m, p) {
      if (m.eixo === "z") m.grupo.position.z = m.base + m.aberto * p;
      else m.grupo.rotation[m.eixo] = m.aberto * p;
    }

    const ESPESSURA = 0.018;
    const ABERTURA_MAXIMA = Math.PI / 2; // portas de giro abrem no máximo 90 graus

    // Caixa oca de armário: laterais, base, topo, fundo e prateleiras.
    function gabinete(modulo, l, a, p, x, y, z, material = M.interno, prateleiras = []) {
      const e = ESPESSURA;
      caixa(modulo, e, a, p, x, y, z, material);
      caixa(modulo, e, a, p, x + l - e, y, z, material);
      caixa(modulo, l - 2 * e, e, p, x + e, y, z, material);
      caixa(modulo, l - 2 * e, e, p, x + e, y + a - e, z, material);
      caixa(modulo, l - 2 * e, a - 2 * e, 0.006, x + e, y + e, z, material);
      for (const altura of prateleiras) caixa(modulo, l - 2 * e, e, p - 0.03, x + e, y + altura, z + 0.01, material);
    }

    // Frente com cava: a madeira é rebaixada em rampa até uma fresta escura, onde entram os dedos.
    // z é sempre a face externa da caixa; sentido 1 aponta para longe da parede, -1 para a parede.
    function frente(modulo, l, a, x, y, z, material, opcoes = {}) {
      const { cavaEmbaixo = false, sentido = 1 } = opcoes;
      const FOLGA = 0.008;
      const CAVA = 0.075;
      const RAMPA = 0.046;
      const FUNDO_CAVA = 0.016;
      const zPainel = sentido > 0 ? z : z - ESPESSURA;
      const yPainel = y + FOLGA / 2 + (cavaEmbaixo ? CAVA : 0);
      caixa(modulo, l - FOLGA, a - FOLGA - CAVA, ESPESSURA, x + FOLGA / 2, yPainel, zPainel, material);
      const yFresta = cavaEmbaixo ? y + FOLGA / 2 : y + a - FOLGA / 2 - CAVA;
      caixa(modulo, l - FOLGA, CAVA, 0.004, x + FOLGA / 2, yFresta, sentido > 0 ? z : z - 0.004, M.sombra);
      const compr = Math.hypot(RAMPA, FUNDO_CAVA);
      const rampa = caixa(modulo, l - FOLGA, compr, 0.004, x + FOLGA / 2, 0, 0, material);
      const yCentro = cavaEmbaixo ? yFresta + CAVA - RAMPA / 2 : yFresta + RAMPA / 2;
      const zCentro = z + sentido * (ESPESSURA - FUNDO_CAVA / 2);
      rampa.position.set(x + l / 2, yCentro, zCentro);
      rampa.rotation.x = (cavaEmbaixo ? 1 : -1) * sentido * Math.atan2(FUNDO_CAVA, RAMPA);
    }

    function portaGiro(modulo, l, a, x, y, z, material, dobradica, opcoes = {}) {
      const { sentido = 1 } = opcoes;
      const pivoX = dobradica === "esquerda" ? x : x + l;
      const lado = dobradica === "esquerda" ? -1 : 1;
      movel(modulo, "giro", [pivoX, y, z], "y", lado * sentido * ABERTURA_MAXIMA, () => frente(modulo, l, a, x, y, z, material, opcoes));
    }

    function portaBasculante(modulo, l, a, x, y, z, material) {
      movel(modulo, "basculante", [x, y + a, z], "x", -1.2, () => frente(modulo, l, a, x, y, z, material, { cavaEmbaixo: true }));
    }

    function gaveta(modulo, l, a, x, y, z, prof, material, sentido = 1, recheio = null, interno = M.interno) {
      const zInterno = sentido > 0 ? z - prof : z;
      movel(modulo, "gaveta", [x, y, z], "z", sentido * 0.42, () => {
        frente(modulo, l, a, x, y, z, material, { sentido });
        const m = 0.03;
        const alt = Math.max(a - 0.09, 0.08);
        caixa(modulo, l - 2 * m, 0.012, prof, x + m, y + 0.02, zInterno, interno);
        caixa(modulo, 0.012, alt, prof, x + m, y + 0.02, zInterno, interno);
        caixa(modulo, 0.012, alt, prof, x + l - m - 0.012, y + 0.02, zInterno, interno);
        caixa(modulo, l - 2 * m, alt, 0.012, x + m, y + 0.02, sentido > 0 ? zInterno : zInterno + prof - 0.012, interno);
        if (recheio) recheio(x + l / 2, y + 0.032, zInterno + prof / 2);
      });
    }

    function portaVidro(modulo, l, a, x, y, z, dobradica, { vidro = M.vidro, perfil = M.perfil } = {}) {
      const pivoX = dobradica === "esquerda" ? x : x + l;
      const lado = dobradica === "esquerda" ? -1 : 1;
      movel(modulo, "giro", [pivoX, y, z], "y", lado * ABERTURA_MAXIMA, () => {
        const P = 0.022;
        caixa(modulo, l - 0.004, a - 0.004, 0.005, x + 0.002, y + 0.002, z + 0.008, vidro);
        caixa(modulo, l - 0.004, P, 0.02, x + 0.002, y + 0.002, z, perfil);
        caixa(modulo, l - 0.004, P, 0.02, x + 0.002, y + a - P - 0.002, z, perfil);
        caixa(modulo, P, a - 0.004, 0.02, x + 0.002, y + 0.002, z, perfil);
        caixa(modulo, P, a - 0.004, 0.02, x + l - P - 0.002, y + 0.002, z, perfil);
      });
    }

    // Peças repetidas são desenhadas de uma vez só, o que deixa o modelo bem mais leve.
    const posTacas = [];
    function tacas(x0, x1, y, z) {
      for (let x = x0; x < x1; x += 0.13) posTacas.push([x, y, z]);
    }
    function repetir(geometria, material, matrizes, comSombra) {
      const grupo = new T.InstancedMesh(geometria, material, matrizes.length);
      matrizes.forEach((m, i) => grupo.setMatrixAt(i, m));
      grupo.instanceMatrix.needsUpdate = true;
      grupo.castShadow = comSombra;
      grupo.frustumCulled = false;
      cena.add(grupo);
      return grupo;
    }

    function pratos(x, y, z) {
      cilindro(null, 0.115, 0.09, 0.07, x, y, z, M.ceramicaBranca, 24);
    }

    const ESPESSURA_KIT = ESPESSURA;

    function comoLateral(montar) {
      if (casa && !casa.janela) return; // parede interna: sem janela nem cortina
      coletor = [];
      montar();
      for (const mesh of coletor) mesh.userData.ladoEsquerdo = true;
      coletor = null;
    }

    const manchaContato = padraoContato();
    function padraoContato() {
      return new T.MeshBasicMaterial({ map: texturaContato(T), transparent: true, depthWrite: false });
    }
    const PLANO = new T.PlaneGeometry(1, 1);
    function sombraContato(x, z, l, p) {
      const m = new T.Mesh(PLANO, manchaContato);
      m.name = "sombra-contato";
      m.rotation.x = -Math.PI / 2;
      m.scale.set(l * 1.25, p * 1.25, 1);
      m.position.set(x + l / 2, 0.004, z + p / 2);
      cena.add(m);
    }

    function planta(x, z) {
      sombraContato(x - 0.28, z - 0.28, 0.56, 0.56);
      cilindro(null, 0.21, 0.16, 0.42, x, 0, z, M.terra);
      cilindro(null, 0.022, 0.03, 0.8, x, 0.42, z, M.terra, 12);
      const r = sorteador(19);
      const folhas = [];
      for (let i = 0; i < 46; i += 1) {
        const raio = 0.075 + r() * 0.06;
        folhas.push(new T.Matrix4().compose(
          new T.Vector3(x + (r() - 0.5) * 0.62, 1.05 + r() * 0.72, z + (r() - 0.5) * 0.62),
          new T.Quaternion().setFromEuler(new T.Euler(r() * 3, r() * 3, r() * 3)),
          new T.Vector3(raio, raio * 0.5, raio * 0.42)
        ));
      }
      repetir(new T.SphereGeometry(1, 14, 10), M.verde, folhas, true);
    }

    // Piso, paredes pintadas, teto com spots e janela na lateral: comum a todos os cômodos.
    // fimCoberto limita parede do fundo e teto, para ambientes abertos de um lado.
    function casca({ piso, corFundo, corLado, spots, inicioRodape = 5.04, mapaFundo = null, fimCoberto = null, corTeto = 0xe8e5de, alturaSpots = 2.847, rebaixo = null }) {
      const LARGURA = casa ? casa.largura : 14;
      const PROF = casa ? casa.prof : 12;
      const INICIO = casa ? -0.7 : -6;
      if (casa) piso.mapa.repeat.multiply(new T.Vector2((LARGURA - INICIO) / 20, PROF / 12));
      const chao = new T.Mesh(new T.PlaneGeometry(LARGURA - INICIO, PROF), padrao({ map: piso.mapa, roughness: piso.rugosidade, metalness: 0 }));
      chao.rotation.x = -Math.PI / 2;
      chao.position.set((LARGURA + INICIO) / 2, 0, PROF / 2);
      chao.receiveShadow = true;
      chao.name = piso.nome;
      cena.add(chao);

      // Na casa, a câmera costuma ficar fora do cômodo. Piso e teto seguem até ela, só no cômodo
      // aberto e abaixo do nível do vizinho, para a imagem não terminar no gramado ou no céu.
      if (casa) {
        const EXTRA = 9;
        const fimExtra = fimCoberto === null ? LARGURA : fimCoberto;
        const formaExtra = new T.PlaneGeometry(fimExtra - INICIO, EXTRA);
        const uv = formaExtra.attributes.uv;
        for (let i = 0; i < uv.count; i += 1) uv.setXY(i, uv.getX(i) * (fimExtra - INICIO) / (LARGURA - INICIO), uv.getY(i) * EXTRA / PROF);
        const pisoExtra = new T.Mesh(formaExtra, chao.material);
        pisoExtra.rotation.x = -Math.PI / 2;
        pisoExtra.position.set((fimExtra + INICIO) / 2, -0.008, PROF + EXTRA / 2 - 0.1);
        pisoExtra.name = "extensao";
        pisoExtra.userData.soAberto = true;
        cena.add(pisoExtra);
        if (fimCoberto === null) {
          const tetoExtra = new T.Mesh(formaExtra, padrao({ color: corTeto, roughness: 0.95 }));
          tetoExtra.rotation.x = Math.PI / 2;
          tetoExtra.position.set((fimExtra + INICIO) / 2, rebaixo ? 2.652 : 2.852, PROF + EXTRA / 2 - 0.1);
          tetoExtra.name = "extensao";
          tetoExtra.userData.soAberto = true;
          cena.add(tetoExtra);
        }
      }

      const fimFundo =fimCoberto === null ? (casa ? LARGURA : LARGURA - 0.7) : fimCoberto;
      const pinturaFundo = padrao({ map: mapaFundo || texturaPintura(T, corFundo), roughness: 0.92 });
      if (casa) paredesDaCasa(fimFundo, pinturaFundo, padrao({ map: texturaPintura(T, corLado), roughness: 0.92 }));
      else {
        const paredeFundo = caixa(null, fimFundo + 0.7, 4.2, 0.05, -0.7, 0, -0.05, pinturaFundo);
        paredeFundo.name = "parede-pintada";
        paredeFundo.castShadow = false;
      }
      // O rodapé para antes de uma porta na parede do fundo
      const fimRodape = casa && casa.portas && casa.portas.fundo ? Math.min(fimFundo, ...casa.portas.fundo.map((v) => v.a)) : fimFundo + (casa ? 0 : 0.04);
      if (fimRodape > inicioRodape) caixa(null, fimRodape - inicioRodape, 0.1, 0.014, inicioRodape, 0, 0, M.rodape);

      if (!casa) comoLateral(() => {
        const lateral = caixa(null, 0.05, 4.2, 12, -0.75, 0, -0.05, padrao({ map: texturaPintura(T, corLado), roughness: 0.92 }));
        lateral.castShadow = false;
        caixa(null, 0.014, 0.1, 12, -0.7, 0, 0, M.rodape);
        caixa(null, 0.01, 1.3, 1.9, -0.7, 0.95, 2.3, M.ceu);
        for (const z of [2.27, 3.2, 4.2]) caixa(null, 0.05, 1.36, 0.04, -0.7, 0.92, z, M.perfil);
        for (const y of [0.92, 2.26]) caixa(null, 0.05, 0.04, 1.97, -0.7, y, 2.27, M.perfil);
      });

      // Teto de gesso, visível só de baixo, com spots embutidos
      const fimTeto = fimCoberto === null ? LARGURA : fimCoberto;
      const teto = new T.Mesh(new T.PlaneGeometry(fimTeto - INICIO, PROF), padrao({ color: corTeto, roughness: 0.95 }));
      teto.rotation.x = Math.PI / 2;
      teto.position.set((fimTeto + INICIO) / 2, 2.85, PROF / 2);
      teto.name = "teto";
      teto.userData.teto = true;
      cena.add(teto);
      // Teto rebaixado de gesso, com recorte central e luz embutida. Só é visível de baixo.
      const Y_REBAIXO = 2.65;
      const noRebaixo = (x, z) => rebaixo && !(x > rebaixo.x0 && x < rebaixo.x1 && z > rebaixo.z0 && z < rebaixo.z1);
      if (rebaixo) {
        const { x0, z0 } = rebaixo;
        const x1 = Math.min(rebaixo.x1, LARGURA - 0.3);
        const z1 = Math.min(rebaixo.z1, PROF - 0.3);
        const gesso = padrao({ color: corTeto, roughness: 0.95 });
        const plano = (l, a, x, y, z, rotX, rotY) => {
          const m = new T.Mesh(PLANO, gesso);
          m.name = "teto-rebaixado";
          m.userData.teto = true;
          m.scale.set(l, a, 1);
          m.position.set(x, y, z);
          m.rotation.set(rotX, rotY, 0);
          cena.add(m);
        };
        const faixa = (xa, xb, za, zb) => plano(xb - xa, zb - za, (xa + xb) / 2, Y_REBAIXO, (za + zb) / 2, Math.PI / 2, 0);
        faixa(INICIO, LARGURA, 0, z0);
        faixa(INICIO, LARGURA, z1, PROF);
        faixa(INICIO, x0, z0, z1);
        faixa(x1, LARGURA, z0, z1);
        const yBorda = (Y_REBAIXO + 2.85) / 2;
        plano(x1 - x0, 0.2, (x0 + x1) / 2, yBorda, z0, 0, 0);
        plano(x1 - x0, 0.2, (x0 + x1) / 2, yBorda, z1, 0, Math.PI);
        plano(z1 - z0, 0.2, x0, yBorda, (z0 + z1) / 2, 0, Math.PI / 2);
        plano(z1 - z0, 0.2, x1, yBorda, (z0 + z1) / 2, 0, -Math.PI / 2);
        const luz = new T.MeshBasicMaterial({ color: 0xffd9a6 });
        for (const [l, p, x, z] of [[x1 - x0, 0.012, x0, z0 + 0.03], [x1 - x0, 0.012, x0, z1 - 0.042], [0.012, z1 - z0, x0 + 0.03, z0], [0.012, z1 - z0, x1 - 0.042, z0]]) {
          const linha = caixa(null, l, 0.012, p, x, Y_REBAIXO + 0.012, z, luz);
          linha.castShadow = false;
          linha.userData.teto = true;
        }
      }
      const formaSpot = new T.CylinderGeometry(0.05, 0.05, 0.004, 20);
      repetir(formaSpot, M.led, spots.map(([x, z]) => new T.Matrix4().makeTranslation(x, noRebaixo(x, z) ? Y_REBAIXO - 0.003 : alturaSpots, z)), false).userData.teto = true;
    }

    // Paredes da casa: planos que só aparecem por dentro. Assim a câmera enxerga o cômodo por fora,
    // e a maquete fica aberta. Cada parede pode ter vãos de porta, com uma placa para o cômodo vizinho.
    function paredesDaCasa(fimFundo, pinturaFundo, pinturaLado) {
      const ALT = 2.85;
      const ALT_PORTA = 2.1;
      const { largura: L, prof: P, portas = {}, semParede = {} } = casa;
      const coberto = fimFundo < L;
      // Porta de madeira escura, a mesma em toda a casa
      const folha = new T.MeshStandardMaterial({ map: texturaMadeira(T, "#35231a", "#140b07", 37), roughness: 0.45 });
      const batente = new T.MeshStandardMaterial({ map: texturaMadeira(T, "#35231a", "#140b07", 37), roughness: 0.6 });
      for (const para of Object.values(semParede)) casa.vaos.push({ de: casa.id, para, malha: null, aberta: true });
      const plano = (l, a, x, y, z, rotY, material) => {
        const m = new T.Mesh(PLANO, material);
        m.scale.set(l, a, 1);
        m.position.set(x, y, z);
        m.rotation.y = rotY;
        m.receiveShadow = true;
        cena.add(m);
        return m;
      };
      // Cada lado: início e fim na parede, ponto para cada posição e giro que aponta para dentro.
      // Direita e frente ficam um pouco recuadas: encostam nos móveis do cômodo vizinho, e no mesmo
      // plano a imagem misturaria os dois, como se o móvel atravessasse a parede.
      const RECUO = 0.03;
      const lados = {
        fundo: { fim: fimFundo, ponto: (t) => [t, 0], giro: 0, material: pinturaFundo, inicio: -0.7 },
        esquerda: { fim: P, ponto: (t) => [-0.7, t], giro: Math.PI / 2, material: pinturaLado },
        direita: { fim: P, ponto: (t) => [L - RECUO, t], giro: -Math.PI / 2, material: pinturaLado, omitir: coberto },
        frente: { fim: fimFundo, ponto: (t) => [t, P - RECUO], giro: Math.PI, material: pinturaLado, inicio: -0.7 },
      };
      const contorno = padrao({ color: 0x24211d, roughness: 0.9 });
      const topo = (l, p, x, z) => {
        const c = caixa(null, l, 0.03, p, x, ALT, z, contorno);
        c.castShadow = false;
        c.userData.soMaquete = true;
      };
      topo(fimFundo + 0.76, 0.06, -0.73, -0.03);
      if (!semParede.esquerda) topo(0.06, P, -0.73, 0);
      if (!coberto) topo(0.06, P, L - 0.03, 0);
      topo(fimFundo + 0.76, 0.06, -0.73, P - 0.03);
      for (const [nome, lado] of Object.entries(lados)) {
        if (lado.omitir || semParede[nome]) continue;
        const inicio = lado.inicio === undefined ? 0 : lado.inicio;
        const fim = lado.fim;
        const vaos = [...(portas[nome] || [])].sort((p, q) => p.a - q.a);
        let t = inicio;
        const trecho = (a, b, y0, y1) => {
          if (b - a < 0.001) return;
          const [x, z] = lado.ponto((a + b) / 2);
          const pedaco = plano(b - a, y1 - y0, x, (y0 + y1) / 2, z, lado.giro, lado.material);
          if (nome === "fundo") pedaco.name = "parede-pintada";
        };
        for (const v of vaos) {
          const ALT_VAO = v.aberta ? 2.45 : ALT_PORTA;
          trecho(t, v.a, 0, ALT);
          trecho(v.a, v.b, ALT_VAO, ALT);
          // Batentes e área de clique do vão, com a placa que leva ao cômodo vizinho
          const [cx, cz] = lado.ponto((v.a + v.b) / 2);
          const dentro = 0.012;
          const nx = nome === "esquerda" ? dentro : nome === "direita" ? -dentro : 0;
          const nz = nome === "frente" ? -dentro : nome === "fundo" ? dentro : 0;
          // Batentes em plano, para não aparecerem na frente da câmera quando ela está fora do cômodo
          for (const u of [v.a, v.b]) {
            const [bx, bz] = lado.ponto(u);
            plano(0.09, ALT_VAO + 0.05, bx + nx, (ALT_VAO + 0.05) / 2, bz + nz, lado.giro, v.aberta ? M.freijo : batente).receiveShadow = false;
          }
          plano(v.b - v.a + 0.09, 0.09, cx + nx, ALT_VAO + 0.01, cz + nz, lado.giro, v.aberta ? M.freijo : batente).receiveShadow = false;
          // Vão largo fica livre; nos outros, uma porta fechada, que leva ao vizinho ao ser clicada.
          const vao = plano(v.b - v.a, ALT_VAO, cx, ALT_VAO / 2, cz, lado.giro, v.aberta ? new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }) : folha);
          vao.userData.irPara = v.para;
          vao.receiveShadow = !v.aberta;
          casa.vaos.push({ de: casa.id, para: v.para, malha: vao, aberta: !!v.aberta });
          if (!v.aberta) {
            // Puxador: espelho de metal e alavanca
            const passo = (v.b - v.a) / 2 - 0.08;
            const [hx, hz] = lado.ponto((v.a + v.b) / 2 + passo);
            plano(0.05, 0.16, hx + nx * 1.4, 1.02, hz + nz * 1.4, lado.giro, M.inox).receiveShadow = false;
            const [px, pz] = lado.ponto((v.a + v.b) / 2 + passo - 0.05);
            plano(0.14, 0.022, px + nx * 2, 1.05, pz + nz * 2, lado.giro, M.inox).receiveShadow = false;
          }
          t = v.b;
        }
        trecho(t, fim, 0, ALT);
      }
      if (casa.janela) {
        caixa(null, 0.01, 1.3, 1.9, -0.7, 0.95, 2.3, M.ceu);
        for (const z of [2.27, 3.2, 4.2]) caixa(null, 0.05, 1.36, 0.04, -0.7, 0.92, z, M.perfil);
        for (const y of [0.92, 2.26]) caixa(null, 0.05, 0.04, 1.97, -0.7, y, 2.27, M.perfil);
      }
    }

    function finalizar({ luzes, vista, vistaEstreita = vista, ambiente = 0.58, sol: forcaSol = 0.85, distanciaMaxima = 9.5, sombraAte = 9 }) {
      const naPosicao = (dy) => posTacas.map(([x, y, z]) => new T.Matrix4().makeTranslation(x, y + dy, z));
      if (posTacas.length) {
        repetir(new T.CylinderGeometry(0.003, 0.024, 0.1, 12), M.taca, naPosicao(0.05), false);
        repetir(new T.CylinderGeometry(0.038, 0.022, 0.09, 16), M.taca, naPosicao(0.145), false);
      }
      // Na casa, a luz é uma só e acompanha o cômodo aberto (veja construirCasa).
      if (!casa) {
        cena.add(new T.HemisphereLight(0xfff4e6, 0x3a3027, ambiente));
        const sol = new T.DirectionalLight(0xfff0dd, forcaSol);
        sol.position.set(4.5, 6, 6);
        sol.castShadow = true;
        sol.shadow.mapSize.set(2048, 2048);
        Object.assign(sol.shadow.camera, { left: -5, right: sombraAte, top: 5, bottom: -4, near: 1, far: 18 });
        sol.shadow.bias = -0.0004;
        sol.shadow.radius = 3;
        cena.add(sol);
        for (const [x, y, z, cor, forca] of luzes) {
          const luz = new T.PointLight(cor, forca, 3.2, 2);
          luz.position.set(x, y, z);
          cena.add(luz);
        }
      }
      // Só os grupos de portas e gavetas se movem. O resto não precisa ser recalculado a cada quadro.
      cena.traverse((o) => {
        if (o.isMesh) { o.updateMatrix(); o.matrixAutoUpdate = false; }
      });
      return { cena, pecas, moveis, aplicarAbertura, vista, vistaEstreita, distanciaMaxima, luzes, ambiente, forcaSol };
    }

    // Monta móveis na parede lateral: dentro de montar, x corre ao longo da parede e z sai dela,
    // como na parede do fundo. O x da ala cresce em direção à parede do fundo.
    function ala(xParede, zPonta, montar) {
      const antes = new Set(cena.children);
      montar();
      const grupo = new T.Group();
      grupo.position.set(xParede, 0, zPonta);
      grupo.rotation.y = Math.PI / 2;
      for (const o of [...cena.children]) if (!antes.has(o)) grupo.add(o);
      cena.add(grupo);
    }

    return { cena, pecas, moveis, M, padrao, caixa, cilindro, esfera, gabinete, frente, gaveta, movel, portaGiro, portaBasculante, portaVidro, tacas, pratos, repetir, sombraContato, planta, casca, comoLateral, ala, finalizar, aplicarAbertura, casa, ESPESSURA: ESPESSURA_KIT };
  }

  function construirCozinhaAmbiente(T, dados) {
    const kit = criarKit(T, dados.modulos.filter((m) => m.comodo === "cozinha"));
    const { cena, M, caixa, cilindro, esfera, gabinete, gaveta, portaGiro, portaBasculante, portaVidro, tacas, pratos, sombraContato, planta, ESPESSURA } = kit;

    kit.casca({
      piso: { nome: "piso-ceramica", mapa: texturaCeramica(T, 20, 12), rugosidade: 0.34 },
      corFundo: "#7c8574",
      corLado: "#d9d3c8",
      spots: [[1, 3.8], [3, 3.8], [5, 3.8], [0.5, 1.1], [2.8, 1.1], [4.5, 1.1]],
      rebaixo: { x0: 0.2, x1: 6.5, z0: 0.8, z1: 5.2 },
    });

    // Quadros na parede
    caixa(null, 0.62, 0.86, 0.025, 5.42, 1.25, 0, M.perfil);
    caixa(null, 0.56, 0.8, 0.005, 5.45, 1.28, 0.025, M.quadro);
    caixa(null, 0.34, 0.42, 0.003, 5.56, 1.48, 0.03, M.arte);
    caixa(null, 0.42, 0.62, 0.025, 6.2, 1.37, 0, M.perfil);
    caixa(null, 0.36, 0.56, 0.005, 6.23, 1.4, 0.025, M.quadro);
    caixa(null, 0.2, 0.28, 0.003, 6.31, 1.54, 0.03, M.arte2);

    planta(5.55, 0.5);
    sombraContato(0, 0.1, 1.74, 0.85);
    sombraContato(1.72, 0.1, 2.3, 0.8);
    sombraContato(4.02, 0.1, 1, 0.65);
    sombraContato(1.42, 1.95, 2.8, 1.15);

    const FUNDO = 0.6;
    const ALTURA = 2.6;

    // Torre da geladeira, com armário basculante acima
    caixa("torre-geladeira", 0.06, ALTURA - 0.1, FUNDO + 0.02, 0, 0.1, 0, M.freijo);
    caixa("torre-geladeira", 0.06, ALTURA - 0.1, FUNDO + 0.02, 0.96, 0.1, 0, M.freijo);
    gabinete("torre-geladeira", 0.9, 0.56, FUNDO, 0.06, 2.04, 0);
    portaBasculante("torre-geladeira", 0.9, 0.56, 0.06, 2.04, FUNDO, M.freijo);
    caixa(null, 1.02, 0.1, 0.56, 0, 0, 0, M.sombra);

    // Geladeira
    caixa("geladeira", 0.446, 1.9, 0.6, 0.06, 0.12, 0, M.inox);
    caixa("geladeira", 0.446, 1.9, 0.6, 0.514, 0.12, 0, M.inox);
    caixa("geladeira", 0.018, 0.7, 0.03, 0.47, 0.75, 0.6, M.perfil);
    caixa("geladeira", 0.018, 0.7, 0.03, 0.532, 0.75, 0.6, M.perfil);

    // Torre de fornos: gavetas, nicho dos fornos e armário basculante
    caixa("torre-fornos", 0.05, ALTURA - 0.1, FUNDO + 0.018, 1.02, 0.1, 0, M.freijo);
    caixa("torre-fornos", 0.05, ALTURA - 0.1, FUNDO + 0.018, 1.67, 0.1, 0, M.freijo);
    caixa("torre-fornos", 0.6, 1.1, FUNDO - 0.04, 1.07, 0.76, 0, M.interno);
    gabinete("torre-fornos", 0.6, 0.66, FUNDO, 1.07, 0.1, 0);
    gabinete("torre-fornos", 0.6, 0.74, FUNDO, 1.07, 1.86, 0, M.interno, [0.37]);
    gaveta("torre-fornos", 0.6, 0.33, 1.07, 0.1, FUNDO, 0.5, M.freijo, 1, pratos);
    gaveta("torre-fornos", 0.6, 0.33, 1.07, 0.43, FUNDO, 0.5, M.freijo, 1, pratos);
    portaBasculante("torre-fornos", 0.6, 0.74, 1.07, 1.86, FUNDO, M.freijo);
    caixa(null, 0.7, 0.1, 0.56, 1.02, 0, 0, M.sombra);

    // Forno e micro-ondas
    caixa("forno", 0.6, 0.6, 0.03, 1.07, 0.76, FUNDO - 0.04, M.preto);
    caixa("forno", 0.52, 0.018, 0.03, 1.11, 1.25, FUNDO - 0.01, M.inox);
    caixa("forno", 0.6, 0.06, 0.012, 1.07, 1.3, FUNDO - 0.012, M.inox);
    caixa("micro", 0.6, 0.42, 0.03, 1.07, 1.42, FUNDO - 0.04, M.preto);
    caixa("micro", 0.13, 0.4, 0.012, 1.53, 1.43, FUNDO - 0.012, M.inox);

    // Inferiores da parede
    gabinete("gaveteiro", 0.8, 0.77, FUNDO - 0.02, 1.72, 0.1, 0);
    for (let i = 0; i < 3; i += 1) gaveta("gaveteiro", 0.8, 0.77 / 3, 1.72, 0.1 + (i * 0.77) / 3, FUNDO - 0.02, 0.5, M.cinza, 1, pratos);
    caixa("lava-loucas", 0.6, 0.77, 0.598, 2.52, 0.1, 0, M.inox);
    caixa("lava-loucas", 0.5, 0.018, 0.03, 2.57, 0.78, 0.598, M.perfil);
    gabinete("base-cuba", 0.9, 0.77, FUNDO - 0.02, 3.12, 0.1, 0, M.interno, [0.36]);
    portaGiro("base-cuba", 0.45, 0.77, 3.12, 0.1, FUNDO - 0.02, M.cinza, "esquerda");
    portaGiro("base-cuba", 0.45, 0.77, 3.57, 0.1, FUNDO - 0.02, M.cinza, "direita");
    caixa(null, 2.3, 0.1, 0.54, 1.72, 0, 0, M.sombra);

    // Bancada da parede, cuba, torneira e objetos
    caixa("bancada", 2.3, 0.03, FUNDO + 0.02, 1.72, 0.87, 0, M.pedra);
    caixa("cuba", 0.6, 0.006, 0.4, 3.27, 0.9, 0.12, M.inox);
    caixa("cuba", 0.54, 0.004, 0.34, 3.3, 0.906, 0.15, M.preto);
    cilindro("cuba", 0.012, 0.016, 0.34, 3.57, 0.9, 0.07, M.inox, 24);
    caixa("cuba", 0.024, 0.024, 0.2, 3.558, 1.23, 0.07, M.inox);
    caixa(null, 0.2, 0.32, 0.26, 1.86, 0.9, 0.2, M.preto);
    caixa(null, 0.09, 0.015, 0.09, 1.915, 0.97, 0.3, M.inox);
    for (const [x, h] of [[2.3, 0.2], [2.44, 0.16], [2.56, 0.12]]) {
      cilindro(null, 0.05, 0.05, h, x, 0.9, 0.16, M.ceramicaBranca, 28);
      cilindro(null, 0.052, 0.052, 0.018, x, 0.9 + h, 0.16, M.freijo, 28);
    }
    caixa(null, 0.42, 0.025, 0.26, 2.72, 0.9, 0.1, M.freijo).rotation.x = 1.25;

    // Painel da parede e armários aéreos, com portas basculantes
    caixa("painel", 2.3, 0.6, 0.018, 1.72, 0.9, 0, M.freijo);
    gabinete("aereos", 0.65, 0.7, 0.33, 1.72, 1.5, 0, M.interno, [0.34]);
    gabinete("aereos", 0.65, 0.7, 0.33, 2.37, 1.5, 0, M.interno, [0.34]);
    for (const x of [1.95, 2.17, 2.6, 2.82]) pratos(x, 1.86, 0.18);
    portaBasculante("aereos", 0.65, 0.7, 1.72, 1.5, 0.33, M.freijo);
    portaBasculante("aereos", 0.65, 0.7, 2.37, 1.5, 0.33, M.freijo);
    caixa(null, 2.3, 0.008, 0.012, 1.72, 1.492, 0.22, M.led);

    // Cristaleira aérea
    gabinete("cristaleira-superior", 1, 0.7, 0.33, 3.02, 1.5, 0, M.freijo);
    caixa("cristaleira-superior", 0.964, 0.012, 0.3, 3.038, 1.84, 0.015, M.vidro);
    caixa(null, 0.96, 0.006, 0.01, 3.04, 2.17, 0.27, M.led);
    tacas(3.12, 3.98, 1.518, 0.17);
    tacas(3.12, 3.98, 1.852, 0.17);
    portaVidro("cristaleira-superior", 0.5, 0.7, 3.02, 1.5, 0.33, "esquerda");
    portaVidro("cristaleira-superior", 0.5, 0.7, 3.52, 1.5, 0.33, "direita");

    // Cristaleira torre: armário fechado embaixo e vidro em cima
    const P_TORRE = 0.45;
    gabinete("cristaleira-torre", 1, ALTURA - 0.1, P_TORRE, 4.02, 0.1, 0, M.freijo);
    caixa("cristaleira-torre", 0.964, ESPESSURA, P_TORRE - 0.02, 4.038, 0.93, 0.006, M.freijo);
    for (const y of [1.37, 1.79, 2.21]) caixa("cristaleira-torre", 0.964, 0.012, P_TORRE - 0.05, 4.038, y, 0.03, M.vidro);
    for (const y of [0.948, 1.382, 1.802, 2.222]) {
      tacas(4.12, 4.98, y, 0.24);
      caixa(null, 0.96, 0.006, 0.01, 4.04, y + 0.38, 0.38, M.led);
    }
    portaGiro("cristaleira-torre", 0.5, 0.85, 4.02, 0.1, P_TORRE, M.freijo, "esquerda");
    portaGiro("cristaleira-torre", 0.5, 0.85, 4.52, 0.1, P_TORRE, M.freijo, "direita");
    portaVidro("cristaleira-torre", 0.5, 1.63, 4.02, 0.95, P_TORRE, "esquerda");
    portaVidro("cristaleira-torre", 0.5, 1.63, 4.52, 0.95, P_TORRE, "direita");
    caixa(null, 1, 0.1, 0.4, 4.02, 0, 0, M.sombra);

    // Ilha: gavetas e portas voltadas para a parede; painel ripado do lado das banquetas
    const Z_ILHA = 2.05;
    const FUNDO_ILHA = 0.9;
    gabinete("ilha-gavetas", 1.5, 0.77, FUNDO_ILHA, 1.5, 0.1, Z_ILHA);
    gabinete("ilha-portas", 1.1, 0.77, FUNDO_ILHA, 3, 0.1, Z_ILHA, M.interno, [0.36]);
    for (let i = 0; i < 3; i += 1) gaveta("ilha-gavetas", 1.5, 0.77 / 3, 1.5, 0.1 + (i * 0.77) / 3, Z_ILHA, 0.6, M.cinza, -1, pratos);
    portaGiro("ilha-portas", 0.55, 0.77, 3, 0.1, Z_ILHA, M.cinza, "esquerda", { sentido: -1 });
    portaGiro("ilha-portas", 0.55, 0.77, 3.55, 0.1, Z_ILHA, M.cinza, "direita", { sentido: -1 });
    caixa("ilha-fundo", 2.6, 0.77, ESPESSURA, 1.5, 0.1, Z_ILHA + FUNDO_ILHA, M.freijo);
    for (let x = 1.53; x < 4.08; x += 0.09) caixa("ilha-fundo", 0.045, 0.77, ESPESSURA, x, 0.1, Z_ILHA + FUNDO_ILHA + ESPESSURA, M.freijo);
    caixa("ilha-fundo", ESPESSURA, 0.77, FUNDO_ILHA, 1.482, 0.1, Z_ILHA, M.freijo);
    caixa("ilha-fundo", ESPESSURA, 0.77, FUNDO_ILHA, 4.1, 0.1, Z_ILHA, M.freijo);
    caixa(null, 2.6, 0.1, FUNDO_ILHA - 0.06, 1.5, 0, Z_ILHA + 0.03, M.sombra);
    caixa("bancada-ilha", 2.68, 0.03, 1.22, 1.46, 0.87, Z_ILHA - 0.02, M.pedra);
    caixa("cooktop", 0.75, 0.01, 0.5, 1.87, 0.9, Z_ILHA + 0.2, M.preto);
    for (const [dx, dz] of [[0.18, 0.14], [0.56, 0.14], [0.18, 0.36], [0.56, 0.36]]) cilindro(null, 0.075, 0.075, 0.002, 1.87 + dx, 0.91, Z_ILHA + 0.2 + dz, M.perfil);

    // Fruteira sobre a ilha
    cilindro(null, 0.17, 0.08, 0.07, 3.45, 0.9, Z_ILHA + 0.55, M.ceramicaBranca, 36);
    for (const [dx, dz, m] of [[-0.05, 0, M.fruta], [0.06, 0.04, M.fruta2], [0.01, -0.07, M.fruta], [0.03, 0.08, M.fruta]]) esfera(0.042, 3.45 + dx, 1.0, Z_ILHA + 0.55 + dz, m);

    // Coifa
    const CX_COIFA = 2.245;
    caixa("coifa", 0.7, 0.05, 0.42, CX_COIFA - 0.35, 1.85, Z_ILHA + 0.24, M.inox);
    const topoCoifa = cilindro("coifa", 0.1, 0.33, 0.14, CX_COIFA, 1.9, Z_ILHA + 0.45, M.inox, 4);
    topoCoifa.rotation.y = Math.PI / 4;
    caixa("coifa", 0.16, 0.76, 0.16, CX_COIFA - 0.08, 2.04, Z_ILHA + 0.37, M.inox);

    // Pendentes sobre o balcão
    for (const x of [3.1, 3.7]) {
      cilindro(null, 0.004, 0.004, 0.95, x, 1.85, Z_ILHA + 0.5, M.perfil, 8);
      cilindro(null, 0.05, 0.11, 0.16, x, 1.7, Z_ILHA + 0.5, M.perfil);
      const lampada = new T.Mesh(new T.SphereGeometry(1, 16, 12), M.led);
      lampada.scale.setScalar(0.035);
      lampada.position.set(x, 1.7, Z_ILHA + 0.5);
      cena.add(lampada);
    }

    // Banquetas com encosto
    for (const x of [1.9, 2.6, 3.3]) {
      const z = Z_ILHA + FUNDO_ILHA + 0.42;
      sombraContato(x - 0.26, z - 0.26, 0.52, 0.52);
      cilindro(null, 0.175, 0.165, 0.055, x, 0.66, z, M.tecido);
      cilindro(null, 0.016, 0.02, 0.66, x, 0, z, M.inox, 16);
      cilindro(null, 0.17, 0.185, 0.018, x, 0, z, M.perfil);
      caixa(null, 0.3, 0.2, 0.025, x - 0.15, 0.87, z + 0.15, M.tecido);
      caixa(null, 0.018, 0.2, 0.018, x - 0.01, 0.71, z + 0.15, M.perfil);
      const anel = new T.Mesh(new T.TorusGeometry(0.13, 0.007, 10, 36), M.inox);
      anel.rotation.x = Math.PI / 2;
      anel.position.set(x, 0.28, z);
      cena.add(anel);
    }

    return kit.finalizar({
      luzes: [[2.8, 1.42, 0.45, 0xffd9a6, 0.55], [4.5, 1.8, 0.3, 0xffd9a6, 0.65]],
      vista: { camera: [4.3, 1.8, 7.4], alvo: [2.5, 1.25, 0.9] },
    });
  }

  function construirSala(T, dados) {
    const kit = criarKit(T, dados.modulos.filter((m) => m.comodo === "sala"));
    const { M, padrao, caixa, cilindro, esfera, gabinete, gaveta, portaGiro, portaVidro, sombraContato, planta, ESPESSURA } = kit;

    kit.casca({
      piso: { nome: "piso-madeira", mapa: texturaPisoMadeira(T, 20, 12), rugosidade: 0.42 },
      corFundo: "#8f8679",
      corLado: "#ded9cf",
      spots: [[1.2, 1.6], [3.2, 1.6], [5.2, 1.6], [1.2, 3.8], [3.2, 3.8], [5.2, 3.8]],
      rebaixo: { x0: 0.5, x1: 6.5, z0: 0.9, z1: 5.2 },
    });

    const ALTURA = 2.6;
    const tecido = padrao({ color: 0xb9b2a5, roughness: 0.95 });
    const tecidoEscuro = padrao({ color: 0x4d4a45, roughness: 0.95 });
    const almofada = padrao({ color: 0xb1693c, roughness: 0.92 });
    const tapete = padrao({ color: 0x7d776d, roughness: 1 });
    const garrafa = padrao({ color: 0x22301f, roughness: 0.2, metalness: 0.2 });
    const livros = [0x8c5a3c, 0x38423a, 0xd8d2c5, 0x5d554b, 0xa98a63, 0x2b2c30].map((color) => padrao({ color, roughness: 0.8 }));

    // Adega com cristaleira
    const X_ADEGA = -0.55;
    const P_ADEGA = 0.45;
    gabinete("sala-adega", 1.1, ALTURA - 0.1, P_ADEGA, X_ADEGA, 0.1, 0, M.freijo);
    caixa("sala-adega", 1.064, ESPESSURA, P_ADEGA - 0.02, X_ADEGA + 0.018, 0.93, 0.006, M.freijo);
    for (const y of [1.37, 1.79, 2.21]) caixa("sala-adega", 1.064, 0.012, P_ADEGA - 0.05, X_ADEGA + 0.018, y, 0.03, M.vidro);
    for (const y of [0.948, 1.382]) {
      for (let x = X_ADEGA + 0.12; x < X_ADEGA + 1; x += 0.13) {
        cilindro(null, 0.036, 0.036, 0.2, x, y, 0.22, garrafa, 14);
        cilindro(null, 0.013, 0.03, 0.09, x, y + 0.2, 0.22, garrafa, 12);
      }
    }
    for (const y of [1.802, 2.222]) kit.tacas(X_ADEGA + 0.12, X_ADEGA + 1, y, 0.24);
    for (const y of [1.33, 1.75, 2.17, 2.56]) caixa(null, 1.06, 0.006, 0.01, X_ADEGA + 0.02, y, 0.38, M.led);
    portaGiro("sala-adega", 0.55, 0.85, X_ADEGA, 0.1, P_ADEGA, M.freijo, "esquerda");
    portaGiro("sala-adega", 0.55, 0.85, X_ADEGA + 0.55, 0.1, P_ADEGA, M.freijo, "direita");
    portaVidro("sala-adega", 0.55, 1.63, X_ADEGA, 0.95, P_ADEGA, "esquerda");
    portaVidro("sala-adega", 0.55, 1.63, X_ADEGA + 0.55, 0.95, P_ADEGA, "direita");
    caixa(null, 1.1, 0.1, 0.4, X_ADEGA, 0, 0, M.sombra);
    sombraContato(X_ADEGA, 0.1, 1.1, P_ADEGA + 0.2);

    // Painel ripado da TV
    const X_PAINEL = 0.6;
    const L_PAINEL = 3.6;
    caixa("sala-painel", L_PAINEL, ALTURA, ESPESSURA, X_PAINEL, 0, 0, M.freijo);
    for (let x = X_PAINEL + 0.02; x < X_PAINEL + L_PAINEL - 0.04; x += 0.09) caixa("sala-painel", 0.045, ALTURA, ESPESSURA, x, 0, ESPESSURA, M.freijo);
    caixa(null, L_PAINEL, 0.012, 0.02, X_PAINEL, 2.58, 0.05, M.led);

    // TV
    caixa("sala-tv", 1.65, 0.95, 0.035, 1.575, 1.02, 0.04, M.preto);
    caixa("sala-tv", 1.61, 0.91, 0.002, 1.595, 1.04, 0.076, padrao({ color: 0x0a0d14, roughness: 0.06, metalness: 0.4 }));

    // Rack suspenso: gavetões nas pontas e portas no centro
    const Y_RACK = 0.3;
    const A_RACK = 0.45;
    const P_RACK = 0.48;
    const X_RACK = 0.7;
    gabinete("sala-rack", 3.4, A_RACK, P_RACK, X_RACK, Y_RACK, 0.036, M.freijo);
    for (const x of [X_RACK, X_RACK + 2.5]) gaveta("sala-rack", 0.9, A_RACK, x, Y_RACK, P_RACK + 0.036, 0.4, M.freijo);
    portaGiro("sala-rack", 0.8, A_RACK, X_RACK + 0.9, Y_RACK, P_RACK + 0.036, M.freijo, "esquerda");
    portaGiro("sala-rack", 0.8, A_RACK, X_RACK + 1.7, Y_RACK, P_RACK + 0.036, M.freijo, "direita");
    sombraContato(X_RACK, 0.1, 3.4, P_RACK + 0.1);
    caixa("sala-soundbar", 1, 0.07, 0.1, 1.9, Y_RACK + A_RACK, 0.3, M.perfil);
    cilindro(null, 0.05, 0.075, 0.2, 4.0, Y_RACK + A_RACK, 0.28, M.ceramicaBranca, 22);

    // Estante
    const X_ESTANTE = 4.25;
    const P_ESTANTE = 0.38;
    gabinete("sala-estante", 1.1, ALTURA - 0.1, P_ESTANTE, X_ESTANTE, 0.1, 0, M.freijo, [0.85, 1.28, 1.71, 2.13]);
    portaGiro("sala-estante", 0.55, 0.85, X_ESTANTE, 0.1, P_ESTANTE, M.freijo, "esquerda");
    portaGiro("sala-estante", 0.55, 0.85, X_ESTANTE + 0.55, 0.1, P_ESTANTE, M.freijo, "direita");
    caixa(null, 1.1, 0.1, 0.33, X_ESTANTE, 0, 0, M.sombra);
    sombraContato(X_ESTANTE, 0.1, 1.1, P_ESTANTE + 0.2);
    const rLivros = sorteador(23);
    for (const [y, x0, x1] of [[0.968, 0.06, 0.62], [1.398, 0.42, 1], [1.828, 0.06, 0.5], [2.248, 0.5, 1]]) {
      for (let x = X_ESTANTE + x0; x < X_ESTANTE + x1;) {
        const largura = 0.03 + rLivros() * 0.035;
        caixa(null, largura, 0.2 + rLivros() * 0.09, 0.2, x, y, 0.1, livros[Math.floor(rLivros() * livros.length)]);
        x += largura + 0.003;
      }
    }
    cilindro(null, 0.055, 0.04, 0.2, X_ESTANTE + 0.2, 1.398, 0.18, M.terra, 20);
    esfera(0.08, X_ESTANTE + 0.78, 1.908, 0.18, M.ceramicaBranca);
    cilindro(null, 0.08, 0.05, 0.18, X_ESTANTE + 0.25, 2.248, 0.18, M.ceramicaBranca, 20);

    // Aparador, espelho e objetos
    const X_APARADOR = 5.55;
    const P_APARADOR = 0.42;
    gabinete("sala-aparador", 1.5, 0.72, P_APARADOR, X_APARADOR, 0.12, 0, M.interno);
    gaveta("sala-aparador", 0.5, 0.36, X_APARADOR, 0.12, P_APARADOR, 0.34, M.cinza);
    gaveta("sala-aparador", 0.5, 0.36, X_APARADOR, 0.48, P_APARADOR, 0.34, M.cinza);
    portaGiro("sala-aparador", 0.5, 0.72, X_APARADOR + 0.5, 0.12, P_APARADOR, M.cinza, "esquerda");
    portaGiro("sala-aparador", 0.5, 0.72, X_APARADOR + 1, 0.12, P_APARADOR, M.cinza, "direita");
    caixa(null, 1.42, 0.12, 0.34, X_APARADOR + 0.04, 0, 0.02, M.sombra);
    sombraContato(X_APARADOR, 0.1, 1.5, P_APARADOR + 0.2);
    caixa(null, 1.5, ESPESSURA, P_APARADOR + 0.02, X_APARADOR, 0.84, 0, M.freijo);
    const moldura = cilindro(null, 0.44, 0.44, 0.012, X_APARADOR + 0.75, 1.15, 0.008, M.perfil, 48);
    moldura.rotation.x = Math.PI / 2;
    moldura.position.y = 1.62;
    const espelho = cilindro(null, 0.42, 0.42, 0.012, X_APARADOR + 0.75, 1.15, 0.016, padrao({ color: 0xf2f7f8, roughness: 0.04, metalness: 0.55 }), 48);
    espelho.rotation.x = Math.PI / 2;
    espelho.position.y = 1.62;
    cilindro(null, 0.045, 0.085, 0.3, X_APARADOR + 0.3, 0.858, 0.2, M.terra, 22);
    for (let i = 0; i < 3; i += 1) caixa(null, 0.32, 0.03, 0.22, X_APARADOR + 0.95, 0.858 + i * 0.03, 0.12, livros[i + 1]);

    planta(7.45, 0.55);

    // Tapete
    caixa(null, 4.2, 0.012, 3, 1.2, 0, 1.55, tapete).castShadow = false;

    // Sofá em L, de frente para a TV
    const Z_SOFA = 3.15;
    sombraContato(1.25, Z_SOFA - 0.08, 3.5, 1.15);
    for (const x of [1.3, 4.45]) caixa(null, 0.05, 0.08, 0.8, x, 0, Z_SOFA + 0.1, M.perfil);
    caixa(null, 3.2, 0.3, 0.98, 1.3, 0.08, Z_SOFA, tecido);
    caixa(null, 3.2, 0.62, 0.2, 1.3, 0.2, Z_SOFA + 0.82, tecido);
    caixa(null, 0.2, 0.46, 0.98, 1.3, 0.2, Z_SOFA, tecido);
    caixa(null, 0.2, 0.46, 0.98, 4.3, 0.2, Z_SOFA, tecido);
    for (let i = 0; i < 3; i += 1) {
      caixa(null, 0.92, 0.15, 0.74, 1.54 + i * 0.94, 0.38, Z_SOFA + 0.06, tecido);
      caixa(null, 0.9, 0.34, 0.14, 1.55 + i * 0.94, 0.52, Z_SOFA + 0.68, tecido).rotation.x = -0.14;
    }
    caixa(null, 0.42, 0.34, 0.12, 1.62, 0.53, Z_SOFA + 0.5, almofada).rotation.set(-0.3, 0.2, 0.08);
    caixa(null, 0.42, 0.34, 0.12, 3.82, 0.53, Z_SOFA + 0.5, tecidoEscuro).rotation.set(-0.3, -0.2, -0.08);
    caixa(null, 0.42, 0.34, 0.12, 2.6, 0.53, Z_SOFA + 0.5, almofada).rotation.x = -0.28;

    // Mesa de centro
    sombraContato(2.15, 1.95, 1.3, 0.8);
    caixa(null, 1.2, 0.035, 0.7, 2.2, 0.36, 2, M.freijo);
    for (const [x, z] of [[2.28, 2.08], [3.28, 2.08], [2.28, 2.58], [3.28, 2.58]]) cilindro(null, 0.014, 0.014, 0.36, x, 0, z, M.perfil, 10);
    for (let i = 0; i < 2; i += 1) caixa(null, 0.3, 0.025, 0.22, 2.42, 0.395 + i * 0.025, 2.22, livros[i + 2]);
    cilindro(null, 0.05, 0.08, 0.15, 3.1, 0.395, 2.3, M.ceramicaBranca, 20);

    // Poltrona
    sombraContato(5.15, 1.9, 0.95, 0.95);
    caixa(null, 0.78, 0.26, 0.78, 5.24, 0.2, 2, tecidoEscuro);
    caixa(null, 0.78, 0.62, 0.14, 5.24, 0.28, 2.66, tecidoEscuro).rotation.x = 0.1;
    for (const [x, z] of [[5.3, 2.06], [5.94, 2.06], [5.3, 2.7], [5.94, 2.7]]) cilindro(null, 0.018, 0.012, 0.2, x, 0, z, M.freijo, 10);

    // Luminária de piso
    sombraContato(4.8, 3.5, 0.5, 0.5);
    cilindro(null, 0.14, 0.15, 0.02, 5.05, 0, 3.75, M.perfil, 28);
    cilindro(null, 0.01, 0.01, 1.55, 5.05, 0.02, 3.75, M.perfil, 10);
    cilindro(null, 0.11, 0.17, 0.26, 5.05, 1.55, 3.75, padrao({ color: 0xf2e6cf, roughness: 0.9, emissive: 0xffd9a6, emissiveIntensity: 0.55 }), 28);

    // Cortina na parede lateral
    kit.comoLateral(() => {
      const pano = padrao({ color: 0xece6da, roughness: 0.96 });
      for (let z = 2.05; z < 4.75; z += 0.14) caixa(null, 0.05, 2.72, 0.145, -0.63 + (Math.round(z * 7) % 2) * 0.025, 0.02, z, pano);
      caixa(null, 0.04, 0.04, 2.8, -0.66, 2.74, 2, M.perfil);
    });

    return kit.finalizar({
      luzes: [[2.4, 2.45, 0.55, 0xffd9a6, 0.6], [5.05, 1.5, 3.4, 0xffd9a6, 0.55]],
      vista: { camera: [4.7, 2.2, 9.8], alvo: [3.1, 1.2, 1.3] },
      distanciaMaxima: 11,
    });
  }

  // Quarto de casal à esquerda e closet à direita, no mesmo ambiente, separados por um ripado.
  function construirQuarto(T, dados) {
    const kit = criarKit(T, dados.modulos.filter((m) => m.comodo === "quarto"));
    const { M, padrao, caixa, cilindro, esfera, gabinete, gaveta, movel, portaVidro, sombraContato, planta, repetir, ESPESSURA } = kit;

    kit.casca({
      piso: { nome: "piso-madeira", mapa: texturaPisoMadeira(T, 20, 12, 46), rugosidade: 0.38 },
      corFundo: "#6b6055",
      corLado: "#a89c8d",
      inicioRodape: -0.7,
      spots: [[1, 3.4], [2.8, 3.4], [4.7, 1.2], [6.2, 1.2], [7.3, 1.2], [4.7, 3.2], [6.2, 3.2]],
      rebaixo: { x0: 0.5, x1: 7.9, z0: 0.9, z1: 5.2 },
    });

    const nogueira = padrao({ map: texturaMadeira(T, "#4a3124", "#1f130b", 13), roughness: 0.42 });
    const thar = padrao({ map: texturaMadeira(T, "#6d4c36", "#2f1c10", 17), roughness: 0.45 });
    const fundoAceso = padrao({ map: nogueira.map, roughness: 0.5, emissive: 0xff9a4d, emissiveMap: texturaBrilho(T), emissiveIntensity: 0.42 });
    const fita = new T.MeshBasicMaterial({ color: 0xffc27a });
    const bronze = padrao({ color: 0x6a4c30, metalness: 0.85, roughness: 0.3 });
    const fume = padrao({ color: 0x4a3a2c, transparent: true, opacity: 0.2, roughness: 0.03, metalness: 0.2, depthWrite: false });
    const vidroBronze = { vidro: fume, perfil: bronze };
    const estofado = padrao({ color: 0xb7a894, roughness: 0.95 });
    const lencol = padrao({ color: 0xece6db, roughness: 0.9 });
    const edredom = padrao({ color: 0xcfc4b3, roughness: 0.95 });
    const manta = padrao({ color: 0x7a4a2e, roughness: 0.95 });
    const tapete = padrao({ color: 0x6f675c, roughness: 1 });
    const couro = padrao({ color: 0x6a4630, roughness: 0.55 });
    const pedraEscura = padrao({ color: 0x1b1a19, roughness: 0.12, metalness: 0.05 });
    const espelho = padrao({ color: 0xf2f7f8, roughness: 0.04, metalness: 0.7 });
    const lustre = padrao({ color: 0xf2e6cf, roughness: 0.6, emissive: 0xffd9a6, emissiveIntensity: 0.9 });

    // Peças repetidas: roupas e calçados, desenhados de uma vez só.
    const bloco = (x, y, z, l, a, p) => new T.Matrix4().compose(new T.Vector3(x, y, z), new T.Quaternion(), new T.Vector3(l, a, p));
    const CUBO_PECAS = new T.BoxGeometry(1, 1, 1);
    const sorteio = sorteador(29);

    // Parede da cama: painel, ripado em cima e estofado na altura das costas
    const X_CAB = 0.1;
    const L_CAB = 3.4;
    caixa("quarto-cabeceira", L_CAB, 2.6, ESPESSURA, X_CAB, 0, 0, nogueira);
    for (let x = X_CAB + 0.02; x < X_CAB + L_CAB - 0.04; x += 0.09) caixa("quarto-cabeceira", 0.045, 1.35, ESPESSURA, x, 1.25, ESPESSURA, nogueira);
    for (let i = 0; i < 4; i += 1) caixa("quarto-cabeceira", 0.84, 0.6, 0.07, X_CAB + 0.02 + i * 0.85, 0.62, ESPESSURA, estofado);
    caixa(null, L_CAB, 0.012, 0.02, X_CAB, 1.232, 0.07, M.led);
    caixa(null, L_CAB, 0.012, 0.02, X_CAB, 2.58, 0.04, M.led);

    // Cama com base flutuante
    const X_CAMA = 0.835;
    const L_CAMA = 1.93;
    const P_CAMA = 2.03;
    const Z_CAMA = 0.09;
    sombraContato(X_CAMA - 0.05, Z_CAMA, L_CAMA + 0.1, P_CAMA + 0.1);
    caixa(null, L_CAMA - 0.18, 0.14, P_CAMA - 0.18, X_CAMA + 0.09, 0, Z_CAMA + 0.09, M.sombra);
    caixa("quarto-cama", L_CAMA + 0.06, 0.16, P_CAMA + 0.06, X_CAMA - 0.03, 0.14, Z_CAMA, nogueira);
    caixa(null, L_CAMA - 0.1, 0.008, 0.012, X_CAMA + 0.05, 0.126, Z_CAMA + P_CAMA - 0.1, M.led);
    caixa("quarto-cama", L_CAMA, 0.24, P_CAMA, X_CAMA, 0.3, Z_CAMA + 0.03, lencol);
    caixa("quarto-cama", L_CAMA + 0.04, 0.06, 1.36, X_CAMA - 0.02, 0.52, Z_CAMA + 0.72, edredom);
    caixa("quarto-cama", L_CAMA + 0.06, 0.07, 0.52, X_CAMA - 0.03, 0.53, Z_CAMA + 1.54, manta);
    for (const dx of [0.08, 1.0]) {
      caixa("quarto-cama", 0.85, 0.44, 0.15, X_CAMA + dx, 0.54, Z_CAMA + 0.1, lencol).rotation.x = -0.18;
      caixa("quarto-cama", 0.62, 0.34, 0.13, X_CAMA + dx + 0.12, 0.54, Z_CAMA + 0.3, edredom).rotation.x = -0.22;
    }
    caixa("quarto-cama", 0.46, 0.26, 0.11, X_CAMA + 0.74, 0.54, Z_CAMA + 0.5, manta).rotation.x = -0.26;

    // Criados-mudos suspensos e pendentes
    for (const x of [0.2, 2.82]) {
      gabinete("quarto-criados", 0.58, 0.24, 0.45, x, 0.38, ESPESSURA, nogueira);
      gaveta("quarto-criados", 0.58, 0.24, x, 0.38, 0.45 + ESPESSURA, 0.36, thar, 1, null, nogueira);
      cilindro(null, 0.004, 0.004, 1.42, x + 0.29, 1.43, 0.3, bronze, 8);
      esfera(0.085, x + 0.29, 1.36, 0.3, lustre);
      for (let i = 0; i < 2; i += 1) caixa(null, 0.22, 0.025, 0.16, x + 0.08, 0.62 + i * 0.025, 0.14, i ? manta : estofado);
    }

    // Tapete, calçadeira e planta
    caixa(null, 3.4, 0.012, 3.1, 0.1, 0, 0.75, tapete).castShadow = false;
    sombraContato(1.02, 2.28, 1.56, 0.56);
    caixa("quarto-calcadeira", 1.5, 0.12, 0.5, 1.05, 0.32, 2.32, couro);
    caixa("quarto-calcadeira", 1.46, 0.02, 0.46, 1.07, 0.3, 2.34, bronze);
    for (const [x, z] of [[1.12, 2.4], [2.48, 2.4], [1.12, 2.74], [2.48, 2.74]]) cilindro(null, 0.012, 0.012, 0.3, x, 0, z, bronze, 8);
    planta(-0.3, 0.45);

    // Cortina na parede lateral
    kit.comoLateral(() => {
      const pano = padrao({ color: 0xb9ae9d, roughness: 0.96 });
      for (let z = 2.05; z < 4.75; z += 0.14) caixa(null, 0.05, 2.72, 0.145, -0.63 + (Math.round(z * 7) % 2) * 0.025, 0.02, z, pano);
      caixa(null, 0.04, 0.04, 2.8, -0.66, 2.74, 2, M.perfil);
    });

    // Parede de marcenaria entre o quarto e o closet: duas faces com um vão, por onde a porta corre
    const X_PAREDE = 3.86;
    const ESP_PAREDE = 0.12;
    const Z_VAO = 1.2; // onde termina o trecho que guarda a porta e começa a passagem
    const L_PORTA = 1;
    const A_PORTA = 2.17;
    const E_PORTA = 0.036;
    const X_PORTA = X_PAREDE + (ESP_PAREDE - E_PORTA) / 2;
    const A_TETO = 2.85;
    caixa("closet-parede", ESPESSURA, A_TETO, Z_VAO, X_PAREDE, 0, 0, nogueira);
    caixa("closet-parede", ESPESSURA, A_TETO, Z_VAO, X_PAREDE + ESP_PAREDE - ESPESSURA, 0, 0, nogueira);
    caixa("closet-parede", ESP_PAREDE, A_TETO - A_PORTA - 0.03, L_PORTA, X_PAREDE, A_PORTA + 0.03, Z_VAO, nogueira);
    caixa("closet-parede", ESP_PAREDE, A_TETO, 0.5, X_PAREDE, 0, Z_VAO + L_PORTA, nogueira);
    for (let z = 0.03; z < Z_VAO - 0.04; z += 0.09) caixa("closet-parede", ESPESSURA, A_TETO, 0.045, X_PAREDE - ESPESSURA, 0, z, nogueira);
    caixa(null, 0.012, 0.012, L_PORTA, X_PAREDE - 0.012, A_PORTA + 0.03, Z_VAO, M.led);

    // Porta de correr: entra na parede e deixa só a borda à mostra
    movel("closet-porta", "correr", [X_PORTA, 0.015, Z_VAO], "z", -(L_PORTA - 0.04), () => {
      caixa("closet-porta", E_PORTA, A_PORTA, L_PORTA, X_PORTA, 0.015, Z_VAO, thar);
      for (const x of [X_PORTA - 0.002, X_PORTA + E_PORTA - 0.001]) caixa("closet-porta", 0.003, 0.5, 0.05, x, 0.8, Z_VAO + L_PORTA - 0.12, M.sombra);
    });

    // Closet: móveis na parede do fundo
    const X_CLOSET = 4.1;
    // Na casa, os móveis do closet ficam mais estreitos, para abrir a porta do banheiro no fim da parede.
    const L_CLOSET = kit.casa ? 2.64 : 3.75;
    const P_CLOSET = 0.6;
    const A_CLOSET = 2.5;
    caixa(null, L_CLOSET, 0.1, P_CLOSET - 0.06, X_CLOSET, 0, 0, M.sombra);
    caixa(null, L_CLOSET, 0.25, P_CLOSET, X_CLOSET, 2.6, 0, nogueira);
    caixa("closet-led", L_CLOSET, 0.015, 0.02, X_CLOSET, 2.585, P_CLOSET, fita);
    caixa(null, L_CLOSET, 0.008, 0.012, X_CLOSET, 0.04, P_CLOSET - 0.05, fita);
    sombraContato(X_CLOSET, 0.1, L_CLOSET, P_CLOSET + 0.15);

    // Fundo aceso: é ele que faz o móvel parecer iluminado por dentro
    const fundo = (x, l, y, a) => caixa(null, l - 2 * ESPESSURA, a, 0.004, x + ESPESSURA, y, 0.008, fundoAceso);

    // Cabideiro
    const X_CAB_CL = X_CLOSET;
    const L_CAB_CL = kit.casa ? 0.95 : 1.4;
    gabinete("closet-cabideiro", L_CAB_CL, A_CLOSET, P_CLOSET, X_CAB_CL, 0.1, 0, nogueira, [2.12]);
    fundo(X_CAB_CL, L_CAB_CL, 0.118, A_CLOSET - 0.036);
    caixa(null, L_CAB_CL - 0.04, 0.02, 0.02, X_CAB_CL + 0.02, 2.02, 0.3, bronze);
    caixa(null, L_CAB_CL - 0.04, 0.006, 0.012, X_CAB_CL + 0.02, 2.2, 0.5, fita);
    for (const x of [X_CAB_CL + 0.02, X_CAB_CL + L_CAB_CL - 0.03]) caixa(null, 0.014, 2.05, 0.014, x, 0.14, 0.54, fita);
    const roupas = [[], [], []];
    for (let x = X_CAB_CL + 0.09; x < X_CAB_CL + L_CAB_CL - 0.08; x += 0.052) {
      const altura = 0.95 + sorteio() * 0.5;
      roupas[Math.floor(sorteio() * 3)].push(bloco(x, 2.02 - altura / 2, 0.3, 0.032, altura, 0.42));
    }
    [padrao({ color: 0x24262c, roughness: 0.9 }), padrao({ color: 0xcfc6b6, roughness: 0.9 }), padrao({ color: 0x6f3d2a, roughness: 0.9 })]
      .forEach((material, i) => repetir(CUBO_PECAS, material, roupas[i], true));
    portaVidro("closet-cabideiro", L_CAB_CL / 2, A_CLOSET, X_CAB_CL, 0.1, P_CLOSET, "esquerda", vidroBronze);
    portaVidro("closet-cabideiro", L_CAB_CL / 2, A_CLOSET, X_CAB_CL + L_CAB_CL / 2, 0.1, P_CLOSET, "direita", vidroBronze);

    // Sapateira: uma linha de LED sob cada prateleira
    const X_SAP = X_CLOSET + L_CAB_CL;
    const L_SAP = kit.casa ? 0.75 : 0.9;
    const ALTURAS_SAP = [0.38, 0.74, 1.1, 1.46, 1.82, 2.18];
    gabinete("closet-sapateira", L_SAP, A_CLOSET, P_CLOSET, X_SAP, 0.1, 0, nogueira, ALTURAS_SAP);
    fundo(X_SAP, L_SAP, 0.118, A_CLOSET - 0.036);
    const sapatos = [[], []];
    [0.018, ...ALTURAS_SAP.slice(0, -1).map((a) => a + ESPESSURA)].forEach((a, i) => {
      caixa(null, L_SAP - 0.04, 0.005, 0.012, X_SAP + 0.02, 0.1 + a + 0.33, 0.5, fita);
      for (let x = X_SAP + 0.1; x < X_SAP + L_SAP - 0.1; x += 0.24) {
        for (const dx of [0, 0.09]) sapatos[i % 2].push(bloco(x + dx, 0.1 + a + 0.05, 0.3, 0.075, 0.1, 0.27));
      }
    });
    [padrao({ color: 0x1c1a19, roughness: 0.3 }), padrao({ color: 0x8a5a38, roughness: 0.4 })]
      .forEach((material, i) => repetir(CUBO_PECAS, material, sapatos[i], true));
    portaVidro("closet-sapateira", L_SAP / 2, A_CLOSET, X_SAP, 0.1, P_CLOSET, "esquerda", vidroBronze);
    portaVidro("closet-sapateira", L_SAP / 2, A_CLOSET, X_SAP + L_SAP / 2, 0.1, P_CLOSET, "direita", vidroBronze);

    // Gaveteiro com nichos abertos
    const X_GAV = X_SAP + L_SAP;
    const L_GAV = kit.casa ? 0.94 : 1.45;
    const ESCALA_BOLSAS = L_GAV / 1.45;
    gabinete("closet-gavetas", L_GAV, A_CLOSET, P_CLOSET, X_GAV, 0.1, 0, nogueira, [0.82, 1.38, 1.94]);
    fundo(X_GAV, L_GAV, 0.94, A_CLOSET - 0.86);
    for (let i = 0; i < 4; i += 1) gaveta("closet-gavetas", L_GAV, 0.2, X_GAV, 0.1 + i * 0.2, P_CLOSET, 0.5, thar, 1, null, nogueira);
    for (const a of [1.36, 1.92, 2.5]) caixa(null, L_GAV - 0.04, 0.005, 0.012, X_GAV + 0.02, 0.1 + a - 0.01, 0.48, fita);
    const bolsas = [padrao({ color: 0x7a4a2e, roughness: 0.45 }), padrao({ color: 0xd8cdb9, roughness: 0.5 }), padrao({ color: 0x1c1a19, roughness: 0.35 })];
    for (const [dx, y, l, a, i] of [[0.12, 0.94, 0.36, 0.28, 0], [0.62, 0.94, 0.3, 0.32, 1], [1.02, 0.94, 0.32, 0.24, 2], [0.2, 1.5, 0.3, 0.3, 2], [0.72, 1.5, 0.38, 0.26, 0], [0.34, 2.06, 0.34, 0.26, 1], [0.9, 2.06, 0.3, 0.3, 0]]) {
      caixa(null, l * ESCALA_BOLSAS, a, 0.18, X_GAV + dx * ESCALA_BOLSAS, y, 0.2, bolsas[i]);
    }

    // Ilha do closet, com as gavetas voltadas para a frente
    const X_ILHA = 4.85;
    const L_ILHA = 1.9;
    const Z_ILHA = 1.75;
    const P_ILHA = 0.9;
    sombraContato(X_ILHA, Z_ILHA, L_ILHA, P_ILHA);
    gabinete("closet-ilha", L_ILHA, 0.8, P_ILHA, X_ILHA, 0.1, Z_ILHA, nogueira);
    for (let c = 0; c < 3; c += 1) {
      for (let f = 0; f < 2; f += 1) gaveta("closet-ilha", L_ILHA / 3, 0.4, X_ILHA + (c * L_ILHA) / 3, 0.1 + f * 0.4, Z_ILHA + P_ILHA, 0.5, thar, 1, null, nogueira);
    }
    caixa(null, L_ILHA - 0.1, 0.1, P_ILHA - 0.1, X_ILHA + 0.05, 0, Z_ILHA + 0.05, M.sombra);
    caixa(null, L_ILHA - 0.04, 0.006, 0.012, X_ILHA + 0.02, 0.07, Z_ILHA + P_ILHA - 0.04, fita);
    caixa("closet-ilha", L_ILHA + 0.08, 0.03, P_ILHA + 0.08, X_ILHA - 0.04, 0.9, Z_ILHA - 0.04, pedraEscura);
    caixa(null, 0.5, 0.012, 0.32, X_ILHA + 0.3, 0.93, Z_ILHA + 0.28, bronze);
    for (const [dx, a] of [[0.4, 0.13], [0.52, 0.1], [0.64, 0.08]]) cilindro(null, 0.026, 0.03, a, X_ILHA + dx, 0.942, Z_ILHA + 0.44, espelho, 18);
    caixa(null, 0.36, 0.1, 0.26, X_ILHA + 1.15, 0.93, Z_ILHA + 0.3, couro);

    // Parede lateral com espelho de corpo inteiro, e puff
    const X_LADO = 7.9;
    const parede = caixa(null, 0.05, 2.85, 3.5, X_LADO, 0, 0, padrao({ map: texturaPintura(T, "#6b6055"), roughness: 0.92 }));
    parede.castShadow = false;
    caixa("closet-espelho", 0.012, 2.2, 1.2, X_LADO - 0.012, 0.25, 0.95, espelho);
    for (const z of [0.93, 2.15]) caixa(null, 0.008, 2.24, 0.012, X_LADO - 0.014, 0.23, z, fita);
    // Na casa, o puff sai do caminho da porta do banheiro
    const Z_PUFF = kit.casa ? 3 : 1.32;
    sombraContato(6.9, Z_PUFF - 0.37, 0.75, 0.75);
    cilindro(null, 0.32, 0.32, 0.4, 7.27, 0.02, Z_PUFF, couro);
    cilindro(null, 0.3, 0.3, 0.02, 7.27, 0, Z_PUFF, bronze);

    return kit.finalizar({
      luzes: [[6, 2.2, 1.1, 0xffc98a, 1.1], [1.8, 1.9, 1.4, 0xffd9a6, 0.45]],
      ambiente: 0.46,
      sol: 0.62,
      // Vista pelo lado do quarto, para a porta de correr aparecer de frente, e não de perfil.
      vista: { camera: [0.3, 1.8, 8.6], alvo: [3.6, 1.25, 1] },
      vistaEstreita: { camera: [0.5, 1.8, 8.8], alvo: [3.3, 1.25, 1.1] },
    });
  }

  function construirGourmet(T, dados) {
    const kit = criarKit(T, dados.modulos.filter((m) => m.comodo === "gourmet"));
    const { M, padrao, caixa, cilindro, esfera, gabinete, gaveta, portaGiro, portaBasculante, portaVidro, tacas, sombraContato, planta, repetir, ESPESSURA } = kit;
    const X_ABERTO = 7.05; // até aqui é coberto; depois ficam o deck e a piscina

    kit.casca({
      piso: { nome: "piso-ceramica", mapa: texturaCeramica(T, 20, 12), rugosidade: 0.34 },
      corFundo: "#5a3a2c",
      corLado: "#b4a899",
      mapaFundo: texturaTijolo(T, 7.75 / 1.6, 4.2 / 0.68),
      inicioRodape: 5.9,
      fimCoberto: X_ABERTO,
      spots: [[1.2, 1.4], [3, 1.4], [5.2, 1.4], [1.2, 3.8], [3, 3.8], [5.7, 3.8], [1.2, 6.2], [3, 6.2], [5.2, 6.2]],
      corTeto: 0x17100b,
      alturaSpots: 2.658,
    });
    kit.cena.background = texturaCeu(T);

    const nogueira = padrao({ map: texturaMadeira(T, "#4a3124", "#1f130b", 13), roughness: 0.42 });
    const travertinoDe = (l, p) => padrao({ map: texturaTravertino(T, l, p), roughness: 0.42, name: "travertino" });
    const aco =padrao({ color: 0x2a2b2d, metalness: 0.75, roughness: 0.4 });
    const fundoAceso = padrao({ map: nogueira.map, roughness: 0.5, emissive: 0xff9a4d, emissiveMap: texturaBrilho(T), emissiveIntensity: 0.42 });
    const fita = new T.MeshBasicMaterial({ color: 0xffc27a });
    const brasa = new T.MeshBasicMaterial({ color: 0xd8400f });
    brasa.color.convertSRGBToLinear();
    const garrafa = padrao({ color: 0x22301f, roughness: 0.2, metalness: 0.2 });
    const vidroEscuro = padrao({ color: 0x2a2520, transparent: true, opacity: 0.18, roughness: 0.03, metalness: 0.2, depthWrite: false });
    const assento = padrao({ color: 0x6a4630, roughness: 0.6 });
    const ALTURA = 2.6;
    const FUNDO = 0.58;

    // Forro de marcenaria: réguas sobre fundo escuro e vigas com spots e luz embutida
    const INICIO_FORRO = kit.casa ? -0.7 : -6;
    const COMPR_FORRO = X_ABERTO - INICIO_FORRO;
    const PROF_FORRO = kit.casa ? kit.casa.prof : 12;
    const reguas = [];
    for (let x = INICIO_FORRO + 0.05; x < X_ABERTO - 0.04; x += 0.11) reguas.push(new T.Matrix4().makeTranslation(x, 2.8, PROF_FORRO / 2));
    repetir(new T.BoxGeometry(0.08, 0.04, PROF_FORRO), M.freijo, reguas, false).userData.teto = true;
    for (const z of [1.28, 3.68, 6.08, 8.48].filter((v) => v + 0.3 < PROF_FORRO)) {
      const viga = caixa("gourmet-forro", COMPR_FORRO, 0.12, 0.24, INICIO_FORRO, 2.66, z, nogueira);
      viga.castShadow = false;
      viga.userData.teto = true;
      const luzViga = caixa(null, COMPR_FORRO, 0.008, 0.012, INICIO_FORRO, 2.765, z + 0.24, fita);
      luzViga.castShadow = false;
      luzViga.userData.teto = true;
    }

    // Portal da churrasqueira: colunas com portas, armário embaixo e painel ripado até o forro
    const X_PORTAL = -0.7;
    const L_COLUNA = 0.45;
    const L_BOCA = 1.1;
    const X_BOCA = X_PORTAL + L_COLUNA;
    const P_PORTAL = 0.7;
    const TOPO_PORTAL = 2.78;
    const TOPO_BASE = 0.87;
    caixa(null, 2, 0.1, P_PORTAL - 0.06, X_PORTAL, 0, 0, M.sombra);
    sombraContato(X_PORTAL, 0.1, 2, 0.8);

    // A boca fica forrada de aço: a madeira não encosta no fogo
    caixa("gourmet-churrasqueira", L_BOCA, 0.2, P_PORTAL, X_BOCA, 1.55, 0, aco);
    caixa("gourmet-churrasqueira", 0.04, 0.65, P_PORTAL, X_BOCA, 0.9, 0, aco);
    caixa("gourmet-churrasqueira", 0.04, 0.65, P_PORTAL, X_BOCA + L_BOCA - 0.04, 0.9, 0, aco);
    caixa(null, L_BOCA - 0.08, 0.65, 0.012, X_BOCA + 0.04, 0.9, 0.002, M.sombra);
    caixa(null, L_BOCA - 0.08, 0.03, 0.56, X_BOCA + 0.04, 0.9, 0.06, brasa);
    for (let z = 0.08; z < 0.62; z += 0.05) caixa(null, L_BOCA - 0.08, 0.008, 0.008, X_BOCA + 0.04, 1.08, z, M.inox);
    caixa(null, L_BOCA, 0.03, P_PORTAL, X_BOCA, TOPO_BASE, 0, travertinoDe(L_BOCA, P_PORTAL));

    for (const [x, dobradica] of [[X_PORTAL, "esquerda"], [X_BOCA + L_BOCA, "direita"]]) {
      gabinete("gourmet-portal", L_COLUNA, TOPO_PORTAL - 0.1, P_PORTAL, x, 0.1, 0, nogueira, [0.77, 1.3, 1.85]);
      portaGiro("gourmet-portal", L_COLUNA, TOPO_BASE - 0.1, x, 0.1, P_PORTAL, nogueira, dobradica);
      portaGiro("gourmet-portal", L_COLUNA, TOPO_PORTAL - TOPO_BASE, x, TOPO_BASE, P_PORTAL, nogueira, dobradica, { cavaEmbaixo: true });
    }
    gabinete("gourmet-portal", L_BOCA, TOPO_BASE - 0.1, P_PORTAL, X_BOCA, 0.1, 0, nogueira, [0.36]);
    portaGiro("gourmet-portal", L_BOCA / 2, TOPO_BASE - 0.1, X_BOCA, 0.1, P_PORTAL, nogueira, "esquerda");
    portaGiro("gourmet-portal", L_BOCA / 2, TOPO_BASE - 0.1, X_BOCA + L_BOCA / 2, 0.1, P_PORTAL, nogueira, "direita");
    caixa("gourmet-portal", L_BOCA, TOPO_PORTAL - 1.75, ESPESSURA, X_BOCA, 1.75, P_PORTAL - ESPESSURA, M.sombra);
    for (let x = X_BOCA + 0.03; x < X_BOCA + L_BOCA - 0.04; x += 0.09) caixa("gourmet-portal", 0.045, TOPO_PORTAL - 1.75, ESPESSURA, x, 1.75, P_PORTAL, M.freijo);

    // Bancada da parede: gaveteiro, armário da cuba e cervejeira
    const X_BANC = 1.3;
    caixa(null, 2.2, 0.1, FUNDO - 0.04, X_BANC, 0, 0, M.sombra);
    sombraContato(X_BANC, 0.1, 2.2, 0.75);
    gabinete("gourmet-gavetas", 0.8, 0.77, FUNDO, X_BANC, 0.1, 0, nogueira);
    for (let i = 0; i < 3; i += 1) gaveta("gourmet-gavetas", 0.8, 0.77 / 3, X_BANC, 0.1 + (i * 0.77) / 3, FUNDO, 0.48, nogueira, 1, null, M.freijo);
    gabinete("gourmet-base-cuba", 0.8, 0.77, FUNDO, X_BANC + 0.8, 0.1, 0, nogueira, [0.36]);
    portaGiro("gourmet-base-cuba", 0.4, 0.77, X_BANC + 0.8, 0.1, FUNDO, nogueira, "esquerda");
    portaGiro("gourmet-base-cuba", 0.4, 0.77, X_BANC + 1.2, 0.1, FUNDO, nogueira, "direita");
    caixa("gourmet-cervejeira", 0.6, 0.77, FUNDO, X_BANC + 1.6, 0.1, 0, M.inox);
    caixa("gourmet-cervejeira", 0.5, 0.018, 0.03, X_BANC + 1.65, 0.78, FUNDO, M.perfil);
    caixa("gourmet-bancada", 2.2, 0.03, 0.62, X_BANC, 0.87, 0, travertinoDe(2.2, 0.62));
    caixa("gourmet-cooktop", 0.6, 0.01, 0.46, X_BANC + 0.1, 0.9, 0.08, M.preto);
    for (const [dx, dz] of [[0.16, 0.13], [0.44, 0.13], [0.16, 0.33], [0.44, 0.33]]) cilindro(null, 0.06, 0.06, 0.002, X_BANC + 0.1 + dx, 0.91, 0.08 + dz, M.perfil);
    caixa("gourmet-cuba", 0.56, 0.006, 0.38, X_BANC + 0.92, 0.9, 0.12, M.inox);
    caixa("gourmet-cuba", 0.5, 0.004, 0.32, X_BANC + 0.95, 0.906, 0.15, M.preto);
    cilindro("gourmet-cuba", 0.012, 0.016, 0.34, X_BANC + 1.2, 0.9, 0.07, M.inox, 24);
    caixa("gourmet-cuba", 0.024, 0.024, 0.2, X_BANC + 1.188, 1.23, 0.07, M.inox);

    // Painel e armários aéreos
    caixa("gourmet-painel", 2.2, 0.6, ESPESSURA, X_BANC, 0.9, 0, M.freijo);
    for (const x of [X_BANC, X_BANC + 1.1]) {
      gabinete("gourmet-aereos", 1.1, 0.7, 0.33, x, 1.5, 0, nogueira, [0.34]);
      portaBasculante("gourmet-aereos", 1.1, 0.7, x, 1.5, 0.33, M.freijo);
    }
    caixa(null, 2.2, 0.008, 0.012, X_BANC, 1.492, 0.22, fita);

    // Torre dos aparelhos: adega e frigobar embutidos, gavetão embaixo e basculante em cima
    const X_TORRE = 3.5;
    const L_TORRE = 1.25;
    caixa("gourmet-torre", 0.05, ALTURA - 0.1, 0.62, X_TORRE, 0.1, 0, M.freijo);
    caixa("gourmet-torre", 0.05, ALTURA - 0.1, 0.62, X_TORRE + L_TORRE - 0.05, 0.1, 0, M.freijo);
    caixa(null, L_TORRE, 0.1, 0.56, X_TORRE, 0, 0, M.sombra);
    sombraContato(X_TORRE, 0.1, L_TORRE, 0.8);
    gaveta("gourmet-torre", 1.15, 0.25, X_TORRE + 0.05, 0.1, 0.6, 0.5, M.freijo, 1, null, nogueira);
    gabinete("gourmet-torre", 1.15, 0.7, 0.6, X_TORRE + 0.05, 1.9, 0, nogueira);
    portaBasculante("gourmet-torre", 1.15, 0.7, X_TORRE + 0.05, 1.9, 0.6, M.freijo);

    gabinete("gourmet-adega", 0.58, 1.55, 0.58, X_TORRE + 0.05, 0.35, 0, M.preto, [0.37, 0.74, 1.11]);
    caixa(null, 0.54, 1.51, 0.004, X_TORRE + 0.07, 0.37, 0.008, fundoAceso);
    caixa("gourmet-adega", 0.58, 1.55, 0.006, X_TORRE + 0.05, 0.35, 0.585, vidroEscuro);
    const garrafas = [];
    for (const y of [0.37, 0.74, 1.11, 1.48]) {
      caixa(null, 0.54, 0.005, 0.012, X_TORRE + 0.07, 0.35 + y + 0.32, 0.5, fita);
      for (let x = X_TORRE + 0.13; x < X_TORRE + 0.58; x += 0.09) garrafas.push(new T.Matrix4().makeTranslation(x, 0.35 + y - 0.22, 0.3));
    }
    repetir(new T.CylinderGeometry(0.028, 0.032, 0.26, 10), garrafa, garrafas, false);

    caixa("gourmet-frigobar", 0.57, 1.55, 0.6, X_TORRE + 0.63, 0.35, 0, M.inox);
    caixa("gourmet-frigobar", 0.018, 0.5, 0.03, X_TORRE + 0.66, 0.9, 0.6, M.perfil);

    // Cristaleira
    const X_CRIS = X_TORRE + L_TORRE;
    const L_CRIS = 1.15;
    const P_CRIS = 0.45;
    gabinete("gourmet-cristaleira", L_CRIS, ALTURA - 0.1, P_CRIS, X_CRIS, 0.1, 0, M.freijo);
    caixa("gourmet-cristaleira", L_CRIS - 0.036, ESPESSURA, P_CRIS - 0.02, X_CRIS + 0.018, 0.93, 0.006, M.freijo);
    for (const y of [1.37, 1.79, 2.21]) caixa("gourmet-cristaleira", L_CRIS - 0.036, 0.012, P_CRIS - 0.05, X_CRIS + 0.018, y, 0.03, M.vidro);
    for (const y of [0.948, 1.382, 1.802, 2.222]) {
      tacas(X_CRIS + 0.1, X_CRIS + L_CRIS - 0.08, y, 0.24);
      caixa(null, L_CRIS - 0.04, 0.006, 0.01, X_CRIS + 0.02, y + 0.38, 0.38, fita);
    }
    portaGiro("gourmet-cristaleira", L_CRIS / 2, 0.85, X_CRIS, 0.1, P_CRIS, M.freijo, "esquerda");
    portaGiro("gourmet-cristaleira", L_CRIS / 2, 0.85, X_CRIS + L_CRIS / 2, 0.1, P_CRIS, M.freijo, "direita");
    portaVidro("gourmet-cristaleira", L_CRIS / 2, 1.63, X_CRIS, 0.95, P_CRIS, "esquerda");
    portaVidro("gourmet-cristaleira", L_CRIS / 2, 1.63, X_CRIS + L_CRIS / 2, 0.95, P_CRIS, "direita");
    caixa(null, L_CRIS, 0.1, 0.4, X_CRIS, 0, 0, M.sombra);
    sombraContato(X_CRIS, 0.1, L_CRIS, 0.6);
    planta(6.55, 0.55);

    // Ilha: armários voltados para a parede e ripado do lado das banquetas
    const X_ILHA = 1.3;
    const Z_ILHA = 2.1;
    const P_ILHA = 0.9;
    sombraContato(X_ILHA - 0.05, Z_ILHA - 0.05, 2.7, 1.1);
    gabinete("gourmet-ilha", 1.5, 0.77, P_ILHA, X_ILHA, 0.1, Z_ILHA, nogueira);
    gabinete("gourmet-ilha", 1.1, 0.77, P_ILHA, X_ILHA + 1.5, 0.1, Z_ILHA, nogueira, [0.36]);
    for (let i = 0; i < 3; i += 1) gaveta("gourmet-ilha", 1.5, 0.77 / 3, X_ILHA, 0.1 + (i * 0.77) / 3, Z_ILHA, 0.6, nogueira, -1, null, M.freijo);
    portaGiro("gourmet-ilha", 0.55, 0.77, X_ILHA + 1.5, 0.1, Z_ILHA, nogueira, "esquerda", { sentido: -1 });
    portaGiro("gourmet-ilha", 0.55, 0.77, X_ILHA + 2.05, 0.1, Z_ILHA, nogueira, "direita", { sentido: -1 });
    caixa("gourmet-ilha-fundo", 2.6, 0.77, ESPESSURA, X_ILHA, 0.1, Z_ILHA + P_ILHA, M.freijo);
    for (let x = X_ILHA + 0.03; x < X_ILHA + 2.58; x += 0.09) caixa("gourmet-ilha-fundo", 0.045, 0.77, ESPESSURA, x, 0.1, Z_ILHA + P_ILHA + ESPESSURA, M.freijo);
    caixa("gourmet-ilha-fundo", ESPESSURA, 0.77, P_ILHA, X_ILHA - ESPESSURA, 0.1, Z_ILHA, M.freijo);
    caixa("gourmet-ilha-fundo", ESPESSURA, 0.77, P_ILHA, X_ILHA + 2.6, 0.1, Z_ILHA, M.freijo);
    caixa(null, 2.6, 0.1, P_ILHA - 0.06, X_ILHA, 0, Z_ILHA + 0.03, M.sombra);
    caixa(null, 2.5, 0.006, 0.012, X_ILHA + 0.05, 0.07, Z_ILHA + P_ILHA - 0.04, fita);
    caixa("gourmet-bancada-ilha", 2.68, 0.03, 1.22, X_ILHA - 0.04, 0.87, Z_ILHA - 0.02, travertinoDe(2.68, 1.22));

    // Chopeira sobre a ilha
    const X_CHOPE = X_ILHA + 0.75;
    const Z_CHOPE = Z_ILHA + 0.4;
    cilindro("gourmet-chopeira", 0.03, 0.036, 0.42, X_CHOPE, 0.9, Z_CHOPE, M.inox, 20);
    caixa("gourmet-chopeira", 0.34, 0.07, 0.07, X_CHOPE - 0.17, 1.3, Z_CHOPE - 0.035, M.inox);
    for (const dx of [-0.11, 0.11]) {
      caixa("gourmet-chopeira", 0.02, 0.1, 0.05, X_CHOPE + dx - 0.01, 1.22, Z_CHOPE + 0.03, M.perfil);
      caixa("gourmet-chopeira", 0.018, 0.11, 0.018, X_CHOPE + dx - 0.009, 1.37, Z_CHOPE, M.perfil);
    }
    for (const x of [X_ILHA + 1.5, X_ILHA + 1.66]) tacas(x, x + 0.01, 0.9, Z_ILHA + 0.55);

    // Banquetas
    for (const x of [1.75, 2.45, 3.15]) {
      const z = Z_ILHA + P_ILHA + 0.42;
      sombraContato(x - 0.26, z - 0.26, 0.52, 0.52);
      cilindro(null, 0.175, 0.165, 0.055, x, 0.66, z, assento);
      cilindro(null, 0.016, 0.02, 0.66, x, 0, z, M.inox, 16);
      cilindro(null, 0.17, 0.185, 0.018, x, 0, z, M.perfil);
      caixa(null, 0.3, 0.2, 0.025, x - 0.15, 0.87, z + 0.15, assento);
      caixa(null, 0.018, 0.2, 0.018, x - 0.01, 0.71, z + 0.15, M.perfil);
    }

    // Pendentes sobre o balcão e sobre a mesa
    const lampada = padrao({ color: 0xf2e6cf, roughness: 0.6, emissive: 0xffd9a6, emissiveIntensity: 0.9 });
    const pendente = (x, z) => {
      cilindro(null, 0.004, 0.004, 1.05, x, 1.8, z, M.perfil, 8);
      cilindro(null, 0.05, 0.12, 0.16, x, 1.65, z, M.perfil);
      esfera(0.035, x, 1.65, z, lampada);
    };
    for (const x of [1.8, 3.4]) pendente(x, Z_ILHA + 0.5);

    // Mesa de jantar para seis pessoas
    const X_MESA = 4.75;
    const Z_MESA = 2.25;
    const L_MESA = 2;
    const P_MESA = 1;
    sombraContato(X_MESA, Z_MESA, L_MESA, P_MESA);
    caixa("gourmet-mesa", L_MESA, 0.04, P_MESA, X_MESA, 0.71, Z_MESA, M.freijo);
    for (const x of [X_MESA + 0.3, X_MESA + L_MESA - 0.34]) caixa("gourmet-mesa", 0.04, 0.71, P_MESA - 0.3, x, 0, Z_MESA + 0.15, M.perfil);
    for (const x of [X_MESA + 0.5, X_MESA + 1.5]) pendente(x, Z_MESA + 0.5);
    for (const x of [X_MESA + 0.2, X_MESA + 0.8, X_MESA + 1.4]) {
      for (const [z, encosto] of [[Z_MESA - 0.34, Z_MESA - 0.36], [Z_MESA + P_MESA - 0.1, Z_MESA + P_MESA + 0.3]]) {
        caixa(null, 0.42, 0.05, 0.42, x, 0.44, z, assento);
        caixa(null, 0.42, 0.38, 0.03, x, 0.5, encosto, assento);
        cilindro(null, 0.015, 0.02, 0.44, x + 0.21, 0, z + 0.21, M.perfil, 10);
      }
    }

    // Cortina na parede lateral
    kit.comoLateral(() => {
      const pano = padrao({ color: 0xb9ae9d, roughness: 0.96 });
      for (let z = 1.6; z < 2.25; z += 0.14) caixa(null, 0.05, 2.72, 0.145, -0.63 + (Math.round(z * 7) % 2) * 0.025, 0.02, z, pano);
      caixa(null, 0.04, 0.04, 0.8, -0.66, 2.74, 1.55, M.perfil);
    });

    // Lado aberto: viga da cobertura, com pilares finos, para não atrapalhar a vista da piscina
    const PROF_CENA = kit.casa ? kit.casa.prof : 12;
    caixa(null, 0.22, 0.22, PROF_CENA, X_ABERTO, 2.63, 0, nogueira).userData.teto = true;
    caixa(null, 0.012, 0.012, PROF_CENA, X_ABERTO - 0.014, 2.62, 0, fita).userData.teto = true;
    for (const z of [0.02, 6, 9.6].filter((v) => v + 0.12 < PROF_CENA)) caixa(null, 0.12, 2.63, 0.12, X_ABERTO + 0.05, 0, z, M.perfil);

    // Deck de madeira em toda a parte aberta
    const X_FIM = 13.3;
    const deck = padrao({ map: texturaPisoMadeira(T, 6.25, PROF_CENA, 58), roughness: 0.6 });
    const piso = caixa(null, X_FIM - X_ABERTO, 0.01, PROF_CENA, X_ABERTO, 0, 0, deck);
    piso.castShadow = false;

    // Piscina, com borda de pedra clara e luz junto da água
    const X_PISCINA = 7.6;
    const Z_PISCINA = 0.8;
    const L_PISCINA = 3;
    const P_PISCINA = 3.8;
    const BORDA = 0.25;
    const agua = padrao({ map: texturaAgua(T, L_PISCINA / 1.5, P_PISCINA / 1.5), roughness: 0.1, metalness: 0.15 });
    const pedraClara = padrao({ color: 0xd9d4c8, roughness: 0.75 });
    const lamina = caixa("gourmet-piscina", L_PISCINA, 0.012, P_PISCINA, X_PISCINA, 0.008, Z_PISCINA, agua);
    lamina.castShadow = false;
    caixa("gourmet-piscina", L_PISCINA + 2 * BORDA, 0.04, BORDA, X_PISCINA - BORDA, 0.008, Z_PISCINA - BORDA, pedraClara);
    caixa("gourmet-piscina", L_PISCINA + 2 * BORDA, 0.04, BORDA, X_PISCINA - BORDA, 0.008, Z_PISCINA + P_PISCINA, pedraClara);
    caixa("gourmet-piscina", BORDA, 0.04, P_PISCINA, X_PISCINA - BORDA, 0.008, Z_PISCINA, pedraClara);
    caixa("gourmet-piscina", BORDA, 0.04, P_PISCINA, X_PISCINA + L_PISCINA, 0.008, Z_PISCINA, pedraClara);

    // Muro verde e duas espreguiçadeiras
    const sebe = padrao({ map: texturaSebe(T, (X_FIM - X_ABERTO) / 2.4, 1), roughness: 0.95 });
    const sebeLado = padrao({ map: texturaSebe(T, PROF_CENA / 2.4, 1), roughness: 0.95 });
    caixa(null, X_FIM - X_ABERTO, 2.4, 0.2, X_ABERTO, 0, -0.2, sebe).castShadow = false;
    caixa(null, 0.2, 2.4, PROF_CENA, X_FIM, 0, 0, sebeLado).castShadow = false;
    planta(12.5, 0.7);
    const lona = padrao({ color: 0xece6da, roughness: 0.9 });
    for (const z of [1.5, 3]) {
      sombraContato(11.05, z - 0.05, 1.9, 0.75);
      caixa(null, 1.3, 0.1, 0.62, 11.05, 0.26, z, lona);
      caixa(null, 0.62, 0.1, 0.62, 12.2, 0.42, z, lona).rotation.z = 0.5;
      for (const dx of [0.05, 1.2]) caixa(null, 0.04, 0.26, 0.56, 11.05 + dx, 0, z + 0.03, M.freijo);
    }

    return kit.finalizar({
      luzes: [[2.4, 1.45, 0.5, 0xffd9a6, 0.6], [0.3, 1.15, 0.55, 0xff8a45, 0.9]],
      ambiente: 0.55,
      sol: 0.78,
      sombraAte: 14,
      distanciaMaxima: 12.5,
      // Vista em diagonal, para a marcenaria e a piscina caberem juntas.
      vista: { camera: [2.6, 1.55, 11.9], alvo: [3.75, 1.2, 0.5] },
      vistaEstreita: { camera: [3.2, 1.75, 10.8], alvo: [6.7, 1.2, 1.9] },
    });
  }

  // Escritório de uma pessoa, dentro de casa: cinza e preto, com luz quente e baixa.
  function construirEscritorio(T, dados) {
    const kit = criarKit(T, dados.modulos.filter((m) => m.comodo === "escritorio"));
    const { M, padrao, caixa, cilindro, esfera, gabinete, gaveta, portaGiro, sombraContato, planta, ESPESSURA } = kit;

    kit.casca({
      piso: { nome: "piso-madeira", mapa: texturaPisoMadeira(T, 20, 12, 40), rugosidade: 0.48 },
      corFundo: "#343436",
      corLado: "#77767a",
      corTeto: 0x8a8884,
      inicioRodape: 6.35,
      spots: [[0.6, 1.2], [2.1, 1.2], [3.6, 1.2], [5.1, 1.2]],
    });

    const grafite = padrao({ map: texturaMadeira(T, "#2c2c2e", "#141416", 13), roughness: 0.5 });
    const cinza = padrao({ map: texturaMadeira(T, "#6d6d6c", "#464645", 17), roughness: 0.55 });
    const estofado = padrao({ color: 0x6f6e6b, roughness: 0.9 });
    const tecidoClaro = padrao({ color: 0x8f8e8a, roughness: 0.96 });
    const tecidoEscuro = padrao({ color: 0x3e3e40, roughness: 0.96 });
    const tapete = padrao({ color: 0x4f4d4a, roughness: 1 });
    const tela = padrao({ color: 0x0a0d14, roughness: 0.35, metalness: 0.2 });
    const cupula = (forca) => padrao({ color: 0xf2e6cf, roughness: 0.9, emissive: 0xffc98a, emissiveIntensity: forca });
    const livros = [0x1f1f21, 0x3a3a3c, 0x6f6f70, 0xa8a6a1, 0xd8d2c5, 0x8a6f55].map((color) => padrao({ color, roughness: 0.8 }));
    const ALTURA = 2.6;

    // Armário alto: portas de baixo e de cima se encontram na mesma cava
    const X_ARMARIO = -0.6;
    const L_ARMARIO = 1.2;
    const P_ARMARIO = 0.55;
    const CAVA_ARMARIO = 0.95;
    gabinete("escritorio-armario", L_ARMARIO, ALTURA - 0.1, P_ARMARIO, X_ARMARIO, 0.1, 0, cinza, [0.85, 1.4, 1.95]);
    for (const [x, dobradica] of [[X_ARMARIO, "esquerda"], [X_ARMARIO + L_ARMARIO / 2, "direita"]]) {
      portaGiro("escritorio-armario", L_ARMARIO / 2, CAVA_ARMARIO - 0.1, x, 0.1, P_ARMARIO, cinza, dobradica);
      portaGiro("escritorio-armario", L_ARMARIO / 2, ALTURA - CAVA_ARMARIO, x, CAVA_ARMARIO, P_ARMARIO, cinza, dobradica, { cavaEmbaixo: true });
    }
    for (const y of [1, 1.55]) for (const x of [0.08, 0.42, 0.76]) caixa(null, 0.3, 0.32, 0.36, X_ARMARIO + x, y, 0.08, tecidoEscuro);
    caixa(null, L_ARMARIO, 0.1, P_ARMARIO - 0.06, X_ARMARIO, 0, 0, M.sombra);
    sombraContato(X_ARMARIO, 0.1, L_ARMARIO, P_ARMARIO + 0.2);

    // Estante: nichos com luz quente e livros em cima, portas embaixo
    const X_ESTANTE = 0.6;
    const P_ESTANTE = 0.4;
    const fita = new T.MeshBasicMaterial({ color: 0xffc27a });
    const rLivros = sorteador(29);
    for (let i = 0; i < 3; i += 1) {
      const x = X_ESTANTE + i;
      gabinete("escritorio-estante", 1, ALTURA - 0.1, P_ESTANTE, x, 0.1, 0, grafite, [0.85, 1.28, 1.71, 2.13]);
      portaGiro("escritorio-estante", 0.5, 0.85, x, 0.1, P_ESTANTE, grafite, "esquerda");
      portaGiro("escritorio-estante", 0.5, 0.85, x + 0.5, 0.1, P_ESTANTE, grafite, "direita");
      for (const y of [1.37, 1.8, 2.22, 2.57]) caixa(null, 0.96, 0.006, 0.01, x + 0.02, y, 0.34, fita);
      const trechos = [[[0.968, 0.06, 0.6], [1.398, 0.42, 0.94], [1.828, 0.06, 0.48], [2.248, 0.5, 0.94]], [[0.968, 0.4, 0.94], [1.398, 0.06, 0.5], [1.828, 0.46, 0.94], [2.248, 0.06, 0.44]], [[0.968, 0.06, 0.52], [1.398, 0.5, 0.94], [1.828, 0.06, 0.56], [2.248, 0.44, 0.94]]][i];
      for (const [y, x0, x1] of trechos) {
        for (let xl = x + x0; xl < x + x1;) {
          const largura = 0.035 + rLivros() * 0.04;
          caixa(null, largura, 0.2 + rLivros() * 0.1, 0.22, xl, y, 0.08, livros[Math.floor(rLivros() * livros.length)]);
          xl += largura + 0.003;
        }
      }
    }
    cilindro(null, 0.055, 0.04, 0.22, X_ESTANTE + 0.2, 1.398, 0.2, M.ceramicaBranca, 20);
    esfera(0.08, X_ESTANTE + 1.2, 1.908, 0.2, M.ceramicaBranca);
    cilindro(null, 0.08, 0.05, 0.18, X_ESTANTE + 2.25, 1.398, 0.2, M.preto, 20);
    caixa(null, 3, 0.1, P_ESTANTE - 0.05, X_ESTANTE, 0, 0, M.sombra);
    sombraContato(X_ESTANTE, 0.1, 3, P_ESTANTE + 0.2);

    // Painel ripado com quadro e aparador suspenso
    const X_PAINEL = 3.75;
    const L_PAINEL = 2.6;
    caixa("escritorio-painel", L_PAINEL, ALTURA, ESPESSURA, X_PAINEL, 0, 0, M.sombra);
    for (let x = X_PAINEL + 0.02; x < X_PAINEL + L_PAINEL - 0.04; x += 0.09) caixa("escritorio-painel", 0.06, ALTURA, ESPESSURA, x, 0, ESPESSURA, cinza);
    caixa(null, L_PAINEL, 0.012, 0.02, X_PAINEL, 2.58, 0.05, fita);
    caixa(null, 1.3, 0.9, 0.03, X_PAINEL + 0.65, 1.15, 0.04, M.perfil);
    caixa(null, 1.22, 0.82, 0.004, X_PAINEL + 0.69, 1.19, 0.07, livros[4]);
    caixa(null, 0.5, 0.56, 0.004, X_PAINEL + 0.84, 1.3, 0.074, livros[1]);
    caixa(null, 0.3, 0.3, 0.004, X_PAINEL + 1.2, 1.46, 0.078, livros[3]);

    const X_APARADOR = X_PAINEL + 0.2;
    const Y_APARADOR = 0.3;
    const A_APARADOR = 0.45;
    const P_APARADOR = 0.45;
    const Z_APARADOR = 0.036;
    const FACE = Z_APARADOR + P_APARADOR;
    gabinete("escritorio-aparador", 2.2, A_APARADOR, P_APARADOR, X_APARADOR, Y_APARADOR, Z_APARADOR, grafite);
    for (const x of [X_APARADOR, X_APARADOR + 1.7]) gaveta("escritorio-aparador", 0.5, A_APARADOR, x, Y_APARADOR, FACE, 0.38, grafite);
    portaGiro("escritorio-aparador", 0.6, A_APARADOR, X_APARADOR + 0.5, Y_APARADOR, FACE, grafite, "esquerda");
    portaGiro("escritorio-aparador", 0.6, A_APARADOR, X_APARADOR + 1.1, Y_APARADOR, FACE, grafite, "direita");
    sombraContato(X_APARADOR, 0.1, 2.2, P_APARADOR + 0.1);
    for (let i = 0; i < 3; i += 1) caixa(null, 0.32, 0.03, 0.22, X_APARADOR + 0.25, Y_APARADOR + A_APARADOR + i * 0.03, 0.15, livros[i + 2]);
    cilindro(null, 0.045, 0.08, 0.26, X_APARADOR + 1.9, Y_APARADOR + A_APARADOR, 0.25, M.preto, 22);

    // Na casa, a planta sai do caminho da porta da suíte
    if (kit.casa) planta(7.2, 2.6);
    else planta(6.85, 0.55);

    // Tapete macio sob a mesa e a poltrona
    caixa(null, 3.6, 0.018, 3.4, 0.7, 0, 0.7, tapete).castShadow = false;

    // Mesa: tampo, lateral inteiriça, frente ripada e gaveteiro voltado para a poltrona
    const X_MESA = 1.3;
    const Z_MESA = 1.75;
    const L_MESA = 2.4;
    const P_MESA = 0.9;
    const A_MESA = 0.72;
    sombraContato(X_MESA, Z_MESA, L_MESA, P_MESA);
    caixa("escritorio-mesa", L_MESA, 0.05, P_MESA, X_MESA, A_MESA, Z_MESA, grafite);
    caixa("escritorio-mesa", 0.05, A_MESA, P_MESA, X_MESA, 0, Z_MESA, grafite);
    caixa("escritorio-mesa", L_MESA - 0.55, 0.52, ESPESSURA, X_MESA + 0.05, 0.2, Z_MESA + P_MESA - 0.07, M.sombra);
    for (let x = X_MESA + 0.08; x < X_MESA + L_MESA - 0.53; x += 0.09) caixa("escritorio-mesa", 0.05, 0.52, ESPESSURA, x, 0.2, Z_MESA + P_MESA - 0.052, cinza);

    const X_GAV = X_MESA + L_MESA - 0.5;
    const Z_GAV = Z_MESA + 0.05;
    caixa(null, 0.5, 0.1, 0.74, X_GAV, 0, Z_GAV + 0.03, M.sombra);
    gabinete("escritorio-gaveteiro", 0.5, A_MESA - 0.1, 0.8, X_GAV, 0.1, Z_GAV, grafite);
    for (let i = 0; i < 3; i += 1) gaveta("escritorio-gaveteiro", 0.5, (A_MESA - 0.1) / 3, X_GAV, 0.1 + (i * (A_MESA - 0.1)) / 3, Z_GAV, 0.6, grafite, -1, null, cinza);
    caixa("escritorio-gaveteiro", 0.5, A_MESA - 0.1, ESPESSURA, X_GAV, 0.1, Z_GAV + 0.8, grafite);

    // Sobre a mesa: monitor virado para a poltrona, teclado, livros, caneca e luminária
    const Y_TAMPO = A_MESA + 0.05;
    const X_MONITOR = X_MESA + 0.55;
    const Z_MONITOR = Z_MESA + 0.35;
    caixa("escritorio-monitor", 0.8, 0.46, 0.025, X_MONITOR, Y_TAMPO + 0.16, Z_MONITOR, M.preto);
    caixa(null, 0.76, 0.42, 0.002, X_MONITOR + 0.02, Y_TAMPO + 0.18, Z_MONITOR - 0.002, tela);
    cilindro("escritorio-monitor", 0.02, 0.02, 0.16, X_MONITOR + 0.4, Y_TAMPO, Z_MONITOR + 0.03, M.perfil, 12);
    caixa("escritorio-monitor", 0.26, 0.012, 0.18, X_MONITOR + 0.27, Y_TAMPO, Z_MONITOR - 0.06, M.perfil);
    caixa(null, 0.42, 0.014, 0.14, X_MONITOR + 0.19, Y_TAMPO, Z_MESA + 0.08, M.perfil);
    for (let i = 0; i < 3; i += 1) caixa(null, 0.28, 0.03, 0.2, X_MESA + 0.14, Y_TAMPO + i * 0.03, Z_MESA + 0.45, livros[i + 2]);
    cilindro(null, 0.04, 0.035, 0.09, X_MESA + 1.55, Y_TAMPO, Z_MESA + 0.2, M.ceramicaBranca, 18);
    cilindro(null, 0.07, 0.08, 0.016, X_MESA + 0.25, Y_TAMPO, Z_MESA + 0.2, M.perfil, 20);
    cilindro(null, 0.008, 0.008, 0.36, X_MESA + 0.25, Y_TAMPO + 0.016, Z_MESA + 0.2, M.perfil, 8);
    cilindro(null, 0.05, 0.09, 0.12, X_MESA + 0.25, Y_TAMPO + 0.36, Z_MESA + 0.2, cupula(0.95), 20);

    // Poltrona giratória estofada, de encosto alto, no lugar da cadeira de escritório
    const X_POLTRONA = X_MESA + 0.95;
    const Z_POLTRONA = 1.2;
    sombraContato(X_POLTRONA - 0.38, Z_POLTRONA - 0.38, 0.76, 0.76);
    caixa("escritorio-poltrona", 0.68, 0.14, 0.62, X_POLTRONA - 0.34, 0.4, Z_POLTRONA - 0.3, estofado);
    caixa("escritorio-poltrona", 0.68, 0.84, 0.14, X_POLTRONA - 0.34, 0.5, Z_POLTRONA - 0.36, estofado).rotation.x = -0.1;
    caixa("escritorio-poltrona", 0.1, 0.24, 0.56, X_POLTRONA - 0.34, 0.52, Z_POLTRONA - 0.26, estofado);
    caixa("escritorio-poltrona", 0.1, 0.24, 0.56, X_POLTRONA + 0.24, 0.52, Z_POLTRONA - 0.26, estofado);
    caixa(null, 0.46, 0.08, 0.5, X_POLTRONA - 0.23, 0.53, Z_POLTRONA - 0.2, estofado);
    caixa(null, 0.42, 0.26, 0.1, X_POLTRONA - 0.21, 0.66, Z_POLTRONA - 0.2, tecidoEscuro).rotation.x = -0.2;
    cilindro(null, 0.03, 0.035, 0.34, X_POLTRONA, 0.06, Z_POLTRONA, M.perfil, 14);
    cilindro(null, 0.27, 0.3, 0.04, X_POLTRONA, 0.02, Z_POLTRONA, M.perfil);

    // Canto de leitura: poltrona com manta, mesa de apoio e luminária de piso
    const X_LEITURA = 5.05;
    const Z_LEITURA = 1.5;
    caixa(null, 2, 0.018, 2, X_LEITURA - 0.55, 0, Z_LEITURA - 0.5, tapete).castShadow = false;
    sombraContato(X_LEITURA - 0.09, Z_LEITURA - 0.1, 0.95, 0.95);
    caixa(null, 0.78, 0.26, 0.78, X_LEITURA, 0.2, Z_LEITURA, tecidoClaro);
    caixa(null, 0.78, 0.62, 0.14, X_LEITURA, 0.28, Z_LEITURA - 0.02, tecidoClaro).rotation.x = -0.1;
    caixa(null, 0.4, 0.3, 0.12, X_LEITURA + 0.19, 0.46, Z_LEITURA + 0.14, tecidoEscuro).rotation.x = -0.25;
    caixa(null, 0.42, 0.02, 0.8, X_LEITURA + 0.34, 0.46, Z_LEITURA + 0.0, tecidoEscuro);
    caixa(null, 0.42, 0.34, 0.02, X_LEITURA + 0.34, 0.12, Z_LEITURA + 0.8, tecidoEscuro);
    for (const [dx, dz] of [[0.06, 0.06], [0.7, 0.06], [0.06, 0.7], [0.7, 0.7]]) cilindro(null, 0.018, 0.012, 0.2, X_LEITURA + dx, 0, Z_LEITURA + dz, M.perfil, 10);
    sombraContato(X_LEITURA + 0.94, Z_LEITURA + 0.1, 0.42, 0.42);
    cilindro(null, 0.2, 0.2, 0.025, X_LEITURA + 1.15, 0.5, Z_LEITURA + 0.3, M.perfil, 28);
    cilindro(null, 0.012, 0.012, 0.5, X_LEITURA + 1.15, 0, Z_LEITURA + 0.3, M.perfil, 10);
    for (let i = 0; i < 2; i += 1) caixa(null, 0.2, 0.025, 0.14, X_LEITURA + 1.05, 0.525 + i * 0.025, Z_LEITURA + 0.23, livros[i + 3]);
    cilindro(null, 0.14, 0.15, 0.02, X_LEITURA + 1.5, 0, Z_LEITURA - 0.1, M.perfil, 28);
    cilindro(null, 0.01, 0.01, 1.55, X_LEITURA + 1.5, 0.02, Z_LEITURA - 0.1, M.perfil, 10);
    cilindro(null, 0.11, 0.17, 0.26, X_LEITURA + 1.5, 1.55, Z_LEITURA - 0.1, cupula(0.8), 28);

    // Cortina escura na parede lateral, dos dois lados da janela
    kit.comoLateral(() => {
      const pano = padrao({ color: 0x55555a, roughness: 0.96 });
      for (const [inicio, fim] of [[1.6, 2.25], [4.25, 4.9]]) {
        for (let z = inicio; z < fim; z += 0.14) caixa(null, 0.05, 2.72, 0.145, -0.63 + (Math.round(z * 7) % 2) * 0.025, 0.02, z, pano);
      }
      caixa(null, 0.04, 0.04, 3.4, -0.66, 2.74, 1.55, M.perfil);
    });

    return kit.finalizar({
      luzes: [[X_MESA + 2.1, 1.3, Z_MESA + 0.55, 0xffc98a, 0.8], [X_LEITURA + 1.3, 1.5, Z_LEITURA, 0xffc98a, 0.8]],
      ambiente: 0.42,
      sol: 0.5,
      distanciaMaxima: 11,
      // Vista em diagonal e um pouco de cima, para a poltrona aparecer atrás da mesa.
      vista: { camera: [7.4, 2.3, 7.4], alvo: [2.9, 0.95, 1.3] },
    });
  }

  // Hall de entrada, na paleta da casa: Freijó, nogueira, travertino e parede em tom quente.
  function construirHall(T, dados) {
    const kit = criarKit(T, dados.modulos.filter((m) => m.comodo === "hall"));
    const { M, padrao, caixa, cilindro, esfera, gabinete, gaveta, portaGiro, portaBasculante, sombraContato, planta, ESPESSURA } = kit;

    kit.casca({
      piso: { nome: "piso-madeira", mapa: texturaPisoMadeira(T, 20, 12), rugosidade: 0.42 }, // o mesmo da sala
      corFundo: "#b4a899",
      corLado: "#c9bfb0",
      inicioRodape: 8.2,
      spots: [[0.2, 1.3], [2, 1.3], [3.8, 1.3], [5.4, 1.3]],
      rebaixo: { x0: 0.5, x1: 6.3, z0: 0.9, z1: 5.2 },
    });

    const nogueira = padrao({ map: texturaMadeira(T, "#4a3124", "#1f130b", 13), roughness: 0.42 });
    const fita = new T.MeshBasicMaterial({ color: 0xffc27a });
    const assento = padrao({ color: 0xb9ae9d, roughness: 0.95 });
    const almofada = padrao({ color: 0xb1693c, roughness: 0.92 });
    const tapete = padrao({ color: 0x5c4e3e, roughness: 1 });
    const casaco =padrao({ color: 0x6a4630, roughness: 0.9 });
    const ALTURA = 2.6;
    const P_ARMARIO = 0.5;

    // Armário de casacos
    const X_ARMARIO = -0.6;
    gabinete("hall-armario", 1, ALTURA - 0.1, P_ARMARIO, X_ARMARIO, 0.1, 0, nogueira, [2.05]);
    caixa(null, 0.94, 0.025, 0.025, X_ARMARIO + 0.03, 2, 0.25, M.perfil);
    for (const x of [0.15, 0.4, 0.65]) caixa(null, 0.2, 1.05, 0.4, X_ARMARIO + x, 0.93, 0.05, casaco);
    const CAVA_ARMARIO = 0.95; // portas de baixo e de cima se encontram na altura da mão
    for (const [x, dobradica] of [[X_ARMARIO, "esquerda"], [X_ARMARIO + 0.5, "direita"]]) {
      portaGiro("hall-armario", 0.5, CAVA_ARMARIO - 0.1, x, 0.1, P_ARMARIO, nogueira, dobradica);
      portaGiro("hall-armario", 0.5, ALTURA - CAVA_ARMARIO, x, CAVA_ARMARIO, P_ARMARIO, nogueira, dobradica, { cavaEmbaixo: true });
    }

    // Sapateira
    const X_SAP = X_ARMARIO + 1;
    const A_SAP = (ALTURA - 0.1) / 4;
    gabinete("hall-sapateira", 0.6, ALTURA - 0.1, P_ARMARIO, X_SAP, 0.1, 0, nogueira, [A_SAP, 2 * A_SAP, 3 * A_SAP]);
    for (let i = 0; i < 4; i += 1) {
      portaBasculante("hall-sapateira", 0.6, A_SAP, X_SAP, 0.1 + i * A_SAP, P_ARMARIO, nogueira);
      for (const x of [0.08, 0.32]) caixa(null, 0.2, 0.1, 0.3, X_SAP + x, 0.12 + i * A_SAP, 0.1, casaco);
    }
    caixa(null, 1.6, 0.1, P_ARMARIO - 0.06, X_ARMARIO, 0, 0, M.sombra);
    sombraContato(X_ARMARIO, 0.1, 1.6, P_ARMARIO + 0.2);

    // Painel ripado com luz no alto
    const X_PAINEL = 1;
    const L_PAINEL = 2.1;
    caixa("hall-painel", L_PAINEL, ALTURA, ESPESSURA, X_PAINEL, 0, 0, M.freijo);
    for (let x = X_PAINEL + 0.02; x < X_PAINEL + L_PAINEL - 0.04; x += 0.09) caixa("hall-painel", 0.045, ALTURA, ESPESSURA, x, 0, ESPESSURA, M.freijo);
    caixa(null, L_PAINEL, 0.012, 0.02, X_PAINEL, 2.58, 0.05, fita);

    // Aparador suspenso com tampo de travertino
    const X_APARADOR = 1.2;
    const L_APARADOR = 1.7;
    const Y_APARADOR = 0.45;
    const A_APARADOR = 0.42;
    const P_APARADOR = 0.4;
    const FACE = 0.036 + P_APARADOR;
    gabinete("hall-aparador", L_APARADOR, A_APARADOR, P_APARADOR, X_APARADOR, Y_APARADOR, 0.036, M.freijo);
    for (const x of [X_APARADOR, X_APARADOR + L_APARADOR / 2]) gaveta("hall-aparador", L_APARADOR / 2, A_APARADOR, x, Y_APARADOR, FACE, 0.32, M.freijo);
    caixa("hall-tampo", L_APARADOR + 0.04, 0.03, P_APARADOR + 0.04, X_APARADOR - 0.02, Y_APARADOR + A_APARADOR, 0.03, padrao({ map: texturaTravertino(T, L_APARADOR, P_APARADOR), roughness: 0.42, name: "travertino" }));
    caixa(null, L_APARADOR - 0.1, 0.008, 0.012, X_APARADOR + 0.05, Y_APARADOR - 0.008, P_APARADOR - 0.04, fita);
    sombraContato(X_APARADOR, 0.15, L_APARADOR, P_APARADOR + 0.1);
    const Y_TAMPO = Y_APARADOR + A_APARADOR + 0.03;
    cilindro(null, 0.05, 0.09, 0.3, X_APARADOR + 0.3, Y_TAMPO, 0.24, M.terra, 22);
    for (let i = 0; i < 2; i += 1) caixa(null, 0.3, 0.03, 0.22, X_APARADOR + 1.15, Y_TAMPO + i * 0.03, 0.15, i ? M.quadro : M.arte);
    cilindro(null, 0.1, 0.08, 0.025, X_APARADOR + 0.8, Y_TAMPO, 0.25, M.perfil, 24);

    // Espelho redondo, com luz atrás
    const X_ESPELHO = X_APARADOR + L_APARADOR / 2;
    const Y_ESPELHO = 1.7;
    const redondo = (id, raio, z, material) => {
      const peca = cilindro(id, raio, raio, 0.012, X_ESPELHO, 0, z, material, 48);
      peca.rotation.x = Math.PI / 2;
      peca.position.y = Y_ESPELHO;
    };
    redondo(null, 0.47, 0.04, fita);
    redondo("hall-espelho", 0.45, 0.052, M.perfil);
    redondo("hall-espelho", 0.435, 0.06, padrao({ color: 0xf2f7f8, roughness: 0.04, metalness: 0.55 }));

    // Porta de entrada, com puxador vertical
    const X_PORTA = X_PAINEL + L_PAINEL;
    const L_PORTA = 1.4;
    const A_PORTA = 2.5;
    caixa("hall-porta", L_PORTA, A_PORTA, 0.04, X_PORTA, 0, 0, nogueira);
    for (let x = X_PORTA + 0.04; x < X_PORTA + L_PORTA - 0.06; x += 0.11) caixa("hall-porta", 0.06, A_PORTA, 0.02, x, 0, 0.04, nogueira);
    caixa(null, L_PORTA, ALTURA - A_PORTA, ESPESSURA, X_PORTA, A_PORTA, 0, M.freijo);
    caixa(null, 0.03, A_PORTA, 0.07, X_PORTA, 0, 0, M.perfil);
    caixa(null, 0.03, A_PORTA, 0.07, X_PORTA + L_PORTA - 0.03, 0, 0, M.perfil);
    caixa(null, L_PORTA, 0.03, 0.07, X_PORTA, A_PORTA, 0, M.perfil);
    caixa("hall-porta", 0.03, 1.4, 0.03, X_PORTA + 0.14, 0.55, 0.11, M.perfil);
    for (const y of [0.75, 1.75]) caixa(null, 0.02, 0.02, 0.06, X_PORTA + 0.145, y, 0.06, M.perfil);

    // Banco com gavetas, painel com ganchos e prateleira com luz
    const X_BANCO = X_PORTA + L_PORTA;
    const L_BANCO = 1.85;
    const P_BANCO = 0.42;
    const Z_BANCO = ESPESSURA;
    gabinete("hall-banco", L_BANCO, 0.35, P_BANCO, X_BANCO, 0.1, Z_BANCO, M.freijo);
    for (const x of [X_BANCO, X_BANCO + L_BANCO / 2]) gaveta("hall-banco", L_BANCO / 2, 0.35, x, 0.1, Z_BANCO + P_BANCO, 0.34, M.freijo);
    caixa("hall-banco", L_BANCO, ALTURA, ESPESSURA, X_BANCO, 0, 0, nogueira);
    caixa(null, L_BANCO, 0.1, P_BANCO - 0.05, X_BANCO, 0, Z_BANCO, M.sombra);
    sombraContato(X_BANCO, 0.1, L_BANCO, P_BANCO + 0.15);
    caixa(null, L_BANCO, 0.07, P_BANCO, X_BANCO, 0.45, Z_BANCO, assento);
    caixa(null, 0.42, 0.3, 0.12, X_BANCO + 0.15, 0.52, Z_BANCO + 0.08, almofada).rotation.x = -0.18;
    caixa("hall-banco", L_BANCO, 0.04, 0.26, X_BANCO, 2.05, Z_BANCO, M.freijo);
    caixa(null, L_BANCO - 0.1, 0.008, 0.012, X_BANCO + 0.05, 2.04, 0.22, fita);
    for (const x of [0.4, 0.75, 1.1, 1.45]) {
      const gancho = cilindro(null, 0.012, 0.012, 0.09, X_BANCO + x, 0, 0.07, M.perfil, 10);
      gancho.rotation.x = Math.PI / 2;
      gancho.position.y = 1.72;
    }
    caixa(null, 0.28, 0.72, 0.1, X_BANCO + 0.61, 1, 0.05, casaco);
    caixa(null, 0.3, 0.34, 0.1, X_BANCO + 1.3, 1.34, 0.06, M.terra);
    cilindro(null, 0.06, 0.09, 0.2, X_BANCO + 0.4, 2.09, 0.14, M.ceramicaBranca, 20);
    for (let i = 0; i < 3; i += 1) caixa(null, 0.3, 0.03, 0.18, X_BANCO + 1.2, 2.09 + i * 0.03, 0.05, i % 2 ? M.arte : M.quadro);

    // Linho das cortinas da janela
    const linho =padrao({ color: 0xcfc2ab, roughness: 0.96 });
    const pregas =(id, inicio, fim, fixo, ladoZ, material) => {
      let i = 0;
      for (let t = inicio; t < fim; t += 0.075) {
        const raio = i % 2 ? 0.05 : 0.034;
        i += 1;
        if (ladoZ) cilindro(id, raio, raio, 2.63, fixo, 0.01, t, material, 12);
        else cilindro(id, raio, raio, 2.63, t, 0.01, fixo, material, 12);
      }
    };
    if (kit.casa) planta(5.85, 5.65);
    else planta(8.55, 0.6);

    // Decoração: galhos no vaso, escultura, cesto e vaso de piso sob o aparador, puff junto ao banco
    const galho = (x, y, z, alt, rz, rx) => {
      const g = cilindro(null, 0.004, 0.007, alt, x, y, z, M.terra, 6);
      g.rotation.set(rx, 0, rz);
    };
    galho(X_APARADOR + 0.3, Y_TAMPO + 0.26, 0.24, 0.62, 0.22, 0.08);
    galho(X_APARADOR + 0.3, Y_TAMPO + 0.26, 0.24, 0.72, -0.14, -0.05);
    galho(X_APARADOR + 0.3, Y_TAMPO + 0.26, 0.24, 0.55, -0.34, 0.12);
    esfera(0.055, X_APARADOR + 1.3, Y_TAMPO + 0.115, 0.26, M.ceramicaBranca);
    cilindro(null, 0.11, 0.08, 0.42, X_APARADOR + 1.45, 0, 0.26, M.terra, 22);
    cilindro(null, 0.17, 0.14, 0.3, X_APARADOR + 0.25, 0, 0.26, padrao({ color: 0x9a7a55, roughness: 0.95 }), 22);
    sombraContato(X_BANCO + 0.8, 0.85, 0.56, 0.56);
    cilindro(null, 0.26, 0.26, 0.38, X_BANCO + 1.08, 0.02, 1.13, casaco, 28);

    // Quadro grande na parede da janela
    kit.comoLateral(() => {
      caixa(null, 0.03, 1.15, 1.6, -0.72, 0.95, 5.5, M.perfil);
      caixa(null, 0.006, 1.05, 1.5, -0.69, 1, 5.55, M.quadro);
      caixa(null, 0.006, 0.6, 0.55, -0.684, 1.2, 5.75, M.arte);
      caixa(null, 0.006, 0.42, 0.42, -0.678, 1.3, 6.2, M.arte2);
    });

    // Tapete com borda na direção da porta e pendente de vidro quente
    caixa(null, 2.3, 0.012, 3.5, X_PORTA - 0.45, 0, 0.85, tapete).castShadow = false;
    caixa(null, 2.1, 0.014, 3.3, X_PORTA - 0.35, 0, 0.95, padrao({ color: 0x74675a, roughness: 1 })).castShadow = false;
    const X_PENDENTE = X_PORTA + L_PORTA / 2;
    const Z_PENDENTE = 2.2;
    cilindro(null, 0.004, 0.004, 0.75, X_PENDENTE, 2.1, Z_PENDENTE, M.perfil, 8);
    cilindro(null, 0.05, 0.05, 0.05, X_PENDENTE, 2.82, Z_PENDENTE, M.perfil, 18);
    esfera(0.17, X_PENDENTE, 1.95, Z_PENDENTE, padrao({ color: 0xf2e6cf, roughness: 0.4, emissive: 0xffc98a, emissiveIntensity: 0.9 }));

    // Mesa redonda de entrada, sob o pendente, com vaso, galhos e livros
    sombraContato(X_PENDENTE - 0.55, Z_PENDENTE - 0.55, 1.1, 1.1);
    cilindro(null, 0.28, 0.32, 0.03, X_PENDENTE, 0, Z_PENDENTE, M.perfil, 32);
    cilindro(null, 0.05, 0.07, 0.72, X_PENDENTE, 0.03, Z_PENDENTE, M.perfil, 16);
    cilindro(null, 0.55, 0.55, 0.035, X_PENDENTE, 0.75, Z_PENDENTE, M.freijo, 40);
    const Y_MESA_HALL = 0.785;
    cilindro(null, 0.07, 0.11, 0.3, X_PENDENTE - 0.1, Y_MESA_HALL, Z_PENDENTE, M.ceramicaBranca, 22);
    galho(X_PENDENTE - 0.1, Y_MESA_HALL + 0.26, Z_PENDENTE, 0.5, 0.25, 0.1);
    galho(X_PENDENTE - 0.1, Y_MESA_HALL + 0.26, Z_PENDENTE, 0.58, -0.18, -0.08);
    for (let i = 0; i < 3; i += 1) caixa(null, 0.28, 0.03, 0.2, X_PENDENTE + 0.08, Y_MESA_HALL + i * 0.03, Z_PENDENTE - 0.1, i % 2 ? M.arte : M.quadro);

    // Janela com voil e cortina de linho dos dois lados
    kit.comoLateral(() => {
      pregas(null, 1.75, 2.3, -0.6, true, linho);
      pregas(null, 4.2, 4.75, -0.6, true, linho);
      caixa(null, 0.008, 2.63, 1.9, -0.63, 0.01, 2.3, padrao({ color: 0xf2ece0, transparent: true, opacity: 0.45, roughness: 0.9, depthWrite: false }));
      caixa(null, 0.03, 0.03, 3.2, -0.62, 2.62, 1.65, M.perfil);
    });

    return kit.finalizar({
      luzes: [[X_ESPELHO, 1.4, 0.75, 0xffd9a6, 0.6], [X_PENDENTE, 1.8, Z_PENDENTE, 0xffd9a6, 0.7]],
      // Na casa, a câmera fica dentro do hall, de frente para a porta de entrada.
      vista: kit.casa ? { camera: [3.5, 1.75, 7.4], alvo: [3, 1.1, 0] } : { camera: [3.7, 1.7, 12], alvo: [3.7, 1.25, 0.5] },
      vistaEstreita: kit.casa ? { camera: [3.5, 1.75, 8.6], alvo: [3.3, 1.1, 0] } : { camera: [3.1, 1.7, 11.7], alvo: [3, 1.25, 0.5] },
      distanciaMaxima: 12.5,
    });
  }

  // Lavanderia em L, na paleta da casa: Freijó, bancada branca, azulejo e piso cinza-cimento.
  function construirLavanderia(T, dados) {
    const kit = criarKit(T, dados.modulos.filter((m) => m.comodo === "lavanderia"));
    const { M, padrao, caixa, cilindro, esfera, gabinete, gaveta, portaGiro, portaBasculante, sombraContato, planta, ala, ESPESSURA } = kit;

    kit.casca({
      piso: { nome: "piso-ceramica", mapa: texturaCeramica(T, 20, 12), rugosidade: 0.34 },
      corFundo: "#cfc8bb",
      corLado: "#ded9cf",
      inicioRodape: 4.8,
      spots: [[1, 1.2], [2.6, 1.2], [4.2, 1.2], [1, 3.4], [2.6, 3.4], [4.2, 3.4]],
      rebaixo: { x0: 0.3, x1: 6, z0: 0.9, z1: 5.3 },
    });

    const fita = new T.MeshBasicMaterial({ color: 0xffd9a6 });
    const cesto = padrao({ color: 0x9a7a55, roughness: 0.95 });
    const toalha = padrao({ color: 0xece6da, roughness: 0.96 });
    const toalha2 = padrao({ color: 0xb1693c, roughness: 0.96 });
    const toalha3 = padrao({ color: 0x7f8a78, roughness: 0.96 });
    const frasco = padrao({ color: 0xdfd8ca, roughness: 0.5 });
    const tapete = padrao({ color: 0x5c5044, roughness: 1 });
    const ALTURA = 2.6;
    const CAVA = 0.95;
    const FUNDO = 0.58;

    // Armário alto com portas de baixo e de cima na mesma cava
    const armarioAlto = (id, x, l, p, prateleiras) => {
      gabinete(id, l, ALTURA - 0.1, p, x, 0.1, 0, M.interno, prateleiras);
      for (const [xp, dobradica] of [[x, "esquerda"], [x + l / 2, "direita"]]) {
        portaGiro(id, l / 2, CAVA - 0.1, xp, 0.1, p, M.freijo, dobradica);
        portaGiro(id, l / 2, ALTURA - CAVA, xp, CAVA, p, M.freijo, dobradica, { cavaEmbaixo: true });
      }
    };
    const pilha = (x, y, z, l, p, cores) => {
      cores.forEach((cor, i) => caixa(null, l, 0.05, p, x, y + i * 0.05, z, cor));
    };

    // Parede do fundo: canto, gaveteiro, tanque, nicho de cestos, torre, rouparia e cabideiro
    const X_CANTO = -0.7;
    const X_GAVETAS = 0.2;
    const X_CUBA = 1.2;
    const X_NICHO = 2.2;
    const X_TORRE = 3;
    const L_TORRE = 0.8;
    const P_TORRE = 0.65;
    const X_ROUPARIA = X_TORRE + L_TORRE;
    const X_LIVRE = X_ROUPARIA + 1;

    caixa(null, X_TORRE - X_CANTO, 0.1, FUNDO - 0.04, X_CANTO, 0, 0, M.sombra);
    caixa(null, X_LIVRE - X_TORRE, 0.1, P_TORRE - 0.05, X_TORRE, 0, 0, M.sombra);
    sombraContato(X_CANTO, 0.1, X_LIVRE - X_CANTO, 0.85);
    caixa("lav-bancada", X_TORRE - X_CANTO, 0.03, 0.62, X_CANTO, 0.87, 0, M.pedra);
    caixa("lav-revestimento", X_TORRE - X_CANTO, 0.6, 0.008, X_CANTO, 0.9, 0, padrao({ map: texturaAzulejo(T, X_TORRE - X_CANTO, 0.6), roughness: 0.25 }));
    caixa(null, X_GAVETAS - X_CANTO, 0.77, ESPESSURA, X_CANTO, 0.1, FUNDO, M.freijo);

    gabinete("lav-gavetas", 1, 0.77, FUNDO, X_GAVETAS, 0.1, 0, M.interno);
    for (let i = 0; i < 3; i += 1) gaveta("lav-gavetas", 1, 0.77 / 3, X_GAVETAS, 0.1 + (i * 0.77) / 3, FUNDO, 0.48, M.freijo);

    gabinete("lav-base-cuba", 1, 0.77, FUNDO, X_CUBA, 0.1, 0, M.interno, [0.36]);
    portaGiro("lav-base-cuba", 0.5, 0.77, X_CUBA, 0.1, FUNDO, M.freijo, "esquerda");
    portaGiro("lav-base-cuba", 0.5, 0.77, X_CUBA + 0.5, 0.1, FUNDO, M.freijo, "direita");
    gabinete("lav-base-cuba", 0.8, 0.77, FUNDO, X_NICHO, 0.1, 0, M.freijo);
    caixa(null, 0.68, 0.32, 0.42, X_NICHO + 0.06, 0.13, 0.12, cesto);
    caixa(null, 0.68, 0.3, 0.42, X_NICHO + 0.06, 0.5, 0.12, cesto);

    // Tanque de inox e torneira
    caixa("lav-cuba", 0.76, 0.006, 0.44, X_CUBA + 0.12, 0.9, 0.1, M.inox);
    caixa("lav-cuba", 0.68, 0.004, 0.36, X_CUBA + 0.16, 0.906, 0.14, M.perfil);
    cilindro("lav-cuba", 0.012, 0.016, 0.34, X_CUBA + 0.5, 0.9, 0.06, M.inox, 24);
    caixa("lav-cuba", 0.024, 0.024, 0.2, X_CUBA + 0.488, 1.23, 0.06, M.inox);

    // Sobre a bancada: frascos, sabão em pote, toalhas dobradas e ervas
    for (const [dx, a] of [[0.34, 0.24], [0.47, 0.2], [0.6, 0.16]]) cilindro(null, 0.04, 0.045, a, X_GAVETAS + dx, 0.9, 0.2, frasco, 16);
    cilindro(null, 0.07, 0.07, 0.13, X_NICHO + 0.15, 0.9, 0.22, M.ceramicaBranca, 22);
    pilha(X_NICHO + 0.34, 0.9, 0.12, 0.36, 0.28, [toalha, toalha3, toalha, toalha2]);

    // Armários aéreos e prateleiras iluminadas
    for (const x of [X_CANTO + 0.35, X_CANTO + 1.35]) {
      gabinete("lav-aereos", 1, 0.8, 0.33, x, 1.5, 0, M.interno, [0.39]);
      portaBasculante("lav-aereos", 1, 0.8, x, 1.5, 0.33, M.freijo);
    }
    caixa(null, 2, 0.008, 0.012, X_CANTO + 0.35, 1.492, 0.26, fita);
    const X_PRAT = X_CANTO + 2.35;
    const L_PRAT = X_TORRE - X_PRAT;
    for (const y of [1.55, 1.95, 2.3]) {
      caixa("lav-prateleiras", L_PRAT, 0.03, 0.28, X_PRAT, y, 0, M.freijo);
      caixa(null, L_PRAT - 0.06, 0.006, 0.01, X_PRAT + 0.03, y - 0.008, 0.22, fita);
    }
    caixa(null, 0.36, 0.2, 0.22, X_PRAT + 0.08, 1.58, 0.03, cesto);
    for (const dx of [0.6, 0.73, 0.86]) cilindro(null, 0.04, 0.045, 0.24, X_PRAT + dx, 1.58, 0.14, frasco, 16);
    caixa(null, 0.36, 0.2, 0.22, X_PRAT + 0.64, 1.98, 0.03, cesto);
    pilha(X_PRAT + 0.08, 1.98, 0.03, 0.38, 0.22, [toalha, toalha2, toalha]);
    cilindro(null, 0.07, 0.05, 0.14, X_PRAT + 0.3, 2.33, 0.14, M.ceramicaBranca, 20);
    cilindro(null, 0.05, 0.05, 0.2, X_PRAT + 0.7, 2.33, 0.14, M.terra, 20);

    // Torre da lavadora e da secadora, com armário em cima
    caixa("lav-torre", 0.03, ALTURA - 0.1, P_TORRE, X_TORRE, 0.1, 0, M.freijo);
    caixa("lav-torre", 0.03, ALTURA - 0.1, P_TORRE, X_TORRE + L_TORRE - 0.03, 0.1, 0, M.freijo);
    gabinete("lav-torre", L_TORRE - 0.06, 0.65, P_TORRE, X_TORRE + 0.03, 1.95, 0, M.interno);
    portaBasculante("lav-torre", L_TORRE - 0.06, 0.65, X_TORRE + 0.03, 1.95, P_TORRE, M.freijo);
    const vidroAparelho = padrao({ color: 0x1a2026, roughness: 0.08, metalness: 0.3 });
    const redondo = (raio, x, y, z, material) => {
      const peca = cilindro(null, raio, raio, 0.012, x, 0, z, material, 40);
      peca.rotation.x = Math.PI / 2;
      peca.position.y = y;
    };
    for (const [id, y] of [["lav-lavadora", 0.12], ["lav-secadora", 1]]) {
      const x = X_TORRE + 0.04;
      caixa(id, 0.72, 0.84, 0.6, x, y, 0, M.ceramicaBranca);
      caixa(id, 0.68, 0.08, 0.006, x + 0.02, y + 0.73, 0.6, M.perfil);
      redondo(0.24, x + 0.36, y + 0.36, 0.608, M.inox);
      redondo(0.2, x + 0.36, y + 0.36, 0.616, vidroAparelho);
    }

    // Rouparia, com toalhas e roupa de cama nas prateleiras
    armarioAlto("lav-rouparia", X_ROUPARIA, 1, P_TORRE, [0.75, 1.3, 1.85]);
    for (const y of [0.87, 1.42, 1.97]) pilha(X_ROUPARIA + 0.1, y, 0.1, 0.36, 0.4, [toalha, toalha3, toalha]);
    for (const y of [0.87, 1.42, 1.97]) pilha(X_ROUPARIA + 0.54, y, 0.1, 0.36, 0.4, [toalha2, toalha, toalha3]);

    // Cabideiro com roupas passadas, prateleira em cima e cesto embaixo
    const X_CAB = X_LIVRE + 0.1;
    const L_CAB = 1.3;
    caixa("lav-cabideiro", L_CAB, ALTURA - 0.05, ESPESSURA, X_CAB, 0, 0, M.freijo);
    caixa("lav-cabideiro", L_CAB, 0.03, 0.42, X_CAB, 2.12, 0, M.freijo);
    caixa(null, L_CAB - 0.06, 0.006, 0.01, X_CAB + 0.03, 2.112, 0.34, fita);
    cilindro("lav-cabideiro", 0.01, 0.01, 0.02, X_CAB, 1.93, 0.25, M.perfil, 8);
    caixa("lav-cabideiro", L_CAB, 0.022, 0.022, X_CAB, 1.93, 0.24, M.perfil);
    [toalha, toalha3, toalha2, toalha, toalha3, toalha2].forEach((cor, i) => {
      const x = X_CAB + 0.14 + i * 0.19;
      caixa(null, 0.035, 0.85, 0.42, x, 1.05, 0.04, cor);
      caixa(null, 0.012, 0.09, 0.012, x + 0.012, 1.86, 0.245, M.perfil);
    });
    caixa(null, 0.42, 0.2, 0.3, X_CAB + 0.1, 2.15, 0.03, cesto);
    pilha(X_CAB + 0.74, 2.15, 0.05, 0.42, 0.28, [toalha, toalha2, toalha3]);
    sombraContato(X_CAB + 0.2, 0.25, 0.6, 0.6);
    cilindro(null, 0.24, 0.2, 0.55, X_CAB + 0.5, 0, 0.45, cesto, 26);
    cilindro(null, 0.22, 0.22, 0.04, X_CAB + 0.5, 0.55, 0.45, toalha, 26);
    planta(X_CAB + L_CAB + 0.45, 0.55);

    // Braço do L, na parede da janela. Aqui x corre ao longo da parede e z sai dela para o ambiente.
    const X_PAREDE = -0.7;
    const Z_PONTA = 4.95;
    const FIM_BRACO = Z_PONTA - 0.62;
    ala(X_PAREDE, Z_PONTA, () => {
      // Armário de limpeza, fechando a ponta do L
      armarioAlto("lav-limpeza", 0, 0.7, 0.6, [2.05]);
      cilindro(null, 0.012, 0.012, 1.5, 0.14, 0.2, 0.3, M.terra, 10);
      caixa(null, 0.26, 0.06, 0.08, 0.01, 0.13, 0.26, cesto);
      caixa(null, 0.03, 1.3, 0.34, 0.5, 0.15, 0.12, M.cinza);
      caixa(null, 0.7, 0.1, 0.55, 0, 0, 0, M.sombra);

      // Gaveteiro para roupa de cama, armário e tampa de canto
      const X_L1 = 0.7;
      const X_L2 = X_L1 + 1.2;
      const X_L3 = X_L2 + 1.5;
      gabinete("lav-braco-gavetas", 1.2, 0.77, FUNDO, X_L1, 0.1, 0, M.interno);
      for (let i = 0; i < 2; i += 1) gaveta("lav-braco-gavetas", 1.2, 0.77 / 2, X_L1, 0.1 + (i * 0.77) / 2, FUNDO, 0.48, M.freijo);
      gabinete("lav-braco-armario", 1.5, 0.77, FUNDO, X_L2, 0.1, 0, M.interno, [0.36]);
      portaGiro("lav-braco-armario", 0.5, 0.77, X_L2, 0.1, FUNDO, M.freijo, "esquerda");
      portaGiro("lav-braco-armario", 0.5, 0.77, X_L2 + 0.5, 0.1, FUNDO, M.freijo, "esquerda");
      portaGiro("lav-braco-armario", 0.5, 0.77, X_L2 + 1, 0.1, FUNDO, M.freijo, "direita");
      caixa(null, FIM_BRACO - X_L3, 0.77, ESPESSURA, X_L3, 0.1, FUNDO, M.freijo);
      caixa(null, FIM_BRACO - X_L1, 0.1, FUNDO - 0.04, X_L1, 0, 0, M.sombra);
      sombraContato(0, 0.1, Z_PONTA - 0.6, 0.85);

      // Bancada para dobrar roupa, debaixo da janela
      const L_BRACO = Z_PONTA - 0.62 - X_L1;
      caixa("lav-braco-bancada", L_BRACO, 0.03, 0.62, X_L1, 0.87, 0, M.pedra);

      // Sobre a bancada: cesto, toalhas, difusor e vaso de ervas junto à janela
      caixa(null, 0.42, 0.24, 0.32, X_L1 + 0.18, 0.9, 0.1, cesto);
      pilha(X_L1 + 0.82, 0.9, 0.1, 0.34, 0.3, [toalha3, toalha, toalha2, toalha]);
      cilindro(null, 0.03, 0.04, 0.12, X_L2 + 0.3, 0.9, 0.2, frasco, 14);
      for (const d of [-0.012, 0.012]) cilindro(null, 0.002, 0.002, 0.2, X_L2 + 0.3 + d, 1.02, 0.2, M.terra, 6);
      cilindro(null, 0.075, 0.055, 0.14, X_L2 + 0.8, 0.9, 0.18, M.terra, 20);
      for (const [dx, dz] of [[0, 0], [0.05, 0.03], [-0.05, 0.02], [0.02, -0.05]]) esfera(0.05, X_L2 + 0.8 + dx, 1.09, 0.18 + dz, M.verde);

      // Tábua de passar rebatível, saindo da bancada, com ferro em cima
      const X_TABUA = X_L2 + 1.05;
      caixa("lav-tabua", 0.36, 0.025, 1.25, X_TABUA, 0.9, 0.5, toalha3);
      cilindro("lav-tabua", 0.18, 0.18, 0.025, X_TABUA + 0.18, 0.9, 1.75, toalha3, 32);
      cilindro(null, 0.014, 0.022, 0.9, X_TABUA + 0.18, 0, 1.55, M.perfil, 10);
      caixa(null, 0.12, 0.05, 0.24, X_TABUA + 0.12, 0.925, 1.2, M.inox);
      caixa(null, 0.04, 0.05, 0.14, X_TABUA + 0.16, 0.975, 1.23, M.perfil);

      // Aéreos na parede, entre o canto e a janela, e azulejo atrás da bancada
      const X_AEREO = Z_PONTA - 2.25;
      gabinete("lav-braco-aereos", 0.96, 0.8, 0.33, X_AEREO, 1.5, 0, M.interno, [0.39]);
      portaBasculante("lav-braco-aereos", 0.96, 0.8, X_AEREO, 1.5, 0.33, M.freijo);
      gabinete("lav-braco-aereos", 0.96, 0.8, 0.33, X_AEREO + 0.96, 1.5, 0, M.interno, [0.39]);
      portaBasculante("lav-braco-aereos", 0.96, 0.8, X_AEREO + 0.96, 1.5, 0.33, M.freijo);
      caixa(null, 1.92, 0.008, 0.012, X_AEREO, 1.492, 0.26, fita);
      caixa(null, Z_PONTA - 0.62 - X_AEREO, 0.6, 0.008, X_AEREO, 0.9, 0, padrao({ map: texturaAzulejo(T, Z_PONTA - 0.62 - X_AEREO, 0.6), roughness: 0.25 }));
    });

    // Varal de teto, com roupas estendidas
    const X_VARAL = 1.3;
    const L_VARAL = 2.2;
    for (let i = 0; i < 6; i += 1) caixa("lav-varal", L_VARAL, 0.014, 0.014, X_VARAL, 2.42, 1.35 + i * 0.13, M.inox);
    for (const x of [X_VARAL, X_VARAL + L_VARAL - 0.03]) {
      caixa("lav-varal", 0.03, 0.03, 0.72, x, 2.41, 1.33, M.perfil);
      cilindro("lav-varal", 0.005, 0.005, 0.41, x + 0.015, 2.44, 1.69, M.perfil, 8);
    }
    caixa(null, 0.55, 0.65, 0.01, X_VARAL + 0.25, 1.77, 1.48, toalha);
    caixa(null, 0.42, 0.5, 0.01, X_VARAL + 1, 1.92, 1.74, toalha2);
    caixa(null, 0.3, 0.42, 0.01, X_VARAL + 1.6, 2, 1.61, toalha);

    // Tapete de algodão no meio do L
    caixa(null, 2.6, 0.012, 1.3, 1, 0, 1.5, tapete).castShadow = false;

    return kit.finalizar({
      luzes: [[1.7, 1.4, 0.75, 0xffd9a6, 0.6], [0.3, 1.45, 2.4, 0xffd9a6, 0.5]],
      vista: { camera: [6, 1.85, 11.2], alvo: [2.6, 1.15, 1.2] },
      vistaEstreita: { camera: [6.4, 1.85, 10.6], alvo: [2.2, 1.15, 1.4] },
      distanciaMaxima: 11.5,
    });
  }

  // Banheiro da suíte, na paleta da casa: nogueira, travertino e metais em bronze.
  function construirBanheiro(T, dados) {
    const kit = criarKit(T, dados.modulos.filter((m) => m.comodo === "banheiro"));
    const { M, padrao, caixa, cilindro, esfera, gabinete, gaveta, portaGiro, sombraContato, planta, ESPESSURA } = kit;
    const LARG_PAREDE = kit.casa ? 6 : 14;

    kit.casca({
      piso: { nome: "piso-ceramica", mapa: texturaCeramica(T, 20, 12), rugosidade: 0.3 },
      corFundo: "#b9a88f",
      corLado: "#cfc4b3",
      mapaFundo: texturaTravertino(T, LARG_PAREDE, 2.85),
      inicioRodape: 5.3,
      spots: [[0.8, 1.1], [2.6, 1.1], [4.1, 0.75], [0.8, 3], [2.6, 3], [4.1, 3]],
      rebaixo: { x0: 0.3, x1: 4.7, z0: 0.7, z1: 3.7 },
    });

    const nogueira = padrao({ map: texturaMadeira(T, "#4a3124", "#1f130b", 13), roughness: 0.42 });
    const thar = padrao({ map: texturaMadeira(T, "#6d4c36", "#2f1c10", 17), roughness: 0.45 });
    const travertino = padrao({ map: texturaTravertino(T, 2.84, 0.56), roughness: 0.38, name: "travertino" });
    const paredeBox = padrao({ map: texturaTravertino(T, 1.7, 2.6), roughness: 0.4 });
    const bronze = padrao({ color: 0x6a4c30, metalness: 0.85, roughness: 0.3 });
    const espelho = padrao({ color: 0xf2f7f8, roughness: 0.04, metalness: 0.7 });
    const fita = new T.MeshBasicMaterial({ color: 0xffc27a });
    const toalha = padrao({ color: 0xece6da, roughness: 0.96 });
    const toalha2 = padrao({ color: 0xb1693c, roughness: 0.96 });
    const tapete = padrao({ color: 0x8b7f6e, roughness: 1 });
    const pedraBox = padrao({ color: 0x6f6456, roughness: 0.7 });
    const agua = padrao({ color: 0xcfe3e4, roughness: 0.1, metalness: 0.1 });
    const frasco = padrao({ color: 0xdfd8ca, roughness: 0.5 });

    // Painel de madeira na parede da bancada
    const X_BANC = -0.6;
    const L_BANC = 2.8;
    const Y_BANC = 0.38;
    const A_BANC = 0.47;
    const P_BANC = 0.52;
    caixa("ban-painel", L_BANC, 2.6, ESPESSURA, X_BANC, 0, 0, nogueira);
    for (let x = X_BANC + 0.02; x < X_BANC + L_BANC - 0.04; x += 0.09) caixa("ban-painel", 0.045, 0.3, ESPESSURA, x, 2.3, ESPESSURA, nogueira);

    // Bancada suspensa com dois gavetões e tampo de travertino
    const Z_MOVEL = ESPESSURA;
    gabinete("ban-bancada", L_BANC, A_BANC, P_BANC, X_BANC, Y_BANC, Z_MOVEL, M.interno);
    for (const x of [X_BANC, X_BANC + L_BANC / 2]) gaveta("ban-bancada", L_BANC / 2, A_BANC, x, Y_BANC, Z_MOVEL + P_BANC, 0.42, thar);
    caixa(null, L_BANC - 0.1, 0.008, 0.012, X_BANC + 0.05, Y_BANC - 0.008, P_BANC - 0.04, fita);
    sombraContato(X_BANC, 0.15, L_BANC, P_BANC + 0.1);
    const Y_TAMPO = Y_BANC + A_BANC;
    caixa("ban-tampo", L_BANC + 0.04, 0.04, P_BANC + 0.06, X_BANC - 0.02, Y_TAMPO, 0, travertino);

    // Duas cubas de apoio com torneiras em bronze
    for (const cx of [X_BANC + 0.7, X_BANC + 2.1]) {
      cilindro("ban-cubas", 0.21, 0.17, 0.12, cx, Y_TAMPO + 0.04, 0.32, M.ceramicaBranca, 40);
      cilindro(null, 0.18, 0.18, 0.004, cx, Y_TAMPO + 0.158, 0.32, padrao({ color: 0xd7d2c9, roughness: 0.4 }), 32);
      cilindro("ban-cubas", 0.012, 0.015, 0.3, cx, Y_TAMPO + 0.04, 0.07, bronze, 16);
      caixa("ban-cubas", 0.022, 0.022, 0.16, cx - 0.011, Y_TAMPO + 0.33, 0.07, bronze);
    }
    for (const dx of [1.3, 1.42]) cilindro(null, 0.03, 0.035, 0.14, X_BANC + dx, Y_TAMPO + 0.04, 0.2, frasco, 14);

    // Armários com espelho sobre a bancada e luz atrás
    const Y_ESP = 1.28;
    const A_ESP = 0.98;
    for (const x of [X_BANC, X_BANC + L_BANC / 2]) {
      gabinete("ban-espelheira", L_BANC / 2, A_ESP, 0.16, x, Y_ESP, Z_MOVEL, M.interno, [0.48]);
      portaGiro("ban-espelheira", L_BANC / 4, A_ESP, x, Y_ESP, Z_MOVEL + 0.16, espelho, "esquerda");
      portaGiro("ban-espelheira", L_BANC / 4, A_ESP, x + L_BANC / 4, Y_ESP, Z_MOVEL + 0.16, espelho, "direita");
    }
    caixa(null, L_BANC - 0.06, 0.012, 0.012, X_BANC + 0.03, Y_ESP - 0.014, 0.17, fita);
    caixa(null, L_BANC - 0.06, 0.012, 0.012, X_BANC + 0.03, Y_ESP + A_ESP + 0.004, 0.17, fita);

    // Armário alto de toalhas: portas de baixo e de cima na mesma cava
    const X_ARM = X_BANC + L_BANC + 0.05;
    const L_ARM = 0.65;
    const P_ARM = 0.45;
    const CAVA = 0.95;
    gabinete("ban-armario", L_ARM, 2.5, P_ARM, X_ARM, 0.1, 0, M.interno, [0.85, 1.4, 1.95]);
    portaGiro("ban-armario", L_ARM, CAVA - 0.1, X_ARM, 0.1, P_ARM, nogueira, "esquerda");
    portaGiro("ban-armario", L_ARM, 2.6 - CAVA, X_ARM, CAVA, P_ARM, nogueira, "esquerda", { cavaEmbaixo: true });
    for (const y of [1, 1.55, 2.1]) for (let i = 0; i < 3; i += 1) caixa(null, 0.46, 0.06, 0.32, X_ARM + 0.09, y + i * 0.06, 0.06, i % 2 ? toalha2 : toalha);
    caixa(null, L_ARM, 0.1, P_ARM - 0.05, X_ARM, 0, 0, M.sombra);
    sombraContato(X_ARM, 0.1, L_ARM, P_ARM + 0.15);

    // Box: parede de travertino, piso próprio, vidro inteiro, chuveiro e nicho iluminado
    const X_BOX = X_ARM + L_ARM + 0.05;
    const FIM_BOX = 5.25;
    const P_BOX = 1.7;
    caixa(null, 0.08, 2.65, P_BOX, X_BOX, 0, 0, paredeBox);
    caixa(null, FIM_BOX - X_BOX, 0.012, P_BOX, X_BOX, 0, 0, pedraBox).castShadow = false;
    const X_VIDRO = X_BOX + 0.08;
    const L_VIDRO = FIM_BOX - X_VIDRO - 0.75;
    caixa("ban-box", L_VIDRO, 2.25, 0.012, X_VIDRO, 0.012, P_BOX, M.vidro);
    caixa("ban-box", L_VIDRO, 0.02, 0.03, X_VIDRO, 2.262, P_BOX - 0.01, bronze);
    caixa("ban-box", 0.02, 2.25, 0.03, X_VIDRO + L_VIDRO - 0.02, 0.012, P_BOX - 0.01, bronze);
    const X_CHUVA = X_VIDRO + 1;
    cilindro("ban-chuveiro", 0.16, 0.16, 0.012, X_CHUVA, 2.24, 0.75, bronze, 36);
    cilindro("ban-chuveiro", 0.01, 0.01, 0.41, X_CHUVA, 2.24, 0.75, bronze, 10);
    caixa("ban-chuveiro", 0.03, 0.12, 0.05, X_CHUVA - 0.015, 1.05, 0.004, bronze);
    caixa(null, 0.7, 0.34, 0.006, X_VIDRO + 0.15, 1.2, 0.002, M.sombra);
    caixa(null, 0.68, 0.006, 0.01, X_VIDRO + 0.16, 1.53, 0.02, fita);
    for (const dx of [0.28, 0.42, 0.56]) cilindro(null, 0.035, 0.04, 0.22, X_VIDRO + dx, 1.2, 0.09, frasco, 14);

    // Banheira de pé, sob a janela
    const X_TINA = -0.1;
    const Z_TINA = 3.3;
    sombraContato(X_TINA - 0.5, Z_TINA - 0.95, 1, 1.9);
    const tina = cilindro("ban-banheira", 1, 1, 0.56, X_TINA, 0, Z_TINA, M.ceramicaBranca, 44);
    tina.scale.set(0.42, 1, 0.85);
    const espelhoAgua = cilindro(null, 1, 1, 0.005, X_TINA, 0.56, Z_TINA, agua, 44);
    espelhoAgua.scale.set(0.37, 1, 0.79);
    cilindro("ban-banheira", 0.012, 0.016, 0.95, X_TINA + 0.52, 0, Z_TINA, bronze, 12);
    caixa("ban-banheira", 0.24, 0.022, 0.022, X_TINA + 0.3, 0.94, Z_TINA - 0.011, bronze);
    caixa(null, 0.4, 0.05, 0.03, X_TINA - 0.2, 0.56, Z_TINA - 0.84, toalha);

    // Banco com gaveta, ao lado da banheira
    const X_ASS = 0.8;
    const L_ASS = 1;
    const P_ASS = 0.4;
    const Z_ASS = 3.9;
    gabinete("ban-banco", L_ASS, 0.4, P_ASS, X_ASS, 0.06, Z_ASS, nogueira);
    gaveta("ban-banco", L_ASS, 0.4, X_ASS, 0.06, Z_ASS, 0.32, thar, -1, null, nogueira);
    caixa("ban-banco", L_ASS, 0.4, ESPESSURA, X_ASS, 0.06, Z_ASS + P_ASS, nogueira);
    sombraContato(X_ASS, Z_ASS - 0.05, L_ASS, P_ASS + 0.1);
    caixa(null, L_ASS, 0.05, P_ASS, X_ASS, 0.46, Z_ASS, toalha);
    for (let i = 0; i < 3; i += 1) caixa(null, 0.42, 0.05, 0.28, X_ASS + 0.45, 0.51 + i * 0.05, Z_ASS + 0.06, i % 2 ? toalha2 : toalha);

    // Vaso suspenso, com painel de madeira e toalheiro
    const Z_VASO = 2.2;
    caixa("ban-vaso", ESPESSURA + 0.1, 1.15, 0.7, 5.15, 0, Z_VASO - 0.16, nogueira);
    const vaso = cilindro("ban-vaso", 1, 1, 0.3, 4.87, 0.38, Z_VASO + 0.19, M.ceramicaBranca, 32);
    vaso.scale.set(0.3, 1, 0.2);
    sombraContato(4.6, Z_VASO, 0.6, 0.4);
    caixa(null, 0.02, 0.02, 0.6, 5.2, 1.15, 3, bronze);
    caixa(null, 0.02, 0.55, 0.42, 5.18, 0.62, 3.09, toalha2);

    // Tapete e planta
    caixa(null, 1.3, 0.014, 0.8, 0.6, 0, 1.1, tapete).castShadow = false;
    planta(-0.35, 1.45);

    // Velas e sal de banho na borda da bancada
    esfera(0.045, X_BANC + 1.36, Y_TAMPO + 0.085, 0.42, M.ceramicaBranca);

    return kit.finalizar({
      luzes: [[0.8, 1.6, 0.8, 0xffd9a6, 0.7], [3.9, 2, 1, 0xffd9a6, 0.6]],
      vista: { camera: [2.4, 1.7, 9.4], alvo: [2.3, 1.15, 0.8] },
      vistaEstreita: { camera: [2.3, 1.7, 11], alvo: [2.3, 1.15, 0.8] },
      distanciaMaxima: 11.5,
    });
  }

  window.construirAmbiente = function (T, dados, comodo) {
    if (comodo === "banheiro") return construirBanheiro(T, dados);
    if (comodo === "lavanderia") return construirLavanderia(T, dados);
    if (comodo === "hall") return construirHall(T, dados);
    if (comodo === "escritorio") return construirEscritorio(T, dados);
    if (comodo === "gourmet") return construirGourmet(T, dados);
    if (comodo === "quarto") return construirQuarto(T, dados);
    return comodo === "sala" ? construirSala(T, dados) : construirCozinhaAmbiente(T, dados);
  };

  // Planta da casa, em três fileiras, com a rua ao sul, do lado de quem olha.
  // Frente: escritório, hall e sala. Meio: suíte, cozinha e área gourmet. Fundo: lavanderia.
  // x e z marcam o canto do cômodo; o hall é girado, para a porta de entrada dar para a fachada,
  // e por isso nele x é o lado leste e z o lado sul. a e b são posições na parede.
  const PROF_CASA = 6.2;
  const FILA_MEIO = PROF_CASA;
  const FILA_FRENTE = 2 * PROF_CASA;
  const FACHADA = 3 * PROF_CASA;
  const PLANTA = {
    lavanderia: { x: 9, z: 0, largura: 7.1, janela: true, portas: { frente: [{ a: 6.25, b: 7.05, para: "cozinha" }] } },
    quarto: { x: -0.8, z: FILA_MEIO, largura: 8.6, janela: true, portas: { fundo: [{ a: 7.05, b: 7.85, para: "banheiro" }], frente: [{ a: 7.5, b: 8.3, para: "escritorio" }] } },
    // Banheiro da suíte: atrás do closet, com jardim de luz entre ele e a janela da lavanderia
    banheiro: { x: 2, z: FILA_MEIO - 4.4, largura: 5.3, prof: 4.4, janela: true, portas: { frente: [{ a: 4.25, b: 5.05, para: "quarto" }] } },
    cozinha: { x: 8.5, z: FILA_MEIO, largura: 8.1, portas: { fundo: [{ a: 6.75, b: 7.55, para: "lavanderia" }], direita: [{ a: 5.2, b: 6.1, para: "gourmet" }], frente: [{ a: 0.3, b: 3.3, para: "hall", aberta: true }] } },
    gourmet: { x: 17.3, z: FILA_MEIO, largura: 13.5, portas: { esquerda: [{ a: 5.2, b: 6.1, para: "cozinha" }] } },
    escritorio: { x: 0, z: FILA_FRENTE, largura: 7.8, portas: { fundo: [{ a: 6.7, b: 7.5, para: "quarto" }], direita: [{ a: 4.3, b: 5.2, para: "hall" }] } },
    // Hall e sala são um só espaço: não há parede entre eles.
    hall: { x: 15.6, z: FACHADA, largura: 6.4, girado: true, semParede: { esquerda: "sala" }, portas: { direita: [{ a: 1, b: 1.9, para: "escritorio" }], frente: [{ a: 2.4, b: 5.4, para: "cozinha", aberta: true }] } },
    sala: { x: 15.6, z: FILA_FRENTE, largura: 8, semParede: { esquerda: "hall" } },
  };
  const CENTRO_CASA = 12.05; // o hall fica no meio da imagem
  const VISTA_CASA = { camera: [CENTRO_CASA, 38, 47], alvo: [CENTRO_CASA, 0, 10] };
  // No celular, a câmera se afasta e centra a casa com a piscina, para tudo caber na tela em pé.
  const VISTA_CASA_ESTREITA = { camera: [15, 60, 66], alvo: [15, 0, 9.5] };

  // No celular, a tela fica em pé: cada vista mira o móvel principal, com ele no meio da imagem.
  // Girando, dá para ver o resto do ambiente.
  const VISTAS_CELULAR = {
    cozinha: { camera: [3.6, 2.3, 10.6], alvo: [3, 1.35, 1.4] },
    sala: { camera: [2.7, 2.55, 11.4], alvo: [2.5, 1.2, 1] },
    quarto: { camera: [1.9, 2.3, 10.2], alvo: [2.4, 1.3, 1.2] },
    banheiro: { camera: [1.5, 2.2, 10.2], alvo: [1.4, 1.3, 1.2] },
    gourmet: { camera: [2.6, 2.3, 10.6], alvo: [2.4, 1.35, 1.4] },
    escritorio: { camera: [3.6, 2.4, 10.2], alvo: [2.4, 1.25, 1.6] },
    hall: { camera: [3.6, 1.9, 9.4], alvo: [3.6, 1.3, 0.6] },
    lavanderia: { camera: [4.8, 2.2, 10.4], alvo: [2, 1.35, 1.2] },
  };

  // Fachada e jardim: só aparecem na maquete. A parede é vista por fora, e a porta dá para quem olha.
  function montarExterior(T, cena, mapaRevestimento, mapaPorta) {
    const fora = [];
    const mat = (color, roughness = 0.8, metalness = 0) => new T.MeshStandardMaterial({ color: new T.Color(color).convertSRGBToLinear(), roughness, metalness });
    const reboco = mat(0xe9e3d7, 0.92);
    const madeira = new T.MeshStandardMaterial({ map: mapaRevestimento, roughness: 0.45 });
    const folhaPorta = new T.MeshStandardMaterial({ map: mapaPorta, roughness: 0.42 });
    const metal = mat(0x17171a, 0.35, 0.7);
    const vidro = mat(0x2c3a42, 0.08, 0.5);
    const pedra = mat(0x8f897c, 0.9);
    const verde = mat(0x3d5c38, 0.95);
    const luz = new T.MeshBasicMaterial({ color: 0xffd9a6 });
    const CUBO = new T.BoxGeometry(1, 1, 1);
    const PLANO = new T.PlaneGeometry(1, 1);
    const fachadaHall = new T.Group();
    fachadaHall.userData.comodoCasa = "hall";
    cena.add(fachadaHall);
    fora.push(fachadaHall);
    const caixa = (l, a, p, x, y, z, material, pai = null) => {
      const m = new T.Mesh(CUBO, material);
      m.scale.set(l, a, p);
      m.position.set(x + l / 2, y + a / 2, z + p / 2);
      m.castShadow = true;
      m.receiveShadow = true;
      (pai || cena).add(m);
      if (!pai) fora.push(m);
      return m;
    };

    // Contorno externo, percorrido com a parte de fora à direita de quem anda
    const ALT = 2.88;
    const contorno = [[0, FACHADA], [24.3, FACHADA], [24.3, FILA_FRENTE], [25.05, FILA_FRENTE], null, [25.05, FILA_MEIO], [16.8, FILA_MEIO], [16.8, 0], [9, 0], [9, FILA_MEIO], [8, FILA_MEIO], [8, FILA_MEIO - 4.4], [2, FILA_MEIO - 4.4], [2, FILA_MEIO], [-0.8, FILA_MEIO], [-0.8, FILA_FRENTE], [0, FILA_FRENTE], [0, FACHADA]];
    for (let i = 0; i < contorno.length - 1; i += 1) {
      const p = contorno[i];
      const q = contorno[i + 1];
      if (!p || !q) continue;
      const dx = q[0] - p[0];
      const dz = q[1] - p[1];
      const l = Math.hypot(dx, dz);
      const m = new T.Mesh(PLANO, reboco);
      m.scale.set(l, ALT, 1);
      m.position.set((p[0] + q[0]) / 2 - (dz / l) * 0.04, ALT / 2, (p[1] + q[1]) / 2 + (dx / l) * 0.04);
      m.rotation.y = Math.atan2(-dz, dx);
      // Sem sombra no reboco: os móveis logo atrás deixariam marcas nele
      m.receiveShadow = false;
      cena.add(m);
      fora.push(m);
    }

    // Entrada: revestimento em madeira, porta, puxador, marquise e luz
    const Z_RUA = FACHADA + 0.06;
    const X_PORTA = 10.4;
    const L_PORTA = 1.4;
    caixa(4, ALT, 0.04, X_PORTA - 1.3, 0, Z_RUA, madeira, fachadaHall);
    const posRipas = [];
    // As ripas param abaixo da marquise, para as duas não disputarem a mesma altura
    const ALT_RIPAS = 2.78;
    for (let x = X_PORTA - 1.26; x < X_PORTA + 2.64; x += 0.14) posRipas.push(new T.Matrix4().makeTranslation(x + 0.035, ALT_RIPAS / 2, Z_RUA + 0.055));
    const ripas = new T.InstancedMesh(new T.BoxGeometry(0.07, ALT_RIPAS, 0.03), madeira, posRipas.length);
    posRipas.forEach((m, i) => ripas.setMatrixAt(i, m));
    ripas.frustumCulled = false;
    fachadaHall.add(ripas);
    caixa(L_PORTA + 0.1, 2.55, 0.03, X_PORTA - 0.05, 0, Z_RUA + 0.07, metal, fachadaHall);
    caixa(L_PORTA, 2.5, 0.03, X_PORTA, 0, Z_RUA + 0.09, folhaPorta, fachadaHall);
    caixa(0.035, 1.4, 0.04, X_PORTA + 0.16, 0.55, Z_RUA + 0.13, metal, fachadaHall);
    // Marquise estreita, para a porta aparecer vista de cima
    caixa(4.2, 0.08, 0.5, X_PORTA - 1.4, 2.8, Z_RUA, metal, fachadaHall);
    caixa(3.6, 0.02, 0.02, X_PORTA - 1.1, 2.78, Z_RUA + 0.46, luz, fachadaHall);

    // Janelas de vidro do escritório e da sala
    for (const [x, l] of [[1.8, 4.4], [17.8, 4.4]]) {
      caixa(l + 0.12, 1.62, 0.04, x - 0.06, 0.74, Z_RUA, metal);
      caixa(l, 1.5, 0.05, x, 0.8, Z_RUA + 0.01, vidro);
      caixa(0.05, 1.5, 0.07, x + l / 2 - 0.025, 0.8, Z_RUA + 0.01, metal);
    }

    // Caminho de pedras, degrau e canteiros dos dois lados
    caixa(4.4, 0.12, 1.8, X_PORTA - 1.5, -0.01, Z_RUA, pedra);
    for (let i = 0; i < 9; i += 1) caixa(1.8, 0.05, 0.9, X_PORTA - 0.2, -0.015, Z_RUA + 2.1 + i * 1.15, pedra);
    for (const x of [X_PORTA - 9.4, X_PORTA + 3.4]) {
      caixa(7.4, 0.5, 0.9, x, 0, Z_RUA + 0.25, verde);
      caixa(7.4, 0.12, 0.02, x, 0.5, Z_RUA + 0.25, pedra);
    }

    // Árvores no jardim
    const copa = new T.SphereGeometry(1, 14, 10);
    const tronco = mat(0x5b3f2a, 0.9);
    for (const [x, z, r] of [[-4, 21, 1.5], [30, 20.5, 1.6], [2, 26, 1.2], [24, 26, 1.3], [-5.5, 3, 1.7], [22, 2.5, 1.5]]) {
      caixa(0.22, 1.6, 0.22, x - 0.11, 0, z - 0.11, tronco);
      const m = new T.Mesh(copa, verde);
      m.scale.set(r, r * 0.95, r);
      m.position.set(x, 1.6 + r * 0.7, z);
      m.castShadow = true;
      cena.add(m);
      fora.push(m);
    }
    return fora;
  }

  // Texto em uma textura pequena, para as placas das portas e os nomes na maquete.
  function telaDeTexto(T, texto, largura, altura, tamanho, fundo, cor) {
    const t = new T.CanvasTexture(telaDe(largura, altura, (g) => {
      g.fillStyle = fundo;
      g.fillRect(0, 0, largura, altura);
      g.fillStyle = cor;
      g.font = `600 ${tamanho}px Archivo, Arial, sans-serif`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(texto, largura / 2, altura / 2);
    }));
    t.encoding = T.sRGBEncoding;
    return t;
  }

  // Junta todos os cômodos em uma cena só, cada um no seu lugar da planta.
  window.construirCasa = function (T, dados, { leve = false } = {}) {
    const cena = new T.Scene();
    cena.background = texturaCeu(T);
    const comodos = {};
    const pecas = {};
    const moveis = [];
    const portas = [];
    const tetos = [];
    const soMaquete = [];
    let aplicarAbertura = null;

    for (const c of dados.comodos) {
      const p = PLANTA[c.id];
      const prof = p.prof || PROF_CASA;
      comodoDaCasa = { ...p, id: c.id, prof, vaos: portas };
      let modelo;
      try {
        modelo = window.construirAmbiente(T, dados, c.id);
      } finally {
        comodoDaCasa = null;
      }
      const grupo = new T.Group();
      grupo.position.set(p.girado ? p.x - 0.7 : p.x + 0.7, 0, p.z);
      if (p.girado) grupo.rotation.y = Math.PI;
      grupo.userData.comodoCasa = c.id;
      for (const o of [...modelo.cena.children]) grupo.add(o);
      cena.add(grupo);
      grupo.updateMatrixWorld(true);

      const larguraTotal = p.largura + 0.7;
      const x0 = p.girado ? p.x - larguraTotal : p.x;
      const z0 = p.girado ? p.z - prof : p.z;
      const limites = { x0, x1: x0 + larguraTotal, z0, z1: z0 + prof };

      // Peças pequenas só aparecem no cômodo aberto: na maquete e nos vizinhos, pesariam à toa.
      const detalhes = [];
      const extensoes = [];
      grupo.traverse((o) => {
        if (o.userData.teto) tetos.push(o);
        if (o.userData.soMaquete) soMaquete.push(o);
        if (o.userData.soAberto) extensoes.push(o);
        if (!o.isMesh || o.userData.teto || o.userData.soMaquete || o.userData.soAberto || o.userData.irPara || o.name === "sombra-contato") return;
        if (o.isInstancedMesh) { detalhes.push(o); return; }
        const t = new T.Box3().setFromObject(o).getSize(new T.Vector3());
        if (Math.max(t.x, t.y, t.z) < (leve ? 1.3 : 0.8)) detalhes.push(o);
      });

      const rotulo = new T.Sprite(new T.SpriteMaterial({ map: telaDeTexto(T, c.nome, 512, 112, 54, "#141414", "#ffffff"), depthTest: false, toneMapped: false }));
      rotulo.scale.set(4.4, 0.96, 1);
      rotulo.position.set((limites.x0 + Math.min(limites.x1, c.id === "gourmet" ? limites.x0 + 8 : limites.x1)) / 2, 4, (limites.z0 + limites.z1) / 2);
      rotulo.userData.comodoCasa = c.id;
      rotulo.renderOrder = 10;
      cena.add(rotulo);

      Object.assign(pecas, modelo.pecas);
      moveis.push(...modelo.moveis);
      aplicarAbertura = modelo.aplicarAbertura;
      comodos[c.id] = { id: c.id, grupo, limites, detalhes, extensoes, rotulo, janela: !!p.janela, modelo, vizinhos: [] };
    }
    for (const q of Object.values(comodos)) {
      q.vizinhos = portas.filter((p) => p.de === q.id).map((p) => p.para);
      q.abertos = portas.filter((p) => p.de === q.id && p.aberta).map((p) => p.para);
    }
    // Tudo o que se enxerga sem passar por porta: da sala se vê o hall e, pelo vão, a cozinha.
    for (const q of Object.values(comodos)) {
      const espaco = new Set(q.abertos);
      for (const id of [...espaco]) for (const outro of comodos[id].abertos) espaco.add(outro);
      espaco.delete(q.id);
      q.espaco = [...espaco];
    }

    // Em volta da casa: gramado
    const gramado = new T.Mesh(new T.PlaneGeometry(240, 200), new T.MeshStandardMaterial({ color: new T.Color(0x45603c).convertSRGBToLinear(), roughness: 1 }));
    gramado.rotation.x = -Math.PI / 2;
    gramado.position.set(CENTRO_CASA, -0.02, 10);
    gramado.receiveShadow = true;
    cena.add(gramado);
    const exterior = montarExterior(T, cena, texturaMadeira(T, "#9a6a43", "#4e2e17", 11), texturaMadeira(T, "#4a3124", "#1f130b", 13));
    soMaquete.push(...exterior);

    // Uma luz geral, um sol e duas luzes pontuais, que vão para o cômodo aberto.
    const ceuLuz = new T.HemisphereLight(0xfff4e6, 0x3a3027, 0.58);
    cena.add(ceuLuz);
    const sol = new T.DirectionalLight(0xfff0dd, 0.85);
    sol.castShadow = true;
    sol.shadow.mapSize.set(leve ? 1024 : 2048, leve ? 1024 : 2048);
    sol.shadow.bias = -0.0004;
    sol.shadow.radius = 3;
    cena.add(sol);
    cena.add(sol.target);
    const pontos = [new T.PointLight(0xffd9a6, 0, 3.2, 2), new T.PointLight(0xffd9a6, 0, 3.2, 2)];
    for (const l of pontos) cena.add(l);

    function ajustarSol(cx, cz, raio) {
      sol.target.position.set(cx, 0, cz);
      sol.position.set(cx + 4.5, 6 + raio * 0.6, cz + 6);
      Object.assign(sol.shadow.camera, { left: -raio, right: raio, top: raio, bottom: -raio, near: 1, far: 18 + raio * 3 });
      sol.shadow.camera.updateProjectionMatrix();
      sol.target.updateMatrixWorld();
      sol.updateMatrixWorld();
    }

    const definir = (lista, visivel) => { for (const o of lista) o.visible = visivel; };

    function mostrarMaquete(escalaRotulo = 1) {
      for (const q of Object.values(comodos)) {
        q.grupo.visible = true;
        q.rotulo.visible = true;
        q.rotulo.scale.set(4.4 * escalaRotulo, 0.96 * escalaRotulo, 1);
        definir(q.detalhes, false);
        definir(q.extensoes, false);
      }
      definir(tetos, false);
      definir(soMaquete, true);
      ceuLuz.intensity = 0.72;
      sol.intensity = 0.8;
      for (const l of pontos) l.intensity = 0;
      ajustarSol(CENTRO_CASA, 10, 26);
    }

    // No caminho do zoom: o cômodo de destino já mostra os detalhes, ainda dentro da maquete.
    function prepararDestino(id) {
      definir(comodos[id].detalhes, true);
    }

    // Mostra o cômodo e os espaços abertos para ele; atrás de porta fechada, nada precisa aparecer.
    // O que estiver entre a câmera e o cômodo some.
    function mostrarComodo(id, posicaoCamera) {
      const q = comodos[id];
      const dentro = (v) => {
        const l = v.limites;
        return posicaoCamera.x > l.x0 && posicaoCamera.x < l.x1 && posicaoCamera.z > l.z0 && posicaoCamera.z < l.z1;
      };
      for (const v of Object.values(comodos)) {
        const aberto = q.espaco.includes(v.id);
        v.grupo.visible = v === q || (aberto && !dentro(v));
        v.rotulo.visible = false;
        definir(v.detalhes, v === q || aberto);
        definir(v.extensoes, v === q);
      }
      definir(tetos, true);
      definir(soMaquete, false);
    }

    function acenderComodo(id) {
      const q = comodos[id];
      const { ambiente, forcaSol, luzes } = q.modelo;
      ceuLuz.intensity = ambiente;
      sol.intensity = forcaSol;
      pontos.forEach((l, i) => {
        const dado = luzes[i];
        l.intensity = dado ? dado[4] : 0;
        if (!dado) return;
        l.color.setHex(dado[3]);
        l.position.copy(q.grupo.localToWorld(new T.Vector3(dado[0], dado[1], dado[2])));
      });
      ajustarSol((q.limites.x0 + q.limites.x1) / 2, (q.limites.z0 + q.limites.z1) / 2, id === "gourmet" ? 13 : 10);
    }

    const vistaDe = (id, estreita) => {
      if (id === "casa") return estreita ? VISTA_CASA_ESTREITA : VISTA_CASA;
      const q = comodos[id];
      const v = estreita ? VISTAS_CELULAR[id] : q.modelo.vista;
      const mundo =(p) => q.grupo.localToWorld(new T.Vector3(p[0], p[1], p[2])).toArray();
      return { camera: mundo(v.camera), alvo: mundo(v.alvo) };
    };

    return { cena, comodos, pecas, moveis, portas, aplicarAbertura, mostrarMaquete, mostrarComodo, acenderComodo, prepararDestino, vistaDe };
  };

  function h(tag, props = {}, ...filhos) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === "class") el.className = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    }
    el.append(...filhos);
    return el;
  }

  // Reflexos: uma sala simples, com painéis de luz, vira o reflexo do inox, da pedra e do vidro.
  function criarReflexos(T, renderer) {
    const sala = new T.Scene();
    sala.add(new T.Mesh(new T.BoxGeometry(20, 10, 20), new T.MeshBasicMaterial({ color: 0x4a443c, side: T.BackSide })));
    const painel = (l, p, x, y, z, forca) => {
      const m = new T.Mesh(new T.PlaneGeometry(l, p), new T.MeshBasicMaterial({ color: new T.Color(forca, forca * 0.96, forca * 0.9), side: T.DoubleSide }));
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      sala.add(m);
    };
    painel(10, 6, 0, 4.8, 0, 3.2);
    painel(6, 5, -9, 1, 2, 2.2);
    painel(6, 4, 8, 1, 6, 1.4);
    const pmrem = new T.PMREMGenerator(renderer);
    const mapa = pmrem.fromScene(sala, 0.04).texture;
    pmrem.dispose();
    return mapa;
  }

  function ligar3D(T, area, dados, comodoInicial, aoClicar, aoIrPara) {
    let renderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: true });
    } catch (erro) {
      return null;
    }

    // Resolução fixa: trocar no meio do movimento recria a imagem na placa de vídeo e trava.
    // Só reduz, uma vez ou outra, se o aparelho realmente não acompanhar.
    const celular = matchMedia("(max-width: 62rem)").matches;
    let resolucao = Math.min(Math.max(window.devicePixelRatio || 1, celular ? 1 : 1.25), celular ? 1.5 : 2);
    renderer.setPixelRatio(resolucao);
    let precisaDesenhar = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    const reflexos = criarReflexos(T, renderer);
    const anisotropia = renderer.capabilities.getMaxAnisotropy();
    area.prepend(renderer.domElement);
    const tela = renderer.domElement;
    tela.setAttribute("aria-label", "Modelo 3D. A lista de módulos ao lado traz as mesmas informações.");

    const camera = new T.PerspectiveCamera(38, 1, 0.1, 60);
    const controles = new T.OrbitControls(camera, tela);
    Object.assign(controles, {
      // Botão direito do mouse, ou dois dedos na tela, movem a câmera sem tirar a altura dela.
      enableDamping: true, dampingFactor: 0.08, enablePan: true, screenSpacePanning: false, minDistance: 1.8, maxDistance: 9.5,
      maxPolarAngle: Math.PI / 2 - 0.04, minPolarAngle: 0.5, minAzimuthAngle: -1.15, maxAzimuthAngle: 1.2,
    });

    const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ray = new T.Raycaster();
    const ponto = new T.Vector2();
    let selecionado = null;
    let sobre = null;
    let idAtual = "casa";

    // Se o aparelho perder o 3D por falta de memória, avisa em vez de deixar a tela parada.
    let avisoPerda = null;
    tela.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      if (avisoPerda) return;
      avisoPerda = h("p", { class: "coz-sem-3d", "data-3d-perdido": "" }, "O 3D foi interrompido neste aparelho. Recarregue a página para ver de novo; os detalhes continuam na lista.");
      area.append(avisoPerda);
    });
    tela.addEventListener("webglcontextrestored", () => {
      if (avisoPerda) avisoPerda.remove();
      avisoPerda = null;
      renderer.shadowMap.needsUpdate = true;
      precisaDesenhar = true;
    });

    // Celular ou aparelho com pouca memória: texturas, sombras e maquete mais leves.
    const memoria = navigator.deviceMemory;
    const leve = celular || (memoria !== undefined && memoria <= 4);
    escalaTexturas = leve ? 0.5 : 1;

    // A casa inteira é montada de uma vez e fica com as portas como estavam.
    const casa = window.construirCasa(T, dados, { leve });
    casa.cena.environment = reflexos;
    casa.cena.traverse((o) => {
      if (o.material && o.material.map) o.material.map.anisotropy = anisotropia;
    });
    const estados = casa.moveis.map((m) => ({ m, p: 0, de: 0, para: 0, inicio: 0, dur: 0 }));
    const atual = { cena: casa.cena, pecas: casa.pecas, aplicarAbertura: casa.aplicarAbertura };
    const modulosDe = (id) => dados.modulos.filter((m) => m.comodo === id).map((m) => m.id);
    const estadosDoComodo = () => { const ids = modulosDe(idAtual); return estados.filter((e) => ids.includes(e.m.modulo)); };
    const noComodo = (o) => {
      let p = o;
      while (p && !p.userData.comodoCasa) p = p.parent;
      return p ? p.userData.comodoCasa : null;
    };

    // Zoom até o ambiente: a câmera desce em curva, a partir de onde estiver.
    let voo = null;
    let trocaPendente = null;
    const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

    // Zera o resto de movimento da câmera, para ele não continuar depois de trocar de ambiente.
    function zerarInercia() {
      controles.enableDamping = false;
      controles.update();
      controles.enableDamping = true;
    }

    function voar(id) {
      selecionado = null;
      sobre = null;
      atualizarBrilhos();
      zerarInercia();
      const vista = casa.vistaDe(id, celular);
      const de = camera.position.clone();
      const para = new T.Vector3(...vista.camera);
      const saindoDaMaquete = idAtual === "casa";
      const indoParaMaquete = id === "casa";
      // Entre espaços abertos um para o outro, a câmera só anda pelo ambiente.
      const noMesmoEspaco = !saindoDaMaquete && !indoParaMaquete && casa.comodos[idAtual].espaco.includes(id);
      const meio = de.clone().lerp(para, indoParaMaquete ? 0.35 : 0.6);
      if (noMesmoEspaco) meio.y = Math.max(de.y, para.y) + 1.5;
      else meio.y = saindoDaMaquete || indoParaMaquete ? Math.max(de.y, para.y) * 0.55 : 24;
      if (noMesmoEspaco) {
        idAtual = id;
        casa.acenderComodo(id);
        renderer.shadowMap.needsUpdate = true;
        voo = {
          id, de, meio, para,
          alvoDe: controles.target.clone(),
          alvoPara: new T.Vector3(...vista.alvo),
          inicio: null,
          dur: 1300,
          chegou: true,
        };
        controles.enabled = false;
        precisaDesenhar = true;
        return;
      }
      voo = {
        id,
        de,
        meio,
        para,
        alvoDe: controles.target.clone(),
        alvoPara: new T.Vector3(...vista.alvo),
        inicio: null, // o relógio só começa no primeiro quadro, para o caminho não dar um salto
        dur: saindoDaMaquete || indoParaMaquete ? 1700 : 2200,
        chegou: indoParaMaquete,
      };
      controles.enabled = false;
      camera.near = 0.3;
      camera.far = 220;
      camera.updateProjectionMatrix();
      if (idAtual !== "casa" || indoParaMaquete) {
        idAtual = "casa";
        casa.mostrarMaquete(celular ? 1.35 : 1);
        renderer.shadowMap.needsUpdate = true;
      }
      if (!indoParaMaquete) casa.prepararDestino(id);
      precisaDesenhar = true;
    }

    function avancarVoo(agora) {
      if (!voo) return false;
      if (voo.inicio === null) voo.inicio = agora;
      const t = Math.min((agora - voo.inicio) / voo.dur, 1);
      const e = suave(Math.max(t, 0));
      const u = 1 - e;
      camera.position.set(0, 0, 0)
        .addScaledVector(voo.de, u * u)
        .addScaledVector(voo.meio, 2 * u * e)
        .addScaledVector(voo.para, e * e);
      controles.target.copy(voo.alvoDe).lerp(voo.alvoPara, e);
      camera.lookAt(controles.target);
      // Perto do fim, o resto da casa sai da frente e o ambiente acende como ele é.
      if (!voo.chegou && e > 0.72) {
        voo.chegou = true;
        idAtual = voo.id;
        casa.acenderComodo(voo.id);
        renderer.shadowMap.needsUpdate = true;
      }
      if (idAtual !== "casa") casa.mostrarComodo(idAtual, camera.position);
      if (t >= 1) {
        const id = voo.id;
        voo = null;
        controles.enabled = true;
        mostrar(id);
      }
      return true;
    }

    function mostrar(id) {
      idAtual = id;
      selecionado = null;
      sobre = null;
      const maquete = id === "casa";
      const vista = casa.vistaDe(id, celular);
      const q = casa.comodos[id];
      Object.assign(controles, maquete
        ? { minDistance: 14, maxDistance: 90, minPolarAngle: 0.15, maxPolarAngle: 1.25, minAzimuthAngle: -1, maxAzimuthAngle: 1 }
        : {
          minDistance: 1.8,
          // A vista do celular fica mais longe: o limite não pode puxar a câmera para perto dela.
          maxDistance: Math.max(q.modelo.distanciaMaxima, new T.Vector3(...vista.camera).distanceTo(new T.Vector3(...vista.alvo)) * 1.2),
          minPolarAngle: 0.5,
          maxPolarAngle: Math.PI / 2 - 0.04,
        });
      if (!maquete) {
        const base = PLANTA[id].girado ? Math.PI : 0;
        controles.minAzimuthAngle = base - 1.15;
        controles.maxAzimuthAngle = base + 1.2;
      }
      camera.near = maquete ? 2 : 0.1;
      camera.far = maquete ? 220 : 70;
      camera.updateProjectionMatrix();
      zerarInercia();
      camera.position.set(...vista.camera);
      controles.target.set(...vista.alvo);
      controles.update();
      if (maquete) casa.mostrarMaquete(celular ? 1.35 : 1);
      else {
        casa.acenderComodo(id);
        casa.mostrarComodo(id, camera.position);
      }
      atualizarBrilhos();
      renderer.shadowMap.needsUpdate = true;
      precisaDesenhar = true;
    }

    function brilho(id, valor) {
      for (const p of atual.pecas[id] || []) {
        if (p.material.emissive) { p.material.emissive.setHex(0xffc98a); p.material.emissiveIntensity = valor; }
      }
    }
    // Passa por todos os módulos, para o brilho não ficar preso no ambiente que ficou para trás.
    function atualizarBrilhos() {
      for (const id of Object.keys(atual.pecas)) brilho(id, id === selecionado ? 0.14 : id === sobre ? 0.07 : 0);
      precisaDesenhar = true;
    }
    function acertoEm(x, y, alvos) {
      const r = tela.getBoundingClientRect();
      ponto.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ponto, camera);
      return ray.intersectObjects(alvos, true).find((i) => {
        const u = i.object.userData;
        return i.object.visible && (u.modulo || u.irPara || u.comodoCasa || !i.object.material.transparent);
      });
    }
    function moduloEm(x, y) {
      if (idAtual === "casa") return null;
      const hit = acertoEm(x, y, [casa.comodos[idAtual].grupo]);
      return hit ? hit.object.userData.modulo || null : null;
    }
    // Para onde um clique leva: outro cômodo pela porta ou, na maquete, o cômodo clicado.
    function destinoEm(x, y) {
      if (idAtual === "casa") {
        const alvos = casa.cena.children.filter((o) => o.userData.comodoCasa);
        const hit = acertoEm(x, y, alvos);
        return hit && noComodo(hit.object) ? { id: noComodo(hit.object), porta: false } : null;
      }
      // Clique em um espaço aberto ao lado leva a ele; clique em porta passa por ela.
      const q = casa.comodos[idAtual];
      const hit = acertoEm(x, y, [q.grupo, ...q.espaco.map((id) => casa.comodos[id].grupo).filter((g) => g.visible)]);
      if (!hit) return null;
      const irPara = hit.object.userData.irPara;
      if (irPara) return { id: irPara, porta: !q.espaco.includes(irPara) };
      const dono = noComodo(hit.object);
      return dono && dono !== idAtual ? { id: dono, porta: false } : null;
    }

    // A câmera anda para os lados, mas o ponto que ela olha não sai da casa ou do ambiente.
    function limitarCamera() {
      const l = idAtual === "casa" ? { x0: -6, x1: 34, z0: -2, z1: 24 } : casa.comodos[idAtual].limites;
      const folga = idAtual === "casa" ? 0 : 1.5;
      const alvo = controles.target;
      const dx = Math.min(Math.max(alvo.x, l.x0 - folga), l.x1 + folga) - alvo.x;
      const dz = Math.min(Math.max(alvo.z, l.z0 - folga), l.z1 + folga) - alvo.z;
      if (!dx && !dz) return false;
      alvo.x += dx;
      alvo.z += dz;
      camera.position.x += dx;
      camera.position.z += dz;
      return true;
    }

    // Touchpad: dois dedos deslizando para os lados movem a câmera. Para cima e para baixo, o zoom continua.
    tela.addEventListener("wheel", (e) => {
      if (voo || e.ctrlKey || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const pixels = e.deltaX * (e.deltaMode === 1 ? 16 : 1);
      const distancia = camera.position.distanceTo(controles.target);
      const porPixel = (2 * distancia * Math.tan(T.MathUtils.degToRad(camera.fov / 2))) / (tela.clientHeight || 1);
      camera.updateMatrixWorld();
      const passo = new T.Vector3().setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize().multiplyScalar(pixels * porPixel);
      camera.position.add(passo);
      controles.target.add(passo);
      precisaDesenhar = true;
    }, { capture: true, passive: false });

    let pontoSobre = null;
    let inicio = null;
    // Só um toque ou o botão esquerdo escolhem: botão direito e dois dedos são para mover a câmera.
    const dedos = new Set();
    tela.addEventListener("pointerdown", (e) => {
      dedos.add(e.pointerId);
      inicio = dedos.size === 1 && e.button === 0 ? { x: e.clientX, y: e.clientY } : null;
    });
    addEventListener("pointercancel", (e) => dedos.delete(e.pointerId));
    addEventListener("pointerup", (e) => dedos.delete(e.pointerId));
    tela.addEventListener("pointerup", (e) => {
      if (voo || e.button !== 0 || !inicio || Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) > 6) return;
      const destino = destinoEm(e.clientX, e.clientY);
      if (destino) { aoIrPara(destino.id, destino.porta); return; }
      const id = moduloEm(e.clientX, e.clientY);
      if (id) aoClicar(id, id === selecionado);
    });
    tela.addEventListener("pointermove", (e) => {
      if (e.buttons || e.pointerType === "touch") return;
      pontoSobre = { x: e.clientX, y: e.clientY };
    });
    tela.addEventListener("pointerleave", () => { pontoSobre = null; sobre = null; atualizarBrilhos(); });

    function ajustar() {
      // Mede o próprio 3D: no celular, a área também guarda o botão logo abaixo dele.
      const l = tela.clientWidth;
      const a = tela.clientHeight;
      if (!l || !a) return;
      renderer.setSize(l, a, false);
      camera.aspect = l / a;
      camera.updateProjectionMatrix();
      precisaDesenhar = true;
    }
    controles.addEventListener("change", () => {
      precisaDesenhar = true;
      if (idAtual !== "casa") casa.mostrarComodo(idAtual, camera.position);
    });
    new ResizeObserver(ajustar).observe(tela);
    ajustar();

    const estadosDe = (id) => estados.filter((e) => e.m.modulo === id);
    const estaAberto = (id) => estadosDe(id).some((e) => e.para === 1);

    function mover(lista, abrir) {
      lista.forEach((e, i) => {
        if (reduzir) { e.p = abrir ? 1 : 0; e.para = e.p; e.dur = 0; atual.aplicarAbertura(e.m, e.p); precisaDesenhar = true; return; }
        e.de = e.p;
        e.para = abrir ? 1 : 0;
        e.inicio = performance.now() + i * 35;
        e.dur = window.DURACAO_MOVIMENTO(e.m.tipo, abrir);
      });
    }

    function animar(agora) {
      let movendo = false;
      for (const e of estados) {
        if (!e.dur) continue;
        movendo = true;
        if (agora < e.inicio) continue;
        const t = Math.min((agora - e.inicio) / e.dur, 1);
        e.p = e.para === 1 ? e.de + (1 - e.de) * window.curvaAbertura(t) : e.de * window.curvaFechamento(t);
        atual.aplicarAbertura(e.m, e.p);
        if (t >= 1) e.dur = 0;
      }
      return movendo;
    }

    let ultimoQuadro = 0;
    let somaTempos = 0;
    let quadros = 0;
    function medirDesempenho(agora) {
      const dt = agora - ultimoQuadro;
      ultimoQuadro = agora;
      if (dt > 200) return;
      somaTempos += dt;
      quadros += 1;
      if (quadros < 30) return;
      const lento = somaTempos / quadros > 26;
      somaTempos = 0;
      quadros = 0;
      if (lento && resolucao > 1) {
        resolucao = Math.max(resolucao - 0.25, 1);
        renderer.setPixelRatio(resolucao);
        ajustar();
      }
    }

    mostrar(comodoInicial);

    renderer.setAnimationLoop((agora) => {
      // As sombras ficam paradas: portas abertas não as recalculam, e por isso nada trava.
      if (animar(agora)) precisaDesenhar = true;
      if (avancarVoo(performance.now())) precisaDesenhar = true;
      else {
        controles.update();
        if (limitarCamera()) precisaDesenhar = true;
      }
      if (pontoSobre && !voo) {
        const destino = destinoEm(pontoSobre.x, pontoSobre.y);
        const id = moduloEm(pontoSobre.x, pontoSobre.y);
        pontoSobre = null;
        if (id !== sobre) { sobre = id; atualizarBrilhos(); }
        tela.style.cursor = id || destino ? "pointer" : "grab";
      }
      if (!precisaDesenhar) return;
      precisaDesenhar = false;
      medirDesempenho(agora);
      renderer.render(atual.cena, camera);
    });

    // Prepara as imagens e os materiais de todos os ambientes logo depois de abrir, com a casa
    // já na tela. Assim, o zoom não trava no primeiro uso.
    // Em aparelho leve, não: carregar tudo na memória de uma vez pode derrubar a página.
    if (!leve) setTimeout(() => {
      if (voo) return;
      for (const q of Object.values(casa.comodos)) casa.prepararDestino(q.id);
      renderer.compile(casa.cena, camera);
      casa.cena.traverse((o) => { if (o.material && o.material.map) renderer.initTexture(o.material.map); });
      if (voo) return;
      if (idAtual === "casa") casa.mostrarMaquete(celular ? 1.35 : 1);
      else casa.mostrarComodo(idAtual, camera.position);
      precisaDesenhar = true;
    }, 400);

    return {
      moduloEm,
      camera,
      renderer,
      casa,
      controles,
      avancarVoo,
      limitarCamera,
      get cena() { return atual.cena; },
      temMovel: (id) => estadosDe(id).length > 0,
      aberto: estaAberto,
      alternar(id) { mover(estadosDe(id), !estaAberto(id)); },
      tudoAberto: () => estadosDoComodo().some((e) => e.para === 1),
      alternarTudo() { const lista = estadosDoComodo(); mover(lista, !lista.some((e) => e.para === 1)); },
      selecionar(id) {
        selecionado = id;
        atualizarBrilhos();
      },
      // Pelo seletor ou pela maquete, a câmera voa até o ambiente. Pela porta, é como passar por ela:
      // escurece, troca o cômodo e clareia.
      trocarComodo(id, pelaPorta = false) {
        // Uma troca nova cancela a anterior, para a imagem não pular para o ambiente antigo.
        clearTimeout(trocaPendente);
        tela.classList.remove("coz-trocando");
        if (reduzir) { voo = null; controles.enabled = true; mostrar(id); return; }
        if (!pelaPorta) { voar(id); return; }
        voo = null;
        controles.enabled = true;
        tela.classList.add("coz-trocando");
        trocaPendente = setTimeout(() => {
          mostrar(id);
          requestAnimationFrame(() => tela.classList.remove("coz-trocando"));
        }, 220);
      },
    };
  }

  window.iniciarCozinha3D = function (raiz, opcoes = {}) {
    const dados = window.COZINHA_DADOS;
    const pedido = new URLSearchParams(opcoes.busca || "").get("comodo");
    let comodo = dados.comodos.some((c) => c.id === pedido) ? pedido : "casa";
    const telaPequena = opcoes.telaPequena !== undefined ? opcoes.telaPequena : matchMedia("(max-width: 62rem)").matches;

    const area = h("div", { class: "coz-area" });
    const detalhe = h("section", { class: "coz-detalhe", "data-detalhe": "", "aria-live": "polite" });
    const lista = h("div", { class: "coz-lista" });
    const pedir = h("a", { class: "botao botao-branco coz-pedir" }, "Pedir orçamento");
    let botoes = [];

    function linha(rotulo, valor) {
      return valor ? [h("dt", {}, rotulo), h("dd", {}, valor)] : [];
    }

    let visor = opcoes.visor || null;
    let atual = null;
    let botaoTudo = null;

    function atualizarBotaoTudo() {
      if (botaoTudo) botaoTudo.textContent = visor.tudoAberto() ? "Fechar tudo devagar" : "Abrir todos os armários";
    }

    function detalheInicial() {
      atual = null;
      if (comodo === "casa") {
        detalhe.replaceChildren(
          h("h2", {}, "A casa inteira"),
          h("p", {}, "Um exemplo para você olhar cada ambiente como se fosse o seu. Clique em um deles para entrar e, lá dentro, em uma porta para passar ao vizinho."));
        return;
      }
      detalhe.replaceChildren(
        h("h2", {}, "Escolha um módulo"),
        h("p", {}, "Clique em um móvel ou aparelho para ver material, espessura, cor e ferragens. Clique de novo no móvel para abrir."));
    }

    function escolher(id) {
      const m = dados.modulos.find((x) => x.id === id);
      atual = id;
      const controle = visor && visor.temMovel(id)
        ? [h("button", {
          type: "button",
          class: "botao botao-branco coz-abrir",
          "data-abrir": "",
          onclick: () => { visor.alternar(id); escolher(id); atualizarBotaoTudo(); },
        }, visor.aberto(id) ? "Fechar devagar" : "Abrir")]
        : [];
      detalhe.replaceChildren(
        h("p", { class: "coz-grupo" }, m.grupo),
        h("h2", {}, m.nome),
        h("p", {}, m.descricao),
        ...controle,
        h("dl", {},
          ...linha("Parte do móvel", m.parte),
          ...linha("Material", m.material),
          ...linha("Espessura", m.espessura),
          ...linha("Cor", m.cor),
          ...linha("Ferragens", m.ferragens),
          ...linha("Puxador", m.puxador),
          ...linha("Medidas de exemplo", m.medidas)));
      for (const b of botoes) b.setAttribute("aria-pressed", String(b.dataset.modulo === id));
      if (visor) visor.selecionar(id);
    }

    function desenharLista() {
      botoes = [];
      if (comodo === "casa") {
        lista.replaceChildren(h("section", {},
          h("h3", {}, "Ambientes"),
          h("div", { class: "coz-botoes" }, ...dados.comodos.map((c) => h("button", { type: "button", "data-entrar": c.id, onclick: () => irPara(c.id) }, c.nome)))));
        pedir.setAttribute("href", "orcamento.html");
        return;
      }
      const modulos = dados.modulos.filter((m) => m.comodo === comodo);
      const grupos = [...new Set(modulos.map((m) => m.grupo))];
      lista.replaceChildren(...grupos.map((grupo) => h("section", {},
        h("h3", {}, grupo),
        h("div", { class: "coz-botoes" }, ...modulos.filter((m) => m.grupo === grupo).map((m) => {
          const b = h("button", { type: "button", "data-modulo": m.id, "aria-pressed": "false", onclick: () => escolher(m.id) }, m.nome);
          botoes.push(b);
          return b;
        })))));
      pedir.setAttribute("href", `orcamento.html?ambiente=${comodo}`);
    }

    // Um caminho só para trocar de ambiente: seletor, lista, porta ou clique na maquete.
    function irPara(id, pelaPorta = false) {
      if (id === comodo) return;
      comodo = id;
      for (const b of seletor.children) b.setAttribute("aria-pressed", String(b.dataset.comodo === comodo));
      centralizarSeletor();
      desenharLista();
      detalheInicial();
      if (visor) visor.trocarComodo(comodo, pelaPorta);
      atualizarRodape();
      // O texto do botão só muda depois da troca, quando o outro cômodo já está na tela.
      setTimeout(atualizarBotaoTudo, 260);
    }

    const seletor = h("div", { class: "coz-seletor", role: "group", "aria-label": "Escolha o ambiente" }, ...[{ id: "casa", nome: "Casa inteira" }, ...dados.comodos].map((c) => h("button", {
      type: "button",
      "data-comodo": c.id,
      "aria-pressed": String(c.id === comodo),
      onclick: () => irPara(c.id),
    }, c.nome)));

    let dica = null;
    function atualizarRodape() {
      if (botaoTudo) botaoTudo.hidden = comodo === "casa";
      if (!dica) return;
      const mexer = telaPequena
        ? "Um dedo gira · Dois dedos movem para os lados e aproximam"
        : "Arraste para girar · Botão direito ou dois dedos no touchpad movem para os lados";
      const tocar = telaPequena ? "Toque" : "Clique";
      dica.textContent = comodo === "casa"
        ? `${mexer} · ${tocar} em um ambiente para entrar`
        : `${mexer} · ${tocar} em um móvel ou porta`;
    }

    // Com mais cômodos do que cabem na tela, a faixa rola até o cômodo escolhido ficar à vista.
    function centralizarSeletor() {
      const b = [...seletor.children].find((x) => x.dataset.comodo === comodo);
      seletor.scrollLeft = b.offsetLeft + b.offsetWidth / 2 - seletor.clientWidth / 2;
    }

    desenharLista();
    detalheInicial();

    raiz.replaceChildren(h("div", { class: "coz" },
      area,
      h("aside", { class: "coz-painel" },
        detalhe,
        h("p", { class: "coz-convite" }, dados.convite),
        pedir,
        lista,
        h("p", { class: "coz-aviso" }, dados.aviso))));

    area.append(seletor);
    centralizarSeletor();

    const avisoSem3D = () => h("p", { class: "coz-sem-3d", "data-sem-3d": "" }, "Seu navegador não conseguiu abrir o modelo em 3D, mas todos os detalhes estão na lista de módulos.");

    function ligarVisor() {
      try {
        visor = ligar3D(window.THREE, area, dados, comodo, (id, jaSelecionado) => {
          if (jaSelecionado && visor.temMovel(id)) { visor.alternar(id); atualizarBotaoTudo(); }
          escolher(id);
        }, (id, pelaPorta) => irPara(id, pelaPorta));
      } catch (erro) {
        // Se a montagem falhar no meio, sai o que sobrou dela, e a lista continua funcionando.
        console.error(erro);
        visor = null;
        const resto = area.querySelector("canvas");
        if (resto) resto.remove();
      }
      if (!visor) { area.append(avisoSem3D()); return; }
      montarRodape();
    }

    if (opcoes.visor) {
      montarRodape();
    } else if (opcoes.sem3D || !window.THREE) {
      area.append(avisoSem3D());
    } else if (opcoes.imediato) {
      ligarVisor();
    } else {
      // Primeiro a página aparece, com um aviso; a montagem da casa vem logo depois.
      const carregando = h("p", { class: "coz-sem-3d coz-carregando", "data-carregando": "", role: "status" }, "Montando a casa em 3D…");
      area.append(carregando);
      setTimeout(() => {
        ligarVisor();
        carregando.remove();
      }, 60);
    }

    // No celular, avisa uma vez por visita que a experiência é melhor no computador.
    function avisarComputador() {
      if (!telaPequena) return;
      const CHAVE = "casafator-aviso-computador";
      try { if (sessionStorage.getItem(CHAVE)) return; } catch (erro) { /* segue e mostra o aviso */ }
      const aviso = h("div", { class: "coz-aviso-pc", role: "status", "data-aviso-computador": "" },
        h("p", {}, "A experiência é melhor no computador."),
        h("button", {
          type: "button",
          onclick: () => {
            aviso.remove();
            try { sessionStorage.setItem(CHAVE, "1"); } catch (erro) { /* sem memória, o aviso só volta na próxima visita */ }
          },
        }, "Entendi"));
      area.append(aviso);
    }

    function montarRodape() {
      botaoTudo = h("button", {
        type: "button",
        class: "botao coz-tudo",
        "data-abrir-tudo": "",
        onclick: () => { visor.alternarTudo(); atualizarBotaoTudo(); if (atual) escolher(atual); },
      }, "");
      atualizarBotaoTudo();
      dica = h("p", { class: "coz-dica" }, "");
      // No celular, as instruções ficam no fim da lista, longe da imagem.
      if (telaPequena) {
        area.append(h("div", { class: "coz-rodape" }, botaoTudo));
        lista.after(dica);
      } else {
        area.append(h("div", { class: "coz-rodape" }, botaoTudo, dica));
      }
      atualizarRodape();
      avisarComputador();
    }

    return { escolher, get visor() { return visor; } };
  };
})();
