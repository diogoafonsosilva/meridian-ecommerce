const fs = require('fs');
const path = require('path');

// Files to process (all except index.html)
const files = [
  'as-minhas-encomendas.html',
  'checkout-entrega.html',
  'checkout-pagamento.html',
  'checkout-revisao.html',
  'encomenda-confirmada.html',
  'guia-de-tamanhos.html',
  'lista-de-desejos.html',
  'localizador-de-boutiques.html',
  'o-meu-perfil.html',
  'resultados-da-pesquisa.html',
  'seguir-encomenda.html',
  'servico-de-manutencao.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);

  // Read file
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Find "Watch Servicing" anchor and remove consecutive blank lines after it
  // until we hit </div> or </nav>
  content = content.replace(
    /(<a[^>]*>Watch Servicing<\/a>)\n\n+(?=\s*<\/(div|nav)>)/g,
    '$1\n'
  );

  // Write file if changed
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Cleaned: ${file}`);
  } else {
    console.log(`  No changes: ${file}`);
  }
});
