<template>
  <div>
      <v-card class="pa-1 rounded" variant="outlined" elevation="4">
        <v-row class="ma-1 tampilView">
          <v-col cols="8" class="kotakleft">
            <v-tabs
              v-model="tab"
              fixed-tabs
              bg-color="background-dialog-card"
              density="comfortable"
            >
              <v-tab v-for="item in itemsTab" :key="item.code" :value="item.code">
                <v-icon :icon="item.icon" />
                {{ item.text }}
              </v-tab>
            </v-tabs>
            <v-window v-model="tab">
              <v-window-item value="1">
                <div class="customScrollLeft">
                  <div class="text-right">
                    <Button 
                      color-button="#0bd369"
                      :icon-prepend-button="kondisiForm ? 'mdi mdi-pencil' : 'mdi mdi-close'"
                      nama-button="Ubah Data Diri"
                      size-button="x-small"
                      @proses="() => { kondisiForm = !kondisiForm; }"
                    />
                  </div>
                  <Fieldset
                    legend="Data Log In"
                    :toggleable="true"
                  >
                    <v-row no-gutters>
                      <v-col
                        cols="12"
                        md="4"
                        class="pt-2 d-flex align-center font-weight-bold"
                      >
                        Consumer Type
                      </v-col>
                      <v-col
                        cols="12"
                        md="8"
                        class="pt-3"
                      >
                        <span v-html="previewData.namaRole"></span>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col
                        cols="12"
                        md="4"
                        class="pt-2 d-flex align-center font-weight-bold"
                      >
                        Nama Lengkap
                      </v-col>
                      <v-col
                        cols="12"
                        md="8"
                        class="pt-3"
                      >
                        <span v-if="kondisiForm" v-html="previewData.nama"></span>
                        <TextField
                          v-else
                          v-model="inputAdministrator.nama"
                          label-tf="Nama Lengkap"
                          :clearable-tf="true"
                        />
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col
                        cols="12"
                        md="4"
                        class="pt-2 d-flex align-center font-weight-bold"
                      >
                        Username
                      </v-col>
                      <v-col
                        cols="12"
                        md="8"
                        class="pt-3"
                      >
                        <span v-if="kondisiForm" v-html="previewData.username"></span>
                        <TextField
                          v-else
                          v-model="inputAdministrator.username"
                          label-tf="Username"
                          :clearable-tf=true
                        />
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col
                        cols="12"
                        md="4"
                        class="pt-2 d-flex align-center font-weight-bold"
                      >
                        Kata Sandi
                      </v-col>
                      <v-col
                        cols="12"
                        md="8"
                        class="pt-3"
                      >
                        {{ previewData.password }}&nbsp;
                        <v-icon
                          class="mr-1"
                          color="light-black darken-3"
                          tabindex="-1"
                          @click="endecryptData('endecryptType')"
                          :icon="endecryptType ? 'mdi mdi-eye-lock' : 'mdi mdi-eye-lock-open'"
                          size="large"
                        />
                      </v-col>
                    </v-row>
                  </Fieldset>
                  <div class="text-right">
                    <Button
                      v-if="!kondisiForm"
                      color-button="#0bd369"
                      nama-button="Simpan Data"
                      size-button="x-small"
                      @proses="SimpanDataProfile()"
                    />
                  </div>
                </div>
              </v-window-item>
              <v-window-item value="2">
                <div class="customScrollLeft">
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="4"
                      class="pt-2 d-flex align-center"
                    >
                      Kata Sandi Lama
                    </v-col>
                    <v-col
                      cols="12"
                      md="8"
                      class="pt-3"
                    >
                      <TextField
                        v-model="authData.passwordLama"
                        :slot-tf="true"
                        label-tf="Kata Sandi Lama"
                        :type-tf="passTypeLama ? 'text' : 'password'"
                        :icon-append-tf="passTypeLama ? 'mdi mdi-eye-lock' : 'mdi mdi-eye-lock-open'"
                        :clearable-tf="true"
                        autocomplete="current-password"
                        @prosesicon="onClickVisible('passTypeLama')"
                      />
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="4"
                      class="pt-2 d-flex align-center"
                    >
                      Kata Sandi Baru
                    </v-col>
                    <v-col
                      cols="12"
                      md="8"
                      class="pt-3"
                    >
                      <TextField
                        v-model="authData.passwordBaru"
                        :slot-tf="true"
                        label-tf="Kata Sandi Baru"
                        :type-tf="passTypeBaru ? 'text' : 'password'"
                        :icon-append-tf="passTypeBaru ? 'mdi mdi-eye-lock' : 'mdi mdi-eye-lock-open'"
                        :clearable-tf="true"
                        autocomplete="new-password"
                        @prosesicon="onClickVisible('passTypeBaru')"
                      />
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      md="4"
                      class="pt-2 d-flex align-center"
                    >
                      Kata Sandi Konfirmasi Baru
                    </v-col>
                    <v-col
                      cols="12"
                      md="8"
                      class="pt-3"
                    >
                      <TextField
                        v-model="authData.passwordConfBaru"
                        :slot-tf="true"
                        label-tf="Kata Sandi Konfirmasi Baru"
                        :type-tf="passTypeConfBaru ? 'text' : 'password'"
                        :icon-append-tf="passTypeConfBaru ? 'mdi mdi-eye-lock' : 'mdi mdi-eye-lock-open'"
                        :clearable-tf="true"
                        autocomplete="new-password"
                        @prosesicon="onClickVisible('passTypeConfBaru')"
                      />
                    </v-col>
                  </v-row>
                  <div class="text-right mt-2">
                    <Button
                      color-button="#0bd369"
                      nama-button="Ubah Kata Sandi"
                      size-button="x-small"
                      :disabled-button="kondisiTombol"
                      @proses="UbahKataSandi()"
                    />
                  </div>
                </div>
              </v-window-item>
            </v-window>
          </v-col>
          <v-col cols="4" class="kotakright">
            <div class="mt-4 d-flex flex-column justify-space-between align-center">
              <div class="avatar">
                <v-img src="user.png" />
              </div>
              <!-- <div class="avatar" @click="pilihFile()">
                <span class="tulisan">
                  <v-icon color="white" icon="mdi mdi-camera-account" />&nbsp;Ubah Foto Profil
                </span>
                <v-img :src="previewData.fotoProfil" />
              </div>
              <input 
                ref="fotoProfile"
                :key="componentKey"
                type="file"
                accept="image/*"
                style="display: none"
                @change="uploadFotoProfile($event)"
              > -->
            </div>
            <p class="white--text mt-1 text-center" style="font-size: 10pt;"><strong>{{nama}}</strong></p>
            <p class="white--text text-center" style="font-size: 9pt;">{{namaRole}}</p>
            <v-divider :thickness="2" class="border-opacity-100" />
          </v-col>
        </v-row>
      </v-card>
    <v-dialog
      v-model="dialogCrop"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-card-text class="pt-4 v-dialog--custom">
          <Cropper
            ref="cropper"
            class="cropper"
            :src="image.src"
            :stencil-component="$options.components.Stencil"
          />
        </v-card-text>
        <v-divider :thickness="2" class="border-opacity-100" color="black" />
        <v-card-actions>
          <v-row 
            no-gutters
            class="mr-3"
          >
            <v-col
              class="text-end"
              cols="12"
            >
              <Button
                color-button="black"
                nama-button="Tutup"
                @proses="tutupDialogCrop()"
              />
              <Button
                color-button="black"
                nama-button="Crop Lampiran"
                @proses="crop()"
              />
            </v-col>
          </v-row>  
        </v-card-actions>
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
        @proses="goToProses"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import PopUpNotifikasi from "./Layout/PopUpNotifikasi.vue";
