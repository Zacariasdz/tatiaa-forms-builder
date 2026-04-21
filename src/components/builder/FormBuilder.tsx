import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Hash, 
  Mail, 
  AlignLeft, 
  ChevronDown, 
  CircleDot, 
  CheckSquare, 
  Calendar,
  Plus,
  Trash2,
  Settings2,
  Eye,
  Layout,
  Smartphone,
  Monitor,
  GripVertical,
  Download,
  Undo2,
  Redo2,
  Search,
  Filter,
  Upload,
  Fingerprint,
  SquareStack,
  Layers
} from 'lucide-react';
import { FormField, FieldType, FormSchema } from '@/lib/types';
import SidebarItem from './SidebarItem';
import SortableField from './SortableField';
import FieldEditor from './FieldEditor';
import GlobalSettings from './GlobalSettings';
import FormPreview from './FormPreview';
import { cn } from '@/lib/utils';

const INITIAL_FIELDS: FieldType[] = [
  'text', 'number', 'email', 'textarea', 'select', 'radio', 'checkbox', 'date', 'file', 'signature', 'page-break'
];

const FIELD_ICONS: Record<FieldType, React.ReactNode> = {
  text: <Type className="w-4 h-4" />,
  number: <Hash className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  textarea: <AlignLeft className="w-4 h-4" />,
  select: <ChevronDown className="w-4 h-4" />,
  radio: <CircleDot className="w-4 h-4" />,
  checkbox: <CheckSquare className="w-4 h-4" />,
  date: <Calendar className="w-4 h-4" />,
  file: <Upload className="w-4 h-4" />,
  signature: <Fingerprint className="w-4 h-4" />,
  'page-break': <SquareStack className="w-4 h-4" />
};

