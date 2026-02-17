import { pgTable, serial, text, doublePrecision, timestamp, jsonb } from "drizzle-orm/pg-core";

// جدول المنتجات - يتوافق مع هيكل MongoDB السابق
export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    price: doublePrecision("price").notNull(),
    category: text("category").notNull(),
    imageUrl: text("image_url"),
    // استخدام jsonb لتخزين المواصفات غير المنتظمة (مثل MongoDB)
    specifications: jsonb("specifications").default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// جدول معلومات الاتصال
export const contactInfo = pgTable("contact_info", {
    id: serial("id").primaryKey(),
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    address: text("address").notNull(),
    facebook: text("facebook"),
    instagram: text("instagram"),
    twitter: text("twitter"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// استخراج أنواع TypeScript
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ContactInfo = typeof contactInfo.$inferSelect;
export type NewContactInfo = typeof contactInfo.$inferInsert;