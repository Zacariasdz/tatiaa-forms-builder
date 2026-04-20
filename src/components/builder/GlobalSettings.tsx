'use client';

import React from 'react';
import { FormSchema, FormTheme } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Palette, Globe, Layers, Zap, Code, Bird, Sparkles, Box, Settings, RotateCcw } from 'lucide-react';

interface GlobalSettingsProps {
  form: FormSchema;
  onUpdate: (updates: Partial<FormSchema>) => void;
}

const THEMES: { id: FormTheme; name: string; description: string; icon: React.ReactNode; color: string; accents?: string[] }[] = [
  { 
    id: 'technical', 
    name: 'Technical', 
    description: 'High-fidelity obsidian protocol with gold accents.', 
    icon: <Zap className="w-4 h-4" />,
    color: '#f7e479',
    accents: ['#f7e479', '#60a5fa', '#ef4444', '#22c55e']
  },
  { 
    id: 'lumina', 
    name: 'Lumina Signature', 
    description: 'The iconic glowing builder interface brought to life.', 
    icon: <Sparkles className="w-4 h-4" />,
    color: '#f7e479',
    accents: ['#f7e479', '#ec4899', '#9333ea', '#00d4ff']
  },
  { 
    id: 'minimalist', 
    name: 'Minimalist', 
    description: 'Clean whitespace and subtle grayscale boundaries.', 
    icon: <Layers className="w-4 h-4" />,
    color: '#333',
    accents: ['#000000', '#4b5563', '#2563eb', '#16a34a']
  },
  { 
    id: 'corporate', 
    name: 'Corporate', 
    description: 'Structured professional aesthetic with blue headers.', 
    icon: <Globe className="w-4 h-4" />,
    color: '#3b82f6',
    accents: ['#2563eb', '#1e293b', '#9333ea', '#f59e0b']
  },
  { 
    id: 'playful', 
    name: 'Playful', 
    description: 'Vibrant Bento shadows and high-energy interactions.', 
    icon: <Palette className="w-4 h-4" />,
    color: '#ec4899',
    accents: ['#ff6b6b', '#ffd93d', '#4ecdc4', '#ff8c00']
  },
  { 
    id: 'mimo', 
    name: 'Mimo Pro', 
    description: 'Dark-mode coding aesthetic with vibrant syntax colors.', 
    icon: <Code className="w-4 h-4" />,
    color: '#9333ea',
    accents: ['#9333ea', '#f43f5e', '#06b6d4', '#10b981']
  },
  { 
    id: 'duo', 
    name: 'Lingo Duo', 
    description: 'Friendly education vibe with chunky 3D buttons.', 
    icon: <Bird className="w-4 h-4" />,
    color: '#58cc02',
    accents: ['#58cc02', '#1cb0f6', '#ff4b4b', '#ffc800']
  },
  { 
    id: 'glass', 
    name: 'Liquid Glass', 
    description: 'Refractive frosted layers with soft glow effects.', 
    icon: <Sparkles className="w-4 h-4" />,
    color: '#60a5fa',
    accents: ['#ffffff', '#ff3e00', '#00e0ff', '#d400ff']
  },
  { 
    id: 'clay', 
    name: 'Soft Clay', 
    description: 'Squishy claymorphic depth with pill-shaped nodes.', 
    icon: <Box className="w-4 h-4" />,
    color: '#f472b6',
    accents: ['#f472b6', '#818cf8', '#34d399', '#fbbf24']
  },
  {
    id: 'custom',
    name: 'Custom Protocol',
    description: 'Define your own aesthetic design system.',
    icon: <Settings className="w-4 h-4" />,
    color: '#555'
  }
];

