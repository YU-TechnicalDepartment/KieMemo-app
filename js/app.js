import { loadMemos } from "./storage.js";
import { renderMemos, enableDragSort } from "./ui.js";

let memos = loadMemos();
let searchQuery = "";

// 初回描画
renderMemos(memos);
enableDragSort(memos);

// 1秒ごとに残り時間更新
setInterval(() => {
    memos = loadMemos();

    if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const filtered = memos.filter(m =>
            (m.title || "").toLowerCase().includes(q) ||
            (m.body || "").toLowerCase().includes(q)
        );
        renderMemos(filtered);
    } else {
        renderMemos(memos);
    }
}, 1000);

// 新規作成
document.getElementById("newMemoBtn").addEventListener("click", () => {
    window.location.href = "edit.html";
});

// 検索
document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value;

    const q = searchQuery.toLowerCase();
    const filtered = memos.filter(m =>
        (m.title || "").toLowerCase().includes(q) ||
        (m.body || "").toLowerCase().includes(q)
    );

    renderMemos(filtered);
});
