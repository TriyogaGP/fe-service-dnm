<template>
  <div>
    <h1 class="subheading grey--text text-decoration-underline">Data Notifikasi</h1>
    <div class="d-flex justify-end">
      <Button
        color-button="light-blue darken-3"
        icon-prepend-button="mdi mdi-marker-check"
        nama-button="Tandai Telah Dibaca"
        size-button="x-small"
        @proses="tandai()"
      />
      <Button
        color-button="light-blue darken-3"
        icon-prepend-button="mdi mdi-reload"
        nama-button="Muat Ulang"
        size-button="x-small"
        @proses="muatulang()"
      />
    </div>
    <v-card class="mt-2 mb-2 pa-1 rounded" variant="outlined" elevation="4">
      <div class="d-flex justify-center">
        <Button
          v-for="item in kategori"
          :key="item.kode"
          class="kotak-type"
          :nama-button="`${item.text} (${item.count})`"
          @proses="() => { kodeKategori = item.kode; }"
        />
      </div>
      <v-row no-gutters>
        <v-col cols="12" lg="12">
          <div v-if="dataNotifikasi.length" class="wadah-notif">
            <div class="wadah-notif-scroll">
              <v-infinite-scroll @load="load" side="end">
                <div v-for="notif in dataNotifikasi" :key="notif.idTemporaryData" class="kotak-notif" @click="openDialog(notif)">
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <span class="box fourcorners" :style="notif.jenis === 'Update' ? `background-color: rgba(4, 76, 4, 0.822);` : `background-color: rgba(8, 42, 128, 0.822);`">{{notif.jenis === 'Update' ? 'Perubahan Data' : 'Penghapusan Data'}}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      class="kondisiNotif"
                    >
                      <p>{{notif.isRead ? 'sudah dibaca' : 'belum dibaca' }} <v-icon :color="notif.isRead == true ? 'green' : 'red'" :icon="notif.isRead == true ? 'mdi mdi-check' : 'mdi mdi-close'" /></p>
                      <p style="font-size: 12pt;">{{notif.statusExecute }}</p>
                    </v-col>
                  </v-row>
                  <p class="judulNotif">{{notif.pesan.title}}</p>
                  <span class="pesanNotif" v-html="notif.pesan.message" />
                  <span class="pesanNotif">Alasan : {{ notif.pesan.reason }}</span>
                  <p class="tanggalNotif" v-html="notif.dikirim" />
                  <p class="tanggalNotif">{{notif.createdAt}}</p>
                </div>
                <template v-slot:empty>
                  <v-alert type="warning">Tidak ada data notifikasi lagi ...</v-alert>
                </template>
              </v-infinite-scroll>
            </div>
          </div>
          <div v-else class="wadah-notif2">
            <span>Tidak ada notifikasi</span>
          </div>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog
      v-model="DialogNotifikasi"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Detail Notifikasi</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DialogNotifikasi = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Jenis
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.jenis}` }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Title
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.dataTemporary.title}` }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Message
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              : <span class="pesanNotif" v-html="detailData.dataTemporary.message" /><br>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Alasan
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.dataTemporary.reason !== '' ? detailData.dataTemporary.reason : '-'}` }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Payload
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <JsonViewer
                v-if="detailData.dataTemporary.payload !== 'null'"
                :value="jsonData"
                :expand-depth=5
                copyable
                boxed
                sort>
              </JsonViewer>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Direquest Oleh
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              : <span v-html="detailData.request" />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Status Execute
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.statusExecute}` }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Waktu
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `: ${detailData.createdAt}` }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider :thickness="2" class="border-opacity-100" color="black" />
        <v-card-actions>
          <v-row 
            no-gutters
            class="mr-3"
          >
            <v-col
              class="text-end"
              cols="12"
            >
              <Button
                v-if="detailData.statusExecute === 'Menunggu Persetujuan Permohonan'"
                color-button="#bd3a07"
                nama-button="Tidak DiSetujui"
                @click="prosesData('TIDAKSETUJU', 'Permohonan Tidak Disetujui')"
              />
              <Button 
                v-if="detailData.statusExecute === 'Menunggu Persetujuan Permohonan'"
                color-button="ligth-blue darken-3"
                nama-button="Proses DiSetujui"
                @click="prosesData('SETUJU', 'Permohonan Disetujui')"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogNotifikasi"
      transition="dialog-bottom-transition"
      persistent
      width="500px"
    >
      <PopUpNotifikasi
        :notifikasi-kode="notifikasiKode"
        :notifikasi-text="notifikasiText"
        :notifikasi-button="notifikasiButton"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "./Layout/PopUpNotifikasi.vue";
import notifikasi from "../core/services/composeables/notifikasi";

