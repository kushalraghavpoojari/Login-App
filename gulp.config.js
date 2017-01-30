module.exports = function() {

    var client = './src/client/';
    var server = './src/server/';

    var config = {

        //nodeOptions

        nodeServer: server + 'app.js',
        server: server,
        defaultPort: 8080,

        //File paths
        alljs: [
        //'./src/*.js',
        './src/**/*.js',
        './*.js'],
        
        less: client + 'styles/styles.less',

        index: client + 'index.html',

        client: client,

        js: [
            client + '*.module.js',
            client + '*.routes.js',
            client + 'app/**/*.js'
        ],

        tmp: './.tmp/',

        css: './.tmp/styles.css',

        //wiredepDefault option

        bower: {
            json: require('./bower.json'),
            directory: './bower_components',
            ignorePath: '..'
        },

        browserReloadDelay: 1000

    };

    config.wiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };


    return config;
};