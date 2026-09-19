# Histórico de versões

## Em desenvolvimento

### Acessibilidade visual

- Modo escuro automático conforme a preferência do sistema operativo.
- Perfil de alto contraste e suporte a cores forçadas.
- Bordas funcionais, marcadores de posição e estados de foco reforçados.
- Verificação automatizada de 25 pares cromáticos segundo a fórmula WCAG 2.1.

### Build de produção

- Build com esbuild e html-minifier-terser para CSS, JavaScript e HTML.
- Pasta dist com bundles por página, imagens copiadas e relatório de tamanho.
- Verificação automatizada das referências da versão de produção.

## 1.0.0

Primeira versão estável do Projeto Novo Lar.

### Funcionalidades

- Navegação SPA com rotas por hash e alternativas estáticas.
- Menu responsivo e submenu acessível.
- Cartões dinâmicos criados a partir de dados e template HTML.
- Formulário com validação em tempo real e mensagens acessíveis.
- Persistência restrita ao histórico de navegação no localStorage.
- Máscaras de CPF, telefone e CEP com fallback para falha da CDN.
- JavaScript separado por responsabilidades e protegido por IIFEs.

### Verificações

- Documentos HTML aprovados pelo Nu Html Checker sem erros ou avisos.
- Testes de estrutura, design, SPA, formulário, persistência, integração externa e modularidade aprovados.
- Nenhum dado pessoal do formulário é enviado ou armazenado.
