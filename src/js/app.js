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
    initDictation()
});

function initDictation() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            var result = event.results[event.results.length-1][0].transcript;
            Editor.setContent( Editor.getContent() + '<span class="pl-1">'+result+'</span>')
        }
    }
    $("#mic").click(function(){
        try {
            $(this).removeClass("fa-microphone-slash")
            $(this).addClass("fa-microphone blink")
            recognition.start()
        } catch (error) {
            $(this).removeClass("fa-microphone blink")
            $(this).addClass("fa-microphone-slash")
            recognition.stop() //already started - toggle
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
