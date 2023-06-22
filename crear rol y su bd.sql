create role visitante nosuperuser nocreatedb inherit login noreplication password 'h';
create database "T1-visitante" owner visitante;
grant pg_read_server_files to visitante;
grant pg_write_server_files to visitante;
GRANT USAGE ON SCHEMA public TO visitante;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO visitante;