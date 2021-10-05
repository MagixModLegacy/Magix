G.AddData({
name:'Speedy',
author:'pelletsstarPL',
desc:'Not only pause , speed x1 , speed x30. Using a new button you can pick which speed do you want.',
engineVersion:1,
manifest:'ModManifest.js',
func:function(){
	G.tickDuration=30;
	var speed=1;
	if(G.modsByName!=['Magix utils']){
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
					     G.tickDuration=30;
					  }
		})+
		G.button({id:'playButton',
			text:'<div class="image" style="width:9px;background:url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/playButtons.png) -11px 0px;"></div>',
			tooltip:'Time will pass by normally - 1 day every second.',
			onclick:function(){G.setSetting('paused',0);G.setSetting('fast',0);
					   G.tickDuration=30;
					  }
		})+
		G.button({id:'fastButton',
			text:'<div class="image" style="width:9px;background:url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/playButtons.png) -21px 0px;"></div>',
			tooltip:'Time will go by about 30 times faster - 1 month every second.<br>Uses up fast ticks.<br>May lower browser performance while active.',
			onclick:function(){if (G.fastTicks>0) {G.setSetting('paused',0);G.setSetting('fast',1);}
					  
					  }
		})+
    	G.button({id:'customSpeedButton',
			text:'<div class="image" style="width:9px;background:url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/playButtons.png) -31px 0px;"></div>',
			tooltip:'You can decide at which speed game will go. Enter a number by which speed shall be multiplied. <br>Note that it may lower browser performance while active and it will consume fast ticks.',
			onclick:function(){if (G.fastTicks>0) {G.setSetting('paused',0);G.setSetting('fast',0);
      var sp=prompt("Please tell me at which speed you want to run this game. \n Note that it is going to work like 3x or 4x so all you need to type is just the number.");
	var Speed=parseFloat(sp);						
      if(isNaN(Speed)==false && Speed!=0){
      G.tickDuration=30/Speed;
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
	G.updateSpeedButtons = () => {
  const pause = l('pauseButton');
  const play = l('playButton');
  const fast = l('fastButton');
//  const customSpeed = l('customSpeedButton');

  if (pause) {
    let speed = 1;
    if (G.getSetting('fast')) {
      speed = 2;
    } // customSpeed.classList.remove('on')
    if (G.getSetting('paused') || G.getSetting('forcePaused')) {
      speed = 0;
    }

    pause.classList.remove('on');
    play.classList.remove('on');
    fast.classList.remove('on');
    //customSpeed.classList.remove('on');
    if (speed === 0) {
      G.getSetting('animations') && triggerAnim(pause, 'plop');

      pause.classList.add('on');
    } else if (speed === 1) {
      G.getSetting('animations') && triggerAnim(play, 'plop');

      play.classList.add('on');
    } else if (speed === 2) {
      G.getSetting('animations') && triggerAnim(fast, 'plop');

      fast.classList.add('on');
    } else if (speed === 3) {
      //G.getSetting('animations') && triggerAnim(customSpeed, 'plop');

     // customSpeed.classList.add('on');
    }
  }
};
    }else{
        G.createTopInterface=function()
	{
		var i=0;
		if(G.year%40>=20)i=39-G.year%40;
		else{ i=G.year%40};
		var str=''+
		'<div class="flourishL"></div><div class="framed fancyText bgMid" style="display:inline-block;padding:8px 12px;height:32px;font-weight:bold;font-size:18px;font-variant:small-caps;" id="date">-</div>';
		if(G.modsByName['Elves']){
			if(G.has('Ice') || G.has('warmth') || G.has('earth') || G.has('mystic') || G.has('water')){
			str+='<div class="framed fancyText bgMid" style="height:32px;width:32px;display:inline-block;padding:8px 12px;font-weight:bold;font-size:18px;font-variant:small-caps;background:url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/Empowerments.png) ;background-position-x:'+(32*(G.year%40))+'px; background-position-y:'+-(32*(G.auratext+1))+'px;" id="empower"></div><div class="flourishR"></div><br>';
			}else{
			str+='<div class="framed fancyText bgMid" style="height:32px;width:32px;display:inline-block;padding:8px 12px;font-weight:bold;font-size:18px;font-variant:small-caps;background:url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/Empowerments.png) ;background-position-x:32px;" id="empower"></div><div class="flourishR"></div><br>';
			}
		}else str+=';<div class="flourishR"></div><br>';
		str+='<div class="flourish2L"></div>'+
		'<div id="fastTicks" class="framed" style="display:inline-block;padding-left:8px;padding-right:8px;font-weight:bold;">0</div>'+
		G.button({id:'pauseButton',
			text:'<div class="image" style="width:9px;background:url(img/playButtons.png) 0px 0px;"></div>',
			tooltip:'Time will be stopped.<br>Generates fast ticks.',
			onclick:function(){
				if (G.checkPolicy('Toggle SFX')=='on' && G.getSetting('paused')==false){ //prevent playsound if nothing changes
						var audio = new Audio('http://orteil.dashnet.org/cookieclicker/snd/press.mp3');
						audio.play(); 
						}
						G.setSetting('paused',1);
			}
		})+
		G.button({id:'playButton',
			text:'<div class="image" style="width:9px;background:url(img/playButtons.png) -11px 0px;"></div>',
			tooltip:'Time will pass by normally - 1 day every second.',
			onclick:function(){
			if (G.checkPolicy('Toggle SFX')=='on' && (G.getSetting('paused')==true || G.getSetting('fast')==true)){ //prevent playsound if nothing changes
						var audio = new Audio('http://orteil.dashnet.org/cookieclicker/snd/press.mp3');
						audio.play(); 
						}
			G.setSetting('paused',0);G.setSetting('fast',0);
						}
		})+
		G.button({id:'fastButton',
			text:'<div class="image" style="width:9px;background:url(img/playButtons.png) -21px 0px;"></div>',
			tooltip:'Time will go by about 30 times faster - 1 month every second.<br>Uses up fast ticks.<br>May lower browser performance while active.',
			onclick:function(){
				if (G.checkPolicy('Toggle SFX')=='on' && G.getSetting('fast')==false){ //prevent playsound if nothing changes
						var audio = new Audio('http://orteil.dashnet.org/cookieclicker/snd/press.mp3');
						audio.play(); 
						}
			if (G.fastTicks>0) {G.setSetting('paused',0);
			G.setSetting('fast',1);}}
		})+
			G.button({id:'customSpeedButton',
			text:'<div class="image" style="width:9px;background:url(https://pipe.miroware.io/5db9be8a56a97834b159fd5b/playButtons.png) -31px 0px;"></div>',
			tooltip:'You can decide at which speed game will go. Enter a number by which speed shall be multiplied. <br>Note that it may lower browser performance while active and it will consume fast ticks.',
			onclick:function(){if (G.fastTicks>0) {G.setSetting('paused',0);G.setSetting('fast',0);
			 if (G.checkPolicy('Toggle SFX')=='on' && G.getSetting('fast')==false){ //prevent playsound if nothing changes
			var audio = new Audio('http://orteil.dashnet.org/cookieclicker/snd/press.mp3');
			audio.play(); 
			}
      var sp=prompt("Please tell me at which speed you want to run this game. \n Note that it is going to work like 3x or 4x so all you need to type is just the number.");
	var Speed=parseFloat(sp);						
      if(isNaN(Speed)==false && Speed!=0){
      G.tickDuration=30/Speed;
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
		var empowermentsDesc=[
		'<div class="barred">Current aura:<font color="#ccccff">Ice</b></div><br><B>Effects of ice in its current phase:</b><br> <li>Your food gathering is decreased by '+(2*i).toFixed(2)+'%</li><li>Furnaces and blacksmiths are '+(0.75*i).toFixed(2)+'% less efficient.</li><li>You gain '+(0.2*i).toFixed(2)+'% more fresh water</li><li>Water spoils '+(0.6*i).toFixed(2)+'% slower</li><li>You gain '+(0.2*i).toFixed(2)+'% more ice from digging.</li></font>',
		'<div class="barred">Current aura:<font color="#f0bb6c">Warmth</b></div><br><B>Effects of warmth in its current phase:</b><br> <li>Your water gathering is decreased by '+(2*i).toFixed(2)+'%</li><li>Fishing is '+(0.75*i).toFixed(2)+'% less efficient.</li><li>Food spoilage is '+(0.4*i).toFixed(2)+'% faster and gathering is '+(0.4*i)+'% less efficient.</li><li>Efficiency of farms and florists decreased by '+(0.4*i).toFixed(2)+'%.</li></font>',
		'<div class="barred">Current aura:<font color="#C3BBCF">Earth</b></div><br><B>Effects of earth in its current phase:</b><br> <li>Units using land waste/collapse '+(30*i)+'% faster/more often.</li><li>Furnaces and blacksmiths are '+(0.2*i).toFixed(2)+'% more efficient.</li><li>Mines and quarries are '+(0.1*i).toFixed(2)+'% more efficient.</li><li>Accident rate increased by '+(10*i).toFixed(2)+'%</li></font>',
		'<div class="barred">Current aura:<font color="#fa7df2">Mystic</b></div><br><B>Effects of mystic in its current phase:</b><br> <li>All non-magic resources decay '+(6+(1*i)).toFixed(2)+'% faster</li><li>Magical units are '+(2*i).toFixed(2)+'% more efficient.</li><li>Disease and death rate increased by'+(5+(1*i)).toFixed(2)+'%</li><li>Every year one random resource gets totally wiped<br>(<b>Warning:</b>if choice will land on any essentials it will<br>wipe all other essentials except those that<br>limit amount of other essentials.)</li></font>',
		'<div class="barred">Current aura:<font color="#4d88ff">Water</b></div><br><B>Effects of water in its current phase:</b><br> <li>Farm efficiency is increased by '+(2*i).toFixed(2)+'%</li><li>Digger,mines and quarries are '+(2*i).toFixed(2)+'% less efficient.</li><li>Wells gain '+(0.6*i).toFixed(2)+'% more fresh water</li><li>Water spoils '+(0.25*i).toFixed(2)+'% faster</li><li>'+(0.2*i).toFixed(2)+'% more mushrooms.</li></font>',
		];
		if(G.modsByName['Elves']){
			if(G.has('Ice') || G.has('warmth') || G.has('earth') || G.has('mystic') || G.has('Water')){
			G.addTooltip(l('empower'),function(){return '<div class="barred">Aura</div><div class="par">Auras affect you by effects of <b>Pressure</b>.</div><div class="par"> Auras have cycles and triggers at year:'+(236-G.techN-G.traitN)+'.</div><div class="par">There are 5 different auras. <br>Each one boosts and weakens some things and persist through<br> rest of the current run.</div><div class="par">Auras are in cycle. At middle point of cycle they have biggest power.</div>'+empowermentsDesc[G.auratext]});
			}else{
			G.addTooltip(l('empower'),function(){return (G.resets>0 ? '<div class="barred">???</div><div class="par">Once year '+(236-G.techN-G.traitN)+' strikes you will see what\'s there.<br>For now wait.</div>' :'<div class="barred">???</div><div class="par">Once it shows up you\'ll see what\'s there.<br>For now wait.</div>')});
			}
		}
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



    }
	new G.Res({name:'fasttickdebug',hidden:true,
		   tick:function(me,tick){
			if(G.tickDuration<30)G.fastTicks--;   
			   if(G.fastTicks==0){
				speed=1;
				  G.tickDuration=30;
			   }
		   }
		  });
}});
