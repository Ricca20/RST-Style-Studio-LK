'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ChevronRight, MessageCircle } from 'lucide-react';
import { calculateBudget } from '@/lib/budget';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default function QuotePage() {
  const tQuote = useTranslations('Quote');
  
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [pricingConfigs, setPricingConfigs] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: '',
    needsMelody: false,
    needsInstruments: false,
    needsMusicVideo: false,
  });

  useEffect(() => {
    // Fetch mock/live services and pricing rules safely on mount
    fetch('/api/public/quote-init').then(res => res.json()).then(data => {
      if(data.services) setServices(data.services);
      if(data.pricingConfigs) setPricingConfigs(data.pricingConfigs);
    }).catch(e => console.error(e));
  }, []);

  const total = calculateBudget(formData, pricingConfigs) || 0;

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const submitQuote = () => {
    // This would typically ping /api/quote, save to DB, and optionally redirect to WA
    const message = `Hello RST Style Studio! I am ${formData.name}. I would like to request a quotation for: ${formData.serviceType || 'Studio Services'}. Estimated budget showing: Rs ${total.toLocaleString()}. Please get back to me. My number is ${formData.phone}.`;
    const waUrl = buildWhatsAppUrl('+94771234567', message); // Studio Number
    window.location.assign(waUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">{tQuote('title') || 'Get a Quotation'}</h1>
          <p className="text-gray-500 text-lg">Tell us about your project, and we&apos;ll calculate an estimated budget instantly.</p>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between items-center mb-12 relative max-w-xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded-full"></div>
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 rounded-full transition-all duration-500`} style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          
          {[1, 2, 3].map(i => (
            <div key={i} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 shadow-sm ${step >= i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'}`}>
              {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12 min-h-[400px] flex flex-col relative">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. What kind of project are you planning?</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.length > 0 ? services.map(svc => (
                  <label key={svc.id} className={`cursor-pointer border-2 rounded-xl p-5 flex flex-col items-center text-center transition-all ${formData.serviceType === svc.itemKey || formData.serviceType === svc.nameEn ? 'border-blue-600 bg-blue-50 relative' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}>
                    <input type="radio" name="service" className="hidden" 
                      onChange={() => setFormData({...formData, serviceType: svc.itemKey || svc.nameEn})} 
                      checked={formData.serviceType === (svc.itemKey || svc.nameEn)} 
                    />
                    <div className="text-3xl mb-3">{svc.icon || '🎧'}</div>
                    <h3 className="font-bold text-gray-900">{svc.nameEn}</h3>
                    {formData.serviceType === (svc.itemKey || svc.nameEn) && (
                      <div className="absolute top-3 right-3 text-blue-600"><CheckCircle2 className="w-5 h-5"/></div>
                    )}
                  </label>
                )) : (
                  // Fallback hardcoded services
                  <>
                    <label className={`cursor-pointer border-2 rounded-xl p-5 flex flex-col items-center text-center transition-all ${formData.serviceType === 'AUDIO_PRODUCTION' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                      <input type="radio" name="service" className="hidden" onChange={() => setFormData({...formData, serviceType: 'AUDIO_PRODUCTION'})} checked={formData.serviceType === 'AUDIO_PRODUCTION'} />
                      <div className="text-3xl mb-3">🎹</div><h3 className="font-bold text-gray-900">Audio Production</h3>
                    </label>
                    <label className={`cursor-pointer border-2 rounded-xl p-5 flex flex-col items-center text-center transition-all ${formData.serviceType === 'VIDEO_PRODUCTION' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                      <input type="radio" name="service" className="hidden" onChange={() => setFormData({...formData, serviceType: 'VIDEO_PRODUCTION'})} checked={formData.serviceType === 'VIDEO_PRODUCTION'} />
                      <div className="text-3xl mb-3">🎬</div><h3 className="font-bold text-gray-900">Video Shoot</h3>
                    </label>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Enhance your package</h2>
              
              <div className="space-y-4">
                <label className={`cursor-pointer flex items-center justify-between p-5 border-2 rounded-xl transition-all ${formData.needsMelody ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Custom Melody Composition</h4>
                    <p className="text-sm text-gray-500">Need us to create the vocal tune entirely from scratch.</p>
                  </div>
                  <input type="checkbox" className="w-6 h-6 text-blue-600 rounded" checked={formData.needsMelody} onChange={e => setFormData({...formData, needsMelody: e.target.checked})} />
                </label>
                
                <label className={`cursor-pointer flex items-center justify-between p-5 border-2 rounded-xl transition-all ${formData.needsInstruments ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Live Instruments</h4>
                    <p className="text-sm text-gray-500">Session musicians playing real guitars, flutes, etc.</p>
                  </div>
                  <input type="checkbox" className="w-6 h-6 text-blue-600 rounded" checked={formData.needsInstruments} onChange={e => setFormData({...formData, needsInstruments: e.target.checked})} />
                </label>

                <label className={`cursor-pointer flex items-center justify-between p-5 border-2 rounded-xl transition-all ${formData.needsMusicVideo ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Basic Studio Video Add-on</h4>
                    <p className="text-sm text-gray-500">A simple studio coverage video while recording.</p>
                  </div>
                  <input type="checkbox" className="w-6 h-6 text-blue-600 rounded" checked={formData.needsMusicVideo} onChange={e => setFormData({...formData, needsMusicVideo: e.target.checked})} />
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Almost Done! Let&apos;s get in touch.</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Kasun" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (WhatsApp Active)</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+94 77 ..." />
                </div>

                <div className="mt-8 bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600 flex items-center justify-between">
                  <div>
                    <span className="text-blue-800 text-sm font-bold uppercase tracking-wider block">Estimated Budget</span>
                    <span className="text-3xl font-black text-gray-900 mt-1 block">Rs {total > 0 ? total.toLocaleString() : 'Negotiable'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-8 mt-auto border-t flex items-center justify-between">
            <button 
              onClick={handlePrev}
              className={`px-6 py-3 font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition ${step === 1 ? 'invisible' : 'visible'}`}
            >
              Back
            </button>
            
            {step < 3 ? (
              <button 
                onClick={handleNext}
                disabled={step === 1 && !formData.serviceType}
                className="bg-gray-900 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button 
                onClick={submitQuote}
                disabled={!formData.name || !formData.phone}
                className="bg-[#25D366] hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition flex items-center gap-2 shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5" /> Send via WhatsApp
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
  
