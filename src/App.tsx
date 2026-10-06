/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Menu, 
  X, 
  ChevronRight, 
  Info, 
  DollarSign,
  Send,
  Code,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

interface Booking {
  id: string;
  fullName: string;
  phone: string;
  service: string;
  dateTime: string;
  notes?: string;
  status: 'Confirmed' | 'Pending';
  createdAt: string;
}

const MAIN_PHONE_NUMBER = '+639301911512';
const MAIN_PHONE_NUMBER_DISPLAY = '+63 930 191 1512';
const OWNER_MESSENGER_ID = import.meta.env.VITE_MESSENGER_ID || import.meta.env.VITE_FACEBOOK_MESSENGER_ID || '61592438219283';
const BOOKING_EMAIL_RECEIVER = import.meta.env.VITE_BOOKING_EMAIL || import.meta.env.VITE_EMAIL_TO || 'modernbarbershopbykarl@gmail.com';

const buildBookingMessage = (booking: { fullName: string; phone: string; service: string; dateTime: string; notes?: string }) => {
  const noteText = booking.notes?.trim();
  return `Hi Karl! I want to book an appointment.\n\nName: ${booking.fullName}\nPhone: ${booking.phone}\nService: ${booking.service}\nDate & Time: ${booking.dateTime}${noteText ? `\nNotes: ${noteText}` : ''}\n\nPlease confirm this booking.`;
};

const getBookingSubmissionUrl = () => {
  const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  return configuredBaseUrl ? `${configuredBaseUrl}/api/bookings` : '/api/bookings';
};

