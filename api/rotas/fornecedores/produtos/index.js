const roteador = require('express').Router({ mergeParams: true })
const TabelaProduto = require('./TabelaProduto')
const Produto = require('./Produto')
const SerializadorProduto = require('../../../Serializador').SerializadorProduto

roteador.get('/', async (requisicao, resposta) => {
    const produtos = await TabelaProduto.listar(requisicao.fornecedor.id)
    resposta.status(200)
    const serializador = new SerializadorProduto(resposta.getHeader('Content-Type'))
    resposta.send(serializador.serializar(produtos))
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try {
        const idFornecedor = requisicao.fornecedor.id
        const corpo = requisicao.body
        const dados = Object.assign({}, corpo, { fornecedor: idFornecedor })
        const produto = new Produto(dados)
        await produto.criar()
        resposta.status(201)
        const serializador = new SerializadorProduto(resposta.getHeader('Content-Type'))
        resposta.send(serializador.serializar(produto))
    } catch (erro) {
        proximo(erro)
    }
})

roteador.delete('/:id', async (requisicao, resposta, proximo) => {
    const dados = {
        id : requisicao.params.id,
        fornecedor : requisicao.fornecedor.id
    }
    const produto = new Produto(dados)
    await produto.apagar()
    resposta.status(204)
    resposta.end()    
})

roteador.get('/:id', async (requisicao, resposta, proximo) => {
    try {
        const dados = {
            id : requisicao.params.id,
            fornecedor : requisicao.fornecedor.id
        }
        const produto = new Produto(dados)
        await produto.carregar()
        resposta.status(200)
        const serializador = new SerializadorProduto(resposta.getHeader('Content-Type'),['preco','estoque','fornecedor','dataCriacao','dataAtualizacao','versao'])
        resposta.send(serializador.serializar(produto))
    } catch (erro) {
        proximo(erro)
    }
})

roteador.put('/:id', async (requisicao, resposta, proximo) => {
    try {
        const corpo = requisicao.body
        const dados = Object.assign({}, corpo, { id : requisicao.params.id, fornecedor : requisicao.fornecedor.id })
        const produto = new Produto(dados)
        await produto.atualizar()
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

roteador.post('/:id/diminuir-estoque', async (requisicao, resposta, proximo) => {
    try {
        const produto = new Produto({
            id : requisicao.params.id, 
            fornecedor : requisicao.fornecedor.id
        })
        await produto.carregar()
        produto.estoque = produto.estoque - requisicao.body.quantidade
        await produto.diminuirEstoque()
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

module.exports = roteador