let creation = 'This page was created on 2024-04-13<br>The original startpage was created on (at least) 2022-09-20'

window.onload = () => {
  recursion();
  getDecimalDate();
  dayCounter();
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

// [today - input date] days [message]
// [today - input date * -1] days [until message]
function dayCounter() {
  let dates = [
    ['2024', '07', '20', 'without bullshit'],
    ['2024', '05', '06', 'using obsidian'],
    ['2023', '12', '14', 'since graduating college'],
    ['2023', '10', '15', 'without instagram'],
    ['2022', '09', '20', 'since birth of startpage'],
    ['2021', '05', '15', 'since graduating high school'],
    ['2020', '11', '09', 'without a haircut'],
    ['2020', '10', '03', 'since i was truly happy'],
    ['2002', '12', '19', 'days sober', 1]
  ];
  // start date, reason, 1 => <br> || -1 => days until vs days since

  let h3 = `<h3>`;
  let now = new Date();
  for(let i = 0; i < dates.length; i++) {
    let then = new Date(dates[i][0], dates[i][1] - 1, dates[i][2], 0, 0, 0);
    let dayCounter = Math.floor((now - then) / (1000 * 3600 * 24));

    h3 += `${ dayCounter } days ${ dates[i][3] } (${ 
      then.toLocaleDateString('en-UK').split('/').reverse().join('-') 
    }, ${ (dayCounter / 3.65).toFixed(1) }%)<br>`;

    if(dates[i][4] && dates[i][4] === 1) {
      h3 += '<br>';
    }
  }

  document.getElementById('daycounter').innerHTML = h3 + '</h3>';
}
