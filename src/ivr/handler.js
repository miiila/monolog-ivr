const VoiceResponse = require('twilio').twiml.VoiceResponse;
1
2
3

const names = {
  2748: 'Míla (org)',
  5931: 'Štěpánka (org)',
  1087: 'Petr (org)',
  6472: 'Dero',
  8259: 'K**a',
  4361: 'Aleš',
  9823: 'Karel',
  7145: 'Adamat',
  3902: 'Kompas',
  2578: 'Bebe',
  6801: 'Martina',
  9406: 'Radek',
  1724: 'Zuzka',
  8357: 'Eliška',
  4169: 'Wal',
  5093: 'Ondra Suchánek',
  6724: 'Baklažán',
  9812: 'Vašek',
  2539: 'Jirka ve slevě',
  7481: 'Hana Svozilová',
  6194: 'Anonyme',
  3027: 'Jenda',
  4308: 'Michal',
  6843: 'Tomáš Brokl',
  2901: 'Savlik',
  7592: 'Pavlík',
  4687: 'Fear of the Dark',
  5203: 'Dalimir Stano',
  8416: 'K**a',
  6794: 'kpt. Zřejmík',
  2035: 'Kanonicky Karel',
  4789: 'Ondřej Med',
  6521: 'Dan Janek',
  1876: '@#^&$!',
  6143: 'Kača',
  2856: 'Yuyu',
  9387: 'Petr Sokola',
  4729: 'Míša M.',
  1568: 'Funny Flecky',
  6347: 'Sváťa Fronk',
  8204: 'Vojtech Bardiovský',
  3016: 'Petra Barancikova',
  5793: 'Láďa',
  8041: 'Pavel Bažant',
  9625: 'Jiřík',
  4278: 'Vlastík',
  1954: 'Elif',
  7162: 'Mirek',
  3907: 'Míša z NN',
  5284: 'Marko z NN',
  6871: 'Lukáš Pater',
  9405: 'Olga',
  3198: 'okounátor',
  7642: 'Lucka z NN',
  2548: 'Zdeněk Bouška',
  1079: 'Bojový John',
  8320: 'Evule',
  4926: 'Naty',
  6814: 'Marek Dvořák',
  6977:	'Testovací účet'
}

exports.welcome = function welcome() {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/ivr/menu',
    numDigits: '4',
    method: 'POST',
  });

  gather.say(
    'Vítejte v záchranném centru hry Monolog.' +
    'Zadejte svůj kód.',
    {loop: 1, language: 'cs-CZ', voice: 'Google.cs-CZ-Standard-A'}
  );

  return voiceResponse.toString();
};

exports.menu = function menu(code) {
  if (Object.keys(names).includes(code)) {
    return selectStage(code)
  } else {
    return redirectWelcome();
  }
};

function selectStage(code) {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: `/ivr/giveHint?code=${code}`,
    numDigits: '1',
    method: 'POST',
  });

  gather.say(
    'Zvolte číslo stanoviště, na které chcete záchranu.' +
    'Pro zjištění, kde se nachází cíl, zvolte 0. ', 
    {loop: 1, language: 'cs-CZ', voice: 'Google.cs-CZ-Standard-A'}
  );

  return voiceResponse.toString();
}

exports.giveHint = function giveHint(stage, code) {
  const voiceResponse = new VoiceResponse();

  const name = names[code];

  const stages = {
    0: 'Cíl se nachází v restauraci Podviňák.',
    1: 'Kostnické náměstí.',
    2: 'Vítkov - památník.',
    3: 'Vítkov - kóta.',
    4: 'Socha Vzpomínka v Kaizlových sadech.',
    5: 'Rozcestí jižně od tramvajové zastávky Libeňský most.',
    6: 'Velký mlýn.',
    7: 'Dětské hřiště Na Rokytce.',
    8: 'Pivovar Kilián.',
    9: 'Park Podviní.',
  }
  
  if (stage === '*') {
    voiceResponse.say(
      `Vaše jméno je ${name}.`,
      {loop: 1, language: 'cs-CZ', voice: 'Google.cs-CZ-Standard-A'}
    );

    voiceResponse.hangup();
    return voiceResponse.toString();
  }

  voiceResponse.say(
    `Záchrana pro šifru číslo ${stage}:     ${stages[stage]}`,
    {loop: 2, language: 'cs-CZ', voice: 'Google.cs-CZ-Standard-A'}
  );

  voiceResponse.hangup();

  console.info('DEAD', name, stage);

  return voiceResponse.toString();
};

/**
 * Returns an xml with the redirect
 * @return {String}
 */
function redirectWelcome() {
  const twiml = new VoiceResponse();

  twiml.say('Nesprávný kód hráče.', {
    voice: 'Google.cs-CZ-Standard-A',
    language: 'cs-CZ',
  });

  twiml.redirect('/ivr/welcome');

  return twiml.toString();
}
