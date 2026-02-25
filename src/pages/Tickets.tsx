import Navbar from "@/components/Navbar";
import TicketList from "@/components/Ticketing/TicketList";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const Tickets = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <div className="container px-6 py-12 mx-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Ticket Management</h1>
            <TicketList />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tickets;