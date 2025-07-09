"use client";

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2, Edit, X, Check, Tag, Notebook, LayoutGrid, AlertTriangle } from 'lucide-react';

import type { ImageItem, Board } from '@/lib/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';


const imageEditSchema = z.object({
  title: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  boardId: z.string().optional(),
});

type ImageEditFormValues = z.infer<typeof imageEditSchema>;

interface ImageDetailDialogProps {
  image: ImageItem;
  board?: Board;
  boards: Board[];
  allTags: string[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (image: ImageItem) => void;
}

export default function ImageDetailDialog({ image, board, boards, allTags, isOpen, onOpenChange, onDelete, onUpdate }: ImageDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isSuggestionsOpen, setSuggestionsOpen] = useState(false);

  const form = useForm<ImageEditFormValues>({
    resolver: zodResolver(imageEditSchema),
    defaultValues: {
      title: image.title,
      notes: image.notes,
      tags: image.tags,
      boardId: image.boardId,
    },
  });

  useEffect(() => {
    if (image) {
      form.reset({
        title: image.title,
        notes: image.notes,
        tags: image.tags,
        boardId: image.boardId,
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
        boardId: image.boardId,
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
      boardId: data.boardId
    });
    setIsEditing(false);
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

  if (!image) return null;

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
          />
        </div>
        <div className="md:w-1/3 w-full flex flex-col">
          <div className="p-6 flex-grow overflow-y-auto">
          {isEditing ? (
             <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  name="boardId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Board</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a board" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {boards.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
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
                  <LayoutGrid className="h-4 w-4 mt-1 text-muted-foreground"/>
                  <div>
                    <h4 className="font-semibold text-muted-foreground">Board</h4>
                    <p>{board?.name || 'Uncategorized'}</p>
                  </div>
                </div>
                {image.tags.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Tag className="h-4 w-4 mt-1 text-muted-foreground"/>
                     <div>
                      <h4 className="font-semibold text-muted-foreground">Tags</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {image.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                      </div>
                    </div>
                  </div>
                )}
                {image.notes && (
                  <div className="flex items-start gap-3">
                    <Notebook className="h-4 w-4 mt-1 text-muted-foreground"/>
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
              <DialogFooter className="p-6 pt-0 bg-background border-t mt-auto">
                <div className="flex justify-between w-full">
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
                        This action cannot be undone. This will permanently delete the image from your board.
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
