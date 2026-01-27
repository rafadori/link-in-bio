import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Background3D from './components/Background3D';
import Header from './components/Header';
import DevStats from './components/DevStats';
import LinkCard from './components/LinkCard';
import { socialLinks } from './data';

function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-foreground selection:bg-primary/30">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <Background3D />
      </Suspense>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-16 sm:py-24">
        
        {/* Header Section */}
        <Header />

        {/* Dev Stats Section */}
        <DevStats />

        {/* Links Section */}
        <motion.div 
          className="grid gap-4 w-full max-w-lg mx-auto"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {socialLinks.map((link) => (
            <motion.div
              key={link.platform}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <LinkCard {...link} />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} Rafael Nascimento. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
