require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Presentation = require('./models/Presentation');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-key-aqui-mude-em-producao';

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rota principal para servir o HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== ROTAS DE AUTENTICAÇÃO =====

// Registrar usuário
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validações
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email ou usuário já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = new User({
      email,
      username,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      userId: user._id,
      username: user.username
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// ===== ROTAS DE APRESENTAÇÕES =====

// Salvar apresentação
app.post('/api/presentations', authenticateToken, async (req, res) => {
  try {
    const { title, originalText, elements } = req.body;

    const presentation = new Presentation({
      userId: req.user.userId,
      title,
      originalText,
      elements
    });

    await presentation.save();

    res.status(201).json({
      message: 'Apresentação salva com sucesso',
      presentationId: presentation._id
    });
  } catch (error) {
    console.error('Erro ao salvar apresentação:', error);
    res.status(500).json({ error: 'Erro ao salvar apresentação' });
  }
});

// Listar apresentações do usuário
app.get('/api/presentations', authenticateToken, async (req, res) => {
  try {
    const presentations = await Presentation.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select('title createdAt updatedAt');

    res.json(presentations);
  } catch (error) {
    console.error('Erro ao listar apresentações:', error);
    res.status(500).json({ error: 'Erro ao listar apresentações' });
  }
});

// Obter uma apresentação específica
app.get('/api/presentations/:id', authenticateToken, async (req, res) => {
  try {
    const presentation = await Presentation.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!presentation) {
      return res.status(404).json({ error: 'Apresentação não encontrada' });
    }

    res.json(presentation);
  } catch (error) {
    console.error('Erro ao buscar apresentação:', error);
    res.status(500).json({ error: 'Erro ao buscar apresentação' });
  }
});

// Deletar apresentação
app.delete('/api/presentations/:id', authenticateToken, async (req, res) => {
  try {
    const result = await Presentation.deleteOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Apresentação não encontrada' });
    }

    res.json({ message: 'Apresentação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar apresentação:', error);
    res.status(500).json({ error: 'Erro ao deletar apresentação' });
  }
});

// Rota para processar o texto com Deepseek
app.post('/api/process', authenticateToken, async (req, res) => {
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
