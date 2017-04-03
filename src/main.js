import 'pixi'
import 'p2'
import Phaser from 'phaser'

var game = new Phaser.Game(360, 640, Phaser.AUTO, null, {
  preload: preload,
  create: create,
  update: update,
});

var WebFontConfig = {
  google: {
    families: ['Noto Sans']
  }
}

var iconsMain, iconsPaused, iconsEnd, iconsPlaying, iconsProfile, iconsScore;
var newPlayer, newFalling;
var moons, ans, mins, sims;
var moonName, anName, minName, simName;
var miniMoon, miniAn, miniMin, miniSim;
var player, miniPlayer, playerName, ending, background;
var score = 0;
var playing = false;
const NUM_PLAYER = 4;
var numFallings = 4;
const PLAYER_WIDTH_SIZE = 80;
const PLAYING_PLAYER_WIDTH_SCALE = 0.8;
const INIT_VEL = 250;
const RAN_VEL = 50;
const SCORE_VEL = 5;
var toArticle, toPlay, toProfile, left, right, background1, stagekk, background2, pause, home, home2, replay, play,
  twit, face, talk, toArticlePressed, toPlayPressed, toProfilePressed, leftPressed, rightPressed, down,
  homeProfile, timer,
  bung, scoreboard, infoBackground, exit, info, up;
var playerIndex;
var backgroundMusic, badHitMusic, gameoverMusic, goodHitMusic, winMusic;
var moonsFalling = ['lee', 'an', 'jung', 'min', 'sim', 'nam', 'moon1', 'moon2', 'moon3', 'moon4', 'moon5', 'moon6'];
var ansFalling = ['moon', 'lee', 'jung', 'min', 'sim', 'nam', 'an1', 'an2', 'an3', 'an4', 'an5', 'an6'];
var minsFalling = ['moon', 'an', 'lee', 'jung', 'sim', 'nam', 'min1', 'min2', 'min3', 'min4', 'min5', 'min6'];
var simsFalling = ['moon', 'an', 'lee', 'jung', 'min', 'nam', 'sim1', 'sim2', 'sim3', 'sim4', 'sim5', 'sim6'];
var playersName = ['moon', 'an', 'min', 'sim'];
var fallings = [moonsFalling, ansFalling, minsFalling, simsFalling];
var players = [];
var miniPlayers = [];
var endings = [];
var names = [];
var nowFallings, texts;
var replayText, shareText, firstText, secondText, thirdText, firthText, rankingText, eventText;
var moon, an, min, sim;
var moon1, moon2, moon3, moon4, moon5, moon6;
var an1, an2, an3, an4, an5, an6;
var min1, min2, min3, min4, min5, min6;
var sim1, sim2, sim3, sim4, sim5, sim6;
var profileAn1, profileAn2, profileMoon1, profileMoon2, 
 profileMin1, profileMin2, profileSim1, profileSim2;
var profiles1, profiles2;
var endingGood, endingBad1, endingBad2, endingBad3, endingBad4, endingEvent;
var moonRank, anRank, minRank, simRank;
var database = firebase.database();
var korNames = ["문재인", "안철수", "유승민", "심상정"];

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.load.spritesheet('stagekk', 'img/stagekk.png', 360, 640);
  game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}

function create() {
  timer = game.time.create(false);
  timer.start();
  stagekk = game.add.sprite(game.world.width * 0.5, game.world.height * 0.5, 'stagekk');
  stagekk.anchor.set(0.5, 0.5);
  stagekk.animations.add('dadada');
  stagekk.animations.play('dadada', 4, true);
  game.load.onLoadComplete.add(loadComplete);
  setTimeout(function () {
    load();
    game.load.start();
  }, 500);
}

