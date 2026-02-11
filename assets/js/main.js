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

        if (data.online) {
            // Actualizar jugadores online
            const onlineCount = data.players.online;
            const onlineStatus = document.getElementById("OnlineStatus");
            if (onlineStatus) {
                onlineStatus.textContent = `${onlineCount} ONLINE`;
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
            if (onlineStatus) {
                onlineStatus.textContent = "OFFLINE";
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
