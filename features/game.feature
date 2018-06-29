Feature: Users can ask about all the games currently being played

    Scenario: User asks what games are being played
        Given a user {user1}
        And user {user1} plays {game1}
        When the user says what games do people play
        Then the bot responds with {game1}

    Scenario: No games are being played right now