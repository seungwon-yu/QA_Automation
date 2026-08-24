# Code Convention

## 1. String

문자열을 처리할 때는 쌍따옴표를 사용한다.

```js
const status = "running";
```

## 2. Semicolon

문장이 종료될 때는 세미콜론을 붙인다.

```js
const score = 0;
engine.start();
```

## 3. Naming

함수명과 변수명은 카멜케이스로 작성한다.

```js
const bestScore = 0;

function updatePlayer() {
  return bestScore;
}
```

생성자 함수명과 클래스명의 첫 글자는 대문자로 작성한다.

```js
class GameEngine {}

function Person() {}
```

## 4. Basic Naming Rules

| Element | Rule | Example |
| --- | --- | --- |
| 클래스명 | `UpperCamelCase`를 사용하고 단어마다 대문자로 시작한다. | `User`, `MemberProfile`, `PaymentService` |
| 인터페이스 | 보통 클래스와 동일하게 작성하며, 필요에 따라 `I` 접두어를 사용할 수 있다. Java에서는 일반적으로 붙이지 않는다. | `UserRepository`, `PaymentStrategy` |
| 추상 클래스 | `Abstract` 접두사 또는 `Base` 접두어/접미사를 사용한다. | `AbstractController`, `BaseEntity` |
| 예외 클래스 | `Exception`으로 끝낸다. | `InvalidTokenException`, `UserNotFoundException` |
| DTO | `Dto`, `Request`, `Response` 등 역할을 나타내는 접미사를 사용한다. | `UserDto`, `LoginRequest`, `SignupResponse` |
| Entity | 도메인 중심 이름을 단수형으로 사용한다. | `User`, `Post`, `OrderItem` |
| 서비스 클래스 | `Service`로 끝낸다. | `UserService`, `AuthService` |
| 컨트롤러 클래스 | `Controller`로 끝낸다. | `UserController`, `AuthController` |
| 설정 클래스 | `Config`로 끝낸다. | `SecurityConfig`, `WebMvcConfig` |
| 유틸 클래스 | `Util` 또는 `Utils`로 끝낸다. | `DateUtils`, `FileUtil` |

## 5. Names To Avoid

| Avoid | Reason |
| --- | --- |
| `Data`, `Manager`, `Info` | 의미가 너무 모호하다. |
| `Usr`, `Accnt` 등 과도한 약어 | 처음 보는 사람이 이해하기 어렵다. |
| 너무 길거나 구체적이지 않은 클래스명 | 유지보수가 어렵다. |

## 6. One Statement Per Line

가독성을 위해 한 줄에는 하나의 문장만 작성한다.

```js
const score = 0;
const status = "ready";
```

## 7. Comment Indentation

주석은 설명하려는 구문에 맞춰 들여쓰기한다.

```js
function someFunction() {
  const value = 1;

  // statement에 관한 주석
  return value;
}
```

## 8. Operator Spacing

연산자 사이에는 공백을 추가한다.

```js
const total = a + b + c + d;
```

## 9. Comma Spacing

콤마 다음에 값이 올 경우 공백을 추가한다.

```js
const values = [1, 2, 3, 4];
```

## 10. Why This Convention Matters

- 팀원끼리 코드를 공유할 때 일관성 있는 코드를 작성하기 위해 사용한다.
- 코드 리뷰와 유지보수 과정에서 서로 이해하기 쉬운 코드를 유지한다.
- 포트폴리오에서 협업 기준을 세우고 지키는 역량을 보여준다.
