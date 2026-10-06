/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Scissors,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Facebook,
  Info,
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';

const MAIN_PHONE_NUMBER = '+639301911512';
const MAIN_PHONE_NUMBER_DISPLAY = '+63 930 191 1512';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const galleryItems = [
    {
      title: 'Signature Fade',
      description: 'A clean, sharp fade with a balanced silhouette for a refined everyday look.',
      cutType: 'Precision Cut',
      imageSource: 'https://i.pinimg.com/1200x/fa/49/16/fa4916a7e6174403412caab9df217998.jpg'
    },
    {
      title: 'Textured Crop',
      description: 'Modern volume and structure with a natural finish that works for both casual and formal styles.',
      cutType: 'Modern Style',
      imageSource: 'https://i.pinimg.com/736x/36/d3/6a/36d36af0c1dfbb7895926ff90e4d7618.jpg'
    },
    {
      title: 'Classic Taper',
      description: 'A timeless taper that keeps the sides clean while preserving sharp, polished shape on top.',
      cutType: 'Clean Finish',
      imageSource: 'https://i.pinimg.com/736x/27/a1/16/27a1160f5e2d8d531ee69af217759e05.jpg'
    },
    {
      title: 'Beard & Fade',
      description: 'A seamless blend of beard detailing and fade styling for a bold, premium finish.',
      cutType: 'Barber Combo',
      imageSource: 'https://i.pinimg.com/736x/ec/75/24/ec7524ed2fe308e5fae088e939af54fe.jpg'
    },
    {
      title: 'Classic Trim',
      description: 'A seamless trim cut with a clean and modern result, premium finish.',
      cutType: 'Barber Trim',
      imageSource: 'https://i.pinimg.com/1200x/89/60/89/896089e3c4a06cb0e4ecc79ea69c73e1.jpg'
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  const goToPreviousSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % galleryItems.length);
  };

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-amber-400 px-4 py-2.5 text-xs md:text-sm font-medium flex flex-wrap items-center justify-center gap-4 text-center z-50">
        <span className="flex items-center gap-1.5">
          <Scissors className="w-3.5 h-3.5" /> Walk-ins Welcome! Call Karl: 
          <a href={`tel:${MAIN_PHONE_NUMBER}`} className="underline font-bold text-white hover:text-amber-300 ml-1">{MAIN_PHONE_NUMBER_DISPLAY}</a>
        </span>
        <span className="hidden md:inline text-slate-600">|</span>
        <a href="https://m.me/karl.masing.77" target="_blank" rel="noopener noreferrer" className="underline font-bold text-white hover:text-amber-300">
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
            <a href="#contact" className="hover:text-amber-600 transition-colors">Contact Me</a>
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
              href="#contact" 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Me</span>
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
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              Contact Me
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
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-white font-bold text-sm shadow"
              >
                <Phone className="w-4 h-4" /> Contact Me
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
                  href="https://www.facebook.com/profile.php?id=61592438219283"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
                >
                  <Facebook className="w-5 h-5" /> Visit Our Page
                </a>
                <a 
                  href="https://m.me/karl.masing.77" 
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
                  'Direct Messaging & Call Support'
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
                usd: '',
                duration: '60 mins',
                desc: 'Father and son matching precision haircuts. Quality bonding time with Karl in the master chair.',
                popular: false,
                image: 'https://images.pexels.com/photos/7697358/pexels-photo-7697358.jpeg'
              },
              {
                title: 'Hair Color & Highlights',
                price: 'PHP 950',
                usd: '',
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
                      href="#contact" 
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-800 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      Contact Me <ChevronRight className="w-3 h-3" />
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold tracking-wide uppercase">
              <Scissors className="w-3.5 h-3.5" /> Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">
              The Gallery of Fresh Cuts
            </h2>
            <p className="text-slate-600 text-sm">
              Explore featured barber work and personal style transformations from Karl's chair.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 shadow-xl">
            <motion.div
              key={galleryItems[activeSlide].title}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="relative h-[520px] sm:h-[620px]"
            >
              <img
                src={galleryItems[activeSlide].imageSource}
                alt={galleryItems[activeSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                type="button"
                onClick={goToPreviousSlide}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/85 text-slate-900 shadow-lg hover:bg-white transition flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={goToNextSlide}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/85 text-slate-900 shadow-lg hover:bg-white transition flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
                <motion.div
                  key={`${galleryItems[activeSlide].title}-content`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="max-w-xl rounded-2xl border border-white/15 bg-slate-950/55 backdrop-blur-md p-5 text-white shadow-lg"
                >
                  <span className="text-amber-400 font-bold text-[10px] uppercase tracking-[0.2em] block mb-2">
                    {galleryItems[activeSlide].cutType}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif mb-2">
                    {galleryItems[activeSlide].title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                    {galleryItems[activeSlide].description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2.5 flex-wrap">
            {galleryItems.map((item, index) => (
              <button
                key={`${item.title}-${index}`}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  activeSlide === index ? 'w-10 bg-amber-500' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Me Section */}
      <section id="contact" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold tracking-wide uppercase">
                <Phone className="w-3.5 h-3.5" /> Contact Me
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif">Contact Karl Masing</h2>
              <p className="text-slate-600 text-sm">
                Reach out directly through his Facebook profile, WhatsApp, call, or message app.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <a
                href="https://m.me/karl.masing.77"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Owner</span>
                  <span className="text-slate-900 font-bold text-base">Karl Masing</span>
                </div>
              </a>

              <a
                href="https://wa.me/639301911512"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">WhatsApp Number</span>
                  <span className="text-slate-900 font-bold text-base">+63 930 191 1512</span>
                </div>
              </a>

              <a
                href={`tel:${MAIN_PHONE_NUMBER}`}
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Call Me</span>
                  <span className="text-slate-900 font-bold text-base">Open phone keypad</span>
                </div>
              </a>

              <a
                href={`sms:${MAIN_PHONE_NUMBER}`}
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Message Me</span>
                  <span className="text-slate-900 font-bold text-base">Open messaging app</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a 
          href="https://wa.me/639301911512"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Barbershop"
          className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110"
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
            <a href="#contact" className="hover:text-amber-400 transition-colors">Contact Me</a>
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
