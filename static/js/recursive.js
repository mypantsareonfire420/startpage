// makes words capital
function capitalize(words) {
  word = words.split(' ');
  for(let i = 0; i < word.length; i++) {
		word[i] = word[i][0].toUpperCase() + word[i].substring(1);
  }
  return word.join(' ');
}

async function getWeather() {
  const url = 'https://api.openweathermap.org/data/2.5/weather?id=4176409&appid=2d33137dd0ae28b599bdcedc827a9560';
  const response = await fetch(url);
  const body = await response.json();

  return body;
}

async function getHighAndLowWeather() {
  const url = 'https://api.openweathermap.org/data/2.5/forecast?id=4176409&appid=2d33137dd0ae28b599bdcedc827a9560';
  const response = await fetch(url);
  const body = await response.json();

  let dayMin = 1000;
  let dayMax = -1000;
  let min = 1000;
  let max = -1000;
  for(let i = 0; i < 8; i++) {
    dayMax = Math.max(dayMax, body.list[i].main.temp_max);
    dayMin = Math.min(dayMin, body.list[i].main.temp_min);
  }

  for(let i = 0; i < body.list.length; i++) {
    max = Math.max(max, body.list[i].main.temp_max);
    min = Math.min(min, body.list[i].main.temp_min);
  }

  return [dayMin, dayMax, min, max];
}

// format's todays date in a very pretty way
function getDateToday() {
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  return `Today is ${ weekday[now.getDay()] }, ${ 
	now.toLocaleDateString('en-GB').split('/').reverse().join('-') } at ${ 
	now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York' }) }`;
}

// this fucking thing has caused me so much pain
// pls don't touch
function dayYearProgress(body) {
	// get dates
	const now = new Date();
	const year = now.getFullYear(); 
	const month = now.getMonth() + 1;
	const day = now.getDate();
	
	const nowEpoch = Math.floor(Date.now() / 1000);
	const offset = now.getTimezoneOffset() * 60;
	
	// sunrise today/sunset today/midnight today/midnight tomorrow/sunrise tomorrow
  // 06:00, 18:00, 00:00, 24:00, 30:00
	const sunrise0 = body.sys.sunrise;
  const sunset0 = body.sys.sunset;
  const midnight0 = new Date(year, month - 1, day) / 1000;
  const midnight1 = new Date(year, month - 1, day) / 1000 + 86400;
	const sunrise1 = body.sys.sunrise + 86400;
  let progress = [0, undefined];
	
	// if day (06:00 - 18:00), else if tomorrow (post 30:00), else dark (18:00 - 30:00)
	if(nowEpoch > sunrise0 && nowEpoch <= sunset0) { progress = [((nowEpoch - sunrise0) / (sunset0 - sunrise0) * 100).toFixed(2), 'day']; } 
	else if(nowEpoch > sunrise1) { progress = [((nowEpoch - sunrise1) / (sunset0 - sunrise1 + 86400) * 100).toFixed(2), 'day']; }	
	else {
		progress[0] = nowEpoch > sunrise0
      ? ((nowEpoch - sunset0) / (sunrise0 - sunset0 + 86400) * 100).toFixed(2)
      : ((nowEpoch - sunset0 + 86400) / (sunrise0 - sunset0 + 86400) * 100).toFixed(2);
    progress[1] = 'night';
	}
	
	// year progress
	const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const yearProgress = ((now - start) / (end - start) * 100).toFixed(5);
	
	return [progress[0], progress[1], yearProgress];
}

// progress of moon phase
function moonPhaseProgress() {
  // does what it says on the tin
  function getJulianDate() {
    let d = new Date();
    let t = d.getTime();
    let offset = d.getTimezoneOffset();

    return (t / 86400000) - (offset / 1440) + 2440587.5;
  }

  const lunarMonth = 29.530588;

  // things for lunar age
  function normalize(v) {
    v -= Math.floor(v);
    if(v < 0) { v += 1 }
    return v;
  }

	const getLunarAgePercent = () => normalize((getJulianDate() - 2451550.1) / lunarMonth);
  const getLunarAge = (d) => lunarMonth * getLunarAgePercent(d);
  
  let age = getLunarAge(new Date());
  let progress = (100 * (age / 29.530588)).toFixed(6);
  let safeProgress = progress;

  if(progress <= 50) { progress *= 2; }
  else {
    progress *= 2;
    progress -= 100;
    progress = 100 - progress;
  }

  return [ progress.toFixed(4), parseFloat(safeProgress) < 50 ? '+' : '-'];
}

