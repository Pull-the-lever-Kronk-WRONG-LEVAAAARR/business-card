// Подставка шаблона для формата листа
function insertListFormat() {
    const container = document.querySelector("#list-format");
    let list_content = container.querySelectorAll('.content')
    if (list_content !== null) {
        // данные о формате листа
        let sheet_w = document.querySelector('#sheet-w')
        let sheet_h = document.querySelector('#sheet-h')

        let list_formats_json = '[{ "name": "A2", "height": 420, "width": 594  }, { "name": "A3",  "height": 297, "width": 420},  {"name": "A4", "height": 210, "width": 297 }]';

        // переменная list_formats - это объект JavaScript, который получен путём парсинга строки JSON
        let list_formats = JSON.parse(list_formats_json);

        const controller = new AbortController();
        list_content.forEach(element => {
            let listener = function () {
                let idTemplate = element.querySelector('input').value
                switch (idTemplate) {
                    case '0': {
                        sheet_w.value = list_formats[0].width
                        sheet_h.value = list_formats[0].height
                        break;
                    }
                    case '1': {
                        sheet_w.value = list_formats[1].width
                        sheet_h.value = list_formats[1].height
                        break;
                    }
                    case '2': {
                        sheet_w.value = list_formats[2].width
                        sheet_h.value = list_formats[2].height
                        break;
                    }
                }
                console.log(idTemplate)
                controller.abort()
            }
            element.addEventListener('click', listener, { signal: controller.signal });
        });
    } else {
        console.log("NULL")
    }
}

// Подставка шаблона для формата визитки
function insertCardFormat() {

    const container = document.querySelector("#card-format");
    let list_content = container.querySelectorAll('.content')
    if (list_content !== null) {
        //данные о размерах визитки после обрезки
        let cutaway_w = document.querySelector('#cutaway-w')
        let cutaway_h = document.querySelector('#cutaway-h')

        let list_formats_json = '[{ "name": "F1", "height": 55, "width": 85  }, { "name": "F2",  "height": 55, "width": 90},  {"name": "F3", "height": 50, "width": 90 }, {"name": "F4", "height": 55, "width": 98 }]';

        // переменная card_format - это объект JavaScript, который получен путём парсинга строки JSON
        let card_format = JSON.parse(list_formats_json);

        const controller = new AbortController();
        list_content.forEach(element => {
            let listener = function () {
                let idTemplate = element.querySelector('input').value
                switch (idTemplate) {
                    case '0': {
                        cutaway_w.value = card_format[0].width
                        cutaway_h.value = card_format[0].height
                        break;
                    }
                    case '1': {
                        cutaway_w.value = card_format[1].width
                        cutaway_h.value = card_format[1].height
                        break;
                    }
                    case '2': {
                        cutaway_w.value = card_format[2].width
                        cutaway_h.value = card_format[2].height
                        break;
                    }
                    case '3': {
                        cutaway_w.value = card_format[3].width
                        cutaway_h.value = card_format[3].height
                        break;
                    }
                }
                console.log(idTemplate)
                controller.abort()
            }
            element.addEventListener('click', listener, { signal: controller.signal });
        });
    } else {
        console.log("NULL")
    }
}

//Поворот стрелки при нажатии на кнопку выбора шаблона формата листа
let arrow_list_format = document.querySelector('#arrow-list-format')
let btn_list_format = document.querySelector('#btn-list-format')
btn_list_format.onclick = function () {
    arrow_list_format.classList.toggle('transform')
}

//Поворот стрелки при нажатии на кнопку выбора шаблона формата визитки
let arrow_card_format = document.querySelector('#arrow-card-format')
let btn_card_format = document.querySelector('#btn-card-format')
btn_card_format.onclick = function () {
    arrow_card_format.classList.toggle('transform')
}


//Скролл до справки при нажатии на кнопку
const anchors = document.querySelectorAll('a[href*="#"]')
for (let anchor of anchors) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault()

        const blockID = anchor.getAttribute('href').substr(1)

        document.getElementById(blockID).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    })
}


//Отобразить выпадающее меню для формата листа
function initialiseListFormat() {
    //есть хмл пустой, то не открывать список иначе то что внизу и 
    // создать 
    //foreach для всех объектов хмл {content = "<div>" + object[0] + "</div>" -- формирование строки с заполнением значений 
    // для объекта }
    let dropdown_content = document.querySelector('.dropdown-content')
    dropdown_content.classList.toggle('active-dropdown')
    insertListFormat()
}

//Отобразить выпадающее меню для формата визитки
function initialiseCardFormat() {
    let dropdown_content = document.querySelector("#card-format")
    dropdown_content.classList.toggle('active-dropdown')
    insertCardFormat()
}