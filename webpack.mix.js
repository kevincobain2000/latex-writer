const mix = require('laravel-mix');
require('mix-html-builder');

mix.disableNotifications();
mix.setPublicPath('./docs/')



mix.html({
    htmlRoot: './src/*.html', // Your html root file(s)
    output: './', // The html output folder
    partialRoot: './src/partials',    // default partial path
    layoutRoot: './src/layouts',    // default partial path
    minify: {
        removeComments: true
    }
});

mix
  .sass('./src/css/style.scss', 'docs/css/style.css')
  .combine([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/medium-editor/dist/js/medium-editor.min.js',
    './node_modules/medium-editor-custom-html/src/custom-html.min.js',
    './node_modules/medium-editor-tables/dist/js/medium-editor-tables.min.js',
    './node_modules/medium-editor-autolist/dist/autolist.min.js',
    './node_modules/file-saver/dist/FileSaver.js',
    './node_modules/jquery-modal/jquery.modal.min.js',
    './node_modules/html2canvas/dist/html2canvas.min.js',
    // './node_modules/mathjax/es5/tex-mml-chtml.js', //disable it for font base path.
    './src/js/vanilla-color-picker.js',
    './src/js/color-picker.js',
    './src/js/jquery.wordexport.js'
  ],'docs/js/lib.js')
  .js([
    './src/js/app.js',
  ], 'docs/js/app.js')
  .sourceMaps()
  .version();
