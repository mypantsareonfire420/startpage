const httpp = new XMLHttpRequest();
const urlp = `https://api.openweathermap.org/data/2.5/weather?id=${config.city}&appid=2d33137dd0ae28b599bdcedc827a9560`;
httpp.open('GET', urlp);
httpp.send();

httpp.onload = async (e) => {
  localStorage.setItem('session', 0);
  let db = await JSON.parse(localStorage.getItem('db') ?? { opened: 0, time: 0 });

  db.opened += 1;
  localStorage.setItem('db', JSON.stringify(db));

  let poker = JSON.parse(localStorage.getItem('poker'));
  if(poker === null || poker.length === 0) {
    localStorage.setItem('poker', JSON.stringify({
		  rf: 0, sf: 0, '4k': 0, fh: 0, fl: 0, s: 0, '3k': 0, '2p': 0, p: 0, h: 0, total: 0
	  }));
  }
  
  recursion();
  updateBottomMessage();
  document.getElementById('hi').innerHTML = `<h1>Hi, ${ config.name }!</h1>`

}

async function recursion() {
  let weather = await getWeather();

  for(let i = 0; i < 600; i++) {
    await new Promise((res) => setTimeout(res, 1000));
    updateMessage(weather);

    let db = JSON.parse(localStorage.getItem('db'));
    db.time += 1;
    localStorage.setItem('db', JSON.stringify(db));
  }

  recursion();
}

function updateMessage(weather) {
  astronomy();
  let db = JSON.parse(localStorage.getItem('db'));

  let p = getProgress(weather);
  let d = getDate();
  let tw = getTemperatureAndWind(weather);
  let s = getSession();
  let ppb = getProgressProgressBar(p);
  let wpb = getWeatherProgressBar(weather);
  let wpbf = getWeatherProgressBar(weather, true)

  let o = {
    dayProgressNum: p[0][0],
    dayProgressDay: p[0][1],
    yearProgress: p[1],
    moonProgress: p[2],

    dow: d[0],
    date: d[1],
    time: d[2],

    cityName: tw[0],
    weatherDescription: tw[1],
    degC: tw[2],
    degF: tw[3],
    humidity: tw[4],
    windMS: tw[5],
    windMPH: tw[6],
    windKMH: tw[7],
    windDeg: tw[8],
    
    currentSession: s[0],
    totalSession: s[1],

    opened: db.opened,
    suffer: getSuffer(),
    event: getNextEvent(),
    progressProgressBar: ppb,
    weatherProgressBar: wpb,
    weatherProgressBarFarenheit: wpbf
  }

  let k = [];
  Object.keys(o).forEach((key) => k.push(key));

  let keywords = [];
  for(let i = 0; i < k.length; i++) {
    keywords.push(k[i]);
    keywords.push(`${ k[i] },`);
    keywords.push(`(${ k[i] })`);
    keywords.push(`${ k[i] }%`);
  }
  
  let str = config.topFormat.replace('{', '').replace('}', '')
  str = str.split(/ +/);

  function check(word) {
    // Create a regular expression pattern to match the word with optional trailing characters
    let pattern = new RegExp('^' + word + '.*$');
    
    // Check if any keyword partially matches the word
    return keywords.some(keyword => pattern.test(keyword));
}

  for(let i = 0; i < str.length; i += 1) {
    if(check(str[i])) {
      
      if(str[i].endsWith(',')) {
        str[i] = str[i].slice(0, -1);
        str[i] = o[str[i]];
        str[i] += ',';
      }
      else if(str[i].endsWith('%')) {
        str[i] = str[i].slice(0, -1);
        str[i] = o[str[i]];
        str[i] += '%';
      }
      else if(str[i].endsWith(')')) {
        str[i] = str[i].slice(0, -1);
        str[i] = o[str[i]];
        str[i] = `(${ str[i] })`;
      }
      else { str[i] = o[str[i]]; }

    } else if(str[i] === '{' || str[i] === '}') {
      str[i] = undefined;
    }
  }

  str = str.join(' ')
  document.getElementById('startmessage').innerHTML = `<h3>${ str }</h3>`

  // scan all keywords, then substitute
  // config.topFormat
}

