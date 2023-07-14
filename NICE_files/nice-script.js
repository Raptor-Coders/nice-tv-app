// Check if Masjid ID exists
var masajidID = '4B24061G0C';

// Check URL Params
var urlParams = new URLSearchParams(window.location.search),
  isPreview = urlParams.get('preview');

// Check if Masjid ID exists
if(isPreview) {
  var masajidID = isPreview;
  $('.panel-wrapper').show();
  $('body').addClass('preview');
} else {
  //var masajidID = localStorage.getItem('masajid_ID');
}
if(!masajidID) {
  window.location.replace('https://my.masaj.id/welcome.login');
}

// Open Database
var db = new Dexie("masajid");
db.version(1).stores({
  jadwal: 'tanggal,subuh,terbit,dzuhur,ashar,maghrib,isya',
  schedule: 'date,fajr,sunrise,dhuhr,asr,maghrib,isha'
});
db.open();

// Set the global configs to synchronous
$.ajaxSetup({
  async: false
});

// Sync Data  + '&v=' + Date.now()
function syncData() {
  $.getJSON('/data/data.json', function(data) {
    if(data[0].status == 'publish') {
      localStorage.setItem('masajid_data', JSON.stringify(data));
      localStorage.setItem('masajid_dataSync', data[0].modified);
    }
  });
}
syncData();

// Refresh Data  + '&check=' + Date.now()
function refreshData() {
  $('#preloader').hide();
  $.getJSON('/data/data.json', function(data) {
    if(moment(data[0].modified) > moment(localStorage.getItem('masajid_dataSync'))) {
      setTimeout(function () {
        hardReload();
      }, 1000);
    }
  });
  if(!localStorage.getItem('masajid_data')) {
    syncData();
  }
  if($('.masjid-name').is(':empty')) {
    hardReload();
  }
}

// Live Data Declare
var liveData = JSON.parse(localStorage.getItem('masajid_data'));

// Location ID Declare
if(liveData[0].prayer_time.calculation_method == 'kemenag') {
  var locationID = liveData[0].prayer_time.kotakab;
} else {
  var locationID = liveData[0].prayer_time.masjid_coordinates;
}

// Clear Schedule Database if location changed
function checkLoc() {
  if(locationID !== localStorage.getItem('masajid_lastLoc')) {
    clear_data();
  }
}
checkLoc();

// Try Hard Reload
function hardReload() {
  caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))));
  localStorage.setItem('masajid_reload', 1);
  window.location.reload(true);
}

function hardReload2nd() {
  if(localStorage.getItem('masajid_reload')) {
    localStorage.removeItem('masajid_reload');
    checkLoc();
    setTimeout(function () {
      window.location.reload(true);
    }, 500);
  }
}
hardReload2nd();

// Logout Masjid
function logoutMasjid() {
  localStorage.removeItem('masajid_ID');
  window.location.replace('https://my.masaj.id/welcome.login');
}

// Check License Expiration
function checkExpiration() {
  if(moment() > moment(liveData[0].date).add(liveData[0].lic.duration,'years')) {
    logoutMasjid();
  }
}

// Configuration
localStorage.setItem('masajid_lastLoc',locationID);
if(liveData[0].masjid_profile.masjid_logo_selector == 'upload') { var masjidLogo = liveData[0].masjid_profile.masjid_logo; } else { var masjidLogo = liveData[0].masjid_profile.masjid_gallery; }
var appVersion = 'Version 1.0.0';
masjidName = liveData[0].masjid_profile.masjid_name,
  masjidAddress = liveData[0].masjid_profile.masjid_address,
  themeLayout = liveData[0].layout_style.theme_layout,
  layoutRTL = liveData[0].layout_style.layout_direction,
  primaryColor = liveData[0].layout_style.primary_color,
  secondaryColor = liveData[0].layout_style.secondary_color,
  shalatMethod = liveData[0].prayer_time.calculation_method,
  shafaq = liveData[0].prayer_time.shafaq,
  school = liveData[0].prayer_time.asr_calculation,
  midnightMode = liveData[0].prayer_time.midnight_mode,
  lam = liveData[0].prayer_time.latitude_adjustment_mode,
  arabicText = liveData[0].localization.arabic_numeric,
  shuruqDuration = liveData[0].prayer_time.shuruq_duration,
  esMode = liveData[0].layout_style.energy_saving_mode,
  esModeDuration = liveData[0].layout_style.energy_saving_duration,
  jumboMode = liveData[0].jumbotron_slider.enable_jumbotron_slider,
  jumboModeDuration = liveData[0].jumbotron_slider.jumbotron_duration,
  adjHijri = liveData[0].localization.hijri_date_adjustment,
  adjShubuh = liveData[0].prayer_time.correction_shubuh,
  adjShuruq = liveData[0].prayer_time.correction_shuruq,
  adjDzuhur = liveData[0].prayer_time.correction_dhuhr,
  adjAshar = liveData[0].prayer_time.correction_asr,
  adjMaghrib = liveData[0].prayer_time.correction_maghrib,
  adjIsya = liveData[0].prayer_time.correction_isha,
  iqoShubuh = liveData[0].prayer_time.iqamah_shubuh,
  iqoDzuhur = liveData[0].prayer_time.iqamah_dhuhr,
  iqoAshar = liveData[0].prayer_time.iqamah_asr,
  iqoMaghrib = liveData[0].prayer_time.iqamah_maghrib,
  iqoIsya = liveData[0].prayer_time.iqamah_isha,
  jumatMode = liveData[0].prayer_time.show_shalat_jumat,
  jumatDuration = liveData[0].prayer_time.shalat_jumat_duration,
  smShubuhMode = liveData[0].scheduled_murattal.enable_shubuh_murattal,
  smShubuhAutoplay = liveData[0].scheduled_murattal.shubuh_autoplay_duration,
  smShubuhSurah = liveData[0].scheduled_murattal.shubuh_play_surah,
  smDzuhurMode = liveData[0].scheduled_murattal.enable_dhuhr_murattal,
  smDzuhurAutoplay = liveData[0].scheduled_murattal.dhuhr_autoplay_duration,
  smDzuhurSurah = liveData[0].scheduled_murattal.dhuhr_play_surah,
  smJumatMode = liveData[0].scheduled_murattal.enable_jumat_murattal,
  smJumatAutoplay = liveData[0].scheduled_murattal.jumat_autoplay_duration,
  smJumatSurah = liveData[0].scheduled_murattal.jumat_play_surah,
  smAsharMode = liveData[0].scheduled_murattal.enable_asr_murattal,
  smAsharAutoplay = liveData[0].scheduled_murattal.asr_autoplay_duration,
  smAsharSurah = liveData[0].scheduled_murattal.asr_play_surah,
  smMaghribMode = liveData[0].scheduled_murattal.enable_maghrib_murattal,
  smMaghribAutoplay = liveData[0].scheduled_murattal.maghrib_autoplay_duration,
  smMaghribSurah = liveData[0].scheduled_murattal.maghrib_play_surah,
  smIsyaMode = liveData[0].scheduled_murattal.enable_isha_murattal,
  smIsyaAutoplay = liveData[0].scheduled_murattal.isha_autoplay_duration,
  smIsyaSurah = liveData[0].scheduled_murattal.isha_play_surah,
  smMorningMode = liveData[0].scheduled_murattal.enable_morning_dhikr,
  smMorningPlayin = liveData[0].scheduled_murattal.playing_in_morning_dhikr,
  smMorningAudio = 'https://masajid.b-cdn.net/audio/morning-dhikr.mp3',
  smEveningMode = liveData[0].scheduled_murattal.enable_evening_dhikr,
  smEveningPlayin = liveData[0].scheduled_murattal.playing_in_evening_dhikr,
  smEveningAudio = 'https://masajid.b-cdn.net/audio/evening-dhikr.mp3',
  sliderDuration = liveData[0].main_slider.main_slider_duration,
  infoSpeed = liveData[0].info_slide.info_scrolling_speed,
  infoVisibility = liveData[0].info_slide.info_visibility,
  rtSpeed = liveData[0].running_text.running_text_speed,
  rtDirection = liveData[0].running_text.running_text_direction,
  irtSpeed = liveData[0].iqamah_screen.iqamah_running_text_speed,
  irtDirection = liveData[0].iqamah_screen.iqamah_running_text_direction;

