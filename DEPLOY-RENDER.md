# 🚀 Guia de Deploy no Render

Este guia explica como fazer o deploy da aplicação **Dashboard Educacional** no Render usando o domínio temporário gratuito.

---

## 📋 Pré-requisitos

1. ✅ Conta no GitHub (gratuita)
2. ✅ Conta no Render (gratuita) - https://render.com
3. ✅ Chave da API Deepseek - https://platform.deepseek.com/

---

## 📦 PASSO 1: Preparar o Repositório GitHub

### 1.1 - Criar Repositório no GitHub

1. Acesse https://github.com e faça login
2. Clique em **"New repository"** (ou ícone +)
3. Configure:
   - **Nome**: `educacao-visual-dashboard` (ou outro nome)
   - **Visibilidade**: Public ou Private
   - **NÃO** inicialize com README (já temos os arquivos)
4. Clique em **"Create repository"**

### 1.2 - Enviar Código para o GitHub

Abra o PowerShell/Terminal na pasta do projeto e execute:

```powershell
# Inicializar Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos (exceto os do .gitignore)
git add .

# Fazer o commit
git commit -m "Deploy inicial - Dashboard Educacional"

# Conectar ao repositório remoto (substitua SEU-USUARIO e SEU-REPO)
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANTE**: O arquivo `.env` NÃO será enviado (está no .gitignore). Isso é correto por segurança!

---

## 🌐 PASSO 2: Deploy no Render

### 2.1 - Criar Web Service

1. Acesse https://render.com e faça login
2. No Dashboard, clique em **"New +"** → **"Web Service"**
3. Conecte sua conta do GitHub (se ainda não conectou)
4. Selecione o repositório **educacao-visual-dashboard**

### 2.2 - Configurar o Serviço

Preencha os campos:

**Configurações Básicas:**
- **Name**: `educacao-visual-dashboard` (será usado na URL)
- **Region**: `Oregon (US West)` ou mais próximo de você
- **Branch**: `main`
- **Root Directory**: deixe vazio
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Plano:**
- Selecione **"Free"** (instância gratuita)
  - ⚠️ Nota: O serviço gratuito hiberna após 15 min de inatividade

### 2.3 - Adicionar Variáveis de Ambiente

**ANTES de criar o serviço**, role até a seção **"Environment Variables"**:

1. Clique em **"Add Environment Variable"**
2. Adicione:

```
Key: DEEPSEEK_API_KEY
Value: [SUA-CHAVE-DA-API-DEEPSEEK]
```

3. Adicione outra variável:

```
Key: NODE_ENV
Value: production
```

### 2.4 - Criar o Serviço

1. Clique no botão **"Create Web Service"**
2. Aguarde o build (leva 2-5 minutos)
3. Quando aparecer **"Live"** em verde, está pronto! 🎉

---

## 🌍 PASSO 3: Acessar sua Aplicação

Sua aplicação estará disponível em:

```
https://educacao-visual-dashboard.onrender.com
```

Ou com o nome que você escolheu:

```
https://SEU-NOME-ESCOLHIDO.onrender.com
```

---

## ⚙️ Configurações Adicionais

### Configurar Domínio Personalizado (Opcional)

Se você tiver um domínio próprio:

1. No painel do Render, vá em **Settings** → **Custom Domain**
2. Adicione seu domínio
3. Configure os DNS conforme instruções do Render

### Adicionar ou Atualizar Variáveis de Ambiente

1. No painel do Render, vá em **Environment**
2. Clique em **"Add Environment Variable"**
3. Ou edite as existentes
4. O serviço será automaticamente reiniciado

---

## 🔄 Atualizar a Aplicação

Sempre que você fizer mudanças no código:

```powershell
# Adicionar arquivos modificados
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push
```

O Render detecta automaticamente e faz o re-deploy! 🚀

---

## 🐛 Troubleshooting (Solução de Problemas)

### Problema: Build Failed (Falha no Build)

**Solução**:
1. Verifique os logs no painel do Render
2. Certifique-se que o `package.json` está correto
3. Verifique se todas as dependências estão listadas

### Problema: Application Error

**Solução**:
1. Vá em **Logs** no painel do Render
2. Procure por erros (linhas em vermelho)
3. Verifique se a variável `DEEPSEEK_API_KEY` está configurada

### Problema: API não funciona

**Solução**:
1. Verifique se a chave da API Deepseek está correta
2. Teste a chave em: https://platform.deepseek.com/
3. Certifique-se que há créditos disponíveis na conta

### Problema: Serviço está Lento ou Offline

**Solução**:
- No plano gratuito, o serviço "dorme" após 15 min sem uso
- Primeiro acesso após dormir leva ~30 segundos para acordar
- Considere upgrade para plano pago se precisar estar sempre online

---

## 💰 Custos

### Plano Free (Gratuito)
- ✅ 750 horas/mês grátis
- ✅ Domínio `.onrender.com` incluído
- ⚠️ Hiberna após 15 min de inatividade
- ⚠️ Reinicia após 15 dias automático

### Plano Starter ($7/mês)
- ✅ Sempre online (não hiberna)
- ✅ Mais recursos (CPU/RAM)
- ✅ Deploy mais rápido

---

## 📊 Monitoramento

### Ver Logs em Tempo Real

1. No painel do Render
2. Clique em **"Logs"**
3. Veja todas as requisições e erros

### Métricas

1. No painel do Render
2. Clique em **"Metrics"**
3. Veja uso de CPU, memória e tráfego

---

## 🔐 Segurança

### Boas Práticas

✅ **NUNCA** commite o arquivo `.env` no Git
✅ Use variáveis de ambiente no Render
✅ Mantenha sua chave da API em segredo
✅ Use HTTPS (Render fornece automaticamente)

### Regenerar Chave da API

Se sua chave vazar:

1. Gere nova chave em https://platform.deepseek.com/
2. Atualize no Render (Environment Variables)
3. O serviço reinicia automaticamente

---

## 📞 Suporte

### Documentação Oficial
- Render: https://render.com/docs
- Deepseek: https://platform.deepseek.com/docs

### Status do Serviço
- Render Status: https://status.render.com/

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Código enviado para GitHub
- [ ] Web Service criado no Render
- [ ] `DEEPSEEK_API_KEY` configurada
- [ ] Build concluído com sucesso (status "Live")
- [ ] Aplicação abre no navegador
- [ ] Teste: Digite texto e gere conteúdo visual
- [ ] Teste: Animações funcionam ao pressionar ENTER
- [ ] Teste: Funciona no celular (responsivo)

---

## 🎉 Pronto!

Sua aplicação está no ar! Compartilhe o link:

```
https://seu-app.onrender.com
```

**Lembre-se**: No plano gratuito, primeiro acesso pode levar ~30 segundos se o serviço estava hibernando.

---

**Última atualização**: Janeiro 2026
**Versão**: 1.0.0
