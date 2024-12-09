<template>
	<div>
		<Doughnut :chart-options="optionChart" :chart-data="chartData" :style="myStyles" />
	</div>
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import {
  Chart as Donut,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'
Donut.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
	name: "ChartDonut",
  components: { Doughnut },
	props: {
		dataChart: {
			type: Object,
			default: () => {}
    },
		optionChart: {
			type: Object,
			default: () => {}
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