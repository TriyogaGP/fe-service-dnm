import ApiService from "@/core/services/api.service";

const token = localStorage.getItem('user_token')
const timeout = 2000
// action types
export const GET_ADMINISTRATOR = "getAdministrator";
export const GET_ADMINISTRATOR_BY = "getAdministratorbyUID";
export const POST_ADMINISTRATOR = "postAdministrator";
export const GET_ORDER = "getOrder";
export const GET_ORDER_SUMMARY_BYPRODUCT = "getOrderSummarybyProduct";
export const GET_ORDER_BYPRODUCT = "getOrderbyProduct";
export const GET_DETAIL_ORDER = "getDetailOrder";
export const GET_PRODUCT_VARIANT = "getProductVariant";
export const GET_CONSUMER = "getConsumer";
export const GET_REGIST_MEMBER = "getRegistMember";
export const GET_SURVEI_DNM = "getSurveiDNM";
export const GET_WAREHOUSE_STOCKIST = "getWarehouseStockist";
export const GET_DETAIL_MEMBER_KNET = "getDetailMemberKNET";
export const HIT_UPDATE_STATUS = "hitUpdateStatus";
export const CHECK_PAYMENT = "checkPayment";
export const HIT_ORDER_MANUAL = "hitOrderManual";
export const HIT_COD_CONFIRM = "hitCODConfirm";

// mutation types
export const SET_LOADINGTABLE = "SET_LOADINGTABLE";
export const SET_ADMINISTRATOR = "SET_ADMINISTRATOR";
export const SET_ADMINISTRATORBY = "SET_ADMINISTRATORBY";
export const SET_ORDER = "SET_ORDER";
export const SET_ORDER_SUMMARY_BYPRODUCT = "SET_ORDER_SUMMARY_BYPRODUCT";
export const SET_ORDER_BYPRODUCT = "SET_ORDER_BYPRODUCT";
export const SET_DETAIL_ORDER = "SET_DETAIL_ORDER";
export const SET_PRODUCT_VARIANT = "SET_PRODUCT_VARIANT";
export const SET_CONSUMER = "SET_CONSUMER";
export const SET_REGIST_MEMBER = "SET_REGIST_MEMBER";
export const SET_SURVEI_DNM = "SET_SURVEI_DNM";
export const SET_WAREHOUSE_STOCKIST = "SET_WAREHOUSE_STOCKIST";
export const SET_DETAIL_MEMBER_KNET = "SET_DETAIL_MEMBER_KNET";

const state = {
  loadingtable: false,
  dataAdministrator: [],
  dataAdministratorBy: null,
  dataOrder: [],
  dataOrderSummarybyPrd: [],
  dataOrderbyPrd: [],
  dataDetailOrder: [],
  dataProductVariant: [],
  dataConsumer: [],
  dataRegistMember: [],
  dataSurveiDNM: [],
  dataWarehouseStockist: [],
  dataDetailMemberKNET: [],
}

const mutations = {
  [SET_LOADINGTABLE](state, data) {
    state.loadingtable = data
  },
  [SET_ADMINISTRATOR](state, data) {
    state.dataAdministrator = data
  },
  [SET_ADMINISTRATORBY](state, data) {
    state.dataAdministratorBy = data
  },
  [SET_ORDER](state, data) {
    state.dataOrder = data
  },
  [SET_ORDER_SUMMARY_BYPRODUCT](state, data) {
    state.dataOrderSummarybyPrd = data
  },
  [SET_ORDER_BYPRODUCT](state, data) {
    state.dataOrderbyPrd = data
  },
  [SET_DETAIL_ORDER](state, data) {
    state.dataDetailOrder = data
  },
  [SET_PRODUCT_VARIANT](state, data) {
    state.dataProductVariant = data
  },
  [SET_CONSUMER](state, data) {
    state.dataConsumer = data
  },
  [SET_REGIST_MEMBER](state, data) {
    state.dataRegistMember = data
  },
  [SET_SURVEI_DNM](state, data) {
    state.dataSurveiDNM = data
  },
  [SET_WAREHOUSE_STOCKIST](state, data) {
    state.dataWarehouseStockist = data
  },
  [SET_DETAIL_MEMBER_KNET](state, data) {
    state.dataDetailMemberKNET = data
  },
}

const getters = {
  administratorAll(state) {
    return state.dataAdministrator;
  },
  administratorBy(state) {
    return state.dataAdministratorBy;
  },
  orderAll(state) {
    return state.dataOrder;
  },
  consumerAll(state) {
    return state.dataConsumer;
  },
  registerAll(state) {
    return state.dataRegistMember;
  },
  surveiAll(state) {
    return state.dataSurveiDNM;
  },
  warehousestockistAll(state) {
    return state.dataWarehouseStockist;
  },
}

const actions = {
  [GET_ADMINISTRATOR](context, url) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/admin?${url}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_ADMINISTRATOR', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_ADMINISTRATOR_BY](context, uid) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/admin/${uid}`, token)
      .then((response) => {
        context.commit('SET_ADMINISTRATORBY', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [POST_ADMINISTRATOR](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`user/admin`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_ORDER](context, url) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/data-order?${url}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_ORDER', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_ORDER_SUMMARY_BYPRODUCT](context, bodyData) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.put(`user/data-order-summary-byproduct?${bodyData.get.url}`, token, bodyData.post)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_ORDER_SUMMARY_BYPRODUCT', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_ORDER_BYPRODUCT](context, bodyData) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.put(`user/data-leader-order-byproduct?${bodyData.get.url}`, token, bodyData.post)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_ORDER_BYPRODUCT', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_DETAIL_ORDER](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.put(`user/data-detail-order/${bodyData.param.idUser}?${bodyData.get.url}`, token, bodyData.post)
      .then((response) => {
        context.commit('SET_DETAIL_ORDER', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_PRODUCT_VARIANT](context, bodyData) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.post(`user/data-product-variant`, token, bodyData)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_PRODUCT_VARIANT', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [GET_CONSUMER](context, url) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/data-consumer?${url}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_CONSUMER', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_REGIST_MEMBER](context, url) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/data-regist-in-apps?${url}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_REGIST_MEMBER', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_SURVEI_DNM](context, url) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/data-survei-dnm?${url}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_SURVEI_DNM', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_WAREHOUSE_STOCKIST](context, url) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`user/data-warehouse-stokist?${url}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_WAREHOUSE_STOCKIST', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_DETAIL_MEMBER_KNET](context, idMember) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/check-member-detail/${idMember}`, token)
      .then((response) => {
        context.commit('SET_DETAIL_MEMBER_KNET', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [HIT_UPDATE_STATUS](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.put(`user/hit-update-status?status=${bodyData.get.status}&remarks=${bodyData.get.remarks}`, token, bodyData.post)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [CHECK_PAYMENT](context, orderNumber) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/check-payment?inv=${orderNumber}`, token)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [HIT_ORDER_MANUAL](context, orderNumber) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/hit-order-manual?inv=${orderNumber}`, token)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [HIT_COD_CONFIRM](context, orderNumber) {
    return new Promise((resolve, reject) => {
      ApiService.get(`user/hit-cod-confirmation?inv=${orderNumber}`, token)
      .then((response) => {
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