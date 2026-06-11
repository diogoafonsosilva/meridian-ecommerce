# ROADMAP — MERIDIAN Luxury Watch E-commerce (peça de portfólio)

> Afinado com value-prop-sharpening. O produto não é uma loja — é uma **prova de competência
> com 60–90 segundos de atenção de um recrutador/cliente**. Tudo o que não serve esse loop foi cortado.

**O job:** "Quando avalio um candidato, quero provas rápidas de que ele constrói UX premium,
para decidir se o contacto."

**O loop do viewer:**
abre o link → impacto visual (5s) → clica 3–5 ecrãs sem becos → sinal de profundidade → veredicto → contacto

**Métrica norte:** viewers que completam o fluxo impressionados.
Inputs: zero cliques mortos · impacto imediato · 1 sinal de profundidade técnica · funciona em **desktop**
(é onde o recrutador abre).

---

## P0 — Sem isto a peça não existe

- [ ] **Deploy** (GitHub Pages/Netlify — é estático, deploy imediato). Sem link público, nada é visto.
- [ ] **Apresentação desktop** — o recrutador abre em desktop e hoje vê um layout mobile de 780px esticado.
  Solução barata: wrapper com frame de telemóvel centrado em fundo de marca (charcoal + dourado),
  em vez de redesenhar 13 ecrãs responsive. Horas, não dias.
- [ ] **Matar todos os cliques mortos** — cada botão-beco quebra o loop e o veredicto:
  - "View Details" → exige a **PDP** (ver abaixo)
  - "Returns Policy" / "GDPR Settings" → **remover os links** (não construir as páginas)
  - "Agendar Serviço" / "Agendar Consultoria" / "Alterar Entrega" → ligar a destino existente ou remover

## P1 — O fluxo fica completo e coerente

- [ ] **Página de Produto (PDP)** — o ecrã que falta no funil e o destino dos "View Details".
  Galeria, specs (movimento, caixa, bracelete), preço, "Add to Bag", link ao Guia de Tamanhos.
  Um só template com os dados trocados por produto chega.
- [ ] **Carrinho** — entre "Add to Bag" e o checkout. Itens, subtotal, "Proceed to Checkout".
- [ ] **Unificar idioma** — PT em tudo (nomes de produto em EN). "Continue to Payment" → "Continuar para
  Pagamento", "Track Order" → "Seguir Encomenda", etc. É o erro que um avaliador atento apanha primeiro.
- [ ] **Os mesmos 4–6 relógios em todo o lado** — pesquisa, PDP, wishlist, carrinho, checkout, encomendas.
  Hardcodar consistente chega; não precisa de fonte de dados central.
- [ ] **Checkout pré-preenchido** — dados demo nos formulários para o viewer clicar através do fluxo
  sem digitar nada. (Validação de formulários: cortado — ninguém preenche formulários numa demo.)

## P2 — O sinal de profundidade ("uau" técnico)

- [ ] **Carrinho vivo com localStorage** — adicionar produto → badge no saco atualiza → persiste entre
  páginas. É o que distingue "protótipo clicável" de "app viva" para quem inspeciona.
- [ ] **Wishlist toggle persistente** — coração liga/desliga e reflete na página da wishlist.
- [ ] **Fio condutor no checkout** — número de encomenda gerado na confirmação aparece em "Seguir Encomenda".
- [ ] **Transições de página** — o fade do splash aplicado a todas as navegações. Barato, muito visível.

## P3 — Distribuição (como a peça circula)

- [ ] **Case study no README** — problema → processo (Stitch → navegação → interatividade) → decisões
  de design (paleta dourado/charcoal, Libre Caslon + Hanken Grotesk) → resultado. É o que o recrutador
  lê quando o GitHub é a porta de entrada.
- [ ] **Vídeo de 30–60s** do fluxo completo (splash → PDP → carrinho → checkout → confirmação) —
  é assim que o trabalho circula no LinkedIn sem ninguém clicar no link.
- [ ] **Screenshots em frames de iPhone** para o portfólio.

---

## Cortado (e porquê)

| Item | Razão do corte |
|---|---|
| Login / Criar Conta | Recrutador nunca cria conta; ecrã-beco que só adiciona superfície |
| Páginas legais (Returns/GDPR) | Remover os links resolve; ninguém lê políticas numa demo |
| Validação de formulários | Ninguém preenche formulários — pré-preencher é a solução certa |
| Homepage | O splash já é uma entrada forte e distintiva; homepage genérica diluía |
| Estados vazios | Invisíveis numa demo guiada |
| Filtros/ordenação reais | Custo alto, ninguém testa filtros em 90 segundos |
| Refactor do Tailwind config | Invisível para o viewer; só se o código for o objeto de avaliação |
| Desktop responsive completo | Substituído pelo frame de telemóvel (P0) — 13 ecrãs responsive não cabem no orçamento de valor |

Se algum destes voltar a parecer necessário, a pergunta de controlo é:
**"um recrutador com 90 segundos vê isto?"** Se não, não entra.

## Fora de âmbito

Backend, pagamentos reais, stock, autenticação, CMS. Resposta preparada para entrevista:
"arquitetura pronta a evoluir para Next.js + Stripe" (referido no case study).
