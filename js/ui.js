export function renderMemos(memos) {
    const memoListEl = document.getElementById("memoList");
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
        meta.textContent = `あと ${Math.round(memo.duration / 1000)} 秒`;

        card.appendChild(title);
        card.appendChild(meta);

        // 編集画面へ遷移
        card.addEventListener("click", () => {
            window.location.href = `edit.html?id=${memo.id}`;
        });

        memoListEl.appendChild(card);
    });
}
