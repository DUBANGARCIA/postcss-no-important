/**
 * Created by duban on 28/12/2016.
 */
import gulp from 'gulp';
import postcss from 'gulp-postcss';

gulp.task('default', () => {
    return gulp.src('./test/*.css')
        .pipe(postcss([
            require('./index.js')
        ]))
        .pipe(gulp.dest('./test/expected/'));
});
