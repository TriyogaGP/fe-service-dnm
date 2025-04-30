import { createRouter, createWebHashHistory } from "vue-router";
import Login from "@/views/Login.vue";
import ForgotPass from "@/views/ForgotPass.vue";

const routes = [
  {
    path: "/",
    name: "LogIn",
    component: Login,
  },
  {
    path: "/forgot-pass",
    name: "ForgotPass",
    component: ForgotPass,
  },
  {
    path: '/',
    component: () => import("@/views/Layout/index.vue"),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      // {
      //   path: '/dashboard-wilayah/:kategori',
      //   name: 'DashboardWilayah',
      //   component: () => import('@/views/DashboardWilayah.vue')
      // },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue')
      },
      {
        path: '/settings',
        name: 'Pengaturan',
        component: () => import('@/views/Settings.vue')
      },
      // {
      //   path: '/notifikasi',
      //   name: 'Notifikasi',
      //   component: () => import('@/views/Notifikasi.vue')
      // },
      // {
      //   path: '/broadcast',
      //   name: 'Broadcast',
      //   component: () => import('@/views/Broadcast.vue')
      // },
      // {
      //   path: '/percakapan',
      //   name: 'Percakapan',
      //   component: () => import('@/views/Percakapan.vue')
      // },
      // {
      //   path: '/testing',
      //   name: 'Testing',
      //   component: () => import('@/views/Testing.vue')
      // },

      {
        path: '/data-administrator',
        name: 'DataAdministrator',
        component: () => import('@/views/page-content/Administrator/V_Administrator.vue')
      },
      {
        path: '/formulir-administrator/:kondisi/:uid',
        name: 'FormulirAdministrator',
        props: true,
        component: () => import('@/views/page-content/Administrator/P_FormAdministrator.vue')
      },
      {
        path: '/data-all-order',
        name: 'DataOrder',
        component: () => import('@/views/page-content/DNM/V_Order.vue')
      },
      {
        path: '/data-order-smr-byproduct',
        name: 'DataOrderSummarybyProduct',
        component: () => import('@/views/page-content/DNM/V_OrderSummarybyProduct.vue')
      },
      {
        path: '/data-order-byproduct',
        name: 'DataOrderbyProduct',
        component: () => import('@/views/page-content/DNM/V_OrderbyProduct.vue')
      },
      {
        path: '/data-product-variant',
        name: 'DataProductVariant',
        component: () => import('@/views/page-content/DNM/V_ProductVariant.vue')
      },
      {
        path: '/data-member',
        name: 'DataMember',
        component: () => import('@/views/page-content/DNM/V_ConsumerMember.vue')
      },
      {
        path: '/data-non-member',
        name: 'DataNonMember',
        component: () => import('@/views/page-content/DNM/V_ConsumerNonMember.vue')
      },
      {
        path: '/data-reg-in-apps',
        name: 'DataRegisterInApps',
        component: () => import('@/views/page-content/DNM/V_RegisterInApps.vue')
      },
      {
        path: '/data-survei-dnm',
        name: 'DataSurveiDNM',
        component: () => import('@/views/page-content/DNM/V_SurveiDNM.vue')
      },
      {
        path: '/data-warehouse-stockist',
        name: 'DataWarehouseStockist',
        component: () => import('@/views/page-content/DNM/V_WarehouseStockist.vue')
      },

      {
        path: '/data-sales-area',
        name: 'DataSalesArea',
        component: () => import('@/views/page-content/KNET/V_SalesArea.vue')
      },
      {
        path: '/data-transaksi-detail',
        name: 'DataTransaksiDetail',
        component: () => import('@/views/page-content/KNET/V_TransaksiDetail.vue')
      },
      {
        path: '/data-transaksi-summary',
        name: 'DataTransaksiSummary',
        component: () => import('@/views/page-content/KNET/V_TransaksiSummary.vue')
      },
      
      {
        path: '/:pathMatch(.*)*',
        name: 'UnderConstruction',
        component: () => import('@/views/Layout/UnderConstruction.vue')
      },
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
