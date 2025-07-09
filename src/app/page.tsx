"use client";

import { useState, useMemo, useEffect } from 'react';
import type { ImageItem, Board, ViewSettings } from '@/lib/types';
import AppHeader from '@/components/app-header';
import ImageGrid from '@/components/image-grid';
import ImageDetailDialog from '@/components/image-detail-dialog';
import FilterToolbar from '@/components/filter-toolbar';
import { useToast } from '@/hooks/use-toast';
import { Triangle } from 'lucide-react';

const UNCATEGORIZED_BOARD: Board = { id: 'uncategorized', name: 'Uncategorized' };

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    viewMode: 'moodboard',
    gridColumns: 3,
    listShowCover: true,
    listShowTitle: true,
    listShowNotes: true,
    listShowTags: true,
    listCoverPosition: 'left',
  });

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedImages = window.localStorage.getItem('tarsus-images');
      if (storedImages) {
        setImages(JSON.parse(storedImages));
      }
      const storedBoards = window.localStorage.getItem('tarsus-boards');
      if (storedBoards) {
        setBoards(JSON.parse(storedBoards));
      }
      const storedSettings = window.localStorage.getItem('tarsus-view-settings');
      if (storedSettings) {
        setViewSettings(JSON.parse(storedSettings));
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
  }, []); // Empty dependency array ensures this runs only once

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isDataLoaded) {
      try {
        window.localStorage.setItem('tarsus-images', JSON.stringify(images));
        window.localStorage.setItem('tarsus-boards', JSON.stringify(boards));
        window.localStorage.setItem('tarsus-view-settings', JSON.stringify(viewSettings));
      } catch (error) {
        console.error('Failed to save to localStorage', error);
          toast({
          title: "Error",
          description: "Could not save your changes to your browser.",
          variant: 'destructive',
        });
      }
    }
  }, [images, boards, viewSettings, isDataLoaded]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    images.forEach(image => {
      image.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [images]);

  const boardsForFilter = useMemo(() => {
    const hasUncategorizedImages = images.some(image => !image.boardId);
    if (hasUncategorizedImages) {
      return [UNCATEGORIZED_BOARD, ...boards];
    }
    return boards;
  }, [images, boards]);

  const handleAddImage = (newImage: Omit<ImageItem, 'id'>, newBoardName?: string) => {
    let finalBoardId = newImage.boardId;

    if (newBoardName && newBoardName.trim()) {
      const newBoard: Board = {
        id: `board-${Date.now()}`,
        name: newBoardName.trim(),
      };
      setBoards(prevBoards => [...prevBoards, newBoard]);
      finalBoardId = newBoard.id;
    }
    
    const fullImage: ImageItem = {
      ...newImage,
      id: `img-${Date.now()}`,
      boardId: finalBoardId,
    };
    setImages(prevImages => [fullImage, ...prevImages]);
    toast({
      title: "Image saved!",
      description: "Your new image has been added to your board.",
    });
  };

  const handleDeleteImage = (imageId: string) => {
    setImages(prevImages => prevImages.filter(img => img.id !== imageId));
    setSelectedImage(null);
    toast({
      title: "Image deleted",
      description: "The image has been removed from your board.",
      variant: 'destructive',
    });
  };

  const handleUpdateImage = (updatedImage: ImageItem) => {
    setImages(prevImages => prevImages.map(img => (img.id === updatedImage.id ? updatedImage : img)));
    setSelectedImage(updatedImage);
     toast({
      title: "Image updated!",
      description: "Your changes have been saved.",
    });
  }

  const handleBoardSelect = (boardId: string) => {
    setSelectedBoards(prev =>
      prev.includes(boardId)
        ? prev.filter(id => id !== boardId)
        : [...prev, boardId]
    );
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  
  const handleClearTagFilters = () => {
    setSelectedTags([]);
  };

  const handleUpdateViewSettings = (newSettings: Partial<ViewSettings>) => {
    setViewSettings(prev => ({ ...prev, ...newSettings }));
  };

  const filteredImages = useMemo(() => {
    return images.filter(image => {
      // Search term filter (searches across title, notes, tags, and board name)
      if (searchTerm) {
        const lowercasedFilter = searchTerm.toLowerCase();
        const boardName = image.boardId ? boards.find(b => b.id === image.boardId)?.name || '' : 'Uncategorized';
        const searchMatch =
          image.title.toLowerCase().includes(lowercasedFilter) ||
          image.notes.toLowerCase().includes(lowercasedFilter) ||
          image.tags.some(tag => tag.toLowerCase().includes(lowercasedFilter)) ||
          boardName.toLowerCase().includes(lowercasedFilter);
        if (!searchMatch) return false;
      }

      // Selected boards filter (OR logic)
      if (selectedBoards.length > 0) {
        const imageBoardId = image.boardId || 'uncategorized';
        if (!selectedBoards.includes(imageBoardId)) {
          return false;
        }
      }

      // Selected tags filter (AND logic)
      if (selectedTags.length > 0 && !selectedTags.every(tag => image.tags.includes(tag))) {
        return false;
      }

      return true;
    });
  }, [images, searchTerm, boards, selectedBoards, selectedTags]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow">
        <div className="container mx-auto px-4 md:px-6 py-8">
            <FilterToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAddImage={handleAddImage}
                boards={boardsForFilter}
                allBoards={boards}
                tags={allTags}
                selectedBoards={selectedBoards}
                onBoardSelect={handleBoardSelect}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onClearTagFilters={handleClearTagFilters}
                itemCount={filteredImages.length}
                viewSettings={viewSettings}
                onViewSettingsChange={handleUpdateViewSettings}
            />
            {images.length === 0 && !searchTerm ? null : filteredImages.length > 0 ? (
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
            )}
        </div>
      </main>
      {selectedImage && (
        <ImageDetailDialog
          image={selectedImage}
          board={boards.find(b => b.id === selectedImage.boardId)}
          boards={boards}
          allTags={allTags}
          isOpen={!!selectedImage}
          onOpenChange={(open) => !open && setSelectedImage(null)}
          onDelete={handleDeleteImage}
          onUpdate={handleUpdateImage}
        />
      )}
    </div>
  );
}
