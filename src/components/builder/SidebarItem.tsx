'use client';

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Plus, Info } from 'lucide-react';
import { FieldType } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  type: FieldType;
  icon: React.ReactNode;
  onAdd: () => void;
  isSelected?: boolean;
}

const FIELD_DESCRIPTIONS: Record<FieldType, { title: string; desc: string }> = {
  text: { 
    title: "Alphanumeric String", 
    desc: "Single-line input vector. Ideal for names, titles, or concise identifiers." 
  },
  number: { 
    title: "Quantitative Node", 
    desc: "Discrete numerical tracking. Supports integer/float values with range logic." 
  },
  email: { 
    title: "Communication Alias", 
    desc: "Electronic mail signature. Integrated syntax validation for global routing." 
  },
  textarea: { 
    title: "Extended Text Block", 
    desc: "Multi-line data entry. Optimized for narratives, logs, or secondary commentary." 
  },
  select: { 
    title: "Dropdown Index", 
    desc: "Compact selection matrix. High spatial efficiency for single-choice lists." 
  },
  radio: { 
    title: "Exclusive Matrix", 
    desc: "Single-state switch. All parameters visible for immediate situational choice." 
  },
  checkbox: { 
    title: "Binary Multi-Gate", 
    desc: "Cumulative selection nodes. Allows parallel authorization of discrete states." 
  },
  date: { 
    title: "Temporal Coordinate", 
    desc: "Chronological capture. Calibrates timestamps and calendar-based triggers." 
  },
  file: {
    title: "Binary Data Uplink",
    desc: "Document and media transmission. Supports various binary formats via secure channel."
  },
  signature: {
    title: "Biometric Authorization",
    desc: "Verifiable digital signature. Captures user identity proof via touch/stylus interface."
  },
  'page-break': {
    title: "Structural Page Break",
    desc: "Mission segmentation. Divides the form into multiple logical steps/pages."
  }
};

export default function SidebarItem({ type, icon, onAdd, isSelected }: SidebarItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: type,
    data: {
      type: 'sidebar'
    }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="group relative cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={cn(
        "flex flex-col items-center gap-2 p-3 rounded transition-all duration-200 relative overflow-hidden",
        isSelected 
          ? "bg-[#1f1f1f] border-[#f7e479] shadow-[0_0_15px_rgba(247,228,121,0.1)]" 
          : "bg-[#151515] border-[#1f1f1f] hover:border-[#f7e47955] hover:bg-[#1a1a1a]"
      )}>
        {/* Decorative corner indicator for advanced feel */}
        <div className={cn(
          "absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f7e479] rounded-full blur-[3px] transition-opacity duration-300",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} />
        
        <div className={cn(
          "p-2 transition-colors duration-200",
          isSelected ? "text-[#f7e479]" : "text-[#555] group-hover:text-[#f7e479]"
        )}>
          {icon}
        </div>
        <span className={cn(
          "text-[10px] uppercase tracking-wider transition-colors duration-200 font-medium font-mono",
          isSelected ? "text-white" : "text-gray-500 group-hover:text-white"
        )}>
          {type}
        </span>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="absolute top-1 right-1 p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <Plus className="w-2.5 h-2.5 text-[#f7e479]" />
        </button>
      </div>

      <AnimatePresence>
        {showTooltip && !isDragging && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 20 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute left-full top-0 z-50 w-48 ml-2 pointer-events-none"
          >
            <div className="bg-[#1a1a1a] border border-[#f7e47933] p-3 rounded shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#f7e479]" />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Info className="w-3 h-3 text-[#f7e479]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                    {FIELD_DESCRIPTIONS[type].title}
                  </span>
                </div>
                <p className="text-[9px] text-[#777] leading-relaxed font-medium">
                  {FIELD_DESCRIPTIONS[type].desc}
                </p>
                <div className="pt-2 mt-2 border-t border-[#1f1f1f] flex justify-between items-center text-[7px] text-[#333] uppercase tracking-tighter">
                   <span>Protocol: {type.toUpperCase()}</span>
                   <span>Ready</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isDragging && (
        <div className="absolute inset-0 bg-[#f7e47922] rounded border border-dashed border-[#f7e47955] animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
