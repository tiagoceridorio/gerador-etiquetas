function printCards() {
  if (!cardBatch.length) {
    alert('Adicione ao menos um produto ao lote antes de imprimir.');
    return;
  }

  var printArea = document.getElementById('printArea');
  printArea.innerHTML = '';

  var allCards = [];
  cardBatch.forEach(function(card) {
    for (var index = 0; index < card.qty; index++) {
      allCards.push(card);
    }
  });

  var perPage = 12;
  var cols = 4;

  for (var index = 0; index < allCards.length; index += perPage) {
    var slice = allCards.slice(index, index + perPage);

    var frontPage = document.createElement('div');
    frontPage.className = 'card-page';
    frontPage.style.position = 'relative';
    slice.forEach(function(card) { frontPage.innerHTML += buildFront(card); });
    for (var fill = slice.length; fill < perPage; fill++) {
      frontPage.innerHTML += '<div class="card-placeholder"></div>';
    }
    printArea.appendChild(frontPage);

    var backPage = document.createElement('div');
    backPage.className = 'card-page';
    backPage.style.position = 'relative';

    var mirror = document.getElementById('mirrorBack').checked;

    for (var rowStart = 0; rowStart < perPage; rowStart += cols) {
      var row = slice.slice(rowStart, rowStart + cols);
      var empties = cols - row.length;
      var outputRow = mirror ? row.slice().reverse() : row;

      if (mirror) {
        for (var e = 0; e < empties; e++) {
          backPage.innerHTML += '<div class="card-placeholder"></div>';
        }
      }
      outputRow.forEach(function(card) { backPage.innerHTML += buildBack(card); });
      if (!mirror) {
        for (var e = 0; e < empties; e++) {
          backPage.innerHTML += '<div class="card-placeholder"></div>';
        }
      }
    }

    var totalChildren = backPage.children.length;
    for (var f = totalChildren; f < perPage; f++) {
      backPage.innerHTML += '<div class="card-placeholder"></div>';
    }

    printArea.appendChild(backPage);
  }

  // Tornar visível temporariamente para que fitBackCards consiga medir dimensões
  printArea.style.display = 'block';
  printArea.style.position = 'absolute';
  printArea.style.left = '-9999px';
  printArea.style.visibility = 'hidden';

  fitBackCards(printArea);
  fitIllustrationImages(printArea);

  // Restaurar — o @media print cuida da exibição
  printArea.style.display = '';
  printArea.style.position = '';
  printArea.style.left = '';
  printArea.style.visibility = '';

  setTimeout(function() { window.print(); }, 300);
}
