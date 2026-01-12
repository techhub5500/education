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
    const systemPrompt = `Você é um assistente especializado em criar conteúdo educacional visual.
Analise o texto fornecido e retorne um JSON estruturado com elementos visuais.

Tipos de elementos disponíveis:
1. "text" - Texto com destaques e marcações
2. "chart" - Gráficos (bar, pie, line)
3. "table" - Tabelas organizadas
4. "list" - Listas com bullets
5. "math" - Expressões matemáticas

Para cada elemento, forneça:
- type: tipo do elemento
- content: conteúdo específico
- duration: tempo sugerido em segundos para exibição
- highlights: palavras ou números para destacar com cores

Exemplo de resposta JSON:
{
  "elements": [
    {
      "type": "text",
      "content": "2 + 2 é igual a 4",
      "highlights": ["2", "4"],
      "animation": {
        "type": "fadeSlide",
        "duration": 1.5
      }
    },
    {
      "type": "chart",
      "chartType": "bar",
      "data": {
        "labels": ["Mês passado", "Este mês"],
        "values": [20, 30]
      },
      "title": "Comparação de Gastos",
      "animation": {
        "duration": 2.5
      }
    }
  ]
}

Para textos, use animation.type "fadeSlide" e duration entre 1 a 3 segundos.
Para gráficos, use duration entre 2 a 4 segundos para animação progressiva.
Sempre identifique números, percentuais e dados numéricos para criar gráficos apropriados.
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
