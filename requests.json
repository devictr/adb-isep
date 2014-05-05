// Requête pour récupérer le nombre de tweets par série
db.tweets.group(
{
     key: { tv_show: 1},
     reduce: function( curr, result ) {
                 result.count += 1;
             },
     initial: { count : 0 }
}
);

// Requête pour récupérer les tweets d'une série en particulier classés par date (décroissante)
db.tweets.find(
{
    tv_show: "Game Of Thrones"
}).sort({
    created_at: -1
}
);
