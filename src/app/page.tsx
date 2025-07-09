"use client";

import { useState, useMemo } from 'react';
import type { ImageItem, Board } from '@/lib/types';
import { mockImages, mockBoards } from '@/lib/data';
import AppHeader from '@/components/app-header';
import ImageGrid from '@/components/image-grid';
import ImageDetailDialog from '@/components/image-detail-dialog';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>(mockImages);
  const [boards, setBoards] = useState<Board[]>(mockBoards);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const { toast } = useToast();

  const handleAddImage = (newImage: Omit<ImageItem, 'id'>) => {
    const fullImage: ImageItem = {
      ...newImage,
      id: `img-${Date.now()}`,
    };
    setImages(prevImages => [fullImage, ...prevImages]);
    toast({
      title: "Image saved!",
      description: "Your new image has been added to the board.",
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

  const filteredImages = useMemo(() => {
    if (!searchTerm) return images;
    const lowercasedFilter = searchTerm.toLowerCase();
    return images.filter(image =>
      image.title.toLowerCase().includes(lowercasedFilter) ||
      image.notes.toLowerCase().includes(lowercasedFilter) ||
      image.tags.some(tag => tag.toLowerCase().includes(lowercasedFilter)) ||
      boards.find(b => b.id === image.boardId)?.name.toLowerCase().includes(lowercasedFilter)
    );
  }, [images, searchTerm, boards]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddImage={handleAddImage}
        boards={boards}
      />
      <main className="flex-grow p-4 sm:p-6 md:p-8">
        {filteredImages.length > 0 ? (
          <ImageGrid images={filteredImages} onImageSelect={setSelectedImage} />
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full mt-20 text-muted-foreground">
            <h2 className="text-2xl font-semibold">No Images Found</h2>
            <p className="mt-2">Try adjusting your search or add a new image.</p>
          </div>
        )}
      </main>
      {selectedImage && (
        <ImageDetailDialog
          image={selectedImage}
          board={boards.find(b => b.id === selectedImage.boardId)}
          boards={boards}
          isOpen={!!selectedImage}
          onOpenChange={(open) => !open && setSelectedImage(null)}
          onDelete={handleDeleteImage}
          onUpdate={handleUpdateImage}
        />
      )}
    </div>
  );
}
