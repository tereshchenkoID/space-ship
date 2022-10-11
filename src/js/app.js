function App() {
  this.user = {}
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

const app = new App();
app.init()


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

$('.js-multiplies-button').on('click', function() {
  $(this).closest('.js-multiplies').toggleClass('bet-multiplies--active')
})
