//константы для размеров листа
const MAX_SHEET = 2000
const MIN_SHEET = 210

//константы для размеров полей листа
const MAX_PADDING = 50 
const MIN_PADDING = 2


//константы для размеров вылетов и размерах визитки
const MAX_CUTAWAY = 210
const MIN_CUTAWAY = 50

let total_box = document.querySelector('.total > h2') //количество визиток
let warningForList = document.querySelector('.warning') //предупреждение об ошибке в блоке с вводом полей
let total_lists = document.querySelector('.total-sheet > h2') //предупреждение об ошибке в блоке с вводом полей

//блоки элементов для примения к ним стилей при наличии ошибки ввода
let sheet_w_block = document.getElementById('sheet-w')
let sheet_h_block = document.getElementById('sheet-h')
let sheet_l_block = document.getElementById('sheet-l')
let sheet_d_block = document.getElementById('sheet-d')
let sheet_u_block = document.getElementById('sheet-u')
let sheet_r_block = document.getElementById('sheet-r')
let cutaway_w_block = document.getElementById('cutaway-w')
let cutaway_h_block = document.getElementById('cutaway-h')
let cutaway_f_block = document.getElementById('cutaway-f')
let run_block = document.getElementById('run-block') //Блок для ввода тиража

const units = document.querySelectorAll('input[name="units"]') //радиокнопки выбора единиц измерения

let total = 0 // всего визиток в печатном листе

let c = document.getElementById("canvas"); // canvas, визуализация раскладки
let ctx = c.getContext("2d");

function calcSize() {
    // данные о формате листа
    let sheet_w = Number(parseFloat(document.querySelector('#sheet-w').value).toFixed(1))
    let sheet_h = Number(parseFloat(document.querySelector('#sheet-h').value).toFixed(1))

    //данные о полях
    let sheet_u = Number(parseFloat(document.querySelector('#sheet-u').value).toFixed(1))
    let sheet_r = Number(parseFloat(document.querySelector('#sheet-r').value).toFixed(1))
    let sheet_d = Number(parseFloat(document.querySelector('#sheet-d').value).toFixed(1))
    let sheet_l = Number(parseFloat(document.querySelector('#sheet-l').value).toFixed(1))

    //данные о размерах визитки после обрезки
    let cutaway_w = Number(parseFloat(document.querySelector('#cutaway-w').value).toFixed(1))
    let cutaway_h = Number(parseFloat(document.querySelector('#cutaway-h').value).toFixed(1))
    let cutaway_f = Number(parseFloat(document.querySelector('#cutaway-f').value).toFixed(1))

    let fin_sheet_w = sheet_w - sheet_r - sheet_l // размер печатной области по ширине
    let fin_sheet_h = sheet_h - sheet_u - sheet_d // размер печатной области по высоте
    let fin_cutaway_w = cutaway_w + 2 * cutaway_f // размер макета визитки с полями по ширине
    let fin_cutaway_h = cutaway_h + 2 * cutaway_f // размер макета визитки с полями по высоте
    let total_row = 0 // количество визиток по горизонтали
    let total_column = 0 // количество визиток по вертикали

    console.log('height ', sheet_h)

    //если данные введены верно, расчет количества визиток
    if (checkInput(sheet_w, sheet_h, sheet_u, sheet_d, sheet_r, sheet_l, cutaway_w, cutaway_h, cutaway_f)) {
        if (fin_cutaway_w > 0 && fin_cutaway_h > 0) {
            // поиск наиболее выгодного использования пространства
            // сохранение промежуточных результатов во временные переменные,
            // необходимых для нахождения наибольшей произведения total = total_row * total_column
            //округление до меньшего, т.к. это физический объект
            let temp_row_ww = Math.floor(fin_sheet_w / fin_cutaway_w)
            let temp_row_wh = Math.floor(fin_sheet_w / fin_cutaway_h)
            let temp_column_hh = Math.floor(fin_sheet_h / fin_cutaway_h)
            let temp_column_hw = Math.floor(fin_sheet_h / fin_cutaway_w)
            // возможны следующие комбинации, т.к. величина не может использоваться два раза:
            // temp_row_ww * temp_column_hh
            // temp_row_wh * temp_column_hw
            let temp_total_ww_hh = temp_row_ww * temp_column_hh
            let temp_total_wh_hw = temp_row_wh * temp_column_hw
            if (temp_total_ww_hh >= temp_total_wh_hw) {
                total_row = temp_row_ww
                total_column = temp_column_hh
                total = temp_total_ww_hh
            } else {
                total_row = temp_row_wh
                total_column = temp_column_hw
                total = temp_total_wh_hw
                // cutaway_w и cutaway_h меняются значениями, т.о., получается "вертикальная" раскладка
                let temp = cutaway_w
                cutaway_w = cutaway_h
                cutaway_h = temp
            }
        }

        if (total > 0) {
            // если значение больше 0, то вывод в блок .total
            total_box.innerText = total
            console.log('total: ' + total)
            //подсчет количества листов
            let run = document.querySelector('#run') //введенный тираж
            run.addEventListener('change', function () {
                let runL = Number(parseInt(run.value)) //введенный тираж
                if (checkInputRun(runL) == true) {
                    if (runL <= total) {
                        total_lists.innerHTML = 1;
                    }
                    else if (runL > total) {
                        console.log(Math.ceil(runL / total))
                        //округление в большую сторону, так как листы - физические объекты
                        total_lists.innerHTML = Math.ceil(runL / total);
                    }
                    warningForList.innerHTML = "" //нет ошибки
                }
            });
            // новые размеры canvas и блока
            resizePreview(sheet_w, sheet_h, sheet_u, sheet_d, sheet_l, sheet_r)
            // if (units[1].checked === true) {
            //     cutaway_w *= 10
            //     cutaway_h *= 10
            //     cutaway_f *= 10
            // }
            visualize(cutaway_w, cutaway_h, cutaway_f, total_row, total_column)
            warningForList.innerHTML = "" //нет ошибки
        } else {
            console.log('Недостаточно данных')
        }
    }
    else {
        //если ошибка ввода данных
        total_box.innerText = "0"
    }
}

