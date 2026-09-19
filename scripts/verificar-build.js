const { access, readFile, stat } = require("node:fs/promises");
const path = require("node:path");

const raiz = path.resolve(__dirname, "..");
const paginas = ["index", "cadastro", "projetos"];
const scriptsPorPagina = {
  index: [
    "js/menu.js",
    "js/formulario.js",
    "js/componentes.js",
    "js/persistencia.js",
    "js/integracoes.js",
    "js/spa.js",
  ],
  cadastro: ["js/menu.js", "js/formulario.js", "js/integracoes.js"],
  projetos: ["js/menu.js"],
};
const ficheirosFonteUnicos = [
  "html/index.html",
  "html/cadastro.html",
  "html/projetos.html",
  "css/estilos.css",
  "js/menu.js",
  "js/formulario.js",
  "js/componentes.js",
  "js/persistencia.js",
  "js/integracoes.js",
  "js/spa.js",
];
const ficheirosDistribuicaoUnicos = [
  "dist/html/index.html",
  "dist/html/cadastro.html",
  "dist/html/projetos.html",
  "dist/css/estilos.min.css",
  "dist/js/index.min.js",
  "dist/js/cadastro.min.js",
  "dist/js/projetos.min.js",
];

function caminhoNaRaiz(caminhoRelativo) {
  return path.join(raiz, caminhoRelativo);
}

async function existe(caminhoRelativo) {
  await access(caminhoNaRaiz(caminhoRelativo));
}

async function verificarPagina(nome) {
  const caminhoHtml = `dist/html/${nome}.html`;
  const html = await readFile(caminhoNaRaiz(caminhoHtml), "utf8");
  const cssEsperado = "../css/estilos.min.css";
  const scriptEsperado = `../js/${nome}.min.js`;

  if (!html.includes(cssEsperado)) {
    throw new Error(`${caminhoHtml} não referencia o CSS minificado.`);
  }

  if (!html.includes(scriptEsperado)) {
    throw new Error(`${caminhoHtml} não referencia o bundle esperado.`);
  }

  if (/\.\.\/js\/(?:menu|formulario|componentes|persistencia|integracoes|spa)\.js/.test(html)) {
    throw new Error(`${caminhoHtml} ainda referencia scripts fonte.`);
  }

  if (html.includes("\n")) {
    throw new Error(`${caminhoHtml} não foi minificado em uma linha.`);
  }

  await existe(`dist/js/${nome}.min.js`);
  const bundle = await readFile(
    caminhoNaRaiz(`dist/js/${nome}.min.js`),
    "utf8"
  );
  new Function(bundle);
}

async function totalBytes(ficheiros) {
  const tamanhos = await Promise.all(
    ficheiros.map(async (ficheiro) => (await stat(caminhoNaRaiz(ficheiro))).size)
  );
  return tamanhos.reduce((total, valor) => total + valor, 0);
}

function arredondar(valor) {
  return Number(valor.toFixed(2));
}

async function resumirFicheiros(origem, destino) {
  const bytesOrigem = await totalBytes(origem);
  const bytesDistribuicao = await totalBytes(destino);
  const reducaoBytes = bytesOrigem - bytesDistribuicao;

  return {
    bytesOrigem,
    bytesDistribuicao,
    reducaoBytes,
    reducaoPercentual: arredondar((reducaoBytes / bytesOrigem) * 100),
  };
}

async function executar() {
  await Promise.all([
    existe("dist/css/estilos.min.css"),
    existe("dist/imagens/animal-resgatado.jpg"),
    existe("dist/imagens/animal-resgatado.webp"),
    existe("dist/relatorio-build.json"),
    existe("dist/relatorio-build.txt"),
    ...paginas.map(verificarPagina),
  ]);

  const cssFonte = await stat(caminhoNaRaiz("css/estilos.css"));
  const cssMinificado = await stat(caminhoNaRaiz("dist/css/estilos.min.css"));
  if (cssMinificado.size >= cssFonte.size) {
    throw new Error("O CSS de produção não ficou menor que o CSS fonte.");
  }

  const relatorio = JSON.parse(
    await readFile(caminhoNaRaiz("dist/relatorio-build.json"), "utf8")
  );
  const resumoEsperado = await resumirFicheiros(
    ficheirosFonteUnicos,
    ficheirosDistribuicaoUnicos
  );

  if (
    JSON.stringify(relatorio.ficheirosUnicos) !==
    JSON.stringify(resumoEsperado)
  ) {
    throw new Error("O relatório não corresponde aos tamanhos atuais da build.");
  }

  const paginasEsperadas = await Promise.all(
    paginas.map(async (pagina) => ({
      pagina,
      ...(await resumirFicheiros(
        [
          `html/${pagina}.html`,
          "css/estilos.css",
          ...scriptsPorPagina[pagina],
        ],
        [
          `dist/html/${pagina}.html`,
          "dist/css/estilos.min.css",
          `dist/js/${pagina}.min.js`,
        ]
      )),
    }))
  );

  if (JSON.stringify(relatorio.paginas) !== JSON.stringify(paginasEsperadas)) {
    throw new Error("O relatório por página não corresponde à build atual.");
  }

  const bytesOrigemAgregados = paginasEsperadas.reduce(
    (total, pagina) => total + pagina.bytesOrigem,
    0
  );
  const bytesDistribuicaoAgregados = paginasEsperadas.reduce(
    (total, pagina) => total + pagina.bytesDistribuicao,
    0
  );
  const reducaoAgregada = bytesOrigemAgregados - bytesDistribuicaoAgregados;
  const carregamentosAgregadosEsperados = {
    bytesOrigem: bytesOrigemAgregados,
    bytesDistribuicao: bytesDistribuicaoAgregados,
    reducaoBytes: reducaoAgregada,
    reducaoPercentual: arredondar(
      (reducaoAgregada / bytesOrigemAgregados) * 100
    ),
  };

  if (
    JSON.stringify(relatorio.carregamentosAgregados) !==
    JSON.stringify(carregamentosAgregadosEsperados)
  ) {
    throw new Error(
      "O relatório agregado não corresponde aos carregamentos atuais."
    );
  }

  console.log("Build verificada: referências, bundles, imagens e redução confirmadas.");
}

executar().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
