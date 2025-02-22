<template>
    <div class="form-poly-collection" :ref="(el) => form.setElement(el as HTMLElement)" v-show="form.isVisible()">
        <slot name="button-row">
            <form-poly-collection-add-button :form="form" :add-after="null"></form-poly-collection-add-button>
        </slot>

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
                class="form-poly-collection-items"
            >
                <template #item="{ element }">
                    <div>
                        <component
                            :is="form.itemComponent"
                            :form="element"
                            :deletable="form.allowDelete"
                            :sortable="form.sortable"
                            :collapsable="form.collapsable"
                            :collapsed="form.isCollapsed(element)"
                            :block-name="form.blockName"
                            @delete="event => { form.deleteItem(event)} "
                            @up="event => { form.moveItemUp(event) }"
                            @down="event => { form.moveItemDown(event) }"
                            @uncollapse="event => { form.uncollapse(element) }"
                            @collapse="event => { form.collapse(element) }"
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

                        <slot name="button-row">
                            <form-poly-collection-add-button :form="form" :add-after="element"></form-poly-collection-add-button>
                        </slot>
                    </div>
                </template>
            </draggable>
        </slot>
    </div>
</template>

<script setup lang="ts">
import {PolyCollectionForm} from "@enhavo/form/form/model/PolyCollectionForm";
import * as draggableComponent from 'vuedraggable'
import FormPolyCollectionAddButton from "@enhavo/form/components/FormPolyCollectionAddButton.vue";

const draggable = draggableComponent;
const props = defineProps<{
    form: PolyCollectionForm
}>()

</script>
