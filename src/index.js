// 그려지는 것 부터 확인하고 기능은 그 다음에 !

import '@babel/polyfill'; // 이 라인을 지우지 말아주세요!
import axios from 'axios';

//서버
const api = axios.create({
  baseURL: 'https://massive-answer.glitch.me/',
});

// 템플릿 폼
const templates = {
  loginForm: document.querySelector('#login-form').content,
};
const rootEl = document.querySelector('.root');

//로그인폼 그려주는 함수
function drawLoginForm() {
  //1. 템플릿 복사하기
  const fragment = document.importNode(templates.loginForm, true);
  //2. 내용채우고, 이벤트 리스너 등록하기
  const loginFormEl = fragment.querySelector('.login-form');
  loginFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    // e : 이벤트 객체
    // e.target 이벤트를 실제로 일으킨 요소 객체( 여기서는 loginFormEl )
    // e.target.elements : 폼 내부에 들어있는 요소를 편하게 가져올 수 있는 특이한 객체
    // e.target.elements.username : input 객체 => name이 username이기 때문
    // value : 사용자가 input 태그에 입력한 값
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;
    //서버 주소 안적어 줘도됨!
    const res = await api.post('/users/login', {
      username,
      password,
    });
    alert(res.data.token);
  });
  //3. 문서 내부에 삽입하기
  rootEl.appendChild(fragment);
}
drawLoginForm();
