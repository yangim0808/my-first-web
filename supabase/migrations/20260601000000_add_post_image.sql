-- posts 테이블에 이미지 URL 컬럼 추가
alter table posts add column if not exists image_url text;
