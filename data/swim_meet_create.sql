

CREATE TABLE "age_groups"
 (
	"id"			PRIMARY KEY,
	"meet_id"		INTEGER,
	"name"			VARCHAR (32),
	"description"		VARCHAR (512),
	"print"			VARCHAR (50),
	"combine_print"		VARCHAR (50),
	"default_distance"	INTEGER,
	"created_at"		DATETIME,
	"updated_at"		DATETIME
);

CREATE INDEX "age_groups_id_idx" ON "age_groups" ("id");
CREATE INDEX "age_groups_meet_id_idx" ON "age_groups" ("meet_id");

CREATE TABLE "audit_records"
 (
	"meet_id"		INTEGER,
	"record_type"		VARCHAR (50),
	"record"		TEXT,
	"audit_date"		DATE,
	"audit_time"		TIMESTAMP WITHOUT TIME ZONE,
	"created_at"		DATETIME,
	"updated_at"		DATETIME
);

CREATE INDEX "audit_records_meet_id_idx" ON "audit_records" ("meet_id");

CREATE TABLE "club_names"
 (
	"id"			PRIMARY KEY,
	"meet_id"		INTEGER,
	"club_code"		VARCHAR (12),
	"name"			VARCHAR (128),
	"more"			TEXT,
	"created_at"		DATETIME,
	"updated_at"		DATETIME
);

CREATE INDEX "club_names_code_idx" ON "club_names" ("club_code");
CREATE INDEX "club_names_id_idx" ON "club_names" ("id");
CREATE INDEX "club_names_meet_id_idx" ON "club_names" ("meet_id");

CREATE TABLE "entrants"
(
	"id"			PRIMARY KEY,
	"meet_id"		INTEGER,
  "entrant_id"   INTEGER,
  "created_at"		DATETIME,
  "updated_at"		DATETIME
);
CREATE INDEX "entrants_id_idx" ON "entrants" ("id");
CREATE INDEX "entrants_meet_id_idx" ON "entrants" ("meet_id");

CREATE TABLE "swimmers"
(
  "id" PRIMARY KEY,
	"swimmer_name"		VARCHAR (128),
	"club"			VARCHAR (12),
	"age"			VARCHAR (12),
	"sex"			VARCHAR (1),
	"card_printed"		BOOL NOT NULL,
	"address_line_1"	VARCHAR (128),
	"address_line_2"	VARCHAR (128),
	"town"			VARCHAR (32),
	"county"		VARCHAR (32),
	"post_code"		VARCHAR (10),
	"telephone_no"		VARCHAR (16),
	"email"			VARCHAR (50),
	"alt_club"		VARCHAR (50),
	"regno"			VARCHAR (50),
	"special_notes"		TEXT,
	"more_1"		VARCHAR (50),
	"more_2"		VARCHAR (50),
	"more_3"		VARCHAR (50),
	"created_at"		DATETIME,
	"updated_at"		DATETIME
);

CREATE INDEX "swimmers_id_idx" ON "swimmers" ("id");

CREATE TABLE "events"
 (
	"id"			PRIMARY KEY,
	"meet_id"		INTEGER,
	"event_number"		INTEGER,
	"event_type"		VARCHAR (50),
	"event_sequence"	INTEGER,
	"age_group"		VARCHAR (10) NOT NULL,
	"sex"			VARCHAR (1) NOT NULL,
	"distance"		INTEGER NOT NULL,
	"stroke"		VARCHAR (6) NOT NULL,
	"event_date"		TIMESTAMP WITHOUT TIME ZONE,
	"limit_time"		VARCHAR (50),
	"record_time"		VARCHAR (50),
	"qualifying_time"	VARCHAR (50),
	"maximum_entries"	INTEGER,
	"final_event"		VARCHAR (6),
	"note"			VARCHAR (512),
	"sponsor"		VARCHAR (128),
	"event_print_number"	VARCHAR (50),
	"event_print_group"	VARCHAR (50),
	"combine_with"		VARCHAR (256),
	"meet_specific"		VARCHAR (50),
	"bcp_age"		VARCHAR (6),
	"session_number"	INTEGER,
	"event_data_1"		VARCHAR (50),
	"event_data_2"		VARCHAR (50),
	"event_data_3"		VARCHAR (50),
	"created_at"		DATETIME,
	"updated_at"		DATETIME
);

CREATE INDEX "events_id_idx" ON "events" ("id");
CREATE INDEX "events_meet_id_idx" ON "events" ("meet_id");

CREATE TABLE "meet_parameters"
 (
	"id"			PRIMARY KEY,
	"meet_id"		INTEGER,
	"keyword"		VARCHAR (32),
	"parameter"		VARCHAR (256),
	"created_at"		DATETIME,
	"updated_at"		DATETIME
);

CREATE INDEX "meet_parameters_id_idx" ON "meet_parameters" ("id");
CREATE INDEX "meet_parameters_keyword_idx" ON "meet_parameters" ("keyword");
CREATE INDEX "meet_parameters_meet_id_idx" ON "meet_parameters" ("meet_id");

