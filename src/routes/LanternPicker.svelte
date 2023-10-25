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
    import {formatString} from "../utils.js"
    import {selectedItems} from "../stores.js"
    
	import { cellType, weaponType } from '../database';

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
		selectedItem = item;
        $selectedItems.lantern = item;
		pickerActive = false;
	}

	function cellSelected(selectedCell){
		$selectedItems.lantern.cell = selectedCell
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
	<div style="display:flex; margin:20px; user-select:none; display:grid; grid-template-columns:9fr 2fr;">
			<Card hover style="margin:10px">
				<div use:Ripple 
                on:click={() => {
                    pickerActive = true;
                }}>
					<div class="pickerSelectedDisplayGrid" on:click={itemSelected(selectedItem)}>
						<img src={selectedItem.icon} class="responsiveImg itemImage" alt={selectedItem.name} />
						<h3>{selectedItem.name}</h3>
						<p><b>Hold:</b> {@html formatString(selectedItem.lantern_ability.hold, selectedItem.values)}</p>
					</div>
				</div>
			</Card>
			{#if selectedItem.cells}
				<CellPicker cellSlot={selectedItem.cells} on:select={cellSelected}/>
			{/if}
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
								.includes(searchFilter.toLowerCase())) && 
                                (weaponTypeFilter.length == 0 || weaponTypeFilter.includes(item.type)) && 
                                (cellTypeFilter.length == 0 || cellTypeFilter.includes(item.cell))}
							<ListItem on:click={itemSelected(item)}>
								<div class="itemDisplayGrid">
									<img src={item.icon} class="responsiveImg itemImage" alt={item.name} />
									<h5>{item.name}</h5>
									Power: 120<br />
									<p style="display:inline-block;">
										Cells:
										{#if item.cell != 'None'}
											<img
												src={'/assets/icons/perks/' + item.cell + '.png'}
												class="inline-img"
												alt={item.cell}
											/>
										{/if}
										{item.cell}
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
			'image text';
	}
	.itemImage {
		grid-area: image;
	}
	.selectedItemCell {
		grid-area: image;
	}
</style>
