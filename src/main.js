import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

// PrimeVue Components
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';

import '@/assets/styles.scss';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);

// Register PrimeVue Components
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Button', Button);
app.component('InputText', InputText);
app.component('Textarea', Textarea);
app.component('Calendar', Calendar);
app.component('Dropdown', Dropdown);
app.component('Checkbox', Checkbox);
app.component('Dialog', Dialog);
app.component('Toast', Toast);
app.component('ProgressBar', ProgressBar);
app.component('Avatar', Avatar);
app.component('Tag', Tag);
app.component('Card', Card);
app.component('Badge', Badge);

app.mount('#app');
