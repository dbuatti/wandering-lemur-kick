"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Scratchpad = () => {
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem('db_scratchpad');
    if (savedNote) setNote(savedNote);
  }, []);

  const handleSave = () => {
    localStorage.setItem('db_scratchpad', note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClear = () => {
    if (confirm("Clear scratchpad?")) {
      setNote('');
      localStorage.removeItem('db_scratchpad');
    }
  };

  return (
    <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden h-full flex flex-col">
      <CardHeader className="border-b border-white/5 px-8 py-6 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <StickyNote className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-bold">Digital Scratchpad</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-red-400"
            onClick={handleClear}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 transition-colors ${isSaved ? 'text-green-400' : 'text-muted-foreground hover:text-primary'}`}
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <Textarea 
          placeholder="Quick notes, reminders, or snippets..."
          className="w-full h-full min-h-[200px] bg-transparent border-none focus-visible:ring-0 p-8 text-lg font-light resize-none custom-scrollbar"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={handleSave}
        />
      </CardContent>
      <div className="px-8 py-4 border-t border-white/5 bg-white/[0.01]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {isSaved ? 'Changes saved locally' : 'Auto-saves on blur'}
        </p>
      </div>
    </Card>
  );
};

export default Scratchpad;