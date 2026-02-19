"use client";

import { Button } from "@/components/ui/button";
import BookingDialog from "./BookingDialog";

const Hero = () => {
  return (
    <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 bg-white">
      <div className="container px-6 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-foreground/40 mb-8">
            Straight forward IT support.
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground mb-12 leading-[0.9] tracking-tighter">
            MAKE YOUR DIGITAL <br />
            JOURNEY <span className="text-primary">ANXIETY FREE</span>
          </h1>
          
          <div className="flex justify-center">
            <BookingDialog>
              <Button className="h-16 px-12 rounded-full bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-all duration-300 text-sm font-bold shadow-lg shadow-primary/20">
                See what we can fix
              </Button>
            </BookingDialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;