// enter your birthday
function suffer() {
  const birthday = new Date('December 19, 2002 19:00:00 UTC');
  const now = new Date();
	
  let seconds = Math.floor((now.getTime() - birthday.getTime()) / 1000);
  return seconds;
}

function currentSession() {
	// localStorage, session.time = 0
	const sesh = JSON.parse(localStorage.getItem('session'));
	localStorage.setItem('session', JSON.stringify( { time: sesh.time + 1 } ))
	
	const time = sesh.time + 1;
	const a = Math.floor(time / 3600);
	let b = Math.floor((time - (a * 3600)) / 60);
	let c = (time - (a * 3600) - (b * 60));
	if(c < 10 && b > 0) { c = `0${c}` }
	if(b < 10 && a > 0) { b = `0${ b }` }
	
	let format = `${ a > 0 ? `${a}:` : '' }${ a > 0 || b > 0 ? `${b}:` : '' }${c}`;
	return format;
}

function totalSession() {
	const db = JSON.parse(localStorage.getItem('db'));
	const time = db.time;
	
	const a = Math.floor(time / 3600);
	let b = Math.floor((time - (a * 3600)) / 60);
	let c = (time - (a * 3600) - (b * 60));
	if(c < 10) { c = `0${ c }` }
  if(b < 10 && a > 0) { b = `0${ b }` }
	
	let format = `${ a > 0 ? `${a}:` : '' }${ a > 0 || b > 0 ? `${b}:` : '' }${c}`;
	return format;
}

// progress bar
function progressBar(dayProgress, moonProgress) {
  /*
    * basic principle is
    * progress bar from 0 to 100%
    * day progress will color it red
    * year progress will color it green
    * moon progress will color it blue
    * combine those values to be a hex code
  */

  let bar = '[ ';
  let day = dayProgress[0] / 2;
  let dayNight = dayProgress[1];
  let year = dayProgress[2] / 2;
  let moon = moonProgress[0] / 2;

  for(let i = 0.5; i < 50; i++) {
    let d = day > i;
    let y = year > i;
    let m = moon > i;

    if(!d && !y && !m) { color = '#0a0c0c'; }
    else if(d && y && m) { color = '#e6e6e6'; }
    else if(dayNight === 'day') {
      if(d && !y && !m) { color = '#e35151'; }
      else if(!d && y && !m) { color = '#50b68b'; }
      else if(!d && !y && m) { color = '#fdea9f'; }
      else if(d && y && !m) { color = '#ff764f'; }
      else if(d && !y && m) { color = '#f7c48c'; }
      else if(!d && y && m) { color = '#8ac792'; }
    }
    else {
      if(d && !y && !m) { color = '#202547'; }
      else if(!d && y && !m) { color = '#50b68b'; }
      else if(!d && !y && m) { color = '#fdea9f'; }
      else if(d && y && !m) { color = '#2c4958'; }
      else if(d && !y && m) { color = '#0b7eae'; }
      else if(!d && y && m) { color = '#8ac792'; }
    }

    bar += `<font color="${color}">█</font>`
  }

  bar += ' ]';
  return bar;
}

