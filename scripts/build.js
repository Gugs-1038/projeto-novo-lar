const { build } = require("esbuild");
const { minify } = require("html-minifier-terser");
const { cp, mkdir, readFile, rm, writeFile } = require("node:fs/promises");
const path = require("node:path");

const raiz = path.resolve(__dirname, "..");
const distribuicao = path.join(raiz, "dist");

const paginas = [
  {
    nome: "index",
    scriptsFonte: [
      "js/menu.js",
      "js/formulario.js",
      "js/componentes.js",
      "js/persistencia.js",
      "js/integracoes.js",
      "js/spa.js",
    ],
  },
  {
    nome: "cadastro",
    scriptsFonte: ["js/menu.js", "js/formulario.js", "js/integracoes.js"],
  },
  {
    nome: "projetos",
    scriptsFonte: ["js/menu.js"],
  },
];

const ficheirosFonteUnicos = [
  ...paginas.map((pagina) => `html/${pagina.nome}.html`),
  "css/estilos.css",
  ...new Set(paginas.flatMap((pagina) => pagina.scriptsFonte)),
];
const ficheirosDistribuicaoUnicos = [
  ...paginas.map((pagina) => `dist/html/${pagina.nome}.html`),
  "dist/css/estilos.min.css",
  ...paginas.map((pagina) => `dist/js/${pagina.nome}.min.js`),
];

function caminhoNaRaiz(caminhoRelativo) {
  return path.join(raiz, caminhoRelativo);
}

async function tamanho(caminhoRelativo) {
  const conteudo = await readFile(caminhoNaRaiz(caminhoRelativo), "utf8");
  const normalizado = conteudo.replace(/\r\n?/g, "\n");
  return Buffer.byteLength(normalizado, "utf8");
}

function arredondar(valor) {
  return Number(valor.toFixed(2));
}

function padraoScriptLocal() {
  return /\s*<script\b(?=[^>]*\bsrc=["']\.\.\/js\/([^"']+\.js)["'])[^>]*>\s*<\/script>/gi;
}

function listarScriptsLocais(html) {
  return [...html.matchAll(padraoScriptLocal())].map(
    (resultado) => `js/${resultado[1]}`
  );
}

function removerScriptsLocais(html) {
  return html.replace(padraoScriptLocal(), "");
}

async function gerarBundle(pagina) {
  const fontes = await Promise.all(
    pagina.scriptsFonte.map((ficheiro) =>
      readFile(caminhoNaRaiz(ficheiro), "utf8")
    )
  );
  const resultado = await build({
    stdin: {
      contents: fontes.join("\n"),
      loader: "js",
      sourcefile: `${pagina.nome}.entrada.js`,
    },
    bundle: true,
    charset: "utf8",
    format: "iife",
    legalComments: "none",
    minify: true,
    sourcemap: false,
    target: ["es2020"],
    write: false,
  });

  await writeFile(
    path.join(distribuicao, "js", `${pagina.nome}.min.js`),
    resultado.outputFiles[0].contents
  );
}

async function gerarHtml(pagina) {
  const origem = await readFile(caminhoNaRaiz(`html/${pagina.nome}.html`), "utf8");
  const scriptsEncontrados = listarScriptsLocais(origem);
  if (JSON.stringify(scriptsEncontrados) !== JSON.stringify(pagina.scriptsFonte)) {
    throw new Error(
      `Os scripts declarados em ${pagina.nome}.html não correspondem à configuração da build.`
    );
  }
  const comRecursosDeProducao = removerScriptsLocais(origem)
    .replace("../css/estilos.css", "../css/estilos.min.css")
    .replace(
      "</head>",
      `<script src="../js/${pagina.nome}.min.js" defer></script></head>`
    );
  const minificado = await minify(comRecursosDeProducao, {
    collapseWhitespace: true,
    decodeEntities: true,
    removeComments: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
  });

  await writeFile(
    path.join(distribuicao, "html", `${pagina.nome}.html`),
    minificado,
    "utf8"
  );
}

async function gerarEntradaPublicacao() {
  const entrada = [
    "<!doctype html>",
    '<html lang="pt-BR">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta http-equiv="refresh" content="0; url=html/index.html">',
    "<title>Projeto Novo Lar</title>",
    '<script>window.location.replace("html/index.html"+window.location.search+window.location.hash);</script>',
    "</head>",
    '<body><p>A abrir o Projeto Novo Lar. <a href="html/index.html">Continuar</a></p></body>',
    "</html>",
  ].join("");

  await Promise.all([
    writeFile(path.join(distribuicao, "index.html"), entrada, "utf8"),
    writeFile(path.join(distribuicao, ".nojekyll"), "", "utf8"),
  ]);
}

