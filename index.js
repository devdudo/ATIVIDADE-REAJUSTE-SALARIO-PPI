import express from 'express';

const host = '0.0.0.0';
const port = 3000;

const server = express();

server.get('/', (req, res) => {
  res.send('Página Inicial');
});

function calcularReajuste(idade, sexo, salariobase, anocontrato) {

    const anoAtual = new Date().getFullYear();
    const tempoEmpresa = anoAtual - anocontrato;

    let percentual = 0;
    let valorExtra = 0;

    if (idade >= 18 && idade <= 39) {

        if (sexo === 'M') {
            percentual = 0.10;
            valorExtra = tempoEmpresa <= 10 ? -10 : 17;
        } else {
            percentual = 0.08;
            valorExtra = tempoEmpresa <= 10 ? -11 : 16;
        }

    } else if (idade >= 40 && idade <= 69) {

        if (sexo === 'M') {
            percentual = 0.08;
            valorExtra = tempoEmpresa <= 10 ? -5 : 15;
        } else {
            percentual = 0.10;
            valorExtra = tempoEmpresa <= 10 ? -7 : 14;
        }

    } else if (idade >= 70 && idade <= 99) {

        if (sexo === 'M') {
            percentual = 0.15;
            valorExtra = tempoEmpresa <= 10 ? -15 : 13;
        } else {
            percentual = 0.17;
            valorExtra = tempoEmpresa <= 10 ? -17 : 12;
        }

    } else {
        return null; // idade inválida
    }

    const salarioReajustado = salariobase + (salariobase * percentual);
    const novoSalario = salarioReajustado + valorExtra;

    return {
        tempoEmpresa,
        percentual,
        valorExtra,
        novoSalario
    };
}

server.get('/reajuste', (req, res) => {

    const idade = parseInt(req.query.idade);
    const sexo = req.query.sexo;
    const salariobase = parseFloat(req.query.salariobase);
    const anocontrato = parseInt(req.query.anocontrato);
    const matricula = parseInt(req.query.matricula);

    if (
        !isNaN(idade) &&
        (sexo === 'M' || sexo === 'F') &&
        !isNaN(salariobase) &&
        !isNaN(anocontrato) &&
        !isNaN(matricula)
    ) {

        const resultado = calcularReajuste(
            idade,
            sexo,
            salariobase,
            anocontrato
        );

        if (resultado) {
            res.send(`
                Matrícula: ${matricula} <br>
                Tempo de empresa: ${resultado.tempoEmpresa} anos <br>
                Percentual: ${resultado.percentual * 100}% <br>
                Valor extra: ${resultado.valorExtra} <br>
                Novo salário: R$ ${resultado.novoSalario.toFixed(2)}
            `);
        } else {
            res.send("Idade fora da faixa permitida.");
        }

    } else {
        res.send("Erro: Informe todos os dados corretamente via URL.");
    }
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});