<template>
    <editor-content class="tiptap" :editor="editor" />
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
    extensions: [StarterKit],
    content: props.modelValue, // Carga el contenido inicial
    onUpdate: ({ editor }) => {
        emit("update:modelValue", editor.getHTML()); // Actualiza el valor
    },
});

// Sincronizar cambios si `modelValue` cambia externamente
watch(() => props.modelValue, (newValue) => {
    if (editor.value && editor.value.getHTML() !== newValue) {
        editor.value.commands.setContent(newValue, false);
    }
});

onBeforeUnmount(() => {
    if (editor.value) {
        editor.value.destroy();
    }
});
</script>

<style>
/* Agrega estilos para mejorar la apariencia del editor */
.tiptap {
    padding: 6px;
    border-radius: 5px;
    min-height: 200px;
    background-color: #ececec;
}
</style>