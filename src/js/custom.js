$('.js-account-sign-in').on('click', function(){
  $('.js-popup').show()
})

$('.js-popup-link').on('click', function() {
  const id = $(this).attr('data-link')

  $('.js-popup-link').removeClass('popup__link--active')
  $(this).addClass('popup__link--active')

  $('.js-popup-body').removeClass('popup__body--active')
  $(`.js-popup-body[data-body="${id}"]`).addClass('popup__body--active')
})

$('.js-popup').on('click', function(e) {
  if (!$(e.target).closest('.js-popup-wrapper').length) {
    $('.js-popup').hide();
  }
  e.stopPropagation();
});

$('.js-toggle').on('click', function() {
  $(this).toggleClass('toggle--active')
  $('.js-menu').toggleClass('menu--active')
})

$('.js-checked').on('click', function() {
  $(this).toggleClass('checked--active')
})

$('.js-select').on('click', function(){
  $('.js-select').not($(this)).removeClass('select--active');
  $(this).toggleClass('select--active');
})

$('.js-select-item').on('click', function () {
  $('.js-select-label').text($(this).text());
  $('.js-select-label').attr('value', $(this).attr('value'));
})


function changeJobsView (value) {
  if (value ==='list') {
    $('.js-jobs').removeClass('jobs--grid')
    $('.js-jobs').addClass('jobs--list')
  }
  else {
    $('.js-jobs').removeClass('jobs--list')
    $('.js-jobs').addClass('jobs--grid')
  }
}

$('.js-actions-item').on('click', function() {
  $('.js-actions-item').removeClass('actions__item--active')
  $(this).addClass('actions__item--active')

  changeJobsView(this.getAttribute('data-sort'));
})

$('.sort-button').on('click', function() {
  $(this).toggleClass('sort-button--active')
})


$('.js-filter-toggle').on('click', function() {
  $('.js-filters').toggleClass('filters--active')
})

$('.js-filters-close').on('click', function() {
  $('.js-filters').removeClass('filters--active')
})

$('.js-account-toggle').on('click', function() {
  $(this).toggleClass('account-toggle--active')
  $('.js-account').toggleClass('account--active')
})

const range = document.getElementById('salary-range');

if (range) {

  noUiSlider.create(range, {
    start: [345, 9345],
    connect: true,
    step: 100,
    range: {
      'min': 345,
      'max': 9800
    },
  });

  range.noUiSlider.on('update', function(data){
    const min = data[0];
    const max = data[1];

    // eslint-disable-next-line camelcase
    const min_field = document.getElementById('salary-min');
    // eslint-disable-next-line camelcase
    const max_field = document.getElementById('salary-max');

    // eslint-disable-next-line radix
    min_field.value = parseInt(min);
    // eslint-disable-next-line radix
    max_field.value = parseInt(max);
  })


  document.getElementById('salary-min').addEventListener('change', function () {
    range.noUiSlider.set([this.value, null]);
  });

  document.getElementById('salary-max').addEventListener('change', function () {
    range.noUiSlider.set([null, this.value]);
  });
}


$('.js-testimonial-slider').slick({
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true
});


$('.js-career-slider').slick({
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1
      }
    }
  ]
});


$('.js-card-link').on('click', function() {
  $('.js-card-toggle').hide();
  $(this).next('.js-card-toggle').show()
})

$('.js-card-change-cancel').on('click', function() {
  $(this).closest('.js-card-toggle').hide()
})


$('.js-card-search-link').on('click', function() {
  $('.js-card-search-toggle').hide();
  $(this).closest('.js-card-search').find('.js-card-search-toggle').show()
})

$('.js-card-search-cancel').on('click', function() {
  $(this).closest('.js-card-search').find('.js-card-search-toggle').hide()
})


$('.js-agents-create-show').on('click', function() {
  $('.js-agents-create-toggle').show()
})

$('.js-agents-create-cancel').on('click', function() {
  $('.js-agents-create-toggle').hide()
})


$('.js-card-create-link').on('click', function() {
  $('.js-card-create-toggle').hide();
  $(this).closest('.js-card-create').find('.js-card-create-toggle').show()
})

$('.js-card-create-cancel').on('click', function() {
  $(this).closest('.js-card-create').find('.js-card-create-toggle').hide()
})
