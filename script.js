//константы для размеров листа
const MAX_SHEET_W = 2000
const MIN_SHEET_W = 297
const MIN_SHEET_H = 210
const MAX_SHEET_H = 1000

//константы для размеров полей листа
const MAX_SHEET_U = 50 //верхнее поле
const MIN_SHEET_U = 2
const MAX_SHEET_R = 50 //правое поле
const MIN_SHEET_R = 2
const MAX_SHEET_D = 50 //нижнее поле
const MIN_SHEET_D = 2
const MAX_SHEET_L = 50 //левое поле
const MIN_SHEET_L = 2

//константы для размеров вылетов и размерах визитки
const MAX_CUTAWAY_W = 148 //максимальная ширина визитки
const MIN_CUTAWAY_W = 85
const MAX_CUTAWAY_H = 210 //максимальная высота визитки
const MIN_CUTAWAY_H = 50
const MAX_CUTAWAY_F = 50 //максимальный вылет
const MIN_CUTAWAY_F = 2

let total_box = document.querySelector('.total > h2') //количество визиток
let warningForList = document.querySelector('.warning') //предупреждение об ошибке в блоке с вводом полей
let total_lists = document.querySelector('.total-sheet > h2') //предупреждение об ошибке в блоке с вводом полей

//блоки элементов
let sheet_w_block = document.getElementById('sheet-w').parentElement
let sheet_h_block = document.getElementById('sheet-h').parentElement
let sheet_l_block = document.getElementById('sheet-l').parentElement
let sheet_d_block = document.getElementById('sheet-d').parentElement
let sheet_u_block = document.getElementById('sheet-u').parentElement
let sheet_r_block = document.getElementById('sheet-r').parentElement
let cutaway_w_block = document.getElementById('cutaway-w').parentElement
let cutaway_h_block = document.getElementById('cutaway-h').parentElement
let cutaway_f_block = document.getElementById('cutaway-f').parentElement

let total = 0 // всего визиток в печатном листе

