/*
	Intensify by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$header = $('#header');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly').scrolly({
				offset: function() {
					return $header.height();
				}
			});

		// Menu.
			$('#menu')
				.append('<a href="#menu" class="close"></a>')
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right'
				});

	});

})(jQuery);


// 사이드 바 js
const dropbtn = document.querySelector('.dropbtn');
const dropdownContent = document.querySelector('.dropdown-content');
const dropbtnContent = document.querySelector('.dropbtn_content');

// 드롭다운 토글 함수
function dropdown() {
    dropdownContent.classList.toggle('show');
    if(dropbtn.style.background === ''){
        dropbtn.style.background = 'antiquewhite';
    } else{
        dropbtn.style.background = '';
    }
}

// 주소 선택 함수
function selectAddress(address_name,id,address) {
    dropbtnContent.style.color = '#252525';
    dropbtn.style.borderColor = '#fcfcfc';
    dropbtn.style.background = '';
    dropdownContent.classList.remove('show');

    if(confirm(address_name+' 주소로 변경하시겠습니까?')){
        updateUserAddress(id);
        initGeocoder(address);
        dropbtn.innerHTML = address_name;
    }


}

// 드롭다운 버튼 클릭 이벤트 핸들러 설정
if (dropbtn) {
    dropbtn.onclick = dropdown;
}

// 드롭다운 외부 클릭 시 닫기
window.onclick = (e) => {
    if (!e.target.matches('.dropbtn')) {
        const dropdowns = document.getElementsByClassName('dropdown-content');
        Array.from(dropdowns).forEach(dropdown => {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });
    }
};

function updateUserAddress(id){
    fetch('/selectAddress',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            id : id
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('서버 응답 없음');
        }
        return response.text();  // 응답 본문을 텍스트로 읽기
    })
    .then(message => {
        console.log(message);  // 서버에서 반환한 텍스트 메시지를 콘솔에 출력
        if (message.includes("선택 완료")) {
            window.location.href='/main';
            console.log('주소 선택 성공');
        } else {
            console.log('선택 오류:', message);  // 오류 메시지를 출력
        }
    })
    .catch(error => {
        console.error('오류:', error);
    });
}

//    날씨 이미지에 마우스를 가져다 대면 상세정보 띄우기
document.addEventListener('DOMContentLoaded', function() {
    const weatherInfo = document.getElementById('weatherInfo');
    const detailsInfo = document.getElementById('weatherDetails');
    fetchRecommendation();

    // 마우스를 weather-info 요소에 올리면 details 요소를 보이게 함
    weatherInfo.addEventListener('mouseenter', function() {
        detailsInfo.style.display = 'block';
    });

    // 마우스를 weather-info 요소에서 벗어나면 details 요소를 숨김
    weatherInfo.addEventListener('mouseleave', function() {
        detailsInfo.style.display = 'none';
    });

     // 요리 수준 미 선택시 저장 비 활성화
    const surveyForm = document.getElementById('surveyForm');
    const surveyRadios = document.querySelectorAll('input[name="99"]');
    const surveySubmit = document.getElementById('surveySubmit');

    let isAnyChecked = Array.from(surveyRadios).some(radio => radio.checked);

    surveySubmit.disabled = !isAnyChecked; // 체크된 라디오가 있으면 활성화

    // 라디오 버튼의 상태가 변경되면 저장 버튼 활성화
    surveyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            surveySubmit.disabled = false; // 하나라도 선택되면 활성화
        });
    });

    // 폼 제출 시 선택된 값이 없을 경우 제출을 막고 경고 메시지 표시
    surveyForm.addEventListener("submit", function(event){
        let isChecked = false;

        surveyRadios.forEach(radio => {
            if (radio.checked) {
                isChecked = true;
            }
        });

        if (!isChecked) {
            event.preventDefault();
            alert("요리 수준을 선택해주세요.");
        }
    });

});

// 주소 목록 변경시 날씨 정보 업데이트
// id를 통해 요소를 선택
const weatherInfoImage = document.getElementById('weather-info-image');
const weatherDetailsImage = document.getElementById('weather-details-image');
const weatherDetailsDiv = document.getElementById('weather-details-div');

function updateWeatherInfo(){
    weatherInfoImage.src = "/images/weather_{{weatherImageName}}.png"
    weatherInfoImage.alt = "{{weatherImageName}}"
    weatherDetailsImage.src = "/images/weather_{{weatherImageName}}.png"
    weatherDetailsImage.alt = "{{weatherImageName}}"

    weatherDetailsDiv.innerHTML = `
       <p> 현재 {{secondName}}의 날씨</p>
       <p> 기온 : {{t1h}}도</p>
       <p> 습도 : {{reh}}%</p>
       <p> 강수량 : {{rn1}}</p>
    `;
}

function fetchRecommendation(){
    fetch('/survey/recommendation')
        .then(response => response.json())
        .then(data => {
            // 추천 음식 이름 업데이트
            document.getElementById("food-name").textContent = data.name;
            document.getElementById("recommendationImage").src = `/images/foods/${data.food_id}.png`;
        })
        .catch(error => console.error("Error: ", error));
}


// "새로 고침" 버튼 클릭 시 추천 음식 가져오기
document.getElementById("refresh-button").addEventListener("click", function(event){
    event.preventDefault(); // 기본 링크 클릭 동작 방지
    fetchRecommendation();
});

// 비로그인 시 설문페이지 진입 x
document.getElementById("food-preference-link").addEventListener("click", function(event){
    if(!loggedInUser){
        event.preventDefault();
        var confirmation = confirm("개인의 취향을 반영하는 설문으로 \n로그인이 필요한 서비스 입니다. \n 로그인 페이지로 이동하시겠습니까?")
        if(confirmation){
            window.location.href = "/loginpage"
        } else {
            return;
        }
    } else {
        // 로그인이 되어 있으면 페이지 이동
        window.location.href="/surveySelect";
    }

})

/* 전체 설문 페이지 세션 별 스크롤*/
function scrollLeftCustom(sectionId){
    const container = document.querySelector(`#${sectionId} .foodContainer`);
    const scrollAmount = getScrollAmount(); // 스크롤할 거리

    container.scrollBy({
        top: 0,
        left: -scrollAmount, //왼쪽 이동 거리
        behavior: 'smooth'
    });
}

function scrollRightCustom(sectionId){
    const container = document.querySelector(`#${sectionId} .foodContainer`);
    const scrollAmount = getScrollAmount(); // 스크롤할 거리

    container.scrollBy({
        top: 0,
        left: scrollAmount, //오른쪽 이동 거리
        behavior: 'smooth'
    });
}

function getScrollAmount(){
    if(window.matchMedia("(max-width: 930px)").matches){
        // 화면 크기가 736px 이하일 때는 한 div 씩 이동
        return 320;
    } else{
        return 640;
    }
}