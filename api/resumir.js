// Este arquivo deve estar em: /api/resumir.js
// O Vercel o transformará automaticamente em um endpoint de backend.

// Prompt do sistema (agora vive no backend, seguro)
const systemPromptResumo = `
    Você é um assistente acadêmico chamado Helper4students.
    Sua tarefa é resumir o texto fornecido pelo usuário.
    O usuário é um estudante, então o resumo deve ser:
    1.  **Conciso e direto**: Foque nos pontos-chave.
    2.  **Claro e fácil de entender**.
    3.  **Bem estruturado**: Use parágrafos ou bullets.
    Não adicione nenhuma introdução ou conclusão própria, apenas resuma o texto.
`;

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Método não permitido' });
    }

    try {
        // 1. Obter a chave da API do ambiente do Vercel
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Chave da API não encontrada");
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        // 2. Obter os dados do frontend
        const { text } = request.body;

        // 3. Montar o payload completo para o Google
        const payload = {
            contents: [{ parts: [{ text: text }] }],
            systemInstruction: { parts: [{ text: systemPromptResumo }] }
        };

        // 4. Chamar a API do Google (de forma segura, do servidor)
        const googleResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!googleResponse.ok) {
            throw new Error(`Erro da API Google: ${googleResponse.statusText}`);
        }

        const result = await googleResponse.json();
        const resumo = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (resumo) {
            // 5. Enviar a resposta de volta para o frontend
            response.status(200).json({ resumo: resumo });
        } else {
            response.status(500).json({ error: "A IA não conseguiu gerar o resumo." });
        }

    } catch (error) {
        console.error("Erro no backend /api/resumir:", error);
        response.status(500).json({ error: "Ocorreu um erro no servidor." });
    }
}
