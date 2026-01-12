# Dashboard Educacional - Conteúdo Visual com IA

Aplicação web para criar conteúdo educacional visual com auxílio de IA.

## 🚀 Características

- ✨ Interface estilo hand-drawn (desenhado à mão)
- 🤖 Integração com IA Deepseek para processar conteúdo
- 📊 Geração automática de gráficos (barras, pizza, linha)
- ⏱️ Controle de tempo para sincronização com narração
- 🎨 Destaques visuais coloridos tipo marca-texto
- 📝 Renderização de tabelas, listas e expressões matemáticas

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- Chave da API Deepseek

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure a chave da API:
   - Abra o arquivo `.env`
   - Cole sua chave da API Deepseek:
   ```
   DEEPSEEK_API_KEY=sua_chave_aqui
   ```

3. Inicie o servidor:
```bash
npm start
```

4. Acesse no navegador:
```
http://localhost:3000
```

## 🎯 Como Usar

### 1. Digite o Conteúdo
Digite qualquer texto educacional na área de texto. Exemplos:

- **Gráficos**: "No mês passado gastei 20 e neste mês gastei 30"
- **Percentuais**: "20% vem do mercado financeiro, 15% do mercado de tecnologia"
- **Expressões**: "2 + 2 é igual a 4"

### 2. Gere o Conteúdo Visual
Clique em "✨ Gerar Conteúdo Visual" e aguarde a IA processar.

### 3. Ajuste os Tempos
Após a geração, ajuste a duração (em segundos) de cada elemento visual.

### 4. Reproduza
Clique em "▶️ Play" para ver a apresentação animada!

## 🎨 Tipos de Conteúdo Suportados

- **Texto com Destaques**: Palavras-chave são destacadas com cores
- **Gráficos**: Barras, pizza e linhas
- **Tabelas**: Dados organizados
- **Listas**: Com bullets estilizados
- **Matemática**: Expressões matemáticas formatadas

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Frontend**: HTML5, CSS3, JavaScript
- **Gráficos**: Chart.js
- **IA**: Deepseek API
- **Fontes**: Patrick Hand, Caveat (Google Fonts)

## 📝 Estrutura do Projeto

```
EDUCACAO/
├── public/
│   ├── index.html      # Interface principal
│   ├── style.css       # Estilos hand-drawn
│   └── script.js       # Lógica do frontend
├── server.js           # Servidor Node.js
├── package.json        # Dependências
├── .env                # Chave da API (não commitar!)
└── README.md          # Este arquivo
```

## 🔒 Segurança

⚠️ **IMPORTANTE**: Nunca compartilhe seu arquivo `.env` ou sua chave da API!

## 📺 Uso para Gravações

Esta ferramenta é ideal para criar vídeos educacionais:

1. Prepare seu conteúdo e ajuste os tempos
2. Inicie a gravação de tela
3. Clique em Play
4. Narre enquanto o conteúdo aparece sincronizado

## 🤝 Suporte

Para obter sua chave da API Deepseek: https://platform.deepseek.com/

## � Deploy

### Deploy no Render (Recomendado)

A aplicação está pronta para deploy no Render com domínio gratuito.

**Guias disponíveis:**
- [DEPLOY-RENDER.md](DEPLOY-RENDER.md) - Guia completo passo a passo
- [DEPLOY-QUICK.md](DEPLOY-QUICK.md) - Resumo rápido dos comandos

**Após o deploy, sua aplicação estará em:**
```
https://seu-app.onrender.com
```

---

## 📝 Licença

MIT

