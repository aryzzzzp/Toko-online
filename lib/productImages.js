export function normalizeProductImages(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // fall back to single string value
    }

    return [trimmed];
  }

  return [];
}

export function serializeProductImages(images) {
  const normalized = normalizeProductImages(images);
  const unique = [...new Set(normalized)];
  return JSON.stringify(unique);
}

export function getPrimaryProductImage(images) {
  const normalized = normalizeProductImages(images);
  return normalized[0] || "";
}
