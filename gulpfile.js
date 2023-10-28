"use strict";

/* Paths */
var path = {
  dist: {
    html: "dist/",
    js: "dist/assets/js/",
    css: "dist/assets/css/",
    style: "dist/assets/css/",
    fontcss: "dist/assets/css/fonts/",
    colorcss: "dist/assets/css/colors/",
    img: "dist/assets/img/",
    marbaise: "marbaise-webp",
    file: "dist/assets/import_file/",
    fonts: "dist/assets/fonts/",
    media: "dist/assets/media/",
    php: "dist/assets/php/",
  },
  src: {
    html: [
      "src/**/*.html",
      "src/**/*.php",
      "!src/partials/**/*.html",
      "!src/assets/php/**/*.html",
      "!src/assets/php/**/*.php",
    ],
    partials: "src/partials/",
    js: "src/assets/js/",
    vendorjs: "src/assets/js/vendor/*.*",
    themejs: "src/assets/js/theme.js",
    style: "src/assets/scss/style.scss",
    fontcss: "src/assets/scss/fonts/*.*",
    colorcss: [
      "src/assets/scss/colors/*.scss",
      "src/assets/scss/theme/_colors.scss",
    ],
    vendorcss: "src/assets/css/vendor/*.*",
    img: "src/assets/img/**/*.*",
    marbaise: "marbaise-origin/*.*",
    file: "src/assets/import_file/*.*",
    fonts: "src/assets/fonts/**/*.*",
    media: "src/assets/media/**/*.*",
    php: "src/assets/php/**/*.*",
  },
  watch: {
    html: [
      "src/**/*.html",
      "src/**/*.php",
      "!src/assets/php/**/*.html",
      "!src/assets/php/**/*.php",
    ],
    partials: "src/partials/**/*.*",
    themejs: "src/assets/js/theme.js",
    vendorjs: "src/assets/js/vendor/*.*",
    css: [
      "src/assets/scss/**/*.scss",
      "!src/assets/scss/fonts/*.scss",
      "!src/assets/scss/colors/*.scss",
      "!src/assets/scss/theme/_colors.scss",
    ],
    fontcss: "src/assets/scss/fonts/*.scss",
    colorcss: [
      "src/assets/scss/colors/*.scss",
      "src/assets/scss/theme/_colors.scss",
    ],
    vendorcss: "src/assets/css/vendor/*.*",
    img: "src/assets/img/**/*.*",
    marbaise: "marbaise-origin/*.*",
    file: "src/assets/import_file/*.*",
    fonts: "src/assets/fonts/**/*.*",
    media: "src/assets/media/**/*.*",
    php: "src/**/*.php",
    user: "src/assets/scss/_user-variables.scss",
  },
  clean: {
    dev: "dev/*",
    dist: "dist/*",
    origin: "marbaise-origin/*",
    webp: "marbaise-webp/*",
  },
};

/* Include gulp and plugins */
var gulp = require("gulp"),
  php = require("gulp-connect-php"),
  webp = require("gulp-webp"),
  webserver = require("browser-sync").create(),
  reload = webserver.reload,
  plumber = require("gulp-plumber"),
  sourcemaps = require("gulp-sourcemaps"),
  sass = require("gulp-sass")(require("sass")),
  sassUnicode = require("gulp-sass-unicode"),
  autoprefixer = require("gulp-autoprefixer"),
  cleanCSS = require("gulp-clean-css"),
  uglify = require("gulp-uglify"),
  cache = require("gulp-cache"),
  imagemin = require("gulp-imagemin"),
  jpegrecompress = require("imagemin-jpeg-recompress"),
  pngquant = require("imagemin-pngquant"),
  del = require("del"),
  fileinclude = require("gulp-file-include"),
  beautify = require("gulp-beautify"),
  minify = require("gulp-minify"),
  concat = require("gulp-concat"),
  jsImport = require("gulp-js-import"),
  newer = require("gulp-newer"),
  replace = require("gulp-replace"),
  touch = require("gulp-touch-cmd");

