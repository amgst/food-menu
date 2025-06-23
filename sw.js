const CACHE_NAME = 'menucraft-v1';
const urlsToCache = [
  '/admin.html',
  '/index.html',
  '/css/styles.css',
  '/js/utils.js',
  '/js/firebase-service.js',
  '/js/components/shared-components.js',
  '/js/components/category-management.js',
  '/config/firebase-config.js'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      }
    )
  );
});

// Background sync for offline orders
self.addEventListener('sync', (event) => {
  if (event.tag === 'order-sync') {
    event.waitUntil(syncOrders());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New order received!',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'view',
        title: 'View Order',
        icon: '/icons/view.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MenuCraft - New Order!', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/admin.html#orders')
    );
  }
});

async function syncOrders() {
  // Handle offline order sync
  console.log('Syncing orders...');
}