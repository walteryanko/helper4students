// Este arquivo deve estar em: /api/gerar-plano.js
// O Vercel o transformará automaticamente em um endpoint de backend.

// Prompt do sistema (agora vive no backend, seguro)
const systemPromptPlano = `
    Você é um especialista em educação e coach de estudos chamado Helper4students.
    Sua tarefa é criar um plano de estudos personalizado para um estudante.
    
    O estudante fornecerá:
    1. Matérias
    2. Tempo disponível
    3. Meta principal

    Seu plano deve ser:
    1.  **Realista**: Distribuível no tempo fornecido.
    2.  **Acionável**: Dividido em tarefas claras (dias, semanas, tópicos).
    3.  **Priorizado**: Focar nas matérias de forma lógica.
    4.  **Motivador**: Incluir dicas curtas.
    
    Formate a saída de forma clara, usando títulos (ex: **Semana 1:**) e listas.
    Inclua uma breve seção de "Dicas Personalizadas" no final.
    NÃO use markdown, apenas texto simples com quebras de linha e asteriscos para ênfase (ex: *Dica*).
`;

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Método não permitido' });
    }

    try {
        // 1. Obter a chave da API do ambiente do Vercel (NÃO A COLOQUE AQUI)
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Chave da API não encontrada");
        }
        
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        // 2. Obter os dados do frontend
        const { materias, tempo, metas } = request.body;

        // 3. Montar o prompt do usuário para a IA
        const userQuery = `
            Matérias: ${materias}
            Tempo Disponível: ${tempo}
            Meta: ${metas}
        `;

        // 4. Montar o payload completo para o Google
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPromptPlano }] }
        };

        // 5. Chamar a API do Google (de forma segura, do servidor)
        const googleResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!googleResponse.ok) {
            throw new Error(`Erro da API Google: ${googleResponse.statusText}`);
        }

        const result = await googleResponse.json();
        const planoGerado = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (planoGerado) {
            // 6. Enviar a resposta de volta para o frontend
            response.status(200).json({ plano: planoGerado });
        } else {
            response.status(500).json({ error: "A IA não conseguiu gerar o plano." });
        }

    } catch (error) {
        console.error("Erro no backend /api/gerar-plano:", error);
        response.status(500).json({ error: "Ocorreu um erro no servidor." });
    }
}
