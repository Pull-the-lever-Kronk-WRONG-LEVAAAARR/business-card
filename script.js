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
    if (fin_cutaway_w > 0 && fin_cutaway_h > 0) {
        //округление до меньшего, т.к. это физический объект
        total_row = Math.floor(fin_sheet_w / fin_cutaway_w)
        total_column = Math.floor(fin_sheet_h / fin_cutaway_h)
        total = total_row * total_column
    }

    let total_box = document.querySelector('.total > h2')
    if (total > 0) {
        // если значение больше 0, то вывод в блок .total
        total_box.innerText = total
        // -->
        console.log('total: ' + total)
        // новые размеры canvas и блока
        resizePreview(sheet_w, sheet_h, sheet_u, sheet_d, sheet_l, sheet_r)
        visualize(cutaway_w, cutaway_h, cutaway_f, total_row, total_column)
    } else {
        // total_box.innerText = 'Недостаточно данных'
        console.log('Недостаточно данных')
    }

}

function visualize(cutaway_w, cutaway_h, cutaway_f, total_row, total_column) {
    // входные данные: 
    // fin_sheet_w, fin_sheet_h -- размер листа с учётом полей
    // fin_cutaway_w, fin_cutaway_h -- размер визитки с учётом вылетов
    // total  -- количество визиток
    let c = document.getElementById("canvas");
    const fillColor = '#7D937D'
    
    let ctx = c.getContext("2d");
    // отступы от начала оси координат
    let offset_x = 2 * cutaway_f + cutaway_w
    let offset_y = 2 * cutaway_f + cutaway_h
    ctx.fillStyle = fillColor;
    for (let i = 0; i < total_column; i++) {
        for (let j = 0; j < total_row; j++) {
            // отрисовка визиток в одном ряду
            ctx.fillRect(cutaway_f, cutaway_f, cutaway_w, cutaway_h);
            ctx.translate(offset_x, 0)
            ctx.save()
        }
        // переход к нижнему ряду
        ctx.translate(-offset_x * total_row, offset_y)
        ctx.save()
    }
}

function resizePreview(sheet_w, sheet_h, sheet_u, sheet_d, sheet_l, sheet_r) {
    // изменение размера блока .preview с предустановленных значений
    let preview = document.querySelector('.preview')
    let c = document.getElementById("canvas");

    if (sheet_w + sheet_h > 0) {
        // задание новых padding для блока
        preview.style.width = sheet_w + 'px'
        preview.style.height = sheet_h + 'px'
        preview.style.padding = sheet_u + 'px ' + sheet_r + 'px ' + sheet_d + 'px ' + sheet_l + 'px'
        //указание новых высоты и ширины canvas
        c.setAttribute('width', (sheet_w + sheet_l + sheet_r))
        c.setAttribute('height', (sheet_h + sheet_u + sheet_d))
    }
}

