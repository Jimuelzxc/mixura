
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, X, Sparkles, Loader2, ImagePlus, Palette } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
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
import type { ImageItem } from '@/lib/types';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { suggestDetails } from '@/ai/flows/suggest-details';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn, basicColorMap } from '@/lib/utils';


const imageSchema = z.object({
  url: z.string().url({ message: "Please enter a valid image URL." }),
  title: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
});

type ImageFormValues = z.infer<typeof imageSchema>;

interface AddLinkDialogProps {
  onAddImage: (image: Omit<ImageItem, 'id'>) => void;
  allTags: string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
  initialUrl?: string;
}

export default function AddLinkDialog({ onAddImage, allTags, isOpen, onOpenChange, children, initialUrl }: AddLinkDialogProps) {
  const [tagInput, setTagInput] = useState('');
  const [isSuggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isPreviewLarge, setIsPreviewLarge] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      url: initialUrl || '',
      title: '',
      notes: '',
      tags: [],
      colors: [],
    },
  });
  
  useEffect(() => {
    if (isOpen) {
      form.reset({
        url: initialUrl || '',
        title: '',
        notes: '',
        tags: [],
        colors: [],
      });
      setTagInput('');
      setIsGenerating(false);
    } else {
      setSuggestionsOpen(false);
    }
  }, [isOpen, form, initialUrl]);

  const suggestedTags = useMemo(() => {
    if (!tagInput) return [];
    const currentTags = form.getValues('tags') || [];
    return allTags
        .filter(
            (tag) =>
                tag.toLowerCase().includes(tagInput.toLowerCase()) &&
                !currentTags.includes(tag)
        )
        .slice(0, 5); // Limit suggestions
  }, [tagInput, allTags, form]);

  const onSubmit = (data: ImageFormValues) => {
    const imagePartial: Omit<ImageItem, 'id'> = {
        url: data.url,
        title: data.title || '',
        notes: data.notes || '',
        tags: data.tags || [],
        colors: data.colors || [],
    };

    onAddImage(imagePartial);

    onOpenChange(false);
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
      handleAddTag(tagInput, field)
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
      const url = form.getValues('url');
      if (!url) return;

      setIsGenerating(true);
      try {
        const proxyResponse = await fetch('/api/proxy-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: url }),
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

  const imageUrl = form.watch('url');
  const isUrlValid = z.string().url().safeParse(imageUrl).success;
  const isGif = isUrlValid && imageUrl.toLowerCase().endsWith('.gif');
  const selectedColors = form.watch('colors') || [];

  const aiButton = (
    <Button
        type="button"
        variant="outline"
        onClick={handleAiFill}
        disabled={!isUrlValid || isGenerating || isGif}
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
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) setIsPreviewLarge(false);
      }}>
        {children && <DialogTrigger asChild>{children}</DialogTrigger>}
        <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-4 flex-shrink-0">
            <DialogTitle>Add a new image</DialogTitle>
            <DialogDescription>
              Paste an image URL and add details to save it to your collection.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow overflow-hidden flex flex-col">
              <div className="flex-grow overflow-y-auto px-6 pb-6 space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isUrlValid && (
                  <div className="space-y-3">
                    <div
                      className="relative mt-1 aspect-video w-full cursor-zoom-in"
                      onClick={() => setIsPreviewLarge(true)}
                      role="button"
                      aria-label="Enlarge image preview"
                    >
                      <Image
                        src={imageUrl}
                        alt="Image preview"
                        fill
                        className="rounded-md object-cover"
                        data-ai-hint="image preview"
                        unoptimized={isGif}
                      />
                    </div>
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
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Abstract Architecture" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Textarea placeholder="Add any notes about this image..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="p-6 pt-4 border-t flex-shrink-0">
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Image</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {isUrlValid && (
        <Dialog open={isPreviewLarge} onOpenChange={setIsPreviewLarge}>
          <DialogContent className="max-w-4xl h-auto p-0 bg-transparent border-0 shadow-none">
            <DialogHeader>
                <DialogTitle className="sr-only">Large image preview</DialogTitle>
                <DialogDescription className="sr-only">A larger view of the selected image.</DialogDescription>
            </DialogHeader>
            <Image
              src={imageUrl}
              alt="Large image preview"
              width={1200}
              height={1200}
              className="object-contain w-full h-full max-h-[90vh] rounded-lg"
              unoptimized={isGif}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

    
