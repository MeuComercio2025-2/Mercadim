import admin from "@/config/firebase-admin";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Gerenciamento do usuário administrador
 */

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Verifica se já existe um administrador
 *     tags: [Admin]
 *     description: Retorna se existe algum usuário com a role "Administrador".
 *     responses:
 *       200:
 *         description: Resultado da verificação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasAdmin:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Erro interno ao listar usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to list users"
 */
export async function GET() {
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

/**
 * @swagger
 * /api/admin:
 *   post:
 *     summary: Cria o primeiro administrador
 *     tags: [Admin]
 *     description: Cria um usuário com role "Administrador" apenas se não existir outro.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@empresa.com"
 *               password:
 *                 type: string
 *                 example: "SenhaSegura123"
 *               displayName:
 *                 type: string
 *                 example: "Administrador"
 *     responses:
 *       200:
 *         description: Administrador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: string
 *                   example: "abc123xyz"
 *                 email:
 *                   type: string
 *                   example: "admin@empresa.com"
 *                 message:
 *                   type: string
 *                   example: "Administrador criado com sucesso!"
 *       400:
 *         description: Erro de validação (email/senha ausente ou admin já existente)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Administrador já existe"
 *       500:
 *         description: Erro interno ao criar o usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao criar usuário no Firebase"
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, displayName } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email e senha são obrigatórios" }),
        { status: 400 }
      );
    }

    const list = await admin.auth().listUsers();
    const hasAdmin = list.users.some(user => user.customClaims?.role === "Administrador");

    if (hasAdmin) {
      return new Response(
        JSON.stringify({ error: "Administrador já existe" }),
        { status: 400 }
      );
    }

    const user = await admin.auth().createUser({ email, password, displayName });
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
