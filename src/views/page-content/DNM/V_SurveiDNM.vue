<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Survei DNM</h2>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataSurveiDNM"
        expand-on-click
        item-value="idUser"
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
        @click:row="clickrow"
        v-model:expanded="expanded"
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
          {{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
        </template>
        <template #[`item.createdAt`]="{ item }">
          <span v-html="convertDateTime(item.raw.createdAt)" /> 
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-information"
                nama-button="Detail"
                size-button="x-small"
                @proses="DetailData(item.raw)"
              />
            </td>
          </tr>
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
            <v-col cols="12" md="1" class="pl-2 d-flex align-center">
              <Autocomplete
                v-model="rating"
                pilihan-a="autocomplete"
                :data-a="ratingOptions"
                label-a="Rating"
                :clearable-a="true"
              />
            </v-col>
            <v-col cols="12" md="6" class="pl-2 d-flex align-center">
              <TextField
                v-model="searchData"
                icon-prepend-tf="mdi mdi-magnify"
                label-tf="Pencarian..."
                :clearable-tf="true"
              />
            </v-col>
            <v-col cols="12" md="2" class="d-flex align-center justify-end">
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-magnify"
                nama-button="Search"
                size-button="small"
                :disabled-button="!DataSurveiDNM.length"
                @proses="() => {
                  page = 1
                  limit = 20
                  CheckProses(page, limit, tanggal, rating, searchData, kumpulSort)
                }"
              />
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-cancel"
                nama-button="Reset"
                size-button="small"
                :disabled-button="!DataSurveiDNM.length"
                @proses="() => {
                  searchData = ''
                  sortBy = []
                  sortDesc = []
                  tanggal = []
                  page = 1
                  limit = 20
                  CheckProses(page, limit, tanggal, rating, searchData, kumpulSort)
                }"
              />
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
                  :disabled-a="DataSurveiDNM.length ? false : true"
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
                  :disabled-a="DataSurveiDNM.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataSurveiDNM.length ? pageSummary.page != 1 ? false : true : true"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataSurveiDNM.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                  @proses="() => { page = pageSummary.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="DialogSurvei"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Detail Survei</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { previewData = ''; DialogSurvei = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <v-row no-gutters class="py-2">
						<v-col
							cols="12"
							md="6"
						>
							<strong>Nama Lengkap</strong><br>
							{{ this.previewData.fullname }}
						</v-col>
						<v-col
							cols="12"
							md="6"
						>
							<strong>No. Telepon</strong><br>
							{{ this.previewData.deviceNumber }}
						</v-col>
					</v-row>
					<v-row no-gutters class="py-2">
						<v-col
							cols="12"
							md="6"
						>
							<strong>User Type</strong><br>
							{{ this.previewData.consumerType }}
						</v-col>
						<v-col
							cols="12"
							md="6"
						>
							<strong>Email</strong><br>
							{{ this.previewData.email ? this.previewData.email : '-' }}
						</v-col>
					</v-row>
					<v-row no-gutters class="py-2">
						<v-col
							cols="12"
							md="6"
						>
							<strong>ID Member</strong><br>
							<input type="hidden" id="testing-code-on" :value="previewData.consumerType === 'MEMBER' ? previewData.idMember : '-'">
					    <span ref="myinputon" v-html="previewData.consumerType === 'MEMBER' ? previewData.idMember : '-'" /> <v-icon v-if="previewData.consumerType === 'MEMBER'" @click.stop.prevent="copyText(previewData.idMember, 'ID Member')" size="small" icon="mdi mdi-content-copy" color="#28a154" />
						</v-col>
						<v-col
							cols="12"
							md="6"
						/>
					</v-row>
					<v-divider :thickness="2" class="border-opacity-100" color="black" />
					<v-row no-gutters class="py-2">
						<v-col cols="12">
							<strong>Tanggal Survei</strong><br>
							{{ convertDateTime(this.previewData.createdAt) }}
						</v-col>
					</v-row>
					<v-row no-gutters class="py-2">
						<v-col cols="12">
							<strong>Rating (1 - 5)</strong><br>
							{{ this.previewData.rating }}
						</v-col>
					</v-row>
					<v-row no-gutters class="py-2">
						<v-col cols="12">
							<strong>Apa yang anda sukai dari DNM Mobile App ?</strong><br>
							<div v-if="this.previewData.dataQuesioner">
								<span v-if="typeof this.previewData.dataQuesioner[1].jawaban === 'string'">{{ this.previewData.dataQuesioner[1].jawaban }}</span>	
								<ol v-else style="padding-left: 15px !important;">
									<li v-for="(item, i) in this.previewData.dataQuesioner[1].jawaban" :key="i">
										{{ item }}
									</li>
								</ol>
							</div>
						</v-col>
					</v-row>
					<v-row no-gutters class="py-2">
						<v-col cols="12">
							<strong>Apakah anda akan merekomendasikan DNM Mobile App kepada Keluarga/Teman anda ?</strong><br>
							<div v-if="this.previewData.dataQuesioner">
								<span>{{ this.previewData.dataQuesioner[2].jawaban }}</span>	
							</div>
						</v-col>
					</v-row>
					<v-row no-gutters class="pt-2">
						<v-col cols="12">
							<strong>Saran dan Masukan</strong><br>
							<div v-if="this.previewData.dataQuesioner">
								<span>{{ this.previewData.dataQuesioner[3].jawaban }}</span>	
							</div>
						</v-col>
					</v-row>
        </v-card-text>
        <v-divider :thickness="2" class="border-opacity-100" color="black" />
        <v-card-actions />
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
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import qs from 'qs'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataSurveiDNM',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
		expanded: [],
		tanggal: [],
    searchData: '',
		DataSurveiDNM: [],
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
      { title: "#", key: "data-table-expand", sortable: false, width: "3%" },
      { title: "NAMA", key: "fullname", sortable: true },
      { title: "SURVEI DATE", key: "createdAt", sortable: true },
      { title: "RATING (1 - 5)", key: "rating", sortable: true, width: "10%" },
      { title: "SARAN DAN MASUKAN", key: "feedback", sortable: false, width: "50%" },
    ],
    rowsPerPageItems: { "items-per-page-options": [5, 10, 25, 50] },
    totalItems: 0,
    sortBy: [],
    sortDesc: [],
		kumpulSort: '',
		rating: null,
    ratingOptions: [
      { title: 1 },
			{ title: 2 },
			{ title: 3 },
			{ title: 4 },
			{ title: 5 },
		],
    previewData: '',
    DialogSurvei: false,

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Survei DNM",
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
      surveiAll: 'user/surveiAll',
    }),
  },
  watch: {
    surveiAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
        this.DataSurveiDNM = value.records
				this.pageSummary = {
					page: this.DataSurveiDNM.length ? value.pageSummary.page : 0,
					limit: this.DataSurveiDNM.length ? value.pageSummary.limit : 0,
					total: this.DataSurveiDNM.length ? value.pageSummary.total : 0,
					totalPages: this.DataSurveiDNM.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
		},
    tanggal: {
			deep: true,
			handler(value) {
        if(value === null) this.tanggal = []
			}
		},
    page: {
			deep: true,
			handler(value) {
        this.DataSurveiDNM = []
        this.CheckProses(value, this.limit, this.tanggal, this.rating, this.searchData, this.kumpulSort);
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.DataSurveiDNM = []
        this.page = 1
				this.CheckProses(this.page, value, this.tanggal, this.rating, this.searchData, this.kumpulSort);
			}
		},
    sortDesc: {
			deep: true,
			handler(value) {
        this.DataSurveiDNM = []
        this.page = 1
        this.CheckProses(this.page, this.limit, this.tanggal, this.rating, this.searchData, this.kumpulSort);
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
		this.CheckProses(this.page, this.limit, this.tanggal, this.rating, this.searchData, this.kumpulSort);
	},
	methods: {
    ...mapActions({
      getSurveiDNM: 'user/getSurveiDNM',
    }),
    CheckProses(page, limit, tanggal, rating, keyword, sort) {
      this.DataSurveiDNM = []
      this.pageSummary = {
        page: 0,
        limit: 0,
        total: 0,
        totalPages: 0
      }
      let startdate, enddate, cari, kumpulsort, rate;
			if(tanggal.length === 2){
        startdate = this.convertDateToPicker2(tanggal[0])
        enddate = this.convertDateToPicker2(tanggal[1])
      }
      if(keyword) cari = keyword
      if(sort) kumpulsort = sort
      if(rating) rate = rating
      this.getSurveiDNM(qs.stringify({ page, limit, rating: rate, keyword: cari, startdate, enddate, sort: kumpulsort }, { encode: false }))
    },
    DetailData(item){
      this.previewData = item
      this.DialogSurvei = true
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
    updateSort(data) {
      this.sortBy = data
			this.kumpulSort = this.sortBy.map((val) => {
        return `${val.key}-${val.order === 'asc' ? 'ASC' : 'DESC'}`
      }).join(',')
  		this.CheckProses(this.page, this.limit, this.tanggal, this.rating, this.searchData, this.kumpulSort);
		},
    clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.idUser);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.idUser);
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