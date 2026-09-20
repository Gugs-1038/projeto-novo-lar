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
      const normalizado = conteudo.replace(/\r\n?/g, "\n").trimEnd();
      return `FICHEIRO: ${ficheiro}\n\n${normalizado}`;
    })
  );
  const conteudoFinal = `${blocos.join("\n\n")}\n`;
  const tamanhoComCrLf = conteudoFinal.replace(/\n/g, "\r\n").length;

  if (
    conteudoFinal.length > limiteCaracteres ||
    tamanhoComCrLf > limiteCaracteres
  ) {
    throw new Error(
      `O código consolidado excedeu o limite: ${conteudoFinal.length} com LF e ${tamanhoComCrLf} com CRLF.`
    );
  }

  await writeFile(destino, conteudoFinal, "utf8");
  console.log(
    `Código final criado com ${conteudoFinal.length} caracteres em LF e ${tamanhoComCrLf} em CRLF, dentro do limite de ${limiteCaracteres}.`
  );
}

executar().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
