import { motion } from 'framer-motion';
import { profile } from '../data';

export default function Header() {
  return (
    <div className="flex flex-col items-center text-center space-y-6 mb-8">
      <div className="relative group">
        {/* Animated Ring */}
        <motion.div
          className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-75 blur-sm"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Profile Image */}
        <div className="relative rounded-full p-1 bg-background">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-32 h-32 rounded-full object-cover border-2 border-zinc-800"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary animate-gradient-x">
            {profile.name}
          </span>
        </h1>
        
        <p className="text-zinc-400 font-medium">
          {profile.role}
        </p>
        
        <motion.p 
          className="text-zinc-500 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {profile.bio}
        </motion.p>
      </div>
    </div>
  );
}
