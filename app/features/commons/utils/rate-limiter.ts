const rateData: Map<string, { requestCount: number; startTime: number }> =
  new Map();
export const rateLimiter = (id: string): boolean => {
  const WINDOW_DURATION = 10 * 1000;
  const MAX_REQUESTS = 10;

  let requestInfo = rateData.get(id);
  const currentTime = Date.now();
  if (!requestInfo) {
    rateData.set(id, { startTime: currentTime, requestCount: 1 });
    return false;
  }
  const { requestCount, startTime } = requestInfo;
  if (currentTime > startTime + WINDOW_DURATION) {
    rateData.set(id, { startTime: currentTime, requestCount: 1 });
    return false;
  } else if (requestCount > MAX_REQUESTS) {
    return true;
  } else {
    rateData.set(id, { startTime, requestCount: requestCount + 1 });
    return false;
  }
};
