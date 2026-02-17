import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// إنشاء اتصال واحد مُعاد استخدامه (لتجنب "too many clients")
declare global {
    var db: ReturnType<typeof drizzle> | undefined;
}

let db: ReturnType<typeof drizzle>;

if (process.env.NODE_ENV === "production") {
    // في الإنتاج، أنشئ اتصالاً جديداً
    const sql = postgres(process.env.DATABASE_URL!, { ssl: "require", max: 1 });
    db = drizzle(sql, { schema });
} else {
    // في التطوير، أعد استخدام الاتصال
    if (!global.db) {
        const sql = postgres(process.env.DATABASE_URL!, { ssl: "require", max: 1 });
        global.db = drizzle(sql, { schema });
    }
    db = global.db;
}

export { db };