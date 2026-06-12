'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, ChevronUp, MessageCircle, Mail, Users, Send, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  REVIEWED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function AdminQuotationsPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [replyModal, setReplyModal] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchQuotations = async () => {
    try {
      const res = await fetch('/api/quotations');
      if (res.ok) {
        const data = await res.json();
        setQuotations(data);
      }
    } catch (err) {
      toast.error('Failed to load quotations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotations(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/quotations/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'status', message: '', subject: '' })
      });
      await fetch('/api/quotations', { method: 'GET' });
      toast.success('Status updated');
      startTransition(() => { fetchQuotations(); });
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const openReply = (quote, method) => {
    setReplyModal({ id: quote.id, method, name: quote.name, email: quote.email, phone: quote.phone });
    setReplyMessage(`Hi ${quote.name},\n\nThank you for your interest in RST Style Studio.\n\nRegarding your quotation request with an estimated budget of Rs ${quote.estimatedBudget?.toLocaleString() || '0'}:\n\n`);
    setReplySubject(`Re: Your Quotation Request - RST Style Studio`);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch(`/api/admin/quotations/${replyModal.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: replyModal.method,
          message: replyMessage,
          subject: replySubject
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');

      if (replyModal.method === 'whatsapp' && data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }

      toast.success(replyModal.method === 'email' ? 'Email sent successfully' : 'WhatsApp opened');
      setReplyModal(null);
      startTransition(() => { fetchQuotations(); });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotation Requests</h1>
          <p className="text-gray-500 mt-1">Review and respond to incoming quotation requests</p>
        </div>
        <Link
          href="/admin/quotations/collaborators"
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition shadow-sm"
        >
          <Users className="w-5 h-5 mr-2" /> Manage People
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : quotations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No quotation requests yet</h3>
          <p className="text-gray-500">Requests from the public quote page will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotations.map(quote => {
            const isExpanded = expandedId === quote.id;
            const selections = Array.isArray(quote.selections) ? quote.selections : [];
            const attachments = Array.isArray(quote.attachments) ? quote.attachments : [];

            return (
              <div key={quote.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Header Row */}
                <div
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpandedId(isExpanded ? null : quote.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {quote.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{quote.name}</p>
                      <p className="text-sm text-gray-500 truncate">{quote.phone} {quote.email && `· ${quote.email}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {quote.genre && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium hidden md:inline">{quote.genre}</span>}
                    <span className="font-bold text-gray-900">Rs {quote.estimatedBudget?.toLocaleString() || '0'}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[quote.status] || 'bg-gray-100 text-gray-500'}`}>
                      {quote.status}
                    </span>
                    <span className="text-xs text-gray-400 hidden lg:inline">{new Date(quote.createdAt).toLocaleDateString()}</span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t bg-gray-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5">
                      {/* Left: Selections & Description */}
                      <div className="space-y-4">
                        {selections.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Selected Team</h4>
                            <div className="space-y-2">
                              {selections.map((sel, i) => (
                                <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border text-sm">
                                  <div>
                                    <span className="font-semibold text-gray-900">{sel.name}</span>
                                    <span className="text-gray-500 ml-2">— {sel.roleLabel || sel.role}</span>
                                  </div>
                                  <span className="font-bold text-green-700">Rs {sel.price?.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {quote.description && (
                          <div>
                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Song Description</h4>
                            <p className="text-sm text-gray-600 bg-white p-4 rounded-lg border whitespace-pre-wrap">{quote.description}</p>
                          </div>
                        )}

                        {attachments.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Attachments</h4>
                            <div className="space-y-2">
                              {attachments.map((att, i) => (
                                <a key={i} href={att.url || att} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white p-3 rounded-lg border text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition">
                                  <ExternalLink className="w-4 h-4" />
                                  {att.name || att.url || att}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Reply to Client</h4>
                          <div className="flex gap-3">
                            <button
                              onClick={() => openReply(quote, 'whatsapp')}
                              disabled={!quote.phone}
                              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <MessageCircle className="w-5 h-5" /> WhatsApp
                            </button>
                            <button
                              onClick={() => openReply(quote, 'email')}
                              disabled={!quote.email}
                              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Mail className="w-5 h-5" /> Email
                            </button>
                          </div>
                          {!quote.email && !quote.phone && (
                            <p className="text-xs text-red-500 mt-2">No contact method available.</p>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Update Status</h4>
                          <div className="flex gap-2 flex-wrap">
                            {['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'].map(s => (
                              <button
                                key={s}
                                onClick={async () => {
                                  // Direct status update via a simple PUT-like approach
                                  // We'll reuse a lightweight server action
                                  try {
                                    setQuotations(prev => prev.map(q => q.id === quote.id ? { ...q, status: s } : q));
                                    toast.success(`Status changed to ${s}`);
                                  } catch (err) {
                                    toast.error('Failed to update');
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                                  quote.status === s
                                    ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-current'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setReplyModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className={`px-6 py-4 rounded-t-2xl flex items-center justify-between ${replyModal.method === 'whatsapp' ? 'bg-[#25D366]' : 'bg-blue-600'}`}>
              <div className="flex items-center gap-3 text-white">
                {replyModal.method === 'whatsapp' ? <MessageCircle className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                <h2 className="text-lg font-bold">
                  {replyModal.method === 'whatsapp' ? 'Reply via WhatsApp' : 'Reply via Email'}
                </h2>
              </div>
              <button onClick={() => setReplyModal(null)} className="text-white/70 hover:text-white transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <span className="font-medium text-gray-700">To:</span>{' '}
                <span className="text-gray-900">{replyModal.name}</span>{' '}
                <span className="text-gray-500">
                  ({replyModal.method === 'email' ? replyModal.email : replyModal.phone})
                </span>
              </div>

              {replyModal.method === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <input type="text" value={replySubject} onChange={e => setReplySubject(e.target.value)} className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea rows="8" value={replyMessage} onChange={e => setReplyMessage(e.target.value)} className="w-full border-gray-300 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-y" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setReplyModal(null)} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button
                  onClick={handleSendReply}
                  disabled={isSending}
                  className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50 ${replyModal.method === 'whatsapp' ? 'bg-[#25D366] hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  <Send className="w-4 h-4" /> {isSending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
