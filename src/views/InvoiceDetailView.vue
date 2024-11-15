<template>

	<div class="flex flex-col w-screen h-screen bg-gray-800 text-white">

		<HeaderNav></HeaderNav>

		<h1 class="text-3xl m-5 flex items-center">
			<RouterLink to="/dashboard">
				<ArrowLeftIcon class="size-6 text-white mr-4 cursor-pointer" />
			</RouterLink> Invoice Details
		</h1>
		<div class="m-4">
			<h2 class="text-2xl mb-4">Sales Invoice Details</h2>
			<table v-if="invoiceData" class="min-w-full rounded-lg shadow-md overflow-y-scroll">
				<thead>
					<tr class="text-white">
						<th class="bg-black text-center">#</th>
						<th class="bg-black">Name</th>
						<th class="bg-black">Quantity</th>
						<th class="bg-black">Price</th>
					</tr>
				</thead>
				<tbody>

				<tr v-bind:key="data.name" v-for="data in invoiceData.items">
					<td class="w-10"><input type="checkbox" @change="toggleSelection(data)"
							:checked="selectedItems.find(x => x.name)" /></td>
					<td>({{ data.item_code }}) {{ data.item_name }}</td>
					<td>{{ data.qty }}</td>
					<td>{{ (data.rate * 100 * data.qty) / 100 }}</td>

					<!-- <td>{{getItemVatAndTotal({...data, vatRate: (data?.taxes && data?.taxes.length > 0) ? data?.taxes[0].tax_rate : 0})}}</td> -->
				</tr>
			</tbody>

			</table>
			<p v-else>Loading...</p>
			<div v-if="selectedItems.length > 0" class="my-2 text-right">
				<button class="bg-red-500 text-white px-4 py-2 rounded" @click="saveInvoice">Return selected items</button>
			</div>
		</div>


	</div>

</template>

<script>
import HeaderNav from "../components/HeaderNav.vue";
import { getItemVatAndTotal } from '@/helper';
import axios from 'axios';
import moment from 'moment';
import { watchEffect, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'


export default {
	components: {
		HeaderNav,
		ArrowLeftIcon
	},
	data() {
		return {
			selectedItems: [],
			pos: JSON.parse(localStorage.getItem('pos')),
			baseURL: localStorage.getItem('baseURL'),
		}
	},
	methods: {
		getItemVatAndTotal(item) {
			return getItemVatAndTotal(item)
		},
		toggleSelection(item) {
			const indexIfAlreadyExist = this.selectedItems.findIndex(x => x === item.name);
			const itemExist = indexIfAlreadyExist > -1;
			if (itemExist) {
				this.selectedItems.splice(indexIfAlreadyExist, 1)
			} else {
				this.selectedItems.push(item.name);
			}
		},
		async saveInvoice() {
			try {
				if (this.selectedItems.length === 0) {
					alert('Please select some items.');
					return;
				}

				let items = this.selectedItems.map(item => {
					return {
						item_code: item.item_code,
						qty: item.quantity,
						rate: item.price,
						vat: item.vatRate,
						vat_amount: item.vat
					};
				});

				let totalVATAmount = items.reduce((accum, item) => accum + item.vat_amount, 0);

				const invoiceData = {
					customer: "CASH",
					is_return: 1,
					due_date: moment(new Date()).format('YYYY-MM-DD'),
					posting_date: moment(new Date()).format('YYYY-MM-DD'),
					company: this.invoiceData.company, // Read company from invoiceData
					is_pos: 1,
					currency: this.pos[0].currency,
					exchange_rate: "1",
					items: items,
					taxes: [
						{
							charge_type: "On Net Total",
							account_head: "VAT 15% - ET",
							rate: 0,
							tax_amount: totalVATAmount,
							description: "VAT",
						}
					]
				};

				let sendToERPNext = this.baseURL + "/api/resource/Sales Invoice";

				axios.defaults.headers.post['Content-Type'] = 'application/json';
				axios.defaults.headers.post['Authorization'] = `Basic ${localStorage.getItem('token')}`;

				const response = await axios.post(sendToERPNext, invoiceData);
				const erpResult = response.data.data;
				console.log(erpResult);

				alert('Invoice saved successfully!');
			} catch (error) {
				console.error('Error during save process:', error);
			}
		}
	},
	setup() {
		const route = useRoute();
		const id = route.params.id;
		const invoiceData = ref(null); // Define a ref to store the data

		watchEffect(async () => {
			if (id) {
				try {
					const response = await axios.get(`https://dev14.erpx.one/api/resource/Sales%20Invoice/${id}`, {
						headers: {
							Authorization: `Basic ${localStorage.getItem("token")}`,
						}
					});
					invoiceData.value = response.data.data;
				} catch (error) {
					console.error("Error fetching data:", error);
				}
			} else {
				console.warn("No ID found in route parameters.");
			}
		});

		return { invoiceData }; // Return the ref to use it in the template
	}
};
</script>