function checkInput(sheet_w, sheet_h, sheet_u, sheet_d, sheet_r, sheet_l, cutaway_w, cutaway_h, cutaway_f) {
    let coef = 1 //коэффициент для перехода от мм к см 
    // проверка на соответствие единицам измерения
    if (units[0].checked === true) {
        // если работа с мм
        if (!((/^[\d]+$/g).test(sheet_w) && (/^[\d]+$/g).test(sheet_h) && (/^[\d]+$/g).test(sheet_u) &&
            (/^[\d]+$/g).test(sheet_d) && (/^[\d]+$/g).test(sheet_r) && (/^[\d]+$/g).test(sheet_l) &&
            (/^[\d]+$/g).test(cutaway_w) && (/^[\d]+$/g).test(cutaway_h) && (/^[\d]+$/g).test(cutaway_f))) {
            warningForList.innerHTML = "Числа с плавающей точкой будут округлены до целых"
            return false
        }
        else {
            warningForList.innerHTML = ""
        }
    } else if (units[1].checked === true) {
        if (!((/^[\d]+(\.|,)?[\d]?$/g).test(sheet_w) && (/^[\d]+(\.|,)?[\d]?$/g).test(sheet_h) && (/^[\d]+(\.|,)?[\d]?$/g).test(sheet_u) &&
            (/^[\d]+(\.|,)?[\d]?$/g).test(sheet_d) && (/^[\d]+(\.|,)?[\d]?$/g).test(sheet_r) && (/^[\d]+(\.|,)?[\d]?$/g).test(sheet_l) &&
            (/^[\d]+(\.|,)?[\d]?$/g).test(cutaway_w) && (/^[\d]+(\.|,)?[\d]?$/g).test(cutaway_h) && (/^[\d]+(\.|,)?[\d]?$/g).test(cutaway_f))) {
            warningForList.innerHTML = "Числа с плавающей точкой будут округлены до десятых"
            return false
        } else {
            warningForList.innerHTML = ""
            coef = 0.1
        }
    }
    //выражения для защиты ввода
    let checkSheetW = Boolean(sheet_w <= MAX_SHEET * coef && sheet_w >= MIN_SHEET * crossOriginIsolated)
    let checkSheetH = Boolean(sheet_h <= MAX_SHEET * coef && sheet_h >= MIN_SHEET * crossOriginIsolated)
    let checkSheetU = Boolean(sheet_u <= MAX_PADDING * coef && sheet_u >= MIN_PADDING * crossOriginIsolated)
    let checkSheetD = Boolean(sheet_d <= MAX_PADDING * coef && sheet_d >= MIN_PADDING * crossOriginIsolated)
    let checkSheetR = Boolean(sheet_r <= MAX_PADDING * coef && sheet_r >= MIN_PADDING * crossOriginIsolated)
    let checkSheetL = Boolean(sheet_l <= MAX_PADDING * coef && sheet_l >= MIN_PADDING * crossOriginIsolated)
    let checkCutawayW = Boolean(cutaway_w <= MAX_CUTAWAY * coef && cutaway_w >= MIN_CUTAWAY * coef)
    let checkCutawayH = Boolean(cutaway_h <= MAX_CUTAWAY * coef && cutaway_h >= MIN_CUTAWAY * coef)
    let checkCutawayF = Boolean(cutaway_f <= MAX_PADDING * coef && cutaway_f >= MIN_PADDING * coef)
    //если данные введены верно, то возвращаем true
    if (checkSheetW && checkSheetH && checkSheetU && checkSheetD && checkSheetR && checkSheetD && checkSheetL && checkCutawayW && checkCutawayF && checkCutawayH) {
        // избавление от стиля, который мог остаться
        sheet_h_block.parentElement.classList.remove('error-input')
        sheet_w_block.parentElement.classList.remove('error-input')
        sheet_l_block.parentElement.classList.remove('error-input')
        sheet_d_block.parentElement.classList.remove('error-input')
        sheet_r_block.parentElement.classList.remove('error-input')
        sheet_u_block.parentElement.classList.remove('error-input')
        cutaway_w_block.parentElement.classList.remove('error-input')
        cutaway_h_block.parentElement.classList.remove('error-input')
        cutaway_f_block.parentElement.classList.remove('error-input')
        return true
    }
    //если какой-то из параметров пустой, возвращаем false и выводим ошибку
    else {
        //если поле заполнено неверно, выделяем красным
        //проверяем, исправилось ли значение в поле. Если да - убираем красную границу
        sheet_h <= 0 || !checkSheetH ? sheet_h_block.parentElement.classList.add('error-input') : sheet_h_block.parentElement.classList.remove('error-input')
        sheet_w <= 0 || !checkSheetW ? sheet_w_block.parentElement.classList.add('error-input') : sheet_w_block.parentElement.classList.remove('error-input')
        sheet_l <= 0 || !checkSheetL ? sheet_l_block.parentElement.classList.add('error-input') : sheet_l_block.parentElement.classList.remove('error-input')
        sheet_d <= 0 || !checkSheetD ? sheet_d_block.parentElement.classList.add('error-input') : sheet_d_block.parentElement.classList.remove('error-input')
        sheet_r <= 0 || !checkSheetR ? sheet_r_block.parentElement.classList.add('error-input') : sheet_r_block.parentElement.classList.remove('error-input')
        sheet_u <= 0 || !checkSheetU ? sheet_u_block.parentElement.classList.add('error-input') : sheet_u_block.parentElement.classList.remove('error-input')
        cutaway_w <= 0 || !checkCutawayW ? cutaway_w_block.parentElement.classList.add('error-input') : cutaway_w_block.parentElement.classList.remove('error-input')
        cutaway_h <= 0 || !checkCutawayH ? cutaway_h_block.parentElement.classList.add('error-input') : cutaway_h_block.parentElement.classList.remove('error-input')
        cutaway_f <= 0 || !checkCutawayF ? cutaway_f_block.parentElement.classList.add('error-input') : cutaway_f_block.parentElement.classList.remove('error-input')
        if (sheet_w <= 0 || sheet_h <= 0 || sheet_u <= 0 || sheet_d <= 0 || sheet_r <= 0 || sheet_l <= 0 || cutaway_w <= 0 || cutaway_h <= 0 || cutaway_f <= 0) {
            warningForList.innerHTML = "Недостаточно данных!"
            return false
        }
        //если введенные параметры не соотвутсвуют ограничениям, возвращаем false и выводим ошибку
        else {
            warningForList.innerHTML = "Некорректные данные!"
            return false
        }
    }
}

