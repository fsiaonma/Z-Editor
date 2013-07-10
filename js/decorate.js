(function (w) {

    var d = function() {

        this.preView = function (editor) {
            var delay;
            updatePreview = function () {
                var previewFrame = document.getElementById('preview');
                var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
                preview.open();
                preview.write(editor.getValue());
                preview.close();
            };
            setTimeout(updatePreview, 300);
            editor.on("change", function() {
                clearTimeout(delay);
                delay = setTimeout(updatePreview, 300);
            });
        },

        this.activeLine = function (editor) {
            var hlLine = editor.addLineClass(0, "background", "activeline");
            editor.on("cursorActivity", function() {
                var cur = editor.getLineHandle(editor.getCursor().line);
                if (cur != hlLine) {
                  editor.removeLineClass(hlLine, "background", "activeline");
                  hlLine = editor.addLineClass(cur, "background", "activeline");
                }
            });
        },

        this.fullScreen = function (editor) {

            var isFullScreen = function (cm) {
                return /\bCodeMirror-fullscreen\b/.test(cm.getWrapperElement().className);
            };

            var toFull = function (cm) {
                
                var wrap = cm.getWrapperElement();
                wrap.className += " CodeMirror-fullscreen ui-full-screen";
                wrap.style.top = document.body.scrollTop + "px";
                wrap.style.left = '0px';
                wrap.style.height = window.innerHeight + "px";
                wrap.style.width = window.innerWidth / 2 + "px";

                var iframe = document.getElementById('preview');
                iframe.className += " CodeMirror-fullscreen ui-full-screen";
                iframe.style.top = document.body.scrollTop + "px";
                iframe.style.left = window.innerWidth / 2 + 'px';
                iframe.style.height = window.innerHeight + "px";
                iframe.style.width = window.innerWidth / 2 - 10 + "px";

                document.documentElement.style.overflow = "hidden";
            
            };

            var removeFull = function (el) {
                el.className = el.className.replace(" CodeMirror-fullscreen ui-full-screen", "");
                el.style.top = "";
                el.style.height = "";
                el.style.width = "";
                el.style.left = "";
                document.documentElement.style.overflow = "";
            };

            var setFullScreen = function (cm, full) {
                if (full) {
                    toFull(cm);
                } else {
                    removeFull(cm.getWrapperElement());
                    removeFull(document.getElementById('preview'));
                }
                cm.refresh();
            };

            CodeMirror.on(window, "resize", function() {
                var showing = document.body.getElementsByClassName("CodeMirror-fullscreen")[0];
                if (!showing) return;
                showing.CodeMirror.getWrapperElement().style.position = "abou";
                showing.CodeMirror.getWrapperElement().style.height = winHeight() + "px";
            });

            if (editor.options.extraKeys == null) {
                editor.options.extraKeys = {};
            }
            editor.options.extraKeys["F11"] = function (cm) {
                setFullScreen(cm, !isFullScreen(cm));
            }

        },

        this.matchHighlight = function (editor) {
            editor.on("cursorActivity", function() {
                editor.matchHighlight("CodeMirror-matchhighlight");
            });
        },

        this.jsHint = function (editor) {

            var widgets = [];

            var isJsHint = function () {
                return widgets.length != 0;
            };

            var updateHints = function (editor) {
                if (!isJsHint()) {
                    editor.operation( function () {
                        for (var i = 0; i < widgets.length; ++i)
                            editor.removeLineWidget(widgets[i]);
                        widgets.length = 0;
                        JSHINT(editor.getValue());
                        for (var j = 0; j < JSHINT.errors.length; ++j) {
                            var err = JSHINT.errors[j];
                            if (!err) continue;
                            var msg = document.createElement("div");
                            var icon = msg.appendChild(document.createElement("span"));
                            icon.innerHTML = "!!";
                            icon.className = "lint-error-icon";
                            msg.appendChild(document.createTextNode(err.reason));
                            msg.className = "lint-error";
                            widgets.push(editor.addLineWidget(err.line - 1, msg, {coverGutter: false, noHScroll: true}));
                        }
                    });
                    var info = editor.getScrollInfo();
                    var after = editor.charCoords({line: editor.getCursor().line + 1, ch: 0}, "local").top;
                    if (info.top + info.clientHeight < after)
                    editor.scrollTo(null, after - info.clientHeight + 3);
                } else if (isJsHint()) {
                    editor.operation( function () {
                        for (var i = 0; i < widgets.length; ++i)
                            editor.removeLineWidget(widgets[i]);
                        widgets.length = 0;
                    });
                }
            };

            if (editor.options.extraKeys == null) {
                editor.options.extraKeys = {};
            }
            editor.options.extraKeys['F10'] = function (cm) {
                updateHints(editor);
            };

        }
        
    }

    w.Decorate = d;

})(window);