function loadComplete() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.checkCollision.down = false;
  initializeSprite();
  initializeAudio();

  profiles1 = [profileMoon1, profileAn1, profileMin1, profileSim1];
  profiles2 = [profileMoon2, profileAn2, profileMin2, profileSim2];
  names = [moonName, anName, minName, simName];
  endings = [endingGood, endingEvent, endingBad1, endingBad2, endingBad3, endingBad4];
  backgroundMusic.loopFull();




  toProfile.events.onInputDown.add(function () {
    toProfilePressed.visible = true;
    toProfile.visible = false;
    player.visible = false;
    var d = new Date();
    database.ref('profile/' + player.key.substring(0, player.key.length - 1)).push().set({
      date: d.getDate(),
      month: d.getMonth() + 1,
      hour: d.getHours(),
      min: d.getMinutes(),
    });
    timer.add(150, function () {
      toProfilePressed.visible = false;
      toProfile.visible = true;
      moveToProfile();
    }, this);
  })

  toPlay.events.onInputDown.add(function () {
    toPlayPressed.visible = true;
    toPlay.visible = false;
    timer.add(150, function () {
      toPlayPressed.visible = false;
      toPlay.visible = true;
      startGame();
    }, this);
  }, this);

  toArticle.events.onInputDown.add(function () {
    toArticlePressed.visible = true;
    toArticle.visible = false;
    var d = new Date();
    database.ref('article/' + player.key.substring(0, player.key.length - 1)).push().set({
      date: d.getDate(),
      month: d.getMonth() + 1,
      hour: d.getHours(),
      min: d.getMinutes(),
    });
    timer.add(150, function () {
      toArticlePressed.visible = false;
      toArticle.visible = true;
      moveToArticle();
    }, this);
  }, this);

  left.events.onInputDown.add(function () {
    leftPressed.visible = true;
    left.visible = false;
    timer.add(150, function () {
      leftPressed.visible = false;
      left.visible = true;
      player.visible = false;
      playerIndex = (playerIndex == 0) ? NUM_PLAYER - 1 : playerIndex - 1;
      setPlayer(playerIndex);
    }, this)
  }, this);

  right.events.onInputDown.add(function () {
    rightPressed.visible = true;
    right.visible = false;
    timer.add(150, function () {
      right.visible = true;
      rightPressed.visible = false;
      player.visible = false;
      playerIndex = (playerIndex == NUM_PLAYER - 1) ? 0 : playerIndex + 1;
      setPlayer(playerIndex);
    }, this)
  }, this);

  pause.events.onInputDown.add(function () {
    iconsPlaying.visible = false;
    iconsPaused.visible = true;
    setAlpha(0.5);
    stopAll();
  }, this);

  play.events.onInputDown.add(function () {
    iconsPlaying.visible = true;
    iconsPaused.visible = false;
    setAlpha(1);
    resume();
  }, this);

  info.events.onInputDown.add(function () {
    iconsMain.visible = false;
    exit.visible = true;
    player.visible = false;
    changeBackground(infoBackground);
  })

  exit.events.onInputDown.add(function () {
    iconsMain.visible = true;
    exit.visible = false;
    player.visible = true;
    changeBackground(background1);
  })

  home.events.onInputDown.add(function () {
    restartGame();
  })

  replay.events.onInputDown.add(function () {
    replayGame();
  })


  home2.events.onInputDown.add(function () {
    restartGame();
  })


  homeProfile.events.onInputDown.add(function () {
    restartGame();
  })

  talk.events.onInputDown.add(function () {
    if (score === 69) {
      database.ref('winners').once('value').then(function (snapshot) {
        var data = snapshot.val();
        Kakao.Link.sendTalkLink({
          label: "나는 " + korNames[playerIndex] + "을(를) " + Object.keys(data[player.key.substring(0, player.key.length - 1)]).length + "번째로 청와대로 보냈다!! 너는너는????",
          image: {
            src: 'http://stagekk.org/game/thumbnail/kakao.png',
            width: '360',
            height: '360'
          },
          webButton: {
            text: '♥최애후보♥ 청와대로 보내러 가기',
            url: 'http://stagekk.org/game'
          },

        });
      });
    } else {
      Kakao.Link.sendTalkLink({
        label: "대통령 만들기 게임! 내가 좋아하는 후보를 청와대로 보내자!!",
        image: {
          src: 'http://stagekk.org/game/thumbnail/kakao.png',
          width: '360',
          height: '360'
        },
        webButton: {
          text: '♥최애후보♥ 청와대로 보내러 가기',
          url: 'http://stagekk.org/game'
        },

      });
    }

  })

  face.events.onInputDown.add(function () {
    FB.ui({
      method: 'share',
      href: 'http://stagekk.org/game'
    }, function (response) {});
  })

  twit.events.onInputDown.add(function () {
    if (score === 69) {
      database.ref('winners').once('value').then(function (snapshot) {
        var data = snapshot.val();
        window.open("https://twitter.com/intent/tweet?text=나는 " + korNames[playerIndex] + "을(를) " + Object.keys(data[player.key.substring(0, player.key.length - 1)]).length + "번째로 청와대로 보냈다!! 너는너는????&url=http://stagekk.org/game");
      });
    } else {
      window.open("https://twitter.com/intent/tweet?text=대통령 만들기 게임! 내가 좋아하는 후보를 청와대로 보내자!!&url=http://stagekk.org/game");
    }
  });

  down.events.onInputDown.add(function () {
    moveToSecondProfile();
  });

  up.events.onInputDown.add(function () {
    up.visible = false;
    down.visible = true;
    if (playerIndex == 0) {
      changeBackground(profileMoon1);
    } else if (playerIndex == 1) {
      changeBackground(profileAn1);
    } else if (playerIndex == 2) {
      changeBackground(profileMin1);
    } else if (playerIndex == 3) {
      changeBackground(profileSim1);
    }
  })

  initMiniPlayers();

  eventText = game.add.text(game.world.width * 0.5, 133, "fffffff", {
    font: "40px Noto Sans",
    fill: "#fc992b",
    fontWeight: 'bold',
  })
  eventText.anchor.set(0.5, 0);
  eventText.visible = false;

  shareText = game.add.text(game.world.width * 0.5, 331, "공유하기", {
    font: "16px Noto Sans",
    fill: "white"
  });
  shareText.anchor.set(0.5, 0);

  replayText = game.add.text(game.world.width - 16, 79, "다시하기", {
    font: "16px Noto Sans",
    fill: "white"
  });
  replayText.anchor.set(1, 0);

  rankingText = game.add.text(game.world.width * 0.5, 390, "청와대로 보낸 횟수", {
    font: "21px Noto Sans",
    fill: "#fc992b",
    fontWeight: 'bold',
  });
  rankingText.anchor.set(0.5, 0.5);
  var moveLeft = 77;
  firstText = game.add.text(game.world.width * 0.5 - moveLeft, 430, "", {
    font: "18px Noto Sans",
    fill: "white"
  });
  firstText.anchor.set(0, 0.5);

  secondText = game.add.text(game.world.width * 0.5 - moveLeft, 460, "", {
    font: "18px Noto Sans",
    fill: "white"
  });
  secondText.anchor.set(0, 0.5);

  thirdText = game.add.text(game.world.width * 0.5 - moveLeft, 490, "", {
    font: "18px Noto Sans",
    fill: "white"
  });
  thirdText.anchor.set(0, 0.5);

  firthText = game.add.text(game.world.width * 0.5 - moveLeft, 520, "", {
    font: "18px Noto Sans",
    fill: "white"
  });
  firthText.anchor.set(0, 0.5);

  initPlayers();
  organizeGroup();

  stagekk.visible = false;
  iconsMain.visible = true;
  background.visible = true;
  player.visible = true;
  stagekk.animations.stop();

}

