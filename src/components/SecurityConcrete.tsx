"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SecurityConcrete = () => {
  return (
    <section className="section-padding bg-secondary text-white rounded-[3rem] mx-4 lg:mx-8 mb-24">
      <div className="container px-6 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8">HOW WE <br />CAN HELP</h2>
          
          <Tabs defaultValue="security" className="w-full">
            <TabsList className="bg-transparent border-b border-white/10 w-full justify-center rounded-none h-auto p-0 mb-12">
              <TabsTrigger value="security" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">
                Security Audit
              </TabsTrigger>
              <TabsTrigger value="workflow" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">
                Workflow Setup
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-8 py-4 text-xs font-bold uppercase tracking-widest text-white/40">
                Privacy Review
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="security" className="mt-0">
              <p className="text-xl lg:text-2xl font-medium leading-relaxed text-white/80 max-w-3xl mx-auto">
                Do you have <span className="text-primary">FOMO</span> because you're nervous about your data security? It takes expert planning to make the perfect transition to a secure digital life. Lucky for you, I've done it thousands of times. I have the expertise on hand to reduce your anxiety and get a great result.
              </p>
            </TabsContent>
            <TabsContent value="workflow" className="mt-0">
              <p className="text-xl lg:text-2xl font-medium leading-relaxed text-white/80 max-w-3xl mx-auto">
                Stop fighting your devices. I create unified Apple ecosystems that just work. From file organization to cloud syncing, I build the architecture that supports your daily life without the friction.
              </p>
            </TabsContent>
            <TabsContent value="privacy" className="mt-0">
              <p className="text-xl lg:text-2xl font-medium leading-relaxed text-white/80 max-w-3xl mx-auto">
                Your personal data shouldn't be public property. I perform deep privacy audits to ensure your emails, accounts, and identity are protected by professional-grade encryption and protocols.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default SecurityConcrete;