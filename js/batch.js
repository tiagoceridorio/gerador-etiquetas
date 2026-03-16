var cardBatch = [];
var editingIndex = null;

function saveBatch() {
  try {
    localStorage.setItem('cardBatch', JSON.stringify(cardBatch));
  } catch (e) {
    console.warn('Não foi possível salvar no armazenamento local:', e);
  }
}

function loadSavedBatch() {
  try {
    var saved = localStorage.getItem('cardBatch');
    if (saved) {
      cardBatch = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Não foi possível carregar do armazenamento local:', e);
  }
}

function addCard() {
  var card = getFormCardData(false);
  if (!card.name) {
    alert('Preencha o nome do produto antes de salvar.');
    return;
  }

  if (editingIndex !== null) {
    cardBatch[editingIndex] = Object.assign({}, card);
    editingIndex = null;
    updateSaveButton();
  } else {
    cardBatch.push(Object.assign({}, card));
  }
  saveBatch();
  renderBatch();
  renderDraftPreview();
  updatePrintButton();
}

function loadBatchCard(index) {
  applyCardToForm(cardBatch[index]);
}

function editCard(index) {
  editingIndex = index;
  applyCardToForm(cardBatch[index]);
  updateSaveButton();
  renderBatch();
}

function cancelEdit() {
  editingIndex = null;
  updateSaveButton();
  resetForm();
  renderBatch();
}

function updateSaveButton() {
  var btn = document.getElementById('saveButton');
  var cancelBtn = document.getElementById('cancelEditButton');
  if (editingIndex !== null) {
    btn.textContent = 'Atualizar produto';
    cancelBtn.style.display = '';
  } else {
    btn.textContent = 'Salvar produto';
    cancelBtn.style.display = 'none';
  }
}

function removeCard(index) {
  if (!confirm('Tem certeza que deseja remover "' + cardBatch[index].name + '"?')) return;
  if (editingIndex === index) {
    editingIndex = null;
    updateSaveButton();
  } else if (editingIndex !== null && editingIndex > index) {
    editingIndex--;
  }
  cardBatch.splice(index, 1);
  saveBatch();
  renderBatch();
  updatePrintButton();
}

function clearAll() {
  if (!cardBatch.length) return;
  if (!confirm('Tem certeza que deseja remover todos os ' + cardBatch.length + ' produtos?')) return;
  cardBatch = [];
  editingIndex = null;
  updateSaveButton();
  saveBatch();
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
    var isEditing = editingIndex === index;
    return '<article class="product-item' + (isEditing ? ' product-item-editing' : '') + '">' +
      '<div class="product-item-header">' +
      '<div>' +
      '<div class="product-item-title">' + esc(card.name) + '</div>' +
      '<div class="product-item-subtitle">' + esc(card.type + ' • ' + (card.desc || 'Sem subtitulo')) + '</div>' +
      '</div>' +
      '<div class="qty-chip">Qtd ' + card.qty + '</div>' +
      '</div>' +
      '<div class="product-item-meta">Fab: ' + esc(formatDate(card.fabricDate)) + ' • Val: ' + esc(formatDate(card.validDate)) + '</div>' +
      '<div class="product-item-actions">' +
      '<button class="btn-inline" type="button" onclick="editCard(' + index + ')">Editar</button>' +
      '<button class="btn-inline" type="button" onclick="loadBatchCard(' + index + ')">Duplicar</button>' +
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
