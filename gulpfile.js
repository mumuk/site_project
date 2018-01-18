let gulp = require('gulp'), // Подключаем Gulp
    sass = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync = require('browser-sync'), // Подключаем Browser Sync
    concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    // cleanCSS = require('gulp-clean-css'),
    cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
notify = require("gulp-notify");
    let babel = require('gulp-babel');

//---------------------------------------//

gulp.task('sass', function () { // Создаем таск Sass
    return gulp.src('app/sass/**/*.sass') // Берем источник
        .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError())) // Преобразуем Sass в CSS посредством gulp-sass, если ошибка то сказать
        // .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(autoprefixer(['last 15 versions'])) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

//---------------------------------------//

gulp.task('css-libs', ['sass'], function () {
    return gulp.src('app/css/*.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'}))  // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

//---------------------------------------//


gulp.task('scripts', function () {
    return gulp.src([ // Берем все необходимые библиотеки
        'node_modules/jquery/dist/jquery.min.js', // Берем jQuery
        'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
    ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')) // Выгружаем в папку app/js
});

//---------------------------------------//

gulp.task('browserSync', function () { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        }, notify: false // Отключаем уведомления

    })
});

//---------------------------------------//

gulp.task('img', function () {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // С кешированием
            // .pipe(imagemin({ // Сжимаем изображения без кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

//---------------------------------------//

gulp.task('clean', function () { // Удаляем папку dist перед сборкой
    return del.sync('dist');
});

gulp.task('clear', function () { // Очищаем cache, если нужно
    return cache.clearAll();
});

//---------------------------------------//

gulp.task('watch', ['browserSync', 'css-libs', 'scripts'], function () {
    gulp.watch('app/sass/**/*.sass', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

//---------------------------------------//

gulp.task('babel', ['scripts'], function () {
    gulp.src('app/js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist/js'));
});

//---------------------------------------//

gulp.task('build', ['clean', 'sass', 'scripts', 'img'], function () {

    let buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/styles.min.css',
    ])
        .pipe(gulp.dest('dist/css'));

    let buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'));

    let buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
        .pipe(babel({presets: ['env']}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));

    let buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));
});






