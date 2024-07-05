// don't get intimidated
// this seems like a lot, but it's really easy to understand
// if you scroll down, you will see an entire guide on what to do/
// how to format everything in here

const config = {
  // name : string, name in the top
  name: 'Pants',

  /*
  birthday : number, birthday as a number
    type in your birthday
    https://www.epochconverter.com/
    do NOT use the timestamp in milliseconds
  */
  birthday: 1040324400000,

  /*
  city : string
    use this to find your city id
    https://openweathermap.org/find
    look up your city, click on it, the number at the end
    of the url is your city id, paste it in here
  */
  city: '4176409',

  /*
  locale : string
     https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    find something closest to you
  */
  locale: 'America/New_York',

  // links : [object], list of links
  // format should be easy to follow
  links: [
    {
      title: "reddit",
      links: [
        {
          label: "r/unixporn",
          value: "https://www.reddit.com/r/unixporn/"
        },
        {
          label: "r/startpages",
          value: "https://www.reddit.com/r/startpages/"
        },
        {
          label: "r/desktops",
          value: "https://www.reddit.com/r/desktops/"
        },
        {
          label: "r/hardimages",
          value: "https://www.reddit.com/r/hardimages/"
        },
        {
          label: "r/firefoxcss",
          value: "https://www.reddit.com/r/firefoxcss/"
        },
        {
          label: "r/mathmemes",
          value: "https://www.reddit.com/r/mathmemes/"
        },
      ]
    },
    {
      title: "email",
      links: [
        {
          label: "0",
          value: "https://mail.google.com/mail/u/0/#inbox"
        },
        {
          label: "1",
          value: "https://mail.google.com/mail/u/1/#inbox"
        },
        {
          label: "2",
          value: "https://mail.google.com/mail/u/2/#inbox"
        },
        {
          label: "3",
          value: "https://mail.google.com/mail/u/3/#inbox"
        },
        {
          label: "4",
          value: "https://mail.google.com/mail/u/4/#inbox"
        }
      ]
    },
    {
      title: "dev",
      links: [
        {
          label: "github",
          value: "https://www.github.com/"
        },
        {
          label: "hacker-news",
          value: "https://news.ycombinator.com/"
        },
        {
          label: "memex",
          value: "./memex/index.html"
        },
        {
          label: "fake-pinterest",
          value: "./fake-pinterest/index.html"
        },
        {
          label: "help",
          value: "./help/help.html"
        }
      ]
    },
    {
      title: "media",
      links: [
        {
          label: "youtube",
          value: "https://www.youtube.com/"
        },
        {
          label: "123movies",
          value: "https://123-movies.click/"
        },
        {
          label: "hulu",
          value: "https://www.hulu.com/hub/home"
        },
        {
          label: "anime",
          value: "https://animeheaven.ru/"
        }
      ]
    },
    {
      title: "depression",
      links: [
        {
          label: "wikipedia",
          value: "https://www.wikipedia.org/"
        },
        {
          label: "capitalism",
          value: "https://www.amazon.com/"
        },
        {
          label: "corn-dog",
          value: "http://corndog.io/"
        },
        {
          label: "midnight",
          value: "https://thebulletin.org/doomsday-clock/current-time/"
        }
      ]
    }
  ],

  /*
  mainColor : [string], list of colors
    first color is background
    second color is default
    third color is first accent
    fourth color is second accent
  */
  mainColor: ['#131617', '#E6E6E6', '#EF94C6', '#A4EFD6'],

  /*
  barColor : { string: string }, list of colors for progress bar
  daytime
    none of day/year/moon
    day only
    year only
    moon only
    day and year
    day and moon
    year and moon
    all of day/year/moon
  night
    none of day/year/moon
    day only
    year only
    moon only
    day and year
    day and moon
    year and moon
    all of day/year/moon
  */
  barColor: {
    day: {
      none: '#0a0c0c',
      d: '#e35151',
      y: '#50b68b',
      m: '#fdea9f',
      dy: '#ff764f',
      dm: '#f7c48c',
      ym: '#8ac792',
      all: '#e6e6e6'
    },
    night: {
      none: '#0a0c0c',
      d: '#202547',
      y: '#50b68b',
      m: '#fdea9f',
      dy: '#2c4958',
      dm: '#0b7eae',
      ym: '#8ac792',
      all: '#e6e6e6'
    }
  },

  /*
  topFormat : string, format for the top
    USE <br> AT THE END OF LINES
      OTHERWISE THERE WILL BE NO NEW LINES
    if there's a variable that you want to use, but it's reserved,
      put \n in front of it.
    you can put a comma or percentage sign at the end of variables
      or surround them in parenthesees.
    list of acceptable variables:

      dayProgressNum: The progress of the day/night cycle
      dayProgressDay: Whether it is day/night
      yearProgress: The progress of the year
      moonProgress: The lunar phase progress

      dow: Day of the week
      date: yyyy-mm-dd (year-month-day)
      time: HH:mm:ss (24 hour time)

      cityName: Where do you live? (for weather purposes)
      weatherDescription: Description of the weather
      degC: Degrees in Celsius
      degF: Degrees in Farenheit
      humidity: Humidity
      windMS: Wind, m/s
      windMPH: Wind, mph
      windKMH: Wind, kmh
      windDeg: Wind direction
      
      currentSession: How long the startpage has been opened for right now
      totalSession: How long the startpage has been opened for in total

      opened: Times that the startpage has been opened
      suffer: How many seconds have you been alive?
      event: Cool events
      progressProgressBar: Day/Year/Moon progress bar
      weatherProgressBar: Weather bar, not a progress bar
      weatherProgressBarFarenheit: Weather bar, but in farenheit
  */
  topFormat: `Today is dow, date at time  <br>
   weatherDescription, degC °C / degF °F at humidity% \nhumidity. <br>
   windMS m/s / windMPH mph at windDeg °. <br>
   dayProgressNum  dayProgressDay ~  yearProgress ~ moonProgress <br>
   currentSession ~ totalSession ~ opened ~ suffer ~ event <br>
   progressProgressBar <br>
   weatherProgressBar `,

  /*
  bottomFormat : string, format for the bottom
    list of acceptable variables:
    cah: Cards Against Humanity Card

    gaussian: Random number based on a gaussian distribution, mean = 0; stddev = 1
    rand0_1: Random number 0 to 1
    rand1_100: Random whole number 1 to 100
    poker: 5 card poker hand, with statistics of how you do.

    Stuff at the bottom is not usable with the top side, and vice versa.
  */
  bottomFormat: `cah  <br>
  [ gaussian ~ rand0_1 ~ rand1_100 ] <br>
  poker`,

  // bottomBarNames : [string], list of things for the bottom search bar
  bottomBarNames: [
    'You are not immune to propaganda.',
    'DOG SEARCH',
    '吃我的屁股',
    '[insert funny message here]',
    '1-800-EAT-SHIT',
    'I shit my pants!',
    '𝓳𝓪𝓼𝓸𝓷 𝓭𝓮𝓻𝓾𝓵𝓸',
    'according to all known laws of aviation, there is no way a bee should be able to fly.',
    'It is better to cum in the sink, than to sink in the cum.',
    'If you don\'t agree with me, you get the pinky guillotine!',
    'The zoo called, and they\'re wondering how they got out of your cage.',
    'わからない、日本語で何か言ってる',
    '𝘧𝘶𝘤𝘬𝘪𝘯𝘨 𝘥𝘪𝘦𝘴 𝘰𝘧 𝘤𝘳𝘪𝘯𝘨𝘦',
    'HAIL SATAN, WORSHIP DOOM',
    'الضوء سريع - ألبرت أينشتاين',
    'As seen on TV!',
    'More than 500 sold!',
    'One of a kind!',
    'Keyboard compatible!',
    'Not on steam!',
    '90% bug free!',
    '12 herbs and spices!',
    'Legal in Finland!',
    'Euclidian 3D Space Enjoyer',
    'Thousands of colors!',
    'Ultimate edition!',
    'sqrt(-1) love you!',
    'umop-apisdn!',
    'Finger-licking Good!',
    'Matt Damon!',
    'Autonomous!',
    'Don\'t look directly at the bugs!',
    'Has an ending!',
    '日本ハロー！',
    '한국 안녕하세요!',
    '你好中国！',
    'What\'s up, Doc?',
    'Any computer is a laptop if you\'re brave enough!',
    'noot noot',
    'Rule #1: it\'s never my fault',
    'How do you spell gorjesus?',
    'Déjà vu',
    'Déjà vu',
    'Déjà vu',
    'Plant a tree!',
    'Support local businesses!',
    'May contain traces of citrus!',
    'Creeper, Aw man...',
    '<3',
    'alt + f4',
    '1984',
    'Breadstick.',
    'Thank you for coming to my ted talk.',
    'Assume something\'s dangerous until proven safe. Then eat it.',
    'Now in Technicolor!',
    'I\'ve come to make an announcement...',
    'Two bros, sitting in a hot tub, right next to each other because they\'re gay!',
    'Sir, this is a wendys.',
    'The FitnessGram Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues',
    'We\'ve been trying to reach you about your car\'s extended warranty.',
    'The sun is a deadly laser.',
    'https://youtube.com/watch?v=dQw4w9WgXcQ',
    'Buy one now at double price and get the next one free!',
    'None of these are legal advice',
    'All of these are legal advice',
    'It says \'Gullible\' on the ceiling.',
    'No among us references.',
    'Unfortunately free will is a lie.',
    'You are the best.',
    'He then proceeded to pull a comically large spoon.',
    'He then proceeded to turn himself into a pickle.',
    'Fatherless',
    'Can you two stop having relationship issues while I\'m on the phone with my dentist?',
    'I should call her...',
    'Rebecca please it\'s been 8 months let me see the kids again.',
    'Have you considered chess?',
    '1. e4 e5  2. Ke2',
    '1. f3 e5  2. g4 Qh4#',
    'If she can say \'lol\' without laughing, she can say \'I love you\' without meaning it.',
    '<i>Go ahead, piss.</i>',
    'Can you lick the science?',
    `${ new Date().getDay() !== 2 ? 'It\'s Tuesday!' : 'Time is a social construct, don\'t believe it.' }`,
    'I could give you a penny for all the thoughts you had and I\'d still get change back.',
    'Sharp as a marble, that one.',
    '<strong>UNEXPECTED ITEM IN BAGGING AREA</strong>',
    'Nobody said you couldn\'t join us, Arthur...', 
    'If nobody from the future comes to stop you, than how bad of a decision could it be?'
  ],
}
