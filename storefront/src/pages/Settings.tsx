import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { User, MapPin, Bell, Shield, LogOut, ChevronRight, Save, Trash2, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { cn } from '../utils/cn';

const Settings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState('PROFILE');

  const tabs = [
    { title: 'PROFILE', icon: User },
    { title: 'ADDRESSES', icon: MapPin },
    { title: 'SECURITY', icon: Shield },
    { title: 'NOTIFICATIONS', icon: Bell },
  ];

  return (
    <MainLayout>
      <div className="pt-32 pb-32 px-6 md:px-12 bg-sf-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20 relative">
             <div className="absolute top-0 -left-12 w-32 h-32 bg-sf-primary/5 rounded-full blur-3xl pointer-events-none" />
             
             <div className="flex flex-col">
                <span className="text-sf-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">Member Archive</span>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-sf-text leading-[0.8]">
                   ACCOUNT <br /> SETTINGS.
                </h1>
             </div>
             <p className="text-sf-text-muted text-lg max-w-sm leading-relaxed pb-2">
                Manage your atelier identity, shipping destinations, and security preferences.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
             
             {/* Tabs Sidebar */}
             <div className="lg:col-span-1 space-y-4">
                <div className="bg-sf-surface p-10 rounded-[40px] border border-sf-outline/10 shadow-sm sticky top-32">
                   <div className="flex flex-col gap-6">
                      {tabs.map((tab) => (
                        <button 
                           key={tab.title}
                           onClick={() => setActiveTab(tab.title)}
                           className={cn(
                              "flex items-center justify-between w-full p-4 rounded-xl transition-all duration-300 text-left group",
                              activeTab === tab.title ? "bg-sf-primary text-white shadow-xl shadow-sf-primary/20 scale-105" : "hover:bg-sf-surface-low opacity-60 hover:opacity-100"
                           )}
                        >
                           <div className="flex items-center gap-4">
                              <tab.icon size={18} className={cn("transition-colors", activeTab === tab.title ? "text-white" : "text-sf-primary")} />
                              <span className="text-[10px] font-black tracking-widest uppercase">{tab.title}</span>
                           </div>
                           <ChevronRight size={14} className={cn("transition-transform", activeTab === tab.title ? "opacity-100 translate-x-1" : "opacity-0")} />
                        </button>
                      ))}
                      <div className="h-px bg-sf-outline/10 my-4" />
                      <button className="flex items-center gap-4 p-4 text-[10px] font-black tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all uppercase">
                         <LogOut size={18} /> SIGN OUT
                      </button>
                   </div>
                </div>
             </div>

             {/* Content Area */}
             <div className="lg:col-span-3">
                <motion.div 
                   key={activeTab}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl border border-sf-outline/5 min-h-[600px]"
                >
                   {activeTab === 'PROFILE' && (
                      <div className="flex flex-col h-full">
                         <h3 className="text-3xl font-black mb-16 tracking-tight uppercase">Edit Atelier Profile.</h3>
                         
                         <div className="flex flex-col gap-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="flex flex-col gap-4">
                                  <label className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase px-2">FULL NAME</label>
                                  <input type="text" defaultValue={user?.name} className="w-full h-16 px-6 bg-sf-surface border border-sf-outline/10 rounded-2xl text-[10px] font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-sf-primary/5 transition-all text-sf-text" />
                               </div>
                               <div className="flex flex-col gap-4">
                                  <label className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase px-2">EMAIL ADDRESS</label>
                                  <input type="email" defaultValue={user?.email} className="w-full h-16 px-6 bg-sf-surface border border-sf-outline/10 rounded-2xl text-[10px] font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-sf-primary/5 transition-all text-sf-text" />
                               </div>
                            </div>
                            <div className="flex flex-col gap-4">
                               <label className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase px-2">CONTACT NUMBER</label>
                               <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full h-16 px-6 bg-sf-surface border border-sf-outline/10 rounded-2xl text-[10px] font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-sf-primary/5 transition-all text-sf-text" />
                            </div>
                            <button className="self-end mt-12 h-16 px-12 bg-sf-primary text-white rounded-2xl flex items-center justify-center gap-4 font-black text-xs tracking-[0.2em] shadow-2xl shadow-sf-primary/25 hover:bg-sf-primary/90 transition-all uppercase">
                               UPDATE PROFILE <Save size={18} />
                            </button>
                         </div>
                      </div>
                   )}

                   {activeTab === 'ADDRESSES' && (
                      <div className="flex flex-col h-full">
                         <div className="flex justify-between items-center mb-16">
                            <h3 className="text-3xl font-black tracking-tight uppercase">Saved <br className="md:hidden" /> Destinations.</h3>
                            <button className="h-14 px-6 bg-sf-surface border border-sf-outline/20 rounded-xl flex items-center gap-3 text-sf-primary font-black text-[10px] tracking-widest uppercase hover:bg-sf-primary hover:text-white transition-all group">
                               <Plus size={16} /> ADD NEW
                            </button>
                         </div>

                         <div className="space-y-6">
                            {[1, 2].map((i) => (
                               <div key={i} className={cn(
                                  "p-8 rounded-[32px] border flex justify-between items-center group transition-all",
                                  i === 1 ? "bg-sf-primary/5 border-sf-primary shadow-lg shadow-sf-primary/5" : "bg-white border-sf-outline/10 hover:shadow-xl"
                               )}>
                                  <div className="flex gap-6 items-start">
                                     <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center border",
                                        i === 1 ? "bg-sf-primary text-white border-sf-primary" : "bg-sf-surface border-sf-outline/20 text-sf-text-muted"
                                     )}>
                                        <MapPin size={20} />
                                     </div>
                                     <div className="flex flex-col">
                                        <p className="text-[10px] font-black tracking-widest uppercase mb-1">
                                           {i === 1 ? 'Primary Home' : 'Studio / Office'}
                                        </p>
                                        <p className="text-[10px] font-bold text-sf-text-muted uppercase tracking-widest opacity-60">
                                           123 ATELIER STREET, SOUTH MUMBAI, MH - 400033
                                        </p>
                                     </div>
                                  </div>
                                  <div className="flex gap-4">
                                     <button className="w-10 h-10 rounded-xl flex items-center justify-center text-sf-text-muted hover:bg-sf-surface-low transition-colors"><ChevronRight size={18} /></button>
                                     <button className="w-10 h-10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={18} /></button>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   )}

                   {activeTab === 'SECURITY' && (
                      <div className="flex flex-col h-full">
                         <h3 className="text-3xl font-black mb-16 tracking-tight uppercase">Fortress & Security.</h3>
                         <div className="space-y-12">
                            <div className="flex justify-between items-center p-8 bg-sf-surface rounded-3xl border border-sf-outline/10">
                               <div className="flex flex-col">
                                  <p className="text-[10px] font-black tracking-widest uppercase">Two-Factor Authentication</p>
                                  <p className="text-[9px] font-bold text-sf-text-muted opacity-60 uppercase mt-1">RECOMMENDED FOR ACCOUNT SAFETY</p>
                               </div>
                               <button className="w-12 h-6 bg-sf-primary rounded-full relative p-1 transition-all">
                                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                               </button>
                            </div>
                            <button className="h-16 px-12 border border-sf-outline/20 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-sf-surface-low transition-all">
                               RESET SECURITY KEY
                            </button>
                         </div>
                      </div>
                   )}
                </motion.div>
             </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
