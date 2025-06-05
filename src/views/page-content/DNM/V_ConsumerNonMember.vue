<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Consumer Non Member</h2>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataConsumer"
        item-value="idUser"
        density="comfortable"
        hide-default-footer
        hide-default-header
        class="elavation-3 rounded"
        :items-per-page="itemsPerPage"
        @page-count="pageCount = $event"
      >
        <!-- header -->
        <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
          <tr>
            <td v-for="header in columns" :key="header.title" class="tableHeader">
              <span v-if="header.sortable" class="mr-2" style="cursor: pointer; width: 100%;" @click="() => toggleSort(header)">{{ header.title.toUpperCase() }}</span>
              <span v-else>{{ header.title.toUpperCase() }}</span>
              <v-icon v-if="isSorted(header)" :icon="getSortIcon(header)"></v-icon>
            </td>
          </tr>
        </template>
        <template #loader>
          <LoaderDataTables />
        </template>
        <template #[`item.number`]="{ item }">
          {{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
        </template>
        <template #[`item.idUser`]="{ item }">
          <input type="hidden" id="testing-code-on" :value="item.raw.idUser">
          <span ref="myinputon" v-html="item.raw.idUser" /> <v-icon v-if="item.raw.idUser" @click.stop.prevent="copyText(item.raw.idUser, 'ID User')" size="small" icon="mdi mdi-content-copy" color="#28a154" />
        </template>
        <template #[`item.Refcode`]="{ item }">
          <input type="hidden" id="testing-code-on" :value="item.raw.Refcode">
          <span ref="myinputon" v-html="item.raw.Refcode ? item.raw.Refcode : '-'" /> <v-icon v-if="item.raw.Refcode" @click.stop.prevent="copyText(item.raw.Refcode, 'Kode Referal')" size="small" icon="mdi mdi-content-copy" color="#28a154" /><br>
          <input type="hidden" id="testing-code-on" :value="item.raw.dataMember.idMember">
          <span ref="myinputon" style="font-weight: bold;" v-html="item.raw.dataMember.idMember ? item.raw.dataMember.idMember : '-'" /> <v-icon v-if="item.raw.dataMember.idMember" @click.stop.prevent="copyText(item.raw.dataMember.idMember, 'ID Member')" size="small" icon="mdi mdi-content-copy" color="#28a154" /><br>
          <strong>{{ item.raw.dataMember.fullname }}</strong><br>
						{{ item.raw.dataMember.email }}<br>
						{{ item.raw.dataMember.devicenumber }}
        </template>
        <template #[`item.identitas`]="{ item }">
          <strong>{{ item.raw.fullname }}</strong><br>
          {{ item.raw.email }}<br>
          {{ item.raw.deviceNumber }}<br>
          {{ item.raw.gender }}
        </template>
        <template #[`item.topic`]="{ item }">
          <span v-html="item.raw.TopicUser ? item.raw.TopicUser : '-'"></span>
        </template>
        <template #[`item.productFirst`]="{ item }">
          <v-tooltip v-if="item.raw.productFirst" bottom>
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="x-large" icon="mdi mdi-information" color="#28a154" />
            </template>
            <div>
              Invoice: {{ item.raw.productFirst ? item.raw.productFirst.orderNumber : null }}<br>
              Tanggal Order: <span v-html="item.raw.productFirst ? convertDateTime(item.raw.productFirst.createdAt) : null" /> <br>
              Product: <br>
              <span v-html="item.raw.productFirst.product" />
            </div>
          </v-tooltip>
          <span v-else>-</span>
        </template>
        <template #[`item.productLast`]="{ item }">
          <v-tooltip v-if="item.raw.productLast" bottom>
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="x-large" icon="mdi mdi-information" color="#28a154" />
            </template>
            <div>
              Invoice: {{ item.raw.productLast ? item.raw.productLast.orderNumber : null }}<br>
              Tanggal Order: <span v-html="item.raw.productLast ? convertDateTime(item.raw.productLast.createdAt) : null" /> <br>
              Product: <br>
              <span v-html="item.raw.productLast.product" />
            </div>
          </v-tooltip>
          <span v-else>-</span>
        </template>
        <template #bottom>
          <v-divider :thickness="2" class="border-opacity-100" color="white" />
          <v-row no-gutters>
            <v-col cols="12" lg="10" class="pa-2 d-flex justify-start align-center">
              <!-- <span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span> -->
              <span>Halaman&nbsp;</span>
              <div style="width: 100px;">
                <Autocomplete
                  v-model="page"
                  :data-a="pageOptions"
                  label-a="Page"
                  :disabled-a="DataConsumer.length ? false : true"
                />
              </div>
              <span>&nbsp;dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
            </v-col>
            <v-col cols="12" lg="2" class="pa-2 text-right">
              <div class="d-flex justify-start align-center">
                <Autocomplete
                  v-model="limit"
                  pilihan-a="select"
                  :data-a="limitPage"
                  label-a="Limit"
                  :disabled-a="DataConsumer.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataConsumer.length ? pageSummary.page != 1 ? false : true : true"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataConsumer.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                  @proses="() => { page = pageSummary.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
        </template>
        <template #top>
          <v-row no-gutters class="pa-2">
            <v-col cols="12" md="3" class="d-flex align-center">
              <vue-date-picker
                v-model="tanggal"
                placeholder="StartDate - EndDate"
                format="dd-MM-yyyy"
                :enable-time-picker="false"
                :auto-position="false"
                position="left"
                range
                :multi-calendars="{ solo: true }"
                :month-change-on-scroll="false"
                :teleport="true"
                auto-apply
              />
            </v-col>
            <v-col cols="12" md="7" class="pl-2 d-flex align-center">
              <TextField
                v-model="searchData"
                icon-prepend-tf="mdi mdi-magnify"
                label-tf="Pencarian..."
                :clearable-tf="true"
                @click:clear="() => {
                  page = 1
                  limit = 20
                  CheckProses(page, limit, tanggal, 0, searchData)
                }"
              />
            </v-col>
            <v-col cols="12" md="2" class="d-flex align-center justify-end">
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-magnify"
                nama-button="Search"
                size-button="small"
                :disabled-button="!DataConsumer.length"
                @proses="() => {
                  page = 1
                  limit = 20
                  CheckProses(page, limit, tanggal, 0, searchData)
                }"
              />
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-cancel"
                nama-button="Reset"
                size-button="small"
                :disabled-button="!DataConsumer.length"
                @proses="() => {
                  searchData = ''
                  tanggal = []
                  page = 1
                  limit = 20
                  CheckProses(page, limit, tanggal, 0, searchData)
                }"
              />
            </v-col>
          </v-row>
          <v-divider :thickness="2" class="border-opacity-100" color="white" />
        </template>
      </v-data-table>
    </v-card>
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
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import qs from 'qs'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataConsumer',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
		tanggal: [],
    searchData: '',
		DataConsumer: [],
    page: 1,
    pageCount: 0,
    itemsPerPage: 100,
    limit: 20,
		limitPage: [5,10,20,50,100],
    pageOptions: [],
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headers: [
      { title: "NO", key: "number", sortable: false, width: "5%" },
      { title: "ID User", key: "idUser", sortable: false },
      { title: "Identitas", key: "identitas", sortable: false },
      { title: "Member Kode Referal", key: "Refcode", sortable: false },
      { title: "Topic", key: "topic", sortable: false },
      { title: "First Order", key: "productFirst", sortable: false },
      { title: "Last Order", key: "productLast", sortable: false },
    ],

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Consumer (Non Member)",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      loadingtable: state => state.user.loadingtable,
    }),
    ...mapGetters({
      consumerAll: 'user/consumerAll',
    }),
  },
  watch: {
    tanggal: {
			deep: true,
			handler(value) {
        if(value === null) this.tanggal = []
			}
		},
    consumerAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
        this.DataConsumer = value.records
				this.pageSummary = {
					page: this.DataConsumer.length ? value.pageSummary.page : 0,
					limit: this.DataConsumer.length ? value.pageSummary.limit : 0,
					total: this.DataConsumer.length ? value.pageSummary.totalRecord : 0,
					totalPages: this.DataConsumer.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
		},
    page: {
			deep: true,
			handler(value) {
        this.DataConsumer = []
        this.CheckProses(value, this.limit, this.tanggal, 0, this.searchData)
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.DataConsumer = []
        this.page = 1
				this.CheckProses(this.page, value, this.tanggal, 0, this.searchData)
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.CheckProses(this.page, this.limit, this.tanggal, 0, this.searchData)
	},
	methods: {
    ...mapActions({
      getConsumer: 'user/getConsumer',
    }),
    CheckProses(page, limit, tanggal, isConsumer, keyword) {
      this.DataConsumer = []
      this.pageSummary = {
        page: 0,
        limit: 0,
        total: 0,
        totalPages: 0
      }
      let startdate, enddate, cari;
			if(tanggal.length === 2){
        startdate = this.convertDateToPicker2(tanggal[0])
        enddate = this.convertDateToPicker2(tanggal[1])
      }      
      if(keyword) cari = keyword   
      this.getConsumer(qs.stringify({ last: page, limit, isConsumer, keyword: cari, startdate, enddate }, { encode: false }))
    },
    copyText(text, nomeklatur) {
      let testingCodeToCopy = document.querySelector('#testing-code-on')
			let code = document.getElementById('testing-code-on').value = text
			testingCodeToCopy.setAttribute('type', 'text') 
			testingCodeToCopy.select()

			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'berhasil' : 'gagal';
				alert(nomeklatur + ' ' + code + ' ' + msg +' disalin');
			} catch (err) {
				alert('Oops, tidak bisa disalin');
			}
			
			testingCodeToCopy.setAttribute('type', 'hidden')
			window.getSelection().removeAllRanges()
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
.v-tab {
	font-size: 8pt !important;
	font-weight: bold !important;
  color: white;
}
</style>