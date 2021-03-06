USE [insurance]
GO
/****** Object:  Table [dbo].[cases]    Script Date: 2016/10/24 10:40:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cases](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[cid] [bigint] NOT NULL,
	[current_state] [int] NULL,
	[is_reported] [int] NULL,
	[is_submit] [int] NULL,
	[is_investigate] [int] NULL,
	[is_data_holonomic] [int] NULL,
	[data_remark] [nvarchar](50) NULL,
	[is_informed] [int] NULL,
	[is_diffcult] [int] NULL,
	[diffcult_reason] [nvarchar](100) NULL,
	[report_type] [nvarchar](50) NULL,
	[report_time] [datetime] NULL,
	[report_phone] [nvarchar](50) NULL,
	[application_id] [nvarchar](120) NULL,
	[policy_id] [nvarchar](120) NULL,
	[policy_type] [nvarchar](50) NULL,
	[policy_holder] [nvarchar](50) NULL,
	[insurant_name] [nvarchar](50) NULL,
	[insurant_sex] [nvarchar](50) NULL,
	[insurant_habitation] [nvarchar](100) NULL,
	[insurant_idcard] [nvarchar](50) NULL,
	[insurant_age] [int] NULL,
	[insurant_phone] [nvarchar](50) NULL,
	[accident_time] [datetime] NULL,
	[accident_reason] [nvarchar](500) NULL,
	[accident_area] [nvarchar](100) NULL,
	[accident_address] [nvarchar](100) NULL,
	[accident_details] [nvarchar](50) NULL,
	[hospital_name] [nvarchar](50) NULL,
	[hospital_type] [nvarchar](50) NULL,
	[hospital_days] [int] NULL,
	[hospital_is_two_public] [int] NULL,
	[transfer_bank] [nvarchar](50) NULL,
	[transfer_name] [nvarchar](50) NULL,
	[transfer_account] [nvarchar](50) NULL,
	[compensation_type] [nvarchar](50) NULL,
	[compensation_amount] [float] NULL,
	[admissibility_type] [nvarchar](50) NULL,
	[subtract_type] [nvarchar](50) NULL,
	[subtract_amount] [float] NULL,
	[invoice_amount] [float] NULL,
	[deductible_amount] [float] NULL,
	[adjustment_remark] [nvarchar](500) NULL,
	[is_need_communication] [int] NULL,
	[communication_content] [nvarchar](100) NULL,
	[communication_result] [int] NULL,
	[check_result] [nvarchar](50) NULL,
	[check_opinion] [nvarchar](50) NULL,
	[check_subtract_type] [nvarchar](50) NULL,
	[check_subtract_amount] [float] NULL,
	[check_subtract_content] [nvarchar](100) NULL,
	[rejected_type] [nvarchar](50) NULL,
	[rejected_nature] [nvarchar](50) NULL,
	[rejected_amount] [float] NULL,
	[rejected_reason] [nvarchar](100) NULL,
	[approval_result] [nvarchar](50) NULL,
	[report_user] [nvarchar](50) NULL,
	[report_submit_time] [datetime] NULL,
	[record_user] [nvarchar](50) NULL,
	[record_submit_time] [datetime] NULL,
	[adjust_user] [nvarchar](50) NULL,
	[adjust_submit_time] [datetime] NULL,
	[check_user] [nvarchar](50) NULL,
	[check_submit_time] [datetime] NULL,
	[approval_user] [nvarchar](50) NULL,
	[approval_submit_time] [datetime] NULL,
	[allowance_amount] [float] NULL,
	[case_source] [nvarchar](50) NULL,
	[expire_date] [datetime] NULL,
	[case_type] [nvarchar](50) NULL,
	[case_type_remark] [nvarchar](500) NULL,
	[subtract_type_remark] [nvarchar](500) NULL,
 CONSTRAINT [PK_cases] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[field_range]    Script Date: 2016/10/24 10:40:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[field_range](
	[fid] [int] IDENTITY(1,1) NOT NULL,
	[field_name] [nvarchar](50) NULL,
	[field_value] [nvarchar](50) NULL,
 CONSTRAINT [PK_field_range] PRIMARY KEY CLUSTERED 
(
	[fid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[investigation]    Script Date: 2016/10/24 10:40:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[investigation](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[cid] [nvarchar](50) NOT NULL,
	[investigation_cause] [nvarchar](50) NULL,
	[investigation_area] [nvarchar](50) NULL,
	[contact] [nvarchar](50) NULL,
	[contact_phone] [nvarchar](50) NULL,
	[survey_points] [nvarchar](100) NULL,
	[approval_result] [nvarchar](50) NULL,
	[approval_remark] [nvarchar](100) NULL,
 CONSTRAINT [PK_investigation] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[lgn]    Script Date: 2016/10/24 10:40:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lgn](
	[uid] [int] IDENTITY(1,1) NOT NULL,
	[user_name] [nvarchar](50) NOT NULL,
	[password] [nvarchar](50) NOT NULL,
	[authority_level] [int] NOT NULL,
	[last_login_time] [datetime] NULL,
 CONSTRAINT [PK_lgn] PRIMARY KEY CLUSTERED 
(
	[uid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[modify_color]    Script Date: 2016/10/24 10:40:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[modify_color](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[cid] [int] NOT NULL,
	[state] [int] NULL,
	[field_name] [nvarchar](100) NULL,
 CONSTRAINT [PK_modify_color] PRIMARY KEY CLUSTERED 
(
	[id] ASC,
	[cid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET IDENTITY_INSERT [dbo].[field_range] ON 

INSERT [dbo].[field_range] ([fid], [field_name], [field_value]) VALUES (8, N'subtract_type', N'报案核减、初录核减、理算核减、其它')
INSERT [dbo].[field_range] ([fid], [field_name], [field_value]) VALUES (9, N'case_source', N'纸质寄送、柜面扫描')
INSERT [dbo].[field_range] ([fid], [field_name], [field_value]) VALUES (10, N'case_type', N'正常件、资料不齐全、查勘件、死亡件、拒赔件、疑难件、沟通件、投诉件、催办件')
SET IDENTITY_INSERT [dbo].[field_range] OFF
SET IDENTITY_INSERT [dbo].[lgn] ON 

INSERT [dbo].[lgn] ([uid], [user_name], [password], [authority_level], [last_login_time]) VALUES (1, N'管理员', N'sa', 0, CAST(0x0000A69D00D45862 AS DateTime))
INSERT [dbo].[lgn] ([uid], [user_name], [password], [authority_level], [last_login_time]) VALUES (3, N'报案人', N'sa', 1, CAST(0x0000A69D00C0DF20 AS DateTime))
INSERT [dbo].[lgn] ([uid], [user_name], [password], [authority_level], [last_login_time]) VALUES (5, N'初录人', N'sa', 2, CAST(0x0000A61D00FF6FCE AS DateTime))
INSERT [dbo].[lgn] ([uid], [user_name], [password], [authority_level], [last_login_time]) VALUES (6, N'理算人', N'sa', 3, CAST(0x0000A61B00EF7B6F AS DateTime))
INSERT [dbo].[lgn] ([uid], [user_name], [password], [authority_level], [last_login_time]) VALUES (7, N'审核人', N'sa', 4, CAST(0x0000A61A00F4E2E2 AS DateTime))
INSERT [dbo].[lgn] ([uid], [user_name], [password], [authority_level], [last_login_time]) VALUES (9, N'审批人', N'sa', 5, CAST(0x0000A6190165B3E8 AS DateTime))
SET IDENTITY_INSERT [dbo].[lgn] OFF
