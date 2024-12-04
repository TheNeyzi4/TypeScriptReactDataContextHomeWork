const errorHandler = require("../utils/errorHandler")
const jwt = require("jsonwebtoken")

const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient();

module.exports.getAll = async (req, res) => {
	try {
		const users = await prisma.user.findMany();

		if (users.length === 0) {
			return res.status(404).json({ message: 'Нет пользователей' });
		}

		return res.status(200).json(users)
	} catch (e) {
		errorHandler(res, 500, e)
	}
}

module.exports.getById = async (req, res) => {
	try {
		const userId = await prisma.user.findUnique({
			where: {
				id: parseInt(req.params.id)
			}
		})
		console.log(userId)

		if (userId) {
			res.status(200).json(userId)
		} else {
			errorHandler(res, 500, 'error')
		}
	} catch (e) {
		errorHandler(res, 404, e)
	}
}

module.exports.update = async (req, res) => {
	try {

		const updatedUser = await prisma.user.update({
			where: {
				id: parseInt(req.params.id),
			},
			data: {
				email: req.body.email,
			},
		});

		res.status(200).json(updatedUser)
	} catch (e) {
		errorHandler(res, 500, e)
	}
}

module.exports.getByEmail = async (req, res) => {
	try {
		const userEmail = await prisma.user.findUnique({
			where: {
				id: req.body.email
			}
		})

		if (userEmail) {
			res.status(200).json(userEmail)
		} else {
			errorHandler(res, 500, 'error')
		}
	} catch (e) {
		errorHandler(res, 404, e)
	}
}