import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { Bell, Package, Tag, Info, ChevronRight, Clock, ShieldCheck, Heart } from 'lucide-react';
import { cn } from '../utils/cn';

interface Notification {
  id: string;
  type: 'ORDER' | 'PROMO' | 'SYSTEM' | 'ACCOUNT';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'ORDER',
    title: 'ORDER DISPATCHED',
    message: 'Your curation MV-182941-A is now in transit with our logistics partner.',
    date: '2 HOURS AGO',
    read: false,
  },
  {
    id: '2',
    type: 'PROMO',
    title: 'ATELIER EXCLUSIVE: 15% OFF',
    message: 'A special seasonal curation is available. Use code ATELIER15 for your next acquisition.',
    date: '5 HOURS AGO',
    read: false,
  },
  {
    id: '3',
    type: 'ORDER',
    title: 'DELIVERY CONFIRMED',
    message: 'Your previous order MV-182935-Z has been successfully delivered to your primary home.',
    date: 'YESTERDAY, 04:45 PM',
    read: true,
  },
  {
    id: '4',
    type: 'ACCOUNT',
    title: 'PROFILE SYNCED',
    message: 'Your account settings have been successfully updated across the Mana Vyapar network.',
    date: '2 DAYS AGO',
    read: true,
  }
];

const Notifications: React.FC = () => {
  return (
    <MainLayout>
      <div className="pt-32 pb-32 px-6 md:px-12 bg-sf-background min-h-screen">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20 relative">
             <div className="absolute top-0 -left-12 w-32 h-32 bg-sf-primary/5 rounded-full blur-3xl pointer-events-none" />
             
             <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 bg-sf-primary/10 rounded-xl flex items-center justify-center text-sf-primary">
                      <Bell size={20} />
                   </div>
                   <span className="text-[10px] font-black tracking-widest text-sf-primary uppercase">Curation Updates</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-sf-text leading-[0.8]">
                   MESSAGES <br /> & ALERTS.
                </h1>
             </div>
             
             <button className="h-14 px-8 border border-sf-outline/20 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-white hover:shadow-xl transition-all flex items-center gap-4">
                MARK ALL AS READ
             </button>
          </div>

          <div className="flex flex-col gap-6 relative z-10">
             {mockNotifications.map((noti, i) => {
                const Icon = noti.type === 'ORDER' ? Package : noti.type === 'PROMO' ? Tag : noti.type === 'ACCOUNT' ? ShieldCheck : Info;
                
                return (
                   <motion.div 
                      key={noti.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={cn(
                        "group bg-white p-8 md:p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border relative overflow-hidden",
                        noti.read ? "border-sf-outline/5" : "border-sf-primary/20 bg-sf-primary/[0.02]"
                      )}
                   >
                      {!noti.read && (
                         <div className="absolute top-8 right-8 w-2 h-2 bg-sf-primary rounded-full shadow-[0_0_12px_rgba(var(--sf-primary-rgb),0.5)]" />
                      )}

                      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                         <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                            noti.type === 'ORDER' ? "bg-blue-50 text-blue-500" : 
                            noti.type === 'PROMO' ? "bg-sf-primary/10 text-sf-primary" : 
                            "bg-sf-surface text-sf-text-muted"
                         )}>
                            <Icon size={24} />
                         </div>

                         <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-2">
                               <p className="text-[10px] font-black tracking-widest text-sf-text uppercase">{noti.type} UPDATE</p>
                               <div className="h-0.5 w-4 bg-sf-outline/20 rounded-full" />
                               <div className="flex items-center gap-2 text-sf-text-muted opacity-40">
                                  <Clock size={12} />
                                  <span className="text-[9px] font-bold tracking-widest uppercase">{noti.date}</span>
                               </div>
                            </div>
                            <h3 className="text-xl font-black tracking-tight mb-2 text-sf-text uppercase">{noti.title}</h3>
                            <p className="text-sm font-bold text-sf-text-muted leading-relaxed uppercase tracking-tight opacity-70">
                               {noti.message}
                            </p>
                         </div>

                         <div className="flex items-center">
                            <div className="w-12 h-12 bg-sf-surface-low rounded-2xl flex items-center justify-center text-sf-text opacity-20 group-hover:opacity-100 group-hover:bg-sf-primary group-hover:text-white transition-all transform group-hover:translate-x-2">
                               <ChevronRight size={24} />
                            </div>
                         </div>
                      </div>
                   </motion.div>
                );
             })}
          </div>

          <div className="mt-20 flex flex-col items-center justify-center text-center gap-8 py-16 border-t border-sf-outline/5 opacity-50">
             <Heart size={32} strokeWidth={1} />
             <div>
                <p className="text-[10px] font-black tracking-widest uppercase mb-2">Stay Connected</p>
                <p className="text-[10px] font-bold max-w-sm uppercase leading-relaxed tracking-wider">
                   WE ENSURE EVERY BEAT OF OUR ECOSYSTEM IS SHARED WITH OUR ESTEEMED PATRONS.
                </p>
             </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Notifications;
