Feature: Users can ask about all the games currently being played

    Scenario: User asks what games are being played
        Given game {game1} is being played
        When the user says to the bot {what games are people playing?}
        Then the bot responds with {game1}

    Scenario: No games are being played right now