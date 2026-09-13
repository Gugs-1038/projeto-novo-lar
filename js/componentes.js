(() => {
  const dadosAcoes = [
    {
      id: "voluntariado",
      categoria: "Voluntariado",
      badges: [
        { texto: "Voluntariado", classe: "" },
        { texto: "Inscrições abertas", classe: "badge-sucesso" },
      ],
      titulo: "Doe seu tempo",
      descricao:
        "Os voluntários podem ajudar em campanhas, eventos de adoção, divulgação e cuidados com os animais.",
      itens: [
        "Apoio em eventos de adoção;",
        "Organização de doações;",
        "Divulgação das campanhas.",
      ],
      acao: {
        texto: "Fazer cadastro",
        href: "cadastro.html",
        rota: "/cadastro",
        classes: [],
      },
    },
    {
      id: "doacoes",
      categoria: "Doações",
      badges: [
        { texto: "Doações", classe: "" },
        { texto: "Campanha contínua", classe: "badge-atencao" },
      ],
      titulo: "Contribua com materiais",
      descricao:
        "As doações ajudam a manter o atendimento e podem ser realizadas de acordo com a necessidade do projeto.",
      itens: [
        "Ração para cães e gatos;",
        "Medicamentos veterinários;",
        "Produtos de limpeza e higiene.",
      ],
      acao: {
        texto: "Entrar em contato",
        href:
          "mailto:contato@exemplo.org?subject=Quero%20fazer%20uma%20doação",
        classes: ["botao-secundario"],
      },
    },
  ];

  function obterCampo(fragmento, nome) {
    const campo = fragmento.querySelector(`[data-campo="${nome}"]`);

    if (!(campo instanceof HTMLElement)) {
      throw new Error(`O campo ${nome} não foi encontrado no modelo do cartão.`);
    }

    return campo;
  }

  function criarCartao(dados, modelo) {
    const fragmento = modelo.content.cloneNode(true);
    const cartao = fragmento.querySelector(".cartao");

    if (!(cartao instanceof HTMLElement)) {
      throw new Error("A estrutura do cartão não foi encontrada no template.");
    }

    const titulo = obterCampo(fragmento, "titulo");
    const tituloId = `${dados.id}-titulo`;

    cartao.id = dados.id;
    cartao.setAttribute("aria-labelledby", tituloId);
    titulo.id = tituloId;

    obterCampo(fragmento, "categoria").textContent = dados.categoria;
    titulo.textContent = dados.titulo;
    obterCampo(fragmento, "descricao").textContent = dados.descricao;

    const grupoBadges = obterCampo(fragmento, "badges");
    grupoBadges.replaceChildren();
    dados.badges.forEach((dadosBadge) => {
      const badge = document.createElement("span");
      badge.classList.add("badge");

      if (dadosBadge.classe) {
        badge.classList.add(dadosBadge.classe);
      }

      badge.textContent = dadosBadge.texto;
      grupoBadges.append(badge);
    });

    const lista = obterCampo(fragmento, "itens");
    lista.replaceChildren();
    dados.itens.forEach((item) => {
      const elementoLista = document.createElement("li");
      elementoLista.textContent = item;
      lista.append(elementoLista);
    });

    const link = obterCampo(fragmento, "acao");
    link.textContent = dados.acao.texto;
    link.setAttribute("href", dados.acao.href);
    dados.acao.classes.forEach((classe) => link.classList.add(classe));

    if (dados.acao.rota) {
      link.dataset.rota = dados.acao.rota;
    }

    return fragmento;
  }

  function renderizarCartoesAjuda(raiz = document) {
    const lista = raiz.querySelector("[data-lista-ajuda]");
    const modelo = document.querySelector("#modelo-cartao-ajuda");

    if (
      !(lista instanceof HTMLElement) ||
      !(modelo instanceof HTMLTemplateElement)
    ) {
      return false;
    }

    const lote = document.createDocumentFragment();

    dadosAcoes.forEach((dados) => {
      lote.append(criarCartao(dados, modelo));
    });

    lista.replaceChildren(lote);
    return true;
  }

  window.NovoLarComponentes = Object.freeze({ renderizarCartoesAjuda });
})();
