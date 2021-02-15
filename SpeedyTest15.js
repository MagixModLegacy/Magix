G.AddData({
name:'Speedy',
author:'pelletsstarPL',
desc:'Not only pause , speed x1 , speed x30. Using a new button you can pick which speed do you want.',
engineVersion:1,
manifest:'ModManifest.js',
func:function(){
	var speed=1;
G.createTopInterface=function()
	{
		var str=''+
		'<div class="flourishL"></div><div class="framed fancyText bgMid" style="display:inline-block;padding:8px 12px;font-weight:bold;font-size:18px;font-variant:small-caps;" id="date">-</div><div class="flourishR"></div><br>'+
		'<div class="flourish2L"></div>'+
		'<div id="fastTicks" class="framed" style="display:inline-block;padding-left:8px;padding-right:8px;font-weight:bold;">0</div>'+
		G.button({id:'pauseButton',
			text:'<div class="image" style="width:9px;background:url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/playButtons.png) 0px 0px;"></div>',
			tooltip:'Time will be stopped.<br><b>Generates fast ticks.</b>',
			onclick:function(){G.setSetting('paused',1);
      G.fps=30;
					  }
		})+
		G.button({id:'playButton',
			text:'<div class="image" style="width:9px;background:url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/playButtons.png) -11px 0px;"></div>',
			tooltip:'Time will pass by normally - 1 day every second.',
			onclick:function(){G.setSetting('paused',0);G.setSetting('fast',0);
      G.fps=30;
					  }
		})+
		G.button({id:'fastButton',
			text:'<div class="image" style="width:9px;background:url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/playButtons.png) -21px 0px;"></div>',
			tooltip:'Time will go by about 30 times faster - 1 month every second.<br>Uses up fast ticks.<br>May lower browser performance while active.',
			onclick:function(){if (G.fastTicks>0) {G.setSetting('paused',0);G.setSetting('fast',1);}
      G.fps=30;
					  }
		})+
    	G.button({id:'customSpeedButton',
			text:'<div class="image" style="width:9px;background:url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/playButtons.png) -31px 0px;"></div>',
			tooltip:'You can decide at which speed game will go. Enter a number by which speed shall be multiplied. <br>Note that it may lower browser performance while active and it will consume fast ticks.',
			onclick:function(){if (G.fastTicks>0) {G.setSetting('paused',0);G.setSetting('fast',0);
      var sp=prompt("Please tell me at which speed you want to run this game. \n Note that it is going to work like 3x or 4x so all you need to type is just the number.");
	var Speed=parseFloat(sp);						
      if(isNaN(Speed)==false && Speed!=0){
      G.tickDuration=(30/speed);
	      speed=3;
	      G.middleText('- Speed x'+Speed+' -');
      }else{
      G.tickDuration=30;
      }
      }}
		})+
		'<div class="flourish2R"></div>';
		
		l('topInterface').innerHTML=str;
		
		G.addTooltip(l('date'),function(){return '<div class="barred">Date</div><div class="par">This is the current date in your civilization.<br>One day elapses every second, and 300 days make up a year.</div>';},{offY:-8});
		G.addTooltip(l('fastTicks'),function(){return '<div class="barred">Fast ticks</div><div class="par">This is how many ingame days you can run at fast speed.</div><div class="par">You gain a fast tick for every second you\'re paused or offline.</div><div class="par">You also gain fast ticks everytime you research a technology.</div><div class="divider"></div><div class="par">You currently have <b>'+BT(G.fastTicks)+'</b> of game time saved up,<br>which will execute in <b>'+BT(G.fastTicks/30)+'</b> at fast speed,<br>advancing your civilization by <b>'+G.BT(G.fastTicks)+'</b>.</div>';},{offY:-8});
		
		l('fastTicks').onclick=function(e)
		{
			if (G.getSetting('debug'))
			{
				//debug : gain fast ticks
				G.fastTicks+=10*G.getBuyAmount();
				G.fastTicks=Math.max(0,G.fastTicks);
			}
		};
		
		G.addCallbacks();
		G.updateSpeedButtons();
	}
	G.updateSpeedButtons=function()
	{
			var div=l('pauseButton');
			if (div)
			{
				var speed=1;
				if (G.getSetting('fast')) speed=2;
				if (G.getSetting('paused') || G.getSetting('forcePaused')) speed=0;
				if (speed==0) {if (G.getSetting('animations')) {triggerAnim(l('pauseButton'),'plop');} l('pauseButton').classList.add('on');l('playButton').classList.remove('on');l('fastButton').classList.remove('on');l('customSpeedButton').classList.remove('on');}
				else if (speed==1) {if (G.getSetting('animations')) {triggerAnim(l('playButton'),'plop');} l('pauseButton').classList.remove('on');l('playButton').classList.add('on');l('fastButton').classList.remove('on');l('customSpeedButton').classList.remove('on');}
				else if (speed==2) {if (G.getSetting('animations')) {triggerAnim(l('fastButton'),'plop');} l('pauseButton').classList.remove('on');l('playButton').classList.remove('on');l('fastButton').classList.add('on');l('customSpeedButton').classList.remove('on');}
				else if (speed==3) {if (G.getSetting('animations')) {triggerAnim(l('customSpeedButton'),'plop');} l('pauseButton').classList.remove('on');l('playButton').classList.remove('on');l('fastButton').classList.remove('on');l('customSpeedButton').classList.add('on');}
			}
	}
	
}});
