function cornerSVG() {
  return '<svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M3 27 C3 14, 6 8, 12 5 C16 3, 22 3, 27 3" stroke="#b8963e" stroke-width="1.8" fill="none"/>' +
    '<path d="M3 22 C3 12, 6 7, 11 5 C14 3.5, 19 3, 22 3" stroke="#c4a96a" stroke-width="1" fill="none"/>' +
    '<path d="M6 27 C6 16, 8 10, 14 7 C17 5.5, 22 5, 27 5" stroke="#c4a96a" stroke-width="0.8" fill="none"/>' +
    '<circle cx="4" cy="26" r="1.2" fill="#b8963e" opacity="0.5"/>' +
    '<circle cx="26" cy="4" r="1.2" fill="#b8963e" opacity="0.5"/>' +
  '</svg>';
}

function cardShell() {
  return '<div class="card-texture"></div>' +
    '<div class="card-aging"></div>' +
    '<div class="card-border-outer"></div>' +
    '<div class="card-border-inner"></div>' +
    '<div class="hole"></div>' +
    '<div class="corner corner-tl">' + cornerSVG() + '</div>' +
    '<div class="corner corner-tr">' + cornerSVG() + '</div>' +
    '<div class="corner corner-bl">' + cornerSVG() + '</div>' +
    '<div class="corner corner-br">' + cornerSVG() + '</div>';
}

function ruledLines(count, color) {
  var html = '<div class="ruled-lines">';
  for (var i = 0; i < count; i++) {
    html += '<div class="ruled-line"' + (color ? ' style="border-color:' + color + '"' : '') + '></div>';
  }
  return html + '</div>';
}

function descLines(count) {
  var html = '<div class="desc-lines">';
  for (var i = 0; i < count; i++) html += '<div class="desc-line"></div>';
  return html + '</div>';
}

function illustration(card, options) {
  if (card.imageDataURL) return '<img src="' + card.imageDataURL + '" alt="ilustracao">';
  if (card.emoji) return '<span class="emoji-illust">' + esc(card.emoji) + '</span>';
  if (options && options.showPlaceholderIllustration) return '<div class="image-placeholder">Imagem</div>';
  return '';
}

function buildFront(card, options) {
  var html = '<div class="card card-front">' + cardShell();

  if (card.hasBanner) {
    var bg = esc(card.bannerColor || '#3c2814');
    var bannerStyle = 'background:' + bg + 'e0;';
    var bannerClass = 'banner-overlay';
    if (card.bannerImageDataURL) {
      bannerStyle = 'background-image:url(' + card.bannerImageDataURL + ');';
      var repeat = card.bannerRepeat || 'cover';
      if (repeat === 'repeat') {
        bannerClass = 'banner-overlay has-image bg-repeat';
      } else if (repeat === 'contain') {
        bannerClass = 'banner-overlay has-image bg-contain';
      } else {
        bannerClass = 'banner-overlay has-image bg-cover';
      }
    }
    var bw = card.bannerWidth || 100;
    var bh = card.bannerHeight || 100;
    var bt = card.bannerTopSpace || 0;
    var isPartial = bw < 100 || bh < 100 || bt > 0;

    if (isPartial) {
      bannerStyle += 'top:' + bt + '%;bottom:auto;height:' + bh + '%;width:' + bw + '%;';
      if (bw < 100) bannerStyle += 'left:50%;transform:translateX(-50%);';
      html += '<div class="' + bannerClass + '" style="' + bannerStyle + '">' +
        '<div class="product-type-name">' + esc(card.type) + '<br>' + esc(card.name) + '</div>' +
        ruledLines(1) +
        '<div class="product-desc">' + esc(card.desc) + '</div>' +
        '</div>';

      var contentTop = bt + bh;
      html += '<div class="card-content" style="position:absolute;top:' + contentTop + '%;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;padding:4px 8px 8px;">' +
        '<div class="illustration-area">' + illustration(card, options || {}) + '</div>' +
        '<div class="dates">' +
          '<div class="date-row"><span class="date-label">Fabricado:</span><span class="date-value">' + esc(formatDate(card.fabricDate)) + '</span></div>' +
          '<div class="date-row"><span class="date-label">Validade:</span><span class="date-value">' + esc(formatDate(card.validDate)) + '</span></div>' +
        '</div>' +
        '</div>';
    } else {
      html += '<div class="' + bannerClass + '" style="' + bannerStyle + '">' +
        '<div class="product-type-name">' + esc(card.type) + '<br>' + esc(card.name) + '</div>' +
        ruledLines(1) +
        '<div class="product-desc">' + esc(card.desc) + '</div>' +
        '<div class="illustration-area">' + illustration(card, options || {}) + '</div>' +
        '<div class="dates">' +
          '<div class="date-row"><span class="date-label">Fabricado:</span><span class="date-value">' + esc(formatDate(card.fabricDate)) + '</span></div>' +
          '<div class="date-row"><span class="date-label">Validade:</span><span class="date-value">' + esc(formatDate(card.validDate)) + '</span></div>' +
        '</div>' +
        '</div>';
    }
  } else {
    html += '<div class="card-content">' +
      '<div class="product-type-name">' + esc(card.type) + '<br>' + esc(card.name) + '</div>' +
      ruledLines(1) +
      '<div class="product-desc">' + esc(card.desc) + '</div>' +
      descLines(1) +
      '<div class="illustration-area">' + illustration(card, options || {}) + '</div>' +
      '</div>';

    html += '<div class="dates">' +
      '<div class="date-row"><span class="date-label">Fabricado:</span><span class="date-value">' + esc(formatDate(card.fabricDate)) + '</span></div>' +
      '<div class="date-row"><span class="date-label">Validade:</span><span class="date-value">' + esc(formatDate(card.validDate)) + '</span></div>' +
      '</div>';
  }

  html += '</div>';
  return html;
}

function buildBack(card) {
  var txt = esc(card.usageText).replace(/\n/g, '<br>');
  return '<div class="card card-back">' + cardShell() +
    '<div class="card-content">' +
    '<div class="uso-title">Modo de uso:</div>' +
    '<div class="uso-text">' + txt + '</div>' +
    '</div></div>';
}
