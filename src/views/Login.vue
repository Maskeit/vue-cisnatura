<template>
    <div>
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" placeholder="Correo" />
            <input v-model="password" type="password" placeholder="Contraseña" />
            <button type="submit">Login</button>
            <p v-if="errorMessage">{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script>
import { AuthService } from "@/services/AuthService";

export default {
    data() {
        return {
            email: "",
            password: "",
            errorMessage: "",
        };
    },
    methods: {
        async handleLogin() {
            try {
                const result = await AuthService.login(this.email, this.password);
                console.log("Login exitoso:", result);
                // Guardar tokens o redirigir
                localStorage.setItem("authToken", result.token);
                this.$router.push("/home");
            } catch (error) {
                this.errorMessage = "Credenciales incorrectas o error en el servidor";
            }
        },
    },
};
</script>