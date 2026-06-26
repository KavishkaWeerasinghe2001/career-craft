"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function registerUser(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const role = String(formData.get("role") || "CANDIDATE");
  const password = String(formData.get("password") || "");

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  if (role !== "CANDIDATE" && role !== "RECRUITER") {
    throw new Error("Invalid role selected.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      profile:
        role === "CANDIDATE"
          ? {
              create: {
                bio: "",
                location: "",
                phone: "",
                cvUrl: "",
              },
            }
          : undefined,
    },
  });

  await createSession({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  if (user.role === "RECRUITER") {
    redirect("/recruiter/dashboard");
  }

  redirect("/candidate/dashboard");
}