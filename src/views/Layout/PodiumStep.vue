<template>
  <div>
    <div style="display: flex; flex-direction: column; place-content: center">
      <div style="text-align: center; margin-bottom: .25rem;">
        <v-tooltip top>
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" size="x-large" icon="mdi mdi-information" color="#28a154" />
          </template>
          <div>
            {{ winner.name }}
          </div>
        </v-tooltip><br>
        <strong style="font-size: 13px;">total : {{ total }}</strong>
      </div>
      <div :style="styleMotionOne">
        <span style="color: black; align-self: flex-end; margin-bottom: 10px; font-weight: bold; font-size: 13px; text-align: center;">
          Peringkat<br>
          {{ winner.position + 1 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PodiumStep",
	props: {
		podium: {
      type: Array,
      default: () => []
    },
		winner: {
      type: Object,
      default: () => {}
    },
    kategori: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
  },
  data: () => ({
		offset: '',
		total: '',
	}),
  computed: {
    styleMotionOne() {
      return {
        width: '5.5rem',
        height: `${150 * ((this.offset + 5) / this.podium.length)}px`,
        placeContent: 'center',
        display: 'flex',
        borderTopLeftRadius: '.5rem',
        borderTopRightRadius: '.5rem',
        borderColor: `${this.color}`,
        backgroundColor: `${this.color}`,
        marginBottom: -1,
        filter: `opacity(${0.15 + this.offset / this.podium.length})`
      };
    },
  },
	mounted(){
		this.offset = this.podium.length - this.winner.position
    if(this.kategori == 'product'){
      this.total = this.winner.totalSold
    }else if(this.kategori == 'productBSLM'){
      this.total = this.winner.totalSoldLastMonth
    }else if(this.kategori == 'productBSL90D'){
      this.total = this.winner.totalSoldLast90Day
    }
	}
}
</script>

<style scoped>
.tampil {
  display: flex;
  background-color: #03a9f4;
  margin-bottom: 5px;
  padding: 5px;
  color: #000;
  font-size: 13px;
  font-weight: bold;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

i.v-icon.v-icon {
  color: #03a9f4;
} 
</style>