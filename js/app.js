import { loadMemos } from "./storage.js";
import { renderMemos } from "./ui.js";

let memos = loadMemos();
renderMemos(memos);

document.getElementById("newMemoBtn").addEventListener("click", () => {
    window.location.href = "edit.html";
});
