<template>
    <select :multiple="form.multiple" v-model="form.value" :name="form.fullName" :ref="(el) => form.setElement(el)" @change="form.dispatchChange()">
        <option v-if="form.placeholder" value="" >{{ form.placeholder }}</option>
        <component v-if="size(form.preferredChoices) > 0" :is="getChoiceComponent(choice)" v-for="choice of form.preferredChoices" :choice="choice" :key="choice.label + '_preferred'" :preferredChoices="true" />
        <option v-if="size(form.preferredChoices) > 0" :disabled="true">{{ form.separator }}</option>-->
        <component :is="getChoiceComponent(choice)" v-for="choice of form.choices" :choice="choice" :key="choice.label" :preferredChoices="false" />
    </select>
</template>

<script setup lang="ts">
import {onMounted, onUpdated, ref} from "vue";
import {FormUtil} from "@enhavo/vue-form/form/FormUtil";
import * as _ from "lodash";
import {ChoiceForm} from "@enhavo/vue-form/model/ChoiceForm";
import $ from "jquery";
import select2 from "select2";

select2($);

const props = defineProps<{
    form: ChoiceForm
}>()

const form = props.form;

function size(object: object)
{
    return _.size((object));
}

function getChoiceComponent(choice: any)
{
    if (choice.choices.length > 0) {
        return 'form-choice-optgroup';
    }
    return 'form-choice-option';
}

onMounted(() => {
    $(form.element).select2();
});
</script>
