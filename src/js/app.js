/* Remove for test */
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
/* End Remove for test */

function Count (min, max) {
  this.min = min || 0
  this.max = max || 100
  this.value = 0
}

Count.prototype.setField = function (field, value) {
  $(field).val(value.toFixed(1))
}

Count.prototype.checkValue = function (value) {
  const data = value

  if(data >= this.max) {
    this.value = this.max
  }
  else if(data <= this.min) {
    this.value = this.min
  }
  else {
    this.value = data
  }

  return this.value
}

function App() {
  this.user = {}
  this.balance = {}
  this.odds = []
  this.stakes = []
  this.bets = []
  this.bet = [
    {
      value: 1.0,
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

App.prototype.getTime = function(time) {
  const date = new Date(time * 1000);
  const hours = date.getHours();
  const minutes = `0${date.getMinutes()}`;
  // const seconds = `0${date.getSeconds()}`;

  return `${hours}:${minutes.substr(-2)}`;
}

App.prototype.getConfig = function() {
  const self = this

  $.ajax({
    url: './json/config.json',
    method: "GET",
    dataType: "json",
    success (data) {
      self.user = data;
      self.init()
      self.initBetControl()
    },
    error(xhr, status, error){
      console.log(xhr.responseText, status, error);
    }
  });
}

App.prototype.getBalance = function() {
  const self = this

  $.ajax({
    url: './json/balance.json',
    method: "GET",
    dataType: "json",
    success (data) {
      self.balance = data;
      self.changeBalance()
    },
    error(xhr, status, error){
      console.log(xhr.responseText, status, error);
    }
  });
}

App.prototype.getOdds = function() {
  const self = this

  $.ajax({
    url: './json/odds.json',
    method: "GET",
    dataType: "json",
    success (data) {
      self.odds = data;
      self.changeOdds()
    },
    error(xhr, status, error){
      console.log(xhr.responseText, status, error);
    }
  });
}

App.prototype.getStakes = function() {
  const self = this

  $.ajax({
    url: './json/stakes.json',
    method: "GET",
    dataType: "json",
    success (data) {
      self.stakes = data;
      self.changeStakes()
    },
    error(xhr, status, error){
      console.log(xhr.responseText, status, error);
    }
  });
}

App.prototype.getBets = function() {
  const self = this

  $.ajax({
    url: './json/bets.json',
    method: "GET",
    dataType: "json",
    success (data) {
      self.bets = data;
      self.changeBets()
    },
    error(xhr, status, error){
      console.log(xhr.responseText, status, error);
    }
  });
}

App.prototype.init = function() {
  const user = JSON.parse(localStorage.getItem('user')) || undefined

  if (user) {
    this.user = user
  }

  localStorage.setItem('user', JSON.stringify(this.user))

  console.log(this.user)

  $('.js-app-photo').attr('src', this.user.Avatar)
  $('.js-app-nickname').text(this.user.Username)
  $('#sound').prop("checked", this.user.Sound === 'On')
  $('#music').prop("checked", this.user.Music === 'On')
  $('#animation').prop("checked", this.user.Animation === 'On')
}

App.prototype.changeBets = function() {
  const self = this
  let html = '';

  $.each(this.bets, function (index, item) {
    html += `<div class="bet-item bet-item--custom bet-item--${item.Status.toLowerCase()}">
              <div class="bet-item__cell">
                <div class="bet-item__date">
                  <span>${self.getTime(item.Start)}</span>
                </div>
              </div>
              <div class="bet-item__cell">
                <div class="bet-item__value">
                  <span>${item.Stake}</span>
                  <span>${item.Symbol || item.Currency}</span>
                </div>
              </div>
              <div class="bet-item__cell">
                <div class="bet-item__multiply" style="background-color: ${item.Color}">
                  <span>${item.Odds}</span>
                  <span>x</span>
                </div>
              </div>
              <div class="bet-item__cell">`
                if(item.CashOut) {
                  html += `<div class="bet-item__cash">
                             <span>${item.CashOut || '-'}</span>
                             <span>${item.Symbol || item.Currency}</span>
                           </div>`
                }
                else {
                  html += `-`
                }
    html += `</div>
              <div class="bet-item__cell">
                <div class="fairness js-bet-multiply">
                  <div class="fairness__alert">Check fairness</div>
                    <div class="fairness__icon">
                      <img src="./img/icon/fairness.svg" class="img">
                    </div>
                  </div>
                </div>
              </div>
            </div>`
  })

  $('.js-bet-table-my-bets').html(html)
}

App.prototype.changeStakes = function() {
  let html = '';

  $.each(this.stakes, function (index, item) {
    html += `<div class="bet-item bet-item--${item.Status.toLowerCase()}">
              <div class="bet-item__cell">
                <div class="bet-item__logo">`
                  if(item.Avatar) {
                    html += `<img class="img" src="${item.Avatar}">`
                  }
      html += `</div>
              </div>
              <div class="bet-item__cell">
                <div class="bet-item__name">${item.Username}</div>
              </div>
              <div class="bet-item__cell">
                <div class="bet-item__value">
                  <span>${item.Stake}</span>
                  <span>${item.Symbol || item.Currency}</span>
                </div>
              </div>
              <div class="bet-item__cell">`
                if(item.Odds) {
                  html += `<div class="bet-item__multiply" style="background-color: ${item.Color}">
                            <span>${item.Odds}</span>
                            <span>x</span>
                          </div>`
                }
                else {
                  html += `-`
                }
      html += `</div>
              <div class="bet-item__cell">`
                if(item.CashOut) {
                  html += `<div class="bet-item__cash">
                            <span>${item.CashOut || '-'}</span>
                            <span>${item.Symbol || item.Currency}</span>
                          </div>`
                }
                else {
                  html += `-`
                }
      html += `</div>
            </div>`
      })

  $('.js-bet-table-stakes').html(html)
  $('.total-bets-value').html(this.stakes.length)
}

App.prototype.htmlOdd = function(data) {
  return `<div class="bet-multiply js-bet-multiply" style="background-color: ${data.Color}">
             <span>${data.Odds}</span>
             <span>x</span>
          </div>`
}

App.prototype.changeOdds = function() {
  let html = ''
  const self = this

  $.each(this.odds, function (index, item) {
    html += `<div class="bet-multiplies__item">
               ${self.htmlOdd(item)}
            </div>`
  })

  $('.js-bet-multiplies-list').html(html)
}

App.prototype.updateOdd = function() {
  const max = 100
  const {length} = $('.js-bet-multiplies-list .js-bet-multiply')

  const item = {
    "Start": "1666196065",
    "Round": "786d8310663cf442aa3a58358545351c",
    "Odds": Math.random().toFixed(1),
    "Color": `#${genRanHex(6)}`
  }

  if (length >= max) {
    $('.js-bet-multiplies-list').children().last().remove()
  }

  $('.js-bet-multiplies-list').prepend(
    `<div class="bet-multiplies__item">
        ${this.htmlOdd(item)}
    </div>`
  )
}

App.prototype.changeBalance = function(item) {
  const balance = parseFloat(item ? item.FreBet : this.balance.FreBet) + parseFloat(item ? item.Balance :this.balance.Balance)
  const currency = item ? (item.Symbol || item.Currency) : (this.balance.Symbol || this.balance.Currency)

  $('.js-app-deposit-value').text(balance.toFixed(1))
  $('.js-app-deposit-currency').text(currency)
}

App.prototype.changeOption = function(el, id) {
  if ($(el).is(':checked')) {
    this.user[id] = 'On'
    $(el).prop("checked", true)
  }
  else {
    this.user[id] = 'Off'
    $(el).prop("checked", false)
  }

  localStorage.setItem('user', JSON.stringify(this.user))
}

App.prototype.resetPopupAutoplay = function(id) {
  const parent = $('.js-popup-autoplay').find('.js-bet-autoplay')
  const index = id || parent.attr('data-index')
  const toggles = parent.find('.js-switch')
  const counts = parent.find('.js-bet-count')
  const value = 0

  if (this.bet[index].auto) {
    parent.find('.js-bet-autoplay-button').removeClass('bet-autoplay__button--active')

    $.each(counts, function (idx, el) {
      $(el).addClass('bet-count--disabled')
      $(el).find('input').val(value.toFixed(1))
      $(this).prop("checked", true)
    })

    $.each(toggles, function (idx, el) {
      $(el).find('input').prop("checked", false)
    })

    this.bet[index].auto.options = {
      rounds: null,
      decreases: null,
      increases: null,
      exceeds: null
    }
  }
}

App.prototype.setAutoBetControl = function(index) {
  const $parent = $(`.js-bet-control[data-index="${index}"]`)

  $parent.addClass('bet-control--auto-play')
  $parent.addClass('bet-control--set')

  $parent.find('.js-bet-control-bet').html('Cancel')
  $parent.find('.js-bet-control-button[data-value="auto"]').html(`Stop (${this.bet[index].auto.options.rounds})`)
}

App.prototype.setBetControl = function(index) {
  const $parent = $(`.js-bet-control[data-index="${index}"]`)

  if ($parent.hasClass('bet-control--set')) {
    $parent.removeClass('bet-control--set')
    $parent.find('.js-bet-control-bet').html('Bet')

    $parent.removeClass('bet-control--auto-play')
    $parent.removeClass('bet-control--set')
    $parent.find('.js-bet-control-button[data-value="auto"]').html('Auto play')

    this.resetPopupAutoplay(index)
    console.log(this.bet[index])
  }
  else {
    $parent.addClass('bet-control--set')
    $parent.find('.js-bet-control-bet').html('Cancel')
  }
}

App.prototype.htmlBetControl = function(item, index) {
  const self = this
  let html = ''

  html += `
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
              <input class="bet-count__field js-bet-count-field" type="number" step="${this.user.Step}" value="${item.value.toFixed(1)}">
              <div class="bet-count__options">
                <button class="bet-count__button js-bet-count-button" data-value="decrement">
                  <img src="./img/icon/count-minus.svg" alt="" class="img">
                </button>
                <button class="bet-count__button js-bet-count-button" data-value="increment">
                  <img src="./img/icon/count-plus.svg" alt="" class="img">
                </button>
              </div>
            </div>
            <div class="bet-control__currency">`
            $.each(self.user.QuickBet.split(','), function (idx, el) {
              html += `<button class="button button--primary bet-control__button js-bet-control-button" type="button" data-value="${el}">
                        <span>${el}</span>
                        <span>${self.user.Symbol || self.user.Currency}</span>
                      </button>`
            })
  html += `</div>
          </div>
          <div class="bet-control__cell">
            <button class="bet-control__bet js-bet-control-bet" type="button">Bet</button>
          </div>
        </div>
        <div class="bet-control__bottom js-bet-control-bottom">
          <button class="button button--primary bet-control__button bet-control__button--auto js-bet-control-button" type="button" data-value="auto">
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
          <div class="bet-control__counts ${item.auto.out ? '' : 'bet-control__counts--disabled'} js-bet-control-counts">
            <input class="bet-control__field js-bet-control-field" type="number" step="${this.user.Step}" value="${item.auto.value.toFixed(1)}">
          </div>
        </div>
      </div>
    </div>`

  return html
}

App.prototype.actionBetControl = function() {
  if (this.bet.length !== 2) {
    this.bet.push({
      value: 1.0,
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

App.prototype.htmlPopupAutoplay = function(index) {
  return `<div class="bet-autoplay js-bet-autoplay" data-index="${index}">
           <div class="bet-autoplay__alert">
             <div class="alert alert--danger js-alert"></div>
           </div>
           <div class="bet-autoplay__container">
             <div class="bet-autoplay__text">Number of Rounds:</div>
             <div class="bet-autoplay__wrapper">
               <button class="button button--primary bet-autoplay__button js-bet-autoplay-button" type="button" data-value="10">10</button>
               <button class="button button--primary bet-autoplay__button js-bet-autoplay-button" type="button" data-value="20">20</button>
               <button class="button button--primary bet-autoplay__button js-bet-autoplay-button" type="button" data-value="50">50</button>
               <button class="button button--primary bet-autoplay__button js-bet-autoplay-button" type="button" data-value="100">100</button>
             </div>
           </div>
           <div class="bet-autoplay__container bet-autoplay__container--custom">
             <div class="switch js-switch">
               <input class="switch__input" id="decreases" type="checkbox" name="decreases" ${this.bet[index].auto.options.decreases && 'checked="true"'}>
               <label class="switch__label" for="decreases">
                 <span class="switch__toggle"></span>
               </label>
             </div>
             <span>Stop if cash decreases by</span>
             <div class="bet-count ${this.bet[index].auto.options.decreases ? '' : 'bet-count--disabled'} js-bet-count" id="bet-count-decreases" data-value="decreases">
               <input class="bet-count__field js-bet-count-field" type="number" step="${this.user.Step}" value="${this.bet[index].auto.options.decreases ? this.bet[index].auto.options.decreases.toFixed(1) : (0).toFixed(1)}">
               <div class="bet-count__options">
                 <button class="bet-count__button js-bet-count-button" data-value="decrement"">
                   <img src="./img/icon/count-minus.svg" alt="" class="img">
                 </button>
                 <button class="bet-count__button js-bet-count-button" data-value="increment">
                    <img src="./img/icon/count-plus.svg" alt="" class="img">
                 </button>
               </div>
             </div>
             <span>${this.user.Symbol || this.user.Currency}</span>
           </div>
           <div class="bet-autoplay__container bet-autoplay__container--custom">
             <div class="switch js-switch">
               <input class="switch__input" id="increases" type="checkbox" name="increases" ${this.bet[index].auto.options.increases && 'checked="true"'}>
               <label class="switch__label" for="increases">
                 <span class="switch__toggle"></span>
               </label>
              </div>
             <span>Stop if cash increases by</span>
             <div class="bet-count ${this.bet[index].auto.options.increases ? '' : 'bet-count--disabled'} js-bet-count" id="bet-count-increases" data-value="increases">
               <input class="bet-count__field js-bet-count-field" type="number" step="${this.user.Step}" value="${this.bet[index].auto.options.increases ? this.bet[index].auto.options.increases.toFixed(1) : (0).toFixed(1)}">
               <div class="bet-count__options">
                 <button class="bet-count__button js-bet-count-button" data-value="decrement">
                    <img src="./img/icon/count-minus.svg" alt="" class="img">
                 </button>
                 <button class="bet-count__button js-bet-count-button" data-value="increment">
                    <img src="./img/icon/count-plus.svg" alt="" class="img">
                 </button>
               </div>
             </div>
             <span>${this.user.Symbol || this.user.Currency}</span>
           </div>
           <div class="bet-autoplay__container bet-autoplay__container--custom">
             <div class="switch js-switch">
               <input class="switch__input" id="exceeds" type="checkbox" name="exceeds" ${this.bet[index].auto.options.exceeds && 'checked="true"'}>
               <label class="switch__label" for="exceeds">
                 <span class="switch__toggle"></span>
               </label>
             </div>
             <span>Stop if single with exceeds</span>
             <div class="bet-count ${this.bet[index].auto.options.exceeds ? '' : 'bet-count--disabled' } js-bet-count" id="bet-count-exceeds" data-value="exceeds">
               <input class="bet-count__field js-bet-count-field" type="number" step="${this.user.Step}" value="${this.bet[index].auto.options.exceeds ? this.bet[index].auto.options.exceeds.toFixed(1) : (0).toFixed(1)}">
               <div class="bet-count__options">
                 <button class="bet-count__button js-bet-count-button" data-value="decrement">
                   <img src="./img/icon/count-minus.svg" alt="" class="img">
                 </button>
                 <button class="bet-count__button js-bet-count-button" data-value="increment">
                    <img src="./img/icon/count-plus.svg" alt="" class="img">
                 </button>
               </div>
             </div>
             <span>${this.user.Symbol || this.user.Currency}</span>
           </div>
        </div>`
}

App.prototype.initPopupAutoplay = function(index) {
  $('.js-popup-autoplay .js-popup-list').html(this.htmlPopupAutoplay(index))
}

const app = new App();

app.getBalance()
app.getConfig()
app.getOdds()
app.getStakes()
app.getBets()

/* Test events */
setInterval(function() {
  app.updateOdd()
  app.changeBalance(
    {
      "UserID":69041,
      "Currency":"USD",
      "Symbol":"$",
      "Balance": Math.random().toFixed(2),
      "FreBet": Math.random().toFixed(2)
    }
  )
}, 2000);
/* End Test events */



$('.js-provably-fair').on('click', function() {
  $('.js-popup-provably-fair').addClass('popup--active')
})

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
  app.changeOption($(this), 'Sound')
})

$('#music:checkbox').change(function() {
  app.changeOption($(this), 'Music')
})

$('#animation:checkbox').change(function() {
  app.changeOption($(this), 'Animation')
})

$('.js-navigation-tab-item').on('click', function() {
  const parent = $(this).closest('.js-navigation')
  const navigation = $(this).closest('.js-navigation-tab')
  const value = $(this).attr('data-href')

  navigation.find('.js-navigation-tab-item').removeClass('navigation-tab__item--active')
  $(this).addClass('navigation-tab__item--active')

  parent.children('.js-navigation-body').removeClass('navigation-body--active')
  parent.children(`.js-navigation-body[data-tab="${value}"]`).addClass('navigation-body--active')
})

$('.js-bet-multiplies-button').on('click', function() {
  $(this).closest('.js-bet-multiplies').toggleClass('bet-multiplies--active')
})

$('body').on('click', '.js-bet-multiply', function() {
  $('.js-popup-bet').toggleClass('popup--active')
})


/* Autoplay bet control */
$('body').on('click', '.js-bet-control .js-bet-control-link', function() {
  const parent = $(this).closest('.js-bet-control')

  parent.toggleClass('bet-control--auto')
  parent.find('.bet-control__link').removeClass('bet-control__link--active')
  $(this).addClass('bet-control__link--active')
})

$('body').on('click', '.js-bet-control .js-bet-control-action', function() {
  app.actionBetControl()
});

$('body').on('click', '.js-bet-control .js-bet-control-button', function() {
  const count = new Count(parseFloat(app.MinBet), parseFloat(app.MaxBet))

  const parent = $(this).closest('.js-bet-control')
  const index = parent.attr('data-index')
  const value = $(this).attr('data-value')
  const field = parent.find('.js-bet-count-field')

  if (value !== 'auto') {
    app.bet[index].value = count.checkValue(app.bet[index].value + parseInt(value, 10))

    count.setField(field, app.bet[index].value)
  }
  else {
    $('.js-popup-autoplay').addClass('popup--active')
    app.initPopupAutoplay(index)
  }
});

$('body').on('change', '.js-bet-control .js-bet-count-field', function() {
  const count = new Count(parseFloat(app.MinBet), parseFloat(app.MaxBet))

  const parent = $(this).closest('.js-bet-control')
  const index = parent.attr('data-index')

  app.bet[index].value = count.checkValue(parseFloat($(this).val()))

  count.setField($(this), app.bet[index].value)
})

$('body').on('click', '.js-bet-control .js-bet-count-button', function() {
  const count = new Count(parseFloat(app.MinBet), parseFloat(app.MaxBet))

  const parent = $(this).closest('.js-bet-control')
  const index = parent.attr('data-index')
  const value = $(this).attr('data-value')
  const field = parent.find('.js-bet-count-field')

  if (value === 'increment') {
    app.bet[index].value = count.checkValue(app.bet[index].value + parseFloat(app.user.Step))
  }
  else {
    app.bet[index].value = count.checkValue(app.bet[index].value - parseFloat(app.user.Step))
  }

  count.setField(field, app.bet[index].value)
});

$('body').on('click', '.js-bet-control .js-bet-control-bet', function() {
  const parent = $(this).closest('.js-bet-control')
  const index = parent.attr('data-index')

  app.setBetControl(index)
})
/* End bet control events */


/* Autoplay events */
$('body').on('change', '.js-bet-control input[type="checkbox"]:checkbox', function() {
  const parent = $(this).closest('.js-bet-control')
  const index = parent.attr('data-index')

  if ($(this).is(':checked')) {
    $(this).prop("checked", true)
    app.bet[index].auto.out = true
  }
  else {
    $(this).prop("checked", false)
    app.bet[index].auto.out = false
  }

  parent.find('.js-bet-control-counts').toggleClass('bet-control__counts--disabled')
})

$('body').on('change', '.js-bet-control .js-bet-control-field', function() {
  const count = new Count(parseFloat(app.MinBet), parseFloat(app.MaxBet))

  const parent = $(this).closest('.js-bet-control')
  const index = parent.attr('data-index')

  app.bet[index].auto.value = count.checkValue(parseFloat($(this).val()))

  count.setField($(this), app.bet[index].auto.value)
});
/* End Autoplay events */


/* Autoplay popup events */
$('body').on('click', '.js-bet-autoplay-button', function() {
  const parent = $(this).closest('.js-bet-autoplay')
  const index = parent.attr('data-index')

  parent.find('.bet-autoplay__button').removeClass('bet-autoplay__button--active')
  $(this).addClass('bet-autoplay__button--active')

  app.bet[index].auto.options.rounds = parseInt($(this).attr('data-value'), 10)
})

$('body').on('change', '.js-bet-autoplay input[type="checkbox"]:checkbox', function() {
  const parent = $(this).closest('.js-bet-autoplay')
  const $counts = $(`#bet-count-${$(this).attr('name')}`)
  const field = $counts.find('input')
  const index = parent.attr('data-index')

  if ($(this).is(':checked')) {
    $(this).prop("checked", true)
    app.bet[index].auto.options[$(this).attr('name')] = 0.0
    app.bet[index].auto.out = true
  }
  else {
    $(this).prop("checked", false)
    app.bet[index].auto.options[$(this).attr('name')] = null
  }

  $counts.toggleClass('bet-count--disabled')
  field.val((0).toFixed(1))
})

$('body').on('click', '.js-bet-autoplay .js-bet-count-button', function() {
  const count = new Count(parseFloat(app.MinBet), parseFloat(app.MaxBet))

  const parent = $(this).closest('.js-bet-autoplay')
  const index = parent.attr('data-index')
  const value = $(this).closest('.js-bet-count').attr('data-value')
  const $field = $(`#bet-count-${value}`).find('input')

  if ($(this).attr('data-value') === 'increment') {
    app.bet[index].auto.options[value] = count.checkValue(app.bet[index].auto.options[value] + parseFloat(app.user.Step))
  }
  else {
    app.bet[index].auto.options[value] = count.checkValue(app.bet[index].auto.options[value] - parseFloat(app.user.Step))
  }

  count.setField($field, app.bet[index].auto.options[value])
})

$('body').on('change', '.js-bet-autoplay .js-bet-count-field', function() {
  const count = new Count(parseFloat(app.MinBet), parseFloat(app.MaxBet))

  const parent = $(this).closest('.js-bet-autoplay')
  const value = $(this).closest('.js-bet-count').attr('data-value')
  const index = parent.attr('data-index')

  app.bet[index].auto.options[value] = count.checkValue(parseFloat($(this).val()))

  count.setField($(this), app.bet[index].auto.options[value])
})

$('body').on('click', '.js-bet-auto-reset', function() {
  app.resetPopupAutoplay()
})

$('body').on('click', '.js-bet-auto-start', function() {
  const parent = $(this).closest('.js-popup').find('.js-bet-autoplay')
  const index = parent.attr('data-index')
  const alert = parent.find('.js-alert')

  if (app.bet[index].auto.options.rounds === null) {
    alert.html('Please, set number of rounds')
    alert.show()
  }
  else if (app.bet[index].auto.options.decreases === null && app.bet[index].auto.options.increases === null && app.bet[index].auto.options.exceeds === null) {
    alert.html('Please, specify decrease or exceed stop point')
    alert.show()
  }
  else if (app.bet[index].auto.options.decreases === 0 || app.bet[index].auto.options.increases === 0 || app.bet[index].auto.options.exceeds === 0) {
    alert.html('PleaseCan\'t set 0.00 as stop point ')
    alert.show()
  }
  else {
    alert.hide()
    $('.js-popup-autoplay').removeClass('popup--active')
    app.setAutoBetControl(index)
  }
})
/* End Autoplay popup events */
