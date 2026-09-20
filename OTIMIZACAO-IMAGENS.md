# Otimização de imagens

## Formatos utilizados

O projeto utiliza a fotografia animal-resgatado em WebP como formato preferencial e em JPEG como alternativa de compatibilidade. O elemento picture permite ao navegador escolher o WebP quando existe suporte e recorrer ao JPEG nos restantes casos.

Os dois ficheiros têm 1536 por 1024 píxeis, proporção 3:2 e não possuem transparência. O JPEG progressivo ocupa 154823 bytes. O WebP com compressão VP8 ocupa 66468 bytes. A diferença é de 88355 bytes, correspondente a uma redução de 57,07 por cento.

## Adaptação ao ecrã

Os atributos width e height presentes no HTML reservam a proporção correta antes da descarga terminar. As classes imagem-principal e imagem-projeto aplicam width de 100 por cento e height auto, evitando deformação. A imagem principal ocupa seis colunas da grelha. A imagem de Projetos ocupa cinco colunas em ecrãs largos e seis até 1024 píxeis. Abaixo de 768 píxeis, ambas ocupam as doze colunas.

O projeto utiliza uma única resolução de 1536 por 1024. O elemento picture escolhe o formato, mas não escolhe uma largura diferente. Assim, ecrãs pequenos continuam a receber o mesmo WebP completo. Uma evolução possível consiste em criar variantes de 480, 768, 1024 e 1536 píxeis e associá-las por srcset e sizes.

## Impacto estimado

Na build de produção, o conjunto local da página Início ocupa 197523 bytes quando se considera o JPEG e 109168 bytes com WebP, uma redução estimada de 44,73 por cento. Na página Projetos, o total passa de 179661 para 91306 bytes, menos 49,18 por cento. O cálculo considera a imagem uma única vez porque o mesmo endereço pode ser reutilizado pela cache.

A poupança de 88355 bytes representa teoricamente cerca de 0,71 segundos de transferência numa ligação de 1 megabit por segundo e cerca de 0,18 segundos numa ligação de 4 megabits por segundo. Estes valores não são um ensaio Lighthouse. O tempo real também depende de latência, cache, protocolo, servidor, dispositivo e processamento do navegador.
