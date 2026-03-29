// Initialize Icons
lucide.createIcons();

let selectedImg = null;

// Particle Background Engine
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

// Navigation
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
    document.getElementById('title').innerText = id === 'url' ? 'CAPTURE' : id.toUpperCase();
}

// Image Preview with Auto-Scaling
function preview(e) {
    const r = new FileReader();
    r.onload = (ev) => {
        selectedImg = ev.target.result;
        document.getElementById('preContent').innerHTML = `
            <img src="${selectedImg}" class="max-h-80 rounded-3xl mx-auto shadow-2xl border-4 border-white transition-all">
            <p class="text-[8px] font-bold text-zinc-400 mt-4 tracking-widest uppercase">Asset Locked</p>`;
    };
    r.readAsDataURL(e.target.files[0]);
}

// --- CORE STUDIO ENGINE (UPGRADED) ---
async function run() {
    const active = document.querySelector('.nav-active').id.replace('tab-', '');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const now = new Date().toLocaleDateString();

    try {
        if(active === 'text') {
            const content = document.getElementById('txtIn').value;
            if(!content) throw new Error("Empty Studio Canvas");

            // Professional Branding Header
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text("ASPEN | ARCHITECTURAL DRAFT", 20, 15);
            doc.text(now, 175, 15);
            doc.line(20, 18, 190, 18);

            // Text Formatting Logic
            doc.setFont("times", "normal");
            doc.setFontSize(12);
            const lines = doc.splitTextToSize(content, 170);
            doc.text(lines, 20, 30);
            doc.save("Aspen_Draft.pdf");

        } else if(active === 'img') {
            if(!selectedImg) throw new Error("Select Media");
            
            const props = doc.getImageProperties(selectedImg);
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            // Pro-Scaling Logic
            let width = pageWidth - 40;
            let height = (props.height * width) / props.width;
            
            if(height > pageHeight - 60) {
                height = pageHeight - 60;
                width = (props.width * height) / props.height;
            }

            const x = (pageWidth - width) / 2;
            doc.addImage(selectedImg, 'JPEG', x, 30, width, height);
            doc.save("Aspen_Image_Master.pdf");

        } else if(active === 'url') {
            const target = document.getElementById('urlIn').value;
            if(!target) throw new Error("Missing Domain");
            window.open(`https://api.html2pdf.app/v1/generate?url=${encodeURIComponent(target)}&apiKey=public`, '_blank');

        } else if(active === 'edit') {
            const { PDFDocument, rgb } = PDFLib;
            const fileInput = document.getElementById('pdfFile').files[0];
            const textOverlay = document.getElementById('editLabel').value;
            const yPercent = document.getElementById('yPos').value;

            if(!fileInput) throw new Error("No Source PDF");

            const bytes = await fileInput.arrayBuffer();
            const pdfDoc = await PDFDocument.load(bytes);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            // Overlay Logic
            firstPage.drawText(textOverlay || "ASPEN VERIFIED", {
                x: 50,
                y: (firstPage.getHeight() * (yPercent / 100)),
                size: 24,
                color: rgb(0, 0, 0)
            });

            const savedBytes = await pdfDoc.save();
            const blob = new Blob([savedBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "Aspen_Modified.pdf";
            link.click();
        }
    } catch (e) { alert("Studio Error: " + e.message); }
        }
