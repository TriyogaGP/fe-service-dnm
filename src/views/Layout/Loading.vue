<template>
  <div>
    <v-overlay v-model="loading" persistent class="align-center justify-center">
			<div class="kotakLoading">
				<span class="loader">
					<v-img class="gambarLogoScreen" :src="logoWebsite" />
					<h2 style="color: white;">&nbsp;{{ singkatanWebsite }}&nbsp;</h2>
				</span>
			</div>
    </v-overlay>
  </div>
</template>
  
<script>
export default {
	props: {
		overlay: {
			type: Boolean,
			default: true
		},
		logoWebsite: {
      type: String,
      default: null
    },
		namaWebsite: {
      type: String,
      default: null
    },
		singkatanWebsite: {
      type: String,
      default: null
    },
	},
	data() {
		return{
		}
	},
	computed: {
		loading() {
			return this.overlay;
		}
	},
}
</script>
<style>
.kotakLoading {
	width: 250px;
	border-radius: 20px;
	opacity: 0.75;
}
.gambarLogoScreen {
  margin: 5px;
  align-items: center;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  height: 250px;
}
</style>