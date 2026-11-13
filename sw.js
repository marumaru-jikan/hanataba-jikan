// 花たばじかん — オフラインでも ひらけるように する しくみ
// 中身を 更新したら VERSION の 数字を 1つ 上げてください（古い データが 入れかわります）
const VERSION = 'hanataba-v2';
const CORE = ['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
const CARDS = ["cards/f01.jpg", "cards/f02.jpg", "cards/f03.jpg", "cards/f04.jpg", "cards/f05.jpg", "cards/f06.jpg", "cards/f07.jpg", "cards/f08.jpg", "cards/f09.jpg", "cards/f10.jpg", "cards/f11.jpg", "cards/f12.jpg", "cards/f13.jpg", "cards/f14.jpg", "cards/f15.jpg", "cards/f16.jpg", "cards/f17.jpg", "cards/f18.jpg", "cards/f19.jpg", "cards/f20.jpg", "cards/f21.jpg", "cards/f22.jpg", "cards/f23.jpg", "cards/f24.jpg", "cards/f25.jpg", "cards/f26.jpg", "cards/f27.jpg", "cards/f28.jpg", "cards/f29.jpg", "cards/f30.jpg", "cards/f31.jpg", "cards/f32.jpg", "cards/f33.jpg", "cards/f34.jpg", "cards/f35.jpg", "cards/f36.jpg", "cards/f37.jpg", "cards/f38.jpg", "cards/f39.jpg", "cards/f40.jpg", "cards/f41.jpg", "cards/f42.jpg", "cards/f43.jpg", "cards/f44.jpg", "cards/f45.jpg", "cards/f46.jpg", "cards/f47.jpg", "cards/f48.jpg", "cards/f49.jpg"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE).then(() => c.addAll(CARDS).catch(() => {}))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // 先生への 送信（POST）は そのまま 通す
  const url = new URL(req.url);
  if (req.mode === 'navigate') {                          // ページ本体：まず ネット、だめなら 保存した もの
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put('index.html', cp)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {   // 画像・フォントなど：保存した ものを 先に
    if (r.ok && (url.origin === location.origin || url.host.endsWith('gstatic.com') || url.host.endsWith('googleapis.com'))) {
      const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp));
    }
    return r;
  })));
});
