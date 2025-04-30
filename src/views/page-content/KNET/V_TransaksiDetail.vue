<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Transaksi Detail</h2>
    <v-container fluid>
      <v-row>
        <v-col cols="12" lg="6">
          <v-card color="white" style="border: 2px solid #000;">
            <v-sheet color="#000" class="sheetData" elevation="2" style="padding: 5px;">
              <v-divider :thickness="2" class="border-opacity-75" color="white"/>
              <v-card-title class="text-white"><h6>Total DP</h6></v-card-title>
              <v-divider :thickness="2" class="border-opacity-75" color="white"/>
            </v-sheet>
            <v-card-text class="d-flex flex-column justify-center align-center">
              <v-card-title class="text-black"><h6>Rp.<span v-html="detailTransaksi.dp !== 0 ? currencyDotFormatNumber(detailTransaksi.dp) : '0'" /></h6></v-card-title>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="6">
          <v-card color="white" style="border: 2px solid #000;">
            <v-sheet color="#000" class="sheetData" elevation="2" style="padding: 5px;">
              <v-divider :thickness="2" class="border-opacity-75" color="white"/>
              <v-card-title class="text-white"><h6>Total BV</h6></v-card-title>
              <v-divider :thickness="2" class="border-opacity-75" color="white"/>
            </v-sheet>
            <v-card-text class="d-flex flex-column justify-center align-center">
              <v-card-title class="text-black"><h6>{{ detailTransaksi.bv }}</h6></v-card-title>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataTransaksiDetail"
        item-value="orderNumber"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        density="comfortable"
        hide-default-footer
        hide-default-header
        multi-sort
        class="elavation-3 rounded"
        sort-asc-icon="mdi mdi-sort-alphabetical-ascending"
        sort-desc-icon="mdi mdi-sort-alphabetical-descending"
        :items-per-page="itemsPerPage"
        @page-count="pageCount = $event"
        @update:sort-by="updateSort($event)"
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
        <template #[`item.reff_no`]="{ item }">
          <span v-html="item.raw.transaksi.reff_no" /> 
        </template>
        <template #[`item.date`]="{ item }">
          <span v-html="convertDateForMonth(item.raw.transaksi.date)" /><br /><span>{{ `Period: ${item.raw.transaksi.period}` }}</span>
        </template>
        <template #[`item.code`]="{ item }">
          <span v-html="item.raw.distributor.code" /> 
        </template>
        <template #[`item.name`]="{ item }">
          <span v-html="item.raw.distributor.name" /> 
        </template>
        <template #[`item.dp`]="{ item }">
          <span>{{ `Rp.${currencyDotFormatNumber(item.raw.total.dp)}` }}</span> 
        </template>
        <template #[`item.bv`]="{ item }">
          <span v-html="item.raw.total.bv" /> 
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
                auto-apply
              />
            </v-col>
            <v-col cols="12" md="9" class="d-flex align-center">
            </v-col>
          </v-row>
          <v-divider :thickness="2" class="border-opacity-100" color="white" />
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
                  :disabled-a="DataTransaksiDetail.length ? false : true"
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
                  :disabled-a="DataTransaksiDetail.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataTransaksiDetail.length ? pageSummary.page != 1 ? false : true : true"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataTransaksiDetail.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                  @proses="() => { page = pageSummary.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
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
  name: 'DataTransaksiDetail',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
		tanggal: [],
		DataTransaksiDetail: [],
    detailTransaksi: {
      dp: '0',
      bv: '0'
    },
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
      { title: "Invoice", key: "reff_no", sortable: true, width: "10%" },
      { title: "Tanggal Order / Period", key: "date", sortable: true, width: "10%" },
      { title: "ID Member", key: "code", sortable: true, width: "10%" },
      { title: "Nama Member", key: "name", sortable: true, width: "10%" },
      { title: "DP", key: "dp", sortable: true, width: "10%" },
      { title: "BV", key: "bv", sortable: true, width: "10%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    sortBy: [],
    sortDesc: [],
		kumpulSort: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Transaksi Detail",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      loadingtable: state => state.kmart.loadingtable,
    }),
    ...mapGetters({
      transaksiDetailAll: 'kmart/transaksiDetailAll',
    }),
  },
  watch: {
    transaksiDetailAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
        this.DataTransaksiDetail = value.records
				this.pageSummary = {
					page: this.DataTransaksiDetail.length ? value.pageSummary.page : 0,
					limit: this.DataTransaksiDetail.length ? value.pageSummary.limit : 0,
					total: this.DataTransaksiDetail.length ? value.pageSummary.total : 0,
					totalPages: this.DataTransaksiDetail.length ? value.pageSummary.totalPages : 0
				}
        this.detailTransaksi = {
          dp: value.dataJumlah.dp,
          bv: value.dataJumlah.bv
        }
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
		},
    tanggal: {
			deep: true,
			handler(value) {
        this.page = 1
        if(value === null) this.tanggal = []
        this.CheckProses(this.page, this.limit, this.tanggal, this.kumpulSort);
			}
		},
    page: {
			deep: true,
			handler(value) {
        this.DataTransaksiDetail = []
        this.CheckProses(value, this.limit, this.tanggal, this.kumpulSort);
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.DataTransaksiDetail = []
        this.page = 1
				this.CheckProses(this.page, value, this.tanggal, this.kumpulSort);
			}
		},
    sortDesc: {
			deep: true,
			handler(value) {
        this.DataTransaksiDetail = []
        this.page = 1
        this.CheckProses(this.page, this.limit, this.tanggal, this.kumpulSort);
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.CheckProses(this.page, this.limit, this.tanggal, this.kumpulSort);
	},
	methods: {
    ...mapActions({
      getTransaksiDetail: 'kmart/getTransaksiDetail',
    }),
    CheckProses(page, limit, tanggal, sort) {
      this.DataTransaksiDetail = []
      this.pageSummary = {
        page: 0,
        limit: 0,
        total: 0,
        totalPages: 0
      }
      this.detailTransaksi = {
        dp: '0',
        bv: '0'
      }
      let startdate = '', enddate = '', kumpulsort;
			if(tanggal.length === 2){
        startdate = this.convertDateToPicker2(tanggal[0])
        enddate = this.convertDateToPicker2(tanggal[1])
      }
      if(sort) kumpulsort = sort
      this.getTransaksiDetail(qs.stringify({ page, limit, startdate, enddate, sort: kumpulsort }, { encode: false }))
    },
    updateSort(data) {
      this.sortBy = data
			this.kumpulSort = this.sortBy.map((val) => {
        return `${val.key}-${val.order === 'asc' ? 'ASC' : 'DESC'}`
      }).join(',')
  		this.CheckProses(this.page, this.limit, this.tanggal, this.kumpulSort);
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
.listData {
	width: 200px !important;
}
.table-header {
  font-weight: bold;
  color: white;
  font-size: 9pt;
  text-align: center;
}
</style>