
// 기상청의 날씨 검색 API을 $.getJSON을 이용해 호출하는 function입니다.
var API_KEY = '4xxl_HhFRSScZfx4RWUkCw';
var API_URL = 'http://localhost:9098/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtFcst'

// 사용자 위치 정보 받기 필요 (테스트 / 강남구)
var nx = 61;
var ny = 126;

function getCurrentDateTime(){

    // 날짜, 시간, 좌표에 따른 다른 값을 받아야 하므로 변수 선언 필요
    // 현재 날자 및 시간 설정

    var today = new Date(); // DATE객체 생성

    var year = today.getFullYear(); //년

    // 한자리 수로 시작하는 경우 앞자리에 0을 채워줘야
    var month = String(today.getMonth() +1).padStart(2,'0');
    var day = String(today.getDate()).padStart(2,'0');
    var hours = String(today.getHours()).padStart(2,'0');
    var minutes = String(today.getMinutes()).padStart(2,'0')

//    var base_time = `${hours}00`;
    // Determine base_time based on the minutes
    if (today.getMinutes() < 30) {
      // Subtract 1 hour and ensure it's formatted correctly
      var adjustedHours = String((today.getHours() === 0 ? 23 : today.getHours() - 1)).padStart(2, '0');
      base_time = `${adjustedHours}30`;
    } else {
      // Use the current hour
      base_time = `${hours}00`;
    }

    return {
        base_date: `${year}${month}${day}`,
        base_time: base_time
    };
}


function fetchWeatherData() {
    var { base_date, base_time } = getCurrentDateTime();
    var url = `${API_URL}?pageNo=1&numOfRows=1000&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}&authKey=${API_KEY}`;

    $.getJSON(url)
        .done(function(data) {
            processWeatherData(data);
    })
    .fail(function (jqxhr, textStatus, error) {
        console.error('날씨 정보를 불러오는데 실패!', textStatus, error);
    });
}

function processWeatherData(data) {
    try {
        var items = data?.response?.body?.items?.item;
        if (!items) {
            console.error("예보 정보 없음");
            return;
        }

        var currentBaseTime = getCurrentDateTime().base_time;
        var processedData = items
            .filter(item => item.fcstTime === currentBaseTime)
            .map(item => ({
                category: item.category,
                value: item.fcstValue,
                date: item.fcstDate,
                time: item.fcstTime
            }));

        renderWeatherData(processedData);
    } catch (error) {
        console.error('데이터 처리 중 오류 발생: ', error);
    }
}

function renderWeatherData(data) {
    const container = document.getElementById('weather-container');
    container.innerHTML = ''; // 기존 내용 지우기
    if (!data) {
        console.error("렌더링할 데이터가 없습니다.");
        return;
    }
    data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `Date: ${item.date}, Time: ${item.time}, Category: ${item.category}, Value: ${item.value}`;
        container.appendChild(li);
    });
}

function startWeatherUpdates(interValMinutes = 60) {
    fetchWeatherData();
    setInterval(fetchWeatherData, interValMinutes * 60 * 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    startWeatherUpdates();
});
