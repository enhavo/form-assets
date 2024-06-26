import FormType from "@enhavo/app/form/FormType";
import tinymce from "tinymce";
// import 'tinymce/themes/silver/theme';
import $ from "jquery";


import 'tinymce/icons/default/icons.min.js';

/* Required TinyMCE components */
import 'tinymce/themes/silver/theme.min.js';
import 'tinymce/models/dom/model.min.js';

/* Import a skin (can be a custom skin instead of the default) */
import 'tinymce/skins/ui/oxide/skin.js';

// /* Import plugins */
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/code';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';


export default class WysiwygType extends FormType
{
    private generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    protected init() {
        /**
         * The id of the input field in tiny mce MUST be unique, otherwise it can't be initialized.
         * To make sure it has a unique id, we generate our own at on first initialize
         */
        let id = this.$element.attr('id');
        if(typeof id === 'undefined' || id === null || !id.match(/^wysiwyg_/)) {
            id = 'wysiwyg_' + this.generateId();
            this.$element.attr('id', id);
        }

        let editorCss = this.$element.data('editor-css');
        let options = {
            base_url: "/build/enhavo", // Because we use dynamic imports, we need to specify the base path to prevent a loading bug in firefox (https://github.com/tinymce/tinymce-docs/issues/1466)
            toolbar1: "undo redo | styleselect bold italic underline | forecolor backcolor | link | alignleft aligncenter alignright alignjustify | outdent indent | bullist numlist | code",
            target: this.$element.get(0),
            menubar: false,
            branding: false,
            // General options
            force_br_newlines: false,
            force_p_newlines: false,
            forced_root_block: "p",
            cleanup: false,
            cleanup_on_startup: false,
            font_size_style_values: "xx-small,x-small,small,medium,large,x-large,xx-large",
            convert_fonts_to_spans: true,
            resize: false,
            relative_urls: false,
            remove_script_host:false,
            plugins: ["advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste autoresize"],
            content_css: editorCss,
            min_height: 160,
            autoresize_on_init: false,
            autoresize_max_height: 1000,
            contextmenu: "",
            setup: function (editor: any) {
                editor.on('change', function () {
                    tinymce.triggerSave();
                });
            }
        };

        let configType = this.$element.data('wysiwyg');
        $(document).trigger('tinymceInit', {
            configType: configType,
            options: options
        });

        tinymce.init(options);
    }
}
