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
let errorColor = '2px solid #B45436';
 
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
   
    let total_row = 0 // количество визиток по горизонтали
    let total_column = 0 // количество визиток по вертикали
    //если данные введены верно, расчет количества визиток
    if (checkInput(sheet_w, sheet_h, sheet_u, sheet_d, sheet_r, sheet_l, cutaway_w, cutaway_h, cutaway_f)) {
        if (fin_cutaway_w > 0 && fin_cutaway_h > 0) {
            //округление до меньшего, т.к. это физический объект
            total_row = Math.floor(fin_sheet_w / fin_cutaway_w)
            total_column = Math.floor(fin_sheet_h / fin_cutaway_h)
            total = total_row * total_column
        }
 
        if (total > 0) {
            // если значение больше 0, то вывод в блок .total
            total_box.innerText = total
            // -->
            console.log('total: ' + total)
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
        cutaway_f_block.style.border = '';
        return true
    }
    //если какой-то из параметров пустой, возвращаем false и выводим ошибку
    else if (sheet_w === 0 || sheet_h === 0 || sheet_u === 0 || sheet_d === 0 || sheet_r === 0 || sheet_l === 0 || cutaway_w === 0 || cutaway_h === 0 || cutaway_f === 0) {
        warningForList.innerHTML = "Недостаточно данных!"
 
        //если поле заполнено неверно, выделяем красным
        sheet_w_block.style.border = errorColor;
        sheet_h_block.style.border = errorColor;
        sheet_l_block.style.border = errorColor;
        sheet_d_block.style.border = errorColor;
        sheet_r_block.style.border = errorColor;
        sheet_u_block.style.border = errorColor;
        cutaway_w_block.style.border = errorColor;
        cutaway_h_block.style.border = errorColor;
        cutaway_f_block.style.border = errorColor;
 
        //проверяем, исправилось ли значение в поле. Если да - убираем красную границу
        checkCorrectness(checkSheetW, checkSheetH, checkSheetU, checkSheetD, checkSheetR, checkSheetL, checkCutawayW, checkCutawayH, checkCutawayF)
        return false
    }
    //если введенные параметры не соотвутсвуют ограничениям, возвращаем false и выводим ошибку
    else {
        warningForList.innerHTML = "Некорректные данные!"
        return false
    }
}
 
//подсчет количества листов
let run = document.querySelector('#run') //введенный тираж
run.addEventListener('change', function () {
    let runL = Number(parseInt(document.querySelector('#run').value).toFixed(2)) //введенный тираж
    if(runL <= total) {
        total_lists.innerHTML = 1;
    }
    else {
        //округление в большую сторону, так как листы - физические объекты
        total_lists.innerHTML = Math.ceil(runL / total);
    }
});
 
function checkCorrectness(checkSheetW, checkSheetH, checkSheetU, checkSheetD, checkSheetR, checkSheetL, checkCutawayW, checkCutawayH, checkCutawayF) {
    if (checkSheetW) {
        sheet_w_block.style.border = '';
    }
    if (checkSheetH) {
        sheet_h_block.style.border = '';
    }
    if (checkCutawayF) {
        cutaway_f_block.style.border = '';
    }
    if (checkSheetU) {
        sheet_u_block.style.border = '';
    }
    if (checkSheetD) {
        sheet_d_block.style.border = '';
    }
    if (checkSheetR) {
        sheet_r_block.style.border = '';
    }
    if (checkSheetL) {
        sheet_l_block.style.border = '';
    }
    if (checkCutawayW) {
        cutaway_w_block.style.border = '';
    }
    if (checkCutawayH) {
        cutaway_h_block.style.border = '';
    }
}
 
function resizePreview(sheet_w, sheet_h, sheet_u, sheet_d, sheet_l, sheet_r) {
    // изменение размера блока .preview с предустановленных значений
    let preview = document.querySelector('.preview')
    let c = document.getElementById("canvas");

    if (sheet_w + sheet_h > 0) {
        // задание новых padding для блока
        if (sheet_w <= 330 || sheet_h <= 330) {
            preview.style.width = 2 * sheet_w + 'px'
            preview.style.height = 2 * sheet_h + 'px'
        }
        else if (sheet_w <= 450 || sheet_h <= 450) {
            preview.style.width = 1.5 * sheet_w + 'px'
            preview.style.height = 1.5 * sheet_h + 'px'
        }
        else {
            preview.style.width = sheet_w + 'px'
            preview.style.height = sheet_h + 'px'
        }
        preview.style.padding = sheet_u + 'px ' + sheet_r + 'px ' + sheet_d + 'px ' + sheet_l + 'px'
        //указание новых высоты и ширины canvas
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