function update() {



  if (playing) {
    game.physics.arcade.collide(nowFallings, player, fallingHitPlayer);
    if (game.input.x < 340 && game.input.x > 20) {
      if (Math.abs(game.input.x - player.x) < 75) {
        player.x = game.input.x || game.world.width * 0.5;
      }
      if (score === 69) {
        player.reset(game.world.width * 0.5, 90);
      }
    }
    nowFallings.children.forEach(function (falling) {
      if (falling.y > game.world.height - 5 - player.height) {
        falling.destroy();
        resetFalling();
      }
    });
  }



}

function addText(x, y, key, style) {
  var text;
  if (key === 'an1') {
    text = "청년멘토";
  } else if (key === 'an2') {
    text = "백신";
  } else if (key === 'an3') {
    text = "총선승리";
  } else if (key === 'an4') {
    text = "새정치";
  } else if (key === 'an5') {
    text = "야권분열";
  } else if (key === 'an6') {
    text = "간보기";
  } else if (key === 'moon1') {
    text = "노무현벗";
  } else if (key === 'moon2') {
    text = "국정경험";
  } else if (key === 'moon3') {
    text = "인권변호사";
  } else if (key === 'moon4') {
    text = "친문패권";
  } else if (key === 'moon5') {
    text = "회고록";
  } else if (key === 'moon6') {
    text = "호남홀대";
  }  else if (key === 'min1') {
    text = "경제전문";
  } else if (key === 'min2') {
    text = "합리보수";
  } else if (key === 'min3') {
    text = "비박";
  } else if (key === 'min4') {
    text = "좌클릭";
  } else if (key === 'min5') {
    text = "원조친박";
  } else if (key === 'min6') {
    text = "금수저딸";
  } else if (key === 'sim1') {
    text = "친노동";
  } else if (key === 'sim2') {
    text = "사자후";
  } else if (key === 'sim3') {
    text = "심블리";
  } else if (key === 'sim4') {
    text = "소수정당";
  } else if (key === 'sim5') {
    text = "강성진보";
  } else if (key === 'sim6') {
    text = "강성진보";
  } 

  var newText = game.add.text(x, y + 20, text, style);
  game.physics.enable(newText, Phaser.Physics.ARCADE);
  newText.anchor.set(0.5, 1);
  newText.body.velocity.setTo(0, -20);
  timer.add(1000, function () {
    newText.destroy();
  }, this);
  texts.add(newText);
}

function initFallings() {
  for (var i = 0; i < numFallings; i++) {
    resetFalling();
  }
}

