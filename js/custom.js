let base_url = 'https://api.whatsappmorana.com/v1/';

$(document).ready(function () {
    $.ajax({
        url: `${base_url}get`,
        type: "GET",
        ajax: true,
        dataType: "JSON",
        beforeSend: (jqXHR, settings) => { },
        success: function (j) {
            console.log(j)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error(errorThrown);
        },
        complete: function () { },
    });
})