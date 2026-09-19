function doGet(e) {
  try {
    // 1. Forzar a Google a consolidar cualquier cambio pendiente en la memoria viva (0 delay)
    SpreadsheetApp.flush();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Función auxiliar para extraer datos crudos como matriz
    function getSheetData(sheetName) {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) return [];
      const data = sheet.getDataRange().getValues();
      return Array.isArray(data) ? data : [];
    }

    const payload = {
      status: "success",
      timestamp: new Date().toISOString(),
      version: Date.now(),
      data: {
        productos: getSheetData("Productos"),
        categorias: getSheetData("Categorias"),
        configuracion: getSheetData("Configuracion"),
        banners: getSheetData("Banners"),
        resenas: getSheetData("Resenas"),
        faq: getSheetData("FAQ")
      }
    };

    // 2. Retornar JSON con ContentService
    return ContentService.createTextOutput(JSON.stringify(payload))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    const errorPayload = {
      status: "error",
      message: err.toString(),
      timestamp: new Date().toISOString()
    };
    return ContentService.createTextOutput(JSON.stringify(errorPayload))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
