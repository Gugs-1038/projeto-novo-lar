(() => {
  const chaveArmazenamento = "projeto-novo-lar:navegacao:v1";
  const versaoAtual = 1;
  const limiteHistorico = 8;
  const rotasPermitidas = new Set([
    "/inicio",
    "/projetos",
    "/projetos/resgate",
    "/projetos/voluntariado",
    "/projetos/doacoes",
    "/projetos/como-ajudar",
    "/cadastro",
  ]);

  function criarEstadoInicial() {
    return {
      versao: versaoAtual,
      ultimaRota: "/inicio",
      historico: [],
    };
  }

  function entradaHistoricoValida(entrada) {
    return (
      entrada !== null &&
      typeof entrada === "object" &&
      rotasPermitidas.has(entrada.rota) &&
      typeof entrada.acessadaEm === "string" &&
      Number.isFinite(Date.parse(entrada.acessadaEm))
    );
  }

  function limparArmazenamentoCorrompido() {
    try {
      window.localStorage.removeItem(chaveArmazenamento);
    } catch {
      // A aplicação continua funcionando mesmo se o armazenamento estiver bloqueado.
    }
  }

  function obterEstado() {
    try {
      const textoSalvo = window.localStorage.getItem(chaveArmazenamento);
      if (!textoSalvo) {
        return criarEstadoInicial();
      }

      const dados = JSON.parse(textoSalvo);
      if (
        dados === null ||
        typeof dados !== "object" ||
        dados.versao !== versaoAtual ||
        !rotasPermitidas.has(dados.ultimaRota) ||
        !Array.isArray(dados.historico)
      ) {
        limparArmazenamentoCorrompido();
        return criarEstadoInicial();
      }

      return {
        versao: versaoAtual,
        ultimaRota: dados.ultimaRota,
        historico: dados.historico
          .filter(entradaHistoricoValida)
          .slice(-limiteHistorico),
      };
    } catch {
      limparArmazenamentoCorrompido();
      return criarEstadoInicial();
    }
  }

  function salvarEstado(estado) {
    try {
      const textoParaSalvar = JSON.stringify(estado);
      window.localStorage.setItem(chaveArmazenamento, textoParaSalvar);
      return true;
    } catch {
      return false;
    }
  }

  function registrarRota(rota) {
    if (!rotasPermitidas.has(rota)) {
      return false;
    }

    const estadoAtual = obterEstado();
    const novaEntrada = {
      rota,
      acessadaEm: new Date().toISOString(),
    };
    const historico = [...estadoAtual.historico];
    const ultimaEntrada = historico[historico.length - 1];

    if (ultimaEntrada?.rota === rota) {
      historico[historico.length - 1] = novaEntrada;
    } else {
      historico.push(novaEntrada);
    }

    return salvarEstado({
      versao: versaoAtual,
      ultimaRota: rota,
      historico: historico.slice(-limiteHistorico),
    });
  }

  function obterUltimaRota() {
    return obterEstado().ultimaRota;
  }

  window.NovoLarPersistencia = Object.freeze({
    obterEstado,
    obterUltimaRota,
    registrarRota,
  });
})();
