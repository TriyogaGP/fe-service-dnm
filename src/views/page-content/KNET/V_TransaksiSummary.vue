<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Transaksi Summary</h2>
    <v-container fluid>
      <v-row>
        <v-col cols="12" lg="4">
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
        <v-col cols="12" lg="4">
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
        <v-col cols="12" lg="4">
          <v-card color="white" style="border: 2px solid #000;">
            <v-sheet color="#000" class="sheetData" elevation="2" style="padding: 5px;">
              <v-divider :thickness="2" class="border-opacity-75" color="white"/>
              <v-card-title class="text-white"><h6>Total Records</h6></v-card-title>
              <v-divider :thickness="2" class="border-opacity-75" color="white"/>
            </v-sheet>
            <v-card-text class="d-flex flex-column justify-center align-center">
              <v-card-title class="text-black"><h6>{{ detailTransaksi.records }}</h6></v-card-title>
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
        :items="DataTransaksiSummary"
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
        <template #[`item.number`]="{ item }">
          {{ item.index + 1 }}
        </template>
        <template #[`item.date`]="{ item }">
          <span v-html="convertDateForMonth(item.raw.transaksi.date)" />
        </template>
        <template #[`item.records`]="{ item }">
          <span v-html="item.raw.transaksi.records" /> 
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
  name: 'DataTransaksiSummary',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
		tanggal: [],
		DataTransaksiSummary: [],
    detailTransaksi: {
      dp: '0',
      bv: '0',
      records: '0'
    },
		page: 1,
    itemsPerPage: 100000,
		headers: [
      { title: "No", key: "number", sortable: false, width: "7%" },
      { title: "Tanggal Order", key: "date", sortable: true, width: "10%" },
      { title: "Jumlah Order", key: "records", sortable: true, width: "10%" },
      { title: "DP", key: "dp", sortable: true, width: "10%" },
      { title: "BV", key: "bv", sortable: true, width: "10%" },
    ],
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
      transaksiSummaryAll: 'kmart/transaksiSummaryAll',
    }),
  },
  watch: {
    transaksiSummaryAll: {
			deep: true,
			handler(value) {
        this.DataTransaksiSummary = value.dataTransaksi
        this.detailTransaksi = {
          dp: value.dataJumlah.dp,
          bv: value.dataJumlah.bv,
          records: value.dataJumlah.records
        }
      }
		},
    tanggal: {
			deep: true,
			handler(value) {
        if(value === null) this.tanggal = []
        this.CheckProses(this.tanggal, this.kumpulSort);
			}
		},
    sortDesc: {
			deep: true,
			handler(value) {
        this.DataTransaksiSummary = []
        this.CheckProses(this.tanggal, this.kumpulSort);
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.CheckProses(this.tanggal, this.kumpulSort);
	},
	methods: {
    ...mapActions({
      getTransaksiSummary: 'kmart/getTransaksiSummary',
    }),
    CheckProses(tanggal, sort) {
      this.DataTransaksiSummary = []
      this.detailTransaksi = {
        dp: '0',
        bv: '0',
        records: '0'
      }
      let startdate = '', enddate = '', kumpulsort;
			if(tanggal.length === 2){
        startdate = this.convertDateToPicker2(tanggal[0])
        enddate = this.convertDateToPicker2(tanggal[1])
      }
      if(sort) kumpulsort = sort
      this.getTransaksiSummary(qs.stringify({ startdate, enddate, sort: kumpulsort }, { encode: false }))
    },
    updateSort(data) {
      this.sortBy = data
			this.kumpulSort = this.sortBy.map((val) => {
        return `${val.key}-${val.order === 'asc' ? 'ASC' : 'DESC'}`
      }).join(',')
  		this.CheckProses(this.tanggal, this.kumpulSort);
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