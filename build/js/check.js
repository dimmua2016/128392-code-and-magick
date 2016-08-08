'use strict';

function getMessage(a, b) {
  if (typeof(a) === 'boolean') {
    if (a) {
      return 'Я попал в ' + b;
    } else {
      return 'Я никуда не попал';
    }
  } else if (typeof(a) === 'number') {
    return 'Я прыгнул на ' + (a * 100) + ' сантиметров';
  } else if ((typeof(a) === 'object') && (typeof(b) !== 'object')) {
    var numberOfSteps = 0;
    for (var i = 0; i < a.length; i++) {
      numberOfSteps += a[i];
    }
    return 'Я прошёл ' + numberOfSteps + ' шагов';
  } else if ((typeof(a) === 'object') && (typeof(b) === 'object')) {
    var distancePath = 0;
    for (var i = 0; i < a.length; i++) {
      distancePath += a[i] * b[i];
    }
    return 'Я прошёл ' + distancePath + ' метров';
  } else {
    alert('Нет такого действия в игре =)');
  }
}
