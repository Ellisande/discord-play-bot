Feature: Users can ask about all the games currently being played

    Scenario: User asks what games are being played
        Given game {game1} is being played
        And game {game2} is being played
        And game {game3} is being played
        And game {game4} is being played
        And game {game5} is being played
        When the user says to the bot {what games are people playing?}
        Then the bot responds with {Some games played in this channel}
        And the bot responds with {1.}
        And the bot responds with {2.}
        And the bot responds with {3.}
        And the bot responds with {4.}
        And the bot responds with {5.}

    Scenario: User asks what games are played, but there is less than 5
        Given game {game1} is being played
        And game {game2} is being played
        And game {game3} is being played
        When the user says to the bot {what games are people playing?}
        Then the bot responds with {Some games played in this channel}
        And the bot responds with {1.}
        And the bot responds with {2.}
        And the bot responds with {3.}
        And the bot does not respond with {4.}
        And the bot does not respond with {5.}

    Scenario: No games are being played right now
        When the user says to the bot {what games are people playing?}
        Then the bot responds with {Life is sadness}