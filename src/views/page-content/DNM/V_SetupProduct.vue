<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Setup Product</h2>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataSetupProduct"
        item-value="idProductSetup"
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
        <template #[`item.productID`]="{ item }">
          <span v-html="gabungDenganDan(item.raw.productID)" />
        </template>
        <template #[`item.kondisi`]="{ item }">
          <span v-html="`${item.raw.kondisi ? 'Hide Product' : 'Unhide Product'}`" />
        </template>
        <template #[`item.status`]="{ item }">
          <span v-html="`${item.raw.status == 0 ? 'Menunggu Schedule' : 'Berhasil Schedule'}`" />
        </template>
        <template #[`item.excecuteAt`]="{ item }">
          <span v-html="convertDateTime(item.raw.excecuteAt)" /> 
        </template>
        <template #[`item.action`]="{ item }">
          <Button 
            color-button="#bd3a07"
            icon-prepend-button="mdi mdi-delete"
            nama-button="Hapus"
            size-button="x-small"
            :disabled-button="item.raw.status == 1"
            @proses="CheckProses('DELETE', item.raw.idProductSetup)"
          /> 
        </template>
        <template #top>
          <v-card class="mb-0 pa-2" outlined elevation="0">
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Excecute Product
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <vue-date-picker
                  v-model="tanggal"
                  placeholder="Excecute Product"
                  format="dd-MM-yyyy HH:mm"
                  :enable-time-picker="true"
                  :auto-position="false"
                  position="left"
                  :month-change-on-scroll="false"
                  :teleport="true"
                  auto-apply
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Kondisi Product
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <Autocomplete
                  v-model="kondisi"
                  pilihan-a="autocomplete"
                  :data-a="kondisiProductOptions"
                  item-title="title"
						      item-value="value"
                  label-a="Kondisi Product"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Product
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <Autocomplete
                  v-model="inputData.productID"
                  :data-a="productOptions"
                  label-a="Product"
                  item-title="productName"
						      item-value="idProduct"
                  multiple
                  chips
                  closable-chips
                  :clearable-a="true"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="4"/>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <Button
                  color-button="#0bd369"
                  icon-prepend-button="mdi mdi-cogs"
                  nama-button="Setup"
                  size-button="small"
                  :disabled-button="tanggal == '' || inputData.productID == 0"
                  @proses="CheckProses('ADD', null)"
                />
              </v-col>
            </v-row>
          </v-card>
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
                  :disabled-a="DataSetupProduct.length ? false : true"
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
                  :disabled-a="DataSetupProduct.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataSetupProduct.length ? pageSummary.page != 1 ? false : true : true"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataSetupProduct.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
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
  name: 'DataSetupProduct',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
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
		tanggal: '',
		DataSetupProduct: [],
		headers: [
      { title: "ID Product", key: "productID", sortable: false },
      { title: "Kondisi", key: "kondisi", sortable: false },
      { title: "Status", key: "status", sortable: false },
      { title: "Execute Date", key: "excecuteAt", sortable: false },
      { title: "Action", key: "action", sortable: false, width: '15%' },
    ],
    kondisiProductOptions: [
			{ title: "Unhide Product", value: 0 },
			{ title: "Hide Product", value: 1 },
		],
    kondisi: 0,
    inputData: {
      productID: [],
    },
    now: new Date(),

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Setup Product",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      loadingtable: state => state.user.loadingtable,
      productOptions: store => store.setting.productOptions,
    }),
    ...mapGetters({
      productSetupAll: 'setting/productSetupAll',
    }),
  },
  watch: {
    productSetupAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
        this.DataSetupProduct = value.records
				this.pageSummary = {
					page: this.DataSetupProduct.length ? value.pageSummary.page : 0,
					limit: this.DataSetupProduct.length ? value.pageSummary.limit : 0,
					total: this.DataSetupProduct.length ? value.pageSummary.total : 0,
					totalPages: this.DataSetupProduct.length ? value.pageSummary.totalPages : 0
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
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
		this.prosesData(this.page, this.limit);
    this.getProduct();
	},
	methods: {
    ...mapActions({
			getProduct: 'setting/getProduct',
			getDataProductSetup: 'setting/getDataProductSetup',
		}),
    prosesData(page, limit) {      
      this.DataSetupProduct = []
      this.pageSummary = {
        page: '',
        limit: '',
        total: '',
        totalPages: ''
      }
      this.getDataProductSetup(qs.stringify({ page, limit }, { encode: false }));
    },
    CheckProses(jenis, id){
      let bodyData = jenis == 'ADD' ? {
        jenis,
				productID: this.inputData.productID,
				kondisi: this.kondisi,
				excecuteAt: this.tanggal,
      } : {
        jenis,
				idProductSetup: id,
      }
      this.$store.dispatch('setting/postDataProductSetup', bodyData)
      .then((res) => {
        this.clearData()
        this.prosesData(1, this.limit)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    clearData(){
      this.inputData.productID = []
      this.tanggal = ''
      this.kondisi = 0
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