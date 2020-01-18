import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { today } from "user-activity";
import { goals } from "user-activity";
import { battery } from "power";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { user } from "user-profile";
import * as util from "../common/utils";

// Update the clock every seconds
clock.granularity = "seconds";

// Get a handle on the <text> elements
const mainClock = document.getElementById("mainClock");
const secondsClock = document.getElementById("secondsClock");
const dateDisplay = document.getElementById("dateDisplay");
// const hrm = new HeartRateSensor({ frequency: 1 });
const hrm = new HeartRateSensor();

hrm.onerror = function () { console.log(`restarting hrm after crash..`); hrm.start(); };
hrm.onreading = function() { displayHeartRate(); };
hrm.start();

display.addEventListener("change", () => {
  // Automatically stop the sensor when the screen is off to conserve battery
  // console.log(hrm.heartRate);
  display.on ? hrm.start() : hrm.stop();
});


// Update the <text> elements every tick with the current time
clock.ontick = (evt) => {
  // hrm.start();
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
  // displayHorizontalStat('distance'); // Disable Distance on user request and replaced that with Calories
  displayHorizontalStat('calories');
  displayHorizontalStat('activeMinutes');
  // displayHeartRate();
  // hrm.stop();
}


function displayHorizontalStat(sTodayStat)
{
  let iStat = (today.local[sTodayStat] || 0);
  let iGoal = (goals[sTodayStat] || 0);
  let iPercent = Math.floor(iStat/iGoal*100);
  let maxwidth = 150;

  var el = document.getElementById(sTodayStat);

  let widthtoSet = Math.floor(iPercent/100 * maxwidth);
  if (widthtoSet < maxwidth)
    {
      el.width = widthtoSet;      
    }
 else
   {
     el.width = maxwidth;
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
    el.style.fill = "fb-green";
  }
  else if (iPercentage >= 50)
  {
    el.style.fill = "fb-cyan";
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

function hrColourScheme(el, hrValue)
{
  let hrz = user.heartRateZone(hrValue);
  // console.log(`${hrz}`);
  if (hrz == 'out-of-range' || hrz == 'below-custom')
  {
    el.style.fill = "fb-white";
  }
  else if (hrz == 'fat-burn' || hrz == 'custom')
  {
    el.style.fill = "fb-yellow";
  }
  else if (hrz == 'cardio' || hrz == 'above-custom')
  {
    el.style.fill = "fb-orange";
  }
  else if (hrz == 'peak' || hrz == 'above-custom')
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


function displayHeartRate()
{
  let hrstats = (hrm['heartRate'] || '--');
  // let hrstats = hrm.heartRate;
  // let hrpercent = Math.abs(100 - ((hrstats/150)*100));
  var el = document.getElementById('heartRate');
  // var elstat = document.getElementById('batteryStats');
  hrColourScheme(el, hrstats);
  el.text = `${hrstats}`;
  // console.log(`function got called`);
}

