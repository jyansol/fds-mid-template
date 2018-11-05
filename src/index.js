// 그려지는 것 부터 확인하고 기능은 그 다음에 !

import '@babel/polyfill'; // 이 라인을 지우지 말아주세요!
import axios from 'axios';

//서버
const api = axios.create({
  baseURL: 'https://massive-answer.glitch.me/',
});

// localStorage에 token이 있으면 요청에 헤더 설정, 없으면 아무것도 하지 않음
api.interceptors.request.use(function(config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

// 템플릿 폼
const templates = {
  loginForm: document.querySelector('#login-form').content,
  todoList: document.querySelector('#todo-list').content,
  todoItem: document.querySelector('#todo-item').content,
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
    localStorage.setItem('token', res.data.token);
    // 임시 테스트 코드
    // await가 붙어있다면 뒤에껀 다 promise
    const res2 = await api.get('/todos');
    alert(JSON.stringify(res2.data));
  });
  //3. 문서 내부에 삽입하기
  rootEl.appendChild(fragment);
}
drawLoginForm();

//할 일 목록 그리는 함수
async function drawTodoList() {
  const list = [
    {
      id: 1,
      userId: 2,
      body: 'React Study',
      complete: false,
    },
    {
      id: 2,
      userId: 2,
      body: 'React Router Study',
      complete: false,
    },
  ];
  //1.템플릿 복사하기
  const fragment = document.importNode(templates.todoList, true);
  //2. 내용채우고 이벤트 리스너 등록하기
  const todoListEl = fragment.querySelector('.todo-list');

  list.forEach((todoItem) => {
    //1.템플릿복사하고
    const fragment = document.importNode(templates.todoItem, true);
    //2.내용채우고 이벤트 리스너 등록하기
    const bodyEl = fragment.querySelector('.body');
    bodyEl.textContent = todoItem.body;
    //.문자내부에삽입
    todoListEl.appendChild(fragment);
  });
  //3. 문서 내부에 삽입하기
  rootEl.appendChild(fragment);
}
drawTodoList();
