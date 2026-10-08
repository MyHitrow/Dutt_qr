/**
 * Formats any Turkish or international phone number into a valid WhatsApp wa.me phone string.
 * Examples:
 *   "05535891629" -> "905535891629"
 *   "0553 589 16 29" -> "905535891629"
 *   "5535891629" -> "905535891629"
 *   "+90 553 589 16 29" -> "905535891629"
 *   "905535891629" -> "905535891629"
 */
export function formatWhatsAppNumber(phone?: string, explicitWhatsapp?: string): string {
  // Use explicit whatsapp if provided and non-empty, otherwise fallback to contact phone
  const raw = (explicitWhatsapp && explicitWhatsapp.trim().length >= 7)
    ? explicitWhatsapp.trim()
    : (phone ? phone.trim() : "");

  if (!raw) return "";

  // Strip all non-digits
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  // Standard Turkish mobile starting with 05xx (11 digits)
  if (digits.startsWith("0") && digits.length === 11) {
    return "90" + digits.slice(1);
  }

  // Standard Turkish mobile starting with 5xx (10 digits)
  if (digits.startsWith("5") && digits.length === 10) {
    return "90" + digits;
  }

  // Already prefixed with 90 (12 digits)
  if (digits.startsWith("90") && digits.length === 12) {
    return digits;
  }

  // Return cleaned digits
  return digits;
}

/**
 * Formats a clean tel: URI
 */
export function formatTelUri(phone?: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9+]/g, "");
  return cleaned;
}
