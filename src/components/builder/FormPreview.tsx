'use client';

import React, { useState } from 'react';
import { FormSchema } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, SendHorizonal } from 'lucide-react';

interface FormPreviewProps {
  form: FormSchema;
  device: 'desktop' | 'mobile';
}

export default function FormPreview({ form, device }: FormPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const theme = form.theme || 'technical';

  // logic helper: Evaluate visibility of a field based on current responses
  const isFieldVisible = (field: any) => {
    if (!field.logic || field.logic.length === 0) return true;
    
    return field.logic.every((rule: any) => {
      const responseValue = responses[rule.fieldId];
      const targetValue = rule.value;

      switch (rule.operator) {
        case 'equals': return String(responseValue) === String(targetValue);
        case 'notEquals': return String(responseValue) !== String(targetValue);
        case 'contains': return String(responseValue).toLowerCase().includes(String(targetValue).toLowerCase());
        case 'greaterThan': return Number(responseValue) > Number(targetValue);
        case 'lessThan': return Number(responseValue) < Number(targetValue);
        default: return true;
      }
    });
  };

  // Group fields into pages based on 'page-break' fields
  const getPages = () => {
    const pages: any[][] = [];
    let currentFields: any[] = [];
    
    form.fields.forEach((f) => {
      if (f.type === 'page-break') {
        if (currentFields.length > 0) pages.push(currentFields);
        currentFields = [];
      } else {
        currentFields.push(f);
      }
    });
    if (currentFields.length > 0) pages.push(currentFields);
    
    // If no page-breaks and no fields, return empty
    if (pages.length === 0 && form.fields.length > 0) return [form.fields];
    return pages.length > 0 ? pages : [[]];
  };

  const pages = getPages();
  const activePageFields = pages[currentPage] || [];
  const visibleFields = activePageFields.filter(isFieldVisible);
  const totalPages = pages.length;
  const isLastPage = currentPage === totalPages - 1;

  const handleResponse = (id: string, value: any) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  // Consolidate the active accent color with robust fallbacks
  const THEME_DEFAULTS: Record<string, string> = {
    technical: '#f7e479',
    lumina: '#f7e479',
    minimalist: '#000000',
    corporate: '#3b82f6',
    playful: '#ff6b6b',
    mimo: '#9333ea',
    duo: '#58cc02',
    glass: '#ffffff',
    clay: '#f472b6'
  };

  const activeAccent = form.accentColor || (theme === 'custom' && form.customTheme ? form.customTheme.primary : THEME_DEFAULTS[theme as keyof typeof THEME_DEFAULTS]);

  const styles = {
    technical: {
      canvas: "bg-[#050505]",
      wrapper: "bg-[#0a0a0a] border-[#1f1f1f] text-white",
      header: "text-4xl font-light text-white",
      accent: "bg-[#f7e479]",
      label: "text-[10px] text-[#555] font-bold uppercase tracking-widest",
      nodeNum: "text-[#f7e479] text-xs font-mono uppercase tracking-tighter",
      help: "text-[11px] text-[#444] font-medium",
      input: "bg-[#151515] border-[#1f1f1f] text-white focus:border-[#f7e479] rounded",
      button: "bg-[#f7e479] text-black font-bold uppercase tracking-[0.2em] rounded shadow-[0_0_30px_rgba(247,228,121,0.1)]",
      radio: "rounded-full border-[#1f1f1f] bg-[#151515] peer-checked:border-[#f7e479] peer-checked:bg-[#f7e479]/5",
      checkbox: "rounded border-[#1f1f1f] bg-[#151515] peer-checked:border-[#f7e479] peer-checked:bg-[#f7e479]/5",
      footer: "border-[#1f1f1f] text-[#555] uppercase font-bold tracking-widest"
    },
    lumina: {
      canvas: "bg-black",
      wrapper: "bg-transparent text-white border-none space-y-8",
      header: "text-4xl font-black text-white tracking-tighter mb-8 px-8",
      accent: "bg-[#f7e479] shadow-[0_0_15px_#f7e479]",
      label: "text-2xl font-bold text-white tracking-tight",
      nodeNum: "text-[#f7e479] text-[10px] font-mono font-black uppercase tracking-[0.3em]",
      help: "text-sm text-[#444] font-mono italic",
      input: "bg-[#050505] border-[#1a1a1a] text-white focus:border-[#f7e479] focus:shadow-[0_0_10px_rgba(247,228,121,0.1)] rounded-lg font-mono placeholder-[#222]",
      button: "bg-transparent border border-[#f7e479] text-[#f7e479] font-black uppercase tracking-[0.4em] rounded-lg hover:bg-[#f7e479] hover:text-black transition-all shadow-[0_0_20px_rgba(247,228,121,0.1)]",
      radio: "rounded-full border-2 border-[#1a1a1a] bg-[#050505] peer-checked:border-[#f7e479] peer-checked:bg-[#f7e479]/10",
      checkbox: "rounded-lg border-2 border-[#1a1a1a] bg-[#050505] peer-checked:border-[#f7e479] peer-checked:bg-[#f7e479]/10",
      footer: "border-[#1a1a1a] text-[#222] font-mono text-[8px] tracking-[0.5em] px-8"
    },
    minimalist: {
      canvas: "bg-[#f9f9f9]",
      wrapper: "bg-white border-gray-100 shadow-sm text-gray-900 rounded-none",
      header: "text-3xl font-sans font-medium text-gray-900 -tracking-tight",
      accent: "bg-gray-200",
      label: "text-xs text-gray-400 font-sans tracking-tight",
      nodeNum: "hidden",
      help: "text-xs text-gray-300 italic",
      input: "bg-gray-50 border-gray-100 text-gray-900 focus:bg-white focus:border-gray-200 rounded-none",
      button: "bg-gray-900 text-white font-sans text-xs uppercase tracking-widest py-5 rounded-none",
      radio: "rounded-full border-gray-200 bg-gray-50 peer-checked:bg-white peer-checked:border-gray-900",
      checkbox: "rounded-none border-gray-200 bg-gray-50 peer-checked:bg-white peer-checked:border-gray-900",
      footer: "border-gray-50 text-gray-200 uppercase text-[8px] tracking-[0.4em]"
    },
    corporate: {
      canvas: "bg-slate-200",
      wrapper: "bg-white border-slate-200 border-t-4 border-t-blue-600 rounded-sm shadow-md text-slate-800",
      header: "text-2xl font-serif text-slate-800 leading-tight",
      accent: "bg-blue-600",
      label: "text-xs text-slate-600 font-sans font-semibold",
      nodeNum: "text-blue-600 font-sans text-xs uppercase font-black",
      help: "text-[11px] text-slate-400",
      input: "bg-white border-slate-300 text-slate-800 focus:border-blue-600 rounded-md",
      button: "bg-blue-600 text-white font-sans font-semibold py-4 rounded-md shadow-sm",
      radio: "rounded-full border-slate-300 bg-white peer-checked:border-blue-600 peer-checked:bg-blue-50",
      checkbox: "rounded border-slate-300 bg-white peer-checked:border-blue-600 peer-checked:bg-blue-50",
      footer: "border-slate-100 text-slate-400 font-sans text-[10px]"
    },
    playful: {
      canvas: "bg-[#FFF0F0]",
      wrapper: "bg-white border-4 border-[#FFD93D] rounded-[3rem] shadow-[12px_12px_0px_#FF6B6B] text-[#111]",
      header: "text-5xl font-black italic text-[#FF6B6B] -rotate-1",
      accent: "bg-[#4D96FF]",
      label: "text-sm text-[#6BCB77] font-black uppercase tracking-wide",
      nodeNum: "bg-[#FF6B6B] text-white px-2 py-0.5 rounded-full text-[10px] font-black",
      help: "text-xs text-[#4D96FF] font-bold",
      input: "bg-[#FFF9E6] border-2 border-[#FFD93D] text-[#111] focus:border-[#FF6B6B] rounded-2xl",
      button: "bg-[#FF6B6B] text-white font-black text-lg py-5 rounded-2xl shadow-[4px_4px_0px_#111] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#111] active:translate-y-[2px] active:shadow-[2px_2px_0px_#111] transition-all",
      radio: "rounded-full border-4 border-[#FFD93D] bg-white peer-checked:bg-[#4D96FF] peer-checked:border-[#111]",
      checkbox: "rounded-xl border-4 border-[#FFD93D] bg-white peer-checked:bg-[#6BCB77] peer-checked:border-[#111]",
      footer: "border-dotted border-[#FFD93D] text-[#FFD93D] font-black uppercase text-xs"
    },
    mimo: {
      canvas: "bg-[#0b0e14]",
      wrapper: "bg-[#0f172a] border-[#1e293b] rounded-2xl text-[#f8fafc] shadow-2xl",
      header: "text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500",
      accent: "bg-purple-500",
      label: "text-xs text-purple-300/80 font-mono tracking-wider",
      nodeNum: "text-pink-400 text-[10px] font-mono",
      help: "text-[11px] text-slate-500 font-mono",
      input: "bg-[#1e293b] border-[#334155] text-white focus:border-purple-500 rounded-lg selection:bg-purple-500/30",
      button: "bg-purple-600 text-white font-mono font-bold py-5 rounded-lg border-b-4 border-purple-800 hover:bg-purple-500 active:border-b-0 active:translate-y-[2px]",
      radio: "rounded-full border-[#334155] bg-[#1e293b] peer-checked:bg-purple-500 peer-checked:border-white",
      checkbox: "rounded-md border-[#334155] bg-[#1e293b] peer-checked:bg-purple-500 peer-checked:border-white",
      footer: "border-slate-800 text-slate-600 font-mono text-[9px]"
    },
    duo: {
      canvas: "bg-[#f1f7ff]",
      wrapper: "bg-white border-2 border-[#e5e5e5] border-b-8 rounded-[2rem] text-slate-800 shadow-[0_10px_0px_#e5e5e5]",
      header: "text-4xl font-bold text-[#58cc02] tracking-tight",
      accent: "bg-[#58cc02]",
      label: "text-sm text-slate-500 font-black",
      nodeNum: "bg-[#ffc800] text-white px-3 py-1 rounded-full text-xs font-black shadow-[0_2px_0px_#cca000]",
      help: "text-xs text-slate-400 font-bold italic",
      input: "bg-[#f7f7f7] border-2 border-[#e5e5e5] border-b-4 text-slate-800 focus:border-[#84d8ff] rounded-2xl font-bold placeholder-slate-300",
      button: "bg-[#58cc02] text-white font-black text-xl py-4 rounded-2xl border-b-[6px] border-[#46a302] hover:bg-[#61df02] active:border-b-0 active:translate-y-[4px] transition-all",
      radio: "rounded-full border-2 border-[#e5e5e5] bg-[#f7f7f7] border-b-4 peer-checked:bg-[#58cc02] peer-checked:border-b-0",
      checkbox: "rounded-xl border-2 border-[#e5e5e5] bg-[#f7f7f7] border-b-4 peer-checked:bg-[#58cc02] peer-checked:border-b-0",
      footer: "border-slate-100 text-slate-300 font-black text-xs"
    },
    glass: {
      canvas: "bg-[#0b0f19] bg-[radial-gradient(circle_at_20%_20%,#1e293b_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#312e81_0%,transparent_50%)]",
      wrapper: "bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[3rem] text-white shadow-[0_0_80px_rgba(0,0,0,0.5)]",
      header: "text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/20",
      accent: "bg-gradient-to-r from-blue-400 to-cyan-300",
      label: "text-xs text-blue-200/40 font-medium tracking-[0.2em] uppercase",
      nodeNum: "bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[9px] text-blue-300 font-mono",
      help: "text-xs text-white/30 italic",
      input: "bg-white/[0.02] border border-white/10 text-white focus:bg-white/[0.05] focus:border-blue-400/50 rounded-[1.2rem] placeholder-white/10",
      button: "bg-white text-black font-bold text-lg py-5 rounded-[1.2rem] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all",
      radio: "rounded-full border border-white/10 bg-white/5 peer-checked:bg-white peer-checked:border-white",
      checkbox: "rounded-xl border border-white/10 bg-white/5 peer-checked:bg-white peer-checked:border-white",
      footer: "border-white/5 text-white/10 text-[9px] tracking-widest"
    },
    clay: {
      canvas: "bg-[#f0f4f8]",
      wrapper: "bg-[#f0f4f8] shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff] rounded-[3.5rem] text-slate-700 px-16 border-8 border-[#f0f4f8]",
      header: "text-4xl font-black text-slate-800 tracking-tight",
      accent: "bg-pink-400",
      label: "text-[11px] text-slate-400 font-black uppercase tracking-widest",
      nodeNum: "text-pink-400 font-black px-2 py-0.5 bg-pink-50 rounded-lg",
      help: "text-xs text-slate-400 font-medium",
      input: "bg-[#f0f4f8] shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff] text-slate-700 focus:shadow-[inset_4px_4px_8px_#c2cbd9,inset_-4px_-4px_8px_#ffffff] border-none rounded-[1.8rem] p-6 placeholder-slate-300",
      button: "bg-pink-400 text-white font-black text-xl py-6 rounded-[2rem] shadow-[8px_8px_16px_#fca5a555,-8px_-8px_16px_#ffffff] hover:shadow-[4px_4px_8px_#fca5a555,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#ef444433] transition-all",
      radio: "rounded-full shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] bg-[#f0f4f8] flex items-center justify-center peer-checked:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] peer-checked:bg-pink-400",
      checkbox: "rounded-2xl shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] bg-[#f0f4f8] flex items-center justify-center peer-checked:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] peer-checked:bg-pink-400",
      footer: "border-slate-200 text-slate-300 font-bold text-xs"
    },
    custom: {
      canvas: "", 
      wrapper: "border rounded-2xl shadow-xl",
      header: "text-4xl font-bold tracking-tight",
      accent: "",
      label: "text-base font-semibold",
      nodeNum: "px-2 py-0.5 rounded-full text-[10px] font-bold",
      help: "text-xs opacity-50 italic",
      input: "border-2 rounded-xl transition-all p-4",
      button: "font-bold text-lg py-5 rounded-xl transition-all shadow-lg active:scale-[0.98]",
      radio: "rounded-full border-2 bg-transparent peer-checked:bg-current",
      checkbox: "rounded-lg border-2 bg-transparent peer-checked:bg-current",
      footer: "border-t opacity-30 text-[10px] py-8"
    }
  }[theme];

  // Custom inline styles for Dynamic Protocol
  const customStyles: React.CSSProperties = theme === 'custom' && form.customTheme ? {
    backgroundColor: form.customTheme.background,
    color: form.customTheme.text,
  } : {};

  const customWrapper: React.CSSProperties = theme === 'custom' && form.customTheme ? {
    backgroundColor: form.customTheme.card,
    borderColor: form.customTheme.primary + '33',
    color: form.customTheme.text,
  } : {};

  const customAccent: React.CSSProperties = theme === 'custom' && form.customTheme ? {
    backgroundColor: form.customTheme.primary,
  } : {};

  const customNodeNum: React.CSSProperties = theme === 'custom' && form.customTheme ? {
    backgroundColor: form.customTheme.primary + '11',
    color: form.customTheme.primary,
  } : {};

  const customInput: React.CSSProperties = theme === 'custom' && form.customTheme ? {
    backgroundColor: form.customTheme.background,
    borderColor: form.customTheme.primary + '11',
    color: form.customTheme.text,
  } : {};

  const customButton: React.CSSProperties = {
    ...(theme === 'custom' && form.customTheme ? {
      backgroundColor: form.customTheme.primary,
      color: form.customTheme.background,
      boxShadow: `0 10px 30px ${form.customTheme.primary}44`
    } : (activeAccent ? {
      backgroundColor: activeAccent,
      boxShadow: `0 10px 30px ${activeAccent}44`,
      // For themes with white text buttons by default, we keep them white unless specified
      ...(theme === 'technical' || theme === 'lumina' || theme === 'mimo' ? { color: '#000' } : { color: '#fff' })
    } : {}))
  };

  // General theme accent override
  const accentStyle: React.CSSProperties = activeAccent ? { 
    backgroundColor: activeAccent,
    borderColor: activeAccent 
  } : {};

  const accentTextStyle: React.CSSProperties = activeAccent ? { color: activeAccent } : {};
  const accentBorderPrimary: React.CSSProperties = activeAccent ? { borderColor: activeAccent } : {};
  const accentBgAlpha: React.CSSProperties = activeAccent ? { backgroundColor: activeAccent + '11' } : {};

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div 
      className={cn("flex-1 overflow-y-auto p-12 flex justify-center scrollbar-hide transition-colors duration-500", styles.canvas)}
      style={customStyles}
    >
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "border transition-all duration-500 relative flex flex-col min-h-[600px]",
          styles.wrapper,
          device === 'mobile' ? "w-[375px] h-[667px] overflow-hidden border-t-8" : "w-full max-w-4xl"
        )}
        style={customWrapper}
      >
        <div className="p-12 flex-1 flex flex-col">
          {/* Header */}
          <header className="space-y-4 mb-12 flex-shrink-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h1 
                  className={cn("tracking-tight transition-all", styles.header)}
                  style={(activeAccent && (theme === 'duo' || theme === 'playful')) ? { color: activeAccent } : {}}
                >
                  {form.title || 'Untitled Form'}
                </h1>
                {form.fields.length > 0 && (
                  <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest">
                    Page {currentPage + 1} / {totalPages}
                  </div>
                )}
              </div>
              <div 
                className={cn("h-0.5 w-12 transition-all", styles.accent)} 
                style={{ ...customAccent, ...accentStyle }}
              />
            </div>
            <p className="text-sm opacity-60 max-w-2xl leading-relaxed">{form.description || 'No description provided.'}</p>
          </header>

          {/* Fields */}
          <div className="flex-1 relative flex flex-col">
            {form.fields.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-20 text-center opacity-30 uppercase text-[10px] tracking-widest font-bold">
                Buffer Empty / No Data Nodes
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 space-y-12"
                  >
                    {visibleFields.length === 0 ? (
                      <div className="py-20 text-center opacity-20 uppercase tracking-widest text-[10px]">
                        Page dynamically hidden by logic
                      </div>
                    ) : (
                      visibleFields.map((field) => (
                        <div
                          key={field.id}
                          className={cn(
                            "space-y-8 relative group transition-all duration-500",
                            theme === 'mimo' ? "font-mono" : 
                            theme === 'corporate' ? "font-serif" : "font-sans",
                            theme === 'lumina' && "bg-[#050505] border rounded-xl p-12 shadow-[0_0_30px_rgba(247,228,121,0.05)]"
                          )}
                          style={{
                            ...(theme === 'lumina' ? { borderColor: activeAccent || '#f7e479', boxShadow: `0 0 30px ${(activeAccent || '#f7e479')}11` } : {})
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span 
                                className={cn("transition-all", styles.nodeNum)}
                                style={{ ...customNodeNum, ...accentTextStyle, ...accentBgAlpha }}
                              >
                                {theme === 'duo' ? 'LVL' : theme === 'lumina' ? 'QUESTION' : theme === 'technical' ? 'Node' : '#'}
                              </span>
                              {(theme === 'technical' || theme === 'mimo' || theme === 'lumina' || theme === 'custom') && <div className="w-1.5 h-1.5 rounded-full bg-[#111]" />}
                              {theme === 'lumina' && (
                                <span className="text-[10px] text-[#444] uppercase font-mono tracking-widest font-black">
                                  {field.type}
                                </span>
                              )}
                              <label className={cn("transition-all", styles.label)}>
                                {field.label}
                                {field.required && <span className={cn("ml-1", theme === 'playful' || theme === 'duo' ? "text-red-500" : "text-current")}>*</span>}
                              </label>
                            </div>
                          </div>

                          {field.helpText && (
                            <p className={cn("transition-all", styles.help)}>{field.helpText}</p>
                          )}

                          <div className={cn("relative", (theme !== 'playful' && theme !== 'duo' && theme !== 'clay') && "pl-6")}>
                            {(theme === 'technical' || theme === 'mimo' || theme === 'lumina') && (
                               <div 
                                 className="absolute left-0 top-0 bottom-0 transition-all duration-700 w-[1px] bg-gradient-to-b from-transparent via-[#1f1f1f] to-transparent"
                                 style={activeAccent ? { backgroundImage: `linear-gradient(to bottom, transparent, ${activeAccent}33, transparent)` } : {}}
                               />
                            )}
                            
                            {field.type === 'textarea' ? (
                              <textarea 
                                placeholder={field.placeholder}
                                value={responses[field.id] || ''}
                                onChange={(e) => handleResponse(field.id, e.target.value)}
                                className={cn("w-full p-4 text-sm outline-none transition-all resize-none min-h-[160px] placeholder-gray-600 focus:border-opacity-100", styles.input)}
                                style={{ ...customInput, ...accentBorderPrimary }}
                              />
                            ) : field.type === 'select' ? (
                              <div className="relative">
                                <select 
                                  value={responses[field.id] || ''}
                                  onChange={(e) => handleResponse(field.id, e.target.value)}
                                  className={cn("w-full p-4 text-sm outline-none transition-all appearance-none cursor-pointer focus:border-opacity-100", styles.input)}
                                  style={{ ...customInput, ...accentBorderPrimary }}
                                >
                                  <option value="" disabled>{field.placeholder || 'Select Data...'}</option>
                                  {field.options?.map((opt: string, i: number) => (
                                    <option key={i} value={opt} className="text-black">{opt}</option>
                                  ))}
                                </select>
                              </div>
                            ) : field.type === 'radio' ? (
                              <div className="space-y-4">
                                {field.options?.map((opt: string, i: number) => (
                                  <label key={i} className="flex items-center gap-3 cursor-pointer group/opt">
                                    <div className="relative flex items-center justify-center">
                                      <input 
                                        type="radio" 
                                        name={field.id} 
                                        className="peer sr-only"
                                        checked={responses[field.id] === opt}
                                        onChange={() => handleResponse(field.id, opt)}
                                      />
                                      <div 
                                        className={cn("w-5 h-5 transition-all flex items-center justify-center", styles.radio)} 
                                        style={{
                                          ...(theme === 'custom' ? { borderColor: form.customTheme?.primary + '33' } : theme === 'lumina' ? { borderColor: '#111' } : {}),
                                          ...(activeAccent ? { borderColor: activeAccent + '33' } : {})
                                        }}
                                      />
                                      <div className={cn("absolute w-2.5 h-2.5 rounded-full opacity-0 peer-checked:opacity-100 transition-all", 
                                        theme === 'technical' || theme === 'mimo' ? "bg-purple-500 scale-100" : 
                                        theme === 'playful' || theme === 'duo' ? "bg-white scale-100 shadow-sm" : 
                                        theme === 'glass' ? "bg-white scale-75" :
                                        theme === 'clay' ? "bg-pink-400 scale-100 shadow-inner" : 
                                        theme === 'lumina' ? "bg-[#f7e479] scale-50" :
                                        "bg-current scale-100")} 
                                        style={{
                                          ...(theme === 'custom' ? { backgroundColor: form.customTheme?.primary } : {}),
                                          ...(activeAccent ? { backgroundColor: activeAccent } : {})
                                        }}
                                      />
                                    </div>
                                    <span className={cn(
                                      "text-xs uppercase tracking-wider opacity-60 peer-checked:opacity-100 transition-all",
                                      theme === 'duo' ? "font-black" : theme === 'mimo' ? "font-mono" : ""
                                    )}>
                                      {opt}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            ) : field.type === 'checkbox' ? (
                              <div className="space-y-4">
                                {field.options?.map((opt: string, i: number) => (
                                  <label key={i} className="flex items-center gap-3 cursor-pointer group/opt">
                                    <div className="relative flex items-center justify-center">
                                      <input 
                                        type="checkbox" 
                                        className="peer sr-only"
                                        checked={(responses[field.id] || []).includes(opt)}
                                        onChange={(e) => {
                                          const current = responses[field.id] || [];
                                          const next = e.target.checked 
                                            ? [...current, opt]
                                            : current.filter((c: string) => c !== opt);
                                          handleResponse(field.id, next);
                                        }}
                                      />
                                      <div 
                                        className={cn("w-5 h-5 transition-all flex items-center justify-center", styles.checkbox)}
                                        style={{
                                          ...(theme === 'custom' ? { borderColor: form.customTheme?.primary + '33' } : theme === 'lumina' ? { borderColor: '#111' } : {}),
                                          ...(activeAccent ? { borderColor: activeAccent + '33' } : {})
                                        }}
                                      />
                                      <div className={cn("absolute w-2 h-2 rounded transition-all opacity-0 peer-checked:opacity-100",
                                        theme === 'technical' || theme === 'mimo' ? "bg-purple-500 rotate-0" : 
                                        theme === 'playful' || theme === 'duo' ? "bg-white rotate-0 shadow-sm" : 
                                        theme === 'glass' ? "bg-white rotate-0" :
                                        theme === 'clay' ? "bg-pink-400 rotate-45" : 
                                        theme === 'lumina' ? "bg-[#f7e479] rotate-0" : 
                                        "bg-current rotate-0"
                                      )} 
                                      style={{
                                        ...(theme === 'custom' ? { backgroundColor: form.customTheme?.primary } : {}),
                                        ...(activeAccent ? { backgroundColor: activeAccent } : {})
                                      }}
                                      />
                                    </div>
                                    <span className={cn(
                                      "text-xs uppercase tracking-wider opacity-60 peer-checked:opacity-100 transition-all",
                                      theme === 'duo' ? "font-black" : theme === 'mimo' ? "font-mono" : ""
                                    )}>
                                      {opt}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            ) : (
                              <div className="relative group/input">
                                <input 
                                  type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'date' ? 'date' : 'text'}
                                  placeholder={field.placeholder || "Ready for input..."}
                                  value={responses[field.id] || ''}
                                  onChange={(e) => handleResponse(field.id, e.target.value)}
                                  className={cn("w-full p-4 text-sm outline-none transition-all placeholder-gray-700 focus:border-opacity-100", styles.input)}
                                  style={{ ...customInput, ...accentBorderPrimary }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-12 gap-6 mt-auto">
                  <button 
                    onClick={handleBack}
                    disabled={currentPage === 0}
                    type="button"
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 transition-all opacity-40 hover:opacity-100 disabled:opacity-0 disabled:pointer-events-none",
                      styles.nodeNum
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <div className="flex-1 flex gap-4">
                    {!isLastPage ? (
                      <button 
                         onClick={handleNext}
                         type="button"
                         className={cn("flex-1 py-4 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]", styles.button)}
                         style={customButton}
                      >
                         <span>Next Step</span>
                         <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                         type="button"
                        className={cn("flex-1 py-4 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]", styles.button)}
                        style={customButton}
                      >
                        <SendHorizonal className="w-4 h-4" />
                        <span>
                          {form.submitButtonText || (
                            theme === 'technical' || theme === 'mimo' || theme === 'lumina' ? (theme === 'lumina' ? 'INITIALIZE PROTOCOL' : 'Commit Transmission') : 
                            theme === 'playful' ? 'SEND IT! 🚀' : 
                            theme === 'duo' ? 'COMPLETE LESSON' :
                            theme === 'glass' ? 'Liquidate' :
                            'Submit Form'
                          )}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className={cn("pt-12 border-t flex items-center justify-between", styles.footer)}>
            <div className="space-y-1">
              <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">
                {theme === 'technical' ? 'Protocol Engine' : 'System ID'}
              </p>
              <h3 className="text-xs font-bold uppercase tracking-tighter">Viper v2.4</h3>
            </div>
            <div className="flex gap-4 text-[9px] opacity-40 uppercase font-bold tracking-widest">
              <span>{theme === 'technical' ? 'Encrypted' : 'Validated'}</span>
              <span>Secure Layer</span>
            </div>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
