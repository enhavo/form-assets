import FormType from "@enhavo/form/FormType";
import 'jquery-datetimepicker'
import 'jquery-datetimepicker/build/jquery.datetimepicker.min.css'

export default class DateType extends FormType
{
    protected init()
    {
        $.datetimepicker.setLocale('de');
        this.$element.datetimepicker({
            format:'d.m.Y H:i',
            timepicker: false,
            dayOfWeekStart: 1
        });
    }
}