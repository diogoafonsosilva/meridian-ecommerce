# MERIDIAN P0+P1 — Fluxo Completo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar o protótipo MERIDIAN num fluxo de e-commerce completo, coerente e publicável — zero cliques mortos, PDP + carrinho, idioma PT unificado, dados de produto consistentes, apresentável em desktop.

**Architecture:** HTML estático standalone (Tailwind CDN + Google Fonts), navegação via `assets/js/nav.js` (binding por texto/ícone). Páginas novas (PDP, carrinho) copiam o `<head>` de páginas existentes para herdar o design system. Frame de telemóvel em desktop via CSS partilhado, sem redesenhar layouts.

**Tech Stack:** HTML/CSS/JS vanilla, Tailwind CDN, Material Symbols, Node (scripts de substituição), git + GitHub Pages.

**Working dir:** `C:\Users\diogo\Documents\Documentos Diogo\LinkedIn\IEFP\IEFP 2026\web-designs-main\Meridian E-commerce` (todos os caminhos abaixo são relativos a esta pasta).

---

## Catálogo canónico (referência para todas as tasks)

A marca é MERIDIAN — **nunca** "Patek Philippe" (marca registada; existe hoje nas páginas e tem de sair).

| ID | Nome | Ref. | Preço | Coleção |
|---|---|---|---|---|
| `nautilus-40` | MERIDIAN Nautilus 40 | MN-4001 | €24.500,00 | Nautilus |
| `calatrava-36` | MERIDIAN Calatrava 36 | MC-3602 | €18.900,00 | Calatrava |
| `aquanaut-44` | MERIDIAN Aquanaut 44 | MA-4403 | €21.300,00 | Aquanaut |
| `regulateur-40` | MERIDIAN Grand Régulateur | GR-4004 | €36.700,00 | Heritage |

Cadeia de checkout (1 item, Nautilus 40): subtotal **€24.500,00** · envio **Oferta (€0,00)** · IVA incluído · total **€24.500,00**. Formato de preço: `€24.500,00` (PT: ponto milhares, vírgula decimais).

---

### Task 1: Git init + baseline

**Files:** nenhum (só git)

- [ ] **Step 1:** `git init && git add -A && git commit -m "baseline: 13 ecrãs Stitch + nav.js + roadmap"`
- [ ] **Step 2:** Verificar: `git log --oneline` → 1 commit.

### Task 2: Remover links mortos do rodapé

"Returns Policy" e "GDPR Settings" aparecem no rodapé de 12 páginas e não têm destino. Remover (não construir páginas).

**Files:** Modify: todos os `*.html` exceto `index.html`

- [ ] **Step 1:** Remover as âncoras com script:

```bash
node -e "
const fs=require('fs');
for(const f of fs.readdirSync('.').filter(x=>x.endsWith('.html'))){
  let h=fs.readFileSync(f,'utf8');
  const before=h.length;
  h=h.replace(/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*?(Returns Policy|GDPR Settings)[\s\S]*?<\/a>/g,'');
  if(h.length!==before){fs.writeFileSync(f,h);console.log('limpo',f);}
}"
```

- [ ] **Step 2:** Verificar: `grep -l "Returns Policy\|GDPR" *.html` → sem resultados.
- [ ] **Step 3:** Abrir `o-meu-perfil.html` no browser e confirmar que o rodapé não ficou visualmente partido (se o rodapé usar grid de 4 colunas, ajustar para 2).
- [ ] **Step 4:** `git add -A && git commit -m "fix: remover links mortos Returns/GDPR do rodapé"`

### Task 3: Frame de telemóvel em desktop

Em ecrãs largos, mostrar a página dentro de um frame centrado em fundo de marca, em vez de layout mobile esticado.

**Files:** Create: `assets/css/frame.css` · Modify: todos os `*.html`

- [ ] **Step 1:** Criar `assets/css/frame.css`:

```css
/* Em desktop, apresenta o ecrã mobile num frame centrado. */
@media (min-width: 900px) {
  html {
    background:
      radial-gradient(ellipse at 50% 0%, rgba(243, 175, 0, 0.06), transparent 60%),
      #0b0e10;
    min-height: 100vh;
  }
  body {
    max-width: 430px;
    margin: 40px auto !important;
    min-height: calc(100vh - 80px);
    border: 1px solid rgba(243, 175, 0, 0.25);
    border-radius: 28px;
    box-shadow: 0 40px 120px rgba(0, 0, 0, 0.7);
    overflow-x: hidden;
  }
}
```

