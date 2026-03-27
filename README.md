# Starr Sound (Brawl-style music player)

Refeito do zero para funcionar como app de música (estilo Spotify/YouTube Music):
- busca em tempo real
- lista completa de faixas
- player fixo com play/pause, anterior, próxima, progresso e volume
- dados carregados por JSON

## Fonte
A interface está preparada para usar **Nougat** como fonte principal de título.
No CSS, `font-family: "Nougat"` já está configurado com fallback.
Se você tiver o arquivo da fonte, adicione localmente e ajuste o `@font-face` em `styles.css`.

## Estrutura
- `index.html`: interface completa do player
- `styles.css`: layout e tema visual
- `script.js`: carregamento do JSON + lógica do player
- `data.json`: músicas e coleções

## Dados em JSON
Edite o `data.json`:
- `tracks`: faixas (`title`, `artist`, `theme`, `event`, `duration`, `file`, `cover`)
- `albums`: cards de destaque/eventos

## Como rodar
Como a aplicação lê JSON via `fetch`, rode com servidor local:

```bash
python -m http.server 5500
```

Depois abra `http://localhost:5500/`.

## Próximos passos que posso fazer
- login fake + playlists do usuário
- fila (queue) arrastável
- mini player + fullscreen player
- visualizador de áudio animado
