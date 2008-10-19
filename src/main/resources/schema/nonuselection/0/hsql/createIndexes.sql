create index VoteResultCountryIndex on VoteResult (country);
create index VoteCountryIndex on Vote (country, timestamp);
