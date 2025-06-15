# Selfit
스스로 **운동을 계획하고 기록**하며, 건강한 습관을 만들어 가는 사람들을 위한 **동기부여 커뮤니티 플랫폼**입니다.

## 프로젝트 소개
- 기간: 2025.05.21 ~ 2025.06.04 (약 2주)
- 인원: 총 5명(염윤호, 고민표, 박희수, 이재원, 이창훈)

## 핵심 기능
### 1. 회원 기능
- 일반 회원가입 및 로그인
- 구글 계정으로 간편 로그인
- 마이페이지에서 기본 정보 확인 및 수정 가능
- 기록이 불필요한 사용자는 커뮤니티만 이용할 수 있도록 선택형 입력 항목 제공

### 2. 대시보드 기능
- 식단 및 운동 기록
  - 음식명 검색 후 먹은 양 입력 시 칼로리 자동 계산 (공공데이터 API 연동)
  - 운동명 검색 후 시간 입력 시 소모 칼로리 자동 계산 (공공데이터 API 연동)
  - 일자별 기록은 달력 및 차트로 확인 가능
- 체크리스트
  - 하루 최대 5개의 할 일 등록
  - 완료 여부 체크 및 수정, 삭제 가능
  - 달력에서는 날짜별 체크 항목 최대 3개 확인 가능

### 3. 커뮤니티 기능
- 비회원도 게시글 열람 가능
- 회원은 게시글 작성, 수정, 삭제 및 댓글 기능 사용 가능
- 자유게시판 형식으로 소통 공간 제공

## 아키텍처

## 개발 환경
### BACKEND
![SpringBoot](https://img.shields.io/badge/SpringBoot-6DB33F?style=flat-square&logo=spring&logoColor=white)![버전](https://img.shields.io/badge/3.4.5-555555?style=flat-square)
![SpringSecurity](https://img.shields.io/badge/Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white)![버전](https://img.shields.io/badge/Module-555555?style=flat-square)
![JPA](https://img.shields.io/badge/JPA-FF7F50?style=flat-square)![버전](https://img.shields.io/badge/Hibernate-555555?style=flat-square)
![MyBatis](https://img.shields.io/badge/MyBatis-1F6CAB?style=flat-square)![버전](https://img.shields.io/badge/3.0.3-555555?style=flat-square)
![Thymeleaf](https://img.shields.io/badge/Thymeleaf-8BC34A?style=flat-square&logo=thymeleaf)![버전](https://img.shields.io/badge/3.1.1-555555?style=flat-square)
![Validation](https://img.shields.io/badge/Validation-orange?style=flat-square)![버전](https://img.shields.io/badge/8.0.1.Final-555555?style=flat-square)
![Gson](https://img.shields.io/badge/Gson-FF6F00?style=flat-square)![버전](https://img.shields.io/badge/2.8.9-555555?style=flat-square)
![Lombok](https://img.shields.io/badge/Lombok-800080?style=flat-square)![버전](https://img.shields.io/badge/1.18.30-555555?style=flat-square)

### FRONTEND
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white)![버전](https://img.shields.io/badge/5.3.3-555555?style=flat-square)
![BootstrapIcons](https://img.shields.io/badge/Bootstrap--Icons-000000?style=flat-square)![버전](https://img.shields.io/badge/1.10.5-555555?style=flat-square)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square)![버전](https://img.shields.io/badge/0.27.2-555555?style=flat-square)
![ApexCharts](https://img.shields.io/badge/ApexCharts.js-FF4560?style=flat-square)![버전](https://img.shields.io/badge/Chart-555555?style=flat-square)
![FullCalendar](https://img.shields.io/badge/FullCalendar.js-00CED1?style=flat-square)![버전](https://img.shields.io/badge/Calendar-555555?style=flat-square)

### 개발 도구
![IntelliJ](https://img.shields.io/badge/IDEA-000000?style=flat-square&logo=intellijidea)![버전](https://img.shields.io/badge/2025.1.1.1-555555?style=flat-square)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=flat-square&logo=apachemaven)![버전](https://img.shields.io/badge/3.9.6-555555?style=flat-square)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=flat-square&logo=mariadb)![버전](https://img.shields.io/badge/10.6.22-555555?style=flat-square)
![JUnit5](https://img.shields.io/badge/JUnit5-25A162?style=flat-square&logo=junit5&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white)

## 협업 환경
![Jira](https://img.shields.io/badge/Jira-0052CC?style=flat-square&logo=jira&logoColor=white)
![Confluence](https://img.shields.io/badge/Confluence-172B4D?style=flat-square&logo=confluence&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=flat-square&logo=googlesheets&logoColor=white)
![draw.io](https://img.shields.io/badge/draw.io-F08705?style=flat-square)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white)
![eXERD](https://img.shields.io/badge/eXERD-0066CC?style=flat-square)
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)
