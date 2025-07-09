"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

const imageSchema = z.object({
  url: z.string().url({ message: "Please enter a valid image URL." }),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  boardType: z.enum(['existing', 'new']),
  boardId: z.string().optional(),
  newBoardName: z.string().optional(),
}).refine((data) => {
    if (data.boardType === 'existing') return !!data.boardId;
    return true;
}, {
    message: 'Please select a board.',
    path: ['boardId'],
}).refine((data) => {
    if (data.boardType === 'new') return data.newBoardName && data.newBoardName.length >= 2;
    return true;
}, {
    message: 'Board name must be at least 2 characters.',
    path: ['newBoardName'],
});

type ImageFormValues = z.infer<typeof imageSchema>;

interface AddLinkDialogProps {
  onAddImage: (image: Omit<ImageItem, 'id'>, newBoardName?: string) => void;
  boards: Board[];
}

export default function AddLinkDialog({ onAddImage, boards }: AddLinkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
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
    }
  }, [isOpen, boards, form]);


  const onSubmit = (data: ImageFormValues) => {
    const imagePartial = {
        url: data.url,
        title: data.title,
        notes: data.notes || '',
        tags: data.tags || [],
        boardId: data.boardId || ''
    };

    const newBoardName = data.boardType === 'new' ? data.newBoardName : undefined;

    onAddImage(imagePartial, newBoardName);

    setIsOpen(false);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!field.value.includes(newTag)) {
        form.setValue('tags', [...field.value, newTag]);
      }
      setTagInput('');
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <div className="relative mt-4 aspect-video w-full">
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
                  <FormControl>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2 min-h-[24px]">
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
                      </div>
                      <Input
                        placeholder="Add a tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => handleTagKeyDown(e, field)}
                      />
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
  );
}
