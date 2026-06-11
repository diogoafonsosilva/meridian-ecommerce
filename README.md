# MERIDIAN — Luxury Watch E-commerce

Protótipo de e-commerce de relojoaria de luxo (marca fictícia MERIDIAN). 15 páginas HTML standalone
(Tailwind via CDN + Google Fonts), interface em português, fluxo de compra completo e clicável.
Base gerada com Google Stitch; navegação, catálogo coerente, PDP e carrinho adicionados depois.

## Como correr

Abre `index.html` (Splash) no browser, ou serve a pasta:

```
npx serve .
```

Em desktop, as páginas apresentam-se num frame de telemóvel centrado (`assets/css/frame.css`).

## Fluxo principal

Splash → Coleção → **Produto** → **Saco** → Entrega → Pagamento → Revisão → Confirmação → Seguir Encomenda

## Páginas

| Ficheiro | Ecrã |
|---|---|
| `index.html` | Splash — MERIDIAN |
| `resultados-da-pesquisa.html` | Coleção / Resultados da Pesquisa |
| `produto.html` | Detalhe do Produto (PDP) — catálogo via `?id=` |
| `carrinho.html` | O Meu Saco |
| `checkout-entrega.html` | Checkout: Entrega (pré-preenchido) |
| `checkout-pagamento.html` | Checkout: Pagamento (pré-preenchido) |
| `checkout-revisao.html` | Checkout: Revisão |
| `encomenda-confirmada.html` | Encomenda Confirmada |
| `seguir-encomenda.html` | Seguir Encomenda |
| `as-minhas-encomendas.html` | As Minhas Encomendas |
| `lista-de-desejos.html` | Lista de Desejos |
| `guia-de-tamanhos.html` | Guia de Tamanhos |
| `o-meu-perfil.html` | O Meu Perfil |
| `servico-de-manutencao.html` | Serviço de Manutenção |
| `localizador-de-boutiques.html` | Localizador de Boutiques |

## Catálogo

| Modelo | Ref. | Preço |
|---|---|---|
| MERIDIAN Nautilus 40 | MN-4001 | €24.500,00 |
| MERIDIAN Calatrava 36 | MC-3602 | €18.900,00 |
| MERIDIAN Aquanaut 44 | MA-4403 | €21.300,00 |
| MERIDIAN Grand Régulateur | GR-4004 | €36.700,00 |

PDP: `produto.html?id=nautilus-40 | calatrava-36 | aquanaut-44 | regulateur-40`

## Arquitetura

- **Navegação:** `assets/js/nav.js` — binding por texto do botão e por ícone (Material Symbols),
  já que o HTML exportado pelo Stitch não traz hrefs. Auditoria de cliques: `node docs/audit-cliques.js`.
- **Frame desktop:** `assets/css/frame.css` — frame de telemóvel centrado em ecrãs ≥900px.
- **Assets:** `assets/img/meridian-wordmark.svg`, `assets/img/guia-tamanhos-diagrama.png`,
  screenshots de referência em `assets/img/screens/`.
- **Plano de implementação:** `docs/superpowers/plans/2026-06-11-p0-p1-fluxo-completo.md` · Roadmap: `ROADMAP.md`.

## Notas

- Mobile-first; requer internet (Tailwind CDN + fonts + imagens hospedadas).
- Marca e produtos 100% fictícios.
- Em produção evoluiria para Next.js + Stripe; este protótipo é estático por design.
