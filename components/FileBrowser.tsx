import React, { useState, useEffect } from 'react';
import { 
  Folder, FileText, Link as LinkIcon, StickyNote, 
  Trash2, ChevronRight, Home, Plus, FolderOpen, Download, ExternalLink, Search
} from 'lucide-react';
import { FileSystemItem, ItemType } from '../types';
import { getItems, saveItem, deleteItem } from '../services/storage';
import CreateItemModal from './CreateItemModal';
import ViewItemModal from './ViewItemModal';

interface FileBrowserProps {
  username: string;
}

const FileBrowser: React.FC<FileBrowserProps> = ({ username }) => {
  const [currentPath, setCurrentPath] = useState<{id: string, name: string}[]>([]);
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<FileSystemItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;

  useEffect(() => {
    refreshItems();
  }, [username]);

  const refreshItems = () => {
    setItems(getItems(username));
  };

  const handleCreate = (type: ItemType, name: string, content?: string) => {
    const newItem: FileSystemItem = {
      id: crypto.randomUUID(),
      parentId: currentFolderId,
      type,
      name,
      content,
      createdAt: Date.now(),
    };
    saveItem(username, newItem);
    refreshItems();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      deleteItem(username, id);
      refreshItems();
    }
  };

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, { id: item.id, name: item.name }]);
      setSearchQuery(''); 
    } else if (item.type === 'link') {
      if (item.content) window.open(item.content, '_blank');
    } else if (item.type === 'note') {
      setViewingItem(item);
    } else if (item.type === 'file') {
      // Download file
      if (item.content) {
        const link = document.createElement('a');
        link.href = item.content;
        link.download = item.name;
        link.click();
      }
    }
  };

  const navigateUp = (index: number) => {
    if (index === -1) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
    setSearchQuery('');
  };

  const filteredItems = items.filter(item => {
    if (searchQuery) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return item.parentId === currentFolderId;
  });

  const getIcon = (type: ItemType) => {
    switch (type) {
      case 'folder': return <Folder className="text-indigo-400" size={24} fill="currentColor" fillOpacity={0.2} />;
      case 'note': return <StickyNote className="text-yellow-500" size={24} />;
      case 'link': return <LinkIcon className="text-blue-500" size={24} />;
      case 'file': return <FileText className="text-gray-500" size={24} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap w-full sm:w-auto">
          <button 
            onClick={() => navigateUp(-1)} 
            className={`p-2 rounded-lg transition-colors ${currentPath.length === 0 ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Home size={18} />
          </button>
          {currentPath.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
              <button 
                onClick={() => navigateUp(index)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  index === currentPath.length - 1 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white border focus:border-indigo-500 rounded-lg text-sm transition-all outline-none"
            />
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-medium flex-shrink-0"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nouveau</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            {searchQuery ? (
               <p>Aucun résultat pour "{searchQuery}"</p>
            ) : (
              <>
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <FolderOpen size={40} className="text-slate-300" />
                </div>
                <p className="font-medium">Ce dossier est vide</p>
                <p className="text-sm mt-1">Cliquez sur "Nouveau" pour ajouter du contenu</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="group relative bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all flex flex-col items-center text-center aspect-square justify-center gap-3"
              >
                <div className="p-3 bg-slate-50 rounded-full group-hover:bg-indigo-50 transition-colors">
                  {getIcon(item.type)}
                </div>
                <span className="text-sm font-medium text-slate-700 truncate w-full px-2">
                  {item.name}
                </span>
                
                {/* Meta info / Action hint */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                {item.type === 'link' && <ExternalLink size={12} className="absolute bottom-3 right-3 text-slate-300" />}
                {item.type === 'file' && <Download size={12} className="absolute bottom-3 right-3 text-slate-300" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateItemModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
        parentId={currentFolderId}
      />
      
      <ViewItemModal
        item={viewingItem}
        onClose={() => setViewingItem(null)}
      />
    </div>
  );
};

export default FileBrowser;