// Country Fix
var timeLocale = liveData[0].localization.date_time_locale;
if(timeLocale == 'my') { timeLocale = 'ms-my'; }
if(timeLocale == 'gb') { timeLocale = 'en-gb'; }
if(timeLocale == 'us') { timeLocale = 'en'; }

// Localization
var tShubuh = liveData[0].localization.lang_shubuh,
  tShuruq = liveData[0].localization.lang_shuruq,
  tDzuhur = liveData[0].localization.lang_dhuhr,
  tAshar = liveData[0].localization.lang_asr,
  tMaghrib = liveData[0].localization.lang_maghrib,
  tIsya = liveData[0].localization.lang_isha,
  tJumat = liveData[0].localization.lang_jumat,
  tNow = liveData[0].localization.lang_now,
  tToday = liveData[0].localization.lang_today,
  tDaysMore = liveData[0].localization.lang_days_more,
  tShuruqPre = liveData[0].localization.lang_forbidden_time,
  tAdzan = liveData[0].localization.lang_time_to_azan,
  tIqomah = liveData[0].localization.lang_before_iqamah,
  tIqomahText = liveData[0].localization.lang_iqamah_text || '',
  tPrepare = liveData[0].localization.lang_prepare_to_shalat,
  tDateDivider = liveData[0].localization.lang_date_divider,
  tHijriSign = liveData[0].localization.lang_hijri_sign,
  numLatin = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  numArabic = ['Ù ', 'Ù¡', 'Ù¢', 'Ù£', 'Ù¤', 'Ù¥', 'Ù¦', 'Ù§', 'Ù¨', 'Ù©'];

// Event Date
var myEvent = [];
$.each(liveData[0].islamic_event.islamic_event, function(i, obj) {
  myEvent.push({
    Date: new Date(obj.event_date),
    Event: obj.event_name
  });
});

// Main Slider Data
$.each(liveData[0].main_slider.main_slider, function(i, obj) {
  if(obj.type == "image") {
    $('.main-slider .splide__list').append('<li class="splide__slide slider-image" data-splide-interval="'+obj.duration+'"><img src="'+obj.image+'" /></li>');
  }
  if(obj.type == "youtube") {
    $('.main-slider .splide__list').append('<li class="splide__slide slider-youtube" data-splide-interval="'+obj.duration+'" data-splide-youtube="https://www.youtube.com/watch?v='+obj.youtube+'"></li>');
  }
  if(obj.type == "video") {
    $('.main-slider .splide__list').append('<li class="splide__slide slider-video" data-splide-interval="'+obj.duration+'" data-splide-html-video="'+obj.video+'"></li>');
  }
});

// Info Slide Data
if(liveData[0].info_slide.enable_info_slide == 1) {
  var myInfoSlide = [];
  $.each(liveData[0].info_slide.info_table, function(i, obj) {
    myInfoSlide.push('<li><h4>'+obj.title+'</h4><span>'+obj.description+'</span></li>');
  });
  $('.main-slider .splide__list').append('<li class="splide__slide slider-info" data-splide-interval="'+liveData[0].info_slide.info_slide_duration+'"><div class="info-wrapper"><ul>'+myInfoSlide.join('')+'</ul></div></li>');
}

// Donation Slide Data
if(liveData[0].donation_slide.enable_donation_slide == 1) {
  $('.main-slider .splide__list').append('<li class="splide__slide slider-donation" data-splide-interval="'+liveData[0].donation_slide.donation_slide_duration+'"><img src="'+liveData[0].donation_slide.donation_image_background+'" /><div class="slider-donation-wrapper"><h3>'+liveData[0].donation_slide.donation_description+'</h3></div></li>');
  $('.qrcode').attr('src',liveData[0].donation_slide.donation_qr_code);
}

// Jumbotron Slider Data
if(jumboMode == 1) {
  $.each(liveData[0].jumbotron_slider.jumbotron_slider, function(i, obj) {
    if(obj.type == "image") {
      $('.jumbotron .splide__list').append('<li class="splide__slide slider-image" data-splide-interval="'+obj.duration+'"><img src="'+obj.image+'" /></li>');
    }
    if(obj.type == "youtube") {
      $('.jumbotron .splide__list').append('<li class="splide__slide slider-youtube" data-splide-interval="'+obj.duration+'" data-splide-youtube="https://www.youtube.com/watch?v='+obj.youtube+'"></li>');
    }
    if(obj.type == "video") {
      $('.jumbotron .splide__list').append('<li class="splide__slide slider-video" data-splide-interval="'+obj.duration+'" data-splide-html-video="'+obj.video+'"></li>');
    }
  });
}

// Jumatan Slider Data
if(jumatMode == 1) {
  $.each(liveData[0].prayer_time.shalat_jumat_slider, function(i, obj) {
    if(obj.type == "image") {
      $('.jumatan .splide__list').append('<li class="splide__slide slider-image" data-splide-interval="'+obj.duration+'"><img src="'+obj.image+'" /></li>');
    }
    if(obj.type == "youtube") {
      $('.jumatan .splide__list').append('<li class="splide__slide slider-youtube" data-splide-interval="'+obj.duration+'" data-splide-youtube="https://www.youtube.com/watch?v='+obj.youtube+'"></li>');
    }
    if(obj.type == "video") {
      $('.jumatan .splide__list').append('<li class="splide__slide slider-video" data-splide-interval="'+obj.duration+'" data-splide-html-video="'+obj.video+'"></li>');
    }
  });
}

// Iqamah Icon Slider
$.each(liveData[0].iqamah_screen.iqamah_icon, function(i, obj) {
  $('.sc-afterIqomah .splide__list').append('<li class="splide__slide slider-image" data-splide-interval="5000"><img src="'+obj.icon_image+'" /></li>');
});

// Splide JS
var configSlide = {
  cover: true,
  heightRatio: 0.5,
  type: 'loop',
  autoplay: true,
  arrows: false,
  pagination: false,
  video: {
    loop: true,
    mute: true,
    disableOverlayUI: true,
    autoplay: true,
    playerOptions: {
      youtube: {},
      video: {},
    },
  },
};
var mainSlider = new Splide('.main-slider', configSlide);
mainSlider.mount(window.splide.Extensions);
mainSlider.on( 'active', function(Slide) {
  if(Slide.slide.classList.contains('slider-donation') == true) {
    $('.sc-donasi').show();
  } else {
    $('.sc-donasi').hide();
  }
});
if(jumboMode == 1) {
  var jumboSlider = new Splide('.jumbotron', configSlide);
  jumboSlider.mount(window.splide.Extensions);
}
if(jumatMode == 1) {
  var jumatSlider = new Splide('.jumatan', configSlide);
  jumatSlider.mount(window.splide.Extensions);
}
var iqamahIconSlider = new Splide('.sc-afterIqomah', configSlide);
iqamahIconSlider.mount();

