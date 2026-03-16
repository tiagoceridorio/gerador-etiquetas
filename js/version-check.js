(function () {
  var CHECK_INTERVAL = 5 * 60 * 1000; // verifica a cada 5 minutos
  var BANNER_ID = 'updateBanner';

  function getLocalVersion() {
    var meta = document.querySelector('meta[name="app-version"]');
    return meta ? meta.getAttribute('content') : null;
  }

  function compareVersions(local, remote) {
    var lParts = local.split('.').map(Number);
    var rParts = remote.split('.').map(Number);
    for (var i = 0; i < Math.max(lParts.length, rParts.length); i++) {
      var l = lParts[i] || 0;
      var r = rParts[i] || 0;
      if (r > l) return 1;  // remote é mais nova
      if (r < l) return -1;
    }
    return 0;
  }

  function showUpdateBanner(remoteVersion) {
    if (document.getElementById(BANNER_ID)) return;

    var banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.className = 'update-banner';
    banner.innerHTML =
      '<div class="update-banner-content">' +
        '<span class="update-banner-icon">&#x1F504;</span>' +
        '<div class="update-banner-text">' +
          '<strong>Nova versao disponivel (v' + remoteVersion + ')</strong>' +
          '<span>Atualize a pagina para usar a versao mais recente.</span>' +
        '</div>' +
        '<button class="btn btn-primary update-banner-btn" onclick="location.reload(true)">Atualizar agora</button>' +
        '<button class="update-banner-close" onclick="this.closest(\'.update-banner\').remove()" title="Fechar">&times;</button>' +
      '</div>';

    document.body.prepend(banner);
  }

  function checkForUpdate() {
    var localVersion = getLocalVersion();
    if (!localVersion) return;

    var url = 'version.json?_cb=' + Date.now();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          if (data.version && compareVersions(localVersion, data.version) > 0) {
            showUpdateBanner(data.version);
          }
        } catch (e) {
          // JSON inválido — ignora silenciosamente
        }
      }
    };
    xhr.send();
  }

  // Verificação inicial (com pequeno delay para não competir com carregamento)
  setTimeout(checkForUpdate, 3000);

  // Verificação periódica
  setInterval(checkForUpdate, CHECK_INTERVAL);

  // Verificação quando a aba volta ao foco
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      checkForUpdate();
    }
  });
})();
