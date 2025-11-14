import { NextRequest, NextResponse } from "next/server";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// Inicializa Firebase Admin uma vez só
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY as string)),
    storageBucket: process.env.NEXT_PUBLIC_storageBucket, // ex: meucomercio.appspot.com
  });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    // Converte File → Buffer
    const bytes = Buffer.from(await file.arrayBuffer());

    const bucket = getStorage().bucket();
    const filename = `avatars/${Date.now()}_${file.name}`;
    const fileRef = bucket.file(filename);

    await fileRef.save(bytes, {
      contentType: file.type,
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (err: any) {
    console.error("Upload API error:", err);
    return NextResponse.json({ error: err?.message || "Erro desconhecido" }, { status: 500 });
  }
}
