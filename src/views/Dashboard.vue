<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Dashboard</h2>
    <Fieldset
      legend="Data Transaksi"
      :toggleable="true"
    >
      <h3 class="text-center"><u>TRANSACTION {{ tahunTrx }}</u></h3>
      <v-row no-gutters class="pa-2" style="background-color: #272727;">
        <v-col cols="12" md="3" class="d-flex align-center">
          <Autocomplete
            v-model="tahunTrx"
            :data-a="tahunOptions"
            label-a="Tahun"
          />
        </v-col>
        <v-col cols="12" md="2" class="d-flex align-center justify-start">
          <Button 
            color-button="#0bd369"
            icon-prepend-button="mdi mdi-send-check"
            nama-button="Check"
            size-button="small"
            @proses="ProsesDashboardTransaksi(tahunTrx)"
          />
          <Button 
            color-button="#0bd369"
            icon-prepend-button="mdi mdi-reload"
            nama-button="Reload"
            size-button="small"
            @proses="reloadDashboardTransaksi(tahunTrx)"
          />
        </v-col>
        <v-col cols="12" md="7" />
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-2">
          <h3 class="text-center font-weight-bold">Grafik DP (TRANSACTION)</h3>
          <ChartBar
            :data-chart="record"
            :option-chart="options"
          />
        </v-col>
        <v-col cols="12" md="6" class="pa-2">
          <h3 class="text-center font-weight-bold">Grafik BV (TRANSACTION)</h3>
          <ChartBar
            :data-chart="record2"
            :option-chart="options"
          />
        </v-col>
      </v-row>
    </Fieldset>
    <Fieldset
      legend="Data Transaksi Daily"
      :toggleable="true"
    >
      <h3 class="text-center"><u>TRANSACTION DAILY {{ `${bulanTrx} - ${tahunTrx}` }}</u></h3>
      <v-row no-gutters class="pa-2" style="background-color: #272727;">
        <v-col cols="12" md="1" class="pr-1 d-flex align-center">
          <Autocomplete
            v-model="tahunTrx"
            :data-a="tahunOptions"
            label-a="Tahun"
          />
        </v-col>
        <v-col cols="12" md="2" class="pr-1 d-flex align-center">
          <Autocomplete
            v-model="bulanTrx"
            :data-a="bulanOptions"
            label-a="Bulan"
          />
        </v-col>
        <v-col cols="12" md="1" class="d-flex align-center">
          <Autocomplete
            v-model="dataView"
            :data-a="dataViewOptions"
            label-a="Pilih Data"
          />
        </v-col>
        <v-col cols="12" md="1" class="d-flex align-center justify-start">
          <Button 
            color-button="#0bd369"
            icon-prepend-button="mdi mdi-send-check"
            nama-button="Check"
            size-button="small"
            @proses="ProsesDashboardTransaksiDaily(tahunTrx, bulanTrx, dataView)"
          />
          <Button 
            color-button="#0bd369"
            icon-prepend-button="mdi mdi-reload"
            nama-button="Reload"
            size-button="small"
            @proses="reloadDashboardTransaksiDaily(tahunTrx, bulanTrx)"
          />
        </v-col>
        <v-col cols="12" md="8" />
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="1"/>
        <v-col cols="12" md="10" class="pa-2">
          <h3 class="text-center font-weight-bold">Grafik (TRANSACTION DAILY)</h3>
          <ChartBar
          :data-chart="record3"
          :option-chart="options"
          />
        </v-col>
        <v-col cols="12" md="1"/>
      </v-row>
    </Fieldset>
    <Fieldset
      legend="Data Shipping & Courier"
      :toggleable="true"
    >
      <h3 class="text-center"><u>SHIPPING & COURIER</u></h3>
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-2">
          <h3 class="text-left font-weight-bold">Grafik % Shipping</h3>
          <ChartDonut
            :data-chart="record4"
            :option-chart="optionsDonut"
          />
        </v-col>
        <v-col cols="12" md="6" class="pa-2">
          <h3 class="text-right font-weight-bold">Grafik % Courier</h3>
          <ChartDonut
            :data-chart="record5"
            :option-chart="optionsDonut"
          />
        </v-col>
      </v-row>
    </Fieldset>
    <Fieldset
      legend="Data User Active"
      :toggleable="true"
    >
      <h3 class="text-center"><u>USER ACTIVE</u></h3>
      <v-row no-gutters class="pa-2 d-flex align-center" style="background-color: #272727;">
        <v-col cols="12" md="2" class="d-flex align-center">
          <Autocomplete
            v-model="bulanUser"
            :data-a="bulanOptions"
            label-a="Bulan"
          />
        </v-col>
        <v-col cols="12" md="1" class="d-flex align-center justify-start">
          <Button 
            color-button="#0bd369"
            icon-prepend-button="mdi mdi-send-check"
            nama-button="Check"
            size-button="small"
            @proses="() => {
              ProsesDashboardUserActive('Member', bulanUser)
              ProsesDashboardUserActive('Customer', bulanUser)
            }"
          />
        </v-col>
        <v-col cols="12" md="8" />
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-2">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="d-flex align-center justify-start">
              <h3 class="font-weight-bold">Grafik User Member</h3>
            </v-col>
            <v-col cols="12" md="6" class="d-flex align-center justify-end">
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-reload"
                nama-button="Reload"
                size-button="small"
                @proses="reloadDashboardUserActive('1', bulanUser)"
              />
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-information"
                nama-button="Detail User Member"
                size-button="small"
                @proses="bukaDetailUserDialog(pageDetailUser, limitDetailUser, 1)"
              />
            </v-col>
          </v-row>
          <div class="pt-3">
            <ChartDonut
              :data-chart="record6"
              :option-chart="optionsDonut"
            />
          </div>
        </v-col>
        <v-col cols="12" md="6" class="pa-2">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="d-flex align-center justify-start">
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-information"
                nama-button="Detail User Customer"
                size-button="small"
                @proses="bukaDetailUserDialog(pageDetailUser, limitDetailUser, 0)"
              />
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-reload"
                nama-button="Reload"
                size-button="small"
                @proses="reloadDashboardUserActive('0', bulanUser)"
              />
            </v-col>
            <v-col cols="12" md="6" class="d-flex align-center justify-end">
              <h3 class="font-weight-bold">Grafik User Customer</h3>
            </v-col>
          </v-row>
          <ChartDonut
            :data-chart="record7"
            :option-chart="optionsDonut"
          />
        </v-col>
      </v-row>
    </Fieldset>
    <Fieldset
      legend="Data Top 10 Product"
      :toggleable="true"
    >
      <h3 class="text-center"><u>Top 10 Products {{ new Date().getFullYear() }}</u></h3>
      <v-row no-gutters class="pa-2" style="background-color: #272727;">
        <v-col cols="12" md="3" class="d-flex align-center">
          <Autocomplete
            v-model="podium"
            :data-a="podiumOptions"
            label-a="Pilihan Podium"
            @ubah="HitPodium($event)"
          />
        </v-col>
        <v-col cols="12" md="9" class="d-flex align-center justify-start">
          <Button 
            color-button="#0bd369"
            icon-prepend-button="mdi mdi-information"
            nama-button="Detail Product"
            size-button="small"
            :disabled="kondisiProduct"
            @proses="bukaDetailProductDialog(pageDetailProduct, limitDetailProduct, searchDataProduct)"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" md="12" class="pa-2">
          <h3 class="text-center font-weight-bold">{{ judul }}</h3>
          <Podium
            :records="recordProduct"
            :kategori="kategori"
          />
        </v-col>
      </v-row>
    </Fieldset>
    <v-dialog
      v-model="detailUser"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Detail User</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => {
                detailUser = false;
                DataDetailUser = [];
                pageDetailUser = 1;
                limitDetailUser = 20;
              }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialogsecond--custom">
          <v-data-table
            loading-text="Sedang memuat... Harap tunggu"
            no-data-text="Tidak ada data yang tersedia"
            no-results-text="Tidak ada catatan yang cocok ditemukan"
            :headers="headersDetailUser"
            :loading="loadingtable"
            :items="DataDetailUser"
            item-value="idUser"
            density="comfortable"
            hide-default-footer
            hide-default-header
            class="elavation-3 rounded"
            :items-per-page="itemsPerPageDetailUser"
            @page-count="pageCountDetailUser = $event"
          >
            <!-- header -->
            <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
              <tr>
                <td v-for="header in columns" :key="header.title" class="tableHeader">
                  <span v-if="header.sortable" class="mr-2" style="cursor: pointer; width: 100%;" @click="() => toggleSort(header)">{{ header.title.toUpperCase() }}</span>
                  <span v-else>{{ header.title.toUpperCase() }}</span>
                  <v-icon v-if="isSorted(header)" :icon="getSortIcon(header)"></v-icon>
                </td>
              </tr>
            </template>
            <template #loader>
              <LoaderDataTables />
            </template>
            <template #[`item.number`]="{ item }">
              {{ pageDetailUser > 1 ? ((pageDetailUser - 1)*limitDetailUser) + item.index + 1 : item.index + 1 }}
            </template>
            <template #[`item.order`]="{ item }">
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-information"
                nama-button="Lihat Order"
                size-button="x-small"
                @proses="bukaDetailOrderDialog(item.raw.idUser)"
              />
            </template>
            <template #top />
            <template #bottom />
          </v-data-table>
        </v-card-text>
        <v-divider :thickness="2" class="border-opacity-100" color="black" />
        <v-card-actions>
          <v-row no-gutters>
            <v-col cols="12" lg="9" class="pa-2 d-flex justify-start align-center">
              <!-- <span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span> -->
              <span>Halaman&nbsp;</span>
              <div style="width: 100px;">
                <Autocomplete
                  v-model="pageDetailUser"
                  :data-a="pageOptionsDetailUser"
                  label-a="Page"
                  :disabled-a="DataDetailUser.length ? false : true"
                />
              </div>
              <span>&nbsp;dari Total Halaman <strong>{{ pageSummaryDetailUser.totalPages ? pageSummaryDetailUser.totalPages : 0 }}</strong> (Records {{ pageSummaryDetailUser.total ? pageSummaryDetailUser.total : 0 }})</span>
            </v-col>
            <v-col cols="12" lg="3" class="pa-2 text-right">
              <div class="d-flex justify-start align-center">
                <Autocomplete
                  v-model="limitDetailUser"
                  pilihan-a="select"
                  :data-a="limitPageDetailUser"
                  label-a="Limit"
                  :disabled-a="DataDetailUser.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#28a154"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataDetailUser.length ? pageSummaryDetailUser.page != 1 ? false : true : true"
                  @proses="() => { pageDetailUser = pageSummaryDetailUser.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#28a154"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataDetailUser.length ? pageSummaryDetailUser.page != pageSummaryDetailUser.totalPages ? false : true : true"
                  @proses="() => { pageDetailUser = pageSummaryDetailUser.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="detailProduct"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Detail Product</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => {
                detailProduct = false;
                searchDataProduct = '';
                DataDetailProduct = [];
                pageDetailProduct = 1;
                limitDetailProduct = 20;
              }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialogsecond--custom">
          <v-data-table
            loading-text="Sedang memuat... Harap tunggu"
            no-data-text="Tidak ada data yang tersedia"
            no-results-text="Tidak ada catatan yang cocok ditemukan"
            :headers="headersDetailProduct"
            :loading="loadingtable"
            :items="DataDetailProduct"
            item-value="idProduct"
            density="comfortable"
            hide-default-footer
            hide-default-header
            class="elavation-3 rounded"
            :items-per-page="itemsPerPageDetailProduct"
            @page-count="pageCountDetailProduct = $event"
          >
            <!-- header -->
            <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
              <tr>
                <td v-for="header in columns" :key="header.title" class="tableHeader">
                  <span v-if="header.sortable" class="mr-2" style="cursor: pointer; width: 100%;" @click="() => toggleSort(header)">{{ header.title.toUpperCase() }}</span>
                  <span v-else>{{ header.title.toUpperCase() }}</span>
                  <v-icon v-if="isSorted(header)" :icon="getSortIcon(header)"></v-icon>
                </td>
              </tr>
            </template>
            <template #loader>
              <LoaderDataTables />
            </template>
            <template #[`item.number`]="{ item }">
              {{ pageDetailProduct > 1 ? ((pageDetailProduct - 1)*limitDetailProduct) + item.index + 1 : item.index + 1 }}
            </template>
            <template #[`item.gambar`]="{ item }">
              <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <v-img :src="item.raw.coverImage" v-bind="props" width="80" />
              </template>
              <v-img :src="item.raw.coverImage" width="250" /><br>
              {{ item.raw.name }}
            </v-tooltip>
            </template>
            <template #[`item.isPackage`]="{ item }">
              <v-icon size="small" v-if="item.raw.isPackage == true" color="green" icon="mdi mdi-check" />
              <v-icon size="small" v-else-if="item.raw.isPackage == false" color="red" icon="mdi mdi-close" />
            </template>
            <template #[`item.isPublished`]="{ item }">
              <v-icon size="small" v-if="item.raw.isPublished == true" color="green" icon="mdi mdi-check" />
              <v-icon size="small" v-else-if="item.raw.isPublished == false" color="red" icon="mdi mdi-close" />
            </template>
            <template #[`item.isHidden`]="{ item }">
              <v-icon size="small" v-if="item.raw.isHidden == true" color="green" icon="mdi mdi-check" />
              <v-icon size="small" v-else-if="item.raw.isHidden == false" color="red" icon="mdi mdi-close" />
            </template>
            <template #[`item.penjualan`]="{ item }">
              Total Sold: {{ item.raw.totalSold }}<br>
              Total Sold Last Month: {{ item.raw.totalSoldLastMonth }}<br>
              Total Sold Last90Day: {{ item.raw.totalSoldLast90Day }}
            </template>
            <template #top>
              <v-row no-gutters class="pa-2">
                <v-col cols="12" md="7" />
                <v-col cols="12" md="5" class="d-flex align-center">
                  <TextField
                    v-model="searchDataProduct"
                    icon-prepend-tf="mdi mdi-magnify"
                    label-tf="Pencarian..."
                    :clearable-tf="true"
                    @click:clear="() => {
                      DataDetailProduct = []
                      pageDetailProduct = 1
                      if(detailProduct) prosesDetailProduct(pageDetailProduct, limitDetailProduct)
                    }"
                    @keyup.enter="() => {
                      DataDetailProduct = []
                      pageDetailProduct = 1
                      if(detailProduct) prosesDetailProduct(pageDetailProduct, limitDetailProduct, searchDataProduct)
                    }"
                  />
                </v-col>
              </v-row>
              <v-divider :thickness="2" class="border-opacity-100" color="white" />
            </template>
            <template #bottom />
          </v-data-table>
        </v-card-text>
        <v-divider :thickness="2" class="border-opacity-100" color="black" />
        <v-card-actions>
          <v-row no-gutters>
            <v-col cols="12" lg="9" class="pa-2 d-flex justify-start align-center">
              <!-- <span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span> -->
              <span>Halaman&nbsp;</span>
              <div style="width: 100px;">
                <Autocomplete
                  v-model="pageDetailProduct"
                  :data-a="pageOptionsDetailProduct"
                  label-a="Page"
                  :disabled-a="DataDetailProduct.length ? false : true"
                />
              </div>
              <span>&nbsp;dari Total Halaman <strong>{{ pageSummaryDetailProduct.totalPages ? pageSummaryDetailProduct.totalPages : 0 }}</strong> (Records {{ pageSummaryDetailProduct.total ? pageSummaryDetailProduct.total : 0 }})</span>
            </v-col>
            <v-col cols="12" lg="3" class="pa-2 text-right">
              <div class="d-flex justify-start align-center">
                <Autocomplete
                  v-model="limitDetailProduct"
                  pilihan-a="select"
                  :data-a="limitPageDetailProduct"
                  label-a="Limit"
                  :disabled-a="DataDetailProduct.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#28a154"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataDetailProduct.length ? pageSummaryDetailProduct.page != 1 ? false : true : true"
                  @proses="() => { pageDetailProduct = pageSummaryDetailProduct.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#28a154"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataDetailProduct.length ? pageSummaryDetailProduct.page != pageSummaryDetailProduct.totalPages ? false : true : true"
                  @proses="() => { pageDetailProduct = pageSummaryDetailProduct.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-bottom-sheet
      v-model="detailOrderUser"
			scrollable
      persistent
    >
      <v-sheet color="surface" style="font-size: 14px;">
        <v-row no-gutters>
          <v-col cols="12" lg="6" class="d-flex justify-start align-center">
            <h3 class="text-center">Detail Order User</h3>
          </v-col>
          <v-col cols="12" lg="6" class="d-flex justify-end align-center">
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { detailOrderUser = false;}"
            />
          </v-col>
        </v-row>
        <v-card color="background-dialog-card" class="ma-4 pa-2">
					<div class="customScroll">
						<table border="1" cellspacing="0" cellpadding="0" width="100%" style="background-color: #28a154; border: #FFF;">
              <tr class="table-header">
                <td>Order Number</td>
                <td>Tanggal Proses</td>
                <td>Shipping Type</td>
                <td>Product Detail</td>
              </tr>
              <template v-if="DataDetailOrderUser.length">
                <tr style="font-size: 9pt; font-weight: bold; color: white; padding: 10px" v-for="(data, index) in DataDetailOrderUser" :key="index">
                  <td style="text-align: center;">{{ data.orderNumber }}</td>
                  <td style="text-align: center;">{{ convertDateTime(data.createdAt) }}</td>
                  <td style="text-align: center;">{{ data.shippingType }}</td>
                  <td style="padding-left: 10px;">
                    <div v-for="(data2, i) in data.OrderDetails" :key="i">
                      {{ `${data2.productName} (${data2.quantity})` }}<br>
                    </div>
                  </td>
                </tr>
              </template>
            </table>
					</div>
				</v-card>
      </v-sheet>
    </v-bottom-sheet>
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
import qs from 'qs'
import ChartBar from "./Layout/chart/ChartBar.vue";
import ChartDonut from "./Layout/chart/ChartDonut.vue";
import Podium from "./Layout/Podium.vue";
import PopUpNotifikasi from "./Layout/PopUpNotifikasi.vue";

