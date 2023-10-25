<script>

	import {
		MaterialApp
	} from 'svelte-materialify';
	import { weapon, head, torso, arms, legs, perkList, omnicells, lanterns } from '../database';
	import '../global.css';
    import ArmourPicker from './ArmourPicker.svelte';
    import OmnicellPicker from './OmnicellPicker.svelte';
    import LanternPicker from './LanternPicker.svelte';
    import WeaponPicker from './WeaponPicker.svelte';

    import { browser } from '$app/environment'
    import '$lib/i18n' // Import to initialize. Important :)
    import { locale, waitLocale } from 'svelte-i18n'

    export const load = async () => {
        if (browser) {
            locale.set(window.navigator.language)
        }
        await waitLocale()
    }
    
	import { _ } from 'svelte-i18n'
    
    let perkNamesList = perkList.flat().map((perk) => perk.name)
	let weaponPickerActive = false, headPickerActive = false, torsoPickerActive = false, armsPickerActive = false, legsPickerActive = false;
	let weaponTypeFilter = [];
    let filter = '';
    let cellTypeFilter = [];
</script>

<MaterialApp theme="dark">
	<body>
        <div style="margin-left:10%; width:80%; padding-top:50px;">
            <OmnicellPicker pickerName={"Omnicell"} items={Object.values(omnicells)} {perkNamesList}/>
            <WeaponPicker pickerName={"Weapon"} items={weapon.flat()} {perkNamesList}/>
            <ArmourPicker pickerName={"Head Armour"} items={head} {perkNamesList}/>
            <ArmourPicker pickerName={"Torso Armour"} items={torso} {perkNamesList}/>
            <ArmourPicker pickerName={"Arms Armour"} items={arms} {perkNamesList}/>
            <ArmourPicker pickerName={"Legs Armour"} items={legs} {perkNamesList}/>
            <LanternPicker pickerName={"Lantern"} items={Object.values(lanterns)} {perkNamesList}/>
        </div>
	</body>
</MaterialApp>
