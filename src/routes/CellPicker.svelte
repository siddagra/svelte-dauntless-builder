<script>
	// @ts-nocheck
	import {
		Card,
		CardText,
		Ripple,
		Overlay,
		TextField,
		Button,
		List,
		Divider,
		ListItem
	} from 'svelte-materialify';
	import { createEventDispatcher } from 'svelte';
	import { cellType, perkList} from '../database';
	export let selectedItem = false;
	export let cellSlot = "None";
	export let pickerActive = false;
	export let items = perkList.flat()
	export let displayRank = 0; 
	

	export let searchFilter = '';

	const dispatch = createEventDispatcher();

	function cellItemSelected(item, rank) {
		selectedItem = item;
		selectedItem.displayRank = rank;
		displayRank = rank;
		pickerActive = false;
		
		dispatch('select', selectedItem);
	}
	$: if (selectedItem != false && selectedItem.type.name != cellSlot){
		selectedItem = false;
		displayRank = 0;
		dispatch('select', selectedItem);
	}
</script>

	<Card hover style="margin:10px">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div 
		style="padding-top: 2px; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;"
		use:Ripple 
		on:click={() => {
			pickerActive = true;
		}}>
			<img
				src={'/assets/icons/perks/' + cellSlot + '.png'}
				alt={cellSlot}
				class="responsiveImg cellImage {displayRank==3 ? 'plus3' : displayRank==2 ? 'plus2' : displayRank==1 ? 'plus1' : ''}"
			/>
			{#if selectedItem}
			<CardText style="justify-content: center; display:flex;">
				{selectedItem.name} + {displayRank}
			</CardText>
			{/if}
		</div>
	</Card>

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
			</form>
			<div style="overflow-y: scroll; height:90%;">
				<List>
					{#each items as item (item.name)}
						{#if (item.type.name == cellSlot &&
							(searchFilter == '' || item.name
								.toLowerCase()
								.includes(searchFilter.toLowerCase()) || item.description
								.toLowerCase()
								.includes(searchFilter.toLowerCase()) || item.type
								.toLowerCase()
								.includes(searchFilter.toLowerCase())))
						}
							<ListItem>
								<div class="cellItemDisplayGrid">
									<img src={'/assets/icons/perks/' + item.type.name + '.png'} class="responsiveImg cellItemImage" alt={item.name} />
									<h5 class="cellItemTitle">{item.name}</h5>
									<p class="cellItemDescription">
										{item.description}
									</p>
									<div class="cellItemRank">
										<Button class="purple" on:click={cellItemSelected(item, 3)}>+3</Button>
										<Button class="blue darken-2" on:click={cellItemSelected(item, 2)}>+2</Button>
										<Button class="green" on:click={cellItemSelected(item, 1)}>+1</Button>
									</div>
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
	.cellItemDisplayGrid{
		display: grid;
		grid-template-columns: 1fr 8fr;
		grid-column-gap: 20px;
		grid-template-areas:
			'image title .'
			'image description description'
			'image . rank';
	}
	.cellImage{
		border-radius: 50%;
		width: 50px;
	}
	.cellImage.plus3{
		background-color: rgb(176, 22, 176);
	}
	.cellImage.plus2{
		background-color: rgb(0, 85, 232);
	}
	.cellImage.plus1{
		background-color: rgb(41, 193, 7);
	}
	.cellItemImage {
		grid-area: image;
	}
	.cellItemDescription{
		grid-area: description;
	}
	.cellItemTitle{
		grid-area: title;
	}
	.cellItemRank{
		grid-area: rank;
	}
</style>