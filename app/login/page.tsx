"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Error",
        description: parsed.error.errors[0]?.message || "Datos inválidos",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const res = await signIn("credentials", {
      ...form,
      redirect: false,
    });
    if (res?.ok) {
      toast({
        title: "Bienvenido",
        description: "Acceso correcto.",
        variant: "success",
      });
      router.replace("/admin");
    } else {
      toast({
        title: "Error",
        description: res?.error || "Credenciales incorrectas",
        variant: "destructive",
      });
    }
    setSubmitting(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-black to-amber-900/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-black/90 border-2 border-amber-500 rounded-xl p-8 flex flex-col gap-6 shadow-lg w-full max-w-sm"
        autoComplete="off"
      >
        <h1 className="text-3xl font-bold text-amber-400 mb-2 text-center">
          Iniciar sesión
        </h1>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-lg text-white text-left">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="rounded-md px-4 py-2 bg-slate-900 text-white border border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-lg"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-lg text-white text-left">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="rounded-md px-4 py-2 bg-slate-900 text-white border border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-lg"
            placeholder="Tu contraseña"
            required
          />
        </div>
        <Button
          type="submit"
          className="mt-4 bg-gradient-to-r from-amber-500 to-yellow-300 hover:from-amber-600 hover:to-yellow-400 text-black border-2 border-amber-300 text-xl font-semibold py-3"
          disabled={submitting}
        >
          {submitting ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </main>
  );
}
