# ✅ Checklist de Deploy - Render

Use este checklist para garantir que tudo está pronto para o deploy.

---

## 📋 PRÉ-DEPLOY

### Código Local
- [ ] Todas as alterações foram salvas
- [ ] Aplicação roda localmente sem erros (`npm start`)
- [ ] Testei todas as funcionalidades principais
- [ ] Arquivo `.env` existe localmente (não será enviado ao Git)
- [ ] Arquivo `.env.example` está atualizado

### GitHub
- [ ] Tenho conta no GitHub
- [ ] Criei um repositório (público ou privado)
- [ ] Git está instalado no meu computador
- [ ] Copiei a URL do repositório

### Render
- [ ] Tenho conta no Render (https://render.com)
- [ ] Conectei minha conta do GitHub ao Render

### API Deepseek
- [ ] Tenho chave da API Deepseek
- [ ] Verifiquei que a chave funciona
- [ ] Há créditos disponíveis na conta

---

## 🚀 DURANTE O DEPLOY

### Enviar para GitHub
- [ ] Executei `git init`
- [ ] Executei `git add .`
- [ ] Executei `git commit -m "Deploy inicial"`
- [ ] Executei `git remote add origin [URL]`
- [ ] Executei `git push -u origin main`
- [ ] Código aparece no repositório do GitHub

### Configurar no Render
- [ ] Cliquei em "New +" → "Web Service"
- [ ] Selecionei o repositório correto
- [ ] Nome do serviço: `educacao-visual-dashboard`
- [ ] Runtime: Node
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Plano: Free

### Variáveis de Ambiente
- [ ] Adicionei `DEEPSEEK_API_KEY` com minha chave
- [ ] Adicionei `NODE_ENV` com valor `production`
- [ ] Verifiquei que as chaves estão corretas (sem espaços extras)

### Criar Serviço
- [ ] Cliquei em "Create Web Service"
- [ ] Aguardei o build completar (2-5 minutos)
- [ ] Status mudou para "Live" (verde)

---

## ✅ PÓS-DEPLOY

### Testar Aplicação
- [ ] Abri a URL fornecida pelo Render
- [ ] Página carregou corretamente
- [ ] Interface aparece completa (painel + área de apresentação)
- [ ] Digite texto no campo de entrada: **funciona**
- [ ] Clique em "Gerar Conteúdo Visual": **funciona**
- [ ] Conteúdo é gerado pela IA: **funciona**
- [ ] Controles de animação aparecem: **funciona**
- [ ] Clique em "Iniciar Apresentação": **funciona**
- [ ] Pressione ENTER: **elementos aparecem com animação**
- [ ] Gráficos são renderizados corretamente: **funciona**
- [ ] Barra de progresso funciona: **funciona**

### Testar Responsividade
- [ ] Acessei do celular
- [ ] Layout se adapta para mobile: **funciona**
- [ ] Todos os botões funcionam no touch: **funciona**
- [ ] Área de apresentação tem proporção 9:16: **funciona**
- [ ] Animações funcionam no mobile: **funciona**

### Logs e Monitoramento
- [ ] Acessei a aba "Logs" no Render
- [ ] Vi mensagem "Servidor rodando em http://..."
- [ ] Não há erros críticos nos logs
- [ ] Métricas estão disponíveis

---

## 🔧 SOLUÇÃO DE PROBLEMAS

### Build Falhou
- [ ] Verifiquei logs de build
- [ ] `package.json` está correto
- [ ] Todas as dependências estão listadas
- [ ] Versão do Node é >= 18.0.0

### API Retorna Erro 500
- [ ] `DEEPSEEK_API_KEY` está configurada no Render
- [ ] Chave da API está correta (sem espaços)
- [ ] Há créditos na conta Deepseek
- [ ] Testei a chave em https://platform.deepseek.com/

### Aplicação Não Carrega
- [ ] Aguardei 30 segundos (pode estar hibernando)
- [ ] Dei refresh na página (Ctrl+F5)
- [ ] Verifiquei status do Render: https://status.render.com/
- [ ] Acessei logs para ver erros

### CORS / API Errors
- [ ] `script.js` usa `window.location.origin` para API
- [ ] Não há URLs hardcoded como `localhost:3000`
- [ ] CORS está habilitado no `server.js`

---

## 📱 COMPARTILHAR

### URL da Aplicação
Minha aplicação está em:
```
https://______________________.onrender.com
```

### Avisos para Usuários
⚠️ **Plano Free**: 
- Primeiro acesso pode levar ~30 segundos (hibernação)
- Serviço reinicia a cada 15 dias automaticamente

### Próximos Passos
- [ ] Compartilhei URL com interessados
- [ ] Documentei como usar a aplicação
- [ ] Configurei domínio personalizado (opcional)
- [ ] Considerei upgrade para plano pago (opcional)

---

## 📝 ATUALIZAÇÕES FUTURAS

Sempre que modificar o código:

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

O Render faz re-deploy automático! 🎉

---

**Data do Deploy**: ___/___/______
**URL da Aplicação**: _________________________
**Status**: ⭕ Pendente | ✅ Concluído
