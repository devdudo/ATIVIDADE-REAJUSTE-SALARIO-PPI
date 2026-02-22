import express from 'express';

const host = '0.0.0.0';
const port = 3000;

const server = express();

function calcularReajuste(idade, sexo, salarioBase, anoContrato, matricula) {
    const anoAtual = new Date().getFullYear();
    const tempoEmpresa = anoAtual - anoContrato;

    let percentual = 0;
    let valorExtra = 0;

    if (idade >= 18 && idade <= 39) {
        if (sexo === 'M') {
            percentual = 0.10;
            if (tempoEmpresa <= 10) {
                valorExtra = -10;
            } else {
                valorExtra = 17;
            }
        } else {
            percentual = 0.08;
            if (tempoEmpresa <= 10) {
                valorExtra = -11;
            } else {
                valorExtra = 16;
            }
        }
    } else if (idade >= 40 && idade <= 69) {
        if (sexo === 'M') {
            percentual = 0.08;
            if (tempoEmpresa <= 10) {
                valorExtra = -5;
            } else {
                valorExtra = 15;
            }
        } else {
            percentual = 0.10;
            if (tempoEmpresa <= 10) {
                valorExtra = -7;
            } else {
                valorExtra = 14;
            }
        }
    } else if (idade >= 70 && idade <= 99) {
        if (sexo === 'M') {
            percentual = 0.15;
            if (tempoEmpresa <= 10) {
                valorExtra = -15;
            } else {
                valorExtra = 13;
            }
        } else {
            percentual = 0.17;
            if (tempoEmpresa <= 10) {
                valorExtra = -17;
            } else {
                valorExtra = 12;
            }
        }
    } else {
        return null;
    }

    const salarioReajustado = salarioBase + (salarioBase * percentual);
    const novoSalario = salarioReajustado + valorExtra;

    return {
        tempoEmpresa,
        percentual,
        valorExtra,
        novoSalario
    };
}

server.get('/', (req, res) => {
    res.send(`
        <h1>Calculadora de Reajuste Salarial</h1>
        <p>Para calcular o reajuste do seu salário, acesse a URL com os seguintes parâmetros:</p>
        <ul>
            <li><strong>idade</strong> (maior que 16)</li>
            <li><strong>sexo</strong> (M ou F)</li>
            <li><strong>salariobase</strong> (número real maior que 0)</li>
            <li><strong>anocontrato</strong> (inteiro maior que 1960)</li>
            <li><strong>matricula</strong> (inteiro maior que 0)</li>
        </ul>
        <p>Exemplo de uso:</p>
        <p><code>http://localhost:3000/reajuste?idade=18&sexo=F&salariobase=1700&anocontrato=2014&matricula=12345</code></p>
    `);
});

server.get('/reajuste', (req, res) => {
    const idade = parseInt(req.query.idade);
    const sexo = req.query.sexo;
    const salariobase = parseFloat(req.query.salariobase);
    const anocontrato = parseInt(req.query.anocontrato);
    const matricula = parseInt(req.query.matricula);

    if (
        isNaN(idade) || idade <= 16 ||
        (sexo !== 'M' && sexo !== 'F') ||
        isNaN(salariobase) || salariobase <= 0 ||
        isNaN(anocontrato) || anocontrato <= 1960 ||
        isNaN(matricula) || matricula <= 0
    ) {
        res.send(`
            <h2>Erro: Dados inválidos!</h2>
            <p>Não foi possível calcular o reajuste. Verifique se os parâmetros informados estão corretos.</p>
        `);
        return;
    }

    const resultado = calcularReajuste(idade, sexo, salariobase, anocontrato, matricula);

    if (!resultado) {
        res.send(`<h2>Erro: Idade fora da faixa permitida (18 a 99 anos).</h2>`);
        return;
    }

    res.send(`
        <h1>Resultado do Reajuste Salarial</h1>
        <p><strong>Matrícula:</strong> ${matricula}</p>
        <p><strong>Idade:</strong> ${idade}</p>
        <p><strong>Sexo:</strong> ${sexo}</p>
        <p><strong>Salário Base:</strong> R$ ${salariobase.toFixed(2)}</p>
        <p><strong>Ano de Contratação:</strong> ${anocontrato}</p>
        <p><strong>Tempo de Empresa:</strong> ${resultado.tempoEmpresa} anos</p>
        <p><strong>Percentual aplicado:</strong> ${resultado.percentual * 100}%</p>
        <p><strong>${resultado.valorExtra >= 0 ? 'Acréscimo' : 'Desconto'}:</strong> R$ ${Math.abs(resultado.valorExtra).toFixed(2)}</p>
        <h2 style="color:green;">Novo Salário: R$ ${resultado.novoSalario.toFixed(2)}</h2>
    `);
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});