import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import StepBar from "@/components/ui/StepBar";
import StepSymptoms from "./components/StepSymptoms";
import StepPhoto from "./components/StepPhoto";
import StepAnalyzing from "./components/StepAnalyzing";
import StepResult from "./components/StepResult";
import AiHistoryList from "./components/AiHistoryList";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getUserFirstPet } from "@/data/mock/pet";

const AiCheckPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [petId, setPetId] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const { user } = useAuth();
  const myPetName = getUserFirstPet(user)?.name ?? "Bé Mít";

  const steps = ["Triệu chứng", "Ảnh thú cưng", "AI phân tích", "Kết quả"];

  // Prefill từ nút "🔄 Kiểm tra lại với cùng triệu chứng" trong lịch sử.
  // URL: ?recheck=1&pet=...&symptoms=...&tags=...&duration=...
  const prefillAppliedRef = React.useRef(false);
  useEffect(() => {
    if (prefillAppliedRef.current) return;
    if (searchParams.get("recheck") !== "1") {
      prefillAppliedRef.current = true;
      return;
    }
    const pet = searchParams.get("pet");
    const s = searchParams.get("symptoms") ?? "";
    const tagsStr = searchParams.get("tags") ?? "";
    const dur = searchParams.get("duration") ?? "";
    if (pet) setPetId(pet);
    if (s) setSymptoms(s);
    if (tagsStr) setSelectedTags(tagsStr.split(",").filter(Boolean));
    if (dur) setDuration(dur);
    prefillAppliedRef.current = true;
  }, [searchParams]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  const handleReset = () => {
    setStep(1);
    setPetId(null);
    setSymptoms("");
    setSelectedTags([]);
    setDuration("");
    setPhoto(null);
    // Xoá query params để tránh prefill lại không mong muốn
    prefillAppliedRef.current = false;
  };

  const finalSymptoms = symptoms || selectedTags.join(", ");

  return (
    <div className="space-y-6">
      <PageHeader />
      <Card className="max-w-2xl mx-auto p-6 md:p-8 shadow-sm">
        <StepBar steps={steps} currentStep={step} />

        {step === 1 && (
          <StepSymptoms
            symptoms={symptoms}
            setSymptoms={setSymptoms}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            petId={petId}
            setPetId={setPetId}
            duration={duration}
            setDuration={setDuration}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <StepPhoto
            photo={photo}
            setPhoto={setPhoto}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
        {step === 3 && <StepAnalyzing onComplete={handleNext} />}
        {step === 4 && (
          <StepResult
            petId={petId}
            symptoms={finalSymptoms}
            selectedTags={selectedTags}
            duration={duration}
            photo={photo}
            onReset={handleReset}
          />
        )}
      </Card>

      {/* Mini history — luôn hiển thị dưới form để user thấy các kết quả đã lưu */}
      <Card className="max-w-2xl mx-auto p-6 md:p-8 shadow-sm">
        <AiHistoryList scopeToUserPet={myPetName} limit={3} />
      </Card>
    </div>
  );
};

export default AiCheckPage;