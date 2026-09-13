(() => {
  const instanciasPorCampo = new WeakMap();

  const configuracoesMascaras = Object.freeze([
    Object.freeze({ seletor: "#cpf", opcoes: { mask: "000.000.000-00" } }),
    Object.freeze({
      seletor: "#telefone",
      opcoes: {
        mask: [
          { mask: "(00) 0000-0000" },
          { mask: "(00) 00000-0000" },
        ],
        dispatch(caractereAdicionado, mascaraDinamica) {
          const digitos = `${mascaraDinamica.value}${caractereAdicionado}`.replace(
            /\D/g,
            ""
          );
          return mascaraDinamica.compiledMasks[digitos.length > 10 ? 1 : 0];
        },
      },
    }),
    Object.freeze({ seletor: "#cep", opcoes: { mask: "00000-000" } }),
  ]);

  function iniciarMascaras(raiz = document) {
    if (typeof window.IMask !== "function") {
      return 0;
    }

    let quantidadeIniciada = 0;

    configuracoesMascaras.forEach(({ seletor, opcoes }) => {
      const campo = raiz.querySelector(seletor);
      if (
        !(campo instanceof HTMLInputElement) ||
        instanciasPorCampo.has(campo)
      ) {
        return;
      }

      const instancia = window.IMask(campo, opcoes);
      instanciasPorCampo.set(campo, instancia);
      quantidadeIniciada += 1;
    });

    return quantidadeIniciada;
  }

  document.querySelector("#biblioteca-imask")?.addEventListener("load", () => {
    iniciarMascaras();
  });

  document.addEventListener("novolar:rota-renderizada", () => {
    iniciarMascaras();
  });

  iniciarMascaras();

  window.NovoLarIntegracoes = Object.freeze({ iniciarMascaras });
})();
