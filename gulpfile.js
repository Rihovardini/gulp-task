const gulp = require ('gulp');
const jshint = require ('gulp-jshint');
const less = require ('gulp-less');
const babel = require ('gulp-babel');
const copy = require ('gulp-copy');
const concat = require ('gulp-concat');
const uglify = require ('gulp-uglify');
const rm = require ('gulp-rm'); 
const browserSync = require ('browser-sync').create();
const livereload = require ('gulp-livereload');
const pump = require ('pump');
const directoryExists = require ('directory-exists');
const minify = require ('gulp-minify');
const del = require('del');


gulp.task('hint', () => {
    return gulp.src('src/temp/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('js', () => {
        return gulp.src('src/temp/*.js')
        .pipe(babel({
                presets: ['env']
            }))
        .pipe(gulp.dest('buid'))
        .pipe(livereload());
});

gulp.task('copy', () => {
        gulp.src('src/temp/*.js')
            .pipe(copy('buid',{
                    prefix:2 
               }));
});

gulp.task('concat', () => {
        return gulp.src('src/temp/*.js')
          .pipe(concat('all.js'))
          .pipe(gulp.dest('buid'))
});

gulp.task('compress', function (cb) {
    pump([
          gulp.src('src/temp/*.js'),
          uglify(),
          gulp.dest('buid')
      ],
      cb
    );
  });

gulp.task('del', ()=>{
     return gulp.src('buid')
            .pipe(rm());
});
      
gulp.task('less', () => {
     return gulp.src('./src/temp/*.less')
        .pipe(less())
        .pipe(gulp.dest('./buid'))
        .pipe(browserSync.stream())
        .pipe(livereload());
    });

gulp.task('serve', ['less'], () => {
    
        browserSync.init({
            server: "./"
        });
    
        gulp.watch("./src/temp/*.less", ['less']);
        gulp.watch("./buid/*.html").on('change', browserSync.reload);
    });

gulp.task('prod', () =>{
    directoryExists('prod')
        .then(result => {
            if(result){
                return del('prod');
            }
            else{
                gulp.src('./buid/*.css')
                    .pipe(copy('prod/css',{
                        prefix:1 
                    }));

                gulp.src('./src/temp/index.jade')
                    .pipe(copy('prod',{
                        prefix:2 
                    }));
                
                gulp.src('./src/temp/*.js')
                    .pipe(copy('prod/js',{
                        prefix:2
                    }))
                    .pipe(minify());
                
                    //gulp.src('prod/js/*.js')
                        
                   
                    
            }
        });
});

gulp.task('default', () => {
    livereload.listen();
    gulp.watch("./src/temp/*.less", ['less']);
    gulp.watch('./src/temp/*.js',['js']);
    
})
