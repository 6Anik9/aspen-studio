lucide.createIcons();

let selectedImg = null;

// Particle Background
const stage = document.getElementById('particle-stage');
for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'floating-pdf';
    const w = 15 + Math.random() * 30;
    p.style.width = w + 'px';
    p.style.height = (w * 1.4) + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.setProperty('--tx', (Math.random() * 200 - 100) + 'px');
    p.style.setProperty('--ty', (-300) + 'px');
    p.style.setProperty('--tr', '180deg');
    p.style.setProperty('--d', (10 + Math.random() * 10) + 's');
    stage.appendChild(p);
}

function enterStudio() {
    const ws = document.getElementById('welcome-screen');
    ws.style.opacity = '0';
    setTimeout(() => ws.style.display = 'none', 700);
}

function show(id) {
    document.querySelectorAll('.tool-view').forEach(v => v.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('nav-active'));
    document.getElementById('view-' + id).classList.remove('hidden');
    document.getElementById('tab-' + id).classList.add('nav-active');
    document.getElementById('title').innerText = id.toUpperCase();
}

function preview(e) {
    const r = new FileReader();
    r.onload = (ev) => {
        selectedImg = ev.target.result;
        document.getElementById('preContent').innerHTML = `<img src="${selectedImg}" class="max-h-80 rounded-3xl mx-auto shadow-xl">`;
    };
    r.readAsDataURL(e.target.files[0]);
}

async function run() {
    const active = document.querySelector('.nav-active').id.replace('tab-', '');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    try {
        if(active === 'text') {
            const val = document.getElementById('txtIn').value;
            if(!val) throw new Error("Canvas Empty");
            doc.setFontSize(10);
            doc.text("ASPEN STUDIO | " + new Date().toLocaleDateString(), 20, 15);
            doc.line(20, 18, 190, 18);
            doc.setFontSize(12);
            doc.text(doc.splitTextToSize(val, 170), 20, 30);
            doc.save("Aspen_Doc.pdf");

        } else if(active === 'img') {
            if(!selectedImg) throw new Error("No Image");
            const props = doc.getImageProperties(selectedImg);
            const w = 170;
            const h = (props.height * w) / props.width;
            doc.addImage(selectedImg, 'JPEG', 20, 30, w, h);
            doc.save("Aspen_Media.pdf");

        } else if(active === 'url') {
            const url = document.getElementById('urlIn').value;
            if(!url) throw new Error("URL Needed");
            // Switched to a more reliable capture link
            window.open(`https://api.screenshotmachine.com/?key=FREE&url=${encodeURIComponent(url)}&dimension=1024x768&format=pdf`, '_blank');

        } else if(active === 'edit') {
            const { PDFDocument, rgb } = PDFLib;
            const file = document.getElementById('pdfFile').files[0];
            if(!file) throw new Error("Select PDF");
            const bytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(bytes);
            const page = pdfDoc.getPages()[0];
            page.drawText(document.getElementById('editLabel').value || "VERIFIED", {
                x: 50,
                y: page.getHeight() * (document.getElementById('yPos').value / 100),
                size: 25,
                color: rgb(0,0,0)
            });
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "Aspen_Edit.pdf";
            link.click();
        }
    } catch (e) { alert(e.message); }
}
