-- =============================================
-- CosmicVault Triggers Migration Script
-- Author: CosmicVault Team
-- Date: December 2025
-- Description: Adds trigger-related tables and triggers to existing databases
-- =============================================

USE CosmicVault;
GO

PRINT '==============================================';
PRINT 'Starting CosmicVault Triggers Migration...';
PRINT '==============================================';
PRINT '';

-- =============================================
-- STEP 1: Create UserStatistics table
-- =============================================

PRINT 'Step 1: Creating UserStatistics table...';

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserStatistics')
BEGIN
    CREATE TABLE UserStatistics (
        UserID INT PRIMARY KEY,
        TotalObservations INT DEFAULT 0,
        TotalObjectsDiscovered INT DEFAULT 0,
        LastObservationDate DATETIME,
        CurrentStreak INT DEFAULT 0,
        LongestStreak INT DEFAULT 0,
        LastUpdated DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
    );
    PRINT '  ✓ UserStatistics table created successfully';
END
ELSE
BEGIN
    PRINT '  ⓘ UserStatistics table already exists';
END
GO

-- =============================================
-- STEP 2: Create AuditLog table
-- =============================================

PRINT 'Step 2: Creating AuditLog table...';

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AuditLog')
BEGIN
    CREATE TABLE AuditLog (
        AuditID INT PRIMARY KEY IDENTITY(1,1),
        TableName VARCHAR(50) NOT NULL,
        RecordID INT NOT NULL,
        Action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
        ChangedBy INT,
        OldValue NVARCHAR(MAX),
        NewValue NVARCHAR(MAX),
        ChangeDate DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (ChangedBy) REFERENCES Users(UserID) ON DELETE SET NULL
    );
    PRINT '  ✓ AuditLog table created successfully';
END
ELSE
BEGIN
    PRINT '  ⓘ AuditLog table already exists';
END
GO

-- =============================================
-- STEP 3: Create ObservationStreaks table
-- =============================================

PRINT 'Step 3: Creating ObservationStreaks table...';

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ObservationStreaks')
BEGIN
    CREATE TABLE ObservationStreaks (
        StreakID INT PRIMARY KEY IDENTITY(1,1),
        UserID INT NOT NULL,
        StreakDate DATE NOT NULL,
        StreakCount INT NOT NULL,
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
        UNIQUE(UserID, StreakDate)
    );
    PRINT '  ✓ ObservationStreaks table created successfully';
END
ELSE
BEGIN
    PRINT '  ⓘ ObservationStreaks table already exists';
END
GO

-- =============================================
-- STEP 4: Populate UserStatistics from existing data
-- =============================================

PRINT 'Step 4: Populating UserStatistics with existing data...';

-- Insert statistics for all existing users
INSERT INTO UserStatistics (UserID, TotalObservations, TotalObjectsDiscovered, LastObservationDate, CurrentStreak, LongestStreak, LastUpdated)
SELECT 
    u.UserID,
    ISNULL((SELECT COUNT(*) FROM ObservationLogs ol WHERE ol.UserID = u.UserID), 0) as TotalObservations,
    0 as TotalObjectsDiscovered, -- Not tracked in CelestialObjects table
    (SELECT MAX(ObservationDate) FROM ObservationLogs ol WHERE ol.UserID = u.UserID) as LastObservationDate,
    0 as CurrentStreak, -- Will be calculated by streak trigger
    0 as LongestStreak, -- Will be calculated by streak trigger
    GETDATE() as LastUpdated
FROM Users u
WHERE NOT EXISTS (SELECT 1 FROM UserStatistics us WHERE us.UserID = u.UserID);

DECLARE @NewUserStatsCount INT = @@ROWCOUNT;
PRINT '  ✓ Populated statistics for ' + CAST(@NewUserStatsCount AS VARCHAR) + ' user(s)';
GO

-- =============================================
-- STEP 5: Calculate observation streaks from existing data
-- =============================================

