export const SAVED_PIECES_KEY = 'luminore-saved-pieces-v1';
export function readSavedPieces(raw: string | null, validIds: Set<number>): number[] {
  try {
    const parsed: unknown = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is number => typeof id === 'number' && validIds.has(id)))] : [];
  } catch { return []; }
}
export function toggleSavedPiece(ids: number[], id: number) {
  return ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id];
}
