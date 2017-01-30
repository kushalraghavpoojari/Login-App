var gulp = require('gulp');
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({lazy: true});
var args = require('yargs').argv;
var del = require('del');
var port = process.env.PORT || config.defaultPort;

//gulp-check
gulp.task('test', function(){
    log('check gulp');

    console.log("hello world!");
});

//gulp-task-listing
gulp.task('help', $.taskListing);

//gulp-default to task listing
gulp.task('default',['help']);

//jshint and jscs style check
gulp.task('codeanalysis', function(){
    log('jshint and jscs check');


    return gulp
            .src(config.alljs)
            .pipe($.print())
            //.pipe($.jscs())
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
            .pipe($.jshint.reporter('fail'));
});

//cleaning and injecting styles
gulp.task('styles', ['clean-styles'], function() {
    log('less to CSS');

    return gulp
            .src(config.less)
            .pipe($.print())
            .pipe($.plumber())
            .pipe($.less())
            .pipe($.autoprefixer({browser:['last 2 version', '>5%']}))  
            .pipe(gulp.dest('./.tmp/'));
});

//cleaning styles
gulp.task('clean-styles', function() {
    log('cleaning styles');

    var files = config.tmp + '**/*.css';
    clean(files);
});

//watching less changes
gulp.task('less-watcher', function() {
    log('watching changed files');

    gulp.watch([config.less], ['styles']);
});

//injecting files
gulp.task('wiredep', function() {
    log('HTML injection');

var wiredep = require('wiredep').stream;
var options = config.wiredepDefaultOptions;
    
    return gulp
            .src(config.index)
            .pipe(wiredep(options))
            .pipe($.inject(gulp.src(config.js)))
            .pipe(gulp.dest(config.client));

});

//injecting custom CSS files
gulp.task('inject',['wiredep', 'styles'], function() {
    log('custom CSS injection');

    return gulp
            .src(config.index)
            .pipe($.inject(gulp.src(config.css)))
            .pipe(gulp.dest(config.client));
});

//serve application in dev mode
gulp.task('serve-dev',['inject'], function() {
    log('styles,wiredep and nodemon');

    var isDev = true;
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev? 'dev': 'build'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
                .on('restart', function (event) {
                    log('************** NODEMON RESATRT ******************');
                    log('files changed on restart: \n' + event);

                    setTimeout(function(){
                        browserSync.notify('reloading now..');
                        browserSync.reload({stream: false});
                    },config.browserReloadDelay);
                })
                .on('start', function () {
                    log('************** NODEMON STARTED ******************');
                    
                    startBrowserSync();
                })
                .on('crash', function () {
                    log('************** NODEMON CRASHED ******************');
                })
                .on('exit', function () {
                    log('************** Exited Cleanly **************');
                });;
});
////////////////

function startBrowserSync() {
    // if (args.nosync || browserSync.active) {
    //     return;
    // }

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: [
            config.client + '**/*.*',
            '!' + config.less,
            config.tmp + '**/*.css'
        ],
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true,
            location: true
        },
        injectChanges: true,
        logFileChnages: true,
        logLevel: 'debug',
        logPrefix: 'gulp-patterns',
        notify: true
    };

    //watch less files here! fix the error with [styles] task!! ---> TODO

    browserSync(options);
}

function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));

    del(path);
}


 function log(msg) {
    if(typeof(msg) === 'object') {
        for(var item in msg) {
            if(msg.hasOwnProperty(item)){
                $.util.log($.uitl.colors.blue(msg[item]));
            }
        }
    }
    else { $.util.log($.util.colors.blue(msg));}
 }