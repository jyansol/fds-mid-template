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
    // await가 붙어있다면 뒤에껀 다 promise . 이것을 아래에 작성
    // const res2 = await api.get('/todos');
    // alert(JSON.stringify(res2.data));
    drawTodoList();
  });
  //3. 문서 내부에 삽입하기

  // 로그인한 뒤에 할일 목록만 나오게 하는 코드
  rootEl.textContent = '';
  rootEl.appendChild(fragment);
}

//할 일 목록 그리는 함수
async function drawTodoList() {
  const res = await api.get('/todos');
  const list = res.data;
  //1.템플릿 복사하기
  const fragment = document.importNode(templates.todoList, true);
  //2. 내용채우고 이벤트 리스너 등록하기
  const todoListEl = fragment.querySelector('.todo-list');
  const todoFormEl = fragment.querySelector('.todo-form');
  const logoutEl = fragment.querySelector('.logout');

  //promise를 쓸 예정이 없으니까 걍 e
  logoutEl.addEventListener('click', (e) => {
    //로그아웃 절차
    //01. 토큰 삭제
    localStorage.removeItem('token');
    //02. 로그인 폼 보여주기
    drawLoginForm();
  });

  todoFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = e.target.elements.body.value;
    const res = await api.post('/todos', {
      body,
      complete: false,
    });
    if (res.status === 201) {
      drawTodoList();
    }
  });

  list.forEach((todoItem) => {
    //1.템플릿복사하고
    const fragment = document.importNode(templates.todoItem, true);
    //2.내용채우고 이벤트 리스너 등록하기
    const bodyEl = fragment.querySelector('.body');
    const todoItemEl = fragment.querySelector('.todo-item');
    bodyEl.textContent = todoItem.body;

    const deleteBtn = fragment.querySelector('.delete');
    deleteBtn.addEventListener('click', async (e) => {
      // removeChild로 작성하면 새로고침하면 디비의 자료가 남아있음. 원본(데이터)을 지워야해
      await api.delete('/todos/' + todoItem.id);
      //그 항목의 id //서버로 부터 데이터를 받아서 요청을 보낼 경로를 만들어줌
      // 사실 성공하면 잘 되기때문에 if문 작성할 필요없음
      drawTodoList();
    });

    //.문자내부에삽입
    // appendChild(fragment)하면, fragment가 비워짐!!!!!!!!!!!!!
    todoListEl.appendChild(fragment);
  });
  //3. 문서 내부에 삽입하기

  // 로그인한 뒤에 할일 목록만 나오게 하는 코드
  rootEl.textContent = '';
  rootEl.appendChild(fragment);
}

// drawLoginForm();
// token이 로컬스토리지에 저장되어있는 경우(만약 로그인을 한 상태라면)
// 바로 할일목록을 보여주고 아니라면 로그인 폼을 보여준다.
// token이 존재한다면 = truthy라면
if (localStorage.getItem('token')) {
  drawTodoList();
} else {
  drawLoginForm();
}
