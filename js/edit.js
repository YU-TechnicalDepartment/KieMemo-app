import { loadMemos, saveMemos } from "./storage.js";

const params = new URLSearchParams(window.location.search);
const memoId = params.get("id");

let memos = loadMemos();
let editingMemo = memos.find(m => m.id === memoId) || null;

// UI 要素
const titleEl = document.getElementById("memoTitle");
const bodyEl = document.getElementById("memoBody");
const durationEl = document.getElementById("durationSelect");
const deleteBtn = document.getElementById("deleteBtn");
const editTitle = document.getElementById("editTitle");

// 編集 or 新規
if (editingMemo) {
    editTitle.textContent = "メモを編集";
    titleEl.value = editingMemo.title;
    bodyEl.value = editingMemo.body;
    durationEl.value = editingMemo.duration;
    deleteBtn.classList.remove("hidden");
} else {
    editTitle.textContent = "新しいメモ";
}

// 保存
document.getElementById("saveBtn").addEventListener("click", () => {
    const title = titleEl.value.trim();
    const body = bodyEl.value.trim();
    const duration = Number(durationEl.value);

    if (editingMemo) {
        editingMemo.title = title;
        editingMemo.body = body;
        editingMemo.duration = duration;
    } else {
        memos.unshift({
            id: crypto.randomUUID(),
            title,
            body,
            createdAt: Date.now(),
            duration
        });
    }

    saveMemos(memos);
    window.location.href = "index.html";
});

// 削除
deleteBtn.addEventListener("click", () => {
    memos = memos.filter(m => m.id !== memoId);
    saveMemos(memos);
    window.location.href = "index.html";
});

// 戻る
document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "index.html";
});
