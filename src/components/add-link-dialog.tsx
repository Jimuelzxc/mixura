
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, X, Sparkles, Loader2 } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Board, ImageItem } from '@/lib/types';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { suggestDetails } from '@/ai/flows/suggest-details';


const imageSchema = z.object({
  url: z.string().url({ message: "Please enter a valid image URL." }),
  title: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  colors: z.array(z.string().regex(/^#([0-9a-f]{3}){1,2}$/i, "Must be a valid hex color code")).optional(),
  boardType: z.enum(['existing', 'new']),
  boardId: z.string().optional(),
  newBoardName: z.string().optional(),
}).refine((data) => {
    if (data.boardType === 'new' && data.newBoardName) {
      return data.newBoardName.length >= 2;
    }
    return true;
}, {
    message: 'Board name must be at least 2 characters.',
    path: ['newBoardName'],
});

type ImageFormValues = z.infer<typeof imageSchema>;

interface AddLinkDialogProps {
  onAddImage: (image: Omit<ImageItem, 'id'>, newBoardName?: string) => void;
  boards: Board[];
  allTags: string[];
}

export default function AddLinkDialog({ onAddImage, boards, allTags }: AddLinkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [isSuggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isPreviewLarge, setIsPreviewLarge] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const hasBoards = boards.length > 0;
  
  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      url: '',
      title: '',
      notes: '',
      tags: [],
      colors: [],
      boardType: hasBoards ? 'existing' : 'new',
      boardId: undefined,
      newBoardName: '',
    },
  });
  
  useEffect(() => {
    if (isOpen) {
      form.reset({
        url: '',
        title: '',
        notes: '',
        tags: [],
        colors: [],
        boardType: boards.length > 0 ? 'existing' : 'new',
        boardId: undefined,
        newBoardName: '',
      });
      setTagInput('');
      setColorInput('');
      setIsGenerating(false);
    } else {
      setSuggestionsOpen(false);
    }
  }, [isOpen, boards, form]);

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
        boardId: data.boardId
    };

    const newBoardName = data.boardType === 'new' ? data.newBoardName : undefined;

    onAddImage(imagePartial, newBoardName);

    setIsOpen(false);
  };

  const handleAddTag = (tag: string, field: any) => {
    const trimmedTag = tag.trim();
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

  const handleAddColor = (color: string, field: any) => {
    const trimmedColor = color.trim().toUpperCase();
    if (trimmedColor && !field.value.includes(trimmedColor)) {
      if (/^#([0-9A-F]{3}){1,2}$/i.test(trimmedColor)) {
        form.setValue('colors', [...field.value, trimmedColor]);
        setColorInput('');
      } else {
        toast({
          title: 'Invalid Color',
          description: 'Please enter a valid hex color code (e.g., #RRGGBB).',
          variant: 'destructive',
        });
      }
    }
  };

  const handleColorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (e.key === 'Enter' && colorInput.trim()) {
      e.preventDefault();
      handleAddColor(colorInput, field);
    }
  };

  const removeColor = (colorToRemove: string, field: any) => {
    const newColors = field.value.filter((color: string) => color !== colorToRemove);
    form.setValue('colors', newColors);
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
          boards,
        });

        if (suggestions.title) form.setValue('title', suggestions.title);
        if (suggestions.notes) form.setValue('notes', suggestions.notes);
        if (suggestions.tags) form.setValue('tags', suggestions.tags);
        if (suggestions.colors) form.setValue('colors', suggestions.colors.map(c => c.toUpperCase()));

        if (suggestions.suggestedBoardId) {
          form.setValue('boardType', 'existing');
          form.setValue('boardId', suggestions.suggestedBoardId);
          form.setValue('newBoardName', '');
        } else if (suggestions.suggestedNewBoardName) {
          form.setValue('boardType', 'new');
          form.setValue('newBoardName', suggestions.suggestedNewBoardName);
          form.setValue('boardId', undefined);
        }

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
  const boardType = form.watch('boardType');

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) setIsPreviewLarge(false);
      }}>
        <DialogTrigger asChild>
          <Button variant="default">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Image
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a new image</DialogTitle>
            <DialogDescription>
              Paste an image URL and add details to save it to a board.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAiFill}
                    disabled={!isUrlValid || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-5 w-5" />
                    )}
                    Auto-fill with AI
                  </Button>
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
                name="boardType"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Board</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value === 'new') {
                            form.setValue('boardId', undefined);
                            form.clearErrors('boardId');
                          } else {
                            form.setValue('newBoardName', '');
                            form.clearErrors('newBoardName');
                          }
                        }}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="existing" disabled={!hasBoards} />
                          </FormControl>
                          <FormLabel className="font-normal">Existing</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="new" />
                          </FormControl>
                          <FormLabel className="font-normal">Create New</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {boardType === 'existing' && hasBoards && (
                <FormField
                  control={form.control}
                  name="boardId"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a board" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {boards.map(board => (
                            <SelectItem key={board.id} value={board.id}>{board.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {boardType === 'new' && (
                 <FormField
                  control={form.control}
                  name="newBoardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="New board name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colors</FormLabel>
                    <div className="flex flex-wrap gap-2 items-center rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((color: string) => (
                          <Badge key={color} variant="secondary" className="pl-2">
                            <span className="w-3 h-3 rounded-full mr-2 border" style={{ backgroundColor: color }} />
                            {color}
                            <button
                              type="button"
                              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              onClick={() => removeColor(color, field)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-[160px]">
                          <Input
                              placeholder="Add #RRGGBB..."
                              value={colorInput}
                              onChange={(e) => setColorInput(e.target.value)}
                              onKeyDown={(e) => handleColorKeyDown(e, field)}
                              className="h-auto flex-1 bg-transparent p-0 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                          <input
                              type="color"
                              value={colorInput || '#000000'}
                              className="p-0 border-none rounded-sm cursor-pointer w-6 h-6 appearance-none bg-transparent"
                              onChange={(e) => setColorInput(e.target.value.toUpperCase())}
                              title="Pick a color"
                              aria-label="Color picker"
                          />
                      </div>
                    </div>
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
              <DialogFooter>
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
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
