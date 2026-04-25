import { saveMemos } from "./storage.js";

export function renderMemos(memos) {
    const memoListEl = document.getElementById("memoList");
    memoListEl.innerHTML = "";

    const now = Date.now();

    memos.forEach((memo) => {
        const remain = memo.createdAt + memo.duration - now;
        if (remain <= 0) return;

        const min = Math.floor(remain / 60000);
        const sec = Math.floor((remain % 60000) / 1000);

        const card = document.createElement("article");
        card.className = "memo-card";
        card.draggable = true;
        card.dataset.id = memo.id;

        card.innerHTML = `
            <div class="memo-title">${memo.title || "(無題)"}</div>
            <div class="memo-meta">あと ${min}分${sec}秒</div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `edit.html?id=${memo.id}`;
        });

        memoListEl.appendChild(card);
    });
}

export function enableDragSort(memos) {
    const list = document.getElementById("memoList");
    let dragEl = null;

    list.addEventListener("dragstart", (e) => {
        dragEl = e.target;
        e.target.style.opacity = "0.5";
    });

    list.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
        saveMemos(memos);
    });

    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        const target = e.target.closest(".memo-card");
        if (!target || target === dragEl) return;
        list.insertBefore(dragEl, target);
        reorder(memos);
    });

    function reorder(memos) {
        const ids = [...list.children].map(el => el.dataset.id);
        memos.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
        saveMemos(memos);
    }
}