import PdfCetakan from "./Layout/PdfCetakan.vue";
import Stencil from "./Layout/Stencil.vue";
import { RectangleStencil } from "vue-advanced-cropper";

function getMimeType(file, fallback = null) {
	const byteArray = (new Uint8Array(file)).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
      header += byteArray[i].toString(16);
  }
	switch (header) {
    case "89504e47":
      return "image/png";
      case "47494638":
        return "image/gif";
        case "ffd8ffe0":
          case "ffd8ffe1":
    case "ffd8ffe2":
      case "ffd8ffe3":
        case "ffd8ffe8":
          return "image/jpeg";
    default:
      return fallback;
    }
  }

export default {
  name: 'Profile',
  components: { PopUpNotifikasi, PdfCetakan, RectangleStencil, Stencil  },
  data: () => ({
    roleID: '',
    nama: '',
    namaRole: '',
    idUser: '',
    isLoadingPDF: [],
    dialogPDF: false,
    urlSk: window.location.href,
    BASE_URL: '',
    inputAdministrator: {
      idAdmin: '',
      level: '',
      nama: '',
      username: '',
    },
    previewData: {
      idAdmin: '',
      namaRole: '',
      nama: '',
      username: '',
      password: '',
      fotoProfil: '',
    },
    levelOptions: [
			{ title: 'Super Administrator', value: 1 },
			{ title: 'Administrator', value: 2 },
			{ title: 'Operation', value: 3 },
			{ title: 'Marketing', value: 4 },
			{ title: 'Guest', value: 5 },
		],
    authData: {
      passwordLama: '',
      passwordBaru: '',
      passwordConfBaru: '',
    },
    kondisiForm: true,
    kondisiTombol: true,
    passType: '',
    passTypeLama: '',
    passTypeBaru: '',
    passTypeConfBaru: '',
    endecryptType: '',
    itemsTab: [
			{code: '1', text: 'Data Profile', icon: 'mdi mdi-account'},
			{code: '2', text: 'Ubah Kata Sandi', icon: 'mdi mdi-lock'},
		],
		tab: '',
		componentKey: 0,
    dialogCrop: false,
    image: {
      src: null,
      type: null,
    },
    FileFotoProfil: '',
    fotoProfil: '',
    options: {
      penColor: "#000",
    },

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Profile",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
    return { RectangleStencil }
  },
  computed: {
    ...mapGetters({
      dataprofile: 'auth/dataprofile',
    }),
  },
  watch:{
		dataprofile:{
      deep: true,
			handler(value){
        this.previewData = {
          idAdmin: value.idAdmin,
          namaRole: value.namaRole,
          nama: this.uppercaseLetterFirst2(value.nama),
          username: value.username,
          password: value.kataSandi,
          fotoProfil: value.fotoProfil,
        }
        this.inputAdministrator = {
          idAdmin: value.idAdmin,
          nama: this.uppercaseLetterFirst2(value.nama),
          level: value.consumerType,
          username: value.username,
        }
        localStorage.setItem('fotoProfil', this.previewData.fotoProfil)
			}
		},
		tab:{
      deep: true,
			handler(value){
				if (value === '1') {
          this.getProfile()
          this.passType = true
          this.endecryptType = false
          this.clearForm()
        }
			}
		},
    authData: {
      deep: true,
      handler(value){
        if(value.passwordLama == null){ this.authData.passwordLama = '' }
        if(value.passwordBaru == null){ this.authData.passwordBaru = '' }
        if(value.passwordConfBaru == null){ this.authData.passwordConfBaru = '' }
  
        if(value.passwordLama != '' && value.passwordBaru != '' && value.passwordConfBaru != ''){
          this.kondisiTombol = false
        }else{
          this.kondisiTombol = true	
        }
      }
    },
	},
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem("roleID")
    this.nama = localStorage.getItem("nama")
    this.namaRole = localStorage.getItem("nama_role")
    this.idUser = localStorage.getItem("idLogin")
    this.BASE_URL = process.env.VUE_APP_BASE_URL_VIEW
    this.passType = true
    this.endecryptType = false
    this.passTypeLama = false
    this.passTypeBaru = false
    this.passTypeConfBaru = false
  },
  methods: {
    ...mapActions({
      fetchData: 'fetchData',
      uploadFiles: 'upload/uploadFiles',
      getProfile: 'auth/getProfile',
    }),
    SimpanDataProfile(){
      let bodyData = {
        idUser: localStorage.getItem('idLogin'),
        consumerType: this.inputAdministrator.level,
        nama: this.inputAdministrator.nama,
        username: this.inputAdministrator.username,
      }
      this.$store.dispatch('auth/postProfile', bodyData)
      .then((res) => {
        this.kondisiForm = true
        localStorage.setItem('nama', this.inputAdministrator.nama);
        this.clearForm()
        this.getProfile()
        this.notifikasi("success", res.data.message, "2")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    UbahKataSandi() {
      let bodyData = {
        idUser: localStorage.getItem('idLogin'),
        passwordLama: this.authData.passwordLama,
        passwordBaru: this.authData.passwordBaru,
        passwordConfBaru: this.authData.passwordConfBaru,
      }
      this.$store.dispatch('auth/postKataSandi', bodyData)
      .then((res) => {
        this.kondisiForm = true
        this.clearForm()
        this.getProfile()
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    pilihFile() {
      this.$refs.fotoProfile.click();
    },
    async uploadFotoProfile(e) {
      let files = e.target.files[0];
      if(!files) return this.notifikasi("warning", 'Ulangi unggah Foto Profile', "1")
      let ukuran = (files.size / (1024*1024)).toFixed(2);
      if(ukuran > 5.00) { 
        this.componentKey++; 
        return this.notifikasi("warning", 'Unggah Foto Profile anda terlalu besar !', "1")
      }
      this.fotoProfil = files.name
      this.loadImage(files)
    },
    loadImage(files) {
      this.dialogCrop = true
      const blob = URL.createObjectURL(files);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = {
          src: blob,
          type: getMimeType(e.target.result, files.type),
        }
      }
      reader.readAsArrayBuffer(files);
    },
    crop() {
			const { canvas } = this.$refs.cropper.getResult();
			canvas.toBlob(async (blob) => {
        this.FileFotoProfil = blob
        let uploadFotoProfil = await this.uploadLampiran(localStorage.getItem("idLogin"), this.FileFotoProfil)
        if(uploadFotoProfil != undefined){ 
          localStorage.setItem('fotoProfil', `${this.BASE_URL}/image/${uploadFotoProfil.data.result.idUser}/${uploadFotoProfil.data.result.namaFile}`)
          this.tutupDialogCrop()
          this.notifikasi("success", "Berhasil ubah Foto Profile", "2")
        }else{ 
          this.componentKey++;
          this.tutupDialogCrop()
          this.notifikasi("error", 'Gagal ubah Foto Profile', "1")
        }
			}, this.image.type);

		},
    tutupDialogCrop(){
      this.FileFotoProfil = ''
      this.fotoProfil = '';
      this.image = {
        src: null,
        type: null,
      }
      this.$refs.fotoProfile.value = null
      this.$refs.cropper.value = null
      this.dialogCrop = false
    },
    async uploadLampiran(idAdmin, dataUpload) {
			if(dataUpload){
				const bodyData = {
					idUser: idAdmin,
					field: 'fotoprofil',
					nama_folder: idAdmin,
					nama_file: `${idAdmin}-fotoprofil`,
					jenis: "image",
					bagian: "berkas",
					table: "Admin",
					files: dataUpload,
				};
				try {
					let response = await this.uploadFiles(bodyData);
					return response
				} catch (err) {
					this.notifikasi("error", err.response.data.message, "1")
				}
			}else{
        return undefined
      }
		},
    goToProses() {
      window.location.reload();
    },
    onClickVisible(d) {
      this[d] = !this[d]
    },
    endecryptData(d) {
      this[d] = !this[d]
      let url = this[d] ? 'decryptPass' : 'encryptPass' 
      let payload = {
				method: "get",
				url: `settings/${url}?kata=${this.previewData.password}`,
				authToken: localStorage.getItem('user_token')
			};
      this.previewData.password = ''
			this.fetchData(payload)
			.then((res) => {
				this.previewData.password = res.data.result.hasil;
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
    },
    clearForm(){
      this.authData = {
        passwordLama: '',
        passwordBaru: '',
        passwordConfBaru: '',
      }
      this.inputAdministrator = {
        idAdmin: '',
        level: '',
        nama: '',
        username: '',
      }
    },
		notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
  },
}
</script>
<style scoped>
.tableClass, .tdClass, .thClass {
  border: 2px solid #FFF;
  padding: 5px;
  text-align: center;
	font-size: 7.5pt;
  font-weight: bold;
}
.tableClass, .tdSClass, .thSClass {
  border: 2px solid #FFF;
  padding: 5px;
  text-align: center;
	font-size: 7.5pt;
  font-weight: bold;
}
.tdSClass {
  text-align: left;
}
.thClass, .thSClass {
  border: 2px solid #FFF;
  background-color: #000;
  color: #FFF;
}
.tableClass {
  width: 100%;
  border-collapse: collapse;
}
.textHari {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
.ttd{ 
  font-size: 10px; 
  font-weight: bold;
}
.boxlist{
  height: 40px;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	-khtml-border-radius: 5px; 
	border-radius: 5px;
	padding: 5px 10px;
	margin: 2px;
	text-align: center;
  justify-content: center;
	font-size: 9pt;
	font-weight: bold;
	background-color: #0ACC75B1;
	border: 1px solid #FFFFFF;
	color: #FFFFFF;
}
.boxlistBerkas{
  height: 40px;
  width: 150px;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	-khtml-border-radius: 5px; 
	border-radius: 5px;
	padding: 5px 10px;
	margin: 2px;
	text-align: center;
  justify-content: center;
	font-size: 9pt;
	font-weight: bold;
	background-color: #0ACC75B1;
	border: 1px solid #FFFFFF;
	color: #FFFFFF;
}
.listData {
	background-color: #28a154;
	color: white;
	margin: 0px !important;
  padding: 0px !important;
}
.tampilView{
  height: 450px;
}
.kotakleft {
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
}
.kotakright {
  border-left: 3px solid #000;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
  padding: 10px;
  background-color: #28a154;
  height: 100%;
  color: #ffffff;
}
.kotak {
	border: 2px dashed #000;
	border-radius: 5px;
	text-align: justify;
	background: #FFF;
	color: #000;
	margin: 5px;
  padding: 5px;
  font-size: 9pt;
}
.v-tab {
	font-size: 8pt !important;
	font-weight: bold !important;
}
.avatar {
  border: solid 2px #FFF;
  border-radius: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  width: 185px;
  height: 185px;
  /* cursor: pointer; */
}
/* .avatar:hover {
  border: solid 2px #FFF;
  opacity: 0.5;
} */

.avatar:hover img {
  position: absolute;
  z-index: 1;
}
.tulisan {
  position: absolute;
  visibility: hidden;
}
.avatar:hover .tulisan {
  border-radius: 5px;
  align-items: center;
  display: flex;
  justify-content: center;
  position: absolute;
  background: #000000;
  color: #FFF;
  font-size: 12px;
  visibility: visible;
  font-weight: bold;
  z-index: 100;
  width: 185px;
  height: 30px;
}
.cropper {
  border: double 3px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
  min-height: 450px;
  width: auto;
}
.customScrollLeft {
  width: 100%;
  height: 390px;
  background: #28a154;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 5px;
  padding: 8px;
  border: 2px solid #28a154;
	border-radius: 5px;
  color: #ffffff;
  font-size: 10pt;
}

.customScrollLeft::-webkit-scrollbar {
  width: 16px;
}
.customScrollLeft::-webkit-scrollbar-thumb {
  background-color: #000;
  border: 5px solid #28a154;
  border-radius: 10rem;
}
.customScrollLeft::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}
.customScrollRight {
  width: 100%;
  height: 175px;
  background: #28a154;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 5px;
}

.customScrollRight::-webkit-scrollbar {
  width: 16px;
}
.customScrollRight::-webkit-scrollbar-thumb {
  background-color: #000;
  border: 5px solid #28a154;
  border-radius: 10rem;
}
.customScrollRight::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  /* background: transparent; */
}
@media screen and (min-width: 1920px) {
  .tampilView {
    height: 770px;
  }
  .customScrollLeft {
    height: 710px;
  }
  .customScrollRight {
    height: 500px;
  }
}
</style>