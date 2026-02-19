"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";

const InteractiveVisual = () => {
  const [value, setValue] = useState([75]);

  return (
    <section className="pb-24 bg-white">
      <div className="container px-6 mx-auto">
        <div className="max-w-5xl mx-auto bg-white rounded-[3rem] p-8 lg:p-16 card-shadow relative overflow-hidden">
          <div className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest text-foreground/30 flex items-center gap-2">
            Digital Health Score <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>

          <div className="flex flex-col items-center text-center mb-12">
            <div className="w-full max-w-md aspect-square bg-muted rounded-3xl mb-12 flex items-center justify-center relative group">
              {/* Placeholder for 3D Illustration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl"></div>
              <div className="relative z-10 text-6xl">🏠</div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/5 rounded-full blur-xl"></div>
            </div>

            <div className="text-6xl lg:text-8xl font-black tracking-tighter mb-4">
              {value[0]}% <span className="text-primary">SECURE</span>
            </div>
            <p className="text-muted-foreground font-medium max-w-md">
              Your current digital setup is {value[0]}% optimized. Let's get it to 100%.
            </p>
          </div>

          <div className="max-w-2xl mx-auto px-8">
            <Slider 
              defaultValue={[75]} 
              max={100} 
              step={1} 
              onValueChange={setValue}
              className="py-8"
            />
            <div className="mt-8 text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed max-w-lg mx-auto">
              This score is based on your current password health, backup frequency, and subscription overhead. 
              A professional audit can identify hidden risks and savings.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveVisual;