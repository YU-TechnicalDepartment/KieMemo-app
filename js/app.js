import { loadMemos, saveMemos } from "./storage.js";
import { renderMemos, openEditor, closeEditor } from "./ui.js";

let memos = loadMemos();
renderMemos(memos);

document.getElementById("newMemoBtn").addEventListener("click", () => {
    openEditor(null);
});

document.getElementById("closeDialogBtn").addEventListener("click", () => {
    closeEditor();
});

document.getElementById("saveMemoBtn").addEventListener("click", () => {
    const title = document.getElementById("memoTitleInput").value.trim();
    const body = document.getElementById("memoBodyInput").value.trim();
    const duration = Number(document.getElementById("durationSelect").value);

    const deleteBtn = document.getElementById("deleteMemoBtn");
    const editingId = deleteBtn.dataset.id;

    if (editingId) {
        const memo = memos.find((m) => m.id === editingId);
        memo.title = title;
        memo.body = body;
        memo.duration = duration;
    } else {
        memos.unshift({
            id: crypto.randomUUID(),
            title,
            body,
            createdAt: Date.now(),
            duration,
        });
    }

    saveMemos(memos);
    renderMemos(memos);
    closeEditor();
});

document.getElementById("deleteMemoBtn").addEventListener("click", () => {
    const id = document.getElementById("deleteMemoBtn").dataset.id;
    memos = memos.filter((m) => m.id !== id);
    saveMemos(memos);
    renderMemos(memos);
    closeEditor();
});
