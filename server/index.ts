import * as alt from 'alt-server';

import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
let isUpdatingVehicles = false;
let isUpdatingPlayers = false;

function updatePlayers() {
    if (isUpdatingPlayers) {
        return;
    }

    isUpdatingPlayers = true;

    for (let player of alt.Player.all) {
        if (!player.valid) {
            continue;
        }

        const document = Rebar.document.character.useCharacter(player);
        if (!document.get()) {
            continue;
        }

        const ammo: { [key: string]: number } = {};
        for (let weapon of player.weapons) {
            ammo[weapon.hash] = player.getAmmo(weapon.hash);
        }

        Rebar.player.useWeapon(player).saveAmmo();
        Rebar.player.useState(player).save();
    }

    isUpdatingPlayers = false;
}

function updateVehicles() {
    if (isUpdatingVehicles) {
        return;
    }

    isUpdatingVehicles = true;

    for (let vehicle of alt.Vehicle.all) {
        if (!vehicle.valid) {
            continue;
        }

        const document = Rebar.document.vehicle.useVehicle(vehicle);
        if (!document.get()) {
            continue;
        }

        Rebar.vehicle.useVehicle(vehicle).save();
    }

    isUpdatingVehicles = false;
}

alt.setInterval(updatePlayers, 5000);
alt.setInterval(updateVehicles, 5000);