export default {
  name: 'Dashboard',
  components: { ChartBar, ChartDonut, Podium, PopUpNotifikasi },
  data: () => ({
    roleID: '',
    searchDataProduct: '',
    tahunTrx: '',
    bulanTrx: '',
    bulanUser: '',
    recordProduct: [],
    DataProduct: [],
    DataDetailProduct: [],
    DataDetailOrderUser: [],
    DataDetailUser: [],
    url: '',
    judul: '',
    kategori: '',
    podium: '',
    dataView: 'DP',
    detailProduct: false,
    detailUser: false,
    detailOrderUser: false,
    isLoadingProses: false,
    record: {
      labels: [],
      datasets: []
    },
    record2: {
      labels: [],
      datasets: []
    },
    record3: {
      labels: [],
      datasets: []
    },
    record4: {
      labels: [],
      datasets: []
    },
    record5: {
      labels: [],
      datasets: []
    },
    record6: {
      labels: [],
      datasets: []
    },
    record7: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: 'top'
        },
        tooltip: {
          usePointStyle: true,
          callbacks: {
            labelPointStyle: function(context) {
              return {
                pointStyle: 'circle',
                rotation: 0
              };
            },
          },
          enabled: true,
        },
      }
    },
    optionsDonut: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'left',
          labels: {
            boxWidth: 10,
            boxHeight: 8,
            font: {
              family: "Times New Roman",
              size: 12,
              style: "initial",
            }
          }
        },
      }
    },
    bulanOptions: [
      { title: 'Januari' }, 
      { title: 'Februari' }, 
      { title: 'Maret' }, 
      { title: 'April' }, 
      { title: 'Mei' }, 
      { title: 'Juni' }, 
      { title: 'Juli' }, 
      { title: 'Agustus' }, 
      { title: 'September' }, 
      { title: 'Oktober' }, 
      { title: 'November' }, 
      { title: 'Desember' }
    ],
    dataViewOptions: [
      { title: 'Record' }, 
      { title: 'DP' }, 
      { title: 'BV' }
    ],
    podiumOptions: [
      { title: '10 Best Seller Product Basic' }, 
      { title: '10 Best Seller Product Package' }, 
      { title: '10 Best Seller Product Last Month' }, 
      { title: '10 Best Seller Product Last 90 Days' }, 
      { title: '10 New Release Product' }, 
    ],

    headersDetailUser: [],
    kondisiUser: 1,
    pageDetailUser: 1,
    pageCountDetailUser: 0,
    itemsPerPageDetailUser: 100,
    limitDetailUser: 20,
		limitPageDetailUser: [5,10,20,50,100],
    pageOptionsDetailUser: [],
		pageSummaryDetailUser: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},

    headersDetailProduct: [
      { title: "No.", key: "number", sortable: false, width: "7%" },
      { title: "ID Product", key: "idProduct", sortable: false },
      { title: "Gambar", key: "gambar", sortable: false, },
      { title: "isPackage", key: "isPackage", sortable: false, align: 'center' },
      { title: "isHidden", key: "isHidden", sortable: false, align: 'center' },
      { title: "isPublished", key: "isPublished", sortable: false, align: 'center' },
      { title: "Penjualan", key: "penjualan", sortable: false },
      { title: "status", key: "status", sortable: false, align: 'center' },
    ],
    kondisiProduct: false,
    pageDetailProduct: 1,
    pageCountDetailProduct: 0,
    itemsPerPageDetailProduct: 100,
    limitDetailProduct: 20,
		limitPageDetailProduct: [5,10,20,50,100],
    pageOptionsDetailProduct: [],
		pageSummaryDetailProduct: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
    
    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Dashboard",
      htmlAttrs: {
        lang: "id",
        amp: true,
      }
    })

  },
  computed: {
    ...mapState({
      loadingtable: state => state.user.loadingtable,
    }),
    tahunOptions(){
      const chooseTahun = []
      const d = new Date();
      for (let tahun = 2021; tahun <= d.getFullYear(); tahun++) {
        chooseTahun.push({title: tahun.toString()})
      }
      return chooseTahun
    },
  },
  watch: {
    pageDetailUser: {
			deep: true,
			handler(value) {
        this.DataDetailUser = []
        if(this.detailUser) this.prosesDetailUser(value, this.limitDetailUser)
			}
		},
    limitDetailUser: {
			deep: true,
			handler(value) {
        this.DataDetailUser = []
        this.pageDetailUser = 1
				if(this.detailUser) this.prosesDetailUser(this.pageDetailUser, value)
			}
		},
    pageDetailProduct: {
			deep: true,
			handler(value) {
        this.DataDetailProduct = []
        if(this.detailProduct) this.prosesDetailProduct(value, this.limitDetailProduct, this.searchDataProduct)
			}
		},
    limitDetailProduct: {
			deep: true,
			handler(value) {
        this.DataDetailProduct = []
        this.pageDetailProduct = 1
				if(this.detailProduct) this.prosesDetailProduct(this.pageDetailProduct, value, this.searchDataProduct)
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
    this.roleID = localStorage.getItem('roleID')
    const month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = new Date();
    this.bulanTrx = month[d.getMonth()];
    this.bulanUser = month[d.getMonth()];
    this.tahunTrx = d.getFullYear().toString()
    this.judul = '10 Best Seller Product Basic'
    this.podium = '10 Best Seller Product Basic'
    this.url = { kategori: 'ALL', is_package: 0 }
    this.kategori = 'product'
    this.ProsesDashboardTransaksi(this.tahunTrx)
    this.ProsesDashboardTransaksiDaily(this.tahunTrx, this.bulanTrx, this.dataView)
    this.ProsesDashboardShipping()
    this.ProsesDashboardCourier()
    this.ProsesDashboardUserActive('Member', this.bulanUser)
    this.ProsesDashboardUserActive('Customer', this.bulanUser)
    this.ProsesDashboardProduct(this.url)
  },  
	methods: {
    ...mapActions({
      getDashboardTransaksi: 'user/getDashboardTransaksi',
      getDashboardTransaksiDaily: 'user/getDashboardTransaksiDaily',
      getDashboardShipping: 'user/getDashboardShipping',
      getDashboardCourier: 'user/getDashboardCourier',
      getDashboardUserActive: 'user/getDashboardUserActive',
      getDashboardProduct: 'user/getDashboardProduct',
      getDashboardDetailUserActive: 'user/getDashboardDetailUserActive',
      getDashboardDetailOrderUserActive: 'user/getDashboardDetailOrderUserActive',
      getDashboardReloadTransaksi: 'user/getDashboardReloadTransaksi',
      getDashboardReloadTransaksiDaily: 'user/getDashboardReloadTransaksiDaily',
      getDashboardReloadUserActive: 'user/getDashboardReloadUserActive',
    }),
    ProsesDashboardTransaksi(tahun) {
      this.record = {
        labels: [],
        datasets: []
      }
      this.record2 = {
        labels: [],
        datasets: []
      }
      this.getDashboardTransaksi(qs.stringify({ tahun }, { encode: false }))
      .then((res) => {
        const listdata = res.data.result
        const randomColor = require('randomcolor');
        const dp = [], bv = []
        listdata.map(val => {
          this.record.labels.push(val.bulan)
          this.record2.labels.push(val.bulan)
          dp.push(Number(val.dp))
          bv.push(Number(val.bv))
        })
        this.record.datasets.push({
          label: "DP",
          backgroundColor: randomColor(),
          data: dp
        })
        this.record2.datasets.push({
          label: "BV",
          backgroundColor: randomColor(),
          data: bv
        })
      })
			.catch((err) => {
				this.notifikasi("error", err.response.message, "1")
			});
    },
    ProsesDashboardTransaksiDaily(tahun, bulan, pilihan) {
      this.record3 = {
        labels: [],
        datasets: []
      }
      this.getDashboardTransaksiDaily(qs.stringify({ tahun, bulan }, { encode: false }))
      .then((res) => {
        const listdata = res.data.result.dataJson
        const randomColor = require('randomcolor');
        const record = [], dp = [], bv = []
        listdata.map(val => {
          this.record3.labels.push(val.tanggal)
          record.push(Number(val.record))
          dp.push(Number(val.dp))
          bv.push(Number(val.bv))
        })
        if(pilihan == 'Record') {
          this.record3.datasets.push({
            label: "RECORD",
            backgroundColor: randomColor(),
            data: record
          })
        }else if(pilihan == 'DP') {
          this.record3.datasets.push({
            label: "DP",
            backgroundColor: randomColor(),
            data: dp
          })
        }else if(pilihan == 'BV') {
          this.record3.datasets.push({
            label: "BV",
            backgroundColor: randomColor(),
            data: bv
          })
        }
      })
			.catch((err) => {
				this.notifikasi("error", err.response.message, "1")
			});
    },
    ProsesDashboardShipping() {
      this.record4 = {
        labels: [],
        datasets: []
      }
      this.getDashboardShipping()
      .then((res) => {
        const listdata = res.data.result
        const randomColor = require('randomcolor');
        const color = randomColor({ count: 4, hue: 'random' });
        const datashipping = []
        listdata.map(val => {
          let nama = `${val.shippingType.replace(/_/g, " ")} - (${val.jml})`
          this.record4.labels.push(nama)
          datashipping.push(val.persentase)
        })
        this.record4.datasets = [
          {
            backgroundColor: color,
            data: datashipping
          }
        ]
      })
			.catch((err) => {
				this.notifikasi("error", err.response.message, "1")
			});
    },
    ProsesDashboardCourier() {
      this.record5 = {
        labels: [],
        datasets: []
      }
      this.getDashboardCourier()
      .then((res) => {
        const listdata = res.data.result
        const randomColor = require('randomcolor');
        const color = randomColor({ count: 9, hue: 'random' });
        const datacourier = []
        listdata.map(val => {
          this.record5.labels.push(`${this.uppercaseLetterFirst(val.carrierName)} - (${val.jml})`)
          datacourier.push(val.persentase)
        })
        this.record5.datasets = [
          {
            backgroundColor: color,
            data: datacourier
          }
        ]
      })
			.catch((err) => {
				this.notifikasi("error", err.response.message, "1")
			});
    },
    ProsesDashboardUserActive(userType, bulan) {
      this.record6 = {
        labels: [],
        datasets: []
      }
      this.record7 = {
        labels: [],
        datasets: []
      }
      this.getDashboardUserActive(qs.stringify({ userType, bulan }, { encode: false }))
      .then((res) => {
        const listdata = res.data.result[0].dataUser
        const randomColor = require('randomcolor');
        const color = randomColor({ count: 10, hue: 'random' });
        const datauser = []
        if(userType == 'Member') {
          listdata.map(val => {
            let label = `${this.uppercaseLetterFirst(val.fullname)} (${val.idMember})`
            this.record6.labels.push(label)
            datauser.push(val.jmlData)
          })
          this.record6.datasets = [
            {
              backgroundColor: color,
              data: datauser
            }
          ]
        }else if(userType == 'Customer') {
          listdata.map(val => {
            this.record7.labels.push(this.uppercaseLetterFirst(val.fullname))
            datauser.push(val.jmlData)
          })
          this.record7.datasets = [
            {
              backgroundColor: color,
              data: datauser
            }
          ]
        }
      })
			.catch((err) => {
				this.notifikasi("error", err.response.message, "1")
			});
    },
    ProsesDashboardProduct(url) {
      this.recordProduct = []
      this.DataProduct = []
      this.getDashboardProduct(qs.stringify(url, { encode: false }))
      .then((res) => {
        const listdata = res.data.result
        
        this.DataProduct = listdata
        const datapodium = []
        listdata.map((val, i) => {
          if(i<10) datapodium.push(val)
        })
        let hasil = datapodium.map((winner, position) => { return { ...winner, position } })
        console.log(hasil);
        let podium = [8, 6, 4, 2, 0, 1, 3, 5, 7, 9]
        .reduce((podiumOrder, position) => [...podiumOrder, hasil[position]], [])
        .filter(Boolean)

        this.recordProduct = podium
      })
			.catch((err) => {
        console.log(err);
        
				this.notifikasi("error", err.message, "1")
			});
    },
    prosesDetailProduct(page, limit, keyword) {
      this.pageOptionsDetailProduct = []
      this.DataDetailProduct = []
      let is_package = null
      if(this.judul == '10 Best Seller Product Basic') {
        is_package = 0
      }else if(this.judul == '10 Best Seller Product Package') {
        is_package = 1
      }
      this.getDashboardProduct(qs.stringify({ page, limit, detail: 1, is_package, kategori: 'ALL', keyword }, { encode: false }))
      .then((res) => {
        this.isLoadingProses = false
        this.detailProduct = true

        const { records, pageSummary } = res.data.result
        this.DataDetailProduct = records
        this.pageSummaryDetailProduct = {
          page: this.DataDetailProduct.length ? pageSummary.page : 0,
          limit: this.DataDetailProduct.length ? pageSummary.limit : 0,
          total: this.DataDetailProduct.length ? pageSummary.total : 0,
          totalPages: this.DataDetailProduct.length ? pageSummary.totalPages : 0
        }
        for (let index = 1; index <= this.pageSummaryDetailProduct.totalPages; index++) {
          this.pageOptionsDetailProduct.push(index)
        }
      })
			.catch((err) => {
				this.notifikasi("error", err.response.message, "1")
			});
    },
    prosesDetailUser(page, limit){
      this.pageOptionsDetailUser = []
      this.DataDetailUser = []
      this.getDashboardDetailUserActive(qs.stringify({ page, limit, isMember: this.kondisiUser, detail: 1, bulan: this.bulanUser }, { encode: false }))
      .then((res) => {
        this.isLoadingProses = false
        this.detailUser = true

        const { pageSummary, records } = res.data.result
        this.DataDetailUser = records
        this.pageSummaryDetailUser = {
          page: this.DataDetailUser.length ? pageSummary.page : 0,
          limit: this.DataDetailUser.length ? pageSummary.limit : 0,
          total: this.DataDetailUser.length ? pageSummary.total : 0,
          totalPages: this.DataDetailUser.length ? pageSummary.totalPages : 0
        }
        for (let index = 1; index <= this.pageSummaryDetailUser.totalPages; index++) {
          this.pageOptionsDetailUser.push(index)
        }
      })
			.catch((err) => {
				this.notifikasi("error", err.response.message, "1")
			});
    },
    prosesDetailOrderUser(idUser){
      this.DataDetailOrderUser = []
      this.getDashboardDetailOrderUserActive(qs.stringify({isMember: this.kondisiUser, idUser, bulan: this.bulanUser }, { encode: false }))
      .then((res) => {
        const listdata = res.data.result
        this.DataDetailOrderUser = listdata
      })
			.catch((err) => {
				this.notifikasi("error", err.response.message, "1")
			});
    },
    reloadDashboardTransaksi(tahun) {
      this.isLoadingProses = true
      this.getDashboardReloadTransaksi(qs.stringify({ tahun }, { encode: false }))
      .then((res) => {
        this.isLoadingProses = false
        this.ProsesDashboardTransaksi(tahun)
      })
			.catch((err) => {
				this.notifikasi("error", err.response.message, "1")
			});

    },
    reloadDashboardTransaksiDaily(tahun, bulan) {
      this.isLoadingProses = true
      this.getDashboardReloadTransaksiDaily(qs.stringify({ tahun, bulan }, { encode: false }))
      .then((res) => {
        this.isLoadingProses = false
        this.ProsesDashboardTransaksiDaily(tahun, bulan, 'DP')
      })
			.catch((err) => {
				this.notifikasi("error", err.response.message, "1")
			});

    },
    reloadDashboardUserActive(isMember, bulan) {
      this.isLoadingProses = true
      this.getDashboardReloadUserActive(qs.stringify({ isMember, detail: '0', bulan }, { encode: false }))
      .then((res) => {
        this.isLoadingProses = false
        this.ProsesDashboardUserActive(isMember == '0' ? 'Customer' : 'Member', bulan)
        this.ProsesDashboardUserActive(isMember != '0' ? 'Customer' : 'Member', bulan)
      })
			.catch((err) => {
				this.notifikasi("error", err.response.message, "1")
			});

    },
    HitPodium(kategori) {
      this.judul = kategori
      if(kategori == '10 Best Seller Product Basic') {
        this.url = { kategori: 'ALL', is_package: 0 }
        this.kategori = 'product'
        this.kondisiProduct = false
      }else if(kategori == '10 Best Seller Product Package') {
        this.url = { kategori: 'ALL', is_package: 1 }
        this.kategori = 'product'
        this.kondisiProduct = false
      }else if(kategori == '10 Best Seller Product Last Month') {
        this.url = { kategori: 'PART', condition: 'BEST_SELLER', condition_value: 'LAST_MONTH' }
        this.kategori = 'productBSLM'
        this.kondisiProduct = true
      }else if(kategori == '10 Best Seller Product Last 90 Days') {
        this.url = { kategori: 'PART', condition: 'BEST_SELLER', condition_value: 'LAST_90_DAYS' }
        this.kategori = 'productBSL90D'
        this.kondisiProduct = true
      }else if(kategori == '10 New Release Product') {
        this.url = { kategori: 'PART', condition: 'NEW_RELEASE', condition_value: '' }
        this.kategori = 'product'
        this.kondisiProduct = true
      }
      this.ProsesDashboardProduct(this.url)
    },
    bukaDetailProductDialog(page, limit, keyword) {
      this.isLoadingProses = true
      this.prosesDetailProduct(page, limit, keyword)
    },
    bukaDetailUserDialog(page, limit, kondisi) {
      this.isLoadingProses = true
      this.kondisiUser = kondisi
      this.headersDetailUser = [
        { title: "No.", key: "number", sortable: false, width: "7%" },
        { title: "ID User", key: "idUser", sortable: false },
        { title: "ID Member", key: "idMember", sortable: false },
        { title: "Nama", key: "fullname", sortable: false },
        { title: "Total Order", key: "jmlData", sortable: false },
        { title: "Data Order", key: "order", sortable: false },
      ]
      if(kondisi == 0) this.headersDetailUser.splice(2,1);
      this.prosesDetailUser(page, limit)
    },
    bukaDetailOrderDialog(idUser) {
      this.detailOrderUser = true
      this.prosesDetailOrderUser(idUser)
    },
    notifikasi(kode, text, proses) {
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
  }
}
</script>
<style scoped>
.v-chip-group {
  display: flex;
  justify-content: center;
}
.v-chip {
  cursor: default;
}
.box{
	width: 120px;
	height: 50px;
  background-image:-moz-linear-gradient(top, #28a154, #000);
	background-image: -webkit-gradient(linear, 100% 25%, 50% 100%, from(#28a154), to(#000), color-stop(1,#000));
	border-radius: 10px;
	padding: 0px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
	text-align: center;
	font-size: 8pt;
	font-weight: bold;
	color: white;
}
.customScroll {
  width: 100%;
  height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}
.customScroll::-webkit-scrollbar {
  width: 16px;
}
.customScroll::-webkit-scrollbar-thumb {
  background-color: #28a154;
  border: 5px solid #e1e1f0;
  border-radius: 10rem;
}
.customScroll::-webkit-scrollbar-track {
  position: absolute;
  right: -3rem;
  top: -50rem;
  background: transparent;
}
.table-header {
  font-weight: bold;
  color: white;
  font-size: 11pt;
  text-align: center;
}
.gambar {
	border-style: solid !important;
	border-radius: 10px !important;
	padding: 2px !important;
}
</style>