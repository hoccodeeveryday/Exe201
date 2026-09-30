import { describe, it, expect } from "vitest";
import { z } from "zod";

// Mirror schema AuthModal dùng - export để test
const loginSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
});

const registerSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
  name: z.string().min(2, "Vui lòng nhập tên của bạn"),
  petName: z.string().min(2, "Vui lòng nhập tên thú cưng"),
  petType: z.string().min(1, "Vui lòng chọn loại thú cưng"),
});

const petInfoSchema = z.object({
  name: z.string().min(2, "Tên thú cưng phải từ 2 ký tự"),
  breed: z.string().min(2, "Vui lòng nhập giống loài"),
  age: z.string().min(1, "Vui lòng nhập tuổi"),
  weight: z.string().min(1, "Vui lòng nhập cân nặng"),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
});

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const r = loginSchema.safeParse({ email: "a@b.com", password: "123456" });
    expect(r.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const r = loginSchema.safeParse({ email: "not-an-email", password: "123456" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0].message).toContain("Email");
    }
  });

  it("rejects short password", () => {
    const r = loginSchema.safeParse({ email: "a@b.com", password: "123" });
    expect(r.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts full valid registration", () => {
    const r = registerSchema.safeParse({
      email: "user@vetgen.vn",
      password: "123456",
      name: "Yến Nhi",
      petName: "Bé Mít",
      petType: "dog",
    });
    expect(r.success).toBe(true);
  });

  it("rejects missing pet type", () => {
    const r = registerSchema.safeParse({
      email: "user@vetgen.vn",
      password: "123456",
      name: "Yến Nhi",
      petName: "Bé Mít",
      petType: "",
    });
    expect(r.success).toBe(false);
  });
});

describe("petInfoSchema", () => {
  it("accepts valid pet info", () => {
    const r = petInfoSchema.safeParse({
      name: "Bé Mít",
      breed: "Corgi",
      age: "2 tuổi",
      weight: "8.5",
      gender: "male",
    });
    expect(r.success).toBe(true);
  });

  it("rejects empty name", () => {
    const r = petInfoSchema.safeParse({
      name: "",
      breed: "Corgi",
      age: "2 tuổi",
      weight: "8.5",
      gender: "male",
    });
    expect(r.success).toBe(false);
  });
});