export default {
  name: 'Notifikasi',
  components: {
    PopUpNotifikasi
  },
  data: () => ({
    API_URL: '',
    page: 1,
    limit: 20,
    DialogNotifikasi: false,
    dataNotifikasi: [],
    kategori: [],
    kodeKategori: '1',
    pageSummary: {
      limit: '',
      page: '',
      hasNext: false,
      lastID: '',
      totalPage: ''
    },
    detailData: {
      idTemporaryData: '',
      idAdmin: '',
      jenis: '',
      dataTemporary: '',
      imageTemporary: '',
      isRead: false,
      statusExecute: false,
      tujuan: '',
      request: '',
      createdAt: ''
    },

    jsonData: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Notifikasi",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
    const { refetch: dataCountNotifikasi } = notifikasi.countingNotif({
      enabled: false,
    })
    return { dataCountNotifikasi }
  },
  computed: {
    ...mapGetters({
      kategoriAll: 'setting/kategoriAll',
      notifikasiAll: 'setting/notifikasiAll',
    }),
  },
  watch: {
    notifikasiAll: {
      deep: true,
      handler(value){
        let data = value.records
        data.map(val => {
          this.dataNotifikasi.push(val)
        })
        this.pageSummary = {
          limit: value.pageSummary.limit,
          page: value.pageSummary.page,
          hasNext: value.pageSummary.hasNext,
          lastID: value.pageSummary.lastID,
          totalPage: value.pageSummary.totalPage
        }
      }
    },
    kategoriAll: {
      deep: true,
      handler(value){
        this.kategori = value
      }
    },
    kodeKategori: {
      deep: true,
      handler(value, oldValue){
        if(value !== oldValue) {
          this.dataNotifikasi = []
          this.getNotifikasi({kategori: this.kodeKategori, page: 1, limit: this.limit})
        }
      }
    },
  },
  mounted() {
    this.getKategoriNotifikasi()
    this.getNotifikasi({kategori: this.kodeKategori, page: this.page, limit: this.limit})
  },
	methods: {
		...mapActions({
      getKategoriNotifikasi: 'setting/getKategoriNotifikasi',
      getNotifikasi: 'setting/getNotifikasi',
      getCountNotifikasi: 'setting/getCountNotifikasi',
    }),
    openDialog(item){
      this.detailData = {
        idTemporaryData: item.idTemporaryData,
        idAdmin: item.idAdmin,
        jenis: item.jenis,
        dataTemporary: JSON.parse(item.dataTemporary),
        imageTemporary: item.imageTemporary,
        tujuan: item.tujuan,
        request: item.request,
        isRead: item.isRead,
        statusExecute: item.statusExecute,
        createdAt: item.createdAt
      }
      
      this.jsonData = JSON.parse(item.pesan.payload)
      if(this.detailData.isRead) this.DialogNotifikasi = true
      let bodyData = {
        jenis: 'ISREAD',
        idTemporaryData: item.idTemporaryData,
      }
      this.$store.dispatch('setting/postNotifikasi', bodyData)
      .then((res) => {
        this.DialogNotifikasi = true
        this.muatulang()
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    muatulang(){
      this.dataNotifikasi = []
      this.getKategoriNotifikasi()
      this.dataCountNotifikasi()
      this.getNotifikasi({kategori: this.kodeKategori, page: 1, limit: this.limit})
    },
    tandai(){
      let bodyData = {
        jenis: 'ISREADALL',
        kategori: this.kodeKategori,
      }
      this.$store.dispatch('setting/postNotifikasi', bodyData)
      .then((res) => {
        this.muatulang()
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    prosesData(jenis, status){
      let bodyData = {
        jenis,
        idTemporaryData: this.detailData.idTemporaryData,
        dataTemporary: this.detailData.dataTemporary,
        jenisNotif: this.detailData.jenis,
        statusExecute: status,
      }
      this.$store.dispatch('setting/postNotifikasi', bodyData)
      .then((res) => {
        this.DialogNotifikasi = false
        this.muatulang()
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    load ({ side, done }) {
      setTimeout(() => {
        if (side === 'end') {
          if(this.pageSummary.hasNext){
            this.page = this.pageSummary.page + 1
            this.getNotifikasi({kategori: this.kodeKategori, page: this.page, limit: this.limit})
            done('ok')
          }else{
            done('empty')
          }
        }
      }, 1000)
    },
    notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
	}
}
</script>

<style scoped>
.kondisiNotif {
	margin-bottom: 1px !important;
	font-size: 10px;
	text-align: right;
	font-style: italic;
}
.judulNotif {
	margin: 5px 1px 0px !important;
	font-size: 14px;
	font-weight: bold;
}
.pesanNotif {
	margin-bottom: 1px !important;
	font-size: 12px;
	font-weight: 500;
	text-align: justify;
}
.tanggalNotif {
	margin-bottom: 1px !important;
	font-size: 10px;
	font-weight: 500;
	text-align: right;
	font-style: italic;
}
.wadah-kategori {
  height: 100%;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}
.v-btn:not(.v-btn--round).v-size--default {
  height: 28px;
  min-width: 64px;
  padding: 0 12px;
}
.wadah-notif {
  width: 100%;
  padding: 0px 10px;
}
.wadah-notif2 {
  width: 100%;
  padding: 0px 100px;
  margin-top: 5px;
  text-align: center;
  font-weight: bold;
}
.kotak-notif {
  height: 100%;
  width: 100%;
  border: 2px solid #000;
  border-radius: 10px;
  background-color: #28a154;
  color: #ffffff;
  padding: 10px;
  margin: 5px 0px;
  cursor: pointer;
}
.kotak-type {
  margin: 0px 5px;
  border: 2px solid #000;
  border-radius: 50px !important;
  color: black;
  background-color: white;
  font-size: 8pt;
  align-items: center;
  position: relative;
  text-align: center;
}
.v-text-field.v-input--dense {
  font-size: 13px !important;
}
.fourcorners{
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	-khtml-border-radius: 5px; 
	border-radius: 5px;
	padding: 5px;
	text-align: center;
	font-size: 10px;
  border: 1px solid #FFF;
}
</style>