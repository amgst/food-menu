// Enhanced Service Worker for MenuCraft Mobile Notifications
// Replace the entire sw.js file with this content

const CACHE_NAME = 'menucraft-v2';
const urlsToCache = [
  '/admin.html',
  '/index.html',
  '/css/styles.css',
  '/js/utils.js',
  '/js/firebase-service.js',
  '/js/components/shared-components.js',
  '/js/components/category-management.js',
  '/config/firebase-config.js',
  '/manifest.json'
];

console.log('🔧 Service Worker loaded');

// Install service worker
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('💾 Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        // Take control immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Cache failed:', error);
      })
  );
});

// Activate service worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker activated and ready');
    })
  );
});

// Enhanced fetch handling
self.addEventListener('fetch', (event) => {
  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('📦 Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request).then(
          (response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch((error) => {
        console.error('❌ Fetch failed:', error);
        // Return offline page if available
        return caches.match('/admin.html');
      })
  );
});

// Enhanced notification handling
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action, event.notification.data);
  
  event.notification.close();

  const action = event.action;
  const data = event.notification.data || {};
  
  if (action === 'view' || !action) {
    // Open or focus the admin page
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if admin page is already open
          for (const client of clientList) {
            if (client.url.includes('/admin.html') && 'focus' in client) {
              console.log('📱 Focusing existing admin window');
              return client.focus();
            }
          }
          
          // Open new window if none found
          if (clients.openWindow) {
            console.log('📱 Opening new admin window');
            return clients.openWindow('/admin.html#orders');
          }
        })
        .catch((error) => {
          console.error('❌ Error handling notification click:', error);
        })
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('🔔 Notification closed:', event.notification.tag);
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'order-sync') {
    event.waitUntil(syncPendingOrders());
  }
});

// Enhanced push notification handling
self.addEventListener('push', (event) => {
  console.log('📨 Push message received');
  
  let notificationData = {
    title: '🔔 MenuCraft - New Order!',
    body: 'A new order has been received.',
    icon: getNotificationIcon(),
    badge: getNotificationIcon(),
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true,
    silent: false,
    tag: 'new-order',
    actions: [
      {
        action: 'view',
        title: '👁️ View Order',
        icon: getNotificationIcon()
      },
      {
        action: 'dismiss',
        title: '✕ Dismiss'
      }
    ],
    data: {
      url: '/admin.html#orders',
      timestamp: Date.now()
    }
  };

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      console.log('📨 Push data received:', pushData);
      
      if (pushData.title) notificationData.title = pushData.title;
      if (pushData.body) notificationData.body = pushData.body;
      if (pushData.data) notificationData.data = { ...notificationData.data, ...pushData.data };
    } catch (error) {
      console.error('❌ Error parsing push data:', error);
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
      .then(() => {
        console.log('✅ Push notification shown successfully');
      })
      .catch((error) => {
        console.error('❌ Failed to show push notification:', error);
      })
  );
});

// Helper function to get notification icon
function getNotificationIcon() {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI2Y5NzMxNiIvPgo8cGF0aCBkPSJNMTIgMTZWMzJIMzZWMTZIMTJaTTMyIDE4SDE2VjMwSDMyVjE4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE4IDIySDMwVjI2SDE4VjIyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
}

// Sync pending orders (for offline functionality)
async function syncPendingOrders() {
  console.log('🔄 Syncing pending orders...');
  
  try {
    // Get pending orders from IndexedDB if implemented
    // This would sync any orders created while offline
    console.log('✅ Order sync completed');
  } catch (error) {
    console.error('❌ Order sync failed:', error);
  }
}

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('💬 Message received in Service Worker:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Handle app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        const hasUpdate = !cacheNames.includes(CACHE_NAME);
        event.ports[0].postMessage({ hasUpdate });
      })
    );
  }
});

console.log('✅ Service Worker setup complete');