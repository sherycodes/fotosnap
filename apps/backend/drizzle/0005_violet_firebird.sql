CREATE TABLE "stories" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;