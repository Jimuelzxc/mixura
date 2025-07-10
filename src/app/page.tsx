"use client";

import { useState, useMemo, useEffect } from 'react';
import type { ImageItem, ViewSettings } from '@/lib/types';
import AppHeader from '@/components/app-header';
import ImageGrid from '@/components/image-grid';
import ImageDetailDialog from '@/components/image-detail-dialog';
import FilterToolbar from '@/components/filter-toolbar';
import { useToast } from '@/hooks/use-toast';
import { ImagePlus } from 'lucide-react';
import AddLinkDialog from '@/components/add-link-dialog';

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
  }, []); // Empty dependency array ensures this runs only once

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
      <AppHeader onAddImageClick={() => setAddLinkDialogOpen(true)} />
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
    </div>
  );
}
