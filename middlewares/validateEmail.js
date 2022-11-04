module.exports = (req, res, next) => {
    const { email } = req.body;
    const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (email === undefined) {
        return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }

    if (!isEmail.test(email)) {
        return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    }

    return next();
};