const ThemePreview = ({ theme, custom, accentOverride }: { theme: FormTheme; custom?: any; accentOverride?: string }) => {
  const styles = {
    technical: {
      bg: "bg-[#0a0a0a] border-[#1f1f1f]",
      input: "bg-[#151515] border-[#1f1f1f]",
      accent: "bg-[#f7e479]",
      text: "text-white/80",
      radius: "rounded-sm",
      interactive: "border-[#1f1f1f] bg-[#151515]",
      font: "font-mono"
    },
    lumina: {
      bg: "bg-[#050505] border-[#f7e479] shadow-[0_0_15px_rgba(247,228,121,0.1)]",
      input: "bg-[#101010] border-[#1f1f1f]",
      accent: "bg-[#f7e479]",
      text: "text-white",
      radius: "rounded-md",
      interactive: "border-[#1f1f1f] bg-[#101010]",
      font: "font-sans"
    },
    minimalist: {
      bg: "bg-white border-gray-100",
      input: "bg-gray-50 border-gray-100",
      accent: "bg-gray-900",
      text: "text-gray-900",
      radius: "rounded-none",
      interactive: "border-gray-100 bg-gray-50",
      font: "font-sans"
    },
    corporate: {
      bg: "bg-white border-slate-200",
      input: "bg-white border-slate-300",
      accent: "bg-blue-600",
      text: "text-slate-800",
      radius: "rounded-md",
      interactive: "border-slate-300 bg-white",
      font: "font-serif"
    },
    playful: {
      bg: "bg-white border-[#FFD93D] border-2 shadow-[2px_2px_0px_#FF6B6B]",
      input: "bg-[#FFF9E6] border-2 border-[#FFD93D]",
      accent: "bg-[#FF6B6B]",
      text: "text-[#2D3436]",
      radius: "rounded-xl",
      interactive: "border-2 border-[#FFD93D] bg-[#FFF9E6]",
      font: "font-sans"
    },
    mimo: {
      bg: "bg-[#0f172a] border-[#1e293b]",
      input: "bg-[#1e293b] border-[#334155]",
      accent: "bg-[#9333ea]",
      text: "text-slate-200",
      radius: "rounded-lg",
      interactive: "border-[#334155] bg-[#1e293b]",
      font: "font-mono"
    },
    duo: {
      bg: "bg-[#f1f7ff] border-gray-200 border-b-2",
      input: "bg-gray-50 border-gray-200 border-b",
      accent: "bg-[#58cc02]",
      text: "text-slate-800",
      radius: "rounded-xl",
      interactive: "border-gray-200 border-b bg-gray-50",
      font: "font-sans"
    },
    glass: {
      bg: "bg-[#0b0f19] border-white/10 backdrop-blur-md shadow-xl",
      input: "bg-white/5 border-white/10",
      accent: "bg-white/80 shadow-[0_0_15px_rgba(255,255,255,0.3)]",
      text: "text-white",
      radius: "rounded-2xl",
      interactive: "border-white/10 bg-white/5",
      font: "font-sans"
    },
    clay: {
      bg: "bg-[#f0f4f8] border-white/50 shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff]",
      input: "bg-[#f0f4f8] shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]",
      accent: "bg-pink-400 shadow-[2px_2px_4px_#fca5a555,-2px_-2px_4px_#ffffff]",
      text: "text-slate-700",
      radius: "rounded-3xl",
      interactive: "shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] bg-[#f0f4f8]",
      font: "font-sans"
    },
    custom: {
      bg: "border-[#333] bg-[#0a0a0a]",
      input: "border-[#111] bg-[#050505]",
      accent: "bg-[#555]",
      text: "text-white",
      radius: "rounded-lg",
      interactive: "border-[#111] bg-[#050505]",
      font: "font-sans"
    }
  }[theme];

  const customBg = theme === 'custom' && custom ? { backgroundColor: custom.card, borderColor: custom.primary + '22' } : {};
  const customInput = theme === 'custom' && custom ? { backgroundColor: custom.background, borderColor: custom.primary + '11', color: custom.text } : {};
  
  // Use accentOverride globally if present
  const resolvedAccent = accentOverride || (theme === 'custom' && custom ? custom.primary : null);
  const customAccent = resolvedAccent ? { backgroundColor: resolvedAccent } : {};
  const customText = theme === 'custom' && custom ? { color: custom.text } : {};
  const previewAccentClass = resolvedAccent ? "" : styles.accent;

  return (
    <div 
      className={cn("mt-4 p-4 border transition-all h-auto flex flex-col gap-4 overflow-hidden", styles.bg, styles.radius, styles.font)}
      style={customBg}
    >
      {/* Mini Title */}
      <div className="space-y-1">
        <div 
          className={cn("h-0.5 w-8", previewAccentClass, styles.radius)} 
          style={customAccent}
        />
        <div className={cn("h-2 w-16 bg-current opacity-20", styles.radius)} style={customText} />
      </div>

      {/* Mini Input Field */}
      <div className="space-y-1.5">
        <div 
          className={cn("h-5 w-full border flex items-center px-2", styles.input, styles.radius)} 
          style={customInput}
        >
          <div className="h-0.5 w-12 bg-current opacity-10" />
        </div>
      </div>

      {/* Mini Textarea & Select */}
      <div className="flex gap-2">
        <div 
          className={cn("h-10 flex-1 border p-1", styles.input, styles.radius)} 
          style={customInput}
        >
          <div className="space-y-0.5">
            <div className="h-0.5 w-10 bg-current opacity-10" />
            <div className="h-0.5 w-8 bg-current opacity-5" />
          </div>
        </div>
        <div 
          className={cn("h-5 flex-1 border flex items-center justify-between px-2", styles.input, styles.radius)} 
          style={customInput}
        >
          <div className="h-0.5 w-8 bg-current opacity-10" />
          <div className="w-1.5 h-1.5 bg-current opacity-20 rotate-45 border-b border-r border-current ml-auto" />
        </div>
      </div>

      {/* Mini Checkbox/Radio Grid */}
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className={cn("w-3.5 h-3.5 border shadow-sm flex items-center justify-center relative", styles.interactive, styles.radius === 'rounded-none' ? 'rounded-none' : 'rounded-sm')} style={customInput}>
            <div className={cn("w-1.5 h-1.5", previewAccentClass)} style={customAccent} />
          </div>
          <div className={cn("h-1 w-6 bg-current opacity-20")} style={customText} />
        </div>
        <div className="flex items-center gap-1.5">
          <div className={cn("w-3.5 h-3.5 border rounded-full shadow-sm flex items-center justify-center relative", styles.interactive)} style={customInput}>
            <div className={cn("w-1.5 h-1.5 rounded-full", previewAccentClass)} style={customAccent} />
          </div>
          <div className={cn("h-1 w-6 bg-current opacity-20")} style={customText} />
        </div>
      </div>

      {/* Mini Button */}
      <div 
        className={cn("h-8 w-full flex items-center justify-center text-[7px] font-black uppercase tracking-widest", previewAccentClass, styles.radius)}
        style={{ 
          ...customAccent, 
          color: resolvedAccent ? (theme === 'minimalist' || theme === 'corporate' || theme === 'playful' || theme === 'duo' || theme === 'clay' ? 'white' : 'black') : (theme === 'custom' && custom ? custom.background : (theme === 'minimalist' || theme === 'corporate' || theme === 'playful' || theme === 'duo' || theme === 'clay' ? 'white' : 'black')) 
        }}
      >
        {theme === 'duo' || theme === 'clay' ? 'READY' : theme === 'technical' ? 'COMMIT' : 'SUBMIT'}
      </div>
    </div>
  );
}

