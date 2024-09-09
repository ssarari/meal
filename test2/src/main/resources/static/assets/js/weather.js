// 초단기기상예보 json 파일 받기
// https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtFcst?pageNo=1&numOfRows=1000&dataType=XML&base_date=20210628&base_time=0630&nx=55&ny=127&authKey=4xxl_HhFRSScZfx4RWUkCw
// https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst?pageNo=1&numOfRows=1000&dataType=Json&base_date=20240909&base_time=2000&nx=61&ny=126&authKey=4xxl_HhFRSScZfx4RWUkCw
///openApi/VilageFcstInfoService_2.0/getVilageFcst
var API_KEY = '4xxl_HhFRSScZfx4RWUkCw';
var API_URL = 'https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtFcst'

// 사용자 위치 정보 받기 필요 (테스트 / 강남구)
var nx = 61;
var ny = 126;

// 기상청의 날씨 검색 api를 $.getJSON을 이용해 호출하는 함수
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

    var base_time = `${hours}00`;

    return {
        base_date: `${year}${month}${day}`,
        base_time: base_time
    };
 }


 async function fetchWeatherDate() {
    var { base_date, base_time } = getCurrentDateTime();

    var url = `${API_URL}?pageNo=1&numofRows=1000&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}&authKey=${API_KEY}`;

    try{
        var response = await fetch(url);
         if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
         }
        var data = await response.json();
        processWeatherData(data);
    } catch(error){

        console.error('날씨 정보를 불러오는데 실패!', error);
    }
}

function processWeatherData(data){
    try {
        var items = data?.response?.body?.items?.item;

        // 데이터가 없을 때 오류 메시지
        if (!items){
            console.error("예보 정보 없음");
            return;
        }

        var currentBaseTime = getCurrentDateTime().base_time;

        var processedDate = items
            .filter(item => item.fcstTime === currentBaseTime)
            .map(item => ({
                category: item.category, // 분류 : TMP (기온), PTY (강수형태), etc.
                value: item.fcstValue, // 예측 값
                date: item.fcstDate, // 예측 날짜
                time: item.fcstTime // 예측 시간
            }));

    } catch (error){
        console.error('데이터 처리 중 오류 발생: ', error);
    }
}

function renderWeatherData(data) {
    const container = document.getElementById('weather-container');
    container.innerHTML = ''; // 기존 내용 지우기
    data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `Date: ${item.date}, Time: ${item.time}, Category: ${item.category}, Value: ${item.value}`;
        container.appendChild(li);
    });
}

function startWeatherUpdates(interValMinutes = 60) {
    fetchWeatherDate();
    setInterval(fetchWeatherDate, interValMinutes * 60 * 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    startWeatherUpdates();
})

