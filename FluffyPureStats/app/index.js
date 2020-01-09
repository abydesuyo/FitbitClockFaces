import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { today } from "user-activity";
import { goals } from "user-activity";
import { battery } from "power";
import * as util from "../common/utils";

// Update the clock every seconds
clock.granularity = "seconds";

// Get a handle on the <text> element
const mainClock = document.getElementById("mainClock");
const secondsClock = document.getElementById("secondsClock");
const dateDisplay = document.getElementById("dateDisplay");



// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  let secs = util.zeroPad(today.getSeconds());
  var dateArray = new Array();
  dateArray = today.toString().split(' ',4);
  let dayoftheWeek = dateArray[0];
  let month = dateArray[1];
  let day = dateArray[2];
  let year = dateArray[3];
  mainClock.text = `${hours}:${mins}`;
  secondsClock.text = `${secs}`;
  dateDisplay.text = `${dayoftheWeek}, ${day} ${month} ${year}`;
  displayBattery();
  displayHorizontalStat('steps');
  displayHorizontalStat('elevationGain');
  displayHorizontalStat('distance');
  displayHorizontalStat('activeMinutes');
}


function displayHorizontalStat(sTodayStat)
{
  let iStat = (today.local[sTodayStat] || 0);
  let iGoal = (goals[sTodayStat] || 0);
  let iPercent = Math.floor(iStat/iGoal*100);

  var el = document.getElementById(sTodayStat);

  let widthtoSet = Math.floor(iPercent/100 * 150);
  if (widthtoSet < 150)
    {
      el.width = widthtoSet;      
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

function displayBattery()
{
  let batterystats = (battery['chargeLevel'] || 0);
  var el = document.getElementById('battery');
  var elstat = document.getElementById('batteryStats');
  colourScheme(el, batterystats);
  elstat.text = `${batterystats}%`;
}
