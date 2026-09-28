// Nome do cache - mude a versão (v1, v2...) quando quiser forçar a atualização do site nos celulares já instalados
const CACHE_NAME = 'cantina-ouro-branco-v1';

// Arquivos que serão salvos para uso offline
const ARQUIVOS_CACHE = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Instala o Service Worker e salva os arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Arquivos em cache');
        return cache.addAll(ARQUIVOS_CACHE);
      })
  );
  self.skipWaiting();
});

// Busca os arquivos do cache primeiro (funciona offline); se não achar, busca da internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Se estiver offline e a página não estiver em cache, mostra a página inicial como alternativa
          if (event.request.mode === 'navigate') {
            return caches.match('index.html');
          }
        });
      })
  );
});

// Atualiza o cache e remove versões antigas quando o Service Worker é ativado
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});
