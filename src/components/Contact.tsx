// Premium Contact.tsx
// NOTE: This is a starter replacement generated for your project.
// Install: npm i react-icons
// Place SVG logos in public/logos if you prefer image assets.

import { motion } from "framer-motion";
import { usePortfolio } from "@/lib/portfolioStore";
import { SectionLabel } from "./About";
import { FaLinkedin, FaGithub, FaDiscord, FaInstagram, FaMicrosoft } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { ArrowUpRight } from "lucide-react";

const cards = [
  {name:"LinkedIn", icon:FaLinkedin, href:"https://www.linkedin.com/in/mohammadameenuddin", subtitle:"Connect"},
  {name:"GitHub", icon:FaGithub, href:"https://github.com/maameen862", subtitle:"Projects"},
  {name:"Teams", icon:FaMicrosoft, href:"https://teams.microsoft.com/l/chat/0/0?users=maameen862@gmail.com", subtitle:"Chat"},
  {name:"Discord", icon:FaDiscord, href:"https://discord.com", subtitle:"Message"},
  {name:"Instagram", icon:FaInstagram, href:"https://www.instagram.com/ma_ameen_862/", subtitle:"Follow"},
];

export const Contact = () => {
  const { contact, hero } = usePortfolio();

  return (
    <section id="contact" className="py-24 border-t border-hairline">
      <div className="container">
        <SectionLabel index="06" label="Let's Connect" />

        <motion.h2
          initial={{opacity:0,y:20}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          className="mt-8 text-6xl font-display"
        >
          Have data that needs <span className="italic text-primary">a story?</span>
        </motion.h2>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          {hero.availability}. I'm always open to discussing analytics,
          dashboards, SQL and Power BI opportunities.
        </p>

        <div className="mt-12 rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl p-8">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="text-primary uppercase tracking-[0.3em] text-xs">Email</div>
              <h3 className="mt-2 text-3xl font-display break-all">{contact.email}</h3>
            </div>

            <a
              href={`mailto:${contact.email}`}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition flex items-center gap-2"
            >
              <MdEmail size={22}/>
              Send Email
              <ArrowUpRight size={18}/>
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-5 mt-10">
          {cards.map((c)=>(
            <a
              key={c.name}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-white/10 bg-card/50 p-6 hover:border-primary hover:-translate-y-2 transition-all"
            >
              <c.icon className="text-5xl mb-5"/>
              <h4 className="text-xl font-semibold">{c.name}</h4>
              <p className="text-sm text-muted-foreground">{c.subtitle}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
