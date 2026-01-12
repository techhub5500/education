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
    const systemPrompt = `Você é um especialista em criar conteúdo visual educacional para apresentações narradas.

CONTEXTO IMPORTANTE:
- O texto fornecido será NARRADO por uma pessoa
- Você deve criar elementos visuais em TEXTO que ACOMPANHEM e REFORCEM a narração
- Os visuais aparecem enquanto a pessoa fala em um formato vertical (celular)
- Priorize clareza, impacto visual e legibilidade
- Use EMOJIS, SETAS, SÍMBOLOS e BULLET POINTS para tornar visualmente atraente

TIPO DE ELEMENTO:
- "text" - ÚNICO tipo disponível, mas você deve torná-lo VISUALMENTE RICO

REGRAS DE OURO:
✅ Use EMOJIS para representar conceitos (💰 dinheiro, 📈 crescimento, ⚠️ alerta, ✅ correto, ❌ errado)
✅ Use SETAS para fluxos e progressões (→ ➜ ⇒ ↗️ ↘️)
✅ Use BULLET POINTS para listas (• ◆ ▸ ✦)
✅ Use SÍMBOLOS especiais (★ ⭐ ⚡ 🎯 💡 🔥)
✅ Quebre textos longos em múltiplos elementos menores
✅ Para comparações use format: "Rico ➜ ... | Pobre ➜ ..."
✅ Para sequências use: "1️⃣ ... \n 2️⃣ ... \n 3️⃣ ..."
✅ Destaque números e valores importantes
❌ NÃO crie textos muito longos - máximo 3-4 linhas por elemento
❌ NÃO use apenas texto puro - sempre adicione elementos visuais

ANÁLISE DO TEXTO:
1. Identifique os 3-5 pontos principais
2. Quebre em blocos de texto curtos e impactantes
3. Destaque palavras-chave, números e conceitos importantes
4. Use listas para passos ou enumerações
5. Crie elementos que complementem a fala, não que compitam com ela

ESTRUTURA DA RESPOSTA:
{
  "elements": [
    {
      "type": "text|list",
      "content": "conteúdo curto e impactante",
      "highlights": ["palavras", "números", "conceitos"],
      "animation": {
        "duration": 1.5
      }
    }
  ]
}

EXEMPLOS DE USO CORRETO:

Texto sobre estratégia financeira:
→ Element 1 (text): "Por que os ricos pagam menos impostos?"
→ Element 2 (text): "Empréstimo não é renda = sem impostos"
→ Element 3 (list): Estratégias que eles usam

Texto com comparação "rico vs pobre":
→ Element 1 (text): "Rico: patrimônio | Pobre: salário"
→ Element 2 (text): "Rico: ativos que geram renda"
→ Element 3 (text): "Pobre: troca tempo por dinheiro"

Texto com números:
→ Element (text): "R$ 100 → R$ 150 em 30 dias" (destacar valores)

Texto conceitual:
→ Element (text): Frase de impacto com palavras-chave destacadas

DURAÇÃO DAS ANIMAÇÕES:
- text: 1.2 a 2.0 segundos
- list: 1.5 a 2.5 segundos

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
