//константы для размеров листа
const MAX_SHEET = 2000
const MIN_SHEET = 210
//константы для размеров тех. полей листа и вылетов визитки
const MAX_GAP = 50
const MIN_GAP = 2
//константы для размеров вылетов и размерах визитки
const MAX_CUTAWAY = 210
const MIN_CUTAWAY = 50


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
let run_block = document.getElementById('run') //Блок для ввода тиража

//радиокнопки выбора единиц измерения для проверки соответствия им
const units = document.querySelectorAll('input[name="units"]')

let total = 0 //всего визиток

//Проверка на соответствие единицам измерения введённых чисел в поля
function convertUnits(block) {
    let value = Number(parseFloat(block.value).toFixed(1))
    if (typeof (value) === "number") {
        if (units[0].checked === true) {
            value = value * 10
            block.value = value
            block.setAttribute('min', block.min * 10)
            block.setAttribute('max', block.max * 10)
            block.setAttribute('step', 1)
        } else if (units[1].checked === true) {
            value = value / 10
            block.value = value
            block.setAttribute('min', block.min / 10)
            block.setAttribute('max', block.max / 10)
            block.setAttribute('step', 0.1)
        }
    }
}

function convertedInput() {
    // Перевод всех блоков в соответствующие единицы измерения
    convertUnits(sheet_w_block)
    convertUnits(sheet_h_block)
    convertUnits(sheet_u_block)
    convertUnits(sheet_d_block)
    convertUnits(sheet_r_block)
    convertUnits(sheet_l_block)
    convertUnits(cutaway_w_block)
    convertUnits(cutaway_h_block)
    convertUnits(cutaway_f_block)
    calcSize()
}
// формирование исключений на ввод
function checkException(input_type, input_value, min_value, max_value) {
    // Входные данные
    // input_type -- 0 - параметры изделия или листа, 1 - тираж
    // input_value -- значение в поле
    // min_value -- минимальное значение
    // max_value -- максимальное значение
    // проверка заполненного поля
    if (isNaN(input_value)) {
        throw new ReferenceError('Поля не должны быть пустыми');
    }
    // проверка на соответствие единицам измерения, только для параметров изделия или листа
    if (input_type === 0 && units[0].checked === true && !(/^[\d]+$/g).test(input_value)) {
        // если выбраны мм, проверяется условие, что число целое и неотрицательное
        throw new ReferenceError('Значения в мм должны быть целыми и больше 0');
    } else if (input_type === 0 && units[1].checked === true && !(/^[\d]+(\.|,)?[\d]?$/g).test(input_value)) {
        // если выбраны см, проверяется на наличие 1 знака после разделителя и неотрицательность
        throw new ReferenceError('Значения в см не должны иметь более 1 знака после разделителя');
    }
    // проверка попадания в допустимый диапазон
    if (input_value < min_value || input_value > max_value) {
        throw new RangeError('Значения должно быть не меньше ' + min_value + ' и не превосходить ' + max_value)
    }
    // проверка на положительность
    if (input_value <= 0) {
        throw new RangeError('Значение должно быть больше 0')
    }
}

// проверка ввода и вывод ошибок. Если все поля корректны, то возвращается "истина", иначе "ложь"
function checkInput(block, input_type, input_value, min_value, max_value) {
    try {
        checkException(input_type, input_value, min_value, max_value)
    } catch (error) {
        console.log("ОШИБКА: " + error.message)
        block.parentElement.classList.add('error-input')
        errorMessageBox(block.parentElement.parentElement, false, error.message)
        return false
    }
    // "Истина" возвращается только в случае отсутствия ошибок
    block.parentElement.classList.remove('error-input')
    errorMessageBox(block.parentElement.parentElement, true, '')
    return true
}
// вывод сообщения об ошибке
function errorMessageBox(input_box_parent, remove_flag, message) {
    // Входные данные
    // input_box_parent -- объект, сгенерировавший ошибку
    // remove_flag -- если true, то удаляется неактуальное сообщение об ошибке, если false, то создаётся новое
    //создание блока с ошибкой
    let nodes = input_box_parent.childNodes
    let count = 0
    nodes.forEach(element => {
        if (element.className === "error") {
            if (remove_flag === true) {
                input_box_parent.lastChild.removeChild(input_box_parent.lastChild.lastChild) //удаление вложенного элемента
                input_box_parent.removeChild(input_box_parent.lastChild) //удаление элемента
            } else if (message != element.innerText) {
                element.querySelector('.warning').innerText = message
            }
            count++
        }
    });
    if (remove_flag === false) {
        let error_box = document.createElement('div')
        error_box.className = 'error' // присваивание класса 
        input_box_parent.appendChild(error_box) // присоедиенение к контейнеру, в котором хранится поле с ошибкой
        let error_message = document.createElement('span') //создание сообщения об ошибке
        error_message.className = 'warning' // присваивание класса 
        error_message.innerText = message
        error_box.appendChild(error_message) // присоедиенение к созданному блоку для ошибки
    }
}

// нахождение числа визиток в одном ряду/столбце
// length_sheet передаётся без учёта технических полей, т.е. меньше заданного формата
function countNumberOfCutaways(length_sheet, length_cutaway, gap) {
    return Math.floor((length_sheet * 10 + 2 * gap * 10) / (length_cutaway * 10 + 2 * gap * 10))
}

