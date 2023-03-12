$(document).ready(function() {
    // Define a URL do arquivo CSV
    var url = "data.csv";

    // Carrega o arquivo CSV com o AJAX
    $.get(url, function(data) {
        // Converte o arquivo CSV em um objeto JSON
        var jsonData = $.csv.toObjects(data);

        // Adiciona os dados na tabela
        var table = $('#myTable').DataTable({
            data: jsonData,
            columns: [],
            order: [[0, 'asc']],
            initComplete: function () {
                // Adiciona filtros dinâmicos
                this.api().columns().every(function () {
                    var column = this;
                    var select = $('<select><option value=""></option></select>')
                        .appendTo($(column.header()))
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .search(val ? '^' + val + '$' : '', true, false)
                                .draw();
                        });
                    column.data().unique().sort().each(function (d, j) {
                        select.append('<option value="' + d + '">' + d + '</option>')
                    });
                });
            }
        });

        // Define as colunas dinamicamente
        $.each(jsonData[0], function(key, value) {
            table.column({
                "data": key,
                "title": key
            }).visible(true);
        });
    });
});