// Running Text Data
$.each(liveData[0].running_text.running_text_info, function(i, obj) {
  $('#runningtext').append('<li class="rt-item">'+obj.text_info+'</li>');
});

$('#runningtext').marquee({
  speed: rtSpeed,
  duplicated: true,
  startVisible: true,
  direction: rtDirection,
  allowCss3Support: true,
  easing: 'linear',
  gap: 0
});

// Iqamah Running Text Data
$.each(liveData[0].iqamah_screen.iqamah_running_text, function(i, obj) {
  $('#iqomah-runningtext').append('<li class="irt-item">'+obj.text_info+'</li>');
});

// Audio Azan & Iqamah Data
$('#audio-adzan').attr('src',liveData[0].prayer_time.azan_alarm_sound);
$('#audio-iqomah').attr('src',liveData[0].prayer_time.iqamah_alarm_sound);

// Replace String
document.title = masjidName;
var masjidNameSplit = masjidName.split(' '),
  masjidNameMod = '<span>' + masjidNameSplit.shift() + '</span> ' + masjidNameSplit.join(' ');
$('.masjid-name').html(masjidNameMod);
$('.masjid-address').html(masjidAddress);
if(masjidLogo!=''){
  $('.masjid-logo').attr('src',masjidLogo);
} else {
  $('.masjid-logo').hide();
}

// $('.col-shubuh .shalat-name').html(tShubuh);
// $('.col-shuruq .shalat-name').html(tShuruq);
// $('.col-dzuhur .shalat-name').html(tDzuhur);

function textJumat() {
  if(jumatMode == 1) {
    if(moment().day() == 5) {
      //$('.col-dzuhur .shalat-name').html(tJumat);
    }	else {
      //$('.col-dzuhur .shalat-name').html(tDzuhur);
    }
  }
}
// $('.col-ashar .shalat-name').html(tAshar);
// $('.col-maghrib .shalat-name').html(tMaghrib);
// $('.col-isya .shalat-name').html(tIsya);
// $('.shuruq-wrapper h3').html(tShuruqPre);
// $('.adzan-wrapper h3').html(tAdzan);
// $('.iqomah-wrapper h3').html(tIqomah);
// $('.date-divider').html(tDateDivider);
// $('.hijri-sign').html(tHijriSign);
if(arabicText == 1) {
  $.countdown.setDefaults($.countdown.regionalOptions['ar']);
  $('.numbers').text(function(i, val) {
    return val.replace(/\d/g, function(m) {
      return numArabic[numLatin.indexOf(m)];
    })
  });
} else {
  $.countdown.setDefaults($.countdown.regionalOptions['']);
}

// Set Color
$('body').get(0).style.setProperty('--primary', primaryColor);
$('body').get(0).style.setProperty('--secondary', secondaryColor);

// Big Clock
function cloneTicks() {
  for (var i = 1; i <= 12; i++) {
    var el = document.querySelector(".fiveminutes");
    var clone = el.cloneNode(true);
    clone.setAttribute('class', `fiveminutes f${i}`);
    var app = document.getElementById("clockface").appendChild(clone)
    var el2 = document.querySelector(`.f${i}`);
    el2.style.transform = `rotate(${30 * i}deg)`;
  }
  for (var i = 1; i <= 60; i++) {
    var el = document.querySelector(".minutes");
    var clone = el.cloneNode(true);
    clone.setAttribute('class', `minutes m${i}`);
    var app = document.getElementById("clockface").appendChild(clone)
    var el2 = document.querySelector(`.m${i}`);
    el2.style.transform = `rotate(${6 * i}deg)`;
  }
}
var synth = window.speechSynthesis;
const sechand = document.querySelector('.sec')
const minhand = document.querySelector('.min')
const hourhand = document.querySelector('.hour')
const speaker = document.getElementById('speaker');
var sec, min, hour;
function setTime() {
  const now = new Date();
  sec = now.getSeconds(now.getSeconds() + 1);
  const secdeg = ((sec / 60) * 360);
  sechand.style.transform = `rotate(${secdeg}deg)`;
  min = now.getMinutes();
  const mindeg = ((min / 60) * 360);
  minhand.style.transform = `rotate(${mindeg}deg)`;
  hour = now.getHours();
  const hourdeg = ((hour + min/60) / 12 * 360);
  hourhand.style.transform = `rotate(${hourdeg}deg)`;
}
cloneTicks();
function handleTickInit(tick) {
  Tick.helper.interval(function(){
    var d = Tick.helper.date();
    tick.value = {
      sep: ':',
      hours: d.getHours(),
      minutes: d.getMinutes(),
      seconds: d.getSeconds()
    };
  });
}
$('.clock-brand span').html(appVersion);

// If Potrait
function adaptiveDesign() {
  if(window.innerHeight > window.innerWidth){
    $('body').addClass('potrait-mode');
    $('.masjid-address').css('max-width', $('.masjid-name').width());
  } else {
    $('body').removeClass('potrait-mode');
  }
}
adaptiveDesign();
$(window).on('resize orientationchange', function(){
  adaptiveDesign();
});

// RTL Layout
if(layoutRTL == 1) {
  $('body').addClass('layout-rtl');
}

// Potrait Clock
function potraitClock() {
  var d = new Date();
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  var pclock = "<span class='pclock'>" + ("0" + h).substr(-2) + "</span><span class='divider'>:</span><span class='pclock'>" + ("0" + m).substr(-2) + "</span>";
  $('#potrait-clock > span').html(pclock);
  if(arabicText == 1) {
    $('#potrait-clock span.pclock').text(function(i, val) {
      return val.replace(/\d/g, function(m) {
        return numArabic[numLatin.indexOf(m)];
      })
    });
  }
}

// Darker Color
function ColorLuminance(hex, lum) {
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  lum = lum || 0;
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i*2,2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00"+c).substr(c.length);
  }
  return rgb;
}
$('.row-header .date-now').css("background", "linear-gradient(to right, " + ColorLuminance(primaryColor, -0.9) + " 0%, " + ColorLuminance(primaryColor, -0.1) + " 70%)");
$('body').get(0).style.setProperty('--primaryDark', ColorLuminance(primaryColor, -0.5));
$('body').get(0).style.setProperty('--primaryLight', ColorLuminance(primaryColor, 0.2));
if(themeLayout == '2') {
  $('.row-header .masjid-id').css("background", "linear-gradient(to right, " + ColorLuminance(primaryColor, -0.4) + " 0%, " + ColorLuminance(primaryColor, -0.1) + " 70%)");
}
if(themeLayout == '3') {
  $('body:not(layout-rtl) .clip-wrapper').css("background", "linear-gradient(to right, " + ColorLuminance(primaryColor, -0.5) + " 0%, " + ColorLuminance(primaryColor, -0.1) + " 70%)");
  $('body.layout-rtl .clip-wrapper').css("background", "linear-gradient(to left, " + ColorLuminance(primaryColor, -0.5) + " 0%, " + ColorLuminance(primaryColor, -0.1) + " 70%)");
}

// Info Slide Carousel
function sliderInfo(){
  $('.info-wrapper').easyTicker({
    direction: 'up',
    easing: 'swing',
    speed: 'slow',
    interval: infoSpeed * 1000,
    height: 'auto',
    visible: infoVisibility,
    callbacks: {
      before: false,
      after: false
    }
  });
}
sliderInfo();

