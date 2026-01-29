import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Default Credentials Check
        if (email === 'cloudkitchen@gmail.com' && password === 'uvtsy@123') {
            localStorage.setItem('adminToken', 'cloud-kitchen-admin-secure-session');
            setTimeout(() => {
                navigate('/admin');
            }, 800);
        } else {
            setError('Invalid master credentials. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                <div className="bg-white rounded-[48px] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex flex-col items-center mb-10">
                        <div className="h-20 w-20 bg-white rounded-[28px] flex items-center justify-center shadow-2xl mb-6 overflow-hidden">
                            <img src="/logo.png" alt="Logo" className="h-full w-full object-contain p-2" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight text-center">
                            Admin <span className="text-primary">Portal.</span>
                        </h1>
                        <p className="text-gray-400 font-medium italic mt-2">Secure access for kitchen management</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="email"
                                    placeholder="Admin Email"
                                    className="w-full h-16 pl-14 pr-6 bg-gray-50 rounded-[24px] border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-gray-900 shadow-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="password"
                                    placeholder="Secret Password"
                                    className="w-full h-16 pl-14 pr-6 bg-gray-50 rounded-[24px] border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-gray-900 shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-500 text-xs font-black uppercase tracking-widest rounded-2xl flex items-center gap-3">
                                <ShieldCheck size={18} /> {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-18 rounded-[24px] text-lg font-black shadow-xl shadow-primary/30"
                            isLoading={loading}
                        >
                            Authorize Access <ArrowRight className="ml-2" />
                        </Button>
                    </form>
                </div>

                <p className="text-center mt-10 text-gray-400 text-xs font-black uppercase tracking-[0.3em]">
                    CloudKitchen Security Systems v2.0
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
