import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { attendanceSchema } from "@/lib/validation";

const prisma = new PrismaClient();

export async function GET() {
  const registros = await prisma.attendance.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(registros);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Validación Zod (asegura que count sea number)
    const parsed = attendanceSchema.safeParse({
      ...body,
      count: Number(body.count),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.errors[0]?.message || "Datos inválidos" },
        { status: 400 }
      );
    }
    const { name, count } = parsed.data;
    const registro = await prisma.attendance.create({
      data: { name, count },
    });
    return NextResponse.json(registro, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
