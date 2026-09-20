# Acessibilidade semântica e WAI-ARIA

O Projeto Novo Lar combina HTML semântico, componentes nativos, estados WAI-ARIA e gestão de foco. Os atributos ARIA complementam a marcação somente quando o HTML nativo não comunica sozinho o estado ou a atualização da interface.

## Landmarks estruturais

As páginas usam header, nav, main, aside e footer para identificar as principais áreas. As secções de conteúdo são organizadas com section e títulos h1 ou h2. aria-labelledby relaciona cada bloco relevante com o respetivo título.

## Navegação

A navegação principal possui aria-label. aria-current identifica o link da rota ativa e é atualizado pelo JavaScript sempre que o conteúdo da SPA muda.

Os controlos do menu são elementos button. aria-expanded informa se cada menu está aberto, aria-controls indica o conteúdo controlado e aria-label muda entre as ações de abrir e fechar.

## Formulário

Cada campo possui label associado. fieldset e legend agrupam dados pessoais, contacto e endereço. As mensagens específicas recebem aria-live polite e são associadas ao campo por aria-describedby. aria-invalid é atualizado durante a validação.

## Mensagens dinâmicas

O alerta geral do formulário utiliza role alert. A mudança de rota e o toast de confirmação usam role status, aria-live polite e aria-atomic true. Essas regiões comunicam atualizações sem deslocar o foco de forma desnecessária.

## Gestão de foco e teclado

A ligação para saltar ao conteúdo permite ignorar a navegação repetida. Após uma mudança de rota, o título do novo conteúdo recebe tabindex negativo e foco temporário. A tecla Escape fecha os menus e devolve o foco ao controlo apropriado.

Links, botões e campos seguem a ordem natural do DOM, sem tabindex positivo. Tab e Shift Tab percorrem os elementos interativos na mesma sequência em que aparecem visualmente. O CSS aplica focus-visible com contorno, espaçamento e sombra de alto contraste.

Quando o formulário contém erros, o foco vai para o primeiro campo inválido. O resumo é anunciado por role alert e cada orientação fica associada ao campo. O toast e as mudanças de rota usam regiões de estado para comunicar atualizações sem deslocar o foco.

## Imagens e elementos decorativos

As imagens relevantes possuem alt descritivo. Corações, setas e ícones meramente visuais recebem aria-hidden true, evitando anúncios sem valor informativo para leitores de ecrã.

## Perfis de cor e contraste

As cores ficam centralizadas em variáveis CSS. O modo escuro acompanha prefers-color-scheme: dark, o perfil de alto contraste acompanha prefers-contrast: more e o modo de cores forçadas utiliza as cores semânticas do sistema operativo.

Textos normais alcançam pelo menos 4,5:1. Bordas funcionais e indicadores visuais superam 3:1. O foco combina contorno e realce, e as mensagens apresentam texto, ícone ou borda para não depender apenas da cor. Os 25 pares avaliados e a forma de repetir o teste estão documentados em CONTRASTE.md.

## Limites da implementação

O projeto não possui modal, dialog ou aria-modal. Esses recursos não são citados como implementados. A documentação descreve somente elementos confirmados nos ficheiros HTML e JavaScript.
