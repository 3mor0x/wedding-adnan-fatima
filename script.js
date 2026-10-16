// 1. Firebase Config لرسائل تهاني عدنان وفاطمة
const firebaseConfig = {
    databaseURL: "https://wedding-apps-cc913-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const wishesRef = database.ref('wishes/adnan_fatima');

// 2. التحكم في الموسيقى والديسك
const audio = document.getElementById('bg-music');
const disk = document.getElementById('musicDisk');
let isAudioPlaying = false;

function openInvitationAction() {
    const flap = document.getElementById('envTopFlap');
    const seal = document.getElementById('waxSeal');
    const card = document.querySelector('.env-card-insert');
    const envelopeScreen = document.getElementById('envelopeScreen');

    // فتح غطاء الظرف الشمعي أولاً
    if (seal) seal.style.opacity = '0';
    if (flap) flap.classList.add('flap-open');

    // إخراج كارت الدعوة من داخل الظرف بنعومة
    setTimeout(() => {
        if (card) card.classList.add('card-slide-up');
    }, 250);

    // سحب شاشة الظرف بالكامل لأعلى لإظهار محتوى الدعوة
    setTimeout(() => {
        envelopeScreen.classList.add('opened');
    }, 750);

    // بدء تشغيل الأغنية بالتزامن مع الفتح
    audio.play().then(() => {
        isAudioPlaying = true;
        disk.classList.add('disk-spinning');
    }).catch(err => {
        console.log("Audio autoplay restricted", err);
    });
}

function toggleAudio() {
    if (isAudioPlaying) {
        audio.pause();
        isAudioPlaying = false;
        disk.classList.remove('disk-spinning');
    } else {
        audio.play().then(() => {
            isAudioPlaying = true;
            disk.classList.add('disk-spinning');
        });
    }
}

// 3. العداد التنازلي: الإثنين 26 أكتوبر 2026 الساعة 7:00 مساءً
const weddingTimestamp = new Date('October 26, 2026 19:00:00').getTime();

setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingTimestamp - now;

    if (distance > 0) {
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(d).padStart(2, '0');
        document.getElementById('hours').innerText = String(h).padStart(2, '0');
        document.getElementById('minutes').innerText = String(m).padStart(2, '0');
        document.getElementById('seconds').innerText = String(s).padStart(2, '0');
    } else {
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
    }
}, 1000);

// 4. استرجاع وعرض المباركات من Firebase
document.addEventListener('DOMContentLoaded', () => {
    wishesRef.on('child_added', (snapshot) => {
        const wish = snapshot.val();
        renderWish(wish);
    });
});

function addWish() {
    const nameInput = document.getElementById('guestName');
    const msgInput = document.getElementById('guestMessage');
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if (name && msg) {
        wishesRef.push({
            name: name,
            msg: msg,
            timestamp: Date.now()
        });
        nameInput.value = '';
        msgInput.value = '';
    }
}

function renderWish(wish) {
    const feed = document.getElementById('wishesFeed');
    if (!feed) return;

    let timeString = '';
    if (wish.timestamp) {
        const d = new Date(wish.timestamp);
        timeString = d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const card = document.createElement('div');
    card.className = 'wish-item-card';
    card.innerHTML = `
        <div class="wish-item-name">${wish.name}</div>
        <div class="wish-item-msg">"${wish.msg}"</div>
        <div class="wish-item-date">🕒 ${timeString}</div>
    `;
    feed.prepend(card);
}