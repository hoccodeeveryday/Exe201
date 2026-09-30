import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-strong rounded-[2rem] p-10 md:p-16 border border-white/60 shadow-2xl text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="text-7xl mb-4"
        >
          🐾
        </motion.div>
        <div className="text-7xl md:text-8xl font-extrabold text-gradient tracking-tight">404</div>
        <h1 className="text-xl md:text-2xl font-extrabold text-darkbg mt-3">Ôi! Trang này đi lạc rồi</h1>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          Có vẻ như Bé Mít đã đi lạc vào một trang không tồn tại. Để mình đưa bạn quay về nhà nhé.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button variant="primary" className="px-8 py-3 shadow-glow">
              🏠 Về trang chủ
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;