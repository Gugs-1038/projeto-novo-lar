# Modos de cor e contraste

O Projeto Novo Lar centraliza a paleta em variáveis CSS. O modo claro é o padrão, enquanto os perfis escuro e de alto contraste acompanham as preferências definidas no sistema operativo. A estrutura HTML permanece igual em todos os modos.

## Modo escuro

A regra prefers-color-scheme: dark altera fundos, superfícies, textos, bordas e cores de estado. O fundo principal usa #08110D, o texto principal usa #F4F8F5 e os títulos usam #A7D8BC. O navegador também recebe color-scheme: dark para adaptar controlos nativos.

## Alto contraste e cores forçadas

A regra prefers-contrast: more ativa fundo preto, texto branco, títulos em ciano, foco amarelo e bordas brancas mais espessas. A regra forced-colors: active utiliza as cores semânticas do sistema, como Canvas, CanvasText, LinkText e Highlight.

O foco combina contorno e realce. Mensagens de sucesso e erro apresentam também texto, ícone ou borda, por isso nenhuma informação depende apenas da cor. A cor dos marcadores de posição foi definida de forma explícita.

## Validação

O ficheiro validacao-contraste/verificar-contraste.js aplica a fórmula de luminância relativa da WCAG 2.1 aos pares usados na interface. A verificação exige pelo menos 4,5:1 para texto normal e 3:1 para bordas funcionais ou indicadores visuais.

Para repetir a verificação, execute na raiz do projeto:

    node validacao-contraste/verificar-contraste.js

Foram avaliados 25 pares. Todos foram aprovados. O relatório completo está em validacao-contraste/resultado.txt.
