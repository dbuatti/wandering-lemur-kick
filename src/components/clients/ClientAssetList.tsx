"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Shield, Search, Filter, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ClientAssetCard from "./ClientAssetCard";
import ClientAssetForm from "./ClientAssetForm";
import BulkAssetImport from "./BulkAssetImport";
import { supabase } from "@/integrations/supabase/client";

interface ClientAssetListProps {
  clientId: string;
}

const ClientAssetList = ({ clientId }: ClientAssetListProps) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_assets')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchAssets();
    }
  }, [clientId]);

  const deviceMap = useMemo(() => {
    const map: Record<string, string> = {};
    assets.forEach(a => {
      if (a.asset_type === 'device') map[a.id] = a.name;
    });
    return map;
  }, [assets]);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.asset_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || asset.asset_type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'device', label: 'Devices' },
    { id: 'login', label: 'Logins' },
    { id: 'software', label: 'Software' },
    { id: 'link', label: 'Links' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Technical Assets</h3>
            <p className="text-sm text-muted-foreground">Secure storage for devices, logins, and licenses.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-11 px-6 rounded-xl border-primary/30 bg-primary/5 text-primary font-bold">
                <Sparkles className="mr-2 h-4 w-4" /> Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-card border-white/10 text-white rounded-[2.5rem] p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold">Bulk Asset Import</DialogTitle>
                <DialogDescription>
                  Import multiple credentials or devices using text or AI image analysis.
                </DialogDescription>
              </DialogHeader>
              <BulkAssetImport clientId={clientId} onSuccess={() => {
                setIsBulkOpen(false);
                fetchAssets();
              }} />
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/10">
                <Plus className="mr-2 h-4 w-4" /> Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-white/10 text-white rounded-[2.5rem] p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold">New Technical Asset</DialogTitle>
                <DialogDescription>
                  Add a new device, login, or software license for this client.
                </DialogDescription>
              </DialogHeader>
              <ClientAssetForm clientId={clientId} onSuccess={() => {
                setIsDialogOpen(false);
                fetchAssets();
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 bg-white/5 border-white/10 h-11 rounded-xl focus:ring-primary"
          />
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${
                activeFilter === f.id ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]">
          <p className="text-muted-foreground">No technical assets found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <ClientAssetCard 
              key={asset.id} 
              asset={asset} 
              onUpdate={fetchAssets} 
              deviceName={asset.details?.related_device_id ? deviceMap[asset.details.related_device_id] : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientAssetList;