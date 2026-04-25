export function renderMemos(memos) {
    const memoListEl = document.getElementById("memoList");
    memoListEl.innerHTML = "";

    const now = Date.now();

    memos.forEach((memo) => {
        const remain = memo.createdAt + memo.duration - now;

        if (remain <= 0) return; // 消える

        const min = Math.floor(remain / 60000);
        const sec = Math.floor((remain % 60000) / 1000);

        const card = document.createElement("article");
        card.className = "memo-card";
        card.dataset.id = memo.id;

        const title = document.createElement("div");
        title.className = "memo-title";
        title.textContent = memo.title || "(無題)";

        const meta = document.createElement("div");
        meta.className = "memo-meta";
        meta.textContent = `あと ${min}分${sec}秒`;

        card.appendChild(title);
        card.appendChild(meta);

        card.addEventListener("click", () => {
            window.location.href = `edit.html?id=${memo.id}`;
        });

        memoListEl.appendChild(card);
    });
}
