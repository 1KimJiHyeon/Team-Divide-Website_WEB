//페이지 로딩 시 학생 사용자 정보를 가져오는 함수
async function User() {
    try {
        // 학생들의 정보를 가지고 옴
        const res = await axios.get('/users');
        const users = res.data;

        // id가 std_list인 것을 std_list로 설정
        const std_list = document.getElementById('std_list');
        std_list.innerHTML = '';

        // 학생들을 학생명단에 반복적으로 화면 표시
        Object.keys(users).map(function (key) {
            // div를 userDiv으로 생성
            const userDiv = document.createElement('div');
            // span를 span으로 생성
            const span = document.createElement('span');
            // 학생 사용자의 이름과 학번을 span으로 지정함
            span.textContent = users[key].name + ' (' + users[key].stNum + ')';
            // span의 속성을 지정 (style을 바꿈 - 폰트)
            span.setAttribute("style", "font-family: Yu Gothic;font-style: normal;font-weight:normal ;font-size: 20px;");
            // button을 edit로 생성
            const edit = document.createElement('button');
            // edit를 '수정'으로 지정함
            edit.textContent = '수정';
            // edit의 속성을 지정 (style을 바꿈 - 폰트, 색상, 테두리)
            edit.setAttribute("style", " margin-left: 10px ; margin-right: 3px ;width:30px; height:25px ;background-color: rgba(255,255,255,1); border: 2px solid rgba(126,158,233,1); color: rgba(84,127,224,1);font-family: Yu Gothic;font-style: normal;font-weight: bold;font-size: 13px;")
            // edit에 event를 등록 시킴 click시 실행
            edit.addEventListener('click', async () => {
                // name, stNum prompt를 띄워 수정 값을 받는다
                const name = prompt('수정할 이름을 입력하세요');
                const stNum = prompt('수정할 학번을 입력하세요');
                // name, stNum 값을 prompt에 입력하지 않았을 경우
                if (!name || !stNum) {
                    return alert('수정할 이름과 학번을 반드시 입력하셔야합니다.');
                }
                try {
                    // key를 기준으로 수정된 name, stNum 값을 put method를 이용해 수정
                    await axios.put('/user/' + key, { name, stNum });
                    // 수정 후 User함수 호출
                    User();
                } catch (err) {
                    console.error(err);
                }
            });
            // button을 remove로 생성
            const remove = document.createElement('button');
            // remove를 '삭제'로 지정함
            remove.textContent = '삭제';
            // remove의 속성을 지정 (style을 바꿈 - 폰트, 색상, 테두리)
            remove.setAttribute("style", " width:30px; height:25px ; background-color: rgba(255,255,255,1); border: 2px solid rgba(126,158,233,1); color: rgba(84,127,224,1);font-family: Yu Gothic;font-style: normal;font-weight: bold;font-size: 13px;")
            // remove에 event를 등록 시킴 click시 실행
            remove.addEventListener('click', async () => {
                try {
                    // key를 기준으로 name, stNum 값을 delete method를 이용해 삭제
                    await axios.delete('/user/' + key);
                    // 삭제 후 User함수 호출
                    User();
                } catch (err) {
                    console.error(err);
                }
            });

            // userDiv에 span 추가
            userDiv.appendChild(span);
             // userDiv에 edit 추가
            userDiv.appendChild(edit);
            // userDiv에 remove 추가
            userDiv.appendChild(remove);
            // std_list에 userDiv 추가
            std_list.appendChild(userDiv);

            console.log(res.data);
        });
    } catch (err) {
        console.error(err);
    }
}

// 화면 로딩 시 User 호출
window.onload = User;

// student_form 제출시 실행
document.getElementById('student_form').addEventListener('submit', async (e) => {
    e.preventDefault();
    // name에 name 값을 지정
    const name = e.target.name.value;
    // stNum에 stNum 값을 지정
    const stNum = e.target.stNum.value;
    // name, stNum 값이 있는지 확인
    if (!name && !stNum) {
        return alert('학번과 이름을 입력하세요');
    } else if (!name) {
        return alert('이름을 입력하세요');
    } else if (!stNum) {
        return alert('학번을 입력하세요');
    }
    try {
        // name, stNum 값을 post method를 이용해 등록
        await axios.post('/user', { name, stNum });
        // User함수 호출
        User();
    } catch (err) {
        console.error(err);
    }
    // name 값을 ''로 지정
    e.target.name.value = '';
    // stNum 값을 ''로 지정
    e.target.stNum.value = '';
});

// studentNum_form 제출시 실행
document.getElementById('studentNum_form').addEventListener('submit', async (e) => {
    e.preventDefault();
    // number에 number 값을 지정
    const number = e.target.number.value;
    // number 값이 있는지 확인
    if (!number) {
        return alert('조 인원을 입력하세요');
    }
    try {
        // number 값을 post method를 이용해 등록
        await axios.post('/user_num', { number });
    } catch (err) {
        console.error(err);
    }
    // stNum 값을 number로 지정
    e.target.number.value = number;
});