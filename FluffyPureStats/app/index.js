import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
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
  // console.log(`${dayoftheWeek}, ${day} ${month}`);
  // console.log(`${today.toString()}`);
  // console.log(`${dayoftheWeek}`)
}
