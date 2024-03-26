
window.addEventListener('load', function () {

    slider('.swiper');
    slider('.swiper2', {
        slidesPerView: 3,
        spaceBetween: 20,
        
        loop: false,
        
    });

});

document.addEventListener('DOMContentLoaded', function () {
    var nextButton = document.getElementById('next-slide');
    var swiperNextButton = document.querySelector('.swiper-button-next');
    var btnCollections = document.querySelectorAll('.btn-collection');
    
    const joinImgElement = document.querySelector('.join-img');
    joinImgElement.addEventListener('click', function() {
        window.open('https://www.youtube.com/watch?v=geFi-ZpN2ZM', '_blank');
    });
    
    
    
    nextButton.addEventListener('click', function () {
        swiperNextButton.click();
    });
    

    var prevButton = document.getElementById('prev-slide');
    var swiperPrevButton = document.querySelector('.swiper-button-prev');

    prevButton.addEventListener('click', function () {
        swiperPrevButton.click();
    });

    
    btnCollections.forEach(function (btnCollection) {
       
        btnCollection.addEventListener('click', function () {
            hideArros(btnCollections);
            showArrow(btnCollection);
        });
    });

    statisticCounter();


});

/* Slider crate*/
function slider(element, options) {
    if (typeof options === 'undefined') {
        options = {};
    }
    new Swiper(element, {
        slidesPerView: options.slidesPerView ? options.slidesPerView : 1.2,
        spaceBetween: options.spaceBetween ? options.spaceBetween : 30,
        centeredSlides: options.centeredSlides ? options.centeredSlides : true,
        loop: options.loop ? options.loop : true,
        height: options.height ? options.height : 100,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 40
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 50
            },
        }
    })
}

/* Show Arrow in collectionb button */
function showArrow(btnCollection) {
    
    btnCollection.querySelector('img:last-child').classList.remove('arrow-off');
    btnCollection.querySelector('img:last-child').classList.add('arrow-on');
}

/* Hide Arrow in collections button */
function hideArros(btnCollections) {
    
    btnCollections.forEach(function (btnCollection) {
        btnCollection.re
        var img = btnCollection.querySelector('img:last-child');
        if(img.classList.contains('arrow-on')){
            img.classList.remove('arrow-on');
            img.classList.add('arrow-off');
        }
 
    });
}


/* gorus alanina girince say*/
function statisticCounter(){
    var startNumber = 0;
          var endNumber = 11658467; // sayi
          var duration = 3000; // sure
          var numberElement = document.getElementById('number');
        
          var startTime;
          function animateNumber(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = timestamp - startTime;
            var percentage = Math.min(progress / duration, 1);
            var currentNumber = Math.floor(startNumber + (endNumber - startNumber) * percentage);
            numberElement.textContent = currentNumber.toLocaleString('en-US'); // bu, noktayi virgul yapiyormus
            if (progress < duration) {
              requestAnimationFrame(animateNumber);
            }
          }
        
          // gorus alani
          var statisticSection = document.querySelector('.statistic-container');
          var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              if (entry.isIntersecting) {
                requestAnimationFrame(animateNumber);
                observer.unobserve(statisticSection); // gorus alanini durdur
              }
            });
          });
          observer.observe(statisticSection);
}