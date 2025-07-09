"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, X } from 'lucide-react';
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


const imageSchema = z.object({
  url: z.string().url({ message: "Please enter a valid image URL." }),
  title: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
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
  const [isSuggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isPreviewLarge, setIsPreviewLarge] = useState(false);
  const hasBoards = boards.length > 0;
  
  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      url: '',
      title: '',
      notes: '',
      tags: [],
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
        boardType: boards.length > 0 ? 'existing' : 'new',
        boardId: undefined,
        newBoardName: '',
      });
      setTagInput('');
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
                <div
                  className="relative mt-4 aspect-video w-full cursor-zoom-in"
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
