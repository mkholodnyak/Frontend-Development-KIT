var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    csso = require('gulp-csso'),
    sass = require('gulp-sass'),
    bower = require('gulp-bower'),
    minifyHTML = require('gulp-minify-html'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jpegtran = require('imagemin-jpegtran'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence');

var config = {
    'src': 'src/',
    'deploy': 'deploy/',
    'app': 'app/'
};

gulp.task('html', function () {
    return gulp
        .src(config.src + '*.html')
        .pipe(minifyHTML({
            conditionals: true,
            spare: true
        }))
        .pipe(gulp.dest(config.deploy))
        .pipe(livereload());
});

gulp.task('css', function () {
    gulp
        .src(config.src + config.app + 'css/**/*.scss')
        //.pipe(sass())
        .pipe(sass().on('error', sass.logError))
        .pipe(csso())
        .pipe(gulp.dest(config.deploy + config.app + 'css/'))
        .pipe(livereload());
});

gulp.task('javascript', function () {
    gulp
        .src(config.src + config.app + 'js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(config.deploy + config.app + 'js/'))
        .pipe(livereload());
});

gulp.task('image', function () {
    gulp
        .src(config.src + config.app + 'images/**/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant(), jpegtran()]
        }))
        .pipe(jpegtran({progressive: true})())
        .pipe(gulp.dest(config.deploy + config.app + 'images/'))
        .pipe(livereload());
});

gulp.task('bower', function () {
    bower(config.src + config.app + 'vendor/')
        .pipe(gulp.dest(config.deploy + config.app + 'vendor/'))
});

gulp.task('watch', function () {
    livereload.listen();

    var src = config.src;

    gulp.watch(src + config.app + 'css/**/*.scss', ['css']);
    gulp.watch(src + config.app + 'js/*.js', ['javascript']);
    gulp.watch(src + config.app + 'images/**/*.*', ['image']);
    gulp.watch(src + '*.html', ['html']);
});

gulp.task('deploy', function () {
    runSequence('html',
        ['css', 'javascript', 'image'],
        'bower',
        function () {
            console.log('✔ Done!');
        });
});