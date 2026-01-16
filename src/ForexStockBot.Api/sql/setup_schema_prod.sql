-- create database and tables for ForexStockBot
-- Default database: ThinkTankProd

IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = N'ThinkTankProd')
BEGIN
    PRINT 'Creating database ThinkTankProd...';
    CREATE DATABASE [ThinkTankProd];
END
GO

USE [ThinkTankProd];
GO

-- Symbols table
IF NOT EXISTS(SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Symbols]') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Symbols (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Symbol NVARCHAR(32) NOT NULL UNIQUE,
        Type NVARCHAR(16) NOT NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
    );
END
GO

-- PriceSeries table (daily candles)
IF NOT EXISTS(SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[PriceSeries]') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.PriceSeries (
        Id BIGINT IDENTITY(1,1) PRIMARY KEY,
        SymbolId INT NOT NULL,
        [Date] DATE NOT NULL,
        [OpenPrice] FLOAT NULL,
        [High] FLOAT NULL,
        [Low] FLOAT NULL,
        [ClosePrice] FLOAT NOT NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_PriceSeries_Symbols FOREIGN KEY(SymbolId) REFERENCES dbo.Symbols(Id)
    );
    CREATE INDEX IX_PriceSeries_Symbol_Date ON dbo.PriceSeries(SymbolId, [Date]);
END
GO

-- TrainingData table (features and label used for ML)
IF NOT EXISTS(SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TrainingData]') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.TrainingData (
        Id BIGINT IDENTITY(1,1) PRIMARY KEY,
        SymbolId INT NOT NULL,
        ClosePrice FLOAT NOT NULL,
        Previous FLOAT NOT NULL,
        MA5 FLOAT NOT NULL,
        MA20 FLOAT NOT NULL,
        Label INT NOT NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_TrainingData_Symbols FOREIGN KEY(SymbolId) REFERENCES dbo.Symbols(Id)
    );
    CREATE INDEX IX_TrainingData_Symbol_CreatedAt ON dbo.TrainingData(SymbolId, CreatedAt);
END
GO

-- Predictions table
IF NOT EXISTS(SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Predictions]') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Predictions (
        Id BIGINT IDENTITY(1,1) PRIMARY KEY,
        SymbolId INT NOT NULL,
        PredictedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        Label NVARCHAR(16) NOT NULL,
        Score FLOAT NULL,
        Details NVARCHAR(MAX) NULL,
        CONSTRAINT FK_Predictions_Symbols FOREIGN KEY(SymbolId) REFERENCES dbo.Symbols(Id)
    );
    CREATE INDEX IX_Predictions_Symbol_PredictedAt ON dbo.Predictions(SymbolId, PredictedAt);
END
GO

-- Models metadata
IF NOT EXISTS(SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Models]') AND type in (N'U'))
BEGIN
    CREATE TABLE dbo.Models (
        Id BIGINT IDENTITY(1,1) PRIMARY KEY,
        SymbolId INT NOT NULL,
        FilePath NVARCHAR(512) NOT NULL,
        TrainedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        Notes NVARCHAR(512) NULL,
        CONSTRAINT FK_Models_Symbols FOREIGN KEY(SymbolId) REFERENCES dbo.Symbols(Id)
    );
END
GO