// Add a new player to players group, then call setPlayer function
function initPlayers() {
  for (var i = 0; i < NUM_PLAYER; i++) {
    newPlayer = game.add.sprite(game.world.width * 0.5, 369, playersName[i] + 's');
    game.physics.enable(newPlayer, Phaser.Physics.ARCADE);
    if (playersName[i] == 'moon') {
      newPlayer.animations.add('happy');
      newPlayer.animations.play('happy', 6, true);

    } else {
      newPlayer.animations.add('happy');
      newPlayer.animations.play('happy', 4, true);

    }
    newPlayer.anchor.set(0.5, 1);
    newPlayer.visible = false;
    newPlayer.body.immovable = true;
    newPlayer.body.setSize(newPlayer.body.width * 0.8, newPlayer.body.height * 0.8);
    players.push(newPlayer);
  }
  setPlayer(Math.floor(Math.random() * NUM_PLAYER));
}

function initMiniPlayers() {
  for (var i = 0; i < NUM_PLAYER; i++) {
    newPlayer = game.add.sprite(84, 43, playersName[i] + 's');
    if (playersName[i] == 'moon') {
      newPlayer.animations.add('happy');
      newPlayer.animations.play('happy', 6, true);
    } else {
      newPlayer.animations.add('happy');
      newPlayer.animations.play('happy', 4, true);
    }
    newPlayer.anchor.set(0, 1);
    newPlayer.visible = false;
    newPlayer.scale.setTo(0.25, 0.25);
    miniPlayers.push(newPlayer);
  }
}

function setPlayer(newPlayerIndex) {
  if (player) {
    player.visible = false;
    playerName.visible = false;
    miniPlayer.visible = false;
  }
  playerIndex = newPlayerIndex;
  player = players[newPlayerIndex];
  miniPlayer = miniPlayers[newPlayerIndex];
  playerName = names[newPlayerIndex];
  player.visible = true;
  playerName.visible = true;
}

function fallingHitPlayer(player, falling) {
  //console.log(falling.key);
  if (falling.key.slice(-1) < 4) {
    score += 3;
    if (score === 15) {
      if (numFallings == 4) {
        numFallings += 1;
        resetFalling();
      }
    }
    if (score === 30) {
      if (numFallings == 5) {
        numFallings += 1;
        resetFalling();
      }
    }
    if (score === 45) {
      if (numFallings == 6) {
        numFallings += 1;
        resetFalling();
      }
    }
    if (score === 60) {
      if (numFallings == 7) {
        numFallings += 1;
        resetFalling();
      }
    }
    if (score === 69) {
      iconsPlaying.visible = false;
      iconsScore.visible = false;
      iconsEnd.visible = true;
      if (ending) {
        ending.visible = false;
      }
      playing = false;
      backgroundMusic.pause();
      winMusic.play();
      nowFallings.destroy();
      setAlpha(0.5);
      player.scale.setTo(0.5, 0.5);
      player.reset(game.world.width * 0.5, 90);
      player.alpha = 1;
      calculateRanking();
      var d = new Date();
      database.ref('winners/' + player.key.substring(0, player.key.length - 1)).push().set({
        date: d.getDate(),
        month: d.getMonth() + 1,
        hour: d.getHours(),
        min: d.getMinutes(),
      });
      return;
    }
    moveAvatar();
    goodHitMusic.play();
    addText(falling.x, falling.y, falling.key, {
      font: "18px Noto Sans",
      fill: "#fc992b"
    });
    falling.destroy();
    resetFalling();
  } else if (falling.key.slice(-1) < 7) {
    score = (score == 0) ? 0 : (score - 3);
    moveAvatar();
    badHitMusic.play();
    addText(falling.x, falling.y, falling.key, {
      font: "18px Noto Sans"
    });
    falling.destroy();
    resetFalling();
  } else {
    backgroundMusic.pause();
    gameoverMusic.play();
    iconsPlaying.visible = false;
    iconsEnd.visible = true;
    if (ending) {
      ending.visible = false;
    }
    ending = endings[Math.floor(Math.random() * (endings.length - 2)) + 2];
    ending.visible = true;
    playing = false;
    stopAll();
    setAlpha(0.5);
    iconsScore.alpha = 1;
    bung.reset(58 + score * 3 - 27, 19 + 100);
    miniPlayer.reset(84 + score * 3 - 27, 43 + 100);
    scoreboard.reset(71 - 27, 17 + 100);
    calculateRanking();
  }
}

function stopAll() {
  nowFallings.children.forEach(function (falling) {
    setVel(falling, 0, 0);
  });
  playing = false;
}

function resume() {
  nowFallings.children.forEach(function (falling) {
    setVel(falling, 0, INIT_VEL + Math.random() * RAN_VEL + score * SCORE_VEL);
  });
  playing = true;
}

