import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-grad-primary text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-95 transition-all duration-300',
        secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg active:scale-95 transition-all duration-300',
        outline: 'bg-white border-2 border-slate-100 text-slate-900 hover:border-orange-500 hover:text-orange-500 active:scale-95 transition-all duration-300',
        ghost: 'bg-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all duration-300',
        success: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all duration-300',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs font-bold uppercase tracking-widest',
        md: 'px-6 py-4 text-sm font-bold uppercase tracking-widest',
        lg: 'px-8 py-5 text-base font-black uppercase tracking-widest',
        icon: 'p-3 rounded-full',
    };

    return (
        <button
            ref={ref}
            disabled={isLoading || props.disabled}
            className={cn(
                'inline-flex items-center justify-center rounded-[20px] disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
            {children}
        </button>
    );
});

export default Button;
