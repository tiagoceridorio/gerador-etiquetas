var currentImageDataURL = null;
var currentBannerImageDataURL = null;

function resetForm(shouldRender) {
  if (shouldRender === undefined) shouldRender = true;

  if (typeof editingIndex !== 'undefined' && editingIndex !== null) {
    editingIndex = null;
    updateSaveButton();
    renderBatch();
  }

  var today = new Date();
  var nextYear = new Date(today);
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  document.getElementById('productType').value = 'Sal';
  document.getElementById('qty').value = 1;
  document.getElementById('productName').value = '';
  document.getElementById('productDesc').value = '';
  document.getElementById('fabricDate').value = dateToInput(today);
  document.getElementById('validDate').value = dateToInput(nextYear);
  document.getElementById('usageText').value = USAGE_TEXTS.sal;
  document.getElementById('productEmoji').value = '';
  document.getElementById('hasBanner').checked = false;
  document.getElementById('bannerColor').value = '#3c2814';
  document.getElementById('bannerFontColor').value = '#f5edd8';
  document.getElementById('bannerOpacity').value = 88;
  document.getElementById('bannerWidth').value = 100;
  document.getElementById('bannerHeight').value = 100;
  document.getElementById('bannerTopSpace').value = 0;
  document.getElementById('bannerRepeat').value = 'cover';
  document.getElementById('bannerImage').value = '';
  currentBannerImageDataURL = null;
  syncBannerImagePreview();
  toggleBannerImageField();
  document.getElementById('productImage').value = '';
  currentImageDataURL = null;
  syncImagePreview();

  if (shouldRender) renderDraftPreview();
}

function syncImagePreview() {
  var preview = document.getElementById('imagePreview');
  if (currentImageDataURL) {
    preview.src = currentImageDataURL;
    preview.style.display = 'block';
    return;
  }
  preview.removeAttribute('src');
  preview.style.display = 'none';
}

function syncBannerImagePreview() {
  var preview = document.getElementById('bannerImagePreview');
  if (currentBannerImageDataURL) {
    preview.src = currentBannerImageDataURL;
    preview.style.display = 'block';
    return;
  }
  preview.removeAttribute('src');
  preview.style.display = 'none';
}

function handleImageChange(event) {
  var file = event.target.files[0];
  if (!file) {
    currentImageDataURL = null;
    syncImagePreview();
    renderDraftPreview();
    return;
  }

  var reader = new FileReader();
  reader.onload = function(loadEvent) {
    trimImage(loadEvent.target.result, function(trimmed) {
      currentImageDataURL = trimmed;
      syncImagePreview();
      renderDraftPreview();
    });
  };
  reader.readAsDataURL(file);
}

function handleBannerImageChange(event) {
  var file = event.target.files[0];
  if (!file) {
    currentBannerImageDataURL = null;
    syncBannerImagePreview();
    renderDraftPreview();
    return;
  }
  var reader = new FileReader();
  reader.onload = function(loadEvent) {
    currentBannerImageDataURL = loadEvent.target.result;
    syncBannerImagePreview();
    renderDraftPreview();
  };
  reader.readAsDataURL(file);
}

function toggleBannerImageField() {
  var show = document.getElementById('hasBanner').checked;
  document.getElementById('bannerOptionsField').style.display = show ? '' : 'none';
}

