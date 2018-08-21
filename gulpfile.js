var	gulp = require('gulp'),
    rename = require('gulp-rename'),
    del = require('del'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    cssnano = require('gulp-cssnano'),
    //    babel = require("gulp-babel"),
    sourcemaps = require('gulp-sourcemaps');

var reload = browserSync.reload;

var params = {
    from: 'source/',
	out: 'public',
	htmlSrc: 'source/*.html',
    levels: ['common.blocks']
};



gulp.task('default', ['build'], function (callback) {
    runSequence(['server'],
        callback
    )
});

gulp.task('build', function (callback) {
    runSequence('clean:public', 'html', 'css', 'img',
        callback
    )
});

gulp.task('clean:public', function() {
    return del.sync('public');
});


gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: params.out
        }
    });
    gulp.watch(params.from + '**/*.*', ['build']);
});

gulp.task('html', function () {
   gulp.src(params.htmlSrc)
       .pipe(rename('index.html'))
       .pipe(gulp.dest(params.out))
       .pipe(reload({stream: true}))
});

gulp.task('css', function () {
    gulp.src([params.from + '/scss/styles.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
        .pipe(cssnano())
        .pipe(rename('styles.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(params.out + "/css"))
        .pipe(reload({stream: true}))
});

gulp.task('img', function(){
    return gulp.src(params.from + '/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: false
        })))
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(params.out + '/img'))
});

// gulp.task('js', function(){
//     return gulp.src(params.from + '/**/*.js')
//         .pipe(sourcemaps.init())
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest(params.out))
// });


// gulp.task('fonts', function() {
//     return gulp.src(params.from + 'fonts/**/*')
//         .pipe(gulp.dest(params.out + '/fonts'))
// });