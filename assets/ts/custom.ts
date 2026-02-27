// Custom theme enhancements.

type MonetPalette = {
    accent?: string;
    background?: string;
    card?: string;
};

declare global {
    interface Window {
        __monet?: {
            enabled?: boolean;
            palette?: MonetPalette;
        };
    }
}

function setupSmartBlur() {
    const root = document.documentElement;

    // If browser does not support backdrop-filter, do nothing.
    const supportsBackdrop =
        (window.CSS && CSS.supports && CSS.supports('backdrop-filter', 'blur(1px)')) ||
        (window.CSS && CSS.supports && CSS.supports('-webkit-backdrop-filter', 'blur(1px)'));
    if (!supportsBackdrop) return;

    // Respect transparency reduction preference.
    try {
        if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return;
    } catch {
        // ignore
    }

    const cards = document.querySelectorAll<HTMLElement>('.stack-card');
    if (cards.length === 0) return;

    const activate = (el: HTMLElement) => el.classList.add('is-blur-active');
    const deactivate = (el: HTMLElement) => el.classList.remove('is-blur-active');

    if (!('IntersectionObserver' in window)) {
        cards.forEach(activate);
        return;
    }

    const io = new IntersectionObserver(
        entries => {
            for (const entry of entries) {
                const el = entry.target as HTMLElement;
                if (entry.isIntersecting) activate(el);
                else deactivate(el);
            }
        },
        {
            root: null,
            threshold: 0,
            rootMargin: '200px 0px 200px 0px',
        },
    );

    cards.forEach(el => io.observe(el));
}

function tagHighlightBlocks() {
    const highlights = document.querySelectorAll<HTMLElement>('.article-content div.highlight');
    highlights.forEach(el => el.classList.add('stack-card'));
}

function initThemeEnhancements() {
    tagHighlightBlocks();
    setupSmartBlur();

    // Placeholder for future Monet palette extraction.
    // Intentionally no-op for now.
    window.__monet = window.__monet || { enabled: false };
}

window.addEventListener('load', () => {
    setTimeout(initThemeEnhancements, 0);
});
