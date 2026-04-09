using System.Data;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Api.Data;

public static class JobTrackerDbInitializer
{
    public static void Initialize(JobTrackerDbContext dbContext)
    {
        dbContext.Database.EnsureCreated();

        if (!dbContext.Database.IsSqlite())
        {
            return;
        }

        var connection = dbContext.Database.GetDbConnection();
        var shouldCloseConnection = connection.State != ConnectionState.Open;

        if (shouldCloseConnection)
        {
            connection.Open();
        }

        try
        {
            if (HasColumn(connection, "JobApplications", "DateApplied"))
            {
                return;
            }

            using var alterTableCommand = connection.CreateCommand();
            alterTableCommand.CommandText = """
                ALTER TABLE JobApplications
                ADD COLUMN DateApplied TEXT NULL;
                """;
            alterTableCommand.ExecuteNonQuery();

            using var backfillCommand = connection.CreateCommand();
            backfillCommand.CommandText = """
                UPDATE JobApplications
                SET DateApplied = substr(CreatedAtUtc, 1, 10)
                WHERE DateApplied IS NULL OR DateApplied = '';
                """;
            backfillCommand.ExecuteNonQuery();
        }
        finally
        {
            if (shouldCloseConnection)
            {
                connection.Close();
            }
        }
    }

    private static bool HasColumn(IDbConnection connection, string tableName, string columnName)
    {
        using var command = connection.CreateCommand();
        command.CommandText = $"PRAGMA table_info('{tableName}');";

        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            if (string.Equals(reader["name"]?.ToString(), columnName, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }

        return false;
    }
}
