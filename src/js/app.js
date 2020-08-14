MathJax = {
    tex: {
      inlineMath: [['$', '$'],],
    },
};
var editor;
var beautifyHTML = require('js-beautify').html;
$(document).ready(function () {
    editor = initEditor()
    initActions()
});

function initActions() {
    $("#clear-storage").click(function(){
        var ok = confirm('Are you sure?');
        if (!ok) {
            return
        }
        window.localStorage.clear()
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
        result = beautifyHTML(editor.getContent());
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
