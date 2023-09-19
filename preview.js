let preview = document.querySelector('.preview')
let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

// отрисовка раскладки в canvas
function resizePreview(sheet_w, sheet_h, sheet_r, sheet_l, sheet_u, sheet_d) {
    // Входные данные:
    // sheet_w -- ширина листа с учётом тех. полей
    // sheet_h -- высота листа с учётом тех. полей
    // sheet_r, sheet_l, sheet_u, sheet_d -- значения отступов
    // изменение размера блока .preview с предустановленных значений

    if (sheet_w + sheet_h > 0) {
        // если высота больше
        if (sheet_w / sheet_h < 45 / 26 && sheet_w / sheet_h > 0) {
            // высота остаётся фиксированной
            preview.style.height = 26 + 'rem'
            preview.style.width = sheet_w * 26 / sheet_h + 'rem'
            // иначе, если ширина больше или равна
        } else if (sheet_w / sheet_h >= 45 / 26) {
            // длина остаётся фиксированной и равной 45 + 'rem'
            preview.style.width = 45 + 'rem'
            preview.style.height = 45 * sheet_h / sheet_w + 'rem'
        }
        // формирование паддингов, соотносящихся с размерами блока аналогично соотношению тех. полей с листом
        preview.style.padding = sheet_u * preview.offsetHeight / sheet_h + 'px ' +
            sheet_r * preview.offsetWidth / sheet_w + 'px ' + sheet_d * preview.offsetHeight / sheet_h + 'px ' +
            sheet_l * preview.offsetWidth / sheet_w + 'px';

        // let dpi = window.devicePixelRatio;

        // // increase the actual size of our canvas
        // c.width = rect.width * dpi;
        // c.height = rect.height * dpi;

        // // ensure all drawing operations are scaled
        // ctx.scale(dpi, dpi);

        // // scale everything down using CSS
        // c.style.width = rect.width + 'px';
        // c.style.height = rect.height + 'px';
        let canvas_w = preview.offsetWidth - sheet_r * preview.offsetWidth / sheet_w - sheet_l * preview.offsetWidth / sheet_w
        let canvas_h = preview.offsetHeight - sheet_u * preview.offsetHeight / sheet_h - sheet_d * preview.offsetHeight / sheet_h
        console.log('height' + canvas_h)
        c.width = canvas_w
        c.height = canvas_h
        c.style.width = canvas_w + 'px'
        c.style.height = canvas_h + 'px'
        // ctx.scale(dpi, dpi)
    }
}
function visualize(cutaway_w, cutaway_h, cutaway_f, final_w, final_h, total_row, total_column) {
    // входные данные:
    // fin_sheet_w, fin_sheet_h -- размер листа с учётом полей
    // fin_cutaway_w, fin_cutaway_h -- размер визитки с учётом вылетов
    // total  -- количество визиток
    // очистка прошлого состояния 
    ctx.clearRect(0, 0, c.width, c.height)
    const fillColor = '#D7BFAD';
    console.log(cutaway_w, cutaway_h, cutaway_f, total_row, total_column)
    // отступы от начала оси координат
    let offset_x = c.width * (2 * cutaway_f + cutaway_w) / final_w
    let offset_y = c.height * (2 * cutaway_f + cutaway_h) / final_h
    let c_wid = c.width * cutaway_w / final_w
    let c_height = c.height * cutaway_h / final_h
    ctx.fillStyle = fillColor;
    console.log('help ', c.width)
    for (let i = 0; i < total_column; i++) {
        for (let j = 0; j < total_row; j++) {
            // отрисовка визиток в одном ряду
            ctx.roundRect(0, 0, c_wid, c_height, 5)
            ctx.fill()
            ctx.translate(offset_x, 0)
            ctx.save()
        }
        // переход к нижнему ряду
        ctx.translate(-offset_x * total_row, offset_y)
        ctx.save()
    }
}