export default function FormBuilder() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<FormSchema>({
    title: 'New Survey',
    description: 'Please fill out this form.',
    fields: [],
    pages: [],
    theme: 'technical'
  });

  // Persistence logic
  useEffect(() => {
    const saved = localStorage.getItem('form-builder-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Basic migration to ensure pages exist
        if (!parsed.pages) parsed.pages = [];
        setForm(parsed);
      } catch (e) {
        console.error('Failed to load form state', e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('form-builder-state', JSON.stringify(form));
    }
  }, [form, mounted]);

  const [past, setPast] = useState<FormSchema[]>([]);
  const [future, setFuture] = useState<FormSchema[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'build' | 'preview' | 'analytics'>('build');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = {
    input: ['text', 'number', 'email', 'textarea'],
    choice: ['select', 'radio', 'checkbox'],
    date: ['date'],
    advanced: ['file', 'signature', 'page-break']
  };

  const filteredFields = INITIAL_FIELDS.filter(type => {
    const matchesSearch = type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                           (categories[activeCategory as keyof typeof categories]?.includes(type));
    return matchesSearch && matchesCategory;
  });

  const updateForm = React.useCallback((newForm: FormSchema | ((prev: FormSchema) => FormSchema), saveToHistory = true) => {
    if (saveToHistory) {
      setPast(prev => [...prev, form].slice(-50)); // Max 50 steps
      setFuture([]);
    }
    setForm(newForm);
  }, [form]);

  const undo = React.useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setPast(newPast);
    setFuture(prev => [form, ...prev]);
    setForm(previous);
  }, [past, form]);

  const redo = React.useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast(prev => [...prev, form]);
    setFuture(newFuture);
    setForm(next);
  }, [future, form]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    // If it's a new item from sidebar
    if (active.data.current?.type === 'sidebar') {
      const type = active.id as FieldType;
      const newField: FormField = {
        id: `field-${crypto.randomUUID()}`,
        type,
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
        required: false,
        placeholder: `Enter ${type}...`,
        options: (type === 'select' || type === 'radio' || type === 'checkbox') ? ['Option 1', 'Option 2'] : undefined
      };
      
      const overIndex = form.fields.findIndex(f => f.id === over.id);
      const newFields = [...form.fields];
      
      if (overIndex === -1) {
        newFields.push(newField);
      } else {
        newFields.splice(overIndex, 0, newField);
      }
      
      updateForm({ ...form, fields: newFields });
      setSelectedFieldId(newField.id);
    } else if (active.id !== over.id) {
      // Reordering existing items
      const oldIndex = form.fields.findIndex(f => f.id === active.id);
      const newIndex = form.fields.findIndex(f => f.id === over.id);
      updateForm({
        ...form,
        fields: arrayMove(form.fields, oldIndex, newIndex)
      });
    }

    setActiveId(null);
  };

  const addField = React.useCallback((type: FieldType) => {
    const newField: FormField = {
      id: `field-${crypto.randomUUID()}`,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      placeholder: `Enter ${type}...`,
      options: (type === 'select' || type === 'radio' || type === 'checkbox') ? ['Option 1', 'Option 2'] : undefined
    };
    updateForm({ ...form, fields: [...form.fields, newField] });
    setSelectedFieldId(newField.id);
  }, [form, updateForm, setSelectedFieldId]);

  const removeField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateForm({ ...form, fields: form.fields.filter(f => f.id !== id) });
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const duplicateField = React.useCallback((id: string | null) => {
    if (!id) return;
    const fieldIndex = form.fields.findIndex(f => f.id === id);
    if (fieldIndex === -1) return;
    
    const fieldToDuplicate = form.fields[fieldIndex];
    const newField: FormField = {
      ...fieldToDuplicate,
      id: `field-${crypto.randomUUID()}`,
      label: `${fieldToDuplicate.label} (Copy)`
    };
    
    const newFields = [...form.fields];
    newFields.splice(fieldIndex + 1, 0, newField);
    
    updateForm({ ...form, fields: newFields });
    setSelectedFieldId(newField.id);
  }, [form, updateForm, setSelectedFieldId]);

  const updateField = (id: string, updates: Partial<FormField>) => {
    updateForm({
      ...form,
      fields: form.fields.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const handleExport = React.useCallback(() => {
    const data = JSON.stringify(form, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title.toLowerCase().replace(/\s+/g, '-')}-schema.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [form]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const schema = JSON.parse(event.target?.result as string) as FormSchema;
        if (schema.fields && Array.isArray(schema.fields)) {
          updateForm(schema);
        }
      } catch (err) {
        console.error('Invalid JSON schema');
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // Still allow shortcuts if it's z/y with ctrl
        // But standard behavior usually takes precedence
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleExport();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        duplicateField(selectedFieldId);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        addField('text');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedFieldId, duplicateField, addField, handleExport]);

  const clearForm = () => {
    if (confirm('Critical: Wipe all data nodes? This cannot be undone.')) {
      updateForm({ ...form, fields: [] });
      setSelectedFieldId(null);
    }
  };

  // Analytics Calculations
  const stats = {
    totalFields: form.fields.length,
    requiredCount: form.fields.filter(f => f.required).length,
    totalPoints: form.fields.reduce((acc, f) => acc + (f.points || 0), 0),
    typeDistribution: form.fields.reduce((acc, f) => {
      acc[f.type] = (acc[f.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    complexityScore: Math.round((form.fields.length * 1.5) + (form.fields.filter(f => f.options).length * 0.5))
  };

  const selectedField = form.fields.find(f => f.id === selectedFieldId);

  if (!mounted) {
    return (
      <div className="flex flex-col h-screen bg-[#050505] text-[#a0a0a0] font-sans">
        <header className="h-14 border-b border-[#1f1f1f] bg-[#0f0f0f]" />
        <main className="flex-1 overflow-hidden flex">
          <aside className="w-64 border-r border-[#1f1f1f] bg-[#0d0d0d]" />
          <div className="flex-1 bg-[#050505]" />
          <aside className="w-72 border-l border-[#1f1f1f] bg-[#0d0d0d]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-[#a0a0a0] font-sans selection:bg-[#f7e479]/30">
      {/* Header */}
      <header className="h-14 border-b border-[#1f1f1f] flex items-center justify-between px-6 bg-[#0f0f0f]">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[#f7e479] rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-black rotate-45" />
          </div>
          <h1 className="text-sm font-bold uppercase tracking-wider text-white">Viper <span className="text-[#f7e479]">Engine</span></h1>
          <span className="px-2 py-0.5 bg-[#1f1f1f] rounded text-[10px] text-[#f7e479] border border-[#f7e47933]">BETA</span>
          
          <div className="flex items-center gap-1 ml-4 border-l border-[#1f1f1f] pl-4">
            <button 
              onClick={undo}
              disabled={past.length === 0}
              className={cn(
                "p-2 rounded hover:bg-[#1f1f1f] transition-all",
                past.length === 0 ? "opacity-20 cursor-not-allowed" : "text-[#a0a0a0] hover:text-white"
              )}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button 
              onClick={redo}
              disabled={future.length === 0}
              className={cn(
                "p-2 rounded hover:bg-[#1f1f1f] transition-all",
                future.length === 0 ? "opacity-20 cursor-not-allowed" : "text-[#a0a0a0] hover:text-white"
              )}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[11px] uppercase tracking-widest font-medium">
          <button 
            onClick={() => setViewMode('build')}
            className={cn(
              "py-4 transition-all duration-200 border-b-2 h-14",
              viewMode === 'build' ? "border-[#f7e479] text-[#f7e479]" : "border-transparent text-[#a0a0a0] hover:text-white"
            )}
          >
            Builder
          </button>
          <button 
            onClick={() => setViewMode('preview')}
            className={cn(
              "py-4 transition-all duration-200 border-b-2 h-14",
              viewMode === 'preview' ? "border-[#f7e479] text-[#f7e479]" : "border-transparent text-[#a0a0a0] hover:text-white"
            )}
          >
            Preview
          </button>
          <button 
            onClick={() => setViewMode('analytics')}
            className={cn(
              "py-4 transition-all duration-200 border-b-2 h-14",
              viewMode === 'analytics' ? "border-[#f7e479] text-[#f7e479]" : "border-transparent text-[#a0a0a0] hover:text-white"
            )}
          >
            Analytics
          </button>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="file" 
            id="import-form" 
            className="hidden" 
            accept=".json" 
            onChange={handleImport} 
          />
          <button 
            onClick={() => document.getElementById('import-form')?.click()}
            className="px-4 py-1.5 border border-[#1f1f1f] rounded text-[11px] hover:bg-[#1f1f1f] transition-colors"
          >
            IMPORT
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-1.5 border border-[#1f1f1f] rounded text-[11px] hover:bg-[#1f1f1f] transition-colors"
          >
            EXPORT
          </button>
          <button className="px-4 py-1.5 bg-[#f7e479] text-black font-bold rounded text-[11px] transition-all transform active:scale-95 shadow-[0_0_15px_rgba(247,228,121,0.2)]">
            PUBLISH
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {viewMode === 'build' ? (
            <>
              {/* Sidebar */}
              <aside className="w-64 border-r border-[#1f1f1f] bg-[#0d0d0d] flex flex-col">
                <div className="p-4 border-b border-[#1f1f1f] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="technical-mono-label">Base Components</h3>
                  </div>
                  
                  {/* Search & Filter */}
                  <div className="space-y-2">
                    <div className="relative group">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#555] group-focus-within:text-[#f7e479] transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search fields..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#050505] border border-[#1f1f1f] rounded px-8 py-1.5 text-[10px] text-white placeholder-[#333] outline-none transition-all focus:border-[#f7e47933] focus:ring-1 focus:ring-[#f7e47911]"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#555] hover:text-white"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#555]" />
                      <select 
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        className="w-full bg-[#050505] border border-[#1f1f1f] rounded pl-8 pr-2 py-1.5 text-[10px] text-white outline-none appearance-none cursor-pointer focus:border-[#f7e47933] transition-all"
                      >
                        <option value="all">ALL CATEGORIES</option>
                        <option value="input">INPUTS & TEXT</option>
                        <option value="choice">CHOICE & SELECT</option>
                        <option value="date">TIME & DATE</option>
                        <option value="advanced">ADVANCED NODES</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#333] pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                    {filteredFields.length > 0 ? (
                      filteredFields.map((type) => (
                        <SidebarItem 
                          key={type} 
                          type={type} 
                          icon={FIELD_ICONS[type]} 
                          onAdd={() => addField(type)}
                          isSelected={selectedField?.type === type}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 py-8 text-center border border-dashed border-[#1f1f1f] rounded">
                        <p className="text-[9px] uppercase tracking-widest text-[#444]">No Protocol Match</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border-b border-[#1f1f1f]">
                  <h3 className="technical-mono-label mb-4">Project Management</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => document.getElementById('import-form')?.click()}
                      className="w-full flex items-center justify-between px-3 py-2 bg-[#151515] border border-[#1f1f1f] rounded text-[10px] text-[#a0a0a0] hover:text-white hover:border-[#333] transition-all group"
                    >
                      <span className="uppercase tracking-widest font-bold">Import Schema</span>
                      <Download className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity rotate-180" />
                    </button>
                    <button 
                      onClick={handleExport}
                      className="w-full flex items-center justify-between px-3 py-2 bg-[#151515] border border-[#1f1f1f] rounded text-[10px] text-[#a0a0a0] hover:text-white hover:border-[#333] transition-all group"
                    >
                      <span className="uppercase tracking-widest font-bold">Export Schema</span>
                      <Download className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>

                <div className="p-4 border-t border-[#1f1f1f]">
                  <button 
                    onClick={clearForm}
                    className="w-full py-2 text-[10px] text-red-400 border border-red-900/30 rounded hover:bg-red-400/5 transition-all uppercase tracking-widest font-bold"
                  >
                    Wipe Node Buffer
                  </button>
                </div>
              </aside>

              {/* Canvas Container */}
              <div className="flex-1 bg-[#050505] overflow-y-auto p-8 flex justify-center scrollbar-hide">
                <div className="w-full max-w-xl">
                  {/* Form Meta */}
                  <div className="mb-12 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <Layout className="w-3 h-3 text-[#f7e479]" />
                       <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-[#555]">Schema Metadata</span>
                    </div>
                    
                    <div className="space-y-4 relative p-8 border border-[#1f1f1f] bg-[#0d0d0d00] rounded transition-all hover:bg-[#0d0d0d]">
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          value={form.title}
                          onChange={(e) => updateForm({...form, title: e.target.value})}
                          className="w-full bg-transparent text-4xl font-light text-white placeholder-[#222] outline-none border-none focus:ring-0 transition-all"
                          placeholder="Untitled Schema"
                        />
                        <div className="h-0.5 w-12 bg-[#f7e479] shadow-[0_0_10px_rgba(247,228,121,0.5)]" />
                      </div>
                      
                      <textarea 
                        value={form.description}
                        onChange={(e) => updateForm({...form, description: e.target.value})}
                        className="w-full bg-transparent text-sm text-[#555] placeholder-[#1a1a1a] outline-none border-none focus:ring-0 resize-none min-h-[60px]"
                        placeholder="Provide a functional description for this data harvesting protocol..."
                        rows={2}
                      />
                      
                      <div className="absolute top-4 right-4 flex gap-2">
                         <div className="w-1 h-1 rounded-full bg-[#1a1a1a]" />
                         <div className="w-1 h-1 rounded-full bg-[#f7e479]" />
                      </div>
                    </div>
                  </div>

                  {/* Field List */}
                  <div className="space-y-8 pb-24">
                    <SortableContext items={form.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                      {form.fields.length === 0 ? (
                        <div className="border border-dashed border-[#1f1f1f] rounded py-20 flex flex-col items-center justify-center text-gray-700 gap-4 transition-all hover:border-[#f7e47933] group">
                          <button 
                            onClick={() => addField('text')}
                            className="w-10 h-10 rounded-full border border-dashed border-[#333] flex items-center justify-center text-[#333] group-hover:border-[#f7e479] group-hover:text-[#f7e479] transition-all"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                          <p className="text-[10px] uppercase tracking-widest font-bold">Initialize Layout</p>
                        </div>
                      ) : (
                        form.fields.map((field) => (
                          <SortableField 
                            key={field.id} 
                            field={field} 
                            isSelected={selectedFieldId === field.id}
                            onSelect={() => setSelectedFieldId(field.id)}
                            onRemove={(e) => removeField(field.id, e)}
                            icon={FIELD_ICONS[field.type]}
                          />
                        ))
                      )}
                    </SortableContext>
                  </div>
                </div>
              </div>

              {/* Inspector Sidebar */}
              <aside className="w-72 border-l border-[#1f1f1f] bg-[#0d0d0d] overflow-y-auto overflow-x-hidden flex flex-col">
                <div className="h-12 border-b border-[#1f1f1f] flex items-center px-4 bg-[#0f0f0f]">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                    {selectedField ? 'Field Inspector' : 'Global Workspace'}
                  </span>
                </div>
                {selectedField ? (
                  <FieldEditor 
                    field={selectedField} 
                    allFields={form.fields}
                    onUpdate={(updates) => updateField(selectedField.id, updates)} 
                  />
                ) : (
                  <GlobalSettings 
                    form={form} 
                    onUpdate={(updates) => updateForm({ ...form, ...updates })}
                  />
                )}
              </aside>
            </>
          ) : viewMode === 'analytics' ? (
            <div className="flex-1 bg-[#050505] overflow-y-auto p-12 scrollbar-hide">
              <div className="max-w-6xl mx-auto space-y-12">
                <header className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-light text-white tracking-tight">Structural Analytics</h2>
                    <p className="text-xs text-[#555] font-mono uppercase tracking-widest">Protocol: Viper-v2.A1 / {form.fields.length} Nodes detected</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="px-6 py-4 bg-[#0d0d0d] border border-[#1f1f1f] rounded flex flex-col gap-1">
                      <span className="text-[9px] text-[#555] uppercase font-bold tracking-widest">Complexity Index</span>
                      <span className="text-xl font-mono text-[#f7e479]">{stats.complexityScore}</span>
                    </div>
                    <div className="px-6 py-4 bg-[#0d0d0d] border border-[#1f1f1f] rounded flex flex-col gap-1">
                      <span className="text-[9px] text-[#555] uppercase font-bold tracking-widest">Total Valuation</span>
                      <span className="text-xl font-mono text-[#f7e479]">{stats.totalPoints} <span className="text-[10px] text-[#555]">PTS</span></span>
                    </div>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Field Distribution */}
                  <div className="p-8 bg-[#0d0d0d] border border-[#1f1f1f] rounded space-y-6">
                    <h3 className="technical-mono-label">Node Categorization</h3>
                    <div className="space-y-4">
                      {Object.entries(stats.typeDistribution).map(([type, count]) => (
                        <div key={type} className="space-y-1.5">
                          <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
                            <span className="text-[#a0a0a0]">{type}</span>
                            <span className="text-white">{count}</span>
                          </div>
                          <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(count / (stats.totalFields || 1)) * 100}%` }}
                              className="h-full bg-[#f7e479]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Health */}
                  <div className="p-8 bg-[#0d0d0d] border border-[#1f1f1f] rounded space-y-6">
                    <h3 className="technical-mono-label">Validation Health</h3>
                    <div className="flex items-center justify-center py-12">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full rotate-[-90deg]">
                          <circle cx="64" cy="64" r="58" stroke="#1a1a1a" strokeWidth="8" fill="none" />
                          <motion.circle 
                            cx="64" cy="64" r="58" stroke="#f7e479" strokeWidth="8" fill="none" 
                            strokeDasharray="364"
                            initial={{ strokeDashoffset: 364 }}
                            animate={{ strokeDashoffset: 364 - (364 * (stats.requiredCount / (stats.totalFields || 1))) }}
                            transition={{ duration: 1.5 }}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-mono text-white">{Math.round((stats.requiredCount / (stats.totalFields || 1)) * 100)}%</span>
                          <span className="text-[8px] text-[#555] uppercase font-bold tracking-widest">Strictness</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase font-bold tracking-tighter">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#f7e479]" />
                        <span>Required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
                        <span>Mutable</span>
                      </div>
                    </div>
                  </div>

                  {/* Protocol Logs */}
                  <div className="p-8 bg-[#0d0d0d] border border-[#1f1f1f] rounded space-y-6">
                    <h3 className="technical-mono-label">Kernel Logs</h3>
                    <div className="font-mono text-[9px] space-y-2 opacity-50 h-[240px] overflow-hidden">
                      <p className="text-green-900 underline underline-offset-4 mb-2">[INFO] SYSTEM BOOT SUCCESSFUL v2.4</p>
                      <p>[LOG] Memory buffers cleared...</p>
                      <p>[LOG] {stats.totalFields} data nodes initialized...</p>
                      <p>[WARN] Potential UI bottleneck at Node-02...</p>
                      <p>[LOG] Scrambling encryption tokens...</p>
                      <p>[LOG] Validator engine active...</p>
                      <p className="text-[#f7e479]">[LOG] Data integrity: 99.8% nominal</p>
                      <p>[LOG] Cooling fans operational...</p>
                      <p>[LOG] Ready for transmission...</p>
                      <p className="animate-pulse">_</p>
                    </div>
                  </div>
                </div>

                <div className="p-12 border border-[#1f1f1f] rounded bg-[#0d0d0d] flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-white text-sm font-medium">Export Structural Profile</h4>
                    <p className="text-xs text-[#555]">Capture the current node graph as a persistent schema.</p>
                  </div>
                  <button 
                    onClick={handleExport}
                    className="px-8 py-3 bg-[#f7e479] text-black font-bold uppercase tracking-widest text-[10px] rounded hover:bg-[#ffe88a] transition-all"
                  >
                    Generate Schema Report
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <FormPreview form={form} device={previewDevice} />
          )}

          {/* Drag Overlay */}
          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.2',
                },
              },
            }),
          }}>
            {activeId ? (
              INITIAL_FIELDS.includes(activeId as FieldType) ? (
                <div className="w-24 p-3 rounded bg-[#1a1a1a] border border-[#f7e479] shadow-2xl flex flex-col items-center gap-2 text-white scale-110">
                  <div className="text-[#f7e479]">{FIELD_ICONS[activeId as FieldType]}</div>
                  <span className="text-[9px] uppercase tracking-wider">{activeId}</span>
                </div>
              ) : (
                <div className="w-[500px] p-6 rounded bg-[#0a0a0a] border border-[#f7e479] shadow-2xl flex items-center gap-4 opacity-80">
                  <div className="text-[#f7e479] font-mono text-[10px] uppercase">Node Instance Locked</div>
                </div>
              )
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
