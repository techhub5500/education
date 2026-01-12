require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function testMongoDB() {
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado!');

    // Testar criação de usuário
    console.log('\n📝 Testando criação de usuário...');
    
    const testEmail = `test${Date.now()}@example.com`;
    const testUsername = `testuser${Date.now()}`;
    const testPassword = 'senha123';

    console.log('Dados de teste:', { testEmail, testUsername });

    // Verificar se usuário já existe
    const existing = await User.findOne({ $or: [{ email: testEmail }, { username: testUsername }] });
    if (existing) {
      console.log('⚠️ Usuário já existe (improvável com timestamp)');
      await mongoose.connection.close();
      return;
    }

    // Hash da senha
    console.log('🔐 Fazendo hash da senha...');
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    console.log('✅ Hash criado:', hashedPassword.substring(0, 20) + '...');

    // Criar usuário
    console.log('👤 Criando usuário...');
    const user = new User({
      email: testEmail,
      username: testUsername,
      password: hashedPassword
    });

    await user.save();
    console.log('✅ Usuário criado com sucesso!');
    console.log('ID:', user._id);

    // Limpar teste
    console.log('\n🧹 Limpando teste...');
    await User.deleteOne({ _id: user._id });
    console.log('✅ Usuário de teste removido');

    await mongoose.connection.close();
    console.log('\n✅ Teste concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    console.error('Stack:', error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
}

testMongoDB();
