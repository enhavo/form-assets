import {Form} from "@enhavo/vue-form/model/Form";
import {FormFactory} from "@enhavo/vue-form/form/FormFactory";
import {FormPosition} from "@enhavo/form/form/model/FormPosition";
import {MoveEvent} from "@enhavo/form/form/event/MoveEvent";
import {DeleteEvent} from "@enhavo/form/form/event/DeleteEvent";
import {CreateEvent} from "@enhavo/form/form/event/CreateEvent";
import {ChangeEvent} from "@enhavo/vue-form/event/ChangeEvent";

export class FormList extends Form
{
    public border: boolean;
    public sortable: boolean;
    public allowDelete: boolean;
    public allowAdd: boolean;
    public blockName: string;
    public prototype: Form;
    public prototypeName: string;
    public index: number;
    public itemComponent: string;
    public draggableGroup: string;
    public draggableHandle: string;

    constructor(
        protected formFactory: FormFactory,
    ) {
        super();
    }

    init()
    {
        if (this.index === null) {
            let index = -1;
            for (let child of this.children) {
                let childIndex = parseInt(child.name);
                if (childIndex > index) {
                    index = childIndex;
                }
            }
            this.index = index+1;
        }
    }

    public deleteItem(child: Form)
    {
        let event = new DeleteEvent(child);
        this.eventDispatcher.dispatchEvent(event, 'delete')

        if (!event.isStopped()) {
            this.eventDispatcher.dispatchEvent(new ChangeEvent(this, {
                action: 'delete',
                item: child,
                origin: this
            }), 'change');
            this.children.splice(this.children.indexOf(child), 1);
        }
    }

    public addItem()
    {
        let item = this.createItem();
        this.children.push(item);
        this.updatePosition();
    }

    private createItem()
    {
        let item = JSON.parse(JSON.stringify(this.prototype));
        item = this.formFactory.create(item, this.getRoot().visitors, this);
        this.updateIndex(item, this.index);
        this.updateFullName(item);
        this.index++;

        let event = new CreateEvent(item)
        this.eventDispatcher.dispatchEvent(event, 'create')
        this.eventDispatcher.dispatchEvent(new ChangeEvent(this, {
            action: 'create',
            item: item,
            origin: this
        }), 'change');
        return event.form;
    }

    private updateIndex(item: any, index: number)
    {
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                if (typeof item[key] === "string") {
                    item[key] = item[key].replace(new RegExp(this.prototypeName, 'g'), index);
                } else if (typeof item[key] === "object" && (key == 'children' || key == 'prototype')) {
                    this.updateIndex(item[key], index);
                }
            }
        }
    }

    public moveItemUp(item: Form)
    {
        this.eventDispatcher.dispatchEvent(new MoveEvent(item), 'beforeMove')

        const fromIndex = this.children.indexOf(item);
        if (fromIndex === 0) {
            return;
        }

        const toIndex = fromIndex - 1;
        const element = this.children.splice(fromIndex, 1)[0];

        this.children.splice(toIndex, 0, element);

        this.updatePosition();

        this.eventDispatcher.dispatchEvent(new MoveEvent(item), 'move')
        this.eventDispatcher.dispatchEvent(new ChangeEvent(this, {
            action: 'move',
            item: item,
            origin: this
        }), 'change');
    }

    public moveItemDown(item: Form)
    {
        this.eventDispatcher.dispatchEvent(new MoveEvent(item), 'beforeMove')

        const fromIndex = this.children.indexOf(item);
        if (fromIndex === this.children.length - 1) {
            return;
        }

        const toIndex = fromIndex + 1;
        const element = this.children.splice(fromIndex, 1)[0];

        this.children.splice(toIndex, 0, element);

        this.updatePosition();

        this.eventDispatcher.dispatchEvent(new MoveEvent(item), 'move')
        this.eventDispatcher.dispatchEvent(new ChangeEvent(this, {
            action: 'move',
            item: item,
            origin: this
        }), 'change');
    }

    private updatePosition()
    {
        let i = 0;
        for (let child of this.children) {
            let grandChildren = child.children;
            for (let grandChild of grandChildren) {
                if ((<FormPosition>grandChild).position === true) {
                    grandChild.value = i.toString();
                    i++;
                }
            }
        }
    }

    public changeOrder(event: any)
    {
        if (event.added) {
            this.updateChangeIndex(event.added.element);
            this.index++;
        }

        this.updatePosition();
        let targetItem = null;

        if (event.moved) {
            targetItem = event.moved.element;
        } else if (event.added) {
            targetItem = event.added.element;
        }

        if (targetItem) {
            this.eventDispatcher.dispatchEvent(new MoveEvent(targetItem), 'move')
            this.eventDispatcher.dispatchEvent(new ChangeEvent(this, {
                action: 'move',
                item: targetItem,
                origin: this
            }), 'change');
        }
    }

    private updateChangeIndex(form: FormList)
    {
        form.name = this.index.toString();
        form.fullName = this.fullName + '[' + form.name + ']';
        form.parent = this;

        for (let child of form.children) {
            this.updateFullName(child);
        }
    }

    private updateFullName(form: Form)
    {
        form.fullName = form.parent.fullName + '[' + form.name + ']';
        for (let child of form.children) {
            this.updateFullName(child);
        }
    }
}