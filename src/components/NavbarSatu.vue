<template>
	<nav>
		<v-app-bar class="nav-header" dark app>
			<div class="nav-logo">
				<v-img class="gambarLogo" :src="logoWebsite" />
				<span class="textNamaWebsite">{{ singkatanWebsite }}</span>
			</div>
			<v-divider vertical :thickness="2" color="white" />
			<v-icon start style="margin-left: 10px;" size="middle" icon="mdi mdi-format-list-bulleted" @click.stop="drawer = !drawer" color="icon-white" />
			<v-spacer />
			<div class="nav-proses">
				<!-- <v-badge
					v-if="roleID === '1' || roleID === '2'"
					:content="`${totalNotif >= 99 ? '99+' : totalNotif}`"
					:value="`${totalNotif >= 99 ? '99+' : totalNotif}`"
					color="green"
					overlap
					:style="`${totalNotif >= 99 ? 'margin-right: 15px;' : 'margin-right: 5px;'}`"
				>
					<v-btn
						size="small"
						icon="mdi mdi-bell"
						color="icon-white"
						style="height: 28px; width: 28px;"
						router to="/notifikasi" />
				</v-badge> -->
				<v-menu
					rounded="t-xs b-lg"
					open-on-click
					offset-y
					transition="slide-y-transition"
					location="bottom"
				>
					<template v-slot:activator="{ props }">
						<span
							class="white--text ma-3 UserPanel"
							v-bind="props"
						>
							{{ inisialuppercaseLetterFirst(nama) }}
							<v-avatar size="35">
								<v-img src="user.png"></v-img>
							</v-avatar>
						</span>
					</template>

					<v-list
						:lines="false"
						density="comfortable"
						nav
						class="listData"
					>
						<v-list-item
							v-if="roleID === '1' || roleID === '2'"
							router to="/settings"
							color="nav-back"
							class="SelectedMenu"
							active-class="SelectedMenu-active"
							title="Pengaturan"
						>
							<template v-slot:prepend>
								<v-icon size="middle" icon="mdi mdi-cog-outline" color="icon-white" />
							</template>
							<template v-slot:title>
								<span class="menufont">Pengaturan</span>
							</template>
						</v-list-item>
						<v-list-item
							router to="/profile"
							color="nav-back"
							class="SelectedMenu"
							active-class="SelectedMenu-active"
							title="Profil"
						>
							<template v-slot:prepend>
								<v-icon size="middle" icon="mdi mdi-account" color="icon-white" />
							</template>
							<template v-slot:title>
								<span class="menufont">Profil</span>
							</template>
						</v-list-item>
						<!-- <v-list-item
							router to="/broadcast"
							color="nav-back"
							class="SelectedMenu"
							title="Broadcast"
						>
							<template v-slot:prepend>
								<v-icon size="middle" icon="mdi mdi-broadcast" color="icon-white" />
							</template>
							<template v-slot:append>
								<span class="boxnotif" v-html="totalBroadcast" />
							</template>
							<template v-slot:title>
								<span class="menufont">Broadcast</span>
							</template>
						</v-list-item>
						<v-list-item
							v-if="roleID === '3' || roleID === '4'"
							router to="/percakapan"
							color="nav-back"
							class="SelectedMenu"
							title="Percakapan"
						>
							<template v-slot:prepend>
								<v-icon size="middle" icon="mdi mdi-chat" color="icon-white" />
							</template>
							<template v-slot:title>
								<span class="menufont">Percakapan</span>
							</template>
						</v-list-item> -->
						<v-list-item
							@click="keluar()"
							color="nav-back"
							class="SelectedMenu"
							title="Keluar"
						>
							<template v-slot:prepend>
								<v-icon size="middle" icon="mdi mdi-logout" color="icon-white" />
							</template>
							<template v-slot:title>
								<span class="menufont">Keluar</span>
							</template>
						</v-list-item>
					</v-list>
				</v-menu>
			</div>
		</v-app-bar>
		<v-navigation-drawer v-model="drawer" class="navigation-drawer">
			<div class="customScroll">
				<v-list dense style="padding: 5px">
					<span v-for="data in optionMenu" :key="data.menuText">
						<v-list-item
							v-if="!data.subMenu.length && !data.kondisi"
							router :to="data.menuRoute === '/data-biodata' ? `${data.menuRoute}/all` : data.menuRoute"
							class="SelectedMenu"
							active-class="SelectedMenu-active"
							:title="data.menuText"
						>
							<template v-slot:title>
								<v-icon size="middle" :icon="data.menuIcon" color="icon-white" style="margin-right: 10px;" />
								<span class="menufont">{{ data.menuText }}</span>
							</template>
						</v-list-item>
						<v-list-group
							v-if="(data.subMenu.length && !data.kondisi) || (!data.subMenu.length && data.kondisi && mengajarOptions.length)"
							:value="data.menuText"
							class="SelectedMenu"
							active-class="SelectedMenu-active"
							collapse-icon="mdi mdi-menu-up"
							expand-icon="mdi mdi-menu-down"
						>
							<template v-slot:activator="{ props }">
								<v-list-item :title="data.menuText" v-bind="props">
									<template v-slot:title>
										<v-icon size="middle" :icon="data.menuIcon" color="icon-white" style="margin-right: 10px;" />
										<span class="menufont">{{ data.menuText }}</span>
									</template>
								</v-list-item>
							</template>
							<span v-if="(data.subMenu.length && !data.kondisi) || (!data.subMenu.length && data.kondisi)">
								<v-list-item
									v-for="submenu in (!data.kondisi) ? data.subMenu : mengajarOptions"
									:key="(!data.kondisi) ? submenu.menuText : submenu.label"
									router :to="submenu.menuRoute"
									class="SelectedSubMenu"
									active-class="SelectedSubMenu-active"
									:title="(!data.kondisi) ? submenu.menuText : submenu.label"
								>
									<template v-slot:title>
										<v-icon size="middle" :icon="(!data.kondisi) ? submenu.menuIcon : 'mdi mdi-book-education'" color="icon-white" style="margin-right: 10px;" />
										<span class="menufont" style="margin-left: 20px;">{{ (!data.kondisi) ? submenu.menuText : submenu.label }}</span>
									</template>
								</v-list-item>
							</span>
						</v-list-group>
					</span>
				</v-list>
			</div>
		</v-navigation-drawer>
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
	</nav>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import PopUpNotifikasi from "@/views/Layout/PopUpNotifikasi.vue";
