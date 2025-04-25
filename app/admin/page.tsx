import { Attendance } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const registros = await prisma.attendance.findMany({
    orderBy: { createdAt: "desc" },
  });
  const total = registros.reduce((acc, r) => acc + r.count, 0);
  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      <h1 className="text-3xl font-bold text-amber-400 mb-6 text-center">
        Registros de asistencia
      </h1>
      {/* Card de total de personas */}
      <div className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black rounded-lg shadow-lg p-6 flex flex-col items-center border-2 border-amber-500">
        <span className="text-lg font-semibold mb-1">
          Total de personas confirmadas
        </span>
        <span className="text-4xl font-bold">{total}</span>
      </div>
      {registros.length === 0 ? (
        <p className="text-white text-center">No hay registros aún.</p>
      ) : (
        <div className="space-y-4">
          {registros.map((r) => (
            <div
              key={r.id}
              className="bg-black/80 border-2 border-amber-500 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-lg"
            >
              <div>
                <p className="text-lg font-semibold text-amber-300">{r.name}</p>
                <p className="text-white text-sm">
                  {new Date(r.createdAt).toLocaleString("es-MX")}
                </p>
              </div>
              <div className="text-2xl font-bold text-amber-400 mt-2 md:mt-0">
                {r.count} {r.count === 1 ? "persona" : "personas"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
