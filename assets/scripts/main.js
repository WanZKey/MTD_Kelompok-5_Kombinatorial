'use strict';

// make carousel function global so onclick="scrollCarousel(...)" works
function scrollCarousel(direction) {
    const carousel = document.getElementById('carousel');
    const scrollAmount = 330; // width of item + gap
    if (carousel) {
        carousel.scrollLeft += direction * scrollAmount;
    }
}
window.scrollCarousel = scrollCarousel;

// Wrap DOM interactions so script works on all pages
document.addEventListener('DOMContentLoaded', function () {
    // Video Modal Popup Functionality
    const videoCards = document.querySelectorAll('.video-card');
    const videoModal = document.getElementById('videoModal');
    const closeVideoModal = document.getElementById('closeVideoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoModalTitle = document.getElementById('videoModalTitle');

    if (videoCards && videoCards.length) {
        videoCards.forEach(card => {
            card.addEventListener('click', function (e) {
                e.preventDefault();
                
                const videoId = this.getAttribute('data-video-id');
                const videoTitle = this.getAttribute('data-video-title');
                
                if (videoId) {
                    // Set video title
                    videoModalTitle.textContent = videoTitle;
                    
                    // Set YouTube embed URL
                    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;
                    videoPlayer.src = embedUrl;
                    
                    // Show modal
                    videoModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });
    }

    // Close modal
    if (closeVideoModal) {
        closeVideoModal.addEventListener('click', function () {
            videoModal.classList.remove('active');
            videoPlayer.src = ''; // Stop video
            document.body.style.overflow = ''; // Restore scrolling
        });
    }

    // Close modal when clicking outside the content
    if (videoModal) {
        videoModal.addEventListener('click', function (e) {
            if (e.target === videoModal) {
                videoModal.classList.remove('active');
                videoPlayer.src = '';
                document.body.style.overflow = '';
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            videoModal.classList.remove('active');
            videoPlayer.src = '';
            document.body.style.overflow = '';
        }
    });

    // Navigation functionality (SPA-style when sections exist)
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    if (navLinks && navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetPage = link.getAttribute('data-page');

                if (targetPage && document.getElementById(targetPage)) {
                    e.preventDefault();

                    // Remove active class from all nav links
                    navLinks.forEach(l => l.classList.remove('active'));
                    // Add active class to clicked link
                    link.classList.add('active');

                    // Hide all pages
                    pages.forEach(page => page.classList.remove('active'));
                    // Show selected page
                    document.getElementById(targetPage).classList.add('active');
                }
                // kalau tidak ada targetPage -> biarkan link jalan normal (redirect ke file .html)
            });
        });
    }

    // Add hover animations to exhibition cards (if present)
    const exhibitionCards = document.querySelectorAll('.exhibition-card');
    if (exhibitionCards && exhibitionCards.length) {
        exhibitionCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Add hover animations to collection items (if present)
    const collectionItems = document.querySelectorAll('.collection-item');
    if (collectionItems && collectionItems.length) {
        collectionItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                this.style.animation = 'shake 0.5s ease-in-out';
            });
            item.addEventListener('mouseleave', function () {
                this.style.animation = '';
            });
        });
    }

    // Add shake animation style once
    if (!document.getElementById('dynamic-shake-style')) {
        const style = document.createElement('style');
        style.id = 'dynamic-shake-style';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: scale(1.05) translateY(-5px) rotate(0deg); }
                25% { transform: scale(1.05) translateY(-5px) rotate(1deg); }
                75% { transform: scale(1.05) translateY(-5px) rotate(-1deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Smooth scroll for CTA button (if present)
    const cta = document.querySelector('.cta-button');
    if (cta) {
        cta.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector('#topics');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Mobile Navbar Hamburger Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuToggle && navMenu && menuOverlay) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('open');
            menuOverlay.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('open'));
        });
        menuOverlay.addEventListener('click', function () {
            navMenu.classList.remove('open');
            menuOverlay.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
        
        // Handle nav items with submenu di mobile
        document.querySelectorAll('.nav-item').forEach(navItem => {
            const link = navItem.querySelector('.nav-link');
            const submenu = navItem.querySelector('.submenu');
            
            if (link && submenu) {
                // Link memiliki submenu
                link.addEventListener('click', function (e) {
                    const isMobile = window.innerWidth <= 900;
                    
                    if (isMobile) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Toggle submenu display
                        const isOpen = submenu.style.display === 'block';
                        
                        // Tutup semua submenu lain
                        document.querySelectorAll('.nav-item').forEach(item => {
                            const otherSubmenu = item.querySelector('.submenu');
                            if (otherSubmenu && otherSubmenu !== submenu) {
                                otherSubmenu.style.display = 'none';
                                item.removeAttribute('data-submenu-open');
                            }
                        });
                        
                        // Toggle submenu saat ini
                        if (isOpen) {
                            submenu.style.display = 'none';
                            navItem.removeAttribute('data-submenu-open');
                        } else {
                            submenu.style.display = 'block';
                            navItem.setAttribute('data-submenu-open', 'true');
                        }
                    }
                });
                
                // Close submenu saat submenu link diklik
                submenu.querySelectorAll('a').forEach(subLink => {
                    subLink.addEventListener('click', function () {
                        navMenu.classList.remove('open');
                        menuOverlay.classList.remove('active');
                        menuToggle.setAttribute('aria-expanded', 'false');
                        submenu.style.display = 'none';
                        navItem.removeAttribute('data-submenu-open');
                    });
                });
            } else if (link && !submenu) {
                // Link tanpa submenu - close menu setelah klik
                link.addEventListener('click', function () {
                    const isMobile = window.innerWidth <= 900;
                    if (isMobile) {
                        navMenu.classList.remove('open');
                        menuOverlay.classList.remove('active');
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    }
});
