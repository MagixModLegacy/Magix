G.AddData({
name:'Magix utils for market',
author:'pelletsstarPL',
desc:'Utilities for Bruno Supremo\'s market mod.',
engineVersion:1,
requires:['Default dataset*','Market mod'],
manifest:'ModManifest.js',
sheets:{'magixmod':'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/magixmod.png','seasonal':'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/seasonalMagix.png'},//custom stylesheet (note : broken in IE and Edge for the time being)
func:function(){
G.getDict('market_sell').modes['coal fire']={
			name:'Start fires from coal',
			icon:[12,8,13,7],
			desc:'Craft [fire pit]s from 5 [stick]s and 5 [coal]s.'
		};
		G.getDict('market_sell').effects.push({
			type:'convert',
			from:{
				'stick':5,
				'coal':5
			},
			into:{
				'fire pit':1
			},
			every:5,
			mode:'coal fire'
		});

}});
