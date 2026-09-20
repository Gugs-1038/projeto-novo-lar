# Projeto Novo Lar

Projeto acadêmico de uma organização fictícia dedicada à proteção animal. A aplicação apresenta ações de resgate, adoção, voluntariado e doações, além de um formulário demonstrativo para pessoas interessadas em colaborar.

## Apresentação do projeto

O site funciona como uma Single Page Application estática. A navegação principal troca o conteúdo pelo DOM sem recarregar o documento inteiro, mas conserva páginas HTML independentes como alternativa caso o JavaScript não seja executado.

## Funcionalidades principais

- Rotas por hash para Início, Projetos e Cadastro.
- Menu responsivo com submenu operável por teclado.
- Cartões criados a partir de um template HTML reutilizável.
- Formulário com validação em tempo real e mensagens acessíveis.
- Máscaras opcionais para CPF, telefone e CEP.
- Histórico curto de navegação no localStorage.
- Alertas, badges e toast para orientar cada interação.

## Tecnologias utilizadas

- HTML5 para estrutura semântica e templates.
- CSS3 para apresentação, responsividade, estados visuais e modos de cor adaptáveis.
- JavaScript puro para SPA, DOM, eventos, validação e persistência.
- Web Storage para guardar somente o histórico recente de rotas.
- IMask 7.6.1 por CDN para auxiliar a digitação de campos formatados.
- esbuild 0.25.11 para gerar bundles e minificar CSS e JavaScript.
- html-minifier-terser 7.2.0 para minificar as páginas HTML de produção.

Não foram usados framework, banco de dados ou back end. A aplicação continua escrita em JavaScript puro, e o empacotamento é aplicado somente na build de produção. Se a biblioteca externa não carregar, a validação local continua funcionando.

## Estrutura do projeto

- html: páginas da aplicação e alternativas estáticas.
- css: estilos gerais e regras responsivas.
- js: scripts separados por responsabilidade.
- imagens: versões JPG e WebP da imagem principal.
- capturas: evidências visuais dos componentes.
- validacao-w3c: resultados da validação dos documentos HTML.
- validacao-contraste: verificador local e relatório dos rácios de contraste.
- dist: versão de produção minificada, pronta para publicação.
- scripts: automação da build e verificação dos ficheiros gerados.
- FLUXO-GIT.md: política de branches, commits e versões.
- GESTAO-REPOSITORIO.md: tarefas e integrações documentadas.
- ACESSIBILIDADE.md: landmarks, estados WAI-ARIA e estratégias de foco.
- CONTRASTE.md: perfis claro, escuro, alto contraste e cores forçadas.
- OTIMIZACAO-IMAGENS.md: formatos, dimensões, responsividade e impacto estimado das imagens.
- DEPLOY.md: configuração e ativação da publicação no GitHub Pages.
- CODIGO-FONTE-FINAL.txt: código essencial consolidado para o campo de entrega.
- respostas-para-plataforma.txt: textos de apoio para a entrega acadêmica.

## Pré requisitos

- Navegador atualizado com suporte a JavaScript e localStorage.
- Node.js 20 ou superior para gerar a versão de produção.
- npm para instalar as dependências da build.
- Conexão com a internet na primeira instalação das dependências da build.
- Durante o uso da aplicação, a conexão serve apenas para carregar a IMask e permanece opcional.
- Python 3 é opcional caso seja usado um servidor local.

## Execução local

Extraia o projeto sem alterar a estrutura das pastas. Para a forma mais simples, abra html/index.html diretamente no navegador.

Também é possível iniciar um servidor local na raiz do projeto:

    py -m http.server 8000

Se o comando py não estiver disponível:

    python -m http.server 8000

Depois, acesse:

    http://localhost:8000/html/index.html

## Build e testes

Os ficheiros fonte continuam legíveis em html, css e js. Para criar a versão de produção, instale as dependências e execute:

    npm ci
    npm run build

A build gera a pasta dist. O esbuild reúne os scripts de cada página e minifica CSS e JavaScript. O html-minifier-terser minifica os três documentos HTML. As imagens são copiadas sem alteração. O relatório normaliza os finais de linha dos textos para que a medição seja igual em diferentes sistemas operativos e apresenta tanto a redução dos ficheiros únicos como a redução agregada por carregamento de página.

Depois da build, faça a verificação estrutural e a validação de contraste:

    npm run test:build

    node validacao-contraste/verificar-contraste.js

A verificação manual inclui navegação entre rotas, botões Voltar e Avançar, menu responsivo, formulário válido e inválido, restauração da última rota e funcionamento sem a CDN. Os resultados do Nu Html Checker estão em validacao-w3c/resultado.txt e os resultados cromáticos em validacao-contraste/resultado.txt.

## Publicação

O workflow .github/workflows/deploy-pages.yml publica automaticamente no GitHub Pages após alterações integradas na branch main. A rotina instala as dependências, cria a build, executa as verificações e publica a pasta dist. A entrada dist/index.html encaminha a raiz do endereço para a aplicação sem perder a pesquisa ou a rota por hash.

O repositório público está em https://github.com/Gugs-1038/projeto-novo-lar e a aplicação publicada está em https://gugs-1038.github.io/projeto-novo-lar/. O procedimento completo está em DEPLOY.md.

Para atualizar o ficheiro consolidado destinado ao campo de código fonte da plataforma, execute:

    npm run codigo:final

## Acessibilidade e privacidade

A interface utiliza estrutura semântica, foco visível, navegação por teclado, mensagens com aria-live, rótulos associados aos campos, redução de movimentos, modo escuro, alto contraste e cores forçadas quando solicitados pelo sistema. Nenhum dado pessoal do formulário é salvo no localStorage ou enviado a um servidor.

Os detalhes dos landmarks e dos estados WAI-ARIA estão documentados em ACESSIBILIDADE.md. A estratégia cromática e os rácios verificados estão em CONTRASTE.md.

## Versionamento e colaboração

O histórico segue um fluxo inspirado no GitFlow, com main para versões estáveis e develop para integração. As mudanças são feitas em branches de apoio e registradas com mensagens padronizadas. A tag v1.0.0 identifica a primeira entrega estável.

Mais detalhes estão em FLUXO-GIT.md, CHANGELOG.md e GESTAO-REPOSITORIO.md.

## Limitações atuais

O formulário é apenas demonstrativo e não envia dados. A persistência guarda somente rotas recentes. A integração com IMask depende de uma CDN, mas possui alternativa funcional quando a conexão falha.
