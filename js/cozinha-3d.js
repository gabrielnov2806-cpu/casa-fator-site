// Modelo 3D: construirCozinha monta o ambiente; iniciarCozinha3D liga o modelo à lista de detalhes.
(function () {
  function sorteador(semente) {
    let s = semente;
    return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  }

  function telaDe(l, a, desenhar) {
    const c = document.createElement("canvas");
    c.width = l; c.height = a;
    desenhar(c.getContext("2d"));
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

  function texturaMadeira(T, base, veio, semente) {
    return textura(T, telaDe(1024, 2048, (g) => {
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
    }));
  }

  // Porcelanato claro de 90 × 90 cm, com veios suaves e rejunte fino.
  function texturaCeramica(T, largura, profundidade) {
    return textura(T, telaDe(1024, 1024, (g) => {
      g.fillStyle = "#a9a297";
      g.fillRect(0, 0, 1024, 1024);
      const r = sorteador(77);
      for (let i = 0; i < 70; i += 1) {
        g.strokeStyle = r() > 0.5 ? "#857e73" : "#c6c0b5";
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
      g.strokeStyle = "#5d574f";
      g.lineWidth = 5;
      g.strokeRect(0, 0, 1024, 1024);
    }), largura / 0.9, profundidade / 0.9);
  }

  // Pintura fosca, com a leve variação de um rolo.
  function texturaPintura(T, cor) {
    return textura(T, telaDe(1024, 1024, (g) => {
      g.fillStyle = cor;
      g.fillRect(0, 0, 1024, 1024);
      const r = sorteador(31);
      for (let i = 0; i < 5200; i += 1) {
        g.globalAlpha = 0.012 + r() * 0.03;
        g.fillStyle = r() > 0.5 ? "#ffffff" : "#000000";
        g.fillRect(r() * 1024, r() * 1024, 1 + r() * 9, 1 + r() * 9);
      }
    }), 3, 2);
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

  // Textura de assoalho de madeira, em réguas, para a sala.
  function texturaPisoMadeira(T, largura, profundidade) {
    return textura(T, telaDe(1024, 1024, (g) => {
      const r = sorteador(41);
      const REGUAS = 6;
      for (let i = 0; i < REGUAS; i += 1) {
        const l = 1024 / REGUAS;
        const tom = 118 + Math.floor(r() * 26);
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

  function criarKit(T, modulos) {
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

    function gaveta(modulo, l, a, x, y, z, prof, material, sentido = 1, recheio = null) {
      const zInterno = sentido > 0 ? z - prof : z;
      movel(modulo, "gaveta", [x, y, z], "z", sentido * 0.42, () => {
        frente(modulo, l, a, x, y, z, material, { sentido });
        const m = 0.03;
        const alt = Math.max(a - 0.09, 0.08);
        caixa(modulo, l - 2 * m, 0.012, prof, x + m, y + 0.02, zInterno, M.interno);
        caixa(modulo, 0.012, alt, prof, x + m, y + 0.02, zInterno, M.interno);
        caixa(modulo, 0.012, alt, prof, x + l - m - 0.012, y + 0.02, zInterno, M.interno);
        caixa(modulo, l - 2 * m, alt, 0.012, x + m, y + 0.02, sentido > 0 ? zInterno : zInterno + prof - 0.012, M.interno);
        if (recheio) recheio(x + l / 2, y + 0.032, zInterno + prof / 2);
      });
    }

    function portaVidro(modulo, l, a, x, y, z, dobradica) {
      const pivoX = dobradica === "esquerda" ? x : x + l;
      const lado = dobradica === "esquerda" ? -1 : 1;
      movel(modulo, "giro", [pivoX, y, z], "y", lado * ABERTURA_MAXIMA, () => {
        const P = 0.022;
        caixa(modulo, l - 0.004, a - 0.004, 0.005, x + 0.002, y + 0.002, z + 0.008, M.vidro);
        caixa(modulo, l - 0.004, P, 0.02, x + 0.002, y + 0.002, z, M.perfil);
        caixa(modulo, l - 0.004, P, 0.02, x + 0.002, y + a - P - 0.002, z, M.perfil);
        caixa(modulo, P, a - 0.004, 0.02, x + 0.002, y + 0.002, z, M.perfil);
        caixa(modulo, P, a - 0.004, 0.02, x + l - P - 0.002, y + 0.002, z, M.perfil);
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
    }

    function pratos(x, y, z) {
      cilindro(null, 0.115, 0.09, 0.07, x, y, z, M.ceramicaBranca, 24);
    }

    const ESPESSURA_KIT = ESPESSURA;

    function comoLateral(montar) {
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
    function casca({ piso, corFundo, corLado, spots }) {
      const LARGURA = 14;
      const PROF = 12;
      const chao = new T.Mesh(new T.PlaneGeometry(LARGURA + 6, PROF), padrao({ map: piso.mapa, roughness: piso.rugosidade, metalness: 0 }));
      chao.rotation.x = -Math.PI / 2;
      chao.position.set(LARGURA / 2 - 3, 0, PROF / 2);
      chao.receiveShadow = true;
      chao.name = piso.nome;
      cena.add(chao);

      const paredeFundo = caixa(null, LARGURA, 4.2, 0.05, -0.7, 0, -0.05, padrao({ map: texturaPintura(T, corFundo), roughness: 0.92 }));
      paredeFundo.name = "parede-pintada";
      paredeFundo.castShadow = false;
      caixa(null, LARGURA - 5.7, 0.1, 0.014, 5.04, 0, 0, M.rodape);

      comoLateral(() => {
        const lateral = caixa(null, 0.05, 4.2, 12, -0.75, 0, -0.05, padrao({ map: texturaPintura(T, corLado), roughness: 0.92 }));
        lateral.castShadow = false;
        caixa(null, 0.014, 0.1, 12, -0.7, 0, 0, M.rodape);
        caixa(null, 0.01, 1.3, 1.9, -0.7, 0.95, 2.3, M.ceu);
        for (const z of [2.27, 3.2, 4.2]) caixa(null, 0.05, 1.36, 0.04, -0.7, 0.92, z, M.perfil);
        for (const y of [0.92, 2.26]) caixa(null, 0.05, 0.04, 1.97, -0.7, y, 2.27, M.perfil);
      });

      // Teto de gesso, visível só de baixo, com spots embutidos
      const teto = new T.Mesh(new T.PlaneGeometry(LARGURA + 6, PROF), padrao({ color: 0xe8e5de, roughness: 0.95 }));
      teto.rotation.x = Math.PI / 2;
      teto.position.set(LARGURA / 2 - 3, 2.85, PROF / 2);
      teto.name = "teto";
      cena.add(teto);
      const formaSpot = new T.CylinderGeometry(0.05, 0.05, 0.004, 20);
      repetir(formaSpot, M.led, spots.map(([x, z]) => new T.Matrix4().makeTranslation(x, 2.847, z)), false);
    }

    function finalizar({ luzes, vista }) {
      const naPosicao = (dy) => posTacas.map(([x, y, z]) => new T.Matrix4().makeTranslation(x, y + dy, z));
      if (posTacas.length) {
        repetir(new T.CylinderGeometry(0.003, 0.024, 0.1, 12), M.taca, naPosicao(0.05), false);
        repetir(new T.CylinderGeometry(0.038, 0.022, 0.09, 16), M.taca, naPosicao(0.145), false);
      }
      cena.add(new T.HemisphereLight(0xfff4e6, 0x3a3027, 0.58));
      const sol = new T.DirectionalLight(0xfff0dd, 0.85);
      sol.position.set(4.5, 6, 6);
      sol.castShadow = true;
      sol.shadow.mapSize.set(2048, 2048);
      Object.assign(sol.shadow.camera, { left: -5, right: 9, top: 5, bottom: -4, near: 1, far: 18 });
      sol.shadow.bias = -0.0004;
      sol.shadow.radius = 3;
      cena.add(sol);
      for (const [x, y, z, cor, forca] of luzes) {
        const luz = new T.PointLight(cor, forca, 3.2, 2);
        luz.position.set(x, y, z);
        cena.add(luz);
      }
      // Só os grupos de portas e gavetas se movem. O resto não precisa ser recalculado a cada quadro.
      cena.traverse((o) => {
        if (o.isMesh) { o.updateMatrix(); o.matrixAutoUpdate = false; }
      });
      return { cena, pecas, moveis, aplicarAbertura, vista };
    }

    return { cena, pecas, moveis, M, padrao, caixa, cilindro, esfera, gabinete, frente, gaveta, portaGiro, portaBasculante, portaVidro, tacas, pratos, repetir, sombraContato, planta, casca, comoLateral, finalizar, aplicarAbertura, ESPESSURA: ESPESSURA_KIT };
  }

  function construirCozinhaAmbiente(T, dados) {
    const kit = criarKit(T, dados.modulos.filter((m) => m.comodo === "cozinha"));
    const { cena, M, caixa, cilindro, esfera, gabinete, gaveta, portaGiro, portaBasculante, portaVidro, tacas, pratos, sombraContato, planta, ESPESSURA } = kit;

    kit.casca({
      piso: { nome: "piso-ceramica", mapa: texturaCeramica(T, 20, 12), rugosidade: 0.34 },
      corFundo: "#7c8574",
      corLado: "#d9d3c8",
      spots: [[1, 3.8], [3, 3.8], [5, 3.8], [0.5, 1.1], [2.8, 1.1], [4.5, 1.1]],
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
      vista: { camera: [4.3, 2.45, 7.4], alvo: [2.5, 1.05, 0.9] },
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
    });

    const ALTURA = 2.6;
    const tecido = padrao({ color: 0xb9b2a5, roughness: 0.95 });
    const tecidoEscuro = padrao({ color: 0x4d4a45, roughness: 0.95 });
    const almofada = padrao({ color: 0xb1693c, roughness: 0.92 });
    const tapete = padrao({ color: 0xcfc8ba, roughness: 1 });
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
      vista: { camera: [4.7, 2.62, 7.7], alvo: [3.1, 0.9, 1.3] },
    });
  }

  window.construirAmbiente = function (T, dados, comodo) {
    return comodo === "sala" ? construirSala(T, dados) : construirCozinhaAmbiente(T, dados);
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

  function ligar3D(T, area, dados, comodoInicial, aoClicar) {
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

    const camera = new T.PerspectiveCamera(38, 1, 0.1, 40);
    const controles = new T.OrbitControls(camera, tela);
    Object.assign(controles, {
      enableDamping: true, dampingFactor: 0.08, enablePan: false, minDistance: 1.8, maxDistance: 9.5,
      maxPolarAngle: Math.PI / 2 - 0.04, minPolarAngle: 0.5, minAzimuthAngle: -1.15, maxAzimuthAngle: 1.2,
    });

    const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ray = new T.Raycaster();
    const ponto = new T.Vector2();
    const prontos = {};
    let atual = null;
    let selecionado = null;
    let sobre = null;

    // Cada cômodo é montado só quando abre, e fica guardado com suas portas como estavam.
    function comodoPronto(id) {
      if (prontos[id]) return prontos[id];
      const modelo = window.construirAmbiente(T, dados, id);
      modelo.cena.environment = reflexos;
      modelo.cena.traverse((o) => {
        if (o.material && o.material.map) o.material.map.anisotropy = anisotropia;
      });
      modelo.parteLateral = [];
      modelo.cena.traverse((o) => { if (o.userData.ladoEsquerdo) modelo.parteLateral.push(o); });
      modelo.estados = modelo.moveis.map((m) => ({ m, p: 0, de: 0, para: 0, inicio: 0, dur: 0 }));
      prontos[id] = modelo;
      return modelo;
    }

    function mostrar(id) {
      atual = comodoPronto(id);
      selecionado = null;
      sobre = null;
      camera.position.set(...atual.vista.camera);
      controles.target.set(...atual.vista.alvo);
      controles.update();
      atualizarLateral();
      atualizarBrilhos();
      renderer.shadowMap.needsUpdate = true;
      precisaDesenhar = true;
    }

    function brilho(id, valor) {
      for (const p of atual.pecas[id] || []) {
        if (p.material.emissive) { p.material.emissive.setHex(0xffc98a); p.material.emissiveIntensity = valor; }
      }
    }
    function atualizarBrilhos() {
      if (!atual) return;
      for (const id of Object.keys(atual.pecas)) brilho(id, id === selecionado ? 0.14 : id === sobre ? 0.07 : 0);
      precisaDesenhar = true;
    }
    function moduloEm(x, y) {
      const r = tela.getBoundingClientRect();
      ponto.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ponto, camera);
      const hit = ray.intersectObjects(atual.cena.children, true).find((i) => i.object.visible && (i.object.userData.modulo || !i.object.material.transparent));
      return hit ? hit.object.userData.modulo || null : null;
    }

    let pontoSobre = null;
    let inicio = null;
    tela.addEventListener("pointerdown", (e) => { inicio = { x: e.clientX, y: e.clientY }; });
    tela.addEventListener("pointerup", (e) => {
      if (!inicio || Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) > 6) return;
      const id = moduloEm(e.clientX, e.clientY);
      if (id) aoClicar(id, id === selecionado);
    });
    tela.addEventListener("pointermove", (e) => {
      if (e.buttons || e.pointerType === "touch") return;
      pontoSobre = { x: e.clientX, y: e.clientY };
    });
    tela.addEventListener("pointerleave", () => { pontoSobre = null; sobre = null; atualizarBrilhos(); });

    function ajustar() {
      const l = area.clientWidth;
      const a = area.clientHeight;
      if (!l || !a) return;
      renderer.setSize(l, a, false);
      camera.aspect = l / a;
      camera.updateProjectionMatrix();
      precisaDesenhar = true;
    }
    function atualizarLateral() {
      const visivel = camera.position.x > -0.68;
      for (const o of atual.parteLateral) o.visible = visivel;
    }
    controles.addEventListener("change", () => {
      precisaDesenhar = true;
      if (atual) atualizarLateral();
    });
    new ResizeObserver(ajustar).observe(area);
    ajustar();

    // Movimento de cada porta ou gaveta. Fechar leva bem mais tempo, para mostrar o amortecedor.
    const ABRIR_MS = 700;
    const FECHAR_MS = 2600;
    const estadosDe = (id) => atual.estados.filter((e) => e.m.modulo === id);
    const estaAberto = (id) => estadosDe(id).some((e) => e.para === 1);

    function mover(lista, abrir) {
      lista.forEach((e, i) => {
        if (reduzir) { e.p = abrir ? 1 : 0; e.para = e.p; e.dur = 0; atual.aplicarAbertura(e.m, e.p); precisaDesenhar = true; return; }
        e.de = e.p;
        e.para = abrir ? 1 : 0;
        e.inicio = performance.now() + i * 35;
        e.dur = abrir ? ABRIR_MS : FECHAR_MS;
      });
    }

    function animar(agora) {
      let movendo = false;
      for (const e of atual.estados) {
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
      controles.update();
      if (pontoSobre) {
        const id = moduloEm(pontoSobre.x, pontoSobre.y);
        pontoSobre = null;
        if (id !== sobre) { sobre = id; atualizarBrilhos(); }
        tela.style.cursor = id ? "pointer" : "grab";
      }
      if (!precisaDesenhar) return;
      precisaDesenhar = false;
      medirDesempenho(agora);
      renderer.render(atual.cena, camera);
    });

    return {
      moduloEm,
      camera,
      renderer,
      get cena() { return atual.cena; },
      temMovel: (id) => estadosDe(id).length > 0,
      aberto: estaAberto,
      alternar(id) { mover(estadosDe(id), !estaAberto(id)); },
      tudoAberto: () => atual.estados.some((e) => e.para === 1),
      alternarTudo() { mover(atual.estados, !atual.estados.some((e) => e.para === 1)); },
      selecionar(id) {
        selecionado = id;
        atualizarBrilhos();
      },
      // Escurece, troca o cômodo e clareia, em vez de um corte seco.
      trocarComodo(id) {
        if (reduzir) { mostrar(id); return; }
        tela.classList.add("coz-trocando");
        setTimeout(() => {
          mostrar(id);
          requestAnimationFrame(() => tela.classList.remove("coz-trocando"));
        }, 220);
      },
    };
  }

  window.iniciarCozinha3D = function (raiz, opcoes = {}) {
    const dados = window.COZINHA_DADOS;
    const pedido = new URLSearchParams(opcoes.busca || "").get("comodo");
    let comodo = dados.comodos.some((c) => c.id === pedido) ? pedido : dados.comodos[0].id;

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
      const modulos = dados.modulos.filter((m) => m.comodo === comodo);
      botoes = [];
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

    const seletor = h("div", { class: "coz-seletor", role: "group", "aria-label": "Escolha o cômodo" }, ...dados.comodos.map((c) => h("button", {
      type: "button",
      "data-comodo": c.id,
      "aria-pressed": String(c.id === comodo),
      onclick: () => {
        if (c.id === comodo) return;
        comodo = c.id;
        for (const b of seletor.children) b.setAttribute("aria-pressed", String(b.dataset.comodo === comodo));
        desenharLista();
        detalheInicial();
        if (visor) visor.trocarComodo(comodo);
        // O texto do botão só muda depois da troca, quando o outro cômodo já está na tela.
        setTimeout(atualizarBotaoTudo, 260);
      },
    }, c.nome)));

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

    if (!visor && !opcoes.sem3D && window.THREE) {
      visor = ligar3D(window.THREE, area, dados, comodo, (id, jaSelecionado) => {
        if (jaSelecionado && visor.temMovel(id)) { visor.alternar(id); atualizarBotaoTudo(); }
        escolher(id);
      });
    }
    area.append(seletor);
    if (visor) {
      botaoTudo = h("button", {
        type: "button",
        class: "botao coz-tudo",
        "data-abrir-tudo": "",
        onclick: () => { visor.alternarTudo(); atualizarBotaoTudo(); if (atual) escolher(atual); },
      }, "");
      atualizarBotaoTudo();
      area.append(h("div", { class: "coz-rodape" }, botaoTudo, h("p", { class: "coz-dica" }, "Arraste para girar · Clique em um móvel · Clique de novo para abrir")));
    } else {
      area.append(h("p", { class: "coz-sem-3d", "data-sem-3d": "" }, "Seu navegador não conseguiu abrir o modelo em 3D, mas todos os detalhes estão na lista de módulos."));
    }
    return { escolher, visor };
  };
})();