function updateBottomMessage() {
  let now = new Date();
  let strng = '';

  if((
    (now.getFullYear() * 297) + ((now.getMonth() + 1) * 22)	* (now.getDate() * 887 + 2)
  ) % config.bottomBarNames.length === 1) {
		// 14 x 7
		const dogArr = ['D', 'O', 'G'];
		let dogString = '';
		for(let i = 0; i < (14 * 7); i++) { 
			dogString += `${ dogArr[Math.floor(Math.random() * dogArr.length)] } `
		}
		
    strng = `<h4>
      ${ dogString.substring(0, 27) }<br>
      ${ dogString.substring(28, 55) }<br>
      ${ dogString.substring(56, 83) }<br>
      ${ dogString.substring(84, 111) }<br>
      ${ dogString.substring(112, 139) }<br>
      ${ dogString.substring(140, 167) }<br>
      ${ dogString.substring(168, 195) }<br>
      </h4>`;

    document.getElementById('bottommessage').innerHTML = strng;
  } else {
    let g = getGaussian();

    let oo = {
      cah: getCardsAgainstHumanity(),
      gaussian: g[0],
      rand0_1: g[1],
      rand1_100: g[2],
      poker: getPoker()
    }
    
    let ok = [];
    Object.keys(oo).forEach((key) => ok.push(key));

    let okeywords = [];
    for(let i = 0; i < ok.length; i++) {
      okeywords.push(ok[i]);
      okeywords.push(`${ ok[i] },`);
      okeywords.push(`(${ ok[i] })`);
      okeywords.push(`${ ok[i] }%`);
    }

    let ostr = config.bottomFormat.replace('{', '').replace('}', '')
    ostr = ostr.split(/ +/);

    function check(word) {
      // Create a regular expression pattern to match the word with optional trailing characters
      let pattern = new RegExp('^' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '.*$');
      
      // Check if any keyword partially matches the word
      return okeywords.some(keyword => pattern.test(keyword));
    }

    for(let i = 0; i < ostr.length; i += 1) {
      if(check(ostr[i])) {
        
        if(ostr[i].endsWith(',')) {
          ostr[i] = ostr[i].slice(0, -1);
          ostr[i] = oo[ostr[i]];
          ostr[i] += ',';
        }
        else if(ostr[i].endsWith('%')) {
          ostr[i] = ostr[i].slice(0, -1);
          ostr[i] = oo[ostr[i]];
          ostr[i] += '%';
        }
        else if(ostr[i].endsWith(')')) {
          ostr[i] = ostr[i].slice(0, -1);
          ostr[i] = oo[ostr[i]];
          ostr[i] = `(${ ostr[i] })`;
        }
        else { ostr[i] = oo[ostr[i]]; }

      } else if(ostr[i] === '{' || ostr[i] === '}') {
        ostr[i] = undefined;
      }
    }

    ostr = ostr.join(' ')
    document.getElementById('bottommessage').innerHTML = `<h3>${ ostr }</h3>`
  }
}

// -----------------------------------

// weather body, day min, day max, total min, total max
async function getWeather() {
  const url0 = `https://api.openweathermap.org/data/2.5/weather?id=${config.city}&appid=2d33137dd0ae28b599bdcedc827a9560`;
  const response0 = await fetch(url0);
  const body0 = await response0.json();

  const url1 = `https://api.openweathermap.org/data/2.5/forecast?id=${config.city}&appid=2d33137dd0ae28b599bdcedc827a9560`;
  const response1 = await fetch(url1);
  const body1 = await response1.json();

  let dayMin = 1000;
  let dayMax = -1000;
  let min = 1000;
  let max = -1000;
  for(let i = 0; i < 8; i++) {
    dayMax = Math.max(dayMax, body1.list[i].main.temp_max);
    dayMin = Math.min(dayMin, body1.list[i].main.temp_min);
  }

  for(let i = 0; i < body1.list.length; i++) {
    max = Math.max(max, body1.list[i].main.temp_max);
    min = Math.min(min, body1.list[i].main.temp_min);
  }

  return [body0, dayMin, dayMax, min, max];
}

