import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import i18n from './i18n';
import CurrencyBadge from 'vue-currency-symbol'

const app = createApp(App);
app.use(router);
app.use(i18n);
app.use(CurrencyBadge);
app.mount('#app');

