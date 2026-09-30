import React from "react";

/**
 * Fallback component cho React.lazy / Suspense.
 * Hiển thị skeleton nhẹ khi page chưa tải xong code-split chunk.
 */
const PageFallback: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh">
      <div className="glass rounded-2xl p-8 flex flex-col items-center gap-3 shadow-md">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="text-sm font-semibold text-muted">Đang tải...</div>
      </div>
    </div>
  );
};

export default PageFallback;