// ==========================================
// NAVIGATION FUNCTIONALITY
// ==========================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const menuBtn = document.querySelector('.menu-btn');

// Toggle menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
});

// Toggle dropdown when top Menu button is clicked
if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
        const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', String(!expanded));

        // toggle dropdown presentation
        navMenu.classList.toggle('dropdown');
        navMenu.classList.toggle('show');
    });
}

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navMenu.classList.remove('dropdown');
        navMenu.classList.remove('show');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    });
});

// ==========================================
// SMOOTH SCROLL ENHANCEMENT
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// (Contact form removed) The site now uses direct email / social links.

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animate cards on scroll
document.querySelectorAll('.skill-category, .cert-card, .timeline-content').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Add fade in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// NAVBAR BACKGROUND ON SCROLL
// ==========================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ==========================================
// HIGHLIGHT ACTIVE SECTION
// ==========================================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary-color)';
        } else {
            link.style.color = 'var(--text-dark)';
        }
    });
});

// ==========================================
// TOOLTIP FUNCTIONALITY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to skill tags
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// ==========================================
// RESPONSIVE MENU
// ==========================================
const handleResize = () => {
    if (window.innerWidth > 768) {
        navMenu.style.display = 'flex';
    } else {
        navMenu.style.display = 'none';
    }
};

window.addEventListener('resize', handleResize);

// ==========================================
// PAGE LOAD ANIMATION
// ==========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ==========================================
// SCROLL TO TOP BUTTON
// ==========================================
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    z-index: 99;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px)';
    this.style.boxShadow = '0 8px 20px rgba(108, 92, 231, 0.4)';
});

scrollToTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '0 5px 15px rgba(108, 92, 231, 0.3)';
});

// ==========================================
// ACTIVE NAV LINK STYLING
// ==========================================
const addActiveStyle = () => {
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: var(--primary-color) !important;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
};

addActiveStyle();

console.log('Portfolio script loaded successfully!');

// ==========================================
// CERTIFICATE MODAL FUNCTIONALITY
// ==========================================
function openCertModal(title, filename) {
    const modal = document.getElementById('certModal');
    const modalTitle = document.getElementById('certModalTitle');
    const pdfViewer = document.getElementById('certPdfViewer');
    const downloadBtn = document.getElementById('certDownloadBtn');

    // Set modal title
    modalTitle.textContent = title;

    // Set PDF viewer source
    pdfViewer.src = 'certificates/' + filename;

    // Set download button
    downloadBtn.href = 'certificates/' + filename;
    downloadBtn.download = filename;

    // Show modal
    modal.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    modal.classList.remove('active');

    // Allow body scroll
    document.body.style.overflow = 'auto';

    // Clear PDF viewer
    document.getElementById('certPdfViewer').src = '';
}

// Close modal when clicking outside the modal content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('certModal');
    const modalContent = document.querySelector('.cert-modal-content');

    if (event.target === modal) {
        closeCertModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCertModal();
    }
});