function startGame() {
  if (!backgroundMusic.isPlaying) {
    backgroundMusic.play();
  }
  eventText.visible = false;
  iconsMain.visible = false;
  iconsPlaying.visible = true;
  changeBackground(background2);
  iconsScore.visible = true;
  score = 0;
  playing = true;
  numFallings = 5;
  bung.reset(58, 19);
  miniPlayer.visible = true;
  miniPlayer.reset(84, 43);
  scoreboard.reset(71, 17);
  player.scale.setTo(0.8, 0.8);
  player.reset(game.world.width * 0.5, game.world.height - 5);
  initFallings();
  var d = new Date();
  database.ref('pick-rate/' + player.key.substring(0, player.key.length - 1)).push().set({
    date: d.getDate(),
    month: d.getMonth() + 1,
    hour: d.getHours(),
    min: d.getMinutes(),
  });
}

function restartGame() {
  if (!backgroundMusic.isPlaying) {
    backgroundMusic.play();
  }
  eventText.visible = false;
  iconsMain.visible = true;
  iconsEnd.visible = false;
  iconsPaused.visible = false;
  iconsProfile.visible = false;
  iconsScore.visible = false;
  setAlpha(1);
  player.scale.setTo(1, 1);
  player.reset(game.world.width * 0.5, 369);
  setPlayer(Math.floor(Math.random() * NUM_PLAYER));
  changeBackground(background1);
  nowFallings.destroy();
  nowFallings = game.add.group();
}

function replayGame() {
  iconsEnd.visible = false;
  setAlpha(1);
  nowFallings.destroy();
  nowFallings = game.add.group();
  startGame();
}

function setVel(falling, velX, velY) {
  falling.body.velocity.set(velX, velY);
}

function moveToArticle() {
  if (playerIndex == 0) {
    goToArticle('moon');
  } else if (playerIndex == 1) {
    goToArticle('ahn');
  } else if (playerIndex == 2) {
    goToArticle('you');
  } else if (playerIndex == 3) {
    goToArticle('sim');
  }
}

function moveToProfile() {
  iconsMain.visible = false;
  iconsProfile.visible = true;
  down.visible = true;
  up.visible = false;
  if (playerIndex == 0) {
    changeBackground(profileMoon1);
  } else if (playerIndex == 1) {
    changeBackground(profileAn1);
  } else if (playerIndex == 2) {
    changeBackground(profileMin1);
  } else if (playerIndex == 3) {
    changeBackground(profileSim1);
  }
}

function moveToSecondProfile() {
  down.visible = false;
  up.visible = true;
  if (playerIndex == 0) {
    changeBackground(profileMoon2);
  } else if (playerIndex == 1) {
    changeBackground(profileAn2);
  } else if (playerIndex == 2) {
    changeBackground(profileMin2);
  } else if (playerIndex == 3) {
    changeBackground(profileSim2);
  }
}

function goToArticle(candidate) {
  window.location = "http://stagekk.org/candidate/" + candidate
}

function resetFalling() {
  timer.add(2000 * Math.random(), function () {
    newFalling = game.add.sprite(game.world.width * Math.random(), 5, fallings[playerIndex][Math.floor(Math.random() *
      fallings[playerIndex].length)]);
    game.physics.enable(newFalling, Phaser.Physics.ARCADE);
    newFalling.anchor.set(0.5, 0);
    setVel(newFalling, 0, INIT_VEL + Math.random() * RAN_VEL + score * SCORE_VEL);
    nowFallings.add(newFalling);
  }, this);
}

function moveAvatar() {
  miniPlayer.reset(84 + score * 3, 43);
  bung.reset(58 + score * 3, 19);
}

function setAlpha(alpha) {
  background2.alpha = alpha;
  player.alpha = alpha;
  nowFallings.children.forEach(function (falling) {
    falling.alpha = alpha;
  })
  iconsScore.alpha = alpha;
}

function changeBackground(newBackground) {
  if (background) {
    background.visible = false;
  }
  background = newBackground;
  background.visible = true;
}

function calculateRanking() {
  //player.key.substring(0, player.key.length - 1)
  var scoreList = [];
  var textList = [firstText, secondText, thirdText, firthText];
  database.ref('winners').once('value').then(function (snapshot) {
    var data = snapshot.val();
    var total = 0;
    for (var cand in data) {
      total += Object.keys(data[cand]).length;
    }
    if (score === 69) {
      if (total % 100 === 0 && total != 0) {
        ending = endings[1];
        ending.visible = true;
        eventText.visible = true;
        eventText.text = total + "번째";
      } else {
        ending = endings[0];
        ending.visible = true;
      }
    }

    scoreList.push({
      name: '문제니',
      key: 'moon',
      score: Object.keys(data['moon']).length
    });

    scoreList.push({
      name: '안쳤어',
      key: 'an',
      score: Object.keys(data['an']).length
    });

    scoreList.push({
      name: '유분수',
      key: 'min',
      score: Object.keys(data['min']).length
    });
    scoreList.push({
      name: '심상중',
      key: 'sim',
      score: Object.keys(data['sim']).length
    });

    scoreList.sort(function (a, b) {
      return b.score - a.score;
    })
    scoreList.forEach(function (val, index, arr) {
      textList[index].text = (index + 1) + '위    ' + val.name + '    ' + val.score + '회';
      if (player.key === val.key + 's') {
        textList[index].fill = "#fc992b";
      } else {
        textList[index].fill = 'white';
      }
    });
  });
}

