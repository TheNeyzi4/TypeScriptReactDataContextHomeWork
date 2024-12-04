module.exports = (res, codeError, error = "Error") => {
	res.status(codeError).json({
		success: false,
		message: error.message ? error.message : error
	})
}