// Screen Shuruq
localStorage.removeItem('masajid_shuruqState');
function now_shuruq(name,time,to) {
  return;

  $('.shuruq-name').html(name);
  $('.shuruq-time').html(time);
  $('.shuruq-to').html(to);
  $(".screen-shuruq").show();
  if(!localStorage.getItem('masajid_shuruqState')) {
    localStorage.setItem('masajid_shuruqState', 1);
    $('#audio-shuruq').attr('src','https://my.masaj.id/audio/alarm-1.mp3');
    $('#audio-shuruq').get(0).play();
  }
  $(".screen-shuruq .progress-bar").animate({
    width: "0%"
  }, 0);
  $(".screen-shuruq .progress-bar").animate({
    width: "100%"
  }, 60000 * shuruqDuration, function() {
    $(".screen-shuruq").hide();
    localStorage.removeItem('masajid_shuruqState');
  });
}

// Screen Iqamah
function now_iqomah(dateTime,shalat) {
  return;
  $(".screen-iqomah").show();
  $('.irt-item-shalat').html(shalat);
  var $mq = $('#iqomah-runningtext').marquee({
    speed: irtSpeed,
    duplicated: true,
    startVisible: true,
    direction: irtDirection,
    allowCss3Support: true,
    easing: 'linear',
    gap: 0
  });
  var date = new Date(dateTime);
  var now = new Date();
  var iqomahTime = (date.getTime()/1000) - (now.getTime()/1000);
  $('.iqomah-clock').countdown({
    until: +iqomahTime,
    format: 'MS',
    layout: '<span class="menit">{mnn}</span><span class="separator">{sep}</span><span class="detik">{snn}</span>',
    onExpiry: function(){
      $('#audio-iqomah').get(0).play();
      $(".screen-iqomah").hide();
      $(".sc-afterIqomah").show();
      $('.iqomah-clock').countdown('destroy');
      $mq.marquee('destroy');
      setTimeout(function(){
        $(".sc-afterIqomah").hide();
      }, 1000 * 60);
    }
  });
  /*
  var iqomahClock = $('.iqomah-clock').FlipClock(iqomahTime, {
    countdown: true,
    clockFace: 'MinuteCounter',
    callbacks: {
      stop: function() {
        $('#audio-iqomah').get(0).play();
        $(".screen-iqomah").hide();
        $(".sc-afterIqomah").show();
        setTimeout(function(){
          $(".sc-afterIqomah").hide();
        }, 1000 * 60);
      }
    }
  });
  */
}
// now_iqomah("November 2, 2021 07:26:00", "Persiapan Shalat Dzuhur");

// Screen Adzan
localStorage.removeItem('masajid_adzanState');
function now_adzan(name,time,iqomah,jumat) {
  return;
  if(!localStorage.getItem('masajid_adzanState')) {
    // Stop Murottal
    $('#audio-murattal').get(0).pause();
    $('#audio-murattal').attr('src','');
    localStorage.removeItem('masajid_murattal');

    localStorage.setItem('masajid_adzanState', 1);
    $('#audio-adzan').get(0).play();
    $('.adzan-name').html(name);
    $('.adzan-time').html(time);
    $(".screen-adzan").show();
    $(".screen-adzan .progress-bar").css('width','0%');
    $(".screen-adzan .progress-bar").addClass('loading');
    var progressTotal = 0,
      progressInterval = setInterval(function () {
        if (progressTotal >= 100) {
          localStorage.removeItem('masajid_adzanState');
          $(".screen-adzan").hide();
          $(".screen-adzan .progress-bar").removeClass('loading');
          if(jumat == 1) {
            // Show Slider Jumat
            $('.jumatan').show();
            setTimeout(function(){
              $('.jumatan').hide();
            }, jumatDuration * 60 * 1000);
          } else {
            now_iqomah(moment().add(iqomah, 'minutes').locale('en').format('MMMM D, YYYY HH:mm:00'), tPrepare + " " + name + " ");
          }
          return clearInterval(progressInterval);
        }
        $(".screen-adzan .progress-bar").css('width', progressTotal.toFixed(1) + '%');
        progressTotal = progressTotal + 0.1;
      }, 60000 / (100 * 10));
  }
}
// now_adzan('Ashar','14:53',10,0);

// Countdown Shalat Toast
function toastShalat(name,time,now) {
  return;
  $('.toast-shalat .ts-name').html(name);
  if(now == '') {
    $('.toast-shalat .ts-time').countdown({
      until: new Date(time),
      compact: true,
      layout: '-{hnn}{sep}{mnn}{sep}{snn}',
      expiryText: tNow
    });
  } else {
    $('.toast-shalat .ts-time').countdown('destroy')
    $('.toast-shalat .ts-time').html(now);
  }
}
// toastShalat('Maghrib','2021/11/02 07:31:00','Sekarang');

// Islamic Event Toast
function toastEvent() {
  if(myEvent.length > 0){
    var now = Date.now();
    const today = new Date();
    const closest = myEvent.reduce((a, b) => {
      const adiff = a.Date - today;
      return adiff > 0 && adiff < b.Date - today ? a : b;
    });
    var start = new Date(),
      end   = closest.Date,
      diff  = new Date(end - start),
      days  = Math.round(diff/1000/60/60/24);
    if(days < 1) {
      $('.te-name').html(closest.Event);
      $('.te-time').html(tToday);
    } else {
      $('.te-name').html(closest.Event);
      $('.te-time').html(days + ' ' + tDaysMore);
    }
    if(days >= 0 && days <= 7) {
      $('.toast-event').show();
      $('body.potrait-mode .slider-donation .slider-donation-wrapper').css('padding','2vw 2vw 11.5vw');
      $('body.potrait-mode .slider-donation .slider-donation-wrapper h3').css('font-size','4vw');
    } else {
      $('.toast-event').hide();
    }
  }
}
// toastEvent();

// Energy Saving
function energy_saving(state) {
  if(state == 'on') {
    $('body').addClass('energysaving');
  }
  if(state == 'off') {
    $('body').removeClass('energysaving');
  }
}
// energy_saving('on');

// Scheduled Murattal Play Func
function scheduledMurattal(url) {
  if(!localStorage.getItem('masajid_murattal')) {
    localStorage.setItem('masajid_murattal',1);
    $('#audio-murattal').attr('src',url);
    $('#audio-murattal').get(0).play();
  }
}