const THEME_PRESET_COLORS = [
  '#f7e479', // Viper Gold
  '#ec4899', // Pink Energy
  '#3b82f6', // Corporate Blue
  '#22c55e', // Success Green
  '#ef4444', // Danger Red
  '#9333ea', // Mimo Purple
];

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
  return (
    <div className="space-y-2">
      <label className="text-[8px] uppercase tracking-widest text-[#555] block">{label}</label>
      <div className="flex items-center gap-2 group">
        <div className="relative">
          <input 
            type="color" 
            value={value || '#000000'} 
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
          <div 
            className="w-10 h-6 rounded border border-white/10 shadow-inner transition-transform group-hover:scale-105"
            style={{ backgroundColor: value }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-white/80 group-hover:text-white transition-colors uppercase tracking-tight">{value}</span>
          <div className="h-[1px] w-full bg-[#1f1f1f] group-hover:bg-[#f7e47933] transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default function GlobalSettings({ form, onUpdate }: GlobalSettingsProps) {
  const handleUpdate = (updates: Partial<FormSchema>) => {
    onUpdate(updates);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-[#a0a0a0]">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#f7e479]" />
            <h2 className="technical-mono-label">Interface Protocol</h2>
          </div>

          <div className="space-y-3">
            {THEMES.map((theme) => (
              <div key={theme.id} className="space-y-3">
                <button
                  onClick={() => {
                    const updates: Partial<FormSchema> = { 
                      theme: theme.id,
                      accentColor: theme.accents ? theme.accents[0] : undefined 
                    };
                    if (theme.id === 'custom' && !form.customTheme) {
                      updates.customTheme = {
                        primary: '#f7e479',
                        background: '#050505',
                        card: '#0a0a0a',
                        text: '#ffffff'
                      };
                    }
                    onUpdate(updates);
                  }}
                  className={cn(
                    "w-full p-4 rounded border text-left transition-all group relative overflow-hidden",
                    form.theme === theme.id 
                      ? "bg-[#151515] border-[#f7e47933] ring-1 ring-[#f7e47933]" 
                      : "bg-transparent border-[#1f1f1f] hover:border-[#333] hover:bg-[#0f0f0f]"
                  )}
                >
                  {/* Visual indicator bar */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1 transition-all" 
                    style={{ backgroundColor: theme.id === form.theme ? (theme.id === 'custom' ? form.customTheme?.primary : (form.accentColor || theme.color)) : '#1f1f1f' }}
                  />

                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded bg-[#0a0a0a] border border-[#1f1f1f] transition-colors",
                      form.theme === theme.id ? "text-white" : "text-[#333] group-hover:text-[#555]"
                    )}>
                      {theme.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                         <span className={cn(
                           "text-[10px] uppercase font-bold tracking-[0.2em]",
                           form.theme === theme.id ? "text-white" : "text-[#555]"
                         )}>
                           {theme.name}
                         </span>
                         {form.theme === theme.id && (
                           <span className="w-1 h-1 rounded-full bg-[#f7e479] animate-pulse" />
                         )}
                      </div>
                      <p className="text-[9px] leading-relaxed text-[#444] group-hover:text-[#666]">
                        {theme.description}
                      </p>
                      
                      <ThemePreview theme={theme.id} custom={form.customTheme} accentOverride={form.accentColor} />
                    </div>
                  </div>
                </button>

                {theme.id !== 'custom' && form.theme === theme.id && theme.accents && (
                  <div className="p-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[8px] uppercase tracking-[0.2em] text-[#444] font-bold">Theme Accents</span>
                       <span className="text-[8px] font-mono text-[#222]">PROTO-V2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {theme.accents.map(color => (
                        <button
                          key={color}
                          onClick={() => onUpdate({ accentColor: color })}
                          className={cn(
                            "w-6 h-6 rounded-full border-2 transition-all hover:scale-110",
                            (form.accentColor === color || (!form.accentColor && color === theme.color)) 
                              ? "border-[#f7e479] scale-110 shadow-[0_0_10px_rgba(247,228,121,0.2)]" 
                              : "border-transparent opacity-40 hover:opacity-100"
                          )}
                          title={color}
                        >
                          <div className="w-full h-full rounded-full border border-black/20" style={{ backgroundColor: color }} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {theme.id === 'custom' && form.theme === 'custom' && (
                  <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <ColorPicker 
                        label="Accent Color" 
                        value={form.customTheme?.primary || '#f7e479'} 
                        onChange={(val) => onUpdate({ customTheme: { ...(form.customTheme || {}), primary: val } as any })} 
                      />
                      <ColorPicker 
                        label="Canvas BG" 
                        value={form.customTheme?.background || '#050505'} 
                        onChange={(val) => onUpdate({ customTheme: { ...(form.customTheme || {}), background: val } as any })} 
                      />
                      <ColorPicker 
                        label="Container BG" 
                        value={form.customTheme?.card || '#0a0a0a'} 
                        onChange={(val) => onUpdate({ customTheme: { ...(form.customTheme || {}), card: val } as any })} 
                      />
                      <ColorPicker 
                        label="Text Color" 
                        value={form.customTheme?.text || '#ffffff'} 
                        onChange={(val) => onUpdate({ customTheme: { ...(form.customTheme || {}), text: val } as any })} 
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 pt-6 border-t border-[#1f1f1f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#f7e479]" />
              <h2 className="technical-mono-label tracking-tighter">Accent Protocol</h2>
            </div>
            <button 
              onClick={() => {
                const currentTheme = THEMES.find(t => t.id === form.theme);
                if (!currentTheme) return;

                const updates: Partial<FormSchema> = {
                  accentColor: undefined
                };

                if (currentTheme.id === 'custom') {
                  updates.customTheme = {
                    primary: '#f7e479',
                    background: '#050505',
                    card: '#0a0a0a',
                    text: '#ffffff'
                  };
                }
                onUpdate(updates);
              }}
              className="group flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
              title="Reset to Theme Defaults"
            >
              <RotateCcw className="w-3 h-3 text-[#555] group-hover:text-[#f7e479] transition-colors" />
              <span className="text-[8px] uppercase tracking-widest text-[#444] group-hover:text-[#f7e479] font-bold">Reset</span>
            </button>
          </div>
          
          <div className="grid grid-cols-6 gap-2">
            {THEME_PRESET_COLORS.map(color => (
              <button
                key={color}
                onClick={() => onUpdate({ accentColor: color })}
                className={cn(
                  "h-8 rounded p-0.5 border-2 transition-all",
                  form.accentColor === color ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <div className="w-full h-full rounded-sm" style={{ backgroundColor: color }} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded group">
            <div className="relative">
              <input 
                type="color" 
                value={form.accentColor || '#f7e479'} 
                onChange={(e) => onUpdate({ accentColor: e.target.value })}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div 
                className="w-8 h-4 rounded-sm border border-white/10 shadow-inner"
                style={{ backgroundColor: form.accentColor || '#f7e479' }}
              />
            </div>
            <input 
              type="text"
              value={form.accentColor || ''}
              placeholder="#HEX CODE"
              onChange={(e) => onUpdate({ accentColor: e.target.value })}
              className="bg-transparent border-none outline-none text-[10px] font-mono text-white/50 w-full hover:text-white transition-colors"
            />
          </div>
        </section>

        <section className="space-y-4 pt-6 border-t border-[#1f1f1f]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#f7e479]" />
            <h2 className="technical-mono-label tracking-tighter">Action Label</h2>
          </div>
          <div className="space-y-2">
            <label className="text-[8px] uppercase tracking-widest text-[#555] block">Submission Text</label>
            <input 
               type="text"
               value={form.submitButtonText || ''}
               placeholder="Override submission button label..."
               onChange={(e) => onUpdate({ submitButtonText: e.target.value })}
               className="w-full bg-[#151515] border border-[#1f1f1f] rounded p-3 text-[10px] text-white outline-none focus:border-[#f7e47933] transition-all"
            />
          </div>
        </section>

        <section className="pt-8 border-t border-[#1f1f1f] space-y-4">
          <h2 className="technical-mono-label opacity-50">Operational Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[#151515] border border-[#1f1f1f] rounded">
              <span className="text-[8px] uppercase tracking-widest text-[#444] block mb-1">Total Nodes</span>
              <span className="text-lg font-mono text-white">{form.fields.length}</span>
            </div>
            <div className="p-3 bg-[#151515] border border-[#1f1f1f] rounded">
              <span className="text-[8px] uppercase tracking-widest text-[#444] block mb-1">Theme Integrity</span>
              <span className="text-[10px] font-mono text-[#f7e479]">OPTIMIZED</span>
            </div>
          </div>
        </section>
      </div>

      <div className="p-6 border-t border-[#1f1f1f] bg-[#0f0f0f]">
        <div className="text-[9px] text-[#333] uppercase tracking-[0.2em] font-mono text-center">
          Viper System v2.0 // Kernel Ready
        </div>
      </div>
    </div>
  );
}
