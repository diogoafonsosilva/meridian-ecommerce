#!/usr/bin/env node
/**
 * Audit de cliques — MERIDIAN prototype
 * ---------------------------------------------------------------
 * Para cada *.html na raiz do projeto, extrai todos os <a> e <button>
 * (incluindo o texto, href e ícones Material Symbols dentro deles) e
 * simula a lógica de assets/js/nav.js (norm/routeFor com TEXT_ROUTES e
 * ICON_ROUTES copiados desse ficheiro) para classificar cada elemento:
 *
 *   - HREF  : tem um href real (!= '' e != '#') -> navega via browser
 *   - BOUND : nav.js liga-o por texto e/ou ícone -> destino calculado
 *   - DEAD  : nenhuma das anteriores -> clique não faz nada
 *
 * Uso:
 *   node docs/audit-cliques.js
 *
 * Mantém-se sincronizado manualmente com TEXT_ROUTES/ICON_ROUTES de
 * assets/js/nav.js — se esse ficheiro mudar, atualizar aqui também.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ---------------------------------------------------------------
// Cópia das tabelas de routing de assets/js/nav.js
// (mantém esta secção sincronizada com o ficheiro real)
// ---------------------------------------------------------------
const TEXT_ROUTES = [
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

const ICON_ROUTES = {
  arrow_back: 'BACK',
  shopping_bag: 'carrinho.html',
  local_mall: 'carrinho.html',
  favorite: 'lista-de-desejos.html',
  home: 'index.html',
  watch: 'resultados-da-pesquisa.html',
  search: 'resultados-da-pesquisa.html',
  person: 'o-meu-perfil.html'
};

// Botões "ack" — nav.js troca o texto por "PEDIDO RECEBIDO ✓" ao clicar
// (mantém sincronizado com ACK_BUTTONS em assets/js/nav.js)
const ACK_BUTTONS = [
  'agendar serviço',
  'agendar consultoria virtual',
  'contactar concierge',
  'pedir reparação',
  'agendar manutenção'
];

// Elementos que têm o próprio handler inline (script <script> na página)
// e por isso NÃO dependem de nav.js — o classificador marcaria DEAD
// incorretamente. Mapeados por ficheiro + texto normalizado.
const INLINE_HANDLERS = {
  'index.html': ['enter the maison'],          // navega para resultados-da-pesquisa.html via script inline
  'o-meu-perfil.html': ['logout sair']         // confirm() de logout via script inline
};

function norm(t) {
  return (t || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function routeFor(text) {
  for (let i = 0; i < TEXT_ROUTES.length; i++) {
    const key = TEXT_ROUTES[i][0];
    const re = new RegExp('(^|\\b)' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\b|$)');
    if (re.test(text)) return TEXT_ROUTES[i][1];
  }
  return null;
}

// ---------------------------------------------------------------
// Parser HTML minimalista (sem dependências externas)
// Extrai elementos <a ...>...</a> e <button ...>...</button>,
// incluindo o texto interno (com espaços normalizados) e os
// ícones Material Symbols dentro deles.
// ---------------------------------------------------------------
function extractClickables(html) {
  const results = [];
  const tagRe = /<(a|button)\b([^>]*)>/gi;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    const tag = m[1].toLowerCase();
    const attrsRaw = m[2];
    const startIdx = m.index;
    const openEnd = tagRe.lastIndex;

    // Encontrar o fecho correspondente, lidando com nesting do mesmo tag
    const closeRe = new RegExp('<(/?)(' + tag + ')\\b[^>]*>', 'gi');
    closeRe.lastIndex = openEnd;
    let depth = 1;
    let innerEnd = -1;
    let cm;
    while ((cm = closeRe.exec(html)) !== null) {
      if (cm[1] === '/') {
        depth--;
        if (depth === 0) {
          innerEnd = cm.index;
          break;
        }
      } else {
        depth++;
      }
    }
    if (innerEnd === -1) innerEnd = html.length;

    const inner = html.slice(openEnd, innerEnd);

    // href attribute
    const hrefMatch = attrsRaw.match(/href\s*=\s*"([^"]*)"/i) || attrsRaw.match(/href\s*=\s*'([^']*)'/i);
    const href = hrefMatch ? hrefMatch[1] : null;

    // texto visível (remove tags, normaliza espaços)
    const textOnly = inner.replace(/<[^>]*>/g, ' ');
    const text = norm(textOnly.replace(/&amp;/g, '&'));

    // ícones material-symbols-outlined dentro do elemento
    const icons = [];
    const iconRe = /<span[^>]*class="[^"]*material-symbols-outlined[^"]*"[^>]*>([^<]*)<\/span>/gi;
    let im;
    while ((im = iconRe.exec(inner)) !== null) {
      icons.push(norm(im[1]));
    }

    // aria-label, útil para contexto/debug
    const ariaMatch = attrsRaw.match(/aria-label\s*=\s*"([^"]*)"/i);
    const ariaLabel = ariaMatch ? ariaMatch[1] : null;

    results.push({
      tag,
      text,
      href,
      icons,
      ariaLabel,
      raw: html.slice(startIdx, Math.min(innerEnd + tag.length + 3, html.length))
    });

    tagRe.lastIndex = innerEnd;
  }
  return results;
}

// ---------------------------------------------------------------
// Simula a lógica de binding de nav.js para um elemento.
// Devolve { kind: 'HREF'|'BOUND'|'DEAD', dest: string|null }
// ---------------------------------------------------------------
function classify(el, file) {
  // Passo 1 (ícones): se tiver um ícone reconhecido E ainda não tiver
  // destino por texto mais específico, o ícone pode definir o destino.
  let iconDest = null;
  for (const icon of el.icons) {
    if (ICON_ROUTES[icon]) {
      iconDest = ICON_ROUTES[icon];
      break;
    }
  }

  // Passo 2 (texto): href real vence sempre (nav.js não sobrepõe).
  if (el.href && el.href !== '#' && el.href !== '') {
    return { kind: 'HREF', dest: el.href };
  }

  const textDest = routeFor(el.text);

  if (textDest) {
    return { kind: 'BOUND', dest: textDest, via: 'texto' };
  }
  if (iconDest) {
    return { kind: 'BOUND', dest: iconDest, via: 'ícone' };
  }

  // Botões "ack" (sem destino, mas com confirmação inline via nav.js)
  if (ACK_BUTTONS.includes(el.text)) {
    return { kind: 'ACK', dest: null };
  }

  // Elementos com handler inline próprio na página (script local)
  if (INLINE_HANDLERS[file] && INLINE_HANDLERS[file].includes(el.text)) {
    return { kind: 'INLINE', dest: null };
  }

  return { kind: 'DEAD', dest: null };
}

// ---------------------------------------------------------------
// Main
// ---------------------------------------------------------------
function main() {
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();

  const allDead = {};
  let totalDead = 0;

  for (const file of files) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const clickables = extractClickables(html);

    const rows = clickables.map(el => {
      const cls = classify(el, file);
      return { ...el, ...cls };
    });

    const dead = rows.filter(r => r.kind === 'DEAD');
    if (dead.length) {
      allDead[file] = dead;
      totalDead += dead.length;
    }

    console.log('\n=== ' + file + ' (' + rows.length + ' elementos clicáveis) ===');
    rows.forEach(r => {
      const label = r.text || (r.ariaLabel ? '[aria: ' + r.ariaLabel + ']' : '') ||
        (r.icons.length ? '[icon: ' + r.icons.join(',') + ']' : '[vazio]');
      let info;
      if (r.kind === 'HREF') info = 'HREF -> ' + r.dest;
      else if (r.kind === 'BOUND') info = 'BOUND(' + r.via + ') -> ' + r.dest;
      else if (r.kind === 'ACK') info = 'ACK (confirmação inline via nav.js, sem navegação)';
      else if (r.kind === 'INLINE') info = 'INLINE (handler próprio no <script> da página)';
      else info = 'DEAD';
      console.log('  [' + r.tag + '] "' + label + '" => ' + info);
    });
  }

  console.log('\n\n========== RESUMO DE ELEMENTOS DEAD ==========');
  if (totalDead === 0) {
    console.log('Nenhum elemento DEAD encontrado.');
  } else {
    for (const [file, deads] of Object.entries(allDead)) {
      console.log('\n' + file + ' (' + deads.length + '):');
      deads.forEach(d => {
        const label = d.text || (d.ariaLabel ? '[aria: ' + d.ariaLabel + ']' : '') ||
          (d.icons.length ? '[icon: ' + d.icons.join(',') + ']' : '[vazio]');
        console.log('  - [' + d.tag + '] "' + label + '"');
      });
    }
  }
  console.log('\nTotal DEAD: ' + totalDead);
}

main();
