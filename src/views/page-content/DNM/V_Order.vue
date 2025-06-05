<template>
  <div>
    <h2 class="subheading grey--text text-decoration-underline">Data Semua Order</h2>
    <v-card class="pa-1 rounded" variant="outlined" elevation="4">
      <v-data-table
        loading-text="Sedang memuat... Harap tunggu"
        no-data-text="Tidak ada data yang tersedia"
        no-results-text="Tidak ada catatan yang cocok ditemukan"
        :headers="headers"
        :loading="loadingtable"
        :items="DataOrder"
        expand-on-click
        item-value="idOrder"
        density="comfortable"
        hide-default-footer
        hide-default-header
        class="elavation-3 rounded"
        :items-per-page="itemsPerPage"
        @page-count="pageCount = $event"
        @click:row="clickrow"
        v-model:expanded="expanded"
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
          {{ page > 1 ? ((page - 1)*limit) + item.index + 1 : item.index + 1 }}
        </template>
        <template #[`item.orderNumber`]="{ item }">
          <input type="hidden" id="testing-code-on" :value="item.raw.orderNumber">
          <span ref="myinputon" v-html="item.raw.orderNumber" /> <v-icon v-if="item.raw.orderNumber" @click.stop.prevent="copyText(item.raw.orderNumber, 'Invoice')" size="small" icon="mdi mdi-content-copy" color="#28a154" />
          <br><span v-html="convertDateTime(item.raw.createdAt)" /> 
        </template>
        <template #[`item.receipt`]="{ item }">
          <span v-html="item.raw.rcptName" /><br> 
          <span v-html="item.raw.rcptPhno" /> 
        </template>
        <template #[`item.total`]="{ item }">
          <v-chip
            border="#28a154"
            color="#28a154"
            :text="`Rp.${currencyDotFormatNumber(item.raw.totalPricePlain/1)}`"
            size="small"
            density="comfortable"
          />
          <!-- Rp.<span v-html="currencyDotFormatNumber(item.raw.totalPricePlain/1)" /> -->
        </template>
        <!-- <template #[`item.user`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="x-large" icon="mdi mdi-information" color="#28a154" />
            </template>
            <div>
              Data User<br>
              fullname / devicenumber : <span v-html="item.raw.dataUser.fullname" /> / <span v-html="item.raw.dataUser.devicenumber" /><br>
              Member / Non Member : <span v-html="item.raw.dataUser.consumerType" /><br>
              Customer Ref Code : <span v-html="item.raw.dataUser.customerRegRefcode" /><br><br>
              Data Member<br>
              fullname / devicenumber : <span v-html="item.raw.dataUser.consumerType != 'MEMBER' ? item.raw.dataMember.fullname : item.raw.dataUser.fullname" /> / <span v-html="item.raw.dataUser.consumerType != 'MEMBER' ? item.raw.dataMember.devicenumber : item.raw.dataUser.devicenumber" /><br>
            </div>
          </v-tooltip>
        </template>
        <template #[`item.product`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="x-large" icon="mdi mdi-information" color="#28a154" />
            </template>
            <div v-for="(data, i) in item.raw.productDetails" :key="i">
              <span v-html="data.name" /> (<span v-html="data.quantity" />)<br>
            </div>
          </v-tooltip>
        </template> -->
        <template #[`item.paymentStatusFinal`]="{ item }">
          <span>{{ `${item.raw.paymentStatusFinal} -> ${item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentMethod}` }}</span>
          <span v-if="item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentMethod == 'VA'">
            <br>{{ item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentAccountNo }} <v-icon @click.stop.prevent="copyText(item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentAccountNo, 'No VA')" size="small" icon="mdi mdi-content-copy" color="#28a154" />
            <br>{{ item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentProvider }}
          </span>
          <span v-else-if="item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentMethod == 'ESPAY'">
            <v-icon @click.stop.prevent="panellinkEspay(item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentRedirectUrl)" size="small" icon="mdi mdi-link-variant" color="#28a154" />
            <br>{{ item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentProvider }}
          </span>
        </template>
        <template #[`item.shippingType`]="{ item }">
          <v-tooltip v-if="item.raw.shippingType == 'PICKUP'" location="bottom">
            <template v-slot:activator="{ props }">
              <span v-html="item.raw.shippingType" /> <v-icon v-bind="props" size="x-large" icon="mdi mdi-information" color="#28a154" /><br>
              {{ `${item.raw.stockistorwh.fullname} (${item.raw.stockistorwh.locationCode})` }} <v-icon v-if="item.raw.stockistorwh.locationCode" @click.stop.prevent="copyText(item.raw.stockistorwh.locationCode, 'WH Or Stockist')" size="small" icon="mdi mdi-content-copy" color="#28a154" />
            </template>
            Code Pickup : <span v-html="item.raw.codePickup ? item.raw.codePickup : '-'" />
          </v-tooltip>
          <span v-else>
            {{ item.raw.shippingType.replaceAll('_', ' ') }}<br>
            {{ `${item.raw.shippingReceiptNumber ? item.raw.shippingReceiptNumber : '-'}` }} <v-icon v-if="item.raw.shippingReceiptNumber" @click.stop.prevent="copyText(item.raw.shippingReceiptNumber, 'Conote')" size="small" icon="mdi mdi-content-copy" color="#28a154" /><br>
            {{ `${item.raw.stockistorwh.fullname} (${item.raw.stockistorwh.locationCode})` }} <v-icon v-if="item.raw.stockistorwh.locationCode" @click.stop.prevent="copyText(item.raw.stockistorwh.locationCode, 'WH Or Stockist')" size="small" icon="mdi mdi-content-copy" color="#28a154" />
          </span>
        </template>
        <template #[`item.orderStatusLatest`]="{ item }">
          {{ item.raw.orderStatusLatest.replaceAll('_', ' ') }}
        </template>
        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-pencil"
                nama-button="Ubah Status"
                size-button="x-small"
                @proses="ubahData(item.raw)"
              />
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-check"
                nama-button="Check Pembayaran"
                size-button="x-small"
                :disabled="!item.raw.payment.some(e => e.paymentMethod === 'VA' || e.paymentMethod === 'ESPAY' || e.paymentMethod === 'MIDTRANS')"
                @proses="checkPayments(item.raw.orderNumber)"
              />
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-check"
                nama-button="Hit Order Stack Manual"
                size-button="x-small"
                :disabled="(!item.raw.payment.some(e => e.paymentMethod === 'VA' || e.paymentMethod === 'ESPAY' || e.paymentMethod === 'MIDTRANS' || e.paymentMethod === 'VAC') || item.raw.orderStatusLatest !== 'WAITING_FOR_PAYMENT')"
                @proses="questionHit('hit order stack', item.raw.orderNumber)"
              />
                <!-- @proses="hitOrderStackManual(item.raw.orderNumber)" -->
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-check"
                nama-button="Check Confirmation COD"
                size-button="x-small"
                :disabled="item.raw.shippingType !== 'DELIVERY_COD'"
                @proses="panelconfirmCOD(item.raw.orderNumber)"
              />
              <Button 
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-check"
                nama-button="Confirmation COD"
                size-button="x-small"
                :disabled="item.raw.shippingType !== 'DELIVERY_COD' || item.raw.orderStatusLatest !== 'WAITING_FOR_COD_CONFIRMATION'"
                @proses="questionHit('confirm cod', item.raw.orderNumber)"
              />
                <!-- @proses="confirmCOD(item.raw.orderNumber)" -->
              <Button
                v-if="item.raw.shippingType !== 'PICKUP' && !(item.raw.orderStatusLatest === 'CANCELED' || item.raw.orderStatusLatest === 'WAITING_FOR_PAYMENT' || item.raw.orderStatusLatest === 'WAITING_FOR_COD_CONFIRMATION')"
                color-button="#0bd369"
                icon-prepend-button="mdi mdi-truck"
                nama-button="Tracking History"
                size-button="x-small"
                @proses="checkTrackingShipping(item.raw)"
              />
            </td>
          </tr>
          <tr>
            <td :colspan="columns.length">
              <v-card color="background-dialog-card" class="mt-2 mb-2">
                <v-card-text>
                  <v-row>
                    <v-col
                      cols="12"
                      md="12"
                    >
                      <table cellspacing="0" cellpadding="0" width="100%" class="table-style" style="margin-bottom: 5px;">
                        <tr class="table-row">
                          <th class="table-header" colspan="4" style="font-size: 10pt; background-color: #272727 !important;">DATA TRANSAKSI</th>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell" width="30%">Invoice / Tanggal Transaksi</td>
                          <td class="table-cell">{{ `${item.raw.orderNumber} / ${convertDateTime(item.raw.createdAt)}` }}</td>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell">Total Harga</td>
                          <td class="table-cell">{{ `Rp.${currencyDotFormatNumber(item.raw.totalPricePlain/1)}` }}</td>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell">Platform / Bonus Type</td>
                          <td class="table-cell">{{ `${item.raw.trxPlatformSrc} / ${item.raw.flagSmartplan}` }}</td>
                        </tr>
                        <tr class="table-row" v-if="item.raw.shippingType != 'PICKUP'">
                          <td class="table-cell">Shipping Type / Fee</td>
                          <td class="table-cell">{{ `${item.raw.shippingType.replaceAll('_', ' ')} / Rp.${currencyDotFormatNumber(item.raw.shippingFee/1)}` }}</td>
                        </tr>
                        <tr class="table-row" v-if="item.raw.shippingType == 'PICKUP'">
                          <td class="table-cell">Shipping Type</td>
                          <td class="table-cell">{{ item.raw.shippingType.replaceAll('_', ' ') }}</td>
                        </tr>
                        <tr class="table-row" v-if="item.raw.shippingType == 'PICKUP'">
                          <td class="table-cell">Code Pickup</td>
                          <td class="table-cell">{{ `${item.raw.codePickup ? item.raw.codePickup : '-'}` }}</td>
                        </tr>
                        <tr class="table-row" v-if="item.raw.shippingType != 'PICKUP'">
                          <td class="table-cell">Courier Name / No. Resi</td>
                          <td class="table-cell">{{ `${item.raw.carrierName} / ${item.raw.shippingReceiptNumber ? item.raw.shippingReceiptNumber : '-'}` }}</td>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell">Warehouse Code</td>
                          <td class="table-cell">{{ `${item.raw.stockistorwh.fullname} (${item.raw.stockistorwh.locationCode})` }}</td>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell">Status / Jenis (Pembayaran)</td>
                          <td class="table-cell">
                            <span>{{ `${item.raw.paymentStatusFinal} / ${item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentMethod} ` }}</span>
                            <span v-if="item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentMethod == 'VA'">
                              {{ item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentProvider }}
                              ({{ item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentAccountNo }})
                            </span>
                            <span v-else-if="item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentMethod == 'ESPAY'">
                              {{ item.raw.payment.filter(e => e.paymentMethod !== 'VOUCHER')[0].paymentProvider }}
                            </span>
                          </td>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell">Status Transaksi</td>
                          <td class="table-cell">{{ item.raw.orderStatusLatest.replaceAll('_', ' ') }}</td>
                        </tr>
                      </table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      md="12"
                    >
                      <table cellspacing="0" cellpadding="0" width="100%" class="table-style" style="margin-bottom: 5px;">
                        <tr class="table-row">
                          <th class="table-header" colspan="4" style="font-size: 10pt; background-color: #272727 !important;">DATA USER</th>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell" width="30%">Nama Penerima / No. Telepon</td>
                          <td class="table-cell">{{ `${item.raw.rcptName} / ${item.raw.rcptPhno ? item.raw.rcptPhno : '-'}` }}</td>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell" colspan="2" style="font-size: 9pt; padding-left: 10px;">--- DATA PEMBELI ---</td>
                        </tr>
                        <tr class="table-row" v-if="item.raw.dataUser.consumerType == 'MEMBER'">
                          <td class="table-cell">ID Member</td>
                          <td class="table-cell">{{ item.raw.isDownline ? item.raw.downlineIdMember : item.raw.dataUser.idMember }}</td>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell">fullname / devicenumber</td>
                          <td class="table-cell">{{ `${item.raw.isDownline ? item.raw.downlineName : item.raw.dataUser.fullname} / ${item.raw.isDownline ? item.raw.downlinePhoneNumber : item.raw.dataUser.devicenumber ? item.raw.dataUser.devicenumber : '-'}` }}</td>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell">Account Type / Customer Ref Code</td>
                          <td class="table-cell">{{ `${item.raw.dataUser.consumerType} / ${item.raw.dataUser.customerRegRefcode ? item.raw.dataUser.customerRegRefcode : '-'}` }}</td>
                        </tr>
                        <tr class="table-row" v-if="item.raw.shippingType != 'PICKUP'">
                          <td class="table-cell">Alamat</td>
                          <td class="table-cell">{{ item.raw.address.address }}</td>
                        </tr>
                        <tr class="table-row" v-if="item.raw.shippingType != 'PICKUP'">
                          <td class="table-cell">Alamat Detail</td>
                          <td class="table-cell">{{ item.raw.address.detailAddress }}</td>
                        </tr>
                        <tr class="table-row" v-if="item.raw.shippingType != 'PICKUP'">
                          <td class="table-cell">Latitude / Longitude</td>
                          <td class="table-cell">{{ `${item.raw.address.latitude ? item.raw.address.latitude : '-'} / ${item.raw.address.longitude ? item.raw.address.longitude : '-'}` }}</td>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell" colspan="2" style="font-size: 9pt; padding-left: 10px;">--- DATA MEMBER ---</td>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell">ID Member / fullname</td>
                          <td class="table-cell">{{ `${item.raw.dataMember.idMember} / ${item.raw.dataMember.fullname}` }}</td>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell">devicenumber</td>
                          <td class="table-cell">{{ item.raw.dataMember.devicenumber ? item.raw.dataMember.devicenumber : '-' }}</td>
                        </tr>
                      </table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      md="12"
                    >
                      <table v-if="item.raw.productDetails.filter(x => x.packages.length).length" cellspacing="0" cellpadding="0" width="100%" class="table-style">
                        <tr class="table-row">
                          <th class="table-header" style="font-size: 10pt; background-color: #272727 !important;">DATA PRODUCT</th>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell" style="font-size: 9pt; padding-left: 10px;">--- PACKAGE / BUNDLING ---</td>
                        </tr>
                      </table>
                      <div
                        v-if="item.raw.productDetails.filter(x => x.packages.length).length"
                        v-for="(data, index) in item.raw.productDetails.filter(x => x.packages.length)"
                        :key="index"
                      >
                        <Fieldset
                          :legend="`${data.idProductSync} - ${data.name} (Qty: ${data.quantity})`"
                          :toggleable="true"
                        >
                          <table cellspacing="0" cellpadding="0" width="100%" class="table-style">
                            <tr class="table-row">
                              <th width="10%" class="table-header">Gambar</th>
                              <th width="50%" class="table-header">Nama Product</th>
                              <th width="20%" class="table-header">Variant</th>
                              <th width="10%" class="table-header">Quantity</th>
                            </tr>
                            <template  v-for="(data2, index2) in data.packages" :key="index2">
                              <tr class="table-row" v-if="data2.selectedVariants.length" v-for="(data3, index3) in data2.selectedVariants" :key="index3">
                                <td class="d-flex flex-column justify-space-between align-center table-cell">
                                  <div class="avatar">
                                    <v-img :src="data2.image" />
                                  </div>
                                </td>
                                <td class="table-cell">{{ data2.productName }}</td>
                                <td style="text-align: center;" class="table-cell">{{ data3.valueString }}</td>
                                <td style="text-align: center;" class="table-cell">{{ data3.quantity }}</td>
                              </tr>
                              <tr class="table-row" v-else>
                                <td class="d-flex flex-column justify-space-between align-center table-cell">
                                  <div class="avatar">
                                    <v-img :src="data2.image" />
                                  </div>
                                </td>
                                <td class="table-cell">{{ data2.productName }}</td>
                                <td style="text-align: center;" class="table-cell">-</td>
                                <td style="text-align: center;" class="table-cell">{{ data2.quantity }}</td>
                              </tr>
                            </template>
                          </table>
                        </Fieldset>
                      </div>
                      <table v-if="item.raw.productDetails.filter(x => !x.packages.length).length" cellspacing="0" cellpadding="0" width="100%" class="table-style">
                        <tr class="table-row">
                          <th class="table-header" colspan="3" style="font-size: 10pt; background-color: #272727 !important;">DATA PRODUCT</th>
                        </tr>
                        <tr class="table-row">
                          <td class="table-cell" colspan="3" style="font-size: 9pt; padding-left: 10px;">--- SINGLE ---</td>
                        </tr>
                        <tr class="table-row">
                          <th class="table-header" width="10%">ID Product</th>
                          <th class="table-header" width="50%">Nama Product</th>
                          <th class="table-header" width="10%">Quantity</th>
                        </tr>
                        <tr class="table-row" v-for="(data, index) in item.raw.productDetails.filter(x => !x.packages.length)" :key="index">
                          <td class="table-cell" style="text-align: center;">{{ data.idProductSync }}</td>
                          <td class="table-cell">{{ data.name }}</td>
                          <td class="table-cell" style="text-align: center;">{{ data.quantity }}</td>
                        </tr>
                      </table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      md="12"
                    >
                      <table cellspacing="0" cellpadding="0" width="100%" class="table-style">
                        <tr class="table-row">
                          <th colspan="5" style="font-size: 10pt; background-color: #272727 !important;" class="table-header">DATA PEMBAYARAN</th>
                        </tr>
                        <tr class="table-row">
                          <th width="10%" class="table-header">Payment Method</th>
                          <th width="30%" class="table-header">Remarks</th>
                          <th width="10%" class="table-header">Pay Amount</th>
                          <th width="10%" class="table-header">Charge</th>
                          <th width="30%" class="table-header">Status</th>
                        </tr>
                        <template v-if="item.raw.shippingType != 'DELIVERY_COD'">
                          <tr v-for="(data, index) in item.raw.payment" :key="index" class="table-row">
                            <td class="table-cell" style="text-align: center;">{{ `${data.paymentMethod} -> ${data.paymentProvider}` }}</td>
                            <td class="table-cell">{{ data.remarks ? data.remarks : '-' }}</td>
                            <td class="table-cell" style="text-align: center;">{{ `Rp.${currencyDotFormatNumber(data.total/1)}` }}</td>
                            <td class="table-cell" style="text-align: center;">{{ `Rp.${data.adminFee ? currencyDotFormatNumber(data.adminFee/1) : '0'}` }}</td>
                            <td class="table-cell" style="text-align: center;">{{ data.notes }}</td>
                          </tr>
                        </template>
                        <template v-else>
                          <tr v-for="(data, index) in item.raw.payment" :key="index" class="table-row">
                            <td class="table-cell" style="text-align: center;">{{ data.paymentMethod == 'COD' ?  'COD - Bayar ditempat' : data.paymentMethod }}</td>
                            <td class="table-cell">{{ data.remarks ? data.remarks : '-' }}</td>
                            <td class="table-cell" style="text-align: center;">{{ `Rp.${currencyDotFormatNumber(data.total/1)}` }}</td>
                            <td class="table-cell" style="text-align: center;">{{ `Rp.${data.adminFee ? currencyDotFormatNumber(data.adminFee/1) : '0'}` }}</td>
                            <td class="table-cell" style="text-align: center;">pending</td>
                          </tr>
                        </template>
                      </table>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      md="12"
                    >
                      <table cellspacing="0" cellpadding="0" width="100%" class="table-style">
                        <tr class="table-row">
                          <th colspan="4" style="font-size: 10pt; background-color: #272727 !important;" class="table-header">TRACKING ORDER</th>
                        </tr>
                        <tr class="table-row">
                          <th width="30%" class="table-header">Status Order</th>
                          <th width="50%" class="table-header">Remarks</th>
                          <th width="20%" class="table-header">Tanggal Proses</th>
                        </tr>
                        <template v-if="item.raw.dataTrack.length">
                          <tr v-for="(data, index) in item.raw.dataTrack" :key="index" class="table-row">
                            <td class="table-cell">{{ data.orderStatus }}</td>
                            <td class="table-cell">{{ data.remarks ? data.remarks : '-' }}</td>
                            <td class="table-cell">{{ convertDateTime(data.createdAt) }}</td>
                          </tr>
                        </template>
                      </table>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </td>
          </tr>
        </template>
        <template #top>
          <v-card class="mb-0 pa-2" outlined elevation="0">
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Status Order
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <Autocomplete
                  v-model="statusOrder"
                  pilihan-a="autocomplete"
                  :data-a="statusOptions.filter(e => e.title !== 'PAYMENT_ERROR' && e.title !== 'ORDER_RETURN')"
                  label-a="Status Order"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col
                cols="12"
                md="4"
                class="pt-2 d-flex align-center font-weight-bold"
              >
                Invoice
              </v-col>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <TextArea
                  v-model="invoice"
                  label-ta="Invoice (INV-1INV-2INV-3...)"
                  rows="4"
                  :clearable-ta="true"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="4"/>
              <v-col
                cols="12"
                md="8"
                class="pt-3"
              >
                <Button 
                  color-button="#0bd369"
                  icon-prepend-button="mdi mdi-send-check"
                  nama-button="Check"
                  size-button="small"
                  :disabled-button="isTombol"
                  @proses="() => {
                    page = 1;
                    limit = 20;
                    isTombol = true;
                    DataOrder = [];
                    pageSummary = {
                      page: '',
                      limit: '',
                      total: '',
                      totalPages: ''
                    };
                    prosesData(page, limit, invoice, statusOrder); }"
                />
              </v-col>
            </v-row>
          </v-card>
          <v-divider :thickness="2" class="border-opacity-100" color="white" />
        </template>
        <template #bottom>
          <v-divider :thickness="2" class="border-opacity-100" color="white" />
          <v-row no-gutters>
            <v-col cols="12" lg="10" class="pa-2 d-flex justify-start align-center">
              <!-- <span>Halaman <strong>{{ pageSummary.page ? pageSummary.page : 0 }}</strong> dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span> -->
              <span>Halaman&nbsp;</span>
              <div style="width: 100px;">
                <Autocomplete
                  v-model="page"
                  :data-a="pageOptions"
                  label-a="Page"
                  :disabled-a="DataOrder.length ? false : true"
                />
              </div>
              <span>&nbsp;dari Total Halaman <strong>{{ pageSummary.totalPages ? pageSummary.totalPages : 0 }}</strong> (Records {{ pageSummary.total ? pageSummary.total : 0 }})</span>
            </v-col>
            <v-col cols="12" lg="2" class="pa-2 text-right">
              <div class="d-flex justify-start align-center">
                <Autocomplete
                  v-model="limit"
                  pilihan-a="select"
                  :data-a="limitPage"
                  label-a="Limit"
                  :disabled-a="DataOrder.length ? false : true"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-left-circle-outline"
                  :disabled-button="DataOrder.length ? pageSummary.page != 1 ? false : true : true"
                  @proses="() => { page = pageSummary.page - 1 }"
                />
                <Button
                  variant="plain"
                  size-button="large"
                  model-button="comfortable"
                  color-button="#ffffff"
                  icon-button="mdi mdi-arrow-right-circle-outline"
                  :disabled-button="DataOrder.length ? pageSummary.page != pageSummary.totalPages ? false : true : true"
                  @proses="() => { page = pageSummary.page + 1 }"
                />
              </div>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="DialogOrder"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Ubah Status Order</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => { clearData(); DialogOrder = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialog--custom">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              OrderID
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.idOrder }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Invoice Number
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ previewData.orderNumber }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Status Order
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <Autocomplete
                v-model="previewData.status"
                :data-a="statusOptions.filter(e => e.title !== 'ALL')"
                label-a="Status"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Remarks
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              <TextArea
                v-model="previewData.remarks"
                label-ta="Remarks"
                rows="4"
                :clearable-ta="true"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider :thickness="2" class="border-opacity-100" color="black" />
        <v-card-actions>
          <v-row 
						no-gutters
						class="mr-3"
					>
						<v-col
							class="text-end"
							cols="12"
						>
							<Button 
								color-button="#28a154"
								nama-button="Ubah Status Order"
								@proses="postRecord()"
							/>
						</v-col>
					</v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="DialogTrackingHistory"
      scrollable
      persistent
      transition="dialog-bottom-transition"
      width="auto"
    >
      <v-card color="background-dialog-card">
        <v-toolbar color="surface">
          <v-toolbar-title>Tracking History</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <Button
              variant="plain"
              color-button="#ffffff"
              icon-button="mdi mdi-close"
              model-button="comfortable"
              size-button="large"
              @proses="() => {
                dataTracking = {
                  pengirim: '',
                  alamat_pengirim: '',
                  penerima: '',
                  alamat_penerima: '',
                  awb: '',
                  ekspedisi: '',
                  history: [],
                };
                DialogTrackingHistory = false; }"
            />
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="pt-4 v-dialogsecond--custom">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Pengirim
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ dataTracking.pengirim }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Alamat Pengirim
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ dataTracking.alamat_pengirim }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Penerima
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ dataTracking.penerima }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Alamat Penerima
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ dataTracking.alamat_penerima }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
              class="pt-2 d-flex align-center font-weight-bold"
            >
              Ekspedisi / No Resi
            </v-col>
            <v-col
              cols="12"
              md="8"
              class="pt-3"
            >
              {{ `${dataTracking.ekspedisi} / ${dataTracking.awb}` }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="12"
              class="pa-4 d-flex align-center justify-center font-weight-bold"
            >
              -- TRACKING HISTORY --
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="12"
              class="d-flex align-center font-weight-bold"
            >
              <table border="1" cellspacing="0" cellpadding="0" width="100%" style="background-color: #28a154; border: #FFF;">
                <tr class="table-header">
                  <td>Tanggal</td>
                  <td>Status</td>
                  <td>Status Code</td>
                </tr>
                <template v-if="dataTracking.history.length">
                  <tr style="font-size: 9pt; font-weight: bold; color: white; padding: 10px" v-for="(data, index) in dataTracking.history" :key="index">
                    <td style="text-align: center; width: 20%;">{{ convertDateTime(data.track_date) }}</td>
                    <td style="padding-left: 10px;">{{ data.status }}</td>
                    <td style="text-align: center; width: 25%;">{{ data.status_code }}</td>
                  </tr>
                </template>
              </table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider :thickness="2" class="border-opacity-100" color="black" />
        <v-card-actions />
      </v-card>
    </v-dialog>
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
        @proses="kategoriHit == '1' ? hitOrderStackManual(orderNumber) : confirmCOD(orderNumber)"
        @cancel="dialogNotifikasi = false"
      />
    </v-dialog>
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
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { useMeta } from 'vue-meta'
import qs from 'qs'
import PopUpNotifikasi from "../../Layout/PopUpNotifikasi.vue";
export default {
  name: 'DataOrder',
  components: {
    PopUpNotifikasi,
  },
  data: () => ({
		expanded: [],
		DataOrder: [],
    page: 1,
    pageCount: 0,
    itemsPerPage: 100,
    limit: 20,
		limitPage: [5,10,20,50,100],
    pageOptions: [],
		pageSummary: {
			page: '',
			limit: '',
			total: '',
			totalPages: ''
		},
		headers: [
      { title: "NO", key: "number", sortable: false, width: "5%" },
      { title: "#", key: "data-table-expand", sortable: false, width: "3%" },
      { title: "INVOICE", key: "orderNumber", sortable: false, width: "15%" },
      // { title: "TANGGAL ORDER", key: "createdAt", sortable: false, width: "10%" },
      { title: "PENERIMA", key: "receipt", sortable: false, width: "10%" },
      { title: "TOTAL HARGA", key: "total", sortable: false, width: "3%" },
      // { title: "DATA USER", key: "user", sortable: false, width: "3%" },
      // { title: "DATA PRODUCT", key: "product", sortable: false, width: "3%" },
      { title: "STATUS PEMBAYARAN", key: "paymentStatusFinal", sortable: false, width: "12%" },
      { title: "TIPE ORDER", key: "shippingType", sortable: false, width: "20%" },
      { title: "STATUS ORDER", key: "orderStatusLatest", sortable: false, width: "20%" },
    ],
    statusOrder: 'ALL',
    invoice: '',
    statusOptions: [
			{ title: "ALL" },
			{ title: "WAITING_FOR_PAYMENT" },
			{ title: "WAITING_FOR_COD_CONFIRMATION" },
			{ title: "WAITING_FOR_SELLER_CONFIRMATION" },
			{ title: "PROCESSING" },
			{ title: "IN_SHIPPING" },
			{ title: "ARRIVED_AT_DESTINATION" },
			{ title: "ARRIVED_AT_DESTINATION_PICKUP" },
			{ title: "DONE" },
			{ title: "REVIEWED" },
			{ title: "CANCELED" },
			{ title: "PAYMENT_ERROR" },
			{ title: "ORDER_RETURN" }
		],
    previewData: {
      idOrder: '',
      orderNumber: '',
      status: '',
      remarks: '',
    },
    DialogOrder: false,
    DialogTrackingHistory: false,
    isLoadingProses: false,
    isTombol: true,
    dataTracking: {
      pengirim: '',
      alamat_pengirim: '',
      penerima: '',
      alamat_penerima: '',
      awb: '',
      ekspedisi: '',
      history: [],
    },
    kategoriHit: '',
    orderNumber: '',

    //notifikasi
    dialogNotifikasi: false,
    notifikasiKode: '',
    notifikasiText: '',
    notifikasiButton: '',
  }),
  setup() {
    useMeta({
      title: "Data Order",
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
    ...mapGetters({
      orderAll: 'user/orderAll',
    }),
  },
  watch: {
    orderAll: {
			deep: true,
			handler(value) {
        this.pageOptions = []
        this.DataOrder = value.data
        if(this.DataOrder.length) {
          this.isTombol = false
        }else{
          this.isTombol = true
        }
				this.pageSummary = {
					page: this.DataOrder.length ? value.pageSummary.page : 0,
					limit: this.DataOrder.length ? value.pageSummary.limit : 0,
					total: this.DataOrder.length ? value.pageSummary.total : 0,
					totalPages: this.DataOrder.length ? value.pageSummary.totalPages : 0
				}
        for (let index = 1; index <= this.pageSummary.totalPages; index++) {
          this.pageOptions.push(index)
        }
      }
		},
    page: {
			deep: true,
			handler(value) {
        this.DataOrder = []
        this.prosesData(value, this.limit, this.invoice, this.statusOrder)
			}
		},
    limit: {
			deep: true,
			handler(value) {
        this.DataOrder = []
        this.page = 1
				this.prosesData(1, value, this.invoice, this.statusOrder)
			}
		},
    statusOrder: {
			deep: true,
			handler(value, oldValue){
        if(value !== oldValue) this.isTombol = false
			}
		},
  },
  mounted() {
    if(!localStorage.getItem('user_token')) return this.$router.push({name: 'LogIn'});
		this.prosesData(this.page, this.limit, this.invoice, this.statusOrder);
	},
	methods: {
    ...mapActions({
      getOrder: 'user/getOrder',
      checkPayment: 'user/checkPayment',
      checkShippingStatus: 'user/checkShippingStatus',
      hitOrderManual: 'user/hitOrderManual',
      hitCODConfirm: 'user/hitCODConfirm',
    }),
    prosesData(page, limit, inv, status) {
      this.DataOrder = []
      this.pageSummary = {
        page: '',
        limit: '',
        total: '',
        totalPages: ''
      }
      this.getOrder(qs.stringify({ page, limit, inv, status }, { encode: false }));
    },
    postRecord() {
      let bodyData = {
        post: {
          idOrder: [ this.previewData.idOrder ]
        },
        get: {
          status: this.previewData.status,
          remarks: this.previewData.remarks
        }
      }
      this.$store.dispatch('user/hitUpdateStatus', bodyData)
      .then((res) => {
        this.DialogOrder = false
        this.DataOrder = [];
        this.pageSummary = {
          page: '',
          limit: '',
          total: '',
          totalPages: ''
        };
        this.clearData()
        this.prosesData(1, this.limit, this.invoice, this.statusOrder)
        this.notifikasi("success", res.data.message, "1")
			})
			.catch((err) => {
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    ubahData(item){
      this.previewData = {
        idOrder: item.idOrder,
        orderNumber: item.orderNumber,
        status: item.orderStatusLatest,
        remarks: '',
      }
      this.DialogOrder = true
    },
    checkPayments(orderNumber){
      this.isLoadingProses = true
			this.checkPayment(orderNumber)
			.then((res) => {
        setTimeout(() => {
          const { status, message } = res.data.result
          this.isLoadingProses = false
          // this.prosesData(this.page, this.limit, this.invoice, this.statusOrder);
          let pesan = `Invoice ${orderNumber} ${status.payment_notification === "False" ? 'Belum dibayar': 'Sudah dibayar'} & ${message}`
          this.notifikasi("success", pesan, "1")
        }, 5000);
			})
			.catch((err) => {
        this.isLoadingProses = false
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    checkTrackingShipping(item){
			this.checkShippingStatus(qs.stringify({ no_resi: item.shippingReceiptNumber, ekspedisi: item.carrierName }, { encode: false }))
			.then((res) => {
        this.DialogTrackingHistory = true
        const listData = res.data.result
        this.dataTracking = {
          pengirim: listData.pengirim ? listData.pengirim : '-',
          alamat_pengirim: listData.alamat_pengirim ? listData.alamat_pengirim : '-',
          penerima: listData.penerima ? listData.penerima : '-',
          alamat_penerima: listData.alamat_penerima ? listData.alamat_penerima : '-',
          awb: listData.awb ? listData.awb : '-',
          ekspedisi: listData.ekspedisi ? listData.ekspedisi : '-',
          history: listData.history ? listData.history : [],
        }
			})
			.catch((err) => {
				this.notifikasi("error", err.response.data.message, "1")
			});
		},
    hitOrderStackManual(orderNumber) {
      this.isLoadingProses = true
      this.hitOrderManual(orderNumber)
			.then((res) => {
        setTimeout(() => {
          this.isLoadingProses = false
          this.prosesData(this.page, this.limit, this.invoice, this.statusOrder);
          this.notifikasi("success", res.data.message, "1")
        }, 5000);
			})
			.catch((err) => {
        this.isLoadingProses = false
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    panelconfirmCOD(orderNumber){
			window.open(
        `https://www.k-net.co.id/trx/confirm/${orderNumber}`,
        '_blank'
      );
		},
    confirmCOD(orderNumber) {
      this.isLoadingProses = true
      this.hitCODConfirm(orderNumber)
			.then((res) => {
        setTimeout(() => {
          this.isLoadingProses = false
          this.prosesData(this.page, this.limit, this.invoice, this.statusOrder);
          this.notifikasi("success", res.data.message, "1")
        }, 5000);
			})
			.catch((err) => {
        this.isLoadingProses = false
        this.notifikasi("error", err.response.data.message, "1")
			});
    },
    panellinkEspay(link){
			window.open(
        link,
        '_blank'
      );
		},
    clearData(){
      this.previewData = {
        idOrder: '',
        orderNumber: '',
        status: '',
        remarks: '',
      }
    },
    questionHit(kategori, orderNumber) {
      this.orderNumber = orderNumber
      if(kategori == 'hit order stack'){ 
        this.kategoriHit = '1'
        this.notifikasi("question2", "Apakah anda yakin ingin memproses ini ?", "2")
      }else if(kategori == 'confirm cod'){ 
        this.kategoriHit = '2'
        this.notifikasi("question2", "Apakah anda yakin ingin memproses ini ?", "2")
      }
    },
    copyText(text, nomeklatur) {
      let testingCodeToCopy = document.querySelector('#testing-code-on')
			let code = document.getElementById('testing-code-on').value = text
			testingCodeToCopy.setAttribute('type', 'text') 
			testingCodeToCopy.select()

			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'berhasil' : 'gagal';
				alert(nomeklatur + ' ' + code + ' ' + msg +' disalin');
			} catch (err) {
				alert('Oops, tidak bisa disalin');
			}
			
			testingCodeToCopy.setAttribute('type', 'hidden')
			window.getSelection().removeAllRanges()
    },
    clickrow(event, data) {
      const index = this.$data.expanded.find(i => i === data?.item?.raw?.idOrder);
      if(typeof index === 'undefined') return this.$data.expanded = [];
      this.$data.expanded.splice(0, 1)
      this.$data.expanded.push(data?.item?.raw?.idOrder);
    },
    notifikasi(kode, text, proses){
      this.dialogNotifikasi = true
      this.notifikasiKode = kode
      this.notifikasiText = text
      this.notifikasiButton = proses
    },
	}
}
</script>

<style scoped>
.listData {
	width: 200px !important;
}
.table-header {
  font-weight: bold;
  color: white;
  font-size: 9pt;
  text-align: center !important;
  background: #28a154 !important; 
}
.table-row {
  font-weight: bold;
  color: white;
  font-size: 11pt;
  text-align: center;
}

.v-col-md-6, .v-col-md-12 {
  padding: 6px;
}

.avatar {
  border: solid 2px #000;
  border-radius: 10px;
  align-items: flex-end;
  display: flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  width: 50%;
  height: auto;
}

.table-style {
  border-collapse: separate;
  border-spacing: 0;
}

.table-style .table-header,
.table-style .table-cell {
  background-color: #28a154;
  border-right: 1px solid #bbb;
  border-bottom: 1px solid #bbb;
  font-size: 8.5pt; 
  font-weight: bold; 
  color: white; 
  padding: 3px 0 3px 5px;
}

.table-style .table-cell {
  text-align: left;
  padding-left: 10px;
}

.table-style .table-row .table-header:first-child,
.table-style .table-row .table-cell:first-child {
  border-left: 1px solid #bbb;
}

.table-style .table-header {
  border-top: 1px solid #bbb;
  font-weight: bold;
  color: white;
  font-size: 8.5pt;
  text-align: center !important;
  background: #28a154 !important;
}

.table-style .table-row:first-child .table-header:first-child {
  border-top-left-radius: 6px;
}

.table-style .table-row:first-child .table-header:last-child {
  border-top-right-radius: 6px;
}

.table-style .table-row:last-child .table-cell:first-child {
  border-bottom-left-radius: 6px;
}

.table-style .table-row:last-child .table-cell:last-child {
  border-bottom-right-radius: 6px;
}



</style>