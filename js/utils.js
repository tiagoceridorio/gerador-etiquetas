function esc(str) {
  var element = document.createElement('div');
  element.textContent = str || '';
  return element.innerHTML;
}

function dateToInput(date) {
  return date.toISOString().split('T')[0];
}

function formatDate(dateStr) {
  if (!dateStr) return '__/__/__';
  var parts = dateStr.split('-');
  return parts[2] + '/' + parts[1] + '/' + parts[0].slice(2);
}

function defaultUsageForType(type) {
  return type === 'Jelly' ? USAGE_TEXTS.jelly : USAGE_TEXTS.sal;
}

function trimImage(dataURL, callback) {
  var img = new Image();
  img.onload = function() {
    var c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    var ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, c.width, c.height).data;
    var w = c.width, h = c.height;
    var top = h, left = w, right = 0, bottom = 0;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4;
        var r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
        if (a < 10) continue;
        if (r > 245 && g > 245 && b > 245) continue;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
    if (right <= left || bottom <= top) { callback(dataURL); return; }
    var pad = 4;
    top = Math.max(0, top - pad);
    left = Math.max(0, left - pad);
    right = Math.min(w - 1, right + pad);
    bottom = Math.min(h - 1, bottom + pad);
    var cw = right - left + 1, ch = bottom - top + 1;
    var out = document.createElement('canvas');
    out.width = cw; out.height = ch;
    out.getContext('2d').drawImage(c, left, top, cw, ch, 0, 0, cw, ch);
    callback(out.toDataURL('image/png'));
  };
  img.src = dataURL;
}
