import { loadMemos, saveMemos } from "./storage.js";
import jsQR from "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
import QRCode from "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js";

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

// QR生成
document.getElementById("qrMakeBtn").addEventListener("click", () => {
    const data = JSON.stringify({
        title: titleEl.value,
        body: bodyEl.value,
        duration: Number(minEl.value) * 60000 + Number(secEl.value) * 1000
    });

    QRCode.toDataURL(data, { width: 300 }, (err, url) => {
        dialogMsg.innerHTML = `<img src="${url}" style="width:100%">`;
        dialog.classList.remove("hidden");
    });
});

// QR読み取り
document.getElementById("qrReadBtn").addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    dialogMsg.innerHTML = `<video id="qrVideo" autoplay style="width:100%"></video>`;
    dialog.classList.remove("hidden");
    document.getElementById("qrVideo").srcObject = stream;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scan = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);

            const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(img.data, canvas.width, canvas.height);

            if (code) {
                const data = JSON.parse(code.data);

                titleEl.value = data.title;
                bodyEl.value = data.body;

                const total = data.duration;
                minEl.value = Math.floor(total / 60000);
                secEl.value = Math.floor((total % 60000) / 1000);

                stream.getTracks().forEach(t => t.stop());
                dialog.classList.add("hidden");
                return;
            }
        }
        requestAnimationFrame(scan);
    };

    scan();
});