// [[day progress, day/night], year progress, moon progress]
function getProgress(body) {
  let now = new Date();
  body = body[0];
  // day progress
  let year = now.getFullYear();

  let nowEpoch = Math.floor(now / 1000);

  const sunrise0 = body.sys.sunrise;
  const sunset0 = body.sys.sunset;
  const sunrise1 = body.sys.sunrise + 86400;

  let progress = [[0, 'undefined'], 0, 0]

  // sunrise today/sunset today/midnight today/midnight tomorrow/sunrise tomorrow
  // 06:00, 18:00, 00:00, 24:00, 30:00
  if(nowEpoch > sunrise0 && nowEpoch <= sunset0) { progress[0] = [((nowEpoch - sunrise0) / (sunset0 - sunrise0) * 100).toFixed(2), 'day']; }
	else if(nowEpoch > sunrise1) { progress[0] = [((nowEpoch - sunrise1) / (sunset0 - sunrise1 + 86400) * 100).toFixed(2), 'day']; }	
	else {
		progress[0][0] = nowEpoch > sunrise0
      ? ((nowEpoch - sunset0) / (sunrise0 - sunset0 + 86400) * 100).toFixed(2)
      : ((nowEpoch - sunset0 + 86400) / (sunrise0 - sunset0 + 86400) * 100).toFixed(2);
    progress[0][1] = 'night';
	}

  // year progress
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  progress[1] = ((now - start) / (end - start) * 100).toFixed(5);

  // moon progress
  let prog = Astronomy.MoonPhase(now) / 360 * 100;
  let safeProg = prog;

  if(prog <= 50) { prog *= 2; }
  else {
    prog *= 2;
    prog -= 100;
    prog = 100 - prog;
  }

  progress[2] = `${ parseFloat(safeProg) < 50 ? '+' : '-' }${ prog.toFixed(4) }`;
  
  return progress;
};

// [weekday, date, time]
function getDate() {
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let now = new Date();
  return [
    weekday[now.getDay()], 
    now.toLocaleDateString('en-GB').split('/').reverse().join('-'),
    now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York' })
  ];
}

// [cityName, desc, degC, degF, humidity, windMS, windMPH, windKMH, windDeg]
function getTemperatureAndWind(body) {
  body = body[0];
  return [
    body.name,
    (body.weather[0].description)[0].toUpperCase() + body.weather[0].description.slice(1),
    (body.main.temp - 273.15).toFixed(1), 
    ((body.main.temp * 1.8) - 459.67).toFixed(1),
    (body.main.humidity).toFixed(1),
    (body.wind.speed).toFixed(1),
    (body.wind.speed * 2.23696).toFixed(1),
    (body.wind.speed * 3.6).toFixed(1),
    body.wind.deg
  ];
}

// current, total
function getSession() {
  let s = JSON.parse(localStorage.getItem('session'));
  localStorage.setItem('session', JSON.stringify( { time: s.time + 1 } ));
  let time = s.time + 1;

  let db = JSON.parse(localStorage.getItem('db'));
  let t =  db.time;

  return [formatTime(time * 1000), formatTime(t * 1000)];
}

// suffer
function getSuffer() {
  const birthday = new Date(config.birthday);
  const now = new Date();

  return (Math.floor((now.getTime() - birthday.getTime()) / 1000))
    .toString()
    .replace(/(.)(?=(...)+(?!.))/g, "$1,");
}

// time until next event
function getNextEvent() {
  let seconds = parseInt(getSuffer().replace(/\,/g, ''));

  const significantEvents = [
    [100000000, '100m seconds'],
    [111111111, '111m seconds'],
    [200000000, '200m seconds'],
    [222222222, '222m seconds'],
    [300000000, '300m seconds'],
    [333333333, '333m seconds'],
    [400000000, '400m seconds'],
    [444444444, '444m seconds'],
    [500000000, '500m seconds'],
    [518400000, '6k days'],
    [555555555, '555m seconds'],
    [600000000, '600m seconds'],
    [604800000, '7k days'],
    [666666666, '666m seconds'],
    [691200000, '8k days'],
    [700000000, '700m seconds'],
    [777600000, '9k days'],
    [777777777, '777m seconds'],
    [800000000, '800m seconds'],
    [864000000, '10k days'],
    [888888888, '888m seconds'],
    [900000000, '900m seconds'],
    [950400000, '11k days'],
    [999999999, '999m seconds'],
    [1000000000, '1b seconds'],
    [1036800000, '12k days'],
    [1100000000, '1.1b seconds'],
    [1111111111, '1.111b seconds'],
    [1123200000, '13k days'],
    [1200000000, '1.2b seconds'],
    [1209600000, '14k days'],
    [1234567890, '1.234b seconds'],
    [1296000000, '15k days'],
    [1300000000, '1.3b seconds'],
    [1382400000, '16k days'],
    [1400000000, '1.4b seconds'],
    [1468800000, '17k days'],
    [1500000000, '1.5b seconds'],
    [1555200000, '18k days'],
    [1600000000, '1.7b seconds'],
    [1700000000, '1.7b seconds'],
    [1800000000, '1.8b seconds'],
    [1900000000, '1.9b seconds'],
    [2000000000, '2b seconds'],
    [222222222, '2.222b seconds']
  ];

  let now = new Date();
  for(let i = 10; i < 60; i++) {
    significantEvents.push([ parseInt((now.setFullYear(now.getFullYear() + i) / 1000).toFixed(0)) ])
  }

  significantEvents.sort((a, b) => a[0] - b[0]);

  let i = 0;
  let j = [0, ''];
  let b = true;
  do {
    if(seconds < significantEvents[i][0]) {
      b = false;
      j[0] = formatTime((significantEvents[i][0] - seconds) * 1000)
      j[1] = significantEvents[i][1];
    } else { i += 1 };
  } while(b);

  return `${ j[0] } until ${ j[1] }`;
}

