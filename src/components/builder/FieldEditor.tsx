import React, { useState } from 'react';
import { FormField } from '@/lib/types';
import { Plus, X, Trash2, ShieldAlert, ChevronDown, ChevronRight, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface FieldEditorProps {
  field: FormField;
  allFields: FormField[];
  onUpdate: (updates: Partial<FormField>) => void;
}

export default function FieldEditor({ field, allFields, onUpdate }: FieldEditorProps) {
  const [showValidation, setShowValidation] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const [showLogic, setShowLogic] = useState(false);

  const addLogicRule = () => {
    const newLogic = [...(field.logic || []), { fieldId: '', operator: 'equals', value: '' } as const];
    onUpdate({ logic: newLogic as any });
  };

  const updateLogicRule = (index: number, updates: Partial<any>) => {
    const newLogic = [...(field.logic || [])];
    newLogic[index] = { ...newLogic[index], ...updates };
    onUpdate({ logic: newLogic });
  };

  const removeLogicRule = (index: number) => {
    const newLogic = (field.logic || []).filter((_, i) => i !== index);
    onUpdate({ logic: newLogic });
  };

  const availableLogicFields = allFields.filter(f => f.id !== field.id);

  const addOption = () => {
    const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
    onUpdate({ options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = (field.options || []).filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  const isNumeric = field.type === 'number';
  const hasTextConstraints = ['text', 'textarea', 'email'].includes(field.type);

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-[#a0a0a0]">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {/* Label and Helper */}
        <section className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="technical-mono-label opacity-70">Question Label</label>
              <span className="text-[9px] text-[#333] font-mono">NODE-STR-01</span>
            </div>
            <textarea 
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="w-full bg-[#151515] border border-[#1f1f1f] rounded p-3 text-xs text-white focus:border-[#f7e479] focus:outline-none transition-all placeholder-[#333] resize-none"
              rows={3}
              placeholder="Question or field label"
            />
          </div>

          <div className="space-y-2">
            <label className="technical-mono-label opacity-70">Context / Help</label>
            <input 
              type="text" 
              value={field.helpText || ''}
              onChange={(e) => onUpdate({ helpText: e.target.value })}
              className="w-full bg-[#151515] border border-[#1f1f1f] rounded px-3 py-2 text-xs text-white focus:border-[#f7e479] focus:outline-none transition-all"
              placeholder="Brief instructions"
            />
          </div>
        </section>

        {/* Options Editor */}
        {['select', 'radio', 'checkbox'].includes(field.type) && (
          <section className="space-y-3">
            <label className="technical-mono-label opacity-70">Options</label>
            <div className="space-y-2">
              {field.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#151515] p-2 rounded border border-[#1f1f1f] group">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    i === 0 ? "bg-[#f7e479]" : "bg-[#333]"
                  )} />
                  <input 
                    type="text" 
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="flex-1 bg-transparent text-[11px] text-white outline-none"
                  />
                  <button 
                    onClick={() => removeOption(i)}
                    className="p-1 rounded hover:bg-red-400/10 text-[#333] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button 
                onClick={addOption}
                className="w-full py-1.5 text-[10px] text-[#f7e479] border border-dashed border-[#f7e47933] rounded hover:bg-[#f7e47905] transition-colors uppercase font-bold tracking-widest mt-2"
              >
                + Add Option
              </button>
            </div>
          </section>
        )}

        {/* Logic Engine */}
        <section className="pt-6 border-t border-[#1f1f1f]">
          <button 
            onClick={() => setShowLogic(!showLogic)}
            className="flex items-center justify-between w-full mb-4 group"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-[#f7e479]" />
              <label className="technical-mono-label cursor-pointer group-hover:text-white transition-colors">Conditional Branch</label>
            </div>
            {showLogic ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>

          <AnimatePresence>
            {showLogic && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-4 pb-4"
              >
                <p className="text-[9px] text-[#555] uppercase leading-relaxed font-bold tracking-tight">
                  Display this node only if the following telemetry matches:
                </p>

                <div className="space-y-3">
                  {field.logic?.map((rule, i) => (
                    <div key={i} className="p-3 bg-[#151515] border border-[#1f1f1f] rounded space-y-3 relative group/rule shadow-inner">
                      <button 
                        onClick={() => removeLogicRule(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-full flex items-center justify-center text-[#333] hover:text-red-400 opacity-0 group-hover/rule:opacity-100 transition-all z-10"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>

                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-widest text-[#444] font-bold">Source Node</label>
                        <select 
                          value={rule.fieldId}
                          onChange={(e) => updateLogicRule(i, { fieldId: e.target.value })}
                          className="w-full bg-black border border-[#1f1f1f] rounded px-2 py-1.5 text-[10px] text-white outline-none focus:border-[#f7e47933]"
                        >
                          <option value="">Select node...</option>
                          {availableLogicFields.map(f => (
                            <option key={f.id} value={f.id}>{f.label || f.type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase tracking-widest text-[#444] font-bold">Operator</label>
                          <select 
                            value={rule.operator}
                            onChange={(e) => updateLogicRule(i, { operator: e.target.value })}
                            className="w-full bg-black border border-[#1f1f1f] rounded px-2 py-1.5 text-[10px] text-white outline-none focus:border-[#f7e47933]"
                          >
                            <option value="equals">Equals</option>
                            <option value="notEquals">Not Equals</option>
                            <option value="contains">Contains</option>
                            <option value="greaterThan">Greater Than</option>
                            <option value="lessThan">Less Than</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] uppercase tracking-widest text-[#444] font-bold">Value</label>
                          <input 
                            type="text"
                            value={rule.value}
                            onChange={(e) => updateLogicRule(i, { value: e.target.value })}
                            className="w-full bg-black border border-[#1f1f1f] rounded px-3 py-1.5 text-[10px] text-white outline-none focus:border-[#f7e47933] placeholder-[#222]"
                            placeholder="Target..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={addLogicRule}
                    className="w-full py-2 bg-[#151515] border border-dashed border-[#1f1f1f] rounded text-[9px] uppercase font-bold tracking-widest text-[#555] hover:text-[#f7e479] hover:border-[#f7e47933] transition-all"
                  >
                    + Define New Branch
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Validation */}
        <section className="pt-6 border-t border-[#1f1f1f]">
          <button 
            onClick={() => setShowValidation(!showValidation)}
            className="flex items-center justify-between w-full mb-4 group"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-[#f7e479]" />
              <label className="technical-mono-label cursor-pointer group-hover:text-white transition-colors">Validation Logic</label>
            </div>
            {showValidation ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>

          <AnimatePresence>
            {showValidation && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest text-[#555] font-bold">Requirement Mode</span>
                  <button 
                    onClick={() => onUpdate({ required: !field.required })}
                    className={cn(
                      "relative w-10 h-5 rounded-full transition-all duration-300 border",
                      field.required ? "bg-[#f7e47922] border-[#f7e479]" : "bg-black border-[#1f1f1f]"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-2.5 h-2.5 rounded-full transition-all duration-300",
                      field.required ? "right-1 bg-[#f7e479]" : "left-1 bg-[#333]"
                    )} />
                  </button>
                </div>

                <div className="space-y-4 pb-4">
                  <h4 className="text-[10px] text-[#555] uppercase font-bold tracking-widest px-2 py-1 bg-[#1a1a1a] inline-block rounded">Structural Constraints</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase tracking-tighter text-[#555] font-mono">
                        {isNumeric ? "MIN-VALUE" : "MIN-LENGTH"}
                      </span>
                      <input 
                        type="number"
                        value={field.validation?.[isNumeric ? 'min' : 'minLength'] ?? ''}
                        onChange={(e) => onUpdate({ 
                          validation: { ...field.validation, [isNumeric ? 'min' : 'minLength']: e.target.value === '' ? undefined : parseInt(e.target.value) } 
                        })}
                        className="w-full bg-[#151515] border border-[#1f1f1f] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#f7e479] appearance-none"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase tracking-tighter text-[#555] font-mono">
                        {isNumeric ? "MAX-VALUE" : "MAX-LENGTH"}
                      </span>
                      <input 
                        type="number"
                        value={field.validation?.[isNumeric ? 'max' : 'maxLength'] ?? ''}
                        onChange={(e) => onUpdate({ 
                          validation: { ...field.validation, [isNumeric ? 'max' : 'maxLength']: e.target.value === '' ? undefined : parseInt(e.target.value) } 
                        })}
                        className="w-full bg-[#151515] border border-[#1f1f1f] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#f7e479] appearance-none"
                        placeholder="∞"
                      />
                    </div>
                  </div>
                  
                  {hasTextConstraints && (
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase tracking-tighter text-[#555] font-mono">REGEX-PATTERN</span>
                      <div className="relative">
                        <input 
                          type="text"
                          value={field.validation?.pattern || ''}
                          onChange={(e) => onUpdate({ 
                            validation: { ...field.validation, pattern: e.target.value } 
                          })}
                          className="w-full bg-[#151515] border border-[#1f1f1f] rounded pl-8 pr-3 py-2 text-[10px] text-white font-mono outline-none focus:border-[#f7e479] placeholder-[#222]"
                          placeholder="^[a-zA-Z0-9]+$"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#333] text-[10px]">/</span>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#333] text-[10px]">/</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Scoring Engine */}
        <section className="pt-6 border-t border-[#1f1f1f]">
          <button 
            onClick={() => setShowScoring(!showScoring)}
            className="flex items-center justify-between w-full mb-4 group"
          >
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-[#f7e479]" />
              <label className="technical-mono-label cursor-pointer group-hover:text-white transition-colors">Scoring Engine</label>
            </div>
            {showScoring ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          
          <AnimatePresence>
            {showScoring && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-4 pb-4"
              >
                <div className="flex items-center justify-between p-3 bg-[#151515] rounded border border-[#1f1f1f]">
                  <span className="text-[10px] text-[#555] font-mono uppercase tracking-widest">Weighting PTS</span>
                  <input 
                    type="number"
                    value={field.points || 0}
                    onChange={(e) => onUpdate({ points: parseInt(e.target.value) })}
                    className="w-12 bg-black border border-[#1f1f1f] rounded px-2 py-1 text-xs text-[#f7e479] text-center font-bold outline-none border-dashed"
                  />
                </div>
                
                {['select', 'radio'].includes(field.type) && (
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase tracking-tighter text-[#555]">Correct Index/Value</span>
                    <select 
                      value={field.correctOption || ''}
                      onChange={(e) => onUpdate({ correctOption: e.target.value })}
                      className="w-full bg-[#151515] border border-[#1f1f1f] rounded px-2 py-1.5 text-xs text-white outline-none appearance-none"
                    >
                      <option value="">Select answer...</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <div className="p-6 border-t border-[#1f1f1f] bg-[#0f0f0f]">
        <button className="w-full bg-[#1f1f1f] hover:bg-[#252525] text-white rounded py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all">
          Discard Node State
        </button>
      </div>
    </div>
  );
}