async function resumirPagina(pagina) {
  const origem = [`html/${pagina.nome}.html`, "css/estilos.css", ...pagina.scriptsFonte];
  const distribuicaoPagina = [
    `dist/html/${pagina.nome}.html`,
    "dist/css/estilos.min.css",
    `dist/js/${pagina.nome}.min.js`,
  ];
  const bytesOrigem = (await Promise.all(origem.map(tamanho))).reduce(
    (total, valor) => total + valor,
    0
  );
  const bytesDistribuicao = (
    await Promise.all(distribuicaoPagina.map(tamanho))
  ).reduce((total, valor) => total + valor, 0);
  const reducaoBytes = bytesOrigem - bytesDistribuicao;

  return {
    pagina: pagina.nome,
    bytesOrigem,
    bytesDistribuicao,
    reducaoBytes,
    reducaoPercentual: arredondar((reducaoBytes / bytesOrigem) * 100),
  };
}

async function resumirConjunto(origem, destino) {
  const bytesOrigem = (await Promise.all(origem.map(tamanho))).reduce(
    (total, valor) => total + valor,
    0
  );
  const bytesDistribuicao = (await Promise.all(destino.map(tamanho))).reduce(
    (total, valor) => total + valor,
    0
  );
  const reducaoBytes = bytesOrigem - bytesDistribuicao;

  return {
    bytesOrigem,
    bytesDistribuicao,
    reducaoBytes,
    reducaoPercentual: arredondar((reducaoBytes / bytesOrigem) * 100),
  };
}

async function executar() {
  await rm(distribuicao, { recursive: true, force: true });
  await Promise.all([
    mkdir(path.join(distribuicao, "css"), { recursive: true }),
    mkdir(path.join(distribuicao, "html"), { recursive: true }),
    mkdir(path.join(distribuicao, "js"), { recursive: true }),
  ]);

  const cssFonte = await readFile(caminhoNaRaiz("css/estilos.css"), "utf8");
  const cssResultado = await build({
    stdin: {
      contents: cssFonte,
      loader: "css",
      sourcefile: "estilos.css",
    },
    bundle: true,
    charset: "utf8",
    legalComments: "none",
    minify: true,
    sourcemap: false,
    target: ["es2020"],
    write: false,
  });
  await writeFile(
    path.join(distribuicao, "css", "estilos.min.css"),
    cssResultado.outputFiles[0].contents
  );

  await Promise.all(paginas.map(gerarBundle));
  await Promise.all(paginas.map(gerarHtml));
  await cp(caminhoNaRaiz("imagens"), path.join(distribuicao, "imagens"), {
    recursive: true,
  });
  await gerarEntradaPublicacao();

  const paginasResumidas = await Promise.all(paginas.map(resumirPagina));
  const ficheirosUnicos = await resumirConjunto(
    ficheirosFonteUnicos,
    ficheirosDistribuicaoUnicos
  );
  const totalOrigem = paginasResumidas.reduce(
    (total, pagina) => total + pagina.bytesOrigem,
    0
  );
  const totalDistribuicao = paginasResumidas.reduce(
    (total, pagina) => total + pagina.bytesDistribuicao,
    0
  );
  const relatorio = {
    ferramenta: "esbuild e html-minifier-terser",
    criterioTamanho:
      "ficheiros de texto normalizados com finais de linha LF; imagens excluídas",
    css: "css/estilos.css para dist/css/estilos.min.css",
    ficheirosUnicos,
    paginas: paginasResumidas,
    carregamentosAgregados: {
      bytesOrigem: totalOrigem,
      bytesDistribuicao: totalDistribuicao,
      reducaoBytes: totalOrigem - totalDistribuicao,
      reducaoPercentual: arredondar(
        ((totalOrigem - totalDistribuicao) / totalOrigem) * 100
      ),
    },
  };
  const linhas = [
    "RELATÓRIO DE BUILD DE PRODUÇÃO",
    "",
    "Ferramentas: esbuild e html-minifier-terser",
    "Critério: ficheiros de texto normalizados com finais de linha LF; imagens excluídas",
    "",
    `Ficheiros únicos: ${ficheirosUnicos.bytesOrigem} bytes para ${ficheirosUnicos.bytesDistribuicao} bytes, redução de ${ficheirosUnicos.reducaoPercentual}%`,
    "",
    ...paginasResumidas.map(
      (pagina) =>
        `${pagina.pagina}: ${pagina.bytesOrigem} bytes para ${pagina.bytesDistribuicao} bytes, redução de ${pagina.reducaoPercentual}%`
    ),
    "",
    `Carregamentos agregados: ${relatorio.carregamentosAgregados.bytesOrigem} bytes para ${relatorio.carregamentosAgregados.bytesDistribuicao} bytes, redução de ${relatorio.carregamentosAgregados.reducaoPercentual}%`,
  ];

  await Promise.all([
    writeFile(
      path.join(distribuicao, "relatorio-build.json"),
      `${JSON.stringify(relatorio, null, 2)}\n`,
      "utf8"
    ),
    writeFile(
      path.join(distribuicao, "relatorio-build.txt"),
      `${linhas.join("\n")}\n`,
      "utf8"
    ),
  ]);

  console.log(linhas.join("\n"));
}

executar().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
