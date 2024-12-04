const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const errorHandler = require("../utils/errorHandler")
const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const app = express();
app.use(express.json());
const prisma = new PrismaClient();

module.exports.login = async (req, res) => {
	const userDb = await prisma.user.findUnique({
		where: {
			email: req.body.email
		}
	})

	if (userDb) {
		const isRulePassw = bcrypt.compareSync(req.body.password, userDb.password)

		if (isRulePassw) {
			const token = jwt.sign({
				email: userDb.email,
				userId: userDb.id
			}, process.env.jwtKey, { expiresIn: 60 * 60 * 2 });

			return res.json({ token });
		} else {
			errorHandler(res, 401)
		}
	}

}

module.exports.register = async (req, res) => {
	console.log(req.body)

	const userDb = await prisma.user.findUnique({
		where: {
			email: req.body.email
		}
	})

	if (userDb) {
		res.status(409).json({
			error: 'Користувач з таким email вже існує'
		})
	} else {
		const salt = bcrypt.genSaltSync(777)
		const passw = bcrypt.hashSync(req.body.password, salt)

		const newUser = await prisma.user.create({
			data: {
				email: req.body.email,
				password: passw,
			}
		})

		try {
			const token = jwt.sign({
				email: newUser.email,
				userId: newUser.id
			}, process.env.jwtKey, { expiresIn: '1h' });

			res.status(201).json({ token })
		} catch (e) {
			errorHandler(res, 500)
		}
	}

}