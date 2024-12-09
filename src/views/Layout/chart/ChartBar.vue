<template>
	<div>
		<Bar id="my-chart-id" :chart-data="chartData" :chart-options="chartOptions" :style="myStyles" />
		<!-- {{ chartData }} -->
	</div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
	name: "ChartBar",
  components: { Bar },
	props: {
		dataChart: {
			type: Object,
			default: () => {}
    },
		optionChart: {
			type: Object,
			default: () => {}
		},
		plugins: {
      type: Array,
      default: () => []
    },
  },
	data: () => ({
	}),
	computed: {
		chartData() {
			return this.dataChart;
		},
		chartOptions() {
			return this.optionChart;
		},
		myStyles() {
			return {
        height: `300px`,
        position: 'relative'
      }
		}
	},
}
</script>

<style>

</style>