import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { Star, Send, MessageSquare, Heart, ThumbsUp } from 'lucide-react';
import { cn } from '../utils/cn';

const Feedback: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <MainLayout>
        <div className="pt-32 pb-32 px-6 md:px-12 bg-sf-background min-h-[80vh] flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-16 rounded-[40px] shadow-2xl border border-sf-outline/5 text-center max-w-lg"
          >
            <div className="w-20 h-20 bg-sf-primary/10 rounded-3xl flex items-center justify-center text-sf-primary mx-auto mb-8">
              <Heart size={40} />
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">Thank You!</h2>
            <p className="text-sf-text-muted text-lg mb-12 uppercase tracking-widest font-bold">YOUR FEEDBACK IS THE SOUL OF MANA VYAPAR.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="h-14 px-8 border border-sf-outline/20 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-sf-surface-low transition-all"
            >
              SEND ANOTHER RESPONSE
            </button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pt-32 pb-32 px-6 md:px-12 bg-sf-background min-h-screen">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col items-center text-center mb-20 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-sf-primary/5 rounded-full blur-[80px] pointer-events-none" />
             
             <span className="text-sf-primary text-[10px] font-black tracking-[0.3em] uppercase mb-4 relative z-10">Digital Atelier</span>
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-sf-text leading-[0.9] uppercase relative z-10">
                SHARE YOUR <br /> EXPERIENCE.
             </h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl border border-sf-outline/5 relative z-10">
            
            <div className="flex flex-col gap-12 mb-16">
               {/* Rating Section */}
               <div className="flex flex-col items-center">
                  <p className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase mb-4">How would you rate your journey?</p>
                  <div className="flex gap-4">
                     {[1, 2, 3, 4, 5].map((star) => (
                        <button
                           key={star}
                           type="button"
                           onMouseEnter={() => setHoverRating(star)}
                           onMouseLeave={() => setHoverRating(0)}
                           onClick={() => setRating(star)}
                           className="transition-transform hover:scale-125 duration-200"
                        >
                           <Star 
                              size={40} 
                              className={cn(
                                 "transition-colors",
                                 (hoverRating || rating) >= star ? "fill-sf-primary text-sf-primary" : "text-sf-outline/20"
                              )} 
                           />
                        </button>
                     ))}
                  </div>
               </div>

               {/* Feedback Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                     <label className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase px-2">YOUR NAME</label>
                     <input 
                        type="text" 
                        placeholder="NAME"
                        required
                        className="w-full h-16 px-6 bg-sf-surface border border-sf-outline/10 rounded-2xl text-[10px] font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-sf-primary/5 transition-all"
                     />
                  </div>
                  <div className="flex flex-col gap-4">
                     <label className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase px-2">MERCHANT NAME (OPTIONAL)</label>
                     <input 
                        type="text" 
                        placeholder="ENTER STORE NAME"
                        className="w-full h-16 px-6 bg-sf-surface border border-sf-outline/10 rounded-2xl text-[10px] font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-sf-primary/5 transition-all"
                     />
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-black tracking-widest text-sf-text-muted uppercase px-2">YOUR REVIEWS & THOUGHTS</label>
                  <div className="relative">
                     <MessageSquare className="absolute left-6 top-6 text-sf-text-muted opacity-30" size={18} />
                     <textarea 
                        rows={6}
                        placeholder="TELL US ABOUT THE QUALITY, SERVICE, OR YOUR ATELIER EXPERIENCE..."
                        required
                        className="w-full pl-16 pr-8 py-6 bg-sf-surface border border-sf-outline/10 rounded-3xl text-[10px] font-black tracking-widest focus:outline-none focus:ring-4 focus:ring-sf-primary/5 transition-all resize-none"
                     />
                  </div>
               </div>
            </div>

            <button 
              type="submit"
              className="w-full h-18 bg-sf-primary text-white rounded-2xl flex items-center justify-center gap-4 font-black text-xs tracking-[0.2em] shadow-2xl shadow-sf-primary/25 hover:bg-sf-primary/90 transition-all uppercase"
            >
               SUBMIT FEEDBACK <Send size={18} />
            </button>

            <div className="mt-12 pt-8 border-t border-sf-outline/10 flex items-center justify-center gap-4 opacity-50">
               <ThumbsUp size={16} />
               <p className="text-[8px] font-black tracking-widest uppercase">WE VALUE EVERY PIECE OF CRITIQUE AS AN OPPORTUNITY TO REFINE Bharat'S COMMERCE.</p>
            </div>
          </form>

        </div>
      </div>
    </MainLayout>
  );
};

export default Feedback;
