import $ from 'jquery'
import ConditionTypeConfig from "@enhavo/form/type/ConditionTypeConfig";
import ConditionObserver from "@enhavo/form/type/ConditionObserver";
import FormType from "@enhavo/app/form/FormType";

export default class ConditionType extends FormType
{
    public static subjects: ConditionType[] = [];

    private config: ConditionTypeConfig;

    private observers: ConditionObserver[] = [];

    private $input: JQuery;

    public static getFromElement(element: HTMLElement)
    {
        for(let condition of this.subjects) {
            if (condition.$element[0] === element) {
                return condition;
            }
        }
        return null;
    }

    public init() {

    }

    constructor(element: HTMLElement)
    {
        super(element);
        ConditionType.subjects.push(this);
        this.$element = $(element);
        this.config = this.$element.data('condition-type');

        let self = this;

        if(this.$element.prop('tagName').toLowerCase() == 'input') {
            this.$input = this.$element;
            this.$input.on('change', function(event) {
                self.notify();
            });
        } else if(this.$element.prop('tagName').toLowerCase() == 'select') {
            this.$input = this.$element;
        } else {
            this.$input = this.$element.find('input');
        }

        this.$input.on('change ifChecked', function(event) {
            self.notify();
        });
    }

    public register(observer: ConditionObserver)
    {
        this.observers.push(observer);
        observer.wakeUp(this);
    }

    public notify()
    {
        for (let observer of this.observers) {
            observer.wakeUp(this);
        }
    }

    public getId(): string
    {
        return this.config.id;
    }

    public getValue(): string
    {
        if(this.$input.length > 1) {
            let value = null;
            this.$input.each(function (index, element) {
                if($(element).is(':checked')) {
                    value = $(element).val();
                }
            });
            return value;
        }

        return this.$input.val();
    }
}