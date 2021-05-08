var langs =
[['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']
                    ]];

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 0;
updateCountry();
select_dialect.selectedIndex = 5;
showInfo('info_start');

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
    start_icon.style.color = 'red';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_icon.style.color = 'white';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_icon.style.color = 'white';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_icon.style.color = 'white';
    showInfo('info_start');
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        // send to be analysed here
        const final_transcript = event.results[i][0].transcript;
        let p = document.createElement("p")
        p.innerText = final_transcript
        final_div.append(p);
        postToAPI(final_transcript).then(images => {
          console.log('hello: ', images);
          if (images) {
            for (let i = 0; i < images.length; i++) {
              // create img element
              const img = document.createElement("img");
              img.classList.add("img-result");
              img.src = images[i].src;
              // create img caption
              const imgCaption = document.createElement("div");
              imgCaption.classList.add("img-caption");
              imgCaption.innerHTML = images[i].caption;
              // create div element and put img & caption in div
              const imgDiv = document.createElement("div");
              imgDiv.classList.add("img-result-div");
              imgDiv.appendChild(img);
              imgDiv.appendChild(imgCaption);
              // get the container and append to it
              const imgSection = document.querySelector(".img-result-section");
              imgSection.appendChild(imgDiv);
            }
          }
        });
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    interim_span.innerHTML = linebreak(interim_transcript);
  };
}

function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  interim_span.innerHTML = '';
  start_icon.style.color = 'yellow';
  showInfo('info_allow');
  start_timestamp = event.timeStamp;
}

function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}


/**
 * Post to API
 */
function postToAPI(text) {
    let img1 = '';
    let img2 = '';
    const requestOptions = {
        method: 'POST',
        body: text
    };
    return new Promise((resolve, reject) => {
      fetch('/api', requestOptions)
        .then(res => res.json())
        .then(async (res) => {
              const promises = [];
              console.log("res: ", res);
              if (res.imageWords) {
                const images = [];
                for (let i = 0; i < res.imageWords.length; i++) {
                  console.log(`url to search: https://www.googleapis.com/customsearch/v1?key=${res.apiKey}&cx=${res.cx}&q=${res.imageWords[i]}&searchType=image`);
                  const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${res.apiKey}&cx=${res.cx}&q=${res.imageWords[i]}&num=2&searchType=image`)
                  const results = await response.json();
                  console.log("returned from search: ", results);
                  img1 = {
                    src: results.items[0].link,
                    caption: res.imageWords[i]
                  };
                  img2 = {
                    src: results.items[1].link,
                    caption: res.imageWords[i]
                  };
                  images.push(img1, img2);
                }
                resolve(images);
              } else {
                reject();
              }
          },
          (error) => {
              console.log(error);
          }
        );
    });
    
}