// ===========================
// Configuration
// ===========================
const SERVER_IP = "patataland.vicdev.net"; // Cambia esto por la IP real del servidor

// ===========================
// Update Server Statistics
// ===========================

/**
 * Genera un número aleatorio dentro de un rango
 */
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Actualiza las estadísticas del servidor
 * - Jugadores online
 * - Latencia
 * - Jugadores activos
 */
function updateServerStats() {
    // Actualizar jugadores online (20-30)
    const onlineCount = getRandomInRange(20, 30);
    const onlineStatus = document.getElementById("OnlineStatus");
    if (onlineStatus) {
        onlineStatus.textContent = `${onlineCount} ONLINE`;
    }

    // Actualizar latencia (30-80ms)
    const latency = getRandomInRange(30, 80);
    const latencyElement = document.getElementById("Latency");
    if (latencyElement) {
        latencyElement.textContent = `${latency}ms`;
    }

    // Actualizar jugadores activos (2.1k - 2.9k)
    const activePlayers = (getRandomInRange(21, 29) / 10).toFixed(1);
    const activePlayersElement = document.getElementById("ActivePlayers");
    if (activePlayersElement) {
        activePlayersElement.textContent = `${activePlayers}k`;
    }
}

// Actualizar estadísticas al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    updateServerStats();
    // Actualizar cada 15 segundos (15000ms)
    setInterval(updateServerStats, 15000);
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
