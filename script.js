// Elementos DOM
const darkModeToggle = document.getElementById('darkModeToggle');
const navLinks = document.querySelectorAll('.nav-links a');


// Estado inicial
const state = {
    darkMode: false,
    activeSection: 'conexion',
    functionStates: {
        carga: false,
        descarga: false,
        balanceo: false,
        emergencia: false
    }
};

// Manejo del modo oscuro
function initTheme() {
    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        state.darkMode = true;
    }
    updateThemeIcon();
}

function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
    updateThemeIcon();
}

function updateThemeIcon() {
    const lightIcon = darkModeToggle.querySelector('.light-icon');
    const darkIcon = darkModeToggle.querySelector('.dark-icon');
    if (state.darkMode) {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'inline';
    } else {
        lightIcon.style.display = 'inline';
        darkIcon.style.display = 'none';
    }
}

// Navegación
function handleNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            
            // Actualizar navegación
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Scroll suave a la sección
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            state.activeSection = targetId;
            
            // Actualizar URL sin recargar
            window.history.pushState({}, '', `#${targetId}`);
        });
    });
}




// Scroll spy para navegación activa
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Función para manejar el responsive sidebar
function initResponsiveSidebar() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    function handleResponsive(e) {
        if (e.matches) {
            // Lógica para móvil
            document.querySelector('.sidebar').classList.add('mobile');
        } else {
            // Lógica para desktop
            document.querySelector('.sidebar').classList.remove('mobile');
        }
    }
    
    mediaQuery.addListener(handleResponsive);
    handleResponsive(mediaQuery);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    handleNavigation();
    initScrollSpy();
    initResponsiveSidebar();
    
    // Event listeners
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Manejar estado inicial de la URL
    const hash = window.location.hash;
    if (hash) {
        const targetLink = document.querySelector(`a[href="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
});

// Animaciones
function addFadeInAnimation(element) {
    element.classList.add('fade-in');
    element.addEventListener('animationend', () => {
        element.classList.remove('fade-in');
    });
}

// Observador de intersección para animaciones al hacer scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            addFadeInAnimation(entry.target);
        }
    });
}, {
    threshold: 0.1
});

// Observar todas las secciones para animaciones
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});