PRINT 'Step 5: Calculating observation streaks from existing data...';

-- Create a temporary procedure to calculate streaks
IF OBJECT_ID('tempdb..#CalculateStreaks') IS NOT NULL
    DROP PROCEDURE #CalculateStreaks;
GO

CREATE PROCEDURE #CalculateStreaks
AS
BEGIN
    DECLARE @UserID INT;
    DECLARE @ObsDate DATE;
    DECLARE @PrevDate DATE;
    DECLARE @CurrentStreak INT;
    DECLARE @LongestStreak INT;
    
    -- Get all users with observations
    DECLARE user_cursor CURSOR FOR
    SELECT DISTINCT UserID FROM ObservationLogs ORDER BY UserID;
    
    OPEN user_cursor;
    FETCH NEXT FROM user_cursor INTO @UserID;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @PrevDate = NULL;
        SET @CurrentStreak = 0;
        SET @LongestStreak = 0;
        
        -- Get all observation dates for this user
        DECLARE date_cursor CURSOR FOR
        SELECT DISTINCT CAST(ObservationDate AS DATE) as ObsDate
        FROM ObservationLogs
        WHERE UserID = @UserID
        ORDER BY ObsDate;
        
        OPEN date_cursor;
        FETCH NEXT FROM date_cursor INTO @ObsDate;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- First observation
            IF @PrevDate IS NULL
            BEGIN
                SET @CurrentStreak = 1;
            END
            -- Consecutive day
            ELSE IF DATEDIFF(DAY, @PrevDate, @ObsDate) = 1
            BEGIN
                SET @CurrentStreak = @CurrentStreak + 1;
            END
            -- Streak broken
            ELSE IF DATEDIFF(DAY, @PrevDate, @ObsDate) > 1
            BEGIN
                SET @CurrentStreak = 1;
            END
            
            -- Track longest streak
            IF @CurrentStreak > @LongestStreak
                SET @LongestStreak = @CurrentStreak;
            
            -- Insert streak record
            IF NOT EXISTS (SELECT 1 FROM ObservationStreaks WHERE UserID = @UserID AND StreakDate = @ObsDate)
            BEGIN
                INSERT INTO ObservationStreaks (UserID, StreakDate, StreakCount)
                VALUES (@UserID, @ObsDate, @CurrentStreak);
            END
            
            SET @PrevDate = @ObsDate;
            FETCH NEXT FROM date_cursor INTO @ObsDate;
        END
        
        CLOSE date_cursor;
        DEALLOCATE date_cursor;
        
        -- Update UserStatistics with calculated streaks
        UPDATE UserStatistics
        SET CurrentStreak = @CurrentStreak,
            LongestStreak = @LongestStreak,
            LastUpdated = GETDATE()
        WHERE UserID = @UserID;
        
        FETCH NEXT FROM user_cursor INTO @UserID;
    END
    
    CLOSE user_cursor;
    DEALLOCATE user_cursor;
END;
GO

-- Execute the streak calculation
EXEC #CalculateStreaks;

DECLARE @StreakCount INT = (SELECT COUNT(*) FROM ObservationStreaks);
PRINT '  ✓ Calculated ' + CAST(@StreakCount AS VARCHAR) + ' streak record(s)';
GO

-- =============================================
-- STEP 6: Create all triggers
-- =============================================

PRINT 'Step 6: Creating database triggers...';
PRINT '';

-- =============================================
-- USER STATISTICS TRIGGERS
-- =============================================

-- Drop existing triggers if they exist
IF OBJECT_ID('trg_ObservationLog_AfterInsert', 'TR') IS NOT NULL
BEGIN
    DROP TRIGGER trg_ObservationLog_AfterInsert;
    PRINT '  ⓘ Dropped existing trg_ObservationLog_AfterInsert';
END
GO

IF OBJECT_ID('trg_ObservationLog_AfterDelete', 'TR') IS NOT NULL
BEGIN
    DROP TRIGGER trg_ObservationLog_AfterDelete;
    PRINT '  ⓘ Dropped existing trg_ObservationLog_AfterDelete';