function load() {
  game.load.image('moon', 'img/moon.png');
  game.load.image('an', 'img/an.png');
  game.load.image('min', 'img/min.png');
  game.load.image('sim', 'img/sim.png');

  game.load.image('moon1', 'img/moon1.png');
  game.load.image('moon2', 'img/moon2.png');
  game.load.image('moon3', 'img/moon3.png');
  game.load.image('moon4', 'img/moon4.png');
  game.load.image('moon5', 'img/moon5.png');
  game.load.image('moon6', 'img/moon6.png');

  game.load.image('an1', 'img/an1.png');
  game.load.image('an2', 'img/an2.png');
  game.load.image('an3', 'img/an3.png');
  game.load.image('an4', 'img/an4.png');
  game.load.image('an5', 'img/an5.png');
  game.load.image('an6', 'img/an6.png');

  game.load.image('min1', 'img/min1.png');
  game.load.image('min2', 'img/min2.png');
  game.load.image('min3', 'img/min3.png');
  game.load.image('min4', 'img/min4.png');
  game.load.image('min5', 'img/min5.png');
  game.load.image('min6', 'img/min6.png');

  game.load.image('sim1', 'img/sim1.png');
  game.load.image('sim2', 'img/sim2.png');
  game.load.image('sim3', 'img/sim3.png');
  game.load.image('sim4', 'img/sim4.png');
  game.load.image('sim5', 'img/sim5.png');
  game.load.image('sim6', 'img/sim6.png');

  game.load.image('toArticle', 'img/to-article.png');
  game.load.image('toPlay', 'img/to-play.png');
  game.load.image('toProfile', 'img/to-profile.png');
  game.load.image('left', 'img/left.png');
  game.load.image('right', 'img/right.png');
  game.load.image('pause', 'img/pause.png');
  game.load.image('home', 'img/home.png');
  game.load.image('play', 'img/play.png');
  game.load.image('face', 'img/face.png');
  game.load.image('twit', 'img/twit.png');
  game.load.image('talk', 'img/talk.png');
  game.load.image('replay', 'img/replay.png');
  game.load.image('home2', 'img/home2.png');
  game.load.image('toArticlePressed', 'img/to-article-pressed.png');
  game.load.image('toPlayPressed', 'img/to-play-pressed.png');
  game.load.image('toProfilePressed', 'img/to-profile-pressed.png');
  game.load.image('leftPressed', 'img/left-pressed.png');
  game.load.image('rightPressed', 'img/right-pressed.png');
  game.load.image('down', 'img/down.png');
  game.load.image('home2', 'img/home2.png');
  game.load.image('bung', 'img/bung.png');
  game.load.image('scoreboard', 'img/scoreboard.png');
  game.load.image('info', 'img/info.png');
  game.load.image('exit', 'img/exit.png');
  game.load.image('infoBackground', 'img/info-background.png');

  game.load.spritesheet('moons', 'img/moons.png', PLAYER_WIDTH_SIZE, 112);
  game.load.spritesheet('ans', 'img/ans.png', PLAYER_WIDTH_SIZE, 110);
  game.load.spritesheet('mins', 'img/mins.png', PLAYER_WIDTH_SIZE, 109);
  game.load.spritesheet('sims', 'img/sims.png', 75, 116);

  game.load.image('profileAn1', 'img/profilean1.png');
  game.load.image('profileAn2', 'img/profilean2.png');
  game.load.image('profileMoon1', 'img/profilemoon1.png');
  game.load.image('profileMoon2', 'img/profilemoon2.png');
  game.load.image('profileMin1', 'img/profilemin1.png');
  game.load.image('profileMin2', 'img/profilemin2.png');
  game.load.image('profileSim1', 'img/profilesim1.png');
  game.load.image('profileSim2', 'img/profilesim2.png');
  game.load.image('background1', 'img/background1.png');
  game.load.image('background2', 'img/background2.png');

  game.load.image('moonName', 'img/moon-name.png');
  game.load.image('anName', 'img/an-name.png');
  game.load.image('minName', 'img/min-name.png');
  game.load.image('simName', 'img/sim-name.png');

  game.load.image('endingBad1', 'img/endingbad1.png');
  game.load.image('endingBad2', 'img/endingbad2.png');
  game.load.image('endingBad3', 'img/endingbad3.png');
  game.load.image('endingBad4', 'img/endingbad4.png');
  game.load.image('endingGood', 'img/endinggood.png');
  game.load.image('endingEvent', 'img/endingevent.png');

  game.load.audio('backgroundMusic', 'audio/background-music.mp3');
  game.load.audio('badHitMusic', 'audio/bad-hit-music.mp3');
  game.load.audio('gameoverMusic', 'audio/gameover-music.mp3');
  game.load.audio('goodHitMusic', 'audio/good-hit-music.mp3');
  game.load.audio('winMusic', 'audio/win-music.mp3');
}


