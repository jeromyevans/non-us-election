-- If you apply the migration manually, use this script to update the SchemaRevision table to allow the SchemaMigrator to resume from this revision
insert into SchemaRevision (revNo, schemaName) values (0, 'nonuselection');
