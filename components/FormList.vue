<template>
    <div class="form-list" :ref="(el) => form.setElement(el as HTMLElement)" v-show="form.isVisible()">
        <slot name="list">
            <draggable
                v-model="form.children"
                item-key="name"
                @change="event => { form.changeOrder(event) }"
                @start="event => { form.dragStart(event) }"
                @end="event => { form.dragEnd(event) }"
                :group="form.draggableGroup"
                :handle="form.draggableHandle"
                :disabled="!form.sortable"
                class="form-list-items"
                :class="{'deletable': form.allowDelete, 'sortable': form.sortable, 'bordered': form.border}"
            >
                <template #item="{ element }">
                    <component
                        :is="form.itemComponent"
                        :form="element"
                        :deletable="form.allowDelete"
                        :sortable="form.sortable"
                        @delete="event => { form.deleteItem(event) }"
                        @up="event => { form.moveItemUp(event) }"
                        @down="event => { form.moveItemDown(event) }"
                    >
                        <template v-slot>
                            <slot name="item"></slot>
                        </template>
                        <template v-slot:buttons><slot name="item-buttons"></slot></template>
                        <template v-slot:down-button><slot name="item-down-button"></slot></template>
                        <template v-slot:up-button><slot name="item-up-button"></slot></template>
                        <template v-slot:delete-button><slot name="item-delete-button"></slot></template>
                        <template v-slot:drag-button><slot name="item-drag-button"></slot></template>
                    </component>
                </template>
            </draggable>
        </slot>

        <slot name="button-row">
            <div class="form-list-button-row" v-if="form.allowAdd">
                <slot name="buttons">
                    <div class="form-list-button" @click.prevent="form.addItem()">
                        <slot name="add-button">
                            +
                        </slot>
                    </div>
                </slot>
            </div>
        </slot>
    </div>
</template>

<script setup lang="ts">
import {ListForm} from "@enhavo/form/form/model/ListForm";
import * as draggableComponent from 'vuedraggable'

const draggable = draggableComponent;
const props = defineProps<{
    form: ListForm
}>()
</script>