- [ ] **Step 2:** Injetar o link em todas as páginas:

```bash
node -e "
const fs=require('fs');
const tag='<link href=\"assets/css/frame.css\" rel=\"stylesheet\"/>';
for(const f of fs.readdirSync('.').filter(x=>x.endsWith('.html'))){
  let h=fs.readFileSync(f,'utf8');
  if(h.includes('frame.css'))continue;
  h=h.replace('</head>',tag+'</head>');
  fs.writeFileSync(f,h);console.log('OK',f);
}"
```

- [ ] **Step 3:** Verificar: `grep -L "frame.css" *.html` → vazio. Abrir `index.html` e `resultados-da-pesquisa.html` numa janela larga: frame centrado, sem scroll horizontal. Nota: `index.html` tem `overflow:hidden` no body — confirmar que o splash continua centrado dentro do frame.
- [ ] **Step 4:** `git add -A && git commit -m "feat: frame de telemóvel em desktop (frame.css)"`

### Task 4: Rebrand Patek→MERIDIAN + preços coerentes

**Files:** Modify: `resultados-da-pesquisa.html`, `lista-de-desejos.html`, `servico-de-manutencao.html`, `checkout-entrega.html`, `checkout-pagamento.html`, `checkout-revisao.html`, `seguir-encomenda.html`, `as-minhas-encomendas.html`, `encomenda-confirmada.html`

- [ ] **Step 1:** Substituições de marca/modelo (script):

```bash
node -e "
const fs=require('fs');
const map=[
 ['Patek Philippe Nautilus','MERIDIAN Nautilus 40'],
 ['Patek Philippe Calatrava','MERIDIAN Calatrava 36'],
 ['Patek Philippe Aquanaut','MERIDIAN Aquanaut 44'],
 ['Patek Philippe','MERIDIAN'],
 ['Nautilus 5711\\\" type','Nautilus 40 type'],
 ['Nautilus 5711','Nautilus 40'],
 ['Calatrava 5227R','Calatrava 36 · MC-3602'],
];
for(const f of fs.readdirSync('.').filter(x=>x.endsWith('.html'))){
  let h=fs.readFileSync(f,'utf8'),orig=h;
  for(const [a,b] of map) h=h.split(a).join(b);
  if(h!==orig){fs.writeFileSync(f,h);console.log('OK',f);}
}"
```

- [ ] **Step 2:** Verificar: `grep -il "patek\|5711\|5227" *.html` → vazio.
- [ ] **Step 3:** Preços da cadeia de checkout — corrigir manualmente (Read + Edit em cada ficheiro) para os valores canónicos: item €24.500,00, envio Oferta/€0,00, total €24.500,00. Valores errados a procurar: `grep -n "12\.450\|15\.313\|24,500\|30,135\|5\.635\|24\.450\|30\.073\|5\.623\|€15,00\|€45,00" checkout-*.html encomenda-confirmada.html seguir-encomenda.html as-minhas-encomendas.html`
- [ ] **Step 4:** Preços das listagens — em `resultados-da-pesquisa.html` e `lista-de-desejos.html`, mapear cada card para o catálogo: Nautilus→€24.500,00, Calatrava→€18.900,00, Aquanaut→€21.300,00, 4.º card (se existir)→Grand Régulateur €36.700,00. Localizar: `grep -n "€" resultados-da-pesquisa.html lista-de-desejos.html`
- [ ] **Step 5:** Verificar coerência final: `grep -h "€[0-9]" *.html | grep -v "24.500\|18.900\|21.300\|36.700\|0,00" | sort -u` → analisar restos (descontos/IVA aceitáveis se coerentes com o total).
- [ ] **Step 6:** `git add -A && git commit -m "fix: rebrand MERIDIAN + catálogo e preços canónicos"`

### Task 5: Unificar idioma para PT

**Files:** Modify: todos os `*.html` (não tocar em `assets/js/nav.js` — é a Task 8)

- [ ] **Step 1:** Substituições globais:

