MathJax = {
    tex: {
      inlineMath: [['$', '$'],],
    },
};
var editor;
var beautify_html = require('js-beautify').html;
$(document).ready(function () {
    editor = initEditor()
    initActions()
});

function initActions() {
    $("#clear-storage").click(function(){
        var ok = confirm('Are you sure?');
        if (ok) {
            window.localStorage.clear()
            location.reload();
        }
    })
    $("#word-export").click(function(event) {
        $(".editable").wordExport();
    });
    $("#view-html").click(function(){
        var beautify_html = require('js-beautify').html;

        result = beautify_html(editor.getContent());
        $("#modal-html-pre").text(result)
    })

    if (typeof(Storage) !== "undefined") {
        var key = $(".editable").attr("id")
        var cached = window.localStorage.getItem(key)
        if (cached) {
            editor.setContent(cached);
        }

        editor.subscribe('editableInput', function (eventObj, editable) {
            window.localStorage.setItem(key, editor.getContent());
        });
        editor.extensions.autolist = new AutoList()
    }
}

function initEditor() {
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
            customHtmlP: new CustomHtml({
                buttonText: "<p>",
                htmlToInsert: "<p>"
            }),
            customHtmlHr: new CustomHtml({
                buttonText: "<hr>",
                htmlToInsert: "<hr>"
            }),
            customHtmlPre: new CustomHtml({
                buttonText: "<pre>",
                htmlToInsert: "<pre>"
            }),
            customHtmlSup: new CustomHtml({
                buttonText: "<sup>",
                htmlToInsert: "<sup>1</sup>"
            }),
            customHtmlSmall: new CustomHtml({
                buttonText: "<small>",
                htmlToInsert: "<small>small text</small>"
            }),
            customHtmlCode: new CustomHtml({
                buttonText: "<code>",
                htmlToInsert: "<code>code text</code>"
            }),
        },
        buttonLabels: 'fontawesome',
        toolbar: {
            buttons: [
                'customHtmlP',
                'bold',
                'italic',
                'h1',
                'h2',
                'h3',
                'quote',
                'anchor',
                'customHtmlPre',
                'justifyLeft',
                'justifyCenter',
                'justifyRight',
                'table',
                'customHtmlHr',
                'customHtmlSup',
                'customHtmlSmall',
                'customHtmlCode',
                'orderedlist',
                'unorderedlist',
                'colorPicker',
            ],
            static: true,
            sticky: true
        },
    });
}
