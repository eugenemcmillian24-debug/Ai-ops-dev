import { pgTable, text, serial, timestamp, jsonb, integer, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').unique().notNull(),
    name: text('name'),
    image: text('image'),
    emailVerified: timestamp('email_verified'),
    password: text('password'),
    role: text('role').default('user'),
    branch: text('branch').default('main'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
    emailIdx: index('email_idx').on(table.email),
    branchIdx: index('branch_idx').on(table.branch),
}));

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    isPublic: boolean('is_public').default(false),
    branch: text('branch').default('main'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    branchIdx: index('project_branch_idx').on(table.branch),
}));

export const files = pgTable('files', {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    path: text('path').notNull(),
    content: text('content'),
    metadata: jsonb('metadata'),
    branch: text('branch').default('main'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
    projectIdIdx: index('project_id_idx').on(table.projectId),
    branchIdx: index('file_branch_idx').on(table.branch),
}));

export const usage = pgTable('usage', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    tokensUsed: integer('tokens_used').default(0),
    apiCalls: integer('api_calls').default(0),
    modelsUsed: jsonb('models_used'),
    month: text('month'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
    userIdIdx: index('usage_user_id_idx').on(table.userId),
    monthIdx: index('usage_month_idx').on(table.month),
}));

export const usersRelations = relations(users, ({ many }) => ({
    projects: many(projects),
    usage: many(usage),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
    user: one(users, { fields: [projects.userId], references: [users.id], }),
    files: many(files),
}));

export const filesRelations = relations(files, ({ one }) => ({
    project: one(projects, { fields: [files.projectId], references: [projects.id], }),
}));

export const usageRelations = relations(usage, ({ one }) => ({
    user: one(users, { fields: [usage.userId], references: [users.id], }),
});