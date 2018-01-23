'use strict';
let CartItem = function (id, dateOfPurchise, maketInfo, sumOfPurchaise, coment) {
    this.id = id;
    this.dateOfPurchise = dateOfPurchise;
    this.maketInfo = dateOfPurchise;
    this.sumOfPurchaise = dateOfPurchise;
    this.coment = dateOfPurchise;
};

let ItemPl = function (id, name, format, term, amount, route, startDate) {
    this.id = id;
    this.name = name; //постер или банер или чехлы
    this.format = format;
    this.term = term;
    this.amount = amount;
    this.route = route;
    this.price = 55;  //цена постера на 1 мес
    this.price2 = 40; //цена постера на 2 недели
    this.price2a4 = 110; //цена двойного постера
    this.startDate = startDate;
    this.summ = function () {
        if (this.term === "2 нед." && this.format === 'А4') {

            return this.amount * this.price2;
        } else if (this.term === "2 нед." && this.format === '2А4') {

            return this.amount * this.price2a4 - 20;
        } else if (this.term === "1 м." | this.term === "2 м." | this.term === "3 м." && this.format === 'А4') {

            return this.amount * this.price * parseInt(this.term);
        } else {

            console.log("Зашли в ветку Остальное");

            return this.amount * this.price2a4 * parseInt(this.term);
        }

    }
};
//TODO Ещ не работает Задаем свободное кол-во планшетов по маршрутам
let placeFreeInBus = [{
    '146': 30,
    '121': 30,
    '175': 35,
    '185': 35,
    '232': 20
}];

let nextDateOfWorks = [{
    '1': '23.01.2018',
    '2': '30.01.2018',
    '3': '06.02.2018',
    '4': '13.02.2018',

}];

//Это временный тестовый объект Планшета
let testPl = new ItemPl(1, "Планшет", 'A4', '1 м.', 5, 146, '12.01');


let plArray = [];
//plArray.push(testPl);
//plArray.push(new ItemPl(2, "Планшет", '2A4', '1 м.', 15, 121, '12.01'));
let posterAmountSum = 0;
let posterMoneySum = 0;
let discountInfoArray = [];

//TODO вывод строки заказа в модалке
function rowsToScreen(listBlockId, sumBlockId) {

    $(`${listBlockId}`).empty();
    $(`${sumBlockId}`).empty();
    $(`${listBlockId}`).append(`<div class="myRow">
<span class="badge-light">Формат</span>
<span class="badge-light">Маршр.</span>
<span class="badge-light">Срок</span>
<span class="badge-light">Кол-во</span>
<span class="badge-light">Старт</span>
<span class="badge-light">Del</span>
</div>`
    );

    for (let i = 0; i < plArray.length; i++) {


        $(`${listBlockId}`).append(`<div class="myRow" data-index="${i}">
<span class="badge-light">${plArray[i].format}</span>
<span class="badge-light">№${plArray[i].route}</span>
<span class="badge-light">${plArray[i].term}</span>
<span class="badge-light">${plArray[i].amount}</span>
<span class="badge-light">${plArray[i].startDate}</span>
<span class="badge-danger" data-class="del">del</span>

</div>`
        );

    }

    sumToTempList('#summaryList');
}

//TODO Подсчет суммы постеров и суммы денег
function sumOfMoneyAndItems(plArray) {
    posterAmountSum = 0;
    posterMoneySum = 0;
    for (let i = 0; i < plArray.length; i++) {
        posterAmountSum += plArray[i].amount;
        posterMoneySum += plArray[i].summ();
    }

    if (posterAmountSum >= 10) {
        $('#addMaket').css('display', 'block');
        $('#messages').css('display', 'block');

    } else {
        $('#addMaket').css('display', 'none');
        $('#messages').css('display', 'none');

    }


}

//TODO Отработка кнопки Далле на Планшетах

$('#addMaket').click(function () {
    console.log("Кликнули на Далее");
    openMaketTab();
});

function openMaketTab() {

    $('#myTab a[href="#maket"]').tab('show');
}



//TODO Удаление строчки


$('#tempList').on('click', '[data-class=del]', function (event) {
    let index = $(event.target).parent().data('index');

    $(`[data-index=${index}]`).fadeOut(1000);
    plArray.splice(index, 1);

    rowsToScreen('#tempList', '#summaryList');
    sumToTempList('#summaryList');
});


//TODO Суммарная информация о стоимости заказа по планшетам
function sumToTempList(summaryList) {


    $(`${summaryList}`).empty();
    sumOfMoneyAndItems(plArray);
    $(`${summaryList}`).append(`<div class="myRow">
<div>Количество: ${posterAmountSum} шт.</br>
Сумма заказа: ${posterMoneySum} грн.</br>
Ваша скидка: ${discountChecker(posterAmountSum, posterMoneySum)[0]}%</br>
Сумма, с учетом скидки: ${discountChecker(posterAmountSum, posterMoneySum)[1]} грн.</br>
${discountInfoArray[2]}</div>
</div>`
    );
}

