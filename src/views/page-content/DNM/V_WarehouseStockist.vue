<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Warehouse Stockist</h2>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataWarehouseStockist"
        expand-on-click
        item-value="locationName"
        density="comfortable"
        hide-default-footer
        hide-default-header
        class="elavation-3 rounded"
        :items-per-page="itemsPerPage"
        @click:row="clickrow"
        v-model:expanded="expanded"
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
        <template #[`item.locationCode`]="{ item }">
          <input type="hidden" id="testing-code-on" :value="item.raw.locationCode">
          <span ref="myinputon" v-html="item.raw.locationCode" /> <v-icon v-if="item.raw.locationCode" @click.stop.prevent="copyText(item.raw.locationCode, 'ID Warehouse / Stockist')" size="small" icon="mdi mdi-content-copy" color="#28a154" />
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
              <Autocomplete
                v-model="jenis"
                :data-a="jenisOptions"
                label-a="Jenis"
              />
            </v-col>
            <v-col cols="12" md="7" class="pl-2 d-flex align-center">
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
                :disabled-button="!DataWarehouseStockist.length"
                @proses="() => {
                  CheckProses(limit, jenis, searchData)
                }"
              />
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-cancel"
                nama-button="Reset"
                size-button="small"
                :disabled-button="!DataWarehouseStockist.length"
                @proses="() => {
                  searchData = ''
                  CheckProses(limit, jenis, searchData)
                }"
              />
            </v-col>
          </v-row>
          <v-divider :thickness="2" class="border-opacity-100" color="white" />
        </template>
        <template #bottom />
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
  name: 'DataWarehouseStockist',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
		expanded: [],
    searchData: '',
		DataWarehouseStockist: [],
    itemsPerPage: 1000,
    limit: 200,
		headers: [
      { title: "NO", key: "number", sortable: false, width: "5%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "3%" },
      { title: "Location Code", key: "locationCode", sortable: false },
      { title: "Nama", key: "fullname", sortable: true },
      { title: "Alamat", key: "address", sortable: false, width: "50%" },
    ],
		jenis: 'WAREHOUSE',
    jenisOptions: [
      { title: 'WAREHOUSE' },
			{ title: 'STOCKIST' },
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
      title: "Data Order",
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
      warehousestockistAll: 'user/warehousestockistAll',
    }),
  },
  watch: {
    warehousestockistAll: {
			deep: true,
			handler(value) {
        this.DataWarehouseStockist = value.records
      }
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
		this.CheckProses(this.limit, this.jenis, this.searchData);
	},
	methods: {
    ...mapActions({
      getWarehouseStockist: 'user/getWarehouseStockist',
    }),
    CheckProses(limit, type, keyword) {
      this.DataWarehouseStockist = []
      
      let cari;
			if(keyword) cari = keyword
      this.getWarehouseStockist(qs.stringify({ type, limit, keyword: cari, status: 'ACTIVE' }, { encode: false }))
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
    clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.locationName);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.locationName);
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