import io from 'socket.io-client'
export default {
	components: {
    PopUpNotifikasi
  },
	props: {
    namaWebsite: {
      type: String,
      default: null
    },
    singkatanWebsite: {
      type: String,
      default: null
    },
    logoWebsite: {
      type: String,
      default: null
    },
    totalNotif: {
      type: Number,
      default: 0,
    },
  },
	data: () => ({
		API_URL: process.env.VUE_APP_BASE_URL_VIEW,
		drawer: true,
		fotoProfil: '',
		roleID: '',
		nama: '',
		menuOptions: [],

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
	}),
	computed: {
		...mapState({
			mengajar: store => store.setting.mengajarOptions,
			jabatan: store => store.setting.jabatanOptions,
		}),
		...mapGetters({
      cmssettings: 'setting/cmssettings',
    }),
		optionMenu(){
			if(this.roleID === '3'){
				// let jabatan_guru = localStorage.getItem('jabatan_guru').split(', ')
				// let result = []
				// jabatan_guru.map(str => {
				// 	let hasil = this.jabatan.filter(val => { return val.kode == str })
				// 	result.push(hasil.length ? hasil[0].label : '')
				// })
        // if(result.includes('WaKaBid. Kurikulum')){
				// 	return this.menuOptions.filter(el => { return this.wali_kelas === '' ? el.menuText != "Wali Kelas" && el.menuText != "Guru" && el.menuText != "Siswa Siswi" : el.menuText != "Guru" && el.menuText != "Siswa Siswi"; })
        // }else if(result.includes('WaKaBid. Kesiswaan')){
        //   return this.menuOptions.filter(el => { return this.wali_kelas === '' ? el.menuText != "Wali Kelas" && el.menuText != "Guru" && el.menuText != "Jadwal Mengajar" : el.menuText != "Guru" && el.menuText != "Jadwal Mengajar"; })
				// }else if(result.includes('Kepala Sekolah')){
        //   return this.menuOptions.filter(el => { return this.wali_kelas === '' ? el.menuText != "Wali Kelas" : el; })
        // }else{
        //   return this.menuOptions.filter(el => { return this.wali_kelas === '' ? el.menuText != "Wali Kelas" && el.menuText != "Guru" && el.menuText != "Siswa Siswi" && el.menuText != "Jadwal Mengajar" : el.menuText != "Guru" && el.menuText != "Siswa Siswi" && el.menuText != "Jadwal Mengajar"; })
				// }
				return this.menuOptions
			}else{
				return this.menuOptions
			}
		},
  },
	watch: {
		
	},
	mounted() {
		if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
		this.fotoProfil = localStorage.getItem('fotoProfil')
		this.nama = localStorage.getItem('nama')
		this.roleID = localStorage.getItem('roleID')
		this.Navbar()
		this.getCMSSettings()
		let path = this.$route.path.substring(1).split('/');
		if(path[0] === 'dashboard' || path[0] === 'settings' || path[0] === 'profile' || path[0] === 'notifikasi' || path[0] === 'data-all-order' || 
			path[0] === 'data-order-smr-byproduct' || path[0] === 'data-product-variant' || path[0] === 'data-reg-in-apps' || path[0] === 'data-member' ||
			path[0] === 'data-non-member' || path[0] === 'data-survei-dnm' || path[0] === 'data-order-byproduct' || path[0] === 'data-warehouse-stockist' ||
			path[0] === 'data-sales-area' || path[0] === 'data-transaksi-detail' || path[0] === 'data-transaksi-summary'
		){
			this.drawer = false;
			return this.drawer;
		}
	},
	methods: {
		...mapActions({
      getCMSSettings: 'setting/getCMSSettings',
			getMenu: "setting/getMenu",
		}),
		Navbar(){
			this.getMenu()
			.then((res) => {
				let data = res.data.result;
				this.menuOptions = data.length ? data[0].menu : null
			})
			.catch((err) => {
				if(err.response.data.status === 401) {
					return this.notifikasi("error", err.response.data.message, "2")
				}
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
		keluar() {
			this.notifikasi("question", "Apakah anda yakin ingin keluar ?", "2")
		},
		goToProses(){
			localStorage.clear();
			this.$router.push({name: "LogIn"});
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
.v-list-item__append > .v-badge .v-icon, .v-list-item__append > .v-icon {
	margin-inline-start: 5px !important;
}
.theme--light.v-list {
	width: 200px !important;
}
.navigasi {
	display: flex;
}
left-tampilan-right {
	display: none;
}
.listData {
	width: 200px !important;
}
.v-list-item--density-default.v-list-item--one-line {
	min-height: 35px !important;
}
.theme--dark.v-icon {
	color: #FFFFFF !important;
}
.v-list-item {
	padding: 0px 6px !important;
}
.theme--dark.v-list {
	background-color: #28a154 !important;
}
.v-btn.v-btn--density-default {
	height: calc(var(--v-btn-height) + 0px);
}
.nav-header {
	position: fixed !important;
	padding: 0px 10px;
	width: 100%;
	background: #28a154;
	z-index: 1;
	border-bottom: 3px solid #000;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.nav-logo{
	width: 450px;
	max-width: fit-content;
}
.nav-proses{
	width: 24%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	color: #FFF;
}
.navigation-drawer {
	position: fixed !important;
}
.customScroll {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.customScroll::-webkit-scrollbar {
  width: 16px;
}
.customScroll::-webkit-scrollbar-thumb {
  background-color: rgba(10, 204, 117, 0.694);
  border: 5px solid #28a154;
  border-radius: 10rem;
}
.customScroll::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}
@media screen and (max-width: 960px) {
	.navbar {
		display: none;
	}
	.menu-tampilan-left {
		display: block;
		text-align: left;
	}
}
</style>

<style>
/* .v-toolbar__content > .v-toolbar-title {
	margin-inline-start: 16px;
	max-width: 250px !important;
} */
.menufont {
	font-size: 9pt !important;
	color: #FFFFFF;
}

.SelectedMenu{
	background-color: #272727;
	color: white;
	cursor: pointer;
	border-radius: 5px;
	white-space: nowrap;
	margin: 2px 0;
}
.SelectedMenu:hover {
	background-color: #545d69;
}
.SelectedMenu-active {
	background-color: #28a154;
}
.SelectedSubMenu{
	background-color: #272727;
	color: white;
	cursor: pointer;
	border-radius: 5px;
	white-space: nowrap;
	margin: 2px 0;
}
.SelectedSubMenu:hover {
	background-color: #545d69;
}
.SelectedSubMenu-active {
	background-color: #28a154;
}

.badgeNotif {
	margin-right: 15px;
}
.UserPanel {
	cursor: pointer;
}
.scrollNotif{
  max-height: 500px !important;
  overflow-y: auto !important;
}
.box{
	width: 75px;
	height: 20px;
  /* background-image:-moz-linear-gradient(top, #28a154, #5a5757); */
	/* background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#28a154), to(#5a5757), color-stop(1,#5a5757)); */
	margin: 4px;
  color: #FFF;
}
.boxnotif{
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	-khtml-border-radius: 5px; 
	border-radius: 5px;
	padding: 0px 5px;
	text-align: center;
	font-size: 8pt;
	font-weight: bold;
	background-color: rgba(10, 204, 117, 0.694);
	border: 1px solid #FFFFFF;
	color: #FFFFFF;
}
</style>