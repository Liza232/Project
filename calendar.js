$(document).ready(function () {
    // Инициализация календаря
    var selectedDate;
    $('#calendar').datepicker({
        format: "dd.mm.yyyy", // Формат даты
        todayBtn: "linked",
        language: "ru", // Язык календаря
        autoclose: true,
        todayHighlight: true,
        orientation: "bottom auto",
        onSelect: function(date) {
            selectedDate = date;
            console.log("Выбранная дата: " + selectedDate);
        }
    });
});
