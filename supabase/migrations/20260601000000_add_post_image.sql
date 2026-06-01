-- posts 테이블에 이미지 URL 컬럼 추가
alter table posts add column image_url text;

-- Storage 버킷 생성을 위한 SQL (직접 생성하는 대신 가이드가 될 수 있음)
-- insert into storage.buckets (id, name, public) values ('post-images', 'post-images', true);
