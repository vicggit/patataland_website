// ===========================
// Configuration
// ===========================
const SERVER_IP = "patataland.vicdev.net";
const API_ENDPOINT = "https://api.mcstatus.io/v2/status/java/patataland.vicdev.net";

// ===========================
// Update Server Statistics from API
// ===========================

/**
 * Mide la latencia haciendo un ping a la API
 */
async function measureLatency() {
    try {
        const startTime = performance.now();
        await fetch(API_ENDPOINT, { method: "HEAD" });
        const endTime = performance.now();
        return Math.round(endTime - startTime);
    } catch {
        return null; // Si falla, devuelve null
    }
}

/**
 * Actualiza las estadísticas del servidor desde la API
 * - Jugadores online
 * - Latencia
 * - Versión del servidor
 */
async function updateServerStats() {
    try {
        // Llamar a la API del servidor
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();
        const online = data.online;

        if (online == true) {
            // Actualizar jugadores online
            const onlineCount = data.players.online;
            const onlineStatus = document.getElementById("OnlineStatus");
            const onlineStatusCircle = document.getElementById("online-status-circle");
            if (onlineStatus) {
                onlineStatus.textContent = `${onlineCount} ONLINE`;
            }
            if (onlineStatusCircle) {
                onlineStatusCircle.classList.remove("bg-red-500");
                onlineStatusCircle.classList.add("bg-green-500");
            }
            // Medir latencia
            const latency = await measureLatency();
            const latencyElement = document.getElementById("Latency");
            if (latencyElement && latency !== null) {
                latencyElement.textContent = `${latency}ms`;
            }

            // Estimar jugadores activos (mostrar el máximo de jugadores como referencia)
            const maxPlayers = data.players.max;
            const activePlayersElement = document.getElementById("ActivePlayers");
            if (activePlayersElement) {
                // Mostrar online/max formato
                activePlayersElement.textContent = `${onlineCount}/${maxPlayers}`;
            }
        } else {
            // Si el servidor está offline
            const onlineStatus = document.getElementById("OnlineStatus");
            const onlineStatusCircle = document.getElementById("online-status-circle");
            if (onlineStatus) {
                onlineStatus.textContent = "OFFLINE";
            }
            if (onlineStatusCircle) {
                onlineStatusCircle.classList.remove("bg-green-500");
                onlineStatusCircle.classList.add("bg-red-500");
            }
        }
    } catch (error) {
        console.error("Error al actualizar estadísticas del servidor:", error);
    }
}

// Actualizar estadísticas al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    updateServerStats();
    // Actualizar cada 1 segundos (1000ms)
    setInterval(updateServerStats, 1000);
});

// ===========================
// Copy Server IP to Clipboard
// ===========================

/**
 * Maneja el click del botón "Unirse al Servidor"
 */
function handleJoinServerClick() {
    const button = document.getElementById("joinserverbtn");
    if (!button) return;

    // Copiar IP al portapapeles
    navigator.clipboard.writeText(SERVER_IP).then(() => {
        // Guardar el contenido original
        const originalHTML = button.innerHTML;
        const originalClasses = button.className;

        // Cambiar a estado "Copiado"
        button.innerHTML = '✓ DIRECCIÓN COPIADA';
        button.className = button.className
            .replace("bg-primary", "bg-green-500")
            .replace("hover:bg-beige-accent", "hover:bg-green-600");

        // Agregar animación de éxito
        button.style.transition = "all 0.3s ease";
        button.style.transform = "scale(1.05)";

        // Después de 2 segundos, volver al estado original
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.className = originalClasses;
            button.style.transform = "scale(1)";
        }, 2000);
    }).catch(() => {
        // Si falla, mostrar error
        alert("No se pudo copiar la dirección al portapapeles");
    });
}

// Agregar event listener al botón cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    const joinServerBtn = document.getElementById("joinserverbtn");
    if (joinServerBtn) {
        joinServerBtn.addEventListener("click", handleJoinServerClick);
    }
});

// ===========================
// Block Mobile Devices (Animated)
// ===========================

function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
        || window.innerWidth <= 768;
}

document.addEventListener("DOMContentLoaded", () => {

    if (isMobileDevice()) {
        const blocker = document.getElementById("mobileBlock");
        if (!blocker) return;

        // Mostrar
        blocker.classList.remove("hidden");

        // Forzar repaint y animar
        setTimeout(() => {
            blocker.classList.remove("opacity-0");
            blocker.classList.add("opacity-100");

            const box = blocker.querySelector("div");
            box.classList.remove("scale-95");
            box.classList.add("scale-100");
        }, 50);

        // Bloquear scroll
        document.body.style.overflow = "hidden";
    }

});
// ===========================
// Preloader Animation
// ===========================

window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    // Fade out
    preloader.style.opacity = "0";

    setTimeout(() => {
        preloader.style.display = "none";
    }, 700);
});
// ===========================
// Minecraft Particle Background
// ===========================

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const particleCount = 60;

    class Particle {
        constructor() {
            this.size = Math.random() * 6 + 4; // cuadrado pixel
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.opacity = Math.random() * 0.5 + 0.2;

            // Colores estilo minecraft tierra / patata
            const colors = ["#d4a373", "#f3cf44", "#8d6e63", "#a1887f"];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y -= this.speedY;
            if (this.y < -10) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.globalAlpha = 1;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
});

