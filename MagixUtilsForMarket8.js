G.AddData({
name:'Magix utils for market',
author:'pelletsstarPL',
desc:'Utilities for Bruno Supremo\'s market mod.',
engineVersion:1,
requires:['Default dataset*','Market mod'],
manifest:'ModManifest.js',//custom stylesheet (note : broken in IE and Edge for the time being)
func:function(){
G.getDict('market_sell').modes['magic essences']={
			name:'Magic essences',
			icon:[20,6,'magixmod'],
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

}});