// Check & Update every 500ms
function checkUpdate(shubuh,shuruq,dzuhur,ashar,maghrib,isya) {
  // Check connection
  window.addEventListener('offline', () => {
    $('.date-now').addClass('offline');
  });
  window.addEventListener('online', () => {
    $('.date-now').removeClass('offline');
  });
  // Time Prayer
  var mNow = moment(),
    extra = moment().format('YYYY-MM-DD') + ' ',
    mShubuh = moment(extra + shubuh),
    mShuruq = moment(extra + shuruq),
    mDzuhur = moment(extra + dzuhur),
    mAshar = moment(extra + ashar),
    mMaghrib = moment(extra + maghrib),
    mIsya = moment(extra + isya);
  // Update Date
  $('.date-now strong').html(moment().locale(timeLocale).format('dddd').replace('Minggu','Ahad'));
  $('.date-now .masehi').html(moment().locale(timeLocale).format('ll'));
  $('.date-now .hijri').html(moment().locale(timeLocale).add(adjHijri, 'days').format('iDD iMMMM iYYYY'));
  // Clear Active Sign
  $('.row-shalat > .col').removeClass('col-active');
  // Check Event
  toastEvent();
  // Check Jumat
  textJumat();
  // Energy Saving Mode
  if(esMode == 1){
    energy_saving('on');
    // ES Shubuh
    if(moment(mNow).isBetween(moment(mShubuh).subtract(esModeDuration, 'minutes'),moment(mShubuh).add(esModeDuration, 'minutes'))) {
      energy_saving('off');
    }
    // ES Shuruq
    if(moment(mNow).isBetween(moment(mShuruq).subtract(esModeDuration, 'minutes'),moment(mShuruq).add(esModeDuration, 'minutes'))) {
      energy_saving('off');
    }
    // ES Dzuhur
    if(moment(mNow).isBetween(moment(mDzuhur).subtract(esModeDuration, 'minutes'),moment(mDzuhur).add(esModeDuration, 'minutes'))) {
      energy_saving('off');
    }
    // ES Ashar
    if(moment(mNow).isBetween(moment(mAshar).subtract(esModeDuration, 'minutes'),moment(mAshar).add(esModeDuration, 'minutes'))) {
      energy_saving('off');
    }
    // ES Maghrib
    if(moment(mNow).isBetween(moment(mMaghrib).subtract(esModeDuration, 'minutes'),moment(mMaghrib).add(esModeDuration, 'minutes'))) {
      energy_saving('off');
    }
    // ES Isya
    if(moment(mNow).isBetween(moment(mIsya).subtract(esModeDuration, 'minutes'),moment(mIsya).add(esModeDuration, 'minutes'))) {
      energy_saving('off');
    }
  }
  // Jumbotron Mode
  if(jumboMode == 1){
    $('.jumbotron').show();
    // JB Shubuh
    if(moment(mNow).isBetween(moment(mShubuh).subtract(jumboModeDuration, 'minutes'),moment(mShubuh).add(jumboModeDuration, 'minutes'))) {
      $('.jumbotron').hide();
    }
    // JB Shuruq
    if(moment(mNow).isBetween(moment(mShuruq).subtract(jumboModeDuration, 'minutes'),moment(mShuruq).add(jumboModeDuration, 'minutes'))) {
      $('.jumbotron').hide();
    }
    // JB Dzuhur
    if(moment(mNow).isBetween(moment(mDzuhur).subtract(jumboModeDuration, 'minutes'),moment(mDzuhur).add(jumboModeDuration, 'minutes'))) {
      $('.jumbotron').hide();
    }
    // JB Ashar
    if(moment(mNow).isBetween(moment(mAshar).subtract(jumboModeDuration, 'minutes'),moment(mAshar).add(jumboModeDuration, 'minutes'))) {
      $('.jumbotron').hide();
    }
    // JB Maghrib
    if(moment(mNow).isBetween(moment(mMaghrib).subtract(jumboModeDuration, 'minutes'),moment(mMaghrib).add(jumboModeDuration, 'minutes'))) {
      $('.jumbotron').hide();
    }
    // JB Isya
    if(moment(mNow).isBetween(moment(mIsya).subtract(jumboModeDuration, 'minutes'),moment(mIsya).add(jumboModeDuration, 'minutes'))) {
      $('.jumbotron').hide();
    }
  }
  // Scheduled Murattal
  if(smShubuhMode == 1){
    if(moment(mNow).isBetween(moment(mShubuh).subtract(smShubuhAutoplay, 'minutes'),moment(mShubuh))) {
      scheduledMurattal(smShubuhSurah);
    }
  }
  if(smDzuhurMode == 1){
    if(moment().day() != 5) {
      if(moment(mNow).isBetween(moment(mDzuhur).subtract(smDzuhurAutoplay, 'minutes'),moment(mDzuhur))) {
        scheduledMurattal(smDzuhurSurah);
      }
    }
  }
  if(smJumatMode == 1){
    if(moment().day() == 5) {
      if(moment(mNow).isBetween(moment(mDzuhur).subtract(smJumatAutoplay, 'minutes'),moment(mDzuhur))) {
        scheduledMurattal(smJumatSurah);
      }
    }
  }
  if(smAsharMode == 1){
    if(moment(mNow).isBetween(moment(mAshar).subtract(smAsharAutoplay, 'minutes'),moment(mAshar))) {
      scheduledMurattal(smAsharSurah);
    }
  }
  if(smMaghribMode == 1){
    if(moment(mNow).isBetween(moment(mMaghrib).subtract(smMaghribAutoplay, 'minutes'),moment(mMaghrib))) {
      scheduledMurattal(smMaghribSurah);
    }
  }
  if(smIsyaMode == 1){
    if(moment(mNow).isBetween(moment(mIsya).subtract(smIsyaAutoplay, 'minutes'),moment(mIsya))) {
      scheduledMurattal(smIsyaSurah);
    }
  }
  if(smMorningMode == 1){
    if(moment(mNow).format('HH:mm') === moment(mShubuh).add(smMorningPlayin, 'minutes').format('HH:mm')) {
      scheduledMurattal(smMorningAudio);
    }
  }
  if(smEveningMode == 1){
    if(moment(mNow).format('HH:mm') === moment(mAshar).add(smEveningPlayin, 'minutes').format('HH:mm')) {
      scheduledMurattal(smEveningAudio);
    }
  }
  // Shubuh | Before
  if(moment(mNow).isBetween(moment(extra + ' 00:00'), moment(mShubuh))) {
    toastShalat(tShubuh,moment(mShubuh).locale('en').format('YYYY/MM/DD HH:mm:ss'),'');
  }
  // Shubuh | On
  if(moment(mNow).format('HH:mm') === moment(mShubuh).format('HH:mm')) {
    $('.col-shubuh').addClass('col-active');
    now_adzan(tShubuh,moment(mShubuh).locale(timeLocale).format('HH:mm'),iqoShubuh,0);
    toastShalat(tShubuh,'',tNow);
  }
  // Shubuh | After
  if(moment(mNow).isBetween(moment(mShubuh), moment(mShuruq))) {
    $('.col-shubuh').addClass('col-active');
    toastShalat(tShuruq,moment(mShuruq).locale('en').format('YYYY/MM/DD HH:mm:ss'),'');
  }
  if(moment(mNow).isBetween(moment(mShubuh),moment(mShubuh).add(15, 'minutes'))) {
    toastShalat(tShubuh,'',tNow);
  }
  // Shuruq | On
  if(moment(mNow).format('HH:mm') === moment(mShuruq).format('HH:mm')) {
    $('.col-shuruq').addClass('col-active');
    now_shuruq(tShuruq,moment(mShuruq).locale(timeLocale).format('HH:mm'),moment(mShuruq).locale(timeLocale).add(shuruqDuration, 'minutes').format('HH:mm'));
    toastShalat(tShuruq,'',tNow);
  }
  // Shuruq | After
  if(moment(mNow).isBetween(moment(mShuruq), moment(mDzuhur))) {
    if(moment().day() == 5) {
      if(jumatMode == 1) {
        toastShalat(tJumat,moment(mDzuhur).locale('en').format('YYYY/MM/DD HH:mm:ss'),'');
      } else {
        toastShalat(tDzuhur,moment(mDzuhur).locale('en').format('YYYY/MM/DD HH:mm:ss'),'');
      }
    } else {
      toastShalat(tDzuhur,moment(mDzuhur).locale('en').format('YYYY/MM/DD HH:mm:ss'),'');
    }
  }
  if(moment(mNow).isBetween(moment(mShuruq),moment(mShuruq).add(shuruqDuration, 'minutes'))) {
    $('.col-shuruq').addClass('col-active');
    now_shuruq(tShuruq,moment(mShuruq).locale(timeLocale).format('HH:mm'),moment(mShuruq).locale(timeLocale).add(shuruqDuration, 'minutes').format('HH:mm'));
  }
  // Dzuhur | On
  if(moment(mNow).format('HH:mm') === moment(mDzuhur).format('HH:mm')) {
    $('.col-dzuhur').addClass('col-active');
    if(moment().day() == 5) {
      if(jumatMode == 1) {
        now_adzan(tJumat,moment(mDzuhur).locale(timeLocale).format('HH:mm'),iqoDzuhur,1);
        toastShalat(tJumat,'',tNow);
      } else {
        now_adzan(tDzuhur,moment(mDzuhur).locale(timeLocale).format('HH:mm'),iqoDzuhur,0);
        toastShalat(tDzuhur,'',tNow);
      }
    } else {
      now_adzan(tDzuhur,moment(mDzuhur).locale(timeLocale).format('HH:mm'),iqoDzuhur,0);
      toastShalat(tDzuhur,'',tNow);
    }
  }
  // Dzuhur | After
  if(moment(mNow).isBetween(moment(mDzuhur), moment(mAshar))) {
    $('.col-dzuhur').addClass('col-active');
    toastShalat(tAshar,moment(mAshar).locale('en').format('YYYY/MM/DD HH:mm:ss'),'');
  }
  if(moment(mNow).isBetween(moment(mDzuhur),moment(mDzuhur).add(15, 'minutes'))) {
    if(moment().day() == 5) {
      if(jumatMode == 1) {
        toastShalat(tJumat,'',tNow);
      } else {
        toastShalat(tDzuhur,'',tNow);
      }
    } else {
      toastShalat(tDzuhur,'',tNow);
    }
  }
  // Ashar | On
  if(moment(mNow).format('HH:mm') === moment(mAshar).format('HH:mm')) {
    $('.col-ashar').addClass('col-active');
    now_adzan(tAshar,moment(mAshar).locale(timeLocale).format('HH:mm'),iqoAshar,0);
    toastShalat(tAshar,'',tNow);
  }
  // Ashar | After
  if(moment(mNow).isBetween(moment(mAshar), moment(mMaghrib))) {
    $('.col-ashar').addClass('col-active');
    toastShalat(tMaghrib,moment(mMaghrib).locale('en').format('YYYY/MM/DD HH:mm:ss'),'');
  }
  if(moment(mNow).isBetween(moment(mAshar),moment(mAshar).add(15, 'minutes'))) {
    toastShalat(tAshar,'',tNow);
  }
  // Maghrib | On
  if(moment(mNow).format('HH:mm') === moment(mMaghrib).format('HH:mm')) {
    $('.col-maghrib').addClass('col-active');
    now_adzan(tMaghrib,moment(mMaghrib).locale(timeLocale).format('HH:mm'),iqoMaghrib,0);
    toastShalat(tMaghrib,'',tNow);
  }
  // Maghrib | After
  if(moment(mNow).isBetween(moment(mMaghrib), moment(mIsya))) {
    $('.col-maghrib').addClass('col-active');
    toastShalat(tIsya,moment(mIsya).locale('en').format('YYYY/MM/DD HH:mm:ss'),'');
  }
  if(moment(mNow).isBetween(moment(mMaghrib),moment(mMaghrib).add(15, 'minutes'))) {
    toastShalat(tMaghrib,'',tNow);
  }
  // Isya | On
  if(moment(mNow).format('HH:mm') === moment(mIsya).format('HH:mm')) {
    $('.col-isya').addClass('col-active');
    now_adzan(tIsya,moment(mIsya).locale(timeLocale).format('HH:mm'),iqoIsya,0);
    toastShalat(tIsya,'',tNow);
  }
  // Isya | After
  if(moment(mNow).isBetween(moment(mIsya), moment(extra + ' 23:59'))) {
    $('.col-isya').addClass('col-active');
    toastShalat(tShubuh,moment(mShubuh).locale('en').add(1, 'days').format('YYYY/MM/DD HH:mm:ss'),'');
  }
  if(moment(mNow).isBetween(moment(mIsya),moment(mIsya).add(15, 'minutes'))) {
    toastShalat(tIsya,'',tNow);
  }
  // Check Midnight
  if(moment(mNow).locale('en').format('HH:mm') === '00:00') {
    getTodayShalat();
  }
  // Set Background Color Shalat
  if(!isPreview){
    $('.row-shalat > .col').css("background", ColorLuminance(primaryColor, -0.15));
    $('.row-shalat > .col.col-active').css("background", ColorLuminance(primaryColor, -0.5));
  }
}

