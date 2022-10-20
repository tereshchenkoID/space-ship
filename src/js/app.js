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
  else {
    localStorage.setItem('user', JSON.stringify(this.user))
  }

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
                <div class="bet-item__value">
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
                <a class="bet-item__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 26">
                    <defs>
                      <linearGradient id="linearGradient-1" x1="9.96556713%" y1="0%" x2="97.7427662%" y2="0%">
                        <stop stop-color="#57B314" offset="0%"></stop>
                        <stop stop-color="#1E9F04" offset="100%"></stop>
                      </linearGradient>
                    </defs>
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g transform="translate(-194.000000, -17.000000)" fill="url(#linearGradient-1)" fill-rule="nonzero">
                        <g transform="translate(178.000000, 12.000000)">
                          <g transform="translate(16.000000, 5.000000)">
                            <path id="Shape" d="M21.7627096,4.4808694 C18.1923977,3.50260039 14.6011033,1.97934503 11.3770526,0.0758206628 C11.2057973,-0.0252904483 10.9932865,-0.0252904483 10.8220819,0.0758206628 C7.50502924,2.03403119 4.10779727,3.47487719 0.436120858,4.4808694 C0.198927875,4.54579337 0.0345146199,4.76139571 0.0345146199,5.00735673 L0.0345146199,10.5847368 C0.0345146199,16.3282027 2.68413255,20.1299805 4.90695517,22.307848 C7.29996881,24.6526628 10.0874932,25.9493684 11.0995673,25.9493684 C12.11154,25.9493684 14.8990643,24.6526628 17.292078,22.307848 C19.5148499,20.1300312 22.1643158,16.3282534 22.1643158,10.5847368 L22.1643158,5.00730604 C22.1643158,4.76139571 21.9999025,4.54579337 21.7627096,4.4808694 Z M21.0726199,10.5846862 C21.0726199,15.9490487 18.6013021,19.4965536 16.5279922,21.528 C14.1747641,23.8337895 11.6587446,24.8575712 11.0995673,24.8575712 C10.5403899,24.8575712 8.02421832,23.8337895 5.67093957,21.528 C3.59768031,19.4965029 1.12626121,15.9490487 1.12626121,10.5846862 L1.12626121,5.42168421 C4.6374269,4.42476413 7.90734503,3.03348538 11.0996686,1.17836257 C14.212269,2.9842729 17.6453333,4.44473294 21.0726199,5.42148148 L21.0726199,10.5846862 Z"></path>
                            <path id="Shape" d="M6.26118519,5.36061209 C6.15069786,5.08008577 5.83378168,4.9422807 5.55320468,5.05281871 C4.57807797,5.43704094 3.57720468,5.79070175 2.57840936,6.10401949 C2.35079532,6.17548148 2.19591033,6.38631969 2.19591033,6.62483041 L2.19591033,8.73275634 C2.19591033,9.03421442 2.44035088,9.27860429 2.74175828,9.27860429 C3.04316569,9.27860429 3.28760624,9.03421442 3.28760624,8.73275634 L3.28760624,7.02375049 C4.18361793,6.73384795 5.07866667,6.41318129 5.95339181,6.06849123 C6.23391813,5.95805458 6.3717232,5.6411384 6.26118519,5.36061209 Z"></path>
                            <path id="Shape" d="M7.29809357,5.46415595 C7.37132943,5.46415595 7.44568031,5.44940741 7.51699025,5.4182885 L7.52702534,5.41392982 C7.80319298,5.29290058 7.92756725,4.971423 7.80653801,4.69535673 C7.68540741,4.41918908 7.36210526,4.29425731 7.08624172,4.41518519 L7.077423,4.41898635 C6.80110331,4.53966082 6.67632359,4.86088499 6.79699805,5.13710331 C6.88655361,5.34216374 7.08750877,5.46415595 7.29809357,5.46415595 Z"></path>
                            <path id="Shape" d="M17.6030643,17.6010877 C17.3508187,17.4362183 17.0125653,17.5071228 16.8474932,17.7594698 C16.3976881,18.4479376 15.8699844,19.1072125 15.2788265,19.7187953 C14.7926823,20.2216647 14.2658908,20.6903743 13.7130994,21.1117973 C13.473423,21.2945575 13.4273021,21.6370682 13.6100117,21.876846 C13.7175088,22.017692 13.8800468,22.0917895 14.04446,22.0917895 C14.1599142,22.0917895 14.27623,22.0553489 14.3750604,21.9799337 C14.9713372,21.5252632 15.5394854,21.019809 16.0636413,20.4776101 C16.7027953,19.8165107 17.2739844,19.1029045 17.7614464,18.3566082 C17.9264172,18.1042105 17.8554113,17.7659571 17.6030643,17.6010877 Z"></path>
                            <path id="Shape" d="M12.4454347,21.9678713 L12.4141131,21.9863197 C12.1532515,22.1374035 12.0641014,22.4712982 12.2151345,22.7321598 C12.316347,22.9070136 12.4995634,23.0046277 12.6880507,23.0046277 C12.7807992,23.0046277 12.8749669,22.9809591 12.9609747,22.931037 L12.9971111,22.9098012 C13.2572632,22.7574503 13.3446394,22.4230994 13.1922885,22.1629474 C13.0398363,21.9028967 12.7054347,21.8156725 12.4454347,21.9678713 Z"></path>
                            <path id="Shape" d="M7.37877973,11.8606121 C7.04361793,11.5253996 6.59786745,11.3409162 6.12378558,11.3409162 C5.6497037,11.3409162 5.20390253,11.5254503 4.86858869,11.8606121 C4.17662378,12.552729 4.17662378,13.6788889 4.86858869,14.3709552 L8.09177778,17.5940429 C8.42699025,17.929154 8.87274074,18.1136881 9.34687329,18.1136881 C9.82100585,18.1136881 10.2667563,17.929154 10.6020195,17.5939415 L17.3306472,10.8652632 C18.0225614,10.1729942 18.0225614,9.04698635 17.3305458,8.35512281 C16.9953333,8.01991033 16.5495828,7.8354269 16.0753996,7.8354269 C15.6012671,7.8354269 15.1555166,8.01996101 14.8202534,8.35512281 L9.34682261,13.8285536 L7.37877973,11.8606121 Z M15.5922456,9.12711501 C15.721232,8.99812865 15.8928928,8.92712281 16.0754503,8.92712281 C16.2581092,8.92712281 16.4296179,8.99812865 16.5587057,9.12711501 C16.8250409,9.39345029 16.8250409,9.82698635 16.5586043,10.093423 L9.83007797,16.822 C9.70109162,16.9509864 9.5294308,17.0219922 9.34687329,17.0219922 C9.16431579,17.0219922 8.99265497,16.9509864 8.86361793,16.822 L5.64053021,13.5990136 C5.37409357,13.332577 5.37409357,12.8990409 5.64042885,12.6327057 C5.76946589,12.5037193 5.94112671,12.4326121 6.12373489,12.4326121 C6.30634308,12.4326121 6.47790253,12.5036179 6.60688889,12.6326043 L8.96082651,14.9865926 C9.06325536,15.0889201 9.20202339,15.1464444 9.34682261,15.1464444 C9.49162183,15.1464444 9.63038986,15.0889708 9.73271735,14.9865926 L15.5922456,9.12711501 Z"></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </a>
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
                  html += `<div class="bet-item__multiply">
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

App.prototype.changeOdds = function() {
  let html = '';

  $.each(this.odds, function (index, item) {
    html += `<div class="bet-multiplies__item">
               <div class="bet-multiply">
                <span class="bet-multiply__text">${item.Odds}</span>
               </div>
            </div>`
  })

  $('.js-bet-multiplies-list').html(html)
}

App.prototype.changeBalance = function() {
  $('.js-app-deposit-value').text((parseFloat(this.balance.FreBet) + parseFloat(this.balance.Balance)).toFixed(1))
  $('.js-app-deposit-currency').text( this.balance.Symbol || this.balance.Currency)
}

App.prototype.changeAvatar = function(src) {
  this.user.Avatar = src
  $('.js-app-photo').attr('src', this.user.Avatar)

  localStorage.setItem('user', JSON.stringify(this.user))
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
                 <button class="bet-count__button js-bet-count-button" data-value="decrement"">
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
  const value = $(this).attr('data-href')

  $('.js-navigation-tab-item').removeClass('navigation-tab__item--active')
  $(this).addClass('navigation-tab__item--active')

  $('.js-navigation-body').removeClass('navigation-body--active')
  $(`.js-navigation-body[data-tab="${value}"]`).addClass('navigation-body--active')
})

$('.js-bet-multiplies-button').on('click', function() {
  $(this).closest('.js-bet-multiplies').toggleClass('bet-multiplies--active')
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
