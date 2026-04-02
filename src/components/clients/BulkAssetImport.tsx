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
  X,
  BrainCircuit
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
  const [extractedAssets, setExtractedAssets] = useState<any[]>([]);
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
      
      const { data: ocrData, error: ocrError } = await supabase.functions.invoke('ocr-image', {
        body: { image_base64: base64Image }
      });

      if (ocrError) throw ocrError;
      setImportText(ocrData.text);
      handleSmartExtract(ocrData.text);
    } catch (error) {
      console.error(error);
      showError("Failed to process image with AI");
      setIsProcessing(false);
    }
  };

  const handleSmartExtract = async (textToProcess?: string) => {
    const text = textToProcess || importText;
    if (!text || text.length < 10) {
      showError("Please paste more text to analyze.");
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-assets', {
        body: { text }
      });

      if (error) throw error;

      if (data.assets && data.assets.length > 0) {
        setExtractedAssets(data.assets);
        showSuccess(`AI identified ${data.assets.length} potential assets.`);
      } else {
        showError("AI couldn't find any clear assets in that text.");
      }
    } catch (error) {
      console.error(error);
      showError("Failed to analyze text with AI");
    } finally {
      setIsProcessing(false);
    }
  };

  const processImport = async () => {
    if (extractedAssets.length === 0) return;
    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const assetsToInsert = extractedAssets.map(asset => ({
        client_id: clientId,
        owner_user_id: user?.id,
        name: asset.name,
        asset_type: asset.asset_type,
        details: asset.details,
        updated_at: new Date().toISOString()
      }));

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
          Paste an email thread or notes below. The AI will identify devices and passwords automatically.
        </p>
      </div>

      {extractedAssets.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Review Extracted Assets</h4>
            <Button variant="ghost" size="sm" onClick={() => setExtractedAssets([])} className="h-6 text-muted-foreground">
              <X className="h-3 w-3 mr-1" /> Reset
            </Button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {extractedAssets.map((asset, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-white">{asset.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{asset.asset_type}</p>
                </div>
                <div className="text-right">
                  {asset.details.password && <p className="text-[10px] font-mono text-primary">Password Found</p>}
                  {asset.details.username && <p className="text-[10px] text-muted-foreground">{asset.details.username}</p>}
                </div>
              </div>
            ))}
          </div>
          <Button 
            className="w-full h-14 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20"
            onClick={processImport}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CheckCircle2 className="mr-2 h-5 w-5" /> Confirm & Save All Assets</>}
          </Button>
        </div>
      ) : (
        <>
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
              onChange={(e) => e.target.files?.[0] && handleAIImport(e.target.files[0])}
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
                    Drop a screenshot of a settings page or password list.
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
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Paste Email Thread / Notes</label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleSmartExtract()}
                disabled={isProcessing || !importText.trim()}
                className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 hover:bg-primary/20"
              >
                {isProcessing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <BrainCircuit className="h-3 w-3 mr-2" />}
                Smart Extract
              </Button>
            </div>
            <Textarea 
              placeholder="Paste the email content here..."
              className="bg-white/5 border-white/10 min-h-[200px] rounded-2xl text-sm p-6 focus:ring-primary font-light leading-relaxed"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BulkAssetImport;