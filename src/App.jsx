import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Home, 
  Zap, 
  Droplets, 
  Send,
  ShieldCheck 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const EmergencyAssistanceForm = () => {
  const [loading, setLoading] = useState(false);

  // Date State Helpers
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    
    // Combine date parts for Formspree
    const dob = `${formData.get('dob_day')} ${formData.get('dob_month')} ${formData.get('dob_year')}`;
    formData.append('Full Date of Birth', dob);

    try {
      const response = await fetch("https://formspree.io/f/xnjbdjne", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        toast.success('Application submitted successfully!');
        e.target.reset();
      } else {
        toast.error('Submission failed.');
      }
    } catch (error) {
      toast.error('Connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 md:p-12 font-sans text-slate-900">
      <Toaster position="top-center" />
      
      {/* Brand Header */}
      <div className="mb-10 text-center">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6 inline-block">
          <img 
            src="/emergency-logo.jpeg" 
            alt="Logo" 
            className="h-10 w-auto"
          />
        </div>
        <h1 className="text-4xl font-extrabold text-[#1E3A8A] tracking-tight">
          Emergency Rental Assistance
        </h1>
        <p className="text-slate-500 mt-3 font-medium">Official Project Submission Portal</p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden transition-all">
        {/* Security Header */}
        <div className="bg-[#1E3A8A] p-7 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-800/50 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h2 className="font-bold text-xl tracking-wide">Secure Application</h2>
              <p className="text-blue-200/80 text-sm">Form ID: ERA-2024-PX</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-[10px] uppercase tracking-widest text-blue-300 font-bold">Priority Status</span>
            <p className="text-xs font-semibold">Active</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          
          {/* Full Name */}
          <div className="group space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <User className="w-4 h-4 text-[#1E3A8A]" /> Full Name
            </label>
            <input
              required
              name="full_name"
              type="text"
              placeholder="e.g. Alexander Hamilton"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-900/5 focus:border-[#1E3A8A] outline-none transition-all bg-slate-50/50 hover:bg-white text-lg"
            />
          </div>

          {/* Current Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#1E3A8A]" /> Current Address
            </label>
            <textarea
              required
              name="address"
              rows="2"
              placeholder="Enter street, city, and postcode"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-900/5 focus:border-[#1E3A8A] outline-none transition-all bg-slate-50/50 hover:bg-white text-lg"
            ></textarea>
          </div>

          {/* IMPROVED DATE OF BIRTH SECTION */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-[#1E3A8A]" /> Date of Birth
            </label>
            <div className="grid grid-cols-3 gap-4">
              <select name="dob_day" required className="appearance-none w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-900/5 focus:border-[#1E3A8A] bg-slate-50/50 outline-none cursor-pointer">
                <option value="">Day</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select name="dob_month" required className="appearance-none w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-900/5 focus:border-[#1E3A8A] bg-slate-50/50 outline-none cursor-pointer">
                <option value="">Month</option>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select name="dob_year" required className="appearance-none w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-900/5 focus:border-[#1E3A8A] bg-slate-50/50 outline-none cursor-pointer">
                <option value="">Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <p className="text-[11px] text-slate-400 italic">Please select your legal date of birth for verification.</p>
          </div>

          {/* Assistance Category */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Assistance Required For:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'rent', label: 'Rent', icon: <Home className="w-5 h-5" /> },
                { id: 'utilities', label: 'Utilities', icon: <Droplets className="w-5 h-5" /> },
                { id: 'electricity', label: 'Electricity', icon: <Zap className="w-5 h-5" /> },
              ].map((item) => (
                <label key={item.id} className="relative group flex items-center p-5 border-2 border-slate-100 rounded-2xl cursor-pointer transition-all hover:border-blue-200 has-[:checked]:border-[#1E3A8A] has-[:checked]:bg-blue-50/50">
                  <input type="radio" name="category" value={item.id} className="sr-only" required />
                  <div className="flex flex-col items-center w-full gap-3 text-slate-400 group-hover:text-blue-900 transition-colors has-[:checked]:text-[#1E3A8A]">
                    <div className="p-2 rounded-full bg-slate-100 group-hover:bg-blue-100 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold">{item.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3A8A] hover:bg-[#1e3a8ad1] text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 transition-all active:scale-[0.96] disabled:opacity-50 text-lg"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Final Application
              </>
            )}
          </button>
        </form>

        <div className="px-10 py-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
            Verified Partner <br/> No. 992-01
          </span>
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
             </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-slate-400 text-xs flex flex-col items-center gap-2">
        <p>&copy; 2024 Emergency Rental Assistance Program. Confidentiality Guaranteed.</p>
        <div className="flex gap-4 underline decoration-slate-200 underline-offset-4">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default EmergencyAssistanceForm;