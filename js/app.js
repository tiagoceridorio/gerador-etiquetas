function init() {
  renderPresets();
  bindFormEvents();
  bindPreviewTabs();
  resetForm(false);
  loadSavedBatch();
  renderBatch();
  renderDraftPreview();
  updatePrintButton();
}

function renderPresets() {
  var grid = document.getElementById('presetGrid');
  grid.innerHTML = '';

  PRESETS.forEach(function(preset, index) {
    var button = document.createElement('button');
    button.className = 'preset-btn';
    button.type = 'button';
    button.innerHTML =
      '<span class="preset-name">' + esc(preset.name) + '</span>' +
      '<span class="preset-desc">' + esc(preset.type + ' • ' + preset.desc) + '</span>';
    button.addEventListener('click', function() { loadPreset(index); });
    grid.appendChild(button);
  });
}

function bindFormEvents() {
  ['productName', 'productDesc', 'fabricDate', 'validDate', 'usageText', 'productEmoji', 'qty', 'hasBanner', 'bannerColor']
    .forEach(function(id) {
      document.getElementById(id).addEventListener('input', renderDraftPreview);
      document.getElementById(id).addEventListener('change', renderDraftPreview);
    });

  document.getElementById('fabricDate').addEventListener('change', function() {
    var val = this.value;
    if (val) {
      var parts = val.split('-');
      var fab = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      var valid = new Date(fab);
      valid.setFullYear(valid.getFullYear() + 1);
      document.getElementById('validDate').value = dateToInput(valid);
    }
  });

  document.getElementById('productType').addEventListener('change', function() {
    if (this.value !== 'Outro') {
      document.getElementById('usageText').value = defaultUsageForType(this.value);
    }
    renderDraftPreview();
  });

  document.getElementById('productImage').addEventListener('change', handleImageChange);
  document.getElementById('bannerImage').addEventListener('change', handleBannerImageChange);
  document.getElementById('hasBanner').addEventListener('change', toggleBannerImageField);
}

function bindPreviewTabs() {
  document.querySelectorAll('.tab-btn').forEach(function(button) {
    button.addEventListener('click', function() { setPreviewSide(button.dataset.side); });
  });
}

init();
