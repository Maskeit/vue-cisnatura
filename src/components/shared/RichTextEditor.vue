<template>
    <div>
        <div ref="editor"></div>
    </div>
</template>

<script>
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default {
    props: {
        value: {
            type: String,
            required: true,
        },
    },
    watch: {
        value(newValue) {
            if (this.quill && this.quill.root.innerHTML !== newValue) {
                this.quill.root.innerHTML = this.sanitizeHtml(newValue || "");
            }
        },
    },
    methods: {
        sanitizeHtml(html) {
            if (!html) return "";
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            // Limpia cualquier nodo no válido
            const allowedTags = ["P", "STRONG", "EM", "UL", "LI", "OL", "A", "SPAN"];
            Array.from(tempDiv.querySelectorAll("*")).forEach((node) => {
                if (!allowedTags.includes(node.tagName)) {
                    node.remove();
                }
            });

            return tempDiv.innerHTML;
        },
        getContent() {
            // Devuelve el contenido actual del editor
            return this.quill.root.innerHTML;
        },
    },
    mounted() {
        this.quill = new Quill(this.$refs.editor, {
            theme: "snow",
            modules: {
                toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ align: [] }],
                    //["link", "image"],
                ],
            },
        });

        // Limpia y valida el contenido HTML antes de asignarlo
        const sanitizedContent = this.sanitizeHtml(this.value || "");
        this.quill.root.innerHTML = sanitizedContent;

        this.quill.on("text-change", () => {
            this.$emit("input", this.quill.root.innerHTML);
        });
    }
};
</script>