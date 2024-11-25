<template>
  <v-app>
    <metainfo>
      <template v-slot:title="{ content }">{{ content ? `${content} | ${site_name}` : site_name }}</template>
    </metainfo>
    <routerView />
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    site_name: 'Digital Network Marketing (DNM)',
  }),
  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 3000)
    },
  },
  beforeMount(){
    this.overlay = true
  },
}
</script>
<style></style>
