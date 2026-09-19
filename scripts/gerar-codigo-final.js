const { readFile, writeFile } = require("node:fs/promises");
const path = require("node:path");

const raiz = path.resolve(__dirname, "..");
const destino = path.join(raiz, "CODIGO-FONTE-FINAL.txt");
const limiteCaracteres = 100000;
const ficheiros = [
  ".github/workflows/deploy-pages.yml",
  ".gitignore",
  "package.json",
  "html/index.html",
  "html/projetos.html",
  "html/cadastro.html",
  "css/estilos.css",
  "js/menu.js",
  "js/formulario.js",
  "js/componentes.js",
  "js/persistencia.js",
  "js/integracoes.js",
  "js/spa.js",
  "scripts/build.js",
  "scripts/verificar-build.js",
  "scripts/gerar-codigo-final.js",
  "validacao-contraste/verificar-contraste.js",
];

async function executar() {
  const blocos = await Promise.all(
    ficheiros.map(async (ficheiro) => {
      const conteudo = await readFile(path.join(raiz, ficheiro), "utf8");
      return `===== FICHEIRO: ${ficheiro} =====\n\n${conteudo.trimEnd()}`;
    })
  );
  const cabecalho = [
    "PROJETO NOVO LAR - CÓDIGO FONTE FINAL VERSIONADO",
    "Conteúdo consolidado para o campo de entrega da plataforma.",
    "Cada bloco indica o caminho original do respetivo ficheiro.",
  ].join("\n");
  const conteudoFinal = `${cabecalho}\n\n${blocos.join("\n\n")}\n`;

  if (conteudoFinal.length > limiteCaracteres) {
    throw new Error(
      `O código consolidado excedeu o limite: ${conteudoFinal.length} caracteres.`
    );
  }

  await writeFile(destino, conteudoFinal, "utf8");
  console.log(
    `Código final criado com ${conteudoFinal.length} de ${limiteCaracteres} caracteres.`
  );
}

executar().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
