import { WindowFrame } from "../WindowFrame";
import { profile, socialLinks, devStats } from "@/data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProfileWindowProps {
  initialPosition?: { x: number; y: number };
  dragConstraints?: React.RefObject<Element>;
  isActive: boolean;
  onInteract: () => void;
  className?: string;
  drag?: boolean;
}

export const ProfileWindow = (props: ProfileWindowProps) => {
  return (
    <WindowFrame
      title="C:\USER\PROFILE.EXE"
      {...props}
      className={cn(
        "w-[90vw] max-w-[400px] h-[80vh] max-h-[600px]",
        props.className,
      )}
    >
      <div className="flex flex-col h-full bg-zinc-950 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-6 border-b-2 border-dashed border-zinc-800 pb-6">
          <div className="w-24 h-24 mb-4 relative">
            <div className="absolute inset-0 border-2 border-zinc-600 rotate-3"></div>
            <div className="absolute inset-0 border-2 border-zinc-100 -rotate-3 bg-zinc-800 overflow-hidden">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>
          </div>
          <h1 className="text-lg font-pixel text-center text-zinc-100 mb-2 uppercase tracking-tighter leading-tight">
            {profile.name}
          </h1>
          <p className="text-sm font-mono text-zinc-400 text-center border px-2 py-0.5 border-zinc-700">
            {profile.role}
          </p>
          <p className="mt-2 text-xs text-zinc-500 text-center max-w-[80%]">
            {profile.bio}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-2 mb-6">
          {devStats.map((stat, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 p-2">
              <div className="text-sm uppercase text-zinc-500 mb-1">
                {stat.title}
              </div>
              <div className="text-sm text-zinc-300 font-mono">
                {stat.content}
              </div>
            </div>
          ))}
        </div>

        {/* Links Section */}
        <div className="flex flex-col gap-3 pb-4">
          {socialLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center p-2 border border-zinc-700 hover:bg-zinc-100 hover:text-black hover:border-zinc-100 transition-colors cursor-pointer"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 flex items-center justify-center border-r border-zinc-700 group-hover:border-black mr-3">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bold text-sm uppercase tracking-wide truncate">
                      {link.label}
                    </span>
                    <span className="text-sm opacity-60 group-hover:opacity-100 shrink-0">
                      {link.platform}
                    </span>
                  </div>
                  {(link.subtext || link.stack) && (
                    <div className="text-sm opacity-60 group-hover:opacity-80 font-mono mt-0.5 truncate">
                      {link.subtext} {link.stack ? `| ${link.stack}` : ""}
                    </div>
                  )}
                </div>
              </motion.a>
            );
          })}
        </div>

        <div className="mt-auto text-center pt-4 text-xs text-zinc-600 uppercase">
          Ready for input... <span className="animate-pulse">_</span>
        </div>
      </div>
    </WindowFrame>
  );
};
