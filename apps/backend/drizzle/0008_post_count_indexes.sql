CREATE INDEX "comments_post_id_idx" ON "comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "bookmarks_post_id_user_id_idx" ON "bookmarks" USING btree ("post_id","user_id");--> statement-breakpoint
CREATE INDEX "bookmarks_user_id_created_at_idx" ON "bookmarks" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "likes_post_id_user_id_idx" ON "likes" USING btree ("post_id","user_id");--> statement-breakpoint
CREATE INDEX "posts_user_id_created_at_idx" ON "posts" USING btree ("user_id","created_at");