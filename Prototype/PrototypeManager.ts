import * as $ from "jquery";
import Prototype from "@enhavo/form/Prototype/Prototype";

export class PrototypeManager
{
    private initialize: boolean = false;

    private prototypes: Prototype[] = [];

    init(element: HTMLElement)
    {
        if(this.initialize) {
            return;
        }

        this.initialize = true;

        $(element).find('[data-prototype-storage]').each((index, element) => {
            let $element = $(element);
            this.prototypes.push(new Prototype(
                $element.data('prototype-name'),
                $element.data('prototype-label'),
                $element.data('prototype-template'),
                $element.data('prototype-storage'),
                $element.data('prototype-parameters'),
            ));
        });
    }

    public getPrototypes(storageName: string): Prototype[]
    {
        let data = [];
        for (let prototype of this.prototypes) {
            if(prototype.getStorageName() == storageName) {
                data.push(prototype);
            }
        }
        return data;
    }
}

let manager = new PrototypeManager();
manager.init(<HTMLElement>$('body').get(0));
export default manager