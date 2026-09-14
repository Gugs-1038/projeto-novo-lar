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
- CSS3 para apresentação, responsividade e estados visuais.
- JavaScript puro para SPA, DOM, eventos, validação e persistência.
- Web Storage para guardar somente o histórico recente de rotas.
- IMask 7.6.1 por CDN para auxiliar a digitação de campos formatados.

Não foram usados framework, empacotador, banco de dados ou back end. Se a biblioteca externa não carregar, a validação local continua funcionando.

## Estrutura do projeto

- html: páginas da aplicação e alternativas estáticas.
- css: estilos gerais e regras responsivas.
- js: scripts separados por responsabilidade.
- imagens: versões JPG e WebP da imagem principal.
- capturas: evidências visuais dos componentes.
- validacao-w3c: resultados da validação dos documentos HTML.
- FLUXO-GIT.md: política de branches, commits e versões.
- GESTAO-REPOSITORIO.md: tarefas e integrações documentadas.
- ACESSIBILIDADE.md: landmarks, estados WAI-ARIA e estratégias de foco.
- respostas-para-plataforma.txt: textos de apoio para a entrega acadêmica.

## Pré requisitos

- Navegador atualizado com suporte a JavaScript e localStorage.
- Nenhuma instalação de pacote é obrigatória.
- Conexão com a internet é opcional e serve apenas para carregar a IMask.
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

O projeto não possui etapa de build, pois HTML, CSS e JavaScript são executados diretamente. Também não existe uma suíte automatizada ou um comando de teste neste estágio.

A verificação manual inclui navegação entre rotas, botões Voltar e Avançar, menu responsivo, formulário válido e inválido, restauração da última rota e funcionamento sem a CDN. Os resultados do Nu Html Checker estão em validacao-w3c/resultado.txt.

## Acessibilidade e privacidade

A interface utiliza estrutura semântica, foco visível, navegação por teclado, mensagens com aria-live, rótulos associados aos campos e redução de movimentos quando solicitada pelo sistema. Nenhum dado pessoal do formulário é salvo no localStorage ou enviado a um servidor.

Os detalhes dos landmarks e dos estados WAI-ARIA estão documentados em ACESSIBILIDADE.md.

## Versionamento e colaboração

O histórico segue um fluxo inspirado no GitFlow, com main para versões estáveis e develop para integração. As mudanças são feitas em branches de apoio e registradas com mensagens padronizadas. A tag v1.0.0 identifica a primeira entrega estável.

Mais detalhes estão em FLUXO-GIT.md, CHANGELOG.md e GESTAO-REPOSITORIO.md.

## Limitações atuais

O formulário é apenas demonstrativo e não envia dados. A persistência guarda somente rotas recentes. A integração com IMask depende de uma CDN, mas possui alternativa funcional quando a conexão falha.
