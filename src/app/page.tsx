
"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import type { ImageItem, ViewSettings, Board } from '@/lib/types';
import AppHeader from '@/components/app-header';
import ImageGrid from '@/components/image-grid';
import ImageDetailDialog from '@/components/image-detail-dialog';
import FilterToolbar from '@/components/filter-toolbar';
import { useToast } from '@/hooks/use-toast';
import { ImagePlus, AlertTriangle, Edit, Check, X } from 'lucide-react';
import AddLinkDialog from '@/components/add-link-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LOCALSTORAGE_KEY = 'mixura-data';

export default function Home() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [isAddLinkDialogOpen, setAddLinkDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isEditingBoardName, setIsEditingBoardName] = useState(false);
  const [editingBoardName, setEditingBoardName] = useState('');
  
  const { toast } = useToast();
  
  const [isDeleteAllAlertOpen, setDeleteAllAlertOpen] = useState(false);
  const [isDeleteBoardAlertOpen, setDeleteBoardAlertOpen] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const boardNameInputRef = useRef<HTMLInputElement>(null);

  const activeBoard = useMemo(() => {
    return boards.find(b => b.id === activeBoardId) || null;
  }, [boards, activeBoardId]);

  const images = useMemo(() => activeBoard?.images || [], [activeBoard]);
  const viewSettings = useMemo(() => activeBoard?.viewSettings, [activeBoard]);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedData = window.localStorage.getItem(LOCALSTORAGE_KEY);
      if (storedData) {
        const data = JSON.parse(storedData);
        if (data.boards && data.activeBoardId) {
          setBoards(data.boards);
          setActiveBoardId(data.activeBoardId);
        } else {
          // Migration for old data structure
          const oldImages = window.localStorage.getItem('tarsus-images');
          const oldSettings = window.localStorage.getItem('tarsus-view-settings');
          
          const defaultBoard: Board = {
            id: `board-${Date.now()}`,
            name: 'My Board',
            images: oldImages ? JSON.parse(oldImages) : [],
            viewSettings: oldSettings ? JSON.parse(oldSettings) : {
              viewMode: 'moodboard',
              gridColumns: 3,
              listShowCover: true,
              listShowTitle: true,
              listShowNotes: true,
              listShowTags: true,
              listCoverPosition: 'left',
            },
          };
          setBoards([defaultBoard]);
          setActiveBoardId(defaultBoard.id);
        }
      } else {
        // Create a new default board if no data exists
        const newBoard: Board = {
          id: `board-${Date.now()}`,
          name: 'My First Board',
          images: [],
          viewSettings: {
            viewMode: 'moodboard',
            gridColumns: 3,
            listShowCover: true,
            listShowTitle: true,
            listShowNotes: true,
            listShowTags: true,
            listCoverPosition: 'left',
          },
        };
        setBoards([newBoard]);
        setActiveBoardId(newBoard.id);
      }
    } catch (error) {
      console.error('Failed to load from localStorage', error);
      toast({
        title: "Error",
        description: "Could not load saved data from your browser.",
        variant: 'destructive',
      });
    } finally {
      setIsDataLoaded(true);
    }
  }, [toast]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isDataLoaded) {
      try {
        const dataToStore = JSON.stringify({ boards, activeBoardId });
        window.localStorage.setItem(LOCALSTORAGE_KEY, dataToStore);
      } catch (error) {
        console.error('Failed to save to localStorage', error);
          toast({
          title: "Error",
          description: "Could not save your changes to your browser.",
          variant: 'destructive',
        });
      }
    }
  }, [boards, activeBoardId, isDataLoaded, toast]);
  
  useEffect(() => {
    if (isEditingBoardName && boardNameInputRef.current) {
        boardNameInputRef.current.select();
    }
  }, [isEditingBoardName]);

  // Keyboard shortcut for adding a new image
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        event.preventDefault();
        setAddLinkDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    images.forEach(image => {
      image.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [images]);
  
  const allColors = useMemo(() => {
    const colors = new Set<string>();
    images.forEach(image => {
      (image.colors || []).forEach(color => colors.add(color));
    });
    return Array.from(colors).sort();
  }, [images]);

  const updateActiveBoard = (updater: (board: Board) => Board) => {
    if (!activeBoardId) return;
    setBoards(currentBoards => 
      currentBoards.map(board => 
        board.id === activeBoardId ? updater(board) : board
      )
    );
  };

  const handleAddImage = (newImage: Omit<ImageItem, 'id'>) => {
    const fullImage: ImageItem = {
      ...newImage,
      id: `img-${Date.now()}`,
      colors: newImage.colors || [],
    };
    updateActiveBoard(board => ({
      ...board,
      images: [fullImage, ...board.images]
    }));
    toast({
      title: "Image saved!",
      description: "Your new image has been added to the current board.",
    });
  };

  const handleDeleteImage = (imageId: string) => {
    updateActiveBoard(board => ({
      ...board,
      images: board.images.filter(img => img.id !== imageId)
    }));
    setSelectedImage(null);
    toast({
      title: "Image deleted",
      description: "The image has been removed from your collection.",
      variant: 'destructive',
    });
  };

  const handleUpdateImage = (updatedImage: ImageItem) => {
    updateActiveBoard(board => ({
      ...board,
      images: board.images.map(img => (img.id === updatedImage.id ? updatedImage : img))
    }));
    setSelectedImage(updatedImage);
     toast({
      title: "Image updated!",
      description: "Your changes have been saved.",
    });
  }

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  
  const handleColorSelect = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedColors([]);
  };

  const handleUpdateViewSettings = (newSettings: Partial<ViewSettings>) => {
    updateActiveBoard(board => ({
      ...board,
      viewSettings: { ...board.viewSettings, ...newSettings }
    }));
  };

  const handleExport = () => {
    if (!activeBoard) return;
    const dataStr = JSON.stringify({ boards, activeBoardId }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const safeBoardName = activeBoard.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeBoardName}-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Exported!', description: 'All your boards have been exported.' });
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        if (Array.isArray(data.boards) && data.activeBoardId) {
          setBoards(data.boards);
          setActiveBoardId(data.activeBoardId);
          toast({ title: 'Import successful!', description: 'Your data has been imported.' });
        } else {
          throw new Error('Invalid JSON format for multi-board data.');
        }
      } catch (error) {
        console.error('Import failed', error);
        toast({ title: 'Import Failed', description: 'The selected file is not a valid backup.', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
    if (importInputRef.current) {
      importInputRef.current.value = '';
    }
  };

  const handleDeleteAll = () => {
    const newBoard: Board = {
        id: `board-${Date.now()}`,
        name: 'My First Board',
        images: [],
        viewSettings: {
            viewMode: 'moodboard',
            gridColumns: 3,
            listShowCover: true,
            listShowTitle: true,
            listShowNotes: true,
            listShowTags: true,
            listCoverPosition: 'left',
        },
    };
    setBoards([newBoard]);
    setActiveBoardId(newBoard.id);
    setDeleteAllAlertOpen(false);
    toast({ title: 'All data deleted', description: 'Your collection has been cleared and a new empty board was created.', variant: 'destructive' });
  };
  
  const handleNewBoard = () => {
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      name: `Board ${boards.length + 1}`,
      images: [],
      viewSettings: {
        viewMode: 'moodboard',
        gridColumns: 3,
        listShowCover: true,
        listShowTitle: true,
        listShowNotes: true,
        listShowTags: true,
        listCoverPosition: 'left',
      },
    };
    setBoards(prev => [...prev, newBoard]);
    setActiveBoardId(newBoard.id);
    toast({ title: 'New Board Created!', description: `Switched to "${newBoard.name}".`});
  };
  
  const handleSwitchBoard = (boardId: string) => {
    setActiveBoardId(boardId);
    const board = boards.find(b => b.id === boardId);
    if (board) {
      toast({ title: 'Switched Board', description: `Now viewing "${board.name}".`});
    }
  };

  const handleDeleteBoard = () => {
    if (boards.length <= 1) {
        toast({ title: 'Cannot Delete', description: 'You cannot delete the last board.', variant: 'destructive' });
        setDeleteBoardAlertOpen(false);
        return;
    }
    setBoards(prev => prev.filter(b => b.id !== activeBoardId));
    const newActiveBoardId = boards.find(b => b.id !== activeBoardId)?.id || null;
    setActiveBoardId(newActiveBoardId);
    setDeleteBoardAlertOpen(false);
    toast({ title: 'Board Deleted', variant: 'destructive'});
  };

  const handleStartEditingBoardName = () => {
    if (activeBoard) {
        setEditingBoardName(activeBoard.name);
        setIsEditingBoardName(true);
    }
  };

  const handleCancelEditingBoardName = () => {
    setIsEditingBoardName(false);
    setEditingBoardName('');
  };
  
  const handleSaveBoardName = () => {
    if (editingBoardName.trim() && activeBoard) {
        updateActiveBoard(board => ({ ...board, name: editingBoardName.trim() }));
        setIsEditingBoardName(false);
        toast({ title: 'Board Renamed', description: `The board is now named "${editingBoardName.trim()}".`});
    } else {
        setIsEditingBoardName(false);
    }
  };

  const filteredImages = useMemo(() => {
    return images.filter(image => {
      if (searchTerm) {
        const lowercasedFilter = searchTerm.toLowerCase();
        const searchMatch =
          image.title.toLowerCase().includes(lowercasedFilter) ||
          image.notes.toLowerCase().includes(lowercasedFilter) ||
          image.tags.some(tag => tag.toLowerCase().includes(lowercasedFilter)) ||
          (image.colors || []).some(color => color.toLowerCase().includes(lowercasedFilter));
        if (!searchMatch) return false;
      }
      if (selectedTags.length > 0 && !selectedTags.every(tag => image.tags.includes(tag))) return false;
      if (selectedColors.length > 0) {
        const imageColors = image.colors || [];
        if (!selectedColors.some(selectedColor => imageColors.includes(selectedColor))) return false;
      }
      return true;
    });
  }, [images, searchTerm, selectedTags, selectedColors]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader
        onAddImageClick={() => setAddLinkDialogOpen(true)}
        onImportClick={handleImportClick}
        onExportClick={handleExport}
        onDeleteAllClick={() => setDeleteAllAlertOpen(true)}
        boards={boards}
        activeBoardId={activeBoardId}
        onNewBoard={handleNewBoard}
        onSwitchBoard={handleSwitchBoard}
        onDeleteBoard={() => setDeleteBoardAlertOpen(true)}
      />
      <main className="flex-grow">
        <div className="container mx-auto px-4 md:px-6 py-8">
            {activeBoard && (
                <div className="mb-8">
                    {isEditingBoardName ? (
                        <div className="space-y-4 max-w-xl">
                            <Input
                                ref={boardNameInputRef}
                                value={editingBoardName}
                                onChange={(e) => setEditingBoardName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveBoardName();
                                    if (e.key === 'Escape') handleCancelEditingBoardName();
                                }}
                                className="text-4xl font-bold tracking-tighter h-auto"
                                placeholder="Board name..."
                            />
                            <div className="flex items-center gap-2">
                                <Button onClick={handleSaveBoardName}><Check className="w-4 h-4 mr-2"/> Save</Button>
                                <Button variant="ghost" onClick={handleCancelEditingBoardName}>Cancel</Button>
                            </div>
                        </div>
                    ) : (
                         <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-bold tracking-tighter">{activeBoard.name}</h1>
                            <Button size="sm" variant="outline" onClick={handleStartEditingBoardName}>
                                <Edit className="w-4 h-4 mr-2"/>
                                Edit Name
                            </Button>
                         </div>
                    )}
                </div>
            )}
            <FilterToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddImageClick={() => setAddLinkDialogOpen(true)}
                allTags={allTags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                allColors={allColors}
                selectedColors={selectedColors}
                onColorSelect={handleColorSelect}
                onClearFilters={handleClearFilters}
                itemCount={filteredImages.length}
                viewSettings={viewSettings}
                onViewSettingsChange={handleUpdateViewSettings}
            />
            {isDataLoaded && (
              images.length === 0 && !searchTerm ? (
                <div className="flex flex-col items-center justify-center text-center h-full mt-20 text-muted-foreground">
                  <ImagePlus size={64} className="mb-4 text-muted-foreground/50" />
                  <h2 className="text-2xl font-semibold">Your board is empty</h2>
                  <p className="mt-2">Click "Add Image" to save your first inspiration.</p>
                </div>
              ) : filteredImages.length > 0 ? (
                <ImageGrid 
                  images={filteredImages} 
                  onImageSelect={setSelectedImage} 
                  onTagClick={handleTagSelect} 
                  viewSettings={viewSettings}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full mt-20 text-muted-foreground">
                  <h2 className="text-2xl font-semibold">No Images Found</h2>
                  <p className="mt-2">Try adjusting your filters or add a new image.</p>
                </div>
              )
            )}
        </div>
      </main>
      
      <input type="file" ref={importInputRef} onChange={handleFileImport} accept="application/json" className="hidden" />

      <AddLinkDialog
        isOpen={isAddLinkDialogOpen}
        onOpenChange={setAddLinkDialogOpen}
        onAddImage={handleAddImage}
        allTags={allTags}
      />
      
      {selectedImage && (
        <ImageDetailDialog
          image={selectedImage}
          allTags={allTags}
          isOpen={!!selectedImage}
          onOpenChange={(open) => !open && setSelectedImage(null)}
          onDelete={handleDeleteImage}
          onUpdate={handleUpdateImage}
        />
      )}

      <AlertDialog open={isDeleteAllAlertOpen} onOpenChange={setDeleteAllAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-grow">
                <AlertDialogTitle>Are you sure you want to delete all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your boards and images. This action cannot be undone.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll}>Yes, delete all</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteBoardAlertOpen} onOpenChange={setDeleteBoardAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-grow">
                <AlertDialogTitle>Delete this board?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the board "{activeBoard?.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBoard}>Yes, delete board</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
