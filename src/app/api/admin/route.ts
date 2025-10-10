import admin from "@/config/firebase-admin";


export async function GET() {
  // Verifica se já existe algum usuário com role 'admin'
  try {
    const list = await admin.auth().listUsers();
    const hasAdmin = list.users.some(user => user.customClaims?.role === "Administrador");
    
    return new Response(
      JSON.stringify({ hasAdmin }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Lê dados do corpo da requisição
    const body = await req.json();
    const { email, password, displayName } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email e senha são obrigatórios" }),
        { status: 400 }
      );
    }

    // Lista todos os usuários e verifica se já existe admin
    const list = await admin.auth().listUsers();
    const hasAdmin = list.users.some(user => user.customClaims?.role === "Administrador");

    if (hasAdmin) {
      return new Response(
        JSON.stringify({ error: "Administrador já existe" }),
        { status: 400 }
      );
    }

    // Cria o usuário no Firebase
    const user = await admin.auth().createUser({
      email,
      password,
      displayName,
      
    });

    // Define a role admin via custom claims
    await admin.auth().setCustomUserClaims(user.uid, { role: "Administrador" });

    return new Response(
      JSON.stringify({ uid: user.uid, email: user.email, message: "Administrador criado com sucesso!" }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}