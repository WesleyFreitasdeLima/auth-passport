const bcrypt = require('bcryptjs');

function createUser(username, password, email, profile, callback) {
    const cryptoPassword = bcrypt.hashSync(password, 10);
    DB.collection('users')
        .insertOne({
            username, password: cryptoPassword, email, profile
        }, callback);
}

function resetPassword(email, callback) {
    const utils = require('./utils');
    const newPassword = utils.generatePassword();
    const cryptoPassword = bcrypt.hashSync(newPassword, 10);
    DB.collection('users')
        .updateOne({
            email: email
        }, {
            $set: {
                password: cryptoPassword
            }
        }, (err, resp) => {
            return callback(err, resp, newPassword);
        });
}

function countAllUsers(callback) {
    DB.collection('users')
        .find()
        .count(callback);
}

const limiteElementosPorPagina = 2;
function findAllUsers(pagina, callback) {
    const posicaoInicialCursorElementos = parseInt(pagina - 1);
    const posicaoFinalCursorElementos = posicaoInicialCursorElementos * limiteElementosPorPagina;

    DB.collection('users')
        .find()
        .skip(posicaoFinalCursorElementos) // Ignora os elementos com index após o final do cursor
        .limit(limiteElementosPorPagina) // Limite o resultado da consulta
        .toArray(callback);
}

module.exports = {
    createUser,
    resetPassword,
    findAllUsers,
    countAllUsers,
    limiteElementosPorPagina
}