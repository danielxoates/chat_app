CREATE TABLE "final" (
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"addiction"	TEXT NOT NULL,
	"points"	INTEGER,
	"connected_user"	TEXT,
	"ai_chat"	TEXT,
	"user_chat"	 TEXT,
	PRIMARY KEY("username")
);