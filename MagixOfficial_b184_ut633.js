G.AddData({
name:'Default dataset',
author:'pelletsstarPL',
desc:'Magic! Magic!. Fit more people, discover essences which have its secret use. At the moment you can reach new dimensions which will increase your max land soon. More housing so you can fit more people. Mod utilizes vanilla part of the game by adding new modes or new units. Credits to Orteil for default dataset.',
engineVersion:1,
manifest:'ModManifest.js',
sheets:{'magixmod':'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/magixmod2.png','seasonal':'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/seasonalMagix.png'},//custom stylesheet (note : broken in IE and Edge for the time being)
func:function(){
//READ THIS: All rights reserved to mod creator and people that were helping the main creator with coding. Mod creator rejects law to copying icons from icon sheets used for this mod. All noticed plagiariasm will be punished. Copyright: 2020
//===========================
G.props['fastTicksOnResearch']=150;
		G.funcs['new game blurb']=function()
	{   
		var str=
		'<font color="fuschia">Magix expansion has been loaded succesfully. <b>: )</b></br></font>'+
		'<b>Your tribe :</b><div class="thingBox">'+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('adult'))+'"></div><div class="freelabel">x5</div>','5 Adults')+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('elder'))+'"></div><div class="freelabel">x1</div>','1 Elder')+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('child'))+'"></div><div class="freelabel">x2</div>','2 Children')+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('herb'))+'"></div><div class="freelabel">x250</div>','250 Herbs')+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('water'))+'"></div><div class="freelabel">x250</div>','250 Water')+
		//G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('insight'))+'"></div><div class="freelabel">x6</div>','6 Insight')+
		//G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('influence'))+'"></div><div class="freelabel">x6</div>','6 Influence & Authority')+
		'</div>'+
		'<div class="par fancyText bitBiggerText">Your tribe finds a place to settle in the wilderness.<br>Resources are scarce, and everyone starts foraging.</div>'+
		'<div class="par fancyText bitBiggerText">You emerge as the tribe\'s leader. <br>These people... They call you :</div>';
		return str;
	}
	G.funcs['new game']=function()
	{
		var str='Your name is '+G.getName('ruler')+''+(G.getName('ruler').toLowerCase()=='orteil'?' <i>(but that\'s not you, is it?)</i>':'')+', ruler of '+G.getName('civ')+'. Your tribe is primitive, but full of hope.<br>The first year of your legacy has begun. May it stand the test of time.';
		G.Message({type:'important tall',text:str,icon:[0,3]});
	}
	G.funcs['game over']=function()
	{
		var str=G.getName('civ')+' is no more, and your legacy is but a long-lost memory, merely a sidenote in a history book.<br>Everyone is dead.';
		G.Message({type:'bad',text:str,icon:[5,4]});
		if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
		{
			var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/0population.mp3');
			audio.play(); 
		}
	}
	G.funcs['game loaded']=function()
	{
		G.Message({type:'important tall',text:'Welcome back, '+G.getName('ruler')+', ruler of '+G.getName('civ')+'.',icon:[0,3]});
	}
	G.funcs['new year']=function()
	{
		if (G.on)
		{
			var str='';
			str+='It is now the year <b>'+(G.year+1)+'</b>.<br>';
			str+='Report for last year :<br>';
			str+='&bull; <b>Births</b> : '+B(G.getRes('born this year').amount)+'<br>';
			str+='&bull; <b>Deaths</b> : '+B(G.getRes('died this year').amount)+'<br>';
			G.getRes('born this year').amount=0;
			G.getRes('died this year').amount=0;
			G.Message({type:'important',text:str,icon:[0,3]});
			
			//influence trickle
			if(G.has('Glory')){
				if (G.getRes('influence').amount<=G.getRes('authority').amount-2)G.gain('influence',2);
			}else{
			if (G.getRes('influence').amount<=G.getRes('authority').amount-1)G.gain('influence',1);
			}
		}
	}
	
	G.props['new day lines']=[
		'Creatures are lurking.',
		'Danger abounds.',
		'Wild beasts are on the prowl.',
		'Large monsters roam, unseen.',
		'This is a cold night.',
		'No sound but the low hum of a gray sky.',
		'The darkness is terrifying.',
		'Clouds twist in complicated shapes.',
		'It is raining.',
		'Dark birds caw ominously in the distance.',
		'There is a storm on the horizon.',
		'The night is unforgiving.',
		'Creatures crawl in the shadows.',
		'A stream burbles quietly nearby.',
		'In the distance, a prey falls to a pack of beasts.',
		'An unexplained sound echoes on the horizon.',
		'Everything stands still in the morning air.',
		'A droning sound fills the sky.',
		'The night sky sparkles, its mysteries unbroken.',
		'Dry bones crack and burst underfoot.',
		'Wild thorns scratch the ankles.',
		'Something howls in the distance.',
		'Strange ashes snow down slowly from far away.',
		'A blood-curdling wail is heard.',
		'Unknown creatures roll and scurry in the dirt.',
		'The air carries a peculiar smell today.',
		'Wild scents flow in from elsewhere.',
		'The dust is oppressive.',
		'Wind blows from the north.',
		'Secrets await.',
		'Discover unknown.',
		'A morning fog welcomes you.',
		'An eerie glow from above illuminates the night.',
		'Distant lands lay undisturbed.',
		'<b>Magic awaits.</b>',
		'A cool breeze is blowing.'
	];
		
	shuffle(G.props['new day lines']);
	G.funcs['new day']=function()
	{
		if (G.on)
		{
			if (G.getSetting('atmosphere') && Math.random()<0.01)
			{
				//show a random atmospheric message occasionally on new days
				//we pick one of the first 5 lines in the array, then push that line back at the end; this means we get a semi-random stream of lines with no frequent repetitions
				var i=Math.floor(Math.random()*5);
				var msg=G.props['new day lines'].splice(i,1)[0];
				G.props['new day lines'].push(msg);
				G.Message({text:msg});
			}
			
			//possibility to gain random traits everyday
			for (var i in G.trait)
			{
				var me=G.trait[i];
				if (!G.has(me.name))
				{
					if (Math.random()<1/(me.chance*300))
					{
						if (G.checkReq(me.req) && G.testCost(me.cost,1))
						{
							G.doCost(me.cost,1);https://avatars0.githubusercontent.com/u/54317957?s=60&v=4
							G.gainTrait(me);
							G.Message({type:'important tall',text:'Your people have adopted the trait <b>'+me.displayName+'</b>.',icon:me.icon});
							if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
							{
								var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GainedTrait.mp3');
								audio.play(); 
							}
						}
					}
				}
			}
			
			G.trackedStat=Math.max(G.trackedStat,G.getRes('population').amount);
		}
	}
	
	G.funcs['tracked stat str']=function()
	{
		return 'Most population ruled';
	}
	
	G.funcs['civ blurb']=function()
	{
		var str='';
		str+='<div class="fancyText shadowed">'+
		'<font color="aqua"><div class="barred infoTitle">The land of '+G.getName('civ')+' </font></div>'+
		'<div class="barred">ruler : '+G.getName('ruler')+'</div>';
		var toParse='';
		var pop=G.getRes('population').amount;
		var technologiesam=G.techN;
		if (pop>0)
		{
			toParse+='Population : <b>'+B(pop)+' [population,'+G.getName((pop==1?'inhab':'inhabs'))+']</b>//';
			var stat=G.getRes('happiness').amount/pop;
			var text='unknown';if (stat<=-200) text='miserable'; else if (stat<=-100) text='mediocre'; else if (stat<=-50) text='low'; else if (stat<50) text='average'; else if (stat<100) text='pleasant'; else if (stat<=200) text='high'; else if (stat>=200) text='euphoric';
			toParse+='Happiness : <b>'+text+'</b>//';
			var stat=G.getRes('health').amount/pop;
			var text='unknown';if (stat<=-200) text='dreadful'; else if (stat<=-100) text='sickly'; else if (stat<=-50) text='low'; else if (stat<50) text='average'; else if (stat<100) text='good'; else if (stat<=200) text='gleaming'; else if (stat>=200) text='examplary';
			toParse+='Health : <b>'+text+'</b>//';
		}
		else toParse+='All '+G.getName('inhabs')+' have died out.';
		str+=G.parse(toParse);
		str+='</div>';
		return str;
	}
	
	G.funcs['found tile']=function(tile)
	{
		G.Message({type:'good',mergeId:'foundTile',textFunc:function(args){
			if (args.count==1) return 'Our explorers have found a new tile : <b>'+args.tile.land.displayName+'</b>.';
			else return 'Our explorers have found '+B(args.count)+' new tiles; the latest is <b>'+args.tile.land.displayName+'</b>.';
		},args:{tile:tile,count:1},icon:[14,4]});

	}
	
	G.funcs['production multiplier']=function()
	{
		var mult=1;
		if (G.getRes('population').amount>0)
		{
			var happiness=(G.getRes('happiness').amount/G.getRes('population').amount)/100;
			happiness=Math.max(-2,Math.min(2,happiness));
			if (happiness>=0) mult=(Math.pow(2,happiness+1)/2);
			else mult=1/(Math.pow(2,-happiness+1)/2);
		}
		return mult;
	}
		
	///////////////////////////////////////////////////////////////////////////////////////////////
	//G.hasNot is function that has inverted working rules than G.has//
	G.hasNot=function(what)
    {
        var me=G.getDict(what);
        var type=me.type;
        if (type=='tech' && G.techsOwnedNames.includes(what)) return false;
        else if (type=='trait' && G.traitsOwnedNames.includes(what)) return false;
        else if (type=='unit' && G.unitsOwnedNames.includes(what)) return false;
        return true;
    }
	/////////////////////////
//Fixes copied out of heritage mod
	G.fixTooltipIcons=function()
	{
		G.parse=function(what)
		{
			var str='<div class="par">'+((what
			.replaceAll(']s',',*PLURAL*]'))
			.replace(/\[(.*?)\]/gi,G.parseFunc))
			.replaceAll('http(s?)://','http$1:#SLASH#SLASH#')
			.replaceAll('//','</div><div class="par">')
			.replaceAll('#SLASH#SLASH#','//')
			.replaceAll('@','</div><div class="par bulleted">')
			.replaceAll('<>','</div><div class="divider"></div><div class="par">')+'</div>';
			return str;
		}
	}
	G.initializeFixIcons=function()
	{
		if (G.parse("http://").search("http://") == -1)
		{
			G.fixTooltipIcons();
			setTimeout(G.initializeFixIcons,500);	// check again to make sure this version of the function stays applied during page load
		}
	}
	G.initializeFixIcons();
//Magix tab
G.writeMSettingButton=function(obj)
	{
		G.pushCallback(function(obj){return function(){
			var div=l('MsettingButton-'+obj.id);
			if (div)
			{
				var me=G.getMSetting(obj.name);
				if (me.binary==true)
				{
					var on = (G.checkMSetting(obj.name)=="on");

					div.innerHTML=obj.text||me.name;
					if (on) div.classList.add('on');
				}

				div.onclick=function(div,name,value,siblings){return function(){G.clickMSettingButton(div,name,value,siblings);}}(div,obj.name,obj.value,obj.siblings);
				if (obj.tooltip) G.addTooltip(div,function(str){return function(){return str;};}(obj.tooltip),{offY:-8});
			}
		}}(obj));
		return '<div class="button" id="msettingButton-'+obj.id+'"></div>';
	}

	G.clickmSettingButton=function(div,name,value,siblings)
	{
		var me=G.getmSetting(name);

		if (me.binary)
		{
			if (G.checkmSetting(name)=="on")
			{
				G.setmSettingMode(me,me.modes["off"]);
			}
			else{
				G.setmSettingMode(me,me.modes["on"]);
			}
		}
		else
		{
			G.setmSettingMode(me,me.modes[value]);
		}

		if (div)
		{
			var on=(me.mode.id=="on");
			if (on) div.classList.add('on'); else div.classList.remove('on');
			if (siblings)
			{
				for (var i in siblings)
				{
					if (('msettingButton-'+siblings[i])!=div.id)
					{l('msettingButton-'+siblings[i]).classList.remove('on');}
				}
			}
		}
	}

	// A function to write each category of settings and buttons
	G.writeMSettingCategories=function()
	{
		var str='';
		for (c in G.mSettingCategory)
		{
			if (c=='hidden') continue;
			var category=G.mSettingCategory[c];
			str+='<div class="barred fancyText">'+category.displayName+'</div>';
			for (var i in G.mSetting)
			{
				var s = G.mSetting[i];
				if (s.hcategory == c)
				{
					if (s.type=='setting')
					{
						str+=G.writeSettingButton({
							id:s.id,
							name:s.name,
							text:s.displayName,
							tooltip:s.desc
						});
					} else {
						str+=G.writeMSettingButton({
							id:s.name,
							name:s.name,
							text:s.displayName,
							tooltip:s.desc,
						});
					}
				}
			}
			str+='<br /><br />';
		}
		return str;
	}

	// only add the tab once per page load (otherwise tab will duplicate itself with new game or mod reloading)
	for (t in G.tabs) {
		if (G.tabs[t].name=='Magix:About')
		{
			G.mSettingsLoaded = true;
		}
	}

	if (!G.mSettingsLoaded)
	{
		G.tabs.push({
			name:'Magix:About',
			id:'Magix',
			popup:true,
			addClass:'right',
			desc:'Options and information about the Magix mod.'
		});
		// Don't make assumptions about the existing tabs
		// (or another mod that does the same thing)
		// make sure everything is numbered and built properly
		for (var i=0;i<G.tabs.length;i++){G.tabs[i].I=i;}
		G.buildTabs();
		
	}

	G.tabPopup['Magix']=function()
	{
		var str='';
		str+='<div class="par">'+
		'<b>The Magix mod</b> is a mod for NeverEnding Legacy made by <b>pelletsstarPL</b>.'+'It is currently in early-beta, may feature strange and exotic bugs, and may be updated at any time.</div>'+'<div class="par">While in development, the mod may be unstable and subject to changes, but the overall goal is to '+
		'expand and improve the legacy with flexible, balanced, user-created content and improvements to existing mechanics.</div>'+
		'Below this description you will see something like Q&A with me.</div>'+
		'<div class="fancyText title">The Magix mod - why did I make this mod?</div>'+
		'<b>The Magix mod</b> has been made while i was wondering how legacy would look if last update was at February 2019(to 2017 it would be 3 more vanilla game updates) let\'s say.'+
		'I was checking bunch of mods and noticed... <b>There is none mod about magic... But I am gonna change it</b>.'+
		'As i said i did and effect of that is at your screen.'+
		'Even today i am proud of fruits of my creativity and time i sacrificed to make this entertaining mod.'+
		'I made this mod due to my hobby: IT. I like things like coding, networking. Who knows... maybe i will become expert of javascript.'+
		'<div class="fancyText title">Why does this mod have a lot of content?</div>'+
		'This mod has a lot of content thanks to my creativity.'+
		'Let\'s be serious. This mod will get more and more content sometime. These concepts, ideas... i have \'em a lot.'+
		'Not everything of my conceptions, imaginations will be added. I wanted to improve vanilla units too, hope you like it.'+
		'<div class="fancyText title">What will Magix get soon?</div>'+
		'I do not want to spoil and <b>ruin the fun</b> so i won\'t answer that question.:)'+
		'But i can say sooner or later if it will be <b>possible and reasonable</b> i may think about compatibilty with mods of other people.</div>'+
		'<div class="fancyText title">Will you add more wonders or portals?</div>'+
		'Yes i will... unless i run out of ideas so then i won\'t :D'+
		'<div class="fancyText title">How i can ask you by question which is not in Q&A there?</div>'+
		'Find me at <a href="https://discordapp.com/invite/cookie" target="_blank">Dashnet discord server</a><div>'+
		'<span style "color: #FF0000"><b>IMPORTANT NOTE! I am not responsible if some crazy bugs and issues will occur in debug mode</b></span>'+
		'<div class="barred fancyText"><a href="https://raw.githubusercontent.com/pelletsstarPL/Magixmod/master/Changelog" target="_blank">Update log</a><div><div>'+
		'<div class="divider"></div>'+
		G.writeMSettingCategories()+
		'<div class="divider"></div>'+
		'<div class="buttonBox">'+
		G.dialogue.getCloseButton()+
		'</div>';
		return str;
	}
var cssId = 'betaCss';  
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/beta.css';
    link.media = 'all';
    head.appendChild(link);
}
	/*=====================================================================================
	RESOURCES
	=======================================================================================*/
	G.resCategories={
			'main':{
				name:'<span style "color: #DA4F37">Essentials</span>',
				base:[],
				side:['population','worker','happiness','health','coin'],
		},
			'terr':{
				name:'Territory',
				base:['land'],
				side:['tl'],
		},
			'demog':{
				name:'<span style "color: #0DA42B">Demographics</span>',
				base:['baby','child','adult','elder','worker','sick','wounded'],
				side:['population','housing','corpse','burial spot','Alchemists'],
		},
			'food':{
				name:'<span style "color: #0080FF">Food & Water</span>',
				base:[],
				side:['food','spoiled food','water','muddy water','food storage','Juices','Spoiled juices'],
		},
			'build':{
				name:'<span style "color: #FFCCCC">Crafting & Construction</span>',
				base:[],
				side:['archaic building materials','basic building materials','advanced building materials','precious building materials','material storage'],
		},
			'gear':{
				name:'Gear',
				base:[],
				side:[],
		},
			'misc':{
				name:'Miscellaneous',
				base:[],
				side:['Paper','Magic essences','book storage'],
		},
			'flowersanddyes':{
				name:'<span style "color=green">Flowers & Dyes</span>',
				base:[],
				side:['Flowers','Dyes'],
		},
			'alchemypotions':{
				name:'<span style "color: #B266ff">Alchemy - Potions</span>', 
				base:[],
				side:['Basic brews','Alcohol brews','Medicament brews','combat potions'],
		},
			'alchemyingredients':{
				name:'<span style "color: #B266ff">Alchemy - Ingredients</span>', 
				base:[],
				side:[],
		},
			'seasonal':{
				name:'Seasonal', 
				base:[],
				side:[],
		},
	};
	
	new G.Res({name:'died this year',hidden:true});
	new G.Res({name:'born this year',hidden:true});
	
	var numbersInfo='//The number on the left is how many are in use, while the number on the right is how many you have in total.';
	
	new G.Res({
		name:'coin',
		displayName:'Coins',
		desc:'[#coin,Currency] has a multitude of uses, from paying the upkeep on units to purchasing various things.//Before the invention of currency, [food] is used instead.',
		icon:[13,1],
		replacement:'food',
		tick:function(me,tick)
		{
			if (me.replacement) me.hidden=true; else me.hidden=false;
		}
	});
	
	new G.Res({
		name:'population',
		desc:'Your [population] represents everyone living under your rule. These are the people that look to you for protection, survival, and glory.',
		meta:true,
		visible:true,
		icon:[0,3],
		tick:function(me,tick)
		{
			//this.displayName=G.getName('inhabs');
			
			if (me.amount>0)
			{
				//note : we also sneak in some stuff unrelated to population here
				//policy ticks
				if (tick%50==0)
				{
					if (G.hasNot('Policy revaluation')){
						var rituals=['fertility rituals','harvest rituals','flower rituals','wisdom rituals'];
						for (var i in rituals)
						{
							if (G.checkPolicy(rituals[i])=='on')
							{
								if (G.getRes('faith').amount<=0) G.setPolicyModeByName(rituals[i],'off');
								else G.lose('faith',1,'rituals');
							}
						}
					}else{
						var rituals=['fertility rituals','harvest rituals'];
						for (var i in rituals)
						{
							if (G.checkPolicy(rituals[i])=='on')
							{
								if (G.getRes('faith II').amount<=0) G.setPolicyModeByName(rituals[i],'off');
								else G.lose('faith II',0.1,'rituals');
							}
						}
					}
					var rituals=['harvest rituals for flowers'];
					for (var i in rituals)
					{
						if (G.checkPolicy(rituals[i])=='on')
						{
							if (G.hasNot('Policy revaluation')){
								if ((G.getRes('faith').amount<=0) || (G.getRes('influence').amount<=0)){ 
								G.setPolicyModeByName(rituals[i],'off');
								}else{
								G.lose('faith',1,'rituals')
								G.lose('influence',1,'rituals')
								}
							}else{
								if ((G.getRes('faith II').amount<=0) || (G.getRes('influence II').amount<=0)){ 
								G.setPolicyModeByName(rituals[i],'off');
								}else{
								G.lose('faith II',0.1,'rituals')
								G.lose('influence II',0.05,'rituals')
								}
							}
						}
					}
					var rituals=['Crafting & farm rituals'];
					for (var i in rituals)
					{
						if (G.checkPolicy(rituals[i])=='on')
						{
							if (G.hasNot('Policy revaluation')){
								if ((G.getRes('faith').amount<=0) || (G.getRes('influence').amount<=0)){ 
								G.setPolicyModeByName(rituals[i],'off');
								}else{
								G.lose('faith',15,'rituals')
								G.lose('influence',15,'rituals')
								}
							}else{
								if ((G.getRes('faith II').amount<=0) || (G.getRes('influence II').amount<=0)){ 
								G.setPolicyModeByName(rituals[i],'off');
								}else{
								G.lose('faith II',0.1,'rituals')
								G.lose('influence II',0.05,'rituals')
								}
							}
						}
					}
					if (G.has('ritualism II'))
					{
						var rituals=['wisdom rituals','flower rituals'];
						for (var i in rituals)
						{
							if (G.checkPolicy(rituals[i])=='on')
							{
								if (G.getRes('faith II').amount<=0) G.setPolicyModeByName(rituals[i],'off');
								else G.lose('faith II',1,'rituals');
							}
						}
					}
				}			
				
				var productionMult=G.doFunc('production multiplier',1);
				
				var deathUnhappinessMult=1;
				if (G.has('fear of death')) deathUnhappinessMult*=2;
				if (G.has('belief in the afterlife')) deathUnhappinessMult/=2;
				if (G.has('Hope of revenant abandoning')) deathUnhappinessMult/=2;
				if (G.has('dt12')) deathUnhappinessMult*=1.5;
				if (G.has('respect for the corpse')) deathUnhappinessMult/=1.25;
				if (tick%3==0 && G.checkPolicy('disable eating')=='off')
				{
					//drink water
					var toConsume=0;
					var weights={'baby':0.1,'child':0.3,'adult':0.5,'elder':0.5,'sick':0.4,'wounded':0.4,'Child alchemist':0.3,'Alchemist':0.5,'Instructor':0.5,'drunk':0.4};
					for (var i in weights)
					{toConsume+=G.getRes(i).amount*weights[i];}
					var rations=G.checkPolicy('water rations');
					if (rations=='none') {toConsume=0;G.gain('happiness',-me.amount*3,'water rations');G.gain('health',-me.amount*2,'water rations');}
					else if (rations=='meager') {toConsume*=0.5;G.gain('happiness',-me.amount*1,'water rations');G.gain('health',-me.amount*0.5,'water rations')}
					else if (rations=='plentiful') {toConsume*=1.5;G.gain('happiness',me.amount*1,'water rations');}
					toConsume=randomFloor(toConsume);
					var lacking=toConsume-G.lose('water',toConsume,'drinking');
					if (rations=='none') lacking=me.amount*0.5;
					if (lacking>0)//are we out of water?
					{
						//resort to muddy water
						if (rations!='none' && G.checkPolicy('drink muddy water')=='on') lacking=lacking-G.lose('muddy water',lacking,'drinking');
						if (lacking>0 && G.checkPolicy('disable aging')=='off')//are we also out of muddy water?
						{
							G.gain('happiness',-lacking*5,'no water');
							//die off
							var toDie=(lacking/5)*0.05;
							if (G.year<1) toDie/=5;//less deaths in the first year
							var died=0;
							var weights={'baby':0.1,'child':0.2,'adult':0.5,'elder':1,'sick':0.3,'wounded':0.3,'Child alchemist':0.3,'Alchemist':0.5,'Instructor':0.5,'drunk':0.4};//the elderly are the first to starve off
							var sum=0;for (var i in weights){sum+=weights[i];}for (var i in weights){weights[i]/=sum;}//normalize
							for (var i in weights){var ratio=(G.getRes(i).amount/me.amount);weights[i]=ratio+(1-ratio)*weights[i];}
							for (var i in weights)
							{var n=G.lose(i,randomFloor((Math.random()*0.8+0.2)*toDie*weights[i]),'dehydration');died+=n;}
							G.gain('corpse',died,'dehydration');
							G.gain('happiness',-died*20*deathUnhappinessMult,'dehydration');
							G.getRes('died this year').amount+=died;
							if (died>0) G.Message({type:'bad',mergeId:'diedDehydration',textFunc:function(args){return B(args.died)+' '+(args.died==1?'person':'people')+' died from dehydration.';},args:{died:died},icon:[5,4]});
						}
					}
					
					//eat food
					var toConsume=0;
					var consumeMult=1;
					var happinessAdd=0;
					if (G.has('culture of moderation')) {consumeMult*=0.85;happinessAdd-=0.1;}
					else if (G.has('joy of eating')) {consumeMult*=1.15;happinessAdd+=0.1;}
					var weights={'baby':0.2,'child':0.5,'adult':1,'elder':1,'sick':0.75,'wounded':0.75,'Child alchemist':0.3,'Alchemist':0.5,'Instructor':0.5,'drunk':0.4};
					for (var i in weights)
					{toConsume+=G.getRes(i).amount*weights[i];}
					var rations=G.checkPolicy('food rations');
					if (rations=='none') {toConsume=0;G.gain('happiness',-me.amount*3,'food rations');G.gain('health',-me.amount*2,'food rations');}
					else if (rations=='meager') {toConsume*=0.5;G.gain('happiness',-me.amount*1,'food rations');G.gain('health',-me.amount*0.5,'food rations');}
					else if (rations=='plentiful') {toConsume*=1.5;G.gain('happiness',me.amount*1,'food rations');}
					toConsume=randomFloor(toConsume*consumeMult);
					var consumed=G.lose('food',toConsume,'eating');
					G.gain('happiness',G.lose('salt',randomFloor(consumed*0.1),'eating')*5,'salting food');//use salt
					G.gain('happiness',consumed*happinessAdd,'food culture');
					var lacking=toConsume-consumed;
					if (rations=='none') lacking=me.amount*1;
					
					if (lacking>0)//are we out of food?
					{
						//resort to spoiled food
						if (rations!='none' && G.checkPolicy('eat spoiled food')=='on') lacking=lacking-G.lose('spoiled food',lacking,'eating');
						if (lacking>0 && G.checkPolicy('disable aging')=='off')//are we also out of spoiled food?
						{
							G.gain('happiness',-lacking*5,'no food');
							//die off
							var toDie=(lacking/5)*0.05;
							if (G.year<1) toDie/=5;//less deaths in the first year
							var died=0;
							var weights={'baby':0.1,'child':0.2,'adult':0.5,'elder':1,'sick':0.3,'wounded':0.3,'Child alchemist':0.3,'Alchemist':0.5,'Instructor':0.5,'drunk':0.4};//the elderly are the first to starve off
							var sum=0;for (var i in weights){sum+=weights[i];}for (var i in weights){weights[i]/=sum;}//normalize
							for (var i in weights){var ratio=(G.getRes(i).amount/me.amount);weights[i]=ratio+(1-ratio)*weights[i];}
							for (var i in weights)
							{var n=G.lose(i,randomFloor((Math.random()*0.8+0.2)*toDie*weights[i]),'starvation');died+=n;}
							G.gain('corpse',died,'starvation');
							G.gain('happiness',-died*20*deathUnhappinessMult,'starvation');
							G.getRes('died this year').amount+=died;
							if (died>0) G.Message({type:'bad',mergeId:'diedStarvation',textFunc:function(args){return B(args.died)+' '+(args.died==1?'person':'people')+' died from starvation.';},args:{died:died},icon:[5,4]});
						}
					}
				}
				
				//clothing
				var objects={'hardened clothes':[0.12,0.12],'Colored clothing':[0.1,0.1],'basic clothes':[0.1,0.1],'primitive clothes':[0,0]};
				var leftout=me.amount;
				var prev=leftout;
				var fulfilled=0;
				for (var i in objects)
				{
					fulfilled=Math.min(me.amount,Math.min(G.getRes(i).amount,leftout));
					G.gain('happiness',fulfilled*objects[i][0],'clothing');
					G.gain('health',fulfilled*objects[i][1],'clothing');
					leftout-=fulfilled;
				}
				if (G.has('dt10')){
				G.gain('happiness',-leftout*0.3,'no clothing'),
				G.gain('health',-leftout*0.3,'no clothing');
				}else{
				G.gain('happiness',-leftout*0.15,'no clothing'),
				G.gain('health',-leftout*0.15,'no clothing');
				}
					
				
				//fire
				var objects={'fire pit':[10,0.1,0.1]};
				var leftout=me.amount;
				var prev=leftout;
				var fulfilled=0;
				for (var i in objects)
				{
					fulfilled=Math.min(me.amount,Math.min(G.getRes(i).amount*objects[i][0],leftout));
					G.gain('happiness',fulfilled*objects[i][1],'warmth & light');
					G.gain('health',fulfilled*objects[i][2],'warmth & light');
					leftout-=fulfilled;
				}
				if (G.has('dt11')){
				G.gain('happiness',-leftout*0.2,'cold & darkness'),
				G.gain('health',-leftout*0.2,'cold & darkness');
				}else{
				G.gain('happiness',-leftout*0.1,'cold & darkness'),
				G.gain('health',-leftout*0.1,'cold & darkness');
				}
				
				//homelessness
				var homeless=Math.max(0,(me.amount)-G.getRes('housing').amount);
				if (G.has('sedentism') && me.amount>15 && homeless>0)
				{
					if (tick%10==0) G.Message({type:'bad',mergeId:'homeless',textFunc:function(args){return B(args.n)+' '+(args.n==1?'person is':'people are')+' homeless.<br>Homelessness with more than 15 population leads to lower birth rates.';},args:{n:homeless},replaceOnly:true,icon:[12,4]});
				}
				
				//age
				if (G.checkPolicy('disable aging')=='off')
				{
					if (G.year>=10)//no deaths of old age the first 10 years
					{
						var n=randomFloor(G.getRes('elder').amount*0.00035);
						G.gain('corpse',n,'old age');
						G.lose('elder',n,'old age');
						G.gain('happiness',-n*5*deathUnhappinessMult,'death');
						if (n>0) G.Message({type:'bad',mergeId:'diedAge',textFunc:function(args){return B(args.n)+' '+(args.n==1?'person':'people')+' died of old age.';},args:{n:n},icon:[13,4]});
						
						G.getRes('died this year').amount+=n;
					}
					if (G.year>=5)//no aging adults the first 5 years
					{
						var n=randomFloor(G.getRes('adult').amount*0.0002);
						G.gain('elder',n,'-');G.lose('adult',n,'aging up');
					}
					var n=randomFloor(G.getRes('child').amount*0.002);G.gain('adult',n,'aging up');G.lose('child',n,'aging up');
					var n=randomFloor(G.getRes('baby').amount*0.005);G.gain('child',n,'aging up');G.lose('baby',n,'aging up');
					
					//births
					var parents=G.getRes('adult').amount+G.getRes('elder').amount;
					if (parents>=2)//can't make babies by yourself
					{
						var born=0;
						var birthRate=1;
						if (me.amount<100) birthRate*=3;//more births if low pop
						if (me.amount<10) birthRate*=3;//even more births if very low pop
						if (G.checkPolicy('fertility rituals')=='on') birthRate*=1.2;
						if (G.checkPolicy('population control')=='forbidden') birthRate*=0;
						else if (G.checkPolicy('population control')=='limited') birthRate*=0.5;
						birthRate*=productionMult;
						if (homeless>0 && me.amount>15) birthRate*=0.05;//harder to make babies if you have more than 15 people and some of them are homeless
						var n=randomFloor(G.getRes('adult').amount*0.0003*birthRate);G.gain('baby',n,'birth');G.gain('happiness',n*10,'birth');born+=n;
						var n=randomFloor(G.getRes('elder').amount*0.00003*birthRate);G.gain('baby',n,'birth');G.gain('happiness',n*10,'birth');born+=n;
						G.getRes('born this year').amount+=born;
						if (born>0) G.Message({type:'good',mergeId:'born',textFunc:function(args){return B(args.born)+' '+(args.born==1?'baby has':'babies have')+' been born.';},args:{born:born},icon:[2,3]});
					}
					
					//health (diseases and wounds)
					//note : when a sick or wounded person recovers, they turn into adults; this means you could get a community of old people fall sick, then miraculously age back. life is a mystery
					
					//sickness
					var toChange=0.00003;
					if (G.getRes('health').amount<0)
					{
						toChange*=(1+Math.abs(G.getRes('health').amount/me.amount));
					}
					if (toChange>0)
					{
						if (G.year<5) toChange*=0.5;//less disease the first 5 years
						if (me.amount<=15) toChange*=0.5;
						if (G.checkPolicy('flower rituals')=='on') toChange*=0.8;
						var changed=0;
						var weights={'baby':2,'child':1.5,'adult':1,'elder':2};
						if (G.checkPolicy('child workforce')=='on') weights['child']*=2;
						if (G.checkPolicy('elder workforce')=='on') weights['elder']*=2;
						if (G.year<5) weights['adult']=0;//adults don't fall sick the first 5 years
						for (var i in weights)
						{var n=G.lose(i,randomFloor(Math.random()*G.getRes(i).amount*toChange*weights[i]),'-');changed+=n;}
						G.gain('sick',changed,'disease');
						if (changed>0) G.Message({type:'bad',mergeId:'fellSick',textFunc:function(args){return B(args.n)+' '+(args.n==1?'person':'people')+' fell sick.';},args:{n:changed},icon:[6,3]});
					}
					//sickness : death and recovery
					var sickMortality=0.005;
					var changed=0;
					var n=G.lose('sick',randomFloor(Math.random()*G.getRes('sick').amount*sickMortality),'disease');G.gain('corpse',n,'disease');changed+=n;
					G.gain('happiness',-changed*15*deathUnhappinessMult,'death');
					G.getRes('died this year').amount+=changed;
					if (changed>0) G.Message({type:'bad',mergeId:'diedSick',textFunc:function(args){return B(args.n)+' '+(args.n==1?'person':'people')+' died from disease.';},args:{n:changed},icon:[5,4]});
					
					var sickHealing=0.01;
					if (G.checkPolicy('flower rituals')=='on') sickHealing*=1.2;
					var changed=0;
					var n=G.lose('sick',randomFloor(Math.random()*G.getRes('sick').amount*sickHealing),'healing');G.gain('adult',n,'-');changed+=n;
					G.gain('happiness',changed*10,'recovery');
					if (changed>0) G.Message({type:'good',mergeId:'sickRecovered',textFunc:function(args){return B(args.n)+' sick '+(args.n==1?'person':'people')+' got better.';},args:{n:changed},icon:[4,3]});
					
					//wounds
					var toChange=0.00003;
					if (toChange>0)
					{
						if (G.year<5) toChange*=0.5;//less wounds the first 5 years
						if (me.amount<=15) toChange*=0.5;
						var changed=0;
						var weights={'baby':2,'child':1.5,'adult':1,'elder':2,'Child alchemist':0.3,'Alchemist':0.5,'Instructor':0.5};
						if (G.checkPolicy('child workforce')=='on') weights['child']*=3;
						if (G.checkPolicy('elder workforce')=='on') weights['elder']*=3;
						if (G.year<5) weights['adult']=0;//adults don't get wounded the first 5 years
						for (var i in weights)
						{var n=G.lose(i,randomFloor(Math.random()*G.getRes(i).amount*toChange*weights[i]),'-');changed+=n;}
						G.gain('wounded',changed,'accident');
						if (changed>0) G.Message({type:'bad',mergeId:'gotWounded',textFunc:function(args){return B(args.n)+' '+(args.n==1?'person':'people')+' got wounded.';},args:{n:changed},icon:[7,3]});
					}
					//wounds : death and recovery
					var woundMortality=0.005;
					var changed=0;
					var n=G.lose('wounded',randomFloor(Math.random()*G.getRes('wounded').amount*woundMortality),'wounds');G.gain('corpse',n,'wounds');changed+=n;
					G.gain('happiness',-changed*15*deathUnhappinessMult,'death');
					G.getRes('died this year').amount+=changed;
					if (changed>0) G.Message({type:'bad',mergeId:'diedWounded',textFunc:function(args){return B(args.n)+' '+(args.n==1?'person':'people')+' died from their wounds.';},args:{n:changed},icon:[5,4]});
					
					var sickHealing=0.005;
					var changed=0;
					var n=G.lose('wounded',randomFloor(Math.random()*G.getRes('wounded').amount*sickHealing),'healing');G.gain('adult',n,'-');changed+=n;
					G.gain('happiness',changed*10,'recovery');
					if (changed>0) G.Message({type:'good',mergeId:'woundedRecovered',textFunc:function(args){return B(args.n)+' '+(args.n==1?'person':'people')+' recovered from their wounds.';},args:{n:changed},icon:[4,3]});
				}
			}
			else if (G.T>0) {G.GameOver();}
			if (me.amount >= 500000 && G.achievByName['Metropoly'].won == 0){ //Apprentice achievement
			G.achievByName['Metropoly'].won = 1
			G.middleText('- Completed <font color="green">Metropoly</font> achievement -')
			}
		},
	});
	new G.Res({
		name:'baby',
		desc:'[baby,Babies] are what happens when you have 2 or more [adult,Adults] left to their own devices.//Any 2 adults can have babies, even if they are working. [elder]s can also have babies, though much slower.//[happiness] affects how many babies your people make.//Over time, babies will grow into [child,Children].//Babies drink and eat half as much as children.',
		startWith:0,
		visible:true,
		partOf:'population',
		icon:[2,3],
	});
	new G.Res({
		name:'child',
		desc:'[child,Children] grow from [baby,Babies] over time.//After a while, they will grow up into [adult,Adults].//Children drink and eat half as much as adults.//Children do not count as [worker,Workers], unless special measures are in place.',
		startWith:2,
		visible:true,
		partOf:'population',
		icon:[3,3],
	});
	new G.Res({
		name:'adult',
		desc:'[adult,Adults] grow from [child,Children] over time.//They eventually age into [elder,Elders].//Generally, adults make up most of your [worker,workforce].',
		startWith:5,
		visible:true,
		partOf:'population',
		icon:[4,3],
	});
	new G.Res({
		name:'elder',
		desc:'[adult,Adults] that grow old are [elder,Elders].//Elders may end up [corpse,dying] of old age.//Elders do not count as [worker,Workers], unless special measures are in place.',
		startWith:1,
		visible:true,
		partOf:'population',
		icon:[5,3],
	});
	new G.Res({
		name:'sick',
		desc:'[adult,People] can fall [sick,sick] when your [health] levels are too low. They do not [worker,work], but may be healed over time.',
		partOf:'population',
		icon:[6,3],
	});
	new G.Res({
		name:'wounded',
		desc:'[adult,People] may get [wounded,wounded] due to work injuries, or from war. They do not [worker,work], but may slowly get better over time.',
		partOf:'population',
		icon:[7,3],
	});
	new G.Res({
		name:'corpse',
		desc:'[corpse,Corpses] are the remains of [population,People] that died, whether from old age, accident, disease, starvation or war.//Corpses left in the open air tend to spread diseases and make people unhappy, which gets even worse as superstitions develop. To mitigate this, you need a [burial spot] for each corpse.',
		startWith:0,
		icon:[8,3],
		tick:function(me,tick)
		{
			var graves=G.getRes('burial spot');
			if (G.getRes('population').amount>0)
			{
				if (G.has('ritual necrophagy') && G.hasNot('respect for the corpse'))//butcher 3% of corpses every day, you weirdo
				{
					var changed=0;
					var n=G.lose('corpse',randomFloor(G.getRes('corpse').amount*0.03),'necrophagy');G.gain('meat',n*30,'necrophagy');G.gain('bone',n*5,'necrophagy');changed+=n;
					if (n>0)
					{
						G.pseudoGather(G.getRes('faith'),changed);
						G.gain('health',-changed*0.1,'necrophagy');
					}
				}
				if (me.amount>0)
				{
					//bury slowly
					if (graves.amount>graves.used)
					{
						var amount=Math.min(graves.amount-graves.used,Math.max(1,randomFloor(me.amount*0.1)));
						graves.used+=amount;G.lose('corpse',amount,'burial');
						G.gain('happiness',amount*2,'burial');
					}
				}
			}
			if (graves.amount<graves.used)
			{
				//more occupied burial spots than total burial spots? this means we've been deleting burial spot that was already containing corpses; exhume those suckers
				var toExhume=randomFloor((graves.used-graves.amount)*0.1);
				graves.used-=toExhume;
				G.gain('corpse',toExhume,'not enough burial spots');
			}
			//Normally
			var toSpoil=me.amount*0.001;
			var spent=G.lose('corpse',randomFloor(toSpoil),'decay');
			
			var unhappiness=0.01;
			if (G.has('burial')) unhappiness*=2;
			if (G.has('belief in revenants')) unhappiness*=2;
			G.gain('happiness',-me.amount*unhappiness,'corpses');
			G.gain('health',-me.amount*0.02,'corpses');
			//Corpse decay trait: Normal decay still works and each dark wormhole can increase rate of corpses that will get decayed(?)
			if(G.has('Corpse decay')){
			var toSpoil=me.amount*0.002*(G.getRes('corpsedecaypoint').amount);
			var spent=G.lose('corpse',randomFloor(toSpoil),'Dark wormhole\' ability(Corpse decay)');
			}
			if(G.has('respect for the corpse')){
				G.getDict('ritual necrophagy').desc='<b><font color="fuschia">Becuase you obtained [respect for the corpse] the effect of this trait is disabled. You can unlock new way better way to bury [corpse]s. Previous was so cruel making corpses willing revenge. Your people were:</font></b>@slowly turning [corpse]s into [meat] and [bone]s, creating some [faith] but harming [health]'
			}
		},	
	});
	new G.Res({
		name:'burial spot',
		desc:'Each [burial spot] has enough room for one [corpse], letting you prevent the spread of disease and unhappiness.//By default, corpses are buried at the rate of 1 per day.//The number on the left is how many burial spots are occupied, while the number on the right is how many you have in total.',
		icon:[13,4],
		displayUsed:true,
	});
		new G.Res({
		name:'tl',
		displayName:'Total land',
		desc:'This is the total land your people discovered from all worlds people discovered this run.',
		icon:[23,18,'magixmod'],
		meta:true,
	});
	new G.Res({
		name:'housing',
		desc:'Each [housing,Housing spot] accommodates one [population,Person].//Beyond the 15 people a nomad tribe can support, your population will only grow if you have empty housing.//Homelessness (having less housing than population) will lead to unhappiness and disease.//The number on the left is how much housing is occupied, while the number on the right is how much housing room you have in total.',
		icon:[12,4],
		getDisplayAmount:function()
		{
			return B(Math.min(this.displayedAmount,G.getRes('population').displayedAmount))+'<wbr>/'+B(this.displayedAmount);
		},
	});
	new G.Res({
		name:'land',
		desc:'Each tile of territory you own grants you some [land] (100 per fully-explored non-ocean tile, by default) upon which you can construct buildings. If for some reason you find yourself with less land than your buildings are using, some of them will start to slowly crumble away.//The number on the left is how much land is occupied, while the number on the right is how much land you have in total.',
		icon:[14,4],
		displayUsed:true,
		partOf:'tl',
		tick:function(me)
		{
			me.amount=Math.ceil(G.currentMap.territoryByOwner[1]*100);
		},
		getDisplayAmount:function()
		{
			return B(this.displayedUsedAmount)+'<wbr>/'+B(this.displayedAmount);
		},
	});
	new G.Res({
		name:'worker',
		desc:'Your [worker,Workforce] is the part of your [population] that is ready to work.//The number on the left is how many are currently being employed, while the number on the right is your total amount of workers.',
		startWith:0,
		visible:true,
		icon:[1,3],
		displayUsed:true,
		tick:function(me,tick)
		{
			me.amount=G.getRes('adult').amount;
			if (G.checkPolicy('elder workforce')=='on') me.amount+=G.getRes('elder').amount;
			if (G.checkPolicy('child workforce')=='on') me.amount+=G.getRes('child').amount;
			if (me.used>me.amount)
			{
				//TODO maybe ?
				//select all units that require workers
				//pick some at random until we have enough people to reach the difference between workers and workers needed
				//kill them if the unit has no gizmos, otherwise reduce the unit's percent by 1 rank
				//maybe this could be generalized to work will all requirements
				//or not ? some requirements have unique conditions, such as : 10 factories running at 50% only use half the workers and tools, but still need 10 land
				//maybe this could just be a flag on land, reqIgnoresPercent=true
				//but then how do we deal with the situation where we have less land available than land used (like after a war where we lost tiles) ? the desired behavior would be that buildings slowly die off until we're under the threshold
				//maybe just implement a "onReqFail" function that overrides the default behavior
			}
		},
	});
	
	new G.Res({
		name:'happiness',
		desc:'[happiness] describes the global level of well-being of your [population].//Happy people work even harder, while unhappy people tend to slack off; at +100% happiness, most of your workers will work twice as fast, while at -100% happiness, they will work twice as slow. This goes on up to +200% and -200%.//Several things improve happiness, such as good [food,food], entertainment, or luxury items; things that bring down happiness are spoiled food, starvation, disease, death and harsh policies.//Happiness and unhappiness both tend to level off over time.',
		startWith:0,
		visible:true,
		icon:[3,4],
		fractional:true,
		tick:function(me,tick)
		{
		},
		getDisplayAmount:function()
		{
			if (G.getRes('population').amount<=0) return '-';
			var amount=(this.displayedAmount/G.getRes('population').displayedAmount);
			if(G.checkPolicy('se07')=='on'){//Herbalia's backfire
			if (amount>175) amount=175;
			if (amount<-200) amount=-200;
			}else{
			if (amount>200) amount=200;
			if (amount<-200) amount=-200;
			}
			return B(amount)+'%';
		},
		getIcon:function(me)
		{
			if (G.getRes('population').amount<=0) return [5,4];
			else
			{
				var amount=me.amount/G.getRes('population').amount;
				if (amount>=100) return [4,4];
				else if (amount>=50) return [3,4];
				else if (amount>=-50) return [2,4];
				else if (amount>=-100) return [1,4];
				else return [0,4];
			}
		},
	});
	
	new G.Res({
		name:'health',
		desc:'[health] represents the average physical condition of your [population].//Lower health tends to make people [sick] and unhappy, while higher health will make people happier.//Health can be affected by a number of things : eating raw or spoiled [spoiled food,Food], drinking [muddy water], poor living conditions, and ongoing plagues.',
		startWith:0,
		visible:true,
		icon:[3,5],
		fractional:true,
		tick:function(me,tick)
		{
			if (G.getRes('population').amount>0 && tick%2==0)
			{
				//note : this is "soft" sickness; it affects the chance of people falling sick
				//G.getRes('happiness').amount+=(me.amount-G.getRes('happiness').amount)*0.01;
				G.gain('happiness',me.amount*0.001,'health');
				
				var sickness=0.1;
				sickness+=Math.pow(Math.max(0,G.getRes('population').amount-50),0.1)*0.1;//more people means more contagion
				G.gain('health',-G.getRes('population').amount*(Math.random()*sickness),'disease');//people randomly get sick
				var recovery=0.98;
				me.amount*=recovery;//people recover over time
			}
		},
		getDisplayAmount:function()
		{
			if (G.getRes('population').amount<=0) return '-';
			return B(this.displayedAmount/G.getRes('population').displayedAmount)+'%';
			
		},
		getIcon:function(me)
		{
			if (G.getRes('population').amount<=0) return [5,5];
			else
			{
				var amount=me.amount/G.getRes('population').amount;
				if (amount>=100) return [4,5];
				else if (amount>=50) return [3,5];
				else if (amount>=-50) return [2,5];
				else if (amount>=-100) return [1,5];
				else return [0,5];
			}
		},
	});
	
	new G.Res({
		name:'food storage',
		desc:'Each [food storage] unit slows down decay for one [food] unit.//The number on the left is how much food storage is occupied, while the number on the right is how much you have in total.',
		icon:[12,5],
		tick:function(me,tick)
		{
			var amount=0;
			amount+=G.getRes('Precious pot').amount*27;
			amount+=G.getRes('basket').amount*10;
			amount+=G.getRes('pot').amount*25;
			amount+=G.getRes('ice').amount;
			amount+=G.getRes('added food storage').amount;
			me.amount=amount;
		},
		getDisplayAmount:function()
		{
			return B(Math.min(this.displayedAmount,G.getRes('food').displayedAmount))+'<wbr>/'+B(this.displayedAmount);
		},
	});
	new G.Res({
		name:'added food storage',
		//food storage added by buildings
		desc:'',
		icon:[12,5],
		hidden:true,
	});
	
	new G.Res({
		name:'material storage',
		desc:'Each [material storage] unit lowers the rate of decay or theft for one unit of your materials.//The number on the left is how much material storage is occupied, while the number on the right is how much you have in total.',
		icon:[14,5],
		tick:function(me,tick)
		{
			var amount=0;
			amount+=G.getRes('added material storage').amount;
			me.amount=amount;
			
			var materials=0;
			for (var i in G.props['perishable materials list'])
			{
				var mat=G.props['perishable materials list'][i];
				materials+=mat.amount;
			}
			me.used=materials;
			
			if (materials>0)
			{
				var stored=Math.min(materials,amount)/materials;
				var notStored=1-stored;
				
				for (var i in G.props['perishable materials list'])
				{
					var mat=G.props['perishable materials list'][i];
					
					var toSpoil=mat.amount*0.002*notStored+mat.amount*0.0001*stored;
					var spent=G.lose(mat.name,randomFloor(toSpoil),'decay');
				}
			}
			
			G.props['perishable materials list']=[];
		},
		getDisplayAmount:function()
		{
			return B(Math.min(this.displayedAmount,this.displayedUsedAmount))+'<wbr>/'+B(this.displayedAmount);
		},
		displayUsed:true,
	});
	new G.Res({
		name:'added material storage',
		//material storage added by buildings
		desc:'',
		icon:[14,5],
		hidden:true,
	});
	
	new G.Res({
		name:'water',
		desc:'[water] is required to keep your [population,people] hydrated, at the rate of half a unit per person every 3 ticks (although babies and children drink less).//Without water, people will resort to drinking [muddy water], which is unhealthy; if that runs out too, your people will simply die off.//Most terrains have some fresh water up for gathering - from ponds, streams and rain; drier locations will have to rely on well digging.//Water turns into [muddy water] over time, if your water storage is insufficient.',
		icon:[7,6],
		startWith:250,
		visible:true,
		turnToByContext:{'drinking':{'health':0.01,'happiness':0}},
		tick:function(me,tick)
		{
			if (G.checkPolicy('disable spoiling')=='off')
			{
				var toSpoil=me.amount*0.02;
				var spent=G.lose('water',randomFloor(toSpoil),'decay');
				G.gain('muddy water',randomFloor(spent),'decay');
			}
			if (G.checkPolicy('Toggle SFX')=='off'){
				
			 }
		},
	});
	new G.Res({
		name:'muddy water',
		desc:'[muddy water] tastes awful and is unhealthy, but is better than dying of thirst. Your people will default to drinking it in the absence of fresh [water].//Muddy water can be collected while gathering, from stagnant pools or old rainwater; [water] also turns into muddy water over time, if not stored properly. Additionally, muddy water itself will slowly dry out.',
		icon:[8,6],
		visible:true,
		turnToByContext:{'drinking':{'health':-0.03,'happiness':-0.05}},
		tick:function(me,tick)
		{
			if (G.checkPolicy('disable spoiling')=='off')
			{
				var toSpoil=me.amount*0.01;
				var spent=G.lose('muddy water',randomFloor(toSpoil),'decay');
			}
		},
	});
	
	new G.Res({
		name:'food',
		desc:'[food] is consumed by your [population,people] when they get hungry, at the rate of 1 unit per person every 3 ticks (although babies and children eat less).//Some types of food are tastier or healthier than others.//Note that some food types may or may not be eaten depending on policies in place.//Food will slowly decay into [spoiled food] if you lack proper food storage.',
		meta:true,
		visible:true,
		icon:[3,6],
		tick:function(me,tick)
		{
			if (me.amount>0 && G.checkPolicy('disable spoiling')=='off')
			{
				var stored=Math.min(me.amount,G.getRes('food storage').amount)/me.amount;
				var notStored=1-stored;
				
				var toSpoil=me.amount*0.01*notStored+me.amount*0.0005*stored;
				var spent=G.lose('food',randomFloor(toSpoil),'decay');
				//G.gain('spoiled food',randomFloor(spent));
			}
		},
	});
	new G.Res({
		name:'spoiled food',
		desc:'[spoiled food] is eaten when no other [food] is available, in a last-ditch effort to fend off starvation.//Spoiled food is terribly unhealthy and tastes just as bad. Over time, it will decay even further into inedibility.',
		icon:[3,7],
		visible:true,
		turnToByContext:{'eating':{'health':-0.3,'happiness':-0.5}},
		tick:function(me,tick)
		{
			if (G.checkPolicy('disable spoiling')=='off')
			{
				var toSpoil=me.amount*0.001;
				var spent=G.lose('spoiled food',randomFloor(toSpoil),'decay');
			}
		},
	});
	
	//a trick to make different food types spoil at different speeds : turnToByContext:{'decay':{'fruit':0.2}} would make fruit last 20% longer (note : the food may still produce spoiled food)
	
	new G.Res({
		name:'herb',
		desc:'[herb,Herbs] are various plants, roots and mushrooms that can be collected by simply foraging around. While relatively healthy to eat, they tend to taste fairly unpleasant.',
		icon:[4,6],
		startWith:250,
		turnToByContext:{'eating':{'health':0.005,'happiness':-0.03},'decay':{'herb':0.2,'spoiled food':0.8}},
		partOf:'food',
		tick:function(me,tick)
		{
			if (G.getRes('population').amount>0 && tick%2==0)
			{
				me.amount*=0.99;
			}
			//WOrking after hours
			if (G.checkPolicy('Factory of pots production rates')=='2')
			{
				var toSpoil=G.getRes('happiness').amount*0.01;
				var spent=G.lose('happiness',randomFloor(toSpoil),'working after hours');
			}
			if (G.checkPolicy('Hovel of colours production rates')=='2')
			{
				var toSpoil=G.getRes('happiness').amount*0.01;
				var spent=G.lose('happiness',randomFloor(toSpoil),'working after hours');
			}
			if (G.checkPolicy('Hut of potters production rates')=='2')
			{
				var toSpoil=G.getRes('happiness').amount*0.01;
				var spent=G.lose('happiness',randomFloor(toSpoil),'working after hours');
			}
			if (G.checkPolicy('Leather factory production rates')=='2')
			{
				var toSpoil=G.getRes('happiness').amount*0.01;
				var spent=G.lose('happiness',randomFloor(toSpoil),'working after hours');
			}
			if (G.checkPolicy('Toggle SFX')=='off') //Toggle SFX
			{
				G.getDict('Toggle SFX').icon = [29,1,'magixmod'];
			}
			if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
			{
				G.getDict('Toggle SFX').icon = [29,0,'magixmod'];
			}
		},
		category:'food',
	});
	new G.Res({
		name:'fruit',
		desc:'[fruit,Fruits], whether gathered from berry bushes or fruit trees, are both sweet-tasting and good for you.',
		icon:[4,7],
		turnToByContext:{'eating':{'health':0.02,'happiness':0.0075},'decay':{'spoiled food':1}},
		partOf:'food',
		category:'food',
	});
	let modes4=false
	new G.Res({
		name:'meat',
		desc:'[meat,Raw meat] is gathered from dead animals and, while fairly tasty, can harbor a variety of diseases.',
		icon:[5,7],
		turnToByContext:{'eating':{'health':-0.03,'happiness':0.01,'bone':0.1},'decay':{'spoiled food':1}},
		partOf:'food',
		tick:function(me,tick)   
		{
			///On purpose crash. Occurs while playing market without magix utils
			if(G.modsByName['Market mod'] && !G.modsByName['Magix utils for market']){
				console.log('Install Magix utilities for market mod! Caused on-purpose game crash.');
				G.middleText('Install Magix utilities for market mod!<hr><br><small>Caused on-purpose game crash</small>',slow)
				
			}
		},
		category:'food',
	});
	new G.Res({
		name:'cooked meat',
		desc:'Eating [cooked meat] is deeply satisfying and may even produce a [bone].',
		icon:[6,7],
		turnToByContext:{'eating':{'health':0.02,'happiness':0.0275,'bone':0.1},'decay':{'cooked meat':0.2,'spoiled food':0.8}},
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'cured meat',
		desc:'[cured meat] is interestingly tough and can keep for months without spoiling.',
		icon:[11,6],
		turnToByContext:{'eating':{'health':0.02,'happiness':0.02,'bone':0.1},'decay':{'cured meat':0.95,'spoiled food':0.05}},
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'seafood',
		desc:'[seafood,Raw seafood] such as fish, clams, or shrimps, is both bland-tasting and several kinds of nasty.',
		icon:[5,6],
		turnToByContext:{'eating':{'health':-0.02,'happiness':0.005,'bone':0.02},'decay':{'spoiled food':1}},
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'cooked seafood',
		desc:'[cooked seafood] tastes pretty good and has various health benefits.',
		icon:[6,6],
		turnToByContext:{'eating':{'health':0.03,'happiness':0.02,'bone':0.02},'decay':{'cooked seafood':0.2,'spoiled food':0.8}},
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'cured seafood',
		desc:'[cured seafood] has a nice smoky flavor and lasts terribly long.',
		icon:[12,6],
		turnToByContext:{'eating':{'health':0.02,'happiness':0.0275,'bone':0.02},'decay':{'cured seafood':0.95,'spoiled food':0.05}},
		partOf:'food',
		category:'food',
	});
	
	new G.Res({
		name:'bread',
		desc:'[bread] is filling, nutritious, and usually not unpleasant to eat; for these reasons, it is often adopted as staple food by those who can produce it.',
		icon:[7,7],
		turnToByContext:{'eating':{'health':0.02,'happiness':0.0175},'decay':{'spoiled food':1}},
		partOf:'food',
		category:'food',
	});
	
	new G.Res({
		name:'bugs',
		desc:'Worms, insects, spiders - [bugs] are easily caught, but are usually not considered [food].',
		icon:[8,11],
		turnToByContext:{'eating':{'health':0,'happiness':-0.05},'decay':{'spoiled food':0.5}},
		//partOf:'food',
		category:'food',
		tick:function(me,tick)
		{
			var toLose=me.amount*0.003;//bugs don't like to stick around
			var spent=G.lose(me.name,randomFloor(toLose),'decay');
		}
	});
	
	
	G.props['perishable materials list']=[];
	
	var loseMaterialsTick=function(me,tick)
	{
		if (G.checkPolicy('disable spoiling')=='off')
		{
			G.props['perishable materials list'].push(me);
		}
	};
	//MAMUUN'S PENALTY/BACKFIRE
	var loseArchaicMaterialsTick=function(me,tick)
	{
		if (G.checkPolicy('se10')=='on')
		{
			var toSpoil=G.getRes('archaic building materials').amount*0.002*1.4;
			var spent=G.lose('archaic building materials',randomFloor(toSpoil),'decay');
		}else{
			var toSpoil=G.getRes('archaic building materials').amount*0.002;
			var spent=G.lose('archaic building materials',randomFloor(toSpoil),'decay');
		}
	};
	var loseBasicMaterialsTick=function(me,tick)
	{
		if (G.checkPolicy('se10')=='on')
		{
			var toSpoil=G.getRes('basic building materials').amount*0.003*1.12;
			var spent=G.lose('basic building materials',randomFloor(toSpoil),'decay');
		}else{
			var toSpoil=G.getRes('basic building materials').amount*0.003;
			var spent=G.lose('basic building materials',randomFloor(toSpoil),'decay');
		}
	};
	var loseAdvancedMaterialsTick=function(me,tick)
	{
		if (G.checkPolicy('se10')=='on')
		{
			var toSpoil=G.getRes('advanced building materials').amount*0.003*1.03;
			var spent=G.lose('advanced building materials',randomFloor(toSpoil),'decay');
		}else{
			var toSpoil=G.getRes('advanced building materials').amount*0.003;
			var spent=G.lose('advanced building materials',randomFloor(toSpoil),'decay');
		}
	};
	//MAMUUN'S POSITIVE EFFECT
	var losePreciousMaterialsTick=function(me,tick)
	{
		if (G.checkPolicy('se10')=='on')
		{
			var toSpoil=G.getRes('precious building materials').amount*0.0009*0.97;
			var spent=G.lose('precious building materials',randomFloor(toSpoil),'decay');
		}else{
			var toSpoil=G.getRes('precious building materials').amount*0.0009;
			var spent=G.lose('precious building materials',randomFloor(toSpoil),'decay');
		}
	};
	
	
	new G.Res({
		//hidden, used for every material that can be stored in a warehouse that isn't part of any other material
		name:'misc materials',
		meta:true,
		tick:loseMaterialsTick,
		hidden:true,
	});
	
	new G.Res({
		name:'archaic building materials',
		desc:'Materials such as [stick]s and [stone]s, used to build rudimentary structures.',
		icon:[2,7],
		meta:true,
		tick:loseArchaicMaterialsTick
	});
	new G.Res({
		name:'stone',
		desc:'Just a simple rock. Found regularly when foraging, and even more commonly when digging, mining or quarrying.',
		icon:[2,6],
		partOf:'archaic building materials',
		category:'build',
	});
	new G.Res({
		name:'stick',
		desc:'A short but sturdy branch. Obtained when foraging or when felling a tree.',
		icon:[0,6],
		partOf:'archaic building materials',
		category:'build',
	});
	new G.Res({
		name:'limestone',
		desc:'A fairly soft mineral. Can be foraged from some places, but is more commonly extracted while mining or quarrying.',
		icon:[6,8],
		partOf:'archaic building materials',
		category:'build',
	});
	new G.Res({
		name:'mud',
		desc:'Dirt saturated with water; found often when foraging or digging.',
		icon:[0,7],
		partOf:'archaic building materials',
		category:'build',
	});
	
	new G.Res({
		name:'basic building materials',
		desc:'Processed materials such as [cut stone,Stone blocks], [brick]s and [lumber], used to build basic structures.',
		icon:[2,8],
		meta:true,
		tick:loseBasicMaterialsTick,
	});
	new G.Res({
		name:'cut stone',
		desc:'[stone]s carved into blocks for easier hauling and building.',
		icon:[0,8],
		partOf:'basic building materials',
		category:'build',
	});
	new G.Res({
		name:'log',
		desc:'Chopped wood that can be directly used in construction, but can also be processed into [lumber].',
		icon:[1,6],
		partOf:'basic building materials',
		category:'build',
	});
	new G.Res({
		name:'lumber',
		desc:'[log]s that have been processed into planks, making them an adaptable and resilient building material.',
		icon:[1,8],
		partOf:'basic building materials',
		category:'build',
	});
	new G.Res({
		name:'clay',
		desc:'Found by digging in damp soil; can be baked into [brick]s.',
		icon:[1,7],
		partOf:'misc materials',
		category:'build',
	});
	new G.Res({
		name:'brick',
		desc:'Made from fired [clay]; can be used to construct solid walls efficiently.',
		icon:[3,8],
		partOf:'basic building materials',
		category:'build',
	});
	
	new G.Res({
		name:'advanced building materials',
		desc:'Building materials such as [concrete] and [glass], used to build advanced structures.',
		icon:[3,9],
		meta:true,
		tick:loseAdvancedMaterialsTick,
	});
	new G.Res({
		name:'sand',
		desc:'Easily harvested from deserts and beaches; may be processed into [glass].',
		icon:[4,9],
		partOf:'misc materials',
		category:'build',
	});
	new G.Res({
		name:'glass',
		desc:'Obtained by melting [sand]; can be used to construct windows, which are part of most advanced buildings.',
		icon:[4,8],
		partOf:'advanced building materials',
		category:'build',
	});
	new G.Res({
		name:'concrete',
		desc:'An exceptionally sturdy construction material, made by mixing [limestone] with [water] and letting it set.',
		icon:[5,8],
		partOf:'advanced building materials',
		category:'build',
	});
	
	new G.Res({
		name:'precious building materials',
		desc:'Building materials such as [marble], used to build monuments.',
		icon:[16,8],
		meta:true,
		tick:losePreciousMaterialsTick,
	});
	new G.Res({
		name:'marble',
		desc:'A construction material prized for its decorative properties, that can also be employed in sculptures.',
		icon:[7,8],
		partOf:'precious building materials',
		category:'build',
	});
	new G.Res({
		name:'gold block',
		desc:'A valuable, if unreliable construction material.',
		icon:[14,8],
		partOf:'precious building materials',
		category:'build',
	});
	new G.Res({
		name:'gem block',
		desc:'A precious building material used only for the finest monuments.',
		icon:[choose([17,18]),8],//i can't pick
		partOf:'precious building materials',
		category:'build',
	});
	
	new G.Res({
		name:'copper ore',
		desc:'Ore that can be processed into [soft metal ingot]s.',
		icon:[9,8],
		partOf:'misc materials',
		category:'build',
	});
	new G.Res({
		name:'iron ore',
		desc:'Ore that can be processed into [hard metal ingot]s.',
		icon:[10,8],
		partOf:'misc materials',
		category:'build',
	});
	new G.Res({
		name:'gold ore',
		desc:'Ore that can be processed into [precious metal ingot]s.',
		icon:[11,8],
		partOf:'misc materials',
		category:'build',
	});
	new G.Res({
		name:'tin ore',
		desc:'Ore that can be processed into [soft metal ingot]s.',
		icon:[13,8],
		partOf:'misc materials',
		category:'build',
	});
	
	new G.Res({
		name:'gems',
		desc:'Shiny, valuable minerals from deep under the earth.',
		icon:[7,9],
		partOf:'misc materials',
		category:'build',
	});
	
	new G.Res({
		name:'coal',
		desc:'Extracted from mines; makes a good source of energy, and can be used in alloying.',
		icon:[12,8],
		partOf:'misc materials',
		category:'build',
	});
	
	new G.Res({
		name:'soft metal ingot',
		desc:'Soft, malleable metal that can be used to make basic [metal tools].//Includes tin and copper.',
		icon:[9,9],
		partOf:'misc materials',
		category:'build',
	});
	new G.Res({
		name:'hard metal ingot',
		desc:'Tough, durable metal that can be used to craft [metal tools] and weapons.//Includes iron and bronze.',
		icon:[10,9],
		partOf:'misc materials',
		category:'build',
	});
	new G.Res({
		name:'strong metal ingot',
		desc:'Solid metal possessing high tensile strength.//Includes steel.',
		icon:[12,9],
		partOf:'misc materials',
		category:'build',
	});
	new G.Res({
		name:'precious metal ingot',
		desc:'Metal with little industrial usefulness but imbued with valuable aesthetics.//Includes gold and silver.',
		icon:[11,9],
		partOf:'misc materials',
		category:'build',
	});
	
	new G.Res({
		name:'knapped tools',
		desc:'Rudimentary tools made by hitting [stone]s, usually flint, until their edges are sharp enough.'+numbersInfo,
		icon:[0,9],
		displayUsed:true,
		category:'gear',
	});
	new G.Res({
		name:'stone tools',
		desc:'Simple tools made of [stone]s and [stick]s for a variety of purposes - hammering, cutting, piercing, crushing.'+numbersInfo,
		icon:[1,9],
		displayUsed:true,
		category:'gear',
	});
	new G.Res({
		name:'metal tools',
		desc:'Solid, durable tools made of metal and wood.'+numbersInfo,
		icon:[2,9],
		displayUsed:true,
		category:'gear',
	});
	
	new G.Res({
		name:'stone weapons',
		desc:'Simple weapons made of [stone]s and [stick]s.'+numbersInfo,
		icon:[5,9],
		displayUsed:true,
		category:'gear',
	});
	new G.Res({
		name:'bow',
		desc:'A weapon made of [stick,Wood] that fires [stone]-tipped arrows at a distance.'+numbersInfo,
		icon:[6,9],
		displayUsed:true,
		category:'gear',
	});
	
	var clothesInfo='//Your people automatically wear the highest-quality clothing available, moving on to the next type if there isn\'t enough.';
	new G.Res({
		name:'primitive clothes',
		desc:'Made out of rudimentary materials such as [hide]s or [herb]s.//Each [population,Person] wearing clothing is slightly happier and healthier.'+clothesInfo,
		icon:[15,7],
		category:'gear',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.005;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			if (G.year>=8999 && G.year<=9001 && G.day==10) 
			{
					var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/EasterEgg.mp3');
					audio.play(); 
			}
		},
	});
	new G.Res({
		name:'basic clothes',
		desc:'Sewn together from [leather] or textile fiber.//Each [population,Person] wearing clothing is slightly happier and healthier.'+clothesInfo,
		icon:[16,7],
		category:'gear',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.002;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
	
	new G.Res({
		name:'bone',
		desc:'Obtained from the corpse of an animal, or discarded from eating flesh.',
		icon:[8,7],
		partOf:'misc materials',
		category:'build',
	});
	new G.Res({
		name:'hide',
		desc:'A pelt obtained by slicing the skin off a dead animal.',
		icon:[9,7],
		partOf:'misc materials',
		category:'build',
	});
	new G.Res({
		name:'leather',
		desc:'[hide] that has been cured and worked to make it strong and durable for a variety of uses.',
		icon:[10,7],
		partOf:'misc materials',
		category:'build',
	});
	new G.Res({
		name:'statuette',
		desc:'A small idol that was rudimentarily carved from [stone] or [bone].//May be used up over time, creating [culture].',
		icon:[8,9],
		partOf:'misc materials',
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			G.pseudoGather(G.getRes('culture'),randomFloor(spent));
		},
	});
	new G.Res({
		name:'salt',
		desc:'Gives flavor to [food], rendering it more enjoyable to eat; may also be used to preserve food and make it last longer.',
		icon:[11,7],
		partOf:'misc materials',
		category:'misc',
	});
	new G.Res({
		name:'ice',
		desc:'Can be used to preserve [food] longer.//Will melt into [water] over time.',
		icon:[12,7],
		partOf:'misc materials',
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			G.gain('water',randomFloor(spent*10),'ice melting');
		},
	});
	
	new G.Res({
		name:'basket',
		desc:'Each basket stores 10 [food].//Will decay over time.',
		icon:[14,7],
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.005;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
	new G.Res({
		name:'pot',
		desc:'Each pot stores 25 [food].//Will decay slowly over time.',
		icon:[13,5],
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0005;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
	
	new G.Res({
		name:'fire pit',
		//desc:'Keeps your tribe warm and may prevent animals from attacking.//Used by some types of crafting.//Will burn out over time.',
		desc:'Keeps your tribe warm; each fire reduces illness for 10 people.//Used by some types of crafting.//Will burn out over time.',
		icon:[13,7],
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
	
	
	var limitDesc=function(limit){return 'It is limited by your '+limit+'; the closer to the limit, the slower it is to produce more.';};
	var researchGetDisplayAmount=function()
		{
			var limit=G.getDict(this.limit).displayedAmount;
			return B(this.displayedAmount)+'<wbr>/'+B(limit);
		};
	var researchWhenGathered=function(me,amount,by)
		{
			var limit=G.getDict(this.limit).amount;
			if (limit>0)
			{
				var mult=1;
				if (G.year<5) mult=1.25;//faster research the first 5 years
				me.amount+=randomFloor(Math.pow(1-me.amount/limit,2)*(Math.random()*amount*me.mult*mult));
				me.amount=Math.min(me.amount,limit);
			}
		};
		new G.Res({
		name:'insight',
		desc:'[insight] represents your people\'s ideas and random sparks of intuition.//'+limitDesc('[wisdom]')+'//Many technologies require insight to be researched.',
		icon:[8,4],
		category:'main',
		limit:'wisdom',
		tick:function(me,tick){
			if (G.has('Eotm')){
			me.hidden=true
			}
		},
		getDisplayAmount:researchGetDisplayAmount,
		whenGathered:researchWhenGathered,
	});
	new G.Res({
		name:'wisdom',
		hidden:true,
		icon:[8,5],
		category:'main',
	});
	
	new G.Res({
		name:'science',
		desc:'[science] is the product of experiments and discoveries.//'+limitDesc('[education]')+'//Many technologies require science to be researched.',
		icon:[6,4],
		category:'main',
		limit:'education',
		getDisplayAmount:researchGetDisplayAmount,
		whenGathered:researchWhenGathered,
	});
	new G.Res({
		name:'education',
		hidden:true,
		icon:[6,5],
		category:'main',
	});
	
	new G.Res({
		name:'culture',
		desc:'[culture] is produced when your people create beautiful and thought-provoking things.//'+limitDesc('[inspiration]')+'//Culture is used to develop cultural traits.',
		icon:[10,4],
		category:'main',
		limit:'inspiration',
		tick:function(me,tick)
		{
			if (G.has('dt15')){
			var toSpoil=me.amount*0.005;
			var spent=G.lose(me.name,randomFloor(toSpoil),'culture sapping');
			}
			if (G.has('Eotm')){
			me.hidden=true
			}
		},
		getDisplayAmount:researchGetDisplayAmount,
		whenGathered:researchWhenGathered,
	});
	new G.Res({
		name:'inspiration',
		hidden:true,
		icon:[10,5],
		category:'main',
	});
	
	new G.Res({
		name:'faith',
		desc:'[faith] derives from all things divine, from meditation to sacrifices.//'+limitDesc('[spirituality]')+'//Some cultural traits and technologies depend on faith.',
		icon:[7,4],
		category:'main',
		limit:'spirituality',
		tick:function(me,tick)
		{
			if (G.has('dt13')){
			var toSpoil=me.amount*0.005;
			var spent=G.lose(me.name,randomFloor(toSpoil),'faith sapping');
			}
			if (G.has('Eotm')){
			me.hidden=true
			}
		},
		getDisplayAmount:researchGetDisplayAmount,
		whenGathered:researchWhenGathered,
	});
	new G.Res({
		name:'spirituality',
		hidden:true,
		icon:[7,5],
		category:'main',
	});
	
	new G.Res({
		name:'influence',
		desc:'[influence] is generated by power structures.//You also get 1 influence point at the start of every year.//'+limitDesc('[authority]')+'//Influence is required to enact most policies or remove traits.',
		icon:[11,4],
		category:'main',
		limit:'authority',
		startWith:5,
		tick:function(me,tick)
		{
			if (G.has('dt14')){
			var toSpoil=me.amount*0.005;
			var spent=G.lose(me.name,randomFloor(toSpoil),'influence sapping');
			}
			if (G.has('Eotm')){
			me.hidden=true
			}
		},
		getDisplayAmount:researchGetDisplayAmount,
		whenGathered:researchWhenGathered,
	});
	new G.Res({
		name:'authority',
		hidden:true,
		icon:[11,5],
		category:'main',
	});
	//MAGIX
	new G.Res({
		name:'Mana',
		desc:'[Mana] is used to make essences. Thing used by beginner wizards. ',
		icon:[2,3,'magixmod'],
		partOf:'misc materials',
		whenGathered:researchWhenGathered,
		limit:'mana capacity',
		category:'misc',
	});
		new G.Res({
		name:'Wand',
		desc:'Wands are basic of wizardry. Thing used by beginner wizards. Without it most of spells are impossible to be casted. @Number to the left means how much is now used, to the right how much is in stock.',
		icon:[6,4,'magixmod'],
		category:'gear',
		displayUsed:true,
	});
		new G.Res({
		name:'Cactus spikes',
		desc:'Spikes out of [cactus]. May wound... a lot!',
		icon:[12,0,'magixmod'],
		category:'misc',
		partOf:'misc materials',
	});
		new G.Res({
		name:'Sunflower seeds',
		desc:'Edible seeds out of [Sunflower].',
		icon:[12,1,'magixmod'],
		category:'food',
		partOf:'food',
	});
		new G.Res({
		name:'Painting',
		desc:'The paint made by Painter. People are proud from its beauty.',
		icon:[12,4,'magixmod'],
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0001;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			G.pseudoGather(G.getRes('culture'),randomFloor(spent));
		},
	});
		new G.Res({
		name:'Land of the Plain Island',
		desc:'The land you got from activating a portal to Plain Island. Place for new buildings.',
		icon:[7,0,'magixmod'],
		displayUsed:true,
		partOf:'tl',
		category:'terr'
	});
		new G.Res({
		name:'Land of the Paradise',
		desc:'The land you got from activating a portal to the Paradise. Place for new buildings.',
		icon:[20,4,'magixmod'],
		displayUsed:true,
		category:'terr',
		partOf:'tl'
	});
		new G.Res({
		name:'Fire essence',
		desc:'[Fire essence] is warm in hands and dangerous. Might be used to fight against cold winters.',
		icon:[0,2,'magixmod'],
		partOf:'Magic essences',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0001;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		whenGathered:researchWhenGathered,
		limit:'fire essence limit',
		category:'misc',
	});
		new G.Res({
		name:'Water essence',
		desc:'[Water essence] this essence is undrinkable but can be used to cast rain.',
		icon:[0,1,'magixmod'],
		partOf:'Magic essences',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0001;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		whenGathered:researchWhenGathered,
		limit:'water essence limit',
		category:'misc',
	});
		new G.Res({
		name:'Nature essence',
		desc:'[Nature essence] is used by wizards to reviewe their beloved flowers or make harvests more plentiful.',
		icon:[1,2,'magixmod'],
		partOf:'Magic essences',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0001;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		whenGathered:researchWhenGathered,
		limit:'nature essence limit',
		category:'misc',
	});
		new G.Res({
		name:'Dark essence',
		desc:'[Dark essence] used to make a blackholes for graves or to even bigger spellworks like mirror world. .',
		icon:[1,3,'magixmod'],
		partOf:'Magic essences',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0001;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			if(G.has('Liberating darkness')){
				if(me.amount < G.getRes('dark essence limit').amount){
					G.gain(me.name,20,'The Skull');
				}
			}
		},
		whenGathered:researchWhenGathered,
		limit:'dark essence limit',
		category:'misc',
	});
		new G.Res({
		name:'Lightning essence',
		desc:'[Lightning essence] can make a storms safer for people granting satisfaction  and good entertainment for storm hunters. Who knows what would happen if its essence can start elecricity age.',
		icon:[0,3,'magixmod'],
		partOf:'Magic essences',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0001;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		whenGathered:researchWhenGathered,
		limit:'lightning essence limit',
		category:'misc',
	});
		new G.Res({
		name:'Wind essence',
		desc:'[Wind essence] this one should not be used by everyone due to risk of tornado disaster. Anyway this one will have its use in spellcasting.',
		icon:[1,1,'magixmod'],
		partOf:'Magic essences',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0001;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		whenGathered:researchWhenGathered,
		limit:'wind essence limit',
		category:'misc',
	});
		new G.Res({
		name:'Essence of the Holiness',
		desc:'[Essence of the Holiness] this one should not be used by everyone due to risk of mass blindness. Anyway this one will have its faithful uses.',
		icon:[20,6,'magixmod'],
		partOf:'Magic essences',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0001;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		whenGathered:researchWhenGathered,
		limit:'holy essence limit',
		category:'misc',
	});
		new G.Res({
		name:'Cobalt ore',
		desc:'Hard mineral. At least you may be able to smelt some cobalt and turn them into ingot of the Cobalt in mortal world.',
		icon:[8,2,'magixmod'],
		partOf:'misc materials',
		category:'build',
	});
		new G.Res({
		name:'Scobs',
		desc:'Scobs are effect of carver working at [Wooden statuette] and cutting trees.',
		icon:[13,2,'magixmod'],
		partOf:'misc materials',
		category:'misc',
	});
		new G.Res({
		name:'Colored clothing',
		desc:'Sewn together from [leather] or textile fiber and in addition colored with help of [Dyes].//Each [population,Person] wearing clothing is slightly happier and healthier.',
		icon:[13,0,'magixmod'],
		category:'gear',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.002;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'Wooden statuette',
		desc:'A small idol that was rudimentarily carved from [log] or [lumber].//May be used up over time, creating [culture].',
		icon:[13,1,'magixmod'],
		partOf:'misc materials',
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.03;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			G.pseudoGather(G.getRes('culture'),randomFloor(spent));
		},
	});
		new G.Res({
		name:'Dried leather',
		desc:'Hardened version of [leather]. The one way to craft is putting [leather] into <b>Drying rack<b>.',
		icon:[13,4,'magixmod'],
		category:'build',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.03;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'Crossbow',
		desc:'Weapon with a pro which [bow] does not have. Your hunter or soldier will now need just click to release belt. Remember about putting belt on before.@Number to the left means how much is now used, to the right how much is in stock.',
		icon:[13,6,'magixmod'],
		category:'gear',
		displayUsed:true,
	});
		new G.Res({
		name:'Crossbow belt',
		desc:'An ammo for [Crossbow].@Number to the left means how much is now used, to the right how much is in stock.',
		icon:[13,7,'magixmod'],
		category:'gear',
		displayUsed:true,
	});
		new G.Res({
		name:'Fishing net',
		desc:'An another way to catch [seafood]. Solid net can be used to catch more fish. Can gather a little more fishes than line fishing.@Number to the left means how much is now used, to the right how much is in stock.',
		icon:[13,8,'magixmod'],
		category:'gear',
		displayUsed:true,
	});
		new G.Res({
		name:'Thread',
		desc:'This item is really in need if you want to get at higher level of sewing.',
		icon:[13,9,'magixmod'],
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'Cobalt ingot',
		desc:'An ingot made out of [Cobalt ore]. Has few or almost none of use. Wait, maybe as precious building material it may be used.',
		icon:[14,0,'magixmod'],
		category:'build',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'Watermelon',
		desc:'Fresh fruit. Can be farmed at the lands of the Plain Island. You can make a juice out of it.',
		icon:[15,1,'magixmod'],
		turnToByContext:{'eat':{'health':0.045,'happiness':0.025},'decay':{'spoiled food':0.15}},
		category:'food',
		hidden:true,
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.09;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		partOf:'food',
	});
		new G.Res({
		name:'Watermelon juice',
		desc:'Fresh, sweet, healthy and tasty juice. Grants more [happiness] and [health] than normal, common [water] but spoils little faster.',
		icon:[15,3,'magixmod'],
		category:'food',
		partOf:'Juices',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.02;
			var spent=G.lose('Watermelon juice',randomFloor(toSpoil),'decay');
			var n=randomFloor(G.getRes('Watermelon juice').amount*0.4);
			G.gain('happiness',randomFloor(spent*0.6),'drinking tasty juice');
			G.gain('health',randomFloor(spent*1.15),'drinking tasty juice');
			if (G.has('Juicy expertise'))
			{
				G.gain('happiness',randomFloor(spent*0.15),'drinking tasty juice');
				G.gain('health',randomFloor(spent*0.23),'drinking tasty juice');
			}
		},
	});
		new G.Res({
		name:'Berry juice',
		desc:'Fresh, sweet, healthy and tasty juice. Grants more [happiness] and [health] than normal, common [water] but spoils little faster.',
		icon:[16,3,'magixmod'],
		category:'food',
		partOf:'Juices',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.02;
			var spent=G.lose('Berry juice',randomFloor(toSpoil),'decay');
			var n=randomFloor(G.getRes('Berry juice').amount*0.4);
			G.gain('happiness',randomFloor(spent*0.6),'drinking tasty juice');
			G.gain('health',randomFloor(spent*1.15),'drinking tasty juice');
			if (G.has('Juicy expertise'))
			{
				G.gain('happiness',randomFloor(spent*0.15),'drinking tasty juice');
				G.gain('health',randomFloor(spent*0.23),'drinking tasty juice');
			}
		},
	});
		new G.Res({
		name:'Juices',
		desc:'This stat shows you how much juices of any type you have currently in total. Juices provide more [happiness] and [health] than normal, common [water] but spoils little faster. Can be used in few crafts like normal water.',
		icon:[14,3,'magixmod'],
		meta:true,
		partOf:'water',
		tick:function(me,tick)
		{
			if (G.checkPolicy('disable spoiling')=='off')
			{
				var toSpoil=me.amount*0.01;
				var spent=G.lose(me.name,randomFloor(toSpoil),'drinking juice');
				G.gain('Spoiled juices',randomFloor(spent*0.4),'decay');
			}
		},
	});
		new G.Res({
		name:'Spoiled juices',
		desc:'This stat shows you how much spoiled juice of any type you have currently in total. Spoiled juice decreases [happiness] and [health] stronger than normal, common [muddy water]. Can be used in few crafts like muddy water.',
		icon:[14,5,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose('Spoiled juices',randomFloor(toSpoil),'decay');
			if (G.checkPolicy('drink spoiled juice')=='on')
			{
				G.gain('happiness',randomFloor(spent*-1.17),'drinking spoiled juice');
				G.gain('health',randomFloor(spent*-1.35),'drinking spoiled juice');
			}
		},
	});
		new G.Res({
		name:'Berries',
		desc:'[Berries] taste sweet, but spoil quickly.',
		icon:[16,1,'magixmod'],
		turnToByContext:{'eat':{'health':0.035,'happiness':0.025},'decay':{'spoiled food':0.8}},//this basically translates to : "when eaten, generate some health and happiness; when rotting, turn into either nothing or some spoiled food"
		partOf:'food',
		hidden:true,
		category:'food',
	});
		new G.Res({
		name:'Bamboo',
		desc:'This tropical material can be used for archaic constructions.',
		icon:[14,4,'magixmod'],
		partOf:'archaic building materials',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.09;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'build',
	});
		new G.Res({
		name:'Sugar cane',
		desc:'These canes contains [sugar] in them. You can get [sugar] by giving this task to an artisan.',
		icon:[15,4,'magixmod'],
		partOf:'misc materials',
		category:'misc',
	});
		new G.Res({
		name:'sugar',
		desc:'If you want to start crafting tasty juices, [sugar] is a must.',
		icon:[15,2,'magixmod'],
		partOf:'misc materials',
		category:'misc',
	});
		new G.Res({//REMOVED AND WILL BE REPLACED SOON
		name:'Watermelon seeds',
		desc:'If you want to start farming [Watermelon] and crafting tasty [Juices] these seeds are a must.',
		icon:[16,6,'magixmod'],
		partOf:'misc materials',
		category:'misc',
		hidden:true,
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.09;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({//REMOVED AND WILL BE REPLACED SOON
		name:'Berry seeds',
		desc:'If you want to start farming [Berries] and crafting tasty [Juices] these seeds are a must.',
		icon:[15,6,'magixmod'],
		partOf:'misc materials',
		category:'misc',
		hidden:true,
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.09;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		let madeUnlockMessage = false
		new G.Res({
      	name:'Plain Island emblem',
       	desc:'A thing you will get after activating a Plain Island portal. Needed to unlock further researching. A pass for further things. You can obtain only one Emblem of this type. <b>@Your adventure has been finished... But portal hides a new secrets... so in fact your adventure has not ended yet.<b>',
        icon:[14,9,'magixmod'],
        startWith:0,
        tick:function(me,tick)
        {
            if (me.amount>=1 && !madeUnlockMessage){ 
                G.Message({type:'good',text:'<b>You and your people activated passage to Plain Island. Out of portal an Emblem falls and hits on rock. Big rectangular portal shines and you can see what is beyond it. You come through and notice there are flat plains. Now it is time for more discoveries and build there some stuff.</b>',icon:[8,3,'magixmod']});
                madeUnlockMessage = true
		   	if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
			{
			var audioPlEmblem = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GainedEmblem.mp3');
			audioPlEmblem.play();
			}
            }
			if (G.has('<span style="color: ##FF0900">Plain island building</span>')){
			me.hidden=true
			}
        },
        category:'main',
    });
		new G.Res({
		name:'Precious pot',
		desc:'Harder and more beautiful pot. Each one stores 27[food]. Decays slower , grants a really low amount of [culture].',
		icon:[15,8,'magixmod'],
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			G.pseudoGather(G.getRes('culture'),randomFloor(spent));
		},
	});
		new G.Res({
		name:'Potion pot',
		desc:'Pot made specially for [Alchemists]. Hard , a little bit heavy but safe.',
		icon:[14,8,'magixmod'],
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'Ink',
		desc:'Can be used in writing. Not drinkable, not tasty.',
		icon:[18,6,'magixmod'],
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'wheat',
		desc:'Not edible but useful grain in crafting of [bread] .',
		icon:[23,10,'magixmod'],
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.001;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'flour',
		desc:'Made out of [wheat] . Now having [flour] you may start crafting [bread] .',
		icon:[23,11,'magixmod'],
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.001;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'Alchemy zone',
		desc:'This part of land will be occupied by [Alchemists] and their seats. Here they brew potions, antidotums and many more.',
		icon:[17,7,'magixmod'],
		category:'main',
		displayUsed:true,
		tick:function(me,tick){
		if (G.achievByName['mausoleum'].won) {
  		  if (G.achievByName['mausoleum'].won > 0 && G.achievByName['mausoleum'].won < 2 ) {
			  G.setPolicyModeByName('mausoleum stage','1');
		  }
		}
					if (G.checkPolicy('mausoleum stage')=='1'){
	G.getDict('mausoleum').wideIcon = [0,20,'magixmod']
        G.getDict('mausoleum').icon = [1,20,'magixmod']
        G.getDict('mausoleum').desc ='@leads to the <b>Mausoleum Victory</b><>A mystical monument where the dead lie.//A temple housing a tomb deep under its rocky platform, the Mausoleum stands tall, its eternal shadow forever reminding your people of your greatness. <font color="yellow">@The Mausoleum is evolved to level 1 of 10. Continue evolving up to unlock a special achievement. You can evolve up the Mausoleum to next stage by ascending with Mausoleum at the stage you currently are.</font>'
    G.getDict('mausoleum').wonder = 'mausoleum'
    G.getDict('mausoleum').cost = {'basic building materials':1200}
    G.getDict('mausoleum').costPerStep = {'basic building materials':215,'precious building materials':25}
    G.getDict('mausoleum').steps = 110
    G.getDict('mausoleum').messageOnStart = 'You begin the construction of the Mausoleum. Its towering mass already dominates the city, casting fear and awe wherever its shadow reaches. This time the Mausoleum will be more massive.'
    G.getDict('mausoleum').finalStepCost = {'population':200}
    G.getDict('mausoleum').finalStepDesc = 'To complete the Mausoleum, 200 of your [population,People] must be sacrificed to accompany you as servants in the afterlife.'
   G.getDict('mausoleum').use = {'land':10,'worker':5,'metal tools':5}
		}
  if (G.achievByName['mausoleum'].won) {
    if (G.achievByName['mausoleum'].won > 1 && G.achievByName['mausoleum'].won < 3 ) {
	    			  G.setPolicyModeByName('mausoleum stage','2');
		  }
		}
		if (G.checkPolicy('mausoleum stage')=='2'){
        G.getDict('mausoleum').wideIcon = [3,20,'magixmod'];
        G.getDict('mausoleum').icon = [4,20,'magixmod'];
        G.getDict('mausoleum').desc ='@leads to the <b>Mausoleum Victory</b><>A mystical monument where the dead lie.//A temple housing a tomb deep under its rocky platform, the Mausoleum stands tall, its eternal shadow forever reminding your people of your greatness. <font color="yellow">@The Mausoleum is evolved to level 2 of 10. Continue evolving up to unlock a special achievement. You can evolve up the Mausoleum to next stage by ascending with Mausoleum at the stage you currently are.</font>';
    G.getDict('mausoleum').wonder = 'mausoleum';
    G.getDict('mausoleum').cost = {'basic building materials':1400};
    G.getDict('mausoleum').costPerStep = {'basic building materials':230,'precious building materials':30};
    G.getDict('mausoleum').steps = 120;
    G.getDict('mausoleum').messageOnStart = 'You begin the construction of the Mausoleum. Its towering mass already dominates the city, casting fear and awe wherever its shadow reaches. This time the Mausoleum will be more massive.';
    G.getDict('mausoleum').finalStepCost = {'population':300};
    G.getDict('mausoleum').finalStepDesc = 'To complete the Mausoleum, 300 of your [population,People] must be sacrificed to accompany you as servants in the afterlife.';
    G.getDict('mausoleum').use = {'land':10,'worker':5,'metal tools':5};
    }
  if (G.achievByName['mausoleum'].won) {
    if (G.achievByName['mausoleum'].won > 2 && G.achievByName['mausoleum'].won < 4 ) {
	    			  G.setPolicyModeByName('mausoleum stage','3');
		  }
		}
		if (G.checkPolicy('mausoleum stage')=='3'){
        G.getDict('mausoleum').wideIcon = [6,20,'magixmod'];
        G.getDict('mausoleum').icon = [7,20,'magixmod'];
        G.getDict('mausoleum').desc ='@leads to the <b>Mausoleum Victory</b><>A mystical monument where the dead lie.//A temple housing a tomb deep under its rocky platform, the Mausoleum stands tall, its eternal shadow forever reminding your people of your greatness. <font color="yellow">@The Mausoleum is evolved to level 3 of 10. Continue evolving up to unlock a special achievement. You can evolve up the Mausoleum to next stage by ascending with Mausoleum at the stage you currently are.</font>';
    G.getDict('mausoleum').wonder = 'mausoleum';
    G.getDict('mausoleum').cost = {'basic building materials':1600};
    G.getDict('mausoleum').costPerStep = {'basic building materials':245,'precious building materials':35};
    G.getDict('mausoleum').steps = 130;
    G.getDict('mausoleum').messageOnStart = 'You begin the construction of the Mausoleum. Its towering mass already dominates the city, casting fear and awe wherever its shadow reaches. This time the Mausoleum will be more massive.';
    G.getDict('mausoleum').finalStepCost = {'population':400};
    G.getDict('mausoleum').finalStepDesc = 'To complete the Mausoleum, 400 of your [population,People] must be sacrificed to accompany you as servants in the afterlife.';
    G.getDict('mausoleum').use = {'land':10,'worker':5,'metal tools':5};
    }
  if (G.achievByName['mausoleum'].won) {
    if (G.achievByName['mausoleum'].won > 3 && G.achievByName['mausoleum'].won < 5 ) {
	    	    			  G.setPolicyModeByName('mausoleum stage','4');
		  }
		}
		if (G.checkPolicy('mausoleum stage')=='4'){
        G.getDict('mausoleum').wideIcon = [9,20,'magixmod'];
        G.getDict('mausoleum').icon = [10,20,'magixmod'];
        G.getDict('mausoleum').desc ='@leads to the <b>Mausoleum Victory</b><>A mystical monument where the dead lie.//A temple housing a tomb deep under its rocky platform, the Mausoleum stands tall, its eternal shadow forever reminding your people of your greatness. <font color="yellow">@The Mausoleum is evolved to level 4 of 10. Continue evolving up to unlock a special achievement. You can evolve up the Mausoleum to next stage by ascending with Mausoleum at the stage you currently are.</font>';
    G.getDict('mausoleum').wonder = 'mausoleum';
    G.getDict('mausoleum').cost = {'basic building materials':1800};
    G.getDict('mausoleum').costPerStep = {'basic building materials':260,'precious building materials':40};
    G.getDict('mausoleum').steps = 140;
    G.getDict('mausoleum').messageOnStart = 'You begin the construction of the Mausoleum. Its towering mass already dominates the city, casting fear and awe wherever its shadow reaches. This time the Mausoleum will be more massive.';
    G.getDict('mausoleum').finalStepCost = {'population':500};
    G.getDict('mausoleum').finalStepDesc = 'To complete the Mausoleum, 500 of your [population,People] must be sacrificed to accompany you as servants in the afterlife.';
    G.getDict('mausoleum').use = {'land':10,'worker':5,'metal tools':5};
    }
  if (G.achievByName['mausoleum'].won) {
    if (G.achievByName['mausoleum'].won > 4 && G.achievByName['mausoleum'].won < 6 ) {
	    	    			  G.setPolicyModeByName('mausoleum stage','5');
		  }
		}
		if (G.checkPolicy('mausoleum stage')=='5'){
        G.getDict('mausoleum').wideIcon = [12,20,'magixmod'];
        G.getDict('mausoleum').icon = [13,20,'magixmod'];
        G.getDict('mausoleum').desc ='@leads to the <b>Mausoleum Victory</b><>A mystical monument where the dead lie.//A temple housing a tomb deep under its rocky platform, the Mausoleum stands tall, its eternal shadow forever reminding your people of your greatness. <font color="yellow">@The Mausoleum is evolved to level 5 of 10. Continue evolving up to unlock a special achievement. You can evolve up the Mausoleum to next stage by ascending with Mausoleum at the stage you currently are.</font>';
    G.getDict('mausoleum').wonder = 'mausoleum';
    G.getDict('mausoleum').cost = {'basic building materials':2000};
    G.getDict('mausoleum').costPerStep = {'basic building materials':275,'precious building materials':45};
    G.getDict('mausoleum').steps = 150;
    G.getDict('mausoleum').messageOnStart = 'You begin the construction of the Mausoleum. Its towering mass already dominates the city, casting fear and awe wherever its shadow reaches. This time the Mausoleum will be more massive.';
    G.getDict('mausoleum').finalStepCost = {'population':600};
    G.getDict('mausoleum').finalStepDesc = 'To complete the Mausoleum, 600 of your [population,People] must be sacrificed to accompany you as servants in the afterlife.';
    G.getDict('mausoleum').use = {'land':10,'worker':5,'metal tools':5};
    }
  if (G.achievByName['mausoleum'].won) {
    if (G.achievByName['mausoleum'].won > 5 && G.achievByName['mausoleum'].won < 7 ) {
	    	    			  G.setPolicyModeByName('mausoleum stage','6');
		  }
		}
		if (G.checkPolicy('mausoleum stage')=='6'){
        G.getDict('mausoleum').wideIcon = [15,20,'magixmod'];
        G.getDict('mausoleum').icon = [16,20,'magixmod'];
        G.getDict('mausoleum').desc ='@leads to the <b>Mausoleum Victory</b><>A mystical monument where the dead lie.//A temple housing a tomb deep under its rocky platform, the Mausoleum stands tall, its eternal shadow forever reminding your people of your greatness. <font color="yellow">@The Mausoleum is evolved to level 6 of 10. Continue evolving up to unlock a special achievement. You can evolve up the Mausoleum to next stage by ascending with Mausoleum at the stage you currently are.</font>';
    G.getDict('mausoleum').wonder = 'mausoleum';
    G.getDict('mausoleum').cost = {'basic building materials':2200};
    G.getDict('mausoleum').costPerStep = {'basic building materials':290,'precious building materials':50,'Mana':40};
    G.getDict('mausoleum').steps = 160;
    G.getDict('mausoleum').messageOnStart = 'You begin the construction of the Mausoleum. Its towering mass already dominates the city, casting fear and awe wherever its shadow reaches. This time the Mausoleum will be more massive.';
    G.getDict('mausoleum').finalStepCost = {'population':700};
    G.getDict('mausoleum').finalStepDesc = 'To complete the Mausoleum, 700 of your [population,People] must be sacrificed to accompany you as servants in the afterlife.';
    G.getDict('mausoleum').use = {'land':10,'worker':5,'metal tools':5};
    }
  if (G.achievByName['mausoleum'].won) {
    if (G.achievByName['mausoleum'].won > 6 && G.achievByName['mausoleum'].won < 8 ) {
	    	    			  G.setPolicyModeByName('mausoleum stage','7');
		  }
		}
		if (G.checkPolicy('mausoleum stage')=='7'){
        G.getDict('mausoleum').wideIcon = [18,20,'magixmod'];
        G.getDict('mausoleum').icon = [19,20,'magixmod'];
        G.getDict('mausoleum').desc ='@leads to the <b>Mausoleum Victory</b><>A mystical monument where the dead lie.//A temple housing a tomb deep under its rocky platform, the Mausoleum stands tall, its eternal shadow forever reminding your people of your greatness. <font color="yellow">@The Mausoleum is evolved to level 7 of 10. Continue evolving up to unlock a special achievement. You can evolve up the Mausoleum to next stage by ascending with Mausoleum at the stage you currently are.</font>';
    G.getDict('mausoleum').wonder = 'mausoleum';
    G.getDict('mausoleum').cost = {'basic building materials':2400};
    G.getDict('mausoleum').costPerStep = {'basic building materials':305,'precious building materials':55,'Mana':60};
    G.getDict('mausoleum').steps = 170;
    G.getDict('mausoleum').messageOnStart = 'You begin the construction of the Mausoleum. Its towering mass already dominates the city, casting fear and awe wherever its shadow reaches. This time the Mausoleum will be more massive.';
    G.getDict('mausoleum').finalStepCost = {'population':800};
    G.getDict('mausoleum').finalStepDesc = 'To complete the Mausoleum, 800 of your [population,People] must be sacrificed to accompany you as servants in the afterlife.';
    G.getDict('mausoleum').use = {'land':10,'worker':5,'metal tools':5};
    }
  if (G.achievByName['mausoleum'].won) {
    if (G.achievByName['mausoleum'].won > 7 && G.achievByName['mausoleum'].won < 9 ) {
	    	    			  G.setPolicyModeByName('mausoleum stage','8');
		  }
		}
		if (G.checkPolicy('mausoleum stage')=='8'){
        G.getDict('mausoleum').wideIcon = [21,20,'magixmod'];
        G.getDict('mausoleum').icon = [22,20,'magixmod'];
        G.getDict('mausoleum').desc ='@leads to the <b>Mausoleum Victory</b><>A mystical monument where the dead lie.//A temple housing a tomb deep under its rocky platform, the Mausoleum stands tall, its eternal shadow forever reminding your people of your greatness. <font color="yellow">@The Mausoleum is evolved to level 8 of 10. Continue evolving up to unlock a special achievement. You can evolve up the Mausoleum to next stage by ascending with Mausoleum at the stage you currently are.</font>';
    G.getDict('mausoleum').wonder = 'mausoleum';
    G.getDict('mausoleum').cost = {'basic building materials':2600};
    G.getDict('mausoleum').costPerStep = {'basic building materials':320,'precious building materials':60,'Mana':75,'gem block':1};
    G.getDict('mausoleum').steps = 180;
    G.getDict('mausoleum').messageOnStart = 'You begin the construction of the Mausoleum. Its towering mass already dominates the city, casting fear and awe wherever its shadow reaches. This time the Mausoleum will be even more massive. It was so huge last time.';
    G.getDict('mausoleum').finalStepCost = {'population':900};
    G.getDict('mausoleum').finalStepDesc = 'To complete the Mausoleum, 900 of your [population,People] must be sacrificed to accompany you as servants in the afterlife.';
    G.getDict('mausoleum').use = {'land':10,'worker':5,'metal tools':5};
    }
  if (G.achievByName['mausoleum'].won) {
    if (G.achievByName['mausoleum'].won > 8 && G.achievByName['mausoleum'].won < 10 ) {
	    	    			  G.setPolicyModeByName('mausoleum stage','9');
		  }
		}
		if (G.checkPolicy('mausoleum stage')=='9'){
        G.getDict('mausoleum').wideIcon = [24,20,'magixmod'];
        G.getDict('mausoleum').icon = [25,20,'magixmod'];
        G.getDict('mausoleum').desc ='@leads to the <b>Mausoleum Victory</b><>A mystical monument where the dead lie.//A temple housing a tomb deep under its rocky platform, the Mausoleum stands tall, its eternal shadow forever reminding your people of your greatness. <font color="yellow">@The Mausoleum is evolved to level 9 of 10. Continue evolving up to unlock a special achievement. You can evolve up the Mausoleum to next stage by ascending with Mausoleum at the stage you currently are.</font>';
    G.getDict('mausoleum').wonder = 'mausoleum';
    G.getDict('mausoleum').cost = {'basic building materials':2800};
    G.getDict('mausoleum').costPerStep = {'basic building materials':320,'precious building materials':65,'Mana':80,'gem block':1,'Magic essences':50};
    G.getDict('mausoleum').steps = 190;
    G.getDict('mausoleum').messageOnStart = 'You begin the construction of the Mausoleum. Its towering mass already dominates the city, casting fear and awe wherever its shadow reaches. This time the Mausoleum will be more massive. It was so huge last time.';
    G.getDict('mausoleum').finalStepCost = {'population':1000};
    G.getDict('mausoleum').finalStepDesc = 'To complete the Mausoleum, 1000 of your [population,People] must be sacrificed to accompany you as servants in the afterlife.';
    G.getDict('mausoleum').use = {'land':10,'worker':5,'metal tools':5};
    }
  if (G.achievByName['mausoleum'].won) {
    if (G.achievByName['mausoleum'].won > 9) {
	    	    			  G.setPolicyModeByName('mausoleum stage','10');
		  }
		}
		if (G.checkPolicy('mausoleum stage')=='10'){
        G.getDict('mausoleum').wideIcon = [27,20,'magixmod'];
        G.getDict('mausoleum').icon = [28,20,'magixmod'];
        G.getDict('mausoleum').desc ='@leads to the <b>Mausoleum Victory</b><>A mystical monument where the dead lie.//A temple housing a tomb deep under its rocky platform, the Mausoleum stands tall, its eternal shadow forever reminding your people of your greatness. <font color="yellow">@The Mausoleum is evolved to <b>Final stage (10 of 10)</b>. Continue evolving up to unlock a special achievement. You can evolve up the Mausoleum to next stage by ascending with Mausoleum at the stage you currently are.</font>';
    G.getDict('mausoleum').wonder = '<font color="DA4f37">Mausoleum eternal</font>';
    G.getDict('mausoleum').cost = {'basic building materials':3000};
    G.getDict('mausoleum').costPerStep = {'basic building materials':335,'precious building materials':70,'Mana':90,'gem block':2,'Magic essences':150};
    G.getDict('mausoleum').steps = 200;
    G.getDict('mausoleum').messageOnStart = 'You begin the construction of the Mausoleum. Its towering mass already dominates the city, casting fear and awe wherever its shadow reaches. This time the Mausoleum will be more massive. It was no huge anymore. People say that The Mausoleum got collosal.';
    G.getDict('mausoleum').finalStepCost = {'population':1100};
    G.getDict('mausoleum').finalStepDesc = 'To complete the Mausoleum, 1100 of your [population,People] must be sacrificed to accompany you as servants in the afterlife.';
    G.getDict('mausoleum').use = {'land':10,'worker':5,'metal tools':5};
    }
	if (G.achievByName['<font color="DA4f37">Mausoleum eternal</font>'].won) {
    if (G.achievByName['<font color="DA4f37">Mausoleum eternal</font>'].won > 0) {
	    G.getDict('belief in the afterlife').chance = 5;
   		  }
		 }
		}
	});
		new G.Res({
		name:'First aid things',
		desc:'More advanced things, tools used by [healer,healers].',
		icon:[choose([22,23]),6,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
		meta:true,
	});
		new G.Res({
		name:'Cloudy water',
		desc:'Water which cannot spoil in any way (but it still can decay but slower). Gathered from Paradise\'s lakes, ponds, rivers.',
		icon:[11,14,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.004;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'food',
	});
		new G.Res({
		name:'Fruit juice',
		desc:'Fresh, sweet, healthy and tasty juice. Grants less [happiness] and [health] than [Berry juice],[Watermelon juice] and spoils little slower than [Berry juice] & [Watermelon juice].',
		icon:[17,3,'magixmod'],
		category:'food',
		partOf:'Juices',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.02;
			var spent=G.lose('Fruit juice',randomFloor(toSpoil),'decay');
			var n=randomFloor(G.getRes('Fruit juice').amount*0.4);
			G.gain('happiness',randomFloor(spent*0.6),'drinking tasty juice');
			G.gain('health',randomFloor(spent*1.15),'drinking tasty juice');
			if (G.has('Juicy expertise'))
			{
				G.gain('happiness',randomFloor(spent*0.15),'drinking tasty juice');
				G.gain('health',randomFloor(spent*0.23),'drinking tasty juice');
			}
		},
	});
		new G.Res({
		name:'Basic brews',
		desc:'[Basic brews] may be used to craft more advanced potions',
		icon:[6,10,'magixmod'],
		meta:true,
	});
		new G.Res({
		name:'Sweet water pot',
		desc:'Sweet brew. Can be used to craft more advanced brews/potions.',
		icon:[0,10,'magixmod'],
		category:'alchemypotions',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		partOf:'Basic brews',
	});
		new G.Res({
		name:'mundane water pot',
		desc:'Mundane water. Can be used to craft more advanced brews/potions. Tastes a little bit like [muddy water] but it is not poisonous.',
		icon:[1,10,'magixmod'],
		category:'alchemypotions',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		partOf:'Basic brews',
	});
		new G.Res({
		name:'salted water pot',
		desc:'Salted water. Can be used to craft more advanced brews/potions. It is not tasty water, believe me.',
		icon:[2,10,'magixmod'],
		category:'alchemypotions',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		partOf:'Basic brews',
	});
		new G.Res({
		name:'Bubbling water pot',
		desc:'Bubbling water. Can be used to craft more advanced brews/potions. So hot, so do not drink. At least it releases bubbles.',
		icon:[3,10,'magixmod'],
		category:'alchemypotions',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		partOf:'Basic brews',
	});
		new G.Res({
		name:'Alcohol brews',
		desc:'Main reason of [drunk,alcoholism]. But some of alcohol brews will have its use to make other potions.',
		icon:[11,10,'magixmod'],
		meta:true,
	});
		new G.Res({
		name:'Alcohol pot',
		desc:'Can be used to craft [Wine] or [Pot of vodka]. Let\'s not forget about usage to other potions.',
		icon:[7,10,'magixmod'],
		category:'alchemypotions',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		partOf:'Alcohol brews',
	});
		new G.Res({
		name:'Wine',
		desc:'Edible alcohol. Drinking it will increase [happiness] by low rate, but harm [health] at low rate. Can make [drunk] people appear.',
		icon:[8,10,'magixmod'],
		category:'alchemypotions',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		partOf:'Alcohol brews',
	});
		new G.Res({
		name:'Pot of vodka',
		desc:'Dangerous for health alcohol drink. Has bigger chance to make a person become a [drunk] than a [Wine]',
		icon:[10,10,'magixmod'],
		category:'alchemypotions',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		partOf:'Alcohol brews',
	});
		new G.Res({
		name:'Herb syrup',
		desc:'Not so tasty. Made out of healthy [herb,Herbs] , [Flowers,various flowers] . Can heal [sick] and [drunk] person.',
		icon:[5,10,'magixmod'],
		category:'alchemypotions',
		partOf:'Medicament brews',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'Essenced herb syrup',
		desc:'A little bit tastier than [Herb syrup]. Made out of healthy [herb,Herbs] , [Flowers,various flowers] with little addition of [Water essence],[Nature essence]. Can heal [sick] and [drunk] person.',
		icon:[9,10,'magixmod'],
		category:'alchemypotions',
		partOf:'Medicament brews',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'Antidotum',
		desc:'Made out of [mundane water pot], tiny amount of [Alcohol pot,Alcohol],[herb,Herbs] and tiny amount of [salt]. This brew is used to heal [drunk] with a bigger chance to succesful heal.',
		icon:[4,10,'magixmod'],
		category:'alchemypotions',
		partOf:'Medicament brews',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'metal weapons',
		desc:'Solid, durable weapons made of metal and wood. One of many parts of soldiers equipment.@Number to the left means how much is now used, to the right how much is in stock.',
		icon:[15,11,'magixmod'],
		displayUsed:true,
		category:'gear',
	});
		new G.Res({
		name:'armor set',
		desc:'Solid, durable armor set made for soldiers to protect against not every, but common threats like ambush for instance.@Number to the left means how much is now used, to the right how much is in stock.',
		icon:[16,11,'magixmod'],
		displayUsed:true,
		category:'gear',
	});
		new G.Res({
		name:'vegetable',
		desc:'[vegetable,Vegetables], whether gathered from bushes or any gardens, are both healthy and good for you.',
		icon:[11,11,'magixmod'],
		turnToByContext:{'eating':{'health':0.02,'happiness':0.01},'decay':{'spoiled food':1}},
		partOf:'food',
		category:'food',
	});
		new G.Res({
		name:'Urn',
		desc:'Cremated [corpse] . People can store 4 [Urn]s per 1 [burial spot] . They decay as well.',
		icon:[31,6,'magixmod'],
		category:'misc',
		tick:function(me,tick){
		var graves=G.getRes('burial spot');
		if (me.amount>0)
				{
					//bury slowly
					if (graves.amount>graves.used)
					{
						var amount=Math.min(graves.amount-graves.used,Math.max(1,randomFloor(me.amount*0.1)));
						graves.used+=amount;G.lose('Urn',amount*4,'burial');
						G.gain('happiness',amount*2,'burial');
					}
				}
			if(G.has('dark urn decay')){
			var toSpoil=me.amount*0.002*(G.getRes('corpsedecaypoint').amount);
			var spent=G.lose('corpse',randomFloor(toSpoil),'Dark wormhole\' ability(Dark urn decay)');
			}
			var toSpoil=me.amount*0.001;
			var spent=G.lose('Urn',randomFloor(toSpoil),'decay');
		}
	});
		new G.Res({
		name:'Beet seeds',
		displayName:'Seeds',
		desc:'Some seeds that may allow you to set up farms of lettuce for instance or carrots.',
		icon:[6,11,'magixmod'],
		partOf:'misc materials',
		category:'misc',
	});
		new G.Res({
		name:'Medicament brews',
		desc:'A brews used to heal people from sickness.',
		icon:[12,10,'magixmod'],
		meta:true,
	});
		new G.Res({
		name:'Various stones',
		desc:'Different types of stones that can be used like regular [stone] .',
		icon:[3,12,'magixmod'],
		category:'build',
		partOf:'archaic building materials',
	});
		new G.Res({
		name:'Various cut stones',
		desc:'Different types of cut stones that can be used like regular [cut stone] .',
		icon:[2,12,'magixmod'],
		category:'build',
		partOf:'basic building materials',
	});
		new G.Res({
		name:'nickel ore',
		desc:'[nickel ore,Nickel] can be found with better prospecting. May be processed into [hard metal ingot].',
		icon:[9,12,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'build',
	});
		new G.Res({
		name:'platinum ore',
		desc:'[platinum ore,Platinum] can be found with better prospecting and only with small chance by [quarry] and only that unit. May be processed into [precious metal ingot].',
		icon:[8,12,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'build',
	});
		new G.Res({
		name:'platinum ingot',
		desc:'[platinum ingot,Platinum ingot] is used to craft precious items, building materials and more.',
		icon:[3,11,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'build',
	});
		new G.Res({
		name:'platinum block',
		desc:'A valuable, if unreliable construction material. Made from [platinum ingot]. Has same uses as [gold block] or [gem block].',
		icon:[4,11,'magixmod'],
		partOf:'precious building materials',
		category:'build',
	});
		new G.Res({
		name:'Paper',
		desc:'Describes amount of all paper types you have currently in total.',
		icon:[14,12,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'Bone dust',
		desc:'Made with knapping in bone. Ingredient used to make strenghtening brews or brews of revenant.',
		icon:[18,11,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemyingredients',
	});
		new G.Res({
		name:'Enchanted ice',
		desc:'Effect of [Mana] + [ice] + [Wind essence]. Used into resistant potions.',
		icon:[17,11,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemyingredients',
	});
		new G.Res({
		name:'Flowered sugar',
		desc:'[sugar] + [Flowers] . Additive ingredient for other potions.',
		icon:[18,10,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemyingredients',
	});
		new G.Res({
		name:'Dark fire pit',
		desc:'[fire pit] + [Dark essence] . Used to craft bunch of Dark Potions. Warms up still but does not provide light.',//Coming very very soon types of potions
		icon:[20,12,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemyingredients',
	});
		new G.Res({
		name:'Withering salt',
		desc:'[salt] + [Dark essence] . Part of few Dark Potions. Do not use it for meals, kills people from inside very quickly',
		icon:[20,10,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemyingredients',
	});
		new G.Res({
		name:'Herb of the undead',
		desc:'[herb] + [Dark essence] + [fruit] . Used to be one of ingredients of the Defense Dark Potions. Weakens deadly power of [Dark essence], does not weaken potions effect',//Coming very very soon types of potions
		icon:[20,11,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemyingredients',
	});
		new G.Res({
		name:'Scobs of life',
		desc:'[Scobs] + [Nature essence] + [water] + [Mana] . Used in Nature Combat Potions. One of strongest and most allergic for undead ingredient.',
		icon:[17,13,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemyingredients',
	});
		new G.Res({
		name:'Grass of growing',
		desc:'[herb] + [Mana] + [Nature essence] . Used in Nature Defense Potions. This grass can be friend of soldiers. Can be used to craft only one potion which will overgrow person who drank it and will work as green, natural camouphlage.',
		icon:[16,13,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemyingredients',
	});
		new G.Res({
		name:'Windy sugar',
		desc:'[sugar] + [Mana] + [Wind essence] . Used in combat. Sweet, tasty but unstable(moves, swirls, levitates over time)',
		icon:[14,13,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemyingredients',
	});
		let madeUnlockMessageP = false
		new G.Res({
		name:'Paradise emblem',
		desc:'A thing you will get after activating a Paradise portal. Needed to unlock further researching. A pass for further things and more adventures. You can obtain only one Emblem of this type. <b>@God called you to his world... But God\'s paradise has rules that you & your people must follow or Paradise will be closed for you and your people... so in fact your adventure has not ended yet even after adventure in Plain Island. Good luck.<b>',
		icon:[20,9,'magixmod'],
		startWith:0,
		tick:function(me,tick)
		{
			if (me.amount>=1 && !madeUnlockMessageP){ 
				G.Message({type:'good',text:'<b>You and your people activated passage to Paradise. Out of portal an Emblem fall and hits next to your feet. Big golden portal shines and you can see what is beyond it. You come through and notice there is perfect heat to live. Now it is time for more discoveries.</b>',icon:[8,4,'magixmod']});
				madeUnlockMessageP = true
						if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
			{
			var audioPaEmblem = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GainedEmblem.mp3');
			audioPaEmblem.play();
			}
			}
			if (G.has('<span style="color: ##FF0900">Paradise building</span>')){
			me.hidden=true
			}
		},	
		category:'main',

	});
		new G.Res({
		name:'Combat potion pot',
		desc:'Type of potions that are harmful. Can be use to defend people and not only. Some of them can work sectorally. One of soldiers weapon<b>',//soldiers are InFartherDev
		icon:[17,16,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
	});
		new G.Res({
		name:'Jar for concoctions',
		desc:'Concoctions are used as ingredient for stronger potions or to store potions that cannot be stored in normal [Potion pot] ',//soldiers are InFartherDev
		icon:[18,16,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
	});
		new G.Res({
		name:'Black fog',
		desc:'This potion makes fog around victim after pot will be opened. Even more painful for eyes',
		icon:[11,16,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemypotions',
		partOf:'combat potions'
	});
		new G.Res({
		name:'Point of venom',
		desc:'This dark and nature essenced potion is a strong poison.',
		icon:[10,16,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemypotions',
		partOf:'combat potions'
	});
		new G.Res({
		name:'Windy spikes',
		desc:'Releases spikes made out [Wind essence] around and shatters.',
		icon:[9,16,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemypotions',
		partOf:'combat potions'
	});
		new G.Res({
		name:'Back to grave',
		desc:'Send [wild corpse] to pernament death.',
		icon:[8,16,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'alchemypotions',
		partOf:'combat potions'
	});
		new G.Res({
		name:'Dark concoction',
		desc:'Releases darkness from itself. Wrongly crafted may explode',
		icon:[12,16,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			//Platinum and nickel patch
				if (G.has('prospecting II')){
					G.getDict('rocky substrate').res['mine']['nickel ore']=0.03;
				}
				if (G.has('quarrying II')){
					G.getDict('rocky substrate').res['quarry']['platinum ore']=0.00001;
				}
		},
		category:'alchemypotions',
	});
		new G.Res({
		name:'Nature concoction',
		desc:'Can be used to grow flowers. Better don\'t hold it in hands for too long otherwise it may start grow vines on you.',
		icon:[13,16,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
	/*============================================================================
	THEMES
	============================================================================*/
		if (G.checkPolicy('Theme changer')=='green'){
		var cssId = 'greenthemeCss';  
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GreenTheme/greentheme.css';
    link.media = 'all';
    head.appendChild(link);
}
		}
				if (G.checkPolicy('Theme changer')=='blue'){
		var cssId = 'bluethemeCss';  
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/BlueTheme/bluetheme.css';
    link.media = 'all';
    head.appendChild(link);
}
		}
					if (G.checkPolicy('Theme changer')=='red'){
		var cssId = 'redthemeCss';  
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/RedTheme/redtheme.css';
    link.media = 'all';
    head.appendChild(link);
}
		}
						if (G.checkPolicy('Theme changer')=='gray'){
		var cssId = 'graythemeCss';  
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GrayTheme/graytheme.css';
    link.media = 'all';
    head.appendChild(link);
}
		}
					if (G.checkPolicy('Theme changer')=='cyan'){
		var cssId = 'cyanthemeCss';  
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/CyanTheme/cyantheme.css';
    link.media = 'all';
    head.appendChild(link);
}
		}
			if (G.checkPolicy('Theme changer')=='indigo'){
		var cssId = 'indigothemeCss';  
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/IndigoTheme/indigotheme.css';
    link.media = 'all';
    head.appendChild(link);
}
		}
		},
		category:'alchemypotions',
	});
		new G.Res({
		name:'combat potions',
		desc:'This is how many you have all <b>combat potions</b> in total currently.',
		icon:[16,16,'magixmod'],
		meta:true,
	});
		new G.Res({
		name:'Magic essences',
		desc:'This is how many you have all <b>Essences</b> in total currently.',
		icon:[20,13,'magixmod'],
		meta:true,
	});
//Currency
		new G.Res({
		name:'Industry point',
		desc:'You can use these points to set up some industry in new world. @using 90% of all points in total may make God mad.',
		icon:[0,14,'magixmod'],
		displayUsed:true,
		category:'main',
	});
		new G.Res({
		name:'Worship point',
		desc:'You can use these points to decide which seraphin will be worshipped.',//Seraphins won't be added quickly it may be January /February 2020 when you will be able to see them for the first time
		icon:[1,14,'magixmod'],
		category:'main',
	});
//Essence limits which can be increased by buying storages for essences
		let backupmesg
		let milleniummesg
		new G.Res({
		name:'fire essence limit',
		desc:'The bigger limit the more essence.',
		icon:[0,2,'magixmod'],
		hidden:true,
		category:'main',
		tick:function(me,tick)
		{
				if (G.year>=9 && !backupmesg){
       				 G.Message({type:'important',text:'<b>Don\'t forget to backup your save!</b><br>If you don\'t want to lose your save you can always backup it. Click <b>Settings</b> tab then <b>Save to file</b> button. It will download a file with your save that you can load if your curent save ever got lost.',icon:[choose([25,26,27]),22,'magixmod']});
				backupmesg = true
				}
				if (G.year>=999 && G.year<=1005 && !milleniummesg){
       				 G.Message({type:'good',text:'Woah! It\'s been <b>1 thousand</b> years since your tribe started their existence. Your playing supports mod author and motivates for further updates. <br><b>Thank you ;)</b> <br><font color="lime"><tt>Continue enjoying Magix expansion.</tt></font>',icon:[27,23,'magixmod']});
				milleniummesg = true
				}
		},
	});
		new G.Res({
		name:'water essence limit',
		desc:'The bigger limit the more essence.',
		icon:[0,1,'magixmod'],
		category:'main',
		hidden:true,
	});
		new G.Res({
		name:'lightning essence limit',
		desc:'The bigger limit the more essence.',
		icon:[0,3,'magixmod'],
		category:'main',
		hidden:true,
	});
		new G.Res({
		name:'wind essence limit',
		desc:'The bigger limit the more essence.',
		icon:[1,1,'magixmod'],
		category:'main',
		hidden:true,
	});
		new G.Res({
		name:'nature essence limit',
		desc:'The bigger limit the more essence.',
		icon:[1,2,'magixmod'],
		hidden:true,
		category:'main',
	});
		new G.Res({
		name:'dark essence limit',
		desc:'The bigger limit the more essence.',
		icon:[1,3,'magixmod'],
		hidden:true,
		category:'main',
	});
		new G.Res({
		name:'mana capacity',
		desc:'The bigger limit the more mana can be stored.',
		icon:[2,3,'magixmod'],
		hidden:true,
		category:'main',
	});
		new G.Res({
		name:'holy essence limit',
		desc:'The bigger limit the more essence can be stored.',
		icon:[20,6,'magixmod'],
		hidden:true,
		category:'main',
	});
		new G.Res({
		name:'Dark skull construction point',
		desc:'Gained from building [The Skull of Wild Death].',
		icon:[22,4,'magixmod'],
		hidden:true,
		category:'main',
	});
		new G.Res({
		name:'Pagoda construction point',
		desc:'Gained from building [Pagoda of democracy].',
		icon:[8,12,11,4],
		hidden:true,
		category:'main',
	});
		new G.Res({
		name:'Fortress construction point',
		desc:'Gained from building [Fortress of cultural legacy].',
		icon:[8,12,10,4],
		hidden:true,
		category:'main',
	});
		new G.Res({
		name:'Complex construction point',
		desc:'Gained from building [Complex of Dreamers].',
		icon:[8,12,8,4],
		hidden:true,
		category:'main',
	});
//New content
		new G.Res({
		name:'Florist\'s notes',
		desc:'Notes where [Florist] said about its discoveries and tips for future [Florist,florists] .',
		icon:[21,3,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
		hidden:true,
	});
		new G.Res({
		name:'Wizard\'s notes',
		desc:'Notes where [Wizard] / [Archaic wizard] said about its discoveries and basic spells. Some philosophy you can find there too.',
		icon:[21,2,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
		hidden:true,
	});
		new G.Res({
		name:'Poet\'s notes',
		desc:'Text which was written by [Poet] . May summon some cultural traits.',
		icon:[21,1,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
		hidden:true,
	});
		new G.Res({
		name:'Lawyer\'s notes',
		desc:'The code of law.',
		icon:[21,1,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
		hidden:true,
	});
		new G.Res({
		name:'Empty book',
		desc:'The book which can be filled by knowledge of people , instructions and many , many more.',
		icon:[13,12,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
		partOf:'Books',
	});
//Types of books
		new G.Res({
		name:'nature book',
		desc:'The book written by writers with help of [Florist]\'s notes.',
		icon:[2,13,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.003;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
	});
		new G.Res({
		name:'spellbook',
		desc:'The book written by writers with help of [Wizard]\'s notes.',
		icon:[3,13,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.003;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		partOf:'Books',
		category:'misc',
	});
		new G.Res({
		name:'novel',
		desc:'The book written by writers with help of [Poet]\'s  beautiful notes.',
		icon:[1,13,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.003;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		partOf:'Books',
		category:'misc',
	});
		new G.Res({
		name:'Book of law',
		desc:'The book written with help of [Lawyer]\'s thoughts contained in his own notes.',
		icon:[0,13,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.003;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		partOf:'Books',
		category:'misc',
	});
		new G.Res({
		name:'Ambrosium leaf',
		desc:'Thing which can be used to gather [Ambrosium shard]s with help of some other ingredients.',
		icon:[12,14,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.003;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
		hidden:true
	});
		new G.Res({
		name:'Ambrosium shard',
		desc:'People call it merged and hardened [Ambrosium leaf,Ambrosium leaves] . These shinies probably will have their own use.',
		icon:[14,14,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.003;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
				if (G.has('Healthy life')) //Healthy life trait power
				{
					var n=randomFloor(G.getRes('population').amount*0.13);G.gain('health',n,'healthy life');
				}
		},
		category:'misc',
	});
		new G.Res({
		name:'Sulfur',
		desc:'Thing used to craft pyromaniacs\' toys. It is gonna be nice show.',
		icon:[17,15,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.0075;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
	});
		
		new G.Res({
		name:'Light explosives',
		desc:'Dangerous and useful. May be use to break wall or in mining. This second one is dangerous so be careful. Light explosives are these which has small power of explosion <b><span style="color: #e7ffff">but they are still dangerous for human.</span></b> There are some excepts.',
		icon:[19,15,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.009;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
	});
		let madeWarnToolDecayMesg = false
		new G.Res({
		name:'Meals',
		desc:'[Meals] are tastier than common food that is part of a [Meals,meal] . Makes people happier than other [food] .',
		icon:[22,13,'magixmod'],
		turnToByContext:{'eating':{'health':0.024,'happiness':0.045,'bone':0.1},'decay':{'spoiled food':0.8}},
		category:'food',
		tick:function(me,tick)
		{
			if (G.year>=29 && G.year<=31 && !madeWarnToolDecayMesg){
       				 G.Message({type:'important',text:'<font color="gray"><b>Your people noticed that tools they made have started decaying.</font> <li>This doesn\'t seem good.</li></b>',icon:[24,6,'magixmod']});
				madeWarnToolDecayMesg = true
		}},
		partOf:'food',
	});
		new G.Res({
		name:'cloud',
		desc:'Useful while owning big bunches of it. Useless if having so less. Effect of filtering [Cloudy water] and gathering [water] from it.',
		icon:[25,9,'magixmod'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.009;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'misc',
	});
		new G.Res({
		name:'Basic factory equipment',
		desc:'Mostly useful while in [<font color="maroon">Moderation</font>] path. Without it some automation would be impossible. It involves metal hooks or weights or elements of the conveyor.',
		icon:[choose([9,10]),18,'magixmod'],
		category:'gear',
	});
//But books has to be stored somewhere right?
	new G.Res({
		name:'book storage',
		desc:'Each [book storage] unit slows down decay for one [Books] unit.',
		icon:[21,4,'magixmod'],
		getDisplayAmount:function()
		{
			return B(Math.min(this.displayedAmount,G.getRes('Books').displayedAmount))+'<wbr>/'+B(this.displayedAmount);
		},
		tick:function()
		{
		},
		meta:true
	});
		new G.Res({
		name:'Books',
		desc:'All books you own in total.',
		icon:[13,12,'magixmod'],
		meta:true,
		hidden:true,
		category:'misc',
	});
	//To make game not crash by precious pots i had to add it
//New types of people
		new G.Res({
		name:'Instructor',
		desc:'Instructor can teach people any thing. Can teach alchemy or many other. If he will become [elder], he will retire.//The number on the left is how many are currently being employed, while the number on the right is your total amount of instructors.',
		icon:[12,6,'magixmod'],
		partOf:'population',
		category:'demog',
		displayUsed:true,
		tick:function(me,tick)
		{
			var n=randomFloor(G.getRes('Instructor').amount*0.0002);G.gain('elder',n,'aging up');G.lose('Instructor',n,'aging up');
			
				if (G.has('Supreme healthy life'))
				{
					var n=randomFloor(G.getRes('population').amount*0.24);G.gain('health',n,'supreme healthy life');
				}
		},
	});
		new G.Res({
		name:'Alchemists',//There is something more :)
		desc:'This stat shows all alchemists you currently have in total(children + adult alchemists).//The number on the left is how many are currently being employed, while the number on the right is your total amount of alchemists.',
		icon:[12,8,'magixmod'],
		partOf:'population',
		meta:true,
		tick:function(me,tick)
		{
		}
	});
		new G.Res({
		name:'Alchemist',
		desc:'Adult alchemist. Can be hired to special category of jobs same as his younger version. While he will at [elder] age he will retire.//The number on the left is how many are currently being employed, while the number on the right is your total amount of adult alchemists.',
		icon:[12,5,'magixmod'],
		partOf:'Alchemists',
		displayUsed:true,
		tick:function(me,tick)
		{
			var n=randomFloor(G.getRes('Alchemist').amount*0.0002);G.gain('elder',n,'aging up');G.lose('Alchemist',n,'aging up');
		},
		category:'demog',
	});
		new G.Res({
		name:'Child alchemist',
		desc:'Younger alchemist. Can be hired to special category of jobs but chance for accidents will grow. Soon he will grow to [Alchemist].//The number on the left is how many are currently being employed, while the number on the right is your total amount of child alchemists.',
		icon:[12,7,'magixmod'],
		partOf:'Alchemists',
		displayUsed:true,
		tick:function(me,tick)
		{
			var n=randomFloor(G.getRes('Child alchemist').amount*0.002);G.gain('Alchemist',n,'aging up');G.lose('Child alchemist',n,'aging up');
		},
		category:'demog',
	});
		new G.Res({
		name:'drunk',
		desc:'[adult,People] may get [drunk] due to drinking too much alcohol brews. They do not [worker,work], but may slowly get better over time. Common healer cannot aid with it. Unhealed by any (except) default [healer] alcohol sickness will lead [drunk,drunken] people to death. ',
		partOf:'population',
		icon:[17,0,'magixmod'],
		tick:function(me,tick)
		{
			var n=randomFloor(G.getRes('Wine').amount*0.009);G.gain('drunk',n,'alcohol drinking');G.lose('adult',n,'alcohol drinking');G.lose('Wine',n,'drinking');
			if (n>0) G.Message({type:'bad',mergeId:'fellDrunk',textFunc:function(args){return B(args.n)+' '+(args.n==1?'person':'people')+' fell drunk.';},args:{n},icon:[17,0,'magixmod']});
			var drunkHealing=0.01;
			if (G.checkPolicy('flower rituals')=='on') drunkHealing*=1.2;
			var changed=0;
			var n=G.lose('drunk',randomFloor(Math.random()*G.getRes('drunk').amount*drunkHealing),'healing');G.gain('adult',n,'-');changed+=n;
			G.gain('happiness',changed*10,'recovery');
			if (changed>0) G.Message({type:'good',mergeId:'drunkRecovered',textFunc:function(args){return B(args.n)+' drunk '+(args.n==1?'person':'people')+' got better.';},args:{n:changed},icon:[4,3]});
			//Drunk's death
			var drunkMortality=0.005;
			var changed=0;
			var n=G.lose('drunk',randomFloor(Math.random()*G.getRes('drunk').amount*drunkMortality),'drunk');G.gain('corpse',n,'alcohol sickness');changed+=n;
			G.getRes('died this year').amount+=changed;
			if (changed>0) G.Message({type:'bad',mergeId:'diedDrunk',textFunc:function(args){return B(args.n)+' '+(args.n==1?'person':'people')+' died from alcohol sickness.';},args:{n:changed},icon:[5,4]});
			if (G.has('Beer recipe')){ //Spawning rate from Beer recipe trait
 		   var n = G.getRes('adult').amount * 0.000015
  		  G.gain('drunk',n,'Beer');
			}
		},
		category:'demog',
	});
		let madeWarnCorpseMesg = false
		new G.Res({
		name:'wild corpse',//InDevelopment
		desc:'Effect of [<span style="color: red">Revenants</span>] trait. Dangerous for common, alive people will kill them, so think about hiring soldiers. ',
		icon:[19,11,'magixmod'],
		tick:function(me,tick)
		{
			if (me.amount>=300 && !madeWarnCorpseMesg){ 
			G.Message({type:'bad',text:'<b>Beware of Wild corpses!.</b> Since you obtained[<span style="color: red">Revenants</span>] as you noticed the Wild Corpses started to appear. They cause your [Dark essence] to leak and even worse they will kill your people. Slay them at any way you can.',icon:[24,0,'magixmod']});
			madeWarnCorpseMesg = true
			}
		},
		category:'demog',
	});
		let madeThievesWarn = false
		new G.Res({
		name:'wounded alchemist',
		desc:'[Alchemists] may get [wounded,wounded] due to work injuries. They do not [worker,work] but may slowly get better over time.',
		partOf:'population', //There we may add a message for thieves!
		tick:function(me,tick)
		{
				if (G.year>=89 && G.year<=101 && !madeThievesWarn){
       				 G.Message({type:'bad',text:'<b><span style="color: #FFA500">Beware of thievery!</span></b> It will occur since now. Soon your people will start to punish them. Craft equipment for them so it will be even easier deal! Thieves are unhappy adults. They will show their unhappiness by commiting crimes. Even 200% <span style "color= aqua">Happiness</span> won\'t decrease their spawn rate to 0. Civilians (except kids)have a chance to die to thief or to beat him up.',icon:[23,1,'magixmod']});
				madeThievesWarn = true
				}
		},
		icon:[21,2,'magixmod'],
	});
		new G.Res({
		name:'thief',
		desc:'[thief,Thieves] are unhappy adults who commit crimes to show their unhappiness. Even 200% [happiness] won\'t decrease their spawn rate to zero. They can: @steal resources @wound and even <b>kill [population,people]</b>',
		icon:[23,0,'magixmod'],
		category:'demog',
		partOf:'population',
		tick:function(me,tick)
		{
		if (G.year>89){ //Spawning rate
 		   var n = G.getRes('adult').amount * 0.00001
  		  G.gain('thief',n,'unhappiness');
			}
			var toCalm=me.amount*0.007;
			var spent=G.lose(me.name,randomFloor(toCalm),'calmdown');G.gain('adult',(toCalm),'calmdown');
			var toNeut=me.amount*0.001;
			var spent=G.lose(me.name,randomFloor(toNeut),'neutralized by civillian');//Civillian banishes a person from your civilization then
		}
	});
	//To make recovery not like wounded child alch becomes adult alch
		let madeThanks4playmesg = false
		new G.Res({
		name:'wounded child alchemist',
		desc:'[Alchemists] may get [wounded,wounded] due to work injuries. They do not [worker,work] but may slowly get better over time.',
		partOf:'population',
		icon:[21,2,'magixmod'],
		tick:function(me,tick)
		{
				if (G.year>=149 && G.year<=158 && !madeThanks4playmesg){
       				 G.Message({type:'important',text:'<span style="color= aqua">Seems like you are doing preety well. It is been 150 years since you started magic adventure with Magix additions. Thank you for playing with this expansion. Your playing makes mod better and motivates for future updates. <br> <b> -> </b>Remember mod is still getting bigger and gets more content. This means someday the mod may be unavaiable to play for while. If you will lose progress due to update we are sorry. Anyway keep enjoying this adventure... <br> </span><b>Farewell</b>',icon:[24,1,'magixmod']});
				madeThanks4playmesg = true
				}
		},
	});
//FLOWERS!,DYES!
		new G.Res({
		name:'Flowers',
		desc:'This defines the amount of flowers, which you have currently in total.',
		icon:[11,8,'magixmod'],
		partOf:'misc materials',
		meta:true,
		tick:function(me,tick)
		{
				if (G.year>=29)//Gear decaying at year 30 and later
				{
				var toSpoil=(G.getRes('metal tools').amount*0.0001);G.lose(('metal tools'),randomFloor(toSpoil),'decay');
				var toSpoil=(G.getRes('stone tools').amount*0.0004);G.lose(('stone tools'),randomFloor(toSpoil),'decay');
				var toSpoil=(G.getRes('knapped tools').amount*0.00055);G.lose(('knapped tools'),randomFloor(toSpoil),'decay');
				var toSpoil=(G.getRes('stone weapons').amount*0.0004);G.lose(('stone weapons'),randomFloor(toSpoil),'decay');
				var toSpoil=(G.getRes('bow').amount*0.00025);G.lose(('bow'),randomFloor(toSpoil),'decay');
				var toSpoil=(G.getRes('Wand').amount*0.0003);G.lose(('Wand'),randomFloor(toSpoil),'decay');
				var toSpoil=(G.getRes('Crossbow').amount*0.0003);G.lose(('Crossbow'),randomFloor(toSpoil),'decay');
				var toSpoil=(G.getRes('Crossbow belt').amount*0.0003);G.lose(('Crossbow belt'),randomFloor(toSpoil),'decay');
				var toSpoil=(G.getRes('metal weapons').amount*0.0001);G.lose(('metal weapons'),randomFloor(toSpoil),'decay');
				var toSpoil=(G.getRes('armor set').amount*0.0001);G.lose(('armor set'),randomFloor(toSpoil),'decay');
				var toSpoil=(G.getRes('Fishing net').amount*0.0002);G.lose(('Fishing net'),randomFloor(toSpoil),'decay');
				var toSpoil=(G.getRes('Basic factory equipment').amount*0.0002);G.lose(('Basic factory equipment'),randomFloor(toSpoil),'decay');
				}
		},
		visible:false,
	});
		new G.Res({
		name:'Dyes',
		desc:'This defines the amount of dyes crafted out of flowers, which you have currently in total.',
		icon:[11,7,'magixmod'],
		partOf:'misc materials',
		meta:true,
		tick:function(me,tick){
  const thieves = G.getDict("thief")//I slide in thieves stealing ability ;)
  const chances = [
    {
      type: "steal",
      below: 0.6
    },
    {
      type: "hurt",
      below: 0.9
    },
    {
      type: "nothing",
      below: 1
    }
  ]
  const chance = Math.random()
  let action
  //Find what to do
  for(let i = 0; !action; i++){
    if(chance < chances[i].below)
      action = chances[i].type
  }
  //Execute
    switch(action){
      case "steal":
        G.lose("archaic building materials", thieves.amount, "stolen")
	G.lose("basic building materials", thieves.amount*0.1, "stolen")
        break
      case "hurt":
        G.lose("adult", thieves.amount*0.75, "thieves hurting people")
        G.gain("wounded", thieves.amount*0.75, "thieves hurting people")
        break
  }
},
		visible:false,
	});//1
		new G.Res({
		name:'Lavender',
		desc:'Nice flower. Has relaxing smell.',
		icon:[0,9,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//2
		new G.Res({
		name:'Salvia',
		desc:'Plant which may be used to heal [wounded].',
		icon:[1,9,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//3
		new G.Res({
		name:'Bachelor\'s button',
		desc:'Known as cornflower too. It looks cool while planted near house.',
		icon:[0,8,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//4
		new G.Res({
		name:'Dianella',
		desc:'Commonly called flax lilies.',
		icon:[1,8,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//5
		new G.Res({
		name:'Desert rose',
		desc:'Desert version of rose. As most plants these are good for flowerbeds.',
		icon:[0,7,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//6
		new G.Res({
		name:'Cosmos',
		desc:'Cosmos is a genus, with the same common name of cosmos, consisting of flowering plants in the sunflower family.',
		icon:[1,7,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//7
		new G.Res({
		name:'Pink rose',
		desc:'One of few versions of roses. As the other roses they fit perfectly for proposal.',
		icon:[2,7,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//8
		new G.Res({
		name:'Pink tulip',
		desc:'One of few versions of tulips. As the other tulips they fit perfectly for proposal.',
		icon:[3,7,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//9
		new G.Res({
		name:'Coreopsis',
		desc:'Yellow flower. If you\'re looking for low maintenance, drought tolerant, long blooming and cheerful plants for a flower border or a filler, coreopses are a perfect choice.',
		icon:[2,8,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//10
		new G.Res({
		name:'Crown imperial',
		desc:'The Crown imperial is a species of flowering plant in the lily family.',
		icon:[3,8,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//11
		new G.Res({
		name:'Cyan rose',
		desc:'One of few versions of roses. As the other roses they fit perfectly for proposal.',
		icon:[2,9,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//12
		new G.Res({
		name:'Himalayan blue poopy',
		desc:'It was first described by French botanist Viguier in 1814. The species have attractive flowers and have two distinct ranges.',
		icon:[3,9,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//13
		new G.Res({
		name:'Cockscomb',
		desc:'Cockscomb, is a flowering plant in the genus Rhinanthus.',
		icon:[4,7,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//14
		new G.Res({
		name:'Red tulip',
		desc:'One of few versions of tulips. As the other tulips they fit perfectly for proposal.',
		icon:[5,7,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//15
		new G.Res({
		name:'Green Zinnia',
		desc:'Zinnia is a genus of plants of the sunflower tribe within the daisy family.',
		icon:[4,8,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//16
		new G.Res({
		name:'cactus',
		desc:'Spiky. Their main house is in desert. Can be used to make archaic caltrops and dye of course. Do not forget about decor use.',
		icon:[5,8,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//17
		new G.Res({
		name:'Lime rose',
		desc:'One of few versions of roses. As the other roses they fit perfectly for proposal.',
		icon:[5,9,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//18
		new G.Res({
		name:'Lime tulip',
		desc:'One of few versions of tulips. As the other tulips they fit perfectly for proposal.',
		icon:[4,9,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//19
		new G.Res({
		name:'Azure bluet',
		desc:'Azure bluet is a perennial species in the Rubiaceae family.',
		icon:[6,7,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//20
		new G.Res({
		name:'Daisy',
		desc:'Daisy(Bellis perennis) is a common European species of daisy, of the family Asteraceae, often considered the archetypal species of that name.',
		icon:[7,7,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//21
		new G.Res({
		name:'Sunflower',
		desc:'From this flower except yellow dye you can gain edible seeds.',
		icon:[6,8,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//22
		new G.Res({
		name:'Dandelion',
		desc:'Easiest source of yellow dye.',
		icon:[7,8,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//23
		new G.Res({
		name:'Black lily',
		desc:'Black dye source. One of the types of lilies.',
		icon:[6,9,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//24
		new G.Res({
		name:'Black Hollyhock',
		desc:'Sometimes, the genus name is given as Althea; but don\'t confuse the plant with rose of sharon, which may also go by that name.',
		icon:[7,9,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//25
		new G.Res({
		name:'Cattail',
		desc:'Cattail (Typha)is a genus of about 30 species of monocotyledonous flowering plants in the family Typhaceae. These plants have a variety of common names such as reed or cattail.',
		icon:[8,7,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//26
		new G.Res({
		name:'Flax',
		desc:'Flax (Linum usitatissimum), also known as common flax or linseed, is a member of the genus Linum in the family Linaceae.',
		icon:[8,8,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//27
		new G.Res({
		name:'Blue orchid',
		desc:'An blue orchid',
		icon:[9,8,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//28
		new G.Res({
		name:'White tulip',
		desc:'One of few versions of tulips. As the other tulips they fit perfectly for proposal.',
		icon:[8,9,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//29
		new G.Res({
		name:'Lily of the Valley',
		desc:'Lily of the valley sometimes written lily-of-the-valley, is a highly poisonous woodland flowering plant with sweetly scented, pendent, bell-shaped white flowers borne in sprays in spring. It is native throughout the cool temperate Northern Hemisphere in Asia and Europe.',
		icon:[9,9,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//30
		new G.Res({
		name:'Gray rose',
		desc:'One of few versions of roses. As the other roses they fit perfectly for proposal.',
		icon:[11,9,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//31
		new G.Res({
		name:'Gray tulip',
		desc:'One of few versions of tulips. As the other tulips they fit perfectly for proposal.',
		icon:[10,9,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});//32
		new G.Res({
		name:'Brown flower',
		desc:'Just a brown flower.',
		icon:[9,7,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Light gray dye',
		desc:'Dye used in art and many other.',
		icon:[11,0,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Cyan dye',
		desc:'Dye used in art and many other.',
		icon:[10,0,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Gray dye',
		desc:'Dye used in art and many other.',
		icon:[11,1,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Brown dye',
		desc:'Dye used in art and many other.',
		icon:[10,1,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Purple dye',
		desc:'Dye used in art and many other.',
		icon:[10,2,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'White dye',
		desc:'Dye used in art and many other.',
		icon:[11,2,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Green dye',
		desc:'Dye used in art and many other.',
		icon:[10,3,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Pink dye',
		desc:'Dye used in art and many other.',
		icon:[11,3,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Blue dye',
		desc:'Dye used in art and many other.',
		icon:[10,4,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Lime dye',
		desc:'Dye used in art and many other.',
		icon:[11,4,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Black dye',
		desc:'Dye used in art and many other.',
		icon:[10,5,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Light blue dye',
		desc:'Dye used in art and many other.',
		icon:[11,5,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Yellow dye',
		desc:'Dye used in art and many other.',
		icon:[10,6,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Orange dye',
		desc:'Dye used in art and many other.',
		icon:[11,6,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Red dye',
		desc:'Dye used in art and many other.',
		icon:[10,7,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		new G.Res({
		name:'Magenta dye',
		desc:'Dye used in art and many other.',
		icon:[10,8,'magixmod'],
		partOf:'Dyes',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'flowersanddyes',
	});
		let UnderworldMESG = false
		new G.Res({
		name:'Underworld emblem',
		desc:'A thing you will get after entering the Underworld. Needed to unlock further researching. A pass for further things and more adventures. You can obtain only one Emblem of this type. <b>@You brought plagues for discoveries. Fine. I hope you won\'t regret this choice later.<b>',
		icon:[13,19,'magixmod'],
		startWith:0,
		tick:function(me,tick)
		{
			if (me.amount>=1 && !UnderworldMESG){ 
				G.Message({type:'cool',text:'<b>You and your people activated a way to the Underworld. Out of nowhere an Emblem appears behind you. It is hot in touch. Its red glowing only attract curses.</b></br> <font color="fuschia">So prepare to tame 6 Devil\'s traits in order to continue your adventure. Without it the Underworld won\'t allow you discover its secrets.',icon:[12,19,'magixmod']});
				UnderworldMESG = true
			if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
			{
			var audioUnEmblem = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GainedEmblem.mp3');
			audioUnEmblem.play();
			}
			}
			if (G.has('Underworld building 2/2')){
			me.hidden=true
			}
		},	
		category:'main',
	});
		let u1popup = false
		let u2popup = false
		let u3popup = false
		let u4popup = false
		let u5popup = false
		let finalupopup = false
		new G.Res({
		name:'New world point',
		desc:'Obtainable for digging to Underworld',
		icon:[9,19,'magixmod'],
		startWith:0,
		hidden:true,
		tick:function(me,tick)
		{
				if (me.amount==150 && G.hasNot('A feeling from the Underworld') && !u1popup){
       				 G.Message({text:'As your people keep digging down they start to feel more warm but not overheat yet. It mostly warms you. It feels like some soul from not known earlier world wants to say something.</br> <b><font color="aqua">You are the one</br>Who wasn\'t done</br>Those people seek new worlds...</br>...and new odds</font></b>',icon:[0,19,'magixmod']});
				u1popup = true
				}
				if (me.amount==350 && G.hasNot('A feeling from the Underworld') && !u2popup){
       				 G.Message({text:'People continue digging down and another souls want to tell you few things and green soul seemed like Nature essence creation has bitten you. People complain for warmth.</br><b><font color="fuschia">The world you want to meet</br>Will not give all it has right before your feet</br>Danger for people abounds</br>and forbidden will become crowds</font></b>',icon:[1,19,'magixmod']});
				u2popup = true
				}
				if (me.amount==600 && G.hasNot('A feeling from the Underworld') && !u3popup){
       				 G.Message({text:'You see wizards using magic to cool down the warmth so people can continue digging down for new world. Dark voices yell and make civils feared near you. This doesn\'t seem well.</br><b><font color="teal">You want to see fear...</br>Please don\'t show me even one your tear...</br>You hear...</br>I yell so you are fear.</font></b>',icon:[2,19,'magixmod']});
				u3popup = true
				}
				if (me.amount==750 && G.hasNot('A feeling from the Underworld') && !u4popup){
       				 G.Message({text:'Out of nowhere people yell and run away in panic except small group of braves who still dig down. Souls start behave weird... or you just don\'t understand them yet.</br><b><font color="red">Don\'t let the Gods</br>Send there his crowds</br>Danger for people abounds</br>and forbidden are becoming crowds</font></b>',icon:[3,19,'magixmod']});
				u4popup = true
				}
				if (me.amount==950&& G.hasNot('A feeling from the Underworld') && !u5popup){
       				 G.Message({text:'A huge cavern starts to show while braves continued digging down. They run away to you... empowered weirdly by these souls. Another lightning essence creature paralyses you and water essence creatures started behaving insane. Is this greeting from new world?</br><b><font color="silver">Alright '+G.getName('ruler')+' ...</br>Call your soul and make it go...</br>Right to the world</br>The Under...world</font></b>',icon:[4,19,'magixmod']});
				u5popup = true
				}
				if (me.amount ==1500 && G.hasNot('A feeling from the Underworld') && !finalupopup){
					G.middleText('<font color="fuschia">Now ascend through Underworld to continue unlocking the new world.</font>')
				finalupopup = true
				}
		},
	});
		new G.Res({
		name:'Land of the Underworld',
		desc:'The land you got from activating a portal to the Underworld. Place for new buildings.',
		icon:[10,19,'magixmod'],
		displayUsed:true,
		partOf:'tl',
		category:'terr'
	});
	//2nd tier essentials
		new G.Res({
		name:'insight II',
		desc:'[insight II] represents your people\'s ideas and random sparks of intuition.//'+limitDesc('[wisdom II]')+'//Many technologies require insight to be researched. This is higher tier essential. <><font color="aqua">You need to know that each 500 [insight] can be converted into 1 [insight II] point.</font>',
		icon:[18,19,'magixmod'],
		category:'main',
		limit:'wisdom II',
		getDisplayAmount:researchGetDisplayAmount,
		whenGathered:researchWhenGathered,
	});
	new G.Res({
		name:'wisdom II',
		hidden:true,
		icon:[23,19,'magixmod'],
		category:'main',
	});
	new G.Res({
		name:'culture II',
		desc:'[culture II] is produced when your people create beautiful and thought-provoking things.//'+limitDesc('[inspiration II]')+'//Culture is used to develop cultural traits. This is higher tier essential. <><font color="aqua">You need to know that each 500 [culture] can be converted into 1 [culture II] point.</font>',
		icon:[19,19,'magixmod'],
		category:'main',
		limit:'inspiration II',
		tick:function(me,tick)
		{
			if (G.has('dt15')){
			var toSpoil=me.amount*0.0002;
			var spent=G.lose(me.name,randomFloor(toSpoil),'culture sapping');
			}	
		},
		getDisplayAmount:researchGetDisplayAmount,
		whenGathered:researchWhenGathered,
	});
	new G.Res({
		name:'inspiration II',
		hidden:true,
		icon:[10,5],
		category:'main',
		tick:function(me,tick)
		{
		}
	});
	
	new G.Res({
		name:'faith II',
		desc:'[faith II] derives from all things divine, from meditation to sacrifices.//'+limitDesc('[spirituality II]')+'//Some cultural traits and technologies depend on faith. This is higher tier essential. <><font color="aqua">You need to know that each 500 [faith] can be converted into 1 [faith II] point.</font>',
		icon:[17,19,'magixmod'],
		category:'main',
		limit:'spirituality II',
		tick:function(me,tick)
		{
			if (G.has('dt13')){
			var toSpoil=me.amount*0.0002;
			var spent=G.lose(me.name,randomFloor(toSpoil),'faith sapping');
			}
			if(G.has('weaving II')){
					G.getDict('clothier').icon = [27,11,'magixmod']
			}
			if(G.has('Factories I')){
					G.getDict('potter').icon = [28,2,'magixmod',20,2],
					G.getDict('potter').gizmos = false,
					G.getDict('potter').upkeep ={},
					G.getDict('potter').desc = '@uses [clay] or [mud] to craft goods<>The [potter] shapes their clay with great care, for it might mean the difference between fresh water making it to their home safely - or spilling uselessly into the dirt. </br><b><font color="fuschia">Due to obtaining [Factories I] this unit becomes useless and won\'t produce anything, anymore.</font></b>',
					G.getDict('Drying rack').icon = [28,2,'magixmod',13,3,'magixmod'],
					G.getDict('Drying rack').desc = '@This small rack may dry [leather] making it become [Dried leather]. [Dried leather] is used to make even harder clothing, which decays much slower. </br><b><font color="fuschia"> Due to obtaining [Factories I] this unit becomes useless and won\'t produce anything, anymore.</font></b>'
			}
			if(G.has('Manufacture units I')){
			G.getDict('potter').icon = [28,2,'magixmod',20,2],
			G.getDict('potter').gizmos = false,
			G.getDict('potter').upkeep ={},
			G.getDict('potter').desc = '@uses [clay] or [mud] to craft goods<>The [potter] shapes their clay with great care, for it might mean the difference between fresh water making it to their home safely - or spilling uselessly into the dirt. </br><b><font color="fuschia"> Due to obtaining [Manufacture units I] this unit becomes useless and won\'t produce anything, anymore.</font></b>'
			}
			if(G.has('ritualism II')){
			G.getDict('soothsayer').icon = [28,3,'magixmod']
			G.getDict('wisdom rituals').cost = {'faith II':1},
			G.getDict('wisdom rituals').icon=[8,12,23,19,'magixmod'],
			G.getDict('wisdom rituals').desc = 'Improves [dreamer] and [storyteller] efficiency by 25%. After [Eotm] has occured this ritual will consume 1 [faith II] every 30 days; will stop if you run out.',
			G.getDict('flower rituals').cost = {'faith II':1},
			G.getDict('flower rituals').desc = 'People get sick slower and recover faster. Consumes 1 [faith II] every 20 days; will stop if you run out.'
			}
			if(G.has('Eotm') && G.hasNot('ritualism II')){
			G.getDict('wisdom rituals').icon=[8,12,23,19,'magixmod']
			G.getDict('wisdom rituals').cost = {'land':100000}, //THE DISABLER
			G.getDict('wisdom rituals').desc = '<font color="fuschia">Becuase of [Eotm] the [wisdom rituals,Wisdom ritual] is disabled until you obtain [ritualism II] then you can activate it again.</font><br>Improves [dreamer] and [storyteller] efficiency by 25%. After [Eotm] has occured this ritual will consume 1 [faith II] every 30 days; will stop if you run out.',
			G.getDict('flower rituals').cost = {'land':100000}, //THE DISABLER
			G.getDict('flower rituals').desc = '<font color="fuschia">Becuase of [Eotm] the [flower rituals,Flower ritual] is disabled until you obtain [ritualism II] then you can activate it again.</font><br>People get sick slower and recover faster. Consumes 1 [faith II] every 20 days; will stop if you run out.'
			}
			//While evolution occurs flower and wisdom rituals disable automatically
			if (G.has('Eotm') && G.hasNot('ritualism II')){
				G.setPolicyModeByName('wisdom rituals','off');
				G.setPolicyModeByName('flower rituals','off');
			}
			if(G.has('guilds unite')){
			G.getDict('lodge').icon = [29,9,'magixmod']
			G.getDict('guild quarters').icon = [28,15,'magixmod',25,2]
			}
			if(G.has('focused scouting')){
			G.getDict('wanderer').icon = [11,21,'magixmod']
			G.getDict('scout').icon = [12,21,'magixmod']
			}
			if(G.has('bigger kilns')){
			G.getDict('kiln').icon = [28,19,'magixmod']
			G.getDict('Kiln').icon = [20,21,'magixmod']
			G.getDict('kiln').upkeep = {'log':1}
			G.getDict('Kiln').upkeep = {'log':1}
			}
			if(G.has('symbolism II')){
			G.getDict('storyteller').icon = [29,7,'magixmod']
			}
			if(G.has('Music instruments')){
			G.getDict('storyteller').limitPer = {'population':400}
			}
			if(G.has('Oil-digging')){
			G.getDict('quarry').icon = [19,21,'magixmod']
			}
			if(G.has('Moderated carpentry')){
			G.getDict('carpenter workshop').icon = [28,16,'magixmod',25,2]
			G.getDict('carpenter workshop').use = {'land':1,'worker':1}
			G.getDict('carpenter workshop').cost = {'basic building materials':100,'Basic factory equipment':3}
			G.getDict('Carpenter workshop').icon = [28,17,'magixmod',20,14,'magixmod']
			G.getDict('Carpenter workshop').use = {'Land of the Paradise':1,'worker':1}
			G.getDict('Carpenter workshop').cost = {'basic building materials':150,'Basic factory equipment':3}
			}
			if(G.has('Eotm') && G.achievByName['Level up'].won == 0){ //Level up achievement
			G.achievByName['Level up'].won = 1
			G.middleText('- Completed <font color="aqua">Level up</font> achievement -')
			}
			if(G.has('dt9') && G.achievByName['Lucky 9'].won == 0){ //Lucky 9 achievement
			G.achievByName['Lucky 9'].won = 1
			G.middleText('- Completed <font color="red">Lucky 9</font> achievement -')
			}
			if(G.techN >= 100 && G.achievByName['Apprentice'].won == 0){ //Apprentice achievement
			G.achievByName['Apprentice'].won = 1
			G.middleText('- Completed <font color="silver">Apprentice</font> achievement -')
			}
			if(G.techN >= 200 && G.achievByName['Familiar'].won == 0){ //Apprentice achievement
			G.achievByName['Familiar'].won = 1
			G.middleText('- Completed <font color="lime">Familiar</font> achievement -')
			}
			if(G.traitN >= 30 && G.achievByName['Traitsman'].won == 0){ //Traitsman achievement
			G.achievByName['Traitsman'].won = 1
			G.middleText('- Completed <font color="lime">Traitsman</font> achievement -')
			}
			if((G.getRes('insight II').amount) == (G.getRes('wisdom II').amount) && G.achievByName['Extremely smart'].won == 0 && G.has('Eotm')){; //Extremely smart achievement
			G.achievByName['Extremely smart'].won = 1
			G.middleText('- Completed <font color="purple">Extremely smart</font> achievement -')
			}
			if(G.has('<font color="orange">Smaller but efficient</font>')){
			G.getDict('hut').use = {'land':0.9}
			G.getDict('hovel').use = {'land':0.9}
			G.getDict('house').use = {'land':0.9}
			G.getDict('mud shelter').use = {'land':0.9}
			G.getDict('branch shelter').use = {'land':0.9}
			G.getDict('Brick house with a silo').use = {'land':0.9}
			G.getDict('bamboo hut').use = {'land':0.9}
			}
			if(G.achievByName['mausoleum'].won >= 1 && G.achievByName['Democration'].won >= 1 && G.achievByName['Sacrificed for culture'].won >= 1 && G.achievByName['Insight-ly'].won >= 1 && G.achievByName['Metropoly'].won >= 1 && G.achievByName['Apprentice'].won >= 1 && G.achievByName['Experienced'].won == 0){ //Experienced
			G.achievByName['Experienced'].won = 1
			G.middleText('- All achievements  from tier <font color="orange">1</font> completed! - </br> </hr> <small>From now you will start each run with extra 100 fruits</small>')
			}
			if(G.achievByName['Heavenly'].won >= 1 && G.achievByName['Deadly, revenantic'].won >= 1 && G.achievByName['"In the underworld"'].won >= 1 && G.achievByName['Level up'].won >= 1 && G.achievByName['Lucky 9'].won >= 1 && G.achievByName['Traitsman'].won >= 1 && G.achievByName['Smart'].won == 0 && G.achievByName['Familiar'].won == 1){ //Experienced
			G.achievByName['Smart'].won = 1
			G.middleText('- All achievements  from tier <font color="orange">2</font> completed! - </br> </hr> <small>From next run basic housing uses less land.</small>')
			}
			if(G.has('Spiritual piety')){
			G.getDict('Church').icon = [24,23,'magixmod']
			G.getDict('grave').use = {'land':0.7}
			G.getDict('grave').icon = [24,22,'magixmod']
			G.getDict('grave').desc ='@provides 3 [burial spot], in which the [corpse,dead] are automatically interred one by one@graves with buried corpses decay over time, freeing up land for more graves<>A simple grave dug into the earth, where the dead may find rest.//Burying your dead helps prevent [health,disease] and makes your people slightly [happiness,happier].'
			}
			if(G.has('Glory')){
			G.getDict('chieftain').icon = [22,23,'magixmod']
			G.getDict('Mediator').limitPer = {'population':4000}
			G.getDict('clan leader').icon = [25,23,'magixmod']
			}
			if(G.has('cozier building')){
			G.getDict('hut').icon = [29,10,'magixmod']
			G.getDict('hovel').icon = [29,11,'magixmod']
			G.getDict('mud shelter').icon = [29,12,'magixmod']
			G.getDict('house').icon = [29,14,'magixmod']
			G.getDict('branch shelter').icon = [29,13,'magixmod']
			}
			if(G.has('cozy building')){
			G.getDict('hut').icon = [28,12,'magixmod']
			G.getDict('hovel').icon = [28,11,'magixmod']
			G.getDict('mud shelter').icon = [28,13,'magixmod']
			G.getDict('house').icon = [28,14,'magixmod']
			}
			if(G.has('Policy revaluation')){
				G.getDict('food rations').cost = {'influence II':3}
				G.getDict('water rations').cost = {'influence II':3}
				G.getDict('eat spoiled food').cost = {'influence II':2}
				G.getDict('drink muddy water').cost = {'influence II':2}
				G.getDict('insects as food').cost = {'influence II':2}
				G.getDict('eat raw meat and fish').cost = {'influence II':2}
				G.getDict('drink spoiled juice').cost = {'influence II':4}
				G.getDict('child workforce').cost = {'influence II':3}
				G.getDict('drink cloudy water').cost = {'influence II':3}
				G.getDict('elder workforce').cost = {'influence II':3}
				G.getDict('Hovel of colours production rates').cost = {'influence II':5}
				G.getDict('Hut of potters production rates').cost = {'influence II':5}
				G.getDict('Leather factory production rates').cost = {'influence II':5}
				G.getDict('Factory of pots production rates').cost = {'influence II':5}
				G.getDict('population control').cost = {'influence II':5}
				G.getDict('fertility rituals').cost = {'faith II':1}
				G.getDict('fertility rituals').desc = 'Improves birth rate by 20%. Consumes 1 [faith II] every 200 days; will stop if you run out.'
				G.getDict('harvest rituals').cost = {'faith II':1}
				G.getDict('harvest rituals').desc = 'Improves [gatherer], [hunter] and [fisher] efficiency by 20%. Consumes 1 [faith II] every 200 days; will stop if you run out.'
				G.getDict('harvest rituals for flowers').cost = {'faith II':1}
				G.getDict('harvest rituals for flowers').desc = 'Improves [Florist] efficiency by 45%. Consumes 1 [faith II] every 200 days and 1 [influence II] every 400 days; will stop if you run out.'
				G.getDict('Crafting & farm rituals').cost = {'faith II':1}
				G.getDict('Crafting & farm rituals').desc = 'Improves [Paper-crafting shack] , [Well of mana] and <b>Farms</b> efficiency by 17%. Consumes 1 [faith II] every 200 days & 1 [influence II] every 400 days; will stop if you run out.'
				if(G.modsByName['Laws Of Food'] || G.modsByName['Laws Of Food Free Version']){ //Interaction with laws of food. Specially laws of food free will no longer be free after policy revaluation
					G.getDict('eat raw meat').cost = {'influence II':2}
					G.getDict('eat herbs').cost = {'influence II':2}
					G.getDict('eat cooked meat').cost = {'influence II':2}
					G.getDict('eat cured meat').cost = {'influence II':2}
					G.getDict('eat raw seafood').cost = {'influence II':2}
					G.getDict('eat cooked seafood').cost = {'influence II':2}
					G.getDict('eat cured seafood').cost = {'influence II':2}
					G.getDict('eat cooked meat and cooked seafood').cost = {'influence II':5}
					G.getDict('eat cured meat and cured seafood').cost = {'influence II':5}
					G.getDict('eat fruit').cost = {'influence II':2}
					G.getDict('eat bread').cost = {'influence II':2}
					G.getDict('eat meals').cost = {'influence II':2}
					G.getDict('eat sunflower seeds').cost = {'influence II':2}
					G.getDict('drink juices').cost = {'influence II':2}
				}
					if(G.modsByName['Market mod']){ //Interaction with Market.
					G.getDict('extended food catalog').cost = {'influence II':5}
					G.getDict('extended archaic catalog').cost = {'influence II':5}
					G.getDict('extended basic catalog').cost = {'influence II':5}
					G.getDict('extended precious catalog').cost = {'influence II':5}
					G.getDict('extended essences catalog').cost = {'influence II':5}
				}
			}
			if(G.has('Mining strategy'))
			{
			G.getDict('mine').icon = [18,23,'magixmod']
			}
			if(G.has('Safer explosive usage'))
			{
			G.getDict('explosive mine').icon = [20,23,'magixmod']
			}
			if(G.has('Magic adept') && G.achievByName['Man of essences'].won == 0){ //Man of essences achievement
			G.achievByName['Man of essences'].won = 1
			G.middleText('- Completed <font color="indigo">Man of essences</font> achievement -')
			}
			if(G.has('Master mana-making')){
			G.getDict('Mana maker').icon = [4,24,'magixmod']
			}
			if(G.has('Hunters & fishers unification'))
			{
			G.getDict('harvest rituals').desc = 'Improves [gatherer], efficiency by 20% and [Fishers & hunters camp] by 35%. Consumes 1 [faith II] every 200 days; will stop if you run out.'
			G.getDict('hunter').icon = [28,2,'magixmod',18,2]
			G.getDict('fisher').icon = [28,2,'magixmod',17,2]
			}
			if(G.has('Camp-cooking'))
			{
			G.getDict('Fishers & hunters camp').upkeep = {'food':75,'fire pit':3}
			}
			if(G.modsByName['Market mod']){
				if(G.has('Backshift')){
					G.getDict('bazaar_buy').use={'worker':2,'land':1}
					G.getDict('bazaar_sell').use={'worker':2,'land':1}
					G.getDict('market_buy').use={'worker':3,'land':1}
					G.getDict('market_sell').use={'worker':3,'land':1}
				}
				if(G.has('Backshift') && G.hasNot('Essence trading')){
					G.getDict('bazaar_buy').icon=[29,24,'magixmod',26,24,'magixmod']
					G.getDict('bazaar_sell').icon=[28,24,'magixmod',26,24,'magixmod']
					G.getDict('market_buy').icon=[29,24,'magixmod',27,24,'magixmod']
					G.getDict('market_sell').icon=[28,24,'magixmod',27,24,'magixmod']
					G.getDict('trader_buy').icon=[29,24,'magixmod',30,18,'magixmod']
					G.getDict('trader_sell').icon=[28,24,'magixmod',30,18,'magixmod']
				}else if(G.has('Essence trading')){
					G.getDict('bazaar_buy').icon=[29,24,'magixmod',30,23,'magixmod']
					G.getDict('bazaar_sell').icon=[28,24,'magixmod',30,23,'magixmod']
					G.getDict('market_buy').icon=[29,24,'magixmod',30,24,'magixmod']
					G.getDict('market_sell').icon=[28,24,'magixmod',30,24,'magixmod']
					G.getDict('trader_buy').icon=[29,24,'magixmod',30,18,'magixmod']
					G.getDict('trader_sell').icon=[28,24,'magixmod',30,18,'magixmod']
				}
			}
			//3rd party achievement's code
			if(G.modsByName['Market mod'] || G.modsByName['Coal mod'] || G.modsByName['Laws Of Food'] || G.modsByName['Laws Of Food Free Version']){
			   if(G.achievByName['3rd party'].won==0){
			G.achievByName['3rd party'].won = 2 //Fix for displaying over time middleText
			G.middleText('- Completed <font color="pink">3rd party</font> achievement -')
			  }
			}
			if(G.has('Mo\' beauty')){
				G.getDict('warehouse').icon=[30,9,'magixmod']
				G.getDict('barn').icon=[30,8,'magixmod']
				G.getDict('granary').icon=[30,7,'magixmod']
				G.getDict('stockpile').icon=[30,6,'magixmod']
				G.getDict('well').icon=[30,5,'magixmod']
				G.getDict('furnace').icon=[30,4,'magixmod']
				G.getDict('well of the Plain Island').icon=[30,3,'magixmod']
				G.getDict('carver').icon=[30,2,'magixmod']
				G.getDict('firekeeper').icon=[30,1,'magixmod']
				G.getDict('storage pit').icon=[30,0,'magixmod']
				G.getDict('woodcutter').icon=[31,0,'magixmod']
				G.getDict('digger').icon=[31,1,'magixmod']
				G.getDict('artisan').icon=[31,2,'magixmod']
				G.getDict('dreamer').icon=[31,3,'magixmod']
				G.getDict('architect').icon=[31,4,'magixmod']
				G.getDict('healer').icon=[31,5,'magixmod']
				G.getDict('blacksmith workshop').icon=[31,16,'magixmod']
			}
			if(G.has('Plain island mining strategy')){
			G.getDict('Mine of the plain island').icon = [31,8,'magixmod']
			}
			if(G.has('backshift at farms')){
			G.getDict('Wheat farm').icon = [31,19,'magixmod']
			G.getDict('Wheat farm').use={'worker':12}
			G.getDict('Berry farm').icon = [31,17,'magixmod']
			G.getDict('Berry farm').use={'worker':12}
			G.getDict('Sugar cane farm').icon = [31,18,'magixmod']
			G.getDict('Sugar cane farm').use={'worker':12,'Instructor':2}
			}
			if(G.checkPolicy('se12')=='on')//Okar The Seer's backfire
			{
			G.getDict('Guru').upkeep = {'food':10,'water':5}
			G.getDict('dreamer').upkeep = {'food':2,'water':1}
			G.getDict('Guru').alternateUpkeep = {'spoiled food':4,'muddy water':2}
			G.getDict('dreamer').alternateUpkeep = {'spoiled food':2,'muddy water':1}
			}
		},
		getDisplayAmount:researchGetDisplayAmount,
		whenGathered:researchWhenGathered,
	});
	new G.Res({
		name:'spirituality II',
		hidden:true,
		icon:[22,19,'magixmod'],
		category:'main',
	});
	new G.Res({
		name:'influence II',
		desc:'[influence II] is generated by power structures.//'+limitDesc('[authority II]')+'//Influence is required to enact most policies or remove traits. This is higher tier essential. <><font color="aqua">You need to know that each 500 [influence] can be converted into 1 [influence II] point.</font>',
		icon:[20,19,'magixmod'],
		category:'main',
		limit:'authority II',
		tick:function(me,tick)
		{
			if (G.has('dt14')){
			var toSpoil=me.amount*0.0002;
			var spent=G.lose(me.name,randomFloor(toSpoil),'influence sapping');
			}
		},
		getDisplayAmount:researchGetDisplayAmount,
		whenGathered:researchWhenGathered,
	});
	new G.Res({
		name:'authority II',
		hidden:true,
		icon:[24,19,'magixmod'],
		category:'main',
	});
		let RollGathererIcon = false
		new G.Res({
		name:'hardened clothes',
		desc:'Sewn together from [Dried leather] and embroidered with [Thread]s .//Each [population,Person] wearing clothing is slightly happier and healthier than while wearing [basic clothes] . People wearing this clothing feel more safe. Decays slower.'+clothesInfo,
		icon:[choose([27,28]),choose([0,1]),'magixmod'],
		category:'gear',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.00009;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		if(G.has('Magical presence') && !RollGathererIcon){//It was rolling an icon every tick so i slide in this code right there
		G.getDict('gatherer').icon = [choose([9,10,11,12,13]),24,'magixmod']
		RollGathererIcon = true
		}
		},
	});
		new G.Res({
		name:'Essenced seeds',
		desc:'The creation that uses [Magic essences] + [Mana] + [Beet seeds,seeds] . Can be used to start farming magic flowers that will allow you to gather even more essences.',
		icon:[27,10,'magixmod'],
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'oil',
		desc:'[oil] is a flammable liquid hydrocarbon mixture. Mixtures labelled naphtha have been produced from natural gas condensates, petroleum distillates, and the distillation of coal tar and peat. Can be used as fuel in the future',
		icon:[9,6],
		category:'misc',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.008;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
	new G.Res({
		name:'Blue firework',
		desc:'Happy new year and launch up this firework into the sky. Provides happiness per each firework launched into the sky/',
		icon:[2,0,'seasonal'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.009;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'seasonal',
		hidden:true,
	});
		new G.Res({
		name:'Orange firework',
		desc:'Happy new year and launch up this firework into the sky. Provides happiness per each firework launched into the sky.',
		icon:[1,0,'seasonal'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.009;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'seasonal',
		hidden:true,
	});
		
		new G.Res({
		name:'Dark Blue Firework',
		desc:'Happy new year and launch up this firework into the sky. Provides happiness per each firework launched into the sky. This is [Dark essence,dark essenced] firework so it can unleash its spectacular show at daylight./',		icon:[5,0,'seasonal'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.009;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'seasonal',
		hidden:true,
	});
		new G.Res({
		name:'Dark Orange Firework',
		desc:'Happy new year and launch up this firework into the sky. Provides happiness per each firework launched into the sky. Provides happiness per each firework launched into the sky. This is [Dark essence,dark essenced] firework so it can unleash its spectacular show at daylight.',
		icon:[4,0,'seasonal'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.009;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'seasonal',
		hidden:true,
	});
		new G.Res({
		name:'Firecracker',
		desc:'Firecrackers are fireworks but without thread.',
		icon:[3,0,'seasonal'],
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.009;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		category:'seasonal',
		hidden:true,
	});
		new G.Res({
		name:'corpsedecaypoint',
	});
		new G.Res({
		name:'heavenlyTemplePoint',
		displayName:'Temple of heaven point'
	});
	/*=====================================================================================
	UNITS
	=======================================================================================*/
	G.unitCategories.push(
		{id:'debug',name:'<font color="#1f4f22">Debug</font>'},
		{id:'housing',name:'Housing'},
		{id:'civil',name:'Civil'},
		{id:'crafting',name:'Crafting'},
		{id:'production',name:'Gathering'},
		{id:'political',name:'Political'},
		{id:'discovery',name:'Discovery'},
		{id:'cultural',name:'Cultural'},
		{id:'spiritual',name:'Spiritual'},
		{id:'exploration',name:'Exploration'},
		{id:'storage',name:'Storage'},
		{id:'wonder',name:'<font color="#ab20a2">Wonders</font>'},
		{id:'dimensions',name:'Portals'},
		{id:'seasonal',name:'<span style="color:#7fffd4">Seasonal</span>'},
		{id:'plainisleunit',name:'Plain Island'},
		{id:'paradiseunit',name:'Paradise'},
		{id:'alchemy',name:'Alchemy'},
		{id:'guard',name:'<span style="color:#ff66cc">Army & Guards</span>'},
	);
	
	G.MODE_OFF={name:'Off',desc:'The unit will not produce anything.',icon:[1,0]};
	
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
	
	new G.Unit({
		name:'gatherer',
		startWith:5,
		desc:'@forages for basic [food], [water] and [archaic building materials,Various interesting things]<>A vital part of an early tribe, [gatherer]s venture in the wilderness to gather food, wood, and other things of note.',
		icon:[0,2],
		cost:{},
		use:{'worker':1},
		//upkeep:{'food':0.2},
		//alternateUpkeep:{'food':'spoiled food'},
		effects:[
			{type:'gather',context:'gather',amount:2,max:4},//,multMax:{'leather pouches':1.1}//TODO
			//{type:'gather',context:'gather',what:{'water':1,'muddy water':1},amount:1,max:3,req:{'gathering focus':'water'}},
			{type:'gather',context:'gather',what:{'water':1,'muddy water':1},amount:1,max:3},
			{type:'gather',context:'gather',what:{'herb':0.5,'fruit':0.5},amount:1,max:1,req:{'plant lore':true}},
			{type:'addFree',what:{'worker':0.1},req:{'scavenging':true}},
			{type:'mult',value:1.2,req:{'harvest rituals':'on'}},
			{type:'mult',value:1.075,req:{'Focused gathering':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.125,req:{'Focused gathering':true,'<font color="maroon">Caretaking</font>':true}},
			{type:'mult',value:0.8,req:{'se12':'on'}},
		],
		req:{'tribalism':true},
		category:'production',
		priority:10,
	});
	
	new G.Unit({
		name:'dreamer',
		desc:'@generates [insight] every now and then, which you can use to research early technologies<>A [dreamer] spends their time observing, thinking, and wondering why things are the way they are.',
		icon:[1,2],
		cost:{},
		use:{'worker':1},
		//upkeep:{'coin':0.2},
		effects:[
			{type:'gather',what:{'insight':0.1}},
			{type:'gather',what:{'insight':0.05},req:{'symbolism':true,'symbolism II':false}},
			{type:'gather',what:{'insight':0.07},req:{'symbolism II':true}},
			{type:'mult',value:1.2,req:{'wisdom rituals':'on','ritualism II':false}},
			{type:'mult',value:1.25,req:{'wisdom rituals':'on','ritualism II':true}},
			{type:'mult',value:1.05,req:{'Knowledgeable':true}},
			{type:'mult',value:2/3,req:{'dt18':true}},
			{type:'mult',value:0.1,req:{'Eotm':true}},
			{type:'mult',value:1.5,req:{'se12':'on'}},
			{type:'mult',value:0.75,req:{'se11':'on'}},
		],
		req:{'speech':true},
		category:'discovery',
		priority:5,
	});
	
	new G.Unit({
		name:'storyteller',
		desc:'@generates [culture] every now and then<>[storyteller]s gather the tribe around at nightfall to tell the tales of their ancestors.',
		icon:[14,2],
		cost:{},
		use:{'worker':1},
		upkeep:{'coin':0.1},
		effects:[
			{type:'gather',what:{'culture':0.1}},
			{type:'gather',what:{'culture':0.05},req:{'symbolism':true,'symbolism II':false}},
			{type:'gather',what:{'insight':0.07},req:{'symbolism II':true}},
			{type:'mult',value:1.3,req:{'artistic thinking':true}},
			{type:'mult',value:1.2,req:{'wisdom rituals':'on','ritualism II':false}},
			{type:'mult',value:1.25,req:{'wisdom rituals':'on','ritualism II':true}},
			{type:'mult',value:1.05,req:{'Cultural forces arise':true}},
			{type:'mult',value:0.1,req:{'Eotm':true}},
			{type:'mult',value:0.9,req:{'se12':'on'}},
		],
		req:{'oral tradition':true},
		category:'cultural',
	});
	
	new G.Unit({
		name:'artisan',
		desc:'@starts with the ability to turn [stone]s into [knapped tools]@gains more modes as technology progresses<>An [artisan] dedicates their life to crafting various little objects by hand.//Note : artisans will gain new modes of operation when you discover new technologies, such as crafting stone tools; you can press the button with 3 dots on the side of this unit to switch between those modes.',
		icon:[6,2],
		cost:{},
		use:{'worker':1},
		upkeep:{'coin':0.1},
		gizmos:true,
		modes:{
			'knap':{name:'Knap flint',icon:[0,9],desc:'Turn [stone]s into [knapped tools].'},
			'knap bone':{name:'Knap bone',icon:[0,9,8,7],desc:'Turn [bone]s into [knapped tools].',req:{'bone-working':true}},
			'stone tools':{name:'Craft stone tools',icon:[1,9],desc:'Turn [stone]s and [stick]s into [stone tools].',req:{'tool-making':true},use:{'knapped tools':1}},
			'stone weapons':{name:'Craft stone weapons',icon:[5,9],desc:'Turn [stone]s and [stick]s into [stone weapons].',req:{'spears':true},use:{'knapped tools':1}},
			'bows':{name:'Craft bows',icon:[6,9],desc:'Turn [stone]s and [stick]s into [bow]s.',req:{'bows':true},use:{'stone tools':1}},
			'baskets':{name:'Weave baskets',icon:[14,7],desc:'Turn [stick]s into [basket]s.',req:{'basket-weaving':true},use:{'knapped tools':1}},
			'craftwands':{name:'Craft wands',icon:[6,4,'magixmod'],desc:'Your artisan will craft tool used by wizards. It is not any junk tool.',req:{'Wizardry':true},use:{'stone tools':2}},
			'craftink':{name:'Craft ink',icon:[18,6,'magixmod'],desc:'Your artisan will craft [Ink]. Will use water and [Black dye],[Blue dye] or [Brown dye].',req:{'Ink crafting':true}},
			'craftnet':{name:'Craft fishing net',icon:[13,8,'magixmod'],desc:'Your artisan will craft [Fishing net]. Needs [Instructor] because net <b> must be strong. Will use [Dried leather] to make it stronger.',req:{'Fishing II':true},use:{'stone tools':2,'Instructor':1}},
			'craftfirstaid':{name:'Craft first aid things',icon:[16,10,'magixmod'],desc:'Your artisan will craft equipment for [First aid healer]. He will craft: [First aid things] .',req:{'first aid':true}, use:{'stone tools':1}},
			'dyes1':{name:'Make dyes from flowers(Set 1)',desc:'Your artisan will convert these flowers into dyes: [Lavender],[Salvia],[Bachelor\'s button],[Desert rose],[Cosmos],[Pink rose],[Pink tulip],[Coreopsis].',req:{'plant lore':true,'Manufacture units I':false,'<font color="yellow">A gift from the Mausoleum</font>':true},icon:[11,7,'magixmod']},
			'dyes2':{name:'Make dyes from flowers(Set 2)',desc:'Your artisan will convert these flowers into dyes: [Crown imperial],[Cyan rose],[Himalayan blue poopy],[Cockscomb],[Red tulip],[Green Zinnia],[cactus],[Lime rose]. @Bonus: While crafting dyes out of [cactus] you will get its spikes and a dye as usual.',req:{'plant lore':true,'Manufacture units I':false,'<font color="yellow">A gift from the Mausoleum</font>':true},icon:[11,7,'magixmod']}, 
			'dyes3':{name:'Make dyes from flowers(Set 3)',desc:'Your artisan will convert these flowers into dyes: [Lime tulip],[Azure bluet],[Daisy],[Sunflower],[Dandelion],[Black lily],[Black Hollyhock],[Cattail]. @Bonus: While crafting dyes out of [Sunflower] you will get its edible [Sunflower seeds] and a dye as usual.',req:{'plant lore':true,'Manufacture units I':false,'<font color="yellow">A gift from the Mausoleum</font>':true},icon:[11,7,'magixmod']},
			'dyes4':{name:'Make dyes from flowers(Set 4)',icon:[11,7,'magixmod'],desc:'Your artisan will convert these flowers into dyes: [Flax],[Blue orchid],[White tulip],[Lily of the Valley],[Gray rose],[Gray tulip],[Brown flower].',req:{'plant lore':true,'Manufacture units I':false,'<font color="yellow">A gift from the Mausoleum</font>':true}},
			'craftbook':{name:'Craft book',icon:[13,12,'magixmod'],desc:'Your artisan will craft [Empty book,books].',req:{'Bookcrafting':true},use:{'stone tools':1}},
			'enchseeds':{name:'Enchant seeds',icon:[27,10,'magixmod'],desc:'Enchant [Beet seeds,seeds] using [Magic essences] and [Mana]. These seeds can be useful to start essence farms',req:{'Seed-enchanting':true},use:{'Wand':1}},
		},
		effects:[
			{type:'convert',from:{'stone':1},into:{'knapped tools':1},every:5,mode:'knap'},
			{type:'convert',from:{'bone':1},into:{'knapped tools':1},every:5,mode:'knap bone'},
			{type:'convert',from:{'stick':1,'stone':1},into:{'stone tools':1},every:8,mode:'stone tools'},
			{type:'convert',from:{'stick':1,'stone':1},into:{'stone weapons':1},every:8,mode:'stone weapons'},
			{type:'convert',from:{'stick':1,'stone':1},into:{'bow':1},every:10,mode:'bows'},
			{type:'convert',from:{'stick':15},into:{'basket':1},every:10,mode:'baskets'},
			{type:'convert',from:{'stick':4,'stone':2},into:{'Wand':1},every:5,mode:'craftwands'},
			{type:'convert',from:{'Black dye':1,'mud':0.0015,'water':0.015},into:{'Ink':0.75},every:4,mode:'craftink'},
        		{type:'convert',from:{'Brown dye':1,'mud':0.0015,'water':0.015},into:{'Ink':0.75},every:4,mode:'craftink'},
        		{type:'convert',from:{'Blue dye':1,'mud':0.0015,'water':0.015},into:{'Ink':0.75},every:4,mode:'craftink'},
			{type:'convert',from:{'Thread':35,'Dried leather':1},into:{'Fishing net':1},every:5,mode:'craftnet'},
			{type:'convert',from:{'Thread':1.5,'herb':0.75},into:{'First aid things':1},every:5,mode:'craftfirstaid'},
       			{type:'convert',from:{'Thread':0.5,'herb':1},into:{'First aid things':1},every:5,mode:'craftfirstaid'},
       			{type:'convert',from:{'Thread':2,'herb':1.5,'hide':1},into:{'First aid things':1},every:7,mode:'craftfirstaid'},
			{type:'convert',from:{'Lavender':2},into:{'Purple dye':1},every:5,mode:'dyes1'},
        		{type:'convert',from:{'Salvia':3},into:{'Magenta dye':1},every:5,mode:'dyes1'},
        		{type:'convert',from:{'Bachelor\'s button':2},into:{'Blue dye':1},every:5,mode:'dyes1'},
       			{type:'convert',from:{'Desert rose':2},into:{'Magenta dye':1},every:5,mode:'dyes1'},
        		{type:'convert',from:{'Cosmos':2},into:{'Magenta dye':1},every:5,mode:'dyes1'},
       			{type:'convert',from:{'Pink rose':3},into:{'Pink dye':1},every:5,mode:'dyes1'},
        		{type:'convert',from:{'Pink tulip':2},into:{'Pink dye':1},every:5,mode:'dyes1'},
        		{type:'convert',from:{'Coreopsis':2},into:{'Yellow dye':1},every:5,mode:'dyes1'},
        		{type:'convert',from:{'Crown imperial':2},into:{'Orange dye':1},every:5,mode:'dyes2'},
       			{type:'convert',from:{'Cyan rose':2},into:{'Cyan dye':1},every:5,mode:'dyes2'},
        		{type:'convert',from:{'Himalayan blue poopy':2},into:{'Cyan dye':1},every:5,mode:'dyes2'},
       			{type:'convert',from:{'Cockscomb':2},into:{'Red dye':1},every:5,mode:'dyes2'},
        		{type:'convert',from:{'Red tulip':2},into:{'Red dye':1},every:5,mode:'dyes2'},
        		{type:'convert',from:{'Green Zinnia':3},into:{'Green dye':1},every:5,mode:'dyes2'},
        		{type:'convert',from:{'cactus':2},into:{'Green dye':1,'Cactus spikes':3},every:5,mode:'dyes2'},
        		{type:'convert',from:{'Lime rose':2},into:{'Lime dye':1},every:5,mode:'dyes2'},
        		{type:'convert',from:{'Lime tulip':2},into:{'Lime dye':1},every:5,mode:'dyes3'},
        		{type:'convert',from:{'Azure bluet':4},into:{'Light gray dye':1},every:5,mode:'dyes3'},
       			{type:'convert',from:{'Daisy':2},into:{'Light gray dye':1},every:5,mode:'dyes3'},
        		{type:'convert',from:{'Sunflower':1},into:{'Yellow dye':1,'Sunflower seeds':3},every:7,mode:'dyes3'},
        		{type:'convert',from:{'Dandelion':2},into:{'Yellow dye':1},every:5,mode:'dyes3'},
        		{type:'convert',from:{'Black lily':3},into:{'Black dye':1},every:5,mode:'dyes3'},
        		{type:'convert',from:{'Black Hollyhock':2},into:{'Black dye':1},every:5,mode:'dyes3'},
        		{type:'convert',from:{'Cattail':2},into:{'Brown dye':1},every:5,mode:'dyes3'},
			{type:'convert',from:{'stick':3,'stone':2},into:{'Crossbow':1},every:5,req:{'Hunting II':true},mode:'bows'},
        		{type:'convert',from:{'lumber':1,'stone':25},into:{'Crossbow belt':20},every:5,req:{'Hunting II':true},mode:'bows'},
    			{type:'convert',from:{'Flax':3},into:{'Light blue dye':1},every:5,mode:'dyes4'},
        		{type:'convert',from:{'Blue orchid':2},into:{'Light blue dye':1},every:5,mode:'dyes4'},
        		{type:'convert',from:{'White tulip':2},into:{'White dye':1},every:5,mode:'dyes4'},
        		{type:'convert',from:{'Lily of the Valley':3},into:{'White dye':1},every:5,mode:'dyes4'},
        		{type:'convert',from:{'Brown flower':2},into:{'Brown dye':1},every:5,mode:'dyes4'},
        		{type:'convert',from:{'Gray rose':3},into:{'Gray dye':1},every:5,mode:'dyes4'},
       		 	{type:'convert',from:{'Gray tulip':2},into:{'Gray dye':1},every:5,mode:'dyes4'},
        		{type:'convert',from:{'Paper':30,'hide':1},into:{'Empty book':1},every:7,mode:'craftbook'},
			{type:'convert',from:{'Magic essences':2,'Beet seeds':1,'Mana':0.5},into:{'Essenced seeds':1},every:7,mode:'enchseeds'},
			{type:'mult',value:1.2,req:{'ground stone tools':true}},
			{type:'mult',value:1.08,req:{'Motivation for artisans':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.04,req:{'Motivation for artisans':true,'<font color="maroon">Caretaking</font>':true}},
			{type:'mult',value:1.03,req:{'Crafting & farm rituals':'on','power of the faith':true}},
		],
		req:{'stone-knapping':true},
		category:'crafting',
	});
		new G.Unit({
		name:'carver',
		desc:'@starts with the ability to turn [stone]s or [bone]s into [statuette]s@gains more modes as technology progresses<>A [carver] uses fine hand-crafting to produce goods out of wood, stone and bone.',
		icon:[21,2],
		cost:{},
		use:{'worker':1},
		upkeep:{'coin':0.1},
		gizmos:true,
		modes:{
			'stone statuettes':{name:'Carve stone statuettes',icon:[8,9],desc:'Turn [stone]s into [statuette]s.',use:{'knapped tools':1}},
			'bone statuettes':{name:'Carve bone statuettes',icon:[8,9],desc:'Turn [bone]s into [statuette]s.',use:{'knapped tools':1}},
			'cut stone':{name:'Cut stones',icon:[0,8],desc:'Slowly turn 10 [stone]s into 1 [cut stone].',req:{'masonry':true},use:{'stone tools':1}},
			'smash cut stone':{name:'Smash stone blocks',icon:[2,6],desc:'Turn [cut stone]s into 9 [stone]s each.',req:{'quarrying':true},use:{'stone tools':1}},
			'gem blocks':{name:'Carve gem blocks',icon:[7,9],desc:'Slowly turn 10 [gems] into 1 [gem block].',req:{'gem-cutting':true},use:{'stone tools':1}},
			'wood statuettes':{name:'Carve wooden statuettes',icon:[13,1,'magixmod'],desc:'Your carver will now use carve statuettes out of [log].',use:{'knapped tools':1}},
			'gdablockscraft':{name:'Cut other stones',icon:[2,12,'magixmod'],desc:'Your carver will craft one [Various cut stones,Various cut stone] out of 9 [Various stones] each.',use:{'knapped tools':1},req:{'masonry':true}},
			'gdablockssmash':{name:'Smash other stone blocks',icon:[3,12,'magixmod'],desc:'Your carver will smash a [Various cut stones,Various cut stone] into 9 [Various stones].',use:{'knapped tools':1},req:{'masonry':true}},    
		},
		effects:[
			{type:'convert',from:{'stone':1},into:{'statuette':1},every:5,mode:'stone statuettes'},
			{type:'convert',from:{'bone':1},into:{'statuette':1},every:5,mode:'bone statuettes'},
			{type:'convert',from:{'stone':10},into:{'cut stone':1},every:15,mode:'cut stone'},
			{type:'convert',from:{'cut stone':1},into:{'stone':9},every:5,mode:'smash cut stone'},
			{type:'convert',from:{'gems':10},into:{'gem block':1},every:15,mode:'gem blocks'},
			{type:'convert',from:{'log':1},into:{'Wooden statuette':1,'Scobs':3},every:7,mode:'wood statuettes'},
			{type:'convert',from:{'Various stones':9},into:{'Various cut stones':1},every:5,mode:'gdablockscraft'},
			{type:'convert',from:{'Various cut stones':1},into:{'Various stones':9},every:5,mode:'gdablockssmash'},
			{type:'mult',value:1.2,req:{'ground stone tools':true}},
			{type:'mult',value:0.95,req:{'dt3':true}},
			{type:'mult',value:1.03,req:{'Inspirated carvers':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.06,req:{'Inspirated carvers':true,'<font color="maroon">Caretaking</font>':true}},
		],
		req:{'carving':true},
		category:'crafting',
	});
	
	new G.Unit({
		name:'clothier',
		desc:'@works with textiles, notably producing all kinds of clothes<>A [clothier] can make and use fabrics to keep your people clothed, and therefore warm and happy.',
		icon:[19,2],
		cost:{},
		use:{'worker':1},
		upkeep:{'coin':0.2},
		gizmos:true,
		modes:{
			'sew grass clothing':{name:'Sew grass clothing',icon:[15,7],desc:'Craft [primitive clothes] from 30 [herb]s each.',use:{'stone tools':1}},
			'sew hide clothing':{name:'Sew hide clothing',icon:[15,7],desc:'Craft [primitive clothes] from 3 [hide]s each.',use:{'stone tools':1}},
			'weave fiber clothing':{name:'Weave fiber clothing',icon:[16,7],desc:'Craft [basic clothes] from 50 [herb]s each.',use:{'stone tools':1},req:{'weaving':true}},//TODO : implement fibers
			'weave leather clothing':{name:'Weave leather clothing',icon:[16,7],desc:'Craft [basic clothes] from 2 [leather] each.',use:{'stone tools':1},req:{'weaving':true,'leather-working':true}},
			'make leather':{name:'Make leather',icon:[10,7],desc:'Produce [leather] from [hide]s, [water], [salt] and [log]s.',use:{'stone tools':1},req:{'leather-working':true,'Factories I':false}},
			'cheap make leather':{name:'Make leather (cheap)',icon:[10,7],desc:'Slowly produce [leather] from [hide]s, [muddy water] and [herb]s.',use:{'stone tools':1},req:{'Factories I':false}},
			'weave leather colored clothing':{name:'Weave leather colored clothing',icon:[13,0,'magixmod'],desc:'Your clothier will now weave [leather] but colored clothing.',req:{'weaving':true},use:{'stone tools':1}},
			'weave fiber colored clothing':{name:'Weave fiber colored clothing',icon:[13,0,'magixmod'],desc:'Your clothier will now weave fiber but colored clothing.',req:{'weaving':true},use:{'stone tools':1}},
			'dye already made clothing':{name:'Dye already made clothing',icon:[13,0,'magixmod'],desc:'Your clothier will now dye already made [basic clothes] making them become[Colored clothing].',req:{'weaving':true},use:{'stone tools':1}},
			'Craft thread':{name:'Craft thread',icon:[13,9,'magixmod'],desc:'Your clothier will now craft [Thread] out of [herb].',req:{'Sewing II':true},use:{'stone tools':1}},
			'weave hardened clothes':{name:'Weave hardened clothes',icon:[choose([27,28]),choose([0,1]),'magixmod'],desc:'Craft [hardened clothes] out of [Dried leather] and [Thread].',req:{'Sewing III':true,'weaving II':true},use:{'stone tools':1}},
		},
		effects:[
			{type:'convert',from:{'hide':3},into:{'primitive clothes':1},every:8,mode:'sew hide clothing'},
			{type:'convert',from:{'herb':30},into:{'primitive clothes':1},every:20,mode:'sew grass clothing'},
			{type:'convert',from:{'leather':2},into:{'basic clothes':1},every:8,mode:'weave leather clothing'},
			{type:'convert',from:{'herb':50},into:{'basic clothes':1},every:20,mode:'weave fiber clothing'},
			{type:'convert',from:{'hide':1,'water':5,'salt':1,'log':0.1},into:{'leather':1},every:15,mode:'make leather'},
			{type:'convert',from:{'hide':1,'muddy water':5,'herb':10},into:{'leather':1},every:30,mode:'cheap make leather'},
			{type:'convert',from:{'leather':2,'Dyes':3},into:{'Colored clothing':1},every:6,mode:'weave leather colored clothing'},
			{type:'convert',from:{'herb':52,'Dyes':4},into:{'Colored clothing':1},every:6,mode:'weave fiber colored clothing'},
			{type:'convert',from:{'basic clothes':1,'Dyes':4},into:{'Colored clothing':1},every:6,mode:'dye already made clothing'},
			{type:'convert',from:{'herb':18},into:{'Thread':3},every:6,mode:'Craft thread'},
			{type:'convert',from:{'Dried leather':4,'Thread':7},into:{'hardened clothes':1},every:5,mode:'weave hardened clothes'},
			],
		req:{'sewing':true},
		category:'crafting',
	});
	new G.Unit({
		name:'hunter',
		desc:'@hunts wild animals for [meat], [bone]s and [hide]s@may get wounded<>[hunter]s go out into the wilderness and come back days later covered in blood and the meat of a fresh kill.',
		icon:[18,2],
		cost:{},
		use:{'worker':1},
		//upkeep:{'coin':0.2},
		gizmos:true,
		modes:{
			'endurance hunting':{name:'Endurance hunting',icon:[0,6],desc:'Hunt animals by simply running after them until they get exhausted.//Slow and tedious.',req:{'Hunters & fishers unification':false}},
			'spear hunting':{name:'Spear hunting',icon:[5,9],desc:'Hunt animals with spears.',use:{'stone weapons':1},req:{'spears':true,'Hunters & fishers unification':false}},
			'bow hunting':{name:'Bow hunting',icon:[6,9],desc:'Hunt animals with bows.',use:{'bow':1},req:{'bows':true,'Hunters & fishers unification':false}},
			'crossbow hunting':{name:'Crossbow hunting',icon:[13,6,'magixmod'],desc:'Hunt animals with crossbows.',req:{'Hunting II':true,'Hunters & fishers unification':false},use:{'Crossbow':1,'Crossbow belt':150}},
			'disabled':{name:'Disabled',icon:[1,0,'magixmod'],desc:'Unit disabled by [Hunters & fishers unification] .',req:{'Hunters & fishers unification':true}},
		},
		effects:[
			{type:'gather',context:'hunt',amount:1,max:5,mode:'endurance hunting'},
			{type:'gather',context:'hunt',amount:2.5,max:5,mode:'spear hunting'},
			{type:'gather',context:'hunt',amount:4,max:5,mode:'bow hunting'},
			{type:'gather',context:'hunt',amount:5,max:6,mode:'crossbow hunting'},
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.03,'[X] [people] wounded while hunting.','hunter was','hunters were'),chance:1/30,req:{'hunting III':false}},
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.03,'[X] [people] wounded while hunting.','hunter was','hunters were'),chance:1/38,req:{'hunting III':true,'An armor for Hunter':true,'Hunters & fishers unification':false}},
			{type:'mult',value:1.2,req:{'harvest rituals':'on','Hunters & fishers unification':false}},
			{type:'mult',value:0,req:{'Hunters & fishers unification':true}},
		],
		req:{'hunting':true},
		category:'production',
		priority:5,
	});
	new G.Unit({
		name:'fisher',
		desc:'@catches [seafood] from rivers and shores<>[fisher]s arm themselves with patience and whatever bait they can find, hoping to trick another creature into becoming dinner.',
		icon:[17,2],
		cost:{},
		use:{'worker':1},
		//upkeep:{'coin':0.2},
		gizmos:true,
		modes:{
			'catch by hand':{name:'Catch by hand',icon:[0,6],desc:'Catch fish with nothing but bare hands.//Slow and tedious.',req:{'Hunters & fishers unification':false}},
			'spear fishing':{name:'Spear fishing',icon:[5,9],desc:'Catch fish with spears.',use:{'stone weapons':1},req:{'spears':true,'Hunters & fishers unification':false}},
			'line fishing':{name:'Line fishing',icon:[7,21,'magixmod'],desc:'Catch fish with fishing poles.',use:{'stone tools':1},req:{'fishing hooks':true,'Hunters & fishers unification':false}},
			'net fishing':{name:'Net fishing',icon:[13,8,'magixmod'], desc:'Catch fish with [Fishing net].',req:{'Fishing II':true,'Hunters & fishers unification':false},use:{'Fishing net':1}},
			'disabled':{name:'Disabled',icon:[1,0,'magixmod'],desc:'Unit disabled by [Hunters & fishers unification] .',req:{'Hunters & fishers unification':true}},
		},
		effects:[
			{type:'gather',context:'fish',amount:1,max:5,mode:'catch by hand'},
			{type:'gather',context:'fish',amount:2.5,max:5,mode:'spear fishing'},
			{type:'gather',context:'fish',amount:4,max:5,mode:'line fishing'},
			{type:'gather',context:'fish',what:{'seafood':6},amount:6,max:8,mode:'net fishing'},
			{type:'mult',value:1.2,req:{'harvest rituals':'on','Hunters & fishers unification':false}},
			{type:'mult',value:0,req:{'Hunters & fishers unification':true}},
		],
		req:{'fishing':true},
		category:'production',
		priority:5,
	});
	new G.Unit({
		name:'firekeeper',
		desc:'@creates [fire pit]s from fuel@gains more fuel types as technology progresses@handles other fire-related tasks<>The [firekeeper] is tasked with starting and maintaining fires to keep the tribe warm.',
		icon:[16,2],
		cost:{},
		use:{'worker':1},
		staff:{'knapped tools':1},
		upkeep:{'coin':0.1},
		gizmos:true,
		modes:{
			'stick fires':{name:'Start fires from sticks',icon:[0,6,13,7],desc:'Craft [fire pit]s from 20 [stick]s each.'},
			'cook':{name:'Cook',icon:[6,7,13,7],desc:'Turn [meat] and [seafood] into [cooked meat] and [cooked seafood] in the embers of [fire pit]s',req:{'cooking':true}},
			'cure':{name:'Cure & smoke',icon:[11,6,12,6],desc:'Turn 1 [meat] or [seafood] into 2 [cured meat] or [cured seafood] using [salt] in the embers of [fire pit]s',req:{'curing':true}},
			'firesfromessence':{name:'Set up fires out of its essence',icon:[0,2,'magixmod'], desc:'Craft 2[fire pit]s with use of: 1[Fire essence],13[stick]s',req:{'Wizard complex':true},use:{'Wand':1,'knapped tools':1}},
			'log fires':{name:'Start fires from logs',icon:[9,21,'magixmod'],desc:'Craft [fire pit]s from 2 [log]s each.',req:{'Fires from logs':true}},
		},
		effects:[
			{type:'convert',from:{'stick':20},into:{'fire pit':1},every:5,mode:'stick fires'},
			{type:'convert',from:{'log':2},into:{'fire pit':1},every:5,mode:'log fires'},
			{type:'convert',from:{'meat':1,'fire pit':0.01},into:{'cooked meat':1},every:1,repeat:5,mode:'cook'},
			{type:'convert',from:{'seafood':1,'fire pit':0.01},into:{'cooked seafood':1},every:1,repeat:5,mode:'cook'},
			{type:'convert',from:{'meat':1,'salt':1,'fire pit':0.01},into:{'cured meat':2},every:1,repeat:10,mode:'cure'},
			{type:'convert',from:{'seafood':1,'salt':1,'fire pit':0.01},into:{'cured seafood':2},every:1,repeat:10,mode:'cure'},
			{type:'convert',from:{'Fire essence':1,'stick':13},into:{'fire pit':5},mode:'firesfromessence'},
			{type:'mult',value:0.97,req:{'dt2':true}},
			{type:'mult',value:1.05,req:{'Bigger fires':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.08,req:{'Bigger fires':true,'<font color="maroon">Caretaking</font>':true}},
		],
		req:{'fire-making':true},
		category:'crafting',
		priority:3,
	});
	
	new G.Unit({
		name:'potter',
		desc:'@uses [clay] or [mud] to craft goods<>The [potter] shapes their clay with great care, for it might mean the difference between fresh water making it to their home safely - or spilling uselessly into the dirt.',
		icon:[20,2],
		cost:{},
		use:{'worker':1},
		staff:{'stone tools':1},
		upkeep:{'coin':0.2},
		gizmos:true,
		modes:{
			'clay pots':{name:'Craft pots out of clay',icon:[1,7,13,5],desc:'Craft [pot]s from 3 [clay] each; requires [fire pit]s.'},
			'mud pots':{name:'Craft pots out of mud',icon:[0,7,13,5],desc:'Craft [pot]s from 10 [mud] each; requires [fire pit]s.'},
			'craft precious pots':{name:'Craft precious pots',icon:[15,8,'magixmod'],desc:'Your potter will craft [Precious pot] out of both [clay] and [mud].',req:{'Precious pottery':true},use:{'knapped tools':1,'stone tools':1,'Instructor':0.33}},
			'craft potion pots':{name:'Craft potion pots',icon:[14,8,'magixmod'],desc:'Your potter will craft [Potion pot] out of both [clay] and [mud]. These pots do not provide additional [food storage].',req:{'Precious pottery':true},use:{'knapped tools':1,'stone tools':1,'Instructor':0.5}},    
		},
		effects:[
			{type:'convert',from:{'clay':3,'fire pit':0.01},into:{'pot':1},every:3,repeat:2,mode:'clay pots'},
			{type:'convert',from:{'mud':10,'fire pit':0.01},into:{'pot':1},every:6,mode:'mud pots'},
			{type:'convert',from:{'clay':5,'mud':12,'fire pit':0.03},into:{'Precious pot':1},every:3,repeat:2,mode:'craft precious pots'},
			{type:'convert',from:{'clay':4,'mud':11,'fire pit':0.025},into:{'Potion pot':1},every:3,repeat:1,mode:'craft potion pots'}
		],
		req:{'pottery':true},
		category:'crafting',
	});
		new G.Unit({
		name:'kiln',
		desc:'@processes goods with fire<>A [kiln] is an impressive edifice for those not yet accustomed to its roaring fire.',//TODO : desc
		icon:[23,2],
		cost:{'archaic building materials':50,'basic building materials':20},
		use:{'land':1},
		upkeep:{'log':0.5},
		modes:{
			'off':G.MODE_OFF,
			'bricks':{name:'Fire bricks',icon:[3,8],desc:'Produce 10 [brick]s out of 1 [clay].',use:{'worker':1,'stone tools':1}},
			'glass':{name:'Craft glass',icon:[4,8],desc:'Your kiln will now use sand to make a glass.',req:{'Crafting a glass':true},use:{'stone tools':1}},
		},
		effects:[
			{type:'convert',from:{'clay':1},into:{'brick':10},every:5,mode:'bricks'},
			{type:'convert',from:{'sand':3},into:{'glass':10},every:5,mode:'glass'},
			{type:'mult',value:1.5,req:{'bigger kilns':true}},
			{type:'mult',value:1.1,req:{'Better kiln construction':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.05,req:{'Better kiln construction':true,'<font color="maroon">Caretaking</font>':true}},
		],
		gizmos:true,
		req:{'masonry':true},
		category:'crafting',
	});
	
		new G.Unit({
		name:'well',
		desc:'@produces fresh [water], up to 20 per day<>The [well] is a steady source of drinkable water.',
		icon:[25,3],
		cost:{'stone':50,'archaic building materials':20},
		use:{'land':1},
		//require:{'worker':2,'stone tools':2},
		//upkeep:{'coin':0.2},
		effects:[
			{type:'gather',what:{'water':20}},
			{type:'mult',value:1.05,req:{'Deeper wells':true}}
		],
		category:'production',
		req:{'well-digging':true},
		limitPer:{'land':10},
	});
	
	new G.Unit({
		name:'digger',
		desc:'@digs the soil for [mud] and [stone]<>[digger]s yield various materials that can be used for tool-making and rudimentary construction.',
		icon:[7,2],
		cost:{},
		use:{'worker':1},
		staff:{'knapped tools':1},
		upkeep:{'coin':0.1},
		effects:[
			{type:'gather',context:'dig',amount:1,max:1},
			{type:'gather',context:'dig',what:{'clay':5},max:1,req:{'pottery':true}}
		],
		req:{'digging':true},
		category:'production',
	});
	new G.Unit({
		name:'quarry',
		desc:'@carves [cut stone] out of the ground@may find other minerals such as [limestone] and [marble]<>The [quarry] dismantles the ground we stand on so that our children may reach higher heights.',
		icon:[22,3],
		cost:{'archaic building materials':100},
		use:{'land':4},
		modes:{
			'off':G.MODE_OFF,
			'quarry':{name:'Quarry stone',icon:[0,8],desc:'Produce [cut stone] and other minerals.',use:{'worker':3,'stone tools':3}},
			'advanced quarry':{name:'Advanced quarry stone',icon:[8,12,0,8],desc:'Produce [cut stone] and other minerals at a superior rate with metal tools.',use:{'worker':3,'metal tools':3}},
			'quarryotherstones':{name:'Quarry other stones',icon:[3,12,'magixmod'],desc:'Strike the Earth for other than common [cut stone] stones.',req:{'quarrying II':true},use:{'worker':3,'metal tools':3}},
		},
		effects:[
			{type:'gather',context:'quarry',amount:5,max:10,every:3,mode:'quarry'},
			{type:'gather',context:'quarry',what:{'cut stone':1},max:5,notMode:'off'},
			{type:'gather',context:'mine',amount:0.005,max:0.05,notMode:'off'},
			{type:'gather',context:'quarry',amount:10,max:30,every:3,mode:'advanced quarry'},
			{type:'gather',context:'quarry',what:{'Various cut stones':5},mode:'quarryotherstones'},
			{type:'gather',context:'quarry',what:{'oil':13},req:{'Oil-digging':true}},
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.01,'[X] [people].','quarry collapsed, wounding its workers','quarries collapsed, wounding their workers'),chance:1/50}
		],
		gizmos:true,
		req:{'quarrying':true},
		category:'production',
	});
	new G.Unit({
		name:'mine',
		desc:'@extracts ores, [coal] and [stone] out of the ground@may occasionally collapse<>The workers in [mine]s burrow deep into the earth to provide all kinds of minerals.',
		icon:[22,2],
		cost:{'archaic building materials':100},
		use:{'land':3},
		//require:{'worker':3,'stone tools':3},
		modes:{
			'off':G.MODE_OFF,
			'any':{name:'Any',icon:[8,8],desc:'Mine without focusing on specific ores.',use:{'worker':3,'stone tools':3}},
			'coal':{name:'Coal',icon:[12,8],desc:'Mine for [coal] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'salt':{name:'Salt',icon:[11,7],desc:'Mine for [salt].',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'copper':{name:'Copper',icon:[9,8],desc:'Mine for [copper ore] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'tin':{name:'Tin',icon:[13,8],desc:'Mine for [tin ore] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'iron':{name:'Iron',icon:[10,8],desc:'Mine for [iron ore] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'gold':{name:'Gold',icon:[11,8],desc:'Mine for [gold ore] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'nickel':{name:'Nickel',icon:[9,12,'magixmod'],desc:'Mine for [nickel ore] with 5x efficiency.',req:{'prospecting II':true},use:{'worker':3,'metal tools':3}},
			'ostones':{name:'Other stones',icon:[3,12,'magixmod'],desc:'Mine for other stones with 3x efficiency than common [stone].',req:{'prospecting II':true},use:{'worker':3,'metal tools':3}}
		},
		effects:[
			{type:'gather',context:'mine',amount:10,max:30,mode:'any'},
			{type:'gather',context:'mine',what:{'stone':10},max:30,notMode:'off'},
			{type:'gather',context:'mine',what:{'coal':50},max:30,mode:'coal'},
			{type:'gather',context:'mine',what:{'salt':50},max:30,mode:'salt'},
			{type:'gather',context:'mine',what:{'copper ore':50},max:30,mode:'copper'},
			{type:'gather',context:'mine',what:{'tin ore':50},max:30,mode:'tin'},
			{type:'gather',context:'mine',what:{'iron ore':50},max:30,mode:'iron'},
			{type:'gather',context:'mine',what:{'gold ore':50},max:30,mode:'gold'},
			{type:'gather',context:'mine',what:{'nickel ore':40},max:25,mode:'nickel'},
			{type:'gather',context:'mine',what:{'Various stones':30},max:25,mode:'ostones'},
			{type:'gather',context:'mine',what:{'Sulfur':35},max:51,req:{'Explosive crafting & mining':true}},
			{type:'mult',value:0.95,req:{'dt4':true},mode:'gold'},
			{type:'mult',value:0.95,req:{'dt5':true},mode:'iron'},
			{type:'mult',value:0.95,req:{'dt5':true},mode:'nickel'},
			{type:'mult',value:0.95,req:{'dt6':true},mode:'copper'},
			{type:'mult',value:0.95,req:{'dt6':true},mode:'tin'},
			{type:'mult',value:1.05,req:{'Mining strategy':true}},
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.01,'[X] [people].','mine collapsed, wounding its miners','mines collapsed, wounding their miners'),chance:1/50,req:{'Mining strategy':false}},
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.01,'[X] [people].','mine collapsed, wounding its miners','mines collapsed, wounding their miners'),chance:1/70,req:{'Mining strategy':true}}
		],
		gizmos:true,
		req:{'mining':true},
		category:'production',
	});
	new G.Unit({
		name:'furnace',
		desc:'@converts metal ores into ingots that can be used for further crafting<>The [furnace] is employed in various processes to extract the metal in raw ore, as well as for alloying those metals.',
		icon:[24,2],
		cost:{'basic building materials':100},
		use:{'land':1},
		upkeep:{'log':1},
		modes:{
			'off':G.MODE_OFF,
			'copper':{name:'Copper smelting',icon:[9,9],desc:'Cast [soft metal ingot]s out of 5 [copper ore]s each.',use:{'worker':2,'stone tools':2},req:{}},
			'tin':{name:'Tin smelting',icon:[9,9],desc:'Cast [soft metal ingot]s out of 10 [tin ore]s each.',use:{'worker':2,'stone tools':2},req:{}},
			'iron':{name:'Iron smelting',icon:[10,9],desc:'Cast [hard metal ingot]s out of 5 [iron ore]s each.',use:{'worker':2,'metal tools':2},req:{'iron-working':true}},
			'gold':{name:'Gold smelting',icon:[11,9],desc:'Cast [precious metal ingot]s out of 5 [gold ore]s each.',use:{'worker':2,'metal tools':2},req:{'gold-working':true}},
			'bronze':{name:'Bronze alloying',icon:[10,9],desc:'Cast [hard metal ingot]s out of 8 [copper ore]s and 2 [tin ore]s each.',use:{'worker':2,'metal tools':2},req:{'bronze-working':true}},
			'steel':{name:'Steel alloying',icon:[12,9],desc:'Cast [strong metal ingot]s out of 19 [iron ore]s and 1 [coal] each.',use:{'worker':2,'metal tools':2},req:{'steel-making':true}},
			'cobalt':{name:'Cobalt smelting',icon:[14,0,'magixmod'],desc:'Cast 1[Cobalt ingot] out of 8[Cobalt ore].',req:{'Cobalt-working':true},use:{'worker':2,'metal tools':2,'stone tools':1}},
	  		'nickel':{name:'Nickel smelting',icon:[10,9],desc:'Cast 1[hard metal ingot] out of 6[nickel ore]s each.',req:{'prospecting II':true,'nickel-working':true},use:{'worker':2,'metal tools':2}},
			'platinum':{name:'Platinum smelting',icon:[3,11,'magixmod'],desc:'Cast 1[platinum ingot] out of 5[platinum ore]s each.',req:{'prospecting II':true,'platinum-working':true},use:{'worker':2,'metal tools':2}},  
			},
		effects:[
			{type:'convert',from:{'copper ore':5},into:{'soft metal ingot':1},repeat:3,mode:'copper'},
			{type:'convert',from:{'tin ore':10},into:{'soft metal ingot':1},repeat:3,mode:'tin'},
			{type:'convert',from:{'iron ore':5},into:{'hard metal ingot':1},repeat:3,mode:'iron'},
			{type:'convert',from:{'gold ore':5},into:{'precious metal ingot':1},repeat:1,mode:'gold'},
			{type:'convert',from:{'tin ore':2,'copper ore':8},into:{'hard metal ingot':1},repeat:3,mode:'bronze'},
			{type:'convert',from:{'iron ore':19,'coal':1},into:{'strong metal ingot':1},repeat:1,mode:'steel'},
			{type:'convert',from:{'Cobalt ore':8},into:{'Cobalt ingot':1},every:5,mode:'cobalt'},
			{type:'convert',from:{'nickel ore':6},into:{'hard metal ingot':1},every:5,mode:'nickel'},
			{type:'convert',from:{'platinum ore':5},into:{'platinum ingot':1},every:5,mode:'platinum'},
			{type:'mult',value:0.95,req:{'dt4':true},mode:'gold'},
			{type:'mult',value:0.95,req:{'dt5':true},mode:'iron'},
			{type:'mult',value:0.95,req:{'dt5':true},mode:'bronze'},
			{type:'mult',value:0.95,req:{'dt5':true},mode:'nickel'},
			{type:'mult',value:0.95,req:{'dt6':true},mode:'tin'},
			{type:'mult',value:0.95,req:{'dt6':true},mode:'copper'},
			{type:'waste',chance:0.001/1000},
			{type:'mult',value:1.2,req:{'Improved furnace construction':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.1,req:{'Improved furnace construction':true,'<font color="maroon">Caretaking</font>':true}},
		],
		gizmos:true,
		req:{'smelting':true},
		category:'crafting',
	});
	new G.Unit({
		name:'blacksmith workshop',
		desc:'@forges metal goods out of ingots<>The [blacksmith workshop,Blacksmith] takes the same pride in shaping the tool that tills as they do the sword that slays.',
		icon:[26,2,25,2],
		cost:{'basic building materials':100},
		use:{'land':1},
		//require:{'worker':2,'stone tools':2},
		modes:{
			'off':G.MODE_OFF,
			'metal tools':{name:'Forge tools from soft metals',icon:[2,9],desc:'Forge [metal tools] out of 2 [soft metal ingot]s each.',use:{'worker':1,'stone tools':1},req:{}},
			'hard metal tools':{name:'Forge tools from hard metals',icon:[2,9],desc:'Forge 3 [metal tools] out of 1 [hard metal ingot].',use:{'worker':1,'metal tools':1},req:{}},
			'gold blocks':{name:'Forge gold blocks',icon:[14,8],desc:'Forge [gold block]s out of 10 [precious metal ingot]s each.',use:{'worker':1,'stone tools':1},req:{'gold-working':true}},
			'forgeweapon':{name:'Forge weapons out of soft metals',icon:[15,11,'magixmod'],desc:'Forge [metal weapons] out of 2[soft metal ingot]s each.',req:{'Weapon blacksmithery':true},use:{'worker':1,'metal tools':1,'stone tools':1}},  
			'forgeweaponhard':{name:'Forge weapons out of hard metals',icon:[15,11,'magixmod'],desc:'Forge [metal weapons] out of 1[hard metal ingot] each.',req:{'Weapon blacksmithery':true},use:{'worker':1,'metal tools':1,'stone tools':1}},
			'forgearmor':{name:'Forge armor out of soft metals',icon:[16,11,'magixmod'],desc:'Forge [armor set] out of 8[soft metal ingot]s each.',req:{'Armor blacksmithery':true},use:{'worker':1,'metal tools':1,'stone tools':1,'Instructor':0.25}},
			'forgearmorhard':{name:'Forge armor out of hard metals',icon:[16,11,'magixmod'],desc:'Forge [armor set] out of 5[hard metal ingot] each.',req:{'Armor blacksmithery':true},use:{'worker':1,'metal tools':1,'stone tools':1,'Instructor':0.25}},
			'platinum blocks':{name:'Craft platinum blocks',icon:[4,11,'magixmod'],desc:'Forge [platinum block]s out of 10[platinum ingot] each.',req:{'platinum-working':true},use:{'worker':1,'metal tools':1,'stone tools':1}},
			'factgear':{name:'Forge factory equipment',icon:[9,18,'magixmod'],desc:'Forge [Basic factory equipment] out of 11[hard metal ingot]s each.',req:{'Advanced casting':true},use:{'worker':3,'metal tools':3,'Instructor':1}},
		},
		effects:[
			{type:'convert',from:{'soft metal ingot':2},into:{'metal tools':1},repeat:3,mode:'metal tools'},
			{type:'convert',from:{'hard metal ingot':1},into:{'metal tools':3},repeat:3,mode:'hard metal tools'},
			{type:'convert',from:{'precious metal ingot':10},into:{'gold block':1},mode:'gold blocks'},
			{type:'convert',from:{'soft metal ingot':2},into:{'metal weapons':1},repeat:2,mode:'forgeweapon'},
			{type:'convert',from:{'hard metal ingot':1},into:{'metal weapons':1},every:3,repeat:1,mode:'forgeweaponhard'},
			{type:'convert',from:{'soft metal ingot':8},into:{'armor set':1},every:4,mode:'forgearmor'},
			{type:'convert',from:{'hard metal ingot':5},into:{'armor set':2},every:4,mode:'forgearmorhard'},
			{type:'convert',from:{'platinum ingot':10},into:{'platinum block':1},every:4,mode:'platinum blocks'},
			{type:'convert',from:{'hard metal ingot':11},into:{'Basic factory equipment':1},every:4,mode:'factgear'},
			{type:'mult',value:0.95,req:{'dt1':true}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on','power of the faith':true}},
			{type:'waste',chance:0.001/1000},
			//TODO : better metal tools, weapons etc
		],
		gizmos:true,
		req:{'smelting':true},
		category:'crafting',
	});
			
	new G.Unit({
		name:'woodcutter',
		desc:'@cuts trees, producing [log]s<>[woodcutter]s turn forests into precious wood that can be used as fuel or construction materials.',
		icon:[8,2],
		cost:{},
		use:{'worker':1},
		staff:{'knapped tools':1},
		upkeep:{'coin':0.1},
		effects:[
			{type:'gather',context:'chop',amount:1,max:1},
			{type:'gather',context:'gather',what:{'Scobs': 0.1},amount:1,max:1}
		],
		req:{'woodcutting':true},
		category:'production',
	});
	new G.Unit({
		name:'carpenter workshop',
		desc:'@processes wood<>The [carpenter workshop,Carpenter] is equipped with all kinds of tools to coerce wood into more useful shapes.',
		icon:[27,2,25,2],
		cost:{'basic building materials':100},
		use:{'land':1},
		//require:{'worker':2,'stone tools':2},
		modes:{
			'off':G.MODE_OFF,
			'lumber':{name:'Cut logs into lumber',icon:[1,8],desc:'Cut [log]s into 3 [lumber] each.',use:{'worker':1,'stone tools':1},req:{}},
		},
		effects:[
			{type:'convert',from:{'log':1},into:{'lumber':3},repeat:2,mode:'lumber'},
			{type:'mult',value:0.8,req:{'dt17':true}},
			{type:'mult',value:2.25,req:{'Moderated carpentry':true}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on','power of the faith':true}},
			{type:'waste',chance:0.001/1000},
		],
		gizmos:true,
		req:{'carpentry':true},
		category:'crafting',
	});
	
	new G.Unit({
		name:'soothsayer',
		desc:'@generates [faith] and [happiness] every now and then<>[soothsayer]s tell the tales of the dead, helping tribespeople deal with grief.',
		icon:[15,2],
		cost:{},
		use:{'worker':1},
		upkeep:{'coin':0.2},
		effects:[
			{type:'gather',what:{'faith':0.1,'happiness':0.2}},
			{type:'gather',what:{'faith':0.05},req:{'symbolism':true,'symbolism II':false}},
			{type:'gather',what:{'insight':0.07},req:{'symbolism II':true}},
			{type:'mult',value:2/3,req:{'dt16':true}},
			{type:'mult',value:1.25,req:{'se11':'on'}},
		],
		req:{'ritualism':true},
		category:'spiritual',
	});
	new G.Unit({
		name:'healer',
		desc:'@uses [herb]s to heal the [sick] and the [wounded] slowly<>The [healer] knows the secrets of special plants that make illness stay away.',
		icon:[23,3],
		cost:{},
		use:{'worker':1},
		staff:{'knapped tools':1},
		upkeep:{'coin':0.2},
		effects:[
			{type:'convert',from:{'sick':1,'herb':2.5},into:{'adult':1},chance:1/2,every:3},
			{type:'convert',from:{'wounded':1,'herb':2.5},into:{'adult':1},chance:1/5,every:10},
			{type:'mult',value:1.03,req:{'More experienced healers':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.06,req:{'More experienced healers':true,'<font color="maroon">Caretaking</font>':true}},
		],
		req:{'healing':true},
		category:'spiritual',
		priority:5,
	});
	
	new G.Unit({
		name:'chieftain',
		desc:'@generates [influence] every now and then<>The [chieftain] leads over a small group of people, guiding them in their decisions.',
		icon:[18,3],
		cost:{'food':50},
		use:{'worker':1},
		upkeep:{'coin':0.5},
		effects:[
			{type:'gather',what:{'influence':0.1}},
			{type:'gather',what:{'influence':0.05},req:{'code of law':true}},
			{type:'mult',value:1.05,req:{'Politic power rising up':true}},
			{type:'mult',value:0.1,req:{'Eotm':true}},
			{type:'mult',value:1.1,req:{'Glory':true}},
			{type:'mult',value:0.75,req:{'se11':'on'}},
		],
		limitPer:{'population':100},
		req:{'chieftains':true},
		category:'political',
		priority:5,
	});
	new G.Unit({
		name:'clan leader',
		desc:'@generates [influence] every now and then<>The [clan leader] is followed by many, and is trusted with defending the honor and safety of their people.',
		icon:[19,3],
		cost:{'food':100},
		use:{'worker':1},
		upkeep:{'coin':0.75},
		effects:[
			{type:'gather',what:{'influence':0.2}},
			{type:'gather',what:{'influence':0.05},req:{'code of law':true}},
			{type:'mult',value:1.05,req:{'Politic power rising up':true}},
			{type:'mult',value:0.1,req:{'Eotm':true}},
			{type:'mult',value:1.1,req:{'Glory':true}},
			{type:'mult',value:0.75,req:{'se11':'on'}},
		],
		limitPer:{'population':500},
		req:{'clans':true},
		category:'political',
		priority:5,
	});
	
	new G.Unit({
		name:'grave',
		desc:'@provides 1 [burial spot], in which the [corpse,dead] are automatically interred one by one@graves with buried corpses decay over time, freeing up land for more graves<>A simple grave dug into the earth, where the dead may find rest.//Burying your dead helps prevent [health,disease] and makes your people slightly [happiness,happier].',
		icon:[13,2],
		cost:{},
		use:{'land':1},
		//require:{'worker':1,'knapped tools':1},
		effects:[
			{type:'provide',what:{'burial spot':1},req:{'Spiritual piety':false}},
			{type:'provide',what:{'burial spot':3},req:{'Spiritual piety':true}},
			//{type:'waste',chance:1/100,desired:true},
			{type:'function',func:function(me){
				var buried=G.getRes('burial spot').used;
				if (buried>0 && G.getRes('burial spot').amount>=buried)
				{
					var toDie=Math.min(me.amount,randomFloor(buried*0.001));
					me.targetAmount-=toDie;
					G.wasteUnit(me,toDie);
					G.getRes('burial spot').amount-=toDie;
					G.getRes('burial spot').used-=toDie;
				}
			}}
		],
		req:{'burial':true},
		category:'civil',
	});
	
	new G.Unit({
		name:'mud shelter',
		desc:'@provides 3 [housing]<>Basic, frail dwelling in which a small family can live.',
		icon:[9,2],
		cost:{'mud':50},
		use:{'land':1},
		//require:{'worker':1,'knapped tools':1},
		effects:[
			{type:'provide',what:{'housing':3}},
			{type:'provide',what:{'housing':1},req:{'God\'s trait #1 Housing':true}},
			{type:'waste',chance:1/1000}
		],
		req:{'sedentism':true},
		category:'housing',
	});
	new G.Unit({
		name:'branch shelter',
		desc:'@provides 3 [housing]<>Basic, very frail dwelling in which a small family can live.',
		icon:[10,2],
		cost:{'stick':50},
		use:{'land':1},
		//require:{'worker':1,'knapped tools':1},
		effects:[
			{type:'provide',what:{'housing':3}},
			{type:'provide',what:{'housing':1},req:{'God\'s trait #1 Housing':true}},
			{type:'waste',chance:3/1000}
		],
		req:{'sedentism':true},
		category:'housing',
	});
	new G.Unit({
		name:'hut',
		desc:'@provides 5 [housing]<>Small dwelling built out of hardened mud and branches.',
		icon:[11,2],
		cost:{'archaic building materials':100},
		use:{'land':1},
		//require:{'worker':2,'stone tools':2},
		effects:[
			{type:'provide',what:{'housing':5}},
			{type:'provide',what:{'housing':1},req:{'God\'s trait #1 Housing':true}},
			{type:'waste',chance:0.1/1000}
		],
		req:{'building':true},
		category:'housing',
	});
	new G.Unit({
		name:'hovel',
		desc:'@provides 8 [housing]<>A simple home for a family of villagers.',
		icon:[20,3],
		cost:{'basic building materials':75},
		use:{'land':1},
		//require:{'worker':2,'stone tools':2},
		effects:[
			{type:'provide',what:{'housing':8}},
			{type:'provide',what:{'housing':0.5},req:{'God\'s trait #1 Housing':true}},
			{type:'waste',chance:0.03/1000}
		],
		req:{'cities':true},
		category:'housing',
	});
	new G.Unit({
		name:'house',
		desc:'@provides 10 [housing]<>A sturdy home built to last.',
		icon:[21,3],
		cost:{'basic building materials':100},
		use:{'land':1},
		//require:{'worker':3,'metal tools':3},
		effects:[
			{type:'provide',what:{'housing':10}},
			{type:'provide',what:{'housing':0.125},req:{'Better house construction':true}},
			{type:'gather',what:{'Berries':1},req:{'Next-to house berrybushes':true}},
			{type:'gather',what:{'Berries':0.2},req:{'Fertile bushes':true}},
			{type:'waste',chance:0.01/1000}
		],
		req:{'construction':true},
		category:'housing',
	});
	
	new G.Unit({
		name:'storage pit',
		desc:'@provides 400 [food storage] and 400 [material storage]<>A simple hole in the ground, lined with stones.//Prevents some amount of food from perishing and some goods from being stolen, but may crumble away over time.',
		icon:[12,2],
		cost:{'archaic building materials':50},
		use:{'land':2},
		//require:{'worker':2,'knapped tools':2},
		effects:[
			{type:'provide',what:{'added food storage':400}},
			{type:'provide',what:{'added material storage':400}},
			{type:'provide',what:{'added food storage':80,'added material storage':80},req:{'Spell of capacity':true}},
			{type:'waste',chance:0.8/1000}
		],
		req:{'stockpiling':true},
		category:'storage',
	});
	new G.Unit({
		name:'stockpile',
		desc:'@provides 1000 [material storage]<>A simple building where resources are stored.//Slows material decay and deters theft somewhat, but may itself decay over time.',
		icon:[22,4],
		cost:{'archaic building materials':100},
		use:{'land':2},
		//require:{'worker':2,'stone tools':2},
		effects:[
			{type:'provide',what:{'added material storage':1000}},
			{type:'provide',what:{'added material storage':200},req:{'Spell of capacity':true}},
			{type:'waste',chance:0.1/1000}
		],
		req:{'stockpiling':true,'building':true},
		category:'storage',
	});
	new G.Unit({
		name:'warehouse',
		desc:'@provides 4000 [material storage]<>A large building for storing materials. Staffed with two guards to prevent theft.',
		icon:[25,4],
		cost:{'basic building materials':500},
		use:{'land':3},
		staff:{'worker':2},
		//require:{'worker':3,'stone tools':3},
		effects:[
			{type:'provide',what:{'added material storage':4000}},
			{type:'provide',what:{'added material storage':800},req:{'Spell of capacity':true}},
			{type:'waste',chance:0.001/1000}
		],
		req:{'stockpiling':true,'construction':true},
		category:'storage',
	});
	new G.Unit({
		name:'granary',
		desc:'@provides 1000 [food storage]<>A grain storage building built on stilts to prevent pests from getting in.',
		icon:[23,4],
		cost:{'archaic building materials':50,'basic building materials':50,'pot':15},
		use:{'land':2},
		//require:{'worker':2,'stone tools':2},
		effects:[
			{type:'provide',what:{'added food storage':1000}},
			{type:'provide',what:{'added material storage':200},req:{'Spell of capacity':true}},
			{type:'waste',chance:0.01/1000}
		],
		req:{'stockpiling':true,'pottery':true},
		category:'storage',
	});
	new G.Unit({
		name:'barn',
		desc:'@provides 4000 [food storage]<>A large wooden building for storing food. A worker manages the grain to prevent rot.',
		icon:[24,4],
		cost:{'basic building materials':500},
		use:{'land':2},
		staff:{'worker':1},
		//require:{'worker':2,'stone tools':2},
		effects:[
			{type:'provide',what:{'added food storage':4000}},
			{type:'provide',what:{'added material storage':800},req:{'Spell of capacity':true}},
			{type:'waste',chance:0.001/1000}
		],
		req:{'stockpiling':true,'carpentry':true},
		category:'storage',
	});
	
	new G.Unit({
		name:'architect',
		desc:'@can be set to manage automatic building construction<>The [architect] is tasked with fulfilling your people\'s housing needs so that you don\'t have to worry about it too much.',
		icon:[26,4],
		cost:{},
		use:{'worker':1},
		upkeep:{'coin':0.5},
		gizmos:true,
		modes:{
			'off':G.MODE_OFF,
			'house building':{name:'House building',icon:[21,3],desc:'Build [house]s as long as there is homelessness and the right materials are available.'},
			'undertaker':{name:'Undertaker',icon:[13,2],desc:'Dig [grave]s as long as there are unburied corpses.'},
			'blockhouser':{name:'Blockhouse building',icon:[9,1,'magixmod'],desc:'This architect will build more advanced [housing,housing] like [Blockhouse].',req:{'Architects knowledge':true,'city planning':true}},
			'brickhouser':{name:'Brickhouse building',icon:[5,1,'magixmod'],desc:'This architect will build more useful housing like [Brick house with a silo]',req:{'Architects knowledge':true,'city planning':true}}
		},
		effects:[
			{type:'function',func:function(me){
				var wiggleRoom=10;
				var homeless=Math.max(0,(G.getRes('population').amount+wiggleRoom)-G.getRes('housing').amount);
				var toMake=me.amount-me.idle;
				if (homeless>0 && toMake>0 && G.canBuyUnitByName('house',toMake))
				{
					G.buyUnitByName('house',toMake,true);
				}
			},mode:'house building'},
			{type:'function',func:function(me){
				var wiggleRoom=5;
				var toMake=Math.min(me.amount-me.idle,Math.max(0,(G.getRes('corpse').amount+wiggleRoom)-(G.getRes('burial spot').amount-G.getRes('burial spot').used)));
				if (toMake>0 && G.canBuyUnitByName('house',toMake))
				{
					G.buyUnitByName('grave',toMake,true);
				}
			},mode:'undertaker'},
			{type:'function',func:function(me){
				var wiggleRoom=10;
				var homeless=Math.max(0,(G.getRes('population').amount+wiggleRoom)-G.getRes('housing').amount);
				var toMake=me.amount-me.idle;
				if (homeless>0 && toMake>0 && G.canBuyUnitByName('house',toMake))
				{
					G.buyUnitByName('Blockhouse',toMake,true);
				}
			},mode:'blockhouser'},
			{type:'function',func:function(me){
				var wiggleRoom=10;
				var homeless=Math.max(0,(G.getRes('population').amount+wiggleRoom)-G.getRes('housing').amount);
				var toMake=me.amount-me.idle;
				if (homeless>0 && toMake>0 && G.canBuyUnitByName('house',toMake))
				{
					G.buyUnitByName('Brick house with a silo',toMake,true);
				}
			},mode:'brickhouser'},
		],
		limitPer:{'land':100},
		req:{'city planning':true},
		category:'civil',
	});
	
	new G.Unit({
		name:'lodge',
		desc:'@NOTE : modes are disabled for now.@can be set to manage automatic recruitment for units such as [gatherer]s, [hunter]s or [woodcutter]s<>A [lodge] is where people of all professions gather to rest and store their tools.//Lodges let you automate your tribe somewhat; should a worker fall sick or die, they will be automatically replaced if a lodge is tasked for it.',
		icon:[17,3],
		cost:{'archaic building materials':50},
		use:{'land':1},
		//require:{'worker':1,'knapped tools':1},
		//upkeep:{'coin':0.5},
		gizmos:true,
		modes:{
			'off':G.MODE_OFF,
			'gatherers':{name:'Gatherer\'s lodge',desc:'Hire [gatherer]s until there are 5 for each of this lodge.',req:{'tribalism':true}},
			'hunters':{name:'Hunter\'s lodge',desc:'Hire [hunter]s until there are 5 for each of this lodge.',req:{'hunting':true}},
			'fishers':{name:'Fisher\'s lodge',desc:'Hire [fisher]s until there are 5 for each of this lodge.',req:{'fishing':true}},
			'diggers':{name:'Digger\'s lodge',desc:'Hire [digger]s until there are 5 for each of this lodge.',req:{'digging':true}},
			'woodcutters':{name:'Woodcutter\'s lodge',desc:'Hire [woodcutter]s until there are 5 for each of this lodge.',req:{'woodcutting':true}},
			'artisans':{name:'Artisan\'s lodge',desc:'Hire [artisan]s until there are 5 for each of this lodge.',req:{'stone-knapping':true}},
		},
		effects:[
		/*{type:'function',func:function(me){
					if (me.amount*5>G.getUnitAmount('gatherer')) G.buyUnitByName('gatherer',1,true);
			},mode:'gatherers',req:{'guilds unite':false}},
			{type:'function',func:function(me){
					if (me.amount*5>G.getUnitAmount('hunter')) G.buyUnitByName('hunter',1,true);
			},mode:'hunters',req:{'guilds unite':false}},
			{type:'function',func:function(me){
					if (me.amount*5>G.getUnitAmount('fisher')) G.buyUnitByName('fisher',1,true);
			},mode:'fishers',req:{'guilds unite':false}},
			{type:'function',func:function(me){
					if (me.amount*5>G.getUnitAmount('digger')) G.buyUnitByName('digger',1,true);
			},mode:'diggers',req:{'guilds unite':false}},
			{type:'function',func:function(me){
					if (me.amount*5>G.getUnitAmount('woodcutter')) G.buyUnitByName('woodcutter',1,true);
			},mode:'woodcutters',req:{'guilds unite':false}},
			{type:'function',func:function(me){
					if (me.amount*5>G.getUnitAmount('artisan')) G.buyUnitByName('artisan',1,true);
			},mode:'artisans',req:{'guilds unite':false}},
			//At guilds unite
			{type:'function',func:function(me){
					if (me.amount*100>G.getUnitAmount('gatherer')) G.buyUnitByName('gatherer',1,true);
			},mode:'gatherers',req:{'guilds unite':true}},
			{type:'function',func:function(me){
					if (me.amount*100>G.getUnitAmount('hunter')) G.buyUnitByName('hunter',1,true);
			},mode:'hunters',req:{'guilds unite':true}},
			{type:'function',func:function(me){
					if (me.amount*100>G.getUnitAmount('fisher')) G.buyUnitByName('fisher',1,true);
			},mode:'fishers',req:{'guilds unite':true}},
			{type:'function',func:function(me){
					if (me.amount*100>G.getUnitAmount('digger')) G.buyUnitByName('digger',1,true);
			},mode:'diggers',req:{'guilds unite':true}},
			{type:'function',func:function(me){
					if (me.amount*100>G.getUnitAmount('woodcutter')) G.buyUnitByName('woodcutter',1,true);
			},mode:'woodcutters',req:{'guilds unite':true}},
			{type:'function',func:function(me){
					if (me.amount*100>G.getUnitAmount('artisan')) G.buyUnitByName('artisan',1,true);
			},mode:'artisans',req:{'guilds unite':true}},*/
		],
		req:{'sedentism':true},
		category:'civil',
	});
	new G.Unit({
		name:'guild quarters',
		desc:'@NOTE : modes are disabled for now.@can be set to manage automatic recruitment for units such as [blacksmith workshop]s or [carpenter workshop]s<>[guild quarters,Guilds] -that is, associations of people sharing the same profession- meet in these to share their craft and trade secrets.//They can coordinate the building of new workshops should the need arise.',
		icon:[26,3,25,2],
		cost:{'basic building materials':75},
		use:{'land':1},
		staff:{'worker':1},
		//require:{'worker':2,'stone tools':2},
		upkeep:{'coin':0.5},
		gizmos:true,
		modes:{
			'off':G.MODE_OFF,
			'potters':{name:'Potters\' guild',desc:'Hire [potter]s until there are 5 for each of this guild.',req:{'pottery':true}},
			'carpenters':{name:'Carpenters\' guild',desc:'Build [carpenter workshop]s until there are 5 for each of this guild.',req:{'carpentry':true}},
			'blacksmiths':{name:'Blacksmiths\' guild',desc:'Build [blacksmith workshop]s until there are 5 for each of this guild.',req:{'smelting':true}},
			'thief hunters':{name:'Thief hunters\' guild',desc:'Hire [Thief hunter]s until there are 25 for each of this guild.',req:{'guilds unite':true,'Battling thieves':true}},
		},
		effects:[
			/*{type:'function',func:function(me){
					if (me.amount*5>G.getUnitAmount('potter')) G.buyUnitByName('potter',1,true);
			},mode:'potters'},
			{type:'function',func:function(me){
					if (me.amount*5>G.getUnitAmount('carpenter workshop')) G.buyUnitByName('carpenter workshop',1,true);
			},mode:'carpenters'},
			{type:'function',func:function(me){
					if (me.amount*5>G.getUnitAmount('blacksmith workshop')) G.buyUnitByName('blacksmith workshop',1,true);
			},mode:'blacksmiths'}*/
		],
		req:{'guilds':true},
		category:'civil',
	});
	
	new G.Unit({
		name:'wanderer',
		desc:'@explores occupied tiles for [land]@cannot discover new tiles@may sometimes get lost<>[wanderer]s walk about in search of new places to settle, reporting what they saw when they come back.',
		icon:[2,2],
		cost:{'food':20},
		use:{'worker':1},
		effects:[
			{type:'explore',explored:0.1,unexplored:0},
			{type:'function',func:unitGetsConverted({},0.01,0.05,'[X] [people].','wanderer got lost','wanderers got lost'),chance:1/100}
		],
		req:{'speech':true},
		category:'exploration',
	});
	new G.Unit({
		name:'scout',
		desc:'@discovers new tiles for [land]@cannot explore occupied tiles@may sometimes get lost<>[scout]s explore the world in search of new territories.',
		icon:[24,3],
		cost:{'food':100},
		use:{'worker':1},
		staff:{'stone tools':1},
		effects:[
			{type:'explore',explored:0,unexplored:0.01},
			{type:'function',func:unitGetsConverted({},0.01,0.05,'[X] [people].','scout got lost','scouts got lost'),chance:1/300}
		],
		req:{'scouting':true},
		category:'exploration',
	});
	
	//wonders
	
	new G.Unit({
		name:'mausoleum',
		desc:'@leads to the <b>Mausoleum Victory</b><>A mystical monument where the dead lie.//A temple housing a tomb deep under its rocky platform, the Mausoleum stands tall, its eternal shadow forever reminding your people of your greatness.',
		wonder:'mausoleum',
		icon:[1,14],
		wideIcon:[0,14],
		cost:{'basic building materials':1000},
		costPerStep:{'basic building materials':200,'precious building materials':20},
		steps:100,
		messageOnStart:'You begin the construction of the Mausoleum. Its towering mass already dominates the city, casting fear and awe wherever its shadow reaches.',
		finalStepCost:{'population':100},
		finalStepDesc:'To complete the Mausoleum, 100 of your [population,People] must be sacrificed to accompany you as servants in the afterlife.',
		use:{'land':10,'worker':5,'metal tools':5},
		//require:{'worker':10,'stone tools':10},
		req:{'monument-building':true},
		category:'wonder',
	});
	
	//debug units
	new G.Unit({
		name:'auto nanny',
		desc:'@generates 50 [fruit], 50 [cooked meat,Meat], and 100 [water]<>Keeps your people fed so you don\'t have to.//Powered by strange energies.',
		icon:[4,2],
		cost:{},
		effects:[
			{type:'gather',what:{'fruit':50,'cooked meat':50,'water':100}}
		],
		category:'debug',
	});
	new G.Unit({
		name:'auto brain',
		desc:'@generates 50 of [insight], [culture], [faith], [science] and [influence]<>Educates your people so you don\'t have to.//Powered by strange energies.',
		icon:[5,2],
		cost:{},
		effects:[
			{type:'gather',what:{'insight':50,'culture':50,'faith':50,'science':50,'influence':50}}
		],
		category:'debug',
	});
		new G.Unit({
		name:'auto brain tier 2',
		desc:'@generates 50 of [insight II], [culture II], [faith II] and [influence II]<>Educates your people so you don\'t have to.//Powered by strange energies.',
		icon:[22,21,'magixmod'],
		cost:{},
		effects:[
			{type:'gather',what:{'insight II':50,'culture II':50,'faith II':50,'influence II':50}}
		],
		category:'debug',
	});
		new G.Unit({
		name:'auto wizard',
		desc:'@gathers 105 [Magic essences] and 150 [Mana] .',
		icon:[24,21,'magixmod'],
		cost:{},
		effects:[
			{type:'gather',what:{'Fire essence':15,'Water essence':15,'Wind essence':15,'Lightning essence':15,'Dark essence':15,'Nature essence':15,'Essence of the Holiness':15,'Mana':150}}
		],
		category:'debug',
	});
		//MAGIX
		new G.Unit({
		name:'Hovel of colours',
		desc:'Does same thing as [artisan] on <b>Craft dyes set (1,2,3,4)</b> was. All 4 modes he had are active all the time in this unit. <> You can control production expenditure of this unit in Policies tab (if [Production rates influence] obtained)',
		icon:[19,18,'magixmod'],
		cost:{'basic building materials':975},
		upkeep:{'fire pit':0.2},
		use:{'worker':20,'land':1,'Instructor':2,'stone tools':25},
		req:{'<font color="maroon">Caretaking</font>':true,'Manufacture units I':true},
		category:'crafting',
		effects:[
			({type:'convert',from:{'Lavender':2},into:{'Purple dye':10},every:2}),
		({type:'convert',from:{'Salvia':6},into:{'Magenta dye':2},every:3}),
		({type:'convert',from:{'Bachelor\'s button':6},into:{'Blue dye':2},every:2}),
		({type:'convert',from:{'Desert rose':6},into:{'Magenta dye':2},every:3}),
		({type:'convert',from:{'Cosmos':4},into:{'Magenta dye':2},every:2}),
		({type:'convert',from:{'Pink rose':6},into:{'Pink dye':2},every:3}),
		({type:'convert',from:{'Pink tulip':4},into:{'Pink dye':2},every:2}),
		({type:'convert',from:{'Coreopsis':4},into:{'Yellow dye':2},every:3}),
		({type:'convert',from:{'Crown imperial':4},into:{'Orange dye':2},every:2}),
		({type:'convert',from:{'Cyan rose':4},into:{'Cyan dye':2},every:3}),
		({type:'convert',from:{'Himalayan blue poopy':4},into:{'Cyan dye':2},every:3}),
		({type:'convert',from:{'Cockscomb':4},into:{'Red dye':2},every:2}),
		({type:'convert',from:{'Red tulip':4},into:{'Red dye':2},every:3}),
		({type:'convert',from:{'Green Zinnia':6},into:{'Green dye':2},every:3}),
		({type:'convert',from:{'cactus':4},into:{'Green dye':2,'Cactus spikes':4},every:3}),
		({type:'convert',from:{'Lime rose':4},into:{'Lime dye':2},every:3}),
		({type:'convert',from:{'Lime tulip':4},into:{'Lime dye':2},every:3}),
		({type:'convert',from:{'Azure bluet':8},into:{'Light gray dye':2},every:3}),
		({type:'convert',from:{'Daisy':4},into:{'Light gray dye':2},every:3}),
		({type:'convert',from:{'Sunflower':2},into:{'Yellow dye':2,'Sunflower seeds':6},every:4}),
		({type:'convert',from:{'Dandelion':4},into:{'Yellow dye':2},every:3}),
		({type:'convert',from:{'Black lily':6},into:{'Black dye':2},every:3}),
		({type:'convert',from:{'Black Hollyhock':4},into:{'Black dye':2},every:3}),
		({type:'convert',from:{'Cattail':4},into:{'Brown dye':2},every:3}),
		({type:'convert',from:{'Flax':3},into:{'Light blue dye':1},every:3}),
		({type:'convert',from:{'Blue orchid':2},into:{'Light blue dye':1},every:3}),
		({type:'convert',from:{'White tulip':2},into:{'White dye':1},every:3}),
		({type:'convert',from:{'Lily of the Valley':3},into:{'White dye':1},every:3}),
		({type:'convert',from:{'Brown flower':2},into:{'Brown dye':1},every:3}),
		({type:'convert',from:{'Gray rose':3},into:{'Gray dye':1},every:3}),
		({type:'convert',from:{'Gray tulip':2},into:{'Gray dye':1},every:3}),
			//Production influence
		{type:'mult',value:0.5,req:{'Hovel of colours production rates':0.5}},
		{type:'mult',value:1.5,req:{'Hovel of colours production rates':1.5}},
		{type:'mult',value:2,req:{'Hovel of colours production rates':2}},
		{type:'mult',value:1.25,req:{'God\'s trait #5 Colored life':true}},
		],
	});
		new G.Unit({
		name:'Hut of potters',
		desc:'Does same thing as [potter] was. All 4 modes he had are active all the time in this unit. <> You can control production expenditure of this unit in Policies tab (if [Production rates influence] obtained)',
		icon:[20,18,'magixmod'],
		cost:{'basic building materials':475,'archaic building materials':500},
		upkeep:{'fire pit':0.2},
		use:{'worker':20,'land':1,'Instructor':2,'stone tools':25},
		req:{'<font color="maroon">Caretaking</font>':true,'Manufacture units I':true},
		category:'crafting',
		effects:[
			{type:'convert',from:{'clay':200,'mud':145,'fire pit':1},into:{'pot':113},every:2},
			{type:'convert',from:{'clay':200,'mud':145,'Dyes':18,'fire pit':1},into:{'Precious pot':101},every:9},
			{type:'convert',from:{'clay':120,'mud':95},into:{'Potion pot':90},every:4},
			{type:'mult',value:0.5,req:{'Hut of potters production rates':0.5}},
			{type:'mult',value:1.5,req:{'Hut of potters production rates':1.5}},
			{type:'mult',value:2,req:{'Hut of potters production rates':2}},
			{type:'mult',value:1.25,req:{'God\'s trait #4 Potter\'s frenzy':true}},
		],
	});
		new G.Unit({
		name:'Factory of pots',
		desc:'Does same thing as [potter] was. All 4 modes he had are active all the time in this unit. <> You can control production expenditure of this unit in Policies tab (if [Production rates influence] obtained)',
		icon:[14,18,'magixmod'],
		cost:{'basic building materials':775,'Basic factory equipment':400},
		upkeep:{'coal':2,'fire pit':0.1},
		use:{'worker':15,'land':1,'Instructor':1,'stone tools':32},
		req:{'<font color="maroon">Moderation</font>':true,'Factories I':true},
		category:'crafting',
		effects:[
			{type:'convert',from:{'clay':400,'mud':275,'fire pit':1},into:{'pot':325},every:5},
			{type:'convert',from:{'clay':400,'mud':275,'Dyes':45,'fire pit':1},into:{'Precious pot':305},every:10},
			{type:'convert',from:{'clay':250,'mud':475},into:{'Potion pot':255},every:5},
			{type:'mult',value:0.5,req:{'Factory of pots production rates':0.5}},
			{type:'mult',value:1.5,req:{'Factory of pots production rates':1.5}},
			{type:'mult',value:2,req:{'Factory of pots production rates':2}},
			{type:'mult',value:1.25,req:{'God\'s trait #4 Potter\'s frenzy':true}},
		],
	});
		new G.Unit({
		name:'Leather factory',
		desc:'Does same thing as [clothier] on craft leather mode and [Drying rack] were. All 3 (2 modes of [clothier] and 1 unit) work all the time. <> You can control production expenditure of this unit in Policies tab (if [Production rates influence] obtained)',
		icon:[15,18,'magixmod'],
		cost:{'basic building materials':775,'Basic factory equipment':400},
		upkeep:{'coal':2,'fire pit':0.1},
		use:{'worker':15,'land':1,'Instructor':1,'stone tools':32},
		req:{'<font color="maroon">Moderation</font>':true,'Factories I':true},
		category:'crafting',
		effects:[	
			{type:'convert',from:{'leather':20},into:{'Dried leather':20},every:7,req:{'Bigger factory racks':false}},
			{type:'convert',from:{'leather':40},into:{'Dried leather':40},every:7,req:{'Bigger factory racks':true}},
			{type:'convert',from:{'hide':200,'water':1000,'salt':150,'log':15},into:{'leather':235},every:15},
			{type:'convert',from:{'hide':200,'muddy water':1000,'herb':145},into:{'leather':235},every:20},
			{type:'mult',value:0.5,req:{'Leather factory production rates':0.5}},
			{type:'mult',value:1.5,req:{'Leather factory production rates':1.5}},
			{type:'mult',value:2,req:{'Leather factory production rates':2}},
		],
	});
		new G.Unit({
		name:';Cloudy water filter',
		displayName:'Cloudy water filter',
		desc:'A filter that uses [Land of the Paradise] and a worker. As his upkeep uses [coal] and [Mana] you gain 82% of converted water. <>Moderation path unit. Has research techs that can improve power and efficiency of the [;Cloudy water filter] <>Conversion: [Cloudy water] into [water]',
		icon:[25,11,'magixmod'],
		cost:{'basic building materials':275},
		upkeep:{'coal':1,'Mana':1.5},
		use:{'worker':1,'Land of the Paradise':1,'Industry point':1},
		req:{'<font color="maroon">Moderation</font>':true,'Cloudy water filtering':true},
		category:'paradiseunit',
		effects:[
			{type:'convert',from:{'Cloudy water':37},into:{'water':28,'cloud':2},every:1},
			{type:'mult',value:1.75,req:{'Filtering with better quality':true}},
			{type:'mult',value:1.75,req:{'Magical filtering way':true}},
			{type:'mult',value:2,req:{'Supreme cloudy fast filtering':true}},
		],
	});
		new G.Unit({
		name:'Cloudy water filter',
		desc:'A filter that uses [Land of the Paradise] and a worker. As his upkeep uses [sand] and [Mana] you gain 95% of converted water. <>Caretaking path unit. Has research techs that can improve power and efficiency of the [Cloudy water filter] <>Conversion: [Cloudy water] into [water]',
		icon:[25,12,'magixmod'],
		cost:{'basic building materials':75},
		upkeep:{'sand':1,'Mana':1},
		use:{'worker':1,'Land of the Paradise':0.75,'Industry point':0.5},
		req:{'<font color="maroon">Caretaking</font>':true,'Cloudy water filtering':true},
		category:'paradiseunit',
		effects:[
			{type:'convert',from:{'Cloudy water':15},into:{'water':14,'cloud':1},every:1},
			{type:'mult',value:1.75,req:{'Filtering with better quality':true}},
			{type:'mult',value:1.75,req:{'Magical filtering way':true}},
			{type:'mult',value:2,req:{'Supreme cloudy fast filtering':true}},
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
			{type:'mult',value:2,req:{'Supreme fast filtering':true}},
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
			{type:'mult',value:2,req:{'Supreme fast filtering':true}},
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
			{type:'mult',value:1.5,req:{'Fertlizer for grain':true}}
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
			{type:'mult',value:1.5,req:{'Fertlizer for grain':true}},
			{type:'mult',value:1.35,req:{'improved windmill motors':true}}
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
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on'}},
			{type:'mult',value:1.5,req:{'Fertlizer for grain':true}},
			{type:'mult',value:1.75,req:{'wizard\'s grain fertlizer':true}},
			{type:'mult',value:2,req:{'backshift at farms':true}},
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
			{type:'function',func:unitGetsConverted({'wounded':2},0.001,0.01,'[X] [people].','mine collapsed because of underground explosives blasting, wounding its miners','mines collapsed because of underground explosives blasting, wounding their miners.'),chance:7/50,req:{'Safer explosive usage':false}},
			{type:'function',func:unitGetsConverted({'wounded':2},0.001,0.01,'[X] [people].','mine collapsed because of underground explosives blasting, wounding its miners','mines collapsed because of underground explosives blasting, wounding their miners.'),chance:6/51.5,req:{'Safer explosive usage':true}},
			{type:'mult',value:1.05,req:{'Safer explosive usage':true}}
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
			{type:'mult',value:1.44,req:{'Better papercrafting recipe':'true','culture of moderation':true}},
			{type:'mult',value:3,req:{'Paper mastery':true}},
			{type:'mult',value:1.25,req:{'Even mo\' paper':true,'<font color="maroon">Moderation</font>':true,'<font color="maroon">Caretaking</font>':false}},
			{type:'mult',value:1.25,req:{'Even mo\' paper':true,'<font color="maroon">Caretaking</font>':true,'<font color="maroon">Moderation</font>':false}},
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
			{type:'mult',value:1.25,req:{'Crafting & farm rituals':'on','power of the faith':true}},
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
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on','power of the faith':true}},
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
			{type:'gather',what:{'science':0.0000125},req:{'symbolism III':true}},
			{type:'mult',value:1.5,req:{'Science blessing':true}},
			{type:'mult',value:1.5,req:{'se12':'on'}},
			{type:'mult',value:0.75,req:{'se11':'on'}},
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
			{type:'gather',what:{'influence':0.01}},
			{type:'mult',value:1.7,req:{'symbolism III':true}}
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
			{type:'mult',value:1.5,req:{'bigger kilns':true}},
			{type:'mult',value:1.1,req:{'Better kiln construction':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.05,req:{'Better kiln construction':true,'<font color="maroon">Caretaking</font>':true}},
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
			{type:'mult',value:0.9,req:{'dt7':true}},
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
			{type:'mult',value:1.44,req:{'Better papercrafting recipe':'true','culture of moderation':true}},
			{type:'mult',value:3,req:{'Paper mastery':true}},
			{type:'mult',value:1.25,req:{'Even mo\' paper':true,'<font color="maroon">Moderation</font>':true,'<font color="maroon">Caretaking</font>':false}},
			{type:'mult',value:1.25,req:{'Even mo\' paper':true,'<font color="maroon">Caretaking</font>':true,'<font color="maroon">Moderation</font>':false}},
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
			{type:'mult',value:1.03,req:{'More experienced healers':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.09,req:{'More experienced healers':true,'<font color="maroon">Caretaking</font>':true}},
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
			{type:'mult',value:1.05,req:{'Magical presence':true}}
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
			{type:'mult',value:1.2,req:{'wisdom rituals':'on'}},
			{type:'mult',value:1.05,req:{'Cultural forces arise':true}},
			{type:'mult',value:0.9,req:{'se12':'on'}},
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
			{type:'mult',value:4,req:{'Master mana-making':true}},
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
			{type:'mult',value:1.05,req:{'Magical presence':true}}
	],
		req:{'construction':true,'Wizard towers':true,'Wizard wisdom':true,'Well of Mana':true},
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
			{type:'mult',value:1.05,req:{'Magical presence':true}}
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
			{type:'mult',value:1.05,req:{'Magical presence':true}}
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
			{type:'gather',what:{'Lightning essence':2}},
			{type:'mult',value:1.05,req:{'Magical presence':true}}
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
			{type:'mult',value:1.05,req:{'Magical presence':true}}
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
			{type:'mult',value:1.05,req:{'Magical presence':true}}
	],
		category:'housing',
		limitPer:{'land':2},
	});
		new G.Unit({
		name:'Church',
		desc:'Commonly generates [faith] at the lower rate than [soothsayer]. Further religion improvements may change it.',
		icon:[6,3,'magixmod'],
		cost:{'basic building materials':2000,'precious building materials':20},
		upkeep:{'faith':0.001},
		use:{'land':1,'worker':2},
		req:{'churches':true},
		effects:[
			{type:'gather',what:{'faith':0.03},req:{'Spiritual piety':false}},
			{type:'gather',what:{'faith':0.039},req:{'Spiritual piety':true}},
			{type:'mult',value:1.25,req:{'se11':'on'}},
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
			{type:'mult',value:1.7,req:{'symbolism III':true}},
			{type:'waste',chance:0.003/1000},
			{type:'mult',value:1.25,req:{'se11':'on'}},
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
			{type:'mult',value:1.05,req:{'Cultural forces arise':true}},
			{type:'mult',value:0.9,req:{'se12':'on'}},
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
		upkeep:{'Mana':36},
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
			{type:'provide',what:{'housing':0.2},req:{'Better house construction':true}},
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
		icon:[23,22,'magixmod',25,2],
		cost:{'basic building materials':1000},
		use:{'land':1,'worker':1},
		effects:[
			{type:'convert',from:{'water':8,'limestone':2},into:{'concrete':2},every:7},
			{type:'mult',value:1.2,req:{'Mo\' concrete':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.05,req:{'Mo\' concrete':true,'<font color="maroon">Caretaking</font>':true}},
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
			{type:'provide',what:{'housing':20},req:{'Even mo\' floorz':true}},
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
			{type:'mult',value:0.95,req:{'dt5':true},mode:'iron'},
			{type:'mult',value:0.95,req:{'dt6':true},mode:'tin'},
			//Collapsing chance
			{type:'mult',value:1.05,req:{'Plain island mining strategy':true}},
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.01,'[X] [people].','mine collapsed, wounding its miners','mines collapsed, wounding their miners'),chance:1/50,req:{'Plain island mining strategy':false}},
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.01,'[X] [people].','mine collapsed, wounding its miners','mines collapsed, wounding their miners'),chance:1/70,req:{'Plain island mining strategy':true}}
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
			{type:'mult',value:0.85,req:{'dt8':true}},
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
			{type:'mult',value:0.8,req:{'dt17':true}},
			{type:'mult',value:2.25,req:{'Moderated carpentry':true}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on','power of the faith':true}},
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
			{type:'mult',value:0.95,req:{'dt1':true}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on','power of the faith':true}},
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
			{type:'mult',value:3,req:{'Science blessing':true}},
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
			{type:'mult',value:3,req:{'Science blessing':true}},
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
			{type:'mult',value:3,req:{'Science blessing':true}},
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
			{type:'mult',value:2,req:{'More capacious racks':true}},
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
		
			{type:'gather',context:'flowers',amount:0.1,max:0.4},
			{type:'mult',value:1.05,req:{'harvest rituals for flowers':'on'}},
			{type:'convert',from:{'Paper':12,'Ink':3},into:{'Florist\'s notes':1},every:11,req:{'Notewriting':true},chance:1/95},
			{type:'mult',value:0.8,req:{'se12':'on'}},
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
			{type:'mult',value:1.01,req:{'se11':'on'}},
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
			{type:'provide',what:{'housing':1},req:{'God\'s trait #1 Housing':true}},
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
			
			'juices':{name:'Craft juices',icon:[14,3,'magixmod'],desc:'This artisan will craft [Juices] out of [Watermelon] or [Berries] , [sugar] and [water]. Have a good taste. <b>:)',use:{'worker':1}},
		},
		effects:[
			{type:'convert',from:{'Sugar cane':1.5},into:{'sugar':1},every:5,mode:'sugar'},
			{type:'convert',from:{'sugar':1,'Berries':0.95,'water':1},into:{'Berry juice':1},every:5,mode:'juices'},
			{type:'convert',from:{'sugar':1,'Watermelon':0.4,'water':2},into:{'Watermelon juice':2},every:5,mode:'juices'},
			{type:'convert',from:{'sugar':1,'fruit':0.4,'water':2},into:{'Fruit juice':2},every:5,mode:'juices',req:{'Moar juices':true}},
			{type:'convert',from:{'sugar':3,'fruit':0.9,'water':6,'Berries':1,'Watermelon':0.25},into:{'Fruit juice':12,'Berry juice':8,'Watermelon juice':9},every:5,mode:'juices',req:{'Moar juices':true},chance:1/20},
			{type:'mult',value:1.25,req:{'Crafting & farm rituals':'on','power of the faith':true}},
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
			{type:'mult',value:1.03,req:{'More experienced healers':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.09,req:{'More experienced healers':true,'<font color="maroon">Caretaking</font>':true}},
		],
		req:{'healing':true,'first aid':true},
		category:'spiritual',
		priority:5,
	});
	
		new G.Unit({
		name:'Berry farm',
		desc:'@Specialized farm which will harvest tasty [Berries] at the better rate than [gatherer].',
		icon:[14,1,'magixmod'],
		cost:{'Beet seeds':200},//Ingame displays seed
		req:{'Farms in the new land':true},
		upkeep:{'water':12},
		use:{'worker':8,'Land of the Plain Island':35},
		category:'plainisleunit',
		effects:[
			{type:'gather',context:'gather',what:{'Berries':15.3}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on'}},
			{type:'mult',value:8,req:{'God\'s trait #2 Berry rush':true}},
			{type:'mult',value:2,req:{'Berry masterry':true}},
			{type:'mult',value:2.5,req:{'backshift at farms':true}},
		],
	});
		new G.Unit({
		name:'Watermelon farm',
		desc:'@Specialized farm which will harvest tasty [Watermelon] at the better rate than [gatherer].',
		icon:[14,2,'magixmod'],
		cost:{'Beet seeds':200},//It will display ingame Seeds
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
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on'}},
			{type:'mult',value:2.5,req:{'More humid water':true}},
			{type:'mult',value:3,req:{'Soil for moisture-loving plants':true}},
			{type:'mult',value:4,req:{'Empowered canes':true}},
			{type:'mult',value:4,req:{'Essenced soil for moisture-loving plants':true}},
			{type:'mult',value:2.5,req:{'backshift at farms':true}},
		],
	});
		new G.Unit({//I was removed because I didn't change that much in game. I was a beet farm but I am going to be something different more useful
		name:'crematorium',
		desc:'Emballs and burns [corpse]s in roaring fire. Then all dust from the body is being put into the [Urn] . Uses [fire pit]s as an upkeep.',
		icon:[31,21,'magixmod'],
		req:{'cremation':true},
		use:{'worker':3,'Instructor':1,'land':1},
		cost:{'basic building materials':300},
		upkeep:{'fire pit':3},
		effects:[
			{type:'convert',from:{'corpse':7,'pot':7},into:{'Urn':7},every:5},
		],
		category:'civil'
	});
			new G.Unit({
		name:'Essential conversion tank',
		desc:'@A tank that converts 500 [insight],[culture],[faith] and [influence] into their respective second tiers.. <>You can specify which essential the Tank will convert by using modes for this unit. Can only cause convertion when you have more than 600 of an [insight,Essential] .',
		icon:[26,19,'magixmod'],
		cost:{'glass':500,'basic building materials':150},
		req:{'Eotm':true},
		use:{'worker':2,'land':1},
		upkeep:{'Mana':50},
		limitPer:{'population':1e5},
		category:'discovery',
		gizmos:true,
		modes:{
			'insight':{name:'Insight to Insight II',icon:[18,19,'magixmod'],desc:'This tank will convert each 500 [insight] into 1 [insight II] '},
			'culture':{name:'Culture to Culture II',icon:[19,19,'magixmod'],desc:'This tank will convert each 500 [culture] into 1 [culture II] '},
			'faith':{name:'Faith to Faith II',icon:[17,19,'magixmod'],desc:'This tank will convert each 500 [faith] into 1 [faith II] '},
			'influence':{name:'Influence to Influence II',icon:[20,19,'magixmod'],desc:'This tank will convert each 500 [influence] into 1 [influence II] '},
		},
		effects:[
			{type:'convert',from:{'insight':500},into:{'insight II':1},every:10,mode:'insight',req:{'Essential conversion tank overclock I':false}},
			{type:'convert',from:{'culture':500},into:{'culture II':1},every:10,mode:'culture',req:{'Essential conversion tank overclock I':false}},
			{type:'convert',from:{'faith':500},into:{'faith II':1},every:10,mode:'faith',req:{'Essential conversion tank overclock I':false}},
			{type:'convert',from:{'influence':500},into:{'influence II':1},every:10,mode:'influence',req:{'Essential conversion tank overclock I':false}},
			{type:'convert',from:{'insight':500},into:{'insight II':1},every:9,mode:'insight',req:{'Essential conversion tank overclock I':true}},
			{type:'convert',from:{'culture':500},into:{'culture II':1},every:9,mode:'culture',req:{'Essential conversion tank overclock I':true}},
			{type:'convert',from:{'faith':500},into:{'faith II':1},every:9,mode:'faith',req:{'Essential conversion tank overclock I':true}},
			{type:'convert',from:{'influence':500},into:{'influence II':1},every:9,mode:'influence',req:{'Essential conversion tank overclock I':true}},
		]
		});
		new G.Unit({
		name:'Farm of smokers',
		desc:'Smoker\'s "skin" and seeds he throws out while releasing another bunch of smoke into the sky. From this farm your people can gather [Fire essence] . ',
		icon:[28,7,'magixmod'],
		cost:{'Essenced seeds':300,'Fire essence':1000,'herb':100},
		req:{'Smokers & Windferns':true},
		use:{'worker':8,'Land of the Plain Island':15,'Instructor':2},
		upkeep:{'water':14,'Fire essence':1,'Mana':7},
		category:'plainisleunit',
		effects:[
			{type:'gather',context:'gather',what:{'Fire essence':11}},
			{type:'mult',value:1.5,req:{'God\'s trait #6 Fertile essences farms':true}},
			{type:'mult',value:1.1,req:{'Nutritious magical soil':true}},
			{type:'mult',value:1.1,req:{'Juicy nutritious magical soil':true}},
		],
	});
		new G.Unit({
		name:'Farm of windferns',
		desc:'From his white leaves you can find tiny grains that can fly away from your hand quickly. From this farm your people can gather [Wind essence] . ',
		icon:[28,8,'magixmod'],
		cost:{'Essenced seeds':300,'Wind essence':1000,'herb':100},
		req:{'Smokers & Windferns':true},
		use:{'worker':8,'Land of the Plain Island':15,'Instructor':2},
		upkeep:{'water':14,'Wind essence':1,'Mana':7},
		category:'plainisleunit',
		effects:[
			{type:'gather',context:'gather',what:{'Wind essence':11}},
			{type:'mult',value:1.5,req:{'God\'s trait #6 Fertile essences farms':true}},
			{type:'mult',value:1.1,req:{'Nutritious magical soil':true}},
			{type:'mult',value:1.1,req:{'Juicy nutritious magical soil':true}},
		],
	});
		new G.Unit({
		name:'Farm of holy roses',
		desc:'Holy rose\'s petals are radiating with a lot of light that can blind a farmer. Carefully gathered can be disenchanted allowing you to gather [Essence of the Holiness] . ',
		icon:[28,4,'magixmod'],
		cost:{'Essenced seeds':300,'Essence of the Holiness':1000,'herb':100},
		req:{'Holy roses farm':true},
		use:{'worker':8,'Land of the Plain Island':15,'Instructor':2},
		upkeep:{'water':14,'Essence of the Holiness':1,'Mana':7},
		category:'plainisleunit',
		effects:[
			{type:'gather',context:'gather',what:{'Essence of the Holiness':11}},
			{type:'mult',value:1.5,req:{'God\'s trait #6 Fertile essences farms':true}},
			{type:'mult',value:1.1,req:{'Nutritious magical soil':true}},
			{type:'mult',value:1.1,req:{'Juicy nutritious magical soil':true}},
		],
	});
		new G.Unit({
		name:'Farm of watorchids',
		desc:'This farm is muddy and wet due to enviroment that is required to start farming [Water essence]. Small pools of essenced droplets can be collected to bucket for instance and then be disenchanted. This is the way the people will gather [Water essence] . ',
		icon:[28,10,'magixmod'],
		cost:{'Essenced seeds':300,'Water essence':1000,'herb':100},
		req:{'Withering tulips & Watorchids':true},
		use:{'worker':8,'Land of the Plain Island':15,'Instructor':2},
		upkeep:{'water':21,'Water essence':1,'Mana':21},
		category:'plainisleunit',
		effects:[
			{type:'gather',context:'gather',what:{'Water essence':11}},
			{type:'mult',value:1.5,req:{'God\'s trait #6 Fertile essences farms':true}},
			{type:'mult',value:1.1,req:{'Nutritious magical soil':true}},
			{type:'mult',value:1.1,req:{'Juicy nutritious magical soil':true}},
		],
	});
		new G.Unit({
		name:'Farm of withering tulips',
		desc:'These tulips darkens each torch a human holds. Farmers of these tulips don\'t want to share the way how do they collect [Dark essence] out of these flowers. ',
		icon:[28,9,'magixmod'],
		cost:{'Essenced seeds':300,'Dark essence':1000,'herb':100},
		req:{'Withering tulips & Watorchids':true},
		use:{'worker':8,'Land of the Plain Island':15,'Instructor':2,'Wand':9},
		upkeep:{'water':14,'Dark essence':1,'Mana':7},
		category:'plainisleunit',
		effects:[
			{type:'gather',context:'gather',what:{'Dark essence':11}},
			{type:'mult',value:1.5,req:{'God\'s trait #6 Fertile essences farms':true}},
			{type:'mult',value:1.1,req:{'Nutritious magical soil':true}},
			{type:'mult',value:1.1,req:{'Juicy nutritious magical soil':true}},
		],
	});
		new G.Unit({
		name:'Farm of naturdaisies',
		desc:'Naturdaisies are growing on big "trees" that can release these essenced beauties. Then people gathers them and disenchant them gaining [Nature essence] . ',
		icon:[28,6,'magixmod'],
		cost:{'Essenced seeds':300,'Nature essence':1000,'herb':100},
		req:{'Lightlily & Naturdaisy':true},
		use:{'worker':8,'Land of the Plain Island':15,'Instructor':2,'Wand':9},
		upkeep:{'water':14,'Nature essence':1,'Mana':7},
		category:'plainisleunit',
		effects:[
			{type:'gather',context:'gather',what:{'Nature essence':11}},
			{type:'mult',value:1.5,req:{'God\'s trait #6 Fertile essences farms':true}},
			{type:'mult',value:1.1,req:{'Nutritious magical soil':true}},
			{type:'mult',value:1.1,req:{'Juicy nutritious magical soil':true}},
		],
	});
		new G.Unit({
		name:'Farm of lightlilies',
		desc:'Lightlily is the one which leaves can have lightning shape. People are cautious because sometime especially while storms the flower gets electrified. But cutting stalk with main flower and disenchanting it allows people to gather [Lightning essence] . ',
		icon:[28,5,'magixmod'],
		cost:{'Essenced seeds':300,'Lightning essence':1000,'herb':100},
		req:{'Lightlily & Naturdaisy':true},
		use:{'worker':8,'Land of the Plain Island':15,'Instructor':2,'Wand':9},
		upkeep:{'water':14,'Lightning essence':1,'Mana':7},
		category:'plainisleunit',
		effects:[
			{type:'gather',context:'gather',what:{'Lightning essence':11}},
			{type:'mult',value:1.5,req:{'God\'s trait #6 Fertile essences farms':true}},
			{type:'mult',value:1.1,req:{'Nutritious magical soil':true}},
			{type:'mult',value:1.1,req:{'Juicy nutritious magical soil':true}},
		],
	});
		new G.Unit({
		name:'Treehouse',
		desc:'@provides 3 [housing]<>Small pied-a-terre built inside one of paradise trees.',
		icon:[6,21,'magixmod'],
		cost:{'lumber':150},
		use:{'Land of the Paradise':0.33},
		limitPer:{'land':2,'population':100},
		effects:[
			{type:'provide',what:{'housing':3}},
		],
		req:{'Paradise housing':true},
		category:'paradiseunit',
	});
		new G.Unit({
		name:'Cozy lodge',
		desc:'@provides 5 [housing]<>Small live that is cozy and everyone feels safe inside it.',
		icon:[3,21,'magixmod'],
		cost:{'basic building materials':150},
		use:{'Land of the Paradise':1},
		limitPer:{'land':10,'population':110},
		effects:[
			{type:'provide',what:{'housing':5}},
		],
		req:{'Paradise housing':true},
		category:'paradiseunit',
	});
		new G.Unit({
		name:'Cozy paradise hut',
		desc:'@provides 6 [housing]<>Small dwelling that is cozy and place where your people can lead calm and happy life.',
		icon:[2,21,'magixmod'],
		cost:{'basic building materials':200},
		use:{'Land of the Paradise':1},
		limitPer:{'land':15,'population':120},
		effects:[
			{type:'provide',what:{'housing':6}},
		],
		req:{'Paradise housing':true},
		category:'paradiseunit',
	});
		new G.Unit({
		name:'hardened house',
		desc:'@provides 16 [housing]<>Huge house that can fit 2 even 3 families at the same time. Due to its capacity it is far more limited type of housing. Inside of this [hardened house] people feel safe and they probably will never even thinking about moving away from this house to huts or lodges.',
		icon:[4,21,'magixmod'],
		cost:{'basic building materials':1200,'glass':5},
		use:{'Land of the Paradise':1},
		limitPer:{'land':37,'population':400},
		effects:[
			{type:'provide',what:{'housing':16}},
		],
		req:{'Paradise housing':true},
		category:'paradiseunit',
	});
		new G.Unit({
		name:'musician',
		desc:'@generates [culture] every now and then<>[musician]s gather the tribe around at nightfall to sing and play songs that people know and give fun to people.',
		icon:[28,18,'magixmod'],
		cost:{},
		use:{'worker':1},
		upkeep:{'coin':0.1},
		limitPer:{'population':400},
		effects:[
			{type:'gather',what:{'culture':0.1}},
			{type:'mult',value:0.9,req:{'se12':'on'}},
		],
		req:{'oral tradition':true,'Music instruments':true},
		category:'cultural',
	});
		new G.Unit({
		name:'Fishers & hunters camp',
		desc:'@An camp where [hunter]s and [fisher]s come.  //There they train and learn to be better at their job. //One [Fishers & hunters camp] can associate up to 800 [worker]s divided into 400 [hunter]s and 400 [fisher]s. //[hunter]s that work at this camp has very low chance for being a victim of an accident. //It may be more expensive but it can gather you a lot of [food] .',
		icon:[5,23,'magixmod'],
		wideIcon:[3,23,'magixmod'],
		cost:{'basic building materials':4850,'food':2500,'Paper':3000},
		use:{'worker':800,'Instructor':50,'land':40,'armor set':400,'Fishing net':400,'metal weapons':400,'stone weapons':200,'Crossbow':400,'Crossbow belt':60000,'bow':500},
		upkeep:{'food':75,'fire pit':2},
		limitPer:{'population':40000,'land':2500},
		effects:[
			{type:'gather',context:'fish',amount:2533,max:3811},
			{type:'gather',context:'hunt',amount:2833,max:4111},
			{type:'convert',from:{'worker':2},into:{'wounded':2},every:7,chance:1/115},
			{type:'mult',value:1.35,req:{'harvest rituals':'on'}},
			{type:'convert',from:{'meat':4,'seafood':3},into:{'cooked meat':4,'seafood':3},every:2,req:{'Camp-cooking':true}},
		],
		req:{'Hunters & fishers unification':true},
		category:'production',
	});
		new G.Unit({
    		name:'Dark wormhole',
    		desc:'A wormhole built in the depths of the Underworld where darkness is everywhere. The wormhole provides over 20M[burial spot] but requires upkeep. It just looks cheap. Furthermore the [Dark wormhole] may get new abilities.',
    		icon:[13,22,'magixmod'],
    		cost:{'gem block':4,'precious building materials':5e3},
    		effects:[
    			{type:'provide',what:{'burial spot':2.4e7}},
			{type:'provide',what:{'corpsedecaypoint':1}},
    		],
		upkeep:{'Dark essence':30,'Mana':90,'Magic essences':1},
    		use:{'Land of the Underworld':10,'worker':5,'Instructor':3},
    		req:{'Burial wormhole 2/2':true},
    		limitPer:{'land':3000,'population':50000},
    		category:'civil',
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
    		cost:{'precious building materials':35000,'insight':1500,'faith':250,'Fire essence':45000,'Water essence':47500,'Dark essence':37500,'Wind essence':27500,'Lightning essence':37750,'Nature essence':100750,'precious metal ingot':1e4,'heavenlyTemplePoint':400},
    		effects:[
    			{type:'provide',what:{'Land of the Paradise':26500}},
			{type:'provide',what:{'Paradise emblem':1}},
    		],
    		use:{'land':10},
    		req:{'Second portal to new world':true,'Belief in portals':true},
    		limitPer:{'land':100000000000000},//It is something like max 1
    		category:'dimensions',
	});
		new G.Unit({
    		name:'<span style="color: #FF0000">Underworld</span>',
    		desc:'Now you may enter right into the Underworld. A new creepy, unstable, dangerous world will become open for you',
    		wideIcon:[7,5,'magixmod'],
    		cost:{'precious building materials':35000,'insight':1500,'faith':250,'Fire essence':95000,'Water essence':47500,'Dark essence':157500,'Wind essence':27500,'Lightning essence':37750,'Nature essence':10750},
    		effects:[
			{type:'provide',what:{'Underworld emblem':1}},
			{type:'provide',what:{'Land of the Underworld':150}}
    		],
    		use:{'land':1},
    		req:{'A feeling from the Underworld':true,'Third passage to new world':true},
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
		costPerStep:{'basic building materials':2500,'precious building materials':1250,'gem block':2,'concrete':25,'heavenlyTemplePoint':-1},
		steps:300,
		messageOnStart:'You begin the construction of the Temple. Its highest tower is a pass between land of people and sky of angels. No one may go on top unless it is coated. This temple will be last bastion of religion and a storage of relics. Your people with full of hope are building this mass, full of glory wonder.',
		finalStepCost:{'population':1000,'precious building materials':25000,'faith':100,'influence':75,'basic building materials':3000,'heavenlyTemplePoint':-100},
		finalStepDesc:'To complete the Temple, 1000 of your [population,People] and many more resources needed to finish Temple completely must be sacrificed to accompany you as servants in the afterlife and Angels of the Afterlife. Are you ready?',
		use:{'land':75},
		//require:{'worker':10,'stone tools':10},
		req:{'monument-building II':true},
		category:'wonder',
	});
//Revenants trait wonder. People want to send these corpses right into its coils
		new G.Unit({
		name:'The Skull of Wild Death',
		desc:'@leads to the <b>Deadly escape</b><>A big skull shaped construction with fire roaring inside dedicated to bloodthirsty [<span style="color: red">Revenants</span>] assaulting your world.//A realm around it is a burial for them. Home of [wild corpse] . There they can burn and in the terrain around buried. Per each step you will perform building it you will grant big amount of [burial spot] . <i>Let these corpses go into their rightenous home</i>',
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
  		new G.Unit({
		name:'New world',
		desc:'Step by step digging will lead people to new world. You need to know that this won\'t be as safe as you thought it is. After finishing this step of activation you need to ascend by it.',
		wonder:'"In the underworld"',
		icon:[8,5,'magixmod'],
		wideIcon:[6,19,'magixmod',7,5,'magixmod'],
		cost:{'basic building materials':1500},
		costPerStep:{'Dark essence':150,'basic building materials':150,'gem block':1,'population':3,'Mana':3000,'New world point':-1},
		steps:1111,
		messageOnStart:'Your people started digging down right into core of the mortal world. The deeper they mine the warmer it is there. What can be inside the new world?',
		finalStepCost:{'population':2500,'gem block':500,'gold block':50,'New world point':-389},
		finalStepDesc:'<font color="fuschia">To complete this step of activating passage to the Underworld you need to ascend.</font>',
		use:{'land':1,'worker':35,'metal tools':35,'armor set':35},
		category:'dimensions',
		req:{'A feeling from the Underworld':false,'Third passage to new world':true}
	});
	  	new G.Unit({
		name:'Fortress of magicians',
		displayName:'<font color="yellow">Fortress of magicians</font>',
		desc:'Leads to <b>Magical victory</b> //A wonder that represents wisdom and power of your [Wizard]s and whole [Magic essences,Magic]. //Built at tall mountain, filled wih magic in one word it is essenced.',
		wonder:'Magical',
		icon:[10,22,'magixmod'],
		wideIcon:[9,22,'magixmod'],
		cost:{'basic building materials':1500},
		costPerStep:{'Mana':25000,'Magic essences':500,'precious building materials':100,'basic building materials':1000,'concrete':5,'strong metal ingot':75},
		steps:200,
		messageOnStart:'Your people who worships magic , wizardry and believe in power of the essences started building a wonder that will be related to the believements. <br>Will magic award your and your people\'s hard work?',
		finalStepCost:{'population':500,'Fire essence':5e4,'Lightning essence':5e4,'Dark essence':5e4,'Wind essence':5e4,'Nature essence':5e4,'Water essence':5e4,'Essence of the Holiness':5e4},
		finalStepDesc:'To complete this step a 50k [Fire essence,F.e.] , [Dark essence,D.e.] , [Nature essence,N.e] , [Lightning essence,L.e.] and other [Magic essences,Essences] must be sacrificed and many other resources in order to make magic being cultivated for long time.',
		use:{'land':15},
		category:'wonder',
		req:{'Magic adept':true}
	});
	//Seasonal content units
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
		//limitPer:{'land':40},
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
		//limitPer:{'land':40},
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
		//limitPer:{'land':40},
	});
		new G.Unit({
		name:'heavy warehouse',
		desc:'@provides 9000 [material storage]<>A large and hard-to-destroy building for storing materials. Staffed with six guards and one leader to prevent theft or evil forces from appear near the warehouse.',
		icon:[30,12,'magixmod'],
		cost:{'basic building materials':1500,'Cobalt ingot':1000,'precious building materials':100},
		use:{'Land of the Underworld':5},
		staff:{'worker':6,'armor set':6,'metal weapons':6,'Instructor':1},
		effects:[
			{type:'provide',what:{'added material storage':9000}},
			{type:'waste',chance:0.0000001/1000000000000}
		],
		req:{'Storage at the bottom of the world':true},
		category:'storage',
	});
	new G.Unit({
		name:'Temple of the Paradise',
		desc:'@leads to the <b>Victory next to the god</b>. //A big, golden temple which is homeland of Seraphins and the God. A temple that stays at huge cloud. It is glowing with ambrosium.',
		wonder:'Next to the God',
		icon:[9,25,'magixmod'],
		wideIcon:[8,25,'magixmod'],
		cost:{'basic building materials':100000,'precious building materials':5000,'gold block':100,'platinum block':10,'cloud':45000,'Ambrosium shard':10000},
		costPerStep:{'basic building materials':1000,'precious building materials':500,'gold block':10,'platinum block':1,'cloud':4500,'Ambrosium shard':1000},
		steps:400,
		messageOnStart:'The construction of The <b>Temple of the Paradise</b> has been started. Now you are full of hope that it will someday make the God appear next to you and show his true good-natured face.',
		finalStepCost:{'wisdom':125,'population':25000,'precious building materials':24500,'gem block':500,'insight':1000,'Ambrosium shard':10000,'Essence of the Holiness':225000,'faith II':15,'faith':1000,'spirituality':25},
		finalStepDesc:'To complete the wonder and be even closer to the God you must perform this final step 25k [population,people] must be sacrificed... and many other ingredients.',
		use:{'Land of the Paradise':30},
		req:{'monument-building III':true},
		category:'wonder',
	});
	/*=====================================================================================
	TECH & TRAIT CATEGORIES
	=======================================================================================*/
	G.knowCategories.push(
		{id:'main',name:'General'},
		{id:'misc',name:'Miscellaneous'},
		{id:'knowledge',name:'Knowledge'},
		{id:'culture',name:'Cultural'},
		{id:'religion',name:'Religious'},
		{id:'short',name:'Short-term'},//you can only have so many traits with this category; if the player gains a new "short" trait, the oldest "short" trait is removed
		{id:'long',name:'Long-term'},//you can only have so many traits with this category; if the player gains a new "long" trait, the oldest "long" trait is removed
		{id:'gods',name:'<span style="color: #FFD700">God\'s traits</span>'},
		{id:'devils',name:'<span style="color: #FF0000">Devil\'s traits</span>'}
	)
	
	/*=====================================================================================
	MAGIX MODIFICATIONS FOR VANILLA UNITS
	=======================================================================================*/
	//New gains for gatherer
		G.getDict('gatherer').effects.push({type:'gather',context:'gather',what:{'Beet seeds': 0.005},amount:1,max:1});
//Healer generates health by trait and research(it is temporary)
		G.getDict('healer').effects.push({type:'gather',context:'gather',what:{'health': 0.008},amount:1,max:1,req:{'Nutrition':true}});
		G.getDict('healer').effects.push({type:'gather',context:'gather',what:{'health': 0.001},amount:1,max:1,req:{'first aid':true}}); 
//Manufacture units I and Factories I disables
	//Factories I
		G.getDict('potter').effects.push({type:'mult',value:0,req:{'Factories I':true,'<font color="maroon">Moderation</font>':true}});
		G.getDict('clothier').effects.push({type:'mult',value:0,mode:'make leather',req:{'Factories I':true,'<font color="maroon">Moderation</font>':true}});
		G.getDict('clothier').effects.push({type:'mult',value:0,mode:'cheap make leather',req:{'Factories I':true,'<font color="maroon">Moderation</font>':true},mode:'cheap make leather'});
		G.getDict('Drying rack').effects.push({type:'mult',value:0,req:{'Factories I':true,'<font color="maroon">Moderation</font>':true}});
	//Manufacture units I
		G.getDict('potter').effects.push({type:'mult',value:0,req:{'Manufacture units I':true,'<font color="maroon">Caretaking</font>':true}});
		G.getDict('artisan').effects.push({type:'mult',value:0,mode:'dyes1',req:{'Manufacture units I':true,'<font color="maroon">Caretaking</font>':true}});
		G.getDict('artisan').effects.push({type:'mult',value:0,mode:'dyes2',req:{'Manufacture units I':true,'<font color="maroon">Caretaking</font>':true}});
		G.getDict('artisan').effects.push({type:'mult',value:0,mode:'dyes3',req:{'Manufacture units I':true,'<font color="maroon">Caretaking</font>':true}});
		G.getDict('artisan').effects.push({type:'mult',value:0,mode:'dyes4',req:{'Manufacture units I':true,'<font color="maroon">Caretaking</font>':true}});
////////////////////////////////////////////
		/*=====================================================================================
	ACHIEVEMENTS
	=======================================================================================*/
	
	G.legacyBonuses.push(
		{id:'addFastTicksOnStart',name:'+[X] free fast ticks',desc:'Additional fast ticks when starting a new game.',icon:[0,0],func:function(obj){G.fastTicks+=obj.amount;},context:'new'},
		{id:'addFastTicksOnResearch',name:'+[X] fast ticks from research',desc:'Additional fast ticks when completing research.',icon:[0,0],func:function(obj){G.props['fastTicksOnResearch']+=obj.amount;}}
	);
	
	//do NOT remove or reorder achievements or saves WILL get corrupted
	
	new G.Achiev({
		tier:0,
		name:'mausoleum',
		desc:'You have been laid to rest in the Mausoleum, an ancient stone monument the purpose of which takes root in archaic religious thought.',
		fromUnit:'mausoleum',
		effects:[
			{type:'addFastTicksOnStart',amount:300*3},
			{type:'addFastTicksOnResearch',amount:150}
		],
	});
//Temple achiev
		new G.Achiev({
		tier:1,
		name:'Heavenly',
		wideIcon:[0,11,'magixmod'],
		icon:[1,11,'magixmod'],
		desc:'Your soul has been sent to Paradise as archangel with power of top Temple tower in an beautiful stone monument the purpose of which takes root in a pure religious thought.',
		fromWonder:'Heavenly',
		effects:[
			{type:'addFastTicksOnStart',amount:300},
			{type:'addFastTicksOnResearch',amount:25}	
		],
	});
//skull achiev
		new G.Achiev({
		tier:1,
		name:'Deadly, revenantic',
		wideIcon:[0,16,'magixmod'],
		icon:[1,16,'magixmod'],
		desc:'You escaped and your soul got escorted right into the world of Underwold... you may discover it sometime.',
		fromWonder:'Deadly, revenantic',
		effects:[
			{type:'addFastTicksOnStart',amount:300},
			{type:'addFastTicksOnResearch',amount:25}	
		],
	});

		new G.Achiev({
		tier:0,
		name:'Sacrificed for culture',
		wideIcon:[choose([9,12,15]),17,'magixmod',5,12,'magixmod'],
		icon:[6,12,'magixmod'],
		desc:'You sacrificed yourself in the name of [culture]. That choice made your previous people more inspirated and filled with strong artistic powers. It made big profits and they may get on much higher cultural level since now. They will miss you. <b>But now you will obtain +3 [culture] & [inspiration] at start of each next run!</b>',
		fromWonder:'Insight-ly',
		effects:[
			{type:'addFastTicksOnStart',amount:150},
			{type:'addFastTicksOnResearch',amount:75},
		],
	});
		new G.Achiev({
		tier:0,
		name:'Democration',
		wideIcon:[5,13,'magixmod'],
		icon:[6,13,'magixmod'],
		desc:'You rested in peace inside the Pagoda of Democracy\'s tombs. Your glory rest made your previous civilization living in laws of justice forever. They will miss you. <b>But this provides... +1 [influence] & [authority] at start of each next run!</b>',
		fromWonder:'Democration',
		effects:[
			{type:'addFastTicksOnStart',amount:150},
			{type:'addFastTicksOnResearch',amount:75},
		],
	});
		new G.Achiev({
		tier:0,
		name:'Insight-ly',
		wideIcon:[choose([0,3,6]),17,'magixmod'],
		icon:[choose([1,4,7]),17,'magixmod'],
		desc:'You sacrificed your soul for the Dreamers Orb. That choice was unexpectable but glorious. It made dreamers more acknowledged and people got much smarter by sacrifice of yours. They will miss you. <b>But this made a profit... +6 [insight] at start of each next run!</b>',
		fromWonder:'Insight-ly',
		effects:[
			{type:'addFastTicksOnStart',amount:150},
			{type:'addFastTicksOnResearch',amount:75},
		],
	});
		new G.Achiev({
		tier:1,
		name:'"In the underworld"',
		wideIcon:[7,5,'magixmod'],
		icon:[9,5,'magixmod'],
		desc:'You sent your soul to the Underworld, leaving your body that started to decay after it. But... <br><li>If you will obtain <font color="green">Sacrificed for culture</font>, <font color="aqua">Insight-ly</font> and <font color="fuschia">Democration</font> you will start each next game with [adult,The Underworld\'s Ascendant] . <li>To open the Underworld you will need to obtain <b>Deadly, revenantic</b> in addition.',
		fromWonder:'"In the underworld"',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:15},
		],
	});
		new G.Achiev({
		tier:2,
		wideIcon:[27,20,'magixmod'],
		icon:[28,20,'magixmod'],
		name:'<font color="DA4f37">Mausoleum eternal</font>',
		desc:'You have been laid to rest serveral times in the Mausoleum , an ancient stone monument the purpose of which takes root in archaic religious thought. Evolved to unforgetable historical monument. <b>Evolve [mausoleum] to stage 10/10 then ascend by it 11th time to obtain this massive fast tick bonus. <li><font color="aqua">In addition obtaining this achievement doubles chance to summon [belief in the afterlife] trait in each next run after obtaining this achievement.</font></li></b>',
		fromWonder:'<font color="DA4f37">Mausoleum eternal</font>',
		effects:[
			{type:'addFastTicksOnStart',amount:2000},
			{type:'addFastTicksOnResearch',amount:175}
		],
	});
		new G.Achiev({
		tier:1,
		icon:[25,19,'magixmod'],
		name:'Level up',
		desc:'Obtain [Eotm] trait during the run. This trait unlocks second tier of [insight] , [culture] , [faith] and [influence] which are required for further researches.',
	});
		new G.Achiev({
		tier:0,
		icon:[25,21,'magixmod'],
		name:'Metropoly',
		desc:'Manage to get 500k [population,people] in one run.',
		effects:[
			{type:'addFastTicksOnStart',amount:25},
			{type:'addFastTicksOnResearch',amount:5}
		],
	});
		new G.Achiev({
		tier:0,
		icon:[23,21,'magixmod'],
		name:'Apprentice',
		desc:'Get 100 or more technologies in a single run.',
	});
		new G.Achiev({
		tier:1,
		icon:[26,9,'magixmod'],
		name:'Lucky 9',
		desc:'Obtain the [dt9] .',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5}
		],
	});
		new G.Achiev({
		tier:1,
		icon:[26,21,'magixmod'],
		name:'Traitsman',
		desc:'Make your tribe attract 30 traits.',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
		],
	});
		new G.Achiev({
		tier:2,
		icon:[27,21,'magixmod'],
		name:'Extremely smart',
		desc:'Get [insight II] amount equal to [wisdom II] amount. It is not easy as you think it is. @In addition completing <font color="DA4f37">Mausoleum eternal</font> unlocks you [Theme changer] .',
		effects:[
			{type:'addFastTicksOnStart',amount:100},
			{type:'addFastTicksOnResearch',amount:10}
		],
	});
		new G.Achiev({
		tier:0,
		icon:[29,21,'magixmod'],
		name:'Experienced',
		desc:'To get this achievement you need to complete rest achievements in this tier. @<b>Achievement bonus: +100 [fruit]s at start of each next game</b>',
		effects:[
			{type:'addFastTicksOnStart',amount:100},
			{type:'addFastTicksOnResearch',amount:10}
		],
	});
		new G.Achiev({
		tier:1,
		icon:[29,22,'magixmod'],
		name:'Smart',
		desc:'To get this achievement you need to complete rest achievements in this tier. @<b>Achievement bonus: [Brick house with a silo] , [house] , [hovel] , [hut] , [bamboo hut] , [branch shelter] & [mud shelter] will use less [land] at each next run.</b>',
		effects:[
			{type:'addFastTicksOnStart',amount:150},
			{type:'addFastTicksOnResearch',amount:10}
		],
	});
		new G.Achiev({
		tier:2,
		icon:[12,22,'magixmod'],
		name:'Man of essences',
		desc:'Obtain [Magic adept] trait. Manage to get 2.1M [Magic essences]. //Obtaining it may unlock a new wonder.',
		effects:[
			{type:'addFastTicksOnStart',amount:40},
		],
	});
		new G.Achiev({
		tier:2,
		name:'Magical',
		wideIcon:[9,22,'magixmod'],
		icon:[10,22,'magixmod'],
		desc:'<b>You decided to sacrifice yourself for magic.</br>You decided that putting yourself at coffin that there was lying will attract some glory.</br>You were right</b> //This achievement will: @Unlock you a new theme @Increase effect of <b>Wizard towers</b> by 5% without increasing their upkeep cost. //This achievement will unlock you way further technologies such like [hunting III] or [fishing III] .',
		fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:150},
			{type:'addFastTicksOnResearch',amount:15},
		],
	});
			new G.Achiev({
		icon:[16,24,'magixmod'],
		tier:1,
		name:'Familiar',
		desc:'Get 200 or more technologies in a single run.',
	});
				new G.Achiev({
		icon:[23,24,'magixmod'],
		tier:0,
		name:'3rd party',
		desc:'Play magix and some other mod. //<b>Note: You will gain this achievement only if you use one of the NEL mods found/available on the Dashnet Discord server!</b> //If you want achievement to be obtainable with your mod too join the discord server and DM me. <i>mod author</i> //<font color="fuschia">This achievement will not be required while you will try to gain bonus from completing this achievement row</font>',
	});
		new G.Achiev({
		tier:3,
		name:'Patience',
		wideIcon:[3,26,'magixmod'],
		icon:[4,26,'magixmod'],
		desc:'Complete Chra-nos trial for the first time. Your determination led you to victory. //Complete this trial again to gain extra Victory Points.',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
	});
		new G.Achiev({
		tier:3,
		name:'Unhappy',
		wideIcon:[6,26,'magixmod'],
		icon:[7,26,'magixmod'],
		desc:'Complete Bersaria\'s trial for the first time. Your determination and calmness led you to victory. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
	});
		new G.Achiev({
		tier:3,
		name:'Cultural',
		wideIcon:[18,26,'magixmod'],
		icon:[19,26,'magixmod'],
		desc:'Complete Tu-ria\'s trial for the first time. Your artistic thinking led you to the victory. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
	});
		new G.Achiev({
		tier:3,
		name:'Hunted',
		wideIcon:[24,26,'magixmod'],
		icon:[25,26,'magixmod'],
		desc:'Complete Hartar\'s trial for the first time. Making people being masters at hunting and showing \'em what brave really is led you to the victory. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
	});
		new G.Achiev({
		tier:3,
		name:'Unfishy',
		wideIcon:[21,26,'magixmod'],
		icon:[22,26,'magixmod'],
		desc:'Complete Fishyar\'s trial for the first time. Making people believe that life without fish is not boring led you to the victory. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
	});
		new G.Achiev({
		tier:3,
		name:'Ocean',
		wideIcon:[1,25,'magixmod'],
		icon:[2,25,'magixmod'],
		desc:'Complete Posi\'zul\'s trial for the first time. Living at the endless ocean is not impossible and you are example of that. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
	});
		new G.Achiev({
		tier:3,
		name:'Herbalism',
		wideIcon:[12,26,'magixmod'],
		icon:[13,26,'magixmod'],
		desc:'Complete Herbalia\'s trial for the first time. Herbs are not that bad! //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
	});
		new G.Achiev({
		tier:3,
		name:'Buried',
		wideIcon:[0,26,'magixmod'],
		icon:[1,26,'magixmod'],
		desc:'Complete Buri\'o dak \'s trial for the first and the last time. Death lurks everywhere but it is still easy deal for you!',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
	});
		new G.Achiev({
		tier:3,
		name:'Underground',
		wideIcon:[15,26,'magixmod'],
		icon:[16,26,'magixmod'],
		desc:'Complete Moai\'s trial for the first time. Stone leads to victory! //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
	});
		new G.Achiev({
		tier:3,
		name:'Pocket',
		wideIcon:[9,26,'magixmod'],
		icon:[10,26,'magixmod'],
		desc:'Complete Mamuun\'s trial for the first time. Seems like you have got a trading skills! This can lead to victory. //Complete this trial again to gain extra Victory Points. 2nd victory of this trial increases bonus from the trial',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
	});
		new G.Achiev({
		tier:3,
		name:'Faithful',
		wideIcon:[0,27,'magixmod'],
		icon:[1,27,'magixmod'],
		desc:'Complete Enlightened\'s trial for the first time. Belief and faith is everything. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
	});
		new G.Achiev({
		tier:3,
		name:'Dreamy',
		wideIcon:[27,26,'magixmod'],
		icon:[28,26,'magixmod'],
		desc:'Complete Okar the Seer\'s trial for the first time. Knowledge leads to victory. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
	});
	new G.Achiev({
		tier:2,
		name:'Next to the God',
		displayName:'<font color="yellow">Next to the God</font>',
		wideIcon:[8,25,'magixmod'],
		icon:[9,25,'magixmod'],
		desc:'Ascend by the Temple of the Paradise... You managed to be very close to the God. But this step will make it easier. Because you had to sacrifice so much time reaching that far this achievement has plenty of rewards. Here are the rewards you will get for it: @Chance for [culture of the afterlife] is tripled. Same to [The God\'s call]. @[An opposite side of belief] has 10% bigger chance to occur.(Note: not 10 percent points! Chance for it is multiplied by 1.1!) @You will start each next run with +1 [faith] and [spirituality] @You will unlock the Pantheon! Just build this wonder again(nope you won\'t need to ascend once more by it, just complete it and buy tech that will finally unlock it for you). @This achievement will unlock you <b><font color="orange">3</font> new themes!</b>',
		fromWonder:'Next to the God',
		effects:[
			{type:'addFastTicksOnStart',amount:250},
			{type:'addFastTicksOnResearch',amount:25},
		],
	});
	new G.Achiev({
		tier:2,
		name:'The first choice',
		icon:[11,25,'magixmod'],
		desc:'Spend your all [Worship point]s for the first time to pick Seraphins that your people will worship.',
		effects:[
			{type:'addFastTicksOnStart',amount:100},
		],
	});
		new G.Achiev({
		tier:2,
		name:'Trait-or',
		icon:[12,25,'magixmod'],
		desc:'Manage your wonderful tribe to adopt 50 traits.',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
		],
	});
	/*=====================================================================================
	TECHS
	=======================================================================================*/
	
	new G.ChooseBox({
		name:'research box',
		context:'tech',
		choicesN:4,
getCosts:function()
        {
            let calcCost = (name, constGain = 0.025, rollGain = 0.05) => Math.floor(G.getRes(name).amount * (constGain + this.roll * rollGain))
            if (G.hasNot('Eotm')){
              return { 'insight' : calcCost('wisdom') }
            }
            return { 'insight II' : calcCost('wisdom II'), 'science': calcCost('education', 0.2) }
        },
		getCardCosts:function(what)
		{
			return what.cost;
		},
		getCards:function()
		{
			var choices=[];
			var n=G.tech.length;
			for (var i=0;i<n;i++)
			{
				var tech=G.tech[i];
				if (!G.techsOwnedNames.includes(tech.name) && G.checkReq(tech.req))
				{
					if (tech.chance)
					{
						var chance=randomFloor(tech.chance);
						for (var ii=0;ii<chance;ii++)
						{
							choices.push(tech);
						}
					}
					else choices.push(tech);
				}
			}
			return choices;
		},
		onBuy:function(what,index)
		{
			G.fastTicks+=G.props['fastTicksOnResearch'];
			G.gainTech(what);
			G.Message({type:'good tall',text:'Your people have discovered the secrets of <b>'+what.displayName+'</b>.',icon:what.icon})
			G.update['tech']();
			G.popupSquares.spawn(l('chooseOption-'+index+'-'+this.id),l('techBox').children[0]);
			l('techBox').children[0].classList.add('popIn');
			if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
			{
			var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GainedTech.wav');
			audio.play(); 
			}
		},
		onReroll:function()
		{
			this.roll+=1;
			G.update['tech']();
			G.popupSquares.spawn(l('chooseIgniter-'+this.id),l('chooseBox-'+this.id));
			if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
			{
			var audioReroll = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/TechReroll.wav');
			audioReroll.play();
			}
		},
		onTick:function()
		{
			this.roll-=0.01;
			this.roll=Math.max(this.roll,0);
		},
		buttonText:function()
		{
			var str='';
			if (this.choices.length>0) str+='Reroll';
			else str+='Research';
			var costs=this.getCosts();
			var costsStr=G.getCostString(costs);
			if (costsStr) str+=' ('+costsStr+')';
			return str;
		},
		buttonTooltip:function()
		{
			if (G.hasNot('Eotm')){
			return '<div class="info"><div class="par">'+(this.choices.length==0?'Generate new research opportunities.<br>The cost scales with your <b>Wisdom</b> resource.':'Reroll into new research opportunities if none of the available choices suit you.<br>Cost increases with each reroll, but will decrease again over time.')+'</div><div>Cost : '+G.getCostString(this.getCosts(),true)+'.</div></div>';
			}
			if (G.has('Eotm')){
			return '<div class="info"><div class="par">'+(this.choices.length==0?'Generate new research opportunities.<br>The cost scales with your <b>Wisdom II & Education</b> resources.':'Reroll into new research opportunities if none of the available choices suit you.<br>Cost increases with each reroll, but will decrease again over time.')+'</div><div>Cost : '+G.getCostString(this.getCosts(),true)+'.</div></div>';
			}
		}
	});
	
	
	new G.Tech({
		name:'tribalism',
		desc:'@unlocks [gatherer]@provides 5 [authority]<>Taking its roots in wild animal packs, [tribalism] is the organization of individuals into simple social structures with little hierarchy.',
		icon:[0,1],
		startWith:true,
		effects:[
			{type:'provide res',what:{'authority':5}},
			{type:'show res',what:['influence']},
			{type:'show context',what:['gather']},
		],
	});
	new G.Tech({
		name:'speech',
		desc:'@unlocks [dreamer]@unlocks [wanderer]@provides 50 [wisdom]<>[speech], in its most primitive form, is a series of groans and grunts that makes it possible to communicate things, events, and concepts.',
		icon:[1,1],
		startWith:true,
		effects:[
			{type:'provide res',what:{'wisdom':50}},
			{type:'show res',what:['insight']},
		],
	});
	new G.Tech({
		name:'language',
		desc:'@provides 30 [inspiration]@provides 30 [wisdom]<>[language] improves on [speech] by combining complex grammar with a rich vocabulary, allowing for better communication and the first signs of culture.',
		icon:[2,1],
		cost:{'insight':10},
		req:{'speech':true},
		effects:[
			{type:'provide res',what:{'inspiration':30,'wisdom':30}},
		],
		chance:3,
	});
	
	new G.Tech({
		name:'oral tradition',
		desc:'@unlocks [storyteller]@provides 20 [inspiration]@provides 20 [wisdom]<>[oral tradition] emerges when the members of a tribe gather at night to talk about their day. Stories, ideas, and myths are all shared and passed on from generation to generation.',
		icon:[5,1],
		cost:{'insight':10},
		req:{'language':true},
		effects:[
			{type:'provide res',what:{'inspiration':20,'wisdom':20}},
		],
	});
	
	new G.Tech({
		name:'stone-knapping',
		desc:'@unlocks [artisan]s, which can create [knapped tools]<>[stone-knapping] allows you to make your very first tools - simple rocks that have been smashed against each other to fashion rather crude cleavers, choppers, and hand axes.//Tools have little use by themselves, but may be used in many other industries.',
		icon:[3,1],
		cost:{'insight':5},
		req:{'tribalism':true},
		effects:[
		],
		chance:3,
	});
	
	new G.Tech({
		name:'tool-making',
		desc:'@[artisan]s can now create [stone tools]<>With proper [tool-making], new procedures arise to craft a multitude of specialized tools out of cheap materials - such as hammers, knives, and axes.',
		icon:[4,1],
		cost:{'insight':10},
		req:{'stone-knapping':true,'carving':true},
		effects:[
		],
		chance:3,
	});
	
	new G.Tech({
		name:'basket-weaving',
		desc:'@[artisan]s can now craft [basket]s<>Baskets are a cheap, if flimsy means of storing food.',
		icon:[7,1],
		cost:{'insight':10},
		req:{'tool-making':true},
		effects:[
		],
	});
	
	new G.Tech({
		name:'scouting',
		desc:'@unlocks [scout]s, which can discover new territory<>The [scout] is an intrepid traveler equipped to deal with the unknown.',
		icon:[24,7],
		cost:{'insight':10},
		req:{'tool-making':true,'language':true},
		effects:[
		],
		chance:2,
	});
	new G.Tech({
		name:'canoes',
		//TODO : fishing boats
		desc:'@allows exploring through ocean shores<>',
		icon:[26,7],
		cost:{'insight':15},
		req:{'tool-making':true,'woodcutting':true},
		effects:[
			{type:'allow',what:['shore exploring']},
		],
	});
	new G.Tech({
		name:'boat building',
		//TODO : in the future, boats will be units or resources
		desc:'@allows full ocean exploring<>',
		icon:[28,7],
		cost:{'insight':40},
		req:{'canoes':true,'carpentry':true},
		effects:[
			{type:'allow',what:['ocean exploring']},
		],
	});
	
	new G.Tech({
		name:'sedentism',
		desc:'@unlocks [mud shelter]s and [branch shelter]s@unlocks [lodge]s<>To stay in one place when food is scarce is a bold gamble, especially to those without knowledge of agriculture.',//TODO : this should unlock a policy that lets you switch between nomadism (housing and food storage have no effect) and sedentism (gathering and hunting are much less efficient)
		icon:[8,1],
		cost:{'insight':20},
		req:{'stone-knapping':true,'digging':true,'language':true},
		effects:[
		],
		chance:3,
	});
	new G.Tech({
		name:'building',
		desc:'@unlocks [hut]s@unlocks [stockpile]s (with [stockpiling])<>The [building,Hut] is only slightly more sophisticated than simple shelters, but is more spacious and can withstand wear longer.',
		icon:[9,1],
		cost:{'insight':20},
		req:{'sedentism':true,'tool-making':true},
		effects:[
		],
		chance:3,
	});
	new G.Tech({
		name:'cities',
		desc:'@unlocks [hovel]s<>',
		icon:[29,7],
		cost:{'insight':25},
		req:{'building':true},
		effects:[
		],
	});
	new G.Tech({
		name:'construction',
		desc:'@unlocks [house]s@unlocks [warehouse]s (with [stockpiling])<>',
		icon:[30,7],
		cost:{'insight':30},
		req:{'cities':true,'masonry':true,'carpentry':true,'quarrying':true},
		effects:[
		],
		chance:3,
	});
	new G.Tech({
		name:'city planning',
		desc:'@unlocks [architect]s<>',
		icon:[22,8],
		cost:{'insight':25},
		req:{'construction':true,'cities':true},
		effects:[
		],
	});
	new G.Tech({
		name:'guilds',
		desc:'@unlocks [guild quarters]<>NOTE : useless for now.',
		icon:[23,8],
		cost:{'insight':20},
		req:{'cities':true,'construction':true,'code of law':true},
		effects:[
		],
	});
	new G.Tech({
		name:'stockpiling',
		desc:'@unlocks [storage pit]s<>The foresight to store sustenance and materials ahead of time can make or break a budding civilization.',
		icon:[10,1],
		cost:{'insight':10},
		req:{'sedentism':true},
		effects:[
			{type:'show res',what:['food storage']},
			{type:'show res',what:['material storage']},
		],
		chance:2,
	});
	
	new G.Tech({
		name:'digging',
		desc:'@unlocks [digger]s@paves the way for simple buildings<>The earth is full of riches - to those who can find them.',
		icon:[11,1],
		cost:{'insight':10},
		req:{'stone-knapping':true},
		effects:[
			{type:'show context',what:['dig']},
		],
	});
	new G.Tech({
		name:'well-digging',
		desc:'@unlocks [well]s<>It takes some thinking to figure out that water can be found if you dig deep enough.//It takes a lot of bravery, however, to find out if it is safe to drink.',
		icon:[22,7],
		cost:{'insight':10},
		req:{'digging':true,'sedentism':true,'tool-making':true},
		effects:[
		],
	});
	new G.Tech({
		name:'woodcutting',
		desc:'@unlocks [woodcutter]s<>',//TODO : desc
		icon:[23,5],
		cost:{'insight':10},
		req:{'stone-knapping':true},
		effects:[
			{type:'show context',what:['chop']},
		],
	});
	
	new G.Tech({
		name:'plant lore',
		desc:'@[gatherer]s find more [herb]s and [fruit]s<>The knowledge of which plants are good to eat and which mean certain death is a slow and perilous one to learn.',
		icon:[23,7],
		cost:{'insight':5},
		req:{'oral tradition':true},
		effects:[
		],
	});
	new G.Tech({
		name:'healing',
		desc:'@unlocks [healer]s<>',
		icon:[25,7],
		cost:{'insight':10},
		req:{'plant lore':true,'stone-knapping':true},
		effects:[
		],
		chance:2,
	});
	
	new G.Tech({
		name:'ritualism',
		desc:'@provides 10 [spirituality]@unlocks [soothsayer]s@unlocks some ritual policies<>Simple practices, eroded and polished by time, turn into rites and traditions.',
		icon:[12,1],
		cost:{'culture':5},
		req:{'oral tradition':true},
		effects:[
			{type:'provide res',what:{'spirituality':10}},
		],
	});
	
	new G.Tech({
		name:'symbolism',
		desc:'@[dreamer]s produce 50% more [insight]@[storyteller]s produce 50% more [culture]@[soothsayer]s produce 50% more [faith]<>The manifestation of one thing for the meaning of another - to make the cosmos relate to itself.',
		icon:[13,1],
		cost:{'culture':10,'insight':10},
		req:{'oral tradition':true},
		effects:[
		],
	});
	
	new G.Tech({
		name:'burial',
		desc:'@unlocks [grave]s@exposed [corpse]s make people even more unhappy<>It is the belief that there might be more to death than is first apparent that drives us to bury our deceased.',
		icon:[14,1],
		cost:{'insight':5},
		req:{'ritualism':true,'digging':true},
		effects:[
		],
		chance:2,
	});
	
	new G.Tech({
		name:'hunting',
		desc:'@unlocks [hunter]s<>It is a common tragedy that a creature should die so that another may survive.',
		icon:[15,1],
		cost:{'insight':5},
		req:{'language':true,'tribalism':true},
		effects:[
			{type:'show context',what:['hunt']},
		],
	});
	
	new G.Tech({
		name:'fishing',
		desc:'@unlocks [fisher]s<>Fishing is more than simply catching fish; it involves knowing where the fish like to gather and which ones are good to eat.//It would be wise to check whether any of your territory contains fish before investing in this technology.',
		icon:[25,1],
		cost:{'insight':5},
		req:{'tribalism':true},
		effects:[
			{type:'show context',what:['fish']},
		],
	});
	
	new G.Tech({
		name:'bone-working',
		desc:'@[artisan]s can now make [knapped tools] out of [bone]@[bone]s can now be used as [archaic building materials]<>',
		icon:[22,5],
		cost:{'insight':5},
		req:{'stone-knapping':true},
		effects:[
			{type:'make part of',what:['bone'],parent:'archaic building materials'},
		],
	});
	
	new G.Tech({
		name:'spears',
		displayName:'Spears and maces',
		desc:'@[artisan]s can now craft [stone weapons]@unlocks new modes for [hunter]s and [fisher]s<>Using tools as weapons opens a world of possibilities, from hunting to warfare.',
		icon:[26,1],
		cost:{'insight':10},
		req:{'tool-making':true},
	});
	new G.Tech({
		name:'bows',
		desc:'@[artisan]s can now craft [bow]s@unlocks new modes for [hunter]s<>',//TODO : desc
		icon:[27,1],
		cost:{'insight':20},
		req:{'spears':true},
	});
	new G.Tech({
		name:'fishing hooks',
		desc:'@unlocks new modes for [fisher]s<>',//TODO : desc
		icon:[28,1],
		cost:{'insight':15},
		req:{'fishing':true,'spears':true},
	});
	
	new G.Tech({
		name:'fire-making',
		desc:'@unlocks [firekeeper]s<>Fire keeps you warm and makes animal attacks much less frequent.',
		icon:[16,1],
		cost:{'insight':15},
		req:{'stone-knapping':true},
		effects:[
		],
		chance:3,
	});
	
	new G.Tech({
		name:'cooking',
		desc:'@[firekeeper]s can now cook [cooked meat] and [cooked seafood]<>Tossing fish and meat over a sizzling fire without reducing them to a heap of ash takes a bit of practice.',
		icon:[17,1],
		cost:{'insight':10},
		req:{'fire-making':true},
	});
	new G.Tech({
		name:'curing',
		desc:'@[firekeeper]s can now prepare [cured meat] and [cured seafood] with [salt], which last much longer<>Storing food with special preparations seems to ward off rot, and comes along with the advent of delicious jerky.',
		icon:[27,7],
		cost:{'insight':15},
		req:{'cooking':true,'stockpiling':true},
	});
	
	new G.Tech({
		name:'sewing',
		desc:'@unlocks [clothier]s, who work with fabric and can sew [primitive clothes]<>',//TODO : desc
		icon:[29,1],
		cost:{'insight':10},
		req:{'tool-making':true},
		effects:[
		],
	});
	new G.Tech({
		name:'weaving',
		desc:'@[clothier]s can now sew [basic clothes]<>',
		icon:[30,1],
		cost:{'insight':20},
		req:{'sewing':true},
	});
	new G.Tech({
		name:'leather-working',
		desc:'@[clothier]s can now cure [hide]s into [leather] and use leather in cloth-making (with [weaving])<>',
		icon:[31,1],
		cost:{'insight':20},
		req:{'sewing':true},
	});
	
	new G.Tech({
		name:'smelting',
		desc:'@unlocks [furnace]s, which turn ore into metal ingots@unlocks [blacksmith workshop]s, which forge metal ingots into metal goods<>',//TODO : desc
		icon:[26,5],
		cost:{'insight':30},
		req:{'fire-making':true,'building':true},
		effects:[
		],
	});
	
	new G.Tech({
		name:'bronze-working',
		desc:'@[furnace]s can now make [hard metal ingot]s from [copper ore] and [tin ore]<>',//TODO : desc
		icon:[28,5],
		cost:{'insight':30},
		req:{'smelting':true},
		effects:[
		],
	});
	new G.Tech({
		name:'iron-working',
		desc:'@[furnace]s can now make [hard metal ingot]s from [iron ore]<>',//TODO : desc
		icon:[27,5],
		cost:{'insight':30},
		req:{'smelting':true},
		effects:[
		],
	});
	new G.Tech({
		name:'gold-working',
		desc:'@[furnace]s can now make [precious metal ingot]s from [gold ore]@[blacksmith workshop]s can now forge [gold block]s out of [precious metal ingot]s<>',//TODO : desc
		icon:[29,5],
		cost:{'insight':40},
		req:{'smelting':true},
		effects:[
		],
	});
	new G.Tech({
		name:'steel-making',
		desc:'@[furnace]s can now make [strong metal ingot]s from [iron ore] and [coal]<>',//TODO : desc
		icon:[30,5],
		cost:{'insight':40},
		req:{'iron-working':true},
		effects:[
		],
	});
	
	new G.Tech({
		name:'chieftains',
		desc:'@unlocks [chieftain]s, which generate [influence]@provides 5 [authority]<>',//TODO : desc
		icon:[22,6],
		cost:{'insight':10},
		req:{'oral tradition':true},
		effects:[
			{type:'provide res',what:{'authority':5}},
		],
	});
	new G.Tech({
		name:'clans',
		desc:'@unlocks [clan leader]s, which generate [influence]@provides 5 [authority]<>',//TODO : desc
		icon:[23,6],
		cost:{'insight':25},
		req:{'chieftains':true,'code of law':true},
		effects:[
			{type:'provide res',what:{'authority':5}},
		],
	});
	new G.Tech({
		name:'code of law',
		desc:'@provides 15 [authority]@political units generate more [influence]<>',//TODO : desc
		icon:[24,6],
		cost:{'insight':20},
		req:{'symbolism':true,'sedentism':true},
		effects:[
			{type:'provide res',what:{'authority':15}},
		],
	});
	
	new G.Tech({
		name:'mining',
		desc:'@unlocks [mine]s<>Strike the earth!',
		icon:[24,5],
		cost:{'insight':20},
		req:{'digging':true,'building':true},
		effects:[
			{type:'show context',what:['mine']}
		],
	});
	new G.Tech({
		name:'prospecting',
		desc:'@[mine]s can now be set to mine for specific ores',
		icon:[25,5],
		cost:{'insight':35},
		req:{'mining':true},
		effects:[
		],
	});
	
	new G.Tech({
		name:'quarrying',
		desc:'@unlocks [quarry,Quarries]<>',
		icon:[25,6],
		cost:{'insight':20},
		req:{'digging':true,'building':true},
		effects:[
			{type:'show context',what:['quarry']}
		],
	});
	
	new G.Tech({
		name:'carving',
		desc:'@unlocks [carver]s, which can produce a variety of goods out of stone, wood and bone@may lead to the knowledge of better tools<>',
		icon:[26,6],
		cost:{'insight':5},
		req:{'stone-knapping':true},
		effects:[
		],
		chance:3,
	});
	
	new G.Tech({
		name:'gem-cutting',
		desc:'@[carver]s can now make [gem block]s out of [gems]<>',//TODO : desc
		icon:[27,6],
		cost:{'insight':20},
		req:{'carving':true,'tool-making':true},
		effects:[
		],
	});
	
	new G.Tech({
		name:'pottery',
		desc:'@unlocks [potter]s, which produce goods such as [pot]s out of [clay] and [mud]@unlocks [granary,Granaries] (with [stockpiling])@[digger]s find more [clay]<>',
		icon:[28,6],
		cost:{'insight':20},
		req:{'fire-making':true,'digging':true,'tool-making':true},
		effects:[
		],
	});
	new G.Tech({
		name:'masonry',
		desc:'@unlocks [kiln]s, which produce a variety of goods such as [brick]s@[carver]s can now turn [stone]s into [cut stone] slowly<>',
		icon:[29,6],
		cost:{'insight':35},
		req:{'building':true,'pottery':true},
		effects:[
		],
	});
	new G.Tech({
		name:'carpentry',
		desc:'@unlocks [carpenter workshop]s, which can process [log]s into [lumber] and produce wooden goods@unlocks [barn]s (with [stockpiling])<>',
		icon:[30,6],
		cost:{'insight':35},
		req:{'building':true,'woodcutting':true},
		effects:[
		],
	});
	
	new G.Tech({
		name:'monument-building',
		desc:'@unlocks the [mausoleum], an early wonder<>',
		icon:[24,8],
		cost:{'insight':90,'culture':40},
		req:{'construction':true,'burial':true,'belief in the afterlife':true},
		effects:[
		],
	});
	//MAGIX
	new G.Tech({
		name:'Wizardry',
		desc:'@ [Archaic wizard]s will start their existence .They behave weird. Here wizardry and essences will start to appear. Essences are not naturally generated so they consume mana to be made.',
		icon:[5,3,'magixmod'],
		cost:{'insight':75,'faith':5},
		req:{'well-digging':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
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
		req:{'city planning':true,'cities':true,'construction':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
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
		desc:'Use limestone and water to craft a concrete, an [advanced building materials,Advanced building material].',
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
		effects:[
			{type:'hide res',what:['Plain Island emblem']},
		],
		req:{'<span style="color: #E0CE00">Plain island portal</span>':true,'<span style="color: ##FF0900">Plain island building</span>':true},
	});
		new G.Tech({
		name:'Sewing II',
		displayName:'Weaving II', //Correct
		desc:'Upgrades sewing skills of your civilization. @Unlocks <b>Drying racks<b> to make [Dried leather] used to craft better quality clothing. @Now artisans can sew [Fishing net] @Clothier can craft [Thread] that is required to craft a [Fishing net].',
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
		name:'Deeper wells',
		desc:'@[well]s provide 5% more water.',
		icon:[31,15,'magixmod'],
		cost:{'insight':490,'wisdom':30},
		req:{'Farms in the new land':true},
	});
		new G.Tech({
		name:'prospecting II',
		desc:'@[mine]s can now dig in search of [nickel ore,Nickel] or focus to mine [Various stones] with 3x efficiency instead of any prospected mineral.',
		icon:[11,12,'magixmod'],
		cost:{'insight':270},
		req:{'prospecting':true,'mining':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
	});
		new G.Tech({
		name:'quarrying II',
		desc:'@[quarry] can now dig for [Various cut stones] by new special mode. @<b>"Advanced quarry stone" mode and "Quarry other stones mode(non advanced)" has 1.7% chance to gain 6 to 13 [platinum ore]s .',
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
		req:{'city planning':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
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
		effects:[
			{type:'hide res',what:['Paradise emblem']},
		],
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
		desc:'Multiplies amount of [Paper] crafted in shacks by 40%. If you go into moderating culture you obtain additional 8%, while in caretaking path just 4%.',
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
		desc:'Makes [Fortress of cultural legacy] increase power of [culture,cultural units] per tick.',
		icon:[22,17,'magixmod'], 
		cost:{'insight':70,'Fortress construction point':200},
		req:{'Cultural roots':true},
	});
		new G.Tech({
		name:'Politic power rising up',
		desc:'Makes [Pagoda of Democracy] increase power of [influence,influence gathering units] per tick. Increases gaining of [influence,political] units by 5% for the rest of current run.',
		icon:[21,17,'magixmod'], 
		cost:{'insight':25,'Pagoda construction point':200},
		req:{'Political roots':true},
	});
		new G.Tech({
		name:'Knowledgeable',
		desc:'Makes [Complex of Dreamers] increase power of [insight,insight gatherers(dreamers)] per tick. In addition adds 7500 [housing] . Let it have something from the [Wizard Complex]',
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
		new G.Tech({
		name:'Improved furnace construction',
		desc:'People figured a way to make a [furnace] produce more at the same costs of run and upkeep. <>This technology will give you bonus depending on path your people have chosen. <>If they have chosen [<font color="maroon">Moderation</font>] then [furnace]s will work 20% more efficient. <>If they have chosen [<font color="maroon">Caretaking</font>] then [furnace]s will work 10% more efficient.',
		icon:[1,18,'magixmod'], 
		cost:{'insight':1000},
		req:{'culture of the afterlife':true}
	});
		new G.Tech({
		name:'Focused gathering',
		desc:'[gatherer]s were always thinking that they can gather more. This tech is another chance for them. <>This technology will give you bonus depending on path your people have chosen. <>If they have chosen [<font color="maroon">Moderation</font>] then [gatherer]s will gather 7.5% more. <>If they have chosen [<font color="maroon">Caretaking</font>] then [gatherer]s will work 12.5% more.',
		icon:[2,18,'magixmod'], 
		cost:{'insight':1000},
		req:{'culture of the afterlife':true}
	});
		new G.Tech({
		name:'Bigger fires',
		desc:'[firekeeper]s figured out how to make bigger fires. They will need to use more [stick]s but most important thing is that there will be profit <>This technology will give you bonus depending on path your people have chosen. <>If they have chosen [<font color="maroon">Moderation</font>] then [firekeeper]s will work 5% more efficient. <>If they have chosen [<font color="maroon">Caretaking</font>] then [firekeeper]s will work 8% more efficient.',
		icon:[3,18,'magixmod'], 
		cost:{'insight':1000},
		req:{'culture of the afterlife':true}
	});
		new G.Tech({
		name:'Motivation for artisans',
		desc:'[artisan]\'s succesful work made him work harder and motivated. <>This technology will give you bonus depending on path your people have chosen. <>If they have chosen [<font color="maroon">Moderation</font>] then [artisan]s will work 8% more efficient. <>If they have chosen [<font color="maroon">Caretaking</font>] then [artisan]s will work 4% more efficient. <>Doesn\'t include [artisan of juice] and [Pyro-Artisan] !',
		icon:[4,18,'magixmod'], 
		cost:{'insight':1000},
		req:{'culture of the afterlife':true}
	});
	//Back to normal :)
		new G.Tech({
		name:'Advanced casting',
		desc:'[blacksmith workshop,Blacksmiths] will get taught to be more exact and better due to changing times. Now they may craft basic industry gear and other things which they wouldn\'t craft without this knowledge.',
		icon:[5,18,'magixmod'], 
		cost:{'insight':830},
		req:{'smelting':true,'masonry':true,'monument-building II':true},
	});
		new G.Tech({
		name:'Automation',
		desc:'Moderation is a path where people are going for automation to produce more and do less. So people are figuring out the ways to automate production. This tech will be a light for moderated people.',
		icon:[6,18,'magixmod'], 
		cost:{'insight':1000,'wisdom':15,'inspiration':5,'culture':80,'influence':205},
		req:{'Second portal to new world':true,'<font color="maroon">Moderation</font>':true}
	});
		new G.Tech({
		name:'Manufacturing',
		desc:'Caretaking is a path where people are going for live long and they do not care about production and automation. They rather manual working at all. This tech is a beginning of manufacture.',
		icon:[7,18,'magixmod'], 
		cost:{'insight':1000,'wisdom':15,'inspiration':10,'culture':75,'influence':205},
		req:{'Second portal to new world':true,'<font color="maroon">Caretaking</font>':true}
	});
		new G.Tech({
		name:'Moderated workstation planning',
		desc:'People lead by [<font color="maroon">Moderation</font>] want exact plans of building. It leads to construct more advanced constructions that can work better than single [potter] for instance.',
		icon:[11,18,'magixmod'], 
		cost:{'insight':995,'wisdom':5},
		req:{'Paradise crafting':true,'<font color="maroon">Moderation</font>':true,'Measuring system':true}
	});
		new G.Tech({
		name:'workstation planning',
		desc:'People lead by [<font color="maroon">Caretaking</font>] do not need exact plans of building. They are interested in how many people it needs and where components will be arranged without super exact descriptions.',
		icon:[12,18,'magixmod'], 
		cost:{'insight':995,'wisdom':5},
		req:{'Paradise crafting':true,'<font color="maroon">Caretaking</font>':true,'Measuring system':true}
	});
		new G.Tech({
		name:'Manufacture units I',
		desc:'Unlocks [Hut of potters] and [Hovel of colours]. Their work can be controlled by policies if unlocked.<> <font color="#ff8080">Note: If you will obtain the tech [potter]s , [artisan]s on <b>Craft dyes set (1,2,3,4)</b> mode will become USELESS! They won\'t produce.</font> ',
		icon:[17,18,'magixmod'], 
		cost:{'insight':750,'wisdom':5,'stone':1365},//Stones are there to make tech at same level as Factories I
		req:{'workstation planning':true,'Manufacturing':true}
	});
		new G.Tech({
		name:'Factories I',
		desc:'Unlocks [Factory of pots] and [Leather factory]. Their work can be controlled by policies if unlocked.<> <font color="#ff8080">Note: If you will obtain the tech [potter]s , [clothier]s on <b>Craft leather</b> and <b>Craft leather (cheap)</b> mode and [Drying rack]s will become USELESS! They won\'t produce.</font> ',
		icon:[18,18,'magixmod'], 
		cost:{'insight':750,'wisdom':5},
		req:{'Moderated workstation planning':true,'<font color="maroon">Moderation</font>':true}
	});
		new G.Tech({
		name:'Production rates influence',
		desc:'Allows to control production expenditures for [Manufacture units I,Manufacture units] (if unlocked) or [Factories I,Factories] (if unlocked)',
		icon:[16,18,'magixmod'], 
		cost:{'insight':795,'wisdom':5,'influence':175,'authority':10},
		req:{'Second portal to new world':true,'Better influence & authority':true}
	});
		new G.Tech({
		name:'Third passage to new world',
		desc:'May unlocking mysterious [New world] begin',
		icon:[12,19,'magixmod'], 
		cost:{'insight':785,'wisdom':5,'influence':175,'authority':10,'spirituality':25},
		req:{'An opposite side of belief':true}
	});
		new G.Tech({
		name:'Underworld building 1/2',
		desc:'Allows to build some stuff in Underworld. Starts attracting 6 random <font color="red"><b>Devil\'s traits</b></font>',
		icon:[27,3,'magixmod',14,19,'magixmod'], 
		cost:{'insight':90,'New world point':400},
		req:{'Third passage to new world':true,'A feeling from the Underworld':true}
	});
		new G.Tech({
		name:'Underworld building 2/2',
		desc:'Allows to build some stuff in Underworld.',
		icon:[27,2,'magixmod',14,19,'magixmod'], 
		cost:{'insight':100,'New world point':6,'Underworld emblem':1},
		req:{'Third passage to new world':true,'A feeling from the Underworld':true,'Underworld building 1/2':true}
	});
		new G.Tech({
		name:'Laws of physics(intermediate)',
		desc:'Provides 5 [education] @People\'s understanding of physics and anomalies in reality increases. Advances the [Laws of physics(basic),laws of physics] research.',
		icon:[21,19,'magixmod'],
		cost:{'insight':1009,'science':4,'culture':100},
		effects:[
			{type:'provide res',what:{'education':5}},
		],
		req:{'Laws of physics(basic)':true,'Will to know more':true,'Underworld building 2/2':true},
	});
		new G.Tech({
		name:'Even mo\' floorz',
		desc:'[Blockhouse]s will have a 7th and <b>8th</b> floor which will allow 20 more people per blockhouse, increasing it\'s total capacity to 80.',
		icon:[16,19,'magixmod'],
		cost:{'insight II':30,'science':5,'culture II':5},
		req:{'Laws of physics(intermediate)':true,'Mo\' floorz':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Berry masterry',
		desc:'Doubles efficiency of [Berry farm] . Compounds with previous multipliers.',
		icon:[27,19,'magixmod'],
		cost:{'insight II':24,'faith II':1},
		req:{'Eotm':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Moderated carpentry',
		desc:'[carpenter workshop] is more expensive but its production is multiplied by 2.25 . <>Applies visual changes to Paradise and normal [carpenter workshop]s <>Boosts both types. ',
		icon:[29,16,'magixmod'], 
		cost:{'insight II': 10},
		req:{'<font color="maroon">Moderation</font>':true,'Eotm':true,'Oil-digging':true}
	});
		new G.Tech({
		name:'Richer language',
		desc:'Language they use for everyday life will become even more richer. Synonyms for basic words, neologisms and many more. This is some sign of wisdom isn\'t it? @provides 10 [wisdom II]',
		icon:[27,7,'magixmod'],
		cost:{'insight II':15},
		req:{'Eotm':true,'language':true},
		effects:[
			{type:'provide res',what:{'wisdom II':10}},
		],
	});
		new G.Tech({
		name:'Improved rhetoric',
		desc:'People will use more words while talking. They will do their best to make the language and vocabulary survive through next generations. @Provides 10 [wisdom II] @Provides 5 [inspiration II]',
		icon:[27,8,'magixmod'],
		cost:{'insight II':15},
		req:{'Eotm':true,'Richer language':true,'speech':true},
		effects:[
			{type:'provide res',what:{'wisdom II':10}},
			{type:'provide res',what:{'inspiration II':5}},
		],
	});
		new G.Tech({
		name:'code of law II',
		desc:'The [code of law] will get more exact and more liberal. People will be full of hope if for example some burglar will rob them... this new [code of law] gives a hope that the burglar will be punished. @provides 3 [authority II]',
		icon:[27,6,'magixmod'],
		cost:{'insight II':10,'influence II':4,'culture II':6},
		req:{'Eotm':true,'Richer language':true,'code of law':true},
		effects:[
			{type:'provide res',what:{'authority II':3}},
		],
	});
		new G.Tech({
		name:'weaving II',
		displayName:'Sewing II', //Correct
		desc:'@[clothier]s, can sew [hardened clothes] (with [Sewing III] ) Requirements for this clothing type are: pieces of [Dried leather] and bunch of [Thread]<>',
		icon:[27,9,'magixmod'],
		cost:{'insight II':10,'insight':65},
		req:{'weaving':true,'Sewing II':true,'Eotm':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Sewing III',
		displayName:'Weaving III', //Correct
		desc:'Upgrades sewing skills of your civilization. @[clothier]s can craft [hardened clothes] while they learned how to weave better, longer-durable clothing.',
		icon:[27,12,'magixmod'], 
		cost:{'insight II':20,'insight':20},
		req:{'Wizardry':true,'Sewing II':true,'weaving II':true,'Eotm':true},
	});
		new G.Tech({
		name:'Magical soil',
		desc:'People can craft a new type of soil using the one from Plain Island. On this new soil people will be able to plant a  magic plants that can gather [Magic essences] for you . Uses same amount of [Land of the Plain Island,land] as other farms that were in Plain Island but this one except [water] upkeep has [Mana] and [Magic essences,essence that you are going to farm] .',
		icon:[27,18,'magixmod'], 
		cost:{'insight II':14,'science':1},
		req:{'Wizardry':true,'Eotm':true},
	});
		new G.Tech({
		name:'Seed-enchanting',
		desc:'@unlocks new mode for [artisan] that allows him to enchant [Beet seeds,seeds] making them become [Essenced seeds,essenced] . Planting and taking care about them can make you plant magic plants that will help you gathering essences.',
		icon:[27,17,'magixmod'], 
		cost:{'insight II':14,'science':1},
		req:{'Eotm':true,'Magical soil':true},
	});
		new G.Tech({
		name:'ritualism II',
		desc:'@provides 3 [spirituality II] @[wisdom rituals] and [flower rituals] can be activated again but these rituals will require [faith II] as upkeep and cost instead of [faith] <>Simple practices, eroded and polished by long time, turn into rites and traditions. Straight from the heart to the gods.',
		icon:[27,5,'magixmod'],
		cost:{'culture II':5,'faith II':2,'insight II':10,'influence II':2,'faith':6},
		req:{'oral tradition':true,'ritualism':true,'Eotm':true,'Improved rhetoric':true},
		effects:[
			{type:'provide res',what:{'spirituality II':3}},
		],
	});
		new G.Tech({
		name:'Fertlizer for grain',
		desc:'Multiplies efficiency of all [wheat,wheat-based] units like [Bakery] , [Wheat farm] and [Windmill] by 1.5 .',
		icon:[27,4,'magixmod'],
		cost:{'insight II':30},
		req:{'Magical soil':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Smokers & Windferns',
		desc:'Unlocks new farms for Plain Island. At these farms you can farm [Fire essence] and [Wind essence] out of plants that needs\'em . People gain their seeds, petals and then disenchant it gaining desired essence.',
		icon:[27,16,'magixmod'],
		cost:{'insight II':12,'faith II':1,'culture II':2},
		req:{'Magical soil':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Withering tulips & Watorchids',
		desc:'Unlocks new farms for Plain Island. At these farms you can farm [Dark essence] and [Water essence] out of plants that needs\'em . People gain their seeds, petals and then disenchant it gaining desired essence.',
		icon:[27,15,'magixmod'],
		cost:{'insight II':8,'faith II':1,'culture II':1},
		req:{'Magical soil':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Lightlily & Naturdaisy',
		desc:'Unlocks new farms for Plain Island. On them you can farm [Lightning essence] and [Nature essence] out of plants that needs\'em . People gain their seeds, petals and then disenchant it gaining desired essence.',
		icon:[27,14,'magixmod'],
		cost:{'insight II':12,'faith II':1,'culture II':2},
		req:{'Magical soil':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Holy roses farm',
		desc:'Unlocks [Essence of the Holiness] farm for Plain Island. There people plant a seeds of the <b>Holy rose</b> that grows and emitates some light (like a firefly). People gain their seeds, petals and then disenchant it gaining desired essence.',
		icon:[27,13,'magixmod'],
		cost:{'insight II':8,'faith II':1,'culture II':1},
		req:{'Magical soil':true},
		effects:[
		],
	});

		
	
	/*=====================================================================================
	TRAITS
	These are like techs. And that makes'em have same id set as techs
	=======================================================================================*/
	//chances are evaluated every day and represent how many years (on average) it takes to randomly discover them once they fulfill the requirements
	
	new G.Trait({
		name:'scavenging',
		desc:'@idle [worker]s gather resources with a tenth of the efficiency of a [gatherer]',
		icon:[20,1],
		chance:1,
		req:{'tribalism':true},
	});
	new G.Trait({
		name:'rules of food',
		desc:'@unlocks policies that manage which food types can be eaten',
		icon:[19,1],
		chance:1,
		req:{'tribalism':true},
		//TODO
	});
	new G.Trait({
		name:'ground stone tools',
		desc:'@[artisan]s and [carver]s craft 20% faster',
		icon:[4,1],
		cost:{'insight':3},
		chance:10,
		req:{'stone-knapping':true/*,'some future tool tech':false (TODO)*/},
	});
	new G.Trait({
		name:'artistic thinking',
		desc:'@[storyteller]s are 30% more efficient@opens the way for more art forms',
		icon:[12,1],
		cost:{'culture':5},
		chance:10,
		req:{'symbolism':true},
	});
	//TODO : how these interact with techs such as symbolism, ritualism and burial
	new G.Trait({
		name:'fear of death',
		desc:'@unhappiness from death is doubled@may evolve into more complex spiritual thinking',
		icon:[18,1],
		cost:{'culture':5},
		chance:10,
		req:{'language':true},
	});
	new G.Trait({
		name:'belief in the afterlife',
		desc:'@unhappiness from death is halved',
		icon:[21,1],
		cost:{'culture':5,'faith':2},
		chance:10,
		req:{'fear of death':true,'oral tradition':true},
	});
	new G.Trait({
		name:'belief in revenants',
		desc:'@unhappiness from unburied [corpse]s is doubled',
		icon:[18,1],
		cost:{'culture':5,'faith':2},
		chance:100,
		req:{'belief in the afterlife':true},
	});
	new G.Trait({
		name:'ritual necrophagy',
		desc:'@[corpse]s are slowly turned into [meat] and [bone]s, creating some [faith] but harming [health]',
		icon:[18,1],
		cost:{'culture':5},
		chance:500,
		req:{'tribalism':true,'ritualism':true},
	});
	new G.Trait({
		name:'culture of moderation',
		desc:'@people consume 15% less [food], but derive less joy from eating',
		icon:[3,12,19,1],
		cost:{'culture':5},
		chance:50,
		req:{'tribalism':true,'joy of eating':false},
	});
	new G.Trait({
		name:'joy of eating',
		desc:'@people consume 15% more [food], but are happier when eating',
		icon:[4,12,19,1],
		cost:{'culture':5},
		chance:50,
		req:{'tribalism':true,'culture of moderation':false},
	});
	new G.Trait({
		name:'insect-eating',
		desc:'@your people are no longer unhappy when eating [bugs]',
		icon:[8,11,22,1],
		chance:5,
		req:{'insects as food':'on'},
		effects:[
			{type:'function',func:function(){G.getDict('bugs').turnToByContext['eating']['happiness']=0.03;}},
		],
	});
	//MAGIX
		new G.Trait({
		name:'Belief in portals',
		desc:'@Makes wizards attempting to create a new dimension',
		icon:[2,1,'magixmod'],
		cost:{'culture':30,'faith':3},
		chance:10,
		req:{'belief in the afterlife':true,'Wizard complex':true},
	});
		new G.Trait({
		name:'Will to know more',
		desc:'<span style="color: #aaffff">@After opening a portal to Plain Island people started to become more curious. @Curiosity has gotten even stronger with this trait. </span>',
		icon:[8,12,8,5],
		cost:{'culture':5,'wisdom':25},
		chance:3,
		category:'knowledge',
		req:{'<span style="color: ##FF0900">Plain island building</span>':true},
	});
		new G.Trait({
		name:'Juicy expertise',
		desc:'<span style="color: #aaffff">After few years since you started crafting [Juices] you noticed your people make most <b>tasty juice<b> ever you drank. Since gaining this trait you\'ll get these bonuses: @Happiness caused by drinking juices boosted by 25%. @Health given by drinking juices boosted by 25%. @Due to these bonuses [Juices] will now need little bit more ingredients to craft. @[artisan of juice] has a small chance to craft 1 additional [Juices,juice]. </span>',
		icon:[16,5,'magixmod'],
		cost:{'Juices':6.5e3,'wisdom':25,'insight':30},
		chance:6,
		category:'knowledge',
		req:{'Crafting a juice':true},
	});
		new G.Trait({
		name:'Nutrition',
		desc:'Your dreamers were thinking once how to make eating more healthy. Then they share its thoughts. Surprisingly they were right. People got healthier, feel better. @This trait makes [healer] generate health. People won\'t eat even more food so do not worry.',
		icon:[16,7,'magixmod'],
		cost:{'culture':150,'wisdom':25,'insight':100,'influence':10},
		chance:120,
		req:{'joy of eating':true,'Crafting a juice':true},
	});
		new G.Trait({
		name:'More healing ways',
		desc:'<span style="color: #aaffff">Since moment you got able to hire [healer] your dreamers started thinking how to boost healing and decrease amount of failed healing attempts. @This trait unlocks you [first aid], which will be obtainable in later stage of legacy. </span>',
		icon:[8,12,3,5],
		cost:{'insight':50},
		chance:120,
		category:'knowledge',
		req:{'healing':true,'Will to know more':true},
	});
		new G.Trait({
		name:'<span style="color: red">Revenants</span>',//InDevelopment
		desc:'<span style="color: #E13700">The dark powers got mad that your people are using [corpse,corpses] as a toy or ritual thing. Since now some of them will come back to live but they will behave like zombie. Do not worry they won\'t replicate. You will need to defend your people against them. Each one will harm your [happiness] and kill your [population,people]. ',
		icon:[19,0,'magixmod'],
		cost:{'insight':50,'corpse':500},
		chance:500,
		category:'long',
		req:{'belief in revenants':true,'ritual necrophagy':true},
	});
		new G.Trait({
		name:'culture of the afterlife',
		desc:'<b>Believements have turned into the culture. People will now try to be closer to gods or god they worship, Who knows if they will build another wonder</b>. @unhappiness from death is halved. ',
		icon:[19,1,'magixmod'],
		cost:{'insight':50,'culture':200,'inspiration':20,'authority':20,'spirituality':30,'faith':40},
		chance:500,
		req:{'belief in the afterlife':true},
	});
		new G.Trait({
		name:'The God\'s call',
		desc:'<b>The god... he called your people... to his world... full of hopes... full of new adventures... to... his... Paradise...',
		icon:[20,2,'magixmod'],
		cost:{'insight':650,'culture':200,'inspiration':20,'authority':20,'spirituality':30,'faith':40},
		chance:175,
		req:{'culture of the afterlife':true},
	});
		new G.Trait({
		name:'Moderated politics',
		desc:'Makes politics more moderated. It may boost happiness of people and with same power make it drop down.',//Next update: something which will require this trait
		icon:[8,13,'magixmod'],
		cost:{},
		chance:175,
		req:{'culture of moderation':true},
	});
		new G.Trait({
		name:'Land acknowledge',
		desc:'Your people will easier acknowledge with any new lands thanks to Paradise exploration. This trait does not add any bonuses.',
		icon:[21,10,'magixmod'],
		cost:{},
		chance:100,
		req:{'Second portal to new world':true},
	});
		new G.Trait({
		name:'Treeplanting',
		desc:'<span style="color: #aaffff">May begin the orchards existence. </span>',
		icon:[8,12,6,1],
		cost:{'insight':250,'wisdom':15},
		chance:100,
		category:'knowledge',
		req:{'Second portal to new world':true,'<span style="color: ##FF0900">Paradise building</span>':true},
	});
		new G.Trait({
		name:'Cooking',
		desc:'<span style="color: #aaffff">Better food will make people even happier. Unlocks [Chef,cheves] who will do even better food out of other food ingredients. </span>',
		icon:[8,12,22,10,'magixmod'],
		cost:{'insight':250,'wisdom':15,'authority':50},
		chance:300,
		category:'knowledge',
		req:{'Second portal to new world':true,'<span style="color: ##FF0900">Paradise building</span>':true},
	});
		new G.Trait({
		name:'<span style="color: yellow">Culture of celebration</span>',
		desc:'Unlocks seasonal content. <b><span style="color: aqua">Seasonal content is a content available for some time like Christmas content. Currently added events: Xmas, New year eve, halloween, Valentine day.</span></b>',
		icon:[18,15,'magixmod'],
		cost:{'insight':10,'culture':40},
		chance:100,
		req:{'artistic thinking':true},
	});
		new G.Trait({
		name:'Supreme healthy life',
		desc:'Intelligent people came with doctrines of healthier life. Then they shared their thoughts. Surprisingly they were right. People got even healthier, feel even better. @This trait makes [health] generated per each person. Each person will add some [health]. People won\'t eat even more food so do not worry. Better version of [Healthy life] . Can\'t occur if you get this worse one, because [Healthy life] is not from joy, it is from moderation',
		icon:[22,0,'magixmod'],
		cost:{'culture':150,'insight':100,'influence':15},
		chance:120,
		req:{'joy of eating':true,'Nutrition':true,'Healthy life':false},
	});
		new G.Trait({
		name:'Healthy life',
		desc:'Intelligent people came with doctrines of healthier life, all because of moderation. Then they shared their thoughts. Surprisingly they were right but wasn\'t happy in rules of moderation. People got even healthier, feel even better. @This trait makes [health] generated per each person. Each person will add some [health]. People won\'t eat even more food so do not worry. Has its better version which can\'t occur if you get this worse one, because [Healthy life] is not from joy, it is from moderation',
		icon:[22,1,'magixmod'],
		cost:{'culture':150,'insight':100,'influence':15},
		chance:330,
		req:{'culture of moderation':true},
	});
		new G.Trait({
		name:'Political roots',
		desc:'Your people seem like they want political things go with old traditions. @Unlocks [Pagoda of Democracy] a political wonder.',
		icon:[20,17,'magixmod'],
		cost:{'influence':200},
		chance:1050,
		req:{'Will to know more':true,'Cultural roots':false,'Roots of insight':false},
		category:'main'
	});
		new G.Trait({
		name:'Cultural roots',
		desc:'Your people seem like they cultivate traiditions born at their generation and share\'em to future times. @Unlocks [Fortress of cultural legacy] a cultural wonder.',
		icon:[19,17,'magixmod'],
		cost:{'culture':500},
		chance:1050,
		req:{'Will to know more':true,'Political roots':false,'Roots of insight':false},
		category:'main'
	});
		new G.Trait({
		name:'Roots of insight',
		desc:'Your people seem like they are born for discoveries. @Unlocks [Complex of Dreamers] a  wonder of insight.',
		icon:[18,17,'magixmod'],
		cost:{'wisdom':100},
		chance:1050,
		req:{'Will to know more':true,'Cultural roots':false,'Political roots':false},
		category:'main'
	});
	//God's traits
		new G.Trait({
		name:'God\'s trait #1 Housing',
		desc:'Less capable construction obtains small housing bonus with that trait. <b>Bonuses:</b> @[hovel] +1 [housing] every 2 [hovel]s , @[hut] , [bamboo hut] + 1 [housing] to every [hut] & [bamboo hut] same with [branch shelter] , [mud shelter]',
		icon:[21,14,'magixmod'],
		cost:{},
		chance:275,
		req:{'The God\'s call':true,'7th essence':true},
		category:'gods',
	});
		new G.Trait({
		name:'God\'s trait #2 Berry rush',
		desc:'[Berry farm,Berry farms] are 8x as efficient so they gather 8 times as much [Berries]',
		icon:[21,13,'magixmod'],
		cost:{},
		chance:275,
		req:{'The God\'s call':true,'7th essence':true},
		category:'gods',
	});
		new G.Trait({
		name:'God\'s trait #3 Science^2',
		desc:'You can hire a [Guru] who will gather [insight] & [science].',
		icon:[21,12,'magixmod'],
		cost:{},
		chance:275,
		req:{'The God\'s call':true,'7th essence':true},
		category:'gods',
	});
		new G.Trait({
		name:'God\'s trait #4 Potter\'s frenzy',
		desc:'Increases efficiency of [Factory of pots] and [Hut of potters] by 25% without harming people\'s [happiness].',
		icon:[21,18,'magixmod'],
		cost:{'faith':100},
		chance:275,
		req:{'The God\'s call':true,'7th essence':true},
		category:'gods',
	});
		new G.Trait({
		name:'God\'s trait #5 Colored life',
		desc:'Increases efficiency of [Hovel of colours] by 25% without harming people\'s [happiness].',
		icon:[22,18,'magixmod'],
		cost:{'faith':100},
		chance:275,
		req:{'The God\'s call':true,'7th essence':true,'<font color="maroon">Caretaking</font>':true},
		category:'gods',
	});
	//Moderation or caretaking?
		new G.Trait({
		name:'<font color="maroon">Moderation</font>',
		desc:'The time has finally come and people seem very curious. That is a sign that they want to know more and more. May unlock unique techs , traits , units for this path.',
		icon:[25,17,'magixmod'],
		cost:{},
		chance:750,
		req:{'culture of moderation':true,'<font color="maroon">Caretaking</font>':false},
		category:'main',
	});
		new G.Trait({
		name:'<font color="maroon">Caretaking</font>',
		desc:'People do not seem curious to further discoveries. Instead of it they wish to live long, calmly and in peace. May unlock unique techs , traits , units for this path.',
		icon:[24,17,'magixmod'],
		cost:{},
		req:{'joy of eating':true,'<font color="maroon">Moderation</font>':false},
		chance:750,
		category:'main',
	});
	//Another knowledge
		new G.Trait({
		name:'Measuring system',
		desc:'<span style="color: #aaffff">People noticed that they will need a measuring system to make constructing, planning easier... so they created their own system of measuring things.</span>.',
		icon:[13,18,'magixmod'],
		cost:{'wisdom':75},
		chance:475,
		req:{'Will to know more':true},
		category:'knowledge',
	});
		new G.Trait({
		name:'An opposite side of belief',
		desc:'Religious people are repeating that there a opposite of the God they have encountered in Paradise exists.',
		icon:[11,19,'magixmod'],
		cost:{'spirituality':10,'faith':200},
		chance:375,
		req:{'Paradise crafting':true}
	});
	//Devil 's traits
		new G.Trait({
		name:'dt1',
		displayName:'Devil\'s trait #1 Lazy blacksmiths',
		desc:'Rates of [blacksmith workshop]s production decreased by 5% at each mode. It involves its paradise version too.',
		icon:[26,1,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt2':false,'dt3':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
			new G.Trait({
		name:'dt2',
		displayName:'Devil\'s trait #2 Lazy firekeepers',
		desc:'Rates of [firekeeper]s production decreased by 3% at each mode',
		icon:[26,2,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt1':false,'dt3':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
		new G.Trait({
		name:'dt3',
		displayName:'Devil\'s trait #3 Lazy carvers',
		desc:'Rates of [carver]s production decreased by 5% at each mode.',
		icon:[26,3,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt1':false,'dt2':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
		new G.Trait({
		name:'dt4',
		displayName:'Devil\'s trait #4 Precious material unluck',
		desc:'All gathering of [gold ore,gold] and [platinum ore,platinum] decreased by 5%',
		icon:[26,4,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt5':false,'dt6':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
			new G.Trait({
		name:'dt5',
		displayName:'Devil\'s trait #5 Hard material decay',
		desc:'All gathering of resources that are used to craft [hard metal ingot]s decreased by 5%',
		icon:[26,5,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt4':false,'dt6':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
			new G.Trait({
		name:'dt6',
		displayName:'Devil\'s trait #6 Soft metal decay',
		desc:'All gathering of resources that are used to craft [soft metal ingot]s decreased by 5%',
		icon:[26,6,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt4':false,'dt5':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
		new G.Trait({
		name:'dt7',
		displayName:'Devil\'s trait #7 Holy well drought',
		desc:'[holy well] gathers 10% less [Cloudy water] than usual.',
		icon:[26,7,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt8':false,'dt9':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
		new G.Trait({
		name:'dt8',
		displayName:'Devil\'s trait #8 Plain Island wells drought',
		desc:'[well of the Plain Island] gathers 15% less [water] than usual.',
		icon:[26,8,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt7':false,'dt9':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
		new G.Trait({
		name:'dt9',
		displayName:'Devil\'s trait #9 Nothing',
		desc:'Damn... you got lucky. This devil\'s trait doesn\'t involve at any way and doesn\'t weaken anything.',
		icon:[26,9,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt7':false,'dt8':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
			new G.Trait({
		name:'dt10',
		displayName:'Devil\'s trait #10 Clothing!!!',
		desc:'Unhappiness from lack of clothing is doubled.',
		icon:[26,10,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt11':false,'dt12':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
			new G.Trait({
		name:'dt11',
		displayName:'Devil\'s trait #11 Will of warmth',
		desc:'Unhappiness from cold & darkness is doubled.',
		icon:[26,11,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt10':false,'dt12':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
			new G.Trait({
		name:'dt12',
		displayName:'Devil\'s trait #12 Bury!!!',
		desc:'Unhappiness from unburied corpses increased by 50%.',
		icon:[26,12,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt10':false,'dt11':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
			new G.Trait({
		name:'dt13',
		displayName:'Devil\'s trait #13 Faith sapping',
		desc:'Wipes away 0.5% of current [faith] amount.',
		icon:[26,13,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt14':false,'dt15':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
			new G.Trait({
		name:'dt14',
		displayName:'Devil\'s trait #14 Influence sapping',
		desc:'Wipes away 0.5% of current [influence] amount.',
		icon:[26,14,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt13':false,'dt15':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
			new G.Trait({
		name:'dt15',
		displayName:'Devil\'s trait #15 Culture sapping',
		desc:'Wipes away 0.5% of current [culture] amount.',
		icon:[26,15,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt13':false,'dt14':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
			new G.Trait({
		name:'dt16',
		displayName:'Devil\'s trait #16 Worse soothsaying',
		desc:'Soothsayer gains 33% less [faith].',
		icon:[26,16,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt17':false,'dt18':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
			new G.Trait({
		name:'dt17',
		displayName:'Devil\'s trait #17 Uncuttable tree',
		desc:'[woodcutter] gains 20% less [log,wood].',
		icon:[26,17,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt16':false,'dt18':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
			new G.Trait({
		name:'dt18',
		displayName:'Devil\'s trait #18 Insight blindness',
		desc:'[dreamer]s gather 33% less [insight].',
		icon:[26,18,'magixmod'],
		cost:{'culture':100},
		chance:150,
		req:{'Underworld building 1/2':true,'dt17':false,'dt16':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
		new G.Trait({
		name:'Eotm',
		displayName:'Evolution of the minds',
		desc:'Replaces [insight], [culture], [faith] and [influence] with: [insight II],[culture II], [faith II] and [influence II] . @To obtain them you will unlock special unit that will convert each for instance 500 [insight] into 1 [insight II] point. In addition [storyteller] , [dreamer] , [chieftain] and [clan leader] work 90% less efficient becuase this evolution is like disaster for them all. @Since now choose box in <b>Research tab</b> will require [insight II] & [science] instead of [insight] .@So you will still need [Wizard]s and units you used to gather lower essentials. @Lower essentials has been hidden but remember... don\'t get rid of wizards. @[flower rituals] and [wisdom rituals] will no longer occur until [ritualism II] is obtained.',
		icon:[25,19,'magixmod'],
		cost:{'culture':1000,'insight':1000,'influence':300,'faith':300},
		chance:190,
		req:{'Underworld building 2/2':true},
		effects:[
			{type:'show res',what:['insight II']},
			{type:'show res',what:['culture II']},
			{type:'show res',what:['faith II']},
			{type:'show res',what:['influence II']},
			{type:'provide res',what:{'wisdom II':50}},
			{type:'provide res',what:{'inspiration II':30}},
			{type:'provide res',what:{'spirituality II':5}},
			{type:'provide res',what:{'authority II':5}},
		],
		category:'main'
	});
	//Seasonal New year
		new G.Tech({
		name:'Firework crafting',
		desc:'@unlocks [Artisan of new year].',
		icon:[0,0,'seasonal'],
		cost:{'insight':30},
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'tribalism':false},
	});
		new G.Tech({
		name:'Firework launching',
		desc:'@unlocks [Firework launching guy]. By the way allows [Artisan of new year] to craft [Firecracker] .',
		icon:[17,0,'seasonal'],
		cost:{'insight':70},
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'Firework crafting':true},
	});
		new G.Tech({
		name:'Dark essenced fireworks',
		desc:'@[Artisan of new year] now can craft [Dark Orange Firework] and [Dark Blue Firework].',
		icon:[16,0,'seasonal'],
		cost:{'insight':400},
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'Firework crafting':true,'Wizard complex':true},
	});
	//Special techs from achievements and their functions
	/*============================================================================================
	SPECIAL ACHIEVEMENTS EFFECTS
	===========================================================================================*/

	let gif =  new G.Tech({
        name:'<font color=" ##00C000">Artistic gray cells</font>',
        desc:'You see flashes of culture... But who were these people? These flashes and hypnagogia made you inspired. Ancestors of culture gives you their power... watch over you giving to you: @+3 [culture] @+3 [inspiration]',
        icon:[4,12,'magixmod',6,12,'magixmod'],
        cost:{},
	effects:[
			{type:'provide res',what:{'inspiration':3}},
			{type:'provide res',what:{'culture':3}},
		],
        req:{'tribalism':false}
    	});
	function checkCultu() {
  	if (G.achievByName['Sacrificed for culture'].won) {
    	if (G.achievByName['Sacrificed for culture'].won >= 0 && G.hasNot('<font color=" ##00C000">Artistic gray cells</font>')) {
     	 G.gainTech(gif)
    	}
	}
	}
	checkCultu()
	const oldNewGame3 = G.NewGameConfirm.bind({})
	G.NewGameConfirm = new Proxy(oldNewGame3, {
 	 apply: function(target, thisArg, args) {
   	 target(...args)
   	 checkCultu()
 	 }
	})
let gifI =  new G.Tech({
        name:'<font color="aqua">Genius feeling</font>',
        desc:'You feel like you are genius or semi-genius. Your people noticed it. That may help and decide for their fate. @+6 [insight]',
        icon:[4,12,'magixmod',choose([1,4,7]),17,'magixmod'],
        cost:{},
	effects:[
			{type:'provide res',what:{'insight':6}},
		],
        req:{'tribalism':false}
    });
function checkDream() {
  if (G.achievByName['Insight-ly'].won) {
    if (G.achievByName['Insight-ly'].won >= 0 && G.hasNot('<font color="aqua">Genius feeling</font>')) {
      G.gainTech(gifI)
    }
}
}
checkDream()
const oldNewGame2 = G.NewGameConfirm.bind({})
G.NewGameConfirm = new Proxy(oldNewGame2, {
  apply: function(target, thisArg, args) {
    target(...args)
    checkDream()
  }
})
let gifD =  new G.Tech({
        name:'<font color="fuschia">Authority of the ancestor</font>',
        desc:'You feel like you have someone from the past inside you. You feel his authority. He\'s inside you. @+1 [influence] @+1 [authority]',
        icon:[4,12,'magixmod',6,13,'magixmod'],
        cost:{},
	effects:[
			{type:'provide res',what:{'authority':1}},
			{type:'provide res',what:{'influence':1}},
		],
        req:{'tribalism':false}
    });
function checkDemoc() {
  if (G.achievByName['Democration'].won) {
    if (G.achievByName['Democration'].won >= 0 && G.hasNot('<font color="fuschia">Authority of the ancestor</font>')) {
      G.gainTech(gifD)
    }
}
}
checkDemoc()
const oldNewGame1 = G.NewGameConfirm.bind({})
G.NewGameConfirm = new Proxy(oldNewGame1, {
  apply: function(target, thisArg, args) {
    target(...args)
    checkDemoc()
  }
})
	let gift =     new G.Tech({
        name:'<font color="yellow">A gift from the Mausoleum</font>',
        desc:'The gift is very uncommon. It may make people life inverted by 180 degrees. But it will be more interesting',
        icon:[4,12,'magixmod',1,14],
        cost:{},
        req:{'tribalism':false},
	effects:[
			{type:'show context',what:['flowers']},
		],
    });
function checkMagic() {
  if (G.achievByName['mausoleum'].won) {
    if (G.achievByName['mausoleum'].won >= 0 && G.hasNot('<font color="yellow">A gift from the Mausoleum</font>')) {
      G.gainTech(gift)
      G.Message({
        type: 'good',
        text: 'Building the Mausoleum in the past has granted you access to magic! :)',
        icon: [4, 12, 6, 1, 'magixmod']
      });
    }

}
 else if(G.achievByName['mausoleum'].won < 1){

  G.Message({
    type: 'bad',
    text: 'Building the Mausoleum in the past grants access to magic in the future.',
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
let gifUnde =  new G.Tech({
        name:'A feeling from the Underworld',
        desc:'You feel some warmth. It is not usual warmth. A call from Underworld. @<b>Allows you to finalize Underworld unlocking',
        icon:[8,12,9,5,'magixmod'],
        cost:{},
	effects:[
		{type:'provide res',what:{'New world point':400}},
	],	
        req:{'tribalism':false}
    });
function checkUnde() {
  if (G.achievByName['"In the underworld"'].won) {
    if (G.achievByName['"In the underworld"'].won >= 0 && G.achievByName['Deadly, revenantic'].won >= 0 && G.hasNot('A feeling from the Underworld')){
      G.gainTech(gifUnde)
    }
}
}
checkUnde()
const oldNewGame4 = G.NewGameConfirm.bind({})
G.NewGameConfirm = new Proxy(oldNewGame4, {
  apply: function(target, thisArg, args) {
    target(...args)
    checkUnde()
  }
})
let gifUnA =  new G.Tech({
        name:'<font color="##a8654f">The Underworld\'s Ascendant</font>',
        desc:'You managed to do few other feats to attract new things. And you attracted: @ +1 [adult] . This is [adult,The Underworld\'s Ascendant]',
        icon:[15,19,'magixmod'],
        cost:{},
	effects:[
		{type:'provide res',what:{'adult':1}},
	],
        req:{'tribalism':false}
    });
function checkUnA() {
  if (G.achievByName['"In the underworld"'].won) {
    if (G.achievByName['"In the underworld"'].won >= 1 && G.achievByName['Democration'].won >= 1 && G.achievByName['Sacrificed for culture'].won >= 1 && G.achievByName['Insight-ly'].won >= 1 && G.hasNot('<font color="##a8654f">The Underworld\'s Ascendant</font>')) {
      G.gainTech(gifUnA)
    }
}
}
checkUnA()
const oldNewGame5 = G.NewGameConfirm.bind({})
G.NewGameConfirm = new Proxy(oldNewGame5, {
  apply: function(target, thisArg, args) {
    target(...args)
    checkUnA()
  }
})
	/*======================================
	Another TECHZ
	=======================================*/
		new G.Tech({
		name:'guilds unite',
		desc:'@moderns up existing modes of [lodge] & [guild quarters] and unlocks one new for [guild quarters] . Increases rate of hiring units per one [lodge] from 5 to 100. <>NOTE: Useless for now but applies new icons to [lodge] , [guild quarters]',
		icon:[29,8,'magixmod'],
		cost:{'insight II':20,'culture II':10,'influence II':5},
		req:{'cities':true,'construction II':true,'code of law II':true},
		effects:[
		],
	});
		new G.Tech({
		name:'focused scouting',
		desc:'@[scout] and [wanderer] are smarter by discovering new techniques of exploring. May make exploring safer<>This tech will allow to explore further worlds with same units. At the moment useless because there is no 2nd map but applies new icons for both [scout] and [wanderer] .',
		icon:[10,21,'magixmod'],
		cost:{'insight II':15,'insight':35},
		req:{'tool-making':true,'Richer language':true,'well-digging':true},
		effects:[
		],
		chance:2,
	});
		new G.Tech({
		name:'bigger kilns',
		desc:'@People can build bigger [kiln]s that are more efficient. <>Increases efficiency of all [Kiln] types by additive 150% but doubles upkeep of this unit. <>In additions this tech changes their visual look.',
		icon:[21,21,'magixmod'],
		cost:{'insight II':15,'insight':15},
		req:{'Improved rhetoric':true,'construction II':true,'masonry':true,'weaving II':true,'prospecting II':true},
		effects:[
		],
		chance:4,
	});
		new G.Tech({
		name:'symbolism II',
		desc:'@increases [symbolism] bonus from 50 to 70%. Still boost has the same targets as it had before.',
		icon:[29,6,'magixmod'],
		cost:{'culture II':15,'insight II':10},
		req:{'oral tradition':true,'ritualism II':true,'Improved rhetoric':true,'Richer language':true,'symbolism':true},
		effects:[
		],
	});
		new G.Tech({
		name:'cozy building',
		desc:'@people now want to be warm using fire. Always some solution for cold nights if people living inside have no clothing. People adds chimneys to their huts, hovels, and houses. Some archaic shelters got a improvement. <>This tech just changes icons of basic housing. But it can do more than just housing providing sometime.',
		icon:[29,3,'magixmod'],
		cost:{'insight II':20},
		req:{'sedentism':true,'tool-making':true,'focused scouting':true},
		effects:[
		],
		chance:3,
	});
		new G.Tech({
		name:'cozier building',
		desc:'@people except setting up a chimney started thinking about having some decor near their houses. <>Makes buildings look even more nice. Better icons for basic housing.',
		icon:[29,4,'magixmod'],
		cost:{'insight II':25,'culture II':5,'insight':10},
		req:{'cozy building':true,'focused scouting':true,'<font color="maroon">Caretaking</font>':true},
		effects:[
		],
		chance:3,
	});
		new G.Tech({
		name:'Maths(upper-intermediate)',
		desc:'Provides 5 [education] and 30 [wisdom II] @Expands maths knowledge of scholars by: integrals (basic) , calculus (basic) , strongs and polynomials.',
		icon:[8,21,'magixmod'],
		cost:{'insight II':50,'science':8,'culture II':12,'insight':255},
		effects:[
			{type:'provide res',what:{'education':5}},
			{type:'provide res',what:{'wisdom II':30}},
		],
		req:{'Laws of physics(intermediate)':true,'Will to know more':true,'symbolism II':true,'Intermediate maths':true,'Proportion':true},
	});
		new G.Tech({
		name:'Fires from logs',
		desc:'[firekeeper] can start fires out of [log]s. <>',
		icon:[9,21,'magixmod',23,1],
		cost:{'insight II':10},
		req:{'Eotm':true},
	});
		new G.Tech({
		name:'Paradise housing conceptions',
		desc:'This technology doesn\'t unlock new housing for Paradise yet. But in the future you will obtain similar technology that finally will unlock for you new neat housing. <>Paradise housing is limited like: 1 Paradise hovel per 100 of something. God doesn\'t want his homeland to be filled with houses and look like it does at your mortal world.',
		icon:[0,21,'magixmod'],
		cost:{'insight':1000,'culture':390,'inspiration':16,'faith':259},
		req:{'<span style="color: ##FF0900">Paradise building</span>':true},
	});
		new G.Tech({
		name:'Paradise housing',
		desc:'Unlocks housing which is unique for the Paradise. Each of the types is limited at some way. Paradise is not like Plain Island a spot where you can build as much housing as you wish because Paradise isn\'t and never will be totally yours. <>Unlocks: [Treehouse] , [Cozy lodge] , [hardened house] , [Cozy paradise hut] . Paradise is lush world so your people do not need to construct chimneys for their houses at all.',
		icon:[1,21,'magixmod'],
		cost:{'insight II':70,'insight':55},
		req:{'<span style="color: ##FF0900">Paradise building</span>':true,'Paradise housing conceptions':true,'cozy building':true},
	});
		new G.Tech({
		name:'Science blessing',
		desc:'[Guru] generates 50% more [science] & [insight].',
		icon:[29,5,'magixmod'],
		cost:{'insight II':15,'science':5,'Mana':435},
		req:{'Laws of physics(intermediate)':true,'Ambrosium treeplanting':true,'Faithful cloudy water filtering':true,'Farm of wheat':true},
	});
		new G.Trait({
		name:'God\'s trait #6 Fertile essences farms',
		desc:'All essence farms are making 50% more essences at the same upkeep. Bigger, healthier flowers can radiate stronger with essences.',
		icon:[5,21,'magixmod'],
		cost:{'insight II':25,'faith II':3,'culture II':4},
		chance:80,
		req:{'Magical soil':true},
		category:'gods'
	});
		new G.Tech({
		name:'Music',
		desc:'People now can use music as one of cultural heritage pillars. May make musicians appear into your people\'s reality.',
		icon:[29,17,'magixmod'],
		cost:{'insight II':15,'culture II':25},
		req:{'symbolism II':true,'ritualism II':true},
	});
		new G.Tech({
		name:'Music instruments',
		desc:'Artisans craft for [musician] instruments at order. <>Note: It doesn\'t add new mode. In fact it just unlocks [musician]',
		icon:[29,18,'magixmod'],
		cost:{'insight II':10,'culture II':25},
		req:{'symbolism II':true,'ritualism II':true,'Music':true},
	});
		new G.Tech({
		name:'More experienced healers',
		desc:'All [healer]s are more efficient. <>This technology will give you bonus depending on path your people have chosen. <>If they have chosen [<font color="maroon">Moderation</font>] then [healer]s will work 3% more efficient. <>If they have chosen [<font color="maroon">Caretaking</font>] then [healer]s will work 9% more efficient.',
		icon:[14,21,'magixmod'], 
		cost:{'insight II':50,'science':5},
		req:{'bigger kilns':true}
	});
		new G.Tech({
		name:'Better kiln construction',
		desc:'All [kiln]s are more efficient. <>This technology will give you bonus depending on path your people have chosen. <>If they have chosen [<font color="maroon">Moderation</font>] then [kiln]s will work 10% more efficient. <>If they have chosen [<font color="maroon">Caretaking</font>] then [kiln]s will work 5% more efficient.',
		icon:[15,21,'magixmod'], 
		cost:{'insight II':50,'science':5},
		req:{'bigger kilns':true}
	});
		new G.Tech({
		name:'Inspirated carvers',
		desc:'[carver]s are more efficient. <>This technology will give you bonus depending on path your people have chosen. <>If they have chosen [<font color="maroon">Moderation</font>] then [carver]s will work 3% more efficient. <>If they have chosen [<font color="maroon">Caretaking</font>] then [carver]s will work 6% more efficient.',
		icon:[16,21,'magixmod'], 
		cost:{'insight II':50,'science':5},
		req:{'bigger kilns':true}
	});
		new G.Tech({
		name:'Mo\' concrete',
		desc:'[Concrete making shack]s are more efficient. <>This technology will give you bonus depending on path your people have chosen. <>If they have chosen [<font color="maroon">Moderation</font>] then [Concrete making shack]s will work 20% more efficient. <>If they have chosen [<font color="maroon">Caretaking</font>] then [Concrete making shack]s will work 5% more efficient.',
		icon:[17,21,'magixmod'], 
		cost:{'insight II':50,'science':5},
		req:{'bigger kilns':true}
	});
		new G.Tech({
		name:'More capacious racks',
		desc:'[Drying rack] is thrice as efficient.',
		icon:[18,21,'magixmod'], 
		cost:{'insight II': 25,'insight':5},
		req:{'<font color="maroon">Caretaking</font>':true,'Magical soil':true}
	});
		new G.Tech({
		name:'Oil-digging',
		desc:'[quarry,Quarries] can dig for [oil] that can be used in the future as fuel.',
		icon:[29,2,'magixmod'], 
		cost:{'insight II': 25,'insight':30},
		req:{'<font color="maroon">Moderation</font>':true,'Eotm':true}
	});
		new G.Tech({
		name:'Bigger factory racks',
		desc:'[Leather factory,Leather factories] dry twice as much [leather] without [happiness] harm.',
		icon:[29,19,'magixmod'], 
		cost:{'insight II': 25,'insight':30},
		req:{'<font color="maroon">Moderation</font>':true,'Eotm':true}
	});
		new G.Tech({
		name:'Next-to house berrybushes',
		desc:'People who live in [house]s can now gather [Berries] from bushes that they plant next to their houses.',
		icon:[29,15,'magixmod'], 
		cost:{'insight II': 10},
		req:{'<font color="maroon">Caretaking</font>':true,'Eotm':true,'cozier building':true}
	});
	let fruitzextra =  new G.Tech({
        name:'<font color="lime">Fruit supplies</font>',
        desc:'Obtaining <font color="red">Experienced</font> made you getting extra 100 [fruit]s . Wish your people having good taste :) ',
        icon:[4,12,'magixmod',28,22,'magixmod'],
        cost:{},
	effects:[
			{type:'provide res',what:{'fruit':100}},
		],
        req:{'tribalism':false}
    });
function CheckFruitzextra() {
  if (G.achievByName['Experienced'].won) {
    if (G.achievByName['Experienced'].won >= 0 && G.hasNot('<font color="lime">Fruit supplies</font>')) {
      G.gainTech(fruitzextra)
    }
}
}
CheckFruitzextra()
const oldNewGameFruit = G.NewGameConfirm.bind({})
G.NewGameConfirm = new Proxy(oldNewGameFruit, {
  apply: function(target, thisArg, args) {
    target(...args)
    CheckFruitzextra()
  }
})
	let themetech =  new G.Tech({
        name:'<font color="orange">Life has its theme</font>',
        desc:'From now you can change game theme :) ',
        icon:[4,12,'magixmod',29,23,'magixmod'],
        cost:{},
	effects:[
		],
        req:{'tribalism':false}
    });
function CheckThemetech() {
  if (G.achievByName['Extremely smart'].won) {
    if (G.achievByName['Extremely smart'].won >= 0 && G.achievByName['<font color="DA4f37">Mausoleum eternal</font>'].won >= 0 && G.hasNot('<font color="orange">Life has its theme</font>')) {
      G.gainTech(themetech)
    }
}
}
CheckThemetech()
const oldNewGameThemeTech = G.NewGameConfirm.bind({})
G.NewGameConfirm = new Proxy(oldNewGameThemeTech, {
  apply: function(target, thisArg, args) {
    target(...args)
    CheckThemetech()
  }
})
	let Smartrait =  	new G.Trait({
        name:'<font color="orange">Smaller but efficient</font>',
        desc:'[Brick house with a silo] , [house] , [hovel] , [hut] , [bamboo hut] , [branch shelter] and [mud shelter] uses 0.9 [land] instead of full 1 [land] .',
        icon:[28,23,'magixmod'],
        cost:{},
	effects:[
		],
        req:{'tribalism':false},
	category:'knowledge',
	chance:1,
    });
function Checksmall() {
  if (G.achievByName['Smart'].won) {
    if (G.achievByName['Smart'].won >= 0 && G.hasNot('<font color="orange">Smaller but efficient</font>')){
      G.gainTrait(Smartrait)
    }
}
}
Checksmall()
const oldNewGameSmall = G.NewGameConfirm.bind({})
G.NewGameConfirm = new Proxy(oldNewGameSmall, {
  apply: function(target, thisArg, args) {
    target(...args)
    Checksmall()
  }
})
		new G.Tech({
		name:'Glory',
		desc:'@provides 7 [authority II] @Increases efficiency of [chieftain] and [clan leader] by 10% @Applies visual changes for [chieftain] and [clan leader] . @You gain yearly 2 [influence] instead of 1. @[Mediator] can gather [influence] but becomes more limited.',
		icon:[23,23,'magixmod'], 
		cost:{'influence II': 5,'insight II':50,'culture II':20},
		effects:[
			{type:'provide res',what:{'authority II':7}},
		],
		req:{'code of law II':true}
	});
		new G.Tech({
		name:'Spiritual piety',
		desc:'@provides 7 [spirituality II] @Increases [faith] gains of [Church] by 30% @Applies visual changes for [grave] and [Church] . @One [grave] provides 3 [burial spot]s and uses 0.7 instead of 1 [land] .',
		icon:[26,23,'magixmod'], 
		cost:{'faith II': 5,'insight II':50,'culture II':20},
		effects:[
			{type:'provide res',what:{'spirituality II':7}},
		],
		req:{'ritualism II':true,'ritualism':true,'God\'s trait #6 Fertile essences farms':true}
	});
		new G.Tech({
		name:'Essential conversion tank overclock I',
		desc:'@[Essential conversion tank] can convert essentials 10% more often. People overclock these tanks. //Note: This technology is causing bug with rituals making \'em auto disable even when you have enough faith to keep them. This tech doesn\'t do anything and will be replaced with other one at next update',
		icon:[6,22,'magixmod'], 
		cost:{'insight II':80,'insight':344},
		req:{'Maths(upper-intermediate)':true,'God\'s trait #6 Fertile essences farms':true,'monument-building':true,'construction':true}
	});
			new G.Trait({
		name:'Policy revaluation',
		desc:'All policies since now cost with [influence II] instead of [influence] . Required for future technologies and to keep people listening to you. </b> But... <b>all</b> rituals now costs and require [faith II] . @But don\'t worry. They won\'t consume that much like [wisdom rituals] or [flower rituals] .',
		icon:[1,23,'magixmod'],
		cost:{'insight II':15,'culture II':15,'influence II':5},
		chance:45,
		req:{'code of law II':true,'ritualism II':true,'symbolism II':true,'Glory':true},
	});
		new G.Tech({
		name:'Mining strategy',
		desc:'Decreases accident rate at [mine] . @Increases efficiency of [mine] by 5%. @Applies visual change to [mine] icon.',
		icon:[17,23,'magixmod'], 
		cost:{'insight II':50,'science':2,'insight':204},
		req:{'Policy revaluation':true,'<font color="maroon">Moderation</font>':true,'mining':true,'quarrying':true,'<font color="maroon">Caretaking</font>':false,'Improved furnace construction':true,'symbolism':true}
	});
		new G.Tech({
		name:'Safer explosive usage',
		desc:'Decreases accident rate at [explosive mine] by 3%. @Increases efficiency of [explosive mine] by 5%. @Applies visual change to [explosive mine] icon.',
		icon:[19,23,'magixmod'], 
		cost:{'insight II':50,'science':2,'insight':204},
		req:{'Policy revaluation':true,'<font color="maroon">Caretaking</font>':true,'mining':true,'quarrying':true,'<font color="maroon">Moderation</font>':false,'Improved furnace construction':true,'symbolism':true}
	});
		new G.Tech({
		name:'Nutritious magical soil',
		desc:'Increases efficiency of [Farm of withering tulips,Essence farms] by 10%. @This 10% bonus compounds with bonus from [God\'s trait #6 Fertile essences farms] .',
		icon:[21,23,'magixmod'], 
		cost:{'insight II':45,'culture II':15,'faith II':3,'influence II':2,'Mana':1365,'science':2},
		req:{'Policy revaluation':true,'Magical soil':true}
	});
		new G.Trait({
		name:'Magic adept',
		desc:'May unlock a new wonder. This trait is a reward for getting over 2 million of [Magic essences] . //Good job :)',
		icon:[12,22,'magixmod'],
		cost:{'Magic essences':2100000},
		chance:45,
		req:{'Eotm':true},
		category:'main'
	});
		new G.Tech({
		name:'Master mana-making',
		desc:'[Mana maker] works 4x as efficient due to new technologies of crafting mana the smart people created for them. @Applies visual change to [Mana maker] .',
		icon:[3,24,'magixmod'], 
		cost:{'insight II':90,'culture II':15},
		req:{'Policy revaluation':true,'Magical soil':true}
	});
	let MagicalAchiev =  new G.Tech({
        name:'Magical presence',
	displayName:'<font color="silver">Magical presence</font>',
        desc:'You feel some weird stuff inside of your body. Sometime it is warm, sometime makes you feel weird but later you don\'t feel any weird things that this presence has made. @Increases efficiency of all [Water wizard tower,Wizard towers] by 5% without increasing [Mana] upkeep. @Unlocks you new theme (check [Theme changer]).',
        icon:[4,12,'magixmod',2,24,'magixmod'],
        cost:{},
	effects:[
	],	
        req:{'tribalism':false}
    });
function checkMagicalAchiev() {
  if (G.achievByName['Magical'].won) {
    if (G.achievByName['Magical'].won >= 0 && G.hasNot('Magical presence')){
      G.gainTech(MagicalAchiev)
    }
}
}
checkMagicalAchiev()
const oldNewGameMagical = G.NewGameConfirm.bind({})
G.NewGameConfirm = new Proxy(oldNewGameMagical, {
  apply: function(target, thisArg, args) {
    target(...args)
    checkMagicalAchiev()
  }
})
		new G.Tech({
		name:'hunting III',
		desc:'@[hunter]s become more coordinated. This tech decreases amount of accidents where a victim becomes [hunter] .',
		icon:[8,22,'magixmod'],
		cost:{'insight II':65,'science':2,'influence II':3,'insight':25},
		req:{'Policy revaluation':true,'Magical presence':true,'Fishing II':true},
	});
		new G.Tech({
		name:'fishing III',
		desc:'This tech may unlock something that truly will make [fisher] become better.',
		icon:[7,22,'magixmod'],
		cost:{'insight II':65,'science':3,'culture II':2,'insight':15},
		req:{'Policy revaluation':true,'Magical presence':true,'hunting III':true},
	});
		new G.Tech({
		name:'Hunter\'s coordination',
		desc:'@Decreases value of [hunter]s accidents even more. Requires small amount of food as an upkeep. @Increases [wisdom II] by 10.',
		icon:[6,23,'magixmod'],
		cost:{'insight II':80,'science':5},
		req:{'hunting III':true},
		effects:[
			{type:'provide res',what:{'wisdom II':10}},
			]
	});
		new G.Tech({
		name:'An armor for Hunter',
		desc:'@Let the [hunter] have an armor!. //In fact this tech just leads to more advanced improvements for [hunter] .',
		icon:[14,24,'magixmod'],
		cost:{'insight II':80,'science':5},
		req:{'hunting III':true},
	});
		new G.Tech({
		name:'Fisher\'s smartness',
		desc:'[fisher]s is twice as efficient but as an upkeep he requires some food. //Fisher knows how to lure different types of fishes.',
		icon:[0,23,'magixmod'],
		cost:{'insight II':45,'science':5},
		req:{'fishing III':true},
	});
			new G.Tech({
		name:'Hunters & fishers unification',
		desc:'Merges [fisher] and [hunter] into one unit. //[hunter]s accident rate is decreased even more but hired [hunter]s require an [armor set] . //<font color="fuschia">Note: Obtaining this tech will merge powers of [hunter] and [fisher] into one unit. Merged units become useless (they icon gets slashed) and will gather no longer. Only new unit caused by merging will do that what they were doing before. New unit becomes much more expensive and limited but it is much more efficient.</font>',
		icon:[2,23,'magixmod'],
		cost:{'insight II':55,'science':5,'insight':95},
		req:{'fishing III':true,'hunting III':true,'Fisher\'s smartness':true,'Hunter\'s coordination':true,'An armor for Hunter':true},
		chance:15
	});
		new G.Trait({
		name:'Camp-cooking',
		desc:'Increases upkeep (amount of [fire pit]s used) by 1 at [Fishers & hunters camp] but since now they will be able to cook some [cooked meat,meat] for you.',
		icon:[15,24,'magixmod'],
		cost:{'insight II':100},
		req:{'Hunters & fishers unification':true},
		chance:65,
		category:'knowledge'
	});
			new G.Tech({
		name:'Fertile bushes',
		desc:'[house,Next-to house berrybushes] are 20% more fertile. In fact they gather 20% more [Berries] . Yummy :)',
		icon:[1,24,'magixmod'],
		cost:{'insight II':100,'culture II':20,'insight':46},
		req:{'Hunters & fishers unification':true,'Next-to house berrybushes':true},
	});
		new G.Tech({
		name:'Supreme fast filtering',
		desc:'[Water filter]s perform conversion twice as often doubling efficiency.',
		icon:[5,24,'magixmod'],
		cost:{'insight II':60},
		req:{'Hunters & fishers unification':true},
	});
		new G.Tech({
		name:'Supreme cloudy fast filtering',
		desc:'[Cloudy water filter]s perform conversion twice as often doubling efficiency.',
		icon:[6,24,'magixmod'],
		cost:{'insight II':80},
		req:{'Hunters & fishers unification':true,'Supreme fast filtering':true},
	});
		new G.Tech({
		name:'Improved alchemy techniques',
		desc:'[Basic brewing stand] becomes thrice as efficient.',
		icon:[16,23,'magixmod'],
		cost:{'insight II':65,'science':7,'culture II':23},
		req:{'Camp-cooking':true},
	});
		new G.Tech({
		name:'Mo \'wine',
		desc:'[Alcohol brewing stand] and [Alcohol drinks brewing stand] become thrice as efficient.',
		icon:[15,23,'magixmod'],
		cost:{'insight II':80,'science':5},
		req:{'Improved alchemy techniques':true},
	});
		new G.Tech({
		name:'Burial wormhole 1/2',
		desc:'People start thinking about using magic especially [Dark essence,dark one] to get rid of corpses without harming reputation. //One of them said that if we have at least 2 portals why won\'t we make some smaller worlds just for burying these [corpse]s ?',
		icon:[27,3,'magixmod',22,22,'magixmod'],
		cost:{'insight II':100,'science':6,'faith II':4,'influence II':5},
		req:{'Magical presence':true,'Mo \'wine':true},
	});
		new G.Tech({
		name:'Doctrine of the dark wormhole 1/5',
		desc:'Provides: @10 [wisdom II] and 2 [inspiration II] . //This part of doctrine is about conception of making a small plane where the [corpse]s will lie in the way that will allow to fit over millions of [corpse]s. //Your [Wizard]s seem really impressed reading and forwarding the doctrine.',
		icon:[21,22,'magixmod',16,22,'magixmod'],
		cost:{'insight II':100,'science':6,'faith II':4,'influence II':5,'culture II':10},
		req:{'Burial wormhole 1/2':true},
		effects:[
			{type:'provide res',what:{'wisdom II':10}},
			{type:'provide res',what:{'inspiration II':2}},
			]
	});
		new G.Trait({
		name:'Doctrine of the dark wormhole 2/5',
		desc:'Provides: @10 [wisdom II] and 2 [inspiration II] . //This part of doctrine is about spells or rituals that will sucessfully make a wormhole working and stable. //Your [Wizard]s seem interested in making the first wormhole. But they wants finished doctrine. They don\'t want to do it by themselves so they will calmly wait for finished doctrine.',
		icon:[20,22,'magixmod',16,22,'magixmod'],
		cost:{'insight II':105,'science':6,'faith II':4,'influence II':5,'culture II':15,'wisdom':100},
		req:{'Burial wormhole 1/2':true,'Doctrine of the dark wormhole 1/5':true},
		effects:[
			{type:'provide res',what:{'wisdom II':10}},
			{type:'provide res',what:{'inspiration II':2}},
			],
		category:'knowledge',
		chance:40
	});
			new G.Tech({
		name:'Doctrine of the dark wormhole 3/5',
		desc:'Provides: @10 [wisdom II] and 2 [inspiration II] . //This part of doctrine is filled with informations about stability of things like that. Wormholes, portals must be stable. If anybody would enter unstable world nobody knows what would happen to him. //Your [Wizard]s feel goosebumps.',
		icon:[19,22,'magixmod',15,22,'magixmod'],
		cost:{'insight II':105,'science':7,'faith II':4,'influence II':5,'culture II':10,'wisdom':50,'insight':44},
		req:{'Burial wormhole 1/2':true,'Doctrine of the dark wormhole 1/5':true,'Doctrine of the dark wormhole 2/5':true},
		effects:[
			{type:'provide res',what:{'wisdom II':10}},
			{type:'provide res',what:{'inspiration II':2}},
			]
	});
		new G.Trait({
		name:'Doctrine of the dark wormhole 4/5',
		desc:'Provides: @10 [wisdom II] and 2 [inspiration II] . //This part of doctrine describes ways of keeping the wormhole active. It is important thing too because if it will run out of power a tons of corpses will explode out of wormhole and people will be really, really mad. //Your [Wizard]s know exactly how big problem will occur if wormhole will run out of power. ',
		icon:[18,22,'magixmod',15,22,'magixmod'],
		cost:{'insight II':130,'science':7,'faith II':4,'influence II':5,'culture II':27},
		req:{'Burial wormhole 1/2':true,'Doctrine of the dark wormhole 3/5':true},
		effects:[
			{type:'provide res',what:{'wisdom II':10}},
			{type:'provide res',what:{'inspiration II':2}},
			],
		category:'knowledge',
		chance:60
	});
		new G.Tech({
		name:'Doctrine of the dark wormhole 5/5',
		desc:'Provides 7 [inspiration II] . //This part of doctrine is about miscellanneous related to the wormhole. //Your [Wizard]s feel secure. They may start thinking about running first dark wormhole.',
		icon:[17,22,'magixmod',14,22,'magixmod'],
		cost:{'insight II':140,'science':7,'faith II':3,'influence II':5,'culture II':30,'wisdom':50,'insight':310},
		req:{'Burial wormhole 1/2':true,'Doctrine of the dark wormhole 1/5':true,'Doctrine of the dark wormhole 2/5':true,'Doctrine of the dark wormhole 3/5':true,'Doctrine of the dark wormhole 4/5':true},
		effects:[
			{type:'provide res',what:{'inspiration II':7}},
			]
	});
		new G.Tech({
		name:'Burial wormhole 2/2',
		desc:'Unlocks [Dark wormhole] . Massive burial spot bonus but requires upkeep(in [Mana] and [Dark essence]). Dark powers like death and fear. Corpses look scary and spooky. It keeps wormhole stable. ',
		icon:[27,2,'magixmod',22,22,'magixmod'],
		cost:{'insight II':140,'science':10,'culture II':40,'insight':95},
		req:{'Doctrine of the dark wormhole 5/5':true,'Master mana-making':true},
	});
		new G.Trait({
		name:'Corpse decay',
		desc:'<b>Wormhole you opened...<br>ejects [corpse]s<br>before people...<br>bury them<br>decreasing usage of...<br>the [burial spot] .</b>',
		icon:[7,24,'magixmod'],
		cost:{'insight II':125,'Dark essence':2.5e4,'culture II':25,'influence II':3},
		req:{'Burial wormhole 2/2':true,'Doctrine of the dark wormhole 5/5':true},
		effects:[
			],
		chance:90
	});
		new G.Tech({
		name:'Liberating darkness',
		desc:'[The Skull of Wild Death] now can generate [Dark essence] for you... <br>but...<br> more [wild corpse]s will appear',//2 do wild corpses!!!
		icon:[8,24,'magixmod'],
		cost:{'insight II':140,'science':5,'faith II':5,'Mana':511},
		req:{'Doctrine of the dark wormhole 5/5':true,'Master mana-making':true,'Hope of revenant abandoning':true},
	});
		new G.Trait({
		name:'Beer recipe',
		desc:'Increases [happiness] a bit. People had created secret recipe for a tasty beer. //In fact more [drunk,drunken] people will appear in your tribe. Make sure you hired [Syrup healer]s and you have some [Medicament brews].',
		icon:[13,23,'magixmod'],
		cost:{'insight II':135},
		req:{'Mo \'wine':true},
		effects:[
			],
		chance:200
	});
		new G.Tech({
		name:'Conveyor conception',
		desc:'People lead by [Automation] think about automating movement of produced things so they wouldn\'t have to move it by using their hands and they would focus more on work increasing efficiency of their [Factories I,Factories].',
		icon:[0,24,'magixmod'],
		cost:{'insight II':135},
		req:{'Policy revaluation':true,'<font color="maroon">Moderation</font>':true},
		effects:[
			],
		chance:10
	});
		if(G.modsByName['Market mod']){
		new G.Tech({
		name:'Essence trading',
		desc:'Now [market_sell] may trade with [Magic essences].',
		icon:[22,24,'magixmod'],
		cost:{'insight II':8,'faith II':1,'culture II':1},
		req:{'Eotm':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Backshift',
		desc:'[bazaar_buy,Bazaars] and [market_buy,Markets] work 50% more efficient but requires another [worker] .',
		icon:[30,22,'magixmod'],
		cost:{'insight':997,'culture':264},
		req:{'ingredient crafting':true},
		effects:[
			{type:'function',func:function(){
			 	G.getDict('bazaar_buy').effects.push({type:'mult',value:1.5});
				G.getDict('bazaar_sell').effects.push({type:'mult',value:1.5});
				G.getDict('market_buy').effects.push({type:'mult',value:1.5});
				G.getDict('market_sell').effects.push({type:'mult',value:1.5});
			}}
		]
	});
		new G.Tech({
		name:'Expanded essence trading catalog',
		desc:'Unlocks a policy that will turn you on the prospected essence trading. Now [market_sell,Markets] trades [Magic essences] with bulks of 150 instead of 100.',
		icon:[30,21,'magixmod'],
		cost:{'insight II':95,'culture II':3,'science':1,'faith II':1},
		req:{'Magic adept':true,'Magical presence':true},
		effects:[
		],
	});
		new G.Tech({
		name:'Mo\' tradez',
		desc:'Policies such like [extended basic catalog] or [extended food catalog] now have more options',
		icon:[30,20,'magixmod'],
		cost:{'insight':1490},
		req:{'Treeplanting':true},
		effects:[
		],
			
	});
	}
			new G.Tech({
		name:'Mo\' beauty',
		desc:'Applies visual changes to some units. //Default units gets "decorated" let\'s say in short.',
		icon:[30,11,'magixmod'],
		cost:{'insight II':5},
		req:{'Doctrine of the dark wormhole 4/5':true},
		effects:[
			]
	});
				new G.Tech({
		name:'symbolism III',
		desc:'Third level of [symbolism] doesn\'t increase the bonus but since now the bonus will apply to more units([Guru] gathers 25% more [science], [musician] , [Thoughts sharer] , [Lawyer] ,[Mediator]. [Cathedral] gets 100% bonus instead of 70%([symbolism II] bonus). //In addition provides: @10[wisdom II],[inspiration II] @3[education] @5[authority II],[spirituality II].',
		icon:[30,14,'magixmod'],
		cost:{'insight II':145,'culture II':35,'influence II':5,'faith II':5,'science':10,'insight':16},
		req:{'Doctrine of the dark wormhole 5/5':true},
		effects:[
			{type:'provide res',what:{'inspiration II':10}},
			{type:'provide res',what:{'wisdom II':10}},
			{type:'provide res',what:{'education':3}},
			{type:'provide res',what:{'authority II':5}},
			{type:'provide res',what:{'spirituality II':5}},
			]
	});
				new G.Tech({
		name:'wizard\'s grain fertlizer',
		desc:'Fertlizer that makes [Wheat farm]s produce 75% more [wheat] (compounding). Made by group of wizards who love eating bread on breakfast and they do not imagine a life without a piece of bread.',
		icon:[30,17,'magixmod'],
		cost:{'insight II':100,'Mana':500,'culture II':33,'faith II':2,'insight':35},
		req:{'Doctrine of the dark wormhole 3/5':true},
		effects:[
			]
	});
			new G.Tech({
		name:'Plain island mining strategy',
		desc:'Decreases accident rate at [Mine of the plain island] . @Increases efficiency of [Mine of the plain island] by 5%. @Applies visual change to [Mine of the plain island]\'s icon.',
		icon:[31,7,'magixmod'], 
		cost:{'insight II':50,'science':2,'insight':139},
		req:{'Mining strategy':true}
	});
			new G.Trait({
		name:'respect for the corpse',
		desc:'Obtaining this trait disables effect of the [ritual necrophagy] trait and unlocks way better and less cruel rites that can be used to bury corpses such like cremation. @unhappiness from unburied corpses is decreased by 25%',
		icon:[25,24,'magixmod'],
		cost:{'culture II':25,'faith II':5,'influence II':5},
		req:{'ritual necrophagy':true,'Liberating darkness':true},
		chance:35
	});
		new G.Tech({
		name:'power of the faith',
		desc:'Now [Crafting & farm rituals] bonus applies to: @[blacksmith workshop](mortal and paradise version) @[carpenter workshop](mortal and paradise version)@[Holy orchard]@[artisan](types: juice, pyro and normal. Bonus for juice and pyro: 25% while for normal it is 3%)//All of these bonuses are only active when the ritual active is. These bonuses won\'t increase amount of [faith II] required to keep the ritual active. @provides 5 [spirituality II]',
		icon:[24,24,'magixmod'],
		cost:{'culture II':25,'insight II':135,'science':5,'faith':26},
		req:{'symbolism III':true},
		chance:2,
			effects:[
			{type:'provide res',what:{'spirituality II':5}},
			]
	});
		new G.Tech({
		name:'improved windmill motors',
		desc:'[Windmill] can craft 35% more [flour].',
		icon:[31,13,'magixmod'],
		cost:{'insight II':165,'science':5,'culture II':21},
		req:{'symbolism III':true},
		chance:2,
	});
		new G.Tech({
		name:'backshift at farms',
		desc:'[Sugar cane farm] and [Berry farm] produce 2.5x more and [Wheat farm] gets twice as efficient. //Now these farms require 50% more [worker]s due to way people increase income of the farms. //Requires [<font color="maroon">Moderation</font>] to unlock this tech.',
		icon:[31,14,'magixmod'],
		cost:{'insight II':180,'science':5,'influence II':10,'culture II':5,'insight':374},
		req:{'improved windmill motors':true,'<font color="maroon">Moderation</font>':true},
		chance:2,
	});
		new G.Trait({
		name:'A leaf of wisdom',
		desc:'You found a red leaf that glows. You remember that now tree of wisdom has red leaves. The red leaf shines stronger and stronger... then dissipates providing you: 2[education] and 40[wisdom II].',
		icon:[31,10,'magixmod'],
		req:{'ritual necrophagy':true,'Liberating darkness':true},
		chance:100,
			effects:[
			{type:'provide res',what:{'wisdom II':40}},
			{type:'provide res',what:{'education':2}},
			]
	});
		new G.Tech({
		name:'embalmment',
		desc:'Smart people said how to make a substance that will slow down decay of corpses and discourage people from performing [ritual necrophagy,necrophagy] on them. They think about crafting something that is called [Urn] and there they would "store" [corpse]s.',
		icon:[31,20,'magixmod'],
		cost:{'insight II':110,'science':5,'influence II':10,'culture II':5},
		req:{'respect for the corpse':true},
		chance:5,
	});
		new G.Tech({
		name:'cremation',
		desc:'Unlocks [crematorium]. Burns embalmed [corpse]s then all dust from [corpse] they put into the [Urn].//You\'ll unlock better way of burying people. 1 [burial spot] can store 4 [Urn]s.',
		icon:[30,16,'magixmod'],
		cost:{'insight II':155,'science':10,'influence II':10,'culture II':35},
		req:{'embalmment':true},
		chance:5,
	});
		new G.Tech({
		name:'dark urn decay',
		desc:'[Corpse decay] now affects [Urn]s as well.',
		icon:[30,15,'magixmod'],
		cost:{'faith II':15,'insight II':135,'Essenced seeds':300,'insight':315},
		req:{'Corpse decay':true,'cremation':true},
		chance:5,
	});
		new G.Tech({
		name:'Juicy nutritious magical soil',
		desc:'Increases efficiency of [Farm of withering tulips,Essence farms] by 10%. @This 10% bonus compounds with bonus from [God\'s trait #6 Fertile essences farms] and previous soil upgrades.',
		icon:[31,11,'magixmod'], 
		cost:{'insight II':190,'culture II':20,'Juices':1050,'culture':93},
		req:{'Policy revaluation':true,'Nutritious magical soil':true,'Magical presence':true}
	});
			new G.Tech({
		name:'Paper mastery',
		desc:'[Paper-crafting shack]s are thrice as efficient.',
		icon:[31,9,'magixmod'],
		cost:{'insight II':125,'science':7,'influence II':3},
		req:{'Camp-cooking':true},
	});
			new G.Tech({
		name:'Even mo\' paper',
		desc:'[Paper-crafting shack]s produces 25% more [Paper] .//To get this bonus you need to obtain [<font color="maroon">Moderation</font>] or [<font color="maroon">Caretaking</font>]. It does not matter which path your people will choose.',
		icon:[31,12,'magixmod'],
		cost:{'insight II':135,'science':7,'influence II':6,'culture II':30,'faith II':2,'insight':90},
		req:{'Paper mastery':true},
	});
		new G.Tech({
		name:'More humid water',
		desc:'[Sugar cane farm] produces 250% more [Sugar cane]',
		icon:[31,23,'magixmod'],
		cost:{'insight':495},
		req:{'Moar juices':true},
	});
		new G.Tech({
		name:'Soil for moisture-loving plants',
		desc:'[Sugar cane farm] produces 300% more [Sugar cane]. //Compounds with [More humid water] bonus',
		icon:[31,24,'magixmod'],
		cost:{'insight':1350,'culture':300},
		req:{'Ambrosium treeplanting':true},
	});
		new G.Tech({
		name:'Empowered canes',
		desc:'[Sugar cane farm] produces 400% more [Sugar cane]. //Compounds with previous bonuses. //Makes planted [Sugar cane] live longer and able to grow even taller than normal.',
		icon:[31,25,'magixmod'],
		cost:{'insight II':50,'culture II':15},
		req:{'Eotm':true},
	});
		new G.Tech({
		name:'Essenced soil for moisture-loving plants',
		desc:'[Sugar cane farm] produces 400% more [Sugar cane]. //Compounds with previous bonuses.',
		icon:[30,25,'magixmod'],
		cost:{'insight II':90,'culture II':20,'influence II':3,'science':2,'insight':33},
		req:{'Nutritious magical soil':true},
	});
			new G.Tech({
		name:'Storage at the bottom of the world',
		desc:'Unlocks [heavy warehouse]. Built in Underworld and covered with heavy metal.',
		icon:[30,13,'magixmod'],
		cost:{'insight II':185,'culture II':15,'influence II':1,'science':4},
		req:{'A leaf of wisdom':true},
	});
		new G.Trait({
		name:'gods and idols',
		desc:'May open a door to the Seraphins - the God\'s superiors.',
		icon:[17,25,'magixmod'],
		req:{'Liberating darkness':true,'power of the faith':true},
		cost:{'faith II':8,'influence II':7,'insight II':35,'culture II':10},
		chance:70,
		category:'religion'
	});
		new G.Tech({
		name:'monument-building III',
		desc:'People now can use almost every resource while constructing mystical, beautiful wonders.',
		icon:[0,25,'magixmod'],
		req:{'gods and idols':true},
		cost:{'insight II':187,'science':8,'culture II':30},
	});
		new G.Trait({
		name:'sb1',
		displayName:'Soothsayer blessing',
		desc:'Increases amount of [faith] gained by [soothsayer]s by 10% due to getting closer to the religion.',
		icon:[13,25,'magixmod'],
		req:{'gods and idols':true,'power of the faith':true,'sb2':false,'sb3':false,'sb4':false},
		cost:{'faith II':8,'influence II':7,'insight II':35,'culture II':10},
		chance:70,
		category:'religion'
	});
	new G.Trait({
		name:'sb2',
		displayName:'Soothsayer blessing',
		desc:'Increases amount of [faith] gained by [soothsayer]s by 5% due to getting closer to the religion.',
		icon:[14,25,'magixmod'],
		req:{'gods and idols':true,'power of the faith':true,'sb1':false,'sb3':false,'sb4':false},
		cost:{'faith II':8,'influence II':7,'insight II':35,'culture II':10},
		chance:70,
		category:'religion'
	});
	new G.Trait({
		name:'sb3',
		displayName:'Soothsayer blessing',
		desc:'Sadly getting closer to the religion doesn\'t make [soothsayer]s gaining more [faith]. Try your luck next time(run in fact).',
		icon:[15,25,'magixmod'],
		req:{'gods and idols':true,'power of the faith':true,'sb2':false,'sb1':false,'sb4':false},
		cost:{'faith II':8,'influence II':7,'insight II':35,'culture II':10},
		chance:70,
		category:'religion'
	});
	new G.Trait({
		name:'sb4',
		displayName:'Soothsayer blessing',
		desc:'Nobody knows why and how but [soothsayer]s are gaining 5% less [faith] even after getting closer to the God and the whole religion.',
		icon:[16,25,'magixmod'],
		req:{'gods and idols':true,'power of the faith':true,'sb2':false,'sb3':false,'sb1':false},
		cost:{'faith II':8,'influence II':7,'insight II':35,'culture II':10},
		chance:70,
		category:'religion'
	});
		let GodTempleAchiev =  new G.Tech({
        name:'Life in faith',
	displayName:'<font color="gold">Life in faith</font>',
        desc:'You remember... you were staying near the Temple... the God\'s temple! This memory has unbelieveable powers: @+1[faith] @+1[spirituality] @3 new themes(check [Theme changer]).',
        icon:[4,12,'magixmod',9,25,'magixmod'],
        cost:{},
	effects:[
		{type:'provide res',what:{'spirituality':1}},
		{type:'provide res',what:{'faith':1}},
	],	
        req:{'tribalism':false}
    });
function checkGodTempleAchiev() {
  if (G.achievByName['Next to the God'].won) {
    if (G.achievByName['Next to the God'].won > 0 && G.hasNot('Life in faith')){
      G.gainTech(GodTempleAchiev)
    }
}
}
checkGodTempleAchiev()
const oldNewGameGodTemple = G.NewGameConfirm.bind({})
G.NewGameConfirm = new Proxy(oldNewGameGodTemple, {
  apply: function(target, thisArg, args) {
    target(...args)
    checkGodTempleAchiev()
  }
})
	/*=====================================================================================
	POLICIES
	=======================================================================================*/
	G.policyCategories.push(
		{id:'debug',name:'Debug'},
		{id:'food',name:'Food'},
		{id:'work',name:'Work'},
		{id:'population',name:'Population'},
		{id:'faith',name:'Faith'},
		{id:'education',name:'Education'},
		{id:'Florists',name:'Pantheon'},//Kept the same ID to prevent errors and crashes upon a update
		{id:'education',name:'Education'},
		{id:'prod',name:'Production'},
		{id:'mag',name:'Magix utilities'}
	);
	
	new G.Policy({
		name:'disable aging',
		desc:'Aging, disease, births, and deaths are disabled.',
		icon:[3,12,8,3],
		cost:{},
		startWith:true,
		category:'debug',
	});
	new G.Policy({
		name:'disable eating',
		desc:'Eating and drinking are disabled.',
		icon:[3,12,3,6],
		cost:{},
		startWith:true,
		category:'debug',
	});
	new G.Policy({
		name:'disable spoiling',
		desc:'All resource spoilage is disabled.',
		icon:[3,12,3,7],
		cost:{},
		startWith:true,
		category:'debug',
	});
	new G.Policy({
		name:'child workforce',
		desc:'[child,Children] now count as [worker]s; working children are more prone to accidents and receive lower education.',
		icon:[7,12,3,3],
		cost:{'influence':2},
		req:{'tribalism':true},
		category:'work',
	});
	new G.Policy({
		name:'elder workforce',
		desc:'[elder]s now count as [worker]s; working elders are more prone to accidents and early death.',
		//an interesting side-effect of this and how population is coded is that elders are now much more prone to illness and wounds, and should they recover they will magically turn back into adults, thus blessing your civilization with a morally dubious way of attaining eternal life
		icon:[7,12,5,3],
		cost:{'influence':2},
		req:{'tribalism':true},
		category:'work',
	});
	new G.Policy({
		name:'food rations',
		desc:'Define how much [food] your people are given each day.//Bigger rations will make your people happier, while smaller ones may lead to sickness and starvation.',
		icon:[5,12,3,6],
		cost:{'influence':2},
		startMode:'sufficient',
		req:{'rules of food':true},
		modes:{
			'none':{name:'None',desc:'Eating food is forbidden.<br>Your people will start to starve.'},
			'meager':{name:'Meager',desc:'Your people receive half a portion per day.'},
			'sufficient':{name:'Sufficient',desc:'Your people receive a full portion per day.'},
			'plentiful':{name:'Plentiful',desc:'Your people receive a portion and a half per day.'},
		},
		category:'food',
	});
	new G.Policy({
		name:'water rations',
		desc:'Define how much [water] your people are given each day.//Bigger rations will make your people happier, while smaller ones may lead to sickness and dehydration.',
		icon:[5,12,7,6],
		cost:{'influence':2},
		startMode:'sufficient',
		req:{'rules of food':true},
		modes:{
			'none':{name:'None',desc:'Drinking water is forbidden.<br>Your people will start to die from dehydration.'},
			'meager':{name:'Meager',desc:'Your people receive half a portion per day.'},
			'sufficient':{name:'Sufficient',desc:'Your people receive a full portion per day.'},
			'plentiful':{name:'Plentiful',desc:'Your people receive a portion and a half per day.'},
		},
		category:'food',
	});
	new G.Policy({
		name:'eat spoiled food',
		desc:'Your people will eat [spoiled food] when other [food] gets scarce, with dire consequences for health and morale.',
		icon:[6,12,3,7],
		cost:{'influence':1},
		startMode:'on',
		req:{'rules of food':true},
		category:'food',
	});
	new G.Policy({
		name:'drink muddy water',
		desc:'Your people will drink [muddy water] when clean [water] gets scarce, with dire consequences for health and morale.',
		icon:[6,12,8,6],
		cost:{'influence':1},
		startMode:'on',
		req:{'rules of food':true},
		category:'food',
	});
	new G.Policy({
		name:'insects as food',
		desc:'[bugs] now count as [food], although most people find them unpalatable.',
		icon:[6,12,8,11],
		cost:{'influence':1},
		req:{'rules of food':true},
		effects:[
			{type:'make part of',what:['bugs'],parent:'food'},
		],
		effectsOff:[
			{type:'make part of',what:['bugs'],parent:''},
		],
		category:'food',
	});
	new G.Policy({
		name:'eat raw meat and fish',
		desc:'[meat] and [seafood] are eaten raw, which may be unhealthy.',
		icon:[6,12,5,7],
		cost:{'influence':1},
		startMode:'on',
		req:{'rules of food':true},
		effects:[
			{type:'make part of',what:['meat','seafood'],parent:'food'},
		],
		effectsOff:[
			{type:'make part of',what:['meat','seafood'],parent:''},
		],
		category:'food',
	});
	new G.Policy({
		name:'fertility rituals',
		desc:'Improves birth rate by 20%. Consumes 1 [faith] every 20 days; will stop if you run out.',
		icon:[8,12,2,3],
		cost:{'faith':1},
		startMode:'off',
		req:{'ritualism':true},
		category:'faith',
	});
	new G.Policy({
		name:'harvest rituals',
		desc:'Improves [gatherer], [hunter] and [fisher] efficiency by 20%. Consumes 1 [faith] every 20 days; will stop if you run out.',
		icon:[8,12,4,7],
		cost:{'faith':1},
		startMode:'off',
		req:{'ritualism':true},
		category:'faith',
	});
	new G.Policy({
		name:'flower rituals',
		desc:'People get sick slower and recover faster. Consumes 1 [faith] every 20 days; will stop if you run out.',
		icon:[8,12,4,5],
		cost:{'faith':1},
		startMode:'off',
		req:{'ritualism':true},
		category:'faith',
	});
	new G.Policy({
		name:'wisdom rituals',
		desc:'Improves [dreamer] and [storyteller] efficiency by 20%. Consumes 1 [faith] every 20 days; will stop if you run out.',
		icon:[8,12,8,5],
		cost:{'faith':1},
		startMode:'off',
		req:{'ritualism':true},
		category:'faith',
	});
	
	new G.Policy({
		name:'population control',
		desc:'Set rules on how many children your people are allowed to have.',
		icon:[4,12,2,3],
		cost:{'influence':3},
		startMode:'normal',
		req:{'tribalism':true},
		modes:{
			'forbidden':{name:'Forbidden',desc:'Your people are not allowed to make children.//Your population will not grow.'},
			'limited':{name:'Limited',desc:'Your people are only allowed to have one child.//Your population will grow slowly.'},
			'normal':{name:'Normal',desc:'You have no specific rules regarding children.//Your population will grow normally.'},
		},
		category:'population',
	});
	//MAGIX
		new G.Policy({
		name:'Factory of pots production rates',
		desc:'You can change the rates of production for [Factory of pots] . Remember the bigger rates the people will need to work harder and may become unhappy.',
		icon:[24,18,'magixmod',14,18,'magixmod'],
		cost:{'influence':125},
		startMode:'1',
		req:{'Production rates influence':true,'<font color="maroon">Moderation</font>':true},
			modes:{
			'0.5':{name:'0.5',desc:'[Factory of pots] produces 50% less than default.'},
			'1':{name:'1',desc:'[Factory of pots] produces its normal rate.'},
			'1.5':{name:'1.5',desc:'[Factory of pots] produces 50% more than default.'},
			'2':{name:'2',desc:'[Factory of pots] produces 100% more than default. People may become unhappy'},
		},
		category:'prod',
	});
		new G.Policy({
		name:'Leather factory production rates',
		desc:'You can change the rates of production for [Leather factory] . Remember the bigger rates the people will need to work harder and may become unhappy.',
		icon:[24,18,'magixmod',15,18,'magixmod'],
		cost:{'influence':125},
		startMode:'1',
		req:{'Production rates influence':true,'<font color="maroon">Moderation</font>':true},
			modes:{
			'0.5':{name:'0.5',desc:'[Leather factory] produces 50% less than default.'},
			'1':{name:'1',desc:'[Leather factory] produces its normal rate.'},
			'1.5':{name:'1.5',desc:'[Leather factory] produces 50% more than default.'},
			'2':{name:'2',desc:'[Leather factory] produces 100% more than default. People may become unhappy'},
		},
		category:'prod',
	});
		new G.Policy({
		name:'Hut of potters production rates',
		desc:'You can change the rates of production for [Hut of potters] . Remember the bigger rates the people will need to work harder and may become unhappy.',
		icon:[24,18,'magixmod',20,18,'magixmod'],
		cost:{'influence':125},
		startMode:'1',
		req:{'Production rates influence':true,'<font color="maroon">Caretaking</font>':true},
			modes:{
			'0.5':{name:'0.5',desc:'[Hut of potters] produces 50% less than default.'},
			'1':{name:'1',desc:'[Hut of potters] produces its normal rate.'},
			'1.5':{name:'1.5',desc:'[Hut of potters] produces 50% more than default.'},
			'2':{name:'2',desc:'[Hut of potters] produces 100% more than default. People may become unhappy'},
		},
		category:'prod',
	});
		new G.Policy({
		name:'Hovel of colours production rates',
		desc:'You can change the rates of production for [Hovel of colours] . Remember the bigger rates the people will need to work harder and may become unhappy.',
		icon:[24,18,'magixmod',19,18,'magixmod'],
		cost:{'influence':125},
		startMode:'1',
		req:{'Production rates influence':true,'<font color="maroon">Caretaking</font>':true},
			modes:{
			'0.5':{name:'0.5',desc:'[Hovel of colours] produces 50% less than default.'},
			'1':{name:'1',desc:'[Hovel of colours] produces its normal rate.'},
			'1.5':{name:'1.5',desc:'[Hovel of colours] produces 50% more than default.'},
			'2':{name:'2',desc:'[Hovel of colours] produces 100% more than default. People may become unhappy'},
		},
		category:'prod',
	});
		new G.Policy({
		name:'harvest rituals for flowers',
		desc:'Improves [Florist] efficiency by 20%. Consumes 1 [faith] & 1 [influence] every 20 days; will stop if you run out.',
		icon:[8,12,11,8,'magixmod'],
		cost:{'faith':1,'influence':3},
		startMode:'off',
		req:{'ritualism':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'faith',
	});
		new G.Policy({
		name:'Crafting & farm rituals',
		desc:'Improves [Paper-crafting shack] , [Well of mana] and <b>Farms</b> efficiency by 17%. Consumes 15 [faith] & 15 [influence] every 15 days; will stop if you run out.',
		icon:[8,12,14,2,'magixmod'],
		cost:{'faith':5,'influence':5},
		startMode:'off',
		req:{'ritualism':true,'papercrafting':true},
		category:'faith',
	});
		new G.Policy({
		name:'Teach alchemists',
		desc:'Will start teach alchemists. In short this option will allow you to start learning [adult] to become [Alchemist].',
		icon:[12,9,'magixmod',12,5,'magixmod'],
		cost:{'influence':15},
		startMode:'on',
		req:{'Will to know more':true},
		category:'Education',
	});
		new G.Policy({
		name:'Alchemy for children',
		desc:'Will start teach children to become [Child alchemist]. @Note: teaching children will make more [wounded],[sick] or even dead, because of drinking too strong potion by children.',
		icon:[12,9,'magixmod',12,7,'magixmod'],
		cost:{'influence':15},
		startMode:'off',
		req:{'Will to know more':true},
		category:'Education',
	});
		new G.Policy({
		name:'School of Alchemy - length of education cycle',
		desc:'The shorter length you choose the accidents rate with [Alchemists] as a victim will grow slightly.',
		icon:[2,0,'magixmod'],
		cost:{'influence':15},
		startMode:'medium',
		modes:{
			'short':{name:'Short',desc:'Teaching 1 [Alchemist] or 1 [Child alchemist] takes 400 days. Choosing this length you will increase rate of accidents at alchemy by 33%'},
			'medium':{name:'Medium',desc:'Teaching 1 [Alchemist] or 1 [Child alchemist] takes 600 days. Normal accident rate.'},
			'long':{name:'Long',desc:'Teaching 1 [Alchemist] or 1 [Child alchemist] takes 800 days. Choosing this length you will decrease rate of accidents at alchemy by 33%.'},
		},
		req:{'Will to know more':true},
		category:'Education',
	});
		new G.Policy({
		name:'Gather roses',//It is raw ID. Kept it to prevent crashes but added display name
		displayName:'Chra-nos The Seraphin of Time',
		desc:'Boost depends on time. <br><font color="lime">Each year boost goes up by 0.5% (range: 1 to 10%). Boosted are all crafting units.</font><br><hr color="fuschia"><font color="red"> Backfire: With the same ratio weakened are gathering units.</font>',
		icon:[29,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'plant lore':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'Florists',
	});
		new G.Policy({
		name:'drink spoiled juice',
		desc:'Your people will drink [Spoiled juices] no matter when clean [water] gets scarce or not, with dire consequences for health and morale.',
		icon:[6,12,14,5,'magixmod'],
		cost:{'influence':3},
		startMode:'off',
		req:{'rules of food':true,'Crafting a juice':true},
		category:'food',
	});
		new G.Policy({
		name:'drink cloudy water',
		desc:'Your people will drink [Cloudy water] which is equal to [water].',
		icon:[6,12,11,14,'magixmod'],
		cost:{'influence':1},
		startMode:'on',
		req:{'rules of food':true,'<span style="color: ##FF0900">Paradise building</span>':true},
		category:'food',
	});
		new G.Policy({ //Required to make new mausoleum system working as it is supposed to.
		name:'mausoleum stage',
		icon:[1,14],
		startMode:'0',
		modes:{
			'0':{},
			'1':{},
			'2':{},
			'3':{},
			'4':{},
			'5':{},
			'6':{},
			'7':{},
			'8':{},
			'9':{},
			'10':{},
		},
	});
		new G.Policy({
		name:'Toggle SFX',
		desc:'Disable/Enable sounds from <li>technology: obtaining, rerolling choices.</li><li>Trait obtaining</li><li>Game over</li><li>Obtaining an Emblem</li>',
		icon:[29,0,'magixmod'],
		cost:{},
		startMode:'on',
		req:{},
		category:'mag',
	});
		new G.Policy({
		name:'Theme changer',
		desc:'Switch theme if you wish',
		icon:[28,21,'magixmod'],
		cost:{},
		req:{'<font color="orange">Life has its theme</font>':true},
		modes:{
			'default':{name:'Default',desc:'Switches theme to default',icon:[4,22,'magixmod']},
			'green':{name:'Green',desc:'Switches to green theme.',icon:[3,22,'magixmod']},
			'blue':{name:'Blue',desc:'Switches to blue theme.',icon:[2,22,'magixmod']},
			'red':{name:'Red',desc:'Switches to red theme.',icon:[0,22,'magixmod']},
			'cyan':{name:'Cyan',desc:'Switches to cyan theme.',icon:[5,22,'magixmod']},
			'gray':{name:'Gray',desc:'Switches to gray theme.',icon:[1,22,'magixmod']},
			'indigo':{name:'Indigo',desc:'Switches to indigo theme. Reward for <b>Magical victory</b> achievement.',req:{'Magical presence':true}},
		},
		category:'mag',
	});
	if(G.modsByName['Market mod']){
		 new G.Policy({
            name: 'extended essences catalog',
            desc: 'The [Magic essences] trading will be refined. You will be able to fine tune what specific items from the category you want to trade (instead of the whole category)',
            icon: [0, 2, "market_images", 20, 13,'magixmod'],
            cost: {'influence': 10 },
            startMode: 'off',
            req: {'Expanded essence trading catalog': true},
            category: 'trading_policies',

        });		
	}
	if(G.modsByName['Laws Of Food']){
		 new G.Policy({
            name: 'eat meals',
            desc: 'Decide if your people can eat [Meals] or not.',
            icon: [6, 12, 22, 13,'magixmod'],
            cost: {'influence': 2},
            startMode: 'on',
            req: {'Cooking':true},
            category: 'food',
		effects:[
			{type:'make part of',what:['Meals'],parent:'food'},
		],
		effectsOff:[
			{type:'make part of',what:['Meals'],parent:''},
		],
        });
		new G.Policy({
            name: 'eat sunflower seeds',
            desc: 'Decide if your people can eat [Sunflower seeds] or not.',
            icon: [6, 12, 12, 1,'magixmod'],
            cost: {'influence': 2},
            startMode: 'on',
            req: {'plant lore':true},
            category: 'food',
		effects:[
			{type:'make part of',what:['Sunflower seeds'],parent:'food'},
		],
		effectsOff:[
			{type:'make part of',what:['Sunflower seeds'],parent:''},
		],
        });
		 new G.Policy({
            name: 'drink juices',
            desc: 'Decide if your people can drink [Juices] or not.',
            icon: [6, 12, 14, 3,'magixmod'],
            cost: {'influence': 2},
            startMode: 'on',
            req: {'Crafting a juice':true},
            category: 'food',
		effects:[
			{type:'make part of',what:['Juices'],parent:'water'},
		],
		effectsOff:[
			{type:'make part of',what:['Juices'],parent:''},
		],
        });	
	}
	if(G.modsByName['Laws Of Food Free Version']){
		 new G.Policy({
            name: 'eat meals',
            desc: 'Decide if your people can eat [Meals] or not.',
            icon: [6, 12, 22, 13,'magixmod'],
            cost: {'influence': 0},
            startMode: 'on',
            req: {'Cooking':true},
            category: 'food',
		effects:[
			{type:'make part of',what:['Meals'],parent:'food'},
		],
		effectsOff:[
			{type:'make part of',what:['Meals'],parent:''},
		],
        });
		new G.Policy({
            name: 'eat sunflower seeds',
            desc: 'Decide if your people can eat [Sunflower seeds] or not.',
            icon: [6, 12, 12, 1,'magixmod'],
            cost: {'influence': 0},
            startMode: 'on',
            req: {'plant lore':true},
            category: 'food',
		effects:[
			{type:'make part of',what:['Sunflower seeds'],parent:'food'},
		],
		effectsOff:[
			{type:'make part of',what:['Sunflower seeds'],parent:''},
		],
        });
		 new G.Policy({
            name: 'drink juices',
            desc: 'Decide if your people can drink [Juices] or not.',
            icon: [6, 12, 14, 3,'magixmod'],
            cost: {'influence': 0},
            startMode: 'on',
            req: {'Crafting a juice':true},
            category: 'food',
		effects:[
			{type:'make part of',what:['Juices'],parent:'water'},
		],
		effectsOff:[
			{type:'make part of',what:['Juices'],parent:''},
		],
        });	
	}
			new G.Policy({
		name:'se02',
		displayName:'Bersaria the Seraphin of Madness',
		desc:'<font color="lime">Increases thieve hunters  and other guard efficiency by 40%</font><br><hr color="fuschia"><font color="red">Backfire: Harms happiness and 1% more thieves will spawn. </font>',
		icon:[28,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'plant lore':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'Florists',
	});
				new G.Policy({
		name:'se03',
		displayName:'Tu-ria the Seraphin of Inspiration',
		desc:'<font color="lime">Increases [culture] gathering by 100%, decreases limit for [musician] and [storyteller] by 50 [population]</font><br><hr color="fuschia"><font color="red">Backfire:[dreamer] , [faith,faith units] gather 5% less [insight] and [faith] .</font>',
		icon:[27,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'plant lore':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'Florists',
	});
		new G.Policy({
		name:'se04',
		displayName:'Hartar the Seraphin of Hunting',
		desc:'<font color="lime">Increases efficiency of hunting units by 35%</font><br><hr color="fuschia"><font color="red">Backfire:Decreases efficiency of fishing units by 5%</font>',
		icon:[26,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'plant lore':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'Florists',
	});
			new G.Policy({
		name:'se05',
		displayName:'Fishyar the Seraphin of Fishing',
		desc:'<font color="lime">Increases efficiency of fishing units by 35%</font><br><hr color="fuschia"><font color="red">Backfire:Decreases efficiency of hunting units by 5%</font>',
		icon:[25,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'plant lore':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'Florists',
	});
				new G.Policy({
		name:'se06',
		displayName:'Posi\'zul the Seraphin of Water',
		desc:'<font color="lime">Increases gathering of water and decreases rate of water spoiling</font><br><hr color="fuschia"><font color="red">Backfire: Increases food spoiling rate</font>',
		icon:[24,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'plant lore':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'Florists',
	});
				new G.Policy({
		name:'se07',
		displayName:'Herbalia the Seraphin of Recovery',
		desc:'<font color="lime">Boosts health level. [healer]s are 25% more efficient.</font><br><hr color="fuschia"><font color="red">Backfire: Happiness cap is: from -200 to 175%. [gatherer] gains 15% less [seafood](because it is raw).</font>',
		icon:[23,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'plant lore':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'Florists',
	});
					new G.Policy({
		name:'se08',
		displayName:'Buri\'o dak the Seraphin of Burial',
		desc:'<font color="lime">Now 1 [burial spot] can store 1.1 [corpse] or 5 [Urn]s.</font><br><hr color="fuschia"><font color="red">Backfire: Harms [health] and decreases [healer]s efficiency by 5%.</font>',
		icon:[22,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'plant lore':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'Florists',
	});
						new G.Policy({
		name:'se09',
		displayName:'Moai the Seraphin of the Stone',
		desc:'<font color="lime">All [mine]s are 25% more efficient(Doesn\'t apply to [gems] gathering). [digger] is 2% more efficient. [carver] works 3% more efficient at modes related to the [stone].</font><br><hr color="fuschia"><font color="red">Backfire: [well]s are 15% less efficient and [artisan]s are 7.5% less efficient.</font>',
		icon:[21,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'plant lore':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'Florists',
	});
						new G.Policy({
		name:'se10',
		displayName:'Mamuun the Seraphin of Richness',
		desc:'<font color="lime">Gold and [precious building materials] decay 3% slower</font><br><hr color="fuschia"><font color="red">Backfire:[archaic building materials] decay 40% faster , [basic building materials] decay 12% faster, [advanced building materials] decay 3% faster. [food] spoils faster.</font>',
		icon:[20,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'plant lore':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'Florists',
	});
						new G.Policy({
		name:'se11',
		displayName:'Enlightened the Seraphin of Faith',
		desc:'<font color="lime">All [faith] gathering is increased by 25%, [Thoughts sharer] is 1% more efficient.</font><br><hr color="fuschia"><font color="red">Backfire: All [influence] , [insight] units are weakened by 25%(including [Guru])</font>',
		icon:[19,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'plant lore':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'Florists',
	});
						new G.Policy({
		name:'se12',
		displayName:'Okar the Seer the Seraphin of Knowledge',
		desc:'<font color="lime">[Guru] and [dreamer]s are 50% more efficient.</font><br><hr color="fuschia"><font color="red">Backfire: [dreamer]s and [Guru] require [food] and [water] as an upkeep. Weakens [gatherer] and [Florist] by 20%. [culture] gaining lowered by 10%.</font>',
		icon:[18,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'plant lore':true,'<font color="yellow">A gift from the Mausoleum</font>':true},
		category:'Florists',
	});
	/*=======================================
	Icon sheet for custom land tiles
	=======================================*/
	G.getLandIconBG=function(land)
	{
		return 'url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/terrainMagix.png),url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/terrainMagix.png)';
	}
	G.LoadResources=function()
	{
		var resources=[
			'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/terrainMagix.png',
			'img/blot.png',
			'img/iconSheet.png?v=1'
		];
	}
	
	/*=====================================================================================
	LANDS
	=======================================================================================*/

	new G.Land({
		name:'ocean',
		names:['Ocean'],
		goods:[
			{type:'saltwater fish',min:1,max:4},
			{type:'saltwater'},
		],
		ocean:true,
		image:3,
		score:0,
	});
	new G.Land({
		name:'arctic ocean',
		names:['Icesheet'],
		goods:[
			{type:'saltwater fish',min:1,max:3},
			{type:'snow cover'},
			{type:'saltwater'},
		],
		ocean:true,
		image:2,
		score:0,
	});
	new G.Land({
		name:'tropical ocean',
		names:['Tropical ocean'],
		goods:[
			{type:'saltwater fish',min:1,max:4},
			{type:'saltwater'},
		],
		ocean:true,
		image:4,
		score:0,
	});
	new G.Land({
		name:'prairie',
		names:['Prairie','Grassland','Plain','Steppe','Meadow'],
		goods:[
			{type:['oak','birch'],chance:1,min:0.1,max:0.2},
			{type:['oak','birch'],chance:0.5,min:0.1,max:0.4},
			{type:'berry bush',chance:0.9},
			{type:'grass',amount:2},
			{type:'vfb1',chance:0.2},
			{type:'vfb2',chance:0.05},
			{type:'sugar cane',min:0.2,max:1,chance:0.5},
			{type:['wild rabbits','stoats'],chance:0.9},
			{type:['foxes'],chance:0.5,amount:0.5},
			{type:['wolves','bears'],chance:0.2,amount:0.5},
			{type:['deer'],chance:0.2,amount:0.2},
			{type:'wild bugs'},
			{type:'freshwater fish',chance:0.8,min:0.1,max:0.5},
			{type:'freshwater',amount:1},
			{type:'rocky substrate'},
		],
		modifiers:{'river':0.4,'volcano':0.2,},
		image:6,
		score:10,
	});
	new G.Land({
		name:'shrubland',
		names:['Shrubland','Drylands','Highlands','Heath'],
		goods:[
			{type:['oak','birch'],chance:0.5,min:0.2,max:0.4},
			{type:'dead tree',amount:0.5},
			{type:'berry bush',chance:0.2},
			{type:'grass',amount:1.5},
			{type:'vfb1',chance:0.5},
			{type:'sugar cane',min:0.2,max:2},
			{type:['wild rabbits','stoats'],chance:0.6},
			{type:['foxes'],chance:0.4,amount:0.3},
			{type:['wolves','bears'],chance:0.1,amount:0.2},
			{type:'wild bugs'},
			{type:'freshwater fish',chance:0.3,min:0.1,max:0.3},
			{type:'freshwater',amount:0.8},
			{type:'rocky substrate'},
		],
		modifiers:{'river':0.4,'volcano':0.2,},
		image:5,
		score:7,
	});
	new G.Land({
		name:'forest',
		names:['Forest','Forest','Woodland','Swamp','Marsh'],
		goods:[
			{type:['oak','birch'],amount:3},
			{type:['oak','birch','dead tree'],chance:0.5},
			{type:'berry bush',chance:0.6},
			{type:'forest mushrooms',chance:0.8},
			{type:'grass'},
			{type:'rb1',chance:0.5},
			{type:'rb2',chance:0.5},
			{type:'sugar cane',min:0.1,max:0.5,chance:0.05},
			{type:'bush of tulips',chance:0.5,min:0.3,max:0.9},
			{type:['wild rabbits','stoats'],chance:0.2},
			{type:['foxes'],chance:0.2,amount:0.2},
			{type:['wolves','bears'],chance:0.5,min:0.5,max:1},
			{type:['boars'],chance:0.5,amount:0.5},
			{type:'deer',chance:0.7,amount:0.5},
			{type:'wild bugs',min:1,max:1.5},
			{type:'freshwater fish',chance:0.1,min:0.1,max:0.3},
			{type:'freshwater',amount:1},
			{type:'rocky substrate'},
		],
		image:7,
		score:8,
	});
	new G.Land({
		name:'tundra',
		names:['Tundra','Cold plain','Cold steppe'],
		goods:[
			{type:['fir tree'],amount:1},
			{type:'berry bush',chance:0.8},
			{type:'grass'},
			{type:['wild rabbits','stoats'],chance:0.1},
			{type:['foxes'],chance:0.3,amount:0.4},
			{type:['wolves'],chance:0.5,min:0.5,max:1},
			{type:['seals'],chance:0.2,amount:0.5},
			{type:'deer',chance:0.2,amount:0.1},
			{type:['polar bears'],chance:0.3,min:0.1,max:0.5},
			{type:'wild bugs'},
			{type:'freshwater fish',chance:0.8,min:0.1,max:0.5},
			{type:'freshwater',amount:1},
			{type:'snow cover'},
			{type:'rocky substrate'},
		],
		image:9,
		score:7,
	});
	new G.Land({
		name:'ice desert',
		names:['Ice desert','Cold desert'],
		goods:[
			{type:'dead tree',amount:0.5},
			{type:['fir tree'],amount:0.2},
			{type:'berry bush',chance:0.5,amount:0.2},
			{type:'grass',chance:0.4,amount:0.2},
			{type:['wild rabbits','stoats'],chance:0.05},
			{type:['wolves'],chance:0.1,min:0.1,max:0.5},
			{type:['seals'],chance:0.2,amount:0.4},
			{type:['polar bears'],chance:0.5,min:0.1,max:0.5},
			{type:'wild bugs',amount:0.05},
			{type:'freshwater fish',chance:0.3,min:0.1,max:0.3},
			{type:'freshwater',amount:0.2},
			{type:'snow cover'},
			{type:'rocky substrate'},
		],
		image:8,
		score:2,
	});
	new G.Land({
		name:'boreal forest',
		names:['Boreal forest','Pine forest','Taiga'],
		goods:[
			{type:['fir tree'],amount:3},
			{type:'berry bush',chance:0.9},
			{type:'forest mushrooms',chance:0.4},
			{type:'rb1',chance:0.5},
			{type:'rb2',chance:0.5},
			{type:'grass'},
			{type:['wild rabbits','stoats'],chance:0.2},
			{type:['wolves'],chance:0.5,min:0.5,max:1},
			{type:['polar bears','bears'],chance:0.3,amount:0.5},
			{type:'deer',chance:0.7,amount:0.5},
			{type:'sugar cane',min:0.25,max:1.1},
			{type:'wild bugs'},
			{type:'freshwater fish',chance:0.1,min:0.1,max:0.3},
			{type:'freshwater',amount:1},
			{type:'snow cover'},
			{type:'rocky substrate'},
		],
		image:10,
		score:8,
	});
	new G.Land({
		name:'savanna',
		names:['Savannah','Savannah','Sun prairie'],
		goods:[
			{type:'acacia',amount:1},
			{type:'palm tree',chance:0.4,amount:0.3},
			{type:'berry bush',chance:0.6},
			{type:'succulents',chance:0.4,min:0.1,max:0.3},
			{type:'grass',amount:1.5},
			{type:['wild rabbits','stoats'],chance:0.3},
			{type:['foxes'],chance:0.4,amount:0.5},
			{type:['boars'],chance:0.3,amount:0.5},
			{type:'wild bugs'},
			{type:'sugar cane',min:0.1,max:0.8},
			{type:'freshwater fish',chance:0.6,min:0.1,max:0.5},
			{type:'freshwater',amount:0.8},
			{type:'sandy soil',chance:0.3},
			{type:'rocky substrate'},
		],
		image:12,
		score:7,
	});
	new G.Land({
		name:'desert',
		names:['Desert','Scorched land'],
		goods:[
			{type:'dead tree',amount:0.5},
			{type:'acacia',amount:0.2,chance:0.4},
			{type:'succulents',min:0.1,max:0.6},
			{type:'grass',chance:0.3,amount:0.1},
			{type:'wild rabbits',chance:0.05},
			{type:['foxes'],chance:0.3,min:0.1,max:0.3},
			{type:['wolves'],chance:0.1,min:0.1,max:0.3},
			{type:'wild bugs',amount:0.15},
			{type:'sugar cane',min:0.05,max:0.15,chance:0.075},
			{type:'freshwater',amount:0.1},
			{type:'sandy soil'},
			{type:'rocky substrate'},
		],
		image:11,
		score:2,
	});
	new G.Land({
		name:'jungle',
		names:['Jungle','Tropical forest','Mangrove'],
		goods:[
			{type:['palm tree'],amount:3},
			{type:'jungle fruits',chance:1},
			{type:'grass'},
			{type:'koalas',chance:0.3},
			{type:'sugar cane',min:0.05,max:1},
			{type:['boars'],chance:0.2,amount:0.5},
			{type:'wild bugs',min:1,max:2},
			{type:'freshwater fish',chance:0.1,min:0.1,max:0.3},
			{type:'freshwater',amount:1},
			{type:'rocky substrate'},
		],
		image:13,
		score:8,
	});
		new G.Land({
		name:'swamplands',
		goods:[
			{type:['swampflowers'],amount:1},
			{type:'grass',chance:3},
			{type:'rocky substrate'},
			{type:'sugar cane',min:0.1,max:0.7},
			{type:'crocodiles',min:0.2,max:0.8},
			{type:'deer',min:0.1,max:0.9,chance:0.9},
			{type:['willow'],amount:2},
			{type:['willow','mangrove'],chance:0.6},
		],
		image:14,
		score:5,
	});
			new G.Land({
		name:'lavender fields',
		goods:[
			{type:['lavender'],amount:2},
			{type:'grass',min:0.75,max:1.1},
			{type:'rocky substrate'},
			{type:'foxes',min:0.2,max:0.8},
			{type:'wolves',min:0.1,max:0.75,chance:3},
			{type:'wild rabbits',chance:0.9,min:0.3,max:0.6},
			{type:['jacaranda'],min:0.5,max:1.5},
		],
		image:15,
		score:3,
	});
				new G.Land({
		name:'glacier',
		goods:[
			{type:'snow cover',min:0.4,max:3},
			{type:'Ice',min:2,max:3.5},
			{type:'seals',min:0.05,max:1,chance:0.2},
			{type:'saltwater fish',min:0.05,max:0.3,chance:0.01},
			{type:'freshwater',amount:0.75},
		],
		image:16,
		score:3,
		ocean:true
	});
	
	//TODO : all the following
	new G.Land({
		name:'mountain',
		names:['Mountain'],
		modifier:true,
		goods:[
		],
	});
	new G.Land({
		name:'volcano',
		names:['Volcano'],
		modifier:true,
		goods:[
		],
	});
	new G.Land({
		name:'hills',
		names:['Hills'],
		modifier:true,
		goods:[
		],
	});
	new G.Land({
		name:'canyon',
		names:['Canyon','Rift','Gorge','Ravine'],
		modifier:true,
		goods:[
		],
	});
	new G.Land({
		name:'cliffs',
		names:['Cliffs'],
		modifier:true,
		goods:[
			//TODO : some limestone source here
		],
	});
	new G.Land({
		name:'beach',
		names:['Beach'],
		modifier:true,
		goods:[
			{type:'saltwater fish',min:0.3,max:1},
			{type:['crabs','clams'],chance:0.1,min:0.1,max:0.5},
			{type:'sandy soil'},
		],
	});
	new G.Land({
		name:'river',
		names:['River'],
		modifier:true,
		goods:[
			{type:'freshwater fish',min:0.2,max:1},
			{type:['crabs','clams'],chance:0.2,min:0.1,max:0.3},
			{type:'freshwater',min:0.5,max:1.5},
		],
	});
	/*=====================================================================================
	GOODS
	=======================================================================================*/
	
	G.contextNames['gather']='Gathering';
	G.contextNames['fish']='Fishing';
	G.contextNames['hunt']='Hunting';
	G.contextNames['chop']='Chopping';
	G.contextNames['dig']='Digging';
	G.contextNames['mine']='Mining';
	G.contextNames['quarry']='Quarrying';
	G.contextNames['flowers']='Flowers';
	
	//plants
	new G.Goods({
		name:'grass',
		desc:'[grass] is a good source of [herb]s; you may also occasionally find some [fruit]s and [stick]s while foraging.',
		icon:[10,10],
		res:{
			'gather':{'herb':10,'fruit':0.5,'stick':0.5},
		},
		mult:10,
	});
	new G.Goods({
		name:'oak',
		desc:'The [oak] is a mighty tree that thrives in temperate climates, rich in [log]s and [stick]s.',
		icon:[0,10],
		res:{
			'chop':{'log':3,'stick':6},
			'gather':{'stick':1},
		},
		affectedBy:['deforestation'],
		mult:5,
	});
	new G.Goods({
		name:'birch',
		desc:'[birch,Birch trees] have white bark and are rather frail, but are a good source of [log]s and [stick]s.',
		icon:[1,10],
		res:{
			'chop':{'log':2,'stick':4},
			'gather':{'stick':1},
		},
		affectedBy:['deforestation'],
		mult:5,
	});
	new G.Goods({
		name:'palm tree',
		desc:'[palm tree]s prefer warm climates and provide [log]s when chopped; harvesting them may also yield [stick]s and [fruit]s such as bananas and coconuts.',
		icon:[2,10],
		res:{
			'chop':{'log':2,'stick':4},
			'gather':{'fruit':0.3,'stick':1},
		},
		affectedBy:['deforestation'],
		mult:5,
	});
	new G.Goods({
		name:'acacia',
		desc:'The [acacia,Acacia tree] tends to grow in warm, dry climates, and can be chopped for [log]s and harvested for [stick]s.',
		icon:[8,10],
		res:{
			'chop':{'log':2,'stick':4},
			'gather':{'stick':1},
		},
		affectedBy:['deforestation'],
		mult:5,
	});
	new G.Goods({
		name:'fir tree',
		desc:'[fir tree]s can endure cold climates and keep their needles year-long; they can provide [log]s and [stick]s.',
		icon:[3,10],
		res:{
			'chop':{'log':2,'stick':6},
			'gather':{'stick':1},
		},
		affectedBy:['deforestation'],
		mult:5,
	});
	new G.Goods({
		name:'dead tree',
		desc:'While an ornery sight, [dead tree]s are an adequate source of dry [log]s and [stick]s.',
		icon:[9,10],
		res:{
			'chop':{'log':1,'stick':2},
			'gather':{'stick':0.5},
		},
		affectedBy:['deforestation'],
		mult:5,
	});
	new G.Goods({
		name:'berry bush',
		desc:'[berry bush,Berry bushes] can be foraged for [fruit]s, [stick]s and sometimes [herb]s.',
		icon:[4,10],
		res:{
			'gather':{'fruit':3,'stick':0.5,'herb':0.25},
		},
		affectedBy:['scarce forageables'],
		mult:10,
	});
	new G.Goods({
		name:'forest mushrooms',
		desc:'[forest mushrooms] grow in the penumbra of the underbrush, and often yield all sorts of interesting [herb]s.',
		icon:[5,10],
		res:{
			'gather':{'herb':4},
		},
		affectedBy:['scarce forageables'],
		mult:10,
	});
	new G.Goods({
		name:'succulents',
		desc:'Hardy cactii that grow in the desert. While tricky to harvest, [succulents] can provide [herb]s and [fruit]s.',
		icon:[6,10],
		res:{
			'gather':{'fruit':1,'herb':3},
			'flowers':{'cactus':1,'Crown imperial':0.25},
		},
		affectedBy:['scarce forageables'],
		mult:10,
	});
	new G.Goods({
		name:'jungle fruits',
		desc:'[jungle fruits] come in all shapes, colors and sizes, and will yield [fruit]s and [herb]s to those who forage them.',
		icon:[7,10],
		res:{
			'gather':{'fruit':2,'herb':1},
		},
		affectedBy:['scarce forageables'],
		mult:10,
	});
	//animals
	new G.Goods({
		name:'wild rabbits',
		desc:'[wild rabbits] are quick and hard to catch, and yield a little [meat], [bone]s and [hide]s.//Carcasses can sometimes be gathered for [spoiled food].',
		icon:[0,11],
		res:{
			'gather':{'spoiled food':0.5},
			'hunt':{'meat':2,'bone':0.2,'hide':0.2},
		},
		affectedBy:['over hunting'],
		mult:5,
	});
	new G.Goods({
		name:'stoats',
		desc:'Besides being a source of high-quality [hide,Furs], these carnivorous mammals can provide [meat] and [bone]s.//Carcasses can sometimes be gathered for [spoiled food].',
		icon:[1,11],
		res:{
			'gather':{'spoiled food':0.5},
			'hunt':{'meat':2,'bone':0.2,'hide':1},
		},
		affectedBy:['over hunting'],
		mult:5,
	});
	new G.Goods({
		name:'koalas',
		desc:'While they are placid leaf-eaters, these tree-dwelling mammals have been rumored to drop down on unsuspecting passersby. They can be hunted for [meat], [bone]s and [hide]s.//Carcasses can sometimes be gathered for [spoiled food].',
		icon:[2,11],
		res:{
			'gather':{'spoiled food':0.5},
			'hunt':{'meat':2,'bone':0.2,'hide':0.2},
		},
		affectedBy:['over hunting'],
		mult:5,
	});
	new G.Goods({
		name:'deer',
		desc:'Forest herbivores that live in herds; good source of [meat], [bone]s and [hide]s.//Carcasses can sometimes be gathered for [spoiled food].',
		icon:[3,11],
		res:{
			'gather':{'spoiled food':1},
			'hunt':{'meat':4,'bone':1,'hide':0.6},
		},
		affectedBy:['over hunting'],
		mult:5,
	});
	new G.Goods({
		name:'bears',
		desc:'Large omnivorous mammals that hibernate in cold seasons; fearsome in battle. Yield plenty of [meat], [bone]s and large [hide]s.//Carcasses can sometimes be gathered for [spoiled food].',
		icon:[5,11],
		res:{
			'gather':{'spoiled food':1},
			'hunt':{'meat':4,'bone':1,'hide':1},
		},
		affectedBy:['over hunting'],
		mult:5,
	});
	new G.Goods({
		name:'polar bears',
		desc:'Large omnivorous mammals that live in snowy regions; fierce hunters. Yield plenty of [meat], [bone]s and large [hide]s.//Carcasses can sometimes be gathered for [spoiled food].',
		icon:[10,11],
		res:{
			'gather':{'spoiled food':1},
			'hunt':{'meat':4,'bone':1,'hide':1},
		},
		affectedBy:['over hunting'],
		mult:5,
	});
	new G.Goods({
		name:'boars',
		desc:'Omnivorous mammals armed with tusks; provide [meat], [bone]s and [hide]s.//Carcasses can sometimes be gathered for [spoiled food].',
		icon:[4,11],
		res:{
			'gather':{'spoiled food':1},
			'hunt':{'meat':3,'bone':1,'hide':0.5},
		},
		affectedBy:['over hunting'],
		mult:5,
	});
	new G.Goods({
		name:'foxes',
		desc:'These sly hunters can be butchered for [meat], [bone]s and [hide]s.//Carcasses can sometimes be gathered for [spoiled food].',
		icon:[6,11],
		res:{
			'gather':{'spoiled food':0.5},
			'hunt':{'meat':2,'bone':0.2,'hide':0.5},
		},
		affectedBy:['over hunting'],
		mult:5,
	});
	new G.Goods({
		name:'wolves',
		desc:'Ferocious carnivores that hunt in packs; a dangerous source of [meat], [bone]s and [hide]s.//Carcasses can sometimes be gathered for [spoiled food].',
		icon:[7,11],
		res:{
			'gather':{'spoiled food':0.5},
			'hunt':{'meat':3,'bone':0.5,'hide':0.5},
		},
		affectedBy:['over hunting'],
		mult:5,
	});
	new G.Goods({
		name:'seals',
		desc:'Carnivorous semi-aquatic mammal; provides [meat], [bone]s and [hide]s.//Carcasses can sometimes be gathered for [spoiled food].',
		icon:[9,11],
		res:{
			'gather':{'spoiled food':1},
			'hunt':{'meat':3,'bone':0.5,'hide':0.5},
		},
		affectedBy:['over hunting'],
		mult:5,
	});
	new G.Goods({
		name:'wild bugs',
		displayName:'Bugs',
		desc:'[wild bugs,Bugs] are ubiquitious and easy to capture.',
		icon:[8,11],
		res:{
			'gather':{'bugs':2},
		},
		//affectedBy:['over hunting'],
		mult:5,
	});
	new G.Goods({
		name:'saltwater fish',
		desc:'Fish of every size and color.//A source of [seafood].',
		icon:[11,11],
		res:{
			'gather':{'seafood':0.03},
			'fish':{'seafood':3},
		},
		affectedBy:['over fishing'],
		mult:5,
	});
	new G.Goods({
		name:'freshwater fish',
		desc:'Fish that live in streams and rivers.//A source of [seafood].',
		icon:[12,11],
		res:{
			'gather':{'seafood':0.03},
			'fish':{'seafood':3},
		},
		affectedBy:['over fishing'],
		mult:5,
	});
	new G.Goods({
		//TODO
		name:'clams',
		desc:'Bivalves and other assorted shells.//A source of [seafood], fairly easy to gather.',
		icon:[0,0],
		res:{
			'gather':{'seafood':0.5},
			'fish':{'seafood':1},
		},
		affectedBy:['over fishing'],
		mult:5,
	});
	new G.Goods({
		//TODO
		name:'crabs',
		desc:'Skittish crustaceans that walk sideways.//A source of [seafood].',
		icon:[0,0],
		res:{
			'gather':{'seafood':0.1},
			'fish':{'seafood':2},
		},
		affectedBy:['over fishing'],
		mult:5,
	});
	//substrates
	new G.Goods({
		name:'rocky substrate',
		desc:'A [rocky substrate] is found underneath most terrain types.//Surface [stone]s may be gathered by hand.//Digging often produces [mud], more [stone]s and occasionally [copper ore,Ores] and [clay].//Mining provides the best results, outputting a variety of [stone]s, rare [gold ore,Ores], and precious [gems].',
		icon:[11,10],
		res:{
			'gather':{'stone':0.25,'clay':0.005,'limestone':0.005},
			'dig':{'mud':2,'clay':0.15,'stone':0.6,'copper ore':0.01,'tin ore':0.01,'limestone':0.1,'salt':0.05},
			'mine':{'stone':1,'copper ore':0.1,'tin ore':0.1,'iron ore':0.05,'gold ore':0.005,'coal':0.1,'salt':0.1,'gems':0.005},
			'quarry':{'cut stone':1,'limestone':0.5,'marble':0.01},
		},
		affectedBy:['mineral depletion'],
		noAmount:true,
		mult:5,
	});
	new G.Goods({
		name:'snow cover',
		desc:'A [snow cover] is often available year-long in cold environments, and is a good source of [water]; it may also conceal [ice], which must be dug out.',
		icon:[13,10],
		res:{
			'gather':{'water':4,'muddy water':8},
			'dig':{'ice':0.2},
		},
		mult:5,
	});
	new G.Goods({
		name:'sandy soil',
		desc:'[sandy soil] is the result of a [rocky substrate] eroded by wind over long periods of time. [sand] is plentiful here.',
		icon:[12,10],
		res:{
			'dig':{'sand':1},
		},
		noAmount:true,
		mult:5,
	});
	//liquids
	new G.Goods({
		name:'saltwater',
		desc:'[saltwater] cannot be collected for [water], but may produce [salt] deposits.',
		icon:[14,10],
		res:{
			'gather':{'salt':0.05},
		},
		noAmount:true,
		mult:5,
	});
	new G.Goods({
		name:'freshwater',
		desc:'[freshwater], whether found in streams or from rainwater, can be collected for [water] and [muddy water].',
		icon:[15,10],
		res:{
			'gather':{'water':8,'muddy water':8},
		},
		mult:5,
	});
		new G.Goods({
		name:'swampflowers',
		desc:'Swampflowers like cattail are common goods that can be found in swamps.',
		icon:[7,23,'magixmod'],
		res:{
			'flowers':{'Cattail':1,'Blue orchid':1,'Daisy':0.25},
			'gather':{'muddy water':1}
		},
		mult:5,
	});
	//Magix goods
		new G.Goods({
		name:'rb1',
		displayName:'Rosebush',
		desc:'A bush filled with [Pink rose,Roses] . [Cockscomb] can be found in them too.',
		icon:[8,23,'magixmod'],
		res:{
			'flowers':{'Cockscomb':0.5,'Cyan rose':1,'Gray rose':1},
		},
		mult:3,
	});
			new G.Goods({
		name:'rb2',
		displayName:'Rosebush',
		desc:'A bush filled with [Lime rose,Roses] . Rarely [Salvia] can be found there.',
		icon:[9,23,'magixmod'],
		res:{
			'flowers':{'Lime rose':1,'Pink rose':1,'Salvia':0.25},
		},
		mult:3,
	});
		new G.Goods({
		name:'vfb1',
		displayName:'Various flowers bush',
		desc:'Various types of flowers can be found in this bush.',
		icon:[10,23,'magixmod'],
		res:{
			'flowers':{'Brown flower':0.75,'Bachelor\'s button':0.75,'Coreopsis':0.75,'Cosmos':0.75,'Flax':1,'Dandelion':0.1},
		},
		mult:3,
	});
		new G.Goods({
		name:'vfb2',
		displayName:'Various flowers bush',
		desc:'Various types of flowers can be found in this bush.',
		icon:[10,23,'magixmod'],
		res:{
			'flowers':{'Green Zinnia':0.75,'Azure bluet':0.75,'Black Hollyhock':0.75,'Sunflower':1,'Himalayan blue poopy':0.75},
		},
		mult:3,
	});
		new G.Goods({
		name:'bush of tulips',
		desc:'This bush contains a lot of [White tulip,Tulips].',
		icon:[12,23,'magixmod'],
		res:{
			'flowers':{'Gray tulip':1,'Red tulip':1,'Pink tulip':1,'Lime tulip':1,'White tulip':1},
		},
		mult:3,
	});
	//Swamplands
		new G.Goods({
		name:'crocodiles',
		desc:'Crocodiles are large semiaquatic reptiles that live throughout the tropics especially swamplands. Source of [meat] and [leather] .//Carcasses can sometimes be gathered for [spoiled food].',
		icon:[17,24,'magixmod'],
		res:{
			'hunt':{'leather':0.5,'meat':2},
			'gather':{'spoiled food':1},
		},
		mult:2,
	});
		new G.Goods({
		name:'willow',
		desc:'The [willow,Willow tree] tends to grow in lush, wet climates and can be chopped for [log]s and harvested for [stick]s.',
		icon:[20,24,'magixmod'],
		res:{
			'chop':{'log':2,'stick':4},
			'gather':{'stick':1},
		},
		affectedBy:['deforestation'],
		mult:5,
	});
		new G.Goods({
		name:'mangrove',
		desc:'Similar to [willow], the [mangrove,Mangrove tree] tends to grow in lush, wet climates and can be chopped for [log]s and harvested for [stick]s.',
		icon:[18,24,'magixmod'],
		res:{
			'chop':{'log':2,'stick':5},
			'gather':{'stick':1.1},
		},
		affectedBy:['deforestation'],
		mult:5,
	});
	//Lavender fields
		new G.Goods({
		name:'lavender',
		desc:'Nice flower that has relaxing smell and can be used in aromatherapy. Except [Lavender] you may find many other types of [Flowers].',
		icon:[0,9,'magixmod'],
		res:{
			'flowers':{'Lavender':4,'Dianella':0.2,'Black lily':0.35},
		},
		mult:1,
	});
		G.getDict('grass').res['gather']['vegetable']=0.001;
		G.getDict('palm tree').res['gather']['Bamboo']=0.0000035;
		G.getDict('jungle fruits').res['gather']['Watermelon']=0.00004;
		G.getDict('rocky substrate').res['mine']['Various stones']=0.075;
		G.getDict('rocky substrate').res['quarry']['Various cut stones']=0.07;
	new G.Goods({
		name:'jacaranda',
		desc:'The [jacaranda,Jacaranda tree] appears only at <b>Lavender fields</b> and grows in temperate climate. //Can be chopped for [log]s and harvested for [stick]s.',
		icon:[19,24,'magixmod'],
		res:{
			'chop':{'log':2,'stick':4},
			'gather':{'stick':1},
		},
		affectedBy:['deforestation'],
		mult:5,
	});
		new G.Goods({
		name:'Ice',
		desc:'Only in iceberg you can find so much [ice] . It is so coooldddd.... Brrr...',
		icon:[21,24,'magixmod'],
		res:{
			'dig':{'ice':2.25},
		},
		affectedBy:['mineral depletion'],
		mult:2,
	});
				new G.Goods({
		name:'sugar cane',
		desc:'Wet land where [Sugar cane] can live and grow. Can be found at lush biomes and amount of sugar cane is not constant. At some lands you may spot that [Sugar cane] is scarce while somewhere else it is plenty.',
		icon:[31,22,'magixmod'],
		res:{
			'gather':{'Sugar cane':0.000002},
		},
		mult:1,
	});
	/*=====================================================================================
	TILE EFFECTS
	=======================================================================================*/
	//TODO : implement
	new G.TileEffect({
		name:'deforestation',
		desc:'This is the result of too much woodcutting in an area.//Having this effect on a tile lowers the quantity of trees it provides.//If woodcutting is halted, this effect will slowly subside as trees grow back over time, if the deforestation isn\'t too severe.',
		visibleAt:100,
	});
	new G.TileEffect({
		name:'mineral depletion',
		desc:'This is the result of too much mining and digging in an area.//Having this effect on a tile lowers the quantity of minerals it provides.//If mining and digging are halted, this effect will slowly subside as more ore nodes are discovered.',
		visibleAt:100,
	});
	new G.TileEffect({
		name:'over hunting',
		desc:'This is the result of too much hunting in an area.//Having this effect on a tile lowers the quantity of animals it provides.//If hunting is halted, this effect will slowly subside as animal population recovers over time, if there is enough of it left.',
		visibleAt:100,
	});
	new G.TileEffect({
		name:'over fishing',
		desc:'This is the result of too much fishing in an area.//Having this effect on a tile lowers the quantity of sea creatures it provides.//If fishing is halted, this effect will slowly subside as wildlife population recovers over time, if there is enough of it left.',
		visibleAt:100,
	});
	new G.TileEffect({
		name:'scarce forageables',
		desc:'This is the result of too much foraging in an area.//Having this effect on a tile lowers the quantity of all forageables it provides.//If foraging is halted, this effect will slowly subside.',
		visibleAt:100,
	});
	new G.TileEffect({
		name:'reserve',
		desc:'A [reserve] prevents any resource extraction from this tile, letting depleted resources heal over.',
	});
	/*=====================================================================================
	MAP GENERATOR
	=======================================================================================*/
	G.funcs['create map']=function(w,h)
	{
		//generate basic geography using Conway's Game of Life (rule : births from 4 to 9 neighbors, survival from 6 to 9 neighbors)
		
		var generate=function(w,h)
		{
			var getAt=function(map,x,y)
			{
				//if (x<0||x>=map.length||y<0||y>=map[0].length) return 0;
				//wrap around so we don't get big empty spots on the edges (as a bonus, this creates donut-shaped worlds)
				if (x<0) x+=map.length;
				else if (x>=map.length) x-=map.length;
				if (y<0) y+=map[0].length;
				else if (y>=map[0].length) y-=map[0].length;
				return map[x][y];
			}
			
			//init map
			var lvl=[];
			for (var x=0;x<w;x++)
			{
				lvl[x]=[];
				for (var y=0;y<h;y++)
				{
					lvl[x][y]=Math.random()<0.5?1:0;
				}
			}
			
			//init buffer
			var lvlBuffer=[];
			for (var x=0;x<w;x++){lvlBuffer[x]=[];for (var y=0;y<h;y++){lvlBuffer[x][y]=0;}}
			
			var passes=1;
			for (var i=0;i<passes;i++)
			{
				//live
				for (var x=0;x<w;x++)
				{
					for (var y=0;y<h;y++)
					{
						var n=getAt(lvl,x-1,y)+getAt(lvl,x-1,y-1)+getAt(lvl,x,y-1)+getAt(lvl,x+1,y-1)+getAt(lvl,x+1,y)+getAt(lvl,x+1,y+1)+getAt(lvl,x,y+1)+getAt(lvl,x-1,y+1);
						var on=lvl[x][y];
						if (on && n>=4 && n<=9) on=1; else on=0;
						if (!on && n>=6 && n<=9) on=1;
						if (Math.random()<0.05) on=Math.random()<0.5?1:0;//just a bit of extra randomness
						lvlBuffer[x][y]=on;
					}
				}
				//copy buffer back
				for (var x=0;x<w;x++){for (var y=0;y<h;y++){lvl[x][y]=lvlBuffer[x][y];}}
			}
			
			return lvl;
		}
		
		var getStrAt=function(map,x,y)
		{
			if (x<0||x>=map.length-1||y<0||y>=map[0].length-1) return 'out';
			return map[x][y];
		}
		var getAt=function(map,x,y)
		{
			if (x<0||x>=map.length-1||y<0||y>=map[0].length-1) return 0.5;
			return map[x][y];
		}
		
		var landTiles=[];
		var seaTiles=[];
		var fit=false;
		i=0;
		while (i<20 && fit==false)//discard any map with less than 30% or more than 50% land
		{
			var lvl=generate(w,h);
			
			landTiles=[];
			seaTiles=[];
			for (var x=0;x<w;x++)
			{
				for (var y=0;y<h;y++)
				{
					if (lvl[x][y]==0) seaTiles.push([x,y]);
					else landTiles.push([x,y]);
				}
			}
			var total=landTiles.length+seaTiles.length;
			if (landTiles.length/total>0.3 && landTiles.length/total<0.5) fit=true;
			i++;
		}
		
		//translate into terrain
		for (var x=0;x<w;x++)
		{
			for (var y=0;y<h;y++)
			{
				var land='ocean';
				if (lvl[x][y]==0) land='ocean';
				else if (lvl[x][y]==1)
				{
					land='none';
				}
				lvl[x][y]=land;
			}
		}
		
		//precipitation map
		//generate more humidity over sea, less in land - with some variance
		//on tiles with low humidity, 30% of the time, add some huge variance
		//then, blur the map so that coasts get some humidity and variance can spread
		var wet=[];
		for (var x=0;x<w;x++)
		{
			wet[x]=[];
			for (var y=0;y<h;y++)
			{
				wet[x][y]=(lvl[x][y]=='ocean'?0.8:0.2)+Math.random()*0.1-0.1/2;
				if (Math.random()<0.3 && wet[x][y]<0.5) wet[x][y]+=Math.random()*5-2.5;
			}
		}
		for (var x=0;x<w;x++)//blur
		{
			for (var y=0;y<h;y++)
			{
				var variance=0.05;
				var n=getAt(wet,x-1,y)+getAt(wet,x-1,y-1)+getAt(wet,x,y-1)+getAt(wet,x+1,y-1)+getAt(wet,x+1,y)+getAt(wet,x+1,y+1)+getAt(wet,x,y+1)+getAt(wet,x-1,y+1);
				wet[x][y]=(wet[x][y]+n)/9+Math.random()*variance-variance/2;
			}
		}
		//temperature map. why not
		var jumble=false;
		if (!jumble)
		{
			//vertical sine wave (so we get hot equator and cold poles), with some variance
			//humidity lowers temperature by a bit
			var temp=[];
			for (var x=0;x<w;x++)
			{
				temp[x]=[];
				for (var y=0;y<h;y++)
				{
					var variance=0.15;
					temp[x][y]=Math.sin(((y+0.5)/h-0.25)*Math.PI*2)/2+(lvl[x][y]=='ocean'?0.6:0.5)-(wet[x][y])*0.15+Math.random()*variance-variance/2;
				}
			}
		}
		else
		{
			//temperature spawns in big blobs of cold and hot
			var temp=[];
			for (var x=0;x<w;x++)
			{
				temp[x]=[];
				for (var y=0;y<h;y++)
				{
					temp[x][y]=0.65+Math.random()*0.1-0.1/2-wet[x][y]*0.15;
					if (Math.random()<0.5) temp[x][y]+=Math.random()*10-5;
				}
			}
			for (var i=0;i<2;i++)//blur
			{
				for (var x=0;x<w;x++)
				{
					for (var y=0;y<h;y++)
					{
						var variance=0.05;
						var n=getAt(temp,x-1,y)+getAt(temp,x-1,y-1)+getAt(temp,x,y-1)+getAt(temp,x+1,y-1)+getAt(temp,x+1,y)+getAt(temp,x+1,y+1)+getAt(temp,x,y+1)+getAt(temp,x-1,y+1);
						temp[x][y]=(temp[x][y]+n)/9+Math.random()*variance-variance/2;
					}
				}
			}
		}
		
		//biomes
		for (var x=0;x<w;x++)
		{
			for (var y=0;y<h;y++)
			{
				var tempTile=temp[x][y];
				var wetTile=wet[x][y];
				var landTile=lvl[x][y];
				
				var biomes=[];
				if (tempTile<-0.1275)
				{
					biomes.push('glacier');
				}
				else if (tempTile<-0.1 && tempTile>-0.1275)
				{
					if (landTile=='ocean') biomes.push('arctic ocean');
					else biomes.push('ice desert');
				}
				else if (tempTile<0.15)
				{
					if (landTile=='ocean') biomes.push('arctic ocean');
					else if (wetTile<0.25) biomes.push('ice desert');
					else if (wetTile>0.5 && wetTile<0.75) biomes.push('boreal forest');
					else if (wetTile>0.75) biomes.push('swamplands');
					else biomes.push('tundra');
				}
				else if (tempTile>1.1)
				{
					if (landTile=='ocean') biomes.push('tropical ocean');
					else biomes.push('desert');
				}
				else if (tempTile>0.85)
				{
					if (landTile=='ocean') biomes.push('tropical ocean');
					else if (wetTile<0.25) biomes.push('desert');
					else if (wetTile>0.5) biomes.push('jungle');
					else biomes.push('savanna');
				}
				else
				{
					if (landTile=='ocean') biomes.push('ocean');
					else if (wetTile<0.25) biomes.push('shrubland');
					else if (wetTile>0.5 && wetTile<0.74) biomes.push('forest');
					else if (wetTile>0.74) biomes.push('lavender fields');
					else biomes.push('prairie');
				}
				if (biomes.length==0) biomes.push('prairie');
				lvl[x][y]=choose(biomes);
			}
		}
		
		for (var x=0;x<w;x++)//clean all tiles with no terrain
		{
			for (var y=0;y<h;y++)
			{
				if (lvl[x][y]=='none') lvl[x][y]='forest';
			}
		}
		return lvl;
	}
}
});
