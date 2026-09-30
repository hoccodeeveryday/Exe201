import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AppointmentList from "@/features/appointment/components/AppointmentList";

const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <PageHeader />
      <Card className="max-w-3xl mx-auto p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="font-extrabold text-xl text-darkbg">📋 Hồ sơ lịch hẹn của tôi</h1>
            <p className="text-muted text-sm mt-1">
              Tất cả lịch hẹn khám đã đặt. Bạn có thể xem chi tiết, huỷ hoặc đặt lịch mới.
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate("/dashboard/appt")}>
            + Đặt lịch mới
          </Button>
        </div>
        <AppointmentList fullPage />
      </Card>
    </div>
  );
};

export default AppointmentsPage;