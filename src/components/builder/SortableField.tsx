'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Asterisk } from 'lucide-react';
import { FormField } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SortableFieldProps {
  field: FormField;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: (e: React.MouseEvent) => void;
}

export default function SortableField({ field, icon, isSelected, onSelect, onRemove }: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col gap-4 p-8 rounded-lg bg-[#0a0a0a] border transition-all duration-300",
        isDragging ? "opacity-0" : "opacity-100",
        isSelected 
          ? "border-[#f7e479] shadow-[0_0_25px_rgba(247,228,121,0.1)]" 
          : "border-[#1f1f1f] hover:border-[#333]"
      )}
    >
      {/* Glider edge for selection - technical style */}
      <AnimatePresence>
        {isSelected && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#f7e479] to-transparent"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              className="absolute -left-[5px] top-[40%] w-[10px] h-12 bg-[#f7e479] blur-[10px]"
            />
          </>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[#f7e479] text-xs font-mono uppercase tracking-tighter">
            Question
          </span>
          <div className="w-1 h-1 rounded-full bg-[#1f1f1f]" />
          <span className="text-[10px] text-[#555] uppercase font-mono tracking-widest">{field.type}</span>
          {field.required && (
            <span className="text-[#f7e479] animate-pulse" title="Required">
              <Asterisk className="w-3 h-3" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 rounded hover:bg-white/5 text-[#333] hover:text-[#f7e479] transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <button 
            onClick={onRemove}
            className="p-1.5 rounded hover:bg-red-400/10 text-[#333] hover:text-red-400 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-white text-lg font-medium leading-relaxed flex items-center gap-3">
          <span className="shrink-0 text-[#f7e479] opacity-70 group-hover:opacity-100 transition-opacity">
            {icon}
          </span>
          <span className="flex-1">
            {field.label || 'Enter your question text...'}
          </span>
        </h2>
        
        {/* Technical Sub-layout for options/inputs */}
        <div className="relative pl-6 py-2 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#1b1b1b] to-transparent" />
          
          {field.type === 'textarea' ? (
            <div className="w-full h-16 bg-[#151515] border border-[#1f1f1f] rounded relative">
              <div className="absolute right-2 bottom-2 w-2 h-2 border-r border-b border-[#333]" />
            </div>
          ) : field.type === 'select' || field.type === 'radio' || field.type === 'checkbox' ? (
            <div className="space-y-3">
              {field.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-3 group/opt">
                  <div className={cn(
                    "w-1.5 h-1.5 border border-[#333] transition-colors",
                    field.type === 'radio' ? "rounded-full" : "rounded-sm"
                  )} />
                  <span className="text-sm text-[#555] group-hover/opt:text-[#f7e479] transition-colors">{opt}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-[1px] bg-gradient-to-r from-[#1f1f1f] to-transparent mt-4" />
          )}
        </div>
      </div>
    </div>
  );
}