// Prayer Times Calculation
// Resync Reminder
function resync_reminder() {
  if(shalatMethod == 'kemenag') {
    db.jadwal.toCollection().count(function (count) {
      if(moment().isSameOrAfter(moment(localStorage.getItem("masajid_jadwalSync")).add(count - 15, 'days'))){
        $('.container-fluid').addClass('startResync');
        $('.col-runningtext').addClass('resync');
      }
    });
  } else {
    db.schedule.toCollection().count(function (count) {
      if(moment().isSameOrAfter(moment(localStorage.getItem("masajid_jadwalSync")).add(count - 15, 'days'))){
        $('.container-fluid').addClass('startResync');
        $('.col-runningtext').addClass('resync');
      }
    });
  }
}

// Check Shalat Time Calculation Method
if(shalatMethod == 'kemenag') {
  if(isPreview){
    function getTodayShalat() {
      var pvNow = new Date(),
        pvDay = pvNow.getDate(),
        pvMonth = pvNow.getMonth()+1,
        pvYear = pvNow.getFullYear();
      $.getJSON('https://api-masajid-local.b-cdn.net/v1/sholat/jadwal/1225/'+pvYear+'/'+pvMonth+'/'+pvDay, function(data) {
        extra = moment().format('YYYY-MM-DD') + ' ';
        shubuh = moment(extra + schedule.fajr).locale(timeLocale).add(adjShubuh,'minutes').format('h:mm');
        shuruq = moment(extra + schedule.sunrise).locale(timeLocale).add(adjShuruq,'minutes').format('h:mm');
        dzuhur = moment(extra + schedule.dhuhr).locale(timeLocale).add(adjDzuhur,'minutes').format('h:mm');
        ashar = moment(extra + schedule.asr).locale(timeLocale).add(adjAshar,'minutes').format('h:mm');
        maghrib = moment(extra + schedule.maghrib).locale(timeLocale).add(adjMaghrib,'minutes').format('h:mm');
        isya = moment(extra + schedule.isha).locale(timeLocale).add(adjIsya,'minutes').format('HH:mm');

        $('.col-shubuh .shalat-time').html('Waqt ' + shubuh);
        //$('.col-shubuh .iqamah-time').html(tIqomahText + ' ' + moment(extra + shubuh).locale(timeLocale).add(iqoShubuh,'minutes').format('HH:mm'));
        $('.col-shuruq .shalat-time').html('Waqt ' + shuruq);
        $('.col-shuruq .iqamah-time').html(shuruq + ' - ' + moment(extra + shuruq).locale(timeLocale).add(shuruqDuration,'minutes').format('HH:mm'));
        $('.col-dzuhur .shalat-time').html('Waqt ' + dzuhur);
        //$('.col-dzuhur .iqamah-time').html(tIqomahText + ' ' + moment(extra + dzuhur).locale(timeLocale).add(iqoDzuhur,'minutes').format('HH:mm'));
        $('.col-ashar .shalat-time').html('Waqt ' + ashar);
        //$('.col-ashar .iqamah-time').html(tIqomahText + ' ' + moment(extra + ashar).locale(timeLocale).add(iqoAshar,'minutes').format('HH:mm'));
        $('.col-maghrib .shalat-time').html('Waqt ' + maghrib);
        $('.col-maghrib .iqamah-time').html(maghrib);
        $('.col-isya .shalat-time').html('Waqt ' + isya);
        //$('.col-isya .iqamah-time').html(tIqomahText + ' ' + moment(extra + isya).locale(timeLocale).add(iqoIsya,'minutes').format('HH:mm'));
      });
    }
  } else {
    function indo_getListShalat(kodeKota) {
      db.jadwal.toCollection().count(function (count) {
        if(count < 360 * liveData[0].lic.duration) {
          var now = new Date();
          for (var i = 0; i < 12 * liveData[0].lic.duration; i++) {
            var future = new Date(now.getFullYear(), now.getMonth() + i, 1);
            var month = future.getMonth() + 1;
            var year = future.getFullYear();
            $.getJSON('https://api-masajid-local.b-cdn.net/v1/sholat/jadwal/'+kodeKota+'/'+year+'/'+month, function(data) {
              return db.transaction("rw", db.jadwal, function () {
                $.each(data.data.jadwal, function(key,value) {
                  db.jadwal.add({tanggal: value.tanggal, subuh: value.subuh, terbit: value.terbit, dzuhur: value.dzuhur, ashar: value.ashar, maghrib: value.maghrib, isya: value.isya});
                });
              }).then(function(){
                localStorage.setItem("masajid_jadwalSync", moment());
              }).catch(function (e) {
                log(e, "error");
              });
            });
          }
        }
      });
    }
    indo_getListShalat(locationID);
    function getTodayShalat() {
      return db.jadwal.where('tanggal').anyOf(moment().locale('id').format('dddd[,] L'))
        .each(function(jadwal) {
          extra = moment().format('YYYY-MM-DD') + ' ';
          shubuh = moment(extra + schedule.fajr).locale(timeLocale).add(adjShubuh,'minutes').format('h:mm');
          shuruq = moment(extra + schedule.sunrise).locale(timeLocale).add(adjShuruq,'minutes').format('h:mm');
          dzuhur = moment(extra + schedule.dhuhr).locale(timeLocale).add(adjDzuhur,'minutes').format('h:mm');
          ashar = moment(extra + schedule.asr).locale(timeLocale).add(adjAshar,'minutes').format('h:mm');
          maghrib = moment(extra + schedule.maghrib).locale(timeLocale).add(adjMaghrib,'minutes').format('h:mm');
          isya = moment(extra + schedule.isha).locale(timeLocale).add(adjIsya,'minutes').format('HH:mm');

          $('.col-shubuh .shalat-time').html('Waqt ' + shubuh);
          //$('.col-shubuh .iqamah-time').html(tIqomahText + ' ' + moment(extra + shubuh).locale(timeLocale).add(iqoShubuh,'minutes').format('HH:mm'));
          $('.col-shuruq .shalat-time').html('Waqt ' + shuruq);
          $('.col-shuruq .iqamah-time').html(shuruq + ' - ' + moment(extra + shuruq).locale(timeLocale).add(shuruqDuration,'minutes').format('HH:mm'));
          $('.col-dzuhur .shalat-time').html('Waqt ' + dzuhur);
          //$('.col-dzuhur .iqamah-time').html(tIqomahText + ' ' + moment(extra + dzuhur).locale(timeLocale).add(iqoDzuhur,'minutes').format('HH:mm'));
          $('.col-ashar .shalat-time').html('Waqt ' + ashar);
          //$('.col-ashar .iqamah-time').html(tIqomahText + ' ' + moment(extra + ashar).locale(timeLocale).add(iqoAshar,'minutes').format('HH:mm'));
          $('.col-maghrib .shalat-time').html('Waqt ' + maghrib);
          $('.col-maghrib .iqamah-time').html(maghrib);
          $('.col-isya .shalat-time').html('Waqt ' + isya);
          //$('.col-isya .iqamah-time').html(tIqomahText + ' ' + moment(extra + isya).locale(timeLocale).add(iqoIsya,'minutes').format('HH:mm'));
        });
    }
  }
} else {
  if(isPreview){
    function getTodayShalat() {
      var pvNow = new Date(),
        pvDay = pvNow.getDate(),
        pvMonth = pvNow.getMonth()+1,
        pvYear = pvNow.getFullYear();
      var api = 'https://api-masajid-intl.b-cdn.net/v1/timings/'+pvDay+'-'+pvMonth+'-'+pvYear+'?latitude='+locationID.split(',')[0]+'&longitude='+locationID.split(',')[1]+'&method='+shalatMethod+'&shafaq='+shafaq+'&school='+school+'&midnightMode='+midnightMode+'&latitudeAdjustmentMethod='+lam;
      $.getJSON(api, function(data) {
        extra = moment().format('YYYY-MM-DD') + ' ';
        shubuh = moment(extra + schedule.fajr).locale(timeLocale).add(adjShubuh,'minutes').format('h:mm');
        shuruq = moment(extra + schedule.sunrise).locale(timeLocale).add(adjShuruq,'minutes').format('h:mm');
        dzuhur = moment(extra + schedule.dhuhr).locale(timeLocale).add(adjDzuhur,'minutes').format('h:mm');
        ashar = moment(extra + schedule.asr).locale(timeLocale).add(adjAshar,'minutes').format('h:mm');
        maghrib = moment(extra + schedule.maghrib).locale(timeLocale).add(adjMaghrib,'minutes').format('h:mm');
        isya = moment(extra + schedule.isha).locale(timeLocale).add(adjIsya,'minutes').format('HH:mm');

        $('.col-shubuh .shalat-time').html('Waqt ' + shubuh);
        //$('.col-shubuh .iqamah-time').html(tIqomahText + ' ' + moment(extra + shubuh).locale(timeLocale).add(iqoShubuh,'minutes').format('HH:mm'));
        $('.col-shuruq .shalat-time').html('Waqt ' + shuruq);
        $('.col-shuruq .iqamah-time').html(shuruq + ' - ' + moment(extra + shuruq).locale(timeLocale).add(shuruqDuration,'minutes').format('HH:mm'));
        $('.col-dzuhur .shalat-time').html('Waqt ' + dzuhur);
        //$('.col-dzuhur .iqamah-time').html(tIqomahText + ' ' + moment(extra + dzuhur).locale(timeLocale).add(iqoDzuhur,'minutes').format('HH:mm'));
        $('.col-ashar .shalat-time').html('Waqt ' + ashar);
        //$('.col-ashar .iqamah-time').html(tIqomahText + ' ' + moment(extra + ashar).locale(timeLocale).add(iqoAshar,'minutes').format('HH:mm'));
        $('.col-maghrib .shalat-time').html('Waqt ' + maghrib);
        $('.col-maghrib .iqamah-time').html(maghrib);
        $('.col-isya .shalat-time').html('Waqt ' + isya);
        //$('.col-isya .iqamah-time').html(tIqomahText + ' ' + moment(extra + isya).locale(timeLocale).add(iqoIsya,'minutes').format('HH:mm'));
      });
    }
  } else {
    // AlAdhan Function Here
    function intl_getListShalat(lat,long,method,shafaq,school,midnightMode,lam) {
      db.schedule.toCollection().count(function (count) {
        if(count < 360 * liveData[0].lic.duration) {
          // db.schedule.clear();
          var now = new Date();
          for (var i = 0; i < 12 * liveData[0].lic.duration; i++) {
            var future = new Date(now.getFullYear(), now.getMonth() + i, 1);
            var month = future.getMonth() + 1;
            var year = future.getFullYear();
            $.getJSON('https://api-masajid-intl.b-cdn.net/v1/calendar?latitude='+lat+'&longitude='+long+'&method='+method+'&shafaq='+shafaq+'&school='+school+'&midnightMode='+midnightMode+'&latitudeAdjustmentMethod='+lam+'&month='+month+'&year='+year, function(data) {
              return db.transaction("rw", db.schedule, function () {
                $.each(data.data, function(key,value) {
                  db.schedule.add({date: value.date.gregorian.date, fajr: value.timings.Fajr.split(" ")[0], sunrise: value.timings.Sunrise.split(" ")[0], dhuhr: value.timings.Dhuhr.split(" ")[0], asr: value.timings.Asr.split(" ")[0], maghrib: value.timings.Maghrib.split(" ")[0], isha: value.timings.Isha.split(" ")[0]});
                });
              }).then(function(){
                localStorage.setItem("masajid_jadwalSync", moment());
              }).catch(function (e) {
                log(e, "error");
              });
            });
          }
        }
      });
    }
    intl_getListShalat(locationID.split(',')[0],locationID.split(',')[1],shalatMethod,shafaq,school,midnightMode,lam);
    function getTodayShalat() {
      return db.schedule.where('date').anyOf(moment().locale('id').format('DD-MM-YYYY'))
        .each(function(schedule) {
          extra = moment().format('YYYY-MM-DD') + ' ';
          shubuh = moment(extra + schedule.fajr).locale(timeLocale).add(adjShubuh,'minutes').format('h:mm');
          shuruq = moment(extra + schedule.sunrise).locale(timeLocale).add(adjShuruq,'minutes').format('h:mm');
          dzuhur = moment(extra + schedule.dhuhr).locale(timeLocale).add(adjDzuhur,'minutes').format('h:mm');
          ashar = moment(extra + schedule.asr).locale(timeLocale).add(adjAshar,'minutes').format('h:mm');
          maghrib = moment(extra + schedule.maghrib).locale(timeLocale).add(adjMaghrib,'minutes').format('h:mm');
          isya = moment(extra + schedule.isha).locale(timeLocale).add(adjIsya,'minutes').format('HH:mm');

          $('.col-shubuh .shalat-time').html('Waqt ' + shubuh);
          //$('.col-shubuh .iqamah-time').html(tIqomahText + ' ' + moment(extra + shubuh).locale(timeLocale).add(iqoShubuh,'minutes').format('HH:mm'));
          $('.col-shuruq .shalat-time').html('Waqt ' + shuruq);
          $('.col-shuruq .iqamah-time').html(shuruq + ' - ' + moment(extra + shuruq).locale(timeLocale).add(shuruqDuration,'minutes').format('HH:mm'));
          $('.col-dzuhur .shalat-time').html('Waqt ' + dzuhur);
          //$('.col-dzuhur .iqamah-time').html(tIqomahText + ' ' + moment(extra + dzuhur).locale(timeLocale).add(iqoDzuhur,'minutes').format('HH:mm'));
          $('.col-ashar .shalat-time').html('Waqt ' + ashar);
          //$('.col-ashar .iqamah-time').html(tIqomahText + ' ' + moment(extra + ashar).locale(timeLocale).add(iqoAshar,'minutes').format('HH:mm'));
          $('.col-maghrib .shalat-time').html('Waqt ' + maghrib);
          $('.col-maghrib .iqamah-time').html(maghrib);
          $('.col-isya .shalat-time').html('Waqt ' + isya);
          //$('.col-isya .iqamah-time').html(tIqomahText + ' ' + moment(extra + isya).locale(timeLocale).add(iqoIsya,'minutes').format('HH:mm'));
        });
    }
  }
}
getTodayShalat();

