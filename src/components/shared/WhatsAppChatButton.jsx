import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/services/whatsapp';

/**
 * Floating "chat with us" button, shown when Live Chat is enabled in Settings.
 * Opens WhatsApp with the studio's number and a short greeting.
 */
export default function WhatsAppChatButton({ phone, studioName }) {
  if (!phone) return null;
  const href = buildWhatsAppUrl(phone, `Hello ${studioName || 'RST Style Studio'}! I have a question about your services.`);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white font-bold shadow-[0_8px_30px_rgba(37,211,102,0.45)] hover:scale-105 transition-transform"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden sm:inline text-sm">Chat with us</span>
    </a>
  );
}
