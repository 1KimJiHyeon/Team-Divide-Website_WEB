// 페이지 로딩 시 조 추첨 결과를 가져오는 함수
async function Drawer() {
    try {
        // 학생들의 정보를 가지고 옴
        const res = await axios.get('/users');
        // // 조 추첨 인원 수 정보를 가지고 옴
        const res2 = await axios.get('/user_num');

        const users = res.data;
        const user_num = res2.data;

        // 조 추첨 인원 수를 num으로 설정
        const num = Number(user_num[0].number);

        // id가 result인 것을 result로 설정
        const result = document.getElementById('result');
        result.innerHTML = '';

        // div를 resultDiv으로 생성
        const resultDiv = document.createElement('div');
        // id가 span인 것을 result로 설정
        const span = document.getElementById('span');

        // 학생들의 key를 받기위해 선언
        const users_key = [];

        // 학생들의 key들을 선언된 users_key에 key를 삽입
        Object.keys(users).map(function (key) {
            users_key.push(key);
        });

        // 학생들을 무작위로 추첨하기 위해 함수 실행
        const random_users = Random_Users(users_key)

        // 배열의 0번째부터 추출하기 위해 user를 0으로 선언
        var user = 0;
        // 1조부터 시작하기위해 team_num을 1로 선언
        var team_num = 1;

        
        while (true) {
            // 입력된 사람의 수만큼 돌다가 멈춤
            if (user !== random_users.length) {
                // 설정한 조 인원 수만큼 추첨하기 위해 쓰인 변수
                var user_last = user + num;
                // 조를 나타내는 span을 생성하여 span에 붙임
                span.innerHTML += '<span style="font-family: Yu Gothic; font-style: normal; font-weight: bold; font-size: 50px; color: rgba(84,127,224,1);">' + team_num + '조' + '</span>'
                // 순서대로 실행하는데 num의 수만큼만 돌고 div 태그로 나타냄, div 태그는 span에 붙음
                for (user; user < user_last; user++) {
                    span.innerHTML += '<div style="font-family: Yu Gothic; font-style: normal; font-weight: bold; font-size: 30px; color: black;">' + users[Object.keys(users)[random_users[user]]].name + ' (' + users[Object.keys(users)[random_users[user]]].stNum + ')' + '</div>';
                }
                // 그 다음조로 넘어감
                team_num += 1;
                // 각 팀의 사람들 이름을 담는 div를 span에 붙임
                span.innerHTML += '<div style="margin-top:15px; margin-bottom:15px; width: 1140px; height: 10px;background-color: rgba(126,158,233,1);"></div>';
            } else {
                break;
            }
        }
        // resultDiv에 span 추가
        resultDiv.appendChild(span);
        // result에 resultDiv 추가
        result.appendChild(resultDiv);
    } catch (err) {
        console.error(err);
    }
}

// 숫자를 무작위로 뽑아주는 함수 실행
function Random_Users(users_key) {
    while (true) {
        // 무작위 숫자를 담기위해 만들어진 배열
        var random_nums = [];
        //중복없는 추출된 번호들 숫자 카운트
        var count = 0;
        //중복된 수 인지 판단하는 변수
        var overl = true;
        //입력된 학생의 수만큼 무작위 번호를 생성하기위한 반복문
        while (count < users_key.length) {
            var number = 0;
            // 입력된 학생의 수사이에서의 무작위번호 추출
            number = parseInt(Math.random() * users_key.length);
            // 중복 체크
            for (var i = 0; i < count; i++) {
                if (random_nums[i] == number) {
                    overl = false;
                }
            }
            //중복이 아닐시에 random_nums 배열에 추가
            if (overl) {
                random_nums.push(number);
                count++;
            }
            //초기화
            overl = true;
        }
        // 무작위번호 배열을 반환해줌
        return random_nums;
    }
}
// 화면 로딩 시 Drawer 호출
window.onload = Drawer;