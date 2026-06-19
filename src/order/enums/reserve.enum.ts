export enum ReserveOrderStatus {
    PENDING = "PENDING", // Pendiente
    CONFIRMED = "CONFIRMED",       // Reserva aceptada/comercialmente válida
    IN_PRODUCTION = "IN_PRODUCTION", // En fabricación o preparación
    READY = "READY",               // Lista para entrega
    FULFILLED = "FULFILLED", // Entregado
    CANCELLED = "CANCELLED" // Cancelado
}