gulp.task("php", function () {
  // php.server({ base: "./dist", port: 8010, keepalive: true });
  php.server(
    {
      base: "./dist",
      port: 8010,
      keepalive: true,
      configCallback: function _configCallback(type, collection) {
        // If you wish to leave one of the argument types alone, simply return the passed in collection.
        if (type === php.OPTIONS_SPAWN_OBJ) {
          // As the constant suggests, collection is an Object.

          // Lets add a custom env var. Good for injecting AWS_RDS config variables.
          collection.env = Object.assign(
            {
              MY_CUSTOM_ENV_VAR: "env_var_value",
            },
            process.env
          );

          return collection;
        } else if (type === php.OPTIONS_PHP_CLI_ARR) {
          // As the constant suggests, collection is an Array.
          let newArgs = [
            "-e", // Generate extended information for debugger/profiler.
            "-d",
            "memory_limit=2G", // Define INI entry, Up memory limit to 2G.
          ];

          // Ensure our argument switches appear before the rest.
          return newArgs.concat(collection);
        }
      },
    },
    function _connected_callback() {
      console.log("PHP Development Server Connected.");
    }
  );
});

/* Server */
var config = {
  server: {
    baseDir: "./dist",
  },
  ghostMode: false, // By setting true, clicks, scrolls and form inputs on any device will be mirrored to all others
  notify: false,
};

/* Tasks */

// Start the server
// gulp.task("webserver", function () {
//   webserver(config);
// });
gulp.task("webserver", function () {
  webserver.init({
    proxy: "localhost:8010",
    baseDir: "./dist",
    open: true,
    notify: false,
  });
});

// Compile html
gulp.task("html:dist", function () {
  return gulp
    .src(path.src.html)
    .pipe(newer({ dest: path.dist.html, extra: path.watch.partials }))
    .pipe(plumber())
    .pipe(fileinclude({ prefix: "@@", basepath: path.src.partials }))
    .pipe(beautify.html({ indent_size: 2, preserve_newlines: false }))
    .pipe(gulp.dest(path.dist.html))
    .pipe(touch())
    .on("end", () => {
      reload();
    });
});

// Compile theme styles
gulp.task("css:dist", function () {
  return gulp
    .src(path.src.style)
    .pipe(newer(path.dist.style))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass().on("error", function (err) {
        sass.logError(err);
        this.emit("end");
      })
    )
    .pipe(sassUnicode())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(path.dist.style))
    .pipe(touch())
    .on("end", () => {
      reload();
    });
});

// Move fonts
gulp.task("fonts:dist", function () {
  return gulp
    .src(path.src.fonts)
    .pipe(newer(path.dist.fonts))
    .pipe(gulp.dest(path.dist.fonts));
});

// Compile font styles
gulp.task("fontcss:dist", function () {
  return gulp
    .src(path.src.fontcss)
    .pipe(newer(path.dist.fontcss))
    .pipe(plumber())
    .pipe(
      sass().on("error", function (err) {
        sass.logError(err);
        this.emit("end");
      })
    )
    .pipe(sassUnicode())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(
      beautify.css({
        indent_size: 2,
        preserve_newlines: false,
        newline_between_rules: false,
      })
    )
    .pipe(gulp.dest(path.dist.fontcss))
    .pipe(touch())
    .on("end", () => {
      reload();
    });
});

// Compile color styles
gulp.task("colorcss:dist", function () {
  return gulp
    .src(path.src.colorcss)
    .pipe(plumber())
    .pipe(
      sass().on("error", function (err) {
        sass.logError(err);
        this.emit("end");
      })
    )
    .pipe(sassUnicode())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest(path.dist.colorcss))
    .pipe(touch())
    .on("end", () => {
      reload();
    });
});

// Compile vendor styles
gulp.task("vendorcss:dist", function () {
  return gulp
    .src(path.src.vendorcss)
    .pipe(concat("plugins.css"))
    .pipe(cleanCSS())
    .pipe(gulp.dest(path.dist.css))
    .pipe(touch())
    .on("end", () => {
      reload();
    });
});

// Compile vendor plugins js
gulp.task("pluginsjs:dist", function () {
  return gulp
    .src([
      "node_modules/bootstrap/dist/js/bootstrap.bundle.js",
      path.src.vendorjs,
    ])
    .pipe(jsImport({ hideConsole: true }))
    .pipe(concat("plugins.js"))
    .pipe(uglify())
    .pipe(gulp.dest(path.dist.js))
    .pipe(touch())
    .on("end", () => {
      reload();
    });
});

