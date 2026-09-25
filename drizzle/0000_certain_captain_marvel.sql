CREATE TYPE "public"."option_id" AS ENUM('a', 'b', 'c', 'd');--> statement-breakpoint
CREATE TYPE "public"."topic_id" AS ENUM('css', 'html', 'js', 'ts');--> statement-breakpoint
CREATE TABLE "questions" (
	"id" text PRIMARY KEY NOT NULL,
	"topic_id" "topic_id" NOT NULL,
	"position" integer NOT NULL,
	"prompt" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_option_id" "option_id" NOT NULL,
	"explanation" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "questions_topic_position_idx" ON "questions" USING btree ("topic_id","position");