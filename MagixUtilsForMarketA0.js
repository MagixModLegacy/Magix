G.AddData({
name:'Magix utils for market',
author:'pelletsstarPL',
desc:'Utilities for Bruno Supremo\'s market mod.',
engineVersion:1,
requires:['Default dataset*','Market mod'],
func:function(){
	/////////////////////////////
	//SELL            MARKET   //
	/////////////////////////////
G.getDict('market_sell').modes['magic essences']={
			name:'Magic essences',
			icon:[20,13,'magixmod'],
			desc:'Sell [Magic essences] for [market_coin].',
			req:{'Essence trading':true}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Magic essences':1000,
			},
			into:{
				'market_coin':20
			},
			every:5,
			mode:'magic essences'
		});
	G.getDict('market_sell').modes['le']={
			name:'L.e.',
			icon:[0,3,'magixmod'],
			desc:'Sell [Lightning essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Lightning essence':1000,
			},
			into:{
				'market_coin':60
			},
			every:5,
			mode:'le'
		});
		G.getDict('market_sell').modes['fe']={
			name:'F.e.',
			icon:[0,2,'magixmod'],
			desc:'Sell [Fire essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Fire essence':1000,
			},
			into:{
				'market_coin':60
			},
			every:5,
			mode:'fe'
		});
		G.getDict('market_sell').modes['we']={
			name:'W.e.',
			icon:[0,1,'magixmod'],
			desc:'Sell [Water essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Water essence':1000,
			},
			into:{
				'market_coin':60
			},
			every:5,
			mode:'we'
		});
	G.getDict('market_sell').modes['de']={
			name:'D.e.',
			icon:[1,3,'magixmod'],
			desc:'Sell [Dark essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Dark essence':1000,
			},
			into:{
				'market_coin':60
			},
			every:5,
			mode:'de'
		});
	G.getDict('market_sell').modes['wie']={
			name:'Wi.e.',
			icon:[1,1,'magixmod'],
			desc:'Sell [Wind essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Wind essence':1000,
			},
			into:{
				'market_coin':60
			},
			every:5,
			mode:'wie'
		});
	G.getDict('market_sell').modes['ne']={
			name:'N.e.',
			icon:[1,2,'magixmod'],
			desc:'Sell [Nature essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Nature essence':1000,
			},
			into:{
				'market_coin':60
			},
			every:5,
			mode:'ne'
		});
	G.getDict('market_sell').modes['he']={
			name:'H.e.',
			icon:[20,6,'magixmod'],
			desc:'Sell [Essence of the Holiness] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Essence of the Holiness':1000,
			},
			into:{
				'market_coin':60
			},
			every:5,
			mode:'he'
		});
	G.getDict('market_sell').modes['othercutstone']={
			name:'Various cut stone',
			icon:[2,12,'magixmod'],
			desc:'Sell [Various cut stones] for [market_coin].',
			req:{'extended basic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Various cut stones':100,
			},
			into:{
				'market_coin':75
			},
			every:5,
			mode:'othercutstone'
		});
	G.getDict('market_sell').modes['otherstone']={
			name:'Various stones',
			icon:[3,12,'magixmod'],
			desc:'Sell [Various stones] for [market_coin].',
			req:{'extended archaic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Various stones':100,
			},
			into:{
				'market_coin':75
			},
			every:5,
			mode:'otherstone'
		});
		G.getDict('market_sell').modes['bamboo']={
			name:'Bamboo',
			icon:[14,4,'magixmod'],
			desc:'Sell [Bamboo] for [market_coin].',
			req:{'extended archaic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Bamboo':100,
			},
			into:{
				'market_coin':50
			},
			every:5,
			mode:'bamboo'
		});
		G.getDict('market_sell').modes['platblock']={
			name:'Platinum block',
			icon:[4,11,'magixmod'],
			desc:'Sell [platinum block] for [market_coin].',
			req:{'extended precious catalog':'on','Mo\' tradez':true}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'platinum block':100,
			},
			into:{
				'market_coin':300
			},
			every:5,
			mode:'platblock'
		});
		G.getDict('market_sell').modes['sugarc']={
			name:'Sugar cane',
			icon:[15,4,'magixmod'],
			desc:'Sell [Sugar cane] for [market_coin].',
			req:{'Mo\' tradez':true}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Sugar cane':100,
			},
			into:{
				'market_coin':15
			},
			every:1,
			mode:'sugarc'
		});
		G.getDict('market_sell').modes['flower']={
			name:'Flowers',
			icon:[11,8,'magixmod'],
			desc:'Sell [Flowers] for [market_coin].',
			req:{'Mo\' tradez':true}
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'Flowers':100,
			},
			into:{
				'market_coin':5
			},
			every:2,
			mode:'flower'
		});
	/////////////////////////////////////////////////////////
	//BUY                  MARKET                          //
	/////////////////////////////////////////////////////////
	G.getDict('market_buy').modes['magic essences']={
			name:'Magic essences',
			icon:[20,13,'magixmod'],
			desc:'Buy [Magic essences] with [market_coin].',
			req:{'Essence trading':true}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				
				'market_coin':100
			},
			into:{
				'Magic essences':500,
			},
			every:5,
			mode:'magic essences'
		});
	G.getDict('market_buy').modes['le']={
			name:'L.e.',
			icon:[0,3,'magixmod'],
			desc:'Buy [Lightning essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':350
			},
			into:{
				
				'Lightning essence':100,
			},
			every:5,
			mode:'le'
		});
		G.getDict('market_buy').modes['fe']={
			name:'F.e.',
			icon:[0,2,'magixmod'],
			desc:'Buy [Fire essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':350
			},
			into:{
				'Fire essence':100,
			},
			every:5,
			mode:'fe'
		});
		G.getDict('market_buy').modes['we']={
			name:'W.e.',
			icon:[0,1,'magixmod'],
			desc:'Buy [Water essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':350
			},
			into:{
				
				'Water essence':100,
			},
			every:5,
			mode:'we'
		});
	G.getDict('market_buy').modes['de']={
			name:'D.e.',
			icon:[1,3,'magixmod'],
			desc:'Buy [Dark essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':350
			},
			into:{
				'Dark essence':100,
			},
			every:5,
			mode:'de'
		});
	G.getDict('market_buy').modes['wie']={
			name:'Wi.e.',
			icon:[1,1,'magixmod'],
			desc:'Buy [Wind essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':350
			},
			into:{
				'Wind essence':100,
			},
			every:5,
			mode:'wie'
		});
	G.getDict('market_buy').modes['ne']={
			name:'N.e.',
			icon:[1,2,'magixmod'],
			desc:'Buy [Nature essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':350
			},
			into:{
				'Nature essence':100,
			},
			every:5,
			mode:'ne'
		});
	G.getDict('market_buy').modes['he']={
			name:'H.e.',
			icon:[20,6,'magixmod'],
			desc:'Buy [Essence of the Holiness] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':350
			},
			into:{
				'Essence of the Holiness':100,
			},
			every:5,
			mode:'he'
		});
	G.getDict('market_buy').modes['othercutstone']={
			name:'Various cut stone',
			icon:[2,12,'magixmod'],
			desc:'Buy [Various cut stones] with [market_coin].',
			req:{'extended basic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':85
				
			},
			into:{
				'Various cut stones':100,
			},
			every:5,
			mode:'othercutstone'
		});
	G.getDict('market_buy').modes['otherstone']={
			name:'Various stones',
			icon:[3,12,'magixmod'],
			desc:'Buy [Various stones] with [market_coin].',
			req:{'extended archaic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':20
			},
			into:{
				'Various stones':100,
			},
			every:5,
			mode:'otherstone'
		});
		G.getDict('market_buy').modes['bamboo']={
			name:'Bamboo',
			icon:[14,4,'magixmod'],
			desc:'Buy [Bamboo] with [market_coin].',
			req:{'extended archaic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':15
			},
			into:{
				'Bamboo':100,
			},
			every:5,
			mode:'bamboo'
		});
		G.getDict('market_buy').modes['platblock']={
			name:'Platinum block',
			icon:[4,11,'magixmod'],
			desc:'Buy [platinum block] with [market_coin].',
			req:{'extended precious catalog':'on','Mo\' tradez':true}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':400
			},
			into:{
				'platinum block':100,
			},
			every:5,
			mode:'platblock'
		});
		G.getDict('market_buy').modes['sugarc']={
			name:'Sugar cane',
			icon:[15,4,'magixmod'],
			desc:'Buy [Sugar cane] with [market_coin].',
			req:{'Mo\' tradez':true}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':8
			},
			into:{
				'Sugar cane':100,
			},
			every:1,
			mode:'sugarc'
		});
		G.getDict('market_buy').modes['flower']={
			name:'Flowers',
			icon:[11,8,'magixmod'],
			desc:'Buy [Flowers] with [market_coin].',
			req:{'Mo\' tradez':true}
		};
		G.getDict('market_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':5
			},
			into:{
				'Flowers':100,
			},
			every:2,
			mode:'flower'
		});
	///////////////////////////////////////
	//SELL                   BAZAAR      //
	///////////////////////////////////////
	G.getDict('bazaar_sell').modes['magic essences']={
			name:'Magic essences',
			icon:[20,13,'magixmod'],
			desc:'Sell [Magic essences] for [market_coin].',
			req:{'Essence trading':true}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Magic essences':100,
			},
			into:{
				'market_coin':2
			},
			every:5,
			mode:'magic essences'
		});
	G.getDict('bazaar_sell').modes['le']={
			name:'L.e.',
			icon:[0,3,'magixmod'],
			desc:'Sell [Lightning essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Lightning essence':100,
			},
			into:{
				'market_coin':6
			},
			every:5,
			mode:'le'
		});
		G.getDict('bazaar_sell').modes['fe']={
			name:'F.e.',
			icon:[0,2,'magixmod'],
			desc:'Sell [Fire essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Fire essence':100,
			},
			into:{
				'market_coin':6
			},
			every:5,
			mode:'fe'
		});
		G.getDict('bazaar_sell').modes['we']={
			name:'W.e.',
			icon:[0,1,'magixmod'],
			desc:'Sell [Water essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Water essence':100,
			},
			into:{
				'market_coin':6
			},
			every:5,
			mode:'we'
		});
	G.getDict('bazaar_sell').modes['de']={
			name:'D.e.',
			icon:[1,3,'magixmod'],
			desc:'Sell [Dark essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Dark essence':100,
			},
			into:{
				'market_coin':6
			},
			every:5,
			mode:'de'
		});
	G.getDict('bazaar_sell').modes['wie']={
			name:'Wi.e.',
			icon:[1,1,'magixmod'],
			desc:'Sell [Wind essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Wind essence':100,
			},
			into:{
				'market_coin':6
			},
			every:5,
			mode:'wie'
		});
	G.getDict('bazaar_sell').modes['ne']={
			name:'N.e.',
			icon:[1,2,'magixmod'],
			desc:'Sell [Nature essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Nature essence':100,
			},
			into:{
				'market_coin':6
			},
			every:5,
			mode:'ne'
		});
	G.getDict('bazaar_sell').modes['he']={
			name:'H.e.',
			icon:[20,6,'magixmod'],
			desc:'Sell [Essence of the Holiness] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Essence of the Holiness':100,
			},
			into:{
				'market_coin':6
			},
			every:5,
			mode:'he'
		});
	G.getDict('bazaar_sell').modes['othercutstone']={
			name:'Various cut stone',
			icon:[2,12,'magixmod'],
			desc:'Sell [Various cut stones] for [market_coin].',
			req:{'extended basic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Various cut stones':10,
			},
			into:{
				'market_coin':7.5
			},
			every:5,
			mode:'othercutstone'
		});
	G.getDict('bazaar_sell').modes['otherstone']={
			name:'Various stones',
			icon:[3,12,'magixmod'],
			desc:'Sell [Various stones] for [market_coin].',
			req:{'extended archaic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Various stones':10,
			},
			into:{
				'market_coin':1.5
			},
			every:5,
			mode:'otherstone'
		});
		G.getDict('bazaar_sell').modes['bamboo']={
			name:'Bamboo',
			icon:[14,4,'magixmod'],
			desc:'Sell [Bamboo] for [market_coin].',
			req:{'extended archaic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Bamboo':10,
			},
			into:{
				'market_coin':1.5
			},
			every:5,
			mode:'bamboo'
		});
		G.getDict('bazaar_sell').modes['platblock']={
			name:'Platinum block',
			icon:[4,11,'magixmod'],
			desc:'Sell [platinum block] for [market_coin].',
			req:{'extended precious catalog':'on','Mo\' tradez':true}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'platinum block':10,
			},
			into:{
				'market_coin':30
			},
			every:5,
			mode:'platblock'
		});
		G.getDict('bazaar_sell').modes['sugarc']={
			name:'Sugar cane',
			icon:[15,4,'magixmod'],
			desc:'Sell [Sugar cane] for [market_coin].',
			req:{'Mo\' tradez':true}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Sugar cane':10,
			},
			into:{
				'market_coin':0.8
			},
			every:1,
			mode:'sugarc'
		});
		G.getDict('bazaar_sell').modes['flower']={
			name:'Flowers',
			icon:[11,8,'magixmod'],
			desc:'Sell [Flowers] for [market_coin].',
			req:{'Mo\' tradez':true}
		};
		G.getDict('bazaar_sell').effects.push({
			type:'convert',
			from:{
				'Flowers':100,
			},
			into:{
				'market_coin':5
			},
			every:2,
			mode:'flower'
		});
	/////////////////////////////////////////////////////////
	//BUY                               BAZAAR             //
	/////////////////////////////////////////////////////////
	G.getDict('bazaar_buy').modes['magic essences']={
			name:'Magic essences',
			icon:[20,13,'magixmod'],
			desc:'Buy [Magic essences] with [market_coin].',
			req:{'Essence trading':true}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				
				'market_coin':10
			},
			into:{
				'Magic essences':50,
			},
			every:5,
			mode:'magic essences'
		});
	G.getDict('bazaar_buy').modes['le']={
			name:'L.e.',
			icon:[0,3,'magixmod'],
			desc:'Buy [Lightning essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':35
			},
			into:{
				
				'Lightning essence':10,
			},
			every:5,
			mode:'le'
		});
		G.getDict('bazaar_buy').modes['fe']={
			name:'F.e.',
			icon:[0,2,'magixmod'],
			desc:'Buy [Fire essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':35
			},
			into:{
				'Fire essence':10,
			},
			every:5,
			mode:'fe'
		});
		G.getDict('bazaar_buy').modes['we']={
			name:'W.e.',
			icon:[0,1,'magixmod'],
			desc:'Buy [Water essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':35
			},
			into:{
				
				'Water essence':10,
			},
			every:5,
			mode:'we'
		});
	G.getDict('bazaar_buy').modes['de']={
			name:'D.e.',
			icon:[1,3,'magixmod'],
			desc:'Buy [Dark essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':35
			},
			into:{
				'Dark essence':10,
			},
			every:5,
			mode:'de'
		});
	G.getDict('bazaar_buy').modes['wie']={
			name:'Wi.e.',
			icon:[1,1,'magixmod'],
			desc:'Buy [Wind essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':35
			},
			into:{
				'Wind essence':10,
			},
			every:5,
			mode:'wie'
		});
	G.getDict('bazaar_buy').modes['ne']={
			name:'N.e.',
			icon:[1,2,'magixmod'],
			desc:'Buy [Nature essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':35
			},
			into:{
				'Nature essence':10,
			},
			every:5,
			mode:'ne'
		});
	G.getDict('bazaar_buy').modes['he']={
			name:'H.e.',
			icon:[20,6,'magixmod'],
			desc:'Buy [Essence of the Holiness] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':35
			},
			into:{
				'Essence of the Holiness':10,
			},
			every:5,
			mode:'he'
		});
	G.getDict('bazaar_buy').modes['othercutstone']={
			name:'Various cut stone',
			icon:[2,12,'magixmod'],
			desc:'Buy [Various cut stones] with [market_coin].',
			req:{'extended basic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':8
				
			},
			into:{
				'Various cut stones':10,
			},
			every:5,
			mode:'othercutstone'
		});
	G.getDict('bazaar_buy').modes['otherstone']={
			name:'Various stones',
			icon:[3,12,'magixmod'],
			desc:'Buy [Various stones] with [market_coin].',
			req:{'extended archaic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':8
			},
			into:{
				'Various stones':10,
			},
			every:5,
			mode:'otherstone'
		});
		G.getDict('bazaar_buy').modes['bamboo']={
			name:'Bamboo',
			icon:[14,4,'magixmod'],
			desc:'Buy [Bamboo] with [market_coin].',
			req:{'extended archaic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':1
			},
			into:{
				'Bamboo':10,
			},
			every:5,
			mode:'bamboo'
		});
		G.getDict('bazaar_buy').modes['platblock']={
			name:'Platinum block',
			icon:[4,11,'magixmod'],
			desc:'Buy [platinum block] with [market_coin].',
			req:{'extended precious catalog':'on','Mo\' tradez':true}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':40
			},
			into:{
				'platinum block':10,
			},
			every:5,
			mode:'platblock'
		});
		G.getDict('bazaar_buy').modes['sugarc']={
			name:'Sugar cane',
			icon:[15,4,'magixmod'],
			desc:'Buy [Sugar cane] with [market_coin].',
			req:{'Mo\' tradez':true}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':8
			},
			into:{
				'Sugar cane':10,
			},
			every:1,
			mode:'sugarc'
		});
		G.getDict('bazaar_buy').modes['flower']={
			name:'Flowers',
			icon:[11,8,'magixmod'],
			desc:'Buy [Flowers] with [market_coin].',
			req:{'Mo\' tradez':true}
		};
		G.getDict('bazaar_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':5
			},
			into:{
				'Flowers':25,
			},
			every:2,
			mode:'flower'
		});
	///////////////////////////////////////
	//SELL                         TRADER//
	///////////////////////////////////////
	G.getDict('trader_sell').modes['magic essences']={
			name:'Magic essences',
			icon:[20,13,'magixmod'],
			desc:'Sell [Magic essences] for [market_coin].',
			req:{'Essence trading':true}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Magic essences':10,
			},
			into:{
				'market_coin':0.2
			},
			every:5,
			mode:'magic essences'
		});
	G.getDict('trader_sell').modes['le']={
			name:'L.e.',
			icon:[0,3,'magixmod'],
			desc:'Sell [Lightning essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Lightning essence':10,
			},
			into:{
				'market_coin':0.6
			},
			every:5,
			mode:'le'
		});
		G.getDict('trader_sell').modes['fe']={
			name:'F.e.',
			icon:[0,2,'magixmod'],
			desc:'Sell [Fire essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Fire essence':10,
			},
			into:{
				'market_coin':0.6
			},
			every:5,
			mode:'fe'
		});
		G.getDict('trader_sell').modes['we']={
			name:'W.e.',
			icon:[0,1,'magixmod'],
			desc:'Sell [Water essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Water essence':10,
			},
			into:{
				'market_coin':0.6
			},
			every:5,
			mode:'we'
		});
	G.getDict('trader_sell').modes['de']={
			name:'D.e.',
			icon:[1,3,'magixmod'],
			desc:'Sell [Dark essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Dark essence':10,
			},
			into:{
				'market_coin':0.6
			},
			every:5,
			mode:'de'
		});
	G.getDict('trader_sell').modes['wie']={
			name:'Wi.e.',
			icon:[1,1,'magixmod'],
			desc:'Sell [Wind essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Wind essence':10,
			},
			into:{
				'market_coin':0.6
			},
			every:5,
			mode:'wie'
		});
	G.getDict('trader_sell').modes['ne']={
			name:'N.e.',
			icon:[1,2,'magixmod'],
			desc:'Sell [Nature essence] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Nature essence':10,
			},
			into:{
				'market_coin':0.6
			},
			every:5,
			mode:'ne'
		});
	G.getDict('trader_sell').modes['he']={
			name:'H.e.',
			icon:[20,6,'magixmod'],
			desc:'Sell [Essence of the Holiness] for [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Essence of the Holiness':10,
			},
			into:{
				'market_coin':0.6
			},
			every:5,
			mode:'he'
		});
	G.getDict('trader_sell').modes['othercutstone']={
			name:'Various cut stone',
			icon:[2,12,'magixmod'],
			desc:'Sell [Various cut stones] for [market_coin].',
			req:{'extended basic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Various cut stones':1,
			},
			into:{
				'market_coin':0.75
			},
			every:5,
			mode:'othercutstone'
		});
	G.getDict('trader_sell').modes['otherstone']={
			name:'Various stones',
			icon:[3,12,'magixmod'],
			desc:'Sell [Various stones] for [market_coin].',
			req:{'extended archaic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Various stones':1,
			},
			into:{
				'market_coin':0.15
			},
			every:5,
			mode:'otherstone'
		});
		G.getDict('trader_sell').modes['bamboo']={
			name:'Bamboo',
			icon:[14,4,'magixmod'],
			desc:'Sell [Bamboo] for [market_coin].',
			req:{'extended archaic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Bamboo':1,
			},
			into:{
				'market_coin':0.15
			},
			every:5,
			mode:'bamboo'
		});
		G.getDict('trader_sell').modes['platblock']={
			name:'Platinum block',
			icon:[4,11,'magixmod'],
			desc:'Sell [platinum block] for [market_coin].',
			req:{'extended precious catalog':'on','Mo\' tradez':true}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'platinum block':1,
			},
			into:{
				'market_coin':3
			},
			every:5,
			mode:'platblock'
		});
		G.getDict('trader_sell').modes['sugarc']={
			name:'Sugar cane',
			icon:[15,4,'magixmod'],
			desc:'Sell [Sugar cane] for [market_coin].',
			req:{'Mo\' tradez':true}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Sugar cane':1,
			},
			into:{
				'market_coin':0.08
			},
			every:1,
			mode:'sugarc'
		});
		G.getDict('trader_sell').modes['flower']={
			name:'Flowers',
			icon:[11,8,'magixmod'],
			desc:'Sell [Flowers] for [market_coin].',
			req:{'Mo\' tradez':true}
		};
		G.getDict('trader_sell').effects.push({
			type:'convert',
			from:{
				'Flowers':10,
			},
			into:{
				'market_coin':0.5
			},
			every:2,
			mode:'flower'
		});
	/////////////////////////////////////////////////////////
	//BUY                               TRADER             //
	/////////////////////////////////////////////////////////
	G.getDict('trader_buy').modes['magic essences']={
			name:'Magic essences',
			icon:[20,13,'magixmod'],
			desc:'Buy [Magic essences] with [market_coin].',
			req:{'Essence trading':true}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				
				'market_coin':1
			},
			into:{
				'Magic essences':5,
			},
			every:5,
			mode:'magic essences'
		});
	G.getDict('trader_buy').modes['le']={
			name:'L.e.',
			icon:[0,3,'magixmod'],
			desc:'Buy [Lightning essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':3.5
			},
			into:{
				
				'Lightning essence':1,
			},
			every:5,
			mode:'le'
		});
		G.getDict('trader_buy').modes['fe']={
			name:'F.e.',
			icon:[0,2,'magixmod'],
			desc:'Buy [Fire essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':3.5
			},
			into:{
				'Fire essence':1,
			},
			every:5,
			mode:'fe'
		});
		G.getDict('trader_buy').modes['we']={
			name:'W.e.',
			icon:[0,1,'magixmod'],
			desc:'Buy [Water essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':3.5
			},
			into:{
				
				'Water essence':1,
			},
			every:5,
			mode:'we'
		});
	G.getDict('trader_buy').modes['de']={
			name:'D.e.',
			icon:[1,3,'magixmod'],
			desc:'Buy [Dark essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':3.5
			},
			into:{
				'Dark essence':1,
			},
			every:5,
			mode:'de'
		});
	G.getDict('trader_buy').modes['wie']={
			name:'Wi.e.',
			icon:[1,1,'magixmod'],
			desc:'Buy [Wind essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':3.5
			},
			into:{
				'Wind essence':1,
			},
			every:5,
			mode:'wie'
		});
	G.getDict('trader_buy').modes['ne']={
			name:'N.e.',
			icon:[1,2,'magixmod'],
			desc:'Buy [Nature essence] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':3.5
			},
			into:{
				'Nature essence':1,
			},
			every:5,
			mode:'ne'
		});
	G.getDict('trader_buy').modes['he']={
			name:'H.e.',
			icon:[20,6,'magixmod'],
			desc:'Buy [Essence of the Holiness] with [market_coin].',
			req:{'extended essences catalog':'on'}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':3.5
			},
			into:{
				'Essence of the Holiness':1,
			},
			every:5,
			mode:'he'
		});
	G.getDict('trader_buy').modes['othercutstone']={
			name:'Various cut stone',
			icon:[2,12,'magixmod'],
			desc:'Buy [Various cut stones] with [market_coin].',
			req:{'extended basic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':0.8
				
			},
			into:{
				'Various cut stones':1,
			},
			every:5,
			mode:'othercutstone'
		});
	G.getDict('trader_buy').modes['otherstone']={
			name:'Various stones',
			icon:[3,12,'magixmod'],
			desc:'Buy [Various stones] with [market_coin].',
			req:{'extended archaic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':0.8
			},
			into:{
				'Various stones':1,
			},
			every:5,
			mode:'otherstone'
		});
		G.getDict('trader_buy').modes['bamboo']={
			name:'Bamboo',
			icon:[14,4,'magixmod'],
			desc:'Buy [Bamboo] with [market_coin].',
			req:{'extended archaic catalog':'on','Mo\' tradez':true}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':0.1
			},
			into:{
				'Bamboo':1,
			},
			every:5,
			mode:'bamboo'
		});
		G.getDict('trader_buy').modes['platblock']={
			name:'Platinum block',
			icon:[4,11,'magixmod'],
			desc:'Buy [platinum block] with [market_coin].',
			req:{'extended precious catalog':'on','Mo\' tradez':true}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':4
			},
			into:{
				'platinum block':1,
			},
			every:5,
			mode:'platblock'
		});
		G.getDict('trader_buy').modes['sugarc']={
			name:'Sugar cane',
			icon:[15,4,'magixmod'],
			desc:'Buy [Sugar cane] with [market_coin].',
			req:{'Mo\' tradez':true}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':0.8
			},
			into:{
				'Sugar cane':1,
			},
			every:1,
			mode:'sugarc'
		});
		G.getDict('trader_buy').modes['flower']={
			name:'Flowers',
			icon:[11,8,'magixmod'],
			desc:'Buy [Flowers] with [market_coin].',
			req:{'Mo\' tradez':true}
		};
		G.getDict('trader_buy').effects.push({
			type:'convert',
			from:{
				'market_coin':0.5
			},
			into:{
				'Flowers':3,
			},
			every:2,
			mode:'flower'
		});
	
}});