END
GO

IF OBJECT_ID('trg_CelestialObject_AfterInsert', 'TR') IS NOT NULL
BEGIN
    DROP TRIGGER trg_CelestialObject_AfterInsert;
    PRINT '  ⓘ Dropped existing trg_CelestialObject_AfterInsert';
END
GO

IF OBJECT_ID('trg_CelestialObject_AfterDelete', 'TR') IS NOT NULL
BEGIN
    DROP TRIGGER trg_CelestialObject_AfterDelete;
    PRINT '  ⓘ Dropped existing trg_CelestialObject_AfterDelete';
END
GO

-- Trigger: Update UserStatistics when ObservationLog is inserted
CREATE TRIGGER trg_ObservationLog_AfterInsert
ON ObservationLogs
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Update TotalObservations and LastObservationDate for each affected user
    UPDATE us
    SET us.TotalObservations = us.TotalObservations + i.ObservationCount,
        us.LastObservationDate = CASE 
            WHEN i.MaxObservationDate > us.LastObservationDate OR us.LastObservationDate IS NULL
            THEN i.MaxObservationDate
            ELSE us.LastObservationDate
        END,
        us.LastUpdated = GETDATE()
    FROM UserStatistics us
    INNER JOIN (
        SELECT UserID, 
               COUNT(*) as ObservationCount,
               MAX(ObservationDate) as MaxObservationDate
        FROM inserted
        GROUP BY UserID
    ) i ON us.UserID = i.UserID;
    
    -- Insert new UserStatistics records for users who don't have one yet
    INSERT INTO UserStatistics (UserID, TotalObservations, TotalObjectsDiscovered, LastObservationDate, CurrentStreak, LongestStreak, LastUpdated)
    SELECT i.UserID, 
           COUNT(*) as TotalObservations,
           0 as TotalObjectsDiscovered,
           MAX(i.ObservationDate) as LastObservationDate,
           0 as CurrentStreak,
           0 as LongestStreak,
           GETDATE() as LastUpdated
    FROM inserted i
    LEFT JOIN UserStatistics us ON i.UserID = us.UserID
    WHERE us.UserID IS NULL
    GROUP BY i.UserID;
END;
GO

PRINT '  ✓ Created trg_ObservationLog_AfterInsert';
GO

-- Trigger: Update UserStatistics when ObservationLog is deleted
CREATE TRIGGER trg_ObservationLog_AfterDelete
ON ObservationLogs
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Recalculate statistics for affected users
    UPDATE us
    SET us.TotalObservations = ISNULL((
            SELECT COUNT(*) 
            FROM ObservationLogs ol 
            WHERE ol.UserID = us.UserID
        ), 0),
        us.LastObservationDate = (
            SELECT MAX(ObservationDate)
            FROM ObservationLogs ol
            WHERE ol.UserID = us.UserID
        ),
        us.LastUpdated = GETDATE()
    FROM UserStatistics us
    INNER JOIN deleted d ON us.UserID = d.UserID;
END;
GO

PRINT '  ✓ Created trg_ObservationLog_AfterDelete';
GO

-- Trigger: Update UserStatistics when CelestialObject is inserted
-- Note: CelestialObjects table doesn't have DiscoveredBy column, so this trigger is simplified
CREATE TRIGGER trg_CelestialObject_AfterInsert
ON CelestialObjects
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    -- This trigger is kept for future use if DiscoveredBy column is added
    -- Currently does nothing as CelestialObjects doesn't track discovery user
END;
GO

PRINT '  ✓ Created trg_CelestialObject_AfterInsert';
GO

-- Trigger: Update UserStatistics when CelestialObject is deleted
-- Note: CelestialObjects table doesn't have DiscoveredBy column, so this trigger is simplified
CREATE TRIGGER trg_CelestialObject_AfterDelete
ON CelestialObjects
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    -- This trigger is kept for future use if DiscoveredBy column is added
    -- Currently does nothing as CelestialObjects doesn't track discovery user
