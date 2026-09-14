const pares = [
  ["Claro | Texto principal", "#17211c", "#f7faf8", 4.5],
  ["Claro | Texto secundário", "#4d5c54", "#f7faf8", 4.5],
  ["Claro | Títulos", "#12372a", "#f7faf8", 4.5],
  ["Claro | Botões", "#ffffff", "#12372a", 4.5],
  ["Claro | Atenção", "#9b4300", "#fff7e6", 4.5],
  ["Claro | Sucesso", "#1b6e37", "#eff9f2", 4.5],
  ["Claro | Erro", "#b42318", "#fff3f1", 4.5],
  ["Claro | Bordas funcionais", "#72867b", "#ffffff", 3],
  ["Claro | Indicador de foco", "#0b281e", "#ffb703", 3],
  ["Escuro | Texto principal", "#f4f8f5", "#08110d", 4.5],
  ["Escuro | Texto em superfície", "#f4f8f5", "#102019", 4.5],
  ["Escuro | Texto secundário", "#c3d0c9", "#08110d", 4.5],
  ["Escuro | Títulos", "#a7d8bc", "#08110d", 4.5],
  ["Escuro | Botões", "#08110d", "#a7d8bc", 4.5],
  ["Escuro | Hover de botão", "#08110d", "#7fc49d", 4.5],
  ["Escuro | Destaques", "#ffb37a", "#08110d", 4.5],
  ["Escuro | Bordas", "#6f897a", "#102019", 3],
  ["Escuro | Sucesso", "#8ae6a5", "#12351f", 4.5],
  ["Escuro | Erro", "#ffaaa3", "#3a1717", 4.5],
  ["Alto contraste | Texto", "#ffffff", "#000000", 4.5],
  ["Alto contraste | Títulos", "#00ffff", "#000000", 4.5],
  ["Alto contraste | Botões", "#000000", "#00ffff", 4.5],
  ["Alto contraste | Foco", "#000000", "#ffff00", 3],
  ["Alto contraste | Sucesso", "#00ff66", "#000000", 4.5],
  ["Alto contraste | Erro", "#ff8080", "#000000", 4.5],
];

function linearizar(canal) {
  const valor = canal / 255;
  return valor <= 0.04045
    ? valor / 12.92
    : Math.pow((valor + 0.055) / 1.055, 2.4);
}

function luminancia(cor) {
  const hexadecimal = cor.replace("#", "");
  const vermelho = parseInt(hexadecimal.slice(0, 2), 16);
  const verde = parseInt(hexadecimal.slice(2, 4), 16);
  const azul = parseInt(hexadecimal.slice(4, 6), 16);

  return (
    0.2126 * linearizar(vermelho) +
    0.7152 * linearizar(verde) +
    0.0722 * linearizar(azul)
  );
}

function calcularRacio(primeiraCor, segundaCor) {
  const primeiraLuminancia = luminancia(primeiraCor);
  const segundaLuminancia = luminancia(segundaCor);
  const maior = Math.max(primeiraLuminancia, segundaLuminancia);
  const menor = Math.min(primeiraLuminancia, segundaLuminancia);
  return (maior + 0.05) / (menor + 0.05);
}

let falhas = 0;

console.log("VALIDAÇÃO DE CONTRASTE WCAG 2.1");
console.log("");

pares.forEach(([elemento, primeiraCor, segundaCor, minimo]) => {
  const racio = calcularRacio(primeiraCor, segundaCor);
  const aprovado = racio >= minimo;

  if (!aprovado) {
    falhas += 1;
  }

  console.log(
    elemento +
      " | " +
      primeiraCor.toUpperCase() +
      " sobre " +
      segundaCor.toUpperCase() +
      " | " +
      racio.toFixed(2).replace(".", ",") +
      ":1 | mínimo " +
      String(minimo).replace(".", ",") +
      ":1 | " +
      (aprovado ? "APROVADO" : "REPROVADO")
  );
});

console.log("");
console.log("Resultado: " + (falhas === 0 ? "todos os pares foram aprovados" : falhas + " pares reprovados"));

if (falhas > 0) {
  process.exitCode = 1;
}
