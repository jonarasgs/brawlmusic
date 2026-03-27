# Starr Sound (Brawl-style music player)

Projeto web de player musical inspirado em Brawl Stars, pensado para uso público (não só local/pessoal).

## O que foi reforçado para público
- Interface acessível (labels, `aria`, foco por teclado, skip link).
- Mensagens claras de status/erro para carregamento do catálogo.
- Renderização segura (sem injetar HTML direto do JSON nas listas principais).
- Design responsivo para desktop e mobile.

## Paleta aplicada (como você pediu)
- Azul base ("preto" informado): `#3B82F6`
- Vermelho logo: `#FF1118`
- Amarelo logo: `#FBC423`
- Branco: `#FFFFFF`

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

## Observação legal
Este é um projeto de fã. Verifique direitos de uso das músicas/imagens antes de publicar.
