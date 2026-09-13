# Fluxo Git do Projeto Novo Lar

O GitFlow foi adotado a partir da etapa de versionamento do projeto.

## Branches permanentes

- main: contém somente versões estáveis e prontas para entrega.
- develop: reúne o desenvolvimento contínuo e as funcionalidades já revisadas.

## Branches de apoio

- feature/documentacao-gitflow: criada a partir de develop para documentar o fluxo sem alterar diretamente as branches permanentes.
- release/1.0.0: criada a partir de develop para preparar e conferir a primeira versão estável.
- hotfix: será criada a partir de main somente quando existir uma falha urgente em uma versão publicada.

## Caminho das alterações

Uma nova funcionalidade nasce em uma branch feature criada a partir de develop. Depois da revisão, ela retorna para develop por um merge explícito. Quando o conjunto está pronto, uma branch release recebe os ajustes finais e é integrada em main e develop. A versão publicada em main recebe uma tag.

Branches de hotfix não são criadas preventivamente. Quando necessárias, partem de main e retornam tanto para main quanto para develop após a validação da correção.

## Commits e versões

As mensagens utilizam a estrutura tipo: descrição. Os tipos chore e docs identificam, respectivamente, tarefas estruturais e mudanças de documentação. Mensagens de merge e release registram movimentos administrativos do GitFlow.

A tag v1.0.0 identifica a primeira entrega estável. O projeto adota MAJOR.MINOR.PATCH: mudanças incompatíveis elevam MAJOR, novas funcionalidades compatíveis elevam MINOR e correções compatíveis elevam PATCH.
