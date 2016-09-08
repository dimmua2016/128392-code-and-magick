'use strict';

define(function() {
  return function(url, params, callback) {
    var TIMEOUT = 5000;
    var xhr = new XMLHttpRequest();

    var request = url +
      '?from=' + params.from +
      '&to=' + params.to +
      '&filter=' + params.filter;

    xhr.timeout = TIMEOUT;

    xhr.ontimeout = function() {
      console.warn('Запрос превысил максимальное время ' + TIMEOUT + 'мс, url: ' + request);
    };

    xhr.onerror = function() {
      console.warn('Ответ сервера: ' + xhr.status + ', Текст ошибки: ' + xhr.statusText + ', url: ' + request);
    };

    xhr.onload = function(evt) {
      var responseData = evt.target;
      if (responseData.readyState === 4 && responseData.status === 200) {
        try {
          var loadedData = JSON.parse(responseData.response);
          callback(loadedData);
        } catch (err) {
          console.warn('Ошибка парсинга данных: ' + err.message);
        }
      } else {
        xhr.onerror();
      }
    };

    xhr.open('GET', request);
    xhr.send();
  };
});
