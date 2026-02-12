const ANIMATION_DURATION = 3000;
const SOUND_ENABLED = true;

const MEME_IMAGES = [
    'ApplyMachine.jpg',
    'binary huzz.jpg',
    'BTheReason.png',
    'DBLoading.jpg',
    'DeployfirstPrayLater.jpg',
    'ForwardCV.jpg',
    'GitHUBProtections.jpg',
    'HowILearn.jpg',
    'IMG_3011.PNG',
    'MeAtWork.png',
    'WhereIsMyJob.jpg',
    'WorkMilestones.jpg'
];

document.addEventListener('DOMContentLoaded', () => {
    const netflixIntro = document.getElementById('netflixIntro');
    const landingPage = document.getElementById('landingPage');

    if (SOUND_ENABLED) {
        playIntroSound();
    }

    setTimeout(() => {
        netflixIntro.style.display = 'none';
        landingPage.classList.remove('hidden');
        initializeLandingPage();
    }, ANIMATION_DURATION);
});

function playIntroSound() {
    const tudumSound = document.getElementById('tudumSound');
    if (tudumSound) {
        tudumSound.volume = 0.5;
        tudumSound.play().catch(() => {});
    } else {
        generateIntroBeep();
    }
}

function generateIntroBeep() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.8);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.8);

        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();

            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.setValueAtTime(440, audioContext.currentTime);
            osc2.type = 'sine';

            gain2.gain.setValueAtTime(0, audioContext.currentTime);
            gain2.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.05);
            gain2.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.2);

            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 1.2);
        }, 200);
    } catch (error) {
        console.log('Audio not supported');
    }
}

function initializeLandingPage() {
    createFilmReels();

    const bgEffects = new BackgroundEffects();
    bgEffects.createParticles(15);

    const enterBtn = document.getElementById('enterBtn');
    if (enterBtn) {
        enterBtn.addEventListener('click', handleEnterDevQuest);
        enterBtn.addEventListener('click', (e) => createRipple(e, enterBtn));
    }

    animateOnScroll('.social-card', 'animate-fadeIn');
    animateOnScroll('.contact-card', 'animate-fadeIn');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) smoothScrollTo(target, 800);
        });
    });

    document.querySelectorAll('.social-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-4px)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
    });
}

function createFilmReels() {
    const container = document.querySelector('.landing-page .page-container');
    if (!container) return;

    container.appendChild(createFilmReelElement('left'));
    container.appendChild(createFilmReelElement('right'));
}

function createFilmReelElement(side) {
    const container = document.createElement('div');
    container.className = `film-reel-container film-reel-${side}`;

    const strip = document.createElement('div');
    strip.className = 'film-reel-strip';

    const imageSet = [...MEME_IMAGES, ...MEME_IMAGES, ...MEME_IMAGES];

    imageSet.forEach(imageName => {
        const frame = document.createElement('div');
        frame.className = 'film-frame';

        const img = document.createElement('img');
        img.src = `Assets/images/${imageName}`;
        img.alt = 'Dev meme';
        img.loading = 'lazy';
        img.onerror = () => frame.style.display = 'none';

        frame.appendChild(img);
        strip.appendChild(frame);
    });

    container.appendChild(strip);
    return container;
}

function handleEnterDevQuest() {
    document.body.style.transition = 'opacity 0.5s ease-out';
    document.body.style.opacity = '0';

    setTimeout(() => {
        window.location.href = 'WelcomePage/Welcome.html';
    }, 500);
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.social-card')) {
        const platform = e.target.closest('.social-card').querySelector('.social-title').textContent;
        console.log(`Opening ${platform}`);
    }
});

document.addEventListener('keydown', (e) => {
    const intro = document.getElementById('netflixIntro');
    const landing = document.getElementById('landingPage');

    if (e.key === 'Enter' && intro.style.display !== 'none') {
        intro.style.display = 'none';
        landing.classList.remove('hidden');
        initializeLandingPage();
    }

    if (e.key === ' ' && !landing.classList.contains('hidden')) {
        e.preventDefault();
        handleEnterDevQuest();
    }
});

// Konami code easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        console.log('Konami code activated');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 3000);
    }
});

window.addEventListener('load', () => {
    console.log(`Page loaded in ${performance.now().toFixed(2)}ms`);
});

window.addEventListener('beforeunload', () => {
    const bgContainer = document.querySelector('.background-particles');
    if (bgContainer && bgContainer.__bgEffects) {
        bgContainer.__bgEffects.destroy();
    }
});