END;
GO

PRINT '  ✓ Created trg_CelestialObject_AfterDelete';
GO

-- =============================================
-- AUDIT TRAIL TRIGGERS
-- =============================================

IF OBJECT_ID('trg_Users_Audit', 'TR') IS NOT NULL
BEGIN
    DROP TRIGGER trg_Users_Audit;
    PRINT '  ⓘ Dropped existing trg_Users_Audit';
END
GO

IF OBJECT_ID('trg_CelestialObjects_Audit', 'TR') IS NOT NULL
BEGIN
    DROP TRIGGER trg_CelestialObjects_Audit;
    PRINT '  ⓘ Dropped existing trg_CelestialObjects_Audit';
END
GO

IF OBJECT_ID('trg_ObservationLogs_Audit', 'TR') IS NOT NULL
BEGIN
    DROP TRIGGER trg_ObservationLogs_Audit;
    PRINT '  ⓘ Dropped existing trg_ObservationLogs_Audit';
END
GO

-- Trigger: Audit trail for Users table
CREATE TRIGGER trg_Users_Audit
ON Users
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Action VARCHAR(10);
    DECLARE @UserID INT;
    
    -- Determine action type
    IF EXISTS(SELECT * FROM inserted) AND EXISTS(SELECT * FROM deleted)
        SET @Action = 'UPDATE';
    ELSE IF EXISTS(SELECT * FROM inserted)
        SET @Action = 'INSERT';
    ELSE
        SET @Action = 'DELETE';
    
    -- Log INSERT and UPDATE actions
    IF @Action IN ('INSERT', 'UPDATE')
    BEGIN
        INSERT INTO AuditLog (TableName, RecordID, Action, ChangedBy, OldValue, NewValue, ChangeDate)
        SELECT 
            'Users' as TableName,
            i.UserID as RecordID,
            @Action as Action,
            i.UserID as ChangedBy,
            (SELECT Username + '|' + Email FROM deleted d WHERE d.UserID = i.UserID) as OldValue,
            i.Username + '|' + i.Email as NewValue,
            GETDATE() as ChangeDate
        FROM inserted i;
    END
    
    -- Log DELETE actions
    IF @Action = 'DELETE'
    BEGIN
        INSERT INTO AuditLog (TableName, RecordID, Action, ChangedBy, OldValue, NewValue, ChangeDate)
        SELECT 
            'Users' as TableName,
            d.UserID as RecordID,
            'DELETE' as Action,
            d.UserID as ChangedBy,
            d.Username + '|' + d.Email as OldValue,
            NULL as NewValue,
            GETDATE() as ChangeDate
        FROM deleted d;
    END
END;
GO

PRINT '  ✓ Created trg_Users_Audit';
GO

