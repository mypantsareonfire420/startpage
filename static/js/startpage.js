const http = new XMLHttpRequest();
const url = 'https://api.openweathermap.org/data/2.5/weather?id=4176409&appid=2d33137dd0ae28b599bdcedc827a9560';
http.open('GET', url);
http.send();

// instead of making two separate clocks of 1:1s and 1:600s,
// make the 1:1s clock INSIDE the 1:600s clock

http.onload = async(e) => {
  let db = JSON.parse(localStorage.getItem('db'));
	localStorage.setItem('db', JSON.stringify( { opened: db.opened + 1, time: db.time } ));
	db = JSON.parse(localStorage.getItem('db'));
	
	localStorage.setItem('session', JSON.stringify( { time: 0 }) )

  recursion600();
  once();
}

async function recursion600() {
  let body = await getWeather();
  let highAndLow = await getHighAndLowWeather();

  for(let i = 0; i < 600; i++) {
    await new Promise((res1) => setTimeout(res1, 1000));
    updateMessage(body, highAndLow);

    let db = JSON.parse(localStorage.getItem('db'));
    localStorage.setItem('db', JSON.stringify( { opened: db.opened, time: db.time + 1 } ));
    db = JSON.parse(localStorage.getItem('db'));
  }

  recursion600();
}

function updateMessage(body, highAndLow) {
  let progress = dayYearProgress(body);
  let moon = moonPhaseProgress();
	let db = JSON.parse(localStorage.getItem('db'));

  const string = `<h3>
  ${ getDateToday() }<br>
  ${ capitalize(body.weather[0].description) }, 
      ${ (body.main.temp - 273.15).toFixed(0) }°C /
      ${ ((body.main.temp - 273.15) * 9/5 + 32).toFixed(0) }°F
      at ${body.main.humidity}%.<br>
  ${ body.wind.speed.toFixed(1) } m/s
      (${ (body.wind.speed * 2.236936).toFixed(1) } mph)
      at ${ body.wind.deg }°.<br>
  ${ progress[0] }% ${ progress[1] }, ${ progress[2] }%, ${ moon[0] }${ moon[1] }<br>
	${ currentSession() } ~ ${ totalSession() } ~ ${ db.opened } ~ ${ suffer().toString().replace(/(.)(?=(...)+(?!.))/g, "$1,") } ~ ${ timeUntilThing() } <br>
  ${ progressBar(progress, moon) }<br>
  ${ weatherProgressBar(body, highAndLow) }<br> 
  </h3>`;

  document.getElementById('startmessage').innerHTML = string;
}

function once() { 
  let now = new Date();
  let strng = '';

  if((
    (now.getFullYear() * 297) + ((now.getMonth() + 1) * 22)	* (now.getDate() * 887 + 2)
  ) % 87 === 1) {
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
    // roll a 20 for 20, gaussian distribution, random poker hand
    let strng = `<h3>
    ${ getCardsAgainstHumanity() }<br>
    ${ gaussian() }<br>
    ${ poker() }
    </h3>`;
	
		document.getElementById('bottommessage').innerHTML = strng;
  }

  // console.log(getCardsAgainstHumanity());

	// document.getElementById('bottommessage').innerHTML = strng;
	// ^^ this ^^ doesn't work when it's out of the if statement
}

