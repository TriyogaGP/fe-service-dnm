<template>
	<v-footer dark padless app inset class="text-center d-flex flex-column" style="position: fixed;">
		<span class="textNamaWebFooter">{{ `©2022-${new Date().getFullYear()} | ${namaWebsite} (${singkatanWebsite})` }}</span>
	</v-footer>
</template>
<script>
export default {
	props: {
    namaWebsite: {
      type: String,
      default: null
    },
    singkatanWebsite: {
      type: String,
      default: null
    },
  },
	data: () => ({
	}),
}
</script>
<style>
.textNamaWebFooter {
	color: #FFF;
	font-weight: bold;
	font-size: 12pt;
  align-items: center;
  display: flex;
  line-height: normal;
  height: 35px;
}
</style>