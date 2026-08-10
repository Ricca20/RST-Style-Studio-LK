'use client';
import { useState, useEffect } from 'react';
import { X, Mail, User, Globe, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function GameRegistrationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    username: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (status === 'success' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, resendTimer]);

  if (!isOpen) return null;

  const submitRegistration = async (isResend = false) => {
    if (!isResend) setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/games/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      setStatus('success');
      setResendTimer(30);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitRegistration(false);
  };

  const handleResend = async () => {
    await submitRegistration(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Side: Registration Form */}
        <div className="w-full p-6 md:p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Join the Arcade</h2>
            <p className="text-sm text-white/60">
              Register once to play all our music games and compete on the monthly leaderboard.
            </p>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <CheckCircle className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Check Your Email!</h3>
              <p className="text-sm text-white/70">
                We've sent a magic link to <strong>{formData.email}</strong>. Click it to verify your account and start playing.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
                <button 
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${resendTimer === 0 ? '' : 'opacity-50'}`} />
                  {resendTimer > 0 ? `Resend Email in ${resendTimer}s` : 'Resend Email'}
                </button>
                <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-[#0ea5e9]/20 hover:bg-[#0ea5e9]/40 border border-[#0ea5e9]/50 text-[#0ea5e9] font-bold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-white/40" />
                  </div>
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={20}
                    pattern="^[a-zA-Z0-9_]+$"
                    title="Letters, numbers, and underscores only"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all"
                    placeholder="e.g. music_lover99"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-white/40" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Error Message */}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0ea5e9] to-[#9d2bee] hover:from-[#0c8bc4] hover:to-[#8323c9] text-white font-bold rounded-lg shadow-lg shadow-[#0ea5e9]/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {status === 'loading' || status === 'success' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Play Now'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