// progress bar
function getProgressProgressBar(progress) {
  let bar = '[ ';
  let day = progress[0][0] / 2;
  let dayNight = progress[0][1];
  let year = progress[1] / 2;
  let moon = Math.abs(Number(progress[2])) / 2;
  let color;

  for(let i = 0.5; i < 50; i++) {
    let d = day > i;
    let y = year > i;
    let m = moon > i;
    
    if(dayNight === 'day') {
      if(d && !y && !m) { color = config.barColor.day.d; }
      else if(!d && y && !m) { color = config.barColor.day.y; }
      else if(!d && !y && m) { color = config.barColor.day.m; }
      else if(d && y && !m) { color = config.barColor.day.dy; }
      else if(d && !y && m) { color = config.barColor.day.dm; }
      else if(!d && y && m) { color = config.barColor.day.ym; }
      else if(d && y && m) { color = config.barColor.day.all; }
      else { color = config.barColor.day.none; }
    }
    else {
      if(d && !y && !m) { color = config.barColor.night.d; }
      else if(!d && y && !m) { color = config.barColor.night.y; }
      else if(!d && !y && m) { color = config.barColor.night.m; }
      else if(d && y && !m) { color = config.barColor.night.dy; }
      else if(d && !y && m) { color = config.barColor.night.dm; }
      else if(!d && y && m) { color = config.barColor.night.ym; }
      else if(d && y && m) { color = config.barColor.night.all; }
      else { color = config.barColor.night.none; }
    }

    bar += `<font color="${color}">█</font>`
  }

  bar += ' ]';
  return bar;
}

// progress bar
function getWeatherProgressBar(body, farenheit = false) {
  let f0 = body[3]; // full low
  let f1 = body[4]; // full high
  let d0 = body[1]; // 24h low
  let d1 = body[2]; // 24h high
  body = body[0]
  let a = body.main.temp; // actual temp
  let r = body.main.feels_like; // realfeel
  
  let interval;

  if(r > d1) { interval = r - d0; }
  else if(r < d0) { interval = d1 - r; }
  else { interval = d1 - d0; }

  const zero = Math.min(d0, f0, r);
  const one = Math.max(d1, f0, r);

  let bar;
  if(!farenheit) {
    bar = `${ (zero - 273.15).toFixed(1) }° [ `;
  } else {
    bar = `${ ((zero - 273.15) * 9 / 5 + 32).toFixed(1) }° [ `;
  }

  d0 = Math.round((d0 - zero) / (one - zero) * 49);
  f0 = Math.round((f0 - zero) / (one - zero) * 49);
  a = Math.round((a - zero) / (one - zero) * 49);
  f1 = Math.round((f1 - zero) / (one - zero) * 49);
  d1 = Math.round((d1 - zero) / (one - zero) * 49);

  r = Math.round((r - zero) / (one - zero) * 49);

  for(let i = 0; i < 50; i++) {
    let str = `<font color="${ config.mainColor[0] }">█</font>`;
    
    if(i === r) {
      if(r === a) { str = `<font color="${ config.mainColor[3] }">█</font>`; }
      else if((r >= d0 && r <= d1) && (r >= f0 && r <= f1)) 
        { str = `<font color="${ config.mainColor[3] }">█</font>`; }
      else if(r >= d0 && r <= d1) { str = `<font color="${ config.mainColor[3] }">▀</font>`; }
      else if(r >= f0 && r <= f1) { str = `<font color="${ config.mainColor[3] }">▄</font>`; }
      else { str = `<font color="${ config.mainColor[3] }">█</font>`; }
    } else {
      if(i === a) { str = `<font color="${ config.mainColor[1] }">█</font>`; }
      else if((i >= d0 && i <= d1) && (i >= f0 && i <= f1))
        { str = `<font color="${ config.mainColor[2] }">█</font>`; }
      else if(i >= d0 && i <= d1) { str = `<font color="${ config.mainColor[2] }">▀</font>`; }
      else if(i >= f0 && i <= f1) { str = `<font color="${ config.mainColor[2] }">▄</font>`; }
    }


    bar += str;
  }

  if(!farenheit) {
    bar += ` ] ${ (one - 273.15).toFixed(1) }°`;
  } else {
    bar += ` ] ${ ((one - 273.15) * 9 / 5 + 32).toFixed(1) }°`;
  }

  return bar;
}

