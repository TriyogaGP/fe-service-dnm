<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Formulir Administrator</h2>
    <div class="text-right wadah">
      <span class="link" @click="gotolist()">Data Administrator</span>
      <v-icon size="small" class="iconstyle" icon="mdi mdi-menu-right" />
      <span>Formulir Administrator</span>
    </div>
    <v-stepper v-model="stepperVal">
      <v-stepper-header>
        <v-stepper-item
          :complete="stepperVal > 1"
          title="Data Log in"
          :value="1"
        ></v-stepper-item>

        <v-divider :thickness="1" class="border-opacity-100" color="black" />

        <v-stepper-item
          title="Preview Formulir"
          :value="2"
        ></v-stepper-item>
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item :value="1">
          <C_DataLogin 
            :stepper-val="stepperVal"
            :data-step-one="tampungStepOne"
            @StepOne="nextStep(1)"
            @BackToList="gotolist()"
          />
        </v-stepper-window-item>

        <v-stepper-window-item :value="2">
          <v-lazy v-model="lazyStep2">
            <C_PreviewFormulir 
              :stepper-val="stepperVal"
              @backStep="stepperVal = $event"
            />
          </v-lazy>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { useMeta } from 'vue-meta'
import C_DataLogin from "./content/C_DataLogin.vue";
import C_PreviewFormulir from "./content/C_PreviewFormulir.vue";
export default {
  name: 'FormulirAdministrator',
  components: {
    C_DataLogin,
    C_PreviewFormulir
  },
  data: () => ({
    stepperVal: 1,
    steps: 2,
    lazyStep2: false,
    tampungStepOne: {
      id_user: '',
      level: null,
      wilayah: null,
      nama_lengkap: '',
      username: '',
      password: '',
    },
  }),
  setup() {
    useMeta({
      title: "Formulir Administrator",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })
  },
  computed: {
		...mapGetters({
      administratorBy: 'user/administratorBy',
    }),
	},
  watch: {
    stepperVal(n, o) {
      if (n !== o) {
        window.scrollTo(0, 0);
      }

      if (n != o && n == 2) {
        this.lazyStep2 = true;
      } else {
        this.lazyStep2 = false;
      }
    },
    administratorBy: {
      deep: true,
      handler(value) {
        console.log(value);
        if(this.stepperVal === 1){
          this.tampungStepOne = {
            id_user: value.idAdmin ? value.idAdmin : '',
            level: value.consumerType ? value.consumerType : null,
            wilayah: value.kodeWilayah ? value.kodeWilayah : null,
            nama_lengkap: value.nama ? value.nama : '',
            username: value.username ? value.username : '',
            password: value.kataSandi ? value.kataSandi : '',
          }
        }
      },
    }
  },
  mounted() {
    localStorage.removeItem('stepOne')
    // let uid = this.$route.params.uid;
    if(this.$route.params.kondisi === 'EDIT') return this.getAdministratorbyUID(this.$route.params.uid)
  },
	methods: {
		...mapActions({
      getAdministratorbyUID: 'user/getAdministratorbyUID',
    }),
    gotolist() {
      localStorage.removeItem('stepOne')
      this.$router.push({name: "DataAdministrator"});
    },
    nextStep(step) {
      this.stepperVal = step + 1;
      if(this.$route.params.kondisi === 'EDIT') return this.getAdministratorbyUID(this.$route.params.uid)
    },
    backStep(step) {
      this.stepperVal = step - 1;
      if(this.$route.params.kondisi === 'EDIT') return this.getAdministratorbyUID(this.$route.params.uid)
    },
	}
}
</script>