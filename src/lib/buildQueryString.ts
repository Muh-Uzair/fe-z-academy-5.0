export function buildQueryString<T extends object>(params: T) {
  const searchParams = new URLSearchParams();

  for (const key of Object.keys(params)) {
    const value = params[key as keyof T];
    if (typeof value === "string" || typeof value === "number") {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
