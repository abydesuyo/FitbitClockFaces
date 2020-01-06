import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { today } from "user-activity";
import { goals } from "user-activity";
import * as util from "../common/utils";



// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const myStepStats = document.getElementById("myStepStats");
const myDistStats = document.getElementById("myDistStats");
const myActStats = document.getElementById("myActStats");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let now = evt.date;
  let hours = now.getHours();
  let stepstoday = (today.local['steps'] || 0);
  let stepsgoal = (goals['steps'] || 0);
  let distoday = (today.local['distance'] || 0);
  let distgoal = (goals['distance'] || 0);
  let activitytoday = (today.local['activity'] || 0);
  let activitygoal = (goals['activity'] || 0);
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(now.getMinutes());
  myLabel.text = `${hours}:${mins}`;
  myStepStats.text = `Steps : ${stepstoday}/${stepsgoal}`;
  myDistStats.text = `Distance : ${distoday}/${distgoal}`;
  myActStats.text = `Activity : ${activitytoday}/${activitygoal}`;
  // updateHorizontalBar('steps');
  // updateHorizontalBar('distance');
  // updateHorizontalBar('calories');
}


function updateHorizontalBar(sTodayStat)
{
  let iStat = (today.local[sTodayStat] || 0);
  let iGoal = (goals[sTodayStat] || 0);
  let iPercent = Math.floor(iStat/iGoal*100);
  
  var el = document.getElementById(sTodayStat);
  var elBG = document.getElementById("background");
  var iScreenWidth = elBG.getBBox().width;
  var iBarWidth = Math.floor(iPercent * (iScreenWidth/100));
  el.width = iBarWidth;
  el.x = iScreenWidth/2-iBarWidth/2;
  
  colourStat(el, iPercent);
}


function colourStat(el, iPercentage)
{
  let dtDate = new Date();
  let iHours = dtDate.getHours();
  let iDayPercent = Math.floor(iHours/24*100);

  if (iPercentage > 100)
  {
    el.style.fill = "fb-mint";
  }
  else
  {
    let iPercentDiff = iDayPercent - iPercentage;
    if (iPercentDiff < 0)
    {
      el.style.fill = "fb-cyan";
    }
    else if (iPercentDiff < 10)
    {
      el.style.fill = "fb-yellow";
    }
    else if (iPercentDiff < 20)
    {
      el.style.fill = "fb-orange";
    }
    else
    {
      el.style.fill = "fb-red";
    }
  }
}
