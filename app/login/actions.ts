"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function loginUser(formData: FormData) {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?error=missing");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    redirect("/login?error=invalid");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    redirect("/login?error=invalid");
  }

  await createSession({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  if (user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  if (user.role === "RECRUITER") {
    redirect("/recruiter/dashboard");
  }

  redirect("/candidate/dashboard");
}