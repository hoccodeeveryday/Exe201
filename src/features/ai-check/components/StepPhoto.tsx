import React, { useRef } from "react";
import Button from "@/components/ui/Button";

interface StepPhotoProps {
  photo: string | null;
  setPhoto: (photo: string | null) => void;
  onBack: () => void;
  onNext: () => void;
}

const StepPhoto: React.FC<StepPhotoProps> = ({ photo, setPhoto, onBack, onNext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-extrabold text-lg text-darkbg">Tải ảnh thú cưng</h2>
        <p className="text-muted text-sm mt-1">Ảnh giúp AI phân tích chính xác hơn (tuỳ chọn).</p>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        onClick={handleCardClick}
        className="w-full min-h-[200px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer select-none bg-primary-light hover:bg-primary-mid transition-all duration-200 p-6 relative"
      >
        {photo ? (
          <div className="relative w-full max-h-60 flex justify-center">
            <img
              src={photo}
              alt="Pet preview"
              className="max-w-full max-h-60 rounded-xl object-contain shadow-md"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 w-7 h-7 bg-darkbg/70 hover:bg-darkbg text-white rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition-colors backdrop-blur-sm"
              type="button"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <span className="text-5xl mb-3 drop-shadow-sm select-none">🖼️</span>
            <div className="font-bold text-sm text-darkbg">Kéo thả hoặc click để chọn ảnh</div>
            <div className="text-xs text-muted mt-1">PNG, JPG tối đa 10MB</div>
          </>
        )}
      </div>

      <div className="flex justify-between pt-3">
        <Button variant="ghost" onClick={onBack}>← Quay lại</Button>
        <Button variant="primary" onClick={onNext} className="px-8">Tiếp tục →</Button>
      </div>
    </div>
  );
};

export default StepPhoto;
