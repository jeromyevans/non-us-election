-- If you apply the migration manually, use this script to update the SchemaRevision table to allow the SchemaMigrator to resume from this revision
update SchemaRevision set revNo = 1 where schemaName = 'nonuselection;'