// ===========================
// Preloader Fade Out
// ===========================

window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    preloader.style.opacity = "0";

    setTimeout(() => {
        preloader.style.display = "none";
    }, 700);
});
// ===========================
// Hero Background Parallax (Desktop Only)
// ===========================

document.addEventListener("DOMContentLoaded", () => {
    const heroBg = document.getElementById("hero-bg");
    if (!heroBg) return;

    // Desactivar en móvil
    if (window.innerWidth <= 768) return;

    heroBg.style.transition = "transform 0.1s ease-out";
    heroBg.style.willChange = "transform";

    const strength = 20; // intensidad del parallax

    window.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * strength;
        const y = (e.clientY / window.innerHeight - 0.5) * strength;

        heroBg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    });

    // Reset suave cuando el ratón sale
    window.addEventListener("mouseleave", () => {
        heroBg.style.transform = "translate(0,0) scale(1.05)";
    });
});
// ===========================
// Mockup 3D Tilt Sutil on Mouse
// ===========================

document.addEventListener("DOMContentLoaded", () => {
    const mockup = document.querySelector(".mockup-3d-float");
    if (!mockup) return;

    // Desactivar en móvil
    if (window.innerWidth <= 768) return;

    const maxTilt = 6; // máximo tilt reducido para sutilidad

    mockup.style.transition = "transform 0.15s ease-out";
    mockup.style.transformStyle = "preserve-3d";

    mockup.addEventListener("mousemove", (e) => {
        const rect = mockup.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const halfWidth = rect.width / 2;
        const halfHeight = rect.height / 2;

        const percentX = (x - halfWidth) / halfWidth;
        const percentY = (y - halfHeight) / halfHeight;

        const rotateY = percentX * maxTilt * -1;
        const rotateX = percentY * maxTilt;

        mockup.style.transform = `rotateY(${-18 + rotateY}deg) rotateX(${8 + rotateX}deg) rotateZ(1deg)`;
    });

    mockup.addEventListener("mouseleave", () => {
        mockup.style.transform = "rotateY(-18deg) rotateX(8deg) rotateZ(1deg)";
    });
});
// Scroll hint desaparecer al hacer scroll
const scrollHint = document.getElementById("scrollHint");
if (scrollHint) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            scrollHint.style.opacity = 0;
            scrollHint.style.transition = "opacity 0.5s";
        } else {
            scrollHint.style.opacity = 1;
        }
    });
}
const mockup = document.querySelector(".mockup-3d-float");
if (mockup && window.innerWidth > 768) {
    const maxTilt = 6;
    const maxShadowOffset = 20; // Cuánto se mueve la sombra
    mockup.style.transformStyle = "preserve-3d";

    mockup.addEventListener("mousemove", (e) => {
        const rect = mockup.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const percentX = (x - rect.width / 2) / (rect.width / 2);
        const percentY = (y - rect.height / 2) / (rect.height / 2);

        // Tilt
        const rotateY = -18 + percentX * maxTilt * -1;
        const rotateX = 8 + percentY * maxTilt;

        // Shadow dinámico
        const shadowX = -20 + percentX * maxShadowOffset;
        const shadowY = 40 + percentY * maxShadowOffset;

        mockup.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(1deg)`;
        mockup.style.boxShadow = `${shadowX}px ${shadowY}px 80px -10px rgba(0,0,0,0.3), -5px 10px 20px -5px rgba(0,0,0,0.2)`;
    });

    mockup.addEventListener("mouseleave", () => {
        mockup.style.transform = "rotateY(-18deg) rotateX(8deg) rotateZ(1deg)";
        mockup.style.boxShadow = "-20px 40px 80px -10px rgba(0,0,0,0.3), -5px 10px 20px -5px rgba(0,0,0,0.2)";
    });
}
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
const numParticles = 30; // menos porque son más visibles

// Cargar imagen de la patata
const potatoImg = new Image();
potatoImg.src = './assets/img/potato.webp';

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Crear partículas solo en los bordes
for (let i = 0; i < numParticles; i++) {
    let x;
    if (Math.random() > 0.5) {
        x = Math.random() * 0.1 * canvas.width; // borde izquierdo
    } else {
        x = canvas.width - Math.random() * 0.1 * canvas.width; // borde derecho
    }

    particles.push({
        x: x,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10, // tamaño patata
        speed: Math.random() * 0.2 + 0.05
    });
}

// Animar partículas (mini patatas)
let lastScrollY = window.scrollY;
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        // Movimiento según scroll
        const scrollDiff = window.scrollY - lastScrollY;
        p.y += scrollDiff * p.speed;

        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        // Dibujar patata
        if (potatoImg.complete) { // dibuja solo si la imagen está cargada
            ctx.drawImage(potatoImg, p.x, p.y, p.size, p.size);
        }
    });

    lastScrollY = window.scrollY;
    requestAnimationFrame(animateParticles);
}

potatoImg.onload = () => {
    animateParticles();
};
