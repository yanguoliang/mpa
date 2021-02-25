import Vue from 'vue';
import App from './app.vue';
// require(`./${process.env.PAGE}/index.js`);
const config = {
  data: {
    hasRouter: false,
    hasStore: false,
  },
  components: { App },
}
try {
  const store = require(`./${process.env.PAGE}/store`);
  config.store = store;
} catch (error) { }
try {
  const router = require(`./${process.env.PAGE}/router`);
  config.router = router.default;
  config.data.hasRouter = true;
  config.template = `<App :hasRouter='hasRouter' :hasStore='hasStore'/>`
} catch (error) {
  const Index = require(`./${process.env.PAGE}/index.vue`);
  config.components.Index = Index.default;
  config.template = `<Index/>`
}
const vm = new Vue(config)
vm.$mount('#app');