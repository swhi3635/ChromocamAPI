#!/usr/bin/perl

use strict;
use warnings;
use DBI;

# array of files to be deleted
my @goners;

# database connection info
my $database = "";
my $host = "localhost";
my $port = "3306";
my $user = "";
my $pass = "";

# set up connection info
my $dsn = "DBI:mysql:database=$database;host=$host;port=$port";

# Connect to the database.
my $dbh = DBI->connect($dsn, $user, $pass, {'RaiseError' => 1});

# now retrieve data from the table.
# query: get filenames for images created over 1 week ago
my $sth = $dbh->prepare("SELECT filename FROM event WHERE archive=0 AND time_stamp <= (NOW() - INTERVAL 1 WEEK)") || die "Error:" . $dbh->errstr . "\n";
$sth->execute() || die "Error:" . $dbh->errstr . "\n";

# add each record to list of files to be deleted
while (my $ref = $sth->fetchrow_hashref()) {
  push @goners, $ref->{'filename'};
}

$sth->finish();

# delete each file, remove record from database
foreach my $file ( @goners ) {
  print "delete " . $file . "\n";

  # delete file
  unlink $file or warn "Could not unlink $file: $!";

  # remove record from database
  my $sth = $dbh->prepare("DELETE FROM event WHERE filename=\"$file\"") || die "Error:" . $dbh->errstr . "\n";
  $sth->execute() || die "Error:" . $dbh->errstr . "\n";
  $sth->finish();
}

# Disconnect from the database.
$dbh->disconnect();
