var la=1;var lb=2; //land id tab unlockable. without this trait you can;t see policies
G.tabs=
	[
		//div : which div to empty+hide or display when tab is toggled
		//update : which system's update to call when toggling on
		{name:'<font color="lime">Production</font>',id:'unit',update:'unit',showMap:false,desc:'Recruit units and create buildings.'},
		{name:'<font color="#7f7fff">Territory</font>',id:'land',update:'land',desc:'View the world map, inspect explored territory and see your natural resources.'},
		{name:'<font color="fuschia">Policies</font>',showMap:false,id:'policy',update:'policy',desc:'Use your influence to enact policies that change the way your civilization functions.'},
		{name:'<font color="pink">Traits</font>',showMap:false,id:'trait',update:'trait',desc:'View traits and edit your civilization\'s properties.'},
		{name:'<font color="#bbbbff">Research</font>',showMap:false,id:'tech',update:'tech',desc:'Purchase new technologies that improve your civilization and unlock new units.'},
		{name:'<font color="yellow">Settings</font>',showMap:false,id:'settings',popup:true,addClass:'right',desc:'Change the game\'s settings.'},
		{name:'<font color="yellow">Update log</font>',showMap:false,id:'updates',popup:true,addClass:'right',desc:'View the game\'s version history and other information. Note: This tab does not contain Magix update logs.'},
		{name:'<font color="yellow">Legacy</font>',showMap:false,id:'legacy',popup:true,addClass:'right',desc:'View your legacy stats and achievements.'},
		{name:'<font color="yellow">Magix</font>',showMap:false,id:'Magix',popup:true,addClass:'right',desc:'Options and infos about the Magix mod.'}
	];
G.LoadResources=function()
	{
		var resources=[
			'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/terrainMagix.png',
			'img/blot.png',
			'img/iconSheet.png?v=1'
		];
	}
	
	G.createMaps=function()//when creating a new game
	{
		G.currentMap=new G.Map(0,24,24);
		
		//set starting tile by ranking all land tiles by score and picking one
		var goodTiles=[];
		for (var x=1;x<G.currentMap.w-1;x++)
		{
			for (var y=1;y<G.currentMap.h-1;y++)
			{
				var land=G.currentMap.tiles[x][y].land;
				if (!land.ocean) goodTiles.push([x,y,(land.score||0)+Math.random()*2]);
			}
		}
		goodTiles.sort(function(a,b){return b[2]-a[2]});
		var tile=0;
		if (G.startingType==2) tile=choose(goodTiles);//just drop me wherever
		else
		{
			var ind=0;
			if (G.startingType==1) ind=Math.floor((0.85+Math.random()*0.15)*goodTiles.length);//15% worst
			//ind=Math.floor((0.3+Math.random()*0.4)*goodTiles.length);//30% to 70% average
			else ind=Math.floor((Math.random()*0.15)*goodTiles.length);//15% nicest
			tile=goodTiles[ind];
		}
		tile=G.currentMap.tiles[tile[0]][tile[1]];
		tile.owner=1;
		var mark=Math.random();
		var bonus=0;
		if(mark<=0.5){bonus=bonus-1}else{bonus=bonus+1};
		var exp=10+bonus+mark;
		tile.explored=exp/100;//create one tile and from 9 to 11 % of it will be explored already
		
		G.updateMapForOwners(G.currentMap);
		
		G.updateMapDisplay();
		G.centerMap(G.currentMap);
	}
	G.getLandIconBG=function(land)
	{
		return 'url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/terrainMagix.png),url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/terrainMagix.png)';
	}
	G.renderMap=function(map,obj)
	{
		var time=Date.now();
		var timeStep=Date.now();
		var verbose=false;
		var breakdown=false;//visually break down map-drawing into steps, handy to understand what's happening
		var toDiv=l('mapBreakdown');
		if (breakdown) toDiv.style.display='block';
		
		if (verbose) {console.log('Now rendering map.');}
		
		Math.seedrandom(map.seed);
		
		var ts=16;//tile size
		
		var colorShift=true;
		var seaFoam=true;
		//var x1=5,y1=5,x2=x1+3,y2=y1+3;
		var x1=0,y1=0,x2=map.w,y2=map.h;
		if (obj)
		{
			if (obj.x1) x1=obj.x1;
			if (obj.x2) x2=obj.x2;
			if (obj.y1) y1=obj.y1;
			if (obj.y2) y2=obj.y2;
		}
		
		var totalw=map.w;//x2-x1;
		var totalh=map.h;//y2-y1;
		
		var img = new Image();   // Create new img element
		img.src = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/terrainMagix.png';
		var fog=Pic('img/blot.png');
		
		var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
		var ctx=c.getContext('2d');
		ctx.translate(ts/2,ts/2);
		for (var x=0;x<map.w;x++)
		{
			for (var y=0;y<map.h;y++)
			{
				if (x>=x1 && x<x2 && y>=y1 && y<y2)
				{
					var tile=map.tiles[x][y];
					if (tile.explored>0)
					{
						ctx.globalAlpha=tile.explored*0.9+0.1;
						Math.seedrandom(map.seed+'-fog-'+x+'/'+y);
						var s=1;
						//"pull" the center to other explored tiles
						var sx=0;var sy=0;var neighbors=0;
						if (x==0 || map.tiles[x-1][y].explored>0) {sx-=1;neighbors++;}
						if (x==map.w-1 || map.tiles[x+1][y].explored>0) {sx+=1;neighbors++;}
						if (y==0 || map.tiles[x][y-1].explored>0) {sy-=1;neighbors++;}
						if (y==map.h-1 || map.tiles[x][y+1].explored>0) {sy+=1;neighbors++;}
						s*=0.6+0.1*(neighbors);
						sx+=Math.random()*2-1;
						sy+=Math.random()*2-1;
						var pullAmount=2;
						
						var px=choose([0]);var py=choose([0]);
						var r=Math.random()*Math.PI*2;
						
						ctx.translate(sx*pullAmount,sy*pullAmount);
						ctx.scale(s,s);
						ctx.rotate(r);
						ctx.drawImage(fog,px*32+1,py*32+1,30,30,-ts,-ts,32,32);
						ctx.rotate(-r);
						ctx.scale(1/s,1/s);
						ctx.translate(-sx*pullAmount,-sy*pullAmount);
					}
				}
				ctx.translate(0,ts);
			}
			ctx.translate(ts,-map.h*ts);
		}
		ctx.globalAlpha=1;
		var imgFog=c;
		if (breakdown) toDiv.appendChild(c);
		if (verbose) {console.log('	FOG took 			'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
		var ctx=c.getContext('2d');
		ctx.drawImage(imgFog,0,0);
		var oldc=c;
		
		var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
		var ctx=c.getContext('2d');
		ctx.drawImage(oldc,0,0);
		ctx.drawImage(c,-1,0);
		ctx.drawImage(c,1,0);
		ctx.drawImage(c,0,-1);
		ctx.drawImage(c,0,1);
		ctx.globalCompositeOperation='destination-out';
		ctx.drawImage(oldc,0,0);
		ctx.drawImage(oldc,0,0);
		ctx.drawImage(oldc,0,0);
		ctx.drawImage(oldc,0,0);
		ctx.drawImage(oldc,0,0);
		ctx.globalCompositeOperation='source-in';
		ctx.beginPath();
		ctx.rect(0,0,map.w*ts,map.h*ts);
		ctx.fillStyle='rgb(200,150,100)';
		ctx.fill();
		oldc=0;
		var imgOutline=c;
		if (breakdown) toDiv.appendChild(c);
		if (verbose) {console.log('	OUTLINE took 		'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
		var ctx=c.getContext('2d');
		ctx.globalCompositeOperation='lighten';
		ctx.translate(ts/2,ts/2);
		for (var x=0;x<map.w;x++)
		{
			for (var y=0;y<map.h;y++)
			{
				if (x>=x1 && x<x2 && y>=y1 && y<y2)
				{
					var land=map.tiles[x][y].land;
					if (!land.ocean)
					{
						Math.seedrandom(map.seed+'-base-'+x+'/'+y);
						var s=1;
						//"pull" the center to other land tiles
						var sx=0;var sy=0;var neighbors=0;
						if (x==0 || !map.tiles[x-1][y].land.ocean) {sx-=1;neighbors++;}
						if (x==map.w-1 || !map.tiles[x+1][y].land.ocean) {sx+=1;neighbors++;}
						if (y==0 || !map.tiles[x][y-1].land.ocean) {sy-=1;neighbors++;}
						if (y==map.h-1 || !map.tiles[x][y+1].land.ocean) {sy+=1;neighbors++;}
						s*=0.6+0.1*(neighbors);
						if (neighbors==0) s*=0.65+Math.random()*0.35;//island
						sx+=Math.random()*2-1;
						sy+=Math.random()*2-1;
						var pullAmount=4;
						
						var px=choose([0,1]);var py=choose([0,1,2,3,4]);
						var r=Math.random()*Math.PI*2;
						
						ctx.translate(sx*pullAmount,sy*pullAmount);
						ctx.scale(s,s);
						ctx.rotate(r);
						ctx.drawImage(img,px*32+1,py*32+1,30,30,-ts,-ts,32,32);
						ctx.rotate(-r);
						ctx.scale(1/s,1/s);
						ctx.translate(-sx*pullAmount,-sy*pullAmount);
					}
				}
				ctx.translate(0,ts);
			}
			ctx.translate(ts,-map.h*ts);
		}
		var imgBase=c;
		if (breakdown) toDiv.appendChild(c);
		if (verbose) {console.log('	HEIGHTMAP took 		'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		//create colors for sea and land
		var c=document.createElement('canvas');c.width=totalw*2;c.height=totalh*2;//sea
		var ctx=c.getContext('2d');
		for (var x=0;x<map.w;x++)
		{
			for (var y=0;y<map.h;y++)
			{
				if (x>=x1 && x<x2 && y>=y1 && y<y2)
				{
					var land=map.tiles[x][y].land;
					if (land.ocean)
					{
						Math.seedrandom(map.seed+'-seaColor-'+x+'/'+y);
						var px=land.image;var py=0;
						ctx.drawImage(img,px*32+Math.random()*30+1,py*32+Math.random()*30+1,1,1,x*2,y*2,1,1);
						ctx.drawImage(img,px*32+Math.random()*30+1,py*32+Math.random()*30+1,1,1,x*2+1,y*2,1,1);
						ctx.drawImage(img,px*32+Math.random()*30+1,py*32+Math.random()*30+1,1,1,x*2,y*2+1,1,1);
						ctx.drawImage(img,px*32+Math.random()*30+1,py*32+Math.random()*30+1,1,1,x*2+1,y*2+1,1,1);
					}
				}
			}
		}
		ctx.globalCompositeOperation='destination-over';//bleed
		ctx.drawImage(c,1,0);
		ctx.drawImage(c,-1,0);
		ctx.drawImage(c,0,-1);
		ctx.drawImage(c,0,1);
		ctx.globalCompositeOperation='source-over';//blur
		ctx.globalAlpha=0.25;
		ctx.drawImage(c,2,0);
		ctx.drawImage(c,-2,0);
		ctx.drawImage(c,0,-2);
		ctx.drawImage(c,0,2);
		var imgSea=c;
		if (breakdown) toDiv.appendChild(c);
		if (verbose) {console.log('	MICROCOLORS took 	'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		var c=document.createElement('canvas');c.width=totalw*2;c.height=totalh*2;//land
		var ctx=c.getContext('2d');
		for (var x=0;x<map.w;x++)
		{
			for (var y=0;y<map.h;y++)
			{
				if (x>=x1 && x<x2 && y>=y1 && y<y2)
				{
					var land=map.tiles[x][y].land;
					if (!land.ocean)
					{
						Math.seedrandom(map.seed+'-landColor-'+x+'/'+y);
						var px=land.image;var py=0;
						ctx.drawImage(img,px*32+Math.random()*30+1,py*32+Math.random()*30+1,1,1,x*2,y*2,1,1);
						ctx.drawImage(img,px*32+Math.random()*30+1,py*32+Math.random()*30+1,1,1,x*2+1,y*2,1,1);
						ctx.drawImage(img,px*32+Math.random()*30+1,py*32+Math.random()*30+1,1,1,x*2,y*2+1,1,1);
						ctx.drawImage(img,px*32+Math.random()*30+1,py*32+Math.random()*30+1,1,1,x*2+1,y*2+1,1,1);
					}
				}
			}
		}
		ctx.globalCompositeOperation='destination-over';//bleed
		ctx.drawImage(c,1,0);
		ctx.drawImage(c,-1,0);
		ctx.drawImage(c,0,-1);
		ctx.drawImage(c,0,1);
		var imgLand=c;
		if (breakdown) toDiv.appendChild(c);
		if (verbose) {console.log('	LAND COLORS took 	'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		
		//sea color
		var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
		var ctx=c.getContext('2d');
		ctx.drawImage(imgSea,0,0,map.w*ts,map.h*ts);
		ctx.globalCompositeOperation='source-over';
		ctx.translate(ts/2,ts/2);
		for (var x=0;x<map.w;x++)
		{
			for (var y=0;y<map.h;y++)
			{
				if (x>=x1 && x<x2 && y>=y1 && y<y2)
				{
					var land=map.tiles[x][y].land;
					if (land.ocean)
					{
						Math.seedrandom(map.seed+'-detail-'+x+'/'+y);
						var px=land.image;var py=choose([2,4]);
						var r=Math.random()*Math.PI*2;
						var s=0.9+Math.random()*0.3;
						
						ctx.scale(s,s);
						ctx.rotate(r);
						ctx.drawImage(img,px*32+1,py*32+1,30,30,-ts,-ts,32,32);
						ctx.rotate(-r);
						ctx.scale(1/s,1/s);
					}
				}
				ctx.translate(0,ts);
			}
			ctx.translate(ts,-map.h*ts);
		}
		var imgSeaColor=c;
		if (breakdown) toDiv.appendChild(c);
		if (verbose) {console.log('	SEA COLORS took 	'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		if (seaFoam)
		{
			var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
			var ctx=c.getContext('2d');
			ctx.drawImage(imgBase,0,0);
			var size=4;
			ctx.globalAlpha=0.25;
			ctx.drawImage(c,-size,0);
			ctx.drawImage(c,size,0);
			ctx.drawImage(c,0,-size);
			ctx.drawImage(c,0,size);
			ctx.drawImage(c,-size,0);
			ctx.drawImage(c,size,0);
			ctx.drawImage(c,0,-size);
			ctx.drawImage(c,0,size);
			ctx.globalAlpha=1;
			ctx.globalCompositeOperation='destination-out';
			ctx.drawImage(imgBase,-1,0);
			ctx.drawImage(imgBase,1,0);
			ctx.drawImage(imgBase,0,-1);
			ctx.drawImage(imgBase,0,1);
			ctx.globalCompositeOperation='source-in';
			ctx.beginPath();
			ctx.rect(0,0,map.w*ts,map.h*ts);
			ctx.fillStyle='rgb(255,255,255)';
			ctx.fill();
			var imgEdges=c;
			if (breakdown) toDiv.appendChild(c);
			c=imgSeaColor;ctx=c.getContext('2d');
			ctx.setTransform(1,0,0,1,0,0);
			ctx.globalCompositeOperation='overlay';
			ctx.drawImage(imgEdges,0,0);
			ctx.drawImage(imgEdges,0,0);
			if (verbose) {console.log('	FOAM took 			'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		}
		
		//draw land shadow on the sea
		c=imgSeaColor;ctx=c.getContext('2d');
		ctx.globalCompositeOperation='destination-out';
		ctx.globalAlpha=0.5;
		ctx.drawImage(imgBase,2,2);
		ctx.drawImage(imgBase,4,4);
		ctx.globalCompositeOperation='destination-over';
		ctx.globalAlpha=1;
		ctx.beginPath();
		ctx.rect(0,0,map.w*ts,map.h*ts);
		ctx.fillStyle='rgb(0,0,0)';
		ctx.fill();
		if (verbose) {console.log('	SEA SHADOW took 	'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		//sea heightmap
		var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
		var ctx=c.getContext('2d');
		//fill with dark base
		ctx.beginPath();
		ctx.rect(0,0,map.w*ts,map.h*ts);
		ctx.fillStyle='rgb(64,64,64)';
		ctx.fill();
		ctx.globalCompositeOperation='overlay';
		ctx.translate(ts/2,ts/2);
		for (var x=0;x<map.w;x++)
		{
			for (var y=0;y<map.h;y++)
			{
				if (x>=x1 && x<x2 && y>=y1 && y<y2)
				{
					var land=map.tiles[x][y].land;
					if (land.ocean)
					{
						Math.seedrandom(map.seed+'-detail-'+x+'/'+y);
						var px=land.image;var py=choose([1,3]);
						var r=Math.random()*Math.PI*2;
						var s=0.9+Math.random()*0.3;
						
						ctx.scale(s,s);
						ctx.rotate(r);
						ctx.drawImage(img,px*32+1,py*32+1,30,30,-ts,-ts,32,32);
						ctx.rotate(-r);
						ctx.scale(1/s,1/s);
					}
				}
				ctx.translate(0,ts);
			}
			ctx.translate(ts,-map.h*ts);
		}
		var imgSeaHeight=c;
		if (breakdown) toDiv.appendChild(c);
		if (verbose) {console.log('	SEA HEIGHTMAP took 	'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
		var ctx=c.getContext('2d');
		ctx.drawImage(imgBase,0,0,map.w*ts,map.h*ts);//draw the coastline
		ctx.globalCompositeOperation='source-in';
		ctx.drawImage(imgLand,0,0,map.w*ts,map.h*ts);//draw land colors within the coastline
		ctx.globalCompositeOperation='destination-over';
		ctx.drawImage(imgSeaColor,0,0,map.w*ts,map.h*ts);//draw sea colors behind the coastline
		if (verbose) {console.log('	COMPOSITING took 	'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		//add color details for each tile
		ctx.globalCompositeOperation='source-over';
		ctx.translate(ts/2,ts/2);
		for (var x=0;x<map.w;x++)
		{
			for (var y=0;y<map.h;y++)
			{
				if (x>=x1 && x<x2 && y>=y1 && y<y2)
				{
					var land=map.tiles[x][y].land;
					if (!land.ocean)
					{
						Math.seedrandom(map.seed+'-detail-'+x+'/'+y);
						var s=1;
						//"pull"
						var sx=0;var sy=0;var neighbors=0;
						if (x==0 || !map.tiles[x-1][y].land.ocean) {sx-=1;neighbors++;}
						if (x==map.w-1 || !map.tiles[x+1][y].land.ocean) {sx+=1;neighbors++;}
						if (y==0 || !map.tiles[x][y-1].land.ocean) {sy-=1;neighbors++;}
						if (y==map.h-1 || !map.tiles[x][y+1].land.ocean) {sy+=1;neighbors++;}
						s*=0.6+0.1*(neighbors);
						if (neighbors==0) s*=0.65+Math.random()*0.35;//island
						sx+=Math.random()*2-1;
						sy+=Math.random()*2-1;
						var pullAmount=4;
						
						var px=land.image;var py=choose([2,4]);
						var r=Math.random()*Math.PI*2;
						
						ctx.translate(sx*pullAmount,sy*pullAmount);
						ctx.scale(s,s);
						ctx.rotate(r);
						ctx.drawImage(img,px*32+1,py*32+1,30,30,-ts,-ts,32,32);
						ctx.rotate(-r);
						ctx.scale(1/s,1/s);
						ctx.translate(-sx*pullAmount,-sy*pullAmount);
					}
				}
				ctx.translate(0,ts);
			}
			ctx.translate(ts,-map.h*ts);
		}
		var imgColor=c;
		if (breakdown) toDiv.appendChild(c);
		if (verbose) {console.log('	COLOR DETAIL took 	'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		//add heightmap details for each tile in overlay blending mode
		var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
		var ctx=c.getContext('2d');
		//fill with dark base
		ctx.beginPath();
		ctx.rect(0,0,map.w*ts,map.h*ts);
		ctx.fillStyle='rgb(32,32,32)';
		ctx.fill();
		ctx.drawImage(imgSeaHeight,0,0,map.w*ts,map.h*ts);//draw the sea heightmap
		ctx.drawImage(imgBase,0,0,map.w*ts,map.h*ts);//draw the coastline
		ctx.globalCompositeOperation='overlay';
		ctx.translate(ts/2,ts/2);
		for (var x=0;x<map.w;x++)
		{
			for (var y=0;y<map.h;y++)
			{
				if (x>=x1 && x<x2 && y>=y1 && y<y2)
				{
					var land=map.tiles[x][y].land;
					if (!land.ocean)
					{
						Math.seedrandom(map.seed+'-detail-'+x+'/'+y);
						var s=1;
						//"pull"
						var sx=0;var sy=0;var neighbors=0;
						if (x==0 || !map.tiles[x-1][y].land.ocean) {sx-=1;neighbors++;}
						if (x==map.w-1 || !map.tiles[x+1][y].land.ocean) {sx+=1;neighbors++;}
						if (y==0 || !map.tiles[x][y-1].land.ocean) {sy-=1;neighbors++;}
						if (y==map.h-1 || !map.tiles[x][y+1].land.ocean) {sy+=1;neighbors++;}
						s*=0.6+0.1*(neighbors);
						if (neighbors==0) s*=0.65+Math.random()*0.35;//island
						sx+=Math.random()*2-1;
						sy+=Math.random()*2-1;
						var pullAmount=4;
						
						var px=land.image;var py=choose([1,3]);
						var r=Math.random()*Math.PI*2;
						
						ctx.translate(sx*pullAmount,sy*pullAmount);
						ctx.scale(s,s);
						ctx.rotate(r);
						ctx.drawImage(img,px*32+1,py*32+1,30,30,-ts,-ts,32,32);
						ctx.rotate(-r);
						ctx.scale(1/s,1/s);
						ctx.translate(-sx*pullAmount,-sy*pullAmount);
					}
				}
				ctx.translate(0,ts);
			}
			ctx.translate(ts,-map.h*ts);
		}
		var imgHeight=c;
		if (breakdown) toDiv.appendChild(c);
		if (verbose) {console.log('	HEIGHT DETAIL took 	'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		//embossing
		var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
		var ctx=c.getContext('2d');
		ctx.drawImage(imgHeight,1,1);
		ctx.beginPath();
		ctx.rect(0,0,map.w*ts,map.h*ts);
		ctx.fillStyle='rgb(255,255,255)';
		ctx.globalCompositeOperation='difference';
		ctx.fill();//invert
		ctx.globalCompositeOperation='source-over';
		ctx.globalAlpha=0.5;
		ctx.drawImage(imgHeight,0,0);//create emboss
		ctx.globalCompositeOperation='hard-light';
		ctx.globalAlpha=1;
		ctx.drawImage(c,0,0);
		//ctx.drawImage(c,0,0);
		var imgEmboss1=c;
		if (breakdown) toDiv.appendChild(c);
		
		var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
		var ctx=c.getContext('2d');
		ctx.drawImage(imgHeight,1,1);
		ctx.beginPath();
		ctx.rect(0,0,map.w*ts,map.h*ts);
		ctx.fillStyle='rgb(255,255,255)';
		ctx.globalCompositeOperation='difference';
		ctx.fill();//invert
		ctx.globalCompositeOperation='source-over';
		ctx.globalAlpha=0.5;
		ctx.drawImage(imgHeight,-1,-1);//create emboss
		ctx.globalCompositeOperation='hard-light';
		ctx.globalAlpha=1;
		//ctx.drawImage(c,0,0);
		var imgEmboss2=c;
		if (breakdown) toDiv.appendChild(c);
		
		//ambient occlusion (highpass)
		var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
		var ctx=c.getContext('2d');
		ctx.drawImage(imgHeight,0,0);
		var size=2;
		ctx.globalAlpha=0.5;
		ctx.drawImage(c,-size,0);
		ctx.drawImage(c,size,0);
		ctx.drawImage(c,0,-size);
		ctx.drawImage(c,0,size);
		ctx.globalAlpha=1;
		ctx.beginPath();
		ctx.rect(0,0,map.w*ts,map.h*ts);
		ctx.fillStyle='rgb(255,255,255)';
		ctx.globalCompositeOperation='difference';
		ctx.fill();//invert
		ctx.globalCompositeOperation='source-over';
		ctx.globalAlpha=0.5;
		ctx.drawImage(imgHeight,0,0);
		ctx.globalCompositeOperation='overlay';
		ctx.drawImage(c,0,0);
		ctx.drawImage(c,0,0);
		var imgAO=c;
		if (breakdown) toDiv.appendChild(c);
		if (verbose) {console.log('	RELIEF took 		'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		//add emboss and color
		var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
		var ctx=c.getContext('2d');
		ctx.drawImage(imgEmboss1,0,0);
		ctx.globalCompositeOperation='overlay';
		ctx.drawImage(imgEmboss2,1,1);//combine both emboss passes
		/*ctx.globalAlpha=0.5;
		ctx.drawImage(imgHeight,0,0);
		ctx.globalAlpha=1;*/
		ctx.globalCompositeOperation='hard-light';
		ctx.drawImage(imgColor,0,0);//add color
		ctx.globalCompositeOperation='overlay';
		ctx.drawImage(imgAO,0,0);//add AO
		var imgFinal=c;
		if (verbose) {console.log('	COMPOSITING 2 took 	'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		//blots (big spots of random color to give the map some unity)
		Math.seedrandom(map.seed+'-blots');
		ctx.globalCompositeOperation='soft-light';
		ctx.globalAlpha=0.25;
		for (var i=0;i<4;i++)
		{
			var x=Math.random()*map.w*ts;
			var y=Math.random()*map.h*ts;
			var s=Math.max(map.w,map.h)*ts;
			var grd=ctx.createRadialGradient(x,y,0,x,y,s/2);
			grd.addColorStop(0,'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')');
			grd.addColorStop(1,'rgb(128,128,128)');
			ctx.fillStyle=grd;
			ctx.fillRect(x-s/2,y-s/2,s,s);
		}
		if (verbose) {console.log('	BLOTS took 			'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		if (colorShift)
		{
			//heck, why not. slight channel-shifting
			var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
			var ctx=c.getContext('2d');
			ctx.drawImage(imgFinal,0,0);
			ctx.globalCompositeOperation='multiply';
			ctx.beginPath();
			ctx.rect(0,0,map.w*ts,map.h*ts);
			ctx.fillStyle='rgb(255,0,0)';
			ctx.fill();
			var imgRed=c;
			var c=document.createElement('canvas');c.width=totalw*ts;c.height=totalh*ts;
			var ctx=c.getContext('2d');
			ctx.drawImage(imgFinal,0,0);
			ctx.globalCompositeOperation='multiply';
			ctx.beginPath();
			ctx.rect(0,0,map.w*ts,map.h*ts);
			ctx.fillStyle='rgb(0,255,255)';
			ctx.fill();
			var imgCyan=c;
			//if (breakdown) toDiv.appendChild(c);
			if (verbose) {console.log('	COLORSHIFT took 	'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		}
		
		c=imgFinal;ctx=c.getContext('2d');
		if (colorShift)
		{
			ctx.globalCompositeOperation='lighten';
			ctx.globalAlpha=0.5;
			ctx.drawImage(imgRed,-1,-1);
			ctx.drawImage(imgCyan,1,1);
		}
		ctx.globalAlpha=1;
		ctx.globalCompositeOperation='soft-light';
		ctx.beginPath();
		ctx.rect(0,0,map.w*ts,map.h*ts);
		ctx.fillStyle='rgb(160,128,96)';
		ctx.fill();//some slight sepia to finish it up
		
		ctx.globalCompositeOperation='destination-in';
		ctx.drawImage(imgFog,0,0);//fog
		ctx.globalCompositeOperation='source-over';
		ctx.drawImage(imgOutline,0,0);//outline
		
		ctx.globalCompositeOperation='source-over';
		ctx.globalAlpha=1;
		
		if (breakdown) toDiv.appendChild(c);
		else
		{
			//flush
			var imgBase=0;
			var imgFog=0;
			var imgOutline=0;
			var imgSea=0;
			var imgLand=0;
			var imgSeaColor=0;
			var imgColor=0;
			var imgEdges=0;
			var imgSeaHeight=0;
			var imgHeight=0;
			var imgEmboss1=0;
			var imgEmboss2=0;
			var imgAO=0;
			var imgFinal=0;
			var imgRed=0;
			var imgCyan=0;
		}
		Math.seedrandom();
		if (verbose) {console.log('	FINAL STEPS took 	'+(Date.now()-timeStep)+'ms');timeStep=Date.now();}
		
		if (verbose) console.log('Rendering map took '+(Date.now()-time)+'ms.');
		return c;
	}
//////////////////////////////////////////////////////////////
////////ACTUAL CONTENT
G.AddData({
name:'Default dataset',
author:'pelletsstarPL',
desc:'Fit more people, discover essences which have its secret use. At the moment you can reach new dimensions which will increase your max land soon. More housing so you can fit more people. Mod utilizes vanilla part of the game by adding new modes or new units. Credits to Orteil for default dataset.',
engineVersion:1,
manifest:'ModManifest.js',
sheets:{'magixmod':'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/MaGiXmOdB4Ta.png','seasonal':'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/seasonalMagix.png','terrain':'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/terrainMagix.png'},//custom stylesheet (note : broken in IE and Edge for the time being)
func:function(){
//READ THIS: All rights reserved to mod creator and people that were helping the main creator with coding. Mod creator rejects law to copying icons from icon sheets used for this mod. All noticed plagiariasm will be punished. Copyright: 2020
//===========================
	
	///FOR SEASONAL CONTENT. IK COPIED FROM CC, BUT IT WILL HELP ME. ALSO THAT IS HOW MODDING LOOKS LIKE THAT xD
	var year=new Date().getFullYear();
	var leap=(((year%4==0)&&(year%100!=0))||(year%400==0))?1:0;
	var day=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/(1000*60*60*24));
	var easterDay=function(Y){var C = Math.floor(Y/100);var N = Y - 19*Math.floor(Y/19);var K = Math.floor((C - 17)/25);var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;I = I - 30*Math.floor((I/30));I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);J = J - 7*Math.floor(J/7);var L = I - J;var M = 3 + Math.floor((L + 40)/44);var D = L + 28 - 31*Math.floor(M/4);return new Date(Y,M-1,D);}(year);
	easterDay=Math.floor((easterDay-new Date(easterDay.getFullYear(),0,0))/(1000*60*60*24));
	/////////

	if (day+leap>=289 && day+leap<=305){
		var cssId = 'betaCss'; 
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/halloweenbeta.css';
    link.media = 'all';
    head.appendChild(link);
}
	}else if(day+leap>=349 && day+leap<=362){var cssId = 'betaCss'; 
 (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/beta.css';
    head.appendChild(link);
	head  = document.getElementsByTagName('head')[0];
   link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/snow.css';
    head.appendChild(link);
}
	}else{var cssId = 'betaCss'; 
 (!document.getElementById(cssId))
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
	}
	//////////////
	//48x24 , 48x48 , 72x72 icons support
	G.getIconClasses=function(me,allowWide)
	{
		//returns some CSS classes
		var str=''; 
  	if (me.widerIcon && allowWide) str+=' wide2'; // 48x24
		if (me.wideIcon && allowWide) str+=' wide3'; //default 72x24 for wonders
		if (me.twoxtwoIcon && allowWide) str+=' widenhigh1'; //48x48
		if (me.threexthreeIcon && allowWide) str+=' widenhigh2'; //72x72
		else str+=' wide1'; //default 24x24 for most of things
		return str;
	}
	//////////////////////
		G.rerollChooseBox=function(me)
	{
		//check if we match the costs; if yes, research or reroll
		var costs=me.getCosts();
		var success=true;
		if (!G.testCost(costs,1)) success=false;
			var randomTxt=Math.round(Math.random()*4);
			if(randomTxt>=0 && randomTxt<=1){
		if (me.getCards().length==0) {success=false;G.middleText('<small><font color="#ffdddd">There is nothing more to research for now.</font></small>');}
			}else if(randomTxt>1 && randomTxt<=2){
		if (me.getCards().length==0) {success=false;G.middleText('<small><font color="#ccccff">Wait patiently. There will be something to research... unless you researched everything , then yeah. There is the end.</font></small>');}
			}else if(randomTxt>2 && randomTxt<=3){
		if (me.getCards().length==0) {success=false;G.middleText('<small><font color="#aaffdd">The mod has over 290 available techs. If you have that much it may be the end.</font></small>');}
			}else if(randomTxt>3 && randomTxt<=4){
		if (me.getCards().length==0) {success=false;G.middleText('<small><font color="#777777">More techs coming soon :)</font></small>');}
			}
		if (success)
		{
			G.doCost(costs,1);
			
			var bounds=l('chooseIgniter-'+me.id).getBoundingClientRect();
			var posX=bounds.left+bounds.width/2;
			var posY=bounds.top;
			for (var i in costs)
			{G.showParticle({x:posX,y:posY,icon:G.dict[i].icon});}
			
			me.justUsed=true;
			me.choices=[];
			var choices=me.getCards();
			var n=Math.min(choices.length,me.choicesN);
			for (var i=0;i<n;i++)
			{
				var choice=choose(choices);
				if (!me.choices.includes(choice)) me.choices.push(choice);
				//var index=choices.indexOf(choice);
				//choices.splice(index,1);//no duplicates
			}
			me.onReroll();
			G.refreshChooseBox(me);
			me.justUsed=false;
		}
	}
	G.inspectTile=function(tile)
	{
		if(G.has('tile inspection')){
		//display the tile's details in the land section
		//note : this used to display every territory owned until i realized 3 frames per second doesn't make for a very compelling user experience
		var str='';
		//Math.seedrandom(tile.map.seed+'-name-'+tile.x+'/'+tile.y);
		var name=tile.land.displayName;//choose(tile.land.names);
		str+='<div class="block framed bgMid fadeIn" id="land-0"><div class="fancyText framed bgMid blockLabel" style="float:right;">'+name+'</div><div class="fancyText segmentHeader">< - - Goods - - ><br><br><br></div><div class="thingBox" style="padding:0px;text-align:left;">';
		var I=0;
		for (var ii in tile.goods)
		{
			var me=G.getGoods(ii);
			var amount=tile.goods[ii];
			str+='<div id="landGoods-'+I+'" class="thing standalone'+G.getIconClasses(me)+'">'+G.getIconStr(me);
			if (!me.noAmount)
			{
				var bar=1;
				if (amount<0.09) bar=1;
				else if (amount<0.25) bar=2;
				else if (amount<0.375) bar=3;
				else if (amount<0.5) bar=4;
				else if (amount<1) bar=5;
				else if (amount<1.5) bar=6;
				else if (amount<2.25) bar=7;
				else if (amount<3) bar=8;
				else if (amount<3.25) bar=9;
				else if (amount<3.5) bar=10;
				else if (amount<3.9) bar=11;
				else if (amount<4.3) bar=12;
				else if (amount<4.75) bar=13;
				else if (amount<5.2) bar=14;
				else if (amount<5.5) bar=15;
				else if (amount<6) bar=16;
				else if (amount<6.2) bar=17;
				else if (amount<6.45) bar=18;
				else if (amount<6.7) bar=19;
				else bar=20;
				str+='<div class="icon" style="background:url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/magixmod.png);'+G.getFreeformIcon(816,0+bar*7,24,6)+'top:100%;"></div>';
			}
			str+='</div>';
			I++;
		}
		str+='</div></div>';
		l('landList').innerHTML=str;
		var I=0;
		for (var ii in tile.goods)
		{
			var goods=G.getGoods(ii);
			G.addTooltip(l('landGoods-'+I),function(me,amount){return function(){
				var str='<div class="info">';
				str+='<div class="infoIcon"><div class="thing standalone'+G.getIconClasses(me,true)+'">'+G.getIconStr(me,0,0,true)+'</div></div>';
				str+='<div class="fancyText barred infoTitle">'+me.displayName;
				if (!me.noAmount)
				{
					str+='<div class="fancyText infoAmount">';
					if (amount<0.09) str+='(almost none)';
					else if (amount<0.25) str+='(scarce)';
					else if (amount<0.5) str+='(few)';
					else if (amount<1.5) str+='(some)';
					else if (amount<3) str+='(lots)';
					else if (amount<3.5) str+='(abundant)';
					else if (amount<4.7) str+='(crazy amounts)';
					else if (amount<5.5) str+='(insane amounts)';
					else if (amount<6.1) str+='(<font color="pink">hella lot</font>)';
					else str+='(unbeliveably lot)';
					str+='</div>';
				}
				str+='</div>';
				if (me.desc) str+='<div class="infoDesc">'+G.parse(me.desc)+'</div>';
				str+='</div>';
				str+=G.debugInfo(me);
				return str;
			};}(goods,tile.goods[ii]),{offY:-8});
			I++;
		}
		}//if bracket //Math.seedrandom();
	}
	
	//only pasted to update a tooltip due to tile exploring tech

	G.update['land']=function()
	{
		if(la>lb){
		var str='';
		str+=G.textWithTooltip('?','<div style="width:240px;text-align:left;"><div class="par">This is your territory. While you only start with a small tile of land, there is a whole map for you to explore if you have units with that ability.</div><div class="par">Each tile you control adds to the natural resources available for your units to gather. You get more resources from fully-explored tiles than from tiles you\'ve just encountered.</div><div class="par">If you unlocked <b>Tile inspection</b> you can by clicking on an explored tile on the map to the right to see what goods can be found in it, and how those goods contribute to your natural resources.</div></div>','infoButton');
		str+='<div id="landBox">';
		str+='<div id="landList"></div>';
		if (G.currentMap.computedPlayerRes)
		{
			//display list of total gatherable resources per context
			var I=0;
			var cI=0;
			if(G.has('tile inspection II')){
			str+='<div style="padding:16px;text-align:left;" class="thingBox"><div class="bitBiggerText fancyText">Total natural resources in your territory :</div>';
			}else{
				str+='<div style="padding:16px;text-align:left;" class="thingBox"><div class="bitBiggerText fancyText">Natural resources in your territory :</div>';
			}
			for (var i in G.contextNames)
			{
				var context=i;
				if (G.contextVisibility[i] || G.getSetting('debug'))
				{
					var contextName=G.contextNames[i];
					var res=G.currentMap.computedPlayerRes[i]||[];
					str+='<div class="categoryName fancyText barred">'+contextName+'</div>';
					str+='<div>';
					var sortedRes=[];
					for (var ii in res)
					{
						var me=G.getRes(ii);
						sortedRes.push({res:me,amount:res[ii],id:me.id});
					}
					sortedRes.sort(function(a,b){return b.amount-a.amount});
					
					for (var ii in sortedRes)
					{
						var me=sortedRes[ii].res;
						var amount=Math.ceil(sortedRes[ii].amount*1000)/1000;
						
						var floats=0;
						if (amount<10) floats++;
						if (amount<1) floats++;
						if (amount<0.1) floats++;
						if(G.has('tile inspection II')){
						str+=G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(me)+'"></div><div id="naturalResAmount-'+cI+'-'+me.id+'" class="freelabel">x'+B(amount,floats)+'</div>',G.getResTooltip(me,'<span style="font-size:12px;">'+B(amount,floats)+' available every day<br>by '+contextName+'.</span>'));
						}else{
						str+=G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(me)+'"></div><div id="naturalResAmount-'+cI+'-'+me.id+'" class="freelabel"></div>',G.getResTooltip(me,'<span style="font-size:12px;"></span>'));	
						}
						I++;
					}
					str+='</div>';
				}
				cI++;
			}
			str+='</div>';
		}
		str+='</div>';
		l('landDiv').innerHTML=str;
		
		G.addCallbacks();
		
		if (G.inspectingTile) G.inspectTile(G.inspectingTile);
			G.draw['land']();
		}else{
			var texts= ['All you know for now is that you exist at lands where scarce<br> not really occurs','All you know for now is that you exist in harsh, dry, <br>where food and water are scarce','You don\'t know where you are... You feel some warmth/cool , dryness/wettiness... Where?!'];
			var str='';
			str+='<div class="fullCenteredOuter"><div class="fullCenteredInner"><div class="barred fancyText"><center><font size="4">Get <font color="#7f7fff">Where am I?</font> trait to unlock content of this tab<br><li>There you\'ll see informations about land your tribe settled</li><br><li>Not only that. You\'ll also see which goods you can find at these lands</li><br><li>'+texts[G.startingType]+'</li><br><u>"The world is a book and those who don\'t travel read only one page"</u> ~ Saint Augustine</font></center></div></div><div id="techBox" class="thingBox"></div></div></div></div>';
			l('landDiv').innerHTML=str;
			
		
		G.draw['land']();
			
		}
	}
G.setPolicyMode=function(me,mode)
	{
		//free old mode uses, and assign new mode uses
		var oldMode=me.mode;
		var newMode=mode;
		if (oldMode==newMode) return;
		//G.undoUse(oldMode.use,me.amount);
		//G.doUse(newMode.use,me.amount);
		me.mode=mode;
		if (me.mode.effects) G.applyKnowEffects(me.mode,false,true);
		if (G.getSetting('animations')) triggerAnim(me.l,'plop');
		if (me.binary)
		{
			if(me.category!="Florists"){
				if (mode.id=='off'){ 
				if (G.checkPolicy('Toggle SFX')=='on'){
				var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/PolicySwitchOff.wav');
				audio.play(); 
				}me.l.classList.add('off')
				}else{if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
				{
				var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/PolicySwitchOn.wav');
				audio.play(); 
				}me.l.classList.remove('off')}
			}else{
				if (mode.id=='off'){ 
				if (G.checkPolicy('Toggle SFX')=='on'){
				var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/spiritReject.wav');
				audio.play(); 
				}me.l.classList.add('off')
				}else{if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
				{
				var audio = new Audio('http://orteil.dashnet.org/cookieclicker/snd/spirit.mp3');
				audio.play(); 
				}me.l.classList.remove('off')}
			}
			
		}
	}
	G.buyUnit=function(me,amount,any)
	{
		//if any is true, by anywhere between 0 and amount; otherwise, fail if we can't buy the precise amount
		var success=true;
		amount=Math.round(amount);
		if (me.unit.wonder && amount>0)
		{
			//check requirements
			if (me.mode==0)
			{
				//initial step
				if (!G.testCost(me.unit.cost,amount)) success=false;
				else if (!G.testUse(me.unit.use,amount)) success=false;
				else if (!G.testUse(me.unit.require,amount)) success=false;
				if (success)
				{
					if (me.unit.messageOnStart) G.Message({type:'important',text:me.unit.messageOnStart});
					G.doCost(me.unit.cost,amount);
					G.doUse(me.unit.use,amount);
					G.applyUnitBuyEffects(me,amount);
					me.mode=2;//start paused
					me.percent=0;
					if (G.getSetting('animations')) triggerAnim(me.l,'plop');
					
					var bounds=me.l.getBoundingClientRect();
					var posX=bounds.left+bounds.width/2;
					var posY=bounds.top;
					for (var i in me.unit.cost)
					{G.showParticle({x:posX,y:posY,icon:G.dict[i].icon});}
				}
			}
			else if (me.mode==1)
			{
				//building in progress; pausing construction
				if (success)
				{
					me.mode=2;
					if (G.getSetting('animations')) triggerAnim(me.l,'plop');
				}
			}
			else if (me.mode==2)
			{
				//building in progress; resuming construction
				if (success)
				{
					me.mode=1;
					if (G.getSetting('animations')) triggerAnim(me.l,'plop');
				}
			}
			else if (me.mode==3 || me.mode==4)
			{
				//building complete; applying final step
				//this also handles the step afterwards, when we click the final wonder
				G.dialogue.popup(function(me,instance){return function(div){
					var str=
					'<div style="width:280px;min-height:380px;">'+
					'<div class="thing standalone'+G.getIconClasses(me,true)+''+(instance.mode==3?' wonderUnbuilt':' wonderBuilt')+'" style="transform:scale(2);position:absolute;left:70px;top:52px;">'+G.getIconStr(me,0,0,true)+'</div>'+
					'<div class="fancyText title">'+me.displayName+'</div><div class="bitBiggerText scrollBox underTitle shadowed" style="text-align:center;overflow:hidden;top:118px;bottom:50px;">';
					if (instance.mode==3)
					{
						str+='<div class="fancyText par"><font color="fuschia">This wonder only needs one more step to finalize.</font></div>';
						if (me.finalStepDesc) str+='<div class="fancyText par">'+G.parse(me.finalStepDesc)+'</div>';
						str+='</div><div class="buttonBox">'+
						G.button({text:'<font color="lime">Complete</font>',tooltipFunc:function(me){return function(){return '<div style="max-width:240px;padding:16px 24px;">You need '+G.getCostString(me.finalStepCost,true,false,1)+'.</div>';}}(me),onclick:function(me){return function(){
							var amount=1;
							var success=true;
							if (!G.testCost(me.unit.finalStepCost,amount)) success=false;
							//else if (!G.testUse(me.unit.finalStepUse,amount)) success=false;
							//else if (!G.testUse(me.unit.finalStepRequire,amount)) success=false;
							if (success)
							{
								G.dialogue.close();
								G.doCost(me.unit.finalStepCost,amount);
								if (G.checkPolicy('Toggle SFX')=='on'){
			var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/WonderComplete.mp3');
			audio.play(); 
			}
								me.mode=4;
								me.amount+=1;
								if (G.getSetting('animations')) triggerAnim(me.l,'plop');
								
								var bounds=me.l.getBoundingClientRect();
								var posX=bounds.left+bounds.width/2;
								var posY=bounds.top;
								for (var i in me.unit.finalStepCost)
								{G.showParticle({x:posX,y:posY,icon:G.dict[i].icon});}
								G.buyUnit(me,amount,true);//show dialogue for step 4
							}
						}}(instance)})+'<br>'+
						G.dialogue.getCloseButton('- Back -')+
						'</div>';
					}
					else if(me.name=="scientific university")
					{
						str+='<div class="fancyText par">Wonder completed</div>';
						str+='<div class="fancyText par">You cannot ascend by this wonder. Not every wonder means ascension and here is example of that.</div>';
						'</div>';
					}
					else if(me.name=='<span style="color: #E0CE00">Portal to the Paradise</span>' || me.name=='<span style="color: #E0CE00">Plain island portal</span>' || me.name=='<span style="color: #FF0000">Underworld</span>' || me.name=='grand mirror' && me.name!=='mausoleum')
					{
						str+='<div class="fancyText par">Portal activated</div>';
						str+='<div class="fancyText par">Now you can unlock new things, discover and most important settle more people.</div>';
						'</div>';
					}
					else
					{
						str+='<div class="fancyText par">Wonder completed</div>';
						str+='<div class="fancyText par">You can now ascend to a higher state of existence, or remain on this mortal plane for as long as you wish.</div>';
						str+='</div><div class="buttonBox">'+
							
						G.button({text:'<font color="#D4AF37">Ascend</font>',style:'box-shadow:0px 0px 10px 1px #39f;',tooltipFunc:function(me){return function(){return '<div style="max-width:240px;padding:16px 24px;"><div class="par">Ascending will end this game and let you create a new one.</div><div class="par">You will unlock permanent legacy bonuses for completion of this wonder.</div><div class="par">You can decide to do this later; click this wonder again to ascend at any time.</div><div class="par">Only do this when you\'re certain you\'re done with this world! (seriously I mean that)</div></div>';}}(me),onclick:function(me){return function(){
							//ascend
							G.dialogue.close();
							var middleText='';
							var achiev=G.getAchiev(me.unit.wonder);
							var randomTxtId=Math.floor(Math.random() * 6);	
							if (G.checkPolicy('Toggle SFX')=='on'){
			var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/Ascending.wav');
			audio.play(); 
			}
							if (achiev)
							{
								if (!achiev.won) middleText='<font color="pink">- Completed the '+achiev.displayName+' victory -</font>'
								achiev.won++;
							}
							G.resets++;
							G.NewGameWithSameMods();
							G.middleText(middleText,true);
						}}(instance)})+'<br>'+
						G.dialogue.getCloseButton('Back')+
						'</div>';
					}
					str+='</div>';
					return str;
				}}(me.unit,me));
			}
		}
		else if (amount>0)
		{
			//check requirements
			if (any)
			{
				var originalAmount=amount;
				var n=0;
				n=G.testAnyCost(me.unit.cost);
				if (n!=-1) amount=Math.min(n,amount);
				n=G.testAnyUse(me.unit.use,amount);
				if (n!=-1) amount=Math.min(n,amount);
				n=G.testAnyUse(me.unit.require,amount);
				if (n!=-1) amount=Math.min(n,amount);
				//n=G.testAnyUse(me.mode.use,amount);
				//if (n!=-1) amount=Math.min(n,amount);
				n=G.testAnyLimit(me.unit.limitPer,G.getUnitAmount(me.unit.name)+amount);
				if (n!=-1) amount=Math.min(n,amount);
				if (amount<=0) success=false;
			}
			else
			{
				if (!G.testCost(me.unit.cost,amount)) success=false;
				else if (!G.testUse(me.unit.use,amount)) success=false;
				else if (!G.testUse(me.unit.require,amount)) success=false;//should amount count?
				//else if (!G.testUse(me.mode.use,amount)) success=false;
				else if (!G.testLimit(me.unit.limitPer,G.getUnitAmount(me.unit.name)+amount)) success=false;
			}
			//actually purchase if we meet the requirements
			if (success)
			{
				G.doCost(me.unit.cost,amount);
				G.doUse(me.unit.use,amount);
				//G.doUse(me.mode.use,amount);
				G.applyUnitBuyEffects(me,amount);
				if(me.unit.name.endsWith('ce storage')){
					me.amount+=1;
				}else{
				me.amount+=amount;
				};
				if(me.unit.name.endsWith('ce storage')){
					me.idle+=1;
				}else{
				me.idle+=amount;
				};
				if (G.tooltip.parent!=me.l && G.getSetting('animations')) triggerAnim(me.l,'plop');
				
				var bounds=me.l.getBoundingClientRect();
				var posX=bounds.left+bounds.width/2;
				var posY=bounds.top;
				for (var i in me.unit.cost)
				{G.showParticle({x:posX,y:posY,icon:G.dict[i].icon});}
			}
		}
		return success;
	}
	
	G.selectModeForPolicy=function(me,div)
	{
		if (div==G.widget.parent) G.widget.close();
		else
		{
			G.widget.popup({
				func:function(widget)
				{
					var str='';
					var me=widget.linked;
					var proto=me;
					for (var i in proto.modes)
					{
						var mode=proto.modes[i];
						if (!mode.req || G.checkReq(mode.req))
						{str+='<div class="button'+(mode.num==me.mode.num?' on':'')+'" id="mode-button-'+mode.num+'">'+mode.name+'</div>';}
					}
					widget.l.innerHTML=str;
					//TODO : how do uses and costs work in this?
					for (var i in proto.modes)
					{
						var mode=proto.modes[i];
						if (!mode.req || G.checkReq(mode.req))
						{
							l('mode-button-'+mode.num).onmouseup=function(target,mode,div){return function(){
								//released the mouse on this mode button; test if we can switch to this mode, then close the widget
								if (G.speed>0)
								{
									var me=target;
									var proto=me;
									if (G.testCost(me.cost,1))
									{
										if (!me.mode.use || G.testUse(G.subtractCost(me.mode.use,mode.use),1))
										{
											G.doCost(me.cost,1);
											//remove "on" class from all mode buttons and add it to the current mode button
											for (var i in proto.modes)
											{if (l('mode-button-'+proto.modes[i].num)) {l('mode-button-'+proto.modes[i].num).classList.remove('on');}}
											l('mode-button-'+mode.num).classList.add('on');
											G.setPolicyMode(me,mode);
											if (G.checkPolicy('Toggle SFX')=='on'){
			var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/PolicySwitchOn.wav');
			audio.play(); 
			}
											if (me.l) G.popupSquares.spawn(l('mode-button-'+mode.num),me.l);
										}
									}
								} else G.cantWhenPaused();
								widget.closeOnMouseUp=false;//override default behavior
								widget.close(5);//schedule to close the widget in 5 frames
							};}(me,mode,div);
							
							if (!me.mode.use || G.testUse(G.subtractCost(me.mode.use,mode.use),me.amount)) addHover(l('mode-button-'+mode.num),'hover');//fake mouseover because :hover doesn't trigger when mouse is down
							G.addTooltip(l('mode-button-'+mode.num),function(me,target){return function(){
								var proto=target;
								//var uses=G.subtractCost(target.mode.use,me.use);
								var str='<div class="info">'+G.parse(me.desc);
								//if (!isEmpty(me.use)) str+='<div class="divider"></div><div class="fancyText par">Uses : '+G.getUseString(me.use,true,true)+' per '+proto.name+'</div>';
								//if (target.amount>0 && target.mode.num!=me.num && !isEmpty(uses)) str+='<div class="divider"></div><div class="fancyText par">Needs '+G.getUseString(uses,true,false,target.amount)+' to switch</div>';
								str+='<div><b>Changing to this mode will cost you </b>'+G.getCostString(proto.cost,true,false,1)+'.</div></div>';
								return str;
							};}(mode,me),{offY:-8});
						}
					}
				},
				offX:0,
				offY:-8,
				anchor:'top',
				parent:div,
				linked:me,
				closeOnMouseUp:true
			});
		}
	}
	var ca=1;var cb=2;
	var pa=1;var pb=2; //policies unlockable. without this trait you can;t see policies
		
	var faicost; var inscost;
	/////////////MODYFYING POLCIIES TAB
	G.update['policy']=function()
	{
	if(pa>pb){
		var str='';
		str+=
			'<div class="regularWrapper">'+
			G.textWithTooltip('?','<div style="width:240px;text-align:left;"><div class="par">Policies help you regulate various aspects of the life of your citizens.</div><div class="par">Some policies provide multiple modes of operation while others are simple on/off switches.</div><div class="par">Changing policies usually costs influence points and, depending on how drastic or generous the change is, may have an impact on your people\'s morale.</div></div>','infoButton')+
			'<div class="fullCenteredOuter"><div id="policyBox" class="thingBox fullCenteredInner"></div></div></div>';
		l('policyDiv').innerHTML=str;
		
		var strByCat=[];
		var len=G.policyCategories.length;
		for (var iC=0;iC<len;iC++)
		{
			strByCat[G.policyCategories[iC].id]='';
		}
		var len=G.policy.length;
		for (var i=0;i<len;i++)
		{
			var me=G.policy[i];
			if (me.visible && (me.category!='debug' || G.getSetting('debug')))
			{
				var str='';
				var disabled='';
				if (me.binary && me.mode.id=='off') disabled=' off';
				str+='<div class="policy thing'+(me.binary?'':' expands')+' wide1'+disabled+'" id="policy-'+me.id+'">'+
					G.getIconStr(me,'policy-icon-'+me.id)+
					'<div class="overlay" id="policy-over-'+me.id+'"></div>'+
				'</div>';
				strByCat[me.category]+=str;
			}
		}
		
		var str='';
		var len=G.policyCategories.length;
		for (var iC=0;iC<len;iC++)
		{
			if (strByCat[G.policyCategories[iC].id]!='') str+='<div class="category" style="display:inline-block;"><div class="categoryName barred fancyText" id="policy-catName-'+iC+'">'+G.policyCategories[iC].name+'</div>'+strByCat[G.policyCategories[iC].id]+'</div>';
		}
		l('policyBox').innerHTML=str;
		
		G.addCallbacks();
		
		var len=G.policy.length;
		for (var i=0;i<len;i++)
		{
			var me=G.policy[i];
			if (me.visible)
			{
				var div=l('policy-'+me.id);if (div) me.l=div; else me.l=0;
				var div=l('policy-icon-'+me.id);if (div) me.lIcon=div; else me.lIcon=0;
				var div=l('policy-over-'+me.id);if (div) me.lOver=div; else me.lOver=0;
				G.addTooltip(me.l,function(what){return function(){return G.getPolicyTooltip(what)};}(me),{offY:-8});
				if (me.l) {me.l.onclick=function(what){return function(){G.clickPolicy(what);};}(me);}
				if (me.l && !me.binary) {var div=me.l;div.onmousedown=function(policy,div){return function(){G.selectModeForPolicy(policy,div);};}(me,div);}
			}
		}
	}else{
		var str='';
		str+='<div class="fullCenteredOuter"><div class="fullCenteredInner"><div class="barred fancyText"><center><font size="4">Get <font color="fuschia">Policies</font> trait to unlock content of this tab<br><li>Policies are one of main aspects of ruling the tribe</li><br>So... get this trait to learn even more about them :)</font></center></div></div><div id="techBox" class="thingBox"></div></div></div></div>';
		l('policyDiv').innerHTML=str;
	}
		G.draw['policy']();
	}
	
/////////MODYFING UNIT TAB!!!!! (so some "wonders" which are step-by-step buildings now will have displayed Step-by-step instead of wonder. Same to portals)
		G.update['unit']=function()
	{
		l('unitDiv').innerHTML=
			G.textWithTooltip('<big>?</big>','<div style="width:240px;text-align:left;"><div class="par"><li>Units are the core of your resource production and gathering.</li></div><div class="par">Units can be <b>queued</b> for purchase by clicking on them; they will then automatically be created over time until they reach the queued amount. Creating units usually takes up resources such as workers or tools; resources shown in red in the tooltip are resources you do not have enough of.<div class="bulleted">click a unit to queue 1</div><div class="bulleted">right-click or ctrl-click to remove 1</div><div class="bulleted">shift-click to queue 50</div><div class="bulleted">shift-right-click or ctrl-shift-click to remove 50</div></div><div class="par">Units usually require some resources to be present; a <b>building</b> will crumble if you do not have the land to support it, or it could go inactive if you lack the workers or tools (it will become active again once you fit the requirements). Some units may also require daily <b>upkeep</b>, such as fresh food or money, without which they will go inactive.</div><div class="par">Furthermore, workers will sometimes grow old, get sick, or die, removing a unit they\'re part of in the process.</div><div class="par">Units that die off will be automatically replaced until they match the queued amount again.</div><div class="par">Some units have different <b>modes</b> of operation, which can affect what they craft or how they act; you can use the small buttons next to such units to change those modes and do other things. One of those buttons is used to <b>split</b> the unit into another stack; each stack can have its own mode.</div></div>','infoButton')+
			'<div style="position:absolute;z-index:100;top:0px;left:0px;right:0px;text-align:center;"><div class="flourishL"></div>'+
				G.button({id:'removeBulk',
					text:'<span style="position:relative;width:9px;margin-left:-4px;margin-right:-4px;z-index:10;font-weight:bold;">-</span>',
					tooltip:'Divide by 10',
					onclick:function(){
						var n=G.getSetting('buyAmount');
						if (G.keys[17]) n=-n;
						else
						{
							if (n==1) n=-1;
							else if (n<1) n=n*10;
							else if (n>1) n=n/10;
						}
						n=Math.round(n);
						n=Math.max(Math.min(n,1e+35),-1e+35);
						G.setSetting('buyAmount',n);
						G.updateBuyAmount();
						if (G.checkPolicy('Toggle SFX')=='on'){
						var audio = new Audio('http://orteil.dashnet.org/cookieclicker/snd/press.mp3');
						audio.play(); 
						}
						
					},
				})+
				'<div id="buyAmount" class="bgMid framed" style="width:128px;display:inline-block;padding-left:8px;padding-right:8px;font-weight:bold;">...</div>'+
				G.button({id:'addBulk',
					text:'<span style="position:relative;width:9px;margin-left:-4px;margin-right:-4px;z-index:10;font-weight:bold;">+</span>',
					tooltip:'Multiply by 10',
					onclick:function(){
						var n=G.getSetting('buyAmount');
						if (G.keys[17]) n=-n;
						else
						{
							if (n==-1) n=1;
							else if (n>-1) n=n*10;
							else if (n<-1) n=n/10;
						}
						n=Math.round(n);
						n=Math.max(Math.min(n,1e+35),-1e+35);
						G.setSetting('buyAmount',n);
						G.updateBuyAmount();
						if (G.checkPolicy('Toggle SFX')=='on'){
						var audio = new Audio('http://orteil.dashnet.org/cookieclicker/snd/press.mp3');
						audio.play(); 
						}
					}
				})+
			'<div class="flourishR"></div><br><center>'+
(ca > cb ? G.button({
      id: "t11", //<span style="position:relative;width:9px;margin-left:-4px;margin-right:-4px;z-index:10;font-weight:bold;">
      text:
        '</span>Buy<img src="https://pipe.miroware.io/5db9be8a56a97834b159fd5b/ico1.png" style="vertical-align:top;" width="16" height="16"/>',
      tooltip:
        'Buy <b>Golden insight</b><img src="https://pipe.miroware.io/5db9be8a56a97834b159fd5b/ico1.png" style="vertical-align:top;" width="16" height="16"/> for '+faicost.toFixed(2)+' <b>Faith</b> and '+inscost.toFixed(2)+' <b>Insight</b> .<br>Cost of next <b>Golden insight</b><img src="https://pipe.miroware.io/5db9be8a56a97834b159fd5b/ico1.png" style="vertical-align:top;" width="16" height="16"/> will increase. Be careful.',
      onclick: function (me) {
	      if(G.getRes('"golden insight"').amount<G.getRes('wisdom').amount && G.getRes('faith').amount>=faicost && G.getRes('insight').amount>=inscost){
		      G.lose('insight',inscost,'exchange');G.lose('faith',faicost,'exchange');
        G.gain('"golden insight"', 1, "purcharse");
		  G.gain('New world point', 1, "purcharse");
	      };
        if (G.checkPolicy("Toggle SFX") == "on") {
          var audio = new Audio(
            "http://orteil.dashnet.org/cookieclicker/snd/press.mp3"
          );
          audio.play();
        }
      },
    }) : "") +
			'</center></div>'+
			
			'<div class="fullCenteredOuter" style="padding-top:16px;"><div id="unitBox" class="thingBox fullCenteredInner"></div></div>';
		
		/*
			-create an empty string for every unit category
			-go through every unit owned and add it to the string of its category
			-display each string under category headers, then attach events
		*/
		var strByCat=[];
		var len=G.unitCategories.length;
		for (var iC=0;iC<len;iC++)
		{
			strByCat[G.unitCategories[iC].id]='';
		}
		var len=G.unitsOwned.length;
		for (var i=0;i<len;i++)
		{
			var str='';
			var me=G.unitsOwned[i];
			str+='<div class="thingWrapper">';
			str+='<div class="unit thing'+G.getIconClasses(me.unit,true)+'" id="unit-'+me.id+'">'+
				G.getIconStr(me.unit,'unit-icon-'+me.id,0,true)+
				G.getArbitrarySmallIcon([0,0],false,'unit-modeIcon-'+me.id)+
				'<div class="overlay" id="unit-over-'+me.id+'"></div>'+
				'<div class="amount" id="unit-amount-'+me.id+'"></div>'+
			'</div>';
			if (me.unit.gizmos)
			{
				str+='<div class="gizmos">'+
					'<div class="gizmo gizmo1" id="unit-mode-'+me.id+'"></div>'+
					'<div class="gizmo gizmo2'+(me.splitOf?' off':'')+'" id="unit-split-'+me.id+'"></div>'+
					'<div class="gizmo gizmo3" id="unit-percent-'+me.id+'"><div class="percentGizmo" id="unit-percentDisplay-'+me.id+'"></div></div>'+
				'</div>';
			}
			str+='</div>';
			strByCat[me.unit.category]+=str;
		}
		
		var str='';
		var len=G.unitCategories.length;
		for (var iC=0;iC<len;iC++)
		{
			if (strByCat[G.unitCategories[iC].id]!='')
			{
				if (G.unitCategories[iC].id=='wonder') str+='<br>';
				str+='<div class="category" style="display:inline-block;"><div class="categoryName barred fancyText" id="unit-catName-'+iC+'">'+G.unitCategories[iC].name+'</div>'+strByCat[G.unitCategories[iC].id]+'</div>';
			}
		}
		l('unitBox').innerHTML=str;
		
		G.addCallbacks();
		
		
		G.addTooltip(l('buyAmount'),function(){return '<div style="width:320px;"><div class="barred"><b>Buy amount</b></div><div class="par">This is how many units you\'ll queue or unqueue at once in a single click.</div><div class="par">Click the + and - buttons to increase or decrease the amount. You can ctrl-click either button to instantly make the amount negative or positive.</div><div class="par">You can also ctrl-click a unit to unqueue an amount instead of queueing it, or shift-click to queue 50 times more.</div></div>';},{offY:-8});
		
		G.updateBuyAmount();
		var len=G.unitsOwned.length;
		for (var i=0;i<len;i++)
		{
			var me=G.unitsOwned[i];
			var div=l('unit-'+me.id);if (div) me.l=div; else me.l=0;
			var div=l('unit-icon-'+me.id);if (div) me.lIcon=div; else me.lIcon=0;
			var div=l('unit-over-'+me.id);if (div) me.lOver=div; else me.lOver=0;
			var div=l('unit-amount-'+me.id);if (div) me.lAmount=div; else me.lAmount=0;
			var div=l('unit-modeIcon-'+me.id);if (div) me.lMode=div; else me.lMode=0;
			if (me.lMode && me.mode.icon) {G.setIcon(me.lMode,me.mode.icon);me.lMode.style.display='block';}
			else if (me.lMode) me.lMode.style.display='none';
			if (me.unit.gizmos)
			{
				var div=l('unit-mode-'+me.id);div.onmousedown=function(unit,div){return function(){G.selectModeForUnit(unit,div);};}(me,div);
				G.addTooltip(div,function(me,instance){return function(){return 'Click and drag to change unit mode.<br>Current mode :<div class="info"><div class="fancyText barred infoTitle">'+(instance.mode.icon?G.getSmallThing(instance.mode):'')+''+instance.mode.name+'</div>'+G.parse(instance.mode.desc)+'</div>';};}(me.unit,me),{offY:-8});
				var div=l('unit-split-'+me.id);div.onclick=function(unit,div){return function(){if (G.speed>0) G.splitUnit(unit,div); else G.cantWhenPaused();};}(me,div);
				G.addTooltip(div,function(me,instance){return function(){if (instance.splitOf) return 'Click to remove this stack of units.'; else return 'Click to split into another unit stack.<br>Different unit stacks can use different modes.'};}(me.unit,me),{offY:-8-16});
				var div=l('unit-percent-'+me.id);div.onmousedown=function(unit,div){return function(){if (G.speed>0) G.selectPercentForUnit(unit,div); else G.cantWhenPaused();};}(me,div);
				G.addTooltip(div,function(me,instance){return function(){return 'Click and drag to set unit work capacity.<br>This feature is not yet implemented... and probably won\'t be.'};}(me.unit,me),{offY:8,anchor:'bottom'});
			}
			G.addTooltip(me.l,function(me,instance){return function(){
				var amount=G.getBuyAmount(instance);
				if (me.wonder) amount=(amount>0?1:-1);
				if (me.wonder)
				{
					var str='<div class="info">';
					str+='<div class="infoIcon"><div class="thing standalone'+G.getIconClasses(me,true)+'">'+G.getIconStr(me,0,0,true)+'</div></div>';
					str+='<div class="fancyText barred infoTitle">'+me.displayName+'</div>';
					if(me.name!=='scientific university' && me.name!=='<span style="color: #E0CE00">Portal to the Paradise</span>' && me.name!=='wonderful fortress of christmas' && me.name!=='<span style="color: #E0CE00">Plain island portal</span>' && me.name!=='<span style="color: #FF0000">Underworld</span>' && me.name!=='grand mirror'){str+='<div class="fancyText barred" style="color:#c3f;">Wonder</div>'}else if(me.name=='<span style="color: #E0CE00">Plain island portal</span>' ||  me.name=='<span style="color: #E0CE00">Portal to the Paradise</span>' || me.name=='<span style="color: #FF0000">Underworld</span>' || me.name=='grand mirror'){str+='<div class="fancyText barred" style="color:yellow;">Portal</div>'}else{str+='<div class="fancyText barred" style="color:#f0d;">Step-by-step building</div>'};
					if (amount<0) str+='<div class="fancyText barred">You cannot destroy wonders,step-by-step buildings and portals(Work in progress)</div>';
					else
					{
						if (instance.mode==0) str+='<div class="fancyText barred">Unbuilt<br>Click to start construction ('+B(me.steps)+' steps)</div>';
						else if (instance.mode==1) str+='<div class="fancyText barred">Being constructed - Step : '+B(instance.percent)+'/'+B(me.steps)+'<br>Click to pause construction</div>';
						else if (instance.mode==2) str+='<div class="fancyText barred">'+(instance.percent==0?('Construction paused<br>Click to begin construction'):('Construction paused - Step : '+B(instance.percent)+'/'+B(me.steps)+'<br>Click to resume'))+'</div>';
						else if (instance.mode==3) str+='<div class="fancyText barred">Requires final step<br>Click to perform</div>';
						else if (instance.mode==4 && me.name!=='scientific university' && me.name!=='wonderful fortress of christmas'){ str+='<div class="fancyText barred">Completed<br>Click to ascend</div>'}else{str+='<div class="fancyText barred">Completed</div>'};
						//else if (amount<=0) str+='<div class="fancyText barred">Click to destroy</div>';
					}
					if (amount<0) amount=0;
					
					if (instance.mode!=4)
					{
						str+='<div class="fancyText barred">';
							if (instance.mode==0 && amount>0)
							{
								if (!isEmpty(me.cost)) str+='<div>Initial cost : '+G.getCostString(me.cost,true,false,amount)+'</div>';
								if (!isEmpty(me.use)) str+='<div>Uses : '+G.getUseString(me.use,true,false,amount)+'</div>';
								if (!isEmpty(me.require)) str+='<div>Prerequisites : '+G.getUseString(me.require,true,false,amount)+'</div>';
							}
							else if ((instance.mode==1 || instance.mode==2) && !isEmpty(me.costPerStep)) str+='<div>Cost per step : '+G.getCostString(me.costPerStep,true,false,amount)+'</div>';
							else if (instance.mode==3 && !isEmpty(me.finalStepCost)) str+='<div>Final step cost : '+G.getCostString(me.finalStepCost,true,false,amount)+'</div>';
						str+='</div>';
					}
					
					if (me.desc) str+='<div class="infoDesc">'+G.parse(me.desc)+'</div>';
					str+='</div>';
					str+=G.debugInfo(me);
					return str;
				}
				else
				{
					if (amount<0) amount=Math.max(-instance.targetAmount,amount);
					/*if (G.getSetting('buyAny'))
					{
						var n=0;
						n=G.testAnyCost(me.cost);
						if (n!=-1) amount=Math.min(n,amount);
						n=G.testAnyUse(me.use,amount);
						if (n!=-1) amount=Math.min(n,amount);
						n=G.testAnyUse(me.require,amount);
						if (n!=-1) amount=Math.min(n,amount);
						n=G.testAnyUse(instance.mode.use,amount);
						if (n!=-1) amount=Math.min(n,amount);
						n=G.testAnyLimit(me.limitPer,G.getUnitAmount(me.name)+amount);
						if (n!=-1) amount=Math.min(n,amount);
					}*/
					var str='<div class="info">';
					//infoIconCompensated ?
					str+='<div class="infoIcon"><div class="thing standalone'+G.getIconClasses(me,true)+'">'+G.getIconStr(me,0,0,true)+'</div>'+
					'<div class="fancyText infoAmount onLeft">'+B(instance.displayedAmount)+'</div>'+
					'<div class="fancyText infoAmount onRight" style="font-size:12px;">'+(instance.targetAmount!=instance.amount?('queued :<br>'+B(instance.targetAmount-instance.displayedAmount)):'')+(instance.amount>0?('<br>active :<br>'+B(instance.amount-instance.idle)+'/'+B(instance.amount)):'')+'</div>'+
					'</div>';
					str+='<div class="fancyText barred infoTitle">'+me.displayName+'</div>';
					if(me.name.endsWith('ce storage')){
						str+='<div class="fancyText barred">Click to '+(amount>=0?'queue':'unqueue')+' '+B(Math.abs(amount))+'<br>Your people can build only one storage of this type at the time </div>';
					}else{//You can hire only one essence storage at the time
					str+='<div class="fancyText barred">Click to '+(amount>=0?'queue':'unqueue')+' '+B(Math.abs(amount))+'</div>';
					}
					if (me.modesById[0]) {str+='<div class="fancyText barred">Current mode :<br><b>'+(instance.mode.icon?G.getSmallThing(instance.mode):'')+''+instance.mode.name+'</b></div>';}
					str+='<div class="fancyText barred">';
						if (!isEmpty(me.cost)) str+='<div>Cost : '+G.getCostString(me.cost,true,false,amount)+'</div>';
						if (!isEmpty(me.use) || !isEmpty(me.staff)) str+='<div>Uses : '+G.getUseString(addObjects(me.use,me.staff),true,false,amount)+'</div>';
						if (!isEmpty(me.require)) str+='<div>Prerequisites : '+G.getUseString(me.require,true,false,amount)+'</div>';//should amount count?
						if (!isEmpty(me.upkeep)) str+='<div>Upkeep : '+G.getCostString(me.upkeep,true,false,amount)+'</div>';
						if (!isEmpty(me.limitPer)) str+='<div>Limit : '+G.getLimitString(me.limitPer,true,false,G.getUnitAmount(me.name)+amount)+'</div>';
						if (isEmpty(me.cost) && isEmpty(me.use) && isEmpty(me.staff) && isEmpty(me.upkeep) && isEmpty(me.require)) str+='<div>Free</div>';
						if (me.modesById[0] && !isEmpty(instance.mode.use)) str+='<div>Current mode uses : '+G.getUseString(instance.mode.use,true,false,amount)+'</div>';
					str+='</div>';
					if (me.desc) str+='<div class="infoDesc">'+G.parse(me.desc)+'</div>';
					str+='</div>';
					str+=G.debugInfo(me);
					return str;
				}
			};}(me.unit,me),{offY:-8});
			if (me.l) me.l.onclick=function(unit){return function(e){
				if (G.speed>0)
				{
					var amount=G.getBuyAmount(unit);
					if (unit.unit.wonder) amount=(amount>0?1:-1);
					if (amount<0) G.taskKillUnit(unit,-amount);
					else if (amount>0) G.taskBuyUnit(unit,amount,(G.getSetting('buyAny')));
				} else G.cantWhenPaused();
			};}(me);
			if (me.l) me.l.oncontextmenu=function(unit){return function(e){
				e.preventDefault();
				if (G.speed>0)
				{
					
					var amount=-G.getBuyAmount(unit);
					if (unit.unit.wonder) amount=(amount>0?1:-1);
					
					if (amount<0) G.taskKillUnit(unit,-amount);
					
					//else if (amount>0) G.buyUnit(unit,amount);
				} else G.cantWhenPaused();
			};}(me);
		}
		
	}
	///////////MORE QUOTES!
	G.cantWhenPaused=function()
	{
		var randText =Math.floor(Math.random()*13)
		if(randText>=0 && randText<=1){
		G.middleText('<font color="#ffffee"><small>Sorry. Can\'t do that when paused!</small></font>');
		}else if(randText>1 && randText<=2){
		G.middleText('<font color="#ffd022"><small>I can\'t let you change things while time is stopped. ~Chra\'nos</small></font>');
		}else if(randText>2 && randText<=3){
		G.middleText('<font color="#0fffee"><small>Unpause the game in order to perform this action.</small></font>');
		}else if(randText>3 && randText<=4){
		G.middleText('<font color="#faffee"><small>You can\'t do that if time is stopped.</small></font>');
		}else if(randText>4 && randText<=5){
		G.middleText('<font color="#ffff00"><small>You can\'t do that here...</small></font>');
		}else if(randText>5 && randText<=6){
		G.middleText('<font color="#b0b0ff"><small>Sorry, but you can\'t rule a frozen civilization.</small></font>');
		}else if(randText>6 && randText<=7){
		G.middleText('<font color="#b0b0ff"><small>Ask pelletsstarPL(mod creator & Grand Magixian) maybe he will help you.</small></font>');
		}else if(randText>7 && randText<=8){
		G.middleText('<font color="lime"><small>Log #'+Math.round(Math.random()*32767)+1+'<br>Attempted to perform operation while paused<br>ACTION INTERRUPTED</small></font>');
		}else if(randText>8 && randText<=9){
		G.middleText('<font color="#ffbbaa"><small>Don\'t push. It provides you nothing.</small></font>');
		}else if(randText>9 && randText<=10){
		G.middleText('<font color="cyan"><small>Oh no, no. Don\'t think I will let you do this like that. >:)</small></font>');
		}else if(randText>10 && randText<=11){
		G.middleText('<font color="#aa00ff"><small>No doing things when paused in the halls.<br>'+Math.round(Math.random()*30)+' seconds. Detention for you.</small></font>');
		}else if(randText>10 && randText<=13){
		G.middleText('<font color="#a0F0b0"><small>Uh uh. Unpause at 1st.</small></font>');
		}
	}
	
G.props['fastTicksOnResearch']=150;
	let t1start = false
	let t1start1 = false
	let t1vp=0
	let madeThievesWarn = false
	let ThiefPreWarn = false
	let madeWarnToolDecayMesg = false
	let madeThanks4playmesg = false
	let backupmesg = false
	let milleniummesg = false
	let Secondmilleniummesg = false
	let st1=false
	let st2=false
	let st3=false
	let st4=false
	let st5=false
	let st6=false
	let st7=false
	let st8=false
	let st9=false
	let st10=false
	let st11=false
	let st12=false
	let st13=false
	let st14=false
	let st15=false
	let displayC1=true;let displayC2=false;
	
		G.funcs['new game blurb']=function()
	{   
		var str=
		'<font color="fuschia">Magix expansion has been loaded succesfully. <b>: )</b></br></font>'+
		'<b>Your tribe :</b><div class="thingBox">'+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('adult'))+'"></div><div class="freelabel">x5</div>','5 Adults')+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('elder'))+'"></div><div class="freelabel">x1</div>','1 Elder')+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('child'))+'"></div><div class="freelabel">x2</div>','2 Children')+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('herb'))+'"></div><div class="freelabel">x300</div>','300 Herbs')+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('water'))+'"></div><div class="freelabel">x250</div>','250 Water')+
		(G.resets>=1 ? G.textWithTooltip('<div class="icon freestanding" style="'+G.getIcon([7,30,'magixmod'])+'"></div><div class="freelabel"></div>','<b>Complete achievements to<br> unlock more starting<br> bonuses</b>') : "")+
		'</div>'+
		'<div class="par fancyText bitBiggerText">Your tribe finds a place to settle in the wilderness.<br>Resources are scarce, and everyone starts foraging.</div>'+
		'<div class="par fancyText bitBiggerText">You emerge as the tribe\'s leader. <br>These people... They call you :</div>';
		return str;
			
	}
	//////////////////////////////////////
	G.funcs['new game']=function()
	{
		if(G.achievByName['mausoleum'].won>=1){G.gainTech(G.techByName['<font color="yellow">A gift from the Mausoleum</font>']);}
		if(G.achievByName['Democration'].won>=1){G.gainTech(G.techByName['<font color="fuschia">Authority of the ancestor</font>']);}
		if(G.achievByName['Sacrificed for culture'].won>=1){G.gainTech(G.techByName['<font color=" ##00C000">Artistic gray cells</font>']);}
		if(G.achievByName['Insight-ly'].won>=1){G.gainTech(G.techByName['<font color="aqua">Genius feeling</font>']);}
		if(G.achievByName['"In the underworld"'].won > 0 && G.achievByName['Deadly, revenantic'].won > 0 && G.hasNot('A feeling from the Underworld')){
		G.gainTech(G.techByName['A feeling from the Underworld']);
		};
		if (G.achievByName['"In the underworld"'].won >= 1 && G.achievByName['Democration'].won >= 1 && G.achievByName['Sacrificed for culture'].won >= 1 && G.achievByName['Insight-ly'].won >= 1 && G.hasNot('<font color="##a8654f">The Underworld\'s Ascendant</font>')){
G.gainTech(G.techByName['<font color="##a8654f">The Underworld\'s Ascendant</font>']);
};
		if (G.achievByName['Experienced'].won > 0 && G.hasNot('<font color="lime">Fruit supplies</font>')){G.gainTech(G.techByName['<font color="lime">Fruit supplies</font>']);}
		 if (G.achievByName['Extremely smart'].won > 0 && G.achievByName['<font color="DA4f37">Mausoleum eternal</font>'].won >= 1 && G.hasNot('<font color="orange">Life has its theme</font>')) {
      G.gainTech(G.techByName['<font color="orange">Life has its theme</font>']);
    }; if (G.achievByName['Smart'].won > 0 && G.hasNot('<font color="orange">Smaller but efficient</font>')){
      G.gainTrait(G.traitByName['<font color="orange">Smaller but efficient</font>']);
    };
		if (G.achievByName['Magical'].won > 0 && G.hasNot('Magical presence')){
      G.gainTech(G.techByName['Magical presence']);
    };
	if (G.achievByName['Next to the God'].won > 0 && G.hasNot('Life in faith')){
      G.gainTech(G.techByName['Life in faith'])
    };
		 if (G.achievByName['Talented?'].won > 0 && G.hasNot('<font color="orange">Smaller shacks</font>')){
      G.gainTrait(G.traitByName['<font color="orange">Smaller shacks</font>']);
    };
		if (G.achievByName['Pocket'].won > 0 && G.hasNot('well stored') && G.achievByName['Pocket'].won < 2){
      G.gainTrait(G.traitByName['well stored']);
    };
if (G.achievByName['Pocket'].won > 1 && G.hasNot('well stored 2')){
      G.gainTrait(G.traitByName['well stored 2']);
    };
		G.getRes('victory point').amount=0;
		///new game mesg
		var str='Your name is '+G.getName('ruler')+''+(G.getName('ruler').toLowerCase()=='orteil' || G.getName('ruler').toLowerCase()=='pelletsstarpl' || G.getName('ruler').toLowerCase()=='opti'?' <i>(but that\'s not you, is it?)</i>':'')+', ruler of '+G.getName('civ')+'. Your tribe is primitive, but full of hope.<br>The first year of your legacy has begun. May it stand the test of time.';
		
		/////////////////
		G.Message({type:'important tall',text:str,icon:[0,3]});	
		if(G.achievByName['Talented?'].won==0){
			G.getDict('research box').choicesN=4
			}else if(G.achievByName['Talented?'].won>=1){
			G.getDict('research box').choicesN=5
			}
		if(G.getName('ruler').toLowerCase()=='orteil' || G.getName('ruler').toLowerCase()=='pelletsstarpl' || G.getName('ruler').toLowerCase()=='opti'){
			if(G.achievByName['god complex'].won==0){
				G.achievByName['god complex'].won=1;G.middleText('- Completed <font color="#bbffbb">God complex</font> shadow achievement - <br><hr><small>Congrats</small>','slow')
			};
		G.getDict('research box').choicesN=3;G.lose('adult',1); //punishment
		};
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
		if (G.achievByName['Next to the God'].won > 0) {
	    G.getDict('culture of the afterlife').chance = 167;
	G.getDict('The God\'s call').chance = 59;
	G.getDict('An opposite side of belief').chance = 337;
   		  }
		 }
		/////VP CALC FOR STARTING A NEW RUN
		G.getRes('victory point').amount=0
		var a1=G.achievByName['Patience'].won
		var b1=1
		var c1=0
		while(c1<a1){
		G.gain('victory point',b1)
			b1++
			c1++
		}
				var a2=G.achievByName['Unhappy'].won
		var b2=1
		var c2=0
		while(c2<a2){
		G.gain('victory point',b2)
			b2++
			c2++
		}
		var a3=G.achievByName['Cultural'].won
		var b3=1
		var c3=0
		while(c3<a3){
		G.gain('victory point',b3)
			b3++
			c3++
		}
		var a4=G.achievByName['Hunted'].won
		var b4=1
		var c4=0
		while(c4<a4){
		G.gain('victory point',b4)
			b4++
			c4++
		}
		var a5=G.achievByName['Unfishy'].won
		var b5=1
		var c5=0
		while(c5<a5){
		G.gain('victory point',b5)
			b5++
			c5++
		}
		var a6=G.achievByName['Ocean'].won
		var b6=1
		var c6=0
		while(c6<a6){
		G.gain('victory point',b6)
			b6++
			c6++
		}
		var a7=G.achievByName['Herbalism'].won
		var b7=1
		var c7=0
		while(c7<a7){
		G.gain('victory point',b7)
			b7++
			c7++
		}
		if(G.achievByName['Buried'].won>=1) G.gain('victory point',15);
		
		var a9=G.achievByName['Underground'].won
		var b9=1
		var c9=0
		while(c9<a9){
		G.gain('victory point',b9)
			b9++
			c9++
		}
		var a10=G.achievByName['Pocket'].won
		var b10=1
		var c10=0
		while(c10<a10){
		G.gain('victory point',b10)
			b10++
			c10++
		}
		var a11=G.achievByName['Faithful'].won
		var b11=1
		var c11=0
		while(c11<a11){
		G.gain('victory point',b11)
			b11++
			c11++
		}
		var a12=G.achievByName['Dreamy'].won
		var b12=1
		var c12=0
		while(c12<a12){
		G.gain('victory point',b12)
			b12++
			c12++
		}
		/*---------------------
		. . . assignments
		----------------------------*/
		if(G.getRes('victory point').amount >=1 && G.getRes('victory point').amount <6 && G.hasNot('bonus1') && G.hasNot('bonus2')){
			G.gainTrait(G.traitByName['bonus1'])
		}else if(G.getRes('victory point').amount >=6 && G.getRes('victory point').amount <10 && G.hasNot('bonus2') && G.hasNot('bonus3')){
			G.gainTrait(G.traitByName['bonus2'])
		}else if(G.getRes('victory point').amount >=10 && G.getRes('victory point').amount <20 && G.hasNot('bonus3') && G.hasNot('bonus3')){
			G.gainTrait(G.traitByName['bonus3'])
		}else if(G.getRes('victory point').amount >=20 && G.getRes('victory point').amount <35 && G.hasNot('bonus4')){
			G.gainTrait(G.traitByName['bonus4'])
		}
		
		
	
	if (G.achievByName['mausoleum'].won > 0) {
      G.Message({
        type: 'good',
        text: 'Building the Mausoleum in the past has granted you access to magic! :)',
        icon: [4, 12, 6, 1, 'magixmod']
      });
    }
 else if(G.achievByName['mausoleum'].won < 1){

  G.Message({
    type: 'bad',
    text: 'Building the Mausoleum in the past grants access to magic in the future.',
    icon: [3, 12, 6, 1, 'magixmod']
  });

}
		//NO EXTRA ORES WITH MAGIX
		if(G.modsByName['Extra ores(for data.js)']){
			G.middleText('Sorry',sloweerer)
				 console.log('I am sorry but Extra Ores is a mod dedicated to data.js not Magix.');
				console.log('But content from this mod you tried to install is available there. Just unlock it sometime.');
		}
				if (day+leap>=349 && day+leap<=362){
			G.getDict('scouting').icon=[8,10,'seasonal'];
			G.getDict('cities').icon=[16,10,'seasonal'];
			G.getDict('sedentism').icon=[18,10,'seasonal'];
			G.getDict('valid portal frame').icon=[19,10,'seasonal'];
			G.getDict('sedentism').icon=[18,10,'seasonal'];
			G.getDict('mirror world 1/2').icon=[27,3,'magixmod',19,11,'seasonal'];
			G.getDict('mirror world 2/2').icon=[27,2,'magixmod',19,11,'seasonal'];
			G.getDict('focused scouting').icon=[17,10,'seasonal'];
			G.getDict('An opposite side of belief').icon=[8,11,'seasonal'];
			G.getDict('winter holidays').req={'<span style="color: yellow">Culture of celebration</span>':true,'tribalism':true,'philosophy':true};
			G.getDict('the christmas').req={'<span style="color: yellow">Culture of celebration</span>':true,'tribalism':true,'winter holidays':true};
			G.getDict('carols').req={'symbolism II':true,'ritualism II':true,'Music':true,'tribalism':true};
					G.getAchiev('xmas buff').won=3;
					
					G.getDict('f.r.o.s.t.y').req={'festive robot print':true,'tribalism':true};
					G.getDict('snow').hidden=false;
					G.getDict('christmas ornament').hidden=false;
					G.getDict('festive light').hidden=false;
					G.getDict('snowman').hidden=false;
					G.getDict('child of Christmas').hidden=false;
					G.getDict('christmas essence').hidden=false;

					
				} //some winterish replacements=
		else{
			G.getAchiev('xmas buff').won--;
		}
		if(G.getAchiev('xmas buff').won>=0){
			var buff=Math.round(Math.random()*3)+1;
			G.gainTrait(G.traitByName['xmas'+buff+'']);
		}
		if ((day>=365 && day<=366) || (day>0 && day<=2)){
			//also not only greetings but also some content unlocks
			G.getDict('Firecracker').hidden=false;G.getDict('Blue firework').hidden=false;G.getDict('Orange firework').hidden=false;G.getDict('Dark Blue Firework').hidden=false;G.getDict('Dark Orange Firework').hidden=false;
			G.getDict('Firework crafting').req={'<span style="color: yellow">Culture of celebration</span>':true,'tribalism':true};
			G.getDict('Firework launching').req={'<span style="color: yellow">Culture of celebration</span>':true,'Firework crafting':true,'tribalism':true};
			G.getDict('Dark essence fireworks').req={'<span style="color: yellow">Culture of celebration</span>':true,'Firework crafting':true,'Wizard complex':true,'tribalism':true};
	};
		G.getDict('xmas1').desc='The spirits of the Christmas thank your [artisan]s for crafting lights, ornaments, decors bringing Christmas climate to this world. For now and for next <B>'+G.achievByName['xmas buff'].won+'</B> '+(G.achievByName['xmas buff'].won==1 ? "run/legacy" : "runs/legacies")+', your [artisan]s are 3% more efficient. //<font color="red">Note: While christmas you won\'t lose an use, however when christmas ends you will start losing that bonus meaning that after that you won\'t be able to get this buff stacks again until next Christmas. </font>';
					 G.getDict('xmas2').desc='The spirits of the Christmas thank your [clothier]s for weaving, sewing festive clothing bringing Christmas climate to this world. For now and for next <B>'+G.achievByName['xmas buff'].won+'</B> '+(G.achievByName['xmas buff'].won==1 ? "run/legacy" : "runs/legacies")+', your [clothier]s are 3% more efficient. //<font color="red">Note: While christmas you won\'t lose an use, however when christmas ends you will start losing that bonus meaning that after that you won\'t be able to get this buff stacks again until next Christmas.</font>';
        				G.getDict('xmas3').desc='The spirits of the Christmas thank your [potter]s for crafting festive pots, bowls with Christmas symbols bringing Christmas climate to this world. For now and for next <B>'+G.achievByName['xmas buff'].won+'</B> '+(G.achievByName['xmas buff'].won==1 ? "run/legacy" : "runs/legacies")+', your [potter]s are 3% more efficient. //<font color="red">Note: While christmas you won\'t lose an use, however when christmas ends you will start losing that bonus meaning that after that you won\'t be able to get this buff stacks again until next Christmas.</font>';
					G.getDict('xmas4').desc='The spirits of the Christmas thank your [carver]s for carving festive statuettes out of various materials and for decoring cut stone with festive shapes/symbols bringing Christmas climate to this world. For now and for next <B>'+G.achievByName['xmas buff'].won+'</B> '+(G.achievByName['xmas buff'].won==1 ? "run/legacy" : "runs/legacies")+', your [carver]s are 3% more efficient. //<font color="red">Note: While christmas you won\'t lose an use, however when christmas ends you will start losing that bonus meaning that after that you won\'t be able to get this buff stacks again until next Christmas.</font>';
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
		
		//Had to paste it there because if you obtain and you will unlock 5th choice after page refresh you can still pick 1 of 4 instead of 1 of 5
		if(G.achievByName['Talented?'].won==0){
			G.getDict('research box').choicesN=4
			}else if(G.achievByName['Talented?'].won>=1){
			G.getDict('research box').choicesN=5
			}
		if(G.getName('ruler').toLowerCase()=='orteil' || G.getName('ruler').toLowerCase()=='pelletsstarpl' || G.getName('ruler').toLowerCase()=='opti'){
			if(G.achievByName['god complex'].won==0){
				G.achievByName['god complex'].won=1;G.middleText('- Completed <font color="#bbffbb">God complex</font> shadow achievement - <br><hr><small>Congrats</small>','slow')
			};
		G.getDict('research box').choicesN=3;G.lose('adult',1); //no matter what. That's punishment element
		};
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
		if (G.achievByName['Next to the God'].won > 0) {
	    G.getDict('culture of the afterlife').chance = 167;
	G.getDict('The God\'s call').chance = 59;
	G.getDict('An opposite side of belief').chance = 337;
   		  }
		 }
		/////VP CALC FOR REFRESHING PAGE
		
		G.getRes('victory point').amount=0
		var a1=G.achievByName['Patience'].won
		var b1=1
		var c1=0
		while(c1<a1){
		G.gain('victory point',b1)
			b1++
			c1++
		}
		var a2=G.achievByName['Unhappy'].won
		var b2=1
		var c2=0
		while(c2<a2){
		G.gain('victory point',b2)
			b2++
			c2++
		}
		var a3=G.achievByName['Cultural'].won
		var b3=1
		var c3=0
		while(c3<a3){
		G.gain('victory point',b3)
			b3++
			c3++
		}
		var a4=G.achievByName['Hunted'].won
		var b4=1
		var c4=0
		while(c4<a4){
		G.gain('victory point',b4)
			b4++
			c4++
		}
		var a5=G.achievByName['Unfishy'].won
		var b5=1
		var c5=0
		while(c5<a5){
		G.gain('victory point',b5)
			b5++
			c5++
		}
		var a6=G.achievByName['Ocean'].won
		var b6=1
		var c6=0
		while(c6<a6){
		G.gain('victory point',b6)
			b6++
			c6++
		}
		var a7=G.achievByName['Herbalism'].won
		var b7=1
		var c7=0
		while(c7<a7){
		G.gain('victory point',b7)
			b7++
			c7++
		}
		if(G.achievByName['Buried'].won>=1) G.gain('victory point',15);
		var a9=G.achievByName['Underground'].won
		var b9=1
		var c9=0
		while(c9<a9){
		G.gain('victory point',b9)
			b9++
			c9++
		}
		var a10=G.achievByName['Pocket'].won
		var b10=1
		var c10=0
		while(c10<a10){
		G.gain('victory point',b10)
			b10++
			c10++
		}
		var a11=G.achievByName['Faithful'].won
		var b11=1
		var c11=0
		while(c11<a11){
		G.gain('victory point',b11)
			b11++
			c11++
		}
		var a12=G.achievByName['Dreamy'].won
		var b12=1
		var c12=0
		while(c12<a12){
		G.gain('victory point',b12)
			b12++
			c12++
		}
		if(G.hasNot('<span style="color: ##FF0900">Plain island building</span>') && G.getRes('Plain Island emblem').amount==0 && G.getRes('plain portal point').amount>=2){
			
			G.getUnitByName('<span style="color: #E0CE00">Plain island portal</span>').mode=0;
			G.getRes('plain portal point').amount=1;	G.getUnitByName('<span style="color: #E0CE00">Plain island portal</span>').mode=0;
				//G.getDict('<span style="color: #E0CE00">Plain island portal</span>').cost={'insight':250};
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').wideIcon=[7,3,'magixmod'];
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').icon=[8,3,'magixmod'];
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').steps=75;
			G.getDict('<span style="color: #E0CE00">Plain island portal</span>').use={'land':-10};
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').desc='@opens a portal to a huge <b>Plain Island</b>. A creation made of ideas of wizards and dreams of population.//A Dream comes real. You will grant +28000 [Land of the Plain Island] upon activation of portal. Stage 2 of 2 //Note: Portals work a lil bit differently: refreshing page during this stage will bring completion level back to 0%',
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').cost={'Mana':4000,'insight':150,'faith':50,'culture':40};
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').costPerStep={'Mana':14000,'Dark essence':5200,'Fire essence':5250,'Nature essence':5300,'Wind essence':5150,'Water essence':5500,'Lightning essence':5225};
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').finalStepDesc='Perform a final step to activate this portal';
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').finalStepCost={'Land of the Plain Island':-28000,'Plain Island emblem':-1,/*Bonus provided by portal activation*/'Mana':40000,'Dark essence':5000,'Fire essence':5500,'Nature essence':6000,'Wind essence':4500,'Water essence':8000,'Lightning essence':5250,'insight':1000,'plain portal point':-1};
		}
		if(G.hasNot('<span style="color: ##FF0900">Paradise building</span>') && G.getRes('Paradise emblem').amount==0  && G.getRes('paradise portal point').amount>=2){
		
			G.getUnitByName('<span style="color: #E0CE00">Portal to the Paradise</span>').mode=0;
			G.getUnitByName('<span style="color: #E0CE00">Portal to the Paradise</span>').mode=0;
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').wideIcon=[7,4,'magixmod'];
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').icon=[8,4,'magixmod'];
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').steps=75;
			G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').use={'land':-10};
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').desc='@opens a portal to a huge <b>God\'s Paradise</b>A very hard project, allowed by God.//A Dream to see Paradise, angels and much, much more comes real. You will grant +26500 [Land of the Paradise] at your own but you <b>must</b> follow some of God\'s rules. Stage 2 of 2 //Note: Portals work a lil bit differently: refreshing page during this stage will bring completion level back to 0%',
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').cost={'Mana':4000,'insight':150,'faith':50,'culture':40};
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').costPerStep={'Mana':184000,'Dark essence':18200,'Fire essence':18250,'Nature essence':18300,'Wind essence':18150,'Water essence':18500,'Lightning essence':18225};
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').finalStepDesc='Perform a final step to activate this portal';
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').finalStepCost={'Land of the Paradise':-26500,'Paradise emblem':-1,/*Bonus provided by portal activation*/'Mana':40000,'Dark essence':95000,'Fire essence':95500,'Nature essence':96000,'Wind essence':104500,'Water essence':88000,'Lightning essence':75250,'insight':1000};
			G.getRes('paradise portal point').amount=1;
		}
		var timeOffline=Math.max(0,(Date.now()-G.lastDate)/1000);
		if (day+leap>=289 && day+leap<=305){
			G.middleText('<big><font color="orange">Happy Halloween!</big><br>- Welcome back -<br><small>You accumulated '+B(timeOffline)+' fast ticks while you were away.</small></font>','slow');
		var audi = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/halloweenGreeting.mp3');
		audi.play()};
		if (day+leap>=349 && day+leap<=362){
			G.getDict('scouting').icon=[8,10,'seasonal'];
			G.getDict('cities').icon=[16,10,'seasonal'];
			G.getDict('sedentism').icon=[18,10,'seasonal'];
			G.getDict('valid portal frame').icon=[19,10,'seasonal'];
			G.getDict('sedentism').icon=[18,10,'seasonal'];
			G.getDict('mirror world 1/2').icon=[27,3,'magixmod',19,11,'seasonal'];
			G.getDict('mirror world 2/2').icon=[27,2,'magixmod',19,11,'seasonal'];
			G.getDict('focused scouting').icon=[17,10,'seasonal'];
			G.getDict('An opposite side of belief').icon=[8,11,'seasonal'];
			G.getDict('winter holidays').req={'<span style="color: yellow">Culture of celebration</span>':true,'tribalism':true,'philosophy':true};
			G.getDict('the christmas').req={'<span style="color: yellow">Culture of celebration</span>':true,'tribalism':true,'winter holidays':true};
			G.middleText('<big><font color="aqua">Merry Christmas!</big><br>- Welcome back -<br><small>You accumulated '+B(timeOffline)+' fast ticks while you were away.</small></font>','slow');
					
					G.getDict('f.r.o.s.t.y').req={'festive robot print':true,'tribalism':true};
					G.getDict('child of Christmas').hidden=false;
					G.getDict('snow').hidden=false;
					G.getDict('festive light').hidden=false;
					G.getDict('snowman').hidden=false;
					G.getDict('christmas ornament').hidden=false;
					G.getDict('christmas essence').hidden=false;
	};var yer=new Date();
		//SEASONALs
		if ((day>=365 && day<=366) || (day>0 && day<=2)){
			//also not only greetings but also some content unlocks
			G.getDict('Firecracker').hidden=false;G.getDict('Blue firework').hidden=false;G.getDict('Orange firework').hidden=false;G.getDict('Dark Blue Firework').hidden=false;G.getDict('Dark Orange Firework').hidden=false;
			G.getDict('Firework crafting').req={'<span style="color: yellow">Culture of celebration</span>':true,'tribalism':true};
			G.getDict('Firework launching').req={'<span style="color: yellow">Culture of celebration</span>':true,'Firework crafting':true,'tribalism':true};
			G.getDict('Dark essence fireworks').req={'<span style="color: yellow">Culture of celebration</span>':true,'Firework crafting':true,'Wizard complex':true,'tribalism':true};
		var truY=yer.getFullYear();
			if (day>=365 && day<=366)G.middleText('<big><font color="pink">Happy '+(truY+1)+'!</big><br>- Welcome back -<br><small>You accumulated '+B(timeOffline)+' fast ticks while you were away.</small></font>','slow');
			if (day>0 && day<=2)G.middleText('<big><font color="pink">Happy '+truY+'!</big><br>- Welcome back -<br><small>You accumulated '+B(timeOffline)+' fast ticks while you were away.</small></font>','slow');
	};
		if (yer.getMonth()==6 && yer.getDate()>=14 && yer.getDate()<=20){ //Magix anniversary week
		G.middleText('<big><font color="olive">Magix turns '+(yer.getFullYear()-2019)+'</big><br>- Welcome back -<br><small>You accumulated '+B(timeOffline)+' fast ticks while you were away.<br> Thanks for playing this neat mod ~ pelletsstarPL. <font color="aqua">It really motivates for further updates. Keep playing.</font></small></font>','slow');
	};
		if (day>=easterDay-7 && day<=easterDay){ //EASTER
			G.middleText('<big><font color="green">Happy Easter!</big><br>- Welcome back -<br><small>You accumulated '+B(timeOffline)+' fast ticks while you were away. Easter bunny does a sniff,sniff</small></font>','slow');
		};
		if (yer.getMonth()==9 && yer.getDate()==9){ //MOD CREATOR's birthday
		G.middleText('<big>Today Magix creator has its birthday.</big><br>- Welcome back -<br><small>You accumulated '+B(timeOffline)+' fast ticks while you were away.<br></small></font>','slow');
	};
		if (yer.getMonth()==2 && yer.getDate()==8){ //Females/Ladies day greeting
		G.middleText('<big>Today is Female\'s day.</big><br><small>Make sure you will greet some lady nicely today and not only today :)<br>- Welcome back -<br>You accumulated '+B(timeOffline)+' fast ticks while you were away.<br></small></font>','slow');
	};
		if (yer.getMonth()==2 && yer.getDate()==8){ //Males/Gentlemen day greeting
		G.middleText('<big>Today is Male\'s day.</big><br><small>Yeah boiii<br>- Welcome back -<br>You accumulated '+B(timeOffline)+' fast ticks while you were away.<br></small></font>','slow');
	};
		if(yer.getMonth()==3 && yer.getDate()==1){ //fools, maybe, maybe not, rather not
		G.middleText('-kcab emoclew,dooG -<br><small>Yo accmlatd '+B(timeOffline)+' fast ticks whil yo wr away.<br><font color="lime">My two kys on my kyboard got brokn, so that is th ffct.</font></small>','slow');	
		};
		if (day>=41 && day<=46){  //valentines
		G.middleText('<font color="pink">-Love is in the air -<br>-Welcome back- <br><small>You accumulated '+B(timeOffline)+' fast ticks while you were away.<br></small></font>','slow');		
		};
		G.getDict('xmas1').desc='The spirits of the Christmas thank your [artisan]s for crafting lights, ornaments, decors bringing Christmas climate to this world. For now and for next <B>'+G.achievByName['xmas buff'].won+'</B> '+(G.achievByName['xmas buff'].won==1 ? "run/legacy" : "runs/legacies")+', your [artisan]s are 3% more efficient. //<font color="red">Note: While christmas you won\'t lose an use, however when christmas ends you will start losing that bonus meaning that after that you won\'t be able to get this buff stacks again until next Christmas. </font>';
					 G.getDict('xmas2').desc='The spirits of the Christmas thank your [clothier]s for weaving, sewing festive clothing bringing Christmas climate to this world. For now and for next <B>'+G.achievByName['xmas buff'].won+'</B> '+(G.achievByName['xmas buff'].won==1 ? "run/legacy" : "runs/legacies")+', your [clothier]s are 3% more efficient. //<font color="red">Note: While christmas you won\'t lose an use, however when christmas ends you will start losing that bonus meaning that after that you won\'t be able to get this buff stacks again until next Christmas.</font>';
        				G.getDict('xmas3').desc='The spirits of the Christmas thank your [potter]s for crafting festive pots, bowls with Christmas symbols bringing Christmas climate to this world. For now and for next <B>'+G.achievByName['xmas buff'].won+'</B> '+(G.achievByName['xmas buff'].won==1 ? "run/legacy" : "runs/legacies")+', your [potter]s are 3% more efficient. //<font color="red">Note: While christmas you won\'t lose an use, however when christmas ends you will start losing that bonus meaning that after that you won\'t be able to get this buff stacks again until next Christmas.</font>';
					G.getDict('xmas4').desc='The spirits of the Christmas thank your [carver]s for carving festive statuettes out of various materials and for decoring cut stone with festive shapes/symbols bringing Christmas climate to this world. For now and for next <B>'+G.achievByName['xmas buff'].won+'</B> '+(G.achievByName['xmas buff'].won==1 ? "run/legacy" : "runs/legacies")+', your [carver]s are 3% more efficient. //<font color="red">Note: While christmas you won\'t lose an use, however when christmas ends you will start losing that bonus meaning that after that you won\'t be able to get this buff stacks again until next Christmas.</font>';
	}
	G.funcs['new year']=function()
	{
		if (G.on)
		{
			
			var txt = ''+G.year+'';
			if(day+leap>=289 && day+leap<=305){G.getDict('population').icon=[0,7,'seasonal'];
		G.getDict('worker').icon=[1,7,'seasonal'];
		G.getDict('child').icon=[2,7,'seasonal'];
		G.getDict('adult').icon=[3,7,'seasonal'];
		G.getDict('burial').icon=[16,7,'seasonal'];
		G.getDict('elder').icon=[4,7,'seasonal'];G.doFunc('ToT');
						G.getDict('"dark season"').req={'tribalism':true,'<span style="color: yellow">Culture of celebration</span>':true,'sedentism':true,'intuition':true};};
		if(G.has('time measuring 1/2') && G.has('primary time measure')){
			var str='';
			str+='It is now the year <b>'+(G.year+1)+'</b>.<br>';
			str+='Report for last year :<br>';
			str+='&bull; <b>Births</b> : '+B(G.getRes('born this year').amount)+'<br>';
			str+='&bull; <b>Deaths</b> : '+B(G.getRes('died this year').amount)+'<br>';
			str+='&bull; <b>Soldiers defeats</b> : '+B(G.getRes('soldiers defeats').amount)+'<br>';
			G.getRes('born this year').amount=0;
			G.getRes('died this year').amount=0;
			G.getRes('soldiers defeats').amount=0;
			G.Message({type:'important',text:str,icon:[0,3]});
		}else if(G.has('primary time measure') && G.hasNot('time measuring 1/2')){
			
  var res = txt.endsWith("00");
			if(res==true){
			var str='';
			str+='It is now the century <b>'+Math.floor(((G.year/100)+1))+'</b>.<br>';
			str+='Report for last long period of time... this century :<br>';
			str+='&bull; <b>Births</b> : '+B(G.getRes('born this year').amount)+'<br>';
			str+='&bull; <b>Deaths</b> : '+B(G.getRes('died this year').amount)+'<br>';
			str+='&bull; <b>Soldiers defeats</b> : '+B(G.getRes('soldiers defeats').amount)+'<br>';
			G.getRes('born this year').amount=0;
			G.getRes('died this year').amount=0;
			G.getRes('soldiers defeats').amount=0;
			G.Message({type:'important',text:str,icon:[0,3]});
			}
		}
			var rese = txt.endsWith("5");
			G.updateMapDisplay() //FIX for map(because it is using my sheet not default one)
			if(t1start==true)
			{
				
				if(G.has('time measuring 1/2')){
				var insight=Math.floor(Math.random() * (33/(G.achievByName['Patience'].won+1)));
				G.Message({type:'important',text:'During this year Chra\'nos has brought down to you:<br><b><font color="#aaffff">'+B(insight)+' Insight</font></b><br>The hidden weakness in this plane affects you stronger and stronger each year. Think about finishing the trial as soon as possible.',icon:[10,11,'magixmod']});
				if (G.getRes('insight').amount < G.getRes('wisdom').amount*1.6){
				G.gain('insight',insight);
				}else if(rese==true){
				var insight=Math.floor(Math.random() * (33/(G.achievByName['Patience'].won+1)));
				G.Message({type:'important',text:'Recently Chra\'nos has brought down to you:<br><b><font color="#aaffff">'+B(insight)+' Insight</font></b><br>The hidden weakness in this plane affects you stronger and stronger. Think about finishing the trial as soon as possible.',icon:[10,11,'magixmod']});
				if (G.getRes('insight').amount < G.getRes('wisdom').amount*1.6){
				G.gain('insight',insight);
				}
				var weakness=Math.floor(Math.random() * 4)
							G.gain('Berry seeds',weakness);
				}}
			}
			//influence trickle
			if(G.has('Glory')){
				if (G.getRes('influence').amount<=G.getRes('authority').amount-2)G.gain('influence',2);
			}else{
			if (G.getRes('influence').amount<=G.getRes('authority').amount-1)G.gain('influence',1);
			}
			//science trickle for bonus 2 or above
			if(G.has('Eotm')){
				if(G.has('bonus2') || G.has('bonus3') || G.has('bonus4')){
					if (G.getRes('science').amount<=G.getRes('education').amount-0.1)G.gain('science',0.1,'. . .');
				}
			}
			if(G.has('Ink-fishing')){G.getDict('squid').res['fish']['Ink']=0.001;G.getDict('squid').mult=0.95;}
			//Chra-nos bonus
			let goup = false
			let godown = false
			if(G.getRes('Watermelon seeds').amount>=0 && goup && !godown){
				G.gain('Watermelon seeds',1);
				if(G.getRes('Watermelon seeds').amount==100){
					goup=false
					godown=true
				}
			}else if(G.getRes('Watermelon seeds').amount<=100 && godown && !goup){
				G.lose('Watermelon seeds',1);
				if(G.getRes('Watermelon seeds').amount=1){
					goup=true
					godown=false
				}
			}
			
			if (G.year>=109 && G.year<=121 && !madeThievesWarn && G.hasNot('t1') && G.hasNot('t2')){
       				 G.Message({type:'bad',text:'<b><span style="color: #FFA500">Beware of thievery!</span></b> It will occur since now. Soon your people will start to punish them. Craft equipment for them so it will be even easier deal! Thieves are unhappy adults. They will show their unhappiness by commiting crimes. Even 200% <span style "color= aqua">Happiness</span> won\'t decrease their spawn rate to 0. Civilians (except kids)have a chance to die to thief or to beat him up.',icon:[23,1,'magixmod']});
				madeThievesWarn = true
				}else if(G.has('t1') || G.has('t2')){if(G.year>=109 && G.year<=121 && !madeThievesWarn){
       				 G.Message({type:'important',text:'You got used to Thieves and fact that they appear after year 110. But in this plane Thieves doesn\'t exist. It is good for you.',icon:[28,2,'magixmod',23,0,'magixmod']});
				madeThievesWarn = true
				}}
								    
			if (G.year>=29 && G.year<=31 && !madeWarnToolDecayMesg){
       				 G.Message({type:'important',text:'<font color="gray"><b>Your people noticed that tools they made have started decaying.</font> <li>This doesn\'t seem good.</li></b>',icon:[24,6,'magixmod']});
				madeWarnToolDecayMesg = true
			}
			if (G.year>=89 && G.year<=91 && !ThiefPreWarn){
				if(G.achievByName['mausoleum'].won==0){
       				 G.Message({type:'tutorial',text:'I need to warn you. In next 20 years something bad will start to occur. If you think that you can deal it without ascending by Mausoleum you are mistaken. Ascend as soon as possible.',icon:[32,27,'magixmod']});
				ThiefPreWarn = true
				}else{
					G.Message({type:'tutorial',text:'I need to warn you. In next 20 years something bad will start to occur. Seems like you ascended already. That is a good choice. You should prepare some <b>Armor</b> and <b>Metal weapons</b>.',icon:[32,27,'magixmod']});
				ThiefPreWarn = true
				}
			}
			if (G.year>=149 && G.year<=158 && !madeThanks4playmesg){
       				 G.Message({type:'important',text:'<span style="color= aqua">Seems like you are doing preety well. It is been 150 years since you started magic adventure with Magix additions. Thank you for playing with this expansion. Your playing makes mod better and motivates for future updates. <br> <b> -> </b>Remember mod is still getting bigger and gets more content. This means someday the mod may be unavaiable to play for while. If you will lose progress due to update we are sorry. Anyway keep enjoying this adventure... <br> </span><b>Farewell</b>',icon:[24,1,'magixmod']});
				madeThanks4playmesg = true
				}
			
			if (G.year>=9 && !backupmesg){
       				 G.Message({type:'important',text:'<b>Don\'t forget to backup your save!</b><br>If you don\'t want to lose your save you can always backup it. Click <b>Settings</b> tab then <b>Save to file</b> button. It will download a file with your save that you can load if your curent save ever got lost.',icon:[choose([25,26,27]),22,'magixmod']});
				backupmesg = true
				}
			if (G.year>=999 && G.year<=1005 && !milleniummesg){
       				 G.Message({type:'good',text:'Woah! It\'s been <b>1 thousand</b> years since your tribe started their existence. Your playing supports mod author and motivates for further updates. <br><b>Thank you ;)</b> <br><font color="lime"><tt>Continue enjoying Magix expansion.</tt></font>',icon:[27,23,'magixmod']});
				milleniummesg = true
				}
			if (G.year>=1999 && G.year<=2005 && !Secondmilleniummesg){
       				 G.Message({type:'good',text:'OMG! It\'s been <b>2 thousand</b> years since your tribe started their wonderful existence. Also I am sure that your adventure with Magix is not over yet. Your playing supports mod author and motivates for further updates. <br><b>Thank you ;)</b> <br><font color="lime"><tt>Continue enjoying Magix expansion.</tt></font>',icon:[32,30,'magixmod']});
				Secondmilleniummesg = true
				}
			////STORYLINE////
			if(G.techN >= 25 && G.techN <=34 && !st1){
				G.Message({type:'story1',text:'You glance at your <i>'+G.getName('inhabs')+'</i> for a while. Who knows if that small tribe is on a good way to become the empire or kingdom or whatever'});
				st1=true
			}
			if(G.techN > 35 && G.techN <=46 && !st2){
				G.Message({type:'story2',text:'All things go with its correct way'});
				st2=true
			}
			if(G.techN > 47 && G.techN <=52 && !st3){
				G.Message({type:'story1',text:'You want some mirror. But sadly no one can craft glass mirror yet. Luckily you didn\'t forget that you can use water surface as some sort of a mirror.',icon:[32,14,'magixmod']});
				st3=true
			}
			if(G.techN > 56 && G.techN <=69 && !st4){
				if(G.resets==0){
				G.Message({type:'story2',text:'You think that you should ascend someday no matter what. You feel it so strongly.',icon:[32,13,'magixmod']});
				st4=true
				}else if(G.resets>=1){
					G.Message({type:'story2',text:'You wonder how your tribe will look and how advanced it will become within next centuries.',icon:[32,12,'magixmod']});
				st4=true
			}
			}
			if(G.techN > 69 && G.techN <=77 && !st5){
				G.Message({type:'story1',text:'You organize storytelling at the beach. Well. Some wolf was lurking to wound some of your '+G.getName('inhabs')+' but some hunter takes it down before the tragedy.',icon:[7,11]});
				st5=true
			}
			if(G.techN > 77 && G.techN <=83 && !st6){
				G.Message({type:'good',text:'Some of your people believe that our existence may make a lot of good for this world... And that hope spreads.',icon:[32,11,'magixmod']});
				st6=true
			}
			if(G.techN > 83 && G.techN <=92 && !st7){
				G.Message({type:'story2',text:'One of dreamers asks you how are you today. You answer that you are fine. While you talking with this dreamer some firekeeper comes to you with water pot and some cured seafood. Great ; )',icon:[32,10,'magixmod']});
				st7=true
			}
			if(G.techN > 93 && G.techN <=99 && !st8){
				G.Message({type:'bad',text:'You had a nightmare someday. You saw there brutally wounded '+G.getName('inhab')+' . It really shocked and feared you.',icon:[32,9,'magixmod']});
				st8=true
			}
			if(G.techN > 99 && G.techN <=106 && !st9){
				G.Message({type:'good',text:'While wandering you noticed some angel waving at you. But you didn\'t understand what the angel did say to you. You are full of hope that it is some greeting.',icon:[32,8,'magixmod']});
				st9=true
			}
			if(G.techN > 108 && G.techN <=112 && !st10){
				G.Message({type:'story1',text:'This angel appears in your dreams. Now it said clearly that Paradise will be open for you and your tribe. You clearly remembered his words: <br><b><font color="#FFFED6">Dear '+G.getName('ruler')+' . I am so proud of you<br> and people you rule. They are sign that shows how worthy people are. <br>You teached them a lot.<br.Someday the Paradise will be open for you '+G.getName('ruler')+'and your '+G.getName('inhabs')+'</font></b>',icon:[32,8,'magixmod']});
				st10=true
			}
			if(G.techN > 112 && G.techN <=119 && !st11){
				G.Message({type:'good',text:'You see one of your carver works on gem block. You came closer to see the big gem block and even asked if he can teach you a little of carving. You spend some time with him and carved your first wooden statuette. Then you carved a crown for the statuette. Hooray.',icon:[32,7,'magixmod']});
				st11=true
			}
			if(G.techN > 119 && G.techN <=127 && !st12){
				G.Message({type:'story2',text:'He did a flip. lol',icon:[24,2,'magixmod']});
				st12=true
			}
			if(G.techN > 127 && G.techN <=138 && !st13){
				G.Message({type:'story1',text:'You look confused a little bit , but still your presence motivates your '+G.getName('inhabs')+' to discover more and more. But about what you are confused.',icon:[7,30,'magixmod']});
				st13=true
			}
			if(G.techN > 139 && G.techN <=143 && !st14){
				G.Message({type:'story2',text:'People has written book as they call it: "Book of Grand Herbalist" . It is all about herbalism proffesion. People related to druidism are preety proud of that.',icon:[30,30,'magixmod']});
				st14=true
			}
			if(G.techN > 143 && G.techN <=151 && !st15){
				G.Message({type:'story1',text:'Their creativity has no limits... definitely.',icon:[31,30,'magixmod']});
				st15=true
			}
		}
		if(G.has('t2')){
			if(G.getRes('population').amount>=Math.round(125-(G.achievByName['Unhappy'].won*2.5)-(G.techN/100))){
				var popinfo=Math.round(125-(G.achievByName['Unhappy'].won*2.5)-(G.techN/100))
				G.gain('unhappy',1)
				//Murdered by Madness
				//G.getRes('population')/150+(G.year+G.achievByName['Unhappy'].won*4/5)
				/////////////////////
				if(G.has('time measuring 1/2')){
			   G.Message({type:'bad',text:'Madness everywhere... people rob, kill. That\'s how Madness looks like. <br>Here comes cruel year report: <li>People murdered: '+Math.round((G.getRes('population').amount/80+((G.year/5)+G.achievByName['Unhappy'].won*4/5)))+'</li> <br>Population above <font color="orange">'+popinfo+'</font> presents cruel behaviours.'})
				}else if(rese==true){
			G.Message({type:'bad',text:'Madness everywhere... people rob, kill. That\'s how Madness looks like. <br> <li>People that got murdered last time: '+Math.round((G.getRes('population').amount/80+((G.year/5)+G.achievByName['Unhappy'].won*4/5)))+'</li> <br>Population above <font color="orange">'+popinfo+'</font> presents cruel behaviours.'})	
				}
				G.lose('adult',Math.round((G.getRes('population').amount/80+((G.year/5)+G.achievByName['Unhappy'].won*4/5))),'The Madness')
				G.gain('corpse',Math.round((G.getRes('corpse').amount/80+((G.year/5)+G.achievByName['Unhappy'].won*4/5))),'The Madness')
				G.gain('blood',Math.round((G.getRes('corpse').amount/80+((G.year/5)+G.achievByName['Unhappy'].won*4/5))),'The Madness')
				if(G.getRes('happiness').getDisplayAmount()=="-400%"){
					G.lose('population',G.getRes('population').amount,'The Madness')
				G.dialogue.popup(function(div){
            return '<div style="width:320x;min-height:200px;height:75%;">'+
                '<div class="fancyText title"><font color="red">Trial failed</font></div>'+
                '<tt><div class="fancyText">You failed Unhappy trial by reaching -400% unhappiness cap</tt>'+
        '<br>All people murdered themselves leaving no one alive.<br> This is cruel.<br>'+
                '<br><br>'+
                'But you can try again, by reaching Pantheon again and choose Bersaria</div><br>'+
                'Technical note: Start a new game , you know how.'+
            '</div></div>'
})
				}
		}
		}
		//SLEPPY INSIGHT
		
		if(G.checkPolicy('sleepy insight')=="-3"){
			var bonus=Math.floor(Math.random() * 14)+13;
			if(G.hasNot('Eotm')){
				if(G.getRes('chance').amount<=2.75 && G.getRes('insight').amount < G.getRes('wisdom').amount-bonus){
					G.gain('insight',bonus,'Sleepy Insight')}
				
			}else{
				if(G.getRes('chance').amount<=2.75 && G.getRes('insight II').amount < G.getRes('wisdom II').amount-bonus){
					G.gain('insight II',bonus,'Sleepy Insight')}
		}}
		if(G.checkPolicy('sleepy insight')=="-2"){
			var bonus=Math.floor(Math.random() * 9)+9;
			if(G.hasNot('Eotm')){
				if(G.getRes('chance').amount<=4.5 && G.getRes('insight').amount < G.getRes('wisdom').amount-bonus){
					G.gain('insight',bonus,'Sleepy Insight')}
				
			}else{
				if(G.getRes('chance').amount<=4.5 && G.getRes('insight II').amount < G.getRes('wisdom II').amount-bonus){
					G.gain('insight II',bonus,'Sleepy Insight')}
		}}
		if(G.checkPolicy('sleepy insight')=="-1"){
			var bonus=Math.floor(Math.random() * 7)+5;
			if(G.hasNot('Eotm')){
				if(G.getRes('chance').amount<=5 && G.getRes('insight').amount < G.getRes('wisdom').amount-bonus){
					G.gain('insight',bonus,'Sleepy Insight')}
				
			}else{
				if(G.getRes('chance').amount<=5 && G.getRes('insight II').amount < G.getRes('wisdom II').amount-bonus){
					G.gain('insight II',bonus,'Sleepy Insight')}
		}}
		if(G.checkPolicy('sleepy insight')=="0"){
			var bonus=Math.floor(Math.random() * 6)+3;
			if(G.hasNot('Eotm')){
				if(G.getRes('chance').amount<=7 && G.getRes('insight').amount < G.getRes('wisdom').amount-bonus){
					G.gain('insight',bonus,'Sleepy Insight')}
				
			}else{
				if(G.getRes('chance').amount<=7 && G.getRes('insight II').amount < G.getRes('wisdom II').amount-bonus){
					G.gain('insight II',bonus,'Sleepy Insight')}
		}}
		if(G.checkPolicy('sleepy insight')=="+1"){
			var bonus=Math.floor(Math.random() * 4)+1;
			if(G.hasNot('Eotm')){
				if(G.getRes('chance').amount<=8 && G.getRes('insight').amount < G.getRes('wisdom').amount-bonus){
					G.gain('insight',bonus,'Sleepy Insight')}
				
			}else{
				if(G.getRes('chance').amount<=8 && G.getRes('insight II').amount < G.getRes('wisdom II').amount-bonus){
					G.gain('insight II',bonus,'Sleepy Insight')}
		}}
		if(G.checkPolicy('sleepy insight')=="+2"){
			var bonus=Math.floor(Math.random() * 1.75)+0.25;
			if(G.hasNot('Eotm')){
				if(G.getRes('chance').amount<=9.5 && G.getRes('insight').amount < G.getRes('wisdom').amount-bonus){
					G.gain('insight',bonus,'Sleepy Insight')}
				
			}else{
				if(G.getRes('chance').amount<=9.5 && G.getRes('insight II').amount < G.getRes('wisdom II').amount-bonus){
					G.gain('insight II',bonus,'Sleepy Insight')}
		}}
		if(G.checkPolicy('sleepy insight')=="+3"){
			var bonus=Math.floor(Math.random() * 1.35)+1.15;
			if(G.hasNot('Eotm')){
				if(G.getRes('chance').amount<=10.25 && G.getRes('insight').amount < G.getRes('wisdom').amount-bonus){
					G.gain('insight',bonus,'Sleepy Insight')}
				
			}else{
				if(G.getRes('chance').amount<=10.25 && G.getRes('insight II').amount < G.getRes('wisdom II').amount-bonus){
					G.gain('insight II',bonus,'Sleepy Insight')}
		}}
		if(G.has('t3')){
			if(G.getRes('cultural balance').amount >= 50-(G.achievByName['Cultural'].won/2) || G.getRes('cultural balance').amount<=0+(G.achievByName['Cultural'].won/2)){
			G.lose('population',G.getRes('population').amount)
				G.dialogue.popup(function(div){
            return '<div style="width:320x;min-height:200px;height:75%;">'+
                '<div class="fancyText title"><font color="red">Trial failed</font></div>'+
                '<tt><div class="fancyText">You failed Cultural trial</tt>'+
        '<br>You have been kicked out of this plane.<br>'+
                '<br><br>'+
                'But you can try again, by reaching Pantheon again and choose Tu-ria</div><br>'+
                'Technical note: Start a new game , you know how.'+
            '</div></div>'
})
			}
				var culture=Math.floor(Math.random()*12);
			if(G.has('time measuring 2/2')){
				G.Message({type:'important',text:'During this year Tu-ria has brought down to you:<br><b><font color="#aaffcc">'+B(culture)+' Culture</font></b> and <b><font color="#ffbbbb">'+(culture/2)+' Influence</font></b>',icon:[10,11,'magixmod']});
			}else if(rese==true){
				G.Message({type:'important',text:'Recently Tu-ria has brought down to you:<br><b><font color="#aaffcc">'+B(culture)+' Culture</font></b> and <b><font color="#ffbbbb">'+(culture/2)+' Influence</font></b>',icon:[10,11,'magixmod']});
			}
				if (G.getRes('culture').amount < G.getRes('inspiration').amount-culture){
				G.gain('culture',culture);
				}
				if (G.getRes('influence').amount < G.getRes('authority').amount-(culture/2)){
				G.gain('influence',culture/2);
				}
			G.gain('cultural balance',Math.random()/2)
			var relicChance=Math.round(Math.random()*100);
				if(relicChance<=10 && G.has('digging')){
					var cultChance=Math.round(Math.random()*100);
					if(cultChance<=10)
					{
					G.Message({type:'bad',text:'Your people found a relic while digging underground. Sadly this relic isn\'t related to culture in any way.',icon:[3,12,8,29,'magixmod']})
					}else{
					G.Message({type:'good',text:'Your people found a relic while digging underground. This relic is related to culture increasing up your <b>Cultural balance</b>. Fantastic',icon:[4,12,8,29,'magixmod']})
						G.gain('cultural balance',Math.round(Math.random()*2)+1)
					}
				}
	}
		if(G.has('t4'))G.lose('population',G.getRes('population').amount*0.03);
		if(G.has('t11'))G.lose('faith',5+G.achievByName['Faithful'].won);
		if(G.has('t11') && G.getRes('faith').amount==0){
			G.lose('population',G.getRes('population').amount);	
			G.dialogue.popup(function(div){
            return '<div style="width:320x;min-height:200px;height:75%;">'+
                '<div class="fancyText title"><font color="red">Trial failed</font></div>'+
                '<tt><div class="fancyText">You failed Faithful trial because you lost all Faith</tt>'+
        '<br>You have been kicked out of this plane.<br>'+
                '<br><br>'+
                'But you can try again, by reaching Pantheon again and choose Enlightened</div><br>'+
                'Technical note: Start a new game , you know how.'+
            '</div></div>'
})
		}
}
	G.props['new day lines']=[ //2 quotes per line
		'Creatures are lurking.',	'Danger abounds.',
		'Wild beasts are on the prowl.',	'Large monsters roam, unseen.',
		'This is a cold night.',	'No sound but the low hum of a gray sky.',
		'The darkness is terrifying.',	'Clouds twist in complicated shapes.',
		'It is raining.',	'Dark birds caw ominously in the distance.',
		'There is a storm on the horizon.',	'The night is unforgiving.',
		'Creatures crawl in the shadows.',	'A stream burbles quietly nearby.',
		'In the distance, a prey falls to a pack of beasts.',	'An unexplained sound echoes on the horizon.',
		'Everything stands still in the morning air.',	'A droning sound fills the sky.',
		'The night sky sparkles, its mysteries unbroken.',	'Dry bones crack and burst underfoot.',
		'Wild thorns scratch the ankles.',	'Something howls in the distance.',
		'Strange ashes snow down slowly from far away.',	'A blood-curdling wail is heard.',
		'Unknown creatures roll and scurry in the dirt.',	'The air carries a peculiar smell today.',
		'Wild scents flow in from elsewhere.',	'The dust is oppressive.',
		'Wind blows from the north.',	'Secrets await.',
		'Discover unknown.',	'A morning fog welcomes you.',
		'An eerie glow from above illuminates the night.',
		'Distant lands lay undisturbed.',	'<b>Magic awaits.</b>',
		'A cool breeze is blowing.',	'Another sea wave crashes against a huge rock.',
		'What a cloudy day today.',	'It\'s dry air today.',
		'Wild brambles look so scary even from far.',	'Some dangerous creature sleeps calmly.',
		'From far a sounds of a falling tree can be heard',	'There is no wind today.',
		'Just the another day in your tribe',	'From somwhere a meowing sound can be heard',
		'Uncover the secrets',	'Merge with nature',
		'Discover undiscovered',	'This is a lush evening.',
		'Another sea wave crashes against a tall cliff.',
	];
	/*=====================================================================================
	Halloween ToT
	=======================================================================================*/
	G.funcs['ToT']=function(){
		if(G.on){
			if(G.has('pumpkins')){
		 var pumpkinroulette=Math.round(Math.random()*100)+1;
		var ic=Math.round(Math.random()*1)+7;
			const loottabfcase=['<b>Pieces of cooked meat</b>','<b>Fruits</b>','<b>Pieces of cooked seafood</b>','<b>Colored clothing</b>','<b>Herbs</b>'];
			const pumpkinnames=['Etienne','Beth','Blushy','Dasher','Chester','Billy','Jimmy','Claire','Peter','Josh','Albert'];
			var name=Math.round(Math.random()*11); //Name of pumpkin that will be displayed in message
			var loot=Math.round(Math.random()*4); //What you will gain
			var amount;
			
		if(pumpkinroulette>=1 && pumpkinroulette<=15){
			if(loot==0){amount=G.getRes('cooked meat').amount*0.33;G.gain('cooked meat',amount,'<font color="orange">Treat</font>');};if(loot==1){amount=G.getRes('fruit').amount*0.33;G.gain('fruit',amount,'<font color="orange">Treat</font>');};if(loot==2){amount=G.getRes('cooked seafood').amount*0.33;G.gain('cooked seafood','<font color="orange">Treat</font>');};if(loot==3){amount=G.getRes('Colored clothing').amount*0.6;G.gain('Colored clothing',amount,'<font color="orange">Treat</font>');};if(loot==4){amount=G.getRes('herb').amount*0.33;G.gain('herb',amount,'<font color="orange">Treat</font>');};
		G.Message({type:'tot',text:'Oh a '+pumpkinnames[name]+'\'o Pumpkin arrives there. After a strong smash your people managed to collect '+B(amount)+' <font color="pink">'+loottabfcase[loot]+'</font> outta it. <b>Noice!</b>',icon:[ic,7,'seasonal']}); //7,8
			
		}else if(pumpkinroulette>15 && pumpkinroulette<=28){
		G.Message({type:'tot',text:'Oh a '+pumpkinnames[name]+'\'o Pumpkin arrives there. After a loud , strong smash you see... that inside of this pumpkin... there was... nothing... <br><b>Trick!</b>',icon:[9,7,'seasonal']});
		}else if(pumpkinroulette>28 && pumpkinroulette<=36){
			var amount=G.getRes('water').amount*0.4;
			G.gain('water',amount,'<font color="orange">Treat</font>');
		G.Message({type:'tot',text:'Oh a '+pumpkinnames[name]+'\'o Pumpkin arrives there. Before smash pumpkin unleashed from itself alot of water(probably his tears). Without caring about it a civillian smashes it and that\'s how you gain '+B(amount)+' <b>Water</b> <br>That\'s it!',icon:[13,7,'seasonal']});
		}else if(pumpkinroulette>36 && pumpkinroulette<=38 && G.has('Juicy expertise') && G.has('pumpkins II')){
			var amount=G.getRes('Berry juice').amount*0.3+G.getRes('Watermelon juice').amount*0.3+G.getRes('Fruit juice').amount*0.3;
			var juicetype=Math.round(Math.random()*3);
			if(juicetype==0)G.gain('Berry juice',amount,'<font color="orange">Treat</font>');if(juicetype==1)G.gain('Watermelon juice',amount,'<font color="orange">Treat</font>');if(juicetype==2)G.gain('Fruit juice',amount,'<font color="orange">Treat</font>');
		G.Message({type:'tot',text:'Oh a '+pumpkinnames[name]+'\'o Pumpkin arrives there. Before smash pumpkin unleashed from itself alot of colorful juicy water(probably his tears). Without caring about it an elder smashes it and that\'s how you gain '+amount+' <b>liters of tasty Juices</b> <br>That\'s it!',icon:[14,7,'seasonal']});
		}else if(pumpkinroulette>38 && pumpkinroulette<=41 && G.has('pumpkins II') && G.getRes('insight').amount<=G.getRes('wisdom').amount && G.getRes('culture').amount<=G.getRes('inspiration').amount && G.getRes('faith').amount<=G.getRes('spirituality').amount && G.getRes('insight II').amount<=G.getRes('wisdom II').amount && G.getRes('culture II').amount<=G.getRes('inspiration II').amount && G.getRes('faith II').amount<=G.getRes('spirituality II').amount && G.getRes('influence').amount<=G.getRes('authority').amount && G.getRes('influence II').amount<=G.getRes('authority II').amount){ //ONCE A YEAR IT CAN OVERCAP. IT's fine :)
			const loottabgcase=['Insight','Culture','Faith','Influence'];
			const loottabgcase2=['Insight II','Culture II','Faith II','Influence II'];
			var lootg=Math.round(Math.random()*3);
			var amount;
			if(G.hasNot('Eotm')){
				if(lootg==0)amount=10+(G.getRes('wisdom').amount/7);G.gain('insight',amount,'<font color="orange">Treat</font>');
				if(lootg==1)amount=5+(G.getRes('inspiration').amount/7);G.gain('culture',amount,'<font color="orange">Treat</font>');
				if(lootg==2)amount=2.5+(G.getRes('spirituality').amount/7);G.gain('faith',amount,'<font color="orange">Treat</font>');
				if(lootg==3)amount=4+(G.getRes('authority').amount/7);G.gain('influence',amount,'<font color="orange">Treat</font>');
			}else{
				if(lootg==0)amount=5+(G.getRes('wisdom II').amount/7);G.gain('insight II',amount,'<font color="orange">Treat</font>');
				if(lootg==1)amount=3+(G.getRes('inspiration II').amount/7);G.gain('culture II',amount,'<font color="orange">Treat</font>');
				if(lootg==2)amount=2.5+(G.getRes('spirituality II').amount/7);G.gain('faith II',amount,'<font color="orange">Treat</font>');
				if(lootg==3)amount=3+(G.getRes('authority II').amount/7);G.gain('influence II',amount,'<font color="orange">Treat</font>');
			}
			if(G.hasNot('Eotm')){
		G.Message({type:'tot',text:'Oh a '+pumpkinnames[name]+'\'o Pumpkin arrives there. After a smash the pumpkin was... not so empty. It had a essential. You gained<b> '+B(amount)+' '+loottabgcase[lootg]+'</b>.',icon:[11,7,'seasonal']});
			}else{
		G.Message({type:'tot',text:'Oh a '+pumpkinnames[name]+'\'o Pumpkin arrives there. After a smash the pumpkin was... not so empty. It had a essential. You gained<b> '+B(amount)+' '+loottabgcase2[lootg]+'</b>.',icon:[12,7,'seasonal']});	
			}
		}else if(pumpkinroulette>41 && pumpkinroulette<=43 && G.has('pumpkins II')){ 
			var amount=G.getRes('fire pit').amount*0.4;
			G.gain('fire pit',amount,'<font color="orange">Treat</font>');
		G.Message({type:'tot',text:'Oh a '+pumpkinnames[name]+'\'o Pumpkin arrives there. This pumpkin is so warm. Even fire roars outta the fruit. Ignoring that someone smashes it and that\'s how you gain '+B(amount)+' <b>Fire pits</b> for your tribe. <br>Amazing!',icon:[15,7,'seasonal']});
		}
		}}
	}
	///////////////////
	G.Message=function(obj)
	{
		//syntax :
		//G.Message({type:'important',text:'This is a message.'});
		//.type is optional
		var me={};
		me.type='normal';
		for (var i in obj) {me[i]=obj[i];}
		var scrolled=!(Math.abs(G.messagesWrapl.scrollTop-(G.messagesWrapl.scrollHeight-G.messagesWrapl.offsetHeight))<3);//is the message list not scrolled at the bottom? (if yes, don't update the scroll - the player probably manually scrolled it)
		
		me.date=G.year*300+G.day;
		var text=me.text||me.textFunc(me.args);
		
		var mergeWith=0;
		if (me.mergeId)
		{
			//this is a system where similar messages merge together if they're within 100 days of each other, in order to reduce spam
			//simply declare a .mergeId to activate merging on this message with others like it
			//syntax :
			//var cakes=10;G.Message({type:'important',mergeId:'newCakes',textFunc:function(args){return 'We\'ve baked '+args.n+' new cakes.';},args:{n:cakes}});
			//numeric arguments will be added to the old ones unless .replaceOnly is true
			
			for (var i in G.messages)
			{
				var other=G.messages[i];
				if (other.id==me.mergeId && me.date-other.date<100) mergeWith=other;
			}
			me.id=me.mergeId;
		}
		if (mergeWith)
		{
			me.date=other.date;
			if (me.replaceOnly)
			{
				for (var i in me.args)
				{mergeWith.args[i]=me.args[i];}
			}
			else
			{
				for (var i in me.args)
				{
					if (!isNaN(parseFloat(me.args[i]))) mergeWith.args[i]+=me.args[i];
					else mergeWith.args[i]=me.args[i];
				}
			}
			text=me.textFunc(mergeWith.args);
		}
		if(G.has('primary time measure') && G.hasNot('time measuring 1/2')){
		var str='<div class="messageTimestamp" title="'+'century '+Math.floor(((G.year/100)+1))+'">'+'C:'+Math.floor(((G.year/100)+1))+'</div>'+
		'<div class="messageContent'+(me.icon?' hasIcon':'')+'">'+(me.icon?(G.getArbitraryIcon(me.icon)):'')+'<span class="messageText">'+text+'</span></div>';
		}
		else if(G.has('primary time measure') && G.has('time measuring 1/2')){
		var str='<div class="messageTimestamp" title="'+'year '+(G.year+1)+', day '+(G.day+1)+'">'+'Y:'+(G.year+1)+'</div>'+
		'<div class="messageContent'+(me.icon?' hasIcon':'')+'">'+(me.icon?(G.getArbitraryIcon(me.icon)):'')+'<span class="messageText">'+text+'</span></div>';
		}else{
		var str='<div class="messageTimestamp"></div>'+
		'<div class="messageContent'+(me.icon?' hasIcon':'')+'">'+(me.icon?(G.getArbitraryIcon(me.icon)):'')+'<span class="messageText">'+text+'</span></div>';	
		}
		if (mergeWith) mergeWith.l.innerHTML=str;
		else
		{
			var div=document.createElement('div');
			div.innerHTML=str;
			div.className='message popInVertical '+(me.type).replaceAll(' ','Message ')+'Message';
			G.messagesl.appendChild(div);
			me.l=div;
			G.messages.push(me);
			if (G.messages.length>G.maxMessages)
			{
				var el=G.messagesl.firstChild;
				for (var i in G.messages)
				{
					if (G.messages[i].l==el)
					{
						G.messages.splice(i,1);
						break;
					}
				}
				G.messagesl.removeChild(el);
				//G.messages.pop();
				//G.messagesl.removeChild(G.messagesl.firstChild);
			}
			if (!scrolled) G.messagesWrapl.scrollTop=G.messagesWrapl.scrollHeight-G.messagesWrapl.offsetHeight;
		}
		G.addCallbacks();
	}
		G.Logic=function(forceTick)
	{
		//forceTick lets us execute logic and force a tick update

		if (G.sequence=='loading' || G.sequence=='checking' || G.sequence=='updating')
		{
			var done=G.LogicModLoading();
		}
		else if (G.sequence=='main')
		{
			G.oldSpeed=G.speed;
			G.speed=1;
			if (G.getSetting('fast')) G.speed=2;
			if (G.getSetting('paused')) G.speed=0;
			if (G.getSetting('forcePaused')) G.speed=0;
			if (forceTick) G.speed=1;
			
			if (G.speed==0)
			{
				//accumulate fast ticks when paused
				G.nextFastTick--;
				if (G.nextFastTick<=0) {G.fastTicks++;G.nextFastTick=G.tickDuration;}
			}
			
			if (G.oldSpeed!=G.speed)
			{
				if (G.speed==1)
				{
					G.wrapl.classList.remove('speed0');
					G.wrapl.classList.add('speed1');
					G.wrapl.classList.remove('speed2');
				}
				else if (G.speed==2)
				{
					G.wrapl.classList.remove('speed0');
					G.wrapl.classList.remove('speed1');
					G.wrapl.classList.add('speed2');
				}
				else
				{
					G.wrapl.classList.add('speed0');
					G.wrapl.classList.remove('speed1');
					G.wrapl.classList.remove('speed2');
				}
			}
			
			if (G.T>0 && G.oldSpeed!=G.speed)
			{
				if (G.speed==0)//just paused
				{
					l('foreground').style.display='block';
					G.middleText('- Pause -<br><small>Press space to unpause</small>');
				}
				else if (G.oldSpeed==0)//just unpaused
				{
					l('foreground').style.display='none';
					if (G.T>0) G.middleText('- Unpaused -');
				}
				else if (G.speed==1)
				{
					G.middleText('- Speed x1 -');
				}
				else if (G.speed==2)
				{
					G.middleText('- Speed x30 -');
				}
			}
			
			if (G.speed>0)//not paused
			{
				if (G.nextTick<=0 || forceTick)
				{
					if (G.speed==2)
					{
						//use up fast ticks when on fast speed
						G.fastTicks--;
						if (G.fastTicks<=0) {G.fastTicks=0;G.speed=1;G.setSetting('fast',0);}
					}
					G.logic['res']();
					G.logic['unit']();
					G.logic['land']();
					G.logic['tech']();
					G.logic['trait']();
					
					//exploring
					var map=G.currentMap;
					var updateMap=false;
					if (G.exploreOwnedTiles && map.tilesByOwner[1].length>0)
					{
						G.exploreOwnedTiles=randomFloor(G.exploreOwnedTiles);
						for (var i=0;i<G.exploreOwnedTiles;i++)
						{
							var tile=choose(map.tilesByOwner[1]);
							if (tile.explored<1)
							{
								tile.explored+=0.01;
								tile.explored=Math.min(tile.explored,1);
								G.tileToRender(tile);
								updateMap=true;
							}
						}
					}
					if (G.exploreNewTiles && map.tilesByOwner[1].length>0)
					{
						G.exploreNewTiles=randomFloor(G.exploreNewTiles);
						for (var i=0;i<G.exploreNewTiles;i++)
						{
							var dirs=[];
							var tile=choose(map.tilesByOwner[1]);
							var fromLand=true;
							if (tile.land.ocean) fromLand=false;
							if (fromLand || G.allowShoreExplore)
							{
								if (tile.x>0 && map.tiles[tile.x-1][tile.y].explored==0) dirs.push([-1,0]);
								if (tile.x<map.w-1 && map.tiles[tile.x+1][tile.y].explored==0) dirs.push([1,0]);
								if (tile.y>0 && map.tiles[tile.x][tile.y-1].explored==0) dirs.push([0,-1]);
								if (tile.y<map.h-1 && map.tiles[tile.x][tile.y+1].explored==0) dirs.push([0,1]);
								if (dirs.length>0)
								{
									var dir=choose(dirs);
									tile=map.tiles[tile.x+dir[0]][tile.y+dir[1]];
									var isShore=false;
									if (tile.land.ocean && fromLand) isShore=true;
									if (G.allowOceanExplore || !tile.land.ocean || isShore)
									{
										tile.owner=1;
										tile.explored+=0.1;
										G.tileToRender(tile);
										updateMap=true;
										G.doFuncWithArgs('found tile',[tile]);
									}
								}
							}
						}
					}
					if (updateMap)
					{
						G.updateMapForOwners(map);
						//G.mapToRefresh=true;
					}
					G.exploreOwnedTiles=0;
					G.exploreNewTiles=0;
					
					
					G.tickChooseBoxes();
					G.nextTick=(G.speed==1?G.tickDuration:1);
					G.tick++;
					if (G.day>0 || G.tick>1) {G.day++;G.totalDays++;G.furthestDay=Math.max(G.furthestDay,G.day+G.year*300);G.doFunc('new day');}
					if (G.day>300) {G.day=0;G.year++;G.doFunc('new year');}
					//Time measuring tech. It will have 2 levels. Here goes the code:
		if(G.hasNot('time measuring 1/2') && G.hasNot('primary time measure')){
			l('date').innerHTML='No '+G.getName('civ')+' knows the time yet';
   			G.addTooltip(l('date'),function(){return '<div class="barred">Date</div><div class="par">While researching people may get <b>Primary time measure</b> knowledge to display current date<br>(you\'ll see Centuries).<br> Despite of that you do not see current date events related to time may still occur.</div>';},{offY:-8});
			 G.addTooltip(l('fastTicks'),function(){return '<div class="barred">Fast ticks</div><div class="par">This is how many ingame days you can run at fast speed.</div><div class="par">You gain a fast tick for every second you\'re paused or offline.</div><div class="par">You also gain fast ticks everytime you research a technology.</div><div class="divider"></div><div class="par">You currently have <b>'+BT(G.fastTicks)+'</b> of game time saved up,<br>which will execute in <b>'+BT(G.fastTicks/30)+'</b> at fast speed</b>.</div>';},{offY:-8});   
			    }
		else if(G.has('primary time measure') && G.hasNot('time measuring 1/2') && G.hasNot('time measuring 2/2')){
			l('date').innerHTML='Century '+Math.floor(((G.year/100)+1))+' in '+G.getName('civ');
			G.addTooltip(l('fastTicks'),function(){return '<div class="barred">Fast ticks</div><div class="par">This is how many ingame days you can run at fast speed.</div><div class="par">You gain a fast tick for every second you\'re paused or offline.</div><div class="par">You also gain fast ticks everytime you research a technology.</div><div class="divider"></div><div class="par">You currently have <b>'+BT(G.fastTicks)+'</b> of game time saved up,<br>which will execute in <b>'+BT(G.fastTicks/30)+'</b> at fast speed</b>.</div>';},{offY:-8});
   			 G.addTooltip(l('date'),function(){return '<div class="barred">Date</div><div class="par">This is the current date in your civilization.<br>Sometime people start a new centrury. To see years obtain <b>Time measuring</b> 1/2 research.</div>';},{offY:-8});
			    
			    }else if(G.has('primary time measure') && G.has('time measuring 1/2') && G.hasNot('time measuring 2/2')){
			l('date').innerHTML='Year '+(G.year+1)+' in '+G.getName('civ');
				    	G.addTooltip(l('fastTicks'),function(){return '<div class="barred">Fast ticks</div><div class="par">This is how many ingame days you can run at fast speed.</div><div class="par">You gain a fast tick for every second you\'re paused or offline.</div><div class="par">You also gain fast ticks everytime you research a technology.</div><div class="divider"></div><div class="par">You currently have <b>'+BT(G.fastTicks)+'</b> of game time saved up,<br>which will execute in <b>'+BT(G.fastTicks/30)+'</b> at fast speed,<br>advancing your civilization by <b>'+Math.floor(G.fastTicks/300)+' years</b>.</div>';},{offY:-8});
   			 G.addTooltip(l('date'),function(){return '<div class="barred">Date</div><div class="par">This is the current date in your civilization.<br>Sometime a new year starts. To see days obtain <b>Time measuring</b> 2/2 research.</div>';},{offY:-8});
			    
			    }else if(G.has('primary time measure') && G.has('time measuring 1/2') && G.has('time measuring 2/2')){
			l('date').innerHTML='Year '+(G.year+1)+', day '+(G.day+1)+' in '+G.getName('civ');
			G.addTooltip(l('fastTicks'),function(){return '<div class="barred">Fast ticks</div><div class="par">This is how many ingame days you can run at fast speed.</div><div class="par">You gain a fast tick for every second you\'re paused or offline.</div><div class="par">You also gain fast ticks everytime you research a technology.</div><div class="divider"></div><div class="par">You currently have <b>'+BT(G.fastTicks)+'</b> of game time saved up,<br>which will execute in <b>'+BT(G.fastTicks/30)+'</b> at fast speed,<br>advancing your civilization by <b>'+G.BT(G.fastTicks)+'</b>.</div>';},{offY:-8});
   			 G.addTooltip(l('date'),function(){return '<div class="barred">Date</div><div class="par">This is the current date in your civilization.<br>One day elapses ....every second, and 300 days make up a year.</div>';},{offY:-8});
			    
			    }    
				}
				if (!forceTick) G.nextTick--;
			}
			if(G.hasNot('time measuring 2/2') && G.hasNot('time measuring 1/2')){
			l('fastTicks').innerHTML=''+B(G.fastTicks)+' fast ticks';
			}else if(G.has('time measuring 1/2') && G.hasNot('time measuring 2/2')){
			l('fastTicks').innerHTML=''+B(G.fastTicks/300)+' years';
			}else if(G.has('time measuring 1/2') && G.has('time measuring 2/2')){
			l('fastTicks').innerHTML=G.BT(G.fastTicks);
			}
			if (G.getSetting('autosave') && G.T%(G.fps*60)==(G.fps*60-1)) G.Save();
		}
		
		if (G.mapToRefresh) G.refreshMap(G.currentMap);
		if (G.mapToRedraw) G.redrawMap(G.currentMap);
		
		if (G.shouldRunReqs)
		{
			G.runUnitReqs();
			G.runPolicyReqs();
			G.update['unit']();
			G.shouldRunReqs=0;
		}
		
		G.logicMapDisplay();
		G.widget.update();
		if (G.T%5==0) G.tooltip.refresh();
		G.tooltip.update();
		G.infoPopup.update();
		G.popupSquares.update();
		G.updateMessages();
		
		//keyboard shortcuts
		if (G.keysD[27]) {G.dialogue.close();}//esc
		if (G.sequence=='main')
		{
			if (G.keys[17] && G.keysD[83]) {G.Save();}//ctrl-s
			if (G.keysD[32])//space
			{
				if (G.getSetting('paused')) G.setSetting('paused',0);
				else G.setSetting('paused',1)
			}
		}
		
		G.logic['particles']();
		
		if (G.T%5==0 && G.resizing) {G.stabilizeResize();}
		
		if (G.mouseUp) G.mousePressed=false;
		G.mouseDown=false;
		G.mouseUp=false;
		if (G.mouseMoved && G.mousePressed) G.draggedFrames++; else if (!G.mousePressed) G.draggedFrames=0;
		G.mouseMoved=0;
		G.Scroll=0;
		G.clickL=0;
		G.keysD=[];
		G.keysU=[];
		if (document.activeElement.nodeName=='TEXTAREA' || document.activeElement.nodeName=='INPUT') G.keys=[];
		
		G.T++;
	}
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
							G.doCost(me.cost,1);
							G.gainTrait(me);
							switch(me.category){
								case "knowledge":G.Message({type:'important tall',text:'Your people have adopted the knowledge: <b>'+me.displayName+'</b>.',icon:me.icon});break;
								case "devils":G.Message({type:'bad tall',text:'Devils brought to your people: <b>'+me.displayName+'</b>.',icon:me.icon});break;
								case "gods":G.Message({type:'good tall',text:'Kind God brought down to your people: <b>'+me.displayName+'</b>.',icon:me.icon});break;
								case "religion":G.Message({type:'story2 tall',text:'Believements and hopes of your people have brought a religious trait: <b>'+me.displayName+'</b>.',icon:me.icon});break;
								case "short":G.Message({type:'important tall',text:'Your people have adopted the <u>short-term</u> trait <b>'+me.displayName+'</b>.',icon:me.icon}); break;
								case "long":G.Message({type:'important tall',text:'Your people have adopted the <u>long-term</u> trait <b>'+me.displayName+'</b>.',icon:me.icon}); break;
								default:G.Message({type:'important tall',text:'Your people have adopted the trait <b>'+me.displayName+'</b>.',icon:me.icon}); break;
							}
							if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
							{
								var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GainedTrait.mp3');
								audio.play(); 
							}
						}
					}
				}
			}
			
				
		//0/0 insight fix
		if(G.has('Wizard wisdom') && G.getUnitAmount('Wizard')>=1){
			if(G.getRes('wisdom').amount<100){
		G.gain('wisdom',1)	
		}}//year1&2 nerf
		if(G.year<=1){
		G.gain('happiness',0.27)
		}
		}
		
		if(G.has('t11')){ca=2 ; cb=1;};
		faicost=1*(G.getRes("New world point").amount/6)*((G.achievByName['Faithful'].won/2)+1);
		inscost=1*(G.getRes("New world point").amount/3)*((G.achievByName['Faithful'].won/2)+1);
		if(G.achievByName['god complex'].won>=1){G.achievByName['god complex'].visible=true}else{G.achievByName['god complex'].visible=false};
	};
	
	G.funcs['tracked stat str c1']=function()
	{
		return 'Most population ruled';
	}
	G.funcs['tracked stat str techs']=function()
	{
		return 'Current amount of obtained researches';
	}
	G.funcs['tracked stat str traits']=function()
	{
		return 'Current amount of adopted traits';
	}
	G.funcs['civ blurb']=function()
	{
		var str='';
		str+='<div class="fancyText shadowed">'+
		'<font color="aqua"><div class="barred infoTitle">The land of '+G.getName('civ')+' </font></div>'+
		'<div class="barred">ruler : '+G.getName('ruler')+'</div>';
		var toParse='';
		var pop=G.getRes('population').amount;
		if (pop>0)
		{
			toParse+='Population : <b>'+B(pop)+' [population,'+G.getName((pop==1?'inhab':'inhabs'))+']</b>//';
			var stat=G.getRes('happiness').amount/pop;
			var text='unknown';if (stat<=-200 && G.has('t2')) text='irreversibly unhappy & miserable';else if (stat<=-200) text='miserable'; else if (stat<=-100) text='mediocre'; else if (stat<=-50) text='low'; else if (stat<50) text='average'; else if (stat<100) text='pleasant'; else if (stat<=200) text='high'; else if (stat>=200) text='euphoric';
			toParse+='Happiness : <b>'+text+'</b>//';
			var stat=G.getRes('health').amount/pop;
			var text='unknown';if (stat<=-200) text='dreadful'; else if (stat<=-100) text='sickly'; else if (stat<=-50) text='low'; else if (stat<50) text='average'; else if (stat<100) text='good'; else if (stat<=200) text='gleaming'; else if (stat>=200) text='examplary';
			toParse+='Health : <b>'+text+'</b>//';
			var stat=G.techN;
			var text='unknown';if (stat<=25) text='pre-prehistoric';else if (stat<=50) text='prehistoric'; else if (stat<=100) text='skilled'; else if (stat<=170) text='decent technologically'; else if (stat<=240) text='expanded'; else if (stat<=325) text='advanced'; else if (stat<=400) text='modern'; else if (stat<=500) text='truly advanced'; else if (stat>=500) text='most advanced';
			toParse+='Technological stage: <b>'+text+'</b>//';
		}
		else toParse+='All '+G.getName('inhabs')+' have died out.';
		str+=G.parse(toParse);
		str+='</div>';
		return str;
	}
	
	G.funcs['found tile']=function(tile)
	{
	
		G.Message({type:'good',mergeId:'foundTile',textFunc:function(args){
			if(args.tile.land.displayName=="Dead forest"){G.achievByName['lands of despair'].won=G.achievByName['lands of despair'].won+1;if(G.achievByName['lands of despair'].won<1){G.middleText('- Completed <font color="gray">Lands of despair</font> achievement -','slow')}};
			if (args.count==1){ return 'Our explorers have found a new tile : <b>'+args.tile.land.displayName;+'</b>.'
			}else{ return 'Our explorers have found '+B(args.count)+' new tiles; the latest is <b>'+args.tile.land.displayName;+'</b>.'};
						     
		},args:{tile:tile,count:1},icon:[14,4]});

	}
	
	G.funcs['production multiplier']=function()
	{
		if (t1start==true){
			var mult=1-((G.getRes('Berry seeds').amount/2500)*(G.achievByName['Patience'].won+1/4));
		if (G.getRes('population').amount>0)
		{
			var happiness=(G.getRes('happiness').amount/G.getRes('population').amount)/100;
			happiness=Math.max(-2,Math.min(2,happiness));
			if (happiness>=0) mult=(Math.pow(2,happiness+1)/2)-((G.getRes('Berry seeds').amount/500)*G.achievByName['Patience'].won);
			else mult=1/(Math.pow(2,-happiness+1)/2)-((G.getRes('Berry seeds').amount/500)*G.achievByName['Patience'].won);
		}
		return mult;
		}else if(G.has('t2')){
			var mult=1-(G.techN/100-G.achievByName['Unhappy'].won);
			if (G.getRes('population').amount>0)
				{
				var happiness=(G.getRes('happiness').amount/G.getRes('population').amount)/100;
				happiness=Math.max(-2,Math.min(2,happiness));
				if (happiness>=0) mult=(Math.pow(2,happiness+1)/2);
				else mult=1/(Math.pow(2,-happiness+1)/2);
			}
			return mult;
		
		}else{
		var mult=1;
		if (G.getRes('population').amount>0)
		{
			var happiness=(G.getRes('happiness').amount/G.getRes('population').amount)/100;
			happiness=Math.max(-2,Math.min(2,happiness));
			if (happiness>=0) mult=(Math.pow(2,happiness+1)/2);
			else mult=1/(Math.pow(2,-happiness+1)/2);
		}
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
		//G.tabs.push({
			
		// Don't make assumptions about the existing tabs
		// (or another mod that does the same thing)
		// make sure everything is numbered and built properly
		//for (var i=0;i<G.tabs.length;i++){G.tabs[i].I=i;}
		//G.buildTabs();
	}
	
	G.tabPopup['Magix']=function()
	{
		var str='';
		str+='<div class="par">'+
		'<b>The Magix mod</b> is a mod for NeverEnding Legacy made by <b>pelletsstarPL</b>.'+'It is currently in beta, may feature strange and exotic bugs, and may be updated at any time.</div>'+'<div class="par">While in development, the mod may be unstable and subject to changes, but the overall goal is to '+
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
		'<div class="barred fancyText"><a href="https://pipe.miroware.io/5db9be8a56a97834b159fd5b/--MAGIX--/Magix.html" target="_blank">Update log</a><div><div>'+
		'<div class="divider"></div>'+
		G.writeMSettingCategories()+
		'<div class="divider"></div>'+
		'<div class="buttonBox">'+
		G.dialogue.getCloseButton()+
		'</div>';
		return str;
}

/*=====================================================================================
	ACHIEVEMENTS AND LEGACY
		When the player completes a wonder, they may click it to ascend; this takes them to the new game screen.
		Ascending with a wonder unlocks that wonder's achievement and its associated effects, which can be anything from adding free fast ticks at the start of every game to unlocking new special units available in every playthrough.
		There are other achievements, not necessarily linked to wonders. Some achievements are used to track generic things across playthroughs, such as tutorial tips.
	=======================================================================================*/
	G.achiev=[];
	G.achievByName=[];
	G.achievByTier=[];
	G.getAchiev=function(name){if (!G.achievByName[name]) ERROR('No achievement exists with the name '+name+'.'); else return G.achievByName[name];}
	G.achievN=0;//incrementer
	G.legacyBonuses=[];
	G.Achiev=function(obj)
	{
		this.type='achiev';
		this.effects=[];//applied on new game start
		this.tier=0;//where the achievement is located vertically on the legacy screen
		this.won=0;//how many times we've achieved this achievement (may also be used to track other info about the achievement)
		this.visible=true;
		this.icon=[0,0];
		this.civ=0; //Achievements will be different for C2 and C1 but still C2 can boost C1 and vice versa ... yeah . 0 stands for people... 1 for ... ???
		this.special='none'; //parameters: 'none','seasonal','shadow'
		
		for (var i in obj) this[i]=obj[i];
		this.id=G.achiev.length;
		if (!this.displayName) this.displayName=cap(this.name);
		
		G.achiev.push(this);
		G.achievByName[this.name]=this;
		if (!G.achievByTier[this.tier]) G.achievByTier[this.tier]=[];
		G.achievByTier[this.tier].push(this);
		//G.setDict(this.name,this);
		this.mod=G.context;
		if (!this.mod.achievs) this.mod.achievs=[];
		this.mod.achievs.push(this);
	}
	
	G.applyAchievEffects=function(context)
	{
		//this is done on creating or loading a game
		for (var i in G.achiev)
		{
			var me=G.achiev[i];
			if (me.won)
			{
				for (var ii in me.effects)
				{
					var effect=me.effects[ii];
					var type=effect.type;
					if (G.legacyBonuses[type])
					{
						var bonus=G.legacyBonuses[type];
						if (bonus.func && (!bonus.context || bonus.context==context))
						{
							bonus.func(effect);
						}
					}
				}
			}
		}
	}
	G.getAchievEffectsString=function(effects)
	{
		//returns a string that describes the effects of a achievement
		var str='';
		for (var i in effects)
		{
			var effect=effects[i];
			var type=effect.type;
			if (G.legacyBonuses[type])
			{
				var bonus=G.legacyBonuses[type];
				str+='<div class="bulleted" style="text-align:left;"><b>'+bonus.name.replaceAll('\\[X\\]',B(effect.amount))+'</b><div style="font-size:90%;">'+bonus.desc+'</div></div>';
			}
		}
		return str;
	}
	
	
	G.tabPopup['legacy']=function()
	{
		var str='';
		str+='<div class="fancyText title"><font color="#d4af37" size="5">- - - Legacy - - -</font></div>';
		str+='<div class="scrollBox underTitle" style="width:248px;left:0px;">';
		str+='<div class="fancyText barred bitBiggerText" style="text-align:center;"><font size="3" style="letter-spacing: 2px;">Stats</font></div>';
		str+='<div class="par">Behold, the fruits of your legacy! Below are stats about your current and past games.</div>';
		str+='<div class="par">Legacy started : <b>'+G.selfUpdatingText(function(){return BT((Date.now()-G.fullDate)/1000);})+' ago</b></div>';
		str+='<div class="par">This game started : <b>'+G.selfUpdatingText(function(){return BT((Date.now()-G.startDate)/1000);})+' ago</b></div>';
		str+='<div class="par">'+G.doFunc('tracked stat str c1','Tracked stat')+' : <b>'+G.selfUpdatingText(function(){return B(G.trackedStat);})+'</b></div>';
		str+='<div class="par">Longest game : <b>'+G.selfUpdatingText(function(){return G.BT(G.furthestDay);})+'</b></div>';
		str+='<div class="par">Total legacy time : <b>'+G.selfUpdatingText(function(){return G.BT(G.totalDays);})+'</b></div>';
		str+='<div class="par">Ascensions : <b>'+G.selfUpdatingText(function(){return B(G.resets);})+'</b></div>';
		str+='<div class="par">Victory points: <b>'+G.selfUpdatingText(function(){return B(G.getRes('victory point').amount);})+'</b></div>';
		str+='<div class="par">Successful trial accomplishments: <b>'+G.selfUpdatingText(function(){return B(G.achievByName['Patience'].won+G.achievByName['Unhappy'].won+G.achievByName['Cultural'].won+G.achievByName['Hunted'].won+G.achievByName['Unfishy'].won+G.achievByName['Ocean'].won+G.achievByName['Herbalism'].won+G.achievByName['Buried'].won+G.achievByName['Underground'].won+G.achievByName['Pocket'].won+G.achievByName['Faithful'].won+G.achievByName['Dreamy'].won);})+'</b></div>';
		str+='<div class="par">'+G.doFunc('tracked stat str techs','Tracked stat')+': <b>'+G.selfUpdatingText(function(){return B(G.techN);})+'</b></div>';
		str+='<div class="par">'+G.doFunc('tracked stat str traits','Tracked stat')+': <b>'+G.selfUpdatingText(function(){return B(G.traitN);})+'</b></div>';
		str+='<div class="par">Dead forests found: <b>'+G.selfUpdatingText(function(){return B(G.achievByName['lands of despair'].won);})+'</b></div>';
		str+='</div>';
		str+='<div class="scrollBox underTitle" style="width:380px;right:0px;left:auto;background:rgba(0,0,0,0.25);">';
		
		if (G.sequence=='main')
		{
			str+='<center>'+G.button({text:'<',tooltip:'View the C1 achievements',onclick:function(){displayC1=true;displayC2=false;}})+''+G.button({text:'>',tooltip:'View the C2 achievements',onclick:function(){displayC1=false;displayC2=true;}})+'</center><div class="fancyText barred bitBiggerText" style="text-align:center;"><font size="3" style="letter-spacing: 2px;">Achievements</font></div>';
			for (var i in G.achievByTier)
			{
			
				str+='<div class="tier thingBox">';
				
				for (var ii in G.achievByTier[i])
				{
					var me=G.achievByTier[i][ii];
					if(me.visible==true){
					/*(G.achievByTier[i][ii].visible==true ? */str+='<div class="thingWrapper">'+
						(me.special=='shadow' ? '<div class="shadowachiev thing'+G.getIconClasses(me)+''+(me.won?'':' off')+'" id="achiev-'+me.id+'">' : '<div class="achiev thing'+G.getIconClasses(me)+''+(me.won?'':' off')+'" id="achiev-'+me.id+'">')+
						G.getIconStr(me,'achiev-icon-'+me.id)+
						'<div class="overlay" id="achiev-over-'+me.id+'"></div>'+
						'</div>'+
					'</div>'/* : ".")*/;
					}
				}
				
				
				str+='<div class="divider"></div>';
				str+='</div>';
			}
			
			
			G.arbitraryCallback(function(){
				for (var i in G.achievByTier)
				{
					for (var ii in G.achievByTier[i])
					{
						
						var me=G.achievByTier[i][ii];
						if(me.visible==true){
						var div=l('achiev-'+me.id);
						/*me.visible==true ? */
						div.onclick=function(me,div){return function(){
							if (G.getSetting('debug'))
							{
								if (me.won) me.won=0; else me.won=1;
								if (me.won) div.classList.remove('off');
								else div.classList.add('off');
							}
						}}(me,div)/* :"")*/;
						G.addTooltip(div,function(me){return function(){
							return '<div class="info">'+
							'<div class="infoIcon"><div class="thing standalone'+G.getIconClasses(me,true)+'">'+G.getIconStr(me,0,0,true)+'</div></div>'+
							'<div class="fancyText barred infoTitle">'+me.displayName+'</div>'+
							'<div class="fancyText barred">'+(me.won>0?('Achieved :<font color="yellow"> '+me.won+'</font> '+(me.won==1?'time':'times')):'Locked <font color="#aaffff">:(</font>')+'</div>'+
							'<div class="fancyText barred">Effects :'+G.getAchievEffectsString(me.effects)+'</div>'+
							(me.desc?('<div class="infoDesc">'+G.parse(me.desc)+'</div>'):'')+
							'</div>'+
							G.debugInfo(me)
						};}(me),{offY:8});
						}
					}
				}
			});
		}
		str+='</div>';
		str+='<div class="buttonBox">'+
		G.dialogue.getCloseButton()+
		'</div>';
		return str;
	}
		G.FileSave=function()
	{
		var filename='MagixLegacySave';//Vanilla saves are called legacySave. To recognize save with Magix I will change it
		var text=G.Export();
		var blob=new Blob([text],{type:'text/plain;charset=utf-8'});
		saveAs(blob,filename+'.txt');
	}
			/*=====================================================================================
	ACHIEVEMENTS
	=======================================================================================*/
	
	G.legacyBonuses.push(
		{id:'addFastTicksOnStart',name:'+[X] free fast ticks',desc:'Additional fast ticks when starting a new game.',icon:[0,0],func:function(obj){G.fastTicks+=obj.amount;},context:'new'},
		{id:'addFastTicksOnResearch',name:'+[X] fast ticks from research',desc:'Additional fast ticks when completing research.',icon:[0,0],func:function(obj){G.props['fastTicksOnResearch']+=obj.amount;}}
	);
	
	//do NOT remove or reorder achievements or saves WILL get corrupted
	//Tier 0 is for shadow achievements/seasonal achievements (they will dislay to player upon completion)
	new G.Achiev({
		tier:1,
		name:'mausoleum',
		desc:'You have been laid to rest in the Mausoleum, an ancient stone monument the purpose of which takes root in archaic religious thought.',
		fromUnit:'mausoleum',
		effects:[
			{type:'addFastTicksOnStart',amount:300*3},
			{type:'addFastTicksOnResearch',amount:150}
		],
		civ:0
	});
//Temple achiev
		new G.Achiev({
		tier:2,
		name:'Heavenly',
		wideIcon:[0,11,'magixmod'],
		icon:[1,11,'magixmod'],
		desc:'Your soul has been sent to Paradise as archangel with power of top Temple tower in an beautiful stone monument the purpose of which takes root in a pure religious thought.',
		fromWonder:'Heavenly',
		effects:[
			{type:'addFastTicksOnStart',amount:300},
			{type:'addFastTicksOnResearch',amount:25}	
		],
			civ:0
	});
//skull achiev
		new G.Achiev({
		tier:2,
		name:'Deadly, revenantic',
		wideIcon:[0,16,'magixmod'],
		icon:[1,16,'magixmod'],
		desc:'You escaped and your soul got escorted right into the world of Underwold... you may discover it sometime.',
		fromWonder:'Deadly, revenantic',
		effects:[
			{type:'addFastTicksOnStart',amount:300},
			{type:'addFastTicksOnResearch',amount:25}	
		],
			civ:0
	});

		new G.Achiev({
		tier:1,
		name:'Sacrificed for culture',
		wideIcon:[choose([9,12,15]),17,'magixmod',5,12,'magixmod'],
		icon:[6,12,'magixmod'],
		desc:'You sacrificed yourself in the name of [culture]. That choice made your previous people more inspirated and filled with strong artistic powers. It made big profits and they may get on much higher cultural level since now. They will miss you. <b>But now you will obtain +3 [culture] & [inspiration] at start of each next run!</b>',
		fromWonder:'Insight-ly',
		effects:[
			{type:'addFastTicksOnStart',amount:150},
			{type:'addFastTicksOnResearch',amount:75},
		],
			civ:0
	});
		new G.Achiev({
		tier:1,
		name:'Democration',
		wideIcon:[5,13,'magixmod'],
		icon:[6,13,'magixmod'],
		desc:'You rested in peace inside the Pagoda of Democracy\'s tombs. Your glory rest made your previous civilization living in laws of justice forever. They will miss you. <b>But this provides... +1 [influence] & [authority] at start of each next run!</b>',
		fromWonder:'Democration',
		effects:[
			{type:'addFastTicksOnStart',amount:150},
			{type:'addFastTicksOnResearch',amount:75},
		],
			civ:0
	});
		new G.Achiev({
		tier:1,
		name:'Insight-ly',
		wideIcon:[choose([0,3,6]),17,'magixmod'],
		icon:[choose([1,4,7]),17,'magixmod'],
		desc:'You sacrificed your soul for the Dreamers Orb. That choice was unexpectable but glorious. It made dreamers more acknowledged and people got much smarter by sacrifice of yours. They will miss you. <b>But this made a profit... +6 [insight] at start of each next run!</b>',
		fromWonder:'Insight-ly',
		effects:[
			{type:'addFastTicksOnStart',amount:150},
			{type:'addFastTicksOnResearch',amount:75},
		],
			civ:0
	});
		new G.Achiev({
		tier:2,
		name:'"In the underworld"',
		wideIcon:[7,5,'magixmod'],
		icon:[9,5,'magixmod'],
		desc:'You sent your soul to the Underworld, leaving your body that started to decay after it. But... <br><li>If you will obtain <font color="green">Sacrificed for culture</font>, <font color="aqua">Insight-ly</font> and <font color="fuschia">Democration</font> you will start each next game with [adult,The Underworld\'s Ascendant] . <li>To open the Underworld you will need to obtain <b>Deadly, revenantic</b> in addition.',
		fromWonder:'"In the underworld"',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:15},
		],
			civ:0
	});
		new G.Achiev({
		tier:3,
		wideIcon:[27,20,'magixmod'],
		icon:[28,20,'magixmod'],
		name:'<font color="DA4f37">Mausoleum eternal</font>',
		desc:'You have been laid to rest serveral times in the Mausoleum , an ancient stone monument the purpose of which takes root in archaic religious thought. Evolved to unforgetable historical monument. <b>Evolve [mausoleum] to stage 10/10 then ascend by it 11th time to obtain this massive fast tick bonus. <li><font color="aqua">In addition obtaining this achievement doubles chance to summon [belief in the afterlife] trait in each next run after obtaining this achievement.</font></li></b>',
		fromWonder:'<font color="DA4f37">Mausoleum eternal</font>',
		effects:[
			{type:'addFastTicksOnStart',amount:2000},
			{type:'addFastTicksOnResearch',amount:175}
		],
			civ:0
	});
		new G.Achiev({
		tier:2,
		icon:[25,19,'magixmod'],
		name:'Level up',
		desc:'Obtain [Eotm] trait during the run. This trait unlocks second tier of [insight] , [culture] , [faith] and [influence] which are required for further researches.',
			civ:0
	});
		new G.Achiev({
		tier:1,
		icon:[25,21,'magixmod'],
		name:'Metropoly',
		desc:'Manage to get 500k [population,people] in one run.',
		effects:[
			{type:'addFastTicksOnStart',amount:25},
			{type:'addFastTicksOnResearch',amount:5}
		],
			civ:0
	});
		new G.Achiev({
		tier:1,
		icon:[23,21,'magixmod'],
		name:'Apprentice',
		desc:'Get 100 or more technologies in a single run.',
			civ:0
	});
		new G.Achiev({
		tier:2,
		icon:[26,9,'magixmod'],
		name:'Lucky 9',
		desc:'Obtain the [dt9] .',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5}
		],
			civ:0
	});
		new G.Achiev({
		tier:2,
		icon:[26,21,'magixmod'],
		name:'Traitsman',
		desc:'Make your tribe attract 30 traits.',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
		],
			civ:0
	});
		new G.Achiev({
		tier:3,
		icon:[27,21,'magixmod'],
		name:'Extremely smart',
		desc:'Get [insight II] amount equal to [wisdom II] amount. It is not easy as you think it is. @In addition completing <font color="DA4f37">Mausoleum eternal</font> unlocks you [Theme changer] .',
		effects:[
			{type:'addFastTicksOnStart',amount:100},
			{type:'addFastTicksOnResearch',amount:10}
		],
			civ:0
	});
		new G.Achiev({
		tier:1,
		icon:[29,21,'magixmod'],
		name:'Experienced',
		desc:'To get this achievement you need to complete rest achievements in this tier. @<b>Achievement bonus: +100 [fruit]s at start of each next game</b>',
		effects:[
			{type:'addFastTicksOnStart',amount:100},
			{type:'addFastTicksOnResearch',amount:10}
		],
			civ:0
	});
		new G.Achiev({
		tier:2,
		icon:[29,22,'magixmod'],
		name:'Smart',
		desc:'To get this achievement you need to complete rest achievements in this tier. @<b>Achievement bonus: [Brick house with a silo] , [house] , [hovel] , [hut] , [bamboo hut] , [branch shelter] & [mud shelter] will use less [land] at each next run.</b>',
		effects:[
			{type:'addFastTicksOnStart',amount:150},
			{type:'addFastTicksOnResearch',amount:10}
		],
			civ:0
	});
		new G.Achiev({
		tier:3,
		icon:[12,22,'magixmod'],
		name:'Man of essences',
		desc:'Obtain [Magic adept] trait. Manage to get 2.1M [Magic essences]. //Obtaining it may unlock a new wonder.',
		effects:[
			{type:'addFastTicksOnStart',amount:40},
		],
			civ:0
	});
		new G.Achiev({
		tier:3,
		name:'Magical',
		wideIcon:[9,22,'magixmod'],
		icon:[10,22,'magixmod'],
		desc:'<b>You decided to sacrifice yourself for magic.</br>You decided that putting yourself at coffin that there was lying will attract some glory.</br>You were right</b> //This achievement will: @Unlock you a new theme @Increase effect of <b>Wizard towers</b> by 5% without increasing their upkeep cost. //This achievement will unlock you way further technologies such like [hunting III] or [fishing III] .',
		fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:150},
			{type:'addFastTicksOnResearch',amount:15},
		],
			civ:0
	});
			new G.Achiev({
		icon:[16,24,'magixmod'],
		tier:2,
		name:'Familiar',
		desc:'Get 200 or more technologies in a single run.',
				civ:0
	});
				new G.Achiev({
		icon:[23,24,'magixmod'],
		tier:1,
		name:'3rd party',
		desc:'Play magix and some other mod. //<b>Note: You will gain this achievement only if you use one of the NEL mods found/available on the Dashnet Discord server!</b> //If you want achievement to be obtainable with your mod too join the discord server and DM me. <i>mod author</i> //<font color="fuschia">This achievement will not be required while you will try to gain bonus from completing this achievement row</font>',
				civ:0
	});
		new G.Achiev({
		tier:4,
		name:'Patience',
		wideIcon:[3,26,'magixmod'],
		icon:[4,26,'magixmod'],
		desc:'Complete Chra-nos trial for the first time. Your determination led you to victory. //Complete this trial again to gain extra Victory Points.',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
			civ:0
	});
		new G.Achiev({
		tier:4,
		name:'Unhappy',
		wideIcon:[6,26,'magixmod'],
		icon:[7,26,'magixmod'],
		desc:'Complete Bersaria\'s trial for the first time. Your determination and calmness led you to victory. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
			civ:0
	});
		new G.Achiev({
		tier:4,
		name:'Cultural',
		wideIcon:[18,26,'magixmod'],
		icon:[19,26,'magixmod'],
		desc:'Complete Tu-ria\'s trial for the first time. Your artistic thinking led you to the victory. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
			civ:0
	});
		new G.Achiev({
		tier:4,
		name:'Hunted',
		wideIcon:[24,26,'magixmod'],
		icon:[25,26,'magixmod'],
		desc:'Complete Hartar\'s trial for the first time. Making people being masters at hunting and showing \'em what brave really is led you to the victory. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
			civ:0
	});
		new G.Achiev({
		tier:4,
		name:'Unfishy',
		wideIcon:[21,26,'magixmod'],
		icon:[22,26,'magixmod'],
		desc:'Complete Fishyar\'s trial for the first time. Making people believe that life without fish is not boring led you to the victory. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
			civ:0
	});
		new G.Achiev({
		tier:4,
		name:'Ocean',
		wideIcon:[1,25,'magixmod'],
		icon:[2,25,'magixmod'],
		desc:'Complete Posi\'zul\'s trial for the first time. Living at the endless ocean is not impossible and you are example of that. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
			civ:0
	});
		new G.Achiev({
		tier:4,
		name:'Herbalism',
		wideIcon:[12,26,'magixmod'],
		icon:[13,26,'magixmod'],
		desc:'Complete Herbalia\'s trial for the first time. Herbs are not that bad! //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
			civ:0
	});
		new G.Achiev({
		tier:4,
		name:'Buried',
		wideIcon:[0,26,'magixmod'],
		icon:[1,26,'magixmod'],
		desc:'Complete Buri\'o dak \'s trial for the first and the last time. Death lurks everywhere but it is still easy deal for you!',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
			civ:0
	});
		new G.Achiev({
		tier:4,
		name:'Underground',
		wideIcon:[15,26,'magixmod'],
		icon:[16,26,'magixmod'],
		desc:'Complete Moai\'s trial for the first time. Stone leads to victory! //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
			civ:0
	});
		new G.Achiev({
		tier:4,
		name:'Pocket',
		wideIcon:[9,26,'magixmod'],
		icon:[10,26,'magixmod'],
		desc:'Complete Mamuun\'s trial for the first time. Seems like you have got a trading skills! This can lead to victory. //Complete this trial again to gain extra Victory Points. 2nd victory of this trial increases bonus from the trial',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
			civ:0
	});
		new G.Achiev({
		tier:4,
		name:'Faithful',
		wideIcon:[0,27,'magixmod'],
		icon:[1,27,'magixmod'],
		desc:'Complete Enlightened\'s trial for the first time. Belief and faith is everything. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
			civ:0
	});
		new G.Achiev({
		tier:4,
		name:'Dreamy',
		wideIcon:[27,26,'magixmod'],
		icon:[28,26,'magixmod'],
		desc:'Complete Okar the Seer\'s trial for the first time. Knowledge leads to victory. //Complete this trial again to gain extra Victory Points',
		//fromWonder:'Magical',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
			{type:'addFastTicksOnResearch',amount:5},
		],
			civ:0
	});
	new G.Achiev({
		tier:3,
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
		civ:0
	});
	new G.Achiev({
		tier:3,
		name:'The first choice',
		icon:[11,25,'magixmod'],
		desc:'Spend your all [Worship point]s for the first time to pick Seraphins that your people will worship.',
		effects:[
			{type:'addFastTicksOnStart',amount:100},
		],
		civ:0
	});
		new G.Achiev({
		tier:3,
		name:'Trait-or',
		icon:[12,25,'magixmod'],
		desc:'Manage your wonderful tribe to adopt 50 traits.',
		effects:[
			{type:'addFastTicksOnStart',amount:50},
		],
			civ:0
	});
	new G.Achiev({
		tier:3,
		name:'Not so pious people',
		icon:[32,26,'magixmod'],
		desc:'Get: @2 traits that will lower your [faith] income @Choose Seraphin that decreases [faith] income as well. To make this achievement possible [dt13] is not required.',
		effects:[
			{type:'addFastTicksOnStart',amount:90},
		],
		civ:0
	});
	new G.Achiev({
		tier:3,
		name:'Talented?',
		icon:[32,25,'magixmod'],
		desc:'To get this achievement you need to complete rest achievements in this tier. @<b>Achievement bonus:All crafting units that use land of primary world will use 0.15 less land per 1 piece so if unit uses 3 land it will use 2.55 upon obtain. In addition this bonus applies to [well]s, [Wheat farm]s , [Water filter]s (0.1 less for Caretaking filter and 0.2 less for Moderation one) and [crematorium]s.<>Note: Bonus does not apply to paper crafting shacks</b> @In addition completing full row will now make you be able to pick <b>1 of 5</b> techs in research box instead of <b>1 of 4</b>. And... it unlocks new theme!',
		effects:[
			{type:'addFastTicksOnStart',amount:200},
			{type:'addFastTicksOnResearch',amount:10},
		],
		civ:0
	});
	new G.Achiev({
		tier:4,
		name:'lands of despair',
		wideIcon:[0,29,'magixmod'],
		icon:[1,29,'magixmod'],
		desc:'Find <b>Dead forest</b> biome on your world map. This is rarest biome in the whole mod. This biome is most hostile biome that can exist on this world.',
		effects:[
			{type:'addFastTicksOnStart',amount:200},
			{type:'addFastTicksOnResearch',amount:10},
		],
		civ:0
	});
	new G.Achiev({
		tier:4,
		icon:[35,27,'magixmod'],
		name:'a huge city made of the cities',
		desc:'Manage to get 1M [population,people] in one run. //Unbelieveable...',
		effects:[
			{type:'addFastTicksOnStart',amount:25},
			{type:'addFastTicksOnResearch',amount:5}
		],
			civ:0
	});
	new G.Achiev({
		tier:5,
		icon:[34,17,'magixmod'],
		name:'6 aces',
		desc:'Be lucky enough to get: @All 6 [gt7,<font color="#d4af37">God\'s traits</font>] that will boost your Essence production in the same run. @All 6 [dt19,<font color="red">Devil\'s traits</font>] that will power down your Essence production in the same run. //Note: To complete achievement you need to have only one of these two cases.',
		effects:[
			{type:'addFastTicksOnStart',amount:600},
		],
			civ:0
	});
	new G.Achiev({
		icon:[1,0,'magixmod'],
		name:'xmas buff',
		visible:false //debug
	});
			new G.Achiev({
		tier:0,
		name:'god complex',
		icon:[35,5,'magixmod'],
		desc:'Declare yourself as one of the Gods... and get punished for that. @<font color="red">Note: usurpers get punished unless they will change their name</font>',
		effects:[
			{type:'addFastTicksOnStart',amount:30},
		],
		visible:false,
		civ:0,
		special:'shadow'
	});
	new G.Achiev({
		tier:0,
		name:'it\'s over 9000',
		icon:[35,10,'magixmod'],
		desc:'What?! 9000?! There is no way that can be right.',
		effects:[
			{type:'addFastTicksOnStart',amount:150},
		],
		//visible:false,
		civ:0,
		special:'shadow'
	});
	new G.Achiev({
		tier:0,
		name:'just plain lucky',
		icon:[34,10,'magixmod'],
		desc:'Every ingame day you have <b>1</b> of <b>777 777</b> chance to get this achievement.',
		effects:[
			{type:'addFastTicksOnStart',amount:150},
		],
		//visible:false,
		civ:0,
		special:'shadow'
	});
	new G.Achiev({
		tier:0,
		name:'cruel goal',
		icon:[34,8,'magixmod'],
		desc:'Don\'t ya think that was very, very cruel. Murdering the root full of hope for future? @Get your [mausoleum] to at least level 4/10 and sacrifice fully your civilization just to finish the final step. ',
		effects:[
		],
		//visible:false,
		civ:0,
		special:'shadow'
	});
	new G.Achiev({
		tier:0,
		name:'that was so brutal',
		icon:[35,8,'magixmod'],
		desc:'Oh my god! Murdering the root full of hope for future AGAIN? And more cruelty than before?! // Sacrifice all of your people to one of following wonders: @[pagoda of passing time] @[Pagoda of culture] @[Hartar\'s statue] @[Pagoda of Democracy] @[Fortress of cultural legacy] @[Complex of Dreamers] @[Fortress of magicians] @[Platinum fish statue] @[Tomb of oceans] @[The Herboleum] @[Temple of the Stone] @[Mausoleum of the Dreamer] //Must obtain <b>Cruel goal</b> shadow achievement before that.',
		effects:[
		],
		//visible:false,
		civ:0,
		special:'shadow'
	});
	new G.Achiev({
		tier:0,
		name:'speedresearcher',
		icon:[35,7,'magixmod'],
		desc:'Get at least 60 techs within first 10 minutes of the current run. //Refreshing page makes your chance lost, so you\'ll need to set a new game',
		effects:[
		],
		//visible:false,
		civ:0,
		special:'shadow'
	});
	new G.Achiev({
		tier:0,
		name:'speedresearcher II',
		icon:[35,6,'magixmod'],
		desc:'Get at least 100 techs within first 10 minutes of the current run. //Refreshing page makes your chance lost, so you\'ll need to set a new game',
		effects:[
		],
		//visible:false,
		civ:0,
		special:'shadow'
	});
	new G.Achiev({
		tier:0,
		name:'i do not want to take things easy',
		icon:[35,4,'magixmod'],
		desc:'Get [Magical soil] with these rules: //<font color="red">Without following researches:</font>@[symbolism II]@[Water filtering,Upgrades that boosts any water filters] @[Improved furnace construction,Upgrades that boost unit depending on which path people have chosen] @[Deeper wells],[focused scouting],[guilds unite] @[Berry masterry] @[Mo\' floorz,Blockhouse boosters] @[Stronger faith,Stronger faith and better infl & auth] @[insect-eating] @[Essential conversion tank overclock I,Conversion tank o-clocks] @[bigger kilns] @[Glory,Glory & Spiritual piety] @[Better papercrafting recipe] //Any others are allowed. If one of restricted will be obtained you\'ll need to go all over again.',
		effects:[
			{type:'addFastTicksOnStart',amount:225},
			{type:'addFastTicksOnResearch',amount:30},
		],
		//visible:false,
		civ:0,
		special:'shadow'
	});
	/*=====================================================================================
	RESOURCES
	=======================================================================================*/
	G.resCategories={
			'main':{
				name:'<font color="#E66900">Essentials</font>',
				base:[],
				side:['population','worker','happiness','health','victory point'],
		},
			'terr':{
				name:'Territory',
				base:['land'],
				side:['tl'],
		},
			'demog':{
				name:'<font color="#0DA42B">Demographics</font>',
				base:['baby','child','adult','elder','worker','sick','wounded'],
				side:['population','housing','corpse','burial spot','Alchemists'],
		},
			'food':{
				name:'<font color="#0080FF">Food & Water</font>',
				base:[],
				side:['food','spoiled food','water','muddy water','food storage','Juices','Spoiled juices'],
		},
			'build':{
				name:'<font color="#FFCCCC">Crafting & Construction</font>',
				base:[],
				side:['archaic building materials','basic building materials','advanced building materials','precious building materials','material storage'],
		},
			'ore':{
				name:'<font color="#1111F0">Ores</font>',
				base:[],
				side:[],
		},
			'gear':{
				name:'<font color="#ddffdd">Gear</font>',
				base:[],
				side:[],
		},
			'misc':{
				name:'<font color="#ffdddd">Miscellaneous</font>',
				base:[],
				side:['Paper','Magic essences','book storage'],
		},
			'flowersanddyes':{
				name:'<font color="#ddddff">Flowers & Dyes</font>',
				base:[],
				side:['Flowers','Dyes'],
		},
			'alchemypotions':{
				name:'<font color="#B266ff">Alchemy - Potions</font>', 
				base:[],
				side:['Basic brews','Alcohol brews','Medicament brews','combat potions'],
		},
			'alchemyingredients':{
				name:'<font color="#B266ff">Alchemy - Ingredients</font>', 
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
					var weights={'baby':0.1,'child of Christmas':0.3,'child':0.3,'adult':0.5,'elder':0.5,'sick':0.4,'wounded':0.4,'Child alchemist':0.3,'Alchemist':0.5,'Instructor':0.5,'drunk':0.4};
					for (var i in weights)
					{toConsume+=G.getRes(i).amount*weights[i];}
					var rations=G.checkPolicy('water rations');
					if (rations=='none') {toConsume=0;G.gain('happiness',-me.amount*3,'water rations');G.gain('health',-me.amount*2,'water rations');}
					else if (rations=='meager') {toConsume*=0.5;G.gain('happiness',-me.amount*1,'water rations');G.gain('health',-me.amount*0.5,'water rations')}
					else if (rations=='plentiful') 
					{toConsume*=1.5;G.gain('happiness',me.amount*0.85,'water rations');}
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
							var weights={'baby':0.1,'child of Christmas':0.2,'child':0.2,'adult':0.5,'elder':1,'sick':0.3,'wounded':0.3,'Child alchemist':0.3,'Alchemist':0.5,'Instructor':0.5,'drunk':0.4};//the elderly are the first to starve off
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
					var weights={'baby':0.2,'child of Christmas':0.5,'child':0.5,'adult':1,'elder':1,'sick':0.75,'wounded':0.75,'Child alchemist':0.3,'Alchemist':0.5,'Instructor':0.5,'drunk':0.4};
					for (var i in weights)
					{toConsume+=G.getRes(i).amount*weights[i];}
					var rations=G.checkPolicy('food rations');
					if (rations=='none') {toConsume=0;G.gain('happiness',-me.amount*3,'food rations');G.gain('health',-me.amount*2,'food rations');}
					else if (rations=='meager') {toConsume*=0.5;G.gain('happiness',-me.amount*1,'food rations');G.gain('health',-me.amount*0.5,'food rations');}
					else if (rations=='plentiful')
					{toConsume*=1.5;G.gain('happiness',me.amount*0.85,'food rations');}
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
							var weights={'baby':0.1,'child of Christmas':0.2,'child':0.2,'adult':0.5,'elder':1,'sick':0.3,'wounded':0.3,'Child alchemist':0.3,'Alchemist':0.5,'Instructor':0.5,'drunk':0.4};//the elderly are the first to starve off
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
						var weights={'baby':2,'child of Christmas':1.5,'child':1.5,'adult':1,'elder':2};
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
						var weights={'baby':2,'child of Christmas':1.5,'child':1.5,'adult':1,'elder':2,'Child alchemist':0.3,'Alchemist':0.5,'Instructor':0.5};
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
			if (me.amount >= 500000 && G.achievByName['Metropoly'].won == 0){ 
			G.achievByName['Metropoly'].won = 1
			G.middleText('- Completed <font color="green">Metropoly</font> achievement -')
			}
			if (me.amount >= 1000000 && G.achievByName['a huge city made of the cities'].won == 0){ 
			G.achievByName['a huge city made of the cities'].won = 1
			G.middleText('- Completed <font color="olive">A huge city made of the cities</font> achievement -')
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
						if(G.checkPolicy('se08')=='off'){//BURI'O DAK
						var amount=Math.min(graves.amount-graves.used,Math.max(1,randomFloor(me.amount*0.1)));
						graves.used+=amount;G.lose('corpse',amount,'burial');
						G.gain('happiness',amount*2,'burial');
						}else{
						var amount=Math.min(graves.amount-graves.used,Math.max(1,randomFloor(me.amount*0.1)));
						graves.used+=amount;G.lose('corpse',amount*1.1,'burial');
						G.gain('happiness',amount*2,'burial');
						}
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
			if(G.has('<span style="color: red">Revenants</span>') && G.getRes('Dark essence').amount>1000){
				G.lose('corpse',G.getRes('corpse').amount*0.001,'revenge of corpses');
				G.lose('Dark essence',0.15,'revenge of corpses');
				G.gain('wild corpse',G.getRes('corpse').amount*0.001,'revenge of corpses');
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
			if(G.hasNot('beyond the edge')){
			me.amount=Math.ceil(G.currentMap.territoryByOwner[1]*100);
			}else if(G.has('mirror world 2/2') && G.has('beyond the edge II') && G.has('beyond the edge')){
			me.amount=Math.ceil(G.currentMap.territoryByOwner[1]*100)*1.07*2;
			}else if(G.has('beyond the edge II') && G.has('beyond the edge')){
			me.amount=Math.ceil(G.currentMap.territoryByOwner[1]*100)*1.07;
			}else if(G.has('beyond the edge')){
			me.amount=Math.ceil(G.currentMap.territoryByOwner[1]*100)*1.015;
			}
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
			if(G.has('t2')){
				G.getRes('happiness').amount=-1e15//Unhappy trial
			}
			var amount=(this.displayedAmount/G.getRes('population').displayedAmount);
			if(G.has('t4')){
				if(amount>=98){
					G.lose(me,G.getRes(me).amount*0.8)
			}
			}
		},
		getDisplayAmount:function()
		{
			if (G.getRes('population').amount<=0) return '-';
			var amount=(this.displayedAmount/G.getRes('population').displayedAmount);
			if(G.checkPolicy('se07')=='on'){//Herbalia's backfire
			if (amount>175) amount=175;
			if (amount<-200) amount=-200;
			}else if(G.has('t2')){
			if (amount>200) amount=200;
			if (amount<-200) amount=-200-(G.techN/2)-G.getRes('unhappy').amount;
			}else if(G.has('t4')){
			if (amount>98) amount=98;
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
			if(G.has('t4') && G.year>=3){
			G.lose('health'	,1+(G.year*((G.achievByName['Hunted'].won+1)/3)))
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
				//CHRA-NOS
				if (G.checkPolicy('Gather roses')=='on')
				{
					if(G.achievByName['Patience'].won==0){
						var toSpoil=me.amount*0.02*((G.getRes('Watermelon seeds').amount/10)*2);
						var spent=G.lose('water',randomFloor(toSpoil),'decay');
						G.gain('muddy water',randomFloor(spent),'decay');
						}else{
						var toSpoil=me.amount*0.02;
						var spent=G.lose('water',randomFloor(toSpoil),'decay');
						G.gain('muddy water',randomFloor(spent),'decay');
						}
					}else if(G.achievByName['Patience'].won>=1){
						var toSpoil=me.amount*0.02*((G.getRes('Watermelon seeds').amount/10-0,025)*2);
						var spent=G.lose('water',randomFloor(toSpoil),'decay');
						G.gain('muddy water',randomFloor(spent),'decay');
						}else{
						var toSpoil=me.amount*0.02;
						var spent=G.lose('water',randomFloor(toSpoil),'decay');
						G.gain('muddy water',randomFloor(spent),'decay');
						}
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
				if(G.checkPolicy('se10')=='off'){
				var toSpoil=me.amount*0.01*notStored+me.amount*0.0005*stored;
				var spent=G.lose('food',randomFloor(toSpoil),'decay');
				//G.gain('spoiled food',randomFloor(spent));
				}else{
				var toSpoil=(me.amount*0.01*notStored+me.amount*0.0005*stored)*1.15;
				var spent=G.lose('food',randomFloor(toSpoil),'decay');
				}
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
		startWith:300,
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
				if(G.getRes('happiness').amount>0){
				var toSpoil=G.getRes('happiness').amount*0.01;
				var spent=G.lose('happiness',randomFloor(toSpoil),'working after hours');
				}else{
				var toSpoil=-G.getRes('happiness').amount*0.01;
				var spent=G.lose('happiness',randomFloor(toSpoil),'working after hours');
				}
			}
			if (G.checkPolicy('Hovel of colours production rates')=='2')
			{
				if(G.getRes('happiness').amount>0){
				var toSpoil=G.getRes('happiness').amount*0.01;
				var spent=G.lose('happiness',randomFloor(toSpoil),'working after hours');
				}else{
				var toSpoil=-G.getRes('happiness').amount*0.01;
				var spent=G.lose('happiness',randomFloor(toSpoil),'working after hours');
				}
			}
			if (G.checkPolicy('Hut of potters production rates')=='2')
			{
				if(G.getRes('happiness').amount>0){
				var toSpoil=G.getRes('happiness').amount*0.01;
				var spent=G.lose('happiness',randomFloor(toSpoil),'working after hours');
				}else{
				var toSpoil=-G.getRes('happiness').amount*0.01;
				var spent=G.lose('happiness',randomFloor(toSpoil),'working after hours');
				}
			}
			if (G.checkPolicy('Leather factory production rates')=='2')
			{
				if(G.getRes('happiness').amount>0){
				var toSpoil=G.getRes('happiness').amount*0.01;
				var spent=G.lose('happiness',randomFloor(toSpoil),'working after hours');
				}else{
				var toSpoil=-G.getRes('happiness').amount*0.01;
				var spent=G.lose('happiness',randomFloor(toSpoil),'working after hours');
				}
			}
			if (G.checkPolicy('Toggle SFX')=='off') //Toggle SFX
			{
				G.getDict('Toggle SFX').icon = [29,1,'magixmod'];
			}
			if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
			{
				G.getDict('Toggle SFX').icon = [29,0,'magixmod'];
			}
			///////////HERBALIA BACKFIRE
			if (G.checkPolicy('se07')=='on')
			{
				if(G.getRes('happiness').amount>0){
				var toSpoil=G.getRes('happiness').amount*0.00155;
				var spent=G.lose('happiness',randomFloor(toSpoil),'Herbalia');
				}else{
				var toSpoil=-G.getRes('happiness').amount*0.00155;
				var spent=G.lose('happiness',randomFloor(toSpoil),'Herbalia');
				}
			}
			///////////BERSARIA BACKFIRE
			if (G.checkPolicy('se02')=='on')
			{
				if(G.getRes('happiness').amount>0){
				var toSpoil=G.getRes('happiness').amount*0.00095;
				var spent=G.lose('happiness',randomFloor(toSpoil),'Bersaria');
				}else{
				var toSpoil=-G.getRes('happiness').amount*0.00095;
				var spent=G.lose('happiness',randomFloor(toSpoil),'Bersaria');
				}
				
			}	
			//BURIODAK HEALTH HARM
			if(G.checkPolicy('se08')=='on'){
			if(G.getRes('health').amount>0){
				var toSpoil=G.getRes('health').amount*0.000095;
				var spent=G.lose('health',randomFloor(toSpoil),'Buri\'o Dak');
				}else{
				var toSpoil=-G.getRes('health').amount*0.000095;
				var spent=G.lose('health',randomFloor(toSpoil),'Buri\'o Dak');
				}
			}
			if(G.has('handwashC')){
				if(G.getRes('health').amount<0){G.gain('health',-G.getRes('health').amount*0.0004,'handwashing')}else{G.gain('health',G.getRes('health').amount*0.0004,'handwashing')};
			}else if(G.has('handwashM')){
				if(G.getRes('health').amount<0){G.gain('health',-G.getRes('health').amount*0.0001,'handwashing')}else{G.gain('health',G.getRes('health').amount*0.0001,'handwashing')};
			}

		},
		category:'food',
	});
	new G.Res({
		name:'fruit',
		desc:'[fruit,Fruits], whether gathered from berry bushes or fruit trees, are both sweet-tasting and good for you.',
		icon:[4,7],
		turnToByContext:{'eating':{'health':0.02,'happiness':0.011},'decay':{'spoiled food':1}},
		partOf:'food',
		category:'food',
	});
	let modes4=false
	new G.Res({
		name:'meat',
		desc:'[meat,Raw meat] is gathered from dead animals and, while fairly tasty, can harbor a variety of diseases.',
		icon:[5,7],
		turnToByContext:{'eating':{'health':-0.03,'happiness':0.012,'bone':0.1},'decay':{'spoiled food':1}},
		partOf:'food',
		tick:function(me,tick)   
		{
			///On purpose crash. Occurs while playing market without magix utils
			if(G.modsByName['Market mod'] && !G.modsByName['Magix utils for market']){
				console.log('Install Magix utilities for market mod! Caused on-purpose game crash.');
				console.log('Url to paste:https://cdn.jsdelivr.net/gh/MagixModLegacy/Magix@master/MagixUtilsForMarketA0.js');
				console.log('Refresh the page.');
				G.middleText('Install Magix utilities for market mod!<hr><br><small>Caused on-purpose game crash</small>',slow)
				
			}
		},
		category:'food',
	});
	new G.Res({
		name:'cooked meat',
		desc:'Eating [cooked meat] is deeply satisfying and may even produce a [bone].',
		icon:[6,7],
		turnToByContext:{'eating':{'health':0.02,'happiness':0.03,'bone':0.1},'decay':{'cooked meat':0.2,'spoiled food':0.8}},
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'cured meat',
		desc:'[cured meat] is interestingly tough and can keep for months without spoiling.',
		icon:[11,6],
		turnToByContext:{'eating':{'health':0.02,'happiness':0.025,'bone':0.1},'decay':{'cured meat':0.95,'spoiled food':0.05}},
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'seafood',
		desc:'[seafood,Raw seafood] such as fish, clams, or shrimps, is both bland-tasting and several kinds of nasty.',
		icon:[5,6],
		turnToByContext:{'eating':{'health':-0.02,'happiness':0.0065,'bone':0.02},'decay':{'spoiled food':1}},
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
		tick:function(me,tick)
		{
			var toLose=me.amount*0.0025;
			var spent=G.lose(me.name,randomFloor(toLose),'decay');
		}
		
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
		category:'ore',
	});
	new G.Res({
		name:'iron ore',
		desc:'Ore that can be processed into [hard metal ingot]s.',
		icon:[10,8],
		partOf:'misc materials',
		category:'ore',
	});
	new G.Res({
		name:'gold ore',
		desc:'Ore that can be processed into [precious metal ingot]s.',
		icon:[11,8],
		partOf:'misc materials',
		category:'ore',
	});
	new G.Res({
		name:'tin ore',
		desc:'Ore that can be processed into [soft metal ingot]s.',
		icon:[13,8],
		partOf:'misc materials',
		category:'ore',
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
		icon:[choose([3,4,5,6]),27,'magixmod'],
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
		category:'ore',
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
		tick:function(me,tick)
		{
			var toLose=me.amount*0.03;
			var spent=G.lose(me.name,randomFloor(toLose),'decay');
		}
	});
		new G.Res({
		name:'sugar',
		desc:'If you want to start crafting tasty juices, [sugar] is a must.',
		icon:[15,2,'magixmod'],
		partOf:'misc materials',
		category:'misc',
	});
		new G.Res({//REMOVED AND REPLACED WITH CHRA-NOS BUFF EFFECT
		name:'Watermelon seeds',
		desc:'A res that defines Chra-nos bonus',
		hidden:true,
		startWith:1
	});
		new G.Res({//REMOVED AND USED AS CHRANOS WEAKNESS(DOWNGRADES YOU EACH YEAR WHILE IN PATIENCE TRIAL-well it is one of its rules tho)
		name:'Berry seeds',
		desc:'Chranos\'s weakness',
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
                G.Message({type:'emblemobtain',text:'<b>You and your people activated passage to Plain Island. Out of portal an Emblem falls and hits on rock. Big rectangular portal shines and you can see what is beyond it. You come through and notice there are flat plains. Now it is time for more discoveries and build there some stuff.</b>',icon:[8,3,'magixmod']});
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
						if(G.checkPolicy('se08')=='off'){
						var amount=Math.min(graves.amount-graves.used,Math.max(1,randomFloor(me.amount*0.1)));
						graves.used+=amount;G.lose('Urn',amount*4,'burial');
						G.gain('happiness',amount*2,'burial');
						}else{
						var amount=Math.min(graves.amount-graves.used,Math.max(1,randomFloor(me.amount*0.1)));
						graves.used+=amount;G.lose('Urn',amount*5,'burial');
						G.gain('happiness',amount*2,'burial');
						};
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
		category:'ore',
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
		category:'ore',
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
				G.Message({type:'emblemobtain',text:'<b>You and your people activated passage to Paradise. Out of portal an Emblem fall and hits next to your feet. Big golden portal shines and you can see what is beyond it. You come through and notice there is perfect heat to live. Now it is time for more discoveries.</b>',icon:[8,4,'magixmod']});
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
					G.getDict('lush rocky substrate').res['mine']['nickel ore']=0.025;
					G.getDict('tundra rocky substrate').res['mine']['nickel ore']=0.032;
					G.getDict('warm rocky substrate').res['mine']['nickel ore']=0.029;
					G.getDict('ice desert rocky substrate').res['mine']['nickel ore']=0.035;
					G.getDict('jungle rocky substrate').res['mine']['nickel ore']=0.01;
					G.getDict('badlands substrate').res['mine']['nickel ore']=0.011;
				}
				if (G.has('quarrying II')){
					G.getDict('rocky substrate').res['quarry']['platinum ore']=0.00001;
					G.getDict('ice desert rocky substrate').res['quarry']['platinum ore']=0.00001;
					G.getDict('warm rocky substrate').res['quarry']['platinum ore']=0.00001;
					G.getDict('lush rocky substrate').res['quarry']['platinum ore']=0.000012;
					G.getDict('tundra rocky substrate').res['quarry']['platinum ore']=0.0000125;
					G.getDict('jungle rocky substrate').res['quarry']['platinum ore']=0.000007;
					G.getDict('dead rocky substrate').res['quarry']['platinum ore']=0.00002;
					G.getDict('badlands substrate').res['quarry']['platinum ore']=0.000013;
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
			if (G.checkPolicy('Theme changer')=='bronze'){
		var cssId = 'bronzethemeCss';  
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/BronzeTheme/bronzetheme.css';
    link.media = 'all';
    head.appendChild(link);
}
		}
			if (G.checkPolicy('Theme changer')=='silver'){
		var cssId = 'silverthemeCss';  
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/SilverTheme/silvertheme.css';
    link.media = 'all';
    head.appendChild(link);
}
		}
			if (G.checkPolicy('Theme changer')=='golden'){
		var cssId = 'goldenthemeCss';  
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GoldenTheme/goldentheme.css';
    link.media = 'all';
    head.appendChild(link);
}
		}
			if (G.checkPolicy('Theme changer')=='black'){
		var cssId = 'goldenthemeCss';  
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/BlackTheme/blacktheme.css';
    link.media = 'all';
    head.appendChild(link);
}
		}
				if (G.checkPolicy('Theme changer')=='wooden'){
		var cssId = 'woodenthemeCss';  
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://pipe.miroware.io/5db9be8a56a97834b159fd5b/woodentheme.css';
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
		
		new G.Res({
		name:'fire essence limit',
		desc:'The bigger limit the more essence.',
		icon:[0,2,'magixmod'],
		hidden:true,
	});
		new G.Res({
		name:'water essence limit',
		desc:'The bigger limit the more essence.',
		icon:[0,1,'magixmod'],
		hidden:true,
	});
		new G.Res({
		name:'lightning essence limit',
		desc:'The bigger limit the more essence.',
		icon:[0,3,'magixmod'],
		hidden:true,
	});
		new G.Res({
		name:'wind essence limit',
		desc:'The bigger limit the more essence.',
		icon:[1,1,'magixmod'],
		hidden:true,
	});
		new G.Res({
		name:'nature essence limit',
		desc:'The bigger limit the more essence.',
		icon:[1,2,'magixmod'],
		hidden:true,
	});
		new G.Res({
		name:'dark essence limit',
		desc:'The bigger limit the more essence.',
		icon:[1,3,'magixmod'],
		hidden:true,
	});
		new G.Res({
		name:'mana capacity',
		desc:'The bigger limit the more mana can be stored.',
		icon:[2,3,'magixmod'],
		hidden:true,
	});
		new G.Res({
		name:'holy essence limit',
		desc:'The bigger limit the more essence can be stored.',
		icon:[20,6,'magixmod'],
		hidden:true,
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
				if (G.checkPolicy('se07')=='on') //HERBALIA BOOST
				{
					var n=randomFloor(G.getRes('population').amount*0.05);G.gain('health',n,'Herbalia');
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
		new G.Res({
		name:'Meals',
		desc:'[Meals] are tastier than common food that is part of a [Meals,meal] . Makes people happier than other [food] .',
		icon:[22,13,'magixmod'],
		turnToByContext:{'eating':{'health':0.024,'happiness':0.045,'bone':0.1},'decay':{'spoiled food':0.8}},
		category:'food',
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
			const corpses = G.getDict('wild corpse')
  const chances = [
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
		   
      case "hurt":
        G.lose("adult", corpses.amount*0.0011, "wild corpse encounter")
        G.gain("wounded", corpses.amount*0.0011, "wild corpse encounter")
        break
  }
		},
		category:'demog',
	});
		
		new G.Res({
		name:'wounded alchemist',
		desc:'[Alchemists] may get [wounded,wounded] due to work injuries. They do not [worker,work] but may slowly get better over time.',
		partOf:'population', //There we may add a message for thieves!
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
		if (G.year>109 && G.hasNot('t1') && G.hasNot('t2')){ //Spawning rate
 		   var n = G.getRes('adult').amount * 0.00001
		   if(G.checkPolicy('se02')=='on'){
  		  G.gain('thief',n*1.01,'unhappiness');
		   }else{
			     G.gain('thief',n,'unhappiness');
		   }
			}
			var toCalm=me.amount*0.007;
			var spent=G.lose(me.name,randomFloor(toCalm),'calmdown');G.gain('adult',(toCalm),'calmdown');
			var toNeut=me.amount*0.001;
			var spent=G.lose(me.name,randomFloor(toNeut),'neutralized by civillian');//Civillian banishes a person from your civilization then
		}
	});
	//To make recovery not like wounded child alch becomes adult alch
		
		new G.Res({
		name:'wounded child alchemist',
		desc:'[Alchemists] may get [wounded,wounded] due to work injuries. They do not [worker,work] but may slowly get better over time.',
		partOf:'population',
		icon:[21,2,'magixmod'],
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
				if(G.hasNot('tool rafinery 2/2')){var toSpoil=(G.getRes('stone tools').amount*0.0004);G.lose(('stone tools'),randomFloor(toSpoil),'decay');
				}else{
					var toSpoil=(G.getRes('stone tools').amount*0.0002);G.lose(('stone tools'),randomFloor(toSpoil),'decay');
				};
				var toSpoil=(G.getRes('knapped tools').amount*0.00055);G.lose(('knapped tools'),randomFloor(toSpoil),'decay');
								if(G.hasNot('tool rafinery 2/2')){var toSpoil=(G.getRes('stone weapons').amount*0.0004);G.lose(('stone weapons'),randomFloor(toSpoil),'decay');
				}else{
					var toSpoil=(G.getRes('stone weapons').amount*0.0002);G.lose(('stone weapons'),randomFloor(toSpoil),'decay');
				};
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
        G.lose("adult", thieves.amount*0.25, "thieves hurting people")
        G.gain("wounded", thieves.amount*0.25, "thieves hurting people")
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
	let langstory=false
	let oraltradstory=false
	let toolstory=false
	let canoestory=false
	let sedestory=false
	let boatstory=false
	let ritstory=false
	let burystory=false
	let firestory=false
	let sewstory=false
	let weastory=false
	let skinnsto=false
	let gem=false
	let writer=false
	let tech50=false
	let tech100=false
	let trait20=false
	let pol15=false
	let guru=false
	let explorepop=false
	let rofpopup=false
	let bapopup=false
	let monument=false
	let pot=false
	let cure=false
	let wiztip=false
	let esstip=false
	let weltip=false
	let trendtip=false
	let doctip=false
	let mobeauty=false
		new G.Res({
		name:'Dandelion',
		desc:'Easiest source of yellow dye.',
		icon:[7,8,'magixmod'],
		partOf:'Flowers',
		tick:function(me,tick)
		{
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			
			if(G.policy.length >= 15 && !pol15 && G.policy.length <= 18){G.Message({type:'important',text:'Your rules and fact that you are leading this tribe have become accepted. People are bound to you.',icon:[11,4]});pol15=true;
			}
			if(G.has('language') && !langstory && G.hasNot('oral tradition')){
				G.Message({
				type:'important',text:'Now while talking to your people they understand you better. And they understand themselves each other',
				icon:[1,28,'magixmod']})
				langstory=true
			}
			if(G.has('oral tradition') && !oraltradstory && G.hasNot('ritualism')){
				G.Message({type:'important',text:'The first spark of culture arises.',icon:[10,4]})
				oraltradstory=true
			}
			if(G.has('tool-making') && !toolstory && G.hasNot('spears')){
			G.Message({type:'important',text:'Finally people can use and craft something better than knapped tools, rocks etc.',icon:[1,9]})
			toolstory=true
			}
			if(G.has('canoes') && !canoestory && G.hasNot('boat building')){
			G.Message({type:'important',text:'From now exploring through ocean shores is possible. You realize that the world is so beautiful. You wonder if that "endless" ocean hide some secrets.',icon:[2,28,'magixmod']})
				canoestory=true
			}
			if(G.has('sedentism') && !sedestory && G.hasNot('building')){
			G.Message({type:'important',text:'Your people are now going to set up first dwellings. Aren\'t you happy that it may mean your tribe will have more people?',icon:[12,4]})
			sedestory=true
			}
			if(G.has('boat building') && !boatstory && G.hasNot('Stronger faith')){
			G.Message({type:'important',text:'Remember the first time you could explore beach? Since they can build and set up the boat they can discover the secrets which lay at the ocean depths.',icon:[3,28,'magixmod']})
			boatstory=true
			}
			if(G.has('ritualism') && !ritstory && G.hasNot('burial')){
			G.Message({type:'tutorial',text:'You now faced rituals. It is first spark of belief that may become a religion.',icon:[7,4]})
			ritstory=true
			}
			if (G.has('burial') && !burystory && !G.has('monument-building')){
			G.Message({type:'important',text:'The view of unburied corpses fears you and your settlers. Now they know that to calm down people you can just bury it.',icon:[13,2]})
				burystory=true
			}
			if(G.has('fire-making') && !firestory && !G.has('construction')){
			   G.Message({type:'tutorial',text:'Cold days and nights are gone if you will get some fire pits.',icon:[13,7]})
			firestory=true
			}
				if(G.has('sewing') && !sewstory && G.hasNot('weaving')){
				G.Message({type:'important',text:'You want some clothing. As long as you won\'t hire a Clothier only you know and do just for yourself some clothing.',icon:[15,7]})
					sewstory=true
				}
				if(G.has('weaving') && !weastory && G.hasNot('monument-building')){
				G.Message({type:'important',text:'You smile that now your people can craft clothing that is slightly better than primitive pieces of hide or grass.',icon:[16,7]})
					weastory=true
				}
				if(G.has('skinning') && !skinnsto && G.hasNot('city planning')){
				G.Message({type:'important',text:'You hope that primitive clothing from hide will make people happier. You think that this resource will make better clothing. You probably will ask some hunter to hunt some animal and get its hide for your tribe.',icon:[9,7]})
				skinnsto=true
				}
				if(G.getRes('gem block').amount>=10 && !gem && G.hasNot('monument-building')){
				G.Message({type:'important',text:'Oh, shiny gem blocks! You take one and hug it... So cute. : )',icon:[choose([17,18]),8]})
					gem=true
				}
				if(G.has('writing') && !writer && G.has('caligraphy') && G.has('alphabet 1/3') && G.hasNot('monument-building') && G.hasNot('alphabet 2/3')){
				G.Message({type:'important',text:'You managed to make people being able to write. Well... not everyone has readable writing... yet.',icon:[17,27,'magixmod']})
					writer=true
				}
				if(G.techN == 50 && !tech50){
				G.Message({type:'important',text:'Your tribe now can survive. Thanks to you '+G.getName('ruler')+' , dreamers and mostly thanks to Insight for it. You stare at your tribe with smile.',icon:[8,12,8,4]})
					tech50=true
				}
				if(G.traitN == 20 && !trait20){
				G.Message({type:'important',text:'This tribe develops some sort of traits.',icon:[8,12,8,4]})
					trait20=true
				}
				if(G.has('Guru') && !guru && G.hasNot('An opposite side of belief')){
				G.Message({type:'tutorial',text:'Since the moment when you unlocked <b>Guru</b> you may start gathering <font color="#ffaaff"><b>Science</b></font>. Just hire one or more Gurus and wait patiently till he will gather one for you. It is gonna be needed in the later stages of the game.',icon:[8,12,choose([3,4,5,6]),27,'magixmod']})
					guru=true
				}
			if(G.has('rules of food') && !rofpopup && G.hasNot('sedentism')){
				G.Message({type:'tutorial',text:'You now can control food and water rations. Your people seem a little angry and want to eat and drink more. Check the policies, there you may find a solution to this minor problem that may later become the major one if you will ignore this.',icon:[4,28,'magixmod']})
					rofpopup=true
				}
			if(G.getRes('land').amount==100 && !explorepop && !G.has('scout').amount>=1){
				G.Message({type:'tutorial',text:'<b>Maybe it is the time to hire a Scout.</b><br>Wanderer can\'t discover new tiles but may explore and discover secrets hidden in new territory. If you haven\'t hired a <b>Scout</b> yet think about doing it sometime. If you don\'t have him unlocked focus to get <b>Scouting</b> research',icon:[5,28,'magixmod']})
					explorepop=true
				}
			if(G.has('belief in the afterlife') && !bapopup && G.hasNot('monument-building')){
				G.Message({type:'tutorial',text:'You obtained <b>Belief in the afterlife</b> trait.<br>From now you may obtain <b><font color="fuschia">Monument-building</font></b> research that will unlock you very first wonder. <br>Belief may evolve into <b>Culture of the afterlife</b> unlocking more.',icon:[32,16,'magixmod']})
					bapopup=true
				}
			if(G.has('monument-building') && !monument && G.hasNot('Wizard complex')){
				G.Message({type:'tutorial',text:'Once you obtained <b>Monument-building</b> you may begin construction of very first wonder of your '+G.getName('inhabs')+'. Check it out in <u>Production</u> tab.',icon:[32,18,'magixmod']})
					monument=true
				}
			if(G.getRes('pot').amount>=1 && !pot && G.hasNot('masonry')){
				G.Message({type:'tutorial',text:'You finally can have some flower. Currently only you know how to pick flowers so while no one watch you , you pick a flower and some mud and put it into the pot.',icon:[32,15,'magixmod']})
					pot=true
				}
			if(G.getRes('cured meat').amount>=1 && G.getRes('cured seafood').amount>=1  && !cure && G.has('curing') && G.hasNot('Hunting II')){
				G.Message({type:'tutorial',text:'You take a taste of cured meat. Yummy :) You are sure that people will love taste of cured food as well as you did.',icon:[32,17,'magixmod']})
					cure=true
				}
			if(G.has('Wizard wisdom') && G.hasNot('Wizard complex') && !wiztip){
				G.Message({type:'tutorial',text:'Now you unlocked Wizards. Don\'t hire too much of them because these guys love eating a lot so having too much of them may lead to tribe starvation. Instead try to make your tribe bigger, hire more gatherers, explore then hire some. They are must-have.',icon:[choose([24,23,22,21]),8,'magixmod']})
					wiztip=true
				}
			if(G.has('Wizard towers') && G.hasNot('Belief in portals') && !esstip){
				G.Message({type:'tutorial',text:'You unlocked <b>Wizard towers</b>.<br>These towers provide housing and produce Essences using Mana. Make sure first if you have enough Mana income to upkeep at least one of towers. And make sure that you have built <b>Essence storages</b>.',icon:[20,13,'magixmod']})
					esstip=true
				}
			if(G.has('well-digging') && G.hasNot('monument-building') && !weltip){
				G.Message({type:'tutorial',text:'Henceforth you can dig a well why wouldn\'t you teach the others and set up your first <b>Well</b>. Well is source of fresh water but only 1 well per 10 pieces of land can be constructed.',icon:[30,3,'magixmod']})
					weltip=true
				}
			if(G.has('cart1') || G.has('cart2')){
			if(G.hasNot('Wizard wisdom') && !trendtip){
				G.Message({type:'tutorial',text:'Your '+G.getName('inhabs')+' have obtained their first trend. Trends increase income of specific resource. There are two types of trends: <li>"Decisional" - there you can pick what will be point of the trend(they appear as techs)</li><li>"Random" - you cannot choose what will be point of trend.(they appear as traits)</li><br>You are allowed to have at once random and decisional trend at one unit.',icon:[32,27,'magixmod']})
					trendtip=true
				}
			}
			if(G.has('Doctrine of the dark wormhole 1/5') && !doctip && G.hasNot('Doctrine of the dark wormhole 2/5')){
			G.Message({type:'tutorial',text:'Next part of doctrine is a trait. You don\'t have to roll new researches. All you should do now is waiting and no spending any essentials, because next part of doctrine despite it is a Trait but it is not cheap thing. Even numbered stages are traits while odd numbered stages are represented as researches.',icon:[32,27,'magixmod']})
				doctip=true
			}
			if(G.has('Mo\' beauty') && !mobeauty && G.hasNot('Doctrine of the dark wormhole 5/5')){
			G.Message({type:'story2',text:'Oh. <b>Mo\' beauty</b> made cities look much, much nicer. Lanterns, flower decors everywhere. Sometimes even <b>tools</b> (not joking now) have some shapes,patterns carved. And it is not any festival. You wander and even some huts get even more beautiful than ever.'})
			mobeauty=true
		}
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
		let UnderworldMESG = false
		new G.Res({
		name:'Underworld emblem',
		desc:'A thing you will get after entering the Underworld. Needed to unlock further researching. A pass for further things and more adventures. You can obtain only one Emblem of this type. <b>@You brought plagues for discoveries. Fine. I hope you won\'t regret this choice later.<b>',
		icon:[13,19,'magixmod'],
		startWith:0,
		tick:function(me,tick)
		{
			if (me.amount>=1 && !UnderworldMESG){ 
				G.Message({type:'emblemobtain',text:'<b>You and your people activated a way to the Underworld. Out of nowhere an Emblem appears behind you. It is hot in touch. Its red glowing only attract curses.</b></br> <font color="fuschia">So prepare to tame 6 Devil\'s traits in order to continue your adventure. Without it the Underworld won\'t allow you discover its secrets.',icon:[12,19,'magixmod']});
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
       				 G.Message({type:'underworldig',text:'As your people keep digging down they start to feel more warm but not overheat yet. It mostly warms you. It feels like some soul from not known earlier world wants to say something.</br> <b><font color="aqua">You are the one</br>Who wasn\'t done</br>Those people seek new worlds...</br>...and new odds</font></b>',icon:[0,19,'magixmod']});
				u1popup = true
				}
				if (me.amount==350 && G.hasNot('A feeling from the Underworld') && !u2popup){
       				 G.Message({type:'underworldig',text:'People continue digging down and another souls want to tell you few things and green soul seemed like Nature essence creation has bitten you. People complain for warmth.</br><b><font color="fuschia">The world you want to meet</br>Will not give all it has right before your feet</br>Danger for people abounds</br>and forbidden will become crowds</font></b>',icon:[1,19,'magixmod']});
				u2popup = true
				}
				if (me.amount==600 && G.hasNot('A feeling from the Underworld') && !u3popup){
       				 G.Message({type:'underworldig',text:'You see wizards using magic to cool down the warmth so people can continue digging down for new world. Dark voices yell and make civils feared near you. This doesn\'t seem well.</br><b><font color="teal">You want to see fear...</br>Please don\'t show me even one your tear...</br>You hear...</br>I yell so you are fear.</font></b>',icon:[2,19,'magixmod']});
				u3popup = true
				}
				if (me.amount==750 && G.hasNot('A feeling from the Underworld') && !u4popup){
       				 G.Message({type:'underworldig',text:'Out of nowhere people yell and run away in panic except small group of braves who still dig down. Souls start behave weird... or you just don\'t understand them yet.</br><b><font color="red">Don\'t let the Gods</br>Send there his crowds</br>Danger for people abounds</br>and forbidden are becoming crowds</font></b>',icon:[3,19,'magixmod']});
				u4popup = true
				}
				if (me.amount==950&& G.hasNot('A feeling from the Underworld') && !u5popup){
       				 G.Message({type:'underworldig',text:'A huge cavern starts to show while braves continued digging down. They run away to you... empowered weirdly by these souls. Another lightning essence creature paralyses you and water essence creatures started behaving insane. Is this greeting from new world?</br><b><font color="silver">Alright '+G.getName('ruler')+' ...</br>Call your soul and make it go...</br>Right to the world</br>The Under...world</font></b>',icon:[4,19,'magixmod']});
				u5popup = true
				}
				if (me.amount ==1500 && G.hasNot('A feeling from the Underworld') && !finalupopup){
					G.middleText('<font color="fuschia">Now ascend through Underworld to continue unlocking the new world.</font>','slow')
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
		var value=(G.getAchiev('Pocket').won*3+1)*100;
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
			G.getDict('soothsayer').icon = [28,3,'magixmod'];
			G.getDict('druid').icon = [29,30,'magixmod']
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
			}else if(G.checkPolicy('se03')=='on'){
			G.getDict('storyteller').limitPer = {'population':350}
			G.getDict('musician').limitPer = {'population':350}
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
			G.middleText('- Completed <font color="aqua">Level up</font> achievement -','slow')
			}
			if(G.has('dt9') && G.achievByName['Lucky 9'].won == 0){ //Lucky 9 achievement
			G.achievByName['Lucky 9'].won = 1
			G.middleText('- Completed <font color="red">Lucky 9</font> achievement -','slow')
			}
			if(G.techN >= 100 && G.achievByName['Apprentice'].won == 0){ //Apprentice achievement
			G.achievByName['Apprentice'].won = 1
			G.middleText('- Completed <font color="silver">Apprentice</font> achievement -','slow')
				if(G.techN==100 && !tech100){
			G.Message({type:'important',text:'You managed your civilization to be smart. They thank you with kindness for ruling them. They will not even think about choosing other lord than you. Keep going this way. Discover, research and prosper ',icon:[24,18,'magixmod',8,4]})
					tech100=true
				}}
			if(G.techN >= 200 && G.achievByName['Familiar'].won == 0){ //Apprentice achievement
			G.achievByName['Familiar'].won = 1
			G.middleText('- Completed <font color="lime">Familiar</font> achievement -','slow')
			}
			if(G.traitN >= 30 && G.achievByName['Traitsman'].won == 0){ //Traitsman achievement
			G.achievByName['Traitsman'].won = 1
			G.middleText('- Completed <font color="lime">Traitsman</font> achievement -','slow')
			}
			if((G.getRes('insight II').amount) == (G.getRes('wisdom II').amount) && G.achievByName['Extremely smart'].won == 0 && G.has('Eotm')){; //Extremely smart achievement
			G.achievByName['Extremely smart'].won = 1
			G.middleText('- Completed <font color="purple">Extremely smart</font> achievement -','slow')
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
			G.middleText('- All achievements  from tier <font color="orange">1</font> completed! - </br> </hr> <small>From now you will start each run with extra 100 fruits</small>','slow')
			}
			if(G.achievByName['Heavenly'].won >= 1 && G.achievByName['Deadly, revenantic'].won >= 1 && G.achievByName['"In the underworld"'].won >= 1 && G.achievByName['Level up'].won >= 1 && G.achievByName['Lucky 9'].won >= 1 && G.achievByName['Traitsman'].won >= 1 && G.achievByName['Smart'].won == 0 && G.achievByName['Familiar'].won == 1){ //Experienced
			G.achievByName['Smart'].won = 1
			G.middleText('- All achievements  from tier <font color="orange">2</font> completed! - </br> </hr> <small>From next run basic housing uses less land.</small>','slow')
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
			if(G.has('cozy building') && G.hasNot('cozier building')){
			G.getDict('hut').icon = [28,12,'magixmod']
			G.getDict('hovel').icon = [28,11,'magixmod']
			G.getDict('mud shelter').icon = [28,13,'magixmod']
			G.getDict('house').icon = [28,14,'magixmod']
			}
			if(G.has('cozier building')){
			G.getDict('hut').icon = [29,10,'magixmod']
			G.getDict('hovel').icon = [29,11,'magixmod']
			G.getDict('mud shelter').icon = [29,12,'magixmod']
			G.getDict('house').icon = [29,14,'magixmod']
			G.getDict('branch shelter').icon = [29,13,'magixmod']
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
				G.getDict('sleepy insight').cost = {'faith II':3,'insight II':3}
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
						G.getDict('bazaar_buy').effects.push({type:'mult',value:1.5,req:{'Backshift':true}});
						G.getDict('bazaar_sell').effects.push({type:'mult',value:1.5,req:{'Backshift':true}});
						G.getDict('market_buy').effects.push({type:'mult',value:1.5,req:{'Backshift':true}});
						G.getDict('market_sell').effects.push({type:'mult',value:1.5,req:{'Backshift':true}});
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
			if(G.has('dt17') && G.has('sb4') && G.checkPolicy('se03')=='on' && G.achievByName['Not so pious people'].won == 0){;
			G.achievByName['Not so pious people'].won = 1
			G.middleText('- Completed <font color="cyan">Not so pious people</font> achievement -','slow')
			}
			if(G.modsByName['Market mod']){
				if(G.has('Backshift')){
					G.getDict('bazaar_buy').use={'worker':2,'land':1}
					G.getDict('bazaar_sell').use={'worker':2,'land':1}
					G.getDict('market_buy').use={'worker':3,'land':1}
					G.getDict('market_sell').use={'worker':3,'land':1}
					G.getDict('bazaar_buy').effects.push({type:'mult',value:1.5,req:{'Backshift':true}});
					G.getDict('bazaar_sell').effects.push({type:'mult',value:1.5,req:{'Backshift':true}});
					G.getDict('market_buy').effects.push({type:'mult',value:1.5,req:{'Backshift':true}});
					G.getDict('market_sell').effects.push({type:'mult',value:1.5,req:{'Backshift':true}});
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
			if(G.modsByName['Market mod'] || G.modsByName['Coal mod'] || G.modsByName['Laws Of Food'] || G.modsByName['Laws Of Food Free Version'] || G.modsByName['Thot Mod']){
			   if(G.achievByName['3rd party'].won==0){
			G.achievByName['3rd party'].won = 2 //Fix for displaying over time middleText
			G.middleText('- Completed <font color="pink">3rd party</font> achievement -','slow')
			  }
			}
			if(G.has('Mo\' beauty')){
				G.getDict('warehouse').icon=[30,9,'magixmod']
				G.getDict('barn').icon=[30,8,'magixmod']
				G.getDict('granary').icon=[30,7,'magixmod']
				G.getDict('stockpile').icon=[30,6,'magixmod']
				G.getDict('well').icon=[30,5,'magixmod']
				if(G.hasNot('furnace modernization')){
				G.getDict('furnace').icon=[30,4,'magixmod']
				}else{
					G.getDict('furnace').icon=[11,0,'magixmod']
					G.getDict('furnace').displayName='Blackium furnace';
					G.getDict('furnace').upkeep={'log':3,'coal':3,'Lightning essence':2};
					G.getDict('furnace').cost={'basic building materials':115,'blackium ore':50,'coal':75};
				}
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
				if(G.modsByName['Thot Mod']){
					G.getDict('thot').icon=[21,27,'magixmod']
				}
			}
			if(G.has('Plain island mining strategy')){
			G.getDict('Mine of the plain island').icon = [31,8,'magixmod']
			}
			if(G.has('backshift at farms')){
			G.getDict('Wheat farm').icon = [31,19,'magixmod']
			G.getDict('Wheat farm').use={'worker':12,'land':15}
			G.getDict('Berry farm').icon = [31,17,'magixmod']
			G.getDict('Berry farm').use={'worker':12,'Land of the Plain Island':35}
			G.getDict('Sugar cane farm').icon = [31,18,'magixmod']
			G.getDict('Sugar cane farm').use={'worker':12,'Land of the Plain Island':35}
			}
			if(G.checkPolicy('se12')=='on')//Okar The Seer's backfire
			{
			G.getDict('Guru').upkeep = {'food':10,'water':5}
			G.getDict('dreamer').upkeep = {'food':2,'water':1}
			G.getDict('Guru').alternateUpkeep = {'spoiled food':4,'muddy water':2}
			G.getDict('dreamer').alternateUpkeep = {'spoiled food':2,'muddy water':1}
			}
			if(G.traitN >= 50 && G.achievByName['Trait-or'].won == 0){ //Traitsman achievement
			G.achievByName['Trait-or'].won = 1
			G.middleText('- Completed <font color="pink">Trait-or</font> achievement -','slow')
			}
			if((G.getRes('Worship point').amount) == 0 && G.achievByName['The first choice'].won == 0 && G.has('Pantheon key')){;
			G.achievByName['The first choice'].won = 1
			G.middleText('- Completed <font color="cyan">The first choice</font> achievement -','slow')
			}
			if(G.checkPolicy('se04')=='on' && G.checkPolicy('se05')=='off'){G.getDict('se05').cost={'Worship point':1,'faith II':10,'New world point':1}};
			if(G.checkPolicy('se05')=='on' && G.checkPolicy('se04')=='off'){G.getDict('se04').cost={'Worship point':1,'faith II':10,'New world point':1}};
			if(G.has('skinning')){
			G.getDict('stoats').res['hunt']['hide']=1;
			G.getDict('wild rabbits').res['hunt']['hide']=0.2;
			G.getDict('koalas').res['hunt']['hide']=0.2;
			G.getDict('deer').res['hunt']['hide']=0.6;
			G.getDict('bears').res['hunt']['hide']=1;
			G.getDict('polar bears').res['hunt']['hide']=1;
			G.getDict('boars').res['hunt']['hide']=0.5;
			G.getDict('foxes').res['hunt']['hide']=0.5;
			G.getDict('wolves').res['hunt']['hide']=0.5;
			G.getDict('seals').res['hunt']['hide']=0.5;
			G.getDict('crocodiles').res['hunt']['leather']=0.5;
			}
			//OSMIUM , MODERNIUM AND CARETAKIUM SPAWN
			if(G.has('mining II')){
			G.getDict('rocky substrate').res['mine']['osmium ore']=0.003;
			G.getDict('tundra rocky substrate').res['mine']['osmium ore']=0.0041;
			G.getDict('ice desert rocky substrate').res['mine']['osmium ore']=0.004;
			G.getDict('dead rocky substrate').res['mine']['osmium ore']=0.0005;
			G.getDict('badlands substrate').res['mine']['osmium ore']=0.001;
				if(G.has('<font color="maroon">Caretaking</font>')){
					G.getDict('rocky substrate').res['deep mine']['caretakium ore']=0.02;
					G.getDict('tundra rocky substrate').res['deep mine']['caretakium ore']=0.002;
					G.getDict('ice desert rocky substrate').res['deep mine']['caretakium ore']=0.001;
					G.getDict('badlands substrate').res['deep mine']['caretakium ore']=0.01;
					G.getDict('lush rocky substrate').res['deep mine']['caretakium ore']=0.015;
				}else if(G.has('<font color="maroon">Moderation</font>')){
					G.getDict('rocky substrate').res['deep mine']['modernium ore']=0.01;
					G.getDict('tundra rocky substrate').res['deep mine']['modernium ore']=0.002;
					G.getDict('ice desert rocky substrate').res['deep mine']['modernium ore']=0.001;
					G.getDict('badlands substrate').res['deep mine']['modernium ore']=0.01;
					G.getDict('lush rocky substrate').res['deep mine']['modernium ore']=0.015;
				}
			}
			if(G.has('herbalism')){
			G.getDict('grass').res['gather']['herb']=10;
			G.getDict('berry bush').res['gather']['herb']=0.25;
			G.getDict('forest mushrooms').res['gather']['herb']=4;
			G.getDict('succulents').res['gather']['herb']=3;
			G.getDict('jungle fruits').res['gather']['herb']=1;
			}
			if(G.has('winter holidays')){
			G.getDict('snow cover').res['dig']['snow']=1;
			}
			if(G.has('t10')){
			G.getDict('grass').res['gather']['wooden coin']=0.2;
			G.getDict('succulents').res['gather']['wooden coin']=0.1;
			}
			if(G.modsByName['Thot Mod']){
				G.getDict('thot').req={'philosophy':true}
				if(G.hasNot('philosophy')){
					G.getDict('thot').effects.push({type:'mult',value:0,req:{'philosophy':false}});
					G.getDict('thot').icon=[28,2,'magixmod',0,0,'thotSheet']
				}else if(G.has('philosophy')){
					G.getDict('thot').effects.push({type:'mult',value:1});
					G.getDict('thot').icon=[0,0,'thotSheet']
				}
				
			}
			if(G.achievByName['<font color="DA4f37">Mausoleum eternal</font>'].won >= 1 && G.achievByName['Extremely smart'].won >= 1 && G.achievByName['Man of essences'].won >= 1 && G.achievByName['Magical'].won >= 1 && G.achievByName['Next to the God'].won >= 1 && G.achievByName['The first choice'].won >= 1 && G.achievByName['Trait-or'].won >= 1 && G.achievByName['Not so pious people'].won >= 1 && G.achievByName['Talented?'].won == 0){ //Experienced
			G.achievByName['Talented?'].won = 1
			G.middleText('- All achievements  from tier <font color="orange">3</font> completed! - </br> </hr> <small>All crafting units and few non-crafting units that use overworld land since the next run will use 15% less land. In addition you can pick <font color="aqua">1 of 5</font> researches instead of <font color="aqua">1 of 4</font></small>','slow')
			}
			if(G.has('Outstanders club')){
			G.getDict('The Outstander').limitPer = {'population':26500}
			}
				if(G.has('<font color="orange">Smaller shacks</font>')){
			G.getDict('blacksmith workshop').use = {'land':0.85}
			G.getDict('furnace').use = {'land':0.85}
			G.getDict('kiln').use = {'land':0.85}
			G.getDict('Hovel of colours').use = {'land':0.85,'worker':20,'stone tools':25,'Instructor':2}
			G.getDict('Hut of potters').use = {'land':0.85,'worker':20,'stone tools':25,'Instructor':2}
			G.getDict('Leather factory').use = {'land':0.85,'worker':15,'stone tools':32,'Instructor':1}
			G.getDict('Factory of pots').use = {'land':0.85,'worker':15,'stone tools':32,'Instructor':1}
			G.getDict(';Water filter').use = {'land':0.8,'worker':1}
			G.getDict('Water filter').use = {'land':0.6,'worker':1}
			G.getDict('Bakery').use = {'land':0.85,'Instructor':1}
			G.getDict('Chef').use = {'land':0.85,'worker':1}
			G.getDict('Well of mana').use = {'land':0.85}
			G.getDict('Concrete making shack').use = {'land':0.85,'worker':1}
			G.getDict('well').use = {'land':0.85}
			G.getDict('crematorium').use = {'land':0.85,'Instructor':1,'worker':3}	
			}
			if(G.has('<font color="orange">Smaller shacks</font>') && G.has('backshift at farms')){
				G.getDict('Wheat farm').use={'worker':12,'land':13.75}
			}
			//STORAGE NERFS
			G.getDict('Fire essence storage').cost={'basic building materials':(15*(G.getUnitAmount('Fire essence storage')+3/15)),'glass':(30*(G.getUnitAmount('Fire essence storage')+1.15/15))};
			G.getDict('Water essence storage').cost={'basic building materials':(15*(G.getUnitAmount('Water essence storage')+3/15)),'glass':(30*(G.getUnitAmount('Water essence storage')+1.15/15))};
			G.getDict('Nature essence storage').cost={'basic building materials':(15*(G.getUnitAmount('Nature essence storage')+3/15)),'glass':(30*(G.getUnitAmount('Nature essence storage')+1.15/15))};
			G.getDict('Wind essence storage').cost={'basic building materials':(15*(G.getUnitAmount('Wind essence storage')+3/15)),'glass':(30*(G.getUnitAmount('Wind essence storage')+1.15/15))};
			G.getDict('Dark essence storage').cost={'basic building materials':(15*(G.getUnitAmount('Dark essence storage')+3/15)),'glass':(30*(G.getUnitAmount('Dark essence storage')+1.15/15))};
			G.getDict('Lightning essence storage').cost={'basic building materials':(15*(G.getUnitAmount('Lightning essence storage')+3/15)),'glass':(30*(G.getUnitAmount('Lightning essence storage')+1.15/15))};
			G.getDict('Holy essence storage').cost={'basic building materials':(15*(G.getUnitAmount('Holy essence storage')+3/15)),'glass':(30*(G.getUnitAmount('Holy essence storage')+1.15/15))};
			G.getDict('christmas essence storage').cost={'basic building materials':(15*(G.getUnitAmount('christmas essence storage')+3/15)),'glass':(30*(G.getUnitAmount('christmas essence storage')+1.15/15))};
			if(G.hasNot('t10')){G.getDict('precious metal ingot').partOf='misc materials'}//this resource will not decay during Pocket but normally without active trial will
				if(G.checkPolicy('reset health level')=='activate'){  //hunted special policy
				G.getDict('reset health level').cost={'land':1e5};G.getRes('health').amount=0; G.setPolicyModeByName('reset health level','alreadyused');
			}
			if(G.checkPolicy('reset health level')=='alreadyused'){G.getDict('reset health level').cost={'land':1e5}};
			G.getDict('bank').effects=[{type:'provide',what:{'money storage':-G.getAchiev('Pocket').won*250+6000}}];
			 if(G.has('<font color="maroon">Caretaking</font>')){G.getDict('grand mirror').wideIcon=[1,30,'magixmod'],G.getDict('grand mirror').cost={'Magic essences':250000,'Cobalt ingot':500,'precious building materials':1000,'basic building materials':250,'platinum ingot':350};G.getDict('grand mirror').costPerStep={'Magic essences':25000,'precious building materials':1000,'basic building materials':250,'gems':5000};}
				else if(G.has('<font color="maroon">Moderation</font>')){G.getDict('grand mirror').wideIcon=[4,30,'magixmod'];G.getDict('grand mirror').cost={'strong metal ingot':7500,'Cobalt ingot':500,'precious building materials':1000,'basic building materials':250,'Basic factory equipment':500};G.getDict('grand mirror').upkeep={'coal':100,'Mana':100,'Magic essences':50};G.getDict('grand mirror').costPerStep={'Magic essences':25000,'precious building materials':1300,'basic building materials':250,'hard metal ingot':150,'coal':3000,'log':4000};}
///UNIVERSITY LEVELLING
			if(G.getUnitByName('scientific university').mode==4){
				if(G.has('Bigger university') && G.getRes('university point').amount==0 && G.getRes('victory point').amount >=4){
			G.getUnitByName('scientific university').mode=0;
			G.getDict('scientific university').steps=300;
			G.getDict('scientific university').cost={'basic building materials':2400,'precious building materials':1200,'Magic essences':3000,'Mana':40000,'science':90};
			G.getDict('scientific university').costPerStep={'basic building materials':1450,'precious metal ingot':500,'insight II':320,'science':75,'gems':1000,'wisdom II':-0.6,'education':-0.35,'Mana':4e4,'university point':-1};
			G.getDict('scientific university').finalStepCost={'population':3000,'insight II':425,'wisdom':350,'science':100,'wisdom II':-25,'education':-25,'university point':-100};
			G.getDict('scientific university').icon=[16,29,'magixmod'];G.getDict('scientific university').wideIcon=[15,29,'magixmod'];
			}};
			if(G.getUnitByName('scientific university').mode==4 && G.getRes('university point').amount==0 && G.has('even bigger university') && G.has('bigger university')){
				G.getUnitByName('scientific university').mode==0;
			G.getDict('scientific university').icon=[19,29,'magixmod'];
			G.getDict('scientific university').wideIcon=[18,29,'magixmod'];
			G.getDict('scientific university').steps=400;
			G.getDict('scientific university').cost={'basic building materials':2400,'precious building materials':1200,'Magic essences':90000,'Mana':40000,'science':180};
					G.getDict('scientific university').costPerStep={'Magic essences':30000,'basic building materials':2450,'precious metal ingot':800,'insight II':600,'science':200,'gems':1500,'wisdom II':-0.5,'education':-0.3,'Mana':4e5,'university point':-1};
			}
			if(G.has('<span style="color: ##FF0900">Plain island building</span>')){
					G.getDict('<span style="color: #E0CE00">Plain island portal</span>').wideIcon=[7,3,'magixmod'];
				
		}
			if(G.has('no knapping anymore')){
				G.getDict('healer').use={'stone tools':1,'worker':1,'knapped tools':-1} //had to addk knapped tools -1 because declaring just
				G.getDict('woodcutter').use = {'stone tools':1,'worker':1,'knapped tools':-1}// s.t and wrkr didn't make knapped tools usage disappear
				G.getDict('digger').use = {'stone tools':1,'worker':1,'knapped tools':-1}//at least it works as it is supposed to
				
				}
			//6 Aces
			if(G.has("dt19") && G.has("dt20") && G.has("dt21") && G.has("dt22") && G.has("dt23") && G.has("dt24") && G.achievByName['6 aces'].won==0){
				G.middleText('- Completed <font color="green">6 aces</font> achievement -','slow');
				G.achievByName['6 aces'].won=1;
			}else if(G.has("gt7") && G.has("gt8") && G.has("gt9") && G.has("gt10") && G.has("gt11") && G.has("gt12") && G.achievByName['6 aces'].won==0){
				 G.middleText('- Completed <font color="green">6 aces</font> achievement -','slow');
				G.achievByName['6 aces'].won=1;
				 }
			if(G.has('tool rafinery 1/2') && G.hasNot('tool rafinery 2/2')){
				G.getDict('stone tools').icon=[19,31,'magixmod'];
				G.getDict('stone weapons').icon=[21,31,'magixmod'];
				G.getDict('metal tools').icon=[20,31,'magixmod'];
				}else if(G.has('tool rafinery 1/2') && G.has('tool rafinery 2/2')){
					G.getDict('stone tools').icon=[22,31,'magixmod'];
				G.getDict('stone weapons').icon=[23,31,'magixmod']; 
					G.getDict('metal tools').icon=[20,31,'magixmod'];
					G.getDict('stone tools').displayName='Refined tools';
				G.getDict('stone weapons').displayName='Refined weapons';
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
		//hidden:true,
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
		//hidden:true,
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
		//hidden:true,
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
		//hidden:true,
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
		//hidden:true,
	});
		new G.Res({
		name:'corpsedecaypoint',
	});
		new G.Res({
		name:'heavenlyTemplePoint',
		displayName:'Temple of heaven point'
	});
	new G.Res({
		name:'godTemplePoint',
		displayName:'Paradise temple point'
	});
		new G.Res({
		name:'victory point',
		desc:'You can gain Victory Points for completing Seraphin\'s Trial. 11 of 12 trials are repeatable. After first completion of the trial it grants 1 VP, after 2nd succesful attempt in total grants 3 VP\'s and so on. They can\'t be spent but their amount may provide extra bonuses. ',
		icon:[0,28,'magixmod'],
	});
	new G.Res({
		name:'unhappy',
	});
	new G.Res({
		name:'blood',
		desc:'You gain blood each year from Madness victims equal to murdered people. Required to glory Bersaria and to research next things with [fear of death] active. You start with 200 [blood] in that case. <>But the blood is used in Hunted trial as well to keep Hartar\'s servants hunting meat for you.',
		icon:[33,6,'magixmod'],
		startWith:200,
		category:'main',
		hidden:true
	});
	new G.Res({
		name:'chance',
		tick:function(me,tick)
		{
			if(G.day==290){
			me.amount=Math.random() * 100;
			}
		},
	});
	
	new G.Res({
		name:'cultural balance',
		desc:'[cultural balance] is main rule of Cultural trial. Defines the rate of cultural stability in this plane.',
		startWith:25,
		icon:[33,7,'magixmod'],
		fractional:true,
		category:'main',
		hidden:true,
		tick:function(me,tick)
		{
		},
		getIcon:function(me)
		{
			var amount=me.amount
				if (amount<=10) return [33,11,'magixmod'];
				else if (amount<=20) return [33,10,'magixmod'];
				else if (amount>20 && amount<30) return [33,7,'magixmod'];
				else if (amount>30) return [33,8,'magixmod'];
				else if (amount>=40) return [33,9,'magixmod'];
				
			
		},
	});
	
	new G.Res({
		name:'beyond',
		tick:function(me,tick)
		{
			if(G.has('beyond the edge') && G.getRes('beyond').amount==0){
			G.gain('beyond',1)
				G.lose('population',G.getRes('population').amount*0.3);
				G.getRes('happiness').amount=0;G.getRes('health').amount=0;
				G.getRes('insight').amount=0;G.getRes('insight II').amount=0;
				G.getRes('culture').amount=0;G.getRes('culture II').amount=0;
				G.getRes('faith').amount=0;G.getRes('faith II').amount=0;
				G.getRes('influence').amount=0;G.getRes('influence II').amount=0;
				G.getRes('science').amount=0;
			}
			if(G.has('beyond the edge II') && G.getRes('beyond').amount==1){
			G.gain('beyond',1)
				var toSick=G.getRes('adult').amount;
				G.lose('adult',toSick);
				G.gain('sick',toSick);
				G.lose('population',G.getRes('population').amount*0.4);
				G.getRes('happiness').amount=0;G.getRes('health').amount=0;
				G.getRes('insight').amount=0;G.getRes('insight II').amount=0;
				G.getRes('culture').amount=0;G.getRes('culture II').amount=0;
				G.getRes('faith').amount=0;G.getRes('faith II').amount=0;
				G.getRes('influence').amount=0;G.getRes('influence II').amount=0;
				G.getRes('science').amount=0;
			}
			
		}
	});
	new G.Res({
		name:'wooden coin',
		desc:'1st tier of currency used by Pocket trial. To get 1 [silver coin] you will need: 100*((times you have completed Pocket*3)+1) [wooden coin]s. Can be used to buy primary, archaic resources.',
		category:'misc',
		icon:[5,25,'magixmod'],
		tick:function(me,tick)
		{
			if(G.getRes('money storage').used==G.getRes('money storage').amount){
			var toSpoil=me.amount*0.004*G.achievByName['Pocket'].won;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			}
		},
	});
	new G.Res({
		name:'silver coin',
		desc:'2nd tier of currency used by Pocket trial. To get 1 [golden coin] you will need: 100*((times you have completed Pocket*3)+1) [silver coin]s. Can be used to buy basic resources.',
		category:'misc',
		icon:[6,25,'magixmod'],
		tick:function(me,tick)
		{
			if(G.getRes('money storage').used==G.getRes('money storage').amount){
			var toSpoil=me.amount*0.004*G.achievByName['Pocket'].won;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			}
		},
	});
	new G.Res({
		name:'golden coin',
		desc:'3rd and the highest tier of currency used by Pocket trial. Can be used to buy most expensive resources.',
		category:'misc',
		icon:[7,25,'magixmod'],
		tick:function(me,tick)
		{
			if(G.getRes('money storage').used==G.getRes('money storage').amount){
			var toSpoil=me.amount*0.004*G.achievByName['Pocket'].won;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			}
		},
	});
	new G.Res({
		name:'university point',
		icon:[8,12,6,4]
	});
	let MirrorMESG=false
	new G.Res({
		name:'emblem \'o mirror',
		desc:'A thing you will get from opening the [grand mirror]. Not so needed to unlock further researching. A pass for further things and more adventures. You can obtain only one Emblem of this type. <b>@Cloning the world via magic. The more portals you\'ll open the more unstability you may bring on you and your '+G.getName('inhabs')+' . It is time to stop... before something bad happens.</b>',
		icon:[11,30,'magixmod'],
		tick:function(me,tick)
		{
			if (me.amount>=1 && !MirrorMESG){ 
				G.Message({type:'emblemobtain',text:'<b>Your people finally made Grand Mirror work like a portla. Out of nowhere an Emblem appears behind you. It is cold in touch and perfectly symetrical. An emblem has a warning carved onto it. <br></b><li>Pro tip: hover on Emblem in <b>Essentials resource category</b> to read a message.',icon:[12,19,'magixmod']});
				MirrorMESG = true
			if (G.checkPolicy('Toggle SFX')=='on') //Toggle SFX
			{
			var audioEmblem = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GainedEmblem.mp3');
			audioEmblem.play();
			}
			}
			if (G.has('mirror world 2/2')){
			me.hidden=true
			}
		},	
		category:'main',
	});
	new G.Res({
		name:'money storage',
		desc:'Each [money storage] unit lowers the rate of decay or theft for one unit of your money. [wooden coin] uses 0.1 point of storage, [silver coin] uses 1 and [golden coin] uses 5 pts.//The number on the left is how much material storage is occupied, while the number on the right is how much you have in total. //Note: This is only available while in Pocket trial.',
		icon:[12,30,'magixmod'],
		tick:function(me,tick)
		{
			me.used=(G.getRes('wooden coin').amount/10)+(G.getRes('silver coin').amount)+(G.getRes('golden coin').amount*5);
		},
		getDisplayAmount:function()
		{
			return B(Math.min(this.displayedAmount,this.displayedUsedAmount))+'<wbr>/'+B(this.displayedAmount);
		},
		displayUsed:true,
		category:'demog'
	});
	new G.Res({
		name:'lead ore',
		desc:'Ore that can be processed into [hard metal ingot]s.',
		icon:[10,4,'magixmod'],
		partOf:'misc materials',
		category:'ore',
	});
  new G.Res({
		name:'mythril ore',
		desc:'Ore that is harder to find than gold and silver. Can be processed into [mystical metal ingot]s.',
		icon:[10,3,'magixmod'],
		partOf:'misc materials',
		category:'ore',
	});
  new G.Res({
		name:'zinc ore',
		desc:'Ore that can be processed into [hard metal ingot]s. Zinc is a slightly brittle metal at room temperature.',
		icon:[11,3,'magixmod'],
		partOf:'misc materials',
		category:'ore',
	});
  new G.Res({
		name:'osmium ore',
		desc:'Ore that can be processed into [soft metal ingot]s. It is a hard, brittle, bluish-white metal.',
		icon:[10,2,'magixmod'],
		partOf:'misc materials',
		category:'ore',
	});
  new G.Res({
		name:'blackium ore',
		desc:'Ore that can be processed into [strong metal ingot]s.',
		icon:[11,2,'magixmod'],
		partOf:'misc materials',
		category:'ore',
	});
  new G.Res({
		name:'mystical metal ingot',
		desc:'Can be used to craft [various metal block].',
		icon:[11,6,'magixmod'],
		partOf:'misc materials',
		category:'build',
	});
   new G.Res({
		name:'unknownium ore',
		desc:'unknown ore ¯\_(ツ)_/¯',
		icon:[10,5,'magixmod'],
		partOf:'misc materials',
		category:'ore',
	});
   new G.Res({
		name:'dinium ore',
		desc:'What to do with that ore? Seems like furnaces cannot smelt it.',
		icon:[11,5,'magixmod'],
		partOf:'misc materials',
		category:'ore',
	});
    new G.Res({
		name:'pyrite',
		desc:'A fool\'s gold. Cannot be smelted for [precious metal ingot]. Most commonly it is a waste.',
		icon:[11,4,'magixmod'],
		category:'ore',
	});
	  new G.Res({
		name:'slain corpse',
		icon:[3,16,'magixmod'],
	});
	new G.Res({name:'soldiers defeats',hidden:true});
	new G.Res({
		name:'various metal block',
		desc:'A valuable, if unreliable construction material. Can be crafted by using: [mythril ore,Mythril],[dinium ore],[blackium ore] and many more.',
		icon:[10,6,'magixmod'],
		partOf:'precious building materials',
		category:'build',
	});
	 new G.Res({//WIP
		name:'modernium ore',
		desc:'Red almost pink ore. To process a ingot from it you have a low chance for that. At least it can be smelt into random things like [coal]. Only obtainable if people will be led by [<font color="maroon">Moderation</font>].// <font color="fuschia">InDev</font>',
		icon:[10,8,'magixmod'],
		category:'ore',
	}); 
	new G.Res({//WIP
		name:'caretakium ore',
		desc:'Dark green ore. To process a ingot from it you have a low chance for that. At least it can be used in some other purposes like forging blocks. Some people say it can be like a herb... but unedible. Only obtainable if people will be led by [<font color="maroon">Caretaking</font>].// <font color="fuschia">InDev</font>',
		icon:[10,7,'magixmod'],
		category:'ore',
	});
	new G.Res({
		name:'"golden insight"',
		desc:'["golden insight"] is a essential required to researching in Faithful plane. You can obtain it from "buying". //To "buy" it click on a button that will make you able to buy this resource. But be careful... it costs [faith] and [insight]. Also it can increase its cost. //As [insight] the limit is the wisdom',
		icon:[35,16,'magixmod'],
		category:'main',
		limit:'wisdom',
		getDisplayAmount:researchGetDisplayAmount,
		whenGathered:researchWhenGathered,
	});
	new G.Res({
		name:'plain portal point',
		tick:function(me,tick){
	if(me.amount>=1 && G.getUnitByName('<span style="color: #E0CE00">Plain island portal</span>').mode==4 && me.amount<2 && G.hasNot('<span style="color: ##FF0900">Plain island building</span>')){
				G.gain('plain portal point',1);
				G.getUnitByName('<span style="color: #E0CE00">Plain island portal</span>').mode=0;
				//G.getDict('<span style="color: #E0CE00">Plain island portal</span>').cost={'insight':250};
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').wideIcon=[7,3,'magixmod'];
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').icon=[8,3,'magixmod'];
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').steps=75;
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').desc='@opens a portal to a huge <b>Plain Island</b>. A creation made of ideas of wizards and dreams of population.//A Dream comes real. You will grant +28000 [Land of the Plain Island] upon activation of portal. Stage 2 of 2 //Note: Portals work a lil bit differently: refreshing page during this stage will bring completion level back to 0%',
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').cost={'Mana':4000,'insight':150,'faith':50,'culture':40};
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').use={'land':-10};
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').costPerStep={'Mana':14000,'Dark essence':5200,'Fire essence':5250,'Nature essence':5300,'Wind essence':5150,'Water essence':5500,'Lightning essence':5225};
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').finalStepDesc='Perform a final step to activate this portal';
				G.getDict('<span style="color: #E0CE00">Plain island portal</span>').finalStepCost={'Land of the Plain Island':-28000,'Plain Island emblem':-1,/*Bonus provided by portal activation*/'Mana':40000,'Dark essence':5000,'Fire essence':5500,'Nature essence':6000,'Wind essence':4500,'Water essence':8000,'Lightning essence':5250,'insight':1000,'plain portal point':-1};
			}else if(me.amount>=2 && G.has('<span style="color: ##FF0900">Plain island building</span>')){
					G.getUnitByName('<span style="color: #E0CE00">Plain island portal</span>').mode=4;
					G.getDict('<span style="color: #E0CE00">Plain island portal</span>').wideIcon=[7,3,'magixmod'];
					G.getDict('<span style="color: #E0CE00">Plain island portal</span>').icon=[8,3,'magixmod'];
					G.getDict('<span style="color: #E0CE00">Plain island portal</span>').desc='@opens a portal to a huge <b>Plain Island</b>. A creation made of ideas of wizards and dreams of population.//A Dream comes real. You will grant +28000 [Land of the Plain Island] upon activation of portal. Completed';
			}
		},
	  });
	new G.Res({
		name:'paradise portal point',
		tick:function(me,tick){
	//PARADISE PORTAL REWORK
			if(me.amount>=1 && G.getUnitByName('<span style="color: #E0CE00">Portal to the Paradise</span>').mode==4 && G.hasNot('<span style="color: ##FF0900">Paradise building</span>')){
				G.gain('paradise portal point',1);
				G.getUnitByName('<span style="color: #E0CE00">Portal to the Paradise</span>').mode=0;
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').wideIcon=[7,4,'magixmod'];
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').icon=[8,4,'magixmod'];
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').steps=75;
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').use={'land':-10};
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').desc='@opens a portal to a huge <b>God\'s Paradise</b>A very hard project, allowed by God.//A Dream to see Paradise, angels and much, much more comes real. You will grant +26500 [Land of the Paradise] at your own but you <b>must</b> follow some of God\'s rules. Stage 2 of 2 //Note: Portals work a lil bit differently: refreshing page during this stage will bring completion level back to 0%',
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').cost={'Mana':4000,'insight':150,'faith':50,'culture':40};
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').costPerStep={'Mana':184000,'Dark essence':18200,'Fire essence':18250,'Nature essence':18300,'Wind essence':18150,'Water essence':18500,'Lightning essence':18225};
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').finalStepDesc='Perform a final step to activate this portal';
				G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').finalStepCost={'Land of the Paradise':-26500,'Paradise emblem':-1,/*Bonus provided by portal activation*/'Mana':40000,'Dark essence':95000,'Fire essence':95500,'Nature essence':96000,'Wind essence':104500,'Water essence':88000,'Lightning essence':75250,'insight':1000};
			}else if(me.amount>=2 && G.has('<span style="color: ##FF0900">Paradise building</span>')){
					G.getUnitByName('<span style="color: #E0CE00">Portal to the Paradise</span>').mode=4;
					G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').wideIcon=[7,4,'magixmod'];
					G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').icon=[8,4,'magixmod'];
					G.getDict('<span style="color: #E0CE00">Portal to the Paradise</span>').desc='@opens a portal to a huge <b>God\'s Paradise</b>A very hard project, allowed by God.//A Dream to see Paradise, angels and much, much more comes real. You will grant +26500 [Land of the Paradise] at your own but you <b>must</b> follow some of God\'s rules. Completed';
			}
		},
		});
	new G.Res({
		name:'snow',
		desc:'Cold snow can be used to craft Snowmen, fun, snowball fights. The thing that children like mostly. Hire a [digger] to gather it.',
		icon:[9,11,'seasonal'],
		category:'seasonal',
		hidden:true,
		turnToByContext:{'Snow':{'health':-0.0005,'happiness':0.001}},
		tick:function(me,tick){
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
	});
		new G.Res({
		name:'christmas essence',
		desc:'Main of Christmas. Can be gathered from ways related to that festive. Has usages. Does not belong to [Magic essences] officialy until you\'ll unlock [sleep-speech] and [villas of victory].',
		icon:[3,10,'seasonal'],
		category:'seasonal',
		hidden:true,
		tick:function(me,tick){
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
		limit:'christmas essence limit',
		whenGathered:researchWhenGathered,
	});
	new G.Res({
		name:'christmas essence limit',
		icon:[8,12,3,10,'seasonal'],
		hidden:true,
	});
	new G.Res({
		name:'child of Christmas',
		desc:'[child of Christmas,Children of Christmas] leave after many meetings from Lodge of Christmas. Some of them say they are elves, Claus\'s helpers and many more.//After a while, they will grow up into [adult,Adults].//Children drink and eat half as much as adults.//These children can work as [artisan of christmas] , can be hired to take care about [christmas essence storage], can craft gifts for people bringing [happiness]. @They are happy despite assigning them to work as long as their work is related to christmas.',
		partOf:'population',
		icon:[13,10,'seasonal'],
		hidden:true,
		displayUsed:true,
		category:'demog'
	});
	new G.Res({
		name:'christmas ornament',
		desc:'Artisan of christmas can craft it. Used to decorate christmas trees, lamps and many more. On decay may provide some [christmas essence].',
		icon:[choose([6,7]),10,'seasonal'],
		category:'seasonal',
		hidden:true,
		tick:function(me,tick){
			var toSpoil=me.amount*0.01;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			if(G.getRes('christmas essence').amount < (G.getRes('christmas essence limit').amount-spent)){
				
			G.gain('christmas essence',randomFloor(toSpoil)/6,'festive ornament decay');
			};
		},
	});
		new G.Res({
		name:'festive light',
		desc:'Used to decor streets, houses, hovels and other buildings. Brings festivity to your civilization. On decay may provide some [christmas essence].',
		icon:[choose([6,7]),11,'seasonal'],
		category:'seasonal',
		hidden:true,
		tick:function(me,tick){
			var toSpoil=me.amount*0.007;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
			if(G.getRes('christmas essence').amount < (G.getRes('christmas essence limit').amount-spent)){
			G.gain('christmas essence',randomFloor(toSpoil)/4,'festive light decor decay');
			};
		},
	});
		new G.Res({
		name:'snowman',
		desc:'Used to decor streets, houses, hovels and other buildings. Brings festivity to your civilization. On decay may provide some [christmas essence].',
		icon:[12,10,'seasonal'],
		category:'seasonal',
		hidden:true,
		tick:function(me,tick){
			var toSpoil=me.amount*0.011;
			var spent=G.lose(me.name,randomFloor(toSpoil),'decay');
		},
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
		{id:'trial',name:'Trial'},
		{id:'underworld',name:'Underworld'},
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
				
				if (changed>0 && me.unit.name!='thief hunter' && me.unit.name!='corpse slayer') G.Message({type:'bad',mergeId:'unitGotConverted-'+me.unit.name,textFunc:function(args){
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
			{type:'gather',context:'gather',amount:2,max:4},
			{type:'gather',context:'gather',what:{'herb':4.5},req:{'herbalism':false}},//To keep early game possible
			//{type:'gather',context:'gather',what:{'water':1,'muddy water':1},amount:1,max:3,req:{'gathering focus':'water'}},
			{type:'gather',context:'gather',what:{'water':1,'muddy water':1},amount:1,max:3},
			{type:'gather',context:'gather',what:{'herb':0.5,'fruit':0.5},amount:1,max:1,req:{'plant lore':true}},
			{type:'addFree',what:{'worker':0.1},req:{'scavenging':true}},
			{type:'mult',value:1.2,req:{'harvest rituals':'on'}},
			{type:'mult',value:1.075,req:{'Focused gathering':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.125,req:{'Focused gathering':true,'<font color="maroon">Caretaking</font>':true}},
			{type:'mult',value:0.8,req:{'se12':'on'}},
			{type:'mult',value:0.85,req:{'se07':'on'}},
			//Trend things aren't/shouldn't be affected by multiplier. here come trend effects
			{type:'gather',context:'gather',what:{'Sugar cane':0.022},req:{'gt1':true,'gt1u2':false}},
			{type:'gather',context:'gather',what:{'fruit':0.022},req:{'gt2':true,'gt2u2':false}},
			{type:'gather',context:'gather',what:{'Sugar cane':0.035},req:{'gt1u2':true}},
			{type:'gather',context:'gather',what:{'fruit':0.035},req:{'gt2u2':true}},
			//Random trends
			{type:'gather',context:'gather',what:{'stick':0.035},req:{'gtt1':true}},
			{type:'gather',context:'gather',what:{'water':0.035},req:{'gtt2':true}},
		],
		req:{'tribalism':true,'t4':false},
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
			{type:'provide',what:{'housing':3},req:{'oral tradition':true}},
			{type:'gather',what:{'insight':0.04},req:{'philosophy':false,'symbolism':true}},
			{type:'gather',what:{'insight':0.05},req:{'philosophy':true,'symbolism':true,'symbolism II':false}},
			{type:'gather',what:{'insight':0.07},req:{'symbolism II':true}},
			{type:'mult',value:1.2,req:{'wisdom rituals':'on','ritualism II':false}},
			{type:'mult',value:1.25,req:{'wisdom rituals':'on','ritualism II':true}},
			{type:'mult',value:1.05,req:{'Knowledgeable':true}},
			{type:'mult',value:2/3,req:{'dt18':true}},
			{type:'mult',value:0.1,req:{'Eotm':true}},
			{type:'mult',value:1.5,req:{'se12':'on'}},
			{type:'mult',value:0.75,req:{'se11':'on'}},
			{type:'mult',value:0.95,req:{'se03':'on'}},
		],
		req:{'speech':true,'t1':false/*Patience trial condition*/},
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
			{type:'addFree',what:{'worker':0.0005},req:{'<font color=" ##00C000">Artistic gray cells</font>':true,'oral tradition':true}},
			{type:'gather',what:{'culture':0.05},req:{'symbolism':true,'symbolism II':false}},
			{type:'gather',what:{'culture':0.07},req:{'symbolism II':true}},
			{type:'mult',value:1.3,req:{'artistic thinking':true}},
			{type:'mult',value:1.2,req:{'wisdom rituals':'on','ritualism II':false}},
			{type:'mult',value:1.25,req:{'wisdom rituals':'on','ritualism II':true}},
			{type:'mult',value:1.05,req:{'Cultural forces arise':true}},
			{type:'mult',value:0.1,req:{'Eotm':true}},
			{type:'mult',value:0.9,req:{'se12':'on'}},
			{type:'mult',value:2,req:{'se03':'on'}},
		],
		req:{'oral tradition':true,'t3':false/*Cultural trial condition*/},
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
			'stone tools':{name:'Craft stone tools',icon:[1,9],desc:'Turn [stone]s and [stick]s into [stone tools].',req:{'tool-making':true,'tool rafinery 2/2':false,'manufacture units II':false,'factories II':false},use:{'knapped tools':1}},
			'stone weapons':{name:'Craft stone weapons',icon:[5,9],desc:'Turn [stone]s and [stick]s into [stone weapons].',req:{'spears':true,'tool rafinery 2/2':false,'manufacture units II':false,'factories II':false},use:{'knapped tools':1}},
			'bows':{name:'Craft bows',icon:[6,9],desc:'Turn [stone]s and [stick]s into [bow]s.',req:{'bows':true,'manufacture units II':false,'factories II':false},use:{'stone tools':1}},
			'baskets':{name:'Weave baskets',icon:[14,7],desc:'Turn [stick]s into [basket]s.',req:{'basket-weaving':true,'manufacture units II':false,'factories II':false},use:{'knapped tools':1}},
			'craftwands':{name:'Craft wands',icon:[6,4,'magixmod'],desc:'Your artisan will craft tool used by wizards. It is not any junk tool.',req:{'Wizardry':true},use:{'stone tools':2}},
			'craftink':{name:'Craft ink',icon:[18,6,'magixmod'],desc:'Your artisan will craft [Ink]. Will use water and dark dyes.',req:{'Ink crafting':true}},
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
			//NO KNAPPING ANYMORE EFFECT
			{type:'mult',value:0.05,req:{'no knapping anymore':true,'<font color="maroon">Moderation</font>':true},mode:'knap'},
			{type:'mult',value:0.05,req:{'no knapping anymore':true,'<font color="maroon">Moderation</font>':true},mode:'knap bone'},
			{type:'mult',value:0.15,req:{'no knapping anymore':true,'<font color="maroon">Caretaking</font>':true},mode:'knap'},
			{type:'mult',value:0.15,req:{'no knapping anymore':true,'<font color="maroon">Caretaking</font>':true},mode:'knap bone'},
			//////////
			{type:'convert',from:{'stick':1,'stone':1},into:{'stone tools':1},every:8,mode:'stone tools',req:{'tool rafinery 2/2':false,'manufacture units II':false,'factories II':false}},
			{type:'convert',from:{'stick':1,'stone':1},into:{'stone weapons':1},every:8,mode:'stone weapons',req:{'tool rafinery 2/2':false,'manufacture units II':false,'factories II':false}},
			{type:'convert',from:{'stick':1,'stone':1},into:{'bow':1},every:10,mode:'bows',req:{'tool rafinery 2/2':false,'manufacture units II':false,'factories II':false}},
			{type:'convert',from:{'stick':15},into:{'basket':1},every:10,mode:'baskets',req:{'tool rafinery 2/2':false,'manufacture units II':false,'factories II':false}},
			{type:'convert',from:{'stick':4,'stone':2},into:{'Wand':1},every:5,mode:'craftwands'},
			{type:'convert',from:{'Dyes':1,'mud':0.0015,'water':0.015},into:{'Ink':0.75},every:4,mode:'craftink'},
			{type:'convert',from:{'Thread':35,'Dried leather':1},into:{'Fishing net':1},every:5,mode:'craftnet'},
			{type:'convert',from:{'Thread':1.5,'herb':0.75},into:{'First aid things':1},every:5,mode:'craftfirstaid'},
       			{type:'convert',from:{'Thread':0.5,'herb':1},into:{'First aid things':1},every:5,mode:'craftfirstaid'},
       			{type:'convert',from:{'Thread':2,'herb':1.5,'hide':1},into:{'First aid things':1},every:7,mode:'craftfirstaid'},
			{type:'convert',from:{'Lavender':2},into:{'Dyes':1},every:5,mode:'dyes1'},
        		{type:'convert',from:{'Salvia':3},into:{'Dyes':1},every:5,mode:'dyes1'},
        		{type:'convert',from:{'Bachelor\'s button':2},into:{'Dyes':1},every:5,mode:'dyes1'},
       			{type:'convert',from:{'Desert rose':2},into:{'Dyes':1},every:5,mode:'dyes1'},
        		{type:'convert',from:{'Cosmos':2},into:{'Dyes':1},every:5,mode:'dyes1'},
       			{type:'convert',from:{'Pink rose':3},into:{'Dyes':1},every:5,mode:'dyes1'},
        		{type:'convert',from:{'Pink tulip':2},into:{'Dyes':1},every:5,mode:'dyes1'},
        		{type:'convert',from:{'Coreopsis':2},into:{'Dyes':1},every:5,mode:'dyes1'},
        		{type:'convert',from:{'Crown imperial':2},into:{'Dyes':1},every:5,mode:'dyes2'},
       			{type:'convert',from:{'Cyan rose':2},into:{'Dyes':1},every:5,mode:'dyes2'},
        		{type:'convert',from:{'Himalayan blue poopy':2},into:{'Dyes':1},every:5,mode:'dyes2'},
       			{type:'convert',from:{'Cockscomb':2},into:{'Dyes':1},every:5,mode:'dyes2'},
        		{type:'convert',from:{'Red tulip':2},into:{'Dyes':1},every:5,mode:'dyes2'},
        		{type:'convert',from:{'Green Zinnia':3},into:{'Dyes':1},every:5,mode:'dyes2'},
        		{type:'convert',from:{'cactus':2},into:{'Dyes':1},every:5,mode:'dyes2'},
        		{type:'convert',from:{'Lime rose':2},into:{'Dyes':1},every:5,mode:'dyes2'},
        		{type:'convert',from:{'Lime tulip':2},into:{'Dyes':1},every:5,mode:'dyes3'},
        		{type:'convert',from:{'Azure bluet':4},into:{'Dyes':1},every:5,mode:'dyes3'},
       			{type:'convert',from:{'Daisy':2},into:{'Dyes':1},every:5,mode:'dyes3'},
        		{type:'convert',from:{'Sunflower':1},into:{'Dyes':1},every:7,mode:'dyes3'},
        		{type:'convert',from:{'Dandelion':2},into:{'Dyes':1},every:5,mode:'dyes3'},
        		{type:'convert',from:{'Black lily':3},into:{'Dyes':1},every:5,mode:'dyes3'},
        		{type:'convert',from:{'Black Hollyhock':2},into:{'Dyes':1},every:5,mode:'dyes3'},
        		{type:'convert',from:{'Cattail':2},into:{'Dyes':1},every:5,mode:'dyes3'},
			{type:'convert',from:{'stick':3,'stone':2},into:{'Crossbow':1},every:5,req:{'Hunting II':true,'manufacture units II':false,'factories II':false},mode:'bows'},
        		{type:'convert',from:{'lumber':1,'stone':25},into:{'Crossbow belt':20},every:5,req:{'Hunting II':true,'manufacture units II':false,'factories II':false},mode:'bows'},
    			{type:'convert',from:{'Flax':3},into:{'Dyes':1},every:5,mode:'dyes4'},
        		{type:'convert',from:{'Blue orchid':2},into:{'Dyes':1},every:5,mode:'dyes4'},
        		{type:'convert',from:{'White tulip':2},into:{'Dyes':1},every:5,mode:'dyes4'},
        		{type:'convert',from:{'Lily of the Valley':3},into:{'Dyes':1},every:5,mode:'dyes4'},
        		{type:'convert',from:{'Brown flower':2},into:{'Dyes':1},every:5,mode:'dyes4'},
        		{type:'convert',from:{'Gray rose':3},into:{'Dyes':1},every:5,mode:'dyes4'},
       		 	{type:'convert',from:{'Gray tulip':2},into:{'Dyes':1},every:5,mode:'dyes4'},
        		{type:'convert',from:{'Paper':30,'hide':1},into:{'Empty book':1},every:7,mode:'craftbook'},
			{type:'convert',from:{'Magic essences':2,'Beet seeds':1,'Mana':0.5},into:{'Essenced seeds':1},every:7,mode:'enchseeds'},
			{type:'mult',value:1.2,req:{'ground stone tools':true}},
			{type:'mult',value:1.08,req:{'Motivation for artisans':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.04,req:{'Motivation for artisans':true,'<font color="maroon">Caretaking</font>':true}},
			{type:'mult',value:1.03,req:{'Crafting & farm rituals':'on','power of the faith':true}},
			{type:'mult',value:1.03,req:{'xmas1':true}},
			{type:'mult',value:0.915,req:{'se09':'on'}},
		],
		req:{'stone-knapping':true,'t10':false},
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
			{type:'mult',value:1.03,req:{'xmas4':true}},
			{type:'mult',value:1.06,req:{'Inspirated carvers':true,'<font color="maroon">Caretaking</font>':true}},
			////////////////////
			//MOAI BOOSTS
			{type:'mult',value:1.03,req:{'se09':'on'},mode:'stone statuettes'},
			{type:'mult',value:1.03,req:{'se09':'on'},mode:'cut stone'},
			{type:'mult',value:1.03,req:{'se09':'on'},mode:'smash cut stone'},
			{type:'mult',value:1.03,req:{'se09':'on'},mode:'gdablockscraft'},
			{type:'mult',value:1.03,req:{'se09':'on'},mode:'gdablockssmash'},
			/////////////
			//Trends
			{type:'convert',from:{'stone':0.05},into:{'statuette':0.05},every:5,mode:'stone statuettes',req:{'cart1':true}},
			{type:'convert',from:{'log':0.05},into:{'Wooden statuette':0.05},every:5,mode:'wood statuettes',req:{'cart2':true}},
		],
		req:{'carving':true,'t10':false},
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
			{type:'mult',value:1.03,req:{'xmas2':true}},
			],
		req:{'sewing':true,'t10':false},
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
			//SPEARS
			{type:'gather',context:'hunt',amount:2,max:4,mode:'spear hunting',req:{'aiming':false}},
			{type:'gather',context:'hunt',amount:2.5,max:5,mode:'spear hunting',req:{'aiming':true}},
			//BOW
			{type:'gather',context:'hunt',amount:1.6,max:2,mode:'bow hunting',req:{'aiming':false}},
			{type:'gather',context:'hunt',amount:4,max:5,mode:'bow hunting',req:{'aiming':true}},
			//CROSSBOW
			{type:'gather',context:'hunt',amount:1.8,max:2.2,mode:'crossbow hunting',req:{'aiming':false}},
			{type:'gather',context:'hunt',amount:4.5,max:5.5,mode:'crossbow hunting',req:{'aiming':true}},
			
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.03,'[X] [people] wounded while hunting.','hunter was','hunters were'),chance:1/30,req:{'hunting III':false}},
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.03,'[X] [people] wounded while hunting.','hunter was','hunters were'),chance:1/38,req:{'hunting III':true,'An armor for Hunter':true,'Hunters & fishers unification':false}},
			{type:'mult',value:1.2,req:{'harvest rituals':'on','Hunters & fishers unification':false}},
			{type:'mult',value:0,req:{'Hunters & fishers unification':true}},
			//Trait trends
			{type:'gather',context:'hunt',what:{'hide':1},req:{'htt1':true}},
			{type:'gather',context:'hunt',what:{'meat':1},req:{'htt2':true}},
		],
		req:{'hunting':true,'t10':false},
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
			{type:'gather',context:'fish',amount:1.5,max:5,mode:'catch by hand'},
			//SPEARS
			{type:'gather',context:'fish',amount:2,max:4,mode:'spear fishing',req:{'aiming':false}},
			{type:'gather',context:'fish',amount:2.5,max:5,mode:'spear fishing',req:{'aiming':true}},
			//LINE
			{type:'gather',context:'fish',amount:4,max:5,mode:'line fishing'},
			{type:'gather',context:'fish',what:{'seafood':6},amount:6,max:8,mode:'net fishing'},
			{type:'mult',value:1.2,req:{'harvest rituals':'on','Hunters & fishers unification':false}},
			{type:'mult',value:0,req:{'Hunters & fishers unification':true}},
		],
		req:{'fishing':true,'t4':false},
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
			{type:'convert',from:{'clay':4,'mud':11,'fire pit':0.025},into:{'Potion pot':1},every:3,repeat:1,mode:'craft potion pots'},
			{type:'mult',value:1.03,req:{'xmas3':true}},
		],
		req:{'pottery':true,'t10':false},
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
		req:{'masonry':true,'t10':false},
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
			{type:'mult',value:1.05,req:{'Deeper wells':true}},
			{type:'mult',value:0.85,req:{'se09':'on'}},
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
			{type:'gather',context:'dig',what:{'clay':5},max:1,req:{'pottery':true}},
			{type:'mult',value:1.125,req:{'Enchanted shovels':true}},
			{type:'mult',value:1.02,req:{'se09':'on'}},
			//Trends
			{type:'gather',context:'dig',what:{'clay':0.85},req:{'dit1':true,'dit1u2':false}},
			{type:'gather',context:'dig',what:{'mud':0.85},req:{'dit2':true,'dit2u2':false}},
			{type:'gather',context:'dig',what:{'clay':1.2},req:{'dit1u2':true}},
			{type:'gather',context:'dig',what:{'mud':1.2},req:{'dit2u2':true}},
			//Random trends
			{type:'gather',context:'dig',what:{'ice':1},req:{'dtt1':true}},
			{type:'gather',context:'dig',what:{'sand':1},req:{'dtt2':true}},
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
			'quarrydeepores':{name:'Quarry deep for minerals',icon:[8,12,33,30,'magixmod'],desc:'Quarry for resources that are in Deep Quarrying territory context. In this mode you will gather 3x more ores but 6x less resources other than ores.',req:{'prospecting III':true},use:{'worker':8,'metal tools':8}},
		},
		effects:[
			{type:'gather',context:'quarry',amount:5,max:10,every:3,mode:'quarry'},
			{type:'gather',context:'quarry',what:{'cut stone':1},max:5,notMode:'off'},
			{type:'gather',context:'mine',amount:0.005,max:0.05,notMode:'off'},
			{type:'gather',context:'quarry',amount:10,max:30,every:3,mode:'advanced quarry'},
			{type:'gather',context:'quarry',what:{'Various cut stones':5},mode:'quarryotherstones'},
			{type:'gather',context:'quarry',what:{'oil':13},req:{'Oil-digging':true}},
			//deepquarry
			{type:'gather',context:'quarry',what:{'cut stone':0.17},max:0.88,mode:'quarrydeepores'},
			{type:'gather',context:'quarry',what:{'Various cut stones':0.17},max:0.88,mode:'quarrydeepores'},
			{type:'gather',context:'quarry',what:{'lead ore':10},max:30,mode:'quarrydeepores'},
			{type:'gather',context:'quarry',what:{'blackium ore':10},max:30,mode:'quarrydeepores'},
			{type:'gather',context:'quarry',what:{'mythril ore':10},max:30,mode:'quarrydeepores'},
			{type:'gather',context:'quarry',what:{'unknownium ore':10},max:30,mode:'quarrydeepores'},
			{type:'gather',context:'quarry',what:{'salt':1},max:3,mode:'quarrydeepores',chance:1/6},
			/////
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.01,'[X] [people].','quarry collapsed, wounding its workers','quarries collapsed, wounding their workers'),chance:1/50}
		],
		gizmos:true,
		req:{'quarrying':true,'t10':false},
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
			'any(deepmine)':{name:'Any',icon:[24,18,'magixmod',8,8],desc:'Mine without focusing on specific ores way deeper.',use:{'worker':6,'metal tools':6},req:{'mining II':true}},
			'coal':{name:'Coal',icon:[12,8],desc:'Mine for [coal] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'salt':{name:'Salt',icon:[11,7],desc:'Mine for [salt].',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'copper':{name:'Copper',icon:[9,8],desc:'Mine for [copper ore] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'tin':{name:'Tin',icon:[13,8],desc:'Mine for [tin ore] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'iron':{name:'Iron',icon:[10,8],desc:'Mine for [iron ore] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'gold':{name:'Gold',icon:[11,8],desc:'Mine for [gold ore] with x5 efficiency.',req:{'prospecting':true},use:{'worker':3,'metal tools':3}},
			'zinc':{name:'Zinc',icon:[11,3,'magixmod'],desc:'Mine for [zinc ore] with x5 efficiency.',req:{'prospecting III':true},use:{'worker':3,'metal tools':3}},
			'dinium':{name:'Dinium',icon:[11,5,'magixmod'],desc:'Mine for [dinium ore] with x3 efficiency.',req:{'prospecting III':true},use:{'worker':3,'metal tools':3}},
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
			{type:'gather',context:'mine',what:{'zinc ore':50},max:10,mode:'zinc'},
			{type:'gather',context:'mine',what:{'dinium ore':30},max:10,mode:'dinium'},
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
			///////
			//Deepmining
			{type:'gather',context:'mine',what:{'iron ore':50},max:30,mode:'iron'},
			/////////////////////////
			//MOAI BOOSTS
			{type:'mult',value:1.25,req:{'se09':'on'},mode:'tin'},
			{type:'mult',value:1.25,req:{'se09':'on'},mode:'coal'},
			{type:'mult',value:1.25,req:{'se09':'on'},mode:'salt'},
			{type:'mult',value:1.25,req:{'se09':'on'},mode:'copper'},
			{type:'mult',value:1.25,req:{'se09':'on'},mode:'iron'},
			{type:'mult',value:1.25,req:{'se09':'on'},mode:'gold'},
			//////////////////////////
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.01,'[X] [people].','mine collapsed, wounding its miners','mines collapsed, wounding their miners'),chance:1/50,req:{'Mining strategy':false}},
			{type:'function',func:unitGetsConverted({'wounded':1},0.001,0.01,'[X] [people].','mine collapsed, wounding its miners','mines collapsed, wounding their miners'),chance:1/70,req:{'Mining strategy':true}},
			//////////////////////////
			//Trends
			{type:'gather',context:'mine',what:{'coal':5},max:30,mode:'coal',req:{'mt1':true}},
			{type:'gather',context:'mine',what:{'salt':5},max:30,mode:'salt',req:{'mt2':true}},
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
			'cobalt':{name:'Cobalt smelting',icon:[14,0,'magixmod'],desc:'Cast 1 [Cobalt ingot] out of 8[Cobalt ore].',req:{'Cobalt-working':true},use:{'worker':2,'metal tools':2,'stone tools':1}},
	  		'nickel':{name:'Nickel smelting',icon:[10,9],desc:'Cast 1 [hard metal ingot] out of 6[nickel ore]s each.',req:{'prospecting II':true,'nickel-working':true},use:{'worker':2,'metal tools':2}},
			'platinum':{name:'Platinum smelting',icon:[3,11,'magixmod'],desc:'Cast 1 [platinum ingot] out of 5[platinum ore]s each.',req:{'prospecting II':true,'platinum-working':true},use:{'worker':2,'metal tools':2}}, 
			//deep quarrymining
			'osmium':{name:'Osmium smelting',icon:[9,9],desc:'Cast [soft metal ingot]s out of 4 [osmium ore]s each.',req:{'deep mining & quarrying':true,'osmium-working':true,'furnace modernization':true},use:{'metal tools':2,'worker':2}},
			'lead':{name:'Lead smelting',icon:[10,9],desc:'Cast [hard metal ingot]s out of 6 [lead ore]s each.',req:{'deep mining & quarrying':true,'lead-working':true,'furnace modernization':true},use:{'metal tools':2,'worker':2}},
  			'mythril':{name:'Mythril smelting',icon:[11,6,'magixmod'],desc:'Cast [mystical metal ingot]s out of 6 [mythril ore]s and 1 [gold ore] each.',req:{'deep mining & quarrying':true,'mythril-working':true,'furnace modernization':true},use:{'metal tools':2,'worker':2}},
			'blackium':{name:'Blackium alloying',icon:[12,9],desc:'Cast [strong metal ingot]s out of 6 [blackium ore]s each.',req:{'deep mining & quarrying':true,'blackium-working':true,'furnace modernization':true},use:{'metal tools':2,'worker':2}},
 			'zinc':{name:'Zinc smelting',icon:[10,9],desc:'Cast [hard metal ingot]s out of 7 [zinc ore]s each.',req:{'deep mining & quarrying':true,'zinc-working':true,'furnace modernization':true},use:{'metal tools':2,'worker':2}},
			'unk':{name:'Dinium & unknownium alloying',icon:[11,6,'magixmod'],desc:'Cast 2 [mystical metal ingot]s out of 4 [dinium ore]s , 3 [copper ore]s , 1 [coal] and 4 [unknownium ore] each. Chance to succed: 95%',req:{'deep mining & quarrying':true,'dinium & unknownium working':true,'furnace modernization':true},use:{'metal tools':2,'worker':2}},
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
			//Deep ores
			{type:'convert',from:{'osmium ore':4},into:{'hard metal ingot':1},every:5,mode:'osmium'},
			{type:'convert',from:{'lead ore':6},into:{'hard metal ingot':1},every:5,mode:'lead'},
  			{type:'convert',from:{'mythril ore':6,'gold ore':1},into:{'mystical metal ingot':1},every:5,mode:'mythril'},
 			{type:'convert',from:{'blackium ore':6},into:{'strong metal ingot':1},every:5,mode:'blackium'},
  			{type:'convert',from:{'zinc ore':7},into:{'hard metal ingot':1},every:5,mode:'zinc'},
			{type:'convert',from:{'dinium ore':4,'copper ore':3,'coal':1,'unknownium ore':4},into:{'mystical metal ingot':2},every:3,mode:'unk',chance:95/100},
			//Mults
			{type:'mult',value:0.95,req:{'dt4':true},mode:'gold'},
			{type:'mult',value:0.95,req:{'dt5':true},mode:'iron'},
			{type:'mult',value:0.95,req:{'dt5':true},mode:'bronze'},
			{type:'mult',value:0.95,req:{'dt5':true},mode:'nickel'},
			{type:'mult',value:0.95,req:{'dt6':true},mode:'tin'},
			{type:'mult',value:0.95,req:{'dt6':true},mode:'copper'},
			{type:'waste',chance:0.001/1000,req:{'construction III':false}},
			{type:'waste',chance:0.0002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.00014/1000,req:{'improved construction':true}},
			{type:'mult',value:1.2,req:{'Improved furnace construction':true,'<font color="maroon">Moderation</font>':true}},
			{type:'mult',value:1.1,req:{'Improved furnace construction':true,'<font color="maroon">Caretaking</font>':true}},
		],
		gizmos:true,
		req:{'smelting':true,'t10':false},
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
			'gold blocks':{name:'Forge gold blocks',icon:[14,8],desc:'Forge [gold block]s out of 10 [precious metal ingot]s each.',use:{'worker':1,'stone tools':1},req:{'gold-working':true,'block-smithery':false}},
			'forgeweapon':{name:'Forge weapons out of soft metals',icon:[15,11,'magixmod'],desc:'Forge [metal weapons] out of 2[soft metal ingot]s each.',req:{'Weapon blacksmithery':true},use:{'worker':1,'metal tools':1,'stone tools':1}},  
			'forgeweaponhard':{name:'Forge weapons out of hard metals',icon:[15,11,'magixmod'],desc:'Forge [metal weapons] out of 1[hard metal ingot] each.',req:{'Weapon blacksmithery':true},use:{'worker':1,'metal tools':1,'stone tools':1}},
			'forgearmor':{name:'Forge armor out of soft metals',icon:[16,11,'magixmod'],desc:'Forge [armor set] out of 8[soft metal ingot]s each.',req:{'Armor blacksmithery':true},use:{'worker':1,'metal tools':1,'stone tools':1,'Instructor':0.25}},
			'forgearmorhard':{name:'Forge armor out of hard metals',icon:[16,11,'magixmod'],desc:'Forge [armor set] out of 5[hard metal ingot] each.',req:{'Armor blacksmithery':true},use:{'worker':1,'metal tools':1,'stone tools':1,'Instructor':0.25}},
			'platinum blocks':{name:'Craft platinum blocks',icon:[4,11,'magixmod'],desc:'Forge [platinum block]s out of 10[platinum ingot] each.',req:{'platinum-working':true,'block-smithery':false},use:{'worker':1,'metal tools':1,'stone tools':1}},
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
			{type:'mult',value:0,req:{'block-smithery':true},mode:'gold blocks'},
			{type:'mult',value:0,req:{'block-smithery':true},mode:'platinum block'},
			{type:'convert',from:{'platinum ingot':10},into:{'platinum block':1},every:4,mode:'platinum blocks'},
			{type:'convert',from:{'hard metal ingot':11},into:{'Basic factory equipment':1},every:4,mode:'factgear'},
			{type:'mult',value:0.95,req:{'dt1':true}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on','power of the faith':true}},
			{type:'waste',chance:0.001/1000,req:{'construction III':false}},
			{type:'waste',chance:0.0002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.00014/1000,req:{'improved construction':true}},
			//TODO : better metal tools, weapons etc
		],
		gizmos:true,
		req:{'smelting':true,'t10':false},
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
		req:{'woodcutting':true,'t10':false},
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
			{type:'waste',chance:0.001/1000,req:{'construction III':false}},
			{type:'waste',chance:0.0002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.00014/1000,req:{'improved construction':true}},
		],
		gizmos:true,
		req:{'carpentry':true,'t10':false},
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
			{type:'gather',what:{'faith':0.012,'happiness':0.07},chance:1/9.25,req:{'enlightenment':false,'Eotm':false}},
			{type:'gather',what:{'faith':0.012,'happiness':0.07},chance:1/7.25,req:{'enlightenment':true,'Eotm':false}},
			{type:'gather',what:{'faith':0.012,'happiness':0.07},chance:1/9.25,req:{'enlightenment':true,'Eotm':true}},
			{type:'gather',what:{'faith':0.01},req:{'symbolism':true,'symbolism II':false},chance:1/6.5},
			{type:'gather',what:{'faith':0.014},req:{'symbolism II':true},chance:1/6.5},
			{type:'mult',value:2/3,req:{'dt16':true}},
			{type:'mult',value:0.1,req:{'se03':'on'}},
			{type:'mult',value:1.25,req:{'se11':'on'}},
			{type:'mult',value:0.95,req:{'se03':'on'}},
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
			{type:'mult',value:1.25,req:{'se07':'on'}},
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
		req:{'chieftains':true,'t3':false/*Cultural trial condition*/},
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
		req:{'clans':true,'t3':false/*Cultural trial condition*/},
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
			{type:'waste',chance:1/1000,req:{'construction III':false}},
			{type:'waste',chance:0.2/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.14/1000,req:{'improved construction':true}},
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
			{type:'waste',chance:3/1000,req:{'construction III':false}},
			{type:'waste',chance:0.6/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.42/1000,req:{'improved construction':true}},
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
			{type:'waste',chance:0.03/1000,req:{'construction III':false}},
			{type:'waste',chance:0.006/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.0042/1000,req:{'improved construction':true}},
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
			{type:'waste',chance:0.01/1000,req:{'construction III':false}},
			{type:'waste',chance:0.02/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.14/1000,req:{'improved construction':true}},
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
			{type:'provide',what:{'added food storage':140,'added material storage':140},req:{'well stored':true}},
			{type:'provide',what:{'added food storage':220,'added material storage':200},req:{'well stored 2':true}},
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
			{type:'provide',what:{'added material storage':350},req:{'well stored':true}},
			{type:'provide',what:{'added material storage':550},req:{'well stored 2':true}},
			{type:'waste',chance:0.1/1000,req:{'construction III':false}},
			{type:'waste',chance:0.02/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.014/1000,req:{'improved construction':true}},
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
			{type:'provide',what:{'added material storage':1400},req:{'well stored':true}},
			{type:'provide',what:{'added material storage':2200},req:{'well stored 2':true}},
			{type:'waste',chance:0.001/1000,req:{'construction III':false}},
			{type:'waste',chance:0.0002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.00014/1000,req:{'improved construction':true}},
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
			{type:'provide',what:{'added food storage':200},req:{'Spell of capacity':true}},
			{type:'provide',what:{'added food storage':350},req:{'well stored':true}},
			{type:'provide',what:{'added food storage':550},req:{'well stored 2':true}},
			{type:'waste',chance:0.01/1000,req:{'construction III':false}},
			{type:'waste',chance:0.002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.0014/1000,req:{'improved construction':true}},
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
			{type:'provide',what:{'added food storage':1400},req:{'well stored':true}},
			{type:'provide',what:{'added food storage':2200},req:{'well stored 2':true}},
			{type:'waste',chance:0.001/1000,req:{'construction III':false}},
			{type:'waste',chance:0.0002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.00014/1000,req:{'improved construction':true}},
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
			'gatherers':{name:'Gatherer\'s lodge',icon:[0,2],desc:'Hire [gatherer]s until there are 6 for each of this lodge.',req:{'tribalism':true}},
			'hunters':{name:'Hunter\'s lodge',icon:[18,2],desc:'Hire [hunter]s until there are 6 for each of this lodge.',req:{'hunting':true}},
			'fishers':{name:'Fisher\'s lodge',icon:[17,2],desc:'Hire [fisher]s until there are 6 for each of this lodge.',req:{'fishing':true}},
			'diggers':{name:'Digger\'s lodge',icon:[7,2],desc:'Hire [digger]s until there are 6 for each of this lodge.',req:{'digging':true}},
			'woodcutters':{name:'Woodcutter\'s lodge',icon:[8,2],desc:'Hire [woodcutter]s until there are 6 for each of this lodge.',req:{'woodcutting':true}},
			'artisans':{name:'Artisan\'s lodge',icon:[6,2],desc:'Hire [artisan]s until there are 6 for each of this lodge.',req:{'stone-knapping':true}},
			'florists':{name:'Florist\'s lodge',icon:[7,11,'magixmod'],desc:'Hire [Florist]s until there are 6 for each of this lodge.',req:{'plant lore':true}},
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
			'potters':{name:'Potters\' guild',icon:[20,2],desc:'Hire [potter]s until there are 5 for each of this guild.',req:{'pottery':true}},
			'carpenters':{name:'Carpenters\' guild',icon:[27,2,25,2],desc:'Build [carpenter workshop]s until there are 5 for each of this guild.',req:{'carpentry':true}},
			'blacksmiths':{name:'Blacksmiths\' guild',icon:[26,2,25,2],desc:'Build [blacksmith workshop]s until there are 5 for each of this guild.',req:{'smelting':true}},
			'hunters':{name:'Thief hunters\' & Corpse slayers guild',icon:[4,13,'magixmod'],desc:'Hire [Thief hunter]s and [corpse slayer]s until there are 25 for each of this guild.',req:{'guilds unite':true,'Battling thieves':true}},
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
			{type:'mult',value:2.5,req:{'t10':true}},
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
			{type:'mult',value:2.5,req:{'t10':true}},
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
		req:{'monument-building':true,'trial':false},
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
			({type:'convert',from:{'Lavender':2},into:{'Dyes':6},every:2}),
		({type:'convert',from:{'Salvia':6},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Bachelor\'s button':6},into:{'Dyes':2},every:2}),
		({type:'convert',from:{'Desert rose':6},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Cosmos':4},into:{'Dyes':2},every:2}),
		({type:'convert',from:{'Pink rose':6},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Pink tulip':4},into:{'Dyes':2},every:2}),
		({type:'convert',from:{'Coreopsis':4},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Crown imperial':4},into:{'Dyes':2},every:2}),
		({type:'convert',from:{'Cyan rose':4},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Himalayan blue poopy':4},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Cockscomb':4},into:{'Dyes':2},every:2}),
		({type:'convert',from:{'Red tulip':4},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Green Zinnia':6},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'cactus':4},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Lime rose':4},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Lime tulip':4},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Azure bluet':8},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Daisy':4},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Sunflower':2},into:{'Dyes':2},every:4}),
		({type:'convert',from:{'Dandelion':4},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Black lily':6},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Black Hollyhock':4},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Cattail':4},into:{'Dyes':2},every:3}),
		({type:'convert',from:{'Flax':3},into:{'Dyes':1},every:3}),
		({type:'convert',from:{'Blue orchid':2},into:{'Dyes':1},every:3}),
		({type:'convert',from:{'White tulip':2},into:{'WDyes':1},every:3}),
		({type:'convert',from:{'Lily of the Valley':3},into:{'Dyes':1},every:3}),
		({type:'convert',from:{'Brown flower':2},into:{'Dyes':1},every:3}),
		({type:'convert',from:{'Gray rose':3},into:{'Dyes':1},every:3}),
		({type:'convert',from:{'Gray tulip':2},into:{'Dyes':1},every:3}),
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
			{type:'function',func:unitGetsConverted({'wounded':1,'soldiers defeats':1},0.001,0.03,'','',''),chance:1/50,req:{'coordination':true}},
			{type:'function',func:unitGetsConverted({'wounded':1,'soldiers defeats':1},0.001,0.03,'','',''),chance:1/25,req:{'coordination':false}},
		],
	});
		new G.Unit({
		name:'Bakery',
		desc:'@converts crafted by [Windmill] [flour] into [bread]. Requires fuel to work.',
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
		desc:'@extracts ores, [coal] and [stone] out of the ground using <span style="color: #FF002a"> Dynamite</span> . <span style="color: #FF002a">Has even bigger chances to collapse due to used in work material</span><br>The workers in [mine]s blasts deep into the earth to provide all kinds of minerals. @cannot be [prospecting,prospected] like normal [mine] .',
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
		desc:'Allows to make [Paper] You can choose between 3 types of paper: <li>papyrus</li> <li>pergamin</li> <li>common paper</li> <font="color: ##FF6B40">It is paradise version of this shack and works at same rates as its mortal bro.</font><script src="main.js?v=13b"></script>',
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
		req:{'papercrafting':true,'Paradise crafting':true,'t10':false},
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
			{type:'mult',value:0.85,req:{'se09':'on'}},
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
			{type:'provide',what:{'added material storage':2100},req:{'well stored':true}},
			{type:'provide',what:{'added material storage':3300},req:{'well stored 2':true}},
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
			{type:'gather',what:{'science':0.0001}},
			{type:'gather',what:{'science':0.0000250},req:{'symbolism III':true}},
			{type:'mult',value:1.1,req:{'bonus1':true}},
			{type:'mult',value:1.11,req:{'bonus2':true}},
			{type:'mult',value:1.12,req:{'bonus3':true}},
			{type:'mult',value:1.13,req:{'bonus4':true}},
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
			{type:'provide',what:{'added food storage':1050,'added material storage':1050},req:{'well stored':true}},
			{type:'provide',what:{'added food storage':1650,'added material storage':1650},req:{'well stored 2':true}},
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
			{type:'waste',chance:0.0004/1000,req:{'construction III':false}},
			{type:'waste',chance:0.00008/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.000056/1000,req:{'improved construction':true}},
		],
		req:{'Mana brewery':true},
		category:'storage',
	});
		new G.Unit({
		name:'Fire essence storage',
		desc:'@One storage allows you to store 11500 [Fire essence] more<>A simple glass shielded storage with essence faucet. It is more tall than wide so that is why it consumes only 0.8 [land].',
		icon:[2,5,'magixmod'],
		cost:{'basic building materials':(100*((G.getUnitAmount('Fire essence storage')+1)/10)),'glass':(200*((G.getUnitAmount('Fire essence storage')+1)/8))},
		use:{'land':0.8},
		effects:[
			{type:'provide',what:{'fire essence limit':11500}},
			{type:'waste',chance:1/10000,req:{'construction III':false}},
			{type:'waste',chance:0.2/10000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.14/10000,req:{'improved construction':true}},
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
				{type:'waste',chance:1/10000,req:{'construction III':false}},
			{type:'waste',chance:0.2/10000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.14/10000,req:{'improved construction':true}},
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
				{type:'waste',chance:1/10000,req:{'construction III':false}},
			{type:'waste',chance:0.2/10000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.14/10000,req:{'improved construction':true}},
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
				{type:'waste',chance:1/10000,req:{'construction III':false}},
			{type:'waste',chance:0.2/10000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.14/10000,req:{'improved construction':true}},
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
				{type:'waste',chance:1/10000,req:{'construction III':false}},
			{type:'waste',chance:0.2/10000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.14/10000,req:{'improved construction':true}},
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
				{type:'waste',chance:1/10000,req:{'construction III':false}},
			{type:'waste',chance:0.2/10000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.14/10000,req:{'improved construction':true}},
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
				{type:'waste',chance:1/10000,req:{'construction III':false}},
			{type:'waste',chance:0.2/10000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.14/10000,req:{'improved construction':true}},
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
			{type:'mult',value:0.85,req:{'se09':'on'}},
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
			{type:'mult',value:1.25,req:{'se07':'on'}},
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
			{type:'mult',value:1.05,req:{'Magical presence':true}},
			{type:'mult',value:1.02,req:{'gt7':true}},
			{type:'mult',value:0.88,req:{'dt19':true}},
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
			{type:'mult',value:2,req:{'se03':'on'}},
		],
		req:{'oral tradition':true,'artistic thinking':true,'t3':false/*Cultural trial condition*/},
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
			{type:'mult',value:1.05,req:{'Magical presence':true}},
			{type:'mult',value:1.02,req:{'gt8':true}},
			{type:'mult',value:0.88,req:{'dt20':true}},
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
			{type:'mult',value:1.05,req:{'Magical presence':true}},
			{type:'mult',value:1.02,req:{'gt12':true}},
			{type:'mult',value:0.88,req:{'dt24':true}},
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
			{type:'mult',value:1.05,req:{'Magical presence':true}},
			{type:'mult',value:1.02,req:{'gt10':true}},
			{type:'mult',value:0.88,req:{'dt22':true}},
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
			{type:'mult',value:1.05,req:{'Magical presence':true}},
			{type:'mult',value:1.02,req:{'gt11':true}},
			{type:'mult',value:0.88,req:{'dt23':true}},
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
			{type:'mult',value:1.05,req:{'Magical presence':true}},
			{type:'mult',value:1.02,req:{'gt9':true}},
			{type:'mult',value:0.88,req:{'dt21':true}},
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
			{type:'waste',chance:0.01/1000,req:{'construction III':false}},
			{type:'waste',chance:0.002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.0014/1000,req:{'improved construction':true}},
			{type:'mult',value:0.95,req:{'se03':'on'}},
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
			{type:'waste',chance:0.003/1000,req:{'construction III':false}},
			{type:'waste',chance:0.0006/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.00042/1000,req:{'improved construction':true}},
			{type:'mult',value:1.25,req:{'se11':'on'}},
			{type:'mult',value:0.95,req:{'se03':'on'}},
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
			{type:'mult',value:2,req:{'se03':'on'}},
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
			{type:'waste',chance:0.0004/1000,req:{'construction III':false}},
			{type:'waste',chance:0.00008/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.000056/1000,req:{'improved construction':true}},
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
		req:{'construction':true,'Concrete making':true,'t10':false},
		category:'crafting',
	});
		new G.Unit({
		name:'Blockhouse',
		desc:'@provides 50 [housing]. Hardly constructed at the lands of Plain Island blockhouse has very low chance to be wasted.',
		icon:[9,1,'magixmod'],
		cost:{'concrete':6500,'glass':600,'basic building materials':750},
		use:{'Land of the Plain Island':3},
		effects:[
			{type:'provide',what:{'housing':50}},
			{type:'provide',what:{'housing':10},req:{'Mo\' floorz':true}},
			{type:'provide',what:{'housing':20},req:{'Even mo\' floorz':true}},
			{type:'waste',chance:0.0001/1000,req:{'construction III':false}},
			{type:'waste',chance:0.0002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.00014/1000,req:{'improved construction':true}},
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
			{type:'mult',value:1.25,req:{'se09':'on'}},
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
			{type:'mult',value:0.85,req:{'se09':'on'}},
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
			{type:'waste',chance:0.001/1000,req:{'construction III':false}},
			{type:'waste',chance:0.0002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.00014/1000,req:{'improved construction':true}},
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
			{type:'provide',what:{'added food storage':1750},req:{'well stored':true}},
			{type:'provide',what:{'added food storage':2750},req:{'well stored 2':true}},
			{type:'waste',chance:0.001/1000,req:{'construction III':false}},
			{type:'waste',chance:0.0002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.00014/1000,req:{'improved construction':true}},
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
			{type:'waste',chance:0.001/1000,req:{'construction III':false}},
			{type:'waste',chance:0.0002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.00014/1000,req:{'improved construction':true}},
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
			'gold blocks':{name:'Forge gold blocks',icon:[14,8],desc:'Forge [gold block]s out of 10 [precious metal ingot]s each.',use:{'worker':1,'stone tools':1},req:{'gold-working':true,'block-smithery':false}},
			'platinum block':{name:'Forge platinum blocks',icon:[4,11,'magixmod'],desc:'Forge [platinum block]s out of 10 [platinum ingot]s each.',use:{'worker':1,'stone tools':1},req:{'platinum-working':true,'block-smithery':false}},
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
			{type:'mult',value:0,req:{'block-smithery':true},mode:'gold blocks'},
			{type:'mult',value:0,req:{'block-smithery':true},mode:'platinum block'},
			{type:'convert',from:{'hard metal ingot':1},into:{'metal weapons':1},every:3,repeat:1,mode:'hard metal weapon'},
			{type:'convert',from:{'soft metal ingot':2},into:{'metal weapons':1},every:3,repeat:1,mode:'metal weapon'},
			{type:'convert',from:{'hard metal ingot':5},into:{'armor set':2},every:3,repeat:1,mode:'hard metal armor'},
			{type:'convert',from:{'soft metal ingot':8},into:{'armor set':2},every:3,repeat:1,mode:'metal armor'},
			{type:'mult',value:0.95,req:{'dt1':true}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on','power of the faith':true}},
			{type:'waste',chance:0.001/1000,req:{'construction III':false}},
			{type:'waste',chance:0.0002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.00014/1000,req:{'improved construction':true}},
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
		req:{'Sewing II':true,'t10':false},
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
		req:{'speech':true,'<font color="yellow">A gift from the Mausoleum</font>':true,'instruction':true},
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
			{type:'mult',value:0.915,req:{'se09':'on'}},
		],
		req:{'Crafting a juice':true,'t10':false},
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
			{type:'mult',value:1.25,req:{'se07':'on'}},
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
			{type:'mult',value:2.25,req:{'Unbelieva-canes':true}},//YEAH THE LAST MULT FINAL UPGRADE FOR THIS FARM
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
			{type:'convert',from:{'corpse':14,'pot':14},into:{'Urn':14},every:5},
			{type:'convert',from:{'slain corpse':14,'pot':14},into:{'Urn':14},every:15},
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
			{type:'gather',context:'fish',what:{'seafood':2533}},
			{type:'gather',context:'hunt',amount:2833,max:4111},
			{type:'gather',context:'hunt',amount:991,max:1438,req:{'se04':'on'}},
			{type:'gather',context:'fish',what:{'seafood':1333},req:{'se05':'on'}},
			{type:'gather',context:'fish',what:{'Ink':2},req:{'Ink-fishing':true}},
			{type:'convert',from:{'adult':2},into:{'wounded':2},every:7,chance:1/115},
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
    		category:'underworld',
	});
	G.legacyBonuses.push(
		{id:'addFastTicksOnStart',name:'+[X] free fast ticks',desc:'Additional fast ticks when starting a new game.',icon:[0,0],func:function(obj){G.fastTicks+=obj.amount;},context:'new'},
		{id:'addFastTicksOnResearch',name:'+[X] fast ticks from research',desc:'Additional fast ticks when completing research.',icon:[0,0],func:function(obj){G.props['fastTicksOnResearch']+=obj.amount;}}
	);

		new G.Unit({
    		name:'<span style="color: #E0CE00">Plain island portal</span>',
    		desc:'@opens a portal to a huge <b>Plain Island</b>. A creation made of ideas of wizards and dreams of population.//A Dream comes real. You will grant +28000 [Land of the Plain Island] upon activation of portal. Stage 1 of 2',
    		wideIcon:[28,29,'magixmod'],
			icon:[29,29,'magixmod'],
		wonder:'.',
		cost:{'marble':100,'gems':10},
		costPerStep:{'marble':250,'basic building materials':50,'Mana':3500},
		finalStepCost:{'population':100,'Magic essences':1000,'plain portal point':-1/*debug resource*/},
    		use:{'land':10},
		steps:25,
    		req:{'First portal to new world':true,'Belief in portals':true},
    		category:'dimensions',
	});
		new G.Unit({
    		name:'<span style="color: #E0CE00">Portal to the Paradise</span>',
    		desc:'@opens a portal to a huge <b>God\'s Paradise</b>A very hard project, allowed by God.//A Dream to see Paradise, angels and much, much more comes real. You will grant +26500 [Land of the Paradise] at your own but you <b>must</b> follow some of God\'s rules.',
    		wideIcon:[31,29,'magixmod'],
			icon:[32,29,'magixmod'],
		wonder:'.',
			steps:35,
    		cost:{'precious building materials':3500,'insight':50,'faith':150,'Fire essence':450,'Water essence':475,'Dark essence':375,'Wind essence':2750,'Lightning essence':377,'Nature essence':10075,'precious metal ingot':1e3,'heavenlyTemplePoint':400},
    		use:{'land':10},
			costPerStep:{'marble':1700,'gem block':15,'gems':8,'Various cut stones':2500},
    		req:{'Second portal to new world':true,'Belief in portals':true},
			finalStepCost:{'population':1000,'Magic essences':100000,'paradise portal point':-1/*debug resource*/,'faith':175},
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
		use:{'land':50},
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
		use:{'land':100},
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
		finalStepCost:{'inspiration':125,'population':2000,'precious building materials':4500,'gem block':50,'culture':650},
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
		finalStepCost:{'wisdom':125,'population':2500,'precious building materials':4500,'gem block':50,'insight':1000},
		finalStepDesc:'To complete the wonder and make your whole civilization much smarter you will need to perform a final step.',
		use:{'land':25},
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
		finalStepCost:{'authority':25,'population':2000,'precious building materials':4500,'gem block':50},
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
		finalStepCost:{'population':2000,'gem block':500,'gold block':50,'New world point':-389},
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
		finalStepCost:{'population':5000,'Fire essence':5e4,'Lightning essence':5e4,'Dark essence':5e4,'Wind essence':5e4,'Nature essence':5e4,'Water essence':5e4,'Essence of the Holiness':5e4},
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
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'Firework crafting':true/*,'<span style="color: yellow">Culture of celebration</span>':false*/},
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
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'Dark essenced fireworks':true/*,'<span style="color: yellow">Culture of celebration</span>':false*/},
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
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'Firework launching':true/*,'<span style="color: yellow">Culture of celebration</span>':false*/},
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
			{type:'provide',what:{'added material storage':3150},req:{'well stored':true}},
			{type:'provide',what:{'added material storage':4950},req:{'well stored 2':true}},
			{type:'waste',chance:0.001/100000000}
		],
		req:{'Storage at the bottom of the world':true},
		category:'underworld',
	});
	new G.Unit({
		name:'Temple of the Paradise',
		desc:'@leads to the <b>Victory next to the god</b>. //A big, golden temple which is homeland of Seraphins and the God. A temple that stays at huge cloud. It is glowing with ambrosium.',
		wonder:'Next to the God',
		icon:[9,25,'magixmod'],
		wideIcon:[8,25,'magixmod'],
		cost:{'basic building materials':100000,'precious building materials':5000,'gold block':100,'platinum block':10,'cloud':45000,'Ambrosium shard':10000},
		costPerStep:{'basic building materials':1000,'precious building materials':500,'gold block':10,'platinum block':1,'cloud':4500,'Ambrosium shard':1000,'godTemplePoint':-1},
		steps:400,
		messageOnStart:'The construction of The <b>Temple of the Paradise</b> has been started. Now you are full of hope that it will someday make the God appear next to you and show his true good-natured face.',
		finalStepCost:{'wisdom':125,'population':25000,'precious building materials':24500,'gem block':500,'insight':1000,'Ambrosium shard':10000,'Essence of the Holiness':225000,'faith II':15,'faith':725,'spirituality':25,'godTemplePoint':-100},
		finalStepDesc:'To complete the wonder and be even closer to the God you must perform this final step 25k [population,people] must be sacrificed... and many other ingredients.',
		use:{'Land of the Paradise':30},
		req:{'monument-building III':true},
		category:'wonder',
	});
		new G.Unit({
		name:'paradise shelter',
		desc:'@provides 4 [housing] @+1 [housing] per each 4 [paradise shelter,Shelters]. Shelter is camouphlaged, so people feel safer inside of this construction. Seems like God doesn\'t mind about it.',
		icon:[13,27,'magixmod'],
		cost:{'archaic building materials':100,'cut stone':150,'lumber':25 /*lumber because scaffolding*/,'clay':100/*mortar*/,'herb':2500/*Cover*/},
		use:{'Land of the Paradise':1},
		limitPer:{'land':11,'population':400},
		effects:[
			{type:'provide',what:{'housing':4.25}},
		],
		req:{'Paradise shelters':true},
		category:'paradiseunit',
	});
	new G.Unit({
		name:'pagoda of passing time',
		desc:'@Leads to <b>Patience</b> trial completion. //A monument of time. A wonder for Chra-nos the Seraphin of Time. Tall Pagoda with a huge clock that is a Seraphin\'s symbol. <><font color="#ffaaff">Patience is key...<br>But waiting right there<br>Is deadly<br>Each year weakens me<br>Hope this year is the last one...<br>Patience... is a poison...<br>...deadly poison.',
		wonder:'Patience',
		icon:[4,26,'magixmod'],
		wideIcon:[3,26,'magixmod'],
		cost:{'basic building materials':225},
		costPerStep:{'precious building materials':20,'gems':20,'basic building materials':200},
		steps:90,
		messageOnStart:'You started to build wonder for <b>Chra-nos</b>. <br>This pagoda will have a huge clock which is the symbol of the seraphin. Stars on night sky as you noticed mostly often make a shape of clock. <br>It is taller than anything around and also its shadow brings reflexions about passing time to your people.',
		finalStepCost:{'population':200,'gem block':10},
		finalStepDesc:'To perform the final step 200[population,People] and 10 [gem block]s must be sacrificed in order to escape that plane of deadly time and award you with <b>Victory points</b>.',
		use:{'land':10,'worker':5,'metal tools':5},
		req:{'monument-building':true,'t1':true,'trial':true,'language':true},
		category:'wonder',
	});
		new G.Unit({
		name:'The Outstander',
		desc:'[The Outstander] has a lot of knowledge and is very smart. Who knows if he is some sort of erudite. They doesn\'t seem like erudites for real. People call Outstanders like this one Guru\'s children.<>Provides 5 [wisdom II](1 extra per each 4 [The Outstander,Outstanders] obtained) and 1 [education] per each 5 [The Outstander,Outstanders] obtained.',
		icon:[12,28,'magixmod'],
		use:{'worker':1},
		limitPer:{'population':38000},
		effects:[
			{type:'provide',what:{'wisdom II':5.25,'education':0.2}},
		],
		req:{'Outstanding wisdom':true},
		category:'discovery',
	});
	new G.Unit({
		name:'statue of Madness',
		desc:'@Leads to <b>Unhappy</b> trial completion. //A monument of anger and wrath. A wonder for Bersaria the Seraphin of Madness. Tall statue with a mad face and some bonfires. <><font color="#ffdddd">It is insane...</font>',
		wonder:'Unhappy',
		icon:[7,26,'magixmod'],
		wideIcon:[6,26,'magixmod'],
		cost:{'basic building materials':250,'gold block':10},
		costPerStep:{'gold block':15,'blood':(2*(G.achievByName['Unhappy'].won+1.2)),'basic building materials':100,'gem block':1},
		steps:100,
		messageOnStart:'You started to build wonder for <b>Bersaria</b>. <br>This statue will have a angry face at top. Terrain is covered by some sort of fog. But you do it to stop the Madness and come back to normal plane. Let the statue be built!',
		finalStepCost:{'population':(50+(1*G.achievByName['Unhappy'].won+1/10)),'gem block':5,'blood':75},
		finalStepDesc:'To perform the final step '+250+(1*G.achievByName['Unhappy'].won+1/10)+'[population,People],5 [gem block]s and '+100+(1*G.achievByName['Unhappy'].won)+'[blood] must be sacrificed in order to escape that plane of Wrath and Madness and award you with <b>Victory points</b>.',
		use:{'land':10,'worker':5,'metal tools':5},
		req:{'monument-building':true,'t2':true,'trial':true,'language':true},
		category:'wonder',
	});
	new G.Unit({
		name:'Pagoda of culture',
		desc:'@Leads to <b>Cultural</b> trial completion. //A wonder full of cultural sparks for Tu-ria the Seraphin of Inspiration. Place that is beloved by culturists. <><font color="#0adbbd">Without culture your tribe would not even exist...</font>',
		wonder:'Cultural',
		icon:[19,26,'magixmod'],
		wideIcon:[18,26,'magixmod'],
		cost:{'basic building materials':250,'gold block':10},
		costPerStep:{'gold block':5,'Mana':25,'basic building materials':100},
		steps:125,
		messageOnStart:'You started to build wonder for <b>Tu-ria</b>. <br>People start to bring all the artifacts right to the Pagoda. You are full of hope that it will be enough to make Tu-ria support you even more.',
		finalStepCost:{'population':175,'gem block':25,'culture':25},
		finalStepDesc:'175 [population,people] , 25 [Mana] and some extra materials will be needed to perform final step and let you ascend for some <b>Victory points</b> from this trial.',
		use:{'land':10,'worker':5,'metal tools':5},
		req:{'monument-building':true,'t3':true,'trial':true,'language':true},
		category:'wonder',
	});
	new G.Unit({
		name:'Hartar\'s statue',
		desc:'@Leads to <b>Hunted</b> trial completion. //Statue fully related to patron of this plane: Hartar.<><font color="#ffd000">Fresh meat... might be healthy but only... with sense</font>',
		wonder:'Hunted',
		icon:[25,26,'magixmod'],
		wideIcon:[24,26,'magixmod'],
		cost:{'basic building materials':250,'gold block':10},
		costPerStep:{'gold block':15,'Mana':25,'basic building materials':100,'cooked meat':25,'meat':25,'cured meat':25},
		steps:100,
		messageOnStart:'You started to build statue for <b>Hartar</b>. <br>This statue will have a Hartar\'s big statuette at its top. You eat some meat and stare with hopeful smile that you will finish this trial by that.',
		finalStepCost:{'population':100,'gem block':5,'blood':25},
		finalStepDesc:'To perform the final step 25 [blood] , 100 [population,people] must be sacrificed in order to escape that plane of meat fanatics and award you with <b>Victory points</b>.',
		use:{'land':10,'worker':5,'metal tools':5},
		req:{'monument-building':true,'t4':true,'trial':true,'language':true},
		category:'wonder',
	});
	new G.Unit({
		name:'hartar\'s servant',
		desc:'@hunts wild animals for [meat], [bone]s and [hide]s@The servant can\'t be wounded and replaces [gatherer]',
		icon:[7,29,'magixmod'],
		cost:{},
		limitPer:{'population':3},
		use:{'worker':1},
		upkeep:{'blood':0.01+(0.025*G.achievByName['Hunted'].won)},
		effects:[
			{type:'gather',context:'hunt',amount:1,max:5,req:{'t4':true}},
],
		req:{'t4':true},
		category:'production',
		priority:5,
	});
	new G.Unit({
		name:'Platinum fish statue',
		desc:'@Leads to <b>Unfishy</b> trial completion. //Statue with precious platinum fish at the top.<><font color="#44d0aa">Fish is tasty but it is not only one source of health. Fishyar gets attracted...</font>',
		wonder:'Unfishy',
		icon:[22,26,'magixmod'],
		wideIcon:[21,26,'magixmod'],
		cost:{'basic building materials':250,'cut stone':100},
		costPerStep:{'platinum block':1,'gems':2,'cut stone':3,'water':4500},
		steps:175,
		messageOnStart:'You started to build statue for <b>Fishyar</b>. <br>This statue will have precious fish at the top. Feel thirsty for seafood and stare with hopeful smile that you will finish this trial by that.',
		finalStepCost:{'population':400,'gem block':5,'water':10000,'platinum ore':25},
		finalStepDesc:'To perform the final step bunch of [water] , 100 [population,people] and many more must be sacrificed in order to leave the plane of seafood fanatics and award you with <b>Victory points</b>.',
		use:{'land':10,'worker':5,'metal tools':5},
		req:{'language':true,'tribalism':false},
		category:'wonder',
	});
	new G.Unit({
		name:'Tomb of oceans',
		desc:'@Leads to <b>Ocean</b> trial completion. //A little bit ruined tomb with a Posi\'zul \'s statue next to it surrounded by huge ocean.<><font color="#ddffdd">The oceans have no equal. No law rules them. No human\'s law can affect the Ocean.</font>',
		wonder:'Ocean',
		icon:[2,25,'magixmod'],
		wideIcon:[1,25,'magixmod'],
		cost:{'basic building materials':250,'precious metal ingot':5},
		costPerStep:{'precious metal ingot':15,'strong metal ingot':1,'population':5,'basic building materials':75},
		steps:125,
		messageOnStart:'You and your people started to build the <b>Tomb of oceans</b>. <br>Around the ocean, in the middle of Ocean as some people say the wonder for Posi\'zul will stand.',
		finalStepCost:{'population':1000,'gem block':5,'water':10000},
		finalStepDesc:'To perform the final step 1000 [population,people] and many more must be sacrificed in order to leave the world of endless waters and award you <b>Victory points</b>.',
		use:{'land':10,'worker':5,'metal tools':5},
		req:{'language':true,'tribalism':false},
		category:'wonder',
	});
	new G.Unit({
		name:'The Herboleum',
		desc:'@Leads to <b>Herbalism</b> trial completion. //A big monument surrounded by herbs and bushes with berries. Herboleum can attract Herbalia and let you finish this trial.<><font color="lime">Herbs taste bad but edible. This wonder is...<br>...for the mostly acknowledged Herbalist<br> in the Universe...<br>Herbalia</font>',
		wonder:'Herbalism',
		icon:[13,26,'magixmod'],
		wideIcon:[12,26,'magixmod'],
		cost:{'basic building materials':250,'herb':500,'fruit':1000},
		costPerStep:{'precious metal ingot':20,'precious building materials':50},
		steps:100,
		messageOnStart:'You and your people started to build <b>The Herboleum</b>. <br>Around the dense forest of herbs, bushes and occasionaly small ponds the mostly natural wonder arises being slightly taller than any other people\'s building around.',
		finalStepCost:{'population':1000,'gem block':5,'herb':10000,'fruit':10000},
		finalStepDesc:'To perform the final step 1000 [population,people] and some goods must be sacrificed to finish this "healthy" trial and award <b>Victory points</b>.',
		use:{'land':10,'worker':5,'metal tools':5},
		req:{'language':true,'tribalism':false},
		category:'wonder',
	});
	new G.Unit({
		name:'Temple of the Dead',
		desc:'@Leads to <b>Buried</b> trial completion. //Dark temple built in dead and hostile terrain. A lot of graves around. That may attract Buri\'o dak.<><font color="#0F0000">Why is everyone feared of death? Just face it.</font>',
		wonder:'Buried',
		icon:[1,26,'magixmod'],
		wideIcon:[0,26,'magixmod'],
		cost:{'basic building materials':250,'bone':200,'corpse':20},
		costPerStep:{'basic building materials':10,'corpse':2,'precious building materials':1.2,'bone':3},
		steps:1000,
		messageOnStart:'Your people have started building the <b>Temple of the Dead</b>. You do not know why but it goes slightly slower than normal. But its shadow spreads fear all around.',
		finalStepCost:{'population':50,'corpse':40},
		finalStepDesc:'To perform the final step 50 [population,people] and 40 [corpse]s must be sacrificed to escape this hell once and for all and award 15 <b>Victory points</b>.',
		use:{'land':10,'worker':5,'metal tools':5},
		req:{'language':true,'tribalism':false},
		category:'wonder',
	});
	new G.Unit({
		name:'Faithsoleum',
		desc:'@Leads to <b>Faithful</b> trial completion. //Faithsoleum is full of light and sparks of religion all around. Its eye is symbol of the Enlightened the Seraphin of Faith<><font color="yellow">Worship to victory.</font>',
		wonder:'Faithful',
		icon:[1,27,'magixmod'],
		wideIcon:[0,27,'magixmod'],
		cost:{'basic building materials':1000,'gold block':10,'corpse':20},
		costPerStep:{'basic building materials':400,'precious metal ingot':5,'gems':2,'precious building materials':150,'faith':5},
		steps:50,
		messageOnStart:'Your people have started building the <b>Faithsoleum</b>. People rather build this wonder in bigger steps getting inspired by Gods. You say: <b>Worship leads to victory!<br>Religion is a key.</b>',
		finalStepCost:{'population':250,'spirituality':35,'faith':35},
		finalStepDesc:'To perform the final step 250 [population,people] and both 25 [faith] & [spirituality] must be sacrificed to escape this pious plane and award <b>Victory points</b>.',
		use:{'land':10,'worker':5,'metal tools':5},
		req:{'monument-building':true,'t11':true,'trial':true,'language':true,'Wizard towers':true},
		category:'wonder',
	});
	new G.Unit({
		name:'Temple of the Stone',
		desc:'@Leads to <b>Undergroud</b> trial completion. //Temple built out of rocks that can be found on surface.<><font color="yellow">How you feel without mining? How is it?</font>',
		wonder:'Underground',
		icon:[16,26,'magixmod'],
		wideIcon:[15,26,'magixmod'],
		cost:{'basic building materials':1000,'soft metal ingot':200},
		costPerStep:{'basic building materials':400,'soft metal ingot':100,'stone':1000},
		steps:100,
		messageOnStart:'Your people have started building the <b>Temple of the Stone</b>. No words for that.',
		finalStepCost:{'population':250},
		finalStepDesc:'To perform the final step 250 [population,people] must be sacrificed to finish this trial and award <b>Victory points</b>.',
		use:{'land':10,'worker':5,'metal tools':5},
		req:{'language':true,'tribalism':false},
		category:'wonder',
	});
	new G.Unit({
		name:'Mausoleum of richness',
		desc:'@Leads to <b>Pocket</b> trial completion. //Shiny monument of richness. That prestige spreads all around.<><font color="#D4af37">Richness can do a lot... good and bad.</font>',
		wonder:'Pocket',
		icon:[10,26,'magixmod'],
		wideIcon:[9,26,'magixmod'],
		cost:{'basic building materials':1000,'precious metal ingot':20},
		costPerStep:{'basic building materials':400,'precious metal ingot':5},
		steps:115,
		messageOnStart:'Your people have started building the <b>Mausoleum of richness</b>. You better buy some preeties to make this wonder as much prestigious as possible.',
		finalStepCost:{'population':100,'precious metal ingot':5},
		finalStepDesc:'To perform the final step 100 [population,people] and must be sacrificed to finish this trial and award <b>Victory points</b>.',
		use:{'land':15,'worker':5,'metal tools':5},
		req:{'monument-building':true,'t10':true,'trial':true,'language':true},
		category:'wonder',
	});
	new G.Unit({
		name:'Mausoleum of the Dreamer',
		desc:'@Leads to <b>Dreamy</b> trial completion. //Monument where the acknowledged dead lie. Tall monument<><font color="#D4a000">Wisdom is key... that can open a lot of doors.</font>',
		wonder:'Dreamy',
		icon:[28,26,'magixmod'],
		wideIcon:[27,26,'magixmod'],
		cost:{'basic building materials':1000,'precious building materials':400,'Magic essences':300,'Mana':400},
		costPerStep:{'basic building materials':400,'precious metal ingot':50,'insight':100,'culture':5,'gems':5},
		steps:150,
		messageOnStart:'Your people have started building the <b>Mausoleum of the Dreamer</b>. This monument is the tallest building that exists at the lands of Plain Island. This is how wisdom leads to success.',
		finalStepCost:{'population':1000,'insight':100,'wisdom':100},
		finalStepDesc:'To perform the final step 1000 [population,people] and both 100 [wisdom],[insight] must be sacrificed to leave the plane of Wisdom and award <b>Victory points</b>. This',
		use:{'Land of the Plain Island':15,'worker':5,'metal tools':5},
		req:{'language':true,'tribalism':false},
		category:'wonder',
	});
	new G.Unit({
		name:'scientific university',
		desc:'@This wonder is different than others. You cannot ascend via  [scientific university,University] but you can unlock bonuses, upgrades for your great civilization. <>Settled at the lands of Plain Island, university where all dreamers, thots, gurus, outstanders meet to discover and research new never-met before things. Who knows what will they discover? Maybe they will build up first computer or... time machine... Nobody knows.',
		wonder:'.',
		icon:[13,29,'magixmod'],
		wideIcon:[12,29,'magixmod'],
		cost:{'basic building materials':1000,'precious building materials':400,'Magic essences':300,'Mana':400,'science':20},
		costPerStep:{'basic building materials':400,'precious metal ingot':50,'insight II':160,'science':5,'gems':100,'wisdom II':-0.5,'education':-0.25,'Mana':1e4,'university point':-1},
		steps:200,
		messageOnStart:'The construction of Scientific University has been started. It is the complex of education where each knowledge can be deepened. You are proud of that.',
		finalStepCost:{'population':1000,'insight II':100,'wisdom':250,'science':50,'wisdom II':-25,'education':-25,'university point':-100},
		finalStepDesc:'To finish this stage of [scientific university,University] you need to sacrifice some resources. To unlock next stage remember that you will need to gain more [victory point]s. After each stage finish you will unlock new researches.',
		use:{'Land of the Plain Island':15,'worker':5,'metal tools':5},
		req:{'wonder \'o science':true},
		category:'civil',
	});
	new G.Unit({
    		name:'money stockpile',
    		desc:'Can store the money making them decay slower. You always start with 1. Amount of money that [money stockpile] can store is not affected by Pocket completions. Due to trial rules you do not need [stockpiling] to unlock this unit.',
    		icon:[25,29,'magixmod'],
		cost:{'archaic building materials':50},
    		effects:[
			{type:'provide',what:{'money storage':10000}},
    		],
    		use:{'land':1},
		limitPer:{'land':1e7},
    		req:{'t10':true,'trial':true},
    		category:'trial',
	});
	
	
	new G.Unit({
    		name:'bank',
    		desc:'Can store the money making them decay slower. The more times you completed Pocket, the less [bank] can store [silver coin,Money] for you.',
    		icon:[22,29,'magixmod'],
    		cost:{'basic building materials':100},
    		effects:[
    		],
    		use:{'land':1,'worker':1},
    		req:{'t10':true,'trial':true},
    		category:'trial',
	});
	
	new G.Unit({
    		name:'hovel with garden',
    		desc:'@provides 8 [housing] and can gather [Ambrosium shard]s for you. Rarely can provide you few [fruit]s or/and [vegetable]s.',
    		icon:[9,6,'magixmod'],
    		cost:{'basic building materials':90},
    		effects:[
			{type:'provide',what:{'housing':8}},
			{type:'gather',what:{'Ambrosium shard':0.04}},
			{type:'gather',what:{'fruit':0.02},chance:1/50},
			{type:'gather',what:{'vegetable':0.04},chance:1/50},
			{type:'mult',value:1.1,req:{'Fertile bushes':true}},
			{type:'mult',value:1.1,req:{'backshift at farms':true}},
    		],
		limitPer:{'land':21,'population':125},
    		use:{'Land of the Paradise':1},
    		req:{'Paradise housing':true},
    		category:'paradiseunit',
	});
	new G.Unit({
    		name:'fort',
    		desc:'@provides 30 housing. Uses 6 guards to protect civillians from cruel possesed dark powers.',
    		icon:[8,6,'magixmod'],
    		cost:{'basic building materials':800,'strong metal ingot':400,'Cobalt ingot':100},
    		effects:[
			{type:'provide',what:{'housing':30}},
    		],
		limitPer:{'land':21,'population':125,'Land of the Underworld':8},
    		use:{'Land of the Underworld':1,'Wand':10,'armor set':10,'metal weapons':10,'worker':6,'Instructor':1},
    		req:{'Underworld building 2/2':true},
    		category:'underworld',
	});
	new G.Unit({
    		name:'shop',
    		desc:'Thanks to the Shop and worker you hired you can order resources that you only could craft. Remember: they can still decay so keep that in mind and use \'em quickly so they won\'t waste. Amount of times you completed Pocket does not affect decay speed.',
    		icon:[24,29,'magixmod'],
    		cost:{'archaic building materials':500},
		modes:{
			'cut stone pack':{name:'Cut stone pack',icon:[30,19,'magixmod',2,12,'magixmod'],desc:'Buy bulk of 250 [cut stone] and 250 [Various cut stones] for 20 [golden coin]s and 45 [silver coin]s'},
			'precious ingot':{name:'Precious ingot',icon:[30,19,'magixmod',11,9],desc:'Buy 15 [precious metal ingot]s for 150 [golden coin]s.'},
			'woodpack':{name:'Woodpack',icon:[30,19,'magixmod',1,6],desc:'Buy 400 [log]s and 150 [lumber] for 31 [golden coin]s and 45 [silver coin]s.'},
			'brickpack':{name:'Pack of bricks',icon:[30,19,'magixmod',3,8],desc:'Buy 350 [brick]s for 32 [golden coin]s , 45 [wooden coin]s , 45 [silver coin]s.'},
			'toolpack':{name:'Pack of tools',icon:[30,19,'magixmod',1,9],desc:'Buy pack of: 40x [knapped tools] , 15 [stone tools] and 5 sets of [metal tools] for: 10 [golden coin]s and 40 [silver coin]s.'},
			'weaponpack':{name:'Pack of weaponry',icon:[30,19,'magixmod',5,9],desc:'Buy pack of: 32x [stone weapons] , 8[metal weapons] and 6 [armor set] for: 17 [golden coin]s.'},
			'gempack':{name:'Pack of gems',icon:[30,19,'magixmod',17,8,7,9],desc:'Buy 5 [gem block]s and 50 [gems] for: 75 [golden coin]s.'},
		},
    		effects:[
			{type:'convert',from:{'golden coin':20,'silver coin':45},into:{'cut stone':150},every:7,mode:'cut stone pack'},
			{type:'convert',from:{'golden coin':150},into:{'precious metal ingot':15},every:7,mode:'precious ingot'},
			{type:'convert',from:{'golden coin':31,'silver coin':45},into:{'lumber':150,'log':400},every:7,mode:'woodpack'},
			{type:'convert',from:{'golden coin':32,'silver coin':45,'wooden coin':45},into:{'brick':350},every:7,mode:'brickpack'},
			{type:'convert',from:{'golden coin':10,'silver coin':40},into:{'knapped tools':40,'stone tools':15,'metal tools':5},every:7,mode:'toolpack'},
			{type:'convert',from:{'golden coin':17},into:{'stone weapons':150,'metal weapons':8,'armor set':6},every:7,mode:'weaponpack'},
			{type:'convert',from:{'golden coin':75},into:{'gems':50,'gem block':5},every:7,mode:'gempack'},
    		],
    		use:{'land':1,'worker':1},
		gizmos:true,
    		req:{'t10':true,'trial':true},
    		category:'trial',
	});
	new G.Unit({
    		name:'cantor',
    		desc:'Exchanges coins of lower tier into 1 coin of higher tier. For example: 100 of <b>x</b> currency will be exchanged into 1 <b>y</b> currency.',
    		icon:[23,29,'magixmod'],
    		cost:{'archaic building materials':200,'wooden coin':90},
    		effects:[
			{type:'function',func:function(me){
				if(G.getRes('wooden coin').amount>=50*(G.getAchiev('Pocket').won*3+1)){
				 G.lose('wooden coin',50*(G.getAchiev('Pocket').won*3+1),'currency exchange(Cantor)');
                G.gain('silver coin',1);
				}
			},mode:'wts'},
			{type:'function',func:function(me){
				if(G.getRes('wooden coin').amount>=50*(G.getAchiev('Pocket').won*3+1)){
				 G.lose('silver coin',50*(G.getAchiev('Pocket').won*3+1),'currency exchange(Cantor)');
                G.gain('golden coin',1);
				}
			},mode:'stg'},
    		],
		gizmos:true,
		modes:{
			'wts':{name:'Wooden to Silver',icon:[26,29,'magixmod'],desc:'Cantor will convert  [wooden coin]s into 1 [silver coin].<br> Amount of required coins of lower tier is defined by this formula:<br><b><font color="aqua">50*(Pocket trial completions*3+1)</font></b>'},
			'stg':{name:'Silver to Golden',icon:[27,29,'magixmod'],desc:'Cantor will convert  [silver coin]s into 1 [golden coin].<br> Amount of required coins of lower tier is defined by this formula:<br><b><font color="aqua">50*(Pocket trial completions*3+1)</font></b>'},
		},
    		use:{'land':1,'worker':1},
    		req:{'t10':true,'trial':true},
    		category:'trial',
	});
	new G.Unit({
    		name:'grand mirror',
    		desc:'A door to world that is exact copy of mortal world. //<b><font color="fuschia">Isn\'t it weird that you have MIRRORED world and terrain only duplicated but any housing , crafting shacks did not? Well... maybe it is better for you.</font></b>',
    		icon:[0,0],
		wideIcon:[0,0],
		wonder:'.',
		steps:50,
		finalStepDesc:'Perform final step to gain an [emblem \'o mirror]. You will need it.',
		finalStepCost:{'emblem \'o mirror':-1,'Magic essences':1e6,'Mana':450000},
    		effects:[
    		],
    		use:{'land':25,'worker':10},
    		req:{'mirror world 1/2':true},
    		category:'dimensions',
	});
	new G.Unit({
		name:'druid',
		desc:'@generates [faith] and [happiness] every now and then<>[druid]s merge with nature and its spirits to bring down faith and hope to any people around\'em.',
		icon:[26,30,'magixmod'],
		cost:{},
		use:{'worker':1},
		upkeep:{'coin':0.3},
		limitPer:{'population':10},
		effects:[
			{type:'gather',what:{'faith':0.1,'happiness':0.2}},
			{type:'gather',what:{'health':0.23},req:{'mentors of nature':true}},
			{type:'gather',what:{'faith':0.018},req:{'druidsymbolism2':true}},
			{type:'gather',what:{'happiness':0.066},req:{'druidsymbolism1':true}},
			{type:'gather',what:{'faith':0.05},req:{'symbolism II':true}},
			{type:'mult',value:2/3,req:{'dt16':true}},
			{type:'mult',value:1.25,req:{'se11':'on'}},
			{type:'mult',value:1.01,req:{'enlightenment':true}},
			{type:'mult',value:0.95,req:{'se03':'on'}},
		],
		req:{'ritualism':true,'druidism':true},
		category:'spiritual',
	});
	new G.Unit({
		name:'corpse slayer',
		desc:'Hunts for [wild corpse]s and does a takedown on\'em. Has a chance to become wounded while encounter. //Once slain [wild corpse] cannot revive again.',
		icon:[24,30,'magixmod'],
		cost:{},
		use:{'worker':1,'metal weapons':1,'armor set':1},
		req:{'Battling thieves':true,'coordination':true,'<span style="color: red">Revenants</span>':true},
		category:'guard',
		priority:5,
		effects:[
			{type:'convert',from:{'wild corpse':1},into:{'slain corpse':1},every:4,chance:1/4},
			{type:'function',func:unitGetsConverted({'wounded':1,'soldiers defeats':1},0.001,0.03,'','',''),chance:1/50,req:{'coordination':true}},
			{type:'function',func:unitGetsConverted({'wounded':1,'soldiers defeats':1},0.001,0.03,'','',''),chance:1/25,req:{'coordination':false}},
		],
	});
	new G.Unit({
		name:'block-smith workshop',
		desc:'@forges blocks out of ingots<>The [block-smith workshop,Block-smith] forges [various metal block]s out of metals.',
		icon:[19,30,'magixmod'],
		cost:{'basic building materials':100},
		use:{'Land of the Plain Island':1},
		modes:{
			'off':G.MODE_OFF,
			'mythril':{name:'Forge mythril blocks',icon:[34,25,'magixmod'],desc:'Forge [various metal block] out of 30 [mythril ore]s  , 3[mystical metal ingot]s ,1 [strong metal ingot]s and 5 [coal] each.',use:{'worker':1,'stone tools':1,'metal tools':1},req:{}},
			'blackium':{name:'Forge blackium blocks',icon:[34,28,'magixmod'],desc:'Forge [various metal block] out of 40 [blackium ore]s , 3[mystical metal ingot]s , 1 [strong metal ingot] and 15 [coal] each.',use:{'worker':1,'stone tools':1,'metal tools':1},req:{}},
			'dinium':{name:'Forge dinium blocks',icon:[34,27,'magixmod'],desc:'Forge [various metal block] out of 15 [dinium ore]s , 4[mystical metal ingot]s, 5 [coal] and 2 [strong metal ingot]s',use:{'worker':1,'stone tools':1,'metal tools':1},req:{}},
			'unknownium':{name:'Forge unknownium blocks',icon:[34,26,'magixmod'],desc:'Forge [various metal block] out of 15 [unknownium ore]s , 3[mystical metal ingot]s, 5[coal] and 3 [strong metal ingot]s',use:{'worker':1,'stone tools':1,'metal tools':1},req:{}},
			'gold blocks':{name:'Forge gold blocks',icon:[14,8],desc:'Forge [gold block]s out of 10 [precious metal ingot]s each.',use:{'worker':1,'stone tools':1,'metal tools':1},req:{'gold-working':true}},
			'platinum blocks':{name:'Craft platinum blocks',icon:[4,11,'magixmod'],desc:'Forge [platinum block]s out of 10[platinum ingot] each.',req:{'platinum-working':true},use:{'worker':1,'metal tools':1,'stone tools':1}},
		},
		effects:[
			{type:'convert',from:{'precious metal ingot':10},into:{'gold block':1},every:6,mode:'gold blocks'},
			{type:'convert',from:{'platinum ingot':10},into:{'platinum block':1},every:6,mode:'platinum blocks'},
			{type:'convert',from:{'mythril ore':30,'mystical metal ingot':3,'coal':5,'strong metal ingot':1},into:{'various metal block':1},every:6,mode:'mythril'},
			{type:'convert',from:{'blackium ore':40,'mystical metal ingot':3,'coal':15,'strong metal ingot':1},into:{'various metal block':1},every:6,mode:'blackium'},
			{type:'convert',from:{'dinium ore':15,'mystical metal ingot':4,'coal':5,'strong metal ingot':2},into:{'various metal block':1},every:6,mode:'dinium'},
			{type:'convert',from:{'unknownium ore':15,'mystical metal ingot':3,'coal':5,'strong metal ingot':3},into:{'various metal block':1},every:6,mode:'unknownium'},
			{type:'mult',value:0.95,req:{'dt1':true}},
			{type:'mult',value:1.17,req:{'Crafting & farm rituals':'on','power of the faith':true}},
			{type:'waste',chance:0.001/1000,req:{'construction III':false}},
			{type:'waste',chance:0.0002/1000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.00014/1000,req:{'improved construction':true}},
			//TODO : better metal tools, weapons etc
		],
		gizmos:true,
		req:{'smelting':true,'block-smithery':true},
		category:'plainisleunit',
	});
	new G.Unit({
		name:'Factory of tools',
		desc:'This factory can craft for you: @[basket]s @[stone tools] @[stone weapons] @[bow]s @[Crossbow]s @[Crossbow belt]s. //Produces smaller packets of these items but faster',
		icon:[24,31,'magixmod'],
		cost:{'basic building materials':775,'Basic factory equipment':400},
		upkeep:{'coal':3,'fire pit':0.15,'food':25,'water':35},
		use:{'worker':15,'land':1,'Instructor':1,'stone tools':32},
		req:{'<font color="maroon">Moderation</font>':true,'factories II':true,'tool rafinery 2/2':true},
		category:'crafting',
		effects:[
			{type:'convert',from:{'stone':600,'stick':500,'fire pit':4.2,'coal':85},into:{'stone tools':80},every:5},
			{type:'convert',from:{'stone':650,'stick':520,'fire pit':4.2,'coal':85},into:{'stone weapons':80},every:5},
			{type:'convert',from:{'stick':1500},into:{'basket':150},every:10},
			{type:'convert',from:{'lumber':30,'stone':300},into:{'Crossbow belt':500},every:13,chance:4/5},
			{type:'convert',from:{'stick':300,'stone':200},into:{'Crossbow':55},every:11},
		],
	});
	new G.Unit({
		name:'Toolhut',
		desc:'This factory can craft for you: @[basket]s @[stone tools] @[stone weapons] @[bow]s @[Crossbow]s @[Crossbow belt]s. //Produces bigger packets of these items but slower',
		icon:[18,31,'magixmod'],
		cost:{'basic building materials':775,'Basic factory equipment':400},
		upkeep:{'coal':3,'fire pit':0.15,'food':65,'water':85},
		use:{'worker':115,'land':1,'Instructor':15,'stone tools':96},
		req:{'<font color="maroon">Caretaking</font>':true,'manufacture units II':true,'tool rafinery 2/2':true},
		category:'crafting',
		effects:[
			{type:'convert',from:{'stone':1800,'stick':1500,'fire pit':12.2,'coal':175},into:{'stone tools':255},every:15},
			{type:'convert',from:{'stone':1950,'stick':1560,'fire pit':12.2,'coal':175},into:{'stone weapons':255},every:15},
			{type:'convert',from:{'stick':4750},into:{'basket':500},every:30},
			{type:'convert',from:{'lumber':90,'stone':880},into:{'Crossbow belt':700},every:30},
			{type:'convert',from:{'stick':1100,'stone':690},into:{'Crossbow':155},every:11},
		],
	});
		new G.Unit({
		name:'f.r.o.s.t.y',
			displayName:'F.R.O.S.T.Y',
		desc:'@From snowmen created by children extracts [christmas essence]. However there is a chance that the extraction will destroy the snowman. The faster [f.r.o.s.t.y] becomes the bigger chance for that is.//Powered by strange energies ,[snow] and by [Lightning essence]. //[f.r.o.s.t.y]\'s upkeep is only active during [the christmas]',
		icon:[15,11,'seasonal'],
		cost:{'strong metal ingot':100,'hard metal ingot':15,'precious metal ingot':2,'basic building materials':10,'Magic essences':5000,'platinum ore':10},
		upkeep:{'snow':8,'Magic essences':15,'Lightning essence':5},
		req:{'festive robot print':true,'tribalism':false},
		limitPer:{'land':200000},//MAX 1
		category:'seasonal',
		effects:[
			{type:'function',func:function(me){
				if(day>=350 && day<=363){
					if(G.getRes('snowman').amount>me.amount){
						var chance=Math.random();
						var bonus=0;
						if(G.has('f.r.o.s.t.y overclock I') && bonus<0.05)bonus+=0.05;
						if(G.has('f.r.o.s.t.y overclock II') && bonus<0.12)bonus+=0.07;
						if(G.has('f.r.o.s.t.y overclock III') && bonus<0.22)bonus+=0.1;
						G.gain('christmas essence',1*(bonus+1),'F.R.O.S.T.Y');
						if(chance<=0.05+bonus){
							G.lose('snowman',1*((bonus*1.1)+1),'failed essence extraction');	
						}
					}else{
						G.getDict(me).upkeep={};
					}
					   }
			},every:7},
		],
	});
	new G.Unit({
		name:'wonderful fortress of christmas',
		desc:'Constucted in cold climates collosal, giant [wonderful fortress of christmas,Wonderful fortress of Christmas]. Taller and bigger than anything else giving its shadow of the festive to villages and cities all around. //Full of lights and ornaments so its mightiness is also the art of beauty. //This giant takes a lot of steps to be built and does not belong to cheapest wonders. //Merry Christmas!',
		icon:[0,11,'seasonal'],
		wonder:';',
		steps:1200,
		cost:{'basic building materials':3000,'christmas essence':10000},
		costPerStep:{'christmas essence':4200,'Dyes':1500,'Mana':1400,'basic building materials':650,'precious building materials':150,'concrete':25,'gems':10,'christmas ornament':150,'festive light':80},
		finalStepCost:{'christmas essence':40000,'Mana':1e5,'ice':7.5e4},
		threexthreeIcon:[0,11,'seasonal'],
		use:{'worker':200,'Instructor':15,'metal tools':400,'metal weapons':200,'armor set':200},
		req:{'monument-building II':true,'f.r.o.s.t.y overclock II':true},
		category:'seasonal',
		priority:5,
	});
		new G.Unit({
		name:'christmas essence storage',
		desc:'@One storage allows you to store 11500 [christmas essence] more<>A simple glass shielded storage with essence faucet. It is more tall than wide so that is why it consumes only 0.8 [land].',
		icon:[4,10,'seasonal'],
		cost:{'basic building materials':(100*((G.getUnitAmount('christmas essence storage')+1)/10)),'glass':(200*((G.getUnitAmount('christmas essence storage')+1)/8))},
		use:{'land':0.8},
		effects:[
			{type:'provide',what:{'christmas essence limit':11500}},
			{type:'waste',chance:1/10000,req:{'construction III':false}},
			{type:'waste',chance:0.2/10000,req:{'construction III':true,'improved construction':false}},
			{type:'waste',chance:0.14/10000,req:{'improved construction':true}},
		],
		req:{'stockpiling':true,'building':true,'Essence storages':true,'the christmas':true},
		category:'seasonal',
	});
	/*=====================================================================================
	TECH & TRAIT CATEGORIES
	=======================================================================================*/
	G.knowCategories.push(
		{id:'main',name:'General'},
		{id:'misc',name:'Miscellaneous'},
		{id:'knowledge',name:'Knowledge'},
		{id:'seasonal',name:'<font color="fuschia">S e a s o n a l</font>'},
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
	TECHS  
	=======================================================================================*/
	
	new G.ChooseBox({
		name:'research box',
		context:'tech',
		choicesN:4,
getCosts:function()
        {
            let calcCost = (name, constGain = 0.025, rollGain = 0.05) => Math.floor(G.getRes(name).amount * (constGain + this.roll * rollGain))
	    if (G.has('t2') && G.has('fear of death')){
              return { 'insight' : calcCost('wisdom') , 'blood': calcCost('wisdom', 0.03)}
            }else if (G.has('t3')){
              return { 'insight' : calcCost('wisdom') , 'culture': calcCost('inspiration', 0.1), 'influence': calcCost('authority', 0.1)}
            }else if (G.has('t11')){
              return { 'insight' : calcCost('wisdom') , '"golden insight"':1*((G.achievByName['Faithful'].won/2)+1)}
            }
            else if (G.hasNot('Eotm')){
              return { 'insight' : calcCost('wisdom') }
            }else if(G.has('Eotm') && G.hasNot('do we need that much science?')){
            return { 'insight II' : calcCost('wisdom II'), 'science': calcCost('education', 0.2) }
	    }else if(G.has('Eotm') && G.has('do we need that much science?')){
		    return { 'insight II' : calcCost('wisdom II'), 'science': calcCost('education', 0.1) }
	    }
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
			var randomMessage=Math.floor(Math.random()*4)
			if(randomMessage>=0 && randomMessage<=1){
			G.Message({type:'good tall',text:'Your people have discovered the secrets of <b>'+what.displayName+'</b>.',icon:what.icon})
			}else if(randomMessage>1 && randomMessage<=2){
			G.Message({type:'good tall',text:'Your people have learnt <b>'+what.displayName+'</b>.',icon:what.icon})
			}else if(randomMessage>2 && randomMessage<=4){
			G.Message({type:'good tall',text:'Your people have acknowledged with <b>'+what.displayName+'</b>.',icon:what.icon})
			};
			G.update['tech']();
			G.popupSquares.spawn(l('chooseOption-'+index+'-'+this.id),l('techBox').children[0]);
			l('techBox').children[0].classList.add('popIn');
			var randomSound=Math.floor(Math.random()*5)
			if (G.checkPolicy('Toggle SFX')=='on' && randomSound>=0 && randomSound<=1) //Toggle SFX
			{
			var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GainedTech.wav');
			audio.play(); 
			}
			if (G.checkPolicy('Toggle SFX')=='on' && randomSound>1 && randomSound<=2) //Toggle SFX
			{
			var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GainedTech2.wav');
			audio.play(); 
			}
			if (G.checkPolicy('Toggle SFX')=='on' && randomSound>2 && randomSound<=3) //Toggle SFX
			{
			var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GainedTech3.wav');
			audio.play(); 
			}
			if (G.checkPolicy('Toggle SFX')=='on' && randomSound>3 && randomSound<=4) //Toggle SFX
			{
			var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GainedTech4.wav');
			audio.play(); 
			}
			if (G.checkPolicy('Toggle SFX')=='on' && randomSound>4  && randomSound<=5) //Toggle SFX
			{
			var audio = new Audio('https://pipe.miroware.io/5db9be8a56a97834b159fd5b/GainedTech5.wav');
			audio.play(); 
			}
			if(G.has('t3')){
			G.lose('cultural balance',1)	
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
			if (this.choices.length>0) str+='<font color="lime">Reroll</font>';
			else str+='<font color="fuschia">Research</font>';
			var costs=this.getCosts();
			var costsStr=G.getCostString(costs);
			if (costsStr) str+='<b><i><font color="#aaffff">('+costsStr+')</font></i></b>';
			return str;
		},
		buttonTooltip:function()
		{
			if(G.has('t3')){
			return '<div class="info"><div class="par">'+(this.choices.length==0?'Generate new research opportunities.<br>The costs scales with your <b>Wisdom</b>(for Insight),<b>Inspiration</b>(for Culture) and <b>Authority</b>(for Influence).':'Reroll into new research opportunities if none of the available choices suit you.<br>Cost increases with each reroll, but will decrease again over time. This will not involve in stability.')+'</div><div>Cost : '+G.getCostString(this.getCosts(),true)+'.</div></div>';
			}
			if(G.hasNot('Eotm') && G.has('t2')){
			return '<div class="info"><div class="par">'+(this.choices.length==0?'Generate new research opportunities.<br>The cost scales with your <b>Wisdom</b> resource.<br>The blood cost scales with <b>Wisdom</b> resource as well.':'Reroll into new research opportunities if none of the available choices suit you.<br>Cost increases with each reroll, but will decrease again over time.')+'</div><div>Cost : '+G.getCostString(this.getCosts(),true)+'.</div></div>';
			}
			else if (G.hasNot('Eotm')){
			return '<div class="info"><div class="par">'+(this.choices.length==0?'Generate new research opportunities.<br>The cost scales with your <b>Wisdom</b> resource.':'Reroll into new research opportunities if none of the available choices suit you.<br>Cost increases with each reroll, but will decrease again over time.')+'</div><div>Cost : '+G.getCostString(this.getCosts(),true)+'.</div></div>';
			}
			else if (G.has('Eotm')){
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
		req:{'tool-making':true,'language':true,'intuition':true},
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
		req:{'canoes':true,'carpentry':true,'intuition':true},
		effects:[
			{type:'allow',what:['ocean exploring']},
		],
	});
	
	new G.Tech({
		name:'sedentism',
		desc:'@unlocks [mud shelter]s and [branch shelter]s@unlocks [lodge]s<>To stay in one place when food is scarce is a bold gamble, especially to those without knowledge of agriculture.',//TODO : this should unlock a policy that lets you switch between nomadism (housing and food storage have no effect) and sedentism (gathering and hunting are much less efficient)
		icon:[8,1],
		cost:{'insight':20},
		req:{'stone-knapping':true,'digging':true,'language':true,'intuition':true},
		effects:[
		],
		chance:3,
	});
	new G.Tech({
		name:'building',
		desc:'@unlocks [hut]s@unlocks [stockpile]s (with [stockpiling])<>The [building,Hut] is only slightly more sophisticated than simple shelters, but is more spacious and can withstand wear longer.',
		icon:[9,1],
		cost:{'insight':20},
		req:{'sedentism':true,'tool-making':true,'intuition':true},
		effects:[
		],
		chance:3,
	});
	new G.Tech({
		name:'cities',
		desc:'@unlocks [hovel]s<>',
		icon:[29,7],
		cost:{'insight':25},
		req:{'building':true,'intuition':true},
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
		req:{'construction':true,'cities':true,'caligraphy':true,'alphabet 1/3':true,'intuition':true},
		effects:[
		],
	});
	new G.Tech({
		name:'guilds',
		desc:'@unlocks [guild quarters]<>NOTE : useless for now.',
		icon:[23,8],
		cost:{'insight':20},
		req:{'cities':true,'construction':true,'code of law':true,'intuition':true},
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
		req:{'oral tradition':true,'herbalism':true},
		effects:[
		],
	});
	new G.Tech({
		name:'healing',
		desc:'@unlocks [healer]s<>',
		icon:[25,7],
		cost:{'insight':10},
		req:{'plant lore':true,'stone-knapping':true,'herbalism':true,'intuition':true},
		effects:[
		],
		chance:2,
	});
	
	new G.Tech({
		name:'ritualism',
		desc:'@provides 10 [spirituality]@unlocks [soothsayer]s@unlocks some ritual policies<>Simple practices, eroded and polished by time, turn into rites and traditions.',
		icon:[12,1],
		cost:{'culture':5},
		req:{'oral tradition':true,'intuition':true,'spark\'o religion':true},
		effects:[
			{type:'provide res',what:{'spirituality':10}},
			{type:'provide res',what:{'cultural balance':3}},
		],
	});
	
	new G.Tech({
		name:'symbolism',
		desc:'@[dreamer]s produce 40% more [insight]@[storyteller]s produce 50% more [culture]@[soothsayer]s produce 50% more [faith]<>The manifestation of one thing for the meaning of another - to make the cosmos relate to itself.',
		icon:[13,1],
		cost:{'culture':10,'insight':10},
		req:{'oral tradition':true,'intuition':true},
		effects:[
			{type:'provide res',what:{'cultural balance':3}},
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
		desc:'@unlocks [hunter]s<>It is a common tragedy that a creature should die so that another may survive.//[hunter] can gather [hide] if [skinning] is unlocked.',
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
		desc:'@[artisan]s can now craft [stone weapons]@unlocks new modes for [hunter]s and [fisher]s<>Using tools as weapons opens a world of possibilities, from hunting to warfare. <b>Spear hunting/fishing</b> modes has only 80% of its normal efficiency. To remove that penalty obtain [aiming] research.',
		icon:[26,1],
		cost:{'insight':10},
		req:{'tool-making':true},
	});
	new G.Tech({
		name:'bows',
		desc:'@[artisan]s can now craft [bow]s@unlocks new modes for [hunter]s<> <b>Bow hunting</b> mode has only 40% of its normal efficiency. To remove that penalty obtain [aiming] research.',//TODO : desc
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
		req:{'cooking':true,'stockpiling':true,'intuition':true},
	});
	
	new G.Tech({
		name:'sewing',
		desc:'@unlocks [clothier]s, who work with fabric and can sew [primitive clothes]<>',//TODO : desc
		icon:[29,1],
		cost:{'insight':10},
		req:{'tool-making':true,'intuition':true},
		effects:[
		]
	});
	new G.Tech({
		name:'weaving',
		desc:'@[clothier]s can now sew [basic clothes]<>',
		icon:[30,1],
		cost:{'insight':20},
		req:{'sewing':true,'intuition':true},
		effects:[
		],
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
		req:{'fire-making':true,'building':true},'intuition':true,
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
		req:{'chieftains':true,'code of law':true,'intuition':true},
		effects:[
			{type:'provide res',what:{'authority':5}},
		],
	});
	new G.Tech({
		name:'code of law',
		desc:'@provides 15 [authority]@political units generate more [influence]<>',//TODO : desc
		icon:[24,6],
		cost:{'insight':20},
		req:{'symbolism':true,'sedentism':true,'writing':true},
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
		req:{'mining':true,'intuition':true},
		effects:[
		],
	});
	
	new G.Tech({
		name:'quarrying',
		desc:'@unlocks [quarry,Quarries]<>',
		icon:[25,6],
		cost:{'insight':20},
		req:{'digging':true,'building':true,'intuition':true},
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
		req:{'building':true,'woodcutting':true,'intuition':true},
		effects:[
		],
	});
	
	new G.Tech({
		name:'monument-building',
		desc:'@unlocks the [mausoleum], an early wonder<>',
		icon:[24,8],
		cost:{'insight':90,'culture':40},
		req:{'construction':true,'burial':true,'belief in the afterlife':true,'intuition':true},
		effects:[
		],
	});
	//MAGIX
	new G.Tech({
		name:'Wizardry',
		desc:'@ [Archaic wizard]s will start their existence .They behave weird. Here wizardry and essences will start to appear. Essences are not naturally generated so they consume mana to be made.',
		icon:[5,3,'magixmod'],
		cost:{'insight':75,'faith':5},
		req:{'well-digging':true,'<font color="yellow">A gift from the Mausoleum</font>':true,'spark\'o religion':true},
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
		effects:[
		]
	});
		new G.Tech({
		name:'Wizard wisdom',
		desc:'Evolves up [Archaic wizard] into [Wizard] . New one may gain wisdom.',
		icon:[3,0,'magixmod'], //WIP
		cost:{'insight':85,'culture': 30,'Mana':40,'influence':10},
		req:{'Mana brewery':true,'More useful housing':true,'Wizardry':true},
		effects:[
	]
			});
		new G.Tech({
		name:'Wizard complex',
		desc:'Complex of wizard towers. Expensive but The Complex produces all types of Essences three times better than usual towers. Each complex increases additionaly max [faith],[culture] & [influence]. Boosts max mana too.',
		icon:[2,2,'magixmod'], 
		cost:{'insight':480,'culture':30,'Mana':100,'influence':20},
		req:{'Mana brewery':true,'More useful housing':true,'Wizardry':true,'Wizard towers':true},
	});
		new G.Tech({
		name:'First portal to new world',
		desc:'<span style="color: #00A012">Your wizards discovered way to make a portal and now they plan to open a new dimension. What would it mean? It means, more place to build, more housing, more everything!</span>',
		icon:[2,1,'magixmod'], 
		cost:{'insight':1400,'culture':30,'Mana':2500,'influence':70},
		req:{'Mana brewery':true,'More useful housing':true,'Wizardry':true,'Wizard wisdom':true,'Wizard complex':true,'Belief in portals':true,'valid portal frame':true},
	});
		new G.Tech({
		name:'Crafting a glass',
		desc:'Since now your kilns will be able to craft glass out of sand.',
		icon:[7,1,'magixmod'], 
		cost:{'insight':45},
		req:{'masonry':true,'smelting':true},
	});
		new G.Tech({
		name:'churches',
		desc:'Unlocks [Church]. Another source of [faith]. ',
		icon:[7,2,'magixmod'], 
		cost:{'insight':135},
		req:{'Wizardry':true,'Wizard wisdom':true},
	});
		new G.Tech({
		name:'Essence storages',
		desc:'<span style="color: #FF00FF">Essence has to be stored somewhere. So do not wait and build!</span>',
		icon:[5,0,'magixmod'], 
		cost:{'insight':100,'Mana':317,'faith':8,'Wand':200},
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
		req:{'construction II':true,'gardening':true},
	});
		new G.Tech({
		name:'Crafting a juice',
		desc:'@Makes juices possible to be crafted. Any [fruit] + [sugar] + [water] = [Juices]. Be careful. Juices may spoil same like normal water. Spoiled juice grants even more <b>unhappiness and unhealth<b> than normal muddy water.<>',
		icon:[16,4,'magixmod'],
		cost:{'insight':495,'wisdom':50},
		req:{'Farms in the new land':true,'gardening':true},
	});
		new G.Tech({
		name:'Farm of the Sugar cane',
		desc:'@Makes [Sugar cane] farm possible to be built. This farm will have increased upkeep cost and will need more people to run.<>',
		icon:[15,7,'magixmod'],
		cost:{'insight':495,'wisdom':50},
		req:{'Farms in the new land':true,'gardening':true},
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
			{type:'provide res',what:{'cultural balance':-3}},
		],
		req:{'oral tradition':true,'writing':true},
	});
		new G.Tech({
		name:'Intermediate maths',
		desc:'@people will know more harder and advanced math making them even more intelligent and smart. @Your people have bigger chances to understand more advanced things.<>',
		icon:[17,2,'magixmod'],
		cost:{'insight':80},
		effects:[
			{type:'provide res',what:{'education':2}},
			{type:'provide res',what:{'cultural balance':-6}},
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
		desc:'@[well]s provide 5% more water. Boosts only [well] and [well of the Plain Island].',
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
		desc:'@[quarry] can now dig for [Various cut stones] by new special mode. @<b>"Advanced quarry stone" mode and "Quarry other stones mode(non advanced)" are now able to gather [platinum ore,Platinum].',
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
  if(!G.techsOwnedNames.includes(battlingThieves.name) && newBuy >= 109) G.gainTech(battlingThieves)
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
		cost:{'insight':1295,'wisdom':25,'Wind essence':775,'cloud':1990},
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
		effects:[
			]
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
		req:{'language':true,'spark\'o religion':true},
	});
	new G.Trait({
		name:'belief in the afterlife',
		desc:'@unhappiness from death is halved',
		icon:[21,1],
		cost:{'culture':5,'faith':2},
		chance:10,
		req:{'fear of death':true,'oral tradition':true,'spark\'o religion':true},
		effects:[
		]
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
		desc:'<b>The god... he called your people... to his world... full of hopes... full of new adventures... to... his... Paradise...</b>',
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
		desc:'Unlocks seasonal content. <b><span style="color: aqua">Seasonal content is a content available for some time like Christmas content.</span></b>',
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
			effects:[
				]
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
		req:{'Will to know more':true,'alphabet 2/3':true,'caligraphy':true},
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
		desc:'[soothsayer]s and [druid]s gain 33% less [faith].',
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
		desc:'Replaces [insight], [culture], [faith] and [influence] with: [insight II],[culture II], [faith II] and [influence II] . @To obtain them you will unlock special unit that will convert each for instance 500 [insight] into 1 [insight II] point. In addition [storyteller] , [dreamer] , [chieftain], and [clan leader] work 90% less efficient. becuase this evolution is like disaster for them all. @Since now choose box in <b>Research tab</b> will require [insight II] & [science] instead of [insight] .@So you will still need [Wizard]s and units you used to gather lower essentials. @Lower essentials has been hidden but remember... don\'t get rid of wizards. @[flower rituals] and [wisdom rituals] will no longer occur until [ritualism II] is obtained. @[sleepy insight] now gives [insight II] instead of [insight]. Same chances. '+(G.modsByName["Thot Mod"]!=undefined ? "[thot] limit per is increased and becomes 75% less efficient" : "")+'',
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
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'tribalism':false},//switch to false after new year
	});
		new G.Tech({
		name:'Firework launching',
		desc:'@unlocks [Firework launching guy]. By the way allows [Artisan of new year] to craft [Firecracker] .',
		icon:[17,0,'seasonal'],
		cost:{'insight':70},
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'Firework crafting':true,'tribalism':false},
	});
		new G.Tech({
		name:'Dark essenced fireworks',
		desc:'@[Artisan of new year] now can craft [Dark Orange Firework] and [Dark Blue Firework].',
		icon:[16,0,'seasonal'],
		cost:{'insight':400},
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'Firework crafting':true,'Wizard complex':true,'tribalism':false},
	});
	//Special techs from achievements and their functions
	/*============================================================================================
	SPECIAL ACHIEVEMENTS EFFECTS
	===========================================================================================*/

	new G.Tech({
        name:'<font color=" ##00C000">Artistic gray cells</font>',
        desc:'You see flashes of culture... But who were these people? These flashes and hypnagogia made you inspired. Ancestors of culture gives you their power... watch over you giving to you: @+3 [culture] @+3 [inspiration] @Also autohires for free 1 [storyteller] but this free one works at 1/2000 of normally hired [storyteller].',
        icon:[4,12,'magixmod',6,12,'magixmod'],
        cost:{},
	effects:[
			{type:'provide res',what:{'inspiration':3}},
			{type:'provide res',what:{'culture':3}},
		],
        req:{'tribalism':false}
    	});
	new G.Tech({
        name:'<font color="aqua">Genius feeling</font>',
        desc:'You feel like you are genius or semi-genius. Your people noticed it. That may help and decide for their fate. @+6 [insight]',
        icon:[4,12,'magixmod',choose([1,4,7]),17,'magixmod'],
        cost:{},
	effects:[
			{type:'provide res',what:{'insight':6}},
		],
        req:{'tribalism':false}
    });
new G.Tech({
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
	new G.Tech({
        name:'<font color="yellow">A gift from the Mausoleum</font>',
        desc:'The gift is very uncommon. It may make people life inverted by 180 degrees. But it will be more interesting',
        icon:[4,12,'magixmod',1,14],
        cost:{},
        req:{'tribalism':false},
	effects:[
			{type:'show context',what:['flowers']},
		],
    });new G.Tech({
        name:'A feeling from the Underworld',
        desc:'You feel some warmth. It is not usual warmth. A call from Underworld. @<b>Allows you to finalize Underworld unlocking',
        icon:[8,12,9,5,'magixmod'],
        cost:{},
	effects:[
		{type:'provide res',what:{'New world point':400}},
	],	
        req:{'tribalism':false}
    });
	new G.Tech({
        name:'<font color="##a8654f">The Underworld\'s Ascendant</font>',
        desc:'You managed to do few other feats to attract new things. And you attracted: @ +1 [adult] . This is [adult,The Underworld\'s Ascendant]',
        icon:[15,19,'magixmod'],
        cost:{},
	effects:[
		{type:'provide res',what:{'adult':1}},
	],
        req:{'tribalism':false}
    });
	/*======================================
	Another TECHZ
	=======================================*/
		new G.Tech({
		name:'guilds unite',
		desc:'@moderns up existing modes of [lodge] & [guild quarters] and unlocks one new for [guild quarters] . Increases rate of hiring units per one [lodge] from 6 to 100. <>NOTE: Useless for now but applies new icons to [lodge] , [guild quarters]',
		icon:[29,8,'magixmod'],
		cost:{'insight II':20,'culture II':10,'influence II':5,'insight':45},
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
		desc:'@increases [symbolism] bonus from 50 to 70%. Still boost has the same targets as it had before and [druid]s in extra.',
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
	});new G.Tech({
        name:'<font color="lime">Fruit supplies</font>',
        desc:'Obtaining <font color="red">Experienced</font> made you getting extra 100 [fruit]s . Wish your people having good taste :) ',
        icon:[4,12,'magixmod',28,22,'magixmod'],
        cost:{},
	effects:[
			{type:'provide res',what:{'fruit':100}},
		],
        req:{'tribalism':false}
    });
	new G.Tech({
        name:'<font color="orange">Life has its theme</font>',
        desc:'From now you can change game theme :) ',
        icon:[4,12,'magixmod',29,23,'magixmod'],
        cost:{},
	effects:[
		],
        req:{'tribalism':false}
    });new G.Trait({
        name:'<font color="orange">Smaller but efficient</font>',
        desc:'<span style="color: #aaffff">[Brick house with a silo] , [house] , [hovel] , [hut] , [bamboo hut] , [branch shelter] and [mud shelter] uses 0.9 [land] instead of full 1 [land] .</span>',
        icon:[28,23,'magixmod'],
        cost:{},
	effects:[
		],
        req:{'tribalism':false},category:'knowledge',chance:1,
    });
		new G.Tech({
		name:'Glory',
		desc:'@provides 7 [authority II] @Increases efficiency of [chieftain] and [clan leader] by 10% @Applies visual changes for [chieftain] and [clan leader] . @You gain yearly 2 [influence] instead of 1. @[Mediator] can gather [influence] but becomes more limited.',
		icon:[23,23,'magixmod'], 
		cost:{'influence II': 5,'insight II':50,'culture II':20,'influence':160},
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
		desc:'@[Essential conversion tank] can convert essentials 10% more often. People overclock these tanks to cause conversion occur even more often.',
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
	new G.Tech({
        name:'Magical presence',
	displayName:'<font color="silver">Magical presence</font>',
        desc:'You feel some weird stuff inside of your body. Sometime it is warm, sometime makes you feel weird but later you don\'t feel any weird things that this presence has made. @Increases efficiency of all [Water wizard tower,Wizard towers] by 5% without increasing [Mana] upkeep. @Unlocks you new theme (check [Theme changer]).',
        icon:[4,12,'magixmod',2,24,'magixmod'],
        cost:{},
	effects:[
	],	
        req:{'tribalism':false}
    });		new G.Tech({
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
		desc:'<span style="color: #aaffff">Increases upkeep (amount of [fire pit]s used) by 1 at [Fishers & hunters camp] but since now they will be able to cook some [cooked meat,meat] for you.</span>',
		icon:[15,24,'magixmod'],
		cost:{'insight II':100},
		req:{'Hunters & fishers unification':true},
		chance:65,
		category:'knowledge'
	});
			new G.Tech({
		name:'Fertile bushes',
		desc:'[house,Next-to house berrybushes] are 20% more fertile. In fact they gather 20% more [Berries] . Yummy :) Also [hovel with garden] gains 10% more.',
		icon:[1,24,'magixmod'],
		cost:{'insight II':100,'culture II':20,'insight':50},
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
		desc:'<span style="color: #aaffff">Provides: @10 [wisdom II] and 2 [inspiration II] . //This part of doctrine is about spells or rituals that will sucessfully make a wormhole working and stable. //Your [Wizard]s seem interested in making the first wormhole. But they wants finished doctrine. They don\'t want to do it by themselves so they will calmly wait for finished doctrine.</span>',
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
		desc:'<span style="color: #aaffff">Provides: @10 [wisdom II] and 2 [inspiration II] . //This part of doctrine describes ways of keeping the wormhole active. It is important thing too because if it will run out of power a tons of corpses will explode out of wormhole and people will be really, really mad. //Your [Wizard]s know exactly how big problem will occur if wormhole will run out of power.</span> ',
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
		desc:'Policies such like [extended basic catalog] or [extended food catalog] now have more options. //Also unlocks [art trader] who can sell [Painting]s for [market_coin].',
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
		desc:'[Sugar cane farm] and [Berry farm] produce 2.5x more and [Wheat farm] gets twice as efficient. //Now these farms require 50% more [worker]s due to way people increase income of the farms. //Requires [<font color="maroon">Moderation</font>] to unlock this tech. Also [hovel with garden] gains 10% more.',
		icon:[31,14,'magixmod'],
		cost:{'insight II':180,'science':5,'influence II':10,'culture II':5,'insight':293},
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
		cost:{'insight II':190,'culture II':20,'Juices':1050,'culture':188},
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
		cost:{'insight':590},
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
	});new G.Tech({
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
		new G.Tech({
		name:'Pantheon key',
		desc:'Unlocks Pantheon. In pantheon you will meet 12 seraphins. Each one offers to you some boost but each boost has its backfire. <font color="red">Choose the seraphins wisely!</font> //You will get 4 [Worship point]s that can be spent to choose up to 4 seraphins. Rejecting already chosen one will not make spent [Worship point] come back to you so really be careful and think twice or even thrice before you perform a choice! //You will unlock a new tab. From this new tab you may start a trial. To learn more about trials just check the new tab. //Provides: 25 [spirituality II] and 15 [authority II].',
		icon:[4,25,'magixmod'],
		req:{'Life in faith':true,'monument-building III':true},
		cost:{'insight II':100,'faith II':10,'culture II':30,'godTemplePoint':500,'faith':80},
		effects:[
			{type:'provide res',what:{'Worship point':4}},	
			{type:'provide res',what:{'spirituality II':25}},
			{type:'provide res',what:{'authority II':15}},
		]
	});
  	new G.Tech({
		name:'skinning',
		desc:'[hunter]s can gather [hide] out of killed animals.',
		icon:[31,26,'magixmod'],
		req:{'hunting':true,'sewing':true},
		cost:{'insight':10},
		effects:[
			]
	});
	new G.Tech({
		name:'herbalism',
		desc:'[gatherer] can now gather [herb] amount depending on biome.//Previously they were missing most of herbs because they were thinking that is just a simple grass.',
		icon:[31,27,'magixmod'],
		req:{'language':true},
		cost:{'insight':10},
	});
	new G.Tech({
		name:'instruction',
		desc:'Unlocks [Thoughts sharer]. //The [Thoughts sharer] spends his life figuring out a way to guide others. People which hear their thoughts will become [Instructor]s at some time.',
		icon:[30,27,'magixmod'],
		req:{'language':true,'<font color="yellow">A gift from the Mausoleum</font>':true,'alphabet 1/3':true},
		cost:{'insight':30},
		effects:[	
		]
	});
	new G.Tech({
		name:'writing',
		desc:'People can write at least. Because they do not have any paper yet they write on stones, logs etc. Required to unlock further researches.',
		icon:[16,27,'magixmod'],
		req:{'language':true},
		cost:{'insight':25},
		effects:[	
		]
	});
	new G.Tech({
		name:'caligraphy',
		desc:'Your people can write but their characters are hard to be read. This technology will be a pass for things like [city planning].',
		icon:[17,27,'magixmod'],
		req:{'writing':true},
		cost:{'insight':30,'culture':5},
		effects:[	
		]
	});
	new G.Tech({
		name:'alphabet 1/3',
		desc:'Make people set up their own alphabet. It is another step to be closer to more advanced researches, technologies',
		icon:[28,27,'magixmod',29,27,'magixmod'],
		req:{'caligraphy':true},
		cost:{'insight':30,'culture':5},
		effects:[	
		]
	});
	new G.Tech({
		name:'alphabet 2/3',
		desc:'Expands up set of characters in people\'s alphabet. //May lead to make native languages exist',
		icon:[27,27,'magixmod',24,27,'magixmod'],
		req:{'alphabet 1/3':true,'Wizardry':true},
		cost:{'insight':250,'culture':50},
		effects:[	
		]
	});
	new G.Tech({
		name:'alphabet 3/3',
		desc:'Slightly expands amount of characters in people\'s language',
		icon:[26,27,'magixmod',25,27,'magixmod'],
		req:{'alphabet 2/3':true,'artistic thinking':true,'Beginnings of alchemy':true},
		cost:{'insight':1400,'culture':500,'inspiration':20,'wisdom':40,'faith':181},
		effects:[	
		]
	});
				
	new G.Tech({
		name:'philosophy',//Unlocks thot if Thot Mod installed :)
		desc:'Provides 25 [wisdom] for free. //Also increases [symbolism] bonus for [dreamer]s from 40 to 50%. //Some people start wondering why things aren\'t different than they are.'+(G.modsByName['Thot Mod'] ? "Also unlocks [thot] and applies [symbolism] bonus for him equal to new [dreamer] bonus." : "")+'',
		icon:[23,27,'magixmod'],
		req:{'alphabet 2/3':true},
		cost:{'insight':400},
		effects:[
			{type:'provide res',what:{'wisdom':25}},
		]
	});
        if(G.modsByName['Thot Mod'])
	{
		new G.Trait({
		name:'natural philosophy',
		desc:'[thot] is 10% more efficient. Also [Thoughts sharer] becomes 5% more efficient(additive).',
		icon:[22,27,'magixmod'],
		req:{'alphabet 3/3':true},
		cost:{'insight':600,'culture':300},
		effects:[
		],
		chance:100
	});
		new G.Tech({
		name:'natural philosophy II',
		desc:'[dreamer] is 10% more efficient. [thot] becomes 10% more efficient(additive with [natural philosophy,Natural philosophy I]) Also [Thoughts sharer] becomes 5% more efficient(additive).',
		icon:[20,27,'magixmod'],
		req:{'alphabet 3/3':true,'symbolism III':true},
		cost:{'insight II':60,'culture II':30},
		effects:[
		],
		chance:5
	});
	}
		new G.Tech({
		name:'philosophy II',
		desc:''+(G.modsByName['Thot Mod']!=undefined ? "[thot] is 50% more efficient(compounding). Also [Thoughts sharer] becomes 5% more efficient(additive). Provides 1-time bonus: +6 [science]." : "[dreamer] is 75% more efficient, and [Thoughts sharer] is 5% more efficient(additive).@provides 1-time bonus: +6 [science]")+'',
		icon:[19,27,'magixmod'],
		req:{'alphabet 3/3':true,'symbolism III':true},
		cost:{'insight II':150,'culture II':30},
		effects:[
			{type:'provide res',what:{'science':6}},
			
			{type:'function',func:function(){if(G.modsByName['Thot Mod']){G.getDict('thot').effects.push({type:'mult',value:1.5})}}},
		],
		chance:100
	});
	
		new G.Trait({
		name:'mastered caligraphy',
		desc:'<font color="#aaffff">Most of people in your population can write and their writings are preety easy to read. Amount of almost unreadeable writings is slightly decreased. <br>Provides 5[education].</font>',
		icon:[15,27,'magixmod'],
		req:{'Eotm':true},
		cost:{'insight II':15,'culture II':15},
		effects:[
			{type:'provide res',what:{'education':5}},
		],
			category:'knowledge',
			chance:250
	});
		new G.Tech({
		name:'Life-guiding',
		desc:'People wonder about their lives. Provides 50 [inspiration] for free. //Conclusions and guides related to life also spread making others being less insecure and help finding answers to questions like: What to do? What to choose? How should I live?',
		icon:[18,27,'magixmod'],
		req:{'philosophy':true,'<span style="color: ##FF0900">Paradise building</span>':true,'God\'s trait #3 Science^2':true},
		cost:{'insight':2220,'culture':500},
		effects:[
			{type:'provide res',what:{'inspiration':50}},
		],
	});
	new G.Tech({
		name:'Paradise shelters',
		desc:'Unlocks [paradise shelter]. Made out of stones with good construction can fit 4 people. Of course as the other Paradise housing is limited. <br>In addition adds +1 [housing] every 4 [paradise shelter]s.',
		icon:[14,27,'magixmod'],
		req:{'Paradise housing':true,'A leaf of wisdom':true},
		cost:{'insight II':150,'culture II':40,'influence II':10,'science':10,'insight':580},
		effects:[
		],
	});
	new G.Tech({
		name:'do we need that much science?',
		desc:'Halves amount of required [science] to roll/reroll new tech choices.',
		icon:[9,27,'magixmod'],
		req:{'A leaf of wisdom':true,'power of the faith':true},
		cost:{'insight II':150,'faith II':14,'science':16,'influence II':15,'insight':48},
		effects:[
		],
	});
	new G.Trait({
		name:'trial',
		desc:'You are being under the trial. As long as you are in the trial new rules will apply depending on the Trial you had chosen.',
		icon:[8,27,'magixmod'],
		req:{'tribalism':false},
		cost:{},
		effects:[
			{type:'function',func:function(){G.getDict('monument-building').desc='@unlocks wonder depending on Trial you are currently in'}},
		],
	});
	new G.Trait({
		name:'t1',
		displayName:'Chra-nos\' Trial',
		desc:'You are during Patience trial',
		icon:[7,27,'magixmod'],
		req:{'tribalism':false},
		cost:{},
			effects:[
			{type:'function',func:function(){t1start=true;}},
		],
	});
		new G.Tech({
		name:'construction III',
		desc:'All buildings that can waste wastes 5x slower. It won\'t increase building costs. @Provides 15 [wisdom II] .',
		icon:[12,27,'magixmod'],
		req:{'A leaf of wisdom':true,'Paradise shelters':true,'do we need that much science?':true},
		cost:{'insight II':180,'science':17,'influence II':3},
		effects:[
			{type:'provide res',what:{'wisdom II':15}},
		],
	});
	new G.Tech({
		name:'improved construction',
		desc:'All buildings that can waste wastes additive 2x slower so (7 in total). It won\'t increase building costs. @Provides 15 [wisdom II] .',
		icon:[11,27,'magixmod'],
		req:{'construction III':true,'<font color="maroon">Moderation</font>':true},
		cost:{'insight II':200,'science':14,'influence II':1},
		effects:[
			{type:'provide res',what:{'wisdom II':15}},
		],
	});
	new G.Tech({
		name:'mo\' shelterz',
		desc:'Decreases the [land] limit per for [paradise shelter]s by 4 points. It means more shelters. <>More shelters = more housing = more people @Provides 15 [wisdom II] .',
		icon:[10,27,'magixmod'],
		req:{'Paradise shelters':true,'<font color="maroon">Caretaking</font>':true},
		cost:{'insight II':200,'science':14,'influence II':1,'insight':500},
		effects:[
			{type:'provide res',what:{'wisdom II':15}},
		],
	});
	new G.Tech({
		name:'Outstanding wisdom',
		desc:'Make the Wisdom tree have even more leaves. Unlocks [The Outstander] who will provide more [wisdom II] and [education]. Provides 10 extra [wisdom II] upon tech obtain.',
		icon:[11,28,'magixmod'],
		req:{'A leaf of wisdom':true},
		cost:{'insight II':175,'science':10,'influence II':5,'culture II':15},
		effects:[
			{type:'provide res',what:{'wisdom II':10}},
		],
	});
	new G.Trait({
        name:'<font color="orange">Smaller shacks</font>',
        desc:'<span style="color: #aaffff">All [blacksmith workshop,Crafting units] and: [well]s , [Water filter]s (Caretaking filters uses 0.1 less land and Moderation filters will use 0.2 less land), [Wheat farm]s and [crematorium]s will use 15% less land.</span>',
        icon:[32,20,'magixmod'],
        cost:{},
	effects:[
		],
        req:{'tribalism':false},
	category:'knowledge',
	chance:1,
    });
	new G.Tech({
		name:'Enchanted shovels',
		desc:'Bigger shovels make [digger]s 12.5% more efficient. <> Now their shovels are enchanted by wind so despite that they are bigger they are still light. <>Also provides 5 [wisdom II]',
		icon:[15,28,'magixmod'],
		req:{'A leaf of wisdom':true},
		cost:{'insight II':150},
		effects:[
			{type:'provide res',what:{'wisdom II':5}},
		],
	});
	new G.Tech({
		name:'gt1',
		displayName:'Gatherer\'s trend:Sugar cane',
		desc:'You can pick one of two trends for the [gatherer]. This trend has an upgrade that you will unlock in later game stage.<>This trend will make [gatherer] gather a little more [Sugar cane] for you.<>It doesn\'t prevent you from gaining another trend for this unit which will be random trait and doesn\'t decrease income of other resources.',
		icon:[17,28,'magixmod'],
		req:{'Deeper wells':true,'gt2':false},
		cost:{'insight':1000,'culture':300},
		effects:[
		],
	});
	new G.Tech({
		name:'gt2',
		displayName:'Gatherer\'s trend:Fruits',
		desc:'You can pick one of two trends for the [gatherer]. This trend has an upgrade that you will unlock in later game stage.<>This trend will make [gatherer] gather a little more [fruit]s for you.<>It doesn\'t prevent you from gaining another trend for this unit which will be random trait and doesn\'t decrease income of other resources.',
		icon:[18,28,'magixmod'],
		req:{'Deeper wells':true,'gt1':false},
		cost:{'insight':1000,'culture':300},
		effects:[
		],
	});
	new G.Tech({
		name:'dit1',
		displayName:'Digger\'s trend:Clay',
		desc:'You can pick one of two trends for the [digger]. This trend has an upgrade that you will unlock in later game stage.<>This trend will make [digger] dig a little more [clay] for you.<>It doesn\'t prevent you from gaining another trend for this unit which will be random trait and doesn\'t decrease income of other resources.',
		icon:[19,28,'magixmod'],
		req:{'More humid water':true,'dit2':false},
		cost:{'insight':1100,'culture':431},
		effects:[
		],
	});
	new G.Tech({
		name:'dit2',
		displayName:'Digger\'s trend:Mud',
		desc:'You can pick one of two trends for the [digger]. This trend has an upgrade that you will unlock in later game stage.<>This trend will make [digger] dig a little more [mud] for you.<>It doesn\'t prevent you from gaining another trend for this unit which will be random trait and doesn\'t decrease income of other resources.',
		icon:[20,28,'magixmod'],
		req:{'More humid water':true,'dit1':false},
		cost:{'insight':1100,'culture':431},
		effects:[
		],
	});
	new G.Tech({
		name:'mt1',
		displayName:'Mining trend:Coal',
		desc:'You can pick one of two trends for the [mine]s.<>This trend will make [mine]\'s [coal] mode more efficient(it will mine bigger amounts of specific resource).<>It doesn\'t prevent you from gaining another trend for this unit which will be random trait and doesn\'t decrease income of other resources.',
		icon:[32,21,'magixmod'],
		req:{'Outstanding wisdom':true,'mt2':false},
		cost:{'insight II':260,'culture II':35},
		effects:[
		],
	});
	new G.Tech({
		name:'mt2',
		displayName:'Mining trend:Salt',
		desc:'You can pick one of two trends for the [mine]s.<>This trend will make [mine]\'s [salt] mode more efficient(it will mine bigger amounts of specific resource).<>It doesn\'t prevent you from gaining another trend for this unit which will be random trait and doesn\'t decrease income of other resources.',
		icon:[32,22,'magixmod'],
		req:{'Outstanding wisdom':true,'mt1':false},
		cost:{'insight II':260,'culture II':35},
		effects:[
		],
	});
	//Gatherer and Digger trend improvements
		new G.Tech({
		name:'gt1u2',
		displayName:'Sugar cane trend II',
		desc:'[Sugar cane] trend makes [gatherer]s gather more [Sugar cane] for you.',
		icon:[21,28,'magixmod'],
		req:{'gt1':true,'Policy revaluation':true},
		cost:{'insight II':110,'culture II':30},
		effects:[
		],
	});
	new G.Tech({
		name:'gt2u2',
		displayName:'Fruit trend II',
		desc:'[fruit] trend makes [gatherer]s gather more [fruit]s for you.',
		icon:[22,28,'magixmod'],
		req:{'gt2':true,'Policy revaluation':true},
		cost:{'insight II':110,'culture II':30},
		effects:[
		],
	});
	new G.Tech({
		name:'dit1u2',
		displayName:'Clay trend II',
		desc:'[clay] trend makes [digger]s dig more [clay] for you.',
		icon:[23,28,'magixmod'],
		req:{'dit1':true,'Policy revaluation':true},
		cost:{'insight II':100,'culture II':35,'influence II':10},
		effects:[
		],
	});
	new G.Tech({
		name:'dit2u2',
		displayName:'Mud trend II',
		desc:'[mud] trend makes [digger]s gather more [mud] for you.',
		icon:[24,28,'magixmod'],
		req:{'dit2':true,'Policy revaluation':true},
		cost:{'insight II':100,'culture II':35,'influence II':10},
		effects:[
		],
	});
	//Trait trends. A trait + tech trend is allowed
	new G.Trait({
		name:'cart1',
		displayName:'Carver\'s trend:Stone statuettes',
		desc:'[carver]s feel that [statuette] made out of stone is accepted better by this tribe than statuette from wood or other non-stone resource. <><b>Craft stone statuettes</b> mode is 5% more efficient.',
		icon:[32,24,'magixmod'],
		req:{'construction':true,'cart2':false},
		cost:{'insight':25,'culture':25},
		effects:[
		],
		chance:22,
		category:'main'
	});
	new G.Trait({
		name:'cart2',
		displayName:'Carver\'s trend:Wooden statuettes',
		desc:'[carver]s feel that [Wooden statuette,Statuette] made out of wood is accepted better by this tribe than statuette from stone or other non-wood resource. <><b>Craft wooden statuettes</b> mode is 5% more efficient.',
		icon:[32,23,'magixmod'],
		req:{'construction':true,'cart1':false},
		cost:{'insight':25,'culture':25},
		effects:[
		],
		chance:22,
		category:'main'
	});
	new G.Trait({
		name:'gtt1',
		displayName:'Gatherer\'s trend:Sticks',
		desc:'[gatherer] gains more [stick]s. Doesn\'t disable effect of Decisional trend related to this unit.',
		icon:[27,28,'magixmod'],
		req:{'construction II':true,'gtt2':false},
		cost:{'insight':250,'culture':125,'faith':62,'influence':36},
		effects:[
		],
		chance:22,
		category:'main'
	});
	new G.Trait({
		name:'gtt2',
		displayName:'Gatherer\'s trend:Water',
		desc:'[gatherer] gains more [water]. Doesn\'t disable effect of Decisional trend related to this unit.',
		icon:[28,28,'magixmod'],
		req:{'construction II':true,'gtt1':false},
		cost:{'insight':250,'culture':125,'faith':62,'influence':36},
		effects:[
		],
		chance:22,
		category:'main'
	});
	new G.Trait({
		name:'dtt1',
		displayName:'Digger\'s trend:Ice',
		desc:'[digger] gains more [ice]. Doesn\'t disable effect of Decisional trend related to this unit.',
		icon:[29,28,'magixmod'],
		req:{'Ink crafting':true,'dtt2':false},
		cost:{'insight':250,'culture':125,'faith':62,'influence':36},
		effects:[
		],
		chance:22,
		category:'main'
	});
	new G.Trait({
		name:'dtt2',
		displayName:'Digger\'s trend:Sand',
		desc:'[digger] gains more [sand]. Doesn\'t disable effect of Decisional trend related to this unit.',
		icon:[30,28,'magixmod'],
		req:{'Ink crafting':true,'dtt1':false},
		cost:{'insight':250,'culture':125,'faith':62,'influence':36},
		effects:[
		],
		chance:22,
		category:'main'
	});
	new G.Trait({
		name:'htt1',
		displayName:'Hunter\'s trend:Hide',
		desc:'[hunter] gains more [hide]. Doesn\'t disable effect of Decisional trend related to this unit.',
		icon:[31,28,'magixmod'],
		req:{'Hunting II':true,'htt2':false},
		cost:{'insight':250,'culture':125,'faith':62,'influence':36},
		effects:[
		],
		chance:22,
		category:'main'
	});
	new G.Trait({
		name:'htt2',
		displayName:'Hunter\'s trend:Meat',
		desc:'[hunter] gains more [meat]. Doesn\'t disable effect of Decisional trend related to this unit.',
		icon:[32,28,'magixmod'],
		req:{'Hunting II':true,'htt1':false},
		cost:{'insight':250,'culture':125,'faith':62,'influence':36},
		effects:[
		],
		chance:22,
		category:'main'
	});
	new G.Tech({
		name:'Outstanders club',
		desc:'Decreases [population] limit per one [The Outstander] from 38k to 26.5k. Provides extra 5 [wisdom II]',
		icon:[14,28,'magixmod'],
		req:{'Outstanding wisdom':true},
		cost:{'insight II':300,'science':15,'culture II':25},
		effects:[
			{type:'provide res',what:{'wisdom II':5}},
		],
	});
	new G.Tech({
		name:'Unbelieva-canes',
		desc:'[Sugar cane farm] is 225% more efficient(compounds).<>The number of this source of sugar in one farm is unbelieveable. :O @Provides extra 10 [wisdom II] ',
		icon:[13,28,'magixmod'],
		req:{'Outstanding wisdom':true},
		cost:{'insight II':320,'science':20},
		effects:[
			{type:'provide res',what:{'wisdom II':10}},
		],
	});
	new G.Tech({
		name:'Ink-fishing',
		desc:'Now fishing context contains [Ink]. <>Fishers from camp now are able to gather [Ink] out of some squids.',
		icon:[32,19,'magixmod'],
		req:{'Outstanding wisdom':true,'Hunters & fishers unification':true},
		cost:{'insight II':267,'science':20},
	});
	new G.Trait({
		name:'bonus1',
		displayName:'. . .',
		desc:'You seem powerful. Probably [Guru] can make more science',
		icon:[32,5,'magixmod'],
		req:{'tribalism':false},
		cost:{},
	});
	new G.Trait({
		name:'bonus2',
		displayName:'. . .',
		desc:'You have a potential and power. Feels like everything goes faster.',
		icon:[32,4,'magixmod'],
		req:{'tribalism':false},
		cost:{},
	});
	new G.Trait({
		name:'bonus3',
		displayName:'. . .',
		desc:'You are powerful. Your glory can lighten up some secret darkness.',
		icon:[32,3,'magixmod'],
		req:{'tribalism':false},
		cost:{},
	});
	new G.Trait({
		name:'bonus4',
		displayName:'. . .',
		desc:'You have . . . \'s attention. But who is he? Feels like that entity or whoever is proud of your strength.',
		icon:[32,2,'magixmod'],
		req:{'tribalism':false},
		cost:{},
	});
	new G.Tech({
		name:'aiming',
		desc:'Teach your [hunter]s and [fisher]s how to be more accurate. The problem was hunters were shooting arrows from bows without any preparation just on "try your luck". Same with spear throwing.<>Improved accuarcy will increase chances for successful hunting meaning that <b>Bow hunting</b> & <b>Spear hunting/fishing</b> are no longer penaltized.',
		icon:[33,28,'magixmod'],
		req:{'spears':true,'bows':true,'building':true},
		cost:{'insight':17,'influence':3},
	});
	new G.Trait({
		name:'t2',
		displayName:'Bersaria\'s Trial',
		desc:'You are during Unhappy trial',
		icon:[28,25,'magixmod',5,22,'magixmod'],
		req:{'tribalism':false},
		cost:{},
			effects:[
			{type:'function',func:function(){G.getDict('blood').hidden=false}},
		],
		
	});var most=50-(G.achievByName['Patience'].won/2)
	new G.Trait({
		name:'t3',
		displayName:'Tu-ria\'s Trial',
		desc:'You are during Cultural trial',
		icon:[27,25,'magixmod',1,22,'magixmod'],
		req:{'tribalism':false},
		cost:{},
			effects:[
		{type:'function',func:function(){G.getDict('cultural balance').desc='[cultural balance] is main rule of Cultural trial. Defines the rate of cultural stability in this plane. Reaching <b>50-(amount of times you completed Cultural/2)</b> or <b>'+(G.achievByName['Cultural'].won/2)+'</b> causes the trial to be failed. So be careful!';G.getDict('cultural balance').hidden=false;}},
				{type:'provide res',what:{'inspiration':10}},
				{type:'provide res',what:{'authority':5}},
		],
	});
		new G.Trait({
		name:'t4',
		displayName:'Hartar\'s Trial',
		desc:'You are during Hunted trial',
		icon:[26,25,'magixmod',1,22,'magixmod'],
		req:{'tribalism':false},
		cost:{},
			effects:[
			{type:'function',func:function(){G.getDict('blood').hidden=false}},
		],
	});
		new G.Tech({
		name:'beyond the edge',
		desc:'Send your people beyond the edge of the world for the first time. You will lose 30% of your current [population] and all [insight,Essentials] amounts will go 0 even if for this tech some of them are not required(it does not involve [Industry point]s or [Worship point]s) Also it will reset [happiness] and [health] to its primary state.<hr><font color="red">Note: It does not expand the map and it does not add any new goods. You will have extra 1.5% of your total land for your people. It may help you but there is a huge risk.</font>',
		req:{'Policy revaluation':true,'focused scouting':true},
		cost:{'insight II':45,'influence':255},
		icon:[33,26,'magixmod']
	});
		new G.Tech({
		name:'sleep-speech',
		desc:'@Unlocks special ability related to dreaming potential. <b>Sleepy insight</b>.. @Sleepy insight can be controlled by policy that will decide about: chance for bonus and power of it.<>Sleepy insight: a chance to obtain some [insight] at start of the new year.(amount and chance can be controlled by [sleepy insight] policy)',
		req:{'ritualism':true,'<font color="aqua">Genius feeling</font>':true},
		cost:{'insight':17,'influence':3},
		icon:[33,25,'magixmod']
	});
		new G.Tech({
		name:'coordination',
		desc:'[Thief hunter] has better coordination so he has twice as bigger chance to succesfully win <b>guard vs thief</b> confrontation. Also it may lead to unlock more types of guard.',
		icon:[33,27,'magixmod'],
		req:{'Battling thieves':true},
		cost:{'insight':260},
		effects:[
		],
		chance:3
	});	
	new G.Trait({
		name:'t10',
		displayName:'Mamuun\'s trial',
		desc:'You are during Pocket trial',
		icon:[20,25,'magixmod',5,22,'magixmod'],
		req:{'tribalism':false},
		cost:{},
			effects:[
			{type:'function',func:function(){}}
		],
		
	});
	new G.Tech({
		name:'valid portal frame',
		desc:'Before wizards will be able to open a gate to new world they must know some rules. Without valid frame portal will not open or worse , it may explode.',
		icon:[10,29,'magixmod'],
		req:{'Wizard complex':true,'Belief in portals':true},
		cost:{'insight':1015},
	});
	new G.Tech({
		name:'wonder \'o science',
		desc:'Unlocks [scientific university]. [scientific university] is a wonder that can be upgraded. To unlock further tiers you need to complete Trials at higher levels meaning higher difficulty. University by itself can provide way more [education] and [wisdom II]. Also it may lead to some new discoveries.',
		icon:[11,29,'magixmod'],
		req:{'Outstanders club':true,'monument-building III':true},
		cost:{'insight II':305,'culture II':25,'culture':65},
	});
	 new G.Trait({
        name:'well stored',
	displayName:'<font color="gold">Well stored I</font>',
        desc:'<font color="#aaaaff">All storage units(except Essences storages) provide 35% more storage. Complete Pocket for 2nd time to increase this bonus from 35 to 55%. Bonus does not stack with [Spell of capacity].</font>',
        icon:[12,15,'magixmod',13,15,'magixmod'],
        cost:{},
	effects:[
	],	
        req:{'tribalism':false},
		category:'knowledge'
    });
	new G.Trait({
        name:'well stored 2',
	displayName:'<font color="#d0ab34">Well stored II</font>',
        desc:'<font color="#aaaaff">All storage units(except Essences storages) provide 55% more storage. You reached maximum bonus that Mamuun can provide to you for completing Pocket. Bonus does not stack with [Spell of capacity].</font>',
        icon:[11,15,'magixmod',13,15,'magixmod'],
        cost:{},
	effects:[
	],	
        req:{'tribalism':false},
		category:'knowledge',
    });
	new G.Tech({
		name:'beyond the edge II',
		desc:'Send your people beyond the edge of the world for the second time. You will lose 40% of your current [population] , all remaining [adult]s will become [sick] and all [insight,Essentials] amounts will go 0 even if for this tech some of them are not required(it does not involve [Industry point]s or [Worship point]s) Also it will reset [happiness] and [health] to its primary state.<hr><font color="red">Note: It does not expand the map and it does not add any new goods. You will have extra 5.5% of your total land for your people(7% in total). It may help you but there is a huger than before risk. The further you push beyond the edge the stronger scourge will fall on you and your civilization.</font>',
		req:{'beyond the edge':true,'wonder \'o science':true},
		cost:{'insight II':345,'science':26,'culture II':24},
		icon:[0,30,'magixmod'],
		effects:[
			{type:'provide res',what:{'wisdom II':20}},
			{type:'provide res',what:{'education':2}},
		]
	});
	new G.Tech({
		name:'mirrors',
		desc:'People now know how mirror works and even how to make mirror effect.',
		req:{'Burial in new world':true},
		cost:{'insight':615},
		icon:[8,30,'magixmod'],
		effects:[
			{type:'provide res',what:{'wisdom II':20}},
			{type:'provide res',what:{'education':2}},
		]
	});
	new G.Tech({
		name:'parallel theory 1/3',
		desc:'What if you can make mirror work like portal? //This part of theory is about whole concept.',
		req:{'Laws of physics(intermediate)':true,'mirrors':true},
		cost:{'insight':1600},
		icon:[28,27,'magixmod',9,30,'magixmod'],
		effects:[
		]
	});
	new G.Tech({
		name:'parallel theory 2/3',
		desc:'What if you can make mirror work like portal? //This part of theory is about portal and stability.',
		req:{'Laws of physics(intermediate)':true,'parallel theory 1/3':true,'symbolism III':true},
		cost:{'insight II':150},
		icon:[27,27,'magixmod',9,30,'magixmod'],
		effects:[
		]
	});
	new G.Tech({
		name:'parallel theory 3/3',
		desc:'What if you can make mirror work like portal? //This part is related to misc things about mirror world concept.',
		req:{'parallel theory 2/3':true,'wonder \'o science':true},
		cost:{'insight II':400,'science':60,'culture II':30,'faith II':30,'influence II':25},
		icon:[26,27,'magixmod',9,30,'magixmod'],
		effects:[
		]
	});
	new G.Tech({
		name:'mirror world 1/2',
		desc:'Unlocks a [grand mirror] which will double your [land] amount. It compounds with bonuses from: [beyond the edge] and [beyond the edge II]. Costs , display depends on chosen by your people path. In fact it is a passage to exact copy of world you met before your civilization have set their first shelter/dwelling. Make sure you fullfill upkeep of that because if you do not then [grand mirror] will disable and you will lose your land.',
		req:{'parallel theory 3/3':true,'wonder \'o science':true,'Bigger university':true},
		cost:{'insight II':400,'science':62,'culture II':38},
		icon:[27,3,'magixmod',10,30,'magixmod'],
		effects:[
		]
	});
	new G.Tech({
		name:'mirror world 2/2',
		desc:'From that point amount of main [land] is doubled. Enjoy... It is seriously time to stop. <b><br>The more worlds you open the more unstable world will become...</b>',
		req:{'mirror world 1/2':true},
		cost:{'insight II':420,'science':62,'culture II':38,'faith II':30,'emblem \'o mirror':1},
		icon:[27,2,'magixmod',10,30,'magixmod'],
		effects:[
		]
	});
	new G.Tech({
		name:'Bigger university',
		desc:'@Unlocks 2nd level of [scientific university]. Requires 4 [victory point]s to level up. Unlocks [grand mirror].',
		icon:[9,29,'magixmod'],
		cost:{'insight II':426,'university point':300,'science':50},
		req:{'wonder \'o science':true,'Wizard complex':true},
	});
	new G.Tech({
		name:'druidism',
		desc:'@unlocks [druid] @Gathers more [faith] and [happiness] than [soothsayer] but is limited.',
		icon:[25,30,'magixmod'],
		cost:{'insight':35,'faith':5,'culture':25,'influence':10},
		req:{'ritualism':true,'symbolism':true,'language':true},
	});
	new G.Trait({
        name:'druidsymbolism1',
	displayName:'Druid\'s symbolism of happiness',
        desc:'[druid] gathers 33% more [happiness].',
        icon:[27,30,'magixmod'],
        cost:{'faith':5,'culture':15},
	effects:[
	],	
        req:{'druidism':true,'druidsymbolism2':false},
	chance:100
    });
	new G.Trait({
        name:'druidsymbolism2',
	displayName:'Druid\'s symbolism of faith',
        desc:'[druid] gathers 18% more [faith].',
        icon:[28,30,'magixmod'],
        cost:{'faith':5,'culture':15},
	effects:[
	],	
        req:{'druidism':true,'druidsymbolism1':false},
	chance:100
    });
	new G.Trait({
        name:'gardening',
        desc:'<font color="#aaffff">A key for farms. People learn how to make a irrigation system. Thanks to it they may start thinking about making some small gardens, then expand them to farms or even plantations.</font>',
        icon:[10,0,'magixmod'],
        cost:{'insight':40},
	effects:[
	],	
        req:{'druidism':true,'city planning':true},
	chance:75,
		category:'knowledge'
    });
	  new G.Tech({
		name:'deep mining & quarrying',
		desc:'@Unlocks two new territory contexts: Deep mining and Deep quarrying',
		icon:[10,1,'magixmod'],
		cost:{'insight II':125,'influence II':10,'science':5},
		req:{'A leaf of wisdom':true,'prospecting II':true},
    effects:[
    	{type:'show context',what:['deep mine']},
      	{type:'show context',what:['deep quarry']},
    {type:'function',func:function(){}}
    ]
	});
	new G.Tech({
		name:'mining II',
		desc:'Strike the earth... even stronger! For new minerals, new mystical wonders. @[mine]s can mine even deeper. To unlock prospecting for them get [prospecting III] research.',
		icon:[12,1,'magixmod'],
		cost:{'insight II':190,'science':12,'culture II':8},
		req:{'digging':true,'construction':true,'Eotm':true,'deep mining & quarrying':true},
		effects:[
		],
	});
	new G.Tech({
		name:'quarrying III',
		desc:'Quarries can reach even deeper discovering new resources. However some minerals can be only gathered via quarrying. @If [prospecting III] obtained it will unlock new mode that will mainly focus on gathering these minerals.',
		icon:[12,0,'magixmod'],
		cost:{'insight II':170,'science':12,'faith II':4,'culture II':2,'influence II':2},
		req:{'quarrying II':true,'cozy building':true,'deep mining & quarrying':true,'Eotm':true},
		effects:[
		],
	});
	new G.Tech({
		name:'prospecting III',
		desc:'[prospecting] improvements: @[mine]s - Minerals from context <b>Deep mining</b> (adds also Any mode but this one will only mine via context Deep mining) @[quarry,Quarries] - New mode that will gather 3x more minerals that can be only obtained by quarrying but 6x less of resources other than minerals.',
		icon:[11,1,'magixmod'],
		cost:{'insight II':200,'science':15,'influence II':5},
		req:{'quarrying II':true,'cozy building':true,'deep mining & quarrying':true,'Eotm':true},
		effects:[
		],
	});
		new G.Tech({
		name:'furnace modernization',
		desc:'<b>Furnace</b> becomes <B>Blackium furnace</b>. Requires 3x as more upkeep but: can smelt plenty of new ores and is 2% more efficient regardless of path chosen by your people.',
		icon:[8,12,11,0,'magixmod',0,18,'magixmod'],
		cost:{'insight II':235,'science':15},
		req:{'quarrying III':true,'mining II':true,'deep mining & quarrying':true,'Mo\' beauty':true},
		effects:[
		],
	});
	new G.Tech({
        name:'time measuring 1/2',
        desc:'People know how to measure time. Now you\'ll be able to see which year is currently. //To expand it and see days obtain 2nd part of this research.',
        icon:[27,3,'magixmod',34,30,'magixmod'],
        cost:{'insight':50},
	effects:[
	],	
        req:{'Intermediate maths':true,'primary time measure':true},
	chance:10
    });
	new G.Trait({
        name:'time measuring 2/2',
        desc:'<font color="#aaffff">Now you will see which year and day currently is.</font>',
        icon:[27,2,'magixmod',34,30,'magixmod'],
        cost:{'insight':400},
	effects:[
	],	
        req:{'time measuring 1/2':true,'Belief in portals':true},
	chance:75,
		category:'knowledge'
    });
	new G.Tech({
		name:'osmium-working',
		desc:'@[furnace]s can now make [soft metal ingot]s from [osmium ore]<>',
		icon:[16,30,'magixmod'],
		cost:{'insight II':183,'science':2},
		req:{'mining II':true,'furnace modernization':true},
	});
	new G.Tech({
		name:'lead-working',
		desc:'@[furnace]s can now make [hard metal ingot]s from [lead ore]<>',
		icon:[13,30,'magixmod'],
		cost:{'insight II':183,'science':2},
		req:{'mining II':true,'furnace modernization':true},
	});
  new G.Tech({
		name:'mythril-working',
		desc:'@[furnace]s can now make [precious metal ingot]s from [mythril ore]@[blacksmith workshop] can now forge [mythril block] out of [mystical metal ingot]s.<>',
		icon:[14,30,'magixmod'],
		cost:{'insight II':200,'science':5},
		req:{'mining II':true,'furnace modernization':true},
	});
  new G.Tech({
		name:'zinc-working',
		desc:'@[furnace]s can now make [hard metal ingot]s from [zinc ore]<>',
		icon:[15,30,'magixmod'],
		cost:{'insight II':183,'science':2},
		req:{'mining II':true,'furnace modernization':true},
	});

 new G.Tech({
		name:'blackium-working',
		desc:'@[furnace]s can now make [mystical metal ingot]s from [blackium ore]<>',
		icon:[17,30,'magixmod'],
		cost:{'insight II':180},
		req:{'mining II':true,'furnace modernization':true},
	});
	new G.Tech({
		name:'dinium & unknownium working',
		desc:'@[furnace]s can now make [mystical metal ingot]s from [dinium ore] and [unknownium ore]. However there is 50% chance that it will succed.<>',
		icon:[18,30,'magixmod'],
		cost:{'insight II':300,'science':30},
		req:{'mining II':true,'furnace modernization':true,'wonder \'o science':true,'osmium-working':true,'blackium-working':true,'zinc-working':true,'mythril-working':true,'lead-working':true},
	});
		new G.Trait({
        name:'primary time measure',
        desc:'<font color="#aaffff">People now can measure passing time in centuries. </font>',
        icon:[34,29,'magixmod'],
        cost:{'culture':10},
	effects:[
	],	
        req:{'oral tradition':true},
	chance:12,
		category:'knowledge'
    });
	new G.Tech({
		name:'block-smithery',
		desc:'@Unlocks [block-smith workshop]. Subtype of [blacksmith workshop] which will forge blocks out of precious resources. @Due to it original [blacksmith workshop] will no longer forge blocks. @Uses [Land of the Plain Island].<>',
		icon:[20,30,'magixmod'],
		cost:{'insight II':340,'science':40},
		req:{'dinium & unknownium working':true,'mirror world 1/2':true},
	});
	new G.Tech({
		name:'handwashC',
		displayName:'Handwashing',
		desc:'People will now wash their hands. However they do not know how to make a soap. At least water can clean hands. Raises up a little bit [health] level.',
		icon:[8,18,'magixmod'],
		req:{'<font color="maroon">Caretaking</font>':true,'<font color="maroon">Moderation</font>':false},
		cost:{'insight':435},
		effects:[
		],
		chance:3
	});	
	new G.Tech({
		name:'handwashM',
		displayName:'Handwashing',
		desc:'People will now wash their hands. However they do not know how to make a soap also focused on technological progress more than on their health they\'ll forget to do it sometime.. At least water can clean hands. Raises up a little bit [health] level.',
		icon:[34,24,'magixmod'],
		req:{'<font color="maroon">Moderation</font>':true,'<font color="maroon">Caretaking</font>':false},
		cost:{'insight':435},
		effects:[
		],
		chance:3
	});	
	new G.Tech({
		name:'primary intuition',
		desc:'[primary intuition] is like a key to researching. However if [population,people] will expand their intuition they should be able to think about further researching. //Having just [primary intuition] allows you to research up to [oral tradition] tech. More complicated researches like sewing, crafting can be unlocked only with "secondary" [intuition].',
		startWith:true,
		icon:[34,31,'magixmod'],
	});
	new G.Trait({
		name:'intuition',
		desc:'[intuition] opens a way to more complex researching. Researches related to crafting, building, planning etc can be "on plan" since this moment.',
		icon:[35,31,'magixmod'],
		chance:1.75,
		cost:{'culture':1,'insight':1,'influence':1},
		req:{'oral tradition':true},
	});
	new G.Tech({
		name:'manufacture units II',
		desc:'Now more units will be merged into one. [artisan]s : craft [stone weapons],[stone tools],[bow]s , [basket]s modes will no longer be available for [artisan]/[artisan] will no longer work in this mode. ',
		icon:[16,31,'magixmod'],
		req:{'<font color="maroon">Moderation</font>':false,'<font color="maroon">Caretaking</font>':true,'Manufacture units I':true,'Outstanding wisdom':true,'wonder \'o science':true},
		cost:{'insight II':335},
		effects:[
		],
		chance:3
	});
		new G.Tech({
		name:'mentors of nature',
		desc:'[druid]s now generate [health] . //Some people call\'em nature\'s descendants. Probably this is the reason.',
		icon:[31,31,'magixmod'],
		req:{'Wizard complex':true,'<font color="orange">Smaller but efficient</font>':true},
		cost:{'insight':750},
		effects:[
		],
		chance:3
	});	
		new G.Trait({
        name:'no knapping anymore',
        desc:'Depending on chosen path people will produce way less [knapped tools]. Also [healer], [digger] and [woodcutter] will use now [stone tools] instead of [knapped tools] However it won\'t increase their efficiency. //For [<font color="maroon">Moderation</font>] it is 95% //For [<font color="maroon">Caretaking</font>] it is 80%',
        icon:[27,31,'magixmod'],
        cost:{'culture II':10},
	effects:[
	],	
        req:{'oral tradition':true},
	chance:50,
    });
	new G.Tech({
		name:'factories II',
		desc:'Now more units will be merged into one. [artisan]s : craft [stone weapons],[stone tools],[bow]s , [basket]s modes will no longer be available for [artisan]/[artisan] will no longer work in this mode. Also [firekeeper] from now can only cook because this tech will unlock unit that will craft more [fire pit]s but will have way bigger upkeep. ',
		icon:[17,31,'magixmod'],
		req:{'<font color="maroon">Moderation</font>':true,'<font color="maroon">Caretaking</font>':false,'Factories I':true,'Outstanding wisdom':true,'wonder \'o science':true},
		cost:{'insight II':335},
		effects:[
		],
		chance:3
	});
	new G.Tech({
		name:'villas of victory',
		desc:'provides 15 [inspiration II],5 [spirituality II] and [authority II]. //Unlocks villa of victory(WIP). New way to give people housing... //This unit will provide amount of housing equal to result of equation below: //<font color="aqua">(victory points+1)*5</font>',
		icon:[0,31,'magixmod'],
		req:{'Bigger university':true},
		cost:{'insight II':325,'science':50,'culture II':25},
		effects:[
			{type:'provide res',what:{'inspiration II':15}},
			{type:'provide res',what:{'spirituality II':5}},
			{type:'provide res',what:{'authority II':5}},
		],
		chance:3
	});
	new G.Tech({
		name:'dynamics',
		desc:'Provides 25 [wisdom] for free. The tech that will help people get to way more complicated researches.',
		icon:[32,31,'magixmod'],
		req:{'Laws of physics(basic)':true,'God\'s trait #3 Science^2':true},
		cost:{'insight':1400,'science':1},
		effects:[
			{type:'provide res',what:{'wisdom':25}},
		],
		chance:30
	});
		new G.Tech({
		name:'"dark season"',
		desc:'People will try make fun out of spooky things. They won\'t need help of anyone outside your tribe. Prepare for festival of fear - that\'s what one of your '+G.getName('inhab')+' said to you.',
		icon:[5,7,'seasonal'],
		req:{'tribalism':false,'<span style="color: yellow">Culture of celebration</span>':true,'sedentism':true,'intuition':true},//tribalism switches to true when halloween season starts
		cost:{'culture':30,'faith':5},
		effects:[
		],
		chance:3
	});
	new G.Tech({
		name:'pumpkins',
		desc:'From now you can find pumpkins that will give you some treats... but some of them are just a tricks. This should help your civilization grow up. // <b>Happy halloween!</b> <br><font color="red">Note! It won\'t make you get pumpkins pernamently. Once Haloween ends you won\'t be able to get new Pumpkins till next Haloween. You can only get them during Haloween season.</font>',
		icon:[6,7,'seasonal'],
		req:{'"dark season"':true},
		cost:{'insight':100},
		effects:[
		],
		chance:3
	});
	new G.Tech({
		name:'pumpkins II',
		desc:'You can find pumpkins that will give you [insight,Essentials] , [Juices] and many more.',
		icon:[10,7,'seasonal'],
		req:{'pumpkins':true,'Beginnings of alchemy':true},
		cost:{'insight':1000},
		effects:[
		],
		chance:3
	});
		//New DTs and GTs
	new G.Trait({
        name:'dt19',
	displayName:'Devil\'s trait #19 Extinguishion',
        desc:'Everything related to [Fire essence] produces 12% less of [Fire essence,The Essence].(except [Wizard Complex])',
        icon:[34,23,'magixmod'],
        cost:{'culture II':10,'influence II':1,'wisdom':10,'faith II':1},
	effects:[
	],	
        req:{'oral tradition':true,'Doctrine of the dark wormhole 5/5':true,'gt7':false},
	chance:50,
	category:'devils'
    });
	new G.Trait({
        name:'dt20',
	displayName:'Devil\'s trait #20 Secret thirst',
        desc:'Everything related to [Water essence] produces 12% less of [Water essence,The Essence].(except [Wizard Complex])',
        icon:[34,22,'magixmod'],
        cost:{'culture II':10,'influence II':1,'wisdom':10,'faith II':1},
	effects:[
	],	
        req:{'oral tradition':true,'Doctrine of the dark wormhole 5/5':true,'gt8':false},
	chance:50,
	category:'devils'
    });
	new G.Trait({
        name:'dt21',
	displayName:'Devil\'s trait #21 Atmospheric silence',
        desc:'Everything related to [Wind essence] produces 12% less of [Wind essence,The Essence].(except [Wizard Complex])',
       icon:[34,21,'magixmod'],
        cost:{'culture II':10,'influence II':1,'wisdom':10,'faith II':1},
	effects:[
	],	
        req:{'oral tradition':true,'Doctrine of the dark wormhole 5/5':true,'gt9':false},
	chance:50,
		category:'devils'
    });
	new G.Trait({
        name:'dt22',
	displayName:'Devil\'s trait #22 Drought',
        desc:'Everything related to [Nature essence] produces 12% less of [Nature essence,The Essence].(except [Wizard Complex])',
       icon:[34,20,'magixmod'],
        cost:{'culture II':10,'influence II':1,'wisdom':10,'faith II':1},
	effects:[
	],	
        req:{'oral tradition':true,'Doctrine of the dark wormhole 5/5':true,'gt10':false},
	chance:50,
		category:'devils'
    });
	new G.Trait({
        name:'dt23',
	displayName:'Devil\'s trait #23 Discharge',
        desc:'Everything related to [Lightning essence] produces 12% less of [Lightning essence,The Essence].(except [Wizard Complex])',
        icon:[34,19,'magixmod'],
        cost:{'culture II':10,'influence II':1,'wisdom':10,'faith II':1},
	effects:[
	],	
        req:{'oral tradition':true,'Doctrine of the dark wormhole 5/5':true,'gt11':false},
	chance:50,
		category:'devils'
    });
	new G.Trait({
        name:'dt24',
		displayName:'Devil\'s trait #24 Deterrence',
        desc:'Everything related to [Dark essence] produces 12% less of [Dark essence,The essence].(except [Wizard Complex])',
       icon:[34,18,'magixmod'],
        cost:{'culture II':10,'influence II':1,'wisdom':10,'faith II':1},
	effects:[
	],	
        req:{'oral tradition':true,'Doctrine of the dark wormhole 5/5':true,'gt12':false},
	chance:50,
		category:'devils'
    });
	new G.Trait({
        name:'gt7',
		displayName:'God\'s trait #7 Triumphal flame',
        desc:'A [Fire essence] becomes the Trend of Gods. Everything related to [Fire essence] (except [Wizard Complex]) produces 2% more of this Essence.',
        icon:[35,23,'magixmod'],
        cost:{'culture II':10,'influence II':1,'wisdom':10,'faith II':1},
	effects:[
	],	
        req:{'oral tradition':true,'Doctrine of the dark wormhole 5/5':true,'dt19':false},
	chance:50,
		category:'gods'
    });
	new G.Trait({
        name:'gt8',
		displayName:'God\'s trait #8 Holy rain',
        desc:'A [Water essence] becomes the Trend of Gods. Everything related to [Water essence] (except [Wizard Complex]) produces 2% more of this Essence.',
        icon:[35,22,'magixmod'],
        cost:{'culture II':10,'influence II':1,'wisdom':10,'faith II':1},
	effects:[
	],	
        req:{'oral tradition':true,'Doctrine of the dark wormhole 5/5':true,'dt20':false},
	chance:50,category:'gods'
    });
	new G.Trait({
        name:'gt9',
		displayName:'God\'s trait #9 Windy wisdom',
        desc:'A [Wind essence] becomes the Trend of Gods. Everything related to [Wind essence] (except [Wizard Complex]) produces 2% more of this Essence.',
       icon:[35,21,'magixmod'],
        cost:{'culture II':10,'influence II':1,'wisdom':10,'faith II':1},
	effects:[
	],	
        req:{'oral tradition':true,'Doctrine of the dark wormhole 5/5':true,'dt21':false},
	chance:50,category:'gods'
    });
	new G.Trait({
        name:'gt10',
		displayName:'God\'s trait #10 Natural merge',
        desc:'A [Nature essence] becomes the Trend of Gods. Everything related to [Nature essence] (except [Wizard Complex]) produces 2% more of this Essence.',
        icon:[35,20,'magixmod'],
        cost:{'culture II':10,'influence II':1,'wisdom':10,'faith II':1},
	effects:[
	],	
        req:{'oral tradition':true,'Doctrine of the dark wormhole 5/5':true,'dt22':false},
	chance:50,category:'gods'
    });
	new G.Trait({
        name:'gt11',
		displayName:'God\'s trait #11 Electricity',
        desc:'A [Lightning essence] becomes the Trend of Gods. Everything related to [Lightning essence] (except [Wizard Complex]) produces 2% more of this Essence.',
        icon:[35,19,'magixmod'],
        cost:{'culture II':10,'influence II':1,'wisdom':10,'faith II':1},
	effects:[
	],	
        req:{'oral tradition':true,'Doctrine of the dark wormhole 5/5':true,'dt23':false},
	chance:50,category:'gods'
    });
	new G.Trait({
        name:'gt12',
		displayName:'God\'s trait #12 Dark bait',
        desc:'A [Dark essence] becomes the Trend of Gods. Everything related to [Dark essence] (except [Wizard Complex]) produces 2% more of this Essence.',
        icon:[35,18,'magixmod'],
        cost:{'culture II':10,'influence II':1,'wisdom':10,'faith II':1},
	effects:[
	],	
        req:{'oral tradition':true,'Doctrine of the dark wormhole 5/5':true,'dt24':false},
	chance:50,category:'gods'
    });
	new G.Tech({
		name:'tool rafinery 1/2',
		desc:'Old... not so primitive but still old and easily craftable. Is there a way to make them decay slower? Probably people will figure it out later.',
		icon:[26,31,'magixmod'],
		req:{'Paradise crafting':true},
		cost:{'insight':1500,'wisdom':15},
		effects:[
		],
		chance:3
	});
	new G.Trait({
        name:'deep-rooted faith',
        desc:'Provides @50 [spirituality II] , [spirituality] @90 [inspiration II]. //Religion built for centuries yet milleniums is deep rooted meaning that almost nothing can make this religion die. ',
       icon:[35,24,'magixmod'],
        cost:{'culture II':50,'faith II':35,'insight II':350,'science':60},
	effects:[
		{type:'provide res',what:{'spirituality II':50}},
		{type:'provide res',what:{'spirituality':50}},
		{type:'provide res',what:{'inspiration II':90}},
	],	
        req:{'villas of victory':true},
	chance:50,
		category:'main'
    });
	new G.Tech({
		name:'dynamics II',
		desc:'@Way more descriptions of dynamics. @Gravity description @provides 2[education] @upon obtain provides exclusively 2 [faith II] and 2 [influence II] @Thanks to more exact descriptions high-level researches may be easier.',
		icon:[32,31,'magixmod'],
		req:{'Laws of physics(intermediate)':true,'God\'s trait #3 Science^2':true,'Doctrine of the dark wormhole 2/5':true},
		cost:{'insight II':200,'science':15},
		effects:[
			{type:'provide res',what:{'wisdom':25}},
		],
		chance:30
	});
	new G.Tech({
		name:'tool rafinery 2/2',
		desc:'[stone tools,Stone tools] become [stone tools,Refined tools] making them decay slower. Also [artisan] is no longer able to craft them but... obtain [factories II] or [manufacture units II] to unlock unit that will let you craft them again if you do not have it yet.',
		icon:[25,31,'magixmod'],
		req:{'Outstanding wisdom':true,'wonder \'o science':true},
		cost:{'insight II':150,'science':5,'insight':30},
		effects:[
		],
		chance:3
	});
	new G.Tech({
		name:'at(ct)',
		displayName:'Automation',
		desc:'Caretaking has one feature: people do not focus that much on industrialization or technological progress / innovations. That means some part of automation people will want to discover later but they won\'t want to make every single thing being automated.',
		icon:[15,31,'magixmod'],
		req:{'Paradise crafting':true,'Bigger university':true},
		cost:{'insight':1500,'wisdom':15},
		effects:[
		],
		chance:3
	});
	new G.Tech({
		name:'even bigger university',
		desc:'@Unlocks 3rd level of [scientific university]. Requires 10 [victory point]s to level up.',
		icon:[21,30,'magixmod'],
		cost:{'insight II':600,'university point':300,'science':80,'culture II':115,'faith II':80},
		req:{'wonder \'o science':true,'Wizard complex':true,'Bigger university':true,'deep-rooted faith':true,'dynamics II':true},		
	});
	new G.Trait({
        name:'brahim the angel of authority',
        desc:'Provides 15 [spirituality II] and 15 [authority II]',
       icon:[35,30,'magixmod'],
        cost:{'faith II':40,'influence II':30,'culture II':30},
	effects:[
		{type:'provide res',what:{'spirituality II':15}},
		{type:'provide res',what:{'authority II':15}},
	],	
        req:{'villas of victory':true,'sergius the angel of belief':false},
	chance:500,
		category:'religion',
    });
	new G.Trait({
        name:'sergius the angel of belief',
        desc:'Provides 30 [spirituality II]',
       icon:[35,29,'magixmod'],
        cost:{'faith II':40,'influence II':30,'culture II':30},
	effects:[
		{type:'provide res',what:{'spirituality II':30}},
	],	
        req:{'villas of victory':true,'brahim the angel of authority':false},
	chance:500,
		category:'religion',
    });
	new G.Trait({
		name:'spark\'o religion',
		desc:'[spark\'o religion] opens a way to [ritualism] and things related to <b>Religion</b> such like cults, courie, spirits. Who knows if you can even reach some sort of... [Magic essences,Magic] ?',
		icon:[35,15,'magixmod'],
		chance:1.3,
		cost:{'culture':2},
		req:{'oral tradition':true},
		category:'religion'
	});
	new G.Trait({
		name:'t11',
		displayName:'Enlightened\' Trial',
		desc:'You are during Faithful trial',
		icon:[19,25,'magixmod',1,22,'magixmod'],
		req:{'tribalism':false,'trial':true},
		cost:{},
			effects:[
			{type:'provide res',what:{'spirituality':100,'faith':100}},
		],
	});
	new G.Tech({
		name:'tile inspection',
		desc:'@From now you can inspect discovered tiles in <b>Territory</b> tab just by clicking on them. //@You can see goods and their density on the tile. @Also you can inspect newly discovered tiles and get full info about its goods. @<font color="red">However you still can\'t see more exactly how many of the resource do you have in the territory.</font>',
		icon:[34,14,'magixmod'],
		cost:{'insight':10,'culture':15},
		req:{'intuition':true,'scouting':true,'plant lore':true,'hunting':true},		
	});
	new G.Trait({
		name:'tile inspection II',
		desc:'@Now you can see how many of resources you have totally in your territory',
		icon:[35,14,'magixmod'],
		cost:{'insight':50},
		req:{'Basic maths':true,'tile inspection':true,'writing':true,'alphabet 1/3':true},	
		chance:30,
		category:'knowledge'
	});
	new G.Trait({
		name:'enlightenment',
		desc:'[soothsayer]s and [druid]s from now are more efficient. //@[soothsayer] has more chance to succed [faith] production. [Church] generates 2% more [faith]. Also every 5 [Church,Churches] you will gain 1 [spirituality]. //<font color="red">Note:[enlightenment] is fragile and can no longer work once any evolution will occur.</font>',
		icon:[35,28,'magixmod'],
		req:{'tribalism':false},	
		chance:30,
		category:'religion'
	});
	
	//* * * * * CHRISTMAS TECHS/TRAITS * * * * *
	new G.Tech({
		name:'winter holidays',
		desc:'@You want to bring one of events/festives you know from somewhere else right to your tribe. The hint word: Winter. //It is all about snow, snowmen, etc. However no one showed even to your people how does snowman look like or what a winter ornament is. //[digger]s will start digging for [snow] if available.',
		icon:[1,10,'seasonal'],
		cost:{'insight':210,'culture':45,'faith':5},
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'philosophy':true,'tribalism':false},
	});
	new G.Tech({
		name:'the christmas',
		displayName:'<font color="cyan">The Christmas</font>',
		desc:'@People acknowledged to symbols of that event will not only expand your symbolics but also make decors like ornaments, lights. //(WIP) Note: For that short while Christmas Seasonals patch is test one. Unlocks Lodge of Christmas.',
		icon:[2,10,'seasonal'],
		cost:{'insight':400,'culture':100,'faith':32},
		req:{'<span style="color: yellow">Culture of celebration</span>':true,'Wizard complex':true,'tribalism':false,'winter holidays':true},
	});
	new G.Tech({
		name:'carols',
		desc:'Christmas is a special time. Now people will sing/play not only normal songs but also they are no afraid to sing/play carols. //[musician] now crafts [christmas essence]',
		icon:[9,10,'seasonal'],
		cost:{'insight II':20,'culture II':30,'christmas essence':1020},
		req:{'symbolism II':true,'ritualism II':true,'Music':true,'tribalism':false},
	});

	new G.Trait({
        name:'xmas1',
		displayName:'Christmas climate: Artisans',
        icon:[10,11,'seasonal'],
	effects:[
	],	
        req:{'tribalism':false},
	category:'seasonal'
    });
	new G.Trait({
        name:'xmas2',
		displayName:'Christmas climate: Clothiers',
        icon:[11,11,'seasonal'],
	effects:[
	],	
        req:{'tribalism':false},
	category:'seasonal'
    });
	new G.Trait({
        name:'xmas3',
		displayName:'Christmas climate: Potters',
        icon:[12,11,'seasonal'],
	effects:[
	],	
        req:{'tribalism':false},
	category:'seasonal'
    });
	new G.Trait({
        name:'xmas4',
		displayName:'Christmas climate: Carving',
        icon:[13,11,'seasonal'],
	effects:[
	],	
        req:{'tribalism':false},
	category:'seasonal'
    });
	new G.Tech({
		name:'snowmen',
		desc:'Since [digger] can dig for snow and you can describe and be understood you can explain what is and how does snowman look like. //Gain [the christmas] so you will unlock Lodge of Christmas. @Unlocks a snowmen creator.',
		icon:[10,10,'seasonal'],
		cost:{'insight':95,'culture':50},
		req:{'winter holidays':true},
	});
	new G.Tech({
		name:'festive robot print',
		desc:'A [festive robot print] may help you to gather [christmas essence] outta snowmen kids constructed. Works slowly and only one can be placed but later you will unlock magical overclocks. @However with each overclock a chance to lose a snowman upon [christmas essence,Essence] feed increase by some amount that its speed increases.',
		icon:[14,11,'seasonal'],
		cost:{'insight':1000,'wisdom':100},
		req:{'the christmas':true,'snowmen':true},
	});
		new G.Tech({
		name:'f.r.o.s.t.y overclock I',
		desc:'Wizards figured out how to overclock [f.r.o.s.t.y]. They know how to do it and also they know that there is no way to remove probability of snowman being destroyed by extraction. @<font color="green">[f.r.o.s.t.y] is 25% faster</font> @<font color="red">[f.r.o.s.t.y] has 5% more chance to destroy a snowman</font>',
		icon:[5,11,'seasonal'],
		cost:{'insight':600,'culture':100,'influence':50,'christmas essence':114},
		req:{'festive robot print':true,'Land acknowledge':true,'tribalism':false},
	});
	new G.Tech({
		name:'f.r.o.s.t.y overclock II',
		desc:'Wizards figured out how to overclock [f.r.o.s.t.y] even more than before. They know how to do it and also they know that there is no way to remove probability of snowman being destroyed by extraction. Also they know from previous experiences that the faster he is the bigger "snowman destruction" it causes... <br>but this overclock increases the chance for that at least as for now it is possible. @<font color="green">[f.r.o.s.t.y] is 25% faster (compounding)</font> @<font color="red">[f.r.o.s.t.y] has 7% more chance to destroy a snowman</font>',
		icon:[4,11,'seasonal'],
		cost:{'insight II':110,'culture II':20,'influence II':5,'science':5,'christmas essence':546},
		req:{'festive robot print':true,'Policy revaluation':true,'f.r.o.s.t.y overclock I':true},
	});
	new G.Tech({
		name:'f.r.o.s.t.y overclock III',
		desc:'Wizards figured out how to overclock [f.r.o.s.t.y]. They know how to do it and also they know that there is no way to remove probability of snowman being destroyed by extraction. @<font color="green">[f.r.o.s.t.y] is 45% faster (compounding)</font> @<font color="red">[f.r.o.s.t.y] has 10% more chance to destroy a snowman</font>',
		icon:[3,11,'seasonal'],
		cost:{'insight II':400,'science':45},
		req:{'festive robot print':true,'Bigger university':true,'f.r.o.s.t.y overclock II':true,'dynamics II':true},
	});
	new G.Tech({
		name:'festive lights',
		desc:'Artisan of christmas can now craft festive lights. Let the streets be even nicer. Obtaining [Mo\' beauty] doubles happiness income from lights but also they are used 50% more.',
		icon:[18,11,'seasonal'],
		cost:{'insight':800,'christmas essence':593},
		req:{'festive robot print':true,'Laws of physics(basic)':true,'dynamics':true},
	});
	new G.Tech({
		name:'festive lights II',
		desc:'Lights bring more happiness. Are used even more.',
		icon:[16,11,'seasonal'],
		cost:{'insight II':200,'insight':100,'science':5},
		req:{'Outstanding wisdom':true,'the christmas':true,'festive lights':true},
	});
	new G.Trait({
		name:'punish the grinch!',
		desc:'If available, [population,people] use [stone,rocks] covered with [snow] to punish bad guys who try to destroy christmas such like rude [thief,Thieves], brutal [wild corpse]s. Works only during christmas',
		icon:[17,11,'seasonal'],
		cost:{'culture':300,'influence':50,'faith':25,'insight':100},
		req:{'Battling thieves':true,'the christmas':true},
		effects:[
			 {type:'function',func:function(){
				if(day>=350 && day<=363){
			 		if(G.getRes('snow').amount>=12 && G.getRes('stone').amount>=4){
						G.lose('snow',12,'winter punishment');G.lose('stone',4,'winter punishment');G.lose('thief',1,'winter punishment');
						G.gain('wounded',1,'thief punished');G.lose('wild corpse',1,'winter punishment');G.gain('slain corpse',1);
					}
				}
			 }}
			],
		chance:60,
		category:'seasonal'
	});
	
	new G.Trait({
		name:'policies',
		displayName:'<font color="fuschia">Policies</font>',
		desc:'@Now you can spend your [influence] in <b>Policies</b> tab. @Unlocks policies, one of main part of your civilization. @Learn more about Policies in its own tab.',
		icon:[34,13,'magixmod'],
		chance:1.1,
		effects:[
		 {type:'function',func:function(){pb=1;pa=2}},
		],
		req:{'tribalism':true},
	});
	new G.Trait({
		name:'where am i?',
		displayName:'<font color="#7f7fff">Where am I?</font>',
		desc:'@Unlocks primary informations about your small but still world, one of main part of your civilization. @Click <b>Territory</b> tab to see what goods you can gain from the territory and where your tribe has settled.',
		icon:[choose([34,35]),choose([11,12]),'magixmod'],
		chance:1.11,
		cost:{'insight':1},
		effects:[
		 {type:'function',func:function(){lb=1;la=2}},
		],
		req:{'tribalism':true,'policies':true},
	});
	setInterval(function(){if(la>lb){
				  if(G.tab.id=="land"){
				G.showMap();
			      }else if(G.tab.id!='land' || G.hasNot('where am i?')){G.hideMap();}
	}},200);
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
		{id:'Florists',name:'<font color="#d4af37">----- P a n t h e o n -----</font>'},//Kept the same ID to prevent errors and crashes upon a update
		{id:'education',name:'Education'},
		{id:'prod',name:'Production'},
		{id:'mag',name:'Magix utilities'},
		{id:'trial',name:'Trials'}
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
			'plentiful':{name:'Plentiful',desc:'Your people receive a portion and a half per day.',req:{'t3':false}},
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
		desc:'Boost depends on time. <br><font color="lime">Each year [food] decays slower by 0.1% (range: 1 to 10%). Bonus applies to [water] too but halved.</font><br><hr color="fuschia"><font color="red"> Backfire: With the same rate all [misc materials,Miscellaneous] decay faster.</font>',
		icon:[29,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'Pantheon key':true},
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
		desc:'Disable/Enable sounds from <li>technology: obtaining, rerolling choices.</li><li>Trait obtaining</li><li>Game over</li><li>Obtaining an Emblem</li><li>Switching policy modes</li><li>Finishing a wonder</li><li>Ascending by wonder</li><li>Switching between tabs</li>',
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
			'bronze':{name:'Bronze',desc:'Switches to bronze theme. Reward for <b>Next to the God</b> achievement.',req:{'Life in faith':true}},
			'silver':{name:'Silver',desc:'Switches to silver theme. Reward for <b>Next to the God</b> achievement.',req:{'Life in faith':true}},
			'golden':{name:'Golden',desc:'Switches to golden theme. Reward for <b>Next to the God</b> achievement.',req:{'Life in faith':true}},
			'black':{name:'Black',desc:'Switches to black theme. Reward for <b>Talented?</b> achievement.',req:{'<font color="orange">Smaller shacks</font>':true}},
			'wooden':{name:'Wooden',desc:'Switches to wooden theme. Reward for completing Buried trial for the first... and the last time.',req:{'<font color="orange">Smaller shacks</font>':true}},
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
		req:{'Pantheon key':true},
		category:'Florists',
	});
				new G.Policy({
		name:'se03',
		displayName:'Tu-ria the Seraphin of Inspiration',
		desc:'<font color="lime">Increases [culture] gathering by 100%, decreases limit for [musician] and [storyteller] by 50 [population]</font><br><hr color="fuschia"><font color="red">Backfire:[dreamer] , [faith,faith units] gather 5% less [insight] and [faith] .</font>',
		icon:[27,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'Pantheon key':true},
		category:'Florists',
	});
		new G.Policy({
		name:'se04',
		displayName:'Hartar the Seraphin of Hunting',
		desc:'<font color="lime">Increases efficiency of hunting units by 35%. After [Hunters & fishers unification] increases income of [meat] by this %.</font><br><hr color="fuschia">Hovewer this Seraphin doesn\'t have a backfire but choosing [se04] blocks you [se05] unless you unchoose that but it is not worthy.',
		icon:[26,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'Pantheon key':true},
		category:'Florists',
	});
			new G.Policy({
		name:'se05',
		displayName:'Fishyar the Seraphin of Fishing',
		desc:'<font color="lime">Increases efficiency of fishing units by 35%. After [Hunters & fishers unification] increases income of [seafood] by this %.</font><br><hr color="fuschia">Hovewer this Seraphin doesn\'t have a backfire but choosing [se05] blocks you [se04] unless you unchoose that but it is not worthy.',
		icon:[25,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'Pantheon key':true},
		category:'Florists',
	});
				new G.Policy({
		name:'se06',
		displayName:'Posi\'zul the Seraphin of Water',
		desc:'<font color="lime">Increases gathering of water and decreases rate of water spoiling</font><br><hr color="fuschia"><font color="red">Backfire: Increases food spoiling rate</font>',
		icon:[24,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'Pantheon key':true},
		category:'Florists',
	});
				new G.Policy({
		name:'se07',
		displayName:'Herbalia the Seraphin of Recovery',
		desc:'<font color="lime">Boosts health level. [healer]s are 25% more efficient.</font><br><hr color="fuschia"><font color="red">Backfire: Happiness cap is: from -200 to 175%. [gatherer] gains 15% less.</font>',
		icon:[23,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'Pantheon key':true},
		category:'Florists',
	});
					new G.Policy({
		name:'se08',
		displayName:'Buri\'o dak the Seraphin of Burial',
		desc:'<font color="lime">Now 1 [burial spot] can store 1.1 [corpse] or 5 [Urn]s.</font><br><hr color="fuschia"><font color="red">Backfire: Harms [health] and decreases [healer]s efficiency by 5%.</font>',
		icon:[22,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'Pantheon key':true},
		category:'Florists',
	});
						new G.Policy({
		name:'se09',
		displayName:'Moai the Seraphin of the Stone',
		desc:'<font color="lime">All [mine]s are 25% more efficient(Doesn\'t apply to [gems] gathering and only applies to modes from [prospecting,prospecting I] not to <b>any</b> .). [digger] is 2% more efficient. [carver] works 3% more efficient at modes related to the [stone].</font><br><hr color="fuschia"><font color="red">Backfire: [well]s are 15% less efficient(not including [Well of mana]) and [artisan]s are 7.5% less efficient.</font>',
		icon:[21,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'Pantheon key':true},
		category:'Florists',
	});
						new G.Policy({
		name:'se10',
		displayName:'Mamuun the Seraphin of Richness',
		desc:'<font color="lime">Gold and [precious building materials] decay 3% slower</font><br><hr color="fuschia"><font color="red">Backfire:[archaic building materials] decay 40% faster , [basic building materials] decay 12% faster, [advanced building materials] decay 3% faster. [food] spoils faster.</font>',
		icon:[20,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'Pantheon key':true},
		category:'Florists',
	});
						new G.Policy({
		name:'se11',
		displayName:'Enlightened the Seraphin of Faith',
		desc:'<font color="lime">All [faith] gathering is increased by 25%, [Thoughts sharer] is 1% more efficient.</font><br><hr color="fuschia"><font color="red">Backfire: All [influence] , [insight] units are weakened by 25%(including [Guru])</font>',
		icon:[19,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'Pantheon key':true},
		category:'Florists',
	});
						new G.Policy({
		name:'se12',
		displayName:'Okar the Seer the Seraphin of Knowledge',
		desc:'<font color="lime">[Guru] and [dreamer]s are 50% more efficient.</font><br><hr color="fuschia"><font color="red">Backfire: [dreamer]s and [Guru] require [food] and [water] as an upkeep. Weakens [gatherer] and [Florist] by 20%. [culture] gaining lowered by 10%.</font>',
		icon:[18,25,'magixmod'],
		cost:{'Worship point':1,'faith II':10},
		startMode:'off',
		req:{'Pantheon key':true},
		category:'Florists',
	});
		new G.Policy({
		name:'Patience',
		desc:'starts [Gather roses] trial. Will warn you before start.',
		icon:[24,18,'magixmod',29,25,'magixmod',1,22,'magixmod'],
		cost:{'insight II':1,'influence II':1},
		startMode:'off',		
		req:{'Gather roses':'on'},
		category:'trial',
		effects:[
			{type:'function',func:function(){G.dialogue.popup(function(div){
            return '<div style="width:580px;min-height:550px;height:75%;">'+
                '<div class="fancyText title"><font color="#d4af37" size="5">- - Patience - -</font></div>'+
				'<div class="fancyText">The Chra-nos trial</font></div><br>'+
				'<img src="https://pipe.miroware.io/5db9be8a56a97834b159fd5b/Trial%20icons/1.png" width="72" height="72"/>'+
                '<div class="fancyText bitBiggerText scrollBox underTitle" style="text-align:left;padding:32px;">'+
'<br><br><Br><br>'+
				'<center><font color="red">Note: Starting this trial will cause similar effects as ascension does, but only these bonuses from achievements will carry to the Trial: +1 tech choice(from Row 3 completion)</font>'+
                '<br>Trial rules<br>'+
                'Enter the plane where I will show you that the time is mo\' than just years and days, weeks and months. Each year in my plane will decrease productivity of all your units by random ratio from [around 0.01% to 0.5%]. In addition Dreamers in this plane don\'t exist and nobody knows who are they but I will bring down to you some , random amount of <font color="aqua">Insight</font> each year(in this trial amount of <font color="aqua">Insight</font> can be equal to 160% of <font color="aqua">Wisdom</font> amount).Finish the trial by building mai wonder and ascend your soul to me.I will reward you with a small improvement.For completing trial for the first time the bonus cap will be increased by 2.5% and you will gain first Victory Point from this challenge. (This trial will be repeatable but will get harder and harder after each time you will perform it again. Difficulty will start increasing after first trial completion<br><Br><BR>'+
'<div class="fancyText title">Tell me your choice...</div>'+
                '<center>'+G.button({text:'Start the trial',tooltip:'Let the Trial begin. You\'ll pseudoascend.',onclick:function(){G.dialogue.close();G.dialogue.popup(function(div){	G.getRes('beyond').amount=0;G.unitsOwned.length=0;G.policy.length=0;G.traitsOwned.length=0;G.techsOwned.length=0;G.NewGameConfirm();G.getRes('burial spot').used=0;G.getRes('worker').used=0;G.getRes('stone weapons').used=0;G.getRes('armor set').used=0;G.getRes('metal weapons').used=0;G.getRes('Fishing net').used=0;G.getRes('knapped tools').used=0;G.getRes('stone tools').used=0;G.getRes('land').used=0;G.getRes('metal tools').used=0;G.getRes('Instructor').used=0;G.getRes('Wand').used=0;G.getRes('Alchemist').used=0;G.getRes('corpse').amount=0;G.getRes('beyond').amount=0;G.getRes('health').amount=0;G.getRes('happiness').amount=0;G.fastTicks=0;var t1=G.traitByName['t1'];var trial=G.traitByName['trial'];G.gainTrait(t1);G.gainTrait(trial);G.year=0; G.day=0;G.middleText('The Patience trial has been started. You are in Chra-nos\'s plane','slow');G.getRes('corpse').amount=0;G.Save();G.techN=0;G.traitN=0; return '<div class="fancyText">Alright then... good luck<br>Then the Patience trial begins</font><br>Technical note: Refresh the page.</div>'+G.dialogue.getCloseButton('Okay')+''})}})+''+G.button({tooltip:'Do your last preparations',text:'Wait I am not ready yet!',onclick:function(){G.dialogue.forceClose(); G.setPolicyModeByName('Patience','off')}})+'</center>'+
                '</div>'+
            '</div><div class="buttonBox">'+
            '</div></div>'
})}}
			],
	});
	new G.Policy({
		name:'Unhappy',
		desc:'starts [se02] trial. Will warn you before start.',
		icon:[24,18,'magixmod',28,25,'magixmod',1,22,'magixmod'],
		cost:{'insight II':1,'influence II':1},
		startMode:'off',		
		req:{'se02':'on'},
		category:'trial',
		effects:[
			{type:'function',func:function(){G.dialogue.popup(function(div){
            return '<div style="width:580px;min-height:550px;height:75%;">'+
                '<div class="fancyText title"><font color="#d4af37" size="5">- - Unhappy - -</font></div>'+
				'<div class="fancyText">The Bersaria trial</font></div><br>'+
				'<img src="https://pipe.miroware.io/5db9be8a56a97834b159fd5b/Trial%20icons/2.png" width="72" height="72"/>'+
                '<div class="fancyText bitBiggerText scrollBox underTitle" style="text-align:left;padding:32px;">'+
'<br><br><Br><br>'+
				'<center><font color="red">Note: Starting this trial will cause similar effects as ascension does, but only these bonuses from achievements will carry to the Trial: +1 tech choice(from Row 3 completion)</font>'+
                '<br>Trial rules<br>'+
                'I am a Madness. This plane is full of anger... No way to make\'em happy. You will have to handle it. In fact people\'s happiness will be always at -200% level and can\'t be raised even to +1%. In addition penalty from unhappiness is bigger than normal. Reaching -400% happiness causes Madness to kick you out of this plane. Every 3 discoveries My penalty from unhappiness raises up by 10%(compounding). Construct a Wonder of Madness for Bersaria and ascend by it to finish the challenge. Beating mah challenge for the first time will make mah backfire weaker and thee Thieve hunters are al-most unharmable!<br><Br><BR>'+
'<div class="fancyText title">Tell me your choice...</div>'+
                '<center>'+G.button({text:'Start the trial',tooltip:'Let the Trial begin. You\'ll pseudoascend.',onclick:function(){G.dialogue.close();G.dialogue.popup(function(div){	G.getRes('beyond').amount=0;G.unitsOwned.length=0;G.policy.length=0;G.traitsOwned.length=0;G.techsOwned.length=0;G.NewGameConfirm();G.getRes('burial spot').used=0;G.getRes('worker').used=0;G.getRes('stone weapons').used=0;G.getRes('armor set').used=0;G.getRes('metal weapons').used=0;G.lose('sick',5);G.gain('adult',5);G.getRes('Fishing net').used=0;G.getRes('knapped tools').used=0;G.getRes('stone tools').used=0;G.getRes('land').used=0;G.getRes('metal tools').used=0;G.getRes('Instructor').used=0;G.getRes('Wand').used=0;G.getRes('Alchemist').used=0;G.getRes('corpse').amount=0;G.getRes('beyond').amount=0;G.getRes('health').amount=0;G.getRes('happiness').amount=0;G.fastTicks=0;G.gainTrait(G.traitByName['t2']);var trial=G.traitByName['trial'];G.gainTrait(trial);G.year=0; G.day=0;G.middleText('The Unhappy trial has been started. You are in Bersaria\'s plane','slow');G.getRes('corpse').amount=0;G.Save();G.techN=0;G.traitN=0; return '<div class="fancyText">Alright then... good luck<br>Then the Unhappy trial begins...<br>The Madness begins</font><br>Technical note: Refresh the page.</div>'+G.dialogue.getCloseButton('Okay')+''})}})+''+G.button({tooltip:'Do your last preparations',text:'Wait I am not ready yet!',onclick:function(){G.dialogue.forceClose(); G.setPolicyModeByName('Unhappy','off')}})+'</center>'+
                '</div>'+
            '</div><div class="buttonBox">'+
            '</div></div>'
})}}
				],
	});
	new G.Policy({
		name:'Cultural',
		desc:'starts [se03] trial. Will warn you before start.',
		icon:[24,18,'magixmod',27,25,'magixmod',1,22,'magixmod'],
		cost:{'insight II':1,'influence II':1},
		startMode:'off',		
		req:{'se03':'on'},
		category:'trial',
		effects:[
			{type:'function',func:function(){G.dialogue.popup(function(div){
            return '<div style="width:580px;min-height:550px;height:75%;">'+
                '<div class="fancyText title"><font color="#d4af37" size="5">- - Cultural - -</font></div>'+
				'<div class="fancyText">The Turia\'s trial</font></div><br>'+
				'<img src="https://pipe.miroware.io/5db9be8a56a97834b159fd5b/Trial%20icons/3.png" width="72" height="72"/>'+
                '<div class="fancyText bitBiggerText scrollBox underTitle" style="text-align:left;padding:32px;">'+
'<br><br><Br><br>'+
				'<center><font color="red">Note: Starting this trial will cause similar effects as ascension does, but only these bonuses from achievements will carry to the Trial: +1 tech choice(from Row 3 completion)</font>'+
                '<br>Trial rules<br>'+
                'I am a personification of Inspiration. Ya met me '+G.getName('ruler')+'! Ya want me to be closer to ya and your people. Al the right! But show me ya are worthy of me. In my plane no one except me can gather <font color="green">culture</font> , <font color="green">influence</font> for ya. (their amounts can over cap but Tu-ria won\'t bring down to you next portion if even just one of the essentials will overcap) Onle me! Just me! Researching and discovering will be tougher. For this trial <font color="green">water rations</font> cannot be set to plentiful(food one can be still be set)! In addition you will be forced to keep cultural stability. Doing anything related to researching, discovering causes stability to go low while doing cultural things will bring it up.(also few researches will increase up the stability) Don\'t get too low or too much(it will make trial attempt failed). Completing mah challenge for the first time will encourage me to make yar Cultural units gaining more Culture for ya. My penalty will go lower for ya. <br><Br><BR>'+
'<div class="fancyText title">Tell me your choice...</div>'+
                '<center>'+G.button({text:'Start the trial',tooltip:'Let the Trial begin. You\'ll pseudoascend.',onclick:function(){G.dialogue.close();G.dialogue.popup(function(div){	G.getRes('beyond').amount=0;G.unitsOwned.length=0;G.policy.length=0;G.traitsOwned.length=0;G.techsOwned.length=0;G.NewGameConfirm();G.getRes('burial spot').used=0;G.getRes('worker').used=0;G.getRes('stone weapons').used=0;G.getRes('armor set').used=0;G.getRes('metal weapons').used=0;G.getRes('Fishing net').used=0;G.getRes('knapped tools').used=0;G.getRes('stone tools').used=0;G.getRes('land').used=0;G.getRes('metal tools').used=0;G.getRes('Instructor').used=0;G.getRes('Wand').used=0;G.getRes('Alchemist').used=0;G.getRes('health').amount=0;G.getRes('beyond').amount=0;G.getRes('happiness').amount=0;G.fastTicks=0;G.gainTrait(G.traitByName['t3']);var trial=G.traitByName['trial'];G.gainTrait(trial);G.year=0; G.day=0;G.middleText('The Cultural trial has been started. You are in Tu-ria\'s plane','slow');G.getRes('corpse').amount=0;G.gainTech(G.techByName['<font color="yellow">A gift from the Mausoleum</font>']);G.techN=0;G.traitN=0;G.Save(); return '<div class="fancyText">Alright then... good luck<br>Then the Cultural trial begins...</font><br>Technical note: Refresh the page.</div>'+G.dialogue.getCloseButton('Okay')+''})}})+''+G.button({tooltip:'Do your last preparations',text:'Wait I am not ready yet!',onclick:function(){G.dialogue.forceClose(); G.setPolicyModeByName('Cultural','off')}})+'</center>'+
                '</div>'+
            '</div><div class="buttonBox">'+
            '</div></div>'
})}}
				],
	});
	new G.Policy({
		name:'Hunted',
		desc:'starts [se04] trial. Will warn you before start.',
		icon:[24,18,'magixmod',26,25,'magixmod',1,22,'magixmod'],
		cost:{'insight II':1,'influence II':1},
		startMode:'off',		
		req:{'se04':'on'},
		category:'trial',
		effects:[
			{type:'function',func:function(){G.dialogue.popup(function(div){
            return '<div style="width:580px;min-height:550px;height:75%;">'+
                '<div class="fancyText title"><font color="#d4af37" size="5">- - Hunted - -</font></div>'+
				'<div class="fancyText">The Hartar\'s trial</font></div><br>'+
				'<img src="https://pipe.miroware.io/5db9be8a56a97834b159fd5b/Trial%20icons/4.png" width="72" height="72"/>'+
                '<div class="fancyText bitBiggerText scrollBox underTitle" style="text-align:left;padding:32px;">'+
'<br><br><Br><br>'+
				'<center><font color="red">Note: Starting this trial will cause similar effects as ascension does, but only these bonuses from achievements will carry to the Trial: +1 tech choice(from Row 3 completion)</font>'+
                '<br>Trial rules<br>'+
                'I am patron of hunters! But in my trial you will hunt yourself. You\'ll hunt your weakpoints. In my plane your people won\'t like taste of green willing for tasty meat. <font color="pink">Gatherer</font> and <font color="pink">fisher</font> doesn\'t exist there too. But you have no time for eating and being happy from taste of hunted deer. Each year 3% of your people will die and <font color="pink">Health</font> will go lower and lower increasing vulnerability to the diseases. Happiness cap for this trial is: from -200% to 98%! You\'ll be able to bring health back to 0 state only once(via policies) but it will consume half of your total food. Build a wonder of my religion. Completing the trial for the first time I will empower all hunting units and cooked meat,cured meat will decay slower.<br><Br><BR>'+
'<div class="fancyText title">Tell me your choice...</div>'+
                '<center>'+G.button({text:'Start the trial',tooltip:'Let the Trial begin. You\'ll pseudoascend.',onclick:function(){G.dialogue.close();G.dialogue.popup(function(div){	G.getRes('beyond').amount=0;G.unitsOwned.length=0;G.policy.length=0;G.traitsOwned.length=0;G.techsOwned.length=0;G.NewGameConfirm();G.getRes('burial spot').used=0;G.getRes('worker').used=0;G.getRes('stone weapons').used=0;G.getRes('armor set').used=0;G.getRes('metal weapons').used=0;G.getRes('Fishing net').used=0;G.getRes('knapped tools').used=0;G.getRes('stone tools').used=0;G.getRes('land').used=0;G.getRes('metal tools').used=0;G.getRes('Instructor').used=0;G.getRes('Wand').used=0;G.getRes('Alchemist').used=0;G.getRes('corpse').amount=0;G.getRes('beyond').amount=0;G.getRes('health').amount=0;G.getRes('happiness').amount=0;G.fastTicks=0;G.gainTrait(G.traitByName['t4']);G.techN=0;G.traitN=0;var trial=G.traitByName['trial'];G.gainTrait(trial);G.year=0; G.day=0;G.middleText('The Hunted trial has been started. You are in Hartar\'s plane','slow');G.Save(); return '<div class="fancyText">Alright then... good luck<br>Then the Hunted trial begins...<br>The meat rush begins :)</font><br>Technical note: Refresh the page.</div>'+G.dialogue.getCloseButton('Okay')+''})}})+''+G.button({tooltip:'Do your last preparations',text:'Wait I am not ready yet!',onclick:function(){G.dialogue.forceClose(); G.setPolicyModeByName('Hunted','off')}})+'</center>'+
                '</div>'+
            '</div><div class="buttonBox">'+
            '</div></div>'
})}}
				],
	});
	new G.Policy({
		name:'sleepy insight',
		desc:'A chance to obtain some amount of [insight] at start of new year. This policy has a meter that has a scale from: -3 to 3. <>Modes with number lower than 0 will cause ability to be stronger at the cost of chance while modes with over 0 numbers will cause ability provide less [insight] but with bigger chance.',
		icon:[8,12,33,24,'magixmod'],
		cost:{'faith':10,'insight':1},
		startMode:'0',
		req:{'ritualism':true,'sleep-speech':true},
		category:'faith',
		modes:{
			'-3':{name:'<font color="#3399ff">-3</font>',desc:'A 2.75% chance to receive 13 to 27 [insight] at the start of new year.'},
			'-2':{name:'<font color="#4dc3ff">-2</font>',desc:'A 4.5% chance to receive 9 to 18 [insight] at the start of new year.'},
			'-1':{name:'<font color="#B3FFFF">-1</font>',desc:'A 5% chance to receive 5 to 12 [insight] at the start of new year.'},
			'0':{name:'0',desc:'A 7% chance to receive 3 to 9 [insight] at the start of new year.'},
			'+1':{name:'<font color="#ffc34d">+1</font>',desc:'A 8% chance to receive 1 to 5 [insight] at the start of new year.'},
			'+2':{name:'<font color="#ff884d">+2</font>',desc:'A 9.5% chance to receive 0.25 to 2 [insight] at the start of new year.'},
			'+3':{name:'<font color="#ff8066">+3</font>',desc:'A 10.25% chance to receive 0.15 to 1.5 [insight] at the start of new year.'},
		},
	});
	new G.Policy({
		name:'Pocket',
		desc:'starts [se10] trial. Will warn you before start.',
		icon:[24,18,'magixmod',20,25,'magixmod',1,22,'magixmod'],
		cost:{'insight II':1,'influence II':1},
		startMode:'off',		
		req:{'se10':'on'},
		category:'trial',
		effects:[
			{type:'function',func:function(){G.dialogue.popup(function(div){
            return '<div style="width:580px;min-height:550px;height:75%;">'+
                '<div class="fancyText title"><font color="#d4af37" size="5">- - Pocket - -</font></div>'+
				'<div class="fancyText">The Mamuun\'s trial</font></div><br>'+
				'<img src="https://pipe.miroware.io/5db9be8a56a97834b159fd5b/Trial%20icons/10.png" width="72" height="72"/>'+
                '<div class="fancyText bitBiggerText scrollBox underTitle" style="text-align:left;padding:32px;">'+
'<br><br><Br><br>'+
				'<center><font color="red">Note: Starting this trial will cause similar effects as ascension does, but only these bonuses from achievements will carry to the Trial: +1 tech choice(from Row 3 completion)</font>'+
                '<br>Trial rules<br>'+
                'My plane is for rich people. Are you one of them? Well. In this plane you will earn money. Gatherer can gather money there... in 3 tiers. Also exploring units are 2.5x as efficient. To buying resources that you can\'t gather you will need 3rd tier of currency. None of crafting units exist in fact crafting isn\'t even possible in this plane. Only and just gathering(except some). Remember. Lower tiers of currency decays faster. From year 110 and above you will start losing money because of thievery. Lead your people to build a wonder of Mamuun worship and ascend your soul for Mamuun. Completing this trial for the first time will increase capacity of all [stockpile,storage units] by 35% (additive). (The one that applies bonus for beating for the second time - raise up from 35 to 55%)<br><Br><BR>'+
'<div class="fancyText title">Tell me your choice...</div>'+
                '<center>'+G.button({text:'Start the trial',tooltip:'Let the Trial begin. You\'ll pseudoascend.',onclick:function(){G.dialogue.close();G.dialogue.popup(function(div){	G.getRes('beyond').amount=0;G.unitsOwned.length=0;G.policy.length=0;G.traitsOwned.length=0;G.techsOwned.length=0;G.NewGameConfirm();G.getRes('burial spot').used=0;G.getRes('worker').used=0;G.getRes('stone weapons').used=0;G.getRes('armor set').used=0;G.getRes('metal weapons').used=0;G.getRes('Fishing net').used=0;G.getRes('knapped tools').used=0;G.getRes('stone tools').used=0;G.getRes('land').used=0;G.getRes('metal tools').used=0;G.getRes('Instructor').used=0;G.getRes('Wand').used=0;G.getRes('Alchemist').used=0;G.getRes('corpse').amount=0;G.getRes('beyond').amount=0;G.getRes('health').amount=0;G.getRes('happiness').amount=0;G.techN=0;G.traitN=0;G.fastTicks=0;G.gainTrait(G.traitByName['t10']);var trial=G.traitByName['trial'];G.gainTrait(trial);G.year=0; G.day=0;G.middleText('The Pocket trial has been started. You are in Mammun\'s plane','slow');G.Save(); return '<div class="fancyText">Alright then... good luck<br>Then the Pocket trial begins :)</font><br>Technical note: Refresh the page.</div>'+G.dialogue.getCloseButton('Okay')+''})}})+''+G.button({tooltip:'Do your last preparations',text:'Wait I am not ready yet!',onclick:function(){G.dialogue.forceClose(); G.setPolicyModeByName('Pocket','off')}})+'</center>'+
                '</div>'+
            '</div><div class="buttonBox">'+
            '</div></div>'
})}}
				],
	});
		new G.Policy({
		name:'reset health level',
		desc:'Only available while in Hunted. Resets health to 0%. Available only once per each Hunted attempt.',
		icon:[21,29,'magixmod'],
		cost:{'influence':1},
		startMode:'inactive',
		modes:{
		'inactive':{name:'Inactive',desc:'Ability is currently unused'},
		'activate':{name:'Activate',desc:'Active this ability'},
		'alreadyused':{name:'Already used',req:{'tribalism':false}},
		},
		req:{'t4':true,'trial':true},
		category:'Florists',
	});
	new G.Policy({
		name:'Faithful',
		desc:'starts [se11] trial. Will warn you before start.',
		icon:[24,18,'magixmod',19,25,'magixmod',1,22,'magixmod'],
		cost:{'insight II':1,'influence II':1},
		startMode:'off',		
		req:{'se10':'on'},
		category:'trial',
		effects:[
			{type:'function',func:function(){G.dialogue.popup(function(div){
            return '<div style="width:580px;min-height:550px;height:75%;">'+
                '<div class="fancyText title"><font color="#d4af37" size="5">- - Faithful - -</font></div>'+
				'<div class="fancyText">The Enlightened\'s trial</font></div><br>'+
				'<img src="https://pipe.miroware.io/5db9be8a56a97834b159fd5b/Trial%20icons/11.png" width="72" height="72"/>'+
                '<div class="fancyText bitBiggerText scrollBox underTitle" style="text-align:left;padding:32px;">'+
'<br><br><Br><br>'+
				'<center><font color="red">Note: Starting this trial will cause similar effects as ascension does, but only these bonuses from achievements will carry to the Trial: +1 tech choice(from Row 3 completion)</font>'+
                '<br>Trial rules<br>'+
                'Be faithful. Only faith will lead you to victory. In this plane you start with 100 <font color="aqua">spirituality</font> and 100 <font color="aqua">Faith</font>. Each year you lose around '+(5+G.achievByName['Faithful'].won)+' Faith. Be careful! If your Faith will go negative/reach zero the trial will be failed and you will come back to the mortal world. The more you research, the more Faith you will lose. In addition Soothsayer works at 10% of its normal efficiency. Build up a replacement of Mausoleum... the Faithoselum and ascend by it. Completing trial causes Soothsayers generate faith more succesfully so early-game faith gathering will be easier because of Enlightened\'s patron.'+
'<div class="fancyText title">Tell me your choice...</div>'+
                '<center>'+G.button({text:'Start the trial',tooltip:'Let the Trial begin. You\'ll pseudoascend.',onclick:function(){G.dialogue.close();G.dialogue.popup(function(div){	G.getRes('beyond').amount=0;G.unitsOwned.length=0;G.policy.length=0;G.traitsOwned.length=0;G.techsOwned.length=0;G.NewGameConfirm();G.getRes('burial spot').used=0;G.getRes('worker').used=0;G.getRes('stone weapons').used=0;G.getRes('armor set').used=0;G.getRes('metal weapons').used=0;G.getRes('Fishing net').used=0;G.getRes('knapped tools').used=0;G.getRes('stone tools').used=0;G.getRes('land').used=0;G.getRes('metal tools').used=0;G.getRes('Instructor').used=0;G.getRes('Wand').used=0;G.getRes('Alchemist').used=0;G.getRes('corpse').amount=0;G.getRes('health').amount=0;G.getRes('happiness').amount=0;G.techN=0;G.traitN=0;G.fastTicks=0;G.gainTrait(G.traitByName['t11']);var trial=G.traitByName['trial'];G.gainTrait(trial);G.year=0; G.day=0;G.middleText('The Faithful trial has been started. You are in Enlightened\'s plane','slow');G.Save(); return '<div class="fancyText">Alright then... good luck<br>Then the Pocket trial begins :)</font><br>Technical note: Refresh the page.</div>'+G.dialogue.getCloseButton('Okay')+''})}})+''+G.button({tooltip:'Do your last preparations',text:'Wait I am not ready yet!',onclick:function(){G.dialogue.forceClose(); G.setPolicyModeByName('Pocket','off')}})+'</center>'+
                '</div>'+
            '</div><div class="buttonBox">'+
            '</div></div>'
})}}
				],
	});
	/*=====================================================================================
	LANDS
	=======================================================================================*/

	new G.Land({
		name:'ocean',
		names:['Ocean'],
		goods:[
			{type:'saltwater fish',min:1,max:4},
			{type:'saltwater'},
			{type:'squid',min:0.1,max:2,chance:0.33},
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
			{type:'saltwater fish',min:0.5,max:2,chance:0.33},
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
			{type:['lush rocky substrate','rocky substrate']},
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
			{type:['oak','birch'],min:2.75,max:3.6},
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
			{type:'tundra rocky substrate'},
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
			{type:'ice desert rocky substrate'},
		],
		image:8,
		score:2,
	});
	new G.Land({
		name:'boreal forest',
		names:['Boreal forest','Pine forest','Taiga'],
		goods:[
			{type:['fir tree'],min:2.4,max:4},
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
			{type:'ostrich',chance:0.2,min:0.15,max:0.5},
			{type:'warm rocky substrate'},
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
			{type:'ostrich',chance:0.2,min:0.15,max:0.5},
			{type:'warm rocky substrate'},
		],
		image:11,
		score:2,
	});
	new G.Land({
		name:'jungle',
		names:['Jungle','Tropical forest','Mangrove'],
		goods:[
			{type:['palm tree'],min:2.75,max:4},
			{type:'jungle fruits',chance:1},
			{type:'grass'},
			{type:'koalas',chance:0.3},
			{type:'sugar cane',min:0.05,max:1},
			{type:['boars'],chance:0.2,amount:0.5},
			{type:'wild bugs',min:1,max:2},
			{type:'freshwater fish',chance:0.1,min:0.1,max:0.3},
			{type:'freshwater',amount:1},
			{type:'jungle rocky substrate'},
		],
		image:13,
		score:8,
	});
		new G.Land({
		name:'swamplands',
		goods:[
			{type:['swampflowers'],amount:1},
			{type:'grass',chance:3},
			{type:'wet rocky substrate'},
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
			{type:['lush rocky substrate','rocky substrate']},
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
			{type:'Ice',min:2,max:5.7},
			{type:'seals',min:0.05,max:1,chance:0.2},
			{type:'saltwater fish',min:0.05,max:0.3,chance:0.01},
			{type:'freshwater',amount:0.75},
		],
		image:16,
		score:3,
		ocean:true
	});
		new G.Land({
		name:'dead forest',
		names:['Deadlands','Dead forest'],
		goods:[
			{type:['dead tree'],amount:3},
			{type:'forest mushrooms',chance:0.1},
			{type:'dead grass',min:3,max:6},
			{type:'wild bugs',min:0.6,max:1.5},
			{type:'mudwater',min:0.75,max:1},
			{type:'dead rocky substrate'},
			{type:'animal corpse',min:0.005,max:2.5},
			{type:'dead fishes',min:0.05,max:0.5,chance:0.5},
			{type:'spoiled fruits',min:0.05,max:0.3,chance:0.4},
		],
		image:17,
		score:0.5,
	});
	new G.Land({
		name:'badlands',
		names:['Badlands,Mesa'],
		goods:[
			{type:'dead tree',chance:0.9,min:0.33,max:2.5},
			{type:['dead grass','grass'],chance:0.4},
			{type:'wild bugs',chance:0.8,min:0.1,max:2},
			{type:'freshwater',min:0.1,max:0.35},
			{type:'badlands substrate'},
			{type:'succulents',min:0.07,max:0.6},
			{type:'wolves',min:0.15,max:0.45,chance:0.33},
			{type:'foxes',min:0.1,max:0.3,chance:0.25},
			{type:'sandy soil',chance:0.33},
			{type:'ostrich',chance:0.4,min:0.21,max:0.5},
			{type:'wild rabbits',chance:0.045},
		],
		image:18,
		score:2.25,
	});
	new G.Land({
		name:'xeric shrubland',
		goods:[
			{type:'dead tree',min:0.5,max:0.9},
			{type:'berry bush',chance:0.02,min:0.01,max:0.07},
			{type:'grass',min:0.5,max:1.5},
			{type:'vfb1',chance:0.32,min:0.1,max:1},
			{type:'sugar cane',min:0.2,max:0.4,chance:0.075},
			{type:['wild rabbits','stoats'],chance:0.5},
			{type:['foxes'],chance:0.5,amount:0.32},
			{type:['wolves','bears'],chance:0.08,min:0.2,max:0.45},
			{type:'wild bugs'},
			{type:'freshwater fish',chance:0.03,min:0.1,max:0.3},
			{type:'freshwater',min:0.07,max:0.33},
			{type:'succulents',min:0.5,max:2.25,chance:0.99},
			{type:['warm rocky substrate','xeric substrate','lush rocky substrate']},
			{type:'sandy soil',min:0.3,max:1.8}
		],
		modifiers:{'river':0.1},
		image:19,
		score:3.8,
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
	
	G.contextNames['gather']='<font color="#E6FFEA">Gathering</font>';
	G.contextNames['fish']='<font color="#CCFFEE">Fishing</font>';
	G.contextNames['hunt']='<font color="#FFDDCC">Hunting</font>';
	G.contextNames['chop']='<font color="#FF6619">Chopping</font>';
	G.contextNames['dig']='<font color="#FFE666">Digging</font>';
	G.contextNames['mine']='<font color="#707070">Mining</font>';
	G.contextNames['quarry']='<font color="#9E9E9E">Quarrying</font>';
	G.contextNames['flowers']='<font color="#80ffaa">Flowers</font>';
	G.contextNames['deep mine']='<font color="#404040">Deep mining</font>';
	G.contextNames['deep quarry']='<font color="#999999">Deep quarrying</font>';
	
	//plants
	new G.Goods({
		name:'grass',
		desc:'[grass] is a good source of [herb]s; you may also occasionally find some [fruit]s and [stick]s while foraging.',
		icon:[10,10],
		res:{
			'gather':{'fruit':0.5,'stick':0.5},
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
			'gather':{'fruit':3,'stick':0.5},
		},
		affectedBy:['scarce forageables'],
		mult:10,
	});
	new G.Goods({
		name:'forest mushrooms',
		desc:'[forest mushrooms] grow in the penumbra of the underbrush, and often yield all sorts of interesting [herb]s.',
		icon:[5,10],
		res:{
			'gather':{},
		},
		affectedBy:['scarce forageables'],
		mult:10,
	});
	new G.Goods({
		name:'succulents',
		desc:'Hardy cactii that grow in the desert. While tricky to harvest, [succulents] can provide [herb]s and [fruit]s.',
		icon:[6,10],
		res:{
			'gather':{'fruit':1},
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
			'gather':{'fruit':2},
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
			'hunt':{'meat':2,'bone':0.2},
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
			'hunt':{'meat':2,'bone':0.2},
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
			'hunt':{'meat':2,'bone':0.2},
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
			'hunt':{'meat':4,'bone':1},
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
			'hunt':{'meat':4,'bone':1},
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
			'hunt':{'meat':4,'bone':1},
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
			'hunt':{'meat':3,'bone':1},
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
			'hunt':{'meat':2,'bone':0.2},
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
			'hunt':{'meat':3,'bone':0.5},
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
			'hunt':{'meat':3,'bone':0.5},
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
		desc:'A [rocky substrate] is found underneath terrain with moderate temperature and humidity.//Surface [stone]s may be gathered by hand.//Digging often produces [mud], more [stone]s and occasionally [copper ore,Ores] and [clay].//Mining provides the best results, outputting a variety of [stone]s, rare [gold ore,Ores], and precious [gems].',
		icon:[11,10],
		res:{
			'gather':{'stone':0.25,'clay':0.005,'limestone':0.005},
			'dig':{'mud':2,'clay':0.15,'stone':0.6,'copper ore':0.008,'tin ore':0.008,'limestone':0.1,'salt':0.051},
			'mine':{'stone':0.3,'copper ore':0.085,'tin ore':0.085,'iron ore':0.04,'gold ore':0.004,'coal':0.09,'salt':0.11,'gems':0.003,'Various stones':0.3,'pyrite':0.001,/*'osmium ore':0.003*/},
			'quarry':{'cut stone':0.7,'limestone':0.5,'marble':0.01,'Various cut stones':0.3},
			'deep mine':{'pyrite':0.065,'zinc ore':0.03,'dinium ore':0.04,'gems':0.005},
			'deep quarry':{'lead ore':0.04,'mythril ore':0.02,'blackium ore':0.03,'salt':0.001,'unknownium ore':0.03},
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
			'hunt':{'meat':2},
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
			new G.Goods({
		name:'squid',
		desc:'Squid is a good source of *Ink*. That doesn\'t mean that [artisan] is useless though. You need [Ink-fishing] for this to be a good source of [Ink] for you.',
		icon:[32,6,'magixmod'],
		res:{
			'fish':{},//B4 inkfishing tech
		},
		affectedBy:['over fishing'],
		mult:0,
	});
	//NEW SUBSTRATES
		new G.Goods({
		name:'warm rocky substrate',
		desc:'A [warm rocky substrate] is found underneath biomes with warm temperature and low humidity.//Surface [stone]s may be gathered by hand.//This soil contains low amounts of [clay] and negligible amounts of [mud], more [stone]s and occasionally [copper ore,Ores].//Mining provides the best results, outputting a variety of [stone]s, more common [gold ore]s and [salt], but less precious [gems].//Quarrying underneath there provides less [marble]',
		icon:[33,23,'magixmod'],
		res:{
			'gather':{'stone':0.2,'clay':0.002,'limestone':0.003},
			'dig':{'mud':0.1,'clay':0.3,'stone':0.6,'copper ore':0.008,'tin ore':0.008,'limestone':0.1,'salt':0.051,'sand':0.00001},
			'mine':{'stone':0.8,'copper ore':0.01,'tin ore':0.08,'iron ore':0.042,'gold ore':0.0052,'coal':0.11,'salt':0.14,'gems':0.004,'Various stones':0.2/*no osmium*/,'pyrite':0.0015},
			'quarry':{'cut stone':0.9,'limestone':0.5,'marble':0.0088,'Various cut stones':0.1},
			'deep mine':{'pyrite':0.07,'zinc ore':0.02,'dinium ore':0.042,'gems':0.007},
			'deep quarry':{'lead ore':0.03,'mythril ore':0.027,'blackium ore':0.05,'unknownium ore':0.025},
		},
		affectedBy:['mineral depletion'],
		noAmount:true,
		mult:5,
	});
		new G.Goods({
		name:'tundra rocky substrate',
		desc:'A [tundra rocky substrate] is found underneath biomes with low temperatures or similar to tundra.//Surface [stone]s may be gathered by hand.//This soil contains less [clay] and [mud], more [stone]s and a little bit less [copper ore,Ores].//Mining provides the best results, outputting a variety of [stone]s, more common [iron ore]s and [coal], but less amounts of ores like [copper ore,Copper] or [tin ore,Tin]. Can\'t forget about [gems]//Quarrying underneath there provides more [limestone] and [platinum ore].',
		icon:[33,22,'magixmod'],
		res:{
			'gather':{'stone':0.2,'clay':0.004,'limestone':0.0035},
			'dig':{'mud':1.5,'clay':0.2,'stone':0.6,'copper ore':0.006,'tin ore':0.006,'limestone':0.1,'salt':0.051},
			'mine':{'stone':0.95,'copper ore':0.09,'tin ore':0.07,'iron ore':0.046,'gold ore':0.0035,'coal':0.16,'salt':0.1,'gems':0.005,'Various stones':0.05,'pyrite':0.02/*osmium 0.041*/},
			'quarry':{'cut stone':0.85,'limestone':0.62,'marble':0.01,'Various cut stones':0.15},
			'deep mine':{'pyrite':0.02,'zinc ore':0.03,'dinium ore':0.06,'gems':0.003},
			'deep quarry':{'lead ore':0.04,'mythril ore':0.015,'blackium ore':0.025,'unknownium ore':0.02,'salt':0.001},
		},
		affectedBy:['mineral depletion'],
		noAmount:true,
		mult:5,
	});
	new G.Goods({
		name:'ice desert rocky substrate',
		desc:'A [ice desert rocky substrate] is found underneath biomes with very low temperatures.//Surface [stone]s may be gathered by hand.//This soil contains no [mud], more [stone]s and [limestone] and rarely [copper ore,Ores].//Mining provides the best results, outputting a variety of [stone]s, way more common [iron ore]s, more common [nickel ore] and [coal], but less amounts of ores like [copper ore,Copper] or [tin ore,Tin]. Can\'t forget about [gems]. There you can find a little bit more of them.//Quarrying underneath there provides more [limestone] and [marble] but way less [Various stones].//<font color="#ffcccc">This substrate contains no [salt].</font>',
		icon:[33,21,'magixmod'],
		res:{
			'gather':{'stone':0.2,'clay':0.002,'limestone':0.0035},
			'dig':{'clay':0.2,'stone':0.6,'copper ore':0.001,'tin ore':0.001,'limestone':0.105},
			'mine':{'stone':0.944,'copper ore':0.09,'tin ore':0.07,'iron ore':0.06,'gold ore':0.0035,'coal':0.21,'gems':0.0052,'Various stones':0.006/*osmium 0.04*/},
			'quarry':{'cut stone':0.999,'limestone':0.62,'marble':0.01,'Various cut stones':0.001},
			'deep mine':{'zinc ore':0.07,'dinium ore':0.06,'gems':0.003},
			'deep quarry':{'lead ore':0.08,'mythril ore':0.019,'blackium ore':0.01,'unknownium ore':0.05},
		},
		affectedBy:['mineral depletion'],
		noAmount:true,
		mult:5,
	});
	new G.Goods({
		name:'wet rocky substrate',
		desc:'A [wet rocky substrate] is found underneath terrain with high humidity.//Surface [stone]s may be gathered by hand.//Digging often produces way more [mud] and [clay], more [stone]s and occasionally [copper ore,Ores] and [clay]. Digging there provides more [limestone] but provides no [salt].//Mining provides the best results, outputting a variety of [stone]s, more common [copper ore,Copper] , and precious [gems]. Also mining there provides way less [iron ore,Iron] and [nickel ore,Nickel].//Quarrying provides a little more [limestone] and [marble] but less [cut stone].',
		icon:[33,20,'magixmod'],
		res:{
			'gather':{'stone':0.25,'clay':0.007,'limestone':0.005},
			'dig':{'mud':4.2,'clay':0.45,'stone':0.6,'copper ore':0.008,'tin ore':0.008,'limestone':0.14},
			'mine':{'stone':0.85,'copper ore':0.011,'tin ore':0.085,'iron ore':0.02,'gold ore':0.004,'coal':0.09,'salt':0.11,'gems':0.005,'Various stones':0.15},
			'quarry':{'cut stone':0.81,'limestone':0.55,'marble':0.011,'Various cut stones':0.09},
			'deep mine':{'pyrite':1,'zinc ore':0.04,'dinium ore':0.01,'gems':0.002},
			'deep quarry':{'lead ore':0.045,'mythril ore':0.032,'unknownium ore':0.06},
			
		},
		affectedBy:['mineral depletion'],
		noAmount:true,
		mult:5,
	});
	new G.Goods({
		name:'jungle rocky substrate',
		desc:'A [jungle rocky substrate] is found underneath jungles.//Surface [stone]s may be gathered by hand.//Digging often produces way more [clay], more [stone]s and occasionally [copper ore,Ores] and [clay]. Digging there provides more [limestone] but provides no [salt].//Mining provides the best results, outputting a variety of [stone]s, more common [tin ore,Tin] but less precious [gems] and way less [copper ore,Copper] amounts. Also mining there provides way less [iron ore,Iron] and [nickel ore,Nickel].//Quarrying provides less [platinum ore,Platinum].',
		icon:[33,18,'magixmod'],
		res:{
			'gather':{'stone':0.25,'clay':0.005,'limestone':0.005},
			'dig':{'mud':2,'clay':0.35,'stone':0.6,'copper ore':0.008,'tin ore':0.008,'limestone':0.14},
			'mine':{'stone':0.8,'copper ore':0.004,'tin ore':0.014,'iron ore':0.05,'gold ore':0.004,'coal':0.09,'salt':0.11,'gems':0.004,'Various stones':0.2},
			'quarry':{'cut stone':0.75,'limestone':0.5,'marble':0.01,'Various cut stones':0.25},
			'deep mine':{'zinc ore':0.01,'dinium ore':0.04},
			'deep quarry':{'lead ore':0.05,'mythril ore':0.032,'unknownium ore':0.04},
		},
		affectedBy:['mineral depletion'],
		noAmount:true,
		mult:5,
	});
	new G.Goods({
		name:'lush rocky substrate',
		desc:'A [lush rocky substrate] is found underneath terrain with lush temperature and stable humidity.//Surface [stone]s may be gathered by hand.//Digging often produces [mud], more [stone]s and occasionally [copper ore,Ores] and a bit less [clay].//Mining provides the best results, outputting a variety of [stone]s, a little bit more rarely [gold ore,Ores], and precious [gems] but less ores like [copper ore,Copper],[tin ore,Tin],[nickel ore,Nickel],[iron ore,Iron]. Also there you will find less [coal]//Quarrying there gives a little bit more [marble],[platinum ore,Platinum].',
		icon:[33,19,'magixmod'],
		res:{
			'gather':{'stone':0.25,'clay':0.005,'limestone':0.005},
			'dig':{'mud':2,'clay':0.13,'stone':0.6,'copper ore':0.0079,'tin ore':0.0081,'limestone':0.1,'salt':0.05},
			'mine':{'stone':0.88,'copper ore':0.055,'tin ore':0.055,'iron ore':0.025,'gold ore':0.0038,'coal':0.078,'salt':0.1,'gems':0.005,'Various stones':0.12},
			'quarry':{'cut stone':0.9,'limestone':0.5,'marble':0.01,'Various cut stones':0.1},
			'deep mine':{'pyrite':0.05,'zinc ore':0.035,'dinium ore':0.045,'gems':0.001},
			'deep quarry':{'lead ore':0.046,'mythril ore':0.024,'blackium ore':0.034,'salt':0.001,'unknownium ore':0.034},
		},
		affectedBy:['mineral depletion'],
		noAmount:true,
		mult:5,
	});
	new G.Goods({
		name:'dead rocky substrate',
		desc:'A [dead rocky substrate] is unique for Dead forest biome.//Surface [stone]s may be gathered by hand.//Digging rarely produces [mud], more [stone]s and occasionally [copper ore,Ores] and [clay].//Mining there is not worthy at all because there you will find almost no [tin ore,Ores]. //Same with quarrying except ([marble] and [platinum ore,Platinum] which is more often than anywhere else). //<font color="#aabbbb">There you will find no [gold ore,Gold] and no [nickel ore,Nickel].</font>',
		icon:[33,16,'magixmod'],
		res:{
			'gather':{'stone':0.25,'clay':0.004,'limestone':0.002},
			'dig':{'mud':0.5,'clay':0.05,'stone':0.2,'copper ore':0.002,'tin ore':0.002,'limestone':0.025,'salt':0.02/*osmium 0.001*/},
			'mine':{'stone':0.8,'copper ore':0.03,'tin ore':0.03,'iron ore':0.01,'coal':0.04,'salt':0.1,'gems':0.001,'Various stones':0.2},
			'quarry':{'cut stone':0.6,'limestone':0.1,'marble':0.01,'Various cut stones':0.2},
			
		},
		affectedBy:['mineral depletion'],
		noAmount:true,
		mult:3.85,
	});
	new G.Goods({
		name:'dead grass',
		desc:'[dead grass] is a bad source of [herb]s; Because it is dead grass there is almost no [fruit]s',
		icon:[33,15,'magixmod'],
		res:{
			'gather':{'fruit':0.1,'stick':0.5},
		},
		mult:8.5,
	});
	new G.Goods({
		name:'mudwater',
		desc:'[mudwater], whether found in some swamps and Dead forests, can be only collected for unhealthy [muddy water].',
		icon:[33,17,'magixmod'],
		res:{
			'gather':{'muddy water':12},
		},
		mult:5,
	});
	new G.Goods({
		name:'animal corpse',
		desc:'[animal corpse]s can be only found there. Some of them are dug underground by the ages, so both digging and gathering may provide some [bone]s.',
		icon:[33,14,'magixmod'],
		res:{
			'gather':{'bone':0.1},
			'dig':{'bone':0.2}
		},
		mult:2,
	});
	new G.Goods({
		name:'dead fishes',
		desc:'Disgusting smell... Eww. This can give you [spoiled food] out of fishing.',
		icon:[33,13,'magixmod'],
		res:{
			'fish':{'spoiled food':0.01},
		},
		mult:2,
	});
	new G.Goods({
		name:'spoiled fruits',
		desc:'Fruits that are dangerous for health when eaten. Source of [spoiled food].',
		icon:[33,12,'magixmod'],
		res:{
			'gather':{'spoiled food':0.1},	
		},
		mult:2,
	});
		new G.Goods({
		name:'badlands substrate',
		desc:'A [badlands substrate] can be only found in badlands biome.//Instead of [stone]s there are [Various stones] that can be gathered by hand.//By digging you can find less [mud] and [clay], more [Various stones] and in little less amounts [copper ore,Soft metal ores]. You won\'t find any [salt] by digging.//Mining provides the best results, outputting a variety of [Various stones], more often [gold ore,Precious ores], [salt] and [gems], but you will find less [coal] there.',
		icon:[3,29,'magixmod'],
		res:{
			'gather':{'Various stones':0.25,'clay':0.005,'limestone':0.005},
			'dig':{'mud':0.5,'clay':0.05,'Various stones':0.6,'copper ore':0.006,'tin ore':0.006,'limestone':0.11},
			'mine':{'Various stones':0.97,'copper ore':0.065,'tin ore':0.06,'iron ore':0.035,'gold ore':0.008,'coal':0.03,'salt':0.16,'gems':0.009,'stone':0.03/*osmium 0.01*/},
			'quarry':{'cut stone':0.05,'limestone':0.5,'marble':0.01,'Various cut stones':0.95},
			'deep mine':{'pyrite':0.001,'zinc ore':0.05,'dinium ore':0.041},
			'deep quarry':{'mythril ore':0.01,'blackium ore':0.032,'unknownium ore':0.02},
		},
		affectedBy:['mineral depletion'],
		noAmount:true,
		mult:5,
	});
	new G.Goods({
		name:'ostrich',
		desc:'[meat] source that can be found in: <b>Savanna</b>,<b>Desert</b> and <b>Badlands</b>. Ostriches are birds without wings and run very fast making hunting more challenging.',
		icon:[choose([4,5]),29,'magixmod'],
		res:{
			'hunt':{'meat':2,'bone':0.25},
		},
		mult:2,
	});
	new G.Goods({
		name:'xeric substrate',
		desc:'A [xeric substrate] can be only found at xeric shrublands.//There are [stone]s that can be gathered by hand.//By digging you can find no [clay], less [stone]s and some [copper ore,Ores]. Rarely by digging you can find some [salt].//Mining provides the best results, outputting a variety of [stone]s, more often [gold ore,Precious ores](in fact more fool\'s gold than true gold) and precious [gems].//Quarrying there provides no mythril.',
		icon:[6,29,'magixmod'],
		res:{
			'gather':{'Various stones':0.25,'clay':0.005,'limestone':0.005},
			'dig':{'mud':2.15,'stone':0.1,'copper ore':0.008,'tin ore':0.008,'limestone':0.13,'salt':0.001},
			'mine':{'stone':0.9,'copper ore':0.08,'tin ore':0.08,'iron ore':0.04,'gold ore':0.04,'coal':0.07,'salt':0.15,'gems':0.009,'Various stones':0.1},
			'quarry':{'cut stone':0.05,'limestone':0.5,'marble':0.01,'Various cut stones':0.95},
		},
		affectedBy:['mineral depletion'],
		noAmount:true,
		mult:5,
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
					else if(wetTile>0.04) biomes.push('xeric shrubland');
					else biomes.push('desert');
				}
				else if (tempTile>0.85)
				{
					if (landTile=='ocean') biomes.push('tropical ocean');
					else if (wetTile<=0.12) biomes.push('badlands');
					else if (wetTile<0.25 && wetTile>0.18) biomes.push('desert');
					else if(wetTile>0.3 && wetTile<0.385) biomes.push('xeric shrubland');
					else if (wetTile>0.5 && wetTile <0.75) biomes.push('jungle');
					else if (wetTile>0.884) biomes.push('dead forest');
					else biomes.push('savanna');
				}
				else
				{
					if (landTile=='ocean') biomes.push('ocean');
					else if (wetTile<0.25) biomes.push('shrubland');
					else if (wetTile>0.5 && wetTile<0.78) biomes.push('forest');
					else if (wetTile>0.78) biomes.push('lavender fields');
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
