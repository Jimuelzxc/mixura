
"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import type { ImageItem, ViewSettings, Board } from '@/lib/types';
import ImageGrid from '@/components/image-grid';
import ImageDetailDialog from '@/components/image-detail-dialog';
import FilterToolbar from '@/components/filter-toolbar';
import { useToast } from '@/hooks/use-toast';
import { ImagePlus, AlertTriangle, Edit, Check, X, LayoutGrid, Pencil, UploadCloud, Settings } from 'lucide-react';
import AddLinkDialog from '@/components/add-link-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import BoardTabs from '@/components/board-tabs';
import { initialData } from '@/lib/data';
import ApiSettingsDialog from '@/components/api-settings-dialog';

const LOCALSTORAGE_KEY = 'mixura-data';
const API_KEY_LOCALSTORAGE_KEY = 'mixura-api-key';

const defaultViewSettings: ViewSettings = {
  viewMode: 'moodboard',
  gridColumns: 3,
  listShowCover: true,
  listShowTitle: true,
  listShowNotes: true,
  listShowTags: true,
  listCoverPosition: 'left',
  backgroundPattern: 'none',
};


export default function Home() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [isAddLinkDialogOpen, setAddLinkDialogOpen] = useState(false);
  const [addLinkInitialUrl, setAddLinkInitialUrl] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingBoardName, setEditingBoardName] = useState('');

  const [deletingBoardId, setDeletingBoardId] = useState<string | null>(null);
  const [isCanvasFullscreen, setIsCanvasFullscreen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  
  const { toast } = useToast();
  
  const [isDeleteAllAlertOpen, setDeleteAllAlertOpen] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const boardNameInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const activeBoard = useMemo(() => {
    return boards.find(b => b.id === activeBoardId) || null;
  }, [boards, activeBoardId]);
  
  const isAllBoardsView = activeBoardId === 'all';

  const images = useMemo(() => {
    if (isAllBoardsView) {
      return boards.flatMap(b => b.images);
    }
    return activeBoard?.images || [];
  }, [activeBoard, boards, isAllBoardsView]);
  
  const viewSettings = useMemo(() => {
    if (isAllBoardsView) {
      return boards[0]?.viewSettings;
    }
    return activeBoard?.viewSettings;
  }, [activeBoard, boards, isAllBoardsView]);
  
  const isCanvasViewActive = viewSettings?.viewMode === 'canvas';

  useEffect(() => {
    try {
      const storedData = window.localStorage.getItem(LOCALSTORAGE_KEY);
      if (storedData) {
        const data = JSON.parse(storedData);
        if (data.boards && data.activeBoardId) {
          const sanitizedBoards = data.boards.map((board: Board) => ({
            ...board,
            viewSettings: {
              ...defaultViewSettings,
              ...(board.viewSettings || {}),
            }
          }))
          setBoards(sanitizedBoards);
          setActiveBoardId(data.activeBoardId);
        } else {
          // Fallback for old data structure (before boards)
          const oldImages = window.localStorage.getItem('tarsus-images');
          const oldSettings = window.localStorage.getItem('tarsus-view-settings');
          
          const defaultBoard: Board = {
            id: `board-${Date.now()}`,
            name: 'My Board',
            images: oldImages ? JSON.parse(oldImages) : [],
            viewSettings: {
              ...defaultViewSettings,
              ...(oldSettings ? JSON.parse(oldSettings) : {}),
            }
          };
          setBoards([defaultBoard]);
          setActiveBoardId(defaultBoard.id);
        }
      } else {
        // No data found, load initial dummy data
        setBoards(initialData.boards);
        setActiveBoardId(initialData.activeBoardId);
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
    if (editingBoardId && boardNameInputRef.current) {
        boardNameInputRef.current.select();
    }
  }, [editingBoardId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        event.preventDefault();
        setAddLinkInitialUrl(undefined);
        setAddLinkDialogOpen(true);
      }
      if (event.key === 'Escape' && isCanvasFullscreen) {
        event.preventDefault();
        setIsCanvasFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCanvasFullscreen]);

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

  const updateBoard = (boardId: string, updater: (board: Board) => Board) => {
     if (!boardId) return;
    setBoards(currentBoards =>
      currentBoards.map(board =>
        board.id === boardId ? updater(board) : board
      )
    );
  };

  const updateActiveBoard = (updater: (board: Board) => Board) => {
    updateBoard(activeBoardId!, updater);
  }
  
  const updateBoards = (updater: (board: Board[]) => Board[]) => {
    setBoards(updater);
  };

  const handleAddImage = (newImage: Omit<ImageItem, 'id'>) => {
    if (isAllBoardsView || !activeBoardId) {
      toast({
        title: "Cannot Add Image",
        description: "Please select a specific board to add an image.",
        variant: 'destructive',
      });
      return;
    }
    const fullImage: ImageItem = {
      ...newImage,
      id: `img-${Date.now()}`,
      colors: newImage.colors || [],
      x: 100,
      y: 100
    };
    updateBoard(activeBoardId, board => ({
      ...board,
      images: [fullImage, ...board.images]
    }));
    toast({
      title: "Image saved!",
      description: "Your new image has been added to the current board.",
    });
  };

  const handleDeleteImage = (imageId: string) => {
    updateBoards(currentBoards => 
        currentBoards.map(board => ({
            ...board,
            images: board.images.filter(img => img.id !== imageId)
        }))
    );
    setSelectedImage(null);
    toast({
      title: "Image deleted",
      description: "The image has been removed from your collection.",
      variant: 'destructive',
    });
  };

  const handleUpdateImage = (updatedImage: ImageItem, showToast: boolean = true) => {
    updateBoards(currentBoards => 
      currentBoards.map(board => ({
        ...board,
        images: board.images.map(img => (img.id === updatedImage.id ? updatedImage : img))
      }))
    );
    if (selectedImage?.id === updatedImage.id) {
        setSelectedImage(updatedImage);
    }
    if (showToast) {
         toast({
          title: "Image updated!",
          description: "Your changes have been saved.",
        });
    }
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
    if (isAllBoardsView) {
        updateBoards(boards => boards.map(b => ({
            ...b,
            viewSettings: { ...b.viewSettings, ...newSettings }
        })));
    } else if (activeBoardId) {
        updateBoard(activeBoardId, board => ({
            ...board,
            viewSettings: { ...board.viewSettings, ...newSettings }
        }));
    }
  };

  const handleExport = () => {
    const boardToExport = isAllBoardsView ? { name: 'All_Boards' } : activeBoard;
    if (!boardToExport) return;
    const dataStr = JSON.stringify({ boards, activeBoardId }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const safeBoardName = boardToExport.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
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
        viewSettings: defaultViewSettings,
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
      viewSettings: defaultViewSettings,
    };
    setBoards(prev => [...prev, newBoard]);
    setActiveBoardId(newBoard.id);
    toast({ title: 'New Board Created!', description: `Switched to "${newBoard.name}".`});
  };
  
  const handleSwitchBoard = (boardId: string) => {
    setActiveBoardId(boardId);
    if (boardId === 'all') {
      toast({ title: 'Switched View', description: `Now viewing "All Boards".`});
    } else {
      const board = boards.find(b => b.id === boardId);
      if (board) {
        toast({ title: 'Switched Board', description: `Now viewing "${board.name}".`});
      }
    }
  };

  const handleOpenDeleteBoardDialog = (boardId: string) => {
    setDeletingBoardId(boardId);
  };
  
  const handleDeleteBoard = () => {
    if (!deletingBoardId) return;

    const boardToDelete = boards.find(b => b.id === deletingBoardId);

    if (boards.length <= 1) {
        const newBoard: Board = {
            id: `board-${Date.now()}`,
            name: 'My First Board',
            images: [],
            viewSettings: defaultViewSettings,
        };
        setBoards([newBoard]);
        setActiveBoardId(newBoard.id);
        toast({ title: `Board "${boardToDelete?.name}" deleted`, description: 'A new empty board has been created.', variant: 'destructive' });
    } else {
        setBoards(prev => prev.filter(b => b.id !== deletingBoardId));
        if (activeBoardId === deletingBoardId) {
            setActiveBoardId('all');
        }
        toast({ title: `Board "${boardToDelete?.name}" Deleted`, variant: 'destructive'});
    }
    
    setDeletingBoardId(null);
  };

  const handleStartEditingBoardName = (boardId: string) => {
    const boardToEdit = boards.find(b => b.id === boardId);
    if (boardToEdit) {
        setEditingBoardId(boardId);
        setEditingBoardName(boardToEdit.name);
    }
  };

  const handleCancelEditingBoardName = () => {
    setEditingBoardId(null);
    setEditingBoardName('');
  };
  
  const handleSaveBoardName = () => {
    if (editingBoardName.trim() && editingBoardId) {
        updateBoard(editingBoardId, board => ({ ...board, name: editingBoardName.trim() }));
        setEditingBoardId(null);
        toast({ title: 'Board Renamed', description: `The board is now named "${editingBoardName.trim()}".`});
    } else {
        setEditingBoardId(null);
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
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (isAllBoardsView) {
      toast({ title: "Cannot Add Image", description: "Please select a specific board before dropping an image.", variant: "destructive" });
      return;
    }

    const html = e.dataTransfer.getData('text/html');
    if (html) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const img = doc.querySelector('img');
      if (img && img.src) {
        setAddLinkInitialUrl(img.src);
        setAddLinkDialogOpen(true);
        return;
      }
    }
    
    const uri = e.dataTransfer.getData('text/uri-list');
    if (uri) {
      setAddLinkInitialUrl(uri);
      setAddLinkDialogOpen(true);
      return;
    }

    const text = e.dataTransfer.getData('text/plain');
    if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
      setAddLinkInitialUrl(text);
      setAddLinkDialogOpen(true);
      return;
    }

    toast({
      title: 'Could not add image',
      description: 'The dragged item does not contain a valid image URL.',
      variant: 'destructive',
    });
  };

  const handleOpenAddDialog = () => {
    setAddLinkInitialUrl(undefined);
    setAddLinkDialogOpen(true);
  }

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem(API_KEY_LOCALSTORAGE_KEY, key);
    toast({ title: 'API Key Saved!', description: 'Your Gemini API key has been securely saved in your browser.' });
    setIsApiSettingsOpen(false);
  }

  return (
    <div 
      className={cn(
        "flex flex-col bg-muted/20", 
        (isCanvasFullscreen || isCanvasViewActive) ? "h-screen" : "min-h-screen",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && !isAllBoardsView && (
        <div className="fixed inset-0 bg-primary/20 z-50 flex flex-col items-center justify-center pointer-events-none border-4 border-dashed border-primary">
          <UploadCloud className="w-24 h-24 text-primary" />
          <p className="mt-4 text-2xl font-bold text-primary">Drop image to add</p>
        </div>
      )}

      <BoardTabs
        boards={boards}
        activeBoardId={activeBoardId}
        onNewBoard={handleNewBoard}
        onSwitchBoard={handleSwitchBoard}
        onDeleteBoard={handleOpenDeleteBoardDialog}
        onRenameBoard={handleStartEditingBoardName}
        isAllBoardsView={isAllBoardsView}
        onAddImageClick={handleOpenAddDialog}
        onImportClick={handleImportClick}
        onExportClick={handleExport}
        onDeleteAllClick={() => setDeleteAllAlertOpen(true)}
        onApiSettingsClick={() => setIsApiSettingsOpen(true)}
        isAddDisabled={isAllBoardsView}
      />

      <main className={cn(
        "flex-grow flex flex-col min-h-0",
        isCanvasViewActive ? "bg-background" : "bg-background pt-8",
        (isCanvasFullscreen) && "h-screen !pt-0"
      )}>
        <div className={cn(
            "container mx-auto px-4 md:px-6 flex flex-col flex-grow min-h-0", 
            (isCanvasFullscreen) && "p-4 md:p-8 max-w-full h-full",
            isCanvasViewActive && "bg-background"
        )}>
            <div className={cn(isCanvasFullscreen && "hidden")}>
              {isAllBoardsView ? (
                  <div className="py-10">
                      <h1 className="text-6xl md:text-[8rem] font-bold tracking-tighter leading-none">All Boards</h1>
                  </div>
              ) : activeBoard && (
                  <div className="group py-10">
                      <div className="flex items-center gap-4">
                          <h1 className="text-6xl md:text-[8rem] font-bold tracking-tighter leading-none">{activeBoard.name}</h1>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleStartEditingBoardName(activeBoard.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                      <Pencil className="w-10 h-10" />
                                  </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Rename board</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                      </div>
                  </div>
              )}
              <FilterToolbar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onAddImageClick={handleOpenAddDialog}
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
                  isAddDisabled={isAllBoardsView}
              />
            </div>
            <div className={cn(
              "flex-grow min-h-0",
              isCanvasViewActive && "flex flex-col mb-4",
            )}>
                {isDataLoaded && (
                  images.length === 0 && !searchTerm ? (
                    <div className="flex flex-col items-center justify-center text-center h-full mt-20 text-muted-foreground">
                      <ImagePlus size={64} className="mb-4 text-muted-foreground/50" />
                      <h2 className="text-2xl font-semibold">{isAllBoardsView ? "No images on any board" : "Your board is empty"}</h2>
                      <p className="mt-2">{isAllBoardsView ? "Add an image to one of your boards to see it here." : "Click \"Add Image\" to save your first inspiration."}</p>
                    </div>
                  ) : filteredImages.length > 0 ? (
                    <ImageGrid 
                      images={filteredImages} 
                      onImageSelect={setSelectedImage} 
                      onTagClick={handleTagSelect} 
                      viewSettings={viewSettings}
                      onUpdateImage={handleUpdateImage}
                      isCanvasFullscreen={isCanvasFullscreen}
                      onToggleFullscreen={() => setIsCanvasFullscreen(prev => !prev)}
                      onUpdateViewSettings={handleUpdateViewSettings}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full mt-20 text-muted-foreground">
                      <h2 className="text-2xl font-semibold">No Images Found</h2>
                      <p className="mt-2">Try adjusting your filters or add a new image.</p>
                    </div>
                  )
                )}
            </div>
        </div>
      </main>
      
      <input type="file" ref={importInputRef} onChange={handleFileImport} accept="application/json" className="hidden" />

      <AddLinkDialog
        isOpen={isAddLinkDialogOpen}
        onOpenChange={setAddLinkDialogOpen}
        onAddImage={handleAddImage}
        allTags={allTags}
        initialUrl={addLinkInitialUrl}
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

       <AlertDialog open={!!editingBoardId} onOpenChange={(open) => !open && handleCancelEditingBoardName()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Board</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for this board.
            </AlertDialogDescription>
          </AlertDialogHeader>
            <Input
              value={editingBoardName}
              onChange={(e) => setEditingBoardName(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveBoardName();
                  if (e.key === 'Escape') handleCancelEditingBoardName();
              }}
              className="mt-4"
              placeholder="Board name..."
              autoFocus
            />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelEditingBoardName}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveBoardName}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      <AlertDialog open={!!deletingBoardId} onOpenChange={(open) => !open && setDeletingBoardId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-grow">
                <AlertDialogTitle>Delete this board?</AlertDialogTitle>
                <AlertDialogDescription>
                    {`Are you sure you want to delete the board "${boards.find(b => b.id === deletingBoardId)?.name}"? This action cannot be undone.`}
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

      <ApiSettingsDialog
        isOpen={isApiSettingsOpen}
        onOpenChange={setIsApiSettingsOpen}
        onSave={handleSaveApiKey}
      />
    </div>
  );
}
