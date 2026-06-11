# MERIDIAN — Luxury Watch E-commerce

Protótipos mobile gerados com Google Stitch (projeto `8850175898277378465`).
Cada página é HTML standalone (Tailwind via CDN + Google Fonts) — abre diretamente no browser.

## Como correr

Abre `index.html` (Splash) no browser, ou serve a pasta:

```
npx serve .
```

## Páginas

| Ficheiro | Ecrã |
|---|---|
| `index.html` | Splash — MERIDIAN |
| `resultados-da-pesquisa.html` | Resultados da Pesquisa |
| `lista-de-desejos.html` | Lista de Desejos |
| `guia-de-tamanhos.html` | Guia de Tamanhos |
| `checkout-entrega.html` | Checkout: Entrega |
| `checkout-pagamento.html` | Checkout: Pagamento |
| `checkout-revisao.html` | Checkout: Revisão |
| `encomenda-confirmada.html` | Encomenda Confirmada |
| `as-minhas-encomendas.html` | As Minhas Encomendas |
| `seguir-encomenda.html` | Seguir Encomenda |
| `o-meu-perfil.html` | O Meu Perfil |
| `servico-de-manutencao.html` | Serviço de Manutenção |
| `localizador-de-boutiques.html` | Localizador de Boutiques |

## Assets

- `assets/img/meridian-wordmark.svg` — wordmark da marca
- `assets/img/guia-tamanhos-diagrama.png` — diagrama de tamanhos (36/40/44mm)
- `assets/img/screens/` — screenshots de referência de cada ecrã (gerados pelo Stitch)

## Notas

- Design mobile-first (780px de largura de referência).
- Dependências externas: Tailwind CDN e Google Fonts — requer ligação à internet.
- O ecrã "Design System" do projeto Stitch é um asset stub e não foi exportável via API.
