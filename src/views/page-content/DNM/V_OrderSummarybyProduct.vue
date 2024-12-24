<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Order Summary by Product</h2>
    <v-container fluid>
      <v-row>
        <v-col cols="12" lg="6">
          <v-card color="white" style="border: 2px solid #000;">
            <v-sheet color="#000" class="sheetData" elevation="2" style="padding: 5px;">
              <v-divider :thickness="2" class="border-opacity-75" color="white"/>
              <v-card-title class="text-white"><h6>Total Product</h6></v-card-title>
              <v-divider :thickness="2" class="border-opacity-75" color="white"/>
            </v-sheet>
            <v-card-text class="d-flex flex-column justify-center align-center">
              <v-card-title class="text-black"><h6>{{ detailSummary.totalQty }}</h6></v-card-title>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="6">
          <v-card color="white" style="border: 2px solid #000;">
            <v-sheet color="#000" class="sheetData" elevation="2" style="padding: 5px;">
              <v-divider :thickness="2" class="border-opacity-75" color="white"/>
              <v-card-title class="text-white"><h6>Total Sales</h6></v-card-title>
              <v-divider :thickness="2" class="border-opacity-75" color="white"/>
            </v-sheet>
            <v-card-text class="d-flex flex-column justify-center align-center">
              <v-card-title class="text-black"><h6>Rp.<span v-html="detailSummary.grandTotal !== 0 ? currencyDotFormatNumber(detailSummary.grandTotal) : '0'" /></h6></v-card-title>
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
        :headers="jenis === 1 ? headersPackage : headersBasic"
        :loading="loadingtable"
        :items="DataOrderSummarybyProduct"
        item-value="idProductSync"
        density="comfortable"
        hide-default-footer
        hide-default-header
        class="elavation-3 rounded"
        items-per-page="100"
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
        <template #[`item.productName`]="{ item }">
          <v-tooltip v-if="jenis === 0 && item.raw.productVariant !== null" bottom>
            <template v-slot:activator="{ props }">
              <span v-html="item.raw.productName" /> <v-icon v-bind="props" size="x-large" icon="mdi mdi-information" color="#28a154" />
            </template>
            <strong>Variant :</strong>
            <v-divider :thickness="2" class="border-opacity-100" color="white" />
            <div v-for="(val, x) in item.raw.productVariant" :key="x">
              <span v-html="val" /><br>
            </div>
          </v-tooltip>
          <span v-else v-html="item.raw.productName" />
        </template>
        <template #[`item.productDetail`]="{ item }">
          <div v-for="(data, i) in item.raw.packageProduct" :key="i">
            <template v-if="data.productVariant === null">
              <span v-html="`${data.quantity} Pcs - `" /> <span v-html="data.productName" /><br>
            </template>
            <v-tooltip v-else bottom>
              <template v-slot:activator="{ props }">
                <span v-html="`${data.quantity} Pcs - `" /> <span v-html="data.productName" /> <v-icon v-bind="props" size="x-large" icon="mdi mdi-information" color="#28a154" />
              </template>
              <strong>Variant :</strong>
              <v-divider :thickness="2" class="border-opacity-100" color="white" />
              <div v-for="(val, x) in data.productVariant" :key="x">
                <span v-html="val" /><br>
              </div>
            </v-tooltip>
          </div>
        </template>
        <template #[`item.priceProduct`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="x-large" icon="mdi mdi-information" color="#28a154" />
            </template>
            <div v-for="(data, i) in item.raw.ProductPrices" :key="i">
              <span style="font-weight: bold;" v-html="data.idRegionSync === '12W4' ? 'Harga Barat :' : data.idRegionSync === '12E4' ? 'Harga Timur :' : 'Harga Timor Leste :'" /><br>
              DP: {{ data.idRegionSync !== '30W4' ?  'Rp.' : '$' }}<span v-html="currencyDotFormatNumber(data.priceMember/1)" /><br>
              CP: {{ data.idRegionSync !== '30W4' ?  'Rp.' : '$' }}<span v-html="currencyDotFormatNumber(data.priceNonMember/1)" />
              <v-divider :thickness="2" class="border-opacity-100" color="white" />
            </div>
          </v-tooltip>
        </template>
        <template #[`item.quantity`]="{ item }">
          <span v-html="item.raw.quantity !== 0 ? item.raw.quantity : '0'" />
        </template>
        <template #[`item.totalPrice`]="{ item }">
          Rp.<span v-html="item.raw.totalPrice !== 0 ? currencyDotFormatNumber(item.raw.totalPrice) : '0'" />
        </template>
        <template #bottom>
        </template>
        <template #top>
          <v-card class="mb-0 pa-2" outlined elevation="0">
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Tanggal
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
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
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Jenis Product
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <Autocomplete
                  v-model="jenis"
                  pilihan-a="autocomplete"
                  :data-a="jenisProductOptions"
                  item-title="title"
						      item-value="value"
                  label-a="Jenis Product"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                {{ jenis === 1 ? 'ID Product Package / Bundling' : 'ID Product Single' }}
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <TextArea
                  v-model="inputData.idProductSync"
                  :label-ta="jenis === 1 ? 'ID Product Package / Bundling (PPKG1;PPKG2;PPKG3;...)' : 'ID Product Single (1;2;3;...)'"
                  rows="4"
                  :clearable-ta="true"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Payment Status
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <Autocomplete
                  v-model="inputData.payment"
                  pilihan-a="autocomplete"
                  :data-a="paymentOptions"
                  label-a="Payment Status"
                  :clearable-a="true"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Shipping Type
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    md="2"
                    class="d-flex align-center"
                  >
                    <v-checkbox
                      v-model="allShipping"
                      label="Pilih Semua"
                      value="Pilih Semua"
                      hide-details
                      density="comfortable"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="10"
                  >
                    <Autocomplete
                      v-model="inputData.shippingType"
                      :data-a="shippingOptions"
                      label-a="Shipping Type"
                      multiple
                      chips
                      closable-chips
                      :clearable-a="true"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Status Final
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    md="2"
                    class="d-flex align-center"
                  >
                    <v-checkbox
                      v-model="allStatus"
                      label="Pilih Semua"
                      value="Pilih Semua"
                      hide-details
                      density="comfortable"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="10"
                  >
                    <Autocomplete
                      v-model="inputData.statusFinal"
                      :data-a="statusOptions"
                      label-a="Status Final"
                      multiple
                      chips
                      closable-chips
                      :clearable-a="true"
                    />
                  </v-col>
                </v-row>
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
                  icon-prepend-button="mdi mdi-send-check"
                  nama-button="Check"
                  size-button="small"
                  @proses="CheckProses()"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="3"
                class="pt-3"
              >
              <download-csv
                v-if="DataExport.length"
                :data="DataExport"
                :labels="{ idProductSync: 'ID Product', productName: 'Nama Product', quantity: 'Quantity', totalPrice: 'Total Sales' }"
                :name="`Data Export Summary (${convertDateTime(now)}).csv`"
              >
                <Button 
                  color-button="#0bd369"
                  icon-prepend-button="mdi mdi-export"
                  nama-button="Data Export Summary *.CSV"
                  size-button="small"
                />
              </download-csv>
              </v-col>
              <v-col cols="12" md="9"/>
            </v-row>
          </v-card>
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
  name: 'DataOrderSummarybyProduct',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
		tanggal: [],
		DataOrderSummarybyProduct: [],
		DataExport: [],
    detailSummary: {
      grandTotal: '0',
      totalQty: '0'
    },
    allShipping: '',
    allStatus: '',
		headersPackage: [
      { title: "ID Product", key: "idProductSync", sortable: false },
      { title: "Product Name", key: "productName", sortable: false },
      { title: "Product Package Detail", key: "productDetail", sortable: false },
      { title: "Price Product", key: "priceProduct", sortable: false },
      { title: "Quantity", key: "quantity", sortable: false },
      { title: "Total", key: "totalPrice", sortable: false },
    ],
		headersBasic: [
      { title: "ID Product", key: "idProductSync", sortable: false },
      { title: "Product Name", key: "productName", sortable: false },
      { title: "Price Product", key: "priceProduct", sortable: false },
      { title: "Quantity", key: "quantity", sortable: false },
      { title: "Total", key: "totalPrice", sortable: false },
    ],
    jenisProductOptions: [
			{ title: "Product Package / Bundling", value: 1 },
			{ title: "Product Single", value: 0 },
		],
    paymentOptions: [
			{ title: "PAID" },
			{ title: "UNPAID" },
			{ title: "ALL" },
		],
		shippingOptions: [
			{ title: "DELIVERY_COD" },
			{ title: "DELIVERY_NON_COD" },
			{ title: "DELIVERY_NON_COD_SAMEDAY" },
			{ title: "PICKUP" },
		],
    statusOptions: [
			{ title: "PROCESSING" },
			{ title: "IN_SHIPPING" },
			{ title: "ARRIVED_AT_DESTINATION" },
			{ title: "ARRIVED_AT_DESTINATION_PICKUP" },
			{ title: "DONE" },
			{ title: "REVIEWED" },
		],
    jenis: 1,
    inputData: {
      idProductSync: '',
      payment: null,
      shippingType: [],
      statusFinal: [],
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
      title: "Data Order Summary by Product",
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
  },
  watch: {
    jenis: {
			deep: true,
			handler(value, oldValue){
        if(value !== oldValue) {
          this.inputData.idProductSync = '';
          this.DataOrderSummarybyProduct = [];
        }
			}
		},
    tanggal: {
			deep: true,
			handler(value) {
        if(value === null) this.tanggal = []
			}
		},
    allShipping: {
			deep: true,
			handler(value) {
        if(value === 'Pilih Semua') {
          this.inputData.shippingType.push('DELIVERY_COD','DELIVERY_NON_COD','DELIVERY_NON_COD_SAMEDAY','PICKUP')
        }else{
          this.inputData.shippingType = []
        }
			}
		},
    allStatus: {
			deep: true,
			handler(value) {
        if(value === 'Pilih Semua') {
          this.inputData.statusFinal.push('PROCESSING','IN_SHIPPING','ARRIVED_AT_DESTINATION','ARRIVED_AT_DESTINATION_PICKUP','DONE','REVIEWED')
        }else{
          this.inputData.statusFinal = []
        }
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
	},
	methods: {
    CheckProses() {
      if(!this.inputData.idProductSync || !this.inputData.shippingType.length) {
				return this.notifikasi("warning", 'Parameter kosong !', "1")
			}
      this.DataOrderSummarybyProduct = [];
      this.DataExport = [];
      this.detailSummary = {
        grandTotal: '0',
        totalQty: '0'
      }
      let payment, shipping, status, startdate, enddate, idProductSync;
      idProductSync = this.inputData.idProductSync.split(';')
      if(this.inputData.payment){ payment = `${this.inputData.payment}` }
			if(this.inputData.shippingType){ shipping = this.inputData.shippingType.join(',') }
			if(this.inputData.statusFinal){ status = this.inputData.statusFinal.join(',') }
			if(this.tanggal.length === 2){
        startdate = this.convertDateToPicker2(this.tanggal[0])
        enddate = this.convertDateToPicker2(this.tanggal[1])
      }

      let bodyData = {
        post: {
          idProductSync: idProductSync
        },
        get: {
          url: qs.stringify({ payment, shippingType: shipping, statusfinal: status, jenis: this.jenis, startdate, enddate }, { encode: false })
        }
      }
      this.$store.dispatch('user/getOrderSummarybyProduct', bodyData)
      .then((res) => {
        if(res.data.result == 'errorSINGLE' || res.data.result == 'errorPACKAGE') return this.notifikasi("warning", res.data.message, "1")
        const { listData, grandTotal, totalQty } = res.data.result
        this.DataOrderSummarybyProduct = listData
        this.detailSummary = {grandTotal, totalQty}
        listData.map((val, i) => {
          this.DataExport.push({
            idProductSync: val.idProductSync,
            productName: val.productName,
            quantity: val.quantity,
            // totalPrice: `Rp.${val.totalPrice !== 0 ? this.currencyDotFormatNumber(val.totalPrice/1) : '0'}`,
            totalPrice: `${val.totalPrice !== 0 ? val.totalPrice/1 : 0}`,
          })
        })
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
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