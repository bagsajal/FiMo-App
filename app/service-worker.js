const CACHE_NAME = "powerline-inspector-v1"
const urlsToCache = ["/", "/static/js/bundle.js", "/static/css/main.css", "/manifest.json"]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(syncOfflineData())
  }
})

async function syncOfflineData() {
  try {
    const offlineInspections = await getOfflineInspections()
    if (offlineInspections.length > 0) {
      await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inspections: offlineInspections }),
      })

      // Clear offline data after successful sync
      await clearOfflineInspections()
    }
  } catch (error) {
    console.error("Background sync failed:", error)
  }
}

async function getOfflineInspections() {
  // This would typically read from IndexedDB
  return JSON.parse(localStorage.getItem("offlineInspections") || "[]")
}

async function clearOfflineInspections() {
  localStorage.removeItem("offlineInspections")
}
