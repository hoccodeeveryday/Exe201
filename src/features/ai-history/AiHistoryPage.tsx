import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import AiHistoryList from "@/features/ai-check/components/AiHistoryList";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getUserFirstPet } from "@/data/mock/pet";

const AiHistoryPage: React.FC = () => {
  const { user } = useAuth();
  // record.petId lưu theo pet name ("Mít"), không phải user name ("Yến Nhi").
  // Vì vậy cần lookup pet name của user hiện tại để filter.
  const myPetName = getUserFirstPet(user)?.name ?? "Bé Mít";
  return (
    <div className="space-y-6">
      <PageHeader />
      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-sm">
        <AiHistoryList fullPage scopeToUserPet={myPetName} />
      </Card>
    </div>
  );
};

export default AiHistoryPage;