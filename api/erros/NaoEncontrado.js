class NaoEncontrado extends Error {
    constructor (tipo) {
        super(`${tipo} não foi encontrado!`)
        this.name = 'NaoEncontrado'
        this.idErro = 0
    }
}

module.exports = NaoEncontrado