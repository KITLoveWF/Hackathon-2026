# Migration Steps

## Setup Database Source

Đảm bảo file `src/hackathon/utils/database-source.ts` được cấu hình đúng với kết nối database.

## Available Migration Commands

### 1. Generate Migration (Tạo migration file)

```bash
npm run migration:generate -- --name=InitialSchema
```

**Cách hoạt động:**
- TypeORM sẽ quét tất cả entities trong project
- So sánh với database hiện tại
- Tạo 1 file migration tổng hợp tất cả thay đổi
- File sẽ được lưu trong `src/hackathon/utils/migrations/`
- Tên file: `[timestamp]_InitialSchema.ts`

**Ví dụ khác:**
```bash
npm run migration:generate -- --name=AddNewFields
npm run migration:generate -- --name=UpdateRelations
```

> **Lưu ý:** Mỗi lần chạy lệnh này, TypeORM sẽ quét TẤT CẢ entities và tạo migration tổng hợp, không cần tạo từng entity riêng!

### 2. Run Migrations (Chạy migration lên database)

```bash
npm run migration:run
```

**Kết quả:**
- Thực thi tất cả migration chưa chạy
- Update schema trong database
- Log ra những migration đã chạy

### 3. Revert Migration (Hoàn tác migration)

```bash
npm run migration:revert
```

**Kết quả:**
- Hoàn tác migration gần nhất
- Rollback schema về trạng thái trước đó

## Migration Workflow

```
1. Modify Entity
   ↓
2. Run: npm run migration:generate -- --name=YourMigrationName
   ↓
3. Review generated file (src/hackathon/utils/migrations/)
   ↓
4. Run: npm run migration:run
   ↓
5. Database schema updated ✅
```

## Entities to Migrate

- ✅ `Role` - Roles (STUDENT, TEACHER, ADMIN)
- ✅ `User` - Users (Students, Teachers, Admins)
- ✅ `Class` - Classes
- ✅ `Chatbox` - Chatboxes (Discussion sessions)
- ✅ `Question` - Questions in chatbox

## Tips

- Luôn review migration file trước khi chạy
- Giữ lại migration files để track version history
- Test trên dev database trước khi chạy production
- Dùng `migration:revert` nếu cần rollback