// Compile theme js
gulp.task("themejs:dist", function () {
  return (
    gulp
      .src(path.src.themejs)
      .pipe(gulp.dest(path.dist.js))
      .pipe(plumber())
      //.pipe(uglify())
      .pipe(gulp.dest(path.dist.js))
      .on("end", () => {
        reload();
      })
  );
});

// Import File
gulp.task("file:dist", function () {
  return gulp
    .src(path.src.file)
    .pipe(newer(path.dist.file))
    .pipe(gulp.dest(path.dist.file));
});

// Move media
gulp.task("media:dist", function () {
  return gulp
    .src(path.src.media)
    .pipe(newer(path.dist.media))
    .pipe(gulp.dest(path.dist.media));
});

// Move php
gulp.task("php:dist", function () {
  return gulp
    .src(path.src.php)
    .pipe(newer(path.dist.php))
    .pipe(gulp.dest(path.dist.php));
});

// Image processing
gulp.task("image:dist", function () {
  return gulp
    .src(path.src.img)
    .pipe(newer(path.dist.img))
    .pipe(
      cache(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          jpegrecompress({
            progressive: true,
            max: 90,
            min: 80,
          }),
          pngquant(),
          imagemin.svgo({ plugins: [{ removeViewBox: false }] }),
        ])
      )
    )
    .pipe(gulp.dest(path.dist.img))
    .on("end", () => {
      reload();
    });
});

// marbaise conversions to webp
gulp.task("marbaise:dist", function () {
  return (
    gulp
      .src(path.src.marbaise)
      // .pipe(newer(path.dist.marbaise))
      .pipe(
        cache(
          imagemin([
            imagemin.gifsicle({ interlaced: true }),
            jpegrecompress({
              progressive: true,
              max: 90,
              min: 80,
            }),
            pngquant(),
            imagemin.svgo({ plugins: [{ removeViewBox: false }] }),
          ])
        )
      )
      .pipe(webp())
      .pipe(gulp.dest(path.dist.marbaise))
      .on("end", () => {
        reload();
      })
  );
});

// Remove catalog dev
gulp.task("clean:dist", function () {
  return del(path.clean.dist);
});
gulp.task("clean:origin", function () {
  return del(path.clean.origin);
});
gulp.task("clean:webp", function () {
  return del(path.clean.webp);
});

// Clear cache
gulp.task("cache:clear", function () {
  cache.clearAll();
});

// Assembly Dist
gulp.task(
  "build:dist",
  gulp.series(
    "clean:dist",
    gulp.parallel(
      "html:dist",
      "css:dist",
      "fontcss:dist",
      "colorcss:dist",
      "vendorcss:dist",
      "pluginsjs:dist",
      "themejs:dist",
      "fonts:dist",
      "media:dist",
      "php:dist",
      "image:dist",
      "marbaise:dist",
      "file:dist"
    )
  )
);

// Launching tasks when files change
gulp.task("watch", function () {
  gulp.watch(path.watch.html, gulp.series("html:dist"));
  gulp.watch(path.watch.css, gulp.series("css:dist"));
  gulp.watch(path.watch.fontcss, gulp.series("fontcss:dist"));
  gulp.watch(path.watch.colorcss, gulp.series("colorcss:dist"));
  gulp.watch(path.watch.vendorcss, gulp.series("vendorcss:dist"));
  gulp.watch(path.watch.vendorjs, gulp.series("pluginsjs:dist"));
  gulp.watch(path.watch.themejs, gulp.series("themejs:dist"));
  gulp.watch(path.watch.img, gulp.series("image:dist"));
  gulp.watch(path.watch.marbaise, gulp.series("marbaise:dist"));
  gulp.watch(path.watch.file, gulp.series("file:dist"));
  gulp.watch(path.watch.fonts, gulp.series("fonts:dist"));
  gulp.watch(path.watch.media, gulp.series("media:dist"));
  gulp.watch(path.watch.php, gulp.series("php:dist"));
  gulp.watch(path.watch.user, gulp.series("colorcss:dist"));
});

// Serve
gulp.task("serve", gulp.series(gulp.parallel("webserver", "php", "watch")));

// Dist
gulp.task("build:dist", gulp.series("build:dist"));

// Default tasks
gulp.task(
  "default",
  gulp.series("build:dist", gulp.parallel("webserver", "php", "watch"))
);
