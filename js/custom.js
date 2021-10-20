let base_url = 'https://api.whatsappmorana.com/v1/';
let selectCity = $('#js-city');
let selectUf = $('#js-uf');
let divResults = $('#js-results');
let divInit = $('#js-init');

$(document).ready(function () {
    getLocation();

    selectUf.on('change', function () {
        city()
    })

    selectCity.on('change', function () {
        lojas();
    })
})

function getLocation() {
    let local = localStorage.getItem("local") ?? false;

    if (!local) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        }
    } else {
        init();
    }
}

function showPosition(position) {
    localStorage.setItem('local', `${position.coords.latitude},${position.coords.longitude}`);
    init();
}

function showError(error) {
    if (error) {
        uf();
    }
}

function init() {
    $.ajax({
        url: `${base_url}geo?local=${localStorage.getItem("local")}`,
        type: "GET",
        ajax: true,
        dataType: "JSON",
        success: function (j) {
            uf(j.uf, j.city)
        },
    });
}

function uf(uf, city) {
    $.ajax({
        url: `${base_url}uf`,
        type: "GET",
        ajax: true,
        dataType: "JSON",
        success: function (j) {
            $.each(j, function (i, item) {
                selectUf.append($('<option>', {
                    value: item.uf,
                    text: item.uf
                }));
            });

            if (uf != '') {
                selectUf.val(uf).change();
                $.ajax({
                    url: `${base_url}citys?uf=${uf}`,
                    type: "GET",
                    ajax: true,
                    dataType: "JSON",
                    beforeSend: (jqXHR, settings) => {
                        selectCity.empty().append($('<option>', {
                            value: 'selecione',
                            text: 'Carregando...'
                        }));
                    },
                    success: function (j) {
                        selectCity.append($('<option>', {
                            value: '',
                            text: 'Selecione a cidade'
                        }));
                        $.each(j, function (i, item) {
                            selectCity.append($('<option>', {
                                value: item.cidade,
                                text: item.cidade
                            }));
                        });
                        if (city != '') {
                            selectCity.val(city).change();
                        }
                    },
                    complete: function () {
                        $("#js-city option[value='selecione']").remove();
                    }
                });
            }
        },
    });

}

function clear() {
    divResults.addClass('d-none');
    divInit.removeClass('d-none');
    selectCity.empty().append($('<option>', {
        value: '',
        text: 'Selecione o Estado'
    }));
}

function city(city) {
    if (selectUf.val() != '') {
        divResults.addClass('d-none');
        divInit.removeClass('d-none');
        let uf = selectUf.val();
        $.ajax({
            url: `${base_url}citys?uf=${uf}`,
            type: "GET",
            ajax: true,
            dataType: "JSON",
            beforeSend: (jqXHR, settings) => {
                selectCity.empty().append($('<option>', {
                    value: 'selecione',
                    text: 'Carregando...'
                }));
            },
            success: function (j) {
                selectCity.append($('<option>', {
                    value: '',
                    text: 'Selecione a cidade'
                }));
                $.each(j, function (i, item) {
                    selectCity.append($('<option>', {
                        value: item.cidade,
                        text: item.cidade
                    }));
                });
                if (city != '') {
                    selectCity.val(city).change();
                }
            },
            complete: function () {
                $("#js-city option[value='selecione']").remove();
            }
        });
    } else {
        clear()
    }
}

function lojas() {
    if (selectCity.val() != '') {

        let uf = selectUf.val();
        let city = selectCity.val();
        $.ajax({
            url: `${base_url}lojas?uf=${uf}&city=${city}`,
            type: "GET",
            ajax: true,
            dataType: "JSON",
            beforeSend: (jqXHR, settings) => {

            },
            success: function (j) {
                let html = '';
                $.each(j, function (i, item) {
                    html += `
                <div class="row card-loja appear-animation" data-appear-animation="fadeInUp" data-appear-animation-delay="0">
                    <a class="text-decoration-none">
                        <div class="feature-box custom-feature-box feature-box-style-2">
                            <div class="feature-box-icon">
                                <img src="img/morana.png" alt="">
                            </div>
                            <div class="feature-box-info ms-3">
                                <h4 class="font-weight-normal text-4">${item.nome}</h4>
                                <p class="text-2 mb-1">${item.endereco}</p>
                                <a target="_blank" href="${base_url}lojas/${item.uuid}" class="btn btn-rounded btn-success" style="width: 100%;"><i class="fab fa-whatsapp"></i> Whatsapp</a>
                            </div>
                        </div>
                    </a>
                </div>`
                });
                divResults.html(html);
            },
            complete: function () {
                if ($.isFunction($.fn['themePluginAnimate']) && $('[data-appear-animation]').length) {
                    theme.fn.dynIntObsInit('[data-appear-animation], [data-appear-animation-svg]', 'themePluginAnimate', theme.PluginAnimate.defaults);
                }
                divResults.removeClass('d-none');
                divInit.addClass('d-none');
            }
        });
    }
}