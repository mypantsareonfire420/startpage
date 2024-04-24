let creation = 'This page was created on 2024-04-13<br>The original startpage was created on (at least) 2022-09-20'

window.onload = () => {
  recursion();
  getDecimalDate();
}

async function recursion() {
  let d = new Date();
  let x = ((d.getHours() * 3600) + (d.getMinutes() * 60) + d.getSeconds()) * 1000 + d.getMilliseconds();
  x = parseInt((x / 864).toFixed(0));

  for(let i = 0; i <= 100; i++) {
    await new Promise((res) => setTimeout(res, 864));
    x += 1;
    updateMessage(x);
  }

  recursion();
}

function formatDecimalTime(x) {
  // 100 seconds in a minute, 100 minutes in an hour, 10 hours a day
  x = x.toString();
  if(x.length < 5) {
    x = `${ '0'.repeat(5 - x.length) }${ x }`;
  }

  x = `${ x[0] }:${ x[1] }${ x[2] }:${ x[3] }${ x[4] }`;
  return x;
}

function getDecimalDate() {
  // year starts the day after the end of the mayan calendar (calendar ends on fri 2012-12-21, calendar starts on sat 2012-12-22)
  let days = ['Solis', 'Mercurialis', 'Venus', 'Terra', 'Mars', 'Luppiter', 'Saturnini', 'Uranus', 'Neptunus', 'Pluto'];
  
  let now = new Date();
  now = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let then = new Date(now.getFullYear() % 2 === 0 ? now.getFullYear() - 2 : now.getFullYear() - 1, 11, 22);
  let start = new Date('2012/12/21');

  let dayDiff = Math.round((now.getTime() - then.getTime()) / (1000 * 3600 * 24));
  let fullDayDiff = Math.round((now.getTime() - start.getTime()) / (1000 * 3600 * 24));

  let weekNumber = Math.floor(dayDiff / 10) + 1;
  let dayOfTheWeek = days[dayDiff % 10];

  let year = Math.floor(fullDayDiff / 365.2425);

  return `${ dayOfTheWeek }, ${ year }-${ weekNumber }-${ dayDiff % 10 }`
}

function updateMessage(x) {
  document.getElementById('testmessage').innerHTML = `<h3 style="text-align: center;">Today is ${ getDecimalDate() } at ${ formatDecimalTime(x) }<br>${ creation }</h3>`;
}
