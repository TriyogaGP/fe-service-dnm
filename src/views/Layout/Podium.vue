<template>
  <div>
		<div :style="stylePodium">
      <div v-for="(data, i) in records" :key="i">
        <PodiumStep :podium="records" :winner="data" :kategori="kategori" :color="color" />
			</div>
    </div>
	</div>
</template>

<script>
import PodiumStep from "./PodiumStep.vue";
export default {
  name: "Podium",
  components: { PodiumStep },
	props: {
		records: {
      type: Array,
      default: () => []
		},
		kategori: {
      type: String,
      default: ''
    },
	},
	data: () => ({
	}),
	computed: {
    igCardStyle() {
      return {
				height: `${350 * ((this.offset + 5) / this.records.length)}px`,
        opacity: `${0.1 + this.offset / this.records.length}`,
      };
    },
		stylePodium() {
			return {
				display: 'grid',
				gridAutoFlow: 'column dense',
				gap: '.4rem',
				marginTop: '.2rem',
				justifyContent: 'center',
				justifyItems: 'center',
				alignContent: 'flex-end',
				alignItems: 'flex-end',
				borderBottom: '1px solid #e5e7eb',
				height: 250,
			};	
		},
		color() {
			const randomColor = require('randomcolor');
			return randomColor();
		},
  },
	mounted(){
	},
}
</script>