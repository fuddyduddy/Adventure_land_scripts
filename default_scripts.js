// Source script from adventure land

//Source code of: accept_magiport
function accept_magiport(name)
{
	parent.remove_chat("mp"+name);
	parent.socket.emit('magiport',{name:name});
}

//Source code of: accept_party_invite
function accept_party_invite(name)
{
	parent.remove_chat("pin"+name);
	parent.socket.emit('party',{event:'accept',name:name});
}

//Source code of: accept_party_request
function accept_party_request(name)
{
	parent.remove_chat("rq"+name);
	parent.socket.emit('party',{event:'raccept',name:name});
}

//Source code of: activate
function activate(num) // activates an item, likely a booster, in the num-th inventory slot
{
	parent.activate(num);
}


//argument: *Object(player or monster)
//return: *promise

//Example useage:
attack(target);
attack(target).then(function(data){
	reduce_cooldown("attack",character.ping); // Try to increase your dps with ping correction
});
attack(target).then(
	function(data){
		game_log("yes!");
	},
	function(data){
		game_log("oh no, attack failed: "+data.reason);
	},
);

//promise reference
//"resolve"
{
	source: "attack",
	actor: "CharacterName",
	target: "42", // Monster ID or Character ID
	damage: 1390,
	projectile: "momentum",
	eta: 50, // Arrival in milliseconds
	pid: "abcd1234", // Projectile ID
}
//"reject"
{
	reason: "not_found", // Target not found
}
{
	reason: "too_far", // Target too far
	distance: 120,
	origin: "server", // or "client"
}
{
	reason: "cooldown", // Target too far
	remaining: 20, // 20 milliseconds remaining
}
{
	reason: "no_mp", // No MP
}
{
	reason: "disabled", // Character disabled
	// If you are stunned, you can't attack
}
{
	reason: "friendly", // PVP attacks in PVE servers
	// PVP attacks against friendly targets
}
{
	reason: "failed", // Other reasons
}
{
	reason: "miss", // Attack missed
	// Old response
	// Replaced by "too_far" and "cooldown"
}

//"source"
//Source code of: attack
function attack(target)
{
	if(target==character) target=parent.character;
	if(!target)
	{
		game_log("Nothing to attack()","gray");
		return rejecting_promise({reason:"not_found"});
	}
	if(target.type=="character")
		return parent.player_attack.call(target,null,true);
	else
		return parent.monster_attack.call(target,null,true);
}

//Source code of: auto_craft
function auto_craft(name)
{
	// Picks the inventory positions automatically. Example: auto_craft("computer")
	return parent.auto_craft(name,true);
}

//Source code of: bank_deposit
function bank_deposit(gold)
{
	if(!character.bank) return game_log("Not inside the bank");
	parent.socket.emit("bank",{operation:"deposit",amount:gold});
}

//Source code of: bank_store
function bank_store(num,pack,pack_slot)
{
	// bank_store(0) - Stores the first item in inventory in the first/best spot in bank
	// parent.socket.emit("bank",{operation:"swap",pack:pack,str:num,inv:num});
	// Above call can be used manually to pull items, swap items and so on - str is from 0 to 41, it's the storage slot #
	// parent.socket.emit("bank",{operation:"swap",pack:pack,str:num,inv:-1}); <- this call would pull an item to the first inventory slot available
	// pack is one of ["items0","items1","items2","items3","items4","items5","items6","items7"]
	if(!character.bank) return game_log("Not inside the bank");
	if(!character.items[num]) return game_log("No item in that spot");
	if(!pack_slot) pack_slot=-1; // the server interprets -1 as first slot available
	if(!pack)
	{
		var cp=undefined,cs=undefined;
		for(var cpack in bank_packs)
		{
			if(pack || bank_packs[cpack][0]!=character.map || !character.bank[cpack]) continue;
			for(var i=0;i<42;i++)
			{
				if(can_stack(character.bank[cpack][i],character.items[num])) // the item we want to store and this bank item can stack - best case scenario
					pack=cpack;
				if(!character.bank[cpack][i] && !cp)
					cp=cpack;
			}
		}
		if(!pack && !cp) return game_log("Bank is full!");
		if(!pack) pack=cp;
	}
	parent.socket.emit("bank",{operation:"swap",pack:pack,str:-1,inv:num});
}

//Source code of: bank_withdraw
function bank_withdraw(gold)
{
	if(!character.bank) return game_log("Not inside the bank");
	parent.socket.emit("bank",{operation:"withdraw",amount:gold});
}

// The next script is buy()



































































