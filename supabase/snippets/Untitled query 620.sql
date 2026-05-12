SELECT name, featured, must_visit, type
FROM property_data
WHERE property_id = 'a989daba-e79c-4ec1-b13c-cd0e43c1e4a2'
AND type = 'location'
AND (featured = true OR must_visit = true);