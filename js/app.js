import { loadMemos } from "./storage.js";
import { renderMemos } from "./ui.js";

let memos = loadMemos();
renderMemos(memos);

// 1秒ごとに残り時間更新
setInterval(() => {
    memos = loadMemos();
    renderMemos(memos);
}, 1000);

document.getElementById("newMemoBtn").addEventListener("click", () => {
    window.location.href = "edit.html";
});
