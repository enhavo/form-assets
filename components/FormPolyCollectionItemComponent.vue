<template>
    <div class="form-list-item" :ref="(el) => form.setElement(el)">
        <ul class="form-list-item-buttons-row" v-if="sortable || deletable">
            <slot name="buttons">
                <slot name="down-button">
                    <li v-if="sortable" class="form-list-item-buttons-button" @click="$emit('down', form)"><i class="icon icon-arrow_downward">down</i></li>
                </slot>

                <slot name="up-button">
                    <li v-if="sortable" class="form-list-item-buttons-button" @click="$emit('up', form)"><i class="icon icon-arrow_upward">up</i></li>
                </slot>

                <slot name="drag-button">
                    <li v-if="sortable" class="form-list-item-buttons-button drag-button"><i class="icon icon-drag">=</i></li>
                </slot>

                <slot name="delete-button">
                    <li  v-if="deletable" class="form-list-item-buttons-button" @click="$emit('delete', form)"><i class="icon icon-close">x</i></li>
                </slot>
            </slot>
        </ul>
        <slot>
            <div class="form-list-item-label" v-if="blockName">{{ blockName }}</div>
            <form-widget :form="form" />
        </slot>
    </div>
</template>

<script setup lang="ts">
import {Form} from "@enhavo/vue-form/model/Form";

const props = defineProps<{
    form: Form,
    sortable: boolean,
    deletable: boolean,
    blockName: string,
}>()
</script>
