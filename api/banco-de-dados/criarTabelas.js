const Modeltabela = require('../rotas/fornecedores/ModeloTabelaFornecedor')

Modeltabela
    .sync()
    .then(() => console.log('Tabela criada com sucesso'))
    .catch(console.log)