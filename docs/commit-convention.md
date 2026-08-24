# Commit Message Convention

## 1. Commit Type

Use one of the following commit types at the beginning of the title.

| Type | Meaning |
| --- | --- |
| `Feat` | 새로운 기능 추가 |
| `Fix` | 버그 수정 |
| `Docs` | 문서 수정 |
| `Style` | 코드 formatting, 세미콜론 누락 등 코드 동작 변경이 없는 경우 |
| `Refactor` | 코드 리팩토링 |
| `Test` | 테스트 코드 추가 또는 테스트 코드 리팩토링 |
| `Chore` | 패키지 매니저 수정, `.gitignore` 등 기타 수정 |
| `Design` | CSS 등 사용자 UI 디자인 변경 |
| `Comment` | 필요한 주석 추가 및 변경 |
| `Rename` | 파일 또는 폴더명 수정, 이동만 수행한 경우 |
| `Remove` | 파일 삭제만 수행한 경우 |
| `!BREAKING CHANGE` | 큰 API 변경 |
| `!HOTFIX` | 치명적인 버그 긴급 수정 |

## 2. Message Format

Separate the title and body with one blank line.

```text
Type: 제목

- 변경 내용 1
- 변경 내용 2
- 변경 이유
```

## 3. Title Rules

- 커밋 유형은 지정된 영어 타입으로 작성한다.
- 제목과 본문은 한글로 작성한다.
- 제목 첫 글자는 대문자로 작성한다.
- 제목 끝에는 마침표를 붙이지 않는다.
- 제목은 영문 기준 50자 이내로 작성한다.

## 4. Body Rules

- 본문에는 변경한 내용과 이유를 작성한다.
- `어떻게`보다 `무엇`과 `왜`를 중심으로 설명한다.
- 한 커밋에는 한 가지 문제만 담는다.

## 5. Examples

```text
Feat: 게임 루프 점수 계산 추가

- 생존 시간에 따라 점수가 증가하도록 구현
- 리그레션 테스트에서 점수 변화를 검증할 수 있도록 상태를 노출
```

```text
Test: 충돌 상태 전이 하네스 테스트 추가

- 장애물을 플레이어 위치에 강제 배치하는 하네스 메서드 추가
- 충돌 발생 시 게임 상태가 gameOver로 전환되는지 검증
```
