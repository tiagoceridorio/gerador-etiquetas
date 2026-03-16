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
    var imgData = ctx.getImageData(0, 0, c.width, c.height);
    var data = imgData.data;
    var w = c.width, h = c.height;

    // Amostrar bordas (topo, base, esquerda, direita) para detectar cor de fundo
    var samples = [];
    var step = Math.max(1, Math.floor(w / 20));
    for (var sx = 0; sx < w; sx += step) {
      samples.push((0 * w + sx) * 4);           // topo
      samples.push(((h - 1) * w + sx) * 4);     // base
    }
    step = Math.max(1, Math.floor(h / 20));
    for (var sy = 0; sy < h; sy += step) {
      samples.push((sy * w + 0) * 4);           // esquerda
      samples.push((sy * w + w - 1) * 4);       // direita
    }
    var bgR = 0, bgG = 0, bgB = 0, bgCount = 0;
    for (var si = 0; si < samples.length; si++) {
      var idx = samples[si];
      if (data[idx + 3] > 200) {
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
        bgCount++;
      }
    }

    // Se a maioria das bordas tem cor opaca, remover esse fundo
    if (bgCount >= samples.length * 0.6) {
      bgR = Math.round(bgR / bgCount);
      bgG = Math.round(bgG / bgCount);
      bgB = Math.round(bgB / bgCount);
      var tol = 35;

      // Tornar pixels do fundo transparentes com flood-fill a partir das bordas
      var visited = new Uint8Array(w * h);
      var queue = [];
      // Semear com todos os pixels das bordas que são fundo
      for (var bx = 0; bx < w; bx++) {
        queue.push(bx);                   // topo
        queue.push((h - 1) * w + bx);     // base
      }
      for (var by = 1; by < h - 1; by++) {
        queue.push(by * w);               // esquerda
        queue.push(by * w + w - 1);       // direita
      }
      while (queue.length > 0) {
        var pos = queue.pop();
        if (pos < 0 || pos >= w * h || visited[pos]) continue;
        visited[pos] = 1;
        var pi = pos * 4;
        var pr = data[pi], pg = data[pi + 1], pb = data[pi + 2], pa = data[pi + 3];
        // Pixel transparente ou similar ao fundo
        var isBg = pa < 10 ||
          (Math.abs(pr - bgR) < tol && Math.abs(pg - bgG) < tol && Math.abs(pb - bgB) < tol) ||
          (pr > 240 && pg > 240 && pb > 240);
        if (!isBg) continue;
        data[pi + 3] = 0; // tornar transparente
        var px = pos % w, py = Math.floor(pos / w);
        if (px > 0) queue.push(pos - 1);
        if (px < w - 1) queue.push(pos + 1);
        if (py > 0) queue.push(pos - w);
        if (py < h - 1) queue.push(pos + w);
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // Agora recortar a área não-transparente
    var top = h, left = w, right = 0, bottom = 0;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        if (data[(y * w + x) * 4 + 3] > 10) {
          if (y < top) top = y;
          if (y > bottom) bottom = y;
          if (x < left) left = x;
          if (x > right) right = x;
        }
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
