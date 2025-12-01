

USE CosmicVault;
GO

-- =============================================
-- SECTION 1: USER STATISTICS TRACKING
-- =============================================

-- Drop existing triggers if they exist
IF OBJECT_ID('trg_ObservationLog_AfterInsert', 'TR') IS NOT NULL
    DROP TRIGGER trg_ObservationLog_AfterInsert;
GO

IF OBJECT_ID('trg_ObservationLog_AfterDelete', 'TR') IS NOT NULL
    DROP TRIGGER trg_ObservationLog_AfterDelete;
GO

IF OBJECT_ID('trg_CelestialObject_AfterInsert', 'TR') IS NOT NULL
    DROP TRIGGER trg_CelestialObject_AfterInsert;
GO

IF OBJECT_ID('trg_CelestialObject_AfterDelete', 'TR') IS NOT NULL
    DROP TRIGGER trg_CelestialObject_AfterDelete;
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

-- =============================================
-- SECTION 2: AUDIT TRAIL
-- =============================================

-- Drop existing triggers if they exist
IF OBJECT_ID('trg_Users_Audit', 'TR') IS NOT NULL
    DROP TRIGGER trg_Users_Audit;
GO

IF OBJECT_ID('trg_CelestialObjects_Audit', 'TR') IS NOT NULL
    DROP TRIGGER trg_CelestialObjects_Audit;
GO

IF OBJECT_ID('trg_ObservationLogs_Audit', 'TR') IS NOT NULL
    DROP TRIGGER trg_ObservationLogs_Audit;
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
            i.UserID as ChangedBy, -- Users changing their own data
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
            d.UserID as ChangedBy, -- User deleting their own account
            d.Username + '|' + d.Email as OldValue,
            NULL as NewValue,
            GETDATE() as ChangeDate
        FROM deleted d;
    END
END;
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

-- =============================================
-- SECTION 3: OBSERVATION STREAK TRACKING
-- =============================================

-- Drop existing triggers if they exist
IF OBJECT_ID('trg_ObservationStreak_AfterInsert', 'TR') IS NOT NULL
    DROP TRIGGER trg_ObservationStreak_AfterInsert;
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

-- =============================================
-- TRIGGER VERIFICATION
-- =============================================

PRINT '==============================================';
PRINT 'CosmicVault Triggers Created Successfully!';
PRINT '==============================================';
PRINT '';
PRINT 'User Statistics Triggers:';
PRINT '  - trg_ObservationLog_AfterInsert';
PRINT '  - trg_ObservationLog_AfterDelete';
PRINT '  - trg_CelestialObject_AfterInsert';
PRINT '  - trg_CelestialObject_AfterDelete';
PRINT '';
PRINT 'Audit Trail Triggers:';
PRINT '  - trg_Users_Audit';
PRINT '  - trg_CelestialObjects_Audit';
PRINT '  - trg_ObservationLogs_Audit';
PRINT '';
PRINT 'Observation Streak Triggers:';
PRINT '  - trg_ObservationStreak_AfterInsert';
PRINT '';
PRINT '==============================================';
GO