```bash
node -e "
const fs=require('fs');
const map=[
 ['Continue to Payment','Continuar para Pagamento'],
 ['COMPLETE TRANSACTION','CONCLUIR TRANSAÇÃO'],
 ['TRACK ORDER','SEGUIR ENCOMENDA'],
 ['ADD TO BAG','ADICIONAR AO SACO'],
 ['View Details','Ver Detalhes'],
 ['Load More Discoveries','Carregar Mais'],
 ['SORT: RELEVANCE','ORDENAR: RELEVÂNCIA'],
 ['FILTER','FILTRAR'],
 ['Boutique Locator','Localizador de Boutiques'],
 ['Watch Servicing','Serviço de Manutenção'],
 ['PARTILHAR WISHLIST','PARTILHAR LISTA'],
 ['DOWNLOAD DATA ARCHIVE','DESCARREGAR DADOS'],
 ['>Home<','>Início<'],
 ['>Collection<','>Coleção<'],
 ['>Search<','>Pesquisa<'],
 ['>Account<','>Conta<'],
 ['Logout','Sair'],
];
for(const f of fs.readdirSync('.').filter(x=>x.endsWith('.html'))){
  let h=fs.readFileSync(f,'utf8'),orig=h;
  for(const [a,b] of map) h=h.split(a).join(b);
  if(h!==orig){fs.writeFileSync(f,h);console.log('OK',f);}
}"
```

- [ ] **Step 2:** Caça manual ao inglês restante: `grep -n "Estimated\|Delivery\|Shipping\|Payment Method\|Billing\|Subtotal\|Order Summary\|Sign\|Free\|Total Due" *.html` — traduzir com Edit caso a caso (Subtotal fica; "Free"→"Oferta"; "Order Summary"→"Resumo da Encomenda"; "Estimated Delivery"→"Entrega Estimada").
  Exceções que FICAM em inglês (identidade de marca): "ENTER THE MAISON", "EST. 1892 — GENÈVE", "HOROLOGY", nomes de coleção.
- [ ] **Step 3:** Verificação visual: abrir as 4 páginas do checkout e a pesquisa; sem mistura PT/EN visível.
- [ ] **Step 4:** `git add -A && git commit -m "i18n: unificar interface em PT"`

### Task 6: Página de Produto (produto.html)

Destino dos "Ver Detalhes". Um template, 4 produtos via `?id=`.

**Files:** Create: `produto.html`

- [ ] **Step 1:** Criar `produto.html` copiando de `resultados-da-pesquisa.html` o bloco `<head>...</head>` completo (design tokens Tailwind + fontes + frame.css). Substituir `<title>` por `MERIDIAN | Detalhe do Produto`.
- [ ] **Step 2:** Corpo da página — usar exatamente este `<body>` (classes alinhadas com os tokens do head copiado):