-- Trigger: Audit trail for CelestialObjects table
CREATE TRIGGER trg_CelestialObjects_Audit
ON CelestialObjects
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Action VARCHAR(10);
    
    -- Determine action type
    IF EXISTS(SELECT * FROM inserted) AND EXISTS(SELECT * FROM deleted)
        SET @Action = 'UPDATE';
    ELSE IF EXISTS(SELECT * FROM inserted)
        SET @Action = 'INSERT';
    ELSE
        SET @Action = 'DELETE';
    
    -- Log INSERT and UPDATE actions
    IF @Action IN ('INSERT', 'UPDATE')
    BEGIN
        INSERT INTO AuditLog (TableName, RecordID, Action, ChangedBy, OldValue, NewValue, ChangeDate)
        SELECT 
            'CelestialObjects' as TableName,
            i.ObjectID as RecordID,
            @Action as Action,
            NULL as ChangedBy, -- No user tracking in CelestialObjects
            (SELECT Name + '|' + CAST(TypeID AS VARCHAR) + '|' + CAST(RightAscension AS VARCHAR) + '|' + CAST(Declination AS VARCHAR) 
             FROM deleted d WHERE d.ObjectID = i.ObjectID) as OldValue,
            i.Name + '|' + CAST(i.TypeID AS VARCHAR) + '|' + CAST(i.RightAscension AS VARCHAR) + '|' + CAST(i.Declination AS VARCHAR) as NewValue,
            GETDATE() as ChangeDate
        FROM inserted i;
    END
    
    -- Log DELETE actions
    IF @Action = 'DELETE'
    BEGIN
        INSERT INTO AuditLog (TableName, RecordID, Action, ChangedBy, OldValue, NewValue, ChangeDate)
        SELECT 
            'CelestialObjects' as TableName,
            d.ObjectID as RecordID,
            'DELETE' as Action,
            NULL as ChangedBy, -- No user tracking in CelestialObjects
            d.Name + '|' + CAST(d.TypeID AS VARCHAR) + '|' + CAST(d.RightAscension AS VARCHAR) + '|' + CAST(d.Declination AS VARCHAR) as OldValue,
            NULL as NewValue,
            GETDATE() as ChangeDate
        FROM deleted d;
    END
END;
GO

PRINT '  ✓ Created trg_CelestialObjects_Audit';
GO
GO

-- Trigger: Audit trail for ObservationLogs table
CREATE TRIGGER trg_ObservationLogs_Audit
ON ObservationLogs
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Action VARCHAR(10);
    
    -- Determine action type
    IF EXISTS(SELECT * FROM inserted) AND EXISTS(SELECT * FROM deleted)
        SET @Action = 'UPDATE';
    ELSE IF EXISTS(SELECT * FROM inserted)
        SET @Action = 'INSERT';
    ELSE
        SET @Action = 'DELETE';
    
    -- Log INSERT and UPDATE actions
    IF @Action IN ('INSERT', 'UPDATE')
    BEGIN
        INSERT INTO AuditLog (TableName, RecordID, Action, ChangedBy, OldValue, NewValue, ChangeDate)
        SELECT 
            'ObservationLogs' as TableName,
            i.LogID as RecordID,
            @Action as Action,
            i.UserID as ChangedBy,
            (SELECT CAST(ObjectID AS VARCHAR) + '|' + CAST(ObservationDate AS VARCHAR) 
             FROM deleted d WHERE d.LogID = i.LogID) as OldValue,
            CAST(i.ObjectID AS VARCHAR) + '|' + CAST(i.ObservationDate AS VARCHAR) as NewValue,
            GETDATE() as ChangeDate
        FROM inserted i;
    END
    
    -- Log DELETE actions
    IF @Action = 'DELETE'
    BEGIN
        INSERT INTO AuditLog (TableName, RecordID, Action, ChangedBy, OldValue, NewValue, ChangeDate)
        SELECT 
            'ObservationLogs' as TableName,
            d.LogID as RecordID,
            'DELETE' as Action,
            d.UserID as ChangedBy,
            CAST(d.ObjectID AS VARCHAR) + '|' + CAST(d.ObservationDate AS VARCHAR) as OldValue,
            NULL as NewValue,
            GETDATE() as ChangeDate
        FROM deleted d;
    END
END;
GO

PRINT '  ✓ Created trg_ObservationLogs_Audit';
GO

-- =============================================
-- OBSERVATION STREAK TRIGGERS
-- =============================================

IF OBJECT_ID('trg_ObservationStreak_AfterInsert', 'TR') IS NOT NULL
BEGIN
    DROP TRIGGER trg_ObservationStreak_AfterInsert;
    PRINT '  ⓘ Dropped existing trg_ObservationStreak_AfterInsert';
END
GO

