import { MadeWithDyad } from "./made-with-dyad";

const Footer = () => {
  return (
    <footer className="py-12 bg-black border-t border-white/10">
      <div className="container px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="text-2xl font-sans font-extrabold text-primary mb-2">Daniele Buatti</div>
            <p className="text-muted-foreground font-serif">Personal Technology Concierge</p>
          </div>
          <div className="flex gap-8 text-sm font-serif">
            <a href="mailto:Daniele.buatti@gmail.com" className="hover:text-primary transition-colors">Daniele.buatti@gmail.com</a>
            <span className="text-muted-foreground">Melbourne, AU</span>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-serif">
            © {new Date().getFullYear()} Daniele Buatti. All rights reserved.
          </p>
          <MadeWithDyad />
        </div>
      </div>
    </footer>
  );
};

export default Footer;