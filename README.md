# Starr Park Jukebox (Brawl Music Fan Site)

Site estático em português para tocar trilhas de Brawl com visual inspirado em **Starr Park** e navegação para páginas de música + álbuns/eventos.

## Referências de estilo pesquisadas
- Brawl Stars (página oficial): https://supercell.com/en/games/brawlstars/
- Supercell Fan Kit (guideline/brand assets para fã): https://fankit.supercell.com/
- Brawl Stars Sound Archive (referência de organização e foco em áudio): https://sound.brawlarchive.com/

> Observação: este projeto é fan-made e não afiliado à Supercell. Use apenas mídia autorizada.

## Estrutura
- `index.html`: player principal (Starr Park Jukebox)
- `albums.html`: página de álbuns/eventos (Halloween, Lunar, Brawlidays...)
- `styles.css`: tema visual + animações hover/click
- `script.js`: carrega músicas do JSON e renderiza playlist
- `albums.js`: carrega álbuns/eventos do JSON e renderiza filtros
- `data.json`: base central com `tracks` e `albums`

## Como rodar
Como agora o site lê `data.json` via `fetch`, rode com servidor local:

```bash
python -m http.server 5500
```

Depois abra: `http://localhost:5500/`

## Como adicionar suas músicas reais
1. Coloque seus `.mp3/.ogg` em `assets/music/`.
2. Coloque capas em `assets/covers/`.
3. Edite `tracks` no `data.json`.

## Como cadastrar álbuns/eventos
Edite `albums` no `data.json` com `title`, `event`, `year` e `description`.

## O que você pode me mandar para a próxima versão
- Logo/banner Starr Park.
- 5–20 músicas separadas por evento.
- Capas quadradas de cada faixa/evento.
- Imagem de fundo em alta (1920x1080+).
