
"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import type { ImageItem, ViewSettings } from '@/lib/types';
import AppHeader from '@/components/app-header';
import ImageGrid from '@/components/image-grid';
import ImageDetailDialog from '@/components/image-detail-dialog';
import FilterToolbar from '@/components/filter-toolbar';
import { useToast } from '@/hooks/use-toast';
import { ImagePlus, AlertTriangle } from 'lucide-react';
import AddLinkDialog from '@/components/add-link-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAddLinkDialogOpen, setAddLinkDialogOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
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
  
  const [isDeleteAllAlertOpen, setDeleteAllAlertOpen] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedImages = window.localStorage.getItem('tarsus-images');
      if (storedImages) {
        setImages(JSON.parse(storedImages));
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
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isDataLoaded) {
      try {
        window.localStorage.setItem('tarsus-images', JSON.stringify(images));
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
  }, [images, viewSettings, isDataLoaded]);

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

  const handleAddImage = (newImage: Omit<ImageItem, 'id'>) => {
    const fullImage: ImageItem = {
      ...newImage,
      id: `img-${Date.now()}`,
      colors: newImage.colors || [],
    };
    setImages(prevImages => [fullImage, ...prevImages]);
    toast({
      title: "Image saved!",
      description: "Your new image has been added to your collection.",
    });
  };

  const handleDeleteImage = (imageId: string) => {
    setImages(prevImages => prevImages.filter(img => img.id !== imageId));
    setSelectedImage(null);
    toast({
      title: "Image deleted",
      description: "The image has been removed from your collection.",
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
    setViewSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify({ images, viewSettings }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Exported!', description: 'Your data has been exported to a JSON file.' });
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
        if (Array.isArray(data.images) && data.viewSettings) {
          // Basic validation
          const newImages = data.images.filter((img: any) => img.id && img.url && img.title);
          setImages(newImages);
          setViewSettings(data.viewSettings);
          toast({ title: 'Import successful!', description: 'Your data has been imported.' });
        } else {
          throw new Error('Invalid JSON format.');
        }
      } catch (error) {
        console.error('Import failed', error);
        toast({ title: 'Import Failed', description: 'The selected file is not a valid JSON backup.', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (importInputRef.current) {
      importInputRef.current.value = '';
    }
  };

  const handleDeleteAll = () => {
    setImages([]);
    setDeleteAllAlertOpen(false);
    toast({ title: 'All data deleted', description: 'Your collection has been cleared.', variant: 'destructive' });
  };

  const filteredImages = useMemo(() => {
    return images.filter(image => {
      // Search term filter (searches across title, notes, and tags)
      if (searchTerm) {
        const lowercasedFilter = searchTerm.toLowerCase();
        const searchMatch =
          image.title.toLowerCase().includes(lowercasedFilter) ||
          image.notes.toLowerCase().includes(lowercasedFilter) ||
          image.tags.some(tag => tag.toLowerCase().includes(lowercasedFilter)) ||
          (image.colors || []).some(color => color.toLowerCase().includes(lowercasedFilter));
        if (!searchMatch) return false;
      }

      // Selected tags filter (AND logic)
      if (selectedTags.length > 0 && !selectedTags.every(tag => image.tags.includes(tag))) {
        return false;
      }

      // Selected colors filter (OR logic for multiple colors)
      if (selectedColors.length > 0) {
        const imageColors = image.colors || [];
        if (!selectedColors.some(selectedColor => imageColors.includes(selectedColor))) {
            return false;
        }
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
      />
      <main className="flex-grow">
        <div className="container mx-auto px-4 md:px-6 py-8">
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
                  <h2 className="text-2xl font-semibold">Your collection is empty</h2>
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
                  This will permanently delete all your images and settings. This action cannot be undone.
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

    </div>
  );
}
