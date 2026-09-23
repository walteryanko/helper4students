# Helper4Students

**Planejamento de estudos e resumos com IA — protótipo educacional.**

Uma aplicação web em português para transformar matérias, disponibilidade e objetivos em uma proposta de plano de estudos, além de resumir textos de apoio. O projeto explora a integração entre uma interface leve, autenticação, persistência e uma API de IA chamada pelo servidor.

> **Estado:** protótipo em desenvolvimento. O repositório contém os fluxos de interface e backend, mas a operação completa depende da configuração de Firebase, hospedagem e acesso ao modelo Gemini. Recursos anunciados como Pro ainda são demonstrações de interface, não serviços comerciais prontos.

## O que existe no código

| Área | Implementação | Limite atual |
| --- | --- | --- |
| Autenticação | Firebase Auth com Google e e-mail/senha | Exige projeto Firebase configurado e provedores habilitados. |
| Plano de estudos | Formulário de matérias, tempo e metas; chamada a `POST /api/gerar-plano` | A resposta da IA precisa de revisão do estudante. |
| Resumos | Texto de entrada; chamada a `POST /api/resumir`; resultado copiável | Depende da API externa; não garante fidelidade sem revisão. |
| Persistência | Perfil e plano de estudos no Firestore | As regras do banco e a configuração de produção não estão versionadas aqui. |
| Área Pro | Modal, identificação de plano e botões | Checkout, sincronização com Calendar e alertas ainda não estão implementados. |

## Arquitetura

```text
Navegador — index.html
  ├── Firebase Auth → autenticação
  ├── Firestore → perfil e plano de estudos
  └── /api/* → funções JavaScript no servidor
                    └── Gemini API
```

A chave usada para geração com Gemini é lida de `process.env.GEMINI_API_KEY` nas funções de backend. Ela não deve ser copiada para o HTML, commits ou logs.

### Tecnologias presentes

HTML, JavaScript, Tailwind CSS via CDN, Firebase Auth, Cloud Firestore, funções serverless preparadas para Vercel e integração HTTP com Gemini.

## Estrutura

```text
helper4students/
├── index.html             # Interface, autenticação e persistência
├── api/
│   ├── gerar-plano.js     # Geração de proposta de plano
│   └── resumir.js         # Resumo de texto
└── README.md
```

## Configuração para desenvolvimento

1. Clone este repositório e use um ambiente de teste, não uma base com dados reais de estudantes.
2. Configure seu próprio projeto Firebase. Habilite os métodos de autenticação necessários e revise os domínios autorizados.
3. Ajuste `firebaseConfig` em `index.html` para esse ambiente. Revise as regras do Firestore antes de habilitar gravações.
4. Em um runtime compatível com as funções da pasta `api`, configure `GEMINI_API_KEY` como segredo do servidor.
5. Confira o identificador do modelo nos dois handlers. O código inspecionado usa `gemini-2.5-flash-preview-09-2025`; a disponibilidade desse modelo não foi validada nesta revisão.
6. Execute interface e endpoints na mesma origem e teste com dados fictícios.

**Não existe um fluxo `npm install && npm run dev` definido neste repositório.** Abrir somente o HTML não executa as funções `/api`. A configuração do runtime precisa ser concluída antes do teste ponta a ponta.

## Contratos de API

### Criar plano

`POST /api/gerar-plano`

```json
{
  "materias": "Redes de Computadores, Java",
  "tempo": "1 hora por dia, de segunda a sexta",
  "metas": "Revisar fundamentos e resolver exercícios"
}
```

Resposta de sucesso:

```json
{ "plano": "Texto do plano proposto" }
```

### Resumir texto

`POST /api/resumir`

```json
{ "text": "Texto acadêmico fornecido pelo estudante." }
```

Resposta de sucesso:

```json
{ "resumo": "Texto resumido" }
```

As duas funções aceitam POST e retornam erro para outros métodos. Os exemplos acima descrevem o contrato do código; não são evidência de execução live.

## Antes de usar com usuários reais

A evolução para produção deve incluir validação e limites de entrada no servidor, autorização dos endpoints, controle de consumo de IA, revisão das regras do Firestore e tratamento de erros. A existência de login na interface não substitui a proteção dos endpoints.

Também é necessário testar o fluxo completo de cadastro, geração, salvamento e reabertura. Recursos Pro só devem ser apresentados como disponíveis depois de implementados e verificados. Não envie dados pessoais ou material confidencial ao modelo sem revisar o tratamento aplicável.

## O que este projeto demonstra

- Integração de uma interface web com serviços de autenticação e persistência.
- Separação entre experiência do usuário e chamada server-side de IA.
- Definição de contratos HTTP para geração de conteúdo.
- Aprendizado sobre a diferença entre um protótipo funcional e um serviço pronto para produção.

## Validação e escopo

Documentação revisada a partir do código público em **23/09/2026**. Esta revisão foi estática: não executou login Firebase, geração paga, cobrança nem implantação. Não há alegação de cobertura automatizada ou segurança homologada.

## Autor

**Walter Yanko** — desenvolvimento de software, IA aplicada e tecnologia criativa.

[Perfil no GitHub](https://github.com/walteryanko) · [Portfólio profissional](https://walter-yanko-portfolio.walteryanko.chatgpt.site/)

---

**Licença:** nenhuma licença nova foi adicionada nesta revisão. A organização da documentação não altera direitos sobre código, dependências ou serviços utilizados.
