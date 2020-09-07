var Editor;
var Recognition
var beautifyHTML = require('js-beautify').html;
var CacheKey = window.location.pathname.split("/").pop().replace('.html', '');

var MathJax = {
    tex: {
      inlineMath: [['$', '$'],],
    },
};

$(document).ready(function () {
    Editor = getEditor()
    initSelectNav()
    initClickActions()
    initStorage()
    // initDictation()
});

function initSelectNav() {
    let uri = window.location.pathname.split("/").pop()
    $("#select-nav > option").each(function(){
        if ($(this).val() == uri ) $(this).prop("selected", true);
     })
}
function initDictation() {
    initMic()
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        return
    }
    Recognition = new SpeechRecognition();
    Recognition.continuous = true;
    Recognition.onresult = function(event) {
        if (event.results.length > 0) {
            var current = event.results[event.results.length-1][0]
            var result = current.transcript;
            Editor.setContent( Editor.getContent() + '<span class="pl-1">'+result+'</span>')
        }
    }
}

function initMic() {
    $("#mic").click(function(){
        if (!Recognition) {
            alert("Only Chrome and Firefox are supported")
            return
        }
        try {
            $(this).removeClass("fa-microphone-slash")
            $(this).addClass("fa-microphone blink")
            Recognition.start()
        } catch (error) {
            $(this).removeClass("fa-microphone blink")
            $(this).addClass("fa-microphone-slash")
            Recognition.stop() //already started - toggle
        }
    })
}

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
        $('.editable').printThis({
            importCSS: true,
            loadCSS: "https://unpkg.com/latex.css/style.min.css",
        });
    });
    $("#word-export").click(function(event) {
        $(".editable").wordExport();
    });
    $("#view-png").click(function(event) {
        html2canvas($('.editable')[0]).then(function(canvas) {
            $('#modal-png-div').append(canvas);
        });
    });
    $("#png-export").click(function(event) {
        html2canvas($('.editable')[0]).then(function(canvas) {
            var link = document.createElement('a');
            link.download = 'latex-writer.png';
            link.href = canvas.toDataURL("image/png")
            link.click();
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
            forcePlainText: true,
            cleanPastedHTML: true,
            cleanReplacements: [],
            cleanAttrs: ['class', 'style', 'dir'], //when cleanPastedHTML is true
            cleanTags: ['meta']
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
            u: new MediumButton({
                label:'u',
                start:'<u>',
                end:'</u>'
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
                'u',
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
