import { saveMemos } from "./storage.js";
import { renderMemos } from "./ui.js";

export function scheduleFadeAndRemove(cardEl, memo, memos) {
    const now = Date.now();
    const remaining = memo.createdAt + memo.duration - now;

    if (remaining <= 0) {
        removeMemo(cardEl, memo, memos);
        return;
    }

    // フェードアウト開始は終了の少し前
    const fadeStart = Math.max(remaining - 800, 0);

    setTimeout(() => {
        cardEl.classList.add("memo-fading");
    }, fadeStart);

    setTimeout(() => {
        removeMemo(cardEl, memo, memos);
    }, remaining);
}

function removeMemo(cardEl, memo, memos) {
    const idx = memos.findIndex((m) => m.id === memo.id);
    if (idx !== -1) {
        memos.splice(idx, 1);
        saveMemos(memos);
        renderMemos(memos);
    }
}
