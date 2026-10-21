import { Clock, CalendarX } from 'lucide-react';

// Mirrors the bookingStatus options in Admin → Settings → Business & Booking.
const NOTICES = {
  BUSY: {
    Icon: Clock,
    className: 'bg-amber-100 text-amber-900 border-amber-300',
    text: 'We have a heavy workload right now, so replies may take a little longer than usual.',
  },
  AWAY: {
    Icon: CalendarX,
    className: 'bg-red-100 text-red-900 border-red-300',
    text: 'The studio is fully booked at the moment. You can still send a request and we will contact you when a slot opens.',
  },
};

export default function BookingStatusNotice({ status, className = '' }) {
  const notice = NOTICES[status];
  if (!notice) return null;
  const { Icon } = notice;

  return (
    <div className={`flex items-start gap-3 border rounded-2xl px-5 py-4 text-sm ${notice.className} ${className}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <p>{notice.text}</p>
    </div>
  );
}
