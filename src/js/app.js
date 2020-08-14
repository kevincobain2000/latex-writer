var Editor;
var beautifyHTML = require('js-beautify').html;
var CacheKey = window.location.pathname.split("/").pop().replace('.html', '');

var MathJax = {
    tex: {
      inlineMath: [['$', '$'],],
    },
};

$(document).ready(function () {
    Editor = getEditor()
    initClickActions()
    initStorage()
});

function initClickActions() {
    $("#clear-storage").click(function(){
        var ok = confirm('Are you sure?');
        if (!ok) {
            return
        }
        window.localStorage.setItem(CacheKey, '')
        location.reload();
    })
    $("#pdf-export").click(function(event) {
        window.print()
    });
    $("#word-export").click(function(event) {
        $(".editable").wordExport();
    });
    $("#view-png").click(function(event) {
        html2canvas($('.editable')[0]).then(function(canvas) {
            $('#modal-png-div').append(canvas);
        });
    });

    $("#view-html").click(function(){
        result = beautifyHTML(Editor.getContent());
        $("#modal-html-pre").text(result)
    })
}
function initStorage() {

    if (typeof(Storage) !== "undefined") {
        var cached = window.localStorage.getItem(CacheKey)
        if (cached) {
            Editor.setContent(cached);
        }

        Editor.subscribe('editableInput', function (eventObj, editable) {
            window.localStorage.setItem(CacheKey, Editor.getContent());
        });
        Editor.extensions.autolist = new AutoList()
    }
}
function getEditor() {
    return new MediumEditor('.editable', {
        paste: {
            forcePlainText: false,
            cleanPastedHTML: false,
            cleanReplacements: [],
            // cleanAttrs: ['class', 'style', 'dir'],
            // cleanTags: ['meta']
        },
        extensions: {
            // autolist: autolist, // init it after loading from localstorage to avoid range error
            table: new MediumEditorTable(),
            colorPicker: new ColorPickerExtension(),
            hr: new MediumButton({
                label:'hr',
                start:'<hr>',
                end:'<br>'
            }),
            pre: new MediumButton({
                label:'pre',
                start:'<pre>',
                end:'</pre>'
            }),
            sup: new MediumButton({
                label:'<small>p</small><sup>sup</sup>',
                start:'<sup>',
                end:'</sup>'
            }),
            small: new MediumButton({
                label:'<small>sm</small>',
                start:'<small>',
                end:'</small>'
            }),
            code: new MediumButton({
                label:'code',
                start:'<code>',
                end:'</code>'
            }),
            p: new MediumButton({
                label:'P',
                start:'<p>',
                end:'</p>'
            }),
        },
        buttonLabels: 'fontawesome',
        toolbar: {
            buttons: [
                'p',
                'sup',
                'small',
                'bold',
                'italic',
                'h1',
                'h2',
                'h3',
                'quote',
                'anchor',
                'pre',
                'code',
                'justifyLeft',
                'justifyCenter',
                'justifyRight',
                'table',
                'hr',
                'orderedlist',
                'unorderedlist',
                'colorPicker',
            ],
            static: true,
            sticky: true
        },
    });
}
