<script>
	// @ts-nocheck
	import {
		Card,
		CardText,
		Ripple,
		Overlay,
		TextField,
		Select,
		List,
		Divider,
		ListItem
	} from 'svelte-materialify';
	import CellPicker from './CellPicker.svelte';

	import { cellType, weapon, weaponType } from '../database';
	import { selectedItems } from '../stores.js';

	export let items = [];
	export let selectedItem = false;
	export let perkNamesList = [];
	export let pickerActive = false;
	export let pickerName = 'picker';

	export let searchFilter = '';
	export let weaponTypeFilter = [];
	export let cellTypeFilter = [];
	export let perkFilter = [];

	function itemSelected(item) {
		$selectedItems.weapon = item;
		selectedItem = item;
		pickerActive = false;
		$selectedItems.weapon.selectedCells = [null, null];
	}
	function cellSelected(index, selectedCell) {
		$selectedItems.weapon.selectedCells[index] = selectedCell;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->

{#if !selectedItem}
	<div
		style="margin:20px; user-select:none;"
		on:click={() => {
			pickerActive = true;
		}}
	>
		<Card hover>
			<div use:Ripple>
				<CardText>
					<div class="text--primary text-h4">Choose a <b>{pickerName}</b> here</div>
					<div>Click to select a {pickerName}</div>
				</CardText>
			</div>
		</Card>
	</div>
{:else}
	<div style="margin:20px; user-select:none; display:grid; grid-template-columns:9fr 3fr 0fr 3fr;">
		<Card hover style="margin:10px">
			<div
				use:Ripple
				on:click={() => {
					pickerActive = true;
				}}
			>
				<div class="pickerSelectedDisplayGrid" on:click={itemSelected(selectedItem)}>
					<img src={selectedItem.icon} class="responsiveImg itemImage" alt={selectedItem.name} />
					<h3>{selectedItem.name}</h3>
					<p style="display:inline-block;">
						+ <img
							src={'/assets/icons/elements/' + selectedItem.elemental + '.png'}
							class="inline-img"
							alt={selectedItem.elemental}
						/>
						{selectedItem.elemental}
					</p>
					<p style="display:inline-block;">
						+3 <img
							src={'/assets/icons/perks/' + selectedItem.perk.type + '.png'}
							class="inline-img"
							alt={selectedItem.perk.type}
						/>{selectedItem.perk.name}
					</p>
				</div>
			</div>
		</Card>
		<CellPicker
			cellSlot={selectedItem.cells[0]}
			on:select={(cell) => cellSelected(0, cell.detail)}
		/>
		<CellPicker
			cellSlot={selectedItem.cells[1]}
			on:select={(cell) => cellSelected(1, cell.detail)}
		/>
	</div>
{/if}

<!-- fix overlay on click issues !!!!-->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	on:mousedown={(e) => {
		if (e.target.className.includes('overlay') && e.which == 1)
			//which specifies left mouse button
			pickerActive = false;
	}}
>
	<Overlay active={pickerActive}>
		<Card style="width:800px; height:900px; padding:20px;">
			<form>
				<TextField clearable bind:value={searchFilter}>Search</TextField>
				<Select chips multiple items={cellType} bind:value={cellTypeFilter}>Cell Types</Select>
			</form>
			<div style="overflow-y: scroll; height:90%;">
				<List>
					{#each items as item (item.name)}
						{#if (searchFilter == '' || item.name
								.toLowerCase()
								.includes(searchFilter.toLowerCase()) || item.description
								.toLowerCase()
								.includes(searchFilter.toLowerCase()) || item.type
								.toLowerCase()
								.includes(searchFilter.toLowerCase())) && (weaponTypeFilter.length == 0 || weaponTypeFilter.includes(item.type)) && (cellTypeFilter.length == 0 || cellTypeFilter.includes(item.cell))}
							<ListItem on:click={itemSelected(item)}>
								<div class="itemDisplayGrid">
									<img src={item.icon} class="responsiveImg itemImage" alt={item.name} />
									<h5>{item.id} {item.type}</h5>
									Power: 120<br />

									<p style="display:inline-block;" >
										Cells:{#if item.cell != 'None'}
											<img
												src={'/assets/icons/perks/' + item.cells[0] + '.png'}
												class="inline-img"
												alt={item.cells[0]}
											/>
										{/if}
										{item.cells[0]}
										{#if item.cell != 'None'}<img
												src={'/assets/icons/perks/' + item.cells[1] + '.png'}
												class="inline-img"
												alt={item.cells[1]}
											/>
										{/if}
										{item.cells[1]}
									</p>
								</div>
							</ListItem>
							<Divider />
						{/if}
					{:else}
						No items found
					{/each}
				</List>
			</div>
		</Card>
	</Overlay>
</div>

<style>
	.itemDisplayGrid {
		display: grid;
		grid-template-columns: 1fr 8fr;
		grid-column-gap: 20px;
		grid-template-areas:
			'image title'
			'image text'
			'image text';
	}
	.pickerSelectedDisplayGrid {
		display: grid;
		grid-template-columns: 1fr 10fr;
		grid-column-gap: 20px;
		grid-template-areas:
			'image title'
			'image text'
			'image text'
			'image text';
	}
	.itemImage {
		grid-area: image;
	}
	.selectedItemCell {
		grid-area: image;
	}
</style>
