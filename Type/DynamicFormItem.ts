import * as $ from "jquery";
import DynamicFormType from "@enhavo/form/Type/DynamicFormType";

export default class DynamicFormItem
{
    private $element: JQuery;

    private dynamicForm: DynamicFormType;

    constructor(element: HTMLElement, dynamicForm: DynamicFormType)
    {
        this.dynamicForm = dynamicForm;
        this.$element = $(element);
        this.initActions();
        if(dynamicForm.isCollapse()) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    private initActions()
    {
        let dynamicForm = this;

        let $actions =  this.$element.children('[data-dynamic-form-item-action]');

        $actions.find('[data-dynamic-form-item-action-up]').click(function () {
            dynamicForm.up();
        });

        $actions.find('[data-dynamic-form-item-action-down]').click(function () {
            dynamicForm.down();
        });

        $actions.find('[data-dynamic-form-item-action-remove]').click(function () {
            dynamicForm.remove();
        });

        $actions.find('[data-dynamic-form-item-action-collapse]').click(function () {
            dynamicForm.collapse();
        });

        $actions.find('[data-dynamic-form-item-action-expand]').click(function () {
            dynamicForm.expand();
        });
    }

    public getElement(): HTMLElement
    {
        return <HTMLElement>this.$element.get(0);
    }

    public collapse()
    {
        let $actions =  this.$element.children('[data-dynamic-form-item-action]');

        $actions.find('[data-dynamic-form-item-action-expand]').show();
        $actions.find('[data-dynamic-form-item-action-collapse]').hide();
        this.$element.children('[data-dynamic-form-item-container]').hide();
    }

    public expand()
    {
        let $actions =  this.$element.children('[data-dynamic-form-item-action]');

        $actions.find('[data-dynamic-form-item-action-expand]').hide();
        $actions.find('[data-dynamic-form-item-action-collapse]').show();
        this.$element.children('[data-dynamic-form-item-container]').show();
    }

    public up()
    {
        let wyswigs = this.$element.find('[data-wysiwyg]');
        let self = this;
        if (wyswigs.length) {
            form.destroyWysiwyg(this.$element);
            this.dynamicForm.moveItemUp(this,function() {
                form.initWysiwyg(self.getElement());
            });
        } else {
            this.dynamicForm.moveItemUp(this);
        }
    }

    public down()
    {
        let wyswigs = this.$element.find('[data-wysiwyg]');
        let self = this;
        if (wyswigs.length) {
            form.destroyWysiwyg(this.$element);
            this.dynamicForm.moveItemDown(this,function() {
                form.initWysiwyg(self.getElement());
            });
        } else {
            this.dynamicForm.moveItemDown(this);
        }
    }

    public remove()
    {
        this.dynamicForm.removeItem(this);
    }
}