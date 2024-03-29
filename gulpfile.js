const gulp           = require('gulp'),
	sass             = require('gulp-sass')(require('sass')),
	browserSync      = require('browser-sync'),
	concat           = require('gulp-concat'),
	uglify           = require('gulp-uglify'),
	imagemin         = require('gulp-imagemin'),
	cache            = require('gulp-cache'),
	autoprefixer     = require('gulp-autoprefixer'),
	babel            = require('gulp-babel'),
	plumber          = require('gulp-plumber'),
	twig             = require('gulp-twig'),
	htmlbeautify     = require('gulp-html-beautify'),
	gcmq             = require('gulp-group-css-media-queries');

// таск для компиляции scss в css
gulp.task('sass', () => {
	return gulp.src('scss/style.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8'], {cascade: true}))
	.pipe(gcmq())
	.pipe(gulp.dest('css'))
	.pipe(browserSync.reload({stream: true}))
});

// файлы для сборки
const jsFiles = [
	'js/vendors/*.js',
	'js/main.js'
];

// таск для объединения js файлов
gulp.task('scripts', () => {
	process.env.NODE_ENV = "release";
	return gulp.src(jsFiles)
		.pipe(babel(
		{
			"plugins": ["@babel/plugin-proposal-object-rest-spread"]
		}))
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js'))
		.pipe(browserSync.reload({stream: true}))
});

// таск для сборки, транспалирования и сжатия скриптов
gulp.task('scripts-build', () => {
	process.env.NODE_ENV = "release";

	return gulp.src(jsFiles)
		.pipe(babel())
		.pipe(concat('main.min.js'))
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('js')); // Выгружаем в папку app/js
});

// приводим впорядок скомпилированный код
gulp.task('htmlbeautify', () => {
	const options = {
		indentSize: 4,
		unformatted: [
			// https://www.w3.org/TR/html5/dom.html#phrasing-content
			 'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite',
			'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'ins', 'kbd', 'keygen', 'map', 'mark', 'math', 'meter', 'noscript',
			'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'small',
			 'strong', 'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text',
			'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt', 'a'
		],
		"indent_char": " ",
		"indent_level": 1,
		"indent_with_tabs": false,
	};
	gulp.src('./*.html')
		.pipe(htmlbeautify(options))
		.pipe(gulp.dest('./'));
});

gulp.task('twig', () => {
	return gulp.src(['./src/*.twig'])
	// Stay live and reload on error
	.pipe(plumber())
	.pipe(twig())
	.pipe(htmlbeautify())
	.pipe(gulp.dest("./"))
	.pipe(browserSync.reload({stream: true}))
});

// таск для обновления страницы
gulp.task('browser-sync', () => {
	browserSync({
		startPath:'./', // текущая папка
		server: {
			baseDir: './'
		},
		serveStaticOptions: {
			extensions: ["html"]
		},
		ghostMode: {
			scroll: false
		},
		notify: false,
	})
});

// таск следит за изменениями файлов и вызывает другие таски
gulp.task('watch', () => {
	gulp.watch('scss/**/*.scss', gulp.parallel('sass'));
	gulp.watch('src/**/*.twig', gulp.parallel('twig'));
	gulp.watch(['js/vendors/*.js', 'js/*.js', '!js/main.min.js', 'js/modules/*.js'], gulp.parallel('scripts'));
	gulp.watch('./*.html', gulp.parallel(() => { browserSync.reload(); }));
	gulp.watch('js/*.js', gulp.parallel(() => { browserSync.reload(); }));
	gulp.watch('img/*', gulp.parallel(() => { browserSync.reload(); }));
});

// таск сжимает картинки без потери качества
gulp.task('img', () => {
	return gulp.src(['img/*.png', 'img/*.jpg']) // откуда брать картинки
	.pipe(cache(
		imagemin([
			//jpg lossless
			imagemin.jpegtran({
				progressive: true
			}),
			imagemin.optipng(),
		])
	))
	.pipe(gulp.dest('img/')) // куда класть сжатые картинки
});

// сборка проекта
gulp.task('build', (cb) => {
	gulp.series('sass', 'twig', 'scripts-build', 'img', () => { console.log('builded');})
	cb();
})

// основной таск, который запускает вспомогательные
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'twig', 'scripts', () => { console.log('dev start');}));