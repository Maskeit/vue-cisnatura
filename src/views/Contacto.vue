<template>
    <div class="bg-gray-100 min-h-screen">
        <!-- Header -->
        <header class=" py-8">
            <h1 class="text-white text-center text-4xl font-bold">CISnatura</h1>
            <h2 class="text-white text-center text-2xl">Fábrica de Remedios Herbolarios</h2>
            <h3 class="text-white text-center text-xl mt-2">Contáctanos</h3>
        </header>

        <!-- Contact Info Section -->
        <section class="container mx-auto px-4 py-12">
            <div class="bg-white shadow-md rounded-lg p-8">
                <h2 class="text-gray-800 text-2xl font-semibold mb-4">Domicilio</h2>
                <p class="text-gray-600">
                    C. Cóndor 103, Paraíso Salagua, 28869 Manzanillo, Colima
                </p>

                <h2 class="text-gray-800 text-2xl font-semibold mt-8 mb-4">Horario de atención</h2>
                <p class="text-gray-600">
                    Lunes a Viernes de 11:00 a 14:00 y de 16:00 a 19:30
                </p>

                <h2 class="text-gray-800 text-2xl font-semibold mt-8 mb-4">Teléfono</h2>
                <p class="text-gray-600">+52 314 352 8121</p>

                <h2 class="text-gray-800 text-2xl font-semibold mt-8 mb-4">Correo Electrónico</h2>
                <p class="text-gray-600">cisnatura.ventas@gmail.com</p>
            </div>
        </section>

        <!-- Google Maps Section -->
        <section class="container mx-auto px-4 py-12">
            <h2 class="text-gray-800 text-2xl font-semibold mb-6 text-center">Ubicación</h2>
            <div class="aspect-w-16 aspect-h-9">
                <iframe class="w-full h-full rounded-lg shadow-md"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.868743547542!2d-104.33444452402517!3d19.113413282098918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8424d66211d28407%3A0xa13dfff562522d08!2sCondor%20103%2C%20Para%C3%ADso%20Salagua%2C%2028869%20Manzanillo%2C%20Col.!5e0!3m2!1ses-419!2smx!4v1736888882011!5m2!1ses-419!2smx"
                    allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
        </section>
    </div>
</template>

<script setup>
</script>

<style scoped>
header{
    background-color: #3b590b;
}
</style>