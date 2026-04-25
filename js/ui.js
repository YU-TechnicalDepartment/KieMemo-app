import { scheduleFadeAndRemove } from "./animation.js";
import { saveMemos } from "./storage.js";

const memoListEl = document.getElementById("memoList");

export function renderMemos(memos) {
    memoListEl.innerHTML = "";

    memos.forEach((memo) => {
        const card = document.createElement("article");
        card.className = "memo-card";
        card.dataset.id = memo.id;

        const title = document.createElement("div");
        title.className = "memo-title";
        title.textContent = memo.title || "(無題)";

        const meta = document.createElement("div");
        meta.className = "memo-meta";
        meta.textContent = `あと ${Math.round(memo.duration / 1000)} 秒で消える`;

        card.appendChild(title);
        card.appendChild(meta);

        card.addEventListener("click", () => {
            openEditor(memo);
        });

        memoListEl.appendChild(card);

        scheduleFadeAndRemove(card, memo, memos);
    });
}

export function openEditor(memo) {
    document.getElementById("memoDialog").classList.remove("hidden");

    document.getElementById("dialogTitle").textContent = memo ? "メモを編集" : "新しいメモ";

    document.getElementById("memoTitleInput").value = memo?.title || "";
    document.getElementById("memoBodyInput").value = memo?.body || "";
    document.getElementById("durationSelect").value = memo?.duration || 60000;

    const deleteBtn = document.getElementById("deleteMemoBtn");
    deleteBtn.classList.toggle("hidden", !memo);
    deleteBtn.dataset.id = memo?.id || "";
}

export function closeEditor() {
    document.getElementById("memoDialog").classList.add("hidden");
}
