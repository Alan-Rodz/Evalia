import { LRUCache } from 'lru-cache';

// ********************************************************************************
// == Type ========================================================================
export type CheckRateLimitProps = {
 requestsPerInterval: number/*amount of requests per lru-cache-interval, amount per minute if no createRateLimiter options are given*/;
 routeToken: string/*token for api route*/;
};

export type LRUCacheOptions = {
 logToDebug: boolean/*whether or not the limiter logs itself*/;
 max: number/*amount of items to store in the cache before removing old entries*/;
 ttl: number/*time for items ot live in cache before they are considered stale*/;
};

export type RateLimiter = ReturnType<typeof createRateLimiter>;

// == Function ====================================================================
export const createRateLimiter = (lruCacheOptions: LRUCacheOptions = { logToDebug: true, max: 500/*max 500 users per second*/, ttl: 60 * 1000/*1 minute*/ }) => {
 // closed over and shared across requests
 const { logToDebug, max, ttl } = lruCacheOptions;
 const tokenCache = new LRUCache<string, number>({ max, ttl });

 // NOTE: returning object for convenience of calling code
 return {
  check: (props: CheckRateLimitProps) => {
   if (logToDebug) {
    console.debug(`Checking rate limit for route: ${props.routeToken}`);
   } /* else -- do not log */

   const { requestsPerInterval, routeToken } = props;

   let tokenCount = tokenCache.get(routeToken) ?? 0/*default*/;
   let isRequestRateLimited = tokenCount > requestsPerInterval;

   tokenCount++;
   tokenCache.set(routeToken, tokenCount);

   const rateLimitHeaders = {
    'X-RateLimit-Limit': String(requestsPerInterval),
    'X-RateLimit-Remaining': isRequestRateLimited ? String(0) : String(requestsPerInterval - tokenCount),
   };

   if (logToDebug) {
    console.debug(`{${routeToken}}: ${isRequestRateLimited
     ? `rate limit exceeded: ${tokenCount} used out of ${requestsPerInterval}`
     : `rate limit not exceeded: ${tokenCount} used out of ${requestsPerInterval}`}`);
   } /* else -- do not log */

   return rateLimitHeaders;
  },
 };
};

export const createCheckRateLimitOptions = (routeToken: string, requestsPerInterval: number = 100/*default requests per minute if no createRateLimiter options were given*/): CheckRateLimitProps =>
 ({ requestsPerInterval, routeToken });

// == Util ========================================================================
export const getRateLimitStatus = (limiter: RateLimiter, props: CheckRateLimitProps) => {
 const rateLimitHeaders = limiter.check(props);
 if (rateLimitHeaders['X-RateLimit-Remaining'] === '0') { return { rateLimitHeaders, rateLimitExceeded: true }; }
 else return { rateLimitHeaders, rateLimitExceeded: false };
};
