"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Laptop, 
  Key, 
  AppWindow, 
  FileText, 
  MoreVertical, 
  Trash2, 
  Edit2,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Plus,
  Smartphone
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ClientAssetForm from "./ClientAssetForm";
import { cn } from "@/lib/utils";

interface ClientAssetCardProps {
  asset: any;
  onUpdate: () => void;
  deviceName?: string;
}

const ClientAssetCard = ({ asset, onUpdate, deviceName }: ClientAssetCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const getIcon = () => {
    switch (asset.asset_type) {
      case 'device': return <Laptop className="h-5 w-5" />;
      case 'login': return <Key className="h-5 w-5" />;
      case 'software': return <AppWindow className="h-5 w-5" />;
      case 'link': return <LinkIcon className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    
    try {
      const { error } = await supabase
        .from('client_assets')
        .delete()
        .eq('id', asset.id);

      if (error) throw error;
      showSuccess("Asset deleted");
      onUpdate();
    } catch (error) {
      console.error(error);
      showError("Failed to delete asset");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showSuccess(`${label} copied to clipboard`);
  };

  return (
    <Card className={cn(
      "bg-white/5 border-white/10 hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col",
      asset.asset_type === 'device' && "border-primary/10 bg-primary/[0.02]"
    )}>
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center",
            asset.asset_type === 'device' ? "bg-primary/20 text-primary" : "bg-white/10 text-white/70"
          )}>
            {getIcon()}
          </div>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {isMenuOpen && (
              <div className="absolute right-0 top-10 z-20 w-32 rounded-xl border border-white/10 bg-card p-1 shadow-2xl">
                <button
                  className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => {
                    setIsEditDialogOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <Edit2 className="h-3 w-3 mr-2" /> Edit
                </button>
                <button
                  className="flex items-center w-full text-left px-3 py-2 text-xs hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3 mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <h4 className="font-bold text-white mb-1 truncate">{asset.name}</h4>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="bg-white/5 text-[9px] uppercase tracking-widest text-muted-foreground">
            {asset.asset_type}
          </Badge>
          {deviceName && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[9px] uppercase tracking-widest flex items-center gap-1">
              <Smartphone className="h-2 w-2" /> {deviceName}
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {asset.asset_type === 'device' && (
            <>
              {asset.details.model && (
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Model</span>
                  <span className="text-white font-medium">{asset.details.model}</span>
                </div>
              )}
              {asset.details.serial_number && (
                <div className="text-xs text-muted-foreground flex justify-between items-center group/item">
                  <span>Serial</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono">{asset.details.serial_number}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(asset.details.serial_number, "Serial number")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {asset.asset_type === 'login' && (
            <>
              {asset.details.username && (
                <div className="text-xs text-muted-foreground flex justify-between items-center group/item">
                  <span>User</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white truncate max-w-[120px]">{asset.details.username}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(asset.details.username, "Username")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
              {asset.details.password && (
                <div className="text-xs text-muted-foreground flex justify-between items-center group/item">
                  <span>Password</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono">••••••••</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(asset.details.password, "Password")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {asset.details.notes && (
            <div className="pt-2 border-t border-white/5">
              <p className="text-[10px] text-muted-foreground italic line-clamp-2">
                {asset.details.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {asset.asset_type === 'device' && (
        <div className="p-4 pt-0">
          <Button 
            variant="outline" 
            className="w-full h-9 rounded-xl border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all"
            onClick={() => setIsQuickAddOpen(true)}
          >
            <Plus className="h-3 w-3 mr-2" /> Add Password
          </Button>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-white/10 text-white rounded-[2.5rem] p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold">Edit Asset</DialogTitle>
          </DialogHeader>
          <ClientAssetForm 
            clientId={asset.client_id} 
            initialData={asset}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              onUpdate();
            }} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-white/10 text-white rounded-[2.5rem] p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold">Add Password for {asset.name}</DialogTitle>
          </DialogHeader>
          <ClientAssetForm 
            clientId={asset.client_id} 
            defaultType="login"
            defaultDeviceId={asset.id}
            onSuccess={() => {
              setIsQuickAddOpen(false);
              onUpdate();
            }} 
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ClientAssetCard;