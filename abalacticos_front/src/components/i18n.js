import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                // Header translations
                "role": "Role",
                "username": "Username",
                "availability": "Availability",
                "players": "Players",
                "adminDashboard": "Admin Dashboard",
                "matches": "Matches",
                "login": "Login",
                "logout": "Logout",

                // Other translations
                "name": "Name",
                "surname": "Surname",
                "apps": "Apps",
                "wins": "Wins",
                "losses": "Losses",
                "draws": "Draws",
                "age": "Age",
                "debutDate": "Debut Date",
                "lastGK": "Last GK Date",
                "phoneNumber": "Phone Number",
                "address": "Address",
                "email": "Email",
                "birthday": "Birthday",
                "discordID": "Discord ID",
                "actions": "Actions",
                "delete": "Delete",
                "confirmDelete": "Are you sure you want to delete this user?"
            }
        },
        es: {
            translation: {
                // Header translations
                "role": "Rol",
                "username": "Nombre de usuario",
                "availability": "Disponibilidad",
                "players": "Jugadores",
                "adminDashboard": "Panel de Administración",
                "matches": "Partidos",
                "login": "Iniciar Sesión",
                "logout": "Cerrar Sesión",

                // Other translations
                "name": "Nombre",
                "surname": "Apellido",
                "apps": "Aplicaciones",
                "wins": "Victorias",
                "losses": "Derrotas",
                "draws": "Empates",
                "age": "Edad",
                "debutDate": "Fecha de debut",
                "lastGK": "Último GK",
                "phoneNumber": "Número de teléfono",
                "address": "Dirección",
                "email": "Correo electrónico",
                "birthday": "Cumpleaños",
                "discordID": "ID de Discord",
                "actions": "Acciones",
                "delete": "Eliminar",
                "confirmDelete": "¿Estás seguro de que quieres eliminar a este usuario?"
            }
        }
    },
    lng: "en", // Default language
    fallbackLng: "en",

    interpolation: {
        escapeValue: false // React already does escaping
    }
});

export default i18n;
