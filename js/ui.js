import { scheduleFadeAndRemove } from "./animation.js";
import { saveMemos } from "./storage.js";

const memoListEl = document.getElementById("memoList");

export function renderMemos(memos) {
    memoListEl.innerHTML = "";
    memos.forEach((memo) => {
        const card = document.createElement("article");
        card.className = "memo-card";
        card.dataset.id = memo.id;

        const content = document.createElement("div");
        content.textContent = memo.text;

        const meta = document.createElement("div");
        meta.className = "memo-meta";

        const created = document.createElement("span");
        created.textContent = new Date(memo.createdAt).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const timer = document.createElement("span");
        timer.className = "memo-timer";
        timer.textContent = "消えるまで: " + Math.round(memo.duration / 1000) + "秒";

        meta.appendChild(created);
        meta.appendChild(timer);

        card.appendChild(content);
        card.appendChild(meta);

        memoListEl.appendChild(card);

        scheduleFadeAndRemove(card, memo, memos);
    });
}

export function openDialog() {
    document.getElementById("memoDialog").classList.remove("hidden");
    document.getElementById("memoInput").focus();
}

export function closeDialog() {
    document.getElementById("memoDialog").classList.add("hidden");
    document.getElementById("memoInput").value = "";
}
