import React from 'react';
import { Phone, Mail, MapPin, MessageSquare, Clock, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/ui/Button';

const Support = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Navbar />

            <main className="container mx-auto px-6 md:px-12 pt-40 pb-24">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-20 animate-in slide-in-from-bottom-5 duration-700">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-orange-50 rounded-full border border-orange-100 mb-8">
                        <Heart size={16} className="text-orange-500 fill-orange-500" />
                        <span className="text-xs font-black text-orange-600 uppercase tracking-widest leading-none">We're here to help</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Support <span className="text-orange-500">Center.</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium italic">
                        Have a question about your order or our menu? Our dedicated team is just a call or click away.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {/* Phone Support */}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                            <Phone size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Call Us Direct</h3>
                        <p className="text-slate-400 font-medium text-sm mb-8">Immediate assistance for live orders.</p>

                        <div className="space-y-4">
                            <a href="tel:9347764310" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-colors group">
                                <span className="font-black text-lg">9347764310</span>
                                <ArrowRight size={18} className="text-slate-300 group-hover:text-orange-500" />
                            </a>
                            <a href="tel:9642691521" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-colors group">
                                <span className="font-black text-lg">9642691521</span>
                                <ArrowRight size={18} className="text-slate-300 group-hover:text-orange-500" />
                            </a>
                        </div>
                    </div>

                    {/* Email & Location */}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
                            <Mail size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Write to Us</h3>
                        <p className="text-slate-400 font-medium text-sm mb-8">For feedback, partnerships, or general queries.</p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail className="mt-1 text-slate-300" size={20} />
                                <div>
                                    <p className="font-black text-slate-900">support@cloudkitchen.com</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Response within 24h</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="mt-1 text-slate-300" size={20} />
                                <div>
                                    <p className="font-black text-slate-900">CloudKitchen HQ, Hyderabad</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Main Kitchen Operations</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hours */}
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
                            <Clock size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Operating Hours</h3>
                        <p className="text-slate-400 font-medium text-sm mb-8">When we are cooking happiness.</p>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                <span className="font-bold text-slate-500">Mon - Fri</span>
                                <span className="font-black text-slate-900">09:00 AM - 10:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                <span className="font-bold text-slate-500">Sat - Sun</span>
                                <span className="font-black text-slate-900">10:00 AM - 11:00 PM</span>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Currently Open</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "How do I track my order?", a: "You can track your order in real-time by visiting the 'Live Tracking' page via the top menu or the link sent to your phone." },
                            { q: "Do you offer cash on delivery?", a: "Yes! We support Pay on Delivery as well as secure online payments via UPI and Cards." },
                            { q: "Is the packaging eco-friendly?", a: "Absolutely. We use 100% biodegradable and recyclable packaging materials to keep our planet green." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100">
                                <h4 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-3">
                                    <MessageSquare size={18} className="text-orange-500" />
                                    {faq.q}
                                </h4>
                                <p className="text-slate-500 font-medium leading-relaxed pl-8">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-24 text-center">
                    <p className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                        <ShieldCheck size={14} /> 100% Secure & Reliable Support
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Support;
