
"use client";

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2, Edit, X, Check, Tag, Notebook, AlertTriangle, Sparkles, Loader2, Link, Palette } from 'lucide-react';

import type { ImageItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { suggestDetails } from '@/ai/flows/suggest-details';
import { basicColorMap, cn } from '@/lib/utils';


const imageEditSchema = z.object({
  title: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
});

type ImageEditFormValues = z.infer<typeof imageEditSchema>;

interface ImageDetailDialogProps {
  image: ImageItem;
  allTags: string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (image: ImageItem) => void;
}

export default function ImageDetailDialog({ image, allTags, isOpen, onOpenChange, onDelete, onUpdate }: ImageDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isSuggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<ImageEditFormValues>({
    resolver: zodResolver(imageEditSchema),
    defaultValues: {
      title: image.title,
      notes: image.notes,
      tags: image.tags,
      colors: image.colors || [],
    },
  });

  useEffect(() => {
    if (image) {
      form.reset({
        title: image.title,
        notes: image.notes,
        tags: image.tags,
        colors: image.colors || [],
      });
    }
  }, [image, form]);
  
  useEffect(() => {
    if (!isOpen) {
        setSuggestionsOpen(false);
        setIsEditing(false);
    }
  }, [isOpen]);

  const suggestedTags = useMemo(() => {
    if (!tagInput) return [];
    const currentTags = form.getValues('tags') || [];
    return allTags
        .filter(
            (tag) =>
                tag.toLowerCase().includes(tagInput.toLowerCase()) &&
                !currentTags.includes(tag)
        )
        .slice(0, 5);
  }, [tagInput, allTags, form]);

  const handleEditToggle = () => {
    if (isEditing) {
      form.reset({
        title: image.title,
        notes: image.notes,
        tags: image.tags,
        colors: image.colors || [],
      });
      setTagInput('');
    }
    setIsEditing(!isEditing);
  }

  const onSubmit = (data: ImageEditFormValues) => {
    onUpdate({
      ...image,
      title: data.title || '',
      notes: data.notes || '',
      tags: data.tags || [],
      colors: data.colors || [],
    });
    setIsEditing(false);
  };
  
  const handleAddTag = (tag: string, field: any) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !field.value.includes(trimmedTag)) {
        form.setValue('tags', [...field.value, trimmedTag]);
    }
    setTagInput('');
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag(tagInput, field);
    } else if (e.key === 'Backspace' && !tagInput && field.value?.length > 0) {
      e.preventDefault();
      const newTags = field.value.slice(0, -1);
      form.setValue('tags', newTags);
    }
  };

  const removeTag = (tagToRemove: string, field: any) => {
    const newTags = field.value.filter((tag: string) => tag !== tagToRemove);
    form.setValue('tags', newTags);
  };

  const handleColorToggle = (color: string) => {
    const currentColors = form.getValues('colors') || [];
    if (currentColors.includes(color)) {
      form.setValue('colors', currentColors.filter(c => c !== color));
    } else {
      form.setValue('colors', [...currentColors, color]);
    }
  };

  const handleAiFill = async () => {
      if (!image.url) return;

      setIsGenerating(true);
      try {
        const proxyResponse = await fetch('/api/proxy-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: image.url }),
        });

        if (!proxyResponse.ok) {
          const errorData = await proxyResponse.json();
          throw new Error(errorData.error || 'Failed to fetch image from URL.');
        }

        const { dataUri } = await proxyResponse.json();

        const suggestions = await suggestDetails({
          photoDataUri: dataUri,
        });

        if (suggestions.title) form.setValue('title', suggestions.title);
        if (suggestions.notes) form.setValue('notes', suggestions.notes);
        if (suggestions.tags) form.setValue('tags', suggestions.tags);
        if (suggestions.colors) form.setValue('colors', suggestions.colors);

        toast({
            title: "Suggestions applied!",
            description: "AI has filled in the details for you.",
        });

      } catch (error: any) {
        console.error("AI suggestion failed:", error);
        toast({
          title: "AI Suggestion Failed",
          description: error.message || "Could not generate suggestions for this image.",
          variant: 'destructive',
        });
      } finally {
        setIsGenerating(false);
      }
    };

  if (!image) return null;

  const isGif = image.url.toLowerCase().endsWith('.gif');
  const selectedColors = form.watch('colors') || [];

  const aiButton = (
    <Button
      type="button"
      variant="outline"
      onClick={handleAiFill}
      disabled={isGenerating || isGif}
      className="w-full"
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-5 w-5" />
      )}
      Auto-fill with AI
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col md:flex-row p-0">
        <div className="md:w-2/3 w-full relative">
          <Image
            src={image.url}
            alt={image.title}
            width={1200}
            height={1200}
            className="object-contain w-full h-full max-h-[90vh] rounded-l-md bg-background/20"
            data-ai-hint="abstract texture"
            unoptimized={isGif}
          />
        </div>
        <div className="md:w-1/3 w-full flex flex-col">
          <div className="p-6 flex-grow overflow-y-auto">
          {isEditing ? (
             <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 {isGif ? (
                    <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="w-full">{aiButton}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>AI suggestions are not available for GIFs.</p>
                        </TooltipContent>
                    </Tooltip>
                    </TooltipProvider>
                  ) : (
                    aiButton
                  )}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                     <FormItem>
                      <FormLabel>Tags</FormLabel>
                        <Popover open={isSuggestionsOpen && suggestedTags.length > 0} onOpenChange={setSuggestionsOpen}>
                          <FormControl>
                            <div className="flex flex-wrap gap-2 items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                              {field.value?.map((tag: string) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                  <button
                                    type="button"
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onClick={() => removeTag(tag, field)}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                              <PopoverAnchor asChild>
                                <Input
                                  placeholder="Add a tag..."
                                  value={tagInput}
                                  onChange={(e) => {
                                    setTagInput(e.target.value);
                                    if (!isSuggestionsOpen) setSuggestionsOpen(true);
                                  }}
                                  onKeyDown={(e) => handleTagKeyDown(e, field)}
                                  onFocus={() => setSuggestionsOpen(true)}
                                  className="h-auto flex-1 bg-transparent p-0 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 min-w-[120px]"
                                />
                              </PopoverAnchor>
                            </div>
                          </FormControl>
                           <PopoverContent
                              onOpenAutoFocus={(e) => e.preventDefault()}
                              className="w-[var(--radix-popover-anchor-width)] p-1">
                              <div className="max-h-40 overflow-y-auto">
                                {suggestedTags.map((tag) => (
                                  <button
                                    type="button"
                                    key={tag}
                                    className="w-full text-left text-sm p-2 rounded-sm hover:bg-accent"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleAddTag(tag, field);
                                    }}
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                           </PopoverContent>
                        </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="colors"
                  render={() => (
                    <FormItem>
                      <FormLabel>Colors</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-12 gap-2">
                            {Object.entries(basicColorMap).map(([name, hex]) => (
                                <TooltipProvider key={name}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            onClick={() => handleColorToggle(name)}
                                            className={cn(
                                                "w-6 h-6 rounded-full border-2 transition-all",
                                                selectedColors.includes(name) ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-card hover:border-muted-foreground',
                                                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                            )}
                                            style={{ backgroundColor: hex }}
                                            aria-label={`Select color ${name}`}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{name}</p>
                                    </TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="ghost" onClick={handleEditToggle}>Cancel</Button>
                  <Button type="submit"><Check className="mr-2 h-4 w-4"/> Save</Button>
                </div>
              </form>
            </Form>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{image.title || 'Untitled'}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4 text-sm">
                 <div className="flex items-start gap-3">
                  <Link className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0"/>
                  <div>
                    <h4 className="font-semibold text-muted-foreground">URL</h4>
                    <a href={image.url} target="_blank" rel="noopener noreferrer" className="break-all text-primary hover:underline">
                        {image.url}
                    </a>
                  </div>
                </div>
                {image.tags.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Tag className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0"/>
                     <div>
                      <h4 className="font-semibold text-muted-foreground">Tags</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {image.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                      </div>
                    </div>
                  </div>
                )}
                {image.colors && image.colors.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Palette className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0"/>
                     <div>
                      <h4 className="font-semibold text-muted-foreground">Colors</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {image.colors.map(color => 
                          <Badge key={color} variant="secondary" className="pl-2">
                            <span className="w-3 h-3 rounded-full mr-2 border" style={{ backgroundColor: basicColorMap[color] || '#000000' }} />
                            {color}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {image.notes && (
                  <div className="flex items-start gap-3">
                    <Notebook className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0"/>
                     <div>
                      <h4 className="font-semibold text-muted-foreground">Notes</h4>
                      <p className="whitespace-pre-wrap">{image.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
            )}
            </div>
            {!isEditing && (
              <DialogFooter className="p-6 pt-4 bg-background border-t mt-auto">
                <div className="flex justify-end gap-2 w-full">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the image from your collection.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(image.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                  <Button variant="outline" size="sm" onClick={handleEditToggle}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </div>
              </DialogFooter>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

    
