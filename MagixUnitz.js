//UNITS
//Unit gets converted. Needed to make mine collapsions possible or other wasting with wounding people and else things
	var unitGetsConverted=function(into,min,max,message,single,plural)
	{
		//the unit is destroyed and its workers are converted into something else (such as wounded or dead)
		//min and max define the random percent of the unit's amount that gets wounded every day
		return function(me)
		{
			var toChange=Math.min(1,Math.random()*(max-min)+min);
			toChange=randomFloor(me.amount*toChange);
			var workers=0;
			if (me.mode && me.mode.use && me.mode.use['worker']) workers+=me.mode.use['worker'];
			if (me.unit.use['worker']) workers+=me.unit.use['worker'];
			if (me.unit.staff['worker']) workers+=me.unit.staff['worker'];
			if (toChange>0 && workers>0)
			{
				peopleToChange=toChange*workers;
				var changed=0;
				if (true) {var i='adult';var n=G.lose(i,peopleToChange);changed+=n;}
				if (changed<peopleToChange && G.checkPolicy('elder workforce')=='on') {var i='elder';var n=G.lose(i,peopleToChange);changed+=n;}
				if (changed<peopleToChange && G.checkPolicy('child workforce')=='on') {var i='child';var n=G.lose(i,peopleToChange);changed+=n;}
				
				for (var i in into)
				{
					G.gain(i,randomFloor(changed*into[i]),me.unit.displayName+' accident');
				}
				changed/=workers;
				G.wasteUnit(me,changed);
				
				if (changed>0) G.Message({type:'bad',mergeId:'unitGotConverted-'+me.unit.name,textFunc:function(args){
						return args.str.replaceAll('\\[people\\]',(args.n==1?args.single:args.plural)).replaceAll('\\[X\\]',B(args.n));
					},args:{n:changed,str:message,single:single,plural:plural},icon:me.unit.icon});
			}
		}
	}
	//Units for real
		new G.Unit({
		name:';Cloudy water filter',
		displayName:'Cloudy water filter',
		desc:'A filter that uses [Land of the Paradise] and a worker. As his upkeep uses [coal] and [Mana] you gain 82% of converted water. <>Moderation path unit. Has research techs that can improve power and efficiency of the [;Cloudy water filter] <>Conversion: [Cloudy water] into [water]',
		icon:[25,11,'magixmod'],
		cost:{'basic building materials':275},
		upkeep:{'coal':1,'Mana':1.5},
		use:{'worker':1,'Land of the Paradise':1,'Industry point':1},
		req:{'<font color="maroon">Moderation</font>':true,'Water filtering':true},
		category:'paradiseunit',
		effects:[
			{type:'convert',from:{'Cloudy water':37},into:{'water':28,'cloud':2},every:1},
			{type:'mult',value:1.75,req:{'Filtering with better quality':true}},
			{type:'mult',value:1.75,req:{'Magical filtering way':true}},
		],
	});
		new G.Unit({
		name:'Cloudy water filter',
		desc:'A filter that uses [Land of the Paradise] and a worker. As his upkeep uses [sand] and [Mana] you gain 95% of converted water. <>Caretaking path unit. Has research techs that can improve power and efficiency of the [Cloudy water filter] <>Conversion: [Cloudy water] into [water]',
		icon:[25,12,'magixmod'],
		cost:{'basic building materials':75},
		upkeep:{'sand':1,'Mana':1},
		use:{'worker':1,'Land of the Paradise':0.75,'Industry point':0.5},
		req:{'<font color="maroon">Caretaking</font>':true,'Water filtering':true},
		category:'paradiseunit',
		effects:[
			{type:'convert',from:{'Cloudy water':15},into:{'water':14,'cloud':1},every:1},
			{type:'mult',value:1.75,req:{'Filtering with better quality':true}},
			{type:'mult',value:1.75,req:{'Magical filtering way':true}},
		],
	});
		new G.Unit({
		name:';Water filter',
		displayName:'Water filter',
		desc:'A filter that uses land and a worker. As his upkeep uses [coal] you gain 82% of converted water. <>Moderation path unit. Has research techs that can improve power and efficiency of the [;Water filter] <>Conversion: [muddy water] into [water]',
		icon:[24,16,'magixmod'],
		cost:{'basic building materials':275},
		upkeep:{'coal':1},
		use:{'worker':1,'land':1},
		req:{'<font color="maroon">Moderation</font>':true,'Water filtering':true},
		category:'crafting',
		effects:[
			{type:'convert',from:{'muddy water':37},into:{'water':28},every:1},
			{type:'mult',value:1.75,req:{'Filtering with better quality':true}},
			{type:'mult',value:1.75,req:{'Non-magical filters improvement':true}},
			{type:'mult',value:1.75,req:{'Magical filtering way':true}},
		],
	});
		new G.Unit({
		name:'Water filter',
		desc:'A filter that uses land and a worker. As his upkeep uses [sand] you gain 95% of converted water. <>Caretaking path unit. Has research techs that can improve power and efficiency of the [Water filter] <>Conversion: [muddy water] into [water]',
		icon:[23,16,'magixmod'],
		cost:{'basic building materials':75},
		upkeep:{'sand':1},
		use:{'worker':1,'land':0.75},
		req:{'<font color="maroon">Caretaking</font>':true,'Water filtering':true},
		category:'crafting',
		effects:[
			{type:'convert',from:{'muddy water':15},into:{'water':14},every:1},
			{type:'mult',value:1.75,req:{'Filtering with better quality':true}},
			{type:'mult',value:1.75,req:{'Non-magical filters improvement':true}},
			{type:'mult',value:1.75,req:{'Magical filtering way':true}},
		],
	});
		new G.Unit({
		name:'Thief hunter',
		desc:'Hunts for a Thieves and neutralizes them. Has a chance to become wounded while fighting a thief. //<span style "color=fuschia">Can neutralize a thief to make him fear of commiting next crime but has a small chance to make a [corpse] out of a bad guy</span>',
		icon:[4,13,'magixmod'],
		cost:{},
		use:{'worker':1,'metal weapons':1,'armor set':1},
		req:{'Battling thieves':true},
		category:'guard',
		priority:5,
		effects:[
			{type:'convert',from:{'thief':1},into:{'adult':1},every:4,chance:1/4},
			{type:'convert',from:{'thief':1},into:{'corpse':1},every:4,chance:1/48},
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.03,'[X] [people] wounded while encountering a thief.','thief hunter was','thieve hunters were'),chance:1/30},
		],
	});
		new G.Unit({
		name:'Bakery',
		desc:'<font color=" ##FF7F50">@converts crafted by [Windmill] [flour] into [bread]. Requires fuel to work.</font>',
		icon:[24,10,'magixmod'],
		cost:{'basic building materials':100},
		use:{'land':1,'Instructor':1},
		require:{'worker':2,'metal tools':2},
		upkeep:{'log':0.6},
		effects:[
			{type:'convert',from:{'flour':18},into:{'bread':6},every:4,repeat:3},
		],
		req:{'Baking':true},
		category:'crafting',
	});
		new G.Unit({
		name:'Windmill',
		desc:'@An unit which can convert [wheat] into [flour] .',
		icon:[24,11,'magixmod'],
		cost:{'basic building materials':600},
		req:{'Flour-crafting':true},
		use:{'worker':2,'land':1},
		upkeep:{},
		category:'production',
		effects:[
			{type:'convert',from:{'wheat':6,'water':1},into:{'flour':5},every:3,repeat:2},
		],
	});
		new G.Unit({
		name:'Wheat farm',
		desc:'@Special for [wheat] . Without [wheat] it is impossible to craft [bread].',
		icon:[24,12,'magixmod'],
		cost:{},
		req:{'Farm of wheat':true},
		use:{'worker':8,'land':15},
		upkeep:{'water':14},
		category:'production',
		effects:[
			{type:'gather',context:'gather',what:{'wheat':230}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on'}}
		],
	});
		new G.Unit({
		name:'Chef',
		desc:'[Chef] is a unit that can make even tastier and more enjoyable [food] out of [food,various food types] . <font color="fuschia"><b>You gotta believe!</b></font>',
		icon:[24,13,'magixmod'],
		cost:{},
		use:{'land':1,'worker':1},
		upkeep:{'fire pit':0.2,'food':0.2},
		modes:{
			'off':G.MODE_OFF,
			'bigos':{name:'Bigos',icon:[23,15,'magixmod'],desc:'Crafts bigos with use of [vegetable] ,[cured meat] and [herb] as spice.',req:{'Art of cooking':true}},
			'spagh':{name:'Spaghetti',icon:[23,14,'magixmod'],desc:'Tasty spaghetti.',req:{'Art of cooking':true}},
			'meatb':{name:'Meatballs',icon:[24,15,'magixmod'],desc:'Meatballs. Uses [cooked meat] and [vegetable] .',req:{'Art of cooking':true}},
			'baked':{name:'Baked sandwich',icon:[24,14,'magixmod'],desc:'Baked sandwich. Uses [bread] and [vegetable] .',req:{'Art of cooking':true}},
			'shash':{name:'Shashlik',icon:[22,14,'magixmod'],desc:'Shashlik. Uses [cooked meat] , [vegetable] and [stick]s.',req:{'Art of cooking':true}},
			'spice':{name:'Spiced meat',icon:[22,15,'magixmod'],desc:'Spiced meat. Uses [cooked meat] and [herb] as spice for meat. Does same with [cooked seafood] at the time.',req:{'Art of cooking':true}},
		},
		effects:[
			{type:'convert',from:{'cooked meat':1.5,'cooked seafood':1.5,'herb':1.5},into:{'Meals':3},every:5,mode:'spice'},
			{type:'convert',from:{'cooked meat':1,'vegetable':1,'stick':0.75},into:{'Meals':2},every:6,mode:'shash'},
			{type:'convert',from:{'bread':2,'vegetable':1},into:{'Meals':3},every:5,mode:'baked'},
			{type:'convert',from:{'cooked meat':0.5,'cooked seafood':0.5,'vegetable':0.5},into:{'Meals':2},every:4,mode:'meatb'},
			{type:'gather',what:{'Meals':1},mode:'spagh'},
			{type:'convert',from:{'cooked meat':1.5,'cooked seafood':1.5,'herb':1.5},into:{'Meals':3},every:5,mode:'bigos'},
		],
		req:{'Cooking':true},
		gizmos:true,
		category:'crafting',
	});
		new G.Unit({
		name:'Concoctions crafting stand',
		desc:'There you can craft [Jar for concoctions,Concoctions] which are not so safe. At stand there are recipes already but you will decide who you will hire. No accident chance there.</span>',
		icon:[15,16,'magixmod'],
		cost:{},
		use:{'Alchemy zone':0.3},
		upkeep:{},
		modes:{
			'off':G.MODE_OFF,
			'ha':{name:'Hire adult alchemist',icon:[12,5,'magixmod'],desc:'Hires adult alchemist to the stand. ',use:{'Alchemist':1,'stone tools':1}},
			'hc':{name:'Hire child alchemist',icon:[12,7,'magixmod'],desc:'Hires child alchemist to the stand. ',use:{'Child alchemist':1,'stone tools':1},req:{'Alchemy for children':'on'}},
		},
		effects:[
			{type:'convert',from:{'Jar for concoctions':1,'water':0.4,'Dark essence':2,'Dark fire pit':0.5},into:{'Dark concoction':1},every:6,mode:'ha'},
			{type:'convert',from:{'Jar for concoctions':1,'water':0.6,'Nature essence':2,'Scobs of life':0.5,'Water essence':0.2},into:{'Nature concoction':1},every:6,mode:'ha'},
			{type:'convert',from:{'Jar for concoctions':1,'water':0.4,'Dark essence':2,'Dark fire pit':0.5},into:{'Dark concoction':1},every:6,mode:'hc'},
			{type:'convert',from:{'Jar for concoctions':1,'water':0.6,'Nature essence':2,'Scobs of life':0.5,'Water essence':0.2},into:{'Nature concoction':1},every:6,mode:'hc'},
		],
		req:{'Combat potion & concoction brewing':true},
		gizmos:true,
		category:'alchemy',
	});
		new G.Unit({
		name:'Combat potions brewing stand',
		desc:'There you can craft [combat potions] which are not so safe. Alchemists are creative people who name their creations with creative names.<span style "color:red">Warning! Some modes has a chance to accidents wounding a worker</span>',
		icon:[14,16,'magixmod'],
		cost:{},
		use:{'Alchemy zone':0.3},
		upkeep:{},
		modes:{
			'off':G.MODE_OFF,
			'bf':{name:'Black fog',icon:[11,16,'magixmod'],desc:'Crafts [Black fog]. <span style "color=red">Beware of accidents. Chance low, depends on policy choices.</span>',use:{'Alchemist':1,'stone tools':1}},
			'ws':{name:'Windy spikes',icon:[9,16,'magixmod'],desc:'Crafts [Windy spikes]. <span style "color=red">Beware of accidents. Chance low, depends on policy choices.</span>',use:{'Alchemist':1,'stone tools':1}},
			'btg':{name:'Back to grave',icon:[8,16,'magixmod'],desc:'Crafts [Back to grave]. <span style "color=green">No chance of accidents</span>',use:{'Alchemist':1,'stone tools':1}},
			'pov':{name:'Point of venom',icon:[10,16,'magixmod'],desc:'Crafts [Point of venom]. <span style "color=green">No chance of accidents</span>',use:{'Alchemist':1,'stone tools':1}},
		},
		effects:[
			{type:'convert',from:{'Dark concoction':1,'Combat potion pot':1,'water':0.4,'Dark essence':0.2,'Dark fire pit':0.5},into:{'Black fog':1},every:6,mode:'bf'},
			{type:'function',func:unitGetsConverted({'wounded alchemist':1},0.001,0.01,'[X] [people] alchemy accident occured wounding the alchemist','alchemy accidents occured wounding the alchemists'),chance:1/388,mode:'bf','School of Alchemy - length of education cycle':'short'},
			{type:'function',func:unitGetsConverted({'wounded alchemist':1},0.001,0.01,'[X] [people] alchemy accident occured wounding the alchemist','alchemy accidents occured wounding the alchemists'),chance:1/578,mode:'bf','School of Alchemy - length of education cycle':'medium'},
			{type:'function',func:unitGetsConverted({'wounded alchemist':1},0.001,0.01,'[X] [people] alchemy accident occured wounding the alchemist','alchemy accidents occured wounding the alchemists'),chance:1/769,mode:'bf','School of Alchemy - length of education cycle':'long'},
			
			{type:'convert',from:{'Combat potion pot':1,'water':1,'Wind essence':3,'Windy sugar':1},into:{'Windy spikes':1},every:6,mode:'ws'},
			{type:'function',func:unitGetsConverted({'wounded alchemist':1},0.001,0.01,'[X] [people] alchemy accident occured wounding the alchemist','alchemy accidents occured wounding the alchemists'),chance:1/300,mode:'ws','School of Alchemy - length of education cycle':'short'},
			{type:'function',func:unitGetsConverted({'wounded alchemist':1},0.001,0.01,'[X] [people] alchemy accident occured wounding the alchemist','alchemy accidents occured wounding the alchemists'),chance:1/450,mode:'ws','School of Alchemy - length of education cycle':'medium'},
			{type:'function',func:unitGetsConverted({'wounded alchemist':1},0.001,0.01,'[X] [people] alchemy accident occured wounding the alchemist','alchemy accidents occured wounding the alchemists'),chance:1/600,mode:'ws','School of Alchemy - length of education cycle':'long'},
			
			{type:'convert',from:{'Combat potion pot':1,'water':1,'Wind essence':1,'Essence of the Holiness':1.25},into:{'Back to grave':1},every:6,mode:'btg'},
			{type:'convert',from:{'Herb of the undead':1,'water':1,'Dark essence':1,'Nature concoction':1},into:{'Point of venom':1},every:6,mode:'pov'},
		],
		req:{'Combat potion & concoction brewing':true},
		gizmos:true,
		category:'alchemy',
	});
		new G.Unit({
		name:'Combat potions brewing stand (child stand)',
		desc:'There you can craft [combat potions] which are not so safe. Alchemists are creative people who name their creations with creative names.<span style "color:red">Warning! Some modes has a chance to accidents wounding a worker. Chance is even more increased while children work</span>',
		icon:[14,16,'magixmod'],
		cost:{},
		use:{'Alchemy zone':0.3},
		upkeep:{},
		modes:{
			'off':G.MODE_OFF,
			'bf':{name:'Black fog',icon:[11,16,'magixmod'],desc:'Crafts [Black fog]. <span style "color=red">Beware of accidents. Chance low, depends on policy choices.</span>',use:{'Child alchemist':1,'stone tools':1}},
			'ws':{name:'Windy spikes',icon:[9,16,'magixmod'],desc:'Crafts [Windy spikes]. <span style "color=red">Beware of accidents. Chance low, depends on policy choices.</span>',use:{'Child alchemist':1,'stone tools':1}},
			'btg':{name:'Back to grave',icon:[8,16,'magixmod'],desc:'Crafts [Back to grave]. <span style "color=green">No chance of accidents</span>',use:{'Child alchemist':1,'stone tools':1}},
			'pov':{name:'Point of venom',icon:[10,16,'magixmod'],desc:'Crafts [Point of venom]. <span style "color=green">No chance of accidents</span>',use:{'Child alchemist':1,'stone tools':1}},
		},
		effects:[
			{type:'convert',from:{'Dark concoction':1,'Combat potion pot':1,'water':0.4,'Dark essence':0.2,'Dark fire pit':0.5},into:{'Black fog':1},every:6,mode:'bf'},
			{type:'function',func:unitGetsConverted({'wounded alchemist':1},0.001,0.01,'[X] [people] alchemy accident occured wounding the child alchemist','alchemy accidents occured wounding the child alchemists'),chance:1/348,mode:'bf','School of Alchemy - length of education cycle':'short'},
			{type:'function',func:unitGetsConverted({'wounded alchemist':1},0.001,0.01,'[X] [people] alchemy accident occured wounding the child alchemist','alchemy accidents occured wounding the child alchemists'),chance:1/519,mode:'bf','School of Alchemy - length of education cycle':'medium'},
			{type:'function',func:unitGetsConverted({'wounded alchemist':1},0.001,0.01,'[X] [people] alchemy accident occured wounding the child alchemist','alchemy accidents occured wounding the child alchemists'),chance:1/690,mode:'bf','School of Alchemy - length of education cycle':'long'},
			
			{type:'convert',from:{'Combat potion pot':1,'water':1,'Wind essence':3,'Windy sugar':1},into:{'Windy spikes':1},every:6,mode:'ws'},
			{type:'function',func:unitGetsConverted({'wounded alchemist':1},0.001,0.01,'[X] [people] alchemy accident occured wounding the child alchemist','alchemy accidents occured wounding the child alchemists'),chance:1/277,mode:'ws','School of Alchemy - length of education cycle':'short'},
			{type:'function',func:unitGetsConverted({'wounded alchemist':1},0.001,0.01,'[X] [people] alchemy accident occured wounding the child alchemist','alchemy accidents occured wounding the child alchemists'),chance:1/400,mode:'ws','School of Alchemy - length of education cycle':'medium'},
			{type:'function',func:unitGetsConverted({'wounded alchemist':1},0.001,0.01,'[X] [people] alchemy accident occured wounding the child alchemist','alchemy accidents occured wounding the child alchemists'),chance:1/533,mode:'ws','School of Alchemy - length of education cycle':'long'},
			
			{type:'convert',from:{'Combat potion pot':1,'water':1,'Wind essence':1,'Essence of the Holiness':1.25},into:{'Back to grave':1},every:8,mode:'btg'},
			{type:'convert',from:{'Herb of the undead':1,'water':1,'Dark essence':1,'Nature concoction':1},into:{'Point of venom':1},every:8,mode:'pov'},
		],
		req:{'Combat potion & concoction brewing':true},
		gizmos:true,
		category:'alchemy',
	});
		new G.Unit({
		name:'Specified potter (alchemy)',
		desc:'@Converts [Potion pot] into [Combat potion pot]. Can craft [Jar for concoctions,Jars for concoctions].',
		icon:[19,16,'magixmod'],
		cost:{},
		use:{'worker':1,'metal tools':1,'Alchemy zone':0.3},
		upkeep:{},
		effects:[
			{type:'convert',from:{'Potion pot':1,'clay':1,'hard metal ingot':0.02},into:{'Combat potion pot':1},repeat:1,every:3},
			{type:'convert',from:{'clay':8,'mud':2},into:{'Jar for concoctions':1},repeat:1,every:3},
		],
		req:{'Bigger potion types pallet':true},
		category:'alchemy',
	});
	new G.Unit({
		name:'explosive mine',
		desc:'@extracts ores, [coal] and [stone] out of the ground using <span style="color: #FF002a"> Dynamite</span> . <span style="color: #FF002a">Has even bigger chances to collapse due to used in work material</span>The workers in [mine]s blasts deep into the earth to provide all kinds of minerals. @cannot be [prospecting,prospected] like normal [mine] .',
		icon:[16,15,'magixmod'],
		cost:{'archaic building materials':400},
		use:{'land':3},
		upkeep:{'fire pit':0.1,'Light explosives':4,'Thread':8,'Sulfur':1},
		modes:{
			'off':G.MODE_OFF,
			'on':{name:'Active',icon:[8,8],desc:'<span style="color: ##FFa000">Mining with explosives will be activated.</span>',use:{'worker':3,'stone tools':3}},
		},
		effects:[
			{type:'gather',context:'mine',amount:28,max:64,mode:'on'},
			{type:'function',func:unitGetsConverted({'wounded':2},0.001,0.01,'[X] [people].','mine collapsed because of underground explosives blasting, wounding its miners','mines collapsed because of underground explosives blasting, wounding their miners.'),chance:7/50}
		],
		gizmos:true,
		req:{'mining':true,'Intelligent blasting':true},
		category:'production',
	});
		new G.Unit({
		name:'paper-crafting shack',
		desc:'Allows to make [Paper] You can choose between 3 types of paper: <li>papyrus</li> <li>pergamin</li> <li>common paper</li> <font="color: ##FF6B40">It is paradise version of this shack and works at same rates as its mortal bro.</font>',
		icon:[0,12,'magixmod',20,14,'magixmod'],
		cost:{'basic building materials':800},
		use:{'Land of the Paradise':0.7,'Industry point':0.05},
		gizmos:true,
		modes:{
			'off':G.MODE_OFF,
			'papyrus':{name:'Papyrus',icon:[15,12,'magixmod'],desc:'Gain mainly <b>papyrus</b> out of this shack. To craft <b>papyrus</b>, [worker] will use [Sugar cane] .',use:{'worker':1,'stone tools':1}},
			'pergamin':{name:'Pergamin',icon:[16,12,'magixmod'],desc:'Gain mainly <b>pergamin</b> out of this shack. To craft <b>pergamin</b> , [worker] will use [hide] or [leather] .',use:{'worker':1,'stone tools':1}},
			'commonpaper':{name:'Common paper',icon:[17,12,'magixmod'],desc:'Craft <b>common paper</b> out of [Bamboo] with help of secret non-magic recipe.',use:{'worker':1,'stone tools':1}},
		},
		effects:[
			{type:'convert',from:{'Sugar cane':3.4},into:{'Paper':1.5},every:1,mode:'papyrus'},
			{type:'convert',from:{'hide':1.75},into:{'Paper':1.15},every:4,mode:'pergamin'},
			{type:'convert',from:{'leather':1.5},into:{'Paper':1.15},every:4,mode:'pergamin'},
			{type:'convert',from:{'Bamboo':4},into:{'Paper':1.4},every:2,mode:'commonpaper'},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on'}},
			{type:'mult',value:1.44,req:{'Better papercrafting recipe':'true','joy of eating':true}},
			{type:'mult',value:1.44,req:{'Better papercrafting recipe':'true','culture of moderation':true}}
		],
		req:{'papercrafting':true,'Paradise crafting':true},
		category:'paradiseunit',
	});
		new G.Unit({
		name:'Pyro-Artisan',
		desc:'@This subclass of [artisan] can craft explosives. In default he will craft [Light explosives]. Deliver a lot of [Sulfur] to this guy... without it how is he supposed to craft TNT or other <b>boomer</b> ?',
		icon:[15,15,'magixmod'],
		cost:{},
		use:{},
		gizmos:true,
		modes:{
			'explosivesS':{name:'Craft light explosives',icon:[19,15,'magixmod'],desc:'This [Pyro-Artisan] will craft some [Light explosives] with use of [Paper] , [Sulfur] , [Thread]',use:{'worker':1}},
			//Medium explosives COMING SOON
			//Essenced explosives COMING LATER
			//Vortex TNT COMING EVEN LATER
			//Nuke NEVER, EVER COMING NOT SOON AND NOT LATE
		},
		effects:[
			{type:'convert',from:{'Sulfur':3,'Paper':2,'Thread':3},into:{'Light explosives':1.25},every:2,repeat:2,mode:'explosivesS'},
		],
		req:{'Explosive crafting & mining':true},
		category:'crafting',
	});
		new G.Unit({
		name:'Holy orchard',
		desc:'An orchard with planted trees with ambrosium leaves which are most common type of trees in new world. Gathers falling [Ambrosium leaf,Ambrosium leaves]<>',
		icon:[4,14,'magixmod'],
		cost:{'basic building materials':900},
		use:{'Land of the Paradise':50,'Industry point':5},
		staff:{'worker':10},
		upkeep:{'Cloudy water':30},
		effects:[
			{type:'gather',what:{'Ambrosium leaf':40}},
		],
		req:{'Ambrosium treeplanting':true,'<span style="color: ##FF0900">Paradise building</span>':true},
		category:'paradiseunit',
	});
		new G.Unit({
		name:'Ambrosium shard shack',
		desc:'A shack where out of [Ambrosium leaf] not one but many and some [Mana] <b>and</b> [Cloudy water] you can gain [Ambrosium shard] which may find its use later.<>',
		icon:[15,14,'magixmod'],
		cost:{'basic building materials':900},
		use:{'Land of the Paradise':1},
		staff:{'worker':1},
		effects:[
			{type:'convert',from:{'Ambrosium leaf':75,'Cloudy water':5,'Essence of the Holiness':4,'Mana':8},into:{'Ambrosium shard':1},every:4},
		],
		req:{'Ambrosium treeplanting':true,'<span style="color: ##FF0900">Paradise building</span>':true,'Ambrosium crafting':true},
		category:'paradiseunit',
	});
		new G.Unit({
		name:'hardened warehouse',
		desc:'@provides 6000 [material storage] .<>A large building for storing materials. Staffed with two guards to prevent theft even if it will be constructed in Paradise.',
		icon:[2,14,'magixmod'],
		cost:{'basic building materials':900},
		use:{'Land of the Paradise':3,'Industry point':0.2},
		staff:{'worker':2},
		effects:[
			{type:'provide',what:{'added material storage':6000}},
			{type:'waste',chance:0.001/1000}
		],
		req:{'stockpiling':true,'construction':true,'<span style="color: ##FF0900">Paradise building</span>':true},
		category:'paradiseunit',
	});
		new G.Unit({
		name:'Guru',
		desc:'@The one who can gain Insight^2 so in short we can say it is... [science,Science] used to much more complicated researches.',
		icon:[6,14,'magixmod'],
		cost:{},
		use:{'worker':1},
		limitPer:{'population':1e5},
		effects:[
			{type:'gather',what:{'insight':0.3}},
			{type:'gather',what:{'science':0.00005}},
		],
		req:{'God\'s trait #3 Science^2':true},
		category:'discovery',
	});
		new G.Unit({
		name:'Floored warehouse',
		desc:'@provides 3000 [material storage] and 3000 [food storage] .<>A large building for storing materials and food. Staffed with four guards to prevent theft even if it will be constructed in Paradise.',
		icon:[5,14,'magixmod'],
		cost:{'basic building materials':8500},
		use:{'Land of the Paradise':4,'Industry point':0.2},
		staff:{'worker':4},
		effects:[
			{type:'provide',what:{'added material storage':3000}},
			{type:'provide',what:{'food storage':3000}},
			{type:'waste',chance:0.001/1000}
		],
		req:{'stockpiling':true,'construction':true,'<span style="color: ##FF0900">Paradise building</span>':true},
		category:'paradiseunit',
	});
		new G.Unit({
		name:'Lawyer', 
		desc:'Lawyer will share code of law to people and comparing people\'s decisions with code of law.',
		icon:[10,13,'magixmod'],
		cost:{},
		use:{'worker':1},
		effects:[
			{type:'convert',from:{'Paper':14,'Ink':8},into:{'Lawyer\'s notes':1},every:11,req:{'Notewriting':true},chance:1/4}
       		],
		req:{'Better influence & authority':true},
		category:'political',
		limitPer:{'population':400},
	});
		new G.Unit({
		name:'Mediator',
		desc:'Solves people\' argues with help of law to prevent prisoning people. Generates happiness every now and then.',
		icon:[9,13,'magixmod'],
		cost:{},
		upkeep:{'food':0.2},
		effects:[
			{type:'gather',what:{'happiness':0.1}},
		],
		use:{'worker':1},
		req:{'Better influence & authority':true},
		category:'political',
		limitPer:{'population':600},
	});
		new G.Unit({
		name:'Lodge of writers',
		desc:'There writers will write books. Sources of information contained in them are notes of people from many jobs(manuals for instance).',
		icon:[11,13,'magixmod'],
		cost:{'basic building materials':700},
		use:{'land':1,'worker':7},
		effects:[
			{type:'convert',from:{'Florist\'s notes':1,'Empty book':1,'Ink':15},into:{'nature book':1},every:12},
			{type:'convert',from:{'Poet\'s notes':1.05,'Empty book':1,'Ink':16},into:{'novel':1},every:13},
			{type:'convert',from:{'Wizard\'s notes':1,'Empty book':1,'Ink':15},into:{'spellbook':1},every:12},
			{type:'convert',from:{'Lawyer\'s notes':1,'Empty book':1,'Ink':15},into:{'Book of law':1},every:12},
		],
		req:{'Bookwriting':true},
		category:'civil',
	});
		new G.Unit({
		name:'Library',
		desc:'Books from each source(delivered, written at [Lodge of writers] etc.) may be stored there to slow down their decay. Provides 4500 [book storage] .',
		icon:[21,5,'magixmod'],
		cost:{'basic building materials':1100},
		use:{'land':1,'worker':5},
		req:{'Bookwriting':true,'construction':true},
		effects:[
			{type:'provide',what:{'book storage':4500}}
		],
		category:'civil',
	});
	new G.Unit({
		name:'Kiln',
		desc:'@processes goods with fire<>This specific [Kiln] is an impressive edifice for those not yet accustomed to its roaring fire. @This one can do more than its primary brother but needs to be <b>fueled</b>',
		icon:[17,14,'magixmod'],
		cost:{'archaic building materials':40,'basic building materials':70},
		use:{'Land of the Paradise':1,'Industry point':1},
		upkeep:{'log':0.5},
		modes:{
			'off':G.MODE_OFF,
			'bricks':{name:'Fire bricks',icon:[3,8],desc:'Produce 10 [brick]s out of 1 [clay].',use:{'worker':1,'stone tools':1},req:{}},
			'glass':{name:'Craft glass',icon:[4,8],desc:'Produce 2 panes of [glass] out of 8 [sand].',use:{'worker':1,'stone tools':1},req:{}}
		},
		effects:[
			{type:'convert',from:{'clay':1},into:{'brick':10},every:5,mode:'bricks'},
			{type:'convert',from:{'sand':8},into:{'glass':2},every:5,mode:'glass'},
		],
		gizmos:true,
		req:{'masonry':true,'<span style="color: ##FF0900">Paradise building</span>':true,'Paradise crafting':true},
		category:'paradiseunit',
	});
		new G.Unit({
		name:'Mana silo',
		desc:'Big silo. Can waste like [Fire essence storage,Essence storages] . Each one allows you to store 32500 [Mana].',
		icon:[6,5,'magixmod'],
		cost:{'basic building materials':700,'pot':850},
		use:{'land':1.2},
		//require:{'wizard':3},
		effects:[
			{type:'provide',what:{'mana capacity':32500}},
			{type:'waste',chance:0.0004/1000},
		],
		req:{'Mana brewery':true},
		category:'storage',
	});
		new G.Unit({
		name:'Fire essence storage',
		desc:'@One storage allows you to store 11500 [Fire essence] more<>A simple glass shielded storage with essence faucet. It is more tall than wide so that is why it consumes only 0.8 [land].',
		icon:[2,5,'magixmod'],
		cost:{'basic building materials':100,'glass':200},
		use:{'land':0.8},
		effects:[
			{type:'provide',what:{'fire essence limit':11500}},
			{type:'waste',chance:1/100000}
		],
		req:{'stockpiling':true,'building':true,'Essence storages':true},
		category:'storage',
	});
		new G.Unit({
		name:'Water essence storage',
		desc:'@One storage allows you to store 11500 [Water essence] more<>A simple glass shielded storage with essence faucet. It is more tall than wide so that is why it consumes only 0.8 [land].',
		icon:[0,5,'magixmod'],
		cost:{'basic building materials':100,'glass':200},
		use:{'land':0.8},
		effects:[
			{type:'provide',what:{'water essence limit':11500}},
			{type:'waste',chance:1/100000}
		],
		req:{'stockpiling':true,'building':true,'Essence storages':true},
		category:'storage',
	});
		new G.Unit({
		name:'Lightning essence storage',
		desc:'@One storage allows you to store 11500 [Lightning essence] more<>A simple glass shielded storage with essence faucet. It is more tall than wide so that is why it consumes only 0.8 [land].',
		icon:[5,5,'magixmod'],
		cost:{'basic building materials':100,'glass':200},
		use:{'land':0.8},
		effects:[
			{type:'provide',what:{'lightning essence limit':11500}},
			{type:'waste',chance:1/100000}
		],
		req:{'stockpiling':true,'building':true,'Essence storages':true},
		category:'storage',
	});
		new G.Unit({
		name:'Dark essence storage',
		desc:'@One storage allows you to store 11500 [Dark essence] more<>A simple glass shielded storage with essence faucet. It is more tall than wide so that is why it consumes only 0.8 [land].',
		icon:[1,5,'magixmod'],
		cost:{'basic building materials':100,'glass':200},
		use:{'land':0.8},
		effects:[
			{type:'provide',what:{'dark essence limit':11500}},
			{type:'waste',chance:1/100000}
		],
		req:{'stockpiling':true,'building':true,'Essence storages':true},
		category:'storage',
	});
		new G.Unit({
		name:'Nature essence storage',
		desc:'@One storage allows you to store 11500 [Nature essence] more<>A simple glass shielded storage with essence faucet. It is more tall than wide so that is why it consumes only 0.8 [land].',
		icon:[3,5,'magixmod'],
		cost:{'basic building materials':100,'glass':200},
		use:{'land':0.8},
		effects:[
			{type:'provide',what:{'nature essence limit':11500}},
			{type:'waste',chance:1/100000}
		],
		req:{'stockpiling':true,'building':true,'Essence storages':true},
		category:'storage',
	});
		new G.Unit({
		name:'Wind essence storage',
		desc:'@One storage allows you to store 11500 [Wind essence] more<>A simple glass shielded storage with essence faucet. It is more tall than wide so that is why it consumes only 0.8 [land].',
		icon:[4,5,'magixmod'],
		cost:{'basic building materials':100,'glass':200},
		use:{'land':0.8},
		effects:[
			{type:'provide',what:{'wind essence limit':11500}},
			{type:'waste',chance:1/100000}
		],
		req:{'stockpiling':true,'building':true,'Essence storages':true},
		category:'storage',
	});
		new G.Unit({
		name:'Holy essence storage',
		desc:'@One storage allows you to store 11500 [Essence of the Holiness] more<>A simple glass shielded storage with essence faucet. It is more tall than wide so that is why it consumes only 0.8 [land].',
		icon:[3,14,'magixmod'],
		cost:{'basic building materials':100,'glass':200},
		use:{'Land of the Paradise':0.8},
		effects:[
			{type:'provide',what:{'holy essence limit':11500}},
			{type:'waste',chance:1/100000}
		],
		req:{'stockpiling':true,'building':true,'Essence storages':true,'<span style="color: ##FF0900">Paradise building</span>':true,'7th essence':true},
		category:'storage',
	});
		new G.Unit({
		name:'holy well',
		desc:'@produces fresh [Cloudy water], up to 28 per day<>The [holy well] is a steady source of drinkable water.',
		icon:[10,14,'magixmod'],
		cost:{'stone':50,'basic building materials':120},
		use:{'Land of the Paradise':1},
		effects:[
			{type:'gather',what:{'Cloudy water':28}},
		],
		category:'paradiseunit',
		req:{'well-digging':true,'<span style="color: ##FF0900">Paradise building</span>':true},
		limitPer:{'land':10},
	});
	
		new G.Unit({
		name:'ingredient crafting stand',
		desc:'There you can craft ingredients for more advanced potions.',
		icon:[19,7,'magixmod'],
		cost:{'basic building materials':5},
		req:{'Beginnings of alchemy':true,'ingredient crafting':true},
		gizmos:true,
		modes:{
			'off':G.MODE_OFF,
			'bonedust':{name:'Bone dust',icon:[18,11,'magixmod'],desc:'Gain [Bone dust] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.25}},
			'flowsugar':{name:'Flowered sugar',icon:[18,10,'magixmod'],desc:'Gain [Flowered sugar] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.25}},
			'enchantice':{name:'Enchanted ice',icon:[17,11,'magixmod'],desc:'Gain [Enchanted ice] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.25,'Wand':1}},
			'darkfire':{name:'Dark fire pit',icon:[20,12,'magixmod'],desc:'Gain [Dark fire pit] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.25},req:{'Dark-essenced ingredients':true}},
			'withersalt':{name:'Withering salt',icon:[20,10,'magixmod'],desc:'Gain [Withering salt] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.25},req:{'Dark-essenced ingredients':true}},
			'undeadherb':{name:'Herb of the undead',icon:[20,11,'magixmod'],desc:'Gain [Herb of the undead] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.25},req:{'Dark-essenced ingredients':true}},
			'windsugar':{name:'Windy sugar',icon:[14,13,'magixmod'],desc:'Gain [Windy sugar] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.25},req:{'Wind-essenced ingredients':true}},
			'scoblife':{name:'Scobs of life',icon:[17,13,'magixmod'],desc:'Gain [Scobs of life] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.25},req:{'Nature-essenced ingredients':true}},
			'growgrass':{name:'Grass of growing',icon:[16,13,'magixmod'],desc:'Gain [Grass of growing] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.25},req:{'Nature-essenced ingredients':true}},
		},
		effects:[
			{type:'convert',from:{'bone':1.25},into:{'Bone dust':1},every:4,mode:'bonedust'},
			{type:'convert',from:{'Flowers':1.5,'sugar':1},into:{'Flowered sugar':1},every:4,mode:'flowsugar'},
			{type:'convert',from:{'Mana':0.75,'ice':2,'Wind essence':1},into:{'Enchanted ice':2},every:4,mode:'enchantice'},
			{type:'convert',from:{'fire pit':1,'Dark essence':1.75},into:{'Dark fire pit':1.02},every:6,mode:'darkfire'},
			{type:'convert',from:{'salt':1,'Dark essence':1},into:{'Withering salt':1},every:6,mode:'withersalt'},
			{type:'convert',from:{'herb':5,'Mana':0.5,'Nature essence':1},into:{'Grass of growing':1.25},every:5,mode:'growgrass'},
			{type:'convert',from:{'Mana':0.75,'sugar':1,'Wind essence':1},into:{'Windy sugar':2},every:4,mode:'windsugar'},
			{type:'convert',from:{'herb':2,'Dark essence':1,'fruit':0.5},into:{'Herb of the undead':2},every:4,mode:'undeadherb'},
			{type:'convert',from:{'Mana':0.75,'Scobs':1,'Nature essence':1,'water':0.25},into:{'Scobs of life':1.05},every:8,mode:'scoblife'},
		],
		category:'alchemy',
	});
		new G.Unit({
		name:'Paper-crafting shack',
		desc:'Allows to make [Paper] You can choose between 3 types of paper: <li>papyrus</li> <li>pergamin</li> <li>common paper</li> ',
		icon:[0,12,'magixmod',25,2],
		cost:{'basic building materials':800},
		use:{'land':0.7},
		gizmos:true,
		modes:{
			'off':G.MODE_OFF,
			'papyrus':{name:'Papyrus',icon:[15,12,'magixmod'],desc:'Gain mainly [Paper] out of this shack. To craft <strong>papyrus</strong> , [worker] will use [Sugar cane] .',use:{'worker':1,'stone tools':1}},
			'pergamin':{name:'Pergamin',icon:[16,12,'magixmod'],desc:'Gain mainly [Paper] out of this shack. To craft <b>pergamin</b> , [worker] will use [hide] or [leather] .',use:{'worker':1,'stone tools':1}},
			'commonpaper':{name:'Common paper',icon:[17,12,'magixmod'],desc:'Craft [Paper] out of [Bamboo] with help of secret non-magic recipe.',use:{'worker':1,'stone tools':1}},
		},
		effects:[
			{type:'convert',from:{'Sugar cane':3.4},into:{'Paper':1.5},every:1,mode:'papyrus'},
			{type:'convert',from:{'hide':1.75},into:{'Paper':1.15},every:4,mode:'pergamin'},
			{type:'convert',from:{'leather':1.5},into:{'Paper':1.15},every:4,mode:'pergamin'},
			{type:'convert',from:{'Bamboo':4},into:{'Paper':1.4},every:2,mode:'commonpaper'},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on'}},
			{type:'mult',value:1.44,req:{'Better papercrafting recipe':'true','joy of eating':true}},
			{type:'mult',value:1.44,req:{'Better papercrafting recipe':'true','culture of moderation':true}}
		],
		req:{'papercrafting':true},
		category:'crafting',
	});
		new G.Unit({
		name:'Syrup healer',
		desc:'This is other subclass of [healer] which heals with brews instead of herbs or bandages. He will mainly heal [sick] and [drunk].',
		icon:[18,0,'magixmod'],
		cost:{},
		use:{'worker':1},
		upkeep:{'food':0.2},
		effects:[
			{type:'convert',from:{'sick':1,'Essenced herb syrup':0.15,'Herb syrup':1},into:{'adult':1,'health':0.44},chance:4/10,every:10},
			{type:'convert',from:{'drunk':1,'Essenced herb syrup':0.25,'Herb syrup':0.9},into:{'adult':1,'health':0.44},chance:3/10,every:10},
			{type:'gather',context:'gather',what:{'health':0.1},req:{'Nutrition':true}},
		],
		req:{'healing':true,'Healing with brews':true},
		category:'spiritual',
	});
		new G.Unit({
		name:'Fire wizard tower',
		desc:'@provides 33 [housing]<>A tower for 30 citizens and 3 wizards. Gathers [Fire essence] by consuming mana.',
		icon:[2,4,'magixmod'],
		cost:{'basic building materials':1000,'precious building materials':100},
		use:{'land':1},
		upkeep:{'Mana':6},
		effects:[
			{type:'provide',what:{'housing':33}},
			{type:'gather',what:{'Fire essence':2}},
		],
		req:{'construction':true,'Wizard towers':true,'Wizard wisdom':true,'Well of Mana':true},
		category:'housing',
		limitPer:{'land':2},
	});
		new G.Unit({
		name:'Painter',
		desc:'@generates [culture] by using [Dyes] to make a paintings. Requires artistic thinking.',
		icon:[12,2,'magixmod'],
		cost:{},
		use:{'worker':1},
		upkeep:{'coin':0.1,'Dyes':4},
		limitPer:{'population':40},
		effects:[
			{type:'gather',what:{'culture':0.08}},
			{type:'gather',what:{'Painting':0.008}},
			{type:'gather',what:{'culture':0.03},req:{'symbolism':true}},
			{type:'mult',value:1.3,req:{'artistic thinking':true}},
			{type:'mult',value:1.2,req:{'wisdom rituals':'on'}}
		],
		req:{'oral tradition':true,'artistic thinking':true},
		category:'cultural',
	});
		new G.Unit({
		name:'Archaic wizard',
		desc:'A man needed to make his towers even exist. Primitive wizard, occasionaly gains insight in very low rates.',
		icon:[6,1,'magixmod'],
		cost:{'insight':1,'stick':2,'food':1,'water':1},
		use:{'worker':1,'Wand':3},
		upkeep:{'food':11},
		req:{'Wizardry':true,'Wizard wisdom':false},
		effects:[
			{type:'gather',what:{'insight':0.012}},
			{type:'convert',from:{'Paper':13},into:{'Poet\'s notes':1},every:30,req:{'Notewriting':true}},
        ],
		limitPer:{'population':3},
	});
		new G.Unit({
		name:'Wizard',
		desc:'A man needed to make his towers even exist. Provides 1 [wisdom] per each one instead of gaining [insight] like [Archaic wizard] was.',
		icon:[choose([21,22,23,24]),8,'magixmod'],
		cost:{'insight':1,'stick':2,'food':1,'water':1},
		use:{'worker':1,'Wand':3},
		upkeep:{'food':12},
		req:{'Wizard wisdom':true},
		//require:{'wizard':3},
		effects:[
            		{type:'provide',what:{'wisdom':1},req:{'Wizard wisdom':true}},
			{type:'convert',from:{'Paper':14},into:{'Wizard\'s notes':1},every:11,req:{'Notewriting':true}}
        ],
		category:'discovery',
		limitPer:{'population':3},
	});
		new G.Unit({
		name:'Mana maker',
		desc:'A man who can make mana for you.',
		icon:[4,2,'magixmod'],
		cost:{'insight':1,'stick':2},
		use:{'worker':1},
		upkeep:{'food':5},
		req:{'Wizardry':true,'Mana brewery':true},
		//require:{'wizard':3},
		effects:[
			{type:'gather',what:{'Mana':20}},
        ],
		category:'discovery',
		limitPer:{'population':4000},
	});
		new G.Unit({
		name:'Water wizard tower',
		desc:'@provides 33 [housing]<>A tower for 30 citizens and 3 wizards. Gathers [Water essence] by consuming mana.',
		icon:[0,4,'magixmod'],
		cost:{'basic building materials':1000,'precious building materials':100},
		use:{'land':1},
		upkeep:{'Mana':6},
		effects:[
			{type:'provide',what:{'housing':33}},
			{type:'gather',what:{'Water essence':2}},
	],
		req:{'construction':true,'Wizard towers':true,'Wizard wisdom':true,'Well of Mana':true},
		//require:{'wizard':3},
		category:'housing',
		limitPer:{'land':2},
	});
		new G.Unit({
		name:'Dark wizard tower',
		desc:'@provides 33 [housing]<>A tower for 30 citizens and 3 wizards. Gathers [Dark essence] by consuming mana.',
		icon:[1,4,'magixmod'],
		cost:{'basic building materials':1000,'precious building materials':100,},
		use:{'land':1},
		upkeep:{'Mana':6},
		req:{'construction':true,'Wizard towers':true,'Wizard wisdom':true,'Well of Mana':true},
		//require:{'wizard':3},
		effects:[
			{type:'provide',what:{'housing':33}},
			{type:'gather',what:{'Dark essence':2}},
	],
		category:'housing',
		limitPer:{'land':2},
	});
		new G.Unit({
		name:'Nature wizard tower',
		desc:'@provides 33 [housing]<>A tower for 30 citizens and 3 wizards. Gathers [Nature essence] by consuming mana.',
		icon:[3,4,'magixmod'],
		cost:{'basic building materials':1000,'precious building materials':100,},
		use:{'land':1},
		upkeep:{'Mana':6},
		req:{'construction':true,'Wizard towers':true,'Wizard wisdom':true,'Well of Mana':true},
		effects:[
			{type:'provide',what:{'housing':33}},
			{type:'gather',what:{'Nature essence':2}},
	],
		category:'housing',
		limitPer:{'land':2},
	});
		new G.Unit({
		name:'Lightning wizard tower',
		desc:'@provides 33 [housing]<>A tower for 30 citizens and 3 wizards. Gathers [Lightning essence] by consuming mana.',
		icon:[5,4,'magixmod'],
		cost:{'basic building materials':1000,'precious building materials':100,},
		use:{'land':1},
		upkeep:{'Mana':6},
		req:{'construction':true,'Wizard towers':true,'Wizard wisdom':true,'Well of Mana':true},
		//require:{'wizard':3},
		effects:[
			{type:'provide',what:{'housing':33}},
			{type:'gather',what:{'Lightning essence':2}}
	],
		category:'housing',
		limitPer:{'land':2},
	});	
		new G.Unit({
		name:'Well of mana',
		desc:'Source of mana. Once you spill some [Mana] & [Water essence] into the hole you will get mana source.',
		icon:[6,2,'magixmod'],
		cost:{'precious building materials':10,'stone tools':10,'Mana':100,'Water essence':15},
		use:{'land':1},
		upkeep:{'Water essence':1},
		req:{'Wizardry':true,'Well of Mana':true},
		//require:{'wizard':3},
		effects:[
			{type:'gather',what:{'Mana':13}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on'}}
        ],
		category:'crafting',
		limitPer:{'land':75},
	});
		new G.Unit({
		name:'Wind wizard tower',
		desc:'@provides 33 [housing]<>A tower for 30 citizens and 3 wizards. Gathers [Wind essence] by consuming mana.',
		icon:[4,4,'magixmod'],
		cost:{'basic building materials':1000,'precious building materials':100,},
		use:{'land':1},
		upkeep:{'Mana':6},
		req:{'construction':true,'Wizard towers':true,'Wizard wisdom':true,'Well of Mana':true},
		//require:{'wizard':3},
		effects:[
			{type:'provide',what:{'housing':33}},
			{type:'gather',what:{'Wind essence':2}},
	],
		category:'housing',
		limitPer:{'land':2},
	});
		new G.Unit({
		name:'Holy wizard tower',
		desc:'@provides 33 [housing]<>A tower for 30 citizens and 3 wizards. Gathers [Essence of the Holiness] by consuming mana.',
		icon:[20,7,'magixmod'],
		cost:{'basic building materials':750,'precious building materials':350},
		use:{'land':1},
		upkeep:{'Mana':6},
		req:{'construction':true,'Wizard towers':true,'Wizard wisdom':true,'Well of Mana':true,'7th essence':true},
		//require:{'wizard':3},
		effects:[
			{type:'provide',what:{'housing':33}},
			{type:'gather',what:{'Essence of the Holiness':2.15}},
	],
		category:'housing',
		limitPer:{'land':2},
	});
		new G.Unit({
		name:'Church',
		desc:'Millenially generates some [spirituality]. Commonly generates [faith] at the lower rate than [soothsayer]. Further religion improvements may change it.',
		icon:[6,3,'magixmod'],
		cost:{'basic building materials':2000,'precious building materials':20},
		upkeep:{'faith':0.001},
		use:{'land':1,'worker':2},
		req:{'churches':true},
		effects:[
			{type:'gather',what:{'faith':0.03}},
			{type:'gather',what:{'spirituality':0.00000001}},
			{type:'waste',chance:0.01/1000}
	],
		category:'spiritual',
	});
		new G.Unit({
		name:'Cathedral',
		desc:'A precious place for worship. Commonly generates [faith] at the bigger rate than [soothsayer].',
		icon:[19,4,'magixmod'],
		cost:{'basic building materials':1700,'precious building materials':400},
		upkeep:{'faith':0.003},
		use:{'land':1,'worker':4},
		req:{'churches':true,'Stronger faith':true},
		effects:[
			{type:'gather',what:{'faith':0.09}},
			{type:'gather',what:{'faith':0.03},req:{'symbolism':true,'Stronger faith':true}},
			{type:'waste',chance:0.003/1000}
	],
		category:'spiritual',
	});
		new G.Unit({
		name:'Poet',
		desc:'@generates [culture] every now and then<>[Poet] spends his free time in his private life to write novels, stories, poems about any topic. Gathers a little bit more [culture] than storyteller but needs [Ink] as upkeep(he needs something with sense to write).',
		icon:[18,5,'magixmod'],
		cost:{},
		use:{'worker':1},
		upkeep:{'Ink':0.35},
		effects:[
			{type:'gather',what:{'culture':0.13}},
			{type:'gather',what:{'culture':0.05},req:{'symbolism':true}},
			{type:'mult',value:1.31,req:{'artistic thinking':true}},
			{type:'mult',value:1.21,req:{'wisdom rituals':'on'}},
			{type:'convert',from:{'Paper':21},into:{'Poet\'s notes':1},every:11,req:{'Bookwriting':true}},
		],
		req:{'oral tradition':true,'Poetry':true},
		category:'cultural',
	});
	
		new G.Unit({
		name:'Wizard Complex',
		desc:'@provides 690 [housing]<>A towers for 660 citizens and 30 wizards. Gathers all type of essences three times better than usual tower and consuming same mana. May provide more housing with further researches.',
		icon:[3,3,'magixmod'],
		cost:{'basic building materials':12500,'precious building materials':3000},
		use:{'land':9},
		upkeep:{'Mana':37},
		req:{'construction':true,'Wizard towers':true,'Wizard wisdom':true,'Well of Mana':true,'Wizard complex':true},
		//require:{'wizard':30},
		effects:[
			{type:'provide',what:{'housing':690}},
			{type:'provide',what:{'housing':115},req:{'7th complex tower':true}},
			{type:'provide',what:{'authority':15}},
			{type:'provide',what:{'spirituality':15}},
			{type:'provide',what:{'inspiration':30}},
			{type:'gather',context:'gather',what:{'Fire essence':6}},
			{type:'gather',context:'gather',what:{'Water essence':6}},
			{type:'gather',context:'gather',what:{'Nature essence':6}},
			{type:'gather',context:'gather',what:{'Lightning essence':6}},
			{type:'gather',context:'gather',what:{'Wind essence':6}},
			{type:'gather',context:'gather',what:{'Dark essence':6}},
			{type:'convert',from:{'Mana':6.33},into:{'Essence of the Holiness':6},every:4,req:{'7th essence':true}},
		],
		category:'housing',
		limitPer:{'land':300},
		limitPer:{'population':9000},
	});
		new G.Unit({
		name:'Brick house with a silo',
		desc:'@provides 15 [housing]<>. Even harder construction makes people feel more safe. Increases food storage by 65 per building.',
		icon:[5,1,'magixmod'],
		cost:{'brick':2000,'basic building materials':100},
		use:{'land':1},
		//require:{'wizard':3},
		effects:[
			{type:'provide',what:{'housing':15}},
			{type:'provide',what:{'food storage':65}},
			{type:'waste',chance:0.0004/1000},
		],
		req:{'construction':true,'More useful housing':true,'Well of Mana':true},
		category:'housing',
		limitPer:{'land':3},
	});
		new G.Unit({
		name:'Concrete making shack',
		desc:'Allows to make you concrete using some [limestone] and [water].',
		icon:[26,3,25,2],
		cost:{'basic building materials':1000},
		use:{'land':1,'worker':1},
		effects:[
			{type:'convert',from:{'water':8,'limestone':2},into:{'concrete':2},every:7},
		],
		req:{'construction':true,'Concrete making':true},
		category:'crafting',
	});
		new G.Unit({
		name:'Blockhouse',
		desc:'@provides 50 [housing]. Hardly constructed at the lands of Plain Island blockhouse has very low chance to be wasted.',
		icon:[9,1,'magixmod'],
		cost:{'advanced building materials':3000},
		use:{'Land of the Plain Island':3},
		effects:[
			{type:'provide',what:{'housing':50}},
			{type:'provide',what:{'housing':10},req:{'Mo\' floorz':true}},
			{type:'waste',chance:0.00001/1000},
		],
		req:{'construction II':true,'Concrete making':true},
		category:'plainisleunit',
		limitPer:{'land':35},
	});
		new G.Unit({
		name:'Mine of the plain island',
		desc:'@can mine new resource such as [Cobalt ore]. They will be able to mine few other resources.',
		icon:[9,2,'magixmod'],
		cost:{'basic building materials':100},
		use:{'Land of the Plain Island':5},
		req:{'<span style="color: ##FF0900">Plain island building</span>':true},
		gizmos:true,
		modes:{
			'off':G.MODE_OFF,
			'cobalt':{name:'Cobalt',icon:[8,2,'magixmod'],desc:'Gain [Cobalt ore] mainly from this mine.',use:{'worker':5,'metal tools':5}},
			'salt':{name:'Salt',icon:[11,7],desc:'Mine for [salt].',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'copper':{name:'Copper',icon:[9,8],desc:'Mine for [copper ore] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'tin':{name:'Tin',icon:[13,8],desc:'Mine for [tin ore] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'iron':{name:'Iron',icon:[10,8],desc:'Mine for [iron ore] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
		},
		effects:[
			{type:'gather',context:'mine',what:{'stone':10},max:30,notMode:'off'},
			{type:'gather',context:'gather',what:{'Cobalt ore':10},max:30,mode:'cobalt'},
			{type:'gather',context:'mine',what:{'salt':25},max:30,mode:'salt'},
			{type:'gather',context:'mine',what:{'copper ore':25},max:30,mode:'copper'},
			{type:'gather',context:'mine',what:{'tin ore':25},max:30,mode:'tin'},
			{type:'gather',context:'mine',what:{'iron ore':25},max:30,mode:'iron'},
			//Sulfur
			{type:'gather',context:'mine',what:{'Sulfur':25},max:30,mode:'iron',req:{'Explosive crafting & mining':true}},
			{type:'gather',context:'mine',what:{'Sulfur':28},max:37,mode:'cobalt',req:{'Explosive crafting & mining':true}},
			{type:'gather',context:'mine',what:{'Sulfur':24},max:31,mode:'tin',req:{'Explosive crafting & mining':true}},
			{type:'gather',context:'mine',what:{'Sulfur':24},max:31,mode:'copper',req:{'Explosive crafting & mining':true}},
			{type:'gather',context:'mine',what:{'Sulfur':17},max:26,mode:'salt',req:{'Explosive crafting & mining':true}},
			//Collapsing chance
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.01,'[X] [people].','mine of Plain Island has collapsed, wounding its miners','mines of Plain Island collapsed, wounding their miners.'),chance:1/50}
		],
		category:'plainisleunit',
		limitPer:{'land':35},
	});
		new G.Unit({
		name:'Cemetary of Plain Island',
		desc:'@Big cemetry but stores a lot of corpses with a method of family burials. Uses workers to keep conservacy & keep Cemetry clean. Provides 7500 [burial spot].',//Soon new policies which will decide how much you may store corpses
		icon:[2,6,'magixmod'],
		cost:{'basic building materials':300},
		use:{'Land of the Plain Island':100,'worker':10},
		effects:[
			{type:'provide',what:{'burial spot':7500}},
		],
		req:{'<span style="color: ##FF0900">Plain island building</span>':true,'Burial in new world':true},
		category:'plainisleunit',
		limitPer:{'land':400},
	});
		new G.Unit({
		name:'Family graves',
		desc:'On 5 pieces of new land you can store 10 family graves. Does not use [worker]. Provides 100 [burial spot].',
		icon:[0,6,'magixmod'],
		cost:{'basic building materials':300},
		use:{'Land of the Plain Island':5},
		effects:[
			{type:'provide',what:{'burial spot':100}},
		],
		req:{'<span style="color: ##FF0900">Plain island building</span>':true,'Burial in new world':true},
		category:'plainisleunit',
		limitPer:{'land':40},
	});
		new G.Unit({
		name:'Single grave',
		desc:'Simple, single grave for 1 person. Does not use [worker]. Provides 1 [burial spot].',
		icon:[3,6,'magixmod'],
		cost:{'basic building materials':300},
		use:{'Land of the Plain Island':1},
		effects:[
			{type:'provide',what:{'burial spot':1}},
		],
		req:{'<span style="color: ##FF0900">Plain island building</span>':true,'Burial in new world':true},
		category:'plainisleunit',
	});
		new G.Unit({
		name:'well of the Plain Island',
		desc:'@produces fresh [water], up to 20 per day<>The [well] is a steady source of drinkable water.',
		icon:[25,3],
		cost:{'stone':70,'archaic building materials':30,'basic building materials':15},
		use:{'Land of the Plain Island':1},
		effects:[
			{type:'gather',what:{'water':20}},
		],
		category:'plainisleunit',
		req:{'well-digging':true,'First portal to new world':true,'<span style="color: ##FF0900">Plain island building</span>':true},
		limitPer:{'Land of the Plain Island':10},
	});
		new G.Unit({
		name:'Hardened house',
		desc:'@provides 18 [housing]. Bigger, made with hardened materials. Has lower chances to waste.',
		icon:[6,6,'magixmod',4,6,'magixmod'],
		cost:{'basic building materials':1500,'glass':5},
		use:{'Land of the Plain Island':1},
		effects:[
			{type:'waste',chance:0.001/1000},
			{type:'provide',what:{'housing':18}},
		],
		req:{'construction II':true},
		category:'plainisleunit',
	});
		new G.Unit({
		name:'Hardened barn',
		desc:'@provides 5000[food storage]. Bigger, harder barn has lower chance to be wasted. To keep stored food safe and fresh it will need 3 guys.',
		icon:[7,6,'magixmod',4,6,'magixmod'],
		cost:{'basic building materials':1500,'glass':5},
		use:{'Land of the Plain Island':1,'worker':3},
		effects:[
			{type:'waste',chance:0.001/1000},
			{type:'provide',what:{'food storage':5000}},
		],
		req:{'construction II':true},
		category:'plainisleunit',
	});
		new G.Unit({
		name:'terrain conservator',
		desc:'@Each one hired [terrain conservator] will convert 25 [Land of the Plain Island] into 25 [Alchemy zone]. Hire them more to get more of its zone but not too much. @<b>WARNING! If you will fire one conservator you will lose [Alchemy zone] and you will not receive back your [Land of the Plain Island] so choose amount of them wisely!<b> ',
		icon:[17,6,'magixmod'],
		cost:{'Land of the Plain Island':25},
		use:{'worker':1},
		effects:[
			{type:'provide',what:{'Alchemy zone':25}},
		],
		req:{'Beginnings of alchemy':true,'Terrain conservacy':true},
		category:'alchemy',
	});
		new G.Unit({
		name:'Terrain conservator',
		desc:'@Each one hired [Terrain conservator] will convert 25 [Land of the Paradise] into 25 [Alchemy zone]. Hire them more to get more of its zone but not too much. @<b>WARNING! If you will fire one conservator you will lose [Alchemy zone] and you will not receive back your [Land of the Paradise] so choose amount of them wisely!<b> ',
		icon:[18,14,'magixmod'],
		cost:{'Land of the Paradise':25},
		use:{'worker':1},
		effects:[
			{type:'provide',what:{'Alchemy zone':25}},
		],
		req:{'Beginnings of alchemy':true,'Terrain conservacy':true,'<span style="color: ##FF0900">Paradise building</span>':true},
		category:'alchemy',
	});
	new G.Unit({
		name:'Carpenter workshop',
		desc:'@processes wood<>The [carpenter workshop,Carpenter] is equipped with all kinds of tools to coerce wood into more useful shapes. Can do little more than its mortal brother.',
		icon:[16,14,'magixmod',20,14,'magixmod'],
		cost:{'basic building materials':150},
		use:{'Land of the Paradise':1,'Industry point':1},
		modes:{
			'off':G.MODE_OFF,
			'lumber':{name:'Cut logs into lumber',icon:[1,8],desc:'Cut [log]s into 3 [lumber] each.',use:{'worker':1,'stone tools':1},req:{}},
		},
		effects:[
			{type:'convert',from:{'log':1},into:{'lumber':3},repeat:2,mode:'lumber'},
			{type:'waste',chance:0.001/1000},
		],
		gizmos:true,
		req:{'carpentry':true,'Paradise crafting':true},
		category:'paradiseunit',
	});
		new G.Unit({
		name:'Paradise blacksmith workshop',
		desc:'@forges metal goods out of ingots<>The [Paradise blacksmith workshop,Blacksmith] takes the same pride in shaping the tool that tills as they do the sword that slays.',
		icon:[19,14,'magixmod',20,14,'magixmod'],
		cost:{'basic building materials':150},
		use:{'Land of the Paradise':1,'Industry point':1},
		modes:{
			'off':G.MODE_OFF,
			'metal tools':{name:'Forge tools from soft metals',icon:[2,9],desc:'Forge [metal tools] out of 2 [soft metal ingot]s each.',use:{'worker':1,'stone tools':1},req:{}},
			'hard metal tools':{name:'Forge tools from hard metals',icon:[2,9],desc:'Forge 3 [metal tools] out of 1 [hard metal ingot].',use:{'worker':1,'metal tools':1},req:{}},
			'gold blocks':{name:'Forge gold blocks',icon:[14,8],desc:'Forge [gold block]s out of 10 [precious metal ingot]s each.',use:{'worker':1,'stone tools':1},req:{'gold-working':true}},
			'platinum block':{name:'Forge platinum blocks',icon:[4,11,'magixmod'],desc:'Forge [platinum block]s out of 10 [platinum ingot]s each.',use:{'worker':1,'stone tools':1},req:{'platinum-working':true}},
			'metal weapon':{name:'Forge weapons from soft metals',icon:[15,11,'magixmod'],desc:'Forge [metal weapons] out of 2 [soft metal ingot]s each.',use:{'worker':1,'stone tools':1,'metal tools':1},req:{'Weapon blacksmithery':true}},
			'hard metal weapon':{name:'Forge weapons from hard metals',icon:[15,11,'magixmod'],desc:'Forge 3 [metal weapons] out of 1 [hard metal ingot].',use:{'worker':1,'metal tools':1,'stone tools':1},req:{'Weapon blacksmithery':true}},
			'metal armor':{name:'Forge armor from soft metals',icon:[16,11,'magixmod'],desc:'Forge [armor set] out of 8 [soft metal ingot]s each.',use:{'worker':1,'stone tools':1,'metal tools':1,'Instructor':0.25},req:{'Armor blacksmithery':true}},
			'hard metal armor':{name:'Forge armor from hard metals',icon:[16,11,'magixmod'],desc:'Forge [armor set] out of 5 [hard metal ingot].',use:{'worker':1,'metal tools':1,'stone tools':1,'Instructor':0.25},req:{'Armor blacksmithery':true}},
		},
		effects:[
			{type:'convert',from:{'soft metal ingot':2},into:{'metal tools':1},repeat:3,mode:'metal tools'},
			{type:'convert',from:{'hard metal ingot':1},into:{'metal tools':3},repeat:3,mode:'hard metal tools'},
			{type:'convert',from:{'precious metal ingot':10},into:{'gold block':1},mode:'gold blocks'},
			{type:'convert',from:{'platinum ingot':10},into:{'platinum block':1},mode:'platinum block'},
			{type:'convert',from:{'hard metal ingot':1},into:{'metal weapons':1},every:3,repeat:1,mode:'hard metal weapon'},
			{type:'convert',from:{'soft metal ingot':2},into:{'metal weapons':1},every:3,repeat:1,mode:'metal weapon'},
			{type:'convert',from:{'hard metal ingot':5},into:{'armor set':2},every:3,repeat:1,mode:'hard metal armor'},
			{type:'convert',from:{'soft metal ingot':8},into:{'armor set':2},every:3,repeat:1,mode:'metal armor'},
			{type:'waste',chance:0.001/1000},
		],
		gizmos:true,
		req:{'smelting':true,'Paradise crafting':true},
		category:'paradiseunit',
	});
		new G.Unit({
		name:'Basic brewing stand',
		desc:'There you can brew basic potions.',
		icon:[18,9,'magixmod'],
		cost:{'basic building materials':3},
		req:{'Beginnings of alchemy':true},
		gizmos:true,
		modes:{
			'off':G.MODE_OFF,
			'sweetwater':{name:'Sweet water',icon:[0,10,'magixmod'],desc:'Gain [Sweet water pot,Sweet water] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.33}},
			'mundanewater':{name:'Mundane water',icon:[1,10,'magixmod'],desc:'Gain [mundane water pot,Mundane water] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.33}},
			'saltwater':{name:'Saltwater',icon:[2,10,'magixmod'],desc:'Gain [salted water pot,Saltwater] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.33}},
			'bubblingwater':{name:'Bubbling water',icon:[3,10,'magixmod'],desc:'Gain [Bubbling water pot,Bubbling water] out of its stand and its owner.',use:{'Alchemist':1,'Alchemy zone':0.33}},
		},
		effects:[
			{type:'convert',from:{'Potion pot':1,'water':0.75,'sugar':0.33},into:{'Sweet water pot':1},every:4,mode:'sweetwater'},
			{type:'convert',from:{'Potion pot':1,'water':0.75,'muddy water':0.05,'herb':0.1},into:{'mundane water pot':1},every:4,mode:'mundanewater'},
			{type:'convert',from:{'Potion pot':1,'water':0.8,'salt':0.2,'herb':0.1},into:{'salted water pot':1},every:4,mode:'saltwater'},
			{type:'convert',from:{'Potion pot':1,'water':0.8,'salt':0.02,'fire pit':0.12},into:{'Bubbling water pot':1},every:4,mode:'bubblingwater'},
		],
		category:'alchemy',
	});
		new G.Unit({
		name:'Alcohol brewing stand',
		desc:'There [Alchemists] can brew alcohol. Harmful for health but may be needed to make more potions.',
		icon:[19,9,'magixmod'],
		cost:{'basic building materials':4},
		req:{'Beginnings of alchemy':true,'Alcohol brewing':true},
		use:{'Alchemy zone':0.5,'Alchemist':1},
		effects:[
			{type:'convert',from:{'mundane water pot':0.75,'water':0.2,'Bubbling water pot':0.25},into:{'Alcohol pot':1},every:4},
		],
		category:'alchemy',
	});
		new G.Unit({
		name:'Mana crafting stand',
		desc:'There [Alchemists] can craft [Mana] with the same recipe as your [Mana maker] primarily did.',
		icon:[19,10,'magixmod'],
		cost:{'basic building materials':4},
		req:{'Beginnings of alchemy':true,'Mana brewery II':true},
		use:{'Alchemy zone':0.5},
		gizmos:true,
		modes:{
			'hireadult':{name:'Hire adult alchemist to craft mana',icon:[12,5,'magixmod'],desc:'Hire [Alchemist] to craft mana.',use:{'Alchemist':1}},
			'hirechild':{name:'Hire child alchemist to craft mana',icon:[12,7,'magixmod'],desc:'Hire [Child alchemist] to craft mana. Each stand used by children has 0.5% chance to make accident happen, but if you need adult [Alchemist] to other purposes you\'ll have\'em.',use:{'Child alchemist':1},req:{'Alchemy for children':'on'}},
		},
		effects:[
			{type:'gather',what:{'Mana':0.75}},
        ],
		category:'alchemy',
	});
		new G.Unit({
		name:'Alcohol drinks brewing stand',
		desc:'There [Alchemists] can brew drinks with help of [Alcohol pot,alcohol] . Tasty but harmful for health drinks are crafted there. Can craft [Wine] or [Pot of vodka].',
		icon:[19,8,'magixmod'],
		cost:{'basic building materials':4.3},
		req:{'Beginnings of alchemy':true,'Alcohol brewing':true},
		use:{'Alchemy zone':0.5},
		gizmos:true,
		modes:{
			'wine':{name:'Craft wine at this stand',icon:[8,10,'magixmod'],desc:'At this stand you may craft [Wine], an [Alcohol brews,Alcohol brew].',use:{'Alchemist':1}},
			'vodka':{name:'Craft vodka at this stand',icon:[10,10,'magixmod'],desc:'At this stand you may craft [Pot of vodka,Vodka], an [Alcohol brews,Alcohol brew]. This drink is very harmful for health so take care about health of your people.',use:{'Alchemist':1}},
		},	
		effects:[
			{type:'convert',from:{'Alcohol pot':0.1,'water':0.7,'mundane water pot':0.15,'fruit':0.6,'Sweet water pot':0.25},into:{'Wine':1},every:4,mode:'wine'},
			{type:'convert',from:{'Alcohol pot':0.5,'mundane water pot':0.3,'Bubbling water pot':0.05,'water':0.15},into:{'Pot of vodka':1},every:5,mode:'vodka'},
		],
		category:'alchemy',
	});
		new G.Unit({
		name:'Medicament brewing stand',
		desc:'There [Alchemists] can brew healthy syrups which may heal more efficiently [sick], [drunk]. Not so tasty but healthy. Can craft:[Herb syrup] ,[Essenced herb syrup], [Antidotum].',
		icon:[19,5,'magixmod'],
		cost:{'basic building materials':4.3},
		req:{'Beginnings of alchemy':true,'Medicaments brewing':true},
		use:{'Alchemy zone':0.5},
		gizmos:true,
		modes:{
			'herbsyrup':{name:'Craft syrup out of herbs',icon:[5,10,'magixmod'],desc:'At this stand you may craft [Herb syrup] a medicament used to heal people.',use:{'Alchemist':1}},
			'antidotum':{name:'Craft antidotum',icon:[4,10,'magixmod'],desc:'At this stand you may craft [Antidotum], which can be used to get rid of poison effect with a big chance to succed..',use:{'Alchemist':1}},		
			'EssHerbsyrup':{name:'Craft syrup out of herbs + <b>Nature essence',icon:[9,10,'magixmod'],desc:'At this stand you may craft [Essenced herb syrup] a medicament used to heal people which got heavily drunk or poisoned. @Be careful: At this mode alchemist has 10% to fail crafting its potion gaining nothing.',use:{'Alchemist':1}},
		},	
		effects:[
			{type:'convert',from:{'Alcohol pot':0.1,'water':0.7,'mundane water pot':0.15,'herb':0.05,'Sweet water pot':0.1},into:{'Antidotum':1},every:4,mode:'antidotum'},
			{type:'convert',from:{'salted water pot':0.3,'Bubbling water pot':0.05,'water':0.15,'herb':0.25,'Nature essence':0.2,'Mana':0.01},into:{'Essenced herb syrup':1},every:5,mode:'EssHerbsyrup',chance:9/10},
			{type:'convert',from:{'Sweet water pot':0.5,'water':0.15,'herb':0.5,'fruit':0.005},into:{'Herb syrup':1},every:5,mode:'herbsyrup'},
		],
		category:'alchemy',
	});
		new G.Unit({
		name:'School of alchemy',
		desc:'@The building where people may learn basics of alchemy. You can decide who may learn it in Policies tab. Needs water to work... you know why it does need water.',
		icon:[5,6,'magixmod'],
		cost:{'basic building materials':1500,'glass':5},
		use:{'Land of the Plain Island':1,'Instructor':3},
		upkeep:{'water':5},
		effects:[
			{type:'waste',chance:0.001/1000},
			{type:'convert',from:{'adult':1},into:{'Alchemist':1},every:400,req:{'Teach alchemists':'on','School of Alchemy - length of education cycle':'medium'}},
			{type:'convert',from:{'child':1},into:{'Child alchemist':1},every:400,req:{'Alchemy for children':'on','School of Alchemy - length of education cycle':'medium'}},
			{type:'convert',from:{'child':1},into:{'Child alchemist':1},every:200,req:{'Alchemy for children':'on','School of Alchemy - length of education cycle':'short'}},
			{type:'convert',from:{'adult':1},into:{'Alchemist':1},every:200,req:{'Teach alchemists':'on','School of Alchemy - length of education cycle':'short'}},
			{type:'convert',from:{'adult':1},into:{'Alchemist':1},every:600,req:{'Teach alchemists':'on','School of Alchemy - length of education cycle':'long'}},
			{type:'convert',from:{'child':1},into:{'Child alchemist':1},every:600,req:{'Alchemy for children':'on','School of Alchemy - length of education cycle':'long'}},
		],
		req:{'construction II':true},
		category:'plainisleunit',
	});
		new G.Unit({
		name:'Drying rack',
		desc:'@This small rack may dry [leather] making it become [Dried leather]. [Dried leather] is used to make even harder clothing, which decays much slower.',
		icon:[13,3,'magixmod'],
		cost:{'basic building materials':100},
		use:{'land':0.75},
		effects:[
			{type:'waste',chance:0.001/1000},
			{type:'convert',from:{'leather':5},into:{'Dried leather':5},every:20},
		],
		req:{'Sewing II':true},
		category:'crafting',
	});
		new G.Unit({
		name:'Florist',
		startWith:0,
		desc:'@subclass of gatherer which instead of Food and water, will collect flowers which will have its specific use. The further you will research the more types of [Flowers] he will be able to collect.',
		icon:[7,11,'magixmod'],
		cost:{},
		req:{'<font color="yellow">A gift from the Mausoleum</font>':true},
		use:{'worker':1},
		category:'production',
		effects:[
			{type:'gather',context:'gather',what:{'cactus':1,'Pink tulip':1,'Salvia':1},amount:1,max:3},
			{type:'gather',context:'gather',what:{'Lime rose':1,'Pink rose':1,'Gray rose':1,'Cyan rose':1,'Desert rose':1},amount:1,max:3,req:{'plant lore':true,'Gather roses':'on'}},
			{type:'gather',context:'gather',what:{'Green Zinnia':1,'Sunflower':1},amount:1,max:1,req:{'plant lore':true}},
			{type:'gather',context:'gather',what:{'Lavender':1},amount:1,max:2,req:{'plant lore':true}},
			{type:'gather',context:'gather',what:{'Brown flower':1},amount:1,max:1,req:{'plant lore':true}},
			{type:'gather',context:'gather',what:{'Daisy':1},amount:1,max:1,req:{'plant lore':true}},
			{type:'gather',context:'gather',what:{'Bachelor\'s button':1,'Black lily':1},amount:1,max:1,req:{'plant lore':true}},	
			{type:'mult',value:1.05,req:{'harvest rituals for flowers':'on'}},
			{type:'convert',from:{'Paper':12,'Ink':3},into:{'Florist\'s notes':1},every:11,req:{'Notewriting':true},chance:1/95},
		],
	});
		new G.Unit({
		name:'Thoughts sharer',
		desc:'@consumes [insight] to give it to his students. Dreams himself or asks other dreamers. Then all knowledge he has gotten gives to people. @It is way to make very smart and intelligent [Instructor] appear.',
		icon:[19,12,'magixmod'],
		cost:{},
		use:{},
		gizmos:true,
		//upkeep:{'coin':0.2},
		modes:{
			'off':G.MODE_OFF,
			'thoughts':{name:'Make scholar people',icon:[12,6,'magixmod'],desc:'He will teach your [adult] people and make them [Instructor]s.',use:{'worker':1}},
		},
		effects:[
			{type:'convert',from:{'insight':4,'adult':1},into:{'Instructor':1},every:375,mode:'thoughts'},
		],
		req:{'speech':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'discovery',
		priority:5,
	});
		new G.Unit({
		name:'bamboo hut',
		desc:'@provides 6 [housing]<>Small dwelling with roof out of branches and walls out of [Bamboo].',
		icon:[14,6,'magixmod'],
		cost:{'archaic building materials':65,'Bamboo':55},
		use:{'land':1},
		//require:{'worker':2,'stone tools':2},
		effects:[
			{type:'provide',what:{'housing':6}},
			{type:'waste',chance:0.13/1000}
		],
		req:{'building':true},
		category:'housing',
	});
		new G.Unit({
		name:'artisan of juice',
		desc:'@This subclass of [artisan] can make juices for you. In default he will extract sugar out of [Sugar cane]. Just switch mode to start crafting juices',
		icon:[15,5,'magixmod'],
		cost:{},
		use:{},
		gizmos:true,
		//upkeep:{'coin':0.2},
		modes:{
			'sugar':{name:'Extract sugar out of cane',icon:[15,2,'magixmod'],desc:'This artisan will only extract [sugar] out of [Sugar cane]. At least he will craft needed ingredient of tasty [Juices].',use:{'worker':1}},
			'sugarbeet':{name:'Extract sugar out of beet',icon:[10,11,'magixmod'],desc:'This artisan will only extract [sugar] out of [Beet]. At least he will craft needed ingredient of tasty [Juices].',use:{'worker':1}},
			'juices':{name:'Craft juices',icon:[14,3,'magixmod'],desc:'This artisan will craft [Juices] out of [Watermelon] or [Berries] , [sugar] and [water]. Have a good taste. <b>:)',use:{'worker':1}},
		},
		effects:[
			{type:'convert',from:{'Sugar cane':1.5},into:{'sugar':1},every:5,mode:'sugar'},
			{type:'convert',from:{'Beet':1},into:{'sugar':0.125},every:5,mode:'sugarbeet'},
			{type:'convert',from:{'sugar':1,'Berries':0.95,'water':1},into:{'Berry juice':1},every:5,mode:'juices'},
			{type:'convert',from:{'sugar':1,'Watermelon':0.4,'water':2},into:{'Watermelon juice':2},every:5,mode:'juices'},
			{type:'convert',from:{'sugar':1,'fruit':0.4,'water':2},into:{'Fruit juice':2},every:5,mode:'juices',req:{'Moar juices':true}},
			{type:'convert',from:{'sugar':3,'fruit':0.9,'water':6,'Berries':1,'Watermelon':0.25},into:{'Fruit juice':12,'Berry juice':8,'Watermelon juice':9},every:5,mode:'juices',req:{'Moar juices':true},chance:1/20},
		],
		req:{'Crafting a juice':true},
		category:'crafting',
	});
		new G.Unit({
		name:'First aid healer',
		desc:'@heals [wounded] mainly and slowly. Sometimes may use herb to heal wounded if these things are not enough.<>The [healer] knows the solution to bunch of wound types so it makes pain stay away.',
		icon:[18,1,'magixmod'],
		cost:{},
		use:{'worker':1},
		staff:{'stone tools':1},
		upkeep:{'coin':0.2},
		effects:[
			{type:'convert',from:{'wounded':1,'herb':2.5,'First aid things':1.5},into:{'adult':1,'health':0.44},chance:4/10,every:10},
			{type:'convert',from:{'wounded alchemist':1,'herb':2.5,'First aid things':1,'Medicament brews':0.3},into:{'Alchemist':1,'health':0.44},chance:4/10,every:10},
			{type:'convert',from:{'wounded child alchemist':1,'herb':2.5,'First aid things':1,'Medicament brews':0.3},into:{'Child alchemist':1,'health':0.44},chance:4/10,every:10},
			{type:'gather',context:'gather',what:{'health':0.1},req:{'Nutrition':true}},
		],
		req:{'healing':true,'first aid':true},
		category:'spiritual',
		priority:5,
	});
	
		new G.Unit({
		name:'Berry farm',
		desc:'@Specialized farm which will harvest tasty [Berries] at the better rate than [gatherer].',
		icon:[14,1,'magixmod'],
		cost:{'Berry seeds':200},
		req:{'Farms in the new land':true},
		upkeep:{'water':12},
		use:{'worker':8,'Land of the Plain Island':35},
		category:'plainisleunit',
		effects:[
			{type:'gather',context:'gather',what:{'Berries':15.3}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on'}},
			{type:'mult',value:8,req:{'God\'s trait #2 Berry rush':true}}
		],
	});
		new G.Unit({
		name:'Watermelon farm',
		desc:'@Specialized farm which will harvest tasty [Watermelon] at the better rate than [gatherer].',
		icon:[14,2,'magixmod'],
		cost:{'Watermelon seeds':200},
		req:{'Farms in the new land':true},
		use:{'worker':8,'Land of the Plain Island':35},
		upkeep:{'water':12},
		category:'plainisleunit',
		effects:[
			{type:'gather',context:'gather',what:{'Watermelon':0.14}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on'}}
		],
	});
		new G.Unit({
		name:'Sugar cane farm',
		desc:'@Specialized farm which will harvest useful in [Juices] crafting [Sugar cane] at the better rate than [gatherer].',
		icon:[14,7,'magixmod'],
		cost:{'Sugar cane':500},
		req:{'Farms in the new land':true,'Farm of the Sugar cane':true},
		use:{'worker':8,'Land of the Plain Island':35,'Instructor':1},
		upkeep:{'water':36},
		category:'plainisleunit',
		effects:[
			{type:'gather',context:'gather',what:{'Sugar cane':0.85}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on'}}
		],
	});
		new G.Unit({
		name:'Beet farm',
		desc:'@Specialized farm which will harvest useful in [Juices] crafting [Beet] - another source of [sugar].',
		icon:[9,11,'magixmod'],
		cost:{'Beet seeds':300},
		req:{'Farms in the new land':true,'Farm of the Beet':true},
		use:{'worker':8,'land':15},
		upkeep:{'water':14},
		category:'production',
		effects:[
			{type:'gather',context:'gather',what:{'Beet':30}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on'}}
		],
	});
	G.legacyBonuses.push(
		{id:'addFastTicksOnStart',name:'+[X] free fast ticks',desc:'Additional fast ticks when starting a new game.',icon:[0,0],func:function(obj){G.fastTicks+=obj.amount;},context:'new'},
		{id:'addFastTicksOnResearch',name:'+[X] fast ticks from research',desc:'Additional fast ticks when completing research.',icon:[0,0],func:function(obj){G.props['fastTicksOnResearch']+=obj.amount;}}
	);
//New Wonder. The portal to Plain Island. If possible I make it being built same way as Mausoleum
		new G.Unit({
    		name:'<span style="color: #E0CE00">Plain island portal</span>',
    		desc:'@opens a portal to a huge <b>Plain Island</b>A creation made of ideas of wizards and dreams of population more exactly kids.//A Dream comes real. You will grant +25000 max land upon activation of portal',
    		wideIcon:[7,3,'magixmod'],
    		cost:{'precious building materials':5000,'insight':1500,'faith':100,'Fire essence':45000,'Water essence':47500,'Dark essence':37500,'Wind essence':27500,'Lightning essence':37750,'Nature essence':100750},
    		effects:[
    			{type:'provide',what:{'Land of the Plain Island':25000}},
			{type:'provide',what:{'Plain Island emblem':1}},
    		],
    		use:{'land':10},
		messageOnStart:'You built a portal to Plain Island. It is big isle. On this island you may build houses , mines and other but not these one you built in your mortal world. You will unlock new category of buildings, a little bit better but limited housing. You may gain new minerals, who know maybe new food or anything else you did not see anytime earlier.',
    		req:{'First portal to new world':true,'Belief in portals':true},
    		limitPer:{'land':100000000000000},//It is something like max 1
    		category:'dimensions',
	});
		new G.Unit({
    		name:'<span style="color: #E0CE00">Portal to the Paradise</span>',
    		desc:'@opens a portal to a huge <b>God\'s Paradise</b>A very hard project, allowed by God.//A Dream to see Paradise, angels and much, much more comes real. You will grant +26500 paradise land at your own but you <b>must</b> follow some of God\'s rules.',
    		wideIcon:[7,4,'magixmod'],
    		cost:{'precious building materials':35000,'insight':1500,'faith':250,'Fire essence':45000,'Water essence':47500,'Dark essence':37500,'Wind essence':27500,'Lightning essence':37750,'Nature essence':100750,'precious metal ingot':1e4},
    		effects:[
    			{type:'provide',what:{'Land of the Paradise':26500}},
			{type:'provide',what:{'Paradise emblem':1}},
    		],
    		use:{'land':10},
		messageOnStart:'You built a portal to Plain Island. It is big isle. On this island you may build houses , mines and other but not these one you built in your mortal world. You will unlock new category of buildings, a little bit better but limited housing. You may gain new minerals, who know maybe new food or anything else you did not see anytime earlier.',
    		req:{'Second portal to new world':true,'Belief in portals':true},
    		limitPer:{'land':100000000000000},//It is something like max 1
    		category:'dimensions',
	});
//New wonder. Temple of heaven.
		new G.Unit({
		name:'temple of heaven',
		desc:'@leads to the <b>Heavenly victory</b><>A mystical monument dedicated to angels, archangels and seraphins where.//A temple housing a tomb deep under its rocky platform, where the Temple\'s relics lie and there is last bastion of your religion if it will start fall. @The tower it does have is high, above clouds, despite fact there is cold on top some brave people may come up to prey its god, or listen heavenly symphonies and hums.',
		wonder:'Heavenly',
		icon:[1,11,'magixmod'],
		wideIcon:[0,11,'magixmod'],
		cost:{'basic building materials':35000,'gem block':10},
		costPerStep:{'basic building materials':2500,'precious building materials':1250,'gem block':2,'concrete':25},
		steps:300,
		messageOnStart:'You begin the construction of the Temple. Its highest tower is a pass between land of people and sky of angels. No one may go on top unless it is coated. This temple will be last bastion of religion and a storage of relics. Your people with full of hope are building this mass, full of glory wonder.',
		finalStepCost:{'population':1000,'precious building materials':25000,'faith':100,'influence':75,'basic building materials':3000},
		finalStepDesc:'To complete the Temple, 1000 of your [population,People] and many more resources needed to finish Temple completely must be sacrificed to accompany you as servants in the afterlife and Angels of the Afterlife. Are you ready?',
		use:{'land':75},
		//require:{'worker':10,'stone tools':10},
		req:{'monument-building II':true},
		category:'wonder',
	});
//Revenants trait wonder. People want to send these corpses right into its coils
		new G.Unit({
		name:'The Skull of Wild Death',
		desc:'@leads to the <b>Deadly escape</b><>A big skull shaped construcion with fire roaring inside dedicated to bloodthirsty [<span style="color: red">Revenants</span>] assaulting your world.//A realm around it is a burial for them. Home of [wild corpse] . There they can burn and in the terrain around buried. Per each step you will perform building it you will grant big amount of [burial spot] . <i>Let these corpses go into their rightenous home</i>',
		wonder:'Deadly, revenantic',
		icon:[1,16,'magixmod'],
		wideIcon:[0,16,'magixmod'],
		cost:{'basic building materials':1000,'gem block':30},
		costPerStep:{'basic building materials':2500,'archaic building materials':1500,'burial spot':-6700,'Dark skull construction point':-1},
		steps:270,
		messageOnStart:'You begin the construction of The Skull of Wild Death. First terrain marked for realm is getting look like this from graves where your people lie. You think that is going right way. You say: <b>I think wild corpses will go right there to leave us away. I want calm, for all price. It is right choice. I will make my soldiers take these living skulls right there.</b>',
		finalStepCost:{'corpse':100,'faith':100,'Dark essence':25000,'Cobalt ingot':1000,'burial spot':-15000},
		finalStepDesc:'To complete this wonder in hope of wild corpses leaving you away for some time you will need pay some tools in order',
		use:{'land':120},
		require:{'worker':40,'stone tools':10},
		req:{'monument-building II':true,'<span style="color: red">Revenants</span>':true,'Dark wonder':true},
		category:'wonder',
	});
//WonderFULL
  		new G.Unit({
		name:'Fortress of cultural legacy',
		desc:'@leads to the <b>Sacrificed for culture victory</b><>The fortresss built out  of [precious building materials]. In the name of [storyteller,people of culture]. It is their home a place where they may give their creations for future generations. This wonder may... empower [culture] by itself and increase [culture] gains by 20% if performed a final step! It is [culture] and [inspiration] specified so it needs it while building. <>Inside of the Fortress people store most important and most beautiful arts , statues, sculptures. That wonder makes the culture immune to perditions.',
		wonder:'Sacrificed for culture',
		icon:[6,12,'magixmod'],
		wideIcon:[choose([9,12,15]),17,'magixmod',5,12,'magixmod'],
		cost:{'basic building materials':1500,'precious building materials':400,'inspiration':10},
		costPerStep:{'basic building materials':2500,'precious building materials':500,'culture':450,'inspiration':1,'glass':1,'Fortress construction point':-1},
		steps:200,
		messageOnStart:'You began the construction of <b>Fortress of cultural legacy</b>. Made at not flat grounds will make people come inside to watch the arts of the centuries. <b>Unleash the unbreakable cultural roots!</b>',
		finalStepCost:{'inspiration':125,'population':250,'precious building materials':4500,'gem block':50,'culture':650},
		finalStepDesc:'To complete the wonder and prevent culture and traditions from being perditioned... you need to perform that final step.',
		use:{'land':10},
		req:{'monument-building':true,'Cultural roots':true},
		category:'cultural',
	});
  		new G.Unit({
		name:'Complex of Dreamers',
		desc:'@leads to the <b>Insight-ly victory</b><>The nice complex built at basis of a [Wizard Complex] . In the name of [dreamer]s. It is their home. This wonder may provide housing and... empower [insight] by itself if final step finished! It is [insight] and [wisdom] specified so it needs it while building. <>The core collects all ideas and dreams of all [dreamer]s and [Thoughts sharer]s.',
		wonder:'Insight-ly',
		icon:[choose([1,4,7]),17,'magixmod'],
		wideIcon:[choose([0,3,6]),17,'magixmod'],
		cost:{'basic building materials':1000,'precious building materials':500,'wisdom':10},
		costPerStep:{'basic building materials':2500,'precious building materials':500,'insight':450,'wisdom':1,'Complex construction point':-1},
		steps:200,
		messageOnStart:'You began the construction of Complex of Dreamers. The complex looks like not from this world when night visits the world.',
		finalStepCost:{'wisdom':125,'population':250,'precious building materials':4500,'gem block':50,'insight':1000},
		finalStepDesc:'To complete the wonder and make your whole civilization much smarter you will need to perform a final step.',
		use:{'land':30},
		upkeep:{'Mana':15},
		req:{'monument-building':true,'Roots of insight':true},
		category:'discovery',
	});
  		new G.Unit({
		name:'Pagoda of Democracy',
		desc:'@leads to the <b>Democration victory</b><>The nice pagoda built over the forest of cherry blossoms. In the name of justice and democration. It is more political thing so that\'s why you see it in political category. This wonder is like fertlizer of justice roots. It is [influence] and [authority] specified so it needs it while building.',
		wonder:'Democration',
		icon:[6,13,'magixmod'],
		wideIcon:[5,13,'magixmod'],
		cost:{'basic building materials':1000,'precious building materials':500},
		costPerStep:{'basic building materials':2500,'precious building materials':500,'influence':45,'authority':0.25,'Pagoda construction point':-1},
		steps:200,
		messageOnStart:'You began the construction of Pagoda of Democracy. Over the blossoms it looks like the most beautiful place you have ever seen. Some people say that Pagoda is taller than Mausoleum.',
		finalStepCost:{'authority':25,'population':250,'precious building materials':4500,'gem block':50},
		finalStepDesc:'To complete the wonder and make justice and democration last even longer you need to do the final step.',
		use:{'land':10},
		req:{'monument-building':true,'Political roots':true},
		category:'political',
	});

	//SEASONAL CONTENT//CONTENT WHICH WILL BE AVAILABLE FOR PLAYERS AT SOME TIME LIKE XMAS OR VALENTINE'S DAY
	
	//NEW YEAR 'S EVE//
		new G.Unit({
		name:'Artisan of new year',
		desc:'This guy can craft new year fireworks for celebration. Sulfur? For fireworks? It is celebration so he has [Sulfur] already at his stock. He will just consume [Paper] , [Thread] to finish it up.',
		icon:[19,0,'seasonal'],
		cost:{},
		use:{'worker':1},
		upkeep:{'Thread':0.30,'Paper':0.3},
		effects:[
			{type:'gather',what:{'Blue firework':1.25}},
			{type:'gather',what:{'Orange firework':1.25}},
			{type:'gather',what:{'Firecracker':1}}
		],
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'Firework crafting':true,'<span style="color: yellow">Culture of celebration</span>':false},
		category:'seasonal',
	});
		new G.Unit({
		name:'Artisan of new year (dark)',
		desc:'This guy can craft new year fireworks for celebration. Sulfur? For fireworks? It is celebration so he has [Sulfur] already at his stock. He will just consume [Paper] , [Thread] and [Dark essence] to finish it up.',
		icon:[19,0,'seasonal'],
		cost:{},
		use:{'worker':1},
		upkeep:{'Thread':0.30,'Paper':0.3,'Dark essence':0.15},
		effects:[
			{type:'gather',what:{'Dark Blue Firework':1.25}},
			{type:'gather',what:{'Dark Orange Firework':1.25}},
			{type:'gather',what:{'Firecracker':1}}
		],
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'Dark essenced fireworks':true,'<span style="color: yellow">Culture of celebration</span>':false},
		category:'seasonal',
	});
		new G.Unit({
		name:'Firework launching guy',
		desc:'There the guy launches fireworks right up into the sky. Generates happiness by itself and for every firework bunch launched up into the sky.',
		icon:[18,0,'seasonal'],
		cost:{'food':10},
		use:{'worker':1,'land':1},
		effects:[
			{type:'convert',from:{'Orange firework':1},into:{'happiness':75},every:2,context:'launching'},
			{type:'convert',from:{'Blue firework':1},into:{'happiness':75},every:2,context:'launching'},
			{type:'convert',from:{'Dark Blue Firework':1},into:{'happiness':75},every:2,context:'launching'},
			{type:'convert',from:{'Dark Orange Firework':1},into:{'happiness':75},every:2,context:'launching'},
		],
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'Firework launching':true,'<span style="color: yellow">Culture of celebration</span>':false},
		category:'seasonal',
	});
