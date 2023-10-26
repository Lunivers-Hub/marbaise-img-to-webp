"use strict";

/* Paths */
var path = {
  dist: {
    img: "marbaise-webp/",
  },
  src: {
    img: "marbaise-origin/**/*.*",
  },
  watch: {
    img: "marbaise-origin/**/*.*",
  },
  clean: {
    dist: "marbaise-webp/*",
  },
};

/* Include gulp and plugins */
var gulp = require("gulp"),
  webp = require("gulp-webp"),
  // webserver = require("browser-sync"),
  // reload = webserver.reload,
  cache = require("gulp-cache"),
  imagemin = require("gulp-imagemin"),
  jpegrecompress = require("imagemin-jpeg-recompress"),
  pngquant = require("imagemin-pngquant"),
  del = require("del"),
  newer = require("gulp-newer");

/* Tasks */

gulp.task("image:dist", function () {
  return (
    gulp
      .src(path.src.img)
      // .pipe(newer(path.dist.img))
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
            // imagemin.svgo({ plugins: [{ removeViewBox: false }] }),
          ])
        )
      )
      .pipe(webp())
      .pipe(gulp.dest(path.dist.img))
      .on("end", () => {
        // reload();
      })
  );
});

// Remove catalog dev
gulp.task("clean:dist", function () {
  return del(path.clean.dist);
});

// Clear cache
gulp.task("cache:clear", function () {
  cache.clearAll();
});

// Assembly Dist
gulp.task("build:dist", gulp.series("clean:dist", gulp.parallel("image:dist")));

// Launching tasks when files change
gulp.task("watch", function () {
  gulp.watch(path.watch.img, gulp.series("image:dist"));
});

// Dist
gulp.task("build:dist", gulp.series("build:dist"));

// Default tasks
gulp.task("default", gulp.series("build:dist", gulp.parallel("watch")));
