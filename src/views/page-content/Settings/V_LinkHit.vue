<template>
  <div>
		<h2 class="subheading grey--text text-decoration-underline">Panel Link Hit</h2>
    <Button 
      color-button="#0bd369"
      icon-prepend-button="mdi mdi-link-box"
      nama-button="Hit Unhide Product Package"
      size-button="x-small"
      @proses="unhideProductPackage()"
    />

    <v-overlay v-model="isLoadingProses" persistent class="align-center justify-center">
      <div style="width: 550px;">
        <v-progress-linear
          class="pa-3"
          indeterminate
          color="#28a154"
        />
        <h4 style="color: #FFF; text-align: center; background-color: #272727;">Sedang proses pengambilan data keserver, harap menunggu ...</h4>
      </div>
    </v-overlay>
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
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'Link Hit',
	components: { PopUpNotifikasi },
  data: () => ({
    isLoadingProses: false,

		//notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Settings (Link Hit)",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
    ...mapState({
      loadingtable: 'setting/loadingtable',
    }),
    ...mapGetters({
		}),
  },
	watch: {
  },
	mounted() {
	},
	methods: {
		...mapActions({
      hitUnhideProductPackage: 'user/hitUnhideProductPackage',
    }),
    unhideProductPackage() {
      this.isLoadingProses = true
      this.hitUnhideProductPackage()
			.then((res) => {
        setTimeout(() => {
          this.isLoadingProses = false
          this.notifikasi("success", res.data.message, "1")
        }, 5000);
			})
			.catch((err) => {
        this.isLoadingProses = false
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

</style>