import React from 'react';
import { motion } from 'framer-motion';

interface TextBlockSectionProps {
  data: any;
}

const TextBlockSection: React.FC<TextBlockSectionProps> = ({ data }) => {
  return (
    <section className="py-24 px-6 md:px-12 bg-sf-surface text-center overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-sf-text mb-8 italic">
          {data.title || "The Heartland Promise"}
        </h2>
        <p className="text-lg text-sf-text-muted leading-relaxed italic opacity-80">
          {data.textContent || "Quality is not a luxury, it's a right."}
        </p>
      </motion.div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-sf-primary/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

export default TextBlockSection;
