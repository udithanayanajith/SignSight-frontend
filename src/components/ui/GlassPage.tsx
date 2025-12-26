import { motion } from "framer-motion";

export default function GlassPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] bg-gradient-to-br from-peach via-orange-100 to-pink-100 overflow-hidden">
      {/* floating glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-300/30 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
