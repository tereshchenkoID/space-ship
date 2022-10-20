import util from 'gulp-util';

const production = util.env.production || util.env.prod || util.env._.indexOf('build') !== -1 || false;
const destPath = 'build';

const config = {
    env       : 'development',
    production: production,

    src: {
        root         : 'src',
        templates    : 'src/templates',
        templatesData: 'src/templates/data',
        pagelist     : 'src/index.yaml',
        scss         : 'src/scss',
        json         : 'src/json',
        scssGen      : 'src/scss/generated',
        js           : 'src/js',
        img          : 'src/img',
        svg          : 'src/img/svg',
        icons        : 'src/icons',
        iconsPng     : 'src/icons',
        iconsSvg     : 'src/icons',
        iconsFont    : 'src/icons',
        fonts        : 'src/fonts',
        lib          : 'src/lib',
        data         : 'src/data'
    },
    dest: {
        root : destPath,
        html : destPath,
        css  : destPath + '/css',
        js   : destPath + '/js',
        json : destPath + '/json',
        img  : destPath + '/img',
        fonts: destPath + '/fonts',
        lib  : destPath + '/lib',
        data : destPath + '/data'
    },

    setEnv: function(env) {
      if (typeof env !== 'string') return;
      this.env = env;
      this.production = env === 'production';
      process.env.NODE_ENV = env;
    },

    logEnv: function() {
        util.log(
          'Environment:',
          util.colors.white.bgRed(' ' + process.env.NODE_ENV + ' ')
        );
    },

    errorHandler: require('./util/handle-errors')
};

config.setEnv(production ? 'production' : 'development');

module.exports = config;
