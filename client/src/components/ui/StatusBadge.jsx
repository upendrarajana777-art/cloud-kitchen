import React from 'react';
import { cn } from '../../lib/utils';
import { Circle } from 'lucide-react';

const StatusBadge = ({ isOpen, className }) => {
    return (
        <div className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all duration-700",
            isOpen
                ? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm shadow-emerald-100/50"
                : "bg-red-50 border-red-100 text-red-500 shadow-sm shadow-red-100/50",
            className
        )}>
            <span className={cn(
                "relative flex h-2 w-2",
                isOpen && "animate-pulse"
            )}>
                <span className={cn(
                    "absolute inline-flex h-full w-full rounded-full opacity-75",
                    isOpen ? "bg-emerald-400" : "bg-red-400"
                )}></span>
                <span className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    isOpen ? "bg-emerald-500" : "bg-red-500"
                )}></span>
            </span>
            {isOpen ? 'Kitchen Open' : 'Kitchen Closed'}
        </div>
    );
};

export default StatusBadge;
