// Navegação do protótipo MERIDIAN — liga os ecrãs gerados pelo Stitch.
// Faz o binding por texto do botão/link e por ícone (Material Symbols),
// já que o HTML exportado não traz hrefs.
(function () {
  var TEXT_ROUTES = [
    ['continuar para pagamento', 'checkout-pagamento.html'],
    ['concluir transação', 'checkout-revisao.html'],
    ['finalizar encomenda', 'encomenda-confirmada.html'],
    ['finalizar compra', 'checkout-entrega.html'],
    ['seguir encomenda', 'seguir-encomenda.html'],
    ['ver detalhes', 'produto.html'],
    ['detalhes', 'seguir-encomenda.html'],
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

  // Botões que parecem CTAs primários mas não têm destino de página —
  // em vez de ficarem mortos, dão uma confirmação inline ao clicar.
  var ACK_BUTTONS = [
    'agendar serviço',
    'agendar consultoria virtual',
    'contactar concierge',
    'pedir reparação',
    'agendar manutenção'
  ];
  var ACK_TEXT = 'PEDIDO RECEBIDO ✓';

  function norm(t) {
    return (t || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function bind(el, dest) {
    if (!el || el.dataset.navBound) return;
    el.dataset.navBound = '1';
    el.style.cursor = 'pointer';
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (dest === 'BACK') {
        if (history.length > 1) history.back();
        else location.href = 'index.html';
      } else {
        location.href = dest;
      }
    });
  }

  function routeFor(text) {
    for (var i = 0; i < TEXT_ROUTES.length; i++) {
      var key = TEXT_ROUTES[i][0];
      var re = new RegExp('(^|\\b)' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\b|$)');
      if (re.test(text)) return TEXT_ROUTES[i][1];
    }
    return null;
  }

  document.addEventListener('DOMContentLoaded', function () {
    // 1. Ícones: liga o botão/link mais próximo do span do ícone.
    document.querySelectorAll('span.material-symbols-outlined').forEach(function (icon) {
      var dest = ICON_ROUTES[norm(icon.textContent)];
      if (!dest) return;
      var target = icon.closest('a, button') || icon;
      // Não sobrepor um destino já definido por texto mais específico.
      if (!target.dataset.navBound) {
        var textDest = routeFor(norm(target.textContent));
        bind(target, textDest || dest);
      }
    });

    // 2. Texto: botões, links e elementos clicáveis.
    document.querySelectorAll('a, button, [class*="cursor-pointer"]').forEach(function (el) {
      if (el.dataset.navBound) return;
      if (el.querySelector('[data-nav-bound]')) return;
      var href = el.getAttribute && el.getAttribute('href');
      if (href && href !== '#' && href !== '') return; // já tem destino real
      var dest = routeFor(norm(el.textContent));
      if (dest) bind(el, dest);
    });

    // 3. Botões "ack": sem destino de página, mas com confirmação inline
    // (ex.: "Agendar Serviço", "Contactar Concierge") — evita cliques mortos
    // em CTAs que parecem primários.
    document.querySelectorAll('button').forEach(function (el) {
      if (el.dataset.navBound || el.dataset.ackBound) return;
      var text = norm(el.textContent);
      if (ACK_BUTTONS.indexOf(text) === -1) return;
      el.dataset.ackBound = '1';
      el.style.cursor = 'pointer';
      el.addEventListener('click', function (e) {
        e.preventDefault(); // evita submit/reload em botões dentro de <form>
        if (el.dataset.acked) return;
        el.dataset.acked = '1';
        el.dataset.originalText = el.textContent;
        el.textContent = ACK_TEXT;
        el.disabled = true;
        el.classList.add('opacity-80');
      });
    });
  });
})();
