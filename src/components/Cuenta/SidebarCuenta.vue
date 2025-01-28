<template>
  <div :class="[
    'relative top-0 left-0 transition-all duration-300 bg-green-900 text-white',
    isCollapsed ? 'w-16' : 'w-64',
  ]" @mouseleave="closeSidebar" @mouseenter="expandSidebar">
    <!-- Botón para colapsar/desplegar -->
    <button class="absolute top-4 right-4 bg-green-700 p-1 rounded-full md:hidden" @click="toggleSidebar">
      <Bars3Icon class="h-6 w-6" />
    </button>

    <!-- Logo -->
    <div class="flex items-center justify-center py-4">
      <div :class="['transition-opacity duration-300', isCollapsed ? 'opacity-0' : 'opacity-100']">
        Cuenta
      </div>
    </div>

    <!-- Menú -->
    <nav>
      <ul class="space-y-4 px-4">
        <!-- Perfil -->
        <li>
          <router-link to="/Cuenta" class="flex items-center gap-4 p-2 rounded-md hover:bg-green-700 transition">
            <UserIcon class="h-6 w-6" />
            <span :class="isCollapsed ? 'hidden' : ''">Perfil</span>
          </router-link>
        </li>

        <!-- Historial -->
        <li>
          <router-link to="/Cuenta/Historial"
            class="flex items-center gap-4 p-2 rounded-md hover:bg-green-700 transition">
            <CubeIcon class="h-6 w-6" />
            <span :class="isCollapsed ? 'hidden' : ''">Historial</span>
          </router-link>
        </li>

        <!-- Direcciones -->
        <li>
          <router-link to="/Cuenta/Direcciones"
            class="flex items-center gap-4 p-2 rounded-md hover:bg-green-700 transition">
            <MapPinIcon class="h-6 w-6" />
            <span :class="isCollapsed ? 'hidden' : ''">Direcciones</span>
          </router-link>
        </li>

        <!-- Configuración -->
        <li>
          <router-link to="/Cuenta/Configuracion"
            class="flex items-center gap-4 p-2 rounded-md hover:bg-green-700 transition">
            <Cog8ToothIcon class="h-6 w-6" />
            <span :class="isCollapsed ? 'hidden' : ''">Configuración</span>
          </router-link>
        </li>

        <!-- Ayuda -->
        <li>
          <router-link to="/Cuenta/Ayuda" class="flex items-center gap-4 p-2 rounded-md hover:bg-green-700 transition">
            <QuestionMarkCircleIcon class="h-6 w-6" />
            <span :class="isCollapsed ? 'hidden' : ''">Ayuda</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue';

// Importar los iconos de HeroIcons
import {
  Bars3Icon,
  UserIcon,
  CubeIcon,
  MapPinIcon,
  Cog8ToothIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/vue/20/solid';

const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const expandSidebar = () => {
  if (window.innerWidth >= 768) isCollapsed.value = false;
};

const closeSidebar = () => {
  if (window.innerWidth >= 768) isCollapsed.value = true;
};
</script>

<style scoped>
/* Ajusta el alto del sidebar */
.relative {
  height: auto;
  /* Altura se ajustará dinámicamente al contenido */
  position: sticky;
  /* Se mantiene dentro del scroll del contenido */
  top: 0;
  /* Fijado en la parte superior */
}
</style>