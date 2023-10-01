export const fetchJson = async <T>(
  info: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> => {
  return fetch(info, init).then(async (blob) => {
    if (blob.status >= 400) throw new Error(await blob.text());
    return blob.json();
  });
};