function initializeSprite() {
  background1 = game.add.tileSprite(0, 0, 360, 640, 'background1');
  background = background1;
  background1.visible = false;
  background2 = game.add.tileSprite(0, 0, 360, 640, 'background2');
  background2.visible = false;
  profileAn1 = game.add.tileSprite(0, 0, 360, 640, 'profileAn1');
  profileAn1.visible = false;
  profileAn2 = game.add.tileSprite(0, 0, 360, 640, 'profileAn2');
  profileAn2.visible = false;

  profileMoon1 = game.add.tileSprite(0, 0, 360, 640, 'profileMoon1');
  profileMoon1.visible = false;
  profileMoon2 = game.add.tileSprite(0, 0, 360, 640, 'profileMoon2');
  profileMoon2.visible = false;

  profileMin1 = game.add.tileSprite(0, 0, 360, 640, 'profileMin1');
  profileMin1.visible = false;
  profileMin2 = game.add.tileSprite(0, 0, 360, 640, 'profileMin2');
  profileMin2.visible = false;
  profileSim1 = game.add.tileSprite(0, 0, 360, 640, 'profileSim1');
  profileSim1.visible = false;
  profileSim2 = game.add.tileSprite(0, 0, 360, 640, 'profileSim2');
  profileSim2.visible = false;

  infoBackground = game.add.tileSprite(0, 0, 360, 640, 'infoBackground');
  infoBackground.visible = false;
  info = game.add.sprite(320, 14, 'info');
  info.anchor.set(0.5, 0);
  info.inputEnabled = true;
  exit = game.add.sprite(320, 14, 'exit');
  exit.anchor.set(0.5, 0);
  exit.inputEnabled = true;
  exit.visible = false;
  toProfile = game.add.sprite(game.world.width * 0.5, 460, 'toProfile');
  toProfile.anchor.set(0.5, 0.5);
  toProfile.inputEnabled = true;
  toProfilePressed = game.add.sprite(game.world.width * 0.5, 460, 'toProfilePressed');
  toProfilePressed.anchor.set(0.5, 0.5);
  toProfilePressed.visible = false;
  toPlay = game.add.sprite(game.world.width * 0.5 - 52, 460, 'toPlay');
  toPlay.anchor.set(1, 0.5);
  toPlay.inputEnabled = true;
  toPlayPressed = game.add.sprite(game.world.width * 0.5 - 52, 460, 'toPlayPressed');
  toPlayPressed.anchor.set(1, 0.5);
  toPlayPressed.visible = false;
  toArticle = game.add.sprite(game.world.width * 0.5 + 52, 460, 'toArticle');
  toArticle.anchor.set(0, 0.5);
  toArticle.inputEnabled = true;
  toArticlePressed = game.add.sprite(game.world.width * 0.5 + 52, 460, 'toArticlePressed');
  toArticlePressed.anchor.set(0, 0.5);
  toArticlePressed.visible = false;
  left = game.add.sprite(92, 335, 'left');
  left.anchor.set(1, 1);
  left.inputEnabled = true;
  leftPressed = game.add.sprite(92, 335, 'leftPressed');
  leftPressed.anchor.set(1, 1);
  leftPressed.visible = false;
  right = game.add.sprite(268, 335, 'right');
  right.anchor.set(0, 1);
  right.inputEnabled = true;
  rightPressed = game.add.sprite(268, 335, 'rightPressed');
  rightPressed.anchor.set(0, 1);
  rightPressed.visible = false;
  pause = game.add.sprite(25, 22.5, 'pause');
  pause.anchor.set(0, 0);
  pause.inputEnabled = true;
  play = game.add.sprite(207, 271, 'play');
  play.anchor.set(0, 0);
  play.inputEnabled = true;
  home = game.add.sprite(133, 266, 'home');
  home.anchor.set(0.5, 0);
  home.inputEnabled = true;
  twit = game.add.sprite(game.world.width * 0.5, 262, 'twit');
  twit.anchor.set(0.5, 0);
  twit.inputEnabled = true;
  face = game.add.sprite(76, 262, 'face');
  face.anchor.set(0, 0);
  face.inputEnabled = true;
  talk = game.add.sprite(game.world.width - 76, 262, 'talk');
  talk.anchor.set(1, 0);
  talk.inputEnabled = true;
  replay = game.add.sprite(360 - 13, 15, 'replay');
  replay.anchor.set(1, 0);
  replay.inputEnabled = true;
  home2 = game.add.sprite(25, 22.5, 'home2');
  home2.anchor.set(0, 0);
  home2.inputEnabled = true;

  homeProfile = game.add.sprite(25, 22.5, 'home2');
  homeProfile.anchor.set(0, 0);
  homeProfile.inputEnabled = true;

  down = game.add.sprite(game.world.width * 0.5, 381, 'down');
  down.anchor.set(0.5, 0);
  down.inputEnabled = true;

  up = game.add.sprite(game.world.width * 0.5, 50, 'down');
  up.anchor.set(0.5, 0.5);
  up.angle += 180;
  up.inputEnabled = true;
  up.visible = false;

  bung = game.add.sprite(58, 19, 'bung');
  bung.anchor.set(0, 0);


  scoreboard = game.add.sprite(71, 17, 'scoreboard');
  scoreboard.anchor.set(0, 0);

  moonName = game.add.sprite(game.world.width * 0.5, 385, 'moonName');
  moonName.anchor.set(0.5, 0);
  moonName.visible = false;
  anName = game.add.sprite(game.world.width * 0.5, 385, 'anName');
  anName.anchor.set(0.5, 0);
  anName.visible = false;
  minName = game.add.sprite(game.world.width * 0.5, 385, 'minName');
  minName.anchor.set(0.5, 0);
  minName.visible = false;
  simName = game.add.sprite(game.world.width * 0.5, 385, 'simName');
  simName.anchor.set(0.5, 0);
  simName.visible = false;

  endingGood = game.add.sprite(game.world.width * 0.5, 244, 'endingGood')
  endingGood.anchor.set(0.5, 1);
  endingGood.visible = false;
  endingBad1 = game.add.sprite(game.world.width * 0.5, 141 + 30, 'endingBad1')
  endingBad1.anchor.set(0.5, 0);
  endingBad1.visible = false;
  endingBad2 = game.add.sprite(game.world.width * 0.5, 141 + 30, 'endingBad2')
  endingBad2.anchor.set(0.5, 0);
  endingBad2.visible = false;
  endingBad3 = game.add.sprite(game.world.width * 0.5, 141 + 30, 'endingBad3')
  endingBad3.anchor.set(0.5, 0);
  endingBad3.visible = false;
  endingBad4 = game.add.sprite(game.world.width * 0.5, 141 + 30, 'endingBad4')
  endingBad4.anchor.set(0.5, 0);
  endingBad4.visible = false;
  endingEvent = game.add.sprite(game.world.width * 0.5, 244, 'endingEvent');
  endingEvent.anchor.set(0.5, 1);
  endingEvent.visible = false;
}

