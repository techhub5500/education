# 📚 Dashboard Educacional - Plataforma de Conteúdo Visual com IA

Plataforma web para criação de conteúdo educacional visual com narração sincronizada, usando IA para transformar texto em apresentações visuais animadas.

## ✨ Funcionalidades

### 🎨 Geração de Conteúdo Visual
- **IA Generativa**: Usa Deepseek API para transformar texto em elementos visuais
- **Animações Suaves**: Transições e efeitos visuais hand-drawn
- **Navegação Linha-por-Linha**: Controle preciso com ENTER ou toque na tela
- **Scroll Inteligente**: Centralização automática do conteúdo

### 👤 Sistema de Autenticação
- **Cadastro**: Email, nome de usuário e senha
- **Login**: Autenticação com JWT (tokens válidos por 7 dias)
- **Segurança**: Senhas criptografadas com bcrypt

### 💾 Gerenciamento de Apresentações
- **Salvar**: Armazene suas apresentações no MongoDB
- **Biblioteca**: Veja todas as suas apresentações salvas
- **Carregar**: Reabra apresentações anteriores
- **Deletar**: Remova apresentações com confirmação

### 📱 Design Responsivo
- **Formato 9:16**: Otimizado para gravação de vídeos verticais
- **Mobile-First**: Touch navigation com gestos intuitivos
- **Desktop**: Controle via teclado (ENTER para avançar)
- **Fullscreen**: Modo apresentação em tela cheia

## 🚀 Como Usar

### Instalação Local

1. **Clone o repositório**
```bash
git clone <seu-repo>
cd EDUCACAO
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/education
JWT_SECRET=sua-chave-secreta-super-segura
PORT=3000
```

4. **Inicie o servidor**
```bash
node server.js
```

5. **Acesse no navegador**
```
http://localhost:3000/auth.html
```

### Primeiro Acesso

1. **Cadastre-se**: Clique em "Criar uma conta"
   - Digite seu email
   - Escolha um nome de usuário
   - Crie uma senha (mínimo 6 caracteres)

2. **Faça Login**: Use suas credenciais
   - Nome de usuário
   - Senha

3. **Crie Conteúdo**:
   - Digite ou cole seu texto educacional
   - Clique em "✨ Gerar Conteúdo Visual"
   - Aguarde a IA processar
   - Ajuste durações das animações

4. **Salve sua Apresentação**:
   - Clique em "💾 Salvar Apresentação"
   - Digite um título
   - Apresentação salva no banco de dados

5. **Gerencie suas Apresentações**:
   - Clique em "📂 Minhas Apresentações"
   - Veja todas as apresentações salvas
   - Carregue ou delete conforme necessário

## 🛠️ Tecnologias

### Backend
- **Node.js** (v18+)
- **Express** - Framework web
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Criptografia de senhas
- **jsonwebtoken** - Autenticação JWT
- **Axios** - Cliente HTTP para Deepseek API

### Frontend
- **HTML5** / **CSS3** / **JavaScript** (Vanilla)
- **Chart.js** - Gráficos
- **Rough.js** - Estilo hand-drawn
- **Patrick Hand & Caveat** - Fontes manuscritas

### Banco de Dados
- **MongoDB Atlas** - Banco NoSQL em nuvem

### IA
- **Deepseek API** - Modelo `deepseek-chat`

### Deploy
- **Render.com** - Hospedagem gratuita

## 📁 Estrutura do Projeto

```
EDUCACAO/
├── server.js              # Servidor Express + API
├── package.json           # Dependências
├── .env                   # Variáveis de ambiente (não commitado)
├── models/
│   ├── User.js           # Schema de usuário
│   └── Presentation.js   # Schema de apresentação
└── public/
    ├── index.html        # Dashboard principal
    ├── auth.html         # Página de login/cadastro
    ├── script.js         # Lógica do dashboard
    ├── auth.js           # Lógica de autenticação
    ├── style.css         # Estilos do dashboard
    └── auth.css          # Estilos de autenticação
```

## 🔐 Segurança

- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ JWT tokens com expiração de 7 dias
- ✅ Middleware de autenticação em rotas protegidas
- ✅ Validação de entrada em todas as rotas
- ✅ CORS configurado para origens específicas
- ⚠️ **IMPORTANTE**: Altere o `JWT_SECRET` em produção!

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login e geração de token

### Apresentações (Protegidas)
- `POST /api/presentations` - Salvar apresentação
- `GET /api/presentations` - Listar apresentações do usuário
- `GET /api/presentations/:id` - Obter apresentação específica
- `DELETE /api/presentations/:id` - Deletar apresentação

### Processamento IA (Protegida)
- `POST /api/process` - Gerar conteúdo visual com IA

## 🌐 Deploy no Render

1. **Faça commit das mudanças**:
```bash
git add .
git commit -m "Add authentication and MongoDB integration"
git push
```

2. **Configure no Render**:
   - Vá para o dashboard do Render
   - Seu projeto fará deploy automático
   - Verifique os logs para confirmar sucesso

3. **Variáveis de Ambiente**:
   Certifique-se que estão configuradas no Render:
   - `DEEPSEEK_API_KEY`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (opcional, Render define automaticamente)

4. **Acesse**:
```
https://educacao-visual-dashboard.onrender.com/auth.html
```

## 🎯 Casos de Uso

### Para Professores
- Criar apresentações educacionais visuais
- Gravar vídeos educativos com apoio visual
- Reutilizar apresentações em diferentes aulas

### Para Criadores de Conteúdo
- Produzir conteúdo educativo para redes sociais
- Formato otimizado para TikTok, Reels, Shorts
- Narração sincronizada com visualizações

### Para Estudantes
- Organizar notas de estudo visualmente
- Criar resumos animados de conteúdos
- Compartilhar conhecimento de forma criativa

## 🔧 Desenvolvimento

### Executar em modo dev (com auto-reload)
```bash
npm install -g nodemon
nodemon server.js
```

### Testar autenticação
1. Acesse `/auth.html`
2. Crie uma conta de teste
3. Faça login
4. Verifique localStorage no DevTools (deve ter `token`, `userId`, `username`)

### Debug MongoDB
```javascript
// No server.js, habilite logs do Mongoose
mongoose.set('debug', true);
```

## 📝 Licença

MIT License - Livre para uso educacional e comercial.

## 🤝 Contribuições

Contribuições são bem-vindas! Abra uma issue ou pull request.

## 📧 Suporte

Em caso de dúvidas ou problemas, abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para educação**
