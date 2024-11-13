"use strict;"

const FREQUENCY = 440;

let note_context;
let note_node;
let gain_node;
let audioContextInitialized = false;

function initialiseAudioContext() {
  note_context = new AudioContext();
  note_node = note_context.createOscillator();
  gain_node = note_context.createGain();
  note_node.frequency.value = FREQUENCY.toFixed(2);
  gain_node.gain.value = 0;
  note_node.connect(gain_node);
  gain_node.connect(note_context.destination);
  note_node.start();
  audioContextInitialized = true;
}

function startNotePlaying() {
  // Pass a start time of 0 so it starts ramping up immediately.
  gain_node.gain.setTargetAtTime(0.1, 0, 0.001)
}

function stopNotePlaying() {
  // Pass a start time of 0 so it starts ramping down immediately.
  gain_node.gain.setTargetAtTime(0, 0, 0.001)
}

// Times in milliseconds; note that Morse code dash time is 3 * dot time
var DOT_TIME = 60;
var DASH_TIME = DOT_TIME * 3;
var SYMBOL_BREAK = DOT_TIME;
var LETTER_BREAK = DOT_TIME * 3;
var WORD_BREAK = DOT_TIME * 7;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function playDash() {
  startNotePlaying();
  await sleep(DASH_TIME);
  stopNotePlaying();
}

async function playDot() {
  startNotePlaying();
  await sleep(DOT_TIME);
  stopNotePlaying();
}

/**
 * letter is something like '---'
 */
async function playLetter(letter) {
  if (!audioContextInitialized) {
    initialiseAudioContext();
  }
  for (let i = 0; i < letter.length; i++) {
    if (letter[i] == '-') {
      await playDash();
    } else if (letter[i] == '.') {
      await playDot();
    }
    await sleep(SYMBOL_BREAK);
  }
}

let playIdent = false;

// Word is an array of letters as Morse code, like ['.', '.-', '-']
async function playWord(word) {
  for (let i = 0; i < word.length; i++) {
    if (!playIdent) { break; } // Stop playing when Ident knob is pulled
    await playLetter(word[i]);
    await sleep(LETTER_BREAK);
  }
}

async function playSentence(sentence) {
  for (let i = 0; i < sentence.length; i++) {
    await playWord(sentence[i]);
    await sleep(WORD_BREAK);
  }
}

async function playYBTH(identToggle) {
  playIdent = identToggle;
  try {
    while (playIdent) {
       await playWord(['-.--', '-...', '-', '....']);  // "YBTH" is "-.-- -... - ...." in Morse code
       await playSentence([['....', '.', '.-..', '.-..', '---'], /* space */ ['.-', '-.', '-..', '-.--']]); // "Hello Andy"
    }
  } catch(e) {
    console.log(e);
  }
}