```html
<body class="dark bg-background text-on-background font-body-md min-h-screen flex flex-col">
<header class="sticky top-0 z-20 flex items-center justify-between px-margin-mobile py-4 bg-background/90 backdrop-blur-md border-b border-outline-variant/30">
  <button aria-label="Voltar"><span class="material-symbols-outlined">arrow_back</span></button>
  <img alt="MERIDIAN" class="h-5" src="assets/img/meridian-wordmark.svg"/>
  <button aria-label="Saco"><span class="material-symbols-outlined">shopping_bag</span></button>
</header>
<main class="flex-1 pb-12">
  <section class="aspect-square bg-surface-container-low flex items-center justify-center">
    <img alt="" class="w-3/4 h-3/4 object-contain" id="pdp-img" src="assets/img/screens/resultados-da-pesquisa.png"/>
  </section>
  <section class="px-margin-mobile pt-8">
    <p class="font-label-caps text-label-caps text-primary tracking-[0.25em]" id="pdp-colecao">NAUTILUS</p>
    <h1 class="font-headline-lg-mobile text-headline-lg-mobile mt-2" id="pdp-nome">MERIDIAN Nautilus 40</h1>
    <p class="text-on-surface-variant text-sm mt-1" id="pdp-ref">Ref. MN-4001</p>
    <p class="font-currency-display text-currency-display text-primary mt-4" id="pdp-preco">€24.500,00</p>
  </section>
  <section class="px-margin-mobile mt-8">
    <h2 class="font-label-caps text-label-caps text-on-surface-variant tracking-[0.2em] mb-4">ESPECIFICAÇÕES</h2>
    <dl class="divide-y divide-outline-variant/30 border-y border-outline-variant/30">
      <div class="flex justify-between py-3"><dt class="text-on-surface-variant">Movimento</dt><dd id="pdp-mov">Automático, Cal. M-310</dd></div>
      <div class="flex justify-between py-3"><dt class="text-on-surface-variant">Caixa</dt><dd id="pdp-caixa">Aço, 40mm</dd></div>
      <div class="flex justify-between py-3"><dt class="text-on-surface-variant">Bracelete</dt><dd id="pdp-brac">Aço integrado</dd></div>
      <div class="flex justify-between py-3"><dt class="text-on-surface-variant">Resistência</dt><dd>12 ATM</dd></div>
    </dl>
    <a class="inline-flex items-center gap-1 text-primary text-sm mt-4" href="guia-de-tamanhos.html">
      <span class="material-symbols-outlined text-sm">straighten</span> Guia de Tamanhos
    </a>
  </section>
  <section class="px-margin-mobile mt-10 flex flex-col gap-3">
    <button class="w-full py-4 bg-primary-container text-on-primary-container font-label-caps text-label-caps tracking-[0.2em]">ADICIONAR AO SACO</button>
    <button class="w-full py-4 border border-outline text-on-surface font-label-caps text-label-caps tracking-[0.2em] flex items-center justify-center gap-2">
      <span class="material-symbols-outlined text-sm">favorite</span> LISTA DE DESEJOS
    </button>
  </section>
</main>
<script>
  // Catálogo do protótipo — fonte única usada também por carrinho.html.
  var CATALOGO = {
    'nautilus-40':  {nome:'MERIDIAN Nautilus 40',     ref:'MN-4001', preco:'€24.500,00', colecao:'NAUTILUS',  mov:'Automático, Cal. M-310', caixa:'Aço, 40mm',        brac:'Aço integrado'},
    'calatrava-36': {nome:'MERIDIAN Calatrava 36',    ref:'MC-3602', preco:'€18.900,00', colecao:'CALATRAVA', mov:'Manual, Cal. M-215',     caixa:'Ouro rosa, 36mm',  brac:'Pele de aligátor'},
    'aquanaut-44':  {nome:'MERIDIAN Aquanaut 44',     ref:'MA-4403', preco:'€21.300,00', colecao:'AQUANAUT',  mov:'Automático, Cal. M-324', caixa:'Titânio, 44mm',    brac:'Borracha técnica'},
    'regulateur-40':{nome:'MERIDIAN Grand Régulateur',ref:'GR-4004', preco:'€36.700,00', colecao:'HERITAGE',  mov:'Manual, Cal. M-501',     caixa:'Platina, 40mm',    brac:'Pele de aligátor'}
  };
  var p = CATALOGO[new URLSearchParams(location.search).get('id')] || CATALOGO['nautilus-40'];
  ['nome','ref','preco','colecao','mov','caixa','brac'].forEach(function(k){
    var el = document.getElementById('pdp-'+k);
    if (el) el.textContent = k==='ref' ? 'Ref. '+p.ref : p[k];
  });
  document.title = 'MERIDIAN | ' + p.nome;
</script>
<script src="assets/js/nav.js"></script>
</body></html>
```

- [ ] **Step 3:** Verificar: abrir `produto.html?id=calatrava-36` → nome/ref/preço/specs da Calatrava; sem `?id=` → Nautilus.
- [ ] **Step 4:** Imagem de produto — se houver fotos reais, colocar em `assets/img/products/<id>.png` e acrescentar campo `img` ao CATALOGO + `document.getElementById('pdp-img').src=p.img`. Se não houver, manter placeholder e registar no ROADMAP (P2).
- [ ] **Step 5:** `git add produto.html && git commit -m "feat: página de produto (PDP) com catálogo via ?id="`

### Task 7: Carrinho (carrinho.html)

Estático nesta fase (P2 torna-o vivo). 1 item (Nautilus 40), coerente com o checkout.

**Files:** Create: `carrinho.html`

- [ ] **Step 1:** Criar `carrinho.html` com o mesmo `<head>` copiado (Task 6, Step 1); `<title>MERIDIAN | O Meu Saco</title>`. Corpo:

