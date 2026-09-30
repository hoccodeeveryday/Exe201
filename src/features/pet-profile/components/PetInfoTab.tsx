import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { CURRENT_PET } from "@/data/mock/pet";

const petInfoSchema = z.object({
  name: z.string().min(2, "Tên thú cưng phải từ 2 ký tự"),
  breed: z.string().min(2, "Vui lòng nhập giống loài"),
  age: z.string().min(1, "Vui lòng nhập tuổi (ví dụ: 2 tuổi 3 tháng)"),
  weight: z.string().min(1, "Vui lòng nhập cân nặng"),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
});

type PetInfoData = z.infer<typeof petInfoSchema>;

const PetInfoTab: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetInfoData>({
    resolver: zodResolver(petInfoSchema),
    defaultValues: {
      name: CURRENT_PET.name,
      breed: CURRENT_PET.breed,
      age: CURRENT_PET.age,
      weight: "8.5",
      gender: "male",
    },
  });

  const onSubmit = (_data: PetInfoData) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Lưu thông tin thú cưng thành công! 🐾", "success");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Tên thú cưng"
          error={!!errors.name}
          errorMessage={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Giống loài"
          error={!!errors.breed}
          errorMessage={errors.breed?.message}
          {...register("breed")}
        />
        <Input
          label="Tuổi"
          error={!!errors.age}
          errorMessage={errors.age?.message}
          {...register("age")}
        />
        <Input
          label="Cân nặng (kg)"
          type="number"
          step="0.1"
          error={!!errors.weight}
          errorMessage={errors.weight?.message}
          {...register("weight")}
        />
      </div>

      <div>
        <span className="block text-xs font-bold text-darkbg mb-2 uppercase tracking-wide">Giới tính</span>
        <div className="flex gap-4">
          {[
            { value: "male", label: "Đực" },
            { value: "female", label: "Cái" },
          ].map(g => (
            <label key={g.value} className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="radio"
                value={g.value}
                className="text-primary focus:ring-primary h-4 w-4 border-gray-300"
                {...register("gender")}
              />
              {g.label}
            </label>
          ))}
        </div>
        {errors.gender && (
          <p className="text-danger text-xs mt-1.5 ml-1 font-semibold">{errors.gender.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-3">
        <Button type="submit" variant="primary" loading={loading} className="px-8">
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
};

export default PetInfoTab;