MathJax = {
    tex: {
      inlineMath: [['$', '$'],],
    },
};
var editor;
$(document).ready(function () {
    editor = initEditor()
    autoSave()
});


function initEditor() {
    return new MediumEditor('.editable', {
        extensions: {
            // autolist: autolist, // init it after loading from localstorage to avoid range error
            table: new MediumEditorTable(),
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
                'justifyCenter',
                'justifyLeft',
                'justifyRight',
                'table',
                'customHtmlHr',
                'customHtmlSup',
                'customHtmlSmall',
                'orderedlist',
                'unorderedlist',
            ],
            static: true,
            sticky: true
        },
    });
}

function autoSave() {
    if (typeof(Storage) !== "undefined" && $("#autosave").length) {
        editor.setContent(window.localStorage.getItem('content'));
        editor.subscribe('editableInput', function (eventObj, editable) {
            window.localStorage.setItem('content', editor.getContent());
        });
        editor.extensions.autolist = new AutoList()
    }
}