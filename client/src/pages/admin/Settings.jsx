import React from 'react';
import { Bell, Volume2, VolumeX, ShieldCheck, Smartphone, Settings as SettingsIcon } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';
import { cn } from '../../lib/utils';

const Settings = () => {
    const { settings, setSettings, requestNotificationPermission, playSound } = useAlerts();

    const toggleSound = () => {
        setSettings(prev => ({ ...prev, sound: !prev.sound }));
    };

    const toggleNotifications = async () => {
        if (!settings.notifications) {
            await requestNotificationPermission();
        }
        setSettings(prev => ({ ...prev, notifications: !prev.notifications }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                        <SettingsIcon size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Settings</h1>
                        <p className="text-gray-500 font-medium">Configure your workstation alerts and preferences.</p>
                        <button
                            onClick={playSound}
                            className="mt-4 px-4 py-2 bg-orange-100 text-orange-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-200 transition-colors"
                        >
                            🔊 Test Sound Alert
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notification Settings */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
                    <div className="flex items-center gap-3">
                        <Bell className="text-orange-500" size={24} />
                        <h2 className="text-xl font-black text-gray-900">Alert Preferences</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Sound Toggle */}
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] border border-gray-100 group transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                    settings.sound ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"
                                )}>
                                    {settings.sound ? <Volume2 size={24} /> : <VolumeX size={24} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Sound Alerts</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Repeating notification sound</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleSound}
                                className={cn(
                                    "w-14 h-8 rounded-full relative transition-colors duration-300",
                                    settings.sound ? "bg-orange-500" : "bg-gray-300"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300",
                                    settings.sound ? "left-7" : "left-1"
                                )} />
                            </button>
                        </div>

                        {/* Push Notification Toggle */}
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] border border-gray-100 group transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                    settings.notifications ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"
                                )}>
                                    <Smartphone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Push Notifications</h4>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Background browser alerts</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleNotifications}
                                className={cn(
                                    "w-14 h-8 rounded-full relative transition-colors duration-300",
                                    settings.notifications ? "bg-blue-500" : "bg-gray-300"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300",
                                    settings.notifications ? "left-7" : "left-1"
                                )} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account/Security Info */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-emerald-500" size={24} />
                            <h2 className="text-xl font-black text-gray-900">System Information</h2>
                        </div>

                        <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Real-time Stream Online</p>
                            </div>
                            <p className="text-sm text-emerald-800/70 font-medium">
                                Your dashboard is currently listening for live order events from the kitchen server.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            Admin Portal Version 2.0.4
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