//TODO Проверка скидки в зависимости от объема заказа
function discountChecker(posterAmountSum, posterMoneySum) {

    if (posterAmountSum >= 30 && posterAmountSum <= 50) {
        discountInfoArray[0] = 5;
        discountInfoArray[1] = posterMoneySum - posterMoneySum * 0.05;
        discountTextGenerator();
        return discountInfoArray;
    } else if (posterAmountSum >= 51 && posterAmountSum <= 100) {
        discountInfoArray[0] = 10;
        discountInfoArray[1] = posterMoneySum - posterMoneySum * 0.1;
        discountTextGenerator();
        return discountInfoArray;
    } else if (posterAmountSum >= 101 && posterAmountSum <= 1000) {
        discountInfoArray[0] = 15;
        discountInfoArray[1] = posterMoneySum - posterMoneySum * 0.15;
        discountTextGenerator();
        return discountInfoArray;
    }
    discountTextGenerator();
    discountInfoArray[0] = 0;
    discountInfoArray[1] = posterMoneySum;

    function discountTextGenerator() {
        if (discountInfoArray[0] < 5) {
            discountInfoArray[2] = `До следующей скидки ${5}% осталось заказать ${30 - posterAmountSum} постеров`;
            return discountInfoArray[4];
        } else if (discountInfoArray[0] === 5) {
            discountInfoArray[2] = `До следующей скидки ${10}% осталось заказать ${51 - posterAmountSum} постеров`;
            return discountInfoArray[2];
        } else if (discountInfoArray[0] === 10) {
            discountInfoArray[2] = `До следующей скидки ${15}% осталось заказать ${101 - posterAmountSum} постеров`;
            return discountInfoArray[2];
        } else if (discountInfoArray[0] === 15) {
            discountInfoArray[2] = `У вас максимальная скидка ${15}%`;
            return discountInfoArray[2];
        }

        return `Упс`;
    }

    return discountInfoArray;
}

let controlAmount = false;
let controlRoute = false;
let controlTerm = false;
let controlDate = false;


function addPlanshet() {
    let tempPl = new ItemPl();
    let f1 = document.forms.formatOfPoster.elements;
    let f2 = document.forms.paramOfPoster.elements;
    tempPl.format = f1.format1.value;
    tempPl.amount = parseInt(f2.amount.value);
    tempPl.startDate = f2.date.value;
    tempPl.route = f2.route.value;
    tempPl.term = f2.term.value;

    formChecker();


    function formChecker() {
        let str = 'значение не выбрано';


        $('.formCheck').empty();
        if (isNaN(tempPl.amount)) {
            $('#formCheckAmount').append(`${str}`);
            controlAmount = false;
        } else {
            $('#formCheckAmount').empty();
            controlAmount = true;
        }


        if (tempPl.term === '0') {
            $('#formCheckTerm').append(`${str}`);
            controlTerm = false;
        } else {
            $('#formCheckTerm').empty();
            controlTerm = true;
        }
        if (tempPl.route === '0') {
            $('#formCheckRoute').append(`${str}`);
        } else {
            $('#formCheckRoute').empty();
            controlRoute = true;
        }
        if (tempPl.startDate === '0') {
            $('#formCheckDate').append(`${str}`);
            controlDate = false;
        } else {
            $('#formCheckDate').empty();
            controlDate = true;
        }
        if (controlTerm && controlAmount && controlDate && controlRoute) {


            if (isAnyBodyInArray(tempPl, plArray)) {
                rowsToScreen('#tempList', '#summaryList')
            }
            else {
                plArray.push(tempPl);
                $(`#DateOfZ`).append(`Формируем заказ на ср - ${plArray[0].startDate}`);
                $(`#DateOptions`).css('display', 'none');
            }

            posterAmountSum = 0;
            posterMoneySum = 0;
            rowsToScreen('#tempList', '#summaryList');
        } else (console.log("НЕ пушнулось"))

    }

}


function isAnyBodyInArray(tempItem, Array) {
    console.log("Содержание testPl.route = " + tempItem.route);
    console.log("Содержание testPl.startDate = " + tempItem.startDate);
    console.log("Содержание testPl.term = " + tempItem.term);
    for (let i = 0; i < Array.length; i++) {

        if (parseInt(Array[i].route) === parseInt(tempItem.route) && Array[i].startDate === tempItem.startDate && Array[i].term === tempItem.term && Array[i].format === tempItem.format) {
            console.log("В массиве дата:" + Array[i].startDate);
            Array[i].amount += tempItem.amount;
            console.log("Есть такая буква в этом слове");
            return true;
        }
    }
    return false;
}




$('#addToTempListBut').click(function () {

    addPlanshet();

});



