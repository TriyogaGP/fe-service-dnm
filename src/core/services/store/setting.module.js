import ApiService from "@/core/services/api.service";

const token = '12qwaszx@321123'

// action types
export const GET_ANAK = "getAnak";
export const GET_OMPU = "getOmpu";
export const GET_KOMISARISWILAYAH = "getKomisarisWilayah";
export const GET_WILAYAHPANJAITAN = "getWilayahPanjaitan";
export const GET_WILAYAH = "getWilayah";
export const GET_WILAYAH2023 = "getWilayah2023";
export const GET_BERKAS = "getBerkas";
export const GET_PRODUCT = "getProduct";
export const GET_MENU = "getMenu";
export const GET_UID = "getUID";
export const GET_CMS_SETTINGS = "getCMSSettings";
export const POST_CMS_SETTINGS = "postCMSSettings";
export const GET_KOMISARIS_WILAYAH = "getKomisaris";
export const POST_KOMISARIS_WILAYAH = "postKomisaris";
export const GET_WILAYAH_PANJAITAN = "getWilayahPanjaitans";
export const POST_WILAYAH_PANJAITAN = "postWilayahPanjaitans";
export const GET_ROLE = "getRole";
export const POST_ROLE = "postRole";
export const GET_MENUDATA = "getMenuData";
export const POST_MENUDATA = "postMenuData";
export const GET_SEQUENCEMENU = "getSequenceMenu";
export const POST_SEQUENCEMENU = "postSequenceMenu";
export const GET_ROLEMENU = "getRoleMenu";
export const POST_ROLEMENU = "postRoleMenu";
export const GET_KATEGORI_NOTIFIKASI = "getKategoriNotifikasi";
export const GET_NOTIFIKASI = "getNotifikasi";
export const POST_NOTIFIKASI = "postNotifikasi";
export const GET_USER_BROADCAST = "getUserBroadcast";
export const GET_COUNT_NOTIFIKASI = "getCountNotifikasi";
export const GET_DATA_BERKAS = "getDataBerkas";
export const POST_DATA_BERKAS = "postDataBerkas";
export const GET_DATA_PRODUCT_SETUP = "getDataProductSetup";
export const POST_DATA_PRODUCT_SETUP = "postDataProductSetup";
export const GET_DAERAH = "getDaerah";
export const POST_DAERAH = "postDaerah";

// mutation types
export const SET_LOADINGTABLE = "SET_LOADINGTABLE";
export const SET_ANAK = "SET_ANAK";
export const SET_OMPU = "SET_OMPU";
export const SET_KOMISARISWILAYAH = "SET_KOMISARISWILAYAH";
export const SET_WILAYAHPANJAITAN = "SET_WILAYAHPANJAITAN";
export const SET_WILAYAH = "SET_WILAYAH";
export const SET_BERKAS = "SET_BERKAS";
export const SET_PRODUCT = "SET_PRODUCT";
export const SET_MENU = "SET_MENU";
export const SET_UID = "SET_UID";
export const SET_CMSSETTINGS = "SET_CMSSETTINGS";
export const SET_KOMISARIS_WILAYAH = "SET_KOMISARIS_WILAYAH";
export const SET_WILAYAH_PANJAITAN = "SET_WILAYAH_PANJAITAN";
export const SET_ROLE = "SET_ROLE";
export const SET_MENUDATA = "SET_MENUDATA";
export const SET_SEQUENCEMENU = "SET_SEQUENCEMENU";
export const SET_ROLEMENU = "SET_ROLEMENU";
export const SET_KATEGORI_NOTIFIKASI = "SET_KATEGORI_NOTIFIKASI";
export const SET_NOTIFIKASI = "SET_NOTIFIKASI";
export const SET_USER_BROADCAST = "SET_USER_BROADCAST";
export const SET_DATA_BERKAS = "SET_DATA_BERKAS";
export const SET_DATA_PRODUCT_SETUP = "SET_DATA_PRODUCT_SETUP";
export const SET_DAERAH = "SET_DAERAH";

