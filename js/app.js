import { loadMemos, saveMemos } from "./storage.js";
import { renderMemos, openDialog, closeDialog } from "./ui.js";

const newMemoBtn = document.getElementById("newMemoBtn");
const saveMemoBtn = document.getElementById("saveMemoBtn");
const closeDialogBtn = document.getElementById("closeDialogBtn");
const memoInput = document.getElementById("memoInput");
const durationSelect = document.getElementById("durationSelect");

let memos = loadMemos();
renderMemos(memos);

newMemoBtn.addEventListener("click", () => {
    openDialog();
});

closeDialogBtn.addEventListener("click", () => {
    closeDialog();
});

saveMemoBtn.addEventListener("click", () => {
    const text = memoInput.value.trim();
    if (!text) return;

    const duration = Number(durationSelect.value) || 60000;

    const memo = {
        id: crypto.randomUUID(),
        text,
        createdAt: Date.now(),
        duration,
    };

    memos.unshift(memo);
    saveMemos(memos);
    renderMemos(memos);
    closeDialog();
});
