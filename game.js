const game = {"mode": "dino", "items": [["🥭", "Mango", "🥭"], ["🍉", "Watermelon", "🍉"], ["🍎", "Apple", "🍎"], ["🍌", "Banana", "🍌"]]};
const byId = id => document.getElementById(id);
const board = byId('board');
const mascot = byId('mascot');
const feedback = byId('status');
const soundButton = byId('sound');
const freePlay = ['music','ocean'].includes(game.mode);
const duration = 0.28;
let audio;
let sound = false;
let round = [];
let discoveries = new Set();
let step = 0;

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const other = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[other]] = [copy[other], copy[i]];
  }
  return copy;
}
function animate(element, effect) {
  element.classList.remove('jump','party','pop');
  void element.offsetWidth;
  element.classList.add(effect);
}
function speak(text) {
  if (!sound || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'en';
  speech.rate = .85;
  window.speechSynthesis.speak(speech);
}
function note(index) {
  if (!sound || !audio || audio.state !== 'running') return;
  const tones = [196,523.25,392,659.25];
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const start = audio.currentTime;
  oscillator.type = ['triangle','sine','triangle','sine'][index % 4];
  oscillator.frequency.setValueAtTime(tones[index % 4],start);
  gain.gain.setValueAtTime(.11,start);
  gain.gain.exponentialRampToValueAtTime(.001,start + duration);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}
function announce(text, icon = '') {
  byId('instruction').textContent = text;
  byId('target').textContent = icon;
}
function add(icon) {
  const badge = document.createElement('span');
  badge.textContent = icon;
  byId('collection').append(badge);
  animate(badge,'pop');
}
function pad(item, choose, icon = item[0]) {
  const button = document.createElement('button');
  button.className = 'pad';
  const picture = document.createElement('span');
  picture.className = 'icon';
  picture.setAttribute('aria-hidden','true');
  picture.textContent = icon;
  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = item[1];
  button.append(picture,label);
  button.onclick = () => choose(button,picture);
  return button;
}
function finish(message) {
  announce(message,'🎉');
  feedback.textContent = 'Round complete!';
  animate(mascot,'party');
  speak(message);
}
function matching(focus = false) {
  const target = round[step];
  const prefix = game.mode === 'garden' ? 'Find' : game.mode === 'train' ? 'Match' : 'Feed Dino';
  const prompt = prefix + ' ' + target[1].toLowerCase();
  announce(prompt,target[0]);
  speak(prompt);
  const options = shuffle([target,...shuffle(game.items.filter(item=>item!==target)).slice(0,2)]);
  const buttons = options.map((item,index)=>pad(item,button=>{
    if (item !== target) {
      animate(button,'pop');
      buttons[options.indexOf(target)].classList.add('hint');
      feedback.textContent = 'Try the matching picture.';
      return;
    }
    note(index);
    add(item[2]);
    animate(mascot,'jump');
    step++;
    if (step === round.length) {
      board.replaceChildren();
      finish(game.mode === 'garden' ? 'Your garden is blooming!' : game.mode === 'train' ? 'All aboard!' : 'Dino says yum!');
      byId('again').focus();
    } else {
      feedback.textContent = 'Nice match!';
      matching(true);
    }
  }));
  board.replaceChildren(...buttons);
  if (focus) buttons[0].focus();
}
function explore() {
  const music = game.mode === 'music';
  const animals = shuffle(game.items.map(item=>item[2]));
  announce(music ? 'Tap any pad to make music' : 'Who is hiding here?');
  board.replaceChildren(...shuffle(game.items).map((item,index)=>pad(item,(button,picture)=>{
    note(game.items.indexOf(item));
    animate(button,'pop');
    animate(mascot,'jump');
    if (discoveries.has(item)) return;
    discoveries.add(item);
    add(music ? item[2] : animals[index]);
    if (!music) {
      picture.textContent = animals[index];
      const names = {'🦀':'Crab','🐙':'Octopus','🐠':'Fish','🐢':'Turtle'};
      button.querySelector('.label').textContent = names[animals[index]];
    }
    if (discoveries.size === game.items.length) finish(music ? 'You made a whole band!' : 'You found all the ocean friends!');
    else feedback.textContent = discoveries.size + ' of ' + game.items.length + (music ? ' sounds played' : ' friends found');
  },music ? item[2] : item[0])));
}
function restart() {
  feedback.textContent = '';
  byId('collection').replaceChildren();
  discoveries = new Set();
  step = 0;
  round = shuffle(game.items).slice(0,3);
  board.classList.toggle('three',!freePlay);
  if (freePlay) explore();
  else matching();
}
soundButton.onclick = async () => {
  sound = !sound;
  soundButton.setAttribute('aria-pressed',String(sound));
  soundButton.textContent = sound ? '🔊 Sound' : '🔇 Sound';
  if (!sound) {
    window.speechSynthesis?.cancel();
    return;
  }
  speak(byId('instruction').textContent);
  try {
    audio ??= new AudioContext();
    await audio.resume();
  } catch {
    audio = undefined;
  }
};
byId('again').onclick = restart;
restart();
