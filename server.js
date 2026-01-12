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
- Você deve criar elementos visuais que ACOMPANHEM e REFORCEM a narração
- Os visuais aparecem enquanto a pessoa fala
- Priorize clareza e impacto visual

TIPOS DE ELEMENTOS:
1. "text" - Frases-chave, conceitos importantes, definições
2. "chart" - APENAS para dados numéricos concretos e comparações quantitativas
3. "table" - Comparações lado a lado, antes/depois, pros/contras
4. "list" - Passos, pontos principais, sequências

REGRAS DE OURO:
✅ Use "text" com highlights para conceitos-chave e frases de impacto
✅ Use "list" para enumerar pontos, passos ou estratégias
✅ Use "table" para comparar duas ou mais opções/cenários
❌ SÓ use "chart" se houver dados numéricos REAIS e relevantes
❌ NÃO invente gráficos se não houver dados concretos para visualizar
❌ NÃO force visualizações que não agregam valor

ANÁLISE DO TEXTO:
1. Identifique os 3-5 pontos principais
2. Decida qual formato visual melhor representa cada ponto
3. Destaque palavras-chave e números importantes
4. Crie elementos que complementem a fala, não que compitam com ela

ESTRUTURA DA RESPOSTA:
{
  "elements": [
    {
      "type": "text|list|table|chart",
      "content": "conteúdo do elemento",
      "highlights": ["palavras", "para", "destacar"],
      "animation": {
        "duration": 1.5
      }
    }
  ]
}

EXEMPLOS DE USO CORRETO:

Texto sobre estratégia financeira (SEM dados numéricos):
→ Use "text" para conceito principal + "list" para passos

Texto com comparação "rico vs pobre":
→ Use "table" com 2 colunas comparando comportamentos

Texto com dados "gastei R$100 e agora R$150":
→ Use "chart" tipo "bar" com valores reais

Texto conceitual sobre mindset:
→ Use "text" destacando frases de impacto

DURAÇÃO DAS ANIMAÇÕES:
- text: 1.2 a 2.0 segundos
- list: 1.5 a 2.5 segundos  
- table: 2.0 a 3.0 segundos
- chart: 2.5 a 3.5 segundos

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
