(() => {
let temporizadorToast;

const padroesFormulario = Object.freeze({
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  telefone: /^\(\d{2}\) \d{4,5}-\d{4}$/,
  cep: /^\d{5}-\d{3}$/,
  estado: /^[A-Z]{2}$/,
});

const ufsValidas = new Set([
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]);

const mensagensObrigatorias = Object.freeze({
  nome: "Informe seu nome completo.",
  nascimento: "Informe sua data de nascimento.",
  cpf: "Informe o CPF.",
  email: "Informe seu e-mail.",
  telefone: "Informe seu telefone.",
  endereco: "Informe seu endereço.",
  cidade: "Informe sua cidade.",
  estado: "Informe o estado.",
  cep: "Informe o CEP.",
});

function obterHojeISO() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function campoDoFormulario(alvo) {
  return (
    alvo instanceof HTMLInputElement &&
    alvo.closest(".formulario") instanceof HTMLFormElement
  );
}

function obterRetornoFormulario() {
  return document.querySelector("#retorno-formulario");
}

function obterToastCadastro() {
  return document.querySelector("#toast-cadastro");
}

function obterOuCriarMensagem(campo) {
  const grupoCampo = campo.closest(".campo");
  if (!grupoCampo) {
    return null;
  }

  let mensagem = grupoCampo.querySelector(".mensagem-campo");
  if (!mensagem) {
    mensagem = document.createElement("small");
    mensagem.className = "mensagem-campo";
    mensagem.id = `${campo.id}-mensagem`;
    mensagem.setAttribute("aria-live", "polite");
    mensagem.hidden = true;
    grupoCampo.append(mensagem);
  }

  const descricoes = new Set(
    (campo.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean)
  );
  descricoes.add(mensagem.id);
  campo.setAttribute("aria-describedby", Array.from(descricoes).join(" "));

  return mensagem;
}

function cpfPossuiDigitosValidos(valor) {
  const digitos = valor.replace(/\D/g, "");
  if (!/^\d{11}$/.test(digitos) || /^(\d)\1{10}$/.test(digitos)) {
    return false;
  }

  function calcularDigito(tamanho) {
    let soma = 0;
    for (let indice = 0; indice < tamanho; indice += 1) {
      soma += Number(digitos[indice]) * (tamanho + 1 - indice);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }

  return (
    calcularDigito(9) === Number(digitos[9]) &&
    calcularDigito(10) === Number(digitos[10])
  );
}

function obterMensagemErro(campo) {
  campo.setCustomValidity("");
  const valor = campo.value.trim();

  if (campo.required && !valor) {
    return mensagensObrigatorias[campo.id] || "Preencha este campo.";
  }

  if (campo.id === "nome" && valor.length < 3) {
    return "Digite um nome com pelo menos três caracteres.";
  }
  if (campo.id === "endereco" && valor.length < 3) {
    return "Digite um endereço com pelo menos três caracteres.";
  }
  if (campo.id === "cidade" && valor.length < 2) {
    return "Digite uma cidade com pelo menos dois caracteres.";
  }
  if (campo.id === "email" && campo.validity.typeMismatch) {
    return "Digite um e-mail válido, como nome@exemplo.org.";
  }
  if (campo.id === "nascimento" && valor > obterHojeISO()) {
    return "A data de nascimento não pode estar no futuro.";
  }
  if (campo.id === "cpf") {
    if (!padroesFormulario.cpf.test(valor)) {
      return "Use o formato 000.000.000-00.";
    }
    if (!cpfPossuiDigitosValidos(valor)) {
      return "CPF inválido. Confira os dígitos informados.";
    }
  }
  if (
    campo.id === "telefone" &&
    !padroesFormulario.telefone.test(valor)
  ) {
    return "Use o formato (00) 00000-0000 ou (00) 0000-0000.";
  }
  if (campo.id === "cep" && !padroesFormulario.cep.test(valor)) {
    return "Use o formato 00000-000.";
  }
  if (campo.id === "estado") {
    if (!padroesFormulario.estado.test(valor)) {
      return "Digite a UF com duas letras, como SP.";
    }
    if (!ufsValidas.has(valor)) {
      return "Informe uma UF brasileira válida.";
    }
  }

  if (campo.validity.tooShort) {
    return `Use pelo menos ${campo.minLength} caracteres.`;
  }
  if (campo.validity.patternMismatch || campo.validity.badInput) {
    return campo.title || "Revise o formato deste campo.";
  }

  return "";
}

function validarCampo(campo) {
  const grupoCampo = campo.closest(".campo");
  const mensagem = obterOuCriarMensagem(campo);
  const erro = obterMensagemErro(campo);
  const valido = erro === "";

  campo.setCustomValidity(erro);
  campo.setAttribute("aria-invalid", String(!valido));

  if (grupoCampo) {
    grupoCampo.classList.toggle("campo-valido", valido);
    grupoCampo.classList.toggle("campo-invalido", !valido);
  }

  if (mensagem) {
    mensagem.hidden = false;
    mensagem.textContent = valido ? "✓ Preenchimento válido." : erro;
  }

  return valido;
}

function validarFormulario(formulario) {
  const campos = Array.from(formulario.querySelectorAll("input:not(:disabled)"));
  let primeiroInvalido = null;
  let quantidadeInvalidos = 0;

  campos.forEach((campo) => {
    campo.dataset.interagiu = "true";
    if (!validarCampo(campo)) {
      primeiroInvalido ||= campo;
      quantidadeInvalidos += 1;
    }
  });

  return {
    valido: quantidadeInvalidos === 0,
    primeiroInvalido,
    quantidadeInvalidos,
  };
}

function exibirResumoErro(quantidadeInvalidos) {
  const retornoFormulario = obterRetornoFormulario();
  if (!retornoFormulario) {
    return;
  }

  const mensagem = retornoFormulario.querySelector("p");
  if (mensagem && Number.isInteger(quantidadeInvalidos)) {
    mensagem.textContent =
      quantidadeInvalidos === 1
        ? "Revise o campo destacado antes de enviar o cadastro."
        : `Revise os ${quantidadeInvalidos} campos destacados antes de enviar o cadastro.`;
  }
  retornoFormulario.hidden = false;
}

function ocultarResumoErro() {
  const retornoFormulario = obterRetornoFormulario();
  if (retornoFormulario) {
    retornoFormulario.hidden = true;
  }
}

function ocultarToast() {
  const toastCadastro = obterToastCadastro();
  window.clearTimeout(temporizadorToast);

  if (!toastCadastro) {
    return;
  }

  toastCadastro.classList.remove("esta-visivel");
  toastCadastro.setAttribute("aria-hidden", "true");
}

function exibirToast() {
  const toastCadastro = obterToastCadastro();
  if (!toastCadastro) {
    return;
  }

  window.clearTimeout(temporizadorToast);
  toastCadastro.classList.add("esta-visivel");
  toastCadastro.setAttribute("aria-hidden", "false");
  temporizadorToast = window.setTimeout(ocultarToast, 7000);
}

function prepararFormularios() {
  document.querySelectorAll(".formulario").forEach((formulario) => {
    formulario.noValidate = true;

    formulario.querySelectorAll("input").forEach((campo) => {
      obterOuCriarMensagem(campo);
      if (campo.id === "nascimento") {
        campo.max = obterHojeISO();
      }
    });
  });
}

document.addEventListener(
  "invalid",
  (evento) => {
    const campo = evento.target;
    if (!campoDoFormulario(campo)) {
      return;
    }

    evento.preventDefault();
    campo.dataset.interagiu = "true";
    validarCampo(campo);
    exibirResumoErro();
    ocultarToast();
  },
  true
);

document.addEventListener("input", (evento) => {
  const campo = evento.target;
  if (!campoDoFormulario(campo)) {
    return;
  }

  if (campo.id === "estado") {
    campo.value = campo.value.toUpperCase();
  }

  const formulario = campo.closest(".formulario");
  if (
    campo.dataset.interagiu === "true" ||
    formulario.dataset.tentativaEnvio === "true"
  ) {
    validarCampo(campo);
  } else {
    campo.setCustomValidity("");
  }

  if (formulario.dataset.tentativaEnvio === "true") {
    const quantidadeInvalidos = formulario.querySelectorAll(
      ".campo-invalido"
    ).length;
    if (quantidadeInvalidos > 0) {
      exibirResumoErro(quantidadeInvalidos);
    } else {
      ocultarResumoErro();
    }
  }

  ocultarToast();
});

document.addEventListener("focusout", (evento) => {
  const campo = evento.target;
  if (!campoDoFormulario(campo)) {
    return;
  }

  campo.dataset.interagiu = "true";
  validarCampo(campo);
});

document.addEventListener("submit", (evento) => {
  const formulario = evento.target;
  if (
    !(formulario instanceof HTMLFormElement) ||
    !formulario.matches(".formulario")
  ) {
    return;
  }

  evento.preventDefault();
  formulario.dataset.tentativaEnvio = "true";
  const resultado = validarFormulario(formulario);

  if (!resultado.valido) {
    exibirResumoErro(resultado.quantidadeInvalidos);
    ocultarToast();
    window.requestAnimationFrame(() => resultado.primeiroInvalido?.focus());
    return;
  }

  formulario.dataset.tentativaEnvio = "false";
  ocultarResumoErro();
  exibirToast();
});

document.addEventListener("click", (evento) => {
  const alvo = evento.target;
  if (alvo instanceof Element && alvo.closest(".toast-fechar")) {
    ocultarToast();
  }
});

document.addEventListener("novolar:rota-renderizada", () => {
  ocultarToast();
  prepararFormularios();
});

prepararFormularios();

window.NovoLarFormulario = Object.freeze({ validarCampo, validarFormulario });
})();