```html
<body class="dark bg-background text-on-background font-body-md min-h-screen flex flex-col">
<header class="sticky top-0 z-20 flex items-center justify-between px-margin-mobile py-4 bg-background/90 backdrop-blur-md border-b border-outline-variant/30">
  <button aria-label="Voltar"><span class="material-symbols-outlined">arrow_back</span></button>
  <h1 class="font-label-caps text-label-caps tracking-[0.25em]">O MEU SACO</h1>
  <span class="w-6"></span>
</header>
<main class="flex-1 px-margin-mobile pt-6 pb-12">
  <article class="flex gap-4 py-5 border-b border-outline-variant/30">
    <div class="w-24 h-24 bg-surface-container-low flex items-center justify-center shrink-0">
      <span class="material-symbols-outlined text-primary text-3xl">watch</span>
    </div>
    <div class="flex-1">
      <p class="font-label-caps text-label-caps text-primary tracking-[0.2em]">NAUTILUS</p>
      <h2 class="font-headline-md text-base mt-1">MERIDIAN Nautilus 40</h2>
      <p class="text-on-surface-variant text-sm">Ref. MN-4001 · Qtd. 1</p>
      <div class="flex items-center justify-between mt-3">
        <p class="font-currency-display text-primary">€24.500,00</p>
        <button class="text-on-surface-variant text-sm underline underline-offset-4">Remover</button>
      </div>
    </div>
  </article>
  <section class="mt-8">
    <div class="flex justify-between py-2 text-on-surface-variant"><span>Subtotal</span><span>€24.500,00</span></div>
    <div class="flex justify-between py-2 text-on-surface-variant"><span>Envio</span><span class="text-primary">Oferta</span></div>
    <div class="flex justify-between py-4 border-t border-outline-variant/30 mt-2 font-currency-display text-currency-display">
      <span>Total</span><span class="text-primary">€24.500,00</span>
    </div>
    <p class="text-on-surface-variant text-xs">IVA incluído. Entrega assegurada com seguro Meridian Care.</p>
  </section>
  <button class="w-full py-4 mt-8 bg-primary-container text-on-primary-container font-label-caps text-label-caps tracking-[0.2em]">FINALIZAR COMPRA</button>
  <a class="block text-center text-on-surface-variant text-sm mt-4 underline underline-offset-4" href="resultados-da-pesquisa.html">Continuar a explorar</a>
</main>
<script src="assets/js/nav.js"></script>
</body></html>
```

- [ ] **Step 2:** Verificar: abrir `carrinho.html` → total €24.500,00, layout coerente com as outras páginas.
- [ ] **Step 3:** `git add carrinho.html && git commit -m "feat: página de carrinho"`

### Task 8: Reescrever rotas do nav.js

As chaves de texto mudaram para PT (Task 5) e há 2 páginas novas. Reescrever os dois mapas por completo.

**Files:** Modify: `assets/js/nav.js`

- [ ] **Step 1:** Substituir `TEXT_ROUTES` e `ICON_ROUTES` inteiros por:

```js
  var TEXT_ROUTES = [
    ['continuar para pagamento', 'checkout-pagamento.html'],
    ['concluir transação', 'checkout-revisao.html'],
    ['finalizar encomenda', 'encomenda-confirmada.html'],
    ['finalizar compra', 'checkout-entrega.html'],
    ['seguir encomenda', 'seguir-encomenda.html'],
    ['detalhes', 'seguir-encomenda.html'],
    ['ver detalhes', 'produto.html'],
    ['regressar à coleção', 'resultados-da-pesquisa.html'],
    ['adicionar ao saco', 'carrinho.html'],
    ['as minhas encomendas', 'as-minhas-encomendas.html'],
    ['lista de desejos', 'lista-de-desejos.html'],
    ['guia de tamanhos', 'guia-de-tamanhos.html'],
    ['serviço de manutenção', 'servico-de-manutencao.html'],
    ['localizador de boutiques', 'localizador-de-boutiques.html'],
    ['o meu perfil', 'o-meu-perfil.html'],
    ['conta', 'o-meu-perfil.html'],
    ['coleção', 'resultados-da-pesquisa.html'],
    ['pesquisa', 'resultados-da-pesquisa.html'],
    ['início', 'index.html']
  ];

  var ICON_ROUTES = {
    arrow_back: 'BACK',
    shopping_bag: 'carrinho.html',
    local_mall: 'carrinho.html',
    favorite: 'lista-de-desejos.html',
    home: 'index.html',
    watch: 'resultados-da-pesquisa.html',
    search: 'resultados-da-pesquisa.html',
    person: 'o-meu-perfil.html'
  };
```

