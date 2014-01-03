var OLEditor = OLEditor || {};

(function (e) {

    var editor = null;

    var initEditor = function () {
        var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
            tabMode: 'indent',
            lineNumbers: true,
            lineWrapping: true,
            theme: 'solarized light'
        });
        return editor;
    };

    var initEditorStyle = function () {
        
        var w = parseInt(window.innerWidth);
        var h = parseInt(window.innerHeight);

        var choiceBox = document.getElementById('choiceBox');
        choiceBox.style.left = (w - parseInt(getStyle(choiceBox, 'width'))) / 2 + document.body.scrollLeft + 'px';
        choiceBox.style.top = (h - parseInt(getStyle(choiceBox, 'height'))) / 2 + document.body.scrollTop + 'px';

        var msgBoxArea = document.getElementById('msgBoxArea');
        msgBoxArea.style.width = w + document.body.scrollLeft + 'px';
        msgBoxArea.style.height = (h > 600? h : 600) + document.body.scrollTop + 'px';

    };

    /**
     *  获取DOM 元素样式 (私有方法)
     *  来源 (http://blog.sina.com.cn/s/blog_491997ee0100b13f.html)
     */
    var getStyle = function (elem, styleName) {
        if(elem.style[styleName]){
            return elem.style[styleName];
        }
        else if(elem.currentStyle){
            return elem.currentStyle[styleName];
        }
        else if(document.defaultView && document.defaultView.getComputedStyle) {
            styleName = styleName.replace(/([A-Z])/g,'-$1').toLowerCase();
            var s = document.defaultView.getComputedStyle(elem,'');
            return s && s.getPropertyValue(styleName);
        }
        else{
            return null;
        }
    };

    e.init = function () {
        editor = initEditor();
        var decorate = new Decorate();
        decorate.preView(editor);
        decorate.activeLine(editor);
        decorate.fullScreen(editor);
        decorate.matchHighlight(editor);
        decorate.jsHint(editor);
    };

    e.getValue = function () {
        if (editor == null) {
            console.log('get value error');
            return ;
        }
        return editor.getValue();
    };

    e.setValue = function (data) {
        if (editor == null) {
            console.log('set value error');
            return ;
        }
        editor.setValue(data);
    };

    e.showShorcuts = function () {
        initEditorStyle();
        msgBoxArea.style.display = 'block';
        window.addEventListener('resize', initEditorStyle);

    };

    e.backToEditor = function () {
        window.removeEventListener('resize', initEditorStyle);
        msgBoxArea.style.display = 'none';
    };

})(OLEditor);