function checkInputRun(runL) {
    let checkRunL = Boolean(runL > 0)
    if (checkRunL) {
        run_block.classList.remove('error-input')
        return true
    } else {
        runL <= 0 || !checkRunL ? run_block.classList.add('error-input') : run_block.classList.remove('error-input')
        if (runL <= 0) {
            warningForList.innerHTML = "Тираж должен быть больше нуля!"
            return false
        }
        //если введенные параметры не соотвутсвуют ограничениям, возвращаем false и выводим ошибку
        else {
            warningForList.innerHTML = "Некорректные данные!"
            return false
        }
    }
}

function resizePreview(sheet_w, sheet_h, sheet_u, sheet_d, sheet_l, sheet_r) {
    // изменение размера блока .preview с предустановленных значений
    let preview = document.querySelector('.preview')
    // let c = document.getElementById("canvas");
    const rem = 20 //значение 1 rem в px
    if (sheet_w + sheet_h > 0) {
        // задание новых padding для блока
        // если высота больше
        if (sheet_w / sheet_h < 45 / 26 && sheet_w / sheet_h > 0) {
            // высота остаётся фиксированной
            preview.style.height = 26 + 'rem'
            preview.style.width = sheet_w * 26 / sheet_h + 'rem'
            // вычисление новой высоты листа без учёта технических отступов
            let padding_height = (sheet_u + sheet_d) * preview.offsetHeight / sheet_h
            c.style.height = 26 - padding_height + 'rem'
            c.style.width = sheet_w * (26 - padding_height) / sheet_h + 'rem'
            // иначе, если ширина больше или равна
        } else if (sheet_w / sheet_h >= 45 / 26) {
            // длина остаётся фиксированной и равной 45 + 'rem'
            preview.style.width = 45 + 'rem'
            preview.style.height = 45 * sheet_h / sheet_w + 'rem'
            // вычисление новой ширины листа без учёта технических отступов
            let padding_width = (sheet_r + sheet_l) * preview.offsetWidth / sheet_w
            c.style.width = 45 - padding_width + 'rem'
            c.style.height = (45 - padding_width) * sheet_h / sheet_w + 'rem'
        }
        // формирование паддингов, соотносящихся с размерами блока аналогично соотношению тех. полей с листом
        preview.style.padding = sheet_u * preview.offsetHeight / sheet_h + 'px ' + sheet_r * preview.offsetWidth / sheet_w + 'px ' + sheet_d * preview.offsetHeight / sheet_h + 'px ' + sheet_l * preview.offsetWidth / sheet_w + 'px'
        //указание новых логических высоты и ширины canvas
        c.setAttribute('width', (sheet_w - sheet_l - sheet_r))
        c.setAttribute('height', (sheet_h - sheet_u - sheet_d))
        ctx.scale(c.offsetWidth / c.width, c.offsetHeight / c.height)
        console.log('width1 = ' + c.width)
    }
}


