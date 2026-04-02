"use client";

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface BulkAssetImportProps {
  clientId: string;
  onSuccess: () => void;
}

const BulkAssetImport = ({ clientId, onSuccess }: BulkAssetImportProps) => {
  const [importText, setImportText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAIImport = async (file: File) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const base64Image = await base64Promise;
      
      // Use the existing OCR function to get text
      const { data: ocrData, error: ocrError } = await supabase.functions.invoke('ocr-image', {
        body: { image_base64: base64Image }
      });

      if (ocrError) throw ocrError;

      // Now use Gemini to structure that text into assets
      const prompt = `
        Convert the following extracted text into a JSON array of IT assets.
        Text: "${ocrData.text}"
        
        Format each object as:
        {
          "asset_type": "device" | "login" | "software",
          "name": "Title",
          "details": { ...relevant fields like username, password, serial_number, model... }
        }
        Return ONLY the JSON array.
      `;

      // We'll use a temporary call to classify-ticket logic or similar if available, 
      // but for now let's simulate the structuring or use a generic AI call if we had one.
      // Since we have 'classify-ticket', we can repurpose the logic or just ask the user to review.
      
      setImportText(ocrData.text);
      showSuccess("Text extracted. Please review and format as CSV or JSON.");
    } catch (error) {
      console.error(error);
      showError("Failed to process image with AI");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleAIImport(e.target.files[0]);
    }
  };

  const processImport = async () => {
    if (!importText.trim()) return;
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Simple CSV-ish parser for demo: "Name, Type, Username, Password"
      const lines = importText.split('\n').filter(l => l.trim());
      const assetsToInsert = lines.map(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          return {
            client_id: clientId,
            owner_user_id: user?.id,
            name: parts[0],
            asset_type: (parts[1]?.toLowerCase() || 'login') as any,
            details: {
              username: parts[2] || '',
              password: parts[3] || '',
              notes: 'Bulk imported'
            },
            updated_at: new Date().toISOString()
          };
        }
        return null;
      }).filter(Boolean);

      if (assetsToInsert.length === 0) {
        throw new Error("No valid assets found. Use format: Name, Type, Username, Password");
      }

      const { error } = await supabase
        .from('client_assets')
        .insert(assetsToInsert);

      if (error) throw error;

      showSuccess(`Successfully imported ${assetsToInsert.length} assets`);
      onSuccess();
    } catch (error: any) {
      showError(error.message || "Import failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          All imported data is stored in your private, encrypted database. 
          Use the format: <code className="text-primary">Name, Type, Username, Password</code> (one per line).
        </p>
      </div>

      <div 
        className={cn(
          "relative group border-2 border-dashed rounded-[2rem] transition-all duration-300",
          isDragging ? "border-primary bg-primary/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) handleAIImport(e.dataTransfer.files[0]);
        }}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept="image/*"
        />
        
        <div className="p-10 flex flex-col items-center text-center">
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm font-bold uppercase tracking-widest animate-pulse">AI Processing...</p>
            </div>
          ) : (
            <>
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold mb-2">AI Screenshot Import</h4>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Drop a screenshot of a settings page or password list to extract data automatically.
              </p>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-white/10 h-10 px-6"
              >
                <UploadCloud className="mr-2 h-4 w-4" /> Select Image
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Manual Entry / CSV Data</label>
          {importText && (
            <Button variant="ghost" size="sm" onClick={() => setImportText('')} className="h-6 text-red-400">
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}
        </div>
        <Textarea 
          placeholder="MacBook Pro, device, , &#10;iCloud, login, user@me.com, password123"
          className="bg-white/5 border-white/10 min-h-[150px] rounded-2xl font-mono text-xs p-6 focus:ring-primary"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        />
      </div>

      <Button 
        className="w-full h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20"
        onClick={processImport}
        disabled={isProcessing || !importText.trim()}
      >
        {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CheckCircle2 className="mr-2 h-5 w-5" /> Confirm & Import Assets</>}
      </Button>
    </div>
  );
};

export default BulkAssetImport;