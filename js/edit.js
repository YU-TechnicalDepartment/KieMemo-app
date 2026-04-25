import { loadMemos, saveMemos } from "./storage.js";

const params = new URLSearchParams(window.location.search);
const memoId = params.get("id");

let memos = loadMemos();
let editingMemo = memos.find(m => m.id === memoId) || null;

// UI
const titleEl = document.getElementById("memoTitle");
const bodyEl = document.getElementById("memoBody");
const minEl = document.getElementById("durationMin");
const secEl = document.getElementById("durationSec");
const deleteBtn = document.getElementById("deleteBtn");
const editTitle = document.getElementById("editTitle");

// ダイアログ
const dialog = document.getElementById("confirmDialog");
const dialogMsg = document.getElementById("confirmMessage");
const dialogOk = document.getElementById("confirmOk");
const dialogCancel = document.getElementById("confirmCancel");

function showDialog(message, onOk) {
    dialogMsg.textContent = message;
    dialog.classList.remove("hidden");

    dialogOk.onclick = () => {
        dialog.classList.add("hidden");
        onOk();
    };

    dialogCancel.onclick = () => {
        dialog.classList.add("hidden");
    };
}

// 編集 or 新規
if (editingMemo) {
    editTitle.textContent = "メモを編集";
    titleEl.value = editingMemo.title;
    bodyEl.value = editingMemo.body;

    const total = editingMemo.duration;
    minEl.value = Math.floor(total / 60000);
    secEl.value = Math.floor((total % 60000) / 1000);

    deleteBtn.classList.remove("hidden");
} else {
    editTitle.textContent = "新しいメモ";
}

// 保存
document.getElementById("saveBtn").addEventListener("click", () => {
    let min = Number(minEl.value);
    let sec = Number(secEl.value);

    if (sec > 59) sec = 59;

    const duration = min * 60000 + sec * 1000;

    if (editingMemo) {
        editingMemo.title = titleEl.value.trim();
        editingMemo.body = bodyEl.value.trim();
        editingMemo.duration = duration;
    } else {
        memos.unshift({
            id: crypto.randomUUID(),
            title: titleEl.value.trim(),
            body: bodyEl.value.trim(),
            createdAt: Date.now(),
            duration
        });
    }

    saveMemos(memos);
    window.location.href = "index.html";
});

// 削除
deleteBtn.addEventListener("click", () => {
    showDialog("本当に削除しますか？", () => {
        memos = memos.filter(m => m.id !== memoId);
        saveMemos(memos);
        window.location.href = "index.html";
    });
});

// 戻る
document.getElementById("backBtn").addEventListener("click", () => {
    showDialog("保存せず戻りますか？", () => {
        window.location.href = "index.html";
    });
});