Atenção à ordem: `ver detalhes` tem de vir ANTES de `detalhes`? Não — `routeFor` testa por ordem e `detalhes` faz match em "ver detalhes". **Colocar `['ver detalhes', 'produto.html']` ANTES de `['detalhes', ...]`** na lista final (corrigir a ordem acima ao aplicar).

- [ ] **Step 2:** Verificar no browser: em `resultados-da-pesquisa.html`, "Ver Detalhes" → `produto.html`; "Adicionar ao Saco" (PDP) → `carrinho.html`; "Finalizar Compra" (carrinho) → `checkout-entrega.html`; ícone do saco em qualquer página → `carrinho.html`.
- [ ] **Step 3:** `git add assets/js/nav.js && git commit -m "feat: rotas PT + produto/carrinho no nav.js"`

### Task 9: Checkout pré-preenchido

Ninguém digita numa demo — o fluxo tem de fluir só com cliques.

**Files:** Modify: `checkout-entrega.html`, `checkout-pagamento.html`

- [ ] **Step 1:** Localizar inputs: `grep -n "<input" checkout-entrega.html checkout-pagamento.html`
- [ ] **Step 2:** Adicionar `value="..."` a cada input (Edit por ficheiro) com os dados demo: Nome `Alexandre Fontes` · Morada `Av. da Boavista 1277, 3º Esq.` · Cidade `Porto` · CP `4100-130` · Tel `+351 912 345 678` · Email `a.fontes@email.pt` · Cartão `4242 4242 4242 4242` · Validade `08/28` · CVC `123` · Titular `ALEXANDRE FONTES`.
- [ ] **Step 3:** Verificar: abrir as duas páginas — todos os campos preenchidos, nenhum obrigatório vazio.
- [ ] **Step 4:** `git add checkout-*.html && git commit -m "feat: checkout pré-preenchido com dados demo"`

### Task 10: Verificação do fluxo completo

- [ ] **Step 1:** `npx serve .` e percorrer no browser: splash → ENTER → pesquisa → Ver Detalhes → PDP → Adicionar ao Saco → carrinho → Finalizar Compra → entrega → pagamento → revisão → confirmada → Seguir Encomenda. Cada passo sem becos.
- [ ] **Step 2:** Caça a cliques mortos restantes: em cada página, clicar em TODOS os botões/links visíveis; anotar os que não fazem nada ("Agendar Serviço", "Alterar Entrega", "Contactar Concierge", filtros, "Carregar Mais", "EDITAR", etc.). Para cada um: ligar a página existente se fizer sentido, senão remover o elemento.
- [ ] **Step 3:** Repetir o fluxo numa janela desktop (frame) e numa estreita (mobile).
- [ ] **Step 4:** `git add -A && git commit -m "fix: eliminar cliques mortos restantes"`

### Task 11: Deploy GitHub Pages

- [ ] **Step 1:** `gh repo create meridian-ecommerce --public --source . --push`
- [ ] **Step 2:** `gh api repos/{owner}/meridian-ecommerce/pages -X POST -f "source[branch]=main" -f "source[path]=/"` (ou ativar em Settings → Pages → branch main).
- [ ] **Step 3:** Verificar o URL `https://<user>.github.io/meridian-ecommerce/` — fluxo completo funciona (paths relativos já são compatíveis).
- [ ] **Step 4:** Acrescentar o URL ao topo do README.md e commit: `git add README.md && git commit -m "docs: link de produção" && git push`

---

## Self-review (feito)

- **Cobertura do spec (ROADMAP P0+P1):** deploy→T11 · frame desktop→T3 · cliques mortos→T2/T8/T10 · PDP→T6 · carrinho→T7 · idioma→T5 · dados consistentes→T4 · pré-preenchido→T9. ✓
- **Consistência:** preços/refs do CATALOGO (T6) = tabela canónica = T4/T7/T9. Chaves PT do nav.js (T8) = strings traduzidas (T5). `FINALIZAR COMPRA` (T7) tem rota em T8. ✓
- **Armadilha conhecida:** ordem `ver detalhes`/`detalhes` no TEXT_ROUTES — documentada em T8.