// Clear Database Function
function clear_data() {
  db.jadwal.clear();
  db.schedule.clear();
  setTimeout(function(){
    hardReload();
  }, 1000);
}
$("body").on("click", ".startResync", function(evt) {
  clear_data();
});

// Configuration Popup
//var settingModal = new bootstrap.Modal(document.getElementById('settingModal'));
$("body").on("click", ".container-fluid", function(evt) {
  //if(isPreview) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  // } else {
  //   settingModal.show();
  // }
});

// Focus button on modal shown
$(document).on('shown.bs.modal', '#settingModal', function(e) {
  $('#btn-sync').focus();
});

// Open settings modal if press enter
$(document).on('keypress',function(e) {
  if(!isPreview){
    if(e.keyCode == 13 && !$('body').hasClass('modal-open')) {
      settingModal.show();
    }
  }
});
$(document).on('keydown',function(e) {
  if(e.keyCode == 39 && $('body').hasClass('modal-open')) {
    $('#btn-logout').focus();
  }
  if(e.keyCode == 37 && $('body').hasClass('modal-open')) {
    $('#btn-sync').focus();
  }
});

// Button Force Sync
$("body").on("click", "#btn-sync", function(evt) {
  if (navigator.onLine) {
    localStorage.setItem('masajid_assetVersion', Date.now());
    hardReload();
  } else {
    alert('Please connect to wifi first to force sync!');
  }
});

