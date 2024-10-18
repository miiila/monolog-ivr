const VoiceResponse = require('twilio').twiml.VoiceResponse;

const names = {
  7532: "Míla",
  1489: "Štěpánka",
  3256: "Petr",
  9014: "Dero",
  6378: "K**a",
  2745: "Aleš",
  5901: "Karel",
  8123: "Kompas",
  4567: "Bebe",
  3890: "Martina",
  7012: "Radek",
  1678: "Zuzka",
  9345: "Eliška",
  2109: "Wal",
  5432: "Ondra Suchánek",
  8765: "Baklažán",
  3210: "Vašek",
  6789: "Jirka ve slevě",
  4321: "Hana Svozilová",
  9876: "Anonyme",
  1234: "Jenda",
  5678: "Michal",
  8901: "Savlik",
  2345: "Pavlík",
  6790: "Fear of the Dark",
  3456: "Dalimir Stano",
  7890: "K**a",
  1235: "Kanonicky Karel",
  4568: "Dan Janek",
  8902: "@#^&$!",
  2346: "Yuyu",
  5679: "Petr Sokola",
  9012: "Míša M.",
  3457: "Funny Flecky",
  6791: "Sváťa Fronk",
  1236: "Petra Barancikova",
  4569: "Láďa",
  7891: "Pavel Bažant",
  2347: "Jiřík",
  5680: "Vlastík",
  9013: "Elif",
  3458: "Mirek",
  6792: "Míša z NN",
  1237: "Marko z NN",
  4570: "Lukáš Pater",
  7892: "Olga",
  2348: "okounátor",
  5681: "Lucka z NN",
  9015: "Zdeněk Bouška",
  3459: "Evule",
  6793: "Naty",
  1238: "Marek Dvořák",
  4571: "Honza",
  7893: "Myška",
  2349: "Richard Musil",
  5682: "Dana Zemanová",
  9016: "Petr Hála",
  3460: "Vendula Rosová",
  6794: "Ema Sedláková",
  1239: "Petr Vácha",
  4572: "Martin Matulík",
  7894: "Vojtěch Pivnička",
  2350: "Vlastimil",
  5683: "Janka",
  9017: "Mimi",
  3461: "Michaela N.",
  6795: "Dalibor",
  1240: "Matúš Masrna",
  4573: "Michal Masrna",
  7895: "A",
  2351: "B",
  5684: "C"
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
    2: 'Vítkov - jezdecká socha Jana Žižky.',
    3: 'Vítkov - kóta.',
    4: 'Socha Vzpomínka v Kaizlových sadech.',
    5: 'Rozcestí jižně od tramvajové zastávky Libeňský most.',
    6: '33 metrů západně od Velkého mlýna.',
    7: 'Dětské hřiště Na Rokytce.',
    8: 'Pivovar Kilián.',
    9: 'Socha Fragment v parku Podviní.',
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
