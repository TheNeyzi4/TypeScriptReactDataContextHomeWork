const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const { PrismaClient } = require('@prisma/client')

require('dotenv').config()

const prisma = new PrismaClient();

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.jwtKey
}

module.exports = passport => {
	passport.use(
		new JwtStrategy(options, async (payload, done) => {
			console.log("Payload из токена:", payload);
			try {
				const user = await prisma.user.findUnique({
					where: { id: parseInt(payload.userId) },
					select: {
						id: true,
						email: true,
					},
				})

				console.log("Найденный пользователь:", user)

				if (user) {
					return done(null, user)
				} else {
					return done(null, false)
				}
			} catch (e) {
				console.log("Ошибка при проверке токена:", e)
				done(e, false)
			}
		})
	)
}