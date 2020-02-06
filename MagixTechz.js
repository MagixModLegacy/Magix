let gift =     new G.Tech({
        name:'<font color="yellow">A gift from the Mausoleum</font>',
        desc:'The gift is very uncommon. It may make people life inverted by 180 degrees. But it will be more interesting',
        icon:[4,12,'magixmod',1,14],
        cost:{},
        req:{'tribalism':false}
    });
function checkMagic() {
  if (G.achievByName['mausoleum'].won) {
    if (G.achievByName['mausoleum'].won >= 0 && G.hasNot('<font color="yellow">A gift from the Mausoleum</font>')) {
      G.gainTech(gift)
      G.Message({
        type: 'good',
        text: '<font family="Comic Sans MS">Since you have built the Mausoleum it the past, you have access to magic!</font> :)',
        icon: [4, 12, 6, 1, 'magixmod']
      });
    }

}
 else if(G.achievByName['mausoleum'].won < 1){

  G.Message({
    type: 'bad',
    text: '<font family="Comic Sans MS">Since you haven\'t built the Mausoleum it the past yet, so you don\'t have access to magic yet</font> :(',
    icon: [3, 12, 6, 1, 'magixmod']
  });

}
}
checkMagic()
const oldNewGame = G.NewGameConfirm.bind({})
G.NewGameConfirm = new Proxy(oldNewGame, {
  apply: function(target, thisArg, args) {
    target(...args)
    checkMagic()
  }
})
new G.Tech({
		name:'Wizardry',
		desc:'@ [Archaic wizard]s will start their existence .They behave weird. Here wizardry and essences will start to appear. Essences are not naturally generated so they consume mana to be made.',
		icon:[5,3,'magixmod'],
		cost:{'insight':75,'faith':5},
		req:{'well-digging':true},
	});
