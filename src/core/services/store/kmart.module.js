import ApiService from "@/core/services/api.service";

const token = localStorage.getItem('user_token')
const timeout = 2000
// action types
export const GET_TRANSAKSI_DETAIL = "getTransaksiDetail";
export const GET_TRANSAKSI_SUMMARY = "getTransaksiSummary";
export const GET_SALES_AREA = "getSalesArea";

// mutation types
export const SET_LOADINGTABLE = "SET_LOADINGTABLE";
export const SET_TRANSAKSI_DETAIL = "SET_TRANSAKSI_DETAIL";
export const SET_TRANSAKSI_SUMMARY = "SET_TRANSAKSI_SUMMARY";
export const SET_SALES_AREA = "SET_SALES_AREA";

const state = {
  loadingtable: false,
  dataSalesArea: [],
  dataTransaksiDetail: [],
  dataTransaksiSummary: [],
}

const mutations = {
  [SET_LOADINGTABLE](state, data) {
    state.loadingtable = data
  },
  [SET_SALES_AREA](state, data) {
    state.dataSalesArea = data
  },
  [SET_TRANSAKSI_DETAIL](state, data) {
    state.dataTransaksiDetail = data
  },
  [SET_TRANSAKSI_SUMMARY](state, data) {
    state.dataTransaksiSummary = data
  },
}

const getters = {
  salesAreaAll(state) {
    return state.dataSalesArea;
  },
  transaksiDetailAll(state) {
    return state.dataTransaksiDetail;
  },
  transaksiSummaryAll(state) {
    return state.dataTransaksiSummary;
  },
}

const actions = {
  [GET_SALES_AREA](context, url) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`kmart/get-sales-area?${url}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_SALES_AREA', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_TRANSAKSI_DETAIL](context, url) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`kmart/get-transaksi-detail?${url}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_TRANSAKSI_DETAIL', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_TRANSAKSI_SUMMARY](context, url) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`kmart/get-transaksi-summary?${url}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_TRANSAKSI_SUMMARY', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
}

export default {
  namespaced: true,
  actions,
  state,
  mutations,
  getters,
}