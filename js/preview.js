var activePreviewSide = 'front';

function setPreviewSide(side) {
  activePreviewSide = side;
  document.querySelectorAll('.tab-btn').forEach(function(button) {
    button.classList.toggle('active', button.dataset.side === side);
  });
  renderDraftPreview();
}

function renderDraftPreview() {
  var preview = document.getElementById('singlePreview');
  var status = document.getElementById('previewStatus');
  var draft = getFormCardData(true);
  var frontHtml = buildFront(draft, { showPlaceholderIllustration: true });
  var backHtml = buildBack(draft);

  preview.innerHTML =
    '<div class="preview-card-column">' +
      '<span class="preview-label">Frente</span>' +
      '<div class="preview-card-shell">' + frontHtml + '</div>' +
    '</div>' +
    '<div class="preview-card-column">' +
      '<span class="preview-label">Verso</span>' +
      '<div class="preview-card-shell">' + backHtml + '</div>' +
    '</div>';
  status.textContent = (draft.name || 'Nome do Produto') + ' • Quantidade ' + draft.qty;
  fitBackCards(preview);
  fitIllustrationImages(preview);
}

function generatePreview() {
  renderDraftPreview();
}

function fitIllustrationImages(container) {
  (container || document).querySelectorAll('.illustration-area img').forEach(function(img) {
    var area = img.closest('.illustration-area');
    if (!area) return;
    var doFit = function() {
      var areaW = area.clientWidth;
      var areaH = area.clientHeight;
      if (!areaW || !areaH) return;
      var natW = img.naturalWidth || 1;
      var natH = img.naturalHeight || 1;
      var scale = Math.min(areaW / natW, areaH / natH);
      img.style.width = Math.round(natW * scale) + 'px';
      img.style.height = Math.round(natH * scale) + 'px';
    };
    if (img.complete && img.naturalWidth) doFit();
    else img.onload = doFit;
  });
}

function fitBackCards(root) {
  root = root || document;

  root.querySelectorAll('.card-back').forEach(function(card) {
    var content = card.querySelector('.card-content');
    var title = card.querySelector('.uso-title');
    var text = card.querySelector('.uso-text');
    if (!content || !title || !text) return;

    content.style.display = 'block';
    content.style.overflow = 'hidden';

    var cs = window.getComputedStyle(content);
    var available = content.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);

    var titleSize = 30;
    var textSize = 16;
    var minTitle = 14;
    var minText = 7;

    function apply() {
      title.style.fontSize = titleSize + 'px';
      title.style.marginBottom = '0px';
      text.style.fontSize = textSize + 'px';
      text.style.lineHeight = '1.4';
    }

    function totalH() {
      apply();
      return title.offsetHeight + text.offsetHeight;
    }

    while (totalH() > available && (titleSize > minTitle || textSize > minText)) {
      if (textSize > minText) textSize -= 0.5;
      if (titleSize > minTitle) titleSize -= 0.5;
    }

    while (textSize < 20) {
      textSize += 0.5;
      if (totalH() > available) { textSize -= 0.5; apply(); break; }
    }
    while (titleSize < 36) {
      titleSize += 0.5;
      if (totalH() > available) { titleSize -= 0.5; apply(); break; }
    }

    apply();

    content.style.display = '';
    content.style.overflow = '';
  });
}
