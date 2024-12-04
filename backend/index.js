const express = require("express");
const passport = require("passport")
const cors = require('cors')

const authController = require('./routes/auth.routes')
const userController = require('./routes/user.routes')

require('dotenv').config()
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройки CORS для разрешения запросов с клиента
app.use(cors({
	origin: 'http://localhost:3000', // адрес фронтенда
	credentials: true                // разрешение кросс-доменных cookie
}));

app.use(passport.initialize())
require('./middleware/passport.middleware')(passport)

app.use('/api/auth', authController)
app.use('/api/user', userController)

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));