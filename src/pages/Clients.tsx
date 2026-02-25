import Navbar from "@/components/Navbar";
import ClientList from "@/components/clients/ClientList";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ClientForm from "@/components/clients/ClientForm";
import { useState } from "react";
import { showSuccess } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

const Clients = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleClientCreated = () => {
    showSuccess("Client added successfully!");
    setIsCreateDialogOpen(false);
  };

  const handleCreateTicket = (clientId?: string) => {
    // Navigate to tickets page with a pre-selected client
    // For now, just navigate to tickets page
    navigate('/tickets');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">Client Directory</h1>
                <p className="text-xl text-muted-foreground font-light">
                  Manage your clients and companies in one central location.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-12 bg-primary text-white hover:bg-primary/90 rounded-xl px-8 font-bold">
                      <Plus className="h-5 w-5 mr-2" />
                      Add New Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] bg-card border-white/10 text-white rounded-[2.5rem] p-8">
                    <DialogHeader className="mb-6">
                      <DialogTitle className="text-2xl font-bold">Add New Client</DialogTitle>
                    </DialogHeader>
                    <ClientForm onClientCreated={handleClientCreated} />
                  </DialogContent>
                </Dialog>

                <Button 
                  onClick={() => handleCreateTicket()}
                  variant="outline"
                  className="h-12 rounded-xl border-white/10 hover:bg-white/5 px-6 font-bold"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  New Ticket
                </Button>
              </div>
            </div>
            <ClientList />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Clients;