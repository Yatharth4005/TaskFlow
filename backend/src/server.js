const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 TaskFlow Backend Server is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔒 Authentication: Session-based with bcrypt`);
  console.log(`👥 Preloaded Users:`);
  console.log(`   - Admin: admin / Admin@123`);
  console.log(`   - User:  piyush / User@123`);
  console.log(`   - User:  rahul / User@123`);
  console.log(`   - User:  amit / User@123`);
  console.log(`===============================================`);
});

