회원가입 (권한 테이블 지정 해줘야함)
 - 이메일, 닉네임 중복체크
POST /users
로그인
 - 현재 로그인 상태인걸로 변경, session token 반환
GET /login/:user

회원관리
GET /users

회원정보
GET /users/:id
GET /users/:email
GET /users/:username

회원탈퇴 ( 게시글들에 "탈퇴한 사용자입니다")
팔로우 추가 / 삭제    (  팔로잉 대상 게시글 보기..? )
프론트에서 세션 만료되었을때 최근접속시간 갱신
DELETE users/:id

게시판 목록
게시판 구독
구독 게시판 목록
게시판 추가요청
게시판 추가승인 ( 승인 컬럼 변경, 매니저테이블 데이터 추가)

글목록
 - 질문글만 /  해당 질문글 + 답변글들
 - 정렬
 - 페이징
GET /articles
GET /articles/:question
GET /articles/:answer
GET /articles/:id
GET /articles/:id/answer
GET /articles/:id/questionr

글쓰기 (콘텐트를 추가하고 해당 콘텐트를 선택)
 - 답변달리면 알림 테이블에 데이터 추가
 - 이미 있는 질문 체크 ( Like 검색)
POST /articles

답변 선택 ( 알림 추가.. ? )

글수정  ( 해당 유저의 vote수로 권한 )
 - 콘텐트 추가, 
PUT /articles/:id
글 검색 ( 해시태그, 제목, 내용, 작성자 )

다음 글, 이전 글
GET articles/pre
GET articles/next

글 삭제
DELETE /articles/:id

글 (추천, 조회) 
POST /votes
PUT /articles/:id/view

해시태그 목록
해시태그 추가 ( 중복 체크 )
해시태그 내용 수정

해시태그 삭제
해시태그 검색

콘텐트 선택
댓글목록
GET /comments 모든 댓글 요청
GET /comments/{user-id}/sort-date 특정 유저의 모든 댓글 요청(날짜순-flag)
GET /comments/{user-id}/sort-title 특정 유저의 모든 댓글 요청(제목순-flag)
GET /comments/{parent} 특정 댓글을 부모로 갖는 모든 댓글 요청
GET /comments/{article} 특정 글의 모든 댓글 요청
GET /comments/{article}/{user-id} 특정 글의 특정 유저의 모든 댓글 요청
GET /comments/{article}/{id} 특정 글의 특정 댓글 요청(1)
댓글쓰기
 - 알림 테이블에 데이터 추가
POST /comments
댓글삭제
DELETE /comments/:article/:id
DELETE /comments/:article/:id
DELETE /comments/:article/:user-id

네임태그 ( @ ) : 프론트에서... ?

알림 읽음 처리
쪽지 보내기
