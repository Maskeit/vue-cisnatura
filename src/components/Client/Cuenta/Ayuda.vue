<template>
    <div class="max-w-3xl p-6 bg-white shadow-lg rounded-lg">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Centro de Ayuda</h1>

        <div class="divide-y divide-gray-300">
            <div v-for="(item, index) in faqs" :key="index" class="py-4">
                <button @click="toggleAccordion(index)"
                    class="flex justify-between items-center w-full text-left text-lg font-medium text-gray-700 hover:text-green-600 transition">
                    {{ item.question }}
                    <span class="ml-2">
                        <ChevronDownIcon v-if="!isOpen(index)" class="h-6 w-6 text-gray-500" />
                        <ChevronUpIcon v-else class="h-6 w-6 text-green-500" />
                    </span>
                </button>
                <div v-if="isOpen(index)" class="mt-2 text-gray-600 transition-all duration-300">
                    {{ item.answer }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/outline";

const openIndex = ref(null);

const toggleAccordion = (index) => {
    openIndex.value = openIndex.value === index ? null : index;
};

const isOpen = (index) => openIndex.value === index;

const faqs = ref([
    {
        question: "📦 ¿Cómo rastreo mi pedido?",
        answer: "Puedes rastrear tu pedido con la guía que se te enviará a tu correo cuando tu pedido sea confirmado. Así podrás dar seguimiento a tu pedido, ya que los envíos y tiempos estimados de entrega son por parte de las paqueterías."
    },
    {
        question: "🛍️ ¿Cómo reporto un problema con mi pedido?",
        answer: "Para solicitar un reporte, envía un correo a cisnatura.ventas@gmail.com describiendo tu problema, adjunta evidencias si es posible."
    },
    {
        question: "💳 ¿Cuáles son los métodos de pago aceptados?",
        answer: "Aceptamos pagos con tarjeta de crédito, débito, transferencias y pagos en efectivo en tiendas Oxxo autorizadas."
    },
    {
        question: "🔒 ¿Cómo cambio mi contraseña?",
        answer: "Puedes cambiar tu contraseña en la configuración de tu cuenta, en la sección de seguridad."
    },
    {
        question: "📞 ¿Cómo contacto con soporte?",
        answer: "Puedes escribirnos a cisnatura.ventas@gmail.com o llamarnos al +52 314 352 8121 en horario de atención de Lunes a Viernes de 11:00 a 14:00 y de 16:00 a 19:30 ."
    }
]);
</script>

<style scoped>
/* Transición para el contenido del acordeón */
</style>