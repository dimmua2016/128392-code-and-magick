'use strict';

define(['./utils'], function(utils) {

  window.Game = (function() {
    /**
     * @const
     * @type {number}
     */
    var HEIGHT = 300;

    /**
     * @const
     * @type {number}
     */
    var WIDTH = 700;

    /**
     * ID уровней.
     * @enum {number}
     */
    var Level = {
      INTRO: 0,
      MOVE_LEFT: 1,
      MOVE_RIGHT: 2,
      LEVITATE: 3,
      HIT_THE_MARK: 4
    };

    /**
     * Порядок прохождения уровней.
     * @type {Array.<Level>}
     */
    var LevelSequence = [
      Level.INTRO
    ];

    /**
     * Начальный уровень.
     * @type {Level}
     */
    var INITIAL_LEVEL = LevelSequence[0];

    /**
     * Допустимые виды объектов на карте.
     * @enum {number}
     */
    var ObjectType = {
      ME: 0,
      FIREBALL: 1
    };

    /**
     * Допустимые состояния объектов.
     * @enum {number}
     */
    var ObjectState = {
      OK: 0,
      DISPOSED: 1
    };

    /**
     * Коды направлений.
     * @enum {number}
     */
    var Direction = {
      NULL: 0,
      LEFT: 1,
      RIGHT: 2,
      UP: 4,
      DOWN: 8
    };

    /**
     * Правила перерисовки объектов в зависимости от состояния игры.
     * @type {Object.<ObjectType, function(Object, Object, number): Object>}
     */
    var ObjectsBehaviour = {};

    /**
     * Обновление движения мага. Движение мага зависит от нажатых в данный момент
     * стрелок. Маг может двигаться одновременно по горизонтали и по вертикали.
     * На движение мага влияет его пересечение с препятствиями.
     * @param {Object} object
     * @param {Object} state
     * @param {number} timeframe
     */
    ObjectsBehaviour[ObjectType.ME] = function(object, state, timeframe) {
      // Пока зажата стрелка вверх, маг сначала поднимается, а потом левитирует
      // в воздухе на определенной высоте.
      // NB! Сложность заключается в том, что поведение описано в координатах
      // канваса, а не координатах, относительно нижней границы игры.
      if (state.keysPressed.UP && object.y > 0) {
        object.direction = object.direction & ~Direction.DOWN;
        object.direction = object.direction | Direction.UP;
        object.y -= object.speed * timeframe * 2;

        if (object.y < 0) {
          object.y = 0;
        }
      }

      // Если стрелка вверх не зажата, а маг находится в воздухе, он плавно
      // опускается на землю.
      if (!state.keysPressed.UP) {
        if (object.y < HEIGHT - object.height) {
          object.direction = object.direction & ~Direction.UP;
          object.direction = object.direction | Direction.DOWN;
          object.y += object.speed * timeframe / 3;
        } else {
          object.Direction = object.direction & ~Direction.DOWN;
        }
      }

      // Если зажата стрелка влево, маг перемещается влево.
      if (state.keysPressed.LEFT) {
        object.direction = object.direction & ~Direction.RIGHT;
        object.direction = object.direction | Direction.LEFT;
        object.x -= object.speed * timeframe;
      }

      // Если зажата стрелка вправо, маг перемещается вправо.
      if (state.keysPressed.RIGHT) {
        object.direction = object.direction & ~Direction.LEFT;
        object.direction = object.direction | Direction.RIGHT;
        object.x += object.speed * timeframe;
      }

      // Ограничения по перемещению по полю. Маг не может выйти за пределы поля.
      if (object.y < 0) {
        object.y = 0;
        object.Direction = object.direction & ~Direction.DOWN;
        object.Direction = object.direction & ~Direction.UP;
      }

      if (object.y > HEIGHT - object.height) {
        object.y = HEIGHT - object.height;
        object.Direction = object.direction & ~Direction.DOWN;
        object.Direction = object.direction & ~Direction.UP;
      }

      if (object.x < 0) {
        object.x = 0;
      }

      if (object.x > WIDTH - object.width) {
        object.x = WIDTH - object.width;
      }
    };

    /**
     * Обновление движения файрбола. Файрбол выпускается в определенном направлении
     * и после этого неуправляемо движется по прямой в заданном направлении. Если
     * он пролетает весь экран насквозь, он исчезает.
     * @param {Object} object
     * @param {Object} state
     * @param {number} timeframe
     */
    ObjectsBehaviour[ObjectType.FIREBALL] = function(object, state, timeframe) {
      if (object.direction & Direction.LEFT) {
        object.x -= object.speed * timeframe;
      }

      if (object.direction & Direction.RIGHT) {
        object.x += object.speed * timeframe;
      }

      if (object.x < 0 || object.x > WIDTH) {
        object.state = ObjectState.DISPOSED;
      }
    };

    /**
     * ID возможных ответов функций, проверяющих успех прохождения уровня.
     * CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
     * WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
     * нужно прервать.
     * @enum {number}
     */
    var Verdict = {
      CONTINUE: 0,
      WIN: 1,
      FAIL: 2,
      PAUSE: 3,
      INTRO: 4
    };

    /**
     * Правила завершения уровня. Ключами служат ID уровней, значениями функции
     * принимающие на вход состояние уровня и возвращающие true, если раунд
     * можно завершать или false если нет.
     * @type {Object.<Level, function(Object):boolean>}
     */
    var LevelsRules = {};

    /**
     * Уровень считается пройденным, если был выпущен файлболл и он улетел
     * за экран.
     * @param {Object} state
     * @return {Verdict}
     */
    LevelsRules[Level.INTRO] = function(state) {
      var fireballs = state.garbage.filter(function(object) {
        return object.type === ObjectType.FIREBALL;
      });

      return fireballs.length ? Verdict.WIN : Verdict.CONTINUE;
    };

    /**
     * Начальные условия для уровней.
     * @enum {Object.<Level, function>}
     */
    var LevelsInitialize = {};

    /**
     * Первый уровень.
     * @param {Object} state
     * @return {Object}
     */
    LevelsInitialize[Level.INTRO] = function(state) {
      state.objects.push(
        // Установка персонажа в начальное положение. Он стоит в крайнем левом
        // углу экрана, глядя вправо. Скорость перемещения персонажа на этом
        // уровне равна 2px за кадр.
        {
          direction: Direction.RIGHT,
          height: 84,
          speed: 2,
          sprite: 'img/wizard.gif',
          spriteReversed: 'img/wizard-reversed.gif',
          state: ObjectState.OK,
          type: ObjectType.ME,
          width: 61,
          x: WIDTH / 3,
          y: HEIGHT - 100
        }
      );

      return state;
    };

    /**
     * Конструктор объекта Game. Создает canvas, добавляет обработчики событий
     * и показывает приветственный экран.
     * @param {Element} container
     * @constructor
     */

    var THROTTLE_TIMEOUT = 100;
    var CLOUDS_SPEED = 0.2;
    var headerClouds = document.querySelector('.header-clouds');
    var demo = document.querySelector('.demo');
    //var lastCheck = Date.now();

    var Game = function(container) {
      this.container = container;
      this.canvas = document.createElement('canvas');
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight;
      this.container.appendChild(this.canvas);

      this.ctx = this.canvas.getContext('2d');

      this._onKeyDown = this._onKeyDown.bind(this);
      this._onKeyUp = this._onKeyUp.bind(this);
      this._pauseListener = this._pauseListener.bind(this);
      //this._onScroll = this._onScroll.bind(this);

      this.setDeactivated(false);
    };

    Game.prototype = {
      /**
       * Текущий уровень игры.
       * @type {Level}
       */
      level: INITIAL_LEVEL,

      _onScroll: function() {
        var currentScroll = window.pageYOffset;
        var headerCloudsBottom = headerClouds.getBoundingClientRect().bottom;
        if (headerCloudsBottom > 0) {
          headerClouds.style.backgroundPosition = (50 - currentScroll * CLOUDS_SPEED) + '% 0';
        }

        utils.throttle((function() {
          var demoBottom = demo.getBoundingClientRect().bottom;
          if (demoBottom <= 0) {
            this.setGameStatus(Verdict.PAUSE);
          }
        }), THROTTLE_TIMEOUT).bind(this)();

        // Это рабочий вариант. Чтобы он заработал нужно закометить вызов функции utils.throttle (строки 287-292),
        // а также раскоментировать lastCheck выше по коду (строка 268)
        // (function() {
        //   console.log('каждый скролл');
        //   if (Date.now() - lastCheck >= THROTTLE_TIMEOUT) {
        //     var demoBottom = demo.getBoundingClientRect().bottom;
        //     if (demoBottom <= 0) {
        //       this.setGameStatus(Verdict.PAUSE);
        //     }
        //     lastCheck = Date.now();
        //     console.log('троттлинг');
        //   }
        // }).bind(this)();
      },

      /** @param {boolean} deactivated */
      setDeactivated: function(deactivated) {
        if (this._deactivated === deactivated) {
          return;
        }

        this._deactivated = deactivated;

        if (deactivated) {
          this._removeGameListeners();
        } else {
          this._initializeGameListeners();
        }
      },

      /**
       * Состояние игры. Описывает местоположение всех объектов на игровой карте
       * и время проведенное на уровне и в игре.
       * @return {Object}
       */
      getInitialState: function() {
        return {
          // Статус игры. Если CONTINUE, то игра продолжается.
          currentStatus: Verdict.CONTINUE,

          // Объекты, удаленные на последнем кадре.
          garbage: [],

          // Время с момента отрисовки предыдущего кадра.
          lastUpdated: null,

          // Состояние нажатых клавиш.
          keysPressed: {
            ESC: false,
            LEFT: false,
            RIGHT: false,
            SPACE: false,
            UP: false
          },

          // Время начала прохождения уровня.
          levelStartTime: null,

          // Все объекты на карте.
          objects: [],

          // Время начала прохождения игры.
          startTime: null
        };
      },

      /**
       * Начальные проверки и запуск текущего уровня.
       * @param {Level=} level
       * @param {boolean=} restart
       */
      initializeLevelAndStart: function(level, restart) {
        level = typeof level === 'undefined' ? this.level : level;
        restart = typeof restart === 'undefined' ? true : restart;

        if (restart || !this.state) {
          // При перезапуске уровня, происходит полная перезапись состояния
          // игры из изначального состояния.
          this.state = this.getInitialState();
          this.state = LevelsInitialize[this.level](this.state);
        } else {
          // При продолжении уровня состояние сохраняется, кроме записи о том,
          // что состояние уровня изменилось с паузы на продолжение игры.
          this.state.currentStatus = Verdict.CONTINUE;
        }

        // Запись времени начала игры и времени начала уровня.
        this.state.levelStartTime = Date.now();
        if (!this.state.startTime) {
          this.state.startTime = this.state.levelStartTime;
        }

        this._preloadImagesForLevel(function() {
          // Предварительная отрисовка игрового экрана.
          this.render();

          // Установка обработчиков событий.
          this._initializeGameListeners();

          // Запуск игрового цикла.
          this.update();
        }.bind(this));
      },

      /**
       * Временная остановка игры.
       * @param {Verdict=} verdict
       */
      pauseLevel: function(verdict) {
        if (verdict) {
          this.state.currentStatus = verdict;
        }

        this.state.keysPressed.ESC = false;
        this.state.lastUpdated = null;

        this._removeGameListeners();
        window.addEventListener('keydown', this._pauseListener);

        this._drawPauseScreen();
      },

      /**
       * Обработчик событий клавиатуры во время паузы.
       * @param {KeyboardsEvent} evt
       * @private
       * @private
       */
      _pauseListener: function(evt) {
        if (evt.keyCode === 32 && !this._deactivated) {
          evt.preventDefault();
          var needToRestartTheGame = this.state.currentStatus === Verdict.WIN ||
            this.state.currentStatus === Verdict.FAIL;
          this.initializeLevelAndStart(this.level, needToRestartTheGame);

          window.removeEventListener('keydown', this._pauseListener);
        }
      },

      /**
       * Отрисовка экрана паузы.
       */
      _drawPauseScreen: function() {
        var paramRect = {
          top: 50,
          left: 200,
          width: 180,
          height: 150,
          padding: 10,
          fill: '#FFF',
          font: {
            name: 'PT Mono',
            size: 16,
            color: '#000',
            lineHeight: 1.2
          },
          shadow: {
            color: 'rgba(0,0,0,0.7)',
            blur: 5,
            offset: {
              x: 10,
              y: 10
            }
          }
        };

        function writeCanvas(text, rect, ctx, autoHeight) {
          var contentWidth = 0,
            contentHeight = 0,
            contentLeft = 0,
            contentTop = 0,
            lineHeight = 0,
            words = [],
            countLine = 0,
            line = '',
            testLine = '',
            testWidth = 0,
            n = 0,
            lines = [];

          ctx.save();
          contentWidth = rect.width - rect.padding * 2;
          ctx.font = rect.font.size + 'px "' + rect.font.name + '"';
          words = text.split(' ');

          // Вычисляю сколько строчек занимает текст и заношу готовые строки в массив lines
          for (n = 0; n < words.length; n++) {
            testLine = line + words[n] + ' ';
            testWidth = ctx.measureText(testLine).width;
            if (testWidth > contentWidth) {
              lines[lines.length] = line;
              line = words[n] + ' ';
            } else {
              line = testLine;
            }
          }
          lines[lines.length] = line;

          if (autoHeight) {
            rect.height = (lines.length * Math.round(rect.font.size * rect.font.lineHeight)) + (rect.padding * 2);
          }

          // Рисую прямоугольник с тенью
          ctx.save();
          ctx.shadowColor = rect.shadow.color;
          ctx.shadowBlur = rect.shadow.blur;
          ctx.shadowOffsetX = rect.shadow.offset.x;
          ctx.shadowOffsetY = rect.shadow.offset.y;
          ctx.fillStyle = rect.fill;
          ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
          ctx.restore();

          ctx.strokeStyle = rect.shadow.color;
          ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
          ctx.textBaseline = 'hanging';
          ctx.fillStyle = rect.font.color;

          // величина contentWidth - расчитывается чуть раньше
          contentHeight = rect.height - rect.padding * 2;
          contentLeft = rect.left + rect.padding;
          contentTop = rect.top + rect.padding;
          lineHeight = Math.round(rect.font.size * rect.font.lineHeight);
          countLine = Math.min(Math.floor(contentHeight / lineHeight), lines.length);

          // Вывод текста на канвас
          for (n = 0; n < countLine; n++) {
            ctx.fillText(lines[n], contentLeft, contentTop);
            contentTop += lineHeight;
          }
          ctx.restore();
        }

        switch (this.state.currentStatus) {
          case Verdict.WIN:
            writeCanvas('You have won! Поздравляем, вы выиграли!', paramRect, this.ctx, true);
            //console.log('you have won!');
            break;
          case Verdict.FAIL:
            writeCanvas('You have failed! Вы проиграли, очень жаль...', paramRect, this.ctx, true);
            //console.log('you have failed!');
            break;
          case Verdict.PAUSE:
            writeCanvas('Game is on pause! Игра поставленна на паузу! ', paramRect, this.ctx, false);
            //console.log('game is on pause!');
            break;
          case Verdict.INTRO:
            writeCanvas('Welcome to the game! Press Space to start. Добро пожаловать в игру! Нажмите пробел, чтобы начать.', paramRect, this.ctx, true);
            //console.log('welcome to the game! Press Space to start');
            break;
        }
      },

      /**
       * Предзагрузка необходимых изображений для уровня.
       * @param {function} callback
       * @private
       */
      _preloadImagesForLevel: function(callback) {
        if (typeof this._imagesArePreloaded === 'undefined') {
          this._imagesArePreloaded = [];
        }

        if (this._imagesArePreloaded[this.level]) {
          callback();
          return;
        }

        var levelImages = [];
        this.state.objects.forEach(function(object) {
          levelImages.push(object.sprite);

          if (object.spriteReversed) {
            levelImages.push(object.spriteReversed);
          }
        });

        var i = levelImages.length;
        var imagesToGo = levelImages.length;

        while (i-- > 0) {
          var image = new Image();
          image.src = levelImages[i];
          image.onload = function() {
            if (--imagesToGo === 0) {
              this._imagesArePreloaded[this.level] = true;
              callback();
            }
          }.bind(this);
        }
      },

      /**
       * Обновление статуса объектов на экране. Добавляет объекты, которые должны
       * появиться, выполняет проверку поведения всех объектов и удаляет те, которые
       * должны исчезнуть.
       * @param {number} delta Время, прошеднее с отрисовки прошлого кадра.
       */
      updateObjects: function(delta) {
        // Персонаж.
        var me = this.state.objects.filter(function(object) {
          return object.type === ObjectType.ME;
        })[0];

        // Добавляет на карту файрбол по нажатию на Shift.
        if (this.state.keysPressed.SHIFT) {
          this.state.objects.push({
            direction: me.direction,
            height: 24,
            speed: 5,
            sprite: 'img/fireball.gif',
            type: ObjectType.FIREBALL,
            width: 24,
            x: me.direction & Direction.RIGHT ? me.x + me.width : me.x - 24,
            y: me.y + me.height / 2
          });

          this.state.keysPressed.SHIFT = false;
        }

        this.state.garbage = [];

        // Убирает в garbage не используемые на карте объекты.
        var remainingObjects = this.state.objects.filter(function(object) {
          ObjectsBehaviour[object.type](object, this.state, delta);

          if (object.state === ObjectState.DISPOSED) {
            this.state.garbage.push(object);
            return false;
          }

          return true;
        }, this);

        this.state.objects = remainingObjects;
      },

      /**
       * Проверка статуса текущего уровня.
       */
      checkStatus: function() {
        // Нет нужны запускать проверку, нужно ли останавливать уровень, если
        // заранее известно, что да.
        if (this.state.currentStatus !== Verdict.CONTINUE) {
          return;
        }

        if (!this.commonRules) {
          /**
           * Проверки, не зависящие от уровня, но влияющие на его состояние.
           * @type {Array.<functions(Object):Verdict>}
           */
          this.commonRules = [
            /**
             * Если персонаж мертв, игра прекращается.
             * @param {Object} state
             * @return {Verdict}
             */
            function checkDeath(state) {
              var me = state.objects.filter(function(object) {
                return object.type === ObjectType.ME;
              })[0];

              return me.state === ObjectState.DISPOSED ?
                Verdict.FAIL :
                Verdict.CONTINUE;
            },

            /**
             * Если нажата клавиша Esc игра ставится на паузу.
             * @param {Object} state
             * @return {Verdict}
             */
            function checkKeys(state) {
              return state.keysPressed.ESC ? Verdict.PAUSE : Verdict.CONTINUE;
            },

            /**
             * Игра прекращается если игрок продолжает играть в нее два часа подряд.
             * @param {Object} state
             * @return {Verdict}
             */
            function checkTime(state) {
              return Date.now() - state.startTime > 3 * 60 * 1000 ?
                Verdict.FAIL :
                Verdict.CONTINUE;
            }
          ];
        }

        // Проверка всех правил влияющих на уровень. Запускаем цикл проверок
        // по всем универсальным проверкам и проверкам конкретного уровня.
        // Цикл продолжается до тех пор, пока какая-либо из проверок не вернет
        // любое другое состояние кроме CONTINUE или пока не пройдут все
        // проверки. После этого состояние сохраняется.
        var allChecks = this.commonRules.concat(LevelsRules[this.level]);
        var currentCheck = Verdict.CONTINUE;
        var currentRule;

        while (currentCheck === Verdict.CONTINUE && allChecks.length) {
          currentRule = allChecks.shift();
          currentCheck = currentRule(this.state);
        }

        this.state.currentStatus = currentCheck;
      },

      /**
       * Принудительная установка состояния игры. Используется для изменения
       * состояния игры от внешних условий, например, когда необходимо остановить
       * игру, если она находится вне области видимости и установить вводный
       * экран.
       * @param {Verdict} status
       */
      setGameStatus: function(status) {
        if (this.state.currentStatus !== status) {
          this.state.currentStatus = status;
        }
      },

      /**
       * Отрисовка всех объектов на экране.
       */
      render: function() {
        // Удаление всех отрисованных на странице элементов.
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // Выставление всех элементов, оставшихся в this.state.objects согласно
        // их координатам и направлению.
        this.state.objects.forEach(function(object) {
          if (object.sprite) {
            var image = new Image(object.width, object.height);
            image.src = (object.spriteReversed && object.direction & Direction.LEFT) ?
              object.spriteReversed :
              object.sprite;
            this.ctx.drawImage(image, object.x, object.y, object.width, object.height);
          }
        }, this);
      },

      /**
       * Основной игровой цикл. Сначала проверяет состояние всех объектов игры
       * и обновляет их согласно правилам их поведения, а затем запускает
       * проверку текущего раунда. Рекурсивно продолжается до тех пор, пока
       * проверка не вернет состояние FAIL, WIN или PAUSE.
       */
      update: function() {
        if (!this.state.lastUpdated) {
          this.state.lastUpdated = Date.now();
        }

        var delta = (Date.now() - this.state.lastUpdated) / 10;
        this.updateObjects(delta);
        this.checkStatus();

        switch (this.state.currentStatus) {
          case Verdict.CONTINUE:
            this.state.lastUpdated = Date.now();
            this.render();
            requestAnimationFrame(function() {
              this.update();
            }.bind(this));
            break;

          case Verdict.WIN:
          case Verdict.FAIL:
          case Verdict.PAUSE:
          case Verdict.INTRO:
            this.pauseLevel();
            break;
        }
      },

      /**
       * @param {KeyboardEvent} evt [description]
       * @private
       */
      _onKeyDown: function(evt) {
        switch (evt.keyCode) {
          case 37:
            this.state.keysPressed.LEFT = true;
            break;
          case 39:
            this.state.keysPressed.RIGHT = true;
            break;
          case 38:
            this.state.keysPressed.UP = true;
            break;
          case 27:
            this.state.keysPressed.ESC = true;
            break;
        }

        if (evt.shiftKey) {
          this.state.keysPressed.SHIFT = true;
        }
      },

      /**
       * @param {KeyboardEvent} evt [description]
       * @private
       */
      _onKeyUp: function(evt) {
        switch (evt.keyCode) {
          case 37:
            this.state.keysPressed.LEFT = false;
            break;
          case 39:
            this.state.keysPressed.RIGHT = false;
            break;
          case 38:
            this.state.keysPressed.UP = false;
            break;
          case 27:
            this.state.keysPressed.ESC = false;
            break;
        }

        if (evt.shiftKey) {
          this.state.keysPressed.SHIFT = false;
        }
      },

      /** @private */
      _initializeGameListeners: function() {
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
        window.addEventListener('scroll', this._onScroll);
      },

      /** @private */
      _removeGameListeners: function() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
        //window.removeEventListener('scroll', this._onScroll);
      }
    };

    Game.Verdict = Verdict;

    return Game;
  })();
});
