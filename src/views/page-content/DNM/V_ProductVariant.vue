<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Product Variant</h2>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="pilihan == 1 ? headersDataVariantProductPackageCombination : pilihan == 2 ? headersDataVariantProductINV : headersDataVariantIDProductPackage"
        :loading="loadingtable"
        :items="DataProductVariant"
        :item-value="pilihan == 2 ? 'orderNumber' : 'idProductPackage'"
        density="comfortable"
        hide-default-footer
        hide-default-header
        class="elavation-3 rounded"
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
        <template #[`item.detail`]="{ item }">
          Detail
          <v-tooltip bottom>
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="x-large" icon="mdi mdi-information" color="#28a154" @click="detailData(item.raw, pilihan)" />
            </template>
            Detail {{ pilihan === 1 ? 'Product Package Combination' : pilihan === 2 ? 'Invoice' : 'Product Package' }}
          </v-tooltip>
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
                Pilihan Sumber Data
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <Autocomplete
                  v-model="pilihan"
                  pilihan-a="autocomplete"
                  :data-a="pilihanSumberOptions"
                  item-title="title"
						      item-value="value"
                  label-a="Pilihan Sumber Data"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                {{ pilihan === 1 ? 'Product Package Combination' : pilihan === 2 ? 'Invoice' : 'Product Package' }}
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <TextArea
                  v-model="textInput"
                  :label-ta="pilihan === 1 ? 'ID Product Package Combination (PPKG1,PPKG2,PPKG3,...)' : pilihan === 2 ? 'Invoice (INV-1INV-2INV3...)' : 'ID Product Package / Bundling (PPKG1,PPKG2,PPKG3,...)'"
                  rows="4"
                  :clearable-ta="true"
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
          </v-card>
          <v-divider :thickness="2" class="border-opacity-100" color="white" />
        </template>
      </v-data-table>
    </v-card>
    <v-bottom-sheet
      v-model="DetailProductVariant"
			scrollable
      persistent
      height="500px"
    >
      <v-sheet color="surface" style="font-size: 14px;">
        <v-row no-gutters class="pt-2">
          <v-col cols="12" md="6" class="pl-4 d-flex align-center">
            <h3>{{ pilihan ==  1 ? 'Detail Product Variant' : pilihan == 2 ? 'Detail Order' : 'Detail Product Package / Bundling' }}</h3>
          </v-col>
          <v-col cols="12" md="6" class="text-right">
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => {
                DetailProductVariant = false;
                DataPrdVariant = [];
              }"
            />
          </v-col>
        </v-row>
        <v-card color="background-dialog-card" class="ma-4 pa-2">
					<div class="customScroll">
            <table v-if="pilihan == 1 || pilihan == 3" border="1" cellspacing="0" cellpadding="0" width="100%" style="background-color: #28a154; border: #FFF;">
              <tr class="table-header">
                <template v-if="pilihan == 1">
                  <td>ID PRODUCT</td>
                  <td>CODE PRODUCT</td>
                  <td>NAMA PRODUCT</td>
                  <td>NAMA VARIANT</td>
                  <td>JENIS VARIANT</td>
                  <td>QUANTITY</td>
                  <td>GAMBAR</td>
                </template>
                <template v-else-if="pilihan == 3">
                  <td>ID PRODUCT SYNC</td>
                  <td>NAMA PRODUCT</td>
                  <td>JENIS VARIANT</td>
                  <td>QUANTITY</td>
                  <td>GAMBAR</td>
                </template>
              </tr>
              <template v-if="DataPrdVariant.length">
                <tr style="font-size: 9pt; font-weight: bold; color: white; padding: 10px" v-for="val in DataPrdVariant" :key="pilihan == 1 ? val.codeProduct : val.idProductSync">
                  <template v-if="pilihan == 1">
                    <td style="text-align: center;">{{ val.idProduct }}</td>
                    <td style="text-align: center;">{{ val.codeProduct }}</td>
                    <td style="padding-left: 10px;">{{ val.productName }}</td>
                    <td style="padding-left: 10px;">{{ val.name }}</td>
                    <td style="text-align: center;">{{ val.jenisVariant ? `${val.jenisVariant} | ${val.nameVariant}` : '-' }}</td>
                    <td style="text-align: center;">{{ val.quantity }}</td>
                    <td style="text-align: center;"><img class="gambar" :src="val.images" width="80"/></td>
                  </template>
                  <template v-else-if="pilihan == 3">
                    <td style="text-align: center;">{{ val.idProductSync }}</td>
                    <td style="padding-left: 10px;">{{ val.productName }}</td>
                    <td style="text-align: center;">{{ val.groupInputType ? `${val.groupInputType} | ${val.name}` : '-' }}</td>
                    <td style="text-align: center;">{{ val.quantity }}</td>
                    <td style="text-align: center;"><img class="gambar" :src="val.images" width="80"/></td>
                  </template>
                </tr>
              </template>
            </table>
            <template  v-if="pilihan == 2">
              <v-list
                :lines="false"
                density="compact"
                nav
                class="listData"
              >
                <v-list-item
                  v-for="val in DataPrdVariant"
                  :key="val.idProductSync"
                  :title="val.productName"
                >
                  <template v-slot:title>
                    <template v-if="val.packages.length">
                      <v-icon icon="mdi mdi-square-small" /><strong>Package :</strong> {{ `${val.idProductSync} - ${val.productName} ${val.productModelString ? `- ${val.productModelString}` : ''} ${!val.packages.length ? `(${val.quantity})` : ''}` }}<v-icon :icon="val.packages.length && 'mdi mdi-arrow-down-right-bold'" />
                    </template>
                    <template v-else>
                      <v-icon icon="mdi mdi-square-small" /><strong>Product :</strong> {{ `${val.idProductSync} - ${val.productName} ${val.productModelString ? `- ${val.productModelString}` : ''} (${val.quantity})` }}
                    </template>
                    <v-list-item
                      v-for="(data1) in val.packages"
                      :key="data1.idProduct"
                      :title="data1.productName"
                    >
                      <template v-slot:title>
                        <v-icon icon="mdi mdi-circle-small" />{{ `${data1.idProduct} - ${data1.productName} ${!data1.selectedVariants.length ? `(${data1.quantity})` : ''}` }}<v-icon :icon="data1.selectedVariants.length && 'mdi mdi-arrow-down-right-bold'" />
                        <template v-if="data1.selectedVariants.length">
                          <v-list-item
                            v-for="(data2) in data1.selectedVariants" 
                            :key="data2.id"
                            :title="data2.valueString"
                          >
                            <template v-slot:title>
                              <v-icon icon="mdi mdi-circle-small" />{{ data2.valueString }} ({{ data2.quantity }})
                            </template>
                          </v-list-item>
                        </template>
                      </template>
                    </v-list-item>
                  </template>
                </v-list-item>
              </v-list>
            </template>
					</div>
				</v-card>
      </v-sheet>
    </v-bottom-sheet>
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
  name: 'DataProductVariant',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
    pilihan: 1,
		DataProductVariant: [],
		headersDataVariantProductPackageCombination: [
      { title: "ID Product Package", key: "idProductPackage", sortable: false },
      { title: "ID Product Package Combination", key: "idPackageCombinationSync", sortable: false },
      { title: "Product Package Name", key: "productPackageName", sortable: false },
      { title: "Detail", key: "detail", sortable: false },
    ],
		headersDataVariantProductINV: [
      { title: "Invoice", key: "orderNumber", sortable: false },
      { title: "Detail", key: "detail", sortable: false },
    ],
		headersDataVariantIDProductPackage: [
      { title: "Product Package", key: "idProductPackage", sortable: false },
      { title: "Product Package Name", key: "productPackageName", sortable: false },
      { title: "Detail", key: "detail", sortable: false },
    ],
    pilihanSumberOptions: [
			{ title: "Product Package Combination", value: 1 },
			{ title: "Invoice", value: 2 },
			{ title: "Product Package", value: 3 },
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
    pilihan: 1,
    textInput: '',
    DetailProductVariant: false,
    DataPrdVariant: [],

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Product Variant",
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
    pilihan: {
			deep: true,
			handler(value, oldValue){        
        if(value !== oldValue) {
          this.textInput = ''
          this.DataProductVariant = []
        }
			}
		},
    textInput: {
			deep: true,
			handler(value){        
        if(value == '') {
          this.DataProductVariant = []
        }
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
	},
	methods: {
    CheckProses() {
      if(!this.textInput) {
				return this.notifikasi("warning", 'Parameter kosong !', "1")
			}
      this.DataProductVariant = [];
      let bodyData = {
				kondisi: this.pilihan,
				textInput: this.textInput,
      }
      this.$store.dispatch('user/getProductVariant', bodyData)
      .then((res) => {
				this.DataProductVariant = res.data.result
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    detailData(item, pilihan){
      this.DataPrdVariant = []
      this.DataPrdVariant = pilihan == 1 ? item.dataPackageCombination : pilihan == 2 ? item.OrderDetails : item.hasil
      this.DetailProductVariant = true
      console.log(this.DataPrdVariant, pilihan);
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
.customScroll {
  width: 100%;
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
.customScroll::-webkit-scrollbar {
  width: 6px;
}
.customScroll::-webkit-scrollbar-thumb {
  background-color: #28a154;
  border: 5px solid #e1e1f0;
  border-radius: 10rem;
}
.customScroll::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}
.listData {
	background-color: #e1e1f0;
	color: black;
	margin: 0px !important;
}
.table-header {
  font-weight: bold;
  color: white;
  font-size: 9pt;
  text-align: center;
}
.gambar {
	border-style: solid !important;
	border-radius: 10px !important;
	padding: 2px !important;
}
</style>