//TODO То, что происходит в закладке Макет Постеров


$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    let target = $(e.target).attr("href"); // activated tab

    if (target === "#maket") {
        $(`#maketPosterInfo`).css('display', 'block');
        $('#addMaket').css('display', 'none');

    } else {
        $(`#maketSumList`).empty();
    }
});

//TODO Генерация метода прикрепления макета в Модалке Планшетов

$('input[type=radio][name=maketPoster]').on('change', function () {
    switch ($(this).val()) {
        case 'load':
            $('#fileLoader').css('display', 'block');
            $('#posterLink').css('display', 'none');
            $('#maketCreationLink').css('display', 'none');
            break;
        case 'share':

            $('#posterLink').css('display', 'block');
            $('#fileLoader').css('display', 'none');
            $('#maketCreationLink').css('display', 'none');
            break;
        case 'create':

            $('#fileLoader').css('display', 'none');
            $('#posterLink').css('display', 'none');
            $('#maketCreationLink').css('display', 'block');

            break;
    }
});


//TODO Проверка получения валидной ссылки прикрепленного макета
$('input[type=button][name=addLinkToPosterMaket]').on('click', function () {
    let f = $(`#inputForLinkPoster`).val();
    let c = $('#comentInUploadForm').val();
    if (checkURL(f)) {
        if (c==='Напишите комментарий') {
            c='нет комментария';
        }
        $('#linkFromPosterLinkFormToDivControl').empty();
        $('#linkFromPosterLinkFormToDiv').append(`${f}</br>${c}`);
        $(`#inputForLinkPoster`).val('Можете добавить еще одну ссылку');
    }
    else {
        $('#linkFromPosterLinkFormToDivControl').empty();
        $('#linkFromPosterLinkFormToDivControl').append(`Введите URl еще раз`);
    }
});

function checkURL(url) {
    let regURL = /^(?:(?:https?|ftp|telnet):\/\/(?:[a-z0-9_-]{1,32}(?::[a-z0-9_-]{1,32})?@)?)?(?:(?:[a-z0-9-]{1,128}\.)+(?:com|net|org|mil|edu|arpa|ru|gov|biz|info|aero|inc|name|[a-z]{2})|(?!0)(?:(?!0[^.]|255)[0-9]{1,3}\.){3}(?!0|255)[0-9]{1,3})(?:\/[a-z0-9.,_@%&?+=\~\/-]*)?(?:#[^ \'\"&<>]*)?$/i;
    return regURL.test(url);
}

//TODO Появление кнопки Добавить в Корзину
//Нужна проверка чек-бокса о согласии прислать макет позже

$('#dcheck').click(function() {


    if($("#dcheck").attr("checked") !== 'checked') {
        $('#addToCart').css('display','block');
        console.log("Чекнуто");
    }

});

//TODO Динамическая подгрузка формы кол-во постеров на маршруте


function stringGen(int) {


    let string = '';
    for (let i = 1; i <= int; i++) {
        string += `${i},`;
    }


    return string;
}

//Заполняем массив интами в зависимости от номера маршрута (0, 146,121,175,185,232)
let posterValues =
    [`кол-во`,
        `${stringGen(30)}`,
        `${stringGen(30)}`,
        `${stringGen(35)}`,
        `${stringGen(35)}`,
        `${stringGen(20)}`];


// ф-ция, возвращающая массив int по заданному маршруту
function getPosterValuesByRouteNumber(index) {

    let sPosterValues = posterValues[index];

    return sPosterValues.split(","); // преобразуем строку в массив городов
}


// ф-ция, выводящая динамически список int
function MkPosterValues(index) {

    let aCurrPosterValues = getPosterValuesByRouteNumber(index);
    let nCurrPosterValuesCnt = aCurrPosterValues.length;
    let oPosterList = document.forms["paramOfPoster"].elements["amount"];
    let oPosterListOptionsCnt = oPosterList.options.length;
    oPosterList.length = 0; // удаляем все элементы из списка постеров
    for (let i = 0; i < nCurrPosterValuesCnt; i++) {
        // далее мы добавляем необходимые int в список
        if (document.createElement) {
            var newPlanshetListOption = document.createElement("OPTION");
            newPlanshetListOption.text = aCurrPosterValues[i];
            newPlanshetListOption.value = aCurrPosterValues[i];
            // тут мы используем для добавления элемента либо метод IE, либо DOM
            (oPosterList.options.add) ? oPosterList.options.add(newPlanshetListOption) : oPosterList.add(newPlanshetListOption, null);
        } else {
            // для NN3.x-4.x
            oPosterList.options[i] = new Option(aCurrPosterValues[i], aCurrPosterValues[i], false, false);
        }
    }
}

// инициируем изменение элементов в списке кол-ва, в зависимости от текущего номера
MkPosterValues(document.forms["paramOfPoster"].elements["route"].selectedIndex);