function calcSize() {
    // данные о формате листа
    let sheet_w = Number(parseFloat(sheet_w_block.value).toFixed(1))
    let sheet_h = Number(parseFloat(sheet_h_block.value).toFixed(1))
    //данные о полях
    let sheet_u = Number(parseFloat(sheet_u_block.value).toFixed(1))
    let sheet_r = Number(parseFloat(sheet_r_block.value).toFixed(1))
    let sheet_d = Number(parseFloat(sheet_d_block.value).toFixed(1))
    let sheet_l = Number(parseFloat(sheet_l_block.value).toFixed(1))
    //данные о размерах визитки после обрезки
    let cutaway_w = Number(parseFloat(cutaway_w_block.value).toFixed(1))
    let cutaway_h = Number(parseFloat(cutaway_h_block.value).toFixed(1))
    let cutaway_f = Number(parseFloat(cutaway_f_block.value).toFixed(1))

    // логическая переменная для проверки правильности полей
    let flag = true
    //контейнер отображения количества визиток
    let total_box = document.querySelector('.total > h2')

    // Проверка ввода
    flag = flag & checkInput(sheet_w_block, 0, sheet_w, units[0].checked ? MIN_SHEET : MIN_SHEET / 10, units[0].checked ? MAX_SHEET : MAX_SHEET / 10)
    flag = flag & checkInput(sheet_h_block, 0, sheet_h, units[0].checked ? MIN_SHEET : MIN_SHEET / 10, units[0].checked ? MAX_SHEET : MAX_SHEET / 10)
    flag = flag & checkInput(sheet_u_block, 0, sheet_u, units[0].checked ? MIN_GAP : MIN_GAP / 10, units[0].checked ? MAX_GAP : MAX_GAP / 10)
    flag = flag & checkInput(sheet_r_block, 0, sheet_r, units[0].checked ? MIN_GAP : MIN_GAP / 10, units[0].checked ? MAX_GAP : MAX_GAP / 10)
    flag = flag & checkInput(sheet_d_block, 0, sheet_d, units[0].checked ? MIN_GAP : MIN_GAP / 10, units[0].checked ? MAX_GAP : MAX_GAP / 10)
    flag = flag & checkInput(sheet_l_block, 0, sheet_l, units[0].checked ? MIN_GAP : MIN_GAP / 10, units[0].checked ? MAX_GAP : MAX_GAP / 10)
    flag = flag & checkInput(cutaway_w_block, 0, cutaway_w, units[0].checked ? MIN_CUTAWAY : MIN_CUTAWAY / 10, units[0].checked ? MAX_CUTAWAY : MAX_CUTAWAY / 10)
    flag = flag & checkInput(cutaway_h_block, 0, cutaway_h, units[0].checked ? MIN_CUTAWAY : MIN_CUTAWAY / 10, units[0].checked ? MAX_CUTAWAY : MAX_CUTAWAY / 10)
    flag = flag & checkInput(cutaway_f_block, 0, cutaway_f, units[0].checked ? MIN_GAP : MIN_GAP / 10, units[0].checked ? MAX_GAP : MAX_GAP / 10)
    if (flag == true) {
        // Вычисления продолжатся только при условии,
        // что вылеты не превышают технические поля по каждой стороне
        try {
            if (cutaway_f > sheet_u || cutaway_f > sheet_r || cutaway_f > sheet_d || cutaway_f > sheet_l) {
                throw new RangeError('Значение вылетов не должно превышать величину тех. полей')
            }
        } catch (error) {
            console.log("ОШИБКА: " + error.message)
            //стиль для обозначения ошибки у блока с полем ввода
            cutaway_f_block.parentElement.classList.add('error-input')
            errorMessageBox(cutaway_f_block.parentElement.parentElement, false, error.message)
            // исправление значения итогового количества
            total_box.innerText = '0'
            total = 0
            return
        }
        errorMessageBox(cutaway_f_block.parentElement.parentElement, true, '')
        // Если не было вызвано исключение, то код продолжит выполняться
        let fin_sheet_w = sheet_w - sheet_r - sheet_l // размер печатной области по ширине
        let fin_sheet_h = sheet_h - sheet_u - sheet_d // размер печатной области по высоте
        let total_row // количество визиток по горизонтали
        let total_column // количество визиток по вертикали
        // поиск оптимального варианта
        // для альбомной ориантации визиток
        let temp_row_ww = countNumberOfCutaways(fin_sheet_w, cutaway_w, cutaway_f)
        let temp_column_hh = countNumberOfCutaways(fin_sheet_h, cutaway_h, cutaway_f)
        // для портретной ориентации визиток
        let temp_row_wh = countNumberOfCutaways(fin_sheet_w, cutaway_h, cutaway_f)
        let temp_column_hw = countNumberOfCutaways(fin_sheet_h, cutaway_w, cutaway_f)
        // количество на всём листе
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
            // cutaway_w и cutaway_h меняются значениями, т.о., получается портретная раскладка
            let temp = cutaway_w
            cutaway_w = cutaway_h
            cutaway_h = temp
        }
        if (total > 0) {
            total_box.innerText = total
            resizePreview(sheet_w, sheet_h, sheet_r, sheet_l, sheet_u, sheet_d)
            visualize(cutaway_w, cutaway_h, cutaway_f, fin_sheet_w, fin_sheet_h, total_row, total_column)
        }
    }
}

function calcSheets() {
    // получение значения в поле тиража
    let run = Number(parseFloat(run_block.value).toFixed(1))
    let flag = checkInput(run_block, 1, run, 1, Math.pow(10, 7))
    let total_sheet = document.querySelector('.total-sheet > h2') //блок вывода количество листов
    if (flag == true && total > 0) {
        if (run <= total) {
            total_sheet.innerHTML = 1;
        }
        else if (run > total) {
            //округление в большую сторону, так как листы - физические объекты
            total_sheet.innerHTML = Math.ceil(run / total);
        }
    } else { total_sheet.innerText = '0' }
}