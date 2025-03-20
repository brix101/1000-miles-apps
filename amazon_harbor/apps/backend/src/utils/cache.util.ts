type CacheKey = string;
interface CacheData<T> {
  data: T;
  timestamp: number;
}
type Cache<T> = Record<CacheKey, CacheData<T>>;

function createCache<T>(minutes = 10) {
  const expirationTime = minutes * 60 * 1000;
  const cache: Cache<T> = {};

  function get(key: CacheKey): T | undefined {
    const cachedData = cache[key];
    if (cachedData && Date.now() - cachedData.timestamp <= expirationTime) {
      return cachedData.data;
    }
    // Remove expired item
    remove(key);
    return undefined;
  }

  function set(key: CacheKey, data: T): void {
    cache[key] = { data, timestamp: Date.now() };
  }
  function remove(key: CacheKey): void {
    delete cache[key];
  }

  function removeExpired(): void {
    const currentTimestamp = Date.now();

    Object.keys(cache).forEach((key) => {
      const cachedData = cache[key];
      if (currentTimestamp - cachedData.timestamp > expirationTime) {
        remove(key);
      }
    });
  }

  // Automatically remove expired items every 12 hours
  setInterval(removeExpired, 12 * 60 * 60 * 1000);

  return { get, set, remove };
}

export default createCache;
