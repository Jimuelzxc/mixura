
"use client";

import { useEffect, useState } from 'react';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const API_KEY_LOCALSTORAGE_KEY = 'mixura-api-key';

interface ApiSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (apiKey: string) => void;
}

export default function ApiSettingsDialog({ isOpen, onOpenChange, onSave }: ApiSettingsDialogProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem(API_KEY_LOCALSTORAGE_KEY) || '';
      setApiKey(storedKey);
      setShowKey(false);
    }
  }, [isOpen]);

  const handleSaveClick = () => {
    onSave(apiKey);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Enter your Google AI (Gemini) API key here. Your key is stored securely in your browser's local storage and is never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <div className="col-span-3 relative">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8 text-muted-foreground"
                onClick={() => setShowKey(prev => !prev)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSaveClick}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
