import { Check } from "lucide-react";

// Drawn from the kinds of jobs clients actually book
const jobs = [
  "New Mac, iPhone or iPad set up and everything moved across",
  "Apple ID and iCloud untangled, including separating family accounts",
  "Lost or duplicated contacts, photos and files recovered and cleaned up",
  "Dropbox, Google Drive and iCloud sorted so files are in one place",
  "Scam, phishing and harassing messages investigated and accounts secured",
  "Password manager and two-factor authentication set up",
  "Squarespace websites and member-only areas set up",
  "Printers, Wi-Fi and home office equipment that just works",
  "Old computers retired safely with data wiped and migrated",
];

const CommonJobs = () => (
  <section className="section-padding bg-background" aria-labelledby="jobs-heading">
    <div className="container px-6 mx-auto">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-6">Common Jobs</div>
          <h2 id="jobs-heading" className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            What people <span className="text-primary">call me for.</span>
          </h2>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            No job is too small. If it's on a screen and it's getting in the way of your work, I can probably fix it.
          </p>
        </div>
        <ul className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <li key={job} className="flex gap-3 items-start p-5 rounded-2xl bg-white/5 border border-white/5">
              <Check className="h-4 w-4 text-primary flex-shrink-0 mt-1" aria-hidden="true" />
              <span className="text-sm text-white/90 leading-relaxed">{job}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default CommonJobs;