//New tech to allow wizards progressing
		new G.Tech({
		name:'Mana brewery',
		desc:'You can find a specimen who will convert water into mana.',
		icon:[3,2,'magixmod'],
		cost:{'insight':50},
		req:{'Wizardry':true},
	});
		new G.Tech({
		name:'More useful housing',
		desc:'Can store food. Building made out of hard bricks. And in addition it will give a housing to your population',
		icon:[5,2,'magixmod'],
		cost:{'insight':45},
		req:{'city planning':true,'cities':true,'construction':true},
	});
		new G.Tech({
		name:'Well of Mana',
		desc:'Now you may get a well which contains mana instead of water. ',
		icon:[4,3,'magixmod'], //WIP
		cost:{'insight':46,'faith':4,'Mana':20},
		req:{'Mana brewery':true,'More useful housing':true},
	});
		new G.Tech({
		name:'Wizard towers',
		desc:'Now you can build wizard towers which can produce specified essences. Essences made depends on what type of tower you build. Provides additional housing. Making essences consumes mana. @unlocks [Fire wizard tower],[Water wizard tower],[Nature wizard tower],[Dark wizard tower],[Lightning wizard tower],[Wind wizard tower].',
		icon:[6,0,'magixmod'], //WIP
		cost:{'insight':125,'culture': 30,'Mana':40,'influence':10},
		req:{'Mana brewery':true,'More useful housing':true},
	});
		new G.Tech({
		name:'Wizard wisdom',
		desc:'Evolves up [Archaic wizard] into [Wizard] . New one may gain wisdom.',
		icon:[3,0,'magixmod'], //WIP
		cost:{'insight':85,'culture': 30,'Mana':40,'influence':10},
		req:{'Mana brewery':true,'More useful housing':true,'Wizardry':true},
	});
		new G.Tech({
		name:'Wizard complex',
		desc:'Complex of wizard towers. Expensive but The Complex produces all types of Essences three times better than usual towers. Each complex increases additionaly max [faith],[culture] & [influence]. Boosts max mana too.',
		icon:[2,2,'magixmod'], //WIP
		cost:{'insight':480,'culture':30,'Mana':100,'influence':20},
		req:{'Mana brewery':true,'More useful housing':true,'Wizardry':true,'Wizard towers':true},
	});
		new G.Tech({
		name:'First portal to new world',
		desc:'<span style="color: #00A012">Your wizards discovered way to make a portal and now they plan to open a new dimension. What would it mean? It means, more place to build, more housing, more everything!</span>',
		icon:[2,1,'magixmod'], //WIP
		cost:{'insight':1400,'culture':30,'Mana':2500,'influence':70},
		req:{'Mana brewery':true,'More useful housing':true,'Wizardry':true,'Wizard wisdom':true,'Wizard complex':true,'Belief in portals':true},
	});
		new G.Tech({
		name:'Crafting a glass',
		desc:'Since now your kilns will be able to craft glass out of sand.',
		icon:[7,1,'magixmod'], //WIP
		cost:{'insight':45},
		req:{'masonry':true,'smelting':true},
	});
		new G.Tech({
		name:'churches',
		desc:'Will generate milennialy some [spirituality]. Generates some faith at the lower rate than [soothsayer]. ',
		icon:[7,2,'magixmod'], //WIP
		cost:{'insight':95},
		req:{'Wizardry':true,'Wizard wisdom':true},
	});
		new G.Tech({
		name:'Essence storages',
		desc:'<span style="color: #FF00FF">Essence has to be stored somewhere. So do not wait and build!</span>',
		icon:[5,0,'magixmod'], //WIP
		cost:{'insight':100,'Mana':317,'faith':8,'Wand':260},
		effects:[
			{type:'provide res',what:{'fire essence limit':1}},
			{type:'provide res',what:{'water essence limit':1}},
			{type:'provide res',what:{'lightning essence limit':1}},
			{type:'provide res',what:{'dark essence limit':1}},
			{type:'provide res',what:{'wind essence limit':1}},
			{type:'provide res',what:{'nature essence limit':1}},
		],
		req:{'Mana brewery':true,'More useful housing':true,'Wizardry':true},
	});
		new G.Tech({
		name:'Concrete making',
		desc:'Use limestone and water to craft a concrete, an [advanced building materials].',
		icon:[8,0,'magixmod'], //WIP
		cost:{'insight':70},
		req:{'masonry':true,'smelting':true,'Crafting a glass':true},
	});
		new G.Tech({
		name:'<span style="color: ##FF0900">Plain island building</span>',
		desc:'<span style="color: ##FF0900">Unlocks sheet of buildings which can be only built in new dimension.</span>',
		icon:[9,0,'magixmod'], 
		cost:{'insight':4,'Plain Island emblem':1},
		req:{'<span style="color: #E0CE00">Plain island portal</span>':true},
	});
		new G.Tech({
		name:'construction II',
		desc:'Allows your people to build [Blockhouse] out of [advanced building materials]. Provides much more housing but it is limited to prevent global warmings etc.',
		icon:[8,1,'magixmod'], 
		cost:{'insight':65},
		req:{'<span style="color: #E0CE00">Plain island portal</span>':true,'<span style="color: ##FF0900">Plain island building</span>':true},
	});
		new G.Tech({
		name:'Burial in new world',
		desc:'Provides even better use of the Plain Island. You may build now few cemetries which consume much more [Land of the Plain Island], but they can store more corpses.',
		icon:[1,6,'magixmod'], 
		cost:{'insight':65},
		req:{'<span style="color: #E0CE00">Plain island portal</span>':true,'<span style="color: ##FF0900">Plain island building</span>':true},
	});
		new G.Tech({
		name:'Sewing II',
		desc:'Upgrades sewing skills of your civilization. @Unlocks <b>Drying racks<b> to make [Dried leather] used to craft better quality clothing. @Now artisans can sew [Fishing net] and craft [Thread].',
		icon:[13,5,'magixmod'], 
		cost:{'insight':380,'wisdom':10},
		req:{'Wizardry':true,'sewing':true,},
	});
		new G.Tech({
		name:'Hunting II',
		desc:'Upgrades hunting skills of your civilization. @Unlocks way to craft [Crossbow] - new weapon. Artisans can now craft [bow] & [Crossbow] and [Crossbow belt] in <b>Craft bows<b> mode.',
		icon:[15,0,'magixmod'], 
		cost:{'insight':385,'wisdom':10},
		req:{'Wizardry':true,'hunting':true,},
	});
		new G.Tech({
		name:'Fishing II',
		desc:'Upgrades fishing skills of your civilization. @Makes [Fishing net] introduced into common use.',
		icon:[8,12,25,1], 
		cost:{'insight':385,'wisdom':10},
		req:{'Wizardry':true,'fishing':true,},
	});
		new G.Tech({
		name:'Cobalt-working',
		desc:'@[furnace]s can now make [Cobalt ingot]s from [Cobalt ore]<>',
		icon:[16,0,'magixmod'],
		cost:{'insight':145},
		req:{'smelting':true,'construction II':true},
	});
		new G.Tech({
		name:'Farms in the new land',
		desc:'@Now at the Lands of Plain island you may start opening farms to let your people make more [Berries] & [Watermelon]. You are doing it here because you may have trouble to find free land in your mortal world.<>',
		icon:[16,2,'magixmod'],
		cost:{'insight':575},
		req:{'construction II':true},
	});
		new G.Tech({
		name:'Crafting a juice',
		desc:'@Makes juices possible to be crafted. Any [fruit] + [sugar] + [water] = [Juices]. Be careful. Juices may spoil same like normal water. Spoiled juice grants even more <b>unhappiness and unhealth<b> than normal muddy water.<>',
		icon:[16,4,'magixmod'],
		cost:{'insight':495,'wisdom':50},
		req:{'Farms in the new land':true},
	});
		new G.Tech({
		name:'Farm of the Sugar cane',
		desc:'@Makes [Sugar cane] farm possible to be built. This farm will have increased upkeep cost and will need more people to run.<>',
		icon:[15,7,'magixmod'],
		cost:{'insight':495,'wisdom':50},
		req:{'Farms in the new land':true},
	});
		new G.Tech({
		name:'Precious pottery',
		desc:'@Improves pottery in your civilization. Now [pot] can become harder and more beautiful. Can make pots specialized for potions.<>',
		icon:[16,8,'magixmod'],
		cost:{'insight':650,'wisdom':60},
		req:{'construction II':true},
	});
		new G.Tech({
		name:'Beginnings of alchemy',
		desc:'@Now you may start new adventure with... potions... You need to be expert at juices before you start alchemy.<>',
		icon:[16,9,'magixmod'],
		cost:{'insight':650,'wisdom':60},
		req:{'Juicy expertise':true,'Intermediate maths':true,'Proportion':true},
	});
		new G.Tech({
		name:'Terrain conservacy',
		desc:'@Unlocks subclass of [architect] which instead of setting up new houses etc. will set up some part of ground due to requirements of job group, for example [Alchemists]. Their stands and their "toys" will use [Alchemy zone] instead of [land]  <>',
		icon:[17,5,'magixmod',24,1],
		cost:{'insight':940,'wisdom':60},
		req:{'Beginnings of alchemy':true,'Intermediate maths':true,'Proportion':true},
	});
		new G.Tech({
		name:'first aid',
		desc:'@[sick],[wounded] will have bigger chance to get recovered. Obtaining this research will unlock better healers for you. <b>This research generates [health] by [healer] at low rate but it does.<>',
		icon:[15,9,'magixmod'],
		cost:{'insight':680,'wisdom':60},
		effects:[
			{type:'gather',what:{'health':0.05}},
		],
		req:{'More healing ways':true},
	});
		new G.Tech({
		name:'Basic maths',
		desc:'@people will know basic math making them more intelligent and have chance to be good at more advanced technologies.<>',
		icon:[17,1,'magixmod'],
		cost:{'insight':20},
		effects:[
			{type:'provide res',what:{'education':0.4}},
		],
		req:{'oral tradition':true},
	});
		new G.Tech({
		name:'Intermediate maths',
		desc:'@people will know more harder and advanced math making them even more intelligent and smart. @Your people have bigger chances to understand more advanced things.<>',
		icon:[17,2,'magixmod'],
		cost:{'insight':80},
		effects:[
			{type:'provide res',what:{'education':2}},
		],
		req:{'oral tradition':true,'Basic maths':true,'city planning':true},
	});
		new G.Tech({
		name:'Proportion',
		desc:'@Without it you won\'t be able to start alchemy/chemistry. Without it people will use too much or less ingredient with bad consequences of it. I would research it now.',
		icon:[18,4,'magixmod'],
		cost:{'insight':360,'wisdom':10},
		effects:[
			{type:'provide res',what:{'education':0.6}},
			{type:'provide res',what:{'science':1}},
		],
		req:{'oral tradition':true,'Intermediate maths':true,'<span style="color: ##FF0900">Plain island building</span>':true},
	});
		new G.Tech({
		name:'Ink crafting',
		desc:'Now [artisan] will be able to craft [Ink]. Ink will be used by [Poet] later. You can craft ink choosing new working mode for [artisan].',
		icon:[18,7,'magixmod'],
		cost:{'insight':335},
		req:{'<span style="color: ##FF0900">Plain island building</span>':true},
	});
		new G.Tech({
		name:'Poetry',
		desc:'Beautiful art of culture. Poems, stories, essays, novels and many more.',
		icon:[18,8,'magixmod'],
		cost:{'insight':650,'culture':300,'inspiration':25},
		req:{'<span style="color: ##FF0900">Plain island building</span>':true,'Ink crafting':true},
	});
		new G.Tech({
		name:'Moar juices',
		desc:'Allows you to craft juice out of [fruit]s.',
		icon:[17,4,'magixmod'],
		cost:{'insight':805},
		req:{'<span style="color: ##FF0900">Plain island building</span>':true,'Crafting a juice':true},
	});
		new G.Tech({
		name:'Medicaments brewing',
		desc:'[Alchemists] will now be able to craft at their stands medicaments out of [Flowers,various flowers] and a [herb,herbs].',
		icon:[18,2,'magixmod'],
		cost:{'insight':750},
		req:{'Beginnings of alchemy':true},
	});
		new G.Tech({
		name:'Alcohol brewing',
		desc:'[Alchemists] will now be able to craft at their stands alcohol by created by them own recipe. Alcohol can be used to craft trunks.',
		icon:[18,3,'magixmod'],
		cost:{'insight':750},
		req:{'Beginnings of alchemy':true},
	});
		new G.Tech({
		name:'Mana brewery II',
		desc:'[Alchemists] will now be able to craft at their stands [Mana]. To do it they will use same recipe as the [Mana maker]. Will gain same amounts like he.',
		icon:[19,2,'magixmod'],
		cost:{'insight':1000},
		req:{'Beginnings of alchemy':true},
	});
		new G.Tech({
		name:'Stronger faith',
		desc:'Unlocks cathedrals. Soothsayer will gain less [faith] but [Church] will gain more than [soothsayer] since now.',
		icon:[19,3,'magixmod'],
		cost:{'insight':1000},
		req:{'Wizard complex':true,'ritualism':true},
	});
		new G.Tech({
		name:'Healing with brews',
		desc:'@[sick],[drunk] will have bigger chance to get recovered. Obtaining this research will unlock new type of [healer] who heals [sick] and [drunk] using medical brews.',
		icon:[19,6,'magixmod'],
		cost:{'insight':650,'wisdom':60},
		req:{'More healing ways':true,'Medicaments brewing':true},
	});
		new G.Tech({
		name:'Laws of physics(basic)',
		desc:'People acknowledged with physics will understand why towers are falling, why thrown up apple will fall down, why water pushes up light objects while heavy objects sink in it.',
		icon:[13,10,'magixmod'],
		cost:{'insight':1000,'science':1},
		effects:[
			{type:'provide res',what:{'education':2}},
		],
		req:{'Intermediate maths':true,'Will to know more':true},
	});
		new G.Tech({
		name:'monument-building II',
		desc:'@unlocks the [temple of heaven,Temple of Heaven], an mid-legacy wonder. Much bigger than [mausoleum], may lead to victory<>',
		icon:[14,10,'magixmod'],
		cost:{'insight':1400,'culture':300,'spirituality':15,'faith':125},
		req:{'construction':true,'burial':true,'culture of the afterlife':true,'Laws of physics(basic)':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Weapon blacksmithery',
		desc:'[blacksmith workshop,Blacksmiths] can now craft [metal weapons] at the same rules as the [metal tools] were.<>',
		icon:[13,11,'magixmod'],
		cost:{'insight':50},
		req:{'smelting':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Armor blacksmithery',
		desc:'[blacksmith workshop,Blacksmiths] can now craft [armor set] at the same rules as the [metal tools] were.<>',
		icon:[12,11,'magixmod'],
		cost:{'insight':50},
		req:{'smelting':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Mo\' floorz',
		desc:'Now each [Blockhouse] will have 6th floor allowing them to fit 10 more [population,People] per [Blockhouse].<>',
		icon:[14,11,'magixmod'],
		cost:{'insight':750,'wisdom':15},
		req:{'Laws of physics(basic)':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Spell of capacity',
		desc:'Smart wizards figured out a spell which will increase maximum food/material storage of [warehouse] , [barn] , [granary] , [storage pit], [stockpile] by 20%.<>',
		icon:[4,1,'magixmod',23,1],
		cost:{'insight':750,'wisdom':15,'Mana':1e5,'Wind essence':3000},
		req:{'Laws of physics(basic)':true},
	});
		new G.Tech({
		name:'Better house construction',
		desc:'At the same land of usage [house] and [Brick house with a silo] will grant bonuses: @ +1 [housing] from [house] every 8 [house]s , @ +1 [housing] from [Brick house with a silo] every 5 [Brick house with a silo,Brick houses].<>',
		icon:[8,11,'magixmod'],
		cost:{'insight':750,'wisdom':15},
		req:{'Laws of physics(basic)':true},
	});
		new G.Tech({
		name:'Farm of the Beet',
		desc:'@Makes [Beet] farm possible to be built.',
		icon:[10,11,'magixmod',24,1],
		cost:{'insight':490,'wisdom':30},
		req:{'Farms in the new land':true},
	});
		new G.Tech({
		name:'prospecting II',
		desc:'@[mine]s can now dig in search of [nickel ore,Nickel] or focus to mine [Granite],[Diorite],[Andesite] with 3x efficiency instead of any prospected mineral.',
		icon:[11,12,'magixmod'],
		cost:{'insight':270},
		req:{'prospecting':true,'mining':true},
	});
		new G.Tech({
		name:'quarrying II',
		desc:'@[quarry] can now dig for [cut granite],[cut diorite],[cut andesite] by new special mode. @<b>"Advanced quarry stone" mode and "Quarry other stones mode(non advanced)" has 1.7% chance to gain 6 to 13 [platinum ore]s .',
		icon:[10,12,'magixmod'],
		cost:{'insight':355},
		req:{'prospecting II':true,'quarrying':true},
	});
		new G.Tech({
		name:'platinum-working',
		desc:'@[furnace]s can now make [platinum ingot]s from [platinum ore]@[blacksmith workshop]s can now forge [platinum block]s out of [platinum ingot]s<>',
		icon:[5,11,'magixmod'],
		cost:{'insight':100},
		req:{'smelting':true,'prospecting II':true},
		effects:[
		],
	});
		new G.Tech({
		name:'nickel-working',
		desc:'@[furnace]s can now make [hard metal ingot]s from [nickel ore].<>',
		icon:[1,12,'magixmod'],
		cost:{'insight':100},
		req:{'smelting':true,'prospecting II':true},
		effects:[
		],
	});
		new G.Tech({
		name:'papercrafting',
		desc:'@unlocks [Paper-crafting shack]. There you can craft: <font color="red">papyrus</font> out of [Sugar cane], @<font color="red">pergamin</font> out of [hide] , [leather] , and <font color="red">common paper</font> out of [Bamboo] with help of secret non-magic recipe.<>',
		icon:[18,12,'magixmod'],
		cost:{'insight':480,'wisdom':5},
		req:{'city planning':true},
		effects:[
		],
	});
		new G.Tech({
		name:'ingredient crafting',
		desc:'Alchemists can now craft a special ingredients for more advanced potions. They will use up [Basic brews] and [misc materials].',
		icon:[17,9,'magixmod'],
		cost:{'insight':500,'wisdom':5},
		req:{'Beginnings of alchemy':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Second portal to new world',
		desc:'After your people heard [The God\'s call] your wizards with help of full of faith people figured out a way to acrivate portal to the Paradise at the top of their latest wonder.',
		icon:[20,3,'magixmod'], //WIP
		cost:{'insight':1595,'culture':300,'Mana':2500,'influence':70,'spirituality':50,'population':1000},
		req:{'Mana brewery':true,'More useful housing':true,'Wizardry':true,'Wizard wisdom':true,'Wizard complex':true,'Belief in portals':true,'First portal to new world':true,'The God\'s call':true,'monument-building II':true},
	});
		new G.Tech({
		name:'<span style="color: ##FF0900">Paradise building</span>',
		desc:'<span style="color: ##FF0900">Unlocks sheet of buildings which can be only built in newly opened <b>Paradise</b>.</span>',
		icon:[19,13,'magixmod'], 
		cost:{'insight':4,'Paradise emblem':1},
		effects:[
			{type:'provide res',what:{'Industry point':1e3}}
		],
		req:{'Second portal to new world':true},
	});
		new G.Tech({
		name:'Dark-essenced ingredients',
		desc:'Unlocks sheet of ingredients made with [Dark essence] as a part of recipe.',
		icon:[20,5,'magixmod'], 
		cost:{'insight':450,'Dark essence':4e3,'wisdom':10},
		req:{'ingredient crafting':true},
	});
		new G.Tech({
		name:'Wind-essenced ingredients',
		desc:'Unlocks sheet of ingredients made with [Wind essence] as a part of recipe.',
		icon:[15,13,'magixmod'], 
		cost:{'insight':450,'Wind essence':4e3,'wisdom':10},
		req:{'ingredient crafting':true},
	});
		new G.Tech({
		name:'Nature-essenced ingredients',
		desc:'Unlocks sheet of ingredients made with [Nature essence] as a part of recipe.',
		icon:[18,13,'magixmod'], 
		cost:{'insight':450,'Nature essence':4e3,'wisdom':10},
		req:{'ingredient crafting':true},
	});
		new G.Tech({
		name:'7th essence',
		desc:'Discovers another essence which can be feeled in Paradise\'s air. Needs some things to be gathered.@unlocks [Holy wizard tower]',
		icon:[20,6,'magixmod',8,12,23,1], 
		cost:{'insight':1300},
		effects:[
			{type:'provide res',what:{'science':2}},
		],
		req:{'Second portal to new world':true,'<span style="color: ##FF0900">Paradise building</span>':true},
	});
		new G.Tech({
		name:'7th complex tower',
		desc:'Due to 7th essence discovered [Wizard Complex] has a need to build up new tower specially for new essence.@More housing and since now [Wizard Complex] will use more [Mana] just to craft new essence too.',
		icon:[20,8,'magixmod'], 
		cost:{'insight':695},
		req:{'7th essence':true,'Wizard complex':true},
	});
		new G.Tech({
		name:'Architects knowledge',
		desc:'[architect,Architects] can now plan for you: [Brick house with a silo] & [Blockhouse] .',
		icon:[21,7,'magixmod'], 
		cost:{'insight':668,'wisdom':2},
		req:{'construction II':true},
	});
		new G.Tech({
		name:'Bookcrafting',
		desc:'[artisan] can craft books.',
		icon:[12,12,'magixmod'], 
		cost:{'insight':325},
		req:{'papercrafting':true},
	});
		new G.Tech({
		name:'Notewriting',
		desc:'[Florist], [Wizard] , [Poet] , (lawyer) will write their notes. Notes can be used to write specified books which may summon some <b>Knowledge</b> traits and turn into [insight].',
		icon:[21,6,'magixmod'], 
		cost:{'insight':300},
		req:{'Bookcrafting':true,'Ink crafting':true},
	});
		new G.Tech({
		name:'Bookwriting',
		desc:'[Florist\'s notes],[Poet\'s notes],[Wizard\'s notes] may now be written into some book.  @unlocks [Lodge of writers] who will convert their notes into books.',
		icon:[12,13,'magixmod'], 
		cost:{'insight':300},
		req:{'Bookcrafting':true,'Ink crafting':true},
	});
		new G.Tech({
		name:'Better influence & authority',
		desc:'Unlocks [Lawyer] and [Mediator]. Mediator will solve conflicts and gain [happiness] from solving them , while [Lawyer] will copy and share code of law.',
		icon:[21,0,'magixmod'], 
		cost:{'insight':1015},
		req:{'Wizard complex':true},
	});
		new G.Tech({
		name:'Ambrosium treeplanting',
		desc:'@Unlocks [Holy orchard] from which you can get [Ambrosium leaf,Ambrosium leaves] .',
		icon:[21,11,'magixmod'], 
		cost:{'insight':1015},
		req:{'<span style="color: ##FF0900">Paradise building</span>':true,'Land acknowledge':true,'Treeplanting':true},
	});
		new G.Tech({
		name:'Ambrosium crafting',
		desc:'@Unlocks [Ambrosium shard shack] which can craft [Ambrosium shard]s with use of [Mana] , [Cloudy water] & [Ambrosium leaf,Ambrosium leaves] of course.',
		icon:[13,14,'magixmod'], 
		cost:{'insight':980},
		req:{'Ambrosium treeplanting':true,'<span style="color: ##FF0900">Paradise building</span>':true},
	});
		new G.Tech({
		name:'Paradise crafting',
		desc:'@Some buildings / crafting shacks from mortal world can be built in Paradise as a separated unit.',
		icon:[0,14,'magixmod',21,15,'magixmod'], 
		cost:{'insight':650},
		req:{'Ambrosium treeplanting':true,'<span style="color: ##FF0900">Paradise building</span>':true},
	});
		new G.Tech({
		name:'Explosive crafting & mining',
		desc:'Unlocks [explosive mine] <b>( not at all, needs [Intelligent blasting] )</b> . You think it is joke but you will quickly get into big mistake. @Unlocks [Pyro-Artisan] (artisan for explosives, which requires mostly [Sulfur] for explosion power). Mines will start gathering some [Sulfur] at <b>any</> of modes chosen. Both [mine] and [Mine of the plain island] can gather it.',
		icon:[20,15,'magixmod'], 
		cost:{'insight':850,'wisdom':10},
		req:{'Ambrosium treeplanting':true,'<span style="color: ##FF0900">Paradise building</span>':true},
	});
		new G.Tech({
		name:'Intelligent blasting',
		desc:'Unlocks [explosive mine] . WIth explosives supplies now miners will be able to... Blast underground. However these mines cannot be [prospecting,prospected] but they still may be turned on/off . These mines have bigger rate of accidents than other ones which do not use explosives to mine undeground.',
		icon:[14,15,'magixmod'], 
		cost:{'insight':850,'science':1,'wisdom':9},
		req:{'Ambrosium treeplanting':true,'<span style="color: ##FF0900">Paradise building</span>':true},
	});
		new G.Tech({
		name:'Bigger potion types pallet',
		desc:'<font color: #93db70">Unlocks more potion types. These are [combat potions] which has a needle and grip so they are throwable and may be use in defense battle, unlocks a [Jar for concoctions,concoctions] used to craft other potions. <b>Unlocks stand which allows to craft pots for these types of potion out of [Potion pot] .</b></font>',
		icon:[21,16,'magixmod'], 
		cost:{'insight':850,'science':1,'wisdom':9},
		req:{'Alcohol brewing':true,'Medicaments brewing':true,'Beginnings of alchemy':true,'<span style="color: ##FF0900">Paradise building</span>':true},
	});
		new G.Tech({
		name:'Combat potion & concoction brewing',
		desc:'<font color: #93db70">Allows to craft basic 4 combat potions and 2 concoctions. Uses crafted by [ingredient crafting stand] workers ingredients. <b>Unlocks stands which may brew these potions but there is chance that accident will occur during work.</b></font>',
		icon:[20,16,'magixmod'], 
		cost:{'insight':850,'science':1,'wisdom':9},
		req:{'Alcohol brewing':true,'Medicaments brewing':true,'Beginnings of alchemy':true,'<span style="color: ##FF0900">Paradise building</span>':true},
	});
		new G.Tech({
		name:'Dark wonder',
		desc:'<font color:#000000>Unlocks dark wonder...</font>',
		icon:[22,3,'magixmod'], 
		cost:{'insight':770,'science':1,'wisdom':9},
		req:{'<span style="color: red">Revenants</span>':true},
	});
		new G.Tech({
		name:'Hope of revenant abandoning',
		desc:'<font color:#000000>Happiness harm from [wild corpse] and corpses is HALVED.</font>',
		icon:[22,5,'magixmod'], 
		cost:{'insight':955,'science':1,'wisdom':9,'Dark skull construction point':250},
		req:{'<span style="color: red">Revenants</span>':true,'Dark wonder':true},
	});
		new G.Tech({
		name:'Better papercrafting recipe',
		desc:'Multiplies amount of [Paper] crafted in shacks by 40%. If you go into moderating culture you obtain additional 8%, while in joy path just 4%.',
		icon:[8,12,14,12,'magixmod',21,15,'magixmod'], 
		cost:{'insight':846,'wisdom':9},
		req:{'papercrafting':true,'Poetry':true},
	});
		new G.Tech({
		name:'Art of cooking',
		desc:'<font color="fuschia">Unlocks [Chef] . Talented with art of cooking worker may make tasty and very decent food [Meals] . A [Meals,Meal] makes people even happier</font>',
		icon:[23,13,'magixmod'], 
		cost:{'insight':535,'wisdom':30,'culture':400,'inspiration':200},
		req:{'Cooking':true},
	});
		new G.Tech({
		name:'Farm of wheat',
		desc:'Unlocks [Wheat farm] . Then it may be converted into [flour] .',
		icon:[23,12,'magixmod'], 
		cost:{'insight':420},
		req:{'Cooking':true},
	});
		new G.Tech({
		name:'Flour-crafting',
		desc:'<li>Unlocks [Windmill].</li>',
		icon:[22,11,'magixmod'], 
		cost:{'insight':685},
		req:{'Farm of wheat':true},
	});
		new G.Tech({
		name:'Baking',
		desc:'<li>Unlocks [Bakery].</li>',
		icon:[22,12,'magixmod'], 
		cost:{'insight':890},
		req:{'Flour-crafting':true},
	});
		let battlingThieves = new G.Tech({
           name:'Battling thieves',
           desc:'Bad news... committed a crime... It is time to fight against [thief,thieves] . @Allows you to hire a [Thief hunter] .',
           icon:[22, 16, "magixmod"],
           cost:{'insight':90},
            req:{'hunting':true,'tribalism':false},
        effects:[]//manual unlocking blocker
    });
function autobuy(newBuy) {
  if(!G.techsOwnedNames.includes(battlingThieves.name) && newBuy >= 89) G.gainTech(battlingThieves)
}
G = new Proxy(G, {
  set: (src, prop, value) => {
    if(prop === "year")
      autobuy(src[prop])
    return Reflect.set(src, prop, value)
  }
})
autobuy(G.year)
		new G.Tech({
		name:'Cultural forces arise',
		desc:'Makes [Fortress of cultural legacy] gather [culture] per tick.',
		icon:[22,17,'magixmod'], 
		cost:{'insight':70,'Fortress construction point':200},
		req:{'Cultural roots':true},
	});
		new G.Tech({
		name:'Politic power rising up',
		desc:'Makes [Pagoda of Democracy] gather [influence] per tick. Increases gaining of [influence,political] units by 5% for the rest of current run.',
		icon:[21,17,'magixmod'], 
		cost:{'insight':25,'Pagoda construction point':200},
		req:{'Political roots':true},
	});
		new G.Tech({
		name:'Knowledgeable',
		desc:'Makes [Complex of Dreamers] gather [insight] per tick. In addition adds 7500 [housing] . Let it have something from the [Wizard Complex]',
		icon:[23,17,'magixmod'], 
		cost:{'Complex construction point':200},
		effects:[
			{type:'provide res',what:{'housing':7500}}
		],
		req:{'Roots of insight':true},
	});
		new G.Tech({
		name:'Water filtering',
		desc:'Obtaining this tech will make you fulfill one of two requirements to start cleaning [muddy water] and making [water] from it. <>Another one is obtaining [<font color="maroon">Caretaking</font>] or [<font color="maroon">Moderation</font>] .',
		icon:[25,16,'magixmod'], 
		cost:{'insight':30},
		req:{'bows':true,'<font color="yellow">A gift from the Mausoleum</font>':true},//IK it seems strange but i wanted to make it equal to other tech at tech tier tree
	});
		new G.Tech({
		name:'Filtering with better quality',
		desc:'Water filtrating units that can convert [muddy water] into the [water] ([Water filter] and [;Water filter,its moderated version]) work at the 175% of their normal efficiency.',
		icon:[25,15,'magixmod'], 
		cost:{'insight':520,'wisdom':15},
		req:{'Water filtering':true,'Burial in new world':true},
	});
		new G.Tech({
		name:'Non-magical filters improvement',
		desc:'Water filtrating units that can convert [muddy water] into the [water] ([Water filter] and [;Water filter,its moderated version]) work at the 175% of their current efficiency. <><i>But it still spoils</i>',
		icon:[25,14,'magixmod'], 
		cost:{'insight':405,'wisdom':15},
		req:{'Filtering with better quality':true,'Mo\' floorz':true},
	});
		new G.Tech({
		name:'Cloudy water filtering',
		desc:'Obtaining this tech will open a way for you to make [Cloudy water] become a [water] .<>While converting [Cloudy water] into [water] you may obtain small pieces of [cloud] .',
		icon:[25,13,'magixmod'], 
		cost:{'insight':120,'wisdom':30,'water':-210},
		req:{'Water filtering':true,'Paradise crafting':true}
	});
		new G.Tech({
		name:'Faithful cloudy water filtering',
		desc:'Obtaining this tech will make filters that work on [Cloudy water] 175% more efficient .<>While converting [Cloudy water] into [water] you may obtain small pieces of [cloud] . This upgrade will increase rate of it.',
		icon:[25,10,'magixmod'], 
		cost:{'insight':710,'wisdom':50,'faith':180,'cloud':550},
		req:{'God\'s trait #1 Housing':true}
	});
		new G.Tech({
		name:'Magical filtering way',
		desc:'Obtaining this tech will make filters that convert [Cloudy water] or [muddy water] work 175% more efficient .<>Upkeep cost won\'t grow up so do not worry. These are all upgrades you can currently obtain for filtering.',
		icon:[25,8,'magixmod'], 
		cost:{'insight':1200,'wisdom':25,'Wind essence':775,'cloud':1990},
		req:{'God\'s trait #1 Housing':true,'God\'s trait #2 Berry rush':true,'Faithful cloudy water filtering':true}
	});