const state = {
  loadingtable: false,
  ompuOptions: [],
  komisariswilayahOptions: [],
  wilayahpanjaitanOptions: [],
  ProvinsiOptions: [],
  KabKotaOptions: [],
  KecamatanOptions: [],
  KelurahanOptions: [],
  ProvinsiOnlyOptions: [],
  KabKotaOnlyOptions: [],
  KecamatanOnlyOptions: [],
  KelurahanOnlyOptions: [],
  daerahOptions: [],
  menuOptions: [],
  berkasOptions: [],
  productOptions: [],

  dataAnak: [],
  dataKomisarisWilayah: [],
  dataWilayahPanjaitan: [],
  dataRole: [],
  dataMenu: [],
  dataSequenceMenu: [],
  dataRoleMenu: [],
  dataKategoriNotifikasi: [],
  dataNotifikasi: [],
  dataUserBroadcast: [],
  dataBerkas: [],
  dataProductSetup: [],

  dataCountNotifikasi: null,
  dataUID: null,
  dataCMSSetting: null,
}

const mutations = {
  [SET_LOADINGTABLE](state, data) {
    state.loadingtable = data
  },
  [SET_ANAK](state, data) {
    state.dataAnak = data
  },
  [SET_OMPU](state, data) {
    state.ompuOptions = data
  },
  [SET_KOMISARISWILAYAH](state, data) {
    state.komisariswilayahOptions = data
  },
  [SET_WILAYAHPANJAITAN](state, data) {
    state.wilayahpanjaitanOptions = data
  },
  [SET_WILAYAH](state, data) {
    if(data.kategori === 'provinsi'){
      state.ProvinsiOptions = data.wilayah
      state.ProvinsiOnlyOptions = data.wilayah
    }else if(data.kategori === 'kabkota'){
      state.KabKotaOptions = data.wilayah
    }else if(data.kategori === 'kecamatan'){
      state.KecamatanOptions = data.wilayah
    }else if(data.kategori === 'kelurahan'){
      state.KelurahanOptions = data.wilayah
    }else if(data.kategori === 'kabkotaOnly'){
      state.KabKotaOnlyOptions = data.wilayah
    }else if(data.kategori === 'kecamatanOnly'){
      state.KecamatanOnlyOptions = data.wilayah
    }else if(data.kategori === 'kelurahanOnly'){
      state.KelurahanOnlyOptions = data.wilayah
    }
  },
  [SET_DAERAH](state, data) {
    state.daerahOptions = data
  },
  [SET_BERKAS](state, data) {
    state.berkasOptions = data
  },
  [SET_PRODUCT](state, data) {
    state.productOptions = data
  },
  
  [SET_UID](state, data) {
    state.dataUID = data
  },
  [SET_CMSSETTINGS](state, data) {
    state.dataCMSSetting = data
  },
  [SET_KOMISARIS_WILAYAH](state, data) {
    state.dataKomisarisWilayah = data
  },
  [SET_WILAYAH_PANJAITAN](state, data) {
    state.dataWilayahPanjaitan = data
  },
  [SET_MENU](state, data) {
    state.menuOptions = data
  },
  [SET_ROLE](state, data) {
    state.dataRole = data
  },
  [SET_MENUDATA](state, data) {
    state.dataMenu = data
  },
  [SET_SEQUENCEMENU](state, data) {
    state.dataSequenceMenu = data
  },
  [SET_ROLEMENU](state, data) {
    state.dataRoleMenu = data
  },
  [SET_KATEGORI_NOTIFIKASI](state, data) {
    state.dataKategoriNotifikasi = data
  },
  [SET_NOTIFIKASI](state, data) {
    state.dataNotifikasi = data
  },
  [SET_USER_BROADCAST](state, data) {
    state.dataUserBroadcast = data
  },
  [SET_DATA_BERKAS](state, data) {
    state.dataBerkas = data
  },
  [SET_DATA_PRODUCT_SETUP](state, data) {
    state.dataProductSetup = data
  },
}

