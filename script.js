let transacoes = [];

// Recupera transações salvas no localStorage
const transacoesSalvas = JSON.parse(localStorage.getItem("transacoes"));
if (transacoesSalvas) {
  transacoes = transacoesSalvas;
  atualizarInterface();
}

function adicionarTransacao() {
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;
  const data = document.getElementById("data").value;

  if (!descricao || isNaN(valor) || !data) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  transacoes.push({ descricao, valor, tipo, data });

  // Salva no localStorage
  localStorage.setItem("transacoes", JSON.stringify(transacoes));

  atualizarInterface();
  limparCampos();
}

function atualizarInterface() {
  const lista = document.getElementById("listaTransacoes");
  lista.innerHTML = "";

  let totalEntradas = 0;
  let totalSaidas = 0;

  transacoes.forEach((t, index) => {
    const item = document.createElement("div");
    item.innerHTML = `${t.descricao} - R$ ${t.valor.toFixed(2)} - ${t.tipo} - ${t.data}`;
    
    const btn = document.createElement("button");
    btn.textContent = "Remover";
    btn.onclick = () => removerTransacao(index);
    item.appendChild(btn);

    lista.appendChild(item);

    if (t.tipo === "entrada") totalEntradas += t.valor;
    else totalSaidas += t.valor;
  });

  document.getElementById("totalEntradas").innerText = `R$ ${totalEntradas.toFixed(2)}`;
  document.getElementById("totalSaidas").innerText = `R$ ${totalSaidas.toFixed(2)}`;
  document.getElementById("saldoFinal").innerText = `R$ ${(totalEntradas - totalSaidas).toFixed(2)}`;

  atualizarGrafico(totalEntradas, totalSaidas);
}

function removerTransacao(index) {
  transacoes.splice(index, 1);
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  atualizarInterface();
}

function limparCampos() {
  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("data").value = "";
}

let grafico;
function atualizarGrafico(entrada, saida) {
  const ctx = document.getElementById('grafico').getContext('2d');

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Entradas', 'Saídas'],
      datasets: [{
        data: [entrada, saida],
        backgroundColor: ['#00ff88', '#ff4b4b'],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        },
        tooltip: {
          bodyColor: '#fff',
          titleColor: '#ffcc00'
        }
      }
    }
  });
}

function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Relatório Financeiro - SaveMoney", 20, 20);

  transacoes.forEach((t, i) => {
    const y = 30 + i * 10;
    doc.text(`${t.descricao} | ${t.tipo} | R$ ${t.valor.toFixed(2)} | ${t.data}`, 20, y);
  });

  doc.save("relatorio-financeiro.pdf");
}

function exportarExcel() {
  const worksheet = XLSX.utils.json_to_sheet(transacoes);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transações");
  XLSX.writeFile(workbook, "relatorio-financeiro.xlsx");
}