function getFormCardData(previewMode) {
  var type = document.getElementById('productType').value;
  var name = document.getElementById('productName').value.trim();
  var desc = document.getElementById('productDesc').value.trim();
  var emoji = document.getElementById('productEmoji').value.trim();
  var fabricDate = document.getElementById('fabricDate').value;
  var validDate = document.getElementById('validDate').value;
  var usageText = document.getElementById('usageText').value.trim();
  var qty = parseInt(document.getElementById('qty').value, 10) || 1;
  var hasBanner = document.getElementById('hasBanner').checked;
  var bannerColor = document.getElementById('bannerColor').value;
  var bannerFontColor = document.getElementById('bannerFontColor').value;
  var bannerOpacity = parseInt(document.getElementById('bannerOpacity').value, 10);
  if (isNaN(bannerOpacity)) bannerOpacity = 88;
  var bannerWidth = parseInt(document.getElementById('bannerWidth').value, 10) || 100;
  var bannerHeight = parseInt(document.getElementById('bannerHeight').value, 10) || 100;
  var bannerTopSpace = parseInt(document.getElementById('bannerTopSpace').value, 10) || 0;
  var bannerRepeat = document.getElementById('bannerRepeat').value || 'cover';

  return {
    type: type,
    name: name || (previewMode ? 'Nome do Produto' : ''),
    desc: desc || (previewMode ? 'Ingredientes' : ''),
    emoji: emoji,
    fabricDate: fabricDate,
    validDate: validDate,
    usageText: usageText || (previewMode ? defaultUsageForType(type) : ''),
    qty: qty,
    hasBanner: hasBanner,
    bannerColor: bannerColor,
    bannerFontColor: bannerFontColor,
    bannerOpacity: bannerOpacity,
    bannerWidth: bannerWidth,
    bannerHeight: bannerHeight,
    bannerTopSpace: bannerTopSpace,
    bannerRepeat: bannerRepeat,
    bannerImageDataURL: currentBannerImageDataURL,
    imageDataURL: currentImageDataURL
  };
}

function loadPreset(index) {
  var preset = PRESETS[index];
  applyCardToForm({
    type: preset.type,
    name: preset.name,
    desc: preset.desc,
    emoji: preset.emoji,
    fabricDate: document.getElementById('fabricDate').value || dateToInput(new Date()),
    validDate: document.getElementById('validDate').value || dateToInput(new Date()),
    usageText: defaultUsageForType(preset.type),
    qty: 1,
    hasBanner: !!preset.banner,
    bannerColor: preset.bannerColor || '#3c2814',
    bannerFontColor: preset.bannerFontColor || '#f5edd8',
    bannerOpacity: preset.bannerOpacity != null ? preset.bannerOpacity : 88,
    bannerWidth: preset.bannerWidth || 100,
    bannerHeight: preset.bannerHeight || 100,
    bannerTopSpace: preset.bannerTopSpace || 0,
    bannerRepeat: preset.bannerRepeat || 'cover',
    bannerImageDataURL: null,
    imageDataURL: null
  });
}

function applyCardToForm(card) {
  document.getElementById('productType').value = card.type || 'Sal';
  document.getElementById('qty').value = card.qty || 1;
  document.getElementById('productName').value = card.name || '';
  document.getElementById('productDesc').value = card.desc || '';
  document.getElementById('fabricDate').value = card.fabricDate || dateToInput(new Date());
  document.getElementById('validDate').value = card.validDate || dateToInput(new Date());
  document.getElementById('usageText').value = card.usageText || defaultUsageForType(card.type || 'Sal');
  document.getElementById('productEmoji').value = card.emoji || '';
  document.getElementById('hasBanner').checked = !!card.hasBanner;
  document.getElementById('bannerColor').value = card.bannerColor || '#3c2814';
  document.getElementById('bannerFontColor').value = card.bannerFontColor || '#f5edd8';
  document.getElementById('bannerOpacity').value = card.bannerOpacity != null ? card.bannerOpacity : 88;
  document.getElementById('bannerWidth').value = card.bannerWidth || 100;
  document.getElementById('bannerHeight').value = card.bannerHeight || 100;
  document.getElementById('bannerTopSpace').value = card.bannerTopSpace || 0;
  document.getElementById('bannerRepeat').value = card.bannerRepeat || 'cover';
  document.getElementById('bannerImage').value = '';
  currentBannerImageDataURL = card.bannerImageDataURL || null;
  syncBannerImagePreview();
  toggleBannerImageField();
  document.getElementById('productImage').value = '';
  currentImageDataURL = card.imageDataURL || null;
  syncImagePreview();
  renderDraftPreview();
}
