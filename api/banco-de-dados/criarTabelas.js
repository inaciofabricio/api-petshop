const modelos = [
    require('../rotas/fornecedores/ModeloTabelaFornecedor'),
    require('../rotas/fornecedores/produtos/ModeloTabelaProduto')
]

async function criaTabelas () {
    for (let index = 0; index < modelos.length; index++) {
        const modelo = modelos[index]
        await modelo.sync()
                .then(() => console.log('Tabela criada com sucesso'))
                .catch(console.log)
        
    }
}

criaTabelas ()
