(function () {
    'use strict';

    const wrapper = document.querySelector('.fortune-cookie-wrapper');
    if (!wrapper) return;

    /* ── Quotes ── */
    const messages = [
        "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
        "Your potential is endless. Go do what you were created to do.",
        "The only way to do great work is to love what you do. If you haven't found it yet, keep looking.",
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "Don't watch the clock; do what it does. Keep going.",
        "Believe you can and you're halfway there.",
        "You are never too old to set another goal or to dream a new dream.",
        "The only limit to our realization of tomorrow is our doubts of today.",
        "It always seems impossible until it's done.",
        "The harder you work for something, the greater you'll feel when you achieve it.",
        "Your attitude determines your direction.",
        "Small steps lead to big changes. Keep moving forward.",
        "Every accomplishment starts with the decision to try.",
        "The best way to predict the future is to create it.",
        "You don't have to be great to start, but you have to start to be great.",
        "When you feel like quitting, remember why you started.",
        "The only person you should try to be better than is the person you were yesterday.",
        "Dream big, work hard, stay focused, and surround yourself with good people.",
        "Your time is limited, don't waste it living someone else's life.",
        "The secret of getting ahead is getting started.",
        "Don't limit your challenges, challenge your limits.",
        "Life is 10% what happens to you and 90% how you react to it.",
        "Opportunities don't happen. You create them.",
        "The difference between ordinary and extraordinary is that little extra.",
        "The only way to do great things is to love what you do.",
        "If you want to achieve greatness, stop asking for permission.",
        "The best revenge is massive success.",
        "Challenges are what make life interesting. Overcoming them is what makes life meaningful.",
        "If you're going through hell, keep going."
    ];

    /* ── DOM references (scoped to wrapper) ── */
    const cookie       = wrapper.querySelector('.fortune-cookie-container');
    const messageEl    = wrapper.querySelector('.fortune-paper');
    const cookiePieces = wrapper.querySelector('.cookie-pieces');
    const arrowEl      = wrapper.querySelector('.cookie-arrow');

    /* ── Skapa comeback-meddelande dynamiskt ── */
    const comebackEl = document.createElement('p');
    comebackEl.className = 'cookie-comeback';
    comebackEl.textContent = 'Kom tillbaka imorgon för en ny kaka ☺';
    wrapper.appendChild(comebackEl);

    /* ── localStorage-helpers ── */
    function todayStr() {
        return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    }

    function hasOpenedToday() {
        return localStorage.getItem('fortuneCookieDate') === todayStr();
    }

    /* ── Helpers ── */
    function getRandomMessage() {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    function createCookiePieces() {
        cookiePieces.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const piece = document.createElement('div');
            piece.className = 'cookie-piece';

            const angle    = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 50;
            const x        = Math.cos(angle) * distance;
            const y        = Math.sin(angle) * distance;
            const size     = 3 + Math.random() * 8;

            piece.style.setProperty('--tx', `${x}px`);
            piece.style.setProperty('--ty', `${y}px`);
            piece.style.setProperty('--tr', `${Math.random() * 360}deg`);

            piece.style.left   = `calc(50% - ${size / 2}px)`;
            piece.style.top    = `calc(50% - ${size / 2}px)`;
            piece.style.width  = `${size}px`;
            piece.style.height = `${size}px`;

            const lightness = Math.random() * 10 - 5;
            piece.style.backgroundColor = `hsl(40, 70%, ${55 + lightness}%)`;

            cookiePieces.appendChild(piece);
        }
    }

    function animateCookiePieces() {
        wrapper.querySelectorAll('.cookie-piece').forEach((piece, i) => {
            setTimeout(() => {
                piece.style.animation = `crackPiece ${0.8 + Math.random()}s ease-out forwards`;
            }, i * 30);
        });
    }

    /* ── Init ── */
    createCookiePieces();

    if (hasOpenedToday()) {
        /* Redan öppnad idag – stängd kaka, dölj pil, visa comeback-text */
        if (arrowEl) arrowEl.style.display = 'none';
        comebackEl.classList.add('visible');
    } else {
        /* Första besöket idag – sätt quote och vänta på klick */
        const todayQuote = getRandomMessage();
        messageEl.textContent = todayQuote;

        function handleClick() {
            cookie.removeEventListener('click', handleClick);

            /* Dölj pilen direkt vid klick */
            if (arrowEl) arrowEl.style.display = 'none';

            /* Öppna kakan */
            cookie.classList.add('cookie-open');
            animateCookiePieces();
            localStorage.setItem('fortuneCookieDate', todayStr());
            localStorage.setItem('fortuneCookieQuote', todayQuote);

            /* Stäng kakan efter 5s och visa comeback-text */
            setTimeout(() => {
                cookie.classList.remove('cookie-open');
                comebackEl.classList.add('visible');
            }, 5000);
        }

        cookie.addEventListener('click', handleClick);
    }

}());
