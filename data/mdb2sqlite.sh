#!/bin/bash

# Inspired by:
# http://nialldonegan.me/2007/03/10/converting-microsoft-access-mdb-into-csv-or-mysql-in-linux/
# http://cltb.ojuba.org/en/articles/mdb2sqlite.html

# Dave's Modifications:
# 	Line 25:	Added code to remove COMMENT and SET statements.
#	Lines 28 to 37:	Added code to handle primary keys.
#	Line 51:	Added "postgres" to mdb-export command.


# Use temporary files for sql statements to ease debugging if something goes wrong

# Export schema from mdb:

mdb-schema $1 postgres \
| sed "s/Int8/INTEGER(8)/" \
| sed "s/Int4/INTEGER(4)/" \
| sed "s/Float8/FLOAT(8)/" \
| sed "s/Float4/FLOAT(4)/" \
| sed "s/Bool/BOOLEAN/" \
| sed "s/Char /VARCHAR/" \
| sed "s/DROP TABLE/DROP TABLE IF EXISTS/" \
| grep -Ev "^--|COMMENT|SET" \
> create.sql

# Remove PRIMARY KEY Statement and add it to the TABLE definition
grep "CONSTRAINT" create.sql | while read k;   do
	TABLEIS=`echo $k | cut -f2 -d '"'` 
	COLUMNIS=`echo $k | cut -f6 -d '"'`
	LINEOFCREATE=`grep -n 'CREATE TABLE "'"${TABLEIS}"'"' create.sql | cut -f1 -d:`
	LINEOFCOLUMN=`grep -A 100 'CREATE TABLE "'"${TABLEIS}"'"' create.sql |  grep -n '"'"${COLUMNIS}"'"' | head -1 | cut -f1 -d:`
	ACTUALLINE=$((LINEOFCREATE+LINEOFCOLUMN-1))
	sed -i -e "${ACTUALLINE}s/,/ PRIMARY KEY,/" create.sql
	sed -i -e "/^.*${k}.*$/d" create.sql
done


# Import schema to sqlite3
sqlite3 $2<create.sql

# Delete old import data (adding to exising file later)
# Vast speed improvement with BEGIN..COMMIT
echo "BEGIN;">import-data.sql

# Export each table and replace nan and inf with NULL
IN=`mdb-tables -d ';' $1`
IFS=';' read -ra ADDR <<< "$IN"
for table in "${ADDR[@]}"; do

mdb-export -I mysql $1 "$table" | sed -e 's/)$/)\;/'\
| sed "s/-inf/NULL/mg" \
| sed "s/inf/NULL/mg" \
| sed "s/-nan/NULL/mg" \
| sed "s/nan/NULL/mg" \
>>import-data.sql
done

echo "COMMIT;">>import-data.sql

# Import data to sqlite3
sqlite3 $2<import-data.sql