const getters = {
  userUID(state) {
    return state.dataUID;
  },
  cmssettings(state) {
    return state.dataCMSSetting;
  },
  anakAll(state) {
    return state.dataAnak;
  },
  komisariswilayahAll(state) {
    return state.dataKomisarisWilayah;
  },
  wilayahpanjaitanAll(state) {
    return state.dataWilayahPanjaitan;
  },
  roleAll(state) {
    return state.dataRole;
  },
  menuAll(state) {
    return state.dataMenu;
  },
  sequencemenuAll(state) {
    return state.dataSequenceMenu;
  },
  rolemenuAll(state) {
    return state.dataRoleMenu;
  },
  kategoriAll(state) {
    return state.dataKategoriNotifikasi;
  },
  notifikasiAll(state) {
    return state.dataNotifikasi;
  },
  userBroadcastAll(state) {
    return state.dataUserBroadcast;
  },
  berkasAll(state) {
    return state.dataBerkas;
  },
  productSetupAll(state) {
    return state.dataProductSetup;
  },
  daerahAll(state) {
    return state.daerahOptions;
  },
}

const actions = {
  [GET_ANAK](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsAnak${data.uid ? `?uid=${data.uid}` : ''}`, token)
      .then((response) => {
          context.commit('SET_ANAK', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_OMPU](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsOmpu`, token)
      .then((response) => {
          context.commit('SET_OMPU', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_KOMISARISWILAYAH](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsKomisarisWilayah${typeof data.kodeWilayah !== 'undefined' ? `?kodeWilayah=${data.kodeWilayah}` : ''}`, token)
      .then((response) => {
          context.commit('SET_KOMISARISWILAYAH', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_WILAYAHPANJAITAN](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsWilayahPanjaitan`, token)
      .then((response) => {
          context.commit('SET_WILAYAHPANJAITAN', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_WILAYAH](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsWilayah?bagian=${data.bagian}&KodeWilayah=${data.KodeWilayah}`, token)
      .then((response) => {
          context.commit('SET_WILAYAH', { wilayah: response.data.result, kategori: data.bagian })
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_WILAYAH2023](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsWilayah2023?bagian=${data.bagian}&KodeWilayah=${data.KodeWilayah}`, token)
      .then((response) => {
          context.commit('SET_WILAYAH', { wilayah: response.data.result, kategori: data.bagian })
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_BERKAS](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsBerkas${data.kategori ? `?kategori=${data.kategori}` : ''}`, token)
      .then((response) => {
          context.commit('SET_BERKAS', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_PRODUCT](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsProduct`, token)
      .then((response) => {
          context.commit('SET_PRODUCT', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_MENU](context, roleID) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/optionsMenu`, localStorage.getItem('user_token'))
      .then((response) => {
          context.commit('SET_MENU', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },

  [GET_UID](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/getUID`, token)
      .then((response) => {
          context.commit('SET_UID', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_CMS_SETTINGS](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/cmssetting`, token)
      .then((response) => {
          context.commit('SET_CMSSETTINGS', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [POST_CMS_SETTINGS](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.put(`settings/cmssetting`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_KOMISARIS_WILAYAH](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/KomisarisWilayah?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}${data.sorting !== '' ? `&sort=${data.sorting}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_KOMISARIS_WILAYAH', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [POST_KOMISARIS_WILAYAH](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/KomisarisWilayah`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_WILAYAH_PANJAITAN](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/WilayahPanjaitan?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}${data.sorting !== '' ? `&sort=${data.sorting}` : ''}`, token)
      .then((response) => {
        context.commit('SET_LOADINGTABLE', false)
        context.commit('SET_WILAYAH_PANJAITAN', response.data.result)
        resolve(response);
      })
      .catch((error) => {
        context.commit('SET_LOADINGTABLE', false)
        reject(error);
      })
    });
  },
  [POST_WILAYAH_PANJAITAN](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/WilayahPanjaitan`, token, bodyData)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
    });
  },
  [GET_ROLE](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/Role?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_ROLE', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          context.commit('SET_LOADINGTABLE', false)
          reject(error);
        })
    });
  },
  [POST_ROLE](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/Role`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_MENUDATA](context, data) {
    return new Promise((resolve, reject) => {
      let url
      if(typeof data.pilihan !== 'undefined' || data.pilihan){
        url = `?pilihan=${data.pilihan}`
      }else{
        url = `?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`
      }
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/Menu${url}`, token)
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_MENUDATA', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          context.commit('SET_LOADINGTABLE', false)
          reject(error);
        })
    });
  },
  [POST_MENUDATA](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/Menu`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_SEQUENCEMENU](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/SequenceMenu`, token)
      .then((response) => {
          context.commit('SET_SEQUENCEMENU', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [POST_SEQUENCEMENU](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/SequenceMenu`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_ROLEMENU](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/RoleMenu?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_ROLEMENU', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          context.commit('SET_LOADINGTABLE', false)
          reject(error);
        })
    });
  },
  [POST_ROLEMENU](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/RoleMenu`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_NOTIFIKASI](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/Notifikasi?kategori=${data.kategori}&page=${data.page}&limit=${data.limit}`, localStorage.getItem('user_token'))
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_NOTIFIKASI', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_KATEGORI_NOTIFIKASI](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/kategoriNotifikasi`, localStorage.getItem('user_token'))
      .then((response) => {
          context.commit('SET_KATEGORI_NOTIFIKASI', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_COUNT_NOTIFIKASI](context) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/countNotifikasi`, localStorage.getItem('user_token'))
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [POST_NOTIFIKASI](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/Notifikasi`, localStorage.getItem('user_token'), bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_USER_BROADCAST](context, data) {
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/dataUserBroadcast?kategori=${data.kategori}${data.kode === 1 ? `&kode=${data.kode}` : ''}`, localStorage.getItem('user_token'))
      .then((response) => {
          context.commit('SET_USER_BROADCAST', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_DATA_BERKAS](context, data) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/Berkas?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_DATA_BERKAS', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          context.commit('SET_LOADINGTABLE', false)
          reject(error);
        })
    });
  },
  [POST_DATA_BERKAS](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/Berkas`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  [GET_DATA_PRODUCT_SETUP](context, url) {
    return new Promise((resolve, reject) => {
      context.commit('SET_LOADINGTABLE', true)
      ApiService.get(`settings/setup-product?${url}`, token)
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_DATA_PRODUCT_SETUP', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          context.commit('SET_LOADINGTABLE', false)
          reject(error);
        })
    });
  },
  [POST_DATA_PRODUCT_SETUP](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/setup-product`, token, bodyData)
      .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  },
  // [GET_DAERAH](context, data) {
  //   context.commit('SET_LOADINGTABLE', true)
  //   return new Promise((resolve, reject) => {
  //     ApiService.get(`settings/wilayah?page=${data.page}&limit=${data.limit}&bagian=${data.bagian}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
  //     .then((response) => {
  //         context.commit('SET_LOADINGTABLE', false)
  //         context.commit('SET_DAERAH', response.data.result)
  //         resolve(response);
  //       })
  //       .catch((error) => {
  //         context.commit('SET_LOADINGTABLE', false)
  //         reject(error);
  //       })
  //   });
  // },
  // [POST_DAERAH](context, bodyData) {
  //   return new Promise((resolve, reject) => {
  //     ApiService.post(`settings/wilayah`, token, bodyData)
  //     .then((response) => {
  //         resolve(response);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       })
  //   });
  // },
  [GET_DAERAH](context, data) {
    context.commit('SET_LOADINGTABLE', true)
    return new Promise((resolve, reject) => {
      ApiService.get(`settings/wilayah2023?page=${data.page}&limit=${data.limit}${data.keyword ? `&keyword=${data.keyword}` : ''}`, token)
      .then((response) => {
          context.commit('SET_LOADINGTABLE', false)
          context.commit('SET_DAERAH', response.data.result)
          resolve(response);
        })
        .catch((error) => {
          context.commit('SET_LOADINGTABLE', false)
          reject(error);
        })
    });
  },
  [POST_DAERAH](context, bodyData) {
    return new Promise((resolve, reject) => {
      ApiService.post(`settings/wilayah2023`, token, bodyData)
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