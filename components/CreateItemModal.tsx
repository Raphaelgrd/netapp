import React, { useState, useRef } from 'react';
import { X, FolderPlus, FileText, Link as LinkIcon, StickyNote, Sparkles, Upload } from 'lucide-react';
import { ItemType } from '../types';
import { generateNoteContent } from '../services/geminiService';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (type: ItemType, name: string, content?: string) => void;
  parentId: string | null;
}

const CreateItemModal: React.FC<CreateItemModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [activeTab, setActiveTab] = useState<ItemType>('folder');
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name) return;
    onCreate(activeTab, name, content);
    resetAndClose();
  };

  const resetAndClose = () => {
    setName('');
    setContent('');
    setActiveTab('folder');
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) { // Limit to 500KB for LocalStorage safety
        alert("Le fichier est trop volumineux pour cette démo (max 500KB).");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string);
        setName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateWithAI = async () => {
    if (!name) return alert("Veuillez d'abord donner un titre/sujet à votre note.");
    setIsGenerating(true);
    try {
      const generated = await generateNoteContent(name);
      setContent(generated);
    } catch (e) {
      alert("Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    { id: 'folder', icon: FolderPlus, label: 'Dossier' },
    { id: 'note', icon: StickyNote, label: 'Note' },
    { id: 'link', icon: LinkIcon, label: 'Lien' },
    { id: 'file', icon: FileText, label: 'Fichier' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Ajouter un élément</h2>
          <button onClick={resetAndClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-100 bg-gray-50/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setContent(''); setName(''); }}
                className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium transition-all ${
                  isActive 
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} className="mb-1" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {activeTab === 'folder' ? 'Nom du dossier' : 'Titre / Nom'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder={activeTab === 'folder' ? 'Ex: Documents importants' : 'Ex: Mon projet'}
              autoFocus
            />
          </div>

          {activeTab === 'link' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="https://example.com"
              />
            </div>
          )}

          {activeTab === 'note' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Contenu</label>
                <button
                  onClick={generateWithAI}
                  disabled={isGenerating || !name}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-50 font-medium px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <Sparkles size={12} />
                  {isGenerating ? 'Génération...' : 'IA Magic'}
                </button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Écrivez votre note ici..."
              />
            </div>
          )}

          {activeTab === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fichier</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer"
              >
                <Upload size={24} className="mb-2" />
                <span className="text-sm">{content ? "Fichier sélectionné" : "Cliquez pour uploader (Max 500KB)"}</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={resetAndClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={!name || (activeTab !== 'folder' && !content && activeTab !== 'note')} 
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateItemModal;