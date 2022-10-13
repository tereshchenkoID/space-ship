function App() {
  this.user = {}
  this.bet = [
    {
      value: 10.0,
      auto: {
        out: false,
        value: 1.10,
        options: {
          rounds: null,
          decreases: null,
          increases: null,
          exceeds: null,
        },
      },
    }
  ]
}

App.prototype.init = function() {
  const user = JSON.parse(localStorage.getItem('user')) || undefined

  if (user) {
    this.user = user
  }
  else {
    this.user = {
      photo:      'https://aviator-demo.spribegaming.com/assets/static/avatars/v2/av-1.png?v=4.1.1',
      nickname:   'd****5',
      sound:      true,
      music:      true,
      animation:  true,
      deposit:    '0.00'
    }

    localStorage.setItem('user', JSON.stringify(this.user))
  }

  $('.js-app-photo').attr('src', this.user.photo)
  $('.js-app-nickname').text(this.user.nickname)
  $('.js-app-deposit-value').text(this.user.deposit)

  $('#sound').prop("checked", this.user.sound)
  $('#music').prop("checked", this.user.music)
  $('#animation').prop("checked", this.user.animation)
}

App.prototype.changeDeposit = function(value) {
  this.user.deposit = value
  $('.js-app-photo').attr('src', this.user.deposit)

  localStorage.setItem('user', JSON.stringify(this.user))
  this.init()
}

App.prototype.changeAvatar = function(src) {
  this.user.photo = src
  $('.js-app-photo').attr('src', this.user.photo)

  localStorage.setItem('user', JSON.stringify(this.user))
  this.init()
}

App.prototype.changeOption = function(el, id) {
  if ($(el).is(':checked')) {
    this.user[id] = true
    $(el).prop("checked", true)
  }
  else {
    this.user[id] = false
    $(el).prop("checked", false)
  }

  localStorage.setItem('user', JSON.stringify(this.user))
  this.init()
}

App.prototype.htmlBetControl = function(item, index) {
  return `
    <div class="bet-control js-bet-control" data-index="${index}">
      <div class="bet-control__container">
        <a class="bet-control__remove js-bet-control-action"></a>
        <div class="bet-control__top js-bet-control-top">
          <div class="bet-control__tab">
            <button class="bet-control__link bet-control__link--active js-bet-control-link" type="button">Bet</button>
            <button class="bet-control__link js-bet-control-link" type="button">Auto</button>
          </div>
        </div>
        <div class="bet-control__center js-bet-control-center">
          <div class="bet-control__cell">
            <div class="bet-count js-bet-count">
              <input class="bet-count__field js-bet-count-field" type="number" value="${item.value.toFixed(1)}">
              <div class="bet-count__options">
                <button class="bet-count__button js-bet-count-button" data-value="decrement">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g transform="translate(-197.000000, -199.000000)" fill="#767B85" fill-rule="nonzero">
                        <g transform="translate(100.000000, 190.000000)">
                          <path d="M105,9 C109.4,9 113,12.6 113,17 C113,21.4 109.4,25 105,25 C100.6,25 97,21.4 97,17 C97,12.6 100.6,9 105,9 Z M109,17.8 L109,16.2 L101,16.2 L101,17.8 L109,17.8 Z"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </button>
                <button class="bet-count__button js-bet-count-button" data-value="increment">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g transform="translate(-216.000000, -199.000000)" fill="#767B85" fill-rule="nonzero">
                        <g transform="translate(100.000000, 190.000000)">
                          <path d="M124,9 C119.6,9 116,12.6 116,17 C116,21.4 119.6,25 124,25 C128.4,25 132,21.4 132,17 C132,12.6 128.4,9 124,9 Z M128,17.8 L124.8,17.8 L124.8,21 L123.2,21 L123.2,17.8 L120,17.8 L120,16.2 L123.2,16.2 L123.2,13 L124.8,13 L124.8,16.2 L128,16.2 L128,17.8 Z"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </button>
              </div>
            </div>
            <div class="bet-control__currency">
              <button class="button button--primary bet-control__button js-bet-control-button" type="button" data-value="1">
                <span>1</span>
                <span>$</span>
              </button>
              <button class="button button--primary bet-control__button js-bet-control-button" type="button" data-value="2">
                <span>2</span>
                <span>$</span>
              </button>
              <button class="button button--primary bet-control__button js-bet-control-button" type="button" data-value="5">
                <span>5</span>
                <span>$</span>
              </button>
              <button class="button button--primary bet-control__button js-bet-control-button" type="button" data-value="10">
                <span>10</span>
                <span>$</span>
              </button>
            </div>
          </div>
          <div class="bet-control__cell">
            <button class="bet-control__bet js-bet-control-bet" type="button">Bet</button>
          </div>
        </div>
        <div class="bet-control__bottom js-bet-control-bottom">
          <button class="button button--primary bet-control__button js-bet-control-button" type="button" data-value="auto">
            <span>AUTO PLAY</span>
          </button>
          <div class="bet-control__auto">
            <span class="bet-control__label">Auto Cash Out</span>
            <div class="switch js-switch">
              <input class="switch__input" id="auto-cash-${index}" type="checkbox" name="auto-cash" ${item.auto.out && 'checked="true"'}>
              <label class="switch__label" for="auto-cash-${index}">
                <span class="switch__toggle"></span>
              </label>
            </div>
          </div>
          <div class="bet-control__counts ${item.auto.out ? '' : 'bet-control__counts--disabled'}">
            <input class="bet-control__field js-bet-control-field" type="number" value="${item.auto.value.toFixed(1)}">
          </div>
        </div>
      </div>
    </div>`
}

App.prototype.actionBetControl = function() {
  if (this.bet.length !== 2) {
    this.bet.push({
      value: 1.0,
      auto: {
        out: false,
        value: 1.10,
        options: {
          rounds: 10,
          decreases: 0.2,
          increases: 0.2,
          exceeds: 0.2,
        },
      },
    })

    this.initBetControl()
  }
  else {
    this.bet.splice(1, 1)
    this.initBetControl()
  }
}

App.prototype.initBetControl = function() {
  let html = '';
      const self = this

  $.each(this.bet, function (index, item) {
    html += self.htmlBetControl(item, index)
  })

  $('.js-bet-controls').html(html)

  if (this.bet.length > 1) {
    $('.js-bet-controls').addClass('bet-controls--multiply')
  }
  else {
    $('.js-bet-controls').removeClass('bet-controls--multiply')
  }
}

const app = new App();

app.init()
app.initBetControl()


$('.js-toggle').on('click', function(){
  $(this).toggleClass('toggle--active')
  $('.js-menu').toggleClass('menu--active')
})

$('.js-menu-avatar').on('click', function() {
  $('.js-popup-avatar').addClass('popup--active')
  $('.js-toggle').toggleClass('toggle--active')
  $('.js-menu').toggleClass('menu--active')
})

$('.js-popup-close').on('click', function() {
  $(this).closest('.js-popup').removeClass('popup--active')
})

$('.js-avatar-logo').on('click', function() {
  $('.js-popup-avatar').removeClass('popup--active')
  $('.js-avatar-logo').removeClass('avatar-logo--active')
  $(this).addClass('avatar-logo--active')

  app.changeAvatar($(this).children('img').attr('src'))
})

$('#sound:checkbox').change(function() {
  app.changeOption($(this), 'sound')
})

$('#music:checkbox').change(function() {
  app.changeOption($(this), 'music')
})

$('#animation:checkbox').change(function() {
  app.changeOption($(this), 'animation')
})

$('.js-navigation-tab-item').on('click', function() {
  $('.js-navigation-tab-item').removeClass('navigation-tab__item--active')
  $(this).addClass('navigation-tab__item--active')
})

$('.js-bet-multiplies-button').on('click', function() {
  $(this).closest('.js-bet-multiplies').toggleClass('bet-multiplies--active')
})

$('body').on('click', '.js-bet-control-link', function() {
  const parent = $(this).closest('.js-bet-control')

  parent.toggleClass('bet-control--auto')
  parent.find('.bet-control__link').removeClass('bet-control__link--active')
  $(this).addClass('bet-control__link--active')
})

$('body').on('click', '.js-bet-control-action', function() {
  app.actionBetControl()
});

$('body').on('click', '.js-bet-control-button', function() {
  const parent = $(this).closest('.js-bet-control')
  const index = parent.attr('data-index')
  const value = $(this).attr('data-value')
  const field = parent.find('.js-bet-count-field')

  app.bet[index].value += parseInt(value, 10)
  field.val(app.bet[index].value.toFixed(1))
});


$('body').on('click', '.js-bet-count-button', function() {
  const parent = $(this).closest('.js-bet-control')
  const index = parent.attr('data-index')
  const value = $(this).attr('data-value')
  const field = parent.find('.js-bet-count-field')

  if (value === 'increment') {
    app.bet[index].value += 0.1
  }
  else {
    app.bet[index].value -= 0.1
  }

  field.val(app.bet[index].value.toFixed(1))
});

$('body').on('input', '.js-bet-count-field', function() {
  const parent = $(this).closest('.js-bet-control')
  const index = parent.attr('data-index')

  app.bet[index].value = parseInt($(this).val(), 10)

  $(this).val(app.bet[index].value)
});
