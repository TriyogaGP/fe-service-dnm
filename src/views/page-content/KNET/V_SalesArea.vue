<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Sales Area</h2>
    <v-card class="peta" variant="outlined" elevation="4">
      <h5 id="title" class="mb-2 text-center"></h5>
      <v-row no-gutters>
        <v-col cols="12" md="3" class="pa-1 d-flex align-start">
          <v-row no-gutters>
            <v-col cols="12" md="12">
              <v-card color="white" style="border: 2px solid #000;">
                <v-sheet color="#000" class="sheetData" elevation="2" style="padding: 5px;">
                  <v-divider :thickness="2" class="border-opacity-75" color="white"/>
                  <v-card-title class="text-white"><h6>Total Sales</h6></v-card-title>
                  <v-divider :thickness="2" class="border-opacity-75" color="white"/>
                </v-sheet>
                <v-card-text class="d-flex flex-column justify-center align-center">
                  <!-- <v-card-title class="text-black"><h6>{{ detailSummary.totalQty }}</h6></v-card-title> -->
                  <v-card-title class="text-black"><h6>{{ totalSales }}</h6></v-card-title>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="9" class="pa-2 d-flex align-center">
          <svg-map
            :map="indonesia"
            @click="ViewMap($event)"
            :location-class="getLocationClass"
            @focus="(e) => { e.target.style.fill = 'green' }"
            @mouseover="(e) => { e.target.style.fill = 'red'; pointLocation(e); }"
            @mouseleave="(e) => { e.target.style.fill = '' }"
            @mouseout="unpointLocation($event)"
            @mousemove="moveOnLocation($event)"
          />
          <div
            v-if="tooltipStyle"
            class="examples__block__map__tooltip"
            :style="tooltipStyle"
          >
            {{ `${pointedLocation} ${dataTampil && dataTampil.length ? `(${dataTampil[0].total})` : ''}` }}
          </div>
        </v-col>
      </v-row>
		</v-card>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="dataSalesArea"
        item-value="province"
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
        <template #[`item.number`]="{ item }">
          {{ item.index + 1 }}
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
            <v-col cols="12" md="9" class="d-flex align-center" />
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
import { SvgMap } from "vue3-svg-map";
import indonesia from "../../../core/plugins/indonesia.js";
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataSalesArea',
  components: {
    PopUpNotifikasi,
    SvgMap,
  },
  data: () => ({
    indonesia,
		pointedLocation: '',
		tooltipStyle: null,
		dataTampil: null,
		totalSales: 0,
		tanggal: [],
		dataSalesArea: [],
    headers: [
      { title: "NO", key: "number", sortable: false, width: "5%" },
      { title: "PROVINSI", key: "province", sortable: false },
      { title: "TOTAL SALES", key: "total", sortable: false },
    ],
    
	  //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Sales Area",
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
      salesAreaAll: 'kmart/salesAreaAll',
    }),
  },
  watch: {
    salesAreaAll: {
			deep: true,
			handler(value) {
        this.dataSalesArea = value
        const totalKeseluruhan = value.reduce((acc, curr) => {
          return {
            total: Number(acc.total) + Number(curr.total),
          };
        }, {
          total: 0,
        });
        this.totalSales = totalKeseluruhan.total
      }
		},
    tanggal: {
			deep: true,
			handler(value) {
        if(value === null) this.tanggal = []
        this.CheckProses(this.tanggal)
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    document.getElementById('title').innerHTML = `DNM Mobile Sales Area on Indonesia`
    this.CheckProses('')
	},
	methods: {
    ...mapActions({
      getSalesArea: 'kmart/getSalesArea',
    }),
    CheckProses(tanggal) {
      this.dataSalesArea = []
      this.totalSales = 0
      let startdate = '', enddate = '';
			if(tanggal.length === 2){
        startdate = this.convertDateToPicker2(tanggal[0])
        enddate = this.convertDateToPicker2(tanggal[1])
      }
      this.getSalesArea(qs.stringify({ startdate, enddate, jenisShipping: 'Delivery' }, { encode: false }))
    },
    ViewMap(e) {
			document.getElementById('title').innerHTML = e.target.ariaLabel === 'Map of Indonesia' ? 'DNM Mobile Sales Area on Indonesia' : `Provinsi : ${e.target.ariaLabel}`
			// this.getData(e.target.ariaLabel)
		},
		pointLocation(e) {      
			this.pointedLocation = e.target.ariaLabel === 'Map of Indonesia' ? 'Map of Indonesia' : `Provinsi : ${e.target.ariaLabel}`
		},
		unpointLocation(e) {
			this.pointedLocation = null
			this.tooltipStyle = { display: 'none' }
		},
		moveOnLocation(e) {
      this.dataTampil = this.dataSalesArea.filter(val => {
        if(val.province == e.target.ariaLabel) return val
      })
			this.tooltipStyle = {
				display: 'block',
				top: `${e.clientY + 10}px`,
				left: `${e.clientX - 100}px`,
			}
		},
    getLocationClass(location, index) {
			// Generate heat map
			return `svg-map__location svg-map__location--heat${index % 4}`
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
#title {
  font-size: 11pt;
  font-weight: bold;
}
.peta {
  width: 85%;
  display: contents;
}
</style>

<style lang="scss">
.examples {
	width: 1000px;
	margin: 0 auto;
	font-family: Arial, sans-serif;
	text-align: center;

	&__title {
		margin-bottom: 80px;
		padding-bottom: 40px;
		border-bottom: 1px dotted black;
		font-size: 24px;
	}

	&__block {
		margin-bottom: 80px;
		padding-bottom: 80px;
		border-bottom: 1px dotted black;


		&__title {
			margin-bottom: 40px;
			font-size: 20px;
		}

		&__info {
			display: inline-block;
			vertical-align: top;
			width: 450px;
			text-align: left;

			&__item {
				margin-bottom: 20px;
			}
		}

		&__map {
			display: inline-block;
			width: 500px;

			&--australia {
				.svg-map {
					stroke-width: 0.5; // Australia stroke is larger than other maps
				}
			}

			&--usa {
				width: 800px; // USA needs more space	for tooltip

				.svg-map__location {
					&--heat0 {
						fill: blue;
					}

					&--heat1 {
						fill: lightblue;
					}

					&--heat2 {
						fill: orange;
					}

					&--heat3 {
						fill: red;
					}

					&:focus,
					&:hover {
						opacity: 0.75;
					}
				}
			}

			&__tooltip {
				position: fixed;
				width: auto;
        height: auto;
				padding: 10px;
				border: 2px solid black;
				background-color: white;
        border-radius: 5px;
			}
		}
	}
}
</style>