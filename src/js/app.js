MathJax = {
    tex: {
      inlineMath: [['$', '$'],],
    },
};
var editor;
$(document).ready(function () {
    editor = initEditor()
    autoSave()
    $("#clear-storage").click(function(){
        var ok = confirm('Are you sure?');
        if (ok) {
            window.localStorage.setItem("index", '')
            window.localStorage.setItem("latex", '')
            window.localStorage.setItem("resume-flat", '')
            window.localStorage.setItem("resume-with-icons", '')
            location.reload();
        }
    })
    $("#word-export").click(function(event) {
        $(".editable").wordExport();
    });
});



/**
 * Custom `color picker` extension
 */
var ColorPickerExtension = MediumEditor.Extension.extend({
    name: "colorPicker",

    init: function () {
        this.button = this.document.createElement('button');
        this.button.classList.add('medium-editor-action');
        this.button.classList.add('editor-color-picker');
        this.button.title = 'Text color'
        this.button.innerHTML = '<i class="fa fa-paint-brush"></i>';

        this.on(this.button, 'click', this.handleClick.bind(this));
    },

    getButton: function () {
        return this.button;
    },

    handleClick: function (e) {
        e.preventDefault();
        e.stopPropagation();

        this.selectionState = this.base.exportSelection();

        // If no text selected, stop here.
        if (this.selectionState && (this.selectionState.end - this.selectionState.start === 0)) {
        return;
        }

        // colors for picker
        var pickerColors = [
        "#1abc9c",
        "#2ecc71",
        "#3498db",
        "#9b59b6",
        "#34495e",
        "#16a085",
        "#27ae60",
        "#2980b9",
        "#8e44ad",
        "#2c3e50",
        "#f1c40f",
        "#e67e22",
        "#e74c3c",
        "#bdc3c7",
        "#95a5a6",
        "#f39c12"
        ];

        var picker = vanillaColorPicker(this.document.querySelector(".medium-editor-toolbar-active .editor-color-picker").parentNode);
        picker.set("customColors", pickerColors);
        picker.set("positionOnTop");
        picker.openPicker();
        picker.on("colorChosen", function (color) {
        this.base.importSelection(this.selectionState);
        this.document.execCommand("styleWithCSS", false, true);
        this.document.execCommand("foreColor", false, color);
        }.bind(this));
    }
});
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

function autoSave() {
    if (typeof(Storage) !== "undefined") {
        var key = $(".editable").attr("id")
        var cached = window.localStorage.getItem(key)
        console.log('cached :', cached);
        if (cached) {
            editor.setContent(cached);
        }

        editor.subscribe('editableInput', function (eventObj, editable) {
            window.localStorage.setItem(key, editor.getContent());
        });
        editor.extensions.autolist = new AutoList()
    }
}

