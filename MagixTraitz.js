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
		desc:'Your people are seeming like they want political things go with old traditions. @Unlocks [Pagoda of Democracy] a political wonder.',
		icon:[20,17,'magixmod'],
		cost:{'influence':200},
		chance:1050,
		req:{'Will to know more':true,'Cultural roots':false,'Roots of insight':false},
		category:'main'
	});
		new G.Trait({
		name:'Cultural roots',
		desc:'Your people are seeming like they cultivate traiditions born at their generation and share\'em to future times. @Unlocks [Fortress of cultural legacy] a cultural wonder.',
		icon:[19,17,'magixmod'],
		cost:{'culture':500},
		chance:1050,
		req:{'Will to know more':true,'Political roots':false,'Roots of insight':false},
		category:'main'
	});
		new G.Trait({
		name:'Roots of insight',
		desc:'Your people are seeming like they are born for discoveries. @Unlocks [Complex of Dreamers] a  wonder of insight.',
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
		chance:1000,
		req:{'culture of moderation':true,'<font color="maroon">Caretaking</font>':false},
		category:'main',
	});
		new G.Trait({
		name:'<font color="maroon">Caretaking</font>',
		desc:'People do not seem curious to further discoveries. Instead of it they wish to live long, calmly and in peace. May unlock unique techs , traits , units for this path.',
		icon:[24,17,'magixmod'],
		cost:{},
		req:{'joy of eating':true,'<font color="maroon">Moderation</font>':false},
		chance:1000,
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
		req:{'Underworld building 1/2':true,'dt13':false,'dt14':false},
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
		req:{'Underworld building 1/2':true,'dt13':false,'dt14':false},
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
		req:{'Underworld building 1/2':true,'dt13':false,'dt14':false},
		effects:[
			{type:'provide res',what:{'New world point':1}},
		],
		category:'devils'
	});
		new G.Trait({
		name:'Eotm',
		displayName:'Evolution of the minds',
		desc:'Replaces [insight], [culture], [faith] and [influence] with: [insight II],[culture II], [faith II] and [influence II] . @To obtain them you will unlock special unit that will convert each for instance 500 [insight] into 1 [insight II] point. In addition [storyteller] , [dreamer] , [chieftain] and [clan leader] work 90% less efficient becuase this evolution is like disaster for them all. @Since now choose box in <b>Research tab</b> will require [insight II] & [science] instead of [insight] .@So you will still need [Wizard]s and units you used to gather lower essentials. @Lower essentials has been hidden but remember... don\'t get rid of wizards.',
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
