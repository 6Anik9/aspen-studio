// Initialize Icons
lucide.createIcons();

let selectedImg = null;

// Particle System
const stage = document.getElementById('particle-stage');
for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'floating-pdf';
    const w = 15 + Math.random() * 35;
    p.style.width = w + 'px';
    p.style.height = (w * 1.4) + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.setProperty('--tx', (Math.random() * 400 - 200) + 'px');
    p.style.setProperty('--ty', (Math.random() * -600 - 100) + 'px');
    p.style.setProperty('--tr', (Math.random() * 360) + 'deg');
    p.style.setProperty('--d', (12 + Math.random() * 18) + 's');
    p.style.animationDelay = (Math.random() * 10) + 's';
    stage.appendChild(p);
}

// Navigation Logic
function enterStudio() { 
    const ws = document.getElementById('welcome-screen');
    ws.style.opacity = '0';
    ws.style.transform = 'translateY(25px)';
    setTimeout(() => ws.style.display = 'none', 700);
}

function show(id) {
    document.querySelectorAll('.tool-view').forEach(v => v.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('nav-active'));
    document.getElementById('view-' + id).classList.remove('hidden');
    document.getElementById('tab-' + id).classList.add('nav-active');
    document.getElementById('title').innerText = id.toUpperCase();
}

// Image Preview
function preview(e) {
    const r = new FileReader();
    r.onload = (ev) => {
        selectedImg = ev.target.result;
        document.getElementById('preContent').innerHTML = `<img src="${selectedImg}" class="max-h-60 rounded-[2.5rem] mx-auto mt-4 shadow-xl">`;
    };
    r.readAsDataURL(e.target.files[0]);
}

// PDF Export Engine
async function run() {
    const active = document.querySelector('.nav-active').id.replace('tab-', '');
    const { jsPDF } = window.jspdf;
    try {
        if(active === 'text') {
            const doc = new jsPDF();
            doc.text(document.getElementById('txtIn').value || "Aspen Project", 20, 25);
            doc.save("Aspen_Text.pdf");
        } else if(active === 'img') {
            if(!selectedImg) throw new Error("Select Media First");
            const doc = new jsPDF();
            doc.addImage(selectedImg, 'JPEG', 10, 10, 190, 150);
            doc.save("Aspen_Media.pdf");
        } else if(active === 'url') {
            const u = document.getElementById('urlIn').value;
            if(!u) throw new Error("URL Needed");
            window.open(`https://api.html2pdf.app/v1/generate?url=${encodeURIComponent(u)}&apiKey=public`, '_blank');
        } else if(active === 'edit') {
            const { PDFDocument } = PDFLib;
            const file = document.getElementById('pdfFile').files[0];
            if(!file) throw new Error("Select PDF");
            const bytes = await file.arrayBuffer();
            const doc = await PDFDocument.load(bytes);
            const page = doc.getPages()[0];
            page.drawText(document.getElementById('editLabel').value || "Aspen", {
                x: 50, y: 50, size: 20
            });
            const uri = await doc.saveAsBase64({ dataUri: true });
            const a = document.createElement('a'); a.href = uri; a.download = "Aspen_Mod.pdf"; a.click();
        }
    } catch (e) { alert(e.message); }
}
