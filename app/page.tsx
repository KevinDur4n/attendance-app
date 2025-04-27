"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const attendanceSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "Solo letras y espacios"),
  count: z
    .number({ invalid_type_error: "Selecciona una cantidad válida" })
    .min(1, "Debe ser al menos 1")
    .max(10, "Máximo 10 personas"),
});

const MAP_URL = "https://maps.app.goo.gl/JyUuTaohAwB2wqWr8";

export default function Home() {
  const [form, setForm] = useState({ name: "", count: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  // Botón flotante de ubicación
  const handleMap = () => {
    window.open(MAP_URL, "_blank");
  };

  // Manejo de cambios
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "count" ? Number(value) : value,
    }));
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = attendanceSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Error",
        description: parsed.error.errors[0]?.message || "Datos inválidos",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Error al registrar asistencia");
      }
      setSuccess(true);
      setForm({ name: "", count: 1 });
      toast({
        title: "¡Gracias!",
        description: "Tu asistencia ha sido registrada.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Error al registrar asistencia",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden p-4">
      {/* Fondo con degradado */}

      <div className="text-center space-y-8 mb-4 max-w-lg relative z-10">
        {/* Nombre y edad - Modificados para ser más grandes y usar Oleo Script */}
        <div className="space-y-2">
          <p className="text-4xl md:text-6xl font-oleo text-amber-400 animate-pulse">
            Fiesta Sorpresa
          </p>
        </div>
      </div>

      {/* Formulario de confirmación o mensaje de éxito */}
      <div className="w-full max-w-md mx-auto z-10">
        {!success ? (
          <>
            <form
              onSubmit={handleSubmit}
              className="bg-black/90 border-2 border-amber-500 rounded-xl p-8 flex flex-col gap-6 shadow-lg"
              autoComplete="off"
            >
              <h2 className="text-3xl font-bold text-amber-400 mb-2 text-center">
                Confirma tu asistencia
              </h2>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-lg text-white text-left">
                  Familia o nombre de invitado
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="rounded-md px-4 py-2 bg-slate-900 text-white border border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-lg"
                  placeholder="Escribe tu nombre o el de tu familia"
                  autoComplete="off"
                  required
                  pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$"
                  minLength={1}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="count" className="text-lg text-white text-left">
                  ¿Cuántas personas (incluyéndote)?
                </label>
                <select
                  id="count"
                  name="count"
                  value={form.count}
                  onChange={handleChange}
                  className="rounded-md px-4 py-2 bg-slate-900 text-white border border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-lg"
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="submit"
                className="mt-4 bg-gradient-to-r from-amber-500 to-yellow-300 hover:from-amber-600 hover:to-yellow-400 text-black border-2 border-amber-300 text-xl font-semibold py-3"
                disabled={submitting}
              >
                {submitting ? "Enviando..." : "Confirmar asistencia"}
              </Button>
            </form>
            <div className="flex justify-center mt-4">
              <Button
              onClick={handleMap}
              className=" w-full bg-gradient-to-r from-amber-500 to-yellow-300 hover:from-amber-600 hover:to-yellow-400 text-black border-2 border-amber-300 text-xl font-semibold py-3 animate-vibrate"
            >
              <MapPin className="mr-2" /> Ubicación
            </Button>
            </div>
            
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 bg-black/90 border-2 border-amber-500 rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-amber-400 mb-2 text-center">
              ¡Gracias por confirmar tu asistencia, {form.name || "invitado"}!
            </h2>
            <Button
              onClick={handleMap}
              className="bg-gradient-to-r from-amber-500 to-yellow-300 hover:from-amber-600 hover:to-yellow-400 text-black border-2 border-amber-300 text-xl font-semibold py-3 animate-vibrate"
            >
              <MapPin className="mr-2" /> Ubicación
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