// gaussian, percentile, 0-1 real rand, 1-100 natural rand
function getGaussian() {
  function zpercent(z) {
    if(z < -6.5) { return 0.0; }
    if(z > 6.5) { return 1.0; }

    let factK = 1;
    let sum = 0;
    let term = 1;
    let k = 0;
    let loopStop = Math.exp(-23);

    while(Math.abs(term) > loopStop) {
      term = .3989422804 * Math.pow(-1,k) * Math.pow(z,k) / (2 * k + 1) / Math.pow(2,k) * Math.pow(z,k+1) / factK;
      sum += term;
      k++;
      factK *= k;
    }

    sum += 0.5;
    return (100 * sum).toFixed(1);
  }

  let u = Math.random();
  let v = Math.random();

  let z0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  let z1 = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);
  let z = (z0 + z1) / 2;

  let r = Math.floor(Math.random() * 100);
	let m = Math.random().toFixed(8);

  let x = [
    `${ z > 0 ? '+' : '' }${ z.toFixed(6) } (${ zpercent(z) }th)`, 
    m,
    r
  ];

  return x;
}

// poker hand
function getPoker() {
  // spades 0-12, hearts 13-25, diamonds 26-38, clubs 39-51
  // a = 0, 2 = 1, ... k = 12, etc.
  
  function convertHand(hand) {
    let newHand = [];
    for(let i = 0; i < 5; i++) {
      let h = hand[i];
      let s = '';
      
      if(h >= 39) { s = '♧'; }
      else if(h >= 26) { s = '♢'; }
      else if(h >= 13) { s = '♡'; }
      else { s = '♤'; }

      h = h % 13 + 1;

      if(h === 1) { h = 'A'; }
      else if(h === 11) { h = 'J'; }
      else if(h === 12) { h = 'Q'; }
      else if(h === 13) { h = 'K'; }

      newHand[i] = `${ s }${ h }`;
    }

    return newHand;
  }

  function findMatching(h, exclude = 69) {
    let max = 1;
    let val = null;

    for(let i = 0; i < 5; i++) {
      let h1 = h;
      let v = h[i];
      if(v === exclude) { continue; }

      h1 = h1.filter((x) => x !== v);
      let length = h.length - h1.length;

      if(length > max) {
        max = length;
        val = v;
      }
    }

    return [max, val];
  }

  let cards = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 
    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 
    26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 
    39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
  ];

  // pick 5 cards
  let hand = [];
  for(let i = 0; i < 5; i++) {
    let rand = Math.floor(Math.random() * cards.length);
    hand.push(cards[rand]);
    cards.splice(rand, 1);
  }

  let h = hand.sort((a, b) => a - b);
  let hmod = [];

  for(let i = 0; i < 5; i++) {
    hmod[i] = h[i] % 13;
  }

  hmod = hmod.sort((a, b) => a - b);

  // score
  let score = '';
  let poker = JSON.parse(localStorage.getItem('poker'));

  // royal flush vars
  let rfs = [8, 9, 10, 11, 12];
  let rfh = [21, 22, 23, 24, 25];
  let rfd = [34, 35, 36, 37, 38];
  let rfc = [47, 48, 49, 50, 51];

  let matching = findMatching(hmod);
  let total = 0;

  // royal flush (exact)
  if(
    h.every((e) => rfs.includes(e)) 
    || h.every((e) => rfh.includes(e)) 
    || h.every((e) => rfd.includes(e)) 
    || h.every((e) => rfc.includes(e)) 
  ) { 
    score = 'Royal Flush';
    poker.rf += 1;
    total = poker.rf;
  }

  // straight flush (a[0] + 1 = a[1])
  else if(
    (h[0] + 1 === h[1] && h[1] + 1 === h[2] && h[2] + 1 === h[3] && h[3] + 1 === h[4])
    && (
      h[4] <= 12
      || (h[0] >= 13 && h[4] <= 25)
      || (h[0] >= 26 && h[4] <= 38)
      || (h[0] >= 39)
    )
  ) { 
    score = 'Straight Flush';
    poker.sf += 1;
    total = poker.sf
  }
  
  // 4 of a kind
  else if(matching[0] === 4) { 
    score = '4 of a Kind';
    poker['4k'] += 1;
  }

  // full house + 3 of a kind
  else if(matching[0] === 3) {
    let c = findMatching(hmod, matching[1]);
    if(c[0] === 2) { 
      score = 'Full House';
      poker.fh += 1;
      total = poker.fh;
    }
    else { 
      score = '3 of a Kind';
      poker['3k'] += 1;
      total = poker['3k'];
    }
  }

  // flush
  else if(
    h[4] <= 12
    || (h[0] >= 13 && h[4] <= 25)
    || (h[0] >= 26 && h[4] <= 38)
    || (h[0] >= 39)
  ) { 
    score = 'Flush';
    poker.f += 1;
    total = poker.f;
  }

  // straight
  else if(
    (hmod[1] + 1 === hmod[2] && hmod[2] + 1 === hmod[3] && hmod[3] + 1 === hmod[4])
  ) {
    if(
      hmod[0] + 1 === hmod[1]
      || hmod[0] === 0
    ) {
      score = 'Straight';
      poker.s += 1;
      total = poker.s;
    }
  }

  // 2 pair + pair
  else if(matching[0] === 2) {
    if(findMatching(hmod, matching[1])[0] === 2) { 
      score = '2 Pair';
      poker['2p'] += 1;
      total = poker['2p'];
    }
    else { 
      score = 'Pair';
      poker.p += 1;
      total = poker.p;
    }
  }
  
  // otherwise (high card)
  else { 
    score = 'High Card';
    poker.h += 1;
    total = poker.h
  }

  poker.total += 1;
  localStorage.setItem('poker', JSON.stringify(poker));
  return `[${ `${ convertHand(hand) }`.replaceAll(',', ' ') } / ${
    score
  } / ${ total } (${ (total / poker.total ).toFixed(4) })]`;
}


