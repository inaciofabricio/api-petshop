const Tabela = require('./TabelaProduto')
const DadosNaoFornecidos = require('../../../erros/DadosNaoFornecidos')
const CampoInvalido = require('../../../erros/CampoInvalido')

class Produto {
    constructor ({ id, titulo, preco, estoque, fornecedor, dataCriacao, dataAtualizacao, versao}) {
        this.id = id
        this.titulo = titulo
        this.preco = preco
        this.estoque = estoque
        this.fornecedor = fornecedor
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao
    }

    validar() {
        if (typeof this.titulo !== 'string' || this.titulo.length === 0) {
            throw new CampoInvalido('titulo')
        }

        if (typeof this.preco !== 'number' || this.preco === 0) {
            throw new CampoInvalido('preco')
        }
    }

    async criar () {
        this.validar()
        const resultados = await Tabela.inserir({
            titulo: this.titulo,
            preco: this.preco,
            estoque:this.estoque,
            fornecedor: this.fornecedor
        })

        this.id = resultados.id
        this.dataCriacao = resultados.dataCriacao
        this.dataAtualizacao = resultados.dataAtualizacao
        this.versao = resultados.versao
    }

    apagar () {
        return Tabela.remover(this.id, this.fornecedor)
    }

    async carregar () {
        const produto = await Tabela.pegarPorId(this.id, this.fornecedor)
        this.titulo = produto.titulo
        this.preco = produto.preco
        this.estoque = produto.estoque
        this.dataCriacao = produto.dataCriacao
        this.dataAtualizacao = produto.dataAtualizacao
        this.versao = produto.versao
    }

    atualizar () {
        // const dadosParaAtualizar = {}
        
        // if (typeof this.titulo == 'string' || this.titulo.length > 0) {
        //     dadosParaAtualizar.titulo = this.titulo
        // }

        // if (typeof this.preco === 'number' || this.preco > 0) {
        //     dadosParaAtualizar.preco = this.preco
        // }

        // if (typeof this.estoque === 'number') {
        //     dadosParaAtualizar.estoque = this.estoque
        // }

        const campos = ['titulo', 'preco', 'estoque']
        const dadosParaAtualizar = {}

        campos.forEach((campo) => {
            const valor = this[campo]
            if(typeof valor === 'string' && valor.length > 0){ 
                dadosParaAtualizar[campo] = valor
            }

            if(typeof valor === 'number'){ 
                dadosParaAtualizar[campo] = valor
            }
        })

        if (Object.keys(dadosParaAtualizar).length === 0){
            throw new DadosNaoFornecidos()
        }

        return Tabela.atualizar(
            {
                id: this.id,
                fornecedor: this.fornecedor
            },
            dadosParaAtualizar
        )
    }

    diminuirEstoque() {
        return Tabela.subtrair(this.id, this.fornecedor, 'estoque', this.estoque)
    }
}

module.exports = Produto