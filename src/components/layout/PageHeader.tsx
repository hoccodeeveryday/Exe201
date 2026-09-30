import React from "react";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CURRENT_PET } from "@/data/mock/pet";

const PageHeader: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.name ?? "Khách";
  const greeting = user?.name
    ? `Chào mừng ${user.name} trở lại!`
    : "Chào mừng bạn đến với VetGen!";

  return (
    <div className="flex justify-between items-center mb-7 select-none">
      <div>
        <h1 className="font-extrabold text-2xl text-darkbg tracking-tight">{greeting}</h1>
        <p className="text-muted text-sm mt-1">
          Hôm nay là một ngày tuyệt vời để chăm sóc {CURRENT_PET.name}.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-bold text-sm text-darkbg">{displayName}</div>
          <div className="text-muted text-xs font-semibold">Thành viên Premium</div>
        </div>
        <Avatar size="md">{user?.avatar ?? displayName[0] ?? "V"}</Avatar>
      </div>
    </div>
  );
};

export default PageHeader;
