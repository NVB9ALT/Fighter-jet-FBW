function addFBW() {
geofs.animation.values.cobraMode = 0;
document.addEventListener("keydown", function(e) {
	if (e.keyCode == 222) {
geofs.animation.values.cobraMode == 0 ? geofs.animation.values.cobraMode = 1 : geofs.animation.values.cobraMode = 0
   }
})
cobraButton = function() {
   if (geofs.animation.values.cobraMode == 1) {
if (geofs.aircraft.instance.id == 2857) {
   geofs.aircraft.instance.definition.parts[14].stalls = true
   geofs.aircraft.instance.definition.parts[15].stalls = true
}
	} else {
if (geofs.aircraft.instance.id == 2857) {
   geofs.aircraft.instance.definition.parts[14].stalls = false
   geofs.aircraft.instance.definition.parts[15].stalls = false
}
	}
}
cobraInt = setInterval(function(){cobraButton()},100)


//Fighter jet FBW
//Average pull rate: (geofs.animation.values.pitchrate + geofs.animation.values.turnrate) / 2
//clearInterval(FBWint)
let tiltToHold = 0;
let deadZone = 0.005;
let pitchCenter = 0;
let pitchStage1 = 0;
let computingPitch = 0;
let pullRate = 0;
let normalizedG = 0;
let normalizedAoA = 0;
let input = 0;
let inputR = 0;
geofs.animation.values.computedPitch = 0;
geofs.animation.values.computedRoll = 0;
geofs.animation.values.cobraMode = 0;
computePitch = function() {
	normalizedG = (geofs.animation.values.loadFactor / 9)
	normalizedAoA = (geofs.animation.values.aoa / 15)
	input = geofs.animation.values.pitch
//Make it run at 100 ms int
if (geofs.pause == 0) {
//G and alpha protection
if (normalizedAoA > 1 && geofs.animation.values.cobraMode == 0) {
   geofs.animation.values.computedPitch = geofs.animation.values.computedPitch - 0.05
} else if (normalizedG > 1 && geofs.animation.values.cobraMode == 0) {
   geofs.animation.values.computedPitch = geofs.animation.values.computedPitch - 0.05
} else {
   geofs.animation.values.computedPitch = input
}
   }
}
computeRoll = function() {
   inputR = geofs.animation.values.roll
if (geofs.pause == 0) {
    if (geofs.animation.values.groundContact == 0) {
  //roll stabilization from input
  if (rollTohold <= 30 && rollTohold >= -30) {
    rollTohold = rollTohold - geofs.animation.values.roll;
    geofs.animation.values.computedRoll = clamp((geofs.animation.values.aroll - rollTohold) / 15, -1, 1);
  }
  else {
    if (geofs.animation.values.aroll >= 0) {
      rollTohold = 29;
      geofs.animation.values.computedRoll = clamp((geofs.animation.values.aroll - rollTohold) / 15, -1, 1)
    }
    if (geofs.animation.values.aroll <= 0) {
      rollTohold = -29;
      geofs.animation.values.computedRoll = clamp((geofs.animation.values.aroll - rollTohold) / 15, -1, 1)
    }
  }
  }
  else {
    geofs.animation.values.computedRoll = inputR
  }
   }
}
let pitchInputs = [0, 0, 0, 0, 0, 0, 0];
geofs.animation.values.averagePitch = null;
geofs.animation.values.outerAveragePitch = null;
pushInputs = function() {
  pitchInputs.push(geofs.animation.values.computedPitch);
}
let rollInputs = [0, 0, 0, 0, 0, 0, 0];
geofs.animation.values.averageRoll = null;
geofs.animation.values.outerAverageRoll = null;
pushInputs = function() {
  pitchInputs.push(geofs.animation.values.computedPitch);
  rollInputs.push(geofs.animation.values.computedRoll)
}
computeOutputs = function() {
  var pitchcheck = movingAvg(pitchInputs, 2, 2);
  var rollcheck = movingAvg(rollInputs, 2, 2)
  geofs.animation.values.averagePitch = pitchcheck[pitchcheck.length - 3]
   geofs.animation.values.averageRoll = rollcheck[rollcheck.length - 3];
  geofs.animation.values.outerAverageRoll = clamp(geofs.animation.values.averageRoll / (geofs.animation.values.kias / 100), -1, 1);
  geofs.animation.values.outerAveragePitch = clamp(geofs.animation.values.averagePitch / (geofs.animation.values.kias / 200), -1, 1);
}
movingAvg = function (array, countBefore, countAfter) {
  if (countAfter == undefined) countAfter = 0;
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const subArr = array.slice(Math.max(i - countBefore, 0), Math.min(i + countAfter + 1, array.length));
    const avg = subArr.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0) / subArr.length;
    result.push(avg);
  }
  return result;
}
assignControls = function () {
   if (geofs.aircraft.instance.id == 7 && geofs.addonAircraft.isMiG21 != 1) {
geofs.aircraft.instance.definition.parts[7].animations[0].value = "outerAveragePitch"
geofs.aircraft.instance.definition.parts[8].animations[0].value = "outerAveragePitch"
geofs.aircraft.instance.definition.parts[7].animations[1].value = "outerAverageRoll"
geofs.aircraft.instance.definition.parts[8].animations[1].value = "outerAverageRoll"
   }
	if (geofs.aircraft.instance.id == 2857) {
geofs.aircraft.instance.definition.parts[14].animations[0].value = "outerAveragePitch"
geofs.aircraft.instance.definition.parts[15].animations[0].value = "outerAveragePitch"
geofs.aircraft.instance.definition.parts[14].animations[1].value = "outerAverageRoll"
geofs.aircraft.instance.definition.parts[15].animations[1].value = "outerAverageRoll"
	}
}
FBWint = setInterval(function(){
  computePitch();
  pushInputs();
  computeOutputs();
  assignControls();
}, 100)
}