CREATE TABLE "meets"
 (
	"id"				PRIMARY KEY,
	"name"				VARCHAR (128),
	"title"				VARCHAR (256),
	"meet_date"			TIMESTAMP WITHOUT TIME ZONE,
	"qual_date"			TIMESTAMP WITHOUT TIME ZONE,
	"age_groups"			BOOL NOT NULL,
	"meet_type"			VARCHAR (12),
	"promoter"			VARCHAR (50),
	"lanes"				INTEGER,
	"final_lanes"			INTEGER,
	"hdw"				BOOL NOT NULL,
	"program_notes"			BOOL NOT NULL,
	"aoe"				BOOL NOT NULL,
	"aoe_online"			VARCHAR (50),
	"announcer"			VARCHAR (128),
	"junior"			BOOL NOT NULL,
	"club_scores"			VARCHAR (50),
	"one_card"			BOOL NOT NULL,
	"all_heats"			BOOL NOT NULL,
	"next_competitor_number"	INTEGER,
	"meet_specific"			BOOL NOT NULL,
	"multi_session"			BOOL NOT NULL,
	"print_times"			BOOL NOT NULL,
	"split_last_heats"		BOOL NOT NULL,
	"www_directory"			VARCHAR (50),
	"www_style"			VARCHAR (50),
	"www_class"			VARCHAR (50),
	"www_header"			VARCHAR (50),
	"www_footer"			VARCHAR (50),
	"gala_directory"		VARCHAR (50),
	"work_directory"		VARCHAR (50),
	"notes"				TEXT,
	"created_at"			DATETIME,
	"updated_at"			DATETIME
);

CREATE INDEX "meets_id_idx" ON "meets" ("id");

CREATE TABLE "record_locks"
 (
	"id"			PRIMARY KEY,
	"meet_id"		INTEGER,
	"record_lock_type"	VARCHAR (50),
	"record_lock_key"	VARCHAR (50),
	"locked_by"		VARCHAR (50),
	"locked_date"		DATE,
	"locked_time"		TIMESTAMP WITHOUT TIME ZONE,
	"created_at"		DATETIME,
	"updated_at"		DATETIME
);

CREATE INDEX "record_locks_key_idx" ON "record_locks" ("record_lock_key");
CREATE INDEX "record_locks_meet_id_idx" ON "record_locks" ("meet_id");

CREATE TABLE "swims"
 (
	"id"			PRIMARY KEY,
	"meet_id"		INTEGER,
	"event_id"		INTEGER,
	"entrant_id"	INTEGER,
	"entry_time"		VARCHAR (50),
	"time"			VARCHAR (64),
	"confirmed"		BOOL NOT NULL,
	"combined_with"		VARCHAR (6),
	"position"		INTEGER,
	"dq"			BOOL NOT NULL,
	"dq_reason"		VARCHAR (256),
	"meet_specific"		VARCHAR (50),
	"seed_order"		INTEGER,
	"dns"			BOOL NOT NULL,
	"notes"			TEXT,
	"points"		INTEGER,
	"heat_no"		INTEGER,
	"lane_no"		INTEGER,
	"prog_ref"		INTEGER,
	"withdrawn"		BOOL NOT NULL,
	"swim1"			VARCHAR (50),
	"swim2"			VARCHAR (50),
	"swim3"			VARCHAR (50),
	"created_at"		DATETIME,
	"updated_at"		DATETIME
);

CREATE INDEX "swims_meet_id_idx" ON "swims" ("meet_id");

-- event: DataTypes.INTEGER,
-- round: DataTypes.INTEGER,
-- heat: DataTypes.INTEGER,
-- lap: DataTypes.INTEGER,
-- lane: DataTypes.INTEGER,
-- status: DataTypes.INTEGER,
-- rank: DataTypes.INTEGER,
-- time: DataTypes.STRING,
-- result: DataTypes.INTEGER,
-- mod: DataTypes.STRING,
-- backup_time: DataTypes.INTEGER,
-- backup_result: DataTypes.INTEGER,
-- backup_mod: DataTypes.STRING,

CREATE TABLE "result_lines"
 (
	"meet_id"		INTEGER,
	"event_id"		INTEGER,
	"round"		INTEGER,
	"heat"		INTEGER,
	"lap"		INTEGER,
  "lane"		INTEGER,
  "status"		INTEGER,
  "rank"		INTEGER,
	"time"		INTEGER,
	"result"		VARCHAR (20),
	"mod"		VARCHAR (1),
	"backup_time"		INTEGER,
  "backup_result"		VARCHAR (20),
  "backup_mod"		VARCHAR (1),
	"created_at"		DATETIME,
	"updated_at"		DATETIME,
  PRIMARY KEY (meet_id, event_id, heat)
);

CREATE INDEX "result_lines_event_id_idx" ON "result_lines" ("event_id");
CREATE INDEX "result_lines_heat_idx" ON "result_lines" ("heat");
CREATE INDEX "result_lines_meet_id_idx" ON "result_lines" ("meet_id");

CREATE TABLE "versions"
 (
	"id"		PRIMARY KEY,
	"version"	REAL,
	"notes"		TEXT,
	"created_at"	DATETIME,
	"updated_at"	DATETIME
);
