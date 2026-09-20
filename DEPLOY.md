# Publicação no GitHub Pages

## Estado atual

O projeto possui uma build de produção, uma entrada na raiz de dist e um workflow de integração e entrega contínuas em .github/workflows/deploy-pages.yml. O remote origin aponta para https://github.com/Gugs-1038/projeto-novo-lar e a publicação está ativa em https://gugs-1038.github.io/projeto-novo-lar/.

## Plataforma escolhida

O GitHub Pages foi escolhido porque o Projeto Novo Lar é uma aplicação estática, sem servidor, base de dados ou processamento no back end. A plataforma fornece HTTPS, distribuição dos ficheiros estáticos e integração direta com o histórico do repositório e com GitHub Actions.

## Fluxo automatizado

O workflow é acionado por push na branch main ou manualmente. A rotina executa estas etapas:

1. Obtém o código versionado.
2. Configura Node.js 24 e a cache do npm.
3. Instala as versões exatas do package-lock.json com npm ci.
4. Gera a pasta dist com npm run build.
5. Executa npm run test:build e npm run test:contraste.
6. Configura o GitHub Pages e envia dist como artefacto.
7. Publica apenas quando a build e todos os testes terminam com sucesso.

As permissões do workflow são contents read, pages write e id-token write. A autenticação usa o GITHUB_TOKEN temporário fornecido pelo GitHub e não guarda credenciais no código.

## Configuração aplicada no GitHub

1. O repositório público projeto-novo-lar foi criado na conta Gugs-1038.
2. O remote origin foi configurado e as branches GitFlow e tags foram enviadas.
3. A versão 1.1.1 foi integrada em main e marcada com a tag v1.1.1.
4. O GitHub Pages foi configurado para usar GitHub Actions como fonte.
5. O workflow concluiu a build, os testes, o envio do artefacto e o deploy com sucesso.
6. O endereço público foi verificado com HTTPS, navegação SPA, imagens e validação do formulário.
