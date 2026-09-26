"use client";

import { Link } from "react-router-dom";
import { site, telHref } from "@/content/site";

const Footer = () => {
  return (
    <footer className="py-12 bg-black border-t border-white/10">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="text-2xl font-sans font-extrabold text-primary mb-2">{site.name}</div>
            <p className="text-muted-foreground font-serif">IT Support for Creative Professionals · Melbourne</p>
          </div>
          <address className="not-italic flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm font-serif">
            <a href={`mailto:${site.email}`} className="hover:text-primary transition-colors">{site.email}</a>
            {site.phone && (
              <a href={telHref(site.phone)} className="hover:text-primary transition-colors">{site.phone}</a>
            )}
            <span className="text-muted-foreground">{site.locality}, {site.region}</span>
          </address>
        </div>
        <nav aria-label="Footer" className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <a href="/#security" className="hover:text-primary transition-colors">Security &amp; Privacy Audits</a>
          <a href="/#clean-sweep" className="hover:text-primary transition-colors">Digital Clean Sweep</a>
          <a href="/#tiers" className="hover:text-primary transition-colors">Pricing</a>
          <a href="/#faq" className="hover:text-primary transition-colors">FAQ</a>
          <a href="/#contact" className="hover:text-primary transition-colors">Contact</a>
        </nav>
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-serif">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <Link to="/login" className="text-xs text-muted-foreground/60 hover:text-primary transition-colors">
            Client portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
