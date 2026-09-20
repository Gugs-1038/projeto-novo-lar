# Publicação no GitHub Pages

## Estado atual

O projeto possui uma build de produção, uma entrada na raiz de dist e um workflow de integração e entrega contínuas em .github/workflows/deploy-pages.yml. O repositório local ainda não possui um remote GitHub configurado. Por esse motivo, não existe um endereço público que possa ser confirmado neste momento.

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

## Ativação no GitHub

Depois de criar o repositório remoto:

1. Adicione o remote origin ao repositório local.
2. Envie as branches main e develop e as tags.
3. Integre a versão aprovada de develop em main conforme o fluxo documentado.
4. No GitHub, abra Settings, Pages e Build and deployment.
5. Em Source, selecione GitHub Actions.
6. Acompanhe a execução na secção Actions e consulte o endereço apresentado no ambiente github-pages.

Até estes passos externos serem concluídos, a configuração permanece preparada e testada localmente, mas o site não deve ser descrito como publicado.
