var cardBatch = [];

function addCard() {
  var card = getFormCardData(false);
  if (!card.name) {
    alert('Preencha o nome do produto antes de salvar.');
    return;
  }

  cardBatch.push(Object.assign({}, card));
  renderBatch();
  renderDraftPreview();
  updatePrintButton();
}

function loadBatchCard(index) {
  applyCardToForm(cardBatch[index]);
}

function removeCard(index) {
  cardBatch.splice(index, 1);
  renderBatch();
  updatePrintButton();
}

function clearAll() {
  cardBatch = [];
  renderBatch();
  updatePrintButton();
}

function renderBatch() {
  var container = document.getElementById('addedCards');
  var countLabel = document.getElementById('productCountLabel');
  var countBadge = document.getElementById('productCountBadge');

  countLabel.textContent = 'Produtos (' + cardBatch.length + ')';
  countBadge.textContent = String(cardBatch.length);

  if (!cardBatch.length) {
    container.innerHTML = '<div class="empty-state">Nenhum produto cadastrado ainda.</div>';
    return;
  }

  container.innerHTML = cardBatch.map(function(card, index) {
    return '<article class="product-item">' +
      '<div class="product-item-header">' +
      '<div>' +
      '<div class="product-item-title">' + esc(card.name) + '</div>' +
      '<div class="product-item-subtitle">' + esc(card.type + ' • ' + (card.desc || 'Sem subtitulo')) + '</div>' +
      '</div>' +
      '<div class="qty-chip">Qtd ' + card.qty + '</div>' +
      '</div>' +
      '<div class="product-item-meta">Fab: ' + esc(formatDate(card.fabricDate)) + ' • Val: ' + esc(formatDate(card.validDate)) + '</div>' +
      '<div class="product-item-actions">' +
      '<button class="btn-inline" type="button" onclick="loadBatchCard(' + index + ')">Usar no editor</button>' +
      '<button class="btn-inline danger" type="button" onclick="removeCard(' + index + ')">Remover</button>' +
      '</div>' +
      '</article>';
  }).join('');
}

function updatePrintButton() {
  var button = document.getElementById('printButton');
  button.disabled = !cardBatch.length;
  button.style.opacity = cardBatch.length ? '1' : '0.45';
  button.style.cursor = cardBatch.length ? 'pointer' : 'not-allowed';
}