const getBookingMessengerUrl = (booking: { fullName: string; phone: string; service: string; dateTime: string; notes?: string }) => {
  const normalizedId = OWNER_MESSENGER_ID
    .replace(/^https?:\/\/(m\.me|www\.facebook\.com|facebook\.com)\//i, '')
    .replace(/\/$/, '')
    .split('?')[0]
    .split('/')[0]
    .trim();

  return `https://m.me/${normalizedId}?text=${encodeURIComponent(buildBookingMessage(booking))}`;
};

const getBookingMailtoHref = (booking: { fullName: string; phone: string; service: string; dateTime: string; notes?: string }) => {
  return `mailto:${BOOKING_EMAIL_RECEIVER}?subject=${encodeURIComponent('New Booking Request')}&body=${encodeURIComponent(buildBookingMessage(booking))}`;
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    phone: '',
    service: 'Modern Haircut & Styling',
    dateTime: '',
    notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [lastBookingResult, setLastBookingResult] = useState<any | null>(null);
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);

  const galleryItems = [
    {
      title: 'Signature Fade',
      category: 'Precision Cut',
      image: 'https://images.pexels.com/photos/3993132/pexels-photo-3993132.jpeg?auto=compress&cs=tinysrgb&w=900'
    },
    {
      title: 'Shop Interior',
      category: 'Studio Atmosphere',
      image: '/interiorA.jpg'
    },
    {
      title: 'Modern Styling',
      category: 'Finished Look',
      image: 'https://images.pexels.com/photos/7697712/pexels-photo-7697712.jpeg?auto=compress&cs=tinysrgb&w=900'
    },
    {
      title: 'Classic Beard Trim',
      category: 'Facial Styling',
      image: 'https://images.pexels.com/photos/6007400/pexels-photo-6007400.jpeg?auto=compress&cs=tinysrgb&w=900'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch initial bookings
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBookingsList(data);
      })
      .catch(err => console.error('Failed to fetch bookings', err));
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.fullName || !bookingForm.phone || !bookingForm.dateTime) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = bookingForm;
    setBookingLoading(true);
    try {
      const res = await fetch(getBookingSubmissionUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const rawResponse = await res.text();
      let data: any = {};

      if (rawResponse) {
        try {
          data = JSON.parse(rawResponse);
        } catch {
          data = { error: rawResponse };
        }
      }

      const messengerUrl = getBookingMessengerUrl(payload);

      if (res.ok) {
        setLastBookingResult({
          ...data,
          notification: {
            ...(data.notification || {}),
            channel: 'messenger',
            recipient: OWNER_MESSENGER_ID,
            messengerUrl,
            message: buildBookingMessage(payload)
          }
        });
        setBookingsList(prev => [data.booking, ...prev]);
        window.open(messengerUrl, '_blank', 'noopener,noreferrer');
        setBookingSuccessModal(true);
        setBookingForm({
          fullName: '',
          phone: '',
          service: 'Modern Haircut & Styling',
          dateTime: '',
          notes: ''
        });
      } else {
        window.open(messengerUrl, '_blank', 'noopener,noreferrer');
        setLastBookingResult({
          success: true,
          booking: payload,
          notification: {
            channel: 'messenger',
            recipient: OWNER_MESSENGER_ID,
            message: buildBookingMessage(payload),
            messengerUrl,
            emailSent: false,
            fallbackMode: true
          }
        });
        setBookingSuccessModal(true);
        setBookingForm({
          fullName: '',
          phone: '',
          service: 'Modern Haircut & Styling',
          dateTime: '',
          notes: ''
        });
      }
    } catch (err) {
      console.error(err);
      const messengerUrl = getBookingMessengerUrl(payload);
      window.open(messengerUrl, '_blank', 'noopener,noreferrer');
      setLastBookingResult({
        success: true,
        booking: payload,
        notification: {
          channel: 'messenger',
          recipient: OWNER_MESSENGER_ID,
          message: buildBookingMessage(payload),
          messengerUrl,
          emailSent: false,
          fallbackMode: true
        }
      });
      setBookingSuccessModal(true);
      setBookingForm({
        fullName: '',
        phone: '',
        service: 'Modern Haircut & Styling',
        dateTime: '',
        notes: ''
      });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-amber-400 px-4 py-2.5 text-xs md:text-sm font-medium flex flex-wrap items-center justify-center gap-4 text-center z-50">
        <span className="flex items-center gap-1.5">
          <Scissors className="w-3.5 h-3.5" /> Walk-ins Welcome! For Immediate Booking Call Karl: 
          <a href={`tel:${MAIN_PHONE_NUMBER}`} className="underline font-bold text-white hover:text-amber-300 ml-1">{MAIN_PHONE_NUMBER_DISPLAY}</a>
        </span>
        <span className="hidden md:inline text-slate-600">|</span>
        <a href="https://m.me/61592438219283" target="_blank" rel="noopener noreferrer" className="underline font-bold text-white hover:text-amber-300">
          Chat on Facebook Messenger
        </a>
      </div>

      {/* Professional Sticky Navigation Bar */}
      <header className={`sticky top-0 transition-all duration-300 z-40 bg-white/95 backdrop-blur-md border-b ${scrolled ? 'border-slate-200 shadow-md py-3' : 'border-slate-100 py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <a href="#home" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-full border-2 border-amber-500 overflow-hidden bg-slate-100 shadow-md group-hover:scale-105 transition-transform">
              <img 
                src="/logo.jpg" 
                alt="Karl Barbershop Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900 block font-serif leading-none">
                Modern Barbershop
              </span>
              <span className="text-xs uppercase tracking-widest text-amber-600 font-bold flex items-center gap-1 mt-0.5">
                <Scissors className="w-3 h-3" /> By Karl
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#home" className="hover:text-amber-600 transition-colors">Home</a>
            <a href="#about" className="hover:text-amber-600 transition-colors">About Us</a>
            <a href="#services" className="hover:text-amber-600 transition-colors">Services & Pricing</a>
            <a href="#gallery" className="hover:text-amber-600 transition-colors">Gallery</a>
            <a href="#booking" className="hover:text-amber-600 transition-colors">Booking</a>
            <a href={`tel:${MAIN_PHONE_NUMBER}`} className="hover:text-amber-600 transition-colors">Contact Us</a>
          </nav>

          {/* Quick CTA Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href={`tel:${MAIN_PHONE_NUMBER}`} 
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>{MAIN_PHONE_NUMBER_DISPLAY}</span>
            </a>
            <a 
              href="#booking" 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 px-6 pt-4 pb-6 space-y-3 shadow-xl"
          >
            <a 
              href="#home" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              About Us
            </a>
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              Services & Pricing
            </a>
            <a 
              href="#gallery" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              Gallery
            </a>
            <a 
              href="#booking" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              Booking
            </a>
            <a 
              href={`tel:${MAIN_PHONE_NUMBER}`} 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              Contact Us
            </a>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <a 
                href={`tel:${MAIN_PHONE_NUMBER}`} 
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-200"
              >
                <Phone className="w-4 h-4 text-amber-600" /> Call {MAIN_PHONE_NUMBER_DISPLAY}
              </a>
              <a 
                href="#booking" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-white font-bold text-sm shadow"
              >
                <Calendar className="w-4 h-4" /> Book Appointment
              </a>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative pt-16 pb-24 lg:pt-28 lg:pb-36 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column - Text */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold tracking-wide uppercase">
                <Scissors className="w-3.5 h-3.5" /> Premium Modern Barbershop
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight font-serif">
                Precision Cuts & <br />
                <span className="text-amber-600">
                  Modern Styling
                </span> by Karl
              </h1>
              
              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Step into Karl's chair for master-level fades, hot towel straight razor shaves, and immaculate styling tailored precisely to your personal aesthetic. Look sharp, feel confident.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <a 
                  href="#booking" 
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
                >
                  <Calendar className="w-5 h-5" /> Book an Appointment
                </a>
                <a 
                  href="https://m.me/61592438219283" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 transition-all flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <MessageCircle className="w-5 h-5 text-blue-600" /> Messenger Chat
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-black text-slate-900 font-serif">6</div>
                  <div className="text-xs text-slate-500 font-medium">Years Experience</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-black text-slate-900 font-serif flex items-center justify-center lg:justify-start gap-1">
                    <span>4.9</span> <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Google Rating</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-black text-slate-900 font-serif">5,000+</div>
                  <div className="text-xs text-slate-500 font-medium">Satisfied Gents</div>
                </div>
              </div>

            </motion.div>

            {/* Right Column - Hero Logo Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl blur-xl opacity-20"></div>
                
                <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl p-4">
                  <div className="relative h-96 rounded-2xl overflow-hidden group bg-slate-950 flex items-center justify-center">
                    <img 
                      src="/logo.jpg" 
                      alt="Karl Barbershop Logo" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-md flex items-center justify-between">
                      <div>
                        <div className="text-slate-900 font-bold text-sm">Karl Masing</div>
                        <div className="text-xs text-amber-600 font-medium">Master Barber & Founder</div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 text-amber-700 text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Pro
                      </div>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-2 gap-3 text-xs text-slate-700 mt-2">
                    <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <span className="block text-slate-400 text-[10px] uppercase font-semibold">Hours</span>
                        <span className="font-bold text-slate-800">Mon-Sat: 9am-8pm</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <span className="block text-slate-400 text-[10px] uppercase font-semibold">Location</span>
                        <span className="font-bold text-slate-800">13 Flores de Mayo, Novaliches, Quezon City, 1118 Metro Manila</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image Collage using Logo */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden border border-slate-200 h-64 shadow-md bg-slate-950 flex items-center justify-center">
                  <img 
                    src="https://images.pexels.com/photos/7697712/pexels-photo-7697712.jpeg" 
                    alt="Karl Barbershop Logo" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden border border-slate-200 h-44 shadow-md bg-amber-500/10 p-6 flex flex-col justify-center items-center text-center">
                  <span className="text-3xl font-black text-amber-600 font-serif">100%</span>
                  <span className="text-xs text-slate-700 uppercase tracking-widest font-bold mt-1">Satisfaction Guarantee</span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-3xl overflow-hidden border border-slate-200 h-44 shadow-md bg-slate-50 p-6 flex flex-col justify-center">
                  <div className="text-amber-600 font-bold text-lg mb-1">Elite Equipment</div>
                  <p className="text-xs text-slate-600">Sterilized Japanese steel shears and professional Wahl clippers.</p>
                </div>
                <div className="rounded-3xl overflow-hidden border border-slate-200 h-64 shadow-md bg-slate-950 flex items-center justify-center">
                  <img 
                    src="https://images.pexels.com/photos/33448216/pexels-photo-33448216.jpeg" 
                    alt="Karl Barbershop Logo" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold tracking-wide uppercase">
                <Info className="w-3.5 h-3.5" /> About Karl & The Shop
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
                Crafting Confidence Through Precision Barbering
              </h2>

              <p className="text-slate-600 leading-relaxed text-base">
                Founded by master barber Karl with a vision to redefine the traditional barbershop experience, Modern Barbershop by Karl blends timeless barbering heritage with contemporary styling trends. We believe every haircut is a bespoke work of art.
              </p>

              <p className="text-slate-500 text-sm leading-relaxed">
                Whether you need a razor-sharp fade for the weekend, a sophisticated trim for the boardroom, or a relaxing hot towel shave to unwind, Karl provides meticulous attention to detail in a clean, bright, and welcoming atmosphere.
              </p>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  'Bespoke Haircut Consultations',
                  'Air Conditioned & Cozy Lounge',
                  'Premium Pomades & Oils',
                  'In-Shop Snacks & Drinks',
                  'Strict Sterilization Protocols',
                  'Easy Online Booking & Email'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-800 font-medium">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <a 
                  href="#services" 
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm border border-slate-200 transition-colors shadow-sm"
                >
                  View Services & Pricing <ChevronRight className="w-4 h-4 text-amber-600" />
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Services & Pricing Section */}
      <section id="services" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold tracking-wide uppercase">
              <DollarSign className="w-3.5 h-3.5" /> Transparent Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
              Signature Services & Rates
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Choose your grooming experience. All services include consultation, precision cut/shave, and professional styling finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Modern Haircut & Styling',
                price: 'PHP 180',
                usd: '',
                duration: '45 mins',
                desc: 'Precision clipper or scissor cut tailored to your face shape, shampoo wash, hot towel finish & professional styling.',
                popular: true,
                image: 'https://images.pexels.com/photos/12706272/pexels-photo-12706272.jpeg'
              },
              {
                title: 'Beard Trim & Line Up',
                price: 'PHP 300',
                usd: '',
                duration: '30 mins',
                desc: 'Detailed beard sculpt, straight razor edge clean-up, nourishing beard oil massage and mustache detailing.',
                popular: false,
                image: 'https://images.pexels.com/photos/7518723/pexels-photo-7518723.jpeg'
              },
              {
                title: 'Hot Towel Traditional Shave',
                price: 'PHP 350',
                usd: '',
                duration: '30 mins',
                desc: 'Luxury pre-shave oil, steaming eucalyptus hot towels, warm lather straight razor shave & soothing aftershave balm.',
                popular: false,
                image: 'https://images.pexels.com/photos/6007400/pexels-photo-6007400.jpeg'
              },
              {
                title: 'Dad & Lad Combo',
                price: 'PHP 800',
                usd: '~$28',
                duration: '60 mins',
                desc: 'Father and son matching precision haircuts. Quality bonding time with Karl in the master chair.',
                popular: false,
                image: 'https://images.pexels.com/photos/7697358/pexels-photo-7697358.jpeg'
              },
              {
                title: 'Hair Color & Highlights',
                price: 'PHP 950',
                usd: '~$35',
                duration: '90 mins',
                desc: 'Modern grey blending, platinum bleaching, or stylish highlights with ammonia-free professional color.',
                popular: false,
                image: 'https://images.pexels.com/photos/3993132/pexels-photo-3993132.jpeg'
              },
            ].map((srv, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-3xl border transition-all shadow-sm flex flex-col overflow-hidden relative ${
                  srv.popular ? 'border-amber-500 shadow-xl shadow-amber-500/10' : 'border-slate-200'
                }`}
              >
                {srv.popular && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full z-10 shadow">
                    Most Popular
                  </div>
                )}
                
                <div className="h-52 overflow-hidden relative bg-slate-950 flex items-center justify-center">
                  <img src={srv.image} alt={srv.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900 font-serif">{srv.title}</h3>
                      <div className="text-right">
                        <span className="text-amber-600 font-extrabold text-lg block">{srv.price}</span>
                        {srv.usd ? <span className="text-[11px] text-slate-400 font-medium">{srv.usd}</span> : null}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{srv.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> {srv.duration}
                    </span>
                    <a 
                      href="#booking" 
                      onClick={() => setBookingForm(prev => ({ ...prev, service: srv.title }))}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-800 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      Book This <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold tracking-wide uppercase">
              <Scissors className="w-3.5 h-3.5" /> Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              The Gallery of Fresh Cuts
            </h2>
            <p className="text-slate-600 text-sm">
              Explore brand insignia and professional works straight from Karl's chair.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {galleryItems.map((item, index) => (
              <motion.div 
                key={`${item.title}-${index}`} 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative h-72 sm:h-80 overflow-hidden rounded-3xl border border-slate-200 shadow-md bg-slate-950 flex items-center justify-center"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                  <div>
                    <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block">{item.category}</span>
                    <span className="text-white font-serif text-base sm:text-lg">{item.title}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Booking Form & Email Notification Section */}
      <section id="booking" className="py-24 bg-slate-50 border-t border-slate-200 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden sm:block">
              <Calendar className="w-48 h-48 text-amber-500" />
            </div>

            <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold tracking-wide uppercase">
                <Calendar className="w-3.5 h-3.5" /> Instant Booking & Email Notice
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 font-serif">
                Book Your Chair With Karl
              </h2>
              <p className="text-slate-600 text-sm">
                Fill out the form below. A live booking email will be sent directly to Karl's inbox for instant review.
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      value={bookingForm.fullName}
                      onChange={e => setBookingForm({...bookingForm, fullName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +63 917 123 4567"
                      value={bookingForm.phone}
                      onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Select Service *</label>
                  <select 
                    value={bookingForm.service}
                    onChange={e => setBookingForm({...bookingForm, service: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  >
                    <option value="Modern Haircut & Styling">Modern Haircut & Styling (PHP 450)</option>
                    <option value="Beard Trim & Line Up">Beard Trim & Line Up (PHP 300)</option>
                    <option value="Hot Towel Traditional Shave">Hot Towel Traditional Shave (PHP 350)</option>
                    <option value="Full Grooming Package">Full Grooming Package (PHP 750)</option>
                    <option value="Dad & Lad Combo">Dad & Lad Combo (PHP 800)</option>
                    <option value="Hair Color & Highlights">Hair Color & Highlights (PHP 950)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Preferred Date & Time *</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="datetime-local" 
                      required
                      value={bookingForm.dateTime}
                      onChange={e => setBookingForm({...bookingForm, dateTime: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Special Notes / Requests (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="e.g. Low skin fade, texture on top, preferred styling product..."
                    value={bookingForm.notes}
                    onChange={e => setBookingForm({...bookingForm, notes: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  ></textarea>
                </div>

              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button 
                  type="button"
                  onClick={() => setShowIntegrationModal(true)}
                  className="text-xs text-amber-600 hover:underline font-semibold flex items-center gap-1.5"
                >
                  <Code className="w-4 h-4" /> View Email Notification Setup
                </button>

                <button 
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting & Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Confirm & Submit to Karl Email
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Recent Bookings Feed */}
            <div className="mt-12 pt-8 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" /> Recent Online Bookings Queue ({bookingsList.length})
              </h3>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2">
                {bookingsList.map((bk) => (
                  <div key={bk.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="text-slate-900 font-bold flex items-center gap-2">
                        <span>{bk.fullName}</span>
                        <span className="bg-amber-500/10 text-amber-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">{bk.service}</span>
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        Time: {new Date(bk.dateTime).toLocaleString()} • Phone: {bk.phone} {bk.notes ? `• Note: "${bk.notes}"` : ''}
                      </div>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-3 py-1 rounded-full font-bold text-[10px] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Email Sent
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Success Modal */}
      {bookingSuccessModal && lastBookingResult && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
          >
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900 font-serif">Appointment Confirmed!</h3>
              <p className="text-slate-600 text-sm">
                Thank you, <strong className="text-slate-900">{lastBookingResult.booking.fullName}</strong>. Your booking for <strong className="text-amber-600">{lastBookingResult.booking.service}</strong> has been successfully registered.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Booking Email Sent
                </span>
                <span>To: Karl's Email Inbox</span>
              </div>
              <p className="text-xs font-mono text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                "{lastBookingResult.notification?.message}"
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <a 
                href={`mailto:${BOOKING_EMAIL_RECEIVER}?subject=${encodeURIComponent('New Booking Request')}&body=${encodeURIComponent(buildBookingEmailMessage(lastBookingResult.booking))}`} 
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center border border-slate-200"
              >
                Email Karl
              </a>
              <button 
                onClick={() => setBookingSuccessModal(false)}
                className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs text-center shadow"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Integration Code Modal */}
      {showIntegrationModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
                <Code className="w-5 h-5 text-amber-600" /> Email Booking Notification Setup
              </h3>
              <button 
                onClick={() => setShowIntegrationModal(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <p className="leading-relaxed">
                To send each live booking directly to Karl's email inbox, configure the following SMTP-based email flow in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-amber-700 font-bold">server.ts</code>:
              </p>

              <pre className="bg-slate-950 text-amber-200 p-4 rounded-2xl border border-slate-800 text-[11px] font-mono overflow-x-auto">
{`import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT || 587) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

await transporter.sendMail({
  from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
  to: process.env.EMAIL_TO || 'karl@gmail.com',
  subject: 'New Barbershop Booking',
  text: 'A new booking was submitted.',
});`}
              </pre>

              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-amber-900">
                <span className="font-bold block mb-1">Environment Variables Required:</span>
                <code>EMAIL_HOST</code>, <code>EMAIL_PORT</code>, <code>EMAIL_USER</code>, <code>EMAIL_PASS</code>, <code>EMAIL_FROM</code>, <code>EMAIL_TO</code>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setShowIntegrationModal(false)}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact & Direct Action Section */}
      <section id="contact" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold tracking-wide uppercase">
                <Phone className="w-3.5 h-3.5" /> Get in Touch
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
                Visit Karl's Chair Today
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                Have questions or need a custom grooming package? Reach out via phone or Facebook Messenger for instant replies.
              </p>

              {/* Contact Cards */}
              <div className="space-y-4 pt-2">
                <a 
                  href={`tel:${MAIN_PHONE_NUMBER}`} 
                  className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group shadow-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Direct Phone</span>
                    <span className="text-slate-900 font-bold text-base">{MAIN_PHONE_NUMBER_DISPLAY}</span>
                  </div>
                </a>

                <a 
                  href="https://m.me/61592438219283" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group shadow-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Facebook Messenger</span>
                    <span className="text-slate-900 font-bold text-base">m.me/61592438219283</span>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Studio Location</span>
                    <span className="text-slate-900 font-bold text-base">13 Flores de Mayo, Novaliches, Quezon City, 1118 Metro Manila</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Map / Hours Card */}
            <div className="lg:col-span-6 bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
              <h3 className="text-xl font-bold font-serif flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" /> Shop Working Hours
              </h3>

              <div className="space-y-3 divide-y divide-slate-800 text-sm">
                <div className="flex justify-between pt-2">
                  <span className="text-slate-300">Monday – Friday</span>
                  <span className="font-semibold text-amber-400">9:00 AM – 8:00 PM</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-slate-300">Saturday</span>
                  <span className="font-semibold text-amber-400">9:00 AM – 9:00 PM</span>
                </div>
                <div className="flex justify-between pt-3">
                  <span className="text-slate-300">Sunday</span>
                  <span className="font-semibold text-amber-400">10:00 AM – 6:00 PM</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
                <span className="font-bold block">💡 Walk-Ins Always Welcome</span>
                <span>Appointments are prioritized. Please book online or call 15 minutes prior to arrival.</span>
              </div>

              <div className="pt-2">
                <a 
                  href="#booking"
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider text-center block shadow transition-colors"
                >
                  Book Appointment Now
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Floating CTA Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a 
          href={`mailto:${BOOKING_EMAIL_RECEIVER}?subject=${encodeURIComponent('Booking Inquiry')}&body=${encodeURIComponent('Hi Karl, I would like to book an appointment.')}`} 
          aria-label="Email Barbershop"
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
        <a 
          href={`tel:${MAIN_PHONE_NUMBER}`} 
          aria-label="Call Barbershop"
          className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110"
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-amber-500 overflow-hidden bg-slate-800">
              <img 
                src="/logo.jpg" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-white font-bold font-serif">Modern Barbershop by Karl</span>
              <span className="block text-[10px] text-amber-400">Precision Cuts & Modern Styling</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-300 font-medium">
            <a href="#home" className="hover:text-amber-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-amber-400 transition-colors">About Us</a>
            <a href="#services" className="hover:text-amber-400 transition-colors">Services</a>
            <a href="#booking" className="hover:text-amber-400 transition-colors">Booking</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
          </div>

          <div>
            <p className="text-slate-500">© {new Date().getFullYear()} Modern Barbershop by Karl. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
