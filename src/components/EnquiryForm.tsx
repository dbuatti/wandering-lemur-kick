"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  service: z.string({ required_error: "Please select a service." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const EnquiryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-enquiry', {
        body: values,
      });

      if (error) throw error;

      showSuccess("Enquiry sent successfully! I'll be in touch soon.");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      showError("Failed to send enquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Required</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-primary">
                    <SelectValue placeholder="Select a service tier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="concierge">Tech Concierge ($100/hr)</SelectItem>
                  <SelectItem value="efficiency">Efficiency Partner ($130/hr)</SelectItem>
                  <SelectItem value="hardware">Hardware Surgery ($150/hr)</SelectItem>
                  <SelectItem value="other">Other / Custom Project</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">How can I help?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell me about your current tech challenges..." 
                  className="bg-white/5 border-white/10 min-h-[120px] rounded-xl focus:ring-primary resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-14 rounded-xl bg-primary text-white font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>Sending... <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
          ) : (
            <>Send Enquiry <Send className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EnquiryForm;