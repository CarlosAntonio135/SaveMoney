document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("userName").textContent = usuarioLogado.nome || "Usuário";
  document.getElementById("userEmail").textContent = usuarioLogado.email || "Email";

  const perfilBtn = document.getElementById("perfilBtn");
  const perfilModal = document.getElementById("perfilModal");
  const fecharModal = document.getElementById("fecharModal");
  const logoutBtn = document.getElementById("logoutBtn");

  perfilBtn.addEventListener("click", () => {
    perfilModal.style.display = "block";
  });

  fecharModal.addEventListener("click", () => {
    perfilModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === perfilModal) {
      perfilModal.style.display = "none";
    }
  });

  import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js").then(({ signOut }) => {
    import("./firebaseConfig.js").then(({ auth }) => {
      logoutBtn.addEventListener("click", async () => {
        try {
          await signOut(auth);
          localStorage.removeItem("usuarioLogado");
          window.location.href = "login.html";
        } catch (error) {
          alert("Erro ao sair: " + error.message);
        }
      });
    });
  });

  const listaTransacoes = document.getElementById("listaTransacoes");
  const totalEntradas = document.getElementById("totalEntradas");
  const totalSaidas = document.getElementById("totalSaidas");
  const saldoFinal = document.getElementById("saldoFinal");

  let transacoes = JSON.parse(localStorage.getItem(`transacoes_${usuarioLogado.email}`)) || [];

  function salvarTransacoes() {
    localStorage.setItem(`transacoes_${usuarioLogado.email}`, JSON.stringify(transacoes));
  }

  function atualizarResumo() {
    let entradas = 0, saidas = 0;

    transacoes.forEach(t => {
      if (t.tipo === "entrada") {
        entradas += t.valor;
      } else {
        saidas += t.valor;
      }
    });

    totalEntradas.textContent = `R$ ${entradas.toFixed(2)}`;
    totalSaidas.textContent = `R$ ${saidas.toFixed(2)}`;
    saldoFinal.textContent = `R$ ${(entradas - saidas).toFixed(2)}`;
  }

  function renderizarTransacoes() {
    listaTransacoes.innerHTML = "";
    transacoes.forEach((t, i) => {
      const div = document.createElement("div");
      div.textContent = `${t.data} - ${t.tipo} - ${t.descricao}: R$ ${t.valor.toFixed(2)}`;
      listaTransacoes.appendChild(div);
    });
    atualizarResumo();
    atualizarGrafico();
  }

  window.adicionarTransacao = () => {
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;
    const data = document.getElementById("data").value;

    if (!descricao || isNaN(valor) || !data) {
      alert("Preencha todos os campos!");
      return;
    }

    transacoes.push({ descricao, valor, tipo, data });
    salvarTransacoes();
    renderizarTransacoes();

    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("data").value = "";
  };

  window.exportarPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Relatório Financeiro", 10, 10);
    transacoes.forEach((t, i) => {
      doc.text(`${t.data} - ${t.tipo} - ${t.descricao}: R$ ${t.valor.toFixed(2)}`, 10, 20 + i * 10);
    });
    doc.save("relatorio.pdf");
  };

  window.exportarExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [["Data", "Tipo", "Descrição", "Valor"]];
    transacoes.forEach(t => {
      ws_data.push([t.data, t.tipo, t.descricao, t.valor]);
    });
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, "Transações");
    XLSX.writeFile(wb, "relatorio.xlsx");
  };

  let grafico;
  function atualizarGrafico() {
    const ctx = document.getElementById("grafico").getContext("2d");
    const entradas = transacoes.filter(t => t.tipo === "entrada").reduce((s, t) => s + t.valor, 0);
    const saidas = transacoes.filter(t => t.tipo === "saida").reduce((s, t) => s + t.valor, 0);

    if (grafico) grafico.destroy();
    grafico = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Entradas", "Saídas"],
        datasets: [{
          data: [entradas, saidas],
          backgroundColor: ["#4caf50", "#f44336"]
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: { color: "#fff" }
          }
        }
      }
    });
  }

  renderizarTransacoes();

  window.limparHistorico = () => {
    if (confirm("Tem certeza que deseja apagar todo o histórico de transações?")) {
      transacoes = [];
      salvarTransacoes();
      renderizarTransacoes();
    }
  };
});
