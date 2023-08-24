function addFBW() {
geofs.animation.values.cobraMode = 0;
document.addEventListener("keydown", function(e) {
	if (e.keyCode == 222) {
geofs.animation.values.cobraMode == 0 ? geofs.animation.values.cobraMode = 1 : geofs.animation.values.cobraMode = 0
   }
})


//Fighter jet FBW
//Average pull rate: (geofs.animation.values.pitchrate + geofs.animation.values.turnrate) / 2
//clearInterval(FBWint)
let tiltToHold = 0;
let deadZone = 0.005;
let rollTohold = 0;
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
   geofs.animation.values.computedPitch = geofs.animation.values.computedPitch - 0.02
} else if (normalizedG > 1 && geofs.animation.values.cobraMode == 0) {
   geofs.animation.values.computedPitch = geofs.animation.values.computedPitch - 0.02
} else {
//This adjust sensitivity and trim automatically, to keep level flight at centered controls and max AoA/9G at maximum up elevator regardless of airspeed.
   geofs.animation.values.computedPitch = (input / (geofs.animation.values.kias/80)) - (geofs.animation.values.kias/6000)
}
   }
}
computeRoll = function() {
   inputR = geofs.animation.values.roll
   if (geofs.pause == 0) {
geofs.animation.values.computedRoll = inputR
   }
}
let rollInputs = [0, 0, 0, 0, 0, 0, 0];
let pitchInputs = [0, 0, 0, 0, 0, 0, 0];
geofs.animation.values.averagePitch = null;
geofs.animation.values.outerAveragePitch = null;
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
  geofs.animation.values.outerAverageRoll = clamp(geofs.animation.values.averageRoll, -1, 1);
  geofs.animation.values.outerAveragePitch = clamp(geofs.animation.values.averagePitch / 1, -1, 1);
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
//geofs.aircraft.instance.definition.parts[7].animations[1].value = "outerAverageRoll"
//geofs.aircraft.instance.definition.parts[8].animations[1].value = "outerAverageRoll"
   } else if (geofs.aircraft.instance.id == 7 && geofs.addonAircraft.isMiG21 == 1) {
geofs.aircraft.instance.definition.parts[7].animations[0].value = "pitch"
geofs.aircraft.instance.definition.parts[8].animations[0].value = "pitch"
//geofs.aircraft.instance.definition.parts[7].animations[1].value = "roll"
//geofs.aircraft.instance.definition.parts[8].animations[1].value = "roll"
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
