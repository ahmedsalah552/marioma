/* =========================================
   1. تعريف العناصر (DOM Elements)
   ========================================= */
const snowBtn = document.getElementById('snowBtn');
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
const modal = document.getElementById('messageModal');
const envelope = document.querySelector('.envelope');

// تعريف عناصر الجاليري
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');

let particles = [];
let animationId;
let w, h;

/* =========================================
   2. منطق زرار التلج (Snow Logic)
   ========================================= */
function toggleSnow() {
    const isSnowing = document.body.classList.toggle('snow-mode');
    
    if (isSnowing) {
        snowBtn.innerText = "Stop Snow ☀️";
        localStorage.setItem('snowState', 'active');
        initSnow();
    } else {
        snowBtn.innerText = "Let it Snow ❄️";
        localStorage.setItem('snowState', 'inactive');
        stopSnow();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedState = localStorage.getItem('snowState');
    if (savedState === 'active') {
        document.body.classList.add('snow-mode');
        snowBtn.innerText = "Stop Snow ☀️";
        initSnow();
    }
    
    // تشغيل الجاليري
    initGallery();
});

if(snowBtn) {
    snowBtn.addEventListener('click', toggleSnow);
}

/* =========================================
   3. فيزياء التلج (Canvas Physics)
   ========================================= */
function resize() {
    if(canvas) {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resize);
resize();

class Snowflake {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radius = Math.random() * 2 + 0.5; 
        this.speedY = Math.random() * 1 + 0.5; 
        this.speedX = Math.random() * 0.5 - 0.25; 
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > h) { this.y = -5; this.x = Math.random() * w; }
        if (this.x > w) this.x = 0;
        if (this.x < 0) this.x = w;
    }

    draw() {
        if(!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        ctx.closePath();
    }
}

function initSnow() {
    if(!canvas) return;
    particles = [];
    const particleCount = 500; 
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Snowflake());
    }
    animate();
}

function animate() {
    if(!ctx) return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    animationId = requestAnimationFrame(animate);
}

function stopSnow() {
    cancelAnimationFrame(animationId);
    if(ctx) ctx.clearRect(0, 0, w, h);
}

/* =========================================
   4. منطق الظرف والرسالة (Envelope)
   ========================================= */
function openMessage() {
    if(envelope) envelope.classList.add('open');
    setTimeout(() => {
        if(modal) modal.style.display = "flex";
    }, 400);
}

function closeMessage() {
    if(modal) modal.style.display = "none";
    if(envelope) envelope.classList.remove('open');
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeMessage();
    }
}

/* =========================================
   5. منطق الجاليري (Lightbox & Keyboard)
   ========================================= */

let currentMediaIndex = 0;
let galleryItems = []; 

function initGallery() {
    // بنجمع كل الصور والفيديوهات اللي جوه media-item
    const items = document.querySelectorAll('.media-item img, .media-item video');
    galleryItems = Array.from(items);
}

// فتح العارض
function openLightbox(element, type) {
    // تحديث القائمة لضمان الترتيب
    initGallery();
    
    currentMediaIndex = galleryItems.indexOf(element);
    
    if(lightbox) lightbox.style.display = "flex";
    
    showMediaInLightbox(element, type);
}

// عرض الميديا
function showMediaInLightbox(element, type) {
    if (!element) return;

    const tagName = element.tagName.toLowerCase();

    if (tagName === 'img') {
        lightboxImg.src = element.src;
        lightboxImg.style.display = "block";
        lightboxVideo.style.display = "none";
        lightboxVideo.pause();
    } else if (tagName === 'video') {
        lightboxVideo.src = element.src;
        lightboxVideo.style.display = "block";
        lightboxImg.style.display = "none";
        // lightboxVideo.play(); // شيل الكومنت لو عايزه يشتغل اوتوماتيك
    }
}

// قفل العارض
function closeLightbox() {
    if(lightbox) lightbox.style.display = "none";
    if(lightboxVideo) lightboxVideo.pause();
}

// تغيير الميديا (أسهم الشاشة)
function changeMedia(n) {
    currentMediaIndex += n;

    if (currentMediaIndex >= galleryItems.length) {
        currentMediaIndex = 0;
    }
    if (currentMediaIndex < 0) {
        currentMediaIndex = galleryItems.length - 1;
    }

    const nextElement = galleryItems[currentMediaIndex];
    // بنعرف نوع العنصر الجديد عشان نعرضه صح
    const type = nextElement.tagName.toLowerCase(); 
    showMediaInLightbox(nextElement, type);
}

// التحكم بالكيبورد (Keyboard Navigation)
document.addEventListener('keydown', function(event) {
    // التأكد إن الـ Lightbox مفتوح
    if (lightbox && lightbox.style.display === "flex") {
        if (event.key === "ArrowLeft") {
            changeMedia(-1); // سهم شمال
        } else if (event.key === "ArrowRight") {
            changeMedia(1); // سهم يمين
        } else if (event.key === "Escape") {
            closeLightbox(); // زرار Esc
        }
    }
});

/* =========================================
   6. منطق برطمان السعادة (Reasons Jar)
   ========================================= */

const reasons = [
    "بحب طيبة قلبك اللي بتسامح دايماً و انك علي طبيعتك و دي احلي حاجة فيكي",
    "عشان أنتي السند وقفتي جنبي لما الدنيا مالت.",
    "بحب ضحكتك اوي.",
    "عشان بحس انك مسئوليتي و دايما عايز اشوفك كويسة.",
    "بحب إنك بتحاولي تكوني أحسن عشانك وعشاننا.",
    "بحب الفرحة الي بشوفها فعينك لما اجيبلك هدية حلوة.",
    "بحب غيرتك عليا حتى لو بتداريها.",
    "عشان أنتي السبب في النسخة الحلوة اللي طلعت مني.",
    "بحب إنك بتصدقيني و واثقة فيا.",
    "عشان احلي واحدة انا شوفتها.",
    "بحب جنانك و العبط الي بنعمله سوا.",
    "عشان أنتي أماني و اول واحدة بتيجي فبالي لما بكون متضايق.",
    "بحب اني بقيت افهمك من غير ما تتكلمي و بقيت فاهم انتي حاسه بايه من ناحيتي من غير ما تقولي.",
    "عشان اول مره اعرف اني  ممكن احب كده و اعمل حجات عمري معملتها عشان حد بحبه.",
    "بحب اكلك و بفرح اوي لما بتعمليه عشاني.",
    "عشان شاطرة و ذكية و عايزة تحققي حجات كتير فحياتك.",
    "بحب كسوفك لما بقولك كلمة حلوة.",
    "عشان أنتي مريومة حبيبتي.. وكفاية إنك مريومة."
];

const paperModal = document.getElementById('paperModal');
const reasonText = document.getElementById('reasonText');
const reasonNum = document.getElementById('reasonNum');

function openPaper() {
    // اختيار سبب عشوائي
    const randomIndex = Math.floor(Math.random() * reasons.length);
    const randomReason = reasons[randomIndex];

    // وضع النص في الورقة
    if(reasonText) reasonText.innerText = randomReason;
    if(reasonNum) reasonNum.innerText = randomIndex + 1;

    // فتح المودال
    if(paperModal) paperModal.style.display = "flex";
}

function closePaper() {
    if(paperModal) paperModal.style.display = "none";
}

// قفل الورقة عند الضغط خارجها
window.onclick = function(event) {
    if (event.target == paperModal) {
        closePaper();
    }
    // (للحفاظ على كود الهوم شغال برضه)
    if (event.target == modal) {
        closeMessage();
    }
}
