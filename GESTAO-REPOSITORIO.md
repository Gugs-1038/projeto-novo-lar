# Gestão do repositório

O Projeto Novo Lar foi inicialmente desenvolvido num repositório local e depois publicado em https://github.com/Gugs-1038/projeto-novo-lar. Como as tarefas foram concluídas antes da ligação ao GitHub, ainda não existem objetos online de issue, milestone ou pull request para essas etapas.

Para manter a rastreabilidade sem criar informações fictícias, as tarefas abaixo foram registradas de forma retrospectiva. As branches e os commits de merge existentes representam o fluxo técnico que seria formalizado por pull requests em uma plataforma colaborativa.

## Issues retrospectivas

### Documentar a estratégia GitFlow

Registra a tarefa concluída na branch feature/documentacao-gitflow. O commit 6063428 criou o arquivo FLUXO-GIT.md e explicou o papel de main, develop, feature, release e hotfix.

### Organizar commits e releases

Registra a padronização das mensagens de commit e a explicação do versionamento semântico. O trabalho foi realizado na branch feature/registro-commits-releases e integrado à develop.

## Milestone retrospectiva

### Primeira entrega estável v1.0.0

Representa o fechamento da primeira versão estável. A branch release/1.0.0 preparou o CHANGELOG, foi integrada em main e develop e originou a tag v1.0.0.

## Pull requests equivalentes

### Integrar documentação do GitFlow em develop

Representa a revisão da branch feature/documentacao-gitflow antes da integração. O merge 1d6ae3f incorporou a documentação na develop sem alterar diretamente a branch permanente durante a implementação.

### Integrar registro de commits e releases em develop

Representa a revisão da branch feature/registro-commits-releases antes da integração. O merge cec41d0 incorporou à develop as regras de commits e versionamento.

Estes registos podem ser convertidos em issues, milestone e pull requests reais no GitHub, preservando os mesmos títulos, descrições e vínculos com as branches. Até essa conversão, devem ser apresentados como registos retrospectivos e não como objetos online já existentes.
