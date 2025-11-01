# API Документація

## Контракт
Файл: `openapi.yaml`

## Перевірка у Swagger Editor
1. Відкрити [Swagger Editor](https://editor.swagger.io/).
2. Завантажити файл `openapi.yaml`.
3. Переконатися, що контракт відображається без помилок.
4. Зробити скріншот і зберегти його як `swagger_screenshot.png` у цій папці.

## Вимоги
- CRUD для `/resource`
- DTO: `Resource`
- Єдиний формат помилок: `ErrorResponse`
- Health endpoint: `GET /health` → `{ "status": "ok" }`
