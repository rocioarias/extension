(async function () {
    let data = JSON.parse(localStorage.getItem("senasaData")) || [];
    let currentPage = parseInt(localStorage.getItem("senasaCurrentPage")) || 1;
    const localStorageKey = "senasaData";
  
    function extractTableData() {
      const rows = document.querySelectorAll("#formulario\\:datos1 tbody tr");
      return Array.from(rows).map((row) => {
        const cells = row.querySelectorAll("td");
        return {
          certificado: cells[0]?.innerText.trim(),
          nombreComercial: cells[1]?.innerText.trim(),
          nombreFirma: cells[2]?.innerText.trim(),
          propio: cells[3]?.innerText.trim(),
        };
      });
    }
  
    function saveToLocalStorage(data) {
      const existingData = JSON.parse(localStorage.getItem(localStorageKey)) || [];
      const combinedData = existingData.concat(data);
      localStorage.setItem(localStorageKey, JSON.stringify(combinedData));
    }
  
    async function goToNextPage() {
      const nextPageButton = document.querySelector("#formulario\\:datos1\\:nextPage");
      if (nextPageButton) {
        localStorage.setItem("senasaCurrentPage", currentPage + 1);
        nextPageButton.click();
        return true;
      }
      return false;
    }
  
    function downloadCSV() {
      const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];
      const csvContent = [
        ["Certificado", "Nombre Comercial", "Nombre Firma", "Propio"].join(","),
        ...data.map((row) =>
          [row.certificado, row.nombreComercial, row.nombreFirma, row.propio].join(",")
        ),
      ].join("\n");
  
      const blob = new Blob([csvContent], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "senasa_data.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  
    // Scraping automatizado de todas las páginas
    async function scrapePages() {
      const pageData = extractTableData();
      saveToLocalStorage(pageData);
      const hasNextPage = await goToNextPage();
  
      if (!hasNextPage) {
        alert("Análisis completado. Descargando CSV...");
        downloadCSV();
        localStorage.removeItem("senasaData");
        localStorage.removeItem("senasaCurrentPage");
      }
    }
  
    if (window.location.href.includes("buscadorConsultaPublicaInternetProductosCOFIAL")) {
      await scrapePages();
    }
  })();
  