# Deploy Rápido - Render

## 🚀 Passos Resumidos

### 1. GitHub
```bash
git init
git add .
git commit -m "Deploy inicial"
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git branch -M main
git push -u origin main
```

### 2. Render
1. Acesse https://render.com
2. New + → Web Service
3. Conecte o repositório
4. Configure:
   - **Name**: educacao-visual-dashboard
   - **Build**: npm install
   - **Start**: npm start
   - **Environment Variables**:
     - `DEEPSEEK_API_KEY`: sua_chave
     - `NODE_ENV`: production
5. Create Web Service

### 3. Pronto!
Acesse: `https://seu-app.onrender.com`

---

## 📝 Atualizar Código
```bash
git add .
git commit -m "Atualização"
git push
```

Deploy automático! 🎉

---

Para instruções detalhadas, veja [DEPLOY-RENDER.md](DEPLOY-RENDER.md)
