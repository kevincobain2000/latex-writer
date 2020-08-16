import purify from "purify-css"

var content = ['**/src/js/*.js', '**/src/**/*.html'];
var css = ['**/src/css/*.scss'];
let options = {
    output: "output.css",
    // Will minify CSS code in addition to purify.
    // minify: true,

    // Logs out removed selectors.
    rejected: true
}
purify(content, css, options)