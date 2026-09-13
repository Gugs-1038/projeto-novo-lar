(() => {
const conteudo = document.querySelector("#conteudo");
const avisoRota = document.querySelector("#aviso-rota");
const descricaoPagina = document.querySelector('meta[name="description"]');

if (!conteudo) {
  throw new Error("O contêiner principal da aplicação não foi encontrado.");
}

const modeloInicio = document.createDocumentFragment();
Array.from(conteudo.childNodes).forEach((no) => {
  modeloInicio.append(no.cloneNode(true));
});

const rotas = {
  inicio: {
    titulo: "Início | Projeto Novo Lar",
    descricao:
      "Conheça o Projeto Novo Lar e suas ações de proteção e adoção responsável de animais.",
    classe: "",
    criarConteudo: () => modeloInicio.cloneNode(true),
  },
  projetos: {
    titulo: "Projetos | Projeto Novo Lar",
    descricao:
      "Veja os projetos, as formas de voluntariado e as campanhas de doação do Projeto Novo Lar.",
    classe: "conteudo-interno",
    template: "pagina-projetos",
  },
  cadastro: {
    titulo: "Cadastro | Projeto Novo Lar",
    descricao: "Formulário de cadastro de voluntários do Projeto Novo Lar.",
    classe: "conteudo-interno",
    template: "pagina-cadastro",
  },
};

const alvosProjetos = {
  resgate: "acoes-titulo",
  voluntariado: "voluntariado",
  doacoes: "doacoes",
  "como-ajudar": "como-ajudar",
};

function obterRota() {
  const hash = window.location.hash.startsWith("#/")
    ? window.location.hash.slice(2)
    : "";

  let partes;
  try {
    partes = decodeURIComponent(hash).split("/").filter(Boolean);
  } catch {
    partes = [];
  }

  const nome = partes[0] || "inicio";
  const secao = nome === "projetos" ? alvosProjetos[partes[1]] : undefined;
  const caminho = partes.length > 0 ? `/${partes.join("/")}` : "/inicio";

  return {
    nome,
    secao,
    caminho,
    desconhecida:
      !Object.prototype.hasOwnProperty.call(rotas, nome) ||
      (nome === "projetos" && partes.length > 1 && !secao),
  };
}

function criarFragmento(configuracao) {
  if (configuracao.criarConteudo) {
    return configuracao.criarConteudo();
  }

  const template = document.querySelector(`#${configuracao.template}`);
  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error(`O modelo ${configuracao.template} não foi encontrado.`);
  }

  return template.content.cloneNode(true);
}

function atualizarNavegacao(nomeRota) {
  document
    .querySelectorAll(".navegacao a[data-rota]")
    .forEach((link) => link.removeAttribute("aria-current"));

  document
    .querySelector(`.navegacao a[data-rota="/${nomeRota}"]`)
    ?.setAttribute("aria-current", "page");
}

function focarConteudo(secao) {
  const alvo = secao
    ? conteudo.querySelector(`#${secao}`)
    : conteudo.querySelector("h1");

  if (!(alvo instanceof HTMLElement)) {
    conteudo.focus();
    return;
  }

  alvo.setAttribute("tabindex", "-1");
  alvo.focus({ preventScroll: true });
  alvo.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });
  alvo.addEventListener("blur", () => alvo.removeAttribute("tabindex"), {
    once: true,
  });
}

function renderizarRota({ moverFoco = true } = {}) {
  const rotaSolicitada = obterRota();
  const nomeRota = rotaSolicitada.desconhecida
    ? "inicio"
    : rotaSolicitada.nome;
  const configuracao = rotas[nomeRota];

  conteudo.className = configuracao.classe;
  conteudo.replaceChildren(criarFragmento(configuracao));

  if (nomeRota === "projetos") {
    window.NovoLarComponentes?.renderizarCartoesAjuda(conteudo);
  }

  document.title = configuracao.titulo;

  if (descricaoPagina) {
    descricaoPagina.setAttribute("content", configuracao.descricao);
  }

  atualizarNavegacao(nomeRota);

  window.NovoLarPersistencia?.registrarRota(
    rotaSolicitada.desconhecida ? "/inicio" : rotaSolicitada.caminho
  );

  if (avisoRota) {
    avisoRota.textContent = rotaSolicitada.desconhecida
      ? "Endereço não encontrado. Página inicial exibida."
      : `${conteudo.querySelector("h1")?.textContent || "Página"} carregada.`;
  }

  document.dispatchEvent(
    new CustomEvent("novolar:rota-renderizada", {
      detail: { rota: nomeRota, secao: rotaSolicitada.secao },
    })
  );

  if (moverFoco || rotaSolicitada.secao) {
    window.requestAnimationFrame(() => focarConteudo(rotaSolicitada.secao));
  } else {
    window.scrollTo(0, 0);
  }
}

document.addEventListener("click", (evento) => {
  const alvo = evento.target;
  if (!(alvo instanceof Element)) {
    return;
  }

  const atalhoConteudo = alvo.closest(".pular-conteudo");
  if (atalhoConteudo) {
    evento.preventDefault();
    conteudo.focus();
    return;
  }

  const link = alvo.closest("a[data-rota]");
  if (
    !link ||
    evento.defaultPrevented ||
    evento.button !== 0 ||
    evento.ctrlKey ||
    evento.metaKey ||
    evento.shiftKey ||
    evento.altKey ||
    link.hasAttribute("download") ||
    link.target === "_blank"
  ) {
    return;
  }

  const caminho = link.dataset.rota;
  if (!caminho || !caminho.startsWith("/")) {
    return;
  }

  evento.preventDefault();
  const novoHash = `#${caminho}`;

  if (window.location.hash === novoHash) {
    renderizarRota();
  } else {
    window.location.hash = caminho;
  }
});

window.addEventListener("hashchange", () => renderizarRota());

if (!window.location.hash.startsWith("#/")) {
  const ultimaRota =
    window.NovoLarPersistencia?.obterUltimaRota() || "/inicio";
  window.history.replaceState(null, "", `#${ultimaRota}`);
}

renderizarRota({ moverFoco: false });

window.NovoLarSPA = Object.freeze({ obterRota, renderizarRota });
})();
