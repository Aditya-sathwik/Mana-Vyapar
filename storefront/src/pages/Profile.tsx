import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/userSlice';
import type { RootState } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { User, LogOut, Package, MapPin, Settings, ArrowRight, Star, Clock } from 'lucide-react';


const Profile: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const sections = [
    { title: 'My Orders', icon: Package, count: user?.orders?.length || 0, path: '/orders' },
    { title: 'My Addresses', icon: MapPin, count: user?.addresses?.length || 0, path: '/settings' },
    { title: 'Account Meta', icon: Settings, count: 0, path: '/settings' },
  ];

  return (
    <MainLayout>
      <div className="pt-32 pb-32 px-6 md:px-12 bg-sf-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
             <div className="flex flex-col">
                <span className="text-sf-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4">Member Archive</span>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-sf-text leading-[0.8] uppercase">
                   GREETINGS, <br /> {user?.name.split(' ')[0]}.
                </h1>
             </div>
             
             <button 
               onClick={handleLogout}
               className="h-16 px-8 rounded-2xl border border-sf-outline/20 text-sf-text font-black text-[10px] tracking-widest uppercase hover:text-red-500 hover:bg-red-50 hover:border-red-500 transition-all flex items-center gap-4"
             >
                <LogOut size={18} /> SIGN OUT
             </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
             
             {/* Sidebar Profile Card */}
             <div className="lg:col-span-1">
                <div className="bg-sf-surface rounded-3xl p-10 border border-sf-outline/10 shadow-sm flex flex-col items-center text-center sticky top-32">
                   <div className="w-32 h-32 rounded-3xl bg-sf-primary/5 flex items-center justify-center p-4 mb-8 rotate-3 transition-transform hover:rotate-0">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <User size={64} className="text-sf-primary/30" strokeWidth={1} />
                      )}
                   </div>
                   <h2 className="text-2xl font-black text-sf-text tracking-tight mb-2 uppercase">{user?.name}</h2>
                   <p className="text-[10px] font-black tracking-widest text-sf-text-muted mb-8 uppercase">{user?.email}</p>
                   <div className="w-full h-px bg-sf-outline/10 mb-8" />
                   
                   <div className="flex flex-col gap-4 w-full">
                      {sections.map((sec) => (
                        <Link 
                          key={sec.title} 
                          to={sec.path}
                          className="group flex items-center justify-between w-full p-4 rounded-xl hover:bg-sf-surface-low transition-colors text-left"
                        >
                           <div className="flex items-center gap-4">
                              <sec.icon size={18} className="text-sf-primary opacity-60" />
                              <span className="text-[10px] font-black tracking-widest text-sf-text uppercase">{sec.title}</span>
                           </div>
                           {sec.count > 0 && <span className="text-[8px] font-black bg-sf-primary/10 text-sf-primary px-3 py-1 rounded-full">{sec.count}</span>}
                        </Link>
                      ))}
                   </div>
                </div>
             </div>

             {/* Main Activity Archive */}
             <div className="lg:col-span-3 flex flex-col gap-12">
                
                {/* Orders Overview */}
                <div className="bg-white rounded-3xl p-10 md:p-16 border border-sf-outline/5 shadow-sm">
                   <div className="flex justify-between items-center mb-16">
                      <h3 className="text-3xl font-black tracking-tighter uppercase">RECENT <br /> ORDERS.</h3>
                      <Link to="/orders" className="text-[10px] font-black tracking-widest text-sf-primary uppercase hover:underline">SEE ALL ARCHIVE</Link>
                   </div>

                   {user?.orders?.length === 0 ? (
                     <div className="py-20 flex flex-col items-center justify-center text-center opacity-60 bg-sf-background rounded-3xl border border-dashed border-sf-outline/20">
                        <Clock size={40} strokeWidth={1.5} className="mb-4 text-sf-text-muted" />
                        <p className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase mb-2">NO DISPATCH HISTORY FOUND</p>
                        <p className="text-sm max-w-xs uppercase font-bold tracking-tight">Your recent curation will appear here after shipment.</p>
                        <Link to="/products" className="mt-8 h-12 px-8 bg-sf-text text-white rounded-xl flex items-center justify-center gap-4 font-black text-[10px] tracking-widest uppercase hover:bg-sf-primary transition-all">
                           START CURATING <ArrowRight size={14} />
                        </Link>
                     </div>
                   ) : (
                      <div className="flex flex-col gap-6">
                         {/* Order item rows would go here */}
                      </div>
                   )}
                </div>

                {/* Loyalty / Trust Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-sf-primary/5 rounded-3xl p-10 border border-sf-primary/10 relative overflow-hidden group">
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-sf-primary opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                      <div className="flex flex-col items-start gap-6 relative z-10">
                         <div className="w-12 h-12 rounded-2xl bg-sf-primary text-white flex items-center justify-center shadow-lg shadow-sf-primary/20"><Star size={24} /></div>
                         <div>
                            <h4 className="text-xl font-black tracking-tight mb-2 uppercase">ATELIER REWARDS</h4>
                            <p className="text-[10px] font-bold text-sf-text-muted uppercase tracking-widest leading-relaxed">
                               YOU HAVE 450 POINTS. <br /> REDEEM ON YOUR NEXT CURATION.
                            </p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="bg-sf-surface rounded-3xl p-10 border border-sf-outline/20 relative overflow-hidden group">
                       <div className="flex flex-col items-start gap-6 relative z-10">
                         <div className="w-12 h-12 rounded-2xl bg-sf-text text-white flex items-center justify-center"><User size={24} /></div>
                         <div>
                            <h4 className="text-xl font-black tracking-tight mb-2 uppercase">ATELIER STATUS</h4>
                            <p className="text-[10px] font-bold text-sf-text-muted uppercase tracking-widest leading-relaxed">
                               ELITE MEMBER STATUS. <br /> ACCESS TO MERCHANT EXCLUSIVES.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

             </div>

          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
