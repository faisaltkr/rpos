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
				<tr class="text-white">
					<th class="bg-black text-center">#</th>
					<th class="bg-black">Name</th>
					<th class="bg-black">Quantity</th>
					<th class="bg-black">Price</th>
					<!-- <th class="bg-black">Tax</th> -->
				</tr>
				<tr v-bind:key="data.name" v-for="data in invoiceData.items">
					<td class="w-10"><input type="checkbox" @change="toggleSelection(data)"
							:checked="selectedItems.find(x => x.name)" /></td>
					<td>({{ data.item_code }}) {{ data.item_name }}</td>
					<td>{{ data.qty }}</td>
					<td>{{ (data.rate * 100 * data.qty) / 100 }}</td>
					<!-- <td>{{getItemVatAndTotal({...data, vatRate: (data?.taxes && data?.taxes.length > 0) ? data?.taxes[0].tax_rate : 0})}}</td> -->
				</tr>
			</table>
			<p v-else>Loading...</p>
			<div v-if="selectedItems.length > 0" class="my-2 text-right">
				<button class="bg-red-500 text-white px-4 py-2 rounded">Return selected items</button>
			</div>
		</div>


	</div>

</template>

<script>
import HeaderNav from "../components/HeaderNav.vue";
import { getItemVatAndTotal } from '@/helper';
import axios from 'axios';
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
			selectedItems: []
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