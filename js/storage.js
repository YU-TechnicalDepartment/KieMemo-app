const STORAGE_KEY = "kiememo_items_v1";

export function loadMemos() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveMemos(memos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}
