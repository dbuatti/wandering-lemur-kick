import Navbar from "@/components/Navbar";
import ClientList from "@/components/clients/ClientList";
import Footer from "@/components/Footer";

const Clients = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="w-full px-6 md:px-12">
          <div className="w-full">
            <div className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Client Directory</h1>
              <p className="text-xl text-muted-foreground font-light">
                Manage your clients and companies in one central location.
              </p>
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