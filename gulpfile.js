let preprocessor = 'scss', // Preprocessor (sass, scss, less, styl)
    fileswatch   = 'txt,json,md,woff2', // List of files extensions for watching & hard reload (comma separated)
    imageswatch  = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
    baseDir      = 'app', // Base directory path without «/» at the end
    online       = true; // If «false» - Browsersync will work offline without internet connection

let paths = {

	htmls: {
		src: [
			baseDir + '/*.html',
			'!' + baseDir + '/includes/**/*.html'
		],
		dest: baseDir + '/dev'
	},

	scripts: {
		src: [
			'node_modules/jquery/dist/jquery.min.js',
			baseDir + '/js/dom-i18n.min.js',
			'node_modules/swiper/swiper-bundle.min.js',
			'node_modules/aos/dist/aos.js',
			baseDir + '/js/simplyCountdown.js',
			baseDir + '/js/modals.js',
			baseDir + '/js/app.js' // app.js. Always at the end
		],
		dest: baseDir + '/dev/js',
	},

	styles: {
		src:  baseDir + '/' + preprocessor + '/main.*',
		dest: baseDir + '/dev/css',
	},

	images: {
		src:  baseDir + '/img/src/**/*',
		dest: baseDir + '/dev/img/dest',
	},

	sprites: {
		src: baseDir + '/img/src/svg/*.svg',
		dist: baseDir + '/dev/img/dest/sprites'
	},

	deploy: {
		hostname:    'username@yousite.com', // Deploy hostname
		destination: 'yousite/public_html/', // Deploy destination
		include:     [/* '*.htaccess' */], // Included files to deploy
		exclude:     [ '**/Thumbs.db', '**/*.DS_Store' ], // Excluded files from deploy
	},

	cssOutputName: 'app.min.css',
	jsOutputName:  'app.min.js',

}

const { src, dest, parallel, series, watch } = require('gulp');
const extender     = require('gulp-html-extend');
const scss         = require('gulp-sass');
const cleancss     = require('gulp-clean-css');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const svg		   = require('gulp-svg-sprite');
const newer        = require('gulp-newer');
const rsync        = require('gulp-rsync');
const del          = require('del');

function browsersync() {
	browserSync.init({
		server: { baseDir: baseDir + '/dev' },
		notify: false,
		online: online
	})
}

function htmls() {
	return src(paths.htmls.src)
		.pipe(extender({annotations:true, verbose:false}))
		.pipe(dest(paths.htmls.dest))
		.pipe(browserSync.stream())
}

function scripts() {
	return src(paths.scripts.src)
		.pipe(concat(paths.jsOutputName))
		.pipe(uglify())
		.pipe(dest(paths.scripts.dest))
		.pipe(browserSync.stream())
}

function styles() {
	return src(paths.styles.src)
		.pipe(eval(preprocessor)())
		.pipe(concat(paths.cssOutputName))
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(cleancss( {level: { 1: { specialComments: 0 } },/* format: 'beautify' */ }))
		.pipe(dest(paths.styles.dest))
		.pipe(browserSync.stream())
}

function images() {
	return src(paths.images.src)
		.pipe(newer(paths.images.dest))
		.pipe(imagemin())
		.pipe(dest(paths.images.dest))
}

function sprites() {
	return src(paths.sprites.src)
		.pipe(svg({
            shape: {
                dest: "intermediate-svg"
            },
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            }
        }))
		.pipe(dest(paths.images.dest))
		.pipe(browserSync.stream())
}

function cleanimg() {
	return del('' + paths.images.dest + '/**/*', { force: true })
}

function deploy() {
	return src(baseDir + '/')
	.pipe(rsync({
		root: baseDir + '/',
		hostname: paths.deploy.hostname,
		destination: paths.deploy.destination,
		include: paths.deploy.include,
		exclude: paths.deploy.exclude,
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
}

function startwatch() {
	watch(baseDir  + '/**/' + preprocessor + '/**/*', styles);
	watch(baseDir  + '/**/*.{' + imageswatch + '}', images);
	watch(baseDir  + '/**/*.{' + fileswatch + '}').on('change', browserSync.reload);
	watch([baseDir + '/**/*.html', '!' + baseDir + '/dev/*.html'], htmls);
	watch([baseDir + '/**/*.js', '!' + paths.scripts.dest + '/*.min.js'], scripts);
}

exports.browsersync = browsersync;
exports.assets      = series(cleanimg, styles, scripts, images);
exports.styles      = styles;
exports.htmls       = htmls;
exports.scripts     = scripts;
exports.images      = images;
exports.sprites     = sprites;
exports.cleanimg    = cleanimg;
exports.deploy      = deploy;
exports.default     = parallel(images, sprites, styles, htmls, scripts, browsersync, startwatch);