function visualize(cutaway_w, cutaway_h, cutaway_f, total_row, total_column) {
    // входные данные:
    // fin_sheet_w, fin_sheet_h -- размер листа с учётом полей
    // fin_cutaway_w, fin_cutaway_h -- размер визитки с учётом вылетов
    // total  -- количество визиток
    // очистка прошлого состояния 
    ctx.clearRect(0, 0, c.width, c.height)
    const fillColor = '#D7BFAD';
    console.log(cutaway_w, cutaway_h, cutaway_f, total_row, total_column)
    // отступы от начала оси координат
    let offset_x = 2 * cutaway_f + cutaway_w
    let offset_y = 2 * cutaway_f + cutaway_h
    ctx.fillStyle = fillColor;
    console.log('help ', c.width / c.offsetWidth, '  ', c.offsetWidth / c.width)
    for (let i = 0; i < total_column; i++) {
        for (let j = 0; j < total_row; j++) {
            // отрисовка визиток в одном ряду
            ctx.roundRect(cutaway_f, cutaway_f, cutaway_w, cutaway_h, 5)
            ctx.fill()
            ctx.translate(offset_x, 0)
            ctx.save()
        }
        // переход к нижнему ряду
        ctx.translate(-offset_x * total_row, offset_y)
        ctx.save()
    }
}


//Проверка на соответствие единицам измерения введённых чисел в поля
function convertUnits(block) {
    let value = Number(parseFloat(block.value).toFixed(1))
    if (typeof (value) === "number") {
        if (units[0].checked === true) {
            // if (!isMm(value)) {
            value = value * 10
            block.value = value
            block.setAttribute('min', block.min * 10)
            block.setAttribute('max', block.max * 10)
            block.setAttribute('step', 1)
            // }
        } else if (units[1].checked === true) {
            value = value / 10
            block.value = value
            block.setAttribute('min', block.min / 10)
            block.setAttribute('max', block.max / 10)
            block.setAttribute('step', 0.1)
        }
         console.log('new value = ', value)
    }
}

function convertedInput() {
    // setTimeout(calcSize, 1);
    convertUnits(sheet_w_block)
    convertUnits(sheet_h_block)
    convertUnits(sheet_u_block)
    convertUnits(sheet_d_block)
    convertUnits(sheet_r_block)
    convertUnits(sheet_l_block)
    convertUnits(cutaway_w_block)
    convertUnits(cutaway_h_block)
    convertUnits(cutaway_f_block)
}