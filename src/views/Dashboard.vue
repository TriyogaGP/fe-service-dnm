<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Dashboard</h2>
    <!-- <v-card class="mb-2 pa-1 rounded" variant="outlined" elevation="4">
      <h2 v-if="roleID === '1' || roleID === '2'" class="subheading grey--text text-decoration-underline">{{ `Total KK dari 12 Wilayah (${total} KK / ${totalJiwa} Jiwa)` }}</h2>
      <v-container fluid v-if="roleID === '1' || roleID === '2'">
        <v-row>
          <v-col
            v-for="hasil in dataDashboard"
            :key="hasil.kode"
            cols="12"
            lg="3"
          >
            <v-card color="white" style="border: 2px solid #000;" @click="LinkRoute(hasil.kode)">
              <v-sheet color="#000" class="sheetData" elevation="2" style="padding: 5px;">
                <v-divider :thickness="2" class="border-opacity-75" color="white"/>
                <v-card-title class="text-white"><h6>{{ hasil.label }}</h6></v-card-title>
                <v-divider :thickness="2" class="border-opacity-75" color="white"/>
              </v-sheet>
              <v-card-text class="d-flex flex-column justify-center align-center">
                <v-card-title class="text-black"><h6>{{ `${hasil.jml} KK / ${hasil.totalJiwa} Jiwa` }}</h6></v-card-title>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <h2 v-if="roleID === '3'" class="subheading grey--text text-decoration-underline">{{ `Data Dari Wilayah ${dataDashboard.length ? `${dataDashboard[0].label}` : ''} (${dataDashboard.length ? `${dataDashboard[0].jml}` : '0'} KK / ${dataDashboard.length ? `${dataDashboard[0].totalJiwa}` : '0'} Jiwa)` }}</h2>
      <v-container fluid v-if="roleID === '3'">
        <v-row>
          <v-col
            v-for="hasil in dataDashboardTwo"
            :key="hasil.kodeKomisarisWilayah"
            cols="12"
            lg="4"
          >
            <v-card color="white" style="border: 2px solid #000;" @click="LinkRouteKomisaris(hasil.kodeKomisarisWilayah)">
              <v-sheet color="#000" class="sheetData" elevation="2" style="padding: 5px;">
                <v-divider :thickness="2" class="border-opacity-75" color="white"/>
                <v-card-title class="text-white"><h6>{{ hasil.kodeKomisarisWilayah }}</h6></v-card-title>
                <v-divider :thickness="2" class="border-opacity-75" color="white"/>
              </v-sheet>
              <div class="d-flex flex-column justify-space-between align-center ma-2">
                <v-row>
                  <v-col
                    cols="12"
                    md="12"
                    class="mt-2 d-flex align-center justify-center"
                    style="height: 30px;"
                  >
                    <span v-html="hasil.namaKomisaris" style="font-size: 9pt; font-weight: bold;"/>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    md="12"
                    class="d-flex align-center justify-center"
                    style="height: 40px;"
                  >
                    <span v-html="hasil.daerah" style="font-size: 9pt; font-weight: bold;"/>
                  </v-col>
                </v-row>
              </div>
              <v-divider :thickness="2" class="border-opacity-100 mt-4" color="black" />
              <v-card-actions style="padding: 5px !important; min-height: 20px !important;">
                <v-row no-gutters>
                  <v-col
                    class="d-flex align-center justify-center"
                    cols="12"
                    md="12"
                  >
                    <h3 style="font-size: 12pt; font-weight: bold;">{{ `${hasil.jml} KK / ${hasil.totalJiwa} Jiwa` }}</h3>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card> -->
    <!-- <download-excel
      :data="json_data"
      :fields="json_fields"
      worksheet="My Worksheet"
      name="filename.xls"
    >
      <Button 
        color-button="#0bd369"
        icon-prepend-button="mdi mdi-export"
        nama-button="Export Excel"
        size-button="x-small"
      />
    </download-excel> -->
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
import PopUpNotifikasi from "./Layout/PopUpNotifikasi.vue";

export default {
  name: 'Dashboard',
  components: { PopUpNotifikasi },
  data: () => ({
    totalNotif: 0,
    cols: 4,
    roleID: '',

    json_fields: {
      "Complete name": "name",
      City: "city",
      Telephone: "phone.mobile",
      "Telephone 2": {
        field: "phone.landline",
          callback: (value) => {
          return `Landline Phone - ${value}`;
        },
      },
    },
    json_data: [
      {
        name: "Tony Peña",
        city: "New York",
        country: "United States",
        birthdate: "1978-03-15",
        phone: {
          mobile: "1-541-754-3010",
          landline: "(541) 754-3010",
        },
      },
      {
        name: "Thessaloniki",
        city: "Athens",
        country: "Greece",
        birthdate: "1987-11-23",
        phone: {
          mobile: "+1 855 275 5071",
          landline: "(2741) 2621-244",
        },
      },
    ],
    json_meta: [
      [
        {
          key: "charset",
          value: "utf-8",
        },
      ],
    ],
    
    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Dashboard",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })

  },
  computed: {
    ...mapState({
			// dataDashboard: store => store.user.dataDashboard,
			// dataDashboardTwo: store => store.user.dataDashboardTwo,
			// wilayahpanjaitanOptions: store => store.setting.wilayahpanjaitanOptions,
		}),
    // total(){
    //   const data = this.dataDashboard.reduce((acc, curr) => {
		// 		return { jml: acc.jml + curr.jml };
		// 	}, { jml: 0 });
    //   return data.jml
    // },
    // totalJiwa(){
    //   const data = this.dataDashboard.reduce((acc, curr) => {
		// 		return { totalJiwa: acc.totalJiwa + curr.totalJiwa };
		// 	}, { totalJiwa: 0 });
    //   return data.totalJiwa
    // },
    // namaWilayah(){
    //   let getWilayah = this.wilayahpanjaitanOptions.filter(val => val.kode === localStorage.getItem('wilayah'))
    //   return getWilayah.length ? getWilayah[0].label : ''
    // },
  },
  watch: {
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    // this.getDashboard()
    // this.getWilayahPanjaitan();
    // if(this.roleID === '3') this.getDashboardTwo()
  },  
	methods: {
    ...mapActions({
      // getDashboard: 'user/getDashboard',
      // getDashboardTwo: 'user/getDashboardTwo',
			// getWilayahPanjaitan: 'setting/getWilayahPanjaitan',
    }),
    LinkRoute(kode){
      // this.$router.push({name: "DataKeanggotaan", params: { kategori: this.roleID === '1' || this.roleID === '2' ? kode : 'all' }});
      this.$router.push({name: "DashboardWilayah", params: { kategori: kode }});
    },
    LinkRouteKomisaris(kode){
      this.$router.push({name: "DataKeanggotaan", params: { kategori: kode }});
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
.v-chip-group {
  display: flex;
  justify-content: center;
}
.v-chip {
  cursor: default;
}
.box{
	width: 120px;
	height: 50px;
  background-image:-moz-linear-gradient(top, #28a154, #000);
	background-image: -webkit-gradient(linear, 100% 25%, 50% 100%, from(#28a154), to(#000), color-stop(1,#000));
	border-radius: 10px;
	padding: 0px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
	text-align: center;
	font-size: 8pt;
	font-weight: bold;
	color: white;
}
</style>