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
  const el = $(this)
  $(el).closest('.js-select').find('.js-select-label').text(el.text());
  $(el).closest('.js-select').find('.js-select-label').attr('value', el.attr('value'));
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

$('.js-company-create-show').on('click', function() {
  $('.js-company-create-toggle').show()
})

$('.js-company-create-cancel').on('click', function() {
  $('.js-company-create-toggle').hide()
})

$('.js-user-create-show').on('click', function() {
  $('.js-user-create-toggle').show()
})

$('.js-user-create-cancel').on('click', function() {
  $('.js-user-create-toggle').hide()
})

$('.js-card-create-link').on('click', function() {
  $('.js-card-create-toggle').hide();
  $(this).closest('.js-card-create').find('.js-card-create-toggle').show()
})

$('.js-card-create-cancel').on('click', function() {
  $(this).closest('.js-card-create').find('.js-card-create-toggle').hide()
})



function initEditActionHTML() {
  if (localStorage.getItem('o_photo')) {
    $('#file-preview').attr('src', localStorage.getItem('o_photo'))
    $('#file-actions').html(`
       <button class="file__action" id="dropped-edit-link">Оновити</button>
       <button class="file__action" id="dropped-delete-link">Видалити</button>
    `)
  }
  else {
    $('#file-actions').html(`<button class="file__action" id="dropped-add-link">Додати</button>`)
  }
}

let cropper

function initCropped() {
  cropper = $('#dropped-modal-image').cropper(
    {
      aspectRatio: 1,
      preview: "#dropped-modal-preview",
      dragMode: "crop",
      guides: true,
      center: true,
      scalable: true,
      background: true,
      zoomable: true,
      zoomOnWheel: true,
      setDragMode: "move",
      done: function(){
        $('#dropped-modal-image').cropper('destroy')
      }
    })

  $('#dropped-modal-button').removeClass('dropped-modal__button--disabled')
}

$('#dropped-modal-input').on('change', function() {
  const reader = new FileReader();

  reader.onload = () => {
    $('#dropped-modal-uploading').hide()
    $('#dropped-modal-edit').show()
    $('#dropped-modal-image').attr('src', reader.result.toString())

    localStorage.setItem('o_photo', reader.result.toString())

    initCropped();
  };

  reader.readAsDataURL($('#dropped-modal-input')[0].files[0]);
});

$('#dropped-modal-new-input').on('change', function() {
  const reader = new FileReader();

  reader.onload = () => {
    $('#dropped-modal-image').attr('src', reader.result.toString())

    localStorage.setItem('o_photo', reader.result.toString())

    if (cropper) {
      // cropper.destroy()
      $('#dropped-modal-image').cropper('destroy')
    }

    $('#dropped-modal-uploading').hide()
    $('#dropped-modal-edit').show()
    $('#dropped-modal-image').attr('src', reader.result.toString())

    initCropped();
  };

  reader.readAsDataURL($('#dropped-modal-new-input')[0].files[0]);
});

$('#dropped-modal-button').on('click', function() {

  // cropper.getCroppedCanvas(
  //   {
  //     fillColor: '#fff',
  //     imageSmoothingQuality: 'high',
  //   }
  // )

  const path = $('#dropped-modal-image').cropper('getCroppedCanvas').toDataURL()

  $('#dropped-modal').toggleClass('dropped-modal--active')
  $('#dropped-modal-uploading').show()
  $('#dropped-modal-edit').hide()
  $('#file-preview').attr('src', path)

  localStorage.setItem('o_photo', path)
  initEditActionHTML()
});

$('#dropped-modal-close').on('click', function() {
  $('#dropped-modal').toggleClass('dropped-modal--active')
})



$('body').on('click', '#dropped-add-link', function() {
  $('#dropped-modal').toggleClass('dropped-modal--active')
});

$('body').on('click', '#dropped-edit-link', function() {
  $('#dropped-modal').toggleClass('dropped-modal--active')

  $('#dropped-modal-uploading').hide()
  $('#dropped-modal-edit').show()

  if (!cropper) {
    $('#dropped-modal-image').attr('src', localStorage.getItem('o_photo'))

    initCropped();
  }
});

$('body').on('click', '#dropped-delete-link', function() {
  localStorage.setItem('o_photo', '')
  $('#file-preview').attr('src', './img/user.svg')

  if(cropper) {
    $('#dropped-modal-image').cropper('destroy')
  }

  initEditActionHTML()

  $('#dropped-modal-button').addClass('dropped-modal__button--disabled')
});

// Editor Events
$('.js-cropped-button').on('click', function (){
  $('.js-cropped-button').removeClass('btn-group__button--active')
  $(this).toggleClass('btn-group__button--active')
})

$('.js-cropped-button-move').on('click', function (){
  const way = $(this).attr('data-style')

  if (cropper) {

    if(way === 'top') {
      $('#dropped-modal-image').cropper('move', 0, -10)
    }
    else if(way === 'bottom') {
      $('#dropped-modal-image').cropper('move', 0, 10)
    }
    else if(way === 'left') {
      $('#dropped-modal-image').cropper('move', -10, 0)
    }
    else if(way === 'right') {
      $('#dropped-modal-image').cropper('move', 10, 0)
    }
  }
})

$('.js-cropped-button-zoom').on('click', function (){
  const way = $(this).attr('data-style')

  if (cropper) {

    if(way === 'up') {
      $('#dropped-modal-image').cropper('zoom', 0.1)
    }
    else if(way === 'down') {
      $('#dropped-modal-image').cropper('zoom', -0.1)
    }
  }
})

$('.js-cropped-button-rotate').on('click', function (){
  const way = $(this).attr('data-style')

  if (cropper) {

    if (way === 'left') {
      $('#dropped-modal-image').cropper('rotate', -5)
    }
    else if (way === 'right') {
      $('#dropped-modal-image').cropper('rotate', 5)
    }
  }
})

$('.js-cropped-button-move').on('click', function (){
  if (cropper) {
    $('#dropped-modal-image').cropper('setDragMode', 'move')
  }
})

$('.js-cropped-button-crop').on('click', function (){
  if (cropper) {
    $('#dropped-modal-image').cropper('setDragMode', 'crop')
  }
})
// End Editor Events

initEditActionHTML()


$('.js-card-action-info').on('click', function (){
  $(this).closest('.js-card-action').toggleClass('card-action--active')
})

$('.js-card-action-close').on('click', function (){
  $(this).closest('.js-card-action').toggleClass('card-action--active')
})

$('.js-tab-link').on('click', function (){
  const id = $(this).attr('data-link-tab')
  $(this).closest('.js-tab').find('.tab__link--active').removeClass('tab__link--active')
  $(this).closest('.js-tab').find('.tab__body--active').removeClass('tab__body--active')
  $(this).addClass('tab__link--active')
  $(this).closest('.js-tab').find($(`div[data-body-tab="${id}"]`)).addClass('tab__body--active')
})
