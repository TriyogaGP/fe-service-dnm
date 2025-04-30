import { createStore } from "vuex";

import api from './api.module';
import auth from './auth.module';
import user from './user.module';
import kmart from './kmart.module';
import kelas from './kelas.module';
import setting from './setting.module';
import upload from './upload.module';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    api,
    auth,
    user,
    kmart,
    kelas,
    setting,
    upload,
  },
});