function initializeAudio() {
  backgroundMusic = game.add.audio('backgroundMusic');
  badHitMusic = game.add.audio('badHitMusic');
  goodHitMusic = game.add.audio('goodHitMusic');
  gameoverMusic = game.add.audio('gameoverMusic');
  winMusic = game.add.audio('winMusic');
}

function organizeGroup() {
  nowFallings = game.add.group();
  iconsMain = game.add.group();
  iconsMain.add(toPlay);
  iconsMain.add(toProfile);
  iconsMain.add(toArticle);
  iconsMain.add(right);
  iconsMain.add(left);
  iconsMain.add(moonName);
  iconsMain.add(anName);
  iconsMain.add(minName);
  iconsMain.add(simName);
  iconsMain.add(info);
  iconsMain.visible = false;

  iconsPaused = game.add.group();
  iconsPaused.add(play);
  iconsPaused.add(home);
  iconsPaused.visible = false;

  iconsPlaying = game.add.group();
  iconsPlaying.add(pause);
  iconsPlaying.visible = false;

  iconsEnd = game.add.group();
  iconsEnd.add(home2);
  iconsEnd.add(replay);
  iconsEnd.add(endingGood);
  iconsEnd.add(endingBad1);
  iconsEnd.add(endingBad2);
  iconsEnd.add(endingBad3);
  iconsEnd.add(endingBad4);
  iconsEnd.add(endingEvent);
  iconsEnd.add(twit);
  iconsEnd.add(face);
  iconsEnd.add(talk);
  iconsEnd.add(replayText);
  iconsEnd.add(shareText);
  iconsEnd.add(firstText);
  iconsEnd.add(secondText);
  iconsEnd.add(thirdText);
  iconsEnd.add(firthText);
  iconsEnd.add(rankingText);
  iconsEnd.add(eventText);
  iconsEnd.visible = false;

  iconsScore = game.add.group();
  iconsScore.add(bung);
  iconsScore.add(miniPlayer);
  iconsScore.add(scoreboard);
  iconsScore.visible = false;

  iconsProfile = game.add.group();
  iconsProfile.add(down);
  iconsProfile.add(up);
  iconsProfile.add(homeProfile);
  iconsProfile.visible = false;

  texts = game.add.group();
}