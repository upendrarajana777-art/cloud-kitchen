import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-right-10 duration-500">
            <div className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-[24px] shadow-2xl border backdrop-blur-xl",
                type === 'success' ? "bg-white/90 border-emerald-100" : "bg-white/90 border-red-100"
            )}>
                <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                    type === 'success' ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                )}>
                    <CheckCircle2 size={24} />
                </div>
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">{type}</p>
                    <p className="text-sm font-black text-slate-900">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="ml-4 p-2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
