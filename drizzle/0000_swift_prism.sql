CREATE TYPE "public"."subdomain_status" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."subdomain_type" AS ENUM('github_pages', 'vercel');--> statement-breakpoint
CREATE TABLE "abuse_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"subdomain_id" text NOT NULL,
	"reporter_email" text,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subdomains" (
	"id" text PRIMARY KEY NOT NULL,
	"subdomain" varchar(63) NOT NULL,
	"user_id" text NOT NULL,
	"type" "subdomain_type" NOT NULL,
	"target" text NOT NULL,
	"cf_record_id" text,
	"cf_txt_record_id" text,
	"vercel_txt_value" text,
	"status" "subdomain_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subdomains_subdomain_unique" UNIQUE("subdomain")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"github_id" text NOT NULL,
	"github_username" text NOT NULL,
	"name" text,
	"avatar_url" text,
	"email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_github_id_unique" UNIQUE("github_id")
);
--> statement-breakpoint
ALTER TABLE "abuse_reports" ADD CONSTRAINT "abuse_reports_subdomain_id_subdomains_id_fk" FOREIGN KEY ("subdomain_id") REFERENCES "public"."subdomains"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subdomains" ADD CONSTRAINT "subdomains_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;