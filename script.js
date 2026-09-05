// Mobile nav toggle
function initializeNavToggle() {
    const toggle = document.getElementById('navToggle');
    const header = document.querySelector('.site-header');
    if (!toggle || !header) {
        return;
    }

    toggle.addEventListener('click', function() {
        const isOpen = header.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    header.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('nav-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Footer copyright year
function initializeFooterYear() {
    const yearEl = document.getElementById('footerYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// Shop section — 3D coverflow carousel cycling through wardrobe subcategories
function initializeCategoryFan() {
    const container = document.getElementById('categoryFan');
    const categories = window.MIRRA_CATEGORIES;
    if (!container || !Array.isArray(categories) || categories.length === 0) {
        return;
    }

    // Fisher-Yates shuffle so the fan cycles through subcategories in a
    // random order each page load, instead of the data file's alphabetical order.
    const shuffled = categories.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = tmp;
    }

    const total = shuffled.length;
    let current = 0;
    let timer = null;

    const cards = shuffled.map(function(cat) {
        const card = document.createElement('div');
        card.className = 'cat-card';

        const imageWrap = document.createElement('div');
        imageWrap.className = 'cat-card__image-wrap';
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.alt = cat.sub_category;
        img.src = cat.image_url;
        img.addEventListener('error', function() {
            card.classList.add('cat-card--noimg');
        });
        imageWrap.appendChild(img);

        const info = document.createElement('div');
        info.className = 'cat-card__info';
        const brand = document.createElement('span');
        brand.className = 'cat-card__brand';
        brand.textContent = 'MIRRA';
        const name = document.createElement('h3');
        name.textContent = cat.sub_category;
        const caption = document.createElement('p');
        caption.textContent = 'Curated by MIRRA AI';
        info.appendChild(brand);
        info.appendChild(name);
        info.appendChild(caption);

        card.appendChild(imageWrap);
        card.appendChild(info);
        container.appendChild(card);
        return card;
    });

    function layout() {
        cards.forEach(function(card, i) {
            let offset = i - current;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
            const abs = Math.abs(offset);

            if (abs > 3) {
                card.style.opacity = '0';
                card.style.zIndex = '0';
                card.style.pointerEvents = 'none';
                const side = offset > 0 ? 1 : -1;
                card.style.transform = 'translate(-50%, -50%) translateX(' + (side * 520) + 'px) translateZ(-260px) scale(0.4)';
                return;
            }

            const sign = Math.sign(offset);
            const tx = sign * abs * 148;
            const tz = abs === 0 ? 60 : -abs * 90;
            const ry = -sign * abs * 26;
            const scale = abs === 0 ? 1.12 : 1 - abs * 0.15;
            const opacity = 1 - abs * 0.26;

            card.style.zIndex = String(10 - abs);
            card.style.opacity = String(Math.max(opacity, 0));
            card.style.pointerEvents = abs === 0 ? 'auto' : 'none';
            card.style.transform = 'translate(-50%, -50%) translateX(' + tx + 'px) translateZ(' + tz + 'px) rotateY(' + ry + 'deg) scale(' + scale + ')';
        });
    }

    function advance() {
        current = (current + 1) % total;
        layout();
    }

    function start() {
        stop();
        timer = window.setInterval(advance, 2800);
    }

    function stop() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    layout();

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        start();
        container.addEventListener('mouseenter', stop);
        container.addEventListener('mouseleave', start);
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stop();
            } else {
                start();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeNavToggle();
    initializeFooterYear();
    initializeCategoryFan();
});