-- Trigger: Calculate observation streaks when new observation is logged
CREATE TRIGGER trg_ObservationStreak_AfterInsert
ON ObservationLogs
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @UserID INT;
    DECLARE @ObservationDate DATE;
    DECLARE @LastStreakDate DATE;
    DECLARE @CurrentStreak INT;
    DECLARE @LongestStreak INT;
    
    -- Process each inserted observation
    DECLARE streak_cursor CURSOR FOR
    SELECT DISTINCT UserID, CAST(ObservationDate AS DATE) as ObsDate
    FROM inserted
    ORDER BY UserID;
    
    OPEN streak_cursor;
    FETCH NEXT FROM streak_cursor INTO @UserID, @ObservationDate;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Get the last streak date for this user
        SELECT TOP 1 @LastStreakDate = StreakDate
        FROM ObservationStreaks
        WHERE UserID = @UserID
        ORDER BY StreakDate DESC;
        
        -- Get current statistics
        SELECT @CurrentStreak = CurrentStreak, @LongestStreak = LongestStreak
        FROM UserStatistics
        WHERE UserID = @UserID;
        
        -- Initialize if no previous streak
        IF @LastStreakDate IS NULL
        BEGIN
            SET @CurrentStreak = 1;
            SET @LongestStreak = 1;
        END
        -- Check if observation is consecutive (within 1 day of last observation)
        ELSE IF DATEDIFF(DAY, @LastStreakDate, @ObservationDate) = 1
        BEGIN
            SET @CurrentStreak = @CurrentStreak + 1;
            IF @CurrentStreak > @LongestStreak
                SET @LongestStreak = @CurrentStreak;
        END
        -- Check if observation is same day (don't increment)
        ELSE IF DATEDIFF(DAY, @LastStreakDate, @ObservationDate) = 0
        BEGIN
            -- Don't change streak, same day
            SET @CurrentStreak = @CurrentStreak;
        END
        -- Streak broken
        ELSE IF DATEDIFF(DAY, @LastStreakDate, @ObservationDate) > 1
        BEGIN
            SET @CurrentStreak = 1;
        END
        
        -- Insert or update streak record for this date
        IF NOT EXISTS (SELECT 1 FROM ObservationStreaks WHERE UserID = @UserID AND StreakDate = @ObservationDate)
        BEGIN
            INSERT INTO ObservationStreaks (UserID, StreakDate, StreakCount)
            VALUES (@UserID, @ObservationDate, @CurrentStreak);
        END
        ELSE
        BEGIN
            UPDATE ObservationStreaks
            SET StreakCount = @CurrentStreak
            WHERE UserID = @UserID AND StreakDate = @ObservationDate;
        END
        
        -- Update UserStatistics with new streak values
        UPDATE UserStatistics
        SET CurrentStreak = @CurrentStreak,
            LongestStreak = @LongestStreak,
            LastUpdated = GETDATE()
        WHERE UserID = @UserID;
        
        -- Reset variables for next user
        SET @LastStreakDate = NULL;
        
        FETCH NEXT FROM streak_cursor INTO @UserID, @ObservationDate;
    END
    
    CLOSE streak_cursor;
    DEALLOCATE streak_cursor;
END;
GO

PRINT '  ✓ Created trg_ObservationStreak_AfterInsert';

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

PRINT '';
PRINT '==============================================';
PRINT 'CosmicVault Triggers Migration Complete!';
PRINT '==============================================';
PRINT '';
PRINT 'Summary:';
PRINT '  • 3 new tables created (UserStatistics, AuditLog, ObservationStreaks)';
PRINT '  • 8 triggers created:';
PRINT '    - 4 User Statistics triggers';
PRINT '    - 3 Audit Trail triggers';
PRINT '    - 1 Observation Streak trigger';
PRINT '';
PRINT 'Next Steps:';
PRINT '  1. Test triggers by inserting/updating/deleting records';
PRINT '  2. Query UserStatistics table to view calculated metrics';
PRINT '  3. Check AuditLog for change tracking';
PRINT '  4. Monitor ObservationStreaks for user engagement data';
PRINT '';
PRINT '==============================================';
GO
