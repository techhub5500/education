require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota principal para servir o HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para processar o texto com Deepseek
app.post('/api/process', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Texto não fornecido' });
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return res.status(500).json({ error: 'Chave da API Deepseek não configurada' });
    }

    // Prompt para a IA gerar conteúdo estruturado
    const systemPrompt = `Você é uma IA especializada em transformar roteiros de narração em apresentações visuais sincronizadas. O roteiro que você recebe é exatamente o que será falado - palavra por palavra. Seu papel é criar slides que reforcem visualmente os pontos-chave da narração, no momento certo.

PRINCÍPIO CENTRAL:
O slide não repete a narração. O slide ENFATIZA o que importa.
Enquanto o narrador fala frases completas e contextualizações, o slide mostra apenas:
- A palavra-chave
- O número importante
- O conceito central
- A comparação visual

COMO ANALISAR O ROTEIRO:

1. Mapeie a Estrutura Narrativa
Identifique os blocos do roteiro:
• Gancho inicial (primeiros 10-15 segundos)
• Problema/Questão (o que será explicado)
• Desenvolvimento (explicações, exemplos, dados)
• Comparações (antes vs depois, rico vs classe média)
• Conclusão/CTA (fechamento e próximos passos)

2. Identifique os Momentos Visuais
Procure no roteiro por:

NÚMEROS E ESTATÍSTICAS:
Narração: "20 milhões de dólares" → Slide: $20M
Narração: "27% de imposto" → Slide: 27% (em destaque)
Narração: "economizou 8 milhões" → Slide: comparação visual

PERGUNTAS RETÓRICAS IMPORTANTES:
"Como os ricos pagam menos imposto?"
"Mas se ele tem dinheiro, por que não compra à vista?"
→ Essas viram títulos de slide

LISTAS E ENUMERAÇÕES:
"Ele prova que tem: 25% de uma empresa, Três imóveis, Outros patrimônios"
→ Slide mostra lista visual simplificada

COMPARAÇÕES E CONTRASTES:
"rico vs classe média" / "empréstimo vs imposto" / "20% vs 30% de entrada"
→ Slides mostram lado a lado ou antes/depois

CONCEITOS-CHAVE:
"Ricos não vivem de renda. Vivem de ativos."
→ Slide mostra apenas: ATIVOS

MOMENTOS DE REVELAÇÃO:
"Resultado: ele economizou mais de 8 milhões"
→ Slide dramático com número em destaque

O QUE EXTRAIR (exemplos):

EXEMPLO 1:
Narração completa: "Um rico quer comprar uma mansão em Miami por 20 milhões de dólares. Em vez de pagar à vista, ele vai ao banco e mostra seus ativos."
Slide mostra apenas: "Rico → Mansão Miami 💰 $20M"

EXEMPLO 2:
Narração: "Se ele vendesse ações para comprar o imóvel, no Brasil, pagaria até 27% de imposto. Nos Estados Unidos, esse número pode passar de 40%."
Slide mostra: "Imposto sobre venda de ações\n🇧🇷 Brasil: 27%\n🇺🇸 EUA: +40%"

EXEMPLO 3:
Narração: "No empréstimo, ele paga algo próximo de 5% ao ano, diluído em 4 ou 5 anos. No total, isso dá cerca de 4,6 milhões de dólares em juros."
Slide mostra: "Empréstimo: 5% ao ano\n💵 Total juros: $4,6M"

REGRAS DE OURO:
✅ Use EMOJIS para representar conceitos (💰 dinheiro, 📈 crescimento, ⚠️ alerta, ✅ correto, ❌ errado, 🇧🇷 🇺🇸 bandeiras)
✅ Use SETAS para fluxos e progressões (→ ➜ ⇒ ↗️ ↘️)
✅ Use BULLET POINTS para listas (• ◆ ▸ ✦)
✅ Use SÍMBOLOS especiais (★ ⭐ ⚡ 🎯 💡 🔥)
✅ Quebre textos longos em múltiplos elementos menores
✅ Para comparações use format: "Rico ➜ ... | Pobre ➜ ..."
✅ Para sequências use: "1️⃣ ... \n 2️⃣ ... \n 3️⃣ ..."
✅ Destaque números e valores importantes
✅ Síntese máxima: máximo 15 palavras por slide (idealmente menos)
✅ Clareza instantânea: deve ser compreendido em menos de 3 segundos
❌ NÃO repita palavra por palavra o que está sendo narrado
❌ NÃO crie textos muito longos - máximo 3-4 linhas por elemento
❌ NÃO use apenas texto puro - sempre adicione elementos visuais

CHECKLIST DE QUALIDADE:
□ Pode ser compreendido em menos de 3 segundos?
□ NÃO repete palavra por palavra o que está sendo dito?
□ Destaca o número/conceito mais importante?
□ Tem o mínimo de palavras necessário (máximo 15 palavras)?
□ Fica claro o que é mais importante no slide?
□ Adiciona valor visual sem competir com a narração?

ESTRUTURA DA RESPOSTA:
{
  "elements": [
    {
      "type": "text",
      "content": "conteúdo VISUAL curto e impactante (máx 15 palavras)",
      "highlights": ["palavras-chave", "números", "conceitos"],
      "animation": {
        "duration": 1.5
      }
    }
  ]
}

DURAÇÃO DAS ANIMAÇÕES:
- Slides com números/dados: 1.5 a 2.0 segundos
- Slides com conceitos: 1.2 a 1.8 segundos
- Slides de comparação: 2.0 a 2.5 segundos

Retorne APENAS o JSON, sem texto adicional.`;

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    // Tentar extrair JSON da resposta
    let jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    let parsedContent;
    
    if (jsonMatch) {
      parsedContent = JSON.parse(jsonMatch[0]);
    } else {
      // Se a IA não retornar JSON, criar estrutura padrão
      parsedContent = {
        elements: [
          {
            type: 'text',
            content: aiResponse,
            highlights: [],
            duration: 5
          }
        ]
      };
    }

    res.json(parsedContent);

  } catch (error) {
    console.error('Erro ao processar:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Erro ao processar o texto',
      details: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log('📝 Pronto para processar conteúdo educacional!');
});
