<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Order by Product</h2>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataOrderbyProduct"
        expand-on-click
        item-value="idUser"
        density="comfortable"
        hide-default-footer
        hide-default-header
        class="elavation-3 rounded"
        items-per-page="1000"
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
          {{ DataOrderbyProduct.indexOf(item.raw) + 1 }}
        </template>
        <template #[`item.idUser`]="{ item }">
          <input type="hidden" id="testing-code-on" :value="item.raw.idUser">
          <span ref="myinputon" v-html="item.raw.idUser" /> <v-icon v-if="item.raw.idUser" @click.stop.prevent="copyText(item.raw.idUser, 'ID User')" size="small" icon="mdi mdi-content-copy" color="#28a154" />
        </template>
        <template #[`item.idMember`]="{ item }">
          <input type="hidden" id="testing-code-on" :value="item.raw.idMember">
          <span ref="myinputon" v-html="item.raw.idMember" /> <v-icon v-if="item.raw.idMember" @click.stop.prevent="copyText(item.raw.idMember, 'ID Member')" size="small" icon="mdi mdi-content-copy" color="#28a154" />
        </template>
        <template #[`item.quantity`]="{ item }">
          <span v-html="item.raw.quantity !== 0 ? item.raw.quantity : '0'" />
        </template>
        <template #[`item.totalPrice`]="{ item }">
          Rp.<span v-html="item.raw.totalPrice !== 0 ? currencyDotFormatNumber(item.raw.totalPrice/1) : '0'" />
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-pencil"
                nama-button="Detail Order"
                size-button="x-small"
                :disabled="isLoadingData"
                @proses="detailOrder(item.raw.idUser)"
              />
            </td>
          </tr>
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
                ID Product
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <TextArea
                  v-model="inputData.idProductSync"
                  label-ta="ID Product(PPKG1;PPKG2;PPKG3;... atau 1;2;3;...)"
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
                md="12"
                class="pt-3"
              >
              <download-csv
                v-if="DataExport.length"
                :data="DataExport"
                :labels="{ idMember: 'ID Member', namaMember: 'Nama Member', totalPrice: 'Total Sales' }"
                :name="`Data Spender (${convertDateTime(now)}).csv`"
              >
                <Button 
                  color-button="#0bd369"
                  icon-prepend-button="mdi mdi-export"
                  nama-button="Data Spender *.CSV"
                  size-button="small"
                />
              </download-csv>
              </v-col>
            </v-row>
          </v-card>
          <v-divider :thickness="2" class="border-opacity-100" color="white" />
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="DialogDetailOrder"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Detail Order</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { DataDetailOrder = []; DialogDetailOrder = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <!-- {{ DataDetailOrder }} -->
          <v-row no-gutters class="py-2">
						<v-col
							cols="12"
							md="6"
						>
							<strong>ID Member</strong><br>
							{{ this.DataDetailOrder.idMember }}
						</v-col>
						<v-col
							cols="12"
							md="6"
						>
							<strong>Nama Lengkap</strong><br>
							{{ this.DataDetailOrder.namaMember }}
						</v-col>
					</v-row>
          <v-divider :thickness="2" class="border-opacity-100" color="black" /><br>
          <table border="1" cellspacing="0" cellpadding="0" width="100%" style="background-color: #28a154; border: #FFF;">
            <tr class="table-header">
              <td>Tanggal Order</td>
              <td>Order Number</td>
              <td>Jenis</td>
              <td>Status Order</td>
              <td>Detail Product</td>
            </tr>
            <tr style="font-size: 9pt; font-weight: bold; color: white; padding: 10px" v-for="(data, index) in this.DataDetailOrder.dataOrder" :key="index">
              <td style="text-align: center">{{ convertDateTime(data.createdAt) }}</td>
              <td style="text-align: center">{{ data.orderNumber }}</td>
              <td style="text-align: center">{{ data.shippingType }}</td>
              <td style="text-align: center">{{ data.orderStatusLatest }}</td>
              <td style="text-align: center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" size="x-large" icon="mdi mdi-information" color="white" />
                  </template>
                  <strong>Data Product</strong>
                  <table border="1" cellspacing="0" cellpadding="0" width="500px" style="border: #FFF;">
                    <tr class="table-header">
                      <td>Nama Product</td>
                      <td>Quantity</td>
                      <td>Total</td>
                    </tr>
                    <tr style="font-size: 9pt; font-weight: bold; color: white; padding: 10px" v-for="(data2, i) in data.dataProduct" :key="i">
                      <td style="padding-left: 10px; text-align: center">{{ data2.productName }}</td>
                      <td style="padding-left: 10px; text-align: center">{{ data2.quantity }}</td>
                      <td style="padding-left: 10px; text-align: center">{{ `Rp.${currencyDotFormatNumber(data2.totalPrice/1)}` }}</td>
                    </tr>
                  </table>
                </v-tooltip>
              </td>
            </tr>
          </table>
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
    <v-overlay v-model="isLoadingData" persistent class="align-center justify-center">
      <div style="width: 550px;">
        <v-progress-linear
          class="pa-3"
          indeterminate
          color="#28a154"
        />
        <h4 style="color: #FFF; text-align: center; background-color: #272727;">Sedang proses pengambilan data keserver, harap menunggu ...</h4>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import qs from 'qs'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataOrderbyProduct',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
		expanded: [],
		tanggal: [],
		DataOrderbyProduct: [],
		DataExport: [],
		DataDetailOrder: [],
		headers: [
      { title: "No", key: "number", sortable: false, width: "5%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "3%" },
      { title: "ID User", key: "idUser", sortable: false, width: "9%" },
      { title: "ID Member", key: "idMember", sortable: false },
      { title: "Nama Member", key: "namaMember", sortable: false },
      { title: "Quantity", key: "quantity", sortable: false },
      { title: "Total", key: "totalPrice", sortable: false },
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
    inputData: {
      idProductSync: '',
      payment: null,
      shippingType: [],
      statusFinal: [],
    },
    DialogDetailOrder: false,
    isLoadingData: false,
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
    tanggal: {
			deep: true,
			handler(value) {
        if(value === null) this.tanggal = []
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
      this.DataOrderbyProduct = [];
      this.DataExport = [];
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
          url: qs.stringify({ payment, shippingType: shipping, statusfinal: status, startdate, enddate }, { encode: false })
        }
      }
      this.$store.dispatch('user/getOrderbyProduct', bodyData)
      .then((res) => {
        const listData = res.data.result
        this.DataOrderbyProduct = listData
        listData.map((val, i) => {
          if(i < 10) this.DataExport.push({
            idMember: val.idMember,
            namaMember: val.namaMember,
            totalPrice: `Rp.${this.currencyDotFormatNumber(val.totalPrice/1)}`,
          })
        })
        
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    detailOrder(idUser) {
      this.DataDetailOrder = [];
      this.isLoadingData = true;
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
        param: { idUser },
        post: { idProductSync },
        get: {
          url: qs.stringify({ payment, shippingType: shipping, statusfinal: status, startdate, enddate }, { encode: false })
        }
      }
      this.$store.dispatch('user/getDetailOrder', bodyData)
      .then((res) => {
        setTimeout(() => {
          this.isLoadingData = false
          this.DialogDetailOrder = true
          const listData = res.data.result
          this.DataDetailOrder = listData
        }, 5000);
			})
			.catch((err) => {
        this.DataDetailOrder = [];
        this.isLoadingData = false;
        this.notifikasi("error", err.response.data.message, "1")
			});
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
  height: 30px;
}
</style>