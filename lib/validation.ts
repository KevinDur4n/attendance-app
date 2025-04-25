import { z } from "zod";

export const attendanceSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, "Solo letras y espacios"),
  count: z
    .number({ invalid_type_error: "Selecciona una cantidad válida" })
    .min(1, "Debe ser al menos 1")
    .max(15, "Máximo 15 personas"),
});
