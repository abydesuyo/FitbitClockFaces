import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { today } from "user-activity";
import { goals } from "user-activity";
import { battery } from "power";
import * as util from "../common/utils";


// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const timeDisplay = document.getElementById("timeDisplay");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let now = evt.date;
  let hours = now.getHours();
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(now.getMinutes());
  timeDisplay.text = `${hours}:${mins}`;
  displayHorizontalStat('steps','Steps');
  displayHorizontalStat('elevationGain','Stairs');
  displayHorizontalStat('activeMinutes','Active');
  displayHorizontalStat('distance','Distance');
  displayBattery();
}



function displayBattery()
{
  let batterystats = (battery['chargeLevel'] || 0);
  var el = document.getElementById('battery');
  el.text = `${batterystats}%`;
  colourScheme(el, batterystats);
}

function displayHorizontalStat(sTodayStat, displayText)
{
  let iStat = (today.local[sTodayStat] || 0);
  let iGoal = (goals[sTodayStat] || 0);
  let iPercent = Math.floor(iStat/iGoal*100);
  
  var el = document.getElementById(sTodayStat);
  el.text = `${displayText} ${iStat}/${iGoal}`;
  let width = el.getBBox().width; 
  let dotstr = '.'
  while(width < 280){
    el.text = `${displayText} ${dotstr} ${iStat}/${iGoal}`; 
    width = el.getBBox().width;
    dotstr = dotstr + '.';
  }
  colourScheme(el, iPercent);
}

function colourScheme(el, iPercentage)
{
  if (iPercentage >= 100)
  {
    el.style.fill = "fb-mint";
  }
  else if (iPercentage >= 80)
  {
    el.style.fill = "fb-cyan";
  }
  else if (iPercentage >= 50)
  {
    el.style.fill = "fb-green";
  }
  else if (iPercentage >= 30)
  {
    el.style.fill = "fb-orange";
  }
  else
  {
    el.style.fill = "fb-red";
  }
}


// function updateHorizontalBar(sTodayStat)
// {
//   let iStat = (today.local[sTodayStat] || 0);
//   let iGoal = (goals[sTodayStat] || 0);
//   let iPercent = Math.floor(iStat/iGoal*100);
  
//   var el = document.getElementById(sTodayStat);
//   var elBG = document.getElementById("background");
//   var iScreenWidth = elBG.getBBox().width;
//   var iBarWidth = Math.floor(iPercent * (iScreenWidth/100));
//   el.width = iBarWidth;
//   el.x = iScreenWidth/2-iBarWidth/2;
  
//   colourStat(el, iPercent);
// }