// Button Logout
$("body").on("click", "#btn-logout", function(evt) {
  logoutMasjid();
});

// Preview Color Panel
$("body").on("click", ".panel-toggler", function() {
  $("#preview-panel").toggleClass("panel-active");
});
if(isPreview){
  var colorPicker = new iro.ColorPicker("#picker", {
    width: 280,
    color: "#006dd8",
    layout: [
      {
        component: iro.ui.Box,
      },
      {
        component: iro.ui.Slider,
        options: {
          id: 'hue-slider',
          sliderType: 'hue'
        }
      }
    ]
  });
  colorPicker.on('input:end', function(color) {
    console.log(color.hexString);
    $('.row-header .date-now').css("background", "linear-gradient(to right, " + ColorLuminance(color.hexString, -0.9) + " 0%, " + ColorLuminance(color.hexString, -0.1) + " 70%)");
    $('body').get(0).style.setProperty('--primary', color.hexString);
    $('body').get(0).style.setProperty('--primaryDark', ColorLuminance(color.hexString, -0.5));
    $('body').get(0).style.setProperty('--primaryLight', ColorLuminance(color.hexString, 0.2));
    $('.row-shalat > .col').css("background", ColorLuminance(color.hexString, -0.15));
    $('.row-shalat > .col.col-active').css("background", ColorLuminance(color.hexString, -0.5));
    if(themeLayout == '2') {
      $('.row-header .masjid-id').css("background", "linear-gradient(to right, " + ColorLuminance(color.hexString, -0.4) + " 0%, " + ColorLuminance(color.hexString, -0.1) + " 70%)");
    }
    if(themeLayout == '3') {
      $('body:not(layout-rtl) .clip-wrapper').css("background", "linear-gradient(to right, " + ColorLuminance(color.hexString, -0.5) + " 0%, " + ColorLuminance(color.hexString, -0.1) + " 70%)");
      $('body.layout-rtl .clip-wrapper').css("background", "linear-gradient(to left, " + ColorLuminance(color.hexString, -0.5) + " 0%, " + ColorLuminance(color.hexString, -0.1) + " 70%)");
    }
  });
}

// RUN TIMEOUT LOOP - 1000ms
function runTimeout_1000ms() {
  setTime();
  potraitClock();
  try {
    checkUpdate(shubuh,shuruq,dzuhur,ashar,maghrib,isya);
  } catch(err) {}
  setTimeout(runTimeout_1000ms, 1000);
}
runTimeout_1000ms();

// RUN TIMEOUT LOOP - 5000ms
function runTimeout_5000ms() {
  refreshData();
  setTimeout(runTimeout_5000ms, 5000);
}
runTimeout_5000ms();

// RUN TIMEOUT LOOP - 60000ms
function runTimeout_60000ms() {
  if(!isPreview){
    resync_reminder();
  }
  checkExpiration();
  setTimeout(runTimeout_60000ms, 60000);
}
runTimeout_60000ms();
