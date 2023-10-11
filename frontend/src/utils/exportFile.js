import * as XLSX from "xlsx"

// Функция для экспорта отчёта
function exportToExcel(data) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, "LibraryReports.xlsx");
}

export default exportToExcel;
