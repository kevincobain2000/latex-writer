const mix = require('laravel-mix');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.disableNotifications();
mix.setPublicPath('./public/')

mix
  .sass('./src/css/style.scss', 'public/css/style.css')
  .scripts([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/medium-editor/dist/js/medium-editor.min.js',
    './node_modules/medium-editor-custom-html/src/custom-html.min.js',
    './node_modules/medium-editor-tables/dist/js/medium-editor-tables.min.js',
    './node_modules/medium-editor-autolist/dist/autolist.min.js',
    './node_modules/file-saver/dist/FileSaver.js',
    // './node_modules/mathjax/es5/tex-mml-chtml.js',
    './src/js/vanilla-color-picker.js',
    './src/js/color-picker.js',
    './src/js/jquery.wordexport.js',
    './src/js/app.js',
  ], 'public/js/app.js')
  .sourceMaps()
  .version();