function weatherProgressBar(body, highAndLow) {
  let f0 = highAndLow[2]; // full low
  let f1 = highAndLow[3]; // full high
  let d0 = highAndLow[0]; // 24h low
  let d1 = highAndLow[1]; // 24h high
  let a = body.main.temp; // actual temp
  let r = body.main.feels_like; // realfeel

  let interval;

  if(r > d1) { interval = r - d0; }
  else if(r < d0) { interval = d1 - r; }
  else { interval = d1 - d0; }

  const interval50 = interval / 40;
  const zero = Math.min(d0, f0, r);
  const one = Math.max(d1, f0, r);
  const rIsOne = r === one;

  let bar = `${ (zero - 273.15).toFixed(1) }° [ `;

  d0 = Math.round((d0 - zero) / (one - zero) * 49);
  f0 = Math.round((f0 - zero) / (one - zero) * 49);
  a = Math.round((a - zero) / (one - zero) * 49);
  f1 = Math.round((f1 - zero) / (one - zero) * 49);
  d1 = Math.round((d1 - zero) / (one - zero) * 49);

  r = Math.round((r - zero) / (one - zero) * 49);

  for(let i = 0; i < 50; i++) {
    let str = '<font color="#131617">█</font>';
    
    if(i === r) {
      if(r === a) { str = '<font color="#efb1a4">█</font>'; }
      else if((r >= d0 && r <= d1) && (r >= f0 && r <= f1)) 
        { str = '<font color="#a4efd6">█</font>'; }
      else if(r >= d0 && r <= d1) { str = '<font color="#a4efd6">▀</font>'; }
      else if(r >= f0 && r <= f1) { str = '<font color="#a4efd6">▄</font>'; }
      else { str = '<font color="a4efd6">█</font>'; }
    } else {
      if(i === a) { str = '<font color="#e6e6e6">█</font>'; }
      else if((i >= d0 && i <= d1) && (i >= f0 && i <= f1)) 
        { str = '<font color="#c37aa2">█</font>'; }
      else if(i >= d0 && i <= d1) { str = '<font color="#c37aa2">▀</font>'; }
      else if(i >= f0 && i <= f1) { str = '<font color="#c37aa2">▄</font>'; }
    }


    bar += str;
  }

  bar += ` ] ${ (one - 273.15).toFixed(1) }°`;

  return bar;
}

function timeUntilThing() {
	const seconds = suffer();

	const significantEvents = [
		[662688000, '21 years old'], 
		[666666666, '666m seconds'], 
		[669978000, '4y covid'],
		[675421200, '3y graduation'],
		[687690000, '4y hospital release'],
		[691200000, '8k days'],
		[694310400, '22 years old'], 
		[700000000, '700m seconds'], 
		[701514000, '5y covid'],
		[706957200, '4y graduation'],
		[719226000, '5y hospital release'],
		[720000000, '200k hours'], 
		[725846400, '23 years old'], 
		[733050000, '6y covid'],
		[738493200, '5y graduation'],
		[750762000, '6y hospital release'],
		[757382400, '24 years old'], 
		[764589600, '7y covid'],
		[770029200, '6y graduation'],
		[777600000, '9k days'],
		[777777777, '777m seconds'], 
		[782298000, '7y hospital release'],
		[788918400, '25 years old'], 
		[792000000, '220k hours'], 
		[796208400, '8y covid'],
		[800000000, '800m seconds'], 
		[801651600, '7y graduation'],
		[813920400, '8y hospital release'],
		[820540800, '26 years old'], 
		[827744400, '9y covid'],
		[833187600, '8y graduation'],
		[845456400, '9y hospital release'],
		[852076800, '27 years old'], 
		[859280400, '10y covid'],
		[864000000, '240k hours/10k days'], 
		[864723600, '9y graduation'],
		[876992400, '10y hospital release'],
		[883612800, '28 years old'], 
		[888888888, '888m seconds'],
		[896259600, '10y graduation']		
		[900000000, '900m seconds'], 
		[915148800, '29 years old'], 
		[936000000, '260k hours'], 
		[946771200, '30 years old'], 
		[950400000, '11k days'],
		[1000000000, '1b seconds'], 
		[1008000000, '280k hours'], 
		[1036800000, '12k days'],
		[1080000000, '300k hours'], 
		[1100000000, '1.1b seconds'], 
		[1111111111, '1.111b seconds'], 
		[1123200000, '13k days'],
		[1200000000, '1.2b seconds'], 
	];
	
	let i = 0;
	let j = [0, ''];
	let brk = true;
	do {
		if(seconds < significantEvents[i][0]) {
			brk = false;
			j[0] = significantEvents[i][0] - seconds;
			
			let a = Math.floor(j[0] / 3600);
			let b = Math.floor((j[0] - (a * 3600)) / 60);
			let c = (j[0] - (a * 3600) - (b * 60));
			if(c < 10 && b > 0) { c = `0${c}` }
      if(b < 10 && a > 0) { b = `0${ b }` }

			let format = `${ a > 0 ? `${a}:` : '' }${ a > 0 || b > 0 ? `${b}:` : '' }${c}`;
			j[0] = format;
			j[1] = significantEvents[i][1];
		} else {
			i += 1;
		}
	} while(brk);
	
	// loop through all significant events
	// find the first one that's less than suffer()
	// do the countdown with that, and break through the loop
	
	return `${ j[0] } until ${ j[1] }`;
}