function calcSize() {
    // данные о формате листа
    let sheet_w = Number(parseFloat(document.querySelector('#sheet-w').value).toFixed(2))
    let sheet_h = Number(parseFloat(document.querySelector('#sheet-h').value).toFixed(2))

    //данные о полях
    let sheet_u = Number(parseFloat(document.querySelector('#sheet-u').value).toFixed(2))
    let sheet_r = Number(parseFloat(document.querySelector('#sheet-r').value).toFixed(2))
    let sheet_d = Number(parseFloat(document.querySelector('#sheet-d').value).toFixed(2))
    let sheet_l = Number(parseFloat(document.querySelector('#sheet-l').value).toFixed(2))

    //данные о размерах визитки после обрезки
    let cutaway_w = Number(parseFloat(document.querySelector('#cutaway-w').value).toFixed(2))
    let cutaway_h = Number(parseFloat(document.querySelector('#cutaway-h').value).toFixed(2))
    let cutaway_f = Number(parseFloat(document.querySelector('#cutaway-f').value).toFixed(2))

    let fin_sheet_w = sheet_w - sheet_r - sheet_l // размер печатной области по ширине
    let fin_sheet_h = sheet_h - sheet_u - sheet_d // размер печатной области по высоте
    let fin_cutaway_w = cutaway_w + 2 * cutaway_f // размер макета визитки с полями по ширине
    let fin_cutaway_h = cutaway_h + 2 * cutaway_f // размер макета визитки с полями по высоте
    let total = 0 // всего визиток в печатном листе
    let total_row = 0 // количество визиток по горизонтали
    let total_column = 0 // количество визиток по вертикали
    let total_box = document.querySelector('.total > h2') //количество визиток

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
                let runL = Number(parseInt(document.querySelector('#run').value)) //введенный тираж
                if (runL > 0 && runL <= total) {
                    total_lists.innerHTML = 1;
                }
                else {
                    console.log(Math.ceil(runL / total))
                    //округление в большую сторону, так как листы - физические объекты
                    total_lists.innerHTML = Math.ceil(runL / total);
                }
            });
            // новые размеры canvas и блока
            resizePreview(sheet_w, sheet_h, sheet_u, sheet_d, sheet_l, sheet_r)
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
    //выражения для защиты ввода
    let checkSheetW = Boolean(sheet_w <= MAX_SHEET_W && sheet_w >= MIN_SHEET_W)
    let checkSheetH = Boolean(sheet_h <= MAX_SHEET_H && sheet_h >= MIN_SHEET_H)
    let checkSheetU = Boolean(sheet_u <= MAX_SHEET_U && sheet_u >= MIN_SHEET_U)
    let checkSheetD = Boolean(sheet_d <= MAX_SHEET_D && sheet_d >= MIN_SHEET_D)
    let checkSheetR = Boolean(sheet_r <= MAX_SHEET_R && sheet_r >= MIN_SHEET_R)
    let checkSheetL = Boolean(sheet_l <= MAX_SHEET_L && sheet_l >= MIN_SHEET_L)
    let checkCutawayW = Boolean(cutaway_w <= MAX_CUTAWAY_W && cutaway_w >= MIN_CUTAWAY_W)
    let checkCutawayH = Boolean(cutaway_h <= MAX_CUTAWAY_H && cutaway_h >= MIN_CUTAWAY_H)
    let checkCutawayF = Boolean(cutaway_f <= MAX_CUTAWAY_F && cutaway_f >= MIN_CUTAWAY_F)
    //если данные введены верно, то возвращаем true
    if (checkSheetW && checkSheetH && checkSheetU && checkSheetD && checkSheetR && checkSheetD && checkSheetL && checkCutawayW && checkCutawayF && checkCutawayH) {
        // избавление от стиля, который мог остаться
        sheet_h_block.classList.remove('error-input')
        sheet_w_block.classList.remove('error-input')
        sheet_l_block.classList.remove('error-input')
        sheet_d_block.classList.remove('error-input')
        sheet_r_block.classList.remove('error-input')
        sheet_u_block.classList.remove('error-input')
        cutaway_w_block.classList.remove('error-input')
        cutaway_h_block.classList.remove('error-input')
        cutaway_f_block.classList.remove('error-input')
        return true
    }
    //если какой-то из параметров пустой, возвращаем false и выводим ошибку
    else {
        //если поле заполнено неверно, выделяем красным
        //проверяем, исправилось ли значение в поле. Если да - убираем красную границу
        sheet_h <= 0 || !checkSheetH ? sheet_h_block.classList.add('error-input') : sheet_h_block.classList.remove('error-input')
        sheet_w <= 0 || !checkSheetW ? sheet_w_block.classList.add('error-input') : sheet_w_block.classList.remove('error-input')
        sheet_l <= 0 || !checkSheetL ? sheet_l_block.classList.add('error-input') : sheet_l_block.classList.remove('error-input')
        sheet_d <= 0 || !checkSheetD ? sheet_d_block.classList.add('error-input') : sheet_d_block.classList.remove('error-input')
        sheet_r <= 0 || !checkSheetR ? sheet_r_block.classList.add('error-input') : sheet_r_block.classList.remove('error-input')
        sheet_u <= 0 || !checkSheetU ? sheet_u_block.classList.add('error-input') : sheet_u_block.classList.remove('error-input')
        cutaway_w <= 0 || !checkCutawayW ? cutaway_w_block.classList.add('error-input') : cutaway_w_block.classList.remove('error-input')
        cutaway_h <= 0 || !checkCutawayH ? cutaway_h_block.classList.add('error-input') : cutaway_h_block.classList.remove('error-input')
        cutaway_f <= 0 || !checkCutawayF ? cutaway_f_block.classList.add('error-input') : cutaway_f_block.classList.remove('error-input')
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



function resizePreview(sheet_w, sheet_h, sheet_u, sheet_d, sheet_l, sheet_r) {
    // изменение размера блока .preview с предустановленных значений
    let preview = document.querySelector('.preview')
    let c = document.getElementById("canvas");

    if (sheet_w + sheet_h > 0) {
        // задание новых padding для блока
        // if (sheet_w <= 330 || sheet_h <= 330) {
        //     preview.style.width = 2 * sheet_w + 'px'
        //     preview.style.height = 2 * sheet_h + 'px'
        // }
        // else if (sheet_w <= 450 || sheet_h <= 450) {
        //     preview.style.width = 1.5 * sheet_w + 'px'
        //     preview.style.height = 1.5 * sheet_h + 'px'
        // }
        // else {
        //     preview.style.width = sheet_w + 'px'
        //     preview.style.height = sheet_h + 'px'
        // }
        // preview.style.padding = sheet_u + 'px ' + sheet_r + 'px ' + sheet_d + 'px ' + sheet_l + 'px'
        if (sheet_w / sheet_h < 1 && sheet_w / sheet_h > 0) {
            // высота остаётся фиксированной
            preview.style.height = 26 + 'rem'
            preview.style.width = sheet_w * 26 /  sheet_h + 'rem'
        } else if (sheet_w / sheet_h >= 1){
            // длина остаётся фиксированной и равной 45 + 'rem'
            preview.style.width = 45 + 'rem'
            preview.style.height = 45 * sheet_h / sheet_w + 'rem'
        }
        // формирование паддингов, соотносящихся с размерами блока аналогично соотношению тех. полей с листом
        preview.style.padding = sheet_u * preview.offsetHeight / sheet_h  + 'px ' + sheet_r * preview.offsetWidth / sheet_w + 'px ' + sheet_d * preview.offsetHeight / sheet_h + 'px ' + sheet_l * preview.offsetWidth / sheet_w + 'px'
        //указание новых высоты и ширины canvas
        console.log('width = ' + preview.offsetWidth)
        console.log('height = ' + preview.offsetHeight)
        console.log('padding = ' + sheet_u * preview.offsetHeight / sheet_h  + 'px ' + sheet_r * preview.offsetWidth / sheet_w + 'px ' + sheet_d * preview.offsetHeight / sheet_h + 'px ' + sheet_l * preview.offsetWidth / sheet_w + 'px')

        c.setAttribute('width', (sheet_w - sheet_l - sheet_r))
        c.setAttribute('height', (sheet_h - sheet_u - sheet_d))
    }
}

function visualize(cutaway_w, cutaway_h, cutaway_f, total_row, total_column) {
    // входные данные:
    // fin_sheet_w, fin_sheet_h -- размер листа с учётом полей
    // fin_cutaway_w, fin_cutaway_h -- размер визитки с учётом вылетов
    // total  -- количество визиток
    let c = document.getElementById("canvas");
    const fillColor = '#D7BFAD';
    console.log(cutaway_w, cutaway_h, cutaway_f, total_row, total_column)
    let ctx = c.getContext("2d");
    // отступы от начала оси координат
    let offset_x = 2 * cutaway_f + cutaway_w
    let offset_y = 2 * cutaway_f + cutaway_h
    ctx.fillStyle = fillColor;

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