
// pick from a random distribution
function gaussian() {
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

  return `[${ z > 0 ? '+' : '' }${ z.toFixed(6) } (${ zpercent(z) }th) ~ ${ m } ~ ${ r }]`;
}

function poker() {
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
