import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
    'en': {
        langLabel: 'Change language',
        menu: {
            dashboard: 'Dashboard',
            course: 'Course',
            qbank: 'Question Bank',
            qna: 'Q&A',
            setting: 'Settings',
            complaint: 'Complaint'
        },
        guide: 'For a guide and recipes on how to configure / customize this project,',
        checkout: 'check out the',
        plugins: 'Installed CLI Plugins',
        links: 'Essential Links',
        ecosystem: 'Ecosystem'
    },
    'id': {
        langLabel: 'Ganti bahasa',
        menu: {
            dashboard: 'Halaman Utama',
            course: 'Pelajaran',
            qbank: 'Bank Soal',
            qna: 'T&J',
            setting: 'Pengaturan',
            complaint: 'Protes Nilai'
        },
        guide: 'Para una guía y recetas sobre cómo configurar / personalizar este proyecto,',
        checkout: 'revisar la',
        plugins: 'Plugins de CLI instalados',
        links: 'Enlaces esenciales',
        ecosystem: 'Ecosistema'
    }
};
let lang = localStorage.getItem("lang");

const i18n = new VueI18n({
    locale: lang? lang : 'en', // set locale
    fallbackLocale: 'id', // set fallback locale
    messages, // set locale messages
});

export default i18n;