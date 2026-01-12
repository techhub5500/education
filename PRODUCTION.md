# Configuração de Produção

Este arquivo documenta as configurações necessárias para produção no Render.

## Variáveis de Ambiente Obrigatórias

### DEEPSEEK_API_KEY
- **Descrição**: Chave de autenticação da API Deepseek
- **Como obter**: https://platform.deepseek.com/
- **Formato**: String alfanumérica (começando com `sk-`)
- **Exemplo**: `sk-abc123def456...`

### NODE_ENV (Opcional)
- **Descrição**: Define o ambiente de execução
- **Valor**: `production`
- **Nota**: O Render configura automaticamente

## Configurações Automáticas

O Render detecta e configura automaticamente:
- ✅ Versão do Node.js (>= 18.0.0)
- ✅ Comando de build: `npm install`
- ✅ Comando de start: `npm start`
- ✅ Porta dinâmica (variável PORT)

## Arquivos Importantes para Deploy

- `package.json` - Dependências e scripts
- `server.js` - Servidor Express
- `render.yaml` - Configuração do Render (opcional)
- `.gitignore` - Arquivos excluídos do Git

## Notas de Segurança

⚠️ **NUNCA** faça commit de:
- Arquivo `.env`
- Chaves de API
- Senhas ou tokens

✅ **SEMPRE** use:
- Variáveis de ambiente no painel do Render
- `.env.example` para documentar variáveis necessárias
- `.gitignore` para excluir arquivos sensíveis

## Health Check

O serviço responde em:
- **Rota raiz**: `GET /` → Retorna index.html
- **API**: `POST /api/process` → Processa conteúdo com IA

## Logs e Monitoramento

Acesse logs no painel do Render:
1. Dashboard → Seu Web Service
2. Clique em "Logs"
3. Visualize em tempo real ou histórico

## Performance no Plano Free

- ⏱️ Primeiro acesso após hibernação: ~30 segundos
- 💤 Hiberna após: 15 minutos sem requisições
- 🔄 Reinicia automaticamente: A cada 15 dias
- 📊 Limite de uso: 750 horas/mês

## Upgrade para Plano Pago

Benefícios do plano Starter ($7/mês):
- Sem hibernação
- Mais recursos (CPU/RAM)
- Deploy mais rápido
- Suporte prioritário

## Troubleshooting

### Erro 500 na API
- Verifique se `DEEPSEEK_API_KEY` está configurada
- Confirme que há créditos na conta Deepseek
- Veja logs no painel do Render

### Build Failed
- Verifique se `package.json` está correto
- Confirme que todas as dependências existem
- Veja logs de build no Render

### Aplicação não carrega
- Aguarde ~30 segundos (hibernação)
- Force refresh (Ctrl+F5)
- Verifique status em https://status.render.com/