// -----------------------------------

function formatTime(t) {
  if(t === 0) { return 0 }

  t = Math.floor(t / 1000);
  if(t < 10) { return `0${ t }`; }
  if(t < 60) { return t; }
  if(t < 3600) { return `${ Math.floor(t / 60) }:${ (String(t % 60)).length === 1 ? `0${ t % 60 }` : t % 60 }`; }
  else {
    let a = Math.floor(t / 3600);
    t -= a * 3600;

    let b = Math.floor(t / 60);
    if(b.toString().length === 1) { b = `0${ b }`; }
    t -= b * 60;

    if(t.toString().length === 1) { t = `0${ t }`; }
    return `${ a }:${ b }:${ t }`;
  }
}

function astronomy() {
  // https://github.com/cosinekitty/astronomy/tree/master/source/js
  let observer = new Astronomy.Observer(27.6255, -80.4299, 6);
  let now = new Date();
  let later = new Date(now + 1);

  let obj = [ // 0 is azimuth, 1 is altitude
    'Sun',
    'Moon', 
    'Mercury',
    'Venus',
    'Mars',
    'Jupiter',
    'Saturn',
    'Uranus',
    'Neptune',
    'Pluto'
  ]

  let string = '<h3>'

  for(let planet of obj) {
    let equofdate = Astronomy.Equator(planet, now, observer, true, true);
    let hor = Astronomy.Horizon(now, observer, equofdate.ra, equofdate.dec, 'normal');

    let nextequofdate = Astronomy.Equator(planet, later, observer, true, true);
    let nexthor = Astronomy.Horizon(later, observer, equofdate.ra, equofdate.dec, 'normal')

    string += `${ planet.substring(0, 3) } - ${
      ((hor.altitude >= 10) || (hor.altitude >= 0 && planet == 'Sun'))
        ? `<font color="${ nexthor.azimuth > hor.azimuth ? config.mainColor[3] : config.mainColor[2] }">${ Math.round(hor.azimuth) }</font>
           <font color="${ nexthor.altitude > hor.altitude ? config.mainColor[3] : config.mainColor[2] }">${ Math.round(hor.altitude * 100) / 100 }</font>`
        : `<font size=3.5pt color="${ config.barColor.day.dm }">${ formatTime(
          Astronomy.SearchRiseSet(planet, observer, 1, now, 7, 0).date - now
        ) }</font>`
    }<br>`
  }

  string += '</h3>'
  document.getElementById('astronomymessage').innerHTML = string;
}
