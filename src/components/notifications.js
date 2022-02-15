import { toast } from "bulma-toast";

const defaults = {
  type: "is-info",
  position: "top-center",
  dismissible: true,
  closeOnClick: false,
  duration: 7000,
  single: true,
  animate: { in: 'slideInDown', out: 'fadeOut' },
};

const notify = (message, extraConfig) => {
  const config = { ...defaults, ...extraConfig };
  config.message = message;
  config.type = `${config.type} custom-width`;

  toast(config);
};

const success = (message, extraConfig) => {
  let config = extraConfig || {};
  config.type = `is-success`;
  notify(message, config);
};

const warning = (message, extraConfig) => {
  // const config = { ...defaults, ...extraConfig };
  let config = extraConfig || {};
  config.type = `is-warning`;
  notify(message, config);
};

const error = (message, extraConfig) => {
  let config = extraConfig || {};
  config.type = `is-danger`;
  notify(message, config);
};

const fatalError = () => {
  notify('Something went wrong, please try again, if the problem persists call the system administrator', { type: 'is-danger' });
};


export default {
  notify,
  success,
  warning,
  error,
  install(Vue, { store }) {
    Vue.prototype.$notify = notify;
    Vue.prototype.$success = success;
    Vue.prototype.$warning = warning;
    Vue.prototype.$error = error;
    Vue.prototype.$fatalError  = fatalError;

    store.$notify = notify;
    store.$success = success;
    store.$warning = warning;
    store.$error = error;
    store.$fatalError = fatalError;
  },
};
